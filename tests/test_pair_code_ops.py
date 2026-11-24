"""The iPhone's signed ``pair_lookup`` and ``pair_confirm``: it confirms its
watch's code itself (capability ``phone_confirms_pair``).

The two ops are pulled out of ``wa_v2_views.py`` by name, the way
``test_home_map_page_add.py`` pulls its own, and run over the real
``pairing_ws`` bodies, the real secret store and the real request store of
``test_pairing_ws.pairing_env``. The panel's own commands are covered in
``test_pairing_ws.py``; these tests pin what the iPhone's door adds and
takes away.

Covered: a lookup and a confirm (old form and sealed, ``waiting`` kept),
the watch bound to the iPhone's own user and never to an administrator's
pick, Replace (own watch, another user's, no one's, an admin's iPhone too),
a watch's code that carries a paired iPhone's id, a code from outside the network, an expired, unknown or spent code, a
caller that is not an iPhone, an iPhone with no user, a deleted or turned
off user, an iPhone's code refused, the body checks, the dispatch table,
the capability, and the panel and the iPhone running one body.
"""

from __future__ import annotations
import __future__

import ast
import asyncio
import base64
import json
from pathlib import Path
from typing import Any

import pytest
from platform_names import PLATFORM_HELPERS, platform_namespace
from test_pairing_ws import (
    DOMAIN,
    SECRET_A,
    SECRET_B,
    WATCH,
    _gone,
    _pending,
    _sealed_pending,
    _User,
    pairing_env,
)

_ROOT = Path(__file__).resolve().parents[1]
_PKG_DIR = _ROOT / "custom_components" / "wrist_assistant"
_VIEWS = _PKG_DIR / "wa_v2_views.py"
_NAMES = (
    "_caller_is_iphone",
    *PLATFORM_HELPERS,
    "_pair_code_refusal",
    "_pair_code_caller",
    "_pair_code_payload",
    "_op_pair_lookup",
    "_op_pair_confirm",
)
_CONSTANTS = (
    "USER_GONE_ERROR",
    "USER_GONE_MESSAGE",
    "NOT_ALLOWED_ERROR",
    "NOT_ALLOWED_MESSAGE",
    "_PAIR_CODE_MAX_CHARS",
    "_PAIR_CODE_REFUSAL_STATUS",
)

# Chen's iPhone, an iPhone of Pat (an administrator), and an iPhone from
# before devices belonged to a person.
CHEN_PHONE = "iphone:chen"
PAT_PHONE = "iphone:pat"
UNBOUND_PHONE = "iphone:nobody"
PHONE_CODE_ID = "iphone:new-phone"


class _Response:
    def __init__(self, status: int, body: Any) -> None:
        self.status = status
        self.body = body


class _Ctx:
    def __init__(self, hass: Any, watch_id: str, payload: dict, user_id: str | None) -> None:
        self.hass = hass
        self.domain_data = hass.data[DOMAIN]
        self.watch_id = watch_id
        self.payload = payload
        self.user_id = user_id

    def signed_json(self, payload: dict, status: int = 200) -> _Response:
        # Through JSON, as the wire carries it.
        return _Response(status, json.loads(json.dumps(payload)))


def _ops(ws: Any) -> dict[str, Any]:
    tree = ast.parse(_VIEWS.read_text(), filename=str(_VIEWS))
    wanted: list[ast.stmt] = [
        node
        for node in tree.body
        if isinstance(node, ast.Assign)
        and isinstance(node.targets[0], ast.Name)
        and node.targets[0].id in _CONSTANTS
    ]
    assert sorted(n.targets[0].id for n in wanted) == sorted(_CONSTANTS)
    functions = [
        node
        for node in tree.body
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in _NAMES
    ]
    assert sorted(n.name for n in functions) == sorted(_NAMES)
    code = compile(
        ast.Module(body=wanted + functions, type_ignores=[]),
        str(_VIEWS),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    namespace: dict[str, Any] = {
        **platform_namespace(),
        "Any": Any,
        "Response": _Response,
        "_OpContext": _Ctx,
        "is_iphone_entry": lambda secret: getattr(secret, "device_kind", None) == "iphone",
        "PAIR_KIND_WATCH": "watch",
        "lookup_code": ws.lookup_code,
        "async_confirm_code": ws.async_confirm_code,
        "takeover_refusal": ws.takeover_refusal,
        "wrong_entry_refusal": ws.wrong_entry_refusal,
    }
    exec(code, namespace)  # noqa: S102
    return namespace


@pytest.fixture
def env():
    with pairing_env() as loaded:
        loaded.ops = _ops(loaded.ws)
        store = loaded.secret_store
        store.register(CHEN_PHONE, SECRET_B, "iphone-self-provision", user_id="chen")
        store.register(PAT_PHONE, SECRET_B, "iphone-self-provision", user_id="pat")
        store.register(UNBOUND_PHONE, SECRET_B, "iphone-self-provision")
        yield loaded


def _run(env, op: str, payload: dict, *, signer: str = CHEN_PHONE, user_id: Any = "default"):
    if user_id == "default":
        entry = env.secret_store.get(signer)
        user_id = entry.user_id if entry is not None else None
    ctx = _Ctx(env.hass, signer, payload, user_id)
    return asyncio.run(env.ops[op](ctx))


def lookup(env, payload: dict, **kw) -> _Response:
    return _run(env, "_op_pair_lookup", payload, **kw)


def confirm(env, payload: dict, **kw) -> _Response:
    return _run(env, "_op_pair_confirm", payload, **kw)


def _refused(reply: _Response, status: int, error: str) -> str:
    assert reply.status == status, reply.body
    assert reply.body["ok"] is False
    assert reply.body["error"] == error
    return reply.body["message"]


# ── lookup ───────────────────────────────────────────────────────────────


def test_a_lookup_answers_what_the_panel_s_lookup_does(env) -> None:
    pending = _pending(env, remote="192.0.2.7")
    env.clock.now += 30
    reply = lookup(env, {"code": f" {pending.code[:3].lower()}-{pending.code[3:]} "})
    assert reply.status == 200
    assert reply.body == {
        "ok": True,
        "found": True,
        "watch_id": WATCH,
        "kind": "watch",
        "platform": "watchos",
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
        "needs_allow_remote": True,
        "blocked": None,
    }
    # The same fields as the panel's, seen by the same user.
    panel, _refusal = env.ws.lookup_code(
        env.pair_store, env.secret_store, pending.code, user_id="chen"
    )
    assert {k: v for k, v in reply.body.items() if k not in ("ok", "blocked")} == panel
    # Looking up changes nothing.
    assert env.pair_store.get(pending.code) is pending
    assert env.secret_store.get(WATCH) is None


@pytest.mark.parametrize("how", ["unknown", "expired", "confirmed"])
def test_a_lookup_of_a_code_that_is_not_waiting_is_not_found(env, how) -> None:
    code = "ZZZZZZ"
    if how != "unknown":
        code = _pending(env).code
    if how == "expired":
        env.clock.now += 600
    if how == "confirmed":
        assert confirm(env, {"code": code}).status == 200
    assert lookup(env, {"code": code}).body == {"ok": True, "found": False}


@pytest.mark.parametrize(
    ("owner", "blocked", "other"),
    [
        ("chen", None, False),
        ("bob", "paired_by_other_user", True),
        (None, "paired_by_no_one", False),
    ],
)
def test_a_lookup_says_what_would_block_the_confirm(env, owner, blocked, other) -> None:
    env.secret_store.register(WATCH, SECRET_B, "watch-self-provision", user_id=owner)
    body = lookup(env, {"code": _pending(env).code}).body
    assert body["already_paired"] is True
    assert body["needs_replace"] is True
    assert body["paired_by_other_user"] is other
    assert body["bound_user_id"] == owner
    assert body["blocked"] == blocked


def test_a_lookup_of_an_iphone_s_code_is_refused(env) -> None:
    pending, _private = _sealed_pending(env, kind="iphone", watch_id=PHONE_CODE_ID)
    message = _refused(lookup(env, {"code": pending.code}), 409, "not_a_watch_code")
    assert message == (
        "This code is for an iPhone, not a watch. Type it in Home Assistant: "
        "HouseLit, Devices, Pair."
    )
    assert env.pair_store.get(pending.code) is pending


# ── confirm ──────────────────────────────────────────────────────────────


def test_a_confirm_pairs_the_watch_to_the_iphone_s_own_user(env) -> None:
    pending = _pending(env)
    reply = confirm(env, {"code": pending.code.lower()})
    assert reply.status == 200
    assert reply.body == {
        "ok": True,
        "watch_id": WATCH,
        "kind": "watch",
        "device_name": "Test Watch",
        "result": "new",
        "user_id": "chen",
    }
    entry = env.secret_store.get(WATCH)
    assert entry.secret_b64 == SECRET_A
    assert entry.user_id == "chen"
    assert entry.label == "watch-code-pair"
    assert entry.device_kind == "watch"
    assert len(env.pair_store) == 0
    assert env.logbook == [
        ("registered", {"watch_id": WATCH, "label": "watch-code-pair", "app_version": "3.0.1"})
    ]
    # Spent: the same code again is unknown.
    _refused(confirm(env, {"code": pending.code}), 400, "unknown_code")


def test_a_user_id_in_the_body_is_never_read(env) -> None:
    """The op takes no user: the watch is the signer's user's, even when
    the iPhone's user is an administrator who names someone else."""
    reply = confirm(env, {"code": _pending(env).code, "user_id": "root"}, signer=PAT_PHONE)
    assert reply.status == 200
    assert reply.body["user_id"] == "pat"
    assert env.secret_store.get(WATCH).user_id == "pat"


def test_a_sealed_confirm_may_answer_waiting_and_the_fetch_stores_it(env) -> None:
    pending, private = _sealed_pending(env)
    reply = confirm(env, {"code": pending.code})
    assert reply.status == 200
    assert reply.body["result"] == "waiting"
    assert reply.body["user_id"] == "chen"
    assert env.secret_store.get(WATCH) is None
    state, box = asyncio.run(
        env.ws.async_pair_status(env.hass, env.pair_store, env.secret_store, WATCH)
    )
    assert state == "confirmed"
    entry = env.secret_store.get(WATCH)
    assert entry.user_id == "chen"
    assert base64.b64encode(env.sealed.open_pair_secret(private, WATCH, box)).decode() == (
        entry.secret_b64
    )


def test_a_confirm_of_an_iphone_s_code_is_refused_and_leaves_it_waiting(env) -> None:
    pending, _private = _sealed_pending(env, kind="iphone", watch_id=PHONE_CODE_ID)
    _refused(confirm(env, {"code": pending.code}), 409, "not_a_watch_code")
    assert env.pair_store.get(pending.code) is pending
    assert env.secret_store.get(PHONE_CODE_ID) is None


@pytest.mark.parametrize("how", ["unknown", "expired"])
def test_a_confirm_of_an_unknown_or_expired_code_writes_nothing(env, how) -> None:
    code = "ZZZZZZ"
    if how == "expired":
        code = _pending(env).code
        env.clock.now += 601
    message = _refused(confirm(env, {"code": code}), 400, "unknown_code")
    assert "10 minutes" in message
    assert env.secret_store.get(WATCH) is None
    assert env.logbook == []


# ── Replace ──────────────────────────────────────────────────────────────


def test_the_user_s_own_watch_needs_replace_then_rekeys(env) -> None:
    env.secret_store.register(WATCH, SECRET_B, "watch-self-provision", user_id="chen")
    pending = _pending(env)
    _refused(confirm(env, {"code": pending.code}), 409, "needs_replace")
    assert env.pair_store.get(pending.code) is pending
    reply = confirm(env, {"code": pending.code, "replace": True})
    assert reply.status == 200
    assert reply.body["result"] == "rekey"
    entry = env.secret_store.get(WATCH)
    assert entry.secret_b64 == SECRET_A
    assert entry.user_id == "chen"


@pytest.mark.parametrize("signer", [CHEN_PHONE, PAT_PHONE])
def test_another_user_s_watch_is_never_taken(env, signer) -> None:
    """Not even by an administrator's iPhone: replacing someone else's
    pairing stays a job for an administrator in the panel."""
    env.secret_store.register(WATCH, SECRET_B, "watch-self-provision", user_id="bob")
    pending = _pending(env)
    message = _refused(
        confirm(env, {"code": pending.code, "replace": True}, signer=signer),
        403,
        "paired_by_other_user",
    )
    assert "Only an administrator" in message
    assert env.secret_store.get(WATCH).secret_b64 == SECRET_B
    assert env.secret_store.get(WATCH).user_id == "bob"
    assert env.pair_store.get(pending.code) is pending


@pytest.mark.parametrize("signer", [CHEN_PHONE, PAT_PHONE])
def test_a_watch_bound_to_no_one_is_never_taken(env, signer) -> None:
    env.secret_store.register(WATCH, SECRET_B, "watch-self-provision")
    pending = _pending(env)
    _refused(
        confirm(env, {"code": pending.code, "replace": True}, signer=signer),
        403,
        "paired_by_no_one",
    )
    assert env.secret_store.get(WATCH).user_id is None
    assert env.pair_store.get(pending.code) is pending


# ── a watch's code with an iPhone's id ───────────────────────────────────


@pytest.mark.parametrize("phone", [CHEN_PHONE, PAT_PHONE])
def test_a_watch_s_code_never_takes_a_paired_iphone_s_id(env, phone) -> None:
    """A device names its own id when it asks for a code, so a watch's code
    may carry the id of a paired iPhone, even the signer's own. With Replace
    it would re-key that iPhone as a watch, so it is refused whatever the
    ticks, and the lookup says so before any confirm."""
    pending, _private = _sealed_pending(env, watch_id=phone, remote="203.0.113.9")
    body = lookup(env, {"code": pending.code}).body
    assert body["found"] is True
    assert body["blocked"] == "not_a_watch"
    message = _refused(
        confirm(env, {"code": pending.code, "replace": True, "allow_remote": True}),
        409,
        "not_a_watch",
    )
    assert message == (
        "This code uses the id of a paired iPhone, so it cannot pair a watch. "
        "Replace does not change that."
    )
    entry = env.secret_store.get(phone)
    assert entry.secret_b64 == SECRET_B
    assert entry.device_kind == "iphone"
    assert entry.label == "iphone-self-provision"
    assert env.pair_store.get(pending.code) is pending
    assert env.logbook == []


def test_an_iphone_s_id_is_refused_before_any_tick_is_asked(env) -> None:
    """No Replace and no Allow remote: the refusal is still ``not_a_watch``,
    so the iPhone never asks for a tick that could not help."""
    pending, _private = _sealed_pending(env, watch_id=CHEN_PHONE, remote="203.0.113.9")
    _refused(confirm(env, {"code": pending.code}), 409, "not_a_watch")


# ── from outside the network ─────────────────────────────────────────────


def test_a_code_from_outside_the_network_needs_allow_remote(env) -> None:
    pending = _pending(env, remote="8.8.8.8")
    message = _refused(confirm(env, {"code": pending.code}), 409, "needs_allow_remote")
    assert 'Tick "I expect this watch"' in message
    assert env.pair_store.get(pending.code) is pending
    assert env.secret_store.get(WATCH) is None
    reply = confirm(env, {"code": pending.code, "allow_remote": True})
    assert reply.status == 200
    assert env.secret_store.get(WATCH).user_id == "chen"


def test_a_code_from_home_needs_no_tick(env) -> None:
    assert confirm(env, {"code": _pending(env, remote="192.168.1.40").code}).status == 200


# ── who may ask ──────────────────────────────────────────────────────────


@pytest.mark.parametrize("op", ["lookup", "confirm"])
def test_a_watch_may_not_ask(env, op) -> None:
    env.secret_store.register("watch-other", SECRET_B, "watch-self-provision", user_id="chen")
    pending = _pending(env)
    run = lookup if op == "lookup" else confirm
    message = _refused(run(env, {"code": pending.code}, signer="watch-other"), 403, "not_an_iphone")
    assert message == "Only an iPhone confirms a watch's code."
    assert env.pair_store.get(pending.code) is pending
    assert env.secret_store.get(WATCH) is None


@pytest.mark.parametrize("op", ["lookup", "confirm"])
def test_an_iphone_of_no_user_may_not_ask(env, op) -> None:
    pending = _pending(env)
    run = lookup if op == "lookup" else confirm
    message = _refused(run(env, {"code": pending.code}, signer=UNBOUND_PHONE), 403, "no_user")
    assert "Pair it again" in message
    assert env.secret_store.get(WATCH) is None


@pytest.mark.parametrize(
    ("user", "error"),
    [
        (None, "user_gone"),
        (_gone("chen", is_active=False), "not_allowed"),
        (_gone("chen", system_generated=True), "not_allowed"),
    ],
)
def test_a_deleted_or_turned_off_user_may_not_ask(env, user, error) -> None:
    async def async_get_user(user_id: str) -> _User | None:
        return user

    env.hass.auth.async_get_user = async_get_user
    pending = _pending(env)
    _refused(confirm(env, {"code": pending.code}), 403, error)
    _refused(lookup(env, {"code": pending.code}), 403, error)
    assert env.secret_store.get(WATCH) is None
    assert env.pair_store.get(pending.code) is pending


# ── the body ─────────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"code": ""},
        {"code": "   "},
        {"code": 123456},
        {"code": "A" * 33},
        {"code": "ABCDEF", "replace": "yes"},
        {"code": "ABCDEF", "allow_remote": 1},
    ],
)
def test_a_body_without_a_usable_code_is_invalid(env, payload) -> None:
    _refused(confirm(env, payload), 400, "invalid")
    _refused(lookup(env, payload), 400, "invalid")


def test_without_the_stores_the_ops_say_unavailable(env) -> None:
    env.hass.data[DOMAIN].pair_request_store = None
    _refused(lookup(env, {"code": "ABCDEF"}), 503, "unavailable")
    _refused(confirm(env, {"code": "ABCDEF"}), 503, "unavailable")


def test_no_refusal_is_a_404(env) -> None:
    """An app reads a 404 from the action route as an integration that is
    missing or still starting."""
    assert 404 not in env.ops["_PAIR_CODE_REFUSAL_STATUS"].values()


# ── the table, the capability, one body ──────────────────────────────────


def _handlers() -> dict[str, str]:
    tree = ast.parse(_VIEWS.read_text())
    for node in tree.body:
        target = node.targets[0] if isinstance(node, ast.Assign) else (
            node.target if isinstance(node, ast.AnnAssign) else None
        )
        if isinstance(target, ast.Name) and target.id == "_OP_HANDLERS":
            return {
                k.value: v.id
                for k, v in zip(node.value.keys, node.value.values, strict=True)
                if isinstance(k, ast.Constant) and isinstance(v, ast.Name)
            }
    raise AssertionError("no _OP_HANDLERS")


def test_the_ops_are_in_the_dispatch_table() -> None:
    table = _handlers()
    assert table["pair_lookup"] == "_op_pair_lookup"
    assert table["pair_confirm"] == "_op_pair_confirm"


def test_the_capability_is_listed_beside_the_other_pairing_ones() -> None:
    const = (_PKG_DIR / "const.py").read_text()
    init = (_PKG_DIR / "__init__.py").read_text()
    assert 'PHONE_CONFIRMS_PAIR_CAPABILITY = "phone_confirms_pair"' in const
    lines = [line.strip() for line in init.splitlines() if "register_capability(" in line]
    assert lines.index("coordinator.register_capability(PHONE_CONFIRMS_PAIR_CAPABILITY)") == (
        lines.index("coordinator.register_capability(PHONE_PAIRING_CAPABILITY)") + 1
    )


def _called(source: Path, function: str) -> set[str]:
    tree = ast.parse(source.read_text())
    [node] = [
        n
        for n in tree.body
        if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef)) and n.name == function
    ]
    return {
        n.func.id
        for n in ast.walk(node)
        if isinstance(n, ast.Call) and isinstance(n.func, ast.Name)
    }


def test_the_panel_and_the_iphone_run_one_body() -> None:
    pairing = _PKG_DIR / "pairing_ws.py"
    assert "lookup_code" in _called(pairing, "ws_pair_lookup")
    assert "async_confirm_code" in _called(pairing, "ws_pair_confirm")
    assert "lookup_code" in _called(_VIEWS, "_op_pair_lookup")
    assert "async_confirm_code" in _called(_VIEWS, "_op_pair_confirm")
    assert "_caller_is_iphone" in _called(_VIEWS, "_pair_code_caller")
    # The iPhone's confirm never reads a user from the body.
    source = ast.unparse(
        next(
            n
            for n in ast.parse(_VIEWS.read_text()).body
            if isinstance(n, ast.AsyncFunctionDef) and n.name == "_op_pair_confirm"
        )
    )
    assert "'user_id'" not in source
    assert "caller_is_admin=False" in source
