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
optional keys, ids kept in their own case, the editor's keys (the home
style with its defaults dropped, a room's finish, a hidden object, an
opening's style, a pin's name, icon, reading, glow, glow colour, glow
spill, tap and page: each accepted, refused, rounded and kept in the contract's order), a
restart, an unreadable file never saved over, and unload.

And the scans kept beside the map: the backfill of every room once when
there is no scans file, a save with ``scanned`` recording the rooms it names
and every room not yet recorded, a panel save recording none, records of
rooms gone from the map dropped on every save, a bad ``scanned`` refused
with nothing moved, ids matched whatever their case, the map's rev never
moved by them, an unreadable scans file left alone while the map goes on,
and unload writing a pending scans save.
"""

from __future__ import annotations

import asyncio
import contextlib
import copy
import importlib.util
import json
import math
import re
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
    (_set(_pin, "label", "Lamp"), "doc.floors[0].pins[0].label is not a key the home map has"),
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


# ── the editor's keys ────────────────────────────────────────────────────

PAGE = "C3A0E000-0000-4000-8000-0000000000CC"


def _keys(value: dict[str, Any]) -> list[str]:
    return list(value.keys())


def test_the_home_style_is_kept_without_its_defaults_and_before_the_floors(env) -> None:
    doc = basic()
    # Sent in another order, and after the floors.
    doc["style"] = {"glow": False, "devices": "all", "turn": 40, "look": "night", "names": False, "furniture": False}
    checked = env.mod.check_document(doc)
    assert _keys(checked) == ["v", "style", "floors"]
    assert _keys(checked["style"]) == ["look", "turn", "names", "devices", "furniture", "glow"]
    assert checked["style"] == {
        "look": "night", "turn": 40, "names": False, "devices": "all", "furniture": False, "glow": False,
    }
    # Defaults are dropped, and a style left empty goes.
    doc["style"] = {"look": "plan", "turn": -28, "names": True, "devices": "lights", "furniture": True, "glow": True}
    assert _keys(env.mod.check_document(doc)) == ["v", "floors"]
    doc["style"] = {}
    assert _keys(env.mod.check_document(doc)) == ["v", "floors"]
    doc["style"] = {"look": "clay", "glow": True}
    assert env.mod.check_document(doc)["style"] == {"look": "clay"}


def test_the_home_styles_turn_is_whole_degrees(env) -> None:
    doc = basic()
    doc["style"] = {"turn": 12.4}
    assert env.mod.check_document(doc)["style"] == {"turn": 12}
    doc["style"] = {"turn": -27.6}  # rounds to the default, so it goes
    assert "style" not in env.mod.check_document(doc)
    for turn in (180, -180):
        doc["style"] = {"turn": turn}
        assert env.mod.check_document(doc)["style"] == {"turn": turn}


STYLE_REFUSALS = [
    ({"look": "glow"}, "doc.style.look must be plan, night, warm, lines, clay, blueprint or dots"),
    ({"look": None}, "doc.style.look must be plan, night, warm, lines, clay, blueprint or dots"),
    ({"turn": 181}, "doc.style.turn must be a whole number between -180 and 180"),
    ({"turn": "40"}, "doc.style.turn must be a whole number between -180 and 180"),
    ({"turn": True}, "doc.style.turn must be a whole number between -180 and 180"),
    ({"turn": math.nan}, "doc.style.turn must be a whole number between -180 and 180"),
    ({"names": 0}, "doc.style.names must be true or false"),
    ({"devices": "some"}, "doc.style.devices must be lights, all or none"),
    ({"furniture": "no"}, "doc.style.furniture must be true or false"),
    ({"glow": None}, "doc.style.glow must be true or false"),
    ({"tapLights": True}, "doc.style.tapLights is not a key the home map has"),
    ([], "doc.style must be an object"),
]


@pytest.mark.parametrize(("style", "message"), STYLE_REFUSALS)
def test_style_refusals(env, style, message) -> None:
    doc = basic()
    doc["style"] = style
    assert env.refused_doc(doc) == message


def test_a_rooms_finish(env) -> None:
    doc = basic()
    living = _living(doc)
    # Sent last; kept after pageId's place and before the outline.
    living["finish"] = "carpet"
    living["pageId"] = PAGE
    checked = env.mod.check_document(doc)
    assert _keys(checked["floors"][0]["rooms"][0]) == [
        "id", "name", "areaId", "pageId", "finish", "outline", "height", "walls", "openings", "objects",
    ]
    for finish in ("wood", "tile", "stone", "carpet", "plain"):
        living["finish"] = finish
        assert env.mod.check_document(doc)["floors"][0]["rooms"][0]["finish"] == finish
    living["finish"] = "marble"
    assert env.refused_doc(doc) == "doc.floors[0].rooms[0].finish must be wood, tile, stone, carpet or plain"


def test_a_hidden_object(env) -> None:
    doc = basic()
    _object_(doc)["hidden"] = True
    _living(doc)["objects"][1] = {"hidden": False, **_living(doc)["objects"][1]}
    checked = env.mod.check_document(doc)
    objects = checked["floors"][0]["rooms"][0]["objects"]
    assert _keys(objects[0]) == ["kind", "c", "size", "turn", "hidden"]
    assert objects[0]["hidden"] is True
    # Shown is the default and is never stored.
    assert "hidden" not in objects[1]
    _object_(doc)["hidden"] = 1
    assert env.refused_doc(doc) == "doc.floors[0].rooms[0].objects[0].hidden must be true or false"


def test_an_openings_style(env) -> None:
    doc = basic()
    window, door, way = _living(doc)["openings"]
    window["style"] = "sliding"
    door["style"] = "double"
    checked = env.mod.check_document(doc)
    openings = checked["floors"][0]["rooms"][0]["openings"]
    assert _keys(openings[0]) == ["kind", "style", "a", "b", "z0", "z1"]
    assert [o.get("style") for o in openings] == ["sliding", "double", None]
    door["style"] = "sliding"
    assert env.mod.check_document(doc)["floors"][0]["rooms"][0]["openings"][1]["style"] == "sliding"


OPENING_STYLE_REFUSALS = [
    (0, "double", "doc.floors[0].rooms[0].openings[0].style double is only for a door"),
    (2, "sliding", "doc.floors[0].rooms[0].openings[2].style is only for a door or a window"),
    (2, "double", "doc.floors[0].rooms[0].openings[2].style is only for a door or a window"),
    (1, "french", "doc.floors[0].rooms[0].openings[1].style must be sliding or double"),
    (1, None, "doc.floors[0].rooms[0].openings[1].style must be sliding or double"),
]


@pytest.mark.parametrize(("index", "style", "message"), OPENING_STYLE_REFUSALS)
def test_opening_style_refusals(env, index, style, message) -> None:
    doc = basic()
    _living(doc)["openings"][index]["style"] = style
    assert env.refused_doc(doc) == message


def _full_pin(doc) -> dict[str, Any]:
    pin = _pin(doc)
    # Every key, sent in an order of its own.
    pin.clear()
    pin.update(
        {
            "pageId": PAGE,
            "tap": "page",
            "glowSpill": True,
            "glowColor": "#ffB347",
            "glow": 1.704,
            "reading": "name",
            "icon": "lamp",
            "name": "Floor Lamp",
            "at": [0.8, 3.1, 1.6],
            "roomId": LIVING,
            "entityId": "light.reading_lamp",
            "id": "7B1E0C2A-5D3F-4A8B-9C6D-000000000100",
        }
    )
    return pin


def test_a_pins_editor_keys_in_order_and_rounded(env) -> None:
    doc = basic()
    _full_pin(doc)
    checked = env.mod.check_document(doc)
    pin = checked["floors"][0]["pins"][0]
    assert _keys(pin) == [
        "id", "entityId", "roomId", "at", "name", "icon", "reading", "glow", "glowColor", "glowSpill", "tap",
        "pageId",
    ]
    assert pin["glow"] == 1.7
    assert pin["glowColor"] == "#ffB347"  # kept in its own case
    assert pin["name"] == "Floor Lamp"
    env.store.save(doc, 0)
    assert env.store.get()[0]["floors"][0]["pins"][0] == pin


def test_each_pin_key_choice_is_accepted(env) -> None:
    doc = basic()
    pin = _pin(doc)
    for icon in env.mod.PIN_ICONS:
        pin["icon"] = icon
        env.mod.check_document(doc)
    for reading in ("none", "name"):
        pin["reading"] = reading
        env.mod.check_document(doc)
    for tap in ("toggle", "details", "none"):
        pin["tap"] = tap
        env.mod.check_document(doc)
    for glow in (0.2, 10, 3):
        pin["glow"] = glow
        env.mod.check_document(doc)
    pin["glowColor"] = "warm"
    pin["name"] = "x" * 100
    env.mod.check_document(doc)
    assert len(env.mod.PIN_ICONS) == 16


def _pin_set(key, value):
    return _set(_pin, key, value)


PIN_REFUSALS = [
    (_pin_set("name", ""), "doc.floors[0].pins[0].name must not be empty"),
    (_pin_set("name", "x" * 101), "doc.floors[0].pins[0].name is at most 100 characters"),
    (_pin_set("name", 7), "doc.floors[0].pins[0].name must be text"),
    (_pin_set("icon", "mdi:lamp"), "doc.floors[0].pins[0].icon must be bulb, lamp, ceiling, strip, plug, fan, tv, speaker, thermostat, sensor, motion, door, lock, camera, blinds or vacuum"),
    (_pin_set("reading", "pill"), "doc.floors[0].pins[0].reading must be none or name"),
    (_pin_set("glow", 0.19), "doc.floors[0].pins[0].glow must be between 0.2 and 10"),
    (_pin_set("glow", 10.01), "doc.floors[0].pins[0].glow must be between 0.2 and 10"),
    (_pin_set("glow", "big"), "doc.floors[0].pins[0].glow must be a number"),
    (_pin_set("glowColor", "#FFB34"), "doc.floors[0].pins[0].glowColor must be warm or a colour like #FFB347"),
    (_pin_set("glowColor", "orange"), "doc.floors[0].pins[0].glowColor must be warm or a colour like #FFB347"),
    (_pin_set("glowColor", "#GGB347"), "doc.floors[0].pins[0].glowColor must be warm or a colour like #FFB347"),
    (_pin_set("glowSpill", "yes"), "doc.floors[0].pins[0].glowSpill must be true or false"),
    (_pin_set("glowSpill", None), "doc.floors[0].pins[0].glowSpill must be true or false"),
    (_pin_set("tap", "open"), "doc.floors[0].pins[0].tap must be toggle, details, page or none"),
    (_pin_set("tap", "page"), "doc.floors[0].pins[0].pageId is missing"),
    (_pin_set("pageId", PAGE), "doc.floors[0].pins[0].pageId is only for a pin whose tap is page"),
]


@pytest.mark.parametrize(("mutate", "message"), PIN_REFUSALS)
def test_pin_key_refusals(env, mutate, message) -> None:
    doc = basic()
    mutate(doc)
    assert env.refused_doc(doc) == message


def test_a_pins_glow_spill_is_kept_only_when_true(env) -> None:
    doc = basic()
    pin = _pin(doc)
    pin["glowSpill"] = True
    assert env.mod.check_document(doc)["floors"][0]["pins"][0]["glowSpill"] is True
    # Staying in the room is the default, never stored.
    pin["glowSpill"] = False
    assert "glowSpill" not in env.mod.check_document(doc)["floors"][0]["pins"][0]
    pin["glowSpell"] = True
    del pin["glowSpill"]
    assert env.refused_doc(doc) == "doc.floors[0].pins[0].glowSpell is not a key the home map has"


def test_a_pins_page_goes_with_tap_page_only(env) -> None:
    doc = basic()
    pin = _pin(doc)
    pin["tap"] = "toggle"
    pin["pageId"] = PAGE
    assert env.refused_doc(doc) == "doc.floors[0].pins[0].pageId is only for a pin whose tap is page"
    pin["tap"] = "page"
    pin["pageId"] = "page-1"
    assert env.refused_doc(doc) == "doc.floors[0].pins[0].pageId must be a UUID"
    pin["pageId"] = PAGE.lower()
    assert env.mod.check_document(doc)["floors"][0]["pins"][0]["pageId"] == PAGE.lower()


def test_an_old_map_reads_the_same(env) -> None:
    # None of the editor's keys: the first version's map, unchanged.
    checked = env.mod.check_document(basic())
    assert json.dumps(checked) == json.dumps(basic())


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
    assert const.HOME_MAP_SCANS_STORAGE_KEY == SCANS_KEY
    assert const.HOME_MAP_SCANS_STORAGE_VERSION == 1
    assert const.HOME_MAP_SCANS_CAPABILITY == "home_map_scans"


# ── scans ────────────────────────────────────────────────────────────────

SCANS_KEY = "wrist_assistant.home_map_scans"
_AT_RE = re.compile(r"\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ")


def shape_of(room: dict[str, Any]) -> dict[str, Any]:
    """What a scan record keeps of a room, without its time."""
    return {key: room[key] for key in ("outline", "walls", "openings", "objects")}


def shapes(records: dict[str, Any]) -> dict[str, Any]:
    """Records by room id, each without its time, every time checked."""
    for record in records.values():
        assert list(record) == ["outline", "walls", "openings", "objects", "at"]
        assert _AT_RE.fullmatch(record["at"]), record["at"]
    return {room_id: shape_of(record) for room_id, record in records.items()}


def moved(doc: dict[str, Any], room_index: int, dx: float) -> dict[str, Any]:
    """``doc`` with one room's outline moved along x."""
    room = doc["floors"][0]["rooms"][room_index]
    room["outline"] = [[x + dx, y] for x, y in room["outline"]]
    return doc


def test_a_first_load_records_every_room_of_the_map_once(env) -> None:
    FakeStore.files = {KEY: {"rev": 3, "doc": basic()}}
    store = env.new_store()
    living, kitchen = basic()["floors"][0]["rooms"]
    assert shapes(store.scans()) == {LIVING: shape_of(living), KITCHEN: shape_of(kitchen)}
    assert shapes(FakeStore.files[SCANS_KEY]) == shapes(store.scans())
    # The map and its rev are as they were.
    assert store.get() == (basic(), 3)
    assert FakeStore.files[KEY] == {"rev": 3, "doc": basic()}
    # Once: a restart with the scans file there records nothing again,
    # even rooms the map gained since.
    FakeStore.files[SCANS_KEY] = {}
    assert env.new_store().scans() == {}


def test_a_first_load_with_no_map_still_writes_the_file(env) -> None:
    assert env.store.scans() == {}
    assert FakeStore.files[SCANS_KEY] == {}
    env.store.save(basic(), 0)
    # A panel save records nothing, and the restart does not backfill.
    assert env.new_store().scans() == {}


def test_a_save_with_scanned_records_those_rooms_and_every_room_not_yet_recorded(env) -> None:
    assert env.store.save(basic(), 0, scanned=[LIVING]) == 1
    living, kitchen = basic()["floors"][0]["rooms"]
    assert shapes(env.store.scans()) == {LIVING: shape_of(living), KITCHEN: shape_of(kitchen)}
    # The kitchen, recorded and not named, keeps its record; the living
    # room, named, is recorded again as saved.
    doc = moved(moved(basic(), 0, 1), 1, 1)
    assert env.store.save(doc, 1, scanned=[LIVING]) == 2
    assert shapes(env.store.scans()) == {
        LIVING: shape_of(doc["floors"][0]["rooms"][0]),
        KITCHEN: shape_of(kitchen),
    }
    assert shapes(FakeStore.files[SCANS_KEY]) == shapes(env.store.scans())
    # The map file holds the map alone.
    assert FakeStore.files[KEY] == {"rev": 2, "doc": doc}


def test_an_empty_scanned_records_only_rooms_not_yet_recorded(env) -> None:
    FakeStore.files = {KEY: {"rev": 1, "doc": basic()}, SCANS_KEY: {}}
    store = env.new_store()
    assert store.save(basic(), 1, scanned=[]) == 2
    assert set(store.scans()) == {LIVING, KITCHEN}


def test_a_save_without_scanned_records_nothing(env) -> None:
    env.store.save(basic(), 0)
    assert env.store.scans() == {}
    env.store.save(basic(), 1, scanned=None)
    assert env.store.scans() == {}
    # Nor does it change a record: the living room moved in the panel
    # keeps the shape it was scanned with.
    env.store.save(basic(), 2, scanned=[LIVING])
    before = env.store.scans()
    env.store.save(moved(basic(), 0, 2), 3)
    assert env.store.scans() == before


def test_every_save_drops_the_records_of_rooms_gone_from_the_map(env) -> None:
    env.store.save(basic(), 0, scanned=[LIVING, KITCHEN])
    doc = basic()
    doc["floors"][0]["rooms"].pop()
    doc["floors"][0]["pins"] = [p for p in doc["floors"][0]["pins"] if p.get("roomId") != KITCHEN]
    env.store.save(doc, 1)
    assert set(env.store.scans()) == {LIVING}
    assert set(FakeStore.files[SCANS_KEY]) == {LIVING}
    # The kitchen back on the map has no record until it is scanned.
    env.store.save(basic(), 2)
    assert set(env.store.scans()) == {LIVING}


def test_scanned_ids_match_whatever_their_case(env) -> None:
    env.store.save(basic(), 0, scanned=[LIVING.lower()])
    # Kept under the map's own spelling.
    assert set(env.store.scans()) == {LIVING, KITCHEN}
    doc = moved(basic(), 0, 1)
    env.store.save(doc, 1, scanned=[LIVING.lower()])
    assert env.store.scans()[LIVING]["outline"] == doc["floors"][0]["rooms"][0]["outline"]
    assert set(FakeStore.files[SCANS_KEY]) == {LIVING, KITCHEN}


@pytest.mark.parametrize(
    ("scanned", "message"),
    [
        ("living", "scanned must be a list"),
        ({"id": LIVING}, "scanned must be a list"),
        ([LIVING] * 41, "scanned holds at most 40"),
        ([LIVING, 7], "scanned[1] must be a UUID"),
        (["living"], "scanned[0] must be a UUID"),
        ([LIVING, OTHER_UUID], "scanned[1] names no room of the map"),
        # A floor is not a room.
        ([FLOOR], "scanned[0] names no room of the map"),
    ],
)
def test_a_bad_scanned_is_refused_and_nothing_moves(env, scanned, message) -> None:
    env.store.save(basic(), 0)
    before = (copy.deepcopy(FakeStore.files), env.store.rev, env.store.scans())
    assert env.refused(lambda: env.store.save(moved(basic(), 0, 1), 1, scanned=scanned), "invalid").message == message
    assert (FakeStore.files, env.store.rev, env.store.scans()) == before


def test_a_stale_save_with_scanned_records_nothing(env) -> None:
    env.store.save(basic(), 0)
    env.refused(lambda: env.store.save(basic(), 0, scanned=[LIVING]), "conflict")
    assert env.store.scans() == {}


def test_scans_survive_a_restart(env) -> None:
    env.store.save(basic(), 0, scanned=[LIVING])
    held = env.store.scans()
    assert env.new_store().scans() == held


def test_an_unreadable_scans_file_is_left_alone_while_the_map_goes_on(env) -> None:
    FakeStore.files = {KEY: {"rev": 1, "doc": basic()}, SCANS_KEY: {"x": "damaged"}}
    FakeStore.unreadable.add(SCANS_KEY)
    store = env.new_store()
    env.refused(store.scans, "unavailable")
    assert store.save(basic(), 1, scanned=[LIVING]) == 2
    assert store.get() == (basic(), 2)
    asyncio.run(store.async_shutdown())
    assert FakeStore.files[SCANS_KEY] == {"x": "damaged"}


def test_an_unreadable_map_backfills_nothing(env) -> None:
    FakeStore.files = {KEY: {"rev": 1, "doc": basic()}}
    FakeStore.unreadable.add(KEY)
    store = env.new_store()
    env.refused(store.scans, "unavailable")
    assert SCANS_KEY not in FakeStore.files


def test_shutdown_writes_a_pending_scans_save(env) -> None:
    FakeStore.deferred = True
    env.store.save(basic(), 0, scanned=[LIVING])
    assert SCANS_KEY in FakeStore.pending
    asyncio.run(env.store.async_shutdown())
    assert set(FakeStore.files[SCANS_KEY]) == {LIVING, KITCHEN}
    assert SCANS_KEY not in FakeStore.pending
