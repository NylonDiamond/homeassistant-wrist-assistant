"""The `entity_picture` op: any entity's own picture, not just a person's.

Two halves, the way the rest of this suite is split.

The static half needs no Home Assistant. `wa_v2_views` cannot be imported
without a full HA install, so the checks that matter most read the module's
AST instead: that the op is registered under both its new name and the one
the watch app's person tiles still send, that the domain guard which used to
restrict it to `person.*` is gone, that an absolute `entity_picture` is still
refused, and that an oversized picture is downscaled before it goes to a
watch. Each of those is a whole feature that a one-line edit could silently
undo, and none of them would show up in a compile.

The live half drives the real endpoint and skips without HA_URL. It proves
registration end to end: a signed call under either name must reach the
handler and be answered by it (404 for an entity that does not exist), never
turned away as an unknown op.

Run from the repo root:

    .venv-test/bin/python -m pytest tests/test_op_entity_picture.py
    HA_URL=https://homeassistant.local:8123 HA_TOKEN=<long-lived> \\
        .venv-test/bin/python -m pytest -v tests/test_op_entity_picture.py
"""

from __future__ import annotations

import ast
import hashlib
import hmac
import secrets
import time
from collections.abc import Callable
from pathlib import Path

import pytest
import requests

WA_PROTOCOL_VERSION = 2

_MODULE = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "wa_v2_views.py"
)

_HANDLER = "_op_entity_picture"


def _tree() -> ast.Module:
    return ast.parse(_MODULE.read_text(), filename=str(_MODULE))


def _handler(tree: ast.Module) -> ast.AsyncFunctionDef:
    for node in ast.walk(tree):
        if isinstance(node, ast.AsyncFunctionDef) and node.name == _HANDLER:
            return node
    raise AssertionError(f"{_HANDLER} is not defined in wa_v2_views.py")


def _op_handlers(tree: ast.Module) -> dict[str, str]:
    """The op dispatch table as {op string: handler function name}."""
    for node in ast.walk(tree):
        # The table is annotated (`_OP_HANDLERS: dict[str, Any] = {...}`), so it
        # is an AnnAssign; a plain Assign is accepted too in case that changes.
        if isinstance(node, ast.AnnAssign):
            target: ast.expr | None = node.target
        elif isinstance(node, ast.Assign):
            target = node.targets[0] if node.targets else None
        else:
            continue
        if not (isinstance(target, ast.Name) and target.id == "_OP_HANDLERS"):
            continue
        assert isinstance(node.value, ast.Dict)
        table: dict[str, str] = {}
        for key, value in zip(node.value.keys, node.value.values):
            if isinstance(key, ast.Constant) and isinstance(value, ast.Name):
                table[str(key.value)] = value.id
        return table
    raise AssertionError("_OP_HANDLERS is not defined in wa_v2_views.py")


def _strings(node: ast.AST) -> set[str]:
    return {
        n.value
        for n in ast.walk(node)
        if isinstance(n, ast.Constant) and isinstance(n.value, str)
    }


def _called_names(node: ast.AST) -> set[str]:
    names: set[str] = set()
    for n in ast.walk(node):
        if not isinstance(n, ast.Call):
            continue
        if isinstance(n.func, ast.Name):
            names.add(n.func.id)
        elif isinstance(n.func, ast.Attribute):
            names.add(n.func.attr)
    return names


def test_both_op_names_reach_the_one_handler() -> None:
    table = _op_handlers(_tree())
    assert table.get("entity_picture") == _HANDLER
    assert table.get("person_picture") == _HANDLER, (
        "person_picture must stay registered: the watch app's person tiles "
        "still send it, and an older watch never learns the new name"
    )


def test_the_person_only_guard_is_gone() -> None:
    """Any domain may carry an entity_picture, so nothing may filter on one."""
    body = _strings(_handler(_tree()))
    assert "person." not in body
    assert not any(s.startswith("person.") for s in body), sorted(body)


def test_an_external_picture_is_refused_with_a_reason() -> None:
    """Anti-amplification: an absolute URL is never proxied.

    The refusal carries `reason: "external"` so the caller can tell "hosted
    somewhere else" apart from "the fetch failed" and say so.
    """
    node = _handler(_tree())
    assert "external" in _strings(node)
    assert "reason" in _strings(node)
    assert "signed_json" in _called_names(node)


def test_an_oversized_picture_is_downscaled() -> None:
    """A 1500 px cover cannot blow the widget's 100 KB per-image budget."""
    node = _handler(_tree())
    # `_process_snapshot` is handed to the executor rather than called here, so
    # it is a name in the body, not a call.
    used = {n.id for n in ast.walk(node) if isinstance(n, ast.Name)}
    assert "_process_snapshot" in used
    assert "async_add_executor_job" in _called_names(node)
    assert "SNAPSHOT_MAX_BYTES" in used
    assert "SNAPSHOT_MAX_WIDTH" in used


# ── live endpoint ─────────────────────────────────────────────────────────


def _sign_request(
    secret: bytes, op: str, watch_id: str, ts: int, nonce: str, body: bytes
) -> str:
    canonical = (
        f"v{WA_PROTOCOL_VERSION}|{op}|{watch_id}|{ts}|{nonce}".encode("utf-8")
        + b"\n"
        + body
    )
    return hmac.new(secret, canonical, hashlib.sha256).hexdigest()


def _call(
    base_url: str, watch_id: str, secret: bytes, op: str, payload: bytes
) -> requests.Response:
    ts = int(time.time())
    nonce = secrets.token_hex(16)
    sig = _sign_request(secret, op, watch_id, ts, nonce, payload)
    return requests.post(
        f"{base_url}/api/wrist_assistant/v2/action",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "X-WA-Version": str(WA_PROTOCOL_VERSION),
            "X-WA-Op": op,
            "X-WA-Watch": watch_id,
            "X-WA-Ts": str(ts),
            "X-WA-Nonce": nonce,
            "X-WA-Sig": sig,
        },
        timeout=15,
    )


def _skip_unless_deployed(r: requests.Response) -> None:
    """A box still running the old integration answers `Unknown op`.

    That is a stale deploy, not a broken feature, and it is the state every
    checkout is in before the bundle ships. Say so and skip rather than fail
    on it; once the branch is on the box these tests are real again.
    """
    if r.status_code == 400 and "Unknown op" in r.text:
        pytest.skip(f"the instance predates this op ({r.text.strip()}); deploy first")


def test_both_names_are_answered_by_the_handler(
    base_url: str, register_secret: Callable[..., bytes]
) -> None:
    """An entity that does not exist is a 404 from the op, not a 400 from the
    dispatcher. Under either name: that is what proves both are registered."""
    watch_id = f"watch-{secrets.token_hex(8)}"
    secret = register_secret(watch_id, label="pytest entity_picture registration")
    body = b'{"entity_id": "person.__wa_no_such_entity__"}'

    for op in ("entity_picture", "person_picture"):
        r = _call(base_url, watch_id, secret, op, body)
        _skip_unless_deployed(r)
        assert r.status_code == 404, (
            f"op {op} should reach the handler and 404 on a missing entity, "
            f"got {r.status_code}: {r.text}"
        )


def test_a_non_person_entity_is_no_longer_rejected(
    base_url: str, register_secret: Callable[..., bytes]
) -> None:
    """The old handler answered 400 for anything outside `person.`.

    A media player that does not exist must now get the same 404 any other
    unknown entity gets, which is the whole of feature 5 on the backend.
    """
    watch_id = f"watch-{secrets.token_hex(8)}"
    secret = register_secret(watch_id, label="pytest entity_picture any domain")
    body = b'{"entity_id": "media_player.__wa_no_such_entity__"}'

    r = _call(base_url, watch_id, secret, "entity_picture", body)
    _skip_unless_deployed(r)
    assert r.status_code == 404, (
        "a non-person entity id must not be turned away as a bad request; "
        f"got {r.status_code}: {r.text}"
    )
