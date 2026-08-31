"""Pure-unit tests for ComplicationStore (custom watch complications).

In-process, no HA instance, same stub-and-load pattern as
test_notification_tokens.py. Covers the guarantees the HA-owned editor design
depends on: revision checks on save and delete, tombstones surviving a
restart, owner separation, the collection token, envelope validation, and
restore refusing to overwrite live data.
"""

from __future__ import annotations

import asyncio
import contextlib
import copy
import importlib.util
import sys
import types
import uuid
from pathlib import Path

import pytest

_STORE_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "complication_store.py"
)

_PKG = "wa_compl_test_pkg"

# Deliberately smaller than production (64) so the cap tests stay a handful of
# saves; the store only ever reads the injected constant.
MAX_PER_OWNER = 8
MAX_SLOTS = 64
MAX_LAYERS = 64
MAX_BYTES = 4096
MAX_SCHEMA = 5


class _FakeStore:
    """Stand-in for homeassistant.helpers.storage.Store that keeps the last
    serialized payload in memory so a "restart" can reload it."""

    saved: dict | None = None

    def __init__(self, *args: object, **kwargs: object) -> None:
        pass

    async def async_load(self):
        return copy.deepcopy(_FakeStore.saved)

    def async_delay_save(self, serialize, *_args: object, **_kwargs: object) -> None:
        _FakeStore.saved = copy.deepcopy(serialize())

    async def async_remove(self) -> None:
        _FakeStore.saved = None


@contextlib.contextmanager
def _loaded_module():
    saved_modules = dict(sys.modules)
    _FakeStore.saved = None
    try:

        def stub(name: str, **attrs: object) -> None:
            module = sys.modules.get(name) or types.ModuleType(name)
            for key, value in attrs.items():
                setattr(module, key, value)
            sys.modules[name] = module

        stub("homeassistant")
        stub("homeassistant.helpers")
        stub("homeassistant.helpers.storage", Store=_FakeStore)
        stub(
            "homeassistant.core",
            HomeAssistant=type("HomeAssistant", (), {}),
            callback=lambda f: f,
        )

        pkg = types.ModuleType(_PKG)
        pkg.__path__ = []
        sys.modules[_PKG] = pkg
        stub(
            f"{_PKG}.const",
            COMPLICATION_STORAGE_KEY="wrist_assistant.custom_complications",
            COMPLICATION_STORAGE_VERSION=1,
            COMPLICATION_MAX_SCHEMA_VERSION=MAX_SCHEMA,
            COMPLICATION_MAX_DOCUMENT_BYTES=MAX_BYTES,
            COMPLICATION_MAX_LAYERS=MAX_LAYERS,
            COMPLICATION_MAX_PER_OWNER=MAX_PER_OWNER,
            COMPLICATION_MAX_SLOTS=MAX_SLOTS,
        )

        spec = importlib.util.spec_from_file_location(
            f"{_PKG}.complication_store", _STORE_PATH
        )
        module = importlib.util.module_from_spec(spec)
        sys.modules[f"{_PKG}.complication_store"] = module
        spec.loader.exec_module(module)
        yield module
    finally:
        for key in list(sys.modules):
            if key not in saved_modules:
                del sys.modules[key]
        sys.modules.update(saved_modules)


@pytest.fixture
def mod():
    with _loaded_module() as module:
        yield module


def _doc(**overrides) -> dict:
    doc = {
        "schemaVersion": 4,
        "id": str(uuid.uuid4()).upper(),
        "name": "Garage",
        "values": [],
        "elements": [{"kind": "text"}],
        "slotIndex": 0,
        "supportedFamilies": ["rectangular", "circular", "corner"],
        "perFamily": {},
        "dataSources": [],
        "refreshMinutes": 0,
        "tapAction": {"type": "refresh"},
    }
    doc.update(overrides)
    return doc


def _new(mod):
    store = mod.ComplicationStore(object())
    asyncio.run(store.async_load())
    return store


OWNER = "watch-A"
OTHER = "watch-B"


# ── save / revision ────────────────────────────────────────────────────────


def test_first_save_is_revision_one(mod):
    store = _new(mod)
    rec = store.save(OWNER, _doc(), base_revision=None, updated_by="t")
    assert rec.revision == 1
    assert rec.token == 1
    assert rec.deleted is False
    assert store.token == 1
    assert store.owner_token(OWNER) == 1


def test_save_with_matching_base_revision_increments(mod):
    store = _new(mod)
    doc = _doc()
    rec = store.save(OWNER, doc, base_revision=None, updated_by="t")
    doc2 = dict(doc, name="Garage 2")
    rec2 = store.save(OWNER, doc2, base_revision=rec.revision, updated_by="t")
    assert rec2.revision == 2
    assert rec2.token == 2
    assert store.get(OWNER, doc["id"]).document["name"] == "Garage 2"


def test_stale_base_revision_conflicts_and_stores_nothing(mod):
    store = _new(mod)
    doc = _doc()
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    store.save(OWNER, dict(doc, name="v2"), base_revision=1, updated_by="t")
    with pytest.raises(mod.ComplicationConflictError) as exc:
        store.save(OWNER, dict(doc, name="stale"), base_revision=1, updated_by="t")
    assert exc.value.current.revision == 2
    assert store.get(OWNER, doc["id"]).document["name"] == "v2"
    assert store.token == 2


def test_new_id_with_nonzero_base_revision_conflicts(mod):
    store = _new(mod)
    with pytest.raises(mod.ComplicationConflictError):
        store.save(OWNER, _doc(), base_revision=3, updated_by="t")


def test_id_is_normalized_to_uppercase(mod):
    store = _new(mod)
    doc = _doc(id=str(uuid.uuid4()).lower())
    rec = store.save(OWNER, doc, base_revision=None, updated_by="t")
    assert rec.id == doc["id"].upper()
    assert store.get(OWNER, doc["id"].upper()) is rec


def test_per_owner_cap(mod):
    store = _new(mod)
    for i in range(MAX_PER_OWNER):
        store.save(OWNER, _doc(slotIndex=i), base_revision=None, updated_by="t")
    with pytest.raises(mod.ComplicationValidationError):
        store.save(OWNER, _doc(), base_revision=None, updated_by="t")
    # A tombstone frees a slot.
    first = store.list(OWNER)[0]
    store.delete(OWNER, first.id, base_revision=first.revision, updated_by="t")
    store.save(OWNER, _doc(), base_revision=None, updated_by="t")


# ── delete / tombstones ────────────────────────────────────────────────────


def test_delete_writes_tombstone_with_new_revision(mod):
    store = _new(mod)
    doc = _doc()
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    tomb = store.delete(OWNER, doc["id"], base_revision=1, updated_by="t")
    assert tomb.deleted is True
    assert tomb.revision == 2
    assert tomb.document is None
    assert store.list(OWNER) == []
    assert [r.id for r in store.list(OWNER, include_deleted=True)] == [doc["id"]]


def test_delete_with_stale_revision_conflicts(mod):
    store = _new(mod)
    doc = _doc()
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    store.save(OWNER, doc, base_revision=1, updated_by="t")
    with pytest.raises(mod.ComplicationConflictError):
        store.delete(OWNER, doc["id"], base_revision=1, updated_by="t")
    assert store.get(OWNER, doc["id"]).deleted is False


def test_delete_is_idempotent(mod):
    store = _new(mod)
    doc = _doc()
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    tomb = store.delete(OWNER, doc["id"], base_revision=1, updated_by="t")
    again = store.delete(OWNER, doc["id"], base_revision=None, updated_by="t")
    assert again is tomb
    assert store.token == 2


def test_delete_unknown_raises_not_found(mod):
    store = _new(mod)
    with pytest.raises(mod.ComplicationNotFoundError):
        store.delete(OWNER, str(uuid.uuid4()), base_revision=None, updated_by="t")


def test_stale_replica_cannot_resurrect_a_tombstone(mod):
    """A client that still holds revision 1 must not be able to re-save an
    old draft over a tombstone; it needs the tombstone's revision."""
    store = _new(mod)
    doc = _doc()
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    store.delete(OWNER, doc["id"], base_revision=1, updated_by="t")
    with pytest.raises(mod.ComplicationConflictError):
        store.save(OWNER, doc, base_revision=1, updated_by="t")
    with pytest.raises(mod.ComplicationConflictError):
        store.save(OWNER, doc, base_revision=None, updated_by="t")
    revived = store.save(OWNER, doc, base_revision=2, updated_by="t")
    assert revived.deleted is False
    assert revived.revision == 3


# ── owner separation ───────────────────────────────────────────────────────


def test_owners_are_isolated(mod):
    store = _new(mod)
    doc = _doc()
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    assert store.get(OTHER, doc["id"]) is None
    assert store.list(OTHER) == []
    assert store.is_empty(OTHER)
    assert not store.is_empty(OWNER)
    # Same id under another owner is an independent record.
    rec = store.save(OTHER, doc, base_revision=None, updated_by="t")
    assert rec.revision == 1
    assert store.owners() == [OWNER, OTHER]
    with pytest.raises(mod.ComplicationNotFoundError):
        store.delete("watch-C", doc["id"], base_revision=None, updated_by="t")


# ── change token / sync ────────────────────────────────────────────────────


def test_changes_since_returns_only_newer_records_in_token_order(mod):
    store = _new(mod)
    a, b, c = _doc(slotIndex=0), _doc(slotIndex=1), _doc(slotIndex=2)
    store.save(OWNER, a, base_revision=None, updated_by="t")  # token 1
    store.save(OWNER, b, base_revision=None, updated_by="t")  # token 2
    store.save(OTHER, c, base_revision=None, updated_by="t")  # token 3
    store.save(OWNER, dict(a, name="x"), base_revision=1, updated_by="t")  # token 4
    store.delete(OWNER, b["id"], base_revision=1, updated_by="t")  # token 5

    full = store.changes_since(OWNER, 0)
    assert [r.token for r in full] == [4, 5]
    assert {r.id for r in full} == {a["id"], b["id"]}

    delta = store.changes_since(OWNER, 4)
    assert [(r.id, r.deleted) for r in delta] == [(b["id"], True)]

    assert store.changes_since(OWNER, 5) == []
    assert store.owner_token(OWNER) == 5
    assert store.owner_token(OTHER) == 3
    assert store.token == 5


def test_listener_fires_on_every_commit(mod):
    store = _new(mod)
    seen = []
    # Capture values at call time: the record object is live and later commits
    # mutate it in place, which is fine for the WS layer (it serializes
    # synchronously) but would make a stored reference misleading here.
    remove = store.async_add_listener(
        lambda change: seen.append(
            (change.owner_watch_id, change.token, change.record.deleted)
        )
    )
    doc = _doc()
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    store.delete(OWNER, doc["id"], base_revision=1, updated_by="t")
    assert seen == [
        (OWNER, 1, False),
        (OWNER, 2, True),
    ]
    remove()
    store.save(OWNER, doc, base_revision=2, updated_by="t")
    assert len(seen) == 2


# ── persistence / restart ──────────────────────────────────────────────────


def test_tombstones_and_token_survive_restart(mod):
    store = _new(mod)
    a, b = _doc(slotIndex=0), _doc(slotIndex=1)
    store.save(OWNER, a, base_revision=None, updated_by="t")
    store.save(OWNER, b, base_revision=None, updated_by="t")
    store.delete(OWNER, b["id"], base_revision=1, updated_by="t")

    reloaded = _new(mod)
    assert reloaded.token == 3
    assert [r.id for r in reloaded.list(OWNER)] == [a["id"]]
    tomb = reloaded.get(OWNER, b["id"])
    assert tomb.deleted and tomb.revision == 2 and tomb.token == 3
    # Next commit continues the token sequence, never reuses one.
    rec = reloaded.save(OWNER, _doc(slotIndex=2), base_revision=None, updated_by="t")
    assert rec.token == 4


def test_load_skips_malformed_rows_and_heals_token(mod):
    good = _doc()
    _FakeStore.saved = {
        "token": 1,  # behind the record below; must heal upward
        "records": [
            {
                "id": good["id"],
                "ownerWatchId": OWNER,
                "revision": 3,
                "token": 7,
                "deleted": False,
                "document": good,
            },
            {"id": "broken"},
            "not a dict",
            {"id": "X", "ownerWatchId": OWNER, "revision": 1, "deleted": False},
        ],
    }
    store = _new(mod)
    assert store.token == 7
    assert [r.id for r in store.list(OWNER)] == [good["id"]]


# ── preset-slot report ─────────────────────────────────────────────────────


def test_presets_round_trip_and_survive_restart(mod):
    store = _new(mod)
    assert store.presets(OWNER) == []
    assert (
        store.set_presets(
            OWNER,
            [{"slot": 5, "name": "Garage"}, {"slot": 0, "name": " Battery "}],
        )
        is True
    )
    # Sorted by slot, names trimmed.
    assert store.presets(OWNER) == [
        {"slot": 0, "name": "Battery"},
        {"slot": 5, "name": "Garage"},
    ]
    assert store.preset_slots(OWNER) == [0, 5]
    # Same report again says unchanged.
    assert (
        store.set_presets(
            OWNER, [{"slot": 0, "name": "Battery"}, {"slot": 5, "name": "Garage"}]
        )
        is False
    )

    reloaded = _new(mod)
    assert reloaded.presets(OWNER) == [
        {"slot": 0, "name": "Battery"},
        {"slot": 5, "name": "Garage"},
    ]
    assert reloaded.presets(OTHER) == []


def test_presets_drop_junk_and_clear_on_empty(mod):
    store = _new(mod)
    # Booleans, strings, negatives, off-the-end slots and duplicate slots all
    # drop or collapse; bare ints (pre-release report shape) still count with
    # an empty name. Advisory report, not a validation gate.
    store.set_presets(
        OWNER,
        [
            True,
            "3",
            {"slot": 1.5, "name": "x"},
            {"slot": -1, "name": "x"},
            {"slot": MAX_SLOTS, "name": "x"},
            {"slot": 4, "name": "Lamp"},
            {"slot": 4, "name": "dupe loses"},
            {"slot": 6, "name": 12},
            2,
        ],
    )
    assert store.presets(OWNER) == [
        {"slot": 2, "name": ""},
        {"slot": 4, "name": "Lamp"},
        {"slot": 6, "name": ""},
    ]
    assert store.set_presets(OWNER, []) is True
    assert store.presets(OWNER) == []

    reloaded = _new(mod)
    assert reloaded.presets(OWNER) == []


def test_presets_load_accepts_legacy_bare_slots_and_ignores_junk(mod):
    # "presetSlots" with bare ints is what a short-lived pre-release build
    # wrote to disk; it must load as presets with empty names.
    _FakeStore.saved = {
        "token": 0,
        "presetSlots": {
            OWNER: [1, "x", MAX_SLOTS, 3],
            OTHER: "not a list",
            7: [1],
        },
        "records": [],
    }
    store = _new(mod)
    assert store.presets(OWNER) == [{"slot": 1, "name": ""}, {"slot": 3, "name": ""}]
    assert store.presets(OTHER) == []


# ── validation ─────────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    "mutate",
    [
        lambda d: d.pop("id"),
        lambda d: d.update(id="not-a-uuid"),
        lambda d: d.update(name="   "),
        lambda d: d.update(slotIndex=MAX_SLOTS),
        # slot above 7 without the schema-5 marker: an old app would silently
        # drop it, so the store refuses the combination outright.
        lambda d: d.update(slotIndex=8),
        lambda d: d.update(slotIndex=True),
        lambda d: d.update(supportedFamilies=[]),
        lambda d: d.update(supportedFamilies=["square"]),
        lambda d: d.pop("perFamily"),
        lambda d: d.pop("tapAction"),
        lambda d: d.pop("schemaVersion"),
        lambda d: d.update(schemaVersion=MAX_SCHEMA + 1),
        lambda d: d.update(schemaVersion=0),
        lambda d: d.update(elements="nope"),
        lambda d: d.update(elements=[1]),
        lambda d: d.update(elements=[{}] * (MAX_LAYERS + 1)),
        lambda d: d.update(refreshMinutes=True),
        lambda d: d.update(name="x" * MAX_BYTES),
    ],
)
def test_invalid_documents_are_refused(mod, mutate):
    store = _new(mod)
    doc = _doc()
    mutate(doc)
    with pytest.raises(mod.ComplicationValidationError):
        store.save(OWNER, doc, base_revision=None, updated_by="t")
    assert store.token == 0


def test_high_slots_are_valid_with_the_schema_marker(mod):
    """Slots above the original 8 save fine once the document says schema 5."""
    store = _new(mod)
    store.save(OWNER, _doc(slotIndex=8, schemaVersion=5), base_revision=None, updated_by="t")
    top = _doc(slotIndex=MAX_SLOTS - 1, schemaVersion=5)
    rec = store.save(OWNER, top, base_revision=None, updated_by="t")
    assert rec.document["slotIndex"] == MAX_SLOTS - 1


def test_document_is_stored_unchanged(mod):
    store = _new(mod)
    doc = _doc(extraFutureField={"nested": [1, 2, 3]})
    rec = store.save(OWNER, doc, base_revision=None, updated_by="t")
    assert rec.document == doc


def test_non_dict_document_is_refused(mod):
    store = _new(mod)
    with pytest.raises(mod.ComplicationValidationError):
        store.save(OWNER, ["list"], base_revision=None, updated_by="t")
    with pytest.raises(mod.ComplicationValidationError):
        store.save("", _doc(), base_revision=None, updated_by="t")


# ── restore ────────────────────────────────────────────────────────────────


def test_restore_seeds_empty_owner(mod):
    store = _new(mod)
    a, b = _doc(slotIndex=0), _doc(slotIndex=1)
    records = store.restore(OWNER, [a, b], updated_by="ios")
    assert [r.revision for r in records] == [1, 1]
    assert len(store.list(OWNER)) == 2


def test_restore_refuses_when_owner_has_live_records(mod):
    store = _new(mod)
    store.save(OWNER, _doc(), base_revision=None, updated_by="t")
    with pytest.raises(mod.ComplicationConflictError):
        store.restore(OWNER, [_doc()], updated_by="ios")
    assert len(store.list(OWNER)) == 1


def test_restore_is_all_or_nothing(mod):
    store = _new(mod)
    with pytest.raises(mod.ComplicationValidationError):
        store.restore(OWNER, [_doc(), _doc(slotIndex=MAX_SLOTS)], updated_by="ios")
    assert store.is_empty(OWNER)
    assert store.token == 0


def test_restore_over_tombstones_bumps_revision(mod):
    store = _new(mod)
    doc = _doc()
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    store.delete(OWNER, doc["id"], base_revision=1, updated_by="t")
    assert store.is_empty(OWNER)
    [rec] = store.restore(OWNER, [doc], updated_by="ios")
    assert rec.revision == 3
    assert rec.deleted is False


# ── move_owner (the reinstall recovery path) ───────────────────────────────


def test_move_owner_rekeys_live_records_and_tombstones_the_source(mod):
    store = _new(mod)
    a, b = _doc(slotIndex=0, name="Garage"), _doc(slotIndex=1, name="Lights")
    store.save(OWNER, a, base_revision=None, updated_by="t")
    store.save(OWNER, b, base_revision=None, updated_by="t")

    moved = store.move_owner(OWNER, OTHER, updated_by="panel")

    assert [r.owner_watch_id for r in moved] == [OTHER, OTHER]
    assert {r.id for r in moved} == {a["id"], b["id"]}
    assert [r.revision for r in moved] == [1, 1]
    assert [r.updated_by for r in moved] == ["panel", "panel"]
    assert [r.document["name"] for r in store.list(OTHER)] == ["Garage", "Lights"]
    # The source keeps a tombstone per record so a replica still holding the
    # old owner sees them go rather than keeping its copies.
    assert store.list(OWNER) == []
    assert store.is_empty(OWNER)
    tombs = store.list(OWNER, include_deleted=True)
    assert [(r.deleted, r.revision, r.document) for r in tombs] == [
        (True, 2, None),
        (True, 2, None),
    ]
    # Every commit took a token, target copy and source tombstone alike.
    assert store.token == 6


def test_move_owner_copies_the_document_rather_than_sharing_it(mod):
    store = _new(mod)
    doc = _doc(elements=[{"kind": "text"}])
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    [moved] = store.move_owner(OWNER, OTHER, updated_by="panel")
    moved.document["name"] = "renamed after the move"
    assert store.get(OWNER, doc["id"]).document is None
    assert store.get(OTHER, doc["id"]).document["name"] == "renamed after the move"


def test_move_owner_continues_the_revision_the_target_already_has(mod):
    store = _new(mod)
    doc = _doc(name="from the old watch")
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    # The target holds the same id already, at revision 2.
    store.save(OTHER, doc, base_revision=None, updated_by="t")
    store.save(OTHER, dict(doc, name="the target's own"), base_revision=1, updated_by="t")

    [moved] = store.move_owner(OWNER, OTHER, updated_by="panel")

    assert moved.revision == 3
    assert moved.document["name"] == "from the old watch"


def test_move_owner_continues_over_a_tombstone_at_the_target(mod):
    store = _new(mod)
    doc = _doc()
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    store.save(OTHER, doc, base_revision=None, updated_by="t")
    store.delete(OTHER, doc["id"], base_revision=1, updated_by="t")

    [moved] = store.move_owner(OWNER, OTHER, updated_by="panel")

    assert moved.revision == 3
    assert moved.deleted is False


def test_move_owner_refuses_a_slot_the_target_already_uses(mod):
    store = _new(mod)
    store.save(OWNER, _doc(slotIndex=2), base_revision=None, updated_by="t")
    store.save(OTHER, _doc(slotIndex=2), base_revision=None, updated_by="t")
    with pytest.raises(mod.ComplicationValidationError) as exc:
        store.move_owner(OWNER, OTHER, updated_by="panel")
    # Slots read from 1 for a human, so slotIndex 2 is "slot 3".
    assert "slot 3" in str(exc.value)
    assert store.token == 2
    assert len(store.list(OWNER)) == 1
    assert len(store.list(OTHER)) == 1


def test_move_owner_ignores_a_slot_held_by_the_record_it_overwrites(mod):
    """The target's copy of a moving id is replaced, so it is not in the way."""
    store = _new(mod)
    doc = _doc(slotIndex=3)
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    store.save(OTHER, doc, base_revision=None, updated_by="t")
    [moved] = store.move_owner(OWNER, OTHER, updated_by="panel")
    assert moved.revision == 2
    assert len(store.list(OTHER)) == 1


def test_move_owner_refuses_when_the_target_would_go_over_the_cap(mod):
    store = _new(mod)
    for i in range(5):
        store.save(OWNER, _doc(slotIndex=i), base_revision=None, updated_by="t")
    for i in range(4):
        store.save(OTHER, _doc(slotIndex=i), base_revision=None, updated_by="t")
    with pytest.raises(mod.ComplicationValidationError) as exc:
        store.move_owner(OWNER, OTHER, updated_by="panel")
    assert str(MAX_PER_OWNER) in str(exc.value)
    assert store.token == 9
    assert len(store.list(OWNER)) == 5
    assert len(store.list(OTHER)) == 4


def test_move_owner_refuses_the_same_watch(mod):
    store = _new(mod)
    store.save(OWNER, _doc(), base_revision=None, updated_by="t")
    with pytest.raises(mod.ComplicationValidationError):
        store.move_owner(OWNER, OWNER, updated_by="panel")
    assert store.token == 1
    assert len(store.list(OWNER)) == 1


def test_move_owner_refuses_an_owner_with_nothing_live(mod):
    store = _new(mod)
    doc = _doc()
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    store.delete(OWNER, doc["id"], base_revision=1, updated_by="t")
    with pytest.raises(mod.ComplicationNotFoundError):
        store.move_owner(OWNER, OTHER, updated_by="panel")
    with pytest.raises(mod.ComplicationNotFoundError):
        store.move_owner("watch-never-seen", OTHER, updated_by="panel")
    assert store.token == 2


def test_move_owner_survives_a_restart(mod):
    store = _new(mod)
    doc = _doc(name="Garage")
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    store.move_owner(OWNER, OTHER, updated_by="panel")

    reloaded = _new(mod)
    assert [r.document["name"] for r in reloaded.list(OTHER)] == ["Garage"]
    assert reloaded.list(OWNER) == []
    assert reloaded.get(OWNER, doc["id"]).deleted is True
    assert reloaded.token == 3
