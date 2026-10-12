"""The iPhone's local push channel, on a real socket, with no Home Assistant.

``local_push.py`` needs only aiohttp and the HMAC helpers, so it is loaded
for real into a throwaway package (the way ``test_widget_hmac.py`` loads the
validator) and served by a real aiohttp server on 127.0.0.1. A real aiohttp
client plays the phone. ``_deliver_push`` is pulled out of ``__init__.py`` by
``test_push_ops_inprocess._deliver_push_fn`` and run against the same
registry, so the send-first-then-relay path is checked end to end.

The wire contract under test is the one the app builds against
(``docs/local_push_plan_2026-10.md`` in the app repo): status codes before
the upgrade, the signed hello, ack, ping, and close codes 4001, 4002, 4003
and 1001.
"""

from __future__ import annotations
import __future__

import ast
import asyncio
import base64
import contextlib
import hashlib
import hmac
import importlib.util
import json
import secrets
import sys
import time
import types
from collections.abc import AsyncIterator
from pathlib import Path
from typing import Any

import aiohttp
import pytest
from aiohttp import web
from test_notification_tokens import _loaded_notifications
from test_push_ops_inprocess import (
    _deliver_push_fn,
    _Hass,
    _phone,
    _RelayClient,
    _watch,
)

_SRC = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_PKG = "wa_local_push_test_pkg"
URL_PATH = "/api/wrist_assistant/v2/push_channel"
HOME = "home-uuid-1"
PHONE = "p1"
PHONE_SECRET = b"p" * 32


# ── loading ──────────────────────────────────────────────────────────────


@contextlib.contextmanager
def _loaded_local_push():
    saved = dict(sys.modules)
    try:
        for name, attrs in (
            ("homeassistant", {}),
            ("homeassistant.core", {"HomeAssistant": type("HomeAssistant", (), {})}),
            ("homeassistant.helpers", {}),
            ("homeassistant.helpers.storage", {"Store": object}),
            ("homeassistant.util", {}),
            ("homeassistant.util.dt", {"parse_datetime": lambda v: None, "utcnow": lambda: None}),
        ):
            module = sys.modules.get(name) or types.ModuleType(name)
            for key, value in attrs.items():
                if not hasattr(module, key):
                    setattr(module, key, value)
            sys.modules[name] = module
        pkg = types.ModuleType(_PKG)
        pkg.__path__ = []
        sys.modules[_PKG] = pkg
        loaded = None
        for name in ("const", "widget_secret_store", "widget_hmac", "local_push"):
            spec = importlib.util.spec_from_file_location(f"{_PKG}.{name}", _SRC / f"{name}.py")
            loaded = importlib.util.module_from_spec(spec)
            sys.modules[f"{_PKG}.{name}"] = loaded
            spec.loader.exec_module(loaded)
        yield sys.modules[f"{_PKG}.local_push"], sys.modules[f"{_PKG}.widget_hmac"]
    finally:
        for key in list(sys.modules):
            if key not in saved:
                del sys.modules[key]
        sys.modules.update(saved)


@pytest.fixture(scope="module")
def mods():
    with _loaded_local_push() as loaded:
        yield loaded


# ── stand-ins ────────────────────────────────────────────────────────────


def _key(secret: bytes, kind: str = "iphone", user_id: str | None = "u1") -> Any:
    return types.SimpleNamespace(
        secret_bytes=secret,
        secret_b64=base64.b64encode(secret).decode(),
        algo="hmac-sha256",
        device_kind=kind,
        user_id=user_id,
    )


class _Keys:
    def __init__(self) -> None:
        self.entries: dict[str, Any] = {
            PHONE: _key(PHONE_SECRET),
            "p2": _key(b"q" * 32, user_id="u2"),
            "w1": _key(b"w" * 32, kind="watch"),
        }

    def get(self, device_id: str) -> Any:
        return self.entries.get(device_id)


def _headers(
    device_id: str = PHONE,
    secret: bytes = PHONE_SECRET,
    *,
    op: str = "push_channel",
    ts: int | None = None,
    nonce: str | None = None,
    sig: str | None = None,
) -> dict[str, str]:
    ts = int(time.time()) if ts is None else ts
    nonce = nonce or secrets.token_hex(16)
    canonical = f"v2|{op}|{device_id}|{ts}|{nonce}".encode() + b"\n"
    return {
        "X-WA-Version": "2",
        "X-WA-Op": op,
        "X-WA-Watch": device_id,
        "X-WA-Ts": str(ts),
        "X-WA-Nonce": nonce,
        "X-WA-Sig": sig or hmac.new(secret, canonical, hashlib.sha256).hexdigest(),
    }


class _Server:
    """One aiohttp app serving the channel, and what it was handed."""

    def __init__(self, mods: Any, *, recheck_interval: float = 300.0, ack_timeout: float = 0.3):
        self.lp, self.hmac = mods
        self.keys = _Keys()
        self.refused: dict[str, str] = {}
        self.registry = self.lp.LocalPushRegistry(ack_timeout=ack_timeout)
        self.nonces = self.hmac.WANonceCache(ttl_seconds=90)
        self.recheck_interval = recheck_interval
        self.rejected: list[str] = []
        self.url = ""

    async def _handler(self, request: web.Request) -> web.StreamResponse:
        async def _instance_id() -> str:
            return HOME

        async def _user_refusal(user_id: str | None) -> str | None:
            return self.refused.get(user_id or "")

        return await self.lp.async_open_push_channel(
            request,
            secret_store=self.keys,
            nonce_cache=self.nonces,
            registry=self.registry,
            instance_id=_instance_id,
            user_refusal=_user_refusal,
            on_rejected=self.rejected.append,
            recheck_interval=self.recheck_interval,
        )

    @contextlib.asynccontextmanager
    async def running(self) -> AsyncIterator[_Server]:
        app = web.Application()
        app.router.add_get(URL_PATH, self._handler)
        runner = web.AppRunner(app)
        await runner.setup()
        site = web.TCPSite(runner, "127.0.0.1", 0)
        await site.start()
        port = site._server.sockets[0].getsockname()[1]
        self.url = f"http://127.0.0.1:{port}{URL_PATH}"
        try:
            async with aiohttp.ClientSession() as session:
                self.session = session
                yield self
        finally:
            await self.registry.async_shutdown()
            await runner.cleanup()

    async def status(self, headers: dict[str, str]) -> int:
        """The status of an upgrade attempt that is refused before it."""
        try:
            ws = await self.session.ws_connect(self.url, headers=headers)
        except aiohttp.WSServerHandshakeError as err:
            return err.status
        await ws.close()
        return 101

    async def connect(self, headers: dict[str, str] | None = None) -> tuple[Any, dict]:
        ws = await self.session.ws_connect(self.url, headers=headers or _headers())
        hello = json.loads((await ws.receive(timeout=2)).data)
        return ws, hello


def _run(coro_fn, mods, **kwargs):
    async def _main():
        async with _Server(mods, **kwargs).running() as server:
            return await coro_fn(server)

    return asyncio.run(_main())


async def _close_code(ws: Any) -> int | None:
    """Read to the close frame and return its code."""
    while True:
        msg = await ws.receive(timeout=3)
        if msg.type in (aiohttp.WSMsgType.CLOSE, aiohttp.WSMsgType.CLOSED, aiohttp.WSMsgType.CLOSING):
            return ws.close_code if ws.close_code is not None else msg.data
        if msg.type == aiohttp.WSMsgType.ERROR:
            return None


async def _until(condition, timeout: float = 2.0) -> None:
    deadline = time.monotonic() + timeout
    while not condition():
        if time.monotonic() > deadline:
            raise AssertionError("condition not met in time")
        await asyncio.sleep(0.01)


# ── refusals before the upgrade ──────────────────────────────────────────


def test_a_bad_signature_is_401(mods) -> None:
    async def body(server):
        return await server.status(_headers(sig="0" * 64))

    assert _run(body, mods) == 401


def test_an_old_clock_is_401(mods) -> None:
    async def body(server):
        return await server.status(_headers(ts=int(time.time()) - 120))

    assert _run(body, mods) == 401


def test_a_reused_nonce_is_401(mods) -> None:
    async def body(server):
        headers = _headers()
        first = await server.status(headers)
        second = await server.status(headers)
        return first, second

    assert _run(body, mods) == (101, 401)


def test_an_unknown_or_revoked_key_is_401(mods) -> None:
    async def body(server):
        unknown = await server.status(_headers("nobody", b"n" * 32))
        del server.keys.entries[PHONE]
        revoked = await server.status(_headers())
        return unknown, revoked, server.rejected

    unknown, revoked, rejected = _run(body, mods)
    assert (unknown, revoked) == (401, 401)
    assert rejected == ["unknown_watch", "unknown_watch"]


def test_a_signature_for_another_op_is_401(mods) -> None:
    async def body(server):
        return await server.status(_headers(op="delta"))

    assert _run(body, mods) == 401


def test_a_watch_key_is_403(mods) -> None:
    async def body(server):
        return await server.status(_headers("w1", b"w" * 32))

    assert _run(body, mods) == 403


def test_a_refused_user_is_403(mods) -> None:
    async def body(server):
        server.refused["u1"] = "not_allowed"
        not_allowed = await server.status(_headers())
        server.refused["u1"] = "user_gone"
        gone = await server.status(_headers())
        return not_allowed, gone

    assert _run(body, mods) == (403, 403)


def test_a_refusal_opens_no_channel(mods) -> None:
    async def body(server):
        await server.status(_headers(sig="0" * 64))
        await server.status(_headers("w1", b"w" * 32))
        return server.registry.diagnostics()

    assert _run(body, mods) == {"channels_open": 0, "iphones": {}}


# ── the hello ────────────────────────────────────────────────────────────


def test_the_hello_is_signed_and_echoes_the_client_nonce(mods) -> None:
    _lp, widget_hmac = mods
    nonce = secrets.token_hex(16)

    async def body(server):
        ws, hello = await server.connect(_headers(nonce=nonce))
        await ws.close()
        return hello

    hello = _run(body, mods)
    assert set(hello) == {"type", "v", "instance_id", "server_time", "client_nonce", "sig"}
    assert (hello["type"], hello["v"], hello["instance_id"]) == ("hello", 1, HOME)
    assert hello["client_nonce"] == nonce
    assert abs(hello["server_time"] - time.time()) < 5
    # What the phone computes: the response canonical form, nonce "response".
    canonical = (
        f"v2|push_channel_hello|{PHONE}|{hello['server_time']}|response".encode()
        + b"\n"
        + f"{HOME}|{nonce}".encode()
    )
    assert hello["sig"] == hmac.new(PHONE_SECRET, canonical, hashlib.sha256).hexdigest()
    assert hello["sig"] == widget_hmac.sign_response(
        PHONE_SECRET,
        "push_channel_hello",
        PHONE,
        hello["server_time"],
        f"{HOME}|{nonce}".encode(),
    )


def test_a_ping_gets_its_pong(mods) -> None:
    async def body(server):
        ws, _hello = await server.connect()
        await ws.send_str(json.dumps({"type": "ping", "id": 7}))
        pong = json.loads((await ws.receive(timeout=2)).data)
        await ws.close()
        return pong

    assert _run(body, mods) == {"type": "pong", "id": 7}


# ── one channel per iPhone ───────────────────────────────────────────────


def test_a_newer_channel_replaces_the_older_with_4002(mods) -> None:
    async def body(server):
        old, _ = await server.connect()
        new, _ = await server.connect()
        code = await _close_code(old)
        live = server.registry.channel(PHONE)
        # The new one still works.
        await new.send_str(json.dumps({"type": "ping", "id": 1}))
        pong = json.loads((await new.receive(timeout=2)).data)
        await new.close()
        return code, live is not None, pong, server.registry.diagnostics()["iphones"][PHONE]

    code, live, pong, stats = _run(body, mods)
    assert code == 4002
    assert live
    assert pong == {"type": "pong", "id": 1}
    assert stats["last_close_reason"] in ("replaced", "client_closed")


def test_two_iphones_hold_a_channel_each(mods) -> None:
    async def body(server):
        a, _ = await server.connect()
        b, _ = await server.connect(_headers("p2", b"q" * 32))
        both = server.registry.is_connected(PHONE), server.registry.is_connected("p2")
        await a.close()
        await b.close()
        return both

    assert _run(body, mods) == (True, True)


def test_a_closed_channel_is_forgotten(mods) -> None:
    async def body(server):
        ws, _ = await server.connect()
        await _until(lambda: server.registry.is_connected(PHONE))
        await ws.close()
        await _until(lambda: not server.registry.is_connected(PHONE))
        return server.registry.diagnostics()["iphones"][PHONE]

    stats = _run(body, mods)
    assert stats["connected"] is False and stats["open_since"] is None
    assert (stats["last_close_reason"], stats["last_close_code"]) == ("client_closed", 1000)


# ── the five minute re-check ─────────────────────────────────────────────


def test_a_removed_key_closes_the_channel_with_4001(mods) -> None:
    async def body(server):
        ws, _ = await server.connect()
        del server.keys.entries[PHONE]
        code = await _close_code(ws)
        return code, server.registry.diagnostics()["iphones"][PHONE]

    code, stats = _run(body, mods, recheck_interval=0.05)
    assert code == 4001
    assert (stats["connected"], stats["last_close_reason"]) == (False, "revoked")


def test_a_refused_user_closes_the_channel_with_4001(mods) -> None:
    async def body(server):
        ws, _ = await server.connect()
        server.refused["u1"] = "not_allowed"
        return await _close_code(ws)

    assert _run(body, mods, recheck_interval=0.05) == 4001


def test_an_allowed_channel_stays_open_across_re_checks(mods) -> None:
    async def body(server):
        ws, _ = await server.connect()
        await asyncio.sleep(0.25)
        alive = server.registry.is_connected(PHONE) and not ws.closed
        await ws.close()
        return alive

    assert _run(body, mods, recheck_interval=0.05) is True


# ── shutdown ─────────────────────────────────────────────────────────────


def test_shutdown_closes_with_1001_and_takes_no_new_channel(mods) -> None:
    async def body(server):
        ws, _ = await server.connect()
        closing = asyncio.ensure_future(_close_code(ws))
        await server.registry.async_shutdown()
        code = await closing
        after = await server.status(_headers())
        return code, after

    assert _run(body, mods) == (1001, 503)


# ── delivering over the channel ──────────────────────────────────────────


async def _phone_that_acks(ws, seen: list, *, ack: bool = True, delay: float = 0.0):
    async for msg in ws:
        if msg.type != aiohttp.WSMsgType.TEXT:
            break
        frame = json.loads(msg.data)
        seen.append(frame)
        if frame["type"] == "alert" and ack:
            if delay:
                await asyncio.sleep(delay)
            # A late ack meets a channel the server has already closed.
            with contextlib.suppress(aiohttp.ClientConnectionResetError):
                await ws.send_str(json.dumps({"type": "ack", "push_id": frame["push_id"]}))


def test_an_acked_alert_is_local(mods) -> None:
    async def body(server):
        ws, _ = await server.connect()
        seen: list = []
        phone = asyncio.ensure_future(_phone_that_acks(ws, seen))
        await _until(lambda: server.registry.is_connected(PHONE))
        outcome = await server.registry.async_deliver(PHONE, "a" * 32, {"title": "t"})
        await ws.close()
        await phone
        return outcome, seen, server.registry.diagnostics()["iphones"][PHONE]

    outcome, seen, stats = _run(body, mods)
    assert outcome == "local"
    assert seen == [{"type": "alert", "push_id": "a" * 32, "payload": {"title": "t"}}]
    assert (stats["local_today"], stats["fell_back_today"]) == (1, 0)
    assert stats["last_local_push"] is not None


def test_a_missed_ack_falls_back_and_closes_with_4003(mods) -> None:
    async def body(server):
        ws, _ = await server.connect()
        await _until(lambda: server.registry.is_connected(PHONE))
        started = time.monotonic()
        outcome = await server.registry.async_deliver(PHONE, "b" * 32, {"title": "t"})
        waited = time.monotonic() - started
        code = await _close_code(ws)
        return outcome, waited, code, server.registry.diagnostics()["iphones"][PHONE]

    outcome, waited, code, stats = _run(body, mods, ack_timeout=0.2)
    assert outcome == "fell_back"
    assert 0.15 < waited < 1.0
    assert code == 4003
    assert (stats["connected"], stats["local_today"], stats["fell_back_today"]) == (False, 0, 1)
    assert stats["last_close_reason"] == "missed_ack"


def test_a_late_ack_still_falls_back(mods) -> None:
    async def body(server):
        ws, _ = await server.connect()
        seen: list = []
        phone = asyncio.ensure_future(_phone_that_acks(ws, seen, delay=0.4))
        await _until(lambda: server.registry.is_connected(PHONE))
        outcome = await server.registry.async_deliver(PHONE, "c" * 32, {})
        await phone
        stats = server.registry.diagnostics()["iphones"][PHONE]
        return outcome, stats["last_close_code"], stats["local_today"]

    assert _run(body, mods, ack_timeout=0.2) == ("fell_back", 4003, 0)


def test_no_channel_is_none(mods) -> None:
    async def body(server):
        return await server.registry.async_deliver(PHONE, "d" * 32, {})

    assert _run(body, mods) is None


def test_a_channel_that_drops_mid_send_falls_back_at_once(mods) -> None:
    async def body(server):
        ws, _ = await server.connect()
        await _until(lambda: server.registry.is_connected(PHONE))
        started = time.monotonic()
        sending = asyncio.ensure_future(server.registry.async_deliver(PHONE, "e" * 32, {}))
        await asyncio.sleep(0.05)
        await ws.close()
        outcome = await sending
        return outcome, time.monotonic() - started

    outcome, waited = _run(body, mods, ack_timeout=5.0)
    assert outcome == "fell_back"
    assert waited < 2.0


# ── _deliver_push: the channel first, the relay after ────────────────────


@pytest.fixture
def notif():
    with _loaded_notifications() as loaded:
        yield loaded


class _Deliver:
    """The real ``_deliver_push`` over the real token store and routing."""

    def __init__(self, notif: Any, server: _Server) -> None:
        self.tokens = notif.NotificationTokenStore(object())
        self.secrets = types.SimpleNamespace(
            all_entries={
                PHONE: _phone("u1"),
                "p2": _phone("u1"),
                "w1": _watch("u1", owner=PHONE),
            }
        )
        self.tokens.register(PHONE, "P1", platform="ios")
        self.tokens.register("w1", "W1", platform="watchos")
        self.relay = _RelayClient()
        self.sent_at: dict[str, float] = {}
        self.started = 0.0
        relay, sent_at = self.relay, self.sent_at
        original = relay.send_push

        async def _timed(**kwargs):
            sent_at[kwargs["watch_id"]] = time.monotonic() - self.started
            return await original(**kwargs)

        relay.send_push = _timed
        self.data = types.SimpleNamespace(
            apns_client=relay,
            notification_store=self.tokens,
            widget_secret_store=self.secrets,
            local_push=server.registry,
        )
        self.fn = _deliver_push_fn(notif)

    async def __call__(self, **kwargs: Any) -> dict:
        self.started = time.monotonic()
        return await self.fn(
            _Hass(), self.data, title=kwargs.pop("title", "t"), message="m", **kwargs
        )


def test_an_acked_alert_skips_the_relay(mods, notif) -> None:
    async def body(server):
        deliver = _Deliver(notif, server)
        ws, _ = await server.connect()
        seen: list = []
        phone = asyncio.ensure_future(_phone_that_acks(ws, seen))
        await _until(lambda: server.registry.is_connected(PHONE))
        result = await deliver(target_watch_ids=["w1"])
        await ws.close()
        await phone
        return result, deliver.relay.sends, seen

    result, sends, seen = _run(body, mods)
    assert result == {"sent": 1, "failed": 0, "failures": {}, "local": 1}
    assert sends == []
    (alert,) = seen
    assert alert["type"] == "alert" and len(alert["push_id"]) == 32
    payload = alert["payload"]
    # The same fields the relay would have got, and nothing else.
    assert set(payload) == {"title", "body", "category", "sound", "data"}
    assert (payload["title"], payload["body"], payload["category"], payload["sound"]) == (
        "t",
        "m",
        "WA_ACTIONS",
        "default",
    )
    assert payload["data"]["tag"] == alert["push_id"]
    assert payload["data"]["priority"] == "active"


def test_a_missed_ack_goes_through_the_relay_and_closes_4003(mods, notif) -> None:
    async def body(server):
        deliver = _Deliver(notif, server)
        ws, _ = await server.connect()
        await _until(lambda: server.registry.is_connected(PHONE))
        result = await deliver(target_watch_ids=["w1"])
        code = await _close_code(ws)
        return result, deliver.relay.sends, code, server.registry.diagnostics()

    result, sends, code, diag = _run(body, mods, ack_timeout=0.2)
    assert result == {"sent": 1, "failed": 0, "failures": {}, "local": 0}
    assert [(s["watch_id"], s["device_token"]) for s in sends] == [(PHONE, "P1")]
    assert code == 4003
    assert diag["iphones"][PHONE]["fell_back_today"] == 1


def test_a_late_ack_goes_through_the_relay_with_the_same_tag(mods, notif) -> None:
    async def body(server):
        deliver = _Deliver(notif, server)
        ws, _ = await server.connect()
        seen: list = []
        phone = asyncio.ensure_future(_phone_that_acks(ws, seen, delay=0.4))
        await _until(lambda: server.registry.is_connected(PHONE))
        result = await deliver(target_watch_ids=["w1"])
        await phone
        return result, deliver.relay.sends, seen

    result, sends, seen = _run(body, mods, ack_timeout=0.2)
    assert result["local"] == 0 and result["sent"] == 1
    (send,) = sends
    # Both copies carry one identifier, so iOS shows the alert once.
    assert send["data"]["tag"] == seen[0]["push_id"] == seen[0]["payload"]["data"]["tag"]


def test_no_channel_goes_through_the_relay(mods, notif) -> None:
    async def body(server):
        deliver = _Deliver(notif, server)
        result = await deliver(target_watch_ids=["w1"])
        return result, deliver.relay.sends

    result, sends = _run(body, mods)
    assert result == {"sent": 1, "failed": 0, "failures": {}, "local": 0}
    (send,) = sends
    assert send["watch_id"] == PHONE
    assert len(send["data"]["tag"]) == 32 and int(send["data"]["tag"], 16) >= 0


def test_a_caller_s_tag_is_kept(mods, notif) -> None:
    async def body(server):
        deliver = _Deliver(notif, server)
        await deliver(target_watch_ids=["w1"], extra_data={"tag": "front-door"})
        return deliver.relay.sends

    (send,) = _run(body, mods)
    assert send["data"]["tag"] == "front-door"


def test_each_send_gets_its_own_push_id(mods, notif) -> None:
    async def body(server):
        deliver = _Deliver(notif, server)
        await deliver(target_watch_ids=["w1"])
        await deliver(target_watch_ids=["w1"])
        return deliver.relay.sends

    first, second = _run(body, mods)
    assert first["data"]["tag"] != second["data"]["tag"]


def test_a_watch_route_never_uses_the_channel(mods, notif) -> None:
    """A Reliable watch is sent its own token; the phone's channel is idle."""

    async def body(server):
        deliver = _Deliver(notif, server)
        deliver.tokens.set_watch_metadata("w1", "delivery_mode", "direct")
        ws, _ = await server.connect()
        seen: list = []
        phone = asyncio.ensure_future(_phone_that_acks(ws, seen))
        await _until(lambda: server.registry.is_connected(PHONE))
        result = await deliver(target_watch_ids=["w1"])
        background = await deliver(target_watch_ids=["w1"], push_type="background")
        await ws.close()
        await phone
        return result, background, deliver.relay.sends, seen

    result, background, sends, seen = _run(body, mods)
    assert result["local"] == 0 and background["local"] == 0
    assert [s["watch_id"] for s in sends] == ["w1", "w1"]
    assert seen == []


def test_one_silent_channel_delays_no_other_route(mods, notif) -> None:
    """Two phones of one user: one holds a channel that never acks, the other
    has none. The second goes to the relay at once, not after the wait."""

    async def body(server):
        deliver = _Deliver(notif, server)
        deliver.tokens.register("p2", "P2", platform="ios")
        ws, _ = await server.connect()
        await _until(lambda: server.registry.is_connected(PHONE))
        started = time.monotonic()
        result = await deliver(target_watch_ids=["w1"])
        total = time.monotonic() - started
        await ws.close()
        return result, deliver.sent_at, total

    result, sent_at, total = _run(body, mods, ack_timeout=0.4)
    assert result == {"sent": 2, "failed": 0, "failures": {}, "local": 0}
    assert sent_at["p2"] < 0.2
    assert sent_at[PHONE] >= 0.35
    assert total < 1.5


def test_a_mixed_send_counts_local_and_relay(mods, notif) -> None:
    async def body(server):
        deliver = _Deliver(notif, server)
        deliver.tokens.register("p2", "P2", platform="ios")
        ws, _ = await server.connect()
        seen: list = []
        phone = asyncio.ensure_future(_phone_that_acks(ws, seen))
        await _until(lambda: server.registry.is_connected(PHONE))
        result = await deliver(target_watch_ids=["w1"])
        await ws.close()
        await phone
        return result, deliver.relay.sends

    result, sends = _run(body, mods)
    assert result == {"sent": 2, "failed": 0, "failures": {}, "local": 1}
    assert [s["watch_id"] for s in sends] == ["p2"]


# ── wiring ───────────────────────────────────────────────────────────────


def _setup_source() -> str:
    source = (_SRC / "__init__.py").read_text()
    tree = ast.parse(source)
    (setup,) = [
        node
        for node in tree.body
        if isinstance(node, ast.AsyncFunctionDef) and node.name == "async_setup_entry"
    ]
    return ast.get_source_segment(source, setup) or ""


def test_the_capability_is_advertised(mods) -> None:
    lp, _ = mods
    const = sys.modules[f"{_PKG}.const"]
    assert const.LOCAL_PUSH_CAPABILITY == "local_push"
    setup = _setup_source()
    assert "coordinator.register_capability(LOCAL_PUSH_CAPABILITY)" in setup
    assert "WAPushChannelView(hass, nonce_cache)" in setup
    assert lp.PUSH_CHANNEL_URL == "/api/wrist_assistant/v2/push_channel"


def test_the_contract_constants(mods) -> None:
    lp, _ = mods
    assert (lp.CLOSE_REVOKED, lp.CLOSE_REPLACED, lp.CLOSE_MISSED_ACK, lp.CLOSE_GOING_AWAY) == (
        4001,
        4002,
        4003,
        1001,
    )
    assert (lp.PUSH_CHANNEL_OP, lp.HELLO_OP) == ("push_channel", "push_channel_hello")
    assert lp.ACK_TIMEOUT_SECONDS == 2.0
    assert lp.RECHECK_INTERVAL_SECONDS == 300.0
    assert lp.HEARTBEAT_SECONDS == 25.0


def test_diagnostics_carry_no_secret(mods) -> None:
    async def body(server):
        ws, _ = await server.connect()
        await _until(lambda: server.registry.is_connected(PHONE))
        diag = server.registry.diagnostics()
        await ws.close()
        return diag

    diag = _run(body, mods)
    text = json.dumps(diag)
    assert base64.b64encode(PHONE_SECRET).decode() not in text
    assert set(diag["iphones"][PHONE]) == {
        "connected",
        "open_since",
        "local_today",
        "fell_back_today",
        "last_close_reason",
        "last_close_code",
        "last_close_at",
        "last_local_push",
    }
    assert diag["channels_open"] == 1


# ── the iPhone's sensor ──────────────────────────────────────────────────


class _SensorBase:
    """What ``_SecretStoreSensorBase`` gives the iPhone's sensor."""

    def __init__(self, secret_store, entry, watch_id, via_device, *, kind, hass=None) -> None:
        self._secret_store = secret_store
        self._watch_id = watch_id
        self.writes = 0
        self.removers: list = []

    async def async_added_to_hass(self) -> None:
        return None

    def async_on_remove(self, remover) -> None:
        self.removers.append(remover)

    def _handle_update(self) -> None:
        self.writes += 1


def _iphone_sensor_class() -> type:
    path = _SRC / "sensor.py"
    tree = ast.parse(path.read_text(), filename=str(path))
    (node,) = [
        n for n in tree.body if isinstance(n, ast.ClassDef) and n.name == "IPhoneAppVersionSensor"
    ]
    code = compile(
        ast.Module(body=[node], type_ignores=[]),
        str(path),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    namespace: dict[str, Any] = {"_SecretStoreSensorBase": _SensorBase, "DEVICE_KIND_IPHONE": "iphone"}
    exec(code, namespace)  # noqa: S102
    return namespace["IPhoneAppVersionSensor"]


def test_the_iphone_sensor_shows_the_channel(mods) -> None:
    sensor_class = _iphone_sensor_class()

    async def body(server):
        keys = types.SimpleNamespace(get=lambda _id: types.SimpleNamespace(app_version="3.1"))
        sensor = sensor_class(keys, None, PHONE, ("d", "e"), local_push=server.registry)
        await sensor.async_added_to_hass()
        before = dict(sensor.extra_state_attributes)
        ws, _ = await server.connect()
        seen: list = []
        phone = asyncio.ensure_future(_phone_that_acks(ws, seen))
        await _until(lambda: server.registry.is_connected(PHONE))
        await server.registry.async_deliver(PHONE, "f" * 32, {})
        during = dict(sensor.extra_state_attributes)
        await ws.close()
        await phone
        await _until(lambda: not server.registry.is_connected(PHONE))
        after = dict(sensor.extra_state_attributes)
        return sensor, before, during, after

    sensor, before, during, after = _run(body, mods)
    assert sensor.native_value == "3.1"
    assert before == {"local_push": "not connected", "last_local_push": None}
    assert during["local_push"] == "connected" and during["last_local_push"]
    assert after == {"local_push": "not connected", "last_local_push": during["last_local_push"]}
    # Open, the local alert and the close each wrote the state.
    assert sensor.writes >= 3
    assert "last_local_push" in sensor._unrecorded_attributes
