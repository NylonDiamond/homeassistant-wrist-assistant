"""The panel's pairing commands, with no Home Assistant.

Loads ``pairing_ws.py`` with stubbed Home Assistant modules over a real
``WidgetSecretStore``, a real ``PairRequestStore`` and a real
``PairOfferStore``, with a fake connection like ``test_watch_config_ws.py``.
The device registry and the Logbook helpers are recorders.
``test_ws_command_registration.py`` covers the registration and the admin
gate statically.

Covered: the lookup and confirm of a code (old form and sealed, a watch and
an iPhone), the Replace and "I expect this watch" ticks, whose device it is,
and the QR offer commands (the link, the person, the cap, the status, the
cancel, the cloud address, and that the token is never logged).
"""

from __future__ import annotations

import asyncio
import base64
import contextlib
import hashlib
import importlib.util
import logging
import sys
import types
import urllib.parse
from typing import Any

import pytest
from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey

from test_pair_requests import loaded_pair_module
from test_widget_secret_user_binding import _PKG, _SRC, _loaded_store, _stub, _User

DOMAIN = "wrist_assistant"
SECRET_A = base64.b64encode(b"a" * 32).decode()
SECRET_B = base64.b64encode(b"b" * 32).decode()
WATCH = "watch-code-1"
PHONE = "iphone:phone-code-1"
INSTANCE_ID = "0123456789abcdef0123456789abcdef"

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


@contextlib.contextmanager
def pairing_env():
    """The real ``pairing_ws``, secret store, request store and offer store
    under stubs. Shared with ``test_pair_redeem.py``, whose view writes
    through ``store_paired_device``."""
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

        async def _instance_id(_hass) -> str:
            return INSTANCE_ID

        _stub("homeassistant.helpers.instance_id", async_get=_instance_id)
        _stub("voluptuous", Required=_Marker, Optional=_Marker, In=_Marker)
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

        offer_store = pair_mod.PairOfferStore(clock=clock)
        hass = types.SimpleNamespace(
            auth=types.SimpleNamespace(async_get_user=async_get_user),
            config=types.SimpleNamespace(
                internal_url="http://192.168.1.20:8123/",
                external_url="https://home.example.com",
                location_name="Tiny House",
                components={"http", "websocket_api"},
            ),
            data={
                DOMAIN: types.SimpleNamespace(
                    widget_secret_store=secret_store,
                    pair_request_store=pair_store,
                    pair_offer_store=offer_store,
                )
            },
        )
        yield types.SimpleNamespace(
            ws=ws,
            hass=hass,
            secret_store=secret_store,
            pair_store=pair_store,
            offer_store=offer_store,
            pair_mod=pair_mod,
            sealed=sys.modules[f"{_PKG}.sealed_box"],
            clock=clock,
            registry=registry,
            logbook=logbook,
            store_mod=store_mod,
        )


@pytest.fixture
def env():
    with pairing_env() as loaded:
        yield loaded


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
        "kind": "watch",
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
        "needs_replace": False,
        # 192.0.2.7 is a documentation address, outside any home network.
        "needs_allow_remote": True,
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
        "kind": "watch",
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

    result = _ok(env, env.ws.ws_pair_confirm, code=pending.code, replace=True)
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
        _ok(env, env.ws.ws_pair_confirm, code=pending.code, replace=True)
    warnings = [r for r in caplog.records if r.levelno == logging.WARNING]
    assert len(warnings) == 1
    message = warnings[0].getMessage()
    assert WATCH in message
    assert "from user bob to user root" in message


def test_rekeying_one_s_own_or_an_unbound_watch_warns_nothing(env, caplog) -> None:
    env.secret_store.register(WATCH, SECRET_B, "watch-self-provision", user_id="root")
    env.secret_store.register("watch-unbound", SECRET_B, "watch-self-provision")
    with caplog.at_level(logging.WARNING, logger=env.ws.__name__):
        _ok(env, env.ws.ws_pair_confirm, code=_pending(env).code, replace=True)
        _ok(
            env,
            env.ws.ws_pair_confirm,
            code=_pending(env, watch_id="watch-unbound").code,
            replace=True,
        )
    assert [r for r in caplog.records if r.levelno >= logging.WARNING] == []


def test_confirm_leaves_a_device_alone_without_a_new_name(env) -> None:
    env.registry.add(WATCH, "Test Watch")
    pending = _pending(env)
    _ok(env, env.ws.ws_pair_confirm, code=pending.code)
    assert env.registry.updates == []

    pending = _pending(env, secret=SECRET_B, device_name=None)
    _ok(env, env.ws.ws_pair_confirm, code=pending.code, replace=True)
    assert env.registry.updates == []


def test_the_same_pair_confirmed_again_is_idempotent(env) -> None:
    _ok(env, env.ws.ws_pair_confirm, code=_pending(env).code)
    result = _ok(env, env.ws.ws_pair_confirm, code=_pending(env).code, replace=True)
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
    connection = _call(
        env, env.ws.ws_pair_confirm, user=_User("alice"), code=pending.code, replace=True
    )
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
        _ok(env, env.ws.ws_pair_confirm, code=_pending(env).code, user_id="chen", replace=True)
    [warning] = [r for r in caplog.records if r.levelno == logging.WARNING]
    assert "from user root to user chen" in warning.getMessage()
    assert env.secret_store.get(WATCH).user_id == "chen"


def test_re_pairing_for_the_user_it_is_bound_to_warns_nothing(env, caplog) -> None:
    env.secret_store.register(WATCH, SECRET_B, "watch-self-provision", user_id="chen")
    lookup = _ok(env, env.ws.ws_pair_lookup, code=_pending(env).code)
    assert lookup["bound_user_id"] == "chen"
    with caplog.at_level(logging.WARNING, logger=env.ws.__name__):
        _ok(env, env.ws.ws_pair_confirm, code=_pending(env).code, user_id="chen", replace=True)
    assert [r for r in caplog.records if r.levelno >= logging.WARNING] == []
    assert env.secret_store.get(WATCH).user_id == "chen"


# ── not loaded ───────────────────────────────────────────────────────────


def test_both_commands_answer_unavailable_while_not_loaded(env) -> None:
    env.hass.data.clear()
    assert _error(env, env.ws.ws_pair_lookup, code="ABCDEF")[0] == "unavailable"
    assert _error(env, env.ws.ws_pair_confirm, code="ABCDEF")[0] == "unavailable"


# ── sealed code pairing ──────────────────────────────────────────────────


def _key_pair() -> tuple[bytes, str]:
    """A device's X25519 key pair: raw private bytes, public key as base64."""
    private = X25519PrivateKey.generate()
    public = private.public_key().public_bytes_raw()
    return private.private_bytes_raw(), base64.b64encode(public).decode()


def _sealed_pending(
    env, *, kind: str = "watch", watch_id: str = WATCH, remote: str | None = None
):
    private, public_b64 = _key_pair()
    start, error = env.pair_mod.validate_pair_start(
        {
            "watch_id": watch_id,
            "public_key_b64": public_b64,
            "kind": kind,
            "device_name": "Test Device",
            "app_version": "3.2.0",
            "app_build": "1",
        }
    )
    assert error is None, error
    pending = env.pair_store.start(
        start.fields, remote=remote, kind=start.kind, public_key=start.public_key
    )
    return pending, private


def test_a_sealed_confirm_makes_the_secret_and_seals_it_to_the_device(env) -> None:
    pending, private = _sealed_pending(env)
    assert env.pair_store.status(WATCH) == ("pending", None)

    result = _ok(env, env.ws.ws_pair_confirm, code=pending.code)
    assert result["result"] == "new"
    entry = env.secret_store.get(WATCH)
    secret = base64.b64decode(entry.secret_b64)
    assert len(secret) == 32
    assert entry.label == "watch-code-pair"
    assert entry.user_id == "root"
    assert entry.device_kind == "watch"

    state, reply = env.pair_store.status(WATCH)
    assert state == "confirmed"
    assert set(reply) == {"server_public_key_b64", "nonce", "box"}
    assert env.sealed.open_pair_secret(private, WATCH, reply) == secret
    # The request itself is gone: the code cannot be confirmed twice.
    assert _ok(env, env.ws.ws_pair_lookup, code=pending.code) == {"found": False}
    assert _error(env, env.ws.ws_pair_confirm, code=pending.code)[0] == "unknown_code"


def test_the_box_opens_only_with_the_device_s_own_key(env) -> None:
    pending, _private = _sealed_pending(env)
    _ok(env, env.ws.ws_pair_confirm, code=pending.code)
    _state, reply = env.pair_store.status(WATCH)
    stranger, _ = _key_pair()
    with pytest.raises(env.sealed.SealedBoxError):
        env.sealed.open_pair_secret(stranger, WATCH, reply)


def test_each_sealed_confirm_makes_a_fresh_secret_and_server_key(env) -> None:
    first, private_one = _sealed_pending(env)
    _ok(env, env.ws.ws_pair_confirm, code=first.code)
    _state, reply_one = env.pair_store.status(WATCH)
    secret_one = env.sealed.open_pair_secret(private_one, WATCH, reply_one)

    second, private_two = _sealed_pending(env)
    # The new start dropped the first box: the device started over.
    assert env.pair_store.status(WATCH) == ("pending", None)
    _ok(env, env.ws.ws_pair_confirm, code=second.code, replace=True)
    _state, reply_two = env.pair_store.status(WATCH)
    secret_two = env.sealed.open_pair_secret(private_two, WATCH, reply_two)

    assert secret_one != secret_two
    assert reply_one["server_public_key_b64"] != reply_two["server_public_key_b64"]
    assert env.secret_store.get(WATCH).secret_b64 == base64.b64encode(secret_two).decode()


def test_the_box_waits_ten_minutes_then_goes(env) -> None:
    pending, _private = _sealed_pending(env)
    _ok(env, env.ws.ws_pair_confirm, code=pending.code)
    env.clock.now += 599
    assert env.pair_store.status(WATCH)[0] == "confirmed"
    # Asking again hands out the same box.
    assert env.pair_store.status(WATCH) == env.pair_store.status(WATCH)
    env.clock.now += 1
    assert env.pair_store.status(WATCH) == ("expired", None)
    # The paired secret stays; only the copy went.
    assert env.secret_store.get(WATCH) is not None


def test_an_old_form_confirm_leaves_no_box(env) -> None:
    pending = _pending(env)
    assert env.pair_store.status(WATCH) == ("pending", None)
    _ok(env, env.ws.ws_pair_confirm, code=pending.code)
    assert env.pair_store.status(WATCH) == ("expired", None)


def test_an_iphone_by_code_is_stored_as_an_iphone(env) -> None:
    pending, private = _sealed_pending(env, kind="iphone", watch_id=PHONE)
    lookup = _ok(env, env.ws.ws_pair_lookup, code=pending.code)
    assert lookup["kind"] == "iphone"
    result = _ok(env, env.ws.ws_pair_confirm, code=pending.code, user_id="chen")
    assert result["kind"] == "iphone"
    entry = env.secret_store.get(PHONE)
    assert entry.label == "iphone-self-provision"
    assert entry.device_kind == "iphone"
    assert entry.user_id == "chen"
    assert entry.owner_iphone_id is None
    _state, reply = env.pair_store.status(PHONE)
    assert base64.b64encode(env.sealed.open_pair_secret(private, PHONE, reply)).decode() == (
        entry.secret_b64
    )
    assert env.logbook == [
        (
            "registered",
            {"watch_id": PHONE, "label": "iphone-self-provision", "app_version": "3.2.0"},
        )
    ]


def test_an_iphone_refusal_names_an_iphone(env) -> None:
    pending, _private = _sealed_pending(env, kind="iphone", watch_id=PHONE)
    code, message = _error(env, env.ws.ws_pair_confirm, code=pending.code, user_id="nobody")
    assert code == "invalid_user"
    assert "this iPhone" in message


# ── Replace ──────────────────────────────────────────────────────────────


@pytest.mark.parametrize("bound_to", ["root", "bob", None])
def test_a_paired_device_needs_replace(env, bound_to) -> None:
    env.secret_store.register(WATCH, SECRET_B, "watch-self-provision", user_id=bound_to)
    pending = _pending(env)
    lookup = _ok(env, env.ws.ws_pair_lookup, code=pending.code)
    assert lookup["needs_replace"] is True

    for extra in ({}, {"replace": False}):
        code, message = _error(env, env.ws.ws_pair_confirm, code=pending.code, **extra)
        assert code == "needs_replace"
        assert "Replace" in message
    # Nothing written, and the code still waits for the tick.
    assert env.secret_store.get(WATCH).secret_b64 == SECRET_B
    assert env.logbook == []
    assert env.pair_store.get(pending.code) is pending

    _ok(env, env.ws.ws_pair_confirm, code=pending.code, replace=True)
    assert env.secret_store.get(WATCH).secret_b64 == SECRET_A


def test_a_new_device_needs_no_replace(env) -> None:
    pending = _pending(env)
    assert _ok(env, env.ws.ws_pair_lookup, code=pending.code)["needs_replace"] is False
    _ok(env, env.ws.ws_pair_confirm, code=pending.code)


def test_replace_on_a_new_device_is_harmless(env) -> None:
    _ok(env, env.ws.ws_pair_confirm, code=_pending(env).code, replace=True)
    assert env.secret_store.get(WATCH).secret_b64 == SECRET_A


# ── I expect this watch ──────────────────────────────────────────────────


@pytest.mark.parametrize("remote", ["192.0.2.7", "8.8.8.8", "2001:db8::1", "not an address"])
def test_a_code_from_outside_needs_allow_remote(env, remote) -> None:
    pending = _pending(env, remote=remote)
    assert _ok(env, env.ws.ws_pair_lookup, code=pending.code)["needs_allow_remote"] is True
    for extra in ({}, {"allow_remote": False}):
        code, message = _error(env, env.ws.ws_pair_confirm, code=pending.code, **extra)
        assert code == "needs_allow_remote"
        assert "I expect this watch" in message
    assert env.secret_store.all_watch_ids == []
    assert env.pair_store.get(pending.code) is pending

    _ok(env, env.ws.ws_pair_confirm, code=pending.code, allow_remote=True)
    assert env.secret_store.get(WATCH).secret_b64 == SECRET_A


@pytest.mark.parametrize(
    "remote",
    [None, "10.1.2.3", "172.16.43.50", "172.31.0.1", "192.168.1.9", "127.0.0.1", "::1",
     "fe80::1", "fd12:3456::1", "::ffff:192.168.1.9"],
)
def test_a_code_from_home_needs_no_tick(env, remote) -> None:
    pending = _pending(env, remote=remote)
    assert _ok(env, env.ws.ws_pair_lookup, code=pending.code)["needs_allow_remote"] is False
    _ok(env, env.ws.ws_pair_confirm, code=pending.code)


def test_a_code_through_the_cloud_needs_allow_remote_whatever_its_address(env) -> None:
    fields, error = env.pair_mod.validate_pair_fields({"watch_id": WATCH, "secret_b64": SECRET_A})
    assert error is None
    pending = env.pair_store.start(fields, remote="127.0.0.1", remote_public=True)
    assert _ok(env, env.ws.ws_pair_lookup, code=pending.code)["needs_allow_remote"] is True
    assert _error(env, env.ws.ws_pair_confirm, code=pending.code)[0] == "needs_allow_remote"


def test_an_iphone_from_outside_names_its_kind(env) -> None:
    pending, _private = _sealed_pending(env, kind="iphone", watch_id=PHONE, remote="8.8.8.8")
    _code, message = _error(env, env.ws.ws_pair_confirm, code=pending.code)
    assert "I expect this iPhone" in message


def test_both_ticks_are_needed_when_both_apply(env) -> None:
    env.secret_store.register(WATCH, SECRET_B, "watch-self-provision", user_id="root")
    pending = _pending(env, remote="8.8.8.8")
    assert _error(env, env.ws.ws_pair_confirm, code=pending.code, replace=True)[0] == (
        "needs_allow_remote"
    )
    assert _error(env, env.ws.ws_pair_confirm, code=pending.code, allow_remote=True)[0] == (
        "needs_replace"
    )
    _ok(env, env.ws.ws_pair_confirm, code=pending.code, replace=True, allow_remote=True)


# ── QR offers ────────────────────────────────────────────────────────────


def _fragment(url: str) -> dict[str, str]:
    assert url.startswith("wristassistant://pair#")
    return dict(urllib.parse.parse_qsl(url.split("#", 1)[1], strict_parsing=True))


def _token_of(url: str) -> bytes:
    text = _fragment(url)["t"]
    return base64.urlsafe_b64decode(text + "=" * (-len(text) % 4))


def test_an_offer_answers_a_link_for_this_home(env) -> None:
    result = _ok(env, env.ws.ws_pair_offer)
    assert set(result) == {"offer_id", "url", "expires_in"}
    assert result["expires_in"] == 300
    url = result["url"]
    fields = _fragment(url)
    assert list(fields) == ["v", "i", "t", "u", "e", "n"]
    assert fields["v"] == "1"
    assert fields["i"] == INSTANCE_ID
    assert fields["u"] == "http://192.168.1.20:8123"
    assert fields["e"] == "https://home.example.com"
    assert fields["n"] == "Tiny House"
    # Percent-encoded with nothing left safe, a space as %20.
    assert "n=Tiny%20House" in url
    assert "u=http%3A%2F%2F192.168.1.20%3A8123&" in url
    token = _token_of(url)
    assert len(token) == 32
    assert "=" not in fields["t"]
    assert hashlib.sha256(token).hexdigest() == result["offer_id"]

    offer = env.offer_store.get(result["offer_id"])
    assert offer.token == token
    assert offer.user_id == "root"
    assert offer.admin_id == "root"
    assert offer.replace is False


def test_two_offers_carry_different_tokens(env) -> None:
    one = _ok(env, env.ws.ws_pair_offer)
    two = _ok(env, env.ws.ws_pair_offer)
    assert one["offer_id"] != two["offer_id"]
    assert _token_of(one["url"]) != _token_of(two["url"])


def test_an_offer_for_another_person_with_replace(env) -> None:
    result = _ok(env, env.ws.ws_pair_offer, user_id="chen", replace=True, kind="iphone")
    offer = env.offer_store.get(result["offer_id"])
    assert (offer.user_id, offer.admin_id, offer.replace) == ("chen", "root", True)


@pytest.mark.parametrize("user_id", ["nobody", "retired", "supervisor"])
def test_an_offer_refuses_a_missing_inactive_or_system_user(env, user_id) -> None:
    code, message = _error(env, env.ws.ws_pair_offer, user_id=user_id)
    assert code == "invalid_user"
    assert "this iPhone" in message
    assert len(env.offer_store) == 0


def test_a_non_admin_cannot_offer_for_another_user(env) -> None:
    """Unreachable behind require_admin; pinned with the gate stubbed open."""
    connection = _call(env, env.ws.ws_pair_offer, user=_User("chen"), user_id="root")
    [(_id, code, _message)] = connection.errors
    assert code == "unauthorized"


def _no_url(*_args, **_kwargs) -> str:
    raise RuntimeError("no URL available")


def test_the_worked_out_home_address_fills_in_when_none_is_set(env) -> None:
    calls: list[dict] = []

    def get_url(_hass, **kwargs) -> str:
        calls.append(kwargs)
        return "http://192.168.1.44:8123/"

    _stub("homeassistant.helpers.network", get_url=get_url)
    env.hass.config.internal_url = None
    fields = _fragment(_ok(env, env.ws.ws_pair_offer)["url"])
    assert fields["u"] == "http://192.168.1.44:8123"
    assert calls == [
        {
            "allow_internal": True,
            "allow_external": False,
            "allow_cloud": False,
            "allow_ip": True,
            "prefer_external": False,
        }
    ]


def test_a_set_home_address_wins_over_the_worked_out_one(env) -> None:
    def get_url(_hass, **_kwargs) -> str:
        raise AssertionError("not asked when the home address is set")

    _stub("homeassistant.helpers.network", get_url=get_url)
    fields = _fragment(_ok(env, env.ws.ws_pair_offer)["url"])
    assert fields["u"] == "http://192.168.1.20:8123"


def test_empty_addresses_are_left_out_of_the_link(env) -> None:
    _stub("homeassistant.helpers.network", get_url=_no_url)
    env.hass.config.internal_url = None
    env.hass.config.external_url = "  "
    env.hass.config.location_name = ""
    fields = _fragment(_ok(env, env.ws.ws_pair_offer)["url"])
    assert list(fields) == ["v", "i", "t"]


def test_the_cloud_address_is_in_the_link_with_an_active_subscription(env) -> None:
    calls: list[str] = []

    def remote_ui_url(_hass) -> str:
        calls.append("url")
        return "https://abcdef.ui.nabu.casa"

    _stub(
        "homeassistant.components.cloud",
        async_active_subscription=lambda _hass: True,
        async_remote_ui_url=remote_ui_url,
    )
    env.hass.config.components = {"http", "cloud"}
    fields = _fragment(_ok(env, env.ws.ws_pair_offer)["url"])
    assert fields["c"] == "https://abcdef.ui.nabu.casa"
    assert list(fields) == ["v", "i", "t", "u", "e", "c", "n"]
    assert calls == ["url"]


@pytest.mark.parametrize("case", ["not loaded", "signed out", "remote off"])
def test_no_cloud_address_when_cloud_cannot_give_one(env, case) -> None:
    def refuse(_hass) -> str:
        raise RuntimeError("remote UI not available")

    _stub(
        "homeassistant.components.cloud",
        async_active_subscription=lambda _hass: case != "signed out",
        async_remote_ui_url=refuse,
    )
    if case != "not loaded":
        env.hass.config.components = {"http", "cloud"}
    fields = _fragment(_ok(env, env.ws.ws_pair_offer)["url"])
    assert "c" not in fields


def test_no_cloud_address_once_the_subscription_ran_out(env) -> None:
    # Signed in with remote access on, but the plan ended: the address still
    # exists and no longer answers, so the link leaves it out.
    _stub(
        "homeassistant.components.cloud",
        async_active_subscription=lambda _hass: False,
        async_is_logged_in=lambda _hass: True,
        async_remote_ui_url=lambda _hass: "https://abcdef.ui.nabu.casa",
    )
    env.hass.config.components = {"http", "cloud"}
    fields = _fragment(_ok(env, env.ws.ws_pair_offer)["url"])
    assert "c" not in fields


def test_at_most_sixteen_offers_are_open(env) -> None:
    for _ in range(16):
        _ok(env, env.ws.ws_pair_offer)
    code, _message = _error(env, env.ws.ws_pair_offer)
    assert code == "too_many_offers"
    # Once they run out there is room again.
    env.clock.now += 300
    _ok(env, env.ws.ws_pair_offer)


def test_the_token_is_never_logged(env, caplog) -> None:
    with caplog.at_level(logging.DEBUG):
        result = _ok(env, env.ws.ws_pair_offer)
        _ok(env, env.ws.ws_pair_offer_status, offer_id=result["offer_id"])
        _ok(env, env.ws.ws_pair_offer_cancel, offer_id=result["offer_id"])
    token_text = _fragment(result["url"])["t"]
    logged = "\n".join(record.getMessage() for record in caplog.records)
    assert logged, "the offer should be logged"
    assert token_text not in logged
    assert result["url"] not in logged
    assert result["offer_id"] not in logged


def test_offer_status_follows_the_offer(env) -> None:
    result = _ok(env, env.ws.ws_pair_offer, user_id="chen")
    offer_id = result["offer_id"]
    assert _ok(env, env.ws.ws_pair_offer_status, offer_id=offer_id) == {"state": "open"}
    # Upper case reads the same.
    assert _ok(env, env.ws.ws_pair_offer_status, offer_id=offer_id.upper()) == {"state": "open"}

    offer = env.offer_store.get(offer_id)
    env.offer_store.redeem(offer, device_id=PHONE, device_name="Chen's iPhone")
    assert _ok(env, env.ws.ws_pair_offer_status, offer_id=offer_id) == {
        "state": "redeemed",
        "device_name": "Chen's iPhone",
        "user_id": "chen",
        "device_id": PHONE,
    }
    # A redeemed offer keeps no token.
    assert offer.token == b""


def test_offer_status_of_a_lapsed_unknown_or_malformed_offer_is_expired(env) -> None:
    offer_id = _ok(env, env.ws.ws_pair_offer)["offer_id"]
    env.clock.now += 300
    assert _ok(env, env.ws.ws_pair_offer_status, offer_id=offer_id) == {"state": "expired"}
    for other in ("0" * 64, "not hex", ""):
        assert _ok(env, env.ws.ws_pair_offer_status, offer_id=other) == {"state": "expired"}


def test_cancel_closes_an_open_offer(env) -> None:
    offer_id = _ok(env, env.ws.ws_pair_offer)["offer_id"]
    assert _ok(env, env.ws.ws_pair_offer_cancel, offer_id=offer_id) == {
        "ok": True,
        "cancelled": True,
    }
    assert _ok(env, env.ws.ws_pair_offer_status, offer_id=offer_id) == {"state": "expired"}
    assert env.offer_store.get(offer_id) is None
    assert _ok(env, env.ws.ws_pair_offer_cancel, offer_id=offer_id) == {
        "ok": True,
        "cancelled": False,
    }
    assert _ok(env, env.ws.ws_pair_offer_cancel, offer_id="nonsense")["cancelled"] is False


def test_the_offer_commands_answer_unavailable_while_not_loaded(env) -> None:
    env.hass.data.clear()
    assert _error(env, env.ws.ws_pair_offer)[0] == "unavailable"
    assert _error(env, env.ws.ws_pair_offer_status, offer_id="0" * 64)[0] == "unavailable"
    assert _error(env, env.ws.ws_pair_offer_cancel, offer_id="0" * 64)[0] == "unavailable"


def test_an_offer_needs_an_instance_id(env) -> None:
    async def no_id(_hass) -> None:
        return None

    _stub("homeassistant.helpers.instance_id", async_get=no_id)
    env.ws.ha_instance_id = sys.modules["homeassistant.helpers.instance_id"]
    assert _error(env, env.ws.ws_pair_offer)[0] == "unavailable"
    assert len(env.offer_store) == 0
