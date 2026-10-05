"""Unit tests for ``HTTPActionsStore``, the home's HTTP action library.

In-process with stubbed Home Assistant modules, the way
``test_watch_config_store.py`` loads its store: the package is a stand-in
holding the real ``const.py`` and ``http_actions.py``, and ``Store`` keeps one
payload per key in memory, saved at once rather than after the debounce.

Covered: the first save, compare and swap and the conflict words, the
validator and the size cap through a save, the hash, the hand-over (once
per owner, an empty one, the global rename, a second phone), the delivery
marks (forward only, capped), forgetting a device, the listeners, the
persistence round trip, an unreadable file never saved over, and removal.
"""

from __future__ import annotations

import asyncio
import contextlib
import copy
import importlib.util
import json
import re
import sys
import types
from pathlib import Path
from typing import Any

import pytest

from test_http_actions import ID_A, ID_B, ID_C, action, library

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_PKG = "wa_http_actions_test_pkg"
KEY = "wrist_assistant.http_actions"
CONFLICT = re.compile(r"^stored revision is (\d+)")


class FakeStore:
    """``homeassistant.helpers.storage.Store``, one payload per key."""

    files: dict[str, Any] = {}
    writes: list[str] = []
    removed: list[str] = []
    unreadable: set[str] = set()

    def __init__(self, _hass: object, _version: int, key: str, *_a: object, **_k: object) -> None:
        self.key = key

    async def async_load(self):
        if self.key in FakeStore.unreadable:
            raise OSError(f"cannot read {self.key}")
        return copy.deepcopy(FakeStore.files.get(self.key))

    def async_delay_save(self, serialize, *_a: object, **_k: object) -> None:
        FakeStore.files[self.key] = copy.deepcopy(serialize())
        FakeStore.writes.append(self.key)

    async def async_remove(self) -> None:
        FakeStore.files.pop(self.key, None)
        FakeStore.removed.append(self.key)


def _stub(name: str, **attrs: object) -> None:
    module = sys.modules.get(name) or types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module


def load_into_pkg(name: str):
    spec = importlib.util.spec_from_file_location(f"{_PKG}.{name}", _PKG_DIR / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[f"{_PKG}.{name}"] = module
    spec.loader.exec_module(module)
    return module


@contextlib.contextmanager
def loaded_package():
    """The package with ``const``, ``http_actions`` and the store loaded over
    stubbed Home Assistant modules. Everything loaded is dropped after."""
    saved = dict(sys.modules)
    FakeStore.files, FakeStore.writes, FakeStore.removed = {}, [], []
    FakeStore.unreadable = set()
    try:
        _stub("homeassistant")
        _stub("homeassistant.helpers")
        _stub("homeassistant.helpers.storage", Store=FakeStore)
        _stub(
            "homeassistant.core",
            HomeAssistant=type("HomeAssistant", (), {}),
            callback=lambda f: f,
        )
        pkg = types.ModuleType(_PKG)
        pkg.__path__ = []
        sys.modules[_PKG] = pkg
        load_into_pkg("const")
        load_into_pkg("http_actions")
        store_mod = load_into_pkg("http_actions_store")
        yield types.SimpleNamespace(pkg=_PKG, store_mod=store_mod, load=load_into_pkg)
    finally:
        for key in list(sys.modules):
            if key not in saved:
                del sys.modules[key]
        sys.modules.update(saved)


def new_store(mod) -> Any:
    store = mod.HTTPActionsStore(object())
    asyncio.run(store.async_load())
    return store


@pytest.fixture
def env():
    with loaded_package() as loaded:
        yield types.SimpleNamespace(mod=loaded.store_mod, store=new_store(loaded.store_mod))


# ── save ─────────────────────────────────────────────────────────────────


def test_nothing_stored_reads_as_revision_0(env) -> None:
    assert env.store.get() == {
        "revision": 0,
        "hash": None,
        "updated_at": None,
        "updated_by": None,
        "handed_over": [],
        "delivered": {},
    }
    assert env.store.public() == (0, None, None)


def test_the_first_save_is_revision_1_and_the_next_is_compared(env) -> None:
    doc = library(action())
    assert env.store.save(doc, base_revision=0) == 1
    record = env.store.get()
    assert record["revision"] == 1
    assert record["document"] == doc
    assert record["updated_by"] == "panel"
    assert re.fullmatch(r"[0-9a-f]{64}", record["hash"])
    assert record["updated_at"].endswith("Z")
    assert env.store.save(library(action(name="Two")), base_revision=1) == 2


@pytest.mark.parametrize("base", [0, 2, 7])
def test_a_stale_base_is_a_conflict_naming_the_stored_revision(env, base) -> None:
    env.store.save(library(action()), base_revision=0)
    with pytest.raises(env.mod.HTTPActionsConflictError) as caught:
        env.store.save(library(action(name="x")), base_revision=base)
    assert caught.value.code == "conflict"
    assert CONFLICT.match(caught.value.message).group(1) == "1"
    assert caught.value.message == f"stored revision is 1, save was based on {base}"
    assert env.store.revision == 1


def test_a_base_above_0_with_nothing_stored_is_a_conflict(env) -> None:
    with pytest.raises(env.mod.HTTPActionsConflictError) as caught:
        env.store.save(library(), base_revision=3)
    assert caught.value.message.startswith("stored revision is 0")


@pytest.mark.parametrize(
    "doc",
    [
        None,
        [],
        {"actions": "no"},
        library(action(id="x")),
        library(action(method="HEAD")),
        library(action(), action(id=ID_A.lower())),
        library(action(body="x" * (256 * 1024))),
    ],
)
def test_a_malformed_save_is_refused_and_changes_nothing(env, doc) -> None:
    with pytest.raises(env.mod.HTTPActionsValidationError) as caught:
        env.store.save(doc, base_revision=0)
    assert caught.value.code == "invalid"
    assert env.store.revision == 0
    assert FakeStore.writes == []


@pytest.mark.parametrize("base", [-1, True, "0", None, 1.0])
def test_a_bad_base_revision_is_invalid(env, base) -> None:
    with pytest.raises(env.mod.HTTPActionsValidationError):
        env.store.save(library(), base_revision=base)


def test_the_hash_is_the_canonical_hash_of_the_document(env) -> None:
    doc = library(action(name="Café"))
    env.store.save(doc, base_revision=0)
    import hashlib

    expected = hashlib.sha256(
        json.dumps(doc, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
    ).hexdigest()
    assert env.store.get()["hash"] == expected


def test_the_stored_document_is_a_copy(env) -> None:
    doc = library(action())
    env.store.save(doc, base_revision=0)
    doc["actions"][0]["name"] = "changed after"
    env.store.get()["document"]["actions"][0]["name"] = "changed a read"
    assert env.store.document()["actions"][0]["name"] == "Notify"


# ── the public list ──────────────────────────────────────────────────────


def test_the_public_list_and_its_hash_follow_the_revision(env) -> None:
    env.store.save(library(action(url="https://secret.example/x")), base_revision=0)
    revision, listed, digest = env.store.public()
    assert revision == 1
    assert listed["actions"][0]["id"] == ID_A
    assert "secret" not in json.dumps(listed)
    env.store.save(library(action(name="Renamed")), base_revision=1)
    revision2, listed2, digest2 = env.store.public()
    assert revision2 == 2 and listed2["actions"][0]["name"] == "Renamed"
    assert digest2 != digest


# ── hand-over ────────────────────────────────────────────────────────────


def test_a_hand_over_merges_once_per_owner(env) -> None:
    doc = library(action(), globals_=[{"id": "G", "key": "k", "value": "v"}])
    assert env.store.hand_over("watch-A", doc) == (1, 1)
    record = env.store.get()
    assert record["handed_over"] == ["watch-A"]
    assert record["updated_by"] == "watch-A"
    assert record["document"]["actions"] == [action()]
    # A second hand-over from the same owner changes nothing, even with news.
    assert env.store.hand_over("watch-A", library(action(id=ID_B))) == (1, 0)
    assert env.store.revision == 1


def test_an_empty_hand_over_lists_the_owner_and_keeps_revision_0(env) -> None:
    calls: list[int] = []
    env.store.async_add_listener(calls.append)
    assert env.store.hand_over("watch-A", library()) == (0, 0)
    assert env.store.get()["handed_over"] == ["watch-A"]
    assert env.store.has_handed_over("watch-A")
    assert calls == []
    assert FakeStore.files[KEY]["handed_over"] == ["watch-A"]


def test_a_second_phone_merges_in_and_renames_a_clashing_global(env) -> None:
    env.store.hand_over(
        "watch-A",
        library(action(url="{{haurl}}/a"), globals_=[{"id": "G1", "key": "haurl", "value": "http://one"}]),
    )
    revision, added = env.store.hand_over(
        "watch-B",
        library(
            action(name="Same id, theirs"),
            action(id=ID_B, url="{{haurl}}/b"),
            globals_=[{"id": "G2", "key": "haurl", "value": "http://two"}],
        ),
    )
    assert (revision, added) == (2, 1)
    doc = env.store.document()
    assert [a["name"] for a in doc["actions"]] == ["Notify", "Notify"]
    assert doc["actions"][1]["url"] == "{{haurl_2}}/b"
    assert [(g["key"], g["value"]) for g in doc["globalVariables"]] == [
        ("haurl", "http://one"),
        ("haurl_2", "http://two"),
    ]
    assert env.store.get()["handed_over"] == ["watch-A", "watch-B"]


def test_a_hand_over_onto_a_panel_library_keeps_the_panel_s_actions(env) -> None:
    env.store.save(library(action(name="Panel")), base_revision=0)
    assert env.store.hand_over("watch-A", library(action(name="Phone"), action(id=ID_C))) == (2, 1)
    assert [a["name"] for a in env.store.document()["actions"]] == ["Panel", "Notify"]


def test_a_malformed_hand_over_is_refused_and_not_listed(env) -> None:
    with pytest.raises(env.mod.HTTPActionsValidationError):
        env.store.hand_over("watch-A", {"actions": [{"id": "nope"}]})
    assert env.store.get()["handed_over"] == []


def test_a_hand_over_that_would_pass_the_cap_is_refused(env) -> None:
    env.store.save(library(action(body="x" * 140_000)), base_revision=0)
    with pytest.raises(env.mod.HTTPActionsValidationError) as caught:
        env.store.hand_over("watch-A", library(action(id=ID_B, body="y" * 140_000)))
    assert "merged library" in caught.value.message
    assert env.store.revision == 1
    assert not env.store.has_handed_over("watch-A")


# ── marks ────────────────────────────────────────────────────────────────


def test_delivery_only_moves_forward_and_never_past_the_revision(env) -> None:
    env.store.save(library(action()), base_revision=0)
    env.store.save(library(action(name="2")), base_revision=1)
    env.store.mark_delivered("watch-A", 1)
    env.store.mark_delivered("watch-A", 0)
    assert env.store.delivered() == {"watch-A": 1}
    env.store.mark_delivered("watch-A", 9)
    assert env.store.delivered() == {"watch-A": 2}
    env.store.mark_delivered("watch-B", 0)
    assert "watch-B" not in env.store.delivered()


def test_forget_drops_a_device_s_marks_and_keeps_the_library(env) -> None:
    env.store.hand_over("watch-A", library(action()))
    env.store.mark_delivered("watch-A", 1)
    env.store.mark_delivered("watch-B", 1)
    assert env.store.forget("watch-A") is True
    record = env.store.get()
    assert record["handed_over"] == []
    assert record["delivered"] == {"watch-B": 1}
    assert record["revision"] == 1 and record["document"]["actions"]
    assert env.store.forget("watch-A") is False
    # Forgotten, the phone may hand over again (and adds nothing new).
    assert env.store.hand_over("watch-A", library(action())) == (1, 0)


# ── listeners ────────────────────────────────────────────────────────────


def test_listeners_hear_every_accepted_change_and_nothing_else(env) -> None:
    heard: list[int] = []
    remove = env.store.async_add_listener(heard.append)

    def boom(_revision: int) -> None:
        raise RuntimeError("listener fault")

    env.store.async_add_listener(boom)
    env.store.save(library(action()), base_revision=0)
    with pytest.raises(env.mod.HTTPActionsConflictError):
        env.store.save(library(), base_revision=0)
    env.store.hand_over("watch-A", library(action(id=ID_B)))
    env.store.hand_over("watch-A", library(action(id=ID_C)))
    env.store.mark_delivered("watch-A", 2)
    env.store.forget("watch-A")
    assert heard == [1, 2]
    remove()
    env.store.save(library(), base_revision=2)
    assert heard == [1, 2]


# ── storage ──────────────────────────────────────────────────────────────


def test_the_record_survives_a_restart() -> None:
    with loaded_package() as loaded:
        store = new_store(loaded.store_mod)
        store.save(library(action()), base_revision=0)
        store.hand_over("watch-A", library(action(id=ID_B)))
        store.mark_delivered("watch-B", 1)
        before = store.get()
        again = new_store(loaded.store_mod)
        assert again.get() == before
        assert again.public() == store.public()


def test_an_unreadable_file_is_refused_and_never_saved_over() -> None:
    with loaded_package() as loaded:
        FakeStore.files[KEY] = {"document": library(action()), "revision": 4}
        FakeStore.unreadable.add(KEY)
        store = new_store(loaded.store_mod)
        unavailable = loaded.store_mod.HTTPActionsUnavailableError
        for call in (
            store.get,
            store.public,
            store.document,
            lambda: store.save(library(), base_revision=0),
            lambda: store.hand_over("watch-A", library()),
        ):
            with pytest.raises(unavailable) as caught:
                call()
            assert caught.value.code == "unavailable"
        store.mark_delivered("watch-A", 1)
        assert store.forget("watch-A") is False
        assert store.revision == 0
        assert FakeStore.writes == []


def test_junk_on_disk_reads_as_nothing_stored() -> None:
    with loaded_package() as loaded:
        FakeStore.files[KEY] = {"document": "nope", "revision": "x", "handed_over": [1, "w"], "delivered": {"w": -1}}
        store = new_store(loaded.store_mod)
        assert store.get()["revision"] == 0
        assert store.get()["handed_over"] == ["w"]
        assert store.get()["delivered"] == {}


def test_remove_deletes_the_file() -> None:
    with loaded_package() as loaded:
        store = new_store(loaded.store_mod)
        store.save(library(action()), base_revision=0)
        asyncio.run(store.async_remove())
        assert KEY not in FakeStore.files
        assert FakeStore.removed == [KEY]
        assert store.revision == 0
