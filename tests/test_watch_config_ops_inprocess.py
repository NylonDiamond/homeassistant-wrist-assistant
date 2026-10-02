"""In-process tests for the two watch config ops, with no Home Assistant.

The same approach as ``test_v2_views_inprocess.py``: the handlers are pulled
out of ``wa_v2_views.py`` by name and run in a namespace of stand-ins, against
a real ``WatchConfigStore`` loaded the way ``test_watch_config_store.py`` loads
it. The fake op context's ``signed_json`` hands back the status and body, so
the wire shapes the app is built against are asserted here exactly:

* get with no record: ``revision: 0``, null ``hash`` and ``updated_at``, no
  document.
* get omits ``document`` when ``since_revision`` is the stored revision.
* put answers ``{"ok": true, "revision": N}``.
* a stale put answers a signed 409 ``{"ok": false, "error": "conflict",
  "revision": N, "hash": "..."}`` and nothing else.
* the owner is always the signing id; nothing a body says can change that.

The static half (both ops in the dispatch table, the capability advertised)
sits at the bottom.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import types
from pathlib import Path
from typing import Any

import pytest

from test_watch_config_store import _FakeStore, _Hass, _loaded_module

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_MODULE = _PKG_DIR / "wa_v2_views.py"

_NAMES = (
    "_watch_config_refusal",
    "_op_watch_config_get",
    "_op_watch_config_put",
)

WATCH = "watch-A"
OTHER = "watch-B"
HASH_1 = "a" * 64
HASH_2 = "b" * 64


class _Response:
    def __init__(self, status: int, body: Any) -> None:
        self.status = status
        self.body = body


class _Ctx:
    def __init__(self, store: Any, watch_id: str, payload: dict) -> None:
        self.watch_id = watch_id
        self.payload = payload
        self.domain_data = types.SimpleNamespace(watch_config_store=store)

    def signed_json(self, payload: dict, status: int = 200) -> _Response:
        return _Response(status=status, body=payload)


def _handlers(store_mod: Any) -> dict[str, Any]:
    source = _MODULE.read_text()
    tree = ast.parse(source, filename=str(_MODULE))
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
    namespace: dict[str, Any] = {
        "Any": Any,
        "Response": _Response,
        "WatchConfigConflictError": store_mod.WatchConfigConflictError,
        "WatchConfigStoreError": store_mod.WatchConfigStoreError,
        "WatchConfigUnavailableError": store_mod.WatchConfigUnavailableError,
        "WatchConfigValidationError": store_mod.WatchConfigValidationError,
    }
    exec(code, namespace)  # noqa: S102
    return namespace


@pytest.fixture
def env():
    with _loaded_module() as store_mod:
        store = store_mod.WatchConfigStore(_Hass())
        asyncio.run(store.async_load())
        yield types.SimpleNamespace(store=store, mod=store_mod, views=_handlers(store_mod))


def _get(env, payload: dict, watch_id: str = WATCH) -> _Response:
    return asyncio.run(env.views["_op_watch_config_get"](_Ctx(env.store, watch_id, payload)))


def _put(env, payload: dict, watch_id: str = WATCH) -> _Response:
    return asyncio.run(env.views["_op_watch_config_put"](_Ctx(env.store, watch_id, payload)))


def _doc(name: str = "Home") -> dict:
    return {"schemaVersion": 1, "pages": [{"name": name, "tiles": []}]}


def _put_body(doc: dict | None = None, *, base: Any = 0, digest: str = HASH_1,
              force: Any = None, kind: Any = "pages") -> dict:
    body: dict[str, Any] = {
        "kind": kind,
        "base_revision": base,
        "hash": digest,
        "document": doc if doc is not None else _doc(),
    }
    if force is not None:
        body["force"] = force
    return body


# ── get ──────────────────────────────────────────────────────────────────


def test_get_with_no_record_is_revision_zero_and_no_document(env) -> None:
    reply = _get(env, {"kind": "pages"})
    assert reply.status == 200
    assert reply.body == {
        "ok": True,
        "kind": "pages",
        "revision": 0,
        "hash": None,
        "updated_at": None,
    }


def test_get_with_since_revision_zero_and_no_record_still_has_no_document(env) -> None:
    reply = _get(env, {"kind": "pages", "since_revision": 0})
    assert "document" not in reply.body
    assert reply.body["revision"] == 0


def test_put_then_get_round_trips_the_document_hash_and_time(env) -> None:
    doc = _doc("Kitchen")
    reply = _put(env, _put_body(doc))
    assert reply.status == 200
    assert reply.body == {"ok": True, "revision": 1}

    got = _get(env, {"kind": "pages"})
    record = env.store.get(WATCH, "pages")
    assert got.status == 200
    assert got.body == {
        "ok": True,
        "kind": "pages",
        "revision": 1,
        "hash": HASH_1,
        "updated_at": record.updated_at,
        "document": doc,
    }
    assert record.updated_by == WATCH


def test_get_omits_the_document_only_when_since_revision_is_current(env) -> None:
    _put(env, _put_body(_doc("v1")))
    _put(env, _put_body(_doc("v2"), base=1, digest=HASH_2))

    current = _get(env, {"kind": "pages", "since_revision": 2})
    assert current.body["revision"] == 2
    assert current.body["hash"] == HASH_2
    assert "document" not in current.body

    behind = _get(env, {"kind": "pages", "since_revision": 1})
    assert behind.body["document"]["pages"][0]["name"] == "v2"

    # A phone ahead of the server (a Home Assistant backup was restored)
    # gets the document too, so it can see what it is about to overwrite.
    ahead = _get(env, {"kind": "pages", "since_revision": 9})
    assert ahead.body["revision"] == 2
    assert "document" in ahead.body


def test_get_never_carries_the_history(env) -> None:
    _put(env, _put_body(_doc("v1")))
    _put(env, _put_body(_doc("v2"), base=1, digest=HASH_2))
    reply = _get(env, {"kind": "pages"})
    assert set(reply.body) == {"ok", "kind", "revision", "hash", "updated_at", "document"}
    assert "v1" not in repr(reply.body)


@pytest.mark.parametrize("since", [-1, "1", True, 1.5])
def test_get_refuses_a_bad_since_revision(env, since) -> None:
    reply = _get(env, {"kind": "pages", "since_revision": since})
    assert reply.status == 400
    assert reply.body["ok"] is False
    assert reply.body["error"] == "invalid"


@pytest.mark.parametrize("payload", [{}, {"kind": "quick_actions"}, {"kind": 1}])
def test_get_refuses_an_unknown_or_missing_kind(env, payload) -> None:
    reply = _get(env, payload)
    assert reply.status == 400
    assert reply.body["error"] == "invalid"
    assert "kind" in reply.body["message"]


# ── put ──────────────────────────────────────────────────────────────────


def test_put_on_the_stored_revision_is_accepted(env) -> None:
    _put(env, _put_body())
    reply = _put(env, _put_body(_doc("v2"), base=1, digest=HASH_2))
    assert reply.status == 200
    assert reply.body == {"ok": True, "revision": 2}


def test_a_stale_put_is_a_409_with_exactly_the_conflict_shape(env) -> None:
    _put(env, _put_body())
    _put(env, _put_body(_doc("v2"), base=1, digest=HASH_2))

    reply = _put(env, _put_body(_doc("stale"), base=1, digest="c" * 64))
    assert reply.status == 409
    assert reply.body == {"ok": False, "error": "conflict", "revision": 2, "hash": HASH_2}
    assert env.store.get(WATCH, "pages").document["pages"][0]["name"] == "v2"


def test_a_put_based_on_a_record_that_is_gone_conflicts_at_zero(env) -> None:
    reply = _put(env, _put_body(base=5))
    assert reply.status == 409
    assert reply.body == {"ok": False, "error": "conflict", "revision": 0, "hash": None}


def test_a_lost_reply_retry_conflicts_with_the_client_s_own_hash(env) -> None:
    """The upload landed but its reply never arrived. The retry is stale, and
    the 409's hash is the one the client sent, which is how it can tell."""
    _put(env, _put_body(digest=HASH_1))
    reply = _put(env, _put_body(digest=HASH_1))
    assert reply.status == 409
    assert reply.body["hash"] == HASH_1


def test_force_overrides_a_stale_base_and_keeps_the_replaced_copy(env) -> None:
    server_copy = _doc("server")
    _put(env, _put_body(server_copy))
    reply = _put(env, _put_body(_doc("phone"), base=0, digest=HASH_2, force=True))
    assert reply.status == 200
    assert reply.body == {"ok": True, "revision": 2}
    record = env.store.get(WATCH, "pages")
    assert record.history[-1].document == server_copy


def test_force_false_is_the_same_as_no_force(env) -> None:
    _put(env, _put_body())
    assert _put(env, _put_body(base=0, force=False)).status == 409


@pytest.mark.parametrize(
    ("body", "word"),
    [
        (_put_body(kind="quick_actions"), "kind"),
        (_put_body(doc={"pages": {}}), "pages"),
        (_put_body(doc={"tiles": []}), "pages"),
        ({"kind": "pages", "base_revision": 0, "hash": HASH_1}, "object"),
        ({"kind": "pages", "base_revision": 0, "hash": HASH_1, "document": [1]}, "object"),
        (_put_body(digest="A" * 64), "hash"),
        ({"kind": "pages", "base_revision": 0, "document": _doc()}, "hash"),
        ({"kind": "pages", "hash": HASH_1, "document": _doc()}, "base_revision"),
        (_put_body(base=-1), "base_revision"),
        (_put_body(force="yes"), "force"),
    ],
)
def test_a_malformed_put_is_a_signed_400(env, body, word) -> None:
    reply = _put(env, body)
    assert reply.status == 400
    assert reply.body["ok"] is False
    assert reply.body["error"] == "invalid"
    assert word in reply.body["message"]
    assert env.store.get(WATCH, "pages") is None


def test_an_oversized_document_is_a_signed_400(env) -> None:
    doc = {"pages": [], "blob": "x" * (2 * 1024 * 1024)}
    reply = _put(env, _put_body(doc))
    assert reply.status == 400
    assert reply.body["error"] == "invalid"
    assert "limit" in reply.body["message"]
    assert env.store.get(WATCH, "pages") is None


def test_an_unreadable_file_answers_503_for_both_ops(env) -> None:
    _put(env, _put_body())
    _FakeStore.unreadable.add(env.mod._owner_key(WATCH))
    store = env.mod.WatchConfigStore(_Hass())
    asyncio.run(store.async_load())
    env.store = store

    for reply in (_get(env, {"kind": "pages"}), _put(env, _put_body(force=True))):
        assert reply.status == 503
        assert reply.body["ok"] is False
        assert reply.body["error"] == "unavailable"


# ── ownership ────────────────────────────────────────────────────────────


def test_the_owner_is_the_signer_and_a_body_cannot_name_another(env) -> None:
    body = _put_body(_doc("mine"))
    body["owner_watch_id"] = OTHER
    _put(env, body, watch_id=WATCH)

    assert _get(env, {"kind": "pages"}, watch_id=OTHER).body["revision"] == 0
    assert _get(env, {"kind": "pages", "owner_watch_id": WATCH}, watch_id=OTHER).body[
        "revision"
    ] == 0
    assert _get(env, {"kind": "pages"}, watch_id=WATCH).body["revision"] == 1
    assert env.store.get(WATCH, "pages").updated_by == WATCH


def test_two_watches_keep_separate_revisions(env) -> None:
    _put(env, _put_body(_doc("A")), watch_id=WATCH)
    _put(env, _put_body(_doc("A2"), base=1, digest=HASH_2), watch_id=WATCH)
    reply = _put(env, _put_body(_doc("B")), watch_id=OTHER)
    assert reply.body == {"ok": True, "revision": 1}
    assert _get(env, {"kind": "pages"}, watch_id=OTHER).body["document"]["pages"][0]["name"] == "B"


# ── static: dispatch and capability ──────────────────────────────────────


def _op_table() -> dict[str, str]:
    tree = ast.parse(_MODULE.read_text(), filename=str(_MODULE))
    for node in tree.body:
        target = None
        if isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name):
            target, value = node.target.id, node.value
        elif isinstance(node, ast.Assign) and isinstance(node.targets[0], ast.Name):
            target, value = node.targets[0].id, node.value
        if target == "_OP_HANDLERS":
            assert isinstance(value, ast.Dict)
            return {
                k.value: v.id
                for k, v in zip(value.keys, value.values, strict=True)
                if isinstance(k, ast.Constant) and isinstance(v, ast.Name)
            }
    raise AssertionError("wa_v2_views.py has no _OP_HANDLERS table")


def test_both_ops_are_in_the_dispatch_table() -> None:
    table = _op_table()
    assert table["watch_config_get"] == "_op_watch_config_get"
    assert table["watch_config_put"] == "_op_watch_config_put"


def test_the_watch_config_capability_is_advertised() -> None:
    """The phone makes no watch_config request without it. Registered
    unconditionally at setup, like the complication capabilities."""
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    assert "register_capability(WATCH_CONFIG_CAPABILITY)" in init
    assert 'WATCH_CONFIG_CAPABILITY = "watch_config"' in const
