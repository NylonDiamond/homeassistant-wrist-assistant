"""The home's HTTP action library on the delta poll (step 4d batch 4).

Every reply with a body names the library's revision as ``http_actions``,
and a save or a hand-over wakes every parked poll, which answers at once
with the new revision, once per change. Uses the in-process coordinator of
``test_delta_coordinator_inprocess.py`` and a real ``HTTPActionsStore``.
"""

from __future__ import annotations

import asyncio
from datetime import timedelta

from test_delta_coordinator_inprocess import _poll, coordinator  # noqa: F401
from test_http_actions import action, library
from test_http_actions_store import loaded_package, new_store


def test_every_reply_names_the_library_revision(coordinator) -> None:  # noqa: F811
    module, hass, coord = coordinator
    ent = "wrist_assistant.ha1"
    hass.states.set(ent, "off")
    with loaded_package() as pkg:
        store = new_store(pkg.store_mod)

        async def run() -> None:
            status, body = await _poll(coord, entities=[ent])
            assert "http_actions" not in body
            coord.attach_http_actions_store(store)
            status, body = await _poll(coord, entities=[ent])
            assert body["http_actions"] == 0
            store.save(library(action()), base_revision=0)
            status, body = await _poll(coord, entities=[ent])
            assert body["http_actions"] == 1

        asyncio.run(run())


def test_an_unreadable_library_leaves_the_field_out(coordinator) -> None:  # noqa: F811
    module, hass, coord = coordinator
    ent = "wrist_assistant.ha2"
    hass.states.set(ent, "off")
    with loaded_package() as pkg:
        store = new_store(pkg.store_mod)
        store._load_failed = True
        coord.attach_http_actions_store(store)

        async def run() -> None:
            status, body = await _poll(coord, entities=[ent])
            assert "http_actions" not in body

        asyncio.run(run())


def _wired(coord, pkg):
    store = new_store(pkg.store_mod)
    coord.attach_http_actions_store(store)
    store.async_add_listener(coord.http_actions_changed)
    return store


def test_a_save_releases_every_parked_poll_once(coordinator) -> None:  # noqa: F811
    module, hass, coord = coordinator
    ent = "wrist_assistant.ha3"
    hass.states.set(ent, "off")
    with loaded_package() as pkg:
        store = _wired(coord, pkg)

        async def run() -> None:
            _s, body = await _poll(coord, watch_id="w1", entities=[ent])
            c1 = body["next_cursor"]
            _s, body = await _poll(coord, watch_id="w2", entities=[ent])
            c2 = body["next_cursor"]
            held = [
                asyncio.create_task(_poll(coord, watch_id="w1", since=c1, entities=[ent], timeout=10)),
                asyncio.create_task(_poll(coord, watch_id="w2", since=c2, entities=[ent], timeout=10)),
            ]
            await asyncio.sleep(0.05)
            assert {"w1", "w2"} <= set(coord._waiters)
            started = hass.loop.time()
            store.save(library(action()), base_revision=0)
            for task in held:
                status, body = await asyncio.wait_for(task, timeout=2)
                assert status == 200 and body["events"] == []
                assert body["http_actions"] == 1
            assert hass.loop.time() - started < 1.0
            # Told once: the next poll parks and times out quietly.
            status, body = await asyncio.wait_for(
                _poll(coord, watch_id="w1", since=c1, entities=[ent], timeout=1), timeout=3
            )
            assert status == 204 and body is None

        asyncio.run(run())


def test_a_hand_over_wakes_the_poll_and_an_empty_one_does_not(coordinator) -> None:  # noqa: F811
    module, hass, coord = coordinator
    ent = "wrist_assistant.ha4"
    hass.states.set(ent, "off")
    with loaded_package() as pkg:
        store = _wired(coord, pkg)

        async def run() -> None:
            _s, body = await _poll(coord, entities=[ent])
            c0 = body["next_cursor"]
            store.hand_over("phone-of-w9", library())
            status, body = await asyncio.wait_for(
                _poll(coord, since=c0, entities=[ent], timeout=1), timeout=3
            )
            assert status == 204
            held = asyncio.create_task(_poll(coord, since=c0, entities=[ent], timeout=10))
            await asyncio.sleep(0.05)
            store.hand_over("phone-of-w8", library(action()))
            status, body = await asyncio.wait_for(held, timeout=2)
            assert status == 200 and body["http_actions"] == 1

        asyncio.run(run())


def test_a_change_between_polls_is_answered_by_the_next_poll(coordinator) -> None:  # noqa: F811
    module, hass, coord = coordinator
    ent = "wrist_assistant.ha5"
    hass.states.set(ent, "off")
    with loaded_package() as pkg:
        store = _wired(coord, pkg)

        async def run() -> None:
            _s, body = await _poll(coord, entities=[ent])
            c0 = body["next_cursor"]
            store.save(library(action()), base_revision=0)
            status, body = await asyncio.wait_for(
                _poll(coord, since=c0, entities=[ent], timeout=10), timeout=2
            )
            assert status == 200 and body["http_actions"] == 1

        asyncio.run(run())


def test_prune_forgets_the_library_revision_a_watch_was_told(coordinator) -> None:  # noqa: F811
    module, hass, coord = coordinator
    ent = "wrist_assistant.ha6"
    hass.states.set(ent, "off")
    with loaded_package() as pkg:
        _wired(coord, pkg)

        async def run() -> None:
            await _poll(coord, entities=[ent])
            assert coord._http_actions_sent["w1"] == 0
            coord._sessions["w1"].last_seen -= module.SESSION_TTL + timedelta(seconds=1)
            coord._prune_sessions()
            assert "w1" not in coord._http_actions_sent

        asyncio.run(run())


def test_the_capability_is_registered_at_setup() -> None:
    from pathlib import Path

    init = (Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant" / "__init__.py").read_text()
    assert "register_capability(HTTP_ACTIONS_CAPABILITY)" in init
