"""Legacy v1 camera-stream views, kept alive for v1 watch app builds.

These four views are the bearer-authed endpoints used by app builds prior
to the v2 transport:

- `CameraStreamView`     /api/wrist_assistant/camera/stream/{entity_id}
- `CameraViewportView`   /api/wrist_assistant/camera/viewport
- `CameraBatchView`      /api/wrist_assistant/camera/batch
- `CameraSnapshotView`   /api/wrist_assistant/camera/snapshot

The v2 watch transport drives the same operations via `op=stream_open`,
`op=stream_update`, `op=camera_batch`, and `op=camera_snapshot` on
`/v2/action`, plus the token-authed `/v2/stream/{token}` MJPEG endpoint.
Both paths share `CameraStreamCoordinator`, the frame/snapshot helpers,
and the parser helpers from `camera_stream.py`.

This file should be deleted in the release that retires v1 — it has no
callers inside the v2 codebase.
"""

from __future__ import annotations

import asyncio
import base64
import gzip
import json as _json
import logging

from aiohttp.web import Request, Response, StreamResponse

from homeassistant.components.camera import Image as CameraImage, async_get_image
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from .camera_stream import (
    DEFAULT_FPS,
    DEFAULT_QUALITY,
    DEFAULT_WIDTH,
    MAX_BATCH_CAMERAS,
    MAX_FPS,
    MAX_QUALITY,
    MAX_WIDTH,
    MIN_FPS,
    MIN_QUALITY,
    MIN_WIDTH,
    SNAPSHOT_DEFAULT_QUALITY,
    SNAPSHOT_MAX_BYTES,
    SNAPSHOT_MAX_HEIGHT,
    SNAPSHOT_MAX_WIDTH,
    ViewportState,
    _UNSET,
    _frame_fingerprint,
    _parse_bounded_float,
    _parse_bounded_int,
    _parse_optional_bounded_float,
    _parse_optional_bounded_int,
    _parse_viewport,
    _process_frame,
    _process_snapshot,
)

_LOGGER = logging.getLogger(__name__)


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
            max_height = _parse_bounded_int(
                query.get("max_height"),
                field="max_height",
                default=SNAPSHOT_MAX_HEIGHT,
                lo=MIN_WIDTH,
                hi=SNAPSHOT_MAX_HEIGHT,
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

        # Optional viewport crop (normalized 0.0-1.0)
        viewport = ViewportState()
        if "x" in query:
            try:
                viewport = _parse_viewport(query)
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
            viewport,
            width,
            max_height,
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
