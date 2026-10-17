"""In-process tests for pages and status pages on several devices in
``WatchConfigStore``, now one library (``library.py``).

The real store, loaded the way ``test_watch_config_store.py`` loads it. The
current panel's link ops (``link_pages``, ``link_device``) make several
owners pick the same library item; every accepted write of ``pages`` or
``status_pages`` is mapped back into the library and each other owner that
picks a changed item is written again, as one new revision there, keeping
that owner's order and ``isHidden``. While two or more owners pick an item
their records carry its id as ``linkId``, which the current panel folds its
cards from; an item on one owner carries none.
"""

from __future__ import annotations

import asyncio
import copy
import types

import pytest

from test_watch_config_store import _Hass, _loaded_module

WATCH = "watch-A"
WATCH_2 = "watch-B"
PHONE = "iphone:1"
HASH = "c" * 64

HOME = "AAAAAAAA-0000-4000-8000-000000000001"
LIGHTS = "AAAAAAAA-0000-4000-8000-000000000002"
SOLO = "AAAAAAAA-0000-4000-8000-000000000003"
SYSTEM = "AAAAAAAA-0000-4000-8000-0000000000FF"
DOORS = "BBBBBBBB-0000-4000-8000-000000000001"
PHONE_PAGE = "CCCCCCCC-0000-4000-8000-000000000001"
# One of the app's five starter status pages, the same id on every device.
STARTER = "00000000-0000-0000-0000-000000000001"


def _tile(n: int, entity_id: str) -> dict:
    return {"id": f"T{n}", "entityId": entity_id}


def _watch_pages() -> dict:
    return {
        "schemaVersion": 1,
        "pages": [
            {"id": SYSTEM, "name": "Settings", "isSystemPage": True, "items": []},
            {
                "id": HOME,
                "name": "Home",
                "items": [_tile(1, f"page.{LIGHTS}"), _tile(2, f"status_page.{DOORS}")],
            },
            {"id": LIGHTS, "name": "Lights", "isHidden": True, "items": [_tile(1, "light.a")]},
            {"id": SOLO, "name": "Solo", "items": []},
        ],
    }


def _watch_status() -> dict:
    return {"schemaVersion": 1, "statusPages": [{"id": DOORS, "name": "Doors", "rows": []}]}


@pytest.fixture
def env():
    with _loaded_module() as mod:
        # The watches whose iPhone may still move their own setup here; a
        # test adds one to wait.
        awaiting: set[str] = set()
        store = mod.WatchConfigStore(
            _Hass(),
            is_paired=lambda owner: owner in {WATCH, WATCH_2},
            is_iphone=lambda owner: owner == PHONE,
            may_await_move=lambda owner: owner in awaiting,
        )
        asyncio.run(store.async_load())
        changes: list[tuple[str, str]] = []
        store.async_add_listener(lambda c: changes.append((c.owner_watch_id, c.kind)))
        store.panel_save(WATCH, "pages", _watch_pages(), base_revision=0)
        store.panel_save(WATCH, "status_pages", _watch_status(), base_revision=0)
        changes.clear()
        yield types.SimpleNamespace(store=store, mod=mod, changes=changes, awaiting=awaiting)


def _doc(env, owner: str, kind: str = "pages") -> dict:
    record = env.store.get(owner, kind)
    return copy.deepcopy(record.document) if record is not None else None


def _save(env, owner: str, document: dict, kind: str = "pages"):
    record = env.store.get(owner, kind)
    return env.store.panel_save(
        owner, kind, document, base_revision=record.revision if record else 0
    )


def _page(document: dict, page_id: str) -> dict:
    return next(p for p in document["pages"] if p["id"] == page_id)


# ── link_pages ───────────────────────────────────────────────────────────


def test_link_brings_reached_pages_and_status_pages(env) -> None:
    result = env.store.link_pages(WATCH, [HOME], [PHONE])
    assert result["targets"] == {
        PHONE: {"pages": [HOME, LIGHTS], "status_pages": [DOORS], "adopted_status_pages": []}
    }
    assert set(result["link_ids"]) == {HOME, LIGHTS}
    phone = _doc(env, PHONE)
    assert [p["id"] for p in phone["pages"]] == [HOME, LIGHTS]
    assert _page(phone, LIGHTS)["isHidden"] is True
    watch = _doc(env, WATCH)
    for page_id, link in result["link_ids"].items():
        assert _page(watch, page_id)["linkId"] == link
        assert _page(phone, page_id)["linkId"] == link
    assert "linkId" not in _page(watch, SOLO)
    assert _doc(env, PHONE, "status_pages")["statusPages"][0]["linkId"]
    # The source gained links, then the phone's status pages before its pages.
    assert env.changes == [
        (WATCH, "status_pages"),
        (WATCH, "pages"),
        (PHONE, "status_pages"),
        (PHONE, "pages"),
    ]


def test_link_appends_after_the_targets_own_pages_and_relinking_adds_nothing(env) -> None:
    _save(env, PHONE, {"schemaVersion": 1, "pages": [{"id": PHONE_PAGE, "name": "Mine", "items": []}]})
    first = env.store.link_pages(WATCH, [SOLO], [PHONE])
    assert [p["id"] for p in _doc(env, PHONE)["pages"]] == [PHONE_PAGE, SOLO]
    env.changes.clear()
    again = env.store.link_pages(WATCH, [SOLO], [PHONE])
    assert again["targets"][PHONE] == {"pages": [], "status_pages": [], "adopted_status_pages": []}
    assert again["link_ids"] == first["link_ids"]
    assert env.changes == []


@pytest.mark.parametrize(
    ("source", "pages", "targets", "code"),
    [
        (WATCH, [HOME], ["stranger"], "unknown_device"),
        ("stranger", [HOME], [PHONE], "unknown_device"),
        (WATCH, ["missing"], [PHONE], "not_found"),
        (WATCH, [SYSTEM], [PHONE], "system_page"),
        (WATCH, [HOME], [WATCH], "invalid"),
        (WATCH, [], [PHONE], "invalid"),
    ],
)
def test_link_refusals_write_nothing(env, source, pages, targets, code) -> None:
    with pytest.raises(env.mod.WatchConfigStoreError) as err:
        env.store.link_pages(source, pages, targets)
    assert err.value.code == code
    assert env.changes == []


def test_a_status_page_link_links_the_status_pages_alone(env) -> None:
    status = _watch_status()
    status["statusPages"].append({"id": STARTER, "name": "Batteries", "rows": []})
    _save(env, WATCH, status, "status_pages")
    env.changes.clear()
    result = env.store.link_pages(WATCH, [STARTER, DOORS.lower()], [PHONE], kind="status_pages")
    assert result["targets"] == {
        PHONE: {"pages": [], "status_pages": [DOORS, STARTER], "adopted_status_pages": []}
    }
    held = _doc(env, WATCH, "status_pages")["statusPages"]
    assert result["link_ids"] == {DOORS: held[0]["linkId"], STARTER: held[1]["linkId"]}
    phone = _doc(env, PHONE, "status_pages")["statusPages"]
    assert [p["id"] for p in phone] == [DOORS, STARTER]
    assert [p["linkId"] for p in phone] == [p["linkId"] for p in held], "a starter links too"
    assert env.store.get(PHONE, "pages") is None, "nothing is walked"
    assert env.changes == [(WATCH, "status_pages"), (PHONE, "status_pages")]

    # The copies are kept in step from then on.
    status = _doc(env, PHONE, "status_pages")
    status["statusPages"][0]["name"] = "Front doors"
    _save(env, PHONE, status, "status_pages")
    assert _doc(env, WATCH, "status_pages")["statusPages"][0]["name"] == "Front doors"


def _with_starter(name: str, **extra) -> dict:
    status = _watch_status()
    status["statusPages"].append({"id": STARTER, "name": name, "rows": [], **extra})
    return status


def _own_starter(*others: dict, name: str = "Mine", **extra) -> dict:
    """A phone's first status pages: its own copy of the starter, differing
    from the watch's, and whatever else."""
    return {
        "schemaVersion": 1,
        "statusPages": [*others, {"id": STARTER, "name": name, "rows": [], **extra}],
    }


def _phone_status(env) -> list[dict]:
    return _doc(env, PHONE, "status_pages")["statusPages"]


def test_a_device_s_own_different_starter_arrives_under_an_id_of_its_own(env) -> None:
    """One id is one library item. A phone whose first status pages hold the
    starter's id with other content is holding another page: it gets a new
    id there, so the watch's starter is never overwritten by it, and a link
    of the watch's starter then adds it beside the phone's own."""
    _save(env, WATCH, _with_starter("Batteries", isSystemDefault=True), "status_pages")
    _save(
        env,
        PHONE,
        _own_starter({"id": PHONE_PAGE, "name": "Phone", "rows": []}, isHidden=True),
        "status_pages",
    )
    phone = _phone_status(env)
    assert [p["name"] for p in phone] == ["Phone", "Mine"]
    own = phone[1]["id"]
    assert own != STARTER and phone[1]["isHidden"] is True
    assert _doc(env, WATCH, "status_pages")["statusPages"][1]["name"] == "Batteries"
    env.changes.clear()

    result = env.store.link_pages(WATCH, [STARTER], [PHONE], kind="status_pages")
    assert result["targets"] == {
        PHONE: {"pages": [], "status_pages": [STARTER], "adopted_status_pages": []}
    }
    assert result["link_ids"] == {STARTER: STARTER}, "the token is the item's id"
    phone = _phone_status(env)
    assert [p["id"] for p in phone] == [PHONE_PAGE, own, STARTER]
    assert phone[2] == {
        "id": STARTER,
        "name": "Batteries",
        "rows": [],
        "isSystemDefault": True,
        "linkId": STARTER,
    }
    assert env.changes == [(WATCH, "status_pages"), (PHONE, "status_pages")]
    assert env.store.link_places()["status_pages"] == {STARTER: [PHONE, WATCH]}

    # One item from then on: an edit on either reaches both.
    watch = _doc(env, WATCH, "status_pages")
    watch["statusPages"][1]["name"] = "Power"
    _save(env, WATCH, watch, "status_pages")
    assert _phone_status(env)[2]["name"] == "Power"


def test_the_same_starter_on_two_devices_is_one_item(env) -> None:
    """A phone whose first status pages hold the starter exactly as the
    watch has it picks the same item: both records carry its link mark and
    an edit on either reaches both."""
    _save(env, WATCH, _with_starter("Batteries"), "status_pages")
    _save(env, PHONE, _own_starter(name="Batteries"), "status_pages")
    assert _phone_status(env)[0]["id"] == STARTER
    assert _phone_status(env)[0]["linkId"] == STARTER
    assert _doc(env, WATCH, "status_pages")["statusPages"][1]["linkId"] == STARTER
    phone = _doc(env, PHONE, "status_pages")
    phone["statusPages"][0]["name"] = "Power"
    _save(env, PHONE, phone, "status_pages")
    assert _doc(env, WATCH, "status_pages")["statusPages"][1]["name"] == "Power"


def test_forgetting_the_other_holder_drops_a_starters_link(env) -> None:
    _save(env, WATCH, _with_starter("Batteries"), "status_pages")
    _save(env, PHONE, _with_starter("Mine"), "status_pages")
    env.store.link_pages(WATCH, [STARTER], [PHONE], kind="status_pages")
    env.store.forget_owner(PHONE)
    held = _doc(env, WATCH, "status_pages")["statusPages"]
    assert held[1]["id"] == STARTER and "linkId" not in held[1]
    assert env.store.link_places()["status_pages"] == {}


def test_a_page_link_brings_the_starter_its_tile_opens(env) -> None:
    """A page whose tile opens a starter brings the starter along, beside a
    different starter of the phone's own (which has an id of its own)."""
    pages = _watch_pages()
    pages["pages"][3]["items"] = [_tile(1, f"status_page.{STARTER.lower()}")]
    _save(env, WATCH, pages)
    _save(env, WATCH, _with_starter("Batteries", isSystemDefault=True), "status_pages")
    _save(
        env,
        PHONE,
        _own_starter({"id": PHONE_PAGE, "name": "Phone", "rows": []}, isHidden=True),
        "status_pages",
    )
    own = _phone_status(env)[1]["id"]
    result = env.store.link_pages(WATCH, [SOLO], [PHONE])
    assert result["targets"][PHONE] == {
        "pages": [SOLO],
        "status_pages": [STARTER],
        "adopted_status_pages": [],
    }
    phone = _phone_status(env)
    assert [p["id"] for p in phone] == [PHONE_PAGE, own, STARTER]
    assert phone[2]["name"] == "Batteries" and phone[2]["linkId"] == STARTER


@pytest.mark.parametrize(
    ("ids", "kind", "code"),
    [
        ([HOME], "status_pages", "not_found"),
        ([DOORS], "menus", "invalid"),
        ([DOORS], "rooms", "invalid"),
    ],
)
def test_a_status_page_link_refuses_what_is_not_a_status_page(env, ids, kind, code) -> None:
    with pytest.raises(env.mod.WatchConfigStoreError) as err:
        env.store.link_pages(WATCH, ids, [PHONE], kind=kind)
    assert err.value.code == code
    assert env.changes == []


def test_another_page_under_a_taken_id_never_blocks_a_link(env) -> None:
    """There is no id_taken any more: a device's first page under an id the
    library holds with other content got an id of its own when it arrived,
    so a link of the watch's page simply adds it there too."""
    _save(env, WATCH_2, {"schemaVersion": 1, "pages": [{"id": LIGHTS, "name": "Other", "items": []}]})
    [other] = _doc(env, WATCH_2)["pages"]
    assert other["id"] != LIGHTS and other["name"] == "Other"
    assert _page(_doc(env, WATCH), LIGHTS)["name"] == "Lights"
    result = env.store.link_pages(WATCH, [HOME], [PHONE, WATCH_2])
    assert result["targets"][WATCH_2]["pages"] == [HOME, LIGHTS]
    assert [p["id"] for p in _doc(env, WATCH_2)["pages"]] == [other["id"], HOME, LIGHTS]


# ── a watch still waiting for its iPhone's move ──────────────────────────


def test_a_link_never_starts_the_pages_of_a_watch_awaiting_its_move(env) -> None:
    """The iPhone's move sends nothing over a record Home Assistant holds, so
    a pages record made by the link would cost the watch its own pages."""
    env.awaiting.add(WATCH_2)
    with pytest.raises(env.mod.WatchConfigLinkError) as err:
        env.store.link_pages(WATCH, [SOLO], [PHONE, WATCH_2])
    assert err.value.code == "awaiting_move"
    assert env.changes == []
    assert env.store.get(WATCH_2, "pages") is None
    assert env.store.get(PHONE, "pages") is None
    assert "linkId" not in _page(_doc(env, WATCH), SOLO)


def test_a_link_never_starts_the_status_pages_of_a_watch_awaiting_its_move(env) -> None:
    """The move came for the pages but not yet the status pages: a link that
    reaches a status page still waits."""
    env.awaiting.add(WATCH_2)
    _save(env, WATCH_2, {"schemaVersion": 1, "pages": [{"id": PHONE_PAGE, "name": "Own", "items": []}]})
    env.changes.clear()
    with pytest.raises(env.mod.WatchConfigLinkError) as err:
        env.store.link_pages(WATCH, [HOME], [WATCH_2])
    assert err.value.code == "awaiting_move"
    assert env.changes == []
    assert env.store.get(WATCH_2, "status_pages") is None


def test_once_the_move_came_a_link_onto_that_watch_goes_ahead(env) -> None:
    env.awaiting.add(WATCH_2)
    _save(env, WATCH_2, {"schemaVersion": 1, "pages": [{"id": PHONE_PAGE, "name": "Own", "items": []}]})
    result = env.store.link_pages(WATCH, [SOLO], [WATCH_2])
    assert result["targets"][WATCH_2]["pages"] == [SOLO]
    assert [p["id"] for p in _doc(env, WATCH_2)["pages"]] == [PHONE_PAGE, SOLO]


def test_a_link_with_nothing_to_write_onto_a_waiting_watch_is_no_refusal(env) -> None:
    """Only a write that would make the first record waits: a link the target
    already holds writes nothing there."""
    _save(env, WATCH_2, {"schemaVersion": 1, "pages": [{"id": PHONE_PAGE, "name": "Own", "items": []}]})
    env.store.link_pages(WATCH, [SOLO], [WATCH_2])
    env.awaiting.add(WATCH_2)
    again = env.store.link_pages(WATCH, [SOLO], [WATCH_2])
    assert again["targets"][WATCH_2] == {
        "pages": [],
        "status_pages": [],
        "adopted_status_pages": [],
    }


def test_link_device_onto_a_watch_awaiting_its_move_is_refused(env) -> None:
    env.awaiting.add(WATCH_2)
    _save(env, PHONE, {"schemaVersion": 1, "pages": [{"id": PHONE_PAGE, "name": "Mine", "items": []}]})
    env.changes.clear()
    with pytest.raises(env.mod.WatchConfigLinkError) as err:
        env.store.link_device(PHONE, WATCH_2, updated_by="panel")
    assert err.value.code == "awaiting_move"
    assert env.changes == []
    assert env.store.get(WATCH_2, "pages") is None


def test_link_device_copies_no_menus_onto_a_watch_awaiting_its_move(env) -> None:
    """The pages came over, the menus not yet: the move brings the watch's
    own menus, so the source's are not copied in their place."""
    menus = {"quickAction": {"slots": []}, "entityRadial": {}, "pageSwitcher": {}}
    _save(env, WATCH, menus, "menus")
    _save(env, WATCH_2, {"schemaVersion": 1, "pages": [{"id": PHONE_PAGE, "name": "Own", "items": []}]})
    _save(env, WATCH_2, {"schemaVersion": 1, "statusPages": []}, "status_pages")
    env.awaiting.add(WATCH_2)
    result = env.store.link_device(WATCH, WATCH_2, updated_by="panel")
    assert result["copied"] == []
    assert env.store.get(WATCH_2, "menus") is None
    assert set(result["link_ids"]) == {HOME, LIGHTS, SOLO}


# ── fan-out ──────────────────────────────────────────────────────────────


def test_a_watch_edit_reaches_the_phone_copy_keeping_its_place_and_hidden(env) -> None:
    env.store.link_pages(WATCH, [HOME], [PHONE])
    phone = _doc(env, PHONE)
    phone["pages"] = [phone["pages"][1], {"id": PHONE_PAGE, "name": "Mine", "items": []}, phone["pages"][0]]
    phone["pages"][0]["isHidden"] = False  # LIGHTS shown on the phone
    _save(env, PHONE, phone)
    env.changes.clear()

    watch = _doc(env, WATCH)
    _page(watch, HOME)["name"] = "Home renamed"
    _page(watch, LIGHTS)["items"].append(_tile(2, "light.b"))
    _page(watch, SOLO)["name"] = "Solo renamed"
    _save(env, WATCH, watch)

    phone = _doc(env, PHONE)
    assert [p["id"] for p in phone["pages"]] == [LIGHTS, PHONE_PAGE, HOME]
    assert _page(phone, HOME)["name"] == "Home renamed"
    assert len(_page(phone, LIGHTS)["items"]) == 2
    assert _page(phone, LIGHTS)["isHidden"] is False, "the phone's own isHidden stays"
    assert _page(_doc(env, WATCH), LIGHTS)["isHidden"] is True
    assert env.changes == [(WATCH, "pages"), (PHONE, "pages")], "one revision each, no echo"
    assert env.store.get(PHONE, "pages").updated_by == "panel"


def test_a_device_put_reaches_the_other_copy_too(env) -> None:
    env.store.link_pages(WATCH, [SOLO], [PHONE])
    record = env.store.get(PHONE, "pages")
    phone = copy.deepcopy(record.document)
    phone["pages"][0]["name"] = "From the phone"
    env.changes.clear()
    env.store.put(
        PHONE, "pages", phone, document_hash=HASH, base_revision=record.revision, updated_by=PHONE
    )
    assert _page(_doc(env, WATCH), SOLO)["name"] == "From the phone"
    assert env.store.get(WATCH, "pages").updated_by == PHONE
    assert env.changes == [(PHONE, "pages"), (WATCH, "pages")]


def test_an_unlinked_change_wakes_no_one_else(env) -> None:
    env.store.link_pages(WATCH, [SOLO], [PHONE])
    env.changes.clear()
    watch = _doc(env, WATCH)
    _page(watch, HOME)["name"] = "Only here"
    _page(watch, SOLO)["isHidden"] = True  # per device
    _save(env, WATCH, watch)
    assert env.changes == [(WATCH, "pages")]
    assert "isHidden" not in _page(_doc(env, PHONE), SOLO)


def test_a_status_page_edit_reaches_its_copies(env) -> None:
    env.store.link_pages(WATCH, [HOME], [PHONE])
    status = _doc(env, WATCH, "status_pages")
    status["statusPages"][0]["name"] = "Front doors"
    env.changes.clear()
    _save(env, WATCH, status, "status_pages")
    assert _doc(env, PHONE, "status_pages")["statusPages"][0]["name"] == "Front doors"
    assert env.changes == [(WATCH, "status_pages"), (PHONE, "status_pages")]


def test_a_restore_fans_out(env) -> None:
    env.store.link_pages(WATCH, [SOLO], [PHONE])
    watch = _doc(env, WATCH)
    linked_revision = env.store.get(WATCH, "pages").revision
    _page(watch, SOLO)["name"] = "Renamed"
    _save(env, WATCH, watch)
    assert _page(_doc(env, PHONE), SOLO)["name"] == "Renamed"
    env.store.restore(
        WATCH, "pages", linked_revision, base_revision=env.store.get(WATCH, "pages").revision
    )
    assert _page(_doc(env, PHONE), SOLO)["name"] == "Solo"


def test_removing_a_copy_drops_the_link_on_the_last_one(env) -> None:
    env.store.link_pages(WATCH, [SOLO], [PHONE])
    phone = _doc(env, PHONE)
    phone["pages"] = []
    env.changes.clear()
    _save(env, PHONE, phone)
    assert "linkId" not in _page(_doc(env, WATCH), SOLO)
    assert _page(_doc(env, WATCH), SOLO)["name"] == "Solo", "the page itself stays"
    assert env.changes == [(PHONE, "pages"), (WATCH, "pages")]


def test_removing_one_of_three_copies_keeps_the_link(env) -> None:
    env.store.link_pages(WATCH, [SOLO], [PHONE, WATCH_2])
    link = _page(_doc(env, WATCH), SOLO)["linkId"]
    phone = _doc(env, PHONE)
    phone["pages"] = []
    env.changes.clear()
    _save(env, PHONE, phone)
    assert _page(_doc(env, WATCH), SOLO)["linkId"] == link
    assert _page(_doc(env, WATCH_2), SOLO)["linkId"] == link
    assert env.changes == [(PHONE, "pages")]


def test_forgetting_one_of_two_holders_drops_the_link_on_the_other(env) -> None:
    env.store.link_pages(WATCH, [HOME], [PHONE])
    revision = env.store.get(WATCH, "pages").revision
    status_revision = env.store.get(WATCH, "status_pages").revision
    env.changes.clear()
    assert env.store.forget_owner(PHONE) is True
    watch = _doc(env, WATCH)
    assert all("linkId" not in page for page in watch["pages"])
    assert [p["id"] for p in watch["pages"]] == [SYSTEM, HOME, LIGHTS, SOLO], "the pages stay"
    assert "linkId" not in _doc(env, WATCH, "status_pages")["statusPages"][0]
    assert env.store.get(WATCH, "pages").revision > revision
    assert env.store.get(WATCH, "status_pages").revision > status_revision
    assert env.store.get(WATCH, "pages").updated_by == f"forget:{PHONE}"
    # The forget's own revision-0 announcements, then one write per kind,
    # status pages before the pages whose tiles open them.
    assert env.changes == [
        (PHONE, "pages"),
        (PHONE, "status_pages"),
        (WATCH, "status_pages"),
        (WATCH, "pages"),
    ]
    assert env.store.link_places() == {
        "pages": {},
        "status_pages": {},
        "menus": {},
        "voice": {},
    }


def test_forgetting_one_of_three_holders_keeps_the_link(env) -> None:
    env.store.link_pages(WATCH, [SOLO], [PHONE, WATCH_2])
    link = _page(_doc(env, WATCH), SOLO)["linkId"]
    env.changes.clear()
    env.store.forget_owner(PHONE)
    assert _page(_doc(env, WATCH), SOLO)["linkId"] == link
    assert _page(_doc(env, WATCH_2), SOLO)["linkId"] == link
    assert env.changes == [(PHONE, "pages")]


def test_a_copy_over_its_cap_is_left_and_the_save_stands(env, monkeypatch) -> None:
    env.store.link_pages(WATCH, [SOLO], [PHONE])
    watch = _doc(env, WATCH)
    _page(watch, SOLO)["name"] = "Bigger"
    real = env.mod.validate_document

    def capped(kind, document, **kwargs):
        if document is not None and any(
            p.get("id") == SOLO and p.get("name") == "Bigger" for p in document.get("pages", [])
        ) and not kwargs.get("check_items"):
            raise env.mod.WatchConfigValidationError("too big")
        return real(kind, document, **kwargs)

    monkeypatch.setattr(env.mod, "validate_document", capped)
    env.changes.clear()
    _save(env, WATCH, watch)
    assert env.changes == [(WATCH, "pages")]
    assert _page(_doc(env, PHONE), SOLO)["name"] == "Solo"


def test_a_save_or_restore_names_the_copies_it_could_not_keep_in_step(env, monkeypatch) -> None:
    env.store.link_pages(WATCH, [SOLO], [PHONE, WATCH_2])
    real = env.mod.validate_document

    def capped(kind, document, **kwargs):
        # Only the phone's copy is over its cap once it takes the new name.
        if (
            document is not None
            and not kwargs.get("check_items")
            and any(p.get("id") == PHONE_PAGE for p in document.get("pages", []))
            and any(p.get("name") == "Bigger" for p in document.get("pages", []))
        ):
            raise env.mod.WatchConfigValidationError("too big")
        return real(kind, document, **kwargs)

    phone = _doc(env, PHONE)
    phone["pages"].insert(0, {"id": PHONE_PAGE, "name": "Mine", "items": []})
    _save(env, PHONE, phone)
    monkeypatch.setattr(env.mod, "validate_document", capped)
    watch = _doc(env, WATCH)
    _page(watch, SOLO)["name"] = "Bigger"
    failed: list[str] = []
    bigger = env.store.panel_save(
        WATCH, "pages", watch, base_revision=env.store.get(WATCH, "pages").revision,
        link_failures=failed,
    ).revision
    assert failed == [PHONE]
    assert _page(_doc(env, WATCH_2), SOLO)["name"] == "Bigger"
    assert _page(_doc(env, PHONE), SOLO)["name"] == "Solo"

    # A copy that takes the change is no failure.
    watch = copy.deepcopy(watch)
    _page(watch, SOLO)["name"] = "Back"
    failed = []
    back = env.store.panel_save(WATCH, "pages", watch, base_revision=bigger, link_failures=failed)
    assert failed == []
    assert _page(_doc(env, PHONE), SOLO)["name"] == "Back"

    failed_restore: list[str] = []
    env.store.restore(
        WATCH, "pages", bigger, base_revision=back.revision, link_failures=failed_restore
    )
    assert failed_restore == [PHONE]
    assert _page(_doc(env, WATCH), SOLO)["name"] == "Bigger"
    assert _page(_doc(env, PHONE), SOLO)["name"] == "Back"


# ── link_device and places ───────────────────────────────────────────────


def test_link_device_gives_every_page_the_menus_and_the_rooms_once(env) -> None:
    """Add all: the target picks every page and status page of the source,
    and, having none of its own, uses the source's menus (one menu on both
    from then on, so its record carries the link marks) and is given its
    rooms."""
    menus = {"quickAction": {"slots": []}, "entityRadial": {}, "pageSwitcher": {}}
    _save(env, WATCH, menus, "menus")
    _save(env, WATCH, {"roomAutoSwitchEnabled": True, "hapticsEnabled": False}, "behavior")
    env.changes.clear()
    result = env.store.link_device(WATCH, PHONE, updated_by=PHONE)
    assert set(result["link_ids"]) == {HOME, LIGHTS, SOLO}
    assert result["copied"] == ["menus", "rooms"]
    assert [p["id"] for p in _doc(env, PHONE)["pages"]] == [HOME, LIGHTS, SOLO]
    phone_menus = _doc(env, PHONE, "menus")
    assert {k: v for k, v in phone_menus.items() if k != "linkIds"} == menus
    assert phone_menus["linkIds"] == _doc(env, WATCH, "menus")["linkIds"]
    assert set(phone_menus["linkIds"]) == {"anywhere", "entity"}
    assert _doc(env, PHONE, "rooms") == {"schemaVersion": 1, "roomAutoSwitchEnabled": True}
    assert env.store.get(PHONE, "menus").updated_by == PHONE

    # The panel's Unlink of both units: the phone's menus become its own.
    mine = {"quickAction": {"slots": []}, "entityRadial": {"x": 1}, "pageSwitcher": {}}
    _save(env, PHONE, mine, "menus")
    assert _doc(env, PHONE, "menus") == mine
    assert _doc(env, WATCH, "menus") == menus, "the watch's menus never moved"
    again = env.store.link_device(WATCH, PHONE, updated_by=PHONE)
    assert again["copied"] == []
    assert _doc(env, PHONE, "menus") == mine


def test_link_device_adds_the_starters_beside_the_targets_own(env) -> None:
    """Add all on a target whose own starter differs: that one arrived under
    an id of its own, so the source's starter is added beside it, and the
    target's other status pages stay its own."""
    _save(env, WATCH, _with_starter("Batteries", isSystemDefault=True), "status_pages")
    _save(
        env,
        PHONE,
        _own_starter({"id": PHONE_PAGE, "name": "Phone", "rows": []}, isSystemDefault=True),
        "status_pages",
    )
    own = _phone_status(env)[1]["id"]
    first = env.store.link_device(WATCH, PHONE, updated_by=PHONE)
    assert first["targets"][PHONE]["status_pages"] == [DOORS, STARTER]
    assert first["targets"][PHONE]["adopted_status_pages"] == []
    phone = _phone_status(env)
    assert [p["id"] for p in phone] == [PHONE_PAGE, own, DOORS, STARTER]
    assert "linkId" not in phone[0] and "linkId" not in phone[1]
    assert [p["linkId"] for p in phone[2:]] == [DOORS, STARTER]
    again = env.store.link_device(WATCH, PHONE, updated_by=PHONE)
    assert again["targets"][PHONE]["status_pages"] == []


def test_link_device_keeps_the_hidden_marks_of_the_source(env) -> None:
    """A page hidden on the source is hidden on the target too, as a link
    has always brought it; the target may show it from then on alone."""
    env.store.link_device(WATCH, PHONE, updated_by=PHONE)
    assert _page(_doc(env, PHONE), LIGHTS)["isHidden"] is True
    phone = _doc(env, PHONE)
    _page(phone, LIGHTS)["isHidden"] = False
    _save(env, PHONE, phone)
    assert _page(_doc(env, WATCH), LIGHTS)["isHidden"] is True


def test_link_places_names_every_holder(env) -> None:
    result = env.store.link_pages(WATCH, [SOLO], [PHONE, WATCH_2])
    places = env.store.link_places()
    assert places["pages"] == {result["link_ids"][SOLO]: sorted([PHONE, WATCH, WATCH_2])}
    assert places["status_pages"] == {}
