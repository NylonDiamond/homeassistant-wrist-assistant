"""Pure tests for ``page_links.py``: the page walk, the rooms copy, and a
watch's linked voice settings.

The module imports nothing from Home Assistant or the package, so it is
loaded straight from its file.
"""

from __future__ import annotations

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


# ── helpers ──────────────────────────────────────────────────────────────


def test_listed_page_ids_and_rooms_from_behavior() -> None:
    assert links.listed_page_ids(_pages()) == [HOME, LIGHTS, DEEP, ALONE]
    assert links.listed_page_ids(None) == []
    assert links.rooms_from_behavior({"hapticsEnabled": True}) is None
    assert links.rooms_from_behavior(
        {"roomAutoSwitchEnabled": True, "roomQuickJumpMappings": [], "other": 1}
    ) == {"schemaVersion": 1, "roomAutoSwitchEnabled": True, "roomQuickJumpMappings": []}
    assert links.ids_in(_status(), "statusPages") == [SYSTEM_STATUS, STATUS]


def test_only_voice_links() -> None:
    """Pages, status pages and menus live in the library now: no link code
    is left for them here."""
    assert list(links.LINK_UNITS) == ["voice"]
    for kind in ("pages", "status_pages", "menus", "rooms"):
        assert links.link_ops(kind) is None
    for gone in ("LINKED_KINDS", "LINK_KEY", "apply_link", "fan_out", "drop_link", "menu_targets"):
        assert not hasattr(links, gone), gone


# ── linked units (the voice settings) ────────────────────────────────────

_FRONTEND = Path(__file__).resolve().parents[1] / "frontend"
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


def test_apply_unit_link_keeps_an_existing_link_and_relinks_its_copy() -> None:
    source = {**_voice(), "linkIds": {"phrases": "L-P"}}
    target = {**_other_voice(), "linkIds": {"phrases": "L-P"}}
    new_source, new_target, link = links.apply_unit_link(source, target, "voice", "phrases")
    assert link == "L-P"
    assert new_source == source
    assert new_target["phrases"] == source["phrases"]
    assert new_target["watchSpeechVoiceIdentifier"] == _other_voice()["watchSpeechVoiceIdentifier"]
    # A target linked elsewhere is taken even with equal keys.
    elsewhere = {**_voice(), "linkIds": {"phrases": "L-OTHER"}}
    with pytest.raises(links.PageLinkError):
        links.apply_unit_link(_voice(), elsewhere, "voice", "phrases")
    _s, replaced, link = links.apply_unit_link(_voice(), elsewhere, "voice", "phrases", True)
    assert replaced["linkIds"] == {"phrases": link} and link != "L-OTHER"


def test_unit_link_ids_drop_and_places() -> None:
    document = {**_voice(), "linkIds": {"phrases": "L-P", "anywhere": "L-OLD"}}
    assert links.unit_links(document, "voice") == {"phrases": "L-P"}, "only the kind's units"
    assert links.unit_link_ids(document, "voice") == {"L-P"}
    assert links.unit_link_ids({"linkIds": {"phrases": ""}}, "voice") == set()
    dropped = links.drop_unit_link(document, "voice", "L-P")
    assert dropped["linkIds"] == {"anywhere": "L-OLD"}
    assert links.drop_unit_link(dropped, "voice", "L-P") is None
    gone = links.drop_unit_link({**_voice(), "linkIds": {"phrases": "L-P"}}, "voice", "L-P")
    assert "linkIds" not in gone
    places = links.unit_link_places(
        {"w": document, "p": {"linkIds": {"phrases": "L-P"}}, "x": None}, "voice"
    )
    assert places == {"L-P": {"unit": "phrases", "owners": ["p", "w"]}}
    assert "linkIds" not in links.without_unit_links(document)
