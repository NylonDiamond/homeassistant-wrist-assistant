"""Pure tests for ``page_links.py``: one page on several devices.

The module imports nothing from Home Assistant or the package, so it is
loaded straight from its file.
"""

from __future__ import annotations

import copy
import importlib.util
import sys
from pathlib import Path

import pytest

_PATH = (
    Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant" / "page_links.py"
)
_spec = importlib.util.spec_from_file_location("wa_page_links_under_test", _PATH)
links = importlib.util.module_from_spec(_spec)
sys.modules[_spec.name] = links
_spec.loader.exec_module(links)

HOME = "AAAAAAAA-0000-4000-8000-000000000001"
LIGHTS = "AAAAAAAA-0000-4000-8000-000000000002"
DEEP = "AAAAAAAA-0000-4000-8000-000000000003"
ALONE = "AAAAAAAA-0000-4000-8000-000000000004"
SYSTEM = "AAAAAAAA-0000-4000-8000-0000000000FF"
STATUS = "BBBBBBBB-0000-4000-8000-000000000001"
SYSTEM_STATUS = "00000000-0000-0000-0000-000000000001"


def _tile(entity_id: str, n: int = 1) -> dict:
    return {"id": f"T-{n}-{entity_id}", "entityId": entity_id}


def _pages() -> dict:
    return {
        "schemaVersion": 1,
        "pages": [
            {"id": SYSTEM, "name": "Settings", "isSystemPage": True},
            {
                "id": HOME,
                "name": "Home",
                "items": [
                    _tile(f"page.{LIGHTS.lower()}"),
                    _tile(f"status_page.{STATUS}", 2),
                    _tile(f"page.{SYSTEM}", 3),
                    _tile("light.kitchen", 4),
                ],
            },
            {"id": LIGHTS, "name": "Lights", "items": [_tile(f"show_page.{DEEP}"), _tile(f"page.{HOME}", 2)]},
            {"id": DEEP, "name": "Deep", "isHidden": True, "items": [_tile(f"status_page.{SYSTEM_STATUS}")]},
            {"id": ALONE, "name": "Alone", "items": []},
        ],
    }


def _status() -> dict:
    return {
        "schemaVersion": 1,
        "statusPages": [
            {"id": SYSTEM_STATUS, "name": "Batteries", "rows": [], "isSystemDefault": True},
            {"id": STATUS, "name": "Doors", "rows": []},
        ],
    }


# ── link_reach ───────────────────────────────────────────────────────────


def test_reach_walks_tiles_transitively_and_skips_system_pages() -> None:
    pages, status = links.link_reach(_pages(), _status(), [HOME])
    assert pages == [HOME, LIGHTS, DEEP]
    assert status == [SYSTEM_STATUS, STATUS]


def test_reach_of_a_page_with_no_links_is_itself() -> None:
    assert links.link_reach(_pages(), _status(), [ALONE.lower()]) == ([ALONE], [])


def test_reach_leaves_out_unknown_and_system_start_pages() -> None:
    assert links.link_reach(_pages(), _status(), ["nope", SYSTEM]) == ([], [])


def test_reach_does_not_walk_a_smart_page_or_follow_missing_status_pages() -> None:
    pages = _pages()
    pages["pages"][1]["dynamicConfig"] = {"domain": "light"}
    assert links.link_reach(pages, None, [HOME]) == ([HOME], [])


def test_check_link_refuses_missing_and_system_pages() -> None:
    links.check_link(_pages(), [HOME])
    with pytest.raises(links.PageLinkError) as err:
        links.check_link(_pages(), ["missing"])
    assert err.value.code == "not_found"
    with pytest.raises(links.PageLinkError) as err:
        links.check_link(_pages(), [SYSTEM])
    assert err.value.code == "system_page"


def test_check_link_of_status_pages_refuses_only_a_missing_one() -> None:
    links.check_link(_status(), [STATUS.lower(), SYSTEM_STATUS], "statusPages")
    with pytest.raises(links.PageLinkError) as err:
        links.check_link(_status(), [HOME], "statusPages")
    assert err.value.code == "not_found"
    assert "status page" in err.value.message


# ── apply_link ───────────────────────────────────────────────────────────


def test_apply_link_assigns_link_ids_and_appends_to_the_target() -> None:
    source = _pages()
    before = copy.deepcopy(source)
    target = {"schemaVersion": 1, "pages": [{"id": "OWN", "name": "Mine"}]}
    new_source, new_target, added, ids = links.apply_link(source, target, "pages", [HOME, DEEP])
    assert source == before, "the input is never changed"
    assert added == [HOME, DEEP]
    assert set(ids) == {HOME, DEEP}
    assert all(len(link) == 32 for link in ids.values())
    assert [p["id"] for p in new_target["pages"]] == ["OWN", HOME, DEEP]
    by_id = {p["id"]: p for p in new_source["pages"]}
    assert by_id[HOME]["linkId"] == ids[HOME]
    assert new_target["pages"][1]["linkId"] == ids[HOME]
    assert new_target["pages"][2]["isHidden"] is True, "the source's isHidden is copied"
    assert "linkId" not in by_id[ALONE]


def test_apply_link_keeps_an_existing_link_id_and_a_target_copy() -> None:
    source = _pages()
    source["pages"][1]["linkId"] = "L-HOME"
    target = {"pages": [{"id": HOME.lower(), "name": "Old", "linkId": "L-HOME"}]}
    new_source, new_target, added, ids = links.apply_link(source, target, "pages", [HOME])
    assert ids == {HOME: "L-HOME"}
    assert added == []
    assert new_target == target
    assert new_source == source


def test_apply_link_refuses_an_id_the_target_holds_unlinked() -> None:
    target = {"pages": [{"id": HOME, "name": "Other"}]}
    with pytest.raises(links.PageLinkError) as err:
        links.apply_link(_pages(), target, "pages", [HOME])
    assert err.value.code == "id_taken"
    target["pages"][0]["linkId"] = "someone-else"
    with pytest.raises(links.PageLinkError):
        links.apply_link(_pages(), target, "pages", [HOME])


def test_apply_link_onto_no_record_starts_an_empty_document() -> None:
    _source, target, added, _ids = links.apply_link(_pages(), None, "pages", [ALONE])
    assert target["schemaVersion"] == 1
    assert [p["id"] for p in target["pages"]] == [ALONE]
    assert added == [ALONE]


def test_apply_link_refuses_system_and_missing_pages() -> None:
    with pytest.raises(links.PageLinkError) as err:
        links.apply_link(_pages(), None, "pages", [SYSTEM])
    assert err.value.code == "system_page"
    with pytest.raises(links.PageLinkError) as err:
        links.apply_link(_pages(), None, "pages", ["x"])
    assert err.value.code == "not_found"


def test_a_system_status_page_is_copied_unlinked_or_left_alone() -> None:
    source, target, added, ids = links.apply_link(
        _status(), None, "statusPages", [SYSTEM_STATUS, STATUS]
    )
    assert added == [SYSTEM_STATUS, STATUS]
    assert set(ids) == {STATUS}
    assert "linkId" not in target["statusPages"][0]
    assert "linkId" not in source["statusPages"][0]
    held = {"statusPages": [{"id": SYSTEM_STATUS, "name": "Mine", "rows": []}]}
    _s, again, added, _i = links.apply_link(_status(), held, "statusPages", [SYSTEM_STATUS])
    assert added == [] and again == held


# ── fan_out ──────────────────────────────────────────────────────────────


def _linked_pair() -> tuple[dict, dict]:
    source, target, _added, _ids = links.apply_link(_pages(), None, "pages", [HOME, DEEP])
    return source, target


def test_fan_out_replaces_linked_pages_keeping_place_and_hidden() -> None:
    source, target = _linked_pair()
    target["pages"].insert(0, {"id": "PHONE-ONLY", "name": "Phone"})
    target["pages"].reverse()  # DEEP, HOME, PHONE-ONLY
    target["pages"][1]["isHidden"] = True
    source["pages"][1]["name"] = "Home renamed"
    source["pages"][1]["isHidden"] = False
    source["pages"][3]["name"] = "Deep renamed"
    out = links.fan_out(source, target, "pages")
    assert [p["id"] for p in out["pages"]] == [DEEP, HOME, "PHONE-ONLY"]
    assert out["pages"][1]["name"] == "Home renamed"
    assert out["pages"][1]["isHidden"] is True, "the other device's isHidden stays"
    assert out["pages"][0]["name"] == "Deep renamed"
    assert out["pages"][0]["isHidden"] is True
    assert out["pages"][2] == {"id": "PHONE-ONLY", "name": "Phone"}


def test_fan_out_drops_hidden_the_other_never_had() -> None:
    source, target = _linked_pair()
    del target["pages"][1]["isHidden"]
    source["pages"][3]["name"] = "Changed"
    out = links.fan_out(source, target, "pages")
    assert "isHidden" not in out["pages"][1]


def test_fan_out_is_none_when_nothing_changes() -> None:
    source, target = _linked_pair()
    assert links.fan_out(source, target, "pages") is None
    target["pages"][0]["isHidden"] = True
    assert links.fan_out(source, target, "pages") is None, "only isHidden differs"
    assert links.fan_out(_pages(), target, "pages") is None, "no links in the save"


def test_fan_out_never_removes_a_page_or_moves_a_duplicate() -> None:
    source, target = _linked_pair()
    dup = copy.deepcopy(source["pages"][1])
    dup["id"] = "DUPLICATE"
    dup["name"] = "Copy"
    source["pages"] = [p for p in source["pages"] if p["id"] != HOME] + [dup]
    assert links.fan_out(source, target, "pages") is None


# ── helpers ──────────────────────────────────────────────────────────────


def test_link_ids_drop_link_and_places() -> None:
    source, target = _linked_pair()
    ids = links.link_ids(source, "pages")
    assert ids == links.link_ids(target, "pages") and len(ids) == 2
    one = min(ids)
    dropped = links.drop_link(target, "pages", one)
    assert links.link_ids(dropped, "pages") == ids - {one}
    assert links.drop_link(dropped, "pages", one) is None
    places = links.link_places({"w": source, "p": target, "x": None}, "pages")
    assert places == {link: ["p", "w"] for link in sorted(ids)}


def test_listed_page_ids_and_rooms_from_behavior() -> None:
    assert links.listed_page_ids(_pages()) == [HOME, LIGHTS, DEEP, ALONE]
    assert links.listed_page_ids(None) == []
    assert links.rooms_from_behavior({"hapticsEnabled": True}) is None
    assert links.rooms_from_behavior(
        {"roomAutoSwitchEnabled": True, "roomQuickJumpMappings": [], "other": 1}
    ) == {"schemaVersion": 1, "roomAutoSwitchEnabled": True, "roomQuickJumpMappings": []}
