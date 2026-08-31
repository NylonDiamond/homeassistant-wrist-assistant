"""Constants for Wrist Assistant delta API integration."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry

    from .api import DeltaCoordinator
    from .apns_client import APNsClient
    from .batch_snapshot_settings_store import BatchSnapshotSettingsStore
    from .camera_stream import CameraStreamCoordinator
    from .complication_store import ComplicationStore
    from .notification_snapshot import NotificationSnapshotStore
    from .notifications import NotificationTokenStore
    from .snapshot_aspect_store import SnapshotAspectStore
    from .snapshot_crop_store import SnapshotCropStore
    from .snapshot_stream_store import SnapshotStreamStore
    from .wa_stream_tokens import BatchSnapshotTokenStore, StreamTokenStore
    from .widget_secret_store import WidgetSecretStore


@dataclass
class WristAssistantData:
    """Runtime data for the Wrist Assistant integration."""

    coordinator: DeltaCoordinator
    camera_stream_coordinator: CameraStreamCoordinator
    notification_store: NotificationTokenStore
    widget_secret_store: WidgetSecretStore
    stream_token_store: StreamTokenStore
    batch_snapshot_token_store: BatchSnapshotTokenStore
    notification_snapshot_store: NotificationSnapshotStore
    snapshot_crop_store: SnapshotCropStore
    snapshot_stream_store: SnapshotStreamStore
    # entity_id → last-computed notification snapshot aspect (width/height). Lets
    # a push carry the image's shape so the client reserves its footprint and
    # nothing shifts when the background-captured image lands. Persisted to disk
    # (see SnapshotAspectStore) so it survives restarts — a camera's aspect is
    # learned once, then carried on every push. Cleared when the camera is
    # re-framed; recomputed on the next capture.
    snapshot_aspect_store: SnapshotAspectStore
    # Installation-wide batch-snapshot tuning (currently just the parallel-grab
    # concurrency; 0 = unlimited). A property of the camera source/NVR, shared
    # across every paired device — set from the iOS Camera Settings, read per
    # batch stream. Persisted so it survives restarts.
    batch_snapshot_settings_store: BatchSnapshotSettingsStore
    # Canonical custom watch complications, scoped by owning watch. HA is the
    # only editor; the watch pulls accepted revisions itself.
    complication_store: ComplicationStore
    apns_client: APNsClient | None = field(default=None)


type WristAssistantConfigEntry = ConfigEntry[WristAssistantData]

DOMAIN = "wrist_assistant"
PLATFORMS = ["sensor", "binary_sensor", "text"]
NOTIFICATION_TOKEN_STORAGE_KEY = "wrist_assistant.notification_tokens"
NOTIFICATION_TOKEN_STORAGE_VERSION = 1
WIDGET_SECRET_STORAGE_KEY = "wrist_assistant.widget_secrets"
WIDGET_SECRET_STORAGE_VERSION = 1
# Per-camera notification snapshot framing (entity_id → normalized crop region).
SNAPSHOT_CROP_STORAGE_KEY = "wrist_assistant.snapshot_crops"
SNAPSHOT_CROP_STORAGE_VERSION = 1
# Per-camera live-stream override (snapshot entity_id → chosen stream entity_id),
# used when a notification snapshot is tapped open on the watch.
SNAPSHOT_STREAM_STORAGE_KEY = "wrist_assistant.snapshot_streams"
SNAPSHOT_STREAM_STORAGE_VERSION = 1
# Installation-wide batch-snapshot tuning (parallel-grab concurrency; 0=unlimited).
BATCH_SNAPSHOT_SETTINGS_STORAGE_KEY = "wrist_assistant.batch_snapshot_settings"
BATCH_SNAPSHOT_SETTINGS_STORAGE_VERSION = 1
# Per-camera notification snapshot aspect (entity_id → width/height). Learned
# from captured frames and persisted so a push can reserve the image's footprint
# even on the first push after a restart.
SNAPSHOT_ASPECT_STORAGE_KEY = "wrist_assistant.snapshot_aspects"
SNAPSHOT_ASPECT_STORAGE_VERSION = 1
# Custom watch complications (owner watch → record id → envelope + document).
# Revisions, tombstones and the collection token live in the envelope; the
# document is the Apple clients' CustomComplicationConfig JSON, stored as-is.
COMPLICATION_STORAGE_KEY = "wrist_assistant.custom_complications"
COMPLICATION_STORAGE_VERSION = 1
# Highest CustomComplicationConfig schemaVersion this integration can edit.
# Must track `CustomComplicationConfig.currentSchemaVersion` in the app repo.
# A newer document is displayed read-only and never re-saved.
# v5 is shape-identical to v4; it only marks documents with slotIndex > 7 so an
# old app surfaces "needs app update" instead of silently dropping them. The
# panel writes 5 only for slots above 7, keeping low-slot documents byte-stable.
COMPLICATION_MAX_SCHEMA_VERSION = 5
COMPLICATION_MAX_DOCUMENT_BYTES = 256 * 1024
COMPLICATION_MAX_LAYERS = 64
# Slot indices 0..COMPLICATION_MAX_SLOTS-1 map onto ComplicationStableSlot on
# the watch. The watch face picker always shows the first 8 slots and grows past
# them only when a higher slot is occupied; 64 is the hard ceiling both sides
# enforce.
COMPLICATION_MAX_SLOTS = 64
# One complication per slot at most, so the slot ceiling is also the per-watch
# record ceiling.
COMPLICATION_MAX_PER_OWNER = COMPLICATION_MAX_SLOTS

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
