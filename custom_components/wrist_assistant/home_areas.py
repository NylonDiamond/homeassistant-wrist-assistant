"""The home's areas and the entities in each, for the home map.

Home map (app repo ``docs/home_map_plan_2026-10.md``): the iPhone asks which
Home Assistant area a scanned room is, and its device tray lists the
entities of that room's area. The signed ``areas_get`` op answers with
:func:`home_areas`.

An entity's own area wins over its device's area, as Home Assistant itself
reads it. Hidden and disabled entities are left out (an entity of a disabled
device is disabled with it). Only entities in the entity registry have an
area at all.
"""

from __future__ import annotations

from collections.abc import Callable, Iterable
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er


def areas_from_registries(
    areas: Iterable[Any],
    entities: Iterable[Any],
    device_area: Callable[[str], str | None],
) -> list[dict[str, Any]]:
    """``[{"id", "name", "entity_ids": [...]}]``, every area once, sorted by
    name (then id), each area's entity ids sorted.

    ``areas`` are area registry entries (``id``, ``name``), ``entities``
    entity registry entries (``entity_id``, ``area_id``, ``device_id``,
    ``hidden_by``, ``disabled_by``), and ``device_area(device_id)`` the area
    of a device, None for none or an unknown device. An area with no
    entities is listed too, for the iPhone's area pick; an entity whose
    area is not listed is in none.
    """
    members: dict[str, list[str]] = {}
    names: dict[str, str] = {}
    for area in areas:
        members[area.id] = []
        names[area.id] = area.name
    for entry in entities:
        if entry.hidden_by is not None or entry.disabled_by is not None:
            continue
        area_id = entry.area_id
        if area_id is None and entry.device_id is not None:
            area_id = device_area(entry.device_id)
        if area_id in members:
            members[area_id].append(entry.entity_id)
    return [
        {"id": area_id, "name": names[area_id], "entity_ids": sorted(members[area_id])}
        for area_id in sorted(members, key=lambda key: (names[key].casefold(), key))
    ]


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
