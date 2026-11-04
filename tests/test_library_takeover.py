"""A saved document never changes, or joins, a library item its saver may not
take (R5-058).

The real panel commands and the real signed ``watch_config_put`` over the real
store and secret store. Alice owns the page, Bob only knows its id. The flows
that must keep working (an administrator, one person's two devices, a watch's
own save, a phone's move, an old unbound pair) are pinned here too.
"""

from __future__ import annotations

import asyncio
import copy
import sys
import types
from typing import Any

import pytest
import test_watch_config_ops_inprocess as ops
from test_watch_config_ws import ALICE, BOB, DOMAIN, ROOT, _Connection
from test_watch_config_ws import env as ws_env  # noqa: F401 (a fixture)

PAGE = "AAAAAAAA-1111-4000-8000-000000000001"
STATUS = "BBBBBBBB-1111-4000-8000-000000000001"
STARTER = "00000000-0000-0000-0000-000000000001"
HASH = "c" * 64


class _Devices:
    """The secret store's answers these saves read."""

    def __init__(self, *devices: tuple[str, str | None, str | None]) -> None:
        self.entries = {
            device_id: types.SimpleNamespace(
                user_id=user_id,
                owner_iphone_id=phone,
                device_kind="iphone" if device_id.startswith("phone") else "watch",
            )
            for device_id, user_id, phone in devices
        }

    def get(self, device_id: str) -> Any:
        return self.entries.get(device_id)

    @property
    def all_entries(self) -> dict[str, Any]:
        return dict(self.entries)

    def add(self, device_id: str, user_id: str | None, phone: str | None = None) -> None:
        self.entries.update(_Devices((device_id, user_id, phone)).entries)


@pytest.fixture
def env(ws_env):  # noqa: F811 (the imported fixture)
    """Alice's two watches and her phone, Bob's watch and phone, and a watch
    bound to nobody."""
    devices = _Devices(
        ("watch-alice", "alice", None),
        ("watch-alice-2", "alice", None),
        ("phone-alice", "alice", None),
        ("watch-bob", "bob", None),
        ("phone-bob", "bob", None),
        ("watch-legacy", None, None),
    )
    store = ws_env.mod.WatchConfigStore(
        ws_env.hass,
        is_paired=lambda owner: owner in devices.entries and not owner.startswith("phone"),
        is_iphone=lambda owner: owner.startswith("phone"),
    )
    asyncio.run(store.async_load())
    ws_env.hass.data = {
        DOMAIN: types.SimpleNamespace(watch_config_store=store, widget_secret_store=devices)
    }
    ws_env.watch_config = store
    ws_env.devices = devices
    return ws_env


def _run(e, command, user: Any, **msg) -> _Connection:
    connection = _Connection()
    connection.user = user
    command(e.hass, connection, {"id": 1, **msg})
    return connection


def _ok(connection: _Connection) -> Any:
    assert connection.errors == [], connection.errors
    return connection.results[1]


def _refused(connection: _Connection) -> bool:
    return connection.results == {} and [e[1] for e in connection.errors] == ["unauthorized"]


def _page(name: str = "Alice page", page_id: str = PAGE) -> dict:
    return {"id": page_id, "name": name, "items": []}


def _status(name: str = "Alice status", page_id: str = STATUS) -> dict:
    return {"id": page_id, "name": name, "rows": []}


def _pages(*pages: dict) -> dict:
    return {"schemaVersion": 1, "pages": list(pages)}


def _statuses(*pages: dict) -> dict:
    return {"schemaVersion": 1, "statusPages": list(pages)}


def _save(e, user: Any, owner: str, document: dict, kind: str = "pages") -> Any:
    record = e.watch_config.get(owner, kind)
    return _ok(
        _run(
            e,
            e.ws.ws_watch_config_save,
            user,
            type="wrist_assistant/watch_config/save",
            owner_watch_id=owner,
            kind=kind,
            base_revision=record.revision if record is not None else 0,
            document=document,
        )
    )


def _user(user_id: str, *, is_admin: bool = False) -> Any:
    return types.SimpleNamespace(id=user_id, is_admin=is_admin, is_active=True)


def _signed_put(e, owner: str, document: dict, user: Any, kind: str = "pages") -> Any:
    views = ops._handlers(sys.modules[type(e.watch_config).__module__])
    record = e.watch_config.get(owner, kind)
    payload = {
        "kind": kind,
        "base_revision": record.revision if record is not None else 0,
        "hash": HASH,
        "document": document,
    }
    ctx = ops._Ctx(e.watch_config, owner, payload, e.devices, user)
    reply = asyncio.run(views["_op_watch_config_put"](ctx))
    assert reply.status == 200, reply.body
    return reply


def _owners(e, page_id: str = PAGE, kind: str = "pages") -> list[str]:
    return e.watch_config.library_item_owners(kind, page_id)


def _name(e, page_id: str = PAGE, kind: str = "pages") -> str:
    return e.watch_config.library_summary()[kind][page_id]["item"]["name"]


def _ids(e, owner: str, kind: str = "pages", key: str = "pages") -> list[str]:
    return [p["id"] for p in e.watch_config.get(owner, kind).document[key]]


def _untouched(e) -> None:
    """Alice's page is as she left it, and only she has it."""
    assert _name(e) == "Alice page"
    assert _owners(e) == ["watch-alice"]
    assert e.watch_config.get("watch-alice", "pages").document["pages"][0]["name"] == "Alice page"


def _not_readable_by_bob(e) -> None:
    assert _refused(
        _run(e, e.ws.ws_library_item, BOB, type="x", kind="pages", item_id=PAGE)
    )


# ── what Bob cannot do ───────────────────────────────────────────────────


def test_a_panel_save_with_another_person_s_id_forks_first_and_second_save(env) -> None:
    _save(env, ALICE, "watch-alice", _pages(_page()))
    _save(env, BOB, "watch-bob", _pages(_page("Bob first")))
    _untouched(env)
    [first] = _ids(env, "watch-bob")
    assert first != PAGE

    document = copy.deepcopy(env.watch_config.get("watch-bob", "pages").document)
    document["pages"].append(_page("Bob second"))
    _save(env, BOB, "watch-bob", document)
    _untouched(env)
    _not_readable_by_bob(env)
    assert PAGE not in _ids(env, "watch-bob")
    assert first in _ids(env, "watch-bob")


def test_a_signed_put_with_another_person_s_id_forks_first_and_second_save(env) -> None:
    _save(env, ALICE, "watch-alice", _pages(_page()))
    bob = _user("bob")
    _signed_put(env, "watch-bob", _pages(_page("Bob first")), bob)
    _untouched(env)
    [first] = _ids(env, "watch-bob")
    assert first != PAGE

    document = copy.deepcopy(env.watch_config.get("watch-bob", "pages").document)
    document["pages"].append(_page("Bob signed"))
    _signed_put(env, "watch-bob", document, bob)
    _untouched(env)
    _not_readable_by_bob(env)
    assert PAGE not in _ids(env, "watch-bob")


def test_saving_the_same_old_id_again_edits_the_one_copy(env) -> None:
    """A device that still holds the old id does not grow the library."""
    _save(env, ALICE, "watch-alice", _pages(_page()))
    _save(env, BOB, "watch-bob", _pages(_page("Bob first")))
    [copied] = _ids(env, "watch-bob")
    _save(env, BOB, "watch-bob", _pages(_page("Bob again")))
    assert _ids(env, "watch-bob") == [copied]
    assert _name(env, copied) == "Bob again"
    assert sorted(env.watch_config.library_summary()["pages"]) == sorted([PAGE, copied])
    _untouched(env)


def test_an_equal_copy_does_not_join_either(env) -> None:
    """A pick is the right to read and change, so knowing the content is not
    enough."""
    _save(env, ALICE, "watch-alice", _pages(_page()))
    _save(env, BOB, "watch-bob", _pages(_page()))
    _untouched(env)
    assert _ids(env, "watch-bob") != [PAGE]

    _signed_put(env, "watch-legacy", _pages(_page()), None)
    _untouched(env)
    assert _ids(env, "watch-legacy") != [PAGE]


def test_a_starter_status_page_s_fixed_id_gives_nobody_a_way_in(env) -> None:
    """Its id and its content are known to anyone, so an equal copy is the way
    in: join it, then edit it. Both saves stay on Bob's own copy."""
    starter = {"id": STARTER, "name": "Battery", "rows": [], "isSystemDefault": True}
    _save(env, ALICE, "watch-alice", _statuses(starter), "status_pages")
    _save(env, BOB, "watch-bob", _statuses(starter), "status_pages")
    assert _owners(env, STARTER, "status_pages") == ["watch-alice"]
    edited = {**starter, "name": "Bob edit"}
    _save(env, BOB, "watch-bob", _statuses(edited), "status_pages")
    assert _name(env, STARTER, "status_pages") == "Battery"
    assert _owners(env, STARTER, "status_pages") == ["watch-alice"]

    bob = _user("bob")
    _signed_put(env, "phone-bob", _statuses(starter), bob, "status_pages")
    _signed_put(env, "phone-bob", _statuses(edited), bob, "status_pages")
    assert _name(env, STARTER, "status_pages") == "Battery"
    assert _owners(env, STARTER, "status_pages") == ["watch-alice"]


def test_a_forked_status_page_also_moves_the_tiles_of_bob_s_pages(env) -> None:
    _save(env, ALICE, "watch-alice", _statuses(_status()), "status_pages")
    own = _page("Bob page", "CCCCCCCC-1111-4000-8000-000000000001")
    own["items"] = [{"id": "T1", "entityId": f"status_page.{STATUS}"}]
    _save(env, BOB, "watch-bob", _pages(own))
    _save(env, BOB, "watch-bob", _statuses(_status("Bob status")), "status_pages")
    [copied] = _ids(env, "watch-bob", "status_pages", "statusPages")
    assert copied != STATUS
    [page] = env.watch_config.get("watch-bob", "pages").document["pages"]
    assert page["items"][0]["entityId"] == f"status_page.{copied}"
    assert _owners(env, STATUS, "status_pages") == ["watch-alice"]
    assert _name(env, STATUS, "status_pages") == "Alice status"


def test_a_tile_never_brings_another_person_s_status_page_along(env) -> None:
    """A pick of Bob's own page brings what its tiles open. A tile naming
    Alice's status page must not put it on Bob's device."""
    _save(env, ALICE, "watch-alice", _statuses(_status()), "status_pages")
    own_id = "CCCCCCCC-1111-4000-8000-000000000001"
    own = _page("Bob page", own_id)
    own["items"] = [{"id": "T1", "entityId": f"status_page.{STATUS}"}]
    _save(env, BOB, "watch-bob", _pages(own))
    _save(env, BOB, "phone-bob", _pages())
    _ok(
        _run(
            env,
            env.ws.ws_library_pick,
            BOB,
            type="x",
            owner_id="phone-bob",
            kind="pages",
            item_id=own_id,
            on=True,
        )
    )
    assert own_id in _ids(env, "phone-bob")
    assert _owners(env, STATUS, "status_pages") == ["watch-alice"]


def _menus(*slots: dict) -> dict:
    return {
        "entityRadial": {"allSlots": [], "schemaVersion": 1},
        "pageSwitcher": {"displayMode": "icon", "schemaVersion": 1},
        "quickAction": {"beamStyle": "none", "schemaVersion": 1, "slots": list(slots)},
        "schemaVersion": 1,
    }


def test_a_menu_slot_never_brings_another_person_s_page_along(env) -> None:
    """Bob's two devices share a menu. A new slot naming Alice's page would put
    it on the other device, and then Bob could read it."""
    _save(env, ALICE, "watch-alice", _pages(_page()))
    _save(env, BOB, "watch-bob", _menus(), "menus")
    menu = env.watch_config.library_summary()["picks"]["watch-bob"]["menus"]["anywhere"]
    _save(env, BOB, "phone-bob", _pages())
    _ok(
        _run(
            env,
            env.ws.ws_library_pick,
            BOB,
            type="x",
            owner_id="phone-bob",
            kind="menus",
            unit="anywhere",
            item_id=menu,
        )
    )
    slot = {
        "id": "S1",
        "action": {"type": "navigateToPage", "pageId": PAGE},
        "isVisible": True,
        "position": "topLeft",
    }
    _save(env, BOB, "watch-bob", _menus(slot), "menus")
    _untouched(env)

    revision = env.watch_config.library_summary()["menus"][menu]["revision"]
    _ok(
        _run(
            env,
            env.ws.ws_library_item_save,
            BOB,
            type="x",
            kind="menus",
            item_id=menu,
            base_revision=revision,
            document=_menus(slot, {**slot, "id": "S2"}),
        )
    )
    _untouched(env)


# ── what must keep working ───────────────────────────────────────────────


def test_an_admin_may_edit_any_device_s_page_from_any_device(env) -> None:
    _save(env, ALICE, "watch-alice", _pages(_page()))
    _save(env, ROOT, "watch-bob", _pages())
    _save(env, ROOT, "watch-bob", _pages(_page("From the admin")))
    assert _name(env) == "From the admin"
    assert _ids(env, "watch-bob") == [PAGE]
    assert _owners(env) == ["watch-alice", "watch-bob"]


def test_a_device_bound_to_an_admin_may_too(env) -> None:
    _save(env, ALICE, "watch-alice", _pages(_page()))
    admin = _user("bob", is_admin=True)
    _signed_put(env, "watch-bob", _pages(), admin)
    _signed_put(env, "watch-bob", _pages(_page("From the admin")), admin)
    assert _name(env) == "From the admin"


def test_one_person_s_two_devices_share_a_page(env) -> None:
    _save(env, ALICE, "watch-alice", _pages(_page()))
    _save(env, ALICE, "watch-alice-2", _pages())
    _save(env, ALICE, "watch-alice-2", _pages(_page("Panel edit")))
    assert _name(env) == "Panel edit"
    assert _owners(env) == ["watch-alice", "watch-alice-2"]

    _save(env, ALICE, "phone-alice", _pages())
    document = _pages(_page("Signed edit"))
    _signed_put(env, "phone-alice", document, _user("alice"))
    assert _name(env) == "Signed edit"
    assert _owners(env) == ["phone-alice", "watch-alice", "watch-alice-2"]


def test_a_watch_s_own_save_edits_its_own_page(env) -> None:
    alice = _user("alice")
    _signed_put(env, "watch-alice", _pages(_page()), alice)
    _signed_put(env, "watch-alice", _pages(_page("Own edit")), alice)
    assert _name(env) == "Own edit"
    assert _ids(env, "watch-alice") == [PAGE]


def test_a_page_shared_with_another_person_stays_editable_by_both(env) -> None:
    """A pick an administrator gave Bob is his to edit, as it always was."""
    _save(env, ALICE, "watch-alice", _pages(_page()))
    _save(env, ROOT, "watch-bob", _pages(_page()))
    _save(env, BOB, "watch-bob", _pages(_page("Bob edit")))
    assert _name(env) == "Bob edit"
    assert env.watch_config.get("watch-alice", "pages").document["pages"][0]["name"] == "Bob edit"


def test_a_first_record_from_a_phone_s_move_joins_an_equal_copy_of_its_person(env) -> None:
    """The move signs as the watch, bound to the same person as the phone."""
    alice = _user("alice")
    _signed_put(env, "phone-alice", _pages(_page()), alice)
    _signed_put(env, "watch-alice", _pages(_page()), alice)
    assert _ids(env, "watch-alice") == [PAGE]
    assert _owners(env) == ["phone-alice", "watch-alice"]


def test_a_first_record_with_other_content_still_forks_for_its_own_person(env) -> None:
    alice = _user("alice")
    _signed_put(env, "phone-alice", _pages(_page()), alice)
    _signed_put(env, "watch-alice", _pages(_page("The watch's own")), alice)
    assert _ids(env, "watch-alice") != [PAGE]
    assert _name(env) == "Alice page"


def test_an_old_unbound_pair_still_shares_its_setup(env) -> None:
    """A phone and its watch paired before binding have no user to ask."""
    env.devices.add("phone-old", None)
    env.devices.add("watch-old", None, "phone-old")
    _signed_put(env, "phone-old", _pages(_page("Old")), None)
    _signed_put(env, "watch-old", _pages(_page("Old")), None)
    assert _owners(env) == ["phone-old", "watch-old"]


def test_an_unbound_device_takes_nothing_from_a_bound_one(env) -> None:
    env.devices.add("watch-claims", None, "phone-alice")
    _signed_put(env, "phone-alice", _pages(_page()), _user("alice"))
    _signed_put(env, "watch-claims", _pages(_page("Taken")), None)
    assert _name(env) == "Alice page"
    assert _owners(env) == ["phone-alice"]
