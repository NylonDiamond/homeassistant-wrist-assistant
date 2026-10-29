"""The home's map, kept by Home Assistant.

Home map (``docs/home_map_plan_2026-10.md`` in the app repo, "Contract").
One document for the whole home, as with the page photos: its floors, each
floor's rooms (an outline, walls, doors and windows, big furniture as plain
boxes) and the pins that put a device on the plan. Units are meters; the
plan is seen from above, x to the right, y down the screen, z up. The iPhone
scans the rooms and saves the map with the signed ``home_map_put``, the
panel saves it over ``home_map/save``, and every device reads it with
``home_map_get`` or ``home_map/get``.

The store keeps the document and ``rev``, a number that starts at 0 and goes
up by one on each save. A save names the ``rev`` it was made from
(``base_rev``). When the store has moved on, the save is refused
``conflict`` with the current ``rev``: the writer reads again, puts its
change on top and saves again. The iPhone and the panel can both move pins,
so this keeps one from silently undoing the other. Every delta reply names
the ``rev`` as ``home_map_rev`` while a map is stored, which is how a watch
learns to fetch the map again.

Every save is checked whole by :func:`check_document`, and any failure
refuses the whole save: the shape below, the limits (256 KiB for the whole
document as stored, 8 floors, 40 rooms and 400 pins in all), ids shaped like
UUIDs and unique across the document, entity ids shaped like entity ids,
every number finite and within range. Numbers are kept to 2 decimals (1 cm),
rounded rather than refused. A key the contract does not name is refused,
so a writer that drifts from it hears so at once::

    {"v": 1,
     "style"?: {"look"?, "turn"?, "names"?, "devices"?, "furniture"?,
                "glow"?},
     "floors": [{"id", "name", "story": <int>,
                 "rooms": [{"id", "name"?, "areaId"?, "pageId"?,
                            "finish"?: "wood" | "tile" | "stone" |
                                       "carpet" | "plain",
                            "floorColor"?, "wallColor"?,
                            "outline": [[x, y], ...], "height",
                            "walls": [{"a": [x, y], "b": [x, y], "t"}],
                            "openings": [{"kind": "door" | "window" |
                                          "opening",
                                          "style"?: "sliding" | "double",
                                          "a", "b", "z0", "z1"}],
                            "objects": [{"kind", "model"?, "fabric"?,
                                         "wood"?, "light"?, "c": [x, y],
                                         "size": [w, d, h], "turn",
                                         "lift"?, "hidden"?: true}]}],
                 "pins": [{"id", "entityId", "roomId"?, "at": [x, y, z],
                           "name"?, "icon"?, "reading"?: "none" | "name",
                           "glow"?, "glowColor"?, "glowSpill"?: true,
                           "tap"?: "toggle" | "details" | "page" |
                           "none", "pageId"?}]}]}

A pin's ``roomId``, when it has one, names a room of the same floor. Whether
its ``entityId`` exists is not checked: a pin whose entity the home no
longer has is kept and drawn gray. An object's ``kind`` is the RoomPlan
category in lower camel case, any such word, since a device draws a kind it
does not know as a plain box.

The keys after the first version's are all optional, and a default is never
stored: the key is left out, so a map written before them reads the same.
``style`` is the home style, what every Home map tile starts with when the
tile has no key of its own: ``look`` (plan, night, warm, lines, clay,
blueprint or dots; plan when absent), ``turn`` (whole degrees, -180 to 180;
-28), ``names``, ``furniture`` and ``glow`` (true or false; true) and
``devices`` (lights, all or none; lights). A default sent in ``style`` is
dropped, and so is a ``style`` left empty. A room's ``finish`` names what
its floor is laid with; absent, it is picked from the room's name and
furniture. A room's ``floorColor`` and ``wallColor`` (``#RRGGBB`` in either
case, kept as sent) paint its floor and its walls' faces in the plan, night,
warm and clay looks and the 3D views; absent, they keep their own colours.
An object's ``lift`` is how far its bottom stands above the
floor in meters (0 to 100: a TV on the wall, a lamp on a table); 0 is
dropped. An object with ``hidden`` is drawn nowhere but kept, so an editor
can show it again; a false ``hidden`` is dropped. An object's ``model``
names the piece of the furniture catalog its 3D look draws (``bedDouble``,
``lampRoundFloor``), checked as a name in lower camel case only and never
against the catalog, so a newer catalog's pieces survive an older reader;
absent, the look picks one by the object's kind. An object's ``fabric``
and ``wood`` (``#RRGGBB`` in either case, kept as sent) recolour its 3D
model's fabric and wood parts; absent, the model keeps its own colours.
They are kept on any object whatever its kind or model. An object's
``light`` is the ``id`` of a pin of the same floor that the object, a lamp,
holds: the light it is. It is checked as shaped like a pin id (a UUID) only,
never that such a pin exists, as a pin's ``entityId`` is never checked
against the home. A reader ignores a ``light`` that names no pin of the
floor, a pin whose entity is not a ``light.*``, or a pin an earlier object
already holds (the floor's rooms in order, each room's objects in order), so
one pin is held by at most one lamp. The editor always writes the held pin's
``at`` where the lamp's bulb is, so a reader that ignores ``light`` still
draws the light in the right place. A ``light.*`` entity may have any number
of pins (six ceiling lamps on one light group). An opening's ``style`` is
``double`` (a door only: two leaves meeting in the middle) or ``sliding`` (a
door or a window); a plain opening takes none. A pin's ``name`` (1 to 100
characters) and ``icon`` (one of ``PIN_ICONS``) stand in for the entity's
own; ``reading`` shows the pin's name in its pill (``name``) or no pill
(``none``); ``glow`` is a light's pool of light in meters (0.2 to 10) and
``glowColor`` ``warm`` or ``#RRGGBB`` in either case; the pool stays inside
the pin's room, its walls stopping it, unless ``glowSpill`` lets it spread
past them into the next rooms (a false ``glowSpill`` is dropped, and a pin
in no room is never stopped); ``tap`` is what a tap
on the pin does, and ``pageId``, the page it opens, goes with ``tap`` page
and only with it.

Scans. Beside the map the store keeps each room as the iPhone scanned it,
in a file of its own (``HOME_MAP_SCANS_STORAGE_KEY``), so the panel can draw
the scan over the plan and put a room back as it was scanned. It is not part
of the map document, and keeping it never moves the map's ``rev``::

    {<room id>: {"outline", "walls", "openings", "objects", "at"}}

Each record is the room's ``outline``, ``walls``, ``openings`` and
``objects`` as the map held them once checked, and ``at``, the time it was
recorded (ISO 8601, UTC). A record is written:

- by an iPhone save that names ``scanned``, the room ids its scan just made
  or replaced (at most 40, each a room of the saved map): each named room,
  and only those, is recorded (again), so a room drawn by hand in the panel
  never gains a record from a scan of another room;
- once, when the integration loads and finds no scans file yet: every room
  of the map then, as first seen, so a map scanned before the scans were
  kept has one.

A panel save never records a room. Every save, the iPhone's and the
panel's, drops the records of rooms no longer on the map. The scans file is
saved with the same delay as the map's; a scans file that cannot be read is
logged and left alone, its records unread and never saved over, while the
map goes on as before. Recording never fails a load or a save of the map:
a room that cannot be recorded is logged and the map is kept all the same.

A file that cannot be read is logged and left alone: every read and save is
then refused ``unavailable`` until a restart reads it, so a damaged map is
never saved over. Unloading writes a pending save at once and stops saving,
as the page photo index does. Uninstalling keeps the file, as it keeps every
other.
"""

from __future__ import annotations

import copy
import json
import logging
import math
import re
from collections.abc import Iterable
from datetime import UTC, datetime
from typing import Any, NoReturn

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    HOME_MAP_SCANS_STORAGE_KEY,
    HOME_MAP_SCANS_STORAGE_VERSION,
    HOME_MAP_STORAGE_KEY,
    HOME_MAP_STORAGE_VERSION,
)

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 1

DOCUMENT_VERSION = 1
MAX_DOCUMENT_BYTES = 256 * 1024
MAX_FLOORS = 8
MAX_ROOMS = 40
MAX_PINS = 400
# Per room, so one damaged scan is refused on its own words rather than as a
# document over its size. A real room has a few dozen of each at most.
MAX_OUTLINE_POINTS = 256
MAX_WALLS = 256
MAX_OPENINGS = 128
MAX_OBJECTS = 256
MAX_NAME_CHARS = 100
# Meters from the plan's origin, either way; a home is far smaller.
MAX_COORDINATE = 10_000
OPENING_KINDS = ("door", "window", "opening")
OPENING_STYLES = ("sliding", "double")
ROOM_FINISHES = ("wood", "tile", "stone", "carpet", "plain")
PIN_ICONS = (
    "bulb", "lamp", "ceiling", "strip", "plug", "fan", "tv", "speaker",
    "thermostat", "sensor", "motion", "door", "lock", "camera", "blinds",
    "vacuum",
)
PIN_READINGS = ("none", "name")
PIN_TAPS = ("toggle", "details", "page", "none")
# A light's pool of light, in meters.
PIN_GLOW_LOW = 0.2
PIN_GLOW_HIGH = 10
STYLE_LOOKS = ("plan", "night", "warm", "lines", "clay", "blueprint", "dots")
STYLE_DEVICES = ("lights", "all", "none")
# The home style's defaults, never stored: a key holding one is dropped.
STYLE_DEFAULTS: dict[str, Any] = {
    "look": "plan",
    "turn": -28,
    "names": True,
    "devices": "lights",
    "furniture": True,
    "glow": True,
}

# Either case: the phone writes upper case, the panel's ids are lower case.
# An id is kept as sent, so a room's pageId still matches its page.
_UUID_RE = re.compile(
    r"[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}"
)
# An entity id as Home Assistant shapes one, as page_images.py reads it.
_ENTITY_ID_RE = re.compile(r"[a-z0-9_]+\.[a-z0-9_]+")
# A Home Assistant area id: a slug of the area's name, or a generated id.
_AREA_ID_RE = re.compile(r"[A-Za-z0-9_-]{1,255}")
# A RoomPlan category in lower camel case: sofa, table, television.
_OBJECT_KIND_RE = re.compile(r"[a-z][A-Za-z0-9]{0,39}")
# A furniture catalog piece's id, shaped the same: bedDouble, lampRoundFloor.
_OBJECT_MODEL_RE = _OBJECT_KIND_RE
# A pin's glow colour other than warm: six hex digits, either case.
_HEX_COLOR_RE = re.compile(r"#[0-9A-Fa-f]{6}")
# What a scan record keeps of a room, in this order, with ``at`` after.
SCAN_KEYS = ("outline", "walls", "openings", "objects")


def _now_iso() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


class HomeMapError(Exception):
    """Base class; ``code`` is the stable reason the WebSocket and the ops
    send back."""

    code = "error"

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class HomeMapInvalidError(HomeMapError):
    code = "invalid"


class HomeMapTooLargeError(HomeMapError):
    code = "too_large"


class HomeMapConflictError(HomeMapError):
    """A save made from a ``rev`` the store has moved past. ``rev`` is the
    stored one, and the message begins ``stored revision is <N>``, as a
    watch config conflict's does, so the panel reads it the same way."""

    code = "conflict"

    def __init__(self, rev: int, base_rev: int) -> None:
        super().__init__(f"stored revision is {rev}, save was based on {base_rev}")
        self.rev = rev


class HomeMapUnavailableError(HomeMapError):
    code = "unavailable"


# ── the checks ───────────────────────────────────────────────────────────


def _fail(path: str, what: str) -> NoReturn:
    raise HomeMapInvalidError(f"{path} {what}")


def _object(
    raw: Any, path: str, required: Iterable[str], optional: Iterable[str] = ()
) -> dict[str, Any]:
    """``raw`` as an object holding every ``required`` key and nothing but
    those and the ``optional`` ones."""
    if not isinstance(raw, dict):
        _fail(path, "must be an object")
    required = tuple(required)
    for key in required:
        if key not in raw:
            _fail(f"{path}.{key}", "is missing")
    unknown = sorted(str(key) for key in raw.keys() - {*required, *optional})
    if unknown:
        _fail(f"{path}.{unknown[0]}", "is not a key the home map has")
    return raw


def _list(raw: Any, path: str, most: int, least: int = 0) -> list[Any]:
    if not isinstance(raw, list):
        _fail(path, "must be a list")
    if len(raw) > most:
        _fail(path, f"holds at most {most}")
    if len(raw) < least:
        _fail(path, f"needs at least {least}")
    return raw


def _number(
    raw: Any, path: str, low: float = -MAX_COORDINATE, high: float = MAX_COORDINATE
) -> int | float:
    """A finite number rounded to 2 decimals, within ``low`` and ``high``
    once rounded. A whole number stays whole; minus zero is zero."""
    if isinstance(raw, bool) or not isinstance(raw, (int, float)):
        _fail(path, "must be a number")
    if isinstance(raw, float) and not math.isfinite(raw):
        _fail(path, "must be a finite number")
    value = round(raw, 2)
    if isinstance(value, float) and value == 0:
        value = 0.0
    if not low <= value <= high:
        _fail(path, f"must be between {low} and {high}")
    return value


def _point(raw: Any, path: str, size: int) -> list[int | float]:
    if not isinstance(raw, list) or len(raw) != size:
        _fail(path, f"must be a list of {size} numbers")
    return [_number(value, f"{path}[{i}]") for i, value in enumerate(raw)]


def _text(raw: Any, path: str) -> str:
    if not isinstance(raw, str):
        _fail(path, "must be text")
    if len(raw) > MAX_NAME_CHARS:
        _fail(path, f"is at most {MAX_NAME_CHARS} characters")
    return raw


def _uuid(raw: Any, path: str) -> str:
    if not isinstance(raw, str) or not _UUID_RE.fullmatch(raw):
        _fail(path, "must be a UUID")
    return raw


def _words(choices: Iterable[str]) -> str:
    """``a, b or c``, as the messages name a key's choices."""
    choices = tuple(choices)
    return ", ".join(choices[:-1]) + " or " + choices[-1]


def _one_of(raw: Any, path: str, choices: tuple[str, ...]) -> str:
    if not isinstance(raw, str) or raw not in choices:
        _fail(path, f"must be {_words(choices)}")
    return raw


def _bool(raw: Any, path: str) -> bool:
    if not isinstance(raw, bool):
        _fail(path, "must be true or false")
    return raw


def _style(raw: Any) -> dict[str, Any]:
    """The home style with its defaults dropped, in the contract's order."""
    style = _object(raw, "doc.style", (), STYLE_DEFAULTS)
    checked: dict[str, Any] = {}
    if "look" in style:
        checked["look"] = _one_of(style["look"], "doc.style.look", STYLE_LOOKS)
    if "turn" in style:
        turn = style["turn"]
        if isinstance(turn, bool) or not isinstance(turn, (int, float)) or not math.isfinite(turn):
            _fail("doc.style.turn", "must be a whole number between -180 and 180")
        turn = round(turn)
        if not -180 <= turn <= 180:
            _fail("doc.style.turn", "must be a whole number between -180 and 180")
        checked["turn"] = turn
    if "names" in style:
        checked["names"] = _bool(style["names"], "doc.style.names")
    if "devices" in style:
        checked["devices"] = _one_of(style["devices"], "doc.style.devices", STYLE_DEVICES)
    for key in ("furniture", "glow"):
        if key in style:
            checked[key] = _bool(style[key], f"doc.style.{key}")
    return {key: value for key, value in checked.items() if value != STYLE_DEFAULTS[key]}


class _Ids:
    """The floor, room and pin ids seen so far: unique across the whole
    document, whatever their case."""

    def __init__(self) -> None:
        self._seen: set[str] = set()

    def take(self, raw: Any, path: str) -> str:
        value = _uuid(raw, path)
        folded = value.upper()
        if folded in self._seen:
            _fail(path, f"repeats the id {value}")
        self._seen.add(folded)
        return value


def _room(raw: Any, path: str, ids: _Ids) -> dict[str, Any]:
    room = _object(
        raw,
        path,
        ("id", "outline", "height", "walls", "openings", "objects"),
        ("name", "areaId", "pageId", "finish", "floorColor", "wallColor"),
    )
    checked: dict[str, Any] = {"id": ids.take(room["id"], f"{path}.id")}
    if "name" in room:
        checked["name"] = _text(room["name"], f"{path}.name")
    if "areaId" in room:
        area_id = room["areaId"]
        if not isinstance(area_id, str) or not _AREA_ID_RE.fullmatch(area_id):
            _fail(f"{path}.areaId", "must be a Home Assistant area id")
        checked["areaId"] = area_id
    if "pageId" in room:
        checked["pageId"] = _uuid(room["pageId"], f"{path}.pageId")
    if "finish" in room:
        checked["finish"] = _one_of(room["finish"], f"{path}.finish", ROOM_FINISHES)
    for part in ("floorColor", "wallColor"):
        if part in room:
            color = room[part]
            if not isinstance(color, str) or not _HEX_COLOR_RE.fullmatch(color):
                _fail(f"{path}.{part}", "must be a colour like #8E8E93")
            checked[part] = color
    checked["outline"] = [
        _point(point, f"{path}.outline[{i}]", 2)
        for i, point in enumerate(
            _list(room["outline"], f"{path}.outline", MAX_OUTLINE_POINTS, least=3)
        )
    ]
    checked["height"] = _number(room["height"], f"{path}.height", 0.01, 100)
    walls = []
    for i, raw_wall in enumerate(_list(room["walls"], f"{path}.walls", MAX_WALLS)):
        where = f"{path}.walls[{i}]"
        wall = _object(raw_wall, where, ("a", "b", "t"))
        walls.append(
            {
                "a": _point(wall["a"], f"{where}.a", 2),
                "b": _point(wall["b"], f"{where}.b", 2),
                "t": _number(wall["t"], f"{where}.t", 0, 10),
            }
        )
    checked["walls"] = walls
    openings = []
    for i, raw_opening in enumerate(
        _list(room["openings"], f"{path}.openings", MAX_OPENINGS)
    ):
        where = f"{path}.openings[{i}]"
        opening = _object(raw_opening, where, ("kind", "a", "b", "z0", "z1"), ("style",))
        kind = opening["kind"]
        if not isinstance(kind, str) or kind not in OPENING_KINDS:
            _fail(f"{where}.kind", "must be door, window or opening")
        checked_opening: dict[str, Any] = {"kind": kind}
        if "style" in opening:
            style = _one_of(opening["style"], f"{where}.style", OPENING_STYLES)
            if kind == "opening":
                _fail(f"{where}.style", "is only for a door or a window")
            if kind == "window" and style == "double":
                _fail(f"{where}.style", "double is only for a door")
            checked_opening["style"] = style
        z0 = _number(opening["z0"], f"{where}.z0")
        z1 = _number(opening["z1"], f"{where}.z1")
        if z1 < z0:
            _fail(f"{where}.z1", "must not be below z0")
        checked_opening["a"] = _point(opening["a"], f"{where}.a", 2)
        checked_opening["b"] = _point(opening["b"], f"{where}.b", 2)
        checked_opening["z0"] = z0
        checked_opening["z1"] = z1
        openings.append(checked_opening)
    checked["openings"] = openings
    objects = []
    for i, raw_object in enumerate(_list(room["objects"], f"{path}.objects", MAX_OBJECTS)):
        where = f"{path}.objects[{i}]"
        item = _object(
            raw_object,
            where,
            ("kind", "c", "size", "turn"),
            ("model", "fabric", "wood", "light", "lift", "hidden"),
        )
        kind = item["kind"]
        if not isinstance(kind, str) or not _OBJECT_KIND_RE.fullmatch(kind):
            _fail(f"{where}.kind", "must be a RoomPlan category in lower camel case")
        size = item["size"]
        if not isinstance(size, list) or len(size) != 3:
            _fail(f"{where}.size", "must be a list of 3 numbers")
        checked_object: dict[str, Any] = {"kind": kind}
        # A name only, never looked up, so a newer catalog's pieces are kept.
        if "model" in item:
            model = item["model"]
            if not isinstance(model, str) or not _OBJECT_MODEL_RE.fullmatch(model):
                _fail(
                    f"{where}.model", "must be a furniture piece's name in lower camel case"
                )
            checked_object["model"] = model
        # Kept on any object, as sent, whatever its kind: a plain box ignores them.
        for part in ("fabric", "wood"):
            if part in item:
                color = item[part]
                if not isinstance(color, str) or not _HEX_COLOR_RE.fullmatch(color):
                    _fail(f"{where}.{part}", "must be a colour like #8E8E93")
                checked_object[part] = color
        # The pin the lamp holds, by its id's shape only: whether a pin of the
        # floor has it is never checked, as a pin's entity id never is.
        if "light" in item:
            light = item["light"]
            if not isinstance(light, str) or not _UUID_RE.fullmatch(light):
                _fail(f"{where}.light", "must be a pin's id, a UUID")
            checked_object["light"] = light
        checked_object["c"] = _point(item["c"], f"{where}.c", 2)
        checked_object["size"] = [
            _number(value, f"{where}.size[{j}]", 0, 1000) for j, value in enumerate(size)
        ]
        checked_object["turn"] = _number(item["turn"], f"{where}.turn")
        # On the floor is the default, so a lift of 0 is left out.
        if "lift" in item:
            lift = _number(item["lift"], f"{where}.lift", 0, 100)
            if lift > 0:
                checked_object["lift"] = lift
        # Shown is the default, so a false hidden is left out.
        if "hidden" in item and _bool(item["hidden"], f"{where}.hidden"):
            checked_object["hidden"] = True
        objects.append(checked_object)
    checked["objects"] = objects
    return checked


def _pin(raw: Any, path: str, ids: _Ids, room_ids: set[str]) -> dict[str, Any]:
    pin = _object(
        raw,
        path,
        ("id", "entityId", "at"),
        ("roomId", "name", "icon", "reading", "glow", "glowColor", "glowSpill", "tap", "pageId"),
    )
    checked: dict[str, Any] = {"id": ids.take(pin["id"], f"{path}.id")}
    entity_id = pin["entityId"]
    if not isinstance(entity_id, str) or not _ENTITY_ID_RE.fullmatch(entity_id):
        _fail(f"{path}.entityId", "must be an entity id, like light.reading_lamp")
    checked["entityId"] = entity_id
    if "roomId" in pin:
        room_id = _uuid(pin["roomId"], f"{path}.roomId")
        if room_id not in room_ids:
            _fail(f"{path}.roomId", "names no room of this floor")
        checked["roomId"] = room_id
    checked["at"] = _point(pin["at"], f"{path}.at", 3)
    if "name" in pin:
        name = _text(pin["name"], f"{path}.name")
        if name == "":
            _fail(f"{path}.name", "must not be empty")
        checked["name"] = name
    if "icon" in pin:
        checked["icon"] = _one_of(pin["icon"], f"{path}.icon", PIN_ICONS)
    if "reading" in pin:
        checked["reading"] = _one_of(pin["reading"], f"{path}.reading", PIN_READINGS)
    if "glow" in pin:
        checked["glow"] = _number(pin["glow"], f"{path}.glow", PIN_GLOW_LOW, PIN_GLOW_HIGH)
    if "glowColor" in pin:
        color = pin["glowColor"]
        if not isinstance(color, str) or (color != "warm" and not _HEX_COLOR_RE.fullmatch(color)):
            _fail(f"{path}.glowColor", "must be warm or a colour like #FFB347")
        checked["glowColor"] = color
    # Staying in the room is the default, so a false glowSpill is left out.
    if "glowSpill" in pin and _bool(pin["glowSpill"], f"{path}.glowSpill"):
        checked["glowSpill"] = True
    tap = None
    if "tap" in pin:
        tap = checked["tap"] = _one_of(pin["tap"], f"{path}.tap", PIN_TAPS)
    if "pageId" in pin:
        if tap != "page":
            _fail(f"{path}.pageId", "is only for a pin whose tap is page")
        checked["pageId"] = _uuid(pin["pageId"], f"{path}.pageId")
    elif tap == "page":
        _fail(f"{path}.pageId", "is missing")
    return checked


def check_document(raw: Any) -> dict[str, Any]:
    """The map as stored: ``raw`` checked by the rules in the module
    docstring, its numbers rounded to 2 decimals and its keys in the
    contract's order. A new object; ``raw`` is not changed. ``invalid`` for
    anything off the contract (the message says where), ``too_large`` for a
    map over 256 KiB as stored."""
    doc = _object(raw, "doc", ("v", "floors"), ("style",))
    version = doc["v"]
    if isinstance(version, bool) or version != DOCUMENT_VERSION:
        _fail("doc.v", f"must be {DOCUMENT_VERSION}")
    style = _style(doc["style"]) if "style" in doc else {}
    ids = _Ids()
    rooms_in_all = 0
    pins_in_all = 0
    floors = []
    for i, raw_floor in enumerate(_list(doc["floors"], "doc.floors", MAX_FLOORS)):
        path = f"doc.floors[{i}]"
        floor = _object(raw_floor, path, ("id", "name", "story", "rooms", "pins"))
        floor_id = ids.take(floor["id"], f"{path}.id")
        name = _text(floor["name"], f"{path}.name")
        story = floor["story"]
        if isinstance(story, bool) or not isinstance(story, int) or not -100 <= story <= 100:
            _fail(f"{path}.story", "must be a whole number between -100 and 100")
        raw_rooms = _list(floor["rooms"], f"{path}.rooms", MAX_ROOMS)
        rooms_in_all += len(raw_rooms)
        if rooms_in_all > MAX_ROOMS:
            raise HomeMapInvalidError(f"the home map holds at most {MAX_ROOMS} rooms")
        rooms = [
            _room(room, f"{path}.rooms[{j}]", ids) for j, room in enumerate(raw_rooms)
        ]
        raw_pins = _list(floor["pins"], f"{path}.pins", MAX_PINS)
        pins_in_all += len(raw_pins)
        if pins_in_all > MAX_PINS:
            raise HomeMapInvalidError(f"the home map holds at most {MAX_PINS} pins")
        room_ids = {room["id"] for room in rooms}
        pins = [
            _pin(pin, f"{path}.pins[{j}]", ids, room_ids) for j, pin in enumerate(raw_pins)
        ]
        floors.append(
            {"id": floor_id, "name": name, "story": story, "rooms": rooms, "pins": pins}
        )
    checked: dict[str, Any] = {"v": DOCUMENT_VERSION}
    if style:
        checked["style"] = style
    checked["floors"] = floors
    size = document_bytes(checked)
    if size > MAX_DOCUMENT_BYTES:
        raise HomeMapTooLargeError(
            f"a home map is at most {MAX_DOCUMENT_BYTES // 1024} KiB; this one is "
            f"{math.ceil(size / 1024)} KiB"
        )
    return checked


def document_bytes(doc: Any) -> int:
    """The size of a map as stored and sent: compact JSON in UTF-8."""
    return len(json.dumps(doc, separators=(",", ":"), ensure_ascii=False).encode())


def _rooms_of(doc: dict[str, Any] | None) -> list[dict[str, Any]]:
    """Every room of a checked map, floor by floor."""
    if doc is None:
        return []
    return [room for floor in doc["floors"] for room in floor["rooms"]]


def check_scanned(raw: Any) -> list[str]:
    """A save's ``scanned``: a list of at most ``MAX_ROOMS`` UUIDs. Whether
    each names a room of the map is checked once the map is."""
    ids = _list(raw, "scanned", MAX_ROOMS)
    return [_uuid(value, f"scanned[{i}]") for i, value in enumerate(ids)]


def scan_record(room: dict[str, Any], at: str) -> dict[str, Any]:
    """A checked room as its scan record keeps it."""
    record = {key: copy.deepcopy(room[key]) for key in SCAN_KEYS}
    record["at"] = at
    return record


# ── the store ────────────────────────────────────────────────────────────


class HomeMapStore:
    """The map document and its ``rev`` in ``.storage``, and each room's
    scan beside it."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store = Store(hass, HOME_MAP_STORAGE_VERSION, HOME_MAP_STORAGE_KEY)
        self._doc: dict[str, Any] | None = None
        self._rev = 0
        self._load_failed = False
        self._save_pending = False
        self._closed = False
        self._scans_store: Store = Store(
            hass, HOME_MAP_SCANS_STORAGE_VERSION, HOME_MAP_SCANS_STORAGE_KEY
        )
        self._scans: dict[str, dict[str, Any]] = {}
        self._scans_failed = False
        self._scans_save_pending = False

    # ── persistence ────────────────────────────────────────────────────

    async def async_load(self) -> None:
        try:
            data = await self._store.async_load()
        except Exception:  # A damaged file: see the module docstring.
            _LOGGER.exception(
                "The home map could not be read; it is left alone and refused "
                "until a restart reads it"
            )
            self._load_failed = True
            return
        if isinstance(data, dict):
            rev = data.get("rev")
            doc = data.get("doc")
            if isinstance(rev, int) and not isinstance(rev, bool) and rev >= 0:
                self._rev = rev
            if isinstance(doc, dict):
                # It passed the checks when it was saved. A stored map always
                # has a rev of at least 1, so a device holding 0 never takes
                # it for the map it has.
                self._doc = doc
                self._rev = max(self._rev, 1)
        await self._async_load_scans()

    async def _async_load_scans(self) -> None:
        """The scans, or, the first time there is no file, every room of the
        map recorded as first seen."""
        try:
            data = await self._scans_store.async_load()
        except Exception:  # A damaged file: see the module docstring.
            _LOGGER.exception(
                "The home map's scans could not be read; they are left alone "
                "until a restart reads them"
            )
            self._scans_failed = True
            return
        if data is None:
            # Saved even when the map has no rooms, so this happens once. A
            # stored map whose rooms cannot be recorded never stops the map
            # loading: the scans are then left unread until a restart.
            try:
                at = _now_iso()
                self._scans = {room["id"]: scan_record(room, at) for room in _rooms_of(self._doc)}
            except Exception:
                _LOGGER.exception("The home map's rooms could not be recorded as first seen")
                self._scans = {}
                self._scans_failed = True
                return
            self._schedule_scans_save()
            return
        if isinstance(data, dict):
            # Each record passed the checks with its map when it was kept.
            self._scans = {
                key: value
                for key, value in data.items()
                if isinstance(key, str) and isinstance(value, dict)
            }

    def _serialize(self) -> dict[str, Any]:
        return {"rev": self._rev, "doc": self._doc}

    def _serialize_scans(self) -> dict[str, Any]:
        return self._scans

    def _schedule_save(self) -> None:
        if self._closed or self._load_failed:
            return
        self._save_pending = True
        self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)

    def _schedule_scans_save(self) -> None:
        if self._closed or self._scans_failed:
            return
        self._scans_save_pending = True
        self._scans_store.async_delay_save(self._serialize_scans, _SAVE_DEBOUNCE_SECONDS)

    async def async_shutdown(self) -> None:
        """Called on unload: write a save still waiting out its debounce now
        and save nothing after, so a re-added entry reads what was saved."""
        self._closed = True
        # The map first, so a scans file that cannot be written never costs
        # the map its save.
        if self._save_pending and not self._load_failed:
            self._save_pending = False
            await self._store.async_save(self._serialize())
        if self._scans_save_pending and not self._scans_failed:
            self._scans_save_pending = False
            await self._scans_store.async_save(self._serialize_scans())

    def _check_available(self) -> None:
        if self._load_failed:
            raise HomeMapUnavailableError("the stored home map could not be read")

    # ── reads ──────────────────────────────────────────────────────────

    @property
    def available(self) -> bool:
        return not self._load_failed

    @property
    def has_map(self) -> bool:
        """Whether a map is stored (and the file could be read)."""
        return not self._load_failed and self._doc is not None

    @property
    def rev(self) -> int:
        """The stored rev: 0 before the first save."""
        return self._rev

    def get(self) -> tuple[dict[str, Any] | None, int]:
        """(a copy of the map, or None when none is stored, its rev).
        ``unavailable`` while the file could not be read."""
        self._check_available()
        return copy.deepcopy(self._doc), self._rev

    def scans(self) -> dict[str, dict[str, Any]]:
        """A copy of the scan record of each room of the map that has one,
        by the room's id as the map spells it. ``unavailable`` while the map
        or the scans could not be read."""
        self._check_available()
        if self._scans_failed:
            raise HomeMapUnavailableError("the stored scans of the home map could not be read")
        records = {key.upper(): value for key, value in self._scans.items()}
        return {
            room["id"]: copy.deepcopy(records[room["id"].upper()])
            for room in _rooms_of(self._doc)
            if room["id"].upper() in records
        }

    # ── writes ─────────────────────────────────────────────────────────

    def save(self, raw_doc: Any, base_rev: Any, scanned: Any = None) -> int:
        """Keep a map made from ``base_rev``. Returns the new rev.

        The map is checked first (:func:`check_document`): ``invalid`` or
        ``too_large``. ``invalid`` too for a ``base_rev`` that is not a
        whole number of 0 or more, and ``conflict`` (with the stored rev)
        when it is not the stored rev. Each accepted save adds one to the
        rev, whatever it changed.

        ``scanned`` is the iPhone's alone: the ids of the rooms its scan
        just made or replaced, recorded with every room not yet recorded
        (the module docstring, "Scans"). ``invalid`` when it is not a list
        of at most 40 UUIDs each naming a room of the map. None, as the
        panel saves, records nothing. Every save drops the records of rooms
        no longer on the map.
        """
        self._check_available()
        if isinstance(base_rev, bool) or not isinstance(base_rev, int) or base_rev < 0:
            raise HomeMapInvalidError("base_rev must be a whole number of 0 or more")
        scanned_ids = None if scanned is None else check_scanned(scanned)
        doc = check_document(raw_doc)
        rooms = {room["id"].upper(): room for room in _rooms_of(doc)}
        for i, room_id in enumerate(scanned_ids or ()):
            if room_id.upper() not in rooms:
                _fail(f"scanned[{i}]", "names no room of the map")
        if base_rev != self._rev:
            raise HomeMapConflictError(self._rev, base_rev)
        self._doc = doc
        self._rev += 1
        self._schedule_save()
        try:
            self._keep_scans(rooms, scanned_ids)
        except Exception:  # The map is saved: a record never undoes that.
            _LOGGER.exception("The home map's scans could not be kept after a save")
        _LOGGER.debug("Saved the home map at revision %d", self._rev)
        return self._rev

    def _keep_scans(self, rooms: dict[str, dict[str, Any]], scanned: list[str] | None) -> None:
        """After a save: the records of rooms gone from the map dropped, and
        with ``scanned`` the rooms it names recorded (again). Only a scan
        records a room, so a room drawn by hand in the panel never gains a
        record from an iPhone scan of another room. Saved only when
        something changed."""
        if self._scans_failed:
            return
        kept = {key: value for key, value in self._scans.items() if key.upper() in rooms}
        changed = len(kept) != len(self._scans)
        if scanned is not None:
            at = _now_iso()
            again = {room_id.upper() for room_id in scanned}
            held = {key.upper(): key for key in kept}
            for folded, room in rooms.items():
                if folded not in again:
                    continue
                kept.pop(held.get(folded, room["id"]), None)
                kept[room["id"]] = scan_record(room, at)
                changed = True
        self._scans = kept
        if changed:
            self._schedule_scans_save()
