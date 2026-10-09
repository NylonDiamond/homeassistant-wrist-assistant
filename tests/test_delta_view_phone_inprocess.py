"""In-process tests for ``WADeltaView`` with an iPhone signing the poll.

Phone pages (app repo docs/phone_pages_mvp_2026-10.md, step 1): an iPhone
holds the /v2/delta long poll for its own pages, signed with its own key. Two
fields on the poll belong to a watch and must never be filed under a phone:
``device_token`` (it would land as a watchOS push token under the phone's id)
and ``delivery_mode``. From a phone both are ignored, not refused: the poll
still reaches the coordinator and answers. From a watch nothing changes.

The view is pulled out of ``wa_v2_views.py`` by name, the way
``test_v2_views_inprocess.py`` does it, and run in a namespace of stand-ins:
the HMAC check hands back the signer, and the coordinator, the token store
and the secret store record what they are asked. Its local
``from .api import ...`` resolves to a stand-in module of a package made for
the test.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import json
import logging
import re
import sys
import types
from pathlib import Path
from typing import Any

import pytest

from test_notification_tokens import _loaded_notifications

_MODULE = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "wa_v2_views.py"
)
_PKG = "wa_delta_view_test_pkg"
DOMAIN = "wrist_assistant"
WATCH = "watch-A"
PHONE = "iphone-1"
TOKEN = "ab" * 32

_NAMES = {
    "WADeltaView",
    "_delta_over_caps",
    "_lean_request",
    "_held_revision",
    "_held_revisions",
    "DELTA_MAX_BODY_BYTES",
    "DELTA_MAX_ENTITIES",
    "DELTA_MAX_TEMPLATES",
    "DELTA_MAX_TEMPLATE_CHARS",
    "DELTA_MAX_SUMMARY_ENTITIES",
    "DELTA_MAX_CUSTOM_ENTITIES",
    "_DELTA_TOKEN_MAX_CHARS",
}


class _Response:
    def __init__(self, status: int = 200, text: str = "", body: Any = None, **_: Any) -> None:
        self.status = status
        self.text = text
        self.body = body


class _Tokens:
    """The notification token store's two calls the poll makes, recorded."""

    def __init__(self) -> None:
        self.registered: list[tuple[str, str, str, str]] = []
        self.metadata: list[tuple[str, str, str]] = []

    def register(self, watch_id: str, token: str, *, platform: str, environment: str) -> str:
        self.registered.append((watch_id, token, platform, environment))
        return "new"

    def set_watch_metadata(self, watch_id: str, key: str, value: str) -> None:
        self.metadata.append((watch_id, key, value))


class _Coordinator:
    def __init__(self) -> None:
        self.polls: list[dict[str, Any]] = []

    async def handle_poll(self, **kwargs: Any) -> tuple[int, dict[str, Any]]:
        self.polls.append(kwargs)
        return 200, {"ok": True, "watch_config": {"pages": 3}}


class _Secrets:
    def __init__(self, entries: dict[str, Any]) -> None:
        self._entries = entries

    def get(self, watch_id: str) -> Any:
        return self._entries.get(watch_id)


def _entry(kind: str) -> Any:
    return types.SimpleNamespace(
        device_kind=kind,
        secret_bytes=b"k" * 32,
        secret_b64="aw==",
        user_id="alice",
    )


def _api_module() -> types.ModuleType:
    api = types.ModuleType(f"{_PKG}.api")
    api.DEFAULT_TIMEOUT_SECONDS = 25
    api.MAX_TIMEOUT_SECONDS = 55
    api.MIN_TIMEOUT_SECONDS = 5

    class HeldConfig:
        def __init__(self, **fields: Any) -> None:
            self.__dict__.update(fields)

    api.HeldConfig = HeldConfig
    return api


@pytest.fixture
def delta():
    saved = dict(sys.modules)
    pkg = types.ModuleType(_PKG)
    pkg.__path__ = []
    sys.modules[_PKG] = pkg
    sys.modules[f"{_PKG}.api"] = _api_module()
    prebound: list[tuple[str, str]] = []
    try:
        with _loaded_notifications() as notif_mod:
            is_iphone_entry = notif_mod.is_iphone_entry
        namespace: dict[str, Any] = {
            "__name__": f"{_PKG}.wa_v2_views",
            "__package__": _PKG,
            "Any": Any,
            "HomeAssistant": object,
            "HomeAssistantView": object,
            "Request": object,
            "Response": _Response,
            "WANonceCache": object,
            "WristAssistantData": object,
            "DOMAIN": DOMAIN,
            "_LOGGER": logging.getLogger("test_delta_view_phone"),
            "orjson": types.SimpleNamespace(
                loads=json.loads,
                dumps=lambda obj, option=None: json.dumps(obj).encode(),
                JSONDecodeError=ValueError,
                OPT_NON_STR_KEYS=0,
            ),
            "time": types.SimpleNamespace(time=lambda: 1_790_000_000),
            "gzip": types.SimpleNamespace(compress=lambda data, **_: data),
            "VOICES_HASH_RE": re.compile(r"[0-9a-f]{64}"),
            "WAHMACError": type("WAHMACError", (Exception,), {}),
            "USER_GONE_ERROR": "user_gone",
            "is_iphone_entry": is_iphone_entry,
            "sign_response": lambda *a, **k: "sig",
            "_log_signed_request_rejected": lambda *a, **k: None,
            "_note_signed_use": lambda *a, **k: None,
            "_user_gone_response": lambda *a, **k: _Response(status=403),
            "log_push_token_registered": lambda *a, **k: None,
            "_prebind_relay_token": lambda _hass, _data, watch_id, platform: prebound.append(
                (watch_id, platform)
            ),
        }

        async def _read_capped_body(request: Any, _limit: int) -> bytes:
            return request.body

        async def _async_bound_user_refusal(*_a: Any) -> None:
            return None

        def validate_wa_request(request: Any, _body: bytes, _secrets: Any, _nonces: Any) -> Any:
            return types.SimpleNamespace(
                watch_id=request.signer, op="delta", version=2, algo="hmac-sha256"
            )

        namespace["_read_capped_body"] = _read_capped_body
        namespace["_async_bound_user_refusal"] = _async_bound_user_refusal
        namespace["validate_wa_request"] = validate_wa_request

        tree = ast.parse(_MODULE.read_text(), filename=str(_MODULE))
        wanted = [
            node
            for node in tree.body
            if (
                isinstance(node, (ast.ClassDef, ast.FunctionDef, ast.AsyncFunctionDef))
                and node.name in _NAMES
            )
            or (
                isinstance(node, ast.Assign)
                and isinstance(node.targets[0], ast.Name)
                and node.targets[0].id in _NAMES
            )
        ]
        assert len(wanted) == len(_NAMES)
        code = compile(
            ast.Module(body=wanted, type_ignores=[]),
            str(_MODULE),
            "exec",
            flags=__future__.annotations.compiler_flag,
            dont_inherit=True,
        )
        exec(code, namespace)  # noqa: S102

        tokens = _Tokens()
        coordinator = _Coordinator()
        domain_data = types.SimpleNamespace(
            widget_secret_store=_Secrets({WATCH: _entry("watch"), PHONE: _entry("iphone")}),
            notification_store=tokens,
            coordinator=coordinator,
        )
        hass = types.SimpleNamespace(data={DOMAIN: domain_data})
        view = namespace["WADeltaView"](hass, object())
        yield types.SimpleNamespace(
            view=view, tokens=tokens, coordinator=coordinator, prebound=prebound
        )
    finally:
        for key in list(sys.modules):
            if key not in saved:
                del sys.modules[key]
        sys.modules.update(saved)


def _poll(delta, signer: str, **fields: Any) -> _Response:
    body = {"config_hash": "x", "entities": ["light.kitchen"], "timeout": 0, **fields}
    request = types.SimpleNamespace(
        signer=signer, body=json.dumps(body).encode(), headers={}
    )
    return asyncio.run(delta.view.post(request))


def test_a_phone_s_poll_files_no_push_token_and_no_delivery_mode(delta) -> None:
    reply = _poll(delta, PHONE, device_token=TOKEN, delivery_mode="direct")
    # Ignored, not refused: the poll reached the coordinator and answered.
    assert reply.status == 200
    assert json.loads(reply.body) == {"ok": True, "watch_config": {"pages": 3}}
    assert [poll["watch_id"] for poll in delta.coordinator.polls] == [PHONE]
    assert delta.tokens.registered == []
    assert delta.tokens.metadata == []
    assert delta.prebound == []


def test_a_watch_s_poll_still_files_both(delta) -> None:
    reply = _poll(
        delta,
        WATCH,
        device_token=TOKEN,
        apns_environment="development",
        delivery_mode="direct",
    )
    assert reply.status == 200
    assert delta.tokens.registered == [(WATCH, TOKEN, "watchos", "development")]
    assert delta.tokens.metadata == [(WATCH, "delivery_mode", "direct")]
    assert delta.prebound == [(WATCH, "watchos")]


def test_a_phone_s_poll_is_served_as_its_own(delta) -> None:
    """The phone's id, never a watch's, reaches the coordinator, with the
    revisions it holds."""
    _poll(delta, PHONE, watch_config={"pages": 2, "behavior": 1})
    [poll] = delta.coordinator.polls
    assert poll["watch_id"] == PHONE
    assert poll["entities"] == ["light.kitchen"]
    assert poll["held"].watch_config == {"pages": 2, "behavior": 1}
