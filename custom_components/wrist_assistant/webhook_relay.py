"""Wrist Webhooks provisioning against the hosted push relay.

The relay (wrist-assistant-push-relay) gives each user an inbound publish URL
(`/w/<publish-token>/<topic>`) that pushes to their devices and lands in a
KV-backed inbox. Provisioning a webhook requires proving control of the
devices it will push to, which only this integration can do: it holds the
relay_token + device_token pairs the relay's existing trust model is built on.

Division of secrets, deliberately asymmetric:
- HA stores ONLY the webhook_id (in the notification store's per-watch
  metadata). It is not a secret — it grants no capability on its own.
- The publish_token and read_token returned by the relay pass through the
  provision response to the app (Keychain) and are never persisted or logged
  here. A compromised HA backup therefore leaks no webhook capability.

The device-token mapping at the relay goes stale whenever APNs re-issues a
device token (reinsall/restore). `async_sync_webhook_devices` re-binds it and
is fired from the `notifications_register` op whenever a token actually
changes, authorized at the relay by a watch_id match against the webhook
record — see the relay's handleUpdateDevices.
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .apns_client import APNsClient
    from .const import WristAssistantData
    from .notifications import NotificationTokenStore

_LOGGER = logging.getLogger(__name__)

WEBHOOK_ID_METADATA_KEY = "webhook_id"

# watch_ids with a device sync currently in flight. Registration bursts (watch
# and iPhone both register on app launch) coalesce into one relay round-trip.
_SYNC_IN_FLIGHT: set[str] = set()


async def async_provision_webhook(
    domain_data: WristAssistantData, watch_id: str
) -> dict:
    """Provision a webhook at the relay for this watch's registered devices.

    Returns the op response body: on success the relay's tokens for the app to
    keep (``{"ok": True, "webhook_id", "publish_token", "read_token",
    "publish_url"}``), on failure ``{"ok": False, "error", "status"}`` with
    the HTTP status the op handler should use.
    """
    client = domain_data.apns_client
    store = domain_data.notification_store
    if client is None or store is None:
        return {"ok": False, "error": "relay_unavailable", "status": 503}

    devices = await _collect_device_pairs(client, store, watch_id)
    if not devices:
        # Push registration is a hard prerequisite: a webhook with no
        # deliverable device would be a write-only inbox.
        return {"ok": False, "error": "no_push_token", "status": 409}

    result = await client.relay_post("/v1/webhook/provision", {"devices": devices})
    if result is None:
        return {"ok": False, "error": "relay_unreachable", "status": 502}

    webhook_id = result.get("webhook_id")
    publish_token = result.get("publish_token")
    read_token = result.get("read_token")
    if not all(
        isinstance(value, str) and value
        for value in (webhook_id, publish_token, read_token)
    ):
        error = result.get("error")
        _LOGGER.warning(
            "Webhook provisioning failed at the relay for watch_id=%s: %s",
            watch_id,
            error if isinstance(error, str) else "malformed_response",
        )
        return {
            "ok": False,
            "error": error if isinstance(error, str) else "provision_failed",
            "status": 502,
        }

    previous = store.get_watch_metadata(watch_id, WEBHOOK_ID_METADATA_KEY)
    if previous and previous != webhook_id:
        # The app should rotate tokens on an existing webhook rather than
        # re-provision; when it does re-provision (lost Keychain), the old
        # webhook is orphaned at the relay — unreachable once its publish URL
        # falls out of use, unreadable without its read token.
        _LOGGER.info(
            "Replacing webhook %s with %s for watch_id=%s (old one is orphaned)",
            previous,
            webhook_id,
            watch_id,
        )
    store.set_watch_metadata(watch_id, WEBHOOK_ID_METADATA_KEY, webhook_id)
    _LOGGER.info(
        "Provisioned webhook %s for watch_id=%s (%d devices)",
        webhook_id,
        watch_id,
        len(devices),
    )

    # Tokens intentionally pass through without being stored or logged.
    return {
        "ok": True,
        "webhook_id": webhook_id,
        "publish_token": publish_token,
        "read_token": read_token,
        "publish_url": result.get("publish_url"),
    }


async def async_sync_webhook_devices(
    domain_data: WristAssistantData, watch_id: str
) -> None:
    """Re-bind the webhook's device tokens at the relay after a token change.

    No-op when the watch has no provisioned webhook. Safe to fire-and-forget;
    failures are logged and the next registration (or send-path re-register)
    retries naturally.
    """
    client = domain_data.apns_client
    store = domain_data.notification_store
    if client is None or store is None:
        return

    webhook_id = store.get_watch_metadata(watch_id, WEBHOOK_ID_METADATA_KEY)
    if not isinstance(webhook_id, str) or not webhook_id:
        return

    if watch_id in _SYNC_IN_FLIGHT:
        return
    _SYNC_IN_FLIGHT.add(watch_id)
    try:
        devices = await _collect_device_pairs(client, store, watch_id)
        if not devices:
            _LOGGER.warning(
                "Webhook %s for watch_id=%s has no registrable devices; skipping sync",
                webhook_id,
                watch_id,
            )
            return

        result = await client.relay_post(
            "/v1/webhook/update_devices",
            {"webhook_id": webhook_id, "devices": devices},
        )
        if result is None:
            _LOGGER.warning(
                "Webhook device sync unreachable for watch_id=%s; will retry on next registration",
                watch_id,
            )
            return
        if result.get("updated") is True:
            _LOGGER.debug(
                "Webhook %s device mapping refreshed (%d devices)",
                webhook_id,
                len(devices),
            )
            return
        if result.get("error") == "unknown_webhook":
            # Revoked from the app (which holds the read token) — stop trying.
            _LOGGER.info(
                "Webhook %s no longer exists at the relay; clearing for watch_id=%s",
                webhook_id,
                watch_id,
            )
            store.set_watch_metadata(watch_id, WEBHOOK_ID_METADATA_KEY, None)
            return
        _LOGGER.warning(
            "Webhook device sync rejected for watch_id=%s: %s",
            watch_id,
            result.get("error", "unknown"),
        )
    finally:
        _SYNC_IN_FLIGHT.discard(watch_id)


async def _collect_device_pairs(
    client: APNsClient, store: NotificationTokenStore, watch_id: str
) -> list[dict]:
    """Build the relay's device list: every platform entry with a relay_token.

    Entries whose relay_token is missing (dropped on device-token rotation)
    are re-registered at the relay first; entries that still can't get one are
    skipped rather than failing the whole call — a webhook bound to only the
    watch token beats no webhook at all.
    """
    devices: list[dict] = []
    for platform, entry in sorted(store.get_entries(watch_id).items()):
        relay_token = entry.relay_token
        if not relay_token:
            relay_token = await client.ensure_relay_token(watch_id, platform)
        if not relay_token:
            _LOGGER.warning(
                "No relay_token obtainable for watch_id=%s platform=%s; excluding from webhook",
                watch_id,
                platform,
            )
            continue
        devices.append(
            {"relay_token": relay_token, "device_token": entry.device_token}
        )
    return devices
