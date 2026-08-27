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
    "showSuccessFlash": bool,
    "successFlashColorHex": str,
}
_FAMILY_KINDS = frozenset({"rectangular", "circular", "corner"})
# 0..7 into `ComplicationStableSlot` on the watch.
_SLOT_RANGE = range(8)


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
    """What a listener receives after a commit."""

    owner_watch_id: str
    token: int
    record: ComplicationRecord


ChangeListener = Callable[[ComplicationChange], None]


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
        raise ComplicationValidationError("document.slotIndex must be 0..7")

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
        self._token = 0
        self._listeners: list[ChangeListener] = []
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
