"""The panel's camera framing commands, with no Home Assistant.

Loads ``camera_framing_ws.py`` with stubbed Home Assistant modules over the
real crop, stream, aspect, widget secret and notification token stores and
the real ``camera_devices`` grouping (fed by fake entity and device
registries), with a fake connection like ``test_pairing_ws.py``.
``_deliver_push`` is a recorder on the stubbed package.
``test_ws_command_registration.py`` covers the registration and the admin
gate statically.
"""

from __future__ import annotations

import asyncio
import base64
import types
from dataclasses import dataclass
from typing import Any

import pytest

from test_widget_secret_user_binding import _PKG, _load, _loaded_store, _stub, _User

DOMAIN = "wrist_assistant"
SECRET = base64.b64encode(b"a" * 32).decode()
# widget_secret_store.LABEL_IPHONE_SELF_PROVISION: the label that makes an
# entry an iPhone (``device_kind``).
IPHONE_LABEL = "iphone-self-provision"

ROOT = _User("root", is_admin=True)

SD = "camera.front_door_fluent"
HD = "camera.front_door_clear"
SNAP = "camera.front_door_snapshots_fluent"


@dataclass
class _Viewport:
    x: float = 0.0
    y: float = 0.0
    w: float = 1.0
    h: float = 1.0


class _Marker:
    def __init__(self, *args: object, **kwargs: object) -> None:
        self.args = args


class _HomeAssistantError(Exception):
    pass


class _Connection:
    def __init__(self, user: _User) -> None:
        self.user = user
        self.results: dict[int, Any] = {}
        self.errors: list[tuple[int, str, str]] = []

    def send_result(self, msg_id: int, payload: Any) -> None:
        self.results[msg_id] = payload

    def send_error(self, msg_id: int, code: str, message: str) -> None:
        self.errors.append((msg_id, code, message))


class _EntityRegistry:
    def __init__(self) -> None:
        self.entities: dict[str, types.SimpleNamespace] = {}

    def add(self, entity_id: str, device_id: str | None, platform: str = "reolink") -> None:
        self.entities[entity_id] = types.SimpleNamespace(
            entity_id=entity_id,
            domain=entity_id.split(".", 1)[0],
            disabled_by=None,
            device_id=device_id,
            platform=platform,
            name=None,
            original_name=None,
        )


class _DeviceRegistry:
    def __init__(self) -> None:
        self.devices: dict[str, types.SimpleNamespace] = {}

    def add(self, device_id: str, name: str) -> None:
        self.devices[device_id] = types.SimpleNamespace(
            name=name, name_by_user=None, manufacturer="Reolink", model="Doorbell"
        )

    def async_get(self, device_id: str) -> Any:
        return self.devices.get(device_id)


class _States:
    def __init__(self) -> None:
        self.states: list[types.SimpleNamespace] = []

    def add(self, entity_id: str, name: str) -> None:
        self.states.append(
            types.SimpleNamespace(
                entity_id=entity_id, name=name, attributes={"friendly_name": name}
            )
        )

    def async_all(self, domain: str) -> list[types.SimpleNamespace]:
        return [s for s in self.states if s.entity_id.startswith(f"{domain}.")]


@pytest.fixture
def env():
    with _loaded_store() as secret_mod:
        entity_registry = _EntityRegistry()
        device_registry = _DeviceRegistry()
        pushes: list[dict[str, Any]] = []
        push_outcome: dict[str, Any] = {"result": {"sent": 1, "failed": 0, "failures": {}}}

        _stub("homeassistant.core", callback=lambda func: func)
        _stub("homeassistant.exceptions", HomeAssistantError=_HomeAssistantError)
        _stub("homeassistant.components")
        _stub(
            "homeassistant.components.websocket_api",
            ActiveConnection=type("ActiveConnection", (), {}),
            async_register_command=lambda hass, func: None,
            require_admin=lambda func: func,
            websocket_command=lambda schema: (lambda func: func),
            async_response=lambda func: func,
        )
        _stub("homeassistant.helpers.device_registry", async_get=lambda _hass: device_registry)
        _stub("homeassistant.helpers.entity_registry", async_get=lambda _hass: entity_registry)
        _stub("voluptuous", Required=_Marker, Optional=_Marker, Any=lambda *args: args)
        _stub(
            f"{_PKG}.const",
            DOMAIN=DOMAIN,
            SNAPSHOT_CROP_STORAGE_KEY="wrist_assistant.snapshot_crops",
            SNAPSHOT_CROP_STORAGE_VERSION=1,
            SNAPSHOT_STREAM_STORAGE_KEY="wrist_assistant.snapshot_streams",
            SNAPSHOT_STREAM_STORAGE_VERSION=1,
            SNAPSHOT_ASPECT_STORAGE_KEY="wrist_assistant.snapshot_aspects",
            SNAPSHOT_ASPECT_STORAGE_VERSION=1,
            NOTIFICATION_TOKEN_STORAGE_KEY="wrist_assistant.notification_tokens",
            NOTIFICATION_TOKEN_STORAGE_VERSION=1,
        )
        _stub(
            f"{_PKG}.camera_stream",
            ViewportState=_Viewport,
            viewport_matches=lambda request, saved: request == (saved or _Viewport()),
        )

        async def _deliver_push(hass, data, **kwargs):
            pushes.append(kwargs)
            if "error" in push_outcome:
                raise _HomeAssistantError(push_outcome["error"])
            return push_outcome["result"]

        _stub(_PKG, _deliver_push=_deliver_push)

        _load("camera_devices")
        crop_mod = _load("snapshot_crop_store")
        stream_mod = _load("snapshot_stream_store")
        aspect_mod = _load("snapshot_aspect_store")
        notifications = _load("notifications")
        ws = _load("camera_framing_ws")

        states = _States()
        hass = types.SimpleNamespace(states=states, data={})
        data = types.SimpleNamespace(
            snapshot_crop_store=crop_mod.SnapshotCropStore(hass),
            snapshot_stream_store=stream_mod.SnapshotStreamStore(hass),
            snapshot_aspect_store=aspect_mod.SnapshotAspectStore(hass),
            widget_secret_store=secret_mod.WidgetSecretStore(hass),
            notification_store=notifications.NotificationTokenStore(hass),
        )
        asyncio.run(data.widget_secret_store.async_load())
        hass.data[DOMAIN] = data
        yield types.SimpleNamespace(
            ws=ws,
            hass=hass,
            data=data,
            states=states,
            entity_registry=entity_registry,
            device_registry=device_registry,
            pushes=pushes,
            push_outcome=push_outcome,
        )


def _front_door(env) -> None:
    env.device_registry.add("dev-front", "Front door")
    for entity_id in (SD, HD, SNAP):
        env.entity_registry.add(entity_id, "dev-front")
        env.states.add(entity_id, f"Front door {entity_id}")


def _call(env, command, user: _User = ROOT, **msg) -> _Connection:
    connection = _Connection(user)
    outcome = command(env.hass, connection, {"id": 1, **msg})
    if asyncio.iscoroutine(outcome):
        asyncio.run(outcome)
    return connection


def _ok(env, command, **msg) -> Any:
    connection = _call(env, command, **msg)
    assert connection.errors == [], connection.errors
    return connection.results[1]


def _error(env, command, **msg) -> tuple[str, str]:
    connection = _call(env, command, **msg)
    assert connection.results == {}
    [(_id, code, message)] = connection.errors
    return code, message


# ── list ─────────────────────────────────────────────────────────────────


def test_list_with_no_cameras_is_empty(env) -> None:
    assert _ok(env, env.ws.ws_cameras_list) == {"cameras": []}


def test_list_names_a_device_as_the_phone_did(env) -> None:
    _front_door(env)
    [row] = _ok(env, env.ws.ws_cameras_list)["cameras"]
    assert row == {
        # The HD stream is the representative, as the phone picked it.
        "entity_id": HD,
        "name": "Front door",
        "all_entity_ids": sorted([SD, HD, SNAP]),
        "viewport": None,
        "open_zoomed": False,
        # Auto is the SD stream, as resolve_stream_sibling picks it.
        "stream": {"override": None, "auto": SD},
        # A snapshot variant cannot open as a live stream.
        "stream_choices": [HD, SD],
    }


def test_list_reflects_a_saved_crop_and_a_stream_override(env) -> None:
    _front_door(env)
    env.data.snapshot_crop_store.set(HD, _Viewport(x=0.1, y=0.2, w=0.5, h=0.5))
    env.data.snapshot_crop_store.set_open_zoomed(HD, True)
    env.data.snapshot_stream_store.set(HD, HD)
    [row] = _ok(env, env.ws.ws_cameras_list)["cameras"]
    assert row["viewport"] == {"x": 0.1, "y": 0.2, "w": 0.5, "h": 0.5}
    assert row["open_zoomed"] is True
    assert row["stream"] == {"override": HD, "auto": SD}


def test_a_camera_with_no_registry_entry_is_a_row_of_its_own(env) -> None:
    _front_door(env)
    env.states.add("camera.yaml_garage", "Garage")
    rows = _ok(env, env.ws.ws_cameras_list)["cameras"]
    assert [row["name"] for row in rows] == ["Front door", "Garage"]
    garage = rows[1]
    assert garage["entity_id"] == "camera.yaml_garage"
    assert garage["all_entity_ids"] == ["camera.yaml_garage"]
    assert garage["stream"] == {"override": None, "auto": None}
    assert garage["stream_choices"] == ["camera.yaml_garage"]


# ── save ─────────────────────────────────────────────────────────────────


def test_save_writes_every_entity_id(env) -> None:
    _front_door(env)
    for entity_id in (SD, HD, SNAP):
        env.data.snapshot_aspect_store.set(entity_id, 1.5)
    result = _ok(
        env,
        env.ws.ws_cameras_save,
        entity_ids=[HD, SD, SNAP, HD],
        viewport={"x": 0.25, "y": 0.1, "w": 0.5, "h": 0.8},
        open_zoomed=True,
        stream_entity=HD,
    )
    assert result == {"ok": True, "count": 3}
    for entity_id in (SD, HD, SNAP):
        assert env.data.snapshot_crop_store.get(entity_id) == _Viewport(0.25, 0.1, 0.5, 0.8)
        assert env.data.snapshot_crop_store.get_open_zoomed(entity_id) is True
        assert env.data.snapshot_stream_store.get(entity_id) == HD
        # Re-framing drops the cached aspect.
        assert env.data.snapshot_aspect_store.get(entity_id) is None

    [row] = _ok(env, env.ws.ws_cameras_list)["cameras"]
    assert row["viewport"] == {"x": 0.25, "y": 0.1, "w": 0.5, "h": 0.8}
    assert row["stream"]["override"] == HD


def test_save_reads_width_and_height_as_the_v2_op_did(env) -> None:
    _ok(
        env,
        env.ws.ws_cameras_save,
        entity_ids=[HD],
        viewport={"x": 0, "y": 0, "width": 0.5, "height": 0.4},
    )
    assert env.data.snapshot_crop_store.get(HD) == _Viewport(0.0, 0.0, 0.5, 0.4)


@pytest.mark.parametrize(
    "viewport", [None, {"x": 0, "y": 0, "w": 1, "h": 1}, {}], ids=["null", "full", "empty"]
)
def test_save_of_the_full_frame_clears_the_crop(env, viewport) -> None:
    store = env.data.snapshot_crop_store
    for entity_id in (SD, HD):
        store.set(entity_id, _Viewport(0.1, 0.1, 0.5, 0.5))
        store.set_open_zoomed(entity_id, True)
    result = _ok(env, env.ws.ws_cameras_save, entity_ids=[SD, HD], viewport=viewport)
    assert result == {"ok": True, "count": 2}
    for entity_id in (SD, HD):
        assert store.get(entity_id) is None
        # Nothing to open zoomed into any more.
        assert store.get_open_zoomed(entity_id) is False


def test_save_leaves_what_it_is_not_sent_alone(env) -> None:
    crops = env.data.snapshot_crop_store
    streams = env.data.snapshot_stream_store
    crops.set(HD, _Viewport(0.1, 0.1, 0.5, 0.5))
    crops.set_open_zoomed(HD, True)
    streams.set(HD, SD)
    _ok(
        env,
        env.ws.ws_cameras_save,
        entity_ids=[HD],
        viewport={"x": 0.2, "y": 0.2, "w": 0.5, "h": 0.5},
    )
    assert crops.get(HD) == _Viewport(0.2, 0.2, 0.5, 0.5)
    assert crops.get_open_zoomed(HD) is True
    assert streams.get(HD) == SD


@pytest.mark.parametrize("cleared", [None, ""], ids=["null", "empty"])
def test_save_clears_the_stream_override(env, cleared) -> None:
    streams = env.data.snapshot_stream_store
    streams.set(HD, SD)
    streams.set(SD, SD)
    _ok(env, env.ws.ws_cameras_save, entity_ids=[HD, SD], viewport=None, stream_entity=cleared)
    assert streams.get(HD) is None
    assert streams.get(SD) is None


@pytest.mark.parametrize(
    "msg",
    [
        {"entity_ids": [HD, "light.porch"], "viewport": None},
        {"entity_ids": [], "viewport": None},
        {"entity_ids": ["camera."], "viewport": None},
        {"entity_ids": [HD], "viewport": {"x": "left", "y": 0, "w": 1, "h": 1}},
        {"entity_ids": [HD], "viewport": {"x": True, "y": 0, "w": 1, "h": 1}},
        {"entity_ids": [HD], "viewport": None, "open_zoomed": "yes"},
        {"entity_ids": [HD], "viewport": None, "stream_entity": "light.porch"},
    ],
    ids=[
        "not_a_camera",
        "no_ids",
        "bare_prefix",
        "text_edge",
        "bool_edge",
        "zoom_not_bool",
        "stream_not_camera",
    ],
)
def test_save_of_a_bad_payload_is_refused_and_writes_nothing(env, msg) -> None:
    crops = env.data.snapshot_crop_store
    crops.set(HD, _Viewport(0.1, 0.1, 0.5, 0.5))
    env.data.snapshot_stream_store.set(HD, SD)
    code, _message = _error(env, env.ws.ws_cameras_save, **msg)
    assert code == "invalid"
    assert crops.get(HD) == _Viewport(0.1, 0.1, 0.5, 0.5)
    assert env.data.snapshot_stream_store.get(HD) == SD


# ── test ─────────────────────────────────────────────────────────────────


def test_test_with_no_bound_device_answers_no_devices(env) -> None:
    # A watch of another user does not count.
    env.data.widget_secret_store.register("watch-chen", SECRET, "watch-self-provision", user_id="chen")
    env.data.notification_store.register("watch-chen", "token-chen", platform="watchos")
    result = _ok(env, env.ws.ws_cameras_test, camera=HD)
    assert result == {"ok": False, "sent": 0, "reason": "no_devices"}
    assert env.pushes == []


def test_test_with_a_device_but_no_token_answers_no_push_token(env) -> None:
    env.data.widget_secret_store.register("watch-root", SECRET, "watch-self-provision", user_id="root")
    result = _ok(env, env.ws.ws_cameras_test, camera=HD)
    assert result == {"ok": False, "sent": 0, "reason": "no_push_token"}
    assert env.pushes == []


def test_test_sends_to_the_caller_s_devices_with_the_camera(env) -> None:
    secrets = env.data.widget_secret_store
    tokens = env.data.notification_store
    secrets.register("watch-root", SECRET, "watch-self-provision", user_id="root")
    secrets.register("watch-chen", SECRET, "watch-self-provision", user_id="chen")
    tokens.register("watch-root", "token-root", platform="watchos")
    tokens.register("watch-chen", "token-chen", platform="watchos")

    result = _ok(env, env.ws.ws_cameras_test, camera=HD)
    assert result == {"ok": True, "sent": 1}
    [push] = env.pushes
    assert push == {
        "title": "Test notification",
        "message": "Camera framing test",
        "image_source": HD,
        "target_watch_ids": ["watch-root"],
    }

    _ok(env, env.ws.ws_cameras_test, camera=HD, title="Front door", message="Motion detected")
    assert env.pushes[1]["title"] == "Front door"
    assert env.pushes[1]["message"] == "Motion detected"


def test_test_with_a_watch_and_an_iphone_targets_only_the_watch(env) -> None:
    """A mirrored watch already reaches its iPhone; naming the phone too
    would target it a second time."""
    secrets = env.data.widget_secret_store
    tokens = env.data.notification_store
    secrets.register("watch-root", SECRET, "watch-self-provision", user_id="root")
    secrets.register("iphone:root", SECRET, IPHONE_LABEL, user_id="root")
    tokens.register("iphone:root", "token-phone", platform="ios")

    assert _ok(env, env.ws.ws_cameras_test, camera=HD) == {"ok": True, "sent": 1}
    [push] = env.pushes
    assert push["target_watch_ids"] == ["watch-root"]


def test_test_with_only_iphones_targets_the_iphones(env) -> None:
    secrets = env.data.widget_secret_store
    tokens = env.data.notification_store
    secrets.register("iphone:root", SECRET, IPHONE_LABEL, user_id="root")
    secrets.register("iphone:chen", SECRET, IPHONE_LABEL, user_id="chen")
    tokens.register("iphone:root", "token-phone", platform="ios")
    tokens.register("iphone:chen", "token-chen", platform="ios")

    assert _ok(env, env.ws.ws_cameras_test, camera=HD) == {"ok": True, "sent": 1}
    [push] = env.pushes
    assert push["target_watch_ids"] == ["iphone:root"]


def test_test_that_sends_nothing_is_not_ok(env) -> None:
    env.data.widget_secret_store.register("watch-root", SECRET, "watch-self-provision", user_id="root")
    env.data.notification_store.register("watch-root", "token-root", platform="watchos")
    env.push_outcome["result"] = {"sent": 0, "failed": 1, "failures": {}}
    assert _ok(env, env.ws.ws_cameras_test, camera=HD) == {"ok": False, "sent": 0}


def test_a_failed_delivery_is_the_error_failed(env) -> None:
    env.data.widget_secret_store.register("watch-root", SECRET, "watch-self-provision", user_id="root")
    env.data.notification_store.register("watch-root", "token-root", platform="watchos")
    env.push_outcome["error"] = "APNs client failed to initialize."
    code, message = _error(env, env.ws.ws_cameras_test, camera=HD)
    assert code == "failed"
    assert message == "APNs client failed to initialize."


def test_test_of_a_non_camera_is_invalid(env) -> None:
    assert _error(env, env.ws.ws_cameras_test, camera="light.porch")[0] == "invalid"


def test_test_without_notifications_is_unavailable(env) -> None:
    env.data.notification_store = None
    assert _error(env, env.ws.ws_cameras_test, camera=HD)[0] == "unavailable"


# ── not loaded ───────────────────────────────────────────────────────────


def test_every_command_answers_unavailable_while_not_loaded(env) -> None:
    env.hass.data.clear()
    assert _error(env, env.ws.ws_cameras_list)[0] == "unavailable"
    assert _error(env, env.ws.ws_cameras_save, entity_ids=[HD], viewport=None)[0] == "unavailable"
    assert _error(env, env.ws.ws_cameras_test, camera=HD)[0] == "unavailable"
