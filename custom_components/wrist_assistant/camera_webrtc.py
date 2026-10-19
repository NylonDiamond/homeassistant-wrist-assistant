"""WebRTC signaling for the iPhone's live camera tiles.

The iPhone holds no Home Assistant token, so it cannot use the core
`camera/webrtc/*` websocket commands that the frontend and the Companion app
use. These ops carry the same exchange over the signed /v2/action transport
and hand it to the camera the way core's websocket handler does
(`camera.async_handle_async_webrtc_offer`). The video never passes through
here: once the offer and the answer are swapped, the phone and the camera's
WebRTC provider (go2rtc, built into Home Assistant since 2024.11, or a
camera's own WebRTC such as Nest) talk to each other directly.

A tile waits on every step, so the exchange is cut to one round trip:

* `webrtc_offer` returns the moment the answer lands, with whatever server
  candidates came with it. The phone's own candidates ride inside the offer,
  so the server can reach the phone before the phone has heard a single
  server candidate: the phone learns the server's address from its first
  connectivity check.
* Later candidates, both ways, ride `webrtc_candidates`, which the phone
  calls only while its connection is still being set up.
* A session lives while the phone keeps it: `webrtc_keepalive` every 15 s,
  `webrtc_close` when the tile goes away, and a sweep closes any the phone
  forgot (an app killed mid-stream) after `SESSION_IDLE_SECONDS`.

The ops themselves are in wa_v2_views.py. Nothing here imports Home Assistant
at module level, so the store can be tested without an install.
"""

from __future__ import annotations

import asyncio
import logging
import time
import uuid
from collections.abc import Callable
from dataclasses import dataclass, field
from typing import Any

_LOGGER = logging.getLogger(__name__)

# How long an offer waits for the camera's answer. go2rtc answers after it has
# the camera's tracks, which means after it has connected to the camera when
# nothing else is watching it; a slow camera takes a few seconds for that.
ANSWER_TIMEOUT_SECONDS = 10.0
# How long the offer reply waits for the first server candidate when the
# answer arrived without one. Short on purpose: the phone does not need it to
# connect (see the module docstring), it only saves a later poll.
CANDIDATE_GRACE_SECONDS = 0.03
# A session the phone has not touched for this long is closed.
SESSION_IDLE_SECONDS = 45.0
SWEEP_SECONDS = 15.0
# One phone, one session per camera it streams. A wall of ten tiles, the full
# screen view and a margin for sessions still closing.
MAX_SESSIONS_PER_DEVICE = 32
MAX_CANDIDATES_PER_CALL = 32
MAX_PENDING_CANDIDATES = 64
MAX_OFFER_BYTES = 64 * 1024
# What webrtc_cameras answers for at once.
MAX_CAMERAS_PER_CALL = 32


class WebRTCOfferError(Exception):
    """An offer that did not end in an answer. `code` is what the phone reads."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code
        self.message = message


def webrtc_api_available() -> bool:
    """Whether this Home Assistant has the async WebRTC camera API (2024.11+)."""
    try:
        from homeassistant.components.camera import Camera
    except ImportError:
        return False
    return all(
        hasattr(Camera, name)
        for name in (
            "async_handle_async_webrtc_offer",
            "async_on_webrtc_candidate",
            "close_webrtc_session",
            "camera_capabilities",
            "async_get_webrtc_client_configuration",
        )
    )


def get_camera(hass: Any, entity_id: str) -> Any:
    """The camera entity behind `entity_id`. Raises HomeAssistantError when it
    is missing or off, as core's websocket commands do."""
    from homeassistant.components.camera.helper import get_camera_from_entity_id

    return get_camera_from_entity_id(hass, entity_id)


def camera_supports_webrtc(camera: Any) -> bool:
    """Whether the camera offers a WebRTC stream, by the same test core's
    `require_webrtc_support` makes."""
    capabilities = getattr(camera, "camera_capabilities", None)
    stream_types = getattr(capabilities, "frontend_stream_types", None) or ()
    return any(getattr(kind, "value", kind) == "web_rtc" for kind in stream_types)


def client_configuration(camera: Any) -> dict[str, Any]:
    """The camera's WebRTC client configuration as the frontend gets it: ICE
    servers (including Home Assistant Cloud's TURN) and any data channel the
    camera needs the client to open."""
    try:
        return camera.async_get_webrtc_client_configuration().to_frontend_dict()
    except Exception:  # a provider bug must not fail the tile
        _LOGGER.debug("WebRTC client config failed for %s", camera.entity_id, exc_info=True)
        return {}


def normalize_candidate(raw: Any) -> dict[str, Any] | None:
    """A candidate as the phone sends and receives it:
    `{"candidate", "sdpMid", "sdpMLineIndex"}`. None for an empty one, which
    only marks the end of candidates."""
    if isinstance(raw, str):
        raw = {"candidate": raw}
    if not isinstance(raw, dict):
        return None
    candidate = raw.get("candidate")
    if not isinstance(candidate, str) or not candidate:
        return None
    out: dict[str, Any] = {"candidate": candidate[:1024]}
    mid = raw.get("sdpMid", raw.get("sdp_mid"))
    if isinstance(mid, str):
        out["sdpMid"] = mid[:64]
    index = raw.get("sdpMLineIndex", raw.get("sdp_m_line_index"))
    if isinstance(index, int) and not isinstance(index, bool) and 0 <= index < 64:
        out["sdpMLineIndex"] = index
    return out


def _candidate_init(candidate: dict[str, Any]) -> Any:
    """The core type a camera takes a candidate as."""
    from webrtc_models import RTCIceCandidateInit

    return RTCIceCandidateInit.from_dict(candidate)


@dataclass(eq=False)
class _Session:
    session_id: str
    device_id: str
    entity_id: str
    camera: Any
    last_seen: float
    answer: str | None = None
    error: tuple[str, str] | None = None
    candidates: list[dict[str, Any]] = field(default_factory=list)
    answered: asyncio.Event = field(default_factory=asyncio.Event)
    candidate_arrived: asyncio.Event = field(default_factory=asyncio.Event)


class CameraWebRTCSessions:
    """The phone's open WebRTC signaling sessions, by session id."""

    def __init__(
        self,
        *,
        clock: Callable[[], float] = time.monotonic,
        answer_timeout: float = ANSWER_TIMEOUT_SECONDS,
        candidate_grace: float = CANDIDATE_GRACE_SECONDS,
    ) -> None:
        self._clock = clock
        self._answer_timeout = answer_timeout
        self._candidate_grace = candidate_grace
        self._sessions: dict[str, _Session] = {}
        self._sweep_handle: asyncio.TimerHandle | None = None

    # ── lifecycle ──────────────────────────────────────────────────────────

    def start(self, loop: asyncio.AbstractEventLoop) -> None:
        """Begin sweeping sessions the phone stopped keeping."""
        self._schedule_sweep(loop)

    def shutdown(self) -> None:
        if self._sweep_handle is not None:
            self._sweep_handle.cancel()
            self._sweep_handle = None
        for session in list(self._sessions.values()):
            self._close(session)

    def _schedule_sweep(self, loop: asyncio.AbstractEventLoop) -> None:
        self._sweep_handle = loop.call_later(SWEEP_SECONDS, self._sweep, loop)

    def _sweep(self, loop: asyncio.AbstractEventLoop) -> None:
        self.close_idle()
        self._schedule_sweep(loop)

    def close_idle(self) -> int:
        """Close every session idle for longer than SESSION_IDLE_SECONDS."""
        cutoff = self._clock() - SESSION_IDLE_SECONDS
        stale = [s for s in self._sessions.values() if s.last_seen < cutoff]
        for session in stale:
            _LOGGER.debug("Closing idle WebRTC session %s for %s", session.session_id, session.entity_id)
            self._close(session)
        return len(stale)

    # ── signaling ──────────────────────────────────────────────────────────

    async def async_offer(
        self, device_id: str, entity_id: str, camera: Any, offer_sdp: str
    ) -> dict[str, Any]:
        """Hand the phone's offer to the camera and wait for its answer.

        Returns `{"session_id", "answer", "candidates"}`. Raises
        WebRTCOfferError when the camera refuses, fails or never answers.
        """
        self._make_room(device_id)
        session = _Session(
            session_id=uuid.uuid4().hex,
            device_id=device_id,
            entity_id=entity_id,
            camera=camera,
            last_seen=self._clock(),
        )
        self._sessions[session.session_id] = session

        def send_message(message: Any) -> None:
            self._on_message(session, message)

        try:
            await camera.async_handle_async_webrtc_offer(
                offer_sdp, session.session_id, send_message
            )
        except Exception as err:  # HomeAssistantError or a provider bug
            self._close(session)
            raise WebRTCOfferError("offer_failed", str(err) or type(err).__name__) from err

        try:
            async with asyncio.timeout(self._answer_timeout):
                await session.answered.wait()
        except TimeoutError as err:
            self._close(session)
            raise WebRTCOfferError("timeout", "The camera did not answer") from err

        if session.error is not None or session.answer is None:
            code, message = session.error or ("offer_failed", "No answer")
            self._close(session)
            raise WebRTCOfferError(code, message)

        if not session.candidates and self._candidate_grace > 0:
            try:
                async with asyncio.timeout(self._candidate_grace):
                    await session.candidate_arrived.wait()
            except TimeoutError:
                pass

        return {
            "session_id": session.session_id,
            "answer": session.answer,
            "candidates": self._take_candidates(session),
        }

    async def async_candidates(
        self, device_id: str, session_id: str, candidates: list[Any]
    ) -> dict[str, Any] | None:
        """Forward the phone's candidates and return the server's since the
        last call. None when the session is gone or belongs to another
        device."""
        session = self._owned(device_id, session_id)
        if session is None:
            return None
        session.last_seen = self._clock()
        for raw in candidates[:MAX_CANDIDATES_PER_CALL]:
            candidate = normalize_candidate(raw)
            if candidate is None:
                continue
            try:
                init = _candidate_init(candidate)
                await session.camera.async_on_webrtc_candidate(session_id, init)
            except Exception:  # one bad candidate must not end the stream
                _LOGGER.debug("WebRTC candidate refused for %s", session.entity_id, exc_info=True)
        body: dict[str, Any] = {"candidates": self._take_candidates(session)}
        if session.error is not None:
            body["error"] = session.error[0]
            body["message"] = session.error[1]
        return body

    def keepalive(self, device_id: str, session_ids: list[Any]) -> list[str]:
        """Mark the sessions as still wanted. Returns the ones that are."""
        now = self._clock()
        alive: list[str] = []
        for session_id in session_ids[:MAX_SESSIONS_PER_DEVICE]:
            if not isinstance(session_id, str):
                continue
            session = self._owned(device_id, session_id)
            if session is None or session.error is not None:
                continue
            session.last_seen = now
            alive.append(session_id)
        return alive

    def close(self, device_id: str, session_ids: list[Any]) -> int:
        closed = 0
        for session_id in session_ids[:MAX_SESSIONS_PER_DEVICE]:
            if not isinstance(session_id, str):
                continue
            session = self._owned(device_id, session_id)
            if session is not None:
                self._close(session)
                closed += 1
        return closed

    def close_device(self, device_id: str) -> None:
        for session in [s for s in self._sessions.values() if s.device_id == device_id]:
            self._close(session)

    def count(self, device_id: str | None = None) -> int:
        if device_id is None:
            return len(self._sessions)
        return sum(1 for s in self._sessions.values() if s.device_id == device_id)

    # ── internals ──────────────────────────────────────────────────────────

    def _owned(self, device_id: str, session_id: str) -> _Session | None:
        session = self._sessions.get(session_id)
        if session is None or session.device_id != device_id:
            return None
        return session

    def _make_room(self, device_id: str) -> None:
        """Close the device's oldest sessions so a new one fits."""
        mine = sorted(
            (s for s in self._sessions.values() if s.device_id == device_id),
            key=lambda s: s.last_seen,
        )
        while len(mine) >= MAX_SESSIONS_PER_DEVICE:
            self._close(mine.pop(0))

    def _on_message(self, session: _Session, message: Any) -> None:
        data = message.as_dict() if hasattr(message, "as_dict") else message
        if not isinstance(data, dict):
            return
        kind = data.get("type")
        if kind == "answer":
            answer = data.get("answer")
            if isinstance(answer, str):
                session.answer = answer
            session.answered.set()
        elif kind == "candidate":
            candidate = normalize_candidate(data.get("candidate"))
            if candidate is not None and len(session.candidates) < MAX_PENDING_CANDIDATES:
                session.candidates.append(candidate)
                session.candidate_arrived.set()
        elif kind == "error":
            session.error = (
                str(data.get("code") or "offer_failed"),
                str(data.get("message") or ""),
            )
            session.answered.set()

    @staticmethod
    def _take_candidates(session: _Session) -> list[dict[str, Any]]:
        taken = session.candidates
        session.candidates = []
        session.candidate_arrived.clear()
        return taken

    def _close(self, session: _Session) -> None:
        if self._sessions.pop(session.session_id, None) is None:
            return
        close = getattr(session.camera, "close_webrtc_session", None)
        if close is None:
            return
        try:
            close(session.session_id)
        except Exception:  # closing is best effort
            _LOGGER.debug("Closing WebRTC session %s failed", session.session_id, exc_info=True)
