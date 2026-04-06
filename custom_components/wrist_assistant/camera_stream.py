"""Smart camera streaming with server-side crop, resize, and quality control."""

from __future__ import annotations

import asyncio
import base64
from dataclasses import dataclass, field
import gzip
from io import BytesIO
import json as _json
import logging
from aiohttp.web import Request, Response, StreamResponse
from PIL import Image

from homeassistant.components.camera import Image as CameraImage, async_get_image
from homeassistant.components.http import HomeAssistantView
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


class CameraStreamView(HomeAssistantView):
    """GET endpoint that serves an MJPEG stream with server-side processing."""

    url = "/api/wrist_assistant/camera/stream/{entity_id}"
    name = "api:wrist_assistant_camera_stream"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def get(self, request: Request, entity_id: str) -> StreamResponse:
        """Handle MJPEG stream request."""
        from .const import DOMAIN, WristAssistantData

        domain_data: WristAssistantData | None = self._hass.data.get(DOMAIN)
        if domain_data is None:
            return Response(text="Integration not loaded", status=503)
        coordinator = domain_data.camera_stream_coordinator

        # Validate entity
        state = self._hass.states.get(entity_id)
        if state is None or not entity_id.startswith("camera."):
            return Response(text="Invalid camera entity", status=404)

        # Parse query params
        query = request.query
        watch_id = query.get("watch_id", "unknown")
        try:
            width = _parse_bounded_int(
                query.get("width"),
                field="width",
                default=DEFAULT_WIDTH,
                lo=MIN_WIDTH,
                hi=MAX_WIDTH,
            )
            quality = _parse_bounded_int(
                query.get("quality"),
                field="quality",
                default=DEFAULT_QUALITY,
                lo=MIN_QUALITY,
                hi=MAX_QUALITY,
            )
            fps = _parse_bounded_float(
                query.get("fps"),
                field="fps",
                default=DEFAULT_FPS,
                lo=MIN_FPS,
                hi=MAX_FPS,
            )
        except ValueError as err:
            return Response(text=str(err), status=400)

        # Parse optional initial viewport
        viewport = ViewportState()
        if "x" in query:
            try:
                viewport = _parse_viewport(query)
            except ValueError as err:
                return Response(text=str(err), status=400)

        session = coordinator.get_or_create_session(
            watch_id, entity_id, width, quality, fps, viewport
        )

        # Set up MJPEG response
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
                        self._hass, fetch_entity, timeout=5
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
                    processed, src_w, src_h = await self._hass.async_add_executor_job(
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


class CameraViewportView(HomeAssistantView):
    """POST endpoint to update the crop viewport for an active stream."""

    url = "/api/wrist_assistant/camera/viewport"
    name = "api:wrist_assistant_camera_viewport"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def post(self, request: Request) -> Response:
        """Update stream params (viewport and/or width) for an active session."""
        from .const import DOMAIN, WristAssistantData

        domain_data: WristAssistantData | None = self._hass.data.get(DOMAIN)
        if domain_data is None:
            return self.json_message("Integration not loaded", status_code=503)
        coordinator = domain_data.camera_stream_coordinator

        try:
            payload = await request.json()
        except (ValueError, UnicodeDecodeError):
            return self.json_message("Invalid JSON body", status_code=400)

        if not isinstance(payload, dict):
            return self.json_message("Expected JSON object", status_code=400)

        entity_id = payload.get("entity_id")
        watch_id = payload.get("watch_id")
        if not isinstance(entity_id, str) or not isinstance(watch_id, str):
            return self.json_message("entity_id and watch_id required", status_code=400)

        # Optional viewport
        viewport = None
        if any(k in payload for k in ("x", "y", "w", "h")):
            try:
                viewport = _parse_viewport(payload)
            except ValueError as err:
                return self.json_message(str(err), status_code=400)

        # Optional width
        try:
            width = _parse_optional_bounded_int(
                payload.get("width"),
                field="width",
                lo=MIN_WIDTH,
                hi=MAX_WIDTH,
            )
            quality = _parse_optional_bounded_int(
                payload.get("quality"),
                field="quality",
                lo=MIN_QUALITY,
                hi=MAX_QUALITY,
            )
            fps = _parse_optional_bounded_float(
                payload.get("fps"),
                field="fps",
                lo=MIN_FPS,
                hi=MAX_FPS,
            )
        except ValueError as err:
            return self.json_message(str(err), status_code=400)

        # Optional quality_level — resolves to source_entity_id via device groups
        source_entity_id = _UNSET
        if "quality_level" in payload:
            ql = payload["quality_level"]
            if ql in ("sd", "hd"):
                resolved = coordinator.resolve_quality_level(
                    self._hass, entity_id, ql
                )
                if resolved:
                    source_entity_id = resolved if resolved != entity_id else None
                else:
                    # No device group mapping — clear any override
                    source_entity_id = None
            else:
                return self.json_message(
                    "quality_level must be 'sd' or 'hd'", status_code=400
                )

        if coordinator.update_session(
            watch_id,
            entity_id,
            viewport=viewport,
            width=width,
            source_entity_id=source_entity_id,
            quality=quality,
            fps=fps,
        ):
            # Return source resolution if known (captured from frames)
            key = (watch_id, entity_id)
            session = coordinator._sessions.get(key)
            result: dict = {"status": "ok"}
            if session and session.source_width > 0:
                result["source_width"] = session.source_width
                result["source_height"] = session.source_height
            return self.json(result)
        return self.json_message("No active stream for this session", status_code=404)


MAX_BATCH_CAMERAS = 8

# Single-snapshot endpoint limits (complication-optimized)
SNAPSHOT_MAX_WIDTH = 400
SNAPSHOT_MAX_BYTES = 102400  # 100KB
SNAPSHOT_DEFAULT_QUALITY = 85


class CameraBatchView(HomeAssistantView):
    """POST endpoint that fetches multiple camera snapshots in parallel."""

    url = "/api/wrist_assistant/camera/batch"
    name = "api:wrist_assistant_camera_batch"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def post(self, request: Request) -> Response:
        """Handle batch camera snapshot request."""
        try:
            payload = await request.json()
        except (ValueError, UnicodeDecodeError):
            return self.json_message("Invalid JSON body", status_code=400)

        if not isinstance(payload, dict):
            return self.json_message("Expected JSON object", status_code=400)

        cameras = payload.get("cameras")
        if not isinstance(cameras, list) or not cameras:
            return self.json_message("cameras array is required", status_code=400)

        cameras = cameras[:MAX_BATCH_CAMERAS]

        async def _fetch_one(spec: dict) -> dict | None:
            entity_id = spec.get("entity_id")
            if not isinstance(entity_id, str) or not entity_id.startswith("camera."):
                return None
            try:
                width = _parse_bounded_int(
                    spec.get("width"),
                    field="width",
                    default=DEFAULT_WIDTH,
                    lo=MIN_WIDTH,
                    hi=MAX_WIDTH,
                )
                quality = _parse_bounded_int(
                    spec.get("quality"),
                    field="quality",
                    default=DEFAULT_QUALITY,
                    lo=MIN_QUALITY,
                    hi=MAX_QUALITY,
                )
            except ValueError:
                return {"entity_id": entity_id, "data": None, "size": 0}

            # Optional viewport crop (normalized 0.0-1.0)
            viewport = ViewportState()
            if "viewport" in spec and isinstance(spec["viewport"], dict):
                vp = spec["viewport"]
                viewport = ViewportState(
                    x=max(0.0, min(1.0, float(vp.get("x", 0.0)))),
                    y=max(0.0, min(1.0, float(vp.get("y", 0.0)))),
                    w=max(0.01, min(1.0, float(vp.get("w", 1.0)))),
                    h=max(0.01, min(1.0, float(vp.get("h", 1.0)))),
                )

            try:
                image: CameraImage = await async_get_image(self._hass, entity_id, timeout=5)
                if image is None or image.content is None:
                    return {"entity_id": entity_id, "data": None, "size": 0}

                processed, _, _ = await self._hass.async_add_executor_job(
                    _process_frame,
                    image.content,
                    viewport,
                    width,
                    quality,
                )
                b64 = base64.b64encode(processed).decode("ascii")
                return {"entity_id": entity_id, "data": b64, "size": len(processed)}
            except (HomeAssistantError, Exception):  # noqa: BLE001
                _LOGGER.debug("Batch snapshot failed for %s", entity_id)
                return {"entity_id": entity_id, "data": None, "size": 0}

        results = await asyncio.gather(*[_fetch_one(spec) for spec in cameras])
        snapshots = [r for r in results if r is not None]

        body = {"snapshots": snapshots}
        json_bytes = _json.dumps(body, separators=(",", ":"), ensure_ascii=False).encode("utf-8")

        accept_encoding = request.headers.get("Accept-Encoding", "")
        if "gzip" in accept_encoding and len(json_bytes) > 256:
            compressed = gzip.compress(json_bytes, compresslevel=1)
            return Response(
                body=compressed,
                status=200,
                content_type="application/json",
                headers={"Content-Encoding": "gzip"},
            )

        return Response(body=json_bytes, status=200, content_type="application/json")


def _process_snapshot(
    frame_bytes: bytes,
    width: int,
    quality: int,
    max_bytes: int,
) -> bytes | None:
    """Resize a camera frame and enforce a byte-size cap (runs in executor).

    Re-encodes at progressively lower quality if the result exceeds max_bytes.
    Returns processed JPEG bytes, or None if it cannot fit within the budget.
    """
    img = Image.open(BytesIO(frame_bytes))

    # Resize to target width maintaining aspect ratio
    cur_w, cur_h = img.size
    if cur_w > width:
        ratio = width / cur_w
        new_h = max(1, int(cur_h * ratio))
        img = img.resize((width, new_h), Image.Resampling.BILINEAR)

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


class CameraSnapshotView(HomeAssistantView):
    """GET endpoint that returns a single resized camera snapshot as raw JPEG."""

    url = "/api/wrist_assistant/camera/snapshot"
    name = "api:wrist_assistant_camera_snapshot"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def get(self, request: Request) -> Response:
        """Return a single camera snapshot, resized and byte-capped."""
        query = request.query

        entity_id = query.get("entity_id")
        if not entity_id or not entity_id.startswith("camera."):
            return Response(text="entity_id is required and must be a camera entity", status=400)

        state = self._hass.states.get(entity_id)
        if state is None:
            return Response(text="Camera entity not found", status=404)

        try:
            width = _parse_bounded_int(
                query.get("width"),
                field="width",
                default=SNAPSHOT_MAX_WIDTH,
                lo=MIN_WIDTH,
                hi=SNAPSHOT_MAX_WIDTH,
            )
            quality = _parse_bounded_int(
                query.get("quality"),
                field="quality",
                default=SNAPSHOT_DEFAULT_QUALITY,
                lo=MIN_QUALITY,
                hi=MAX_QUALITY,
            )
        except ValueError as err:
            return Response(text=str(err), status=400)

        try:
            image: CameraImage = await async_get_image(self._hass, entity_id, timeout=5)
        except HomeAssistantError:
            return Response(text="Camera unavailable", status=503)

        if image is None or image.content is None:
            return Response(text="No image available", status=503)

        processed = await self._hass.async_add_executor_job(
            _process_snapshot,
            image.content,
            width,
            quality,
            SNAPSHOT_MAX_BYTES,
        )

        if processed is None:
            return Response(text="Image exceeds size budget", status=503)

        return Response(
            body=processed,
            status=200,
            content_type="image/jpeg",
            headers={"Cache-Control": "no-cache, no-store, must-revalidate"},
        )
