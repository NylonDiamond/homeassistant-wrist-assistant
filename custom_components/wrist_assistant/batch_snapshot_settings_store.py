"""Persistent installation-wide tuning for the batch-snapshot stream.

Currently holds a single value: the parallel-grab *concurrency* — how many
camera snapshots the integration fetches at once when a page requests several
over one batch stream (see ``run_batch_snapshot_stream``).

This is a property of the *camera source* (a shared NVR), not of any one paired
device, so it lives server-side and is read per stream — the throttle then
applies no matter which watch or phone opened the stream. Most setups want
``0`` (unlimited, fastest); a user whose NVR drops frames or returns 503s under
a snapshot stampede lowers it from the iOS Camera Settings.

Persisted to disk so the choice survives restarts. Any provisioned signer (the
iPhone identity already used for ``notifications_register``) may write it — the
HMAC check authenticates the request; there's nothing device-specific to scope.
"""

from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .camera_stream import (
    DEFAULT_BATCH_SNAPSHOT_CONCURRENCY,
    MAX_BATCH_SNAPSHOT_CONCURRENCY,
)
from .const import (
    BATCH_SNAPSHOT_SETTINGS_STORAGE_KEY,
    BATCH_SNAPSHOT_SETTINGS_STORAGE_VERSION,
)

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 1


def clamp_concurrency(value: object) -> int:
    """Coerce an arbitrary payload value to a valid concurrency.

    Returns an int in ``[0, MAX_BATCH_SNAPSHOT_CONCURRENCY]`` (0 = unlimited).
    Anything non-numeric or negative falls back to the unlimited default, so a
    malformed API call or a hand-edited store can never produce a nonsensical
    fan-out bound.
    """
    try:
        n = int(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return DEFAULT_BATCH_SNAPSHOT_CONCURRENCY
    if n < 0:
        return DEFAULT_BATCH_SNAPSHOT_CONCURRENCY
    return min(n, MAX_BATCH_SNAPSHOT_CONCURRENCY)


class BatchSnapshotSettingsStore:
    """Persistent batch-snapshot tuning (just the grab concurrency for now)."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._concurrency: int = DEFAULT_BATCH_SNAPSHOT_CONCURRENCY
        self._store: Store = Store(
            hass,
            BATCH_SNAPSHOT_SETTINGS_STORAGE_VERSION,
            BATCH_SNAPSHOT_SETTINGS_STORAGE_KEY,
        )

    async def async_load(self) -> None:
        """Load persisted settings from disk."""
        data = await self._store.async_load()
        if isinstance(data, dict) and "concurrency" in data:
            self._concurrency = clamp_concurrency(data.get("concurrency"))
            _LOGGER.debug("Loaded batch snapshot concurrency=%d", self._concurrency)

    @property
    def concurrency(self) -> int:
        """Parallel-grab concurrency (0 = unlimited)."""
        return self._concurrency

    def set_concurrency(self, value: object) -> int:
        """Validate, store, and persist a new concurrency. Returns the value set."""
        self._concurrency = clamp_concurrency(value)
        self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)
        return self._concurrency

    def _serialize(self) -> dict:
        return {"concurrency": self._concurrency}
