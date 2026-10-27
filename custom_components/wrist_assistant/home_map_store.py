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
     "floors": [{"id", "name", "story": <int>,
                 "rooms": [{"id", "name"?, "areaId"?, "pageId"?,
                            "outline": [[x, y], ...], "height",
                            "walls": [{"a": [x, y], "b": [x, y], "t"}],
                            "openings": [{"kind": "door" | "window" |
                                          "opening", "a", "b", "z0", "z1"}],
                            "objects": [{"kind", "c": [x, y],
                                         "size": [w, d, h], "turn"}]}],
                 "pins": [{"id", "entityId", "roomId"?, "at": [x, y, z]}]}]}

A pin's ``roomId``, when it has one, names a room of the same floor. Whether
its ``entityId`` exists is not checked: a pin whose entity the home no
longer has is kept and drawn gray. An object's ``kind`` is the RoomPlan
category in lower camel case, any such word, since a device draws a kind it
does not know as a plain box.

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
from typing import Any, NoReturn

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import HOME_MAP_STORAGE_KEY, HOME_MAP_STORAGE_VERSION

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
        ("name", "areaId", "pageId"),
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
        opening = _object(raw_opening, where, ("kind", "a", "b", "z0", "z1"))
        if opening["kind"] not in OPENING_KINDS:
            _fail(f"{where}.kind", "must be door, window or opening")
        z0 = _number(opening["z0"], f"{where}.z0")
        z1 = _number(opening["z1"], f"{where}.z1")
        if z1 < z0:
            _fail(f"{where}.z1", "must not be below z0")
        openings.append(
            {
                "kind": opening["kind"],
                "a": _point(opening["a"], f"{where}.a", 2),
                "b": _point(opening["b"], f"{where}.b", 2),
                "z0": z0,
                "z1": z1,
            }
        )
    checked["openings"] = openings
    objects = []
    for i, raw_object in enumerate(_list(room["objects"], f"{path}.objects", MAX_OBJECTS)):
        where = f"{path}.objects[{i}]"
        item = _object(raw_object, where, ("kind", "c", "size", "turn"))
        kind = item["kind"]
        if not isinstance(kind, str) or not _OBJECT_KIND_RE.fullmatch(kind):
            _fail(f"{where}.kind", "must be a RoomPlan category in lower camel case")
        size = item["size"]
        if not isinstance(size, list) or len(size) != 3:
            _fail(f"{where}.size", "must be a list of 3 numbers")
        objects.append(
            {
                "kind": kind,
                "c": _point(item["c"], f"{where}.c", 2),
                "size": [
                    _number(value, f"{where}.size[{j}]", 0, 1000)
                    for j, value in enumerate(size)
                ],
                "turn": _number(item["turn"], f"{where}.turn"),
            }
        )
    checked["objects"] = objects
    return checked


def _pin(raw: Any, path: str, ids: _Ids, room_ids: set[str]) -> dict[str, Any]:
    pin = _object(raw, path, ("id", "entityId", "at"), ("roomId",))
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
    return checked


def check_document(raw: Any) -> dict[str, Any]:
    """The map as stored: ``raw`` checked by the rules in the module
    docstring, its numbers rounded to 2 decimals and its keys in the
    contract's order. A new object; ``raw`` is not changed. ``invalid`` for
    anything off the contract (the message says where), ``too_large`` for a
    map over 256 KiB as stored."""
    doc = _object(raw, "doc", ("v", "floors"))
    version = doc["v"]
    if isinstance(version, bool) or version != DOCUMENT_VERSION:
        _fail("doc.v", f"must be {DOCUMENT_VERSION}")
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
    checked = {"v": DOCUMENT_VERSION, "floors": floors}
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


# ── the store ────────────────────────────────────────────────────────────


class HomeMapStore:
    """The map document and its ``rev`` in ``.storage``."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store = Store(hass, HOME_MAP_STORAGE_VERSION, HOME_MAP_STORAGE_KEY)
        self._doc: dict[str, Any] | None = None
        self._rev = 0
        self._load_failed = False
        self._save_pending = False
        self._closed = False

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
        if not isinstance(data, dict):
            return
        rev = data.get("rev")
        doc = data.get("doc")
        if isinstance(rev, int) and not isinstance(rev, bool) and rev >= 0:
            self._rev = rev
        if isinstance(doc, dict):
            # It passed the checks when it was saved. A stored map always has
            # a rev of at least 1, so a device holding 0 never takes it for
            # the map it has.
            self._doc = doc
            self._rev = max(self._rev, 1)

    def _serialize(self) -> dict[str, Any]:
        return {"rev": self._rev, "doc": self._doc}

    def _schedule_save(self) -> None:
        if self._closed or self._load_failed:
            return
        self._save_pending = True
        self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)

    async def async_shutdown(self) -> None:
        """Called on unload: write a save still waiting out its debounce now
        and save nothing after, so a re-added entry reads what was saved."""
        self._closed = True
        if not self._save_pending or self._load_failed:
            return
        self._save_pending = False
        await self._store.async_save(self._serialize())

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

    # ── writes ─────────────────────────────────────────────────────────

    def save(self, raw_doc: Any, base_rev: Any) -> int:
        """Keep a map made from ``base_rev``. Returns the new rev.

        The map is checked first (:func:`check_document`): ``invalid`` or
        ``too_large``. ``invalid`` too for a ``base_rev`` that is not a
        whole number of 0 or more, and ``conflict`` (with the stored rev)
        when it is not the stored rev. Each accepted save adds one to the
        rev, whatever it changed.
        """
        self._check_available()
        if isinstance(base_rev, bool) or not isinstance(base_rev, int) or base_rev < 0:
            raise HomeMapInvalidError("base_rev must be a whole number of 0 or more")
        doc = check_document(raw_doc)
        if base_rev != self._rev:
            raise HomeMapConflictError(self._rev, base_rev)
        self._doc = doc
        self._rev += 1
        self._schedule_save()
        _LOGGER.debug("Saved the home map at revision %d", self._rev)
        return self._rev
