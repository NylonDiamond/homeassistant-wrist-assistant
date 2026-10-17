"""In-process tests for the panel's linked pages commands,
``wrist_assistant/watch_pages/link`` and ``wrist_assistant/watch_pages/places``.

Run as ``test_watch_config_ws.py`` runs the other watch config commands, over
a real ``WatchConfigStore`` whose pairing checks know two watches and an
iPhone. The store's own rules are in ``test_page_links_store.py``; here the
result shapes, the error codes and the owner gate.
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


def test_link_answers_what_each_target_gained_and_the_link_ids(links) -> None:
    connection = _link(links, source_id=WATCH, page_ids=[HOME], targets=[PHONE])
    assert connection.errors == []
    result = connection.results[1]
    watch = links.store.get(WATCH, "pages").document["pages"]
    assert result == {
        "targets": {
            PHONE: {"pages": [HOME, LIGHTS], "status_pages": [DOORS], "adopted_status_pages": []}
        },
        "link_ids": {HOME: watch[0]["linkId"], LIGHTS: watch[1]["linkId"]},
    }
    assert [p["id"] for p in links.store.get(PHONE, "pages").document["pages"]] == [HOME, LIGHTS]


@pytest.mark.parametrize(
    ("msg", "code"),
    [
        ({"source_id": WATCH, "page_ids": ["nope"], "targets": [PHONE]}, "not_found"),
        ({"source_id": WATCH, "page_ids": [HOME], "targets": ["ghost"]}, "unknown_device"),
        ({"source_id": WATCH, "page_ids": [], "targets": [PHONE]}, "invalid"),
    ],
)
def test_link_refusals_carry_the_store_s_code(links, msg, code) -> None:
    connection = _link(links, **msg)
    assert connection.results == {}
    assert [error[1] for error in connection.errors] == [code]


def test_link_of_status_pages_links_them_alone(links) -> None:
    connection = _link(
        links, source_id=WATCH, page_ids=[DOORS], targets=[PHONE], kind="status_pages"
    )
    assert connection.errors == []
    doors = links.store.get(WATCH, "status_pages").document["statusPages"][0]["linkId"]
    assert connection.results[1] == {
        "targets": {PHONE: {"pages": [], "status_pages": [DOORS], "adopted_status_pages": []}},
        "link_ids": {DOORS: doors},
    }
    assert links.store.get(PHONE, "pages") is None
    missing = _link(links, source_id=WATCH, page_ids=[HOME], targets=[PHONE], kind="status_pages")
    assert [error[1] for error in missing.errors] == ["not_found"]


def _menus(beam: str = "auroraWash") -> dict:
    return {
        "entityRadial": {"allSlots": [], "schemaVersion": 1},
        "pageSwitcher": {"schemaVersion": 1},
        "quickAction": {
            "beamStyle": beam,
            "schemaVersion": 1,
            "slots": [{"id": "S1", "action": {"type": "navigateToPage", "pageId": LIGHTS}}],
        },
        "schemaVersion": 1,
    }


def test_link_of_menus_answers_the_units_and_what_came_along(links) -> None:
    links.store.panel_save(WATCH, "menus", _menus(), base_revision=0)
    connection = _link(links, source_id=WATCH, targets=[PHONE], kind="menus", units=["anywhere"])
    assert connection.errors == []
    link = links.store.get(WATCH, "menus").document["linkIds"]["anywhere"]
    assert connection.results[1] == {
        "targets": {
            PHONE: {
                "pages": [LIGHTS],
                "status_pages": [],
                "adopted_status_pages": [],
                "units": ["anywhere"],
            }
        },
        "link_ids": {"anywhere": link},
    }
    assert links.store.get(PHONE, "menus").document["linkIds"] == {"anywhere": link}
    places = _run(links, links.ws.ws_watch_pages_places, ALICE).results[1]
    assert places["menus"] == {link: {"unit": "anywhere", "owners": [PHONE, WATCH]}}


def test_link_of_menus_asks_before_replacing_a_targets_own(links) -> None:
    links.store.panel_save(WATCH, "menus", _menus(), base_revision=0)
    links.store.panel_save(PHONE, "menus", _menus(beam="none"), base_revision=0)
    taken = _link(links, source_id=WATCH, targets=[PHONE], kind="menus", units=["anywhere"])
    assert [error[1] for error in taken.errors] == ["unit_taken"]
    replaced = _link(
        links, source_id=WATCH, targets=[PHONE], kind="menus", units=["anywhere"], replace=True
    )
    assert replaced.errors == []
    assert links.store.get(PHONE, "menus").document["quickAction"]["beamStyle"] == "auroraWash"


@pytest.mark.parametrize(
    ("msg", "code"),
    [
        ({"kind": "menus", "units": ["everything"]}, "invalid"),
        ({"kind": "menus"}, "invalid"),
        ({"kind": "rooms", "page_ids": [HOME]}, "invalid"),
        ({"kind": "pages"}, "invalid"),
    ],
)
def test_link_of_menus_refusals(links, msg, code) -> None:
    links.store.panel_save(WATCH, "menus", _menus(), base_revision=0)
    connection = _link(links, source_id=WATCH, targets=[PHONE], **msg)
    assert [error[1] for error in connection.errors] == [code]
    assert links.store.get(PHONE, "menus") is None


def test_link_of_menus_follows_the_owner_gate(links) -> None:
    links.store.panel_save(WATCH, "menus", _menus(), base_revision=0)
    theirs = _link(
        links, ALICE, source_id=WATCH, targets=[WATCH_2], kind="menus", units=["entity"]
    )
    assert [error[1] for error in theirs.errors] == ["unauthorized"]
    assert links.store.get(WATCH_2, "menus") is None


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


def test_link_refuses_an_id_the_target_holds(links) -> None:
    links.store.panel_save(
        PHONE, "pages", {"schemaVersion": 1, "pages": [{"id": LIGHTS, "name": "Mine", "items": []}]},
        base_revision=0,
    )
    connection = _link(links, source_id=WATCH, page_ids=[HOME], targets=[PHONE])
    assert [error[1] for error in connection.errors] == ["id_taken"]


def test_a_non_admin_may_link_only_between_their_own_devices(links) -> None:
    mine = _link(links, ALICE, source_id=WATCH, page_ids=[LIGHTS], targets=[PHONE])
    assert mine.errors == []
    theirs = _link(links, ALICE, source_id=WATCH, page_ids=[HOME], targets=[PHONE, WATCH_2])
    assert [error[1] for error in theirs.errors] == ["unauthorized"]
    assert links.store.get(WATCH_2, "pages") is None


def test_places_names_the_holders_the_caller_may_see(links) -> None:
    result = _link(links, source_id=WATCH, page_ids=[HOME], targets=[PHONE, WATCH_2]).results[1]
    home, lights = result["link_ids"][HOME], result["link_ids"][LIGHTS]
    doors = links.store.get(WATCH, "status_pages").document["statusPages"][0]["linkId"]
    everyone = sorted([PHONE, WATCH, WATCH_2])
    admin = _run(links, links.ws.ws_watch_pages_places).results[1]
    assert admin == {
        "pages": {home: everyone, lights: everyone},
        "status_pages": {doors: everyone},
        "menus": {},
        "voice": {},
    }
    alice = _run(links, links.ws.ws_watch_pages_places, ALICE).results[1]
    assert alice["pages"] == {home: [PHONE, WATCH], lights: [PHONE, WATCH]}


def test_both_commands_answer_unavailable_before_the_integration_is_ready(links) -> None:
    links.hass.data = {}
    assert _link(links, source_id=WATCH, page_ids=[HOME], targets=[PHONE]).errors == [
        (1, "unavailable", "integration not ready")
    ]
    assert _run(links, links.ws.ws_watch_pages_places).errors == [
        (1, "unavailable", "integration not ready")
    ]


# ── link_all ─────────────────────────────────────────────────────────────


def _link_all(links, user=ROOT, **msg) -> _Connection:
    return _run(links, links.ws.ws_watch_pages_link_all, user, **msg)


def test_link_all_links_every_page_and_status_page_and_copies_menus(links) -> None:
    menus = {"quickAction": {"slots": []}, "entityRadial": {}, "pageSwitcher": {}}
    links.store.panel_save(WATCH, "menus", menus, base_revision=0)
    links.store.panel_save(
        WATCH,
        "status_pages",
        {
            "schemaVersion": 1,
            "statusPages": [
                {"id": DOORS, "name": "Doors", "rows": []},
                {"id": "BBBBBBBB-0000-4000-8000-000000000002", "name": "Menu only", "rows": []},
            ],
        },
        base_revision=links.store.get(WATCH, "status_pages").revision,
    )
    connection = _link_all(links, source_id=WATCH, target_id=PHONE)
    assert connection.errors == []
    assert connection.results[1] == {
        "pages": [HOME, LIGHTS],
        "status_pages": [DOORS, "BBBBBBBB-0000-4000-8000-000000000002"],
        "adopted_status_pages": [],
        "copied": ["menus"],
    }
    assert links.store.get(PHONE, "menus").document == menus
    assert links.store.get(PHONE, "menus").updated_by == "panel"
    again = _link_all(links, source_id=WATCH, target_id=PHONE).results[1]
    assert again == {"pages": [], "status_pages": [], "adopted_status_pages": [], "copied": []}


@pytest.mark.parametrize(
    ("msg", "code", "user"),
    [
        ({"source_id": WATCH, "target_id": "ghost"}, "unknown_device", ROOT),
        ({"source_id": WATCH, "target_id": WATCH}, "invalid", ROOT),
        ({"source_id": WATCH, "target_id": WATCH_2}, "unauthorized", ALICE),
    ],
)
def test_link_all_refusals(links, msg, code, user) -> None:
    connection = _link_all(links, user, **msg)
    assert connection.results == {}
    assert [error[1] for error in connection.errors] == [code]
    assert links.store.get(WATCH_2, "pages") is None


def test_link_all_refuses_an_id_the_target_holds(links) -> None:
    links.store.panel_save(
        PHONE, "pages", {"schemaVersion": 1, "pages": [{"id": HOME, "name": "Mine", "items": []}]},
        base_revision=0,
    )
    connection = _link_all(links, source_id=WATCH, target_id=PHONE)
    assert [error[1] for error in connection.errors] == ["id_taken"]
    assert links.store.get(PHONE, "status_pages") is None


# ── a watch still waiting for its iPhone's move ──────────────────────────


def test_link_onto_a_watch_awaiting_its_move_answers_awaiting_move(links) -> None:
    links.awaiting.add(WATCH_2)
    connection = _link(links, source_id=WATCH, page_ids=[LIGHTS], targets=[WATCH_2])
    assert connection.results == {}
    assert [error[1] for error in connection.errors] == ["awaiting_move"]
    assert links.store.get(WATCH_2, "pages") is None


def test_link_all_onto_a_watch_awaiting_its_move_answers_awaiting_move(links) -> None:
    links.awaiting.add(WATCH_2)
    connection = _link_all(links, source_id=WATCH, target_id=WATCH_2)
    assert [error[1] for error in connection.errors] == ["awaiting_move"]
    assert links.store.get(WATCH_2, "pages") is None
    assert links.store.get(WATCH_2, "status_pages") is None


# ── save and restore name the copies left out of step ────────────────────


class _Registry:
    """A device registry before 2026.8, with the iPhone renamed."""

    def async_get_device(self, *, identifiers):
        if (DOMAIN, f"watch_{PHONE}") in identifiers:
            return types.SimpleNamespace(name_by_user="Jesse's iPhone", name="iPhone")
        return None


def test_save_and_restore_name_the_linked_copies_that_could_not_take_it(
    links, monkeypatch
) -> None:
    _link(links, source_id=WATCH, page_ids=[LIGHTS], targets=[PHONE, WATCH_2])
    links.hass.devices = _Registry()
    # WATCH_2 is not in the secret store: its name is null.
    links.hass.data[DOMAIN].widget_secret_store = _Secrets({WATCH: "alice", PHONE: "alice"})
    real = links.mod.validate_document

    def capped(kind, document, **kwargs):
        # A copy (written without the tile level) is over its cap once it
        # holds the new name; the saved document itself is not.
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


def test_a_save_whose_copies_all_took_it_has_no_link_failures(links) -> None:
    _link(links, source_id=WATCH, page_ids=[LIGHTS], targets=[PHONE])
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
