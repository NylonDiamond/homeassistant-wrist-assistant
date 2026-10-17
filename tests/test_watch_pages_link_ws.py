"""In-process tests for the panel's voice link commands,
``wrist_assistant/watch_pages/link`` and ``wrist_assistant/watch_pages/places``,
and the link failures a save or restore names.

Run as ``test_watch_config_ws.py`` runs the other watch config commands, over
a real ``WatchConfigStore`` whose pairing checks know two watches and an
iPhone. Only a watch's voice settings still link; pages, status pages and
menus live in the library, so both commands refuse them, and
``watch_pages/link_all`` is gone. The store's own rules are in
``test_voice_links_store.py``; here the result shapes, the error codes and
the owner gate.
"""

from __future__ import annotations

import asyncio
import copy
import types

import pytest

from test_watch_config_ws import (  # noqa: F401 (env is a fixture)
    ALICE,
    DOMAIN,
    ROOT,
    _Connection,
    _Secrets,
    env,
)

WATCH = "watch-A"
WATCH_2 = "watch-B"
PHONE = "iphone:1"
HOME = "AAAAAAAA-0000-4000-8000-000000000001"
LIGHTS = "AAAAAAAA-0000-4000-8000-000000000002"
DOORS = "BBBBBBBB-0000-4000-8000-000000000001"


@pytest.fixture
def links(env):  # noqa: F811 (the imported fixture)
    # The watches whose iPhone may still move their own setup here.
    awaiting: set[str] = set()
    store = env.mod.WatchConfigStore(
        env.hass,
        is_paired=lambda owner: owner in {WATCH, WATCH_2},
        is_iphone=lambda owner: owner == PHONE,
        may_await_move=lambda owner: owner in awaiting,
    )
    asyncio.run(store.async_load())
    env.hass.data = {
        DOMAIN: types.SimpleNamespace(
            watch_config_store=store,
            widget_secret_store=_Secrets({WATCH: "alice", PHONE: "alice", WATCH_2: "bob"}),
        )
    }
    store.panel_save(
        WATCH,
        "pages",
        {
            "schemaVersion": 1,
            "pages": [
                {
                    "id": HOME,
                    "name": "Home",
                    "items": [
                        {"id": "T1", "entityId": f"page.{LIGHTS}"},
                        {"id": "T2", "entityId": f"status_page.{DOORS}"},
                    ],
                },
                {"id": LIGHTS, "name": "Lights", "items": []},
            ],
        },
        base_revision=0,
    )
    store.panel_save(
        WATCH,
        "status_pages",
        {"schemaVersion": 1, "statusPages": [{"id": DOORS, "name": "Doors", "rows": []}]},
        base_revision=0,
    )
    env.store = store
    env.awaiting = awaiting
    return env


def _run(links, command, user=ROOT, **msg) -> _Connection:
    connection = _Connection()
    connection.user = user
    command(links.hass, connection, {"id": 1, **msg})
    return connection


def _link(links, user=ROOT, **msg) -> _Connection:
    return _run(links, links.ws.ws_watch_pages_link, user, **msg)


def _pick(links, page_id: str, targets: list[str]) -> None:
    for target in targets:
        links.store.library_pick(target, "pages", page_id, on=True)


def _menus() -> dict:
    return {
        "entityRadial": {"allSlots": [], "schemaVersion": 1},
        "pageSwitcher": {"schemaVersion": 1},
        "quickAction": {"slots": [], "schemaVersion": 1},
        "schemaVersion": 1,
    }


# ── pages, status pages and menus no longer link ─────────────────────────


@pytest.mark.parametrize(
    "msg",
    [
        {"page_ids": [HOME]},
        {"page_ids": [HOME], "kind": "pages"},
        {"page_ids": [DOORS], "kind": "status_pages"},
        {"kind": "menus", "units": ["anywhere"]},
        {"kind": "menus", "units": ["anywhere"], "replace": True},
    ],
)
def test_link_refuses_the_library_kinds(links, msg) -> None:
    links.store.panel_save(WATCH, "menus", _menus(), base_revision=0)
    connection = _link(links, source_id=WATCH, targets=[PHONE], **msg)
    assert connection.results == {}
    [(_id, code, message)] = connection.errors
    assert code == "invalid"
    assert "library/pick" in message
    for kind in ("pages", "status_pages", "menus"):
        assert links.store.get(PHONE, kind) is None


@pytest.mark.parametrize("kind", ["pages", "status_pages", "menus"])
def test_places_refuses_the_library_kinds(links, kind) -> None:
    connection = _run(links, links.ws.ws_watch_pages_places, kind=kind)
    assert connection.results == {}
    [(_id, code, message)] = connection.errors
    assert code == "invalid" and "library/summary" in message


def test_places_names_only_voice_however_much_the_devices_share(links) -> None:
    _pick(links, HOME, [PHONE, WATCH_2])
    assert _run(links, links.ws.ws_watch_pages_places).results[1] == {"voice": {}}
    assert _run(links, links.ws.ws_watch_pages_places, kind="voice").results[1] == {"voice": {}}


def test_link_all_is_gone(links) -> None:
    assert not hasattr(links.ws, "ws_watch_pages_link_all")
    assert not hasattr(links.ws, "_CMD_PAGES_LINK_ALL")


# ── voice ────────────────────────────────────────────────────────────────


def _voice(engine: str = "tts.piper") -> dict:
    return {
        "defaultSpeakers": ["media_player.kitchen"],
        "defaultTTSEngine": engine,
        "phrases": [{"id": "P1", "label": "Dinner", "message": "Dinner is ready."}],
        "schemaVersion": 1,
        "watchSpeakReplyInSilentMode": False,
    }


def test_link_of_voice_answers_the_unit_and_places_names_it(links) -> None:
    links.store.panel_save(WATCH, "voice", _voice(), base_revision=0)
    connection = _link(links, source_id=WATCH, targets=[WATCH_2], kind="voice", units=["phrases"])
    assert connection.errors == []
    link = links.store.get(WATCH, "voice").document["linkIds"]["phrases"]
    assert connection.results[1] == {
        "targets": {
            WATCH_2: {
                "pages": [],
                "status_pages": [],
                "adopted_status_pages": [],
                "units": ["phrases"],
            }
        },
        "link_ids": {"phrases": link},
    }
    watch_2 = links.store.get(WATCH_2, "voice").document
    assert watch_2["phrases"] == _voice()["phrases"]
    assert "watchSpeakReplyInSilentMode" not in watch_2, "the watch's own setting stays"
    admin = _run(links, links.ws.ws_watch_pages_places).results[1]
    assert admin["voice"] == {link: {"unit": "phrases", "owners": [WATCH, WATCH_2]}}
    alice = _run(links, links.ws.ws_watch_pages_places, ALICE).results[1]
    assert alice["voice"] == {link: {"unit": "phrases", "owners": [WATCH]}}


def test_link_of_voice_asks_before_replacing_a_watchs_own(links) -> None:
    links.store.panel_save(WATCH, "voice", _voice(), base_revision=0)
    links.store.panel_save(WATCH_2, "voice", _voice(engine="tts.cloud"), base_revision=0)
    msg = {"source_id": WATCH, "targets": [WATCH_2], "kind": "voice", "units": ["phrases"]}
    assert [error[1] for error in _link(links, **msg).errors] == ["unit_taken"]
    assert _link(links, **msg, replace=True).errors == []
    assert links.store.get(WATCH_2, "voice").document["defaultTTSEngine"] == "tts.piper"


@pytest.mark.parametrize(
    ("msg", "code"),
    [
        ({"targets": [PHONE], "units": ["phrases"]}, "not_for_iphone"),
        ({"targets": [WATCH_2], "units": ["anywhere"]}, "invalid"),
        ({"targets": [WATCH_2]}, "invalid"),
    ],
)
def test_link_of_voice_refusals(links, msg, code) -> None:
    links.store.panel_save(WATCH, "voice", _voice(), base_revision=0)
    connection = _link(links, source_id=WATCH, kind="voice", **msg)
    assert [error[1] for error in connection.errors] == [code]
    assert links.store.get(WATCH_2, "voice") is None
    assert "linkIds" not in links.store.get(WATCH, "voice").document


def test_both_commands_answer_unavailable_before_the_integration_is_ready(links) -> None:
    links.hass.data = {}
    msg = {"source_id": WATCH, "targets": [WATCH_2], "kind": "voice", "units": ["phrases"]}
    assert _link(links, **msg).errors == [(1, "unavailable", "integration not ready")]
    assert _run(links, links.ws.ws_watch_pages_places).errors == [
        (1, "unavailable", "integration not ready")
    ]


def test_a_non_admin_may_link_voice_only_between_their_own_watches(links) -> None:
    links.store.panel_save(WATCH, "voice", _voice(), base_revision=0)
    msg = {"source_id": WATCH, "targets": [WATCH_2], "kind": "voice", "units": ["phrases"]}
    theirs = _link(links, ALICE, **msg)
    assert [error[1] for error in theirs.errors] == ["unauthorized"]
    assert links.store.get(WATCH_2, "voice") is None


# ── save and restore name the devices left out of step ───────────────────


class _Registry:
    """A device registry before 2026.8, with the iPhone renamed."""

    def async_get_device(self, *, identifiers):
        if (DOMAIN, f"watch_{PHONE}") in identifiers:
            return types.SimpleNamespace(name_by_user="Jesse's iPhone", name="iPhone")
        return None


def test_save_and_restore_name_the_devices_that_could_not_take_it(
    links, monkeypatch
) -> None:
    _pick(links, LIGHTS, [PHONE, WATCH_2])
    links.hass.devices = _Registry()
    # WATCH_2 is not in the secret store: its name is null.
    links.hass.data[DOMAIN].widget_secret_store = _Secrets({WATCH: "alice", PHONE: "alice"})
    real = links.mod.validate_document

    def capped(kind, document, **kwargs):
        # Another device's record (written without the tile level) is over
        # its cap once it holds the new name; the saved document is not.
        names = [p.get("name") for p in document.get("pages", [])]
        if not kwargs.get("check_items") and "Bigger" in names:
            raise links.mod.WatchConfigValidationError("too big")
        return real(kind, document, **kwargs)

    monkeypatch.setattr(links.mod, "validate_document", capped)
    record = links.store.get(WATCH, "pages")
    first = record.revision
    document = copy.deepcopy(record.document)
    document["pages"][1]["name"] = "Bigger"
    saved = _run(
        links,
        links.ws.ws_watch_config_save,
        owner_watch_id=WATCH,
        kind="pages",
        base_revision=first,
        document=document,
    )
    assert saved.errors == []
    failures = [
        {"owner": PHONE, "name": "Jesse's iPhone"},
        {"owner": WATCH_2, "name": None},
    ]
    assert saved.results[1] == {
        "revision": links.store.get(WATCH, "pages").revision,
        "link_failures": failures,
    }
    assert links.store.get(PHONE, "pages").document["pages"][-1]["name"] == "Lights"

    restored = _run(
        links,
        links.ws.ws_watch_config_restore,
        owner_watch_id=WATCH,
        kind="pages",
        revision=first,
        base_revision=links.store.get(WATCH, "pages").revision,
    )
    assert restored.errors == []
    assert restored.results[1]["link_failures"] == []


def test_a_save_every_device_took_has_no_link_failures(links) -> None:
    _pick(links, LIGHTS, [PHONE])
    record = links.store.get(WATCH, "pages")
    document = copy.deepcopy(record.document)
    document["pages"][1]["name"] = "Lamps"
    saved = _run(
        links,
        links.ws.ws_watch_config_save,
        owner_watch_id=WATCH,
        kind="pages",
        base_revision=record.revision,
        document=document,
    )
    assert saved.results[1]["link_failures"] == []
    assert links.store.get(PHONE, "pages").document["pages"][-1]["name"] == "Lamps"
