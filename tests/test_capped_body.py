"""The body caps on the views that run before any login.

``/v2/action`` and the pairing views (``/v2/pair/start``, ``/v2/pair/status``,
``/v2/pair/redeem``) take requests from anyone who can reach Home
Assistant. They used to read the whole body (up to Home Assistant's own
16 MiB) before checking anything, so a stranger could make Home Assistant
hold and parse many large bodies at once. Now the action view checks every
signed header it can without the body first (``precheck_wa_request``) and
reads at most ``ACTION_MAX_BODY_BYTES``, and the pairing views and
``register_secret`` read at most ``PAIR_MAX_BODY_BYTES``.

The readers are pulled out of ``wa_v2_views.py`` by name and run against a
stand-in body stream; the order in the views is pinned on the source.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import json
from pathlib import Path
from typing import Any

import pytest

_MODULE = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant" / "wa_v2_views.py"
_TREE = ast.parse(_MODULE.read_text(), filename=str(_MODULE))
_PAIR_VIEWS = ("WARegisterSecretView", "WAPairStartView", "WAPairStatusView", "WAPairRedeemView")


def _readers() -> dict[str, Any]:
    names = {"_read_capped_body", "_read_capped_json", "_BodyTooLarge"}
    wanted = [
        node
        for node in _TREE.body
        if isinstance(node, ast.ClassDef | ast.AsyncFunctionDef) and node.name in names
    ]
    assert sorted(n.name for n in wanted) == sorted(names)
    code = compile(
        ast.Module(body=wanted, type_ignores=[]),
        str(_MODULE),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    namespace: dict[str, Any] = {"Any": Any, "Request": object, "json": json}
    exec(code, namespace)  # noqa: S102
    return namespace


class _Content:
    def __init__(self, body: bytes) -> None:
        self._body = body
        self.read_bytes = 0

    async def read(self, n: int) -> bytes:
        chunk = self._body[self.read_bytes : self.read_bytes + n]
        self.read_bytes += len(chunk)
        return chunk


class _Request:
    def __init__(self, body: bytes, declared: int | None) -> None:
        self.content_length = declared
        self.content = _Content(body)


@pytest.fixture(scope="module")
def readers() -> dict[str, Any]:
    return _readers()


def test_a_body_within_the_cap_is_read_whole(readers) -> None:
    body = b'{"watch_id": "w"}'
    for declared in (len(body), None):
        assert asyncio.run(readers["_read_capped_body"](_Request(body, declared), 1024)) == body
        assert asyncio.run(readers["_read_capped_json"](_Request(body, declared), 1024)) == {"watch_id": "w"}


def test_a_declared_length_over_the_cap_reads_nothing(readers) -> None:
    request = _Request(b"x" * 4096, 4096)
    assert asyncio.run(readers["_read_capped_body"](request, 1024)) is None
    assert request.content.read_bytes == 0


def test_a_chunked_body_is_read_only_just_past_the_cap(readers) -> None:
    request = _Request(b"x" * (1024 * 1024), None)
    assert asyncio.run(readers["_read_capped_body"](request, 1024)) is None
    # One 64 KiB chunk, never the whole megabyte.
    assert request.content.read_bytes <= 64 * 1024


def test_the_json_reader_says_too_large_or_not_json(readers) -> None:
    with pytest.raises(readers["_BodyTooLarge"]):
        asyncio.run(readers["_read_capped_json"](_Request(b"x" * 2048, None), 1024))
    # A ValueError, so a view that only catches ValueError still answers 400.
    assert issubclass(readers["_BodyTooLarge"], ValueError)
    for junk in (b"", b"{", b"\xff\xfe"):
        with pytest.raises(ValueError):
            asyncio.run(readers["_read_capped_json"](_Request(junk, len(junk)), 1024))


def _class(name: str) -> ast.ClassDef:
    return next(n for n in _TREE.body if isinstance(n, ast.ClassDef) and n.name == name)


def _calls(node: ast.AST) -> list[ast.Call]:
    return sorted(
        (n for n in ast.walk(node) if isinstance(n, ast.Call)),
        key=lambda n: (n.lineno, n.col_offset),
    )


def _name(call: ast.Call) -> str | None:
    func = call.func
    return func.attr if isinstance(func, ast.Attribute) else getattr(func, "id", None)


def test_the_action_view_prechecks_then_reads_capped() -> None:
    names = [_name(c) for c in _calls(_class("WAActionView"))]
    assert "read" not in names and "json" not in names
    assert names.index("precheck_wa_request") < names.index("_read_capped_body") < names.index("validate_wa_request")
    read = next(c for c in _calls(_class("WAActionView")) if _name(c) == "_read_capped_body")
    assert isinstance(read.args[1], ast.Name) and read.args[1].id == "ACTION_MAX_BODY_BYTES"


@pytest.mark.parametrize("view", _PAIR_VIEWS)
def test_the_pairing_views_read_capped_json(view) -> None:
    calls = _calls(_class(view))
    names = [_name(c) for c in calls]
    assert "json" not in [n for c, n in zip(calls, names) if isinstance(c.func, ast.Attribute) and getattr(c.func.value, "id", None) == "request"]
    assert "read" not in names
    [read] = [c for c in calls if _name(c) == "_read_capped_json"]
    assert isinstance(read.args[1], ast.Name) and read.args[1].id == "PAIR_MAX_BODY_BYTES"


def test_the_caps_leave_room_for_every_op_body() -> None:
    source = _MODULE.read_text()
    assert "ACTION_MAX_BODY_BYTES = WATCH_LOGS_MAX_BODY_BYTES + 1024 * 1024" in source
    assert "PAIR_MAX_BODY_BYTES = 16 * 1024" in source
    # Every other op cap sits under the logs cap the action cap is built on.
    for cap in (
        "_HAND_OVER_MAX_SEALED_BODY_BYTES",
        "_PAGE_IMAGE_PUT_MAX_BODY_BYTES = 360 * 1024",
        "_CLIENT_CERTIFICATE_PUT_MAX_BODY_BYTES = 96 * 1024",
    ):
        assert cap in source
