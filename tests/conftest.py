"""Pytest fixtures for the Wrist Assistant integration HTTP test suite.

Run from the repo root:

    HA_URL=http://homeassistant.local:8123 HA_TOKEN=<long-lived> pytest -v tests/

Set HA_URL to the base URL of your dev Home Assistant instance and HA_TOKEN
to a long-lived access token. The suite hits the integration's HTTP surface
directly — both the v2 endpoints and the legacy v1 endpoints kept alive for
v1 watch app builds.
"""

from __future__ import annotations

import os

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
