"""In-process tests for linked voice settings in ``WatchConfigStore``.

The same store and fixture as ``test_page_links_store.py``. A voice link
(``link_units`` with kind ``voice`` and the one unit ``phrases``) puts a
watch's phrase library and the defaults behind it (agent, engine, speakers)
on other watches under one id in a top-level ``linkIds``. The watch's own
speech settings (Speak even in Silent Mode, the watch voice) stay on each
watch. Only watches hold voice, so an iPhone is never a target.
"""

from __future__ import annotations

import copy

import pytest

from test_page_links_store import (  # noqa: F401 (env is a fixture)
    HASH,
    PHONE,
    WATCH,
    WATCH_2,
    _doc,
    _save,
    env,
)

WATCH_3 = "watch-C"
DINNER = "7E1CE000-0000-4000-8000-000000000001"
BEDTIME = "7E1CE000-0000-4000-8000-000000000002"
WATCH_KEYS = ("watchSpeakReplyInSilentMode", "watchSpeechVoiceIdentifier")


@pytest.fixture
def ctx(env):  # noqa: F811 (the imported fixture)
    return env


def _phrase(phrase_id: str, label: str) -> dict:
    return {
        "color": "#E8A855",
        "displayMode": "icon",
        "icon": "speaker.wave.2",
        "id": phrase_id,
        "label": label,
        "message": f"{label} now.",
        "targetSpeakers": [],
    }


def _voice(
    *, phrases: tuple[str, ...] = ("Dinner", "Bedtime"), silent: bool = False, voice: str = "Zoe"
) -> dict:
    ids = {"Dinner": DINNER, "Bedtime": BEDTIME}
    return {
        "defaultAssistAgentId": "conversation.home_assistant",
        "defaultSpeakers": ["media_player.kitchen"],
        "defaultTTSEngine": "tts.piper",
        "phrases": [_phrase(ids[label], label) for label in phrases],
        "schemaVersion": 1,
        "watchSpeakReplyInSilentMode": silent,
        "watchSpeechVoiceIdentifier": f"com.apple.voice.premium.en-US.{voice}",
    }


def _own_voice() -> dict:
    """Another watch's own voice settings: no phrases, other defaults, its
    own speech settings."""
    return {
        "defaultSpeakers": ["media_player.bedroom"],
        "defaultTTSEngine": "tts.google_translate_en_com",
        "phrases": [],
        "schemaVersion": 1,
        "watchSpeakReplyInSilentMode": True,
        "watchSpeechVoiceIdentifier": "com.apple.voice.compact.en-GB.Daniel",
    }


def _voice_record(ctx) -> None:
    _save(ctx, WATCH, _voice(), "voice")
    ctx.changes.clear()


def _link(ctx, targets, source=WATCH, **kwargs):
    return ctx.store.link_units("voice", source, ["phrases"], targets, **kwargs)


def _library(document: dict) -> dict:
    return {k: v for k, v in document.items() if k not in WATCH_KEYS and k != "linkIds"}


# ── link_units ───────────────────────────────────────────────────────────


def test_a_voice_link_onto_a_watch_with_none_copies_the_library_not_its_settings(ctx) -> None:
    _voice_record(ctx)
    result = _link(ctx, [WATCH_2])
    link = result["link_ids"]["phrases"]
    assert result == {
        "targets": {WATCH_2: {"pages": [], "status_pages": [], "units": ["phrases"]}},
        "link_ids": {"phrases": link},
    }
    watch = _doc(ctx, WATCH, "voice")
    watch_2 = _doc(ctx, WATCH_2, "voice")
    assert watch["linkIds"] == {"phrases": link} == watch_2["linkIds"]
    assert _library(watch_2) == _library(_voice())
    for key in WATCH_KEYS:
        assert key not in watch_2, "the new watch reads its own default"
    assert list(watch_2) == sorted(watch_2)
    assert ctx.changes == [(WATCH, "voice"), (WATCH_2, "voice")]
    assert ctx.store.get(WATCH_2, "pages") is None, "a voice link brings nothing else"


def test_a_watch_with_its_own_voice_is_refused_unless_replaced(ctx) -> None:
    _voice_record(ctx)
    _save(ctx, WATCH_2, _own_voice(), "voice")
    ctx.changes.clear()
    with pytest.raises(ctx.mod.WatchConfigLinkError) as err:
        _link(ctx, [WATCH_2])
    assert err.value.code == "unit_taken"
    assert ctx.changes == []

    result = _link(ctx, [WATCH_2], replace=True)
    assert result["targets"][WATCH_2]["units"] == ["phrases"]
    watch_2 = _doc(ctx, WATCH_2, "voice")
    assert _library(watch_2) == _library(_voice())
    for key in WATCH_KEYS:
        assert watch_2[key] == _own_voice()[key], "the watch keeps its own speech settings"


def test_relinking_voice_writes_nothing(ctx) -> None:
    _voice_record(ctx)
    first = _link(ctx, [WATCH_2])
    ctx.changes.clear()
    again = _link(ctx, [WATCH_2])
    assert again["link_ids"] == first["link_ids"]
    assert again["targets"][WATCH_2]["units"] == []
    assert ctx.changes == []


def test_an_iphone_is_never_a_voice_target(ctx) -> None:
    _voice_record(ctx)
    with pytest.raises(ctx.mod.WatchConfigPhoneKindError) as err:
        _link(ctx, [WATCH_2, PHONE])
    assert err.value.code == "not_for_iphone"
    assert ctx.changes == [], "checked whole first: the other watch got nothing either"
    assert ctx.store.get(WATCH_2, "voice") is None


@pytest.mark.parametrize(
    ("units", "targets", "code"),
    [
        (["anywhere"], [WATCH_2], "invalid"),
        ([], [WATCH_2], "invalid"),
        (["phrases"], [WATCH], "invalid"),
        (["phrases"], ["stranger"], "unknown_device"),
    ],
)
def test_voice_link_refusals_write_nothing(ctx, units, targets, code) -> None:
    _voice_record(ctx)
    with pytest.raises(ctx.mod.WatchConfigStoreError) as err:
        ctx.store.link_units("voice", WATCH, units, targets)
    assert err.value.code == code
    assert ctx.changes == []


def test_a_source_with_no_voice_is_not_found(ctx) -> None:
    with pytest.raises(ctx.mod.WatchConfigLinkError) as err:
        _link(ctx, [WATCH_2])
    assert err.value.code == "not_found"


def test_a_voice_link_never_starts_the_voice_of_a_watch_awaiting_its_move(ctx) -> None:
    _voice_record(ctx)
    ctx.awaiting.add(WATCH_2)
    with pytest.raises(ctx.mod.WatchConfigLinkError) as err:
        _link(ctx, [WATCH_2])
    assert err.value.code == "awaiting_move"
    assert ctx.changes == []
    assert ctx.store.get(WATCH_2, "voice") is None


# ── fan-out ──────────────────────────────────────────────────────────────


def _linked(ctx) -> str:
    _voice_record(ctx)
    _save(ctx, WATCH_2, _own_voice(), "voice")
    link = _link(ctx, [WATCH_2], replace=True)["link_ids"]["phrases"]
    ctx.changes.clear()
    return link


def test_a_phrase_edit_reaches_the_other_watch_and_a_speech_setting_does_not(ctx) -> None:
    _linked(ctx)
    watch_2 = _doc(ctx, WATCH_2, "voice")
    watch_2["phrases"][0]["message"] = "Dinner is on the table."
    watch_2["defaultSpeakers"] = ["media_player.hallway"]
    _save(ctx, WATCH_2, watch_2, "voice")
    watch = _doc(ctx, WATCH, "voice")
    assert watch["phrases"][0]["message"] == "Dinner is on the table."
    assert watch["defaultSpeakers"] == ["media_player.hallway"]
    assert watch["watchSpeakReplyInSilentMode"] is False, "the watch keeps its own"
    assert ctx.changes == [(WATCH_2, "voice"), (WATCH, "voice")], "one revision each"

    watch = _doc(ctx, WATCH, "voice")
    watch["watchSpeechVoiceIdentifier"] = "com.apple.voice.premium.en-US.Ava"
    watch["watchSpeakReplyInSilentMode"] = True
    ctx.changes.clear()
    _save(ctx, WATCH, watch, "voice")
    assert ctx.changes == [(WATCH, "voice")]
    watch_2 = _doc(ctx, WATCH_2, "voice")
    for key in WATCH_KEYS:
        assert watch_2[key] == _own_voice()[key]


def test_a_removed_phrase_and_default_leave_every_copy(ctx) -> None:
    _linked(ctx)
    watch = _doc(ctx, WATCH, "voice")
    watch["phrases"] = [p for p in watch["phrases"] if p["id"] != BEDTIME]
    del watch["defaultAssistAgentId"]
    _save(ctx, WATCH, watch, "voice")
    watch_2 = _doc(ctx, WATCH_2, "voice")
    assert [p["id"] for p in watch_2["phrases"]] == [DINNER]
    assert "defaultAssistAgentId" not in watch_2


def test_a_device_put_and_a_restore_of_voice_fan_out(ctx) -> None:
    _linked(ctx)
    record = ctx.store.get(WATCH_2, "voice")
    document = copy.deepcopy(record.document)
    document["defaultTTSEngine"] = "tts.cloud"
    ctx.store.put(
        WATCH_2, "voice", document, document_hash=HASH, base_revision=record.revision,
        updated_by=WATCH_2,
    )
    assert _doc(ctx, WATCH, "voice")["defaultTTSEngine"] == "tts.cloud"
    assert ctx.store.get(WATCH, "voice").updated_by == WATCH_2

    linked_revision = next(
        entry.revision
        for entry in ctx.store.get(WATCH_2, "voice").history
        if "linkIds" in entry.document and entry.document["defaultTTSEngine"] == "tts.piper"
    )
    ctx.store.restore(
        WATCH_2, "voice", linked_revision, base_revision=ctx.store.get(WATCH_2, "voice").revision
    )
    assert _doc(ctx, WATCH, "voice")["defaultTTSEngine"] == "tts.piper"


def test_unlinking_one_of_two_watches_drops_the_voice_link_on_the_other(ctx) -> None:
    _linked(ctx)
    watch_2 = _doc(ctx, WATCH_2, "voice")
    del watch_2["linkIds"]
    watch_2["phrases"] = []
    _save(ctx, WATCH_2, watch_2, "voice")
    watch = _doc(ctx, WATCH, "voice")
    assert "linkIds" not in watch
    assert len(watch["phrases"]) == 2, "an unlinked save is not handed on"
    assert ctx.changes == [(WATCH_2, "voice"), (WATCH, "voice")]


def test_forgetting_one_of_two_watches_drops_the_voice_link(ctx) -> None:
    _linked(ctx)
    ctx.store.forget_owner(WATCH_2)
    assert "linkIds" not in _doc(ctx, WATCH, "voice")
    assert ctx.store.get(WATCH, "voice").updated_by == f"forget:{WATCH_2}"
    assert ctx.store.link_places()["voice"] == {}


def test_a_move_carries_the_voice_link_to_the_new_id(ctx) -> None:
    link = _linked(ctx)
    ctx.store.move_owner(WATCH, WATCH_3, updated_by="move")
    assert _doc(ctx, WATCH_3, "voice")["linkIds"] == {"phrases": link}
    assert ctx.store.link_places()["voice"] == {
        link: {"unit": "phrases", "owners": sorted([WATCH_2, WATCH_3])}
    }


def test_a_voice_copy_over_its_cap_is_left_and_the_save_stands(ctx, monkeypatch) -> None:
    _linked(ctx)
    real = ctx.mod.validate_document

    def capped(kind, document, **kwargs):
        big = document.get("defaultTTSEngine") == "tts.huge"
        if kind == "voice" and big and not kwargs.get("check_items"):
            raise ctx.mod.WatchConfigValidationError("too big")
        return real(kind, document, **kwargs)

    monkeypatch.setattr(ctx.mod, "validate_document", capped)
    watch = _doc(ctx, WATCH, "voice")
    watch["defaultTTSEngine"] = "tts.huge"
    failed: list[str] = []
    ctx.store.panel_save(
        WATCH, "voice", watch, base_revision=ctx.store.get(WATCH, "voice").revision,
        link_failures=failed,
    )
    assert failed == [WATCH_2]
    assert _doc(ctx, WATCH_2, "voice")["defaultTTSEngine"] == "tts.piper"


# ── places, and the menus left alone ─────────────────────────────────────


def test_link_places_names_the_voice_link_and_its_watches(ctx) -> None:
    link = _linked(ctx)
    places = ctx.store.link_places()
    assert places["voice"] == {link: {"unit": "phrases", "owners": [WATCH, WATCH_2]}}
    assert places["menus"] == {}


def test_a_menu_link_leaves_the_voice_alone(ctx) -> None:
    _voice_record(ctx)
    menus = {
        "entityRadial": {"allSlots": [], "schemaVersion": 1},
        "pageSwitcher": {"schemaVersion": 1},
        "quickAction": {"schemaVersion": 1, "slots": []},
        "schemaVersion": 1,
    }
    _save(ctx, WATCH, menus, "menus")
    ctx.changes.clear()
    ctx.store.link_units("menus", WATCH, ["anywhere"], [WATCH_2])
    assert ctx.store.get(WATCH_2, "voice") is None
    assert "linkIds" not in _doc(ctx, WATCH, "voice")
