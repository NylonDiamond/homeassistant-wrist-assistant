"""Pure-unit tests for PartsStore, the My parts library.

In-process, no HA instance, same stub-and-load pattern as
test_gallery_key_store.py. Covers what the panel depends on: a part is kept and
comes back after a restart, saving over one keeps its created_at, the two caps
refuse rather than truncate, and an install with no file at all starts empty.
"""

from __future__ import annotations

import asyncio
import contextlib
import copy
import importlib.util
import sys
import types
from datetime import UTC, datetime
from pathlib import Path

import pytest

_STORE_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "parts_store.py"
)

_PKG = "wa_parts_test_pkg"


class _FakeStore:
    """Keeps the last saved payload in memory so a "restart" can reload it."""

    saved: object = None
    saves = 0

    def __init__(self, *args: object, **kwargs: object) -> None:
        pass

    async def async_load(self):
        return copy.deepcopy(_FakeStore.saved)

    async def async_save(self, data) -> None:
        _FakeStore.saves += 1
        _FakeStore.saved = copy.deepcopy(data)

    def async_delay_save(self, serialize, _delay: float = 0) -> None:
        _FakeStore.saves += 1
        _FakeStore.saved = copy.deepcopy(serialize())


@contextlib.contextmanager
def _loaded_module():
    saved_modules = dict(sys.modules)
    _FakeStore.saved = None
    _FakeStore.saves = 0
    try:

        def stub(name: str, **attrs: object) -> None:
            module = sys.modules.get(name) or types.ModuleType(name)
            for key, value in attrs.items():
                setattr(module, key, value)
            sys.modules[name] = module

        stub("homeassistant")
        stub("homeassistant.helpers")
        stub("homeassistant.helpers.storage", Store=_FakeStore)
        stub("homeassistant.core", HomeAssistant=type("HomeAssistant", (), {}))
        stub("homeassistant.util")
        stub(
            "homeassistant.util.dt",
            utcnow=lambda: datetime.now(UTC),
        )

        pkg = types.ModuleType(_PKG)
        pkg.__path__ = []
        sys.modules[_PKG] = pkg
        stub(
            f"{_PKG}.const",
            PARTS_STORAGE_KEY="wrist_assistant.parts",
            PARTS_STORAGE_VERSION=1,
        )

        spec = importlib.util.spec_from_file_location(f"{_PKG}.parts_store", _STORE_PATH)
        module = importlib.util.module_from_spec(spec)
        sys.modules[f"{_PKG}.parts_store"] = module
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


class _Hass:
    def __init__(self) -> None:
        self.data: dict = {}


def _loaded(mod):
    store = mod.PartsStore(_Hass())
    asyncio.run(store.async_load())
    return store


def test_an_install_with_no_file_starts_empty(mod) -> None:
    assert _loaded(mod).list() == []


def test_a_saved_part_comes_back(mod) -> None:
    store = _loaded(mod)
    part = store.save(None, "Battery row", '{"name":"x"}')
    assert part["name"] == "Battery row"
    assert part["text"] == '{"name":"x"}'
    assert part["created_at"] == part["updated_at"]

    after_restart = _loaded(mod)
    assert [p["id"] for p in after_restart.list()] == [part["id"]]
    assert after_restart.list()[0]["text"] == '{"name":"x"}'


def test_saving_over_a_part_keeps_when_it_was_made(mod) -> None:
    store = _loaded(mod)
    part = store.save(None, "First", "{}")
    again = store.save(part["id"], "Renamed", '{"a":1}')
    assert again["id"] == part["id"]
    assert again["created_at"] == part["created_at"]
    assert again["name"] == "Renamed"
    assert len(store.list()) == 1


def test_an_unknown_id_is_refused(mod) -> None:
    store = _loaded(mod)
    with pytest.raises(mod.PartNotFoundError):
        store.save("nope", "Name", "{}")
    with pytest.raises(mod.PartNotFoundError):
        store.delete("nope")


def test_a_deleted_part_stays_deleted(mod) -> None:
    store = _loaded(mod)
    part = store.save(None, "Gone", "{}")
    store.delete(part["id"])
    assert store.list() == []
    assert _loaded(mod).list() == []


def test_a_part_needs_a_name_and_text(mod) -> None:
    store = _loaded(mod)
    with pytest.raises(mod.PartsValidationError):
        store.save(None, "   ", "{}")
    with pytest.raises(mod.PartsValidationError):
        store.save(None, "Name", "   ")


def test_the_size_cap_refuses_rather_than_truncates(mod) -> None:
    store = _loaded(mod)
    too_big = "x" * (mod.MAX_PART_BYTES + 1)
    with pytest.raises(mod.PartsValidationError):
        store.save(None, "Huge", too_big)
    assert store.list() == []


def test_the_count_cap_refuses_the_one_too_many(mod) -> None:
    store = _loaded(mod)
    for i in range(mod.MAX_PARTS):
        store.save(None, f"Part {i}", "{}")
    with pytest.raises(mod.PartsValidationError):
        store.save(None, "One too many", "{}")
    assert len(store.list()) == mod.MAX_PARTS


def test_damaged_rows_are_skipped_rather_than_failing_the_load(mod) -> None:
    _FakeStore.saved = {
        "parts": [
            "not a part",
            {"id": "a", "name": "Good", "text": "{}"},
            {"id": "", "name": "No id", "text": "{}"},
            {"id": "b", "name": 7, "text": "{}"},
        ]
    }
    rows = _loaded(mod).list()
    assert [row["id"] for row in rows] == ["a"]
    assert rows[0]["created_at"] != ""
