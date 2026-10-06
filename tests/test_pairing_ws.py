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
import logging
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


def _gone(user_id: str, *, is_active: bool = True, system_generated: bool = False) -> _User:
    user = _User(user_id)
    user.is_active = is_active
    user.system_generated = system_generated
    return user


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
            async_response=lambda func: func,
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
        users = {
            user.id: user
            for user in (
                ROOT,
                _User("chen"),
                _User("pat", is_admin=True),
                _gone("retired", is_active=False),
                _gone("supervisor", system_generated=True),
            )
        }

        async def async_get_user(user_id: str) -> _User | None:
            return users.get(user_id)

        hass = types.SimpleNamespace(
            auth=types.SimpleNamespace(async_get_user=async_get_user),
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


def _pending(env, secret: str = SECRET_A, remote: str | None = None, **extra: Any):
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
    return env.pair_store.start(fields, remote=remote)


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


# ── lookup ───────────────────────────────────────────────────────────────


def test_lookup_finds_a_code_as_typed(env) -> None:
    pending = _pending(env, remote="192.0.2.7")
    env.clock.now += 30
    typed = f"  {pending.code[:3].lower()}-{pending.code[3:].lower()} "
    result = _ok(env, env.ws.ws_pair_lookup, code=typed)
    assert result == {
        "found": True,
        "watch_id": WATCH,
        "device_name": "Test Watch",
        "screen_size": "208x248",
        "app_version": "3.0.1",
        "app_build": "2",
        "expires_in": 570,
        "remote": "192.0.2.7",
        "age_seconds": 30,
        "already_paired": False,
        "paired_by_other_user": False,
        "bound_user_id": None,
    }
    # Looking up changes nothing.
    assert env.pair_store.get(pending.code) is pending
    assert env.secret_store.all_watch_ids == []


def test_lookup_of_a_request_with_no_address_reports_null(env) -> None:
    pending = _pending(env)
    env.clock.now += 0.9
    result = _ok(env, env.ws.ws_pair_lookup, code=pending.code)
    assert result["remote"] is None
    assert result["age_seconds"] == 0


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
    assert result["bound_user_id"] == "bob"


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
    assert result == {
        "ok": True,
        "watch_id": WATCH,
        "device_name": "Test Watch",
        "result": "new",
        "user_id": "root",
    }

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


def test_taking_over_another_user_s_watch_is_logged_as_a_warning(env, caplog) -> None:
    env.secret_store.register(WATCH, SECRET_B, "watch-self-provision", user_id="bob")
    pending = _pending(env)
    with caplog.at_level(logging.WARNING, logger=env.ws.__name__):
        _ok(env, env.ws.ws_pair_confirm, code=pending.code)
    warnings = [r for r in caplog.records if r.levelno == logging.WARNING]
    assert len(warnings) == 1
    message = warnings[0].getMessage()
    assert WATCH in message
    assert "from user bob to user root" in message


def test_rekeying_one_s_own_or_an_unbound_watch_warns_nothing(env, caplog) -> None:
    env.secret_store.register(WATCH, SECRET_B, "watch-self-provision", user_id="root")
    env.secret_store.register("watch-unbound", SECRET_B, "watch-self-provision")
    with caplog.at_level(logging.WARNING, logger=env.ws.__name__):
        _ok(env, env.ws.ws_pair_confirm, code=_pending(env).code)
        _ok(env, env.ws.ws_pair_confirm, code=_pending(env, watch_id="watch-unbound").code)
    assert [r for r in caplog.records if r.levelno >= logging.WARNING] == []


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


# ── whose watch it is ────────────────────────────────────────────────────


def test_confirm_binds_the_user_the_admin_picked(env) -> None:
    pending = _pending(env)
    result = _ok(env, env.ws.ws_pair_confirm, code=pending.code, user_id="chen")
    assert result["user_id"] == "chen"
    entry = env.secret_store.get(WATCH)
    assert entry.user_id == "chen"
    assert entry.owner_iphone_id is None
    assert len(env.pair_store) == 0


def test_confirm_may_pick_another_admin(env) -> None:
    _ok(env, env.ws.ws_pair_confirm, code=_pending(env).code, user_id="pat")
    assert env.secret_store.get(WATCH).user_id == "pat"


def test_confirm_without_a_user_binds_the_confirming_admin(env) -> None:
    """An older panel sends no user_id; it keeps working as before."""
    result = _ok(env, env.ws.ws_pair_confirm, code=_pending(env).code)
    assert result["user_id"] == "root"
    assert env.secret_store.get(WATCH).user_id == "root"


def test_naming_oneself_is_the_same_as_naming_no_one(env) -> None:
    _ok(env, env.ws.ws_pair_confirm, code=_pending(env).code, user_id="root")
    assert env.secret_store.get(WATCH).user_id == "root"


@pytest.mark.parametrize("user_id", ["nobody", "retired", "supervisor", ""])
def test_confirm_refuses_a_missing_inactive_or_system_user(env, user_id: str) -> None:
    pending = _pending(env)
    code, message = _error(env, env.ws.ws_pair_confirm, code=pending.code, user_id=user_id)
    assert code == "invalid_user"
    assert "active Home Assistant user" in message
    # Nothing written, and the code still works for a corrected pick.
    assert env.secret_store.all_watch_ids == []
    assert env.logbook == []
    assert env.pair_store.get(pending.code) is pending
    _ok(env, env.ws.ws_pair_confirm, code=pending.code, user_id="chen")
    assert env.secret_store.get(WATCH).user_id == "chen"


def test_a_non_admin_cannot_pick_another_user(env) -> None:
    """Unreachable behind require_admin; pinned with the gate stubbed open."""
    pending = _pending(env)
    connection = _call(
        env, env.ws.ws_pair_confirm, user=_User("chen"), code=pending.code, user_id="root"
    )
    [(_id, code, _message)] = connection.errors
    assert code == "unauthorized"
    assert env.secret_store.all_watch_ids == []
    assert env.pair_store.get(pending.code) is pending


def test_a_pick_that_moves_a_watch_is_logged_with_both_users(env, caplog) -> None:
    env.secret_store.register(WATCH, SECRET_B, "watch-self-provision", user_id="root")
    with caplog.at_level(logging.WARNING, logger=env.ws.__name__):
        _ok(env, env.ws.ws_pair_confirm, code=_pending(env).code, user_id="chen")
    [warning] = [r for r in caplog.records if r.levelno == logging.WARNING]
    assert "from user root to user chen" in warning.getMessage()
    assert env.secret_store.get(WATCH).user_id == "chen"


def test_re_pairing_for_the_user_it_is_bound_to_warns_nothing(env, caplog) -> None:
    env.secret_store.register(WATCH, SECRET_B, "watch-self-provision", user_id="chen")
    lookup = _ok(env, env.ws.ws_pair_lookup, code=_pending(env).code)
    assert lookup["bound_user_id"] == "chen"
    with caplog.at_level(logging.WARNING, logger=env.ws.__name__):
        _ok(env, env.ws.ws_pair_confirm, code=_pending(env).code, user_id="chen")
    assert [r for r in caplog.records if r.levelno >= logging.WARNING] == []
    assert env.secret_store.get(WATCH).user_id == "chen"


# ── not loaded ───────────────────────────────────────────────────────────


def test_both_commands_answer_unavailable_while_not_loaded(env) -> None:
    env.hass.data.clear()
    assert _error(env, env.ws.ws_pair_lookup, code="ABCDEF")[0] == "unavailable"
    assert _error(env, env.ws.ws_pair_confirm, code="ABCDEF")[0] == "unavailable"
