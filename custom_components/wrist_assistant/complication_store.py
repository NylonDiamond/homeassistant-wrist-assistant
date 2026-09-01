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
"""

from __future__ import annotations

import copy
import json
import logging
import uuid
from collections.abc import Callable
from dataclasses import dataclass
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
)

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 1

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
}
_FAMILY_KINDS = frozenset({"rectangular", "circular", "corner"})
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
    "home": str}]``. ``kind`` says what holds the slot: an iPhone preset (any
    home) or a custom complication that lives on a different Home Assistant.
    ``home`` is the display name of the home it belongs to, empty when the
    watch did not say. Advisory like the preset report: junk entries drop,
    the first entry wins a duplicated slot, and a missing kind reads as
    "preset" so a report that only knows presets still parses.
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
        kind = entry.get("kind", "preset")
        if kind not in _OCCUPIED_KINDS:
            kind = "preset"
        home = entry.get("home", "")
        if not isinstance(home, str):
            home = ""
        cleaned[slot] = {
            "slot": slot,
            "name": name.strip()[:_PRESET_NAME_MAX_CHARS],
            "kind": kind,
            "home": home.strip()[:_PRESET_NAME_MAX_CHARS],
        }
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

    def as_dict(self) -> dict[str, Any]:
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


def _validate_uuid(value: Any, what: str) -> str:
    if not isinstance(value, str):
        raise ComplicationValidationError(f"{what} must be a string UUID")
    try:
        return str(uuid.UUID(value)).upper()
    except ValueError as err:
        raise ComplicationValidationError(f"{what} is not a UUID") from err


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
    if not families or any(f not in _FAMILY_KINDS for f in families):
        raise ComplicationValidationError(
            "document.supportedFamilies must be a non-empty list of "
            "rectangular, circular, corner"
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

    elements = document.get("elements") or []
    if len(elements) > COMPLICATION_MAX_LAYERS:
        raise ComplicationValidationError(
            f"document.elements exceeds {COMPLICATION_MAX_LAYERS} layers"
        )
    if any(not isinstance(e, dict) for e in elements):
        raise ComplicationValidationError("document.elements must contain objects")

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
        self._token = 0
        self._listeners: list[ChangeListener] = []
        self._wake: WakeCallback | None = None
        self._store: Store = Store(
            hass, COMPLICATION_STORAGE_VERSION, COMPLICATION_STORAGE_KEY
        )

    # ── persistence ────────────────────────────────────────────────────

    async def async_load(self) -> None:
        data = await self._store.async_load()
        if not data or not isinstance(data, dict):
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
            "records": [
                record.as_dict()
                for by_id in self._records.values()
                for record in by_id.values()
            ],
        }

    def _schedule_save(self) -> None:
        self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)

    async def async_remove(self) -> None:
        self._records.clear()
        self._presets.clear()
        self._pages.clear()
        self._occupied.clear()
        self._applied.clear()
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

    def applied_token(self, owner_watch_id: str) -> int:
        """The store token the watch last reported it had applied (0 = never)."""
        return self._applied.get(owner_watch_id, 0)

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

    def _commit(self, record: ComplicationRecord) -> ComplicationRecord:
        self._token += 1
        record.token = self._token
        record.updated_at = _now_iso()
        self._records.setdefault(record.owner_watch_id, {})[record.id] = record
        self._schedule_save()
        self._notify(
            ComplicationChange(
                owner_watch_id=record.owner_watch_id,
                token=self._token,
                record=record,
            )
        )
        self._wake_owner(record.owner_watch_id)
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
        existing.revision += 1
        existing.updated_by = updated_by
        existing.deleted = False
        existing.document = document
        return self._commit(existing)

    def delete(
        self,
        owner_watch_id: str,
        record_id: str,
        *,
        base_revision: int | None,
        updated_by: str,
    ) -> ComplicationRecord:
        """Tombstone one complication. Idempotent on an already-deleted id."""
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

        taken = {s for record in kept if (s := _slot_of(record)) >= 0}
        clashes = sorted({s for record in moving if (s := _slot_of(record)) in taken})
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
