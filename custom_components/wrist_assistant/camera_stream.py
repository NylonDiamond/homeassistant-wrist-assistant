"""Smart camera streaming with server-side crop, resize, and quality control.

Exports the `CameraStreamCoordinator`, frame/snapshot processing helpers,
and `run_mjpeg_stream` for the v2 endpoints in `wa_v2_views.py`. The legacy
bearer-authed view classes (CameraStreamView/CameraViewportView/
CameraBatchView/CameraSnapshotView) were removed when the watch transport
went pure-v2.
"""

from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from io import BytesIO
import logging
from aiohttp.web import Request, Response, StreamResponse

# NOTE: Pillow (PIL) is imported lazily inside _process_frame / _process_snapshot
# rather than at module load. Both run in the executor, and this module is
# imported from the package __init__ during HA startup — a top-level
# `from PIL import Image` would make a missing/old Pillow fail the *entire*
# integration (push, delta API, everything) at import time, not just camera
# snapshots. Deferring it confines a Pillow problem to the camera-image path.

from homeassistant.components.camera import Image as CameraImage, async_get_image
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

_LOGGER = logging.getLogger(__name__)

# Limits
MIN_WIDTH = 50
MAX_WIDTH = 4000
MIN_QUALITY = 10
MAX_QUALITY = 95
MIN_FPS = 0.5
MAX_FPS = 10.0
DEFAULT_WIDTH = 400
DEFAULT_QUALITY = 75
DEFAULT_FPS = 2.0


@dataclass(slots=True)
class ViewportState:
    """Normalized crop region (0.0-1.0)."""

    x: float = 0.0
    y: float = 0.0
    w: float = 1.0
    h: float = 1.0


_UNSET = object()  # sentinel so None can explicitly clear source_entity_id


@dataclass(slots=True)
class StreamSession:
    """Active stream session keyed by (watch_id, entity_id)."""

    viewport: ViewportState = field(default_factory=ViewportState)
    width: int = DEFAULT_WIDTH
    quality: int = DEFAULT_QUALITY
    fps: float = DEFAULT_FPS
    source_entity_id: str | None = None  # overrides which entity frames come from
    source_width: int = 0   # native resolution of the source camera (set on first frame)
    source_height: int = 0


class CameraStreamCoordinator:
    """Manages active smart camera stream sessions."""

    def __init__(self) -> None:
        self._sessions: dict[tuple[str, str], StreamSession] = {}
        self._device_groups: list[dict] | None = None  # cached camera device groups
        self._device_groups_ts: float = 0  # monotonic timestamp of last build

    def get_or_create_session(
        self,
        watch_id: str,
        entity_id: str,
        width: int = DEFAULT_WIDTH,
        quality: int = DEFAULT_QUALITY,
        fps: float = DEFAULT_FPS,
        viewport: ViewportState | None = None,
    ) -> StreamSession:
        """Get existing session or create a new one."""
        key = (watch_id, entity_id)
        session = self._sessions.get(key)
        if session is None:
            session = StreamSession(
                viewport=viewport or ViewportState(),
                width=width,
                quality=quality,
                fps=fps,
            )
            self._sessions[key] = session
        else:
            session.width = width
            session.quality = quality
            session.fps = fps
        return session

    def update_session(
        self,
        watch_id: str,
        entity_id: str,
        viewport: ViewportState | None = None,
        width: int | None = None,
        source_entity_id: object = _UNSET,
        quality: int | None = None,
        fps: float | None = None,
    ) -> bool:
        """Update params for an active session. Returns True if session exists."""
        key = (watch_id, entity_id)
        session = self._sessions.get(key)
        if session is None:
            return False
        if viewport is not None:
            session.viewport = viewport
        if width is not None:
            session.width = int(_clamp(width, MIN_WIDTH, MAX_WIDTH))
        if source_entity_id is not _UNSET:
            session.source_entity_id = source_entity_id
        if quality is not None:
            session.quality = int(_clamp(quality, MIN_QUALITY, MAX_QUALITY))
        if fps is not None:
            session.fps = _clamp(fps, MIN_FPS, MAX_FPS)
        return True

    _DEVICE_GROUPS_TTL = 300  # seconds — refresh every 5 minutes

    def resolve_quality_level(
        self,
        hass: "HomeAssistant",
        entity_id: str,
        quality_level: str,
    ) -> str | None:
        """Resolve quality_level ('sd' or 'hd') to the correct entity_id for this device.

        Caches device groups with a 5-minute TTL (registry lookups are cheap but
        no need to redo them on every frame). Returns the resolved entity_id,
        or None if no mapping found.
        """
        import time
        from .camera_devices import build_camera_device_groups

        now = time.monotonic()
        if self._device_groups is None or (now - self._device_groups_ts) > self._DEVICE_GROUPS_TTL:
            self._device_groups = build_camera_device_groups(hass)
            self._device_groups_ts = now

        role_key = "hd_stream" if quality_level == "hd" else "sd_stream"

        for device in self._device_groups:
            if entity_id in device["all_entity_ids"]:
                return device["entities"].get(role_key)

        return None

    def invalidate_device_groups(self) -> None:
        """Clear cached device groups (e.g. when entities change)."""
        self._device_groups = None
        self._device_groups_ts = 0

    def remove_session(self, watch_id: str, entity_id: str) -> None:
        """Remove a session on disconnect."""
        self._sessions.pop((watch_id, entity_id), None)

    def shutdown(self) -> None:
        """Clear all sessions."""
        self._sessions.clear()
        self._device_groups = None
        self._device_groups_ts = 0


def _process_frame(
    frame_bytes: bytes,
    viewport: ViewportState,
    width: int,
    quality: int,
) -> tuple[bytes, int, int]:
    """Crop, resize, and recompress a camera frame (runs in executor).

    Returns (processed_bytes, source_width, source_height).
    """
    from PIL import Image  # lazy: see module-top note

    img = Image.open(BytesIO(frame_bytes))
    source_w, source_h = img.size

    # Crop if viewport is not full-frame
    if not (viewport.x <= 0.001 and viewport.y <= 0.001 and viewport.w >= 0.999 and viewport.h >= 0.999):
        img_w, img_h = img.size
        left = int(viewport.x * img_w)
        top = int(viewport.y * img_h)
        right = int((viewport.x + viewport.w) * img_w)
        bottom = int((viewport.y + viewport.h) * img_h)
        # Clamp to image bounds
        left = max(0, min(left, img_w - 1))
        top = max(0, min(top, img_h - 1))
        right = max(left + 1, min(right, img_w))
        bottom = max(top + 1, min(bottom, img_h))
        img = img.crop((left, top, right, bottom))

    # Resize to target width maintaining aspect ratio
    cur_w, cur_h = img.size
    if cur_w > width:
        ratio = width / cur_w
        new_h = max(1, int(cur_h * ratio))
        img = img.resize((width, new_h), Image.Resampling.BILINEAR)

    # Ensure RGB mode for JPEG compatibility
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")

    # Recompress as JPEG
    buf = BytesIO()
    img.save(buf, format="JPEG", quality=quality, optimize=True)
    return buf.getvalue(), source_w, source_h


def _frame_fingerprint(data: bytes) -> int:
    """Fast fingerprint for frame dedup using sampled bytes + length.

    For frames larger than 2KB, samples the first and last 1KB plus
    the total length. Camera JPEGs that differ in content will differ
    in both header metadata and trailing entropy-coded data.
    """
    n = len(data)
    if n <= 2048:
        return hash(data)
    return hash((data[:1024], data[-1024:], n))


def _clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, value))


def _parse_bounded_float(
    value: object,
    *,
    field: str,
    default: float,
    lo: float,
    hi: float,
) -> float:
    """Parse a numeric field and clamp it into range."""
    if value is None:
        return default
    if isinstance(value, bool):
        raise ValueError(f"{field} must be numeric")
    try:
        parsed = float(value)
    except (TypeError, ValueError) as err:
        raise ValueError(f"{field} must be numeric") from err
    return _clamp(parsed, lo, hi)


def _parse_optional_bounded_float(
    value: object,
    *,
    field: str,
    lo: float,
    hi: float,
) -> float | None:
    """Parse an optional numeric field and clamp it into range."""
    if value is None:
        return None
    return _parse_bounded_float(value, field=field, default=lo, lo=lo, hi=hi)


def _parse_bounded_int(
    value: object,
    *,
    field: str,
    default: int,
    lo: int,
    hi: int,
) -> int:
    """Parse an integer-ish field and clamp it into range."""
    return int(
        _parse_bounded_float(value, field=field, default=float(default), lo=lo, hi=hi)
    )


def _parse_optional_bounded_int(
    value: object,
    *,
    field: str,
    lo: int,
    hi: int,
) -> int | None:
    """Parse an optional integer-ish field and clamp it into range."""
    if value is None:
        return None
    return int(_parse_bounded_float(value, field=field, default=float(lo), lo=lo, hi=hi))


def _parse_viewport(
    source: object,
    *,
    default_x: float = 0.0,
    default_y: float = 0.0,
    default_w: float = 1.0,
    default_h: float = 1.0,
) -> ViewportState:
    """Parse viewport coordinates from a mapping-like object."""
    get_value = getattr(source, "get", None)
    if not callable(get_value):
        raise ValueError("Viewport source must be a mapping")
    return ViewportState(
        x=_parse_bounded_float(get_value("x"), field="x", default=default_x, lo=0.0, hi=1.0),
        y=_parse_bounded_float(get_value("y"), field="y", default=default_y, lo=0.0, hi=1.0),
        w=_parse_bounded_float(get_value("w"), field="w", default=default_w, lo=0.01, hi=1.0),
        h=_parse_bounded_float(get_value("h"), field="h", default=default_h, lo=0.01, hi=1.0),
    )


async def run_mjpeg_stream(
    hass: HomeAssistant,
    request: Request,
    coordinator: CameraStreamCoordinator,
    watch_id: str,
    entity_id: str,
) -> StreamResponse:
    """Run the multipart MJPEG frame loop until the client disconnects.

    The session for `(watch_id, entity_id)` must already exist on the
    coordinator — callers create it before invoking this so they can
    validate inputs (query params for legacy, token claim for v2) before
    we start writing response headers.

    The loop reads its mutable params (viewport / width / quality / fps /
    source_entity_id) from the session every iteration, so concurrent
    POSTs to the viewport endpoint flow into the running stream without
    a reconnect.
    """
    session = coordinator._sessions.get((watch_id, entity_id))
    if session is None:
        return Response(text="No active stream session", status=404)

    response = StreamResponse(
        status=200,
        headers={
            "Content-Type": "multipart/x-mixed-replace; boundary=frame",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
        },
    )
    await response.prepare(request)

    consecutive_source_errors = 0
    last_frame_hash: int | None = None
    loop = asyncio.get_running_loop()

    # Adaptive frame rate state
    base_fps = session.fps
    effective_fps = base_fps
    consecutive_slow = 0
    consecutive_fast = 0
    skip_next = False

    try:
        while True:
            # Read current params from session (may be updated by POST endpoint)
            current_viewport = session.viewport
            current_width = session.width
            current_quality = session.quality
            fetch_entity = session.source_entity_id or entity_id

            # Track base FPS changes from viewport POST updates
            if session.fps != base_fps:
                base_fps = session.fps
                effective_fps = base_fps
                consecutive_slow = 0
                consecutive_fast = 0

            frame_interval = 1.0 / effective_fps
            next_frame_at = loop.time() + frame_interval

            # Skip this frame if flagged by backpressure detection
            if skip_next:
                skip_next = False
                await asyncio.sleep(max(0, next_frame_at - loop.time()))
                continue

            try:
                # Get frame from HA camera platform
                image: CameraImage = await async_get_image(
                    hass, fetch_entity, timeout=5
                )
                if image is None or image.content is None:
                    await asyncio.sleep(max(0, next_frame_at - loop.time()))
                    continue

                # Skip duplicate frames from the source camera
                frame_hash = _frame_fingerprint(image.content)
                if frame_hash == last_frame_hash:
                    await asyncio.sleep(max(0, next_frame_at - loop.time()))
                    continue
                last_frame_hash = frame_hash

                # Process frame in executor (PIL is sync/CPU-bound)
                processed, src_w, src_h = await hass.async_add_executor_job(
                    _process_frame,
                    image.content,
                    current_viewport,
                    current_width,
                    current_quality,
                )

                # Capture source resolution (updates on source switch)
                if src_w > 0 and src_h > 0:
                    session.source_width = src_w
                    session.source_height = src_h

                # Write MJPEG frame with backpressure detection
                write_start = loop.time()
                await response.write(
                    b"--frame\r\n"
                    b"Content-Type: image/jpeg\r\n"
                    b"Content-Length: " + str(len(processed)).encode() + b"\r\n"
                    b"\r\n" + processed + b"\r\n"
                )
                write_duration = loop.time() - write_start
                consecutive_source_errors = 0

                # Adaptive FPS: detect slow writes (client can't keep up)
                if write_duration > frame_interval * 0.5:
                    consecutive_fast = 0
                    consecutive_slow += 1
                    # Skip next frame immediately on slow write
                    skip_next = True
                    # After sustained slowness, halve effective FPS
                    if consecutive_slow >= 3 and effective_fps > MIN_FPS:
                        effective_fps = max(MIN_FPS, effective_fps / 2)
                        consecutive_slow = 0
                        _LOGGER.debug(
                            "Adaptive FPS: reduced to %.1f for %s (watch: %s)",
                            effective_fps, entity_id, watch_id,
                        )
                else:
                    consecutive_slow = 0
                    consecutive_fast += 1
                    # Recover toward base FPS after sustained fast writes
                    if consecutive_fast >= 5 and effective_fps < base_fps:
                        effective_fps = min(base_fps, effective_fps * 2)
                        consecutive_fast = 0
                        _LOGGER.debug(
                            "Adaptive FPS: recovered to %.1f for %s (watch: %s)",
                            effective_fps, entity_id, watch_id,
                        )

            except (ConnectionResetError, ConnectionAbortedError):
                break
            except HomeAssistantError:
                _LOGGER.debug("Camera unavailable for %s, retrying", entity_id)
                if fetch_entity != entity_id:
                    consecutive_source_errors += 1
            except Exception:  # noqa: BLE001
                _LOGGER.debug("Frame error for %s, continuing", entity_id)
                if fetch_entity != entity_id:
                    consecutive_source_errors += 1

            # Auto-revert source override after repeated failures
            if consecutive_source_errors >= 5 and session.source_entity_id is not None:
                _LOGGER.warning(
                    "Reverted source_entity_id for %s after %d failures (was %s)",
                    entity_id, consecutive_source_errors, session.source_entity_id,
                )
                session.source_entity_id = None
                consecutive_source_errors = 0

            await asyncio.sleep(max(0, next_frame_at - loop.time()))
    except asyncio.CancelledError:
        pass
    finally:
        coordinator.remove_session(watch_id, entity_id)
        _LOGGER.debug("Smart stream ended for %s (watch: %s)", entity_id, watch_id)

    return response


MAX_BATCH_CAMERAS = 8

# Single-snapshot endpoint limits (complication-optimized)
SNAPSHOT_MAX_WIDTH = 400
SNAPSHOT_MAX_HEIGHT = 300
SNAPSHOT_MAX_BYTES = 102400  # 100KB
SNAPSHOT_DEFAULT_QUALITY = 85


def _process_snapshot(
    frame_bytes: bytes,
    viewport: ViewportState,
    width: int,
    max_height: int,
    quality: int,
    max_bytes: int,
) -> bytes | None:
    """Crop, resize to bounding box, and enforce a byte-size cap.

    Crops from full resolution first (preserving detail), then resizes to fit
    within width x max_height (maintaining aspect ratio), then re-encodes at
    progressively lower quality if the result exceeds max_bytes.
    Returns processed JPEG bytes, or None if it cannot fit within the budget.
    """
    from PIL import Image  # lazy: see module-top note

    img = Image.open(BytesIO(frame_bytes))

    # Crop from full resolution if viewport is not full-frame
    if not (viewport.x <= 0.001 and viewport.y <= 0.001 and viewport.w >= 0.999 and viewport.h >= 0.999):
        img_w, img_h = img.size
        left = int(viewport.x * img_w)
        top = int(viewport.y * img_h)
        right = int((viewport.x + viewport.w) * img_w)
        bottom = int((viewport.y + viewport.h) * img_h)
        left = max(0, min(left, img_w - 1))
        top = max(0, min(top, img_h - 1))
        right = max(left + 1, min(right, img_w))
        bottom = max(top + 1, min(bottom, img_h))
        img = img.crop((left, top, right, bottom))

    # Resize to fit within bounding box maintaining aspect ratio
    cur_w, cur_h = img.size
    scale = min(width / cur_w, max_height / cur_h)
    if scale < 1.0:
        new_w = max(1, int(cur_w * scale))
        new_h = max(1, int(cur_h * scale))
        img = img.resize((new_w, new_h), Image.Resampling.BILINEAR)

    # Ensure RGB mode for JPEG compatibility
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")

    # Encode at requested quality, then step down if over budget
    for q in (quality, 60, 40, 20):
        buf = BytesIO()
        img.save(buf, format="JPEG", quality=q, optimize=True)
        data = buf.getvalue()
        if len(data) <= max_bytes:
            return data

    return None


# ── batch snapshot stream ────────────────────────────────────────────────
# One-shot progressive multipart endpoint: many cameras over one connection,
# each JPEG flushed as it's ready. Replaces N per-camera `op=snapshot` round
# trips (which stampede an NVR-backed source and starve the trailing cameras).
BATCH_SNAPSHOT_BOUNDARY = "wasnap"
# Cameras grabbed at once. The fan-out bound lives HERE (the integration knows
# the source's real ceiling) instead of on the watch, which couldn't.
BATCH_SNAPSHOT_CONCURRENCY = 3
# Whole-request deadline; any camera still pending at this point gets an error
# part so the stream always terminates and the watch stops spinning.
BATCH_SNAPSHOT_DEADLINE = 20.0
BATCH_GRAB_RETRIES = 1
BATCH_GRAB_RETRY_DELAY = 0.3
# A page realistically tops out well under this; guards a pathological request.
MAX_BATCH_SNAPSHOT_CAMERAS = 16


async def run_batch_snapshot_stream(
    hass: HomeAssistant,
    request: Request,
    cameras: list[tuple[str, int]],
    quality: int,
) -> StreamResponse:
    """Stream resized JPEG snapshots for many cameras over one connection.

    Each camera is grabbed concurrently (bounded by BATCH_SNAPSHOT_CONCURRENCY)
    and written to the multipart response *as it completes* — fast cameras paint
    first, a slow one never blocks the others. A grab that fails after one retry
    emits an error part so the client marks that one tile failed without waiting.

    Each part carries `X-Entity-Id` and `X-WA-Status: ok|error` headers; the
    client routes frames by entity, not position (completion order != request
    order).
    """
    response = StreamResponse(
        status=200,
        headers={
            "Content-Type": (
                f"multipart/x-mixed-replace; boundary={BATCH_SNAPSHOT_BOUNDARY}"
            ),
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
        },
    )
    # prepare() before any grab so TTFB is the first camera, not all of them.
    await response.prepare(request)

    sem = asyncio.Semaphore(BATCH_SNAPSHOT_CONCURRENCY)
    boundary = BATCH_SNAPSHOT_BOUNDARY.encode()

    async def _grab(entity_id: str, width: int) -> tuple[str, bytes | None]:
        async with sem:
            for attempt in range(BATCH_GRAB_RETRIES + 1):
                try:
                    image = await async_get_image(hass, entity_id, timeout=5)
                    if image is not None and image.content is not None:
                        data = await hass.async_add_executor_job(
                            _process_snapshot,
                            image.content,
                            ViewportState(),
                            width,
                            width,  # square bounding box; tile crops to fit
                            quality,
                            SNAPSHOT_MAX_BYTES,
                        )
                        if data is not None:
                            return entity_id, data
                except HomeAssistantError:
                    pass
                except Exception:  # noqa: BLE001
                    _LOGGER.debug(
                        "Batch snapshot grab failed for %s", entity_id, exc_info=True
                    )
                if attempt < BATCH_GRAB_RETRIES:
                    await asyncio.sleep(BATCH_GRAB_RETRY_DELAY)
            return entity_id, None

    async def _write_part(entity_id: str, data: bytes | None) -> None:
        eid = entity_id.encode()
        if data is None:
            await response.write(
                b"--" + boundary + b"\r\n"
                b"X-Entity-Id: " + eid + b"\r\n"
                b"X-WA-Status: error\r\n"
                b"Content-Type: text/plain\r\n"
                b"Content-Length: 0\r\n\r\n"
            )
        else:
            await response.write(
                b"--" + boundary + b"\r\n"
                b"X-Entity-Id: " + eid + b"\r\n"
                b"X-WA-Status: ok\r\n"
                b"Content-Type: image/jpeg\r\n"
                b"Content-Length: " + str(len(data)).encode() + b"\r\n\r\n"
                + data + b"\r\n"
            )

    pending = {entity_id for entity_id, _ in cameras}
    tasks = [asyncio.create_task(_grab(eid, w)) for eid, w in cameras]
    try:
        # Writes happen ONLY in this single consumer loop → serialized on the one
        # response; grabs run concurrently under the semaphore.
        for fut in asyncio.as_completed(tasks, timeout=BATCH_SNAPSHOT_DEADLINE):
            entity_id, data = await fut
            pending.discard(entity_id)
            await _write_part(entity_id, data)
    except asyncio.TimeoutError:
        # Deadline hit: stop waiting on stragglers, emit error parts for them.
        for entity_id in list(pending):
            try:
                await _write_part(entity_id, None)
            except (ConnectionResetError, RuntimeError):
                break
    except (ConnectionResetError, RuntimeError):
        # Client disconnected mid-stream — nothing more to send.
        pass
    finally:
        for task in tasks:
            if not task.done():
                task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)
        try:
            await response.write(b"--" + boundary + b"--\r\n")
        except (ConnectionResetError, RuntimeError):
            pass
    return response


# Notification snapshot limits — larger than the complication snapshot above
# because the expanded notification and iOS banner thumbnail render bigger than
# a watch complication. Still byte-capped so a high-res camera can't bloat the
# token cache or the on-device decode.
NOTIF_SNAPSHOT_MAX_WIDTH = 1024
NOTIF_SNAPSHOT_MAX_HEIGHT = 1024
NOTIF_SNAPSHOT_MAX_BYTES = 256000  # 250 KB
NOTIF_SNAPSHOT_QUALITY = 80
NOTIF_SNAPSHOT_CAPTURE_TIMEOUT = 5  # seconds to grab a frame from the camera

# Per-camera notification snapshot sizing is user-tunable from the iOS framing
# page (a quality dropdown that maps to a width + JPEG quality). Both are
# optional overrides; absent → the defaults above (today's behavior). Bounds so
# a hand-edited store or a buggy client can't request something absurd.
NOTIF_SNAPSHOT_MIN_WIDTH = 256
NOTIF_SNAPSHOT_MIN_QUALITY = 40
NOTIF_SNAPSHOT_MAX_QUALITY = 90


def clamp_notif_sizing(width: int, quality: int) -> tuple[int, int]:
    """Clamp a per-camera (width, quality) override into the supported range."""
    width = max(NOTIF_SNAPSHOT_MIN_WIDTH, min(int(width), NOTIF_SNAPSHOT_MAX_WIDTH))
    quality = max(
        NOTIF_SNAPSHOT_MIN_QUALITY, min(int(quality), NOTIF_SNAPSHOT_MAX_QUALITY)
    )
    return width, quality


def notif_snapshot_max_bytes(width: int) -> int:
    """Byte cap for a notification snapshot, scaled with its width so the chosen
    quality is usually honored (the cap rarely forces a quality step-down).
    Linear in width: 1024px → 256 KB (the default), 512px → 128 KB, floored at
    60 KB so even a tiny image has room to look acceptable."""
    return max(60_000, round(width / NOTIF_SNAPSHOT_MAX_WIDTH * NOTIF_SNAPSHOT_MAX_BYTES))


async def capture_notification_snapshot(
    hass: HomeAssistant,
    entity_id: str,
    viewport: ViewportState | None = None,
    *,
    width: int | None = None,
    quality: int | None = None,
) -> bytes | None:
    """Grab a JPEG from a camera entity for a notification.

    `viewport` is the user's saved per-camera framing (normalized crop); when
    None the full frame is captured. `_process_snapshot` crops to it before
    resizing, so passing a tighter region zooms the notification snapshot.

    `width` / `quality` are the user's per-camera sizing override (set from the
    iOS framing page's quality dropdown); None on either falls back to the
    integration default (NOTIF_SNAPSHOT_MAX_WIDTH / NOTIF_SNAPSHOT_QUALITY). The
    byte cap scales with the chosen width. A smaller/lower-quality snapshot
    encodes, transfers, and decodes faster — i.e. paints on the wrist sooner.

    Returns processed JPEG bytes (resized + byte-capped) or None if the camera
    is unavailable, returns no image, or the frame can't be squeezed under the
    byte budget. Never raises for an offline/misbehaving camera — callers fall
    back to a text-only notification.
    """
    if not entity_id.startswith("camera."):
        _LOGGER.warning(
            "Notification snapshot requested for non-camera entity %s", entity_id
        )
        return None
    max_width, jpeg_quality = clamp_notif_sizing(
        NOTIF_SNAPSHOT_MAX_WIDTH if width is None else width,
        NOTIF_SNAPSHOT_QUALITY if quality is None else quality,
    )
    max_bytes = notif_snapshot_max_bytes(max_width)
    try:
        image: CameraImage = await async_get_image(
            hass, entity_id, timeout=NOTIF_SNAPSHOT_CAPTURE_TIMEOUT
        )
    except Exception as err:  # noqa: BLE001 — never let a bad camera kill the push
        _LOGGER.warning("Snapshot capture failed for %s: %s", entity_id, err)
        return None
    if not image or not image.content:
        return None
    # PIL work is CPU-bound — keep it off the event loop. Guard the executor
    # call too: _process_snapshot lazily imports Pillow, so a missing/old
    # Pillow surfaces here as an ImportError. Per this function's contract it
    # must degrade to None (text-only notification), never raise into the push.
    try:
        return await hass.async_add_executor_job(
            _process_snapshot,
            image.content,
            viewport or ViewportState(),  # saved framing, or full frame
            max_width,
            max_width,  # square bounding box (matches the default 1024×1024)
            jpeg_quality,
            max_bytes,
        )
    except Exception as err:  # noqa: BLE001 — never let image processing kill the push
        _LOGGER.warning("Snapshot processing failed for %s: %s", entity_id, err)
        return None


# Full-frame epsilon: a viewport this close to (0,0,1,1) is treated as "no crop".
# Mirrors the threshold _process_snapshot uses when deciding whether to crop.
_FULL_FRAME_EPS = 0.001


def is_full_frame_viewport(viewport: ViewportState) -> bool:
    """True when a crop region is effectively the whole frame (a no-op crop)."""
    return (
        viewport.x <= _FULL_FRAME_EPS
        and viewport.y <= _FULL_FRAME_EPS
        and viewport.w >= 1.0 - _FULL_FRAME_EPS
        and viewport.h >= 1.0 - _FULL_FRAME_EPS
    )


def viewport_matches(request: ViewportState, saved: ViewportState | None) -> bool:
    """Whether ``request`` is the camera's *saved* framing.

    ``saved`` is None when the camera has no stored crop — i.e. full-frame — so a
    request matches only if it too is full-frame. Otherwise all four edges must
    agree within the full-frame epsilon. Used to decide whether a one-off
    snapshot fetch (the iOS framing page) rendered the *same* frame the
    notification path will send, and only then is its aspect safe to cache.
    """
    if saved is None:
        return is_full_frame_viewport(request)
    return (
        abs(request.x - saved.x) <= _FULL_FRAME_EPS
        and abs(request.y - saved.y) <= _FULL_FRAME_EPS
        and abs(request.w - saved.w) <= _FULL_FRAME_EPS
        and abs(request.h - saved.h) <= _FULL_FRAME_EPS
    )


def jpeg_aspect(data: bytes) -> float | None:
    """Width/height of a JPEG, read from its header (no full pixel decode).

    Sent to the client as ``snapshot_aspect`` so it can reserve the notification
    image's footprint before the bytes arrive — no layout shift, no letterbox
    bars while it loads. Best-effort: None when the dimensions can't be read or
    are degenerate. Callers offload this to an executor (Pillow is lazy-imported,
    same as the rest of this module, so a missing Pillow degrades to None here
    instead of raising into the push).
    """
    try:
        from PIL import Image  # lazy: see module-top note

        with Image.open(BytesIO(data)) as img:
            w, h = img.size
        if w > 0 and h > 0:
            return round(w / h, 4)
    except Exception:  # noqa: BLE001 — aspect is advisory; never block the push
        return None
    return None


