"""Pure tests for ``page_links.py``: one page on several devices.

The module imports nothing from Home Assistant or the package, so it is
loaded straight from its file.
"""

from __future__ import annotations

import copy
import importlib.util
import json
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


def test_a_starter_status_page_links_like_any_other() -> None:
    source, target, added, ids = links.apply_link(
        _status(), None, "statusPages", [SYSTEM_STATUS, STATUS]
    )
    assert added == [SYSTEM_STATUS, STATUS]
    assert set(ids) == {SYSTEM_STATUS, STATUS}
    assert source["statusPages"][0]["linkId"] == ids[SYSTEM_STATUS]
    assert target["statusPages"][0]["linkId"] == ids[SYSTEM_STATUS]
    assert target["statusPages"][0]["isSystemDefault"] is True


def test_a_starter_the_target_holds_unlinked_is_adopted_in_its_place() -> None:
    held = {
        "schemaVersion": 1,
        "statusPages": [
            {"id": "PHONE-ONLY", "name": "Phone", "rows": []},
            {
                "id": SYSTEM_STATUS.lower(),
                "name": "Mine",
                "rows": [{"id": "R1"}],
                "isHidden": True,
                "extra": 1,
            },
        ],
    }
    before = copy.deepcopy(held)
    source, target, added, ids = links.apply_link(_status(), held, "statusPages", [SYSTEM_STATUS])
    assert held == before, "the input is never changed"
    assert added == [], "an adopted page is not added"
    link = ids[SYSTEM_STATUS]
    assert source["statusPages"][0]["linkId"] == link
    assert [p["id"] for p in target["statusPages"]] == ["PHONE-ONLY", SYSTEM_STATUS.lower()]
    assert target["statusPages"][1] == {
        "id": SYSTEM_STATUS.lower(),
        "name": "Batteries",
        "rows": [],
        "isSystemDefault": True,
        "linkId": link,
        "isHidden": True,
    }, "the source's contents, the target's place, id spelling and isHidden"
    # Linked from then on: a second link onto it writes nothing.
    _s, again, added, _i = links.apply_link(source, target, "statusPages", [SYSTEM_STATUS])
    assert again == target and added == []


def test_a_starter_is_adopted_when_either_side_says_so() -> None:
    # Only the target's copy carries isSystemDefault, under an id that is
    # not one of the five fixed ones.
    source = {"statusPages": [{"id": STATUS, "name": "Doors", "rows": []}]}
    held = {"statusPages": [{"id": STATUS, "name": "Old", "isSystemDefault": True}]}
    _s, target, _a, ids = links.apply_link(source, held, "statusPages", [STATUS])
    assert target["statusPages"] == [
        {"id": STATUS, "name": "Doors", "rows": [], "linkId": ids[STATUS]}
    ]
    # And with the mark on the source alone.
    source["statusPages"][0]["isSystemDefault"] = True
    held = {"statusPages": [{"id": STATUS, "name": "Old"}]}
    _s, target, _a, ids = links.apply_link(source, held, "statusPages", [STATUS])
    assert target["statusPages"][0]["linkId"] == ids[STATUS]


def test_a_status_page_clash_is_still_id_taken() -> None:
    # Another status page under a non-starter id, unlinked.
    held = {"statusPages": [{"id": STATUS, "name": "Other", "rows": []}]}
    with pytest.raises(links.PageLinkError) as err:
        links.apply_link(_status(), held, "statusPages", [STATUS])
    assert err.value.code == "id_taken"
    # A starter copy linked to something else.
    held = {"statusPages": [{"id": SYSTEM_STATUS, "name": "Mine", "linkId": "L-ELSE"}]}
    with pytest.raises(links.PageLinkError) as err:
        links.apply_link(_status(), held, "statusPages", [SYSTEM_STATUS])
    assert err.value.code == "id_taken"
    # Pages never adopt, whatever their id.
    held = {"pages": [{"id": SYSTEM_STATUS, "name": "Other"}]}
    source = {"pages": [{"id": SYSTEM_STATUS, "name": "Mine"}]}
    with pytest.raises(links.PageLinkError) as err:
        links.apply_link(source, held, "pages", [SYSTEM_STATUS])
    assert err.value.code == "id_taken"


def test_a_linked_starter_fans_out_and_drops_its_last_link() -> None:
    held = {"statusPages": [{"id": SYSTEM_STATUS, "name": "Mine", "rows": [], "isHidden": True}]}
    source, target, _a, ids = links.apply_link(_status(), held, "statusPages", [SYSTEM_STATUS])
    source["statusPages"][0]["name"] = "Power"
    out = links.fan_out(source, target, "statusPages")
    assert out["statusPages"][0]["name"] == "Power"
    assert out["statusPages"][0]["isHidden"] is True
    dropped = links.drop_link(out, "statusPages", ids[SYSTEM_STATUS])
    assert "linkId" not in dropped["statusPages"][0]
    assert links.link_places({"w": source, "p": out}, "statusPages") == {
        ids[SYSTEM_STATUS]: ["p", "w"]
    }


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


# ── linked units (the menus) ─────────────────────────────────────────────

_FRONTEND = Path(__file__).resolve().parents[1] / "frontend"
_PAGE = "3E4D1000-0000-4000-8000-000000000385"
_STATUS_PAGE = "3E4D1000-0000-4000-8000-000000000386"


def _menus() -> dict:
    """The panel's configured menus fixture: an Anywhere menu with a Go to
    page and a Status page slot, an Entity quick menu with neither."""
    return json.loads((_FRONTEND / "test" / "fixtures-menus" / "02-configured.json").read_text())


def _other_menus() -> dict:
    other = _menus()
    other["quickAction"]["beamStyle"] = "none"
    other["entityRadial"]["lightInheritsAll"] = False
    other["pageSwitcher"]["displayMode"] = "name"
    return other


def test_the_menu_page_actions_are_the_tables_page_payloads() -> None:
    table = json.loads((_FRONTEND / "src" / "watch-menus" / "menu-actions.json").read_text())
    wanted = {
        action["raw"]: (spec["key"], spec["target"])
        for action in table["actions"]
        for spec in action.get("payload", [])
        if spec.get("type") == "uuid" and spec.get("target") in ("page", "statusPage")
    }
    assert links._MENU_PAGE_ACTIONS == wanted


def test_menu_targets_walks_every_slot_list_of_the_units_asked() -> None:
    menus = _menus()
    assert links.menu_targets(menus) == ([_PAGE], [_STATUS_PAGE])
    assert links.menu_targets(menus, ["entity"]) == ([], [])
    radial = menus["entityRadial"]
    radial["lightSlots"].append(
        {"id": "S1", "action": {"type": "navigateToPage", "pageId": HOME}}
    )
    radial["entityOverrides"]["climate.hallway"].append(
        {"id": "S2", "action": {"type": "showStatusPage", "pageId": STATUS}}
    )
    radial["allSlots"].append({"id": "S3", "action": {"type": "navigateToPage", "pageId": _PAGE.lower()}})
    radial["allSlots"].append({"id": "S4", "action": {"type": "showStatusPage"}})
    assert links.menu_targets(menus, ["entity"]) == ([_PAGE.lower(), HOME], [STATUS])
    assert links.menu_targets(menus) == ([_PAGE, HOME], [_STATUS_PAGE, STATUS]), "each id once"
    assert links.menu_targets(None) == ([], [])


def test_apply_unit_link_marks_both_and_copies_the_units_keys() -> None:
    source, target = _menus(), _other_menus()
    before = copy.deepcopy(source)
    new_source, new_target, link = links.apply_unit_link(
        source, target, "menus", "anywhere", replace=True
    )
    assert source == before, "the input is never changed"
    assert len(link) == 32
    assert new_source["linkIds"] == {"anywhere": link} == new_target["linkIds"]
    assert new_target["quickAction"] == source["quickAction"]
    assert new_target["pageSwitcher"] == source["pageSwitcher"]
    assert new_target["entityRadial"] == target["entityRadial"], "the other unit stays"
    assert list(new_target) == sorted(new_target), "linkIds goes in at its sorted place"
    for key in ("quickAction", "entityRadial", "pageSwitcher"):
        assert "linkId" not in new_target[key] and "linkIds" not in new_target[key]


def test_apply_unit_link_refuses_a_taken_unit_unless_replaced() -> None:
    with pytest.raises(links.PageLinkError) as err:
        links.apply_unit_link(_menus(), _other_menus(), "menus", "anywhere")
    assert err.value.code == "unit_taken"
    # The same keys are no clash, and nor is a unit the target lacks.
    _s, same, _l = links.apply_unit_link(_menus(), _menus(), "menus", "anywhere")
    assert same["linkIds"]["anywhere"]
    bare = {"schemaVersion": 1, "entityRadial": {}}
    _s, filled, _l = links.apply_unit_link(_menus(), bare, "menus", "anywhere")
    assert filled["quickAction"] == _menus()["quickAction"]
    # A target linked elsewhere for the unit is taken even with equal keys.
    elsewhere = {**_menus(), "linkIds": {"anywhere": "L-OTHER"}}
    with pytest.raises(links.PageLinkError):
        links.apply_unit_link(_menus(), elsewhere, "menus", "anywhere")
    _s, replaced, link = links.apply_unit_link(_menus(), elsewhere, "menus", "anywhere", True)
    assert replaced["linkIds"] == {"anywhere": link} and link != "L-OTHER"


def test_apply_unit_link_keeps_an_existing_link_and_relinks_its_copy() -> None:
    source = {**_menus(), "linkIds": {"entity": "L-E"}}
    target = {**_other_menus(), "linkIds": {"entity": "L-E"}}
    new_source, new_target, link = links.apply_unit_link(source, target, "menus", "entity")
    assert link == "L-E"
    assert new_source == source
    assert new_target["entityRadial"] == source["entityRadial"]
    assert new_target["quickAction"] == target["quickAction"]


def test_apply_unit_link_onto_no_document_copies_the_source_unlinked_but_the_unit() -> None:
    source = {**_menus(), "linkIds": {"entity": "L-E"}}
    _s, target, link = links.apply_unit_link(source, None, "menus", "anywhere")
    assert target["linkIds"] == {"anywhere": link}, "the entity link is not brought along"
    assert {k: v for k, v in target.items() if k != "linkIds"} == _menus()


def test_fan_out_units_replaces_only_the_linked_units() -> None:
    source, target, link = links.apply_unit_link(_menus(), _other_menus(), "menus", "anywhere", True)
    source["quickAction"]["beamStyle"] = "ripplePulse"
    source["entityRadial"]["lightInheritsAll"] = True
    del source["pageSwitcher"]
    out = links.fan_out_units(source, target, "menus")
    assert out["quickAction"]["beamStyle"] == "ripplePulse"
    assert "pageSwitcher" not in out, "a key the save lacks is removed"
    assert out["entityRadial"]["lightInheritsAll"] is False, "the entity menu is not linked"
    assert out["linkIds"] == {"anywhere": link}
    assert links.fan_out_units(source, out, "menus") is None, "nothing left to change"
    assert links.fan_out_units(_menus(), target, "menus") is None, "no links in the save"
    other_link = {**source, "linkIds": {"anywhere": "L-OTHER"}}
    assert links.fan_out_units(other_link, target, "menus") is None
    assert links.fan_out_units(source, None, "menus") is None


def test_unit_link_ids_drop_and_places() -> None:
    document = {**_menus(), "linkIds": {"anywhere": "L-A", "entity": "L-E", "x": "L-X"}}
    assert links.unit_links(document, "menus") == {"anywhere": "L-A", "entity": "L-E"}
    assert links.unit_link_ids(document, "menus") == {"L-A", "L-E"}
    assert links.unit_link_ids({"linkIds": {"anywhere": ""}}, "menus") == set()
    dropped = links.drop_unit_link(document, "menus", "L-A")
    assert dropped["linkIds"] == {"entity": "L-E", "x": "L-X"}
    assert links.drop_unit_link(dropped, "menus", "L-A") is None
    gone = links.drop_unit_link({**_menus(), "linkIds": {"entity": "L-E"}}, "menus", "L-E")
    assert "linkIds" not in gone
    places = links.unit_link_places(
        {"w": document, "p": {"linkIds": {"anywhere": "L-A"}}, "x": None}, "menus"
    )
    assert places == {
        "L-A": {"unit": "anywhere", "owners": ["p", "w"]},
        "L-E": {"unit": "entity", "owners": ["w"]},
    }
    assert "linkIds" not in links.without_unit_links(document)


def test_link_ops_reach_both_grains() -> None:
    assert links.LINKABLE_KINDS == ("pages", "status_pages", "menus", "voice")
    assert links.link_ops("rooms") is None
    pages = links.link_ops("pages")
    source, _target = _linked_pair()
    assert pages.ids(source) == links.link_ids(source, "pages")
    menus = links.link_ops("menus")
    linked = {**_menus(), "linkIds": {"anywhere": "L-A"}}
    assert menus.ids(linked) == {"L-A"}
    assert "linkIds" not in menus.drop(linked, "L-A")
    assert menus.fan_out(linked, {**_other_menus(), "linkIds": {"anywhere": "L-A"}})


# ── linked units (the voice settings) ────────────────────────────────────

_PHRASE_KEYS = ("defaultAssistAgentId", "defaultSpeakers", "defaultTTSEngine", "phrases")
_WATCH_KEYS = ("watchSpeakReplyInSilentMode", "watchSpeechVoiceIdentifier")


def _voice() -> dict:
    """The panel's configured voice fixture: three phrases, the defaults,
    and both of the watch's own speech settings."""
    return json.loads((_FRONTEND / "test" / "fixtures-voice" / "02-configured.json").read_text())


def _other_voice() -> dict:
    return {
        "defaultSpeakers": ["media_player.bedroom"],
        "defaultTTSEngine": "tts.piper",
        "phrases": [],
        "schemaVersion": 1,
        "watchSpeakReplyInSilentMode": True,
        "watchSpeechVoiceIdentifier": "com.apple.voice.compact.en-GB.Daniel",
    }


def test_the_voice_unit_and_the_watchs_own_keys_split_the_voice_table() -> None:
    """Every top-level key of the panel's voice table is in the phrase unit,
    is one of the watch's own, or is ``schemaVersion``; none is in two."""
    table = json.loads((_FRONTEND / "src" / "watch-voice" / "voice-keys.json").read_text())
    document_keys = set(table["types"]["document"]["keys"])
    unit = links.unit_keys("voice", "phrases")
    own = links.UNIT_DEVICE_KEYS["voice"]
    assert unit == _PHRASE_KEYS and own == _WATCH_KEYS
    assert set(unit).isdisjoint(own)
    assert set(unit) | set(own) | {"schemaVersion"} == document_keys
    assert list(links.LINK_UNITS["voice"]) == ["phrases"]


def test_a_voice_link_onto_no_document_leaves_the_watchs_own_keys_behind() -> None:
    source = _voice()
    new_source, target, link = links.apply_unit_link(source, None, "voice", "phrases")
    assert new_source["linkIds"] == {"phrases": link} == target["linkIds"]
    for key in _PHRASE_KEYS:
        assert target[key] == source[key]
    for key in _WATCH_KEYS:
        assert key not in target, "the target reads its own default"
    assert target["schemaVersion"] == 1
    assert list(target) == sorted(target)


def test_a_voice_link_onto_a_watchs_own_settings_keeps_its_speech_settings() -> None:
    with pytest.raises(links.PageLinkError) as err:
        links.apply_unit_link(_voice(), _other_voice(), "voice", "phrases")
    assert err.value.code == "unit_taken"
    _s, target, link = links.apply_unit_link(_voice(), _other_voice(), "voice", "phrases", True)
    assert target["phrases"] == _voice()["phrases"]
    assert target["defaultAssistAgentId"] == "conversation.home_assistant"
    for key in _WATCH_KEYS:
        assert target[key] == _other_voice()[key]
    assert target["linkIds"] == {"phrases": link}
    # A watch whose phrase unit already matches is no clash.
    same = {**_voice(), "watchSpeakReplyInSilentMode": True}
    _s, kept, _l = links.apply_unit_link(_voice(), same, "voice", "phrases")
    assert kept["watchSpeakReplyInSilentMode"] is True


def test_a_blank_unit_is_never_taken() -> None:
    """A new watch's voice settings (the panel's defaults fixture) hold
    nothing of the unit, so a link onto them needs no ``replace``; one phrase,
    an engine or a speaker of its own is enough to ask."""
    defaults = json.loads((_FRONTEND / "test" / "fixtures-voice" / "01-defaults.json").read_text())
    assert links.unit_is_blank(defaults, _PHRASE_KEYS)
    assert links.unit_is_blank({}, _PHRASE_KEYS) and links.unit_is_blank(None, _PHRASE_KEYS)
    _s, target, link = links.apply_unit_link(_voice(), defaults, "voice", "phrases")
    assert target["phrases"] == _voice()["phrases"] and target["linkIds"] == {"phrases": link}
    for own in ({"defaultTTSEngine": "tts.piper"}, {"defaultSpeakers": ["media_player.den"]}):
        assert not links.unit_is_blank({**defaults, **own}, _PHRASE_KEYS)
        with pytest.raises(links.PageLinkError) as err:
            links.apply_unit_link(_voice(), {**defaults, **own}, "voice", "phrases")
        assert err.value.code == "unit_taken"


def test_apply_unit_link_refuses_a_source_that_is_not_a_document() -> None:
    with pytest.raises(links.PageLinkError) as err:
        links.apply_unit_link(None, _other_voice(), "voice", "phrases")
    assert err.value.code == "not_found"


def test_fan_out_of_voice_carries_the_library_and_never_the_watch_settings() -> None:
    source, target, link = links.apply_unit_link(_voice(), _other_voice(), "voice", "phrases", True)
    source["phrases"] = source["phrases"][:1]
    source["watchSpeechVoiceIdentifier"] = "com.apple.voice.premium.en-US.Ava"
    del source["defaultAssistAgentId"]
    out = links.fan_out_units(source, target, "voice")
    assert [p["label"] for p in out["phrases"]] == ["Dinner"]
    assert "defaultAssistAgentId" not in out, "a default the save lacks is removed"
    assert out["watchSpeechVoiceIdentifier"] == _other_voice()["watchSpeechVoiceIdentifier"]
    assert out["watchSpeakReplyInSilentMode"] is True
    only_watch = {**out, "watchSpeakReplyInSilentMode": False}
    assert links.fan_out_units(only_watch, out, "voice") is None, "a watch setting is not linked"
    ops = links.link_ops("voice")
    assert ops.ids(out) == {link}
    assert "linkIds" not in ops.drop(out, link)
    assert links.unit_link_places({"w": source, "x": out}, "voice") == {
        link: {"unit": "phrases", "owners": ["w", "x"]}
    }
