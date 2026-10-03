"""``/v2/pair/start`` with no Home Assistant.

``WAPairStartView`` is pulled out of ``wa_v2_views.py`` by name, beside
``WARegisterSecretView``, the way ``test_widget_secret_user_binding.py`` does
it, and run over a real ``WidgetSecretStore`` and a real ``PairRequestStore``.
The device registry and the Logbook helpers raise if touched. Pinned:

* the reply shape (code, ``expires_in`` 600, ``poll_after`` 3);
* the request is only stored: the secret store, the device registry and the
  Logbook are never touched;
* every refusal matches ``register_secret`` for the same body, status and
  text, since both go through one validator;
* 429 ``too_many_pending`` when the store is full or one address already
  holds four requests, 503 while not loaded; the address is stored;
* ``WAActionView``'s refused-signature path writes no Logbook row for a
  known watch while it has a code pending (it is polling with its new pair),
  checked against the real ``log_hmac_failure``.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import base64
import logging
import types
from typing import Any

import pytest

from test_pair_requests import loaded_pair_module
from test_widget_secret_user_binding import (
    _PKG,
    _SRC,
    ALICE,
    _load,
    _loaded_store,
    _Request,
    _Response,
    _stub,
    _View,
)

DOMAIN = "wrist_assistant"
SECRET = base64.b64encode(b"p" * 32).decode()
OLD_SECRET = base64.b64encode(b"o" * 32).decode()
REMOTE = "192.0.2.10"


class _HMACError(Exception):
    def __init__(self, reason: str) -> None:
        super().__init__(reason)
        self.reason = reason


def _refuse_signature(*_args: Any, **_kwargs: Any) -> Any:
    """Every signed request fails the way a watch polling with a secret Home
    Assistant does not hold yet fails."""
    raise _HMACError("bad_signature")


class _SignedRequest:
    """What the action view reads before the signature check refuses it."""

    def __init__(self, watch_id: str) -> None:
        self.headers = {"X-WA-Watch": watch_id}

    async def read(self) -> bytes:
        return b"{}"


def _loaded_logbook_events(rows: list) -> Any:
    """The real ``logbook_events`` with the Logbook and the device registry
    stubbed; every row it would write lands in ``rows``."""
    _stub("homeassistant.components")
    _stub(
        "homeassistant.components.logbook",
        async_log_entry=lambda _hass, name, message, domain, entity_id=None: rows.append(
            (name, message, domain, entity_id)
        ),
    )
    _stub(
        "homeassistant.helpers.device_registry",
        async_get=lambda _hass: types.SimpleNamespace(async_get_device=lambda **_: None),
    )
    _stub(f"{_PKG}.const", DOMAIN=DOMAIN)
    return _load("logbook_events")


def _untouchable(name: str):
    def _fail(*_args: Any, **_kwargs: Any) -> Any:
        raise AssertionError(f"pair/start touched {name}")

    return _fail


def _view_classes(pair_mod, log_hmac_failure) -> dict[str, type]:
    path = _SRC / "wa_v2_views.py"
    tree = ast.parse(path.read_text(), filename=str(path))
    names = {
        "WAPairStartView",
        "WARegisterSecretView",
        "WAActionView",
        "_log_signed_request_rejected",
    }
    wanted = [
        node
        for node in tree.body
        if isinstance(node, ast.ClassDef | ast.FunctionDef) and node.name in names
    ]
    assert sorted(node.name for node in wanted) == sorted(names)
    code = compile(
        ast.Module(body=wanted, type_ignores=[]),
        str(path),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    namespace: dict[str, Any] = {
        "Any": Any,
        "Response": _Response,
        "HomeAssistantView": _View,
        "DOMAIN": DOMAIN,
        "WA_PROTOCOL_VERSION": 2,
        "_LOGGER": logging.getLogger("test_pair_start_view"),
        "validate_pair_fields": pair_mod.validate_pair_fields,
        "PAIR_START_FIELDS": pair_mod.PAIR_START_FIELDS,
        "PAIR_POLL_AFTER_SECONDS": pair_mod.PAIR_POLL_AFTER_SECONDS,
        "log_secret_registered": _untouchable("the Logbook"),
        "log_secret_reprovisioned": _untouchable("the Logbook"),
        "dr": types.SimpleNamespace(async_get=_untouchable("the device registry")),
        "WAHMACError": _HMACError,
        "validate_wa_request": _refuse_signature,
        "log_hmac_failure": log_hmac_failure,
    }
    exec(code, namespace)  # noqa: S102
    return {name: namespace[name] for name in names}


@pytest.fixture
def env():
    with _loaded_store() as store_mod, loaded_pair_module() as pair_mod:
        logbook_rows: list = []
        logbook_mod = _loaded_logbook_events(logbook_rows)
        secret_store = store_mod.WidgetSecretStore(object())
        asyncio.run(secret_store.async_load())
        clock = types.SimpleNamespace(now=5_000.0)
        pair_store = pair_mod.PairRequestStore(clock=lambda: clock.now)
        hass = types.SimpleNamespace(
            data={
                DOMAIN: types.SimpleNamespace(
                    widget_secret_store=secret_store, pair_request_store=pair_store
                )
            }
        )
        classes = _view_classes(pair_mod, logbook_mod.log_hmac_failure)
        yield types.SimpleNamespace(
            hass=hass,
            secret_store=secret_store,
            pair_store=pair_store,
            pair_mod=pair_mod,
            clock=clock,
            logbook_rows=logbook_rows,
            start=classes["WAPairStartView"](hass),
            register=classes["WARegisterSecretView"](hass),
            action=classes["WAActionView"](hass, None),
        )


def _body(**overrides: Any) -> dict:
    body = {
        "watch_id": "watch-code-1",
        "secret_b64": SECRET,
        "device_name": "Test Watch",
        "screen_size": "208x248",
        "app_version": "3.0.1",
        "app_build": "2",
    }
    body.update(overrides)
    return {key: value for key, value in body.items() if value is not None}


def _start(env, body: dict, remote: str | None = REMOTE) -> _Response:
    return asyncio.run(env.start.post(_Request(body, None, remote=remote)))


def _assert_nothing_written(env) -> None:
    assert env.secret_store.all_watch_ids == []
    assert env.secret_store._store.saved is None


# ── the reply ────────────────────────────────────────────────────────────


def test_a_start_returns_a_code_and_stores_only_the_request(env) -> None:
    reply = _start(env, _body())
    assert reply.status == 200, reply.body
    assert set(reply.body) == {"ok", "code", "expires_in", "poll_after"}
    assert reply.body["ok"] is True
    assert reply.body["expires_in"] == 600
    assert reply.body["poll_after"] == 3
    code = reply.body["code"]
    assert len(code) == 6 and set(code) <= set(env.pair_mod.PAIR_CODE_ALPHABET)

    pending = env.pair_store.get(code)
    assert pending.watch_id == "watch-code-1"
    assert pending.fields.secret_b64 == SECRET
    assert pending.fields.device_name == "Test Watch"
    assert pending.fields.app_version == "3.0.1"
    assert pending.fields.app_build == "2"
    assert pending.remote == REMOTE
    assert pending.created_at == env.clock.now
    _assert_nothing_written(env)


def test_a_label_and_an_owner_in_the_body_are_ignored(env) -> None:
    reply = _start(env, _body(label="iphone-self-provision", owner_iphone_id="iphone-x"))
    assert reply.status == 200, reply.body
    fields = env.pair_store.get(reply.body["code"]).fields
    assert fields.label is None
    assert fields.owner_iphone_id is None


def test_a_second_start_replaces_the_first_code(env) -> None:
    first = _start(env, _body()).body["code"]
    second = _start(env, _body()).body["code"]
    assert len(env.pair_store) == 1
    assert env.pair_store.get(second) is not None
    if first != second:
        assert env.pair_store.get(first) is None


# ── refusals ─────────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    "overrides",
    [
        {"watch_id": None},
        {"watch_id": "library"},
        {"watch_id": "w" * 129},
        {"device_name": "n" * 257},
        {"screen_size": "s" * 257},
        {"app_version": "v" * 257},
        {"app_build": "b" * 257},
        {"secret_b64": None},
        {"secret_b64": "not base64!"},
        {"secret_b64": base64.b64encode(b"short").decode()},
        {"algo": "hmac-md5"},
    ],
)
def test_each_refusal_matches_register_secret(env, overrides) -> None:
    body = _body(**overrides)
    started = _start(env, body)
    registered = asyncio.run(env.register.post(_Request(body, ALICE)))
    assert started.status == 400
    assert (started.status, started.body) == (registered.status, registered.body)
    assert len(env.pair_store) == 0
    _assert_nothing_written(env)


def test_a_body_that_is_not_an_object_is_refused(env) -> None:
    reply = _start(env, ["watch-code-1"])  # type: ignore[arg-type]
    assert reply.status == 400
    assert reply.body == {"message": "Expected JSON object body"}


def test_bad_json_is_refused(env) -> None:
    class _BadJSON(_Request):
        async def json(self) -> dict:
            raise ValueError("bad json")

    reply = asyncio.run(env.start.post(_BadJSON({}, None)))
    assert reply.status == 400
    assert reply.body == {"message": "Invalid JSON body"}


def test_a_full_store_answers_429(env) -> None:
    for index in range(env.pair_mod.PairRequestStore._MAX_ENTRIES):
        reply = _start(env, _body(watch_id=f"watch-{index}"), remote=f"10.0.{index}.1")
        assert reply.status == 200
    reply = _start(env, _body(watch_id="one-too-many"), remote="10.1.0.1")
    assert reply.status == 429
    assert reply.body == {"ok": False, "error": "too_many_pending"}
    _assert_nothing_written(env)


def test_one_address_past_four_requests_answers_429(env) -> None:
    for index in range(4):
        assert _start(env, _body(watch_id=f"watch-{index}")).status == 200
    reply = _start(env, _body(watch_id="fifth"))
    assert reply.status == 429
    assert reply.body == {"ok": False, "error": "too_many_pending"}
    assert len(env.pair_store) == 4

    # The same watch asking again from that address still gets a code.
    assert _start(env, _body(watch_id="watch-0")).status == 200
    assert len(env.pair_store) == 4
    # And another address is not held back by it.
    assert _start(env, _body(watch_id="fifth"), remote="192.0.2.11").status == 200
    _assert_nothing_written(env)


def test_503_while_the_integration_is_not_loaded(env) -> None:
    env.hass.data.clear()
    reply = _start(env, _body())
    assert reply.status == 503
    assert reply.body == {"message": "Integration not loaded"}

    env.hass.data[DOMAIN] = types.SimpleNamespace(widget_secret_store=env.secret_store)
    assert _start(env, _body()).status == 503


# ── a known watch polling with its new pair ──────────────────────────────


def _refused_action(env, watch_id: str) -> _Response:
    return asyncio.run(env.action.post(_SignedRequest(watch_id)))


def test_a_known_watch_s_refused_signature_is_logged(env) -> None:
    env.secret_store.register("watch-code-1", OLD_SECRET, "watch-self-provision")
    reply = _refused_action(env, "watch-code-1")
    assert reply.status == 401
    assert len(env.logbook_rows) == 1
    assert "bad_signature" in env.logbook_rows[0][1]


def test_no_logbook_row_while_the_watch_has_a_code_pending(env) -> None:
    env.secret_store.register("watch-code-1", OLD_SECRET, "watch-self-provision")
    assert _start(env, _body()).status == 200

    for _ in range(5):
        assert _refused_action(env, "watch-code-1").status == 401
    assert env.logbook_rows == []

    # Another known watch with no code pending is still logged.
    env.secret_store.register("watch-other", OLD_SECRET, "watch-self-provision")
    _refused_action(env, "watch-other")
    assert len(env.logbook_rows) == 1

    # Once the request expires the watch's failures are logged again.
    env.clock.now += 600
    _refused_action(env, "watch-code-1")
    assert len(env.logbook_rows) == 2
