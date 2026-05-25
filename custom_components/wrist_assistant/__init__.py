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
)
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.network import NoURLAvailableError, get_url
from homeassistant.helpers.storage import Store

from .api import DeltaCoordinator
from .apns_client import APNsClient
from .camera_stream import CameraStreamCoordinator, capture_notification_snapshot
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
from .snapshot_crop_store import SnapshotCropStore
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
from .wa_stream_tokens import StreamTokenStore
from .wa_v2_views import (
    WAActionView,
    WADeltaView,
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
        vol.Required("message"): cv.string,
        vol.Optional("title"): cv.string,
        vol.Optional("target"): cv.string,
        vol.Optional("image"): cv.string,
        vol.Optional("actions"): vol.All(
            cv.ensure_list, [_ACTION_SCHEMA], vol.Length(min=1, max=4)
        ),
        vol.Optional("data"): dict,
        vol.Optional("sound"): cv.string,
        vol.Optional("push_type", default="alert"): vol.In(["alert", "background"]),
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


async def _build_snapshot_url(
    hass: HomeAssistant,
    runtime_data: WristAssistantData,
    image_source: object,
) -> str | None:
    """Capture a camera snapshot and return a token-authed absolute URL.

    Returns None (and logs) on any failure — a missing image must never block
    the notification itself. Uses the external HA URL when configured so the
    device can fetch it away from home; users without remote access get an
    internal URL that only resolves on the LAN (documented PR1 limitation,
    lifted by the relay-hosted variant in a later PR).
    """
    if not isinstance(image_source, str) or not image_source:
        return None
    # Apply the user's saved per-camera framing (set via the iOS app). None when
    # this camera was never framed → full-frame capture.
    crop = runtime_data.snapshot_crop_store.get(image_source)
    jpeg = await capture_notification_snapshot(hass, image_source, viewport=crop)
    if not jpeg:
        return None
    token = runtime_data.notification_snapshot_store.put(jpeg)
    try:
        base = get_url(hass, prefer_external=True)
    except NoURLAvailableError:
        _LOGGER.warning(
            "No reachable Home Assistant URL; notification snapshot for %s omitted",
            image_source,
        )
        return None
    return f"{base}/api/wrist_assistant/notification/snapshot/{token}"


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


async def async_setup_entry(hass: HomeAssistant, entry: WristAssistantConfigEntry) -> bool:
    """Set up Wrist Assistant from a config entry."""
    coordinator = DeltaCoordinator(hass)
    camera_stream_coordinator = CameraStreamCoordinator()
    notification_store = NotificationTokenStore(hass)
    await notification_store.async_load()
    widget_secret_store = WidgetSecretStore(hass)
    await widget_secret_store.async_load()
    stream_token_store = StreamTokenStore()
    notification_snapshot_store = NotificationSnapshotStore()
    snapshot_crop_store = SnapshotCropStore(hass)
    await snapshot_crop_store.async_load()

    # Register server capabilities
    coordinator.register_capability("gzip")
    coordinator.register_capability("slim_payloads")
    coordinator.register_capability("camera_batch")
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
        notification_snapshot_store=notification_snapshot_store,
        snapshot_crop_store=snapshot_crop_store,
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
        # Snapshot view auths via a multi-use TTL token (minted by
        # send_notification when a push carries a camera image) rather than HMAC
        # — the iOS content extension and watch long look fetch it with a plain
        # GET. See WANotificationSnapshotView / notification_snapshot.py.
        hass.http.register_view(WANotificationSnapshotView(hass))

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

    def _handle_stop(_event) -> None:
        coordinator.async_shutdown()
        camera_stream_coordinator.shutdown()
        stream_token_store.shutdown()

    entry.async_on_unload(
        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, _handle_stop)
    )

    # Periodically drop idle watch sessions. _prune_sessions also runs on the
    # inbound delta path, but when every watch goes quiet simultaneously
    # nothing triggers it — and the "Connected watches" count stays stuck on
    # its last value (e.g. shows "1" long after the last poll). 60s tick gives
    # a worst-case stale window of SESSION_TTL + 60s before the count drops.
    entry.async_on_unload(
        async_track_time_interval(
            hass,
            lambda _now: coordinator.async_prune_idle_sessions(),
            timedelta(seconds=60),
        )
    )

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    await _disable_connected_watches_once(hass, entry)

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
        client = data.apns_client
        if client is None:
            raise HomeAssistantError(
                "APNs client failed to initialize. Check Home Assistant logs for details."
            )

        store = data.notification_store
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

        message = call.data["message"]
        title = call.data.get("title")
        actions = call.data.get("actions")
        extra_data = dict(call.data.get("data") or {})
        if actions:
            extra_data["actions"] = _enrich_actions(actions)

        # Camera snapshot: when the caller passes `image: "camera.x"`, capture
        # the frame now (freezing the moment the event fired) and embed a
        # token-authed URL the app fetches. A pre-built `data.snapshot_url` is
        # honored as-is and takes precedence.
        image_source = call.data.get("image")
        if image_source is not None and not extra_data.get("snapshot_url"):
            snapshot_url = await _build_snapshot_url(hass, data, image_source)
            if snapshot_url:
                extra_data["snapshot_url"] = snapshot_url

        # The content extension / watch long look only render our custom UI when
        # the push category is WA_ACTIONS — so a snapshot-only doorbell push
        # (no action rows) must still carry it, else it degrades to a plain
        # system notification with no image.
        category = "WA_ACTIONS" if (actions or extra_data.get("snapshot_url")) else None
        for key in ("tag", "group", "priority"):
            if (val := call.data.get(key)) is not None:
                extra_data[key] = val
        # Default interruption-level to "active": alerts + haptic when the user
        # is available, but respects Focus / Do Not Disturb / sleep. Automations
        # opt into "time-sensitive" / "critical" per-notification for urgent
        # alerts. Setting it explicitly here keeps the policy in HACS rather than
        # depending on the relay's default.
        extra_data.setdefault("priority", "active")
        # Strip any None values so a JSON null can't break the mirror path
        # (see _strip_none). Covers enriched attributes + user-supplied data.
        extra_data = _strip_none(extra_data)
        sound = call.data.get("sound")
        push_type = call.data.get("push_type", "alert")

        # Resolve targets to their full per-platform entry maps.
        if target:
            entries = store.get_entries(target)
            if not entries:
                raise HomeAssistantError(f"No registered push token for watch '{target}'")
            targets = {target: entries}
        else:
            targets = store.all_entries
            if not targets:
                raise HomeAssistantError("No watches have registered for push notifications")

        # Send to each target, routing per the watch's "delivery_mode" setting.
        # "mirror" (default): push to the companion iPhone token (iOS mirrors to
        # the wrist in ~1s; nothing when the phone is away). "direct": push to
        # the watch token (reliable when away; ~15s when the phone is present).
        # Never both — that double-buzzes.
        sent = 0
        failure_map: dict[str, str] = {}
        for watch_id, entries in targets.items():
            delivery_mode = store.get_watch_metadata(
                watch_id, "delivery_mode", "mirror"
            )
            tok_entry = _choose_token(entries, delivery_mode)
            _LOGGER.debug(
                "send_notification routing watch_id=%s platforms=%s mode=%s -> chosen=%s",
                watch_id,
                sorted(entries.keys()),
                delivery_mode,
                tok_entry.platform if tok_entry else None,
            )
            if tok_entry is None:
                continue
            # A mirrored (iOS) push with no sound delivers to the wrist silently
            # AND without a haptic — the user never perceives it (confirmed on
            # device; the haptic is gated on a sound being present). So when the
            # chosen token is the companion iPhone, force at least the default
            # alert sound. A genuinely-silent notification only makes sense on a
            # watch-direct push (which haptics natively regardless), so leave
            # that path's sound — possibly an intentional "" / None — untouched.
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


