"""Persistent per-camera notification snapshot aspect, keyed by entity_id.

A camera's snapshot aspect (width / height) can't be known until a frame is
decoded — Home Assistant exposes no resolution/dimension attribute on camera
entities. We learn it from the first captured frame (`jpeg_aspect`) and send it
on the push as `snapshot_aspect` so the watch/phone can reserve the image's
exact footprint up front: no layout shift, no black letterbox bars while the
background-captured image loads.

Without persistence that knowledge lived in an in-memory dict, so it was lost on
every restart and the *first* push after each restart reverted to bars. This
store keeps it on disk, so a camera's aspect is learned once and then carried on
every push — surviving restarts. It self-heals: a re-frame clears the entry
(`delete`) and the next capture recomputes it, and any capture overwrites a
stale value (e.g. after a resolution change). The aspect is a property of the
*camera variant* (Clear/Fluent/Snapshots can differ in resolution), so it's
keyed per entity_id and never copied across variants.
"""

from __future__ import annotations

import logging
import math

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import SNAPSHOT_ASPECT_STORAGE_KEY, SNAPSHOT_ASPECT_STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 2

# Sanity bounds for a stored aspect. Real cameras sit near 1.33 (4:3) / 1.78
# (16:9) / 0.56 (portrait doorbells); these wide limits only reject NaN/inf and
# absurd values from a corrupt frame or a hand-edited store.
_MIN_ASPECT = 0.05
_MAX_ASPECT = 20.0


def _valid_aspect(value: float) -> bool:
    return math.isfinite(value) and _MIN_ASPECT <= value <= _MAX_ASPECT


class SnapshotAspectStore:
    """Persistent map of camera entity_id → snapshot aspect (width / height)."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._aspects: dict[str, float] = {}
        self._store: Store = Store(
            hass,
            SNAPSHOT_ASPECT_STORAGE_VERSION,
            SNAPSHOT_ASPECT_STORAGE_KEY,
        )

    async def async_load(self) -> None:
        """Load persisted aspects from disk."""
        data = await self._store.async_load()
        if not data or not isinstance(data, dict):
            return
        aspects = data.get("aspects", {})
        if not isinstance(aspects, dict):
            return
        for entity_id, raw in aspects.items():
            try:
                value = float(raw)
            except (TypeError, ValueError):
                continue
            if isinstance(entity_id, str) and _valid_aspect(value):
                self._aspects[entity_id] = value
        _LOGGER.debug("Loaded %d snapshot aspects from storage", len(self._aspects))

    def _serialize(self) -> dict:
        return {"aspects": dict(self._aspects)}

    def get(self, entity_id: str) -> float | None:
        """Return the last-known snapshot aspect for a camera, or None."""
        return self._aspects.get(entity_id)

    def set(self, entity_id: str, aspect: float) -> None:
        """Remember a camera's snapshot aspect. Ignores invalid values and skips
        the disk write when the value is unchanged."""
        if not _valid_aspect(aspect):
            return
        if self._aspects.get(entity_id) == aspect:
            return
        self._aspects[entity_id] = aspect
        self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)

    def delete(self, entity_id: str) -> None:
        """Forget a camera's aspect (e.g. on re-frame) so the next capture
        recomputes it instead of reserving the old footprint."""
        if self._aspects.pop(entity_id, None) is not None:
            self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)
