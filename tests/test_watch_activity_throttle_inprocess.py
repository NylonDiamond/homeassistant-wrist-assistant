"""In-process tests for the per-watch sensors that refresh from polls.

These load ``sensor.py`` with stubbed Home Assistant modules (the same
approach as ``test_delta_coordinator_inprocess.py``), a fake coordinator and a
hand-driven clock, so the one-write-a-minute throttle can be checked without a
live HA or a real minute.

Covered:

* Last activity writes at once when a watch appears or comes back, then at
  most once a minute from polls, with a trailing write so the last poll of a
  burst is never lost.
* Another watch appearing or polling does not touch this watch's sensor.
* Removing the entity cancels a pending trailing write.
* Subscribed entities writes at once when the entity list moves.
"""

from __future__ import annotations

import asyncio
import importlib.util
import sys
import types
from datetime import datetime, timezone
from pathlib import Path

import pytest

_SENSOR_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "sensor.py"
)


class _Clock:
    def __init__(self) -> None:
        self.now = 1000.0

    def time(self) -> float:
        return self.now


class _Named:
    def __init__(self, name: str) -> None:
        self.name = name


class _States:
    def get(self, entity_id: str) -> _Named:
        return _Named(f"Name of {entity_id}")


class _Hass:
    def __init__(self) -> None:
        self.loop = _Clock()
        self.states = _States()
        # (due loop time, callback, cancelled flag holder) per async_call_later.
        self.timers: list[list] = []

    def fire_due_timers(self) -> None:
        for timer in list(self.timers):
            due, cb, cancelled = timer
            if not cancelled[0] and due <= self.loop.now:
                self.timers.remove(timer)
                cb(datetime.now(timezone.utc))


def _async_call_later(hass: _Hass, delay: float, cb):  # noqa: ANN001
    cancelled = [False]
    hass.timers.append([hass.loop.now + delay, cb, cancelled])

    def _cancel() -> None:
        cancelled[0] = True

    return _cancel


class _Session:
    def __init__(self, last_seen: datetime) -> None:
        self.last_seen = last_seen
        self.entities: set[str] = set()


class _Coordinator:
    """Just the listener surface the sensors use."""

    def __init__(self) -> None:
        self._sessions: dict[str, _Session] = {}
        self.session_cbs: list = []
        self.poll_cbs: list = []

    def async_add_session_listener(self, cb):  # noqa: ANN001
        self.session_cbs.append(cb)
        return lambda: self.session_cbs.remove(cb)

    def async_add_poll_listener(self, cb):  # noqa: ANN001
        self.poll_cbs.append(cb)
        return lambda: self.poll_cbs.remove(cb)

    def poll(self, hass: _Hass, watch_id: str, entities: set[str] | None = None) -> None:
        """What handle_poll does for listeners: session change, then poll."""
        seen = datetime.fromtimestamp(hass.loop.now, timezone.utc)
        session = self._sessions.get(watch_id)
        changed = session is None
        if session is None:
            session = self._sessions[watch_id] = _Session(seen)
        session.last_seen = seen
        if entities is not None and entities != session.entities:
            session.entities = set(entities)
            changed = True
        if changed:
            for cb in list(self.session_cbs):
                cb()
        for cb in list(self.poll_cbs):
            cb(watch_id)

    def drop(self, watch_id: str) -> None:
        self._sessions.pop(watch_id, None)
        for cb in list(self.session_cbs):
            cb()


class _RestoreSensor:
    """Entity stand-in: records each write's native value."""

    hass: _Hass

    def async_on_remove(self, f) -> None:  # noqa: ANN001
        self.__dict__.setdefault("removers", []).append(f)

    def async_write_ha_state(self) -> None:
        self.__dict__.setdefault("writes", []).append(self.native_value)

    async def async_added_to_hass(self) -> None:
        return None

    async def async_get_last_sensor_data(self):  # noqa: ANN201
        return None

    async def async_get_last_state(self):  # noqa: ANN201
        return None

    def remove(self) -> None:
        for f in self.__dict__.get("removers", []):
            f()


def _stub(name: str, **attrs: object) -> types.ModuleType:
    module = sys.modules.get(name) or types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module
    return module


def _enum(**members: str) -> type:
    return type("Enum", (), members)


def _load_sensor():
    saved = dict(sys.modules)
    _stub("homeassistant")
    _stub("homeassistant.components")
    _stub(
        "homeassistant.components.sensor",
        RestoreSensor=_RestoreSensor,
        SensorEntity=_RestoreSensor,
        SensorDeviceClass=_enum(TIMESTAMP="timestamp", DURATION="duration", ENUM="enum"),
        SensorStateClass=_enum(MEASUREMENT="measurement", TOTAL_INCREASING="total_increasing"),
    )
    _stub("homeassistant.config_entries", ConfigEntry=object)
    _stub(
        "homeassistant.const",
        EntityCategory=_enum(DIAGNOSTIC="diagnostic"),
        UnitOfTime=_enum(SECONDS="s"),
    )
    _stub(
        "homeassistant.core",
        CALLBACK_TYPE=object,
        HomeAssistant=_Hass,
        callback=lambda f: f,
    )
    dr = _stub(
        "homeassistant.helpers.device_registry",
        DeviceEntryType=_enum(SERVICE="service"),
        DeviceInfo=dict,
        EVENT_DEVICE_REGISTRY_UPDATED="device_registry_updated",
    )
    er = _stub("homeassistant.helpers.entity_registry")
    _stub("homeassistant.helpers", device_registry=dr, entity_registry=er)
    _stub("homeassistant.helpers.entity_platform", AddEntitiesCallback=object)
    _stub("homeassistant.helpers.event", async_call_later=_async_call_later)
    pkg = types.ModuleType("wa_sensor_pkg")
    pkg.__path__ = []
    sys.modules["wa_sensor_pkg"] = pkg
    _stub("wa_sensor_pkg.api", DeltaCoordinator=_Coordinator, MAX_EVENTS_BUFFER=5000)
    _stub("wa_sensor_pkg.const", DOMAIN="wrist_assistant", WristAssistantConfigEntry=object)
    _stub("wa_sensor_pkg.notifications", NotificationTokenStore=object)
    _stub(
        "wa_sensor_pkg.widget_secret_store",
        DEVICE_KIND_IPHONE="iphone",
        DEVICE_KIND_WATCH="watch",
        WidgetSecretStore=object,
        build_device_info=lambda *a, **k: None,
    )
    spec = importlib.util.spec_from_file_location("wa_sensor_pkg.sensor", _SENSOR_PATH)
    module = importlib.util.module_from_spec(spec)
    sys.modules["wa_sensor_pkg.sensor"] = module
    spec.loader.exec_module(module)
    return module, saved


@pytest.fixture
def env():
    module, saved = _load_sensor()
    yield module, _Hass(), _Coordinator()
    for key in list(sys.modules):
        if key not in saved:
            del sys.modules[key]
    sys.modules.update(saved)


def _add(module, hass: _Hass, coord: _Coordinator, cls, watch_id: str = "w1"):  # noqa: ANN001
    sensor = cls(coord, None, None, watch_id, ("wrist_assistant", "entry"))
    sensor.hass = hass
    asyncio.run(sensor.async_added_to_hass())
    return sensor


def _ts(hass: _Hass, at: float) -> datetime:
    return datetime.fromtimestamp(at, timezone.utc)


def test_last_activity_writes_at_most_once_a_minute(env) -> None:
    module, hass, coord = env
    sensor = _add(module, hass, coord, module.WatchLastActivitySensor)
    t0 = hass.loop.now

    # The watch appears: written at once.
    coord.poll(hass, "w1")
    assert sensor.writes == [_ts(hass, t0)]

    # A burst of polls inside the minute: nothing written yet, one timer.
    for step in (5, 20, 40):
        hass.loop.now = t0 + step
        coord.poll(hass, "w1")
    assert len(sensor.writes) == 1
    assert len(hass.timers) == 1

    # Another watch appearing and polling does not touch this sensor.
    coord.poll(hass, "w2")
    coord.poll(hass, "w2")
    assert len(sensor.writes) == 1

    # The minute is up: the trailing write carries the burst's last poll.
    hass.loop.now = t0 + 60
    hass.fire_due_timers()
    assert sensor.writes[-1] == _ts(hass, t0 + 40)
    assert len(sensor.writes) == 2

    # Quiet for over a minute, then a poll: written at once.
    hass.loop.now = t0 + 200
    coord.poll(hass, "w1")
    assert sensor.writes[-1] == _ts(hass, t0 + 200)
    assert len(sensor.writes) == 3
    assert not hass.timers


def test_last_activity_writes_at_once_when_the_watch_comes_back(env) -> None:
    module, hass, coord = env
    sensor = _add(module, hass, coord, module.WatchLastActivitySensor)
    t0 = hass.loop.now
    coord.poll(hass, "w1")

    # Pruned: nothing to write, the sensor holds the last value it wrote.
    coord.drop("w1")
    assert sensor.writes == [_ts(hass, t0)]
    assert sensor.native_value == _ts(hass, t0)

    # Back ten seconds later, well inside the minute: written at once.
    hass.loop.now = t0 + 10
    coord.poll(hass, "w1")
    assert sensor.writes[-1] == _ts(hass, t0 + 10)


def test_removing_the_sensor_cancels_a_pending_write(env) -> None:
    module, hass, coord = env
    sensor = _add(module, hass, coord, module.WatchLastActivitySensor)
    t0 = hass.loop.now
    coord.poll(hass, "w1")
    hass.loop.now = t0 + 5
    coord.poll(hass, "w1")
    assert len(hass.timers) == 1

    sensor.remove()
    hass.loop.now = t0 + 60
    hass.fire_due_timers()
    assert len(sensor.writes) == 1
    assert not coord.poll_cbs


def test_subscribed_entities_writes_at_once_when_the_list_moves(env) -> None:
    module, hass, coord = env
    sensor = _add(module, hass, coord, module.WatchSubscribedEntitiesSensor)
    t0 = hass.loop.now
    coord.poll(hass, "w1", entities={"light.a"})
    assert sensor.writes == [1]

    # Inside the minute, a list change still writes at once.
    hass.loop.now = t0 + 5
    coord.poll(hass, "w1", entities={"light.a", "light.b"})
    assert sensor.writes == [1, 2]
    assert sensor.extra_state_attributes == {
        "entities": {"light.a": "Name of light.a", "light.b": "Name of light.b"}
    }

    # A plain poll only waits for the minute.
    hass.loop.now = t0 + 10
    coord.poll(hass, "w1")
    assert sensor.writes == [1, 2]
    hass.loop.now = t0 + 65
    hass.fire_due_timers()
    assert sensor.writes == [1, 2, 2]
