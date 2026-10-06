"""Pure-unit tests for ``widget_secret_store.watch_has_iphone``.

The phone's one-time move uploads a kind only while Home Assistant holds no
record of it, so the panel waits for that move on a watch whose iPhone may
still send it (the owner list's ``has_iphone``). These cover what counts: the
iPhone that paired the watch, or any iPhone of the watch's own Home Assistant
user; nothing else. No Home Assistant: the module is loaded the way
``test_widget_secret_user_binding.py`` loads it.
"""

from __future__ import annotations

import types
from typing import Any

import pytest

from test_widget_secret_user_binding import _loaded_store


@pytest.fixture(scope="module")
def mod():
    with _loaded_store() as loaded:
        yield loaded


def _phone(user_id: str | None = None) -> Any:
    return types.SimpleNamespace(device_kind="iphone", user_id=user_id, owner_iphone_id=None)


def _watch(user_id: str | None = None, owner: str | None = None) -> Any:
    return types.SimpleNamespace(device_kind="watch", user_id=user_id, owner_iphone_id=owner)


def test_a_watch_whose_user_has_an_iphone_has_one(mod) -> None:
    entries = {"w1": _watch("u1"), "p1": _phone("u1")}
    assert mod.watch_has_iphone(entries, "w1") is True


def test_a_watch_whose_user_has_no_iphone_has_none(mod) -> None:
    assert mod.watch_has_iphone({"w1": _watch("u1")}, "w1") is False


def test_another_users_iphone_does_not_count(mod) -> None:
    entries = {"w1": _watch("u1"), "p2": _phone("u2"), "w2": _watch("u2")}
    assert mod.watch_has_iphone(entries, "w1") is False
    assert mod.watch_has_iphone(entries, "w2") is True


def test_several_users_each_judged_by_their_own_phones(mod) -> None:
    entries = {
        "w1": _watch("u1"),
        "w1b": _watch("u1"),
        "w2": _watch("u2"),
        "w3": _watch("u3"),
        "p1": _phone("u1"),
        "p1b": _phone("u1"),
        "p2": _phone("u2"),
        "p-none": _phone(None),
    }
    assert {w: mod.watch_has_iphone(entries, w) for w in ("w1", "w1b", "w2", "w3")} == {
        "w1": True,
        "w1b": True,
        "w2": True,
        "w3": False,
    }


def test_an_unbound_phone_does_not_match_an_unbound_watch(mod) -> None:
    """Two entries with no user are not the same person."""
    entries = {"w1": _watch(None), "p1": _phone(None)}
    assert mod.watch_has_iphone(entries, "w1") is False


def test_the_iphone_that_paired_the_watch_counts_known_or_not(mod) -> None:
    """That phone holds the watch's pair and runs the move, whether or not it
    ever registered with this Home Assistant itself."""
    assert mod.watch_has_iphone({"w1": _watch(None, owner="p1"), "p1": _phone(None)}, "w1") is True
    assert mod.watch_has_iphone({"w1": _watch(None, owner="p-elsewhere")}, "w1") is True
    assert mod.watch_has_iphone({"w1": _watch("u1", owner="p-elsewhere")}, "w1") is True


def test_a_phone_and_an_unknown_id_have_none(mod) -> None:
    entries = {"p1": _phone("u1"), "p2": _phone("u1")}
    assert mod.watch_has_iphone(entries, "p1") is False
    assert mod.watch_has_iphone(entries, "missing") is False


def test_real_entries_classify_by_label(mod) -> None:
    """The store's own entries, whose kind comes from the label."""
    watch = mod.WidgetSecretEntry(
        secret_b64="a2tr", label=mod.LABEL_WATCH_SELF_PROVISION, user_id="u1"
    )
    phone = mod.WidgetSecretEntry(
        secret_b64="a2tr", label=mod.LABEL_IPHONE_SELF_PROVISION, user_id="u1"
    )
    assert mod.watch_has_iphone({"w1": watch, "p1": phone}, "w1") is True
    assert mod.watch_has_iphone({"w1": watch}, "w1") is False
