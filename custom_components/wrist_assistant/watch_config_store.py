"""Watch config documents kept in Home Assistant, one record per watch per kind.

Part of moving watch configuration out of the phone (see
``docs/pages_in_home_assistant_step1.md``, ``..._step2.md`` and
``..._step3.md`` in the app repo). The phone uploads its page config (kind
``pages``) and its watch behavior settings (kind ``behavior``) here after each
edit, and pulls a newer copy back down when it has nothing unsent. The panel
may read, save and restore either kind (see ``watch_config_ws.py``); the phone
picks a panel save up on its next check, or at once over the live line while
the app is open, and hands it to the watch. A later step has the watch read
its record directly.

A record is keyed on the watch, not the phone: the owner is the id that signed
the request, which is the watch's own pair even when the phone sends it. The
watch must own its config from the first day, because the step where it reads
the record itself signs with that same id.

Each record carries:

* ``revision``: whole number, one more on every accepted save. Saves are
  compare-and-swap on it, so two writers can never silently overwrite each
  other; a forced save is the one exception, and it files what it replaced.
* ``hash``: SHA-256 of the document, as lowercase hex. For a device save it is
  the client's own, stored as opaque metadata and never recomputed here,
  because the client hashes its own serialized bytes and Python's
  re-serialization of the same JSON is not byte for byte what Swift wrote (key
  order, slash escaping, number spelling). The only promise is that the hash
  handed back is the one the writer sent. A panel save has no client hash, so
  the server computes one (:func:`canonical_hash`).
* ``updated_at`` / ``updated_by``: server time of the save, and the signing id
  of the writer, or ``panel`` for a panel save.
* ``document``: the JSON object exactly as parsed from the request, never
  rewritten. It is checked at the envelope (an object, a page config's
  ``pages`` is a list, under its kind's size cap) and, for a page config, at
  the shape the watch cannot survive without (:func:`validate_document`). The
  server does not understand tiles or settings.
* ``history``: the last few documents a save replaced, each with the
  revision, hash, time and writer it had. The signed get never returns it; the
  panel lists it and restores from it (:meth:`WatchConfigStore.history`,
  :meth:`WatchConfigStore.restore`), so a forced save, a wrong pull or a bad
  panel save loses nothing that cannot be put back.
* ``delivered_revision`` / ``delivered_at``: the highest revision a device is
  known to hold, and when that became known. Moved by a signed get that carried
  the document or answered "you already have it", and by a signed put (the
  device that wrote a revision holds it). The panel compares it with
  ``revision`` to say whether the phone has picked a panel save up yet. Files
  written before these fields existed load with 0 and no time.
* ``rejected_revision`` / ``rejected_at``: the last revision a device reported
  it fetched and could not decode, and when (0 and no time for never). Set by
  a signed get carrying ``unreadable_revision`` equal to the stored revision,
  and cleared only by a forget: a later save simply has a higher revision, so
  the panel reads "could not read this save" only while the two are equal,
  and then it outranks delivery (the get that fetched the document counted as
  a delivery before the device knew it could not read it). Files written
  before these fields existed load with 0 and no time.

Storage is one Home Assistant ``Store`` file per owner, holding every kind for
that owner, plus a small index naming the owners. A document can be large
(the cap is ``WATCH_CONFIG_MAX_DOCUMENT_BYTES``), so one watch's save must not
rewrite another watch's file. The index only changes when an owner appears or
goes away.

Listeners (:meth:`WatchConfigStore.async_add_listener`) hear one
:class:`WatchConfigChange` per kind whose revision moved: every accepted save,
device or panel, a restore included; revision 0 for each kind a forget
removed; and for a move, the target's resulting revisions and revision 0 for
each of the source's kinds. Delivery is not a change, and neither is an
unreadable report: a signed get that only moves ``delivered_revision`` or
``rejected_revision`` tells nobody. This is what the phone's live line
(``watch_config/subscribe`` in ``watch_config_ws.py``) rides on.
"""

from __future__ import annotations

import copy
import hashlib
import json
import logging
import re
from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store

from .const import (
    WATCH_CONFIG_HISTORY_LIMIT,
    WATCH_CONFIG_KINDS,
    WATCH_CONFIG_MAX_DOCUMENT_BYTES,
    WATCH_CONFIG_PANEL_KINDS,
    WATCH_CONFIG_PANEL_WRITER,
    WATCH_CONFIG_STORAGE_KEY,
    WATCH_CONFIG_STORAGE_VERSION,
)

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 1

# The list key a kind's document must carry, for the kinds that have one: a
# page config without its page list is not a page config, while the behavior
# settings are a flat object whose every key is optional ("absent means the
# default"), so an object is enough. The page list's own shape is checked by
# _check_pages below.
_KIND_LIST_KEYS: dict[str, str] = {"pages": "pages"}

# A SHA-256 digest as lowercase hex. Lowercase only, and refused otherwise
# rather than folded: the phone compares the hash it remembers with the one it
# computes, and a server that quietly lowercased an uppercase hash would hand
# back a value the phone never computes, which reads as an edit on every pull.
_HASH_RE = re.compile(r"[0-9a-f]{64}")


class WatchConfigStoreError(Exception):
    """Base class; ``code`` is the stable machine-readable reason."""

    code = "error"

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class WatchConfigValidationError(WatchConfigStoreError):
    """The request or its document envelope is malformed."""

    code = "invalid"


class WatchConfigConflictError(WatchConfigStoreError):
    """``base_revision`` does not match the stored revision.

    Carries the stored revision and hash (0 and ``None`` when there is no
    record), which is what the signed 409 tells the client.
    """

    code = "conflict"

    def __init__(self, message: str, revision: int, document_hash: str | None) -> None:
        super().__init__(message)
        self.revision = revision
        self.hash = document_hash


class WatchConfigNoRecordError(WatchConfigStoreError):
    """A panel save with nothing stored to save over.

    The panel never creates a record. The first copy always comes from the
    phone, so the panel can never invent a document the phone has not seen.
    """

    code = "no_record"


class WatchConfigNotFoundError(WatchConfigStoreError):
    """A history revision the record does not hold (never saved, or dropped
    past the history limit)."""

    code = "not_found"


class WatchConfigUnavailableError(WatchConfigStoreError):
    """The owner's file could not be read at startup.

    Reads and writes are both refused for that owner until a restart finds a
    readable file. Answering "no record" instead would invite the phone to
    upload over a file that may be fine or worth recovering by hand.
    """

    code = "unavailable"


def _now_iso() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _owner_key(owner_watch_id: str) -> str:
    """The storage key of one owner's file.

    Owner ids are not guaranteed to be safe in a file name (an iPhone's has a
    colon in it); a digest always is, and never collides in practice. The
    owner's id is written inside the file, so a human reading ``.storage`` can
    still tell whose it is.
    """
    digest = hashlib.sha256(owner_watch_id.encode()).hexdigest()[:32]
    return f"{WATCH_CONFIG_STORAGE_KEY}.{digest}"


def document_size(document: Any) -> int:
    """The size the cap is measured against: compact UTF-8 JSON, in bytes.

    No whitespace and non-ASCII left unescaped, so it is close to what a
    compact client encoder sends. It is a guard on what lands on disk, not a
    promise about the request body, which may differ by a few escapes.
    """
    try:
        encoded = json.dumps(document, separators=(",", ":"), ensure_ascii=False)
    except (TypeError, ValueError) as err:
        raise WatchConfigValidationError("document is not JSON serializable") from err
    return len(encoded.encode("utf-8"))


def validate_kind(kind: Any) -> str:
    """The kind, if this server stores it."""
    if not isinstance(kind, str) or kind not in WATCH_CONFIG_KINDS:
        raise WatchConfigValidationError(
            f"kind must be one of {', '.join(sorted(WATCH_CONFIG_KINDS))}"
        )
    return kind


def validate_document(kind: str, document: Any, *, check_items: bool = False) -> int:
    """Check the envelope and shape of one document and return its size in bytes.

    An object, its kind's list key present and a list when the kind has one,
    and under the kind's cap. A page config's pages are then checked for the
    shape the watch needs to survive (see :func:`_check_pages`): the page
    level always, the tile level only with ``check_items``, which a panel save
    and a restore pass and a device save does not.

    The server guards the shape, not the content. No key's value is looked at
    beyond the ids: the app is the only thing that understands a tile or a
    setting, and a server that half understood one would refuse configs a
    newer app writes.
    """
    if not isinstance(document, dict):
        raise WatchConfigValidationError("document must be a JSON object")
    list_key = _KIND_LIST_KEYS.get(kind)
    if list_key is not None and not isinstance(document.get(list_key), list):
        raise WatchConfigValidationError(f"document.{list_key} must be a list")
    size = document_size(document)
    limit = WATCH_CONFIG_MAX_DOCUMENT_BYTES[kind]
    if size > limit:
        raise WatchConfigValidationError(
            f"document is {size} bytes; the limit for {kind} is {limit}"
        )
    if kind == "pages":
        _check_pages(document["pages"], check_items=check_items)
    return size


def _check_pages(pages: list[Any], *, check_items: bool) -> None:
    """The page config's shape guard, in two levels.

    Every writer: each page is an object with a non-empty string ``id``, and
    no two pages share one. Duplicate page ids crash the watch, and a page with
    no id is given a new one on every decode, so neither may land whoever
    writes it.

    With ``check_items`` (a panel save or a restore): ``items`` is a list when
    present, each item an object with a non-empty string ``id`` and
    ``entityId``, and no two items in one page share an id. A device save
    skips this level on purpose: a phone refused for a fault in its own old
    tiles could never upload again, while the panel can always fix what it
    sends.

    Ids are compared ignoring case. The app reads them as UUIDs, which parse
    the same either way, so ``"ab"`` and ``"AB"`` are one id on the watch.
    """
    seen: dict[str, int] = {}
    for index, page in enumerate(pages):
        where = f"document.pages[{index}]"
        if not isinstance(page, dict):
            raise WatchConfigValidationError(f"{where} must be an object")
        page_id = page.get("id")
        if not isinstance(page_id, str) or not page_id:
            raise WatchConfigValidationError(f"{where}.id must be a non-empty string")
        folded = page_id.upper()
        if folded in seen:
            raise WatchConfigValidationError(
                f'{where} has the page id "{page_id}" of '
                f"document.pages[{seen[folded]}]; page ids must be unique"
            )
        seen[folded] = index
        if check_items:
            _check_items(page, f'{where} (id "{page_id}")')


def _check_items(page: dict[str, Any], where: str) -> None:
    """The tile level of :func:`_check_pages` for one page. ``where`` names
    the page by index and id, so a refusal says which page to look at."""
    if "items" not in page:
        return
    items = page["items"]
    if not isinstance(items, list):
        raise WatchConfigValidationError(f"{where}.items must be a list")
    seen: dict[str, int] = {}
    for index, item in enumerate(items):
        at = f"{where}.items[{index}]"
        if not isinstance(item, dict):
            raise WatchConfigValidationError(f"{at} must be an object")
        for key in ("id", "entityId"):
            value = item.get(key)
            if not isinstance(value, str) or not value:
                raise WatchConfigValidationError(f"{at}.{key} must be a non-empty string")
        folded = item["id"].upper()
        if folded in seen:
            raise WatchConfigValidationError(
                f'{at} has the item id "{item["id"]}" of items[{seen[folded]}]; '
                "item ids must be unique in a page"
            )
        seen[folded] = index


def canonical_hash(document: dict[str, Any]) -> str:
    """The hash the server writes for a panel save: SHA-256 of compact,
    sorted-key JSON, as lowercase hex.

    Exactly ``json.dumps(document, sort_keys=True, separators=(",", ":"),
    ensure_ascii=False)`` encoded as UTF-8: keys in code point order, no
    whitespace, non-ASCII unescaped and ``/`` not escaped. The phone hashes its
    own encoder's bytes, which escape ``/`` and may order keys differently, so
    it should not expect to arrive at this value for the same document. A
    phone that compares its own hash with this one reads the panel's save as a
    local change and uploads it back once, which is harmless but visible as an
    extra revision.
    """
    encoded = json.dumps(
        document, sort_keys=True, separators=(",", ":"), ensure_ascii=False
    )
    return hashlib.sha256(encoded.encode("utf-8")).hexdigest()


def _validate_revision(revision: Any) -> int:
    """A history revision to look up: a whole number of at least 1."""
    if isinstance(revision, bool) or not isinstance(revision, int) or revision < 1:
        raise WatchConfigValidationError("revision must be a positive integer")
    return revision


def _validate_base_revision(base_revision: Any) -> int:
    if (
        isinstance(base_revision, bool)
        or not isinstance(base_revision, int)
        or base_revision < 0
    ):
        raise WatchConfigValidationError("base_revision must be a non-negative integer")
    return base_revision


def validate_hash(document_hash: Any) -> str:
    """The client's document hash: 64 lowercase hex characters."""
    if not isinstance(document_hash, str) or not _HASH_RE.fullmatch(document_hash):
        raise WatchConfigValidationError(
            "hash must be a SHA-256 digest in lowercase hex"
        )
    return document_hash


def _text_or_none(value: Any) -> str | None:
    """A stored string field, or ``None`` when it is absent, empty or junk."""
    return value if isinstance(value, str) and value else None


@dataclass
class WatchConfigHistoryEntry:
    """One document a later save replaced, with that revision's own envelope.

    Every entry this build files carries all four envelope fields. ``None``
    is for one read off disk without a field (hand-edited, or written by a
    build that left it empty): the entry is kept, and the panel shows the
    field as unknown.
    """

    revision: int
    hash: str | None
    updated_at: str | None
    updated_by: str | None
    document: dict[str, Any]

    def as_dict(self) -> dict[str, Any]:
        return {
            "revision": self.revision,
            "hash": self.hash,
            "updated_at": self.updated_at,
            "updated_by": self.updated_by,
            "document": self.document,
        }

    def summary(self) -> dict[str, Any]:
        """The entry as the panel's history list shows it: the envelope and
        the document's size (compact UTF-8 JSON, as the cap measures it), but
        never the document."""
        return {
            "revision": self.revision,
            "hash": self.hash,
            "updated_at": self.updated_at,
            "updated_by": self.updated_by,
            "size": document_size(self.document),
        }

    @classmethod
    def from_dict(cls, raw: Any) -> WatchConfigHistoryEntry | None:
        """One entry off disk, or ``None`` for anything unusable.

        Junk drops rather than refuses: history is a safety net, and a
        hand-edited file must not cost someone their current config. Only a
        whole-number revision and an object document are required; a missing
        envelope field reads as ``None``.
        """
        if not isinstance(raw, dict):
            return None
        revision = raw.get("revision")
        document = raw.get("document")
        if isinstance(revision, bool) or not isinstance(revision, int):
            return None
        if not isinstance(document, dict):
            return None
        return cls(
            revision=revision,
            hash=_text_or_none(raw.get("hash")),
            updated_at=_text_or_none(raw.get("updated_at")),
            updated_by=_text_or_none(raw.get("updated_by")),
            document=document,
        )


@dataclass
class WatchConfigRecord:
    """One owner's document of one kind, plus its envelope."""

    owner_watch_id: str
    kind: str
    revision: int
    hash: str
    updated_at: str
    updated_by: str
    document: dict[str, Any]
    # Past documents, oldest first. No signed reply carries it; the panel
    # lists and restores it.
    history: list[WatchConfigHistoryEntry] = field(default_factory=list)
    # Measured on save and on load, never written to disk. Diagnostics report
    # it so a large config is visible without anyone reading the document.
    size_bytes: int = 0
    # The highest revision a device is known to hold (0 for none), and when
    # that became known (``None`` for never). See the module docstring.
    delivered_revision: int = 0
    delivered_at: str | None = None
    # The last revision a device reported it could not decode (0 for none),
    # and when (``None`` for never). See the module docstring.
    rejected_revision: int = 0
    rejected_at: str | None = None

    def as_storage_dict(self) -> dict[str, Any]:
        stored: dict[str, Any] = {
            "revision": self.revision,
            "hash": self.hash,
            "updated_at": self.updated_at,
            "updated_by": self.updated_by,
            "delivered_revision": self.delivered_revision,
            "delivered_at": self.delivered_at,
            "rejected_revision": self.rejected_revision,
            "rejected_at": self.rejected_at,
            "document": self.document,
        }
        if self.history:
            stored["history"] = [entry.as_dict() for entry in self.history]
        return stored

    def mark_delivered(self, revision: int) -> bool:
        """Record that a device holds ``revision``. Returns whether it moved.

        Only ever forwards, and never past the record's own revision, so a
        reply carrying an older copy cannot make a newer save look delivered.
        """
        revision = min(revision, self.revision)
        if revision <= self.delivered_revision:
            return False
        self.delivered_revision = revision
        self.delivered_at = _now_iso()
        return True

    def mark_rejected(self) -> bool:
        """Record that a device could not decode the current revision.
        Returns whether it moved.

        Always the current revision: a report about an older one says nothing
        about what is stored now. A repeat keeps the first time, so a phone
        reporting on every check costs no disk write after the first.
        """
        if self.rejected_revision == self.revision:
            return False
        self.rejected_revision = self.revision
        self.rejected_at = _now_iso()
        return True

    def history_entry(self, revision: int) -> WatchConfigHistoryEntry | None:
        """The history entry filed at ``revision``, or ``None``.

        The newest one when two share a revision, which a move onto a watch
        that already had a record can cause (the other watch's document is
        filed with its own numbering).
        """
        for entry in reversed(self.history):
            if entry.revision == revision:
                return entry
        return None

    @classmethod
    def from_dict(
        cls, owner_watch_id: str, kind: str, raw: Any
    ) -> WatchConfigRecord | None:
        if not isinstance(raw, dict):
            return None
        revision = raw.get("revision")
        document = raw.get("document")
        if isinstance(revision, bool) or not isinstance(revision, int) or revision < 1:
            return None
        if not isinstance(document, dict):
            return None
        history_raw = raw.get("history")
        history = (
            [
                entry
                for item in history_raw
                if (entry := WatchConfigHistoryEntry.from_dict(item)) is not None
            ]
            if isinstance(history_raw, list)
            else []
        )
        try:
            size = document_size(document)
        except WatchConfigValidationError:
            return None
        # Absent from every file written before delivery was tracked, which
        # reads as "not known to be delivered". Junk reads the same way: the
        # next device get sets it right, and a record is never dropped for it.
        delivered_revision = raw.get("delivered_revision", 0)
        if (
            isinstance(delivered_revision, bool)
            or not isinstance(delivered_revision, int)
            or delivered_revision < 0
        ):
            delivered_revision = 0
        delivered_at = _text_or_none(raw.get("delivered_at"))
        # The same for the unreadable report, which files written before it
        # existed lack: 0 and no time. One past the record's revision cannot
        # be about anything stored, so it reads as none too.
        rejected_revision = raw.get("rejected_revision", 0)
        if (
            isinstance(rejected_revision, bool)
            or not isinstance(rejected_revision, int)
            or not 0 < rejected_revision <= revision
        ):
            rejected_revision = 0
        rejected_at = _text_or_none(raw.get("rejected_at"))
        return cls(
            owner_watch_id=owner_watch_id,
            kind=kind,
            revision=revision,
            hash=str(raw.get("hash", "")),
            updated_at=str(raw.get("updated_at", "")),
            updated_by=str(raw.get("updated_by", "")),
            document=document,
            history=history[-WATCH_CONFIG_HISTORY_LIMIT:],
            size_bytes=size,
            delivered_revision=min(delivered_revision, revision),
            delivered_at=delivered_at if delivered_revision > 0 else None,
            rejected_revision=rejected_revision,
            rejected_at=rejected_at if rejected_revision > 0 else None,
        )

    def remember(self, entry: WatchConfigHistoryEntry) -> None:
        """File a document into the history, oldest dropped past the limit."""
        self.history.append(entry)
        if len(self.history) > WATCH_CONFIG_HISTORY_LIMIT:
            del self.history[: len(self.history) - WATCH_CONFIG_HISTORY_LIMIT]

    def current_as_history(self) -> WatchConfigHistoryEntry:
        return WatchConfigHistoryEntry(
            revision=self.revision,
            hash=self.hash,
            updated_at=self.updated_at,
            updated_by=self.updated_by,
            document=self.document,
        )


@dataclass(frozen=True)
class WatchConfigChange:
    """What a listener receives: one owner's ``kind`` now stands at ``revision``.

    Revision 0 means the owner holds nothing of that kind any more (a forget,
    or the source side of a move). Only the number travels, on purpose: the
    live line it feeds is open to any signed-in user, and the document still
    reaches the phone only through the signed get.
    """

    owner_watch_id: str
    kind: str
    revision: int


ChangeListener = Callable[[WatchConfigChange], None]


class WatchConfigStore:
    """Every owner's watch config records, one storage file per owner."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._listeners: list[ChangeListener] = []
        # owner_watch_id → kind → record
        self._records: dict[str, dict[str, WatchConfigRecord]] = {}
        # One Store per owner, kept for the life of this instance so a forget
        # followed by a new save reuses the object whose pending write the
        # removal cancelled, rather than racing a second one at the same file.
        self._files: dict[str, Store] = {}
        # Owners whose file could not be read; see WatchConfigUnavailableError.
        self._failed_owners: set[str] = set()
        # Set when the index could not be read. Every owner is then unknown,
        # so everything is refused until a restart.
        self._load_failed = False
        self._index: Store = Store(
            hass, WATCH_CONFIG_STORAGE_VERSION, WATCH_CONFIG_STORAGE_KEY
        )

    # ── persistence ────────────────────────────────────────────────────

    def _file(self, owner_watch_id: str) -> Store:
        store = self._files.get(owner_watch_id)
        if store is None:
            store = Store(
                self._hass, WATCH_CONFIG_STORAGE_VERSION, _owner_key(owner_watch_id)
            )
            self._files[owner_watch_id] = store
        return store

    async def _async_read_index(self) -> list[str] | None:
        """The owner ids the index names, or ``None`` when it is unreadable."""
        try:
            data = await self._index.async_load()
        except Exception:
            _LOGGER.exception(
                "Could not read .storage/%s; watch config is unavailable until "
                "Home Assistant restarts with a readable file",
                WATCH_CONFIG_STORAGE_KEY,
            )
            return None
        if not data:
            return []
        owners = data.get("owners") if isinstance(data, dict) else None
        if not isinstance(owners, list):
            _LOGGER.error(
                "Could not read .storage/%s: expected an owner list; watch "
                "config is unavailable until Home Assistant restarts with a "
                "readable file",
                WATCH_CONFIG_STORAGE_KEY,
            )
            return None
        return [owner for owner in owners if isinstance(owner, str) and owner]

    async def async_load(self) -> None:
        """Read the index, then every owner file it names.

        A failure is contained the way ``ComplicationStore.async_load``
        contains one: setup carries on, and whatever could not be read is
        never saved over. An unreadable index refuses everything; an
        unreadable owner file refuses that owner alone.
        """
        owners = await self._async_read_index()
        if owners is None:
            self._load_failed = True
            return
        dropped = False
        for owner in owners:
            try:
                data = await self._file(owner).async_load()
            except Exception:
                self._failed_owners.add(owner)
                _LOGGER.exception(
                    "Could not read the watch config file for %s; refusing its "
                    "reads and saves until Home Assistant restarts with a "
                    "readable file",
                    owner,
                )
                continue
            raw_records = data.get("records") if isinstance(data, dict) else None
            if data and not isinstance(raw_records, dict):
                self._failed_owners.add(owner)
                _LOGGER.error(
                    "Watch config file for %s is not the shape this store "
                    "writes; refusing its reads and saves",
                    owner,
                )
                continue
            records: dict[str, WatchConfigRecord] = {}
            for kind, raw in (raw_records or {}).items():
                if not isinstance(kind, str):
                    continue
                # A kind this build does not know is still kept on disk, its
                # document, revision, hash and history unchanged: a downgrade
                # must not erase what a newer build stored. It is held in
                # memory only to be written back (with this build's delivery
                # fields added, which a newer build reads the same way).
                record = WatchConfigRecord.from_dict(owner, kind, raw)
                if record is not None:
                    records[kind] = record
            if records:
                self._records[owner] = records
            else:
                # Listed but empty or missing: nothing to keep an entry for.
                dropped = True
        if dropped:
            self._schedule_index_save()
        _LOGGER.debug(
            "Loaded watch config for %d owner(s), %d unreadable",
            len(self._records),
            len(self._failed_owners),
        )

    def _serialize_index(self) -> dict[str, Any]:
        return {"owners": sorted(set(self._records) | self._failed_owners)}

    def _serialize_owner(self, owner_watch_id: str) -> dict[str, Any]:
        return {
            "owner_watch_id": owner_watch_id,
            "records": {
                kind: record.as_storage_dict()
                for kind, record in self._records.get(owner_watch_id, {}).items()
            },
        }

    def _schedule_index_save(self) -> None:
        if self._load_failed:
            return
        self._index.async_delay_save(self._serialize_index, _SAVE_DEBOUNCE_SECONDS)

    def _schedule_owner_save(self, owner_watch_id: str) -> None:
        self._file(owner_watch_id).async_delay_save(
            lambda: self._serialize_owner(owner_watch_id), _SAVE_DEBOUNCE_SECONDS
        )

    def _remove_owner_file(self, owner_watch_id: str) -> None:
        """Delete one owner's file, from a synchronous caller.

        ``Store.async_remove`` cancels the pending debounced write before it
        unlinks, so a save scheduled just before the forget never lands.
        """
        self._hass.async_create_task(
            self._file(owner_watch_id).async_remove(),
            name=f"wrist_assistant_watch_config_remove_{owner_watch_id}",
        )

    async def async_remove(self) -> None:
        """Delete every owner file and the index (the integration is removed).

        Reads the index itself, so it works on a fresh instance after the
        entry is unloaded, which is how ``async_remove_entry`` calls it.
        """
        owners = await self._async_read_index() or []
        for owner in set(owners) | set(self._records):
            await self._file(owner).async_remove()
        self._records.clear()
        await self._index.async_remove()

    # ── change notification ────────────────────────────────────────────

    @callback
    def async_add_listener(self, listener: ChangeListener) -> Callable[[], None]:
        self._listeners.append(listener)

        def _remove() -> None:
            if listener in self._listeners:
                self._listeners.remove(listener)

        return _remove

    def _notify(self, owner_watch_id: str, kind: str, revision: int) -> None:
        """Tell every listener that ``kind`` of the owner is at ``revision``.

        Called after the change is in memory, so a listener that reads the
        store sees it. A listener that raises is logged and skipped: the save
        it was told about has already been accepted and must stay accepted.
        A kind this build does not know (kept on disk for a newer build) is
        never announced, since no get here could serve it.
        """
        if kind not in WATCH_CONFIG_KINDS:
            return
        change = WatchConfigChange(owner_watch_id, kind, revision)
        for listener in list(self._listeners):
            try:
                listener(change)
            except Exception:
                _LOGGER.exception("Watch config change listener failed")

    # ── reads ──────────────────────────────────────────────────────────

    def _check_available(self, owner_watch_id: str) -> None:
        if self._load_failed or owner_watch_id in self._failed_owners:
            raise WatchConfigUnavailableError(
                "the stored watch config could not be read; restart Home Assistant"
            )

    def owners(self) -> list[str]:
        return sorted(self._records)

    def get(self, owner_watch_id: str, kind: Any) -> WatchConfigRecord | None:
        """The owner's record of that kind, or ``None`` when there is none."""
        kind = validate_kind(kind)
        self._check_available(owner_watch_id)
        return self._records.get(owner_watch_id, {}).get(kind)

    def revisions(self, owner_watch_id: str) -> dict[str, int]:
        """The owner's current revision of every kind it holds a record of.

        Empty when it holds none. Only the kinds this build serves: one kept
        on disk for a newer build could not be fetched by any get here. What
        the live line answers at subscribe time, so a save that landed while
        the phone's socket was down is caught then.
        """
        self._check_available(owner_watch_id)
        return {
            kind: record.revision
            for kind, record in sorted(self._records.get(owner_watch_id, {}).items())
            if kind in WATCH_CONFIG_KINDS
        }

    def history(self, owner_watch_id: str, kind: Any) -> list[WatchConfigHistoryEntry]:
        """The owner's history of that kind, newest first.

        Empty when there is no record, or a record nothing has replaced yet.
        The current document is not in it: that is the record itself.
        """
        record = self.get(owner_watch_id, kind)
        return list(reversed(record.history)) if record is not None else []

    def history_entry(
        self, owner_watch_id: str, kind: Any, revision: Any
    ) -> WatchConfigHistoryEntry:
        """One history entry by revision, or :class:`WatchConfigNotFoundError`
        when the record has none at that revision (or there is no record)."""
        revision = _validate_revision(revision)
        record = self.get(owner_watch_id, kind)
        entry = record.history_entry(revision) if record is not None else None
        if entry is None:
            raise WatchConfigNotFoundError(
                f"revision {revision} of {kind} is not in the history"
            )
        return entry

    def diagnostics(self) -> dict[str, dict[str, dict[str, Any]]]:
        """Revision, size, times, delivery and the unreadable report per owner
        and kind. Never a document."""
        report: dict[str, dict[str, dict[str, Any]]] = {
            owner: {
                kind: {
                    "revision": record.revision,
                    "size_bytes": record.size_bytes,
                    "updated_at": record.updated_at,
                    "updated_by": record.updated_by,
                    "delivered_revision": record.delivered_revision,
                    "delivered_at": record.delivered_at,
                    "rejected_revision": record.rejected_revision,
                    "rejected_at": record.rejected_at,
                    "history_count": len(record.history),
                }
                for kind, record in sorted(by_kind.items())
            }
            for owner, by_kind in sorted(self._records.items())
        }
        for owner in sorted(self._failed_owners):
            report[owner] = {"unreadable": {}}
        return report

    # ── writes ─────────────────────────────────────────────────────────

    def put(
        self,
        owner_watch_id: str,
        kind: Any,
        document: Any,
        *,
        document_hash: Any,
        base_revision: Any,
        force: Any = False,
        updated_by: str,
    ) -> WatchConfigRecord:
        """Save one document, compare-and-swap on the revision.

        Accepted when ``base_revision`` equals the stored revision (0 when
        there is no record), or when ``force`` is true. Every accepted save
        replacing a document files that document in the history first, so a
        forced save never loses the copy it overwrote. Everything about the
        request is checked before the revision is, so a malformed save is
        refused as malformed even when it is also stale.

        Only the page level of the shape guard applies here, never the tile
        level (see :func:`_check_pages`), so a device is never refused for a
        fault in its own older tiles.
        """
        if not isinstance(owner_watch_id, str) or not owner_watch_id:
            raise WatchConfigValidationError("owner_watch_id is required")
        kind = validate_kind(kind)
        size = validate_document(kind, document)
        document_hash = validate_hash(document_hash)
        if not isinstance(force, bool):
            raise WatchConfigValidationError("force must be true or false")
        if not force:
            _validate_base_revision(base_revision)
        self._check_available(owner_watch_id)

        by_kind = self._records.get(owner_watch_id, {})
        existing = by_kind.get(kind)
        stored_revision = existing.revision if existing is not None else 0
        if not force and base_revision != stored_revision:
            raise WatchConfigConflictError(
                f"stored revision is {stored_revision}, save was based on "
                f"{base_revision}",
                stored_revision,
                existing.hash if existing is not None else None,
            )

        if existing is None:
            record = WatchConfigRecord(
                owner_watch_id=owner_watch_id,
                kind=kind,
                revision=1,
                hash=document_hash,
                updated_at=_now_iso(),
                updated_by=updated_by,
                document=document,
                size_bytes=size,
            )
            new_owner = owner_watch_id not in self._records
            self._records.setdefault(owner_watch_id, {})[kind] = record
            if new_owner:
                self._schedule_index_save()
        else:
            record = existing
            self._replace(record, document, document_hash, size, updated_by)
        # The device that wrote this revision holds it. Without this a phone's
        # own upload would read in the panel as "waiting for the iPhone" until
        # its next get.
        record.mark_delivered(record.revision)
        self._schedule_owner_save(owner_watch_id)
        # Announced even though the writer already knows: the phone's own
        # upload echoes back to it, and it ignores a revision it has stored.
        self._notify(owner_watch_id, kind, record.revision)
        return record

    @staticmethod
    def _replace(
        record: WatchConfigRecord,
        document: dict[str, Any],
        document_hash: str,
        size: int,
        updated_by: str,
    ) -> None:
        """Make ``document`` the record's next revision, filing the current one
        into the history first. Every save that replaces a document, device or
        panel, a restore included, goes through here."""
        record.remember(record.current_as_history())
        record.revision += 1
        record.hash = document_hash
        record.updated_at = _now_iso()
        record.updated_by = updated_by
        record.document = document
        record.size_bytes = size

    def panel_save(
        self,
        owner_watch_id: str,
        kind: Any,
        document: Any,
        *,
        base_revision: Any,
    ) -> WatchConfigRecord:
        """Save a document edited in the panel, compare-and-swap on the revision.

        Stricter than a device save, on purpose:

        * Only the kinds in ``WATCH_CONFIG_PANEL_KINDS`` (both, today).
        * The tile level of the page shape guard as well as the page level
          (:func:`validate_document` with ``check_items``). The panel builds
          what it sends, so it can always fix a fault there.
        * Never a new record. ``base_revision`` 0, or no stored record at all,
          is refused with :class:`WatchConfigNoRecordError`: the first copy
          comes from a device, so the panel never invents a document the
          device has not seen.
        * No ``force``. A stale base is a conflict, and the panel reloads.

        The server computes the hash (:func:`canonical_hash`) and writes
        ``updated_by`` as ``panel``. Delivery is left where it was, which is
        what makes the panel say "waiting for the iPhone" until the phone's
        next get collects the save.
        """
        if not isinstance(owner_watch_id, str) or not owner_watch_id:
            raise WatchConfigValidationError("owner_watch_id is required")
        kind = self._panel_kind(kind)
        size = validate_document(kind, document, check_items=True)
        base_revision = _validate_base_revision(base_revision)
        self._check_available(owner_watch_id)

        existing = self._panel_target(owner_watch_id, kind, base_revision, "save")
        return self._panel_commit(existing, document, size)

    def restore(
        self,
        owner_watch_id: str,
        kind: Any,
        revision: Any,
        *,
        base_revision: Any,
    ) -> WatchConfigRecord:
        """Make a history entry's document the record's next revision.

        A panel save in every respect but where the document comes from: the
        same kinds, the same ``no_record`` and ``conflict`` refusals on
        ``base_revision``, the same shape guard with the tile level, the
        server's hash, ``updated_by`` ``panel``, the current document filed
        into the history, and listeners told. The entry stays in the history
        too, until five later saves push it out.

        Refused with :class:`WatchConfigNotFoundError` when the record holds
        no entry at ``revision``. The stale base is checked first, so a panel
        whose list is out of date is told to reload rather than that an entry
        it saw is gone. An entry a device wrote may fail the tile level (a
        device save never checks it); that is refused as ``invalid`` and the
        record is left alone.
        """
        if not isinstance(owner_watch_id, str) or not owner_watch_id:
            raise WatchConfigValidationError("owner_watch_id is required")
        kind = self._panel_kind(kind)
        revision = _validate_revision(revision)
        base_revision = _validate_base_revision(base_revision)
        self._check_available(owner_watch_id)

        existing = self._panel_target(owner_watch_id, kind, base_revision, "restore")
        entry = existing.history_entry(revision)
        if entry is None:
            raise WatchConfigNotFoundError(
                f"revision {revision} of {kind} is not in the history"
            )
        # A copy: the entry stays in the history, and the record's document
        # must not be the same object as the one filed there.
        document = copy.deepcopy(entry.document)
        size = validate_document(kind, document, check_items=True)
        return self._panel_commit(existing, document, size)

    @staticmethod
    def _panel_kind(kind: Any) -> str:
        kind = validate_kind(kind)
        if kind not in WATCH_CONFIG_PANEL_KINDS:
            raise WatchConfigValidationError(
                f"the panel cannot save {kind}; it may save "
                f"{', '.join(sorted(WATCH_CONFIG_PANEL_KINDS))}"
            )
        return kind

    def _panel_target(
        self, owner_watch_id: str, kind: str, base_revision: int, action: str
    ) -> WatchConfigRecord:
        """The record a panel write replaces, after the ``no_record`` and
        ``conflict`` checks. ``action`` names the write in the conflict
        message, which always begins ``stored revision is <N>``."""
        existing = self._records.get(owner_watch_id, {}).get(kind)
        if base_revision == 0 or existing is None:
            raise WatchConfigNoRecordError(
                f"there is no stored {kind} record to save over; the iPhone "
                "uploads the first copy"
            )
        if base_revision != existing.revision:
            raise WatchConfigConflictError(
                f"stored revision is {existing.revision}, {action} was based on "
                f"{base_revision}",
                existing.revision,
                existing.hash,
            )
        return existing

    def _panel_commit(
        self, record: WatchConfigRecord, document: dict[str, Any], size: int
    ) -> WatchConfigRecord:
        self._replace(
            record,
            document,
            canonical_hash(document),
            size,
            WATCH_CONFIG_PANEL_WRITER,
        )
        self._schedule_owner_save(record.owner_watch_id)
        self._notify(record.owner_watch_id, record.kind, record.revision)
        return record

    def mark_delivered(self, owner_watch_id: str, kind: str, revision: int) -> bool:
        """Record that the owner's device holds ``revision`` of ``kind``.

        Called by the signed get for every reply about a stored record, the
        ones that carry the document and the ones that answer "you already
        have it". Saves only when the value moves, so a phone checking in on
        every foreground costs no disk write once it is up to date.
        """
        record = self._records.get(owner_watch_id, {}).get(kind)
        if record is None or not record.mark_delivered(revision):
            return False
        self._schedule_owner_save(owner_watch_id)
        return True

    def report_unreadable(self, owner_watch_id: str, kind: str, revision: int) -> bool:
        """A device says it fetched ``revision`` of ``kind`` and could not
        decode it. Returns whether that is the stored revision.

        Called by the signed get carrying ``unreadable_revision``. Only a
        report about the stored revision counts: it sets ``rejected_revision``
        and ``rejected_at`` (the first report's time, kept through repeats),
        and the caller must then not mark that revision delivered. A report
        about any other revision is stale (a newer save already replaced what
        the device could not read) and changes nothing. Saves only when the
        value moves. Tells no listener: the revision did not change.
        """
        record = self._records.get(owner_watch_id, {}).get(kind)
        if record is None or revision != record.revision:
            return False
        if record.mark_rejected():
            self._schedule_owner_save(owner_watch_id)
        return True

    @callback
    def forget_owner(self, owner_watch_id: str) -> bool:
        """Delete everything stored for one watch. Returns whether there was any.

        Called beside the complication store's release on both forget paths.
        Unlike a complication there is nothing to tombstone: a watch config is
        not replicated to anything that could resurrect it, and the phone reads
        the empty answer as "upload", which is right for a device that is
        paired again. The file is removed, not emptied, and that includes a
        file that could not be read: the user asked for the device to go, and
        an unreadable copy of its config has nobody left to recover it for.

        Listeners hear revision 0 for each kind removed, so a phone forgotten
        while open stops treating its stored revision as current. An
        unreadable file had no kinds anyone could see, so it announces none.
        """
        had = owner_watch_id in self._records or owner_watch_id in self._failed_owners
        removed = sorted(self._records.pop(owner_watch_id, {}))
        self._failed_owners.discard(owner_watch_id)
        if had:
            self._remove_owner_file(owner_watch_id)
            self._schedule_index_save()
            _LOGGER.info("Forgot watch config for %s", owner_watch_id)
        for kind in removed:
            self._notify(owner_watch_id, kind, 0)
        return had

    @callback
    def move_owner(
        self, source_owner: str, target_owner: str, *, updated_by: str
    ) -> list[str]:
        """Carry one watch's config onto another watch. Returns the kinds moved.

        The reinstall recovery path, run beside the complication move: a
        reinstalled watch can come back under a new id, and its config must
        follow it. Per kind:

        * The target holds nothing of that kind: the record moves whole, with
          its revision, hash and history unchanged. The document did not
          change, so a phone that synced it before still reads it as in step.
          Its delivery is reset to nothing: it said which revision the device
          signing as the old id held, and nothing signing as the new id has
          asked yet. The panel then reads "waiting for the iPhone" until the
          first get under the new id, which is the honest answer. Its
          unreadable report moves with it: the document is the same one the
          device could not read.
        * The target already holds one: the target's record stays. It is what
          the device under the new id has been working with since it came
          back, so it is the newer truth. The source's current document is filed into
          the target's history, so nothing is lost. Its own older history is
          not carried: it would push the target's past documents out of a
          five-entry list.

        The source is then forgotten. An owner whose file is unreadable on
        either side is refused, so a move never writes over something this
        instance could not read.

        Listeners hear the forget of the source (revision 0 per kind, from
        :meth:`forget_owner`), then the target's resulting revision of every
        kind moved, the kept ones included: their history grew, and a repeat
        of a revision the phone holds costs it nothing.
        """
        if not isinstance(source_owner, str) or not source_owner:
            raise WatchConfigValidationError("source_owner_watch_id is required")
        if not isinstance(target_owner, str) or not target_owner:
            raise WatchConfigValidationError("target_owner_watch_id is required")
        if source_owner == target_owner:
            raise WatchConfigValidationError(
                "the source and the target are the same watch"
            )
        self._check_available(source_owner)
        self._check_available(target_owner)
        moving = self._records.get(source_owner)
        if not moving:
            return []
        new_owner = target_owner not in self._records
        target = self._records.setdefault(target_owner, {})
        moved: list[str] = []
        for kind, source_record in sorted(moving.items()):
            existing = target.get(kind)
            if existing is None:
                record = copy.deepcopy(source_record)
                record.owner_watch_id = target_owner
                record.delivered_revision = 0
                record.delivered_at = None
                target[kind] = record
            else:
                existing.remember(copy.deepcopy(source_record.current_as_history()))
            moved.append(kind)
        self._schedule_owner_save(target_owner)
        if new_owner:
            self._schedule_index_save()
        self.forget_owner(source_owner)
        for kind in moved:
            self._notify(target_owner, kind, target[kind].revision)
        _LOGGER.info(
            "Moved watch config (%s) from %s to %s by %s",
            ", ".join(moved),
            source_owner,
            target_owner,
            updated_by,
        )
        return moved
