"""Pure-unit tests for ``widget_secret_store.watch_has_iphone``.

The phone's one-time move uploads a kind only while Home Assistant holds no
record of it, so the panel waits for that move on a watch whose iPhone may
still send it (the owner list's ``has_iphone``). The move signs as the watch
with the key the old phone link left on the phone, so only a watch the old
link set up waits: one that names the iPhone that paired it. A watch whose key
came from a code confirmed in the panel never waits, and neither does a watch
merely because its Home Assistant user has an iPhone. No Home Assistant: the
module is loaded the way ``test_widget_secret_user_binding.py`` loads it.
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
    return types.SimpleNamespace(
        device_kind="iphone",
        label="iphone-self-provision",
        user_id=user_id,
        owner_iphone_id=None,
    )


def _watch(
    user_id: str | None = None,
    owner: str | None = None,
    label: str | None = "watch-self-provision",
) -> Any:
    return types.SimpleNamespace(
        device_kind="watch", label=label, user_id=user_id, owner_iphone_id=owner
    )


def _code_watch(user_id: str | None = "admin", owner: str | None = None) -> Any:
    return _watch(user_id, owner=owner, label="watch-code-pair")


def test_the_iphone_that_paired_the_watch_counts_known_or_not(mod) -> None:
    """That phone holds the watch's key from the old link and runs the move,
    whether or not it ever registered with this Home Assistant itself."""
    assert mod.watch_has_iphone({"w1": _watch(None, owner="p1"), "p1": _phone(None)}, "w1") is True
    assert mod.watch_has_iphone({"w1": _watch(None, owner="p-elsewhere")}, "w1") is True
    assert mod.watch_has_iphone({"w1": _watch("u1", owner="p-elsewhere")}, "w1") is True


def test_a_relay_provisioned_watch_waits_for_its_phone(mod) -> None:
    """The old phone's relay registered the watch under the phone's id."""
    entries = {"w1": _watch("u1", owner="p1", label="watch-relay-provision"), "p1": _phone("u1")}
    assert mod.watch_has_iphone(entries, "w1") is True


def test_a_watch_paired_by_code_never_waits(mod) -> None:
    """A new user: the new phone app on the same Home Assistant user, and a
    watch paired by code. No phone holds that watch's key."""
    entries = {"w1": _code_watch("u1"), "p1": _phone("u1")}
    assert mod.watch_has_iphone(entries, "w1") is False


def test_a_watch_paired_again_by_code_never_waits(mod) -> None:
    """An old watch paired again by code keeps its id but has a new key the
    phone never saw, even if its metadata refresh still names its old phone."""
    entries = {"w1": _code_watch("u1", owner="p1"), "p1": _phone("u1")}
    assert mod.watch_has_iphone(entries, "w1") is False


def test_another_iphone_of_the_same_user_does_not_count(mod) -> None:
    """A watch that names no iPhone has no phone holding its key, however
    many iPhones its user has. One admin who pairs every watch must not see
    every one of them wait."""
    entries = {
        "w1": _watch("u1"),
        "w2": _code_watch("u1"),
        "p1": _phone("u1"),
        "p1b": _phone("u1"),
    }
    assert mod.watch_has_iphone(entries, "w1") is False
    assert mod.watch_has_iphone(entries, "w2") is False


def test_each_watch_is_judged_by_its_own_entry(mod) -> None:
    entries = {
        "w-old": _watch("u1", owner="p1"),
        "w-new": _code_watch("u1"),
        "w-other": _watch("u2", owner="p2"),
        "w-loose": _watch(None),
        "p1": _phone("u1"),
        "p2": _phone("u2"),
    }
    assert {w: mod.watch_has_iphone(entries, w) for w in ("w-old", "w-new", "w-other", "w-loose")} == {
        "w-old": True,
        "w-new": False,
        "w-other": True,
        "w-loose": False,
    }


def test_a_phone_and_an_unknown_id_have_none(mod) -> None:
    entries = {"p1": _phone("u1"), "p2": _phone("u1")}
    assert mod.watch_has_iphone(entries, "p1") is False
    assert mod.watch_has_iphone(entries, "missing") is False


def test_real_entries_classify_by_label(mod) -> None:
    """The store's own entries, whose kind and pairing come from the label."""
    old = mod.WidgetSecretEntry(
        secret_b64="a2tr",
        label=mod.LABEL_WATCH_SELF_PROVISION,
        user_id="u1",
        owner_iphone_id="p1",
    )
    unnamed = mod.WidgetSecretEntry(
        secret_b64="a2tr", label=mod.LABEL_WATCH_SELF_PROVISION, user_id="u1"
    )
    by_code = mod.WidgetSecretEntry(
        secret_b64="a2tr", label=mod.LABEL_WATCH_CODE_PAIR, user_id="u1"
    )
    phone = mod.WidgetSecretEntry(
        secret_b64="a2tr", label=mod.LABEL_IPHONE_SELF_PROVISION, user_id="u1"
    )
    entries = {"w-old": old, "w-unnamed": unnamed, "w-code": by_code, "p1": phone}
    assert mod.watch_has_iphone(entries, "w-old") is True
    assert mod.watch_has_iphone(entries, "w-unnamed") is False
    assert mod.watch_has_iphone(entries, "w-code") is False
    assert mod.watch_has_iphone(entries, "p1") is False
