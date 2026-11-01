"""Pure tests for Make a copy of a library page (``library.fork_page``).

The page menu's Make a copy turns one page into two for some of the devices
that use it (``pages-design-v4.md``, "The one escape hatch"): those devices
use the copy in its place, and what opened the page on them opens the copy.
Here: the picks moving in place, the menu slots and page links pointed at
the copy, a shared menu copied for those devices only, the original left
as it was, and the refusals.

Loaded from its file into a stand-in package, as ``test_library.py`` does.
"""

from __future__ import annotations

import copy
import importlib.util
import sys
import types
from pathlib import Path

import pytest

_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_PKG = "wa_library_fork_test_pkg"
_pkg = types.ModuleType(_PKG)
_pkg.__path__ = []
sys.modules[_PKG] = _pkg


def _load(name: str):
    spec = importlib.util.spec_from_file_location(f"{_PKG}.{name}", _DIR / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


_load("page_links")
lib = _load("library")

WATCH = "watch-A"
WATCH_2 = "watch-B"
PHONE = "phone-1"
HOME = "AAAAAAAA-0000-4000-8000-000000000001"
LIGHTS = "AAAAAAAA-0000-4000-8000-000000000002"
SOLO = "AAAAAAAA-0000-4000-8000-000000000003"
SYSTEM = "AAAAAAAA-0000-4000-8000-0000000000FF"
SHARED_MENU = "MENU-SHARED"
PHONE_MENU = "MENU-PHONE"
SCREENS = {
    "watch": {"T1": {"col": 0, "row": 0, "colSpan": 6, "rowSpan": 4}},
    "iphone": {"T1": {"col": 0, "row": 0, "colSpan": 12, "rowSpan": 4}},
}


def _slot(n: int, page_id: str, position: str = "topLeft") -> dict:
    return {
        "id": f"S{n}",
        "action": {"type": "navigateToPage", "pageId": page_id},
        "isVisible": True,
        "position": position,
    }


def _anywhere(*slots: dict) -> dict:
    return {
        "quickAction": {"beamStyle": "auroraWash", "schemaVersion": 1, "slots": list(slots)},
        "pageSwitcher": {"displayMode": "icon", "schemaVersion": 1},
    }


def _library() -> dict:
    """Home links to Lights; the two watches and the iPhone all use Home
    and Lights, the iPhone alone uses Solo, which links to Lights too. The
    watches share one Anywhere menu with a slot for Lights; the iPhone has
    its own, also with one. The iPhone's Settings page links to Lights."""
    library = lib.empty_library()
    library["pages"] = {
        HOME: {"id": HOME, "name": "Home", "items": [{"id": "T1", "entityId": f"page.{LIGHTS}"}]},
        LIGHTS: {
            "id": LIGHTS,
            "name": "Lights",
            "items": [{"id": "T1", "entityId": "light.a"}],
            "screens": copy.deepcopy(SCREENS),
        },
        SOLO: {"id": SOLO, "name": "Solo", "items": [{"id": "T1", "entityId": f"show_page.{LIGHTS}"}]},
    }
    library["menus"] = {
        SHARED_MENU: {
            "name": "Anywhere menu",
            "kind": "anywhere",
            "sections": _anywhere(_slot(1, LIGHTS, "top"), _slot(2, HOME, "bottom")),
        },
        PHONE_MENU: {"name": "Phone menu", "kind": "anywhere", "sections": _anywhere(_slot(1, LIGHTS))},
    }
    settings = {"id": SYSTEM, "name": "Settings", "isSystemPage": True,
                "items": [{"id": "T9", "entityId": f"page.{LIGHTS}"}]}
    library["picks"] = {
        WATCH: {"pages": [{"id": HOME}, {"id": LIGHTS, "isHidden": True}], "menus": {"anywhere": SHARED_MENU}},
        WATCH_2: {"pages": [{"id": LIGHTS}, {"id": HOME}], "menus": {"anywhere": SHARED_MENU}},
        PHONE: {
            "pages": [{"id": SYSTEM, "page": settings}, {"id": HOME}, {"id": LIGHTS, "isHidden": False}, {"id": SOLO}],
            "menus": {"anywhere": PHONE_MENU},
        },
    }
    return lib.validate_library(library)


def _fork(library: dict, owners: list[str], **kw) -> lib.Forked:
    before = copy.deepcopy(library)
    forked = lib.fork_page(library, LIGHTS, owners, **kw)
    assert library == before, "fork_page changed its input"
    return forked


def _what(forked: lib.Forked, owner: str, key: str = "rewritten") -> list[str]:
    return [entry["what"] for entry in getattr(forked, key) if entry["owner_id"] == owner]


def test_the_copy_holds_the_same_content_and_screens_under_a_new_id() -> None:
    forked = _fork(_library(), [PHONE])
    copy_page = forked.library["pages"][forked.id]
    original = forked.library["pages"][LIGHTS]
    assert forked.id != LIGHTS and forked.id == forked.id.upper()
    (tile,) = copy_page["items"]
    assert tile["id"] != "T1" and tile["id"] == tile["id"].upper(), "the tile has an id of its own"
    renamed = {
        **original,
        "id": forked.id,
        "items": [{**original["items"][0], "id": tile["id"]}],
        "screens": {screen: {tile["id"]: g["T1"]} for screen, g in SCREENS.items()},
    }
    assert copy_page == renamed
    assert original["screens"] == SCREENS, "the original keeps its tile ids"
    assert forked.library["item_revisions"]["pages"][forked.id] == 1


def test_the_copy_s_tiles_take_new_own_ids_as_the_panel_s_duplicate_does() -> None:
    library = _library()
    page = library["pages"][LIGHTS]
    page["items"] = [
        {"id": "T1", "entityId": "light.a"},
        {"id": "T2", "entityId": "template.ABC", "template": "{{ 1 }}"},
        {"id": "T3", "entityId": "spacer.DEF"},
        {"entityId": "multicam.GHI"},
    ]
    page["screens"] = {
        "watch": {"T1": {"col": 0, "row": 0, "colSpan": 6, "rowSpan": 4}, "t2": {"col": 6, "row": 0, "colSpan": 6, "rowSpan": 4}},
        "iphone": {"T3": {"col": 0, "row": 0, "colSpan": 3, "rowSpan": 3}},
    }
    library = lib.validate_library(library)
    forked = _fork(library, [PHONE])
    tiles = forked.library["pages"][forked.id]["items"]
    old = forked.library["pages"][LIGHTS]["items"]
    assert [t["entityId"] for t in old] == ["light.a", "template.ABC", "spacer.DEF", "multicam.GHI"]
    assert tiles[0]["entityId"] == "light.a", "a real entity keeps its id"
    for tile, kind, before in zip(tiles[1:], ("template", "spacer", "multicam"), old[1:]):
        assert tile["entityId"].startswith(f"{kind}.") and tile["entityId"] != before["entityId"]
    assert "id" not in tiles[3], "a tile with no id keeps none: no screen names it"
    assert tiles[1]["template"] == "{{ 1 }}"
    ids = [t["id"] for t in tiles[:3]]
    assert not {"T1", "T2", "T3"} & set(ids) and len(set(ids)) == 3
    screens = forked.library["pages"][forked.id]["screens"]
    assert set(screens["watch"]) == {ids[0], ids[1]}
    assert set(screens["iphone"]) == {ids[2]}
    assert screens["watch"][ids[1]] == {"col": 6, "row": 0, "colSpan": 6, "rowSpan": 4}


def test_a_name_names_the_copy_and_an_empty_one_is_refused() -> None:
    forked = _fork(_library(), [PHONE], name="Lights (iPhone)")
    assert forked.library["pages"][forked.id]["name"] == "Lights (iPhone)"
    assert forked.library["pages"][LIGHTS]["name"] == "Lights"
    with pytest.raises(lib.LibraryError) as err:
        lib.fork_page(_library(), LIGHTS, [PHONE], name="  ")
    assert err.value.code == "invalid"


def test_the_named_devices_pick_the_copy_in_the_original_s_place() -> None:
    forked = _fork(_library(), [PHONE])
    picks = forked.library["picks"][PHONE]["pages"]
    assert [p["id"] for p in picks] == [SYSTEM, HOME, forked.id, SOLO]
    assert picks[2] == {"id": forked.id, "isHidden": False}
    # The others keep the original, in their own spot and with their own hide.
    assert forked.library["picks"][WATCH]["pages"] == [{"id": HOME}, {"id": LIGHTS, "isHidden": True}]
    assert forked.library["picks"][WATCH_2]["pages"] == [{"id": LIGHTS}, {"id": HOME}]
    assert lib.pickers(forked.library, "pages")[LIGHTS] == [WATCH, WATCH_2]
    assert lib.pickers(forked.library, "pages")[forked.id] == [PHONE]


def test_the_original_keeps_its_id_and_content() -> None:
    library = _library()
    forked = _fork(library, [PHONE])
    assert forked.library["pages"][LIGHTS] == library["pages"][LIGHTS]
    assert forked.library["item_revisions"]["pages"][LIGHTS] == library["item_revisions"]["pages"][LIGHTS]


def test_a_menu_only_the_named_devices_use_is_pointed_at_the_copy_in_place() -> None:
    forked = _fork(_library(), [PHONE])
    menu = forked.library["menus"][PHONE_MENU]
    assert menu["sections"]["quickAction"]["slots"][0]["action"]["pageId"] == forked.id
    assert forked.library["picks"][PHONE]["menus"] == {"anywhere": PHONE_MENU}
    assert "menu slot Top left in Phone menu" in _what(forked, PHONE)


def test_a_shared_menu_is_copied_for_the_named_devices_only() -> None:
    library = _library()
    forked = _fork(library, [WATCH_2], names={WATCH_2: "Chen's Apple Watch"})
    fork_id = forked.library["picks"][WATCH_2]["menus"]["anywhere"]
    assert fork_id not in (SHARED_MENU, PHONE_MENU)
    fork = forked.library["menus"][fork_id]
    assert fork["name"] == "Chen's Apple Watch's menu"
    assert fork["kind"] == "anywhere"
    slots = fork["sections"]["quickAction"]["slots"]
    assert [s["action"]["pageId"] for s in slots] == [forked.id, HOME]
    # The other watch keeps the menu as it was, still opening the original.
    assert forked.library["picks"][WATCH]["menus"]["anywhere"] == SHARED_MENU
    assert forked.library["menus"][SHARED_MENU] == library["menus"][SHARED_MENU]
    assert _what(forked, WATCH_2)[0] == (
        "menu slot Top in Chen's Apple Watch's menu, a copy of Anywhere menu"
    )


def test_page_links_on_pages_only_they_use_open_the_copy() -> None:
    forked = _fork(_library(), [PHONE])
    solo = forked.library["pages"][SOLO]
    assert solo["items"][0]["entityId"] == f"show_page.{forked.id}"
    settings = forked.library["picks"][PHONE]["pages"][0]["page"]
    assert settings["items"][0]["entityId"] == f"page.{forked.id}"
    assert _what(forked, PHONE) == [
        "menu slot Top left in Phone menu",
        "Peek page tile on Solo",
        "Go to page tile on Settings",
    ]


def test_a_page_link_on_a_shared_page_stays_on_the_original_and_is_named() -> None:
    forked = _fork(_library(), [PHONE])
    assert forked.library["pages"][HOME]["items"][0]["entityId"] == f"page.{LIGHTS}"
    assert _what(forked, PHONE, "kept") == [
        "Go to page tile on Home still opens the original: that page is shared"
    ]


def test_every_device_of_a_shared_page_moving_points_its_links_in_place() -> None:
    forked = _fork(_library(), [WATCH, WATCH_2, PHONE])
    assert forked.library["pages"][HOME]["items"][0]["entityId"] == f"page.{forked.id}"
    # The watches' one menu now has only movers, so it is pointed in place.
    assert forked.library["picks"][WATCH]["menus"]["anywhere"] == SHARED_MENU
    slots = forked.library["menus"][SHARED_MENU]["sections"]["quickAction"]["slots"]
    assert slots[0]["action"]["pageId"] == forked.id
    assert forked.kept == []
    assert lib.pickers(forked.library, "pages")[LIGHTS] == []
    assert LIGHTS in forked.library["pages"], "the original stays in the library"


def test_the_records_of_the_named_devices_change_and_the_others_do_not() -> None:
    forked = _fork(_library(), [PHONE])
    assert set(forked.touched) == {PHONE}
    assert forked.touched[PHONE] == ["pages", "menus"]
    record = lib.materialise(forked.library, PHONE, "pages", screen="iphone")
    assert [p["id"] for p in record["pages"]] == [SYSTEM, HOME, forked.id, SOLO]


def test_the_library_remembers_the_copy_for_the_named_devices() -> None:
    forked = _fork(_library(), [PHONE])
    assert lib.held_renames(forked.library, PHONE)["pages"] == {LIGHTS: forked.id}
    assert lib.held_renames(forked.library, WATCH)["pages"] == {}


def test_ids_are_compared_ignoring_case() -> None:
    forked = lib.fork_page(_library(), LIGHTS.lower(), [PHONE])
    assert forked.library["picks"][PHONE]["pages"][2]["id"] == forked.id


@pytest.mark.parametrize(
    ("item_id", "owners", "code"),
    [
        ("nope", [PHONE], "not_found"),
        (LIGHTS, [], "invalid"),
        (LIGHTS, "phone-1", "invalid"),
        (LIGHTS, ["ghost"], "invalid"),
        (LIGHTS, [PHONE, "ghost"], "invalid"),
        (SOLO, [WATCH], "invalid"),
        (SYSTEM, [PHONE], "not_found"),
    ],
)
def test_refusals(item_id, owners, code) -> None:
    with pytest.raises(lib.LibraryError) as err:
        lib.fork_page(_library(), item_id, owners)
    assert err.value.code == code


def test_room_words_name_what_a_rename_changed() -> None:
    before = {"roomQuickJumpFallbackPageId": LIGHTS,
              "roomQuickJumpMappings": {"kitchen": LIGHTS, "hall": HOME}}
    after = lib.rename_refs("rooms", before, {LIGHTS: "NEW"})
    assert lib.room_words(before, after) == ["room fallback page", "room kitchen"]
    assert lib.room_words(before, before) == []
