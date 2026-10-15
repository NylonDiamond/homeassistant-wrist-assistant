"""Move a watch's old Control Center list into complication control documents.

The plan is ``docs/control_center_move.md`` in the app repo. A watch's old
"Toggle" and "Action" tiles take their name, symbol and tint from the curated
list (watch config kind ``control_center``). The new path keeps that look in a
complication document's ``control`` key, edited in the panel. This module
turns one owner's list into control-only documents and saves them, so no user
has to set a tile up again.

Home Assistant runs the move itself, not the iPhone. It already holds both
halves per watch owner id: the list (``watch_config_store.py``) and the
complication records (``complication_store.py``). The phone cannot do it any
more: since the 3.1 link removal it no longer holds the watch's signing pair,
so it can never sign a ``complications_create`` as the watch.

Two parts:

* The converter (:func:`document`, :func:`documents`, :func:`movable`,
  :func:`document_id`, :func:`free_slots`). Pure, and byte for byte what the
  app's ``ControlCenterHandover.document(from:ownerId:slotIndex:)`` encodes:
  the same keys in the same order as the Swift encoder writes them, the same
  name-based id, the same name and symbol fallbacks and the same tap. The
  shared fixture ``frontend/test/fixtures/control_moved.json`` is that Swift
  output, and the tests check this module against it.
* The runner (:class:`ControlCenterMover`). Per owner, it skips every entry
  whose id already has a record for that owner, live or tombstoned (a delete
  is final and never revived), gives each new document the lowest free seat,
  stays under ``COMPLICATION_MAX_PER_OWNER``, and saves through
  ``ComplicationStore.save`` so revisions, tokens, history, listeners, the
  watch's wake and the phone push all happen exactly as for a panel save. It
  runs once for every owner after setup, and again after any save of an
  owner's ``control_center`` record (a device upload, a panel save, a
  restore, or a reinstall move onto a new id). A second run makes nothing.
"""

from __future__ import annotations

import logging
import uuid
from collections.abc import Callable
from typing import Any

from .complication_store import ComplicationStoreError
from .const import COMPLICATION_MAX_PER_OWNER, COMPLICATION_MAX_SLOTS
from .watch_config_store import WatchConfigChange, WatchConfigStoreError

_LOGGER = logging.getLogger(__name__)

# The watch config kind holding the old list, and the key of its entries.
CONTROL_CENTER_KIND = "control_center"
_ENTRIES_KEY = "entities"

# What every record the move creates says wrote it.
UPDATED_BY = "control-center-move"

# Fixed forever: a different namespace would give every entry a new id, and
# the next run would make a copy of every control the last one made.
ID_NAMESPACE = uuid.UUID("B0A4B117-F4EA-4A42-8F27-E66350A6A375")

# The app's `CuratedEntity.toggleDomainList` and `actionDomainList`, which the
# panel reads from `control-center-rules.json`.
TOGGLE_DOMAINS = ("light", "switch", "fan", "input_boolean", "lock", "cover")
ACTION_DOMAINS = ("scene", "script", "automation")

# `CuratedEntity.defaultIcons` and `fallbackIconName`, the same table as
# `control-center-rules.json`.
DEFAULT_ICONS = {
    "light": "lightbulb",
    "switch": "switch.2",
    "fan": "fan",
    "lock": "lock",
    "cover": "blinds.horizontal.closed",
    "scene": "play",
    "script": "scroll",
    "automation": "gearshape.2",
    "input_boolean": "togglepower",
}
FALLBACK_ICON = "circle"

# What `CustomComplicationConfig.requiredSchemaVersion` gives a document with
# no canvas shape: 6. It already covers seats above 7, which need 5.
CONTROL_SCHEMA_VERSION = 6


# ── the converter ─────────────────────────────────────────────────────────


def document_id(owner_watch_id: str, entity_id: str) -> str:
    """The document id for one entry on one watch, as the app writes it.

    A name-based UUID (version 5) of ``<owner id>/<entity id>``, uppercase the
    way Swift's ``UUID`` encodes it and the way the store keys its records.
    """
    return str(uuid.uuid5(ID_NAMESPACE, f"{owner_watch_id}/{entity_id}")).upper()


def default_icon(domain: str) -> str:
    """The symbol a new entry of ``domain`` gets in the app's editor."""
    return DEFAULT_ICONS.get(domain, FALLBACK_ICON)


def _string(entry: dict[str, Any], key: str) -> str | None:
    value = entry.get(key)
    return value if isinstance(value, str) else None


def _is_entry(entry: Any) -> bool:
    """Whether a stored entry is one the app's decoder reads: an object with a
    string ``entityId``, ``displayName``, ``iconName`` and ``domain``. The
    store checks this on every save, but a record loaded from disk is not
    checked again, so an odd one is skipped rather than raising."""
    return isinstance(entry, dict) and all(
        isinstance(entry.get(key), str)
        for key in ("entityId", "displayName", "iconName", "domain")
    )


def movable(entries: Any) -> list[dict[str, Any]]:
    """The entries a tile can draw, in list order.

    The toggle and action domains, each entity once (the first entry wins,
    the way the tile's own lookup finds it). Hidden entries move too; their
    document is hidden. ``ControlCenterHandover.movable``.
    """
    if not isinstance(entries, list):
        return []
    seen: set[str] = set()
    found: list[dict[str, Any]] = []
    for entry in entries:
        if not _is_entry(entry):
            continue
        domain = entry["domain"]
        entity_id = entry["entityId"]
        if domain not in TOGGLE_DOMAINS and domain not in ACTION_DOMAINS:
            continue
        if not entity_id or entity_id in seen:
            continue
        seen.add(entity_id)
        found.append(entry)
    return found


def name_of(entry: dict[str, Any]) -> str:
    """The name the old tile shows, as it was saved.

    The custom name when there is one, else the entity's name. The store
    refuses a blank name, so an entry saved with none takes its entity id.
    """
    custom = _string(entry, "customDisplayName")
    effective = custom if custom is not None else entry["displayName"]
    return effective if effective.strip() else entry["entityId"]


def _entity_ref(entry: dict[str, Any]) -> dict[str, Any]:
    """An `EntityRef`'s keys, in the order `TapAction` and `Value` write them.
    The ref carries no `iconName`, so none is written."""
    return {
        "entityId": entry["entityId"],
        "displayName": name_of(entry),
        "domain": entry["domain"],
    }


def action(entry: dict[str, Any]) -> dict[str, Any] | None:
    """What a tap runs, matching the old tile, or ``None`` for a domain no
    tile draws.

    Every toggle domain is ``toggleEntity``: a document toggle switches a
    lock and a cover by direction, as the old toggle does. A scene and a
    script run as themselves; an automation is ``automation.trigger``, which
    is what the old action tile calls.
    """
    domain = entry["domain"]
    if domain in TOGGLE_DOMAINS:
        return {"type": "toggleEntity", **_entity_ref(entry)}
    if domain == "scene":
        return {"type": "runScene", **_entity_ref(entry)}
    if domain == "script":
        return {"type": "runScript", **_entity_ref(entry)}
    if domain == "automation":
        return {
            "type": "callService",
            "serviceDomain": "automation",
            "serviceName": "trigger",
            **_entity_ref(entry),
        }
    return None


def control(entry: dict[str, Any]) -> dict[str, Any] | None:
    """The `control` key an entry becomes, or ``None`` for a domain no tile
    draws.

    The title is a literal of the saved name, not the entity's, because the
    old tile shows the name as it was saved. One symbol for both sides (no
    ``symbolOff``), since the old tile draws the same symbol either way. The
    key order is `ControlSpec.encode(to:)`'s.
    """
    tap = action(entry)
    if tap is None:
        return None
    is_toggle = entry["domain"] in TOGGLE_DOMAINS
    custom_icon = _string(entry, "customIconName")
    icon = custom_icon if custom_icon is not None else entry["iconName"]
    spec: dict[str, Any] = {
        "kind": "toggle" if is_toggle else "button",
        "title": {"kind": {"kind": "literal", "value": name_of(entry)}},
    }
    if is_toggle:
        spec["state"] = {"kind": {"kind": "entityState", **_entity_ref(entry)}}
    spec["symbol"] = icon if icon else default_icon(entry["domain"])
    tint = _string(entry, "tintColorHex")
    if tint:
        spec["tintColorHex"] = tint
    spec["action"] = tap
    return spec


def document(
    entry: Any, owner_watch_id: str, slot_index: int
) -> dict[str, Any] | None:
    """One entry as a control-only document, or ``None`` for an entry no tile
    draws.

    The keys the mapping does not name are what the panel writes for a new
    control with no shape: no values, layers or data sources, a refresh tap,
    no periodic refresh. ``perFamily`` is an empty list because that is how
    Swift encodes an empty dictionary keyed by an enum. The key order is
    `CustomComplicationConfig.encode(to:)`'s.
    """
    if not _is_entry(entry):
        return None
    spec = control(entry)
    if spec is None:
        return None
    doc: dict[str, Any] = {
        "schemaVersion": CONTROL_SCHEMA_VERSION,
        "id": document_id(owner_watch_id, entry["entityId"]),
        "name": name_of(entry),
        "values": [],
        "slotIndex": slot_index,
        "elements": [],
        "supportedFamilies": [],
        "perFamily": [],
        "dataSources": [],
        "refreshMinutes": 0,
        "tapAction": {"type": "refresh"},
    }
    if entry.get("isHidden") is True:
        doc["hidden"] = True
    doc["control"] = spec
    doc["legacyControlEntityId"] = entry["entityId"]
    return doc


def documents(
    entries: Any,
    owner_watch_id: str,
    slot_index: Callable[[str], int] = lambda _entity_id: 0,
) -> list[dict[str, Any]]:
    """Every movable entry as a document, in list order. ``slot_index`` gives
    each entry's seat by entity id."""
    found: list[dict[str, Any]] = []
    for entry in movable(entries):
        doc = document(entry, owner_watch_id, slot_index(entry["entityId"]))
        if doc is not None:
            found.append(doc)
    return found


def free_slots(count: int, held: set[int]) -> list[int]:
    """``count`` distinct seats for new controls, lowest first, or fewer when
    the owner has no room left.

    A seat is free when it is not in ``held``: the seats of the owner's live
    records, whatever they draw. The store gives a control the pseudo shape
    ``control``, so two controls at one seat clash; a seat no live record
    holds never does. ``ControlCenterHandover.slots``.
    """
    if count <= 0:
        return []
    return [slot for slot in range(COMPLICATION_MAX_SLOTS) if slot not in held][:count]


# ── the runner ────────────────────────────────────────────────────────────


def _held_seats(records: list[Any]) -> set[int]:
    """The seats the owner's live records hold. A seat that is not a whole
    number holds nothing (the store reads it the same way)."""
    held: set[int] = set()
    for record in records:
        slot = (record.document or {}).get("slotIndex")
        if isinstance(slot, int) and not isinstance(slot, bool):
            held.add(slot)
    return held


class ControlCenterMover:
    """Runs the move for one owner at a time, on its own turn of the loop.

    ``schedule`` runs a job later on the event loop (setup passes
    ``hass.loop.call_soon``), so a save that triggers a move returns first,
    and the setup pass costs one short job per owner rather than one long
    one. ``is_paired`` answers whether an owner id is a paired watch.
    """

    def __init__(
        self,
        complication_store: Any,
        watch_config_store: Any,
        *,
        is_paired: Callable[[str], bool],
        schedule: Callable[[Callable[[], None]], Any],
    ) -> None:
        self._complications = complication_store
        self._watch_config = watch_config_store
        self._is_paired = is_paired
        self._schedule = schedule
        self._pending: set[str] = set()
        self._closed = False

    def close(self) -> None:
        """Stop: a job still waiting does nothing. Called on unload."""
        self._closed = True
        self._pending.clear()

    def schedule_all(self) -> None:
        """Queue a run for every owner that holds a Control Center list."""
        try:
            owners = self._watch_config.owners()
        except Exception:
            _LOGGER.exception("Control Center move: could not list the owners")
            return
        for owner in owners:
            self.schedule_owner(owner)

    def schedule_owner(self, owner_watch_id: str) -> None:
        """Queue one owner's run, once however often it is asked for before
        it runs."""
        if self._closed or owner_watch_id in self._pending:
            return
        self._pending.add(owner_watch_id)
        try:
            self._schedule(lambda: self._run_queued(owner_watch_id))
        except Exception:
            self._pending.discard(owner_watch_id)
            _LOGGER.exception(
                "Control Center move: could not queue the run for %s", owner_watch_id
            )

    def watch_config_changed(self, change: WatchConfigChange) -> None:
        """The watch config store's listener: a save of an owner's
        ``control_center`` record queues that owner's run. Revision 0 is a
        forget (or the old id of a move), which has nothing to move."""
        if change.kind == CONTROL_CENTER_KIND and change.revision > 0:
            self.schedule_owner(change.owner_watch_id)

    def _run_queued(self, owner_watch_id: str) -> None:
        self._pending.discard(owner_watch_id)
        if self._closed:
            return
        try:
            self.run_owner(owner_watch_id)
        except Exception:
            _LOGGER.exception("Control Center move failed for %s", owner_watch_id)

    def run_owner(self, owner_watch_id: str) -> list[str]:
        """Move one owner's list now. Returns the ids of the records created.

        Nothing for an owner that is not a paired watch, a forgotten one, one
        whose stores could not be read, or one with no list. Each document
        that fails (a validation refusal, a conflict) is logged and the rest
        still go.
        """
        if getattr(self._complications, "load_failed", False):
            return []
        if not self._is_paired(owner_watch_id):
            return []
        if self._complications.is_forgotten(owner_watch_id):
            return []
        try:
            record = self._watch_config.get(owner_watch_id, CONTROL_CENTER_KIND)
        except WatchConfigStoreError:
            return []
        if record is None or not isinstance(record.document, dict):
            return []

        candidates = [
            entry
            for entry in movable(record.document.get(_ENTRIES_KEY))
            # Live or tombstoned: either way this entry has been moved before,
            # and a delete is final.
            if self._complications.get(
                owner_watch_id, document_id(owner_watch_id, entry["entityId"])
            )
            is None
        ]
        if not candidates:
            return []

        live = self._complications.list(owner_watch_id)
        room = max(COMPLICATION_MAX_PER_OWNER - len(live), 0)
        seats = free_slots(min(len(candidates), room), _held_seats(live))
        if len(seats) < len(candidates):
            _LOGGER.info(
                "Control Center move for %s: %d of %d control(s) have no room "
                "(%d free seat(s), %d of %d complications used); they stay on "
                "the old list",
                owner_watch_id,
                len(candidates) - len(seats),
                len(candidates),
                len(free_slots(COMPLICATION_MAX_SLOTS, _held_seats(live))),
                len(live),
                COMPLICATION_MAX_PER_OWNER,
            )

        created: list[str] = []
        for entry, seat in zip(candidates, seats, strict=False):
            doc = document(entry, owner_watch_id, seat)
            if doc is None:
                continue
            try:
                saved = self._complications.save(
                    owner_watch_id, doc, base_revision=None, updated_by=UPDATED_BY
                )
            except ComplicationStoreError as err:
                _LOGGER.warning(
                    "Control Center move for %s could not create the control "
                    "for %s: %s",
                    owner_watch_id,
                    entry["entityId"],
                    err,
                )
                continue
            created.append(saved.id)
        if created:
            _LOGGER.info(
                "Control Center move for %s created %d control(s)",
                owner_watch_id,
                len(created),
            )
        return created
