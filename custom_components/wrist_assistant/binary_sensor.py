"""Binary sensors for Wrist Assistant per-watch sync status."""

from __future__ import annotations

from homeassistant.components.binary_sensor import BinarySensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, WristAssistantConfigEntry
from .notifications import NotificationTokenStore
from .widget_secret_store import (
    DEVICE_KIND_IPHONE,
    DEVICE_KIND_WATCH,
    WidgetSecretStore,
    build_device_info,
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: WristAssistantConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Wrist Assistant binary sensors."""
    secret_store: WidgetSecretStore = entry.runtime_data.widget_secret_store
    notification_store: NotificationTokenStore = entry.runtime_data.notification_store

    def _watch_via_device(watch_id: str) -> tuple[str, str]:
        # Always root watches under the service device. See sensor.py for the
        # rationale (HA's overview only shows top-level devices).
        return (DOMAIN, entry.entry_id)

    # Removed: the per-watch "Sync status" sensor. It conflated "entity list
    # synced" with connectivity (CONNECTIVITY device class → Connected/
    # Disconnected) and lingered "Connected" for the 5-min session TTL after the
    # watch app closed. The Last activity (timestamp) and Subscribed entities
    # sensors now cover the same ground more accurately. Sweep the stale registry
    # entries so they don't linger as unavailable for users on upgrade.
    _remove_stale_entities(hass, entry, suffix="_sync_status")

    # Push-token presence, one sensor per device. Lives in the secret store
    # loop because the device entity is created the moment its secret registers
    # — well before the first /v2/delta poll — and a watch can call
    # `op=notifications_register` without ever polling. The watch's own
    # (watchos) token sits on the watch device; the iPhone's mirror (ios) token
    # sits on the iPhone device (where it belongs), even though the token is
    # stored under the companion watch's id for routing.
    known_pushes: set[str] = set()

    @callback
    def _check_new_pushes() -> None:
        ent_reg = er.async_get(hass)
        new_entities: list[BinarySensorEntity] = []
        entries = secret_store.all_entries
        for device_id, secret_entry in entries.items():
            if device_id in known_pushes:
                sentinel = f"wrist_assistant_{device_id}_push_registered"
                if (
                    ent_reg.async_get_entity_id("binary_sensor", DOMAIN, sentinel)
                    is not None
                ):
                    continue
                known_pushes.discard(device_id)
            known_pushes.add(device_id)
            if secret_entry.device_kind == DEVICE_KIND_IPHONE:
                new_entities.append(
                    IPhonePushTokenRegisteredSensor(
                        secret_store,
                        notification_store,
                        entry,
                        device_id,
                        (DOMAIN, entry.entry_id),
                        hass=hass,
                    )
                )
            else:
                new_entities.append(
                    WatchPushTokenRegisteredSensor(
                        secret_store,
                        notification_store,
                        entry,
                        device_id,
                        _watch_via_device(device_id),
                        hass=hass,
                    )
                )
        for stale in list(known_pushes):
            if stale not in entries:
                known_pushes.discard(stale)
        if new_entities:
            async_add_entities(new_entities)

    _check_new_pushes()
    entry.async_on_unload(secret_store.async_add_listener(_check_new_pushes))


@callback
def _remove_stale_entities(
    hass: HomeAssistant, entry: ConfigEntry, *, suffix: str
) -> None:
    """Remove entity-registry entries whose unique_id ends with `suffix`.

    For entities the integration no longer creates: without this they linger as
    unavailable ("no longer provided by the integration") on upgrade until the
    user deletes them by hand. Idempotent — a no-op once the entries are gone.
    """
    ent_reg = er.async_get(hass)
    for reg_entry in er.async_entries_for_config_entry(ent_reg, entry.entry_id):
        if reg_entry.unique_id.endswith(suffix):
            ent_reg.async_remove(reg_entry.entity_id)


class WatchPushTokenRegisteredSensor(BinarySensorEntity):
    """Whether the paired watch has registered its own APNs token with HA.

    Scoped to the ``watchos`` (watch-direct) token specifically — the path used
    by Reliable delivery. "On" doesn't prove pushes deliver end-to-end (that
    depends on APNs reachability and the certificate), but it confirms the watch
    has been through at least one /v2/action notifications_register call. The
    companion iPhone's mirror token is reported separately by
    ``MirrorPushTokenRegisteredSensor``; the ``platforms`` attribute lists
    everything registered for this watch entry."""

    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    # No CONNECTIVITY device class: it renders on/off as "Connected/Disconnected",
    # which reads oddly for a "is a token registered" fact. The translation_key
    # maps the state to a plain "Yes/No" (and supplies the name). See strings.json.
    _attr_translation_key = "push_token_registered"
    _attr_icon = "mdi:bell-ring-outline"

    def __init__(
        self,
        secret_store: WidgetSecretStore,
        notification_store: NotificationTokenStore,
        entry: ConfigEntry,
        watch_id: str,
        via_device: tuple[str, str],
        *,
        hass: HomeAssistant | None = None,
    ) -> None:
        self._secret_store = secret_store
        self._notification_store = notification_store
        self._watch_id = watch_id
        self._attr_unique_id = f"wrist_assistant_{watch_id}_push_registered"
        self._attr_device_info = build_device_info(
            secret_store,
            watch_id,
            kind=DEVICE_KIND_WATCH,
            via_device=via_device,
            hass=hass,
        )

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            self._secret_store.async_add_listener(self._handle_update)
        )
        self.async_on_remove(
            self._notification_store.async_add_listener(self._handle_update)
        )

    @callback
    def _handle_update(self) -> None:
        self.async_write_ha_state()

    @property
    def available(self) -> bool:
        return self._secret_store.get(self._watch_id) is not None

    @property
    def is_on(self) -> bool:
        return (
            self._notification_store.get_entry(self._watch_id, platform="watchos")
            is not None
        )

    @property
    def extra_state_attributes(self) -> dict:
        return {
            "platforms": sorted(self._notification_store.get_entries(self._watch_id)),
            "delivery_mode": self._notification_store.get_watch_metadata(
                self._watch_id, "delivery_mode", "mirror"
            ),
        }


class IPhonePushTokenRegisteredSensor(BinarySensorEntity):
    """Whether HA holds this iPhone's APNs token for mirror delivery.

    Lives on the **iPhone** device — it's the iPhone's own push token. This is
    the gate for **Fast** delivery: HA pushes to the iPhone, which mirrors the
    alert to the wrist in ~1s. With this off, Fast silently falls back to the
    ~15s watch-direct path, so a user who picked Fast but sees this off is not
    actually getting fast notifications.

    The token is stored in the notification store under the *companion watch's*
    id (so `send_notification`, which targets a watch, can route to it), not the
    iPhone's. We bridge that here via `owner_iphone_id`: the sensor is on for
    this iPhone iff any watch it paired holds an `ios` token."""

    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    # See WatchPushTokenRegisteredSensor: plain "Yes/No" via translation_key
    # rather than the CONNECTIVITY "Connected/Disconnected" pair.
    _attr_translation_key = "push_token_registered"
    _attr_icon = "mdi:cellphone-message"

    def __init__(
        self,
        secret_store: WidgetSecretStore,
        notification_store: NotificationTokenStore,
        entry: ConfigEntry,
        iphone_id: str,
        via_device: tuple[str, str],
        *,
        hass: HomeAssistant | None = None,
    ) -> None:
        self._secret_store = secret_store
        self._notification_store = notification_store
        self._iphone_id = iphone_id
        self._attr_unique_id = f"wrist_assistant_{iphone_id}_push_registered"
        self._attr_device_info = build_device_info(
            secret_store,
            iphone_id,
            kind=DEVICE_KIND_IPHONE,
            via_device=via_device,
            hass=hass,
        )

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            self._secret_store.async_add_listener(self._handle_update)
        )
        self.async_on_remove(
            self._notification_store.async_add_listener(self._handle_update)
        )

    @callback
    def _handle_update(self) -> None:
        self.async_write_ha_state()

    @property
    def available(self) -> bool:
        return self._secret_store.get(self._iphone_id) is not None

    @property
    def is_on(self) -> bool:
        # The ios token lives under the companion watch's entry. Report on if any
        # watch this iPhone paired holds one.
        for watch_id, secret_entry in self._secret_store.all_entries.items():
            if (
                secret_entry.device_kind == DEVICE_KIND_WATCH
                and secret_entry.owner_iphone_id == self._iphone_id
                and self._notification_store.get_entry(watch_id, platform="ios")
                is not None
            ):
                return True
        return False
