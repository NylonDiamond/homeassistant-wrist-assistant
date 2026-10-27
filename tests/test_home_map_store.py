"""Unit tests for ``HomeMapStore`` and its checks, the home's map.

In-process with stubbed Home Assistant modules, the way
``test_page_images_store.py`` loads its store: the package is a stand-in
holding the real ``const.py`` and ``home_map_store.py``, and the ``Store``
keeps its payload in memory.

The map in ``fixtures/home_map/basic.json`` is a byte copy of the app's
(``WristAssistantTests/Fixtures/home_map/basic.json``), so both sides check
the same document against the contract.

Covered: the fixture passes the checks and is stored as sent, the empty
store, a save and its rev, a stale save refused ``conflict`` with the
stored rev, ``base_rev`` refusals, numbers rounded to 2 decimals and refused
when not finite or out of range, every shape refusal (keys missing or not
in the contract, ids, entity ids, area ids, kinds, a pin's room), the floor,
room and pin limits over the whole document, the 256 KiB limit, the
optional keys, ids kept in their own case, a restart, an unreadable file
never saved over, and unload.
"""

from __future__ import annotations

import asyncio
import contextlib
import copy
import importlib.util
import json
import math
import sys
import types
from pathlib import Path
from typing import Any

import pytest
from test_http_actions_store import FakeStore

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_PKG = "wa_home_map_test_pkg"
FIXTURE = Path(__file__).resolve().parent / "fixtures" / "home_map" / "basic.json"
KEY = "wrist_assistant.home_map"

FLOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000001"
LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010"
KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011"
OTHER_UUID = "11111111-2222-4333-8444-555555555555"


def basic() -> dict[str, Any]:
    """The shared fixture map, a fresh copy each time."""
    return json.loads(FIXTURE.read_text())


def _stub(name: str, **attrs: object) -> None:
    module = sys.modules.get(name) or types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module


def _load_into_pkg(name: str):
    spec = importlib.util.spec_from_file_location(f"{_PKG}.{name}", _PKG_DIR / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[f"{_PKG}.{name}"] = module
    spec.loader.exec_module(module)
    return module


@contextlib.contextmanager
def loaded_package():
    """The package with ``const`` and the store loaded over stubbed Home
    Assistant modules. Dropped after."""
    saved = dict(sys.modules)
    FakeStore.files, FakeStore.writes, FakeStore.removed = {}, [], []
    FakeStore.unreadable = set()
    FakeStore.deferred, FakeStore.pending = False, {}
    try:
        _stub("homeassistant")
        _stub("homeassistant.helpers")
        _stub("homeassistant.helpers.storage", Store=FakeStore)
        _stub(
            "homeassistant.core",
            HomeAssistant=type("HomeAssistant", (), {}),
            callback=lambda f: f,
        )
        pkg = types.ModuleType(_PKG)
        pkg.__path__ = []
        sys.modules[_PKG] = pkg
        _load_into_pkg("const")
        store_mod = _load_into_pkg("home_map_store")
        yield types.SimpleNamespace(store_mod=store_mod, load=_load_into_pkg)
    finally:
        for key in list(sys.modules):
            if key not in saved:
                del sys.modules[key]
        sys.modules.update(saved)


class Env:
    def __init__(self, loaded) -> None:
        self.loaded = loaded
        self.mod = loaded.store_mod
        self.store = self.new_store()

    def new_store(self):
        """A store as a restart makes it."""
        store = self.mod.HomeMapStore(object())
        asyncio.run(store.async_load())
        return store

    def refused(self, call, code: str) -> Any:
        with pytest.raises(self.mod.HomeMapError) as err:
            call()
        assert err.value.code == code, err.value.message
        return err.value

    def refused_doc(self, doc: Any, code: str = "invalid") -> str:
        """A save of ``doc`` is refused with ``code``, and nothing moves."""
        before = copy.deepcopy(FakeStore.files.get(KEY))
        rev = self.store.rev
        err = self.refused(lambda: self.store.save(doc, rev), code)
        assert self.store.rev == rev
        assert FakeStore.files.get(KEY) == before
        return err.message


@pytest.fixture
def env():
    with loaded_package() as loaded:
        yield Env(loaded)


def room(room_id: str, **overrides: Any) -> dict[str, Any]:
    """A small square room with nothing in it."""
    return {
        "id": room_id,
        "outline": [[0, 0], [1, 0], [1, 1], [0, 1]],
        "height": 2.5,
        "walls": [],
        "openings": [],
        "objects": [],
        **overrides,
    }


def uuid_n(n: int) -> str:
    return f"00000000-0000-4000-8000-{n:012d}"


# ── the fixture ──────────────────────────────────────────────────────────


def test_the_shared_fixture_passes_and_is_stored_as_sent(env) -> None:
    doc = basic()
    checked = env.mod.check_document(doc)
    assert checked == basic()
    # Keys in the contract's order, the fixture's own: the same JSON text.
    assert json.dumps(checked) == json.dumps(basic())
    assert doc == basic(), "the check changed what it was given"


def test_the_fixture_is_well_under_the_limits(env) -> None:
    doc = basic()
    assert env.mod.document_bytes(doc) < env.mod.MAX_DOCUMENT_BYTES
    assert len(doc["floors"][0]["rooms"]) == 2
    assert len(doc["floors"][0]["pins"]) == 5


# ── get and save ─────────────────────────────────────────────────────────


def test_an_empty_store_has_no_map_and_rev_0(env) -> None:
    assert env.store.get() == (None, 0)
    assert env.store.rev == 0
    assert env.store.has_map is False and env.store.available is True
    assert KEY not in FakeStore.files


def test_a_save_from_rev_0_stores_the_map_at_rev_1(env) -> None:
    assert env.store.save(basic(), 0) == 1
    assert env.store.get() == (basic(), 1)
    assert env.store.has_map is True
    assert FakeStore.files[KEY] == {"rev": 1, "doc": basic()}


def test_each_save_adds_one_whatever_it_changed(env) -> None:
    assert env.store.save(basic(), 0) == 1
    assert env.store.save(basic(), 1) == 2
    doc = basic()
    doc["floors"][0]["pins"][0]["at"] = [1, 1, 1]
    assert env.store.save(doc, 2) == 3
    assert env.store.get()[0]["floors"][0]["pins"][0]["at"] == [1, 1, 1]
    assert FakeStore.files[KEY]["rev"] == 3


def test_get_hands_out_a_copy(env) -> None:
    env.store.save(basic(), 0)
    doc, _rev = env.store.get()
    doc["floors"].clear()
    assert env.store.get()[0] == basic()


def test_a_stale_save_is_a_conflict_with_the_stored_rev(env) -> None:
    env.store.save(basic(), 0)
    env.store.save(basic(), 1)
    stale = basic()
    stale["floors"][0]["name"] = "Downstairs"
    err = env.refused(lambda: env.store.save(stale, 1), "conflict")
    assert err.rev == 2
    assert err.message.startswith("stored revision is 2")
    assert err.message == "stored revision is 2, save was based on 1"
    # A base from the future is a conflict too.
    assert env.refused(lambda: env.store.save(stale, 7), "conflict").rev == 2
    assert env.store.get() == (basic(), 2)
    assert FakeStore.files[KEY]["doc"]["floors"][0]["name"] == "Ground floor"


def test_a_first_save_over_a_stored_map_is_a_conflict(env) -> None:
    env.store.save(basic(), 0)
    assert env.refused(lambda: env.store.save(basic(), 0), "conflict").rev == 1


def test_a_bad_map_is_invalid_before_it_is_a_conflict(env) -> None:
    env.store.save(basic(), 0)
    env.refused(lambda: env.store.save({"v": 1}, 0), "invalid")


@pytest.mark.parametrize("base_rev", [-1, True, False, "0", None, 0.0, 1.5, [0]])
def test_base_rev_must_be_a_whole_number(env, base_rev) -> None:
    message = env.refused(lambda: env.store.save(basic(), base_rev), "invalid").message
    assert "base_rev" in message
    assert KEY not in FakeStore.files


# ── numbers ──────────────────────────────────────────────────────────────


def test_numbers_are_rounded_to_2_decimals(env) -> None:
    doc = basic()
    pin = doc["floors"][0]["pins"][0]
    pin["at"] = [0.126, 3.1049, 1.5]
    doc["floors"][0]["rooms"][0]["height"] = 2.499
    doc["floors"][0]["rooms"][0]["objects"][0]["turn"] = 89.996
    doc["floors"][0]["rooms"][0]["walls"][0]["t"] = 0.104
    env.store.save(doc, 0)
    stored, _rev = env.store.get()
    assert stored["floors"][0]["pins"][0]["at"] == [0.13, 3.1, 1.5]
    assert stored["floors"][0]["rooms"][0]["height"] == 2.5
    assert stored["floors"][0]["rooms"][0]["objects"][0]["turn"] == 90.0
    assert stored["floors"][0]["rooms"][0]["walls"][0]["t"] == 0.1


def test_whole_numbers_stay_whole_and_minus_zero_is_zero(env) -> None:
    doc = basic()
    doc["floors"][0]["pins"][0]["at"] = [3, -0.001, -0.0]
    checked = env.mod.check_document(doc)
    at = checked["floors"][0]["pins"][0]["at"]
    assert at == [3, 0, 0]
    assert isinstance(at[0], int)
    assert all(math.copysign(1, value) == 1 for value in at)
    assert json.dumps(at) == "[3, 0.0, 0.0]"


@pytest.mark.parametrize("value", [math.nan, math.inf, -math.inf])
def test_a_number_that_is_not_finite_is_refused(env, value) -> None:
    doc = basic()
    doc["floors"][0]["pins"][1]["at"][2] = value
    message = env.refused_doc(doc)
    assert message == "doc.floors[0].pins[1].at[2] must be a finite number"


@pytest.mark.parametrize("value", [True, "1", None, [1]])
def test_a_number_that_is_not_a_number_is_refused(env, value) -> None:
    doc = basic()
    doc["floors"][0]["rooms"][1]["outline"][2][0] = value
    assert env.refused_doc(doc) == "doc.floors[0].rooms[1].outline[2][0] must be a number"


def test_numbers_out_of_range_are_refused(env) -> None:
    doc = basic()
    doc["floors"][0]["pins"][0]["at"][0] = 10_000.004
    env.mod.check_document(doc)  # rounds to the limit itself
    doc["floors"][0]["pins"][0]["at"][0] = 10_000.01
    assert "between" in env.refused_doc(doc)
    doc = basic()
    doc["floors"][0]["rooms"][0]["height"] = 0.004
    assert env.refused_doc(doc).startswith("doc.floors[0].rooms[0].height must be between")


# ── the shape ────────────────────────────────────────────────────────────


def _floor(doc):
    return doc["floors"][0]


def _living(doc):
    return doc["floors"][0]["rooms"][0]


def _set(path_fn, key, value):
    def apply(doc):
        path_fn(doc)[key] = value

    return apply


def _drop(path_fn, key):
    def apply(doc):
        del path_fn(doc)[key]

    return apply


SHAPE_REFUSALS = [
    (_set(lambda d: d, "v", 2), "doc.v must be 1"),
    (_set(lambda d: d, "v", True), "doc.v must be 1"),
    (_drop(lambda d: d, "v"), "doc.v is missing"),
    (_set(lambda d: d, "rooms", []), "doc.rooms is not a key the home map has"),
    (_set(lambda d: d, "floors", {}), "doc.floors must be a list"),
    (_set(_floor, "id", "floor-1"), "doc.floors[0].id must be a UUID"),
    (_set(_floor, "id", 7), "doc.floors[0].id must be a UUID"),
    (_drop(_floor, "name"), "doc.floors[0].name is missing"),
    (_set(_floor, "name", "x" * 101), "doc.floors[0].name is at most 100 characters"),
    (_set(_floor, "name", None), "doc.floors[0].name must be text"),
    (_set(_floor, "story", True), "doc.floors[0].story must be a whole number between -100 and 100"),
    (_set(_floor, "story", 1.0), "doc.floors[0].story must be a whole number between -100 and 100"),
    (_set(_floor, "story", 101), "doc.floors[0].story must be a whole number between -100 and 100"),
    (_set(_floor, "level", 0), "doc.floors[0].level is not a key the home map has"),
    (_drop(_floor, "pins"), "doc.floors[0].pins is missing"),
    (_set(_floor, "rooms", None), "doc.floors[0].rooms must be a list"),
    (_set(_living, "id", LIVING.replace("-", "")), "doc.floors[0].rooms[0].id must be a UUID"),
    (_set(_living, "name", 3), "doc.floors[0].rooms[0].name must be text"),
    (_set(_living, "areaId", "living room"), "doc.floors[0].rooms[0].areaId must be a Home Assistant area id"),
    (_set(_living, "areaId", ""), "doc.floors[0].rooms[0].areaId must be a Home Assistant area id"),
    (_set(_living, "pageId", "page-1"), "doc.floors[0].rooms[0].pageId must be a UUID"),
    (_set(_living, "outline", [[0, 0], [1, 1]]), "doc.floors[0].rooms[0].outline needs at least 3"),
    (_set(_living, "outline", [[0, 0], [1, 0], [1, 1, 2]]), "doc.floors[0].rooms[0].outline[2] must be a list of 2 numbers"),
    (_set(_living, "height", 0), "doc.floors[0].rooms[0].height must be between 0.01 and 100"),
    (_drop(_living, "walls"), "doc.floors[0].rooms[0].walls is missing"),
    (_set(_living, "label", "livingRoom"), "doc.floors[0].rooms[0].label is not a key the home map has"),
]


@pytest.mark.parametrize(("mutate", "message"), SHAPE_REFUSALS)
def test_shape_refusals(env, mutate, message) -> None:
    doc = basic()
    mutate(doc)
    assert env.refused_doc(doc) == message


def _wall(doc):
    return _living(doc)["walls"][0]


def _opening(doc):
    return _living(doc)["openings"][0]


def _object_(doc):
    return _living(doc)["objects"][0]


def _pin(doc):
    return _floor(doc)["pins"][0]


PART_REFUSALS = [
    (_drop(_wall, "t"), "doc.floors[0].rooms[0].walls[0].t is missing"),
    (_set(_wall, "t", -0.1), "doc.floors[0].rooms[0].walls[0].t must be between 0 and 10"),
    (_set(_wall, "h", 2.5), "doc.floors[0].rooms[0].walls[0].h is not a key the home map has"),
    (_set(_wall, "a", [0]), "doc.floors[0].rooms[0].walls[0].a must be a list of 2 numbers"),
    (_set(_opening, "kind", "arch"), "doc.floors[0].rooms[0].openings[0].kind must be door, window or opening"),
    (_set(_opening, "kind", None), "doc.floors[0].rooms[0].openings[0].kind must be door, window or opening"),
    (_set(_opening, "z1", 0.5), "doc.floors[0].rooms[0].openings[0].z1 must not be below z0"),
    (_drop(_opening, "z0"), "doc.floors[0].rooms[0].openings[0].z0 is missing"),
    (_set(_object_, "kind", "Sofa"), "doc.floors[0].rooms[0].objects[0].kind must be a RoomPlan category in lower camel case"),
    (_set(_object_, "kind", "sofa bed"), "doc.floors[0].rooms[0].objects[0].kind must be a RoomPlan category in lower camel case"),
    (_set(_object_, "kind", ""), "doc.floors[0].rooms[0].objects[0].kind must be a RoomPlan category in lower camel case"),
    (_set(_object_, "size", [3, 0.9]), "doc.floors[0].rooms[0].objects[0].size must be a list of 3 numbers"),
    (_set(_object_, "size", [3, -0.9, 1]), "doc.floors[0].rooms[0].objects[0].size[1] must be between 0 and 1000"),
    (_drop(_object_, "turn"), "doc.floors[0].rooms[0].objects[0].turn is missing"),
    (_set(_pin, "entityId", "Light.Reading_Lamp"), "doc.floors[0].pins[0].entityId must be an entity id, like light.reading_lamp"),
    (_set(_pin, "entityId", "reading_lamp"), "doc.floors[0].pins[0].entityId must be an entity id, like light.reading_lamp"),
    (_set(_pin, "entityId", None), "doc.floors[0].pins[0].entityId must be an entity id, like light.reading_lamp"),
    (_set(_pin, "roomId", OTHER_UUID), "doc.floors[0].pins[0].roomId names no room of this floor"),
    (_set(_pin, "roomId", "living"), "doc.floors[0].pins[0].roomId must be a UUID"),
    (_set(_pin, "at", [0.8, 3.1]), "doc.floors[0].pins[0].at must be a list of 3 numbers"),
    (_set(_pin, "icon", "mdi:lamp"), "doc.floors[0].pins[0].icon is not a key the home map has"),
    (_drop(_pin, "id"), "doc.floors[0].pins[0].id is missing"),
]


@pytest.mark.parametrize(("mutate", "message"), PART_REFUSALS)
def test_part_refusals(env, mutate, message) -> None:
    doc = basic()
    mutate(doc)
    assert env.refused_doc(doc) == message


def test_a_part_that_is_not_an_object_is_refused(env) -> None:
    for mutate, message in (
        (lambda d: d["floors"].__setitem__(0, []), "doc.floors[0] must be an object"),
        (lambda d: _living(d)["walls"].__setitem__(1, "wall"), "doc.floors[0].rooms[0].walls[1] must be an object"),
        (lambda d: _floor(d)["pins"].__setitem__(4, None), "doc.floors[0].pins[4] must be an object"),
    ):
        doc = basic()
        mutate(doc)
        assert env.refused_doc(doc) == message
    assert env.refused_doc([]) == "doc must be an object"
    assert env.refused_doc(None) == "doc must be an object"


def test_ids_are_unique_across_the_document_whatever_their_case(env) -> None:
    doc = basic()
    _floor(doc)["rooms"][1]["id"] = LIVING.lower()
    assert env.refused_doc(doc) == f"doc.floors[0].rooms[1].id repeats the id {LIVING.lower()}"
    doc = basic()
    _floor(doc)["pins"][2]["id"] = FLOOR
    assert env.refused_doc(doc) == f"doc.floors[0].pins[2].id repeats the id {FLOOR}"
    # A pageId is not one of the map's own ids, so it may repeat.
    doc = basic()
    _living(doc)["pageId"] = _floor(doc)["rooms"][1]["pageId"]
    env.mod.check_document(doc)


def test_a_pin_names_a_room_of_its_own_floor(env) -> None:
    doc = basic()
    second = {
        "id": uuid_n(1),
        "name": "Upstairs",
        "story": 1,
        "rooms": [room(uuid_n(2))],
        "pins": [{"id": uuid_n(3), "entityId": "light.landing", "roomId": LIVING, "at": [0, 0, 2]}],
    }
    doc["floors"].append(second)
    assert env.refused_doc(doc) == "doc.floors[1].pins[0].roomId names no room of this floor"
    second["pins"][0]["roomId"] = uuid_n(2)
    env.mod.check_document(doc)


# ── optional keys and ids ────────────────────────────────────────────────


def test_a_rooms_name_area_and_page_and_a_pins_room_are_optional(env) -> None:
    doc = basic()
    for key in ("name", "areaId", "pageId"):
        _floor(doc)["rooms"][1].pop(key)
    _floor(doc)["pins"][0].pop("roomId")
    env.store.save(doc, 0)
    stored, _rev = env.store.get()
    assert set(stored["floors"][0]["rooms"][1]) == {
        "id", "outline", "height", "walls", "openings", "objects",
    }
    assert set(stored["floors"][0]["pins"][0]) == {"id", "entityId", "at"}
    # A missing pin is still a pin whose entity is gone; the map keeps it.
    assert stored["floors"][0]["pins"][0]["entityId"] == "light.reading_lamp"


def test_ids_are_kept_in_their_own_case(env) -> None:
    doc = basic()
    _floor(doc)["id"] = FLOOR.lower()
    _living(doc)["id"] = LIVING.lower()
    for pin in _floor(doc)["pins"][:3]:
        pin["roomId"] = LIVING.lower()
    _living(doc)["pageId"] = "c3a0e000-0000-4000-8000-0000000000bb"
    checked = env.mod.check_document(doc)
    assert checked["floors"][0]["id"] == FLOOR.lower()
    assert checked["floors"][0]["rooms"][0]["pageId"] == "c3a0e000-0000-4000-8000-0000000000bb"
    assert checked["floors"][0]["pins"][0]["roomId"] == LIVING.lower()
    # A pin's roomId must match its room as written.
    _floor(doc)["pins"][0]["roomId"] = LIVING
    assert env.refused_doc(doc) == "doc.floors[0].pins[0].roomId names no room of this floor"


def test_an_unknown_object_kind_is_kept(env) -> None:
    doc = basic()
    _object_(doc)["kind"] = "washerDryer"
    checked = env.mod.check_document(doc)
    assert checked["floors"][0]["rooms"][0]["objects"][0]["kind"] == "washerDryer"


def test_an_empty_home_is_a_map(env) -> None:
    assert env.store.save({"v": 1, "floors": []}, 0) == 1
    assert env.store.get() == ({"v": 1, "floors": []}, 1)
    assert env.store.has_map is True


# ── limits ───────────────────────────────────────────────────────────────


def _floors(rooms_per_floor: list[int], pins_per_floor: list[int]) -> dict[str, Any]:
    serial = iter(range(1, 100_000))
    floors = []
    for story, (room_count, pin_count) in enumerate(zip(rooms_per_floor, pins_per_floor, strict=True)):
        rooms = [room(uuid_n(next(serial))) for _ in range(room_count)]
        pins = [
            {"id": uuid_n(next(serial)), "entityId": f"light.l{n}", "at": [0, 0, 1]}
            for n in range(pin_count)
        ]
        floors.append(
            {"id": uuid_n(next(serial)), "name": f"Floor {story}", "story": story, "rooms": rooms, "pins": pins}
        )
    return {"v": 1, "floors": floors}


def test_eight_floors_forty_rooms_and_four_hundred_pins_fit(env) -> None:
    doc = _floors([5] * 8, [50] * 8)
    assert env.store.save(doc, 0) == 1


def test_a_ninth_floor_is_refused(env) -> None:
    assert env.refused_doc(_floors([0] * 9, [0] * 9)) == "doc.floors holds at most 8"


def test_the_room_limit_counts_every_floor(env) -> None:
    assert env.refused_doc(_floors([20, 21], [0, 0])) == "the home map holds at most 40 rooms"
    assert env.refused_doc(_floors([41], [0])) == "doc.floors[0].rooms holds at most 40"


def test_the_pin_limit_counts_every_floor(env) -> None:
    assert env.refused_doc(_floors([0, 0], [200, 201])) == "the home map holds at most 400 pins"
    assert env.refused_doc(_floors([0], [401])) == "doc.floors[0].pins holds at most 400"


def test_per_room_lists_have_their_own_caps(env) -> None:
    doc = basic()
    _living(doc)["objects"] = [dict(_object_(doc)) for _ in range(257)]
    assert env.refused_doc(doc) == "doc.floors[0].rooms[0].objects holds at most 256"


def test_a_map_over_256_kib_is_too_large(env) -> None:
    doc = _floors([20], [0])
    sofa = {"kind": "sofa", "c": [2.71, 4.15], "size": [3.01, 0.91, 0.75], "turn": 12.5}
    for item in doc["floors"][0]["rooms"]:
        item["objects"] = [dict(sofa) for _ in range(256)]
    message = env.refused_doc(doc, "too_large")
    assert message.startswith("a home map is at most 256 KiB; this one is ")
    # Measured as stored: compact JSON in UTF-8, after rounding.
    doc["floors"][0]["rooms"] = doc["floors"][0]["rooms"][:3]
    assert env.store.save(doc, 0) == 1


def test_the_size_is_measured_as_stored(env) -> None:
    doc = basic()
    assert env.mod.document_bytes(doc) == len(
        json.dumps(doc, separators=(",", ":"), ensure_ascii=False).encode()
    )
    _floor(doc)["name"] = "Étage"
    assert env.mod.document_bytes(doc) == len(
        json.dumps(doc, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    )


# ── restart, unreadable, unload ──────────────────────────────────────────


def test_the_map_and_rev_survive_a_restart(env) -> None:
    env.store.save(basic(), 0)
    env.store.save(basic(), 1)
    again = env.new_store()
    assert again.get() == (basic(), 2)
    assert again.save(basic(), 2) == 3


def test_a_stored_map_never_reads_as_rev_0(env) -> None:
    FakeStore.files[KEY] = {"rev": 0, "doc": basic()}
    store = env.new_store()
    assert store.get() == (basic(), 1)
    FakeStore.files[KEY] = {"rev": "seven", "doc": basic()}
    assert env.new_store().rev == 1
    FakeStore.files[KEY] = {"rev": 4, "doc": None}
    store = env.new_store()
    assert store.get() == (None, 4) and store.has_map is False


def test_an_unreadable_file_is_refused_and_never_saved_over(env) -> None:
    env.store.save(basic(), 0)
    saved = json.dumps(FakeStore.files[KEY], sort_keys=True)
    FakeStore.unreadable.add(KEY)
    store = env.new_store()
    assert store.available is False and store.has_map is False
    env.store = store
    env.refused(store.get, "unavailable")
    env.refused(lambda: store.save(basic(), 1), "unavailable")
    asyncio.run(store.async_shutdown())
    assert json.dumps(FakeStore.files[KEY], sort_keys=True) == saved


def test_shutdown_writes_a_pending_save_and_then_saves_nothing(env) -> None:
    FakeStore.deferred = True
    env.store.save(basic(), 0)
    assert KEY in FakeStore.pending and KEY not in FakeStore.files
    asyncio.run(env.store.async_shutdown())
    assert FakeStore.files[KEY] == {"rev": 1, "doc": basic()}
    FakeStore.files.pop(KEY)
    env.store.save(basic(), 1)
    FakeStore.fire_pending()
    assert KEY not in FakeStore.files


def test_the_storage_key_and_capability(env) -> None:
    const = sys.modules[f"{_PKG}.const"]
    assert const.HOME_MAP_STORAGE_KEY == KEY
    assert const.HOME_MAP_STORAGE_VERSION == 1
    assert const.HOME_MAP_CAPABILITY == "home_map"
