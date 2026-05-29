"""Pure-unit regression tests for the camera image pipeline.

Unlike the rest of this suite (black-box HTTP against a running HA), these tests
import ``camera_stream`` directly and exercise the image functions in-process —
no HA instance, no HA_URL/HA_TOKEN needed, so they run in plain CI.

They guard the Pillow-import hardening: ``camera_stream`` imports Pillow lazily
(inside ``_process_frame`` / ``_process_snapshot``) rather than at module load,
so a missing/old Pillow can't fail the *whole* integration at import time — it
degrades to a text-only notification. These tests pin both halves of that:

  * Pillow present  → the functions still produce correct, byte-budgeted JPEGs.
  * Pillow absent   → the module still imports, and ``capture_notification_snapshot``
                      returns None instead of raising into the push pipeline.

``camera_stream`` pulls in aiohttp + a few homeassistant modules at load time,
which CI need not have installed; we stub those (the image functions use only
stdlib + Pillow + the module-local ViewportState at runtime).
"""

from __future__ import annotations

import asyncio
import contextlib
import importlib.util
import sys
import types
from io import BytesIO
from pathlib import Path

import pytest

_CAMERA_STREAM_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "camera_stream.py"
)


def _install_ha_stubs() -> None:
    """Register stub aiohttp/homeassistant modules so camera_stream can load.

    Only the names referenced at module import time are stubbed; the image
    functions never touch them at runtime.
    """

    def stub(name: str, **attrs: object) -> None:
        module = sys.modules.get(name) or types.ModuleType(name)
        for key, value in attrs.items():
            setattr(module, key, value)
        sys.modules[name] = module

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
        async_get_image=lambda *args, **kwargs: None,
    )
    stub("homeassistant.core", HomeAssistant=type("HomeAssistant", (), {}))
    stub(
        "homeassistant.exceptions",
        HomeAssistantError=type("HomeAssistantError", (Exception,), {}),
    )


class _BlockPillow:
    """Meta-path finder that makes ``import PIL`` raise, simulating absence."""

    def find_spec(self, name, path=None, target=None):  # noqa: D401, ANN001
        if name == "PIL" or name.startswith("PIL."):
            raise ImportError("Pillow not installed (simulated)")
        return None


@contextlib.contextmanager
def _fresh_camera_stream(modname: str, *, block_pillow: bool = False):
    """Load a fresh copy of camera_stream under ``modname``, then fully restore.

    Snapshots sys.modules and sys.meta_path and restores them on exit so the
    stub modules (and, when blocking, the PIL finder) can't leak into the rest
    of the test session.
    """
    saved_modules = dict(sys.modules)
    blocker = _BlockPillow() if block_pillow else None
    try:
        if blocker is not None:
            for key in [k for k in sys.modules if k == "PIL" or k.startswith("PIL.")]:
                del sys.modules[key]
            sys.meta_path.insert(0, blocker)
        _install_ha_stubs()
        spec = importlib.util.spec_from_file_location(modname, _CAMERA_STREAM_PATH)
        module = importlib.util.module_from_spec(spec)
        # Register before exec so dataclass(slots=True) introspection can resolve
        # the module by name.
        sys.modules[modname] = module
        spec.loader.exec_module(module)
        yield module
    finally:
        if blocker is not None and blocker in sys.meta_path:
            sys.meta_path.remove(blocker)
        for key in list(sys.modules):
            if key not in saved_modules:
                del sys.modules[key]
        sys.modules.update(saved_modules)


def _jpeg_dims(data: bytes) -> tuple[tuple[int, int], int]:
    from PIL import Image

    img = Image.open(BytesIO(data))
    img.load()
    return img.size, len(data)


def _test_jpeg(width: int = 1600, height: int = 1200) -> bytes:
    from PIL import Image

    buf = BytesIO()
    Image.new("RGB", (width, height), (10, 120, 200)).save(buf, "JPEG", quality=90)
    return buf.getvalue()


# ── Happy path: Pillow present, output behavior preserved ─────────────────


def test_process_frame_resizes_to_target_width() -> None:
    pytest.importorskip("PIL")
    with _fresh_camera_stream("cs_frame") as cs:
        raw = _test_jpeg()
        out, source_w, source_h = cs._process_frame(
            raw, cs.ViewportState(), 400, 80
        )
        (w, h), _ = _jpeg_dims(out)
        assert (source_w, source_h) == (1600, 1200)
        assert w == 400  # width-bound, aspect preserved
        assert h == 300


def test_process_frame_applies_crop() -> None:
    pytest.importorskip("PIL")
    with _fresh_camera_stream("cs_frame_crop") as cs:
        raw = _test_jpeg()
        crop = cs.ViewportState(x=0.25, y=0.25, w=0.5, h=0.5)  # center 1:1
        out, _, _ = cs._process_frame(raw, crop, 400, 80)
        (w, _h), _ = _jpeg_dims(out)
        assert w == 400


def test_process_snapshot_within_byte_and_pixel_budget() -> None:
    pytest.importorskip("PIL")
    with _fresh_camera_stream("cs_snap") as cs:
        raw = _test_jpeg()
        out = cs._process_snapshot(raw, cs.ViewportState(), 1024, 1024, 80, 256000)
        assert out is not None
        (dims, nbytes) = _jpeg_dims(out)
        assert nbytes <= 256000
        assert max(dims) <= 1024


def test_process_snapshot_returns_none_when_budget_impossible() -> None:
    pytest.importorskip("PIL")
    with _fresh_camera_stream("cs_snap_none") as cs:
        raw = _test_jpeg()
        # 50 bytes is far below any encodable JPEG → contract is to return None.
        assert cs._process_snapshot(raw, cs.ViewportState(), 1024, 1024, 80, 50) is None


# ── Degradation path: Pillow absent ───────────────────────────────────────


def test_module_imports_without_pillow() -> None:
    """The core hardening: a missing Pillow must not break module import.

    Before the fix this raised ImportError at module load, failing the entire
    integration (push, delta API, everything), not just camera snapshots.
    """
    with _fresh_camera_stream("cs_nopil_import", block_pillow=True) as cs:
        assert hasattr(cs, "capture_notification_snapshot")
        # Sanity: PIL really is unimportable inside this context.
        with pytest.raises(ImportError):
            import PIL  # noqa: F401


def test_process_snapshot_raises_importerror_without_pillow() -> None:
    """The lazy import fires at call time (not load time) when Pillow is gone."""
    with _fresh_camera_stream("cs_nopil_call", block_pillow=True) as cs:
        with pytest.raises(ImportError):
            cs._process_snapshot(b"x", cs.ViewportState(), 1024, 1024, 80, 256000)


def test_capture_degrades_to_none_without_pillow() -> None:
    """capture_notification_snapshot swallows the ImportError and returns None.

    This is the contract that keeps an image-carrying push from failing outright
    on a Pillow-less install: the notification just falls back to text-only.
    """
    with _fresh_camera_stream("cs_nopil_capture", block_pillow=True) as cs:

        class _FakeImage:
            content = b"fake-jpeg-bytes"

        async def _fake_get_image(hass, entity_id, timeout=5):  # noqa: ANN001
            return _FakeImage()

        cs.async_get_image = _fake_get_image  # patch the name the module resolved

        class _FakeHass:
            async def async_add_executor_job(self, fn, *args):  # noqa: ANN001
                return fn(*args)  # run inline; raises ImportError inside

        result = asyncio.run(
            cs.capture_notification_snapshot(_FakeHass(), "camera.front_door")
        )
        assert result is None


# ── Per-camera notification snapshot sizing (the iOS quality dropdown) ─────


def test_clamp_notif_sizing_bounds() -> None:
    with _fresh_camera_stream("cs_clamp") as cs:
        # In-range values pass through untouched.
        assert cs.clamp_notif_sizing(720, 75) == (720, 75)
        # Over the ceiling → clamped to the max.
        assert cs.clamp_notif_sizing(9000, 500) == (
            cs.NOTIF_SNAPSHOT_MAX_WIDTH,
            cs.NOTIF_SNAPSHOT_MAX_QUALITY,
        )
        # Under the floor → clamped to the min.
        assert cs.clamp_notif_sizing(1, 1) == (
            cs.NOTIF_SNAPSHOT_MIN_WIDTH,
            cs.NOTIF_SNAPSHOT_MIN_QUALITY,
        )


def test_notif_snapshot_max_bytes_scales_with_width() -> None:
    with _fresh_camera_stream("cs_bytes") as cs:
        # Full width → today's default cap.
        assert cs.notif_snapshot_max_bytes(cs.NOTIF_SNAPSHOT_MAX_WIDTH) == (
            cs.NOTIF_SNAPSHOT_MAX_BYTES
        )
        # Half the width → roughly half the cap (linear).
        assert cs.notif_snapshot_max_bytes(512) == round(
            512 / cs.NOTIF_SNAPSHOT_MAX_WIDTH * cs.NOTIF_SNAPSHOT_MAX_BYTES
        )
        # Tiny width → floored so a small image still has room to look OK.
        assert cs.notif_snapshot_max_bytes(64) == 60_000


def test_capture_honors_sizing_override() -> None:
    """A width/quality override produces a genuinely smaller, fewer-byte JPEG
    than the default — the whole point: faster encode/transfer/decode."""
    pytest.importorskip("PIL")
    with _fresh_camera_stream("cs_capture_sizing") as cs:
        raw = _test_jpeg(1600, 1200)

        class _FakeImage:
            content = raw

        async def _fake_get_image(hass, entity_id, timeout=5):  # noqa: ANN001
            return _FakeImage()

        cs.async_get_image = _fake_get_image

        class _FakeHass:
            async def async_add_executor_job(self, fn, *args):  # noqa: ANN001
                return fn(*args)  # run inline

        small = asyncio.run(
            cs.capture_notification_snapshot(
                _FakeHass(), "camera.front", width=480, quality=55
            )
        )
        big = asyncio.run(
            cs.capture_notification_snapshot(_FakeHass(), "camera.front")  # default
        )
        assert small is not None and big is not None
        (small_dims, small_bytes) = _jpeg_dims(small)
        (big_dims, big_bytes) = _jpeg_dims(big)
        assert max(small_dims) <= 480  # width override applied
        assert max(big_dims) <= cs.NOTIF_SNAPSHOT_MAX_WIDTH
        assert max(small_dims) < max(big_dims)  # genuinely smaller
        assert small_bytes < big_bytes  # fewer bytes on the wire
