"""In-process tests for menus on several devices in ``WatchConfigStore``:
one library menu, ticked onto devices (``library.py``).

The same store and fixture as ``test_page_links_store.py``. A tick
(``library_pick`` with kind ``menus``) makes a device use a library menu for
a unit (the Anywhere menu with the page switcher, or the Entity quick menu).
Every accepted write of ``menus`` updates the menus the owner uses, and each
other owner using one of them is written again. No record carries a link
mark: "Make a copy for this watch" (``library_copy_menu``) is the way to a
device's own menu, and a forget or a move never writes another device's
menus. Menus no longer link (``link_units`` refuses them).
"""

from __future__ import annotations

import copy

import pytest

from test_page_links_store import (  # noqa: F401 (env is a fixture)
    DOORS,
    HASH,
    HOME,
    LIGHTS,
    PHONE,
    SOLO,
    STARTER,
    SYSTEM,
    WATCH,
    WATCH_2,
    _doc,
    _save,
    env,
)

WATCH_3 = "watch-C"


@pytest.fixture
def ctx(env):  # noqa: F811 (the imported fixture)
    return env


def _slot(n: int, action: dict) -> dict:
    return {"id": f"S{n}", "action": action, "isVisible": True, "position": "topLeft"}


def _menus(beam: str = "auroraWash", light: bool = True) -> dict:
    return {
        "entityRadial": {
            "allSlots": [_slot(1, {"type": "assist"})],
            "lightInheritsAll": light,
            "lightSlots": [_slot(2, {"type": "navigateToPage", "pageId": SOLO})],
            "schemaVersion": 1,
        },
        "pageSwitcher": {"displayMode": "icon", "schemaVersion": 1},
        "quickAction": {
            "beamStyle": beam,
            "schemaVersion": 1,
            "slots": [
                _slot(1, {"type": "navigateToPage", "pageId": HOME}),
                _slot(2, {"type": "showStatusPage", "pageId": DOORS}),
                _slot(3, {"type": "navigateToPage", "pageId": SYSTEM}),
                _slot(4, {"type": "navigateToPage", "pageId": "gone"}),
                _slot(5, {"type": "speakPhrase", "phraseId": "P1"}),
            ],
        },
        "schemaVersion": 1,
    }


def _menus_record(ctx) -> None:
    _save(ctx, WATCH, _menus(), "menus")
    ctx.changes.clear()


def _starter_status(name: str, *others: dict) -> dict:
    return {
        "schemaVersion": 1,
        "statusPages": [*others, {"id": STARTER, "name": name, "rows": [], "isSystemDefault": True}],
    }


def _picked(ctx, owner: str) -> dict:
    return ctx.store.library_summary()["picks"][owner]["menus"]


def _tick(ctx, units, targets) -> dict:
    """Tick the menus the watch uses for ``units`` onto each target."""
    menus = _picked(ctx, WATCH)
    for target in targets:
        for unit in units:
            ctx.store.library_pick(target, "menus", menus[unit], unit=unit)
    return menus


def _linked(ctx, units=("anywhere",), targets=(PHONE,)) -> dict:
    """The watch's menus, and each target with the pages the watch's slots
    open and the watch's menus for ``units``."""
    _menus_record(ctx)
    for target in targets:
        for page_id in (HOME, LIGHTS):
            ctx.store.library_pick(target, "pages", page_id, on=True)
    menus = _tick(ctx, units, targets)
    ctx.changes.clear()
    return menus


def _no_link_ids(ctx, *owners: str) -> bool:
    return all("linkIds" not in _doc(ctx, owner, "menus") for owner in owners)


# ── ticks ────────────────────────────────────────────────────────────────


def test_a_tick_onto_a_device_with_no_menus_starts_them_from_the_watch(ctx) -> None:
    _menus_record(ctx)
    menus = _tick(ctx, ["anywhere"], [PHONE])
    assert _doc(ctx, PHONE, "menus") == _menus()
    assert _no_link_ids(ctx, WATCH, PHONE)
    mine = _picked(ctx, PHONE)
    assert mine["anywhere"] == menus["anywhere"]
    assert mine["entity"] != menus["entity"], "the other menu is the phone's own copy"
    assert ctx.changes == [(PHONE, "menus")], "the watch is not written"


def test_ticking_the_same_menu_again_writes_nothing(ctx) -> None:
    _linked(ctx, units=("anywhere", "entity"))
    _tick(ctx, ["entity", "anywhere"], [PHONE])
    assert ctx.changes == []


@pytest.mark.parametrize("kind", ["menus", "pages", "status_pages"])
def test_the_library_kinds_no_longer_link(ctx, kind) -> None:
    _menus_record(ctx)
    with pytest.raises(ctx.mod.WatchConfigStoreError) as err:
        ctx.store.link_units(kind, WATCH, ["anywhere"], [PHONE])
    assert err.value.code == "invalid"
    assert "library/pick" in err.value.message
    assert ctx.changes == []


def test_a_tick_never_starts_the_menus_of_a_watch_awaiting_its_move(ctx) -> None:
    _menus_record(ctx)
    _save(ctx, WATCH_2, {"schemaVersion": 1, "pages": []})
    _save(ctx, WATCH_2, {"schemaVersion": 1, "statusPages": []}, "status_pages")
    ctx.awaiting.add(WATCH_2)
    ctx.changes.clear()
    with pytest.raises(ctx.mod.WatchConfigLinkError) as err:
        _tick(ctx, ["entity"], [WATCH_2])
    assert err.value.code == "awaiting_move"
    assert ctx.changes == []
    assert ctx.store.get(WATCH_2, "menus") is None


def test_the_target_check_is_the_phone_kinds_table(ctx) -> None:
    """An iPhone owns its menus, so it is a target; a unit kind it may not
    own (the voice settings) is refused for it with no code of its own."""
    with pytest.raises(ctx.mod.WatchConfigPhoneKindError):
        ctx.store.link_units("voice", WATCH, ["phrases"], [PHONE])


# ── an edit reaches every device using the menu ──────────────────────────


def test_a_shared_menu_edit_reaches_the_other_and_its_own_menu_does_not(ctx) -> None:
    _linked(ctx)
    watch = _doc(ctx, WATCH, "menus")
    watch["quickAction"]["beamStyle"] = "ripplePulse"
    watch["pageSwitcher"]["displayMode"] = "name"
    _save(ctx, WATCH, watch, "menus")
    phone = _doc(ctx, PHONE, "menus")
    assert phone["quickAction"]["beamStyle"] == "ripplePulse"
    assert phone["pageSwitcher"]["displayMode"] == "name", "the switcher goes with it"
    assert ctx.changes == [(WATCH, "menus"), (PHONE, "menus")], "one revision each"
    assert ctx.store.get(PHONE, "menus").updated_by == "panel"

    watch = _doc(ctx, WATCH, "menus")
    watch["entityRadial"]["lightInheritsAll"] = False
    ctx.changes.clear()
    _save(ctx, WATCH, watch, "menus")
    assert ctx.changes == [(WATCH, "menus")]
    assert _doc(ctx, PHONE, "menus")["entityRadial"]["lightInheritsAll"] is True


def test_a_slot_added_to_a_shared_menu_brings_its_page_along(ctx) -> None:
    """A Go to page slot added to a menu another device uses opens a page
    that device lacks: the page comes along, before the menu that opens
    it."""
    _linked(ctx)
    assert SOLO not in [p["id"] for p in _doc(ctx, PHONE)["pages"]]
    watch = _doc(ctx, WATCH, "menus")
    watch["quickAction"]["slots"].append(_slot(6, {"type": "navigateToPage", "pageId": SOLO}))
    _save(ctx, WATCH, watch, "menus")
    phone_pages = _doc(ctx, PHONE)["pages"]
    assert [p["id"] for p in phone_pages] == [HOME, LIGHTS, SOLO]
    assert all("linkId" not in p for p in phone_pages)
    assert ctx.changes == [(WATCH, "menus"), (PHONE, "pages"), (PHONE, "menus")]
    assert _doc(ctx, PHONE, "menus")["quickAction"]["slots"][-1]["action"]["pageId"] == SOLO

    # A slot the menu already had brings nothing again, even once the page
    # was taken off the other device: it was its own choice there.
    phone = _doc(ctx, PHONE)
    phone["pages"] = [p for p in phone["pages"] if p["id"] != SOLO]
    _save(ctx, PHONE, phone)
    watch = _doc(ctx, WATCH, "menus")
    watch["quickAction"]["beamStyle"] = "ripplePulse"
    ctx.changes.clear()
    _save(ctx, WATCH, watch, "menus")
    assert ctx.changes == [(WATCH, "menus"), (PHONE, "menus")]


def test_a_slot_added_to_a_shared_menu_brings_a_starter_onto_the_other(ctx) -> None:
    """A Status page slot added that opens a starter puts that starter on
    the other device too, before the menu that opens it."""
    _save(ctx, WATCH, _starter_status("Batteries", {"id": DOORS, "name": "Doors", "rows": []}),
          "status_pages")
    _linked(ctx)
    assert [p["id"] for p in _doc(ctx, PHONE, "status_pages")["statusPages"]] == [DOORS]
    watch = _doc(ctx, WATCH, "menus")
    watch["quickAction"]["slots"].append(_slot(6, {"type": "showStatusPage", "pageId": STARTER}))
    _save(ctx, WATCH, watch, "menus")
    held = _doc(ctx, PHONE, "status_pages")["statusPages"]
    assert [p["id"] for p in held] == [DOORS, STARTER]
    assert held[1]["name"] == "Batteries" and "linkId" not in held[1]
    assert ctx.changes == [(WATCH, "menus"), (PHONE, "status_pages"), (PHONE, "menus")]


def test_a_status_page_saved_under_a_shared_id_is_an_edit_of_it(ctx) -> None:
    """One id is one page: a device that saves a status page under an id
    the library holds edits that page, for every device that has it."""
    _save(ctx, WATCH, _starter_status("Batteries", {"id": DOORS, "name": "Doors", "rows": []}),
          "status_pages")
    _linked(ctx)
    phone = _doc(ctx, PHONE, "status_pages")
    phone["statusPages"].append({"id": STARTER, "name": "Mine", "rows": [], "isHidden": True})
    _save(ctx, PHONE, phone, "status_pages")
    assert _doc(ctx, WATCH, "status_pages")["statusPages"][1]["name"] == "Mine"
    held = _doc(ctx, PHONE, "status_pages")["statusPages"]
    assert held[1]["isHidden"] is True, "hidden on the phone only"
    assert "isHidden" not in _doc(ctx, WATCH, "status_pages")["statusPages"][1]


def test_a_slot_whose_page_the_other_device_already_has_brings_nothing(ctx) -> None:
    """The phone saved a page under SOLO's id, which is an edit of SOLO, so
    it has SOLO already: the new slot writes its menus and nothing more."""
    _linked(ctx)
    phone = _doc(ctx, PHONE)
    phone["pages"].append({"id": SOLO, "name": "Phone's own", "items": []})
    _save(ctx, PHONE, phone)
    ctx.changes.clear()
    watch = _doc(ctx, WATCH, "menus")
    watch["quickAction"]["slots"].append(_slot(6, {"type": "navigateToPage", "pageId": SOLO}))
    _save(ctx, WATCH, watch, "menus")
    assert ctx.changes == [(WATCH, "menus"), (PHONE, "menus")]
    assert next(p for p in _doc(ctx, WATCH)["pages"] if p["id"] == SOLO)["name"] == "Phone's own"
    assert _doc(ctx, PHONE, "menus")["quickAction"]["slots"][-1]["action"]["pageId"] == SOLO


def test_a_device_put_and_a_restore_reach_the_other(ctx) -> None:
    _linked(ctx)
    record = ctx.store.get(PHONE, "menus")
    phone = copy.deepcopy(record.document)
    phone["quickAction"]["beamStyle"] = "none"
    ctx.store.put(
        PHONE, "menus", phone, document_hash=HASH, base_revision=record.revision, updated_by=PHONE
    )
    assert _doc(ctx, WATCH, "menus")["quickAction"]["beamStyle"] == "none"
    assert ctx.store.get(WATCH, "menus").updated_by == PHONE

    shared_revision = ctx.store.get(PHONE, "menus").history[0].revision
    ctx.store.restore(
        PHONE, "menus", shared_revision, base_revision=ctx.store.get(PHONE, "menus").revision
    )
    assert _doc(ctx, WATCH, "menus")["quickAction"]["beamStyle"] == "auroraWash"


def test_a_copy_for_this_watch_is_the_way_to_a_menu_of_its_own(ctx) -> None:
    menus = _linked(ctx, units=("anywhere", "entity"))
    copied = ctx.store.library_copy_menu(PHONE, "anywhere", "Phone menu")
    assert _picked(ctx, PHONE) == {"anywhere": copied["id"], "entity": menus["entity"]}
    phone = _doc(ctx, PHONE, "menus")
    phone["quickAction"]["beamStyle"] = "none"
    phone["entityRadial"]["lightInheritsAll"] = False
    ctx.changes.clear()
    _save(ctx, PHONE, phone, "menus")
    watch = _doc(ctx, WATCH, "menus")
    assert watch["quickAction"]["beamStyle"] == "auroraWash", "the copy is the phone's alone"
    assert watch["entityRadial"]["lightInheritsAll"] is False, "the entity menu is still shared"
    assert ctx.changes == [(PHONE, "menus"), (WATCH, "menus")]


def test_forgetting_the_other_device_leaves_the_watch_s_menus_alone(ctx) -> None:
    menus = _linked(ctx, units=("anywhere", "entity"))
    revision = ctx.store.get(WATCH, "menus").revision
    ctx.store.forget_owner(PHONE)
    assert ctx.store.get(WATCH, "menus").revision == revision
    assert _picked(ctx, WATCH) == menus
    assert ctx.store.library_summary()["menus"][menus["anywhere"]]["owners"] == [WATCH]


def test_ticking_another_menu_moves_the_device_off_the_first(ctx) -> None:
    menus = _linked(ctx)
    third = _menus(beam="none")
    third["quickAction"]["slots"] = []
    ctx.store.panel_save(WATCH_2, "menus", third, base_revision=0)
    theirs = _picked(ctx, WATCH_2)["anywhere"]
    revision = ctx.store.get(WATCH, "menus").revision
    ctx.store.library_pick(PHONE, "menus", theirs, unit="anywhere")
    assert _doc(ctx, PHONE, "menus")["quickAction"]["beamStyle"] == "none"
    assert ctx.store.get(WATCH, "menus").revision == revision, "the watch is not written"
    summary = ctx.store.library_summary()["menus"]
    assert summary[menus["anywhere"]]["owners"] == [WATCH]
    assert summary[theirs]["owners"] == [PHONE, WATCH_2]


def test_a_move_carries_the_menu_picks_to_the_new_id(ctx) -> None:
    menus = _linked(ctx)
    phone = ctx.store.get(PHONE, "menus").revision
    ctx.store.move_owner(WATCH, WATCH_3, updated_by="move")
    assert _picked(ctx, WATCH_3) == menus
    assert ctx.store.get(PHONE, "menus").revision == phone
    owners = ctx.store.library_summary()["menus"][menus["anywhere"]]["owners"]
    assert owners == sorted([PHONE, WATCH_3])
    assert _no_link_ids(ctx, WATCH_3, PHONE)


def test_a_record_over_its_cap_is_left_and_the_save_stands(ctx, monkeypatch) -> None:
    _linked(ctx)
    real = ctx.mod.validate_document

    def capped(kind, document, **kwargs):
        big = document.get("quickAction", {}).get("beamStyle") == "wakeWave"
        if kind == "menus" and big and not kwargs.get("check_items"):
            raise ctx.mod.WatchConfigValidationError("too big")
        return real(kind, document, **kwargs)

    monkeypatch.setattr(ctx.mod, "validate_document", capped)
    watch = _doc(ctx, WATCH, "menus")
    watch["quickAction"]["beamStyle"] = "wakeWave"
    failed: list[str] = []
    ctx.store.panel_save(
        WATCH, "menus", watch, base_revision=ctx.store.get(WATCH, "menus").revision,
        link_failures=failed,
    )
    assert failed == [PHONE]
    assert _doc(ctx, PHONE, "menus")["quickAction"]["beamStyle"] == "auroraWash"


# ── the iPhone's copy of a watch (link_device) ───────────────────────────


def test_link_device_gives_the_target_the_source_s_menus(ctx) -> None:
    """A device with no menus uses the source's Anywhere and Entity quick
    menu, one menu each on every device that uses it."""
    menus = _linked(ctx)
    out = ctx.store.link_device(WATCH, WATCH_2, updated_by="panel")
    assert out["copied"] == ["menus"]
    assert _picked(ctx, WATCH_2) == menus
    assert _doc(ctx, WATCH_2, "menus") == _doc(ctx, WATCH, "menus")
    summary = ctx.store.library_summary()["menus"]
    assert summary[menus["anywhere"]]["owners"] == sorted([PHONE, WATCH, WATCH_2])
    assert summary[menus["entity"]]["owners"] == sorted([WATCH, WATCH_2])
