"""In-process tests for a few ``wa_v2_views`` handlers, with no Home Assistant.

``wa_v2_views`` cannot be imported without a full HA install, so this pulls
the handlers it needs out of the module's source by name and runs them in a
namespace of stand-ins: a real ``ComplicationStore`` (loaded the way
``test_complication_store.py`` loads it), a fake op context whose
``signed_json`` hands back the reply, and a ``HomeAssistantView`` base whose
``json`` helpers do the same. The live suite still covers the wire.

Covered:

* ``complications_sync`` says ``owner_forgotten`` once and then clears it,
  so a device that pairs again under the same id can move its presets in.
* ``complications_move_status`` reports the mark without clearing it.
* ``complications_create`` from a still-forgotten owner succeeds.
* The version view answers 503 while the config entry is reloading.
* ``register_secret`` refuses the Library's owner id.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import types
import uuid
from pathlib import Path
from typing import Any

import pytest

from test_complication_store import MAX_PER_OWNER, MAX_SCHEMA, _doc, _loaded_module

_MODULE = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "wa_v2_views.py"
)

_NAMES = (
    "_op_complications_sync",
    "_op_complications_move_status",
    "_op_complications_create",
    "WAVersionView",
    "WARegisterSecretView",
)

DOMAIN = "wrist_assistant"
OWNER = "watch-A"


class _Response:
    def __init__(self, status: int = 200, text: str = "", body: Any = None) -> None:
        self.status = status
        self.text = text
        self.body = body


class _View:
    """The two ``HomeAssistantView`` helpers the views under test call."""

    def json(self, result: Any, status_code: int = 200, headers: Any = None) -> _Response:
        return _Response(status=status_code, body=result)

    def json_message(self, message: str, status_code: int = 200, **_: Any) -> _Response:
        return _Response(status=status_code, body={"message": message})


class _Ctx:
    def __init__(self, store: Any, payload: dict | None = None) -> None:
        self.watch_id = OWNER
        self.payload = payload or {}
        self.domain_data = types.SimpleNamespace(complication_store=store)

    def signed_json(self, payload: dict, status: int = 200) -> _Response:
        return _Response(status=status, body=payload)


class _Request:
    def __init__(self, payload: dict) -> None:
        self._payload = payload

    async def json(self) -> dict:
        return self._payload


async def _integration(_hass: Any, _domain: str) -> Any:
    return types.SimpleNamespace(version="9.9.9")


async def _instance_id(_hass: Any) -> str:
    return "instance-uuid"


def _handlers(store_mod: Any) -> dict[str, Any]:
    source = _MODULE.read_text()
    tree = ast.parse(source, filename=str(_MODULE))
    wanted = [
        node
        for node in tree.body
        if isinstance(node, (ast.AsyncFunctionDef, ast.ClassDef)) and node.name in _NAMES
    ]
    assert sorted(n.name for n in wanted) == sorted(_NAMES)
    code = compile(
        ast.Module(body=wanted, type_ignores=[]),
        str(_MODULE),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    namespace: dict[str, Any] = {
        "Any": Any,
        "uuid": uuid,
        "Response": _Response,
        "HomeAssistantView": _View,
        "loader": types.SimpleNamespace(async_get_integration=_integration),
        "ha_instance_id": types.SimpleNamespace(async_get=_instance_id),
        "DOMAIN": DOMAIN,
        "LIBRARY_OWNER_ID": store_mod.LIBRARY_OWNER_ID,
        "WA_PROTOCOL_VERSION": 2,
        "MIN_SUPPORTED_APP_PROTOCOL_VERSION": 2,
        "APP_UPDATE_MESSAGE": None,
        "DEFAULT_HMAC_ALGO": "hmac-sha256",
        "SUPPORTED_HMAC_ALGOS": frozenset({"hmac-sha256"}),
        "COMPLICATION_MAX_SCHEMA_VERSION": MAX_SCHEMA,
        "COMPLICATION_MAX_PER_OWNER": MAX_PER_OWNER,
        "ComplicationConflictError": store_mod.ComplicationConflictError,
        "ComplicationStoreError": store_mod.ComplicationStoreError,
        "ComplicationValidationError": store_mod.ComplicationValidationError,
        "shapes_of": store_mod.shapes_of,
        "validate_document": store_mod.validate_document,
    }
    exec(code, namespace)  # noqa: S102
    return namespace


@pytest.fixture
def env():
    with _loaded_module() as store_mod:
        store = store_mod.ComplicationStore(object())
        asyncio.run(store.async_load())
        yield types.SimpleNamespace(store=store, views=_handlers(store_mod))


def _run(env, op: str, payload: dict | None = None) -> _Response:
    return asyncio.run(env.views[op](_Ctx(env.store, payload)))


# ── the forgotten mark ───────────────────────────────────────────────────


def test_sync_says_forgotten_once_and_then_clears_it(env) -> None:
    env.store.save(OWNER, _doc(), base_revision=None, updated_by="t")
    env.store.forget_owner(OWNER)

    first = _run(env, "_op_complications_sync", {"since_token": 0})
    assert first.status == 200
    assert first.body["owner_forgotten"] is True
    assert env.store.is_forgotten(OWNER) is False

    second = _run(env, "_op_complications_sync", {"since_token": first.body["token"]})
    assert second.body["owner_forgotten"] is False


def test_forgetting_an_owner_that_held_nothing_is_cleared_by_its_sync(env) -> None:
    """The 2.0 phone with only iPhone presets: nothing stored, still marked."""
    assert env.store.forget_owner(OWNER) is False
    assert env.store.is_forgotten(OWNER) is True

    reply = _run(env, "_op_complications_sync")
    assert reply.body["owner_forgotten"] is True
    assert reply.body["records"] == []
    assert env.store.is_forgotten(OWNER) is False
    assert _run(env, "_op_complications_sync").body["owner_forgotten"] is False


def test_move_status_reports_the_mark_without_clearing_it(env) -> None:
    env.store.forget_owner(OWNER)

    for _ in range(2):
        reply = _run(env, "_op_complications_move_status")
        assert reply.status == 200
        assert reply.body["owner_forgotten"] is True
    assert env.store.is_forgotten(OWNER) is True


def test_create_from_a_forgotten_owner_succeeds_and_clears_the_mark(env) -> None:
    """The move may run before the watch has pulled; nothing refuses it."""
    env.store.forget_owner(OWNER)
    doc = _doc()

    reply = _run(env, "_op_complications_create", {"documents": [doc]})
    assert reply.status == 200
    assert [r["status"] for r in reply.body["results"]] == ["created"]
    assert env.store.is_forgotten(OWNER) is False
    assert _run(env, "_op_complications_move_status").body["owner_forgotten"] is False


# ── version view during a reload ─────────────────────────────────────────


def test_version_answers_503_while_the_entry_is_reloading(env) -> None:
    hass = types.SimpleNamespace(data={})
    view = env.views["WAVersionView"](hass)

    reply = asyncio.run(view.get(None))
    assert reply.status == 503
    assert reply.body == {"ok": False, "error": "restarting"}

    coordinator = types.SimpleNamespace(capabilities=["custom_complications"])
    hass.data[DOMAIN] = types.SimpleNamespace(coordinator=coordinator)
    reply = asyncio.run(view.get(None))
    assert reply.status == 200
    assert reply.body["capabilities"] == ["custom_complications"]
    assert reply.body["integration_version"] == "9.9.9"
    assert reply.body["instance_id"] == "instance-uuid"


# ── register_secret ──────────────────────────────────────────────────────


def test_register_secret_refuses_the_library_owner_id(env) -> None:
    hass = types.SimpleNamespace(data={DOMAIN: types.SimpleNamespace()})
    view = env.views["WARegisterSecretView"](hass)

    reply = asyncio.run(
        view.post(_Request({"watch_id": "library", "secret_b64": "A" * 44}))
    )
    assert reply.status == 400
    assert "reserved" in reply.body["message"]
