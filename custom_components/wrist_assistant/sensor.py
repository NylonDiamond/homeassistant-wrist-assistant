"""Diagnostic sensors for Wrist Assistant."""

from __future__ import annotations

from datetime import datetime

from homeassistant.components.sensor import (
    RestoreSensor,
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
    """Set up Wrist Assistant sensors."""
    coordinator: DeltaCoordinator = entry.runtime_data.coordinator
    secret_store: WidgetSecretStore = entry.runtime_data.widget_secret_store
    notification_store: NotificationTokenStore = entry.runtime_data.notification_store

    def _watch_via_device(watch_id: str) -> tuple[str, str]:
        # Watches root directly under the service device so they appear
        # alongside iPhones in the integration's "Connected devices" overview.
        # HA only surfaces top-level devices there — when via_device pointed
        # at the owning iPhone (`owner_iphone_id`), the watch was nested under
        # its parent and hidden from the panel. The owner_iphone_id field is
        # still persisted on WidgetSecretEntry for diagnostics.
        return (DOMAIN, entry.entry_id)

    global_sensors: list[SensorEntity] = [
        ConnectedWatchesSensor(coordinator, entry),
        WatchCountSensor(coordinator, entry),
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
                sentinel = f"wrist_assistant_{watch_id}_poll_interval"
                if ent_reg.async_get_entity_id("sensor", DOMAIN, sentinel) is not None:
                    continue
                known_watches.discard(watch_id)
            known_watches.add(watch_id)
            via = _watch_via_device(watch_id)
            # Poll interval and connected-since are intrinsically about the
            # *current* live session, so they stay coordinator-driven. Last
            # activity and subscribed entities persist across restarts/idle and
            # are created off the secret store below instead.
            new_entities.extend([
                WatchPollIntervalSensor(coordinator, entry, watch_id, via, hass=hass),
                WatchConnectedSinceSensor(coordinator, entry, watch_id, via, hass=hass),
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
                    IPhoneAppVersionSensor(secret_store, entry, watch_id, iphone_via, hass=hass),
                    IPhoneLastProvisionSensor(secret_store, entry, watch_id, iphone_via, hass=hass),
                ])
            else:
                # Watch app version lives on the same secret entry as the
                # iPhone's — register_secret carries it at pair time. Older
                # builds without this field render "unknown" until the next
                # provision call from an updated app.
                watch_via = _watch_via_device(watch_id)
                new_entities.extend([
                    WatchAppVersionSensor(secret_store, entry, watch_id, watch_via, hass=hass),
                    WatchLastProvisionSensor(secret_store, entry, watch_id, watch_via, hass=hass),
                    WatchDeliveryModeSensor(
                        secret_store, notification_store, entry, watch_id, watch_via, hass=hass
                    ),
                    # Persistent (RestoreSensor) — created here off the secret
                    # store so they exist for any provisioned watch, not only one
                    # with a live polling session, and survive restarts. They
                    # read the live coordinator session when present.
                    WatchLastActivitySensor(
                        coordinator, secret_store, entry, watch_id, watch_via, hass=hass
                    ),
                    WatchSubscribedEntitiesSensor(
                        coordinator, secret_store, entry, watch_id, watch_via, hass=hass
                    ),
                ])
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


class ConnectedWatchesSensor(_WristAssistantSensorBase):
    """Number of watches with a live polling session right now."""

    _attr_name = "Connected watches"
    _attr_icon = "mdi:watch"
    _attr_native_unit_of_measurement = "watches"
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, coordinator: DeltaCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry)
        # unique_id keeps the historical "active_watches" slug so existing
        # entity_ids, dashboards, and automations continue to resolve after
        # the friendly-name rename.
        self._attr_unique_id = f"wrist_assistant_{entry.entry_id}_active_watches"

    @property
    def native_value(self) -> int:
        return len(self._coordinator.real_sessions)


class WatchCountSensor(_WristAssistantSensorBase):
    """Total paired watches (v1 + v2), connected or not.

    Counted via the HA device registry rather than the widget secret store:
    v1 watches use bearer auth and never call register_secret, so they have
    no entry in widget_secret_store. The device registry, on the other hand,
    sees every watch the moment it polls (regardless of protocol), so it's
    the only source that covers both transports uniformly."""

    _attr_name = "Watch count"
    _attr_icon = "mdi:watch-variant"
    _attr_native_unit_of_measurement = "watches"
    _attr_state_class = SensorStateClass.MEASUREMENT

    # Distinguishes watch devices from iPhones in this config entry. Both kinds
    # share the `(DOMAIN, watch_<id>)` identifier prefix (legacy naming), so
    # the model field — set by build_device_info — is the reliable selector.
    _WATCH_MODEL = "Apple Watch"

    def __init__(self, coordinator: DeltaCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"wrist_assistant_{entry.entry_id}_watch_count"

    async def async_added_to_hass(self) -> None:
        # Bypass the base class's coordinator-session subscription: the
        # registry event already fires on device create/update/remove, which
        # is the complete set of edges that move this count.
        self.async_on_remove(
            self.hass.bus.async_listen(
                dr.EVENT_DEVICE_REGISTRY_UPDATED, self._handle_registry_event
            )
        )

    @callback
    def _handle_registry_event(self, _event) -> None:
        self.async_write_ha_state()

    @property
    def native_value(self) -> int:
        dev_reg = dr.async_get(self.hass)
        return sum(
            1
            for device in dr.async_entries_for_config_entry(
                dev_reg, self._entry.entry_id
            )
            if device.model == self._WATCH_MODEL
        )


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
        *,
        hass: HomeAssistant | None = None,
    ) -> None:
        self._coordinator = coordinator
        self._entry = entry
        self._watch_id = watch_id
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
        return self._watch_id in self._coordinator._sessions


class WatchLastActivitySensor(RestoreSensor):
    """Timestamp of last poll from this watch — persists across restart/idle.

    Created off the secret store so it exists for any provisioned watch, not
    only one with a live polling session. Reads the live coordinator session
    when present; otherwise falls back to the value restored at startup, so the
    row shows the last-known time instead of going Unavailable once the watch is
    idle past the session TTL or HA was restarted."""

    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_name = "Last activity"
    _attr_device_class = SensorDeviceClass.TIMESTAMP
    _attr_icon = "mdi:clock-outline"

    def __init__(
        self,
        coordinator: DeltaCoordinator,
        secret_store: WidgetSecretStore,
        entry: ConfigEntry,
        watch_id: str,
        via_device: tuple[str, str],
        *,
        hass: HomeAssistant | None = None,
    ) -> None:
        self._coordinator = coordinator
        self._secret_store = secret_store
        self._watch_id = watch_id
        # Running last-known value. Seeded from restore at startup, refreshed on
        # every live poll, and held when the session prunes (5-min TTL) so the
        # row doesn't collapse to "Unknown" the moment the watch goes idle.
        self._last_value: datetime | None = None
        self._attr_unique_id = f"wrist_assistant_{watch_id}_last_activity"
        self._attr_device_info = build_device_info(
            secret_store, watch_id, kind=DEVICE_KIND_WATCH, via_device=via_device, hass=hass
        )

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        last = await self.async_get_last_sensor_data()
        if last is not None and isinstance(last.native_value, datetime):
            self._last_value = last.native_value
        self.async_on_remove(
            self._coordinator.async_add_session_listener(self._handle_update)
        )

    @callback
    def _handle_update(self) -> None:
        session = self._coordinator._sessions.get(self._watch_id)
        if session is not None:
            self._last_value = session.last_seen
        self.async_write_ha_state()

    @property
    def available(self) -> bool:
        return True

    @property
    def native_value(self) -> datetime | None:
        session = self._coordinator._sessions.get(self._watch_id)
        if session is not None:
            return session.last_seen
        return self._last_value


class WatchSubscribedEntitiesSensor(RestoreSensor):
    """Entities this watch monitors (count + list) — persists across restart/idle.

    Like Last activity, created off the secret store and restored at startup so
    the last-known subscription set survives an idle watch or an HA restart
    rather than going Unavailable. The live coordinator session takes over the
    moment the watch polls again."""

    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_name = "Subscribed entities"
    _attr_icon = "mdi:format-list-bulleted"
    _attr_native_unit_of_measurement = "entities"
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(
        self,
        coordinator: DeltaCoordinator,
        secret_store: WidgetSecretStore,
        entry: ConfigEntry,
        watch_id: str,
        via_device: tuple[str, str],
        *,
        hass: HomeAssistant | None = None,
    ) -> None:
        self._coordinator = coordinator
        self._secret_store = secret_store
        self._watch_id = watch_id
        # Running last-known subscription set. Seeded from restore, refreshed on
        # every live poll, held when the session prunes so the row doesn't drop
        # to "0 entities" the moment the watch goes idle.
        self._last_count: int = 0
        self._last_entities: dict[str, str] = {}
        self._attr_unique_id = f"wrist_assistant_{watch_id}_subscribed_entities"
        self._attr_device_info = build_device_info(
            secret_store, watch_id, kind=DEVICE_KIND_WATCH, via_device=via_device, hass=hass
        )

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        data = await self.async_get_last_sensor_data()
        if data is not None and isinstance(data.native_value, (int, float)):
            self._last_count = int(data.native_value)
        # The entity list lives in attributes, which RestoreSensor doesn't carry
        # — pull it from the last full state.
        state = await self.async_get_last_state()
        if state is not None and isinstance(state.attributes.get("entities"), dict):
            self._last_entities = state.attributes["entities"]
        self.async_on_remove(
            self._coordinator.async_add_session_listener(self._handle_update)
        )

    @callback
    def _handle_update(self) -> None:
        live = self._live_entities()
        if live is not None:
            self._last_entities = live
            self._last_count = len(live)
        self.async_write_ha_state()

    @property
    def available(self) -> bool:
        return True

    def _live_entities(self) -> dict[str, str] | None:
        session = self._coordinator._sessions.get(self._watch_id)
        if session is None:
            return None
        entities: dict[str, str] = {}
        for eid in sorted(session.entities):
            state = self.hass.states.get(eid)
            entities[eid] = state.name if state else eid
        return entities

    @property
    def native_value(self) -> int:
        live = self._live_entities()
        return len(live) if live is not None else self._last_count

    @property
    def extra_state_attributes(self) -> dict:
        live = self._live_entities()
        return {"entities": live if live is not None else self._last_entities}


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
        *,
        hass: HomeAssistant | None = None,
    ) -> None:
        super().__init__(coordinator, entry, watch_id, via_device, hass=hass)
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
        *,
        hass: HomeAssistant | None = None,
    ) -> None:
        super().__init__(coordinator, entry, watch_id, via_device, hass=hass)
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
        hass: HomeAssistant | None = None,
    ) -> None:
        self._secret_store = secret_store
        self._entry = entry
        self._watch_id = watch_id
        self._attr_device_info = build_device_info(
            secret_store, watch_id, kind=kind, via_device=via_device, hass=hass
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
        *,
        hass: HomeAssistant | None = None,
    ) -> None:
        super().__init__(
            secret_store, entry, watch_id, via_device, kind=DEVICE_KIND_IPHONE, hass=hass
        )
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
        *,
        hass: HomeAssistant | None = None,
    ) -> None:
        super().__init__(
            secret_store, entry, watch_id, via_device, kind=DEVICE_KIND_IPHONE, hass=hass
        )
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
        *,
        hass: HomeAssistant | None = None,
    ) -> None:
        super().__init__(
            secret_store, entry, watch_id, via_device, kind=DEVICE_KIND_WATCH, hass=hass
        )
        self._attr_unique_id = f"wrist_assistant_{watch_id}_app_version"

    @property
    def native_value(self) -> str | None:
        secret = self._secret_store.get(self._watch_id)
        return secret.app_version if secret is not None else None


class WatchLastProvisionSensor(_SecretStoreSensorBase):
    """Timestamp of the most recent register_secret call from this watch.

    Surfaces the stale-keychain case: the watch device row still exists in HA
    (its old secret is on disk) but the watch's local keychain has been wiped,
    so the iOS app shows the "missing integration key" banner. While that's
    happening, every other sensor on this device still reads normally — only
    `last_provision` ages while the user keeps using the watch. A timestamp far
    in the past on a watch that's otherwise active is the visible smoking gun.

    v1-only watches never reach this code path: v1 uses bearer auth and never
    calls register_secret, so they have no entry in widget_secret_store and the
    spawn loop skips them entirely."""

    _attr_name = "Last provision"
    _attr_device_class = SensorDeviceClass.TIMESTAMP
    _attr_icon = "mdi:watch-import"

    def __init__(
        self,
        secret_store: WidgetSecretStore,
        entry: ConfigEntry,
        watch_id: str,
        via_device: tuple[str, str],
        *,
        hass: HomeAssistant | None = None,
    ) -> None:
        super().__init__(
            secret_store, entry, watch_id, via_device, kind=DEVICE_KIND_WATCH, hass=hass
        )
        self._attr_unique_id = f"wrist_assistant_{watch_id}_last_provision"

    @property
    def native_value(self):
        secret = self._secret_store.get(self._watch_id)
        return secret.last_provision if secret is not None else None


class WatchDeliveryModeSensor(_SecretStoreSensorBase):
    """Which notification delivery mode this watch is set to.

    "Fast" routes pushes through the companion iPhone, which mirrors the alert
    to the wrist in ~1s; "Reliable" pushes the watch directly — it works without
    the iPhone nearby but is ~15s slower when the iPhone *is* present. Mirrors
    the per-user Delivery setting in the app, stored as the ``delivery_mode``
    watch metadata (``mirror``/``direct``); defaults to Fast when unset, matching
    the app default."""

    _attr_name = "Notification mode"
    _attr_icon = "mdi:bell-cog"
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = ["Fast", "Reliable"]

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
        super().__init__(
            secret_store, entry, watch_id, via_device, kind=DEVICE_KIND_WATCH, hass=hass
        )
        self._notification_store = notification_store
        self._attr_unique_id = f"wrist_assistant_{watch_id}_delivery_mode"

    async def async_added_to_hass(self) -> None:
        # Keep the secret-store subscription (drives availability) and also react
        # to delivery_mode changes the app pushes via set_watch_metadata.
        await super().async_added_to_hass()
        self.async_on_remove(
            self._notification_store.async_add_listener(self._handle_update)
        )

    @property
    def native_value(self) -> str:
        mode = self._notification_store.get_watch_metadata(
            self._watch_id, "delivery_mode", "mirror"
        )
        return "Reliable" if mode == "direct" else "Fast"


