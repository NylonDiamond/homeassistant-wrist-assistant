"""Smoke test for /v2/action op=verify_identity.

This is the identity probe the iOS app runs against the local URL before
attaching a bearer to subsequent calls. The roundtrip must verify in both
directions: HA validates the inbound request's HMAC against a registered
secret, and HA signs the response body with the same key. A wrong host at
the same private IP can't satisfy either side.

Run from the repo root:

    HA_URL=https://homeassistant.local:8123 HA_TOKEN=<long-lived> \\
        pytest -v tests/test_v2_verify_identity.py

Each run registers a fresh ephemeral secret under a randomized
`iphone:test-*` watch_id, so re-runs don't collide. The integration retains
those entries; the dev HA can be reset to drop them when they accumulate.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import secrets
import time

import pytest
import requests

WA_PROTOCOL_VERSION = 2


def _sign_request(
    secret: bytes, op: str, watch_id: str, ts: int, nonce: str, body: bytes
) -> str:
    canonical = (
        f"v{WA_PROTOCOL_VERSION}|{op}|{watch_id}|{ts}|{nonce}".encode("utf-8")
        + b"\n"
        + body
    )
    return hmac.new(secret, canonical, hashlib.sha256).hexdigest()


def _verify_response(
    secret: bytes, op: str, watch_id: str, ts: int, body: bytes, sig: str
) -> bool:
    canonical = (
        f"v{WA_PROTOCOL_VERSION}|{op}|{watch_id}|{ts}|response".encode("utf-8")
        + b"\n"
        + body
    )
    expected = hmac.new(secret, canonical, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, sig.lower())


@pytest.fixture
def iphone_key(
    base_url: str, session: requests.Session
) -> tuple[str, bytes]:
    """Register an ephemeral iPhone-namespaced HMAC key with HA.

    Returns (watch_id, secret_bytes). The bearer-authenticated session
    fixture from conftest.py covers /v2/register_secret.
    """
    watch_id = f"iphone:test-{secrets.token_hex(8)}"
    secret_bytes = secrets.token_bytes(32)
    r = session.post(
        f"{base_url}/api/wrist_assistant/v2/register_secret",
        json={
            "watch_id": watch_id,
            "secret_b64": base64.b64encode(secret_bytes).decode("ascii"),
            "label": "pytest verify_identity smoke",
            "algo": "hmac-sha256",
        },
        timeout=10,
    )
    assert r.status_code == 200, r.text
    return watch_id, secret_bytes


def test_verify_identity_roundtrip(
    base_url: str, iphone_key: tuple[str, bytes]
) -> None:
    """Signed request returns a signed response that verifies under our key."""
    watch_id, secret = iphone_key
    op = "verify_identity"
    ts = int(time.time())
    nonce = secrets.token_hex(16)
    body = b"{}"
    sig = _sign_request(secret, op, watch_id, ts, nonce, body)

    r = requests.post(
        f"{base_url}/api/wrist_assistant/v2/action",
        data=body,
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
    assert r.status_code == 200, r.text

    resp_ts = int(r.headers["X-WA-Ts"])
    resp_sig = r.headers["X-WA-Sig"]
    # `requests` auto-decompresses gzip responses, so r.content is the raw
    # JSON bytes the server signed (sign_response signs pre-gzip).
    assert _verify_response(
        secret, op, watch_id, resp_ts, r.content, resp_sig
    ), "Response HMAC failed to verify with our registered key"

    payload = r.json()
    assert payload["ok"] is True
    assert isinstance(payload["ts"], int)


def test_verify_identity_rejects_bad_signature(
    base_url: str, iphone_key: tuple[str, bytes]
) -> None:
    """Wrong signature returns 401, not 200."""
    watch_id, _ = iphone_key
    ts = int(time.time())
    nonce = secrets.token_hex(16)

    r = requests.post(
        f"{base_url}/api/wrist_assistant/v2/action",
        data=b"{}",
        headers={
            "Content-Type": "application/json",
            "X-WA-Version": str(WA_PROTOCOL_VERSION),
            "X-WA-Op": "verify_identity",
            "X-WA-Watch": watch_id,
            "X-WA-Ts": str(ts),
            "X-WA-Nonce": nonce,
            "X-WA-Sig": "00" * 32,
        },
        timeout=10,
    )
    assert r.status_code == 401


def test_verify_identity_rejects_unknown_watch(base_url: str) -> None:
    """Unregistered watch_id (with a plausibly-signed request) returns 401.

    Models the coffee-shop scenario: the box at the private IP isn't our HA
    and has no record of this device's secret, so it can't verify the inbound
    HMAC. We send a syntactically valid request signed with a key the server
    has never seen.
    """
    rogue_watch_id = f"iphone:rogue-{secrets.token_hex(8)}"
    rogue_secret = secrets.token_bytes(32)
    op = "verify_identity"
    ts = int(time.time())
    nonce = secrets.token_hex(16)
    body = b"{}"
    sig = _sign_request(rogue_secret, op, rogue_watch_id, ts, nonce, body)

    r = requests.post(
        f"{base_url}/api/wrist_assistant/v2/action",
        data=body,
        headers={
            "Content-Type": "application/json",
            "X-WA-Version": str(WA_PROTOCOL_VERSION),
            "X-WA-Op": op,
            "X-WA-Watch": rogue_watch_id,
            "X-WA-Ts": str(ts),
            "X-WA-Nonce": nonce,
            "X-WA-Sig": sig,
        },
        timeout=10,
    )
    assert r.status_code == 401
