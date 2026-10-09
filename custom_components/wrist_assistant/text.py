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


def name_unique_id(device_id: str) -> str:
    """The unique id of a device's Name entity, the same for a watch and an
    iPhone."""
    return f"wrist_assistant_{device_id}_name"


async def async_setup_entry(
    hass: HomeAssistant,
    entry: WristAssistantConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Wrist Assistant text entities."""
    coordinator: DeltaCoordinator = entry.runtime_data.coordinator
    secret_store: WidgetSecretStore = entry.runtime_data.widget_secret_store

    def _watch_via_device(watch_id: str) -> tuple[str, str]:
        # Watches root directly under the service device so they're visible in
        # the integration's "Connected devices" overview alongside iPhones —
        # HA's overview only shows top-level devices, and nesting watches under
        # their owning iPhone (via `owner_iphone_id`) hides them from that
        # list. The owner_iphone_id field is still persisted for diagnostics.
        return (DOMAIN, entry.entry_id)

    # Every Name entity this setup has added, by device id, shared by the
    # watch and iPhone paths below so one device never gets two: both would
    # use the same unique id, and Home Assistant refuses the second with an
    # error on every start. The value is whether the entity registry has
    # shown the entity yet; until it has, Home Assistant is still adding it.
    named: dict[str, bool] = {}

    @callback
    def _needs_name(ent_reg: er.EntityRegistry, device_id: str) -> bool:
        """Whether ``device_id`` needs a Name entity added now, claiming it
        when it does."""
        registered = (
            ent_reg.async_get_entity_id("text", DOMAIN, name_unique_id(device_id)) is not None
        )
        if device_id in named:
            if registered:
                named[device_id] = True
                return False
            if not named[device_id]:
                # Added, and not in the registry yet: still being added.
                return False
            # It was registered and has gone since: the user deleted it.
        named[device_id] = False
        return True

    # Watches: driven by the live poll coordinator, so only watches that have
    # actually checked in get a rename entity. Mirrors how sensor.py spawns
    # its watch-session sensors. Only a watch: a phone that polls the delta
    # endpoint has a session too, and gets its Name from the iPhone path.
    @callback
    def _check_new_watches() -> None:
        ent_reg = er.async_get(hass)
        new_entities: list[TextEntity] = []
        for watch_id in coordinator.real_sessions:
            # Only a device with a secret exists; a session that outlived its
            # removal must not re-create the device (see sensor.py).
            secret_entry = secret_store.get(watch_id)
            if secret_entry is None:
                named.pop(watch_id, None)
                continue
            if secret_entry.device_kind != DEVICE_KIND_WATCH:
                continue
            if not _needs_name(ent_reg, watch_id):
                continue
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

    # iPhones: driven by the secret store. The shipping iPhone app never
    # polls, so this is the only surface that creates their rename entity.
    # Spawn the moment `register_secret` lands.
    @callback
    def _check_new_iphones() -> None:
        ent_reg = er.async_get(hass)
        new_entities: list[TextEntity] = []
        entries = secret_store.all_entries
        for watch_id, secret_entry in entries.items():
            if secret_entry.device_kind != DEVICE_KIND_IPHONE:
                continue
            if not _needs_name(ent_reg, watch_id):
                continue
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
        # A device that was unpaired gives up its claim, so pairing it again
        # brings its Name back.
        for stale in list(named):
            if stale not in entries:
                named.pop(stale)
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
        self._attr_unique_id = name_unique_id(watch_id)
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
