"""Pure-unit tests for ComplicationStore (custom watch complications).

In-process, no HA instance, same stub-and-load pattern as
test_notification_tokens.py. Covers the guarantees the HA-owned editor design
depends on: revision checks on save and delete, tombstones surviving a
restart, owner separation, the collection token, envelope validation, and
restore refusing to overwrite live data.
"""

from __future__ import annotations

import ast
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
MAX_SCHEMA = 8


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


# ── page report ────────────────────────────────────────────────────────────

PAGE_A = "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE"
PAGE_B = "11111111-2222-3333-4444-555555555555"


def test_pages_round_trip_and_survive_restart(mod):
    store = _new(mod)
    assert store.pages(OWNER) == []
    report = [
        {"id": PAGE_A, "name": " Upstairs "},
        {"id": PAGE_B, "name": "Garage"},
    ]
    assert store.set_pages(OWNER, report) is True
    # Watch order preserved (not sorted), names trimmed.
    assert store.pages(OWNER) == [
        {"id": PAGE_A, "name": "Upstairs"},
        {"id": PAGE_B, "name": "Garage"},
    ]
    # Same report again says unchanged.
    assert (
        store.set_pages(
            OWNER,
            [{"id": PAGE_A, "name": "Upstairs"}, {"id": PAGE_B, "name": "Garage"}],
        )
        is False
    )

    reloaded = _new(mod)
    assert reloaded.pages(OWNER) == [
        {"id": PAGE_A, "name": "Upstairs"},
        {"id": PAGE_B, "name": "Garage"},
    ]
    assert reloaded.pages(OTHER) == []


def test_pages_drop_junk_and_clear_on_empty(mod):
    store = _new(mod)
    store.set_pages(
        OWNER,
        [
            True,
            "not a dict",
            {"id": 5, "name": "x"},
            {"id": "not-a-uuid", "name": "x"},
            {"id": PAGE_A.lower(), "name": "Upstairs"},  # id normalizes upper
            {"id": PAGE_A, "name": "dupe loses"},
            {"id": PAGE_B, "name": 12},  # non-string name empties
        ],
    )
    assert store.pages(OWNER) == [
        {"id": PAGE_A, "name": "Upstairs"},
        {"id": PAGE_B, "name": ""},
    ]
    assert store.set_pages(OWNER, []) is True
    assert store.pages(OWNER) == []

    reloaded = _new(mod)
    assert reloaded.pages(OWNER) == []


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
        # A nested list is unhashable, so the membership test used to raise
        # TypeError straight out of the validator instead of "invalid".
        lambda d: d.update(supportedFamilies=[["rectangular"]]),
        lambda d: d.update(supportedFamilies=[{"a": 1}]),
        lambda d: d.update(supportedFamilies=["rectangular", "circular", "corner", 7]),
        # Home Screen shapes the panel never writes.
        lambda d: d.update(schemaVersion=7, supportedFamilies=["xsmall"]),
        lambda d: d.update(schemaVersion=7, supportedFamilies=["systemSmall"]),
        lambda d: d.update(schemaVersion=7, supportedFamilies=["rectangular", "Small"]),
        # An iPhone Home Screen shape needs the schema-7 marker, so an app that
        # predates it skips the document instead of drawing a shape it lacks.
        lambda d: d.update(schemaVersion=6, supportedFamilies=["small"]),
        lambda d: d.update(schemaVersion=6, supportedFamilies=["medium", "large"]),
        lambda d: d.update(
            schemaVersion=6,
            supportedFamilies=["rectangular", "circular", "corner", "xlarge"],
        ),
        lambda d: d.update(supportedFamilies=["rectangular", "circular", "corner", "small"]),
        # One shape or Inline needs the schema-6 marker (an old app would draw
        # the missing shapes from the shared layers, or "Custom" for Inline).
        lambda d: d.update(supportedFamilies=["rectangular"]),
        lambda d: d.update(supportedFamilies=["rectangular", "circular", "corner", "inline"],
                           inline={"value": {"kind": {"kind": "literal", "value": "x"}}}),
        # Inline and its object come as a pair, at schema 6.
        lambda d: d.update(schemaVersion=6, supportedFamilies=["inline"]),
        lambda d: d.update(schemaVersion=6, supportedFamilies=["inline"], inline={}),
        lambda d: d.update(schemaVersion=6, supportedFamilies=["inline"], inline="on"),
        lambda d: d.update(schemaVersion=6, inline={"value": {"kind": {"kind": "literal", "value": "x"}}}),
        lambda d: d.pop("perFamily"),
        lambda d: d.pop("tapAction"),
        lambda d: d.pop("schemaVersion"),
        lambda d: d.update(schemaVersion=MAX_SCHEMA + 1),
        lambda d: d.update(schemaVersion=0),
        lambda d: d.update(elements="nope"),
        lambda d: d.update(elements=[1]),
        lambda d: d.update(elements=[{}] * (MAX_LAYERS + 1)),
        lambda d: d.update(refreshMinutes=True),
        lambda d: d.update(openPageId=5),
        lambda d: d.update(openPageName=["x"]),
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


def _control() -> dict:
    return {
        "kind": "button",
        "title": {"kind": {"kind": "literal", "value": "Movie night"}},
        "symbol": "film",
        "action": {"type": "runScene", "entityId": "scene.movie", "displayName": "Movie", "domain": "scene"},
    }


def test_control_only_document_is_accepted(mod):
    """A control is drawn by Control Center, so a document that carries one
    may have no shapes at all (decided 2026-09-15). Empty stays refused
    without a control, which the parametrized case above still checks."""
    store = _new(mod)
    doc = _doc(schemaVersion=8, supportedFamilies=[], elements=[], control=_control())
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    saved = store.list(OWNER)[0].document
    assert saved["supportedFamilies"] == []
    assert saved["control"]["kind"] == "button"


@pytest.mark.parametrize(
    "control",
    [None, "button", ["button"], 7],
)
def test_empty_shapes_need_a_real_control(mod, control):
    store = _new(mod)
    doc = _doc(schemaVersion=8, supportedFamilies=[], elements=[], control=control)
    with pytest.raises(mod.ComplicationValidationError):
        store.save(OWNER, doc, base_revision=None, updated_by="t")


def test_open_page_fields_are_accepted(mod):
    """openPageId/openPageName ride along as plain optional strings."""
    store = _new(mod)
    doc = _doc()
    doc["tapAction"] = {"type": "openPage"}
    doc["openPageId"] = "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE"
    doc["openPageName"] = "Upstairs"
    rec = store.save(OWNER, doc, base_revision=None, updated_by="t")
    assert rec.document["openPageId"] == "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE"
    assert rec.document["openPageName"] == "Upstairs"


@pytest.mark.parametrize(
    "overrides",
    [
        dict(schemaVersion=6, supportedFamilies=["rectangular"]),
        dict(schemaVersion=6, supportedFamilies=["corner"]),
        dict(schemaVersion=6, supportedFamilies=["inline"],
             inline={"value": {"kind": {"kind": "literal", "value": "72°"}}}),
        dict(schemaVersion=6, supportedFamilies=["rectangular", "circular", "corner", "inline"],
             inline={"label": "Tea", "value": {"kind": {"kind": "literal", "value": "3 min"}},
                     "symbol": "timer", "countdown": True}),
        # Three canvas shapes and no Inline may still say 6; nothing forces 4.
        dict(schemaVersion=6),
        dict(schemaVersion=6, slotIndex=12, supportedFamilies=["circular"]),
    ],
)
def test_single_shape_and_inline_documents_save_at_schema_six(mod, overrides):
    """The per-shape contract (docs/custom_complication_family_kinds.md)."""
    store = _new(mod)
    rec = store.save(OWNER, _doc(**overrides), base_revision=None, updated_by="t")
    assert rec.document["supportedFamilies"] == overrides.get(
        "supportedFamilies", ["rectangular", "circular", "corner"]
    )
    assert rec.document.get("inline") == overrides.get("inline")


@pytest.mark.parametrize(
    "families",
    [
        ["small"],
        ["medium"],
        ["large"],
        ["xlarge"],
        ["small", "medium", "large", "xlarge"],
        # A phone document may mix its lock screen and Home Screen shapes.
        ["rectangular", "circular", "small", "medium"],
        # All eight names at once, the widest document the store accepts.
        ["rectangular", "circular", "corner", "small", "medium", "large", "xlarge"],
    ],
)
def test_home_screen_documents_save_at_schema_seven(mod, families):
    """The four iPhone Home Screen shapes ride the wire at schema 7."""
    store = _new(mod)
    rec = store.save(
        OWNER,
        _doc(schemaVersion=7, supportedFamilies=families),
        base_revision=None,
        updated_by="t",
    )
    assert rec.document["supportedFamilies"] == families
    assert rec.document["schemaVersion"] == 7


def test_home_screen_document_below_schema_seven_names_the_version(mod):
    """The refusal says which version the document needs, not just "invalid"."""
    store = _new(mod)
    with pytest.raises(mod.ComplicationValidationError) as err:
        store.save(
            OWNER,
            _doc(schemaVersion=6, supportedFamilies=["small"]),
            base_revision=None,
            updated_by="t",
        )
    assert "7" in str(err.value)


# ── the list layer ─────────────────────────────────────────────────────────


def _item_value(field: str = "title") -> dict:
    """A value that reads a field of the row being drawn."""
    return {"kind": {"kind": "item", "field": field}}


def _list_stat_value(layer: str = "L1", stat: str = "count") -> dict:
    """A value that reads a settled list's count, the `chartStat` pattern."""
    return {"kind": {"kind": "listStat", "layer": layer, "stat": stat}}


def _list_element(**payload_overrides) -> dict:
    payload = {
        "id": "L1",
        "source": {"kind": "calendar", "entities": ["calendar.work"], "hours": 24},
        "rows": 4,
        "template": [
            {"kind": "text", "payload": {"id": "R1", "value": _item_value()}},
        ],
    }
    payload.update(payload_overrides)
    return {"kind": "list", "payload": payload}


def test_a_list_document_saves_at_schema_eight(mod):
    store = _new(mod)
    doc = _doc(schemaVersion=8, elements=[_list_element()])
    rec = store.save(OWNER, doc, base_revision=None, updated_by="t")
    assert rec.document["elements"][0]["kind"] == "list"
    assert rec.document["schemaVersion"] == 8


@pytest.mark.parametrize(
    "overrides",
    [
        # Every source kind the contract lists, Jinja-rendered and fetched.
        dict(source={"kind": "entities", "scope": {"entities": ["light.a"]}}),
        dict(source={"kind": "attribute", "entityId": "group.x", "attribute": "entity_id"}),
        dict(source={"kind": "template", "value": "{{ [] | to_json }}"}),
        dict(source={"kind": "todo", "entities": ["todo.shopping"], "status": "open"}),
        dict(source={"kind": "forecast", "entity": "weather.home", "type": "hourly"}),
        # The row count and the template are both optional.
        dict(rows=None, template=None),
        dict(rows=1),
        dict(rows=12),
        dict(template=[]),
        dict(template=[{"kind": k, "payload": {}} for k in
                       ("text", "icon", "shape", "gauge", "image", "tap", "text", "icon")]),
        # An unhashable kind is not a forbidden kind; the deeper checks belong
        # to the resolvers, so the layer rides along rather than 500ing here.
        dict(template=[{"kind": {"nested": True}, "payload": {}}]),
    ],
)
def test_valid_list_layers_are_accepted(mod, overrides):
    store = _new(mod)
    element = _list_element()
    for key, value in overrides.items():
        if value is None:
            element["payload"].pop(key, None)
        else:
            element["payload"][key] = value
    rec = store.save(
        OWNER,
        _doc(schemaVersion=8, elements=[element]),
        base_revision=None,
        updated_by="t",
    )
    assert rec.revision == 1


@pytest.mark.parametrize(
    "element",
    [
        # A list with no payload at all.
        {"kind": "list"},
        {"kind": "list", "payload": []},
        # The source is what decides which items are drawn; a list without one
        # would draw nothing, and one naming a source no client knows is a
        # document from a future the store must not pass through.
        _list_element(source=None),
        _list_element(source="calendar"),
        _list_element(source={"kind": "logbook", "area": "kitchen"}),
        _list_element(source={}),
        # Rows are cells, clamped 1..12 everywhere else too.
        _list_element(rows=0),
        _list_element(rows=13),
        _list_element(rows=True),
        _list_element(rows="4"),
        # Nesting: a list inside a row has no cell arithmetic and no item
        # scope, and is the one shape the decoder cannot be made to survive.
        _list_element(template=[_list_element()]),
        # The chart family draws from its own fetched key, not from an item.
        _list_element(template=[{"kind": "chart", "payload": {}}]),
        _list_element(template=[{"kind": "timeline", "payload": {}}]),
        _list_element(template=[{"kind": "chartTimes", "payload": {}}]),
        _list_element(template=[{"kind": "chartDots", "payload": {}}]),
        _list_element(template=[{"kind": "chartGrid", "payload": {}}]),
        _list_element(template=[{"kind": "imageTime", "payload": {}}]),
        # Eight layers a row, twelve rows: 96 leaves is where the budget ends.
        _list_element(template=[{"kind": "text", "payload": {}}] * 9),
        _list_element(template={"kind": "text"}),
        _list_element(template=[{"kind": "text"}, "text"]),
        # A hand-written document can put an object where a kind name belongs.
        # Membership in a frozenset raises TypeError on one of those, and a
        # validator must answer "invalid" rather than 500 the panel.
        _list_element(source={"kind": {"nested": True}}),
        _list_element(source={"kind": ["calendar"]}),
    ],
)
def test_invalid_list_layers_are_refused(mod, element):
    store = _new(mod)
    with pytest.raises(mod.ComplicationValidationError):
        store.save(
            OWNER,
            _doc(schemaVersion=8, elements=[element]),
            base_revision=None,
            updated_by="t",
        )
    assert store.token == 0


@pytest.mark.parametrize(
    "overrides",
    [
        # The layer itself.
        dict(elements=[_list_element()]),
        # An `item` value in a row template, which is the whole point of one.
        dict(elements=[{"kind": "text", "payload": {"parts": [{"value": _item_value()}]}}]),
        # A `listStat` header outside the list, the `chartStat` pattern.
        dict(elements=[{"kind": "text", "payload": {"value": _list_stat_value()}}]),
        # A rule that reads the count, so "All done" can show at zero.
        dict(elements=[{"kind": "text", "payload": {
            "rules": [{"test": {"left": _list_stat_value(), "op": "eq", "right": "0"}}],
        }}]),
        # The top-level value pool.
        dict(values=[{"id": "V1", "value": _item_value()}]),
        # The Inline shape's text.
        dict(schemaVersion=6, supportedFamilies=["inline"], inline={"value": _item_value()}),
    ],
)
def test_a_document_that_mentions_a_list_needs_schema_eight(mod, overrides):
    """An app on 7 fails the document whole on the unknown value kind and
    shows "update the app". That is the intended behaviour, so the version has
    to say 8 rather than leaving the app to find out."""
    store = _new(mod)
    doc = _doc(**overrides)
    assert doc["schemaVersion"] < 8
    with pytest.raises(mod.ComplicationValidationError) as err:
        store.save(OWNER, doc, base_revision=None, updated_by="t")
    assert "8" in str(err.value)
    assert store.token == 0


def test_an_item_value_at_schema_eight_is_fine_anywhere(mod):
    store = _new(mod)
    doc = _doc(
        schemaVersion=8,
        elements=[
            _list_element(),
            {"kind": "text", "payload": {"value": _list_stat_value()}},
        ],
        values=[{"id": "V1", "value": _item_value("start")}],
    )
    rec = store.save(OWNER, doc, base_revision=None, updated_by="t")
    assert rec.revision == 1


def test_an_ordinary_document_still_saves_below_schema_eight(mod):
    """The walk must not find a list where there is none: every document
    written before this change keeps saving at the version it carries."""
    store = _new(mod)
    doc = _doc(
        schemaVersion=7,
        supportedFamilies=["small"],
        elements=[
            {"kind": "text", "payload": {"value": {"kind": {"kind": "literal", "value": "x"}}}},
            {"kind": "chart", "payload": {"id": "C1"}},
        ],
        values=[{"id": "V1", "value": {"kind": {"kind": "entityState", "entityId": "light.a"}}}],
    )
    rec = store.save(OWNER, doc, base_revision=None, updated_by="t")
    assert rec.document["schemaVersion"] == 7


def test_the_shipped_schema_ceiling_is_eight():
    """The store test stubs the constant, so read the real one too. Both the
    websocket listing and the v2 delta reply hand this number to their client,
    and a panel will not save a list document until it reads 8."""
    const = (
        Path(__file__).resolve().parents[1]
        / "custom_components"
        / "wrist_assistant"
        / "const.py"
    )
    tree = ast.parse(const.read_text(), filename=str(const))
    values = {
        target.id: node.value.value
        for node in tree.body
        if isinstance(node, ast.Assign) and isinstance(node.value, ast.Constant)
        for target in node.targets
        if isinstance(target, ast.Name)
    }
    assert values["COMPLICATION_MAX_SCHEMA_VERSION"] == MAX_SCHEMA == 8

    for name in ("complication_ws.py", "wa_v2_views.py"):
        source = (const.parent / name).read_text()
        assert '"max_schema_version": COMPLICATION_MAX_SCHEMA_VERSION' in source, name


def test_high_slots_are_valid_with_the_schema_marker(mod):
    """Slots above the original 8 save fine once the document says schema 5."""
    store = _new(mod)
    store.save(OWNER, _doc(slotIndex=8, schemaVersion=5), base_revision=None, updated_by="t")
    top = _doc(slotIndex=MAX_SLOTS - 1, schemaVersion=5)
    rec = store.save(OWNER, top, base_revision=None, updated_by="t")
    assert rec.document["slotIndex"] == MAX_SLOTS - 1


def test_hidden_flag_is_stored_and_flipping_it_is_a_normal_save(mod):
    """`hidden` rides along like any optional key, and a save that only flips
    it bumps the revision and token and notifies listeners like any other."""
    store = _new(mod)
    seen = []
    store.async_add_listener(seen.append)
    first = store.save(OWNER, _doc(), base_revision=None, updated_by="t")
    token = store.token
    same = first.document["id"]
    rec = store.save(OWNER, _doc(id=same, hidden=True), base_revision=first.revision, updated_by="t")
    assert rec.revision == 2
    assert rec.document["hidden"] is True
    assert rec.as_dict()["document"]["hidden"] is True
    assert store.token == token + 1
    assert len(seen) == 2
    assert [r.id for r in store.changes_since(OWNER, token)] == [rec.id]

    shown = store.save(OWNER, _doc(id=same), base_revision=rec.revision, updated_by="t")
    assert "hidden" not in shown.document


@pytest.mark.parametrize("value", ["true", 1, [True]])
def test_hidden_flag_must_be_a_bool(mod, value):
    store = _new(mod)
    with pytest.raises(mod.ComplicationValidationError):
        store.save(OWNER, _doc(hidden=value), base_revision=None, updated_by="t")


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


# ── occupied report (presets + other homes' customs) ─────────────────────


def test_occupied_round_trip_derives_presets_and_survives_restart(mod):
    store = _new(mod)
    assert store.occupied(OWNER) == []
    report = [
        {"slot": 9, "name": "Comp 1", "kind": "custom", "home": "Cabin"},
        {"slot": 2, "name": " Lamp ", "kind": "preset", "home": " Home "},
        {"slot": 4, "name": "No kind"},
    ]
    assert store.set_occupied(OWNER, report) is True
    # Sorted by slot, trimmed, missing kind reads as preset.
    assert store.occupied(OWNER) == [
        {"slot": 2, "name": "Lamp", "kind": "preset", "home": "Home"},
        {"slot": 4, "name": "No kind", "kind": "preset", "home": ""},
        {"slot": 9, "name": "Comp 1", "kind": "custom", "home": "Cabin"},
    ]
    # The preset rows are derived, so every reader of presets() still works.
    assert store.presets(OWNER) == [{"slot": 2, "name": "Lamp"}, {"slot": 4, "name": "No kind"}]
    assert store.preset_slots(OWNER) == [2, 4]
    assert store.set_occupied(OWNER, report) is False

    reloaded = _new(mod)
    assert reloaded.occupied(OWNER)[2]["home"] == "Cabin"
    assert reloaded.presets(OWNER) == [{"slot": 2, "name": "Lamp"}, {"slot": 4, "name": "No kind"}]
    assert reloaded.occupied(OTHER) == []


def test_occupied_keeps_a_custom_rows_families(mod):
    # A per-shape watch says which shapes each foreign custom draws. Sorted,
    # unknown names dropped, and the key left out when nothing usable came.
    store = _new(mod)
    store.set_occupied(
        OWNER,
        [
            {"slot": 1, "name": "A", "kind": "custom", "home": "Cabin", "families": ["inline", "rectangular", "inline"]},
            {"slot": 2, "name": "B", "kind": "custom", "home": "Cabin", "families": ["hexagon", 3]},
            {"slot": 3, "name": "C", "kind": "custom", "home": "Cabin", "families": "rectangular"},
            {"slot": 4, "name": "D", "kind": "custom", "home": "Cabin"},
            {"slot": 5, "name": "P", "kind": "preset", "families": ["circular"]},
            # The iPhone Home Screen names pass the same filter.
            {"slot": 6, "name": "E", "kind": "custom", "home": "Phone",
             "families": ["xlarge", "small", "medium", "large", "tile"]},
        ],
    )
    rows = store.occupied(OWNER)
    assert rows[0]["families"] == ["inline", "rectangular"]
    assert "families" not in rows[1]
    assert "families" not in rows[2]
    assert "families" not in rows[3]
    # A preset has no document; the key is still passed through as sent, the
    # panel ignores it for presets.
    assert rows[4]["families"] == ["circular"]
    assert rows[5]["families"] == ["large", "medium", "small", "xlarge"]
    # Round trip through storage keeps it.
    assert _new(mod).occupied(OWNER)[0]["families"] == ["inline", "rectangular"]


def test_occupied_drops_junk_and_unknown_kinds(mod):
    store = _new(mod)
    store.set_occupied(
        OWNER,
        [
            "junk",
            {"slot": True, "kind": "custom"},
            {"slot": MAX_SLOTS, "kind": "custom"},
            {"slot": 1, "kind": "widget", "name": 5, "home": 7},
            {"slot": 1, "kind": "custom", "name": "dupe loses"},
        ],
    )
    assert store.occupied(OWNER) == [{"slot": 1, "name": "", "kind": "preset", "home": ""}]
    assert store.set_occupied(OWNER, []) is True
    assert store.occupied(OWNER) == []
    assert store.presets(OWNER) == []


def test_occupied_falls_back_to_the_preset_report(mod):
    # An old app sends presets only; the panel still gets one occupied list.
    store = _new(mod)
    store.set_presets(OWNER, [{"slot": 3, "name": "Garage"}])
    assert store.occupied(OWNER) == [{"slot": 3, "name": "Garage", "kind": "preset", "home": ""}]
    # A newer app's report replaces it, and a later bare preset report (the
    # user went back to an older build) drops the occupied list again.
    store.set_occupied(OWNER, [{"slot": 5, "name": "C", "kind": "custom", "home": "Cabin"}])
    assert store.presets(OWNER) == []
    assert store.set_presets(OWNER, [{"slot": 3, "name": "Garage"}]) is True
    assert store.occupied(OWNER) == [{"slot": 3, "name": "Garage", "kind": "preset", "home": ""}]


# ── applied token (the watch's ack) and the wake hook ────────────────────


def test_applied_token_round_trip_notifies_and_survives_restart(mod):
    store = _new(mod)
    seen = []
    store.async_add_listener(seen.append)
    assert store.applied_token(OWNER) is None
    store.save(OWNER, _doc(), base_revision=None, updated_by="t")
    assert store.set_applied_token(OWNER, 1) is True
    assert store.set_applied_token(OWNER, 1) is False
    assert store.set_applied_token(OWNER, True) is False
    assert store.set_applied_token(OWNER, -1) is False
    assert store.applied_token(OWNER) == 1
    assert store.applied_token(OTHER) is None
    # One record commit, one ack: the ack carries no record.
    assert [c.record is None for c in seen] == [False, True]
    assert seen[1].applied_token == 1 and seen[1].token == 1

    reloaded = _new(mod)
    assert reloaded.applied_token(OWNER) == 1


def test_never_acked_is_none_and_an_ack_of_zero_is_a_number(mod):
    """The two used to be one value, and the panel could not tell them apart.

    A watch app that predates custom complications sends no token at all; a
    current one that has applied an empty store sends 0. Reporting 0 for both
    made the panel offer a Resend to a watch with nothing listening for it.
    """
    store = _new(mod)
    assert store.applied_token(OWNER) is None
    assert store.set_applied_token(OWNER, 0) is True
    assert store.applied_token(OWNER) == 0
    assert store.set_applied_token(OWNER, 0) is False
    assert _new(mod).applied_token(OWNER) == 0


def test_last_sync_is_stamped_notifies_nobody_and_survives_restart(mod):
    """The phone's only sign of life, so it has to outlive a restart.

    A watch answers "is it listening" through the coordinator's poll clock,
    which is in memory. An iPhone owner never parks a poll, so its pull is all
    the panel ever sees; a restart that reset this would report a phone synced
    a minute ago as one that never synced at all.
    """
    store = _new(mod)
    seen = []
    store.async_add_listener(seen.append)
    assert store.last_sync_at(OWNER) is None
    assert store.seconds_since_sync(OWNER) is None

    store.set_last_sync(OWNER)
    stamped = store.last_sync_at(OWNER)
    assert isinstance(stamped, str) and stamped.endswith("Z")
    assert 0 <= store.seconds_since_sync(OWNER) < 60
    assert store.last_sync_at(OTHER) is None
    # A pull that changed nothing must not make the panel redraw.
    assert seen == []

    reloaded = _new(mod)
    assert reloaded.last_sync_at(OWNER) == stamped
    assert 0 <= reloaded.seconds_since_sync(OWNER) < 60
    assert reloaded.seconds_since_sync(OTHER) is None


def test_an_unparseable_last_sync_reads_as_never(mod):
    """A hand-edited storage file must not raise inside a status reply."""
    store = _new(mod)
    store._last_sync[OWNER] = "not a timestamp"
    assert store.seconds_since_sync(OWNER) is None


def test_every_commit_wakes_the_owner(mod):
    store = _new(mod)
    woken = []
    store.async_set_wake_callback(woken.append)
    doc = _doc()
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    store.delete(OWNER, doc["id"], base_revision=1, updated_by="t")
    store.restore(OTHER, [_doc(slotIndex=1)], updated_by="t")
    assert woken == [OWNER, OWNER, OTHER]
    # Acks and reports do not wake anything.
    store.set_applied_token(OWNER, 2)
    store.set_occupied(OWNER, [{"slot": 7, "name": "x", "kind": "custom", "home": "h"}])
    assert woken == [OWNER, OWNER, OTHER]


def test_wake_callback_failure_does_not_break_the_commit(mod):
    store = _new(mod)

    def boom(_owner):
        raise RuntimeError("boom")

    store.async_set_wake_callback(boom)
    record = store.save(OWNER, _doc(), base_revision=None, updated_by="t")
    assert record.revision == 1
    assert store.list(OWNER)[0].id == record.id


# ── robustness ───────────────────────────────────────────────────────────


def test_an_unreadable_storage_file_starts_empty_instead_of_raising(mod):
    """A corrupt file must not fail `async_setup_entry`.

    Raising out of `async_load` takes the whole integration down with it, so
    the watch loses notifications, cameras and the delta poll over one
    complication file. Starting empty is visible in the panel and the next
    save rewrites the file.
    """
    store = mod.ComplicationStore(object())

    class _Unreadable:
        async def async_load(self):
            raise ValueError("not JSON")

    store._store = _Unreadable()
    asyncio.run(store.async_load())
    assert store.owners() == []
    assert store.token == 0


def test_an_occupied_report_with_an_unhashable_kind_is_cleaned_not_fatal(mod):
    # `kind not in frozenset(...)` raises TypeError on a list. The report is
    # advisory and comes straight off the wire, so it reads as "preset".
    store = _new(mod)
    assert store.set_occupied(
        OWNER,
        [
            {"slot": 1, "name": "A", "kind": ["custom"], "home": "H"},
            {"slot": 2, "name": "B", "kind": {"custom": True}, "home": "H"},
        ],
    ) is True
    assert [e["kind"] for e in store.occupied(OWNER)] == ["preset", "preset"]


# ── forgetting a watch ───────────────────────────────────────────────────


def test_forget_owner_erases_every_trace_of_one_watch(mod):
    store = _new(mod)
    doc = _doc()
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    store.delete(OWNER, doc["id"], base_revision=1, updated_by="t")  # a tombstone too
    store.save(OWNER, _doc(slotIndex=2), base_revision=None, updated_by="t")
    store.set_occupied(OWNER, [{"slot": 5, "name": "P", "kind": "preset", "home": "H"}])
    store.set_pages(OWNER, [{"id": str(uuid.uuid4()), "name": "Home"}])
    store.set_applied_token(OWNER, 1)
    store.set_last_sync(OWNER)
    store.save(OTHER, _doc(slotIndex=3), base_revision=None, updated_by="t")

    seen = []
    store.async_add_listener(seen.append)
    assert store.forget_owner(OWNER) is True

    assert store.owners() == [OTHER]
    assert store.list(OWNER, include_deleted=True) == []
    assert store.presets(OWNER) == []
    assert store.pages(OWNER) == []
    assert store.occupied(OWNER) == []
    assert store.applied_token(OWNER) is None
    assert store.last_sync_at(OWNER) is None
    assert store.is_empty(OWNER) is True
    # The panel hears about it, so an open tab reloads instead of showing rows
    # for a watch that no longer exists.
    assert [c.owner_watch_id for c in seen] == [OWNER]
    assert seen[0].record is None
    # The other watch is untouched, and so is the collection token.
    assert len(store.list(OTHER)) == 1
    assert store.token == 4

    # It survives a restart: the purge was written, not just forgotten in RAM.
    reloaded = _new(mod)
    assert reloaded.owners() == [OTHER]
    assert reloaded.applied_token(OWNER) is None
    assert reloaded.last_sync_at(OWNER) is None


def test_forget_owner_on_a_watch_with_nothing_stored_is_a_no_op(mod):
    store = _new(mod)
    seen = []
    store.async_add_listener(seen.append)
    assert store.forget_owner("watch-never-seen") is False
    assert seen == []


def test_async_remove_wipes_the_store_and_its_file(mod):
    store = _new(mod)
    store.save(OWNER, _doc(), base_revision=None, updated_by="t")
    store.set_applied_token(OWNER, 1)
    store.set_last_sync(OWNER)
    asyncio.run(store.async_remove())
    assert store.owners() == []
    assert store.token == 0
    assert store.applied_token(OWNER) is None
    assert store.last_sync_at(OWNER) is None
    # Uninstall is clean: a re-added integration comes back with nothing.
    assert _new(mod).owners() == []


# ── save history ───────────────────────────────────────────────────────────


def test_a_save_files_the_document_it_replaced(mod):
    store = _new(mod)
    doc = _doc(name="v1")
    store.save(OWNER, doc, base_revision=None, updated_by="alice")
    # A brand-new record has nothing behind it yet.
    assert store.history(OWNER, doc["id"]) == []

    store.save(OWNER, dict(doc, name="v2"), base_revision=1, updated_by="bob")
    entries = store.history(OWNER, doc["id"])
    assert [e.revision for e in entries] == [1]
    assert entries[0].document["name"] == "v1"
    assert entries[0].updated_by == "alice"
    assert entries[0].saved_at != ""
    # The record itself is on the new revision, which is never in the list.
    assert store.get(OWNER, doc["id"]).document["name"] == "v2"


def test_history_is_newest_first(mod):
    store = _new(mod)
    doc = _doc(name="v1")
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    for n in range(2, 5):
        store.save(OWNER, dict(doc, name=f"v{n}"), base_revision=n - 1, updated_by="t")
    assert [e.revision for e in store.history(OWNER, doc["id"])] == [3, 2, 1]
    assert [e.document["name"] for e in store.history(OWNER, doc["id"])] == [
        "v3",
        "v2",
        "v1",
    ]


def test_history_keeps_the_last_twenty_and_drops_the_oldest(mod):
    store = _new(mod)
    doc = _doc(name="v1")
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    limit = mod.COMPLICATION_HISTORY_LIMIT
    for n in range(2, limit + 5):
        store.save(OWNER, dict(doc, name=f"v{n}"), base_revision=n - 1, updated_by="t")
    entries = store.history(OWNER, doc["id"])
    assert len(entries) == limit
    # Newest first, and the four oldest revisions have gone.
    assert entries[0].revision == limit + 3
    assert entries[-1].revision == 4


def test_a_history_summary_carries_no_document(mod):
    store = _new(mod)
    doc = _doc(name="Garage")
    store.save(OWNER, doc, base_revision=None, updated_by="kim")
    store.save(OWNER, dict(doc, name="Garage 2"), base_revision=1, updated_by="sam")
    summary = store.history(OWNER, doc["id"])[0].summary()
    # Who saved revision 1, not who replaced it.
    assert summary == {
        "revision": 1,
        "savedAt": summary["savedAt"],
        "updatedBy": "kim",
        "name": "Garage",
        "layers": 1,
        "families": ["rectangular", "circular", "corner"],
    }
    assert "document" not in summary


def test_history_never_reaches_the_sync_shape(mod):
    """as_dict is what every replica reads; the bodies must not be in it."""
    store = _new(mod)
    doc = _doc()
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    record = store.save(OWNER, dict(doc, name="v2"), base_revision=1, updated_by="t")
    assert "history" not in record.as_dict()
    assert "history" in record.as_storage_dict()


def test_history_survives_a_restart(mod):
    store = _new(mod)
    doc = _doc(name="v1")
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    store.save(OWNER, dict(doc, name="v2"), base_revision=1, updated_by="t")

    reloaded = _new(mod)
    entries = reloaded.history(OWNER, doc["id"])
    assert [e.revision for e in entries] == [1]
    assert entries[0].document["name"] == "v1"


def test_a_store_written_before_save_history_loads_clean(mod):
    store = _new(mod)
    doc = _doc()
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    # What an older integration's file looks like: no history key anywhere.
    for record in _FakeStore.saved["records"]:
        record.pop("history", None)
    assert all("history" not in r for r in _FakeStore.saved["records"])

    reloaded = _new(mod)
    assert reloaded.history(OWNER, doc["id"]) == []
    assert reloaded.get(OWNER, doc["id"]).document["name"] == "Garage"
    # And the next save starts the history off normally.
    reloaded.save(OWNER, dict(doc, name="v2"), base_revision=1, updated_by="t")
    assert [e.revision for e in reloaded.history(OWNER, doc["id"])] == [1]


def test_junk_history_entries_drop_rather_than_lose_the_record(mod):
    store = _new(mod)
    doc = _doc()
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    store.save(OWNER, dict(doc, name="v2"), base_revision=1, updated_by="t")
    for record in _FakeStore.saved["records"]:
        record["history"] = [
            "not an entry",
            {"revision": "one", "document": {}},
            {"revision": 1, "document": "not a document"},
            {"revision": 1, "savedAt": "2026-09-16T00:00:00Z", "document": {"name": "v1"}},
        ]

    reloaded = _new(mod)
    entries = reloaded.history(OWNER, doc["id"])
    assert [e.revision for e in entries] == [1]
    assert reloaded.get(OWNER, doc["id"]).document["name"] == "v2"


def test_history_entry_finds_one_revision(mod):
    store = _new(mod)
    doc = _doc(name="v1")
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    store.save(OWNER, dict(doc, name="v2"), base_revision=1, updated_by="t")
    store.save(OWNER, dict(doc, name="v3"), base_revision=2, updated_by="t")
    assert store.history_entry(OWNER, doc["id"], 1).document["name"] == "v1"
    assert store.history_entry(OWNER, doc["id"], 2).document["name"] == "v2"
    assert store.history_entry(OWNER, doc["id"], 3) is None
    assert store.history_entry(OWNER, str(uuid.uuid4()).upper(), 1) is None


def test_restoring_an_old_body_writes_a_new_revision(mod):
    """Nothing rewinds: the restore is a save, so undoing it is another one."""
    store = _new(mod)
    doc = _doc(name="v1")
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    store.save(OWNER, dict(doc, name="v2"), base_revision=1, updated_by="t")

    old = store.history_entry(OWNER, doc["id"], 1)
    restored = store.save(
        OWNER, copy.deepcopy(old.document), base_revision=2, updated_by="t"
    )
    assert restored.revision == 3
    assert restored.document["name"] == "v1"
    # The revision the restore replaced is now the newest entry, so the
    # restore itself can be undone the same way.
    assert [e.revision for e in store.history(OWNER, doc["id"])] == [2, 1]
    assert store.history_entry(OWNER, doc["id"], 2).document["name"] == "v2"


def test_a_tombstone_keeps_its_history_and_a_revive_does_not_add_one(mod):
    store = _new(mod)
    doc = _doc(name="v1")
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    store.save(OWNER, dict(doc, name="v2"), base_revision=1, updated_by="t")
    store.delete(OWNER, doc["id"], base_revision=2, updated_by="t")
    assert [e.revision for e in store.history(OWNER, doc["id"])] == [1]

    # Reviving the id has no document to remember, so nothing is added.
    store.save(OWNER, dict(doc, name="v4"), base_revision=3, updated_by="t")
    assert [e.revision for e in store.history(OWNER, doc["id"])] == [1]


def test_restore_of_an_empty_owner_keeps_a_tombstones_history(mod):
    store = _new(mod)
    doc = _doc(name="v1")
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    store.save(OWNER, dict(doc, name="v2"), base_revision=1, updated_by="t")
    store.delete(OWNER, doc["id"], base_revision=2, updated_by="t")

    store.restore(OWNER, [dict(doc, name="from watch")], updated_by="t")
    assert [e.revision for e in store.history(OWNER, doc["id"])] == [1]


def test_moving_a_watch_takes_the_history_with_it(mod):
    store = _new(mod)
    doc = _doc(name="v1")
    store.save(OWNER, doc, base_revision=None, updated_by="t")
    store.save(OWNER, dict(doc, name="v2"), base_revision=1, updated_by="t")

    store.move_owner(OWNER, OTHER, updated_by="t")
    entries = store.history(OTHER, doc["id"])
    assert [e.revision for e in entries] == [1]
    assert entries[0].document["name"] == "v1"
