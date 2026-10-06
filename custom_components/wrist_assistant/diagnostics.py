"""Diagnostics support for Wrist Assistant.

The config entry download describes the integration as a whole. A device
download (a watch's or a phone's device page, Download diagnostics) carries
that device's latest log upload (``watch_logs_store.py``), passed once more
through :func:`redact`: the app redacts its bundle before sending, and this
second pass means an older or broken app can never put a token, a password
or the client certificate into a file a user mails to support.

Neither ever shows the client certificate itself: per user, only whether
there is one, its revision and the first eight characters of its
fingerprint.
"""

from __future__ import annotations

import re
from typing import Any

from homeassistant.core import HomeAssistant

from .api import MAX_EVENTS_BUFFER
from .const import DOMAIN, WristAssistantConfigEntry

REDACTED = "**REDACTED**"

# A key whose value is redacted whole, matched anywhere in the key without
# regard to case: `access_token`, `X-Auth-Token`, `secret_b64`, `pkcs12`,
# `passphrase` and so on. Booleans and nulls under such a key are left as
# they are (`has_token: true` says nothing secret), and so are numbers,
# unless the key also looks like a password or a passcode: a counter such as
# `complications_token: 42` is what a sync problem is diagnosed by.
_SECRET_KEY_RE = re.compile(
    r"token|password|passphrase|passwd|passcode|secret|authorization|bearer|cookie|"
    r"pkcs12|p12|api_?key|private_?key|credential",
    re.IGNORECASE,
)
_NUMERIC_SECRET_KEY_RE = re.compile(r"pass|secret|pkcs12|p12", re.IGNORECASE)
# Inside free text (log lines, URLs, embedded JSON), in this order:
# an Authorization header's value, a bearer token, a `key=value` or
# `"key": "value"` pair under a secret key, and the token in a webhook path.
_TEXT_RULES: tuple[tuple[re.Pattern[str], str], ...] = (
    (
        re.compile(
            r"(authorization[\"']?\s*[:=]\s*[\"']?)(?:(?:bearer|basic)\s+)?[^\s\"',;&]+",
            re.IGNORECASE,
        ),
        r"\1" + REDACTED,
    ),
    (
        re.compile(r"\b(bearer\s+)(?!\*\*REDACTED)[A-Za-z0-9._~+/=-]+", re.IGNORECASE),
        r"\1" + REDACTED,
    ),
    (
        re.compile(
            r"([A-Za-z0-9_-]*(?:token|password|passphrase|passwd|passcode|secret|pkcs12|"
            r"api_?key|private_?key|credential)[A-Za-z0-9_-]*"
            r"[\"']?\s*[:=]\s*[\"']?)(?!\*\*REDACTED)([^\s\"'&,;}\]]+)",
            re.IGNORECASE,
        ),
        r"\1" + REDACTED,
    ),
    (re.compile(r"(/w/)[A-Za-z0-9_-]{8,}"), r"\1" + REDACTED),
)


def redact_text(text: str) -> str:
    """``text`` with every secret it visibly carries replaced."""
    for pattern, replacement in _TEXT_RULES:
        text = pattern.sub(replacement, text)
    return text


def _is_secret_value(key: Any, item: Any) -> bool:
    if not isinstance(key, str) or not _SECRET_KEY_RE.search(key):
        return False
    if item is None or isinstance(item, bool):
        return False
    if isinstance(item, int | float):
        return bool(_NUMERIC_SECRET_KEY_RE.search(key))
    return True


def redact(value: Any) -> Any:
    """A copy of ``value`` with every secret replaced by ``**REDACTED**``:
    whole values under a secret key (see ``_SECRET_KEY_RE``), and secrets in
    any string (see ``_TEXT_RULES``)."""
    if isinstance(value, dict):
        out: dict[Any, Any] = {}
        for key, item in value.items():
            if _is_secret_value(key, item):
                out[key] = REDACTED
            else:
                out[key] = redact(item)
        return out
    if isinstance(value, list | tuple):
        return [redact(item) for item in value]
    if isinstance(value, str):
        return redact_text(value)
    return value


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
        },
        # Revision, size, save time, delivery and the last revision a device
        # could not read, per owner and kind, so a sync problem or an
        # oversized config shows up in a diagnostics download. Never the
        # document: it names the user's entities and pages.
        "watch_config": data.watch_config_store.diagnostics(),
        # Which devices sent logs, when and how big. The logs themselves are
        # in each device's own download.
        "watch_logs": data.watch_logs_store.listing(),
        # Per user: present or not, revision, first 8 of the fingerprint.
        "client_certificates": data.client_certificate_store.diagnostics(),
    }


def _device_watch_id(device: Any) -> str | None:
    """The signer id behind a device registry entry, from its
    ``(DOMAIN, "watch_<id>")`` identifier."""
    for domain, ident in getattr(device, "identifiers", ()):
        if domain == DOMAIN and isinstance(ident, str) and ident.startswith("watch_"):
            return ident[len("watch_"):]
    return None


async def async_get_device_diagnostics(
    hass: HomeAssistant, entry: WristAssistantConfigEntry, device: Any
) -> dict[str, Any]:
    """A device's latest log upload, redacted once more, and its user's
    client certificate as present or not. ``logs`` is null when the device
    never sent any."""
    data = entry.runtime_data
    watch_id = _device_watch_id(device)
    if watch_id is None:
        return {"watch_id": None, "logs": None}

    upload = await data.watch_logs_store.async_read(watch_id)
    logs = None
    if upload is not None:
        logs = {
            "received_at": upload.get("received_at"),
            "bytes": upload.get("bytes"),
            "bundle": redact(upload.get("bundle")),
        }

    certificate = None
    secret_entry = data.widget_secret_store.get(watch_id)
    user_id = secret_entry.user_id if secret_entry is not None else None
    if user_id is not None:
        users = data.client_certificate_store.diagnostics().get("users", {})
        certificate = users.get(user_id, {"present": False, "revision": 0})

    return {
        "watch_id": watch_id,
        "user_bound": user_id is not None,
        "client_certificate": certificate,
        "logs": logs,
    }
