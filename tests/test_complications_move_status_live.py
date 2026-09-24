"""Live tests for /v2/action op=complications_move_status.

The iPhone's preset move signs with the watch's pair and reads this before
and after every ``complications_create``: which derived ids are live or
tombstoned, and the token the watch has applied. The app deletes a moved
preset only when ``applied_token`` has reached the token its create
returned, so the op must answer those two truthfully and must change
nothing on the server while doing so.

Run from the repo root against a dev HA running this integration version:

    HA_URL=https://homeassistant.local:8123 HA_TOKEN=<long-lived> \\
        pytest -v tests/test_complications_move_status_live.py

Each test registers a fresh ephemeral secret (forgotten at session end by
the conftest fixture) and deletes the records it created.
"""

from __future__ import annotations

from collections.abc import Callable, Iterator
import secrets
from typing import Any

import pytest
import requests

from test_complications_create_live import (
    _cid,
    _create,
    _delete_all_records,
    _document,
    _post_op,
    _verify_response,
    _ws_admin_commands,
)

OP = "complications_move_status"


@pytest.fixture
def owner(
    base_url: str,
    token: str,
    register_secret: Callable[..., bytes],
) -> Iterator[tuple[str, bytes]]:
    watch_id = f"iphone:test-{secrets.token_hex(8)}"
    secret = register_secret(watch_id, label="pytest complications_move_status")
    yield watch_id, secret
    _delete_all_records(base_url, token, watch_id)


def _status(base_url: str, owner: tuple[str, bytes]) -> requests.Response:
    watch_id, secret = owner
    return _post_op(base_url, secret, watch_id, OP, {})


def _watch_status(base_url: str, token: str, watch_id: str) -> dict[str, Any]:
    reply = _ws_admin_commands(
        base_url,
        token,
        [
            {
                "type": "wrist_assistant/complications/watch_status",
                "owner_watch_id": watch_id,
            }
        ],
    )[0]
    assert reply.get("success"), reply
    return reply["result"]


def test_empty_owner(base_url: str, owner: tuple[str, bytes]) -> None:
    watch_id, secret = owner
    r = _status(base_url, owner)
    assert r.status_code == 200, r.text
    assert _verify_response(
        secret, OP, watch_id, int(r.headers["X-WA-Ts"]), r.content, r.headers["X-WA-Sig"]
    )
    payload = r.json()
    assert payload["ok"] is True
    assert payload["token"] == 0
    assert payload["applied_token"] is None
    assert payload["owner_forgotten"] is False
    assert payload["live"] == []
    assert payload["tombstones"] == []
    assert payload["live_count"] == 0
    assert payload["tombstone_count"] == 0
    assert payload["max_per_owner"] >= 1
    assert payload["max_schema_version"] >= 6


def test_lists_live_records_with_their_shapes(
    base_url: str, owner: tuple[str, bytes]
) -> None:
    docs = [_document(_cid(), "Low", 0), _document(_cid(), "High", 9)]
    created = _create(base_url, owner, docs)
    assert created.status_code == 200, created.text

    payload = _status(base_url, owner).json()
    assert payload["token"] == created.json()["token"]
    assert payload["live_count"] == 2
    by_id = {row["id"]: row for row in payload["live"]}
    assert set(by_id) == {docs[0]["id"], docs[1]["id"]}
    assert by_id[docs[0]["id"]]["name"] == "Low"
    assert by_id[docs[0]["id"]]["slotIndex"] == 0
    assert by_id[docs[1]["id"]]["slotIndex"] == 9
    assert by_id[docs[0]["id"]]["shapes"] == ["circular", "corner", "rectangular"]


def test_applied_token_follows_the_watch_ack(
    base_url: str, owner: tuple[str, bytes]
) -> None:
    """The proof the move rests on: ``applied_token`` is None until the watch
    acks, then equals what the watch reported, and the status op itself never
    moves it."""
    watch_id, secret = owner
    created = _create(base_url, owner, [_document(_cid(), "Once", 1)])
    assert created.status_code == 200, created.text
    token = created.json()["token"]
    assert token > 0

    before = _status(base_url, owner).json()
    assert before["applied_token"] is None

    # The watch acks by pulling with applied_token (what its long poll does).
    r = _post_op(
        base_url,
        secret,
        watch_id,
        "complications_sync",
        {"since_token": 0, "applied_token": token},
    )
    assert r.status_code == 200, r.text

    after = _status(base_url, owner).json()
    assert after["applied_token"] == token
    assert after["token"] == token


def test_status_stamps_nothing(base_url: str, token: str, owner: tuple[str, bytes]) -> None:
    """A pull signed as the watch stamps last_sync; this op must not, or the
    panel would show a sync the watch never made."""
    watch_id, _secret = owner
    created = _create(base_url, owner, [_document(_cid(), "Quiet", 2)])
    assert created.status_code == 200, created.text

    assert _watch_status(base_url, token, watch_id)["last_sync_seconds"] is None
    assert _status(base_url, owner).status_code == 200
    assert _status(base_url, owner).status_code == 200
    status = _watch_status(base_url, token, watch_id)
    assert status["last_sync_seconds"] is None
    assert status["applied_token"] is None


def test_tombstones_are_listed_and_never_revived(
    base_url: str, token: str, owner: tuple[str, bytes]
) -> None:
    watch_id, _secret = owner
    keep = _document(_cid(), "Keep", 3)
    gone = _document(_cid(), "Gone", 4)
    created = _create(base_url, owner, [keep, gone])
    assert created.status_code == 200, created.text
    revision = next(
        rec["revision"]
        for rec in _ws_admin_commands(
            base_url,
            token,
            [{"type": "wrist_assistant/complications/list", "owner_watch_id": watch_id}],
        )[0]["result"]["records"]
        if rec["id"] == gone["id"]
    )
    deleted = _ws_admin_commands(
        base_url,
        token,
        [
            {
                "type": "wrist_assistant/complications/delete",
                "owner_watch_id": watch_id,
                "complication_id": gone["id"],
                "base_revision": revision,
            }
        ],
    )[0]
    assert deleted.get("success"), deleted

    payload = _status(base_url, owner).json()
    assert [row["id"] for row in payload["live"]] == [keep["id"]]
    assert payload["tombstones"] == [gone["id"]]
    assert payload["live_count"] == 1
    assert payload["tombstone_count"] == 1

    # A re-send of the tombstoned id is refused with the machine-readable
    # reason the app keys on, and the live one answers exists.
    again = _create(base_url, owner, [keep, gone])
    assert again.status_code == 200, again.text
    results = {row["id"]: row for row in again.json()["results"]}
    assert results[keep["id"]]["status"] == "exists"
    assert results[gone["id"]]["status"] == "error"
    assert results[gone["id"]]["reason"] == "deleted"
    assert "deleted" in results[gone["id"]]["message"]
