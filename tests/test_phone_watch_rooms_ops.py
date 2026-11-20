"""An iPhone's Rooms page for one of its user's watches (capability
``phone_watch_rooms``, app repo ``docs/rooms_on_iphone_2026-11.md``).

``watch_config_get`` takes ``owner_watch_id`` for ``pages``, read only, so the
iPhone can offer the watch's pages, and ``watch_config_get`` and
``watch_config_put`` take it for ``rooms``: the rooms record of a watch that
takes its settings from another home. On its main home a watch's rooms ride
in ``behavior`` (``test_phone_watch_settings_ops.py``). The handlers run in
the namespace ``test_watch_config_ops_inprocess.py`` builds, against a real
store.
"""

from __future__ import annotations

import asyncio
import types
from typing import Any

import pytest
from test_notification_tokens import _loaded_notifications
from test_watch_config_ops_inprocess import _Ctx, _device, _handlers, _Secrets
from test_watch_config_store import _Hass, _loaded_module

PHONE = "iphone:1"
WATCH = "watch-A"
AWAY = "watch-B"
STRANGER = "watch-C"
HASH_2 = "b" * 64
PAGES = {"pages": [{"id": "p1", "name": "Kitchen"}, {"id": "p2", "name": "Office"}]}
ROOMS = {
    "schemaVersion": 1,
    "roomQuickJumpSourceEntityId": "sensor.made_up_area",
    "roomQuickJumpMappings": {"kitchen": "p1"},
    "pointControlRoomMappingsJSON": "[]",
}


@pytest.fixture
def env():
    with _loaded_module() as store_mod, _loaded_notifications() as notif_mod:
        store = store_mod.WatchConfigStore(
            _Hass(),
            is_paired=lambda owner: owner in {WATCH, AWAY, STRANGER},
            is_iphone=lambda owner: owner == PHONE,
        )
        asyncio.run(store.async_load())
        secrets = _Secrets()
        secrets.entries = {
            PHONE: _device("iphone", "user-1"),
            WATCH: _device("watch", "user-1"),
            AWAY: _device("watch", "user-1"),
            STRANGER: _device("watch", "user-2"),
        }
        # watch-B takes its settings from another home: its rooms here are a
        # rooms record of their own.
        secrets.entries[AWAY].main_house = False
        secrets.may_await_move = lambda watch_id: False
        store.panel_save(WATCH, "pages", dict(PAGES), base_revision=0)
        yield types.SimpleNamespace(store=store, secrets=secrets, views=_handlers(store_mod, notif_mod))


def _get(env, payload: dict, signer: str = PHONE) -> Any:
    return asyncio.run(env.views["_op_watch_config_get"](_Ctx(env.store, signer, payload, env.secrets)))


def _put(env, payload: dict, signer: str = PHONE) -> Any:
    return asyncio.run(env.views["_op_watch_config_put"](_Ctx(env.store, signer, payload, env.secrets)))


def _save(kind: str, document: dict, base: int, owner: str = AWAY) -> dict:
    return {"kind": kind, "owner_watch_id": owner, "base_revision": base, "hash": HASH_2, "document": document}


# ── pages, read only ─────────────────────────────────────────────────────


def test_an_iphone_reads_its_watch_s_pages(env) -> None:
    reply = _get(env, {"kind": "pages", "owner_watch_id": WATCH})
    assert reply.status == 200
    assert (reply.body["revision"], reply.body["document"]) == (1, PAGES)
    # Read as an observer: the watch has collected nothing.
    assert env.store.get(WATCH, "pages").delivered_revision in (None, 0)


def test_an_iphone_never_saves_a_watch_s_pages(env) -> None:
    # A put of pages naming a watch is the iPhone's own, as it always was
    # (test_library_takeover.py).
    reply = _put(env, _save("pages", {"pages": []}, base=0, owner=WATCH))
    assert reply.status == 200
    assert env.store.get(WATCH, "pages").document == PAGES
    assert env.store.get(PHONE, "pages") is not None


def test_another_user_s_watch_pages_are_refused(env) -> None:
    reply = _get(env, {"kind": "pages", "owner_watch_id": STRANGER})
    assert (reply.status, reply.body["error"]) == (403, "not_owner")


# ── rooms ────────────────────────────────────────────────────────────────


def test_the_iphone_may_start_a_home_s_rooms(env) -> None:
    read = _get(env, {"kind": "rooms", "owner_watch_id": AWAY})
    assert (read.body["revision"], read.body["may_start"]) == (0, True)
    reply = _put(env, _save("rooms", dict(ROOMS), base=0))
    assert (reply.status, reply.body) == (200, {"ok": True, "revision": 1})
    record = env.store.get(AWAY, "rooms")
    assert record.document == ROOMS
    assert record.updated_by == PHONE


def test_a_saved_room_record_is_changed_on_its_revision(env) -> None:
    _put(env, _save("rooms", dict(ROOMS), base=0))
    changed = dict(ROOMS, roomAutoSwitchEnabled=True)
    assert _put(env, _save("rooms", changed, base=1)).body == {"ok": True, "revision": 2}
    stale = _put(env, _save("rooms", dict(ROOMS), base=1))
    assert (stale.status, stale.body["error"]) == (409, "conflict")
    assert env.store.get(AWAY, "rooms").document == changed


def test_a_main_home_watch_keeps_its_rooms_in_its_settings(env) -> None:
    read = _get(env, {"kind": "rooms", "owner_watch_id": WATCH})
    assert (read.status, read.body["error"]) == (400, "main_house")
    reply = _put(env, _save("rooms", dict(ROOMS), base=0, owner=WATCH))
    assert (reply.status, reply.body["error"]) == (400, "main_house")
    assert env.store.get(WATCH, "rooms") is None


def test_another_user_s_watch_rooms_are_refused(env) -> None:
    reply = _put(env, _save("rooms", dict(ROOMS), base=0, owner=STRANGER))
    assert (reply.status, reply.body["error"]) == (403, "not_owner")


def test_a_watch_naming_an_owner_still_means_its_own_rooms(env) -> None:
    reply = _get(env, {"kind": "rooms", "owner_watch_id": AWAY}, signer=WATCH)
    assert reply.status == 200
    assert reply.body["revision"] == 0
    assert "may_start" not in reply.body
