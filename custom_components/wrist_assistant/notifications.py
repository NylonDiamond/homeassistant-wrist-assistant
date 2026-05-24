"""Push notification token storage for Wrist Assistant.

The legacy bearer-authed `NotificationRegisterView` was removed when the
watch transport went pure-v2; the watch now registers its push token via
`op=notifications_register` on `/v2/action`. The token store and APNs
helpers below are still the single source of truth for the runtime.
"""

from __future__ import annotations

import logging
from collections.abc import Callable
from dataclasses import dataclass
from typing import Literal

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
    """Persistent store of watch_id → {platform → APNs device token}.

    A single watch_id can hold both a ``watchos`` token (the watch's own APNs
    token, used for watch-direct delivery when the phone is absent) and an
    ``ios`` token (the companion iPhone's token, used for the phone-mirror fast
    path when the phone is reachable). The iPhone registers its token under the
    companion watch's id so both live on one entry and ``send_notification`` can
    route between them.
    """

    def __init__(self, hass: HomeAssistant) -> None:
        # watch_id -> platform -> TokenEntry
        self._tokens: dict[str, dict[str, TokenEntry]] = {}
        # watch_id -> arbitrary per-watch metadata, e.g. {"delivery_mode": "mirror"}.
        # Kept separate from _tokens so it can never leak into routing iteration.
        self._watch_meta: dict[str, dict] = {}
        self._store: Store = Store(
            hass,
            NOTIFICATION_TOKEN_STORAGE_VERSION,
            NOTIFICATION_TOKEN_STORAGE_KEY,
        )
        self._listeners: list[Callable[[], None]] = []

    async def async_load(self) -> None:
        """Load persisted tokens from disk, migrating the legacy shape.

        Legacy (single-token) records stored ``tokens[watch_id]`` as a flat
        ``{device_token, platform, ...}`` dict. The current shape nests by
        platform: ``tokens[watch_id] = {platform: {device_token, ...}}``. Both
        are accepted so a live install upgrades without wiping registrations.
        """
        data = await self._store.async_load()
        if not data or not isinstance(data, dict):
            return
        tokens = data.get("tokens", {})
        for watch_id, entry in tokens.items():
            if not isinstance(entry, dict):
                continue
            if "device_token" in entry:
                # Legacy flat record — wrap under its platform.
                parsed = self._parse_entry(entry)
                if parsed is not None:
                    self._tokens[watch_id] = {parsed.platform: parsed}
            else:
                # Current nested-by-platform record.
                by_platform: dict[str, TokenEntry] = {}
                for platform, raw in entry.items():
                    if isinstance(raw, dict):
                        parsed = self._parse_entry(raw, default_platform=platform)
                        if parsed is not None:
                            by_platform[parsed.platform] = parsed
                if by_platform:
                    self._tokens[watch_id] = by_platform
        meta = data.get("watch_metadata", {})
        if isinstance(meta, dict):
            self._watch_meta = {
                watch_id: dict(m)
                for watch_id, m in meta.items()
                if isinstance(m, dict)
            }
        _LOGGER.debug(
            "Loaded notification tokens for %d watches from storage",
            len(self._tokens),
        )

    @staticmethod
    def _parse_entry(
        raw: dict, default_platform: str = "watchos"
    ) -> TokenEntry | None:
        device_token = raw.get("device_token")
        if not isinstance(device_token, str) or not device_token:
            return None
        return TokenEntry(
            device_token=device_token,
            platform=raw.get("platform", default_platform),
            environment=_normalize_environment(raw.get("environment")),
            relay_token=raw.get("relay_token"),
        )

    def _serialize(self) -> dict:
        """Serialize tokens for storage (nested-by-platform shape)."""
        return {
            "tokens": {
                watch_id: {
                    platform: {
                        "device_token": entry.device_token,
                        "platform": entry.platform,
                        "environment": entry.environment,
                        "relay_token": entry.relay_token,
                    }
                    for platform, entry in by_platform.items()
                }
                for watch_id, by_platform in self._tokens.items()
            },
            "watch_metadata": {
                watch_id: dict(m) for watch_id, m in self._watch_meta.items()
            },
        }

    def register(
        self,
        watch_id: str,
        device_token: str,
        platform: str = "watchos",
        environment: str = "production",
        relay_token: str | None = None,
    ) -> Literal["new", "updated", "idempotent"]:
        """Store or update a device token for a (watch_id, platform).

        Returns:
            "new"        — first token we've seen for this watch_id+platform.
            "updated"    — replaces a different token or environment (APNs
                           re-issue, environment flip, etc.).
            "idempotent" — same token + environment as before; no state change.
        """
        platform = platform if isinstance(platform, str) and platform else "watchos"
        normalized_environment = _normalize_environment(environment)
        by_platform = self._tokens.setdefault(watch_id, {})
        existing = by_platform.get(platform)
        if (
            existing
            and existing.device_token == device_token
            and existing.environment == normalized_environment
            and (
                relay_token is None
                or existing.relay_token == relay_token
            )
        ):
            return "idempotent"
        by_platform[platform] = TokenEntry(
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
        self._notify_listeners()
        return "new" if existing is None else "updated"

    def get_token(self, watch_id: str, platform: str | None = None) -> str | None:
        """Return a device token for a watch, or None.

        With no platform, prefers the watch-direct token, then any token —
        preserving the pre-dual-token single-token callers.
        """
        entry = self.get_entry(watch_id, platform)
        return entry.device_token if entry else None

    def get_entry(
        self, watch_id: str, platform: str | None = None
    ) -> TokenEntry | None:
        """Return the token entry for a watch (optionally a specific platform).

        With no platform, prefers ``watchos`` then any registered platform, so
        existence checks and legacy single-token callers keep working.
        """
        by_platform = self._tokens.get(watch_id)
        if not by_platform:
            return None
        if platform is not None:
            return by_platform.get(platform)
        return by_platform.get("watchos") or next(iter(by_platform.values()), None)

    def get_entries(self, watch_id: str) -> dict[str, TokenEntry]:
        """Return all platform entries for a watch (empty if none)."""
        return dict(self._tokens.get(watch_id, {}))

    def get_watch_metadata(self, watch_id: str, key: str, default=None):
        """Return a per-watch metadata value (e.g. ``delivery_mode``), or default."""
        return self._watch_meta.get(watch_id, {}).get(key, default)

    def set_watch_metadata(self, watch_id: str, key: str, value) -> None:
        """Set a per-watch metadata value, persisting only on change."""
        meta = self._watch_meta.setdefault(watch_id, {})
        if meta.get(key) == value:
            return
        meta[key] = value
        self._store.async_delay_save(self._serialize, 5)
        # Notify so diagnostic entities (e.g. the Delivery mode sensor) reflect
        # a mode change as soon as the app pushes it, not on the next restart.
        self._notify_listeners()

    @property
    def all_tokens(self) -> dict[str, TokenEntry]:
        """Return one representative entry per watch_id (watchos preferred).

        Kept for diagnostics and legacy callers that expect a flat
        watch_id → TokenEntry mapping.
        """
        result: dict[str, TokenEntry] = {}
        for watch_id, by_platform in self._tokens.items():
            entry = by_platform.get("watchos") or next(iter(by_platform.values()), None)
            if entry is not None:
                result[watch_id] = entry
        return result

    @property
    def all_entries(self) -> dict[str, dict[str, TokenEntry]]:
        """Return every watch_id's full platform map. Used by routing."""
        return {wid: dict(by) for wid, by in self._tokens.items()}

    def remove(self, watch_id: str, platform: str | None = None) -> None:
        """Remove a watch's token(s).

        With no platform, removes the whole watch (all platforms). With a
        platform, removes just that token — so a dead iOS token doesn't take
        the still-valid watch-direct token with it.
        """
        changed = False
        if platform is None:
            if self._tokens.pop(watch_id, None) is not None:
                changed = True
            if self._watch_meta.pop(watch_id, None) is not None:
                changed = True
        else:
            by_platform = self._tokens.get(watch_id)
            if by_platform and by_platform.pop(platform, None) is not None:
                changed = True
                if not by_platform:
                    self._tokens.pop(watch_id, None)
        if changed:
            self._store.async_delay_save(self._serialize, 5)
            self._notify_listeners()

    def async_add_listener(self, listener: Callable[[], None]) -> Callable[[], None]:
        """Subscribe to register/remove events. Returns an unsubscribe callback."""
        self._listeners.append(listener)

        def _unsub() -> None:
            try:
                self._listeners.remove(listener)
            except ValueError:
                pass

        return _unsub

    def _notify_listeners(self) -> None:
        for listener in list(self._listeners):
            try:
                listener()
            except Exception:  # noqa: BLE001
                _LOGGER.exception("Notification token store listener raised")
