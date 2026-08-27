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


# ── image.* sources (e.g. a 3D-printer snapshot): feature #22 ─────────────────


def _test_png(width: int = 800, height: int = 600) -> bytes:
    from PIL import Image

    buf = BytesIO()
    # RGBA on purpose: an image entity may serve a PNG with alpha; _process_snapshot
    # must flatten it to RGB before the JPEG re-encode.
    Image.new("RGBA", (width, height), (200, 60, 10, 255)).save(buf, "PNG")
    return buf.getvalue()


def test_capture_from_image_entity() -> None:
    """An `image.*` source (e.g. a Bambu 3D-printer job snapshot) is captured via
    the image domain's `async_get_image` and flows through the same resize/JPEG
    pipeline as a camera, including PNG-with-alpha input. Fixes feature #22."""
    pytest.importorskip("PIL")
    with _fresh_camera_stream("cs_capture_image") as cs:
        raw = _test_png(800, 600)

        class _FakeImage:
            content = raw
            content_type = "image/png"

        async def _fake_img_get(hass, entity_id, timeout=10):  # noqa: ANN001
            return _FakeImage()

        # Under the HA stubs the image component isn't stubbed, so the module
        # loads _image_get_image as None; patch in the fake, the same way the
        # camera tests patch async_get_image.
        cs._image_get_image = _fake_img_get

        class _FakeHass:
            async def async_add_executor_job(self, fn, *args):  # noqa: ANN001
                return fn(*args)  # run inline

        result = asyncio.run(
            cs.capture_notification_snapshot(_FakeHass(), "image.bambu_snapshot")
        )
        assert result is not None
        dims, _ = _jpeg_dims(result)
        assert max(dims) <= cs.NOTIF_SNAPSHOT_MAX_WIDTH
        assert result[:2] == b"\xff\xd8"  # re-encoded to JPEG (SOI marker)


def test_capture_image_entity_degrades_when_helper_missing() -> None:
    """On an HA core too old to expose the image helper (_image_get_image is
    None), an image source degrades to None (text-only), never raises."""
    with _fresh_camera_stream("cs_image_no_helper") as cs:
        cs._image_get_image = None  # simulate an older core

        class _FakeHass:
            async def async_add_executor_job(self, fn, *args):  # noqa: ANN001
                return fn(*args)

        result = asyncio.run(
            cs.capture_notification_snapshot(_FakeHass(), "image.bambu_snapshot")
        )
        assert result is None


def test_capture_image_entity_fetch_error_returns_none() -> None:
    """A failing image fetch (unavailable entity, timeout) returns None, not a
    crash into the push pipeline."""
    with _fresh_camera_stream("cs_image_fetch_err") as cs:

        async def _boom(hass, entity_id, timeout=10):  # noqa: ANN001
            raise RuntimeError("image unavailable")

        cs._image_get_image = _boom

        class _FakeHass:
            async def async_add_executor_job(self, fn, *args):  # noqa: ANN001
                return fn(*args)

        result = asyncio.run(
            cs.capture_notification_snapshot(_FakeHass(), "image.gone")
        )
        assert result is None


def test_capture_rejects_unsupported_domain() -> None:
    """A non-camera, non-image entity is refused up front (returns None)."""
    with _fresh_camera_stream("cs_capture_reject") as cs:

        class _FakeHass:
            async def async_add_executor_job(self, fn, *args):  # noqa: ANN001
                return fn(*args)

        result = asyncio.run(
            cs.capture_notification_snapshot(_FakeHass(), "sensor.temperature")
        )
        assert result is None


# ── jpeg_aspect: width/height read from the header (drives snapshot_aspect) ──


def test_jpeg_aspect_reads_dimensions() -> None:
    pytest.importorskip("PIL")
    with _fresh_camera_stream("cs_aspect") as cs:
        assert cs.jpeg_aspect(_test_jpeg(1600, 900)) == 1.7778  # 16:9
        assert cs.jpeg_aspect(_test_jpeg(1600, 1200)) == 1.3333  # 4:3
        assert cs.jpeg_aspect(_test_jpeg(900, 1600)) == 0.5625  # portrait
        assert cs.jpeg_aspect(_test_jpeg(1000, 1000)) == 1.0  # square


def test_jpeg_aspect_bad_bytes_returns_none() -> None:
    pytest.importorskip("PIL")
    with _fresh_camera_stream("cs_aspect_bad") as cs:
        assert cs.jpeg_aspect(b"not a jpeg") is None
        assert cs.jpeg_aspect(b"") is None


def test_jpeg_aspect_without_pillow_returns_none() -> None:
    """A missing Pillow must degrade to None, never raise into the push."""
    with _fresh_camera_stream("cs_aspect_nopil", block_pillow=True) as cs:
        assert cs.jpeg_aspect(_PNG_OR_JPEG_BYTES) is None


# A few bytes that look like a JPEG SOI; only used by the no-Pillow test, where
# Pillow is blocked before any decode is attempted.
_PNG_OR_JPEG_BYTES = b"\xff\xd8\xff\xe0"


# ── viewport_matches / is_full_frame_viewport: gate for warming the aspect ──


def test_is_full_frame_viewport() -> None:
    with _fresh_camera_stream("cs_fullframe") as cs:
        assert cs.is_full_frame_viewport(cs.ViewportState())  # default = (0,0,1,1)
        assert cs.is_full_frame_viewport(cs.ViewportState(0.0005, 0.0005, 0.9995, 0.9995))
        assert not cs.is_full_frame_viewport(cs.ViewportState(0.1, 0.1, 0.8, 0.8))


def test_viewport_matches_none_saved_is_full_frame() -> None:
    with _fresh_camera_stream("cs_vpm_none") as cs:
        # No saved crop ⇒ full frame: only a full-frame request matches.
        assert cs.viewport_matches(cs.ViewportState(), None)
        assert not cs.viewport_matches(cs.ViewportState(0.1, 0.1, 0.5, 0.5), None)


def test_viewport_matches_compares_saved_crop() -> None:
    with _fresh_camera_stream("cs_vpm_crop") as cs:
        saved = cs.ViewportState(0.2, 0.1, 0.6, 0.7)
        assert cs.viewport_matches(cs.ViewportState(0.2, 0.1, 0.6, 0.7), saved)
        # Within epsilon still matches (float round-trip through the client).
        assert cs.viewport_matches(cs.ViewportState(0.2003, 0.1, 0.6, 0.6997), saved)
        # A different (e.g. in-progress editor) crop does not.
        assert not cs.viewport_matches(cs.ViewportState(0.3, 0.1, 0.6, 0.7), saved)
        # A full-frame request against a saved crop does not.
        assert not cs.viewport_matches(cs.ViewportState(), saved)


# ── session reuse: a new connection's token viewport must win ─────────────


def test_get_or_create_session_updates_viewport_on_reuse() -> None:
    """A reused session must adopt the new connection's token viewport.

    Repro for the notification→tap→full-screen bug: the cropped notification
    live stream leaves a session keyed by (watch_id, entity_id); tapping it
    opens the in-app full-screen view, which mints a *full-frame* token for the
    same camera. The session is keyed by (watch_id, entity_id), so the second
    connection reuses the first's session object — and before the fix it kept
    the stale crop, leaving the live stream server-cropped so the Crown could
    never zoom back out.
    """
    with _fresh_camera_stream("cs_session_reuse") as cs:
        coord = cs.CameraStreamCoordinator()
        crop = cs.ViewportState(0.25, 0.25, 0.5, 0.5)

        # 1) Notification stream opens cropped.
        s1 = coord.get_or_create_session("watch1", "camera.front", viewport=crop)
        assert s1.viewport == crop

        # 2) Full-screen reuses the same key with a full-frame token.
        s2 = coord.get_or_create_session(
            "watch1", "camera.front", viewport=cs.ViewportState()
        )
        assert s2 is s1  # same session object, keyed by (watch_id, entity_id)
        assert cs.is_full_frame_viewport(s2.viewport)

        # 3) A mid-stream width-only retune (viewport=None) must NOT reset it —
        #    live zoom-resolution updates keep the active viewport.
        coord.update_session("watch1", "camera.front", width=480)
        assert cs.is_full_frame_viewport(
            coord._sessions[("watch1", "camera.front")].viewport
        )


# ── batch snapshot stream ─────────────────────────────────────────────────


class _RecordingStreamResponse:
    """Minimal StreamResponse stand-in that records every written chunk."""

    def __init__(self, status: int = 200, headers: dict | None = None) -> None:
        self.status = status
        self.headers = headers or {}
        self.chunks: list[bytes] = []
        self.prepared = False

    async def prepare(self, request: object) -> None:
        self.prepared = True

    async def write(self, data: bytes) -> None:
        assert self.prepared, "write before prepare"  # TTFB guard
        self.chunks.append(bytes(data))

    @property
    def body(self) -> bytes:
        return b"".join(self.chunks)


class _FakeHass:
    """Runs executor jobs inline so _process_snapshot produces real JPEG bytes."""

    async def async_add_executor_job(self, func, *args):  # noqa: ANN001
        return func(*args)


def test_run_batch_snapshot_stream_emits_progressive_parts() -> None:
    with _fresh_camera_stream("cs_batch") as cs:
        cs.StreamResponse = _RecordingStreamResponse
        cs.BATCH_GRAB_RETRY_DELAY = 0.0  # no sleep between the one retry
        jpeg = _test_jpeg(640, 480)

        good = {"camera.front", "camera.side"}

        async def _fake_get_image(hass, entity_id, timeout=5):  # noqa: ANN001
            if entity_id in good:
                return types.SimpleNamespace(content=jpeg)
            raise cs.HomeAssistantError("camera unavailable")

        cs.async_get_image = _fake_get_image

        cameras = [
            ("camera.front", 220),
            ("camera.side", 220),
            ("camera.broken", 220),  # always fails → error part
        ]
        resp = asyncio.run(
            cs.run_batch_snapshot_stream(_FakeHass(), object(), cameras, 80)
        )

        assert resp.prepared
        body = resp.body

        # One opening boundary per camera + a closing boundary.
        assert body.count(b"--wasnap\r\n") == len(cameras)
        assert body.endswith(b"--wasnap--\r\n")

        # Every camera is addressed by entity_id (routing is by header).
        for entity_id, _ in cameras:
            assert f"X-Entity-Id: {entity_id}".encode() in body

        # The two good cameras carry ok JPEG parts; the broken one is an error.
        assert body.count(b"X-WA-Status: ok\r\n") == 2
        assert body.count(b"X-WA-Status: error\r\n") == 1
        assert b"\xff\xd8" in body  # a real JPEG SOI landed in the stream


def test_run_batch_snapshot_stream_all_failures_still_closes() -> None:
    with _fresh_camera_stream("cs_batch_fail") as cs:
        cs.StreamResponse = _RecordingStreamResponse
        cs.BATCH_GRAB_RETRY_DELAY = 0.0

        async def _always_fail(hass, entity_id, timeout=5):  # noqa: ANN001
            return None  # no image available

        cs.async_get_image = _always_fail

        cameras = [("camera.a", 200), ("camera.b", 200)]
        resp = asyncio.run(
            cs.run_batch_snapshot_stream(_FakeHass(), object(), cameras, 80)
        )

        body = resp.body
        assert body.count(b"X-WA-Status: error\r\n") == 2
        assert body.count(b"X-WA-Status: ok\r\n") == 0
        assert body.endswith(b"--wasnap--\r\n")


def test_run_batch_snapshot_stream_caps_concurrency() -> None:
    """A positive concurrency throttles in-flight grabs (NVR protection)."""
    with _fresh_camera_stream("cs_batch_conc") as cs:
        cs.StreamResponse = _RecordingStreamResponse
        cs.BATCH_GRAB_RETRY_DELAY = 0.0
        jpeg = _test_jpeg(320, 240)

        inflight = 0
        max_inflight = 0

        async def _slow_get_image(hass, entity_id, timeout=5):  # noqa: ANN001
            nonlocal inflight, max_inflight
            inflight += 1
            max_inflight = max(max_inflight, inflight)
            await asyncio.sleep(0.02)  # hold the slot so any overlap is observable
            inflight -= 1
            return types.SimpleNamespace(content=jpeg)

        cs.async_get_image = _slow_get_image

        cameras = [(f"camera.c{i}", 200) for i in range(6)]
        resp = asyncio.run(
            cs.run_batch_snapshot_stream(
                _FakeHass(), object(), cameras, 80, concurrency=2
            )
        )

        assert max_inflight <= 2  # never more than the cap in flight at once
        assert resp.body.count(b"X-WA-Status: ok\r\n") == 6  # all still delivered


def test_run_batch_snapshot_stream_unlimited_concurrency() -> None:
    """concurrency=0 (the default) means no throttle — every camera at once."""
    with _fresh_camera_stream("cs_batch_unlim") as cs:
        cs.StreamResponse = _RecordingStreamResponse
        cs.BATCH_GRAB_RETRY_DELAY = 0.0
        jpeg = _test_jpeg(320, 240)

        inflight = 0
        max_inflight = 0

        async def _slow_get_image(hass, entity_id, timeout=5):  # noqa: ANN001
            nonlocal inflight, max_inflight
            inflight += 1
            max_inflight = max(max_inflight, inflight)
            await asyncio.sleep(0.02)
            inflight -= 1
            return types.SimpleNamespace(content=jpeg)

        cs.async_get_image = _slow_get_image

        cameras = [(f"camera.c{i}", 200) for i in range(6)]
        resp = asyncio.run(
            cs.run_batch_snapshot_stream(
                _FakeHass(), object(), cameras, 80, concurrency=0
            )
        )

        assert max_inflight == 6  # all grabbed in parallel, no cap
        assert resp.body.count(b"X-WA-Status: ok\r\n") == 6


# ── Draft-mode (DCT-scaled) decode ────────────────────────────────────────
# _process_frame / _process_snapshot ask libjpeg for a reduced-scale decode
# when the output is much smaller than the source. These guard the contract
# the client relies on: reported source dimensions are the ORIGINAL frame,
# output size is unchanged, and a zoomed viewport still gets full output width.


def test_process_frame_draft_keeps_source_dims_and_output_width() -> None:
    pytest.importorskip("PIL")
    with _fresh_camera_stream("cs_draft_frame") as cs:
        raw = _test_jpeg(3840, 2160)
        out, source_w, source_h = cs._process_frame(
            raw, cs.ViewportState(), 400, 75
        )
        assert (source_w, source_h) == (3840, 2160)
        (w, h), _ = _jpeg_dims(out)
        assert w == 400
        assert h == 225


def test_process_frame_draft_with_zoomed_viewport_keeps_width() -> None:
    """A quarter-frame crop needs 4x the pixels of the output; draft must not
    reduce below that, or the crop would come out narrower than requested."""
    pytest.importorskip("PIL")
    with _fresh_camera_stream("cs_draft_zoom") as cs:
        raw = _test_jpeg(3840, 2160)
        vp = cs.ViewportState(x=0.25, y=0.25, w=0.25, h=0.25)
        out, source_w, source_h = cs._process_frame(raw, vp, 400, 75)
        assert (source_w, source_h) == (3840, 2160)
        (w, h), _ = _jpeg_dims(out)
        assert w == 400
        assert abs(h - 225) <= 2


def test_process_frame_draft_skipped_for_small_source() -> None:
    pytest.importorskip("PIL")
    with _fresh_camera_stream("cs_draft_small") as cs:
        raw = _test_jpeg(320, 240)
        out, source_w, source_h = cs._process_frame(
            raw, cs.ViewportState(), 400, 75
        )
        assert (source_w, source_h) == (320, 240)
        (w, h), _ = _jpeg_dims(out)
        assert (w, h) == (320, 240)


def test_process_snapshot_draft_fits_bounding_box() -> None:
    pytest.importorskip("PIL")
    with _fresh_camera_stream("cs_draft_snap") as cs:
        raw = _test_jpeg(3840, 2160)
        out = cs._process_snapshot(raw, cs.ViewportState(), 400, 300, 75, 200_000)
        assert out is not None
        (w, h), _ = _jpeg_dims(out)
        assert w == 400
        assert h == 225


def test_process_frame_png_source_unaffected_by_draft() -> None:
    """draft() is JPEG-only; a PNG source must still go through the normal path."""
    pytest.importorskip("PIL")
    from PIL import Image

    with _fresh_camera_stream("cs_draft_png") as cs:
        buf = BytesIO()
        Image.new("RGB", (1600, 1200), (5, 5, 5)).save(buf, "PNG")
        out, source_w, source_h = cs._process_frame(
            buf.getvalue(), cs.ViewportState(), 400, 75
        )
        assert (source_w, source_h) == (1600, 1200)
        (w, h), _ = _jpeg_dims(out)
        assert (w, h) == (400, 300)
