"""Text entities for Wrist Assistant watch + iPhone naming."""

from __future__ import annotations

from homeassistant.components.text import TextEntity, TextMode
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .api import DeltaCoordinator
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
    """Set up Wrist Assistant text entities."""
    coordinator: DeltaCoordinator = entry.runtime_data.coordinator
    secret_store: WidgetSecretStore = entry.runtime_data.widget_secret_store

    def _watch_via_device(watch_id: str) -> tuple[str, str]:
        owner = secret_store.resolve_watch_owner_id(watch_id)
        if owner:
            return (DOMAIN, f"watch_{owner}")
        return (DOMAIN, entry.entry_id)

    # Watches: driven by the live poll coordinator — only watches that have
    # actually checked in get a rename entity. Mirrors how sensor.py spawns its
    # watch-session sensors.
    known_watches: set[str] = set()

    @callback
    def _check_new_watches() -> None:
        ent_reg = er.async_get(hass)
        new_entities: list[TextEntity] = []
        for watch_id in coordinator.real_sessions:
            if watch_id in known_watches:
                sentinel = f"wrist_assistant_{watch_id}_name"
                if ent_reg.async_get_entity_id("text", DOMAIN, sentinel) is not None:
                    continue
                known_watches.discard(watch_id)
            known_watches.add(watch_id)
            new_entities.append(
                DeviceNameText(
                    secret_store,
                    entry,
                    watch_id,
                    kind=DEVICE_KIND_WATCH,
                    via_device=_watch_via_device(watch_id),
                    hass=hass,
                )
            )
        if new_entities:
            async_add_entities(new_entities)

    _check_new_watches()
    entry.async_on_unload(
        coordinator.async_add_session_listener(_check_new_watches)
    )

    # iPhones: driven by the secret store. iPhones never poll, so this is the
    # only surface that creates their rename entity. Spawn the moment
    # `register_secret` lands.
    known_iphones: set[str] = set()

    @callback
    def _check_new_iphones() -> None:
        ent_reg = er.async_get(hass)
        new_entities: list[TextEntity] = []
        entries = secret_store.all_entries
        for watch_id, secret_entry in entries.items():
            if secret_entry.device_kind != DEVICE_KIND_IPHONE:
                continue
            if watch_id in known_iphones:
                sentinel = f"wrist_assistant_{watch_id}_name"
                if ent_reg.async_get_entity_id("text", DOMAIN, sentinel) is not None:
                    continue
                known_iphones.discard(watch_id)
            known_iphones.add(watch_id)
            new_entities.append(
                DeviceNameText(
                    secret_store,
                    entry,
                    watch_id,
                    kind=DEVICE_KIND_IPHONE,
                    via_device=(DOMAIN, entry.entry_id),
                    hass=hass,
                )
            )
        for stale in list(known_iphones):
            if stale not in entries:
                known_iphones.discard(stale)
        if new_entities:
            async_add_entities(new_entities)

    _check_new_iphones()
    entry.async_on_unload(secret_store.async_add_listener(_check_new_iphones))


class DeviceNameText(TextEntity):
    """Text entity to rename a paired watch or iPhone."""

    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.CONFIG
    _attr_name = "Name"
    _attr_mode = TextMode.TEXT
    _attr_native_max = 50
    _attr_icon = "mdi:rename"

    def __init__(
        self,
        secret_store: WidgetSecretStore,
        entry: ConfigEntry,
        watch_id: str,
        *,
        kind: str,
        via_device: tuple[str, str],
        hass: HomeAssistant | None = None,
    ) -> None:
        self._secret_store = secret_store
        self._watch_id = watch_id
        self._kind = kind
        self._short_id = watch_id[:8]
        self._default_prefix = "iPhone" if kind == DEVICE_KIND_IPHONE else "Watch"
        self._attr_unique_id = f"wrist_assistant_{watch_id}_name"
        self._attr_device_info = build_device_info(
            secret_store, watch_id, kind=kind, via_device=via_device, hass=hass
        )

    @property
    def native_value(self) -> str:
        # Show whatever name HA's UI currently displays: the user's manual
        # rename wins, then the device-registry name we wrote from DeviceInfo
        # (typically the marketing model name the app reported, e.g.
        # "iPhone 15 Pro"), then the secret-store entry as a pre-registry
        # race fallback, and finally the anonymous "iPhone <short_id>" form
        # for entries that predate device_name reporting entirely.
        dev_reg = dr.async_get(self.hass)
        device = dev_reg.async_get_device(
            identifiers={(DOMAIN, f"watch_{self._watch_id}")}
        )
        if device and device.name_by_user:
            return device.name_by_user
        if device and device.name:
            return device.name
        entry = self._secret_store.get(self._watch_id)
        if entry is not None and entry.device_name:
            return entry.device_name
        return f"{self._default_prefix} {self._short_id}"

    async def async_set_value(self, value: str) -> None:
        """Update the device name in the device registry."""
        dev_reg = dr.async_get(self.hass)
        device = dev_reg.async_get_device(
            identifiers={(DOMAIN, f"watch_{self._watch_id}")}
        )
        if device:
            dev_reg.async_update_device(device.id, name_by_user=value)
        self.async_write_ha_state()

    @property
    def available(self) -> bool:
        return True
