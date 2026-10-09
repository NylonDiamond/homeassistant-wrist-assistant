"""In-process tests for removing a device, with no Home Assistant.

``__init__.py``, ``sensor.py`` and ``text.py`` cannot be imported without a
full HA install, so the functions under test are pulled out of each module's
source by name and run in a namespace of stand-ins, the way
``test_v2_views_inprocess.py`` runs the view handlers.

Covered:

* Removing a device from HA's device page is refused while the integration
  is not loaded, so the removal cannot leave the device's secret, push tokens
  and watch settings on disk with its key still valid. The log says why.
* A device that is not one of ours to tear down (the service device) can
  still be removed then.
* When loaded, the removal closes the device's live poll session before its
  secret goes, and tears everything else down as before.
* The session listeners in ``sensor.py`` and ``text.py`` add per-device
  entities only for a device that still has a secret, so a session that
  outlived its device cannot re-create it as an empty shell.
* ``text.py`` adds one Name per device: a phone that polls gets its Name
  from the iPhone path only, a watch from its session only, and no listener
  adds one again while Home Assistant is still registering it.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import enum
import logging
import types
from pathlib import Path
from typing import Any

import pytest

_PKG = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"

DOMAIN = "wrist_assistant"
# The reserved owner that is not a device, spelled as the other tests spell it.
LIBRARY = "library"


def _function(module: str, name: str, namespace: dict[str, Any]):
    """Compile one top-level function out of a module's source into
    ``namespace`` and return it."""
    source = (_PKG / module).read_text()
    tree = ast.parse(source, filename=module)
    found = [
        node
        for node in tree.body
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name == name
    ]
    assert len(found) == 1, f"{module} has no single {name}"
    code = compile(
        ast.Module(body=found, type_ignores=[]),
        str(_PKG / module),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    exec(code, namespace)  # noqa: S102
    return namespace[name]


# ── removal from HA's device page ────────────────────────────────────────


class _ConfigEntryState(enum.Enum):
    LOADED = "loaded"
    NOT_LOADED = "not_loaded"
    SETUP_RETRY = "setup_retry"
    SETUP_IN_PROGRESS = "setup_in_progress"


class _Recorder:
    """Every store the removal reaches, writing into one shared journal so
    the order of the calls can be asserted."""

    def __init__(self, journal: list[tuple[str, str]], label: str) -> None:
        self._journal = journal
        self._label = label

    def __getattr__(self, method: str):
        def _call(watch_id: str, *_args: object, **_kwargs: object) -> bool:
            self._journal.append((f"{self._label}.{method}", watch_id))
            return True

        return _call


def _domain_data(journal: list[tuple[str, str]]) -> types.SimpleNamespace:
    return types.SimpleNamespace(
        coordinator=_Recorder(journal, "coordinator"),
        camera_stream_coordinator=_Recorder(journal, "cameras"),
        widget_secret_store=_Recorder(journal, "secrets"),
        notification_store=_Recorder(journal, "notifications"),
        complication_store=_Recorder(journal, "complications"),
        watch_config_store=_Recorder(journal, "watch_config"),
        watch_voices_store=_Recorder(journal, "voices"),
        watch_logs_store=_Recorder(journal, "logs"),
        http_actions_store=_Recorder(journal, "http_actions"),
    )


def _device(*identifiers: tuple[str, str], name: str = "Apple Watch") -> types.SimpleNamespace:
    return types.SimpleNamespace(
        id="device-1", identifiers=set(identifiers), name=name, name_by_user=None
    )


@pytest.fixture
def remove_device():
    namespace: dict[str, Any] = {
        "DOMAIN": DOMAIN,
        "LIBRARY_OWNER_ID": LIBRARY,
        "ConfigEntryState": _ConfigEntryState,
        "_LOGGER": logging.getLogger("wrist_assistant_device_removal_test"),
    }
    return _function("__init__.py", "async_remove_config_entry_device", namespace)


def _hass(domain_data: Any) -> types.SimpleNamespace:
    return types.SimpleNamespace(data={} if domain_data is None else {DOMAIN: domain_data})


@pytest.mark.parametrize(
    "state",
    [
        _ConfigEntryState.NOT_LOADED,
        _ConfigEntryState.SETUP_RETRY,
        _ConfigEntryState.SETUP_IN_PROGRESS,
    ],
)
def test_removing_a_device_is_refused_while_the_integration_is_not_loaded(
    remove_device, state, caplog
) -> None:
    """Disabled, unloaded or retrying setup: nothing is in memory to tear down,
    so HA must not drop the registry device either. The next load would bring
    it back with its key still valid."""
    entry = types.SimpleNamespace(state=state)
    device = _device((DOMAIN, "watch_w1"))
    with caplog.at_level(logging.WARNING):
        removed = asyncio.run(remove_device(_hass(None), entry, device))
    assert removed is False
    assert "Refused to remove device Apple Watch (w1)" in caplog.text
    assert "Enable the integration" in caplog.text


def test_a_stale_runtime_data_does_not_count_as_loaded(remove_device, caplog) -> None:
    """The entry's state is checked as well as the stored data, so a store
    left behind by a half-finished setup is never torn down against."""
    journal: list[tuple[str, str]] = []
    entry = types.SimpleNamespace(state=_ConfigEntryState.SETUP_RETRY)
    device = _device((DOMAIN, "watch_w1"))
    with caplog.at_level(logging.WARNING):
        removed = asyncio.run(remove_device(_hass(_domain_data(journal)), entry, device))
    assert removed is False
    assert journal == []


def test_the_service_device_can_still_be_removed_while_not_loaded(remove_device) -> None:
    """It holds nothing of ours, so there is nothing to refuse for."""
    entry = types.SimpleNamespace(state=_ConfigEntryState.NOT_LOADED)
    device = _device((DOMAIN, "entry-123"), name="Delta Coordinator")
    assert asyncio.run(remove_device(_hass(None), entry, device)) is True


def test_removing_a_device_closes_its_session_before_its_secret_goes(remove_device) -> None:
    journal: list[tuple[str, str]] = []
    entry = types.SimpleNamespace(state=_ConfigEntryState.LOADED)
    device = _device((DOMAIN, "watch_w1"), ("other_domain", "watch_x"))
    assert asyncio.run(remove_device(_hass(_domain_data(journal)), entry, device)) is True

    assert journal[0] == ("coordinator.drop_session", "w1")
    # Its camera streams stop and its unused stream tokens go before the
    # secret does, so nothing it was handed outlives it.
    assert journal[1] == ("cameras.close_device", "w1")
    assert journal[2] == ("secrets.remove", "w1")
    assert {call for call, _ in journal} == {
        "coordinator.drop_session",
        "cameras.close_device",
        "secrets.remove",
        "notifications.remove",
        "complications.release_owner",
        "watch_config.forget_owner",
        "voices.forget",
        "logs.forget",
        "http_actions.forget",
    }
    assert {watch_id for _, watch_id in journal} == {"w1"}


def test_removing_a_device_registered_as_the_library_touches_nothing(remove_device) -> None:
    journal: list[tuple[str, str]] = []
    entry = types.SimpleNamespace(state=_ConfigEntryState.LOADED)
    device = _device((DOMAIN, f"watch_{LIBRARY}"))
    assert asyncio.run(remove_device(_hass(_domain_data(journal)), entry, device)) is True
    assert journal == []


# ── session listeners in sensor.py and text.py ───────────────────────────


class _Entity:
    """Stands in for every entity class the listeners construct."""

    def __init__(self, cls_name: str, *args: Any, **kwargs: Any) -> None:
        self.kind = cls_name
        # The home-wide sensors take no device id.
        self.watch_id = next((a for a in args if isinstance(a, str)), None)
        # The device kind a Name entity was made for.
        self.device_kind = kwargs.get("kind")


def _entity_factory(cls_name: str):
    return lambda *args, **kwargs: _Entity(cls_name, *args, **kwargs)


class _Coordinator:
    def __init__(self) -> None:
        self.real_sessions: dict[str, object] = {}
        self.listeners: list = []

    def async_add_session_listener(self, cb):
        self.listeners.append(cb)
        return lambda: None

    def fire(self) -> None:
        for cb in list(self.listeners):
            cb()


class _SecretStore:
    def __init__(self) -> None:
        self.entries: dict[str, types.SimpleNamespace] = {}
        self.listeners: list = []

    def get(self, watch_id: str):
        return self.entries.get(watch_id)

    @property
    def all_entries(self):
        return dict(self.entries)

    def async_add_listener(self, cb):
        self.listeners.append(cb)
        return lambda: None

    def fire(self) -> None:
        for cb in list(self.listeners):
            cb()


class _EntityRegistry:
    def __init__(self) -> None:
        self.unique_ids: set[str] = set()

    def async_get_entity_id(self, _platform: str, _domain: str, unique_id: str):
        return f"entity.{unique_id}" if unique_id in self.unique_ids else None


def _namespace_for(module: str, registry: _EntityRegistry) -> dict[str, Any]:
    source = (_PKG / module).read_text()
    names = {node.id for node in ast.walk(ast.parse(source)) if isinstance(node, ast.Name)}
    namespace: dict[str, Any] = {
        name: _entity_factory(name)
        for name in names
        if name.endswith(("Sensor", "Text"))
    }
    namespace.update(
        DOMAIN=DOMAIN,
        DEVICE_KIND_IPHONE="iphone",
        DEVICE_KIND_WATCH="watch",
        callback=lambda f: f,
        er=types.SimpleNamespace(async_get=lambda _hass: registry),
    )
    if module == "text.py":
        _function(module, "name_unique_id", namespace)
    return namespace


def _setup(module: str):
    registry = _EntityRegistry()
    setup = _function(module, "async_setup_entry", _namespace_for(module, registry))
    coordinator = _Coordinator()
    secrets = _SecretStore()
    added: list[_Entity] = []
    entry = types.SimpleNamespace(
        entry_id="entry-123",
        runtime_data=types.SimpleNamespace(
            coordinator=coordinator,
            widget_secret_store=secrets,
            notification_store=object(),
        ),
        async_on_unload=lambda _unsub: None,
    )
    asyncio.run(setup(object(), entry, lambda entities: added.extend(entities)))
    return coordinator, secrets, registry, added


def _session_entities(added: list[_Entity], module: str) -> list[tuple[str, str]]:
    kinds = (
        {"WatchPollIntervalSensor", "WatchConnectedSinceSensor"}
        if module == "sensor.py"
        else {"DeviceNameText"}
    )
    return [(e.kind, e.watch_id) for e in added if e.kind in kinds]


@pytest.mark.parametrize("module", ["sensor.py", "text.py"])
def test_a_session_without_a_secret_adds_no_entities(module) -> None:
    """A removed device's session can outlive it by a moment. Its entities are
    gone from the registry by then, and re-adding them would re-create the
    device with no secret behind it."""
    coordinator, secrets, registry, added = _setup(module)

    secrets.entries["w1"] = types.SimpleNamespace(device_kind="watch")
    coordinator.real_sessions["w1"] = object()
    coordinator.fire()
    first = _session_entities(added, module)
    assert first and {watch_id for _, watch_id in first} == {"w1"}
    sentinel = "poll_interval" if module == "sensor.py" else "name"
    registry.unique_ids.add(f"wrist_assistant_w1_{sentinel}")

    # The device is removed: its secret and its entities go, its session stays.
    del secrets.entries["w1"]
    registry.unique_ids.clear()
    added.clear()
    coordinator.fire()
    assert _session_entities(added, module) == []

    # A session for an id that never had a secret adds nothing either.
    coordinator.real_sessions["w2"] = object()
    coordinator.fire()
    assert _session_entities(added, module) == []


@pytest.mark.parametrize("module", ["sensor.py", "text.py"])
def test_a_device_paired_again_under_the_same_id_gets_its_entities_back(module) -> None:
    coordinator, secrets, registry, added = _setup(module)
    coordinator.real_sessions["w1"] = object()
    coordinator.fire()
    assert _session_entities(added, module) == []

    secrets.entries["w1"] = types.SimpleNamespace(device_kind="watch")
    coordinator.fire()
    assert {watch_id for _, watch_id in _session_entities(added, module)} == {"w1"}


# ── text.py: one Name per device, and only a watch's from its session ────


def _names(added: list[_Entity]) -> list[tuple[str, str | None]]:
    return [(e.watch_id, e.device_kind) for e in added if e.kind == "DeviceNameText"]


def test_a_phone_that_polls_gets_one_name_and_it_is_an_iphone_s() -> None:
    """A phone signer polling the delta endpoint has a live session like a
    watch. Its Name comes from the iPhone path; the session path used to add
    a second one with the same unique id, which Home Assistant refused with
    an error on every start."""
    coordinator, secrets, registry, added = _setup("text.py")
    secrets.entries["p1"] = types.SimpleNamespace(device_kind="iphone")
    secrets.fire()
    assert _names(added) == [("p1", "iphone")]

    # The phone polls before Home Assistant has registered the entity, and
    # again after.
    coordinator.real_sessions["p1"] = object()
    coordinator.fire()
    registry.unique_ids.add("wrist_assistant_p1_name")
    coordinator.fire()
    secrets.fire()
    assert _names(added) == [("p1", "iphone")]


def test_a_polling_phone_present_at_setup_gets_one_name() -> None:
    """After a reload or a restart the phone's session and secret are both
    there when the platform sets up, and its entity is in the registry from
    the run before."""
    registry = _EntityRegistry()
    registry.unique_ids.add("wrist_assistant_p1_name")
    setup = _function("text.py", "async_setup_entry", _namespace_for("text.py", registry))
    coordinator = _Coordinator()
    coordinator.real_sessions["p1"] = object()
    secrets = _SecretStore()
    secrets.entries["p1"] = types.SimpleNamespace(device_kind="iphone")
    added: list[_Entity] = []
    entry = types.SimpleNamespace(
        entry_id="entry-123",
        runtime_data=types.SimpleNamespace(coordinator=coordinator, widget_secret_store=secrets),
        async_on_unload=lambda _unsub: None,
    )
    asyncio.run(setup(object(), entry, lambda entities: added.extend(entities)))
    coordinator.fire()
    secrets.fire()
    assert _names(added) == [("p1", "iphone")]


def test_a_watch_gets_its_name_from_its_session_only() -> None:
    coordinator, secrets, _registry, added = _setup("text.py")
    secrets.entries["w1"] = types.SimpleNamespace(device_kind="watch")
    secrets.fire()
    assert _names(added) == []

    coordinator.real_sessions["w1"] = object()
    coordinator.fire()
    coordinator.fire()
    secrets.fire()
    assert _names(added) == [("w1", "watch")]


def test_a_name_is_never_added_twice_and_comes_back_once_deleted() -> None:
    """Listeners that fire before Home Assistant has registered a new entity
    must not add it again; one the user deleted is added back, once."""
    coordinator, secrets, registry, added = _setup("text.py")
    secrets.entries["w1"] = types.SimpleNamespace(device_kind="watch")
    coordinator.real_sessions["w1"] = object()
    for _ in range(3):
        coordinator.fire()
    assert _names(added) == [("w1", "watch")]

    registry.unique_ids.add("wrist_assistant_w1_name")
    coordinator.fire()
    assert _names(added) == [("w1", "watch")]

    # The user deletes the entity from the registry.
    registry.unique_ids.clear()
    coordinator.fire()
    coordinator.fire()
    assert _names(added) == [("w1", "watch"), ("w1", "watch")]


def test_an_unpaired_phone_paired_again_gets_its_name_back() -> None:
    _coordinator, secrets, registry, added = _setup("text.py")
    secrets.entries["p1"] = types.SimpleNamespace(device_kind="iphone")
    secrets.fire()
    registry.unique_ids.add("wrist_assistant_p1_name")

    del secrets.entries["p1"]
    registry.unique_ids.clear()
    secrets.fire()
    secrets.entries["p1"] = types.SimpleNamespace(device_kind="iphone")
    secrets.fire()
    assert _names(added) == [("p1", "iphone"), ("p1", "iphone")]
