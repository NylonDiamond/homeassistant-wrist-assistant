"""In-process tests for the two global sensors that count over sessions.

Phone pages (app repo docs/phone_pages_mvp_2026-10.md, step 1): an iPhone
holds a /v2/delta long poll for its own pages, so the coordinator has a
session for it beside the watches'. Each sensor counts what its name says:

* "Connected watches" counts watch sessions only. A session whose device the
  secret store does not know is counted, as before.
* "Monitored entities" counts every device's subscriptions, a phone's
  included: Home Assistant monitors those entities for the phone too.

``sensor.py`` is loaded with the stubs ``test_watch_activity_throttle_inprocess``
uses.
"""

from __future__ import annotations

import asyncio
import sys
import types
from typing import Any

import pytest

from test_watch_activity_throttle_inprocess import _Coordinator, _Hass, _load_sensor


class _Secrets:
    def __init__(self, kinds: dict[str, str]) -> None:
        self._kinds = kinds

    def get(self, watch_id: str) -> Any:
        kind = self._kinds.get(watch_id)
        return None if kind is None else types.SimpleNamespace(device_kind=kind)


class _Registry:
    def async_get_device(self, identifiers: Any) -> Any:
        return types.SimpleNamespace(name="A device")


@pytest.fixture
def env():
    module, saved = _load_sensor()
    module.dr.async_get = lambda _hass: _Registry()
    hass = _Hass()
    hass.bus = types.SimpleNamespace(async_listen=lambda *_a, **_k: (lambda: None))
    yield module, hass, _Coordinator()
    for key in list(sys.modules):
        if key not in saved:
            del sys.modules[key]
    sys.modules.update(saved)


def _connected(module, hass, coord, secrets):  # noqa: ANN001
    coord.real_sessions = coord._sessions
    entry = types.SimpleNamespace(entry_id="entry")
    sensor = module.ConnectedWatchesSensor(coord, entry, secrets)
    sensor.hass = hass
    return sensor


def test_connected_watches_leaves_a_polling_phone_out(env) -> None:
    module, hass, coord = env
    secrets = _Secrets({"watch-A": "watch", "watch-B": "watch", "phone-1": "iphone"})
    sensor = _connected(module, hass, coord, secrets)
    assert sensor.native_value == 0
    coord.poll(hass, "watch-A")
    coord.poll(hass, "phone-1")
    assert sensor.native_value == 1
    coord.poll(hass, "watch-B")
    assert sensor.native_value == 2
    coord.drop("watch-A")
    assert sensor.native_value == 1


def test_connected_watches_still_counts_a_session_with_no_device(env) -> None:
    """A removal racing a poll leaves a session the secret store no longer
    knows. It was counted before phone pages and still is."""
    module, hass, coord = env
    sensor = _connected(module, hass, coord, _Secrets({}))
    coord.poll(hass, "watch-gone")
    assert sensor.native_value == 1


def test_monitored_entities_counts_a_phone_s_subscriptions_too(env) -> None:
    module, hass, coord = env
    coord.real_sessions = coord._sessions
    sensor = module.MonitoredEntitiesSensor(coord, types.SimpleNamespace(entry_id="entry"))
    sensor.hass = hass
    asyncio.run(sensor.async_added_to_hass())
    coord.poll(hass, "watch-A", {"light.kitchen", "light.hall"})
    coord.poll(hass, "phone-1", {"light.kitchen", "lock.front", "camera.door"})
    assert sensor.native_value == 5
    assert sensor.extra_state_attributes["per_watch_counts"] == {"watch-A": 2, "phone-1": 3}
