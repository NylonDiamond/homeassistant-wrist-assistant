"""Pure-unit tests for CardPreviewStore, the Browse grid's card pictures.

In-process, no HA instance, same stub-and-load pattern as
test_parts_store.py. Covers what the panel depends on: a picture comes back
only for the revision it was taken of, it survives a restart, the checks
refuse what is not a card, and the sweep removes the pictures of records that
are gone.
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
from types import SimpleNamespace

import pytest

_STORE_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "card_preview_store.py"
)

_PKG = "wa_card_preview_test_pkg"

PNG = b"\x89PNG\r\n\x1a\n" + b"\x00" * 32
META = {"family": "rectangular", "device": "watch", "width": 170, "height": 76}


class _FakeStore:
    """Keeps the last saved payload in memory so a "restart" can reload it."""

    saved: object = None

    def __init__(self, *args: object, **kwargs: object) -> None:
        pass

    async def async_load(self):
        return copy.deepcopy(_FakeStore.saved)

    def async_delay_save(self, serialize, _delay: float = 0) -> None:
        _FakeStore.saved = copy.deepcopy(serialize())


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
        stub("homeassistant.core", HomeAssistant=type("HomeAssistant", (), {}))
        stub("homeassistant.util")
        stub("homeassistant.util.dt", utcnow=lambda: datetime.now(UTC))

        pkg = types.ModuleType(_PKG)
        pkg.__path__ = []
        sys.modules[_PKG] = pkg
        stub(
            f"{_PKG}.const",
            CARD_PREVIEW_STORAGE_KEY="wrist_assistant.card_previews",
            CARD_PREVIEW_STORAGE_VERSION=1,
        )

        spec = importlib.util.spec_from_file_location(
            f"{_PKG}.card_preview_store", _STORE_PATH
        )
        module = importlib.util.module_from_spec(spec)
        sys.modules[f"{_PKG}.card_preview_store"] = module
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
    """Enough of HA for the store: a config path and an executor."""

    def __init__(self, root: Path) -> None:
        self.data: dict = {}
        self.config = SimpleNamespace(path=lambda *parts: str(root.joinpath(*parts)))

    async def async_add_executor_job(self, fn, *args):
        return fn(*args)


def _record(record_id: str, revision: int, deleted: bool = False):
    return SimpleNamespace(id=record_id, revision=revision, deleted=deleted)


def _loaded(mod, root: Path):
    store = mod.CardPreviewStore(_Hass(root))
    asyncio.run(store.async_load())
    return store


def test_a_preview_comes_back_for_its_own_revision_only(mod, tmp_path) -> None:
    store = _loaded(mod, tmp_path)
    kept = asyncio.run(store.async_put("w1", "A", 3, PNG, META))
    assert kept == {"revision": 3, **{k: float(v) if k in ("width", "height") else v for k, v in META.items()}}

    assert set(store.previews_for("w1", [_record("A", 3)])) == {"A"}
    # Saved again somewhere that took no picture: the card draws live.
    assert store.previews_for("w1", [_record("A", 4)]) == {}
    assert store.previews_for("w1", [_record("A", 3, deleted=True)]) == {}
    assert asyncio.run(store.async_read("w1", "A")) == PNG


def test_a_preview_survives_a_restart(mod, tmp_path) -> None:
    store = _loaded(mod, tmp_path)
    asyncio.run(store.async_put("w1", "A", 3, PNG, {**META, "family": "corner",
        "focus": {"cx": 40, "cy": 40, "diameter": 30}}))

    again = _loaded(mod, tmp_path)
    preview = again.previews_for("w1", [_record("A", 3)])["A"]
    assert preview["family"] == "corner"
    assert preview["focus"] == {"cx": 40.0, "cy": 40.0, "diameter": 30.0}
    assert asyncio.run(again.async_read("w1", "A")) == PNG


def test_what_is_not_a_card_is_refused(mod, tmp_path) -> None:
    store = _loaded(mod, tmp_path)
    with pytest.raises(mod.CardPreviewInvalidError):
        asyncio.run(store.async_put("w1", "A", 1, b"GIF89a", META))
    with pytest.raises(mod.CardPreviewInvalidError):
        asyncio.run(store.async_put("w1", "A", 1, PNG + b"\x00" * mod.MAX_PREVIEW_BYTES, META))
    with pytest.raises(mod.CardPreviewInvalidError):
        asyncio.run(store.async_put("w1", "A", 1, PNG, {**META, "family": "inline"}))
    with pytest.raises(mod.CardPreviewInvalidError):
        asyncio.run(store.async_put("w1", "A", 1, PNG, {**META, "width": 0}))
    assert store.previews_for("w1", [_record("A", 1)]) == {}


def test_remove_and_sweep_let_go_of_the_files(mod, tmp_path) -> None:
    store = _loaded(mod, tmp_path)
    for record_id in ("A", "B", "C"):
        asyncio.run(store.async_put("w1", record_id, 1, PNG, META))
    folder = tmp_path / ".storage" / "wrist_assistant_card_previews"
    (folder / "stray.png").write_bytes(PNG)
    assert len(list(folder.iterdir())) == 4

    asyncio.run(store.async_remove("w1", "A"))
    asyncio.run(store.async_prune({("w1", "B")}))

    assert store.previews_for("w1", [_record(i, 1) for i in "ABC"]).keys() == {"B"}
    assert len(list(folder.iterdir())) == 1
    assert asyncio.run(store.async_read("w1", "C")) is None
