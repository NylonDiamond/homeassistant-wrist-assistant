"""In-process tests for a page's two screens inside ``WatchConfigStore``.

The store's side of ``screens`` (``test_library_screens.py`` has the pure
side): each owner's record is stamped with its own kind of device's screen,
a device's put keeps the other screen, a panel save of the item reaches
only the kind of device whose screen it changed, and a library file from
before the screens gets them once at the next start.
"""

from __future__ import annotations

import copy

import pytest
from test_library_store import HASH, PHONE, WATCH, WATCH_2, _doc, _Env, _save, _share
from test_watch_config_store import LIBRARY_KEY, _FakeStore, _loaded_module

PAGE = "CCCCCCCC-0000-4000-8000-000000000001"


@pytest.fixture
def env():
    with _loaded_module() as mod:
        yield _Env(mod=mod, renamed=[], awaiting=set(), changes=[], store=None)


def _tile(tile_id: str, entity_id: str, col: int, row: int, cols: int = 6, rows: int = 4) -> dict:
    return {"colSpan": cols, "entityId": entity_id, "gridCol": col, "gridRow": row, "id": tile_id, "rowSpan": rows}


def _pages() -> dict:
    return {
        "schemaVersion": 1,
        "pages": [
            {
                "id": PAGE,
                "name": "Lights",
                "items": [
                    _tile("T1", "light.a", 0, 0),
                    _tile("T2", "light.b", 6, 0),
                    _tile("M1", "map.home", 0, 4, 12, 6),
                ],
            }
        ],
    }


def _ids(document: dict) -> list[str]:
    return [t["id"] for t in document["pages"][0]["items"]]


def _three_devices(env):
    store = env.store_now()
    _save(env, WATCH, _pages())
    _share(env, [PAGE], [WATCH_2, PHONE])
    env.changes.clear()
    return store


def test_each_device_s_record_carries_its_own_screen(env) -> None:
    _three_devices(env)
    assert _ids(_doc(env, WATCH)) == ["T1", "T2"], "the watch never drew the map"
    assert _ids(_doc(env, WATCH_2)) == ["T1", "T2"]
    assert _doc(env, PHONE)["pages"] == _pages()["pages"]
    for owner in (WATCH, WATCH_2, PHONE):
        assert "screens" not in _doc(env, owner)["pages"][0]


def test_an_iphone_put_moves_the_iphone_only(env) -> None:
    store = _three_devices(env)
    watch = store.get(WATCH, "pages")
    record = store.get(PHONE, "pages")
    sent = copy.deepcopy(record.document)
    sent["pages"][0]["items"][0]["colSpan"] = 12
    sent["pages"][0]["items"][1]["gridCol"] = 0
    sent["pages"][0]["items"][1]["gridRow"] = 10
    store.put(PHONE, "pages", sent, document_hash=HASH, base_revision=record.revision, updated_by=PHONE)
    assert store.get(WATCH, "pages").revision == watch.revision, "no watch record moves"
    assert env.changes == [(PHONE, "pages")]
    item = store.library_item("pages", PAGE)["document"]["pages"][0]
    assert item["screens"]["iphone"]["T1"]["colSpan"] == 12
    assert item["screens"]["watch"]["T1"]["colSpan"] == 6
    phone = _doc(env, PHONE)["pages"][0]["items"]
    assert [(t["id"], t["gridRow"]) for t in phone] == [("T1", 0), ("M1", 4), ("T2", 10)]


def test_a_watch_put_keeps_the_map_for_the_iphone(env) -> None:
    store = _three_devices(env)
    record = store.get(WATCH, "pages")
    sent = copy.deepcopy(record.document)
    sent["pages"][0]["name"] = "Lights, from the watch"
    store.put(WATCH, "pages", sent, document_hash=HASH, base_revision=record.revision, updated_by=WATCH)
    phone = _doc(env, PHONE)["pages"][0]
    assert phone["name"] == "Lights, from the watch"
    assert _ids(_doc(env, PHONE)) == ["T1", "T2", "M1"], "the map stays on the iPhone"


def test_a_panel_save_of_the_iphone_screen_reaches_the_iphone_only(env) -> None:
    store = _three_devices(env)
    item = store.library_item("pages", PAGE)
    page = item["document"]["pages"][0]
    page["screens"] = {
        "watch": {"T1": {"col": 0, "row": 0, "colSpan": 6, "rowSpan": 4}, "T2": {"col": 6, "row": 0, "colSpan": 6, "rowSpan": 4}},
        "iphone": {
            "T1": {"col": 0, "row": 0, "colSpan": 3, "rowSpan": 3},
            "T2": {"col": 3, "row": 0, "colSpan": 3, "rowSpan": 3},
            "M1": {"col": 6, "row": 0, "colSpan": 6, "rowSpan": 6},
        },
    }
    store.library_save_item("pages", PAGE, item["revision"], item["document"])
    assert env.changes == [(PHONE, "pages")]
    phone = _doc(env, PHONE)["pages"][0]["items"]
    assert [(t["id"], t["gridCol"], t["colSpan"]) for t in phone] == [("T1", 0, 3), ("T2", 3, 3), ("M1", 6, 6)]
    assert "screens" not in _doc(env, PHONE)["pages"][0]


def test_a_library_from_before_the_screens_gets_them_once(env) -> None:
    store = _three_devices(env)
    records = {owner: store.get(owner, "pages") for owner in (WATCH, WATCH_2, PHONE)}
    raw = copy.deepcopy(_FakeStore.files[LIBRARY_KEY])
    raw.pop("version")
    assert "screens" not in raw["pages"][PAGE]
    _FakeStore.files[LIBRARY_KEY] = raw
    store = env.store_now()
    held = _FakeStore.files[LIBRARY_KEY]
    assert held["version"] == 2
    assert set(held["pages"][PAGE]["screens"]["watch"]) == {"T1", "T2"}
    assert set(held["pages"][PAGE]["screens"]["iphone"]) == {"T1", "T2", "M1"}
    for owner, record in records.items():
        now = store.get(owner, "pages")
        assert (now.revision, now.document) == (record.revision, record.document), owner
    written = copy.deepcopy(held)
    env.store_now()
    assert _FakeStore.files[LIBRARY_KEY] == written, "the next start changes nothing"
