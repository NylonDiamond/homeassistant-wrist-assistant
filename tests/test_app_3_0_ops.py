"""The ops kept for app 3.0.x, with no Home Assistant.

App 3.0.1's iPhone still calls the camera framing and batch snapshot ops
that 4ae815d6 removed, and ``webhook_provision`` that cb37c003 removed, and
the integration ships weeks before the app that stops. The handlers are
pulled out of ``wa_v2_views.py`` by name, the way ``test_home_map_ops.py``
pulls its own, and run over the real crop, stream, aspect and batch snapshot
stores and the real ``camera_devices`` grouping of the ``env`` fixture in
``test_camera_framing_ws.py``. Replies go through a stand-in ``signed_json``
and are asserted as whole dicts, in the shapes the 3.0.1 Swift client reads
(``HomeAssistantAPI.swift`` and ``WristWebhooksService.swift`` at 4838f7ec).

The static check at the bottom: every kept op is in the dispatch table.
"""

from __future__ import annotations
import __future__

import ast
import asyncio
import json
import math
import sys
import types
from pathlib import Path
from typing import Any

import pytest
from test_camera_framing_ws import HD, SD, SNAP, _front_door, _Viewport, env  # noqa: F401
from test_widget_secret_user_binding import _PKG, _load, _stub

_VIEWS = (
    Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant" / "wa_v2_views.py"
)
_OPS = {
    "set_snapshot_crop": "_op_set_snapshot_crop",
    "get_snapshot_crop": "_op_get_snapshot_crop",
    "snapshot_crops_status": "_op_snapshot_crops_status",
    "get_snapshot_concurrency": "_op_get_snapshot_concurrency",
    "set_snapshot_concurrency": "_op_set_snapshot_concurrency",
    "set_stream_entity": "_op_set_stream_entity",
    "get_stream_entity": "_op_get_stream_entity",
    "webhook_provision": "_op_webhook_provision",
}
_HELPERS = (
    "_legacy_camera_ids",
    "_legacy_camera_ids_refusal",
    "_parse_stream_viewport",
    "_bound_float",
)


class _Response:
    def __init__(self, status: int = 200, body: Any = None, text: str | None = None) -> None:
        self.status = status
        self.body = body
        self.text = text


class _Ctx:
    def __init__(self, hass: Any, data: Any, payload: dict) -> None:
        self.hass = hass
        self.domain_data = data
        self.watch_id = "iphone:test"
        self.payload = payload

    def signed_json(self, body: dict, *, status: int = 200) -> _Response:
        # Through JSON, as the wire carries it.
        return _Response(status, json.loads(json.dumps(body)))


def _handlers(namespace: dict[str, Any]) -> dict[str, Any]:
    tree = ast.parse(_VIEWS.read_text(), filename=str(_VIEWS))
    names = set(_OPS.values()) | set(_HELPERS)
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
        and node.targets[0].id == "_LEGACY_FRAMING_MAX_IDS"
    ]
    code = compile(
        ast.Module(body=wanted, type_ignores=[]),
        str(_VIEWS),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    exec(code, namespace)  # noqa: S102
    return namespace


@pytest.fixture
def ops(env):  # noqa: F811
    # The batch snapshot store, over the env's stubbed storage.
    _stub(
        f"{_PKG}.camera_stream",
        DEFAULT_BATCH_SNAPSHOT_CONCURRENCY=0,
        MAX_BATCH_SNAPSHOT_CONCURRENCY=64,
    )
    _stub(
        f"{_PKG}.const",
        BATCH_SNAPSHOT_SETTINGS_STORAGE_KEY="wrist_assistant.batch_snapshot_settings",
        BATCH_SNAPSHOT_SETTINGS_STORAGE_VERSION=1,
    )
    batch_mod = _load("batch_snapshot_settings_store")
    env.data.batch_snapshot_settings_store = batch_mod.BatchSnapshotSettingsStore(env.hass)
    camera_devices = sys.modules[f"{_PKG}.camera_devices"]
    namespace = _handlers(
        {
            "Any": Any,
            "math": math,
            "Response": _Response,
            "ViewportState": _Viewport,
            "resolve_stream_sibling": camera_devices.resolve_stream_sibling,
            "clamp_concurrency": batch_mod.clamp_concurrency,
        }
    )

    def run(op: str, payload: dict | None = None) -> _Response:
        handler = namespace[_OPS[op]]
        return asyncio.run(handler(_Ctx(env.hass, env.data, payload or {})))

    return types.SimpleNamespace(run=run, env=env, data=env.data, batch_mod=batch_mod)


# ── crops ────────────────────────────────────────────────────────────────


def test_a_crop_saved_as_3_0_sends_it_reads_back_in_the_shape_it_reads(ops) -> None:
    ops.data.snapshot_aspect_store.set(HD, 1.5)
    # 3.0.1 sends the variants of one camera and width/height keys.
    reply = ops.run(
        "set_snapshot_crop",
        {"entity_ids": [HD, SD, HD], "viewport": {"x": 0.1, "y": 0.2, "width": 0.5, "height": 0.4}},
    )
    assert (reply.status, reply.body) == (200, {"ok": True, "count": 2})
    for entity_id in (HD, SD):
        got = ops.run("get_snapshot_crop", {"entity_id": entity_id})
        assert got.body == {
            "viewport": {"x": 0.1, "y": 0.2, "w": 0.5, "h": 0.4},
            "open_zoomed": False,
        }
    # Re-framing drops the cached aspect, so the next alert measures it again.
    assert ops.data.snapshot_aspect_store.get(HD) is None


def test_a_full_frame_clears_the_crop_and_reads_back_null(ops) -> None:
    ops.run("set_snapshot_crop", {"entity_id": HD, "viewport": {"x": 0.2, "y": 0.2, "w": 0.5, "h": 0.5}})
    ops.run("set_snapshot_crop", {"entity_ids": [HD], "viewport": {"x": 0, "y": 0, "width": 1, "height": 1}})
    assert ops.run("get_snapshot_crop", {"entity_id": HD}).body == {
        "viewport": None,
        "open_zoomed": False,
    }


def test_open_zoomed_is_kept_when_not_sent(ops) -> None:
    ops.run("set_snapshot_crop", {"entity_ids": [HD], "viewport": {"x": 0.1, "y": 0.1, "w": 0.5, "h": 0.5}, "open_zoomed": True})
    # 3.0.1 never sends open_zoomed; a save from it leaves the panel's choice.
    ops.run("set_snapshot_crop", {"entity_ids": [HD], "viewport": {"x": 0.2, "y": 0.1, "w": 0.5, "h": 0.5}})
    assert ops.run("get_snapshot_crop", {"entity_id": HD}).body["open_zoomed"] is True


def test_a_crop_saved_in_the_panel_is_the_one_3_0_reads(ops) -> None:
    ops.data.snapshot_crop_store.set(HD, _Viewport(x=0.3, y=0.1, w=0.4, h=0.6))
    assert ops.run("get_snapshot_crop", {"entity_id": HD}).body == {
        "viewport": {"x": 0.3, "y": 0.1, "w": 0.4, "h": 0.6},
        "open_zoomed": False,
    }


@pytest.mark.parametrize(
    "payload",
    [{}, {"entity_ids": []}, {"entity_ids": ["light.lamp", 3]}, {"entity_id": "sensor.x"}],
)
def test_a_crop_write_with_no_camera_is_a_400(ops, payload) -> None:
    reply = ops.run("set_snapshot_crop", {**payload, "viewport": {"x": 0.1}})
    assert reply.status == 400
    assert reply.body is None


def test_a_crop_write_naming_too_many_cameras_is_a_400_and_saves_nothing(ops) -> None:
    ids = [f"camera.c{i}" for i in range(65)]
    reply = ops.run("set_snapshot_crop", {"entity_ids": ids, "viewport": {"x": 0.1, "y": 0.1, "w": 0.5, "h": 0.5}})
    assert reply.status == 400
    assert all(ops.data.snapshot_crop_store.get(e) is None for e in ids)


def test_a_bad_viewport_is_clamped_not_a_500(ops) -> None:
    reply = ops.run("set_snapshot_crop", {"entity_ids": [HD], "viewport": {"x": "nan", "y": -4, "w": 1e400, "h": "x"}})
    assert reply.body == {"ok": True, "count": 1}
    # NaN, a negative and an unreadable value take the full frame's edges.
    assert ops.run("get_snapshot_crop", {"entity_id": HD}).body["viewport"] is None


def test_get_snapshot_crop_needs_a_camera(ops) -> None:
    assert ops.run("get_snapshot_crop", {"entity_id": "light.lamp"}).status == 400
    assert ops.run("get_snapshot_crop", {}).status == 400


def test_crops_status_lists_the_framed_ones_in_the_order_asked(ops) -> None:
    ops.data.snapshot_crop_store.set(SD, _Viewport(x=0.1, y=0.1, w=0.5, h=0.5))
    ops.data.snapshot_crop_store.set(SNAP, _Viewport(x=0.1, y=0.1, w=0.5, h=0.5))
    reply = ops.run("snapshot_crops_status", {"entity_ids": [SNAP, HD, SD, 7]})
    assert (reply.status, reply.body) == (200, {"framed": [SNAP, SD]})
    assert ops.run("snapshot_crops_status", {}).body == {"framed": []}


# ── live stream override ─────────────────────────────────────────────────


def test_a_stream_override_reads_back_beside_the_auto_pick(ops) -> None:
    _front_door(ops.env)
    assert ops.run("get_stream_entity", {"entity_id": HD}).body == {"override": None, "auto": SD}
    reply = ops.run("set_stream_entity", {"entity_ids": [HD, SD, SNAP], "stream_entity": HD})
    assert reply.body == {"ok": True, "count": 3}
    assert ops.run("get_stream_entity", {"entity_id": SNAP}).body == {"override": HD, "auto": SD}


def test_leaving_out_the_stream_entity_goes_back_to_auto(ops) -> None:
    _front_door(ops.env)
    ops.run("set_stream_entity", {"entity_ids": [HD], "stream_entity": HD})
    # 3.0.1 leaves the key out when the pick is the auto one.
    assert ops.run("set_stream_entity", {"entity_ids": [HD]}).body == {"ok": True, "count": 1}
    assert ops.data.snapshot_stream_store.get(HD) is None


def test_stream_ops_need_a_camera(ops) -> None:
    assert ops.run("set_stream_entity", {"entity_ids": ["light.lamp"], "stream_entity": HD}).status == 400
    assert ops.run("get_stream_entity", {"entity_id": "light.lamp"}).status == 400


# ── batch snapshot concurrency ───────────────────────────────────────────


def test_concurrency_reads_the_default_as_unlimited(ops) -> None:
    reply = ops.run("get_snapshot_concurrency")
    assert (reply.status, reply.body) == (200, {"concurrency": 0})


def test_a_set_concurrency_applies_at_once_and_is_saved(ops) -> None:
    reply = ops.run("set_snapshot_concurrency", {"concurrency": 3})
    assert (reply.status, reply.body) == (200, {"ok": True, "concurrency": 3})
    store = ops.data.batch_snapshot_settings_store
    assert store.concurrency == 3
    assert ops.run("get_snapshot_concurrency").body == {"concurrency": 3}
    # Written at once, in the shape the store loads.
    assert store._store.saved_now == [{"concurrency": 3}]
    reloaded = ops.batch_mod.BatchSnapshotSettingsStore(ops.env.hass)
    reloaded._store = store._store
    asyncio.run(reloaded.async_load())
    assert reloaded.concurrency == 3


@pytest.mark.parametrize(("sent", "stored"), [(500, 64), (-2, 0), ("x", 0), (None, 0)])
def test_a_set_concurrency_answers_the_clamped_value(ops, sent, stored) -> None:
    assert ops.run("set_snapshot_concurrency", {"concurrency": sent}).body == {
        "ok": True,
        "concurrency": stored,
    }
    assert ops.data.batch_snapshot_settings_store.concurrency == stored


# ── Wrist Webhooks ───────────────────────────────────────────────────────


def test_webhook_provision_is_a_signed_refusal_saying_they_were_retired(ops) -> None:
    reply = ops.run("webhook_provision", {"companion_watch_id": "watch-A"})
    # Signed JSON, not the plain "Unknown op" 400 that 3.0.1 reads as an
    # outdated integration: it shows "Webhook setup failed: <error>".
    assert (reply.status, reply.body) == (
        410,
        {"ok": False, "error": "Wrist Webhooks were retired"},
    )


# ── static ───────────────────────────────────────────────────────────────


def test_every_kept_op_is_in_the_dispatch_table() -> None:
    tree = ast.parse(_VIEWS.read_text(), filename=str(_VIEWS))
    [table] = [
        node
        for node in tree.body
        if isinstance(node, ast.AnnAssign)
        and isinstance(node.target, ast.Name)
        and node.target.id == "_OP_HANDLERS"
    ]
    entries = {
        key.value: value.id
        for key, value in zip(table.value.keys, table.value.values, strict=True)
        if isinstance(key, ast.Constant) and isinstance(value, ast.Name)
    }
    for op, handler in _OPS.items():
        assert entries.get(op) == handler, op
