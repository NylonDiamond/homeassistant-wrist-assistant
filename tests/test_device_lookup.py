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


# ── paired_device_name ───────────────────────────────────────────────────


def _named(name_by_user: str | None, name: str | None) -> object:
    return types.SimpleNamespace(id="dev-watch", name_by_user=name_by_user, name=name)


def _entry(kind: str = "watch", device_name: str | None = None, label: str | None = None):
    return types.SimpleNamespace(device_kind=kind, device_name=device_name, label=label)


def test_a_rename_on_the_device_page_wins() -> None:
    registry = NewRegistry({(DOMAIN, f"watch_{WATCH}"): _named("Kitchen watch", "Watch")})
    name = real_module().paired_device_name(registry, _entry(device_name="Apple Watch"), WATCH)
    assert name == "Kitchen watch"


def test_the_device_page_name_comes_before_the_app_s() -> None:
    registry = OldRegistry({(DOMAIN, f"watch_{WATCH}"): _named(None, "Jesse's Watch")})
    name = real_module().paired_device_name(registry, _entry(device_name="Apple Watch"), WATCH)
    assert name == "Jesse's Watch"


def test_with_no_device_page_the_app_s_name_is_used() -> None:
    name = real_module().paired_device_name(NewRegistry({}), _entry(device_name=" Apple Watch "), WATCH)
    assert name == "Apple Watch"


def test_the_pairing_label_is_never_a_name() -> None:
    """A watch paired by code carries ``watch-code-pair`` as its label."""
    entry = _entry(label="watch-code-pair")
    assert real_module().paired_device_name(None, entry, WATCH) == f"Watch {WATCH[:8]}"


def test_the_fallback_says_iphone_for_an_iphone() -> None:
    assert real_module().paired_device_name(None, _entry("iphone"), WATCH) == f"iPhone {WATCH[:8]}"
    assert real_module().paired_device_name(None, None, WATCH) == f"Watch {WATCH[:8]}"
