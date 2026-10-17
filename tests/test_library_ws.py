"""In-process tests for the library's WebSocket commands:
``wrist_assistant/library/pick``, ``library/menus/copy``,
``library/menus/rename``, ``library/menus/delete``, ``library/delete`` and
``library/summary``.

Run as ``test_watch_pages_link_ws.py`` runs the link commands, over a real
``WatchConfigStore`` whose pairing checks know two watches and an iPhone
(alice's watch and iPhone, bob's watch). The store's own rules are in
``test_library_store.py``; here the request and result shapes, the error
codes and who may do what.
"""

from __future__ import annotations

import pytest

from test_watch_config_ws import ALICE, BOB, ROOT, env  # noqa: F401 (env: the links fixture's own)
from test_watch_pages_link_ws import (  # noqa: F401 (links is a fixture)
    DOORS,
    HOME,
    LIGHTS,
    PHONE,
    WATCH,
    WATCH_2,
    _run,
    links,
)


@pytest.fixture
def ctx(links):  # noqa: F811 (the imported fixture)
    return links


def _menus(beam: str = "auroraWash") -> dict:
    return {
        "entityRadial": {"allSlots": [], "schemaVersion": 1},
        "pageSwitcher": {"schemaVersion": 1},
        "quickAction": {
            "beamStyle": beam,
            "schemaVersion": 1,
            "slots": [
                {
                    "id": "S1",
                    "action": {"type": "navigateToPage", "pageId": LIGHTS},
                    "isVisible": True,
                    "position": "topLeft",
                }
            ],
        },
        "schemaVersion": 1,
    }


def _ok(ctx, command, user=ROOT, **msg):
    connection = _run(ctx, command, user, **msg)
    assert connection.errors == [], connection.errors
    return connection.results[1]


def _codes(ctx, command, user=ROOT, **msg) -> list[str]:
    connection = _run(ctx, command, user, **msg)
    assert connection.results == {}
    return [error[1] for error in connection.errors]


def _menu_of(ctx, owner: str, unit: str = "anywhere") -> str:
    return ctx.store.library_summary()["picks"][owner]["menus"][unit]


# ── library/pick ─────────────────────────────────────────────────────────


def test_pick_answers_the_revisions_it_wrote(ctx) -> None:
    result = _ok(
        ctx, ctx.ws.ws_library_pick, owner_id=PHONE, kind="pages", item_id=HOME, on=True
    )
    phone = ctx.store.get(PHONE, "pages")
    assert [p["id"] for p in phone.document["pages"]] == [HOME]
    # The watch's records gain the link marks of Home and of Doors, which
    # Home's tile brought along.
    assert result == {
        "revisions": {
            WATCH: {
                "status_pages": ctx.store.get(WATCH, "status_pages").revision,
                "pages": ctx.store.get(WATCH, "pages").revision,
            },
            PHONE: {
                "status_pages": ctx.store.get(PHONE, "status_pages").revision,
                "pages": phone.revision,
            },
        }
    }
    off = _ok(ctx, ctx.ws.ws_library_pick, owner_id=PHONE, kind="pages", item_id=HOME, on=False)
    assert ctx.store.get(PHONE, "pages").document["pages"] == []
    assert set(off["revisions"]) == {WATCH, PHONE}


def test_pick_of_a_menu_takes_a_unit(ctx) -> None:
    ctx.store.panel_save(WATCH, "menus", _menus(), base_revision=0)
    ctx.store.panel_save(PHONE, "menus", _menus("none"), base_revision=0)
    menu_id = _menu_of(ctx, WATCH)
    _ok(ctx, ctx.ws.ws_library_pick, owner_id=PHONE, kind="menus", unit="anywhere", item_id=menu_id)
    phone = ctx.store.get(PHONE, "menus").document
    assert phone["quickAction"]["beamStyle"] == "auroraWash"
    assert phone["linkIds"] == {"anywhere": menu_id}


@pytest.mark.parametrize(
    ("msg", "code"),
    [
        ({"owner_id": PHONE, "kind": "pages", "item_id": "nope", "on": True}, "not_found"),
        ({"owner_id": PHONE, "kind": "pages", "item_id": HOME}, "invalid"),
        ({"owner_id": PHONE, "kind": "behavior", "item_id": HOME, "on": True}, "invalid"),
        ({"owner_id": PHONE, "kind": "menus", "item_id": HOME, "unit": "both"}, "invalid"),
        ({"owner_id": "ghost", "kind": "pages", "item_id": HOME, "on": True}, "unknown_device"),
    ],
)
def test_pick_refusals_carry_the_store_s_code(ctx, msg, code) -> None:
    assert _codes(ctx, ctx.ws.ws_library_pick, **msg) == [code]


def test_pick_onto_a_watch_awaiting_its_move_answers_awaiting_move(ctx) -> None:
    ctx.awaiting.add(WATCH_2)
    codes = _codes(
        ctx, ctx.ws.ws_library_pick, owner_id=WATCH_2, kind="pages", item_id=LIGHTS, on=True
    )
    assert codes == ["awaiting_move"]


def test_a_non_admin_may_pick_only_on_their_own_devices(ctx) -> None:
    assert _ok(
        ctx, ctx.ws.ws_library_pick, ALICE, owner_id=PHONE, kind="pages", item_id=HOME, on=True
    )
    codes = _codes(
        ctx, ctx.ws.ws_library_pick, ALICE, owner_id=WATCH_2, kind="pages", item_id=HOME, on=True
    )
    assert codes == ["unauthorized"]


def test_a_non_admin_may_not_pick_an_item_only_another_user_s_device_has(ctx) -> None:
    """Bob's summary never shows Alice's Lights, and a link from her watch
    is refused; a pick by id must be too, or he could put her page on his
    watch and edit it on hers from there."""
    before = ctx.store.get(WATCH, "pages").revision
    codes = _codes(
        ctx, ctx.ws.ws_library_pick, BOB, owner_id=WATCH_2, kind="pages", item_id=LIGHTS, on=True
    )
    assert codes == ["unauthorized"]
    assert ctx.store.get(WATCH_2, "pages") is None
    assert ctx.store.get(WATCH, "pages").revision == before
    ctx.store.panel_save(WATCH, "menus", _menus(), base_revision=0)
    codes = _codes(
        ctx,
        ctx.ws.ws_library_pick,
        BOB,
        owner_id=WATCH_2,
        kind="menus",
        unit="anywhere",
        item_id=_menu_of(ctx, WATCH),
    )
    assert codes == ["unauthorized"]
    # An item no device has is an administrator's, as the summary shows it.
    ctx.store.library_pick(WATCH, "pages", LIGHTS, on=False)
    codes = _codes(
        ctx, ctx.ws.ws_library_pick, ALICE, owner_id=WATCH, kind="pages", item_id=LIGHTS, on=True
    )
    assert codes == ["unauthorized"]
    assert _ok(
        ctx, ctx.ws.ws_library_pick, ROOT, owner_id=WATCH_2, kind="pages", item_id=LIGHTS, on=True
    )
    # Taking an item off one's own device needs only the device.
    assert _ok(
        ctx, ctx.ws.ws_library_pick, BOB, owner_id=WATCH_2, kind="pages", item_id=LIGHTS, on=False
    )


def test_a_non_admin_may_start_a_device_s_menus_from_a_menu_their_watch_uses(ctx) -> None:
    """Alice's iPhone has no menus; it may take the menu her watch uses, and
    starts from her watch's record, with an Entity quick menu of its own."""
    ctx.store.panel_save(WATCH, "menus", _menus(), base_revision=0)
    ctx.store.panel_save(WATCH_2, "menus", _menus("none"), base_revision=0)
    _ok(
        ctx,
        ctx.ws.ws_library_pick,
        ALICE,
        owner_id=PHONE,
        kind="menus",
        unit="anywhere",
        item_id=_menu_of(ctx, WATCH),
    )
    assert ctx.store.get(PHONE, "menus").document["quickAction"]["beamStyle"] == "auroraWash"
    assert _menu_of(ctx, PHONE, "entity") not in (_menu_of(ctx, WATCH, "entity"), _menu_of(ctx, WATCH_2, "entity"))


# ── library/menus/copy, rename, delete ───────────────────────────────────


def test_copy_rename_and_delete_a_menu(ctx) -> None:
    ctx.store.panel_save(WATCH, "menus", _menus(), base_revision=0)
    ctx.store.link_units("menus", WATCH, ["anywhere"], [PHONE])
    shared = _menu_of(ctx, WATCH)
    copied = _ok(
        ctx, ctx.ws.ws_library_menus_copy, owner_id=PHONE, unit="anywhere", name="Phone menu"
    )
    assert set(copied) == {"id", "revisions"}
    assert _menu_of(ctx, PHONE) == copied["id"] != shared
    assert "linkIds" not in ctx.store.get(WATCH, "menus").document
    assert _ok(ctx, ctx.ws.ws_library_menus_rename, item_id=copied["id"], name="Travel") == {}
    assert ctx.store.library_summary()["menus"][copied["id"]]["name"] == "Travel"
    assert _codes(ctx, ctx.ws.ws_library_menus_delete, item_id=shared) == ["in_use"]
    ctx.store.library_pick(WATCH, "menus", copied["id"], unit="anywhere")
    assert _ok(ctx, ctx.ws.ws_library_menus_delete, item_id=shared) == {
        "revisions": {},
        "link_failures": [],
    }
    assert shared not in ctx.store.library_summary()["menus"]


@pytest.mark.parametrize(
    ("command", "msg", "code"),
    [
        ("ws_library_menus_copy", {"owner_id": PHONE, "unit": "anywhere", "name": "X"}, "not_found"),
        ("ws_library_menus_copy", {"owner_id": WATCH, "unit": "both", "name": "X"}, "invalid"),
        ("ws_library_menus_rename", {"item_id": "nope", "name": "X"}, "not_found"),
        ("ws_library_menus_delete", {"item_id": "nope"}, "not_found"),
        ("ws_library_delete", {"kind": "rooms", "item_id": HOME}, "invalid"),
        ("ws_library_delete", {"kind": "pages", "item_id": "nope"}, "not_found"),
    ],
)
def test_menu_and_delete_refusals_carry_the_store_s_code(ctx, command, msg, code) -> None:
    ctx.store.panel_save(WATCH, "menus", _menus(), base_revision=0)
    assert _codes(ctx, getattr(ctx.ws, command), **msg) == [code]


def test_a_non_admin_may_change_only_what_their_own_devices_have(ctx) -> None:
    ctx.store.panel_save(WATCH, "menus", _menus(), base_revision=0)
    ctx.store.panel_save(WATCH_2, "menus", _menus("none"), base_revision=0)
    alices = _menu_of(ctx, WATCH)
    bobs = _menu_of(ctx, WATCH_2)
    assert _ok(ctx, ctx.ws.ws_library_menus_rename, ALICE, item_id=alices, name="Mine") == {}
    assert _codes(ctx, ctx.ws.ws_library_menus_rename, ALICE, item_id=bobs, name="Mine") == [
        "unauthorized"
    ]
    # A page no device has is an administrator's.
    ctx.store.library_pick(WATCH, "pages", LIGHTS, on=False)
    assert _codes(ctx, ctx.ws.ws_library_delete, ALICE, kind="pages", item_id=LIGHTS) == [
        "unauthorized"
    ]
    assert _ok(ctx, ctx.ws.ws_library_delete, ROOT, kind="pages", item_id=LIGHTS)


def test_delete_of_a_page_answers_the_revisions_and_clears_its_tiles(ctx) -> None:
    result = _ok(ctx, ctx.ws.ws_library_delete, kind="pages", item_id=LIGHTS)
    watch = ctx.store.get(WATCH, "pages")
    assert result == {"revisions": {WATCH: {"pages": watch.revision}}, "link_failures": []}
    [home] = watch.document["pages"]
    assert [t["entityId"] for t in home["items"]] == [f"status_page.{DOORS}"]


# ── library/summary ──────────────────────────────────────────────────────


def test_summary_lists_every_item_with_who_picks_it(ctx) -> None:
    ctx.store.link_pages(WATCH, [LIGHTS], [WATCH_2])
    summary = _ok(ctx, ctx.ws.ws_library_summary)
    assert set(summary) == {"pages", "status_pages", "menus", "picks"}
    assert summary["pages"][LIGHTS]["owners"] == [WATCH, WATCH_2]
    assert summary["pages"][LIGHTS]["item"]["name"] == "Lights"
    assert summary["pages"][HOME]["owners"] == [WATCH]
    assert summary["status_pages"][DOORS]["owners"] == [WATCH]
    assert summary["picks"][WATCH_2] == {"pages": [{"id": LIGHTS}]}


def test_summary_for_a_non_admin_names_only_their_devices(ctx) -> None:
    ctx.store.link_pages(WATCH, [LIGHTS], [WATCH_2])
    ctx.store.panel_save(
        WATCH_2,
        "status_pages",
        {"schemaVersion": 1, "statusPages": [{"id": "BOB-STATUS", "name": "Bob's", "rows": []}]},
        base_revision=0,
    )
    summary = _ok(ctx, ctx.ws.ws_library_summary, ALICE)
    assert summary["pages"][LIGHTS]["owners"] == [WATCH]
    assert "BOB-STATUS" not in summary["status_pages"]
    assert set(summary["picks"]) == {WATCH}


def test_the_library_commands_answer_unavailable_before_the_integration_is_ready(ctx) -> None:
    ctx.hass.data = {}
    assert _codes(ctx, ctx.ws.ws_library_summary) == ["unavailable"]
    assert _codes(
        ctx, ctx.ws.ws_library_pick, owner_id=PHONE, kind="pages", item_id=HOME, on=True
    ) == ["unavailable"]
