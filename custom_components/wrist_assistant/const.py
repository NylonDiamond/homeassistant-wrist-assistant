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
    from .card_preview_store import CardPreviewStore
    from .client_certificate_store import ClientCertificateStore
    from .complication_push import ComplicationPhonePush
    from .complication_store import ComplicationStore
    from .http_actions_runner import HTTPActionRunner
    from .http_actions_store import HTTPActionsStore
    from .notification_snapshot import NotificationSnapshotStore
    from .notifications import NotificationTokenStore
    from .page_images_store import PageImagesStore
    from .parts_store import PartsStore
    from .snapshot_aspect_store import SnapshotAspectStore
    from .snapshot_crop_store import SnapshotCropStore
    from .snapshot_stream_store import SnapshotStreamStore
    from .wa_pair_requests import PairOfferStore, PairRequestStore
    from .wa_stream_tokens import BatchSnapshotTokenStore, StreamTokenStore
    from .watch_config_store import WatchConfigStore
    from .watch_logs_store import WatchLogsStore
    from .watch_voices_store import WatchVoicesStore
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
    # Parts: the home's saved pieces of a complication, as share text. Panel
    # only; nothing on a watch or a phone ever reads it.
    parts_store: PartsStore
    # The picture each Browse card shows, taken by the panel on save. Panel
    # only, like the parts.
    card_preview_store: CardPreviewStore
    # Watch config documents (the phone's page config in step 1), one record
    # per watch per kind. Read and written over the signed watch_config ops.
    watch_config_store: WatchConfigStore
    # Devices waiting for a user to confirm their pairing code, and the
    # sealed secrets of confirmed ones waiting to be fetched. Memory only;
    # written by /v2/pair/start, confirmed by pairing_ws.py, read by
    # /v2/pair/status.
    pair_request_store: PairRequestStore
    # The panel's open QR offers for an iPhone. Memory only; made by
    # pairing_ws.py, spent by /v2/pair/redeem.
    pair_offer_store: PairOfferStore
    # Each watch's installed speech voices, as the watch last sent them over
    # watch_voices_put. Read by the panel's Watch voice picker.
    watch_voices_store: WatchVoicesStore
    # The home's HTTP action library, edited in the panel and handed over
    # once by each phone, and the sender that runs one for a device. Both
    # are home-wide: every paired device may run every action.
    http_actions_store: HTTPActionsStore
    http_action_runner: HTTPActionRunner
    # The home's page background photos, uploaded in the panel or handed
    # over by a phone, and fetched by id by any paired device.
    page_images_store: PageImagesStore
    # Each Home Assistant user's client certificate, handed over sealed by a
    # phone and fetched sealed by every watch of that user.
    client_certificate_store: ClientCertificateStore
    # Each device's latest log upload, read by its diagnostics download.
    watch_logs_store: WatchLogsStore
    apns_client: APNsClient | None = field(default=None)
    # Sends a phone owner the background push a watch owner gets as a long-poll
    # wake. Built after the relay client is resolved, so it is None for the
    # moment between the two and on an instance whose relay never came up.
    complication_push: ComplicationPhonePush | None = field(default=None)


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
# The random key the panel sends to the complication gallery, so an uploader
# can list and delete their own uploads. Made on first use, never derived from
# anything about this Home Assistant.
GALLERY_KEY_STORAGE_KEY = "wrist_assistant.gallery_key"
GALLERY_KEY_STORAGE_VERSION = 1
# Parts: named pieces of a complication, kept as the share text their layers
# make. One library per home, never per watch. Written on the first save, so an
# install that has never saved a part has no file here at all.
PARTS_STORAGE_KEY = "wrist_assistant.parts"
PARTS_STORAGE_VERSION = 1
# Card previews: the index of the PNG each Browse card shows, one per record,
# with the pictures themselves in a folder of their own beside it.
CARD_PREVIEW_STORAGE_KEY = "wrist_assistant.card_previews"
CARD_PREVIEW_STORAGE_VERSION = 1
# Watch config documents (owner watch → kind → envelope + document), see
# watch_config_store.py. This key is the index naming the owners; each owner's
# records live in a file of their own under this key plus a digest of the
# owner id, so one watch's save never rewrites another watch's document.
WATCH_CONFIG_STORAGE_KEY = "wrist_assistant.watch_config"
WATCH_CONFIG_STORAGE_VERSION = 1
# The kinds a client may read and write: the page config (`GridConfiguration`
# in the app), the watch behavior settings (`BehaviorPreferences`), the
# library catalog (`WatchLibraryCatalog`: the phone's HTTP actions and status
# pages by id and name, which the panel's tile picker reads; an older phone
# adds its macros, which were removed and are kept unread) and the
# menus (the Anywhere menu, the Entity quick menu and the page switcher's
# style, as `quickAction`, `entityRadial` and `pageSwitcher`). Step 4d batch 2
# adds the voice settings (`TTSConfiguration`: the voice defaults and the
# phrase library), the notification style (`NotificationStyleConfig`) and the
# status pages (`{"schemaVersion": 1, "statusPages": [StatusPageConfig]}`).
# Step 4d batch 5 adds the Control Center list (`{"schemaVersion": 1,
# "entities": [CuratedEntity]}`: the watch's Control Center controls, hidden
# entries and other domains included).
# Step 8 adds the rooms of a home that is not the watch's main house
# (`{"schemaVersion": 1}` plus the six room keys under their `behavior`
# names, every one optional: `roomQuickJumpEnabled`,
# `roomQuickJumpSourceEntityId`, `roomQuickJumpFallbackPageId`,
# `roomQuickJumpMappings`, `roomAutoSwitchEnabled` and
# `pointControlRoomMappingsJSON`). The main house keeps its rooms in
# `behavior`; a second home pulls no `behavior`, so its rooms travel apart
# from the global settings, which stay with the main house.
# A later kind is a new name here and a size cap below, with no change to the
# storage shape.
WATCH_CONFIG_KINDS = frozenset(
    {
        "pages",
        "behavior",
        "catalog",
        "menus",
        "voice",
        "notification_style",
        "status_pages",
        "control_center",
        "rooms",
    }
)
# The kinds the panel may save, and restore from a record's history: pages and
# behavior since the page editor moved into the panel (step 3), menus (step 4d)
# voice, notification style and status pages (step 4d batch 2) and the Control
# Center list (step 4d batch 5) and a second home's rooms (step 8). Never the
# catalog, which only the phone writes. The panel may create the first record
# of one of these kinds, but only for a watch that is paired (see
# WatchConfigStore.panel_save).
WATCH_CONFIG_PANEL_KINDS = frozenset(
    {
        "pages",
        "behavior",
        "menus",
        "voice",
        "notification_style",
        "status_pages",
        "control_center",
        "rooms",
    }
)
# `updated_by` on a record the panel saved, in place of a device's signing id.
WATCH_CONFIG_PANEL_WRITER = "panel"
# Compact UTF-8 JSON size a stored document may reach, per kind. Every kind in
# WATCH_CONFIG_KINDS needs an entry. The page cap is what the watch can hold:
# the watch keeps its pages in its UserDefaults, and watchOS stops an app whose
# whole defaults store passes about 1 MiB. Measured on the simulator, a 992,597
# byte page document applied and a 1,039,905 byte one crashed the app on every
# launch. The watch saves at most 700 KiB of pages
# (`WatchDefaultsBudgetRules` in the app) so the rest of its store keeps room,
# and this cap is the same 716,800 bytes: a save Home Assistant accepts is one
# the watch will use. It was 900 KiB, which Home Assistant accepted and the
# watch then refused as too large, and 2 MiB before that. The behavior settings are a flat object of a few dozen keys, so a much smaller
# cap still leaves plenty.
# A catalog of 200 entries is about 30 KB. The menus are a few dozen slots
# plus per-entity overrides, the same order as the catalog. The voice settings
# hold at most eight phrases, the notification style is a flat object of a
# couple of dozen keys, the status pages are a few pages of rows and the
# Control Center list a few dozen short entries, so the same cap leaves each
# of them plenty. A second home's rooms are six keys, a room map and a zone
# list, so 64 KiB is far more than they need. Home Assistant's HTTP server accepts
# request bodies up to 16 MiB, so the cap, not the server, is what refuses an
# oversized upload.
WATCH_CONFIG_MAX_DOCUMENT_BYTES: dict[str, int] = {
    "pages": 700 * 1024,
    "behavior": 256 * 1024,
    "catalog": 256 * 1024,
    "menus": 256 * 1024,
    "voice": 256 * 1024,
    "notification_style": 256 * 1024,
    "status_pages": 256 * 1024,
    "control_center": 256 * 1024,
    "rooms": 64 * 1024,
}
# Documents a save replaced, kept per record, oldest dropped. Storage only.
WATCH_CONFIG_HISTORY_LIMIT = 5
# What the integration advertises once it serves watch_config_get/put. The
# phone makes no watch_config request at all without it.
WATCH_CONFIG_CAPABILITY = "watch_config"
# What the integration advertises once it serves the watch_config/subscribe
# WebSocket command (watch_config_ws.py). The phone subscribes only when it
# sees this, so an older integration is never sent a command it would answer
# with "unknown_command".
WATCH_CONFIG_LIVE_CAPABILITY = "watch_config_live"
# What the integration advertises once the signed watch_config_get accepts
# `unreadable_revision` (a device saying it fetched a revision it could not
# decode). A device sends the field only when it sees this: an older
# integration would drop the key unread, so the report would go nowhere and
# that get would count as a delivery.
WATCH_CONFIG_REJECT_REPORT_CAPABILITY = "watch_config_reject_report"
# What the integration advertises once it stores the `catalog` kind. The phone
# publishes its library catalog only when it sees this: an older integration
# would refuse the kind as invalid on every upload.
WATCH_CONFIG_CATALOG_CAPABILITY = "watch_config_catalog"
# What the integration advertises once it stores the `menus` kind, carries it
# on the delta reply and lets the panel create its first record. The phone
# mirrors its menus and the watch pulls them only when it sees this: an older
# integration would refuse the kind as invalid.
WATCH_CONFIG_MENUS_CAPABILITY = "watch_config_menus"
# What the integration advertises once it stores the `voice` kind (the voice
# defaults and the phrase library), carries it on the delta reply and lets the
# panel create its first record. The phone mirrors its voice settings and the
# watch pulls them only when it sees this: an older integration would refuse
# the kind as invalid.
WATCH_CONFIG_VOICE_CAPABILITY = "watch_config_voice"
# The same for the `notification_style` kind (the Long Look's look, the watch
# app's sounds and the delivery route).
WATCH_CONFIG_NOTIFICATION_STYLE_CAPABILITY = "watch_config_notification_style"
# The same for the `status_pages` kind.
WATCH_CONFIG_STATUS_PAGES_CAPABILITY = "watch_config_status_pages"
# The same for the `control_center` kind (step 4d batch 5).
WATCH_CONFIG_CONTROL_CENTER_CAPABILITY = "watch_config_control_center"
# The same for the `rooms` kind (step 8): the rooms of a home that is not the
# watch's main house. The phone uploads a second home's rooms and the watch
# pulls them only when it sees this.
WATCH_CONFIG_ROOMS_CAPABILITY = "watch_config_rooms"
# What the integration advertises once every /v2/delta reply with a body names
# the signer's own `watch_config: {"pages": rev, "behavior": rev}` (0 for a
# kind with no record) and a save of either kind wakes that owner's parked
# poll. The watch uses it as the trigger to pull; the pull itself is the
# signed watch_config_get, gated on WATCH_CONFIG_CAPABILITY. With
# WATCH_CONFIG_MENUS_CAPABILITY the field names `menus` too, and with the
# voice, notification style, status pages, Control Center and rooms
# capabilities those kinds.
WATCH_CONFIG_DELTA_CAPABILITY = "watch_config_delta"
# Each watch's installed speech voices (watch id → list, hash, time), see
# watch_voices_store.py. One small file for every watch: a list is a few
# hundred short entries at most, and it changes only when the watch's voices
# do. The panel's Watch voice picker reads it; nothing else does.
WATCH_VOICES_STORAGE_KEY = "wrist_assistant.watch_voices"
WATCH_VOICES_STORAGE_VERSION = 1
# The most voices one watch_voices_put may carry. A watch with every language
# downloaded has a couple of hundred; this leaves room without letting one
# signed request fill the file.
WATCH_VOICES_MAX_ENTRIES = 500
# What the integration advertises once /v2/delta reads `voices_hash` (the
# watch's own hash of its voice list), answers `voices_wanted: true` when it
# differs from the stored one, and serves the signed watch_voices_put op. The
# watch sends neither the hash nor the list without it.
WATCH_VOICES_CAPABILITY = "watch_voices"
# The home's HTTP action library (step 4d batch 4), see http_actions_store.py:
# one record for the whole home, not one per watch. The document is the
# phone's own HTTPActionConfig JSON, secrets included, which is why nothing
# but the panel's commands (open to every signed-in user, see
# http_actions_ws.py) ever reads it whole; no device is sent it.
HTTP_ACTIONS_STORAGE_KEY = "wrist_assistant.http_actions"
HTTP_ACTIONS_STORAGE_VERSION = 1
# What the integration advertises once it keeps that library, serves the
# signed http_actions_hand_over, http_actions_get and http_action_run ops,
# and names the library's revision as `http_actions` on every delta reply.
# The phone hands its library over, and the watch runs actions through Home
# Assistant, only when it sees this.
HTTP_ACTIONS_CAPABILITY = "http_actions"
# The home's page background photos (step 4d batch 6), see
# page_images_store.py: an index of the custom photos here, and one JPEG per
# photo in a folder of its own beside it. The built-in photos ship with the
# integration and are never in the index.
PAGE_IMAGES_STORAGE_KEY = "wrist_assistant.page_images"
PAGE_IMAGES_STORAGE_VERSION = 1
# What the integration advertises once it keeps those photos and serves the
# signed page_image_get and page_image_put ops. The phone hands its photos
# over, and a watch fetches the photos its pages name, only when it sees this.
PAGE_IMAGES_CAPABILITY = "page_images"
# Each Home Assistant user's client certificate for an mTLS proxy (step 4 of
# the phone watch link removal), see client_certificate_store.py: the .p12
# bytes, its password, its fingerprint and a revision per user. A private
# Store, since it holds a private key and the password that opens it.
CLIENT_CERTIFICATE_STORAGE_KEY = "wrist_assistant.client_certificates"
CLIENT_CERTIFICATE_STORAGE_VERSION = 1
# The largest .p12 a phone may hand over. A client certificate with its key
# and a short chain is two or three KiB; this leaves room for a long chain.
CLIENT_CERTIFICATE_MAX_PKCS12_BYTES = 32 * 1024
# What the integration advertises once it keeps those certificates, serves
# the signed client_certificate_put, client_certificate_get and
# client_certificate_delete ops, and names the bound user's revision as
# `client_certificate` on the delta reply. The phone hands its certificate
# over, and a watch fetches it, only when it sees this.
CLIENT_CERTIFICATE_CAPABILITY = "client_certificate"
# Each device's latest log upload (step 4), see watch_logs_store.py: an index
# of who sent logs and when, and one JSON file per device in a folder of its
# own beside it. Read only by the device's diagnostics download.
WATCH_LOGS_STORAGE_KEY = "wrist_assistant.watch_logs"
WATCH_LOGS_STORAGE_VERSION = 1
# The largest watch_logs_put body. The watch trims its bundle to 1.5 MiB
# before sending; this is the hard stop.
WATCH_LOGS_MAX_BODY_BYTES = 2 * 1024 * 1024
# What the integration advertises once it serves the signed watch_logs_put
# op. The watch offers "Send logs to Home Assistant" only when it sees this.
WATCH_LOGS_CAPABILITY = "watch_logs"
# What the integration advertises once it serves /v2/pair/start and the
# panel's pair/lookup and pair/confirm (pairing_ws.py). A watch with no
# iPhone offers to pair by code only when /version lists this.
WATCH_PAIRING_CAPABILITY = "watch_pairing"
# What the integration advertises once /v2/pair/start takes an X25519
# `public_key_b64` and a `kind`, the confirm makes the secret and seals it to
# that key, and /v2/pair/status hands the sealed copy out. A device sends its
# public key rather than its secret only when /version lists this.
SEALED_CODE_PAIRING_CAPABILITY = "sealed_code_pairing"
# What the integration advertises once an iPhone can pair with no Home
# Assistant token: the panel's QR offer (pair/offer, offer_status,
# offer_cancel) and /v2/pair/redeem, a code confirm that stores an iPhone,
# and the signed `rekey` op. The app requires it.
PHONE_PAIRING_CAPABILITY = "phone_pairing"
# What the integration advertises once an iPhone's push token lives under the
# phone's own id and is paired with the watches of the same Home Assistant
# user at send time (notifications.resolve_push_routes). The phone then
# registers, reads its status and sends its test pushes with no
# companion_watch_id, reads the notification style signed as itself, and
# may drop its copy of the watch key.
PUSH_PAIRED_BY_USER_CAPABILITY = "push_paired_by_user"
# Highest CustomComplicationConfig schemaVersion this integration can edit.
# Must track `CustomComplicationConfig.currentSchemaVersion` in the app repo.
# A newer document is displayed read-only and never re-saved.
# v5 is shape-identical to v4; it only marks documents with slotIndex > 7 so an
# old app surfaces "needs app update" instead of silently dropping them. The
# panel writes 5 only for slots above 7, keeping low-slot documents byte-stable.
# v6 marks a document an app that predates per-shape support must not draw:
# one missing a canvas shape (rectangular, circular or corner) or one carrying
# Inline (the `inline` object). A document with all three canvas shapes and no
# Inline keeps 4 or 5. The store refuses a document that breaks the pairing.
# v7 adds the four iPhone Home Screen shapes (small, medium, large, xlarge).
# A document naming any of them must say 7, so an app that predates them skips
# it with "needs app update" rather than drawing a shape it does not know.
# A document with only watch shapes keeps the version it would have had.
# v8 adds the list layer, which draws a row template once per item of a source,
# and with it the `item` and `listStat` value kinds. An app that predates them
# cannot draw a row at all and would fail the document on the unknown value
# kind, so anything carrying one must say 8 and be skipped with "needs app
# update" instead. A document with no list and no item value keeps its version.
# v9 adds pages: several faces in one slot, one showing at a time, with a layer
# saying which page it belongs to. The one key in this ladder that cannot
# degrade to "not drawn": an app that ignored it would stack every page on top
# of every other one, which is a broken face rather than a plainer one. So a
# document with pages, or with any layer pinned to a page, must say 9.
# v10 adds the `imageTime` value kind: when a picture layer was fetched, read
# by an ordinary text layer (a picture's "Timestamp" is that text over a
# capsule, in a group). An app on 9 fails the whole document on the unknown
# value kind, the v8 reason again, so a document with one must say 10. The
# older `imageTime` layer kind needs nothing.
# v11 is the Dashboard shape (DASHBOARD_FAMILY): a card on a Home Assistant
# dashboard, sized by its author (`canvas` in its perFamily entry). Only the
# panel and this store know it. It lives in the Library alone: the store
# refuses a document naming it, or stamped past DEVICE_MAX_SCHEMA_VERSION,
# under any device owner, so no app ever meets one.
COMPLICATION_MAX_SCHEMA_VERSION = 11
# Highest schema a watch or phone reads: `currentSchemaVersion` in the app
# repo. Every reply a device signs for says this, never the panel's maximum
# above, because the app compares it against its own to decide whether a move
# or a handover may go ahead.
DEVICE_MAX_SCHEMA_VERSION = 10
# The Library-only shape a Home Assistant dashboard draws. See v11 above.
DASHBOARD_FAMILY = "dashboard"
COMPLICATION_MAX_DOCUMENT_BYTES = 256 * 1024
COMPLICATION_MAX_LAYERS = 64
# Slot indices 0..COMPLICATION_MAX_SLOTS-1 map onto ComplicationStableSlot on
# the watch. The watch face picker always shows the first 8 slots and grows past
# them only when a higher slot is occupied; 64 is the hard ceiling both sides
# enforce.
COMPLICATION_MAX_SLOTS = 64
# The per-owner record ceiling, which is no longer the slot ceiling.
#
# It used to be: one complication held one slot, so 64 slots and 64 records
# were the same sentence. One shape per document ended that. A slot now holds
# one record per shape (``_slot_shapes`` in complication_store), so a watch
# preset that moves over as rectangular, circular, corner and inline is four
# records in one slot, and the old 64 refused the seventeenth moved preset
# while 48 slots stood empty.
#
# 256 was the watch's real ceiling: 64 slots times its four shapes. A phone has
# more shapes than that and so cannot fill every slot, which is fine.
#
# Raised to 512 on 2026-09-21, when the Control Center control became a document
# of its own rather than something added to a shape. Every control an author
# wants is now one more record, so the old ceiling stopped being "one per shape
# per slot" and started being a real count of designs. Doubling it keeps the
# guard well clear of anyone's real use. Nobody builds 512 designs; the number
# is a storage guard, not a budget, and at COMPLICATION_MAX_DOCUMENT_BYTES
# apiece the worst case an owner can reach is 128 MiB.
#
# The Library (below) counts under the same ceiling and its records carry a
# slotIndex like any other: no device ever reads it, but a design moved onto a
# watch keeps the slot it was made with, and one shared rule is easier to
# trust than a second set of storage rules that applies to one owner. The
# panel picks a free slot among the Library's own records.
COMPLICATION_MAX_PER_OWNER = 512

# The one owner that is not a device: the home's design Library.
#
# Every other owner id belongs to a watch or an iPhone that self-provisioned,
# so a design could not exist without a device to keep it on. The Library is
# where a design lives before it is put on anything, and where it stays when it
# is taken off everything. Nothing polls it and nothing is ever pushed to it:
# the apps fetch their own owner id and know nothing about this one. The store
# treats it as an ordinary owner string, so saving, listing, deleting and the
# revision history all work on it unchanged.
LIBRARY_OWNER_ID = "library"

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
# Today this matches WA_PROTOCOL_VERSION. The 13 bearer-authed v1 views
# (`/api/watch/*`, plus summary, states_batch, camera, audio, notifications
# and mass under `/api/wrist_assistant/`) were removed in 3.x, so a v1 app
# build can no longer connect at all. Bump this past 2 only when v3+ wire
# changes make v2 apps unable to talk to us.
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
