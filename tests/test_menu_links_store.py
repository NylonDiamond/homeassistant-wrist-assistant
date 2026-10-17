"""In-process tests for linked menus in ``WatchConfigStore``.

The same store and fixture as ``test_page_links_store.py``. A menus link
(``link_units``) puts one unit of the menus (the Anywhere menu with the page
switcher, or the Entity quick menu) on several owners under one id in a
top-level ``linkIds``, and brings the pages and status pages its slots open.
Every accepted write of ``menus`` is then handed on to each other owner
holding one of its units' links; a link left on one owner only is dropped
there.
"""

from __future__ import annotations

import copy

import pytest

from test_page_links_store import (  # noqa: F401 (env is a fixture)
    DOORS,
    HASH,
    HOME,
    LIGHTS,
    PHONE,
    SOLO,
    STARTER,
    SYSTEM,
    WATCH,
    WATCH_2,
    _doc,
    _save,
    env,
)

WATCH_3 = "watch-C"


@pytest.fixture
def ctx(env):  # noqa: F811 (the imported fixture)
    return env


def _slot(n: int, action: dict) -> dict:
    return {"id": f"S{n}", "action": action, "isVisible": True, "position": "topLeft"}


def _menus(beam: str = "auroraWash", light: bool = True) -> dict:
    return {
        "entityRadial": {
            "allSlots": [_slot(1, {"type": "assist"})],
            "lightInheritsAll": light,
            "lightSlots": [_slot(2, {"type": "navigateToPage", "pageId": SOLO})],
            "schemaVersion": 1,
        },
        "pageSwitcher": {"displayMode": "icon", "schemaVersion": 1},
        "quickAction": {
            "beamStyle": beam,
            "schemaVersion": 1,
            "slots": [
                _slot(1, {"type": "navigateToPage", "pageId": HOME}),
                _slot(2, {"type": "showStatusPage", "pageId": DOORS}),
                _slot(3, {"type": "navigateToPage", "pageId": SYSTEM}),
                _slot(4, {"type": "navigateToPage", "pageId": "gone"}),
                _slot(5, {"type": "speakPhrase", "phraseId": "P1"}),
            ],
        },
        "schemaVersion": 1,
    }


def _menus_record(ctx) -> None:
    _save(ctx, WATCH, _menus(), "menus")
    ctx.changes.clear()


def _link(ctx, units, targets, **kwargs):
    return ctx.store.link_units("menus", WATCH, units, targets, **kwargs)


# ── link_units ───────────────────────────────────────────────────────────


def test_a_menu_link_onto_a_device_with_none_copies_the_menus_and_its_pages(ctx) -> None:
    _menus_record(ctx)
    result = _link(ctx, ["anywhere"], [PHONE])
    link = result["link_ids"]["anywhere"]
    assert result == {
        "targets": {
            PHONE: {
                "pages": [HOME, LIGHTS],
                "status_pages": [DOORS],
                "adopted_status_pages": [],
                "units": ["anywhere"],
            }
        },
        "link_ids": {"anywhere": link},
    }
    watch = _doc(ctx, WATCH, "menus")
    phone = _doc(ctx, PHONE, "menus")
    assert watch["linkIds"] == {"anywhere": link} == phone["linkIds"]
    assert {k: v for k, v in phone.items() if k != "linkIds"} == _menus()
    assert list(phone) == sorted(phone)
    # The pages its slots open came along, linked; the system page, the
    # missing page and the phrase did not.
    assert [p["id"] for p in _doc(ctx, PHONE)["pages"]] == [HOME, LIGHTS]
    assert _doc(ctx, PHONE)["pages"][0]["linkId"]
    assert _doc(ctx, PHONE, "status_pages")["statusPages"][0]["linkId"]
    # What a slot opens is written before the slot.
    assert ctx.changes == [
        (WATCH, "status_pages"),
        (WATCH, "pages"),
        (PHONE, "status_pages"),
        (PHONE, "pages"),
        (WATCH, "menus"),
        (PHONE, "menus"),
    ]


def test_the_entity_menu_brings_only_its_own_slots_pages(ctx) -> None:
    _menus_record(ctx)
    result = _link(ctx, ["entity"], [PHONE])
    assert result["targets"][PHONE] == {
        "pages": [SOLO],
        "status_pages": [],
        "adopted_status_pages": [],
        "units": ["entity"],
    }
    assert _doc(ctx, PHONE, "menus")["linkIds"] == {"entity": result["link_ids"]["entity"]}


def _starter_status(name: str, *others: dict) -> dict:
    return {
        "schemaVersion": 1,
        "statusPages": [*others, {"id": STARTER, "name": name, "rows": [], "isSystemDefault": True}],
    }


def test_a_menu_slot_that_opens_a_starter_links_the_targets_own_copy(ctx) -> None:
    """A Status page slot that opens a starter status page links it to the
    target like any status page, adopting the copy the target already has."""
    _save(ctx, WATCH, _starter_status("Batteries", {"id": DOORS, "name": "Doors", "rows": []}),
          "status_pages")
    _save(ctx, PHONE, _starter_status("Mine"), "status_pages")
    menus = _menus()
    menus["entityRadial"]["allSlots"].append(
        _slot(9, {"type": "showStatusPage", "pageId": STARTER})
    )
    _save(ctx, WATCH, menus, "menus")
    ctx.changes.clear()
    result = _link(ctx, ["entity"], [PHONE])
    assert result["targets"][PHONE]["status_pages"] == [], "adopted, not added"
    assert result["targets"][PHONE]["adopted_status_pages"] == [STARTER]
    watch = _doc(ctx, WATCH, "status_pages")["statusPages"]
    phone = _doc(ctx, PHONE, "status_pages")["statusPages"]
    assert [p["id"] for p in phone] == [STARTER]
    assert phone[0]["name"] == "Batteries"
    assert phone[0]["linkId"] == watch[1]["linkId"]
    assert "linkId" not in watch[0], "the Doors page its slots never open stays unlinked"


def test_a_target_with_its_own_menu_is_refused_unless_replaced(ctx) -> None:
    _menus_record(ctx)
    _save(ctx, WATCH_2, _menus(beam="none", light=False), "menus")
    ctx.changes.clear()
    with pytest.raises(ctx.mod.WatchConfigLinkError) as err:
        _link(ctx, ["anywhere"], [PHONE, WATCH_2])
    assert err.value.code == "unit_taken"
    assert ctx.changes == [], "checked whole first: the phone got nothing either"
    assert ctx.store.get(PHONE, "menus") is None

    result = _link(ctx, ["anywhere"], [WATCH_2], replace=True)
    assert result["targets"][WATCH_2]["units"] == ["anywhere"]
    watch_2 = _doc(ctx, WATCH_2, "menus")
    assert watch_2["quickAction"]["beamStyle"] == "auroraWash"
    assert watch_2["entityRadial"]["lightInheritsAll"] is False, "the other unit stays its own"


def test_relinking_writes_nothing(ctx) -> None:
    _menus_record(ctx)
    first = _link(ctx, ["anywhere", "entity"], [PHONE])
    ctx.changes.clear()
    again = _link(ctx, ["entity", "anywhere"], [PHONE])
    assert again["link_ids"] == first["link_ids"]
    assert again["targets"][PHONE] == {
        "pages": [],
        "status_pages": [],
        "adopted_status_pages": [],
        "units": [],
    }
    assert ctx.changes == []


@pytest.mark.parametrize(
    ("kind", "units", "targets", "code"),
    [
        ("menus", ["both"], [PHONE], "invalid"),
        ("menus", [], [PHONE], "invalid"),
        ("menus", "anywhere", [PHONE], "invalid"),
        ("pages", ["anywhere"], [PHONE], "invalid"),
        ("menus", ["anywhere"], [WATCH], "invalid"),
        ("menus", ["anywhere"], ["stranger"], "unknown_device"),
    ],
)
def test_menu_link_refusals_write_nothing(ctx, kind, units, targets, code) -> None:
    _menus_record(ctx)
    with pytest.raises(ctx.mod.WatchConfigStoreError) as err:
        ctx.store.link_units(kind, WATCH, units, targets)
    assert err.value.code == code
    assert ctx.changes == []


def test_a_source_with_no_menus_is_not_found(ctx) -> None:
    with pytest.raises(ctx.mod.WatchConfigLinkError) as err:
        _link(ctx, ["anywhere"], [PHONE])
    assert err.value.code == "not_found"


def test_a_menu_link_never_starts_the_menus_of_a_watch_awaiting_its_move(ctx) -> None:
    _menus_record(ctx)
    _save(ctx, WATCH_2, {"schemaVersion": 1, "pages": []})
    _save(ctx, WATCH_2, {"schemaVersion": 1, "statusPages": []}, "status_pages")
    ctx.awaiting.add(WATCH_2)
    ctx.changes.clear()
    with pytest.raises(ctx.mod.WatchConfigLinkError) as err:
        _link(ctx, ["entity"], [WATCH_2])
    assert err.value.code == "awaiting_move"
    assert ctx.changes == []
    assert ctx.store.get(WATCH_2, "menus") is None


def test_the_target_check_is_the_phone_kinds_table(ctx) -> None:
    """An iPhone owns its menus, so it is a target; a unit kind it may not
    own (the voice settings) is refused for it with no code of its own."""
    with pytest.raises(ctx.mod.WatchConfigPhoneKindError):
        ctx.store.link_units("voice", WATCH, ["phrases"], [PHONE])


# ── fan-out ──────────────────────────────────────────────────────────────


def _linked(ctx, units=("anywhere",), targets=(PHONE,)) -> dict:
    _menus_record(ctx)
    result = _link(ctx, list(units), list(targets))
    ctx.changes.clear()
    return result


def test_a_linked_unit_edit_reaches_the_copy_and_an_unlinked_one_does_not(ctx) -> None:
    _linked(ctx)
    watch = _doc(ctx, WATCH, "menus")
    watch["quickAction"]["beamStyle"] = "ripplePulse"
    watch["pageSwitcher"]["displayMode"] = "name"
    _save(ctx, WATCH, watch, "menus")
    phone = _doc(ctx, PHONE, "menus")
    assert phone["quickAction"]["beamStyle"] == "ripplePulse"
    assert phone["pageSwitcher"]["displayMode"] == "name", "the switcher goes with it"
    assert ctx.changes == [(WATCH, "menus"), (PHONE, "menus")], "one revision each"
    assert ctx.store.get(PHONE, "menus").updated_by == "panel"

    watch = _doc(ctx, WATCH, "menus")
    watch["entityRadial"]["lightInheritsAll"] = False
    ctx.changes.clear()
    _save(ctx, WATCH, watch, "menus")
    assert ctx.changes == [(WATCH, "menus")]
    assert _doc(ctx, PHONE, "menus")["entityRadial"]["lightInheritsAll"] is True


def test_a_slot_added_to_a_linked_menu_brings_its_page_along(ctx) -> None:
    """A Go to page slot added after the link opens a page the other device
    lacks: the page comes along, linked, before the menu that opens it."""
    _linked(ctx)
    assert SOLO not in [p["id"] for p in _doc(ctx, PHONE)["pages"]]
    watch = _doc(ctx, WATCH, "menus")
    watch["quickAction"]["slots"].append(_slot(6, {"type": "navigateToPage", "pageId": SOLO}))
    _save(ctx, WATCH, watch, "menus")
    phone_pages = _doc(ctx, PHONE)["pages"]
    assert [p["id"] for p in phone_pages] == [HOME, LIGHTS, SOLO]
    solo = next(p for p in _doc(ctx, WATCH)["pages"] if p["id"] == SOLO)
    assert phone_pages[-1]["linkId"] == solo["linkId"]
    assert ctx.changes == [(WATCH, "menus"), (WATCH, "pages"), (PHONE, "pages"), (PHONE, "menus")]
    assert _doc(ctx, PHONE, "menus")["quickAction"]["slots"][-1]["action"]["pageId"] == SOLO

    # A slot the menu already had brings nothing again, even once the page
    # was taken off the other device: it was its own choice there.
    phone = _doc(ctx, PHONE)
    phone["pages"] = [p for p in phone["pages"] if p["id"] != SOLO]
    _save(ctx, PHONE, phone)
    watch = _doc(ctx, WATCH, "menus")
    watch["quickAction"]["beamStyle"] = "ripplePulse"
    ctx.changes.clear()
    _save(ctx, WATCH, watch, "menus")
    assert ctx.changes == [(WATCH, "menus"), (PHONE, "menus")]


def test_a_slot_added_to_a_linked_menu_links_a_starter_onto_the_other(ctx) -> None:
    """A Status page slot added after the link that opens a starter links
    that starter onto the other device, adopting its own copy there."""
    _save(ctx, WATCH, _starter_status("Batteries", {"id": DOORS, "name": "Doors", "rows": []}),
          "status_pages")
    _linked(ctx)
    phone = _doc(ctx, PHONE, "status_pages")
    phone["statusPages"].append({"id": STARTER, "name": "Mine", "rows": [], "isHidden": True})
    _save(ctx, PHONE, phone, "status_pages")
    ctx.changes.clear()
    watch = _doc(ctx, WATCH, "menus")
    watch["quickAction"]["slots"].append(_slot(6, {"type": "showStatusPage", "pageId": STARTER}))
    _save(ctx, WATCH, watch, "menus")
    starter = _doc(ctx, WATCH, "status_pages")["statusPages"][1]
    held = _doc(ctx, PHONE, "status_pages")["statusPages"]
    assert [p["id"] for p in held] == [DOORS, STARTER]
    assert held[1]["linkId"] == starter["linkId"]
    assert held[1]["name"] == "Batteries" and held[1]["isHidden"] is True
    assert ctx.changes == [
        (WATCH, "menus"),
        (WATCH, "status_pages"),
        (PHONE, "status_pages"),
        (PHONE, "menus"),
    ]


def test_a_slot_whose_page_the_other_device_cannot_take_still_fans_out(ctx) -> None:
    _linked(ctx)
    phone = _doc(ctx, PHONE)
    phone["pages"].append({"id": SOLO, "name": "Phone's own", "items": []})
    _save(ctx, PHONE, phone)
    ctx.changes.clear()
    watch = _doc(ctx, WATCH, "menus")
    watch["quickAction"]["slots"].append(_slot(6, {"type": "navigateToPage", "pageId": SOLO}))
    _save(ctx, WATCH, watch, "menus")
    assert ctx.changes == [(WATCH, "menus"), (PHONE, "menus")], "id_taken: the page stays"
    assert next(p for p in _doc(ctx, PHONE)["pages"] if p["id"] == SOLO)["name"] == "Phone's own"
    assert _doc(ctx, PHONE, "menus")["quickAction"]["slots"][-1]["action"]["pageId"] == SOLO


def test_a_device_put_and_a_restore_fan_out(ctx) -> None:
    _linked(ctx)
    record = ctx.store.get(PHONE, "menus")
    phone = copy.deepcopy(record.document)
    phone["quickAction"]["beamStyle"] = "none"
    ctx.store.put(
        PHONE, "menus", phone, document_hash=HASH, base_revision=record.revision, updated_by=PHONE
    )
    assert _doc(ctx, WATCH, "menus")["quickAction"]["beamStyle"] == "none"
    assert ctx.store.get(WATCH, "menus").updated_by == PHONE

    linked_revision = ctx.store.get(PHONE, "menus").history[0].revision
    ctx.store.restore(
        PHONE, "menus", linked_revision, base_revision=ctx.store.get(PHONE, "menus").revision
    )
    assert _doc(ctx, WATCH, "menus")["quickAction"]["beamStyle"] == "auroraWash"


def test_unlinking_one_of_two_drops_the_link_on_the_other(ctx) -> None:
    _linked(ctx, units=("anywhere", "entity"))
    phone = _doc(ctx, PHONE, "menus")
    phone["linkIds"] = {"entity": phone["linkIds"]["entity"]}
    _save(ctx, PHONE, phone, "menus")
    watch = _doc(ctx, WATCH, "menus")
    assert set(watch["linkIds"]) == {"entity"}
    assert ctx.changes == [(PHONE, "menus"), (WATCH, "menus")]


def test_forgetting_one_of_two_holders_drops_the_menu_link(ctx) -> None:
    _linked(ctx, units=("anywhere", "entity"))
    ctx.store.forget_owner(PHONE)
    assert "linkIds" not in _doc(ctx, WATCH, "menus")
    assert ctx.store.get(WATCH, "menus").updated_by == f"forget:{PHONE}"
    assert ctx.store.link_places()["menus"] == {}


def test_forgetting_one_of_three_holders_keeps_the_menu_link(ctx) -> None:
    result = _linked(ctx, targets=(PHONE, WATCH_2))
    link = result["link_ids"]["anywhere"]
    ctx.store.forget_owner(PHONE)
    assert _doc(ctx, WATCH, "menus")["linkIds"] == {"anywhere": link}
    assert _doc(ctx, WATCH_2, "menus")["linkIds"] == {"anywhere": link}


def test_a_replaced_link_left_on_one_owner_is_dropped_there(ctx) -> None:
    """The phone's Anywhere menu was linked to the watch; linking another
    watch's onto the phone leaves the first watch's link on it alone."""
    result = _linked(ctx)
    old = result["link_ids"]["anywhere"]
    third = _menus(beam="none")
    third["quickAction"]["slots"] = []
    ctx.store.panel_save(WATCH_2, "menus", third, base_revision=0)
    new = ctx.store.link_units("menus", WATCH_2, ["anywhere"], [PHONE], replace=True)
    link = new["link_ids"]["anywhere"]
    assert link != old
    assert _doc(ctx, PHONE, "menus")["linkIds"] == {"anywhere": link}
    assert _doc(ctx, PHONE, "menus")["quickAction"]["beamStyle"] == "none"
    assert "linkIds" not in _doc(ctx, WATCH, "menus"), "the old link had one copy left"
    assert _doc(ctx, WATCH, "menus")["quickAction"]["beamStyle"] == "auroraWash"


def test_a_move_carries_the_menu_link_to_the_new_id(ctx) -> None:
    result = _linked(ctx)
    link = result["link_ids"]["anywhere"]
    ctx.store.move_owner(WATCH, WATCH_3, updated_by="move")
    assert _doc(ctx, WATCH_3, "menus")["linkIds"] == {"anywhere": link}
    assert _doc(ctx, PHONE, "menus")["linkIds"] == {"anywhere": link}
    assert ctx.store.link_places()["menus"] == {
        link: {"unit": "anywhere", "owners": sorted([PHONE, WATCH_3])}
    }


def test_a_copy_over_its_cap_is_left_and_the_save_stands(ctx, monkeypatch) -> None:
    _linked(ctx)
    real = ctx.mod.validate_document

    def capped(kind, document, **kwargs):
        big = document.get("quickAction", {}).get("beamStyle") == "wakeWave"
        if kind == "menus" and big and not kwargs.get("check_items"):
            raise ctx.mod.WatchConfigValidationError("too big")
        return real(kind, document, **kwargs)

    monkeypatch.setattr(ctx.mod, "validate_document", capped)
    watch = _doc(ctx, WATCH, "menus")
    watch["quickAction"]["beamStyle"] = "wakeWave"
    failed: list[str] = []
    ctx.store.panel_save(
        WATCH, "menus", watch, base_revision=ctx.store.get(WATCH, "menus").revision,
        link_failures=failed,
    )
    assert failed == [PHONE]
    assert _doc(ctx, PHONE, "menus")["quickAction"]["beamStyle"] == "auroraWash"


# ── places and link_device ───────────────────────────────────────────────


def test_link_places_names_each_menu_links_unit_and_holders(ctx) -> None:
    result = _linked(ctx, units=("anywhere", "entity"), targets=(PHONE, WATCH_2))
    everyone = sorted([PHONE, WATCH, WATCH_2])
    assert ctx.store.link_places()["menus"] == {
        result["link_ids"]["anywhere"]: {"unit": "anywhere", "owners": everyone},
        result["link_ids"]["entity"]: {"unit": "entity", "owners": everyone},
    }


def test_link_device_copies_the_menus_without_their_links(ctx) -> None:
    _linked(ctx)
    result = ctx.store.link_device(WATCH, WATCH_2, updated_by="panel")
    assert result["copied"] == ["menus"]
    assert "linkIds" not in _doc(ctx, WATCH_2, "menus")
    assert set(ctx.store.link_places()["menus"].popitem()[1]["owners"]) == {PHONE, WATCH}
