"""Diagnostics support for Wrist Assistant."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from .api import MAX_EVENTS_BUFFER
from .const import WristAssistantConfigEntry


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: WristAssistantConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for a config entry."""
    data = entry.runtime_data
    coordinator = data.coordinator

    sessions = {}
    for watch_id, session in coordinator._sessions.items():
        sessions[watch_id] = {
            "config_hash": session.config_hash,
            "entities_synced": session.entities_synced,
            "entity_count": len(session.entities),
            "entities": sorted(session.entities),
            "last_seen": session.last_seen.isoformat(),
        }

    notification_store = data.notification_store
    notification_tokens = {}
    for watch_id, token_entry in notification_store.all_tokens.items():
        notification_tokens[watch_id] = {
            "token_prefix": token_entry.device_token[:8] + "…",
            "platform": token_entry.platform,
            "environment": token_entry.environment,
        }

    return {
        "coordinator": {
            "cursor": coordinator._cursor,
            "generation": coordinator._generation,
            "event_buffer_size": len(coordinator._events),
            "event_buffer_capacity": MAX_EVENTS_BUFFER,
            "event_buffer_usage_pct": round(
                len(coordinator._events) / MAX_EVENTS_BUFFER * 100, 1
            ),
            "session_count": len(coordinator._sessions),
        },
        "sessions": sessions,
        "notifications": {
            "token_count": len(notification_tokens),
            "tokens": notification_tokens,
            "apns_configured": data.apns_client is not None,
            "apns_config_managed": data.apns_config_store.is_configured,
        },
    }
