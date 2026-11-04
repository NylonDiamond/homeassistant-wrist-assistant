"""``may_await_move`` on the delta poll.

The watch holds back its seeds for hours after an ``awaiting_move`` refusal.
This field is how it hears that the wait is over, so it can seed at once.
"""

from __future__ import annotations

import asyncio
from pathlib import Path

from test_delta_coordinator_inprocess import _poll, coordinator  # noqa: F401

_INIT = Path(__file__).parent.parent / "custom_components" / "wrist_assistant" / "__init__.py"


def test_every_watch_reply_with_a_body_carries_it_and_others_do_not(coordinator) -> None:  # noqa: F811
    _module, hass, coord = coordinator
    ent = "light.wait1"
    hass.states.set(ent, "off")

    async def run() -> None:
        # With nothing attached the field stays out, as on an older integration.
        _s, body = await _poll(coord, entities=[ent])
        assert "may_await_move" not in body
        waits = {"w1": True}
        coord.attach_move_wait(waits.get)
        _s, body = await _poll(coord, entities=[ent])
        assert body["may_await_move"] is True
        waits["w1"] = False
        _s, body = await _poll(coord, entities=[ent])
        assert body["may_await_move"] is False
        # An iPhone or an unknown id gets None from the lookup, so no field.
        _s, body = await _poll(coord, watch_id="iphone:1", entities=[ent])
        assert "may_await_move" not in body

    asyncio.run(run())


def test_a_lean_reply_keeps_it_whole(coordinator) -> None:  # noqa: F811
    _module, hass, coord = coordinator
    ent = "light.wait2"
    hass.states.set(ent, "off")
    coord.attach_move_wait(lambda _watch_id: False)

    async def run() -> None:
        _s, body = await _poll(coord, entities=[ent], lean=True, force_delta=True)
        assert body["may_await_move"] is False
        _s, body = await _poll(coord, entities=[ent], lean=True, force_delta=True)
        assert body["may_await_move"] is False

    asyncio.run(run())


def test_ending_the_wait_answers_the_parked_poll_at_once_and_once(coordinator) -> None:  # noqa: F811
    _module, hass, coord = coordinator
    ent = "light.wait3"
    hass.states.set(ent, "off")
    waits = {"w1": True}
    coord.attach_move_wait(waits.get)

    async def run() -> None:
        _s, body = await _poll(coord, entities=[ent])
        cursor = body["next_cursor"]
        parked = asyncio.create_task(_poll(coord, since=cursor, entities=[ent], timeout=10))
        await asyncio.sleep(0.05)
        assert "w1" in coord._waiters
        started = hass.loop.time()
        waits["w1"] = False
        coord.wake_watch("w1")
        status, body = await asyncio.wait_for(parked, timeout=3)
        assert status == 200 and body["events"] == [] and body["may_await_move"] is False
        assert hass.loop.time() - started < 1.5
        # Told: the next poll parks and times out quietly.
        status, body = await asyncio.wait_for(
            _poll(coord, since=cursor, entities=[ent], timeout=1), timeout=3
        )
        assert status == 204 and body is None

    asyncio.run(run())


def test_a_change_with_no_wake_is_found_by_the_next_poll(coordinator) -> None:  # noqa: F811
    """The grace ending moves the value with no wake."""
    _module, hass, coord = coordinator
    ent = "light.wait4"
    hass.states.set(ent, "off")
    waits = {"w1": True}
    coord.attach_move_wait(waits.get)

    async def run() -> None:
        _s, body = await _poll(coord, entities=[ent])
        cursor = body["next_cursor"]
        waits["w1"] = False
        status, body = await asyncio.wait_for(
            _poll(coord, since=cursor, entities=[ent], timeout=10), timeout=3
        )
        assert status == 200 and body["events"] == [] and body["may_await_move"] is False

    asyncio.run(run())


def test_setup_asks_the_store_for_a_watch_only() -> None:
    init = _INIT.read_text()
    assert "coordinator.attach_move_wait(" in init
    assert "widget_secret_store.is_paired_watch(watch_id)" in init
