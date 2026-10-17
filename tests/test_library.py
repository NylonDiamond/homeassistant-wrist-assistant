"""Pure tests for ``library.py``: one library, devices pick.

The module imports ``page_links`` from its package and nothing from Home
Assistant, so both are loaded from their files into a stand-in package.
"""

from __future__ import annotations

import copy
import importlib.util
import json
import sys
import types
from pathlib import Path

import pytest

_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_PKG = "wa_library_test_pkg"
_pkg = types.ModuleType(_PKG)
_pkg.__path__ = []
sys.modules[_PKG] = _pkg


def _load(name: str):
    spec = importlib.util.spec_from_file_location(f"{_PKG}.{name}", _DIR / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


page_links = _load("page_links")
lib = _load("library")

WATCH = "watch-A"
WATCH_2 = "watch-B"
WATCH_3 = "watch-C"
PHONE = "phone-1"
NAMES = {WATCH: "Jesse's Apple Watch", WATCH_2: "Chen's Apple Watch", WATCH_3: "Spare Watch", PHONE: "Jesse's iPhone"}
ORDER = [WATCH, WATCH_2, WATCH_3, PHONE]

SYSTEM = "AAAAAAAA-0000-4000-8000-0000000000FF"
HOME = "AAAAAAAA-0000-4000-8000-000000000001"
LIGHTS = "AAAAAAAA-0000-4000-8000-000000000002"
SOLO = "AAAAAAAA-0000-4000-8000-000000000003"
DOORS = "BBBBBBBB-0000-4000-8000-000000000001"
STARTERS = [f"00000000-0000-0000-0000-00000000000{n}" for n in range(1, 6)]
STARTER = STARTERS[0]
LINK = "3f0c5b2a9d1e4c7f8a6b0d2e4f6a8c0e"
MENU_LINK = "9d1e3f0c5b2a4c7f8a6b0d2e4f6a8c0e"


def _tile(n: int, entity_id: str) -> dict:
    return {"id": f"T{n}", "entityId": entity_id}


def _pages(lights_name: str = "Lights", *, hidden: bool | None = True, link: str | None = None) -> dict:
    lights = {"id": LIGHTS, "name": lights_name, "items": [_tile(1, "light.a")]}
    if hidden is not None:
        lights["isHidden"] = hidden
    if link is not None:
        lights["linkId"] = link
    return {
        "schemaVersion": 1,
        "pages": [
            {"id": SYSTEM, "name": "Settings", "isSystemPage": True, "items": []},
            {
                "id": HOME,
                "name": "Home",
                "items": [_tile(1, f"page.{LIGHTS}"), _tile(2, f"status_page.{DOORS}"), _tile(3, f"status_page.{STARTER}")],
            },
            lights,
        ],
    }


def _status(doors_rows: int = 0, *, starter_name: str = "Batteries", doors_link: str | None = None) -> dict:
    starters = [
        {"id": sid, "name": starter_name if sid == STARTER else f"Starter {i}", "isSystemDefault": True, "rows": [], "rowStyle": "plain"}
        for i, sid in enumerate(STARTERS, start=1)
    ]
    doors = {"id": DOORS, "name": "Doors", "rows": [{"id": f"R{n}"} for n in range(doors_rows)]}
    if doors_link is not None:
        doors["linkId"] = doors_link
    return {"schemaVersion": 1, "statusPages": [*starters, doors]}


def _slot(n: int, action: dict) -> dict:
    return {"id": f"S{n}", "action": action, "isVisible": True, "position": "topLeft"}


def _menus(beam: str = "auroraWash", light: bool = True, links: dict | None = None) -> dict:
    doc = {
        "entityRadial": {
            "allSlots": [_slot(1, {"type": "assist"})],
            "lightInheritsAll": light,
            "lightSlots": [_slot(2, {"type": "navigateToPage", "pageId": LIGHTS})],
            "schemaVersion": 1,
        },
        "pageSwitcher": {"displayMode": "icon", "schemaVersion": 1},
        "quickAction": {
            "beamStyle": beam,
            "schemaVersion": 1,
            "slots": [
                _slot(1, {"type": "navigateToPage", "pageId": HOME}),
                _slot(2, {"type": "showStatusPage", "pageId": DOORS}),
                _slot(5, {"type": "speakPhrase", "phraseId": "P1"}),
            ],
        },
        "schemaVersion": 1,
    }
    if links:
        doc = page_links._with_key(doc, "linkIds", links)
    return doc


def _record(pages=None, status=None, menus=None, **more) -> dict:
    out = {}
    if pages is not None:
        out["pages"] = pages
    if status is not None:
        out["status_pages"] = status
    if menus is not None:
        out["menus"] = menus
    out.update(more)
    return out


def _strip(document: dict) -> dict:
    """A document less its link keys, as the apps send it."""
    out = {k: copy.deepcopy(v) for k, v in document.items() if k != "linkIds"}
    for key in ("pages", "statusPages"):
        if isinstance(out.get(key), list):
            out[key] = [{k: v for k, v in p.items() if k != "linkId"} for p in out[key]]
    return out


def _ids(document: dict, key: str = "pages") -> list[str]:
    return [p["id"] for p in document[key]]


def _page(document: dict, page_id: str, key: str = "pages") -> dict:
    return next(p for p in document[key] if p["id"].upper() == page_id.upper())


def _migrate(records: dict) -> lib.MigrationResult:
    before = copy.deepcopy(records)
    result = lib.migrate(records, ORDER, NAMES)
    assert records == before, "migrate changed its input"
    return result


# ── migration: pages and status pages ────────────────────────────────────


def test_identical_copies_are_one_item_picked_by_both() -> None:
    records = {WATCH: _record(_pages(), _status()), WATCH_2: _record(_pages(hidden=False), _status())}
    result = _migrate(records)
    library = result.library
    assert sorted(library["pages"]) == sorted([HOME, LIGHTS])
    assert "isHidden" not in library["pages"][LIGHTS]
    assert sorted(library["status_pages"]) == sorted([*STARTERS, DOORS])
    assert library["picks"][WATCH]["pages"][2] == {"id": LIGHTS, "isHidden": True}
    assert library["picks"][WATCH_2]["pages"][2] == {"id": LIGHTS, "isHidden": False}
    assert library["picks"][WATCH]["pages"][0]["page"]["isSystemPage"] is True
    assert result.renamed == {}
    # Both now carry a link on every shared page, so both records change.
    assert result.changed == {WATCH: ["status_pages", "pages"], WATCH_2: ["status_pages", "pages"]}
    built = lib.materialise(library, WATCH, "pages", records[WATCH]["pages"])
    assert _page(built, LIGHTS)["linkId"] == LIGHTS
    assert "linkId" not in _page(built, SYSTEM)


def test_one_device_alone_is_unchanged() -> None:
    records = {WATCH: _record(_pages(), _status(), _menus())}
    result = _migrate(records)
    assert result.changed == {}
    for kind in ("pages", "status_pages", "menus"):
        assert lib.materialise(result.library, WATCH, kind, records[WATCH][kind]) == records[WATCH][kind]


def test_linked_copies_are_one_item_even_when_they_differ() -> None:
    records = {
        WATCH: _record(_pages(link=LINK), _status()),
        WATCH_2: _record(_pages("Lights (stale)", link=LINK), _status()),
    }
    result = _migrate(records)
    assert result.library["pages"][LIGHTS]["name"] == "Lights"
    assert "linkId" not in result.library["pages"][LIGHTS]
    assert result.renamed == {}
    built = lib.materialise(result.library, WATCH_2, "pages", records[WATCH_2]["pages"])
    assert _page(built, LIGHTS)["name"] == "Lights"
    assert _page(built, LIGHTS)["linkId"] == LIGHTS


def test_only_the_same_token_joins_a_differing_copy() -> None:
    other = _pages("Other lights", link=LINK)
    records = {WATCH: _record(_pages(link=LINK)), WATCH_2: _record(other)}
    result = _migrate(records)
    # Same id, other content, same token: still linked, so one item.
    assert len(result.library["pages"]) == 2
    records[WATCH_2]["pages"]["pages"][2]["linkId"] = "another"
    result = _migrate(records)
    assert len(result.library["pages"]) == 4
    assert set(result.renamed[WATCH_2]["pages"]) == {LIGHTS, HOME}


def test_a_taken_id_with_other_content_gets_a_new_id_and_its_references_follow() -> None:
    complication = {"name": "Lights", "openPageId": LIGHTS.lower(), "tapAction": {"type": "openPage"},
                    "elements": [{"kind": "tap", "payload": {"openPageId": HOME}}, {"kind": "text"}]}
    rooms = {"schemaVersion": 1, "roomQuickJumpFallbackPageId": LIGHTS,
             "roomQuickJumpMappings": {"kitchen": LIGHTS, "hall": "STAY_ON_CURRENT_PAGE"}}
    records = {
        WATCH: _record(_pages(), _status(), _menus()),
        WATCH_2: _record(_pages("Lamps"), _status(), _menus(), rooms=rooms),
    }
    result = _migrate(records)
    library = result.library
    new_lights = result.renamed[WATCH_2]["pages"][LIGHTS]
    # HOME on watch B was equal, but its tile now opens the new page, so it
    # is another page too.
    new_home = result.renamed[WATCH_2]["pages"][HOME]
    assert result.renamed[WATCH_2]["status_pages"] == {}
    assert library["pages"][LIGHTS]["name"] == "Lights"
    assert library["pages"][new_lights]["name"] == "Lamps"
    assert new_lights == new_lights.upper() and len(new_lights) == 36
    assert library["pages"][new_home]["items"][0]["entityId"] == f"page.{new_lights}"
    assert library["pages"][HOME]["items"][0]["entityId"] == f"page.{LIGHTS}"
    assert [p["id"] for p in library["picks"][WATCH_2]["pages"]] == [SYSTEM, new_home, new_lights]
    # Its menus open the new pages, so they are a menu of their own.
    menus_b = lib.materialise(library, WATCH_2, "menus", records[WATCH_2]["menus"])
    assert menus_b["quickAction"]["slots"][0]["action"]["pageId"] == new_home
    assert menus_b["entityRadial"]["lightSlots"][0]["action"]["pageId"] == new_lights
    assert "linkIds" not in menus_b
    assert len(library["menus"]) == 4
    # The rooms record is rewritten; the stay sentinel is left alone.
    assert result.rewritten[WATCH_2]["rooms"]["roomQuickJumpFallbackPageId"] == new_lights
    assert result.rewritten[WATCH_2]["rooms"]["roomQuickJumpMappings"] == {"kitchen": new_lights, "hall": "STAY_ON_CURRENT_PAGE"}
    assert result.changed[WATCH_2] == ["status_pages", "pages", "menus", "rooms"]
    # Status pages are still shared, so both get a link there; A's pages
    # and menus are its own.
    assert result.changed[WATCH] == ["status_pages"]
    # The complication report: the caller rewrites with the pages map.
    moved = lib.rename_complication(complication, result.renamed[WATCH_2]["pages"])
    assert moved["openPageId"] == new_lights
    assert moved["elements"][0]["payload"]["openPageId"] == new_home
    assert moved["elements"][1] == {"kind": "text"}
    assert lib.rename_complication(complication, {SOLO: "X"}) is None


def test_a_taken_status_page_id_rewrites_tiles_and_slots() -> None:
    records = {
        WATCH: _record(_pages(), _status(), _menus()),
        WATCH_2: _record(_pages(), _status(doors_rows=2), _menus()),
    }
    result = _migrate(records)
    new_doors = result.renamed[WATCH_2]["status_pages"][DOORS]
    assert set(result.renamed[WATCH_2]["pages"]) == {HOME}
    new_home = result.renamed[WATCH_2]["pages"][HOME]
    library = result.library
    assert len(library["status_pages"][new_doors]["rows"]) == 2
    assert library["pages"][new_home]["items"][1]["entityId"] == f"status_page.{new_doors}"
    # LIGHTS is still one page on both.
    assert lib.pickers(library, "pages")[LIGHTS] == [WATCH, WATCH_2]
    menus_b = lib.materialise(library, WATCH_2, "menus")
    assert menus_b["quickAction"]["slots"][1]["action"]["pageId"] == new_doors
    # The entity menus are still the same, so still one menu.
    assert menus_b["linkIds"] == {"entity": library["picks"][WATCH]["menus"]["entity"]}


def test_starters_on_three_devices() -> None:
    records = {
        WATCH: _record(status=_status()),
        WATCH_2: _record(status=_status()),
        WATCH_3: _record(status=_status(starter_name="Power")),
        PHONE: _record(status=_status(starter_name="Power")),
    }
    result = _migrate(records)
    library = result.library
    # The common case: the five starters, picked by every device that had
    # them the same.
    for sid in STARTERS[1:]:
        assert lib.pickers(library, "status_pages")[sid] == sorted(ORDER)
    assert lib.pickers(library, "status_pages")[STARTER] == [WATCH, WATCH_2]
    fork = result.renamed[WATCH_3]["status_pages"][STARTER]
    # The phone's copy is the same as watch C's: one new item, not two.
    assert result.renamed[PHONE]["status_pages"] == {STARTER: fork}
    assert lib.pickers(library, "status_pages")[fork] == sorted([PHONE, WATCH_3])
    assert library["status_pages"][fork]["isSystemDefault"] is True
    assert len(library["status_pages"]) == 7


def test_picks_keep_each_device_s_order_and_hidden_state() -> None:
    mine = _pages()
    theirs = _pages(hidden=None)
    theirs["pages"].reverse()
    records = {WATCH: _record(mine), WATCH_2: _record(theirs)}
    result = _migrate(records)
    assert [p["id"] for p in result.library["picks"][WATCH_2]["pages"]] == [LIGHTS, HOME, SYSTEM]
    assert result.library["picks"][WATCH_2]["pages"][0] == {"id": LIGHTS}
    built = lib.materialise(result.library, WATCH_2, "pages", theirs)
    assert _ids(built) == [LIGHTS, HOME, SYSTEM]
    assert "isHidden" not in built["pages"][0]


def test_ids_differing_only_in_case_are_one_item() -> None:
    lower = _pages()
    lower["pages"][2]["id"] = LIGHTS.lower()
    result = _migrate({WATCH: _record(_pages()), WATCH_2: _record(lower)})
    assert sorted(result.library["pages"]) == sorted([HOME, LIGHTS])
    assert result.renamed == {}


# ── migration: menus ─────────────────────────────────────────────────────


def test_identical_menus_are_one_menu_of_each_kind() -> None:
    records = {WATCH: _record(menus=_menus()), WATCH_2: _record(menus=_menus())}
    result = _migrate(records)
    menus = result.library["menus"]
    assert sorted(m["name"] for m in menus.values()) == ["Anywhere menu", "Entity quick menu"]
    anywhere = result.library["picks"][WATCH]["menus"]["anywhere"]
    assert menus[anywhere]["kind"] == "anywhere"
    assert set(menus[anywhere]["sections"]) == {"quickAction", "pageSwitcher"}
    assert result.library["picks"][WATCH_2]["menus"] == result.library["picks"][WATCH]["menus"]
    built = lib.materialise(result.library, WATCH, "menus", records[WATCH]["menus"])
    assert list(built) == sorted(built)
    assert built["linkIds"] == dict(sorted(result.library["picks"][WATCH]["menus"].items()))


def test_differing_menus_are_named_after_their_first_device() -> None:
    records = {
        WATCH: _record(menus=_menus()),
        WATCH_2: _record(menus=_menus(beam="plain")),
        WATCH_3: _record(menus=_menus(beam="plain", light=False)),
    }
    result = _migrate(records)
    names = {m["name"] for m in result.library["menus"].values() if m["kind"] == "anywhere"}
    assert names == {"Jesse's Apple Watch's menu", "Chen's Apple Watch's menu"}
    entity = {m["name"] for m in result.library["menus"].values() if m["kind"] == "entity"}
    assert entity == {"Jesse's Apple Watch's menu", "Spare Watch's menu"}
    picks = result.library["picks"]
    assert picks[WATCH_2]["menus"]["anywhere"] == picks[WATCH_3]["menus"]["anywhere"]
    assert picks[WATCH]["menus"]["entity"] == picks[WATCH_2]["menus"]["entity"]


def test_linked_menus_are_one_menu_and_drop_the_old_token() -> None:
    records = {
        WATCH: _record(menus=_menus(links={"anywhere": MENU_LINK})),
        WATCH_2: _record(menus=_menus(beam="stale", links={"anywhere": MENU_LINK})),
    }
    result = _migrate(records)
    anywhere = result.library["picks"][WATCH]["menus"]["anywhere"]
    assert result.library["picks"][WATCH_2]["menus"]["anywhere"] == anywhere
    assert result.library["menus"][anywhere]["sections"]["quickAction"]["beamStyle"] == "auroraWash"
    assert result.library["menus"][anywhere]["name"] == "Anywhere menu"
    built = lib.materialise(result.library, WATCH_2, "menus", records[WATCH_2]["menus"])
    assert built["quickAction"]["beamStyle"] == "auroraWash"
    assert built["linkIds"]["anywhere"] == anywhere
    assert MENU_LINK not in json.dumps(result.library)


def test_a_linked_menu_whose_slots_follow_a_fork_is_not_joined_by_its_token() -> None:
    """Both watches carry one old token on the Entity quick menu, whose
    light slot opens Lights. The second watch's Lights differs and was never
    linked (a fan-out that failed on a cap), so it forks and that watch's
    slot is rewritten to the fork. Joining by the token would throw that
    rewrite away and leave its slot on the first watch's Lights, which it
    does not pick."""
    records = {
        WATCH: _record(_pages(), menus=_menus(links={"entity": MENU_LINK})),
        WATCH_2: _record(_pages("Other lights"), menus=_menus(links={"entity": MENU_LINK})),
    }
    result = _migrate(records)
    fork = result.renamed[WATCH_2]["pages"][LIGHTS]
    picks = result.library["picks"]
    assert picks[WATCH]["menus"]["entity"] != picks[WATCH_2]["menus"]["entity"]
    mine = result.library["menus"][picks[WATCH_2]["menus"]["entity"]]
    assert mine["sections"]["entityRadial"]["lightSlots"][0]["action"]["pageId"] == fork
    theirs = result.library["menus"][picks[WATCH]["menus"]["entity"]]
    assert theirs["sections"]["entityRadial"]["lightSlots"][0]["action"]["pageId"] == LIGHTS
    # The Anywhere menu, whose slots open Home, is rewritten too (Home's
    # tile opens Lights, so Home forked); it is not joined either.
    assert picks[WATCH]["menus"]["anywhere"] != picks[WATCH_2]["menus"]["anywhere"]


# ── materialise ──────────────────────────────────────────────────────────


def test_migrate_then_materialise_gives_back_every_record_less_its_link_keys() -> None:
    records = {
        WATCH: _record(_pages(link=LINK), _status(doors_link=LINK), _menus(links={"anywhere": MENU_LINK})),
        WATCH_2: _record(_pages(hidden=False, link=LINK), _status(doors_link=LINK), _menus(links={"anywhere": MENU_LINK})),
        WATCH_3: _record(_pages(hidden=None), _status(), _menus(light=False)),
        PHONE: _record(_pages(), _status()),
    }
    records[WATCH_3]["menus"]["futureKey"] = {"kept": True}
    result = _migrate(records)
    assert result.renamed == {}
    for owner, held in records.items():
        for kind, record in held.items():
            built = lib.materialise(result.library, owner, kind, record)
            assert _strip(built) == _strip(record), (owner, kind)
    built = lib.materialise(result.library, WATCH_3, "menus", records[WATCH_3]["menus"])
    assert list(built)[-1] == "futureKey"
    assert list(built)[1] == "linkIds"
    # Pages LIGHTS and HOME are on four devices, DOORS too.
    assert lib.link_groups(result.library, "pages") == {HOME: sorted(ORDER), LIGHTS: sorted(ORDER)}


def test_materialise_is_none_for_an_owner_with_no_picks_of_the_kind() -> None:
    result = _migrate({WATCH: _record(_pages())})
    assert lib.materialise(result.library, WATCH, "menus") is None
    assert lib.materialise(result.library, PHONE, "pages") is None
    built = lib.materialise(result.library, WATCH, "pages")
    assert built == _pages()


def test_materialise_without_a_template_writes_sorted_menus() -> None:
    result = _migrate({WATCH: _record(menus=_menus())})
    assert lib.materialise(result.library, WATCH, "menus") == _menus()


# ── map_back ─────────────────────────────────────────────────────────────


def _shared() -> dict:
    """Watches A and B with the same pages, status pages and menus, and the
    phone with its own pages."""
    phone_pages = {"schemaVersion": 1, "pages": [{"id": SOLO, "name": "Solo", "items": []}]}
    records = {
        WATCH: _record(_pages(), _status(), _menus()),
        WATCH_2: _record(_pages(), _status(), _menus()),
        PHONE: _record(phone_pages),
    }
    return _migrate(records).library


def test_a_page_edit_reaches_every_device_that_picks_it() -> None:
    library = _shared()
    before = copy.deepcopy(library)
    saved = _strip(lib.materialise(library, WATCH, "pages"))
    saved["pages"][2]["name"] = "Lamps"
    result = lib.map_back(library, WATCH, "pages", saved)
    assert library == before, "map_back changed its input"
    assert result.library["pages"][LIGHTS]["name"] == "Lamps"
    # Watch A sent no link keys, so its record differs from what it sent.
    assert result.touched == {WATCH: ["pages"], WATCH_2: ["pages"]}
    assert _page(lib.materialise(result.library, WATCH_2, "pages"), LIGHTS)["name"] == "Lamps"
    assert result.renamed == {}


def test_a_save_equal_to_the_record_touches_no_one() -> None:
    library = _shared()
    saved = lib.materialise(library, WATCH, "pages")
    assert lib.map_back(library, WATCH, "pages", saved).touched == {}
    # The same save without the link keys only touches the saver.
    result = lib.map_back(library, WATCH, "pages", _strip(saved))
    assert result.touched == {WATCH: ["pages"]}
    assert result.library == library


def test_hiding_a_page_is_the_device_s_own() -> None:
    library = _shared()
    saved = lib.materialise(library, WATCH_2, "pages")
    saved["pages"][2]["isHidden"] = False
    result = lib.map_back(library, WATCH_2, "pages", saved)
    # Only the saver's record changes, and it is exactly what it saved.
    assert result.touched == {}
    assert lib.materialise(result.library, WATCH_2, "pages", saved) == saved
    assert result.library["picks"][WATCH]["pages"][2] == {"id": LIGHTS, "isHidden": True}
    assert result.library["picks"][WATCH_2]["pages"][2] == {"id": LIGHTS, "isHidden": False}


def test_a_save_that_drops_a_page_drops_the_pick_only() -> None:
    library = _shared()
    saved = lib.materialise(library, WATCH, "pages")
    saved["pages"] = [p for p in saved["pages"] if p["id"] != LIGHTS]
    result = lib.map_back(library, WATCH, "pages", saved)
    assert LIGHTS in result.library["pages"]
    assert [p["id"] for p in result.library["picks"][WATCH]["pages"]] == [SYSTEM, HOME]
    # Watch B is now alone with it, so its link comes off there.
    assert result.touched == {WATCH_2: ["pages"]}
    assert "linkId" not in _page(lib.materialise(result.library, WATCH_2, "pages"), LIGHTS)
    assert lib.pickers(result.library, "pages")[LIGHTS] == [WATCH_2]


def test_a_save_that_adds_a_new_id_makes_an_item() -> None:
    library = _shared()
    saved = lib.materialise(library, WATCH, "pages")
    saved["pages"].insert(1, {"id": "CCCCCCCC-0000-4000-8000-000000000001", "name": "New", "items": []})
    result = lib.map_back(library, WATCH, "pages", saved)
    assert result.library["pages"]["CCCCCCCC-0000-4000-8000-000000000001"]["name"] == "New"
    assert result.library["picks"][WATCH]["pages"][1] == {"id": "CCCCCCCC-0000-4000-8000-000000000001"}
    assert result.touched == {}


def test_a_save_that_adds_another_device_s_page_shares_it() -> None:
    library = _shared()
    saved = lib.materialise(library, WATCH, "pages")
    saved["pages"].append({"id": SOLO, "name": "Solo", "items": []})
    result = lib.map_back(library, WATCH, "pages", saved)
    assert lib.pickers(result.library, "pages")[SOLO] == [PHONE, WATCH]
    assert result.touched == {PHONE: ["pages"], WATCH: ["pages"]}


def test_a_status_pages_save_maps_back_the_same_way() -> None:
    library = _shared()
    saved = lib.materialise(library, WATCH, "status_pages")
    _page(saved, DOORS, "statusPages")["rows"] = [{"id": "R1"}]
    saved["statusPages"] = [p for p in saved["statusPages"] if p["id"] != STARTERS[4]]
    result = lib.map_back(library, WATCH, "status_pages", saved)
    assert result.library["status_pages"][DOORS]["rows"] == [{"id": "R1"}]
    assert STARTERS[4] in result.library["status_pages"]
    assert result.touched == {WATCH_2: ["status_pages"]}


def test_a_menus_save_updates_the_picked_menus_for_everyone() -> None:
    library = _shared()
    saved = lib.materialise(library, WATCH, "menus")
    saved["quickAction"]["beamStyle"] = "plain"
    result = lib.map_back(library, WATCH, "menus", saved)
    anywhere = library["picks"][WATCH]["menus"]["anywhere"]
    assert result.library["menus"][anywhere]["sections"]["quickAction"]["beamStyle"] == "plain"
    assert result.touched == {WATCH_2: ["menus"]}
    assert len(result.library["menus"]) == 2


def test_a_menus_save_with_no_pick_makes_menus_and_picks_them() -> None:
    library = _shared()
    result = lib.map_back(library, PHONE, "menus", _menus(beam="phone"), owner_name="Jesse's iPhone")
    picks = result.library["picks"][PHONE]["menus"]
    assert set(picks) == {"anywhere", "entity"}
    assert picks["anywhere"] not in library["menus"]
    assert result.library["menus"][picks["anywhere"]]["name"] == "Jesse's iPhone's menu"
    assert result.library["menus"][picks["anywhere"]]["sections"]["quickAction"]["beamStyle"] == "phone"
    assert result.touched == {}
    assert lib.materialise(result.library, PHONE, "menus", _menus(beam="phone")) == _menus(beam="phone")


def test_a_menus_save_ignores_link_ids_it_carries() -> None:
    library = _shared()
    saved = lib.materialise(library, WATCH, "menus")
    saved["linkIds"] = {"anywhere": "something-else"}
    result = lib.map_back(library, WATCH, "menus", saved)
    assert result.library == library
    assert result.touched == {WATCH: ["menus"]}


def test_a_first_record_with_another_starter_forks_with_fork_conflicts() -> None:
    library = _shared()
    upload = _status(starter_name="Power")
    plain = lib.map_back(library, PHONE, "status_pages", upload)
    # Without it, the upload is an edit of the shared starter.
    assert plain.library["status_pages"][STARTER]["name"] == "Power"
    assert plain.touched == {WATCH: ["status_pages"], WATCH_2: ["status_pages"], PHONE: ["status_pages"]}
    forked = lib.map_back(library, PHONE, "status_pages", upload, fork_conflicts=True)
    new = forked.renamed["status_pages"][STARTER]
    assert forked.library["status_pages"][STARTER]["name"] == "Batteries"
    assert forked.library["status_pages"][new]["name"] == "Power"
    assert forked.library["picks"][PHONE]["status_pages"][0]["id"] == new
    assert WATCH not in forked.touched and WATCH_2 not in forked.touched
    assert forked.touched[PHONE] == ["status_pages"]


def test_fork_conflicts_rewrites_the_owner_s_shared_pages_as_its_own_copies() -> None:
    library = _shared()
    # Watch C picks the shared pages first, then uploads other starters.
    library = lib.map_back(library, WATCH_3, "pages", lib.materialise(library, WATCH, "pages")).library
    result = lib.map_back(library, WATCH_3, "status_pages", _status(starter_name="Power"), fork_conflicts=True)
    new_starter = result.renamed["status_pages"][STARTER]
    new_home = result.renamed["pages"][HOME]
    lib_after = result.library
    assert lib_after["pages"][HOME]["items"][2]["entityId"] == f"status_page.{STARTER}"
    assert lib_after["pages"][new_home]["items"][2]["entityId"] == f"status_page.{new_starter}"
    assert lib.pickers(lib_after, "pages")[HOME] == [WATCH, WATCH_2]
    assert lib.pickers(lib_after, "pages")[LIGHTS] == [WATCH, WATCH_2, WATCH_3]
    assert result.touched == {WATCH_3: ["status_pages", "pages"]}


def test_map_back_refuses_what_is_not_a_library_kind() -> None:
    with pytest.raises(lib.LibraryError) as err:
        lib.map_back(lib.empty_library(), WATCH, "voice", {})
    assert err.value.code == "invalid"


# ── pick helpers ─────────────────────────────────────────────────────────


def test_pick_page_appends_with_reach_and_takes_off() -> None:
    library = _shared()
    pages, status = lib.reach(library, [HOME])
    assert pages == [HOME, LIGHTS]
    assert sorted(status) == sorted([DOORS, STARTER])
    library = lib.forget(library, WATCH_2).library
    library["picks"][PHONE]["status_pages"] = []
    result = lib.pick_page(library, PHONE, "pages", HOME.lower(), True, status)
    assert [p["id"] for p in result.library["picks"][PHONE]["pages"]] == [SOLO, HOME]
    assert sorted(p["id"] for p in result.library["picks"][PHONE]["status_pages"]) == sorted([DOORS, STARTER])
    assert result.touched == {PHONE: ["status_pages", "pages"], WATCH: ["status_pages", "pages"]}
    again = lib.pick_page(result.library, PHONE, "pages", HOME, True)
    assert again.touched == {} and again.library == result.library
    off = lib.pick_page(result.library, PHONE, "pages", HOME, False)
    assert [p["id"] for p in off.library["picks"][PHONE]["pages"]] == [SOLO]
    assert HOME in off.library["pages"]
    assert off.touched == {PHONE: ["pages"], WATCH: ["pages"]}
    with pytest.raises(lib.LibraryError) as err:
        lib.pick_page(library, PHONE, "pages", SYSTEM, True)
    assert err.value.code == "not_found"


def test_untick_on_an_unknown_owner_adds_no_owner() -> None:
    library = _shared()
    result = lib.pick_page(library, "watch-Z", "pages", HOME, False)
    assert "watch-Z" not in result.library["picks"]


def test_pick_copy_and_rename_menus() -> None:
    library = _shared()
    anywhere = library["picks"][WATCH]["menus"]["anywhere"]
    entity = library["picks"][WATCH]["menus"]["entity"]
    copied = lib.copy_menu(library, WATCH_2, "anywhere", "Chen's menu")
    assert copied.library["menus"][copied.id]["name"] == "Chen's menu"
    assert copied.library["picks"][WATCH_2]["menus"]["anywhere"] == copied.id
    assert copied.touched == {WATCH: ["menus"], WATCH_2: ["menus"]}
    assert "anywhere" not in lib.materialise(copied.library, WATCH, "menus")["linkIds"]
    back = lib.pick_menu(copied.library, WATCH_2, "anywhere", anywhere)
    assert back.library["picks"][WATCH_2]["menus"]["anywhere"] == anywhere
    renamed = lib.rename_menu(back.library, copied.id, "  Spare  ")
    assert renamed["menus"][copied.id]["name"] == "Spare"
    with pytest.raises(lib.LibraryError) as err:
        lib.pick_menu(library, WATCH, "anywhere", entity)
    assert err.value.code == "invalid"
    with pytest.raises(lib.LibraryError) as err:
        lib.pick_menu(library, WATCH, "anywhere", "nope")
    assert err.value.code == "not_found"
    with pytest.raises(lib.LibraryError) as err:
        lib.copy_menu(library, PHONE, "anywhere", "Phone")
    assert err.value.code == "not_found"
    with pytest.raises(lib.LibraryError) as err:
        lib.rename_menu(library, anywhere, " ")
    assert err.value.code == "invalid"


def test_delete_a_page_clears_picks_and_slots_and_keeps_tiles() -> None:
    library = _shared()
    result = lib.delete_item(library, "pages", LIGHTS)
    assert LIGHTS not in result.library["pages"]
    for owner in (WATCH, WATCH_2):
        assert LIGHTS not in [p["id"] for p in result.library["picks"][owner]["pages"]]
    entity = result.library["menus"][library["picks"][WATCH]["menus"]["entity"]]
    assert entity["sections"]["entityRadial"]["lightSlots"] == []
    assert result.library["pages"][HOME]["items"][0]["entityId"] == f"page.{LIGHTS}"
    assert result.touched == {WATCH: ["pages", "menus"], WATCH_2: ["pages", "menus"]}
    cleared = lib.delete_item(library, "pages", LIGHTS, clear_tiles=True)
    assert [t["id"] for t in cleared.library["pages"][HOME]["items"]] == ["T2", "T3"]


def test_delete_a_status_page_clears_its_status_slots() -> None:
    library = _shared()
    result = lib.delete_item(library, "status_pages", DOORS)
    anywhere = result.library["menus"][library["picks"][WATCH]["menus"]["anywhere"]]
    assert [s["id"] for s in anywhere["sections"]["quickAction"]["slots"]] == ["S1", "S5"]
    assert result.library["pages"][HOME]["items"][1]["entityId"] == f"status_page.{DOORS}"


def test_a_menu_in_use_is_not_deleted() -> None:
    library = _shared()
    anywhere = library["picks"][WATCH]["menus"]["anywhere"]
    with pytest.raises(lib.LibraryError) as err:
        lib.delete_item(library, "menus", anywhere)
    assert err.value.code == "in_use"
    copied = lib.copy_menu(library, WATCH, "anywhere", "Mine")
    copied = lib.copy_menu(copied.library, WATCH_2, "anywhere", "Theirs")
    result = lib.delete_item(copied.library, "menus", anywhere)
    assert anywhere not in result.library["menus"]
    assert result.touched == {}
    with pytest.raises(lib.LibraryError) as err:
        lib.delete_item(library, "pages", "nope")
    assert err.value.code == "not_found"


def test_link_groups_are_the_places_shape() -> None:
    library = _shared()
    pages = lib.link_groups(library, "pages")
    assert pages == {HOME: [WATCH, WATCH_2], LIGHTS: [WATCH, WATCH_2]}
    status = lib.link_groups(library, "status_pages")
    assert set(status) == {*STARTERS, DOORS}
    menus = lib.link_groups(library, "menus")
    assert {v["unit"] for v in menus.values()} == {"anywhere", "entity"}
    assert all(v["owners"] == [WATCH, WATCH_2] for v in menus.values())
    assert lib.pickers(library, "pages")[SOLO] == [PHONE]


def test_copy_picks_adds_what_the_target_lacks() -> None:
    library = _shared()
    result = lib.copy_picks(library, WATCH, PHONE, ["pages", "status_pages", "menus"])
    phone = result.library["picks"][PHONE]
    assert [p["id"] for p in phone["pages"]] == [SOLO, HOME, LIGHTS]
    assert phone["pages"][2] == {"id": LIGHTS, "isHidden": True}
    assert len(phone["status_pages"]) == 6
    assert phone["menus"] == library["picks"][WATCH]["menus"]
    assert result.touched[PHONE] == ["status_pages", "pages", "menus"]
    # The menus stay shared; a caller that wants them its own copies them.
    own = lib.copy_menu(result.library, PHONE, "anywhere", "Phone menu")
    assert own.library["menus"][own.id]["sections"] == result.library["menus"][phone["menus"]["anywhere"]]["sections"]


def test_move_and_forget() -> None:
    library = _shared()
    moved = lib.move_picks(library, WATCH_2, WATCH_3, ["pages", "menus"])
    assert WATCH_2 not in moved.library["picks"]
    assert moved.library["picks"][WATCH_3]["pages"] == library["picks"][WATCH_2]["pages"]
    assert "status_pages" not in moved.library["picks"][WATCH_3]
    # Watch A's status pages lose their links: B's went with the forget.
    assert moved.touched[WATCH] == ["status_pages"]
    gone = lib.forget(library, WATCH_2)
    assert gone.touched == {WATCH: ["status_pages", "pages", "menus"], WATCH_2: ["status_pages", "pages", "menus"]}
    assert HOME in gone.library["pages"]
    assert lib.materialise(gone.library, WATCH, "pages") == lib.materialise(_migrate({WATCH: _record(_pages())}).library, WATCH, "pages")


# ── the stored shape ─────────────────────────────────────────────────────


def test_validate_library_round_trips_and_drops_junk() -> None:
    library = _shared()
    assert lib.validate_library(json.loads(json.dumps(library))) == library
    assert lib.validate_library(None) == lib.empty_library()
    raw = copy.deepcopy(library)
    raw["pages"]["x"] = {"name": "no id"}
    raw["pages"]["dup"] = {"id": HOME.lower(), "name": "dup"}
    raw["pages"]["sys"] = {"id": "S", "isSystemPage": True}
    raw["menus"]["bad"] = {"name": "Bad", "kind": "nowhere", "sections": {}}
    raw["menus"]["half"] = {"kind": "entity", "sections": {"entityRadial": {}, "quickAction": {}}}
    raw["picks"][WATCH]["pages"].append({"id": "missing"})
    raw["picks"][WATCH]["pages"].append({"id": HOME.lower(), "isHidden": True})
    raw["picks"][WATCH]["menus"]["anywhere"] = "half"
    raw["picks"][""] = {}
    raw["hashes"] = {WATCH: {"pages": "abc", "menus": 3}}
    clean = lib.validate_library(raw)
    assert set(clean["pages"]) == {HOME, LIGHTS, SOLO}
    assert set(clean["menus"]) == set(library["menus"]) | {"half"}
    assert clean["menus"]["half"] == {"name": "Entity quick menu", "kind": "entity", "sections": {"entityRadial": {}}}
    assert clean["picks"][WATCH]["pages"] == library["picks"][WATCH]["pages"]
    assert "anywhere" not in clean["picks"][WATCH]["menus"]
    assert "" not in clean["picks"]
    assert clean["hashes"] == {WATCH: {"pages": "abc"}}
    raw["revisions"] = {WATCH: {"pages": 4, "menus": "4", "status_pages": True}, PHONE: []}
    raw["renames"] = {WATCH: {"pages": {HOME: "NEW", "": "X", "Y": 3}}, PHONE: {"pages": {}}}
    clean = lib.validate_library(raw)
    assert clean["revisions"] == {WATCH: {"pages": 4}}
    assert clean["renames"] == {WATCH: {"pages": {HOME: "NEW"}, "status_pages": {}}}
    assert lib.validate_library(json.loads(json.dumps(clean))) == clean


def test_renames_are_held_per_owner_and_follow_a_later_rename() -> None:
    library = lib.hold_renames(lib.empty_library(), WATCH, {"status_pages": {STARTER: "S1"}})
    library = lib.hold_renames(library, WATCH, {"status_pages": {"s1": "S2"}, "pages": {HOME: "H"}})
    assert lib.held_renames(library, WATCH) == {
        "pages": {HOME: "H"},
        "status_pages": {STARTER: "S2", "s1": "S2"},
    }
    assert lib.held_renames(library, PHONE) == {"pages": {}, "status_pages": {}}
    assert lib.hold_renames(library, PHONE, {}) == library
    moved = lib.move_picks(library, WATCH, WATCH_3, []).library
    assert WATCH not in moved["renames"]
    assert lib.held_renames(moved, WATCH_3) == lib.held_renames(library, WATCH)
    assert WATCH not in lib.forget(library, WATCH).library["renames"]


def test_no_function_changes_the_library_it_is_given() -> None:
    library = _shared()
    before = copy.deepcopy(library)
    anywhere = library["picks"][WATCH]["menus"]["anywhere"]
    lib.pick_page(library, PHONE, "pages", HOME, True, [DOORS])
    lib.pick_page(library, WATCH, "pages", HOME, False)
    lib.pick_menu(library, PHONE, "anywhere", anywhere)
    lib.copy_menu(library, WATCH, "anywhere", "Copy")
    lib.rename_menu(library, anywhere, "Renamed")
    lib.delete_item(library, "pages", LIGHTS, clear_tiles=True)
    lib.delete_item(library, "status_pages", DOORS)
    lib.copy_picks(library, WATCH, PHONE, ["pages", "status_pages", "menus"])
    lib.move_picks(library, WATCH, WATCH_3, ["pages"])
    lib.forget(library, WATCH)
    lib.map_back(library, WATCH, "menus", _menus(beam="x"))
    lib.map_back(library, PHONE, "status_pages", _status(starter_name="Power"), fork_conflicts=True)
    lib.materialise(library, WATCH, "pages", _pages())
    lib.hold_renames(library, WATCH, {"pages": {HOME: "NEW"}})
    assert library == before


def test_rename_refs_leaves_other_kinds_and_tiles_alone() -> None:
    doc = _pages()
    out = lib.rename_refs("pages", doc, {LIGHTS: "NEW"})
    assert doc == _pages()
    assert out["pages"][1]["items"][0]["entityId"] == "page.NEW"
    assert out["pages"][1]["items"][1]["entityId"] == f"status_page.{DOORS}"
    assert out["pages"][2]["id"] == "NEW"
    assert lib.rename_refs("voice", {"phrases": []}, {LIGHTS: "NEW"}) == {"phrases": []}
