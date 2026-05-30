"""Persistent per-camera notification snapshot framing, keyed by entity_id.

A notification camera snapshot is captured full-frame by default. For a wide
doorbell/yard camera the subject is small in the full frame, so the iOS app
lets the user pinch/pan a viewfinder over a still and save the resulting crop
region here. `send_notification` then captures that camera cropped to the saved
framing (`_process_snapshot` does the actual crop).

The crop is a property of the *camera*, not of any one device: it's stored once
per `entity_id` and shared across every paired watch/phone. Any provisioned
signer (the iPhone identity already used for `notifications_register`) may write
it — the HMAC check only authenticates the request; there's nothing
device-specific to scope.
"""

from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .camera_stream import ViewportState, viewport_matches
from .const import SNAPSHOT_CROP_STORAGE_KEY, SNAPSHOT_CROP_STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 2


def _clamp01(value: float, *, minimum: float = 0.0) -> float:
    return max(minimum, min(1.0, value))


def _is_full_frame(viewport: ViewportState) -> bool:
    """A full-frame viewport is the no-op crop — we drop these so the stored map
    only holds cameras the user actually framed."""
    return (
        viewport.x <= 0.001
        and viewport.y <= 0.001
        and viewport.w >= 0.999
        and viewport.h >= 0.999
    )


class SnapshotCropStore:
    """Persistent map of camera entity_id → ViewportState (normalized crop)."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._crops: dict[str, ViewportState] = {}
        self._store: Store = Store(
            hass,
            SNAPSHOT_CROP_STORAGE_VERSION,
            SNAPSHOT_CROP_STORAGE_KEY,
        )

    async def async_load(self) -> None:
        """Load persisted crop regions from disk."""
        data = await self._store.async_load()
        if not data or not isinstance(data, dict):
            return
        crops = data.get("crops", {})
        if not isinstance(crops, dict):
            return
        for entity_id, raw in crops.items():
            if not isinstance(raw, dict):
                continue
            try:
                self._crops[entity_id] = ViewportState(
                    x=_clamp01(float(raw.get("x", 0.0))),
                    y=_clamp01(float(raw.get("y", 0.0))),
                    w=_clamp01(float(raw.get("w", 1.0)), minimum=0.01),
                    h=_clamp01(float(raw.get("h", 1.0)), minimum=0.01),
                )
            except (TypeError, ValueError):
                continue
        _LOGGER.debug("Loaded %d snapshot crops from storage", len(self._crops))

    def _serialize(self) -> dict:
        return {
            "crops": {
                entity_id: {"x": vp.x, "y": vp.y, "w": vp.w, "h": vp.h}
                for entity_id, vp in self._crops.items()
            }
        }

    def get(self, entity_id: str) -> ViewportState | None:
        """Return the saved crop for a camera, or None if it's full-frame."""
        return self._crops.get(entity_id)

    def matches_saved(self, entity_id: str, viewport: ViewportState) -> bool:
        """Whether ``viewport`` equals this camera's saved framing (no-crop = the
        full frame). True means a snapshot rendered with ``viewport`` has the same
        shape the notification path will send, so its aspect is safe to cache."""
        return viewport_matches(viewport, self._crops.get(entity_id))

    def set(self, entity_id: str, viewport: ViewportState) -> None:
        """Save a crop for a camera. A full-frame viewport clears any saved crop
        so the map stays a set of genuinely-framed cameras."""
        if _is_full_frame(viewport):
            self.delete(entity_id)
            return
        self._crops[entity_id] = ViewportState(
            x=_clamp01(viewport.x),
            y=_clamp01(viewport.y),
            w=_clamp01(viewport.w, minimum=0.01),
            h=_clamp01(viewport.h, minimum=0.01),
        )
        self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)

    def delete(self, entity_id: str) -> None:
        if self._crops.pop(entity_id, None) is not None:
            self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)
