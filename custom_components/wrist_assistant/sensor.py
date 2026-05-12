"""Diagnostic sensors for Wrist Assistant."""

from __future__ import annotations


from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory, UnitOfTime
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .api import DeltaCoordinator, MAX_EVENTS_BUFFER
from .const import DOMAIN, WristAssistantConfigEntry
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
    """Set up Wrist Assistant sensors."""
    coordinator: DeltaCoordinator = entry.runtime_data.coordinator
    secret_store: WidgetSecretStore = entry.runtime_data.widget_secret_store

    def _watch_via_device(watch_id: str) -> tuple[str, str]:
        owner = secret_store.resolve_watch_owner_id(watch_id)
        if owner:
            return (DOMAIN, f"watch_{owner}")
        return (DOMAIN, entry.entry_id)

    global_sensors: list[SensorEntity] = [
        ActiveWatchesSensor(coordinator, entry),
        MonitoredEntitiesSensor(coordinator, entry),
        EventsProcessedSensor(coordinator, entry),
        EventBufferUsageSensor(coordinator, entry),
        EventsPerMinuteSensor(coordinator, entry),
    ]
    async_add_entities(global_sensors)

    # Track watch_ids we've already created watch-session sensors for. Driven
    # off the live coordinator so the sensors only exist once the watch has
    # made at least one signed call.
    known_watches: set[str] = set()

    @callback
    def _check_new_watches() -> None:
        ent_reg = er.async_get(hass)
        new_entities: list[SensorEntity] = []
        for watch_id in coordinator.real_sessions:
            if watch_id in known_watches:
                # Verify entities still exist in registry (user may have deleted device)
                sentinel = f"wrist_assistant_{watch_id}_last_activity"
                if ent_reg.async_get_entity_id("sensor", DOMAIN, sentinel) is not None:
                    continue
                known_watches.discard(watch_id)
            known_watches.add(watch_id)
            via = _watch_via_device(watch_id)
            new_entities.extend([
                WatchLastActivitySensor(coordinator, entry, watch_id, via),
                WatchSubscribedEntitiesSensor(coordinator, entry, watch_id, via),
                WatchPollIntervalSensor(coordinator, entry, watch_id, via),
                WatchConnectedSinceSensor(coordinator, entry, watch_id, via),
            ])
        if new_entities:
            async_add_entities(new_entities)

    _check_new_watches()
    entry.async_on_unload(
        coordinator.async_add_session_listener(_check_new_watches)
    )

    # Provisioned-but-maybe-not-yet-polled devices. Driven off widget_secret_store
    # so an iPhone or freshly-paired watch shows up the moment iOS calls
    # /v2/register_secret, even before the watch's first /v2/delta hit.
    # iPhones live exclusively here (they never poll), so this is the *only*
    # surface that makes them visible in HA.
    known_secrets: set[str] = set()

    @callback
    def _check_new_secrets() -> None:
        ent_reg = er.async_get(hass)
        new_entities: list[SensorEntity] = []
        entries = secret_store.all_entries
        for watch_id, secret_entry in entries.items():
            if watch_id in known_secrets:
                kind_sentinel = (
                    f"wrist_assistant_{watch_id}_app_version"
                )
                if (
                    ent_reg.async_get_entity_id("sensor", DOMAIN, kind_sentinel)
                    is not None
                ):
                    continue
                known_secrets.discard(watch_id)
            known_secrets.add(watch_id)
            if secret_entry.device_kind == DEVICE_KIND_IPHONE:
                # iPhones root directly under the service device — they're the
                # parents in the device tree, not children of another iPhone.
                iphone_via = (DOMAIN, entry.entry_id)
                new_entities.extend([
                    IPhoneAppVersionSensor(secret_store, entry, watch_id, iphone_via),
                    IPhoneLastProvisionSensor(secret_store, entry, watch_id, iphone_via),
                ])
            else:
                # Watch app version lives on the same secret entry as the
                # iPhone's — register_secret carries it at pair time. Older
                # builds without this field render "unknown" until the next
                # provision call from an updated app.
                watch_via = _watch_via_device(watch_id)
                new_entities.append(
                    WatchAppVersionSensor(secret_store, entry, watch_id, watch_via)
                )
        # Drop tracking for entries that vanished (user unpaired).
        for stale in list(known_secrets):
            if stale not in entries:
                known_secrets.discard(stale)
        if new_entities:
            async_add_entities(new_entities)

    _check_new_secrets()
    entry.async_on_unload(secret_store.async_add_listener(_check_new_secrets))


# --- Global sensors ---


class _WristAssistantSensorBase(SensorEntity):
    """Base for global Wrist Assistant sensors."""

    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(
        self, coordinator: DeltaCoordinator, entry: ConfigEntry
    ) -> None:
        self._coordinator = coordinator
        self._entry = entry
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name="Wrist Assistant",
            manufacturer="Wrist Assistant",
            model="Delta Coordinator",
            entry_type=DeviceEntryType.SERVICE,
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


class ActiveWatchesSensor(_WristAssistantSensorBase):
    """Number of connected watch sessions."""

    _attr_name = "Active watches"
    _attr_icon = "mdi:watch"
    _attr_native_unit_of_measurement = "watches"
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, coordinator: DeltaCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"wrist_assistant_{entry.entry_id}_active_watches"

    @property
    def native_value(self) -> int:
        return len(self._coordinator.real_sessions)


class MonitoredEntitiesSensor(_WristAssistantSensorBase):
    """Total entity subscriptions across all watches."""

    _attr_name = "Monitored entities"
    _attr_icon = "mdi:eye"
    _attr_native_unit_of_measurement = "entities"
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, coordinator: DeltaCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"wrist_assistant_{entry.entry_id}_monitored_entities"

    @property
    def native_value(self) -> int:
        return sum(
            len(s.entities) for s in self._coordinator.real_sessions.values()
        )

    @property
    def extra_state_attributes(self) -> dict:
        dev_reg = dr.async_get(self.hass)
        per_watch: dict[str, int] = {}
        for wid, session in self._coordinator.real_sessions.items():
            device = dev_reg.async_get_device(
                identifiers={(DOMAIN, f"watch_{wid}")}
            )
            name = device.name if device else f"Watch {wid[:8]}"
            per_watch[name] = len(session.entities)
        return {"per_watch": per_watch}


class EventsProcessedSensor(_WristAssistantSensorBase):
    """Monotonic counter of state changes seen."""

    _attr_name = "Events processed"
    _attr_icon = "mdi:counter"
    _attr_state_class = SensorStateClass.TOTAL_INCREASING
    _attr_entity_registry_enabled_default = False

    def __init__(self, coordinator: DeltaCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"wrist_assistant_{entry.entry_id}_events_processed"

    @property
    def native_value(self) -> int:
        return self._coordinator._cursor


class EventBufferUsageSensor(_WristAssistantSensorBase):
    """Ring buffer saturation percentage."""

    _attr_name = "Event buffer usage"
    _attr_icon = "mdi:memory"
    _attr_native_unit_of_measurement = "%"
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_entity_registry_enabled_default = False

    def __init__(self, coordinator: DeltaCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"wrist_assistant_{entry.entry_id}_buffer_usage"

    @property
    def native_value(self) -> float:
        return round(len(self._coordinator._events) / MAX_EVENTS_BUFFER * 100, 1)


class EventsPerMinuteSensor(_WristAssistantSensorBase):
    """Rolling count of state change events in the last 60 seconds."""

    _attr_name = "Events per minute"
    _attr_icon = "mdi:chart-line"
    _attr_native_unit_of_measurement = "events/min"
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_should_poll = True
    _attr_entity_registry_enabled_default = False

    def __init__(self, coordinator: DeltaCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"wrist_assistant_{entry.entry_id}_events_per_minute"

    @property
    def native_value(self) -> float:
        return self._coordinator.events_per_minute


# --- Per-watch sensors ---


class _WatchSensorBase(SensorEntity):
    """Base for per-watch sensors."""

    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(
        self,
        coordinator: DeltaCoordinator,
        entry: ConfigEntry,
        watch_id: str,
        via_device: tuple[str, str],
    ) -> None:
        self._coordinator = coordinator
        self._entry = entry
        self._watch_id = watch_id
        self._attr_device_info = build_device_info(
            entry.runtime_data.widget_secret_store,
            watch_id,
            kind=DEVICE_KIND_WATCH,
            via_device=via_device,
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
        return self._watch_id in self._coordinator._sessions


class WatchLastActivitySensor(_WatchSensorBase):
    """Timestamp of last poll from this watch."""

    _attr_name = "Last activity"
    _attr_device_class = SensorDeviceClass.TIMESTAMP
    _attr_icon = "mdi:clock-outline"

    def __init__(
        self,
        coordinator: DeltaCoordinator,
        entry: ConfigEntry,
        watch_id: str,
        via_device: tuple[str, str],
    ) -> None:
        super().__init__(coordinator, entry, watch_id, via_device)
        self._attr_unique_id = f"wrist_assistant_{watch_id}_last_activity"
        self._cached_last_seen = None

    @property
    def available(self) -> bool:
        return True

    @callback
    def _handle_update(self) -> None:
        session = self._coordinator._sessions.get(self._watch_id)
        if session is not None:
            self._cached_last_seen = session.last_seen
        self.async_write_ha_state()

    @property
    def native_value(self):
        session = self._coordinator._sessions.get(self._watch_id)
        if session is not None:
            return session.last_seen
        return self._cached_last_seen


class WatchSubscribedEntitiesSensor(_WatchSensorBase):
    """Number of entities this watch monitors, with entity list in attributes."""

    _attr_name = "Subscribed entities"
    _attr_icon = "mdi:format-list-bulleted"
    _attr_native_unit_of_measurement = "entities"
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(
        self,
        coordinator: DeltaCoordinator,
        entry: ConfigEntry,
        watch_id: str,
        via_device: tuple[str, str],
    ) -> None:
        super().__init__(coordinator, entry, watch_id, via_device)
        self._attr_unique_id = f"wrist_assistant_{watch_id}_subscribed_entities"
        self._cached_count: int = 0
        self._cached_entities: dict[str, str] = {}

    @property
    def available(self) -> bool:
        return True

    @callback
    def _handle_update(self) -> None:
        session = self._coordinator._sessions.get(self._watch_id)
        if session is not None:
            self._cached_count = len(session.entities)
            entities: dict[str, str] = {}
            for eid in sorted(session.entities):
                state = self.hass.states.get(eid)
                entities[eid] = state.name if state else eid
            self._cached_entities = entities
        self.async_write_ha_state()

    @property
    def native_value(self) -> int:
        session = self._coordinator._sessions.get(self._watch_id)
        if session is not None:
            return len(session.entities)
        return self._cached_count

    @property
    def extra_state_attributes(self) -> dict:
        session = self._coordinator._sessions.get(self._watch_id)
        if session is not None:
            entities: dict[str, str] = {}
            for eid in sorted(session.entities):
                state = self.hass.states.get(eid)
                entities[eid] = state.name if state else eid
            return {"entities": entities}
        return {"entities": self._cached_entities}


class WatchPollIntervalSensor(_WatchSensorBase):
    """Time between consecutive polls from this watch."""

    _attr_name = "Poll interval"
    _attr_icon = "mdi:timer-outline"
    _attr_device_class = SensorDeviceClass.DURATION
    _attr_native_unit_of_measurement = UnitOfTime.SECONDS
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_suggested_display_precision = 1
    _attr_entity_registry_enabled_default = False

    def __init__(
        self,
        coordinator: DeltaCoordinator,
        entry: ConfigEntry,
        watch_id: str,
        via_device: tuple[str, str],
    ) -> None:
        super().__init__(coordinator, entry, watch_id, via_device)
        self._attr_unique_id = f"wrist_assistant_{watch_id}_poll_interval"

    @property
    def native_value(self) -> float | None:
        session = self._coordinator._sessions.get(self._watch_id)
        if session is None or session.last_poll_interval is None:
            return None
        return round(session.last_poll_interval.total_seconds(), 1)


class WatchConnectedSinceSensor(_WatchSensorBase):
    """Timestamp of when this watch first connected in the current session."""

    _attr_name = "Connected since"
    _attr_icon = "mdi:connection"
    _attr_entity_registry_enabled_default = False

    def __init__(
        self,
        coordinator: DeltaCoordinator,
        entry: ConfigEntry,
        watch_id: str,
        via_device: tuple[str, str],
    ) -> None:
        super().__init__(coordinator, entry, watch_id, via_device)
        self._attr_unique_id = f"wrist_assistant_{watch_id}_connected_since"

    @property
    def available(self) -> bool:
        return True

    @property
    def native_value(self) -> str | None:
        session = self._coordinator._sessions.get(self._watch_id)
        if session is None:
            return None
        return session.first_seen.isoformat()


# --- Secret-store-driven sensors (iPhone-as-device + Watch app version) ---
#
# These sensors read from `widget_secret_store` rather than the live
# coordinator. They appear the moment `register_secret` lands, even before
# the watch's first /v2/delta poll. For the iPhone they're the only sensors
# at all — the iPhone never polls.


class _SecretStoreSensorBase(SensorEntity):
    """Base for sensors driven by the widget secret store."""

    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(
        self,
        secret_store: WidgetSecretStore,
        entry: ConfigEntry,
        watch_id: str,
        via_device: tuple[str, str],
        *,
        kind: str,
    ) -> None:
        self._secret_store = secret_store
        self._entry = entry
        self._watch_id = watch_id
        self._attr_device_info = build_device_info(
            secret_store, watch_id, kind=kind, via_device=via_device
        )

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            self._secret_store.async_add_listener(self._handle_update)
        )

    @callback
    def _handle_update(self) -> None:
        self.async_write_ha_state()

    @property
    def available(self) -> bool:
        return self._secret_store.get(self._watch_id) is not None


class IPhoneAppVersionSensor(_SecretStoreSensorBase):
    """Marketing version of the iOS app on the paired iPhone."""

    _attr_name = "App version"
    _attr_icon = "mdi:cellphone-cog"

    def __init__(
        self,
        secret_store: WidgetSecretStore,
        entry: ConfigEntry,
        watch_id: str,
        via_device: tuple[str, str],
    ) -> None:
        super().__init__(secret_store, entry, watch_id, via_device, kind=DEVICE_KIND_IPHONE)
        self._attr_unique_id = f"wrist_assistant_{watch_id}_app_version"

    @property
    def native_value(self) -> str | None:
        secret = self._secret_store.get(self._watch_id)
        return secret.app_version if secret is not None else None


class IPhoneLastProvisionSensor(_SecretStoreSensorBase):
    """Timestamp of the most recent register_secret call from this iPhone."""

    _attr_name = "Last provision"
    _attr_device_class = SensorDeviceClass.TIMESTAMP
    _attr_icon = "mdi:cellphone-key"

    def __init__(
        self,
        secret_store: WidgetSecretStore,
        entry: ConfigEntry,
        watch_id: str,
        via_device: tuple[str, str],
    ) -> None:
        super().__init__(secret_store, entry, watch_id, via_device, kind=DEVICE_KIND_IPHONE)
        self._attr_unique_id = f"wrist_assistant_{watch_id}_last_provision"

    @property
    def native_value(self):
        secret = self._secret_store.get(self._watch_id)
        return secret.last_provision if secret is not None else None


class WatchAppVersionSensor(_SecretStoreSensorBase):
    """Marketing version of the watchOS app on the paired watch.

    Read from the secret store rather than per-request headers — the watch's
    self-provision call carries the version, so the value is fresh after every
    app launch without a wire-protocol change."""

    _attr_name = "App version"
    _attr_icon = "mdi:watch-export"

    def __init__(
        self,
        secret_store: WidgetSecretStore,
        entry: ConfigEntry,
        watch_id: str,
        via_device: tuple[str, str],
    ) -> None:
        super().__init__(secret_store, entry, watch_id, via_device, kind=DEVICE_KIND_WATCH)
        self._attr_unique_id = f"wrist_assistant_{watch_id}_app_version"

    @property
    def native_value(self) -> str | None:
        secret = self._secret_store.get(self._watch_id)
        return secret.app_version if secret is not None else None


