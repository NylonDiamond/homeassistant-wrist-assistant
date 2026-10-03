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
* Watch config on the poll: the signer's pages and behavior revisions on
  every reply (0 with no record, never the catalog), and a save of either
  kind waking the owner's parked poll through the store listener, including
  a poll with nothing recorded yet (after a prune or a 204 probe) and a
  phone's save through the real watch_config_put op.
"""

from __future__ import annotations

import asyncio
import importlib.util
import sys
import types
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest

# The real watch_config_put handler, pulled out of wa_v2_views.py the way its
# own tests do, so a phone's save is driven through the op and not the listener.
from test_watch_config_ops_inprocess import _Ctx as _OpCtx
from test_watch_config_ops_inprocess import _handlers as _op_handlers
from test_watch_config_ops_inprocess import _put_body as _op_put_body

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


def test_waking_an_owner_with_no_parked_poll_is_a_no_op(coordinator) -> None:
    """What the panel's Resend does to an iPhone owner, and to an absent watch.

    An iPhone is a complication owner in its own right but holds no long-poll
    on this server, so there is never a waiter to release. The command answers
    with `polling: false` rather than an error, which only works because this
    raises nothing on an id the coordinator has never seen.
    """
    _module, _hass, coord = coordinator

    async def run() -> None:
        coord.wake_watch("iphone:never-polled", renotify=True)
        assert coord.is_polling("iphone:never-polled") is False
        assert coord.seconds_since_poll("iphone:never-polled") is None

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


def test_session_listeners_fire_only_when_a_session_changes(coordinator) -> None:
    """A plain poll rewrote every diagnostic sensor, one recorder row per poll.

    Session listeners now hear only what they show: a session appearing or
    going away, and a session's entity list moving. Poll listeners hear every
    poll, with the watch that made it.
    """
    module, hass, coord = coordinator
    a, b = "wrist_assistant.t6a", "wrist_assistant.t6b"
    hass.states.set(a, "off")
    hass.states.set(b, "off")
    session_calls: list[None] = []
    poll_calls: list[str] = []
    coord.async_add_session_listener(lambda: session_calls.append(None))
    coord.async_add_poll_listener(poll_calls.append)

    async def run() -> None:
        # New session: fires.
        await _poll(coord, entities=[a])
        assert len(session_calls) == 1
        # Same entity list again, and a poll that sends no list: nothing.
        await _poll(coord, entities=[a])
        await _poll(coord)
        assert len(session_calls) == 1
        # The list moves: fires.
        await _poll(coord, entities=[a, b])
        assert len(session_calls) == 2
        # A new config hash clears the list: fires once, then quiet.
        await _poll(coord, config_hash="y")
        assert len(session_calls) == 3
        assert coord._sessions["w1"].entities == set()
        await _poll(coord, config_hash="y")
        assert len(session_calls) == 3
        # A second watch appears: fires.
        await _poll(coord, watch_id="w2", entities=[a])
        assert len(session_calls) == 4
        # Every poll reached the poll listeners.
        assert poll_calls == ["w1"] * 6 + ["w2"]
        # The first watch goes idle past the TTL and is pruned: fires.
        coord._sessions["w1"].last_seen -= module.SESSION_TTL + timedelta(seconds=1)
        coord._prune_sessions()
        assert len(session_calls) == 5
        # And comes back as a new session: fires again.
        await _poll(coord, entities=[a])
        assert len(session_calls) == 6

    asyncio.run(run())


def test_poll_listener_exception_does_not_break_poll(coordinator) -> None:
    _module, hass, coord = coordinator
    ent = "wrist_assistant.t7"
    hass.states.set(ent, "off")
    calls: list[str] = []

    def bad(_watch_id: str) -> None:
        raise RuntimeError("boom")

    coord.async_add_poll_listener(bad)
    coord.async_add_poll_listener(calls.append)

    async def run() -> None:
        status, _ = await _poll(coord, entities=[ent])
        assert status == 200
        assert calls == ["w1"]

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


# ── custom complications on the poll ───────────────────────────────────────


class _FakeComplicationStore:
    """Just the surface the coordinator touches: a token per owner, the ack,
    and the wake hook a commit fires."""

    def __init__(self) -> None:
        self.tokens: dict[str, int] = {}
        self.applied: dict[str, int] = {}
        self.wake = None

    def async_set_wake_callback(self, wake) -> None:  # noqa: ANN001
        self.wake = wake

    def owner_token(self, owner: str) -> int:
        return self.tokens.get(owner, 0)

    def applied_token(self, owner: str) -> int | None:
        # None, not 0: a watch that has never acked is not a watch that acked
        # an empty store. Mirrors ComplicationStore.applied_token.
        return self.applied.get(owner)

    def set_applied_token(self, owner: str, token: int) -> bool:
        if self.applied.get(owner) == token:
            return False
        self.applied[owner] = token
        return True

    def commit(self, owner: str) -> int:
        """What a panel save does: bump the owner's token, wake its poll."""
        self.tokens[owner] = self.tokens.get(owner, 0) + 1
        self.wake(owner)
        return self.tokens[owner]


def test_poll_reply_carries_the_token_and_records_the_ack(coordinator) -> None:
    module, hass, coord = coordinator
    store = _FakeComplicationStore()
    coord.attach_complication_store(store)
    ent = "wrist_assistant.c1"
    hass.states.set(ent, "off")

    async def run() -> None:
        # Snapshot reply carries the token (0: nothing saved yet).
        status, body = await _poll(coord, entities=[ent], complications_token=0)
        assert status == 200
        assert body["complications_token"] == 0
        assert store.applied_token("w1") == 0

        # A save bumps it; the next snapshot says so and the ack is stored.
        store.tokens["w1"] = 4
        status, body = await _poll(coord, entities=[ent], complications_token=3)
        assert body["complications_token"] == 4
        assert store.applied_token("w1") == 3

        # An old app sends nothing: no ack recorded, token still on the reply.
        status, body = await _poll(coord, entities=[ent])
        assert body["complications_token"] == 4
        assert store.applied_token("w1") == 3

    asyncio.run(run())


def test_commit_wakes_the_parked_poll_with_an_empty_reply(coordinator) -> None:
    """Save at t; the reply must arrive well inside a second, empty, with the
    new token; and the waiter must be gone afterwards (no busy loop)."""
    module, hass, coord = coordinator
    store = _FakeComplicationStore()
    coord.attach_complication_store(store)
    ent = "wrist_assistant.c2"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent], complications_token=0)
        c0 = body["next_cursor"]
        assert coord.is_polling("w1")

        held = asyncio.create_task(
            _poll(coord, since=c0, entities=[ent], timeout=10, complications_token=0)
        )
        await asyncio.sleep(0.05)
        assert "w1" in coord._waiters

        started = hass.loop.time()
        new_token = store.commit("w1")
        status, body = await asyncio.wait_for(held, timeout=2)
        assert hass.loop.time() - started < 1.0
        assert status == 200, body
        assert body["events"] == []
        assert body["complications_token"] == new_token
        assert "w1" not in coord._waiters

        # The watch re-polls having applied it: parks normally (no reply).
        held = asyncio.create_task(
            _poll(coord, since=c0, entities=[ent], timeout=1, complications_token=new_token)
        )
        status, body = await asyncio.wait_for(held, timeout=2)
        assert status == 204 and body is None
        assert store.applied_token("w1") == new_token

    asyncio.run(run())


def test_behind_watch_is_told_once_per_token_then_waits(coordinator) -> None:
    """A watch whose pull keeps failing re-polls with the old applied token.
    It gets the "you are behind" reply once per token change, then parks like
    any other poll, so it cannot spin on immediate empty replies."""
    module, hass, coord = coordinator
    store = _FakeComplicationStore()
    coord.attach_complication_store(store)
    ent = "wrist_assistant.c3"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent], complications_token=0)
        c0 = body["next_cursor"]
        store.tokens["w1"] = 2

        # First poll behind: immediate empty 200 with the token.
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=10, complications_token=0),
            timeout=1,
        )
        assert status == 200 and body["events"] == []
        assert body["complications_token"] == 2

        # Still behind, same token: parks and times out.
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=1, complications_token=0),
            timeout=3,
        )
        assert status == 204

        # The panel's nudge hands it out again.
        held = asyncio.create_task(
            _poll(coord, since=c0, entities=[ent], timeout=10, complications_token=0)
        )
        await asyncio.sleep(0.05)
        coord.wake_watch("w1", renotify=True)
        status, body = await asyncio.wait_for(held, timeout=1)
        assert status == 200 and body["complications_token"] == 2

        # A new token is news again.
        store.tokens["w1"] = 3
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=10, complications_token=0),
            timeout=1,
        )
        assert status == 200 and body["complications_token"] == 3

        # A probe from a behind watch also gets the token, not a bare 204.
        store.tokens["w1"] = 4
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=0, complications_token=0),
            timeout=1,
        )
        assert status == 200 and body["complications_token"] == 4

    asyncio.run(run())


def test_nudge_on_a_current_watch_changes_nothing(coordinator) -> None:
    module, hass, coord = coordinator
    store = _FakeComplicationStore()
    coord.attach_complication_store(store)
    ent = "wrist_assistant.c4"
    hass.states.set(ent, "off")

    async def run() -> None:
        store.tokens["w1"] = 1
        status, body = await _poll(coord, entities=[ent], complications_token=1)
        c0 = body["next_cursor"]
        held = asyncio.create_task(
            _poll(coord, since=c0, entities=[ent], timeout=1, complications_token=1)
        )
        await asyncio.sleep(0.05)
        coord.wake_watch("w1", renotify=True)
        # Woken, nothing to say: parks again and times out.
        status, body = await asyncio.wait_for(held, timeout=3)
        assert status == 204 and body is None
        # Nobody polling any more once the gap passes.
        assert coord.is_polling("w1")
        coord._last_poll_at["w1"] -= module.POLL_GAP_SECONDS + 1
        assert not coord.is_polling("w1")

    asyncio.run(run())


def test_entity_events_still_win_over_the_token(coordinator) -> None:
    """A wake that carries real events delivers them; the token rides along."""
    module, hass, coord = coordinator
    store = _FakeComplicationStore()
    coord.attach_complication_store(store)
    ent = "wrist_assistant.c5"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent], complications_token=0)
        c0 = body["next_cursor"]
        held = asyncio.create_task(
            _poll(coord, since=c0, entities=[ent], timeout=10, complications_token=0)
        )
        await asyncio.sleep(0.05)
        store.tokens["w1"] = 9
        _change(hass, coord, ent, "on")
        status, body = await asyncio.wait_for(held, timeout=2)
        assert status == 200
        assert [e["entity_id"] for e in body["events"]] == [ent]
        assert body["complications_token"] == 9

    asyncio.run(run())


def test_unrelated_changes_move_the_cursor_so_a_busy_house_never_resyncs(coordinator) -> None:
    """A watch whose own entities stay quiet must still keep up with the ring
    buffer. Before the fix a held poll timed out with a bare 204, the watch
    kept its old cursor, and once MAX_EVENTS_BUFFER unrelated changes passed
    it got a 410 and a full resync for nothing."""
    module, hass, coord = coordinator
    mine = "light.quiet"
    noisy = "sensor.presence_target_x"
    hass.states.set(mine, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[mine])
        cursor = body["next_cursor"]

        half = module.MAX_EVENTS_BUFFER // 2 + 100
        for round_ in range(3):
            for i in range(half):
                _change(hass, coord, noisy, f"{round_}-{i}")
            status, body = await asyncio.wait_for(
                _poll(coord, since=cursor, entities=[mine], timeout=1), timeout=3
            )
            assert status == 200, (round_, status, body)
            assert body["events"] == []
            assert body["resync_required"] is False
            assert body["next_cursor"] == coord._cursor
            assert "info_summary" not in body
            cursor = body["next_cursor"]

        # More than a full buffer of unrelated changes has passed, and the
        # watch's own change still arrives as a plain delta.
        _change(hass, coord, mine, "on")
        status, body = await _poll(coord, since=cursor, entities=[mine], timeout=0)
        assert status == 200, body
        assert [e["entity_id"] for e in body["events"]] == [mine]

    asyncio.run(run())


def test_quiet_house_still_answers_a_bare_204(coordinator) -> None:
    """Nothing changed anywhere: the timeout and the probe stay bodyless."""
    module, hass, coord = coordinator
    ent = "light.still"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=1), timeout=3
        )
        assert status == 204 and body is None
        status, body = await _poll(coord, since=c0, entities=[ent], timeout=0)
        assert status == 204 and body is None

    asyncio.run(run())


def test_probe_carries_the_moved_cursor_without_summary_work(coordinator) -> None:
    module, hass, coord = coordinator
    mine = "light.probe_me"
    hass.states.set(mine, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[mine])
        c0 = body["next_cursor"]
        for i in range(10):
            _change(hass, coord, "sensor.noise", str(i))
        status, body = await _poll(
            coord, since=c0, entities=[mine], timeout=0, include_summary=True
        )
        assert status == 200, body
        assert body["events"] == []
        assert body["next_cursor"] == c0 + 10
        assert "info_summary" not in body

    asyncio.run(run())


def test_a_change_in_the_timeout_tick_is_not_skipped(coordinator) -> None:
    """The cursor a timed-out poll hands back must not jump over a change to
    the watch's own entity that landed without waking the waiter."""
    module, hass, coord = coordinator
    mine = "light.racy"
    hass.states.set(mine, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[mine])
        c0 = body["next_cursor"]
        coord._wake_watchers_for_entity = lambda entity_id: None
        _change(hass, coord, "sensor.noise", "1")
        _change(hass, coord, mine, "on")
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[mine], timeout=1), timeout=3
        )
        assert status == 200, body
        assert [e["entity_id"] for e in body["events"]] == [mine]
        assert body["next_cursor"] == coord._cursor

    asyncio.run(run())


def test_buffer_builds_payloads_only_for_changes_a_watch_reads(coordinator) -> None:
    """The buffer keeps HA's State and builds a payload on first read. A
    change nobody follows is never copied, and each buffered change still
    reports its own state, not the entity's latest one."""
    module, hass, coord = coordinator
    mine = "light.followed"
    hass.states.set(mine, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[mine])
        c0 = body["next_cursor"]

        for i in range(50):
            _change(hass, coord, "sensor.noise", str(i))
        _change(hass, coord, mine, "on")
        _change(hass, coord, mine, "off")
        assert all(e.payload is None for e in coord._events)

        status, body = await _poll(coord, since=c0, entities=[mine], timeout=0)
        assert status == 200, body
        assert [e["state"] for e in body["events"]] == ["on", "off"]
        built = [e for e in coord._events if e.payload is not None]
        assert [e.entity_id for e in built] == [mine, mine]

        # A second read reuses the built payload rather than copying again.
        first = built[0].payload
        await _poll(coord, since=c0, entities=[mine], timeout=0)
        assert built[0].payload is first

    asyncio.run(run())


# ── watch config on the poll ───────────────────────────────────────────────
#
# The real WatchConfigStore and the real const.py, loaded into the same stub
# package as api.py, so the field, the 0 case and the wake are checked against
# the store a running integration has, not a stand-in that could drift.

_PKG_DIR = _API_PATH.parent


class _NoDiskStore:
    """``homeassistant.helpers.storage.Store`` with nothing behind it: these
    tests read the store in memory only."""

    def __init__(self, *_a: object, **_k: object) -> None:
        pass

    async def async_load(self):
        return None

    def async_delay_save(self, *_a: object, **_k: object) -> None:
        pass

    async def async_remove(self) -> None:
        pass


class _StoreHass:
    """Only ``async_create_task``, which a forget uses to remove a file. The
    file is not there, so the removal is closed unrun."""

    def async_create_task(self, coro, name: str | None = None, **_k: object) -> None:
        coro.close()


def _load_into_test_pkg(name: str):
    spec = importlib.util.spec_from_file_location(f"wa_test_pkg.{name}", _PKG_DIR / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[f"wa_test_pkg.{name}"] = module
    spec.loader.exec_module(module)
    return module


def _watch_config_store():
    """A loaded, empty WatchConfigStore. Call inside the coordinator fixture,
    whose teardown drops every module loaded here."""
    _stub("homeassistant.helpers.storage", Store=_NoDiskStore)
    const = _load_into_test_pkg("const")
    store_module = _load_into_test_pkg("watch_config_store")
    store = store_module.WatchConfigStore(_StoreHass())
    asyncio.run(store.async_load())
    return store, const


_HASH_1 = "1" * 64
_HASH_2 = "2" * 64


def _pages_doc(name: str = "Home") -> dict:
    return {
        "schemaVersion": 1,
        "pages": [{"id": "6F1C2D0E-0000-4000-8000-000000000001", "name": name, "items": []}],
    }


def _device_put(store, kind: str, owner: str = "w1", *, base: int = 0, digest: str = _HASH_1):
    document = {
        "pages": _pages_doc(),
        "behavior": {"wrapPages": True},
        "catalog": {"macros": [{"id": "m1", "name": "Morning"}]},
    }[kind]
    return store.put(
        owner, kind, document, document_hash=digest, base_revision=base, updated_by=owner
    )


def test_the_reply_names_the_signer_s_pages_and_behavior_revisions(coordinator) -> None:
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    ent = "wrist_assistant.wc1"
    hass.states.set(ent, "off")
    _device_put(store, "pages")
    _device_put(store, "pages", base=1, digest=_HASH_2)
    _device_put(store, "behavior")
    # Another owner's records never show on this watch's reply.
    _device_put(store, "pages", owner="w2")
    _device_put(store, "behavior", owner="w2")
    _device_put(store, "behavior", owner="w2", base=1, digest=_HASH_2)

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        assert status == 200
        assert body["watch_config"] == {"pages": 2, "behavior": 1}

        status, body = await _poll(coord, watch_id="w2", entities=[ent])
        assert body["watch_config"] == {"pages": 1, "behavior": 2}

    asyncio.run(run())


def test_an_owner_with_no_records_reads_zero_for_both(coordinator) -> None:
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    ent = "wrist_assistant.wc2"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        assert status == 200
        assert body["watch_config"] == {"pages": 0, "behavior": 0}

        # One kind saved, the other still 0.
        _device_put(store, "behavior")
        status, body = await _poll(coord, entities=[ent])
        assert body["watch_config"] == {"pages": 0, "behavior": 1}

    asyncio.run(run())


def test_the_catalog_is_never_named(coordinator) -> None:
    module, hass, coord = coordinator
    store, const = _watch_config_store()
    coord.attach_watch_config_store(store)
    ent = "wrist_assistant.wc3"
    hass.states.set(ent, "off")
    _device_put(store, "catalog")
    _device_put(store, "pages")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        assert body["watch_config"] == {"pages": 1, "behavior": 0}
        assert "catalog" not in body["watch_config"]

    asyncio.run(run())
    # The two kinds the reply names are the two the panel edits, which are
    # the two a watch applies.
    assert set(module.DELTA_WATCH_CONFIG_KINDS) == set(const.WATCH_CONFIG_PANEL_KINDS)


def test_no_store_or_an_unreadable_owner_leaves_the_field_out(coordinator) -> None:
    """0 means "no record". An owner whose file could not be read is not
    that, so its reply carries no field rather than a wrong one, and the
    poll itself still answers."""
    module, hass, coord = coordinator
    ent = "wrist_assistant.wc4"
    hass.states.set(ent, "off")
    store, _const = _watch_config_store()

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        assert status == 200 and "watch_config" not in body

        coord.attach_watch_config_store(store)
        store._failed_owners.add("w1")
        status, body = await _poll(coord, entities=[ent])
        assert status == 200 and "watch_config" not in body

    asyncio.run(run())


def test_a_save_wakes_the_owner_and_a_catalog_save_does_not(coordinator) -> None:
    """The listener setup adds: every saver of pages or behavior wakes that
    owner without re-arming the complication token, and a catalog save wakes
    nobody."""
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    woken: list[tuple[str, bool]] = []
    coord.wake_watch = lambda watch_id, *, renotify=False: woken.append((watch_id, renotify))
    store.async_add_listener(coord.watch_config_changed)

    _device_put(store, "pages")
    _device_put(store, "behavior", owner="w2")
    assert woken == [("w1", False), ("w2", False)]

    woken.clear()
    _device_put(store, "catalog")
    _device_put(store, "catalog", base=1, digest=_HASH_2)
    assert woken == []

    # The panel's own save and a restore wake the owner the same way.
    store.panel_save("w1", "pages", _pages_doc("Renamed"), base_revision=1)
    store.restore("w1", "pages", 1, base_revision=2)
    assert woken == [("w1", False), ("w1", False)]

    # A forget announces revision 0 for each kind it removed: the watch is
    # woken for pages and behavior, never for the catalog.
    woken.clear()
    store.forget_owner("w1")
    assert woken == [("w1", False)]


def test_the_capability_is_registered_at_setup() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    assert "register_capability(WATCH_CONFIG_DELTA_CAPABILITY)" in init
    assert 'WATCH_CONFIG_DELTA_CAPABILITY = "watch_config_delta"' in const
    # Setup wires the store in for the reply and the coordinator's listener
    # for the wake; the store itself never learns about the coordinator.
    assert "attach_watch_config_store(watch_config_store)" in init
    assert "async_add_listener(coordinator.watch_config_changed)" in init
    store_source = (_PKG_DIR / "watch_config_store.py").read_text()
    assert "wake_watch" not in store_source and "DeltaCoordinator" not in store_source


def test_the_capability_reaches_the_reply(coordinator) -> None:
    module, hass, coord = coordinator
    coord.register_capability("watch_config_delta")
    ent = "wrist_assistant.wc5"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        assert "watch_config_delta" in body["capabilities"]
        assert "watch_config_delta" in coord.capabilities

    asyncio.run(run())


def test_a_save_releases_the_parked_poll_with_the_new_revision(coordinator) -> None:
    """Save at t; an empty reply carrying the new revision arrives well inside
    a second, the waiter is gone, and the next poll parks normally."""
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    store.async_add_listener(coord.watch_config_changed)
    ent = "wrist_assistant.wc6"
    hass.states.set(ent, "off")
    _device_put(store, "pages")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]
        assert body["watch_config"] == {"pages": 1, "behavior": 0}

        held = asyncio.create_task(_poll(coord, since=c0, entities=[ent], timeout=10))
        await asyncio.sleep(0.05)
        assert "w1" in coord._waiters

        started = hass.loop.time()
        store.panel_save("w1", "pages", _pages_doc("Renamed"), base_revision=1)
        status, body = await asyncio.wait_for(held, timeout=2)
        assert hass.loop.time() - started < 1.0
        assert status == 200, body
        assert body["events"] == []
        assert body["watch_config"] == {"pages": 2, "behavior": 0}
        assert "w1" not in coord._waiters

        # Told once: the next poll parks and times out quietly.
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=1), timeout=3
        )
        assert status == 204 and body is None

    asyncio.run(run())


def test_a_catalog_save_leaves_the_parked_poll_parked(coordinator) -> None:
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    store.async_add_listener(coord.watch_config_changed)
    ent = "wrist_assistant.wc7"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]
        held = asyncio.create_task(_poll(coord, since=c0, entities=[ent], timeout=1))
        await asyncio.sleep(0.05)
        _device_put(store, "catalog")
        status, body = await asyncio.wait_for(held, timeout=3)
        assert status == 204 and body is None

    asyncio.run(run())


def test_a_save_between_polls_is_answered_by_the_next_poll(coordinator) -> None:
    """No poll was parked when the save landed (the watch was between two
    requests): the wake was a no-op, so the next poll answers at once rather
    than holding the news for a whole poll window."""
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    store.async_add_listener(coord.watch_config_changed)
    ent = "wrist_assistant.wc8"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]
        assert "w1" not in coord._waiters
        _device_put(store, "behavior")

        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=10), timeout=1
        )
        assert status == 200 and body["events"] == []
        assert body["watch_config"] == {"pages": 0, "behavior": 1}

        # A probe from a watch that is behind gets the revision too.
        _device_put(store, "behavior", base=1, digest=_HASH_2)
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=0), timeout=1
        )
        assert status == 200 and body["watch_config"] == {"pages": 0, "behavior": 2}

    asyncio.run(run())


def test_a_watch_config_wake_does_not_re_arm_the_complication_token(coordinator) -> None:
    """renotify=False: a watch already told about its complication token is
    not told again because a page was saved. The reply that carries the new
    revision is the only one."""
    module, hass, coord = coordinator
    complications = _FakeComplicationStore()
    coord.attach_complication_store(complications)
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    store.async_add_listener(coord.watch_config_changed)
    ent = "wrist_assistant.wc9"
    hass.states.set(ent, "off")
    _device_put(store, "pages")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent], complications_token=0)
        c0 = body["next_cursor"]
        complications.tokens["w1"] = 2
        # Behind on complications: told once.
        status, body = await _poll(coord, since=c0, entities=[ent], timeout=10, complications_token=0)
        assert status == 200 and body["complications_token"] == 2
        assert coord._token_notified["w1"] == 2

        held = asyncio.create_task(
            _poll(coord, since=c0, entities=[ent], timeout=10, complications_token=0)
        )
        await asyncio.sleep(0.05)
        store.panel_save("w1", "pages", _pages_doc("Renamed"), base_revision=1)
        status, body = await asyncio.wait_for(held, timeout=2)
        assert status == 200 and body["watch_config"]["pages"] == 2
        assert coord._token_notified["w1"] == 2

        # Nothing new on either side: parks and times out.
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=1, complications_token=0), timeout=3
        )
        assert status == 204

    asyncio.run(run())


def test_prune_forgets_what_a_watch_was_told(coordinator) -> None:
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    ent = "wrist_assistant.wc10"
    hass.states.set(ent, "off")

    async def run() -> None:
        await _poll(coord, entities=[ent])
        assert "w1" in coord._watch_config_sent
        coord._sessions["w1"].last_seen -= module.SESSION_TTL + timedelta(seconds=1)
        coord._prune_sessions()
        assert "w1" not in coord._watch_config_sent

    asyncio.run(run())


def _forget_what_w1_was_told(module, coord) -> None:
    """Prune w1's session, which drops what it was told, as five idle minutes
    would."""
    coord._sessions["w1"].last_seen -= module.SESSION_TTL + timedelta(seconds=1)
    coord._prune_sessions()
    assert "w1" not in coord._watch_config_sent


def test_a_save_wakes_the_first_poll_after_a_prune(coordinator) -> None:
    """Nothing recorded for the watch when it parks: the poll records the
    current revisions first, so the save that wakes it is seen as news and
    answered at once rather than parking again."""
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    store.async_add_listener(coord.watch_config_changed)
    ent = "wrist_assistant.wc11"
    hass.states.set(ent, "off")
    _device_put(store, "pages")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]
        _forget_what_w1_was_told(module, coord)

        held = asyncio.create_task(_poll(coord, since=c0, entities=[ent], timeout=10))
        await asyncio.sleep(0.05)
        assert "w1" in coord._waiters and not held.done()
        assert coord._watch_config_sent["w1"] == {"pages": 1, "behavior": 0}

        started = hass.loop.time()
        store.panel_save("w1", "pages", _pages_doc("Renamed"), base_revision=1)
        status, body = await asyncio.wait_for(held, timeout=2)
        assert hass.loop.time() - started < 1.0
        assert status == 200, body
        assert body["events"] == []
        assert body["watch_config"] == {"pages": 2, "behavior": 0}

        # Told once: the next poll parks and times out quietly.
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=1), timeout=3
        )
        assert status == 204 and body is None

    asyncio.run(run())


def test_a_204_probe_records_what_a_later_save_is_compared_against(coordinator) -> None:
    """A probe that answers 204 carries no body, so the reply wrapper records
    nothing. The probe records the current revisions itself: a save landing
    before the next long poll is then news to that poll, which answers at
    once with the new revisions instead of parking on them."""
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    store.async_add_listener(coord.watch_config_changed)
    ent = "wrist_assistant.wc12"
    hass.states.set(ent, "off")
    _device_put(store, "behavior")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]
        _forget_what_w1_was_told(module, coord)

        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=0), timeout=1
        )
        assert status == 204 and body is None
        assert coord._watch_config_sent["w1"] == {"pages": 0, "behavior": 1}

        # The save lands between the probe and the long poll: no poll is
        # parked, so its wake is a no-op and the long poll must catch it.
        _device_put(store, "behavior", base=1, digest=_HASH_2)
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=10), timeout=1
        )
        assert status == 200 and body["events"] == []
        assert body["watch_config"] == {"pages": 0, "behavior": 2}

        # And a save while the next one is parked wakes it the same way.
        held = asyncio.create_task(_poll(coord, since=c0, entities=[ent], timeout=10))
        await asyncio.sleep(0.05)
        _device_put(store, "pages")
        status, body = await asyncio.wait_for(held, timeout=2)
        assert status == 200 and body["watch_config"] == {"pages": 1, "behavior": 2}

    asyncio.run(run())


def test_a_wake_with_an_unreadable_owner_file_leaves_the_poll_parked(coordinator) -> None:
    """The owner's file cannot be read when the wake arrives: there are no
    revisions to hand out, so the poll stays parked rather than answering
    with nothing new, and nothing raises."""
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    store.async_add_listener(coord.watch_config_changed)
    ent = "wrist_assistant.wc13"
    hass.states.set(ent, "off")
    _device_put(store, "pages")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]
        _forget_what_w1_was_told(module, coord)

        held = asyncio.create_task(_poll(coord, since=c0, entities=[ent], timeout=1))
        await asyncio.sleep(0.05)
        waiter = coord._waiters.get("w1")
        assert waiter is not None

        store._failed_owners.add("w1")
        store_module = sys.modules[type(store).__module__]
        coord.watch_config_changed(store_module.WatchConfigChange("w1", "pages", 2))
        await asyncio.sleep(0.05)
        assert not held.done(), "an unreadable owner file released the poll"
        assert coord._waiters.get("w1") is waiter

        status, body = await asyncio.wait_for(held, timeout=3)
        assert status == 204 and body is None

    asyncio.run(run())


def test_a_phone_put_through_the_op_wakes_the_parked_poll(coordinator) -> None:
    """The phone's save arrives through the real watch_config_put op, signed
    with the owner's id. The store announces it, the listener setup adds wakes the
    owner's parked poll, and that poll answers with the new revision."""
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    store.async_add_listener(coord.watch_config_changed)
    views = _op_handlers(sys.modules[type(store).__module__])
    ent = "wrist_assistant.wc14"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]
        assert body["watch_config"] == {"pages": 0, "behavior": 0}

        held = asyncio.create_task(_poll(coord, since=c0, entities=[ent], timeout=10))
        await asyncio.sleep(0.05)
        assert "w1" in coord._waiters

        reply = await views["_op_watch_config_put"](
            _OpCtx(store, "w1", _op_put_body(_pages_doc(), base=0, digest=_HASH_1))
        )
        assert reply.status == 200 and reply.body == {"ok": True, "revision": 1}

        status, body = await asyncio.wait_for(held, timeout=2)
        assert status == 200, body
        assert body["events"] == []
        assert body["watch_config"] == {"pages": 1, "behavior": 0}

    asyncio.run(run())
