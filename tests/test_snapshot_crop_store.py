"""Pure-unit tests for SnapshotCropStore's per-camera sizing overrides.

The quality dropdown on the iOS framing page persists a per-camera (width,
quality) here, used by the notification capture. These tests pin the contract
that matters for a live install: values are clamped, the default clears the
override (so the map stays small), and a store written before the feature
shipped (no "sizing" section) loads cleanly to today's behavior.

Unlike ``notification_snapshot`` (pure stdlib), this module has relative imports
(``.camera_stream``, ``.const``) and pulls in HA + aiohttp at load, so we stub
those and load the real ``const``/``camera_stream``/``snapshot_crop_store`` under
their package names inside a context that fully restores ``sys.modules``.
"""

from __future__ import annotations

import asyncio
import contextlib
import importlib.util
import sys
import types
from pathlib import Path

_ROOT = (
    Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
)
_PKG = "custom_components.wrist_assistant"


class _FakeStore:
    """Stand-in for homeassistant.helpers.storage.Store.

    ``async_delay_save`` captures the serialized form into ``data`` so a test can
    round-trip it back through ``async_load``; ``async_load`` returns whatever is
    in ``data`` (None until something is saved or a test sets it).
    """

    def __init__(self, *args: object, **kwargs: object) -> None:
        self.data: object = None

    async def async_load(self) -> object:
        return self.data

    def async_delay_save(self, serialize, *args: object, **kwargs: object) -> None:  # noqa: ANN001
        self.data = serialize()


@contextlib.contextmanager
def _crop_store_module():
    """Load snapshot_crop_store (and its real deps) with HA stubbed, then restore."""
    saved = dict(sys.modules)

    def stub(name: str, **attrs: object) -> types.ModuleType:
        module = sys.modules.get(name) or types.ModuleType(name)
        for key, value in attrs.items():
            setattr(module, key, value)
        sys.modules[name] = module
        return module

    try:
        # Names referenced at import time by camera_stream / snapshot_crop_store.
        stub("aiohttp")
        stub(
            "aiohttp.web",
            Request=type("Request", (), {}),
            Response=type("Response", (), {}),
            StreamResponse=type("StreamResponse", (), {}),
        )
        stub("homeassistant")
        stub("homeassistant.components")
        stub(
            "homeassistant.components.camera",
            Image=type("Image", (), {}),
            async_get_image=lambda *a, **k: None,
        )
        stub("homeassistant.core", HomeAssistant=type("HomeAssistant", (), {}))
        stub(
            "homeassistant.exceptions",
            HomeAssistantError=type("HomeAssistantError", (Exception,), {}),
        )
        stub("homeassistant.helpers")
        stub("homeassistant.helpers.storage", Store=_FakeStore)

        # Package stubs so the relative imports resolve to the real source files.
        cc = stub("custom_components")
        cc.__path__ = [str(_ROOT.parent)]
        wa = stub(_PKG)
        wa.__path__ = [str(_ROOT)]

        def load(sub: str):
            name = f"{_PKG}.{sub}"
            spec = importlib.util.spec_from_file_location(name, _ROOT / f"{sub}.py")
            module = importlib.util.module_from_spec(spec)
            sys.modules[name] = module  # register before exec for dataclass slots
            spec.loader.exec_module(module)
            return module

        load("const")
        load("camera_stream")
        yield load("snapshot_crop_store")
    finally:
        for key in list(sys.modules):
            if key not in saved:
                del sys.modules[key]
        sys.modules.update(saved)


def test_set_and_get_sizing() -> None:
    with _crop_store_module() as scs:
        store = scs.SnapshotCropStore(object())
        store.set_sizing("camera.front", 720, 75)
        assert store.get_sizing("camera.front") == (720, 75)
        assert store.get_sizing("camera.unset") is None


def test_set_sizing_clamps_out_of_range() -> None:
    with _crop_store_module() as scs:
        store = scs.SnapshotCropStore(object())
        store.set_sizing("camera.huge", 9000, 500)
        assert store.get_sizing("camera.huge") == (1024, 90)  # clamped to max
        store.set_sizing("camera.tiny", 10, 5)
        assert store.get_sizing("camera.tiny") == (256, 40)  # clamped to min


def test_default_sizing_clears_override() -> None:
    with _crop_store_module() as scs:
        store = scs.SnapshotCropStore(object())
        store.set_sizing("camera.front", 480, 60)
        assert store.get_sizing("camera.front") == (480, 60)
        # Picking the default preset must drop the override, not store a no-op.
        store.set_sizing(
            "camera.front", scs.NOTIF_SNAPSHOT_MAX_WIDTH, scs.NOTIF_SNAPSHOT_QUALITY
        )
        assert store.get_sizing("camera.front") is None


def test_clear_sizing() -> None:
    with _crop_store_module() as scs:
        store = scs.SnapshotCropStore(object())
        store.set_sizing("camera.front", 640, 70)
        store.clear_sizing("camera.front")
        assert store.get_sizing("camera.front") is None


def test_serialize_includes_sizing() -> None:
    with _crop_store_module() as scs:
        store = scs.SnapshotCropStore(object())
        store.set_sizing("camera.front", 720, 75)
        serialized = store._serialize()
        assert serialized["sizing"]["camera.front"] == {"width": 720, "quality": 75}


def test_async_load_restores_crop_and_sizing() -> None:
    with _crop_store_module() as scs:
        store = scs.SnapshotCropStore(object())
        store._store.data = {
            "crops": {"camera.front": {"x": 0.1, "y": 0.1, "w": 0.5, "h": 0.5}},
            "sizing": {"camera.front": {"width": 720, "quality": 75}},
        }
        asyncio.run(store.async_load())
        assert store.get_sizing("camera.front") == (720, 75)
        assert store.get("camera.front") is not None


def test_async_load_tolerates_store_without_sizing_section() -> None:
    """A store written before the quality dropdown shipped has no 'sizing' key —
    it must load without error and yield no overrides (today's default)."""
    with _crop_store_module() as scs:
        store = scs.SnapshotCropStore(object())
        store._store.data = {
            "crops": {"camera.front": {"x": 0.2, "y": 0.2, "w": 0.4, "h": 0.4}}
        }
        asyncio.run(store.async_load())  # must not raise
        assert store.get_sizing("camera.front") is None
        assert store.get("camera.front") is not None
