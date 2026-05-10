"""Wrist Assistant delta API integration."""

from __future__ import annotations

import logging
from pathlib import Path

import voluptuous as vol

from homeassistant.components import persistent_notification
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

from .api import DeltaCoordinator
from .apns_client import APNsClient
from .camera_stream import CameraStreamCoordinator
from .const import (
    DOMAIN,
    PLATFORMS,
    WA_HMAC_NONCE_TTL_SECONDS,
    WristAssistantConfigEntry,
    WristAssistantData,
)
from .notifications import NotificationTokenStore
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
    WARegisterSecretView,
    WAStreamView,
    WAVersionView,
)
from .widget_hmac import WANonceCache
from .widget_secret_store import WidgetSecretStore

_LOGGER = logging.getLogger(__name__)
SERVICE_FORCE_RESYNC = "force_resync"
SERVICE_SEND_NOTIFICATION = "send_notification"

_PAIRING_NOTIFICATION_ID_TEMPLATE = "wrist_assistant_pairing_%s"
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


async def async_setup_entry(hass: HomeAssistant, entry: WristAssistantConfigEntry) -> bool:
    """Set up Wrist Assistant from a config entry."""
    coordinator = DeltaCoordinator(hass)
    camera_stream_coordinator = CameraStreamCoordinator()
    notification_store = NotificationTokenStore(hass)
    await notification_store.async_load()
    widget_secret_store = WidgetSecretStore(hass)
    await widget_secret_store.async_load()
    stream_token_store = StreamTokenStore()

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

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    await _install_bundled_blueprints(hass)

    if not entry.data.get("initial_setup_done"):
        _show_pairing_notification(hass, entry)
        hass.config_entries.async_update_entry(
            entry, data={**entry.data, "initial_setup_done": True}
        )

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
                        if key in state_obj.attributes:
                            attrs[key] = state_obj.attributes[key]
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
        category = "WA_ACTIONS" if actions else None
        extra_data = dict(call.data.get("data") or {})
        if actions:
            extra_data["actions"] = _enrich_actions(actions)
        for key in ("tag", "group", "priority"):
            if (val := call.data.get(key)) is not None:
                extra_data[key] = val
        extra_data = extra_data or None
        sound = call.data.get("sound")
        push_type = call.data.get("push_type", "alert")

        # Resolve targets (need full entries for environment)
        if target:
            token_entry = store.get_entry(target)
            if token_entry is None:
                raise HomeAssistantError(f"No registered push token for watch '{target}'")
            targets = {target: token_entry}
        else:
            all_tokens = store.all_tokens
            if not all_tokens:
                raise HomeAssistantError("No watches have registered for push notifications")
            targets = all_tokens

        # Send to each target
        sent = 0
        failure_map: dict[str, str] = {}
        for watch_id, tok_entry in targets.items():
            success, reason, used_env = await client.send_push(
                watch_id=watch_id,
                device_token=tok_entry.device_token,
                title=title,
                body=message,
                category=category,
                data=extra_data,
                sound=sound,
                push_type=push_type,
                environment=tok_entry.environment,
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
                        "Removing dead token for watch_id=%s (reason=%s)",
                        watch_id,
                        reason,
                    )
                    store.remove(watch_id)
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
        persistent_notification.async_dismiss(
            hass, _PAIRING_NOTIFICATION_ID_TEMPLATE % entry.entry_id
        )
    return unload_ok


async def async_remove_config_entry_device(
    hass: HomeAssistant, entry: ConfigEntry, device_entry: dr.DeviceEntry
) -> bool:
    """Allow removal of a device from the UI."""
    return True


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
    except Exception:
        _LOGGER.warning("Failed to install bundled blueprints", exc_info=True)


def _show_pairing_notification(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Show first-run setup notification."""
    message = "Open the Wrist Assistant app to finish connecting your watch."
    persistent_notification.async_create(
        hass,
        message=message,
        title="Wrist Assistant setup ready",
        notification_id=_PAIRING_NOTIFICATION_ID_TEMPLATE % entry.entry_id,
    )
