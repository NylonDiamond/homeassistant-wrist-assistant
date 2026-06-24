"""v2 unauthenticated probe — what the iOS app reads for the 'update integration' banner."""

from __future__ import annotations

import requests


def test_version_endpoint_unauthenticated(base_url: str) -> None:
    """The version probe is unauthenticated and returns the wire-protocol metadata.

    The iOS app reads this before any HMAC signing is wired up. If this 404s,
    the v2 routes were not registered and the integration is broken.
    """
    r = requests.get(f"{base_url}/api/wrist_assistant/version", timeout=10)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["wa_protocol_version"] == 2
    assert "integration_version" in body
    assert "min_supported_app_protocol_version" in body


def test_version_endpoint_exposes_instance_id(base_url: str) -> None:
    """The probe carries this HA install's stable instance UUID.

    This is the matching key a multi-instance app uses to bind a push (stamped
    with the same UUID on its `data` dict) back to the right local instance —
    same `instance_id.async_get(hass)` source on both sides. A real HA always
    has an instance id, so the field is present and non-empty here.
    """
    r = requests.get(f"{base_url}/api/wrist_assistant/version", timeout=10)
    assert r.status_code == 200, r.text
    body = r.json()
    assert "instance_id" in body, "version probe must expose instance_id"
    assert isinstance(body["instance_id"], str) and body["instance_id"], body
