"""The library: every page, status page and menu once, picked by devices.

A home keeps each page, status page and menu once, in the library. Each
device (a watch or an iPhone) only picks from it: which pages, in what order
and which hidden there; which status pages, in what order; one Anywhere menu
and one Entity quick menu. An edit on any device is an edit of the library
item, so every device that picked it gets it. A device that wants another
version takes a copy, which is a new item. Plan: app repo
``docs/one_library_plan_2026-10.md``. It replaces the links of
``page_links.py`` for these three kinds (voice still links there).

The apps see no change. The store still writes one ``pages``,
``status_pages`` and ``menus`` record per device, built here from the
library and that device's picks (:func:`materialise`), and a save of one of
those records is turned back into library and picks writes (:func:`map_back`).
The first start with this code builds the library from the records it finds
(:func:`migrate`).

The shape, as stored in ``wrist_assistant.library`` (:func:`validate_library`)::

    {
      "pages":        {"<id>": {page object, no isHidden, no linkId}},
      "status_pages": {"<id>": {status page object, no isHidden, no linkId}},
      "menus":        {"<id>": {"name": "Anywhere menu",
                                "kind": "anywhere" | "entity",
                                "sections": {"quickAction": ..., "pageSwitcher": ...}
                                          or {"entityRadial": ...}}},
      "picks": {
        "<owner id>": {
          "pages":        [{"id": "<id>", "isHidden"?: ...},
                           {"id": "<id>", "page": {a system page}}, ...],
          "status_pages": [{"id": "<id>", "isHidden"?: ...}, ...],
          "menus":        {"anywhere"?: "<menu id>", "entity"?: "<menu id>"}
        }
      },
      "hashes":    {"<owner id>": {"<kind>": "<hash>"}},
      "revisions": {"<owner id>": {"<kind>": <revision>}},
      "renames":   {"<owner id>": {"pages": {"<old id>": "<new id>"},
                                   "status_pages": {"<old id>": "<new id>"}}},
      "item_revisions": {"pages":        {"<id>": <revision>},
                         "status_pages": {"<id>": <revision>},
                         "menus":        {"<menu id>": <revision>}}
    }

Where this differs from the plan's sketch, it is to keep each device's
records exactly as they were:

* ``isHidden`` is in a pick only when the record had the key, so a page that
  never had it does not gain ``isHidden: false``. Status pages carry it the
  same way, since the store keeps it per device today.
* A system page (``isSystemPage: true``) is the device's own and never an
  item: its pick holds the whole page object, in its place in the order.
* ``hashes`` and ``revisions`` are room for the store to remember each
  record as last written, so it can tell at the next start a record changed
  by older code (a later revision) from one whose save never reached the
  disk (an earlier one). Nothing here reads them.
* ``renames`` is the page and status page ids the library gave an owner's
  pages new ids for (a migration, or a first upload under an id another
  page holds), so the store can point the owner's later first records of
  the other kinds at them. Nothing here reads it either.
* ``item_revisions`` is each item's own revision, so the panel can edit an
  item in the library itself (one no device picks) with the same compare
  and swap a record save has. Every item has one: it starts at 1 when the
  item is made and goes up by 1 whenever its content changes, by any path
  (a record save mapped back, a library save of the item, a menu's rename,
  a delete that drops a slot or tile from it). A menu's name is content.
  Every function here that returns a library keeps them up to date
  (:func:`stamp_item_revisions`).

A materialised record carries no link keys: no ``linkId`` on a page or
status page, no ``linkIds`` on a menus document. Records written before step
4 of the plan carried them on every item two or more devices picked, and a
panel that loaded one may still send them back. Wherever they arrive they
are read as if absent: an item stored here never holds ``linkId``, and a
materialised menus document drops any ``linkIds`` its template carries. Only
the one-time :func:`migrate` reads them, as the old link tokens that join
copies of one page or menu.

A page has two screens, the watch's and the iPhone's (app repo
``docs/pages_two_screens_plan_2026-11.md``). Its tiles are one list, the
same on every device, and each screen places them its own way, in the
page's optional ``screens`` key::

    "screens": {"watch":  {"<tile id>": {"col": 0, "row": 0, "colSpan": 6, "rowSpan": 4}},
                "iphone": {"<tile id>": {...}}}

A tile absent from a screen's map is off there; one in neither map is not
kept (:func:`validate_library` drops it). A page without the key reads as
both screens equal to the tiles' own ``gridCol``, ``gridRow``, ``colSpan``
and ``rowSpan``, with the kinds the watch skips off on the watch
(:func:`page_screens`). Only the panel writes the key. A record never
carries it: :func:`materialise` stamps the owner's screen into each tile's
fields and leaves its off tiles out (:func:`stamp_page`), and a device's
save of a page writes its tiles' places into its own screen only, keeping
the other one (:func:`map_back`). The tile's own fields stay in the item as
the watch screen's copy, so a reader that ignores ``screens`` still sees a
sane page.

Pure, with no Home Assistant import, so it is tested on its own. Every
function returns new objects and never changes what it is given. Ids are
compared ignoring case (the app reads them as UUIDs) and new ones are
upper-case UUIDs, as the app makes them.
"""

from __future__ import annotations

import copy
import logging
import uuid
from collections.abc import Callable, Container, Iterable, Mapping, Sequence
from typing import Any, NamedTuple

from .page_links import link_reach

_LOGGER = logging.getLogger(__name__)

# The library's own version, in its ``version`` key. 2 is the first with
# page screens: a library read at 1 gets them once (:func:`fill_screens`).
LIBRARY_VERSION = 2

# The kinds the library holds, in the order they are built: status pages
# before pages (a page's tiles open status pages) and pages before menus.
LIBRARY_KINDS: tuple[str, ...] = ("status_pages", "pages", "menus")

# The kinds as ``item_revisions`` lists them.
_ITEM_KINDS: tuple[str, ...] = ("pages", "status_pages", "menus")

# The two list kinds, and the key of each one's list in a device's document.
LIST_KEYS: dict[str, str] = {"pages": "pages", "status_pages": "statusPages"}

# A menus document's two units, and the top-level keys each one is made of.
# The page switcher is style only, so it goes with the Anywhere menu.
MENU_UNITS: dict[str, tuple[str, ...]] = {
    "anywhere": ("quickAction", "pageSwitcher"),
    "entity": ("entityRadial",),
}

# A menu's name when it is the only one of its kind.
MENU_NAMES: dict[str, str] = {"anywhere": "Anywhere menu", "entity": "Entity quick menu"}

# The per-device key on a page, and the link keys older records and old
# panel saves may still carry (read only by the migration, dropped
# everywhere else).
HIDDEN_KEY = "isHidden"
LINK_KEY = "linkId"
LINK_IDS_KEY = "linkIds"

# The device's own keys that hold page ids, in a `rooms` record or in a
# watch's `behavior` (`page_links.ROOM_KEYS`, the two of them about pages).
_ROOM_PAGE_KEY = "roomQuickJumpFallbackPageId"
_ROOM_MAPPINGS_KEY = "roomQuickJumpMappings"

# The tile kinds that open a page, and the one that opens a status page.
_PAGE_TILE_KINDS = ("page", "show_page")
_STATUS_TILE_KIND = "status_page"

# The menu actions that open a page or a status page, by the kind they open
# (`menu-actions.json`, the `uuid` payloads whose `target` is `page` or
# `statusPage`). Both name it in `pageId`.
_MENU_ACTIONS: dict[str, str] = {"pages": "navigateToPage", "status_pages": "showStatusPage"}
_MENU_PAGE_KEY = "pageId"

# A page's screens: the key, the two screens (each named as the secret
# store names the device kind, ``DEVICE_KIND_WATCH`` and
# ``DEVICE_KIND_IPHONE``), and each screen entry's keys by the tile field it
# is stamped into.
SCREENS_KEY = "screens"
WATCH_SCREEN = "watch"
IPHONE_SCREEN = "iphone"
SCREENS: tuple[str, ...] = (WATCH_SCREEN, IPHONE_SCREEN)
_GRID_FIELDS: tuple[tuple[str, str], ...] = (
    ("col", "gridCol"),
    ("row", "gridRow"),
    ("colSpan", "colSpan"),
    ("rowSpan", "rowSpan"),
)
# What the app reads for a tile field that is missing (page-keys.json).
_GRID_DEFAULTS: dict[str, int] = {"col": 0, "row": 0, "colSpan": 6, "rowSpan": 4}
_GRID_COLUMNS = 12
_MAX_SPAN = 12

# The tile kinds the watch does not draw, off on its screen when a page has
# no ``screens``: ``const.PHONE_ONLY_TILE_KINDS``, repeated so this module
# keeps importing nothing (tests/test_library.py keeps the two equal).
WATCH_SKIPPED_TILE_KINDS = frozenset({"map", "chart", "text_field", "web"})


class LibraryError(Exception):
    """A library change that cannot be made. ``code`` is the stable reason:
    ``not_found``, ``in_use`` or ``invalid``."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code
        self.message = message


class Change(NamedTuple):
    """A new library, and what it changes on the devices: for each owner
    whose materialised records differ, the kinds that do, in
    :data:`LIBRARY_KINDS` order. The store rematerialises exactly those."""

    library: dict[str, Any]
    touched: dict[str, list[str]]


class Copied(NamedTuple):
    """:func:`copy_menu`'s and :func:`create_menu`'s result: a
    :class:`Change` plus the new menu's id."""

    library: dict[str, Any]
    touched: dict[str, list[str]]
    id: str


class MapBack(NamedTuple):
    """:func:`map_back`'s result.

    ``touched`` is as in :class:`Change`. The saving owner is in it for the
    saved kind only when what it saved differs from its materialised record
    (a stale link key dropped, an id renamed). ``renamed`` is
    ``{kind: {old id: new id}}`` for the pages and status pages the save
    gave new ids (only with ``fork_conflicts``), so the caller can rewrite
    the owner's rooms and complications (:func:`rename_refs`,
    :func:`rename_complication`). Empty otherwise."""

    library: dict[str, Any]
    touched: dict[str, list[str]]
    renamed: dict[str, dict[str, str]]


class MigrationResult(NamedTuple):
    """:func:`migrate`'s result.

    * ``library``: the library built from the records.
    * ``changed``: for each owner, the kinds whose record must be written
      again: a library kind whose :func:`materialise` (with the record as
      template) differs from the record, and ``rooms`` or ``behavior`` when
      ``rewritten`` holds a new one.
    * ``renamed``: for each owner that had an id taken by another device,
      ``{"pages": {old: new}, "status_pages": {old: new}}``. The caller
      rewrites that owner's complications with the ``pages`` map
      (:func:`rename_complication`): complications live in another store.
    * ``rewritten``: for each owner, its ``rooms`` and ``behavior`` documents
      with renamed page ids rewritten, only those that changed. They are the
      device's own, not library kinds, so they are written as they are.
    """

    library: dict[str, Any]
    changed: dict[str, list[str]]
    renamed: dict[str, dict[str, dict[str, str]]]
    rewritten: dict[str, dict[str, dict[str, Any]]]


class _All:
    """A container holding everything: every item of a saved kind updates
    its library item."""

    def __contains__(self, _item: object) -> bool:
        return True


_ALL = _All()


# ── small helpers ────────────────────────────────────────────────────────


def _key(value: Any) -> str | None:
    """An id as compared: upper case, or None for no usable id."""
    return value.upper() if isinstance(value, str) and value else None


def new_item_id() -> str:
    """A new page, status page or menu id, as the app writes ids."""
    return str(uuid.uuid4()).upper()


def _items(document: Any, key: str) -> list[dict[str, Any]]:
    """The objects of a document's list that have an id, in order."""
    raw = document.get(key) if isinstance(document, dict) else None
    if not isinstance(raw, list):
        return []
    return [item for item in raw if isinstance(item, dict) and _key(item.get("id")) is not None]


def _is_system_page(page: Mapping[str, Any]) -> bool:
    return page.get("isSystemPage") is True


def _content(page: Mapping[str, Any]) -> dict[str, Any]:
    """A page as the library keeps it: every key but ``isHidden`` and
    ``linkId``."""
    return {k: copy.deepcopy(v) for k, v in page.items() if k not in (HIDDEN_KEY, LINK_KEY)}


def _same_content(a: Mapping[str, Any], b: Mapping[str, Any]) -> bool:
    """Whether two copies of a page are the same page, by every key but
    ``isHidden``, ``linkId`` and the spelling of the id."""
    drop = ("id", HIDDEN_KEY, LINK_KEY)
    return {k: v for k, v in a.items() if k not in drop} == {
        k: v for k, v in b.items() if k not in drop
    }


def _index(held: Mapping[str, Any]) -> dict[str, str]:
    """The ids of a library kind by their compared form."""
    return {k: stored for stored in held if (k := _key(stored)) is not None}


def _with_key(document: Mapping[str, Any], key: str, value: Any) -> dict[str, Any]:
    """``document`` with ``key`` set: in its place when present, else at its
    sorted place among the keys, as the phone's sorted-key encoder writes."""
    if key in document:
        return {k: (value if k == key else v) for k, v in document.items()}
    out: dict[str, Any] = {}
    for k, v in document.items():
        if key not in out and k > key:
            out[key] = value
        out[k] = v
    out.setdefault(key, value)
    return out


def _slot_lists(section: Any) -> list[list[Any]]:
    """Every slot list of a menus section: the Anywhere menu's ``slots``,
    the Entity quick menu's ``*Slots`` lists and each ``entityOverrides``
    list (the lists the store's menus guard checks)."""
    if not isinstance(section, dict):
        return []
    lists = [section["slots"]] if isinstance(section.get("slots"), list) else []
    lists += [v for k, v in section.items() if k.endswith("Slots") and isinstance(v, list)]
    overrides = section.get("entityOverrides")
    if isinstance(overrides, dict):
        lists += [v for v in overrides.values() if isinstance(v, list)]
    return lists


def _check_kind(kind: str, allowed: Iterable[str] = LIBRARY_KINDS) -> None:
    if kind not in allowed:
        raise LibraryError("invalid", f"{kind!r} is not a library kind")


def _check_unit(unit: str) -> None:
    if unit not in MENU_UNITS:
        raise LibraryError("invalid", f"{unit!r} is not a menu unit")


def _check_name(name: Any) -> str:
    if not isinstance(name, str) or not name.strip():
        raise LibraryError("invalid", "a menu name must be a non-empty string")
    return name.strip()


# ── screens ──────────────────────────────────────────────────────────────


def _whole(value: Any) -> int | None:
    """A whole number as JSON gives one (``3`` or ``3.0``), else None."""
    if isinstance(value, bool):
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, float) and value.is_integer():
        return int(value)
    return None


def _tile_kind(tile: Mapping[str, Any]) -> str:
    """The kind of a tile: its entity id up to the first dot."""
    entity_id = tile.get("entityId")
    return entity_id.split(".", 1)[0] if isinstance(entity_id, str) else ""


def _page_tiles(page: Mapping[str, Any]) -> list[dict[str, Any]]:
    """A page's tiles that have an id, in order, the first of each id."""
    raw = page.get("items")
    seen: set[str] = set()
    out: list[dict[str, Any]] = []
    for tile in raw if isinstance(raw, list) else []:
        if isinstance(tile, dict) and (key := _key(tile.get("id"))) is not None and key not in seen:
            seen.add(key)
            out.append(tile)
    return out


def _tile_geometry(tile: Mapping[str, Any]) -> dict[str, int]:
    """A tile's place and size from its own fields, read as the app reads
    them: a missing or unusable field is the app's default, and each one is
    brought inside the grid."""
    out: dict[str, int] = {}
    for name, field in _GRID_FIELDS:
        value = _whole(tile.get(field))
        out[name] = _GRID_DEFAULTS[name] if value is None else value
    out["col"] = min(max(out["col"], 0), _GRID_COLUMNS - 1)
    out["row"] = max(out["row"], 0)
    out["colSpan"] = min(max(out["colSpan"], 1), _MAX_SPAN)
    out["rowSpan"] = min(max(out["rowSpan"], 1), _MAX_SPAN)
    return out


def _valid_geometry(raw: Any) -> dict[str, int] | None:
    """A screen entry as stored, or None when it is not one: four whole
    numbers, the column 0 to 11, the row from 0 and both spans 1 to 12.
    Any other key is dropped."""
    if not isinstance(raw, Mapping):
        return None
    out: dict[str, int] = {}
    for name, _field in _GRID_FIELDS:
        value = _whole(raw.get(name))
        if value is None:
            return None
        out[name] = value
    if not 0 <= out["col"] < _GRID_COLUMNS or out["row"] < 0:
        return None
    if not (1 <= out["colSpan"] <= _MAX_SPAN and 1 <= out["rowSpan"] <= _MAX_SPAN):
        return None
    return out


def _fallback_screens(page: Mapping[str, Any]) -> dict[str, dict[str, dict[str, int]]]:
    """The screens of a page with no ``screens``: both the tiles' own
    fields, every tile on the iPhone and every one but the kinds the watch
    skips on the watch."""
    tiles = _page_tiles(page)
    return {
        WATCH_SCREEN: {
            t["id"]: _tile_geometry(t) for t in tiles if _tile_kind(t) not in WATCH_SKIPPED_TILE_KINDS
        },
        IPHONE_SCREEN: {t["id"]: _tile_geometry(t) for t in tiles},
    }


def page_screens(page: Mapping[str, Any]) -> dict[str, dict[str, dict[str, int]]]:
    """A page's two screens, ``{"watch": {tile id: geometry}, "iphone":
    {...}}``: its ``screens`` as stored, or what a page without it reads as.
    A copy."""
    held = page.get(SCREENS_KEY)
    if isinstance(held, Mapping):
        return {
            screen: copy.deepcopy(dict(held[screen])) if isinstance(held.get(screen), Mapping) else {}
            for screen in SCREENS
        }
    return _fallback_screens(page)


def _check_screen(screen: str) -> None:
    if screen not in SCREENS:
        raise LibraryError("invalid", f"{screen!r} is not a screen")


def _with_checked_screens(page: Mapping[str, Any], *, strict: bool) -> dict[str, Any]:
    """``page`` with its ``screens`` checked: two maps of tile id to a place
    and size (:func:`_valid_geometry`), each id one of the page's tiles and
    spelled as the tile spells it. A tile in neither map is taken off the
    page (logged). Without ``strict`` what does not fit is dropped: an entry
    that is not one, or for no tile on the page, and the whole key when it
    holds no map at all (the page then reads as one without it). With
    ``strict`` (a save) a key or entry of the wrong shape is ``invalid``;
    an entry for no tile on the page is still only dropped. A page without
    the key comes back as it is."""
    if SCREENS_KEY not in page:
        return dict(page)
    raw = page[SCREENS_KEY]
    rest = {k: v for k, v in page.items() if k != SCREENS_KEY}
    if not isinstance(raw, Mapping) or not any(isinstance(raw.get(s), Mapping) for s in SCREENS):
        if strict:
            raise LibraryError("invalid", "screens must hold a watch and an iphone map")
        return rest
    ids = {_key(t["id"]): t["id"] for t in _page_tiles(page)}
    screens: dict[str, dict[str, dict[str, int]]] = {}
    for screen in SCREENS:
        held = raw.get(screen, {})
        if not isinstance(held, Mapping):
            if strict:
                raise LibraryError("invalid", f"screens.{screen} must be an object")
            held = {}
        entries: dict[str, dict[str, int]] = {}
        for tile_id, geometry in held.items():
            spelled = ids.get(_key(tile_id))
            if spelled is None:
                continue
            checked = _valid_geometry(geometry)
            if checked is None:
                if strict:
                    raise LibraryError(
                        "invalid",
                        f"screens.{screen}.{tile_id} must hold whole numbers col 0 to 11, "
                        "row from 0, colSpan and rowSpan 1 to 12",
                    )
                continue
            entries[spelled] = checked
        screens[screen] = entries
    on = {_key(tile_id) for entries in screens.values() for tile_id in entries}
    tiles = page.get("items")
    if isinstance(tiles, list):
        kept = [t for t in tiles if isinstance(t, dict) and _key(t.get("id")) in on]
        if len(kept) != len(tiles):
            _LOGGER.info(
                "Took %d tile(s) on no screen off page %s",
                len(tiles) - len(kept),
                page.get("id"),
            )
            rest["items"] = kept
    return {k: (screens if k == SCREENS_KEY else rest[k]) for k in page}


def _set_geometry(tile: Mapping[str, Any], geometry: Mapping[str, int]) -> dict[str, Any]:
    """``tile`` with its four fields set to ``geometry``, each in its place
    or at its sorted place among the keys. A field the tile does not have
    stays out when the value is what the app reads for a missing one."""
    out = dict(tile)
    for name, field in _GRID_FIELDS:
        if field not in out and geometry[name] == _GRID_DEFAULTS[name]:
            continue
        out = _with_key(out, field, geometry[name])
    return out


def stamp_page(page: Mapping[str, Any], screen: str) -> dict[str, Any]:
    """The page as a device of ``screen`` reads it, with no ``screens``.

    With ``screens``, each tile on that screen takes the screen's place and
    size into ``gridCol``, ``gridRow``, ``colSpan`` and ``rowSpan``, the
    tiles off it are left out, and the list is in the screen's order, row
    then column (the watch packs in that order). Without it, the tiles stay
    as they are, less the kinds the watch skips on the watch. A copy."""
    _check_screen(screen)
    out = {k: copy.deepcopy(v) for k, v in page.items() if k != SCREENS_KEY}
    tiles = out.get("items")
    if not isinstance(tiles, list):
        return out
    held = page.get(SCREENS_KEY)
    if not isinstance(held, Mapping):
        if screen == WATCH_SCREEN:
            out["items"] = [
                t
                for t in tiles
                if not (isinstance(t, dict) and _tile_kind(t) in WATCH_SKIPPED_TILE_KINDS)
            ]
        return out
    entries = held.get(screen) if isinstance(held.get(screen), Mapping) else {}
    places = {_key(tile_id): geometry for tile_id, geometry in entries.items()}
    placed: list[tuple[dict[str, int], dict[str, Any]]] = []
    for tile in tiles:
        geometry = places.get(_key(tile.get("id"))) if isinstance(tile, dict) else None
        if geometry is not None:
            placed.append((geometry, _set_geometry(tile, geometry)))
    placed.sort(key=lambda pair: (pair[0]["row"], pair[0]["col"]))
    out["items"] = [tile for _geometry, tile in placed]
    return out


def _merge_saved_page(
    item: Mapping[str, Any], saved: Mapping[str, Any], screen: str
) -> dict[str, Any]:
    """The library item after a device of ``screen`` saved its copy of it.

    A copy that carries ``screens`` is the panel's and is taken whole. Any
    other is a device's stamped copy: its page keys and its tiles' content
    are the item's, and its tiles' places go into its own screen only (on
    the watch's, never a kind the watch skips: an old record still holds
    them). A tile the item has that the save lacks stays when it was off
    this screen already (the watch never had it); one that was on it leaves
    this screen, and the page when no screen has it any more. A tile new to
    the item goes on this screen where the save put it and at the bottom of
    the other one, unless that is the watch and it does not draw the kind.
    Each tile's own fields are then the watch screen's (the iPhone's for one
    off the watch). An item that had no ``screens`` gets none while the
    result still reads the same without them."""
    if SCREENS_KEY in saved:
        return _with_checked_screens(saved, strict=True)
    other = IPHONE_SCREEN if screen == WATCH_SCREEN else WATCH_SCREEN
    before = page_screens(item)
    old = {_key(t["id"]): t for t in _page_tiles(item)}
    sent = _page_tiles(saved)
    by_key = {_key(t["id"]): t for t in sent}
    screens = {
        screen: {
            t["id"]: _tile_geometry(t)
            for t in sent
            if not (screen == WATCH_SCREEN and _tile_kind(t) in WATCH_SKIPPED_TILE_KINDS)
        },
        other: {
            tile_id: geometry
            for tile_id, geometry in before[other].items()
            if _key(tile_id) in old
        },
    }
    elsewhere = {_key(tile_id) for tile_id in screens[other]}
    tiles: list[dict[str, Any]] = []
    for key, tile in old.items():
        if key in by_key:
            tiles.append(copy.deepcopy(by_key[key]))
        elif key in elsewhere:
            tiles.append(copy.deepcopy(tile))
    bottom = max((g["row"] + g["rowSpan"] for g in screens[other].values()), default=0)
    for tile in sent:
        if _key(tile["id"]) in old:
            continue
        tiles.append(copy.deepcopy(tile))
        if other == WATCH_SCREEN and _tile_kind(tile) in WATCH_SKIPPED_TILE_KINDS:
            continue
        geometry = {**_tile_geometry(tile), "col": 0, "row": bottom}
        bottom += geometry["rowSpan"]
        screens[other][tile["id"]] = geometry
    # The other screen keyed by the spelling of the tile that stays.
    spelled = {_key(t["id"]): t["id"] for t in tiles}
    screens[other] = {
        spelled[_key(tile_id)]: geometry
        for tile_id, geometry in screens[other].items()
        if _key(tile_id) in spelled
    }
    on = {_key(t) for entries in screens.values() for t in entries}
    tiles = [t for t in tiles if _key(t["id"]) in on]
    out = {k: copy.deepcopy(v) for k, v in saved.items() if k != "items"}
    if "items" in saved or "items" in item:
        out = _with_key(out, "items", tiles)
    if SCREENS_KEY not in item and _fallback_screens(out) == screens:
        return out
    watch = {_key(t): g for t, g in screens[WATCH_SCREEN].items()}
    iphone = {_key(t): g for t, g in screens[IPHONE_SCREEN].items()}
    out["items"] = [
        _set_geometry(t, watch.get(_key(t["id"])) or iphone[_key(t["id"])]) for t in tiles
    ]
    return _with_key(out, SCREENS_KEY, screens)


def _drop_from_screens(page: dict[str, Any]) -> None:
    """Take out of a page's ``screens``, in place, every entry for a tile
    the page no longer has."""
    held = page.get(SCREENS_KEY)
    if not isinstance(held, dict):
        return
    ids = {_key(t["id"]) for t in _page_tiles(page)}
    for screen, entries in held.items():
        if isinstance(entries, dict):
            held[screen] = {k: v for k, v in entries.items() if _key(k) in ids}


def fill_screens(library: Mapping[str, Any]) -> dict[str, Any]:
    """The library with ``screens`` written into every page that has none
    (what it reads as without them, :func:`page_screens`), at
    :data:`LIBRARY_VERSION`. Once per library: the store runs it on a
    library read at an older version. A page that already has screens stays
    as it is, and so does one with a tile that has no id (a screen could not
    name it, so it keeps reading from its tiles), so running it twice
    changes nothing more. Nothing a device reads changes."""
    lib = copy.deepcopy(dict(library))
    filled = 0
    for item_id, page in lib["pages"].items():
        if isinstance(page.get(SCREENS_KEY), dict):
            continue
        tiles = page.get("items")
        if isinstance(tiles, list) and len(_page_tiles(page)) != len(tiles):
            continue
        lib["pages"][item_id] = _with_key(page, SCREENS_KEY, _fallback_screens(page))
        filled += 1
    lib["version"] = LIBRARY_VERSION
    if filled:
        _LOGGER.info("Gave %d page(s) a watch and an iPhone screen", filled)
    return stamp_item_revisions(library, lib)


# ── the shape ────────────────────────────────────────────────────────────


def empty_library() -> dict[str, Any]:
    """A library holding nothing and picked by no one."""
    return {
        "version": LIBRARY_VERSION,
        "pages": {},
        "status_pages": {},
        "menus": {},
        "picks": {},
        "hashes": {},
        "revisions": {},
        "renames": {},
        "item_revisions": {kind: {} for kind in _ITEM_KINDS},
    }


def validate_library(raw: Any) -> dict[str, Any]:
    """The library ``raw`` holds, in the shape of :func:`empty_library`.

    What does not fit is dropped rather than refused, so a damaged file
    still loads what it can: an item with no id or one already held
    (ignoring case), a system page, a menu with an unknown kind, a section
    that is not the kind's or not an object, a pick of an item the library
    does not hold or one picked twice, a menu pick of the wrong kind, and
    of a page's ``screens`` what :func:`_with_checked_screens` drops (a
    tile on neither screen with it). Items lose ``isHidden`` and
    ``linkId``; picks use the library's spelling of each id. ``version`` is
    1 for a library written before it had one.
    """
    lib = empty_library()
    if not isinstance(raw, dict):
        return lib
    version = _whole(raw.get("version"))
    lib["version"] = version if version is not None and version >= 1 else 1
    for kind in LIST_KEYS:
        held = raw.get(kind)
        seen: set[str] = set()
        for page in held.values() if isinstance(held, dict) else []:
            if not isinstance(page, dict) or (key := _key(page.get("id"))) is None or key in seen:
                continue
            if kind == "pages" and _is_system_page(page):
                continue
            seen.add(key)
            content = _content(page)
            if kind == "pages":
                content = _with_checked_screens(content, strict=False)
            lib[kind][page["id"]] = content
    menus = raw.get("menus")
    for menu_id, menu in menus.items() if isinstance(menus, dict) else []:
        if not isinstance(menu_id, str) or not menu_id or not isinstance(menu, dict):
            continue
        unit = menu.get("kind")
        if unit not in MENU_UNITS:
            continue
        sections = menu.get("sections")
        sections = sections if isinstance(sections, dict) else {}
        name = menu.get("name")
        lib["menus"][menu_id] = {
            "name": name.strip() if isinstance(name, str) and name.strip() else MENU_NAMES[unit],
            "kind": unit,
            "sections": {
                k: copy.deepcopy(sections[k])
                for k in MENU_UNITS[unit]
                if isinstance(sections.get(k), dict)
            },
        }
    picks = raw.get("picks")
    for owner, held in picks.items() if isinstance(picks, dict) else []:
        if not isinstance(owner, str) or not owner or not isinstance(held, dict):
            continue
        lib["picks"][owner] = _valid_picks(lib, held)
    hashes = raw.get("hashes")
    for owner, held in hashes.items() if isinstance(hashes, dict) else []:
        if isinstance(owner, str) and owner and isinstance(held, dict):
            kept = {k: v for k, v in held.items() if isinstance(k, str) and isinstance(v, str)}
            if kept:
                lib["hashes"][owner] = kept
    revisions = raw.get("revisions")
    for owner, held in revisions.items() if isinstance(revisions, dict) else []:
        if isinstance(owner, str) and owner and isinstance(held, dict):
            numbers = {
                k: v
                for k, v in held.items()
                if isinstance(k, str) and isinstance(v, int) and not isinstance(v, bool) and v >= 0
            }
            if numbers:
                lib["revisions"][owner] = numbers
    renames = raw.get("renames")
    for owner, held in renames.items() if isinstance(renames, dict) else []:
        if not isinstance(owner, str) or not owner or not isinstance(held, dict):
            continue
        maps = {
            kind: {
                old: new
                for old, new in held[kind].items()
                if isinstance(old, str) and old and isinstance(new, str) and new
            }
            for kind in LIST_KEYS
            if isinstance(held.get(kind), dict)
        }
        if any(maps.values()):
            lib["renames"][owner] = {kind: maps.get(kind, {}) for kind in LIST_KEYS}
    lib["item_revisions"] = _valid_item_revisions(lib, raw.get("item_revisions"))
    return lib


def _is_revision(value: Any) -> bool:
    return isinstance(value, int) and not isinstance(value, bool) and value >= 1


def _valid_item_revisions(lib: Mapping[str, Any], raw: Any) -> dict[str, dict[str, int]]:
    """Each item's revision from ``raw``, for the items ``lib`` holds (pages
    and status pages matched ignoring case, menus by exact id); an item with
    no usable entry (a library written before items had revisions) starts
    at 1."""
    held = raw if isinstance(raw, dict) else {}
    out: dict[str, dict[str, int]] = {}
    for kind in _ITEM_KINDS:
        given = held.get(kind) if isinstance(held.get(kind), dict) else {}
        if kind == "menus":
            found = {k: v for k, v in given.items() if isinstance(k, str)}
            out[kind] = {
                item_id: found[item_id] if _is_revision(found.get(item_id)) else 1
                for item_id in lib[kind]
            }
            continue
        folded = {
            key: v for k, v in given.items() if (key := _key(k)) is not None and _is_revision(v)
        }
        out[kind] = {item_id: folded.get(_key(item_id), 1) for item_id in lib[kind]}
    return out


def _item_content(kind: str, item: Mapping[str, Any]) -> Any:
    """What counts as an item's content for its revision: a page or status
    page whole, a menu's name and sections."""
    if kind == "menus":
        return (item.get("name"), item.get("sections"))
    return item


def stamp_item_revisions(before: Mapping[str, Any], after: Mapping[str, Any]) -> dict[str, Any]:
    """``after`` with its ``item_revisions`` brought up to date against
    ``before``: an item ``before`` did not hold starts at 1, one whose
    content differs goes up by 1 from ``before``'s revision (an item with no
    entry there counts as 1), an unchanged one keeps it, and a gone one
    loses its entry. A new object; neither argument changes. Every function
    here that returns a changed library calls it, so a caller that changes
    a library some other way calls it too."""
    was = before.get("item_revisions") if isinstance(before.get("item_revisions"), dict) else {}
    out: dict[str, dict[str, int]] = {}
    for kind in _ITEM_KINDS:
        old_items = before.get(kind, {})
        old_revs = was.get(kind) if isinstance(was.get(kind), dict) else {}
        revs: dict[str, int] = {}
        for item_id, item in after[kind].items():
            if item_id not in old_items:
                revs[item_id] = 1
                continue
            rev = old_revs.get(item_id)
            rev = rev if _is_revision(rev) else 1
            if _item_content(kind, old_items[item_id]) != _item_content(kind, item):
                rev += 1
            revs[item_id] = rev
        out[kind] = revs
    return {**after, "item_revisions": out}


def item_revision(library: Mapping[str, Any], kind: str, item_id: str) -> int:
    """The revision of an item the library holds, by its stored id (1 when
    it has no entry)."""
    rev = library.get("item_revisions", {}).get(kind, {}).get(item_id)
    return rev if _is_revision(rev) else 1


def stored_item_id(library: Mapping[str, Any], kind: str, item_id: Any) -> str:
    """The library's own spelling of an item id: pages and status pages
    compared ignoring case, a menu by its exact id first and then ignoring
    case. ``not_found`` when the library holds no such item, ``invalid``
    for another kind."""
    _check_kind(kind)
    if kind == "menus" and isinstance(item_id, str) and item_id in library["menus"]:
        return item_id
    stored = _index(library[kind]).get(_key(item_id))
    if stored is None:
        raise LibraryError("not_found", f"the library holds no {kind} item {item_id}")
    return stored


def held_renames(library: Mapping[str, Any], owner_id: str) -> dict[str, dict[str, str]]:
    """The ids the library renamed for an owner, ``{"pages": {old: new},
    "status_pages": {old: new}}`` (empty maps when none). A copy."""
    held = library.get("renames", {}).get(owner_id, {})
    return {kind: dict(held.get(kind, {})) for kind in LIST_KEYS}


def hold_renames(
    library: Mapping[str, Any], owner_id: str, renamed: Mapping[str, Mapping[str, str]]
) -> dict[str, Any]:
    """The library with more of an owner's renamed ids remembered. A rename
    of an id that was itself the new id of an earlier rename moves that
    earlier one on too, so every old id names the latest."""
    lib = copy.deepcopy(dict(library))
    held = held_renames(lib, owner_id)
    for kind in LIST_KEYS:
        fresh = _renames(renamed.get(kind, {}))
        if not fresh:
            continue
        maps = held[kind]
        for old, new in list(maps.items()):
            maps[old] = fresh.get(_key(new), new)
        maps.update(renamed.get(kind, {}))
    if any(held.values()):
        lib.setdefault("renames", {})[owner_id] = held
    return lib


def _valid_picks(lib: Mapping[str, Any], held: Mapping[str, Any]) -> dict[str, Any]:
    """One owner's picks, checked against the items ``lib`` holds."""
    out: dict[str, Any] = {}
    for kind in LIST_KEYS:
        raw = held.get(kind)
        if not isinstance(raw, list):
            continue
        index = _index(lib[kind])
        seen: set[str] = set()
        entries: list[dict[str, Any]] = []
        for pick in raw:
            if not isinstance(pick, dict) or (key := _key(pick.get("id"))) is None:
                continue
            local = pick.get("page")
            if kind == "pages" and isinstance(local, dict):
                if _key(local.get("id")) != key or key in seen:
                    continue
                seen.add(key)
                entries.append({"id": local["id"], "page": copy.deepcopy(local)})
                continue
            if key not in index or key in seen:
                continue
            seen.add(key)
            entry: dict[str, Any] = {"id": index[key]}
            if HIDDEN_KEY in pick:
                entry[HIDDEN_KEY] = copy.deepcopy(pick[HIDDEN_KEY])
            entries.append(entry)
        out[kind] = entries
    menus = held.get("menus")
    if isinstance(menus, dict):
        out["menus"] = {
            unit: menus[unit]
            for unit in MENU_UNITS
            if isinstance(menus.get(unit), str)
            and lib["menus"].get(menus[unit], {}).get("kind") == unit
        }
    return out


# ── reading ──────────────────────────────────────────────────────────────


def _pick_counts(lib: Mapping[str, Any], kind: str) -> dict[str, int]:
    """How many owners pick each item of a kind, by the item's id (menus: by
    menu id). A system page's own pick is not an item and is not counted."""
    counts: dict[str, int] = {}
    for held in lib["picks"].values():
        if kind == "menus":
            for menu_id in set(held.get("menus", {}).values()):
                counts[menu_id] = counts.get(menu_id, 0) + 1
            continue
        for pick in held.get(kind, []):
            if "page" not in pick:
                counts[pick["id"]] = counts.get(pick["id"], 0) + 1
    return counts


def pickers(library: Mapping[str, Any], kind: str) -> dict[str, list[str]]:
    """Every item of a kind with the owners that pick it, sorted, including
    the items no one picks (an empty list): what a library summary lists."""
    _check_kind(kind)
    out: dict[str, list[str]] = {item_id: [] for item_id in library[kind]}
    for owner, held in sorted(library["picks"].items()):
        if kind == "menus":
            for menu_id in dict.fromkeys(held.get("menus", {}).values()):
                if menu_id in out:
                    out[menu_id].append(owner)
            continue
        for pick in held.get(kind, []):
            if "page" not in pick and pick["id"] in out:
                out[pick["id"]].append(owner)
    return out


def materialise(
    library: Mapping[str, Any],
    owner_id: str,
    kind: str,
    template: Mapping[str, Any] | None = None,
    screen: str = WATCH_SCREEN,
) -> dict[str, Any] | None:
    """The ``kind`` document the apps read for one owner, built from its
    picks. None when the owner has no picks of that kind (it never had a
    record, or the library has not met it): the caller leaves its record as
    it is, or writes none. ``screen`` is the owner's kind of device, whose
    screen each page is stamped with (:func:`stamp_page`).

    ``template`` is the owner's own document (its stored record, or the one
    it just saved). Every key of it the library does not own is kept as it
    is and where it is (``schemaVersion``, a key a newer app added); with no
    template the document is ``{"schemaVersion": 1, ...}``.

    * Pages and status pages: the list is the picks in order, each the
      library item (a page stamped with the owner's screen) with the pick's
      ``isHidden`` when it has one. A system page is the pick's own object.
      The list is built from the items, so a ``linkId`` in the template's
      list never survives.
    * Menus: ``quickAction`` and ``pageSwitcher`` from the picked Anywhere
      menu, ``entityRadial`` from the picked Entity quick menu, each placed
      where the template has it or at its sorted place. A unit with no pick
      keeps the template's sections. A ``linkIds`` the template carries (an
      old record, or an old panel save) is dropped.
    """
    _check_kind(kind)
    _check_screen(screen)
    held = library["picks"].get(owner_id)
    if not isinstance(held, dict) or kind not in held:
        return None
    base: dict[str, Any] = (
        copy.deepcopy(dict(template)) if isinstance(template, Mapping) else {"schemaVersion": 1}
    )
    if kind == "menus":
        return _materialise_menus(library, held["menus"], base)
    out: list[dict[str, Any]] = []
    for pick in held[kind]:
        if "page" in pick:
            out.append(copy.deepcopy(pick["page"]))
            continue
        item = library[kind].get(pick["id"])
        if item is None:
            continue
        page = stamp_page(item, screen) if kind == "pages" else copy.deepcopy(item)
        if HIDDEN_KEY in pick:
            page[HIDDEN_KEY] = copy.deepcopy(pick[HIDDEN_KEY])
        out.append(page)
    base[LIST_KEYS[kind]] = out
    return base


def _materialise_menus(
    library: Mapping[str, Any], picked: Mapping[str, str], base: dict[str, Any]
) -> dict[str, Any]:
    doc = base
    for unit, keys in MENU_UNITS.items():
        menu = library["menus"].get(picked.get(unit, ""))
        if menu is None:
            continue
        for key in keys:
            if key in menu["sections"]:
                doc = _with_key(doc, key, copy.deepcopy(menu["sections"][key]))
            else:
                doc.pop(key, None)
    # A stale mark from before the library dropped them: never written.
    return {k: v for k, v in doc.items() if k != LINK_IDS_KEY}


def changed_owners(
    before: Mapping[str, Any],
    after: Mapping[str, Any],
    saved: tuple[str, str, Mapping[str, Any]] | None = None,
    screen_of: Callable[[str], str | None] | None = None,
) -> dict[str, list[str]]:
    """For each owner, the kinds whose materialised record differs between
    two libraries. ``saved`` (owner, kind, document) is a document that owner
    just saved: that kind is compared against it instead, with it as the
    template. ``screen_of`` names each owner's screen; an owner it gives
    None for (or every owner, without it) is compared on both screens, so
    a change that reaches either is never missed."""
    out: dict[str, list[str]] = {}
    owners = sorted(set(before["picks"]) | set(after["picks"]))
    for owner in owners:
        known = screen_of(owner) if screen_of is not None else None
        screens = (known,) if known in SCREENS else SCREENS
        for kind in LIBRARY_KINDS:
            for screen in screens if kind == "pages" else SCREENS[:1]:
                if saved is not None and saved[0] == owner and saved[1] == kind:
                    was: Any = saved[2]
                    now: Any = materialise(after, owner, kind, saved[2], screen)
                else:
                    was = materialise(before, owner, kind, None, screen)
                    now = materialise(after, owner, kind, None, screen)
                if was != now:
                    out.setdefault(owner, []).append(kind)
                    break
    return out


def reach(library: Mapping[str, Any], page_ids: Iterable[str]) -> tuple[list[str], list[str]]:
    """The pages and status pages of the library that ``page_ids`` open:
    those pages, every page their Go to page and Peek page tiles open in
    turn, and every status page any of them opens (``page_links.link_reach``
    over the library). Ids as the library spells them."""
    pages_doc = {"pages": list(library["pages"].values())}
    status_doc = {"statusPages": list(library["status_pages"].values())}
    return link_reach(pages_doc, status_doc, page_ids)


def menu_targets(
    menus_doc: Any, units: Iterable[str] | None = None
) -> tuple[list[str], list[str]]:
    """The page ids and status page ids a menus document's slots open, each
    once in the order first met, as stored. ``units`` limits the walk to
    those units' sections (every unit when None). Only Go to page and
    Status page slots count; a speak phrase or HTTP action slot points at
    something else."""
    if not isinstance(menus_doc, dict):
        return [], []
    names = MENU_UNITS if units is None else units
    actions = {action: kind for kind, action in _MENU_ACTIONS.items()}
    found: dict[str, dict[str, str]] = {"pages": {}, "status_pages": {}}
    for unit in names:
        for key in MENU_UNITS[unit]:
            for slots in _slot_lists(menus_doc.get(key)):
                for slot in slots:
                    action = slot.get("action") if isinstance(slot, dict) else None
                    if not isinstance(action, dict) or action.get("type") not in actions:
                        continue
                    page_id = action.get(_MENU_PAGE_KEY)
                    if (page_key := _key(page_id)) is None:
                        continue
                    found[actions[action["type"]]].setdefault(page_key, page_id)
    return list(found["pages"].values()), list(found["status_pages"].values())


# ── renaming references ──────────────────────────────────────────────────


def _renames(mapping: Mapping[str, str]) -> dict[str, str]:
    return {k: new for old, new in mapping.items() if (k := _key(old)) is not None}


def rename_refs(
    kind: str,
    document: Any,
    pages: Mapping[str, str] | None = None,
    status_pages: Mapping[str, str] | None = None,
) -> Any:
    """``document`` (of ``kind``) with every reference to a renamed page or
    status page pointing at its new id (``{old: new}``, old ids compared
    ignoring case). A copy, even when nothing changes.

    * pages: each page's own id, and the tiles ``page.<id>``,
      ``show_page.<id>`` and ``status_page.<id>`` (only the id part).
    * status_pages: each status page's own id.
    * menus: the ``pageId`` of Go to page and Status page slots.
    * rooms and behavior: the room fallback page and the room mappings.
    Any other kind comes back as a copy.
    """
    page_map = _renames(pages or {})
    status_map = _renames(status_pages or {})
    doc = copy.deepcopy(document)
    if not isinstance(doc, dict) or not (page_map or status_map):
        return doc
    if kind == "pages":
        for page in _items(doc, "pages"):
            page["id"] = page_map.get(_key(page["id"]), page["id"])
            tiles = page.get("items")
            for tile in tiles if isinstance(tiles, list) else []:
                if isinstance(tile, dict):
                    _rename_tile(tile, page_map, status_map)
    elif kind == "status_pages":
        for page in _items(doc, "statusPages"):
            page["id"] = status_map.get(_key(page["id"]), page["id"])
    elif kind == "menus":
        for keys in MENU_UNITS.values():
            for key in keys:
                for slots in _slot_lists(doc.get(key)):
                    for slot in slots:
                        _rename_slot(slot, page_map, status_map)
    elif kind in ("rooms", "behavior"):
        fallback = doc.get(_ROOM_PAGE_KEY)
        if isinstance(fallback, str) and _key(fallback.strip()) in page_map:
            doc[_ROOM_PAGE_KEY] = page_map[_key(fallback.strip())]
        mappings = doc.get(_ROOM_MAPPINGS_KEY)
        if isinstance(mappings, dict):
            doc[_ROOM_MAPPINGS_KEY] = {
                room: page_map.get(_key(target), target) if isinstance(target, str) else target
                for room, target in mappings.items()
            }
    return doc


def _rename_tile(tile: dict[str, Any], page_map: Mapping[str, str], status_map: Mapping[str, str]) -> None:
    entity_id = tile.get("entityId")
    if not isinstance(entity_id, str) or "." not in entity_id:
        return
    prefix, target = entity_id.split(".", 1)
    names = page_map if prefix in _PAGE_TILE_KINDS else status_map if prefix == _STATUS_TILE_KIND else None
    if names and _key(target) in names:
        tile["entityId"] = f"{prefix}.{names[_key(target)]}"


def _rename_slot(slot: Any, page_map: Mapping[str, str], status_map: Mapping[str, str]) -> None:
    action = slot.get("action") if isinstance(slot, dict) else None
    if not isinstance(action, dict):
        return
    names = (
        page_map
        if action.get("type") == _MENU_ACTIONS["pages"]
        else status_map
        if action.get("type") == _MENU_ACTIONS["status_pages"]
        else None
    )
    target = _key(action.get(_MENU_PAGE_KEY))
    if names and target in names:
        action[_MENU_PAGE_KEY] = names[target]


def rename_complication(document: Any, pages: Mapping[str, str]) -> dict[str, Any] | None:
    """A complication document with its tap, and each tap layer, that opens
    a renamed page pointing at the new id (``openPageId``; the name stays).
    None when nothing in it opens one. Complications never open a status
    page."""
    names = _renames(pages)
    if not isinstance(document, dict) or not names:
        return None
    doc = copy.deepcopy(document)
    changed = False
    if _key(doc.get("openPageId")) in names:
        doc["openPageId"] = names[_key(doc["openPageId"])]
        changed = True
    elements = doc.get("elements")
    for element in elements if isinstance(elements, list) else []:
        payload = element.get("payload") if isinstance(element, dict) else None
        if not isinstance(payload, dict) or element.get("kind") != "tap":
            continue
        if _key(payload.get("openPageId")) in names:
            payload["openPageId"] = names[_key(payload["openPageId"])]
            changed = True
    return doc if changed else None


# ── folding one owner's documents into the library ───────────────────────


class _Links:
    """What a migration remembers between owners: the old link tokens each
    item was met under, and the new ids given to each taken id."""

    def __init__(self) -> None:
        self.tokens: dict[tuple[str, str], set[str]] = {}
        self.menus: dict[tuple[str, str], str] = {}
        self.forks: dict[tuple[str, str], list[str]] = {}


class _Merged(NamedTuple):
    renamed: dict[str, dict[str, str]]
    docs: dict[str, Any]
    new_menus: list[str]


def _merge_owner(
    lib: dict[str, Any],
    owner: str,
    docs: Mapping[str, Any],
    own: Mapping[str, Container[str]],
    *,
    links: _Links | None = None,
    owner_name: str | None = None,
    screen: str = WATCH_SCREEN,
) -> _Merged:
    """Fold one owner's documents into ``lib`` (a private copy, changed in
    place) and make them that owner's picks, for the kinds ``docs`` holds.

    A page or status page whose id the library does not hold becomes an
    item. One it holds is the same item when the copies are equal (but for
    ``isHidden`` and ``linkId``), when they share an old link token
    (``links``), or when ``own`` holds its compared id: then this copy's
    content is the item's. Any other copy is another page under a taken id,
    so it gets a new id (or a migration's earlier new id for an equal or
    linked copy of the same page), and every reference to it in ``docs`` is
    rewritten. That can make another page differ, so the walk repeats until
    nothing more is renamed.

    Menus, per unit: the picked menu takes the sections when ``own`` holds
    the unit, or stays picked when its sections are equal. Otherwise a
    migration (``links``) picks a menu with the same old link token or the
    same sections, and anything else makes a new menu.
    """
    docs = {k: copy.deepcopy(v) for k, v in docs.items() if isinstance(v, dict)}
    as_given = docs.get("menus")
    renamed: dict[str, dict[str, str]] = {"pages": {}, "status_pages": {}}
    origin: dict[tuple[str, str], str] = {}
    moved: set[tuple[str, str]] = set()
    while True:
        fresh: dict[str, dict[str, str]] = {"pages": {}, "status_pages": {}}
        for kind in ("status_pages", "pages"):
            if kind not in docs:
                continue
            index = _index(lib[kind])
            for page in _items(docs[kind], LIST_KEYS[kind]):
                if kind == "pages" and _is_system_page(page):
                    continue
                key = _key(page["id"])
                held = index.get(key)
                if held is None or _joins(lib, kind, page, held, links, screen) or key in own.get(kind, ()):
                    continue
                first = origin.get((kind, key), key)
                fork = None if (kind, key) in moved else _fork_for(lib, kind, page, first, links, screen)
                fresh[kind][page["id"]] = fork or new_item_id()
        if not any(fresh.values()):
            break
        docs = {
            k: rename_refs(k, d, fresh["pages"], fresh["status_pages"]) for k, d in docs.items()
        }
        for kind, names in fresh.items():
            for old, new in names.items():
                first = origin.pop((kind, _key(old)), _key(old))
                origin[(kind, _key(new))] = first
                moved.add((kind, _key(new)))
                was = next((o for o, n in renamed[kind].items() if _key(n) == _key(old)), old)
                renamed[kind][was] = new
    picks = lib["picks"].setdefault(owner, {})
    for kind in ("status_pages", "pages"):
        if kind in docs:
            picks[kind] = _commit_pages(
                lib, kind, docs[kind], own.get(kind, ()), links, origin, screen
            )
    new_menus: list[str] = []
    if "menus" in docs:
        # A unit whose slots the renames rewrote is no longer the menu its
        # old link token names: it opens this owner's own copy of a page.
        rewritten = {
            unit
            for unit, keys in MENU_UNITS.items()
            if any(as_given.get(k) != docs["menus"].get(k) for k in keys)
        }
        picks["menus"] = _commit_menus(
            lib,
            picks.get("menus", {}),
            docs["menus"],
            own.get("menus", ()),
            links,
            owner_name,
            new_menus,
            rewritten,
        )
    return _Merged({k: v for k, v in renamed.items() if v}, docs, new_menus)


def _joins(
    lib: Mapping[str, Any],
    kind: str,
    page: Mapping[str, Any],
    held: str,
    links: _Links | None,
    screen: str = WATCH_SCREEN,
) -> bool:
    """Whether ``page`` is the library item ``held``: an equal copy, or one
    that carried a link token the item was met under. A device's copy of a
    page is equal when it is the item as that device's screen reads it
    (:func:`stamp_page`), or the item whole with no ``screens`` (a record
    written before the screens, which held every tile as stored)."""
    item = lib[kind][held]
    if _same_content(page, item):
        return True
    if kind == "pages" and SCREENS_KEY not in page:
        whole = {k: v for k, v in item.items() if k != SCREENS_KEY}
        if _same_content(page, stamp_page(item, screen)) or _same_content(page, whole):
            return True
    token = page.get(LINK_KEY)
    return (
        links is not None
        and isinstance(token, str)
        and token in links.tokens.get((kind, _key(held)), set())
    )


def _fork_for(
    lib: Mapping[str, Any],
    kind: str,
    page: Mapping[str, Any],
    first: str,
    links: _Links | None,
    screen: str = WATCH_SCREEN,
) -> str | None:
    """A new id a migration already gave another copy of the page first met
    as ``first`` that this copy joins, so equal or linked copies on later
    devices stay one item."""
    if links is None:
        return None
    for fork in links.forks.get((kind, first), []):
        if fork in lib[kind] and _joins(lib, kind, page, fork, links, screen):
            return fork
    return None


def _commit_pages(
    lib: dict[str, Any],
    kind: str,
    document: Mapping[str, Any],
    own: Container[str],
    links: _Links | None,
    origin: Mapping[tuple[str, str], str],
    screen: str = WATCH_SCREEN,
) -> list[dict[str, Any]]:
    """The owner's picks of a list kind from its document, adding or
    updating the items they name. A page updates its item through
    :func:`_merge_saved_page`, so a device's save keeps the other screen; a
    new page carrying ``screens`` (the panel's) has them checked."""
    held = lib[kind]
    index = _index(held)
    out: list[dict[str, Any]] = []
    seen: set[str] = set()
    for page in _items(document, LIST_KEYS[kind]):
        key = _key(page["id"])
        if key in seen:
            continue
        seen.add(key)
        if kind == "pages" and _is_system_page(page):
            out.append({"id": page["id"], "page": copy.deepcopy(page)})
            continue
        stored = index.get(key)
        if stored is None:
            stored = page["id"]
            held[stored] = _content(page)
            if kind == "pages":
                held[stored] = _with_checked_screens(held[stored], strict=True)
            index[key] = stored
            first = origin.get((kind, key))
            if links is not None and first is not None and first != key:
                links.forks.setdefault((kind, first), []).append(stored)
        elif key in own:
            content = {k: (stored if k == "id" else v) for k, v in _content(page).items()}
            if kind == "pages":
                content = _merge_saved_page(held[stored], content, screen)
            held[stored] = content
        token = page.get(LINK_KEY)
        if links is not None and isinstance(token, str) and token:
            links.tokens.setdefault((kind, key), set()).add(token)
        pick: dict[str, Any] = {"id": stored}
        if HIDDEN_KEY in page:
            pick[HIDDEN_KEY] = copy.deepcopy(page[HIDDEN_KEY])
        out.append(pick)
    return out


def _commit_menus(
    lib: dict[str, Any],
    current: Mapping[str, str],
    document: Mapping[str, Any],
    own: Container[str],
    links: _Links | None,
    owner_name: str | None,
    new_menus: list[str],
    rewritten: Container[str] = (),
) -> dict[str, str]:
    """The owner's menu picks from its menus document, updating, joining or
    making the menus they name. The old link token of a unit in
    ``rewritten`` (its slots were pointed at renamed pages) is not
    followed: it joins a menu only by equal sections."""
    out: dict[str, str] = {}
    tokens = document.get(LINK_IDS_KEY) if isinstance(document.get(LINK_IDS_KEY), dict) else {}
    for unit, keys in MENU_UNITS.items():
        sections = {k: copy.deepcopy(document[k]) for k in keys if isinstance(document.get(k), dict)}
        picked = current.get(unit) if current.get(unit) in lib["menus"] else None
        if not sections:
            if picked is not None:
                out[unit] = picked
            continue
        token = tokens.get(unit) if isinstance(tokens.get(unit), str) and tokens.get(unit) else None
        if unit in rewritten:
            token = None
        if picked is not None and unit in own:
            lib["menus"][picked]["sections"] = sections
            out[unit] = picked
        elif picked is not None and lib["menus"][picked]["sections"] == sections:
            out[unit] = picked
        else:
            match = _menu_match(lib, unit, sections, token, links)
            if match is None:
                match = new_item_id()
                lib["menus"][match] = {
                    "name": new_menu_name(lib, unit, owner_name),
                    "kind": unit,
                    "sections": sections,
                }
                new_menus.append(match)
            out[unit] = match
        if links is not None and token is not None:
            links.menus.setdefault((unit, token), out[unit])
    return out


def _menu_match(
    lib: Mapping[str, Any],
    unit: str,
    sections: Mapping[str, Any],
    token: str | None,
    links: _Links | None,
) -> str | None:
    """In a migration, the menu of ``unit`` this one is: the one first met
    under the same old link token, else one with the same sections."""
    if links is None:
        return None
    if token is not None and links.menus.get((unit, token)) in lib["menus"]:
        return links.menus[(unit, token)]
    return next(
        (
            menu_id
            for menu_id, menu in lib["menus"].items()
            if menu["kind"] == unit and menu["sections"] == sections
        ),
        None,
    )


def new_menu_name(lib: Mapping[str, Any], unit: str, owner_name: str | None) -> str:
    """A name for a new menu of ``unit``: the plain name when it is the only
    one, else "<device>'s menu", else the plain name with a number."""
    taken = {menu["name"] for menu in lib["menus"].values() if menu["kind"] == unit}
    if not taken:
        return MENU_NAMES[unit]
    if owner_name and f"{owner_name}'s menu" not in taken:
        return f"{owner_name}'s menu"
    n = 2
    while f"{MENU_NAMES[unit]} {n}" in taken:
        n += 1
    return f"{MENU_NAMES[unit]} {n}"


# ── migration ────────────────────────────────────────────────────────────


def _screen_in(screens: Mapping[str, str] | None, owner: str) -> str:
    """An owner's screen as ``screens`` names it, the watch's by default."""
    found = (screens or {}).get(owner)
    return found if found in SCREENS else WATCH_SCREEN


def migrate(
    records: Mapping[str, Mapping[str, Any]],
    owner_order: Sequence[str],
    names: Mapping[str, str],
    screens: Mapping[str, str] | None = None,
) -> MigrationResult:
    """Build the library from every owner's ``pages``, ``status_pages`` and
    ``menus`` documents (``records``: owner id to kind to document; ``rooms``
    and ``behavior`` are read for the page ids they name). Owners are taken
    in ``owner_order``, then any others sorted.

    * Pages and status pages, by id across owners: linked copies (the same
      ``linkId`` on the same id) and equal copies (but for ``linkId`` and
      ``isHidden``) are one item, with the first owner's content. Under a
      taken id with other content, a later owner's page gets a new id, and
      that owner's tiles, menu slots and room links to it are rewritten
      (``renamed`` tells the caller, for its complications). An equal or
      linked copy of that same page on a later owner joins the same new id.
      A starter status page follows the same rule.
    * Menus, per owner and unit: units with the same ``linkIds`` token, or
      the same sections, are one menu. A menu is named "Anywhere menu" or
      "Entity quick menu" when it is the only one of its kind, else after
      the first owner that uses it ("Jesse's Apple Watch's menu").
    * Picks come from each record's order and ``isHidden``; a system page
      stays the owner's own.

    ``screens`` names each owner's screen (the watch's when it names none).
    The pages it builds have no ``screens`` yet: they read as the tiles'
    own fields on both screens, which is what every record held.
    """
    lib = empty_library()
    links = _Links()
    order = list(dict.fromkeys(o for o in owner_order if o in records))
    order += sorted(o for o in records if o not in set(order))
    first_owner: dict[str, str] = {}
    renamed: dict[str, dict[str, dict[str, str]]] = {}
    rewritten: dict[str, dict[str, dict[str, Any]]] = {}
    for owner in order:
        held = records[owner]
        docs = {
            kind: held[kind]
            for kind in (*LIBRARY_KINDS, "rooms", "behavior")
            if isinstance(held.get(kind), dict)
        }
        if not any(kind in docs for kind in LIBRARY_KINDS):
            continue
        merged = _merge_owner(
            lib, owner, docs, {}, links=links, screen=_screen_in(screens, owner)
        )
        for menu_id in merged.new_menus:
            first_owner[menu_id] = owner
        if merged.renamed:
            renamed[owner] = {
                "pages": merged.renamed.get("pages", {}),
                "status_pages": merged.renamed.get("status_pages", {}),
            }
        for kind in ("rooms", "behavior"):
            if kind in docs and merged.docs[kind] != docs[kind]:
                rewritten.setdefault(owner, {})[kind] = merged.docs[kind]
    for unit in MENU_UNITS:
        of_unit = [m for m, menu in lib["menus"].items() if menu["kind"] == unit]
        for n, menu_id in enumerate(of_unit, start=1):
            name = names.get(first_owner.get(menu_id, ""))
            lib["menus"][menu_id]["name"] = (
                MENU_NAMES[unit]
                if len(of_unit) == 1
                else f"{name}'s menu"
                if isinstance(name, str) and name
                else f"{MENU_NAMES[unit]} {n}"
            )
    changed: dict[str, list[str]] = {}
    for owner in order:
        for kind in (*LIBRARY_KINDS, "rooms", "behavior"):
            record = records[owner].get(kind)
            if not isinstance(record, dict):
                continue
            if kind in LIBRARY_KINDS:
                built = materialise(lib, owner, kind, record, _screen_in(screens, owner))
                differs = built != record
            else:
                differs = kind in rewritten.get(owner, {})
            if differs:
                changed.setdefault(owner, []).append(kind)
    lib = stamp_item_revisions(empty_library(), lib)
    return MigrationResult(lib, changed, renamed, rewritten)


# ── map-back: a saved document into the library ──────────────────────────


def map_back(
    library: Mapping[str, Any],
    owner_id: str,
    kind: str,
    document: Mapping[str, Any],
    *,
    fork_conflicts: bool = False,
    owner_name: str | None = None,
    screen: str = WATCH_SCREEN,
) -> MapBack:
    """Turn one owner's saved ``kind`` document into library and picks
    writes.

    * Pages and status pages: each page in the document updates the item of
      its id, less ``isHidden`` and ``linkId``; an id the library does not
      hold makes a new item. The document's order and ``isHidden`` are the
      owner's picks, so an id missing from it is no longer picked, but its
      item stays.
    * Menus: ``quickAction`` and ``pageSwitcher`` update the owner's picked
      Anywhere menu, ``entityRadial`` its picked Entity quick menu. A unit
      it picks nothing for yet makes a new menu, named with ``owner_name``
      when another menu of the kind exists, and picks it. ``linkIds`` in the
      document means nothing here: never a pick, a fork or an unlink, so a
      save carrying a stale one (or a restore of a revision that held one)
      maps onto the menus the owner uses now, like any other save.

    ``fork_conflicts`` is for an owner's first record of the kind (the
    iPhone's one-time upload of a watch's setup): a page or status page
    under an id the owner does not pick yet, whose content differs from the
    library's item, is another page, not an edit. It gets a new id, and the
    owner's other records are folded back in with that id rewritten
    (``renamed``); any of its items that the rewrite changes and that
    another owner also picks become the owner's own copies.

    ``screen`` is the owner's kind of device. A page saved without
    ``screens`` (every device's) writes its tiles' places into that screen
    only and keeps the other (:func:`_merge_saved_page`); one saved with
    them (the panel's) is taken whole.
    """
    _check_kind(kind)
    _check_screen(screen)
    if not isinstance(document, Mapping):
        raise LibraryError("invalid", "document must be an object")
    lib = copy.deepcopy(dict(library))
    if not fork_conflicts:
        merged = _merge_owner(
            lib,
            owner_id,
            {kind: document},
            {kind: _ALL},
            owner_name=owner_name,
            screen=screen,
        )
    else:
        merged = _merge_owner(
            lib,
            owner_id,
            _owner_docs(library, owner_id, kind, document, screen),
            _own_items(library, owner_id, kind),
            owner_name=owner_name,
            screen=screen,
        )
    lib = stamp_item_revisions(library, lib)
    touched = changed_owners(
        library,
        lib,
        (owner_id, kind, document),
        lambda owner: screen if owner == owner_id else None,
    )
    return MapBack(lib, touched, merged.renamed)


def _owner_docs(
    library: Mapping[str, Any],
    owner: str,
    kind: str,
    document: Mapping[str, Any],
    screen: str = WATCH_SCREEN,
) -> dict[str, Any]:
    """The owner's documents of every library kind it has picks of, with the
    saved one in place of its own kind."""
    docs: dict[str, Any] = {}
    for other in LIBRARY_KINDS:
        held = document if other == kind else materialise(library, owner, other, None, screen)
        if held is not None:
            docs[other] = held
    return docs


def _own_items(library: Mapping[str, Any], owner: str, kind: str) -> dict[str, Container[str]]:
    """What a fork-mode save of ``kind`` updates in place: the saved kind's
    items the owner picks (every unit for menus), and of the other kinds
    the items the owner alone picks."""
    held = library["picks"].get(owner, {})
    own: dict[str, Container[str]] = {}
    for other in LIBRARY_KINDS:
        counts = _pick_counts(library, other)
        if other == "menus":
            units = held.get("menus", {})
            own[other] = (
                set(MENU_UNITS)
                if other == kind
                else {u for u, m in units.items() if counts.get(m, 0) == 1}
            )
            continue
        own[other] = {
            _key(pick["id"])
            for pick in held.get(other, [])
            if "page" not in pick and (other == kind or counts.get(pick["id"], 0) == 1)
        }
    return own


# ── picks ────────────────────────────────────────────────────────────────


def _change(before: Mapping[str, Any], after: dict[str, Any]) -> Change:
    after = stamp_item_revisions(before, after)
    return Change(after, changed_owners(before, after))


def _stored_id(lib: Mapping[str, Any], kind: str, item_id: Any) -> str:
    stored = _index(lib[kind]).get(_key(item_id))
    if stored is None:
        raise LibraryError("not_found", f"the library holds no {kind} item {item_id}")
    return stored


def pick_page(
    library: Mapping[str, Any],
    owner_id: str,
    kind: str,
    item_id: str,
    on: bool,
    reach: Iterable[str] = (),
) -> Change:
    """Put a page or status page on an owner (``on``) at the end of its
    order, visible, or take it off (its item stays). Putting a page on also
    puts on each status page of ``reach`` the owner lacks, the status pages
    its tiles open (:func:`reach`, ``page_links.link_reach``); an id there
    the library does not hold is skipped. ``not_found`` for an item the
    library does not hold."""
    _check_kind(kind, LIST_KEYS)
    lib = copy.deepcopy(dict(library))
    stored = _stored_id(lib, kind, item_id)
    if not on:
        held = lib["picks"].get(owner_id, {})
        if kind in held:
            held[kind] = [p for p in held[kind] if _key(p["id"]) != _key(stored)]
        return _change(library, lib)
    held = lib["picks"].setdefault(owner_id, {})
    _add_pick(held, kind, stored)
    if kind == "pages":
        index = _index(lib["status_pages"])
        for status_id in reach:
            if (found := index.get(_key(status_id))) is not None:
                _add_pick(held, "status_pages", found)
    return _change(library, lib)


def _add_pick(held: dict[str, Any], kind: str, stored: str) -> None:
    picks = held.setdefault(kind, [])
    if not any(_key(p["id"]) == _key(stored) for p in picks):
        picks.append({"id": stored})


def pick_menu(library: Mapping[str, Any], owner_id: str, unit: str, menu_id: str) -> Change:
    """Make ``menu_id`` the owner's menu for ``unit``. ``not_found`` for a
    menu the library does not hold, ``invalid`` for one of the other
    unit."""
    _check_unit(unit)
    menu = library["menus"].get(menu_id)
    if menu is None:
        raise LibraryError("not_found", f"the library holds no menu {menu_id}")
    if menu["kind"] != unit:
        raise LibraryError("invalid", f"menu {menu_id} is not an {unit} menu")
    lib = copy.deepcopy(dict(library))
    lib["picks"].setdefault(owner_id, {}).setdefault("menus", {})[unit] = menu_id
    return _change(library, lib)


def copy_menu(library: Mapping[str, Any], owner_id: str, unit: str, name: str) -> Copied:
    """A new menu named ``name`` with the sections of the owner's current
    menu for ``unit``, picked by that owner in its place ("Make a copy for
    this watch"). ``not_found`` when the owner picks no menu for the unit,
    ``invalid`` for an empty name."""
    _check_unit(unit)
    name = _check_name(name)
    current = library["picks"].get(owner_id, {}).get("menus", {}).get(unit)
    if current not in library["menus"]:
        raise LibraryError("not_found", f"the device has no {unit} menu")
    lib = copy.deepcopy(dict(library))
    new_id = new_item_id()
    lib["menus"][new_id] = {
        "name": name,
        "kind": unit,
        "sections": copy.deepcopy(library["menus"][current]["sections"]),
    }
    lib["picks"][owner_id]["menus"][unit] = new_id
    change = _change(library, lib)
    return Copied(change.library, change.touched, new_id)


def create_menu(
    library: Mapping[str, Any], unit: str, name: str, sections: Mapping[str, Any]
) -> Copied:
    """A new menu of ``unit`` named ``name`` holding ``sections``, picked by
    no one (the Menus tab's New menu; a tick then puts it on a device), so
    no record changes. ``sections`` holds exactly the unit's keys
    (:data:`MENU_UNITS`), each an object; the store checks what is inside
    them. ``invalid`` for an unknown unit, an empty name or another shape."""
    _check_unit(unit)
    name = _check_name(name)
    if not isinstance(sections, Mapping) or set(sections) != set(MENU_UNITS[unit]):
        raise LibraryError(
            "invalid", f"sections must hold exactly {', '.join(MENU_UNITS[unit])}"
        )
    for key in MENU_UNITS[unit]:
        if not isinstance(sections[key], dict):
            raise LibraryError("invalid", f"sections.{key} must be an object")
    lib = copy.deepcopy(dict(library))
    new_id = new_item_id()
    lib["menus"][new_id] = {
        "name": name,
        "kind": unit,
        "sections": {key: copy.deepcopy(sections[key]) for key in MENU_UNITS[unit]},
    }
    change = _change(library, lib)
    return Copied(change.library, change.touched, new_id)


def create_item(library: Mapping[str, Any], kind: str, content: Mapping[str, Any]) -> Copied:
    """A new page or status page in the library, picked by no one (the
    Pages and Status pages tabs' New page; a tick then puts it on a
    device), so no record changes. ``content`` is the page object the panel
    made, with its id; it is kept as :func:`replace_item` keeps one
    (``isHidden`` and ``linkId`` dropped, ``screens`` checked). ``invalid`` for a menu, a page
    with no id, an id the library already holds or a system page."""
    _check_kind(kind, ("pages", "status_pages"))
    if not isinstance(content, Mapping) or _key(content.get("id")) is None:
        raise LibraryError("invalid", "the page needs an id")
    if kind == "pages" and _is_system_page(content):
        raise LibraryError("invalid", "a system page is never a library item")
    new_id = str(content["id"])
    if _key(new_id) in _index(library[kind]):
        raise LibraryError("invalid", f"the library already holds {kind} item {new_id}")
    lib = copy.deepcopy(dict(library))
    lib[kind][new_id] = _content(content)
    if kind == "pages":
        lib[kind][new_id] = _with_checked_screens(lib[kind][new_id], strict=True)
    change = _change(library, lib)
    return Copied(change.library, change.touched, new_id)


def rename_menu(library: Mapping[str, Any], menu_id: str, name: str) -> dict[str, Any]:
    """The library with a menu renamed. A name is not in any record, so no
    device changes, but it is the menu's content: a new name moves the
    menu's revision on. ``not_found`` or ``invalid`` (an empty name)."""
    name = _check_name(name)
    if menu_id not in library["menus"]:
        raise LibraryError("not_found", f"the library holds no menu {menu_id}")
    lib = copy.deepcopy(dict(library))
    lib["menus"][menu_id]["name"] = name
    return stamp_item_revisions(library, lib)


def replace_item(
    library: Mapping[str, Any], kind: str, item_id: str, content: Mapping[str, Any]
) -> Change:
    """The library with one item's content replaced, as an edit of the item
    in the library itself (the panel's library mode), and what that changes
    on every device that picks it.

    * Pages and status pages: ``content`` is the page object. Its id must be
      the item's (ignoring case); the item keeps the library's spelling of
      it, and ``isHidden`` and ``linkId`` are dropped, as a record save
      drops them. A system page is never an item. The page is taken whole,
      ``screens`` too: the panel sends both screens, and a page without the
      key reads as one (:func:`page_screens`). A ``screens`` of the wrong
      shape is ``invalid``; a tile on neither screen is dropped.
    * Menus: ``content`` is the menu's sections, exactly the keys of its
      unit (:data:`MENU_UNITS`), each an object. The name stays.

    The store checks the shape inside first, with the guard a record save
    of the kind meets. ``not_found`` for an item the library does not hold,
    ``invalid`` for content of another shape."""
    _check_kind(kind)
    stored = stored_item_id(library, kind, item_id)
    if not isinstance(content, Mapping):
        raise LibraryError("invalid", "content must be an object")
    lib = copy.deepcopy(dict(library))
    if kind == "menus":
        unit = lib["menus"][stored]["kind"]
        if set(content) != set(MENU_UNITS[unit]) or not all(
            isinstance(content[key], dict) for key in MENU_UNITS[unit]
        ):
            raise LibraryError(
                "invalid", f"sections must hold exactly {', '.join(MENU_UNITS[unit])}"
            )
        lib["menus"][stored]["sections"] = {
            key: copy.deepcopy(content[key]) for key in MENU_UNITS[unit]
        }
        return _change(library, lib)
    if _key(content.get("id")) != _key(stored):
        raise LibraryError("invalid", f"the page is not {kind} item {stored}")
    if kind == "pages" and _is_system_page(content):
        raise LibraryError("invalid", "a system page is never a library item")
    lib[kind][stored] = {k: (stored if k == "id" else v) for k, v in _content(content).items()}
    if kind == "pages":
        lib[kind][stored] = _with_checked_screens(lib[kind][stored], strict=True)
    return _change(library, lib)


def delete_item(
    library: Mapping[str, Any], kind: str, item_id: str, *, clear_tiles: bool = False
) -> Change:
    """Delete an item from the library.

    A page or status page goes from every owner's picks, and every menu
    slot that opened it (Go to page or Status page) goes from every menu,
    as the panel's delete everywhere does (``clearPageFromMenus``). The
    tiles that open it stay, as they do today, unless ``clear_tiles``. The
    caller clears complication taps itself: they live in another store. A
    menu any owner still picks is refused with ``in_use``.
    ``not_found`` for an id the library does not hold."""
    _check_kind(kind)
    lib = copy.deepcopy(dict(library))
    if kind == "menus":
        if item_id not in lib["menus"]:
            raise LibraryError("not_found", f"the library holds no menu {item_id}")
        if pickers(lib, "menus")[item_id]:
            raise LibraryError("in_use", f"menu {item_id} is still used by a device")
        del lib["menus"][item_id]
        return _change(library, lib)
    stored = _stored_id(lib, kind, item_id)
    key = _key(stored)
    del lib[kind][stored]
    for held in lib["picks"].values():
        if kind in held:
            held[kind] = [p for p in held[kind] if "page" in p or _key(p["id"]) != key]
    action = _MENU_ACTIONS[kind]
    for menu in lib["menus"].values():
        for section in menu["sections"].values():
            _drop_slots(section, action, key)
    if clear_tiles:
        prefixes = _PAGE_TILE_KINDS if kind == "pages" else (_STATUS_TILE_KIND,)
        pages = list(lib["pages"].values()) + [
            p["page"] for held in lib["picks"].values() for p in held.get("pages", []) if "page" in p
        ]
        for page in pages:
            _drop_tiles(page, prefixes, key)
    return _change(library, lib)


def _drop_slots(section: Any, action: str, key: str) -> None:
    """Take out of a section, in place, every slot running ``action`` on
    the page ``key``."""
    if not isinstance(section, dict):
        return
    def keep(slot: Any) -> bool:
        act = slot.get("action") if isinstance(slot, dict) else None
        return not (
            isinstance(act, dict)
            and act.get("type") == action
            and _key(act.get(_MENU_PAGE_KEY)) == key
        )

    if isinstance(section.get("slots"), list):
        section["slots"] = [s for s in section["slots"] if keep(s)]
    for name, value in list(section.items()):
        if name.endswith("Slots") and isinstance(value, list):
            section[name] = [s for s in value if keep(s)]
    overrides = section.get("entityOverrides")
    if isinstance(overrides, dict):
        for entity_id, slots in list(overrides.items()):
            if isinstance(slots, list):
                overrides[entity_id] = [s for s in slots if keep(s)]


def _drop_tiles(page: dict[str, Any], prefixes: Iterable[str], key: str) -> None:
    tiles = page.get("items")
    if not isinstance(tiles, list):
        return
    def opens(tile: Any) -> bool:
        entity_id = tile.get("entityId") if isinstance(tile, dict) else None
        if not isinstance(entity_id, str) or "." not in entity_id:
            return False
        prefix, target = entity_id.split(".", 1)
        return prefix in prefixes and _key(target) == key

    page["items"] = [t for t in tiles if not opens(t)]
    _drop_from_screens(page)


def copy_picks(
    library: Mapping[str, Any], from_owner: str, to_owner: str, kinds: Iterable[str]
) -> Change:
    """Give ``to_owner`` the picks of ``from_owner`` for ``kinds``: each page
    and status page it lacks, appended in the source's order with the
    source's ``isHidden`` (a system page is never copied), and for menus the
    source's menu of each unit it picks nothing for yet. The menus are then
    shared; a caller that wants the copy unshared follows with
    :func:`copy_menu`. What the target already picks stays as it is."""
    kinds = list(kinds)
    for kind in kinds:
        _check_kind(kind)
    lib = copy.deepcopy(dict(library))
    source = lib["picks"].get(from_owner, {})
    target = lib["picks"].setdefault(to_owner, {})
    for kind in kinds:
        if kind not in source:
            continue
        if kind == "menus":
            held = target.setdefault("menus", {})
            for unit, menu_id in source["menus"].items():
                held.setdefault(unit, menu_id)
            continue
        picks = target.setdefault(kind, [])
        have = {_key(p["id"]) for p in picks}
        for pick in source[kind]:
            if "page" not in pick and _key(pick["id"]) not in have:
                picks.append(copy.deepcopy(pick))
                have.add(_key(pick["id"]))
    return _change(library, lib)


def move_picks(
    library: Mapping[str, Any], source: str, target: str, kinds: Iterable[str]
) -> Change:
    """Carry ``source``'s picks of ``kinds`` (the kinds whose record moved
    whole) to ``target`` in place of its own, then forget ``source``. The
    ids renamed for ``source`` go to ``target`` too, beside its own (its own
    win), since its records now hold them."""
    kinds = list(kinds)
    for kind in kinds:
        _check_kind(kind)
    lib = copy.deepcopy(dict(library))
    held = lib["picks"].pop(source, {})
    for kind in kinds:
        if kind in held:
            lib["picks"].setdefault(target, {})[kind] = held[kind]
    lib["hashes"].pop(source, None)
    lib.get("revisions", {}).pop(source, None)
    moved = lib.get("renames", {}).pop(source, None)
    if moved:
        mine = held_renames(lib, target)
        lib["renames"][target] = {kind: {**moved.get(kind, {}), **mine[kind]} for kind in LIST_KEYS}
    return _change(library, lib)


def clear_menus(library: Mapping[str, Any], owner_id: str) -> Change:
    """The library with the owner using no menus, as before its first menu
    pick. The menus stay, and no other owner's records change."""
    lib = copy.deepcopy(dict(library))
    picks = lib["picks"].get(owner_id)
    if picks is not None:
        picks.pop("menus", None)
        if not picks:
            lib["picks"].pop(owner_id)
    for notes in ("hashes", "revisions"):
        held = lib.get(notes, {}).get(owner_id)
        if held is not None:
            held.pop("menus", None)
            if not held:
                lib[notes].pop(owner_id)
    return _change(library, lib)


def forget(library: Mapping[str, Any], owner_id: str) -> Change:
    """The library without an owner's picks. Its items stay, and no other
    owner's records change."""
    lib = copy.deepcopy(dict(library))
    lib["picks"].pop(owner_id, None)
    for notes in ("hashes", "revisions", "renames"):
        lib.get(notes, {}).pop(owner_id, None)
    return _change(library, lib)
