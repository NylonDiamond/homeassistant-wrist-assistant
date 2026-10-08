"""In-process tests for the lean delta contract and the cleanup beside it.

Uses the coordinator fixture of ``test_delta_coordinator_inprocess.py`` (api.py
over stubbed Home Assistant modules) and pulls the delta view's input helpers
out of ``wa_v2_views.py`` by name.

Covered:

* ``caps_hash`` over the fixed vector, the same hex the watch's own test holds.
* Lean replies: what is left out when the device already holds it, what is
  filled in when it does not, the epoch, and the 410 for a cursor from
  another epoch. A poll without ``lean`` is answered exactly as before.
* ``attrs_full`` on every attribute set sent without a baseline.
* A lean watch's resent entity list keeps the baselines of the entities still
  in it; an older watch's resets them.
* A change that tells a watch nothing (same state, no attribute moved) is
  left out, and a woken poll with nothing else goes back to waiting.
* A woken poll waits WAKE_COALESCE_SECONDS, so a burst is one reply.
* The complication token: any reply carrying a token the watch has not
  applied counts as telling it, and a report still lagging after that is
  told once more.
* A held watch config revision is a confirmed delivery, clearing an
  unreadable report.
* A template that raised still re-renders when its entity changes.
* The first sync is logged once per device.
* The view's input caps and the lean fields it reads.
* The revision floor of the watch config store and the HTTP action library.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import types
from datetime import timedelta
from pathlib import Path
from typing import Any

import pytest

from test_delta_coordinator_inprocess import (  # noqa: F401
    _Event,
    _FakeComplicationStore,
    _State,
    _change,
    _device_put,
    _pages_doc,
    _poll,
    _watch_config_store,
    coordinator,
)
from test_http_actions import action, library
from test_http_actions_store import FakeStore, loaded_package, new_store

_VIEWS = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant" / "wa_v2_views.py"

CAPS_VECTOR_HEX = "d7d085b4544fef4a"


def _set(hass, coord, entity_id: str, state: str, attributes: dict | None = None):
    """Write a state with attributes and fire its change."""
    s = _State(entity_id, state, attributes)
    hass.states._by_id[entity_id] = s
    coord._handle_state_changed(_Event(s))
    return s


# ── caps_hash ────────────────────────────────────────────────────────────


def test_caps_hash_matches_the_fixed_vector(coordinator) -> None:
    module, _hass, coord = coordinator
    assert module.capabilities_hash(["gzip", "slim_payloads"]) == CAPS_VECTOR_HEX
    assert module.capabilities_hash(["slim_payloads", "gzip"]) == CAPS_VECTOR_HEX
    # Sorted before hashing: ["b", "a"] hashes "a,b".
    assert module.capabilities_hash(["b", "a"]) == module.capabilities_hash(["a", "b"])
    coord.register_capability("delta_lean")
    assert coord._caps_hash == module.capabilities_hash(coord.capabilities)


# ── lean replies ─────────────────────────────────────────────────────────


def _attach_numbers(coord, *, library_revision: int = 3, certificate: int = 7):
    coord.attach_http_actions_store(
        types.SimpleNamespace(available=True, revision=library_revision)
    )
    coord.attach_client_certificate_store(
        types.SimpleNamespace(available=True, revision=lambda _user: certificate),
        lambda _watch: "user-1",
    )


def test_a_lean_reply_leaves_out_what_the_device_holds(coordinator) -> None:
    module, hass, coord = coordinator
    complications = _FakeComplicationStore()
    complications.tokens["w1"] = 5
    coord.attach_complication_store(complications)
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    _device_put(store, "pages")
    _attach_numbers(coord)
    ent = "light.lean"
    hass.states.set(ent, "off")
    held = module.HeldConfig(
        watch_config={
            "pages": 1, "behavior": 0, "menus": 0, "voice": 0,
            "notification_style": 0, "status_pages": 0, "control_center": 0, "rooms": 0,
        },
        http_actions=3,
        client_certificate=7,
    )

    async def run() -> None:
        # First lean poll: no caps_hash, no epoch. The list, its hash and the
        # epoch are filled in; false flags are left out.
        status, body = await _poll(
            coord, entities=[ent], lean=True, held=held, complications_token=5
        )
        assert status == 200, body
        assert body["capabilities"] == coord.capabilities
        assert body["caps_hash"] == coord._caps_hash
        assert body["epoch"] == coord.epoch
        assert "need_entities" not in body and "resync_required" not in body
        assert [e["entity_id"] for e in body["events"]] == [ent]
        for key in ("watch_config", "http_actions", "client_certificate", "complications_token"):
            assert key not in body, key
        cursor = body["next_cursor"]

        # A quiet reply carrying a moved cursor, to a device holding it all.
        _change(hass, coord, "sensor.noise", "1")
        status, body = await _poll(
            coord, since=cursor, entities=[ent], timeout=0, lean=True, held=held,
            complications_token=5, caps_hash=coord._caps_hash, epoch=coord.epoch,
        )
        assert status == 200
        assert body == {"next_cursor": cursor + 1}

        # A kind, a number and the token that moved are the only ones named.
        store.panel_save("w1", "pages", _pages_doc("Renamed"), base_revision=1)
        coord._http_actions_store.revision = 4
        complications.tokens["w1"] = 6
        _change(hass, coord, "sensor.noise", "2")
        status, body = await _poll(
            coord, since=cursor + 1, entities=[ent], timeout=0, lean=True, held=held,
            complications_token=5, caps_hash=coord._caps_hash, epoch=coord.epoch,
        )
        assert status == 200
        assert body == {
            "next_cursor": cursor + 2,
            "watch_config": {"pages": 2},
            "http_actions": 4,
            "complications_token": 6,
        }

    asyncio.run(run())


def test_a_lean_reply_fills_in_a_stale_caps_hash_and_absent_numbers(coordinator) -> None:
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    _attach_numbers(coord)
    ent = "light.fill"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(
            coord, entities=[ent], lean=True, caps_hash="0000000000000000",
            held=module.HeldConfig(watch_config={"pages": 0}),
        )
        assert body["capabilities"] == coord.capabilities
        assert body["caps_hash"] == coord._caps_hash
        # Kinds the poll did not report count as different; pages matched.
        assert "pages" not in body["watch_config"]
        assert body["watch_config"]["menus"] == 0
        assert body["http_actions"] == 3 and body["client_certificate"] == 7

    asyncio.run(run())


def test_a_poll_without_lean_is_answered_as_before(coordinator) -> None:
    module, hass, coord = coordinator
    _attach_numbers(coord)
    ent = "light.old"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(
            coord, entities=[ent], caps_hash=coord._caps_hash, epoch="nope",
            held=module.HeldConfig(http_actions=3, client_certificate=7),
        )
        assert status == 200
        assert body["capabilities"] == coord.capabilities
        assert body["need_entities"] is False and body["resync_required"] is False
        assert body["http_actions"] == 3 and body["client_certificate"] == 7
        assert "epoch" not in body and "caps_hash" not in body
        cursor = body["next_cursor"]
        # An epoch on a poll without lean is never judged.
        status, body = await _poll(coord, since=cursor, entities=[ent], timeout=0, epoch="nope")
        assert status == 204

    asyncio.run(run())


def test_a_lean_cursor_from_another_epoch_answers_410(coordinator) -> None:
    _module, hass, coord = coordinator
    ent = "light.epoch"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent], lean=True)
        cursor = body["next_cursor"]
        assert body["epoch"] == coord.epoch

        status, body = await _poll(
            coord, since=cursor, entities=[ent], timeout=0, lean=True, epoch="0123456789abcdef"
        )
        assert status == 410, body
        assert body["resync_required"] is True
        assert body["epoch"] == coord.epoch
        assert "need_entities" not in body
        assert "events" not in body

        # A device with no session yet is also asked for its list.
        status, body = await _poll(
            coord, watch_id="w2", since=cursor, timeout=0, lean=True, epoch="0123456789abcdef"
        )
        assert status == 410 and body["need_entities"] is True

        # The right epoch, or none, is not judged.
        status, _ = await _poll(
            coord, since=cursor, entities=[ent], timeout=0, lean=True, epoch=coord.epoch
        )
        assert status == 204
        status, _ = await _poll(coord, since=cursor, entities=[ent], timeout=0, lean=True)
        assert status == 204

    asyncio.run(run())


def test_every_coordinator_has_its_own_epoch(coordinator) -> None:
    module, hass, coord = coordinator
    assert len(coord.epoch) == 16
    assert module.DeltaCoordinator(hass).epoch != coord.epoch


# ── attribute baselines ──────────────────────────────────────────────────


@pytest.mark.parametrize("compact", [False, True])
def test_full_attribute_sets_are_marked(coordinator, compact) -> None:
    _module, hass, coord = coordinator
    ent = "light.marked"
    hass.states._by_id[ent] = _State(ent, "off", {"brightness": 1})

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent], attribute_diffs=True, compact=compact)
        assert [e.get("attrs_full") for e in body["events"]] == [True]
        cursor = body["next_cursor"]

        # A diff against the snapshot's baseline is not marked.
        _set(hass, coord, ent, "on", {"brightness": 2})
        status, body = await _poll(
            coord, since=cursor, timeout=0, attribute_diffs=True, compact=compact
        )
        (event,) = body["events"]
        assert "attrs_full" not in event
        cursor = body["next_cursor"]

        # A change with no baseline (the session lapsed) is marked.
        coord._sessions["w1"].last_seen -= _module.SESSION_TTL + timedelta(seconds=1)
        coord._prune_sessions()
        _set(hass, coord, ent, "off", {"brightness": 3})
        await _poll(coord, since=cursor, entities=None)
        status, body = await _poll(
            coord, since=cursor, entities=[ent], timeout=0, attribute_diffs=True, compact=compact
        )
        (event,) = body["events"]
        assert event["attrs_full"] is True
        attrs = event["attributes"] if compact else event["new_state"]["attributes"]
        assert attrs == {"brightness": 3}

    asyncio.run(run())


def test_without_attribute_diffs_nothing_is_marked(coordinator) -> None:
    _module, hass, coord = coordinator
    ent = "light.plain"
    hass.states._by_id[ent] = _State(ent, "off", {"brightness": 1})

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        assert "attrs_full" not in body["events"][0]
        _set(hass, coord, ent, "on", {"brightness": 2})
        status, body = await _poll(coord, since=body["next_cursor"], entities=[ent], timeout=0)
        assert "attrs_full" not in body["events"][0]

    asyncio.run(run())


def test_a_lean_resent_list_keeps_the_baselines_still_in_it(coordinator) -> None:
    _module, hass, coord = coordinator
    a, b = "light.a", "light.b"
    hass.states._by_id[a] = _State(a, "off", {"brightness": 1, "friendly_name": "A"})
    hass.states._by_id[b] = _State(b, "off", {"brightness": 1})

    async def run() -> None:
        status, body = await _poll(coord, entities=[a, b], attribute_diffs=True, lean=True)
        cursor = body["next_cursor"]
        session = coord._sessions["w1"]
        assert set(session.last_sent_attrs) == {a, b}

        # The list is sent again without b: a's baseline stays, b's goes.
        status, _ = await _poll(
            coord, since=cursor, entities=[a], timeout=0, attribute_diffs=True, lean=True,
            epoch=coord.epoch,
        )
        assert set(session.last_sent_attrs) == {a} and set(session.last_sent_state) == {a}
        _set(hass, coord, a, "on", {"brightness": 2, "friendly_name": "A"})
        status, body = await _poll(
            coord, since=cursor, entities=[a], timeout=0, attribute_diffs=True, lean=True,
            epoch=coord.epoch,
        )
        (event,) = body["events"]
        assert event["new_state"]["attributes"] == {"brightness": 2}
        assert "attrs_full" not in event

    asyncio.run(run())


def test_an_older_watch_s_resent_list_resets_the_baselines(coordinator) -> None:
    """An older watch empties its attribute cache whenever it sends its list
    (each loop start) and keeps its cursor, so it must get full sets again."""
    _module, hass, coord = coordinator
    a = "light.a"
    hass.states._by_id[a] = _State(a, "off", {"brightness": 1, "friendly_name": "A"})

    async def run() -> None:
        status, body = await _poll(coord, entities=[a], attribute_diffs=True)
        cursor = body["next_cursor"]
        _set(hass, coord, a, "on", {"brightness": 2, "friendly_name": "A"})
        status, body = await _poll(
            coord, since=cursor, entities=[a], timeout=0, attribute_diffs=True
        )
        (event,) = body["events"]
        assert event["new_state"]["attributes"] == {"brightness": 2, "friendly_name": "A"}
        assert event["attrs_full"] is True

    asyncio.run(run())


@pytest.mark.parametrize("cause", ["attrs_reset", "lost_reply", "no_diffs"])
def test_baselines_go_when_the_device_cannot_hold_them(coordinator, cause) -> None:
    """A lean watch keeps its cursor and its list, so the session's baselines
    must follow its attribute cache: they go when it says it emptied the cache,
    when it polls from before a reply written with diffs (that reply never
    reached it), and when it polls without diffs."""
    _module, hass, coord = coordinator
    a = "light.a"
    hass.states._by_id[a] = _State(a, "off", {"brightness": 1, "friendly_name": "A"})
    lean = {"attribute_diffs": True, "lean": True, "entities": None, "timeout": 0}

    async def run() -> None:
        _, body = await _poll(coord, entities=[a], attribute_diffs=True, lean=True)
        cursor = body["next_cursor"]
        _set(hass, coord, a, "on", {"brightness": 2, "friendly_name": "A"})
        _, body = await _poll(coord, since=cursor, epoch=coord.epoch, **lean)
        (event,) = body["events"]
        assert "attrs_full" not in event
        sent_from = cursor
        cursor = body["next_cursor"]

        extra: dict[str, Any] = {}
        since = cursor
        if cause == "attrs_reset":
            extra["attrs_reset"] = True
        elif cause == "lost_reply":
            # The reply above never arrived: the device polls from before it.
            since = sent_from
        else:
            _, _ = await _poll(
                coord, since=cursor, epoch=coord.epoch, timeout=0, lean=True
            )
        _set(hass, coord, a, "on", {"brightness": 3, "friendly_name": "A"})
        _, body = await _poll(coord, since=since, epoch=coord.epoch, **{**lean, **extra})
        # A lost reply's change comes again first, now as a full set; the one
        # after it diffs against that.
        first, *rest = body["events"]
        assert first["attrs_full"] is True
        assert first["new_state"]["attributes"]["friendly_name"] == "A"
        assert [e["new_state"]["attributes"] for e in rest] == (
            [{"brightness": 3}] if cause == "lost_reply" else []
        )

    asyncio.run(run())


def test_a_poll_from_the_last_reply_keeps_the_baselines(coordinator) -> None:
    _module, hass, coord = coordinator
    a = "light.a"
    hass.states._by_id[a] = _State(a, "off", {"brightness": 1, "friendly_name": "A"})

    async def run() -> None:
        _, body = await _poll(coord, entities=[a], attribute_diffs=True, lean=True)
        cursor = body["next_cursor"]
        for level in (2, 3):
            _set(hass, coord, a, "on", {"brightness": level, "friendly_name": "A"})
            _, body = await _poll(
                coord, since=cursor, epoch=coord.epoch, timeout=0,
                attribute_diffs=True, lean=True,
            )
            (event,) = body["events"]
            assert "attrs_full" not in event
            assert event["new_state"]["attributes"] == {"brightness": level}
            cursor = body["next_cursor"]

    asyncio.run(run())


# ── no-op changes and the coalesce ───────────────────────────────────────


def test_a_change_that_tells_the_watch_nothing_is_left_out(coordinator) -> None:
    _module, hass, coord = coordinator
    ent = "sensor.same"
    hass.states._by_id[ent] = _State(ent, "21", {"unit_of_measurement": "C"})

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent], attribute_diffs=True)
        cursor = body["next_cursor"]

        # Same state, same attributes (only last_updated moved): left out,
        # and the cursor still moves past it.
        _set(hass, coord, ent, "21", {"unit_of_measurement": "C"})
        status, body = await _poll(coord, since=cursor, timeout=0, attribute_diffs=True)
        assert status == 200 and body["events"] == []
        assert body["next_cursor"] == cursor + 1

        # An attribute that moved, or a new state, is sent.
        _set(hass, coord, ent, "21", {"unit_of_measurement": "F"})
        _set(hass, coord, ent, "22", {"unit_of_measurement": "F"})
        status, body = await _poll(coord, since=cursor + 1, timeout=0, attribute_diffs=True)
        assert [e["state"] for e in body["events"]] == ["21", "22"]

    asyncio.run(run())


def test_without_attribute_diffs_a_repeat_is_still_sent(coordinator) -> None:
    _module, hass, coord = coordinator
    ent = "sensor.same2"
    hass.states._by_id[ent] = _State(ent, "21")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent])
        _set(hass, coord, ent, "21")
        status, body = await _poll(coord, since=body["next_cursor"], entities=[ent], timeout=0)
        assert [e["state"] for e in body["events"]] == ["21"]

    asyncio.run(run())


def test_a_poll_woken_only_by_no_ops_goes_back_to_waiting(coordinator) -> None:
    module, hass, coord = coordinator
    ent = "sensor.wait"
    hass.states._by_id[ent] = _State(ent, "1", {"unit_of_measurement": "W"})

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent], attribute_diffs=True)
        cursor = body["next_cursor"]
        held = asyncio.create_task(
            _poll(coord, since=cursor, timeout=10, attribute_diffs=True)
        )
        await asyncio.sleep(0.05)
        _set(hass, coord, ent, "1", {"unit_of_measurement": "W"})
        await asyncio.sleep(module.WAKE_COALESCE_SECONDS + 0.2)
        assert not held.done(), "a no-op change answered the poll"
        assert coord._waiters.get("w1") is not None

        _set(hass, coord, ent, "2", {"unit_of_measurement": "W"})
        status, body = await asyncio.wait_for(held, timeout=2)
        assert status == 200
        assert [e["state"] for e in body["events"]] == ["2"]
        assert body["next_cursor"] == coord._cursor

    asyncio.run(run())


def test_a_poll_with_only_no_ops_still_ends_inside_its_timeout(coordinator) -> None:
    _module, hass, coord = coordinator
    ent = "sensor.wait2"
    hass.states._by_id[ent] = _State(ent, "1")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent], attribute_diffs=True)
        cursor = body["next_cursor"]
        started = hass.loop.time()
        held = asyncio.create_task(_poll(coord, since=cursor, timeout=1, attribute_diffs=True))
        await asyncio.sleep(0.05)
        _set(hass, coord, ent, "1")
        status, body = await asyncio.wait_for(held, timeout=3)
        assert hass.loop.time() - started < 1.5
        # The cursor moved past the no-op, so a small 200 hands it back.
        assert status == 200 and body["events"] == []
        assert body["next_cursor"] == cursor + 1

    asyncio.run(run())


def test_a_burst_after_a_wake_goes_out_as_one_reply(coordinator) -> None:
    module, hass, coord = coordinator
    a, b = "light.scene_a", "light.scene_b"
    hass.states.set(a, "off")
    hass.states.set(b, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[a, b])
        cursor = body["next_cursor"]
        held = asyncio.create_task(_poll(coord, since=cursor, entities=[a, b], timeout=10))
        await asyncio.sleep(0.05)
        started = hass.loop.time()
        _change(hass, coord, a, "on")
        await asyncio.sleep(0.05)
        _change(hass, coord, b, "on")
        status, body = await asyncio.wait_for(held, timeout=2)
        assert hass.loop.time() - started >= module.WAKE_COALESCE_SECONDS
        assert [e["entity_id"] for e in body["events"]] == [a, b]

    asyncio.run(run())


def test_a_probe_and_a_snapshot_do_not_wait(coordinator) -> None:
    _module, hass, coord = coordinator
    ent = "light.fast"
    hass.states.set(ent, "off")

    async def run() -> None:
        started = hass.loop.time()
        status, body = await _poll(coord, entities=[ent])
        _change(hass, coord, ent, "on")
        await _poll(coord, since=body["next_cursor"], entities=[ent], timeout=0)
        assert hass.loop.time() - started < 0.1

    asyncio.run(run())


# ── the complication token ───────────────────────────────────────────────


def test_any_reply_carrying_a_new_token_counts_as_telling(coordinator) -> None:
    """The token rode an event reply; the next poll still lagging is told once
    more (the reply may have been lost), and then the poll parks."""
    _module, hass, coord = coordinator
    complications = _FakeComplicationStore()
    coord.attach_complication_store(complications)
    ent = "light.tok"
    hass.states.set(ent, "off")

    async def run() -> None:
        status, body = await _poll(coord, entities=[ent], complications_token=0)
        cursor = body["next_cursor"]
        complications.tokens["w1"] = 9
        _change(hass, coord, ent, "on")
        status, body = await _poll(
            coord, since=cursor, entities=[ent], timeout=0, complications_token=0
        )
        assert body["complications_token"] == 9 and body["events"]
        assert coord._token_notified["w1"] == 9
        cursor = body["next_cursor"]

        status, body = await asyncio.wait_for(
            _poll(coord, since=cursor, entities=[ent], timeout=10, complications_token=0),
            timeout=1,
        )
        assert status == 200 and body["complications_token"] == 9
        assert coord._token_repeated["w1"] == 9

        status, body = await asyncio.wait_for(
            _poll(coord, since=cursor, entities=[ent], timeout=1, complications_token=0),
            timeout=3,
        )
        assert status == 204

        # A watch that applied it is never told again.
        status, _ = await _poll(
            coord, since=cursor, entities=[ent], timeout=0, complications_token=9
        )
        assert status == 204

    asyncio.run(run())


# ── a held revision confirms delivery ────────────────────────────────────


def test_a_held_revision_clears_an_unreadable_report(coordinator) -> None:
    module, hass, coord = coordinator
    store, _const = _watch_config_store()
    coord.attach_watch_config_store(store)
    _device_put(store, "pages")
    revision = store.get("w1", "pages").revision
    assert store.report_unreadable("w1", "pages", revision) is True
    assert store.get("w1", "pages").rejected_revision == revision
    ent = "light.m15"
    hass.states.set(ent, "off")

    async def run() -> None:
        # A report that does not match the stored revision changes nothing.
        await _poll(coord, entities=[ent], held=module.HeldConfig(watch_config={"pages": 0}))
        assert store.get("w1", "pages").rejected_revision == revision
        # One that does is a confirmed delivery.
        await _poll(
            coord, entities=[ent], held=module.HeldConfig(watch_config={"pages": revision})
        )
        record = store.get("w1", "pages")
        assert record.rejected_revision == 0
        assert record.delivered_revision == revision

    asyncio.run(run())


# ── templates ────────────────────────────────────────────────────────────


class _RenderInfo:
    def __init__(self, value: Any, entities: set[str]) -> None:
        self._value = value
        self.entities = entities
        self.domains: set[str] = set()
        self.all_states = False

    def result(self) -> Any:
        if isinstance(self._value, Exception):
            raise self._value
        return self._value


def test_a_template_that_raised_renders_again_when_its_entity_changes(coordinator) -> None:
    module, hass, coord = coordinator
    sensor = "sensor.source"
    hass.states.set(sensor, "unavailable")

    class _Template:
        def __init__(self, source: str, _hass: Any) -> None:
            self.source = source

        def async_render_to_info(self) -> _RenderInfo:
            state = hass.states.get(sensor).state
            if state == "unavailable":
                return _RenderInfo(ValueError("float of unavailable"), {sensor})
            return _RenderInfo(f"{state} W", {sensor})

    module.Template = _Template

    async def run() -> None:
        status, body = await _poll(
            coord, entities=[], templates={"t1": "{{ states('sensor.source') | float }}"}
        )
        (event,) = body["events"]
        assert event == {"entity_id": "template.t1", "lines": [], "last_updated": event["last_updated"]}
        assert coord._sessions["w1"].template_deps["t1"].entities == frozenset({sensor})

        _change(hass, coord, sensor, "40")
        status, body = await _poll(coord, since=body["next_cursor"], timeout=0)
        assert [e["lines"] for e in body["events"]] == [["40 W"]]

    asyncio.run(run())


# ── the first sync is logged once ────────────────────────────────────────


def test_the_first_sync_is_logged_once_per_device(coordinator) -> None:
    module, hass, coord = coordinator
    logged: list[str] = []
    module.log_first_sync = lambda _hass, *, watch_id: logged.append(watch_id)
    ent = "light.log"
    hass.states.set(ent, "off")

    async def run() -> None:
        await _poll(coord, entities=[ent])
        coord._sessions["w1"].last_seen -= module.SESSION_TTL + timedelta(seconds=1)
        coord._prune_sessions()
        await _poll(coord, entities=[ent])
        await _poll(coord, watch_id="w2", entities=[ent])
        assert logged == ["w1", "w2"]
        # A device removed and paired again is a first sync again.
        coord.drop_session("w1")
        await _poll(coord, entities=[ent])
        assert logged == ["w1", "w2", "w1"]

    asyncio.run(run())


# ── the view's input caps and lean fields ────────────────────────────────


def _view_helpers() -> dict[str, Any]:
    names = {
        "_read_capped_body",
        "_delta_over_caps",
        "_lean_request",
        "DELTA_MAX_BODY_BYTES",
        "DELTA_MAX_ENTITIES",
        "DELTA_MAX_TEMPLATES",
        "DELTA_MAX_TEMPLATE_CHARS",
        "DELTA_MAX_SUMMARY_ENTITIES",
        "DELTA_MAX_CUSTOM_ENTITIES",
        "_DELTA_TOKEN_MAX_CHARS",
    }
    tree = ast.parse(_VIEWS.read_text(), filename=str(_VIEWS))
    wanted = [
        node
        for node in tree.body
        if (isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in names)
        or (
            isinstance(node, ast.Assign)
            and isinstance(node.targets[0], ast.Name)
            and node.targets[0].id in names
        )
    ]
    assert len(wanted) == len(names)
    namespace: dict[str, Any] = {"Any": Any, "Request": object}
    exec(  # noqa: S102
        compile(
            ast.Module(body=wanted, type_ignores=[]),
            str(_VIEWS),
            "exec",
            flags=__future__.annotations.compiler_flag,
            dont_inherit=True,
        ),
        namespace,
    )
    return namespace


class _Content:
    def __init__(self, data: bytes) -> None:
        self._data = data
        self.read_total = 0

    async def read(self, n: int) -> bytes:
        chunk, self._data = self._data[:n], self._data[n:]
        self.read_total += len(chunk)
        return chunk


def test_a_body_over_the_cap_is_refused_before_it_is_read() -> None:
    views = _view_helpers()
    limit = views["DELTA_MAX_BODY_BYTES"]
    assert limit == 256 * 1024
    read = views["_read_capped_body"]

    big = types.SimpleNamespace(content_length=limit + 1, content=_Content(b"x" * (limit + 1)))
    assert asyncio.run(read(big, limit)) is None
    assert big.content.read_total == 0

    # No declared length: read only up to the cap.
    chunked = types.SimpleNamespace(content_length=None, content=_Content(b"x" * (limit * 4)))
    assert asyncio.run(read(chunked, limit)) is None
    assert chunked.content.read_total <= limit + 64 * 1024

    fine = types.SimpleNamespace(content_length=5, content=_Content(b"hello"))
    assert asyncio.run(read(fine, limit)) == b"hello"


def test_over_cap_fields_are_refused() -> None:
    views = _view_helpers()
    over = views["_delta_over_caps"]
    assert over({"entities": ["light.a"] * 2000}) is None
    assert "entities" in over({"entities": ["light.a"] * 2001})
    assert over({"templates": {str(i): "x" for i in range(100)}}) is None
    assert "templates" in over({"templates": {str(i): "x" for i in range(101)}})
    assert over({"templates": {"t": "x" * 4096}}) is None
    assert "template" in over({"templates": {"t": "x" * 4097}})
    assert over({"summary_entities": {"light": ["l"] * 1000, "sensor": ["s"] * 1000}}) is None
    assert "summary_entities" in over(
        {"summary_entities": {"light": ["l"] * 1000, "sensor": ["s"] * 1001}}
    )
    assert over({"custom_entity_ids": ["x"] * 2000}) is None
    assert "custom_entity_ids" in over({"custom_entity_ids": ["x"] * 2001})
    assert over({}) is None


def test_the_view_reads_the_lean_fields_only_with_lean() -> None:
    lean = _view_helpers()["_lean_request"]
    assert lean({"caps_hash": "abc", "epoch": "def"}) == (False, None, None)
    assert lean({"lean": 1, "caps_hash": "abc"}) == (False, None, None)
    assert lean({"lean": True, "caps_hash": "abc", "epoch": "def"}) == (True, "abc", "def")
    assert lean({"lean": True, "caps_hash": "", "epoch": 4}) == (True, None, None)
    assert lean({"lean": True, "caps_hash": "x" * 65}) == (True, None, None)


def test_the_view_passes_the_lean_fields_and_caps_on() -> None:
    source = _VIEWS.read_text()
    assert "lean=lean," in source and "caps_hash=caps_hash," in source and "epoch=epoch," in source
    assert "_read_capped_body(request, DELTA_MAX_BODY_BYTES)" in source
    assert "status=413" in source
    assert "status if status == 204 else status" not in source


def test_the_lean_capability_is_registered_at_setup() -> None:
    init = (_VIEWS.parent / "__init__.py").read_text()
    assert 'coordinator.register_capability("delta_lean")' in init


# ── revision floors ──────────────────────────────────────────────────────


def test_a_library_revision_lost_in_a_hard_kill_is_never_handed_out_again() -> None:
    with loaded_package() as loaded:
        mod = loaded.store_mod
        # A fresh install counts from 1: nothing was ever handed out.
        first = new_store(mod)
        assert first.save(library(action()), base_revision=0) == 1
        assert "revision_floor" not in FakeStore.files[mod.HTTP_ACTIONS_STORAGE_KEY]

        # A restart sets a floor and writes it before handing anything out.
        FakeStore.deferred = True
        second = new_store(mod)
        floor = second._revision_floor
        assert floor >= 1 + mod._REVISION_MARGIN
        assert FakeStore.files[mod.HTTP_ACTIONS_STORAGE_KEY]["revision_floor"] == floor
        lost = second.save(library(action(name="Two")), base_revision=1)
        assert lost == floor + 1

        # Killed inside the debounce: the save never lands.
        FakeStore.pending.clear()
        FakeStore.deferred = False
        third = new_store(mod)
        assert third.revision == 1
        again = third.save(library(action(name="Three")), base_revision=1)
        assert again > lost


def test_a_watch_config_revision_lost_in_a_hard_kill_is_never_handed_out_again() -> None:
    from test_watch_config_store import INDEX_KEY, _FakeStore, _Hass, _loaded_module

    with _loaded_module() as mod:
        first = mod.WatchConfigStore(_Hass())
        asyncio.run(first.async_load())
        record = first.put(
            "watch-A", "behavior", {}, document_hash="1" * 64, base_revision=0,
            updated_by="watch-A",
        )
        assert record.revision == 1
        on_disk = {k: dict(v) if isinstance(v, dict) else v for k, v in _FakeStore.files.items()}

        second = mod.WatchConfigStore(_Hass())
        asyncio.run(second.async_load())
        floor = second._revision_floor
        assert floor >= 1 + mod._REVISION_MARGIN
        assert _FakeStore.files[INDEX_KEY]["revision_floor"] == floor
        lost = second.put(
            "watch-A", "behavior", {"wrapPages": True}, document_hash="2" * 64,
            base_revision=1, updated_by="watch-A",
        ).revision
        # A kind created in this run starts above the floor too.
        created = second.put(
            "watch-A", "voice", {"schemaVersion": 1, "phrases": []}, document_hash="3" * 64,
            base_revision=0, updated_by="watch-A",
        ).revision
        assert lost == floor + 1 and created == floor + 1

        # Killed inside the debounce: the owner file is as it was, but the
        # floor written at load is on disk.
        owner_key = mod._owner_key("watch-A")
        _FakeStore.files[owner_key] = on_disk[owner_key]
        third = mod.WatchConfigStore(_Hass())
        asyncio.run(third.async_load())
        assert third.get("watch-A", "behavior").revision == 1
        assert third.get("watch-A", "voice") is None
        again = third.put(
            "watch-A", "behavior", {"wrapPages": False}, document_hash="4" * 64,
            base_revision=1, updated_by="watch-A",
        ).revision
        voice = third.put(
            "watch-A", "voice", {"schemaVersion": 1, "phrases": []}, document_hash="5" * 64,
            base_revision=0, updated_by="watch-A",
        ).revision
        assert again > lost and voice > created

