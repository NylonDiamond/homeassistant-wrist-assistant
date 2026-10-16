"""Unit tests for ``device_lookup.py``, the device registry lookups that
work on both sides of Home Assistant 2026.8.

From 2026.8 the registry has ``async_get_device_by_identifier`` and
``async_get_devices``, and ``async_get_device`` and a DeviceInfo's
``via_device`` are deprecated (they stop working in 2027.8). Before 2026.8
only the old forms exist. Pinned: each helper takes the new path when the
registry has it and never touches the old call there, and keeps the old
call on an older registry.
"""

from __future__ import annotations

import types

from device_lookup_loader import real_module

DOMAIN = "wrist_assistant"
WATCH = "0123456789abcdef"
HUB = (DOMAIN, "entry-1")


class OldRegistry:
    """A registry from before 2026.8: only ``async_get_device``."""

    def __init__(self, devices: dict[tuple[str, str], object]) -> None:
        self.devices = devices

    def async_get_device(self, *, identifiers):
        (identifier,) = identifiers
        return self.devices.get(identifier)


class NewRegistry:
    """A registry from 2026.8 on. The deprecated call raises, so a test
    fails if a helper still reaches it."""

    def __init__(self, devices: dict[tuple[str, str], object]) -> None:
        self.devices = devices
        self.by_identifier: list[tuple[tuple[str, str], str]] = []

    def async_get_device(self, **_):
        raise AssertionError("the deprecated async_get_device was called")

    def async_get_device_by_identifier(self, identifier, config_entry_id):
        self.by_identifier.append((identifier, config_entry_id))
        return self.devices.get(identifier)

    def async_get_devices(self, *, identifiers=None, connections=None, config_entry_id=None):
        return [self.devices[i] for i in identifiers or () if i in self.devices]


def _device(device_id: str) -> object:
    return types.SimpleNamespace(id=device_id)


def test_a_paired_device_is_found_on_an_old_registry() -> None:
    lookup = real_module()
    watch = _device("dev-watch")
    registry = OldRegistry({(DOMAIN, f"watch_{WATCH}"): watch})
    assert lookup.find_paired_device(registry, WATCH) is watch
    assert lookup.find_paired_device(registry, "someone-else") is None


def test_a_paired_device_is_found_on_a_new_registry_without_the_old_call() -> None:
    lookup = real_module()
    watch = _device("dev-watch")
    registry = NewRegistry({(DOMAIN, f"watch_{WATCH}"): watch})
    assert lookup.find_paired_device(registry, WATCH) is watch
    assert lookup.find_paired_device(registry, "someone-else") is None


def test_a_config_entry_narrows_the_new_lookup_to_that_entry() -> None:
    lookup = real_module()
    watch = _device("dev-watch")
    registry = NewRegistry({(DOMAIN, f"watch_{WATCH}"): watch})
    assert lookup.find_paired_device(registry, WATCH, "entry-1") is watch
    assert registry.by_identifier == [((DOMAIN, f"watch_{WATCH}"), "entry-1")]


def test_an_old_registry_keeps_the_via_device_identifier() -> None:
    lookup = real_module()
    registry = OldRegistry({HUB: _device("dev-hub")})
    assert lookup.parent_device_fields(registry, HUB) == {"via_device": HUB}


def test_no_registry_keeps_the_via_device_identifier() -> None:
    assert real_module().parent_device_fields(None, HUB) == {"via_device": HUB}


def test_a_new_registry_names_the_parent_by_its_id() -> None:
    lookup = real_module()
    registry = NewRegistry({HUB: _device("dev-hub")})
    assert lookup.parent_device_fields(registry, HUB) == {"via_device_id": "dev-hub"}


def test_a_new_registry_without_the_parent_links_nothing() -> None:
    assert real_module().parent_device_fields(NewRegistry({}), HUB) == {}
