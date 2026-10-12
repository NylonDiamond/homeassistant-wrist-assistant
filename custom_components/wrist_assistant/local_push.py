"""Local push: alerts to an iPhone over a socket it holds open at home.

The iPhone's push provider extension (or the app itself, in direct mode)
opens ``GET /api/wrist_assistant/v2/push_channel`` while it is on a home
network and keeps it open. ``_deliver_push`` sends each visible alert for
that iPhone over the socket first and waits briefly for the phone to say it
posted the notification. No answer in time and the alert goes through the
relay as before, and the channel is closed so the phone notices and
reconnects. Silent pushes, watch routes and webhooks never come here.

The wire contract (shared with the app, ``docs/local_push_plan_2026-10.md``
in the app repo):

* Opening: the normal signed headers with ``X-WA-Op: push_channel`` over an
  empty body. Refused before the upgrade as plain HTTP: 401 for a bad
  signature, clock, nonce or an unknown key; 403 for a key that is not an
  iPhone's, or whose Home Assistant user may not act.
* Hello, the server's first frame:
  ``{"type": "hello", "v": 1, "instance_id", "server_time", "client_nonce",
  "sig"}``, with ``sig`` the response signature over
  ``f"{instance_id}|{client_nonce}"`` for op ``push_channel_hello`` at
  ``server_time``. The phone checks it, so a wrong host on the home network
  cannot feed it alerts.
* ``{"type": "alert", "push_id", "payload"}`` from the server, answered with
  ``{"type": "ack", "push_id"}`` once the phone has posted it.
* ``{"type": "ping", "id"}`` from the phone, answered ``{"type": "pong",
  "id"}``. aiohttp's own heartbeat runs underneath.
* Close codes: 4001 key revoked or user no longer allowed, 4002 replaced by
  a newer channel for the same iPhone, 4003 missed ack (the alert went
  through the relay), 1001 Home Assistant shutting down.

This module needs only aiohttp and the HMAC helpers, so the tests run it on
a real socket with no Home Assistant. The view in ``wa_v2_views.py`` hands
it the Home Assistant parts (the user check, the instance id).
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from datetime import date, datetime
from typing import Any

from aiohttp import WSMsgType, web

from .widget_hmac import WAHMACError, WANonceCache, sign_response, validate_wa_request

_LOGGER = logging.getLogger(__name__)

PUSH_CHANNEL_URL = "/api/wrist_assistant/v2/push_channel"
PUSH_CHANNEL_OP = "push_channel"
HELLO_OP = "push_channel_hello"
HELLO_VERSION = 1

CLOSE_REVOKED = 4001
CLOSE_REPLACED = 4002
CLOSE_MISSED_ACK = 4003
CLOSE_GOING_AWAY = 1001

# How long a send waits for the phone's ack before the relay takes over.
ACK_TIMEOUT_SECONDS = 2.0
# How often a channel checks that its key and its user are still allowed.
RECHECK_INTERVAL_SECONDS = 300.0
HEARTBEAT_SECONDS = 25.0
# The longest an unload or a stop waits for the phones to answer the close.
SHUTDOWN_CLOSE_SECONDS = 3.0
# The phone only ever sends acks and pings, a few dozen bytes each.
MAX_CLIENT_FRAME_BYTES = 16 * 1024

# What `LocalPushRegistry.async_deliver` reports.
DELIVERED_LOCAL = "local"
FELL_BACK = "fell_back"

# Close reasons, as diagnostics shows them.
REASON_REPLACED = "replaced"
REASON_MISSED_ACK = "missed_ack"
REASON_REVOKED = "revoked"
REASON_SHUTDOWN = "shutdown"
REASON_CLIENT_CLOSED = "client_closed"
REASON_CONNECTION_LOST = "connection_lost"

_IPHONE_KIND = "iphone"


def _dumps(obj: Any) -> str:
    return json.dumps(obj, separators=(",", ":"), default=str)


def _local_now() -> datetime:
    return datetime.now().astimezone()


class PushChannel:
    """One open socket to one iPhone."""

    def __init__(self, iphone_id: str, ws: web.WebSocketResponse, opened_at: datetime) -> None:
        self.iphone_id = iphone_id
        self.ws = ws
        self.opened_at = opened_at
        self.close_code: int | None = None
        self.close_reason: str | None = None
        self._pending: dict[str, asyncio.Future[bool]] = {}
        self._send_lock = asyncio.Lock()
        self._detached = False

    @property
    def closing(self) -> bool:
        """Whether the server has decided to close this channel."""
        return self.close_code is not None or self.ws.closed

    async def send_json(self, frame: dict[str, Any]) -> None:
        async with self._send_lock:
            await self.ws.send_str(_dumps(frame))

    async def send_alert(self, push_id: str, payload: dict[str, Any], timeout: float) -> bool:
        """Send one alert and wait for its ack. False on no ack in time, a
        closed channel or a send error."""
        if self.closing:
            return False
        future: asyncio.Future[bool] = asyncio.get_running_loop().create_future()
        self._pending[push_id] = future

        async def _send_and_wait() -> bool:
            await self.send_json({"type": "alert", "push_id": push_id, "payload": payload})
            return await future

        try:
            return await asyncio.wait_for(_send_and_wait(), timeout)
        except TimeoutError:
            _LOGGER.debug("Local push %s to %s: no ack in %.1fs", push_id, self.iphone_id, timeout)
            return False
        except Exception as err:  # noqa: BLE001 (any send error means the relay)
            _LOGGER.debug("Local push %s to %s failed: %s", push_id, self.iphone_id, err)
            return False
        finally:
            self._pending.pop(push_id, None)

    def ack(self, push_id: Any) -> None:
        if not isinstance(push_id, str):
            return
        future = self._pending.get(push_id)
        if future is not None and not future.done():
            future.set_result(True)

    def mark_closing(self, code: int, reason: str) -> None:
        """Stop taking alerts, and let every waiting send fall back now."""
        if self.close_code is None:
            self.close_code = code
            self.close_reason = reason
        for future in self._pending.values():
            if not future.done():
                future.set_result(False)

    async def async_close(self) -> None:
        code = self.close_code or CLOSE_GOING_AWAY
        try:
            await self.ws.close(code=code, message=(self.close_reason or "").encode())
        except Exception as err:  # noqa: BLE001 (a dead socket is already closed)
            _LOGGER.debug("Closing the push channel of %s: %s", self.iphone_id, err)


@dataclass
class _PhoneStats:
    """What diagnostics and the iPhone's sensor say about one iPhone."""

    day: date
    open_since: datetime | None = None
    local_today: int = 0
    fell_back_today: int = 0
    last_close_reason: str | None = None
    last_close_code: int | None = None
    last_close_at: datetime | None = None
    last_local_push: datetime | None = None

    def roll(self, today: date) -> None:
        if today != self.day:
            self.day = today
            self.local_today = 0
            self.fell_back_today = 0


class LocalPushRegistry:
    """The live channels, one per iPhone, and their numbers for the day.

    Memory only: a restart drops every channel and the phones reconnect.
    """

    def __init__(
        self,
        *,
        now: Callable[[], datetime] = _local_now,
        ack_timeout: float = ACK_TIMEOUT_SECONDS,
    ) -> None:
        self._now = now
        self.ack_timeout = ack_timeout
        self._channels: dict[str, PushChannel] = {}
        self._stats: dict[str, _PhoneStats] = {}
        self._listeners: list[Callable[[], None]] = []
        self._closing_tasks: set[asyncio.Task[None]] = set()
        self._shut_down = False

    # ── listeners ────────────────────────────────────────────────────────

    def async_add_listener(self, listener: Callable[[], None]) -> Callable[[], None]:
        """Call ``listener`` whenever a channel opens or closes or an alert
        goes local. Returns the unsubscribe."""
        self._listeners.append(listener)

        def _remove() -> None:
            if listener in self._listeners:
                self._listeners.remove(listener)

        return _remove

    def _notify(self) -> None:
        for listener in list(self._listeners):
            try:
                listener()
            except Exception:
                _LOGGER.exception("Local push listener failed")

    # ── channels ─────────────────────────────────────────────────────────

    def _stats_for(self, iphone_id: str) -> _PhoneStats:
        today = self._now().date()
        stats = self._stats.get(iphone_id)
        if stats is None:
            stats = self._stats[iphone_id] = _PhoneStats(day=today)
        else:
            stats.roll(today)
        return stats

    @property
    def shut_down(self) -> bool:
        return self._shut_down

    def channel(self, iphone_id: str) -> PushChannel | None:
        channel = self._channels.get(iphone_id)
        if channel is None or channel.closing:
            return None
        return channel

    def is_connected(self, iphone_id: str) -> bool:
        return self.channel(iphone_id) is not None

    def last_local_push(self, iphone_id: str) -> datetime | None:
        stats = self._stats.get(iphone_id)
        return stats.last_local_push if stats is not None else None

    def attach(self, channel: PushChannel) -> bool:
        """Make ``channel`` the iPhone's live channel, closing an older one
        with 4002. False once the registry is shut down."""
        if self._shut_down:
            return False
        old = self._channels.get(channel.iphone_id)
        self._channels[channel.iphone_id] = channel
        self._stats_for(channel.iphone_id).open_since = channel.opened_at
        if old is not None and old is not channel:
            self._close_soon(old, CLOSE_REPLACED, REASON_REPLACED)
        self._notify()
        return True

    def detach(self, channel: PushChannel, reason: str, code: int | None) -> None:
        """Forget a channel that closed, once."""
        if channel._detached:
            return
        channel._detached = True
        stats = self._stats_for(channel.iphone_id)
        stats.last_close_reason = reason
        stats.last_close_code = code
        stats.last_close_at = self._now()
        if self._channels.get(channel.iphone_id) is channel:
            del self._channels[channel.iphone_id]
            stats.open_since = None
        self._notify()

    def _close_soon(self, channel: PushChannel, code: int, reason: str) -> None:
        """Close in the background: a send must not wait for the phone's
        close reply before it goes to the relay."""
        channel.mark_closing(code, reason)
        self.detach(channel, reason, code)
        task = asyncio.get_running_loop().create_task(channel.async_close())
        self._closing_tasks.add(task)
        task.add_done_callback(self._closing_tasks.discard)

    async def async_close_channel(self, channel: PushChannel, code: int, reason: str) -> None:
        channel.mark_closing(code, reason)
        self.detach(channel, reason, code)
        await channel.async_close()

    async def async_shutdown(self) -> None:
        """Close every channel with 1001 and take no new ones."""
        self._shut_down = True
        channels = list(self._channels.values())
        for channel in channels:
            channel.mark_closing(CLOSE_GOING_AWAY, REASON_SHUTDOWN)
            self.detach(channel, REASON_SHUTDOWN, CLOSE_GOING_AWAY)
        closes = [
            asyncio.ensure_future(channel.async_close()) for channel in channels
        ] + list(self._closing_tasks)
        if closes:
            # A phone that never answers the close must not hold an unload
            # or Home Assistant's stop for aiohttp's full close timeout.
            _done, pending = await asyncio.wait(closes, timeout=SHUTDOWN_CLOSE_SECONDS)
            for task in pending:
                task.cancel()

    # ── sending ──────────────────────────────────────────────────────────

    async def async_deliver(
        self, iphone_id: str, push_id: str, payload: dict[str, Any]
    ) -> str | None:
        """Send one alert over the iPhone's channel.

        ``DELIVERED_LOCAL`` when the phone acked it in time. ``FELL_BACK``
        when it did not (the channel is then closed with 4003 and the caller
        sends through the relay). None when there is no live channel.
        """
        channel = self.channel(iphone_id)
        if channel is None:
            return None
        acked = await channel.send_alert(push_id, payload, self.ack_timeout)
        stats = self._stats_for(iphone_id)
        if acked:
            stats.local_today += 1
            stats.last_local_push = self._now()
            self._notify()
            return DELIVERED_LOCAL
        stats.fell_back_today += 1
        if channel.close_code is None:
            self._close_soon(channel, CLOSE_MISSED_ACK, REASON_MISSED_ACK)
        else:
            self._notify()
        return FELL_BACK

    # ── diagnostics ──────────────────────────────────────────────────────

    def diagnostics(self) -> dict[str, Any]:
        """Per iPhone: open since, today's local and fell-back counts, the
        last close and the last local push. No secrets, no tokens."""
        phones: dict[str, Any] = {}
        for iphone_id in sorted(self._stats):
            stats = self._stats_for(iphone_id)
            phones[iphone_id] = {
                "connected": self.is_connected(iphone_id),
                "open_since": stats.open_since.isoformat() if stats.open_since else None,
                "local_today": stats.local_today,
                "fell_back_today": stats.fell_back_today,
                "last_close_reason": stats.last_close_reason,
                "last_close_code": stats.last_close_code,
                "last_close_at": stats.last_close_at.isoformat() if stats.last_close_at else None,
                "last_local_push": (
                    stats.last_local_push.isoformat() if stats.last_local_push else None
                ),
            }
        return {"channels_open": len(self._channels), "iphones": phones}


# ── the channel endpoint ─────────────────────────────────────────────────


def _refused(status: int) -> web.Response:
    return web.Response(status=status, text="Unauthorized" if status == 401 else "Forbidden")


async def async_open_push_channel(
    request: web.Request,
    *,
    secret_store: Any,
    nonce_cache: WANonceCache,
    registry: LocalPushRegistry,
    instance_id: Callable[[], Awaitable[str | None]],
    user_refusal: Callable[[str | None], Awaitable[str | None]],
    on_rejected: Callable[[str], None] | None = None,
    on_signed: Callable[[str, str], None] | None = None,
    recheck_interval: float = RECHECK_INTERVAL_SECONDS,
    heartbeat: float = HEARTBEAT_SECONDS,
) -> web.StreamResponse:
    """Check the signed upgrade request, then run the channel until it closes.

    ``user_refusal(user_id)`` is why the key's bound user may not act on
    this request, or None (``_async_bound_user_refusal``). ``on_rejected``
    hears the reason for a bad signature, ``on_signed`` the id and secret
    of a good one (the pairing store's ``note_signed_use``).
    """
    # The contract's body is empty; anything big is not a phone.
    if (request.content_length or 0) > MAX_CLIENT_FRAME_BYTES:
        return web.Response(status=413, text="Request body too large")
    body = await request.read()
    try:
        validated = validate_wa_request(request, body, secret_store, nonce_cache)
    except WAHMACError as err:
        _LOGGER.debug("WA HMAC rejected (v2/push_channel): %s", err.reason)
        if on_rejected is not None:
            on_rejected(err.reason)
        return _refused(401)
    if validated.op != PUSH_CHANNEL_OP:
        _LOGGER.debug("WA push channel refused: signed for op %s", validated.op)
        return _refused(401)

    iphone_id = validated.watch_id
    entry = secret_store.get(iphone_id)
    if entry is None or entry.secret_bytes is None:
        return _refused(401)
    if on_signed is not None:
        on_signed(iphone_id, entry.secret_b64)
    if getattr(entry, "device_kind", None) != _IPHONE_KIND:
        _LOGGER.debug("WA push channel refused: %s is not an iPhone key", iphone_id)
        return _refused(403)
    refusal = await user_refusal(entry.user_id)
    if refusal is not None:
        _LOGGER.debug("WA push channel refused for %s: bound user %s", iphone_id, refusal)
        return _refused(403)
    if registry.shut_down:
        return web.Response(status=503, text="Shutting down")

    ws = web.WebSocketResponse(heartbeat=heartbeat, max_msg_size=MAX_CLIENT_FRAME_BYTES)
    if not ws.can_prepare(request).ok:
        return web.Response(status=400, text="Expected a WebSocket upgrade")

    home_id = await instance_id() or ""
    client_nonce = request.headers.get("X-WA-Nonce", "")
    await ws.prepare(request)

    server_time = int(time.time())
    sig = sign_response(
        entry.secret_bytes,
        HELLO_OP,
        iphone_id,
        server_time,
        f"{home_id}|{client_nonce}".encode(),
        version=validated.version,
        algo=validated.algo,
    )
    channel = PushChannel(iphone_id, ws, registry._now())
    try:
        await channel.send_json(
            {
                "type": "hello",
                "v": HELLO_VERSION,
                "instance_id": home_id,
                "server_time": server_time,
                "client_nonce": client_nonce,
                "sig": sig,
            }
        )
    except Exception as err:  # noqa: BLE001 (the phone went away mid-upgrade)
        _LOGGER.debug("Push channel hello to %s failed: %s", iphone_id, err)
        await ws.close()
        return ws
    if not registry.attach(channel):
        await ws.close(code=CLOSE_GOING_AWAY, message=REASON_SHUTDOWN.encode())
        return ws
    _LOGGER.debug("Push channel open for %s", iphone_id)

    async def _still_allowed() -> bool:
        current = secret_store.get(iphone_id)
        if current is None or current.secret_bytes is None:
            return False
        if getattr(current, "device_kind", None) != _IPHONE_KIND:
            return False
        return await user_refusal(current.user_id) is None

    async def _recheck() -> None:
        while True:
            await asyncio.sleep(recheck_interval)
            try:
                allowed = await _still_allowed()
            except Exception:
                _LOGGER.exception("Push channel re-check for %s failed", iphone_id)
                continue
            if not allowed:
                _LOGGER.info(
                    "Closed the push channel of %s: its key was removed or its "
                    "user may no longer act",
                    iphone_id,
                )
                await registry.async_close_channel(channel, CLOSE_REVOKED, REASON_REVOKED)
                return

    recheck = asyncio.get_running_loop().create_task(_recheck())
    try:
        async for msg in ws:
            if msg.type != WSMsgType.TEXT:
                continue
            try:
                frame = json.loads(msg.data)
            except ValueError:
                continue
            if not isinstance(frame, dict):
                continue
            kind = frame.get("type")
            if kind == "ack":
                channel.ack(frame.get("push_id"))
            elif kind == "ping":
                try:
                    await channel.send_json({"type": "pong", "id": frame.get("id")})
                except Exception as err:  # noqa: BLE001 (the read loop sees the close)
                    _LOGGER.debug("Pong to %s failed: %s", iphone_id, err)
    finally:
        recheck.cancel()
        if channel.close_code is not None:
            reason, code = channel.close_reason or REASON_CLIENT_CLOSED, channel.close_code
        elif ws.close_code in (None, 1006):
            reason, code = REASON_CONNECTION_LOST, ws.close_code
        else:
            reason, code = REASON_CLIENT_CLOSED, ws.close_code
        channel.mark_closing(code or CLOSE_GOING_AWAY, reason)
        registry.detach(channel, reason, code)
        _LOGGER.debug("Push channel closed for %s: %s (%s)", iphone_id, reason, code)
    return ws
