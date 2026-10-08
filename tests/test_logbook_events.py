"""Unit tests for ``logbook_events.py``, the Logbook entries for pairing,
sync, push token and drop moments.

In-process with stubbed Home Assistant modules: ``logbook.async_log_entry``
records every entry, the device and entity registries are small fakes, and
the widget secret store is a dict of entries carrying ``device_kind``.

Covered: an entry points at the entity the registry filed under the
sensor's unique id (so a named device's entries land on its real entity),
the fallback to the unnamed id when the sensor is not registered yet, and
iPhone events filed against the iPhone's own sensor rather than a watch's.
"""

from __future__ import annotations

import contextlib
import importlib.util
import sys
import types
from pathlib import Path

import pytest

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_PKG = "wa_logbook_events_test_pkg"
DOMAIN = "wrist_assistant"
WATCH = "0123456789abcdef0123456789abcdef"
PHONE = "iphone:abcdef0123456789"


class FakeEntityRegistry:
    """Entity ids keyed on (platform domain, integration, unique id)."""

    def __init__(self) -> None:
        self.ids: dict[tuple[str, str, str], str] = {}

    def async_get_entity_id(self, domain: str, platform: str, unique_id: str) -> str | None:
        return self.ids.get((domain, platform, unique_id))


class FakeDeviceRegistry:
    def __init__(self) -> None:
        self.names: dict[str, str] = {}

    def async_get_device(self, *, identifiers):
        ((_domain, ident),) = identifiers
        name = self.names.get(ident)
        return types.SimpleNamespace(name=name) if name is not None else None


def _stub(name: str, **attrs: object) -> None:
    module = sys.modules.get(name) or types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module


@contextlib.contextmanager
def loaded_module():
    saved = dict(sys.modules)
    entries: list[dict] = []
    entities = FakeEntityRegistry()
    devices = FakeDeviceRegistry()
    try:
        _stub("homeassistant")
        _stub("homeassistant.core", HomeAssistant=type("HomeAssistant", (), {}))
        _stub(
            "homeassistant.components.logbook",
            async_log_entry=lambda hass, name, message, domain, entity_id=None: entries.append(
                {"name": name, "message": message, "domain": domain, "entity_id": entity_id}
            ),
        )
        _stub("homeassistant.components", logbook=sys.modules["homeassistant.components.logbook"])
        _stub("homeassistant.helpers.device_registry", async_get=lambda _hass: devices)
        _stub("homeassistant.helpers.entity_registry", async_get=lambda _hass: entities)
        _stub(
            "homeassistant.helpers",
            device_registry=sys.modules["homeassistant.helpers.device_registry"],
            entity_registry=sys.modules["homeassistant.helpers.entity_registry"],
        )
        pkg = types.ModuleType(_PKG)
        pkg.__path__ = []
        sys.modules[_PKG] = pkg
        _stub(f"{_PKG}.const", DOMAIN=DOMAIN)
        _stub(
            f"{_PKG}.widget_secret_store",
            DEVICE_KIND_IPHONE="iphone",
            DEVICE_KIND_WATCH="watch",
            LABEL_IPHONE_SELF_PROVISION="iphone-self-provision",
        )
        spec = importlib.util.spec_from_file_location(
            f"{_PKG}.logbook_events", _PKG_DIR / "logbook_events.py"
        )
        module = importlib.util.module_from_spec(spec)
        sys.modules[f"{_PKG}.logbook_events"] = module
        spec.loader.exec_module(module)
        yield types.SimpleNamespace(
            mod=module, entries=entries, entities=entities, devices=devices
        )
    finally:
        for key in list(sys.modules):
            if key not in saved:
                del sys.modules[key]
        sys.modules.update(saved)


@pytest.fixture
def env():
    with loaded_module() as loaded:
        yield loaded


def make_hass(secrets: dict[str, str] | None = None):
    """A hass whose widget secret store holds ``{id: device_kind}``."""
    store = types.SimpleNamespace(
        get=lambda watch_id: (
            types.SimpleNamespace(device_kind=secrets[watch_id])
            if secrets and watch_id in secrets
            else None
        )
    )
    return types.SimpleNamespace(
        data={DOMAIN: types.SimpleNamespace(widget_secret_store=store)}
    )


def test_a_named_watch_gets_entries_on_its_registered_entity(env) -> None:
    env.devices.names[f"watch_{WATCH}"] = "Jesse's Apple Watch"
    env.entities.ids[("sensor", DOMAIN, f"wrist_assistant_{WATCH}_last_activity")] = (
        "sensor.jesse_s_apple_watch_last_activity"
    )
    hass = make_hass({WATCH: "watch"})
    env.mod.log_first_sync(hass, watch_id=WATCH)
    env.mod.log_session_dropped(hass, watch_id=WATCH, reason="idle_ttl")
    env.mod.log_push_token_registered(hass, watch_id=WATCH, is_new=True)
    env.mod.log_hmac_failure(hass, watch_id=WATCH, reason="bad_signature", is_known_watch=True)
    assert [entry["entity_id"] for entry in env.entries] == [
        "sensor.jesse_s_apple_watch_last_activity"
    ] * 4
    assert {entry["name"] for entry in env.entries} == {"Jesse's Apple Watch"}


def test_an_unregistered_sensor_falls_back_to_the_unnamed_id(env) -> None:
    hass = make_hass({WATCH: "watch"})
    env.mod.log_first_sync(hass, watch_id=WATCH)
    assert env.entries[0]["entity_id"] == f"sensor.watch_{WATCH[:8]}_last_activity"
    assert env.entries[0]["name"] == f"Watch {WATCH[:8]}"


def test_iphone_events_are_filed_against_the_iphone_sensor(env) -> None:
    env.entities.ids[("sensor", DOMAIN, f"wrist_assistant_{PHONE}_last_provision")] = (
        "sensor.jesse_s_iphone_last_provision"
    )
    # A watch-shaped sensor for the same id must not be picked for an iPhone.
    env.entities.ids[("sensor", DOMAIN, f"wrist_assistant_{PHONE}_last_activity")] = (
        "sensor.wrong_last_activity"
    )
    hass = make_hass({PHONE: "iphone"})
    env.mod.log_first_sync(hass, watch_id=PHONE)
    env.mod.log_push_token_registered(hass, watch_id=PHONE, is_new=False)
    env.mod.log_hmac_failure(hass, watch_id=PHONE, reason="bad_signature", is_known_watch=True)
    assert [entry["entity_id"] for entry in env.entries] == [
        "sensor.jesse_s_iphone_last_provision"
    ] * 3
    assert {entry["name"] for entry in env.entries} == {f"iPhone {PHONE[:8]}"}


def test_an_unregistered_iphone_falls_back_to_the_iphone_id(env) -> None:
    hass = make_hass({PHONE: "iphone"})
    env.mod.log_first_sync(hass, watch_id=PHONE)
    assert env.entries[0]["entity_id"] == f"sensor.iphone_{PHONE[:8]}_last_provision"


def test_a_pairing_by_label_uses_the_registered_entity(env) -> None:
    env.entities.ids[("sensor", DOMAIN, f"wrist_assistant_{PHONE}_last_provision")] = (
        "sensor.jesse_s_iphone_last_provision"
    )
    env.mod.log_secret_registered(
        make_hass(), watch_id=PHONE, label="iphone-self-provision", app_version="3.1"
    )
    assert env.entries[0]["entity_id"] == "sensor.jesse_s_iphone_last_provision"
    assert env.entries[0]["message"] == "paired with Home Assistant (app 3.1)"


def test_no_domain_data_files_the_event_as_a_watch(env) -> None:
    env.mod.log_first_sync(types.SimpleNamespace(data={}), watch_id=WATCH)
    assert env.entries[0]["entity_id"] == f"sensor.watch_{WATCH[:8]}_last_activity"
