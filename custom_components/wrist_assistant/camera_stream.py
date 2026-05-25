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
from PIL import Image

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


# Notification snapshot limits — larger than the complication snapshot above
# because the expanded notification and iOS banner thumbnail render bigger than
# a watch complication. Still byte-capped so a high-res camera can't bloat the
# token cache or the on-device decode.
NOTIF_SNAPSHOT_MAX_WIDTH = 1024
NOTIF_SNAPSHOT_MAX_HEIGHT = 1024
NOTIF_SNAPSHOT_MAX_BYTES = 256000  # 250 KB
NOTIF_SNAPSHOT_QUALITY = 80
NOTIF_SNAPSHOT_CAPTURE_TIMEOUT = 5  # seconds to grab a frame from the camera


async def capture_notification_snapshot(
    hass: HomeAssistant, entity_id: str, viewport: ViewportState | None = None
) -> bytes | None:
    """Grab a JPEG from a camera entity for a notification.

    `viewport` is the user's saved per-camera framing (normalized crop); when
    None the full frame is captured. `_process_snapshot` crops to it before
    resizing, so passing a tighter region zooms the notification snapshot.

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
    try:
        image: CameraImage = await async_get_image(
            hass, entity_id, timeout=NOTIF_SNAPSHOT_CAPTURE_TIMEOUT
        )
    except Exception as err:  # noqa: BLE001 — never let a bad camera kill the push
        _LOGGER.warning("Snapshot capture failed for %s: %s", entity_id, err)
        return None
    if not image or not image.content:
        return None
    # PIL work is CPU-bound — keep it off the event loop.
    return await hass.async_add_executor_job(
        _process_snapshot,
        image.content,
        viewport or ViewportState(),  # saved framing, or full frame
        NOTIF_SNAPSHOT_MAX_WIDTH,
        NOTIF_SNAPSHOT_MAX_HEIGHT,
        NOTIF_SNAPSHOT_QUALITY,
        NOTIF_SNAPSHOT_MAX_BYTES,
    )


