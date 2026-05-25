"""Constants for Wrist Assistant delta API integration."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry

    from .api import DeltaCoordinator
    from .apns_client import APNsClient
    from .camera_stream import CameraStreamCoordinator
    from .notification_snapshot import NotificationSnapshotStore
    from .notifications import NotificationTokenStore
    from .wa_stream_tokens import StreamTokenStore
    from .widget_secret_store import WidgetSecretStore


@dataclass
class WristAssistantData:
    """Runtime data for the Wrist Assistant integration."""

    coordinator: DeltaCoordinator
    camera_stream_coordinator: CameraStreamCoordinator
    notification_store: NotificationTokenStore
    widget_secret_store: WidgetSecretStore
    stream_token_store: StreamTokenStore
    notification_snapshot_store: NotificationSnapshotStore
    apns_client: APNsClient | None = field(default=None)


type WristAssistantConfigEntry = ConfigEntry[WristAssistantData]

DOMAIN = "wrist_assistant"
PLATFORMS = ["sensor", "binary_sensor", "text"]
NOTIFICATION_TOKEN_STORAGE_KEY = "wrist_assistant.notification_tokens"
NOTIFICATION_TOKEN_STORAGE_VERSION = 1
WIDGET_SECRET_STORAGE_KEY = "wrist_assistant.widget_secrets"
WIDGET_SECRET_STORAGE_VERSION = 1

# Wire-format version of the Wrist Assistant HMAC protocol. The watch app sends
# `X-WA-Version: <int>` on every signed request; the server rejects versions
# that aren't in WA_ACCEPTED_PROTOCOL_VERSIONS.
#
# v2 — full op vocabulary on /v2/action, long-poll on /v2/delta, camera streams
#      via /v2/stream/<token> handshake. The watch app carries no bearer token —
#      every call is HMAC, including the widget extension's complications. v1
#      (the original /widget/action endpoint) was removed in this release.
#
# Bump WA_PROTOCOL_VERSION only when the canonical-string format or header
# set changes incompatibly. Adding ops on the same wire format does NOT
# require a bump — the server returns 400 for unknown ops, the client can
# negotiate via op support flags or by trying the op and falling back.
WA_PROTOCOL_VERSION = 2
# Versions the server is willing to verify signatures for. Currently v2 only.
# When bumping past v2, keep the previous version here for one release window
# so old clients keep working through the rollout, then drop it.
WA_ACCEPTED_PROTOCOL_VERSIONS = frozenset({2})

# Symmetric counterpart to WA_PROTOCOL_VERSION: the oldest app-side wire
# protocol this integration is willing to talk to. WAVersionView surfaces it
# so the iOS app can decide whether to show its "update Wrist Assistant"
# banner — set this above the proto version of any client we want to retire.
#
# Today this matches WA_PROTOCOL_VERSION because v1 endpoints were removed
# wholesale in v2; bump it past 2 in a future release window when v3+ wire
# changes make older apps unable to talk to us at all.
MIN_SUPPORTED_APP_PROTOCOL_VERSION = 2

# Optional override copy for the "update Wrist Assistant" banner the iOS app
# renders when its proto < MIN_SUPPORTED_APP_PROTOCOL_VERSION. None falls
# back to the app's hardcoded default. Use this when a particular release's
# breaking change deserves more specific guidance than "please update".
APP_UPDATE_MESSAGE: str | None = None

# How far either side of "now" the server tolerates `X-WA-Ts` before rejecting.
# Combined with the nonce-dedupe TTL this defines the replay window.
WA_HMAC_TIMESTAMP_WINDOW_SECONDS = 30
# How long to remember nonces so an in-window replay is rejected. Must exceed
# WA_HMAC_TIMESTAMP_WINDOW_SECONDS plus the longest legitimate request hold
# (long-poll = 55 s) so the same `ts` can't be replayed across a held connection.
WA_HMAC_NONCE_TTL_SECONDS = 90

# Back-compat aliases for the older WIDGET_*-prefixed constant names. Some
# existing callers still import these; keep them resolving to the new values.
WIDGET_HMAC_TIMESTAMP_WINDOW_SECONDS = WA_HMAC_TIMESTAMP_WINDOW_SECONDS
WIDGET_HMAC_NONCE_TTL_SECONDS = WA_HMAC_NONCE_TTL_SECONDS

# How long a stream handshake token is valid before the watch must re-handshake.
# Single-use: the token is consumed when the watch first connects to the stream
# URL; if the connection drops, the watch needs a fresh handshake.
WA_STREAM_TOKEN_TTL_SECONDS = 30
