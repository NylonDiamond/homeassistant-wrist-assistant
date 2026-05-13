"""Regression tests for two bugs surfaced during a stale-tile investigation:

1. State changes fired while a watch was briefly disconnected (e.g. app
   backgrounded for 5 seconds) were not buffered, because the long-poll's
   asyncio.CancelledError handler popped the session — and the
   _handle_state_changed early-return then dropped every subsequent event
   when no sessions remained.

2. Subscribed template values rendered to the Python repr of a bound method
   (`<bound method RenderInfo.result of ...>`) instead of the actual
   templated string, because the code did `str(info.result)` instead of
   calling `info.result()`.

Both bugs route through coordinator.handle_poll, which is shared by v1 and
v2 endpoints. We exercise the v1 bearer-authed endpoint here because it
doesn't require HMAC provisioning.
"""

from __future__ import annotations

import time
import uuid

import requests


# ---------------------------------------------------------------------------
# Bug #2: template result is a method, not a value
# ---------------------------------------------------------------------------

def test_template_subscription_renders_to_value_not_bound_method(
    base_url: str, session: requests.Session
) -> None:
    """The first poll (since=null) goes through the snapshot path, which calls
    _snapshot_templates → _render_template_tracked. Pre-fix the rendered
    `lines` came back as the bound-method repr; the fix calls info.result().
    """
    tile_id = f"pytest_template_{uuid.uuid4().hex[:8]}"
    watch_id = f"pytest-template-{uuid.uuid4().hex[:8]}"

    r = session.post(
        f"{base_url}/api/watch/updates",
        json={
            "watch_id": watch_id,
            "config_hash": "x",
            "timeout": 1,
            "entities": [],
            "templates": {tile_id: "{{ 1 + 1 }}"},
        },
        timeout=15,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    events = body.get("events", [])

    template_events = [
        e for e in events if e.get("entity_id") == f"template.{tile_id}"
    ]
    assert template_events, f"no template event in response; got events: {events!r}"

    lines = template_events[0].get("lines", [])
    # Pre-fix signature was a single line starting with "<bound method"
    assert all("bound method" not in line for line in lines), (
        f"template rendered to bound-method repr (regression): {lines!r}"
    )
    assert lines == ["2"], f"expected ['2'], got {lines!r}"


# ---------------------------------------------------------------------------
# Bug #1: state changes during client disconnect are dropped
# ---------------------------------------------------------------------------

def _set_state(base_url: str, token: str, entity_id: str, state: str) -> None:
    """Fire a state_changed event by setting an entity's state via HA's REST API."""
    r = requests.post(
        f"{base_url}/api/states/{entity_id}",
        json={"state": state},
        headers={"Authorization": f"Bearer {token}"},
        timeout=5,
    )
    # 200 = updated, 201 = created — both fire state_changed.
    assert r.status_code in (200, 201), r.text


def _delete_state(base_url: str, token: str, entity_id: str) -> None:
    requests.delete(
        f"{base_url}/api/states/{entity_id}",
        headers={"Authorization": f"Bearer {token}"},
        timeout=5,
    )


def test_state_change_during_client_disconnect_is_buffered(
    base_url: str, token: str, session: requests.Session
) -> None:
    """Simulate the foreground→background→foreground cycle:
       1. Subscribe to a unique test entity, capture cursor.
       2. Open a long-poll and drop the connection client-side (mimics
          the watch backgrounding mid-poll → asyncio.CancelledError server-side).
       3. Fire a state_changed for the subscribed entity while "backgrounded".
       4. Reconnect with the original cursor; the event MUST be replayed.

    Pre-fix: step 2's CancelledError popped the session. With no remaining
    sessions, step 3's state_changed hit `if not self._sessions: return`
    and was never appended to the ring buffer. Step 4 came back with
    next_cursor == since and an empty events list — exactly the stale-tile
    symptom the user reported.

    Caveat: this test is most reliable when the dev HA has no other active
    watch sessions concurrently. With another watch live, _sessions stays
    non-empty regardless of this watch's disconnect, and the bug is masked.
    """
    test_entity = f"wrist_assistant.test_pytest_{uuid.uuid4().hex[:8]}"
    watch_id = f"pytest-disconnect-{uuid.uuid4().hex[:8]}"

    # Seed initial state so the entity exists for the subscription
    _set_state(base_url, token, test_entity, "off")
    try:
        # 1. Subscribe + get a cursor. since=null routes to the snapshot path
        #    which returns next_cursor=current _cursor.
        r1 = session.post(
            f"{base_url}/api/watch/updates",
            json={
                "watch_id": watch_id,
                "config_hash": "x",
                "timeout": 1,
                "entities": [test_entity],
            },
            timeout=15,
        )
        assert r1.status_code == 200, r1.text
        cursor = r1.json().get("next_cursor")
        assert cursor is not None, f"no next_cursor in response: {r1.json()!r}"

        # 2. Open a long-poll then drop the connection client-side. The
        #    short read-timeout forces requests to close the socket while
        #    the server is still awaiting events → CancelledError on the
        #    handler → pre-fix would pop the session here.
        try:
            session.post(
                f"{base_url}/api/watch/updates",
                json={
                    "watch_id": watch_id,
                    "config_hash": "x",
                    "timeout": 30,
                    "entities": [test_entity],
                    "since": cursor,
                },
                timeout=0.5,
            )
        except requests.exceptions.RequestException:
            pass  # expected — client-side disconnect

        # Give the server a moment to process the CancelledError before
        # we fire the state change.
        time.sleep(0.2)

        # 3. Fire the state change while we're "backgrounded".
        _set_state(base_url, token, test_entity, "on")

        # 4. Reconnect with the original cursor. force_delta=true makes the
        #    response return immediately without waiting for further events.
        r3 = session.post(
            f"{base_url}/api/watch/updates",
            json={
                "watch_id": watch_id,
                "config_hash": "x",
                "timeout": 5,
                "entities": [test_entity],
                "since": cursor,
                "force_delta": True,
            },
            timeout=15,
        )
        assert r3.status_code == 200, r3.text
        body = r3.json()
        events = body.get("events", [])
        next_cursor = body.get("next_cursor")

        assert next_cursor is not None and next_cursor > cursor, (
            f"cursor did not advance — server dropped the event during disconnect. "
            f"since={cursor}, next_cursor={next_cursor}"
        )
        entity_ids = {e.get("entity_id") for e in events}
        assert test_entity in entity_ids, (
            f"state_changed for {test_entity} was not buffered during disconnect; "
            f"got events for: {entity_ids!r}"
        )
    finally:
        _delete_state(base_url, token, test_entity)
