"""Cloudflare push relay client for Wrist Assistant notifications."""

from __future__ import annotations

import logging

from aiohttp import ClientError, ClientSession

from .notifications import NotificationTokenStore, TokenEntry

_LOGGER = logging.getLogger(__name__)

_DEAD_TOKEN_REASONS = frozenset({
    "BadDeviceToken",
    "Unregistered",
    "DeviceTokenNotForTopic",
    "device_token_mismatch",
})


class APNsClient:
    """Wrapper around the hosted push relay used by the public integration."""

    def __init__(
        self,
        *,
        relay_base_url: str,
        notification_store: NotificationTokenStore,
        http_session: ClientSession,
    ) -> None:
        self._relay_base_url = relay_base_url.rstrip("/")
        self._notification_store = notification_store
        self._http_session = http_session

    async def send_push(
        self,
        *,
        watch_id: str,
        device_token: str,
        title: str | None = None,
        body: str | None = None,
        category: str | None = None,
        data: dict | None = None,
        sound: str | None = None,
        push_type: str = "alert",
        environment: str = "production",
        platform: str = "watchos",
    ) -> tuple[bool, str | None, str]:
        """Send a push notification through the hosted relay.

        ``platform`` selects which token entry (watchos / ios) on the watch_id
        the relay_token cache is read from and written back to.

        Returns (success, reason, used_environment).
        """
        entry = self._notification_store.get_entry(watch_id, platform)
        if entry is None:
            return (False, "missing_token_registration", environment)

        relay_token = entry.relay_token
        if not relay_token:
            relay_token = await self._register_device(
                watch_id=watch_id,
                device_token=device_token,
                environment=environment,
                existing=entry,
            )
            if relay_token is None:
                return (False, "relay_registration_failed", environment)

        payload = {
            "relay_token": relay_token,
            "device_token": device_token,
            "title": title,
            "body": body,
            "category": category,
            "data": data or {},
            "sound": sound,
            "push_type": push_type,
        }

        result = await self._post_json("/v1/push/send", payload)
        if result is None:
            return (False, "connection_error", environment)

        if result.get("ok") is True:
            used_environment = _normalize_environment_value(
                result.get("used_environment"), default=environment
            )
            if used_environment != environment:
                self._notification_store.register(
                    watch_id,
                    device_token,
                    platform=entry.platform,
                    environment=used_environment,
                    relay_token=relay_token,
                )
            return (True, None, used_environment)

        reason = result.get("reason") or result.get("error")
        # Both signals mean the cached relay_token no longer maps to this
        # device_token at the relay: invalid_relay_token (the relay forgot the
        # binding) and device_token_mismatch (the binding points at a
        # since-replaced device_token, e.g. after an app reinstall). Either is
        # recoverable — re-register to rebind, then retry the send once before
        # giving up. device_token_mismatch stays in _DEAD_TOKEN_REASONS as the
        # fallback purge if this retry still can't rebind it.
        if reason in ("invalid_relay_token", "device_token_mismatch"):
            relay_token = await self._register_device(
                watch_id=watch_id,
                device_token=device_token,
                environment=environment,
                existing=entry,
            )
            if relay_token is None:
                return (False, "relay_registration_failed", environment)

            payload["relay_token"] = relay_token
            result = await self._post_json("/v1/push/send", payload)
            if result is None:
                return (False, "connection_error", environment)
            if result.get("ok") is True:
                used_environment = _normalize_environment_value(
                    result.get("used_environment"), default=environment
                )
                if used_environment != environment:
                    self._notification_store.register(
                        watch_id,
                        device_token,
                        platform=entry.platform,
                        environment=used_environment,
                        relay_token=relay_token,
                    )
                return (True, None, used_environment)
            reason = result.get("reason") or result.get("error")

        used_environment = _normalize_environment_value(
            result.get("used_environment"), default=environment
        )
        return (False, reason if isinstance(reason, str) else "unknown", used_environment)

    async def ensure_relay_token(self, watch_id: str, platform: str) -> str | None:
        """Return a valid relay_token for a registered device, minting one if needed.

        Used by webhook provisioning, which must present relay_token +
        device_token pairs as proof of device control. Returns None when the
        device has no registration or the relay is unreachable.
        """
        entry = self._notification_store.get_entry(watch_id, platform)
        if entry is None:
            return None
        if entry.relay_token:
            return entry.relay_token
        return await self._register_device(
            watch_id=watch_id,
            device_token=entry.device_token,
            environment=entry.environment,
            existing=entry,
        )

    async def relay_post(self, path: str, payload: dict) -> dict | None:
        """POST JSON to the relay and return the parsed response (None on error).

        Public wrapper for relay endpoints beyond the push pipeline (webhook
        provisioning/device sync). Connection details and logging stay in one
        place.
        """
        return await self._post_json(path, payload)

    async def _register_device(
        self,
        *,
        watch_id: str,
        device_token: str,
        environment: str,
        existing: TokenEntry,
    ) -> str | None:
        payload = {
            "watch_id": watch_id,
            "device_token": device_token,
            "environment": environment,
            "platform": existing.platform,
        }
        result = await self._post_json("/v1/register", payload)
        if result is None:
            return None

        relay_token = result.get("relay_token")
        if not isinstance(relay_token, str) or not relay_token:
            return None

        used_environment = _normalize_environment_value(
            result.get("environment"), default=environment
        )
        self._notification_store.register(
            watch_id,
            device_token,
            platform=existing.platform,
            environment=used_environment,
            relay_token=relay_token,
        )
        return relay_token

    async def _post_json(self, path: str, payload: dict) -> dict | None:
        url = f"{self._relay_base_url}{path}"
        try:
            async with self._http_session.post(url, json=payload) as response:
                return await response.json()
        except (ClientError, ValueError):
            _LOGGER.exception("Push relay request failed for %s", path)
            return None

    @staticmethod
    def is_dead_token(reason: str | None) -> bool:
        """Return True if the relay reason indicates a permanently invalid token."""
        return reason in _DEAD_TOKEN_REASONS


def _normalize_environment_value(value: object, *, default: str) -> str:
    """Normalize a relay response environment field."""
    if value == "development":
        return "development"
    if value == "production":
        return "production"
    return default
