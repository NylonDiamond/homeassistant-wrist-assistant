"""In-process tests for the step 6 push ops and push token readers.

The same approach as ``test_watch_config_ops_inprocess.py``: the handlers are
pulled out of ``wa_v2_views.py`` by name and run in a namespace of stand-ins,
against a real ``NotificationTokenStore``. They cover both caller shapes the
integration now meets:

* the new app (``push_paired_by_user``): an iPhone that names no watch. Its
  ``ios`` token files under itself, its status reply counts its user's
  watches, and its test push routes as a real alert.
* an older app: an iPhone naming ``companion_watch_id``. Its token still
  files under the phone, the companion is still checked (403 for a watch it
  does not own), and the replies speak about that watch with "ios" in the
  platforms, so its rows stay green.

The binary sensors' readers sit at the bottom, built without Home Assistant.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import importlib.util
import logging
import sys
import types
from pathlib import Path
from typing import Any

import pytest

from test_notification_tokens import _loaded_notifications

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_MODULE = _PKG_DIR / "wa_v2_views.py"
_LAZY_PKG = "wa_push_ops_test_pkg"

_NAMES = (
    "_resolve_companion_target",
    "_caller_is_iphone",
    "_push_status_fields",
    "_op_notifications_register",
    "_op_notifications_status",
    "_op_send_test_notification",
)


class _Response:
    def __init__(self, status: int = 200, body: Any = None, text: str | None = None) -> None:
        self.status = status
        self.body = body
        self.text = text


class _HomeAssistantError(Exception):
    pass


class _Secrets:
    def __init__(self, entries: dict[str, Any]) -> None:
        self.entries = entries

    def get(self, device_id: str) -> Any:
        return self.entries.get(device_id)

    @property
    def all_entries(self) -> dict[str, Any]:
        return dict(self.entries)


def _phone(user_id: str | None = "u1") -> Any:
    return types.SimpleNamespace(device_kind="iphone", user_id=user_id, owner_iphone_id=None)


def _watch(user_id: str | None = "u1", owner: str | None = None) -> Any:
    return types.SimpleNamespace(device_kind="watch", user_id=user_id, owner_iphone_id=owner)


class _Hass:
    def __init__(self) -> None:
        self.tasks: list[Any] = []

    def async_create_task(self, coro, name: str | None = None) -> None:
        coro.close()
        self.tasks.append(name)


class _Env:
    def __init__(self, notif: Any, entries: dict[str, Any]) -> None:
        self.notif = notif
        self.tokens = notif.NotificationTokenStore(object())
        self.secrets = _Secrets(entries)
        self.hass = _Hass()
        self.prebound: list[tuple[str, str]] = []
        self.delivered: list[list[str]] = []
        self.domain_data = types.SimpleNamespace(
            notification_store=self.tokens, widget_secret_store=self.secrets
        )
        self.views = self._handlers()

    def _handlers(self) -> dict[str, Any]:
        tree = ast.parse(_MODULE.read_text(), filename=str(_MODULE))
        wanted = [
            node
            for node in tree.body
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in _NAMES
        ]
        assert sorted(n.name for n in wanted) == sorted(_NAMES)
        code = compile(
            ast.Module(body=wanted, type_ignores=[]),
            str(_MODULE),
            "exec",
            flags=__future__.annotations.compiler_flag,
            dont_inherit=True,
        )
        env = self

        async def _deliver_push(hass, data, *, target_watch_ids=None, **_kwargs):
            env.delivered.append(list(target_watch_ids or []))
            routes = env.notif.resolve_push_routes(
                env.secrets.all_entries,
                env.tokens.all_entries,
                env.tokens.delivery_modes(),
                target_watch_ids,
            )
            return {"sent": len(routes), "failed": 0, "failures": {}}

        # The test op imports _deliver_push lazily from its package.
        lazy = types.ModuleType(_LAZY_PKG)
        lazy.__path__ = []
        lazy._deliver_push = _deliver_push
        sys.modules[_LAZY_PKG] = lazy

        namespace: dict[str, Any] = {
            "__name__": f"{_LAZY_PKG}.wa_v2_views",
            "__package__": _LAZY_PKG,
            "Any": Any,
            "Response": _Response,
            "HomeAssistantError": _HomeAssistantError,
            "_LOGGER": logging.getLogger("test_push_ops"),
            "PLATFORM_IOS": self.notif.PLATFORM_IOS,
            "DELIVERY_MODE_MIRROR": self.notif.DELIVERY_MODE_MIRROR,
            "is_iphone_entry": self.notif.is_iphone_entry,
            "phone_watch_ids": self.notif.phone_watch_ids,
            "resolve_push_routes": self.notif.resolve_push_routes,
            "log_push_token_registered": lambda *a, **k: None,
            "_prebind_relay_token": lambda hass, data, wid, platform: env.prebound.append(
                (wid, platform)
            ),
            "WEBHOOK_ID_METADATA_KEY": "webhook_id",
            "async_sync_webhook_devices": self._sync_webhook,
        }
        exec(code, namespace)  # noqa: S102
        return namespace

    async def _sync_webhook(self, data, watch_id):
        return None

    def call(self, op: str, signer: str, payload: dict) -> _Response:
        secret = self.secrets.get(signer)
        ctx = types.SimpleNamespace(
            hass=self.hass,
            domain_data=self.domain_data,
            payload=payload,
            watch_id=signer,
            user_id=getattr(secret, "user_id", None),
            op=op,
            signed_json=lambda body, status=200: _Response(status=status, body=body),
        )
        return asyncio.run(self.views[f"_op_{op}"](ctx))


@pytest.fixture
def notif():
    # Everything a test adds to sys.modules (the lazy package, the stubbed
    # binary_sensor) goes when this context restores it.
    with _loaded_notifications() as loaded:
        yield loaded


@pytest.fixture
def env(notif):
    """One user with a phone and two watches, and another user's watch."""
    return _Env(
        notif,
        {
            "p1": _phone("u1"),
            "w1": _watch("u1", owner="p1"),
            "w2": _watch("u1", owner="p1"),
            "p2": _phone("u2"),
            "w9": _watch("u2", owner="p2"),
        },
    )


def _register(env, signer: str, token: str, **extra) -> _Response:
    return env.call(
        "notifications_register",
        signer,
        {"device_token": token, "platform": "ios", **extra},
    )


# ── notifications_register ───────────────────────────────────────────────


def test_an_ios_token_files_under_the_phone_that_signed(env) -> None:
    reply = _register(env, "p1", "P1")
    assert reply.status == 200
    assert sorted(env.tokens.all_entries) == ["p1"]
    assert env.tokens.get_entry("p1", "ios").device_token == "P1"
    assert env.prebound == [("p1", "ios")]
    assert reply.body == {"ok": True, "platforms": ["ios"], "watches": 2, "fast_watches": 2}


def test_an_old_app_naming_its_watch_still_files_under_the_phone(env) -> None:
    env.tokens.register("w1", "W1", platform="watchos")
    reply = _register(env, "p1", "P1", companion_watch_id="w1")
    assert reply.status == 200
    assert env.tokens.get_entry("p1", "ios").device_token == "P1"
    assert env.tokens.get_entry("w1", "ios") is None
    # The reply speaks about the watch, with "ios" in it, as the old app expects.
    assert reply.body == {"ok": True, "platforms": ["ios", "watchos"], "delivery_mode": "mirror"}


def test_the_companion_check_still_refuses_another_user_s_watch(env) -> None:
    reply = _register(env, "p1", "P1", companion_watch_id="w9")
    assert reply.status == 403
    assert env.tokens.all_entries == {}


def test_the_companion_check_still_refuses_a_watch_another_phone_owns(env) -> None:
    env.secrets.entries["w3"] = _watch(None, owner="p2")
    assert _register(env, "p1", "P1", companion_watch_id="w3").status == 403


def test_registering_drops_the_phone_s_copy_under_a_watch(env) -> None:
    env.tokens.register("w1", "W1", platform="watchos")
    env.tokens.register("w1", "P1", platform="ios")
    _register(env, "p1", "P1")
    assert sorted(env.tokens.get_entries("w1")) == ["watchos"]
    assert env.tokens.get_entry("p1", "ios").device_token == "P1"


def test_a_watch_registration_is_unchanged(env) -> None:
    reply = env.call(
        "notifications_register", "w1", {"device_token": "W1", "platform": "watchos"}
    )
    assert env.tokens.get_entry("w1", "watchos").device_token == "W1"
    assert reply.body == {"ok": True, "platforms": ["watchos"], "delivery_mode": "mirror"}


# ── notifications_status ─────────────────────────────────────────────────


def test_status_for_a_phone_counts_its_user_s_watches_and_fast_ones(env) -> None:
    env.tokens.set_watch_metadata("w2", "delivery_mode", "direct")
    env.tokens.set_watch_metadata("w9", "delivery_mode", "mirror")
    _register(env, "p1", "P1")
    reply = env.call("notifications_status", "p1", {})
    assert reply.body == {"ok": True, "platforms": ["ios"], "watches": 2, "fast_watches": 1}


def test_status_for_a_phone_with_no_token_and_no_watch(env) -> None:
    env.secrets.entries["p3"] = _phone("u3")
    reply = env.call("notifications_status", "p3", {})
    assert reply.body == {"ok": True, "platforms": [], "watches": 0, "fast_watches": 0}


def test_status_for_an_unbound_phone_counts_the_watches_naming_it(env) -> None:
    env.secrets.entries["p4"] = _phone(None)
    env.secrets.entries["w4"] = _watch(None, owner="p4")
    reply = env.call("notifications_status", "p4", {})
    assert (reply.body["watches"], reply.body["fast_watches"]) == (1, 1)


def test_status_for_an_old_app_keeps_its_row_green(env) -> None:
    env.tokens.set_watch_metadata("w1", "delivery_mode", "mirror")
    _register(env, "p1", "P1")
    reply = env.call("notifications_status", "p1", {"companion_watch_id": "w1"})
    assert reply.body == {"ok": True, "platforms": ["ios"], "delivery_mode": "mirror"}


def test_status_for_an_old_app_without_a_token_has_no_ios(env) -> None:
    env.tokens.register("w1", "W1", platform="watchos")
    reply = env.call("notifications_status", "p1", {"companion_watch_id": "w1"})
    assert reply.body["platforms"] == ["watchos"]


def test_status_still_refuses_another_user_s_watch(env) -> None:
    assert env.call("notifications_status", "p1", {"companion_watch_id": "w9"}).status == 403


# ── send_test_notification ───────────────────────────────────────────────


def test_a_phone_s_test_push_routes_to_its_user_s_watches(env) -> None:
    _register(env, "p1", "P1")
    reply = env.call("send_test_notification", "p1", {})
    assert reply.body == {"ok": True, "sent": 1}
    assert env.delivered == [["w1", "w2"]]


def test_a_phone_with_no_watch_tests_itself(env) -> None:
    env.secrets.entries["p3"] = _phone("u3")
    _register(env, "p3", "P3")
    reply = env.call("send_test_notification", "p3", {})
    assert reply.body == {"ok": True, "sent": 1}
    assert env.delivered == [["p3"]]


def test_a_phone_with_no_token_anywhere_is_no_push_token(env) -> None:
    reply = env.call("send_test_notification", "p1", {})
    assert reply.body == {"ok": False, "reason": "no_push_token"}
    assert env.delivered == []


def test_an_old_app_s_test_push_targets_the_named_watch(env) -> None:
    """Its token now lives under the phone, and the watch routes to it."""
    _register(env, "p1", "P1", companion_watch_id="w1")
    reply = env.call("send_test_notification", "p1", {"companion_watch_id": "w1"})
    assert reply.body == {"ok": True, "sent": 1}
    assert env.delivered == [["w1"]]


def test_an_old_app_s_test_push_is_refused_for_another_user_s_watch(env) -> None:
    reply = env.call("send_test_notification", "p1", {"companion_watch_id": "w9"})
    assert reply.status == 403


def test_a_watch_s_test_push_targets_itself(env) -> None:
    env.tokens.register("w1", "W1", platform="watchos")
    env.tokens.set_watch_metadata("w1", "delivery_mode", "direct")
    reply = env.call("send_test_notification", "w1", {})
    assert reply.body == {"ok": True, "sent": 1}
    assert env.delivered == [["w1"]]


# ── the binary sensors' readers ──────────────────────────────────────────


def _binary_sensor_module(notif: Any) -> Any:
    """``binary_sensor.py`` with Home Assistant stubbed, sharing ``notif``."""
    pkg_name = notif.__name__.rpartition(".")[0]

    def stub(name: str, **attrs: Any) -> None:
        module = sys.modules.get(name) or types.ModuleType(name)
        for key, value in attrs.items():
            setattr(module, key, value)
        sys.modules[name] = module

    stub("homeassistant.components")
    stub("homeassistant.components.binary_sensor", BinarySensorEntity=object)
    stub("homeassistant.config_entries", ConfigEntry=object)
    stub("homeassistant.const", EntityCategory=types.SimpleNamespace(DIAGNOSTIC="diagnostic"))
    stub("homeassistant.core", HomeAssistant=object, callback=lambda f: f)
    stub("homeassistant.helpers.entity_registry")
    stub("homeassistant.helpers.entity_platform", AddEntitiesCallback=object)
    stub(f"{pkg_name}.const", DOMAIN="wrist_assistant", WristAssistantConfigEntry=object)
    stub(
        f"{pkg_name}.widget_secret_store",
        DEVICE_KIND_IPHONE="iphone",
        DEVICE_KIND_WATCH="watch",
        WidgetSecretStore=object,
        build_device_info=lambda *a, **k: None,
    )
    spec = importlib.util.spec_from_file_location(
        f"{pkg_name}.binary_sensor", _PKG_DIR / "binary_sensor.py"
    )
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def _sensor(cls: Any, env: _Env, **attrs: Any) -> Any:
    sensor = cls.__new__(cls)
    sensor._secret_store = env.secrets
    sensor._notification_store = env.tokens
    for key, value in attrs.items():
        setattr(sensor, key, value)
    return sensor


def test_the_iphone_sensor_reads_the_phone_s_own_token(env, notif) -> None:
    module = _binary_sensor_module(notif)
    sensor = _sensor(module.IPhonePushTokenRegisteredSensor, env, _iphone_id="p1")
    assert sensor.is_on is False
    _register(env, "p1", "P1")
    assert sensor.is_on is True


def test_the_iphone_sensor_still_reads_a_leftover_under_its_watch(env, notif) -> None:
    module = _binary_sensor_module(notif)
    sensor = _sensor(module.IPhonePushTokenRegisteredSensor, env, _iphone_id="p1")
    env.tokens.register("w1", "OLD", platform="ios")
    assert sensor.is_on is True


def test_the_watch_sensor_counts_the_phones_a_fast_alert_reaches(env, notif) -> None:
    module = _binary_sensor_module(notif)
    sensor = _sensor(module.WatchPushTokenRegisteredSensor, env, _watch_id="w1")
    env.tokens.register("w1", "W1", platform="watchos")
    assert sensor.extra_state_attributes["phones"] == 0
    _register(env, "p1", "P1")
    env.secrets.entries["p5"] = _phone("u1")
    _register(env, "p5", "P5")
    _register(env, "p2", "P2")  # another user's phone
    attrs = sensor.extra_state_attributes
    assert attrs["phones"] == 2
    assert attrs["platforms"] == ["watchos"]


# ── static: the capability ───────────────────────────────────────────────


def test_the_push_paired_by_user_capability_is_advertised() -> None:
    """The phone stops naming a watch only when it sees this."""
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    assert "register_capability(PUSH_PAIRED_BY_USER_CAPABILITY)" in init
    assert 'PUSH_PAIRED_BY_USER_CAPABILITY = "push_paired_by_user"' in const


def test_setup_moves_the_ios_tokens_after_both_stores_load() -> None:
    """The move needs the secret store's entries, so it runs after both load."""
    init = (_PKG_DIR / "__init__.py").read_text()
    tokens_loaded = init.index("await notification_store.async_load()")
    secrets_loaded = init.index("await widget_secret_store.async_load()")
    moved = init.index(
        "notification_store.migrate_ios_tokens_to_phones(widget_secret_store.all_entries)"
    )
    assert tokens_loaded < moved and secrets_loaded < moved


def test_send_notification_routes_through_resolve_push_routes() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    assert "routes = resolve_push_routes(" in init
    assert "_choose_token" not in init
