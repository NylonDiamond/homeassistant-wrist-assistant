"""The home's areas and the entities in each, for the home map.

Home map (app repo ``docs/home_map_plan_2026-10.md``): the iPhone asks which
Home Assistant area a scanned room is, and its device tray lists the
entities of that room's area. Before a scan it asks which Home Assistant
floor it is on, and lists that floor's areas first. After a scan it may
ask whether a scanned thing (a TV, a fridge) is one device of its room,
reading each entity's device class, device and device model. The signed
``areas_get`` op answers with :func:`home_areas`, :func:`home_entities` and
:func:`home_floors`.

An entity's own area wins over its device's area, as Home Assistant itself
reads it. Disabled entities are left out (an entity of a disabled device is
disabled with it). Hidden ones are kept: Home Assistant hides the lights of a
light group, and each lamp of the group is still a thing in a room to pin.
Only entities in the entity registry have an area at all.
"""

from __future__ import annotations

from collections.abc import Callable, Iterable
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import floor_registry as fr


def areas_from_registries(
    areas: Iterable[Any],
    entities: Iterable[Any],
    device_area: Callable[[str], str | None],
) -> list[dict[str, Any]]:
    """``[{"id", "name", "floor_id", "entity_ids": [...]}]``, every area
    once, sorted by name (then id), each area's entity ids sorted.

    ``areas`` are area registry entries (``id``, ``name``, ``floor_id``, None
    for an area on no floor), ``entities``
    entity registry entries (``entity_id``, ``area_id``, ``device_id``,
    ``disabled_by``), and ``device_area(device_id)`` the area
    of a device, None for none or an unknown device. An area with no
    entities is listed too, for the iPhone's area pick; an entity whose
    area is not listed is in none.
    """
    members: dict[str, list[str]] = {}
    names: dict[str, str] = {}
    floors: dict[str, str | None] = {}
    for area in areas:
        members[area.id] = []
        names[area.id] = area.name
        floors[area.id] = area.floor_id
    for entry in entities:
        if entry.disabled_by is not None:
            continue
        area_id = entry.area_id
        if area_id is None and entry.device_id is not None:
            area_id = device_area(entry.device_id)
        if area_id in members:
            members[area_id].append(entry.entity_id)
    return [
        {
            "id": area_id,
            "name": names[area_id],
            "floor_id": floors[area_id],
            "entity_ids": sorted(members[area_id]),
        }
        for area_id in sorted(members, key=lambda key: (names[key].casefold(), key))
    ]


def floors_from_registry(floors: Iterable[Any]) -> list[dict[str, Any]]:
    """``[{"id", "name", "level"}]``, every floor of the home once, sorted by
    level (floors with no level last), then by name ignoring case, then id.

    ``floors`` are floor registry entries (``floor_id``, ``name``, ``level``,
    an int or None). An area names its floor by this id (``floor_id`` in
    :func:`areas_from_registries`).
    """
    rows = [
        {"id": floor.floor_id, "name": floor.name, "level": floor.level}
        for floor in floors
    ]
    rows.sort(
        key=lambda row: (
            row["level"] is None,
            row["level"] if row["level"] is not None else 0,
            row["name"].casefold(),
            row["id"],
        )
    )
    return rows


def _text(value: Any) -> str | None:
    """``value`` when it is a non-empty string, else None."""
    return value if isinstance(value, str) and value else None


def entities_from_states(
    states: Iterable[Any],
    entities: Iterable[Any],
    device_area: Callable[[str], str | None],
    device_entry: Callable[[str], Any | None] = lambda _device_id: None,
) -> list[dict[str, Any]]:
    """``[{"id", "name", "area_id", "device_class", "device_id",
    "device_name", "device_model"}]``, every entity Home Assistant has a
    state for, sorted by name ignoring case (then id), for the iPhone's
    "All Devices" pick and its "Found Devices" question after a scan.

    ``states`` are state objects (``entity_id``, ``attributes``), the other
    two as for :func:`areas_from_registries`, and ``device_entry(device_id)``
    the device registry entry (``name_by_user``, ``name``, ``model``), None
    for an unknown device. The name is the state's ``friendly_name``, else
    the entity id. ``area_id`` is read as there, and is None for an entity
    in no area or not in the registry. ``device_class`` is the state's own
    attribute when it is a non-empty string. ``device_id`` is the registry
    entry's device, ``device_name`` that device's ``name_by_user``, else its
    ``name``, and ``device_model`` its ``model``; each None when there is no
    such entry, device or value. The iPhone groups a device's entities by
    ``device_id`` and reads the names and model for the words that say what
    a scanned thing is (a TV, a fridge). Disabled entities are left out,
    hidden ones kept.
    """
    registry = {entry.entity_id: entry for entry in entities}
    rows: list[dict[str, Any]] = []
    for state in states:
        entry = registry.get(state.entity_id)
        area_id = None
        device_id = None
        if entry is not None:
            if entry.disabled_by is not None:
                continue
            device_id = entry.device_id
            area_id = entry.area_id
            if area_id is None and device_id is not None:
                area_id = device_area(device_id)
        device = device_entry(device_id) if device_id is not None else None
        name = state.attributes.get("friendly_name")
        rows.append({
            "id": state.entity_id,
            "name": name if isinstance(name, str) and name else state.entity_id,
            "area_id": area_id,
            "device_class": _text(state.attributes.get("device_class")),
            "device_id": device_id,
            "device_name": (
                (_text(device.name_by_user) or _text(device.name)) if device is not None else None
            ),
            "device_model": _text(device.model) if device is not None else None,
        })
    rows.sort(key=lambda row: (row["name"].casefold(), row["id"]))
    return rows


def home_entities(hass: HomeAssistant) -> list[dict[str, Any]]:
    """:func:`entities_from_states` over Home Assistant's states and
    registries."""
    devices = dr.async_get(hass)

    def device_area(device_id: str) -> str | None:
        device = devices.async_get(device_id)
        return device.area_id if device is not None else None

    return entities_from_states(
        hass.states.async_all(),
        er.async_get(hass).entities.values(),
        device_area,
        devices.async_get,
    )


def home_areas(hass: HomeAssistant) -> list[dict[str, Any]]:
    """:func:`areas_from_registries` over Home Assistant's own registries."""
    devices = dr.async_get(hass)

    def device_area(device_id: str) -> str | None:
        device = devices.async_get(device_id)
        return device.area_id if device is not None else None

    return areas_from_registries(
        ar.async_get(hass).async_list_areas(),
        er.async_get(hass).entities.values(),
        device_area,
    )


def home_floors(hass: HomeAssistant) -> list[dict[str, Any]]:
    """:func:`floors_from_registry` over Home Assistant's floor registry."""
    return floors_from_registry(fr.async_get(hass).async_list_floors())
