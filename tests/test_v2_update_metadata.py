"""Live tests for /v2/action op=update_metadata.

This is the HMAC-signed metadata refresh an already-registered watch uses to
report app version / build / owner iPhone / device name without ever touching
the HA bearer token. It exists so a watch holding a stale bearer can keep its
diagnostic sensors current without writing "Login attempt failed" entries to
HA's log (the old path re-POSTed /v2/register_secret with the bearer).

Run from the repo root against a dev HA running this integration version:

    HA_URL=https://homeassistant.local:8123 HA_TOKEN=<long-lived> \\
        pytest -v tests/test_v2_update_metadata.py

Each run registers a fresh ephemeral secret under a randomized
`iphone:test-*` watch_id, so re-runs don't collide, through the
`register_secret` fixture, which forgets it again when the session ends.
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


def _post_op(
    base_url: str,
    secret: bytes,
    watch_id: str,
    op: str,
    body: bytes,
    *,
    sig_override: str | None = None,
) -> requests.Response:
    ts = int(time.time())
    nonce = secrets.token_hex(16)
    sig = sig_override or _sign_request(secret, op, watch_id, ts, nonce, body)
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
def registered_watch(register_secret: Callable[..., bytes]) -> tuple[str, bytes]:
    """Register an ephemeral HMAC key with initial metadata, as the watch's
    self-provision (or iOS provisioning) would have."""
    watch_id = f"iphone:test-{secrets.token_hex(8)}"
    secret_bytes = register_secret(
        watch_id,
        label="pytest update_metadata smoke",
        app_version="0.0.1",
        app_build="1",
        device_name="Pytest Watch",
    )
    return watch_id, secret_bytes


def test_update_metadata_roundtrip(
    base_url: str, registered_watch: tuple[str, bytes]
) -> None:
    """Signed update changes the stored metadata and echoes it back signed."""
    watch_id, secret = registered_watch
    op = "update_metadata"
    body = (
        b'{"app_version": "9.9.9", "app_build": "999",'
        b' "device_name": "Pytest Watch Renamed"}'
    )
    r = _post_op(base_url, secret, watch_id, op, body)
    assert r.status_code == 200, r.text

    resp_ts = int(r.headers["X-WA-Ts"])
    resp_sig = r.headers["X-WA-Sig"]
    assert _verify_response(
        secret, op, watch_id, resp_ts, r.content, resp_sig
    ), "Response HMAC failed to verify with our registered key"

    payload = r.json()
    assert payload["ok"] is True
    assert payload["app_version"] == "9.9.9"
    assert payload["app_build"] == "999"
    assert payload["device_name"] == "Pytest Watch Renamed"


def test_update_metadata_omitted_fields_left_unchanged(
    base_url: str, registered_watch: tuple[str, bytes]
) -> None:
    """Omitted / empty fields keep their stored values (None = no change)."""
    watch_id, secret = registered_watch

    r = _post_op(
        base_url, secret, watch_id, "update_metadata", b'{"app_version": "2.2.2"}'
    )
    assert r.status_code == 200, r.text
    payload = r.json()
    assert payload["app_version"] == "2.2.2"
    # From the register fixture, untouched by this call:
    assert payload["app_build"] == "1"
    assert payload["device_name"] == "Pytest Watch"

    # Empty / whitespace strings are treated as omitted, not as a wipe.
    r = _post_op(
        base_url,
        secret,
        watch_id,
        "update_metadata",
        b'{"app_version": "  ", "app_build": ""}',
    )
    assert r.status_code == 200, r.text
    payload = r.json()
    assert payload["app_version"] == "2.2.2"
    assert payload["app_build"] == "1"


def test_update_metadata_rejects_bad_signature(
    base_url: str, registered_watch: tuple[str, bytes]
) -> None:
    """Wrong signature returns 401 (from the integration, not HA's auth)."""
    watch_id, secret = registered_watch
    r = _post_op(
        base_url,
        secret,
        watch_id,
        "update_metadata",
        b'{"app_version": "6.6.6"}',
        sig_override="00" * 32,
    )
    assert r.status_code == 401

    # And the rejected update must not have been applied.
    r = _post_op(base_url, secret, watch_id, "update_metadata", b"{}")
    assert r.status_code == 200, r.text
    assert r.json()["app_version"] == "0.0.1"


def test_update_metadata_cannot_touch_other_watch(
    base_url: str,
    register_secret: Callable[..., bytes],
    registered_watch: tuple[str, bytes],
) -> None:
    """The op updates the HMAC-authenticated identity only — there is no
    payload field that can address a different watch's entry."""
    watch_id, secret = registered_watch

    other_id = f"iphone:test-{secrets.token_hex(8)}"
    other_secret = register_secret(
        other_id, label="pytest update_metadata other", app_version="5.5.5"
    )

    # Try to smuggle a watch_id into the payload while signed as `watch_id`.
    body = (
        '{"watch_id": "%s", "app_version": "6.6.6"}' % other_id
    ).encode("utf-8")
    r = _post_op(base_url, secret, watch_id, "update_metadata", body)
    assert r.status_code == 200, r.text
    # Our own entry took the update…
    assert r.json()["app_version"] == "6.6.6"

    # …and the other watch's entry did not.
    r = _post_op(base_url, other_secret, other_id, "update_metadata", b"{}")
    assert r.status_code == 200, r.text
    assert r.json()["app_version"] == "5.5.5"
