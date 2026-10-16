"""In-process tests for linked pages in ``WatchConfigStore``.

The real store, loaded the way ``test_watch_config_store.py`` loads it. A
link puts the same page id and a ``linkId`` on several owners
(``link_pages``, ``link_device``); every accepted write of ``pages`` or
``status_pages`` is then handed on to each other owner holding one of its
links, as one new revision there, keeping that owner's order and
``isHidden``. A link left on one owner only is dropped there.
"""

from __future__ import annotations

import asyncio
import copy
import types

import pytest

from test_watch_config_store import _Hass, _loaded_module

WATCH = "watch-A"
WATCH_2 = "watch-B"
PHONE = "iphone:1"
HASH = "c" * 64

HOME = "AAAAAAAA-0000-4000-8000-000000000001"
LIGHTS = "AAAAAAAA-0000-4000-8000-000000000002"
SOLO = "AAAAAAAA-0000-4000-8000-000000000003"
SYSTEM = "AAAAAAAA-0000-4000-8000-0000000000FF"
DOORS = "BBBBBBBB-0000-4000-8000-000000000001"
PHONE_PAGE = "CCCCCCCC-0000-4000-8000-000000000001"


def _tile(n: int, entity_id: str) -> dict:
    return {"id": f"T{n}", "entityId": entity_id}


def _watch_pages() -> dict:
    return {
        "schemaVersion": 1,
        "pages": [
            {"id": SYSTEM, "name": "Settings", "isSystemPage": True, "items": []},
            {
                "id": HOME,
                "name": "Home",
                "items": [_tile(1, f"page.{LIGHTS}"), _tile(2, f"status_page.{DOORS}")],
            },
            {"id": LIGHTS, "name": "Lights", "isHidden": True, "items": [_tile(1, "light.a")]},
            {"id": SOLO, "name": "Solo", "items": []},
        ],
    }


def _watch_status() -> dict:
    return {"schemaVersion": 1, "statusPages": [{"id": DOORS, "name": "Doors", "rows": []}]}


@pytest.fixture
def env():
    with _loaded_module() as mod:
        store = mod.WatchConfigStore(
            _Hass(),
            is_paired=lambda owner: owner in {WATCH, WATCH_2},
            is_iphone=lambda owner: owner == PHONE,
        )
        asyncio.run(store.async_load())
        changes: list[tuple[str, str]] = []
        store.async_add_listener(lambda c: changes.append((c.owner_watch_id, c.kind)))
        store.panel_save(WATCH, "pages", _watch_pages(), base_revision=0)
        store.panel_save(WATCH, "status_pages", _watch_status(), base_revision=0)
        changes.clear()
        yield types.SimpleNamespace(store=store, mod=mod, changes=changes)


def _doc(env, owner: str, kind: str = "pages") -> dict:
    record = env.store.get(owner, kind)
    return copy.deepcopy(record.document) if record is not None else None


def _save(env, owner: str, document: dict, kind: str = "pages"):
    record = env.store.get(owner, kind)
    return env.store.panel_save(
        owner, kind, document, base_revision=record.revision if record else 0
    )


def _page(document: dict, page_id: str) -> dict:
    return next(p for p in document["pages"] if p["id"] == page_id)


# ── link_pages ───────────────────────────────────────────────────────────


def test_link_brings_reached_pages_and_status_pages(env) -> None:
    result = env.store.link_pages(WATCH, [HOME], [PHONE])
    assert result["targets"] == {PHONE: {"pages": [HOME, LIGHTS], "status_pages": [DOORS]}}
    assert set(result["link_ids"]) == {HOME, LIGHTS}
    phone = _doc(env, PHONE)
    assert [p["id"] for p in phone["pages"]] == [HOME, LIGHTS]
    assert _page(phone, LIGHTS)["isHidden"] is True
    watch = _doc(env, WATCH)
    for page_id, link in result["link_ids"].items():
        assert _page(watch, page_id)["linkId"] == link
        assert _page(phone, page_id)["linkId"] == link
    assert "linkId" not in _page(watch, SOLO)
    assert _doc(env, PHONE, "status_pages")["statusPages"][0]["linkId"]
    # The source gained links, then the phone's status pages before its pages.
    assert env.changes == [
        (WATCH, "status_pages"),
        (WATCH, "pages"),
        (PHONE, "status_pages"),
        (PHONE, "pages"),
    ]


def test_link_appends_after_the_targets_own_pages_and_relinking_adds_nothing(env) -> None:
    _save(env, PHONE, {"schemaVersion": 1, "pages": [{"id": PHONE_PAGE, "name": "Mine", "items": []}]})
    first = env.store.link_pages(WATCH, [SOLO], [PHONE])
    assert [p["id"] for p in _doc(env, PHONE)["pages"]] == [PHONE_PAGE, SOLO]
    env.changes.clear()
    again = env.store.link_pages(WATCH, [SOLO], [PHONE])
    assert again["targets"][PHONE] == {"pages": [], "status_pages": []}
    assert again["link_ids"] == first["link_ids"]
    assert env.changes == []


@pytest.mark.parametrize(
    ("source", "pages", "targets", "code"),
    [
        (WATCH, [HOME], ["stranger"], "unknown_device"),
        ("stranger", [HOME], [PHONE], "unknown_device"),
        (WATCH, ["missing"], [PHONE], "not_found"),
        (WATCH, [SYSTEM], [PHONE], "system_page"),
        (WATCH, [HOME], [WATCH], "invalid"),
        (WATCH, [], [PHONE], "invalid"),
    ],
)
def test_link_refusals_write_nothing(env, source, pages, targets, code) -> None:
    with pytest.raises(env.mod.WatchConfigStoreError) as err:
        env.store.link_pages(source, pages, targets)
    assert err.value.code == code
    assert env.changes == []


def test_an_id_taken_on_one_target_refuses_every_target(env) -> None:
    _save(env, WATCH_2, {"schemaVersion": 1, "pages": [{"id": LIGHTS, "name": "Other", "items": []}]})
    env.changes.clear()
    with pytest.raises(env.mod.WatchConfigLinkError) as err:
        env.store.link_pages(WATCH, [HOME], [PHONE, WATCH_2])
    assert err.value.code == "id_taken"
    assert env.changes == []
    assert env.store.get(PHONE, "pages") is None
    assert "linkId" not in _page(_doc(env, WATCH), HOME)


# ── fan-out ──────────────────────────────────────────────────────────────


def test_a_watch_edit_reaches_the_phone_copy_keeping_its_place_and_hidden(env) -> None:
    env.store.link_pages(WATCH, [HOME], [PHONE])
    phone = _doc(env, PHONE)
    phone["pages"] = [phone["pages"][1], {"id": PHONE_PAGE, "name": "Mine", "items": []}, phone["pages"][0]]
    phone["pages"][0]["isHidden"] = False  # LIGHTS shown on the phone
    _save(env, PHONE, phone)
    env.changes.clear()

    watch = _doc(env, WATCH)
    _page(watch, HOME)["name"] = "Home renamed"
    _page(watch, LIGHTS)["items"].append(_tile(2, "light.b"))
    _page(watch, SOLO)["name"] = "Solo renamed"
    _save(env, WATCH, watch)

    phone = _doc(env, PHONE)
    assert [p["id"] for p in phone["pages"]] == [LIGHTS, PHONE_PAGE, HOME]
    assert _page(phone, HOME)["name"] == "Home renamed"
    assert len(_page(phone, LIGHTS)["items"]) == 2
    assert _page(phone, LIGHTS)["isHidden"] is False, "the phone's own isHidden stays"
    assert _page(_doc(env, WATCH), LIGHTS)["isHidden"] is True
    assert env.changes == [(WATCH, "pages"), (PHONE, "pages")], "one revision each, no echo"
    assert env.store.get(PHONE, "pages").updated_by == "panel"


def test_a_device_put_reaches_the_other_copy_too(env) -> None:
    env.store.link_pages(WATCH, [SOLO], [PHONE])
    record = env.store.get(PHONE, "pages")
    phone = copy.deepcopy(record.document)
    phone["pages"][0]["name"] = "From the phone"
    env.changes.clear()
    env.store.put(
        PHONE, "pages", phone, document_hash=HASH, base_revision=record.revision, updated_by=PHONE
    )
    assert _page(_doc(env, WATCH), SOLO)["name"] == "From the phone"
    assert env.store.get(WATCH, "pages").updated_by == PHONE
    assert env.changes == [(PHONE, "pages"), (WATCH, "pages")]


def test_an_unlinked_change_wakes_no_one_else(env) -> None:
    env.store.link_pages(WATCH, [SOLO], [PHONE])
    env.changes.clear()
    watch = _doc(env, WATCH)
    _page(watch, HOME)["name"] = "Only here"
    _page(watch, SOLO)["isHidden"] = True  # per device
    _save(env, WATCH, watch)
    assert env.changes == [(WATCH, "pages")]
    assert "isHidden" not in _page(_doc(env, PHONE), SOLO)


def test_a_status_page_edit_reaches_its_copies(env) -> None:
    env.store.link_pages(WATCH, [HOME], [PHONE])
    status = _doc(env, WATCH, "status_pages")
    status["statusPages"][0]["name"] = "Front doors"
    env.changes.clear()
    _save(env, WATCH, status, "status_pages")
    assert _doc(env, PHONE, "status_pages")["statusPages"][0]["name"] == "Front doors"
    assert env.changes == [(WATCH, "status_pages"), (PHONE, "status_pages")]


def test_a_restore_fans_out(env) -> None:
    env.store.link_pages(WATCH, [SOLO], [PHONE])
    watch = _doc(env, WATCH)
    linked_revision = env.store.get(WATCH, "pages").revision
    _page(watch, SOLO)["name"] = "Renamed"
    _save(env, WATCH, watch)
    assert _page(_doc(env, PHONE), SOLO)["name"] == "Renamed"
    env.store.restore(
        WATCH, "pages", linked_revision, base_revision=env.store.get(WATCH, "pages").revision
    )
    assert _page(_doc(env, PHONE), SOLO)["name"] == "Solo"


def test_removing_a_copy_drops_the_link_on_the_last_one(env) -> None:
    env.store.link_pages(WATCH, [SOLO], [PHONE])
    phone = _doc(env, PHONE)
    phone["pages"] = []
    env.changes.clear()
    _save(env, PHONE, phone)
    assert "linkId" not in _page(_doc(env, WATCH), SOLO)
    assert _page(_doc(env, WATCH), SOLO)["name"] == "Solo", "the page itself stays"
    assert env.changes == [(PHONE, "pages"), (WATCH, "pages")]


def test_removing_one_of_three_copies_keeps_the_link(env) -> None:
    env.store.link_pages(WATCH, [SOLO], [PHONE, WATCH_2])
    link = _page(_doc(env, WATCH), SOLO)["linkId"]
    phone = _doc(env, PHONE)
    phone["pages"] = []
    env.changes.clear()
    _save(env, PHONE, phone)
    assert _page(_doc(env, WATCH), SOLO)["linkId"] == link
    assert _page(_doc(env, WATCH_2), SOLO)["linkId"] == link
    assert env.changes == [(PHONE, "pages")]


def test_a_copy_over_its_cap_is_left_and_the_save_stands(env, monkeypatch) -> None:
    env.store.link_pages(WATCH, [SOLO], [PHONE])
    watch = _doc(env, WATCH)
    _page(watch, SOLO)["name"] = "Bigger"
    real = env.mod.validate_document

    def capped(kind, document, **kwargs):
        if document is not None and any(
            p.get("id") == SOLO and p.get("name") == "Bigger" for p in document.get("pages", [])
        ) and not kwargs.get("check_items"):
            raise env.mod.WatchConfigValidationError("too big")
        return real(kind, document, **kwargs)

    monkeypatch.setattr(env.mod, "validate_document", capped)
    env.changes.clear()
    _save(env, WATCH, watch)
    assert env.changes == [(WATCH, "pages")]
    assert _page(_doc(env, PHONE), SOLO)["name"] == "Solo"


# ── link_device and places ───────────────────────────────────────────────


def test_link_device_links_everything_and_copies_menus_and_rooms_once(env) -> None:
    menus = {"quickAction": {"slots": []}, "entityRadial": {}, "pageSwitcher": {}}
    _save(env, WATCH, menus, "menus")
    _save(env, WATCH, {"roomAutoSwitchEnabled": True, "hapticsEnabled": False}, "behavior")
    env.changes.clear()
    result = env.store.link_device(WATCH, PHONE, updated_by=PHONE)
    assert set(result["link_ids"]) == {HOME, LIGHTS, SOLO}
    assert result["copied"] == ["menus", "rooms"]
    assert [p["id"] for p in _doc(env, PHONE)["pages"]] == [HOME, LIGHTS, SOLO]
    assert _doc(env, PHONE, "menus") == menus
    assert _doc(env, PHONE, "rooms") == {"schemaVersion": 1, "roomAutoSwitchEnabled": True}
    assert env.store.get(PHONE, "menus").updated_by == PHONE

    mine = {"quickAction": {"slots": []}, "entityRadial": {"x": 1}, "pageSwitcher": {}}
    _save(env, PHONE, mine, "menus")
    again = env.store.link_device(WATCH, PHONE, updated_by=PHONE)
    assert again["copied"] == []
    assert _doc(env, PHONE, "menus") == mine


def test_link_places_names_every_holder(env) -> None:
    result = env.store.link_pages(WATCH, [SOLO], [PHONE, WATCH_2])
    places = env.store.link_places()
    assert places["pages"] == {result["link_ids"][SOLO]: sorted([PHONE, WATCH, WATCH_2])}
    assert places["status_pages"] == {}
