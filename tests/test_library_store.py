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


def _share(env, ids: list[str], targets: list[str], kind: str = "pages") -> None:
    """Tick each item onto each target, as the panel's Pages tab does."""
    for target in targets:
        for item_id in ids:
            env.store.library_pick(target, kind, item_id, on=True)


def _share_menus(env, source: str, targets: list[str], units=("anywhere", "entity")) -> dict:
    """Tick the menus ``source`` uses onto each target. Returns them by unit."""
    picked = env.store.library_summary()["picks"][source]["menus"]
    for target in targets:
        for unit in units:
            env.store.library_pick(target, "menus", picked[unit], unit=unit)
    return picked


def _no_link_keys(document: dict) -> bool:
    """Whether a record carries neither link key anywhere the old code put
    them: ``linkIds`` at the top, ``linkId`` on a page or status page."""
    lists = [document.get("pages", []), document.get("statusPages", [])]
    return "linkIds" not in document and all("linkId" not in p for items in lists for p in items)


# ── the migration ────────────────────────────────────────────────────────


def test_a_first_start_builds_the_library_from_the_records_and_writes_it(env) -> None:
    """Identical copies and linked copies become one item each; the records
    of linked pages lose the old token, as one new revision; a record
    already in its library form is not written again."""
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
    assert _no_link_keys(watch.document)
    assert _page(store.get(WATCH_2, "pages").document, LIGHTS)["name"] == "Lights"
    assert _no_link_keys(store.get(WATCH_2, "pages").document)
    for owner in (WATCH, WATCH_2):
        menus = store.get(owner, "menus")
        assert menus.revision == 1, "a record with nothing to drop is not written"
        assert _no_link_keys(menus.document)
    assert LIBRARY_KEY in _FakeStore.files
    assert _FakeStore.files[LIBRARY_KEY]["hashes"][WATCH]["pages"] == watch.hash


def test_a_device_alone_is_left_exactly_as_it_was(env) -> None:
    _seed(env.mod, {WATCH: {"pages": _pages(), "status_pages": _status(), "menus": _menus()}})
    store = env.store_now()
    for kind, doc in (("pages", _pages()), ("status_pages", _status()), ("menus", _menus())):
        record = store.get(WATCH, kind)
        assert (record.revision, record.hash, record.document) == (1, HASH, doc)


def _mark_as_step_one(mod, owner: str, kind: str, mark) -> None:
    """Put the link keys the step 1 code wrote back into ``owner``'s record
    on disk, with a hash the library file notes as its own, as a box that
    ran that code holds them: ``mark`` changes the document in place."""
    key = mod._owner_key(owner)
    record = _FakeStore.files[key]["records"][kind]
    mark(record["document"])
    digest = f"{owner}-{kind}".encode().hex().ljust(64, "0")[:64]
    record["hash"] = digest
    _FakeStore.files[LIBRARY_KEY]["hashes"][owner][kind] = digest


def test_a_box_whose_records_carry_the_old_link_keys_starts_without_them(env) -> None:
    """The live box after step 1: its records carry ``linkId`` (the item's
    id) on shared pages and status pages and ``linkIds`` (the menu's id) on
    shared menus, and the library file notes their hashes. Starting the new
    code folds nothing back (no fork, no unlink, no new item, no new menu):
    each such record is written once more without the keys, by the
    library, and the library itself is unchanged."""
    store = env.store_now()
    _save(env, WATCH, _pages())
    _save(env, WATCH, _status(), "status_pages")
    _save(env, WATCH, _menus(), "menus")
    _share(env, [HOME, LIGHTS], [WATCH_2])
    menus = _share_menus(env, WATCH, [WATCH_2])
    before = store.library_summary()
    revisions = {o: store.revisions(o) for o in (WATCH, WATCH_2)}

    def pages_mark(doc):
        for page in doc["pages"]:
            if page["id"] in (HOME, LIGHTS):
                page["linkId"] = page["id"]

    def status_mark(doc):
        doc["statusPages"][0]["linkId"] = DOORS

    def menus_mark(doc):
        doc["linkIds"] = {"anywhere": menus["anywhere"], "entity": menus["entity"]}

    for owner in (WATCH, WATCH_2):
        _mark_as_step_one(env.mod, owner, "pages", pages_mark)
        _mark_as_step_one(env.mod, owner, "status_pages", status_mark)
        _mark_as_step_one(env.mod, owner, "menus", menus_mark)

    again = env.store_now()
    assert again.library_summary() == before, "same items, same picks, nothing forked"
    for owner in (WATCH, WATCH_2):
        for kind in ("pages", "status_pages", "menus"):
            record = again.get(owner, kind)
            assert _no_link_keys(record.document), (owner, kind)
            assert record.revision > revisions[owner][kind], "written once more"
            assert record.updated_by == "library"
            assert record.history_entry(revisions[owner][kind]) is not None, "the old one is kept"
    assert env.renamed == []
    # Built again from a file it wrote itself: the next start writes nothing.
    settled = {o: again.revisions(o) for o in (WATCH, WATCH_2)}
    third = env.store_now()
    assert {o: third.revisions(o) for o in (WATCH, WATCH_2)} == settled


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
    env.store_now()
    _save(env, WATCH, _pages())
    _share(env, [LIGHTS], [WATCH_2])
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


OTHER_HOME = "CCCCCCCC-0000-4000-8000-000000000001"


def _older_code_records(mod, owner: str, files: dict[str, dict]) -> None:
    """``owner``'s records as older code would leave them after a rollback
    (the library never saw them): its file and its place in the index."""
    _FakeStore.files[mod._owner_key(owner)] = {
        "owner_watch_id": owner,
        "records": {kind: _record(1, doc) for kind, doc in files.items()},
    }
    index = _FakeStore.files[INDEX_KEY]
    index["owners"] = sorted({*index["owners"], owner})


def _starter_menus() -> dict:
    menus = _menus()
    menus["quickAction"]["slots"] = [_slot(1, {"type": "showStatusPage", "pageId": STARTER})]
    return menus


def test_a_fork_at_the_next_start_follows_into_the_same_device_s_tiles_and_slots(env) -> None:
    """The first watch's starter is edited ("Batteries"). Older code left the
    second watch with the default starter, a Home whose tile opens it and a
    menu slot that opens it. The next start forks the second watch's starter
    to an id of its own, and its tile and slot open that, not the first
    watch's Batteries, which it does not pick."""
    env.store_now()
    _save(env, WATCH, _status(starter="Batteries"), "status_pages")
    _older_code_records(
        env.mod,
        WATCH_2,
        {
            "status_pages": _status(starter="Climate"),
            "pages": {
                "schemaVersion": 1,
                "pages": [{"id": OTHER_HOME, "name": "Home",
                           "items": [_tile(1, f"status_page.{STARTER}")]}],
            },
            "menus": _starter_menus(),
        },
    )
    again = env.store_now()
    status = again.get(WATCH_2, "status_pages").document
    [fork] = [p["id"] for p in status["statusPages"] if p["name"] == "Climate"]
    assert fork != STARTER
    home = _page(again.get(WATCH_2, "pages").document, OTHER_HOME)
    assert home["items"][0]["entityId"] == f"status_page.{fork}"
    slots = again.get(WATCH_2, "menus").document["quickAction"]["slots"]
    assert slots[0]["action"]["pageId"] == fork
    assert _page(_doc(env, WATCH, "status_pages"), STARTER, "statusPages")["name"] == "Batteries"
    assert _FakeStore.files[LIBRARY_KEY]["renames"][WATCH_2]["status_pages"] == {STARTER: fork}


def test_a_first_record_after_a_restart_follows_an_earlier_fork(env) -> None:
    """The renames are kept in the library file, not in memory: the iPhone's
    first menus upload after a restart still opens its own starter."""
    store = env.store_now()
    _save(env, WATCH, _status(starter="Batteries"), "status_pages")
    store.put(PHONE, "status_pages", _status(starter="Mine"), document_hash=HASH,
              base_revision=0, updated_by=PHONE)
    [own] = [i for i in _ids(_doc(env, PHONE, "status_pages"), "statusPages")
             if i not in (DOORS, STARTER)]
    again = env.store_now()
    menus = again.put(PHONE, "menus", _starter_menus(), document_hash=HASH, base_revision=0,
                      updated_by=PHONE)
    assert menus.document["quickAction"]["slots"][0]["action"]["pageId"] == own
    assert menus.delivered_revision == 0, "the phone holds slots on the old id; it must pull"
    again.forget_owner(PHONE)
    assert PHONE not in _FakeStore.files[LIBRARY_KEY]["renames"]
    assert PHONE not in _FakeStore.files[LIBRARY_KEY]["revisions"]


def test_a_record_whose_save_never_reached_the_disk_is_built_again_not_mapped_back(env) -> None:
    """A hard crash inside the save window: the first watch's edit of a
    shared page and the library reached the disk, the second watch's
    rebuilt record did not. Its record on disk is older than the revision
    the library noted, so the next start builds it again from the library
    instead of taking it as a save that undoes the edit."""
    env.store_now()
    _save(env, WATCH, _pages())
    _share(env, [LIGHTS], [WATCH_2])
    key = env.mod._owner_key(WATCH_2)
    lost = copy.deepcopy(_FakeStore.files[key])
    doc = _doc(env, WATCH)
    _page(doc, LIGHTS)["name"] = "Lights, edited"
    _save(env, WATCH, doc)
    assert _page(_doc(env, WATCH_2), LIGHTS)["name"] == "Lights, edited"
    _FakeStore.files[key] = lost
    again = env.store_now()
    for owner in (WATCH, WATCH_2):
        assert _page(again.get(owner, "pages").document, LIGHTS)["name"] == "Lights, edited"
    assert again.library_summary()["pages"][LIGHTS]["item"]["name"] == "Lights, edited"


def test_a_device_forgotten_by_older_code_leaves_the_library_at_the_next_start(env) -> None:
    env.store_now()
    _save(env, WATCH, _pages())
    _share(env, [LIGHTS], [WATCH_2])
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
    _share(env, [LIGHTS], [PHONE, WATCH_2])
    record = store.get(PHONE, "pages")
    sent = copy.deepcopy(record.document)
    _page(sent, LIGHTS)["name"] = "From the phone"
    env.changes.clear()
    put = store.put(PHONE, "pages", sent, document_hash=HASH, base_revision=record.revision,
                    updated_by=PHONE)
    assert (put.hash, put.document) == (HASH, sent), "a shared page is stored as sent"
    assert put.delivered_revision == put.revision
    for owner in (WATCH, WATCH_2):
        assert _page(_doc(env, owner), LIGHTS)["name"] == "From the phone"
        assert _no_link_keys(_doc(env, owner))
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
    _share_menus(env, WATCH, [PHONE, WATCH_2])
    edited = _doc(env, WATCH_2, "menus")
    edited["quickAction"]["beamStyle"] = "ripplePulse"
    env.changes.clear()
    _save(env, WATCH_2, edited, "menus")
    for owner in (WATCH, PHONE):
        assert _doc(env, owner, "menus")["quickAction"]["beamStyle"] == "ripplePulse"
        assert _no_link_keys(_doc(env, owner, "menus"))
    # The saving device first, then the others in id order.
    assert env.changes == [(WATCH_2, "menus"), (PHONE, "menus"), (WATCH, "menus")]
    assert store.library_summary()["picks"][WATCH_2]["menus"] == (
        store.library_summary()["picks"][WATCH]["menus"]
    )


def test_a_panel_save_that_still_carries_link_keys_changes_only_the_content(env) -> None:
    """A page or menus document the panel loaded before the restart still
    holds the old marks, or marks naming something else: none of them is a
    pick, a fork or an unlink. Only the content reaches the library, and the
    record is stored without them."""
    store = env.store_now()
    _save(env, WATCH, _pages())
    _save(env, WATCH, _menus(), "menus")
    _share(env, [LIGHTS], [WATCH_2])
    shared = _share_menus(env, WATCH, [WATCH_2])
    _save(env, PHONE, _menus(beam="none"), "menus")
    phone_menu = store.library_summary()["picks"][PHONE]["menus"]["anywhere"]
    before = store.library_summary()

    pages = _doc(env, WATCH)
    _page(pages, LIGHTS)["linkId"] = LIGHTS
    _page(pages, HOME)["linkId"] = "3f0c5b2a9d1e4c7f8a6b0d2e4f6a8c0e"
    _page(pages, LIGHTS)["name"] = "Lights, edited"
    stored = _save(env, WATCH, pages)
    assert _no_link_keys(stored.document)
    assert _page(_doc(env, WATCH_2), LIGHTS)["name"] == "Lights, edited"

    menus = _doc(env, WATCH_2, "menus")
    menus["linkIds"] = {"anywhere": phone_menu}  # names another menu
    menus["quickAction"]["beamStyle"] = "ripplePulse"
    _save(env, WATCH_2, menus, "menus")
    assert _no_link_keys(_doc(env, WATCH_2, "menus"))
    assert _doc(env, WATCH, "menus")["quickAction"]["beamStyle"] == "ripplePulse"
    assert _doc(env, PHONE, "menus")["quickAction"]["beamStyle"] == "none"

    menus = _doc(env, WATCH, "menus")
    menus["linkIds"] = {}  # every mark taken off
    menus["quickAction"]["beamStyle"] = "auroraWash"
    _save(env, WATCH, menus, "menus")
    assert _doc(env, WATCH_2, "menus")["quickAction"]["beamStyle"] == "auroraWash", "no fork"

    after = store.library_summary()
    assert after["picks"] == before["picks"]
    assert sorted(after["pages"]) == sorted(before["pages"])
    assert sorted(after["menus"]) == sorted(before["menus"])
    assert after["picks"][WATCH_2]["menus"] == shared


def test_a_device_put_carrying_link_ids_never_moves_a_menu(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _menus(), "menus")
    shared = _share_menus(env, WATCH, [PHONE], units=("anywhere",))
    record = store.get(PHONE, "menus")
    sent = {**record.document, "linkIds": {"anywhere": "3f0c5b2a9d1e4c7f8a6b0d2e4f6a8c0e"}}
    sent["quickAction"] = {**sent["quickAction"], "beamStyle": "none"}
    put = store.put(PHONE, "menus", sent, document_hash=HASH, base_revision=record.revision,
                    updated_by=PHONE)
    assert _no_link_keys(put.document) and put.hash != HASH
    assert _doc(env, WATCH, "menus")["quickAction"]["beamStyle"] == "none"
    assert store.library_summary()["picks"][PHONE]["menus"]["anywhere"] == shared["anywhere"]


def test_a_restore_of_a_menus_revision_from_before_the_library_edits_the_shared_menu(env) -> None:
    """Both watches linked their Anywhere menu under an old token before the
    library. The migration made it one menu and wrote both records again,
    so the history holds the linked revision. Restoring it is a save of
    that document: its token means nothing, so the sections land on the
    menu the watch uses now, and the other watch, which uses it too, gets
    them. No device gets a copy."""
    linked = {**_menus(), "linkIds": {"anywhere": OLD_LINK}}
    _seed(env.mod, {WATCH: {"menus": linked}, WATCH_2: {"menus": copy.deepcopy(linked)}})
    store = env.store_now()
    summary = store.library_summary()
    [menu_id] = [i for i, m in summary["menus"].items() if m["kind"] == "anywhere"]
    assert summary["menus"][menu_id]["owners"] == [WATCH, WATCH_2]
    old = store.get(WATCH, "menus").history_entry(1)
    assert old.document["linkIds"] == {"anywhere": OLD_LINK}
    edited = _doc(env, WATCH, "menus")
    edited["quickAction"]["beamStyle"] = "ripplePulse"
    _save(env, WATCH, edited, "menus")
    assert _doc(env, WATCH_2, "menus")["quickAction"]["beamStyle"] == "ripplePulse"

    store.restore(WATCH, "menus", 1, base_revision=store.get(WATCH, "menus").revision)
    for owner in (WATCH, WATCH_2):
        menus = _doc(env, owner, "menus")
        assert menus["quickAction"]["beamStyle"] == "auroraWash"
        assert _no_link_keys(menus)
    after = store.library_summary()
    assert sorted(after["menus"]) == sorted(summary["menus"]), "no copy was made"
    assert after["menus"][menu_id]["owners"] == [WATCH, WATCH_2]


def test_a_restore_maps_back_as_a_save(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _pages())
    _share(env, [LIGHTS], [PHONE])
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
    assert store.get(PHONE, "menus").delivered_revision == 0, (
        "its slot was rewritten, so the phone must pull the menus too"
    )


# ── forget and move ──────────────────────────────────────────────────────


def test_a_forget_drops_the_picks_and_keeps_the_items(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _pages())
    store.link_device(WATCH, PHONE, updated_by="panel")
    phone = store.get(PHONE, "pages").revision
    env.changes.clear()
    store.forget_owner(WATCH)
    summary = store.library_summary()
    assert WATCH not in summary["picks"]
    assert summary["pages"][HOME]["owners"] == [PHONE]
    assert store.get(PHONE, "pages").revision == phone, "the phone's record is not touched"
    assert all(owner == WATCH for owner, _kind in env.changes)
    assert WATCH not in _FakeStore.files[LIBRARY_KEY]["hashes"]


def test_a_move_carries_the_picks_to_the_new_id(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _pages())
    _save(env, WATCH, _menus(), "menus")
    _share(env, [LIGHTS], [PHONE])
    before = store.library_summary()["picks"][WATCH]
    phone = store.get(PHONE, "pages").revision
    store.move_owner(WATCH, WATCH_3, updated_by="move")
    summary = store.library_summary()
    assert WATCH not in summary["picks"]
    assert summary["picks"][WATCH_3] == before
    assert summary["pages"][LIGHTS]["owners"] == [PHONE, WATCH_3]
    assert _no_link_keys(_doc(env, WATCH_3))
    assert store.get(PHONE, "pages").revision == phone, "the phone's record is not touched"


def test_a_move_onto_a_device_that_kept_its_own_drops_the_source_s_picks(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _pages())
    _share(env, [LIGHTS], [WATCH_2])
    store.move_owner(WATCH, WATCH_2, updated_by="move")
    summary = store.library_summary()
    assert WATCH not in summary["picks"]
    assert summary["pages"][LIGHTS]["owners"] == [WATCH_2]
    assert _no_link_keys(_doc(env, WATCH_2))


# ── the library's own ops ────────────────────────────────────────────────


def test_pick_puts_a_page_on_with_its_status_pages_and_takes_it_off(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _pages())
    _save(env, WATCH, _status(), "status_pages")
    _save(env, PHONE, {"schemaVersion": 1, "pages": []})
    result = store.library_pick(PHONE, "pages", HOME, on=True)
    assert _ids(_doc(env, PHONE)) == [HOME]
    assert _ids(_doc(env, PHONE, "status_pages"), "statusPages") == [DOORS], "its tile opens Doors"
    assert set(result["revisions"]) == {PHONE}, "the watch, which has it too, is not written"
    assert result["revisions"][PHONE]["pages"] == store.get(PHONE, "pages").revision
    assert _no_link_keys(_doc(env, PHONE)) and _no_link_keys(_doc(env, WATCH))
    store.library_pick(PHONE, "pages", HOME, on=False)
    assert _doc(env, PHONE)["pages"] == []
    assert HOME in store.library_summary()["pages"], "the item stays"


def test_pick_of_a_menu_makes_it_the_device_s_menu(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _menus(), "menus")
    _save(env, PHONE, _menus(beam="none"), "menus")
    menus = store.library_summary()["menus"]
    [watch_menu] = [i for i, m in menus.items() if m["kind"] == "anywhere" and m["owners"] == [WATCH]]
    watch = store.get(WATCH, "menus").revision
    result = store.library_pick(PHONE, "menus", watch_menu, unit="anywhere")
    assert _doc(env, PHONE, "menus")["quickAction"]["beamStyle"] == "auroraWash"
    assert _no_link_keys(_doc(env, PHONE, "menus"))
    assert set(result["revisions"]) == {PHONE}
    assert store.get(WATCH, "menus").revision == watch


def test_pick_of_a_menu_starts_the_menus_of_a_device_that_has_none(env) -> None:
    """The picked menu is shared; the other unit starts as the device's own
    copy of the menu the first device uses."""
    store = env.store_now()
    _save(env, WATCH, _menus(), "menus")
    picks = store.library_summary()["picks"][WATCH]["menus"]
    result = store.library_pick(WATCH_2, "menus", picks["anywhere"], unit="anywhere")
    assert _doc(env, WATCH_2, "menus") == _menus() == _doc(env, WATCH, "menus")
    mine = store.library_summary()["picks"][WATCH_2]["menus"]
    assert mine["anywhere"] == picks["anywhere"]
    assert mine["entity"] != picks["entity"]
    assert store.library_summary()["menus"][mine["entity"]]["name"] == "Chen's Apple Watch's menu"
    assert set(result["revisions"]) == {WATCH_2}


def test_a_first_menus_pick_starts_only_from_a_device_the_caller_may_read(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _menus(), "menus")
    theirs = _menus()
    theirs["entityRadial"]["allSlots"] = []
    _save(env, WATCH_2, theirs, "menus")
    shared = store.library_summary()["picks"][WATCH]["menus"]["anywhere"]
    store.library_pick(WATCH_2, "menus", shared, unit="anywhere")
    store.library_pick(PHONE, "menus", shared, unit="anywhere", may_read=lambda o: o != WATCH)
    assert _doc(env, PHONE, "menus")["entityRadial"] == theirs["entityRadial"], "from Chen's watch"


def test_pick_of_a_menu_no_device_uses_onto_a_device_with_none_is_refused(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _menus(), "menus")
    spare = store.library_summary()["picks"][WATCH]["menus"]["anywhere"]
    store.library_copy_menu(WATCH, "anywhere", "Mine")
    env.changes.clear()
    with pytest.raises(env.mod.WatchConfigStoreError) as err:
        store.library_pick(WATCH_2, "menus", spare, unit="anywhere")
    assert err.value.code == "no_record"
    assert env.changes == [] and store.get(WATCH_2, "menus") is None
    assert WATCH_2 not in store.library_summary()["picks"]


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
    _share_menus(env, WATCH, [PHONE], units=("anywhere",))
    watch = store.get(WATCH, "menus").revision
    result = store.library_copy_menu(PHONE, "anywhere", "Phone menu")
    assert result["revisions"] == {}, "the same sections: no record changes"
    assert store.get(WATCH, "menus").revision == watch
    assert store.library_summary()["menus"][result["id"]]["owners"] == [PHONE]
    # From then on an edit of the copy stays on the phone.
    phone = _doc(env, PHONE, "menus")
    phone["quickAction"]["beamStyle"] = "none"
    _save(env, PHONE, phone, "menus")
    assert _doc(env, WATCH, "menus")["quickAction"]["beamStyle"] == "auroraWash"
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
    _share(env, [LIGHTS], [PHONE])
    report = store.library_diagnostics()
    assert report == {
        "readable": True,
        "pages": 2,
        "status_pages": 0,
        "menus": 0,
        "devices": 2,
        "shared": {"status_pages": 0, "pages": 1, "menus": 0},
    }


# ── a new menu no device uses ────────────────────────────────────────────


def test_create_menu_makes_a_menu_no_device_uses_until_one_is_ticked(env) -> None:
    store = env.store_now()
    _save(env, WATCH, _menus(), "menus")
    before = store.get(WATCH, "menus").revision
    env.changes.clear()
    radial = {"allSlots": [_slot(1, {"type": "assist"}), _slot(2, {"type": "toggle"})]}
    result = store.library_create_menu("entity", " Guest menu ", {"entityRadial": radial})
    assert result["revisions"] == {}
    assert env.changes == [], "no record is written"
    assert store.get(WATCH, "menus").revision == before, "no device moves off its menu"
    menu = store.library_summary()["menus"][result["id"]]
    assert menu == {
        "name": "Guest menu",
        "kind": "entity",
        "sections": {"entityRadial": radial},
        "owners": [],
    }
    assert env.store_now().library_summary()["menus"][result["id"]]["owners"] == [], "kept"

    store = env.store
    store.library_pick(WATCH, "menus", result["id"], unit="entity")
    assert _doc(env, WATCH, "menus")["entityRadial"] == radial
    assert _doc(env, WATCH, "menus")["quickAction"] == _menus()["quickAction"]
    # A device with no menus record has nothing to start the other menu
    # from, so a tick of a menu only that new one holds is refused there.
    fresh = store.library_create_menu("anywhere", "Spare", {
        "quickAction": {"slots": []}, "pageSwitcher": {},
    })
    with pytest.raises(env.mod.WatchConfigStoreError) as err:
        store.library_pick(WATCH_2, "menus", fresh["id"], unit="anywhere")
    assert err.value.code == "no_record"


@pytest.mark.parametrize(
    ("unit", "name", "sections"),
    [
        ("both", "Menu", {"entityRadial": {}}),
        ("entity", "  ", {"entityRadial": {}}),
        ("entity", "Menu", {}),
        ("entity", "Menu", {"entityRadial": {}, "quickAction": {}}),
        ("anywhere", "Menu", {"quickAction": {}}),
        ("anywhere", "Menu", {"quickAction": [], "pageSwitcher": {}}),
        ("anywhere", "Menu", {"quickAction": {"slots": {}}, "pageSwitcher": {}}),
        ("anywhere", "Menu", {"quickAction": {"slots": [_slot(1, {}), _slot(1, {})]},
                              "pageSwitcher": {}}),
        ("entity", "Menu", {"entityRadial": {"allSlots": [{"action": {}}]}}),
        ("entity", "Menu", {"entityRadial": {"entityOverrides": []}}),
        ("entity", "Menu", "not an object"),
    ],
)
def test_create_menu_refuses_another_shape(env, unit, name, sections) -> None:
    store = env.store_now()
    with pytest.raises(env.mod.WatchConfigValidationError) as err:
        store.library_create_menu(unit, name, sections)
    assert err.value.code == "invalid"
    assert store.library_summary()["menus"] == {}
