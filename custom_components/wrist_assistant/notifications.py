"""Push notification token storage for Wrist Assistant.

The legacy bearer-authed `NotificationRegisterView` was removed when the
watch transport went pure-v2; the watch now registers its push token via
`op=notifications_register` on `/v2/action`. The token store and APNs
helpers below are still the single source of truth for the runtime.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass

from homeassistant.helpers.storage import Store

from .const import NOTIFICATION_TOKEN_STORAGE_KEY, NOTIFICATION_TOKEN_STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)


def _normalize_environment(environment: object) -> str:
    """Normalize APNs environment values stored by the integration."""
    if environment == "development":
        return "development"
    return "production"


@dataclass(slots=True)
class TokenEntry:
    """Stored device token for a watch."""

    device_token: str
    platform: str
    environment: str  # "development" or "production"
    relay_token: str | None = None


class NotificationTokenStore:
    """Persistent store of watch_id → APNs device token."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._tokens: dict[str, TokenEntry] = {}
        self._store: Store = Store(
            hass,
            NOTIFICATION_TOKEN_STORAGE_VERSION,
            NOTIFICATION_TOKEN_STORAGE_KEY,
        )

    async def async_load(self) -> None:
        """Load persisted tokens from disk."""
        data = await self._store.async_load()
        if not data or not isinstance(data, dict):
            return
        tokens = data.get("tokens", {})
        for watch_id, entry in tokens.items():
            if isinstance(entry, dict) and "device_token" in entry:
                self._tokens[watch_id] = TokenEntry(
                    device_token=entry["device_token"],
                    platform=entry.get("platform", "watchos"),
                    environment=_normalize_environment(entry.get("environment")),
                    relay_token=entry.get("relay_token"),
                )
        _LOGGER.debug("Loaded %d notification tokens from storage", len(self._tokens))

    def _serialize(self) -> dict:
        """Serialize tokens for storage."""
        return {
            "tokens": {
                watch_id: {
                    "device_token": entry.device_token,
                    "platform": entry.platform,
                    "environment": entry.environment,
                    "relay_token": entry.relay_token,
                }
                for watch_id, entry in self._tokens.items()
            }
        }

    def register(
        self,
        watch_id: str,
        device_token: str,
        platform: str = "watchos",
        environment: str = "production",
        relay_token: str | None = None,
    ) -> None:
        """Store or update a device token for a watch."""
        normalized_environment = _normalize_environment(environment)
        existing = self._tokens.get(watch_id)
        if (
            existing
            and existing.device_token == device_token
            and existing.environment == normalized_environment
            and (
                relay_token is None
                or existing.relay_token == relay_token
            )
        ):
            return
        self._tokens[watch_id] = TokenEntry(
            device_token=device_token,
            platform=platform,
            environment=normalized_environment,
            relay_token=relay_token if relay_token is not None else existing.relay_token if existing else None,
        )
        _LOGGER.info(
            "Registered push token for watch_id=%s (platform=%s, environment=%s)",
            watch_id,
            platform,
            normalized_environment,
        )
        self._store.async_delay_save(self._serialize, 5)

    def get_token(self, watch_id: str) -> str | None:
        """Return the device token for a watch, or None."""
        entry = self._tokens.get(watch_id)
        return entry.device_token if entry else None

    def get_entry(self, watch_id: str) -> TokenEntry | None:
        """Return the full token entry for a watch, or None."""
        return self._tokens.get(watch_id)

    @property
    def all_tokens(self) -> dict[str, TokenEntry]:
        """Return all registered tokens."""
        return dict(self._tokens)

    def remove(self, watch_id: str) -> None:
        """Remove a watch's token."""
        if self._tokens.pop(watch_id, None) is not None:
            self._store.async_delay_save(self._serialize, 5)
