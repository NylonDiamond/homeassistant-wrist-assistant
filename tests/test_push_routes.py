"""Pure-unit tests for ``notifications.resolve_push_routes`` (step 6).

Home Assistant pairs a phone's push token with the watches of the same Home
Assistant user, so the phone never names a watch. These cover the routing
table in the step 6 build contract: each delivery mode, several watches and
several phones, a watch with no phone, two users, an unbound watch with an
owner, leftover tokens under a watch, an untargeted alert, and a target that
is an iPhone. No Home Assistant: ``notifications`` is loaded the way
``test_notification_tokens.py`` loads it.
"""

from __future__ import annotations

import types
from typing import Any

import pytest

from test_notification_tokens import _loaded_notifications


@pytest.fixture(scope="module")
def mod():
    with _loaded_notifications() as loaded:
        yield loaded


def _phone(user_id: str | None = None) -> Any:
    return types.SimpleNamespace(device_kind="iphone", user_id=user_id, owner_iphone_id=None)


def _watch(user_id: str | None = None, owner: str | None = None) -> Any:
    return types.SimpleNamespace(device_kind="watch", user_id=user_id, owner_iphone_id=owner)


def _tokens(mod, spec: dict[str, dict[str, str]]) -> dict:
    """``{id: {platform: device_token}}`` as the store's ``all_entries``."""
    return {
        store_id: {
            platform: mod.TokenEntry(device_token=token, platform=platform, environment="production")
            for platform, token in by_platform.items()
        }
        for store_id, by_platform in spec.items()
    }


def _sends(mod, secrets, tokens, modes=None, targets=None) -> list[tuple[str, str]]:
    """Each route as (id it is filed under, device token)."""
    routes = mod.resolve_push_routes(secrets, _tokens(mod, tokens), modes or {}, targets)
    return [(route.store_id, route.entry.device_token) for route in routes]


# One user, one phone, one watch.
ONE = {"p1": _phone("u1"), "w1": _watch("u1", owner="p1")}
ONE_TOKENS = {"p1": {"ios": "P1"}, "w1": {"watchos": "W1"}}


def test_mirror_goes_to_the_phone(mod) -> None:
    assert _sends(mod, ONE, ONE_TOKENS) == [("p1", "P1")]
    assert _sends(mod, ONE, ONE_TOKENS, {"w1": "mirror"}, ["w1"]) == [("p1", "P1")]


def test_direct_goes_to_the_watch(mod) -> None:
    assert _sends(mod, ONE, ONE_TOKENS, {"w1": "direct"}) == [("w1", "W1")]


def test_mirror_with_no_phone_token_falls_back_to_the_watch(mod) -> None:
    assert _sends(mod, ONE, {"w1": {"watchos": "W1"}}) == [("w1", "W1")]


def test_direct_with_no_watch_token_falls_back_to_the_phone(mod) -> None:
    assert _sends(mod, ONE, {"p1": {"ios": "P1"}}, {"w1": "direct"}) == [("p1", "P1")]


def test_a_watch_whose_phone_files_its_token_under_itself_needs_no_watch_token(mod) -> None:
    """The phone holds the token; the watch never registered its own."""
    assert _sends(mod, ONE, {"p1": {"ios": "P1"}}) == [("p1", "P1")]


def test_two_watches_one_phone_is_one_send(mod) -> None:
    secrets = {**ONE, "w2": _watch("u1", owner="p1")}
    tokens = {**ONE_TOKENS, "w2": {"watchos": "W2"}}
    routes = mod.resolve_push_routes(secrets, _tokens(mod, tokens), {}, None)
    assert [(r.store_id, r.entry.device_token, r.targets) for r in routes] == [
        ("p1", "P1", ["w1", "w2"])
    ]


def test_two_watches_one_fast_one_reliable(mod) -> None:
    secrets = {**ONE, "w2": _watch("u1", owner="p1")}
    tokens = {**ONE_TOKENS, "w2": {"watchos": "W2"}}
    assert _sends(mod, secrets, tokens, {"w2": "direct"}) == [("p1", "P1"), ("w2", "W2")]


def test_two_phones_one_watch_both_get_it(mod) -> None:
    secrets = {**ONE, "p2": _phone("u1")}
    tokens = {**ONE_TOKENS, "p2": {"ios": "P2"}}
    assert _sends(mod, secrets, tokens) == [("p1", "P1"), ("p2", "P2")]


def test_a_phone_with_no_token_is_not_a_phone_of_the_watch(mod) -> None:
    secrets = {**ONE, "p2": _phone("u1")}
    assert _sends(mod, secrets, ONE_TOKENS) == [("p1", "P1")]


def test_a_watch_with_no_phone_goes_direct_whatever_the_mode(mod) -> None:
    """Paired by code: no phone of its user holds a token."""
    secrets = {"w1": _watch("u1")}
    assert _sends(mod, secrets, {"w1": {"watchos": "W1"}}, {"w1": "mirror"}) == [("w1", "W1")]


def test_two_users_never_cross(mod) -> None:
    secrets = {
        **ONE,
        "p2": _phone("u2"),
        "w2": _watch("u2", owner="p2"),
    }
    tokens = {**ONE_TOKENS, "p2": {"ios": "P2"}, "w2": {"watchos": "W2"}}
    assert _sends(mod, secrets, tokens, targets=["w1"]) == [("p1", "P1")]
    assert _sends(mod, secrets, tokens, targets=["w2"]) == [("p2", "P2")]
    assert _sends(mod, secrets, tokens) == [("p1", "P1"), ("p2", "P2")]


def test_a_watch_of_another_user_never_reaches_a_phone_that_paired_it(mod) -> None:
    """Bound watches pair by user only; owner_iphone_id is not consulted."""
    secrets = {"p1": _phone("u1"), "w1": _watch("u2", owner="p1")}
    tokens = {"p1": {"ios": "P1"}, "w1": {"watchos": "W1"}}
    assert _sends(mod, secrets, tokens) == [("w1", "W1")]


def test_an_unbound_watch_pairs_through_its_owner_phone(mod) -> None:
    secrets = {"p1": _phone(None), "p2": _phone(None), "w1": _watch(None, owner="p1")}
    tokens = {"p1": {"ios": "P1"}, "p2": {"ios": "P2"}, "w1": {"watchos": "W1"}}
    assert _sends(mod, secrets, tokens) == [("p1", "P1")]
    assert _sends(mod, secrets, tokens, {"w1": "direct"}) == [("w1", "W1")]


def test_an_unbound_watch_with_no_owner_has_no_phone(mod) -> None:
    secrets = {"p1": _phone(None), "w1": _watch(None)}
    tokens = {"p1": {"ios": "P1"}, "w1": {"watchos": "W1"}}
    assert _sends(mod, secrets, tokens) == [("w1", "W1")]


def test_a_leftover_ios_token_under_the_watch_is_one_of_its_phones(mod) -> None:
    """The move could not place it: it is read where it is."""
    secrets = {"w1": _watch("u1")}
    tokens = {"w1": {"watchos": "W1", "ios": "OLD"}}
    assert _sends(mod, secrets, tokens) == [("w1", "OLD")]
    assert _sends(mod, secrets, tokens, {"w1": "direct"}) == [("w1", "W1")]


def test_a_leftover_copy_of_the_phone_s_own_token_is_sent_once(mod) -> None:
    tokens = {"p1": {"ios": "P1"}, "w1": {"watchos": "W1", "ios": "P1"}}
    assert _sends(mod, ONE, tokens) == [("p1", "P1")]


def test_a_leftover_and_the_user_s_phone_both_get_it(mod) -> None:
    tokens = {"p1": {"ios": "P1"}, "w1": {"watchos": "W1", "ios": "OLD"}}
    assert _sends(mod, ONE, tokens) == [("p1", "P1"), ("w1", "OLD")]


def test_untargeted_skips_a_phone_whose_user_has_no_watch(mod) -> None:
    """Decision 1 (a): installing the app for its widgets brings no alerts."""
    secrets = {**ONE, "p2": _phone("u2")}
    tokens = {**ONE_TOKENS, "p2": {"ios": "P2"}}
    assert _sends(mod, secrets, tokens) == [("p1", "P1")]
    assert _sends(mod, {"p2": _phone("u2")}, {"p2": {"ios": "P2"}}) == []


def test_untargeted_covers_a_token_with_no_secret_entry(mod) -> None:
    """A watch id the secret store no longer knows still gets its own token."""
    assert _sends(mod, {}, {"w9": {"watchos": "W9"}}) == [("w9", "W9")]


def test_untargeted_covers_a_watch_with_no_token_of_its_own(mod) -> None:
    assert _sends(mod, ONE, {"p1": {"ios": "P1"}}) == [("p1", "P1")]


def test_a_target_that_is_an_iphone_goes_to_that_phone_alone(mod) -> None:
    secrets = {**ONE, "p2": _phone("u1")}
    tokens = {**ONE_TOKENS, "p2": {"ios": "P2"}}
    assert _sends(mod, secrets, tokens, targets=["p2"]) == [("p2", "P2")]


def test_a_target_iphone_with_no_watch_is_still_sent_to(mod) -> None:
    assert _sends(mod, {"p2": _phone("u2")}, {"p2": {"ios": "P2"}}, targets=["p2"]) == [
        ("p2", "P2")
    ]


def test_an_unknown_target_sends_nothing(mod) -> None:
    assert _sends(mod, ONE, ONE_TOKENS, targets=["nobody"]) == []


def test_routes_name_the_targets_that_led_to_them(mod) -> None:
    secrets = {**ONE, "w2": _watch("u1")}
    routes = mod.resolve_push_routes(
        secrets, _tokens(mod, ONE_TOKENS), {}, ["w2", "w1", "w2"]
    )
    assert [(r.store_id, r.targets) for r in routes] == [("p1", ["w2", "w1"])]


# ── a silent background push (audit L19) ─────────────────────────────────
#
# iOS mirrors an alert to the wrist but never a content-available push, so a
# background push can only reach a watch through the watch's own token.


def _background(mod, secrets, tokens, modes=None, targets=None) -> list[tuple[str, str]]:
    routes = mod.resolve_push_routes(
        secrets, _tokens(mod, tokens), modes or {}, targets, push_type="background"
    )
    return [(route.store_id, route.entry.device_token) for route in routes]


def test_a_background_push_to_a_mirror_watch_goes_to_the_watch_not_the_phone(mod) -> None:
    assert _background(mod, ONE, ONE_TOKENS) == [("w1", "W1")]
    assert _background(mod, ONE, ONE_TOKENS, {"w1": "mirror"}, ["w1"]) == [("w1", "W1")]
    assert _background(mod, ONE, ONE_TOKENS, {"w1": "direct"}, ["w1"]) == [("w1", "W1")]


def test_a_background_push_to_a_watch_without_its_own_token_goes_nowhere(mod) -> None:
    """Falling back to the phone would wake the phone and never the watch."""
    phone_only = {"p1": {"ios": "P1"}}
    assert _background(mod, ONE, phone_only) == []
    assert _background(mod, ONE, phone_only, {"w1": "direct"}, ["w1"]) == []
    # A leftover phone token filed under the watch is a phone token too.
    assert _background(mod, ONE, {"w1": {"ios": "OLD"}}) == []


def test_a_background_push_never_goes_to_a_named_iphone(mod) -> None:
    assert _background(mod, ONE, ONE_TOKENS, targets=["p1"]) == []


def test_a_background_push_to_every_watch_sends_each_its_own_token(mod) -> None:
    secrets = {**ONE, "w2": _watch("u1", owner="p1"), "w3": _watch("u1", owner="p1")}
    tokens = {**ONE_TOKENS, "w2": {"watchos": "W2"}}
    assert _background(mod, secrets, tokens) == [("w1", "W1"), ("w2", "W2")]


# ── the helpers the replies and sensors read ─────────────────────────────


def test_phone_watch_ids_lists_the_user_s_watches_and_unbound_owned_ones(mod) -> None:
    secrets = {
        "p1": _phone("u1"),
        "w1": _watch("u1"),
        "w2": _watch(None, owner="p1"),
        "w3": _watch("u2", owner="p1"),
        "w4": _watch(None, owner="p2"),
        "p2": _phone("u1"),
    }
    assert mod.phone_watch_ids(secrets, "p1") == ["w1", "w2"]
    assert mod.phone_watch_ids({"p1": _phone(None), "w2": _watch(None, owner="p1")}, "p1") == [
        "w2"
    ]


def test_watch_phone_ids_counts_the_phones_a_fast_alert_reaches(mod) -> None:
    secrets = {**ONE, "p2": _phone("u1"), "p3": _phone("u1")}
    tokens = _tokens(mod, {**ONE_TOKENS, "p2": {"ios": "P2"}})
    assert mod.watch_phone_ids(secrets, tokens, "w1") == ["p1", "p2"]


def test_owning_phone_id_prefers_the_owner_then_the_user_s_only_phone(mod) -> None:
    secrets = {"p1": _phone("u1"), "p2": _phone("u2"), "w1": _watch("u2", owner="p1")}
    assert mod.owning_phone_id(secrets, "w1") == "p1"
    secrets["w1"] = _watch("u2", owner="gone")
    assert mod.owning_phone_id(secrets, "w1") == "p2"
    secrets["p3"] = _phone("u2")
    assert mod.owning_phone_id(secrets, "w1") is None
    assert mod.owning_phone_id(secrets, "unknown") is None


def test_the_iphone_kind_matches_the_secret_store_s() -> None:
    """notifications.py repeats the constant to stay free of HA imports."""
    from pathlib import Path

    src = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
    assert 'DEVICE_KIND_IPHONE = "iphone"' in (src / "widget_secret_store.py").read_text()
    assert '_DEVICE_KIND_IPHONE = "iphone"' in (src / "notifications.py").read_text()
