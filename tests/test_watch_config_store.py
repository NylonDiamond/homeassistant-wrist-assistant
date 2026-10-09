"""Pure-unit tests for WatchConfigStore (the watch config kept in Home Assistant).

In-process, no HA instance, the same stub-and-load pattern as
test_complication_store.py. The ``Store`` stand-in keeps one payload per
storage key, which is what lets these tests see that each owner has a file of
its own, that a save touches only its owner's file, and that a "restart"
reads back what was written.

Covered: create, compare-and-swap, the conflict, a forced save and its
history, the history cap, unknown kinds, the size cap, the envelope check,
forget, move, owner isolation, the persistence round trip, and an unreadable
file never being saved over. From step 2: the ``behavior`` kind and its own
cap, delivery tracking (and files written before it existed), and the panel
save with its ``no_record`` and ``conflict`` refusals and server-side hash.
From the live line: the change listeners (every trigger, what is not a
trigger, a listener that raises, removal) and ``revisions``. From step 3: the
panel saving pages, the page shape guard at both levels, the unreadable report
(``rejected_revision``), the history list and entry, restore, and files
written before any of it. From step 3e: the ``catalog`` kind, its cap and
shape guard, and the panel being refused it. From step 4d: the ``menus``
kind, its cap and shape guard, and the panel creating a first record for a
paired watch (and being refused one for any other). From step 4d batch 2:
the ``voice``, ``notification_style`` and ``status_pages`` kinds, their caps
and shape guards, and the same panel save, restore and create. From step 4d
batch 5: the ``control_center`` kind, the same way. From step 8: the
``rooms`` kind, any object under its own 64 KiB cap, and the panel's save,
restore and create.
"""

from __future__ import annotations

import ast
import asyncio
import contextlib
import copy
import hashlib
import importlib.util
import json
import sys
import types
from pathlib import Path
from typing import Any

import pytest

_STORE_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "watch_config_store.py"
)

_PKG = "wa_watch_config_test_pkg"

INDEX_KEY = "wrist_assistant.watch_config"
# The real caps, not smaller test values: a 700 KiB string is cheap to build, and
# testing the numbers that ship is the point. Kept equal to const.py by
# test_the_size_caps_match_const below.
MAX_BYTES = 700 * 1024
MAX_BEHAVIOR_BYTES = 256 * 1024
MAX_CATALOG_BYTES = 256 * 1024
MAX_MENUS_BYTES = 256 * 1024
MAX_VOICE_BYTES = 256 * 1024
MAX_NOTIFICATION_STYLE_BYTES = 256 * 1024
MAX_STATUS_PAGES_BYTES = 256 * 1024
MAX_CONTROL_CENTER_BYTES = 256 * 1024
MAX_ROOMS_BYTES = 64 * 1024
HISTORY_LIMIT = 5
# Kept equal to const.py by test_the_kinds_match_const below.
KINDS = frozenset(
    {
        "pages",
        "behavior",
        "catalog",
        "menus",
        "voice",
        "notification_style",
        "status_pages",
        "control_center",
        "rooms",
    }
)
PANEL_KINDS = frozenset(
    {
        "pages",
        "behavior",
        "menus",
        "voice",
        "notification_style",
        "status_pages",
        "control_center",
        "rooms",
    }
)

OWNER = "watch-A"
OTHER = "watch-B"
HASH_1 = "1" * 64
HASH_2 = "2" * 64
HASH_3 = "3" * 64


class _FakeStore:
    """Stand-in for ``homeassistant.helpers.storage.Store``, one file per key.

    Saves land at once rather than after the debounce; what is being tested is
    which file is written and with what, not the timer.
    """

    files: dict[str, Any] = {}
    writes: list[str] = []
    removed: list[str] = []
    unreadable: set[str] = set()

    def __init__(self, _hass: object, _version: int, key: str, *_a: object, **_k: object) -> None:
        self.key = key

    async def async_load(self):
        if self.key in _FakeStore.unreadable:
            raise OSError(f"cannot read {self.key}")
        return copy.deepcopy(_FakeStore.files.get(self.key))

    def async_delay_save(self, serialize, *_args: object, **_kwargs: object) -> None:
        _FakeStore.files[self.key] = copy.deepcopy(serialize())
        _FakeStore.writes.append(self.key)

    async def async_save(self, data: Any) -> None:
        _FakeStore.files[self.key] = copy.deepcopy(data)
        _FakeStore.writes.append(self.key)

    async def async_remove(self) -> None:
        _FakeStore.files.pop(self.key, None)
        _FakeStore.removed.append(self.key)


class _Hass:
    """Only ``async_create_task``, which the forget path uses to remove a file."""

    def async_create_task(self, coro, name: str | None = None, **_kwargs: object):
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            return asyncio.run(coro)
        return loop.create_task(coro)


@contextlib.contextmanager
def _loaded_module():
    saved_modules = dict(sys.modules)
    _FakeStore.files = {}
    _FakeStore.writes = []
    _FakeStore.removed = []
    _FakeStore.unreadable = set()
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
            WATCH_CONFIG_STORAGE_KEY=INDEX_KEY,
            WATCH_CONFIG_STORAGE_VERSION=1,
            WATCH_CONFIG_KINDS=KINDS,
            WATCH_CONFIG_PANEL_KINDS=PANEL_KINDS,
            WATCH_CONFIG_PANEL_WRITER="panel",
            WATCH_CONFIG_MAX_DOCUMENT_BYTES={
                "pages": MAX_BYTES,
                "behavior": MAX_BEHAVIOR_BYTES,
                "catalog": MAX_CATALOG_BYTES,
                "menus": MAX_MENUS_BYTES,
                "voice": MAX_VOICE_BYTES,
                "notification_style": MAX_NOTIFICATION_STYLE_BYTES,
                "status_pages": MAX_STATUS_PAGES_BYTES,
                "control_center": MAX_CONTROL_CENTER_BYTES,
                "rooms": MAX_ROOMS_BYTES,
            },
            WATCH_CONFIG_HISTORY_LIMIT=HISTORY_LIMIT,
        )

        spec = importlib.util.spec_from_file_location(
            f"{_PKG}.watch_config_store", _STORE_PATH
        )
        module = importlib.util.module_from_spec(spec)
        sys.modules[f"{_PKG}.watch_config_store"] = module
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


def _new(mod, *, paired: set[str] | None = None):
    """A loaded store. ``paired`` is the owner ids the secret store knows;
    without it the store is built with no pairing check, as before step 4d."""
    if paired is None:
        store = mod.WatchConfigStore(_Hass())
    else:
        store = mod.WatchConfigStore(_Hass(), is_paired=lambda owner: owner in paired)
    asyncio.run(store.async_load())
    return store


def _doc(name: str = "Home", **extra: Any) -> dict:
    """A small stand-in for a GridConfiguration. The store reads only `pages`,
    and in it only the page ids and, for a panel write, each page's `items`."""
    doc = {
        "schemaVersion": 1,
        "pages": [{"id": "6F1C2D0E-0000-4000-8000-000000000001", "name": name, "items": []}],
    }
    doc.update(extra)
    return doc


def _put(store, owner: str = OWNER, doc: dict | None = None, *, base: Any = 0,
         digest: str = HASH_1, force: Any = False, kind: Any = "pages"):
    return store.put(
        owner,
        kind,
        doc if doc is not None else _doc(),
        document_hash=digest,
        base_revision=base,
        force=force,
        updated_by=owner,
    )


# ── create and compare-and-swap ──────────────────────────────────────────


def test_first_save_is_revision_one_and_keeps_the_document_as_sent(mod):
    store = _new(mod)
    doc = _doc(extraKeyTheServerDoesNotKnow={"nested": [1, 2.5, None, True]})
    record = _put(store, doc=doc)
    assert record.revision == 1
    assert record.hash == HASH_1
    assert record.updated_by == OWNER
    assert record.updated_at.endswith("Z")
    assert record.history == []
    assert store.get(OWNER, "pages").document == doc
    # Stored exactly as parsed: no key added, dropped or reordered.
    assert list(store.get(OWNER, "pages").document) == list(doc)


def test_save_on_the_stored_revision_increments_and_files_the_old_one(mod):
    store = _new(mod)
    first = _doc("First")
    _put(store, doc=first, digest=HASH_1)
    record = _put(store, doc=_doc("Second"), base=1, digest=HASH_2)
    assert record.revision == 2
    assert record.hash == HASH_2
    assert record.document["pages"][0]["name"] == "Second"
    [entry] = record.history
    assert (entry.revision, entry.hash, entry.document) == (1, HASH_1, first)


def test_a_stale_base_revision_conflicts_and_changes_nothing(mod):
    store = _new(mod)
    _put(store, doc=_doc("v1"), digest=HASH_1)
    _put(store, doc=_doc("v2"), base=1, digest=HASH_2)
    writes = len(_FakeStore.writes)
    with pytest.raises(mod.WatchConfigConflictError) as exc:
        _put(store, doc=_doc("stale"), base=1, digest=HASH_3)
    assert exc.value.code == "conflict"
    assert exc.value.revision == 2
    assert exc.value.hash == HASH_2
    record = store.get(OWNER, "pages")
    assert record.revision == 2
    assert record.document["pages"][0]["name"] == "v2"
    assert len(_FakeStore.writes) == writes


def test_a_nonzero_base_with_no_record_conflicts_at_revision_zero(mod):
    """A phone that synced before the record was forgotten or wiped."""
    store = _new(mod)
    with pytest.raises(mod.WatchConfigConflictError) as exc:
        _put(store, base=14)
    assert exc.value.revision == 0
    assert exc.value.hash is None
    assert store.get(OWNER, "pages") is None


def test_force_saves_over_a_newer_revision_and_keeps_what_it_replaced(mod):
    store = _new(mod)
    _put(store, doc=_doc("v1"), digest=HASH_1)
    newer = _doc("server copy")
    _put(store, doc=newer, base=1, digest=HASH_2)

    record = _put(store, doc=_doc("phone wins"), base=1, digest=HASH_3, force=True)
    assert record.revision == 3
    assert record.hash == HASH_3
    assert [(e.revision, e.hash) for e in record.history] == [(1, HASH_1), (2, HASH_2)]
    assert record.history[-1].document == newer


def test_force_needs_no_base_revision(mod):
    store = _new(mod)
    record = _put(store, base=None, force=True)
    assert record.revision == 1


def test_history_keeps_the_last_five(mod):
    store = _new(mod)
    for revision in range(8):
        _put(store, doc=_doc(f"v{revision + 1}"), base=revision, digest=f"{revision:x}" * 64)
    record = store.get(OWNER, "pages")
    assert record.revision == 8
    assert [e.revision for e in record.history] == [3, 4, 5, 6, 7]
    assert record.history[0].document["pages"][0]["name"] == "v3"


# ── refusals ─────────────────────────────────────────────────────────────


@pytest.mark.parametrize("kind", ["quick_actions", "", None, 3, ["pages"]])
def test_an_unknown_kind_is_refused_for_get_and_put(mod, kind):
    store = _new(mod)
    with pytest.raises(mod.WatchConfigValidationError):
        store.get(OWNER, kind)
    with pytest.raises(mod.WatchConfigValidationError):
        _put(store, kind=kind)
    assert _FakeStore.writes == []


def test_the_size_cap_is_inclusive_and_measured_as_compact_utf8(mod):
    store = _new(mod)
    empty = {"pages": [], "b": ""}
    overhead = mod.document_size(empty)
    assert overhead == len('{"pages":[],"b":""}')

    at_cap = {"pages": [], "b": "x" * (MAX_BYTES - overhead)}
    assert _put(store, doc=at_cap).revision == 1

    over = {"pages": [], "b": "x" * (MAX_BYTES - overhead + 1)}
    with pytest.raises(mod.WatchConfigValidationError, match="limit"):
        _put(store, doc=over, base=1)
    assert store.get(OWNER, "pages").revision == 1


def test_non_ascii_counts_as_its_utf8_bytes(mod):
    """Measured unescaped, so a name in Japanese is not charged six bytes a
    character, which is what an ASCII-escaping encoder would count."""
    assert mod.document_size({"pages": [], "n": "家"}) == len('{"pages":[],"n":""}') + 3


@pytest.mark.parametrize(
    "document",
    [
        [],
        "pages",
        {},
        {"pages": None},
        {"pages": {}},
        {"pages": "[]"},
    ],
)
def test_a_bad_envelope_is_refused(mod, document):
    store = _new(mod)
    with pytest.raises(mod.WatchConfigValidationError):
        _put(store, doc=document, base=0)
    assert store.get(OWNER, "pages") is None


def test_a_missing_document_is_refused(mod):
    store = _new(mod)
    with pytest.raises(mod.WatchConfigValidationError):
        store.put(OWNER, "pages", None, document_hash=HASH_1, base_revision=0, updated_by=OWNER)


@pytest.mark.parametrize(
    "digest", [None, "", "A" * 64, "1" * 63, "1" * 65, "g" * 64, 123, "1" * 63 + " "]
)
def test_a_hash_that_is_not_lowercase_sha256_hex_is_refused(mod, digest):
    store = _new(mod)
    with pytest.raises(mod.WatchConfigValidationError, match="hash"):
        _put(store, digest=digest)


@pytest.mark.parametrize("base", [None, -1, True, "0", 1.0])
def test_a_bad_base_revision_is_refused_without_force(mod, base):
    store = _new(mod)
    with pytest.raises(mod.WatchConfigValidationError, match="base_revision"):
        _put(store, base=base)


@pytest.mark.parametrize("force", [None, 1, "true"])
def test_force_must_be_a_bool(mod, force):
    store = _new(mod)
    with pytest.raises(mod.WatchConfigValidationError, match="force"):
        _put(store, force=force)


def test_a_malformed_save_is_refused_as_malformed_even_when_stale(mod):
    store = _new(mod)
    _put(store)
    with pytest.raises(mod.WatchConfigValidationError):
        _put(store, doc={"pages": "no"}, base=0)


# ── owners ───────────────────────────────────────────────────────────────


def test_two_owners_are_isolated_in_records_and_in_files(mod):
    store = _new(mod)
    _put(store, OWNER, _doc("A"), digest=HASH_1)
    _put(store, OTHER, _doc("B"), digest=HASH_2)
    key_a = mod._owner_key(OWNER)
    key_b = mod._owner_key(OTHER)
    assert key_a != key_b
    assert key_a.startswith(INDEX_KEY + ".") and key_b.startswith(INDEX_KEY + ".")

    _FakeStore.writes.clear()
    _put(store, OWNER, _doc("A2"), base=1, digest=HASH_3)
    assert _FakeStore.writes == [key_a]
    assert store.get(OTHER, "pages").document["pages"][0]["name"] == "B"
    assert store.get(OTHER, "pages").revision == 1
    assert _FakeStore.files[key_b]["records"]["pages"]["hash"] == HASH_2

    # A conflict is per owner too: OTHER's revision says nothing about OWNER's.
    with pytest.raises(mod.WatchConfigConflictError):
        _put(store, OTHER, base=2)


def test_the_owner_file_name_is_safe_for_any_owner_id(mod):
    key = mod._owner_key("iphone:../../etc/passwd")
    suffix = key[len(INDEX_KEY) + 1 :]
    assert len(suffix) == 32 and all(c in "0123456789abcdef" for c in suffix)


def test_forget_deletes_the_owner_s_file_and_index_entry(mod):
    store = _new(mod)
    _put(store, OWNER)
    _put(store, OTHER)
    assert store.forget_owner(OWNER) is True
    assert store.get(OWNER, "pages") is None
    assert mod._owner_key(OWNER) in _FakeStore.removed
    assert mod._owner_key(OWNER) not in _FakeStore.files
    assert _FakeStore.files[INDEX_KEY] == {"owners": [OTHER]}
    assert store.get(OTHER, "pages").revision == 1
    # The phone reads "no record" and uploads, starting over at revision 1.
    assert _put(store, OWNER, base=0).revision == 1


def test_forgetting_an_owner_with_nothing_stored_does_nothing(mod):
    store = _new(mod)
    assert store.forget_owner(OWNER) is False
    assert _FakeStore.removed == []
    assert _FakeStore.writes == []


def test_move_to_an_empty_target_carries_the_record_unchanged(mod):
    store = _new(mod)
    _put(store, OWNER, _doc("v1"), digest=HASH_1)
    _put(store, OWNER, _doc("v2"), base=1, digest=HASH_2)
    before = store.get(OWNER, "pages")
    snapshot = (before.revision, before.hash, before.updated_at, before.updated_by,
                before.document, [e.revision for e in before.history])

    assert store.move_owner(OWNER, OTHER, updated_by="ha-panel:Jesse") == ["pages"]

    moved = store.get(OTHER, "pages")
    assert (moved.revision, moved.hash, moved.updated_at, moved.updated_by,
            moved.document, [e.revision for e in moved.history]) == snapshot
    assert moved.owner_watch_id == OTHER
    assert store.get(OWNER, "pages") is None
    assert mod._owner_key(OWNER) not in _FakeStore.files
    assert _FakeStore.files[mod._owner_key(OTHER)]["records"]["pages"]["revision"] == 2
    assert _FakeStore.files[INDEX_KEY] == {"owners": [OTHER]}


def test_move_onto_a_target_that_has_a_record_keeps_the_target_s(mod):
    store = _new(mod)
    old = _doc("old watch")
    _put(store, OWNER, old, digest=HASH_1)
    _put(store, OTHER, _doc("new watch"), digest=HASH_2)
    _put(store, OTHER, _doc("new watch 2"), base=1, digest=HASH_3)

    assert store.move_owner(OWNER, OTHER, updated_by="t") == ["pages"]

    target = store.get(OTHER, "pages")
    assert target.revision == 2
    assert target.hash == HASH_3
    assert target.document["pages"][0]["name"] == "new watch 2"
    # Nothing lost: the old watch's document is the newest history entry.
    assert target.history[-1].document == old
    assert target.history[-1].hash == HASH_1
    assert store.get(OWNER, "pages") is None


def test_move_with_nothing_to_carry_does_nothing(mod):
    store = _new(mod)
    _put(store, OTHER)
    assert store.move_owner(OWNER, OTHER, updated_by="t") == []
    assert store.get(OTHER, "pages").revision == 1


def test_move_onto_the_same_watch_is_refused(mod):
    store = _new(mod)
    _put(store, OWNER)
    with pytest.raises(mod.WatchConfigValidationError):
        store.move_owner(OWNER, OWNER, updated_by="t")
    assert store.get(OWNER, "pages").revision == 1


# ── persistence ──────────────────────────────────────────────────────────


def test_a_restart_reads_back_every_record_and_its_history(mod):
    store = _new(mod)
    doc = _doc("v2", nested={"a": [1, {"b": 2.25}]})
    _put(store, OWNER, _doc("v1"), digest=HASH_1)
    _put(store, OWNER, doc, base=1, digest=HASH_2)
    _put(store, OTHER, _doc("B"), digest=HASH_3)
    before = store.get(OWNER, "pages")

    again = _new(mod)
    assert again.owners() == [OWNER, OTHER]
    after = again.get(OWNER, "pages")
    assert (after.revision, after.hash, after.updated_at, after.updated_by) == (
        before.revision, before.hash, before.updated_at, before.updated_by
    )
    assert after.document == doc
    assert after.size_bytes == before.size_bytes > 0
    assert [(e.revision, e.hash) for e in after.history] == [(1, HASH_1)]
    assert again.get(OTHER, "pages").hash == HASH_3
    # And the revision carries on above the floor the restart set, which is
    # on disk before anything above it is handed out.
    floor = again._revision_floor
    assert floor >= 2 + mod._REVISION_MARGIN
    assert _FakeStore.files[INDEX_KEY]["revision_floor"] == floor
    assert _put(again, OWNER, base=2, digest=HASH_3).revision == floor + 1


def test_the_floor_takes_a_per_start_step_from_the_clock(mod):
    margin = mod._REVISION_MARGIN
    # Far past the minutes term would matter: the stored numbers win.
    saved, highest = 40_000_000, 39_999_000
    base = max(saved, highest) + margin
    at = 1_790_000_000.0  # some second in 2026
    assert mod._revision_floor(saved, highest, at) == base + int(at) % margin
    # A second later from the same file: a different floor.
    assert mod._revision_floor(saved, highest, at + 1) == base + (int(at) + 1) % margin
    # The step never reaches a whole margin.
    for second in range(0, 3 * margin, 37):
        floor = mod._revision_floor(saved, highest, float(second) + at)
        assert base <= floor < base + margin
    # The minutes since 1970 still win over a small stored floor, and take
    # the same step, so two starts in one minute differ there too.
    assert mod._revision_floor(0, 5, at) == int(at // 60) + int(at) % margin
    assert mod._revision_floor(0, 5, at + 1) == int(at // 60) + (int(at) + 1) % margin


@pytest.mark.parametrize("stored_floor", [None, 40_000_000])
def test_two_starts_from_the_same_backup_hand_out_different_revisions(
    mod, monkeypatch, stored_floor
):
    """A restore brings the index and records back as they were. Two starts
    from that same file, a few seconds apart, used to give the first save the
    same number for different documents: with a stored floor above the
    minutes since 1970 (the test bed's case), and within one minute when the
    minutes win."""
    store = _new(mod)
    _put(store, OWNER, _doc("v1"), digest=HASH_1)
    backup = copy.deepcopy(_FakeStore.files)
    if stored_floor is not None:
        backup[INDEX_KEY]["revision_floor"] = stored_floor
    clock = {"now": 1_790_000_000.0}
    monkeypatch.setattr(mod.time, "time", lambda: clock["now"])

    def start_from_backup_and_save(digest: str, name: str):
        _FakeStore.files = copy.deepcopy(backup)
        again = _new(mod)
        # The floor is on disk before any revision above it goes out.
        assert _FakeStore.files[INDEX_KEY]["revision_floor"] == again._revision_floor
        return _put(again, OWNER, _doc(name), base=1, digest=digest)

    first = start_from_backup_and_save(HASH_2, "after first restore")
    clock["now"] += 7
    second = start_from_backup_and_save(HASH_3, "after second restore")
    assert first.revision != second.revision
    assert mod.short_hash(first.hash) != mod.short_hash(second.hash)


def test_the_short_hash_is_the_first_16_hex_digits_of_the_stored_hash(mod):
    assert mod.SHORT_HASH_LENGTH == 16
    assert mod.short_hash(HASH_2) == HASH_2[:16]
    assert mod.short_hash("") is None
    assert mod.short_hash(None) is None
    store = _new(mod)
    _put(store, OWNER, digest=HASH_1)
    _put(store, OWNER, {"wrapPages": True}, digest=HASH_2, kind="behavior")
    assert store.short_hashes(OWNER) == {"pages": HASH_1[:16], "behavior": HASH_2[:16]}
    assert store.short_hashes("nobody") == {}
    # A record with no hash (a hand-edited file) is left out, not sent empty.
    store.get(OWNER, "behavior").hash = ""
    assert store.short_hashes(OWNER) == {"pages": HASH_1[:16]}


def test_the_owner_file_holds_the_document_and_history_but_the_index_does_not(mod):
    store = _new(mod)
    _put(store, OWNER, _doc("v1"))
    _put(store, OWNER, _doc("v2"), base=1, digest=HASH_2)
    stored = _FakeStore.files[mod._owner_key(OWNER)]
    assert stored["owner_watch_id"] == OWNER
    record = stored["records"]["pages"]
    assert set(record) == {
        "revision", "hash", "updated_at", "updated_by",
        "delivered_revision", "delivered_at", "rejected_revision", "rejected_at",
        "document", "history",
    }
    assert [e["revision"] for e in record["history"]] == [1]
    assert _FakeStore.files[INDEX_KEY] == {"owners": [OWNER]}


def test_a_kind_this_build_does_not_know_survives_a_load_and_a_save(mod):
    """A downgrade must not erase what a newer build stored."""
    store = _new(mod)
    _put(store, OWNER)
    key = mod._owner_key(OWNER)
    future = {"revision": 3, "hash": HASH_2, "updated_at": "", "updated_by": OWNER,
              "document": {"actions": []}}
    _FakeStore.files[key]["records"]["quick_actions"] = copy.deepcopy(future)

    again = _new(mod)
    _put(again, OWNER, base=1, digest=HASH_3)
    written = _FakeStore.files[key]["records"]["quick_actions"]
    assert {k: written[k] for k in future} == future
    assert (written["delivered_revision"], written["delivered_at"]) == (0, None)
    with pytest.raises(mod.WatchConfigValidationError):
        again.get(OWNER, "quick_actions")


def test_an_unreadable_owner_file_refuses_that_owner_only_and_is_never_saved_over(mod):
    store = _new(mod)
    _put(store, OWNER)
    _put(store, OTHER)
    key = mod._owner_key(OWNER)
    on_disk = copy.deepcopy(_FakeStore.files[key])
    _FakeStore.unreadable.add(key)

    again = _new(mod)
    with pytest.raises(mod.WatchConfigUnavailableError) as exc:
        again.get(OWNER, "pages")
    assert exc.value.code == "unavailable"
    with pytest.raises(mod.WatchConfigUnavailableError):
        _put(again, OWNER, base=0, force=True)
    with pytest.raises(mod.WatchConfigUnavailableError):
        again.move_owner(OWNER, "watch-C", updated_by="t")
    assert _FakeStore.files[key] == on_disk
    # It stays named in the index, so the next restart tries it again.
    assert OWNER in _FakeStore.files[INDEX_KEY]["owners"]
    assert again.get(OTHER, "pages").revision == 1
    assert again.diagnostics()[OWNER] == {"unreadable": {}}


def test_an_unreadable_index_refuses_everything_and_writes_nothing(mod):
    store = _new(mod)
    _put(store, OWNER)
    _FakeStore.unreadable.add(INDEX_KEY)
    _FakeStore.writes.clear()

    again = _new(mod)
    with pytest.raises(mod.WatchConfigUnavailableError):
        again.get(OWNER, "pages")
    with pytest.raises(mod.WatchConfigUnavailableError):
        _put(again, OTHER)
    assert _FakeStore.writes == []


def test_diagnostics_report_revision_size_and_time_but_never_the_document(mod):
    store = _new(mod)
    _put(store, OWNER, _doc("secret page name"))
    _put(store, OWNER, _doc("secret page name 2"), base=1, digest=HASH_2)
    report = store.diagnostics()
    entry = report[OWNER]["pages"]
    record = store.get(OWNER, "pages")
    assert entry == {
        "revision": 2,
        "size_bytes": record.size_bytes,
        "updated_at": record.updated_at,
        "updated_by": OWNER,
        "delivered_revision": 2,
        "delivered_at": record.delivered_at,
        "rejected_revision": 0,
        "rejected_at": None,
        "history_count": 1,
    }
    assert "secret" not in repr(report)

    assert store.report_unreadable(OWNER, "pages", 2) is True
    entry = store.diagnostics()[OWNER]["pages"]
    assert (entry["rejected_revision"], entry["rejected_at"]) == (2, record.rejected_at)
    assert entry["rejected_at"]


def test_remove_deletes_every_owner_file_and_the_index(mod):
    store = _new(mod)
    _put(store, OWNER)
    _put(store, OTHER)
    # A fresh instance, the way async_remove_entry calls it after unload.
    asyncio.run(mod.WatchConfigStore(_Hass()).async_remove())
    assert _FakeStore.files == {}


# ── step 2: the behavior kind ────────────────────────────────────────────


def _behavior(**keys: Any) -> dict:
    """A stand-in for BehaviorPreferences: flat, every key optional."""
    doc = {"longPressDuration": "Normal", "wrapPages": False}
    doc.update(keys)
    return doc


def test_the_size_caps_match_const() -> None:
    """The caps above are the shipped numbers, read out of const.py."""
    const = Path(_STORE_PATH).with_name("const.py")
    tree = ast.parse(const.read_text())
    [node] = [
        n
        for n in tree.body
        if isinstance(n, ast.AnnAssign)
        and isinstance(n.target, ast.Name)
        and n.target.id == "WATCH_CONFIG_MAX_DOCUMENT_BYTES"
    ]
    # The values are products like 700 * 1024, which literal_eval refuses;
    # this is the integration's own source, evaluated with no builtins.
    expression = compile(ast.Expression(node.value), "const.py", "eval")
    caps = eval(expression, {"__builtins__": {}})  # noqa: S307
    assert caps == {
        "pages": MAX_BYTES,
        "behavior": MAX_BEHAVIOR_BYTES,
        "catalog": MAX_CATALOG_BYTES,
        "menus": MAX_MENUS_BYTES,
        "voice": MAX_VOICE_BYTES,
        "notification_style": MAX_NOTIFICATION_STYLE_BYTES,
        "status_pages": MAX_STATUS_PAGES_BYTES,
        "control_center": MAX_CONTROL_CENTER_BYTES,
        "rooms": MAX_ROOMS_BYTES,
    }


def test_the_kinds_match_const() -> None:
    """The kind sets above are the shipped ones, read out of const.py."""
    const = Path(_STORE_PATH).with_name("const.py")
    tree = ast.parse(const.read_text())
    found: dict[str, frozenset[str]] = {}
    for node in tree.body:
        if (
            isinstance(node, ast.Assign)
            and len(node.targets) == 1
            and isinstance(node.targets[0], ast.Name)
            and node.targets[0].id in ("WATCH_CONFIG_KINDS", "WATCH_CONFIG_PANEL_KINDS")
        ):
            # frozenset({...}): the set literal is the call's one argument.
            found[node.targets[0].id] = frozenset(ast.literal_eval(node.value.args[0]))
    assert found == {"WATCH_CONFIG_KINDS": KINDS, "WATCH_CONFIG_PANEL_KINDS": PANEL_KINDS}


def test_behavior_is_any_json_object(mod):
    store = _new(mod)
    assert _put(store, kind="behavior", doc={}).revision == 1
    record = _put(store, kind="behavior", doc=_behavior(), base=1, digest=HASH_2)
    assert record.revision == 2
    assert store.get(OWNER, "behavior").document == _behavior()


@pytest.mark.parametrize("document", [[], "settings", 3])
def test_behavior_that_is_not_an_object_is_refused(mod, document):
    store = _new(mod)
    with pytest.raises(mod.WatchConfigValidationError, match="object"):
        _put(store, kind="behavior", doc=document)


def test_behavior_has_its_own_smaller_cap(mod):
    store = _new(mod)
    overhead = mod.document_size({"b": ""})
    at_cap = {"b": "x" * (MAX_BEHAVIOR_BYTES - overhead)}
    assert _put(store, kind="behavior", doc=at_cap).revision == 1
    over = {"b": "x" * (MAX_BEHAVIOR_BYTES - overhead + 1)}
    with pytest.raises(mod.WatchConfigValidationError, match="limit for behavior"):
        _put(store, kind="behavior", doc=over, base=1)
    # The same size is nowhere near the page cap.
    assert _put(store, doc=dict(over, pages=[])).revision == 1


def test_pages_and_behavior_are_separate_records_in_one_file(mod):
    store = _new(mod)
    _put(store, doc=_doc("v1"))
    _put(store, doc=_doc("v2"), base=1, digest=HASH_2)
    assert _put(store, kind="behavior", doc=_behavior()).revision == 1
    with pytest.raises(mod.WatchConfigConflictError) as exc:
        _put(store, kind="behavior", doc=_behavior(), base=2)
    assert exc.value.revision == 1
    stored = _FakeStore.files[mod._owner_key(OWNER)]["records"]
    assert sorted(stored) == ["behavior", "pages"]
    assert (stored["pages"]["revision"], stored["behavior"]["revision"]) == (2, 1)


# ── step 2: delivery ─────────────────────────────────────────────────────


def test_a_device_save_counts_as_delivered(mod):
    store = _new(mod)
    record = _put(store)
    assert record.delivered_revision == 1
    assert record.delivered_at == record.updated_at
    record = _put(store, base=1, digest=HASH_2)
    assert record.delivered_revision == 2


def test_mark_delivered_only_moves_forward_and_saves_only_when_it_moves(mod):
    store = _new(mod)
    _put(store, kind="behavior", doc=_behavior())
    store.panel_save(OWNER, "behavior", _behavior(wrapPages=True), base_revision=1)
    record = store.get(OWNER, "behavior")
    assert (record.revision, record.delivered_revision) == (2, 1)

    _FakeStore.writes.clear()
    assert store.mark_delivered(OWNER, "behavior", 2) is True
    assert record.delivered_revision == 2 and record.delivered_at
    assert _FakeStore.writes == [mod._owner_key(OWNER)]

    _FakeStore.writes.clear()
    assert store.mark_delivered(OWNER, "behavior", 2) is False
    assert store.mark_delivered(OWNER, "behavior", 1) is False
    assert _FakeStore.writes == []
    assert record.delivered_revision == 2


def test_mark_delivered_never_passes_the_record_s_revision(mod):
    store = _new(mod)
    _put(store, kind="behavior", doc=_behavior())
    store.panel_save(OWNER, "behavior", _behavior(), base_revision=1)
    store.mark_delivered(OWNER, "behavior", 99)
    assert store.get(OWNER, "behavior").delivered_revision == 2


def test_mark_delivered_without_a_record_does_nothing(mod):
    store = _new(mod)
    assert store.mark_delivered(OWNER, "pages", 1) is False
    assert _FakeStore.writes == []


def test_delivery_survives_a_restart(mod):
    store = _new(mod)
    _put(store, kind="behavior", doc=_behavior())
    store.panel_save(OWNER, "behavior", _behavior(wrapPages=True), base_revision=1)
    store.mark_delivered(OWNER, "behavior", 2)
    before = store.get(OWNER, "behavior")

    after = _new(mod).get(OWNER, "behavior")
    assert (after.delivered_revision, after.delivered_at) == (2, before.delivered_at)


def test_a_file_written_before_delivery_existed_still_loads(mod):
    """Exactly the record shape step 1 wrote, with no delivery fields."""
    key = mod._owner_key(OWNER)
    _FakeStore.files[INDEX_KEY] = {"owners": [OWNER]}
    _FakeStore.files[key] = {
        "owner_watch_id": OWNER,
        "records": {
            "pages": {
                "revision": 4,
                "hash": HASH_1,
                "updated_at": "2026-10-01T20:00:00Z",
                "updated_by": OWNER,
                "document": _doc(),
                "history": [
                    {"revision": 3, "hash": HASH_2, "updated_at": "", "updated_by": OWNER,
                     "document": _doc("old")},
                ],
            }
        },
    }
    record = _new(mod).get(OWNER, "pages")
    assert record.revision == 4
    assert (record.delivered_revision, record.delivered_at) == (0, None)
    assert [e.revision for e in record.history] == [3]


@pytest.mark.parametrize(
    ("raw_revision", "raw_at", "expected"),
    [
        (True, "2026-10-01T20:00:00Z", (0, None)),
        ("4", "2026-10-01T20:00:00Z", (0, None)),
        (-1, "2026-10-01T20:00:00Z", (0, None)),
        (2, 17, (2, None)),
        (9, "2026-10-01T20:00:00Z", (4, "2026-10-01T20:00:00Z")),
        (0, "2026-10-01T20:00:00Z", (0, None)),
    ],
)
def test_junk_delivery_fields_read_as_not_delivered(mod, raw_revision, raw_at, expected):
    key = mod._owner_key(OWNER)
    _FakeStore.files[INDEX_KEY] = {"owners": [OWNER]}
    _FakeStore.files[key] = {
        "owner_watch_id": OWNER,
        "records": {
            "pages": {
                "revision": 4, "hash": HASH_1, "updated_at": "", "updated_by": OWNER,
                "delivered_revision": raw_revision, "delivered_at": raw_at,
                "document": _doc(),
            }
        },
    }
    record = _new(mod).get(OWNER, "pages")
    assert record is not None
    assert (record.delivered_revision, record.delivered_at) == expected


def test_a_whole_move_resets_delivery_and_a_kept_target_keeps_its_own(mod):
    store = _new(mod)
    _put(store, OWNER, kind="behavior", doc=_behavior())
    _put(store, OWNER, _doc("old"))
    _put(store, OTHER, _doc("new"), digest=HASH_2)
    assert store.get(OWNER, "behavior").delivered_revision == 1

    store.move_owner(OWNER, OTHER, updated_by="t")
    moved = store.get(OTHER, "behavior")
    assert moved.revision == 1
    assert (moved.delivered_revision, moved.delivered_at) == (0, None)
    kept = store.get(OTHER, "pages")
    assert kept.delivered_revision == 1 and kept.delivered_at


# ── step 2: the panel save ───────────────────────────────────────────────


def _phone_behavior(store, doc: dict | None = None) -> None:
    """The first copy, which only ever comes from the phone."""
    _put(store, kind="behavior", doc=doc if doc is not None else _behavior())


def test_a_panel_save_on_the_stored_revision_is_accepted(mod):
    store = _new(mod)
    original = _behavior(unknownToThePanel={"keep": [1, "/"]})
    _phone_behavior(store, original)
    edited = dict(original, longPressDuration="Short")

    record = store.panel_save(OWNER, "behavior", edited, base_revision=1)
    assert record.revision == 2
    assert record.updated_by == "panel"
    assert record.document == edited
    assert list(record.document) == list(edited)
    [entry] = record.history
    assert (entry.revision, entry.hash, entry.document) == (1, HASH_1, original)
    # Delivery stays at what the phone had: the panel is waiting for it.
    assert record.delivered_revision == 1
    assert _FakeStore.files[mod._owner_key(OWNER)]["records"]["behavior"]["updated_by"] == "panel"


def test_the_panel_hash_is_sha256_of_compact_sorted_key_json(mod):
    store = _new(mod)
    _phone_behavior(store)
    document = {"zeta": 1, "alpha": {"b": 2, "a": "/é"}, "Mid": [True, None, 1.5]}
    record = store.panel_save(OWNER, "behavior", document, base_revision=1)
    expected_bytes = '{"Mid":[true,null,1.5],"alpha":{"a":"/é","b":2},"zeta":1}'.encode()
    assert json.dumps(document, sort_keys=True, separators=(",", ":"),
                      ensure_ascii=False).encode() == expected_bytes
    assert record.hash == hashlib.sha256(expected_bytes).hexdigest()
    assert record.hash == mod.canonical_hash(document)
    assert mod._HASH_RE.fullmatch(record.hash)


def test_a_panel_save_with_base_zero_over_a_stored_record_is_a_conflict(mod):
    """Base 0 says "nothing is stored"; a record that exists means someone
    made the first copy since the panel looked, so it reloads at that one."""
    store = _new(mod, paired={OWNER})
    _phone_behavior(store)
    with pytest.raises(mod.WatchConfigConflictError) as exc:
        store.panel_save(OWNER, "behavior", _behavior(), base_revision=0)
    assert exc.value.code == "conflict"
    assert (exc.value.revision, exc.value.hash) == (1, HASH_1)
    assert exc.value.message == "stored revision is 1, save was based on 0"
    assert store.get(OWNER, "behavior").revision == 1


def test_the_panel_never_creates_a_record_without_a_pairing_check(mod):
    store = _new(mod)
    for base in (0, 1, 7):
        with pytest.raises(mod.WatchConfigNoRecordError):
            store.panel_save(OWNER, "behavior", _behavior(), base_revision=base)
    assert store.get(OWNER, "behavior") is None
    assert _FakeStore.writes == []


def test_a_stale_panel_save_conflicts_with_the_stored_revision(mod):
    store = _new(mod)
    _phone_behavior(store)
    _put(store, kind="behavior", doc=_behavior(wrapPages=True), base=1, digest=HASH_2)
    with pytest.raises(mod.WatchConfigConflictError) as exc:
        store.panel_save(OWNER, "behavior", _behavior(), base_revision=1)
    assert exc.value.code == "conflict"
    assert exc.value.revision == 2
    assert exc.value.hash == HASH_2
    assert exc.value.message == "stored revision is 2, save was based on 1"
    assert store.get(OWNER, "behavior").document["wrapPages"] is True


def test_the_panel_may_save_pages(mod):
    store = _new(mod)
    original = _doc("phone")
    _put(store, doc=original)
    edited = _doc("panel")
    record = store.panel_save(OWNER, "pages", edited, base_revision=1)
    assert record.revision == 2
    assert record.updated_by == "panel"
    assert record.document == edited
    assert record.hash == mod.canonical_hash(edited)
    assert record.delivered_revision == 1
    assert [e.document for e in record.history] == [original]


def test_a_panel_save_of_pages_for_an_unpaired_watch_needs_a_device_copy_first(mod):
    store = _new(mod, paired={OTHER})
    with pytest.raises(mod.WatchConfigNoRecordError):
        store.panel_save(OWNER, "pages", _doc(), base_revision=0)
    with pytest.raises(mod.WatchConfigNoRecordError):
        store.panel_save(OWNER, "pages", _doc(), base_revision=1)
    _put(store)
    with pytest.raises(mod.WatchConfigConflictError):
        store.panel_save(OWNER, "pages", _doc(), base_revision=0)
    assert store.get(OWNER, "pages").revision == 1
    # Over the device's copy the panel saves as always, paired or not.
    assert store.panel_save(OWNER, "pages", _doc("panel"), base_revision=1).revision == 2


def test_the_panel_cannot_start_a_watch_config_under_an_iphone(mod):
    """With the check setup hands in (the real secret store's
    ``is_paired_watch``), a paired iPhone is not a paired watch: a first
    panel save under its id is refused, and one under a watch is made."""
    from test_widget_secret_user_binding import SECRET_A, SECRET_B, _loaded_store

    with _loaded_store() as secret_mod:
        secrets = secret_mod.WidgetSecretStore(object())
        secrets.register("iphone-1", SECRET_A, "iphone-self-provision", user_id="alice")
        secrets.register(OWNER, SECRET_B, "watch-code-pair", user_id="alice")
        store = mod.WatchConfigStore(_Hass(), is_paired=secrets.is_paired_watch)
        asyncio.run(store.async_load())

        with pytest.raises(mod.WatchConfigNoRecordError):
            store.panel_save("iphone-1", "pages", _doc(), base_revision=0)
        assert store.get("iphone-1", "pages") is None
        assert store.panel_save(OWNER, "pages", _doc(), base_revision=0).revision == 1


@pytest.mark.parametrize(
    ("kind", "document", "base"),
    [
        ("quick_actions", {}, 1),
        ("behavior", [], 1),
        ("behavior", {"b": "x" * MAX_BEHAVIOR_BYTES}, 1),
        ("behavior", {}, None),
        ("behavior", {}, True),
        ("behavior", {}, -1),
        ("behavior", {}, "1"),
    ],
)
def test_a_malformed_panel_save_is_invalid(mod, kind, document, base):
    store = _new(mod)
    _phone_behavior(store)
    with pytest.raises(mod.WatchConfigValidationError):
        store.panel_save(OWNER, kind, document, base_revision=base)
    assert store.get(OWNER, "behavior").revision == 1


def test_panel_saves_share_the_five_entry_history(mod):
    store = _new(mod)
    _phone_behavior(store)
    for revision in range(1, 8):
        store.panel_save(OWNER, "behavior", _behavior(n=revision), base_revision=revision)
    record = store.get(OWNER, "behavior")
    assert record.revision == 8
    assert [e.revision for e in record.history] == [3, 4, 5, 6, 7]


def test_a_panel_save_to_an_unreadable_owner_is_unavailable(mod):
    store = _new(mod)
    _phone_behavior(store)
    _FakeStore.unreadable.add(mod._owner_key(OWNER))
    again = _new(mod)
    with pytest.raises(mod.WatchConfigUnavailableError):
        again.panel_save(OWNER, "behavior", _behavior(), base_revision=1)


# ── live line: change listeners ──────────────────────────────────────────


def _listen(store) -> list[tuple[str, str, int]]:
    """Every change the store announces, as (owner, kind, revision)."""
    heard: list[tuple[str, str, int]] = []
    store.async_add_listener(
        lambda change: heard.append((change.owner_watch_id, change.kind, change.revision))
    )
    return heard


def test_every_device_save_is_announced_with_its_revision(mod):
    store = _new(mod)
    heard = _listen(store)
    _put(store)
    _put(store, base=1, digest=HASH_2)
    _put(store, kind="behavior", doc=_behavior())
    _put(store, base=0, force=True, digest=HASH_3)
    assert heard == [
        (OWNER, "pages", 1),
        (OWNER, "pages", 2),
        (OWNER, "behavior", 1),
        (OWNER, "pages", 3),
    ]


def test_a_panel_save_is_announced(mod):
    store = _new(mod)
    _phone_behavior(store)
    heard = _listen(store)
    store.panel_save(OWNER, "behavior", _behavior(wrapPages=True), base_revision=1)
    assert heard == [(OWNER, "behavior", 2)]


def test_a_refused_save_announces_nothing(mod):
    store = _new(mod)
    _phone_behavior(store)
    _put(store)
    heard = _listen(store)
    with pytest.raises(mod.WatchConfigConflictError):
        _put(store, kind="behavior", doc=_behavior(), base=0)
    with pytest.raises(mod.WatchConfigValidationError):
        _put(store, kind="behavior", doc=[], base=1)
    with pytest.raises(mod.WatchConfigConflictError):
        store.panel_save(OWNER, "behavior", _behavior(), base_revision=4)
    with pytest.raises(mod.WatchConfigNoRecordError):
        store.panel_save(OTHER, "behavior", _behavior(), base_revision=1)
    with pytest.raises(mod.WatchConfigValidationError):
        store.panel_save(OWNER, "pages", _pages(_page("P", items=[_item("T"), _item("T")])),
                         base_revision=1)
    with pytest.raises(mod.WatchConfigNotFoundError):
        store.restore(OWNER, "pages", 7, base_revision=1)
    assert store.report_unreadable(OWNER, "pages", 1) is True
    assert heard == []


def test_delivery_alone_is_not_a_change(mod):
    """What a signed get does on the phone's check: it moves delivery state
    and nothing else, so nobody is told."""
    store = _new(mod)
    _phone_behavior(store)
    store.panel_save(OWNER, "behavior", _behavior(wrapPages=True), base_revision=1)
    heard = _listen(store)
    assert store.mark_delivered(OWNER, "behavior", 2) is True
    assert store.mark_delivered(OWNER, "behavior", 2) is False
    assert heard == []


def test_a_forget_announces_revision_zero_for_each_kind_removed(mod):
    store = _new(mod)
    _put(store)
    _put(store, base=1, digest=HASH_2)
    _phone_behavior(store)
    _put(store, OTHER)
    heard = _listen(store)
    assert store.forget_owner(OWNER) is True
    assert heard == [(OWNER, "behavior", 0), (OWNER, "pages", 0)]


def test_forgetting_nothing_or_an_unreadable_owner_announces_nothing(mod):
    store = _new(mod)
    _put(store)
    _FakeStore.unreadable.add(mod._owner_key(OWNER))
    again = _new(mod)
    heard = _listen(again)
    assert again.forget_owner(OTHER) is False
    assert again.forget_owner(OWNER) is True
    assert heard == []


def test_a_kind_this_build_does_not_know_is_never_announced(mod):
    store = _new(mod)
    _put(store)
    key = mod._owner_key(OWNER)
    _FakeStore.files[key]["records"]["quick_actions"] = {
        "revision": 3, "hash": HASH_2, "updated_at": "", "updated_by": OWNER,
        "document": {"actions": []},
    }
    again = _new(mod)
    assert again.revisions(OWNER) == {"pages": 1}
    heard = _listen(again)
    again.forget_owner(OWNER)
    assert heard == [(OWNER, "pages", 0)]


def test_a_move_to_an_empty_target_announces_both_sides(mod):
    store = _new(mod)
    _put(store)
    _put(store, base=1, digest=HASH_2)
    _phone_behavior(store)
    heard = _listen(store)
    store.move_owner(OWNER, OTHER, updated_by="t")
    assert heard == [
        (OWNER, "behavior", 0),
        (OWNER, "pages", 0),
        (OTHER, "behavior", 1),
        (OTHER, "pages", 2),
    ]


def test_a_move_onto_a_kept_target_announces_the_target_s_own_revision(mod):
    store = _new(mod)
    _put(store, OWNER)
    _put(store, OTHER, digest=HASH_2)
    _put(store, OTHER, base=1, digest=HASH_3)
    _put(store, OTHER, base=2, digest=HASH_1)
    heard = _listen(store)
    store.move_owner(OWNER, OTHER, updated_by="t")
    assert heard == [(OWNER, "pages", 0), (OTHER, "pages", 3)]


def test_a_move_with_nothing_to_carry_announces_nothing(mod):
    store = _new(mod)
    _put(store, OTHER)
    heard = _listen(store)
    assert store.move_owner(OWNER, OTHER, updated_by="t") == []
    assert heard == []


def test_a_listener_sees_the_change_already_in_the_store(mod):
    store = _new(mod)
    seen: list[Any] = []
    store.async_add_listener(
        lambda change: seen.append(store.revisions(change.owner_watch_id))
    )
    _put(store)
    _phone_behavior(store)
    store.move_owner(OWNER, OTHER, updated_by="t")
    assert seen == [
        {"pages": 1},
        {"behavior": 1, "pages": 1},
        # The source's two forgets, then the target's two arrivals: every
        # listener call sees the move finished.
        {},
        {},
        {"behavior": 1, "pages": 1},
        {"behavior": 1, "pages": 1},
    ]


def test_a_listener_that_raises_never_breaks_a_save(mod):
    store = _new(mod)

    def _broken(_change) -> None:
        raise RuntimeError("listener bug")

    store.async_add_listener(_broken)
    heard = _listen(store)
    record = _put(store)
    assert record.revision == 1
    assert store.get(OWNER, "pages").revision == 1
    assert _FakeStore.files[mod._owner_key(OWNER)]["records"]["pages"]["revision"] == 1
    store.forget_owner(OWNER)
    # The listener after the broken one still heard both.
    assert heard == [(OWNER, "pages", 1), (OWNER, "pages", 0)]


def test_a_removed_listener_hears_nothing_more(mod):
    store = _new(mod)
    heard: list[Any] = []
    remove = store.async_add_listener(heard.append)
    _put(store)
    remove()
    remove()
    _put(store, base=1, digest=HASH_2)
    assert [(c.owner_watch_id, c.kind, c.revision) for c in heard] == [(OWNER, "pages", 1)]


def test_revisions_name_every_kind_the_owner_holds(mod):
    store = _new(mod)
    assert store.revisions(OWNER) == {}
    _put(store)
    _put(store, base=1, digest=HASH_2)
    _phone_behavior(store)
    assert store.revisions(OWNER) == {"behavior": 1, "pages": 2}
    assert store.revisions(OTHER) == {}


def test_revisions_of_an_unreadable_owner_are_unavailable(mod):
    store = _new(mod)
    _put(store)
    _FakeStore.unreadable.add(mod._owner_key(OWNER))
    again = _new(mod)
    with pytest.raises(mod.WatchConfigUnavailableError):
        again.revisions(OWNER)


# ── step 3: the page shape guard ─────────────────────────────────────────


def _item(item_id: str, entity_id: str = "light.made_up", **extra: Any) -> dict:
    item = {"id": item_id, "entityId": entity_id, "colSpan": 6}
    item.update(extra)
    return item


_NO_ITEMS = object()


def _page(page_id: Any, *, items: Any = _NO_ITEMS, **extra: Any) -> dict:
    """A page; ``items`` left out means no `items` key at all, while
    ``items=None`` writes a null one."""
    page: dict[str, Any] = {"id": page_id, "name": f"Page {page_id}"}
    if items is not _NO_ITEMS:
        page["items"] = items
    page.update(extra)
    return page


def _pages(*pages: Any) -> dict:
    return {"schemaVersion": 1, "pages": list(pages)}


def _panel_pages(store, doc: dict, base: int = 1):
    return store.panel_save(OWNER, "pages", doc, base_revision=base)


@pytest.mark.parametrize(
    ("pages", "message"),
    [
        ([["not", "a", "page"]], r"^document\.pages\[0\] must be an object$"),
        ([_page("A"), "B"], r"^document\.pages\[1\] must be an object$"),
        ([_page("A"), {"name": "no id"}], r"^document\.pages\[1\]\.id must be a non-empty string$"),
        ([_page("")], r"^document\.pages\[0\]\.id must be a non-empty string$"),
        ([_page(7)], r"^document\.pages\[0\]\.id must be a non-empty string$"),
        ([_page(None)], r"^document\.pages\[0\]\.id must be a non-empty string$"),
        (
            [_page("A"), _page("B"), _page("A")],
            r'^document\.pages\[2\] has the page id "A" of document\.pages\[0\]; '
            r"page ids must be unique$",
        ),
        # The app reads page ids as UUIDs, which parse the same in either case.
        (
            [_page("6f1c2d0e-0000-4000-8000-00000000000a"),
             _page("6F1C2D0E-0000-4000-8000-00000000000A")],
            r"^document\.pages\[1\] has the page id",
        ),
    ],
)
def test_the_page_level_is_refused_for_every_writer(mod, pages, message):
    store = _new(mod)
    with pytest.raises(mod.WatchConfigValidationError, match=message) as exc:
        _put(store, doc=_pages(*pages))
    assert exc.value.code == "invalid"
    assert store.get(OWNER, "pages") is None

    _put(store)
    with pytest.raises(mod.WatchConfigValidationError, match=message):
        _panel_pages(store, _pages(*pages))
    with pytest.raises(mod.WatchConfigValidationError, match=message):
        _put(store, doc=_pages(*pages), base=0, force=True, digest=HASH_2)
    assert store.get(OWNER, "pages").revision == 1


@pytest.mark.parametrize(
    "items",
    [
        [_item("T1"), _item("T1")],
        [_item("t1"), _item("T1")],
        "not a list",
        None,
        [["not an item"]],
        [{"entityId": "light.made_up"}],
        [_item("")],
        [_item("T1", entity_id="")],
        [{"id": "T1"}],
        [_item("T1", entity_id=None)],
    ],
)
def test_a_device_save_is_never_refused_for_a_tile_fault(mod, items):
    """A phone refused for its own old tiles could never upload again."""
    store = _new(mod)
    doc = _pages(_page("A", items=items))
    record = _put(store, doc=doc)
    assert record.revision == 1
    assert record.document == doc


@pytest.mark.parametrize(
    ("items", "message"),
    [
        (
            [_item("T1"), _item("T2"), _item("T1")],
            r'^document\.pages\[1\] \(id "B"\)\.items\[2\] has the item id "T1" of '
            r"items\[0\]; item ids must be unique in a page$",
        ),
        (
            [_item("abc"), _item("ABC")],
            r'^document\.pages\[1\] \(id "B"\)\.items\[1\] has the item id "ABC"',
        ),
        ("not a list", r'^document\.pages\[1\] \(id "B"\)\.items must be a list$'),
        (None, r'^document\.pages\[1\] \(id "B"\)\.items must be a list$'),
        ([_item("T1"), 3], r'^document\.pages\[1\] \(id "B"\)\.items\[1\] must be an object$'),
        (
            [{"entityId": "light.made_up"}],
            r'^document\.pages\[1\] \(id "B"\)\.items\[0\]\.id must be a non-empty string$',
        ),
        (
            [_item("")],
            r'^document\.pages\[1\] \(id "B"\)\.items\[0\]\.id must be a non-empty string$',
        ),
        (
            [{"id": "T1"}],
            r'^document\.pages\[1\] \(id "B"\)\.items\[0\]\.entityId must be a non-empty '
            r"string$",
        ),
        (
            [_item("T1", entity_id="")],
            r"\.items\[0\]\.entityId must be a non-empty string$",
        ),
        (
            [_item("T1", entity_id=["light.made_up"])],
            r"\.items\[0\]\.entityId must be a non-empty string$",
        ),
    ],
)
def test_a_panel_save_is_refused_for_a_tile_fault(mod, items, message):
    store = _new(mod)
    _put(store)
    doc = _pages(_page("A", items=[_item("T1")]), _page("B", items=items))
    with pytest.raises(mod.WatchConfigValidationError, match=message):
        _panel_pages(store, doc)
    assert store.get(OWNER, "pages").revision == 1


def test_a_panel_save_with_a_good_shape_is_accepted(mod):
    store = _new(mod)
    _put(store)
    doc = _pages(
        # The same item id on two pages is fine: ids are unique per page.
        _page("A", items=[_item("T1"), _item("T2", entity_id="spacer.made_up")]),
        _page("B", items=[_item("T1")]),
        # No items at all, and an empty list, are both fine.
        _page("C"),
        _page("D", items=[]),
    )
    assert _panel_pages(store, doc).revision == 2


def test_the_shape_guard_never_looks_at_other_keys(mod):
    """The shape, not the content: keys, values and nesting the server does
    not know pass through untouched."""
    store = _new(mod)
    _put(store)
    doc = _pages(
        _page("A", items=[_item("T1", holdSlideActions=["up", {"x": 1}], colSpan="wide")],
              groups=[{"id": "G", "items": "not checked here"}], gridDensity=None),
    )
    doc["futureKey"] = {"pages": "not the page list"}
    record = _panel_pages(store, doc)
    assert record.document == doc


def test_the_shape_guard_comes_before_the_conflict(mod):
    """A malformed save is refused as malformed even when it is also stale,
    the same as a device save."""
    store = _new(mod)
    _put(store)
    bad = _pages(_page("A"), _page("A"))
    with pytest.raises(mod.WatchConfigValidationError):
        _panel_pages(store, bad, base=9)
    with pytest.raises(mod.WatchConfigValidationError):
        _put(store, doc=bad, base=9)


def test_behavior_is_never_shape_checked(mod):
    store = _new(mod)
    doc = {"pages": [{"no": "id"}, {"no": "id"}], "items": [1, 1]}
    _put(store, kind="behavior", doc=doc)
    assert store.panel_save(OWNER, "behavior", doc, base_revision=1).revision == 2


# ── step 3: the unreadable report ────────────────────────────────────────


def test_a_report_about_the_stored_revision_is_kept(mod):
    store = _new(mod)
    _put(store)
    _panel_pages(store, _doc("panel"))
    record = store.get(OWNER, "pages")
    assert (record.rejected_revision, record.rejected_at) == (0, None)

    _FakeStore.writes.clear()
    assert store.report_unreadable(OWNER, "pages", 2) is True
    assert record.rejected_revision == 2
    assert record.rejected_at and record.rejected_at.endswith("Z")
    assert _FakeStore.writes == [mod._owner_key(OWNER)]
    stored = _FakeStore.files[mod._owner_key(OWNER)]["records"]["pages"]
    assert (stored["rejected_revision"], stored["rejected_at"]) == (2, record.rejected_at)
    # It is not a delivery, and it moves no revision.
    assert (record.revision, record.delivered_revision) == (2, 1)


def test_a_repeated_report_keeps_the_first_time_and_writes_nothing(mod):
    store = _new(mod)
    _put(store)
    store.report_unreadable(OWNER, "pages", 1)
    record = store.get(OWNER, "pages")
    record.rejected_at = "2026-10-01T20:00:00Z"
    _FakeStore.writes.clear()
    assert store.report_unreadable(OWNER, "pages", 1) is True
    assert record.rejected_at == "2026-10-01T20:00:00Z"
    assert _FakeStore.writes == []


@pytest.mark.parametrize("reported", [0, 1, 3, 99])
def test_a_stale_report_changes_nothing(mod, reported):
    store = _new(mod)
    _put(store)
    _put(store, base=1, digest=HASH_2)
    _FakeStore.writes.clear()
    assert store.report_unreadable(OWNER, "pages", reported) is False
    record = store.get(OWNER, "pages")
    assert (record.rejected_revision, record.rejected_at) == (0, None)
    assert _FakeStore.writes == []


def test_a_report_without_a_record_or_for_the_other_kind_changes_nothing(mod):
    store = _new(mod)
    assert store.report_unreadable(OWNER, "pages", 1) is False
    _put(store)
    assert store.report_unreadable(OWNER, "behavior", 1) is False
    assert store.report_unreadable(OTHER, "pages", 1) is False
    assert store.get(OWNER, "pages").rejected_revision == 0


def test_a_later_save_leaves_the_report_behind_without_clearing_it(mod):
    store = _new(mod)
    _put(store)
    store.report_unreadable(OWNER, "pages", 1)
    at = store.get(OWNER, "pages").rejected_at
    _panel_pages(store, _doc("fixed"))
    _put(store, doc=_doc("phone again"), base=2, digest=HASH_2)
    record = store.get(OWNER, "pages")
    assert record.revision == 3
    assert (record.rejected_revision, record.rejected_at) == (1, at)
    # A report about the new revision replaces the old one.
    assert store.report_unreadable(OWNER, "pages", 3) is True
    assert record.rejected_revision == 3


def test_the_report_survives_a_restart(mod):
    store = _new(mod)
    _put(store, kind="behavior", doc=_behavior())
    store.report_unreadable(OWNER, "behavior", 1)
    before = store.get(OWNER, "behavior")
    after = _new(mod).get(OWNER, "behavior")
    assert (after.rejected_revision, after.rejected_at) == (1, before.rejected_at)


def test_a_whole_move_carries_the_report_and_a_forget_drops_it(mod):
    store = _new(mod)
    _put(store)
    store.report_unreadable(OWNER, "pages", 1)
    at = store.get(OWNER, "pages").rejected_at

    store.move_owner(OWNER, OTHER, updated_by="t")
    moved = store.get(OTHER, "pages")
    assert (moved.rejected_revision, moved.rejected_at) == (1, at)
    assert (moved.delivered_revision, moved.delivered_at) == (0, None)

    store.forget_owner(OTHER)
    record = _put(store, OTHER)
    assert (record.rejected_revision, record.rejected_at) == (0, None)


def test_a_kept_target_keeps_its_own_report(mod):
    store = _new(mod)
    _put(store, OWNER)
    store.report_unreadable(OWNER, "pages", 1)
    _put(store, OTHER, digest=HASH_2)
    store.move_owner(OWNER, OTHER, updated_by="t")
    assert store.get(OTHER, "pages").rejected_revision == 0


def _pages_at_revision_five(store):
    _put(store)
    for base in range(1, 5):
        _panel_pages(store, _doc(f"panel {base}"), base=base)
    record = store.get(OWNER, "pages")
    assert record.revision == 5
    return record


def test_a_confirmed_delivery_clears_the_report_it_answers(mod):
    """The watch could not read revision 5, then read it later (an app update,
    say) and asked from it. The panel must stop saying it could not."""
    store = _new(mod)
    record = _pages_at_revision_five(store)
    assert store.report_unreadable(OWNER, "pages", 5) is True
    assert store.diagnostics()[OWNER]["pages"]["rejected_revision"] == 5

    _FakeStore.writes.clear()
    assert store.mark_delivered(OWNER, "pages", 5, confirmed=True) is True
    assert (record.rejected_revision, record.rejected_at) == (0, None)
    assert record.delivered_revision == 5
    assert _FakeStore.writes == [mod._owner_key(OWNER)]
    stored = _FakeStore.files[mod._owner_key(OWNER)]["records"]["pages"]
    assert (stored["rejected_revision"], stored["rejected_at"]) == (0, None)
    entry = store.diagnostics()[OWNER]["pages"]
    assert (entry["revision"], entry["rejected_revision"], entry["rejected_at"]) == (5, 0, None)
    # It stays cleared through a restart.
    assert _new(mod).get(OWNER, "pages").rejected_revision == 0


def test_a_delivery_that_only_carried_the_document_leaves_the_report(mod):
    """A get that sent the document out counts as a delivery before the watch
    has tried to read it, so it says nothing about whether it could."""
    store = _new(mod)
    record = _pages_at_revision_five(store)
    store.report_unreadable(OWNER, "pages", 5)
    at = record.rejected_at
    # The delivery itself moves; the report does not.
    assert store.mark_delivered(OWNER, "pages", 5) is True
    assert record.delivered_revision == 5
    assert (record.rejected_revision, record.rejected_at) == (5, at)
    # A repeat moves nothing and writes nothing.
    _FakeStore.writes.clear()
    assert store.mark_delivered(OWNER, "pages", 5) is False
    assert (record.rejected_revision, record.rejected_at) == (5, at)
    assert _FakeStore.writes == []


def test_a_confirmed_later_revision_clears_an_older_report(mod):
    store = _new(mod)
    _put(store)
    store.report_unreadable(OWNER, "pages", 1)
    _panel_pages(store, _doc("fixed"))
    record = store.get(OWNER, "pages")
    assert store.mark_delivered(OWNER, "pages", 2, confirmed=True) is True
    assert (record.rejected_revision, record.rejected_at) == (0, None)


def test_a_confirmed_delivery_with_nothing_to_clear_writes_nothing(mod):
    store = _new(mod)
    _pages_at_revision_five(store)
    store.mark_delivered(OWNER, "pages", 5)
    _FakeStore.writes.clear()
    assert store.mark_delivered(OWNER, "pages", 5, confirmed=True) is False
    assert _FakeStore.writes == []


def test_a_report_older_than_the_delivered_revision_does_not_flag(mod):
    store = _new(mod)
    record = _pages_at_revision_five(store)
    store.mark_delivered(OWNER, "pages", 5, confirmed=True)
    assert store.report_unreadable(OWNER, "pages", 4) is False
    assert (record.rejected_revision, record.rejected_at) == (0, None)


def test_a_phone_put_does_not_clear_the_watch_s_report(mod):
    """A put is the iPhone mirror writing; it says nothing about whether the
    watch could read the revision it reported."""
    store = _new(mod)
    _put(store)
    store.report_unreadable(OWNER, "pages", 1)
    _put(store, doc=_doc("phone again"), base=1, digest=HASH_2)
    assert store.get(OWNER, "pages").rejected_revision == 1


@pytest.mark.parametrize(
    ("raw_revision", "raw_at", "expected"),
    [
        (True, "2026-10-01T20:00:00Z", (0, None)),
        ("4", "2026-10-01T20:00:00Z", (0, None)),
        (-1, "2026-10-01T20:00:00Z", (0, None)),
        (9, "2026-10-01T20:00:00Z", (0, None)),
        (3, 17, (3, None)),
        (3, "", (3, None)),
        (0, "2026-10-01T20:00:00Z", (0, None)),
        (4, "2026-10-01T20:00:00Z", (4, "2026-10-01T20:00:00Z")),
    ],
)
def test_junk_report_fields_read_as_no_report(mod, raw_revision, raw_at, expected):
    key = mod._owner_key(OWNER)
    _FakeStore.files[INDEX_KEY] = {"owners": [OWNER]}
    _FakeStore.files[key] = {
        "owner_watch_id": OWNER,
        "records": {
            "pages": {
                "revision": 4, "hash": HASH_1, "updated_at": "", "updated_by": OWNER,
                "rejected_revision": raw_revision, "rejected_at": raw_at,
                "document": _doc(),
            }
        },
    }
    record = _new(mod).get(OWNER, "pages")
    assert record is not None
    assert (record.rejected_revision, record.rejected_at) == expected


# ── step 3: history and restore ──────────────────────────────────────────


def _three_saves(store) -> list[dict]:
    """Revisions 1 (phone), 2 (panel) and 3 (phone); returns their documents."""
    docs = [_doc("one"), _doc("two, a longer name"), _doc("three")]
    _put(store, doc=docs[0], digest=HASH_1)
    _panel_pages(store, docs[1])
    _put(store, doc=docs[2], base=2, digest=HASH_3)
    return docs


def test_history_is_newest_first_with_sizes_and_no_documents(mod):
    store = _new(mod)
    docs = _three_saves(store)
    entries = store.history(OWNER, "pages")
    assert [e.revision for e in entries] == [2, 1]
    summaries = [e.summary() for e in entries]
    record = store.get(OWNER, "pages")
    assert summaries == [
        {
            "revision": 2,
            "hash": mod.canonical_hash(docs[1]),
            "updated_at": record.history[1].updated_at,
            "updated_by": "panel",
            "size": mod.document_size(docs[1]),
        },
        {
            "revision": 1,
            "hash": HASH_1,
            "updated_at": record.history[0].updated_at,
            "updated_by": OWNER,
            "size": mod.document_size(docs[0]),
        },
    ]
    assert summaries[0]["size"] == len(
        json.dumps(docs[1], separators=(",", ":"), ensure_ascii=False).encode()
    )
    assert "one" not in repr(summaries)
    # Listing does not reorder what is stored.
    assert [e.revision for e in record.history] == [1, 2]


def test_history_without_a_record_or_without_a_replaced_save_is_empty(mod):
    store = _new(mod)
    assert store.history(OWNER, "pages") == []
    _put(store)
    assert store.history(OWNER, "pages") == []
    assert store.history(OWNER, "behavior") == []


def test_history_refuses_an_unknown_kind_and_an_unreadable_owner(mod):
    store = _new(mod)
    with pytest.raises(mod.WatchConfigValidationError):
        store.history(OWNER, "quick_actions")
    _put(store)
    _FakeStore.unreadable.add(mod._owner_key(OWNER))
    again = _new(mod)
    with pytest.raises(mod.WatchConfigUnavailableError):
        again.history(OWNER, "pages")


def test_history_keeps_only_five_and_lists_them_newest_first(mod):
    store = _new(mod)
    for revision in range(8):
        _put(store, doc=_doc(f"v{revision + 1}"), base=revision, digest=f"{revision:x}" * 64)
    assert [e.revision for e in store.history(OWNER, "pages")] == [7, 6, 5, 4, 3]


def test_a_history_entry_carries_its_document(mod):
    store = _new(mod)
    docs = _three_saves(store)
    entry = store.history_entry(OWNER, "pages", 1)
    assert entry.as_dict() == {
        "revision": 1,
        "hash": HASH_1,
        "updated_at": entry.updated_at,
        "updated_by": OWNER,
        "document": docs[0],
    }


@pytest.mark.parametrize("revision", [3, 4, 99])
def test_a_history_entry_that_is_not_there_is_not_found(mod, revision):
    """3 is the current revision: the record itself, not a history entry."""
    store = _new(mod)
    _three_saves(store)
    with pytest.raises(mod.WatchConfigNotFoundError) as exc:
        store.history_entry(OWNER, "pages", revision)
    assert exc.value.code == "not_found"
    assert exc.value.message == f"revision {revision} of pages is not in the history"


def test_a_history_entry_with_no_record_is_not_found(mod):
    store = _new(mod)
    with pytest.raises(mod.WatchConfigNotFoundError):
        store.history_entry(OWNER, "behavior", 1)


@pytest.mark.parametrize("revision", [0, -1, True, "1", 1.0, None])
def test_a_bad_history_revision_is_invalid(mod, revision):
    store = _new(mod)
    _three_saves(store)
    with pytest.raises(mod.WatchConfigValidationError, match="revision must be a positive"):
        store.history_entry(OWNER, "pages", revision)
    with pytest.raises(mod.WatchConfigValidationError, match="revision must be a positive"):
        store.restore(OWNER, "pages", revision, base_revision=3)


def test_restore_saves_the_old_document_as_a_new_panel_revision(mod):
    store = _new(mod)
    docs = _three_saves(store)
    heard = _listen(store)
    record = store.restore(OWNER, "pages", 1, base_revision=3)
    assert record.revision == 4
    assert record.updated_by == "panel"
    assert record.document == docs[0]
    assert record.hash == mod.canonical_hash(docs[0])
    # The current document is filed, and the restored entry stays.
    assert [e.revision for e in record.history] == [1, 2, 3]
    assert record.history[-1].document == docs[2]
    assert record.history[0].document == docs[0]
    # A copy, not the history entry's own object.
    assert record.document is not record.history[0].document
    # Delivery is left where it was, as for any panel save.
    assert record.delivered_revision == 3
    assert heard == [(OWNER, "pages", 4)]
    stored = _FakeStore.files[mod._owner_key(OWNER)]["records"]["pages"]
    assert (stored["revision"], stored["updated_by"], stored["document"]) == (4, "panel", docs[0])


def test_restore_on_a_stale_base_is_a_conflict(mod):
    store = _new(mod)
    _three_saves(store)
    heard = _listen(store)
    with pytest.raises(mod.WatchConfigConflictError) as exc:
        store.restore(OWNER, "pages", 1, base_revision=2)
    assert exc.value.code == "conflict"
    assert exc.value.message == "stored revision is 3, restore was based on 2"
    assert (exc.value.revision, exc.value.hash) == (3, HASH_3)
    # Stale wins over a missing entry: a panel with an old list reloads.
    with pytest.raises(mod.WatchConfigConflictError):
        store.restore(OWNER, "pages", 99, base_revision=2)
    assert store.get(OWNER, "pages").revision == 3
    assert heard == []


def test_restore_of_an_unknown_revision_is_not_found(mod):
    store = _new(mod)
    _three_saves(store)
    with pytest.raises(mod.WatchConfigNotFoundError, match="revision 3 of pages"):
        store.restore(OWNER, "pages", 3, base_revision=3)
    assert store.get(OWNER, "pages").revision == 3


def test_restore_without_a_record_is_no_record(mod):
    store = _new(mod)
    for base in (0, 1):
        with pytest.raises(mod.WatchConfigNoRecordError):
            store.restore(OWNER, "pages", 1, base_revision=base)
    _put(store)
    with pytest.raises(mod.WatchConfigNoRecordError):
        store.restore(OWNER, "pages", 1, base_revision=0)


def test_restore_of_a_behavior_record(mod):
    store = _new(mod)
    original = _behavior(keyThePanelHides=[1])
    _phone_behavior(store, original)
    store.panel_save(OWNER, "behavior", _behavior(wrapPages=True), base_revision=1)
    record = store.restore(OWNER, "behavior", 1, base_revision=2)
    assert (record.revision, record.updated_by, record.document) == (3, "panel", original)
    assert record.hash == mod.canonical_hash(original)


def test_restore_refuses_an_old_document_that_fails_the_tile_level(mod):
    """A device save never checks tiles, so an old entry may not pass; the
    restore is refused and nothing moves."""
    store = _new(mod)
    bad = _pages(_page("A", items=[_item("T1"), _item("T1")]))
    _put(store, doc=bad)
    _put(store, doc=_doc("fine"), base=1, digest=HASH_2)
    with pytest.raises(mod.WatchConfigValidationError, match="item ids must be unique"):
        store.restore(OWNER, "pages", 1, base_revision=2)
    record = store.get(OWNER, "pages")
    assert record.revision == 2
    assert [e.revision for e in record.history] == [1]


def test_restore_is_kept_across_a_restart(mod):
    store = _new(mod)
    docs = _three_saves(store)
    store.restore(OWNER, "pages", 2, base_revision=3)
    after = _new(mod).get(OWNER, "pages")
    assert (after.revision, after.updated_by, after.document) == (4, "panel", docs[1])
    assert [e.revision for e in after.history] == [1, 2, 3]


def test_restore_and_entry_take_the_newest_of_two_entries_sharing_a_revision(mod):
    """A move onto a watch with a record files the other watch's document
    with its own numbering, so two entries can share a revision."""
    store = _new(mod)
    _put(store, OWNER, _doc("old watch"))
    _put(store, OTHER, _doc("new watch"), digest=HASH_2)
    _put(store, OTHER, _doc("new watch 2"), base=1, digest=HASH_3)
    store.move_owner(OWNER, OTHER, updated_by="t")
    assert [e.revision for e in store.history(OTHER, "pages")] == [1, 1]
    assert store.history_entry(OTHER, "pages", 1).document == _doc("old watch")
    record = store.restore(OTHER, "pages", 1, base_revision=2)
    assert record.document == _doc("old watch")


def test_restore_of_a_kind_the_panel_may_not_save_is_invalid(mod):
    store = _new(mod)
    with pytest.raises(mod.WatchConfigValidationError, match="kind"):
        store.restore(OWNER, "quick_actions", 1, base_revision=1)


# ── step 3e: the catalog kind ────────────────────────────────────────────


def _catalog(**extra: Any) -> dict:
    """A stand-in for WatchLibraryCatalog, in the contract's shape."""
    doc = {
        "httpActions": [
            {"icon": "car.fill", "iconColor": "#A0C8FF",
             "id": "6F1C2D0E-0000-4000-8000-0000000000A1", "name": "Open Gate"},
            {"id": "6F1C2D0E-0000-4000-8000-0000000000A2", "name": "HTTP Action",
             "needsSetup": True},
        ],
        "macros": [
            {"colorHex": "#FF9F0A", "icon": "moon.fill",
             "id": "6F1C2D0E-0000-4000-8000-0000000000B1", "name": "Bedtime", "steps": 4},
        ],
        "schemaVersion": 1,
        "statusPages": [
            {"id": "00000000-0000-0000-0000-000000000001", "name": "Lights", "rows": 1},
        ],
    }
    doc.update(extra)
    return doc


def test_a_device_may_save_and_read_a_catalog(mod):
    store = _new(mod)
    doc = _catalog(futureKey={"kept": True})
    record = _put(store, kind="catalog", doc=doc)
    assert record.revision == 1
    assert record.delivered_revision == 1
    assert store.get(OWNER, "catalog").document == doc
    record = _put(store, kind="catalog", doc=_catalog(), base=1, digest=HASH_2)
    assert record.revision == 2
    assert [e.revision for e in store.history(OWNER, "catalog")] == [1]


@pytest.mark.parametrize(
    "document",
    [
        {},
        {"schemaVersion": 1},
        {"httpActions": [], "macros": [], "statusPages": []},
        {"macros": [{"id": "m", "name": ""}]},
        {"httpActions": [{"id": "a", "name": "A", "url": "ignored", "extra": [1]}]},
    ],
)
def test_a_catalog_with_any_lists_absent_or_empty_is_accepted(mod, document):
    store = _new(mod)
    assert _put(store, kind="catalog", doc=document).document == document


@pytest.mark.parametrize(
    ("document", "message"),
    [
        ([], "document must be a JSON object"),
        ({"httpActions": {}}, "document.httpActions must be a list"),
        ({"macros": None}, "document.macros must be a list"),
        ({"statusPages": "Lights"}, "document.statusPages must be a list"),
        ({"httpActions": ["Open Gate"]}, r"document.httpActions\[0\] must be an object"),
        ({"macros": [{"id": "m", "name": "M"}, {"name": "No id"}]},
         r"document.macros\[1\].id must be a non-empty string"),
        ({"statusPages": [{"id": "", "name": "Lights"}]},
         r"document.statusPages\[0\].id must be a non-empty string"),
        ({"httpActions": [{"id": 7, "name": "Seven"}]},
         r"document.httpActions\[0\].id must be a non-empty string"),
        ({"httpActions": [{"id": "a"}]}, r"document.httpActions\[0\].name must be a string"),
        ({"macros": [{"id": "m", "name": None}]}, r"document.macros\[0\].name must be a string"),
    ],
)
def test_a_catalog_of_the_wrong_shape_is_refused(mod, document, message):
    store = _new(mod)
    with pytest.raises(mod.WatchConfigValidationError, match=message):
        _put(store, kind="catalog", doc=document)
    assert store.get(OWNER, "catalog") is None
    assert _FakeStore.writes == []


def test_the_catalog_has_its_own_cap(mod):
    store = _new(mod)
    overhead = mod.document_size({"b": ""})
    at_cap = {"b": "x" * (MAX_CATALOG_BYTES - overhead)}
    assert _put(store, kind="catalog", doc=at_cap).revision == 1
    over = {"b": "x" * (MAX_CATALOG_BYTES - overhead + 1)}
    with pytest.raises(mod.WatchConfigValidationError, match="limit for catalog"):
        _put(store, kind="catalog", doc=over, base=1)


def test_the_panel_may_neither_save_nor_restore_a_catalog(mod):
    store = _new(mod)
    _put(store, kind="catalog", doc=_catalog())
    _put(store, kind="catalog", doc=_catalog(schemaVersion=2), base=1, digest=HASH_2)
    with pytest.raises(mod.WatchConfigValidationError) as exc:
        store.panel_save(OWNER, "catalog", _catalog(), base_revision=2)
    assert exc.value.code == "invalid"
    assert exc.value.message == (
        "the panel cannot save catalog; it may save behavior, control_center, "
        "menus, notification_style, pages, rooms, status_pages, voice"
    )
    with pytest.raises(mod.WatchConfigValidationError, match="the panel cannot save catalog"):
        store.restore(OWNER, "catalog", 1, base_revision=2)
    record = store.get(OWNER, "catalog")
    assert (record.revision, record.hash, record.updated_by) == (2, HASH_2, OWNER)


def test_the_catalog_is_announced_listed_moved_and_forgotten_like_any_kind(mod):
    store = _new(mod)
    heard = _listen(store)
    _put(store)
    _put(store, kind="catalog", doc=_catalog())
    assert heard == [(OWNER, "pages", 1), (OWNER, "catalog", 1)]
    assert store.revisions(OWNER) == {"catalog": 1, "pages": 1}
    assert sorted(store.move_owner(OWNER, OTHER, updated_by="t")) == ["catalog", "pages"]
    assert store.get(OTHER, "catalog").document == _catalog()
    assert store.revisions(OTHER) == {"catalog": 1, "pages": 1}
    del heard[:]
    assert store.forget_owner(OTHER) is True
    assert sorted(heard) == [(OTHER, "catalog", 0), (OTHER, "pages", 0)]
    assert store.revisions(OTHER) == {}


# ── step 4d: the menus kind ──────────────────────────────────────────────

_SLOT_A = "6F1C2D0E-0000-4000-8000-0000000000C1"
_SLOT_B = "6F1C2D0E-0000-4000-8000-0000000000C2"


def _menus(**extra: Any) -> dict:
    """A stand-in for the menus document in the contract's shape: the three
    sections, each with its own schemaVersion and keys the store never reads."""
    doc = {
        "schemaVersion": 1,
        "quickAction": {
            "schemaVersion": 1,
            "glowIntensity": 0.6,
            "slots": [
                {"id": _SLOT_A, "position": "top", "action": {"type": "assist"}},
                {"id": _SLOT_B, "position": "right", "isVisible": False},
            ],
        },
        "entityRadial": {
            "schemaVersion": 1,
            "allSlots": [{"id": _SLOT_A, "action": "toggle"}],
            "lightSlots": [{"id": _SLOT_A}, {"id": _SLOT_B}],
            "lightInheritsAll": True,
            "entityOverrides": {"light.made_up": [{"id": _SLOT_B, "action": "on"}]},
        },
        "pageSwitcher": {"schemaVersion": 1, "displayMode": "icons", "iconSize": 24},
    }
    doc.update(extra)
    return doc


def test_a_device_may_save_and_read_menus(mod):
    store = _new(mod)
    heard = _listen(store)
    doc = _menus(futureKey={"kept": True})
    record = _put(store, kind="menus", doc=doc)
    assert (record.revision, record.delivered_revision) == (1, 1)
    assert store.get(OWNER, "menus").document == doc
    record = _put(store, kind="menus", doc=_menus(), base=1, digest=HASH_2)
    assert record.revision == 2
    assert [e.revision for e in store.history(OWNER, "menus")] == [1]
    assert heard == [(OWNER, "menus", 1), (OWNER, "menus", 2)]
    assert store.revisions(OWNER) == {"menus": 2}


def _sections(**given) -> dict:
    """A menus document with every section present, the given ones filled."""
    return {"quickAction": {}, "entityRadial": {}, "pageSwitcher": {}, **given}


@pytest.mark.parametrize(
    "document",
    [
        _sections(),
        _sections(schemaVersion=1),
        _sections(quickAction={"slots": []}),
        _sections(entityRadial={"lightSlots": [], "entityOverrides": {}}),
        # Keys that do not end in Slots are never looked at.
        _sections(entityRadial={"lightInheritsAll": "yes", "slotsCount": 3, "beamStyle": None}),
        _sections(pageSwitcher={"slots": "not a list, and never read"}),
        # The same id in two lists is two menus, not a clash.
        _sections(quickAction={"slots": [{"id": "a"}]},
                  entityRadial={"allSlots": [{"id": "a"}], "lightSlots": [{"id": "a"}],
                                "entityOverrides": {"light.x": [{"id": "a"}]}}),
    ],
)
def test_menus_of_any_shape_the_guard_allows_are_accepted(mod, document):
    store = _new(mod)
    assert _put(store, kind="menus", doc=document).document == document


def _without(key: str) -> dict:
    document = _sections()
    del document[key]
    return document


@pytest.mark.parametrize(
    ("document", "message"),
    [
        ([], "document must be a JSON object"),
        ({}, "document.quickAction is required"),
        (_without("quickAction"), "document.quickAction is required"),
        (_without("entityRadial"), "document.entityRadial is required"),
        (_without("pageSwitcher"), "document.pageSwitcher is required"),
        (_sections(quickAction=[]), "document.quickAction must be an object"),
        (_sections(entityRadial=None), "document.entityRadial must be an object"),
        (_sections(pageSwitcher="icons"), "document.pageSwitcher must be an object"),
        (_sections(quickAction={"slots": {}}), "document.quickAction.slots must be a list"),
        (_sections(quickAction={"slots": None}), "document.quickAction.slots must be a list"),
        (_sections(quickAction={"slots": ["top"]}),
         r"document.quickAction.slots\[0\] must be an object"),
        (_sections(quickAction={"slots": [{"id": "a"}, {"position": "top"}]}),
         r"document.quickAction.slots\[1\].id must be a non-empty string"),
        (_sections(quickAction={"slots": [{"id": ""}]}),
         r"document.quickAction.slots\[0\].id must be a non-empty string"),
        (_sections(quickAction={"slots": [{"id": 7}]}),
         r"document.quickAction.slots\[0\].id must be a non-empty string"),
        (_sections(quickAction={"slots": [{"id": "ab"}, {"id": "c"}, {"id": "AB"}]}),
         r'document.quickAction.slots\[2\] has the slot id "AB" of '
         r"document.quickAction.slots\[0\]; slot ids must be unique in a list"),
        (_sections(entityRadial={"lightSlots": {}}),
         "document.entityRadial.lightSlots must be a list"),
        (_sections(entityRadial={"httpActionSlots": [{"id": "a"}, {"id": "a"}]}),
         r"document.entityRadial.httpActionSlots\[1\] has the slot id"),
        (_sections(entityRadial={"futureDomainSlots": [{}]}),
         r"document.entityRadial.futureDomainSlots\[0\].id must be a non-empty string"),
        (_sections(entityRadial={"entityOverrides": []}),
         "document.entityRadial.entityOverrides must be an object"),
        (_sections(entityRadial={"entityOverrides": {"light.x": {}}}),
         r'document.entityRadial.entityOverrides\["light.x"\] must be a list'),
        (_sections(entityRadial={"entityOverrides": {"light.x": [{"id": "a"}, {"id": "a"}]}}),
         r'document.entityRadial.entityOverrides\["light.x"\]\[1\] has the slot id'),
    ],
)
def test_menus_of_the_wrong_shape_are_refused(mod, document, message):
    store = _new(mod)
    with pytest.raises(mod.WatchConfigValidationError, match=message):
        _put(store, kind="menus", doc=document)
    assert store.get(OWNER, "menus") is None
    assert _FakeStore.writes == []


def test_the_menus_have_their_own_cap(mod):
    store = _new(mod)
    overhead = mod.document_size(_sections(b=""))
    at_cap = _sections(b="x" * (MAX_MENUS_BYTES - overhead))
    assert _put(store, kind="menus", doc=at_cap).revision == 1
    over = _sections(b="x" * (MAX_MENUS_BYTES - overhead + 1))
    with pytest.raises(mod.WatchConfigValidationError, match="limit for menus"):
        _put(store, kind="menus", doc=over, base=1)


def test_the_panel_may_save_and_restore_menus(mod):
    store = _new(mod)
    original = _menus()
    _put(store, kind="menus", doc=original)
    edited = _menus(pageSwitcher={"schemaVersion": 1, "displayMode": "text"})
    record = store.panel_save(OWNER, "menus", edited, base_revision=1)
    assert (record.revision, record.updated_by, record.document) == (2, "panel", edited)
    assert record.hash == mod.canonical_hash(edited)
    assert record.delivered_revision == 1
    record = store.restore(OWNER, "menus", 1, base_revision=2)
    assert (record.revision, record.updated_by, record.document) == (3, "panel", original)


def test_a_panel_save_of_menus_is_shape_checked(mod):
    store = _new(mod)
    _put(store, kind="menus", doc=_menus())
    bad = _menus(quickAction={"slots": [{"id": "a"}, {"id": "a"}]})
    with pytest.raises(mod.WatchConfigValidationError, match="slot ids must be unique"):
        store.panel_save(OWNER, "menus", bad, base_revision=1)
    assert store.get(OWNER, "menus").revision == 1


# ── step 4d: the panel creates a first record for a paired watch ─────────


def _first_copy(kind: str) -> dict:
    return {
        "pages": _doc("panel"),
        "behavior": _behavior(),
        "menus": _menus(),
        "voice": _voice(),
        "notification_style": _notification_style(),
        "status_pages": _status_pages(),
        "control_center": _control_center(),
        "rooms": _rooms(),
    }[kind]


@pytest.mark.parametrize("kind", sorted(PANEL_KINDS))
def test_the_panel_creates_revision_one_for_a_paired_watch(mod, kind):
    store = _new(mod, paired={OWNER})
    heard = _listen(store)
    document = _first_copy(kind)
    record = store.panel_save(OWNER, kind, document, base_revision=0)
    assert (record.owner_watch_id, record.kind, record.revision) == (OWNER, kind, 1)
    assert (record.updated_by, record.document) == ("panel", document)
    assert record.hash == mod.canonical_hash(document)
    assert record.size_bytes == mod.document_size(document)
    assert record.history == []
    assert (record.delivered_revision, record.delivered_at) == (0, None)
    assert (record.rejected_revision, record.rejected_at) == (0, None)
    assert record.updated_at
    assert store.get(OWNER, kind) is record
    assert heard == [(OWNER, kind, 1)]
    # Written to the owner's own file, and the owner joins the index.
    written = _FakeStore.files[mod._owner_key(OWNER)]["records"][kind]
    assert (written["revision"], written["updated_by"], written["document"]) == (
        1, "panel", document
    )
    assert "history" not in written
    assert _FakeStore.files[INDEX_KEY] == {"owners": [OWNER]}
    again = _new(mod).get(OWNER, kind)
    assert (again.revision, again.hash, again.document) == (1, record.hash, document)


def test_a_created_record_is_then_saved_like_any_other(mod):
    store = _new(mod, paired={OWNER})
    store.panel_save(OWNER, "menus", _menus(), base_revision=0)
    # A device that fetched revision 1 holds it, and its next upload builds on it.
    assert store.mark_delivered(OWNER, "menus", 1) is True
    with pytest.raises(mod.WatchConfigConflictError) as exc:
        _put(store, kind="menus", doc=_menus(), base=0)
    assert exc.value.revision == 1
    assert _put(store, kind="menus", doc=_menus(), base=1, digest=HASH_2).revision == 2
    record = store.panel_save(OWNER, "menus", _menus(schemaVersion=2), base_revision=2)
    assert record.revision == 3
    assert [e.revision for e in record.history] == [1, 2]
    assert record.history[0].updated_by == "panel"


def test_a_create_beside_another_kind_keeps_the_owner_s_other_records(mod):
    store = _new(mod, paired={OWNER})
    _put(store)
    store.panel_save(OWNER, "menus", _menus(), base_revision=0)
    assert store.revisions(OWNER) == {"menus": 1, "pages": 1}
    records = _FakeStore.files[mod._owner_key(OWNER)]["records"]
    assert sorted(records) == ["menus", "pages"]


def test_the_panel_never_creates_a_record_for_a_watch_that_is_not_paired(mod):
    store = _new(mod, paired={OTHER})
    heard = _listen(store)
    with pytest.raises(mod.WatchConfigNoRecordError) as exc:
        store.panel_save(OWNER, "menus", _menus(), base_revision=0)
    assert exc.value.code == "no_record"
    assert exc.value.message == (
        "there is no stored menus record and this watch is not paired; "
        "pair it before starting its config here"
    )
    assert store.get(OWNER, "menus") is None
    assert heard == []
    assert _FakeStore.writes == []


def test_a_create_needs_base_zero(mod):
    store = _new(mod, paired={OWNER})
    with pytest.raises(mod.WatchConfigNoRecordError, match="no stored menus record"):
        store.panel_save(OWNER, "menus", _menus(), base_revision=1)
    assert store.get(OWNER, "menus") is None
    assert _FakeStore.writes == []


def test_a_create_is_checked_before_the_pairing_is_asked(mod):
    asked: list[str] = []

    def is_paired(owner: str) -> bool:
        asked.append(owner)
        return True

    store = mod.WatchConfigStore(_Hass(), is_paired=is_paired)
    asyncio.run(store.async_load())
    with pytest.raises(mod.WatchConfigValidationError, match="slot ids must be unique"):
        store.panel_save(
            OWNER, "menus", _sections(quickAction={"slots": [{"id": "a"}, {"id": "a"}]}),
            base_revision=0,
        )
    with pytest.raises(mod.WatchConfigValidationError, match="the panel cannot save catalog"):
        store.panel_save(OWNER, "catalog", _catalog(), base_revision=0)
    assert asked == []
    # A save over a stored record never asks either.
    _put(store, kind="behavior", doc=_behavior())
    store.panel_save(OWNER, "behavior", _behavior(wrapPages=True), base_revision=1)
    assert asked == []
    store.panel_save(OWNER, "menus", _menus(), base_revision=0)
    assert asked == [OWNER]


def test_a_create_for_an_unreadable_owner_is_unavailable(mod):
    _FakeStore.files[INDEX_KEY] = {"owners": [OWNER]}
    _FakeStore.unreadable.add(mod._owner_key(OWNER))
    store = _new(mod, paired={OWNER})
    with pytest.raises(mod.WatchConfigUnavailableError):
        store.panel_save(OWNER, "menus", _menus(), base_revision=0)
    # Only the load's revision floor, into the index; the owner's file is
    # never written.
    assert _FakeStore.writes == [INDEX_KEY]


def test_a_restore_never_creates_even_for_a_paired_watch(mod):
    store = _new(mod, paired={OWNER})
    for base in (0, 1):
        with pytest.raises(mod.WatchConfigNoRecordError):
            store.restore(OWNER, "menus", 1, base_revision=base)
    assert store.get(OWNER, "menus") is None


# ── step 4d batch 2: voice, notification style, status pages ─────────────

_PHRASE_A = "6F1C2D0E-0000-4000-8000-0000000000D1"
_PHRASE_B = "6F1C2D0E-0000-4000-8000-0000000000D2"
_STATUS_PAGE_A = "00000000-0000-0000-0000-000000000001"
_STATUS_PAGE_B = "00000000-0000-0000-0000-000000000002"
_ROW_A = "6F1C2D0E-0000-4000-8000-0000000000E1"
_ROW_B = "6F1C2D0E-0000-4000-8000-0000000000E2"

_NEW_KINDS = ("voice", "notification_style", "status_pages")


def _phrase(phrase_id: str, **extra: Any) -> dict:
    phrase = {
        "id": phrase_id,
        "message": "Dinner is ready",
        "label": "Dinner",
        "icon": "fork.knife",
        "color": "orange",
        "displayMode": "icon",
        "targetSpeakers": ["media_player.made_up_kitchen"],
    }
    phrase.update(extra)
    return phrase


def _voice(**extra: Any) -> dict:
    """A stand-in for TTSConfiguration as the app stores it, made-up entities
    only."""
    doc = {
        "schemaVersion": 1,
        "phrases": [_phrase(_PHRASE_A), _phrase(_PHRASE_B, label="Bed")],
        "defaultTTSEngine": "tts.made_up_engine",
        "defaultSpeakers": ["media_player.made_up_kitchen"],
        "defaultAssistAgentId": "conversation.made_up_agent",
        "watchSpeakReplyInSilentMode": False,
        "watchSpeechVoiceIdentifier": "com.apple.voice.compact.en-US.Samantha",
    }
    doc.update(extra)
    return doc


def _notification_style(**extra: Any) -> dict:
    """A stand-in for NotificationStyleConfig: a flat object the store never
    reads past the envelope."""
    doc = {
        "schemaVersion": 1,
        "buttonFill": "tinted",
        "storedDeliveryMode": "direct",
        "tapSoundVolume": 0.4,
    }
    doc.update(extra)
    return doc


def _row(row_id: str, **extra: Any) -> dict:
    row = {
        "id": row_id,
        "rowType": "entity",
        "entityId": "sensor.made_up_temperature",
        "displayName": "Temperature",
        "domain": "sensor",
        "iconName": "thermometer",
    }
    row.update(extra)
    return row


def _status_pages(**extra: Any) -> dict:
    """The status pages document: the app's bare array of StatusPageConfig,
    wrapped in an object."""
    doc = {
        "schemaVersion": 1,
        "statusPages": [
            {"id": _STATUS_PAGE_A, "name": "Climate", "isSystemDefault": True,
             "rows": [_row(_ROW_A), _row(_ROW_B, rowType="sectionHeader")],
             "rowStyle": "plain"},
            {"id": _STATUS_PAGE_B, "name": "Doors", "rows": []},
        ],
    }
    doc.update(extra)
    return doc


@pytest.mark.parametrize("kind", _NEW_KINDS)
def test_a_device_may_save_and_read_each_batch_2_kind(mod, kind):
    store = _new(mod)
    heard = _listen(store)
    doc = _first_copy(kind)
    doc["futureKey"] = {"kept": True}
    record = _put(store, kind=kind, doc=doc)
    assert (record.revision, record.delivered_revision, record.hash) == (1, 1, HASH_1)
    assert store.get(OWNER, kind).document == doc
    record = _put(store, kind=kind, doc=_first_copy(kind), base=1, digest=HASH_2)
    assert record.revision == 2
    assert [e.revision for e in store.history(OWNER, kind)] == [1]
    assert heard == [(OWNER, kind, 1), (OWNER, kind, 2)]
    assert store.revisions(OWNER) == {kind: 2}


@pytest.mark.parametrize(
    ("kind", "cap"),
    [
        ("voice", MAX_VOICE_BYTES),
        ("notification_style", MAX_NOTIFICATION_STYLE_BYTES),
        ("status_pages", MAX_STATUS_PAGES_BYTES),
    ],
)
def test_each_batch_2_kind_has_its_own_cap(mod, kind, cap):
    store = _new(mod)
    base = _first_copy(kind)
    overhead = mod.document_size({**base, "b": ""})
    assert _put(store, kind=kind, doc={**base, "b": "x" * (cap - overhead)}).revision == 1
    with pytest.raises(mod.WatchConfigValidationError, match=f"limit for {kind}"):
        _put(store, kind=kind, doc={**base, "b": "x" * (cap - overhead + 1)}, base=1)


@pytest.mark.parametrize(
    "document",
    [
        {"phrases": []},
        _voice(),
        _voice(phrases=[_phrase(f"P{i}") for i in range(8)]),
        # The optionals may be null, as a JSON writer may spell "not set".
        _voice(defaultAssistAgentId=None, watchSpeakReplyInSilentMode=None,
               watchSpeechVoiceIdentifier=None, schemaVersion=None),
        _voice(defaultSpeakers=[]),
        # A phrase's keys besides its id are never looked at.
        _voice(phrases=[{"id": "a", "message": 7, "volume": "loud"}]),
    ],
)
def test_voice_settings_of_any_shape_the_guard_allows_are_accepted(mod, document):
    store = _new(mod)
    assert _put(store, kind="voice", doc=document).document == document


@pytest.mark.parametrize(
    ("document", "message"),
    [
        ([], "document must be a JSON object"),
        ({}, "document.phrases must be a list"),
        (_voice(phrases=None), "document.phrases must be a list"),
        (_voice(phrases={}), "document.phrases must be a list"),
        (_voice(phrases=[_phrase(f"P{i}") for i in range(9)]),
         "document.phrases holds 9 phrases; the limit is 8"),
        (_voice(phrases=["Dinner"]), r"document.phrases\[0\] must be an object"),
        (_voice(phrases=[_phrase("a"), {"message": "hi"}]),
         r"document.phrases\[1\].id must be a non-empty string"),
        (_voice(phrases=[_phrase("")]), r"document.phrases\[0\].id must be a non-empty string"),
        (_voice(phrases=[_phrase(3)]), r"document.phrases\[0\].id must be a non-empty string"),
        (_voice(phrases=[_phrase("ab"), _phrase("c"), _phrase("AB")]),
         r'document.phrases\[2\] has the phrase id "AB" of document.phrases\[0\]; '
         "phrase ids must be unique"),
        (_voice(defaultSpeakers="media_player.made_up"),
         "document.defaultSpeakers must be a list of strings"),
        (_voice(defaultSpeakers=[None]), "document.defaultSpeakers must be a list of strings"),
        (_voice(defaultSpeakers=None), "document.defaultSpeakers must be a list of strings"),
        (_voice(defaultTTSEngine=None), "document.defaultTTSEngine must be a string"),
        (_voice(defaultAssistAgentId=4), "document.defaultAssistAgentId must be a string"),
        (_voice(watchSpeechVoiceIdentifier=[]),
         "document.watchSpeechVoiceIdentifier must be a string"),
        (_voice(watchSpeakReplyInSilentMode="yes"),
         "document.watchSpeakReplyInSilentMode must be a bool"),
        (_voice(schemaVersion="1"), "document.schemaVersion must be an integer"),
        (_voice(schemaVersion=True), "document.schemaVersion must be an integer"),
    ],
)
def test_voice_settings_of_the_wrong_shape_are_refused(mod, document, message):
    store = _new(mod)
    with pytest.raises(mod.WatchConfigValidationError, match=message):
        _put(store, kind="voice", doc=document)
    assert store.get(OWNER, "voice") is None
    assert _FakeStore.writes == []


@pytest.mark.parametrize("document", [{}, _notification_style(), {"anything": [1, None]}])
def test_the_notification_style_is_any_json_object(mod, document):
    store = _new(mod)
    assert _put(store, kind="notification_style", doc=document).document == document


@pytest.mark.parametrize("document", [[], "direct", 3])
def test_a_notification_style_that_is_not_an_object_is_refused(mod, document):
    store = _new(mod)
    with pytest.raises(mod.WatchConfigValidationError, match="document must be a JSON object"):
        _put(store, kind="notification_style", doc=document)
    assert store.get(OWNER, "notification_style") is None


def _pages_of(*pages: Any) -> dict:
    return {"schemaVersion": 1, "statusPages": list(pages)}


@pytest.mark.parametrize(
    "document",
    [
        {"statusPages": []},
        _status_pages(),
        # The same row id in two pages is two lists, not a clash.
        _pages_of({"id": "a", "name": "A", "rows": [{"id": "r"}]},
                  {"id": "b", "name": "", "rows": [{"id": "r"}]}),
        # Keys besides the ids and the name are never looked at.
        _pages_of({"id": "a", "name": "A", "rows": [{"id": "r", "rowType": 9}],
                   "rowSpacing": "wide"}),
    ],
)
def test_status_pages_of_any_shape_the_guard_allows_are_accepted(mod, document):
    store = _new(mod)
    assert _put(store, kind="status_pages", doc=document).document == document


@pytest.mark.parametrize(
    ("document", "message"),
    [
        ([], "document must be a JSON object"),
        ({}, "document.statusPages must be a list"),
        ({"statusPages": {}}, "document.statusPages must be a list"),
        (_pages_of("Climate"), r"document.statusPages\[0\] must be an object"),
        (_pages_of({"name": "A", "rows": []}),
         r"document.statusPages\[0\].id must be a non-empty string"),
        (_pages_of({"id": "", "name": "A", "rows": []}),
         r"document.statusPages\[0\].id must be a non-empty string"),
        (_pages_of({"id": "ab", "name": "A", "rows": []}, {"id": "AB", "name": "B", "rows": []}),
         r'document.statusPages\[1\] has the page id "AB" of document.statusPages\[0\]; '
         "page ids must be unique"),
        (_pages_of({"id": "a", "rows": []}), r"document.statusPages\[0\].name must be a string"),
        (_pages_of({"id": "a", "name": None, "rows": []}),
         r"document.statusPages\[0\].name must be a string"),
        (_pages_of({"id": "a", "name": "A"}), r"document.statusPages\[0\].rows must be a list"),
        (_pages_of({"id": "a", "name": "A", "rows": {}}),
         r"document.statusPages\[0\].rows must be a list"),
        (_pages_of({"id": "a", "name": "A", "rows": ["sensor.x"]}),
         r"document.statusPages\[0\].rows\[0\] must be an object"),
        (_pages_of({"id": "a", "name": "A", "rows": [{"id": "r"}, {"entityId": "sensor.x"}]}),
         r"document.statusPages\[0\].rows\[1\].id must be a non-empty string"),
        (_pages_of({"id": "a", "name": "A", "rows": [{"id": "r"}, {"id": "R"}]}),
         r'document.statusPages\[0\].rows\[1\] has the row id "R" of rows\[0\]; '
         "row ids must be unique in a page"),
    ],
)
def test_status_pages_of_the_wrong_shape_are_refused(mod, document, message):
    store = _new(mod)
    with pytest.raises(mod.WatchConfigValidationError, match=message):
        _put(store, kind="status_pages", doc=document)
    assert store.get(OWNER, "status_pages") is None
    assert _FakeStore.writes == []


@pytest.mark.parametrize("kind", _NEW_KINDS)
def test_the_panel_may_save_and_restore_each_batch_2_kind(mod, kind):
    store = _new(mod)
    original = _first_copy(kind)
    _put(store, kind=kind, doc=original)
    edited = {**original, "schemaVersion": 2}
    record = store.panel_save(OWNER, kind, edited, base_revision=1)
    assert (record.revision, record.updated_by, record.document) == (2, "panel", edited)
    assert record.hash == mod.canonical_hash(edited)
    assert record.delivered_revision == 1
    record = store.restore(OWNER, kind, 1, base_revision=2)
    assert (record.revision, record.updated_by, record.document) == (3, "panel", original)


@pytest.mark.parametrize(
    ("kind", "bad", "message"),
    [
        ("voice", _voice(phrases=[_phrase("a"), _phrase("a")]), "phrase ids must be unique"),
        ("notification_style", [], "document must be a JSON object"),
        ("status_pages", _pages_of({"id": "a", "name": "A", "rows": [{}]}),
         r"rows\[0\].id must be a non-empty string"),
    ],
)
def test_a_panel_save_of_a_batch_2_kind_is_shape_checked(mod, kind, bad, message):
    store = _new(mod)
    _put(store, kind=kind, doc=_first_copy(kind))
    with pytest.raises(mod.WatchConfigValidationError, match=message):
        store.panel_save(OWNER, kind, bad, base_revision=1)
    assert store.get(OWNER, kind).revision == 1


@pytest.mark.parametrize("kind", _NEW_KINDS)
def test_the_panel_never_creates_a_batch_2_record_for_a_watch_that_is_not_paired(mod, kind):
    store = _new(mod, paired={OTHER})
    heard = _listen(store)
    with pytest.raises(mod.WatchConfigNoRecordError) as exc:
        store.panel_save(OWNER, kind, _first_copy(kind), base_revision=0)
    assert exc.value.message == (
        f"there is no stored {kind} record and this watch is not paired; "
        "pair it before starting its config here"
    )
    assert store.get(OWNER, kind) is None
    assert heard == []
    assert _FakeStore.writes == []


def test_every_kind_is_forgotten_and_moved_with_its_owner(mod):
    store = _new(mod, paired={OWNER})
    for kind in sorted(PANEL_KINDS):
        store.panel_save(OWNER, kind, _first_copy(kind), base_revision=0)
    assert store.revisions(OWNER) == {kind: 1 for kind in PANEL_KINDS}
    assert sorted(store.move_owner(OWNER, OTHER, updated_by="t")) == sorted(PANEL_KINDS)
    assert store.get(OTHER, "status_pages").document == _status_pages()
    heard = _listen(store)
    assert store.forget_owner(OTHER) is True
    assert sorted(heard) == sorted((OTHER, kind, 0) for kind in PANEL_KINDS)
    assert store.revisions(OTHER) == {}


# ── step 4d batch 5: the Control Center list ─────────────────────────────


def _cc_entry(entity_id: str, **extra: Any) -> dict:
    domain = entity_id.split(".", 1)[0]
    entry = {
        "entityId": entity_id,
        "displayName": entity_id.split(".", 1)[1].replace("_", " ").title(),
        "iconName": "lightbulb.fill",
        "domain": domain,
    }
    entry.update(extra)
    return entry


def _control_center(**extra: Any) -> dict:
    """The Control Center document: the app's bare array of CuratedEntity,
    wrapped in an object, made-up entities only. A hidden entry and one in a
    domain the watch never shows are stored like the rest."""
    doc = {
        "schemaVersion": 1,
        "entities": [
            _cc_entry("light.made_up_kitchen", schemaVersion=1),
            _cc_entry("scene.made_up_movie", iconName="sparkles", isHidden=True),
            _cc_entry("sensor.made_up_temperature", iconName="circle.fill",
                      customDisplayName="Temp", tintColorHex="#FF9500"),
        ],
    }
    doc.update(extra)
    return doc


def _entities_of(*entities: Any) -> dict:
    return {"schemaVersion": 1, "entities": list(entities)}


def test_a_device_may_save_and_read_the_control_center_list(mod):
    store = _new(mod)
    heard = _listen(store)
    doc = _control_center(futureKey={"kept": True})
    record = _put(store, kind="control_center", doc=doc)
    assert (record.revision, record.delivered_revision, record.hash) == (1, 1, HASH_1)
    assert store.get(OWNER, "control_center").document == doc
    record = _put(store, kind="control_center", doc=_control_center(), base=1, digest=HASH_2)
    assert record.revision == 2
    assert [e.revision for e in store.history(OWNER, "control_center")] == [1]
    assert heard == [(OWNER, "control_center", 1), (OWNER, "control_center", 2)]


def test_the_control_center_list_has_its_own_cap(mod):
    store = _new(mod)
    base = _control_center()
    overhead = mod.document_size({**base, "b": ""})
    cap = MAX_CONTROL_CENTER_BYTES
    assert _put(store, kind="control_center", doc={**base, "b": "x" * (cap - overhead)}).revision == 1
    with pytest.raises(mod.WatchConfigValidationError, match="limit for control_center"):
        _put(store, kind="control_center", doc={**base, "b": "x" * (cap - overhead + 1)}, base=1)


@pytest.mark.parametrize(
    "document",
    [
        {"entities": []},
        _control_center(),
        # Keys besides the four are never looked at, nor is the domain
        # checked against the entity id or the ones the watch shows.
        _entities_of(_cc_entry("light.a", isHidden="yes", tintColorHex=3),
                     _cc_entry("climate.b", domain="not_a_domain")),
        # Entity ids are compared as written.
        _entities_of(_cc_entry("light.a"), _cc_entry("light.A")),
        # Empty strings are strings.
        _entities_of(_cc_entry("light.a", displayName="", iconName="", domain="")),
    ],
)
def test_control_center_lists_of_any_shape_the_guard_allows_are_accepted(mod, document):
    store = _new(mod)
    assert _put(store, kind="control_center", doc=document).document == document


@pytest.mark.parametrize(
    ("document", "message"),
    [
        ([], "document must be a JSON object"),
        ({}, "document.entities must be a list"),
        ({"entities": {}}, "document.entities must be a list"),
        ({"entities": None}, "document.entities must be a list"),
        (_entities_of("light.a"), r"document.entities\[0\] must be an object"),
        (_entities_of(_cc_entry("light.a"), {"displayName": "B", "iconName": "x", "domain": "light"}),
         r"document.entities\[1\].entityId must be a non-empty string"),
        (_entities_of(_cc_entry("light.a", entityId="")),
         r"document.entities\[0\].entityId must be a non-empty string"),
        (_entities_of(_cc_entry("light.a", entityId=7)),
         r"document.entities\[0\].entityId must be a non-empty string"),
        (_entities_of(_cc_entry("light.a"), _cc_entry("light.b"), _cc_entry("light.a")),
         r'document.entities\[2\] has the entity id "light.a" of document.entities\[0\]; '
         "entity ids must be unique"),
        (_entities_of({"entityId": "light.a", "iconName": "x", "domain": "light"}),
         r"document.entities\[0\].displayName must be a string"),
        (_entities_of(_cc_entry("light.a", displayName=None)),
         r"document.entities\[0\].displayName must be a string"),
        (_entities_of(_cc_entry("light.a", iconName=["x"])),
         r"document.entities\[0\].iconName must be a string"),
        (_entities_of({"entityId": "light.a", "displayName": "A", "iconName": "x"}),
         r"document.entities\[0\].domain must be a string"),
    ],
)
def test_control_center_lists_of_the_wrong_shape_are_refused(mod, document, message):
    store = _new(mod)
    with pytest.raises(mod.WatchConfigValidationError, match=message):
        _put(store, kind="control_center", doc=document)
    assert store.get(OWNER, "control_center") is None
    assert _FakeStore.writes == []


def test_the_panel_may_save_restore_and_create_the_control_center_list(mod):
    store = _new(mod, paired={OWNER})
    original = _control_center()
    record = store.panel_save(OWNER, "control_center", original, base_revision=0)
    assert (record.revision, record.updated_by) == (1, "panel")
    edited = _control_center(entities=list(reversed(original["entities"])))
    record = store.panel_save(OWNER, "control_center", edited, base_revision=1)
    assert (record.revision, record.document) == (2, edited)
    record = store.restore(OWNER, "control_center", 1, base_revision=2)
    assert (record.revision, record.updated_by, record.document) == (3, "panel", original)
    with pytest.raises(mod.WatchConfigValidationError, match="entity ids must be unique"):
        store.panel_save(
            OWNER, "control_center",
            _entities_of(_cc_entry("light.a"), _cc_entry("light.a")), base_revision=3,
        )
    assert store.get(OWNER, "control_center").revision == 3


def test_the_panel_never_creates_a_control_center_list_for_a_watch_that_is_not_paired(mod):
    store = _new(mod, paired={OTHER})
    with pytest.raises(mod.WatchConfigNoRecordError):
        store.panel_save(OWNER, "control_center", _control_center(), base_revision=0)
    assert store.get(OWNER, "control_center") is None
    assert _FakeStore.writes == []


# ── step 8: the rooms of a home that is not the main house ───────────────


def _rooms(**extra: Any) -> dict:
    """The rooms document: `schemaVersion` plus the six room keys under their
    `behavior` names, made-up entities only. Every key is optional."""
    doc = {
        "schemaVersion": 1,
        "roomQuickJumpEnabled": True,
        "roomQuickJumpSourceEntityId": "sensor.made_up_room",
        "roomQuickJumpFallbackPageId": "P1",
        "roomQuickJumpMappings": {"kitchen": "P2", "office": "P3"},
        "roomAutoSwitchEnabled": False,
        "pointControlRoomMappingsJSON": '[{"room":"kitchen","zone":"A"}]',
    }
    doc.update(extra)
    return doc


def test_a_device_may_save_and_read_the_rooms(mod):
    store = _new(mod)
    heard = _listen(store)
    doc = _rooms(futureKey={"kept": True})
    record = _put(store, kind="rooms", doc=doc)
    assert (record.revision, record.delivered_revision, record.hash) == (1, 1, HASH_1)
    assert store.get(OWNER, "rooms").document == doc
    record = _put(store, kind="rooms", doc=_rooms(), base=1, digest=HASH_2)
    assert record.revision == 2
    assert [e.revision for e in store.history(OWNER, "rooms")] == [1]
    assert heard == [(OWNER, "rooms", 1), (OWNER, "rooms", 2)]
    assert store.revisions(OWNER) == {"rooms": 2}


def test_the_rooms_have_their_own_64_kib_cap(mod):
    assert MAX_ROOMS_BYTES == 64 * 1024
    store = _new(mod)
    base = _rooms()
    overhead = mod.document_size({**base, "b": ""})
    cap = MAX_ROOMS_BYTES
    assert _put(store, kind="rooms", doc={**base, "b": "x" * (cap - overhead)}).revision == 1
    with pytest.raises(mod.WatchConfigValidationError, match="limit for rooms is 65536"):
        _put(store, kind="rooms", doc={**base, "b": "x" * (cap - overhead + 1)}, base=1)


@pytest.mark.parametrize(
    "document",
    [
        {},
        {"schemaVersion": 1},
        _rooms(),
        # No validator, as for behavior: values are never looked at.
        _rooms(roomQuickJumpMappings=[], roomAutoSwitchEnabled="yes"),
    ],
)
def test_rooms_of_any_object_shape_are_accepted(mod, document):
    store = _new(mod)
    assert _put(store, kind="rooms", doc=document).document == document


@pytest.mark.parametrize("document", [[], "rooms", 1, True])
def test_rooms_that_are_not_an_object_are_refused(mod, document):
    store = _new(mod)
    with pytest.raises(mod.WatchConfigValidationError, match="document must be a JSON object"):
        _put(store, kind="rooms", doc=document)
    assert store.get(OWNER, "rooms") is None


def test_the_panel_may_save_restore_and_create_the_rooms(mod):
    store = _new(mod, paired={OWNER})
    original = _rooms()
    record = store.panel_save(OWNER, "rooms", original, base_revision=0)
    assert (record.revision, record.updated_by) == (1, "panel")
    edited = _rooms(roomAutoSwitchEnabled=True)
    record = store.panel_save(OWNER, "rooms", edited, base_revision=1)
    assert (record.revision, record.document) == (2, edited)
    record = store.restore(OWNER, "rooms", 1, base_revision=2)
    assert (record.revision, record.updated_by, record.document) == (3, "panel", original)


def test_the_panel_never_creates_rooms_for_a_watch_that_is_not_paired(mod):
    store = _new(mod, paired={OTHER})
    with pytest.raises(mod.WatchConfigNoRecordError):
        store.panel_save(OWNER, "rooms", _rooms(), base_revision=0)
    assert store.get(OWNER, "rooms") is None
    assert _FakeStore.writes == []


# ── step 3: files written before it ──────────────────────────────────────


def test_a_file_written_before_step_3_still_loads_and_works(mod):
    """Exactly the record shape step 2 wrote: delivery fields but no report,
    and history entries from older builds, one missing envelope fields and
    one with them empty. Its stand-in pages use `tiles`, which no guard
    reads, and the device copy has a tile fault the panel would refuse."""
    key = mod._owner_key(OWNER)
    old_document = {
        "schemaVersion": 1,
        "pages": [{"id": "P1", "name": "Home", "items": [_item("T"), _item("T")]}],
    }
    _FakeStore.files[INDEX_KEY] = {"owners": [OWNER]}
    _FakeStore.files[key] = {
        "owner_watch_id": OWNER,
        "records": {
            "pages": {
                "revision": 4,
                "hash": HASH_1,
                "updated_at": "2026-10-01T20:00:00Z",
                "updated_by": OWNER,
                "delivered_revision": 4,
                "delivered_at": "2026-10-01T20:00:01Z",
                "document": old_document,
                "history": [
                    {"revision": 2, "document": {"pages": [{"id": "P1", "tiles": []}]}},
                    {"revision": 3, "hash": "", "updated_at": "", "updated_by": "",
                     "document": _doc("three")},
                ],
            },
            "behavior": {
                "revision": 1, "hash": HASH_2, "updated_at": "", "updated_by": OWNER,
                "document": _behavior(),
            },
        },
    }
    store = _new(mod)
    record = store.get(OWNER, "pages")
    assert record.revision == 4
    assert record.document == old_document
    assert (record.delivered_revision, record.rejected_revision, record.rejected_at) == (
        4, 0, None
    )
    assert store.get(OWNER, "behavior").rejected_revision == 0
    assert [e.summary() for e in store.history(OWNER, "pages")] == [
        {"revision": 3, "hash": None, "updated_at": None, "updated_by": None,
         "size": mod.document_size(_doc("three"))},
        {"revision": 2, "hash": None, "updated_at": None, "updated_by": None,
         "size": mod.document_size({"pages": [{"id": "P1", "tiles": []}]})},
    ]

    # Everything works on it: the report, a device save over the faulty
    # tiles, a restore of an entry without an envelope, and the rewrite.
    assert store.report_unreadable(OWNER, "pages", 4) is True
    floor = store._revision_floor
    assert _put(store, doc=old_document, base=4, digest=HASH_2).revision == floor + 1
    assert store.restore(OWNER, "pages", 2, base_revision=floor + 1).revision == floor + 2
    written = _FakeStore.files[key]["records"]["pages"]
    assert (written["rejected_revision"], written["revision"]) == (4, floor + 2)
    assert written["history"][0] == {
        "revision": 2, "hash": None, "updated_at": None, "updated_by": None,
        "document": {"pages": [{"id": "P1", "tiles": []}]},
    }
    again = _new(mod).get(OWNER, "pages")
    assert (again.revision, again.rejected_revision) == (floor + 2, 4)
    assert [e.revision for e in again.history] == [2, 3, 4, floor + 1]
