"""Pure-unit tests for the iPhone's WebRTC camera signaling store.

`camera_webrtc` imports nothing from Home Assistant at module level, so these
load it straight from its file and drive it with a fake camera that answers
the way go2rtc's provider does: the offer call returns at once, and the
answer and the server's candidates arrive later through `send_message`.

What they pin:

* an offer returns the answer and the candidates that came with it, and
  closes nothing;
* a camera that errors, refuses or never answers ends in WebRTCOfferError
  and leaves no session behind (and closes it on the camera);
* candidates the camera sends after the offer reply ride the next
  `webrtc_candidates` call, and the phone's candidates reach the camera;
* a session belongs to the device that opened it;
* keepalive, close, the idle sweep and the per-device limit.

Run from the repo root:

    .venv-test/bin/python -m pytest tests/test_camera_webrtc.py
"""

from __future__ import annotations

import asyncio
import importlib.util
import sys
import types
from dataclasses import dataclass
from pathlib import Path

import pytest

_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "camera_webrtc.py"
)


def _load():
    spec = importlib.util.spec_from_file_location("wa_camera_webrtc", _PATH)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    # dataclasses looks the module up by name while building `_Session`.
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


@dataclass
class _CandidateInit:
    candidate: str
    sdp_mid: str | None = None
    sdp_m_line_index: int | None = None

    @classmethod
    def from_dict(cls, raw: dict) -> _CandidateInit:
        return cls(raw["candidate"], raw.get("sdpMid"), raw.get("sdpMLineIndex"))


# The store converts the phone's candidates with webrtc_models, a Home
# Assistant dependency. A stand-in with the same constructor is enough here.
sys.modules.setdefault("webrtc_models", types.SimpleNamespace(RTCIceCandidateInit=_CandidateInit))

webrtc = _load()


class FakeCamera:
    """Answers like go2rtc: later, through send_message, with candidates
    trickling after the answer."""

    entity_id = "camera.front"

    def __init__(
        self,
        *,
        answer: str | None = "v=0 answer",
        candidates_with_answer: int = 1,
        late_candidates: int = 0,
        error: tuple[str, str] | None = None,
        raises: Exception | None = None,
    ) -> None:
        self.answer = answer
        self.candidates_with_answer = candidates_with_answer
        self.late_candidates = late_candidates
        self.error = error
        self.raises = raises
        self.closed: list[str] = []
        self.received: list[tuple[str, _CandidateInit]] = []
        self.send = None

    async def async_handle_async_webrtc_offer(self, offer, session_id, send_message):
        if self.raises is not None:
            raise self.raises
        self.send = send_message
        loop = asyncio.get_running_loop()

        def deliver():
            send_message({"type": "session", "session_id": session_id})
            if self.error is not None:
                send_message({"type": "error", "code": self.error[0], "message": self.error[1]})
                return
            if self.answer is None:
                return
            send_message({"type": "answer", "answer": self.answer})
            for i in range(self.candidates_with_answer):
                send_message({"type": "candidate", "candidate": {"candidate": f"candidate:{i}", "sdpMid": "0"}})

        loop.call_soon(deliver)

    def trickle(self, count: int) -> None:
        for i in range(count):
            self.send({"type": "candidate", "candidate": {"candidate": f"late:{i}", "sdpMLineIndex": 0}})

    async def async_on_webrtc_candidate(self, session_id, candidate):
        self.received.append((session_id, candidate))

    def close_webrtc_session(self, session_id):
        self.closed.append(session_id)


class Clock:
    def __init__(self) -> None:
        self.now = 1000.0

    def __call__(self) -> float:
        return self.now


def _store(**kwargs):
    clock = Clock()
    store = webrtc.CameraWebRTCSessions(clock=clock, **kwargs)
    return store, clock


def test_offer_returns_answer_and_first_candidates():
    async def run():
        store, _ = _store()
        camera = FakeCamera(candidates_with_answer=2)
        result = await store.async_offer("phone", "camera.front", camera, "v=0 offer")
        assert result["answer"] == "v=0 answer"
        assert [c["candidate"] for c in result["candidates"]] == ["candidate:0", "candidate:1"]
        assert result["candidates"][0]["sdpMid"] == "0"
        assert store.count("phone") == 1
        assert camera.closed == []

    asyncio.run(run())


def test_offer_without_candidates_waits_only_the_grace():
    async def run():
        store, _ = _store(candidate_grace=0.01)
        camera = FakeCamera(candidates_with_answer=0)
        loop = asyncio.get_running_loop()
        start = loop.time()
        result = await store.async_offer("phone", "camera.front", camera, "v=0 offer")
        assert result["candidates"] == []
        assert loop.time() - start < 0.5

    asyncio.run(run())


@pytest.mark.parametrize(
    ("camera", "code"),
    [
        (FakeCamera(error=("go2rtc_webrtc_offer_failed", "no stream")), "go2rtc_webrtc_offer_failed"),
        (FakeCamera(raises=RuntimeError("Camera has no stream source")), "offer_failed"),
        (FakeCamera(answer=None), "timeout"),
    ],
)
def test_failed_offer_leaves_no_session(camera, code):
    async def run():
        store, _ = _store(answer_timeout=0.05)
        with pytest.raises(webrtc.WebRTCOfferError) as raised:
            await store.async_offer("phone", "camera.front", camera, "v=0 offer")
        assert raised.value.code == code
        assert store.count() == 0
        # A session the camera knew about is closed on the camera too.
        if not isinstance(camera.raises, Exception):
            assert len(camera.closed) == 1

    asyncio.run(run())


def test_late_candidates_ride_the_next_call_and_phone_candidates_reach_camera():
    async def run():
        store, _ = _store()
        camera = FakeCamera(candidates_with_answer=1)
        result = await store.async_offer("phone", "camera.front", camera, "v=0 offer")
        session_id = result["session_id"]
        camera.trickle(2)
        body = await store.async_candidates(
            "phone",
            session_id,
            [{"candidate": "candidate:phone relay", "sdpMid": "0", "sdpMLineIndex": 0}, {"candidate": ""}],
        )
        assert [c["candidate"] for c in body["candidates"]] == ["late:0", "late:1"]
        assert body["candidates"][0]["sdpMLineIndex"] == 0
        assert len(camera.received) == 1
        assert camera.received[0][0] == session_id
        assert camera.received[0][1].candidate == "candidate:phone relay"
        # Taken candidates are not handed out twice.
        again = await store.async_candidates("phone", session_id, [])
        assert again["candidates"] == []

    asyncio.run(run())


def test_a_session_belongs_to_its_device():
    async def run():
        store, _ = _store()
        camera = FakeCamera()
        session_id = (await store.async_offer("phone", "camera.front", camera, "o"))["session_id"]
        assert await store.async_candidates("other", session_id, []) is None
        assert store.keepalive("other", [session_id]) == []
        assert store.close("other", [session_id]) == 0
        assert store.count("phone") == 1

    asyncio.run(run())


def test_keepalive_close_and_idle_sweep():
    async def run():
        store, clock = _store()
        camera = FakeCamera()
        kept = (await store.async_offer("phone", "camera.front", camera, "o"))["session_id"]
        dropped = (await store.async_offer("phone", "camera.front", camera, "o"))["session_id"]
        assert store.keepalive("phone", [kept, "nope", 7]) == [kept]

        clock.now += webrtc.SESSION_IDLE_SECONDS - 1
        store.keepalive("phone", [kept])
        clock.now += 2
        assert store.close_idle() == 1
        assert dropped in camera.closed
        assert store.count() == 1

        assert store.close("phone", [kept]) == 1
        assert store.count() == 0
        assert kept in camera.closed

    asyncio.run(run())


def test_device_limit_closes_the_oldest():
    async def run():
        store, clock = _store()
        camera = FakeCamera()
        first = None
        for i in range(webrtc.MAX_SESSIONS_PER_DEVICE + 1):
            clock.now += 1
            session_id = (await store.async_offer("phone", "camera.front", camera, "o"))["session_id"]
            if i == 0:
                first = session_id
        assert store.count("phone") == webrtc.MAX_SESSIONS_PER_DEVICE
        assert first in camera.closed

    asyncio.run(run())


def test_normalize_candidate():
    norm = webrtc.normalize_candidate
    assert norm(None) is None
    assert norm({"candidate": ""}) is None
    assert norm("candidate:1") == {"candidate": "candidate:1"}
    assert norm({"candidate": "c", "sdp_mid": "1", "sdp_m_line_index": 1}) == {
        "candidate": "c",
        "sdpMid": "1",
        "sdpMLineIndex": 1,
    }
    assert norm({"candidate": "c", "sdpMLineIndex": True}) == {"candidate": "c"}


def test_camera_supports_webrtc_reads_frontend_stream_types():
    class Kind:
        def __init__(self, value):
            self.value = value

    def camera(*kinds):
        caps = types.SimpleNamespace(frontend_stream_types={Kind(k) for k in kinds})
        return types.SimpleNamespace(camera_capabilities=caps)

    assert webrtc.camera_supports_webrtc(camera("hls", "web_rtc"))
    assert not webrtc.camera_supports_webrtc(camera("hls"))
    assert not webrtc.camera_supports_webrtc(types.SimpleNamespace())
