"""In-process tests for the signed ``notification_snapshot`` op.

A camera push carries ``snapshot_token``, and a current app redeems it
through this op, so what rides through the relay and Apple's push service
opens nothing without a paired device. The op and its two frame readers are
pulled out of ``wa_v2_views.py`` by name, the way ``test_page_images_ops.py``
pulls its own, and run against a real ``NotificationSnapshotStore``. The
camera capture is a stand-in.

``_mint_snapshot_url`` is pulled out of ``__init__.py`` the same way, to pin
that the token survives a Home Assistant with no reachable URL. Static
checks at the bottom: the op in the dispatch table, and the push carrying
the token beside the old URL.
"""

from __future__ import annotations
import __future__

import ast
import asyncio
import importlib.util
import sys
import types
from pathlib import Path
from typing import Any

import pytest

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_VIEWS = _PKG_DIR / "wa_v2_views.py"
_INIT = _PKG_DIR / "__init__.py"
_NAMES = (
    "_notification_snapshot_frame",
    "_notification_snapshot_live_frame",
    "_op_notification_snapshot",
)


def _load_store_module() -> Any:
    spec = importlib.util.spec_from_file_location(
        "wa_notification_snapshot_op_under_test", _PKG_DIR / "notification_snapshot.py"
    )
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


_store_mod = _load_store_module()


class _Response:
    def __init__(
        self,
        status: int = 200,
        body: Any = None,
        content_type: str = "text/plain",
        headers: dict[str, str] | None = None,
        text: str | None = None,
    ) -> None:
        self.status = status
        self.body = body if text is None else text
        self.content_type = content_type
        self.headers = headers or {}
        self.signed = False


class _Ctx:
    def __init__(self, hass: Any, domain_data: Any, payload: dict) -> None:
        self.hass = hass
        self.domain_data = domain_data
        self.watch_id = "watch-A"
        self.payload = payload

    def signed_bytes(
        self,
        data: bytes,
        *,
        status: int = 200,
        content_type: str = "application/octet-stream",
        extra_headers: dict[str, str] | None = None,
    ) -> _Response:
        reply = _Response(status, data, content_type, dict(extra_headers or {}))
        reply.signed = True
        return reply


class _Crops:
    def __init__(self) -> None:
        self.saved: dict[str, object] = {}

    def get(self, entity_id: str) -> object:
        return self.saved.get(entity_id)


def _extract(path: Path, names: tuple[str, ...], constants: tuple[str, ...] = ()) -> list[ast.stmt]:
    tree = ast.parse(path.read_text(), filename=str(path))
    wanted = [
        node
        for node in tree.body
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in names
    ]
    assert sorted(n.name for n in wanted) == sorted(names)
    wanted[:0] = [
        node
        for node in tree.body
        if isinstance(node, ast.Assign)
        and isinstance(node.targets[0], ast.Name)
        and node.targets[0].id in constants
    ]
    return wanted


def _exec(path: Path, body: list[ast.stmt], namespace: dict[str, Any]) -> dict[str, Any]:
    code = compile(
        ast.Module(body=body, type_ignores=[]),
        str(path),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    exec(code, namespace)  # noqa: S102
    return namespace


@pytest.fixture
def env():
    captures: list[tuple[str, object]] = []
    frames: list[bytes | None | Exception] = []

    async def capture(hass: Any, entity_id: str, *, viewport: object = None) -> bytes | None:
        captures.append((entity_id, viewport))
        result = frames.pop(0) if frames else b"FRESH"
        if isinstance(result, Exception):
            raise result
        return result

    namespace = _exec(
        _VIEWS,
        _extract(_VIEWS, _NAMES, ("SNAPSHOT_FETCH_WAIT_SECONDS",)),
        {"Response": _Response, "capture_notification_snapshot": capture},
    )
    domain = types.SimpleNamespace(
        notification_snapshot_store=_store_mod.NotificationSnapshotStore(),
        snapshot_crop_store=_Crops(),
    )
    return types.SimpleNamespace(
        ns=namespace,
        store=domain.notification_snapshot_store,
        crops=domain.snapshot_crop_store,
        domain=domain,
        hass=types.SimpleNamespace(),
        captures=captures,
        frames=frames,
    )


def op(env, payload: dict) -> _Response:
    return asyncio.run(env.ns["_op_notification_snapshot"](_Ctx(env.hass, env.domain, payload)))


# ── the frozen frame ─────────────────────────────────────────────────────


def test_answers_the_frame_captured_when_the_push_was_sent(env) -> None:
    token = env.store.put(b"FROZEN", entity_id="camera.door")
    reply = op(env, {"token": token})
    assert (reply.status, reply.body, reply.content_type, reply.signed) == (200, b"FROZEN", "image/jpeg", True)
    assert reply.headers == {"Cache-Control": "private, max-age=600"}
    assert env.captures == []


def test_waits_for_a_capture_still_running(env) -> None:
    token = env.store.reserve(entity_id="camera.door")

    async def run() -> _Response:
        asyncio.get_running_loop().call_later(0.02, env.store.fulfill, token, b"LANDED")
        return await env.ns["_op_notification_snapshot"](_Ctx(env.hass, env.domain, {"token": token}))

    reply = asyncio.run(run())
    assert (reply.status, reply.body) == (200, b"LANDED")


def test_a_capture_that_never_lands_is_not_found(env) -> None:
    env.ns["SNAPSHOT_FETCH_WAIT_SECONDS"] = 0.01
    token = env.store.reserve(entity_id="camera.door")
    reply = op(env, {"token": token})
    assert (reply.status, reply.signed) == (404, False)


def test_a_failed_capture_is_not_found(env) -> None:
    token = env.store.reserve(entity_id="camera.door")
    env.store.fail(token)
    assert op(env, {"token": token}).status == 404


@pytest.mark.parametrize("payload", [{}, {"token": ""}, {"token": 7}, {"token": None}])
def test_a_missing_token_is_refused(env, payload: dict) -> None:
    assert op(env, payload).status == 400


def test_an_unknown_token_is_not_found(env) -> None:
    env.store.put(b"FROZEN", entity_id="camera.door")
    assert op(env, {"token": "0" * 48}).status == 404


def test_an_expired_token_is_not_found(env) -> None:
    token = env.store.put(b"FROZEN", entity_id="camera.door", ttl_seconds=-1)
    assert op(env, {"token": token}).status == 404


# ── live ─────────────────────────────────────────────────────────────────


def test_live_captures_a_fresh_frame_with_the_saved_crop(env) -> None:
    env.crops.saved["camera.door"] = "CROP"
    token = env.store.put(b"FROZEN", entity_id="camera.door")
    reply = op(env, {"token": token, "live": True})
    assert (reply.status, reply.body, reply.content_type, reply.signed) == (200, b"FRESH", "image/jpeg", True)
    assert reply.headers == {"Cache-Control": "no-store"}
    assert env.captures == [("camera.door", "CROP")]


def test_live_only_for_true(env) -> None:
    token = env.store.put(b"FROZEN", entity_id="camera.door")
    assert op(env, {"token": token, "live": "yes"}).body == b"FROZEN"
    assert env.captures == []


def test_live_past_the_cap_gives_the_frozen_frame(env) -> None:
    token = env.store.put(b"FROZEN", entity_id="camera.door")
    limit = _store_mod.DEFAULT_LIVE_CAPTURE_LIMIT
    bodies = [op(env, {"token": token, "live": True}).body for _ in range(limit + 2)]
    assert bodies == [b"FRESH"] * limit + [b"FROZEN"] * 2
    assert len(env.captures) == limit


def test_live_with_no_source_camera_gives_the_frozen_frame(env) -> None:
    token = env.store.put(b"PREBUILT")
    reply = op(env, {"token": token, "live": True})
    assert (reply.status, reply.body) == (200, b"PREBUILT")
    assert env.captures == []


@pytest.mark.parametrize("result", [None, b"", RuntimeError("camera gone")])
def test_live_capture_that_fails_gives_the_frozen_frame(env, result: object) -> None:
    env.frames.append(result)
    token = env.store.put(b"FROZEN", entity_id="camera.door")
    reply = op(env, {"token": token, "live": True})
    assert (reply.status, reply.body) == (200, b"FROZEN")


def test_live_with_nothing_at_all_is_not_found(env) -> None:
    env.frames.append(None)
    token = env.store.reserve(entity_id="camera.door")
    assert op(env, {"token": token, "live": True}).status == 404


def test_live_for_an_unknown_token_captures_nothing(env) -> None:
    assert op(env, {"token": "0" * 48, "live": True}).status == 404
    assert env.captures == []


# ── the token in the push ────────────────────────────────────────────────


class _NoURL(Exception):
    pass


def _mint(env, url: str | None) -> Any:
    def get_url(hass: Any, *, prefer_external: bool) -> str:
        assert prefer_external is True
        if url is None:
            raise _NoURL
        return url

    namespace = _exec(
        _INIT,
        _extract(_INIT, ("_mint_snapshot_url",)),
        {
            "get_url": get_url,
            "NoURLAvailableError": _NoURL,
            "_LOGGER": types.SimpleNamespace(warning=lambda *a, **k: None),
        },
    )
    runtime = types.SimpleNamespace(
        notification_snapshot_store=env.store,
        snapshot_aspect_store=types.SimpleNamespace(get=lambda entity_id: 1.5),
    )
    return namespace["_mint_snapshot_url"](env.hass, runtime, "camera.door")


def test_mint_gives_the_link_and_the_token(env) -> None:
    url, token, aspect = _mint(env, "https://ha.example")
    assert url == f"https://ha.example/api/wrist_assistant/notification/snapshot/{token}"
    assert aspect == 1.5
    assert env.store.get(token) is not None


def test_mint_keeps_the_token_with_no_reachable_url(env) -> None:
    url, token, aspect = _mint(env, None)
    assert url is None and aspect == 1.5
    entry = env.store.get(token)
    assert entry is not None and entry.failed is False


def test_mint_gives_nothing_for_no_image_source(env) -> None:
    namespace = _exec(_INIT, _extract(_INIT, ("_mint_snapshot_url",)), {})
    assert namespace["_mint_snapshot_url"](env.hass, types.SimpleNamespace(), "") is None


def test_the_op_is_in_the_dispatch_table() -> None:
    tree = ast.parse(_VIEWS.read_text())
    table = next(
        node.value
        for node in tree.body
        if isinstance(node, ast.AnnAssign)
        and isinstance(node.target, ast.Name)
        and node.target.id == "_OP_HANDLERS"
    )
    entries = {k.value: v.id for k, v in zip(table.keys, table.values, strict=True)}
    assert entries["notification_snapshot"] == "_op_notification_snapshot"


def test_the_push_carries_the_token_beside_the_link() -> None:
    source = _INIT.read_text()
    assert 'extra_data["snapshot_token"] = snapshot_token' in source
    assert 'or extra_data.get("snapshot_token")' in source
