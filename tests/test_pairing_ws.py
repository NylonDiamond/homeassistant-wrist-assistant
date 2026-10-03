"""The panel's pairing-code commands, with no Home Assistant.

Loads ``pairing_ws.py`` with stubbed Home Assistant modules over a real
``WidgetSecretStore`` and a real ``PairRequestStore``, with a fake connection
like ``test_watch_config_ws.py``. The device registry and the Logbook
helpers are recorders. ``test_ws_command_registration.py`` covers the
registration and the admin gate statically.
"""

from __future__ import annotations

import asyncio
import base64
import importlib.util
import types
from typing import Any

import pytest

from test_pair_requests import loaded_pair_module
from test_widget_secret_user_binding import _PKG, _SRC, _loaded_store, _stub, _User

DOMAIN = "wrist_assistant"
SECRET_A = base64.b64encode(b"a" * 32).decode()
SECRET_B = base64.b64encode(b"b" * 32).decode()
WATCH = "watch-code-1"

ROOT = _User("root", is_admin=True)


class _Marker:
    def __init__(self, *args: object, **kwargs: object) -> None:
        self.args = args


class _Connection:
    def __init__(self, user: _User) -> None:
        self.user = user
        self.results: dict[int, Any] = {}
        self.errors: list[tuple[int, str, str]] = []

    def send_result(self, msg_id: int, payload: Any) -> None:
        self.results[msg_id] = payload

    def send_error(self, msg_id: int, code: str, message: str) -> None:
        self.errors.append((msg_id, code, message))


class _Registry:
    def __init__(self) -> None:
        self.devices: dict[str, types.SimpleNamespace] = {}
        self.updates: list[tuple[str, str]] = []

    def add(self, watch_id: str, name: str) -> None:
        self.devices[f"watch_{watch_id}"] = types.SimpleNamespace(id=f"dev-{watch_id}", name=name)

    def async_get_device(self, *, identifiers: set) -> Any:
        [(_domain, ident)] = identifiers
        return self.devices.get(ident)

    def async_update_device(self, device_id: str, *, name: str) -> None:
        self.updates.append((device_id, name))


class _Clock:
    def __init__(self) -> None:
        self.now = 10_000.0

    def __call__(self) -> float:
        return self.now


@pytest.fixture
def env():
    with _loaded_store() as store_mod, loaded_pair_module() as pair_mod:
        registry = _Registry()
        logbook: list[tuple[str, dict]] = []
        _stub("homeassistant.core", callback=lambda func: func)
        _stub("homeassistant.components")
        _stub(
            "homeassistant.components.websocket_api",
            ActiveConnection=type("ActiveConnection", (), {}),
            async_register_command=lambda hass, func: None,
            require_admin=lambda func: func,
            websocket_command=lambda schema: (lambda func: func),
        )
        _stub("homeassistant.helpers.device_registry", async_get=lambda _hass: registry)
        _stub("voluptuous", Required=_Marker, Optional=_Marker)
        _stub(f"{_PKG}.const", DOMAIN=DOMAIN)
        _stub(
            f"{_PKG}.logbook_events",
            log_secret_registered=lambda hass, **kw: logbook.append(("registered", kw)),
            log_secret_reprovisioned=lambda hass, **kw: logbook.append(("reprovisioned", kw)),
        )
        spec = importlib.util.spec_from_file_location(f"{_PKG}.pairing_ws", _SRC / "pairing_ws.py")
        ws = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(ws)

        secret_store = store_mod.WidgetSecretStore(object())
        asyncio.run(secret_store.async_load())
        clock = _Clock()
        pair_store = pair_mod.PairRequestStore(clock=clock)
        hass = types.SimpleNamespace(
            data={
                DOMAIN: types.SimpleNamespace(
                    widget_secret_store=secret_store, pair_request_store=pair_store
                )
            }
        )
        yield types.SimpleNamespace(
            ws=ws,
            hass=hass,
            secret_store=secret_store,
            pair_store=pair_store,
            pair_mod=pair_mod,
            clock=clock,
            registry=registry,
            logbook=logbook,
        )


def _pending(env, secret: str = SECRET_A, **extra: Any):
    fields, error = env.pair_mod.validate_pair_fields(
        {
            "watch_id": WATCH,
            "secret_b64": secret,
            "device_name": "Test Watch",
            "screen_size": "208x248",
            "app_version": "3.0.1",
            "app_build": "2",
            **extra,
        }
    )
    assert error is None
    return env.pair_store.start(fields)


def _call(env, command, user: _User = ROOT, **msg) -> _Connection:
    connection = _Connection(user)
    command(env.hass, connection, {"id": 1, **msg})
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


# ── lookup ───────────────────────────────────────────────────────────────


def test_lookup_finds_a_code_as_typed(env) -> None:
    pending = _pending(env)
    env.clock.now += 30
    result = _ok(env, env.ws.ws_pair_lookup, code=f"  {pending.code.lower()} ")
    assert result == {
        "found": True,
        "watch_id": WATCH,
        "device_name": "Test Watch",
        "screen_size": "208x248",
        "app_version": "3.0.1",
        "app_build": "2",
        "expires_in": 570,
        "already_paired": False,
        "paired_by_other_user": False,
    }
    # Looking up changes nothing.
    assert env.pair_store.get(pending.code) is pending
    assert env.secret_store.all_watch_ids == []


def test_lookup_of_an_unknown_code_is_not_found(env) -> None:
    assert _ok(env, env.ws.ws_pair_lookup, code="ZZZZZZ") == {"found": False}


def test_lookup_of_an_expired_code_is_not_found(env) -> None:
    pending = _pending(env)
    env.clock.now += 600
    assert _ok(env, env.ws.ws_pair_lookup, code=pending.code) == {"found": False}


def test_lookup_warns_about_a_watch_paired_by_someone_else(env) -> None:
    env.secret_store.register(WATCH, SECRET_B, "watch-self-provision", user_id="bob")
    pending = _pending(env)
    result = _ok(env, env.ws.ws_pair_lookup, code=pending.code)
    assert result["already_paired"] is True
    assert result["paired_by_other_user"] is True


def test_lookup_of_a_watch_this_user_paired_is_only_already_paired(env) -> None:
    env.secret_store.register(WATCH, SECRET_B, "watch-self-provision", user_id="root")
    pending = _pending(env)
    result = _ok(env, env.ws.ws_pair_lookup, code=pending.code)
    assert result["already_paired"] is True
    assert result["paired_by_other_user"] is False


# ── confirm ──────────────────────────────────────────────────────────────


def test_confirm_pairs_a_new_watch_bound_to_the_admin(env) -> None:
    pending = _pending(env)
    result = _ok(env, env.ws.ws_pair_confirm, code=pending.code.lower())
    assert result == {"ok": True, "watch_id": WATCH, "device_name": "Test Watch", "result": "new"}

    entry = env.secret_store.get(WATCH)
    assert entry.secret_b64 == SECRET_A
    assert entry.label == "watch-code-pair"
    assert entry.user_id == "root"
    assert entry.owner_iphone_id is None
    assert entry.device_name == "Test Watch"
    assert entry.screen_size == "208x248"
    assert entry.app_version == "3.0.1"
    assert entry.app_build == "2"
    assert entry.device_kind == "watch"
    assert env.logbook == [
        ("registered", {"watch_id": WATCH, "label": "watch-code-pair", "app_version": "3.0.1"})
    ]


def test_the_request_is_gone_after_a_confirm(env) -> None:
    pending = _pending(env)
    _ok(env, env.ws.ws_pair_confirm, code=pending.code)
    assert len(env.pair_store) == 0
    assert _ok(env, env.ws.ws_pair_lookup, code=pending.code) == {"found": False}
    code, _message = _error(env, env.ws.ws_pair_confirm, code=pending.code)
    assert code == "unknown_code"


def test_confirm_rekeys_a_known_watch_and_renames_its_device(env) -> None:
    env.secret_store.register(WATCH, SECRET_B, "watch-self-provision", user_id="bob")
    env.registry.add(WATCH, "Watch watch-co")
    pending = _pending(env)

    result = _ok(env, env.ws.ws_pair_confirm, code=pending.code)
    assert result["result"] == "rekey"
    entry = env.secret_store.get(WATCH)
    assert entry.secret_b64 == SECRET_A
    assert entry.user_id == "root"
    assert entry.label == "watch-code-pair"
    assert env.logbook[0][0] == "reprovisioned"
    assert env.registry.updates == [(f"dev-{WATCH}", "Test Watch")]


def test_confirm_leaves_a_device_alone_without_a_new_name(env) -> None:
    env.registry.add(WATCH, "Test Watch")
    pending = _pending(env)
    _ok(env, env.ws.ws_pair_confirm, code=pending.code)
    assert env.registry.updates == []

    pending = _pending(env, secret=SECRET_B, device_name=None)
    _ok(env, env.ws.ws_pair_confirm, code=pending.code)
    assert env.registry.updates == []


def test_the_same_pair_confirmed_again_is_idempotent(env) -> None:
    _ok(env, env.ws.ws_pair_confirm, code=_pending(env).code)
    result = _ok(env, env.ws.ws_pair_confirm, code=_pending(env).code)
    assert result["result"] == "idempotent"
    assert [kind for kind, _ in env.logbook] == ["registered"]


def test_confirm_of_an_expired_code_writes_nothing(env) -> None:
    pending = _pending(env)
    env.clock.now += 601
    code, message = _error(env, env.ws.ws_pair_confirm, code=pending.code)
    assert code == "unknown_code"
    assert "10 minutes" in message
    assert env.secret_store.all_watch_ids == []
    assert env.logbook == []


def test_confirm_of_an_unknown_code_is_refused(env) -> None:
    code, _message = _error(env, env.ws.ws_pair_confirm, code="ZZZZZZ")
    assert code == "unknown_code"


def test_a_non_admin_cannot_take_another_user_s_watch(env) -> None:
    """Unreachable behind require_admin; the check is kept to match
    register_secret, so it is pinned here with the gate stubbed open."""
    env.secret_store.register(WATCH, SECRET_B, "watch-self-provision", user_id="bob")
    pending = _pending(env)
    connection = _call(env, env.ws.ws_pair_confirm, user=_User("alice"), code=pending.code)
    [(_id, code, _message)] = connection.errors
    assert code == "paired_by_other_user"
    assert env.secret_store.get(WATCH).secret_b64 == SECRET_B
    assert env.pair_store.get(pending.code) is pending


# ── not loaded ───────────────────────────────────────────────────────────


def test_both_commands_answer_unavailable_while_not_loaded(env) -> None:
    env.hass.data.clear()
    assert _error(env, env.ws.ws_pair_lookup, code="ABCDEF")[0] == "unavailable"
    assert _error(env, env.ws.ws_pair_confirm, code="ABCDEF")[0] == "unavailable"
