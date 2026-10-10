"""In-process tests for the dashboard card's WebSocket commands.

``dashboard_card_ws.py`` is loaded inside the same stubbed Home Assistant
that ``test_complication_ws.py`` builds, over the real complication store, so
a save, a delete and a move are the store's own. Who may call what is pinned
statically in ``test_ws_command_registration.py``; these run the commands as a
household member who owns no device at all, which is the wall tablet the card
is for.
"""

from __future__ import annotations

import types
import uuid
from typing import Any

import pytest

import test_complication_ws as cws
from test_complication_ws import env  # noqa: F401  (the fixture)

LIBRARY = cws.LIBRARY

# Signed in, not an admin, and no device of their own.
TABLET = types.SimpleNamespace(id="tablet", name="Tablet", is_admin=False)


class _Tablet(cws._LiveConnection):
    def __init__(self) -> None:
        super().__init__()
        self.user = TABLET


@pytest.fixture
def card(env):  # noqa: F811
    return cws._load("dashboard_card_ws")


def _call(env, command, **msg) -> tuple[Any, list]:
    connection = _Tablet()
    msg.setdefault("id", 1)
    command(env.hass, connection, msg)
    return connection.results.get(msg["id"]), connection.errors


def _subscribe(env, card, owner: str, record_id: str) -> _Tablet:
    connection = _Tablet()
    card.ws_card_subscribe(
        env.hass, connection, {"id": 9, "owner_watch_id": owner, "complication_id": record_id}
    )
    assert connection.errors == [], connection.errors
    return connection


def test_designs_lists_every_owner_for_someone_who_owns_none(env, card) -> None:
    env.add_watch("watch-A", device_name="Apple Watch")
    env.rename_in_ha("watch-A", "Jesse's watch")
    on_watch = env.save_document("watch-A")
    on_shelf = env.save_document(LIBRARY)

    reply, errors = _call(env, card.ws_card_designs)

    assert errors == []
    assert reply["designs"] == [
        {
            "owner_watch_id": LIBRARY,
            "owner_name": "Library",
            "complication_id": on_shelf["id"],
            "name": "Garage",
            "families": ["rectangular", "circular", "corner"],
            "revision": 1,
            "preview": None,
        },
        {
            "owner_watch_id": "watch-A",
            "owner_name": "Jesse's watch",
            "complication_id": on_watch["id"],
            "name": "Garage",
            "families": ["rectangular", "circular", "corner"],
            "revision": 1,
            "preview": None,
        },
    ]


def test_designs_carries_a_dashboard_design_s_canvas(env, card) -> None:
    document = {
        "schemaVersion": 11,
        "id": str(uuid.uuid4()).upper(),
        "name": "Kitchen card",
        "slotIndex": 0,
        "supportedFamilies": ["dashboard"],
        "perFamily": ["dashboard", {"canvas": {"width": 244, "height": 120}}],
        "elements": [{"kind": "text"}],
        "tapAction": {"type": "refresh"},
    }
    env.store.save(LIBRARY, document, base_revision=None, updated_by="t")
    plain = env.save_document(LIBRARY)

    reply, errors = _call(env, card.ws_card_designs)

    assert errors == []
    by_id = {d["complication_id"]: d for d in reply["designs"]}
    assert by_id[document["id"]]["canvas"] == {"width": 244, "height": 120}
    assert by_id[document["id"]]["families"] == ["dashboard"]
    assert "canvas" not in by_id[plain["id"]]


class _Previews:
    """The card preview store as far as ``designs`` reads it: one picture,
    held for one revision of each record."""

    def __init__(self, held: dict[tuple[str, str], int]) -> None:
        self.held = held

    def previews_for(self, owner: str, records: list[Any]) -> dict[str, Any]:
        out: dict[str, Any] = {}
        for record in records:
            revision = self.held.get((owner, record.id))
            if revision == record.revision:
                out[record.id] = {
                    "revision": revision, "family": "rectangular", "device": "watch",
                    "width": 340, "height": 140,
                }
        return out


def test_designs_carries_the_picture_of_the_current_revision_only(env, card) -> None:
    current = env.save_document(LIBRARY)
    stale = env.save_document(LIBRARY)
    rev_current = env.store.get(LIBRARY, current["id"]).revision
    rev_stale = env.store.get(LIBRARY, stale["id"]).revision
    env.hass.data[cws.DOMAIN].card_preview_store = _Previews(
        {(LIBRARY, current["id"]): rev_current, (LIBRARY, stale["id"]): rev_stale - 1}
    )

    reply, errors = _call(env, card.ws_card_designs)

    assert errors == []
    by_id = {d["complication_id"]: d for d in reply["designs"]}
    assert by_id[current["id"]]["preview"] == {
        "revision": rev_current, "family": "rectangular", "device": "watch",
        "width": 340, "height": 140,
    }
    assert by_id[stale["id"]]["preview"] is None


def test_designs_without_a_preview_store_say_none(env, card) -> None:
    plain = env.save_document(LIBRARY)

    reply, errors = _call(env, card.ws_card_designs)

    assert errors == []
    by_id = {d["complication_id"]: d for d in reply["designs"]}
    assert by_id[plain["id"]]["preview"] is None


def test_designs_leaves_out_a_deleted_design(env, card) -> None:
    document = env.save_document(LIBRARY)
    env.store.delete(LIBRARY, document["id"], base_revision=None, updated_by="t")
    reply, _errors = _call(env, card.ws_card_designs)
    assert reply["designs"] == []


def test_get_hands_out_the_document_and_no_sync_state(env, card) -> None:
    env.add_watch("watch-A")
    document = env.save_document("watch-A")

    reply, errors = _call(
        env, card.ws_card_get, owner_watch_id="watch-A", complication_id=document["id"].lower()
    )

    assert errors == []
    assert set(reply) == {"owner_watch_id", "complication_id", "revision", "updated_at", "document"}
    assert reply["owner_watch_id"] == "watch-A"
    assert reply["complication_id"] == document["id"]
    assert reply["document"]["name"] == "Garage"


def test_get_follows_a_design_that_moved_to_the_library(env, card) -> None:
    """A forgotten watch's designs go to the Library; the card set up on the
    watch keeps drawing."""
    env.add_watch("watch-A")
    document = env.save_document("watch-A")
    env.store.save(LIBRARY, dict(document), base_revision=None, updated_by="t")
    env.store.delete("watch-A", document["id"], base_revision=None, updated_by="t")

    reply, errors = _call(
        env, card.ws_card_get, owner_watch_id="watch-A", complication_id=document["id"]
    )

    assert errors == []
    assert reply["owner_watch_id"] == LIBRARY


def test_get_of_a_design_nobody_holds_is_not_found(env, card) -> None:
    reply, errors = _call(env, card.ws_card_get, owner_watch_id=LIBRARY, complication_id="NOPE")
    assert reply is None
    assert [code for _id, code, _message in errors] == ["not_found"]


def test_subscribe_sends_each_new_revision_of_its_design_only(env, card) -> None:
    mine = env.save_document(LIBRARY)
    other = env.save_document(LIBRARY)
    connection = _subscribe(env, card, LIBRARY, mine["id"])

    env.store.save(LIBRARY, {**other, "name": "Porch"}, base_revision=1, updated_by="t")
    assert connection.events == []

    env.store.save(LIBRARY, {**mine, "name": "Shed"}, base_revision=1, updated_by="t")
    [event] = connection.events
    assert event["event"]["revision"] == 2
    assert event["event"]["document"]["name"] == "Shed"


def test_subscribe_says_deleted_when_no_copy_is_left(env, card) -> None:
    mine = env.save_document(LIBRARY)
    connection = _subscribe(env, card, LIBRARY, mine["id"])
    env.store.delete(LIBRARY, mine["id"], base_revision=None, updated_by="t")
    assert [e["event"] for e in connection.events] == [{"deleted": True}]


def test_subscribe_stops_when_the_card_goes(env, card) -> None:
    mine = env.save_document(LIBRARY)
    connection = _subscribe(env, card, LIBRARY, mine["id"])
    connection.subscriptions[9]()
    env.store.save(LIBRARY, {**mine, "name": "Shed"}, base_revision=1, updated_by="t")
    assert connection.events == []
