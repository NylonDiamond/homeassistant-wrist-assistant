"""Smoke tests for the legacy v1 watch endpoints.

These bearer-authed endpoints live in `v1_*.py` inside the integration and
are kept alive for app builds prior to the v2 transport cutover. If any
of these fails, the bridge release is broken for users still on the
App Store v1 build.

For endpoints that need entity-specific data (camera entity_id, MA queue_id)
we test the negative path — invalid input → expected error code. That
verifies the endpoint exists and parses input without depending on what
HA happens to have configured.
"""

from __future__ import annotations

import requests


# ---------------------------------------------------------------------------
# /api/wrist_assistant/summary  (WatchSummaryView)
# ---------------------------------------------------------------------------

def test_v1_summary_returns_info_summary_and_capabilities(
    base_url: str, session: requests.Session
) -> None:
    r = session.post(
        f"{base_url}/api/wrist_assistant/summary",
        json={"include_details": False},
        timeout=10,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert "info_summary" in body
    assert "capabilities" in body
    # Confirms the v2 transport is also registered alongside v1 — the bridge
    # release should advertise watch_hmac_v2.
    assert "watch_hmac_v2" in body["capabilities"]


# ---------------------------------------------------------------------------
# /api/wrist_assistant/states_batch  (WatchStatesBatchView)
# ---------------------------------------------------------------------------

def test_v1_states_batch_returns_requested_entity(
    base_url: str, session: requests.Session
) -> None:
    """sun.sun is universal in HA, so we use it as a stable probe entity."""
    r = session.post(
        f"{base_url}/api/wrist_assistant/states_batch",
        json={"custom_entity_ids": ["sun.sun"]},
        timeout=10,
    )
    assert r.status_code == 200, r.text
    states = r.json()["states"]
    assert any(s["entity_id"] == "sun.sun" for s in states)


# ---------------------------------------------------------------------------
# /api/watch/updates  (WatchUpdatesView — v1 long-poll)
# ---------------------------------------------------------------------------

def test_v1_long_poll_returns_payload_or_204(
    base_url: str, session: requests.Session
) -> None:
    """Short timeout so the test doesn't hang. 200 (payload) or 204 (no events) both healthy."""
    r = session.post(
        f"{base_url}/api/watch/updates",
        json={
            "watch_id": "pytest-bridge-test",
            "config_hash": "x",
            "timeout": 5,
        },
        timeout=15,
    )
    assert r.status_code in (200, 204), f"got {r.status_code}: {r.text}"


def test_v1_long_poll_rejects_unauthenticated(base_url: str) -> None:
    """Confirms requires_auth is wired on v1 views."""
    r = requests.post(
        f"{base_url}/api/watch/updates",
        json={"watch_id": "x", "config_hash": "x", "timeout": 1},
        timeout=10,
    )
    assert r.status_code == 401


# ---------------------------------------------------------------------------
# /api/wrist_assistant/camera/*  (CameraStream/Viewport/Batch/Snapshot/Devices)
# ---------------------------------------------------------------------------

def test_v1_camera_devices_returns_array(
    base_url: str, session: requests.Session
) -> None:
    r = session.get(f"{base_url}/api/wrist_assistant/camera/devices", timeout=10)
    assert r.status_code == 200, r.text
    assert "devices" in r.json()


def test_v1_camera_snapshot_rejects_missing_entity(
    base_url: str, session: requests.Session
) -> None:
    """Missing entity_id → 400. Proves endpoint exists and parses input."""
    r = session.get(f"{base_url}/api/wrist_assistant/camera/snapshot", timeout=10)
    assert r.status_code == 400


def test_v1_camera_stream_rejects_invalid_entity(
    base_url: str, session: requests.Session
) -> None:
    """Non-camera entity_id → view returns 404 with its own error text.

    A blanket 404 status check would false-pass when the route itself is
    unregistered (HA's generic 404), so we also assert the response body
    matches what only the v1 view returns.
    """
    r = session.get(
        f"{base_url}/api/wrist_assistant/camera/stream/sensor.notacamera",
        timeout=10,
    )
    assert r.status_code == 404
    assert "Invalid camera entity" in r.text, (
        f"Got generic 404 — route likely unregistered. Body: {r.text!r}"
    )


def test_v1_camera_viewport_rejects_no_active_session(
    base_url: str, session: requests.Session
) -> None:
    """No active stream for this watch_id+entity_id → 404 with view-specific JSON.

    Body check distinguishes the view's own "no active stream" 404 from
    HA's generic route-not-found 404.
    """
    r = session.post(
        f"{base_url}/api/wrist_assistant/camera/viewport",
        json={
            "entity_id": "camera.fake",
            "watch_id": "pytest",
            "x": 0.0,
            "y": 0.0,
            "w": 1.0,
            "h": 1.0,
        },
        timeout=10,
    )
    assert r.status_code == 404
    assert "No active stream" in r.text, (
        f"Got generic 404 — route likely unregistered. Body: {r.text!r}"
    )


def test_v1_camera_batch_rejects_empty_array(
    base_url: str, session: requests.Session
) -> None:
    r = session.post(
        f"{base_url}/api/wrist_assistant/camera/batch",
        json={"cameras": []},
        timeout=10,
    )
    assert r.status_code == 400


# ---------------------------------------------------------------------------
# /api/wrist_assistant/mass/*  (MusicAssistantPlayers/Queue)
# ---------------------------------------------------------------------------

def test_v1_mass_players_returns_availability(
    base_url: str, session: requests.Session
) -> None:
    """Works regardless of whether Music Assistant is installed in HA."""
    r = session.get(f"{base_url}/api/wrist_assistant/mass/players", timeout=10)
    assert r.status_code == 200, r.text
    body = r.json()
    assert "available" in body
    assert "players" in body


def test_v1_mass_queue_rejects_missing_queue_id(
    base_url: str, session: requests.Session
) -> None:
    r = session.get(f"{base_url}/api/wrist_assistant/mass/queue", timeout=10)
    assert r.status_code == 200
    assert r.json()["available"] is False


# ---------------------------------------------------------------------------
# /api/wrist_assistant/notifications/register  (NotificationRegisterView)
# ---------------------------------------------------------------------------

def test_v1_notifications_register_validates_input(
    base_url: str, session: requests.Session
) -> None:
    """Missing watch_id → 400. Negative test avoids leaving a fake APNs token in HA storage."""
    r = session.post(
        f"{base_url}/api/wrist_assistant/notifications/register",
        json={"device_token": "test"},
        timeout=10,
    )
    assert r.status_code == 400


# ---------------------------------------------------------------------------
# /api/wrist_assistant/audio/upload  (AudioUploadView)
# ---------------------------------------------------------------------------

def test_v1_audio_upload_rejects_empty_body(
    base_url: str, session: requests.Session
) -> None:
    """Empty body → 400. Proves endpoint exists without leaving a /config/www artifact."""
    r = session.post(
        f"{base_url}/api/wrist_assistant/audio/upload",
        data=b"",
        timeout=10,
    )
    assert r.status_code == 400


# ---------------------------------------------------------------------------
# /api/watch/remote_command  (RemoteCommandView)
# ---------------------------------------------------------------------------

def test_v1_remote_command_hold_stop_is_safe_noop(
    base_url: str, session: requests.Session
) -> None:
    """hold_stop with no active hold is a no-op — safe to test against any HA."""
    r = session.post(
        f"{base_url}/api/watch/remote_command",
        json={"entity_id": "remote.notreal", "action": "hold_stop"},
        timeout=10,
    )
    assert r.status_code == 200
    assert r.json()["ok"] is True
