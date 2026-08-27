"""Complication store sync rules, checked against a live Home Assistant.

The store is the one writer behind the whole custom complication feature, and
the rules that matter most are the ones a unit test cannot reach: that a
revision survives a restart, that two open panels cannot silently overwrite
each other, and that a phone holding a stale replica can never resurrect a
complication somebody deleted.

Everything here runs under one throwaway owner id, so the real collection is
never written to. Each test also reuses the same complication id on every run,
derived from the test's own name, because deleting writes a tombstone instead
of erasing the row: fresh ids every run would grow the stored file forever,
while stable ids just revive and re-delete a fixed handful of rows.

Two things about the wire format are worth knowing before reading the
assertions. Records come back camelCase (`ownerIphoneId`, `updatedAt`). And a
conflict is deliberately not a websocket error: it arrives as an ordinary
result carrying `ok: false` plus the record that won, because the panel needs
that record to draw its conflict screen and `send_error` can only carry a
string. So the transport still says `success: true` on a refused save.

Run from the repo root:

    HA_URL=http://homeassistant.local:8123 HA_TOKEN=<long-lived> pytest -v tests/test_complication_sync_live.py

The restart test is skipped unless `WA_LIVE_RESTART=1` is set, because it
restarts the Home Assistant instance it is pointed at and takes a couple of
minutes.
"""

from __future__ import annotations

import json
import os
import time
import uuid
from contextlib import ExitStack
from typing import Any

import pytest
import requests

from websockets.sync.client import connect

OWNER = "wa-test-owner"

# Stable per-test complication ids. Any fixed namespace works; this one is
# arbitrary and only has to stay the same between runs.
_NS = uuid.UUID("6f1d2b4e-9c3a-4f77-8b21-5e0a7c4d9188")


def _ws_url(base_url: str) -> str:
    return base_url.replace("https://", "wss://").replace("http://", "ws://") + "/api/websocket"


def document(cid: str, name: str = "Test", slot: int = 0) -> dict[str, Any]:
    """The smallest document the store will accept."""
    return {
        "schemaVersion": 4,
        "id": cid,
        "name": name,
        "values": [],
        "elements": [{"kind": "text"}],
        "slotIndex": slot,
        "supportedFamilies": ["rectangular", "circular", "corner"],
        "perFamily": {},
        "dataSources": [],
        "refreshMinutes": 0,
        "tapAction": {"type": "refresh"},
    }


class Panel:
    """One websocket connection, standing in for one open browser tab."""

    def __init__(self, ws, stack: ExitStack) -> None:
        self._ws = ws
        self._stack = stack
        self._next_id = 1
        self._events: list[dict[str, Any]] = []

    @classmethod
    def open(cls, base_url: str, token: str) -> Panel:
        # A panel outlives any single `with` block, so the connection's context
        # is held open on a stack and released in `close()`. `connect()` warns
        # if its context is never entered at all.
        stack = ExitStack()
        try:
            ws = stack.enter_context(
                connect(_ws_url(base_url), max_size=8 * 1024 * 1024, open_timeout=15)
            )
            ws.recv()  # auth_required
            ws.send(json.dumps({"type": "auth", "access_token": token}))
            hello = json.loads(ws.recv())
            if hello.get("type") != "auth_ok":
                raise AssertionError(f"websocket auth failed: {hello}")
        except BaseException:
            stack.close()
            raise
        return cls(ws, stack)

    def close(self) -> None:
        self._stack.close()

    def command(self, **msg: Any) -> dict[str, Any]:
        """Send one command and return its reply.

        Subscription events can arrive in the middle of this, so they are set
        aside for `event()` rather than mistaken for the reply.
        """
        mid = self._next_id
        self._next_id += 1
        self._ws.send(json.dumps({"id": mid, **msg}))
        while True:
            reply = json.loads(self._ws.recv(timeout=15))
            if reply.get("type") == "event":
                self._events.append(reply)
                continue
            if reply.get("id") == mid:
                return reply

    def event(self, timeout: float = 5.0) -> dict[str, Any] | None:
        """The next pushed change, or None if none arrived in time."""
        if self._events:
            return self._events.pop(0)
        try:
            msg = json.loads(self._ws.recv(timeout=timeout))
        except TimeoutError:
            return None
        return msg if msg.get("type") == "event" else None

    # ── the complication commands ──────────────────────────────────────────

    def save(self, doc: dict[str, Any], base: Any = ...) -> dict[str, Any]:
        msg: dict[str, Any] = {
            "type": "wrist_assistant/complications/save",
            "owner_iphone_id": OWNER,
            "document": doc,
        }
        if base is not ...:
            msg["base_revision"] = base
        return self.command(**msg)

    def delete(self, cid: str, base: Any = ...) -> dict[str, Any]:
        msg: dict[str, Any] = {
            "type": "wrist_assistant/complications/delete",
            "owner_iphone_id": OWNER,
            "complication_id": cid,
        }
        if base is not ...:
            msg["base_revision"] = base
        return self.command(**msg)

    def get(self, cid: str) -> dict[str, Any]:
        return self.command(
            type="wrist_assistant/complications/get",
            owner_iphone_id=OWNER,
            complication_id=cid,
        )

    def listing(self, include_deleted: bool = False) -> dict[str, Any]:
        reply = self.command(
            type="wrist_assistant/complications/list",
            owner_iphone_id=OWNER,
            include_deleted=include_deleted,
        )
        return reply["result"]

    def subscribe(self, owner: str = OWNER) -> dict[str, Any]:
        return self.command(
            type="wrist_assistant/complications/subscribe", owner_iphone_id=owner
        )


def accepted(reply: dict[str, Any]) -> bool:
    """The command did what was asked."""
    return bool(reply.get("success")) and reply.get("result", {}).get("ok") is not False


def refused(reply: dict[str, Any]) -> bool:
    """The command was refused as a conflict, which is a result, not an error."""
    result = reply.get("result", {})
    return (
        bool(reply.get("success"))
        and result.get("ok") is False
        and result.get("error") == "conflict"
    )


def record(reply: dict[str, Any]) -> dict[str, Any]:
    return reply["result"]["record"]


def winner(reply: dict[str, Any]) -> dict[str, Any]:
    """The record a refused command lost to."""
    return reply["result"]["current"]


# ── fixtures ───────────────────────────────────────────────────────────────


@pytest.fixture(scope="module")
def panel(base_url: str, token: str):
    p = Panel.open(base_url, token)
    if not accepted(p.command(type="wrist_assistant/complications/owners")):
        p.close()
        pytest.skip("this build has no complication store")
    yield p
    p.close()


@pytest.fixture
def fresh(panel: Panel, request: pytest.FixtureRequest):
    """One complication at revision 1, under an id stable across runs.

    Returns `(id, revision)`. A previous run will have left a tombstone at
    whatever revision it stopped at, so this reuses that revision to revive the
    row rather than adding a new one.
    """
    cid = str(uuid.uuid5(_NS, request.node.name)).upper()
    existing = panel.get(cid)
    base = record(existing)["revision"] if accepted(existing) else ...
    reply = panel.save(document(cid, "start"), base=base)
    assert accepted(reply), reply
    yield cid, record(reply)["revision"]
    current = panel.get(cid)
    if accepted(current) and not record(current)["deleted"]:
        panel.delete(cid, base=record(current)["revision"])


# ── revisions ──────────────────────────────────────────────────────────────


def test_saving_on_the_current_revision_advances_it(panel: Panel, fresh):
    cid, rev = fresh
    reply = panel.save(document(cid, "edited"), base=rev)
    assert accepted(reply), reply
    assert record(reply)["revision"] == rev + 1


def test_a_save_on_a_stale_revision_is_refused(panel: Panel, fresh):
    cid, rev = fresh
    assert accepted(panel.save(document(cid, "first"), base=rev))
    reply = panel.save(document(cid, "second"), base=rev)
    assert refused(reply), reply
    assert winner(reply)["revision"] == rev + 1
    assert f"stored revision is {rev + 1}" in reply["result"]["message"]


def test_a_save_with_no_revision_cannot_overwrite_an_existing_record(panel: Panel, fresh):
    cid, _ = fresh
    assert refused(panel.save(document(cid, "blind")))


def test_a_save_on_a_revision_that_never_existed_is_refused(panel: Panel, fresh):
    cid, _ = fresh
    assert refused(panel.save(document(cid, "from the future"), base=9999))


def test_every_commit_takes_a_higher_store_token(panel: Panel, fresh):
    cid, rev = fresh
    tokens = [record(panel.get(cid))["token"]]
    for i in range(3):
        reply = panel.save(document(cid, f"edit {i}"), base=rev + i)
        assert accepted(reply), reply
        tokens.append(record(reply)["token"])
    assert tokens == sorted(set(tokens)), tokens


# ── tombstones ─────────────────────────────────────────────────────────────


def test_deleting_writes_a_tombstone_at_the_next_revision(panel: Panel, fresh):
    cid, rev = fresh
    reply = panel.delete(cid, base=rev)
    assert accepted(reply), reply
    assert record(reply)["revision"] == rev + 1
    assert record(reply)["deleted"] is True


def test_a_delete_on_a_stale_revision_is_refused(panel: Panel, fresh):
    cid, rev = fresh
    assert accepted(panel.save(document(cid, "moved on"), base=rev))
    assert refused(panel.delete(cid, base=rev))
    assert not record(panel.get(cid))["deleted"]


def test_deleting_an_already_deleted_record_is_harmless(panel: Panel, fresh):
    cid, rev = fresh
    first = panel.delete(cid, base=rev)
    assert accepted(first), first
    again = panel.delete(cid, base=rev + 1)
    assert accepted(again), again
    # Idempotent, so the repeat must not burn a revision the phone would then
    # have to fetch for no change.
    assert record(again)["revision"] == record(first)["revision"]


def test_a_stale_replica_cannot_undo_a_delete(panel: Panel, fresh):
    cid, rev = fresh
    assert accepted(panel.delete(cid, base=rev))
    # The replica still holds the draft it had before the delete. Re-saving it
    # on that revision must not bring the complication back.
    reply = panel.save(document(cid, "back from the dead"), base=rev)
    assert refused(reply), reply
    assert winner(reply)["deleted"] is True


def test_the_current_revision_revives_a_deleted_complication(panel: Panel, fresh):
    cid, rev = fresh
    assert accepted(panel.delete(cid, base=rev))
    reply = panel.save(document(cid, "deliberately restored"), base=rev + 1)
    assert accepted(reply), reply
    assert record(reply)["revision"] == rev + 2
    assert record(reply)["deleted"] is False


def test_a_tombstone_is_hidden_from_the_listing_but_returned_when_asked_for(panel: Panel, fresh):
    cid, rev = fresh
    assert accepted(panel.delete(cid, base=rev))

    live = panel.listing()
    assert not any(r["id"] == cid for r in live["records"])

    both = panel.listing(include_deleted=True)
    tombstones = [r for r in both["records"] if r["id"] == cid]
    assert len(tombstones) == 1
    assert tombstones[0]["deleted"] is True
    # A tombstone carries no document; there is nothing left to render.
    assert tombstones[0]["document"] is None


# ── two panels at once ─────────────────────────────────────────────────────


def test_a_second_panel_is_told_about_the_first_panel_s_save(base_url, token, panel, fresh):
    cid, rev = fresh
    watcher = Panel.open(base_url, token)
    try:
        assert accepted(watcher.subscribe())
        assert accepted(panel.save(document(cid, "from the other tab"), base=rev))

        event = watcher.event()
        assert event is not None, "no change was pushed to the second panel"
        pushed = event["event"]
        assert pushed["owner_iphone_id"] == OWNER
        assert pushed["record"]["id"] == cid
        assert isinstance(pushed["token"], int)
    finally:
        watcher.close()


def test_a_panel_watching_another_iphone_hears_nothing(base_url, token, panel, fresh):
    cid, rev = fresh
    watcher = Panel.open(base_url, token)
    try:
        assert accepted(watcher.subscribe(owner="wa-test-someone-else"))
        assert accepted(panel.save(document(cid, "not their business"), base=rev))
        assert watcher.event(timeout=3.0) is None
    finally:
        watcher.close()


def test_the_stale_panel_loses_and_can_recover(base_url, token, panel, fresh):
    cid, rev = fresh
    other = Panel.open(base_url, token)
    try:
        # Both tabs believe they hold `rev`.
        assert accepted(panel.save(document(cid, "this tab wins"), base=rev))

        lost = other.save(document(cid, "this tab is behind"), base=rev)
        assert refused(lost), lost
        assert winner(lost)["document"]["name"] == "this tab wins"

        # Having been handed the winning record, the loser can save on top of it.
        retry = other.save(document(cid, "retried on top"), base=winner(lost)["revision"])
        assert accepted(retry), retry
    finally:
        other.close()


# ── across a restart ───────────────────────────────────────────────────────


@pytest.mark.skipif(
    os.environ.get("WA_LIVE_RESTART") != "1",
    reason="restarts the live HA instance; set WA_LIVE_RESTART=1 to run",
)
def test_the_collection_survives_a_restart(base_url: str, token: str, session: requests.Session):
    """A restart must change nothing, and must not rewind the store token.

    The token is the whole basis of the phone's "anything new since N?" pull.
    If it ever went backwards across a restart, the next write would reuse a
    number a replica had already seen, and that change would never be fetched.
    """
    panel = Panel.open(base_url, token)
    try:
        cid = str(uuid.uuid5(_NS, "survives-a-restart")).upper()
        existing = panel.get(cid)
        base = record(existing)["revision"] if accepted(existing) else ...
        saved = panel.save(document(cid, "written before the restart"), base=base)
        assert accepted(saved), saved
        before = record(saved)
        collection = panel.listing(include_deleted=True)
    finally:
        panel.close()

    _restart_and_wait(base_url, session)

    panel = Panel.open(base_url, token)
    try:
        after = record(panel.get(cid))
        assert after == before, "the record changed across the restart"

        now = panel.listing(include_deleted=True)
        for old in collection["records"]:
            assert old in now["records"], f"{old['id']} changed across the restart"
        assert now["token"] >= collection["token"]

        probe = panel.save(document(str(uuid.uuid5(_NS, "post-restart-probe")).upper(), "probe"))
        assert accepted(probe), probe
        assert record(probe)["token"] > collection["token"]
        panel.delete(record(probe)["id"], base=record(probe)["revision"])
        panel.delete(cid, base=after["revision"])
    finally:
        panel.close()


def _restart_and_wait(base_url: str, session: requests.Session) -> None:
    """Restart Home Assistant and block until its API answers again.

    HTTP 500 means the Supervisor refused because it is still finishing the
    last restart, so the call is retried rather than treated as done: carrying
    on after a 500 would test the old process and pass for the wrong reason.
    """
    for _ in range(16):
        try:
            reply = session.post(
                f"{base_url}/api/services/homeassistant/restart", json={}, timeout=20
            )
        except requests.RequestException:
            break  # the connection dying is the restart starting
        if reply.status_code != 500:
            break
        time.sleep(15)
    else:
        pytest.fail("Home Assistant would not restart")

    deadline = time.monotonic() + 240
    while time.monotonic() < deadline:
        try:
            if session.get(f"{base_url}/api/", timeout=10).status_code == 200:
                # Integration views register late in startup, so an immediate
                # websocket connect can still miss the complication commands.
                time.sleep(25)
                return
        except requests.RequestException:
            pass
        time.sleep(5)
    pytest.fail("Home Assistant did not come back after the restart")
