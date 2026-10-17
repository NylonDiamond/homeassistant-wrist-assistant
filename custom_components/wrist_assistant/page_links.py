"""Linked voice settings, and the page walks the library and the iPhone copy
share.

Pages, status pages and menus no longer link: each lives once in the home's
library and devices pick it (``library.py``, app repo
``docs/one_library_plan_2026-10.md``). What is left here:

* A watch's voice settings still link watch to watch, by unit
  (:data:`LINK_UNITS`): the phrase library with the defaults behind it is one
  unit, marked in a top-level ``linkIds`` object (``{"linkIds": {"phrases":
  "<hex>"}}``) and kept in step by the store on every write of any copy
  (``watch_config_store.py``, ``_spread_links``). The watch's own speech
  settings stay on each watch (:data:`UNIT_DEVICE_KEYS`). Plan: app repo
  ``docs/shared_things_plan_2026-10.md``, step 3.
* :func:`link_reach`, the walk from a page through the Go to page and Peek
  page tiles to every page and status page it opens, which the library's
  :func:`library.reach` runs over its items.
* The page ids of a device's ``pages`` document (:func:`listed_page_ids`,
  :func:`ids_in`) and its rooms (:func:`rooms_from_behavior`), for the
  iPhone's copy of a watch's setup (``phone_pages_link_watch``).

Pure, with no Home Assistant import, so it is tested on its own. Every
function returns new objects and never changes the documents it is given.
Ids are compared ignoring case (the app reads them as UUIDs); link ids are
compared as written.
"""

from __future__ import annotations

import copy
import uuid
from collections.abc import Callable, Iterable, Mapping
from typing import Any, NamedTuple

# The tile kinds that open a page, and the one that opens a status page.
_PAGE_TILE_KINDS = ("page", "show_page")
_STATUS_TILE_KIND = "status_page"


class PageLinkError(Exception):
    """A link that cannot be made. ``code`` is the stable reason:
    ``not_found`` or ``unit_taken``."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code
        self.message = message


def _key(value: Any) -> str | None:
    """An id as compared: upper case, or None for no usable id."""
    return value.upper() if isinstance(value, str) and value else None


def items(document: Any, key: str) -> list[dict[str, Any]]:
    """The page objects of a document's list, in order. Anything that is not
    an object is skipped here (and left where it is in the document)."""
    raw = document.get(key) if isinstance(document, dict) else None
    return [item for item in raw if isinstance(item, dict)] if isinstance(raw, list) else []


def is_system_page(page: Mapping[str, Any]) -> bool:
    return page.get("isSystemPage") is True


def listed_page_ids(pages_doc: Any) -> list[str]:
    """The ids of every page but the system pages, in order."""
    return [
        page["id"]
        for page in items(pages_doc, "pages")
        if not is_system_page(page) and _key(page.get("id")) is not None
    ]


def ids_in(document: Any, key: str) -> list[str]:
    """The id of every page in a document's list, system pages included."""
    return [page["id"] for page in items(document, key) if _key(page.get("id")) is not None]


def _tile_link(tile: Mapping[str, Any]) -> tuple[str, str] | None:
    """``("page", ID)`` or ``("status", ID)`` for a tile that opens one, the
    id upper case; None for any other tile."""
    entity_id = tile.get("entityId")
    if not isinstance(entity_id, str) or "." not in entity_id:
        return None
    kind, target = entity_id.split(".", 1)
    target_key = _key(target)
    if target_key is None:
        return None
    if kind in _PAGE_TILE_KINDS:
        return "page", target_key
    if kind == _STATUS_TILE_KIND:
        return "status", target_key
    return None


def link_reach(
    pages_doc: Any, status_doc: Any, page_ids: Iterable[str]
) -> tuple[list[str], list[str]]:
    """The pages and status pages ``page_ids`` bring along: those pages,
    every page their Go to page and Peek page tiles open in turn, and every
    status page any of them opens.

    The same walk as the panel's ``phoneCopyReach``. A tile is followed only
    to a page the document lists (never a system page) or a status page the
    status document holds; a smart page's tiles are its own (filled on the
    device), so they are not walked. A start id the document does not list is
    left out. Both lists come back in the documents' own order, with the ids
    as stored there.
    """
    listed = {
        _key(page.get("id")): page
        for page in items(pages_doc, "pages")
        if not is_system_page(page) and _key(page.get("id")) is not None
    }
    held_status = {
        _key(page.get("id")) for page in items(status_doc, "statusPages") if _key(page.get("id"))
    }
    queue = [k for k in (_key(i) for i in page_ids) if k in listed]
    seen: set[str] = set(queue)
    status: set[str] = set()
    while queue:
        page = listed[queue.pop(0)]
        if isinstance(page.get("dynamicConfig"), dict):
            continue
        tiles = page.get("items")
        for tile in tiles if isinstance(tiles, list) else []:
            link = _tile_link(tile) if isinstance(tile, dict) else None
            if link is None:
                continue
            to, target = link
            if to == "status":
                if target in held_status:
                    status.add(target)
            elif target in listed and target not in seen:
                seen.add(target)
                queue.append(target)
    pages_out = [
        page["id"] for page in items(pages_doc, "pages") if _key(page.get("id")) in seen
        and not is_system_page(page)
    ]
    status_out = [
        page["id"] for page in items(status_doc, "statusPages") if _key(page.get("id")) in status
    ]
    return pages_out, status_out


def new_link_id() -> str:
    return uuid.uuid4().hex


# ── linked units ─────────────────────────────────────────────────────────
#
# A kind that is one document per device rather than a list links by unit: a
# set of the document's top-level keys that is the same on every device
# holding the link. The mark is a top-level `linkIds` object, one id per
# linked unit, never a key inside a section, so a section stays exactly what
# the watch decodes. The watch reads only the keys it names, so `linkIds`
# costs it nothing.
#
# Only the voice settings link this way now; the store reaches every function
# below through `link_ops`.

# Each unit kind's units, and the top-level keys each one links as one. The
# voice settings' phrase library goes with the defaults (agent, engine,
# speakers): a phrase with no speakers or engine of its own, and an Assist or
# Speak slot, falls back to them, so a phrase only plays the same on every
# watch with the same defaults behind it.
LINK_UNITS: dict[str, dict[str, tuple[str, ...]]] = {
    "voice": {
        "phrases": ("defaultAssistAgentId", "defaultSpeakers", "defaultTTSEngine", "phrases"),
    },
}

# The top-level keys of a unit kind's document that belong to the device and
# never go to another, not even in a first copy: the watch's own speech
# settings (Speak even in Silent Mode, and the watch voice, which names a
# voice installed on that watch). Every other key of the kind is in a unit
# or is `schemaVersion`.
UNIT_DEVICE_KEYS: dict[str, tuple[str, ...]] = {
    "voice": ("watchSpeakReplyInSilentMode", "watchSpeechVoiceIdentifier"),
}

# The top-level key of a unit kind's document holding its link ids.
LINK_IDS_KEY = "linkIds"


def unit_keys(kind: str, unit: str) -> tuple[str, ...]:
    """The top-level keys a unit links."""
    return LINK_UNITS[kind][unit]


def unit_links(document: Any, kind: str) -> dict[str, str]:
    """The link id of each linked unit of a document, by unit. A unit the
    kind does not name, or an id that is not a non-empty string, is left
    out."""
    raw = document.get(LINK_IDS_KEY) if isinstance(document, dict) else None
    if not isinstance(raw, dict):
        return {}
    return {
        unit: raw[unit]
        for unit in LINK_UNITS[kind]
        if isinstance(raw.get(unit), str) and raw[unit]
    }


def unit_link_ids(document: Any, kind: str) -> set[str]:
    """Every link id a unit kind's document holds."""
    return set(unit_links(document, kind).values())


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


def _with_link(document: Mapping[str, Any], kind: str, unit: str, link: str | None) -> dict[str, Any]:
    """``document`` with ``linkIds[unit]`` set to ``link``, or taken off for
    None (and ``linkIds`` itself gone once it is empty)."""
    raw = document.get(LINK_IDS_KEY)
    held = dict(raw) if isinstance(raw, dict) else {}
    if link is None:
        held.pop(unit, None)
    else:
        held[unit] = link
    if not held:
        return {k: v for k, v in document.items() if k != LINK_IDS_KEY}
    return _with_key(document, LINK_IDS_KEY, dict(sorted(held.items())))


def without_unit_links(document: Any) -> Any:
    """A copy of a document with no ``linkIds``: a copy that is not linked."""
    if not isinstance(document, dict):
        return copy.deepcopy(document)
    return {k: copy.deepcopy(v) for k, v in document.items() if k != LINK_IDS_KEY}


def _unit_value(document: Mapping[str, Any], keys: Iterable[str]) -> dict[str, Any]:
    return {key: document[key] for key in keys if key in document}


def unit_is_blank(document: Any, keys: Iterable[str]) -> bool:
    """Whether a document holds nothing of a unit: each key absent, null, an
    empty string, an empty list or an empty object. A new watch's voice
    settings are such a unit (no phrases, no engine, no speakers), so a link
    onto them takes nothing away."""
    if not isinstance(document, Mapping):
        return True
    return all(document.get(key) in (None, "", [], {}) for key in keys)


def _copy_unit(
    source: Mapping[str, Any], target: Mapping[str, Any], keys: Iterable[str]
) -> dict[str, Any]:
    """``target`` with each of ``keys`` as ``source`` holds it, and removed
    where ``source`` lacks it."""
    out = dict(target)
    for key in keys:
        if key in source:
            out = _with_key(out, key, copy.deepcopy(source[key]))
        else:
            out.pop(key, None)
    return out


def apply_unit_link(
    source_doc: Any, target_doc: Any, kind: str, unit: str, replace: bool = False
) -> tuple[dict[str, Any], dict[str, Any], str]:
    """Link one unit of ``source_doc`` onto a target device.

    Returns ``(source, target, link_id)``: the source with ``linkIds[unit]``
    set (a fresh uuid4 hex when it had none), the target holding the
    source's keys of the unit and the same link id, and that id.

    A target that already holds another link for the unit, or holds any of
    the unit's keys with another value, refuses with ``unit_taken`` unless
    ``replace`` is true; then the target's unit is the source's. A target
    whose unit is blank (:func:`unit_is_blank`) has nothing to lose and is
    never refused. A target already linked to the source's unit takes the
    source's keys again.
    ``target_doc`` None is a device with no document of the kind yet: it
    starts from the source's whole document, not linked (the other units are
    copied once, as a device's first copy of the kind), because a document
    must carry every unit for the apps to read it. The source device's own
    keys (:data:`UNIT_DEVICE_KEYS`) are left behind, so the target reads
    their defaults. A source that is not a document is ``not_found``; the
    store refuses it first. An unknown unit is a ``KeyError``: the caller
    checks units against :data:`LINK_UNITS`.
    """
    keys = unit_keys(kind, unit)
    if not isinstance(source_doc, dict):
        raise PageLinkError("not_found", f"there is no {kind} to link")
    source = copy.deepcopy(source_doc)
    if isinstance(target_doc, dict):
        target = copy.deepcopy(target_doc)
    else:
        own_keys = UNIT_DEVICE_KEYS.get(kind, ())
        target = {k: v for k, v in without_unit_links(source).items() if k not in own_keys}
    link = unit_links(source, kind).get(unit)
    held = unit_links(target, kind).get(unit)
    already_linked = link is not None and held == link
    own = held is not None or not (
        unit_is_blank(target, keys) or _unit_value(target, keys) == _unit_value(source, keys)
    )
    if own and not (replace or already_linked):
        raise PageLinkError("unit_taken", f"the device already holds its own {kind} for {unit}")
    if link is None:
        link = new_link_id()
        source = _with_link(source, kind, unit, link)
    target = _with_link(_copy_unit(source, target, keys), kind, unit, link)
    return source, target, link


def fan_out_units(saved_doc: Any, other_doc: Any, kind: str) -> dict[str, Any] | None:
    """``other_doc`` with every unit linked to the same unit of ``saved_doc``
    (the same unit holding the same link id) given the saved keys: each key
    of the unit as saved, a key the save lacks removed. None when nothing
    changes."""
    if not isinstance(other_doc, dict):
        return None
    saved = unit_links(saved_doc, kind)
    other = unit_links(other_doc, kind)
    out = other_doc
    for unit, link in saved.items():
        if other.get(unit) == link:
            out = _copy_unit(saved_doc, out, unit_keys(kind, unit))
    return out if out != other_doc else None


def drop_unit_link(document: Any, kind: str, link_id: str) -> dict[str, Any] | None:
    """The document with ``link_id`` taken off every unit holding it (the
    last copy of a link). None when no unit holds it."""
    if not isinstance(document, dict):
        return None
    out = document
    for unit, link in unit_links(document, kind).items():
        if link == link_id:
            out = _with_link(out, kind, unit, None)
    return out if out is not document else None


def unit_link_places(documents: Mapping[str, Any], kind: str) -> dict[str, dict[str, Any]]:
    """For each link id in ``documents`` (owner id to document), its unit and
    the owners that hold it, sorted: ``{linkId: {"unit": unit, "owners":
    [...]}}``. A link id is made for one unit, so the first unit seen names
    it."""
    places: dict[str, tuple[str, set[str]]] = {}
    for owner, document in sorted(documents.items()):
        for unit, link in unit_links(document, kind).items():
            places.setdefault(link, (unit, set()))[1].add(owner)
    return {
        link: {"unit": unit, "owners": sorted(owners)}
        for link, (unit, owners) in sorted(places.items())
    }


class LinkOps(NamedTuple):
    """How the store reads and keeps one linked kind's links."""

    ids: Callable[[Any], set[str]]
    fan_out: Callable[[Any, Any], dict[str, Any] | None]
    drop: Callable[[Any, str], dict[str, Any] | None]


def link_ops(kind: str) -> LinkOps | None:
    """The link functions of a linked kind, None for a kind that is never
    linked (pages, status pages and menus among them: the library holds
    those)."""
    if kind in LINK_UNITS:
        return LinkOps(
            lambda d: unit_link_ids(d, kind),
            lambda saved, other: fan_out_units(saved, other, kind),
            lambda d, link: drop_unit_link(d, kind, link),
        )
    return None


# The six keys a `rooms` record holds, under their `behavior` names (the
# panel's HOME_ROOM_KEYS). A watch whose rooms live in its `behavior` (its
# main house) keeps them there.
ROOM_KEYS = (
    "roomQuickJumpEnabled",
    "roomQuickJumpSourceEntityId",
    "roomQuickJumpFallbackPageId",
    "roomQuickJumpMappings",
    "roomAutoSwitchEnabled",
    "pointControlRoomMappingsJSON",
)


def rooms_from_behavior(behavior_doc: Any) -> dict[str, Any] | None:
    """A ``rooms`` document made of the room keys a watch keeps in its
    ``behavior``, or None when it sets none of them."""
    if not isinstance(behavior_doc, dict):
        return None
    kept = {key: copy.deepcopy(behavior_doc[key]) for key in ROOM_KEYS if key in behavior_doc}
    return {"schemaVersion": 1, **kept} if kept else None
