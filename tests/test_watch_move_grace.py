"""Pure-unit tests for ``widget_secret_store.watch_move_may_still_come``.

The watch's own seed of its setup (pages, menus, voice, status pages, Control
Center list) and a link's first record are refused ``awaiting_move`` while
the watch's iPhone may still move its setup here: the iPhone holds the uncut
setup, and a free plan's watch may hold one page of it. That wait has to end
for a watch whose iPhone cannot move anything (no copy of the watch's key),
or the panel shows no pages for good and its first save replaces the watch's
own. It ends once the iPhone that paired the watch has polled as itself for
``MOVE_GRACE``: only the app that moves does that, and it moves on its first
launch. It also ends when a person says that iPhone is gone, by forgetting it
or with "Use what is on the watch". The panel's ``has_iphone`` is this same
rule. No Home Assistant: the module is loaded the way
``test_widget_secret_user_binding.py`` loads it.
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Any

import pytest

from test_widget_secret_user_binding import SECRET_A, SECRET_B, _loaded_store

NOW = datetime(2026, 10, 31, 12, 0, tzinfo=UTC)


@pytest.fixture
def mod():
    with _loaded_store() as loaded:
        yield loaded


def _entries(mod, *, phone_pages: bool, phone_pages_at: datetime | None, phone: bool = True) -> dict[str, Any]:
    entries: dict[str, Any] = {
        "w-old": mod.WidgetSecretEntry(
            secret_b64=SECRET_B,
            label=mod.LABEL_WATCH_SELF_PROVISION,
            user_id="u1",
            owner_iphone_id="p1",
        ),
        "w-code": mod.WidgetSecretEntry(
            secret_b64=SECRET_B, label=mod.LABEL_WATCH_CODE_PAIR, user_id="u1"
        ),
    }
    if phone:
        entries["p1"] = mod.WidgetSecretEntry(
            secret_b64=SECRET_A,
            label=mod.LABEL_IPHONE_SELF_PROVISION,
            user_id="u1",
            phone_pages=phone_pages,
            phone_pages_at=phone_pages_at,
        )
    return entries


def test_a_watch_with_no_iphone_waits_for_nothing(mod) -> None:
    entries = _entries(mod, phone_pages=False, phone_pages_at=None)
    assert mod.watch_move_may_still_come(entries, "w-code", NOW) is False
    assert mod.watch_move_may_still_come(entries, "p1", NOW) is False
    assert mod.watch_move_may_still_come(entries, "missing", NOW) is False


def test_an_iphone_on_an_app_that_never_polled_as_itself_may_still_move(mod) -> None:
    """3.0.1 and older never poll as themselves; their move comes once the
    app updates, so the watch's possibly cut copy must not go first."""
    entries = _entries(mod, phone_pages=False, phone_pages_at=None)
    assert mod.watch_move_may_still_come(entries, "w-old", NOW) is True
    assert mod.watch_move_may_still_come(entries, "w-old", NOW + timedelta(days=365)) is True


def test_an_iphone_this_home_has_no_entry_for_may_still_move(mod) -> None:
    entries = _entries(mod, phone_pages=False, phone_pages_at=None, phone=False)
    assert mod.watch_move_may_still_come(entries, "w-old", NOW) is True


def test_the_move_counts_as_coming_until_the_grace_ends(mod) -> None:
    started = NOW - mod.MOVE_GRACE + timedelta(minutes=1)
    entries = _entries(mod, phone_pages=True, phone_pages_at=started)
    assert mod.watch_move_may_still_come(entries, "w-old", NOW) is True
    later = NOW + timedelta(minutes=1)
    assert mod.watch_move_may_still_come(entries, "w-old", later) is False


def test_a_phone_marked_before_the_stamp_waits_for_its_next_poll(mod) -> None:
    """``phone_pages`` with no ``phone_pages_at`` is a phone marked by an
    older integration: how long ago is unknown, so it may still move until
    its next poll stamps it and the grace runs from there."""
    entries = _entries(mod, phone_pages=True, phone_pages_at=None)
    assert mod.watch_move_may_still_come(entries, "w-old", NOW) is True


def test_a_person_ends_the_wait_and_nothing_else_does(mod) -> None:
    """Neither a missing owner entry nor any amount of time ends the wait for
    a phone that never polled as itself: a phone on 3.0.1 may have no entry,
    and its move must still land. Only "Use what is on the watch" does."""
    secrets = mod.WidgetSecretStore(object())
    secrets.register(
        "w-old", SECRET_B, mod.LABEL_WATCH_SELF_PROVISION, owner_iphone_id="p-gone", user_id="u1"
    )
    assert secrets.may_await_move("w-old") is True
    entries = {"w-old": secrets.get("w-old")}
    assert mod.watch_move_may_still_come(entries, "w-old", NOW + timedelta(days=3650)) is True

    assert secrets.end_move_wait("w-old") is True
    assert secrets.may_await_move("w-old") is False
    # It changes no other field: push tokens and ownership read that one.
    assert secrets.get("w-old").owner_iphone_id == "p-gone"
    # Once is enough.
    assert secrets.end_move_wait("w-old") is False


def test_ending_the_wait_is_for_a_paired_watch_only(mod) -> None:
    secrets = mod.WidgetSecretStore(object())
    secrets.register("p1", SECRET_A, mod.LABEL_IPHONE_SELF_PROVISION, user_id="u1")
    assert secrets.end_move_wait("p1") is None
    assert secrets.end_move_wait("missing") is None


def test_the_ended_wait_survives_a_register_of_the_same_iphone_and_the_file(mod) -> None:
    secrets = mod.WidgetSecretStore(object())
    secrets.register(
        "w-old", SECRET_B, mod.LABEL_WATCH_SELF_PROVISION, owner_iphone_id="p1", user_id="u1"
    )
    assert "move_wait_ended" not in secrets._serialize()["secrets"]["w-old"]
    secrets.end_move_wait("w-old")
    assert secrets._serialize()["secrets"]["w-old"]["move_wait_ended"] is True
    # A re-key by the same iPhone keeps the person's choice.
    secrets.register(
        "w-old", SECRET_A, mod.LABEL_WATCH_SELF_PROVISION, owner_iphone_id="p1", user_id="u1"
    )
    assert secrets.may_await_move("w-old") is False
    # Another iPhone taking the watch over holds a key the person never gave up.
    secrets.register(
        "w-old", SECRET_B, mod.LABEL_WATCH_SELF_PROVISION, owner_iphone_id="p2", user_id="u1"
    )
    assert secrets.may_await_move("w-old") is True


def test_forgetting_an_iphone_ends_the_wait_of_the_watches_that_named_it(mod) -> None:
    secrets = mod.WidgetSecretStore(object())
    secrets.register("p1", SECRET_A, mod.LABEL_IPHONE_SELF_PROVISION, user_id="u1")
    secrets.register(
        "w-1", SECRET_B, mod.LABEL_WATCH_SELF_PROVISION, owner_iphone_id="p1", user_id="u1"
    )
    secrets.register(
        "w-2", SECRET_B, mod.LABEL_WATCH_SELF_PROVISION, owner_iphone_id="p2", user_id="u1"
    )
    assert secrets.remove("p1") == ["w-1"]
    assert secrets.get("w-1").owner_iphone_id is None
    assert secrets.may_await_move("w-1") is False
    # Another iPhone's watch still waits, and forgetting a watch frees nothing.
    assert secrets.may_await_move("w-2") is True
    assert secrets.remove("w-1") == []
    assert secrets.remove("missing") == []


def test_the_panel_stops_waiting_when_the_grace_ends(mod) -> None:
    """``has_iphone`` comes from this one rule, ``may_await_move``: the panel
    and the watch's seed never disagree on whether the wait is over. A panel
    save that races the seed meets the usual conflict over revision 0."""
    secrets = mod.WidgetSecretStore(object())
    secrets.register("p1", SECRET_A, mod.LABEL_IPHONE_SELF_PROVISION, user_id="u1")
    secrets.register(
        "w-old", SECRET_B, mod.LABEL_WATCH_SELF_PROVISION, owner_iphone_id="p1", user_id="u1"
    )
    secrets.note_phone_pages("p1")
    assert secrets.may_await_move("w-old") is True
    secrets.get("p1").phone_pages_at -= mod.MOVE_GRACE + timedelta(seconds=1)
    assert secrets.may_await_move("w-old") is False
    # The narrower fact still reads true; nothing outside this module asks it.
    assert mod.watch_has_iphone(secrets.all_entries, "w-old") is True


def test_the_first_poll_stamps_the_grace_and_later_polls_keep_it(mod) -> None:
    secrets = mod.WidgetSecretStore(object())
    secrets.register("p1", SECRET_A, mod.LABEL_IPHONE_SELF_PROVISION, user_id="u1")
    secrets.register(
        "w-old", SECRET_B, mod.LABEL_WATCH_SELF_PROVISION, owner_iphone_id="p1", user_id="u1"
    )
    assert secrets.may_await_move("w-old") is True
    assert secrets.note_phone_pages("p1") is True
    stamped = secrets.get("p1").phone_pages_at
    assert stamped is not None
    # Still inside the grace.
    assert secrets.may_await_move("w-old") is True
    assert secrets.note_phone_pages("p1") is False
    assert secrets.get("p1").phone_pages_at == stamped
    # A watch is never stamped.
    assert secrets.note_phone_pages("w-old") is False
    assert secrets.get("w-old").phone_pages_at is None
    # Once the grace is over, the watch's own copy may fill an empty record.
    secrets.get("p1").phone_pages_at = stamped - mod.MOVE_GRACE - timedelta(seconds=1)
    assert secrets.may_await_move("w-old") is False


def test_a_phone_marked_by_an_older_integration_is_stamped_on_its_next_poll(mod) -> None:
    secrets = mod.WidgetSecretStore(object())
    secrets.register("p1", SECRET_A, mod.LABEL_IPHONE_SELF_PROVISION, user_id="u1")
    secrets.get("p1").phone_pages = True
    assert secrets.get("p1").phone_pages_at is None
    # Already marked, so it reports no change, but the stamp is written.
    assert secrets.note_phone_pages("p1") is False
    assert secrets.get("p1").phone_pages_at is not None


def test_the_stamp_survives_a_register_and_the_file(mod) -> None:
    secrets = mod.WidgetSecretStore(object())
    secrets.register("p1", SECRET_A, mod.LABEL_IPHONE_SELF_PROVISION, user_id="u1")
    secrets.note_phone_pages("p1")
    stamped = secrets.get("p1").phone_pages_at
    # A re-key keeps it, as it keeps phone_pages.
    secrets.register("p1", SECRET_B, mod.LABEL_IPHONE_SELF_PROVISION, user_id="u1")
    assert secrets.get("p1").phone_pages_at == stamped
    saved = secrets._serialize()["secrets"]
    assert saved["p1"]["phone_pages_at"] == stamped.isoformat()
    # Kept on disk only while set.
    secrets.register("w-code", SECRET_B, mod.LABEL_WATCH_CODE_PAIR, user_id="u1")
    assert "phone_pages_at" not in secrets._serialize()["secrets"]["w-code"]
    # Read back from the file.
    mod.dt_util.parse_datetime = datetime.fromisoformat
    assert mod._stored_time(stamped.isoformat()) == stamped
    assert mod._stored_time(None) is None
    assert mod._stored_time(12) is None
