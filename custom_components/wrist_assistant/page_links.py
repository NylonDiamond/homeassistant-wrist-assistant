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
* Never linked: a page with ``isSystemPage: true``, a system status page
  (one of the app's five fixed ids, or ``isSystemDefault: true``), the menus
  and the rooms.

A system status page a link brings along is copied to a device that lacks
it, without a ``linkId``, so a tile that opens it still finds it there; a
device that already has it keeps its own.

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
from collections.abc import Iterable, Mapping
from typing import Any

# The kinds a page can be linked in, and the key of each one's list.
LINKED_KINDS: dict[str, str] = {"pages": "pages", "status_pages": "statusPages"}

# The key on a page object that marks it linked.
LINK_KEY = "linkId"

# The per-device key on a linked page; every other key is shared.
HIDDEN_KEY = "isHidden"

# The app's five system status pages, by their fixed ids (upper case).
SYSTEM_STATUS_PAGE_IDS = frozenset(
    f"00000000-0000-0000-0000-00000000000{n}" for n in range(1, 6)
)

# The tile kinds that open a page, and the one that opens a status page.
_PAGE_TILE_KINDS = ("page", "show_page")
_STATUS_TILE_KIND = "status_page"


class PageLinkError(Exception):
    """A link that cannot be made. ``code`` is the stable reason:
    ``not_found``, ``system_page`` or ``id_taken``."""

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
    return _key(page.get("id")) in SYSTEM_STATUS_PAGE_IDS or page.get("isSystemDefault") is True


def _never_linked(page: Mapping[str, Any], key: str) -> bool:
    return is_system_page(page) if key == "pages" else is_system_status_page(page)


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
    one is refused: a system status page is copied, never linked
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
) -> tuple[dict[str, Any], dict[str, Any], list[str], dict[str, str]]:
    """Put the pages ``ids`` of ``source_doc`` on a target device.

    Returns ``(source, target, added, links)``: the source document with a
    ``linkId`` on each linked page that had none (a fresh uuid4 hex), the
    target document with the pages it lacked appended at the end (same id,
    the source's ``linkId``, the source's ``isHidden``), the ids added, and
    each linked page's ``linkId`` by its id. ``target_doc`` None is a device
    with no record of the kind yet (:func:`empty_document`).

    A page the target already holds with the same ``linkId`` is left as it
    is. A target page with the same id and no or another ``linkId`` refuses
    the whole link (``id_taken``), as does an id the source does not hold
    (``not_found``) or a system page (``system_page``). A system status page
    is never linked: it is copied as it is to a target that lacks it, and
    left alone on one that has it.
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
    links: dict[str, str] = {}
    for page_id in ids:
        page = source_by_key.get(_key(page_id))
        if page is None:
            raise PageLinkError("not_found", f"there is no page {page_id}")
        if key == "pages" and is_system_page(page):
            raise PageLinkError("system_page", f"page {page_id} is a system page")
        held = target_by_key.get(_key(page_id))
        if _never_linked(page, key):
            if held is None:
                target[key].append(copy.deepcopy(page))
                target_by_key[_key(page_id)] = target[key][-1]
                added.append(page["id"])
            continue
        link = page.get(LINK_KEY)
        if not isinstance(link, str) or not link:
            link = page[LINK_KEY] = new_link_id()
        links[page["id"]] = link
        if held is not None:
            if held.get(LINK_KEY) != link:
                raise PageLinkError(
                    "id_taken", f"the device already has another page with the id {page_id}"
                )
            continue
        target[key].append(copy.deepcopy(page))
        target_by_key[_key(page_id)] = target[key][-1]
        added.append(page["id"])
    return source, target, added, links


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
        replaced = {k: copy.deepcopy(v) for k, v in source.items() if k != HIDDEN_KEY}
        replaced["id"] = page["id"]
        if HIDDEN_KEY in page:
            replaced[HIDDEN_KEY] = page[HIDDEN_KEY]
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
