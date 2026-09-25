"""Canonical storage for custom watch complications.

Home Assistant owns custom complication configuration. The HA panel is the only
editor; the watch keeps a read-only replica that it pulls itself. This module
is the single writer behind that design (see
``docs/custom_complication_watch_direct.md`` in the app repo).

Records are scoped by ``owner_watch_id``, the stable identity a watch
self-provisions under (the same id it signs its requests with). Each record
carries its own monotonic ``revision``; the whole store carries one monotonic
``token`` so a client can ask "anything new since N?" without downloading every
document.

Deleting a complication writes a tombstone (``deleted: true``) with a new
revision instead of erasing the row. A stale device replica must never be able
to recreate a deleted complication, and the only way to guarantee that is for
the deletion itself to be a revision the replica has to observe.

Sync metadata lives *outside* the complication document. ``document`` is the
Codable ``CustomComplicationConfig`` JSON the Apple clients already understand,
stored byte-for-byte as the editor submitted it. This module validates the
envelope (owner, UUID, revision, schema version, size, layer count, JSON types)
and refuses anything it cannot vouch for; it never rewrites the document.

Each record also keeps a short save history: the last few documents a save
replaced, so the panel can look at an earlier revision and put it back. That
history is storage only. It never reaches a client replica, because
``as_dict`` is the sync shape and the history rides in ``as_storage_dict``
instead, which only :meth:`ComplicationStore._serialize` calls.
"""

from __future__ import annotations

import copy
import json
import logging
import time
import uuid
from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store

from .const import (
    COMPLICATION_MAX_DOCUMENT_BYTES,
    COMPLICATION_MAX_LAYERS,
    COMPLICATION_MAX_PER_OWNER,
    COMPLICATION_MAX_SCHEMA_VERSION,
    COMPLICATION_MAX_SLOTS,
    COMPLICATION_STORAGE_KEY,
    COMPLICATION_STORAGE_VERSION,
    LIBRARY_OWNER_ID,
)

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 1
# A pull that changed nothing still moves the owner's last-sync stamp. Every
# watch pulls often, so saving the whole file for each stamp is a disk write
# per pull. The stamp only feeds "synced N minutes ago", so writing it at most
# once a minute per owner loses nothing anyone reads.
_LAST_SYNC_SAVE_INTERVAL_SECONDS = 60.0

# Keys the Swift decoder (`CustomComplicationConfig.init(from:)`) requires. A
# document missing any of these would throw on the watch, so refuse it here
# rather than store something no client can render.
_REQUIRED_DOCUMENT_KEYS: dict[str, type | tuple[type, ...]] = {
    "id": str,
    "name": str,
    "slotIndex": int,
    "supportedFamilies": list,
    "perFamily": (dict, list),
    "tapAction": (dict, str),
}
_OPTIONAL_DOCUMENT_KEYS: dict[str, type | tuple[type, ...]] = {
    "schemaVersion": int,
    "values": list,
    "elements": list,
    "dataSources": list,
    "refreshMinutes": int,
    # Page an openPage tap opens (watch page UUID) and its display name at
    # choosing time. Cosmetic pairing for the panel; the id is authoritative.
    "openPageId": str,
    "openPageName": str,
    "showSuccessFlash": bool,
    "successFlashColorHex": str,
    # Kept out of the watch's complication picker; a face already using it
    # keeps drawing it. Writers omit the key when shown.
    "hidden": bool,
    # Joins the linked copies of one complication across owners (watch and
    # iPhone). Same uuid on every copy; record ids stay different. Editor-only.
    "linkId": str,
    # What the author tells whoever imports the design. Editor-only; the apps
    # carry it and never draw it. Writers omit the key when there are none.
    "notes": str,
    # The Inline shape's text; present exactly when supportedFamilies has "inline".
    "inline": dict,
    # The document's Control Center control. The only key that lets
    # supportedFamilies be empty: a control is drawn by the OS, not by a shape.
    "control": dict,
}
_CANVAS_FAMILY_KINDS = frozenset({"rectangular", "circular", "corner"})
# The four iPhone Home Screen tile sizes (systemSmall, systemMedium,
# systemLarge, systemExtraLargePortrait). They are canvases too, but they are
# not part of the schema-6 predicate above, which is the watch's three.
_HOME_FAMILY_KINDS = frozenset({"small", "medium", "large", "xlarge"})
_FAMILY_KINDS = _CANVAS_FAMILY_KINDS | _HOME_FAMILY_KINDS | {"inline"}
# Every accepted family name, in the order the error message lists them.
_FAMILY_KINDS_TEXT = "rectangular, circular, corner, inline, small, medium, large, xlarge"
# First schema whose writers treat supportedFamilies as authoritative. Older
# apps draw every canvas shape from the shared layers and draw "Custom" for
# Inline, so a document that lacks a canvas shape or carries Inline must say 6.
_FAMILY_SCHEMA_VERSION = 6
# First schema that knows the iPhone Home Screen shapes. A document naming any
# of them must say 7 so an older app skips it instead of drawing a document
# whose shapes it cannot render.
_HOME_FAMILY_SCHEMA_VERSION = 7
# First schema that knows the list layer and the two value kinds that read it.
# An app that predates them fails the whole document on the unknown value kind,
# which is the intended behaviour ("update the app"), so the version must say
# so rather than leaving the app to discover it.
_LIST_SCHEMA_VERSION = 8
# First schema that knows pages. Unlike every other key in this ladder, an app
# that ignores this one does not draw a plainer complication: it draws every
# page stacked on every other page. So a document with pages is refused whole by
# an older app, and must say 9 for that to happen.
_PAGES_SCHEMA_VERSION = 9
# First schema that knows the `imageTime` value kind, a picture's fetched-at
# time read by a text layer. An app that predates it fails the whole document
# on the unknown value kind, the list reason again, so the version must say so.
_IMAGE_TIME_SCHEMA_VERSION = 10
# The list layer's own limits. Cells are the frame divided evenly, so the row
# count is what decides how many items are drawn and how small each one is; a
# template past eight layers is 96 leaves at twelve rows, which is where a
# watch's render budget stops being theoretical.
_LIST_MAX_TEMPLATE_LAYERS = 8
_LIST_MAX_ROWS = 12
# The sources a list may name. Three are rendered as Jinja alongside the rest
# of the face's values; three are fetched by `list_items.py`.
_LIST_SOURCE_KINDS = frozenset(
    {"entities", "attribute", "template", "calendar", "todo", "forecast"}
)
# Layer kinds a row template may not hold. `list` is the nesting refusal: a
# list of lists has no cell arithmetic and no item scope that means anything.
# The chart family is refused because a chart's data arrives by its own key and
# has nothing per-item to draw.
_LIST_FORBIDDEN_TEMPLATE_KINDS = frozenset(
    {
        "list",
        "chart",
        "timeline",
        "chartTimes",
        "chartDots",
        "chartGrid",
        "imageTime",
    }
)
# The two value kinds that only exist because a list does: `item` reads a field
# of the row being resolved, `listStat` reads a settled list's count.
_LIST_VALUE_KINDS = frozenset({"item", "listStat"})
# A hostile document could nest objects far deeper than any editor writes. The
# walk below is iterative and budgeted rather than recursive, so a deep or wide
# document is refused on size (above) instead of exhausting the stack here.
_LIST_WALK_NODE_BUDGET = 20000
# 0..COMPLICATION_MAX_SLOTS-1 into `ComplicationStableSlot` on the watch.
_SLOT_RANGE = range(COMPLICATION_MAX_SLOTS)
# Slots the original 8-slot pool covered. A document using a slot above these
# must carry schemaVersion >= 5 so old apps surface "needs app update" for it
# instead of silently dropping the claim (their slot-id parser rejects ids
# past 8).
_LEGACY_SLOT_RANGE = range(8)
# A preset name in the watch's report is display text only; cap it so a
# malformed report cannot bloat the store.
_PRESET_NAME_MAX_CHARS = 80


# A watch could not plausibly have more pages than this; cap the report so a
# malformed one cannot bloat the store.
_PAGE_MAX_ENTRIES = 100

# Past revisions kept per record, oldest dropped. Twenty is far more undo than
# anyone reaches for and still bounded: with the document cap at 256 KiB and
# 64 records per owner the worst case is arithmetic rather than a surprise.
COMPLICATION_HISTORY_LIMIT = 20


def _clean_page_entries(entries: list[Any]) -> list[dict[str, Any]]:
    """Normalize a page report to ``[{"id": uuid-str, "name": str}]``.

    Watch order is preserved (it is the order the user arranged the pages in),
    the first entry wins a duplicated id, and junk entries drop rather than
    refuse — like the preset report, this is advisory: it only feeds the
    panel's "Open the page" tap-action picker.
    """
    cleaned: list[dict[str, Any]] = []
    seen: set[str] = set()
    for entry in entries[:_PAGE_MAX_ENTRIES]:
        if not isinstance(entry, dict):
            continue
        raw_id = entry.get("id")
        if not isinstance(raw_id, str):
            continue
        try:
            page_id = str(uuid.UUID(raw_id)).upper()
        except ValueError:
            continue
        if page_id in seen:
            continue
        seen.add(page_id)
        name = entry.get("name", "")
        if not isinstance(name, str):
            name = ""
        cleaned.append({"id": page_id, "name": name.strip()[:_PRESET_NAME_MAX_CHARS]})
    return cleaned


def _clean_preset_entries(entries: list[Any]) -> list[dict[str, Any]]:
    """Normalize a preset report to ``[{"slot": int, "name": str}]``, sorted.

    Accepts ``{"slot": n, "name": s}`` dicts and bare slot ints (the shape a
    short-lived pre-release build sent, name empty). The report is advisory
    (it only steers the panel), so junk entries drop rather than refuse; the
    first entry wins a duplicated slot.
    """
    cleaned: dict[int, str] = {}
    for entry in entries:
        if isinstance(entry, dict):
            slot = entry.get("slot")
            name = entry.get("name", "")
        else:
            slot, name = entry, ""
        if isinstance(slot, bool) or not isinstance(slot, int) or slot not in _SLOT_RANGE:
            continue
        if slot in cleaned:
            continue
        if not isinstance(name, str):
            name = ""
        cleaned[slot] = name.strip()[:_PRESET_NAME_MAX_CHARS]
    return [{"slot": slot, "name": cleaned[slot]} for slot in sorted(cleaned)]


_OCCUPIED_KINDS = frozenset({"preset", "custom"})


def _clean_occupied_entries(entries: list[Any]) -> list[dict[str, Any]]:
    """Normalize an occupied-slot report, sorted by slot.

    Shape: ``[{"slot": int, "name": str, "kind": "preset"|"custom",
    "home": str, "families": [str]?}]``. ``kind`` says what holds the slot:
    an iPhone preset (any home) or a custom complication that lives on a
    different Home Assistant. ``home`` is the display name of the home it
    belongs to, empty when the watch did not say. ``families`` is a custom
    document's ``supportedFamilies``, sorted; it is absent when the watch did
    not send it (a watch from before per-shape documents) or sent nothing
    usable, so a row never needs it. Advisory like the preset report: junk
    entries drop, the first entry wins a duplicated slot, and a missing kind
    reads as "preset" so a report that only knows presets still parses.
    """
    cleaned: dict[int, dict[str, Any]] = {}
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        slot = entry.get("slot")
        if isinstance(slot, bool) or not isinstance(slot, int) or slot not in _SLOT_RANGE:
            continue
        if slot in cleaned:
            continue
        name = entry.get("name", "")
        if not isinstance(name, str):
            name = ""
        # A watch could report anything here. `in` on a frozenset raises
        # TypeError for an unhashable value (a list, a dict), and the report
        # is advisory: an unrecognisable kind reads as "preset" like a missing
        # one, it never takes the sync call down.
        kind = entry.get("kind", "preset")
        if not isinstance(kind, str) or kind not in _OCCUPIED_KINDS:
            kind = "preset"
        home = entry.get("home", "")
        if not isinstance(home, str):
            home = ""
        row: dict[str, Any] = {
            "slot": slot,
            "name": name.strip()[:_PRESET_NAME_MAX_CHARS],
            "kind": kind,
            "home": home.strip()[:_PRESET_NAME_MAX_CHARS],
        }
        families = entry.get("families")
        if isinstance(families, list):
            known = sorted({f for f in families if isinstance(f, str) and f in _FAMILY_KINDS})
            if known:
                row["families"] = known
        cleaned[slot] = row
    return [cleaned[slot] for slot in sorted(cleaned)]


def _presets_from_occupied(entries: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """The preset-kind rows of an occupied report, in the preset shape."""
    return [
        {"slot": e["slot"], "name": e["name"]} for e in entries if e["kind"] == "preset"
    ]


class ComplicationStoreError(Exception):
    """Base class; ``code`` is the stable machine-readable reason."""

    code = "error"

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class ComplicationValidationError(ComplicationStoreError):
    """The submitted envelope or document is malformed."""

    code = "invalid"


class ComplicationConflictError(ComplicationStoreError):
    """``base_revision`` does not match the stored revision."""

    code = "conflict"

    def __init__(self, message: str, current: ComplicationRecord | None) -> None:
        super().__init__(message)
        self.current = current


class ComplicationNotFoundError(ComplicationStoreError):
    """No record with that id exists for that owner."""

    code = "not_found"


@dataclass
class ComplicationHistoryEntry:
    """One past revision of a record: what a later save replaced.

    ``revision`` and ``saved_at`` are the replaced record's own, so an entry
    reads as "this is what revision N looked like" rather than "this is when
    someone went back to it".
    """

    revision: int
    saved_at: str
    updated_by: str
    document: dict[str, Any]

    def as_dict(self) -> dict[str, Any]:
        """The storage shape, document included."""
        return {
            "revision": self.revision,
            "savedAt": self.saved_at,
            "updatedBy": self.updated_by,
            "document": self.document,
        }

    def summary(self) -> dict[str, Any]:
        """What the panel's history list draws: no document body.

        ``name``, ``layers`` and ``families`` are the facts the list needs to
        tell two entries apart; the panel words them itself. The body is
        fetched one entry at a time, for the preview.
        """
        elements = self.document.get("elements")
        families = self.document.get("supportedFamilies")
        name = self.document.get("name")
        return {
            "revision": self.revision,
            "savedAt": self.saved_at,
            "updatedBy": self.updated_by,
            "name": name if isinstance(name, str) else "",
            "layers": len(elements) if isinstance(elements, list) else 0,
            "families": [f for f in families if isinstance(f, str)]
            if isinstance(families, list)
            else [],
        }

    @classmethod
    def from_dict(cls, raw: Any) -> ComplicationHistoryEntry | None:
        """One entry off disk, or ``None`` for anything unusable.

        Junk drops rather than refuses: a history entry is a convenience, and
        a hand-edited storage file must not cost someone their complications.
        """
        if not isinstance(raw, dict):
            return None
        revision = raw.get("revision")
        document = raw.get("document")
        if isinstance(revision, bool) or not isinstance(revision, int):
            return None
        if not isinstance(document, dict):
            return None
        saved_at = raw.get("savedAt", "")
        updated_by = raw.get("updatedBy", "")
        return cls(
            revision=revision,
            saved_at=saved_at if isinstance(saved_at, str) else "",
            updated_by=updated_by if isinstance(updated_by, str) else "",
            document=document,
        )


def _clean_history_entries(entries: Any) -> list[ComplicationHistoryEntry]:
    """Normalize a stored history list: oldest first, capped, junk dropped."""
    if not isinstance(entries, list):
        return []
    cleaned = [
        entry
        for raw in entries
        if (entry := ComplicationHistoryEntry.from_dict(raw)) is not None
    ]
    return cleaned[-COMPLICATION_HISTORY_LIMIT:]


@dataclass
class ComplicationRecord:
    """One stored complication plus its sync envelope."""

    id: str
    owner_watch_id: str
    revision: int
    token: int
    updated_at: str
    updated_by: str
    deleted: bool
    document: dict[str, Any] | None
    # Past revisions, oldest first. Storage only: it is not part of
    # :meth:`as_dict`, which is the shape every replica reads.
    history: list[ComplicationHistoryEntry] = field(default_factory=list)

    def as_dict(self) -> dict[str, Any]:
        """The sync shape. Every client replica reads exactly this."""
        return {
            "id": self.id,
            "ownerWatchId": self.owner_watch_id,
            "revision": self.revision,
            "token": self.token,
            "updatedAt": self.updated_at,
            "updatedBy": self.updated_by,
            "deleted": self.deleted,
            "document": self.document,
        }

    def as_storage_dict(self) -> dict[str, Any]:
        """The sync shape plus the save history, for the storage file alone.

        The history would double the size of every sync reply and no client
        has any use for it, so the two shapes are deliberately different and
        only ``_serialize`` calls this one.
        """
        stored = self.as_dict()
        if self.history:
            stored["history"] = [entry.as_dict() for entry in self.history]
        return stored

    @classmethod
    def from_dict(cls, raw: dict[str, Any]) -> ComplicationRecord | None:
        try:
            record = cls(
                id=str(raw["id"]),
                owner_watch_id=str(raw["ownerWatchId"]),
                revision=int(raw["revision"]),
                token=int(raw.get("token", 0)),
                updated_at=str(raw.get("updatedAt", "")),
                updated_by=str(raw.get("updatedBy", "")),
                deleted=bool(raw.get("deleted", False)),
                document=raw.get("document"),
                # Absent from every file written before save history existed,
                # which is the common case on the first load after an update.
                history=_clean_history_entries(raw.get("history")),
            )
        except (KeyError, TypeError, ValueError):
            return None
        if record.document is not None and not isinstance(record.document, dict):
            return None
        if not record.deleted and record.document is None:
            return None
        return record


@dataclass
class ComplicationChange:
    """What a listener receives after a commit, or after the watch acks.

    A commit carries the record. An ack (the watch reported the token it has
    applied) carries no record; ``applied_token`` is the news. ``token`` is
    the store token at the time either way.
    """

    owner_watch_id: str
    token: int
    record: ComplicationRecord | None = None
    applied_token: int | None = None


ChangeListener = Callable[[ComplicationChange], None]
# Called with the owner watch id after every commit for that owner, so the
# long-poll the watch is holding can wake and hand it the new token.
WakeCallback = Callable[[str], None]
# Called with the owner id and the new store token after every commit, so an
# iPhone owner (which holds no long-poll to wake) can be sent a background
# push instead. See ``complication_push.py``.
PushCallback = Callable[[str, int], None]


def _now_iso() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _slot_of(record: ComplicationRecord) -> int:
    """The watch slot a record occupies, or -1 when it holds none.

    ``validate_document`` guarantees 0..7 on the way in, but a row loaded from
    disk is not revalidated, so anything unexpected reads as "no slot" rather
    than raising in the middle of a move.
    """
    slot = (record.document or {}).get("slotIndex")
    if isinstance(slot, bool) or not isinstance(slot, int):
        return -1
    return slot


def shapes_of(document: Any) -> frozenset[str]:
    """The shapes a document draws, as the key a slot is shared by.

    A slot holds at most one document per shape (one shape per complication,
    2026-09-20), so two documents may sit at one slot as long as these sets
    are disjoint. A control-only document (no families, a ``control`` block)
    takes the pseudo shape ``control`` so two controls cannot share a slot
    either. Anything unreadable reads as no shapes, which never clashes.
    """
    if not isinstance(document, dict):
        return frozenset()
    families = document.get("supportedFamilies")
    shapes = {f for f in families if isinstance(f, str)} if isinstance(families, list) else set()
    if not shapes and isinstance(document.get("control"), dict):
        shapes.add("control")
    return frozenset(shapes)


def _slot_shapes(record: ComplicationRecord) -> set[tuple[int, str]]:
    """Every (slot, shape) pair a record occupies."""
    slot = _slot_of(record)
    if slot < 0:
        return set()
    return {(slot, shape) for shape in shapes_of(record.document)}


def _validate_uuid(value: Any, what: str) -> str:
    if not isinstance(value, str):
        raise ComplicationValidationError(f"{what} must be a string UUID")
    try:
        return str(uuid.UUID(value)).upper()
    except ValueError as err:
        raise ComplicationValidationError(f"{what} is not a UUID") from err


def _validate_list_elements(elements: list[Any]) -> bool:
    """Check every list layer, and say whether the document has one.

    Only the top level is walked, because a list inside a row template is
    refused here: there is no second level to reach. What is checked is the
    shape a hostile document could use to make a watch draw something the
    editor would never write, which is the row template (its size and the
    kinds in it), the row count, and the source kind. Everything deeper
    belongs to the Swift and TypeScript resolvers, which share fixtures.
    """
    found = False
    for element in elements:
        if not isinstance(element, dict) or element.get("kind") != "list":
            continue
        found = True
        payload = element.get("payload")
        if not isinstance(payload, dict):
            raise ComplicationValidationError("a list layer needs a payload object")

        # Every `in` below is guarded by an `isinstance` check: a hand-written
        # document can put an object where a kind name belongs, and set
        # membership raises TypeError on one of those rather than answering
        # "invalid".
        source = payload.get("source")
        source_kind = source.get("kind") if isinstance(source, dict) else None
        if not isinstance(source_kind, str) or source_kind not in _LIST_SOURCE_KINDS:
            raise ComplicationValidationError(
                "a list layer's source.kind must be one of "
                + ", ".join(sorted(_LIST_SOURCE_KINDS))
            )

        rows = payload.get("rows")
        if rows is not None:
            if (
                isinstance(rows, bool)
                or not isinstance(rows, int)
                or not 1 <= rows <= _LIST_MAX_ROWS
            ):
                raise ComplicationValidationError(
                    f"a list layer's rows must be 1..{_LIST_MAX_ROWS}"
                )

        template = payload.get("template")
        if template is None:
            continue
        if not isinstance(template, list):
            raise ComplicationValidationError(
                "a list layer's template must be a list of layers"
            )
        if len(template) > _LIST_MAX_TEMPLATE_LAYERS:
            raise ComplicationValidationError(
                "a list layer's template exceeds "
                f"{_LIST_MAX_TEMPLATE_LAYERS} layers"
            )
        for layer in template:
            if not isinstance(layer, dict):
                raise ComplicationValidationError(
                    "a list layer's template must contain objects"
                )
            kind = layer.get("kind")
            if isinstance(kind, str) and kind in _LIST_FORBIDDEN_TEMPLATE_KINDS:
                raise ComplicationValidationError(
                    f"a list layer's template must not hold a {kind} layer"
                )
    return found


def _uses_pages(document: dict, elements: list) -> bool:
    """Whether this document really uses pages.

    Either half alone is enough, and for the same reason: a `pages` object with
    more than one page, or a single layer pinned to a page, is a document an app
    that predates pages would draw with everything on top of everything else.
    Mirrors `CustomComplicationConfig.usesPages` in the app repo; keep the two
    reading the same document the same way.

    Only top-level layers are read, as the app reads them. A page on a row layer
    inside a list means nothing on either side.
    """
    pages = document.get("pages")
    if isinstance(pages, dict):
        count = pages.get("count")
        if isinstance(count, int) and count > 1:
            return True
    for element in elements:
        payload = element.get("payload")
        if not isinstance(payload, dict):
            continue
        page = payload.get("page")
        if isinstance(page, int) and not isinstance(page, bool) and page >= 1:
            return True
    return False


def _mentions_list_values(document: dict[str, Any]) -> bool:
    """Whether anything in the document is an ``item`` or ``listStat`` value.

    Envelope level, not a resolver. It walks the subtrees a value can sit in
    (the layers, and so their rules, parts and row templates; the top-level
    value pool; the Inline object; the per-family map) and looks for the kind
    marker. One is enough to fix the schema version, so it stops at the first.

    Iterative and budgeted rather than recursive: a document deep enough to
    exhaust the budget is refused on size a few lines further down, and a
    validator must answer "invalid" rather than blow up with a 500 the panel
    cannot render.
    """
    # A `Value` holds its kind object under the same key, so most of what the
    # walk sees is a dict rather than a name. `in` on a frozenset raises
    # TypeError for one of those, and a validator must answer "invalid", never
    # blow up with a 500 the panel cannot render.
    return _walk_values(
        document,
        lambda node: isinstance(node.get("kind"), str)
        and node["kind"] in _LIST_VALUE_KINDS,
    )


def _mentions_image_time_value(document: dict[str, Any]) -> bool:
    """Whether anything in the document is an ``imageTime`` value.

    ``imageTime`` is also an older layer kind, written ``{"kind": "imageTime",
    "payload": {...}}``, which needs nothing. The value is the flat kind object
    ``{"kind": "imageTime", "layer": "<uuid>"}``: it names a layer and has no
    payload, and that is what tells the two apart.
    """
    return _walk_values(
        document,
        lambda node: node.get("kind") == "imageTime"
        and "layer" in node
        and "payload" not in node,
    )


def _walk_values(document: dict[str, Any], hit: Any) -> bool:
    """Whether any dict under the value-bearing subtrees satisfies ``hit``.

    The shared walk behind the value-kind checks above, iterative and budgeted
    for the reasons given on ``_mentions_list_values``.
    """
    stack: list[Any] = [
        document.get("elements"),
        document.get("values"),
        document.get("inline"),
        document.get("perFamily"),
    ]
    budget = _LIST_WALK_NODE_BUDGET
    while stack and budget > 0:
        node = stack.pop()
        budget -= 1
        if isinstance(node, dict):
            if hit(node):
                return True
            stack.extend(node.values())
        elif isinstance(node, list):
            stack.extend(node)
    return False


def validate_document(document: Any) -> dict[str, Any]:
    """Check the envelope-level shape of a complication document.

    Deep semantics (rule shapes, value kinds, frames) belong to the Swift and
    TypeScript resolvers, which share fixtures. This layer only guarantees that
    what lands on disk is a JSON object the Apple decoder will not throw on and
    that it is within size limits. Returns the document unchanged.
    """
    if not isinstance(document, dict):
        raise ComplicationValidationError("document must be a JSON object")

    for key, expected in _REQUIRED_DOCUMENT_KEYS.items():
        if key not in document:
            raise ComplicationValidationError(f"document.{key} is required")
        if not isinstance(document[key], expected) or isinstance(document[key], bool):
            raise ComplicationValidationError(f"document.{key} has the wrong type")
    for key, expected in _OPTIONAL_DOCUMENT_KEYS.items():
        if key in document and document[key] is not None:
            value = document[key]
            # bool is an int subclass; keep the two apart so `true` cannot
            # sneak into an integer field.
            if expected is int and isinstance(value, bool):
                raise ComplicationValidationError(f"document.{key} has the wrong type")
            if not isinstance(value, expected):
                raise ComplicationValidationError(f"document.{key} has the wrong type")

    _validate_uuid(document["id"], "document.id")

    if not document["name"].strip():
        raise ComplicationValidationError("document.name must not be empty")

    if document["slotIndex"] not in _SLOT_RANGE:
        raise ComplicationValidationError(
            f"document.slotIndex must be 0..{COMPLICATION_MAX_SLOTS - 1}"
        )

    families = document["supportedFamilies"]
    # `f not in _FAMILY_KINDS` raises TypeError for an unhashable entry (a
    # nested list from a hand-written document), and a validator must answer
    # "invalid", never blow up with a 500 the panel cannot render.
    #
    # An empty list is allowed exactly when the document carries a control:
    # Control Center draws that one, so the document need not draw anywhere
    # else (decided 2026-09-15). Without a control, empty stays refused.
    has_control = isinstance(document.get("control"), dict)
    if (not families and not has_control) or any(
        not isinstance(f, str) or f not in _FAMILY_KINDS for f in families
    ):
        raise ComplicationValidationError(
            "document.supportedFamilies must be a list of "
            f"{_FAMILY_KINDS_TEXT}, and may be empty only with a control"
        )
    has_inline = "inline" in families
    inline = document.get("inline")
    if has_inline:
        if not isinstance(inline, dict) or not isinstance(inline.get("value"), dict):
            raise ComplicationValidationError(
                "document.inline with a value object is required when "
                "supportedFamilies includes inline"
            )
    elif inline is not None:
        raise ComplicationValidationError(
            "document.inline is only allowed when supportedFamilies includes inline"
        )

    schema_version = document.get("schemaVersion")
    if schema_version is None:
        raise ComplicationValidationError("document.schemaVersion is required")
    if schema_version < 1:
        raise ComplicationValidationError("document.schemaVersion must be positive")
    if schema_version > COMPLICATION_MAX_SCHEMA_VERSION:
        raise ComplicationValidationError(
            f"document.schemaVersion {schema_version} is newer than this "
            f"integration supports ({COMPLICATION_MAX_SCHEMA_VERSION})"
        )
    if document["slotIndex"] not in _LEGACY_SLOT_RANGE and schema_version < 5:
        raise ComplicationValidationError(
            "document.slotIndex above 7 requires schemaVersion 5 or newer"
        )
    if not _HOME_FAMILY_KINDS.isdisjoint(families):
        if schema_version < _HOME_FAMILY_SCHEMA_VERSION:
            raise ComplicationValidationError(
                "document with an iPhone Home Screen shape requires "
                f"schemaVersion {_HOME_FAMILY_SCHEMA_VERSION} or newer"
            )
    else:
        needs_family_schema = has_inline or not _CANVAS_FAMILY_KINDS.issubset(families)
        if needs_family_schema and schema_version < _FAMILY_SCHEMA_VERSION:
            raise ComplicationValidationError(
                "document with fewer than three canvas shapes, or with inline, "
                f"requires schemaVersion {_FAMILY_SCHEMA_VERSION} or newer"
            )

    elements = document.get("elements") or []
    if len(elements) > COMPLICATION_MAX_LAYERS:
        raise ComplicationValidationError(
            f"document.elements exceeds {COMPLICATION_MAX_LAYERS} layers"
        )
    if any(not isinstance(e, dict) for e in elements):
        raise ComplicationValidationError("document.elements must contain objects")

    has_list = _validate_list_elements(elements)
    if (has_list or _mentions_list_values(document)) and (
        schema_version < _LIST_SCHEMA_VERSION
    ):
        raise ComplicationValidationError(
            "document with a list layer, or an item or listStat value, "
            f"requires schemaVersion {_LIST_SCHEMA_VERSION} or newer"
        )

    if _uses_pages(document, elements) and schema_version < _PAGES_SCHEMA_VERSION:
        raise ComplicationValidationError(
            "document with pages, or with a layer pinned to a page, "
            f"requires schemaVersion {_PAGES_SCHEMA_VERSION} or newer"
        )

    if (
        schema_version < _IMAGE_TIME_SCHEMA_VERSION
        and _mentions_image_time_value(document)
    ):
        raise ComplicationValidationError(
            "document with an imageTime value "
            f"requires schemaVersion {_IMAGE_TIME_SCHEMA_VERSION} or newer"
        )

    try:
        encoded = json.dumps(document, separators=(",", ":"))
    except (TypeError, ValueError) as err:
        raise ComplicationValidationError("document is not JSON serializable") from err
    if len(encoded.encode("utf-8")) > COMPLICATION_MAX_DOCUMENT_BYTES:
        raise ComplicationValidationError(
            f"document exceeds {COMPLICATION_MAX_DOCUMENT_BYTES} bytes"
        )
    return document


class ComplicationStore:
    """Persistent, owner-scoped collection of complication records."""

    def __init__(self, hass: HomeAssistant) -> None:
        # owner_watch_id → record id → record
        self._records: dict[str, dict[str, ComplicationRecord]] = {}
        # owner_watch_id → [{"slot": int, "name": str}] sorted by slot: the
        # iPhone presets on that watch. Reported by the watch on every
        # complications_sync pull; the panel's auto-assigner skips these slots
        # so a new custom never lands under a preset (presets win at render,
        # masking the custom silently), and lists the presets by name as
        # locked rows. Slots are plumbing; the name is the user-facing handle.
        self._presets: dict[str, list[dict[str, Any]]] = {}
        # owner_watch_id → [{"id": uuid-str, "name": str}] in watch order: the
        # watch-app pages, reported alongside presets. Feeds the panel's
        # "Open the page" tap-action picker; advisory like the preset report.
        self._pages: dict[str, list[dict[str, Any]]] = {}
        # owner_watch_id → the whole slot pool as the watch sees it, minus
        # this server's own records: presets from every home plus customs
        # that live on another Home Assistant. Newer apps send this instead
        # of the bare preset report; `_presets` is derived from it so every
        # reader of presets() keeps working.
        self._occupied: dict[str, list[dict[str, Any]]] = {}
        # owner_watch_id → the store token the watch last said it applied.
        # Sent on every long-poll request; the panel's "Send to watch" is
        # green exactly when it equals owner_token().
        self._applied: dict[str, int] = {}
        # owner_watch_id → ISO-8601 UTC of that owner's last
        # ``complications_sync`` pull. The watch's reachability is answered by
        # the coordinator's poll clock, which lives in memory; an iPhone owner
        # holds no long-poll at all, so this stamp is the only evidence the
        # panel has that a phone ever came and collected its records. Persisted
        # for the same reason the applied token is: a restart must not turn
        # "synced ten minutes ago" into "never".
        self._last_sync: dict[str, str] = {}
        # Owners a forget path erased and that hold nothing since. A device
        # keeps its local copies when this server answers empty, because an
        # empty answer usually means a wiped or fresh Home Assistant that the
        # device's Restore can refill. A forgotten device is the one case
        # where empty is deliberate: the user unlinked it, its designs went to
        # the Library, and copies left on the wrist would draw a list the
        # panel no longer shows. ``complications_sync`` tells such a device
        # so, and it drops its copies. The mark clears the moment the owner
        # holds a record again (a save, a move, a restore), so a device that
        # is re-linked syncs normally.
        self._forgotten: set[str] = set()
        # owner_watch_id → monotonic time the last-sync stamp last asked for a
        # save. Stamps inside the throttle window stay in memory and ride the
        # next save of anything else.
        self._last_sync_saved: dict[str, float] = {}
        # Set when the storage file could not be read; every save is then
        # refused so the file on disk survives (see async_load).
        self._load_failed = False
        self._token = 0
        self._listeners: list[ChangeListener] = []
        self._wake: WakeCallback | None = None
        self._push: PushCallback | None = None
        self._store: Store = Store(
            hass, COMPLICATION_STORAGE_VERSION, COMPLICATION_STORAGE_KEY
        )

    # ── persistence ────────────────────────────────────────────────────

    async def async_load(self) -> None:
        try:
            data = await self._store.async_load()
        except Exception:
            # A corrupt or unreadable storage file must not fail
            # `async_setup_entry`: that takes the whole integration down, so
            # the watch loses notifications and cameras over a complication
            # file. Start empty, but read-only: the next watch pull would
            # otherwise save this empty store over a file that may be fine
            # (a permissions slip, a disk hiccup) or worth recovering by hand.
            self._load_failed = True
            _LOGGER.exception(
                "Could not read .storage/%s; starting with no complications "
                "and saving nothing until Home Assistant restarts with a "
                "readable file",
                COMPLICATION_STORAGE_KEY,
            )
            return
        if not data:
            return
        if not isinstance(data, dict):
            # Parsed, but not the shape this store writes: corrupt. Same
            # treatment as a read error, so the file survives for inspection.
            self._load_failed = True
            _LOGGER.error(
                "Could not read .storage/%s: expected an object, found %s; "
                "starting with no complications and saving nothing until "
                "Home Assistant restarts with a readable file",
                COMPLICATION_STORAGE_KEY,
                type(data).__name__,
            )
            return
        try:
            self._token = max(0, int(data.get("token", 0)))
        except (TypeError, ValueError):
            self._token = 0
        # "presetSlots" ({owner: [int]}) is the shape a short-lived pre-release
        # build wrote; accept it so those slots survive one more restart.
        raw_presets = data.get("presets", data.get("presetSlots", {}))
        if isinstance(raw_presets, dict):
            for owner, entries in raw_presets.items():
                if not isinstance(owner, str) or not isinstance(entries, list):
                    continue
                cleaned = _clean_preset_entries(entries)
                if cleaned:
                    self._presets[owner] = cleaned
        raw_pages = data.get("pages", {})
        if isinstance(raw_pages, dict):
            for owner, entries in raw_pages.items():
                if not isinstance(owner, str) or not isinstance(entries, list):
                    continue
                cleaned = _clean_page_entries(entries)
                if cleaned:
                    self._pages[owner] = cleaned
        raw_occupied = data.get("occupied", {})
        if isinstance(raw_occupied, dict):
            for owner, entries in raw_occupied.items():
                if not isinstance(owner, str) or not isinstance(entries, list):
                    continue
                cleaned = _clean_occupied_entries(entries)
                if cleaned:
                    self._occupied[owner] = cleaned
                    self._presets[owner] = _presets_from_occupied(cleaned)
        raw_applied = data.get("applied", {})
        if isinstance(raw_applied, dict):
            for owner, value in raw_applied.items():
                if isinstance(owner, str) and isinstance(value, int) and not isinstance(value, bool) and value >= 0:
                    self._applied[owner] = value
        raw_last_sync = data.get("last_sync", {})
        if isinstance(raw_last_sync, dict):
            for owner, value in raw_last_sync.items():
                if isinstance(owner, str) and isinstance(value, str) and value:
                    self._last_sync[owner] = value
        raw_forgotten = data.get("forgotten", [])
        if isinstance(raw_forgotten, list):
            self._forgotten = {
                owner for owner in raw_forgotten if isinstance(owner, str) and owner
            }
        raw_records = data.get("records", [])
        if not isinstance(raw_records, list):
            return
        skipped = 0
        for raw in raw_records:
            record = ComplicationRecord.from_dict(raw) if isinstance(raw, dict) else None
            if record is None:
                skipped += 1
                continue
            self._records.setdefault(record.owner_watch_id, {})[record.id] = record
            # A token on disk can never be behind a record's token; heal
            # rather than hand out a duplicate on the next commit.
            self._token = max(self._token, record.token)
        _LOGGER.debug(
            "Loaded %d complication record(s) for %d owner(s), token=%d, skipped=%d",
            sum(len(v) for v in self._records.values()),
            len(self._records),
            self._token,
            skipped,
        )

    def _serialize(self) -> dict[str, Any]:
        return {
            "token": self._token,
            "presets": {
                owner: [dict(e) for e in entries]
                for owner, entries in self._presets.items()
            },
            "pages": {
                owner: [dict(e) for e in entries]
                for owner, entries in self._pages.items()
            },
            "occupied": {
                owner: [dict(e) for e in entries]
                for owner, entries in self._occupied.items()
            },
            "applied": dict(self._applied),
            "last_sync": dict(self._last_sync),
            "forgotten": sorted(self._forgotten),
            "records": [
                record.as_storage_dict()
                for by_id in self._records.values()
                for record in by_id.values()
            ],
        }

    def _schedule_save(self) -> None:
        if self._load_failed:
            # The file on disk could not be read; this empty (or partly
            # edited) store must never replace it. Changes live in memory
            # until a restart finds a readable file.
            _LOGGER.warning(
                "Not saving .storage/%s: it could not be read at startup",
                COMPLICATION_STORAGE_KEY,
            )
            return
        self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)

    @callback
    def forget_owner(
        self,
        owner_watch_id: str,
        *,
        updated_by: str | None = None,
        mark_forgotten: bool = True,
    ) -> bool:
        """Clear what this store holds for one watch. Returns whether
        anything was there.

        The second half of :meth:`release_owner`, which is what the two forget
        paths call: designs go to the Library first, then this. Every live
        record left is tombstoned, like any other delete, rather than purged:
        the device may still pull under this id (re-linked from the panel
        before its next pull, or simply back under the same id), and a delta
        that never carries the deletion leaves it drawing the old copy beside
        whatever it is given next. Existing tombstones stay for the same
        reason. The reports it sent (presets, pages, occupied slots, the
        applied token, the last-sync stamp) are dropped outright; they are
        the device's to send again.

        A tombstone-only owner is not listed by the panel's owners command
        (it skips :meth:`is_empty` owners) and is not an orphan to
        :meth:`release_orphans`, so nothing brings the id back into view.

        Listeners hear a change per tombstone and then a record-less change,
        so an open panel reloads rather than keeping rows for the watch.

        With ``mark_forgotten`` (the default) the owner is also marked
        forgotten (see :meth:`is_forgotten`), whether or not anything was
        stored: a device can hold copies this server never saw, and the mark
        is what tells it to drop them. Only an explicit forget or an HA device
        removal marks; the orphan sweep passes ``False``, because a sweep that
        misfires must never tell a device to wipe itself.
        """
        touched = any(
            owner_watch_id in bucket
            for bucket in (
                self._records,
                self._presets,
                self._pages,
                self._occupied,
                self._applied,
                self._last_sync,
            )
        )
        tombstoned = 0
        for record in list(self._records.get(owner_watch_id, {}).values()):
            if record.deleted:
                continue
            # Exactly what delete() does: history first, a new revision, and
            # a fresh token from _commit so the next delta carries it.
            self._remember(record)
            record.revision += 1
            record.updated_by = updated_by or f"forget:{owner_watch_id}"
            record.deleted = True
            record.document = None
            self._commit(record)
            tombstoned += 1
        # After the tombstones: _commit clears the mark on every commit.
        if (
            mark_forgotten
            and owner_watch_id != LIBRARY_OWNER_ID
            and owner_watch_id not in self._forgotten
        ):
            self._forgotten.add(owner_watch_id)
            self._schedule_save()
        if not touched:
            return False
        self._presets.pop(owner_watch_id, None)
        self._pages.pop(owner_watch_id, None)
        self._occupied.pop(owner_watch_id, None)
        self._applied.pop(owner_watch_id, None)
        self._last_sync.pop(owner_watch_id, None)
        self._last_sync_saved.pop(owner_watch_id, None)
        self._schedule_save()
        _LOGGER.info(
            "Forgot complication owner %s (%d record(s) tombstoned)",
            owner_watch_id,
            tombstoned,
        )
        self._notify(ComplicationChange(owner_watch_id=owner_watch_id, token=0))
        return True

    def is_forgotten(self, owner_watch_id: str) -> bool:
        """Whether a device was forgotten and has been given nothing since.

        What ``complications_sync`` reports as ``owner_forgotten``. True from
        the forget until the owner's next commit, so a device the user
        re-links (a move, a save, a restore onto it) reads as a normal owner
        again, or until the device has been told (see
        :meth:`acknowledge_forgotten`). Never true for the Library.
        """
        if owner_watch_id not in self._forgotten:
            return False
        return not any(
            not record.deleted
            for record in self._records.get(owner_watch_id, {}).values()
        )

    def acknowledge_forgotten(self, owner_watch_id: str) -> None:
        """Clear the forgotten mark once the device has been told about it.

        The mark exists so a device drops its local copies once, on the first
        pull after the forget. Left standing, it outlives that: a device that
        pairs again under the same id and holds nothing here yet (a phone with
        only iPhone presets to move) would keep hearing it, and the preset move
        refuses to start for a forgotten owner. ``complications_sync`` calls
        this right after it builds a reply that says forgotten. The read-only
        ``complications_move_status`` never does.
        """
        if owner_watch_id in self._forgotten:
            self._forgotten.discard(owner_watch_id)
            self._schedule_save()

    def release_owner(
        self, owner_watch_id: str, *, updated_by: str, mark_forgotten: bool = True
    ) -> int:
        """Unlink a device: its designs move to the Library, then every trace
        of the device is erased. Returns how many designs moved.

        A complication is its own thing in Home Assistant, linked to devices.
        When a device goes away, the design stays and loses that link, which
        is what the Library is for. Called from the two places a device is
        forgotten (the panel's ``devices/forget`` and removing the device in
        HA's UI) and from :meth:`release_orphans`.

        Per live design, in order:

        - It is linked (``linkId``) to a design another owner still holds:
          dropped. The other copy is the design now; the Library gets no
          duplicate.
        - The Library already holds a live record with this id: dropped, for
          the same reason.
        - Otherwise it is committed under the Library as a fresh revision, at
          its own slot when the Library draws nothing of that shape there,
          else at the lowest slot that is free for every shape it draws. The
          Library's slot is only where the design lands when it is next put on
          a device, so a bump costs nothing visible.

        Then :meth:`forget_owner` tombstones what the device held and drops
        its reports. ``mark_forgotten`` is passed through: the two forget
        paths leave it on, the orphan sweep turns it off.

        The Library itself is never released: it is not a device.
        """
        if not owner_watch_id or owner_watch_id == LIBRARY_OWNER_ID:
            return 0
        moving = self.list(owner_watch_id)
        if moving:
            library_live = {
                record.id: record
                for record in self._records.get(LIBRARY_OWNER_ID, {}).values()
                if not record.deleted
            }
            taken: set[tuple[int, str]] = set()
            for record in library_live.values():
                taken |= _slot_shapes(record)
            linked_elsewhere = self._live_link_ids(excluding=owner_watch_id)
            moved = 0
            for source in moving:
                link_id = (source.document or {}).get("linkId")
                if isinstance(link_id, str) and link_id in linked_elsewhere:
                    continue
                if source.id in library_live:
                    continue
                document = copy.deepcopy(source.document)
                shapes = shapes_of(document)
                slot = _slot_of(source)
                if slot < 0 or any((slot, shape) in taken for shape in shapes):
                    slot = next(
                        (
                            candidate
                            for candidate in _SLOT_RANGE
                            if not any((candidate, shape) in taken for shape in shapes)
                        ),
                        slot if slot >= 0 else 0,
                    )
                    if isinstance(document, dict):
                        document["slotIndex"] = slot
                taken |= {(slot, shape) for shape in shapes}
                existing = self._records.get(LIBRARY_OWNER_ID, {}).get(source.id)
                self._commit(
                    ComplicationRecord(
                        id=source.id,
                        owner_watch_id=LIBRARY_OWNER_ID,
                        revision=existing.revision + 1 if existing is not None else 1,
                        token=0,
                        updated_at="",
                        updated_by=updated_by,
                        document=document,
                        deleted=False,
                        history=copy.deepcopy(source.history),
                    )
                )
                moved += 1
            _LOGGER.info(
                "Released %d of %d complication(s) from %s into the Library",
                moved,
                len(moving),
                owner_watch_id,
            )
        else:
            moved = 0
        self.forget_owner(
            owner_watch_id, updated_by=updated_by, mark_forgotten=mark_forgotten
        )
        return moved

    def release_orphans(self, registered: set[str], *, updated_by: str) -> list[str]:
        """Release every owner the secret store no longer knows.

        An owner with records and no device entry is a device that went away
        without the release above running: forgotten on a build before it
        existed, or a watch that came back under a new id. Its designs belong
        in the Library, not under an id nothing signs with. Returns the owners
        released, so the caller can log them. The Library is never an orphan.

        An empty ``registered`` set does nothing. No devices at all is far
        more likely a missing or unreadable secrets file than a home where
        every device was removed, and releasing on it would strip every
        device's designs at once. A released owner is not marked forgotten
        either: only an explicit forget may tell a device to drop its copies.
        An owner holding only tombstones has nothing to release and is left
        alone.
        """
        released: list[str] = []
        if not registered:
            return released
        for owner in self.owners():
            if owner == LIBRARY_OWNER_ID or owner in registered:
                continue
            if self.is_empty(owner):
                continue
            self.release_owner(owner, updated_by=updated_by, mark_forgotten=False)
            released.append(owner)
        return released

    def _live_link_ids(self, *, excluding: str) -> set[str]:
        """Every ``linkId`` a live record of any other owner carries."""
        found: set[str] = set()
        for owner, by_id in self._records.items():
            if owner == excluding:
                continue
            for record in by_id.values():
                if record.deleted:
                    continue
                link_id = (record.document or {}).get("linkId")
                if isinstance(link_id, str) and link_id:
                    found.add(link_id)
        return found

    async def async_remove(self) -> None:
        self._records.clear()
        self._presets.clear()
        self._pages.clear()
        self._occupied.clear()
        self._applied.clear()
        self._last_sync.clear()
        self._token = 0
        await self._store.async_remove()

    # ── change notification ────────────────────────────────────────────

    @callback
    def async_add_listener(self, listener: ChangeListener) -> Callable[[], None]:
        self._listeners.append(listener)

        def _remove() -> None:
            if listener in self._listeners:
                self._listeners.remove(listener)

        return _remove

    def _notify(self, change: ComplicationChange) -> None:
        for listener in list(self._listeners):
            try:
                listener(change)
            except Exception:
                _LOGGER.exception("Complication change listener failed")

    @callback
    def async_set_wake_callback(self, wake: WakeCallback | None) -> None:
        """Install the hook that wakes an owner's parked long-poll.

        The delta coordinator owns the poll; the store only knows that an
        owner's token moved. One hook, set once at setup.
        """
        self._wake = wake

    def _wake_owner(self, owner_watch_id: str) -> None:
        if self._wake is None:
            return
        try:
            self._wake(owner_watch_id)
        except Exception:
            _LOGGER.exception("Complication wake callback failed")

    @callback
    def async_set_push_callback(self, push: PushCallback | None) -> None:
        """Install the hook that pushes a commit to a phone owner.

        The sibling of :meth:`async_set_wake_callback`, for the owners that
        park no poll to be woken. The store knows only that an owner's token
        moved; whether that owner is a phone, whether a token for it exists
        and how often it may be disturbed all belong to the hook. One hook,
        set once at setup.
        """
        self._push = push

    def _push_owner(self, owner_watch_id: str, token: int) -> None:
        if self._push is None:
            return
        try:
            self._push(owner_watch_id, token)
        except Exception:
            _LOGGER.exception("Complication push callback failed")

    # ── reads ──────────────────────────────────────────────────────────

    @property
    def token(self) -> int:
        return self._token

    def owners(self) -> list[str]:
        return sorted(self._records)

    def owner_token(self, owner_watch_id: str) -> int:
        """Highest token among this owner's records (0 when empty)."""
        by_id = self._records.get(owner_watch_id, {})
        return max((r.token for r in by_id.values()), default=0)

    def presets(self, owner_watch_id: str) -> list[dict[str, Any]]:
        """iPhone presets on this watch (slot + name), per its last sync report."""
        return [dict(e) for e in self._presets.get(owner_watch_id, [])]

    def preset_slots(self, owner_watch_id: str) -> list[int]:
        """Just the slots from :meth:`presets`, sorted."""
        return [e["slot"] for e in self._presets.get(owner_watch_id, [])]

    def set_presets(self, owner_watch_id: str, entries: list[Any]) -> bool:
        """Record the watch's preset report. Returns whether it changed.

        Junk entries are dropped rather than refused (see
        :func:`_clean_preset_entries`): the report is advisory, so a partially
        valid report is better than none.
        """
        cleaned = _clean_preset_entries(entries)
        # A bare preset report comes from an app that knows nothing about
        # other homes' customs, so any occupied report on file is from a
        # newer build that is no longer the one on the wrist. Drop it.
        had_occupied = self._occupied.pop(owner_watch_id, None) is not None
        if cleaned == self._presets.get(owner_watch_id, []) and not had_occupied:
            return False
        if cleaned:
            self._presets[owner_watch_id] = cleaned
        else:
            self._presets.pop(owner_watch_id, None)
        self._schedule_save()
        return True

    def pages(self, owner_watch_id: str) -> list[dict[str, Any]]:
        """Watch-app pages (id + name), per the watch's last sync report."""
        return [dict(e) for e in self._pages.get(owner_watch_id, [])]

    def occupied(self, owner_watch_id: str) -> list[dict[str, Any]]:
        """Every slot something other than this server's records holds.

        The watch's last ``occupied`` report when it sent one; otherwise the
        preset report dressed in the occupied shape, so a panel talking to an
        older app still sees one list.
        """
        stored = self._occupied.get(owner_watch_id)
        if stored is not None:
            return [dict(e) for e in stored]
        return [
            {"slot": e["slot"], "name": e["name"], "kind": "preset", "home": ""}
            for e in self._presets.get(owner_watch_id, [])
        ]

    def set_occupied(self, owner_watch_id: str, entries: list[Any]) -> bool:
        """Record the watch's occupied-slot report. Returns whether it changed.

        Replaces the preset report for this owner: the preset rows are
        derived from it, so ``presets()`` and ``preset_slots()`` stay in
        step. Advisory like :meth:`set_presets`.
        """
        cleaned = _clean_occupied_entries(entries)
        derived = _presets_from_occupied(cleaned)
        if (
            cleaned == self._occupied.get(owner_watch_id, [])
            and derived == self._presets.get(owner_watch_id, [])
        ):
            return False
        if cleaned:
            self._occupied[owner_watch_id] = cleaned
        else:
            self._occupied.pop(owner_watch_id, None)
        if derived:
            self._presets[owner_watch_id] = derived
        else:
            self._presets.pop(owner_watch_id, None)
        self._schedule_save()
        return True

    def applied_token(self, owner_watch_id: str) -> int | None:
        """The store token the watch last reported it had applied.

        ``None`` when it never has, which is not the same as 0. A watch app
        that predates the ack sends no token at all, and reporting 0 for it
        made it indistinguishable from a watch that acked an empty store: the
        panel showed "Not on watch yet" and a Resend that could not work,
        because nothing on that watch was listening for the answer.
        """
        return self._applied.get(owner_watch_id)

    def pending_changes(self, owner_watch_id: str) -> int | None:
        """How many designs changed here since the token the device applied.

        Each changed design counts once, however many times it was saved, and
        a deletion counts too: it is the number of records the device's next
        pull will bring. ``None`` when the device has never acked, because
        then there is no applied token to count from.
        """
        applied = self.applied_token(owner_watch_id)
        if applied is None:
            return None
        return len(self.changes_since(owner_watch_id, applied))

    def set_applied_token(self, owner_watch_id: str, token: int) -> bool:
        """Record the watch's ack. Returns whether it changed.

        Notifies listeners with a record-less change so the panel's
        subscription can flip "Send to watch" green without polling.
        """
        if isinstance(token, bool) or not isinstance(token, int) or token < 0:
            return False
        if self.applied_token(owner_watch_id) == token:
            return False
        self._applied[owner_watch_id] = token
        self._schedule_save()
        self._notify(
            ComplicationChange(
                owner_watch_id=owner_watch_id,
                token=self.owner_token(owner_watch_id),
                applied_token=token,
            )
        )
        return True

    def last_sync_at(self, owner_watch_id: str) -> str | None:
        """ISO-8601 UTC of this owner's last pull, ``None`` when it never has."""
        return self._last_sync.get(owner_watch_id)

    def seconds_since_sync(self, owner_watch_id: str) -> float | None:
        """How long since this owner last pulled, in seconds, or ``None``.

        The arithmetic lives here rather than in the WebSocket layer because
        the stamp does, and because a stored string that will not parse (a
        hand-edited storage file) must read as "never" rather than raise in
        the middle of a status reply.
        """
        raw = self._last_sync.get(owner_watch_id)
        if raw is None:
            return None
        try:
            seen = datetime.fromisoformat(raw)
        except ValueError:
            return None
        if seen.tzinfo is None:
            seen = seen.replace(tzinfo=UTC)
        return max(0.0, (datetime.now(UTC) - seen).total_seconds())

    def set_last_sync(self, owner_watch_id: str) -> None:
        """Stamp now as this owner's last ``complications_sync`` pull.

        Not a notification: nothing in the panel redraws on a pull that
        changed nothing, and the ack that does redraw travels as its own
        change. The in-memory stamp is always current; the save is throttled
        to once per ``_LAST_SYNC_SAVE_INTERVAL_SECONDS`` per owner, and a
        stamp skipped here is written with the next save of anything else.
        """
        self._last_sync[owner_watch_id] = _now_iso()
        now = time.monotonic()
        last = self._last_sync_saved.get(owner_watch_id)
        if last is not None and now - last < _LAST_SYNC_SAVE_INTERVAL_SECONDS:
            return
        self._last_sync_saved[owner_watch_id] = now
        self._schedule_save()

    def set_pages(self, owner_watch_id: str, entries: list[Any]) -> bool:
        """Record the watch's page report. Returns whether it changed.

        Advisory like :meth:`set_presets`: junk entries drop rather than
        refuse, and an absent report leaves the last one standing.
        """
        cleaned = _clean_page_entries(entries)
        if cleaned == self._pages.get(owner_watch_id, []):
            return False
        if cleaned:
            self._pages[owner_watch_id] = cleaned
        else:
            self._pages.pop(owner_watch_id, None)
        self._schedule_save()
        return True

    def list(
        self, owner_watch_id: str, *, include_deleted: bool = False
    ) -> list[ComplicationRecord]:
        by_id = self._records.get(owner_watch_id, {})
        records = [r for r in by_id.values() if include_deleted or not r.deleted]
        return sorted(records, key=lambda r: (r.document or {}).get("slotIndex", 0))

    def get(self, owner_watch_id: str, record_id: str) -> ComplicationRecord | None:
        return self._records.get(owner_watch_id, {}).get(record_id)

    def history(
        self, owner_watch_id: str, record_id: str
    ) -> list[ComplicationHistoryEntry]:
        """This record's past revisions, newest first.

        The current revision is not in it. It is the one the editor has open,
        so listing it would offer to restore what is already there.
        """
        record = self.get(owner_watch_id, record_id)
        if record is None:
            return []
        return list(reversed(record.history))

    def history_entry(
        self, owner_watch_id: str, record_id: str, revision: int
    ) -> ComplicationHistoryEntry | None:
        """One past revision of one record, or ``None``."""
        record = self.get(owner_watch_id, record_id)
        if record is None:
            return None
        for entry in record.history:
            if entry.revision == revision:
                return entry
        return None

    def is_empty(self, owner_watch_id: str) -> bool:
        return not any(
            not r.deleted for r in self._records.get(owner_watch_id, {}).values()
        )

    def changes_since(
        self, owner_watch_id: str, since_token: int
    ) -> list[ComplicationRecord]:
        """Every record (live or tombstone) committed after ``since_token``.

        ``since_token == 0`` returns the whole collection including tombstones,
        which is what a fresh replica needs so it can never resurrect a deletion
        it has not yet seen.
        """
        by_id = self._records.get(owner_watch_id, {})
        return sorted(
            (r for r in by_id.values() if r.token > since_token),
            key=lambda r: r.token,
        )

    # ── writes ─────────────────────────────────────────────────────────

    @staticmethod
    def _remember(record: ComplicationRecord) -> None:
        """File the record's current document as a past revision.

        Called on the way into a save that replaces it, so an entry is what
        that revision looked like rather than when someone reached back for
        it. A tombstone has no document to remember, so reviving one adds
        nothing: its history is whatever was already there.
        """
        if record.document is None:
            return
        record.history.append(
            ComplicationHistoryEntry(
                revision=record.revision,
                saved_at=record.updated_at,
                updated_by=record.updated_by,
                document=record.document,
            )
        )
        if len(record.history) > COMPLICATION_HISTORY_LIMIT:
            del record.history[: len(record.history) - COMPLICATION_HISTORY_LIMIT]

    def _commit(self, record: ComplicationRecord) -> ComplicationRecord:
        self._token += 1
        record.token = self._token
        record.updated_at = _now_iso()
        self._records.setdefault(record.owner_watch_id, {})[record.id] = record
        # A record under a forgotten owner means someone linked it again.
        self._forgotten.discard(record.owner_watch_id)
        self._schedule_save()
        self._notify(
            ComplicationChange(
                owner_watch_id=record.owner_watch_id,
                token=self._token,
                record=record,
            )
        )
        # Both hooks are asked about every owner, the Library included, and
        # both already answer nothing for an owner no device stands behind:
        # the coordinator finds no parked waiter to release, and the push side
        # finds no iPhone entry in the secret store and returns before it
        # schedules anything. So a Library commit runs through here unchanged,
        # with no push, no wake and nothing logged. Keep that true on either
        # side rather than special-casing the owner here.
        self._wake_owner(record.owner_watch_id)
        self._push_owner(record.owner_watch_id, self._token)
        return record

    def save(
        self,
        owner_watch_id: str,
        document: Any,
        *,
        base_revision: int | None,
        updated_by: str,
    ) -> ComplicationRecord:
        """Create or replace one complication.

        ``base_revision`` must equal the stored revision, or be ``None``/``0``
        for a record that does not exist yet (a tombstoned id counts as
        existing: reviving one requires its current revision, so a stale
        client cannot undo a delete by re-saving an old draft).
        """
        if not isinstance(owner_watch_id, str) or not owner_watch_id:
            raise ComplicationValidationError("owner_watch_id is required")
        document = validate_document(document)
        record_id = _validate_uuid(document["id"], "document.id")
        if base_revision is not None and (
            isinstance(base_revision, bool) or not isinstance(base_revision, int)
        ):
            raise ComplicationValidationError("base_revision must be an integer")

        by_id = self._records.get(owner_watch_id, {})
        existing = by_id.get(record_id)

        if existing is None:
            if base_revision not in (None, 0):
                raise ComplicationConflictError(
                    "no stored revision to base this save on", None
                )
            live_count = sum(1 for r in by_id.values() if not r.deleted)
            if live_count >= COMPLICATION_MAX_PER_OWNER:
                raise ComplicationValidationError(
                    f"owner already has {COMPLICATION_MAX_PER_OWNER} complications"
                )
            self._refuse_held_seat(by_id, record_id, document, None)
            record = ComplicationRecord(
                id=record_id,
                owner_watch_id=owner_watch_id,
                revision=1,
                token=0,
                updated_at="",
                updated_by=updated_by,
                deleted=False,
                document=document,
            )
            return self._commit(record)

        if base_revision != existing.revision:
            raise ComplicationConflictError(
                f"stored revision is {existing.revision}, save was based on "
                f"{base_revision}",
                existing,
            )
        self._refuse_held_seat(by_id, record_id, document, existing)
        # The document about to be replaced becomes a past revision, before
        # anything on the record moves.
        self._remember(existing)
        existing.revision += 1
        existing.updated_by = updated_by
        existing.deleted = False
        existing.document = document
        return self._commit(existing)

    @staticmethod
    def _refuse_held_seat(
        by_id: dict[str, ComplicationRecord],
        record_id: str,
        document: dict[str, Any],
        existing: ComplicationRecord | None,
    ) -> None:
        """Refuse a save that puts a second document of one shape in a slot.

        A slot holds at most one document per shape, and the devices enforce
        that by collapsing: the picker shows one row per slot, so two circular
        documents in slot 3 are one row on the phone and the other can never
        be placed. The panel picks a free slot before it writes, but from a
        list it read a moment earlier, and a device whose list it could not
        read looks empty to it. This check does not depend on what the panel
        saw. The batch import in ``wa_v2_views`` makes the same check.

        Only a seat that is new to this record is refused: a create, a move to
        another slot, or a shape the record did not draw there before. A
        record already in the slot with these shapes keeps saving, or a user
        whose store already holds a clash could not edit either record to fix
        it. A tombstone holds no seat, so reviving one is a new seat and is
        checked like a create.
        """
        wanted = {(document["slotIndex"], shape) for shape in shapes_of(document)}
        if existing is not None:
            wanted -= _slot_shapes(existing)
        if not wanted:
            return
        for other in by_id.values():
            if other.id == record_id or other.deleted:
                continue
            clash = _slot_shapes(other) & wanted
            if not clash:
                continue
            name = (other.document or {}).get("name") or other.id
            shapes = ", ".join(sorted(shape for _slot, shape in clash))
            raise ComplicationValidationError(
                f'slot {document["slotIndex"]} already holds "{name}" for the '
                f"{shapes} shape on this device; pick another slot"
            )

    def delete(
        self,
        owner_watch_id: str,
        record_id: str,
        *,
        base_revision: int | None,
        updated_by: str,
    ) -> ComplicationRecord:
        """Tombstone one complication. Idempotent on an already-deleted id.

        The document goes into the record's history first, so a delete is
        undoable through ``history_restore`` (a revive with the tombstone's
        revision). Before 2026-09-22 a delete dropped the document outright,
        and a wrong delete of a design with no edits left nothing to recover.
        """
        record_id = _validate_uuid(record_id, "id")
        existing = self._records.get(owner_watch_id, {}).get(record_id)
        if existing is None:
            raise ComplicationNotFoundError("no such complication")
        if existing.deleted:
            return existing
        if base_revision is not None and base_revision != existing.revision:
            raise ComplicationConflictError(
                f"stored revision is {existing.revision}, delete was based on "
                f"{base_revision}",
                existing,
            )
        self._remember(existing)
        existing.revision += 1
        existing.updated_by = updated_by
        existing.deleted = True
        existing.document = None
        return self._commit(existing)

    def restore(
        self,
        owner_watch_id: str,
        documents: list[Any],
        *,
        updated_by: str,
    ) -> list[ComplicationRecord]:
        """Seed an *empty* owner collection from a device replica.

        Recovery only. Refuses when the owner already has live records so a
        stale watch can never overwrite what the panel holds. Every document is
        validated before any is written, so a bad batch stores nothing.
        """
        if not self.is_empty(owner_watch_id):
            raise ComplicationConflictError(
                "owner already has complications; restore refused", None
            )
        if not isinstance(documents, list):
            raise ComplicationValidationError("documents must be a list")
        if len(documents) > COMPLICATION_MAX_PER_OWNER:
            raise ComplicationValidationError(
                f"restore exceeds {COMPLICATION_MAX_PER_OWNER} complications"
            )
        validated: list[dict[str, Any]] = []
        seen: set[str] = set()
        for document in documents:
            document = validate_document(document)
            record_id = _validate_uuid(document["id"], "document.id")
            if record_id in seen:
                raise ComplicationValidationError(f"duplicate id {record_id}")
            seen.add(record_id)
            validated.append(document)

        committed: list[ComplicationRecord] = []
        for document in validated:
            record_id = _validate_uuid(document["id"], "document.id")
            existing = self._records.get(owner_watch_id, {}).get(record_id)
            # A tombstone for this id may exist; revive it with a fresh
            # revision so replicas see the change rather than a stale delete.
            revision = existing.revision + 1 if existing is not None else 1
            record = ComplicationRecord(
                id=record_id,
                owner_watch_id=owner_watch_id,
                revision=revision,
                token=0,
                updated_at="",
                updated_by=updated_by,
                deleted=False,
                document=document,
                # A tombstone this revives keeps the revisions it had. The
                # complication is the same one coming back, and losing its
                # past to a recovery would be the worst moment to lose it.
                history=list(existing.history) if existing is not None else [],
            )
            committed.append(self._commit(record))
        return committed

    def move_owner(
        self,
        source_owner: str,
        target_owner: str,
        *,
        updated_by: str,
    ) -> list[ComplicationRecord]:
        """Re-key every live record of one watch onto another watch.

        This is the reinstall recovery path. A watch's id lives in its App
        Group rather than its keychain, so deleting and reinstalling the app
        can hand it a new one, leaving its complications under an id nothing
        signs with any more.

        Each live source record is committed under ``target_owner`` as a fresh
        revision and the source row is then tombstoned, so a replica still
        holding the old owner learns the records are gone instead of keeping
        them forever. The revision under the target starts at 1, or continues
        from a record the target already has under that id (a tombstone
        counts, exactly as ``restore`` treats one).

        Everything is checked before anything is written, so a refused move
        leaves both owners exactly as they were. It is refused when the source
        and the target are the same watch, when the source has nothing live to
        move, when the target would end up over
        ``COMPLICATION_MAX_PER_OWNER``, or when a moved record would land on a
        slot one of the target's own records already holds.
        """
        if not isinstance(source_owner, str) or not source_owner:
            raise ComplicationValidationError("source_owner_watch_id is required")
        if not isinstance(target_owner, str) or not target_owner:
            raise ComplicationValidationError("target_owner_watch_id is required")
        if source_owner == target_owner:
            raise ComplicationValidationError(
                "the source and the target are the same watch"
            )

        moving = self.list(source_owner)
        if not moving:
            raise ComplicationNotFoundError(f"{source_owner} has nothing to move")

        target_by_id = self._records.get(target_owner, {})
        moving_ids = {record.id for record in moving}
        # A target record the move overwrites is not in the way of itself, so
        # it counts towards neither the cap nor the slot check.
        kept = [
            record
            for record in target_by_id.values()
            if not record.deleted and record.id not in moving_ids
        ]
        total = len(kept) + len(moving)
        if total > COMPLICATION_MAX_PER_OWNER:
            raise ComplicationValidationError(
                f"the move would leave the target with {total} complications; "
                f"the limit is {COMPLICATION_MAX_PER_OWNER}"
            )

        # A slot is only in the way when the target draws the same shape
        # there; a rectangular and a circular may share one slot number.
        taken: set[tuple[int, str]] = set()
        for record in kept:
            taken |= _slot_shapes(record)
        clashes = sorted(
            {slot for record in moving for (slot, _) in _slot_shapes(record) & taken}
        )
        if clashes:
            # Slots are numbered from 1 for a human, as they are in the panel
            # and on the watch face.
            raise ComplicationValidationError(
                "the target already uses slot "
                + ", ".join(str(slot + 1) for slot in clashes)
            )

        moved: list[ComplicationRecord] = []
        for source_record in moving:
            existing = target_by_id.get(source_record.id)
            moved.append(
                self._commit(
                    ComplicationRecord(
                        id=source_record.id,
                        owner_watch_id=target_owner,
                        revision=existing.revision + 1 if existing is not None else 1,
                        token=0,
                        updated_at="",
                        updated_by=updated_by,
                        # The two rows must not share one mutable document.
                        document=copy.deepcopy(source_record.document),
                        deleted=False,
                        # The design moved, so its past moves with it. Copied
                        # rather than handed over for the same reason the
                        # document is: the source row still exists as a
                        # tombstone until it is purged.
                        history=copy.deepcopy(source_record.history),
                    )
                )
            )
            source_record.revision += 1
            source_record.updated_by = updated_by
            source_record.deleted = True
            source_record.document = None
            self._commit(source_record)
        _LOGGER.info(
            "Moved %d complication(s) from %s to %s",
            len(moved),
            source_owner,
            target_owner,
        )
        return moved
