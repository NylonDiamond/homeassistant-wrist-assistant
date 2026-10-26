"""Offline tests for dropping old tile layers (a tile's ``design`` key),
which were taken out before release and are dropped, never converted.

* A panel save, a restore and a library page save that still carry the key
  go through without it rather than being refused.
* A device save keeps it, as it skips the rest of the tile level.
* On load the key comes off every stored tile: the library's pages, the
  system pages its picks hold and the records it builds, each record that
  changes written as its next revision. A load with nothing to drop writes
  nothing.

Nothing here talks to a live Home Assistant.
"""

from __future__ import annotations

import copy
from typing import Any

from test_watch_config_store import (  # noqa: F401 (mod: fixture)
    LIBRARY_KEY,
    OTHER,
    OWNER,
    _FakeStore,
    _new,
    mod,
)
from test_watch_config_ws import ROOT, env  # noqa: F401 (env: the links fixture's own)
from test_watch_pages_link_ws import (  # noqa: F401 (links is a fixture)
    LIGHTS,
    WATCH,
    _run,
    links,
)

PAGE = "6F1C2D0E-0000-4000-8000-000000000001"
OTHER_PAGE = "6F1C2D0E-0000-4000-8000-000000000002"
SYSTEM_PAGE = "6F1C2D0E-0000-4000-8000-0000000000FF"
TILE = "1B6E1F4C-6E83-4B5E-9C5C-7F3A2D1E0A11"
DESIGN = {"v": 1, "owned": ["base.name"], "template": "{{ 1 }}", "doc": {"elements": []}}


def _tile(*, tile_id: str = TILE, design: bool = False, **keys: Any) -> dict:
    tile: dict[str, Any] = {"id": tile_id, "entityId": "person.chen", "colSpan": 6, "rowSpan": 4}
    tile.update(keys)
    if design:
        tile["design"] = copy.deepcopy(DESIGN)
    return tile


def _pages(*tiles: dict, page_id: str = PAGE) -> dict:
    return {"schemaVersion": 1, "pages": [{"id": page_id, "name": "Home", "items": list(tiles)}]}


def _device_put(store, owner: str, document: dict, base: int = 0):
    return store.put(
        owner, "pages", copy.deepcopy(document), document_hash="a" * 64, base_revision=base, updated_by=owner
    )


def _designs(document: Any) -> int:
    """How many tiles of a pages document (or a list of pages) carry a design."""
    pages = document.get("pages") if isinstance(document, dict) else document
    return sum(1 for page in pages for item in page.get("items", []) if "design" in item)


# ── Saves ────────────────────────────────────────────────────────────────


def test_the_helper_drops_every_design_and_says_so(mod) -> None:  # noqa: F811
    document = _pages(_tile(design=True), _tile(tile_id="T2", design=True), _tile(tile_id="T3"))
    assert mod.drop_tile_designs(document) is True
    assert _designs(document) == 0
    assert document["pages"][0]["items"][2] == _tile(tile_id="T3")
    assert mod.drop_tile_designs(document) is False
    for odd in (None, [], {}, {"pages": "x"}, {"pages": [1, {"items": "x"}, {"items": [2]}]}):
        assert mod.drop_tile_designs(odd) is False


def test_a_panel_save_with_a_design_saves_without_it(mod) -> None:  # noqa: F811
    store = _new(mod)
    _device_put(store, OWNER, _pages(_tile()))
    sent = _pages(_tile(design=True, iconGlow={"mode": "on"}))
    record = store.panel_save(OWNER, "pages", sent, base_revision=1)
    assert record.revision == 2
    assert record.document == _pages(_tile(iconGlow={"mode": "on"}))
    assert record.hash == mod.canonical_hash(record.document)
    assert record.size_bytes == mod.document_size(record.document)
    # Even a design the old check would have refused.
    broken = _pages(_tile(design=True))
    broken["pages"][0]["items"][0]["design"] = "not a design"
    assert _designs(store.panel_save(OWNER, "pages", broken, base_revision=2).document) == 0


def test_a_device_save_keeps_a_design(mod) -> None:  # noqa: F811
    store = _new(mod)
    record = _device_put(store, OWNER, _pages(_tile(design=True)))
    assert record.document["pages"][0]["items"][0]["design"] == DESIGN


def test_a_restore_of_a_revision_with_a_design_restores_without_it(mod) -> None:  # noqa: F811
    store = _new(mod)
    _device_put(store, OWNER, _pages(_tile(design=True)))
    store.panel_save(OWNER, "pages", _pages(_tile(tile_id="T2")), base_revision=1)
    # The history keeps what the device wrote.
    assert _designs(store.history_entry(OWNER, "pages", 1).document) == 1
    restored = store.restore(OWNER, "pages", 1, base_revision=2)
    assert restored.document == _pages(_tile())
    assert _designs(store.history_entry(OWNER, "pages", 1).document) == 1


def test_a_library_page_save_with_a_design_saves_without_it(links) -> None:  # noqa: F811
    store = links.store
    item = store.library_item("pages", LIGHTS)
    item["document"]["pages"][0]["items"] = [_tile(design=True)]
    connection = _run(
        links,
        links.ws.ws_library_item_save,
        ROOT,
        kind="pages",
        item_id=LIGHTS,
        base_revision=item["revision"],
        document=item["document"],
    )
    assert connection.errors == []
    assert store.library_item("pages", LIGHTS)["document"]["pages"][0]["items"] == [_tile()]
    page = next(p for p in store.get(WATCH, "pages").document["pages"] if p["id"] == LIGHTS)
    assert page["items"] == [_tile()]


# ── Load ─────────────────────────────────────────────────────────────────


def test_a_load_drops_every_stored_design(mod) -> None:  # noqa: F811
    store = _new(mod)
    _device_put(store, OWNER, _pages(_tile(design=True), _tile(tile_id="T2")))
    _device_put(store, OTHER, _pages(_tile(design=True), page_id=OTHER_PAGE))
    assert _designs(store.library_item("pages", PAGE)["document"]) == 1
    before = {owner: store.get(owner, "pages").revision for owner in (OWNER, OTHER)}

    again = _new(mod)
    for owner, page_id in ((OWNER, PAGE), (OTHER, OTHER_PAGE)):
        record = again.get(owner, "pages")
        assert _designs(record.document) == 0
        assert record.revision > before[owner]
        assert record.updated_by == "library"
        assert record.hash == mod.canonical_hash(record.document)
        # The old revision stays in the history as it was.
        assert _designs(again.history_entry(owner, "pages", before[owner]).document) == 1
        assert _designs(again.library_item("pages", page_id)["document"]) == 0
    assert again.get(OWNER, "pages").document == _pages(_tile(), _tile(tile_id="T2"))
    # On disk too.
    assert _designs(list(_FakeStore.files[LIBRARY_KEY]["pages"].values())) == 0
    assert _designs(_FakeStore.files[mod._owner_key(OWNER)]["records"]["pages"]["document"]) == 0

    # A second start finds nothing to drop and writes no record.
    revisions = {owner: again.get(owner, "pages").revision for owner in (OWNER, OTHER)}
    third = _new(mod)
    assert {owner: third.get(owner, "pages").revision for owner in (OWNER, OTHER)} == revisions


def test_a_load_with_no_design_writes_nothing(mod) -> None:  # noqa: F811
    store = _new(mod)
    _device_put(store, OWNER, _pages(_tile(iconGlow={"mode": "off"})))
    record = store.get(OWNER, "pages")
    again = _new(mod)
    after = again.get(OWNER, "pages")
    assert (after.revision, after.hash, after.updated_by) == (record.revision, record.hash, OWNER)


def test_a_load_drops_a_design_from_a_system_page(mod) -> None:  # noqa: F811
    store = _new(mod)
    document = _pages(_tile(design=True))
    document["pages"].append(
        {"id": SYSTEM_PAGE, "name": "Settings", "isSystemPage": True, "items": [_tile(tile_id="S1", design=True)]}
    )
    _device_put(store, OWNER, document)
    again = _new(mod)
    stored = again.get(OWNER, "pages").document
    assert _designs(stored) == 0
    assert [page["id"] for page in stored["pages"]] == [PAGE, SYSTEM_PAGE]
    held = _FakeStore.files[LIBRARY_KEY]["picks"][OWNER]["pages"]
    assert _designs([pick["page"] for pick in held if "page" in pick]) == 0


def test_a_load_with_an_unreadable_library_still_drops_record_designs(mod) -> None:  # noqa: F811
    store = _new(mod)
    _device_put(store, OWNER, _pages(_tile(design=True)))
    revision = store.get(OWNER, "pages").revision
    _FakeStore.unreadable.add(LIBRARY_KEY)
    again = _new(mod)
    record = again.get(OWNER, "pages")
    assert _designs(record.document) == 0
    assert record.revision > revision
