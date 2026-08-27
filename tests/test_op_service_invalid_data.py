"""Regression: the ``service`` op must return 400 (not 500) on invalid data.

Reproduces feedback #23. The watch called ``todo.update_item`` with a ``uid``
key in ``service_data``; HA's todo schema rejects that extra key with a
voluptuous ``vol.Invalid`` error. That error is *not* a ``HomeAssistantError``,
so ``_op_service`` let it fall through to the generic handler as an unhandled
HTTP 500 ("Unexpected error in op service"). The fix catches ``vol.Invalid``
and returns a clean 400.

This is a black-box HTTP test in the style of the rest of the suite (it drives
the real ``/v2/action`` endpoint, no mocking). The illegal call fails at schema
validation *before* any service runs, so it mutates nothing.

NOTE: this must run against an instance whose integration includes the fix
(deploy the branch first, e.g. via /ha-deploy). Against the pre-fix code
``test_invalid_service_data_returns_400`` will FAIL, observing the 500 it
guards against — which is exactly the point: it goes red on the bug, green on
the fix.

Run from the repo root:

    HA_URL=https://homeassistant.local:8123 HA_TOKEN=<long-lived> \\
        pytest -v tests/test_op_service_invalid_data.py
"""

from __future__ import annotations

import hashlib
import hmac
import secrets
import time
from collections.abc import Callable

import requests

WA_PROTOCOL_VERSION = 2

# A todo entity to target. The illegal call is rejected at schema validation
# before the entity is even resolved, so this only needs to be a plausible id;
# the valid-data control call uses the read-only get_items service against it.
TODO_ENTITY = "todo.watch"


def _sign_request(
    secret: bytes, op: str, watch_id: str, ts: int, nonce: str, body: bytes
) -> str:
    canonical = (
        f"v{WA_PROTOCOL_VERSION}|{op}|{watch_id}|{ts}|{nonce}".encode("utf-8")
        + b"\n"
        + body
    )
    return hmac.new(secret, canonical, hashlib.sha256).hexdigest()


def _call_service(
    base_url: str, watch_id: str, secret: bytes, payload: bytes
) -> requests.Response:
    """POST a signed ``service`` op with a raw JSON body."""
    op = "service"
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
        timeout=10,
    )


def test_invalid_service_data_returns_400(
    base_url: str, register_secret: Callable[..., bytes]
) -> None:
    """A ``uid`` key HA's todo schema rejects must yield 400, never 500.

    This is the #23 repro. The old code surfaced the voluptuous error as an
    unhandled 500; the fix returns a clean 400.
    """
    watch_id = f"watch-{secrets.token_hex(8)}"
    secret = register_secret(
        watch_id, label="pytest op_service invalid-data regression"
    )

    body = (
        '{"domain": "todo", "service": "update_item", '
        f'"entity_id": "{TODO_ENTITY}", '
        '"service_data": {"item": "__wa_regression_probe__", "uid": "probe-123"}}'
    ).encode("utf-8")

    r = _call_service(base_url, watch_id, secret, body)

    assert r.status_code != 500, (
        "op_service leaked a voluptuous error as HTTP 500 (feedback #23 "
        f"regression); body: {r.text}"
    )
    assert r.status_code == 400, f"expected 400 for invalid service data, got {r.status_code}: {r.text}"


def test_valid_service_data_not_rejected(
    base_url: str, register_secret: Callable[..., bytes]
) -> None:
    """Control: well-formed data must not be caught by the new 400 branch.

    A read-only ``todo.get_items`` call (no mutation) proves the vol.Invalid
    catch doesn't over-trigger on valid input.
    """
    watch_id = f"watch-{secrets.token_hex(8)}"
    secret = register_secret(
        watch_id, label="pytest op_service invalid-data regression"
    )

    body = (
        '{"domain": "todo", "service": "get_items", '
        f'"entity_id": "{TODO_ENTITY}", "return_response": true}}'
    ).encode("utf-8")

    r = _call_service(base_url, watch_id, secret, body)

    assert r.status_code == 200, f"valid service call should succeed, got {r.status_code}: {r.text}"
    assert r.json().get("ok") is True, r.text
