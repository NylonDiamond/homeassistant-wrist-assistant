"""The user a widget secret is bound to, with no Home Assistant.

A secret registered through ``/v2/register_secret`` is bound to the Home
Assistant user behind the bearer, and every HMAC request signed with it runs
as that user. These tests load the real ``WidgetSecretStore`` under stubbed
Home Assistant modules, and pull ``WARegisterSecretView`` out of
``wa_v2_views.py`` by name the way ``test_v2_views_inprocess.py`` does, to pin
the rules:

* a fresh registration records the registering user;
* an entry that predates binding takes the first user it is re-provisioned
  by, silently, as an idempotent refresh (the automatic re-provision after an
  upgrade binds every existing device without anyone re-pairing);
* the same user may rekey their own device, and an admin may rekey anyone's;
* a different non-admin user is refused with 403 and the entry is untouched;
* the stored user survives a save/load round trip;
* the ``/live`` snapshot cap spends down and then stops.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import base64
import contextlib
import importlib.util
import logging
import sys
import types
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import pytest

_PKG = "custom_components.wrist_assistant"
_SRC = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"

SECRET_A = base64.b64encode(b"a" * 32).decode()
SECRET_B = base64.b64encode(b"b" * 32).decode()


# ── stubs ────────────────────────────────────────────────────────────────


class _FakeStore:
    def __init__(self, *_args: object, **_kwargs: object) -> None:
        self.saved: dict | None = None

    async def async_load(self) -> dict | None:
        return self.saved

    def async_delay_save(self, serialize, *_args: object, **_kwargs: object) -> None:
        self.saved = serialize()


def _stub(name: str, **attrs: object) -> types.ModuleType:
    module = sys.modules.get(name) or types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module
    parent, _, leaf = name.rpartition(".")
    if parent and parent in sys.modules:
        setattr(sys.modules[parent], leaf, module)
    return module


def _load(name: str):
    spec = importlib.util.spec_from_file_location(f"{_PKG}.{name}", _SRC / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[f"{_PKG}.{name}"] = module
    spec.loader.exec_module(module)
    return module


@contextlib.contextmanager
def _loaded_store():
    saved_modules = dict(sys.modules)
    try:
        _stub("homeassistant")
        _stub("homeassistant.core", HomeAssistant=type("HomeAssistant", (), {}))
        _stub("homeassistant.helpers")
        _stub("homeassistant.helpers.storage", Store=_FakeStore)
        _stub("homeassistant.util")
        _stub(
            "homeassistant.util.dt",
            parse_datetime=lambda value: None,
            utcnow=lambda: datetime.now(UTC),
        )
        pkg = types.ModuleType(_PKG)
        pkg.__path__ = []
        sys.modules[_PKG] = pkg
        _stub(
            f"{_PKG}.const",
            WIDGET_SECRET_STORAGE_KEY="wrist_assistant.widget_secrets",
            WIDGET_SECRET_STORAGE_VERSION=1,
        )
        yield _load("widget_secret_store")
    finally:
        for key in list(sys.modules):
            if key not in saved_modules:
                del sys.modules[key]
        sys.modules.update(saved_modules)


# ── the register view, out of wa_v2_views.py by name ─────────────────────


class _Response:
    def __init__(self, status: int = 200, text: str = "", body: Any = None) -> None:
        self.status = status
        self.text = text
        self.body = body


class _View:
    def json(self, result: Any, status_code: int = 200, headers: Any = None) -> _Response:
        return _Response(status=status_code, body=result)

    def json_message(self, message: str, status_code: int = 200, **_: Any) -> _Response:
        return _Response(status=status_code, body={"message": message})


class _User:
    def __init__(self, user_id: str, *, is_admin: bool = False) -> None:
        self.id = user_id
        self.is_admin = is_admin
        self.is_active = True


class _Request:
    """The two things the view reads: the JSON body and ``hass_user``."""

    def __init__(self, payload: dict, user: _User | None) -> None:
        self._payload = payload
        self._user = user

    async def json(self) -> dict:
        return self._payload

    def get(self, key: str, default: Any = None) -> Any:
        if key == "hass_user":
            return self._user
        return default


def _register_view_class() -> type:
    path = _SRC / "wa_v2_views.py"
    tree = ast.parse(path.read_text(), filename=str(path))
    wanted = [
        node
        for node in tree.body
        if isinstance(node, ast.ClassDef) and node.name == "WARegisterSecretView"
    ]
    assert len(wanted) == 1
    code = compile(
        ast.Module(body=wanted, type_ignores=[]),
        str(path),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    registry = types.SimpleNamespace(async_get_device=lambda **_: None)
    namespace: dict[str, Any] = {
        "Any": Any,
        "base64": base64,
        "Response": _Response,
        "HomeAssistantView": _View,
        "DOMAIN": "wrist_assistant",
        "LIBRARY_OWNER_ID": "library",
        "WA_PROTOCOL_VERSION": 2,
        "DEFAULT_HMAC_ALGO": "hmac-sha256",
        "SUPPORTED_HMAC_ALGOS": frozenset({"hmac-sha256"}),
        "_REGISTER_ID_MAX_LEN": 128,
        "_REGISTER_TEXT_MAX_LEN": 256,
        "_LOGGER": logging.getLogger("test_widget_secret_user_binding"),
        "log_secret_registered": lambda *a, **k: None,
        "log_secret_reprovisioned": lambda *a, **k: None,
        "dr": types.SimpleNamespace(async_get=lambda _hass: registry),
    }
    exec(code, namespace)  # noqa: S102
    return namespace["WARegisterSecretView"]


@pytest.fixture
def env():
    with _loaded_store() as store_mod:
        store = store_mod.WidgetSecretStore(object())
        asyncio.run(store.async_load())
        hass = types.SimpleNamespace(
            data={"wrist_assistant": types.SimpleNamespace(widget_secret_store=store)}
        )
        view = _register_view_class()(hass)
        yield types.SimpleNamespace(store=store, store_mod=store_mod, view=view)


def _post(env, payload: dict, user: _User | None) -> _Response:
    body = {"watch_id": "watch-1", "secret_b64": SECRET_A, "label": "test"}
    body.update(payload)
    return asyncio.run(env.view.post(_Request(body, user)))


ALICE = _User("alice")
BOB = _User("bob")
ROOT = _User("root", is_admin=True)


# ── binding ──────────────────────────────────────────────────────────────


def test_a_fresh_registration_records_the_user(env) -> None:
    reply = _post(env, {}, ALICE)
    assert reply.status == 200, reply.body
    assert env.store.get("watch-1").user_id == "alice"


def test_a_legacy_entry_takes_the_first_user_as_an_idempotent_refresh(env) -> None:
    # Paired before binding existed: no user on the entry.
    env.store.register("watch-1", SECRET_A, "test")
    assert env.store.get("watch-1").user_id is None

    result = env.store.register("watch-1", SECRET_A, "test", user_id="alice")
    assert result == "idempotent"
    assert env.store.get("watch-1").user_id == "alice"


def test_the_same_user_can_rekey_their_own_device(env) -> None:
    _post(env, {}, ALICE)
    reply = _post(env, {"secret_b64": SECRET_B}, ALICE)
    assert reply.status == 200, reply.body
    entry = env.store.get("watch-1")
    assert entry.secret_b64 == SECRET_B
    assert entry.user_id == "alice"


def test_a_different_non_admin_is_refused_and_the_entry_is_untouched(env) -> None:
    _post(env, {}, ALICE)
    reply = _post(env, {"secret_b64": SECRET_B}, BOB)
    assert reply.status == 403
    entry = env.store.get("watch-1")
    assert entry.secret_b64 == SECRET_A
    assert entry.user_id == "alice"


def test_an_admin_can_rekey_anyone_and_the_device_moves_to_them(env) -> None:
    _post(env, {}, ALICE)
    reply = _post(env, {"secret_b64": SECRET_B}, ROOT)
    assert reply.status == 200, reply.body
    entry = env.store.get("watch-1")
    assert entry.secret_b64 == SECRET_B
    assert entry.user_id == "root"


def test_a_legacy_entry_can_be_claimed_through_the_view(env) -> None:
    env.store.register("watch-1", SECRET_A, "test")
    reply = _post(env, {}, BOB)
    assert reply.status == 200, reply.body
    assert env.store.get("watch-1").user_id == "bob"


def test_overlong_fields_are_refused(env) -> None:
    assert _post(env, {"watch_id": "w" * 129}, ALICE).status == 400
    assert _post(env, {"device_name": "n" * 257}, ALICE).status == 400
    assert env.store.get("watch-1") is None


# ── persistence ──────────────────────────────────────────────────────────


def test_the_user_survives_a_save_and_load(env) -> None:
    env.store.register("watch-1", SECRET_A, "test", user_id="alice")
    env.store.register("watch-old", SECRET_B, "test")
    saved = env.store._store.saved
    assert saved["secrets"]["watch-1"]["user_id"] == "alice"
    assert saved["secrets"]["watch-old"]["user_id"] is None

    reloaded = env.store_mod.WidgetSecretStore(object())
    reloaded._store.saved = saved
    asyncio.run(reloaded.async_load())
    assert reloaded.get("watch-1").user_id == "alice"
    assert reloaded.get("watch-old").user_id is None


# ── the live snapshot cap ────────────────────────────────────────────────


def test_live_recaptures_spend_down_and_then_stop() -> None:
    path = _SRC / "notification_snapshot.py"
    spec = importlib.util.spec_from_file_location("wa_ns_under_binding_test", path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    try:
        spec.loader.exec_module(module)
        store = module.NotificationSnapshotStore()
        token = store.put(b"JPEG", entity_id="camera.front", now=1_000.0)
        allowed = [store.consume_live(token, now=1_001.0) for _ in range(module.DEFAULT_LIVE_CAPTURE_LIMIT + 2)]
        assert allowed == [True] * module.DEFAULT_LIVE_CAPTURE_LIMIT + [False, False]
        # The frozen frame is still served after the cap.
        assert store.get(token, now=1_002.0).data == b"JPEG"
        # An unknown token never captures.
        assert store.consume_live("nope", now=1_002.0) is False
    finally:
        sys.modules.pop(spec.name, None)
