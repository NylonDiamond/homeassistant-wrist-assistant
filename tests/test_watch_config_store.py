"""Pure-unit tests for WatchConfigStore (the watch config kept in Home Assistant).

In-process, no HA instance, the same stub-and-load pattern as
test_complication_store.py. The ``Store`` stand-in keeps one payload per
storage key, which is what lets these tests see that each owner has a file of
its own, that a save touches only its owner's file, and that a "restart"
reads back what was written.

Covered: create, compare-and-swap, the conflict, a forced save and its
history, the history cap, unknown kinds, the size cap, the envelope check,
forget, move, owner isolation, the persistence round trip, and an unreadable
file never being saved over.
"""

from __future__ import annotations

import asyncio
import contextlib
import copy
import importlib.util
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
# The real cap, not a smaller test value: a 2 MiB string is cheap to build, and
# testing the number that ships is the point.
MAX_BYTES = 2 * 1024 * 1024
HISTORY_LIMIT = 5

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
            WATCH_CONFIG_KINDS=frozenset({"pages"}),
            WATCH_CONFIG_MAX_DOCUMENT_BYTES=MAX_BYTES,
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


def _new(mod):
    store = mod.WatchConfigStore(_Hass())
    asyncio.run(store.async_load())
    return store


def _doc(name: str = "Home", **extra: Any) -> dict:
    """A small stand-in for a GridConfiguration. The store reads only `pages`."""
    doc = {
        "schemaVersion": 1,
        "pages": [{"id": "6F1C2D0E-0000-4000-8000-000000000001", "name": name, "tiles": []}],
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
    # And the revision carries on from where it was.
    assert _put(again, OWNER, base=2, digest=HASH_3).revision == 3


def test_the_owner_file_holds_the_document_and_history_but_the_index_does_not(mod):
    store = _new(mod)
    _put(store, OWNER, _doc("v1"))
    _put(store, OWNER, _doc("v2"), base=1, digest=HASH_2)
    stored = _FakeStore.files[mod._owner_key(OWNER)]
    assert stored["owner_watch_id"] == OWNER
    record = stored["records"]["pages"]
    assert set(record) == {"revision", "hash", "updated_at", "updated_by", "document", "history"}
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
    assert _FakeStore.files[key]["records"]["quick_actions"] == future
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
        "history_count": 1,
    }
    assert "secret" not in repr(report)


def test_remove_deletes_every_owner_file_and_the_index(mod):
    store = _new(mod)
    _put(store, OWNER)
    _put(store, OTHER)
    # A fresh instance, the way async_remove_entry calls it after unload.
    asyncio.run(mod.WatchConfigStore(_Hass()).async_remove())
    assert _FakeStore.files == {}
