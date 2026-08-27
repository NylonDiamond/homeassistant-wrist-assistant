"""Cross-tenant authorization smoke test for /v2 ``companion_watch_id`` ops.

A v2 op that accepts ``companion_watch_id`` (watch_secret_status,
notifications_status, webhook_provision, notifications_register,
send_test_notification) must only act on a companion watch the *authenticated
caller owns* — i.e. the watch entry's recorded ``owner_iphone_id`` equals the
caller. Otherwise any device authenticated to a shared HA instance (multi-user,
or a household with several paired watches — the family-plan case) could name
another user's watch and read or mutate its entry. Previously the companion was
trusted straight from the request body with no ownership check.

This exercises the read-only ``watch_secret_status`` op (no side effects on the
live HA) as the representative case; all five ops route through the shared
``_resolve_companion_target`` guard, so the boolean answer here proves the gate.

NOTE: this must run against an instance whose integration includes the guard
(deploy the branch first, e.g. via /ha-deploy). Against the pre-fix code
``test_non_owner_is_rejected`` will fail (the old path returned 200).

Run from the repo root:

    HA_URL=https://homeassistant.local:8123 HA_TOKEN=<long-lived> \\
        pytest -v tests/test_v2_companion_authz.py

Each run registers fresh randomized ids so re-runs don't collide, through the
``register_secret`` fixture, which forgets them again when the session ends.
"""

from __future__ import annotations

import hashlib
import hmac
import secrets
import time
from collections.abc import Callable

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


def _register_key(
    register_secret: Callable[..., bytes],
    watch_id: str,
    *,
    owner_iphone_id: str | None = None,
) -> bytes:
    """Register an ephemeral HMAC key, return its secret bytes."""
    extra = {} if owner_iphone_id is None else {"owner_iphone_id": owner_iphone_id}
    return register_secret(
        watch_id, label="pytest companion authz smoke", **extra
    )


def _watch_secret_status(
    base_url: str, watch_id: str, secret: bytes, companion: str
) -> requests.Response:
    op = "watch_secret_status"
    body = ('{"companion_watch_id": "%s"}' % companion).encode("utf-8")
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


def test_owner_can_query_companion(
    base_url: str, register_secret: Callable[..., bytes]
) -> None:
    """The owning iPhone may query its paired watch's status (200)."""
    suffix = secrets.token_hex(8)
    owner_id = f"iphone:owner-{suffix}"
    watch_id = f"watch-{suffix}"
    owner_secret = _register_key(register_secret, owner_id)
    _register_key(register_secret, watch_id, owner_iphone_id=owner_id)

    r = _watch_secret_status(base_url, owner_id, owner_secret, watch_id)
    assert r.status_code == 200, r.text
    assert r.json()["registered"] is True


def test_non_owner_is_rejected(
    base_url: str, register_secret: Callable[..., bytes]
) -> None:
    """A different authenticated iPhone cannot query someone else's watch (403).

    The attacker presents a valid HMAC (real registered secret) — auth passes —
    but is not the watch's recorded owner, so authorization must fail.
    """
    suffix = secrets.token_hex(8)
    owner_id = f"iphone:owner-{suffix}"
    watch_id = f"watch-{suffix}"
    attacker_id = f"iphone:attacker-{suffix}"
    _register_key(register_secret, owner_id)
    _register_key(register_secret, watch_id, owner_iphone_id=owner_id)
    attacker_secret = _register_key(register_secret, attacker_id)

    r = _watch_secret_status(base_url, attacker_id, attacker_secret, watch_id)
    assert r.status_code == 403, r.text


def test_ownerless_watch_allowed_for_backcompat(
    base_url: str, register_secret: Callable[..., bytes]
) -> None:
    """A watch with no recorded owner stays queryable (pre-owner-tracking compat)."""
    suffix = secrets.token_hex(8)
    watch_id = f"watch-noowner-{suffix}"
    caller_id = f"iphone:caller-{suffix}"
    _register_key(register_secret, watch_id)  # no owner_iphone_id
    caller_secret = _register_key(register_secret, caller_id)

    r = _watch_secret_status(base_url, caller_id, caller_secret, watch_id)
    assert r.status_code == 200, r.text
