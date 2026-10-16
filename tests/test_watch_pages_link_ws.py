"""In-process tests for the panel's linked pages commands,
``wrist_assistant/watch_pages/link`` and ``wrist_assistant/watch_pages/places``.

Run as ``test_watch_config_ws.py`` runs the other watch config commands, over
a real ``WatchConfigStore`` whose pairing checks know two watches and an
iPhone. The store's own rules are in ``test_page_links_store.py``; here the
result shapes, the error codes and the owner gate.
"""

from __future__ import annotations

import asyncio
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
    store = env.mod.WatchConfigStore(
        env.hass,
        is_paired=lambda owner: owner in {WATCH, WATCH_2},
        is_iphone=lambda owner: owner == PHONE,
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
        "targets": {PHONE: {"pages": [HOME, LIGHTS], "status_pages": [DOORS]}},
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
        "copied": ["menus"],
    }
    assert links.store.get(PHONE, "menus").document == menus
    assert links.store.get(PHONE, "menus").updated_by == "panel"
    again = _link_all(links, source_id=WATCH, target_id=PHONE).results[1]
    assert again == {"pages": [], "status_pages": [], "copied": []}


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
