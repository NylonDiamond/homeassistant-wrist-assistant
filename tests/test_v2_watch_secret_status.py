"""Smoke test for /v2/action op=watch_secret_status.

This is the query the iOS app runs when it's re-skinned to view a *secondary*
Home Assistant instance: the watch's per-instance HMAC secret lives only on the
watch and in HACS (the iPhone never stores a secondary's watch secret), so the
app asks HACS whether the paired watch is registered here. The op returns only a
boolean — never the secret — and answers for whatever ``companion_watch_id`` the
signed caller names.

Run from the repo root:

    HA_URL=https://homeassistant.local:8123 HA_TOKEN=<long-lived> \\
        pytest -v tests/test_v2_watch_secret_status.py

Each run registers a fresh ephemeral secret under a randomized `iphone:test-*`
watch_id, so re-runs don't collide, through the `register_secret` fixture,
which forgets it again when the session ends.
"""

from __future__ import annotations

import hashlib
import hmac
import secrets
import time
from collections.abc import Callable

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


def _post_status(
    base_url: str,
    watch_id: str,
    secret: bytes,
    body: bytes,
) -> requests.Response:
    op = "watch_secret_status"
    ts = int(time.time())
    nonce = secrets.token_hex(16)
    sig = _sign_request(secret, op, watch_id, ts, nonce, body)
    return requests.post(
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


@pytest.fixture
def iphone_key(register_secret: Callable[..., bytes]) -> tuple[str, bytes]:
    """Register an ephemeral iPhone-namespaced HMAC key with HA.

    Returns (watch_id, secret_bytes). The `register_secret` fixture from
    conftest.py owns the POST and the end-of-session cleanup.
    """
    watch_id = f"iphone:test-{secrets.token_hex(8)}"
    secret_bytes = register_secret(watch_id, label="pytest watch_secret_status smoke")
    return watch_id, secret_bytes


def test_status_self_is_registered(
    base_url: str, iphone_key: tuple[str, bytes]
) -> None:
    """With no companion, the op reports on the signing id — which is registered."""
    watch_id, secret = iphone_key
    r = _post_status(base_url, watch_id, secret, b"{}")
    assert r.status_code == 200, r.text

    resp_ts = int(r.headers["X-WA-Ts"])
    resp_sig = r.headers["X-WA-Sig"]
    assert _verify_response(
        secret, "watch_secret_status", watch_id, resp_ts, r.content, resp_sig
    ), "Response HMAC failed to verify with our registered key"

    payload = r.json()
    assert payload["ok"] is True
    assert payload["registered"] is True


def test_status_unregistered_companion_is_false(
    base_url: str, iphone_key: tuple[str, bytes]
) -> None:
    """A valid caller can ask about a watch HA has never seen → registered False."""
    watch_id, secret = iphone_key
    unknown = f"unknown-watch-{secrets.token_hex(8)}"
    body = ('{"companion_watch_id": "%s"}' % unknown).encode("utf-8")
    r = _post_status(base_url, watch_id, secret, body)
    assert r.status_code == 200, r.text

    payload = r.json()
    assert payload["ok"] is True
    assert payload["registered"] is False


def test_status_rejects_bad_signature(
    base_url: str, iphone_key: tuple[str, bytes]
) -> None:
    """Wrong signature returns 401, not a forged 'registered' answer."""
    watch_id, _ = iphone_key
    ts = int(time.time())
    nonce = secrets.token_hex(16)
    r = requests.post(
        f"{base_url}/api/wrist_assistant/v2/action",
        data=b"{}",
        headers={
            "Content-Type": "application/json",
            "X-WA-Version": str(WA_PROTOCOL_VERSION),
            "X-WA-Op": "watch_secret_status",
            "X-WA-Watch": watch_id,
            "X-WA-Ts": str(ts),
            "X-WA-Nonce": nonce,
            "X-WA-Sig": "00" * 32,
        },
        timeout=10,
    )
    assert r.status_code == 401
