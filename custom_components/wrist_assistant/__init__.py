"""Wrist Assistant delta API integration."""

from __future__ import annotations

import logging
from datetime import timedelta
from pathlib import Path

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STOP
from homeassistant.core import (
    HomeAssistant,
    ServiceCall,
    ServiceResponse,
    SupportsResponse,
    callback,
)
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.network import NoURLAvailableError, get_url
from homeassistant.helpers.storage import Store

from .api import DeltaCoordinator
from .apns_client import APNsClient
from .batch_snapshot_settings_store import BatchSnapshotSettingsStore
from .camera_devices import resolve_stream_sibling
from .camera_stream import (
    CameraStreamCoordinator,
    capture_notification_snapshot,
    jpeg_aspect,
)
from .const import (
    DOMAIN,
    NOTIFICATION_TOKEN_STORAGE_KEY,
    NOTIFICATION_TOKEN_STORAGE_VERSION,
    PLATFORMS,
    WA_HMAC_NONCE_TTL_SECONDS,
    WIDGET_SECRET_STORAGE_KEY,
    WIDGET_SECRET_STORAGE_VERSION,
    WristAssistantConfigEntry,
    WristAssistantData,
)
from .notification_snapshot import NotificationSnapshotStore
from .snapshot_aspect_store import SnapshotAspectStore
from .snapshot_crop_store import SnapshotCropStore
from .snapshot_stream_store import SnapshotStreamStore
from .notifications import NotificationTokenStore, TokenEntry
from .v1_api_views import (
    MusicAssistantPlayersView,
    MusicAssistantQueueView,
    RemoteCommandView,
    WatchStatesBatchView,
    WatchSummaryView,
    WatchUpdatesView,
)
from .v1_audio_upload_views import AudioUploadView
from .v1_camera_devices_views import CameraDevicesView
from .v1_camera_stream_views import (
    CameraBatchView,
    CameraSnapshotView,
    CameraStreamView,
    CameraViewportView,
)
from .v1_notifications_views import NotificationRegisterView
from .wa_stream_tokens import BatchSnapshotTokenStore, StreamTokenStore
from .wa_v2_views import (
    WAActionView,
    WABatchSnapshotView,
    WADeltaView,
    WANotificationSnapshotLiveView,
    WANotificationSnapshotView,
    WARegisterSecretView,
    WAStreamView,
    WAVersionView,
)
from .widget_hmac import WANonceCache
from .widget_secret_store import WidgetSecretStore

_LOGGER = logging.getLogger(__name__)
SERVICE_FORCE_RESYNC = "force_resync"
SERVICE_SEND_NOTIFICATION = "send_notification"

_ACTION_SCHEMA = vol.Schema(
    {
        vol.Optional("title"): cv.string,
        vol.Optional("label"): cv.string,
        vol.Optional("domain"): cv.string,
        vol.Optional("service"): cv.string,
        vol.Optional("service_data"): dict,
        vol.Optional("entity_id"): cv.string,
        vol.Optional("state"): cv.string,
        vol.Optional("friendly_name"): cv.string,
        vol.Optional("attributes"): dict,
        vol.Optional("icon"): cv.string,
    }
)
_SEND_NOTIFICATION_SCHEMA = vol.Schema(
    {
        vol.Optional("message"): cv.string,
        vol.Optional("title"): cv.string,
        vol.Optional("target"): cv.string,
        vol.Optional("image"): cv.string,
        vol.Optional("actions"): vol.All(
            cv.ensure_list, [_ACTION_SCHEMA], vol.Length(min=1, max=4)
        ),
        vol.Optional("data"): dict,
        vol.Optional("sound"): cv.string,
        vol.Optional("push_type", default="alert"): vol.In(["alert", "background"]),
        # Optional per-notification snapshot sizing (the blueprint's quality
        # dropdown maps a tier to these). Omitted → default 1024px / q80. Clamped
        # downstream in capture_notification_snapshot.
        vol.Optional("snapshot_width"): vol.Coerce(int),
        vol.Optional("snapshot_quality"): vol.Coerce(int),
        vol.Optional("tag"): cv.string,
        vol.Optional("group"): cv.string,
        vol.Optional("priority"): vol.In(
            ["passive", "active", "time-sensitive", "critical"]
        ),
    }
)


def _strip_none(value):
    """Recursively drop None values from the custom push payload.

    A JSON ``null`` anywhere in the notification's custom data breaks the
    iPhone→watch mirror path — iOS can't represent null when forwarding the
    notification's userInfo to the wrist, so it drops the entire custom blob
    (including ``actions``) and the watch renders no buttons. Direct-to-watch
    delivery tolerates null, so the symptom only showed in Fast/mirror mode.
    Stripping null here is the belt-and-suspenders guard regardless of source
    (enriched attributes, or user-supplied ``data``).
    """
    if isinstance(value, dict):
        return {k: _strip_none(v) for k, v in value.items() if v is not None}
    if isinstance(value, list):
        return [_strip_none(v) for v in value if v is not None]
    return value


def _choose_token(
    entries: dict[str, TokenEntry], delivery_mode: str = "mirror"
) -> TokenEntry | None:
    """Pick which token to push to for a watch, honoring the per-watch mode.

    ``mirror`` (default): prefer the companion iPhone token — iOS mirrors the
    alert to the wrist in ~1s with our full UI + haptic, avoiding the ~15s
    watch-direct coordination tax when the phone is present. The cost is that
    an away-from-phone watch gets nothing (no phone to mirror from).

    ``direct``: prefer the watch's own token — reliable even when the phone is
    absent (~1s), at the cost of the ~15s coordination delay whenever the phone
    *is* present. The opt-in choice for users who are often away from their
    phone. See the per-user "Delivery" setting in the app.

    Either way we fall back to the other platform's token if the preferred one
    isn't registered, so a watch-only or iPhone-only registration still works.
    """
    if delivery_mode == "direct":
        return (
            entries.get("watchos")
            or entries.get("ios")
            or next(iter(entries.values()), None)
        )
    return (
        entries.get("ios")
        or entries.get("watchos")
        or next(iter(entries.values()), None)
    )


def _mint_snapshot_url(
    hass: HomeAssistant,
    runtime_data: WristAssistantData,
    image_source: object,
) -> tuple[str, str, float | None] | None:
    """Reserve a snapshot token + token-authed URL *without* capturing yet.

    Returns ``(absolute_url, token, cached_aspect)`` or None. The bytes are
    filled in by ``_capture_snapshot_into`` running in the background, so the
    capture never blocks the alert; ``WANotificationSnapshotView`` waits briefly
    for the in-flight capture when the device fetches the URL. ``cached_aspect``
    is this camera's last-known snapshot width/height (None the first time we see
    it) so the client can reserve the image's footprint up front. Returns None
    (and logs) when no reachable HA URL exists — a missing image must never block
    the notification. Uses the external HA URL when configured so the device can
    fetch it away from home; users without remote access get an internal URL that
    only resolves on the LAN.
    """
    if not isinstance(image_source, str) or not image_source:
        return None
    store = runtime_data.notification_snapshot_store
    token = store.reserve(entity_id=image_source)
    try:
        base = get_url(hass, prefer_external=True)
    except NoURLAvailableError:
        store.fail(token)  # release the reservation; nothing will fetch it
        _LOGGER.warning(
            "No reachable Home Assistant URL; notification snapshot for %s omitted",
            image_source,
        )
        return None
    cached_aspect = runtime_data.snapshot_aspect_store.get(image_source)
    url = f"{base}/api/wrist_assistant/notification/snapshot/{token}"
    return url, token, cached_aspect


async def _capture_snapshot_into(
    hass: HomeAssistant,
    runtime_data: WristAssistantData,
    image_source: str,
    token: str,
    *,
    width: int | None = None,
    quality: int | None = None,
) -> None:
    """Background: capture the camera frame and hand it to the reserved token.

    Runs concurrently with the rest of the push so a slow camera delays only the
    image, never the alert (the moment is still frozen at capture time). On
    success, remembers the snapshot's aspect for this camera so subsequent pushes
    can carry it up front. ``width``/``quality`` are the optional per-notification
    sizing (the blueprint's quality dropdown); None → integration default. Never
    raises — a failed capture marks the token failed so a waiting GET 404s and
    the client fetches the image on demand via camera_entity_id.
    """
    store = runtime_data.notification_snapshot_store
    # Apply the user's saved per-camera framing (set via the iOS app). None when
    # this camera was never framed → full-frame capture.
    crop = runtime_data.snapshot_crop_store.get(image_source)
    try:
        jpeg = await capture_notification_snapshot(
            hass, image_source, viewport=crop, width=width, quality=quality
        )
    except Exception as err:  # noqa: BLE001 — never let a bad camera kill the task
        _LOGGER.warning("Snapshot capture failed for %s: %s", image_source, err)
        jpeg = None
    # TEMP DEBUG (wrong-camera diagnosis): which entity we actually grabbed and
    # how many bytes. Correlate token with the "WA camera push" line above.
    # Remove after diagnosis.
    _LOGGER.info(
        "WA snapshot capture: entity=%s token=%s bytes=%s",
        image_source,
        token[:8],
        len(jpeg) if jpeg else 0,
    )
    if not jpeg:
        store.fail(token)
        return
    store.fulfill(token, jpeg)
    aspect = await hass.async_add_executor_job(jpeg_aspect, jpeg)
    if aspect:
        runtime_data.snapshot_aspect_store.set(image_source, aspect)


def _resolve_stream_entity(
    hass: HomeAssistant, runtime_data: WristAssistantData, entity_id: object
) -> str | None:
    """Live-streamable entity to open when a notification snapshot is tapped.

    Honors the user's explicit per-camera override (set via the iOS app) first,
    then falls back to auto-resolution by device grouping. None for non-cameras.
    """
    if not isinstance(entity_id, str) or not entity_id.startswith("camera."):
        return None
    override = runtime_data.snapshot_stream_store.get(entity_id)
    if override:
        return override
    return resolve_stream_sibling(hass, entity_id)


async def _deliver_push(
    hass: HomeAssistant,
    data: WristAssistantData,
    *,
    title: str | None,
    message: str | None,
    image_source: object = None,
    enriched_actions: list | None = None,
    extra_data: dict | None = None,
    sound: str | None = None,
    push_type: str = "alert",
    target_watch_ids: list[str] | None = None,
    snapshot_width: int | None = None,
    snapshot_quality: int | None = None,
) -> dict:
    """Build the notification payload and deliver it via the relay.

    Shared by the ``send_notification`` service and the v2
    ``send_test_notification`` op. Captures the camera snapshot (applying the
    user's saved crop), sets the WA_ACTIONS category whenever there's custom
    content to render, resolves the targets to their per-platform token maps,
    and pushes to each honoring its delivery mode.

    ``enriched_actions`` must already be enriched (callers that accept raw
    action dicts run them through ``_enrich_actions`` first). ``target_watch_ids``
    selects which watches to push to; ``None`` broadcasts to every registered
    watch. Returns ``{"sent", "failed", "failures"}``; raises HomeAssistantError
    when the APNs client is unavailable, no target is registered, or every push
    fails — matching the prior service behavior.
    """
    client = data.apns_client
    if client is None:
        raise HomeAssistantError(
            "APNs client failed to initialize. Check Home Assistant logs for details."
        )
    store = data.notification_store

    extra_data = dict(extra_data or {})
    if enriched_actions:
        extra_data["actions"] = enriched_actions

    # Camera snapshot: when an `image: "camera.x"` source is passed, reserve the
    # token + URL now (instant) and embed it, then capture the frame in the
    # background so a slow camera delays only the image, not the alert. The
    # device fetches the URL on arrival; WANotificationSnapshotView waits briefly
    # for the in-flight capture. A pre-built `snapshot_url` is honored as-is.
    snapshot_token: str | None = None
    if image_source is not None and not extra_data.get("snapshot_url"):
        minted = _mint_snapshot_url(hass, data, image_source)
        if minted:
            snapshot_url, snapshot_token, snapshot_aspect = minted
            extra_data["snapshot_url"] = snapshot_url
            # Aspect (cached from this camera's last snapshot) lets the client
            # reserve the image's footprint up front so nothing resizes when the
            # image arrives. Absent on the first push per camera; learned then.
            if snapshot_aspect:
                extra_data["snapshot_aspect"] = snapshot_aspect
        # Carry the source camera whenever the image is a camera — set regardless
        # of whether the snapshot URL was minted. The client uses it to
        # (a) open the live stream on a snapshot tap, and (b) fetch the image on
        # demand when the embedded URL 404s (capture still in flight and slow, or
        # the URL isn't reachable from where the device is) — so the notification
        # still shows an image instead of buttons-only.
        if isinstance(image_source, str) and image_source.startswith("camera."):
            extra_data.setdefault("camera_entity_id", image_source)
            # The snapshot variant can't stream — hand the watch the device's
            # live-streamable sibling so the tapped-open view plays live.
            stream_entity = _resolve_stream_entity(hass, data, image_source)
            if stream_entity:
                extra_data.setdefault("camera_stream_entity_id", stream_entity)
            # TEMP DEBUG (wrong-camera diagnosis): what HA handed us vs. what we
            # resolved. If image_source is the OLD camera on a failing run, the
            # stale value came from HA upstream, not WA. Remove after diagnosis.
            _LOGGER.info(
                "WA camera push: image_source=%s camera_entity_id=%s stream_entity=%s",
                image_source,
                extra_data.get("camera_entity_id"),
                extra_data.get("camera_stream_entity_id"),
            )

    # Start the capture now so it overlaps payload build + the APNs/relay send;
    # by the time the device GETs the URL the bytes are often already there.
    # image_source is a str whenever snapshot_token is set (only that branch
    # mints one).
    if snapshot_token is not None and isinstance(image_source, str):
        hass.async_create_task(
            _capture_snapshot_into(
                hass,
                data,
                image_source,
                snapshot_token,
                width=snapshot_width,
                quality=snapshot_quality,
            ),
            name=f"wa_snapshot_capture_{snapshot_token[:8]}",
        )

    # Every *visible* push carries the WA_ACTIONS category. Three reasons it must:
    #   • a snapshot-only push (no action rows) — else it degrades to a plain
    #     system notification with no image;
    #   • a camera push whose send-time capture failed (no snapshot_url) — so the
    #     client renders and can fetch the image on demand from `camera_entity_id`,
    #     rather than silently degrading to buttons-only;
    #   • a plain title+message push (no actions, no camera) — because the iPhone
    #     app suppresses any non-WA_ACTIONS notification while it is foreground
    #     (see `willPresent` in WristAssistantApp.swift), so a category-less plain
    #     alert never surfaces there at all. Carrying WA_ACTIONS routes it through
    #     the shared NotificationContentView, which renders title/message cleanly
    #     with no rows and no image — verified safe on both the iPhone content
    #     extension and the watch Long Look.
    # Only the silent `background` (content-available) push stays uncategorized —
    # it has no visible UI to render. The action/snapshot/camera checks are kept
    # so this stays purely additive: anything categorized before still is.
    category = (
        "WA_ACTIONS"
        if (
            push_type == "alert"
            or enriched_actions
            or extra_data.get("snapshot_url")
            or extra_data.get("camera_entity_id")
        )
        else None
    )
    # Default interruption-level to "active": alerts + haptic when the user is
    # available, but respects Focus / Do Not Disturb / sleep.
    extra_data.setdefault("priority", "active")
    # Strip any None values so a JSON null can't break the mirror path.
    extra_data = _strip_none(extra_data)

    # Resolve targets to their full per-platform entry maps.
    if target_watch_ids is not None:
        targets: dict[str, dict] = {}
        for watch_id in target_watch_ids:
            entries = store.get_entries(watch_id)
            if entries:
                targets[watch_id] = entries
        if not targets:
            raise HomeAssistantError(
                "No registered push token for the requested target"
            )
    else:
        targets = store.all_entries
        if not targets:
            raise HomeAssistantError(
                "No watches have registered for push notifications"
            )

    # Send to each target, routing per the watch's "delivery_mode" setting.
    # "mirror" (default): push to the companion iPhone token (iOS mirrors to the
    # wrist in ~1s; nothing when the phone is away). "direct": push to the watch
    # token (reliable when away; ~15s when the phone is present). Never both.
    sent = 0
    failure_map: dict[str, str] = {}
    for watch_id, entries in targets.items():
        delivery_mode = store.get_watch_metadata(watch_id, "delivery_mode", "mirror")
        tok_entry = _choose_token(entries, delivery_mode)
        _LOGGER.debug(
            "deliver_push routing watch_id=%s platforms=%s mode=%s -> chosen=%s",
            watch_id,
            sorted(entries.keys()),
            delivery_mode,
            tok_entry.platform if tok_entry else None,
        )
        if tok_entry is None:
            continue
        # A mirrored (iOS) push with no sound delivers to the wrist silently AND
        # without a haptic — the user never perceives it. Force at least the
        # default alert sound when the chosen token is the companion iPhone.
        target_sound = sound
        if tok_entry.platform == "ios" and not target_sound:
            target_sound = "default"
        success, reason, used_env = await client.send_push(
            watch_id=watch_id,
            device_token=tok_entry.device_token,
            title=title,
            body=message,
            category=category,
            data=extra_data,
            sound=target_sound,
            push_type=push_type,
            environment=tok_entry.environment,
            platform=tok_entry.platform,
        )
        if success:
            sent += 1
            _LOGGER.debug(
                "deliver_push delivered watch_id=%s platform=%s env=%s",
                watch_id,
                tok_entry.platform,
                used_env,
            )
            if used_env != tok_entry.environment:
                store.register(
                    watch_id,
                    tok_entry.device_token,
                    platform=tok_entry.platform,
                    environment=used_env,
                )
        else:
            if APNsClient.is_dead_token(reason):
                _LOGGER.warning(
                    "Removing dead %s token for watch_id=%s (reason=%s)",
                    tok_entry.platform,
                    watch_id,
                    reason,
                )
                store.remove(watch_id, platform=tok_entry.platform)
            failure_map[watch_id] = reason or "unknown"

    if failure_map and sent == 0:
        reasons = ", ".join(f"{wid}: {r}" for wid, r in failure_map.items())
        raise HomeAssistantError(f"All push notifications failed: {reasons}")

    if failure_map:
        reasons = ", ".join(f"{wid}: {r}" for wid, r in failure_map.items())
        _LOGGER.warning("Some push notifications failed: %s", reasons)

    return {"sent": sent, "failed": len(failure_map), "failures": failure_map}


# entry.data flag marking that the one-time "Connected watches" disable has
# run for this entry. See _disable_connected_watches_once.
_CONNECTED_WATCHES_DISABLED_FLAG = "connected_watches_default_disabled"


async def _disable_connected_watches_once(
    hass: HomeAssistant, entry: WristAssistantConfigEntry
) -> None:
    """One-time: disable the 'Connected watches' sensor for existing entries.

    `_attr_entity_registry_enabled_default = False` only takes effect when an
    entity is first registered, so users who installed before that default was
    set keep the entity enabled on upgrade. This flips it off once for them.

    Guarded by a flag in entry.data so it runs a single time: a user who
    deliberately re-enables the sensor afterward won't have it disabled again
    on the next restart. We only touch entities that are currently enabled
    (disabled_by is None), so a user who already hid it by hand is untouched
    either way."""
    if entry.data.get(_CONNECTED_WATCHES_DISABLED_FLAG):
        return

    ent_reg = er.async_get(hass)
    unique_id = f"wrist_assistant_{entry.entry_id}_active_watches"
    entity_id = ent_reg.async_get_entity_id("sensor", DOMAIN, unique_id)
    if entity_id is not None:
        reg_entry = ent_reg.async_get(entity_id)
        if reg_entry is not None and reg_entry.disabled_by is None:
            ent_reg.async_update_entity(
                entity_id, disabled_by=er.RegistryEntryDisabler.INTEGRATION
            )
            _LOGGER.debug("Disabled legacy-enabled 'Connected watches' sensor")

    # Mark done regardless of whether the entity existed — a fresh install
    # already gets it disabled by default, so we never need to run again.
    hass.config_entries.async_update_entry(
        entry, data={**entry.data, _CONNECTED_WATCHES_DISABLED_FLAG: True}
    )


# entry.data flag marking that the one-time statistics-unit cleanup has run.
_STATS_UNITS_DROPPED_FLAG = "stats_units_dropped"

# Unique-id suffixes of the MEASUREMENT sensors whose redundant unit
# ("watches"/"phones"/"entities") was dropped. Their long-term statistics
# metadata still carries the old unit, so the recorder raises a `units_changed`
# repair per sensor on upgrade. See _clear_stale_statistic_units_once.
_DROPPED_UNIT_SUFFIXES = (
    "_active_watches",
    "_watch_count",
    "_phone_count",
    "_monitored_entities",
    "_subscribed_entities",
)


async def _clear_stale_statistic_units_once(
    hass: HomeAssistant, entry: WristAssistantConfigEntry
) -> None:
    """One-time: realign statistics metadata after dropping redundant units.

    These count sensors carry `state_class = MEASUREMENT`, so the recorder
    minted long-term statistics tagged with their original unit. A later change
    dropped those units as redundant (the label already says "watches"), but the
    stored statistics metadata still holds the old unit — so on upgrade the
    recorder raises one `units_changed` repair per sensor ("the unit … changed
    to '' which can't be converted to … 'entities'").

    We rewrite each sensor's statistics metadata unit to None — exactly what the
    repair's recommended "update the historic values without converting" button
    does — so the recorder's hourly statistics validation stops re-reporting the
    mismatch. That validation only runs at xx:50, though, so to also clear any
    *already-raised* repair on this first restart we delete the issue outright;
    rewriting the metadata is what keeps it from coming back at the next pass.
    Done automatically here so existing users never see the repair. Guarded by an
    entry.data flag; fresh installs never had a unit, so this is a no-op for
    them."""
    if entry.data.get(_STATS_UNITS_DROPPED_FLAG):
        return
    # The metadata lives in the recorder DB; nothing to update without it. Skip
    # without setting the flag so we retry on the next start once it's loaded.
    if "recorder" not in hass.config.components:
        return

    # statistic_id == entity_id for sensor statistics. Resolve the affected
    # entities from the registry (per-watch ids vary, so match by suffix).
    ent_reg = er.async_get(hass)
    statistic_ids = [
        reg_entry.entity_id
        for reg_entry in er.async_entries_for_config_entry(ent_reg, entry.entry_id)
        if reg_entry.domain == "sensor"
        and reg_entry.unique_id.endswith(_DROPPED_UNIT_SUFFIXES)
    ]

    if statistic_ids:
        try:
            # Imported lazily: only needed on this one-time path, and keeps the
            # module importable if the recorder API ever shifts.
            from homeassistant.components.recorder.statistics import (
                async_update_statistics_metadata,
            )

            for statistic_id in statistic_ids:
                async_update_statistics_metadata(
                    hass, statistic_id, new_unit_of_measurement=None
                )
                # Clear any repair already raised for this sensor. The issue is
                # owned by the `sensor` recorder platform (not our DOMAIN), keyed
                # `units_changed_<statistic_id>`. Deleting a non-existent issue
                # is a no-op, so this is safe whether or not the repair showed.
                ir.async_delete_issue(
                    hass, "sensor", f"units_changed_{statistic_id}"
                )
        except Exception:  # noqa: BLE001 — cosmetic cleanup must never fail setup
            # The recorder API is stable, but should it ever change, a failed
            # statistics tidy-up should degrade to "user dismisses the repair by
            # hand", never to "the integration won't start".
            _LOGGER.warning(
                "Could not realign statistics units; the 'units changed' repair "
                "may need to be dismissed manually",
                exc_info=True,
            )
        else:
            _LOGGER.debug(
                "Realigned statistics metadata (dropped unit) for %d sensor(s): %s",
                len(statistic_ids),
                ", ".join(statistic_ids),
            )

    hass.config_entries.async_update_entry(
        entry, data={**entry.data, _STATS_UNITS_DROPPED_FLAG: True}
    )


async def async_setup_entry(hass: HomeAssistant, entry: WristAssistantConfigEntry) -> bool:
    """Set up Wrist Assistant from a config entry."""
    coordinator = DeltaCoordinator(hass)
    camera_stream_coordinator = CameraStreamCoordinator()
    notification_store = NotificationTokenStore(hass)
    await notification_store.async_load()
    widget_secret_store = WidgetSecretStore(hass)
    await widget_secret_store.async_load()
    stream_token_store = StreamTokenStore()
    batch_snapshot_token_store = BatchSnapshotTokenStore()
    notification_snapshot_store = NotificationSnapshotStore()
    snapshot_crop_store = SnapshotCropStore(hass)
    await snapshot_crop_store.async_load()
    snapshot_stream_store = SnapshotStreamStore(hass)
    await snapshot_stream_store.async_load()
    snapshot_aspect_store = SnapshotAspectStore(hass)
    await snapshot_aspect_store.async_load()
    batch_snapshot_settings_store = BatchSnapshotSettingsStore(hass)
    await batch_snapshot_settings_store.async_load()

    # Register server capabilities
    coordinator.register_capability("gzip")
    coordinator.register_capability("slim_payloads")
    coordinator.register_capability("camera_batch")
    # Progressive batch snapshot stream: one connection serves N cameras, each
    # JPEG flushed as it's ready (op=snapshots_open → /v2/snapshots/<token>).
    coordinator.register_capability("batch_camera_snapshots")
    coordinator.register_capability("camera_devices")
    coordinator.register_capability("push_notifications")
    # Watch transport over HMAC. The watch app uses this to confirm v2 ops
    # (full vocabulary on /v2/action, long-poll on /v2/delta, camera streams
    # via /v2/stream/<token> handshake) are available before sending
    # bearer-free requests.
    coordinator.register_capability("watch_hmac_v2")

    runtime_data = WristAssistantData(
        coordinator=coordinator,
        camera_stream_coordinator=camera_stream_coordinator,
        notification_store=notification_store,
        widget_secret_store=widget_secret_store,
        stream_token_store=stream_token_store,
        batch_snapshot_token_store=batch_snapshot_token_store,
        notification_snapshot_store=notification_snapshot_store,
        snapshot_crop_store=snapshot_crop_store,
        snapshot_stream_store=snapshot_stream_store,
        snapshot_aspect_store=snapshot_aspect_store,
        batch_snapshot_settings_store=batch_snapshot_settings_store,
    )
    entry.runtime_data = runtime_data
    hass.data[DOMAIN] = runtime_data

    if not hass.data.get(f"{DOMAIN}_views_registered"):
        # v2 transport: /v2/* HMAC for all watch traffic. WARegisterSecretView
        # is the one bearer-authed exception — iOS posts to it once to
        # provision the per-watch secret, and the secret never leaves iOS
        # keychain after that. WAVersionView is unauthenticated metadata for
        # the iOS banner.
        nonce_cache = WANonceCache(ttl_seconds=WA_HMAC_NONCE_TTL_SECONDS)
        hass.data[f"{DOMAIN}_nonce_cache"] = nonce_cache
        hass.http.register_view(WARegisterSecretView(hass))
        hass.http.register_view(WAVersionView(hass))
        hass.http.register_view(WAActionView(hass, nonce_cache))
        hass.http.register_view(WADeltaView(hass, nonce_cache))
        # Stream view auths via single-use token instead of HMAC headers —
        # the token is minted by op=stream_open and bound to (watch_id,
        # entity_id) for ~30 s, which is the lifetime an attacker has to
        # brute-force a 192-bit secret.
        hass.http.register_view(WAStreamView(hass))
        # Batch snapshot stream: auths via single-use token (minted by
        # op=snapshots_open), same model as WAStreamView — one connection
        # progressively delivers every camera on a page.
        hass.http.register_view(WABatchSnapshotView(hass))
        # Snapshot view auths via a multi-use TTL token (minted by
        # send_notification when a push carries a camera image) rather than HMAC
        # — the iOS content extension and watch long look fetch it with a plain
        # GET. See WANotificationSnapshotView / notification_snapshot.py.
        hass.http.register_view(WANotificationSnapshotView(hass))
        hass.http.register_view(WANotificationSnapshotLiveView(hass))

        # Legacy v1 transport: bearer-authed endpoints for app builds prior to
        # the v2 cutover. Kept alive so HACS can ship without breaking users
        # whose iOS/watch app hasn't updated yet. Delete this block (and the
        # five v1_*.py files) in the release that retires v1.
        hass.http.register_view(WatchUpdatesView(hass))
        hass.http.register_view(WatchSummaryView(hass))
        hass.http.register_view(WatchStatesBatchView(hass))
        hass.http.register_view(CameraStreamView(hass))
        hass.http.register_view(CameraViewportView(hass))
        hass.http.register_view(CameraBatchView(hass))
        hass.http.register_view(CameraSnapshotView(hass))
        hass.http.register_view(CameraDevicesView(hass))
        hass.http.register_view(NotificationRegisterView(hass))
        hass.http.register_view(AudioUploadView(hass))
        hass.http.register_view(MusicAssistantPlayersView(hass))
        hass.http.register_view(MusicAssistantQueueView(hass))
        hass.http.register_view(RemoteCommandView(hass))

        hass.data[f"{DOMAIN}_views_registered"] = True

    apns_client = await _create_apns_client(hass)
    if apns_client is None:
        runtime_data.apns_client = None
        _LOGGER.warning("APNs client unavailable")
    else:
        runtime_data.apns_client = apns_client
        _LOGGER.info("APNs client ready")

    @callback
    def _handle_stop(_event) -> None:
        coordinator.async_shutdown()
        camera_stream_coordinator.shutdown()
        stream_token_store.shutdown()
        batch_snapshot_token_store.shutdown()

    entry.async_on_unload(
        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, _handle_stop)
    )

    # Periodically drop idle watch sessions. _prune_sessions also runs on the
    # inbound delta path, but when every watch goes quiet simultaneously
    # nothing triggers it — and the "Connected watches" count stays stuck on
    # its last value (e.g. shows "1" long after the last poll). 60s tick gives
    # a worst-case stale window of SESSION_TTL + 60s before the count drops.
    @callback
    def _prune_idle_sessions(_now) -> None:
        # Must be a @callback (not a bare lambda): async_track_time_interval
        # infers the job type from the outermost callable, and an undecorated
        # function is treated as HassJobType.Executor — i.e. run in a worker
        # thread. _prune_sessions fires logbook events via hass.bus.async_fire,
        # which is loop-only, so running it off-loop trips HA's thread-safety
        # guard. Decorating keeps the whole prune path on the event loop.
        coordinator.async_prune_idle_sessions()

    entry.async_on_unload(
        async_track_time_interval(
            hass,
            _prune_idle_sessions,
            timedelta(seconds=60),
        )
    )

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    await _disable_connected_watches_once(hass, entry)
    await _clear_stale_statistic_units_once(hass, entry)

    await _install_bundled_blueprints(hass)

    async def _handle_force_resync(call: ServiceCall) -> None:
        coordinator.async_force_resync()

    hass.services.async_register(DOMAIN, SERVICE_FORCE_RESYNC, _handle_force_resync)
    entry.async_on_unload(
        lambda: hass.services.async_remove(DOMAIN, SERVICE_FORCE_RESYNC)
    )

    def _enrich_actions(actions: list[dict]) -> list[dict]:
        """Enrich action dicts with entity state for entity-driven watch buttons.

        The watch parses actions as entity actions (requiring entity_id + state).
        This looks up the current entity state and domain-relevant attributes
        from Home Assistant and adds them to each action dict.
        """
        _DOMAIN_ATTRS: dict[str, list[str]] = {
            "light": ["brightness"],
            "cover": ["current_position"],
            "fan": ["percentage"],
            "climate": ["temperature", "min_temp", "max_temp", "temperature_unit"],
        }
        enriched = []
        for action in actions:
            a = dict(action)
            entity_id = a.get("entity_id")
            if entity_id:
                state_obj = hass.states.get(entity_id)
                if state_obj:
                    a.setdefault("state", state_obj.state)
                    a.setdefault(
                        "friendly_name",
                        state_obj.attributes.get("friendly_name", entity_id),
                    )
                    domain = entity_id.split(".")[0]
                    attrs: dict = {}
                    for key in _DOMAIN_ATTRS.get(domain, []):
                        # HA keeps attribute keys present-but-None when a light
                        # is off (brightness=None, etc.). A JSON null in the
                        # custom payload breaks the iPhone→watch notification
                        # mirror path: iOS can't represent null when forwarding
                        # the notification's userInfo to the wrist, so it drops
                        # the whole `actions` blob and the watch shows no
                        # buttons. (Direct-to-watch delivery tolerates it, which
                        # is why only Fast/mirror mode lost buttons when off.)
                        # Only copy real values.
                        val = state_obj.attributes.get(key)
                        if val is not None:
                            attrs[key] = val
                    if attrs:
                        a.setdefault("attributes", attrs)
            enriched.append(a)
        return enriched

    async def _handle_send_notification(call: ServiceCall) -> ServiceResponse:
        data = hass.data[DOMAIN]
        target_raw = call.data.get("target")

        # Resolve device_id → watch_id
        target: str | None = None
        if target_raw:
            dev_reg = dr.async_get(hass)
            device = dev_reg.async_get(target_raw)
            if device is None:
                raise HomeAssistantError(f"Unknown device_id: {target_raw}")
            for ident_domain, identifier in device.identifiers:
                if ident_domain == DOMAIN:
                    target = identifier.replace("watch_", "")
                    break
            if target is None:
                raise HomeAssistantError(
                    f"Device '{target_raw}' is not a Wrist Assistant watch"
                )

        actions = call.data.get("actions")
        extra_data = dict(call.data.get("data") or {})
        for key in ("tag", "group", "priority"):
            if (val := call.data.get(key)) is not None:
                extra_data[key] = val

        return await _deliver_push(
            hass,
            data,
            title=call.data.get("title"),
            message=call.data.get("message"),
            image_source=call.data.get("image"),
            enriched_actions=_enrich_actions(actions) if actions else None,
            extra_data=extra_data,
            sound=call.data.get("sound"),
            push_type=call.data.get("push_type", "alert"),
            target_watch_ids=[target] if target else None,
            snapshot_width=call.data.get("snapshot_width"),
            snapshot_quality=call.data.get("snapshot_quality"),
        )

    hass.services.async_register(
        DOMAIN,
        SERVICE_SEND_NOTIFICATION,
        _handle_send_notification,
        schema=_SEND_NOTIFICATION_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    entry.async_on_unload(
        lambda: hass.services.async_remove(DOMAIN, SERVICE_SEND_NOTIFICATION)
    )

    return True


async def async_unload_entry(hass: HomeAssistant, entry: WristAssistantConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        data: WristAssistantData | None = hass.data.pop(DOMAIN, None)
        if data is not None:
            data.coordinator.async_shutdown()
            data.camera_stream_coordinator.shutdown()
            data.stream_token_store.shutdown()
            data.batch_snapshot_token_store.shutdown()
    return unload_ok


async def async_remove_config_entry_device(
    hass: HomeAssistant, entry: ConfigEntry, device_entry: dr.DeviceEntry
) -> bool:
    """Allow removal of a watch/iPhone device from the UI and tear down its state.

    Returning True alone makes HA drop the device from the registry, but the
    integration's secret_store and notification_store would still hold the
    pairing entry on disk. On next restart sensor.py's _check_new_secrets
    loop iterates `all_entries` and re-creates the device — so the deletion
    silently reverts after a reload. Strip the corresponding entries here so
    UI removals actually stick (and so leftover dev/test pairings can be
    cleaned up without editing storage files by hand).
    """
    domain_data: WristAssistantData | None = hass.data.get(DOMAIN)
    if domain_data is None:
        return True

    # Watch and iPhone devices use the (DOMAIN, "watch_<watch_id>") identifier
    # — see widget_secret_store._make_device_info. The service ("Delta
    # Coordinator") device uses (DOMAIN, entry.entry_id) instead; we leave
    # those untouched. Multiple identifiers are theoretically possible, so
    # iterate rather than assume one.
    for domain_str, ident in device_entry.identifiers:
        if domain_str != DOMAIN:
            continue
        if not ident.startswith("watch_"):
            continue
        watch_id = ident[len("watch_"):]
        domain_data.widget_secret_store.remove(watch_id)
        domain_data.notification_store.remove(watch_id)

    return True


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Wipe persisted device pairings when the integration is removed.

    Without this, deleting and re-adding the integration leaves the widget
    secret + notification token stores on disk, and on next load every old
    pairing re-creates its device entry — including ones for phones the user
    has long since uninstalled. The iOS app's foreground identity check
    surfaces a re-pair banner and rotates the secret in place, so a still-
    paired phone recovers without user-visible sign-in.
    """
    for key, version in (
        (WIDGET_SECRET_STORAGE_KEY, WIDGET_SECRET_STORAGE_VERSION),
        (NOTIFICATION_TOKEN_STORAGE_KEY, NOTIFICATION_TOKEN_STORAGE_VERSION),
    ):
        await Store(hass, version, key).async_remove()


async def _create_apns_client(hass: HomeAssistant) -> APNsClient | None:
    """Create push relay client for hosted APNs delivery."""
    from homeassistant.helpers.aiohttp_client import async_get_clientsession

    domain_data = hass.data.get(DOMAIN)
    if domain_data is None:
        _LOGGER.warning("Push relay unavailable because runtime data is missing")
        return None

    try:
        return APNsClient(
            relay_base_url="https://push.wrist-assistant.com",
            notification_store=domain_data.notification_store,
            http_session=async_get_clientsession(hass),
        )
    except Exception:
        _LOGGER.exception("Failed to create push relay client")
        return None


async def _install_bundled_blueprints(hass: HomeAssistant) -> None:
    """Copy bundled blueprint files into the HA blueprints directory.

    Runs the file copy in the executor to avoid blocking the event loop.
    Overwrites existing files so updates ship with new integration versions.

    After writing, resets the script domain's blueprint cache so the new file
    takes effect on this restart. Without it, a script that already uses the
    blueprint caches the old version earlier in startup (before this config
    entry sets up and overwrites the file), so the update wouldn't surface
    until a *second* restart.
    """
    src_dir = Path(__file__).parent / "blueprints" / "script"
    dest_dir = Path(hass.config.path("blueprints")) / "script" / DOMAIN

    if not src_dir.is_dir():
        return

    def _copy() -> list[str]:
        dest_dir.mkdir(parents=True, exist_ok=True)
        installed: list[str] = []
        for src_file in src_dir.iterdir():
            if src_file.suffix in (".yaml", ".yml") and src_file.is_file():
                dest_file = dest_dir / src_file.name
                dest_file.write_text(src_file.read_text())
                installed.append(src_file.name)
        return installed

    try:
        installed = await hass.async_add_executor_job(_copy)
        if installed:
            _LOGGER.debug("Installed bundled blueprints: %s", installed)
            # Drop the script domain's cached blueprints so the freshly written
            # file is re-read this session rather than on the next restart.
            # Mirrors what the script reload service does internally.
            try:
                from homeassistant.components.script import (
                    async_get_blueprints as _script_blueprints,
                )

                await _script_blueprints(hass).async_reset_cache()
            except Exception:  # noqa: BLE001 — cache reset is best-effort
                _LOGGER.debug("Could not reset script blueprint cache", exc_info=True)
    except Exception:
        _LOGGER.warning("Failed to install bundled blueprints", exc_info=True)


