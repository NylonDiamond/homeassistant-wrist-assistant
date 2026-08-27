"""Pytest fixtures for the Wrist Assistant integration HTTP test suite.

Run from the repo root:

    HA_URL=http://homeassistant.local:8123 HA_TOKEN=<long-lived> pytest -v tests/

Set HA_URL to the base URL of your dev Home Assistant instance and HA_TOKEN
to a long-lived access token. The suite hits the integration's HTTP surface
directly — both the v2 endpoints and the legacy v1 endpoints kept alive for
v1 watch app builds.

Anything that needs a signed identity must register it through the
``register_secret`` fixture rather than posting to /v2/register_secret by
hand. The fixture records every id it creates and forgets them all at the end
of the session, so a run leaves the box's secret store exactly as it found it.
"""

from __future__ import annotations

import base64
import json
import os
import secrets
import warnings
from collections.abc import Callable, Iterator

import pytest
import requests


@pytest.fixture(scope="session")
def base_url() -> str:
    """Base URL of the HA instance under test."""
    url = os.environ.get("HA_URL")
    if not url:
        pytest.skip("HA_URL env var not set", allow_module_level=False)
    return url.rstrip("/")


@pytest.fixture(scope="session")
def token() -> str:
    """Long-lived access token used for bearer auth on v1 endpoints."""
    t = os.environ.get("HA_TOKEN")
    if not t:
        pytest.skip("HA_TOKEN env var not set", allow_module_level=False)
    return t


@pytest.fixture(scope="session")
def session(token: str) -> requests.Session:
    """Pre-authenticated requests session for v1 endpoints."""
    s = requests.Session()
    s.headers.update({"Authorization": f"Bearer {token}"})
    return s


def _forget_devices(base_url: str, token: str, watch_ids: list[str]) -> None:
    """Drop every listed device from the integration's widget secret store.

    Uses the admin-only ``wrist_assistant/devices/forget`` WebSocket command,
    which is the only path that removes an entry without a device registry
    record to click on in the UI. Imported lazily so a pure-unit run never
    needs the websockets package loaded.
    """
    from websockets.sync.client import connect

    ws_url = (
        base_url.replace("https://", "wss://").replace("http://", "ws://")
        + "/api/websocket"
    )
    failures: list[str] = []
    with connect(ws_url, open_timeout=15) as ws:
        ws.recv()  # auth_required
        ws.send(json.dumps({"type": "auth", "access_token": token}))
        if json.loads(ws.recv()).get("type") != "auth_ok":
            raise AssertionError("cleanup websocket auth failed")
        for msg_id, watch_id in enumerate(watch_ids, start=1):
            ws.send(
                json.dumps(
                    {
                        "id": msg_id,
                        "type": "wrist_assistant/devices/forget",
                        "watch_id": watch_id,
                        # Test identities never hold a push token or a
                        # complication, so force only covers the case where a
                        # test deliberately gave one of theirs something.
                        "force": True,
                    }
                )
            )
            reply = json.loads(ws.recv(timeout=15))
            if not reply.get("success"):
                failures.append(f"{watch_id}: {reply.get('error')}")
    if failures:
        warnings.warn(
            "Could not forget every test identity; the box's secret store "
            "still holds them. If the error is unknown_command, the HA "
            "instance is running an integration build without "
            "wrist_assistant/devices/forget. Deploy this branch and re-run. "
            + "; ".join(failures),
            stacklevel=1,
        )


@pytest.fixture(scope="session")
def _provisioned_ids(base_url: str, token: str) -> Iterator[list[str]]:
    """Ids registered during this session, forgotten when it ends.

    Session-scoped so one websocket connection cleans up the whole run. The
    list is appended to by ``register_secret``; nothing else should touch it.
    """
    ids: list[str] = []
    yield ids
    if ids:
        _forget_devices(base_url, token, ids)


@pytest.fixture
def register_secret(
    base_url: str, session: requests.Session, _provisioned_ids: list[str]
) -> Callable[..., bytes]:
    """Register an ephemeral HMAC identity and return its secret bytes.

    The single door onto /v2/register_secret for the whole suite. Registering
    by hand is what left 120 abandoned ``iphone:test-*`` / ``watch-*`` entries
    on the dev box, where the panel's watch picker then offered every one of
    them as a real device.

    ``label`` should name the test that owns the entry, which is what a human
    reading the store or HA's log sees. Extra keyword arguments go straight
    into the payload, so a test that needs ``owner_iphone_id`` or an initial
    ``app_version`` passes it here.
    """

    def _register(watch_id: str, *, label: str = "pytest", **extra: object) -> bytes:
        secret_bytes = secrets.token_bytes(32)
        payload: dict[str, object] = {
            "watch_id": watch_id,
            "secret_b64": base64.b64encode(secret_bytes).decode("ascii"),
            "label": label,
            "algo": "hmac-sha256",
        }
        payload.update(extra)
        r = session.post(
            f"{base_url}/api/wrist_assistant/v2/register_secret",
            json=payload,
            timeout=10,
        )
        assert r.status_code == 200, r.text
        # Recorded after the assert: an id HA rejected was never stored, and
        # asking to forget it at teardown would just be a noisy not_found.
        # Re-registering the same id is a rekey, not a second entry, so it is
        # recorded once however many times a test provisions it.
        if watch_id not in _provisioned_ids:
            _provisioned_ids.append(watch_id)
        return secret_bytes

    return _register


@pytest.fixture(scope="session", autouse=True)
def _verify_ha_reachable() -> None:
    """Fail fast with a clear message if HA isn't reachable or the token is wrong.

    This runs once per test session before any test, so a misconfigured HA_URL
    or expired token surfaces as a single explanatory error instead of N
    cryptic per-test failures.

    Reads the env directly rather than depending on the base_url/token fixtures
    so it can no-op when HA isn't configured — pure-unit tests (e.g.
    test_camera_stream.py) must run in CI without HA_URL/HA_TOKEN set. The HTTP
    tests still skip individually via their base_url/token fixtures when the env
    is absent, so this only short-circuits the reachability probe, not them.
    """
    url = os.environ.get("HA_URL")
    tok = os.environ.get("HA_TOKEN")
    if not url or not tok:
        return
    base = url.rstrip("/")
    try:
        r = requests.get(
            f"{base}/api/",
            headers={"Authorization": f"Bearer {tok}"},
            timeout=10,
        )
    except requests.RequestException as err:
        pytest.exit(f"Cannot reach HA at {base}/api/: {err}", returncode=2)
    if r.status_code != 200:
        pytest.exit(
            f"HA at {base}/api/ returned HTTP {r.status_code} "
            "(check HA_URL, HA_TOKEN, and that HA is running)",
            returncode=2,
        )
