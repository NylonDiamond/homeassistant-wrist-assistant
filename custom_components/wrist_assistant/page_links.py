"""Linked pages: one page on more than one device.

A page on several devices (watches and iPhones) is the same page ``id`` in
each device's own ``pages`` document, plus a ``linkId`` string on the page
object. The same id keeps every tile ``page.<id>`` / ``show_page.<id>``, menu
slot and complication pointing at it right on every device, so nothing is
rewritten; the ``linkId`` marks the link on purpose, so two pages never count
as linked only because their ids match. Status pages link the same way, in
``status_pages`` (``{"statusPages": [...]}``).

What is shared and what is not:

* Shared: every key of the page object but ``isHidden``.
* Per device: the page's place in the list, and ``isHidden``.
* Never linked: a page with ``isSystemPage: true``, and the rooms.

The menus link too, not by item but by unit (:data:`LINK_UNITS`): the
Anywhere menu with the page switcher, and the Entity quick menu, each marked
in a top-level ``linkIds`` object. A menu link brings the pages and status
pages its slots open (:func:`menu_targets`). Plan: app repo
``docs/shared_things_plan_2026-10.md``, step 2. A watch's voice settings
link the same way, as one unit: the phrase library with the defaults behind
it. The watch's own speech settings stay on each watch
(:data:`UNIT_DEVICE_KEYS`). Step 3 of the same plan.

A starter status page (one of the app's five fixed ids, or
``isSystemDefault: true``) links like any other status page. It has the
same id on every device already, so a device that holds its own copy with
no ``linkId`` is not refused: that copy is adopted, taking the link and the
source's contents (:func:`apply_link`).

The store (``watch_config_store.py``) keeps the copies in step: after every
accepted write of a linked kind it hands each other device holding one of
the saved document's ``linkId`` values :func:`fan_out`'s result. Plan: app
repo ``docs/linked_pages_plan_2026-10.md``.

Pure, with no Home Assistant import, so it is tested on its own. Every
function returns new objects and never changes the documents it is given.
Ids are compared ignoring case (the app reads them as UUIDs); ``linkId``
values are compared as written.
"""

from __future__ import annotations

import copy
import uuid
from collections.abc import Callable, Iterable, Mapping
from typing import Any, NamedTuple

# The kinds a page can be linked in, and the key of each one's list.
LINKED_KINDS: dict[str, str] = {"pages": "pages", "status_pages": "statusPages"}

# The key on a page object that marks it linked.
LINK_KEY = "linkId"

# The per-device key on a linked page; every other key is shared.
HIDDEN_KEY = "isHidden"

# The app's five starter status pages, by their fixed ids (upper case).
SYSTEM_STATUS_PAGE_IDS = frozenset(
    f"00000000-0000-0000-0000-00000000000{n}" for n in range(1, 6)
)

# The tile kinds that open a page, and the one that opens a status page.
_PAGE_TILE_KINDS = ("page", "show_page")
_STATUS_TILE_KIND = "status_page"


class PageLinkError(Exception):
    """A link that cannot be made. ``code`` is the stable reason:
    ``not_found``, ``system_page``, ``id_taken`` or ``unit_taken``."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code
        self.message = message


def _key(value: Any) -> str | None:
    """An id as compared: upper case, or None for no usable id."""
    return value.upper() if isinstance(value, str) and value else None


def list_key(kind: str) -> str:
    """The key of a linked kind's list (``pages`` or ``statusPages``)."""
    return LINKED_KINDS[kind]


def items(document: Any, key: str) -> list[dict[str, Any]]:
    """The page objects of a document's list, in order. Anything that is not
    an object is skipped here (and left where it is in the document)."""
    raw = document.get(key) if isinstance(document, dict) else None
    return [item for item in raw if isinstance(item, dict)] if isinstance(raw, list) else []


def empty_document(key: str) -> dict[str, Any]:
    """The document a device with no record of a kind starts from."""
    return {"schemaVersion": 1, key: []}


def is_system_page(page: Mapping[str, Any]) -> bool:
    return page.get("isSystemPage") is True


def is_system_status_page(page: Mapping[str, Any]) -> bool:
    """Whether a status page is one of the app's starter pages, which every
    device has under the same id."""
    return _key(page.get("id")) in SYSTEM_STATUS_PAGE_IDS or page.get("isSystemDefault") is True


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


def link_ids(document: Any, key: str) -> set[str]:
    """Every ``linkId`` a document's list holds."""
    return {
        page[LINK_KEY]
        for page in items(document, key)
        if isinstance(page.get(LINK_KEY), str) and page[LINK_KEY]
    }


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
    """The pages and status pages a link of ``page_ids`` brings: those pages,
    every page their Go to page and Peek page tiles open in turn, and every
    status page any of them opens.

    The same walk as the panel's ``phoneCopyReach``. A tile is followed only
    to a page the document lists (never a system page) or a status page the
    status document holds; a smart page's tiles are its own (filled on the
    device), so they are not walked. A start id the document does not list is
    left out (:func:`check_link` refuses it first). Both lists come back in
    the documents' own order, with the ids as stored there.
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


def check_link(pages_doc: Any, page_ids: Iterable[str], key: str = "pages") -> None:
    """Refuse a link of pages the document does not list (``not_found``) or
    of a system page (``system_page``).

    With ``key`` ``statusPages`` the ids are status pages, and only a missing
    one is refused: a starter status page links like any other
    (:func:`apply_link`)."""
    noun = "page" if key == "pages" else "status page"
    by_key = {_key(page.get("id")): page for page in items(pages_doc, key)}
    for page_id in page_ids:
        page = by_key.get(_key(page_id))
        if page is None:
            raise PageLinkError("not_found", f"there is no {noun} {page_id}")
        if key == "pages" and is_system_page(page):
            raise PageLinkError("system_page", f"page {page_id} is a system page")


def new_link_id() -> str:
    return uuid.uuid4().hex


def apply_link(
    source_doc: Any, target_doc: Any, key: str, ids: Iterable[str]
) -> tuple[dict[str, Any], dict[str, Any], list[str], dict[str, str], list[str]]:
    """Put the pages ``ids`` of ``source_doc`` on a target device.

    Returns ``(source, target, added, links, adopted)``: the source document
    with a ``linkId`` on each linked page that had none (a fresh uuid4 hex),
    the target document with the pages it lacked appended at the end (same
    id, the source's ``linkId``, the source's ``isHidden``), the ids added,
    each linked page's ``linkId`` by its id, and the ids of the target's own
    copies adopted (below). ``target_doc`` None is a device with no record of
    the kind yet (:func:`empty_document`).

    A page the target already holds with the same ``linkId`` is left as it
    is. A target page with the same id and no or another ``linkId`` refuses
    the whole link (``id_taken``), as does an id the source does not hold
    (``not_found``) or a system page (``system_page``). One exception: a
    starter status page (:func:`is_system_status_page`, on either side) the
    target holds with no ``linkId`` is adopted where it stands. It takes the
    link and the source's contents, keeping its place and its ``isHidden``
    as :func:`fan_out` does, and is counted in ``adopted``, not ``added``. A
    starter copy with another ``linkId`` is still ``id_taken``.
    """
    source = copy.deepcopy(source_doc) if isinstance(source_doc, dict) else empty_document(key)
    target = copy.deepcopy(target_doc) if isinstance(target_doc, dict) else empty_document(key)
    if not isinstance(source.get(key), list):
        source[key] = []
    if not isinstance(target.get(key), list):
        target[key] = []
    source_by_key = {_key(page.get("id")): page for page in items(source, key)}
    target_by_key = {_key(page.get("id")): page for page in items(target, key)}
    added: list[str] = []
    adopted: list[str] = []
    links: dict[str, str] = {}
    for page_id in ids:
        page = source_by_key.get(_key(page_id))
        if page is None:
            raise PageLinkError("not_found", f"there is no page {page_id}")
        if key == "pages" and is_system_page(page):
            raise PageLinkError("system_page", f"page {page_id} is a system page")
        held = target_by_key.get(_key(page_id))
        link = page.get(LINK_KEY)
        if not isinstance(link, str) or not link:
            link = page[LINK_KEY] = new_link_id()
        links[page["id"]] = link
        if held is not None:
            if held.get(LINK_KEY) == link:
                continue
            if not _adoptable(page, held, key):
                raise PageLinkError(
                    "id_taken", f"the device already has another page with the id {page_id}"
                )
            joined = _linked_copy(page, held)
            place = next(i for i, other in enumerate(target[key]) if other is held)
            target[key][place] = joined
            target_by_key[_key(page_id)] = joined
            adopted.append(page["id"])
            continue
        target[key].append(copy.deepcopy(page))
        target_by_key[_key(page_id)] = target[key][-1]
        added.append(page["id"])
    return source, target, added, links, adopted


def _adoptable(page: Mapping[str, Any], held: Mapping[str, Any], key: str) -> bool:
    """Whether a target's ``held`` page under ``page``'s id can join its link
    instead of refusing it: a starter status page the target holds with no
    ``linkId``. Every device has the starters under the same ids, so the
    target's copy is the same page, not another one."""
    if key != LINKED_KINDS["status_pages"]:
        return False
    if isinstance(held.get(LINK_KEY), str) and held[LINK_KEY]:
        return False
    return is_system_status_page(page) or is_system_status_page(held)


def _linked_copy(source: Mapping[str, Any], held: Mapping[str, Any]) -> dict[str, Any]:
    """``source`` as ``held``'s device keeps it: every key but ``isHidden``
    from ``source``, the id as ``held`` writes it, and ``held``'s own
    ``isHidden`` (none when it had none)."""
    out = {k: copy.deepcopy(v) for k, v in source.items() if k != HIDDEN_KEY}
    out["id"] = held["id"]
    if HIDDEN_KEY in held:
        out[HIDDEN_KEY] = held[HIDDEN_KEY]
    return out


def fan_out(saved_doc: Any, other_doc: Any, key: str) -> dict[str, Any] | None:
    """``other_doc`` with each page linked to one in ``saved_doc`` replaced by
    the saved one, keeping the other's place and its ``isHidden``. None when
    nothing changes.

    A page counts as the same only with the same ``linkId`` and the same id;
    a page that kept the ``linkId`` under another id (a duplicate) is left
    alone. A page the save removed stays on the other device: removing a
    linked page everywhere is the panel's own action, never a fan-out.
    """
    saved: dict[tuple[str, str], dict[str, Any]] = {}
    for page in items(saved_doc, key):
        link, page_key = page.get(LINK_KEY), _key(page.get("id"))
        if isinstance(link, str) and link and page_key is not None:
            saved.setdefault((link, page_key), page)
    if not saved or not isinstance(other_doc, dict) or not isinstance(other_doc.get(key), list):
        return None
    changed = False
    out: list[Any] = []
    for page in other_doc[key]:
        source = (
            saved.get((page.get(LINK_KEY), _key(page.get("id"))))
            if isinstance(page, dict)
            else None
        )
        if source is None:
            out.append(page)
            continue
        replaced = _linked_copy(source, page)
        if replaced != page:
            changed = True
        out.append(replaced)
    if not changed:
        return None
    return {**other_doc, key: out}


def drop_link(document: Any, key: str, link_id: str) -> dict[str, Any] | None:
    """The document with ``link_id`` taken off every page that holds it (the
    last copy of a link, which is no longer linked to anything). None when
    no page holds it."""
    if not isinstance(document, dict) or not isinstance(document.get(key), list):
        return None
    changed = False
    out: list[Any] = []
    for page in document[key]:
        if isinstance(page, dict) and page.get(LINK_KEY) == link_id:
            page = {k: v for k, v in page.items() if k != LINK_KEY}
            changed = True
        out.append(page)
    return {**document, key: out} if changed else None


# ── linked units ─────────────────────────────────────────────────────────
#
# A kind that is one document per device rather than a list (the menus)
# links by unit: a set of the document's top-level keys that is the same on
# every device holding the link. The mark is a top-level `linkIds` object,
# one id per linked unit (`{"linkIds": {"anywhere": "<hex>"}}`), never a key
# inside a section, so a section stays exactly what the apps decode. The
# watch reads only the sections it names, so `linkIds` costs it nothing.
#
# Adding a kind is a row here; the store reaches every function below
# through `link_ops`.

# Each unit kind's units, and the top-level keys each one links as one. The
# page switcher is style only, so it goes with the Anywhere menu. The voice
# settings' phrase library goes with the defaults (agent, engine, speakers):
# a phrase with no speakers or engine of its own, and an Assist or Speak
# slot, falls back to them, so a phrase only plays the same on every watch
# with the same defaults behind it.
LINK_UNITS: dict[str, dict[str, tuple[str, ...]]] = {
    "menus": {"anywhere": ("quickAction", "pageSwitcher"), "entity": ("entityRadial",)},
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


# The menu actions whose payload opens a page or a status page, and the
# payload key holding its id (`menu-actions.json`, the `uuid` payloads whose
# `target` is `page` or `statusPage`).
_MENU_PAGE_ACTIONS: dict[str, tuple[str, str]] = {
    "navigateToPage": ("pageId", "page"),
    "showStatusPage": ("pageId", "statusPage"),
}


def _menu_slot_lists(section: Any) -> list[list[Any]]:
    """Every slot list of a menus section: the Anywhere menu's ``slots``, and
    the Entity quick menu's ``*Slots`` lists and each ``entityOverrides``
    list (the lists ``_check_menus`` checks)."""
    if not isinstance(section, dict):
        return []
    lists = [section["slots"]] if isinstance(section.get("slots"), list) else []
    lists += [v for k, v in section.items() if k.endswith("Slots") and isinstance(v, list)]
    overrides = section.get("entityOverrides")
    if isinstance(overrides, dict):
        lists += [v for v in overrides.values() if isinstance(v, list)]
    return lists


def menu_targets(
    menus_doc: Any, units: Iterable[str] | None = None
) -> tuple[list[str], list[str]]:
    """The page ids and status page ids the menu slots open, each once in the
    order first met, as stored. ``units`` limits the walk to those units'
    sections (every section when None). Only Go to page and Status page
    slots count; a speak phrase or HTTP action slot points at something
    else."""
    if not isinstance(menus_doc, dict):
        return [], []
    names = LINK_UNITS["menus"] if units is None else units
    pages: dict[str, str] = {}
    status: dict[str, str] = {}
    for unit in names:
        for key in unit_keys("menus", unit):
            for slots in _menu_slot_lists(menus_doc.get(key)):
                for slot in slots:
                    action = slot.get("action") if isinstance(slot, dict) else None
                    spec = (
                        _MENU_PAGE_ACTIONS.get(action.get("type"))
                        if isinstance(action, dict)
                        else None
                    )
                    page_id = action.get(spec[0]) if spec else None
                    page_key = _key(page_id)
                    if page_key is None:
                        continue
                    into = pages if spec[1] == "page" else status
                    into.setdefault(page_key, page_id)
    return list(pages.values()), list(status.values())


class LinkOps(NamedTuple):
    """How the store reads and keeps one linked kind's links, the same for a
    list kind (pages) and a unit kind (menus)."""

    ids: Callable[[Any], set[str]]
    fan_out: Callable[[Any, Any], dict[str, Any] | None]
    drop: Callable[[Any, str], dict[str, Any] | None]


def link_ops(kind: str) -> LinkOps | None:
    """The link functions of a linked kind, None for a kind that is never
    linked."""
    if kind in LINKED_KINDS:
        key = LINKED_KINDS[kind]
        return LinkOps(
            lambda d: link_ids(d, key),
            lambda saved, other: fan_out(saved, other, key),
            lambda d, link: drop_link(d, key, link),
        )
    if kind in LINK_UNITS:
        return LinkOps(
            lambda d: unit_link_ids(d, kind),
            lambda saved, other: fan_out_units(saved, other, kind),
            lambda d, link: drop_unit_link(d, kind, link),
        )
    return None


# Every kind that links, list kinds first.
LINKABLE_KINDS: tuple[str, ...] = (*LINKED_KINDS, *LINK_UNITS)


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


def link_places(documents: Mapping[str, Any], key: str) -> dict[str, list[str]]:
    """For each ``linkId`` in ``documents`` (owner id to document), the
    owners that hold it, sorted."""
    places: dict[str, set[str]] = {}
    for owner, document in documents.items():
        for link in link_ids(document, key):
            places.setdefault(link, set()).add(owner)
    return {link: sorted(owners) for link, owners in sorted(places.items())}
