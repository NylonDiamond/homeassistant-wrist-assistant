"""Persistent per-camera live-stream override, keyed by entity_id.

When a notification snapshot is tapped on the watch, the app opens that camera's
*live* stream. The snapshot entity (e.g. Reolink "Snapshots fluent") has no
stream, so by default we auto-resolve its device's streamable sibling
(`camera_devices.resolve_stream_sibling`). Auto-resolution relies on entity
naming and can guess wrong, so the iOS app lets the user pick the stream entity
explicitly; that choice is stored here and wins over the auto-resolver.

Like the crop, the override is a property of the *camera* and shared across all
the user's devices. It's written to every variant of a device so whichever
variant a notification uses resolves to the same chosen stream.
"""

from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import SNAPSHOT_STREAM_STORAGE_KEY, SNAPSHOT_STREAM_STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 2


class SnapshotStreamStore:
    """Persistent map of camera entity_id → chosen live-stream entity_id."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._streams: dict[str, str] = {}
        self._store: Store = Store(
            hass,
            SNAPSHOT_STREAM_STORAGE_VERSION,
            SNAPSHOT_STREAM_STORAGE_KEY,
        )

    async def async_load(self) -> None:
        """Load persisted stream overrides from disk."""
        data = await self._store.async_load()
        if not data or not isinstance(data, dict):
            return
        streams = data.get("streams", {})
        if not isinstance(streams, dict):
            return
        for entity_id, target in streams.items():
            if isinstance(target, str) and target.startswith("camera."):
                self._streams[entity_id] = target
        _LOGGER.debug("Loaded %d snapshot stream overrides", len(self._streams))

    def _serialize(self) -> dict:
        return {"streams": dict(self._streams)}

    def get(self, entity_id: str) -> str | None:
        """Return the user-chosen stream entity for a camera, or None."""
        return self._streams.get(entity_id)

    def set(self, entity_id: str, stream_entity_id: str) -> None:
        """Save a stream override for a camera."""
        if not stream_entity_id.startswith("camera."):
            return
        self._streams[entity_id] = stream_entity_id
        self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)

    def delete(self, entity_id: str) -> None:
        """Clear an override (revert to auto-resolution)."""
        if self._streams.pop(entity_id, None) is not None:
            self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)
