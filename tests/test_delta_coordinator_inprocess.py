"""In-process tests for DeltaCoordinator's cursor and waiter bookkeeping.

These load ``api.py`` with stubbed Home Assistant modules (the same approach
as ``test_camera_stream.py``) so the idle-gap and superseded-poll logic can
be exercised deterministically, with no live HA and no 5 minute wait for
SESSION_TTL. The HTTP suite still covers the end-to-end behavior.

Covered:

* Idle gap: a state change that arrives while NO session exists is still
  buffered, and a watch resuming with its cursor collects it as a delta; a
  cursor older than the ring is told to resync.
* Superseded poll: an older long-poll for the same watch that finishes after
  a newer one has started must not evict the newer poll's waiter.
* Watch config on the poll: the signer's pages, behavior and menus revisions
  on every reply (0 with no record, never the catalog), and a save of any of
  them waking the owner's parked poll through the store listener, including
  a poll with nothing recorded yet (after a prune or a 204 probe), a phone's
  save through the real watch_config_put op, and the panel creating a paired
  watch's first menus. From step 4d batch 2 the field names six kinds: voice,
  notification style and status pages join the three, and the panel's first
  record of each wakes the parked poll. Control Center (step 4d batch 5) and
  a second home's rooms (step 8) make eight.
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


def test_a_change_with_no_session_reaches_the_returning_watch(coordinator) -> None:
    """Changes are buffered with or without a session. A watch back after
    SESSION_TTL with a good cursor is asked for its list at its own cursor,
    then collects exactly what changed while it was away: no 410, and no
    full snapshot."""
    module, hass, coord = coordinator
    ent = "wrist_assistant.t1"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        assert status == 200
        c0 = body["next_cursor"]

        # The session lapses: nobody is connected.
        coord._sessions["w1"].last_seen -= module.SESSION_TTL + timedelta(seconds=1)
        coord._prune_sessions()
        assert not coord._sessions

        # A change with nobody connected is still buffered.
        _change(hass, coord, ent, "on")
        assert [e.entity_id for e in coord._events] == [ent]

        # The watch comes back with its cursor and no list: asked for the
        # list, at its own cursor.
        status, body = await _poll(coord, since=c0, entities=None)
        assert status == 200, body
        assert body["need_entities"] is True
        assert body["resync_required"] is False
        assert body["next_cursor"] == c0

        # With the list it gets the change it missed, as a delta.
        status, body = await _poll(coord, since=c0, entities=[ent], timeout=0)
        assert status == 200, body
        assert {e["entity_id"]: e["state"] for e in body["events"]} == {ent: "on"}
        assert body["next_cursor"] == coord._cursor

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
    """A watch away for longer than SESSION_TTL while the house kept changing
    resumes from its cursor and is handed its own changes, the ones from
    before and after its session lapsed alike.

    Regression guard for `_bisect_cursor`, which once derived the deque index
    arithmetically from the oldest event's cursor: with changes on both sides
    of a lapsed session the computed index overshot and every poll answered
    200 with no events and next_cursor == since.
    """
    module, hass, coord = coordinator
    ent = "wrist_assistant.t6"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]

        _change(hass, coord, ent, "on")
        coord._sessions["w1"].last_seen -= module.SESSION_TTL + timedelta(seconds=1)
        coord._prune_sessions()
        assert not coord._sessions
        for _ in range(50):
            _change(hass, coord, "wrist_assistant.noise", "x")
        _change(hass, coord, ent, "off")
        assert len(coord._events) == 52

        status, body = await _poll(coord, since=c0, entities=[ent], force_delta=True)
        assert status == 200, body
        assert [e["state"] for e in body["events"]] == ["on", "off"]
        assert body["next_cursor"] == coord._cursor
        c1 = body["next_cursor"]

        # And a change after the resume arrives on the next poll.
        _change(hass, coord, ent, "on")
        status, body = await _poll(coord, since=c1, entities=[ent], force_delta=True)
        assert status == 200, body
        assert [e["entity_id"] for e in body["events"]] == [ent]
        assert body["next_cursor"] > c1

    asyncio.run(run())


def test_asking_for_the_list_keeps_the_device_at_its_own_cursor(coordinator) -> None:
    """A device whose session went away (here force_resync) polls again with
    its old cursor and no list. It is asked for the list, and the reply must
    hand back its own cursor, not the current one: the device keeps any cursor
    at or above its own, and with the current one it would never be sent the
    changes it has not seen yet."""
    _module, hass, coord = coordinator
    ent = "wrist_assistant.ne1"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]

        # A change the device has not collected yet, then its session goes.
        _change(hass, coord, ent, "on")
        for _ in range(5):
            _change(hass, coord, "wrist_assistant.noise", "x")
        coord.async_force_resync()
        assert not coord._sessions
        assert coord._cursor > c0

        status, body = await _poll(coord, since=c0, entities=None)
        assert status == 200, body
        assert body["need_entities"] is True
        assert body["resync_required"] is False
        assert body["next_cursor"] == c0

        # One more change while the device is sending its list.
        _change(hass, coord, "wrist_assistant.other", "on")

        status, body = await _poll(
            coord, since=body["next_cursor"], entities=[ent], force_delta=True
        )
        assert status == 200, body
        states = {e["entity_id"]: e["state"] for e in body["events"]}
        assert states == {ent: "on"}

    asyncio.run(run())


def test_asking_for_the_list_with_a_cursor_older_than_the_ring_answers_410(
    coordinator,
) -> None:
    """A device coming back with a cursor the ring no longer reaches back to
    must be told to resync, not asked for its list and moved past changes it
    can never be sent."""
    module, hass, coord = coordinator
    ent = "wrist_assistant.ne2"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]
        coord.async_force_resync()
        _change(hass, coord, ent, "on")
        for i in range(module.MAX_EVENTS_BUFFER + 1):
            _change(hass, coord, "wrist_assistant.noise", str(i))

        status, body = await _poll(coord, since=c0, entities=None)
        assert status == 410, body
        assert body["resync_required"] is True

        # The snapshot the device takes next ends the resync for good.
        status, body = await _poll(coord, since=None, entities=[ent])
        assert status == 200
        assert {e["entity_id"]: e["state"] for e in body["events"]} == {ent: "on"}
        c1 = body["next_cursor"]
        status, body = await _poll(coord, since=c1, entities=[ent], force_delta=True)
        assert status == 200, body
        assert body["resync_required"] is False

    asyncio.run(run())


@pytest.mark.parametrize("since", ["999", "not a number"])
def test_asking_for_the_list_with_a_cursor_this_server_never_issued_answers_410(
    coordinator, since
) -> None:
    """A cursor from before a Home Assistant restart (ahead of the current
    one) or one that does not parse is answered the way any poll would."""
    _module, _hass, coord = coordinator

    async def run() -> None:
        status, body = await _poll(coord, since=since, entities=None)
        assert status == 410, body
        assert body["resync_required"] is True

    asyncio.run(run())


def test_a_brand_new_device_is_asked_for_its_list_at_the_current_cursor(coordinator) -> None:
    """With no cursor of its own there is nothing to skip, so the reply keeps
    handing out the current cursor as it always has."""
    _module, hass, coord = coordinator
    ent = "wrist_assistant.ne3"
    hass.states.set(ent, "off")

    async def run() -> None:
        await _poll(coord, watch_id="other", entities=[ent])
        _change(hass, coord, ent, "on")
        status, body = await _poll(coord, since=None, entities=None)
        assert status == 200, body
        assert body["need_entities"] is True
        assert body["next_cursor"] == coord._cursor

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

        # Polling again at once (its pull is still running): parks, since the
        # telling is too fresh to have been lost.
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=1, complications_token=0),
            timeout=3,
        )
        assert status == 204

        # Still behind once the telling is old: told once more, in case the
        # first reply was lost in a half-open connection.
        coord._token_notified_at["w1"] -= module.TOKEN_REPEAT_AFTER_SECONDS
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=10, complications_token=0),
            timeout=1,
        )
        assert status == 200 and body["complications_token"] == 2

        # Still behind after that: parks and times out.
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


def test_a_watch_paired_again_hears_about_its_complications_on_its_next_poll(
    coordinator,
) -> None:
    """The test bed's sequence: a watch app reinstalled and paired again by
    code under the same id. Its first reply carries the token, but the new
    app learns the capability list from that same reply (and restarts its
    loop), so it can drop it. Its next poll, still lagging, used to park for
    a whole long poll because the first telling was under
    TOKEN_REPEAT_AFTER_SECONDS old. After a pairing it is told again at once,
    once."""
    module, hass, coord = coordinator
    store = _FakeComplicationStore()
    coord.attach_complication_store(store)
    ent = "wrist_assistant.repair"
    hass.states.set(ent, "off")
    store.tokens["w1"] = 9

    async def run() -> None:
        # The earlier app was current and was told about the token.
        status, body = await _poll(coord, entities=[ent], complications_token=9)
        coord._token_notified["w1"] = 9
        coord._token_notified_at["w1"] = hass.loop.time()

        coord.note_paired("w1")
        assert "w1" not in coord._token_notified

        # The new app's first poll: a snapshot carrying the token.
        status, body = await _poll(coord, entities=[ent], complications_token=0)
        assert status == 200 and body["complications_token"] == 9
        cursor = body["next_cursor"]

        # Its next poll, still at 0: answered at once with the token.
        status, body = await asyncio.wait_for(
            _poll(coord, since=cursor, entities=[ent], timeout=10, complications_token=0),
            timeout=1,
        )
        assert status == 200 and body["complications_token"] == 9

        # Once: a poll still lagging after that parks as before.
        status, body = await asyncio.wait_for(
            _poll(coord, since=cursor, entities=[ent], timeout=1, complications_token=0),
            timeout=3,
        )
        assert status == 204

    asyncio.run(run())


def test_only_the_first_telling_after_a_pairing_skips_the_wait(coordinator) -> None:
    """``note_paired`` changes only the first telling after a pairing; a later
    token is held back for TOKEN_REPEAT_AFTER_SECONDS as before."""
    module, hass, coord = coordinator
    store = _FakeComplicationStore()
    coord.attach_complication_store(store)
    ent = "wrist_assistant.norepair"
    hass.states.set(ent, "off")

    async def run() -> None:
        coord.note_paired("w1")
        status, body = await _poll(coord, entities=[ent], complications_token=0)
        cursor = body["next_cursor"]
        # The pairing's telling (token 0 to a watch at 0) told nothing, and
        # the flag waits for the first real one.
        store.tokens["w1"] = 1
        status, body = await _poll(coord, since=cursor, entities=[ent], timeout=10,
                                   complications_token=0)
        assert status == 200 and body["complications_token"] == 1
        assert "w1" not in coord._just_paired
        status, body = await _poll(coord, since=cursor, entities=[ent], timeout=10,
                                   complications_token=0)
        assert status == 200  # the one repeat, at once after a pairing
        store.tokens["w1"] = 2
        status, body = await _poll(coord, since=cursor, entities=[ent], timeout=10,
                                   complications_token=0)
        assert status == 200 and body["complications_token"] == 2
        status, body = await asyncio.wait_for(
            _poll(coord, since=cursor, entities=[ent], timeout=1, complications_token=0),
            timeout=3,
        )
        assert status == 204

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


def _watch_config_store(paired: frozenset[str] = frozenset()):
    """A loaded, empty WatchConfigStore. Call inside the coordinator fixture,
    whose teardown drops every module loaded here. ``paired`` is the owner
    ids its pairing check answers yes for, as the secret store would."""
    _stub("homeassistant.helpers.storage", Store=_NoDiskStore)
    const = _load_into_test_pkg("const")
    store_module = _load_into_test_pkg("watch_config_store")
    store = store_module.WatchConfigStore(_StoreHass(), is_paired=lambda owner: owner in paired)
    asyncio.run(store.async_load())
    return store, const


_HASH_1 = "1" * 64
_HASH_2 = "2" * 64


def _pages_doc(name: str = "Home") -> dict:
    return {
        "schemaVersion": 1,
        "pages": [{"id": "6F1C2D0E-0000-4000-8000-000000000001", "name": name, "items": []}],
    }


def _menus_doc(display_mode: str = "icons") -> dict:
    return {
        "schemaVersion": 1,
        "quickAction": {"schemaVersion": 1, "slots": [{"id": "S1", "position": "top"}]},
        "entityRadial": {"schemaVersion": 1, "lightSlots": [{"id": "S1"}]},
        "pageSwitcher": {"schemaVersion": 1, "displayMode": display_mode},
    }


def _revs(**given: int) -> dict:
    """The ``watch_config`` field: every kind a watch applies, 0 unless given."""
    revisions = {
        "pages": 0,
        "behavior": 0,
        "menus": 0,
        "voice": 0,
        "notification_style": 0,
        "status_pages": 0,
        "control_center": 0,
        "rooms": 0,
    }
    revisions.update(given)
    return revisions


def _device_put(store, kind: str, owner: str = "w1", *, base: int = 0, digest: str = _HASH_1):
    document = {
        "pages": _pages_doc(),
        "behavior": {"wrapPages": True},
        "catalog": {"macros": [{"id": "m1", "name": "Morning"}]},
        "menus": _menus_doc(),
        "voice": {"schemaVersion": 1, "phrases": [{"id": "P1", "message": "Hi"}]},
        "notification_style": {"schemaVersion": 1, "storedDeliveryMode": "direct"},
        "status_pages": {
            "schemaVersion": 1,
            "statusPages": [{"id": "SP1", "name": "Climate", "rows": [{"id": "R1"}]}],
        },
        "control_center": {
            "schemaVersion": 1,
            "entities": [
                {
                    "entityId": "light.kitchen",
                    "displayName": "Kitchen",
                    "iconName": "lightbulb.fill",
                    "domain": "light",
                }
            ],
        },
        "rooms": {"schemaVersion": 1, "roomQuickJumpMappings": {"kitchen": "P1"}},
    }[kind]
    return store.put(
        owner, kind, document, document_hash=digest, base_revision=base, updated_by=owner
    )


def test_the_reply_names_the_signer_s_pages_behavior_and_menus_revisions(coordinator) -> None:
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    ent = "wrist_assistant.wc1"
    hass.states.set(ent, "off")
    _device_put(store, "pages")
    _device_put(store, "pages", base=1, digest=_HASH_2)
    _device_put(store, "behavior")
    _device_put(store, "menus")
    _device_put(store, "menus", base=1, digest=_HASH_2)
    _device_put(store, "menus", base=2, digest=_HASH_1)
    # Another owner's records never show on this watch's reply.
    _device_put(store, "pages", owner="w2")
    _device_put(store, "behavior", owner="w2")
    _device_put(store, "behavior", owner="w2", base=1, digest=_HASH_2)

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        assert status == 200
        assert body["watch_config"] == _revs(pages=2, behavior=1, menus=3)

        status, body = await _poll(coord, watch_id="w2", entities=[ent])
        assert body["watch_config"] == _revs(pages=1, behavior=2, menus=0)

    asyncio.run(run())


def test_the_reply_names_the_voice_notification_style_and_status_pages(coordinator) -> None:
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    ent = "wrist_assistant.wc1b"
    hass.states.set(ent, "off")
    _device_put(store, "voice")
    _device_put(store, "notification_style")
    _device_put(store, "notification_style", base=1, digest=_HASH_2)
    _device_put(store, "status_pages")
    _device_put(store, "status_pages", base=1, digest=_HASH_2)
    _device_put(store, "status_pages", base=2, digest=_HASH_1)
    _device_put(store, "voice", owner="w2")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        assert status == 200
        assert body["watch_config"] == _revs(voice=1, notification_style=2, status_pages=3)
        assert list(body["watch_config"]) == [
            "pages",
            "behavior",
            "menus",
            "voice",
            "notification_style",
            "status_pages",
            "control_center",
            "rooms",
        ]

        status, body = await _poll(coord, watch_id="w2", entities=[ent])
        assert body["watch_config"] == _revs(voice=1)

    asyncio.run(run())


def test_the_reply_names_the_control_center_list(coordinator) -> None:
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    ent = "wrist_assistant.wc1c"
    hass.states.set(ent, "off")
    _device_put(store, "control_center")
    _device_put(store, "control_center", base=1, digest=_HASH_2)
    _device_put(store, "control_center", owner="w2")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        assert status == 200
        assert body["watch_config"] == _revs(control_center=2)

        status, body = await _poll(coord, watch_id="w2", entities=[ent])
        assert body["watch_config"] == _revs(control_center=1)

    asyncio.run(run())


def test_the_reply_names_a_second_home_s_rooms(coordinator) -> None:
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    ent = "wrist_assistant.wc1r"
    hass.states.set(ent, "off")
    _device_put(store, "rooms")
    _device_put(store, "rooms", base=1, digest=_HASH_2)
    _device_put(store, "rooms", owner="w2")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        assert status == 200
        assert body["watch_config"] == _revs(rooms=2)

        status, body = await _poll(coord, watch_id="w2", entities=[ent])
        assert body["watch_config"] == _revs(rooms=1)

    asyncio.run(run())


def test_an_owner_with_no_records_reads_zero_for_every_kind(coordinator) -> None:
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    ent = "wrist_assistant.wc2"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        assert status == 200
        assert body["watch_config"] == _revs(pages=0, behavior=0, menus=0)

        # One kind saved, the others still 0.
        _device_put(store, "behavior")
        status, body = await _poll(coord, entities=[ent])
        assert body["watch_config"] == _revs(pages=0, behavior=1, menus=0)

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
        assert body["watch_config"] == _revs(pages=1, behavior=0, menus=0)
        assert "catalog" not in body["watch_config"]

    asyncio.run(run())
    # The eight kinds the reply names are the eight the panel edits, which
    # are the eight a watch applies.
    assert module.DELTA_WATCH_CONFIG_KINDS == (
        "pages",
        "behavior",
        "menus",
        "voice",
        "notification_style",
        "status_pages",
        "control_center",
        "rooms",
    )
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
    """The listener setup adds: every saver of a kind a watch applies wakes
    that owner without re-arming the complication token, and a catalog save
    wakes nobody."""
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    woken: list[tuple[str, bool]] = []
    coord.wake_watch = lambda watch_id, *, renotify=False: woken.append((watch_id, renotify))
    store.async_add_listener(coord.watch_config_changed)

    _device_put(store, "pages")
    _device_put(store, "behavior", owner="w2")
    _device_put(store, "menus", owner="w3")
    _device_put(store, "voice", owner="w4")
    _device_put(store, "notification_style", owner="w5")
    _device_put(store, "status_pages", owner="w6")
    _device_put(store, "control_center", owner="w7")
    assert woken == [(f"w{n}", False) for n in range(1, 8)]

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
        assert body["watch_config"] == _revs(pages=1, behavior=0, menus=0)

        held = asyncio.create_task(_poll(coord, since=c0, entities=[ent], timeout=10))
        await asyncio.sleep(0.05)
        assert "w1" in coord._waiters

        started = hass.loop.time()
        store.panel_save("w1", "pages", _pages_doc("Renamed"), base_revision=1)
        status, body = await asyncio.wait_for(held, timeout=2)
        assert hass.loop.time() - started < 1.0
        assert status == 200, body
        assert body["events"] == []
        assert body["watch_config"] == _revs(pages=2, behavior=0, menus=0)
        assert "w1" not in coord._waiters

        # Told once: the next poll parks and times out quietly.
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=1), timeout=3
        )
        assert status == 204 and body is None

    asyncio.run(run())


def test_the_panel_s_first_menus_release_the_parked_poll(coordinator) -> None:
    """A watch with no phone holds no menus record. The panel creates
    revision 1 for it, and that wakes its parked poll with the new revision,
    which is how a phone-less watch learns of its first menus."""
    module, hass, coord = coordinator
    store, _const = _watch_config_store(paired=frozenset({"w1"}))
    coord.attach_watch_config_store(store)
    store.async_add_listener(coord.watch_config_changed)
    ent = "wrist_assistant.wc15"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]
        assert body["watch_config"] == _revs(pages=0, behavior=0, menus=0)

        held = asyncio.create_task(_poll(coord, since=c0, entities=[ent], timeout=10))
        await asyncio.sleep(0.05)
        assert "w1" in coord._waiters

        started = hass.loop.time()
        record = store.panel_save("w1", "menus", _menus_doc(), base_revision=0)
        assert (record.revision, record.updated_by) == (1, "panel")
        status, body = await asyncio.wait_for(held, timeout=2)
        assert hass.loop.time() - started < 1.0
        assert status == 200, body
        assert body["events"] == []
        assert body["watch_config"] == _revs(pages=0, behavior=0, menus=1)

        # A later panel save of the menus wakes it the same way.
        held = asyncio.create_task(_poll(coord, since=c0, entities=[ent], timeout=10))
        await asyncio.sleep(0.05)
        store.panel_save("w1", "menus", _menus_doc("text"), base_revision=1)
        status, body = await asyncio.wait_for(held, timeout=2)
        assert status == 200 and body["watch_config"]["menus"] == 2

    asyncio.run(run())


@pytest.mark.parametrize(
    ("kind", "document"),
    [
        ("voice", {"schemaVersion": 1, "phrases": [], "defaultTTSEngine": ""}),
        ("notification_style", {"schemaVersion": 1}),
        ("status_pages", {"schemaVersion": 1, "statusPages": []}),
        ("control_center", {"schemaVersion": 1, "entities": []}),
        ("rooms", {"schemaVersion": 1}),
    ],
)
def test_the_panel_s_first_batch_2_record_releases_the_parked_poll(
    coordinator, kind, document
) -> None:
    """The panel's "Start with the defaults" for a phone-less watch wakes its
    parked poll with revision 1 of that kind, as for the menus."""
    module, hass, coord = coordinator
    store, _const = _watch_config_store(paired=frozenset({"w1"}))
    coord.attach_watch_config_store(store)
    store.async_add_listener(coord.watch_config_changed)
    ent = "wrist_assistant.wc15b"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]
        assert body["watch_config"] == _revs()

        held = asyncio.create_task(_poll(coord, since=c0, entities=[ent], timeout=10))
        await asyncio.sleep(0.05)
        assert "w1" in coord._waiters
        record = store.panel_save("w1", kind, document, base_revision=0)
        assert (record.revision, record.updated_by) == (1, "panel")
        status, body = await asyncio.wait_for(held, timeout=2)
        assert status == 200, body
        assert body["watch_config"] == _revs(**{kind: 1})

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
        assert body["watch_config"] == _revs(pages=0, behavior=1, menus=0)

        # A probe from a watch that is behind gets the revision too.
        _device_put(store, "behavior", base=1, digest=_HASH_2)
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=0), timeout=1
        )
        assert status == 200 and body["watch_config"] == _revs(pages=0, behavior=2, menus=0)

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
        # Behind on complications: told once, and once more while the
        # report still lags.
        status, body = await _poll(coord, since=c0, entities=[ent], timeout=10, complications_token=0)
        assert status == 200 and body["complications_token"] == 2
        assert coord._token_notified["w1"] == 2
        coord._token_notified_at["w1"] -= module.TOKEN_REPEAT_AFTER_SECONDS
        status, body = await _poll(coord, since=c0, entities=[ent], timeout=10, complications_token=0)
        assert status == 200 and coord._token_repeated["w1"] == 2

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
        assert coord._watch_config_sent["w1"] == _revs(pages=1, behavior=0, menus=0)

        started = hass.loop.time()
        store.panel_save("w1", "pages", _pages_doc("Renamed"), base_revision=1)
        status, body = await asyncio.wait_for(held, timeout=2)
        assert hass.loop.time() - started < 1.0
        assert status == 200, body
        assert body["events"] == []
        assert body["watch_config"] == _revs(pages=2, behavior=0, menus=0)

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
        assert coord._watch_config_sent["w1"] == _revs(pages=0, behavior=1, menus=0)

        # The save lands between the probe and the long poll: no poll is
        # parked, so its wake is a no-op and the long poll must catch it.
        _device_put(store, "behavior", base=1, digest=_HASH_2)
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=10), timeout=1
        )
        assert status == 200 and body["events"] == []
        assert body["watch_config"] == _revs(pages=0, behavior=2, menus=0)

        # And a save while the next one is parked wakes it the same way.
        held = asyncio.create_task(_poll(coord, since=c0, entities=[ent], timeout=10))
        await asyncio.sleep(0.05)
        _device_put(store, "pages")
        status, body = await asyncio.wait_for(held, timeout=2)
        assert status == 200 and body["watch_config"] == _revs(pages=1, behavior=2, menus=0)

    asyncio.run(run())


def test_a_hint_lost_in_a_half_open_reply_reaches_the_next_poll(coordinator) -> None:
    """The save wakes poll A, whose reply goes into a dead connection: the
    server counts it as sent, the watch never reads it. Poll B reports the
    revisions the watch holds, which lag, so B is answered at once with the
    new ones instead of parking. Once per value: a report still lagging the
    same revision is not answered again."""
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    store.async_add_listener(coord.watch_config_changed)
    ent = "wrist_assistant.wc12b"
    hass.states.set(ent, "off")
    _device_put(store, "pages")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]
        assert body["watch_config"] == _revs(pages=1)

        lost = asyncio.create_task(_poll(coord, since=c0, entities=[ent], timeout=10))
        await asyncio.sleep(0.05)
        store.panel_save("w1", "pages", _pages_doc("Renamed"), base_revision=1)
        status, body = await asyncio.wait_for(lost, timeout=2)
        assert status == 200 and body["watch_config"] == _revs(pages=2)
        # The reply above never arrives. The server has it as sent.
        assert coord._watch_config_sent["w1"] == _revs(pages=2)

        holds_one = module.HeldConfig(watch_config=_revs(pages=1))
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=10, held=holds_one), timeout=1
        )
        assert status == 200 and body["events"] == []
        assert body["watch_config"] == _revs(pages=2)

        # Still reporting 1 (its pull failed, or this reply was lost too):
        # not answered again for the same revision.
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=0, held=holds_one), timeout=1
        )
        assert status == 204 and body is None

        # Caught up: nothing to tell.
        holds_two = module.HeldConfig(watch_config=_revs(pages=2))
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=0, held=holds_two), timeout=1
        )
        assert status == 204 and body is None

        # A probe whose report lags is answered with the revisions too, and
        # a kind the watch left out of its report is not judged.
        _device_put(store, "behavior")
        coord._watch_config_sent["w1"] = _revs(pages=2, behavior=1)
        status, body = await asyncio.wait_for(
            _poll(
                coord, since=c0, entities=[ent], timeout=0,
                held=module.HeldConfig(watch_config={"behavior": 0}),
            ),
            timeout=1,
        )
        assert status == 200 and body["watch_config"] == _revs(pages=2, behavior=1)
        status, body = await asyncio.wait_for(
            _poll(
                coord, since=c0, entities=[ent], timeout=0,
                held=module.HeldConfig(watch_config={"behavior": 1}),
            ),
            timeout=1,
        )
        assert status == 204 and body is None

    asyncio.run(run())


def test_a_lost_library_or_certificate_hint_reaches_the_next_poll(coordinator) -> None:
    """The same rule for the home's HTTP action library and the bound user's
    client certificate: a report that lags the current revision earns one
    immediate reply carrying it, and a poll that reports nothing is judged
    on what was sent, as before."""
    module, hass, coord = coordinator
    library = types.SimpleNamespace(available=True, revision=3)
    certificates = types.SimpleNamespace(available=True, revision=lambda _user: 5)
    coord.attach_http_actions_store(library)
    coord.attach_client_certificate_store(certificates, lambda _watch: "user-1")
    ent = "wrist_assistant.wc12c"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        c0 = body["next_cursor"]
        assert (body["http_actions"], body["client_certificate"]) == (3, 5)

        # No report: judged on what was sent, so nothing to tell.
        status, body = await _poll(coord, since=c0, entities=[ent], timeout=0)
        assert status == 204

        for held in (
            module.HeldConfig(http_actions=2),
            module.HeldConfig(client_certificate=4),
        ):
            status, body = await asyncio.wait_for(
                _poll(coord, since=c0, entities=[ent], timeout=10, held=held), timeout=1
            )
            assert status == 200 and body["events"] == []
            assert (body["http_actions"], body["client_certificate"]) == (3, 5)
            status, body = await _poll(coord, since=c0, entities=[ent], timeout=0, held=held)
            assert status == 204

        status, body = await _poll(
            coord, since=c0, entities=[ent], timeout=0,
            held=module.HeldConfig(http_actions=3, client_certificate=5),
        )
        assert status == 204

        # A new revision lagged by the report is news again.
        library.revision = 4
        status, body = await _poll(coord, since=c0, entities=[ent], timeout=0)
        assert status == 200 and body["http_actions"] == 4
        status, body = await _poll(
            coord, since=c0, entities=[ent], timeout=0,
            held=module.HeldConfig(http_actions=3),
        )
        assert status == 200 and body["http_actions"] == 4

        # Forgetting the device forgets the marks with it.
        coord._held_repeated["w1"] = {"http_actions": 4}
        coord.drop_session("w1")
        assert "w1" not in coord._held_repeated

    asyncio.run(run())


def test_the_delta_view_reads_what_the_device_holds() -> None:
    """The poll's ``watch_config``, ``http_actions`` and ``client_certificate``
    reach the coordinator as a HeldConfig, junk read as absent."""
    import ast

    source = (_PKG_DIR / "wa_v2_views.py").read_text()
    tree = ast.parse(source)
    wanted = {"_held_revision", "_held_revisions"}
    namespace: dict = {"Any": object}
    for node in tree.body:
        if isinstance(node, ast.FunctionDef) and node.name in wanted:
            exec(compile(ast.Module([node], []), "wa_v2_views.py", "exec"), namespace)
    held_revision, held_revisions = namespace["_held_revision"], namespace["_held_revisions"]
    assert held_revision(4) == 4 and held_revision(0) == 0
    for junk in (True, -1, "4", 4.0, None):
        assert held_revision(junk) is None
    assert held_revisions({"pages": 2, "menus": "x", "voice": True, 3: 1}) == {"pages": 2}
    assert held_revisions({"pages": "x"}) is None and held_revisions([1]) is None
    assert "held=held," in source
    assert 'watch_config=_held_revisions(payload.get("watch_config"))' in source


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
        assert body["watch_config"] == _revs(pages=0, behavior=0, menus=0)

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
        assert body["watch_config"] == _revs(pages=1, behavior=0, menus=0)

    asyncio.run(run())


# ── the watch's voice list on the poll ─────────────────────────────────────
#
# The real WatchVoicesStore, loaded like the watch config store above. A poll
# carrying `voices_hash` gets `voices_wanted: true` on a reply with a body
# while the hash is not the stored one; nothing else changes about the poll.


def _watch_voices_store():
    _stub("homeassistant.helpers.storage", Store=_NoDiskStore)
    _load_into_test_pkg("const")
    voices_module = _load_into_test_pkg("watch_voices_store")
    store = voices_module.WatchVoicesStore(_StoreHass())
    asyncio.run(store.async_load())
    return store, voices_module


_VOICES = [{"id": "com.apple.voice.compact.en-US.Samantha", "name": "Samantha",
            "language": "en-US", "quality": 1}]


def test_a_poll_with_a_hash_nothing_matches_is_asked_for_the_list(coordinator) -> None:
    module, hass, coord = coordinator
    store, voices_module = _watch_voices_store()
    coord.attach_watch_voices_store(store)
    ent = "wrist_assistant.wv1"
    hass.states.set(ent, "off")
    digest = voices_module.voices_hash(_VOICES)

    async def run() -> None:
        # Nothing stored yet.
        status, body = await _poll(coord, entities=[ent], voices_hash=digest)
        assert status == 200 and body["voices_wanted"] is True

        # The watch sends its list; the next poll's hash matches.
        store.put("w1", _VOICES)
        status, body = await _poll(coord, entities=[ent], voices_hash=digest)
        assert status == 200 and "voices_wanted" not in body

        # A voice installed on the watch changes its hash.
        status, body = await _poll(coord, entities=[ent], voices_hash="f" * 64)
        assert body["voices_wanted"] is True

        # Another watch's list is never this watch's answer.
        status, body = await _poll(coord, watch_id="w2", entities=[ent], voices_hash=digest)
        assert body["voices_wanted"] is True

    asyncio.run(run())


def test_a_poll_without_a_hash_is_never_asked(coordinator) -> None:
    """An older watch sends no hash and never learns the field."""
    module, hass, coord = coordinator
    store, _voices_module = _watch_voices_store()
    coord.attach_watch_voices_store(store)
    ent = "wrist_assistant.wv2"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        assert status == 200 and "voices_wanted" not in body

    asyncio.run(run())


def test_with_no_store_attached_nothing_is_asked(coordinator) -> None:
    module, hass, coord = coordinator
    ent = "wrist_assistant.wv3"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent], voices_hash="a" * 64)
        assert status == 200 and "voices_wanted" not in body

    asyncio.run(run())


def test_the_question_neither_wakes_nor_holds_a_poll(coordinator) -> None:
    """A parked poll with a stale hash times out quietly with a bodiless 204,
    like any other: the question rides the next reply that has a body."""
    module, hass, coord = coordinator
    store, _voices_module = _watch_voices_store()
    coord.attach_watch_voices_store(store)
    ent = "wrist_assistant.wv4"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent], voices_hash="a" * 64)
        c0 = body["next_cursor"]
        assert body["voices_wanted"] is True
        status, body = await asyncio.wait_for(
            _poll(coord, since=c0, entities=[ent], timeout=1, voices_hash="a" * 64), timeout=3
        )
        assert status == 204 and body is None
        _change(hass, coord, ent, "on")
        status, body = await _poll(coord, since=c0, entities=[ent], voices_hash="a" * 64)
        assert status == 200 and body["voices_wanted"] is True

    asyncio.run(run())


# ── dropping a removed device's session ──────────────────────────────────


def test_dropping_a_removed_device_ends_its_parked_poll_without_a_body(coordinator) -> None:
    """Both removal paths (HA's device page and the panel's Forget) drop the
    device's session before its secret goes. The parked poll ends with a
    bodiless 204, the device leaves `real_sessions` at once rather than after
    SESSION_TTL, and nothing the coordinator kept for it survives. The watch
    config forget that follows a removal saves and wakes the owner; with the
    waiter already gone it wakes nobody, so the removed device is never handed
    one more reply with a body."""
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    store.async_add_listener(coord.watch_config_changed)
    fired: list[str] = []
    coord.async_add_session_listener(lambda: fired.append("sessions"))
    ent = "wrist_assistant.drop1"
    hass.states.set(ent, "off")
    _device_put(store, "pages")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent], complications_token=0)
        c0 = body["next_cursor"]
        held = asyncio.create_task(_poll(coord, since=c0, entities=[ent], timeout=10))
        await asyncio.sleep(0.05)
        assert "w1" in coord._waiters and "w1" in coord.real_sessions
        assert "w1" in coord._watch_config_sent
        coord._token_notified["w1"] = 3
        coord._http_actions_sent["w1"] = 1
        coord._client_certificate_sent["w1"] = 1
        fired.clear()

        assert coord.drop_session("w1") is True
        # What the removal does next: the forget wakes the owner.
        store.forget_owner("w1")

        status, body = await asyncio.wait_for(held, timeout=2)
        assert status == 204 and body is None
        assert "w1" not in coord.real_sessions
        assert fired == ["sessions"]
        for kept in (
            coord._sessions,
            coord._waiters,
            coord._last_poll_at,
            coord._token_notified,
            coord._watch_config_sent,
            coord._http_actions_sent,
            coord._client_certificate_sent,
        ):
            assert "w1" not in kept
        assert all("w1" not in watchers for watchers in coord._entity_to_watchers.values())
        assert "w1" not in coord._domain_watchers
        assert "w1" not in coord._wake_all_watchers
        assert coord.is_polling("w1") is False

        # A state change now wakes nothing and recreates nothing.
        _change(hass, coord, ent, "on")
        assert "w1" not in coord._sessions

    asyncio.run(run())


def test_dropping_a_device_with_no_session_is_quiet(coordinator) -> None:
    """An iPhone never polls, and a watch may not have polled since a restart.
    Dropping either raises nothing and fires no session listener."""
    _module, _hass, coord = coordinator
    fired: list[str] = []
    coord.async_add_session_listener(lambda: fired.append("sessions"))
    assert coord.drop_session("iphone:never-polled") is False
    assert fired == []


def test_dropping_one_device_leaves_another_s_poll_parked(coordinator) -> None:
    module, hass, coord = coordinator
    ent = "wrist_assistant.drop2"
    hass.states.set(ent, "off")

    async def run() -> None:
        _status, body = await _poll(coord, watch_id="w1", entities=[ent])
        c1 = body["next_cursor"]
        _status, body = await _poll(coord, watch_id="w2", entities=[ent])
        c2 = body["next_cursor"]
        held_1 = asyncio.create_task(_poll(coord, watch_id="w1", since=c1, entities=[ent], timeout=10))
        held_2 = asyncio.create_task(_poll(coord, watch_id="w2", since=c2, entities=[ent], timeout=10))
        await asyncio.sleep(0.05)

        coord.drop_session("w1")
        status, body = await asyncio.wait_for(held_1, timeout=2)
        assert status == 204 and body is None
        assert not held_2.done()
        assert "w2" in coord._waiters and "w2" in coord.real_sessions

        _change(hass, coord, ent, "on")
        status, body = await asyncio.wait_for(held_2, timeout=2)
        assert status == 200
        assert [e["entity_id"] for e in body["events"]] == [ent]

    asyncio.run(run())


def test_a_poll_from_a_device_with_no_secret_opens_no_session(coordinator) -> None:
    """A request authenticates before it reaches the coordinator, and the view
    awaits a user check in between. A device removed during that await must
    not get a fresh session (and with it, entities and a registry device) or
    a reply with a body."""
    _module, hass, coord = coordinator
    known = {"w1"}
    coord.attach_device_check(lambda watch_id: watch_id in known)
    fired: list[str] = []
    coord.async_add_session_listener(lambda: fired.append("sessions"))
    ent = "wrist_assistant.drop3"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        assert status == 200 and body is not None
        coord.drop_session("w1")
        known.discard("w1")
        fired.clear()

        status, body = await _poll(coord, entities=[ent])
        assert status == 204 and body is None
        assert "w1" not in coord._sessions
        assert "w1" not in coord._last_poll_at
        assert fired == []

    asyncio.run(run())


def test_setup_wires_the_secret_store_in_as_the_device_check() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    assert "coordinator.attach_device_check(" in init
    assert "widget_secret_store.get(watch_id) is not None" in init
