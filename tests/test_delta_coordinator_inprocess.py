"""In-process tests for DeltaCoordinator's cursor and waiter bookkeeping.

These load ``api.py`` with stubbed Home Assistant modules (the same approach
as ``test_camera_stream.py``) so the idle-gap and superseded-poll logic can
be exercised deterministically, with no live HA and no 5 minute wait for
SESSION_TTL. The HTTP suite still covers the end-to-end behavior.

Covered:

* Idle gap: a state change that arrives while NO session exists is not
  buffered. A watch resuming with its pre-gap cursor must get 410, and the
  cursor it receives from the follow-up snapshot must then be accepted (no
  410 loop).
* Superseded poll: an older long-poll for the same watch that finishes after
  a newer one has started must not evict the newer poll's waiter.
"""

from __future__ import annotations

import asyncio
import importlib.util
import sys
import types
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest

_API_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "api.py"
)


class _Context:
    def __init__(self, cid: str = "ctx") -> None:
        self.id = cid


class _State:
    def __init__(self, entity_id: str, state: str, attributes: dict | None = None) -> None:
        self.entity_id = entity_id
        self.state = state
        self.attributes = attributes or {}
        self.last_updated = datetime.now(timezone.utc)
        self.last_changed = self.last_updated
        self.context = _Context()
        self.domain = entity_id.split(".", 1)[0]
        self.name = entity_id


class _Event:
    def __init__(self, new_state: _State) -> None:
        self.data = {"new_state": new_state, "entity_id": new_state.entity_id}


class _States:
    def __init__(self) -> None:
        self._by_id: dict[str, _State] = {}

    def get(self, entity_id: str) -> _State | None:
        return self._by_id.get(entity_id)

    def async_all(self, domain: str | None = None) -> list[_State]:
        return [s for s in self._by_id.values() if domain is None or s.domain == domain]

    def set(self, entity_id: str, state: str) -> _State:
        s = _State(entity_id, state)
        self._by_id[entity_id] = s
        return s


class _Bus:
    def __init__(self) -> None:
        self.listener = None

    def async_listen(self, event_type: str, cb):  # noqa: ANN001
        self.listener = cb
        return lambda: None


class _Hass:
    def __init__(self) -> None:
        self.loop = asyncio.get_event_loop()
        self.states = _States()
        self.bus = _Bus()


def _stub(name: str, **attrs: object) -> None:
    module = sys.modules.get(name) or types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module


def _load_api():
    saved = dict(sys.modules)
    _stub("homeassistant")
    _stub("homeassistant.const", EVENT_STATE_CHANGED="state_changed")
    _stub(
        "homeassistant.core",
        Event=_Event,
        HomeAssistant=_Hass,
        State=_State,
        callback=lambda f: f,
    )
    _stub("homeassistant.helpers")
    _stub("homeassistant.helpers.template", Template=type("Template", (), {}))
    _stub("homeassistant.util")
    _stub(
        "homeassistant.util.dt",
        utcnow=lambda: datetime.now(timezone.utc),
    )
    pkg = types.ModuleType("wa_test_pkg")
    pkg.__path__ = []
    sys.modules["wa_test_pkg"] = pkg
    _stub(
        "wa_test_pkg.logbook_events",
        log_first_sync=lambda *a, **k: None,
        log_session_dropped=lambda *a, **k: None,
    )
    spec = importlib.util.spec_from_file_location("wa_test_pkg.api", _API_PATH)
    module = importlib.util.module_from_spec(spec)
    sys.modules["wa_test_pkg.api"] = module
    spec.loader.exec_module(module)
    return module, saved


@pytest.fixture
def coordinator():
    async def _make():
        module, saved = _load_api()
        hass = _Hass()
        return module, hass, module.DeltaCoordinator(hass), saved

    module, hass, coord, saved = asyncio.run(_make())
    yield module, hass, coord
    for key in list(sys.modules):
        if key not in saved:
            del sys.modules[key]
    sys.modules.update(saved)


def _poll(coord, **kw):
    kw.setdefault("watch_id", "w1")
    kw.setdefault("config_hash", "x")
    kw.setdefault("timeout", 1)
    kw.setdefault("since", None)
    kw.setdefault("entities", None)
    return coord.handle_poll(**kw)


def _change(hass, coord, entity_id: str, state: str) -> None:
    s = hass.states.set(entity_id, state)
    coord._handle_state_changed(_Event(s))


def test_idle_gap_forces_resync_then_accepts_snapshot_cursor(coordinator) -> None:
    module, hass, coord = coordinator
    ent = "wrist_assistant.t1"
    hass.states.set(ent, "off")

    async def run() -> None:
        # 1. Subscribe (snapshot path) → cursor c0.
        status, body = await _poll(coord, entities=[ent])
        assert status == 200
        c0 = body["next_cursor"]

        # 2. Session goes idle past SESSION_TTL and is pruned → no sessions.
        coord._sessions["w1"].last_seen -= module.SESSION_TTL + timedelta(seconds=1)
        coord._prune_sessions()
        assert not coord._sessions

        # 3. A change happens with nobody connected: it is NOT buffered.
        _change(hass, coord, ent, "on")
        assert not coord._events

        # 4. Watch resumes with its old cursor → must be told to resync.
        status, body = await _poll(coord, since=c0, entities=[ent], force_delta=True)
        assert status == 410, body
        assert body["resync_required"] is True

        # 5. Client takes a snapshot → new cursor c1 (>= gap).
        status, body = await _poll(coord, since=None, entities=[ent])
        assert status == 200
        c1 = body["next_cursor"]
        assert c1 > c0
        states = {e["entity_id"]: e["state"] for e in body["events"]}
        assert states[ent] == "on"

        # 6. Next poll with c1 must be accepted — pre-fix this looped 410s.
        status, body = await _poll(coord, since=c1, entities=[ent], force_delta=True)
        assert status == 200, body
        assert body["resync_required"] is False

        # 7. With a session alive, changes are buffered and delivered.
        _change(hass, coord, ent, "off")
        status, body = await _poll(coord, since=c1, entities=[ent], force_delta=True)
        assert status == 200
        assert [e["entity_id"] for e in body["events"]] == [ent]
        assert body["next_cursor"] > c1

    asyncio.run(run())


def test_no_gap_no_resync(coordinator) -> None:
    """A watch that resumes with a valid cursor and no dropped changes is fine."""
    module, hass, coord = coordinator
    ent = "wrist_assistant.t2"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]
        status, body = await _poll(coord, since=c0, entities=[ent], force_delta=True)
        assert status == 200
        assert body["resync_required"] is False

    asyncio.run(run())


def test_superseded_poll_does_not_evict_successor_waiter(coordinator) -> None:
    module, hass, coord = coordinator
    ent = "wrist_assistant.t3"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]

        # A: short server timeout. B: long one, started while A is parked.
        task_a = asyncio.create_task(_poll(coord, since=c0, entities=[ent], timeout=1))
        await asyncio.sleep(0.05)
        task_b = asyncio.create_task(_poll(coord, since=c0, entities=[ent], timeout=10))
        await asyncio.sleep(0.05)

        # B now owns the waiter; A should have been woken and ended with 204.
        status_a, _ = await asyncio.wait_for(task_a, timeout=2)
        assert status_a == 204
        assert "w1" in coord._waiters, "A's cleanup evicted B's waiter (regression)"

        # Fire a change: B must wake promptly with it.
        _change(hass, coord, ent, "on")
        status_b, body_b = await asyncio.wait_for(task_b, timeout=2)
        assert status_b == 200, body_b
        assert [e["entity_id"] for e in body_b["events"]] == [ent]

    asyncio.run(run())


def test_prune_releases_parked_poll(coordinator) -> None:
    module, hass, coord = coordinator
    ent = "wrist_assistant.t4"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]
        task = asyncio.create_task(_poll(coord, since=c0, entities=[ent], timeout=10))
        await asyncio.sleep(0.05)
        coord._sessions["w1"].last_seen -= module.SESSION_TTL + timedelta(seconds=1)
        coord._prune_sessions()
        status, _ = await asyncio.wait_for(task, timeout=2)
        assert status == 204
        assert "w1" not in coord._waiters

    asyncio.run(run())


def test_session_listener_exception_does_not_break_poll(coordinator) -> None:
    module, hass, coord = coordinator
    ent = "wrist_assistant.t5"
    hass.states.set(ent, "off")
    calls: list[str] = []

    def bad() -> None:
        raise RuntimeError("boom")

    def good() -> None:
        calls.append("good")

    coord.async_add_session_listener(bad)
    coord.async_add_session_listener(good)

    async def run() -> None:
        status, _ = await _poll(coord, entities=[ent])
        assert status == 200
        assert calls == ["good"]

    asyncio.run(run())


def test_events_still_delivered_after_an_idle_gap(coordinator) -> None:
    """A gap must not break the ring buffer's index lookup.

    Regression: `_bisect_cursor` derived the deque index arithmetically from
    the oldest event's cursor, which is only valid while every cursor value
    has an event behind it. The idle gap consumes cursor values without
    appending, so once the buffer held events from BOTH sides of a gap the
    computed index overshot, `_collect_events` scanned an empty slice, and
    every poll answered 200 with no events and next_cursor == since. The
    watch showed stale tiles indefinitely and only recovered on a restart.
    """
    module, hass, coord = coordinator
    ent = "wrist_assistant.t6"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]

        # A real event lands in the buffer BEFORE the gap, so the deque's
        # oldest cursor stays behind the gap for the rest of the test.
        _change(hass, coord, ent, "on")
        assert len(coord._events) == 1

        # Session goes idle: a burst of changes is dropped, each consuming a
        # cursor value. This is what desynchronises index from cursor.
        coord._sessions["w1"].last_seen -= module.SESSION_TTL + timedelta(seconds=1)
        coord._prune_sessions()
        assert not coord._sessions
        for _ in range(50):
            _change(hass, coord, "wrist_assistant.noise", "x")
        assert len(coord._events) == 1  # nothing buffered during the gap

        # Watch resumes: told to resync, then takes a snapshot.
        status, body = await _poll(coord, since=c0, entities=[ent], force_delta=True)
        assert status == 410, body
        status, body = await _poll(coord, since=None, entities=[ent])
        c1 = body["next_cursor"]

        # A change after the gap must be delivered on the next poll.
        _change(hass, coord, ent, "off")
        status, body = await _poll(coord, since=c1, entities=[ent], force_delta=True)
        assert status == 200, body
        assert [e["entity_id"] for e in body["events"]] == [ent], (
            "post-gap event was not delivered: the buffer index lookup is "
            f"desynchronised by the gap. body={body!r}"
        )
        assert body["next_cursor"] > c1

    asyncio.run(run())


def test_probe_answers_at_once_and_leaves_held_poll_alone(coordinator) -> None:
    """timeout=0 is a probe: empty 204 now, events if any, and the long poll
    the same watch is holding is neither woken nor superseded by it."""
    module, hass, coord = coordinator
    ent = "wrist_assistant.t7"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]
        assert "instant_poll" in body["capabilities"]

        # Quiet house: the probe must come straight back with no body.
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=0), timeout=1
        )
        assert status == 204 and body is None

        # Park a long poll, then probe past it. The long poll must still be
        # the registered waiter afterwards, and must still get its event.
        held = asyncio.create_task(_poll(coord, since=c0, entities=[ent], timeout=10))
        await asyncio.sleep(0.05)
        held_waiter = coord._waiters.get("w1")
        assert held_waiter is not None

        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=0), timeout=1
        )
        assert status == 204 and body is None
        assert coord._waiters.get("w1") is held_waiter, "probe displaced the held poll"
        assert not held.done(), "probe woke the held poll"

        _change(hass, coord, ent, "on")
        status_h, body_h = await asyncio.wait_for(held, timeout=2)
        assert status_h == 200, body_h
        assert [e["entity_id"] for e in body_h["events"]] == [ent]

        # A probe with something past its cursor carries it, like any poll.
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=0), timeout=1
        )
        assert status == 200, body
        assert [e["entity_id"] for e in body["events"]] == [ent]
        assert body["next_cursor"] > c0

    asyncio.run(run())
