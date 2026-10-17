"""In-process tests for pages and status pages on several devices in
``WatchConfigStore``: one library (``library.py``), devices pick.

The real store, loaded the way ``test_watch_config_store.py`` loads it. A
tick (``library_pick``) or the iPhone's copy of a watch (``link_device``)
makes several owners pick the same library item; every accepted write of
``pages`` or ``status_pages`` is mapped back into the library and each
other owner that picks a changed item is written again, as one new
revision there, keeping that owner's order and ``isHidden``. No record
carries a link mark, so a pick, a removal or a forget never writes another
device's record.

The fixture and helpers here are shared with ``test_voice_links_store.py``
and ``test_menu_links_store.py``.
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
# One of the app's five starter status pages, the same id on every device.
STARTER = "00000000-0000-0000-0000-000000000001"


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
        # The watches whose iPhone may still move their own setup here; a
        # test adds one to wait.
        awaiting: set[str] = set()
        store = mod.WatchConfigStore(
            _Hass(),
            is_paired=lambda owner: owner in {WATCH, WATCH_2},
            is_iphone=lambda owner: owner == PHONE,
            may_await_move=lambda owner: owner in awaiting,
        )
        asyncio.run(store.async_load())
        changes: list[tuple[str, str]] = []
        store.async_add_listener(lambda c: changes.append((c.owner_watch_id, c.kind)))
        store.panel_save(WATCH, "pages", _watch_pages(), base_revision=0)
        store.panel_save(WATCH, "status_pages", _watch_status(), base_revision=0)
        changes.clear()
        yield types.SimpleNamespace(store=store, mod=mod, changes=changes, awaiting=awaiting)


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




def _pick(env, ids: list[str], targets: list[str], kind: str = "pages") -> None:
    """Tick each item onto each target, as the panel's Pages tab does."""
    for target in targets:
        for item_id in ids:
            env.store.library_pick(target, kind, item_id, on=True)


def _no_link_keys(document: dict) -> bool:
    lists = [document.get("pages", []), document.get("statusPages", [])]
    return "linkIds" not in document and all("linkId" not in p for items in lists for p in items)


# ── ticks ────────────────────────────────────────────────────────────────


def test_a_tick_brings_the_status_pages_its_tiles_open_and_writes_that_device_alone(env) -> None:
    _pick(env, [HOME], [PHONE])
    phone = _doc(env, PHONE)
    assert [p["id"] for p in phone["pages"]] == [HOME]
    assert [p["id"] for p in _doc(env, PHONE, "status_pages")["statusPages"]] == [DOORS]
    for owner in (WATCH, PHONE):
        assert _no_link_keys(_doc(env, owner))
        assert _no_link_keys(_doc(env, owner, "status_pages"))
    # The phone's status pages before its pages; the watch, which has them
    # too, is not written.
    assert env.changes == [(PHONE, "status_pages"), (PHONE, "pages")]


def test_a_tick_appends_after_the_targets_own_pages_and_again_adds_nothing(env) -> None:
    _save(env, PHONE, {"schemaVersion": 1, "pages": [{"id": PHONE_PAGE, "name": "Mine", "items": []}]})
    _pick(env, [SOLO], [PHONE])
    assert [p["id"] for p in _doc(env, PHONE)["pages"]] == [PHONE_PAGE, SOLO]
    env.changes.clear()
    _pick(env, [SOLO], [PHONE])
    assert env.changes == []


def test_status_pages_ticked_alone_are_kept_in_step(env) -> None:
    status = _watch_status()
    status["statusPages"].append({"id": STARTER, "name": "Batteries", "rows": []})
    _save(env, WATCH, status, "status_pages")
    env.changes.clear()
    _pick(env, [STARTER, DOORS.lower()], [PHONE], "status_pages")
    phone = _doc(env, PHONE, "status_pages")["statusPages"]
    assert [p["id"] for p in phone] == [STARTER, DOORS]
    assert env.store.get(PHONE, "pages") is None, "nothing is walked"
    assert env.changes == [(PHONE, "status_pages")] * 2, "one tick, one revision"

    status = _doc(env, PHONE, "status_pages")
    status["statusPages"][1]["name"] = "Front doors"
    _save(env, PHONE, status, "status_pages")
    assert _doc(env, WATCH, "status_pages")["statusPages"][0]["name"] == "Front doors"


def _with_starter(name: str, **extra) -> dict:
    status = _watch_status()
    status["statusPages"].append({"id": STARTER, "name": name, "rows": [], **extra})
    return status


def _own_starter(*others: dict, name: str = "Mine", **extra) -> dict:
    """A phone's first status pages: its own copy of the starter, differing
    from the watch's, and whatever else."""
    return {
        "schemaVersion": 1,
        "statusPages": [*others, {"id": STARTER, "name": name, "rows": [], **extra}],
    }


def _phone_status(env) -> list[dict]:
    return _doc(env, PHONE, "status_pages")["statusPages"]


def test_a_device_s_own_different_starter_arrives_under_an_id_of_its_own(env) -> None:
    """One id is one library item. A phone whose first status pages hold the
    starter's id with other content is holding another page: it gets a new
    id there, so the watch's starter is never overwritten by it, and a tick
    of the watch's starter then adds it beside the phone's own."""
    _save(env, WATCH, _with_starter("Batteries", isSystemDefault=True), "status_pages")
    _save(
        env,
        PHONE,
        _own_starter({"id": PHONE_PAGE, "name": "Phone", "rows": []}, isHidden=True),
        "status_pages",
    )
    phone = _phone_status(env)
    assert [p["name"] for p in phone] == ["Phone", "Mine"]
    own = phone[1]["id"]
    assert own != STARTER and phone[1]["isHidden"] is True
    assert _doc(env, WATCH, "status_pages")["statusPages"][1]["name"] == "Batteries"
    env.changes.clear()

    _pick(env, [STARTER], [PHONE], "status_pages")
    phone = _phone_status(env)
    assert [p["id"] for p in phone] == [PHONE_PAGE, own, STARTER]
    assert phone[2] == {"id": STARTER, "name": "Batteries", "rows": [], "isSystemDefault": True}
    assert env.changes == [(PHONE, "status_pages")]
    assert env.store.library_summary()["status_pages"][STARTER]["owners"] == [PHONE, WATCH]

    # One item from then on: an edit on either reaches both.
    watch = _doc(env, WATCH, "status_pages")
    watch["statusPages"][1]["name"] = "Power"
    _save(env, WATCH, watch, "status_pages")
    assert _phone_status(env)[2]["name"] == "Power"


def test_the_same_starter_on_two_devices_is_one_item(env) -> None:
    """A phone whose first status pages hold the starter exactly as the
    watch has it picks the same item, and an edit on either reaches both."""
    _save(env, WATCH, _with_starter("Batteries"), "status_pages")
    _save(env, PHONE, _own_starter(name="Batteries"), "status_pages")
    assert _phone_status(env)[0]["id"] == STARTER
    assert _no_link_keys(_doc(env, PHONE, "status_pages"))
    assert _no_link_keys(_doc(env, WATCH, "status_pages"))
    phone = _doc(env, PHONE, "status_pages")
    phone["statusPages"][0]["name"] = "Power"
    _save(env, PHONE, phone, "status_pages")
    assert _doc(env, WATCH, "status_pages")["statusPages"][1]["name"] == "Power"


def test_forgetting_the_other_holder_of_a_starter_leaves_the_watch_alone(env) -> None:
    _save(env, WATCH, _with_starter("Batteries"), "status_pages")
    _save(env, PHONE, _with_starter("Mine"), "status_pages")
    _pick(env, [STARTER], [PHONE], "status_pages")
    revision = env.store.get(WATCH, "status_pages").revision
    env.store.forget_owner(PHONE)
    held = _doc(env, WATCH, "status_pages")["statusPages"]
    assert held[1]["id"] == STARTER and held[1]["name"] == "Batteries"
    assert env.store.get(WATCH, "status_pages").revision == revision


def test_a_page_tick_brings_the_starter_its_tile_opens(env) -> None:
    """A page whose tile opens a starter brings the starter along, beside a
    different starter of the phone's own (which has an id of its own)."""
    pages = _watch_pages()
    pages["pages"][3]["items"] = [_tile(1, f"status_page.{STARTER.lower()}")]
    _save(env, WATCH, pages)
    _save(env, WATCH, _with_starter("Batteries", isSystemDefault=True), "status_pages")
    _save(
        env,
        PHONE,
        _own_starter({"id": PHONE_PAGE, "name": "Phone", "rows": []}, isHidden=True),
        "status_pages",
    )
    own = _phone_status(env)[1]["id"]
    _pick(env, [SOLO], [PHONE])
    phone = _phone_status(env)
    assert [p["id"] for p in phone] == [PHONE_PAGE, own, STARTER]
    assert phone[2]["name"] == "Batteries" and "linkId" not in phone[2]


def test_another_page_under_a_taken_id_never_blocks_a_tick(env) -> None:
    """A device's first page under an id the library holds with other
    content got an id of its own when it arrived, so a tick of the watch's
    page simply adds it there too."""
    _save(env, WATCH_2, {"schemaVersion": 1, "pages": [{"id": LIGHTS, "name": "Other", "items": []}]})
    [other] = _doc(env, WATCH_2)["pages"]
    assert other["id"] != LIGHTS and other["name"] == "Other"
    assert _page(_doc(env, WATCH), LIGHTS)["name"] == "Lights"
    _pick(env, [HOME, LIGHTS], [PHONE, WATCH_2])
    assert [p["id"] for p in _doc(env, WATCH_2)["pages"]] == [other["id"], HOME, LIGHTS]


# ── a watch still waiting for its iPhone's move ──────────────────────────


def test_a_tick_never_starts_the_status_pages_of_a_watch_awaiting_its_move(env) -> None:
    """The move came for the pages but not yet the status pages: a tick
    whose page brings a status page still waits."""
    env.awaiting.add(WATCH_2)
    _save(env, WATCH_2, {"schemaVersion": 1, "pages": [{"id": PHONE_PAGE, "name": "Own", "items": []}]})
    env.changes.clear()
    with pytest.raises(env.mod.WatchConfigLinkError) as err:
        _pick(env, [HOME], [WATCH_2])
    assert err.value.code == "awaiting_move"
    assert env.changes == []
    assert env.store.get(WATCH_2, "status_pages") is None


def test_once_the_move_came_a_tick_onto_that_watch_goes_ahead(env) -> None:
    env.awaiting.add(WATCH_2)
    _save(env, WATCH_2, {"schemaVersion": 1, "pages": [{"id": PHONE_PAGE, "name": "Own", "items": []}]})
    _pick(env, [SOLO], [WATCH_2])
    assert [p["id"] for p in _doc(env, WATCH_2)["pages"]] == [PHONE_PAGE, SOLO]


def test_a_tick_with_nothing_to_write_onto_a_waiting_watch_is_no_refusal(env) -> None:
    """Only a write that would make the first record waits: a tick the
    target already has writes nothing there."""
    _save(env, WATCH_2, {"schemaVersion": 1, "pages": [{"id": PHONE_PAGE, "name": "Own", "items": []}]})
    _pick(env, [SOLO], [WATCH_2])
    env.awaiting.add(WATCH_2)
    env.changes.clear()
    _pick(env, [SOLO], [WATCH_2])
    assert env.changes == []


def test_link_device_onto_a_watch_awaiting_its_move_is_refused(env) -> None:
    env.awaiting.add(WATCH_2)
    _save(env, PHONE, {"schemaVersion": 1, "pages": [{"id": PHONE_PAGE, "name": "Mine", "items": []}]})
    env.changes.clear()
    with pytest.raises(env.mod.WatchConfigLinkError) as err:
        env.store.link_device(PHONE, WATCH_2, updated_by="panel")
    assert err.value.code == "awaiting_move"
    assert env.changes == []
    assert env.store.get(WATCH_2, "pages") is None


def test_link_device_copies_no_menus_onto_a_watch_awaiting_its_move(env) -> None:
    """The pages came over, the menus not yet: the move brings the watch's
    own menus, so the source's are not copied in their place."""
    menus = {"quickAction": {"slots": []}, "entityRadial": {}, "pageSwitcher": {}}
    _save(env, WATCH, menus, "menus")
    _save(env, WATCH_2, {"schemaVersion": 1, "pages": [{"id": PHONE_PAGE, "name": "Own", "items": []}]})
    _save(env, WATCH_2, {"schemaVersion": 1, "statusPages": []}, "status_pages")
    env.awaiting.add(WATCH_2)
    result = env.store.link_device(WATCH, WATCH_2, updated_by="panel")
    assert result["copied"] == []
    assert env.store.get(WATCH_2, "menus") is None
    assert result["page_ids"] == [HOME, LIGHTS, SOLO]


# ── an edit reaches every device that has the page ───────────────────────


def test_a_watch_edit_reaches_the_phone_keeping_its_place_and_hidden(env) -> None:
    _pick(env, [HOME, LIGHTS], [PHONE])
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


def test_a_device_put_reaches_the_other_device_too(env) -> None:
    _pick(env, [SOLO], [PHONE])
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


def test_a_change_to_a_page_only_one_device_has_wakes_no_one_else(env) -> None:
    _pick(env, [SOLO], [PHONE])
    env.changes.clear()
    watch = _doc(env, WATCH)
    _page(watch, HOME)["name"] = "Only here"
    _page(watch, SOLO)["isHidden"] = True  # per device
    _save(env, WATCH, watch)
    assert env.changes == [(WATCH, "pages")]
    assert "isHidden" not in _page(_doc(env, PHONE), SOLO)


def test_a_status_page_edit_reaches_every_device_that_has_it(env) -> None:
    _pick(env, [HOME], [PHONE])
    status = _doc(env, WATCH, "status_pages")
    status["statusPages"][0]["name"] = "Front doors"
    env.changes.clear()
    _save(env, WATCH, status, "status_pages")
    assert _doc(env, PHONE, "status_pages")["statusPages"][0]["name"] == "Front doors"
    assert env.changes == [(WATCH, "status_pages"), (PHONE, "status_pages")]


def test_a_restore_reaches_every_device_that_has_the_page(env) -> None:
    _pick(env, [SOLO], [PHONE])
    watch = _doc(env, WATCH)
    shared_revision = env.store.get(WATCH, "pages").revision
    _page(watch, SOLO)["name"] = "Renamed"
    _save(env, WATCH, watch)
    assert _page(_doc(env, PHONE), SOLO)["name"] == "Renamed"
    env.store.restore(
        WATCH, "pages", shared_revision, base_revision=env.store.get(WATCH, "pages").revision
    )
    assert _page(_doc(env, PHONE), SOLO)["name"] == "Solo"


def test_taking_a_page_off_one_device_leaves_the_others_alone(env) -> None:
    _pick(env, [SOLO], [PHONE, WATCH_2])
    revisions = {o: env.store.get(o, "pages").revision for o in (WATCH, WATCH_2)}
    phone = _doc(env, PHONE)
    phone["pages"] = []
    env.changes.clear()
    _save(env, PHONE, phone)
    assert env.changes == [(PHONE, "pages")]
    assert {o: env.store.get(o, "pages").revision for o in (WATCH, WATCH_2)} == revisions
    assert _page(_doc(env, WATCH), SOLO)["name"] == "Solo", "the page itself stays"
    # Down to one device, it still is not written.
    watch_2 = _doc(env, WATCH_2)
    watch_2["pages"] = [p for p in watch_2["pages"] if p["id"] != SOLO]
    env.changes.clear()
    _save(env, WATCH_2, watch_2)
    assert env.changes == [(WATCH_2, "pages")]


def test_forgetting_a_device_writes_nothing_on_the_others(env) -> None:
    _pick(env, [HOME, LIGHTS], [PHONE])
    revisions = env.store.revisions(WATCH)
    env.changes.clear()
    assert env.store.forget_owner(PHONE) is True
    watch = _doc(env, WATCH)
    assert [p["id"] for p in watch["pages"]] == [SYSTEM, HOME, LIGHTS, SOLO], "the pages stay"
    assert env.store.revisions(WATCH) == revisions
    # Only the forget's own revision-0 announcements.
    assert env.changes == [(PHONE, "pages"), (PHONE, "status_pages")]
    assert env.store.library_summary()["pages"][HOME]["owners"] == [WATCH]


def test_a_copy_over_its_cap_is_left_and_the_save_stands(env, monkeypatch) -> None:
    _pick(env, [SOLO], [PHONE])
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


def test_a_save_or_restore_names_the_devices_it_could_not_keep_in_step(env, monkeypatch) -> None:
    _pick(env, [SOLO], [PHONE, WATCH_2])
    real = env.mod.validate_document

    def capped(kind, document, **kwargs):
        # Only the phone's record is over its cap once it takes the new name.
        if (
            document is not None
            and not kwargs.get("check_items")
            and any(p.get("id") == PHONE_PAGE for p in document.get("pages", []))
            and any(p.get("name") == "Bigger" for p in document.get("pages", []))
        ):
            raise env.mod.WatchConfigValidationError("too big")
        return real(kind, document, **kwargs)

    phone = _doc(env, PHONE)
    phone["pages"].insert(0, {"id": PHONE_PAGE, "name": "Mine", "items": []})
    _save(env, PHONE, phone)
    monkeypatch.setattr(env.mod, "validate_document", capped)
    watch = _doc(env, WATCH)
    _page(watch, SOLO)["name"] = "Bigger"
    failed: list[str] = []
    bigger = env.store.panel_save(
        WATCH, "pages", watch, base_revision=env.store.get(WATCH, "pages").revision,
        link_failures=failed,
    ).revision
    assert failed == [PHONE]
    assert _page(_doc(env, WATCH_2), SOLO)["name"] == "Bigger"
    assert _page(_doc(env, PHONE), SOLO)["name"] == "Solo"

    # A record that takes the change is no failure.
    watch = copy.deepcopy(watch)
    _page(watch, SOLO)["name"] = "Back"
    failed = []
    back = env.store.panel_save(WATCH, "pages", watch, base_revision=bigger, link_failures=failed)
    assert failed == []
    assert _page(_doc(env, PHONE), SOLO)["name"] == "Back"

    failed_restore: list[str] = []
    env.store.restore(
        WATCH, "pages", bigger, base_revision=back.revision, link_failures=failed_restore
    )
    assert failed_restore == [PHONE]
    assert _page(_doc(env, WATCH), SOLO)["name"] == "Bigger"
    assert _page(_doc(env, PHONE), SOLO)["name"] == "Back"


# ── the iPhone's copy of a watch (link_device) ───────────────────────────


def test_link_device_gives_every_page_the_menus_and_the_rooms_once(env) -> None:
    """"Use pages from <watch>": the target picks every page and status page
    of the source, and, having none of its own, uses the source's menus
    (one menu on both from then on) and is given its rooms."""
    menus = {"quickAction": {"slots": []}, "entityRadial": {}, "pageSwitcher": {}}
    _save(env, WATCH, menus, "menus")
    _save(env, WATCH, {"roomAutoSwitchEnabled": True, "hapticsEnabled": False}, "behavior")
    env.changes.clear()
    result = env.store.link_device(WATCH, PHONE, updated_by=PHONE)
    assert result["page_ids"] == [HOME, LIGHTS, SOLO]
    assert result["copied"] == ["menus", "rooms"]
    assert [p["id"] for p in _doc(env, PHONE)["pages"]] == [HOME, LIGHTS, SOLO]
    assert _doc(env, PHONE, "menus") == menus
    picks = env.store.library_summary()["picks"]
    assert picks[PHONE]["menus"] == picks[WATCH]["menus"]
    assert _doc(env, PHONE, "rooms") == {"schemaVersion": 1, "roomAutoSwitchEnabled": True}
    assert env.store.get(PHONE, "menus").updated_by == PHONE
    assert _no_link_keys(_doc(env, PHONE)) and _no_link_keys(_doc(env, WATCH))

    # One menu: an edit of the phone's reaches the watch's.
    edited = {"quickAction": {"slots": []}, "entityRadial": {"x": 1}, "pageSwitcher": {}}
    _save(env, PHONE, edited, "menus")
    assert _doc(env, WATCH, "menus") == edited
    # Its own copy, and an edit of that stays on the phone.
    env.store.library_copy_menu(PHONE, "entity", "Phone menu")
    mine = {"quickAction": {"slots": []}, "entityRadial": {"y": 2}, "pageSwitcher": {}}
    _save(env, PHONE, mine, "menus")
    assert _doc(env, WATCH, "menus") == edited
    again = env.store.link_device(WATCH, PHONE, updated_by=PHONE)
    assert again["copied"] == []
    assert _doc(env, PHONE, "menus") == mine


def test_link_device_adds_the_starters_beside_the_targets_own(env) -> None:
    """A target whose own starter differs: that one arrived under an id of
    its own, so the source's starter is added beside it, and the target's
    other status pages stay its own."""
    _save(env, WATCH, _with_starter("Batteries", isSystemDefault=True), "status_pages")
    _save(
        env,
        PHONE,
        _own_starter({"id": PHONE_PAGE, "name": "Phone", "rows": []}, isSystemDefault=True),
        "status_pages",
    )
    own = _phone_status(env)[1]["id"]
    first = env.store.link_device(WATCH, PHONE, updated_by=PHONE)
    assert first["targets"][PHONE]["status_pages"] == [DOORS, STARTER]
    assert first["targets"][PHONE]["adopted_status_pages"] == []
    phone = _phone_status(env)
    assert [p["id"] for p in phone] == [PHONE_PAGE, own, DOORS, STARTER]
    assert _no_link_keys(_doc(env, PHONE, "status_pages"))
    again = env.store.link_device(WATCH, PHONE, updated_by=PHONE)
    assert again["targets"][PHONE]["status_pages"] == []


def test_link_device_keeps_the_hidden_marks_of_the_source(env) -> None:
    """A page hidden on the source is hidden on the target too; the target
    may show it from then on alone."""
    env.store.link_device(WATCH, PHONE, updated_by=PHONE)
    assert _page(_doc(env, PHONE), LIGHTS)["isHidden"] is True
    phone = _doc(env, PHONE)
    _page(phone, LIGHTS)["isHidden"] = False
    _save(env, PHONE, phone)
    assert _page(_doc(env, WATCH), LIGHTS)["isHidden"] is True


def test_link_places_names_only_voice_links(env) -> None:
    _pick(env, [SOLO], [PHONE, WATCH_2])
    assert env.store.link_places() == {"voice": {}}
