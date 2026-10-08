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
* ``complications_restore`` restores what it can and lists the documents
  left out over a seat clash under ``skipped``.
* The version view answers 503 while the config entry is reloading.
* ``register_secret`` refuses the Library's owner id.
* A signed request whose bound user is local only is refused the way Home
  Assistant refuses that user's own token from outside the home, and both
  signed views hand the request to that check.
* A remote hold that is preempted by a second ``hold_start`` leaves the new
  hold in place, so ``hold_stop`` still stops it.
* ``snapshot`` clamps a NaN, infinite or huge viewport instead of answering
  500, and ``camera_batch`` skips a ``cameras`` entry that is not an object
  instead of failing the whole batch.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import base64
import contextlib
import importlib.util
import io
import logging
import math
import sys
import types
import uuid
from pathlib import Path
from typing import Any

import pytest

from test_complication_store import MAX_PER_OWNER, MAX_SCHEMA, _doc, _loaded_module
from test_pair_requests import loaded_pair_module

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
    "_op_complications_restore",
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
    with loaded_pair_module() as pair_mod:
        validate_pair_fields = pair_mod.validate_pair_fields
    namespace: dict[str, Any] = {
        "Any": Any,
        "uuid": uuid,
        "_LOGGER": logging.getLogger("wa_v2_views_test"),
        "validate_pair_fields": validate_pair_fields,
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


# ── restore ──────────────────────────────────────────────────────────────


def test_restore_reports_a_document_left_out_over_a_seat_clash(env) -> None:
    """The reply stays ``ok`` and lists the left-out document under ``skipped``,
    which says the design was kept in the Library.

    Older watch builds read only ``ok`` from this reply, so the extra field
    costs them nothing.
    """
    first = _doc(schemaVersion=6, slotIndex=3, name="Garage", supportedFamilies=["circular"])
    second = _doc(schemaVersion=6, slotIndex=3, name="Lights", supportedFamilies=["circular"])

    reply = _run(env, "_op_complications_restore", {"documents": [first, second]})
    assert reply.status == 200
    assert reply.body["ok"] is True
    assert [r["id"] for r in reply.body["records"]] == [first["id"]]
    [left_out] = reply.body["skipped"]
    assert (left_out["id"], left_out["library"]) == (second["id"], "kept")
    assert "slot 3" in left_out["message"]
    assert left_out["message"].endswith("kept in the Library instead")
    assert [r.id for r in env.store.list("library")] == [second["id"]]


def test_a_clean_restore_reports_an_empty_skipped_list(env) -> None:
    reply = _run(env, "_op_complications_restore", {"documents": [_doc()]})
    assert reply.status == 200
    assert reply.body["skipped"] == []


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


# ── loading single definitions ───────────────────────────────────────────


def _extract(names: set[str], namespace: dict[str, Any]) -> dict[str, Any]:
    """Functions, classes and plain assignments out of ``wa_v2_views.py`` by
    name, run in ``namespace``."""
    tree = ast.parse(_MODULE.read_text(), filename=str(_MODULE))
    wanted = [
        node
        for node in tree.body
        if (
            isinstance(node, (ast.ClassDef, ast.FunctionDef, ast.AsyncFunctionDef))
            and node.name in names
        )
        or (
            isinstance(node, ast.Assign)
            and isinstance(node.targets[0], ast.Name)
            and node.targets[0].id in names
        )
    ]
    found = {
        node.targets[0].id if isinstance(node, ast.Assign) else node.name for node in wanted
    }
    assert found == names, names ^ found
    code = compile(
        ast.Module(body=wanted, type_ignores=[]),
        str(_MODULE),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    exec(code, namespace)  # noqa: S102
    return namespace


# ── a local-only bound user ──────────────────────────────────────────────


class _HAUser:
    def __init__(self, *, is_active: bool = True, local_only: bool = False) -> None:
        self.is_active = is_active
        self.local_only = local_only


class _AuthCheck:
    """Stands in for Home Assistant's ``async_user_not_allowed_do_auth``,
    with its rules (inactive, then local only from a non-local address or
    through the cloud), and notes every call it gets."""

    def __init__(self) -> None:
        self.calls: list[tuple[Any, Any, Any]] = []
        self.cloud = False

    def __call__(self, hass: Any, user: Any, request: Any = None) -> str | None:
        self.calls.append((hass, user, request))
        if not user.is_active:
            return "User is not active"
        if not user.local_only:
            return None
        if self.cloud:
            return "User is local only"
        if request.remote.startswith(("192.168.", "127.")):
            return None
        return "User cannot authenticate remotely"


@pytest.fixture
def bound_user():
    users: dict[str, _HAUser] = {}

    async def async_get_user(user_id: str) -> _HAUser | None:
        return users.get(user_id)

    check = _AuthCheck()
    namespace = _extract(
        {"_async_bound_user_ok"},
        {
            "HomeAssistant": object,
            "Request": object,
            "async_user_not_allowed_do_auth": check,
        },
    )
    hass = types.SimpleNamespace(auth=types.SimpleNamespace(async_get_user=async_get_user))
    yield types.SimpleNamespace(
        ok=namespace["_async_bound_user_ok"], users=users, check=check, hass=hass
    )


def _bound_ok(env, user_id: str | None, remote: str = "203.0.113.9") -> bool:
    request = types.SimpleNamespace(remote=remote)
    return asyncio.run(env.ok(env.hass, user_id, request))


def test_a_local_only_bound_user_is_refused_from_outside_the_home(bound_user) -> None:
    bound_user.users["kid"] = _HAUser(local_only=True)
    assert _bound_ok(bound_user, "kid", remote="203.0.113.9") is False
    assert _bound_ok(bound_user, "kid", remote="192.168.1.40") is True
    # Through the cloud the address can look local; it is refused all the same.
    bound_user.check.cloud = True
    assert _bound_ok(bound_user, "kid", remote="127.0.0.1") is False


def test_the_request_reaches_home_assistant_s_check(bound_user) -> None:
    bound_user.users["alice"] = _HAUser()
    request = types.SimpleNamespace(remote="203.0.113.9")
    assert asyncio.run(bound_user.ok(bound_user.hass, "alice", request)) is True
    assert bound_user.check.calls == [(bound_user.hass, bound_user.users["alice"], request)]


def test_a_disabled_or_missing_user_is_refused_and_an_unbound_entry_passes(bound_user) -> None:
    bound_user.users["gone-quiet"] = _HAUser(is_active=False)
    assert _bound_ok(bound_user, "gone-quiet", remote="192.168.1.40") is False
    assert _bound_ok(bound_user, "deleted") is False
    assert _bound_ok(bound_user, None) is True


@pytest.mark.parametrize("view", ["WAActionView", "WADeltaView"])
def test_both_signed_views_pass_the_request_to_the_user_check(view) -> None:
    tree = ast.parse(_MODULE.read_text(), filename=str(_MODULE))
    cls = next(n for n in tree.body if isinstance(n, ast.ClassDef) and n.name == view)
    calls = [
        node
        for node in ast.walk(cls)
        if isinstance(node, ast.Call)
        and isinstance(node.func, ast.Name)
        and node.func.id == "_async_bound_user_ok"
    ]
    assert len(calls) == 1
    args = calls[0].args
    assert len(args) == 3 and isinstance(args[2], ast.Name) and args[2].id == "request"


def test_the_user_check_is_home_assistant_s_own() -> None:
    source = _MODULE.read_text()
    assert (
        "from homeassistant.components.http.auth_util import async_user_not_allowed_do_auth"
        in source
    )
    assert "from homeassistant.components.http.auth import async_user_not_allowed_do_auth" in source


# ── remote command holds ─────────────────────────────────────────────────


ENTITY = "remote.living_room"


class _HoldCtx:
    def __init__(self, hass: Any, payload: dict) -> None:
        self.hass = hass
        self.payload = payload

    def new_context(self) -> object:
        return object()

    def signed_json(self, payload: dict, status: int = 200) -> _Response:
        return _Response(status=status, body=payload)


def _hold_env(timeout: float = 10.0) -> tuple[Any, list, Any]:
    namespace = _extract(
        {
            "_op_remote_command",
            "_remote_command_holds",
            "_remote_command_hold_loop",
            "_REMOTE_HOLDS_KEY",
            "_REMOTE_HOLD_TIMEOUT_SECONDS",
        },
        {
            "asyncio": asyncio,
            "Any": Any,
            "Response": _Response,
            "DOMAIN": DOMAIN,
            "HomeAssistant": object,
            "Context": object,
            "_OpContext": object,
        },
    )
    namespace["_REMOTE_HOLD_TIMEOUT_SECONDS"] = timeout
    sent: list[str] = []

    async def async_call(domain: str, service: str, data: dict, context: Any = None) -> None:
        sent.append(data["command"])

    hass = types.SimpleNamespace(
        data={},
        services=types.SimpleNamespace(async_call=async_call),
        async_create_task=lambda coro: asyncio.get_running_loop().create_task(coro),
    )
    return namespace, sent, hass


async def _settle() -> None:
    for _ in range(5):
        await asyncio.sleep(0)


def test_a_preempted_hold_leaves_the_new_hold_for_hold_stop_to_stop() -> None:
    namespace, sent, hass = _hold_env()
    op = namespace["_op_remote_command"]

    async def scenario() -> None:
        start = {"entity_id": ENTITY, "action": "hold_start", "hold_secs": 0.05}
        assert (await op(_HoldCtx(hass, {**start, "command": "up"}))).status == 200
        await _settle()
        holds = namespace["_remote_command_holds"](hass)
        first = holds[ENTITY]

        await op(_HoldCtx(hass, {**start, "command": "down"}))
        second = holds[ENTITY]
        assert second is not first
        await _settle()
        # The first hold has ended, and its clean-up left the second in place.
        assert first.done()
        assert holds.get(ENTITY) is second

        await op(_HoldCtx(hass, {"entity_id": ENTITY, "action": "hold_stop"}))
        assert ENTITY not in holds
        await _settle()
        assert second.done()
        count = len(sent)
        await asyncio.sleep(0.15)
        assert len(sent) == count, "the second hold kept repeating after hold_stop"
        assert set(sent) == {"up", "down"}

    asyncio.run(scenario())


def test_a_hold_that_runs_out_removes_its_own_entry() -> None:
    namespace, sent, hass = _hold_env(timeout=0.1)
    op = namespace["_op_remote_command"]

    async def scenario() -> None:
        await op(
            _HoldCtx(
                hass,
                {"entity_id": ENTITY, "action": "hold_start", "command": "up", "hold_secs": 0.05},
            )
        )
        holds = namespace["_remote_command_holds"](hass)
        task = holds[ENTITY]
        await asyncio.wait_for(task, timeout=2)
        assert ENTITY not in holds
        assert sent == ["up", "up"]

    asyncio.run(scenario())


# ── camera stream tokens ─────────────────────────────────────────────────


def _load_stream_tokens() -> Any:
    path = _MODULE.with_name("wa_stream_tokens.py")
    spec = importlib.util.spec_from_file_location("wa_stream_tokens_views_test", path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    try:
        spec.loader.exec_module(module)
    finally:
        sys.modules.pop(spec.name, None)
    return module


class _SecretStore:
    def __init__(self) -> None:
        self.entries: dict[str, types.SimpleNamespace] = {}

    def get(self, watch_id: str) -> types.SimpleNamespace | None:
        return self.entries.get(watch_id)


class _CameraCoordinator:
    def __init__(self) -> None:
        self.opened: list[tuple[str, str]] = []

    def open_session(self, watch_id: str, entity_id: str, *_args: Any) -> Any:
        self.opened.append((watch_id, entity_id))
        return types.SimpleNamespace(watch_id=watch_id, entity_id=entity_id)


@pytest.fixture
def stream_views():
    tokens = _load_stream_tokens()
    users: dict[str, _HAUser] = {"alice": _HAUser()}

    async def async_get_user(user_id: str) -> _HAUser | None:
        return users.get(user_id)

    streams: list[dict[str, Any]] = []
    batches: list[Any] = []

    async def run_mjpeg_stream(hass, request, coordinator, watch_id, entity_id, **kwargs):
        streams.append({"watch_id": watch_id, "entity_id": entity_id, **kwargs})
        return _Response(status=200)

    async def run_batch_snapshot_stream(hass, request, cameras, quality, concurrency=0):
        batches.append(cameras)
        return _Response(status=200)

    namespace = _extract(
        {"WAStreamView", "WABatchSnapshotView", "_async_device_may_stream", "_async_bound_user_ok"},
        {
            "Any": Any,
            "DOMAIN": DOMAIN,
            "HomeAssistant": object,
            "HomeAssistantView": _View,
            "Request": object,
            "Response": _Response,
            "StreamResponse": _Response,
            "WristAssistantData": object,
            "_LOGGER": logging.getLogger("wa_stream_views_test"),
            "async_user_not_allowed_do_auth": _AuthCheck(),
            "run_mjpeg_stream": run_mjpeg_stream,
            "run_batch_snapshot_stream": run_batch_snapshot_stream,
        },
    )
    secrets = _SecretStore()
    secrets.entries["watch-A"] = types.SimpleNamespace(secret_bytes=b"k" * 32, user_id="alice")
    domain_data = types.SimpleNamespace(
        widget_secret_store=secrets,
        stream_token_store=tokens.StreamTokenStore(),
        batch_snapshot_token_store=tokens.BatchSnapshotTokenStore(),
        camera_stream_coordinator=_CameraCoordinator(),
        batch_snapshot_settings_store=types.SimpleNamespace(concurrency=0),
    )
    hass = types.SimpleNamespace(
        data={DOMAIN: domain_data},
        auth=types.SimpleNamespace(async_get_user=async_get_user),
        states=types.SimpleNamespace(get=lambda entity_id: object()),
    )

    def mint_stream() -> str:
        token, _ = domain_data.stream_token_store.mint(
            watch_id="watch-A", entity_id="camera.front", width=400, quality=75,
            fps=2.0, viewport=object(), ttl_seconds=30,
        )
        return token

    def mint_batch() -> str:
        token, _ = domain_data.batch_snapshot_token_store.mint(
            watch_id="watch-A", cameras=[("camera.front", 200, 200)], quality=75,
            ttl_seconds=30,
        )
        return token

    yield types.SimpleNamespace(
        stream=namespace["WAStreamView"](hass),
        batch=namespace["WABatchSnapshotView"](hass),
        hass=hass,
        domain_data=domain_data,
        secrets=secrets,
        users=users,
        streams=streams,
        batches=batches,
        mint_stream=mint_stream,
        mint_batch=mint_batch,
    )


_HOME_REQUEST = types.SimpleNamespace(remote="192.168.1.40")


def test_a_stream_token_opens_a_stream_and_hands_it_the_permission_check(stream_views) -> None:
    reply = asyncio.run(stream_views.stream.get(_HOME_REQUEST, stream_views.mint_stream()))
    assert reply.status == 200
    assert stream_views.domain_data.camera_stream_coordinator.opened == [
        ("watch-A", "camera.front")
    ]
    [stream] = stream_views.streams
    assert stream["session"].entity_id == "camera.front"

    # The running stream asks again later; a disabled user is then refused.
    assert asyncio.run(stream["authorize"]()) is True
    stream_views.users["alice"].is_active = False
    assert asyncio.run(stream["authorize"]()) is False


@pytest.mark.parametrize("change", ["device removed", "user disabled", "user deleted"])
def test_a_stream_token_is_refused_once_its_device_may_not_stream(stream_views, change) -> None:
    """The token was minted by a signed request, but the device was removed or
    its user disabled before it was used. It opens nothing."""
    stream_token = stream_views.mint_stream()
    batch_token = stream_views.mint_batch()
    if change == "device removed":
        stream_views.secrets.entries.clear()
    elif change == "user disabled":
        stream_views.users["alice"].is_active = False
    else:
        stream_views.users.clear()

    assert asyncio.run(stream_views.stream.get(_HOME_REQUEST, stream_token)).status == 404
    assert asyncio.run(stream_views.batch.get(_HOME_REQUEST, batch_token)).status == 404
    assert stream_views.streams == []
    assert stream_views.batches == []
    assert stream_views.domain_data.camera_stream_coordinator.opened == []


def test_a_batch_snapshot_token_still_works_for_a_device_that_may_stream(stream_views) -> None:
    reply = asyncio.run(stream_views.batch.get(_HOME_REQUEST, stream_views.mint_batch()))
    assert reply.status == 200
    assert stream_views.batches == [[("camera.front", 200, 200)]]


def test_a_stream_is_refused_while_the_integration_reloads(stream_views) -> None:
    """The running stream's check finds no integration loaded and says no."""
    asyncio.run(stream_views.stream.get(_HOME_REQUEST, stream_views.mint_stream()))
    [stream] = stream_views.streams
    stream_views.hass.data.clear()
    assert asyncio.run(stream["authorize"]()) is False


# ── camera snapshots: malformed viewports and camera entries ─────────────


@contextlib.contextmanager
def _loaded_camera_stream():
    """The real ``camera_stream`` over stubbed Home Assistant modules, so the
    ops below crop with the real ``_process_snapshot`` and ``_process_frame``.
    aiohttp is the real one; only Home Assistant, which is not installed, is
    stubbed, and ``sys.modules`` is put back afterwards."""
    saved = dict(sys.modules)
    try:
        for name, attrs in (
            ("homeassistant", {}),
            ("homeassistant.components", {}),
            (
                "homeassistant.components.camera",
                {"Image": type("Image", (), {}), "async_get_image": None},
            ),
            ("homeassistant.core", {"HomeAssistant": type("HomeAssistant", (), {})}),
            (
                "homeassistant.exceptions",
                {"HomeAssistantError": type("HomeAssistantError", (Exception,), {})},
            ),
        ):
            module = types.ModuleType(name)
            for key, value in attrs.items():
                setattr(module, key, value)
            sys.modules[name] = module
        name = "wa_camera_stream_views_test"
        spec = importlib.util.spec_from_file_location(name, _MODULE.with_name("camera_stream.py"))
        module = importlib.util.module_from_spec(spec)
        sys.modules[name] = module
        spec.loader.exec_module(module)
        yield module
    finally:
        for key in list(sys.modules):
            if key not in saved:
                del sys.modules[key]
        sys.modules.update(saved)


def _jpeg(width: int = 320, height: int = 240) -> bytes:
    from PIL import Image

    buf = io.BytesIO()
    Image.new("RGB", (width, height), (10, 120, 200)).save(buf, "JPEG", quality=90)
    return buf.getvalue()


class _CameraCtx:
    def __init__(self, hass: Any, payload: dict) -> None:
        self.hass = hass
        self.payload = payload
        self.domain_data = types.SimpleNamespace(
            snapshot_crop_store=types.SimpleNamespace(matches_saved=lambda *_: False),
            snapshot_aspect_store=types.SimpleNamespace(set=lambda *_: None),
        )

    def signed_json(self, payload: dict, status: int = 200) -> _Response:
        return _Response(status=status, body=payload)

    def signed_bytes(self, body: bytes, **_: Any) -> _Response:
        return _Response(status=200, body=body)


@pytest.fixture
def camera_ops():
    """``_op_snapshot`` and ``_op_camera_batch`` with a camera that always
    answers with a small JPEG and an executor that runs the job in place."""
    with _loaded_camera_stream() as cs:
        names = {
            "DEFAULT_QUALITY", "DEFAULT_WIDTH", "MAX_BATCH_CAMERAS", "MAX_QUALITY",
            "MAX_WIDTH", "MIN_QUALITY", "MIN_WIDTH", "NOTIF_SNAPSHOT_MAX_BYTES",
            "NOTIF_SNAPSHOT_MAX_HEIGHT", "NOTIF_SNAPSHOT_MAX_WIDTH",
            "SNAPSHOT_CAMERA_TIMEOUT", "SNAPSHOT_DEFAULT_QUALITY", "SNAPSHOT_MAX_BYTES",
            "SNAPSHOT_MAX_HEIGHT", "SNAPSHOT_MAX_WIDTH", "SNAPSHOT_SLOW_CAMERA_TIMEOUT",
            "ViewportState", "_process_frame", "_process_snapshot", "jpeg_aspect",
        }
        image = types.SimpleNamespace(content=_jpeg())
        fetched: list[str] = []

        async def async_get_image(_hass: Any, entity_id: str, timeout: float = 0) -> Any:
            fetched.append(entity_id)
            return image

        processed: list[Any] = []

        async def async_add_executor_job(func: Any, *args: Any) -> Any:
            if func is cs._process_snapshot or func is cs._process_frame:
                processed.append(args[1])
            return func(*args)

        namespace = _extract(
            {"_op_snapshot", "_op_camera_batch", "_parse_stream_viewport", "_bound_int", "_bound_float"},
            {
                **{name: getattr(cs, name) for name in names},
                "Any": Any,
                "asyncio": asyncio,
                "base64": base64,
                "math": math,
                "Response": _Response,
                "HomeAssistantError": sys.modules["homeassistant.exceptions"].HomeAssistantError,
                "_LOGGER": logging.getLogger("wa_camera_ops_test"),
                "_OpContext": object,
                "async_get_image": async_get_image,
            },
        )
        hass = types.SimpleNamespace(
            states=types.SimpleNamespace(get=lambda entity_id: object()),
            async_add_executor_job=async_add_executor_job,
        )
        yield types.SimpleNamespace(
            ns=namespace, hass=hass, fetched=fetched, processed=processed, cs=cs
        )


def _snapshot(camera_ops, payload: dict) -> _Response:
    ctx = _CameraCtx(camera_ops.hass, payload)
    return asyncio.run(camera_ops.ns["_op_snapshot"](ctx))


@pytest.mark.parametrize(
    "viewport",
    [
        {"x": "nan", "y": 0, "width": 0.5, "height": 0.5},
        {"x": float("nan"), "y": float("nan"), "w": float("nan"), "h": float("nan")},
        {"x": 1e308, "y": 0, "width": 0.5, "height": 0.5},
        {"x": float("inf"), "y": float("-inf"), "width": float("inf"), "height": 0.5},
        {"x": 10**400, "y": -(10**400), "width": 0.5, "height": 10**400},
        {"x": "0.25", "y": None, "width": "wide", "height": [1]},
    ],
)
def test_a_snapshot_with_a_wild_viewport_is_clamped_not_crashed(camera_ops, viewport) -> None:
    """NaN, infinity and numbers too big for the crop's int() used to raise in
    the executor and come back as a 500. They now clamp to the unit square,
    the same way stream_open treats them, and the snapshot is served."""
    reply = _snapshot(camera_ops, {"entity_id": "camera.front", "viewport": viewport})
    assert reply.status == 200
    assert reply.body[:2] == b"\xff\xd8"
    [used] = camera_ops.processed
    for value in (used.x, used.y, used.w, used.h):
        assert math.isfinite(value) and 0.0 <= value <= 1.0
    assert used.w >= 0.01 and used.h >= 0.01


def test_a_snapshot_keeps_a_sane_viewport_as_sent(camera_ops) -> None:
    viewport = {"x": 0.25, "y": 0.1, "width": 0.5, "height": 0.4}
    assert _snapshot(camera_ops, {"entity_id": "camera.front", "viewport": viewport}).status == 200
    [used] = camera_ops.processed
    assert (used.x, used.y, used.w, used.h) == (0.25, 0.1, 0.5, 0.4)


def test_a_snapshot_with_an_infinite_width_takes_the_largest_size(camera_ops) -> None:
    reply = _snapshot(
        camera_ops,
        {"entity_id": "camera.front", "width": float("inf"), "quality": float("nan")},
    )
    assert reply.status == 200


def test_camera_batch_skips_entries_that_are_not_objects(camera_ops) -> None:
    """A bare string, null or number in ``cameras`` used to raise
    AttributeError inside the gather and fail the whole batch with a 500.
    Each now gets skipped like an entry with a bad entity_id, and the good
    entry beside them is still served."""
    payload = {
        "cameras": [
            "camera.front",
            None,
            7,
            ["camera.front"],
            {"entity_id": "camera.back", "viewport": {"x": "nan", "width": float("inf")}},
        ]
    }
    ctx = _CameraCtx(camera_ops.hass, payload)
    reply = asyncio.run(camera_ops.ns["_op_camera_batch"](ctx))
    assert reply.status == 200
    [snap] = reply.body["snapshots"]
    assert snap["entity_id"] == "camera.back"
    assert snap["data"] and snap["size"] > 0
    assert camera_ops.fetched == ["camera.back"]


def test_camera_batch_with_only_bad_entries_answers_an_empty_list(camera_ops) -> None:
    ctx = _CameraCtx(camera_ops.hass, {"cameras": ["camera.front", None]})
    reply = asyncio.run(camera_ops.ns["_op_camera_batch"](ctx))
    assert reply.status == 200
    assert reply.body == {"snapshots": []}
