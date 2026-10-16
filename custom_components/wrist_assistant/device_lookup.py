"""Find the integration's own devices in Home Assistant's device registry.

Home Assistant 2026.8 added ``async_get_device_by_identifier`` and
``async_get_devices`` and deprecated ``async_get_device`` and a DeviceInfo's
``via_device``; both old forms stop working in 2027.8. ``hacs.json`` still
allows older releases, which have only the old forms, so each helper uses
the new call when the registry has it and the old one before that.

Takes the registry object rather than ``hass`` and imports nothing from Home
Assistant, so the stubbed test packages can load it as is.
"""

from __future__ import annotations

from typing import Any

from .const import DOMAIN


def _has_new_lookups(dev_reg: Any) -> bool:
    return hasattr(dev_reg, "async_get_device_by_identifier")


def paired_identifier(device_id: str) -> tuple[str, str]:
    """The registry identifier of a paired watch or iPhone."""
    return (DOMAIN, f"watch_{device_id}")


def find_device(
    dev_reg: Any, identifier: tuple[str, str], config_entry_id: str | None = None
) -> Any | None:
    """The device registered under ``identifier``, or None."""
    if not _has_new_lookups(dev_reg):
        return dev_reg.async_get_device(identifiers={identifier})
    if config_entry_id is not None:
        return dev_reg.async_get_device_by_identifier(identifier, config_entry_id)
    devices = dev_reg.async_get_devices(identifiers={identifier})
    return devices[0] if devices else None


def find_paired_device(
    dev_reg: Any, device_id: str, config_entry_id: str | None = None
) -> Any | None:
    """The registry device of a paired watch or iPhone, or None."""
    return find_device(dev_reg, paired_identifier(device_id), config_entry_id)


def parent_device_fields(dev_reg: Any | None, via_device: tuple[str, str]) -> dict[str, str]:
    """The DeviceInfo fields that put a device under ``via_device``.

    The new form names the parent by its registry id, so the parent must
    exist already; the integration creates its hub device before any platform
    sets up. Without a registry, or on a release before 2026.8, this is the
    old ``via_device`` identifier.
    """
    if dev_reg is None or not _has_new_lookups(dev_reg):
        return {"via_device": via_device}
    parent = find_device(dev_reg, via_device)
    return {"via_device_id": parent.id} if parent is not None else {}
