"""The home's HTTP action library, kept by Home Assistant.

Step 4d batch 4 (``docs/pages_in_home_assistant_step4.md`` in the app repo).
One record for the whole home, not one per watch: every paired device may
run every action, and the panel edits the one list ("Shared by every
watch"). The rules for reading the document live in ``http_actions.py``.

The record:

* ``document``: the phone's own ``HTTPActionConfig`` JSON, as the panel
  saved it or the hand-overs built it, secrets included. None until the
  first accepted change.
* ``revision``: 0 for no document yet, then +1 per accepted change.
* ``hash``: the canonical hash of the document (``canonical_hash``), null at
  revision 0.
* ``updated_at`` / ``updated_by``: when, and who: ``panel`` for a panel
  save, the signing id for a hand-over.
* ``handed_over``: the owner ids whose phone gave its library (the signed
  ``http_actions_hand_over``). A phone hands over once per owner; the
  second time changes nothing.
* ``delivered``: owner id to the last revision that device pulled (the
  signed ``http_actions_get``), which the panel's Home reads to say who is
  still waiting.

Writers: the panel's save (compare and swap on ``base_revision``, over the
WebSocket in ``http_actions_ws.py``) and a phone's hand-over (a pure merge,
see ``merge_hand_over``). Every accepted change tells the listeners its new
revision, which is how the parked delta polls are woken.

Storage is one Home Assistant ``Store`` file. A file that cannot be read is
logged and left alone: every read and write is then refused with
``unavailable`` until a restart reads it, so a damaged file is never saved
over with an empty library. Uninstalling the integration removes the file;
removing a device drops its two marks and leaves the library, which belongs
to the home.
"""

from __future__ import annotations

import copy
import logging
from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store

from .const import HTTP_ACTIONS_STORAGE_KEY, HTTP_ACTIONS_STORAGE_VERSION
from .http_actions import (
    HTTPActionsInvalid,
    canonical_hash,
    merge_hand_over,
    public_list,
    validate_document,
)

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 1

# `updated_by` on a panel save, as for the watch config.
PANEL_WRITER = "panel"

ChangeListener = Callable[[int], None]


class HTTPActionsStoreError(Exception):
    """Base class; ``code`` is the stable reason the WebSocket and the ops
    send back."""

    code = "error"

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class HTTPActionsValidationError(HTTPActionsStoreError):
    code = "invalid"


class HTTPActionsConflictError(HTTPActionsStoreError):
    """A save based on a revision that is no longer the stored one. The
    message always begins ``stored revision is <N>``."""

    code = "conflict"

    def __init__(self, revision: int, base_revision: int) -> None:
        super().__init__(
            f"stored revision is {revision}, save was based on {base_revision}"
        )
        self.revision = revision


class HTTPActionsUnavailableError(HTTPActionsStoreError):
    code = "unavailable"


def _now_iso() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _non_negative_int(value: Any) -> bool:
    return isinstance(value, int) and not isinstance(value, bool) and value >= 0


@dataclass
class HTTPActionsRecord:
    """The one record, as stored."""

    document: dict[str, Any] | None = None
    revision: int = 0
    hash: str | None = None
    updated_at: str | None = None
    updated_by: str | None = None
    handed_over: list[str] = field(default_factory=list)
    delivered: dict[str, int] = field(default_factory=dict)

    def as_storage_dict(self) -> dict[str, Any]:
        return {
            "document": self.document,
            "revision": self.revision,
            "hash": self.hash,
            "updated_at": self.updated_at,
            "updated_by": self.updated_by,
            "handed_over": list(self.handed_over),
            "delivered": dict(sorted(self.delivered.items())),
        }

    @classmethod
    def from_dict(cls, raw: Any) -> HTTPActionsRecord:
        """A stored record, each field checked on its own. A document that
        no longer passes the check is kept: it was accepted when written,
        and dropping it would lose the home's requests."""
        if not isinstance(raw, dict):
            return cls()
        document = raw.get("document")
        revision = raw.get("revision")
        if not isinstance(document, dict) or not _non_negative_int(revision) or revision == 0:
            document, revision = None, 0
        handed_over = raw.get("handed_over")
        delivered = raw.get("delivered")
        record = cls(
            document=document,
            revision=revision,
            hash=canonical_hash(document) if document is not None else None,
            updated_at=raw.get("updated_at") if isinstance(raw.get("updated_at"), str) else None,
            updated_by=raw.get("updated_by") if isinstance(raw.get("updated_by"), str) else None,
            handed_over=[
                owner for owner in handed_over if isinstance(owner, str) and owner
            ]
            if isinstance(handed_over, list)
            else [],
            delivered={
                owner: min(rev, revision)
                for owner, rev in delivered.items()
                if isinstance(owner, str) and _non_negative_int(rev)
            }
            if isinstance(delivered, dict)
            else {},
        )
        return record


class HTTPActionsStore:
    """The home's HTTP action library and who has seen which revision."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store = Store(
            hass, HTTP_ACTIONS_STORAGE_VERSION, HTTP_ACTIONS_STORAGE_KEY
        )
        self._record = HTTPActionsRecord()
        self._load_failed = False
        self._listeners: list[ChangeListener] = []
        # (revision, public list, its hash), made on first ask per revision.
        self._public: tuple[int, dict[str, Any], str] | None = None

    async def async_load(self) -> None:
        try:
            data = await self._store.async_load()
        except Exception:  # noqa: BLE001 (see the module docstring)
            _LOGGER.exception(
                "The HTTP action library could not be read; it is left alone "
                "and refused until a restart reads it"
            )
            self._load_failed = True
            return
        self._record = HTTPActionsRecord.from_dict(data)

    async def async_remove(self) -> None:
        """Delete the file. Called when the integration is removed."""
        self._record = HTTPActionsRecord()
        self._public = None
        await self._store.async_remove()

    def _schedule_save(self) -> None:
        self._store.async_delay_save(
            self._record.as_storage_dict, _SAVE_DEBOUNCE_SECONDS
        )

    def _check_available(self) -> None:
        if self._load_failed:
            raise HTTPActionsUnavailableError("the stored HTTP action library could not be read")

    # ── change notification ────────────────────────────────────────────

    @callback
    def async_add_listener(self, listener: ChangeListener) -> Callable[[], None]:
        """Call ``listener(revision)`` after every accepted change."""
        self._listeners.append(listener)

        def _remove() -> None:
            if listener in self._listeners:
                self._listeners.remove(listener)

        return _remove

    def _notify(self) -> None:
        revision = self._record.revision
        for listener in list(self._listeners):
            try:
                listener(revision)
            except Exception:
                _LOGGER.exception("HTTP action library listener failed")

    # ── reads ──────────────────────────────────────────────────────────

    @property
    def revision(self) -> int:
        """The stored revision; 0 for none, and for a file that could not be
        read (the delta field then says "nothing", which a device treats as
        "use what you have")."""
        return self._record.revision

    @property
    def available(self) -> bool:
        return not self._load_failed

    def document(self) -> dict[str, Any] | None:
        """The stored library, secrets and all. Never sent to a device."""
        self._check_available()
        return self._record.document

    def get(self) -> dict[str, Any]:
        """The panel's view of the record: ``{"revision", "hash",
        "updated_at", "updated_by", "handed_over", "delivered",
        "document"?}``, with no document at revision 0."""
        self._check_available()
        record = self._record
        result: dict[str, Any] = {
            "revision": record.revision,
            "hash": record.hash,
            "updated_at": record.updated_at,
            "updated_by": record.updated_by,
            "handed_over": list(record.handed_over),
            "delivered": dict(record.delivered),
        }
        if record.document is not None:
            result["document"] = copy.deepcopy(record.document)
        return result

    def public(self) -> tuple[int, dict[str, Any] | None, str | None]:
        """(revision, public list, the public list's hash); the last two are
        None at revision 0."""
        self._check_available()
        record = self._record
        if record.document is None:
            return record.revision, None, None
        if self._public is None or self._public[0] != record.revision:
            listed = public_list(record.document)
            self._public = (record.revision, listed, canonical_hash(listed))
        return record.revision, copy.deepcopy(self._public[1]), self._public[2]

    def has_handed_over(self, owner_id: str) -> bool:
        return owner_id in self._record.handed_over

    def delivered(self) -> dict[str, int]:
        return dict(self._record.delivered)

    # ── writes ─────────────────────────────────────────────────────────

    def save(
        self, document: Any, *, base_revision: Any, updated_by: str = PANEL_WRITER
    ) -> int:
        """Replace the library, compare and swap. Returns the new revision.

        ``base_revision`` must be the stored revision (0 when there is none
        yet); anything else is a :class:`HTTPActionsConflictError`. A
        malformed document is :class:`HTTPActionsValidationError`. Delivery
        marks stay as they are: the devices have not seen this revision.
        """
        self._check_available()
        if not _non_negative_int(base_revision):
            raise HTTPActionsValidationError("base_revision must be a non-negative integer")
        try:
            validate_document(document)
        except HTTPActionsInvalid as err:
            raise HTTPActionsValidationError(err.message) from err
        record = self._record
        if base_revision != record.revision:
            raise HTTPActionsConflictError(record.revision, base_revision)
        self._accept(copy.deepcopy(document), updated_by)
        return record.revision

    def hand_over(self, owner_id: str, document: Any) -> tuple[int, int]:
        """Merge a phone's library in, once per owner. Returns (revision,
        actions added).

        A second hand-over from an owner already listed changes nothing and
        answers the stored revision with 0 added. The first one is listed
        even when it adds nothing, an empty library included, so the phone
        stops offering it.
        """
        self._check_available()
        if not isinstance(owner_id, str) or not owner_id:
            raise HTTPActionsValidationError("owner id is required")
        record = self._record
        if owner_id in record.handed_over:
            return record.revision, 0
        try:
            validate_document(document)
        except HTTPActionsInvalid as err:
            raise HTTPActionsValidationError(err.message) from err
        merged, added, changed = merge_hand_over(record.document, document)
        if changed:
            try:
                validate_document(merged)
            except HTTPActionsInvalid as err:
                raise HTTPActionsValidationError(
                    f"the merged library would break the rules: {err.message}"
                ) from err
        record.handed_over.append(owner_id)
        if changed:
            self._accept(merged, owner_id)
        else:
            self._schedule_save()
        return record.revision, added

    def _accept(self, document: dict[str, Any], updated_by: str) -> None:
        record = self._record
        record.document = document
        record.revision += 1
        record.hash = canonical_hash(document)
        record.updated_at = _now_iso()
        record.updated_by = updated_by
        self._public = None
        self._schedule_save()
        self._notify()

    def mark_delivered(self, owner_id: str, revision: int) -> None:
        """Note that a device holds ``revision``. Only ever forward, and
        never past the stored revision."""
        if self._load_failed or not owner_id:
            return
        record = self._record
        revision = min(revision, record.revision)
        if revision <= 0 or record.delivered.get(owner_id, 0) >= revision:
            return
        record.delivered[owner_id] = revision
        self._schedule_save()

    def forget(self, owner_id: str) -> bool:
        """Drop one device's hand-over and delivery marks, as a device
        removal does. The library stays: it is the home's. True when there
        was a mark to drop."""
        if self._load_failed:
            return False
        record = self._record
        had = owner_id in record.handed_over or owner_id in record.delivered
        if not had:
            return False
        record.handed_over = [o for o in record.handed_over if o != owner_id]
        record.delivered.pop(owner_id, None)
        self._schedule_save()
        return True
