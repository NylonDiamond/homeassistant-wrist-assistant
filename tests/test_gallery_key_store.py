"""Pure-unit tests for GalleryKeyStore, the gallery upload key.

In-process, no HA instance, same stub-and-load pattern as
test_complication_store.py. Covers what the gallery depends on: the key is made
once and kept across a restart, it fits the gallery's header rule, and a stored
value that does not fit is replaced rather than sent.
"""

from __future__ import annotations

import asyncio
import contextlib
import copy
import importlib.util
import re
import sys
import types
from pathlib import Path

import pytest

_STORE_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "gallery_key_store.py"
)

_PKG = "wa_gallery_key_test_pkg"

# The gallery's rule for `X-Gallery-Key`.
_HEADER_RE = re.compile(r"^[A-Za-z0-9_-]{32,128}$")


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

        pkg = types.ModuleType(_PKG)
        pkg.__path__ = []
        sys.modules[_PKG] = pkg
        stub(
            f"{_PKG}.const",
            GALLERY_KEY_STORAGE_KEY="wrist_assistant.gallery_key",
            GALLERY_KEY_STORAGE_VERSION=1,
        )

        spec = importlib.util.spec_from_file_location(
            f"{_PKG}.gallery_key_store", _STORE_PATH
        )
        module = importlib.util.module_from_spec(spec)
        sys.modules[f"{_PKG}.gallery_key_store"] = module
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


def test_first_request_makes_and_saves_a_key(mod) -> None:
    key = asyncio.run(mod.GalleryKeyStore(_Hass()).async_get_key())
    assert _HEADER_RE.match(key)
    assert _FakeStore.saved == {"gallery_key": key}


def test_key_survives_a_restart(mod) -> None:
    first = asyncio.run(mod.GalleryKeyStore(_Hass()).async_get_key())
    second = asyncio.run(mod.GalleryKeyStore(_Hass()).async_get_key())
    assert first == second
    assert _FakeStore.saves == 1


def test_concurrent_requests_agree(mod) -> None:
    store = mod.GalleryKeyStore(_Hass())

    async def both():
        return await asyncio.gather(store.async_get_key(), store.async_get_key())

    a, b = asyncio.run(both())
    assert a == b
    assert _FakeStore.saves == 1


def test_a_malformed_stored_key_is_replaced(mod) -> None:
    _FakeStore.saved = {"gallery_key": "short"}
    key = asyncio.run(mod.GalleryKeyStore(_Hass()).async_get_key())
    assert key != "short"
    assert _HEADER_RE.match(key)
    assert _FakeStore.saved == {"gallery_key": key}


def test_one_store_per_home_assistant(mod) -> None:
    hass = _Hass()
    assert mod.gallery_key_store(hass) is mod.gallery_key_store(hass)
