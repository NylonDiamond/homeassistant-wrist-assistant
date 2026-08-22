"""Regression test: a superseded long-poll must not blind its successor.

`DeltaCoordinator.handle_poll` keeps one waiter event per watch_id in
`self._waiters`. Pre-fix, the `finally` block popped that entry
unconditionally. So when an OLD poll for a watch finished (timed out, or was
cancelled by a dropped connection) AFTER a NEW poll for the same watch had
already installed its own waiter, the old poll's cleanup evicted the new
poll's waiter. `_wake_watchers_for_entity` then found nothing to wake, and the
live poll slept until MAX_TIMEOUT_SECONDS (55 s) with stale tiles.

Real-world trigger: a network handoff (Wi-Fi to cellular) or proxied remote
access leaves the previous request half-open on the server while the watch
already opened the next one.

Sequence here:
  A: poll with a 3 s server timeout.
  B: 1 s later, poll with a 30 s server timeout, same watch_id.
  A ends at t=3 s (204). Pre-fix this pops B's waiter.
  t=4 s: fire a state change for the subscribed entity.
  B must return within a couple of seconds carrying that event. Pre-fix B
  only returns at its 30 s timeout, empty.

Uses the v1 bearer-authed endpoint like test_delta_regression.py, since it
needs no HMAC provisioning. Same caveat as that file: most reliable when no
other watch session is live, though this particular race is per-watch_id so
another watch does not mask it.
"""

from __future__ import annotations

import threading
import time
import uuid

import requests

_TEST_WATCH_ID = "__pytest_wa_waiter_race__"


def _set_state(base_url: str, token: str, entity_id: str, state: str) -> None:
    r = requests.post(
        f"{base_url}/api/states/{entity_id}",
        json={"state": state},
        headers={"Authorization": f"Bearer {token}"},
        timeout=5,
    )
    assert r.status_code in (200, 201), r.text


def _delete_state(base_url: str, token: str, entity_id: str) -> None:
    requests.delete(
        f"{base_url}/api/states/{entity_id}",
        headers={"Authorization": f"Bearer {token}"},
        timeout=5,
    )


def test_superseded_poll_does_not_blind_successor(
    base_url: str, token: str, session: requests.Session
) -> None:
    test_entity = f"wrist_assistant.test_pytest_{uuid.uuid4().hex[:8]}"
    _set_state(base_url, token, test_entity, "off")
    try:
        r1 = session.post(
            f"{base_url}/api/watch/updates",
            json={
                "watch_id": _TEST_WATCH_ID,
                "config_hash": "x",
                "timeout": 1,
                "entities": [test_entity],
            },
            timeout=15,
        )
        assert r1.status_code == 200, r1.text
        cursor = r1.json().get("next_cursor")
        assert cursor is not None, r1.json()

        def _poll(server_timeout: int, out: dict) -> None:
            started = time.monotonic()
            try:
                r = requests.post(
                    f"{base_url}/api/watch/updates",
                    json={
                        "watch_id": _TEST_WATCH_ID,
                        "config_hash": "x",
                        "timeout": server_timeout,
                        "entities": [test_entity],
                        "since": cursor,
                    },
                    headers={"Authorization": f"Bearer {token}"},
                    timeout=server_timeout + 10,
                )
                out["status"] = r.status_code
                out["body"] = r.json() if r.status_code == 200 else None
            except requests.exceptions.RequestException as err:  # pragma: no cover
                out["error"] = repr(err)
            out["elapsed"] = time.monotonic() - started

        a_out: dict = {}
        b_out: dict = {}
        a = threading.Thread(target=_poll, args=(3, a_out), daemon=True)
        b = threading.Thread(target=_poll, args=(30, b_out), daemon=True)

        a.start()
        time.sleep(1.0)
        b.start()
        # A times out at ~3 s from its start. Wait past that so its cleanup
        # has definitely run before we fire the change.
        time.sleep(3.0)
        _set_state(base_url, token, test_entity, "on")

        b.join(timeout=40)
        assert not b.is_alive(), "poll B never returned"
        assert "error" not in b_out, b_out
        assert b_out.get("elapsed", 99) < 10, (
            "poll B slept to its full timeout: its waiter was evicted by the "
            f"superseded poll A's cleanup (regression). B: {b_out!r}"
        )
        assert b_out.get("status") == 200, b_out
        entity_ids = {e.get("entity_id") for e in b_out["body"].get("events", [])}
        assert test_entity in entity_ids, b_out
    finally:
        _delete_state(base_url, token, test_entity)
