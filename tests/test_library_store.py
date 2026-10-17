"""In-process tests for the library inside ``WatchConfigStore``.

The real store, loaded the way ``test_watch_config_store.py`` loads it, over
the stand-in ``Store`` that keeps every file in memory. ``library.py`` has
its own pure tests (``test_library.py``); here the store's side of it:

* the file ``wrist_assistant.library``: built once from the records at the
  first start (the migration), never built again, read back as written;
* every writer of a ``pages``, ``status_pages`` or ``menus`` record (a
  device put, a panel save, a restore, a forget, a move) mapping back into
  the library, and the records of the other devices it reaches written
  again;
* the store's library ops (``library_pick`` and the rest), which the
  ``library/*`` WebSocket commands call (``test_library_ws.py``).
"""

from __future__ import annotations

import asyncio
import copy
import types

import pytest

from test_watch_config_store import LIBRARY_KEY, _FakeStore, _Hass, _loaded_module

WATCH = "watch-A"
WATCH_2 = "watch-B"
WATCH_3 = "watch-C"
PHONE = "iphone:1"
HASH = "c" * 64
INDEX_KEY = "wrist_assistant.watch_config"

SYSTEM = "AAAAAAAA-0000-4000-8000-0000000000FF"
HOME = "AAAAAAAA-0000-4000-8000-000000000001"
LIGHTS = "AAAAAAAA-0000-4000-8000-000000000002"
SOLO = "AAAAAAAA-0000-4000-8000-000000000003"
DOORS = "BBBBBBBB-0000-4000-8000-000000000001"
STARTER = "00000000-0000-0000-0000-000000000001"
OLD_LINK = "3f0c5b2a9d1e4c7f8a6b0d2e4f6a8c0e"
NAMES = {WATCH: "Jesse's Apple Watch", WATCH_2: "Chen's Apple Watch", PHONE: "Jesse's iPhone"}


def _tile(n: int, entity_id: str) -> dict:
    return {"id": f"T{n}", "entityId": entity_id}


def _slot(n: int, action: dict) -> dict:
    return {"id": f"S{n}", "action": action, "isVisible": True, "position": "topLeft"}


def _pages(*, lights: str = "Lights", link: str | None = None) -> dict:
    lights_page = {"id": LIGHTS, "name": lights, "items": [_tile(1, "light.a")]}
    if link is not None:
        lights_page["linkId"] = link
    return {
        "schemaVersion": 1,
        "pages": [
            {"id": SYSTEM, "name": "Settings", "isSystemPage": True, "items": []},
            {
                "id": HOME,
                "name": "Home",
                "items": [_tile(1, f"page.{LIGHTS}"), _tile(2, f"status_page.{DOORS}")],
            },
            lights_page,
        ],
    }


def _status(name: str = "Doors", *, starter: str | None = None) -> dict:
    pages = [{"id": DOORS, "name": name, "rows": []}]
    if starter is not None:
        pages.append({"id": STARTER, "name": starter, "rows": [], "isSystemDefault": True})
    return {"schemaVersion": 1, "statusPages": pages}


def _menus(beam: str = "auroraWash") -> dict:
    return {
        "entityRadial": {"allSlots": [_slot(1, {"type": "assist"})], "schemaVersion": 1},
        "pageSwitcher": {"displayMode": "icon", "schemaVersion": 1},
        "quickAction": {
            "beamStyle": beam,
            "schemaVersion": 1,
            "slots": [
                _slot(1, {"type": "navigateToPage", "pageId": LIGHTS}),
                _slot(2, {"type": "showStatusPage", "pageId": DOORS}),
            ],
        },
        "schemaVersion": 1,
    }


def _record(revision: int, document: dict, digest: str = HASH) -> dict:
    return {
        "revision": revision,
        "hash": digest,
        "updated_at": "2026-10-01T00:00:00Z",
        "updated_by": "seed",
        "document": document,
    }


def _seed(mod, files: dict[str, dict[str, dict]]) -> None:
    """Records on disk as an older build left them: owner to kind to
    document, every record at revision 1."""
    _FakeStore.files[INDEX_KEY] = {"owners": sorted(files), "revision_floor": 10}
    for owner, kinds in files.items():
        _FakeStore.files[mod._owner_key(owner)] = {
            "owner_watch_id": owner,
            "records": {kind: _record(1, doc) for kind, doc in kinds.items()},
        }


class _Env(types.SimpleNamespace):
    def store_now(self, **kwargs):
        """A fresh store over the files as they stand (a restart)."""
        renamed: list[tuple[str, dict]] = self.renamed
        awaiting = self.awaiting
        store = self.mod.WatchConfigStore(
            _Hass(),
            is_paired=lambda owner: owner in {WATCH, WATCH_2, WATCH_3},
            is_iphone=lambda owner: owner == PHONE,
            may_await_move=lambda owner: owner in awaiting,
            device_name=NAMES.get,
            rename_pages=lambda owner, pages: renamed.append((owner, pages)),
            **kwargs,
        )
        asyncio.run(store.async_load())
        self.store = store
        self.changes.clear()
        store.async_add_listener(lambda c: self.changes.append((c.owner_watch_id, c.kind)))
        return store


@pytest.fixture
def env():
    with _loaded_module() as mod:
        yield _Env(mod=mod, renamed=[], awaiting=set(), changes=[], store=None)


def _doc(env, owner: str, kind: str = "pages") -> dict | None:
    record = env.store.get(owner, kind)
    return copy.deepcopy(record.document) if record is not None else None


def _save(env, owner: str, document: dict, kind: str = "pages"):
    record = env.store.get(owner, kind)
    return env.store.panel_save(owner, kind, document, base_revision=record.revision if record else 0)


def _ids(document: dict, key: str = "pages") -> list[str]:
    return [page["id"] for page in document[key]]


def _page(document: dict, page_id: str, key: str = "pages") -> dict:
    return next(page for page in document[key] if page["id"] == page_id)


# ── the migration ────────────────────────────────────────────────────────


def test_a_first_start_builds_the_library_from_the_records_and_writes_it(env) -> None:
    """Identical copies and linked copies become one item each; the records
    of linked pages trade the old token for the item's id, as one new
    revision; a record already in its library form is not written again."""
    _seed(
        env.mod,
        {
            WATCH: {"pages": _pages(link=OLD_LINK), "status_pages": _status(), "menus": _menus()},
            WATCH_2: {
                "pages": _pages(lights="Lights, theirs", link=OLD_LINK),
                "status_pages": _status(),
                "menus": _menus(),
            },
        },
    )
    store = env.store_now()
    summary = store.library_summary()
    assert sorted(summary["pages"]) == [HOME, LIGHTS]
    assert summary["pages"][LIGHTS]["item"]["name"] == "Lights", "the first device's copy"
    assert summary["pages"][HOME]["owners"] == [WATCH, WATCH_2]
    assert summary["status_pages"][DOORS]["owners"] == [WATCH, WATCH_2]
    [menu_a] = [m for m in summary["menus"].values() if m["kind"] == "anywhere"]
    assert menu_a["name"] == "Anywhere menu" and menu_a["owners"] == [WATCH, WATCH_2]
    assert SYSTEM not in summary["pages"], "a system page stays the device's own"

    watch = store.get(WATCH, "pages")
    assert watch.revision > 1 and watch.updated_by == "library"
    assert _page(watch.document, LIGHTS)["linkId"] == LIGHTS
    assert _page(watch.document, HOME)["linkId"] == HOME
    assert _page(store.get(WATCH_2, "pages").document, LIGHTS)["name"] == "Lights"
    assert LIBRARY_KEY in _FakeStore.files
    assert _FakeStore.files[LIBRARY_KEY]["hashes"][WATCH]["pages"] == watch.hash


def test_a_device_alone_is_left_exactly_as_it_was(env) -> None:
    _seed(env.mod, {WATCH: {"pages": _pages(), "status_pages": _status(), "menus": _menus()}})
    store = env.store_now()
    for kind, doc in (("pages", _pages()), ("status_pages", _status()), ("menus", _menus())):
        record = store.get(WATCH, kind)
        assert (record.revision, record.hash, record.document) == (1, HASH, doc)


def test_another_page_under_a_taken_id_gets_its_own_and_the_references_follow(env) -> None:
    """The second watch's Lights differs and is not linked: it becomes an
    item under a new id, and that watch's tiles, menu slots, rooms and
    complication taps that opened Lights open the new id."""
    rooms = {"schemaVersion": 1, "roomQuickJumpFallbackPageId": LIGHTS,
             "roomQuickJumpMappings": {"kitchen": LIGHTS}}
    _seed(
        env.mod,
        {
            WATCH: {"pages": _pages()},
            WATCH_2: {"pages": _pages(lights="Other lights"), "menus": _menus(), "rooms": rooms},
        },
    )
    store = env.store_now()
    pages = store.get(WATCH_2, "pages").document
    by_name = {page["name"]: page for page in pages["pages"]}
    new = by_name["Other lights"]["id"]
    assert new != LIGHTS
    # Home's tile now opens the new id, so the second watch's Home is no
    # longer the first watch's: it is another page, under an id of its own.
    home = by_name["Home"]
    assert home["id"] != HOME
    assert home["items"][0]["entityId"] == f"page.{new}"
    menus = store.get(WATCH_2, "menus").document
    assert menus["quickAction"]["slots"][0]["action"]["pageId"] == new
    assert store.get(WATCH_2, "rooms").document == {
        "schemaVersion": 1,
        "roomQuickJumpFallbackPageId": new,
        "roomQuickJumpMappings": {"kitchen": new},
    }
    assert env.renamed == [(WATCH_2, {LIGHTS: new, HOME: home["id"]})]
    # The first watch's records are untouched.
    assert store.get(WATCH, "pages").revision == 1
    assert _page(store.get(WATCH, "pages").document, LIGHTS)["name"] == "Lights"


def test_the_migration_never_runs_again_once_the_file_exists(env) -> None:
    _seed(env.mod, {WATCH: {"menus": _menus()}, WATCH_2: {"menus": _menus(beam="none")}})
    store = env.store_now()
    menus = store.library_summary()["menus"]
    assert sorted(m["name"] for m in menus.values() if m["kind"] == "anywhere") == [
        "Chen's Apple Watch's menu",
        "Jesse's Apple Watch's menu",
    ]
    [mine] = [i for i, m in menus.items() if m["kind"] == "anywhere" and m["owners"] == [WATCH]]
    store.library_rename_menu(mine, "Home menu")
    again = env.store_now()
    assert again.library_summary()["menus"][mine]["name"] == "Home menu"


def test_a_home_with_no_records_writes_no_library(env) -> None:
    env.store_now()
    assert LIBRARY_KEY not in _FakeStore.files
    assert _FakeStore.writes == []


def test_an_unreadable_library_refuses_the_library_kinds_only(env) -> None:
    store = env.store_now()
    store.put(WATCH, "pages", _pages(), document_hash=HASH, base_revision=0, updated_by=WATCH)
    _FakeStore.unreadable.add(LIBRARY_KEY)
    again = env.store_now()
    with pytest.raises(env.mod.WatchConfigUnavailableError):
        again.put(WATCH, "pages", _pages(lights="X"), document_hash=HASH, base_revision=1,
                  updated_by=WATCH)
    assert again.get(WATCH, "pages").revision == 1, "reads still work"
    again.put(WATCH, "behavior", {}, document_hash=HASH, base_revision=0, updated_by=WATCH)
    assert again.get(WATCH, "behavior").revision > 0


# ── the file, read back ──────────────────────────────────────────────────


def test_the_library_reads_back_as_it_was_written(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _pages())
    _save(env, WATCH, _status(), "status_pages")
    _save(env, WATCH, _menus(), "menus")
    store.link_device(WATCH, PHONE, updated_by="panel")
    before = store.library_summary()
    again = env.store_now()
    assert again.library_summary() == before
    assert again.get(PHONE, "pages").revision == store.get(PHONE, "pages").revision
    assert env.changes == [], "nothing to fold back in"


def test_a_record_changed_behind_the_library_s_back_is_folded_in_at_the_next_start(env) -> None:
    """A save by older code after a rollback: the record's hash is not the
    one the library noted, so the next start maps it back as that device's
    save, and the other device that picks the page is written again."""
    store = env.store_now()
    _save(env, WATCH, _pages())
    store.link_pages(WATCH, [LIGHTS], [WATCH_2])
    key = env.mod._owner_key(WATCH)
    on_disk = _FakeStore.files[key]["records"]["pages"]
    _page(on_disk["document"], LIGHTS)["name"] = "Lights, renamed by older code"
    on_disk["hash"] = "d" * 64
    again = env.store_now()
    assert _page(again.get(WATCH_2, "pages").document, LIGHTS)["name"] == (
        "Lights, renamed by older code"
    )
    assert again.library_summary()["pages"][LIGHTS]["item"]["name"] == (
        "Lights, renamed by older code"
    )


def test_a_device_forgotten_by_older_code_leaves_the_library_at_the_next_start(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _pages())
    store.link_pages(WATCH, [LIGHTS], [WATCH_2])
    # Older code forgot WATCH_2: its file and index entry are gone.
    _FakeStore.files.pop(env.mod._owner_key(WATCH_2))
    _FakeStore.files[INDEX_KEY]["owners"] = [WATCH]
    again = env.store_now()
    assert WATCH_2 not in again.library_summary()["picks"]
    assert "linkId" not in _page(again.get(WATCH, "pages").document, LIGHTS)


# ── every writer maps back ───────────────────────────────────────────────


def test_a_device_put_reaches_every_device_that_picked_the_page(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _pages())
    store.link_pages(WATCH, [LIGHTS], [PHONE, WATCH_2])
    record = store.get(PHONE, "pages")
    sent = copy.deepcopy(record.document)
    for page in sent["pages"]:
        page.pop("linkId", None)  # the app keeps no link marks
    _page(sent, LIGHTS)["name"] = "From the phone"
    env.changes.clear()
    put = store.put(PHONE, "pages", sent, document_hash=HASH, base_revision=record.revision,
                    updated_by=PHONE)
    assert _page(put.document, LIGHTS)["linkId"] == LIGHTS, "stored as the library builds it"
    assert put.hash != HASH, "so the hash is the server's"
    assert put.delivered_revision == put.revision
    for owner in (WATCH, WATCH_2):
        assert _page(_doc(env, owner), LIGHTS)["name"] == "From the phone"
        assert store.get(owner, "pages").updated_by == PHONE
    assert env.changes == [(PHONE, "pages"), (WATCH, "pages"), (WATCH_2, "pages")]


def test_a_put_kept_as_sent_keeps_the_client_s_hash(env) -> None:
    store = env.store_now()
    put = store.put(WATCH, "pages", _pages(), document_hash=HASH, base_revision=0,
                    updated_by=WATCH)
    assert (put.hash, put.document) == (HASH, _pages())


def test_a_panel_save_of_a_menu_reaches_every_device_using_it(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _menus(), "menus")
    store.link_units("menus", WATCH, ["anywhere", "entity"], [PHONE, WATCH_2])
    edited = _doc(env, WATCH_2, "menus")
    edited["quickAction"]["beamStyle"] = "ripplePulse"
    env.changes.clear()
    _save(env, WATCH_2, edited, "menus")
    for owner in (WATCH, PHONE):
        assert _doc(env, owner, "menus")["quickAction"]["beamStyle"] == "ripplePulse"
    # The saving device first, then the others in id order.
    assert env.changes == [(WATCH_2, "menus"), (PHONE, "menus"), (WATCH, "menus")]


def test_the_panel_s_menu_unlink_gives_the_device_its_own_copy(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _menus(), "menus")
    result = store.link_units("menus", WATCH, ["anywhere"], [PHONE])
    shared = result["link_ids"]["anywhere"]
    phone = _doc(env, PHONE, "menus")
    phone.pop("linkIds")
    phone["quickAction"]["beamStyle"] = "none"
    _save(env, PHONE, phone, "menus")
    assert "linkIds" not in _doc(env, PHONE, "menus")
    assert "linkIds" not in _doc(env, WATCH, "menus")
    assert _doc(env, WATCH, "menus")["quickAction"]["beamStyle"] == "auroraWash"
    menus = store.library_summary()["menus"]
    assert menus[shared]["owners"] == [WATCH]
    [copy_id] = [i for i, m in menus.items() if m["kind"] == "anywhere" and m["owners"] == [PHONE]]
    assert menus[copy_id]["name"] == "Jesse's iPhone's menu"


def test_a_device_put_without_link_ids_never_unlinks_a_menu(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _menus(), "menus")
    store.link_units("menus", WATCH, ["anywhere"], [PHONE])
    record = store.get(PHONE, "menus")
    sent = {k: v for k, v in record.document.items() if k != "linkIds"}
    sent["quickAction"] = {**sent["quickAction"], "beamStyle": "none"}
    store.put(PHONE, "menus", sent, document_hash=HASH, base_revision=record.revision,
              updated_by=PHONE)
    assert _doc(env, WATCH, "menus")["quickAction"]["beamStyle"] == "none"
    assert _doc(env, PHONE, "menus")["linkIds"] == _doc(env, WATCH, "menus")["linkIds"]


def test_a_restore_maps_back_as_a_save(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _pages())
    store.link_pages(WATCH, [LIGHTS], [PHONE])
    linked = store.get(PHONE, "pages").revision
    phone = _doc(env, PHONE)
    _page(phone, LIGHTS)["name"] = "Renamed"
    _save(env, PHONE, phone)
    assert _page(_doc(env, WATCH), LIGHTS)["name"] == "Renamed"
    store.restore(PHONE, "pages", linked, base_revision=store.get(PHONE, "pages").revision)
    assert _page(_doc(env, WATCH), LIGHTS)["name"] == "Lights"


def test_a_save_that_drops_a_page_drops_the_pick_and_keeps_the_item(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _pages())
    doc = _doc(env, WATCH)
    doc["pages"] = [p for p in doc["pages"] if p["id"] != LIGHTS]
    _save(env, WATCH, doc)
    summary = store.library_summary()
    assert summary["pages"][LIGHTS]["owners"] == []
    assert {"id": LIGHTS} not in summary["picks"][WATCH]["pages"]


def test_an_iphone_s_first_upload_forks_a_different_starter_and_follows_it(env) -> None:
    """The iPhone uploads a watch's kinds one after another, the first time.
    A starter that differs from the library's is another page, so it gets an
    id of its own, and the menus uploaded next, whose slot opens the
    starter's old id, open the new one."""
    store = env.store_now()
    _save(env, WATCH, _status(starter="Batteries"), "status_pages")
    store.put(PHONE, "status_pages", _status(starter="Mine"), document_hash=HASH,
              base_revision=0, updated_by=PHONE)
    phone = store.get(PHONE, "status_pages")
    [own] = [i for i in _ids(phone.document, "statusPages") if i not in (DOORS, STARTER)]
    assert phone.hash != HASH and phone.delivered_revision == 0, "the phone must pull it"
    assert _doc(env, WATCH, "status_pages")["statusPages"][1]["name"] == "Batteries"
    menus = _menus()
    menus["quickAction"]["slots"].append(_slot(3, {"type": "showStatusPage", "pageId": STARTER}))
    store.put(PHONE, "menus", menus, document_hash=HASH, base_revision=0, updated_by=PHONE)
    slots = store.get(PHONE, "menus").document["quickAction"]["slots"]
    assert slots[-1]["action"]["pageId"] == own


def test_a_save_over_its_cap_with_the_link_marks_is_refused_whole(env, monkeypatch) -> None:
    store = env.store_now()
    _save(env, WATCH, _pages())
    store.link_pages(WATCH, [LIGHTS], [PHONE])
    real = env.mod.validate_document

    def capped(kind, document, **kwargs):
        if kind == "pages" and any("linkId" in p and p.get("name") == "Big" for p in document["pages"]):
            raise env.mod.WatchConfigValidationError("too big")
        return real(kind, document, **kwargs)

    monkeypatch.setattr(env.mod, "validate_document", capped)
    doc = _doc(env, PHONE)
    _page(doc, LIGHTS)["name"] = "Big"
    for page in doc["pages"]:
        page.pop("linkId", None)
    revision = store.get(PHONE, "pages").revision
    with pytest.raises(env.mod.WatchConfigValidationError):
        store.put(PHONE, "pages", doc, document_hash=HASH, base_revision=revision, updated_by=PHONE)
    assert store.get(PHONE, "pages").revision == revision
    assert store.library_summary()["pages"][LIGHTS]["item"]["name"] == "Lights"


# ── forget and move ──────────────────────────────────────────────────────


def test_a_forget_drops_the_picks_and_keeps_the_items(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _pages())
    store.link_device(WATCH, PHONE, updated_by="panel")
    store.forget_owner(WATCH)
    summary = store.library_summary()
    assert WATCH not in summary["picks"]
    assert summary["pages"][HOME]["owners"] == [PHONE]
    assert "linkId" not in _page(_doc(env, PHONE), HOME)
    assert store.get(PHONE, "pages").updated_by == f"forget:{WATCH}"
    assert WATCH not in _FakeStore.files[LIBRARY_KEY]["hashes"]


def test_a_move_carries_the_picks_to_the_new_id(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _pages())
    _save(env, WATCH, _menus(), "menus")
    store.link_pages(WATCH, [LIGHTS], [PHONE])
    before = store.library_summary()["picks"][WATCH]
    store.move_owner(WATCH, WATCH_3, updated_by="move")
    summary = store.library_summary()
    assert WATCH not in summary["picks"]
    assert summary["picks"][WATCH_3] == before
    assert summary["pages"][LIGHTS]["owners"] == [PHONE, WATCH_3]
    assert _page(_doc(env, WATCH_3), LIGHTS)["linkId"] == LIGHTS
    assert _page(_doc(env, PHONE), LIGHTS)["linkId"] == LIGHTS


def test_a_move_onto_a_device_that_kept_its_own_drops_the_source_s_picks(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _pages())
    store.link_pages(WATCH, [LIGHTS], [WATCH_2])
    store.move_owner(WATCH, WATCH_2, updated_by="move")
    summary = store.library_summary()
    assert WATCH not in summary["picks"]
    assert summary["pages"][LIGHTS]["owners"] == [WATCH_2]
    assert "linkId" not in _page(_doc(env, WATCH_2), LIGHTS)


# ── the library's own ops ────────────────────────────────────────────────


def test_pick_puts_a_page_on_with_its_status_pages_and_takes_it_off(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _pages())
    _save(env, WATCH, _status(), "status_pages")
    _save(env, PHONE, {"schemaVersion": 1, "pages": []})
    result = store.library_pick(PHONE, "pages", HOME, on=True)
    assert _ids(_doc(env, PHONE)) == [HOME]
    assert _ids(_doc(env, PHONE, "status_pages"), "statusPages") == [DOORS], "its tile opens Doors"
    assert set(result["revisions"]) == {WATCH, PHONE}
    assert result["revisions"][PHONE]["pages"] == store.get(PHONE, "pages").revision
    store.library_pick(PHONE, "pages", HOME, on=False)
    assert _doc(env, PHONE)["pages"] == []
    assert "linkId" not in _page(_doc(env, WATCH), HOME)
    assert HOME in store.library_summary()["pages"], "the item stays"


def test_pick_of_a_menu_makes_it_the_device_s_menu(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _menus(), "menus")
    _save(env, PHONE, _menus(beam="none"), "menus")
    menus = store.library_summary()["menus"]
    [watch_menu] = [i for i, m in menus.items() if m["kind"] == "anywhere" and m["owners"] == [WATCH]]
    store.library_pick(PHONE, "menus", watch_menu, unit="anywhere")
    assert _doc(env, PHONE, "menus")["quickAction"]["beamStyle"] == "auroraWash"
    assert _doc(env, PHONE, "menus")["linkIds"] == {"anywhere": watch_menu}


@pytest.mark.parametrize(
    ("owner", "kind", "item", "extra", "code"),
    [
        (WATCH, "rooms", HOME, {"on": True}, "invalid"),
        (WATCH, "pages", HOME, {}, "invalid"),
        (WATCH, "pages", "missing", {"on": True}, "not_found"),
        ("stranger", "pages", HOME, {"on": True}, "unknown_device"),
        (WATCH, "menus", HOME, {"unit": "both"}, "invalid"),
        (WATCH, "menus", "missing", {"unit": "anywhere"}, "not_found"),
    ],
)
def test_pick_refusals_write_nothing(env, owner, kind, item, extra, code) -> None:
    env.store_now()
    _save(env, WATCH, _pages())
    env.changes.clear()
    with pytest.raises(env.mod.WatchConfigStoreError) as err:
        env.store.library_pick(owner, kind, item, **extra)
    assert err.value.code == code
    assert env.changes == []


def test_pick_never_starts_the_pages_of_a_watch_awaiting_its_move(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _pages())
    env.awaiting.add(WATCH_2)
    with pytest.raises(env.mod.WatchConfigLinkError) as err:
        store.library_pick(WATCH_2, "pages", LIGHTS, on=True)
    assert err.value.code == "awaiting_move"
    assert store.get(WATCH_2, "pages") is None


def test_copy_menu_gives_the_device_its_own_and_rename_names_it(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _menus(), "menus")
    store.link_units("menus", WATCH, ["anywhere"], [PHONE])
    result = store.library_copy_menu(PHONE, "anywhere", "Phone menu")
    assert "linkIds" not in _doc(env, PHONE, "menus")
    assert "linkIds" not in _doc(env, WATCH, "menus")
    assert store.library_summary()["menus"][result["id"]]["owners"] == [PHONE]
    store.library_rename_menu(result["id"], "Travel menu")
    assert store.library_summary()["menus"][result["id"]]["name"] == "Travel menu"
    with pytest.raises(env.mod.WatchConfigLinkError) as err:
        store.library_copy_menu(WATCH_2, "anywhere", "Nope")
    assert err.value.code == "not_found"
    with pytest.raises(env.mod.WatchConfigLinkError) as err:
        store.library_rename_menu(result["id"], "  ")
    assert err.value.code == "invalid"


def test_delete_removes_a_page_everywhere_with_its_slots_and_tiles(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _pages())
    _save(env, WATCH, _menus(), "menus")
    store.link_device(WATCH, PHONE, updated_by="panel")
    result = store.library_delete("pages", LIGHTS)
    for owner in (WATCH, PHONE):
        pages = _doc(env, owner)
        assert LIGHTS not in _ids(pages)
        assert [t["entityId"] for t in _page(pages, HOME)["items"]] == [f"status_page.{DOORS}"]
        slots = _doc(env, owner, "menus")["quickAction"]["slots"]
        assert [s["id"] for s in slots] == ["S2"]
    assert set(result["revisions"]) == {WATCH, PHONE}
    assert result["link_failures"] == []
    assert LIGHTS not in store.library_summary()["pages"]


def test_a_menu_in_use_is_not_deleted(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _menus(), "menus")
    menu_id = next(iter(store.library_summary()["menus"]))
    with pytest.raises(env.mod.WatchConfigLinkError) as err:
        store.library_delete("menus", menu_id)
    assert err.value.code == "in_use"


def test_the_photo_sweep_keeps_what_a_library_page_no_device_picks_names(env) -> None:
    store = env.store_now()
    pages = _pages()
    _page(pages, LIGHTS)["backgroundImageId"] = "photo-1"
    _save(env, WATCH, pages)
    doc = _doc(env, WATCH)
    doc["pages"] = [p for p in doc["pages"] if p["id"] != LIGHTS]
    _save(env, WATCH, doc)
    history, complete = store.page_photo_history()
    assert complete
    assert any(
        page.get("backgroundImageId") == "photo-1"
        for page in history[""][0]["pages"]
    )


def test_diagnostics_count_the_library_and_name_nothing(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _pages())
    store.link_pages(WATCH, [LIGHTS], [PHONE])
    report = store.library_diagnostics()
    assert report == {
        "readable": True,
        "pages": 2,
        "status_pages": 0,
        "menus": 0,
        "devices": 2,
        "shared": {"status_pages": 0, "pages": 1, "menus": 0},
    }
