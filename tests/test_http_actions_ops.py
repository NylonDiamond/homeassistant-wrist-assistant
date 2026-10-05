"""In-process tests for the HTTP action ops and WebSocket commands.

The three signed ops are pulled out of ``wa_v2_views.py`` by name, the way
``test_watch_config_ops_inprocess.py`` pulls its own, and run against a real
``HTTPActionsStore`` and a real ``HTTPActionRunner`` over a fake session.
The WebSocket commands are loaded from ``http_actions_ws.py`` with stubbed
Home Assistant modules. The wire shapes the app and the panel are built
against are asserted as whole dicts.

Static checks at the bottom: the ops in the dispatch table.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import base64
import json
import sys
import types
from pathlib import Path
from typing import Any

import pytest

from test_http_actions import ID_A, ID_B, action, library, variable
from test_http_actions_runner import FakeHass, FakeResponse, FakeSession
from test_http_actions_store import CONFLICT, loaded_package, new_store

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_VIEWS = _PKG_DIR / "wa_v2_views.py"
_NAMES = (
    "_async_bound_user_is_admin",
    "_http_actions_refusal",
    "_http_actions_store_refusal",
    "_op_http_actions_hand_over",
    "_op_http_actions_get",
    "_op_http_action_run",
)
URL_A = "https://example.com/hook"


class _Response:
    def __init__(self, status: int, body: Any) -> None:
        self.status = status
        self.body = body


class _User:
    def __init__(self, *, is_admin: bool, is_active: bool = True) -> None:
        self.is_admin = is_admin
        self.is_active = is_active


class _Auth:
    """``hass.auth`` with the users the tests name: ``admin`` (an active
    admin), ``member`` (an active user outside the admin group) and
    ``retired`` (an admin who is no longer active)."""

    users = {
        "admin": _User(is_admin=True),
        "member": _User(is_admin=False),
        "retired": _User(is_admin=True, is_active=False),
    }

    async def async_get_user(self, user_id: str) -> _User | None:
        return self.users.get(user_id)


class _Ctx:
    def __init__(
        self,
        domain_data: Any,
        watch_id: str,
        payload: dict,
        user_id: str | None = "admin",
        body: bytes | None = None,
    ) -> None:
        self.domain_data = domain_data
        self.watch_id = watch_id
        self.payload = payload
        self.user_id = user_id
        self.hass = types.SimpleNamespace(auth=_Auth())
        self.body = json.dumps(payload).encode() if body is None else body

    def signed_json(self, payload: dict, status: int = 200) -> _Response:
        return _Response(status, payload)


def _ops(store_mod: Any, runner_mod: Any) -> dict[str, Any]:
    tree = ast.parse(_VIEWS.read_text(), filename=str(_VIEWS))
    wanted = [
        node
        for node in tree.body
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in _NAMES
    ]
    assert sorted(n.name for n in wanted) == sorted(_NAMES)
    # The size limits the ops read, as module constants.
    wanted[:0] = [
        node
        for node in tree.body
        if isinstance(node, ast.Assign)
        and isinstance(node.targets[0], ast.Name)
        and node.targets[0].id.startswith(("_HAND_OVER_", "_RUN_MAX_"))
    ]
    code = compile(
        ast.Module(body=wanted, type_ignores=[]),
        str(_VIEWS),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    namespace: dict[str, Any] = {
        "Any": Any,
        "Response": _Response,
        "HTTPActionRefusal": runner_mod.HTTPActionRefusal,
        "run_input_problem": runner_mod.run_input_problem,
        "HTTPActionsStoreError": store_mod.HTTPActionsStoreError,
        "HTTPActionsUnavailableError": store_mod.HTTPActionsUnavailableError,
    }
    exec(code, namespace)  # noqa: S102
    return namespace


def _marker(*args: object, **kwargs: object) -> object:
    return args[0] if args else None


@pytest.fixture
def env():
    with loaded_package() as pkg:
        runner_mod = pkg.load("http_actions_runner")
        sys.modules["homeassistant.components"] = types.ModuleType("homeassistant.components")
        sys.modules["homeassistant.components.websocket_api"] = types.SimpleNamespace(
            ActiveConnection=type("ActiveConnection", (), {}),
            async_register_command=lambda hass, func: None,
            require_admin=lambda func: func,
            websocket_command=lambda schema: (lambda func: func),
            async_response=lambda func: func,
        )
        sys.modules["voluptuous"] = types.SimpleNamespace(Required=_marker, Optional=_marker)
        ws = pkg.load("http_actions_ws")
        store = new_store(pkg.store_mod)
        session = FakeSession({})
        runner = runner_mod.HTTPActionRunner(FakeHass(), session_for=session.for_verify)
        domain = types.SimpleNamespace(http_actions_store=store, http_action_runner=runner)
        yield types.SimpleNamespace(
            ops=_ops(pkg.store_mod, runner_mod),
            ws=ws,
            store=store,
            runner=runner,
            session=session,
            domain=domain,
            hass=types.SimpleNamespace(data={"wrist_assistant": domain}),
        )


def op(
    env,
    name: str,
    payload: dict,
    watch_id: str = "watch-A",
    user_id: str | None = "admin",
    body: bytes | None = None,
) -> _Response:
    return asyncio.run(env.ops[name](_Ctx(env.domain, watch_id, payload, user_id, body)))


# ── hand-over ────────────────────────────────────────────────────────────


def test_hand_over_answers_revision_and_added_and_happens_once(env) -> None:
    doc = library(action(), action(id=ID_B))
    reply = op(env, "_op_http_actions_hand_over", {"document": doc})
    assert (reply.status, reply.body) == (200, {"ok": True, "revision": 1, "added": 2})
    again = op(env, "_op_http_actions_hand_over", {"document": library(action(id="7C1D2E3F-4A5B-4C6D-9E7F-8A9B0C1D2E3F"))})
    assert again.body == {"ok": True, "revision": 1, "added": 0}
    assert env.store.get()["handed_over"] == ["watch-A"]


def test_an_empty_hand_over_answers_revision_0(env) -> None:
    reply = op(env, "_op_http_actions_hand_over", {"document": library()})
    assert reply.body == {"ok": True, "revision": 0, "added": 0}
    assert env.store.has_handed_over("watch-A")


@pytest.mark.parametrize("user_id", ["member", "retired", None, "deleted"])
def test_only_an_admins_device_may_hand_over(env, user_id) -> None:
    env.store.save(library(action()), base_revision=0)
    before = env.store.get()
    reply = op(
        env,
        "_op_http_actions_hand_over",
        {"document": library(action(id=ID_B, url="https://mine.example/?t={{token}}"))},
        user_id=user_id,
    )
    assert reply.status == 403
    assert reply.body["ok"] is False and reply.body["error"] == "forbidden"
    assert set(reply.body) == {"ok", "error", "message"}
    assert env.store.get() == before
    assert not env.store.has_handed_over("watch-A")
    # The same device bound to an admin still hands over, once.
    reply = op(env, "_op_http_actions_hand_over", {"document": library(action(id=ID_B))})
    assert reply.body == {"ok": True, "revision": 2, "added": 1}
    again = op(env, "_op_http_actions_hand_over", {"document": library(action(id=ID_B))})
    assert again.body == {"ok": True, "revision": 2, "added": 0}
    assert env.store.get()["handed_over"] == ["watch-A"]


@pytest.mark.parametrize(
    ("user_id", "can"), [("admin", True), ("member", False), ("retired", False), (None, False)]
)
def test_get_says_whether_the_device_may_hand_over(env, user_id, can) -> None:
    assert op(env, "_op_http_actions_get", {}, user_id=user_id).body["can_hand_over"] is can


def test_a_hand_over_over_256_kib_is_refused_before_it_is_read(env) -> None:
    body = b"{" + b" " * (256 * 1024) + b'"document": {"actions": []}}'
    reply = op(env, "_op_http_actions_hand_over", {"document": library()}, body=body)
    assert reply.status == 400 and reply.body["error"] == "invalid"
    assert not env.store.has_handed_over("watch-A")


@pytest.mark.parametrize("payload", [{}, {"document": []}, {"document": library(action(method="HEAD"))}])
def test_a_malformed_hand_over_is_a_signed_400(env, payload) -> None:
    reply = op(env, "_op_http_actions_hand_over", payload)
    assert reply.status == 400
    assert reply.body["ok"] is False and reply.body["error"] == "invalid"
    assert set(reply.body) == {"ok", "error", "message"}


# ── get ──────────────────────────────────────────────────────────────────


def test_get_at_revision_0(env) -> None:
    reply = op(env, "_op_http_actions_get", {})
    assert reply.body == {
        "ok": True, "revision": 0, "hash": None, "handed_over": False, "can_hand_over": True,
    }
    assert env.store.delivered() == {}


def test_get_sends_the_public_list_and_marks_delivery(env) -> None:
    env.store.save(
        library(action(url="https://secret.example/{{t}}", variables=[variable("t")])),
        base_revision=0,
    )
    reply = op(env, "_op_http_actions_get", {})
    _rev, listed, digest = env.store.public()
    assert reply.body == {
        "ok": True,
        "revision": 1,
        "hash": digest,
        "handed_over": False,
        "can_hand_over": True,
        "document": listed,
    }
    assert "secret" not in str(reply.body)
    assert env.store.delivered() == {"watch-A": 1}
    current = op(env, "_op_http_actions_get", {"since_revision": 1})
    assert "document" not in current.body and current.body["revision"] == 1
    stale = op(env, "_op_http_actions_get", {"since_revision": 0}, watch_id="watch-B")
    assert "document" in stale.body
    assert env.store.delivered() == {"watch-A": 1, "watch-B": 1}


def test_get_says_whether_the_signer_handed_over(env) -> None:
    op(env, "_op_http_actions_hand_over", {"document": library(action())})
    assert op(env, "_op_http_actions_get", {}).body["handed_over"] is True
    assert op(env, "_op_http_actions_get", {}, watch_id="watch-B").body["handed_over"] is False


@pytest.mark.parametrize("since", [-1, "1", True, 1.5])
def test_get_refuses_a_bad_since_revision(env, since) -> None:
    reply = op(env, "_op_http_actions_get", {"since_revision": since})
    assert reply.status == 400 and reply.body["error"] == "invalid"


# ── run ──────────────────────────────────────────────────────────────────


def test_run_answers_the_reply(env) -> None:
    env.store.save(
        library(action(responseConfig={"source": "jsonField", "jsonPath": "n"})), base_revision=0
    )
    env.session.script[URL_A] = FakeResponse(200, b'{"n": 3}')
    reply = op(env, "_op_http_action_run", {"id": ID_A, "values": {}})
    assert (reply.status, reply.body) == (
        200,
        {"ok": True, "status": 200, "value": "3", "snippet": '{"n": 3}', "error": None},
    )


def test_run_with_no_answer_is_still_200(env) -> None:
    env.store.save(library(action(url="{{gone}}/x")), base_revision=0)
    reply = op(env, "_op_http_action_run", {"id": ID_A})
    assert reply.status == 200
    assert reply.body == {"ok": True, "status": None, "value": None, "snippet": "", "error": "The URL is not valid."}


@pytest.mark.parametrize(
    ("doc", "payload", "code", "status"),
    [
        (None, {"id": ID_A}, "not_found", 404),
        (library(action(url="")), {"id": ID_A}, "needs_setup", 409),
        (library(action(bodyContentType="audio")), {"id": ID_A}, "missing_audio", 400),
        (library(action(bodyContentType="audio")), {"id": ID_A, "audio": "@@"}, "invalid", 400),
    ],
)
def test_run_refusals(env, doc, payload, code, status) -> None:
    if doc is not None:
        env.store.save(doc, base_revision=0)
    reply = op(env, "_op_http_action_run", payload)
    assert reply.status == status
    assert reply.body["ok"] is False and reply.body["error"] == code


@pytest.mark.parametrize(
    ("payload", "body"),
    [
        ({"id": ID_A, "values": {f"k{i}": "v" for i in range(65)}}, None),
        ({"id": ID_A, "values": {"k" * 65: "v"}}, None),
        ({"id": ID_A, "values": {"k": "v" * 4097}}, None),
        ({"id": ID_A, "audio": "A" * (4 * ((512 * 1024 + 2) // 3) + 4)}, None),
        ({"id": ID_A}, b" " * (1024 * 1024 + 1)),
    ],
)
def test_a_run_over_the_limits_is_refused_before_anything_else(env, payload, body) -> None:
    # Refused even with no library, before the store is read.
    env.domain.http_actions_store = None
    reply = op(env, "_op_http_action_run", payload, body=body)
    assert reply.status == 400 and reply.body["error"] == "invalid"
    assert env.session.calls == []


def test_a_run_at_the_limits_is_tried(env) -> None:
    env.store.save(library(action()), base_revision=0)
    env.session.script[URL_A] = FakeResponse(200)
    values = {f"{'k' * 62}{i:02d}": "v" * 4096 for i in range(64)}
    reply = op(env, "_op_http_action_run", {"id": ID_A, "values": values})
    assert reply.status == 200 and reply.body["status"] == 200


def test_a_voice_run_carries_its_clip(env) -> None:
    env.store.save(library(action(bodyContentType="audio")), base_revision=0)
    env.session.script[URL_A] = FakeResponse(204)
    clip = b"\x01\x02"
    reply = op(env, "_op_http_action_run", {"id": ID_A, "audio": base64.b64encode(clip).decode()})
    assert reply.body["status"] == 204
    assert env.session.calls[-1]["data"] == clip


def test_run_is_busy_past_four_at_once(env) -> None:
    env.store.save(library(action()), base_revision=0)
    gate = asyncio.Event()

    async def slow():
        await gate.wait()
        return FakeResponse(200)

    env.session.script[URL_A] = [slow] * 4

    async def scenario():
        held = [
            asyncio.create_task(env.ops["_op_http_action_run"](_Ctx(env.domain, "w", {"id": ID_A})))
            for _ in range(4)
        ]
        await asyncio.sleep(0.01)
        busy = await env.ops["_op_http_action_run"](_Ctx(env.domain, "w", {"id": ID_A}))
        gate.set()
        await asyncio.gather(*held)
        return busy

    busy = asyncio.run(scenario())
    assert busy.status == 429 and busy.body["error"] == "busy"


def test_every_op_is_unavailable_with_no_store_or_an_unreadable_file(env) -> None:
    env.domain.http_actions_store = None
    for name in ("_op_http_actions_hand_over", "_op_http_actions_get", "_op_http_action_run"):
        reply = op(env, name, {"document": library(), "id": ID_A})
        assert reply.status == 503 and reply.body["error"] == "unavailable"


def test_an_unreadable_library_is_a_signed_503(env) -> None:
    env.store._load_failed = True
    for name in ("_op_http_actions_hand_over", "_op_http_actions_get", "_op_http_action_run"):
        reply = op(env, name, {"document": library(), "id": ID_A})
        assert reply.status == 503 and reply.body["error"] == "unavailable"


# ── WebSocket ────────────────────────────────────────────────────────────


class _Connection:
    def __init__(self) -> None:
        self.results: dict[int, Any] = {}
        self.errors: list[tuple[int, str, str]] = []

    def send_result(self, msg_id: int, payload: Any) -> None:
        self.results[msg_id] = payload

    def send_error(self, msg_id: int, code: str, message: str) -> None:
        self.errors.append((msg_id, code, message))


def ws_call(env, command, **msg) -> _Connection:
    connection = _Connection()
    result = command(env.hass, connection, {"id": 1, **msg})
    if asyncio.iscoroutine(result):
        asyncio.run(result)
    return connection


def test_ws_get_with_nothing_stored(env) -> None:
    connection = ws_call(env, env.ws.ws_http_actions_get)
    assert connection.results[1] == {
        "revision": 0,
        "hash": None,
        "updated_at": None,
        "updated_by": None,
        "handed_over": [],
        "delivered": {},
    }


def test_ws_save_then_get(env) -> None:
    doc = library(action())
    saved = ws_call(env, env.ws.ws_http_actions_save, base_revision=0, document=doc)
    assert saved.results[1] == {"revision": 1}
    op(env, "_op_http_actions_get", {})
    got = ws_call(env, env.ws.ws_http_actions_get).results[1]
    assert set(got) == {"revision", "hash", "updated_at", "updated_by", "handed_over", "delivered", "document"}
    assert got["document"] == doc
    assert got["updated_by"] == "panel"
    assert got["delivered"] == {"watch-A": 1}


def test_ws_save_conflict_and_invalid(env) -> None:
    ws_call(env, env.ws.ws_http_actions_save, base_revision=0, document=library())
    [(_, code, message)] = ws_call(
        env, env.ws.ws_http_actions_save, base_revision=0, document=library()
    ).errors
    assert code == "conflict" and CONFLICT.match(message).group(1) == "1"
    [(_, code, _m)] = ws_call(
        env, env.ws.ws_http_actions_save, base_revision=1, document={"actions": 1}
    ).errors
    assert code == "invalid"


def test_ws_commands_are_unavailable_without_the_integration(env) -> None:
    env.hass.data = {}
    for command, msg in (
        (env.ws.ws_http_actions_get, {}),
        (env.ws.ws_http_actions_save, {"base_revision": 0, "document": library()}),
        (env.ws.ws_http_actions_test, {"action": action()}),
    ):
        [(_, code, _m)] = ws_call(env, command, **msg).errors
        assert code == "unavailable"


def test_ws_test_answers_the_whole_shape(env) -> None:
    env.session.script["https://api.example/x"] = FakeResponse(200, b'{"a":[{"b":1}]}', {"ETag": "e"})
    connection = ws_call(
        env,
        env.ws.ws_http_actions_test,
        action=action(method="GET", url="{{base}}/x", responseConfig={"source": "header", "headerName": "etag"}),
        global_variables=[{"id": "G", "key": "base", "value": "https://api.example"}],
        values={},
    )
    result = connection.results[1]
    assert set(result) == {
        "status", "value", "snippet", "error", "headers", "paths", "elapsed_ms",
        "body", "body_size", "body_binary", "body_cut",
    }
    assert result["status"] == 200 and result["value"] == "e"
    assert result["headers"] == {"ETag": "e"}
    assert result["paths"] == [{"path": "a.0.b", "value": "1"}]
    # A test saves nothing.
    assert env.store.revision == 0


def test_ws_test_refuses_a_malformed_draft(env) -> None:
    [(_, code, _m)] = ws_call(env, env.ws.ws_http_actions_test, action={"id": "x"}).errors
    assert code == "invalid"


@pytest.mark.parametrize(
    "values",
    [{f"k{i}": "v" for i in range(65)}, {"k" * 65: "v"}, {"k": "v" * 4097}],
)
def test_ws_test_refuses_values_over_the_limits(env, values) -> None:
    [(_, code, _m)] = ws_call(env, env.ws.ws_http_actions_test, action=action(), values=values).errors
    assert code == "invalid"
    assert env.session.calls == []


# ── static ───────────────────────────────────────────────────────────────


def test_the_three_ops_are_in_the_dispatch_table() -> None:
    tree = ast.parse(_VIEWS.read_text())
    for node in tree.body:
        target = node.target if isinstance(node, ast.AnnAssign) else (
            node.targets[0] if isinstance(node, ast.Assign) else None
        )
        if isinstance(target, ast.Name) and target.id == "_OP_HANDLERS":
            table = {
                k.value: v.id
                for k, v in zip(node.value.keys, node.value.values, strict=True)
                if isinstance(k, ast.Constant) and isinstance(v, ast.Name)
            }
            break
    else:
        raise AssertionError("no _OP_HANDLERS")
    assert table["http_actions_hand_over"] == "_op_http_actions_hand_over"
    assert table["http_actions_get"] == "_op_http_actions_get"
    assert table["http_action_run"] == "_op_http_action_run"


def test_setup_builds_the_store_and_runner_and_wakes_the_polls() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    for expected in (
        "http_actions_store = HTTPActionsStore(hass)",
        "coordinator.attach_http_actions_store(http_actions_store)",
        "http_actions_store.async_add_listener(coordinator.http_actions_changed)",
        "http_action_runner = HTTPActionRunner(hass)",
        "http_actions_store=http_actions_store,",
        "http_action_runner=http_action_runner,",
        "await data.http_action_runner.async_shutdown()",
    ):
        assert expected in init, expected
