"""Cloudflare push relay client for Wrist Assistant notifications."""

from __future__ import annotations

import asyncio
import logging

from aiohttp import ClientConnectorError, ClientError, ClientSession, ClientTimeout

from .notifications import NotificationTokenStore, TokenEntry, is_dead_token_reason

_LOGGER = logging.getLogger(__name__)

# Bound every relay round trip. Without this aiohttp's session default (300 s
# total) applies, so a relay that accepts the TCP connection and then stalls
# pins the calling automation for five minutes before surfacing an error.
_RELAY_TIMEOUT = ClientTimeout(total=10, connect=5)
# One retry, only for failures in the connect phase (DNS, refused, unreachable,
# connect timeout). Those provably never reached the relay, so retrying cannot
# deliver a push twice. A read-phase timeout is NOT retried for that reason.
_CONNECT_RETRY_DELAY = 1.0
# What send_push answers when the device registered a new token while a send
# to its old one was in flight. Not a dead-token reason: the stored token is
# the new one and stays.
TOKEN_REPLACED_REASON = "token_replaced"


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
        if entry.device_token != device_token:
            # The route was chosen for a token the device has since replaced.
            # The stored relay binding belongs to the new token, and binding
            # the old one would write it back over the new one.
            return (False, TOKEN_REPLACED_REASON, environment)

        relay_token = entry.relay_token
        if not relay_token:
            relay_token = await self._register_device(
                watch_id=watch_id,
                device_token=device_token,
                environment=environment,
                existing=entry,
            )
            if relay_token is None:
                return (False, self._registration_failure(watch_id, entry), environment)

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
                self._notification_store.register_if_current(
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
        # giving up. device_token_mismatch stays a dead-token reason as the
        # fallback purge if this retry still can't rebind it.
        if reason in ("invalid_relay_token", "device_token_mismatch"):
            # The device may have registered a new token while this send was
            # at the relay (that is what a mismatch usually means). Binding
            # the token in hand would then write it back over the new one.
            if not self._notification_store.holds(watch_id, entry.platform, device_token):
                return (False, TOKEN_REPLACED_REASON, environment)
            relay_token = await self._register_device(
                watch_id=watch_id,
                device_token=device_token,
                environment=environment,
                existing=entry,
            )
            if relay_token is None:
                return (False, self._registration_failure(watch_id, entry), environment)

            payload["relay_token"] = relay_token
            result = await self._post_json("/v1/push/send", payload)
            if result is None:
                return (False, "connection_error", environment)
            if result.get("ok") is True:
                used_environment = _normalize_environment_value(
                    result.get("used_environment"), default=environment
                )
                if used_environment != environment:
                    self._notification_store.register_if_current(
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
        # Written only while the entry still holds this token: a device that
        # registered a new one during the round trip keeps it.
        if not self._notification_store.register_if_current(
            watch_id,
            device_token,
            platform=existing.platform,
            environment=used_environment,
            relay_token=relay_token,
        ):
            return None
        return relay_token

    def _registration_failure(self, watch_id: str, entry: TokenEntry) -> str:
        """Why a rebind produced no relay token: the token moved on, or the relay."""
        if self._notification_store.holds(watch_id, entry.platform, entry.device_token):
            return "relay_registration_failed"
        return TOKEN_REPLACED_REASON

    async def _post_json(self, path: str, payload: dict) -> dict | None:
        url = f"{self._relay_base_url}{path}"
        for attempt in (1, 2):
            try:
                async with self._http_session.post(
                    url, json=payload, timeout=_RELAY_TIMEOUT
                ) as response:
                    return await response.json()
            except ClientConnectorError as err:
                # Never reached the relay: safe to retry exactly once.
                if attempt == 1:
                    _LOGGER.debug(
                        "Push relay connect failed for %s (%s); retrying once", path, err
                    )
                    await asyncio.sleep(_CONNECT_RETRY_DELAY)
                    continue
                _LOGGER.warning("Push relay unreachable for %s: %s", path, err)
                return None
            except (ClientError, TimeoutError, ValueError):
                _LOGGER.exception("Push relay request failed for %s", path)
                return None
        return None

    @staticmethod
    def is_dead_token(reason: str | None) -> bool:
        """Return True if the relay reason indicates a permanently invalid token."""
        return is_dead_token_reason(reason)


def _normalize_environment_value(value: object, *, default: str) -> str:
    """Normalize a relay response environment field."""
    if value == "development":
        return "development"
    if value == "production":
        return "production"
    return default
