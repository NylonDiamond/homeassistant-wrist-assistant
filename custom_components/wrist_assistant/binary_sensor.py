"""Binary sensors for Wrist Assistant per-watch sync status."""

from __future__ import annotations

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .api import DeltaCoordinator
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
    coordinator: DeltaCoordinator = entry.runtime_data.coordinator
    secret_store: WidgetSecretStore = entry.runtime_data.widget_secret_store
    notification_store: NotificationTokenStore = entry.runtime_data.notification_store

    def _watch_via_device(watch_id: str) -> tuple[str, str]:
        # Always root watches under the service device. See sensor.py for the
        # rationale (HA's overview only shows top-level devices).
        return (DOMAIN, entry.entry_id)

    known_watches: set[str] = set()

    @callback
    def _check_new_watches() -> None:
        ent_reg = er.async_get(hass)
        new_entities: list[BinarySensorEntity] = []
        for watch_id in coordinator.real_sessions:
            if watch_id in known_watches:
                sentinel = f"wrist_assistant_{watch_id}_sync_status"
                if ent_reg.async_get_entity_id("binary_sensor", DOMAIN, sentinel) is not None:
                    continue
                known_watches.discard(watch_id)
            known_watches.add(watch_id)
            new_entities.append(
                WatchSyncStatusSensor(
                    coordinator, entry, watch_id, _watch_via_device(watch_id), hass=hass
                )
            )
        if new_entities:
            async_add_entities(new_entities)

    _check_new_watches()
    entry.async_on_unload(
        coordinator.async_add_session_listener(_check_new_watches)
    )

    # Watch push-token presence. Lives in the secret store loop because the
    # watch device entity is created the moment its secret registers — well
    # before the first /v2/delta poll — and a watch can call
    # `op=notifications_register` without ever polling.
    known_watch_pushes: set[str] = set()

    @callback
    def _check_new_watch_pushes() -> None:
        ent_reg = er.async_get(hass)
        new_entities: list[BinarySensorEntity] = []
        entries = secret_store.all_entries
        for watch_id, secret_entry in entries.items():
            if secret_entry.device_kind == DEVICE_KIND_IPHONE:
                continue
            if watch_id in known_watch_pushes:
                sentinel = f"wrist_assistant_{watch_id}_push_registered"
                if (
                    ent_reg.async_get_entity_id("binary_sensor", DOMAIN, sentinel)
                    is not None
                ):
                    continue
                known_watch_pushes.discard(watch_id)
            known_watch_pushes.add(watch_id)
            new_entities.append(
                WatchPushTokenRegisteredSensor(
                    secret_store,
                    notification_store,
                    entry,
                    watch_id,
                    _watch_via_device(watch_id),
                    hass=hass,
                )
            )
        for stale in list(known_watch_pushes):
            if stale not in entries:
                known_watch_pushes.discard(stale)
        if new_entities:
            async_add_entities(new_entities)

    _check_new_watch_pushes()
    entry.async_on_unload(secret_store.async_add_listener(_check_new_watch_pushes))


class WatchSyncStatusSensor(BinarySensorEntity):
    """Binary sensor showing whether a watch has synced its entity list."""

    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_name = "Sync status"
    _attr_device_class = BinarySensorDeviceClass.CONNECTIVITY
    _attr_icon = "mdi:sync"

    def __init__(
        self,
        coordinator: DeltaCoordinator,
        entry: ConfigEntry,
        watch_id: str,
        via_device: tuple[str, str],
        *,
        hass: HomeAssistant | None = None,
    ) -> None:
        self._coordinator = coordinator
        self._watch_id = watch_id
        self._attr_unique_id = f"wrist_assistant_{watch_id}_sync_status"
        self._attr_device_info = build_device_info(
            entry.runtime_data.widget_secret_store,
            watch_id,
            kind=DEVICE_KIND_WATCH,
            via_device=via_device,
            hass=hass,
        )

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            self._coordinator.async_add_session_listener(
                self._handle_update
            )
        )

    @callback
    def _handle_update(self) -> None:
        self.async_write_ha_state()

    @property
    def available(self) -> bool:
        return True

    @property
    def is_on(self) -> bool:
        session = self._coordinator._sessions.get(self._watch_id)
        if session is None:
            return False
        return session.entities_synced

    @property
    def extra_state_attributes(self) -> dict:
        session = self._coordinator._sessions.get(self._watch_id)
        if session is None:
            return {"config_hash": None}
        return {"config_hash": session.config_hash}


class WatchPushTokenRegisteredSensor(BinarySensorEntity):
    """Whether the paired watch has registered an APNs token with HA.

    "On" doesn't prove pushes will actually deliver end-to-end — that depends
    on APNs reachability and the certificate — but it confirms the watch has
    been through at least one /v2/action notifications_register call, which is
    the first thing that has to work for HA-originated notifications."""

    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_name = "Push token registered"
    _attr_device_class = BinarySensorDeviceClass.CONNECTIVITY
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
        return self._notification_store.get_entry(self._watch_id) is not None
