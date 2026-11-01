"""Pure tests for the two screens of a library page (``library.py``).

A page is one list of tiles, and the watch and the iPhone each place them
their own way, in the page's ``screens`` key (app repo
``docs/pages_two_screens_plan_2026-11.md``). Here: the key's checks, each
device's record stamped with its own screen, a device's save keeping the
other screen, a panel save taking the key whole, the one-time fill, and a
first record joining a page by the form its screen reads.

Loaded from its file into a stand-in package, as ``test_library.py`` does.
"""

from __future__ import annotations

import ast
import copy
import importlib.util
import sys
import types
from pathlib import Path

import pytest

_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_PKG = "wa_library_screens_test_pkg"
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
SCREEN = {WATCH: "watch", WATCH_2: "watch", PHONE: "iphone"}
PAGE = "AAAAAAAA-0000-4000-8000-000000000001"
OTHER = "AAAAAAAA-0000-4000-8000-000000000002"


def _tile(tile_id: str, entity_id: str, col: int = 0, row: int = 0, cols: int = 6, rows: int = 4) -> dict:
    return {"colSpan": cols, "entityId": entity_id, "gridCol": col, "gridRow": row, "id": tile_id, "rowSpan": rows}


def _at(col: int, row: int, cols: int = 6, rows: int = 4) -> dict:
    return {"col": col, "row": row, "colSpan": cols, "rowSpan": rows}


def _lights_page() -> dict:
    """Two lights and a map, as the page was before screens: the map only
    the iPhone draws."""
    return {
        "id": PAGE,
        "name": "Lights",
        "items": [
            _tile("T1", "light.a", 0, 0),
            _tile("T2", "light.b", 6, 0),
            _tile("M1", "map.home", 0, 4, 12, 6),
        ],
    }


def _split_page() -> dict:
    """The same page arranged apart: on the watch T2 comes first and the
    map is off; on the iPhone all three sit in one row of four across."""
    page = _lights_page()
    page["items"] = [
        _tile("T1", "light.a", 6, 0),
        _tile("T2", "light.b", 0, 0),
        _tile("M1", "map.home", 6, 0, 3, 3),
    ]
    page["screens"] = {
        "watch": {"T1": _at(6, 0), "T2": _at(0, 0)},
        "iphone": {"T1": _at(0, 0, 3, 3), "T2": _at(3, 0, 3, 3), "M1": _at(6, 0, 3, 3)},
    }
    return page


def _library(page: dict, owners=(WATCH, PHONE)) -> dict:
    raw = {
        "pages": {page["id"]: page},
        "picks": {owner: {"pages": [{"id": page["id"]}]} for owner in owners},
    }
    return lib.validate_library(raw)


def _pages_doc(page: dict) -> dict:
    return {"schemaVersion": 1, "pages": [page]}


def _built(library: dict, owner: str) -> dict:
    doc = lib.materialise(library, owner, "pages", None, SCREEN[owner])
    return doc["pages"][0]


def _grid(page: dict) -> list[tuple]:
    return [(t["id"], t["gridCol"], t["gridRow"], t["colSpan"], t["rowSpan"]) for t in page["items"]]


# ── the key's checks ─────────────────────────────────────────────────────


def test_the_watch_skipped_kinds_are_const_s_phone_only_kinds() -> None:
    tree = ast.parse((_DIR / "const.py").read_text())
    for node in tree.body:
        if isinstance(node, ast.Assign) and getattr(node.targets[0], "id", None) == "PHONE_ONLY_TILE_KINDS":
            assert frozenset(ast.literal_eval(node.value.args[0])) == lib.WATCH_SKIPPED_TILE_KINDS
            return
    raise AssertionError("PHONE_ONLY_TILE_KINDS is not in const.py")


def test_validate_keeps_good_screens_spelled_as_the_tiles() -> None:
    page = _split_page()
    page["screens"]["watch"] = {"t1": {**_at(6, 0), "on": True}, "T2": _at(0, 0)}
    library = _library(page)
    held = library["pages"][PAGE]["screens"]
    assert held["watch"] == {"T1": _at(6, 0), "T2": _at(0, 0)}, "the tile's spelling, no other key"
    assert held["iphone"] == _split_page()["screens"]["iphone"]


def test_validate_drops_what_does_not_fit_and_a_tile_on_no_screen() -> None:
    page = _split_page()
    page["items"].append(_tile("X1", "light.x"))
    page["screens"]["watch"]["T1"] = {"col": 12, "row": 0, "colSpan": 6, "rowSpan": 4}
    page["screens"]["watch"]["gone"] = _at(0, 0)
    page["screens"]["iphone"]["T2"] = {"col": 0, "row": 0, "colSpan": 13, "rowSpan": 4}
    page["screens"]["iphone"]["M1"] = {"col": 0, "row": "1", "colSpan": 3, "rowSpan": 3}
    held = _library(page)["pages"][PAGE]
    # T1 lost its watch place but keeps the iPhone's; T2 the other way
    # round; the map and X1 are on no screen any more, so they are gone.
    assert held["screens"] == {"watch": {"T2": _at(0, 0)}, "iphone": {"T1": _at(0, 0, 3, 3)}}
    assert [t["id"] for t in held["items"]] == ["T1", "T2"]


def test_validate_reads_a_screens_with_no_map_as_none() -> None:
    page = _lights_page()
    page["screens"] = "both"
    held = _library(page)["pages"][PAGE]
    assert "screens" not in held
    assert [t["id"] for t in held["items"]] == ["T1", "T2", "M1"]


def test_a_library_from_before_the_version_reads_as_one() -> None:
    assert lib.validate_library({"pages": {}})["version"] == 1
    assert lib.validate_library({"version": 2})["version"] == 2
    assert lib.empty_library()["version"] == lib.LIBRARY_VERSION == 2


# ── each device's record ─────────────────────────────────────────────────


def test_the_watch_gets_its_screen_in_its_order_without_the_off_tiles() -> None:
    library = _library(_split_page())
    watch = _built(library, WATCH)
    assert "screens" not in watch
    assert _grid(watch) == [("T2", 0, 0, 6, 4), ("T1", 6, 0, 6, 4)], "row then column"


def test_the_iphone_gets_its_own_screen() -> None:
    library = _library(_split_page())
    phone = _built(library, PHONE)
    assert "screens" not in phone
    assert _grid(phone) == [("T1", 0, 0, 3, 3), ("T2", 3, 0, 3, 3), ("M1", 6, 0, 3, 3)]
    # The item itself is untouched.
    assert library["pages"][PAGE]["screens"] == _split_page()["screens"]


def test_a_page_without_screens_reads_as_today_less_the_map_on_the_watch() -> None:
    library = _library(_lights_page())
    assert _built(library, WATCH)["items"] == _lights_page()["items"][:2]
    assert _built(library, PHONE) == _lights_page()


def test_stamping_leaves_out_a_field_a_tile_never_had_when_it_reads_the_same() -> None:
    page = {"id": PAGE, "items": [{"entityId": "light.a", "id": "T1"}]}
    page["screens"] = {"watch": {"T1": _at(0, 0)}, "iphone": {"T1": _at(0, 2, 3, 3)}}
    library = _library(page)
    assert _built(library, WATCH)["items"] == [{"entityId": "light.a", "id": "T1"}]
    assert _built(library, PHONE)["items"] == [
        {"colSpan": 3, "entityId": "light.a", "gridRow": 2, "id": "T1", "rowSpan": 3}
    ]


def test_a_change_to_one_screen_reaches_only_that_kind_of_device() -> None:
    before = _library(_split_page(), owners=(WATCH, WATCH_2, PHONE))
    after = copy.deepcopy(before)
    after["pages"][PAGE]["screens"]["iphone"]["T1"] = _at(0, 3, 3, 3)
    assert lib.changed_owners(before, after, screen_of=SCREEN.get) == {PHONE: ["pages"]}
    # Without the screens every owner is compared on both, so none is missed.
    assert set(lib.changed_owners(before, after)) == {WATCH, WATCH_2, PHONE}


# ── a device's save ──────────────────────────────────────────────────────


def _save(library: dict, owner: str, page: dict) -> dict:
    result = lib.map_back(library, owner, "pages", _pages_doc(page), screen=SCREEN[owner])
    return result.library


def test_a_watch_save_moves_the_watch_only_and_keeps_the_map_for_the_iphone() -> None:
    library = _library(_lights_page())
    sent = _built(library, WATCH)
    sent["items"][1]["gridRow"] = 4
    sent["items"][1]["gridCol"] = 0
    after = _save(library, WATCH, sent)
    item = after["pages"][PAGE]
    assert item["screens"]["watch"] == {"T1": _at(0, 0), "T2": _at(0, 4)}
    assert item["screens"]["iphone"] == {"T1": _at(0, 0), "T2": _at(6, 0), "M1": _at(0, 4, 12, 6)}
    assert _built(after, PHONE) == _lights_page(), "the iPhone draws exactly what it did"
    assert _grid(_built(after, WATCH)) == [("T1", 0, 0, 6, 4), ("T2", 0, 4, 6, 4)]
    # The tile's own fields are the watch screen's.
    assert [(t["gridCol"], t["gridRow"]) for t in item["items"]] == [(0, 0), (0, 4), (0, 4)]


def test_an_iphone_save_keeps_the_watch_screen() -> None:
    library = _library(_split_page())
    sent = _built(library, PHONE)
    sent["items"][0]["colSpan"] = 6
    sent["name"] = "Lights, renamed"
    after = _save(library, PHONE, sent)
    item = after["pages"][PAGE]
    assert item["name"] == "Lights, renamed", "page keys are the same on every device"
    assert item["screens"]["watch"] == _split_page()["screens"]["watch"]
    assert item["screens"]["iphone"]["T1"] == _at(0, 0, 6, 3)
    assert _built(after, WATCH)["name"] == "Lights, renamed"
    assert _grid(_built(after, WATCH)) == _grid(_built(library, WATCH))
    touched = lib.changed_owners(library, after, screen_of=SCREEN.get)
    assert touched == {WATCH: ["pages"], PHONE: ["pages"]}, "the name reaches the watch"


def test_an_unchanged_save_of_a_page_without_screens_changes_nothing() -> None:
    library = _library(_lights_page())
    for owner in (WATCH, PHONE):
        after = _save(library, owner, _built(library, owner))
        assert after["pages"][PAGE] == _lights_page(), owner
        assert lib.item_revision(after, "pages", PAGE) == 1


def test_an_old_watch_record_that_still_holds_the_map_never_puts_it_on_the_watch() -> None:
    library = _library(lib.fill_screens(_library(_lights_page()))["pages"][PAGE])
    sent = _lights_page()
    sent["name"] = "Lights, from an old record"
    item = _save(library, WATCH, sent)["pages"][PAGE]
    assert set(item["screens"]["watch"]) == {"T1", "T2"}
    assert item["screens"]["iphone"]["M1"] == _at(0, 4, 12, 6)
    # A map the panel put on the watch by mistake leaves the page with no
    # screen holding it rather than failing the save.
    page = _split_page()
    page["screens"]["watch"]["M1"] = page["screens"]["iphone"].pop("M1")
    library = _library(page)
    item = _save(library, WATCH, _built(library, WATCH))["pages"][PAGE]
    assert [t["id"] for t in item["items"]] == ["T1", "T2"]


def test_a_tile_taken_off_one_device_stays_on_the_other() -> None:
    library = _library(_split_page())
    sent = _built(library, WATCH)
    sent["items"] = [t for t in sent["items"] if t["id"] != "T1"]
    after = _save(library, WATCH, sent)
    item = after["pages"][PAGE]
    assert set(item["screens"]["watch"]) == {"T2"}
    assert set(item["screens"]["iphone"]) == {"T1", "T2", "M1"}
    assert [t["id"] for t in item["items"]] == ["T1", "T2", "M1"]
    # T1 is now on the iPhone only, so its own fields are the iPhone's.
    assert (item["items"][0]["gridCol"], item["items"][0]["colSpan"]) == (0, 3)


def test_a_tile_taken_off_its_only_screen_leaves_the_page() -> None:
    page = _split_page()
    page["screens"]["iphone"].pop("T1")
    library = _library(page)
    sent = _built(library, WATCH)
    sent["items"] = [t for t in sent["items"] if t["id"] != "T1"]
    item = _save(library, WATCH, sent)["pages"][PAGE]
    assert [t["id"] for t in item["items"]] == ["T2", "M1"]
    assert "T1" not in item["screens"]["watch"] and "T1" not in item["screens"]["iphone"]


def test_a_tile_new_on_one_device_lands_last_on_the_other() -> None:
    library = _library(_split_page())
    sent = _built(library, WATCH)
    sent["items"].append(_tile("N1", "switch.n", 0, 4, 12, 2))
    sent["items"].append(_tile("C1", "chart.power", 0, 6, 12, 4))
    item = _save(library, WATCH, sent)["pages"][PAGE]
    assert item["screens"]["watch"]["N1"] == _at(0, 4, 12, 2)
    assert "C1" not in item["screens"]["watch"], "never a kind the watch skips"
    # The iPhone's bottom was row 3: the new tiles go under it, in order.
    assert item["screens"]["iphone"]["N1"] == _at(0, 3, 12, 2)
    assert item["screens"]["iphone"]["C1"] == _at(0, 5, 12, 4)
    new_on_phone = _library(_split_page())
    sent = _built(new_on_phone, PHONE)
    sent["items"].append(_tile("C2", "chart.gas", 0, 3, 12, 4))
    item = _save(new_on_phone, PHONE, sent)["pages"][PAGE]
    assert "C2" not in item["screens"]["watch"], "a kind the watch skips stays off it"
    assert item["screens"]["iphone"]["C2"] == _at(0, 3, 12, 4)


def test_a_save_carrying_screens_is_taken_whole() -> None:
    library = _library(_lights_page())
    sent = _split_page()
    after = _save(library, WATCH, sent)
    assert after["pages"][PAGE]["screens"] == _split_page()["screens"]
    bad = _split_page()
    bad["screens"]["iphone"]["T1"] = {"col": 0, "row": -1, "colSpan": 3, "rowSpan": 3}
    with pytest.raises(lib.LibraryError) as err:
        _save(library, WATCH, bad)
    assert err.value.code == "invalid"


# ── the panel's save ─────────────────────────────────────────────────────


def test_a_panel_save_replaces_the_screens_whole() -> None:
    library = _library(_split_page())
    content = _split_page()
    content["screens"]["iphone"] = {"T1": _at(0, 0, 12, 3), "M1": _at(0, 3, 12, 6)}
    content["screens"]["watch"] = {"T1": _at(0, 0), "T2": _at(6, 0)}
    change = lib.replace_item(library, "pages", PAGE, content)
    assert change.library["pages"][PAGE]["screens"] == content["screens"]
    assert [t["id"] for t in _built(change.library, PHONE)["items"]] == ["T1", "M1"]
    assert lib.item_revision(change.library, "pages", PAGE) == 2


def test_a_panel_save_of_the_wrong_shape_is_refused() -> None:
    library = _library(_split_page())
    for screens in (
        "both",
        {"watch": [], "iphone": {}},
        {"watch": {"T1": {"col": 0, "row": 0, "colSpan": 0, "rowSpan": 4}}, "iphone": {}},
        {"watch": {"T1": {"col": 1.5, "row": 0, "colSpan": 6, "rowSpan": 4}}, "iphone": {}},
        {"watch": {"T1": {"col": True, "row": 0, "colSpan": 6, "rowSpan": 4}}, "iphone": {}},
    ):
        content = {**_split_page(), "screens": screens}
        with pytest.raises(lib.LibraryError) as err:
            lib.replace_item(library, "pages", PAGE, content)
        assert err.value.code == "invalid", screens


def test_a_panel_save_drops_a_tile_on_no_screen() -> None:
    library = _library(_split_page())
    content = _split_page()
    content["screens"]["iphone"].pop("M1")
    change = lib.replace_item(library, "pages", PAGE, content)
    assert [t["id"] for t in change.library["pages"][PAGE]["items"]] == ["T1", "T2"]


def test_a_new_page_from_the_panel_has_its_screens_checked() -> None:
    page = {**_split_page(), "id": OTHER}
    page["screens"]["iphone"]["gone"] = _at(0, 0)
    made = lib.create_item(lib.empty_library(), "pages", page)
    assert set(made.library["pages"][OTHER]["screens"]["iphone"]) == {"T1", "T2", "M1"}


def test_deleting_a_page_with_its_tiles_drops_them_from_the_screens() -> None:
    page = _split_page()
    page["items"].append(_tile("P1", f"page.{OTHER}"))
    page["screens"]["watch"]["P1"] = _at(0, 4)
    page["screens"]["iphone"]["P1"] = _at(9, 0, 3, 3)
    library = lib.validate_library(
        {
            "pages": {PAGE: page, OTHER: {"id": OTHER, "name": "Other", "items": []}},
            "picks": {WATCH: {"pages": [{"id": PAGE}, {"id": OTHER}]}},
        }
    )
    change = lib.delete_item(library, "pages", OTHER, clear_tiles=True)
    held = change.library["pages"][PAGE]
    assert "P1" not in held["screens"]["watch"] and "P1" not in held["screens"]["iphone"]


# ── the one-time fill ────────────────────────────────────────────────────


def test_the_fill_gives_every_page_both_screens_and_runs_once() -> None:
    raw = _library(_lights_page())
    raw["pages"][OTHER] = {**_split_page(), "id": OTHER}
    raw["version"] = 1
    library = lib.validate_library(raw)
    before = {owner: _built(library, owner) for owner in (WATCH, PHONE)}
    filled = lib.fill_screens(library)
    assert filled["version"] == 2
    assert filled["pages"][PAGE]["screens"] == {
        "watch": {"T1": _at(0, 0), "T2": _at(6, 0)},
        "iphone": {"T1": _at(0, 0), "T2": _at(6, 0), "M1": _at(0, 4, 12, 6)},
    }
    assert filled["pages"][OTHER] == library["pages"][OTHER], "a page with screens stays"
    for owner in (WATCH, PHONE):
        assert _built(filled, owner) == before[owner], f"nothing moves on {owner}"
    assert lib.item_revision(filled, "pages", PAGE) == 2
    assert lib.item_revision(filled, "pages", OTHER) == 1
    again = lib.fill_screens(filled)
    assert again == filled


def test_the_fill_leaves_a_page_with_a_tile_it_cannot_name() -> None:
    page = _lights_page()
    page["items"].append({"entityId": "light.no_id"})
    library = lib.validate_library({"pages": {PAGE: page}})
    assert "screens" not in lib.fill_screens(library)["pages"][PAGE]


# ── a first record joins by its screen's form ────────────────────────────


def test_a_first_iphone_record_joins_a_page_it_reads_the_same() -> None:
    library = _library(_split_page(), owners=(WATCH,))
    sent = _pages_doc(_built(_library(_split_page()), PHONE))
    result = lib.map_back(library, PHONE, "pages", sent, fork_conflicts=True, screen="iphone")
    assert result.renamed == {}, "no new id: it is the same page"
    assert result.library["picks"][PHONE]["pages"] == [{"id": PAGE}]
    assert result.library["pages"][PAGE] == library["pages"][PAGE]


def test_a_first_watch_record_from_before_the_screens_joins_too() -> None:
    # An old record held every tile, the map as well.
    library = _library(lib.fill_screens(_library(_lights_page()))["pages"][PAGE], owners=(PHONE,))
    result = lib.map_back(
        library, WATCH, "pages", _pages_doc(_lights_page()), fork_conflicts=True, screen="watch"
    )
    assert result.renamed == {}


def test_a_first_record_that_differs_from_its_screen_is_another_page() -> None:
    library = _library(_split_page(), owners=(WATCH,))
    sent = _built(_library(_split_page()), PHONE)
    sent["items"][0]["colSpan"] = 12
    result = lib.map_back(
        library, PHONE, "pages", _pages_doc(sent), fork_conflicts=True, screen="iphone"
    )
    assert PAGE in result.renamed["pages"], "a copy that differs gets its own id"


def test_the_migration_joins_a_watch_and_an_iphone_copy_of_one_page() -> None:
    records = {
        PHONE: {"pages": _pages_doc(_lights_page())},
        WATCH: {"pages": _pages_doc(_lights_page())},
    }
    result = lib.migrate(records, [PHONE, WATCH], {}, SCREEN)
    assert list(result.library["pages"]) == [PAGE]
    assert result.renamed == {}
    # The watch's record now leaves the map out.
    assert result.changed == {WATCH: ["pages"]}
