"""Live tests for /v2/action op=complications_create.

The iPhone's one-time preset transfer signs with the watch's HMAC pair and
posts converted documents here. Unlike ``complications_restore`` this must
coexist with records the panel already authored: per-document results, an
idempotent retry story (stable document ids answer "exists"), and slot
conflicts checked against live records only, never the preset report.

Run from the repo root against a dev HA running this integration version:

    HA_URL=https://homeassistant.local:8123 HA_TOKEN=<long-lived> \\
        pytest -v tests/test_complications_create_live.py

Each test registers a fresh ephemeral secret under a randomized
``iphone:test-*`` watch_id (forgotten at session end by the conftest
fixture) and deletes the complication records it created, because
``devices/forget`` leaves complication rows behind.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import secrets
import time
import uuid
from collections.abc import Callable, Iterator
from typing import Any

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
    base_url: str, secret: bytes, watch_id: str, op: str, payload: dict[str, Any]
) -> requests.Response:
    body = json.dumps(payload).encode("utf-8")
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


def _document(cid: str, name: str = "Transferred", slot: int = 0) -> dict[str, Any]:
    """The smallest document the store accepts, shaped like a transfer's."""
    return {
        "schemaVersion": 5 if slot > 7 else 4,
        "id": cid,
        "name": name,
        "values": [],
        "elements": [{"kind": "text"}],
        "slotIndex": slot,
        "supportedFamilies": ["rectangular", "circular", "corner"],
        "perFamily": {},
        "dataSources": [],
        "refreshMinutes": 15,
        "tapAction": {"type": "refresh"},
    }


def _cid() -> str:
    return str(uuid.uuid4()).upper()


def _ws_admin_commands(
    base_url: str, token: str, commands: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """Run admin websocket commands (used for delete and cleanup)."""
    from websockets.sync.client import connect

    ws_url = (
        base_url.replace("https://", "wss://").replace("http://", "ws://")
        + "/api/websocket"
    )
    replies: list[dict[str, Any]] = []
    with connect(ws_url, open_timeout=15) as ws:
        ws.recv()  # auth_required
        ws.send(json.dumps({"type": "auth", "access_token": token}))
        if json.loads(ws.recv()).get("type") != "auth_ok":
            raise AssertionError("websocket auth failed")
        for msg_id, command in enumerate(commands, start=1):
            ws.send(json.dumps({"id": msg_id, **command}))
            while True:
                reply = json.loads(ws.recv(timeout=15))
                if reply.get("id") == msg_id and reply.get("type") == "result":
                    replies.append(reply)
                    break
    return replies


def _delete_all_records(base_url: str, token: str, owner: str) -> None:
    listed = _ws_admin_commands(
        base_url,
        token,
        [{"type": "wrist_assistant/complications/list", "owner_watch_id": owner}],
    )[0]
    records = (listed.get("result") or {}).get("records") or []
    commands = [
        {
            "type": "wrist_assistant/complications/delete",
            "owner_watch_id": owner,
            "complication_id": r["id"],
            "base_revision": r["revision"],
        }
        for r in records
        if not r.get("deleted")
    ]
    if commands:
        _ws_admin_commands(base_url, token, commands)


@pytest.fixture
def owner(
    base_url: str,
    token: str,
    register_secret: Callable[..., bytes],
) -> Iterator[tuple[str, bytes]]:
    watch_id = f"iphone:test-{secrets.token_hex(8)}"
    secret = register_secret(watch_id, label="pytest complications_create")
    yield watch_id, secret
    _delete_all_records(base_url, token, watch_id)


def _create(
    base_url: str, owner: tuple[str, bytes], documents: list[dict[str, Any]]
) -> requests.Response:
    watch_id, secret = owner
    return _post_op(
        base_url, secret, watch_id, "complications_create", {"documents": documents}
    )


def _sync_records(base_url: str, owner: tuple[str, bytes]) -> list[dict[str, Any]]:
    watch_id, secret = owner
    r = _post_op(base_url, secret, watch_id, "complications_sync", {"since_token": 0})
    assert r.status_code == 200, r.text
    return [rec for rec in r.json()["records"] if not rec["deleted"]]


def test_create_then_sync_sees_them(base_url: str, owner: tuple[str, bytes]) -> None:
    watch_id, secret = owner
    docs = [_document(_cid(), "Low", 0), _document(_cid(), "High", 9)]
    r = _create(base_url, owner, docs)
    assert r.status_code == 200, r.text

    # The reply is signed with our key.
    assert _verify_response(
        secret,
        "complications_create",
        watch_id,
        int(r.headers["X-WA-Ts"]),
        r.content,
        r.headers["X-WA-Sig"],
    )

    payload = r.json()
    assert payload["ok"] is True
    assert [row["status"] for row in payload["results"]] == ["created", "created"]
    assert [row["slotIndex"] for row in payload["results"]] == [0, 9]

    records = _sync_records(base_url, owner)
    assert {rec["document"]["slotIndex"] for rec in records} == {0, 9}
    assert all(rec["updatedBy"] == f"app-import:{watch_id}" for rec in records)


def test_retry_is_idempotent(base_url: str, owner: tuple[str, bytes]) -> None:
    docs = [_document(_cid(), "Once", 1)]
    first = _create(base_url, owner, docs)
    assert first.status_code == 200, first.text
    assert first.json()["results"][0]["status"] == "created"

    second = _create(base_url, owner, docs)
    assert second.status_code == 200, second.text
    assert second.json()["results"][0]["status"] == "exists"
    # Nothing new was written: the owner token did not advance.
    assert second.json()["token"] == first.json()["token"]
    assert len(_sync_records(base_url, owner)) == 1


def test_slot_conflict_skips_only_that_document(
    base_url: str, owner: tuple[str, bytes]
) -> None:
    r = _create(base_url, owner, [_document(_cid(), "Holder", 3)])
    assert r.status_code == 200, r.text

    conflicted = _document(_cid(), "Loser", 3)
    sibling = _document(_cid(), "Winner", 4)
    r = _create(base_url, owner, [conflicted, sibling])
    assert r.status_code == 200, r.text
    statuses = {row["id"]: row["status"] for row in r.json()["results"]}
    assert statuses[conflicted["id"]] == "slot_conflict"
    assert statuses[sibling["id"]] == "created"
    assert len(_sync_records(base_url, owner)) == 2


def test_preset_slots_do_not_block_create(
    base_url: str, owner: tuple[str, bytes]
) -> None:
    """At transfer time the handed-over presets are still in the report, so
    the create op must ignore preset slots entirely."""
    watch_id, secret = owner
    r = _post_op(
        base_url,
        secret,
        watch_id,
        "complications_sync",
        {"since_token": 0, "presets": [{"slot": 5, "name": "Being transferred"}]},
    )
    assert r.status_code == 200, r.text

    r = _create(base_url, owner, [_document(_cid(), "Takeover", 5)])
    assert r.status_code == 200, r.text
    assert r.json()["results"][0]["status"] == "created"


def test_page_report_is_accepted_on_sync(
    base_url: str, owner: tuple[str, bytes]
) -> None:
    """The watch's page report rides the same sync op. A deployed server
    without set_pages would 500 here; junk entries must not break the sync."""
    watch_id, secret = owner
    r = _post_op(
        base_url,
        secret,
        watch_id,
        "complications_sync",
        {
            "since_token": 0,
            "pages": [
                {"id": "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE", "name": "Upstairs"},
                {"id": "not-a-uuid", "name": "junk drops"},
            ],
        },
    )
    assert r.status_code == 200, r.text
    # An empty report clears it again so the test watch leaves nothing behind.
    r = _post_op(
        base_url, secret, watch_id, "complications_sync",
        {"since_token": 0, "pages": []},
    )
    assert r.status_code == 200, r.text


def test_structural_failure_writes_nothing(
    base_url: str, owner: tuple[str, bytes]
) -> None:
    good = _document(_cid(), "Good", 0)
    bad = _document(_cid(), "Bad", 1)
    del bad["schemaVersion"]
    r = _create(base_url, owner, [good, bad])
    assert r.status_code == 400, r.text
    assert r.json()["ok"] is False
    # The good sibling was not created either.
    assert _sync_records(base_url, owner) == []


def test_high_slot_requires_schema_five(
    base_url: str, owner: tuple[str, bytes]
) -> None:
    doc = _document(_cid(), "High", 9)
    doc["schemaVersion"] = 4
    r = _create(base_url, owner, [doc])
    assert r.status_code == 400, r.text
    assert "schemaVersion 5" in r.json()["message"]


def test_duplicate_slot_in_batch_rejects_whole_batch(
    base_url: str, owner: tuple[str, bytes]
) -> None:
    r = _create(
        base_url,
        owner,
        [_document(_cid(), "A", 2), _document(_cid(), "B", 2)],
    )
    assert r.status_code == 400, r.text
    assert "duplicate slotIndex" in r.json()["message"]
    assert _sync_records(base_url, owner) == []


def test_tombstoned_id_is_not_revived(
    base_url: str, token: str, owner: tuple[str, bytes]
) -> None:
    watch_id, _ = owner
    doc = _document(_cid(), "Doomed", 6)
    r = _create(base_url, owner, [doc])
    assert r.status_code == 200, r.text

    record = _sync_records(base_url, owner)[0]
    _ws_admin_commands(
        base_url,
        token,
        [
            {
                "type": "wrist_assistant/complications/delete",
                "owner_watch_id": watch_id,
                "complication_id": record["id"],
                "base_revision": record["revision"],
            }
        ],
    )

    r = _create(base_url, owner, [doc])
    assert r.status_code == 200, r.text
    row = r.json()["results"][0]
    assert row["status"] == "error"
    assert "deleted" in row["message"]
    assert _sync_records(base_url, owner) == []


def _post_delta(
    base_url: str, secret: bytes, watch_id: str, payload: dict[str, Any]
) -> requests.Response:
    """A signed /v2/delta poll. The op in the canonical string is fixed to
    "delta" on both sides."""
    body = json.dumps(payload).encode("utf-8")
    ts = int(time.time())
    nonce = secrets.token_hex(16)
    sig = _sign_request(secret, "delta", watch_id, ts, nonce, body)
    return requests.post(
        f"{base_url}/api/wrist_assistant/v2/delta",
        data=body,
        headers={
            "Content-Type": "application/json",
            "X-WA-Version": str(WA_PROTOCOL_VERSION),
            "X-WA-Op": "delta",
            "X-WA-Watch": watch_id,
            "X-WA-Ts": str(ts),
            "X-WA-Nonce": nonce,
            "X-WA-Sig": sig,
        },
        timeout=15,
    )


def _listing(base_url: str, token: str, watch_id: str) -> dict[str, Any]:
    return _ws_admin_commands(
        base_url,
        token,
        [{"type": "wrist_assistant/complications/list", "owner_watch_id": watch_id}],
    )[0]["result"]


def test_occupied_report_replaces_presets_and_lists_by_kind(
    base_url: str, token: str, owner: tuple[str, bytes]
) -> None:
    """A newer app reports the whole slot pool: presets from every home plus
    customs on other homes. The panel gets it as `occupied`, and `presets`
    is derived from it so an older panel still works."""
    watch_id, secret = owner
    r = _post_op(
        base_url,
        secret,
        watch_id,
        "complications_sync",
        {
            "since_token": 0,
            "occupied": [
                {"slot": 9, "name": "Comp 1", "kind": "custom", "home": "Cabin"},
                {"slot": 2, "name": "Lamp", "kind": "preset", "home": "Home"},
            ],
        },
    )
    assert r.status_code == 200, r.text
    listed = _listing(base_url, token, watch_id)
    assert listed["occupied"] == [
        {"slot": 2, "name": "Lamp", "kind": "preset", "home": "Home"},
        {"slot": 9, "name": "Comp 1", "kind": "custom", "home": "Cabin"},
    ]
    assert listed["presets"] == [{"slot": 2, "name": "Lamp"}]

    # A create onto the other home's slot is refused by nothing here (the
    # server only checks its own records), which is what the panel's
    # assigner is for; but a bare preset report from an older build drops
    # the occupied list again.
    r = _post_op(
        base_url, secret, watch_id, "complications_sync",
        {"since_token": 0, "presets": [{"slot": 3, "name": "Garage"}]},
    )
    assert r.status_code == 200, r.text
    listed = _listing(base_url, token, watch_id)
    assert listed["occupied"] == [{"slot": 3, "name": "Garage", "kind": "preset", "home": ""}]

    # Clear so the test watch leaves nothing behind.
    r = _post_op(
        base_url, secret, watch_id, "complications_sync", {"since_token": 0, "occupied": []}
    )
    assert r.status_code == 200, r.text
    assert _listing(base_url, token, watch_id)["occupied"] == []


def test_poll_carries_the_token_and_the_ack_turns_green(
    base_url: str, token: str, owner: tuple[str, bytes]
) -> None:
    """The store token rides every delta reply; the watch's applied token on
    the request is its ack; a behind watch gets an empty reply at once."""
    watch_id, secret = owner

    # Nothing saved: token 0, and a snapshot poll says so.
    r = _post_delta(
        base_url, secret, watch_id,
        {"config_hash": "x", "timeout": 1, "entities": [], "complications_token": 0},
    )
    assert r.status_code == 200, r.text
    assert r.json()["complications_token"] == 0
    cursor = r.json()["next_cursor"]

    # A create bumps the token. The watch, still at 0, polls: it must not
    # park for the full timeout, and the reply must carry the new token.
    r = _create(base_url, owner, [_document(_cid(), "Sent", 1)])
    assert r.status_code == 200, r.text
    started = time.monotonic()
    r = _post_delta(
        base_url, secret, watch_id,
        {"config_hash": "x", "timeout": 10, "since": cursor, "entities": [], "complications_token": 0},
    )
    assert r.status_code == 200, r.text
    assert time.monotonic() - started < 3, "behind watch parked instead of being told"
    new_token = r.json()["complications_token"]
    assert new_token > 0
    assert r.json()["events"] == []

    listed = _listing(base_url, token, watch_id)
    assert listed["token"] == new_token
    assert listed["applied_token"] == 0
    assert listed["polling"] is True

    # The watch applies it and says so on its next poll (a probe is enough).
    r = _post_delta(
        base_url, secret, watch_id,
        {"config_hash": "x", "timeout": 0, "since": cursor, "entities": [], "complications_token": new_token},
    )
    assert r.status_code in (200, 204), r.text
    listed = _listing(base_url, token, watch_id)
    assert listed["applied_token"] == new_token

    # The panel's nudge is harmless on a current watch.
    reply = _ws_admin_commands(
        base_url, token,
        [{"type": "wrist_assistant/complications/nudge", "owner_watch_id": watch_id}],
    )[0]
    assert reply["success"], reply
    assert reply["result"]["applied_token"] == new_token
