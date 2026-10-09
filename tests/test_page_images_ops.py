"""In-process tests for the page photo ops and WebSocket commands.

The two signed ops are pulled out of ``wa_v2_views.py`` by name, the way
``test_http_actions_ops.py`` pulls its own, and run against a real
``PageImagesStore`` over the stand-ins of ``test_page_images_store.py``. The
WebSocket commands are loaded from ``page_images_ws.py`` with stubbed Home
Assistant modules. The wire shapes the app and the panel are built against
are asserted as whole dicts.

Static checks at the bottom: the ops in the dispatch table, and setup
building the store, hooking the sweep and advertising the capability.
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
from test_page_images import UUID_UPPER, jpeg
from test_page_images_store import Env, loaded_package, pages

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_VIEWS = _PKG_DIR / "wa_v2_views.py"
_NAMES = ("_page_image_refusal", "_op_page_image_get", "_op_page_image_put")


class _Response:
    def __init__(self, status: int, body: Any, content_type: str = "application/json") -> None:
        self.status = status
        self.body = body
        self.content_type = content_type


class _Ctx:
    def __init__(self, domain_data: Any, payload: dict, body: bytes | None = None) -> None:
        self.domain_data = domain_data
        self.watch_id = "watch-A"
        self.payload = payload
        self.body = json.dumps(payload).encode() if body is None else body

    def signed_json(self, payload: dict, status: int = 200) -> _Response:
        return _Response(status, payload)

    def signed_bytes(self, data: bytes, *, status: int = 200, content_type: str = "application/octet-stream") -> _Response:
        return _Response(status, data, content_type)


def _ops(store_mod: Any) -> dict[str, Any]:
    tree = ast.parse(_VIEWS.read_text(), filename=str(_VIEWS))
    wanted = [
        node
        for node in tree.body
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in _NAMES
    ]
    assert sorted(n.name for n in wanted) == sorted(_NAMES)
    wanted[:0] = [
        node
        for node in tree.body
        if isinstance(node, ast.Assign)
        and isinstance(node.targets[0], ast.Name)
        and node.targets[0].id.startswith("_PAGE_IMAGE_")
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
        "PageImagesError": store_mod.PageImagesError,
        "PageImagesTooLargeError": store_mod.PageImagesTooLargeError,
        "PageImagesUnavailableError": store_mod.PageImagesUnavailableError,
        "decode_page_image": store_mod.decode_data,
    }
    exec(code, namespace)  # noqa: S102
    return namespace


def _marker(*args: object, **kwargs: object) -> object:
    return args[0] if args else None


@pytest.fixture
def env(tmp_path):
    with loaded_package() as loaded:
        sys.modules["homeassistant.components"] = types.ModuleType("homeassistant.components")
        sys.modules["homeassistant.components.websocket_api"] = types.SimpleNamespace(
            ActiveConnection=type("ActiveConnection", (), {}),
            async_register_command=lambda hass, func: None,
            require_admin=lambda func: func,
            websocket_command=lambda schema: (lambda func: func),
            async_response=lambda func: func,
        )
        sys.modules["voluptuous"] = types.SimpleNamespace(Required=_marker, Optional=_marker)
        base = Env(loaded, tmp_path)
        domain = types.SimpleNamespace(page_images_store=base.store)
        yield types.SimpleNamespace(
            base=base,
            store=base.store,
            ops=_ops(loaded.store_mod),
            ws=loaded.load("page_images_ws"),
            domain=domain,
            hass=types.SimpleNamespace(data={"wrist_assistant": domain}),
        )


def op(env, name: str, payload: dict, body: bytes | None = None) -> _Response:
    return asyncio.run(env.ops[name](_Ctx(env.domain, payload, body)))


def b64(data: bytes) -> str:
    return base64.b64encode(data).decode()


# ── page_image_get ───────────────────────────────────────────────────────


def test_get_answers_the_jpeg_bytes(env) -> None:
    data = jpeg(120, 80)
    asyncio.run(env.store.async_put(UUID_UPPER, data))
    reply = op(env, "_op_page_image_get", {"image_id": UUID_UPPER.lower()})
    assert (reply.status, reply.content_type, reply.body) == (200, "image/jpeg", data)


def test_get_answers_a_built_in_photo(env) -> None:
    reply = op(env, "_op_page_image_get", {"image_id": "preset_snow_twilight"})
    assert reply.status == 200 and reply.content_type == "image/jpeg"
    assert reply.body == (_PKG_DIR / "page_image_presets" / "preset_snow_twilight.jpg").read_bytes()


@pytest.mark.parametrize(
    ("payload", "status", "code"),
    [
        ({"image_id": UUID_UPPER}, 404, "not_found"),
        ({"image_id": "preset_stars"}, 400, "invalid"),
        ({}, 400, "invalid"),
    ],
)
def test_get_refusals(env, payload, status, code) -> None:
    reply = op(env, "_op_page_image_get", payload)
    assert reply.status == status
    assert reply.body["ok"] is False and reply.body["error"] == code
    assert set(reply.body) == {"ok", "error", "message"}


# ── page_image_put ───────────────────────────────────────────────────────


def test_put_stores_then_says_exists(env) -> None:
    data = jpeg(200, 300)
    reply = op(env, "_op_page_image_put", {"image_id": UUID_UPPER, "data": b64(data)})
    assert (reply.status, reply.body) == (200, {"ok": True, "status": "stored"})
    again = op(env, "_op_page_image_put", {"image_id": UUID_UPPER, "data": b64(jpeg(50, 50))})
    assert again.body == {"ok": True, "status": "exists"}
    assert op(env, "_op_page_image_get", {"image_id": UUID_UPPER}).body == data


def test_put_of_a_built_in_id_is_exists(env) -> None:
    reply = op(env, "_op_page_image_put", {"image_id": "preset_fern", "data": b64(jpeg())})
    assert reply.body == {"ok": True, "status": "exists"}
    assert env.base.files() == []


@pytest.mark.parametrize(
    ("payload", "status", "code"),
    [
        ({"image_id": "nope", "data": b64(jpeg())}, 400, "invalid"),
        ({"image_id": UUID_UPPER}, 400, "invalid"),
        ({"image_id": UUID_UPPER, "data": "%%%"}, 400, "invalid"),
        ({"image_id": UUID_UPPER, "data": b64(b"GIF89a" + bytes(32))}, 400, "invalid"),
        ({"image_id": UUID_UPPER, "data": b64(jpeg(4000, 10))}, 400, "invalid"),
        ({"image_id": UUID_UPPER, "data": b64(jpeg() + bytes(256 * 1024))}, 413, "too_large"),
    ],
)
def test_put_refusals(env, payload, status, code) -> None:
    reply = op(env, "_op_page_image_put", payload)
    assert reply.status == status
    assert reply.body["ok"] is False and reply.body["error"] == code
    assert env.base.files() == []


def test_a_put_body_over_the_cap_is_refused_before_it_is_read(env) -> None:
    reply = op(env, "_op_page_image_put", {}, body=b"x" * (360 * 1024 + 1))
    assert reply.status == 413 and reply.body["error"] == "too_large"


def test_a_put_at_the_photo_cap_fits_the_body_cap(env) -> None:
    data = jpeg()
    data = data[:-2] + bytes(256 * 1024 - len(data)) + b"\xff\xd9"
    reply = op(env, "_op_page_image_put", {"image_id": UUID_UPPER, "data": b64(data)})
    assert reply.body == {"ok": True, "status": "stored"}


def test_put_when_full_is_a_409(env, monkeypatch) -> None:
    monkeypatch.setattr(env.base.loaded.store_mod, "MAX_CUSTOM_IMAGES", 0)
    reply = op(env, "_op_page_image_put", {"image_id": UUID_UPPER, "data": b64(jpeg())})
    assert reply.status == 409 and reply.body["error"] == "full"


def test_both_ops_are_unavailable_with_no_store(env) -> None:
    env.domain.page_images_store = None
    for name, payload in (
        ("_op_page_image_get", {"image_id": "preset_fern"}),
        ("_op_page_image_put", {"image_id": UUID_UPPER, "data": b64(jpeg())}),
    ):
        reply = op(env, name, payload)
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


def test_ws_upload_list_get_delete(env) -> None:
    data = jpeg(160, 90)
    uploaded = ws_call(env, env.ws.ws_page_images_upload, data=b64(data)).results[1]
    image_id = uploaded["image_id"]
    assert uploaded == {"image_id": image_id, "width": 160, "height": 90, "bytes": len(data)}
    assert image_id == image_id.upper()

    listed = ws_call(env, env.ws.ws_page_images_list).results[1]
    assert set(listed) == {"presets", "images"}
    assert len(listed["presets"]) == 15
    assert all(set(p) == {"id", "name", "width", "height"} for p in listed["presets"])
    assert listed["images"] == [
        {
            "id": image_id,
            "width": 160,
            "height": 90,
            "bytes": len(data),
            "added_at": "2026-10-05T12:00:00Z",
            "used_by": [],
        }
    ]

    got = ws_call(env, env.ws.ws_page_images_get, image_id=image_id.lower()).results[1]
    assert got == {"image_id": image_id, "content_type": "image/jpeg", "data": b64(data)}

    deleted = ws_call(env, env.ws.ws_page_images_delete, image_id=image_id).results[1]
    assert deleted == {"image_id": image_id}
    assert ws_call(env, env.ws.ws_page_images_list).results[1]["images"] == []


def test_ws_get_of_a_built_in_photo(env) -> None:
    got = ws_call(env, env.ws.ws_page_images_get, image_id="preset_dark_rock").results[1]
    assert got["image_id"] == "preset_dark_rock"
    assert base64.b64decode(got["data"]) == (_PKG_DIR / "page_image_presets" / "preset_dark_rock.jpg").read_bytes()


def test_ws_upload_of_the_same_bytes_answers_the_same_id(env) -> None:
    first = ws_call(env, env.ws.ws_page_images_upload, data=b64(jpeg())).results[1]
    second = ws_call(env, env.ws.ws_page_images_upload, data=b64(jpeg())).results[1]
    assert first == second


def test_ws_refusals(env) -> None:
    image_id = ws_call(env, env.ws.ws_page_images_upload, data=b64(jpeg())).results[1]["image_id"]
    env.base.put_pages("watch-A", pages(image_id))
    cases = [
        (env.ws.ws_page_images_upload, {"data": "%%%"}, "invalid"),
        (env.ws.ws_page_images_upload, {"data": b64(b"\x89PNG\r\n\x1a\n")}, "invalid"),
        (env.ws.ws_page_images_upload, {"data": b64(jpeg() + bytes(256 * 1024))}, "too_large"),
        (env.ws.ws_page_images_get, {"image_id": "preset_stars"}, "invalid"),
        (env.ws.ws_page_images_get, {"image_id": UUID_UPPER}, "not_found"),
        (env.ws.ws_page_images_delete, {"image_id": image_id}, "in_use"),
        (env.ws.ws_page_images_delete, {"image_id": "preset_waves"}, "invalid"),
        (env.ws.ws_page_images_delete, {"image_id": UUID_UPPER}, "not_found"),
    ]
    for command, msg, code in cases:
        errors = ws_call(env, command, **msg).errors
        assert [e[1] for e in errors] == [code], (command.__name__, msg)
    listed = ws_call(env, env.ws.ws_page_images_list).results[1]
    assert listed["images"][0]["used_by"] == ["watch-A"]


def test_ws_upload_when_full(env, monkeypatch) -> None:
    monkeypatch.setattr(env.base.loaded.store_mod, "MAX_CUSTOM_IMAGES", 0)
    [(_, code, _m)] = ws_call(env, env.ws.ws_page_images_upload, data=b64(jpeg())).errors
    assert code == "full"


def test_ws_commands_are_unavailable_without_the_integration(env) -> None:
    env.hass.data = {}
    for command, msg in (
        (env.ws.ws_page_images_list, {}),
        (env.ws.ws_page_images_get, {"image_id": "preset_fern"}),
        (env.ws.ws_page_images_upload, {"data": b64(jpeg())}),
        (env.ws.ws_page_images_delete, {"image_id": UUID_UPPER}),
    ):
        [(_, code, _m)] = ws_call(env, command, **msg).errors
        assert code == "unavailable"


# ── static ───────────────────────────────────────────────────────────────


def test_the_two_ops_are_in_the_dispatch_table() -> None:
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
    assert table["page_image_get"] == "_op_page_image_get"
    assert table["page_image_put"] == "_op_page_image_put"


def test_setup_builds_the_store_hooks_the_sweep_and_advertises() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    for expected in (
        'pages=lambda: watch_config_store.documents("pages")',
        'history=lambda: watch_config_store.history_documents("pages")',
        "await page_images_store.async_load()",
        "await page_images_store.async_start()",
        "watch_config_store.async_add_listener(page_images_store.pages_changed)",
        "page_images_store=page_images_store,",
        "register_capability(PAGE_IMAGES_CAPABILITY)",
        "async_register_page_images_commands(hass)",
        # Listed among the stores unload writes out and stops.
        '"page_images_store",',
    ):
        assert expected in init, expected
    # Removing the integration keeps the photos, as it keeps every file.
    assert "await PageImagesStore(hass).async_remove()" not in init
    assert 'PAGE_IMAGES_CAPABILITY = "page_images"' in const
    assert 'PAGE_IMAGES_STORAGE_KEY = "wrist_assistant.page_images"' in const
