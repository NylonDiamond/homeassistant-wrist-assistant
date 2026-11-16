"""Android phones and Wear OS watches: the device platform, end to end.

An Android phone pairs as the ``iphone`` kind and a Wear OS watch as the
``watch`` kind, so every rule keeps working; the ``platform`` field beside the
kind says what the device runs (``device_platform.py``). These cover where it
is read and kept (pairing, ``register_secret``, ``update_metadata``, the
secret store file), what the device is called (registry model and the short
name), and where a push goes (an Android phone's ``android`` token, a Wear
watch's own ``wearos`` token, never across the two families). Apple devices
never send a platform, and every Apple path is held by the older suites,
unchanged. No Home Assistant: each module is loaded the way its own suite
loads it.
"""

from __future__ import annotations

import asyncio
import base64
import importlib.util
import types
from pathlib import Path
from typing import Any

import pytest

from device_lookup_loader import paired_device_name
from test_complication_push import _build as _build_complication_push
from test_notification_tokens import _loaded_notifications
from test_pair_requests import loaded_pair_module
from test_push_ops_inprocess import _Env as _PushEnv
from test_widget_secret_user_binding import (
    ALICE,
    _loaded_store,
    _post,
    _register_view_class,
    _update_metadata,
)

_SRC = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
SECRET = base64.b64encode(b"s" * 32).decode("ascii")


@pytest.fixture(scope="module")
def platform_mod():
    spec = importlib.util.spec_from_file_location("wa_platform_only", _SRC / "device_platform.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


# ── the rules ────────────────────────────────────────────────────────────


def test_a_device_that_never_says_is_an_apple_device_of_its_kind(platform_mod) -> None:
    assert platform_mod.resolve_platform("iphone", None) == "ios"
    assert platform_mod.resolve_platform("watch", None) == "watchos"
    assert platform_mod.resolve_platform(None, None) == "watchos"


def test_a_reported_platform_counts_only_when_it_fits_the_kind(platform_mod) -> None:
    assert platform_mod.resolve_platform("iphone", "android") == "android"
    assert platform_mod.resolve_platform("watch", "wearos") == "wearos"
    # A watch never reads as a phone, whatever it once wrote.
    assert platform_mod.resolve_platform("watch", "android") == "watchos"
    assert platform_mod.resolve_platform("iphone", "wearos") == "ios"
    assert platform_mod.resolve_platform("iphone", "symbian") == "ios"


def test_parsing_forgives_case_and_space_and_refuses_anything_else(platform_mod) -> None:
    assert platform_mod.parse_platform(None) is None
    assert platform_mod.parse_platform(" Android ") == "android"
    assert platform_mod.parse_platform("wearos") == "wearos"
    for bad in ("", "tizen", 3, True, ["android"]):
        with pytest.raises(platform_mod.PlatformError):
            platform_mod.parse_platform(bad)


def test_each_platform_has_its_own_model_name_and_noun(platform_mod) -> None:
    cases = {
        ("iphone", None): ("iPhone", "iPhone 1a2b3c4d", "iPhone"),
        ("watch", None): ("Apple Watch", "Watch 1a2b3c4d", "watch"),
        ("iphone", "android"): ("Android phone", "Android phone 1a2b3c4d", "phone"),
        ("watch", "wearos"): ("Wear OS watch", "Wear OS watch 1a2b3c4d", "watch"),
    }
    for (kind, platform), (model, name, noun) in cases.items():
        assert platform_mod.device_model(kind, platform) == model
        assert platform_mod.default_device_name(kind, platform, "1a2b3c4d-rest") == name
        assert platform_mod.device_noun(kind, platform) == noun
    assert platform_mod.WATCH_MODELS == {"Apple Watch", "Wear OS watch"}
    assert platform_mod.PHONE_MODELS == {"iPhone", "Android phone"}
    assert platform_mod.FCM_PLATFORMS == {"android", "wearos"}


def test_the_short_name_on_a_device_with_no_registry_entry_follows_its_platform() -> None:
    wear = types.SimpleNamespace(device_kind="watch", platform="wearos", device_name=None)
    phone = types.SimpleNamespace(device_kind="iphone", platform="android", device_name=None)
    apple = types.SimpleNamespace(device_kind="watch", platform=None, device_name=None)
    assert paired_device_name(None, wear, "abcdef1234") == "Wear OS watch abcdef12"
    assert paired_device_name(None, phone, "abcdef1234") == "Android phone abcdef12"
    assert paired_device_name(None, apple, "abcdef1234") == "Watch abcdef12"


def test_the_selector_filters_offer_the_android_devices() -> None:
    paths = [
        _SRC / "services.yaml",
        _SRC / "blueprints" / "script" / "watch_notification.yaml",
        _SRC.parents[1] / "blueprints" / "script" / "wrist_assistant" / "watch_notification.yaml",
    ]
    for path in paths:
        text = path.read_text()
        for model in ("Apple Watch", "iPhone", "Wear OS watch", "Android phone"):
            assert f"model: {model}\n" in text, (path, model)


# ── pairing ──────────────────────────────────────────────────────────────


def test_a_code_pairing_keeps_the_platform_it_was_told() -> None:
    with loaded_pair_module() as mod:
        key = base64.b64encode(bytes(range(1, 33))).decode("ascii")
        start, error = mod.validate_pair_start(
            {"watch_id": "wear-1", "public_key_b64": key, "kind": "watch", "platform": "wearos"}
        )
        assert error is None
        assert start.fields.platform == "wearos"
        phone, error = mod.validate_pair_start(
            {"watch_id": "pixel-1", "public_key_b64": key, "kind": "iphone", "platform": "android"}
        )
        assert error is None and phone.fields.platform == "android"
        # An Apple app sends none.
        apple, error = mod.validate_pair_start({"watch_id": "aw-1", "public_key_b64": key})
        assert error is None and apple.fields.platform is None


def test_a_platform_of_the_other_kind_or_an_unknown_one_is_refused() -> None:
    with loaded_pair_module() as mod:
        key = base64.b64encode(bytes(range(1, 33))).decode("ascii")
        for body in (
            {"kind": "watch", "platform": "android"},
            {"kind": "iphone", "platform": "wearos"},
            {"kind": "watch", "platform": "tizen"},
            {"kind": "watch", "platform": 7},
        ):
            _start, error = mod.validate_pair_start(
                {"watch_id": "d-1", "public_key_b64": key, **body}
            )
            assert error is not None and error.code == "invalid_platform", body
            assert error.status == 400
        # The bearer and redeem paths judge the kind by the label.
        _f, error = mod.validate_pair_fields(
            {"watch_id": "p-1", "secret_b64": SECRET, "label": "iphone-self-provision", "platform": "wearos"}
        )
        assert error is not None and error.code == "invalid_platform"
        fields, error = mod.validate_pair_fields(
            {"watch_id": "p-1", "secret_b64": SECRET, "label": "iphone-self-provision", "platform": "android"}
        )
        assert error is None and fields.platform == "android"


def test_register_secret_stores_the_platform() -> None:
    with _loaded_store() as store_mod:
        store = store_mod.WidgetSecretStore(object())
        hass = types.SimpleNamespace(
            data={"wrist_assistant": types.SimpleNamespace(widget_secret_store=store)}
        )
        env = types.SimpleNamespace(store=store, view=_register_view_class()(hass))
        reply = _post(
            env,
            {"watch_id": "pixel-1", "label": "iphone-self-provision", "platform": "android"},
            ALICE,
        )
        assert reply.status == 200, reply.body
        entry = store.get("pixel-1")
        assert entry.platform == "android"
        assert entry.device_kind == "iphone"
        assert entry.device_platform == "android"
        refused = _post(
            env, {"watch_id": "w-2", "label": "watch-code-pair", "platform": "android"}, ALICE
        )
        assert refused.status == 400


# ── the secret store ─────────────────────────────────────────────────────


@pytest.fixture
def store():
    with _loaded_store() as store_mod:
        yield store_mod.WidgetSecretStore(object())


def test_the_file_carries_a_platform_only_once_one_was_said(store) -> None:
    store.register("aw-1", SECRET, "watch-code-pair")
    store.register("wear-1", SECRET, "watch-code-pair", platform="wearos")
    saved = store._serialize()["secrets"]
    assert "platform" not in saved["aw-1"]
    assert saved["wear-1"]["platform"] == "wearos"
    assert store.get("aw-1").device_platform == "watchos"
    assert store.get("wear-1").device_platform == "wearos"


def test_a_reload_reads_the_platform_back(store) -> None:
    store.register("pixel-1", SECRET, "iphone-self-provision", platform="android")
    saved = store._serialize()
    store._store.async_load = lambda: _immediately(saved)
    store._secrets.clear()
    asyncio.run(store.async_load())
    assert store.get("pixel-1").platform == "android"


async def _immediately(value: Any) -> Any:
    return value


def test_a_registration_naming_no_platform_keeps_the_stored_one(store) -> None:
    store.register("pixel-1", SECRET, "iphone-self-provision", platform="android")
    assert store.register("pixel-1", SECRET, "iphone-self-provision") == "idempotent"
    assert store.get("pixel-1").platform == "android"


def test_the_metadata_refresh_stores_a_fitting_platform_and_ignores_the_rest(store) -> None:
    store.register("wear-1", SECRET, "watch-code-pair")
    assert store.update_metadata("wear-1", platform="android") is True
    assert store.get("wear-1").platform is None
    assert store.update_metadata("wear-1", platform="tizen") is True
    assert store.get("wear-1").platform is None
    assert store.update_metadata("wear-1", platform="wearos") is True
    assert store.get("wear-1").platform == "wearos"
    # Saying nothing leaves it.
    store.update_metadata("wear-1", app_version="0.2.0")
    assert store.get("wear-1").platform == "wearos"


def test_the_metadata_op_echoes_a_platform_only_for_a_device_that_said_one() -> None:
    with _loaded_store() as store_mod:
        store = store_mod.WidgetSecretStore(object())
        env = types.SimpleNamespace(store=store)
        store.register("aw-1", SECRET, "watch-code-pair")
        store.register("wear-1", SECRET, "watch-code-pair")
        apple = _update_metadata(env, "aw-1", {"app_version": "3.2.0"})
        assert apple.status == 200 and "platform" not in apple.body
        wear = _update_metadata(env, "wear-1", {"app_version": "0.2.0", "platform": "wearos"})
        assert wear.status == 200
        assert wear.body["platform"] == "wearos"
        assert store.get("wear-1").platform == "wearos"


def test_stored_metadata_carries_the_platform_only_once_one_was_said(store) -> None:
    store.register("aw-1", SECRET, "watch-code-pair")
    store.register("ip-1", SECRET, "iphone-self-provision")
    store.register("wear-1", SECRET, "watch-code-pair", platform="wearos")
    store.register("pixel-1", SECRET, "iphone-self-provision", platform="android")
    # An Apple device's reply is the one it always was.
    assert store.stored_metadata("aw-1") == {"app_version": "", "standard_settings": None}
    assert store.stored_metadata("ip-1") == {"app_version": ""}
    assert store.stored_metadata("wear-1") == {
        "app_version": "",
        "standard_settings": None,
        "platform": "wearos",
    }
    assert store.stored_metadata("pixel-1") == {"app_version": "", "platform": "android"}
    # A Wear watch paired before the field reports it later, and the reply
    # then says so.
    store.register("wear-2", SECRET, "watch-code-pair")
    assert "platform" not in store.stored_metadata("wear-2")
    store.update_metadata("wear-2", platform="wearos")
    assert store.stored_metadata("wear-2")["platform"] == "wearos"


def test_the_integration_advertises_that_it_knows_the_platforms() -> None:
    const = (_SRC / "const.py").read_text()
    init = (_SRC / "__init__.py").read_text()
    assert 'DEVICE_PLATFORMS_CAPABILITY = "device_platforms"' in const
    assert "coordinator.register_capability(DEVICE_PLATFORMS_CAPABILITY)" in init


def test_the_general_refusals_say_phone_once_an_android_device_is_paired() -> None:
    """General copy keeps the Apple words while every paired device is an
    Apple one (`device_platform.general_words`)."""
    init = (_SRC / "__init__.py").read_text()
    assert 'phone = general_words(' in init and '"iPhone", "phone"' in init
    assert '"{phone} again as the target."' in init
    assert "is not a watch or {phone} paired with \"" in init
    pairing = (_SRC / "pairing_ws.py").read_text()
    assert 'noun = general_words(entries, "iPhone", "phone")' in pairing


def _entry(kind: str, platform: str | None = None):
    return types.SimpleNamespace(device_kind=kind, platform=platform)


def test_paired_platforms_lists_every_device_s_platform_once(platform_mod) -> None:
    mod = platform_mod
    assert mod.paired_platforms({}) == []
    assert mod.paired_platforms(None) == []
    apple = {"w": _entry("watch"), "p": _entry("iphone"), "w2": _entry("watch", "watchos")}
    assert mod.paired_platforms(apple) == ["ios", "watchos"]
    assert not mod.home_has_android(apple)
    assert mod.general_words(apple, "iPhone", "phone") == "iPhone"
    # A platform that does not fit the kind reads as the kind's Apple one.
    assert mod.paired_platforms({"p": _entry("iphone", "wearos")}) == ["ios"]
    wear = {**apple, "x": _entry("watch", "wearos")}
    assert mod.paired_platforms(wear) == ["ios", "watchos", "wearos"]
    assert mod.home_has_android(wear)
    assert mod.general_words(wear, "iPhone", "phone") == "phone"
    pixel = [_entry("iphone", "android")]
    assert mod.paired_platforms(pixel) == ["android"]
    assert mod.home_has_android(pixel)


# ── push routing ─────────────────────────────────────────────────────────


def _device(kind: str, user: str | None, platform: str | None = None, owner: str | None = None):
    return types.SimpleNamespace(
        device_kind=kind, user_id=user, owner_iphone_id=owner, platform=platform
    )


@pytest.fixture(scope="module")
def notif():
    with _loaded_notifications() as loaded:
        yield loaded


def _tokens(mod, spec: dict[str, dict[str, str]]) -> dict:
    return {
        store_id: {
            platform: mod.TokenEntry(device_token=token, platform=platform, environment="production")
            for platform, token in by_platform.items()
        }
        for store_id, by_platform in spec.items()
    }


def _sends(mod, secrets, tokens, modes=None, targets=None, push_type="alert"):
    routes = mod.resolve_push_routes(
        secrets, _tokens(mod, tokens), modes or {}, targets, push_type=push_type
    )
    return [(route.store_id, route.entry.device_token) for route in routes]


# One person with an Android phone and a Wear watch, and an iPhone and an
# Apple Watch too, as someone moving between the two might have.
MIXED = {
    "pixel": _device("iphone", "u1", "android"),
    "wear": _device("watch", "u1", "wearos"),
    "iphone": _device("iphone", "u1"),
    "aw": _device("watch", "u1"),
}
MIXED_TOKENS = {
    "pixel": {"android": "PX"},
    "wear": {"wearos": "WR"},
    "iphone": {"ios": "IP"},
    "aw": {"watchos": "AW"},
}


def test_a_wear_watch_on_mirror_goes_through_the_android_phone(notif) -> None:
    assert _sends(notif, MIXED, MIXED_TOKENS, targets=["wear"]) == [("pixel", "PX")]


def test_an_apple_watch_on_mirror_still_goes_through_the_iphone_only(notif) -> None:
    assert _sends(notif, MIXED, MIXED_TOKENS, targets=["aw"]) == [("iphone", "IP")]


def test_a_wear_watch_on_direct_gets_its_own_token(notif) -> None:
    assert _sends(notif, MIXED, MIXED_TOKENS, {"wear": "direct"}, ["wear"]) == [("wear", "WR")]


def test_a_wear_watch_with_no_android_phone_falls_back_to_its_own_token(notif) -> None:
    secrets = {"wear": MIXED["wear"], "iphone": MIXED["iphone"]}
    tokens = {"wear": {"wearos": "WR"}, "iphone": {"ios": "IP"}}
    # The iPhone of the same person cannot bridge to a Wear watch.
    assert _sends(notif, secrets, tokens, targets=["wear"]) == [("wear", "WR")]


def test_a_background_push_reaches_a_wear_watch_s_own_token(notif) -> None:
    assert _sends(notif, MIXED, MIXED_TOKENS, push_type="background") == [
        ("aw", "AW"),
        ("wear", "WR"),
    ]


def test_an_android_phone_named_as_the_target_gets_its_own_token(notif) -> None:
    assert _sends(notif, MIXED, MIXED_TOKENS, targets=["pixel"]) == [("pixel", "PX")]


def test_the_phones_a_wear_watch_s_alert_reaches_are_its_user_s_android_phones(notif) -> None:
    tokens = _tokens(notif, MIXED_TOKENS)
    assert notif.watch_phone_ids(MIXED, tokens, "wear") == ["pixel"]
    assert notif.watch_phone_ids(MIXED, tokens, "aw") == ["iphone"]
    assert notif.mirror_platform(MIXED["wear"]) == "android"
    assert notif.mirror_platform(None) == "ios"


def _push_env(notif, entries):
    return _PushEnv(notif, entries)


def test_an_android_phone_registers_its_token_under_its_own_id(notif) -> None:
    env = _push_env(notif, {"pixel": _device("iphone", "u1", "android"), "wear": _device("watch", "u1", "wearos")})
    reply = env.call(
        "notifications_register",
        "pixel",
        {"device_token": "PX", "platform": "android", "environment": "development"},
    )
    assert reply.status == 200, reply.text
    entry = env.tokens.get_entry("pixel", "android")
    assert entry.device_token == "PX"
    # FCM has no sandbox.
    assert entry.environment == "production"
    assert env.prebound == [("pixel", "android")]
    assert reply.body["platforms"] == ["android"]


def test_an_android_phone_counts_only_the_wear_watches_it_can_bridge_to(notif) -> None:
    env = _push_env(notif, {
        "pixel": _device("iphone", "u1", "android"),
        "wear": _device("watch", "u1", "wearos"),
        "aw": _device("watch", "u1"),
        "iphone": _device("iphone", "u1"),
    })
    android = env.call("notifications_register", "pixel", {"device_token": "PX", "platform": "android"})
    assert android.body["watches"] == 1 and android.body["fast_watches"] == 1
    iphone = env.call("notifications_register", "iphone", {"device_token": "IP", "platform": "ios"})
    assert iphone.body["watches"] == 1


def test_a_phone_s_watches_are_those_of_its_own_family(notif) -> None:
    assert notif.phone_family_watch_ids(MIXED, "pixel") == ["wear"]
    assert notif.phone_family_watch_ids(MIXED, "iphone") == ["aw"]
    # phone_watch_ids itself still gives both, for the rules that read it.
    assert notif.phone_watch_ids(MIXED, "pixel") == ["aw", "wear"]


def _mixed_push_env(notif):
    env = _push_env(notif, dict(MIXED))
    for store_id, by_platform in MIXED_TOKENS.items():
        for platform, token in by_platform.items():
            env.tokens.register(store_id, token, platform=platform)
    return env


def test_an_android_phone_s_test_reaches_only_its_wear_watch(notif) -> None:
    env = _mixed_push_env(notif)
    reply = env.call("send_test_notification", "pixel", {})
    assert reply.body == {"ok": True, "sent": 1}
    assert env.delivered == [["wear"]]
    # Mirrored through the Android phone's own token, never the iPhone's.
    assert env.pushes[-1]["routes"] == [("pixel", "android")]


def test_an_iphone_s_test_in_a_mixed_home_reaches_only_its_apple_watch(notif) -> None:
    env = _mixed_push_env(notif)
    reply = env.call("send_test_notification", "iphone", {})
    assert reply.body == {"ok": True, "sent": 1}
    assert env.delivered == [["aw"]]
    assert env.pushes[-1]["routes"] == [("iphone", "ios")]


def test_a_direct_wear_watch_gets_the_android_phone_s_test_on_its_own_token(notif) -> None:
    env = _mixed_push_env(notif)
    env.tokens.set_watch_metadata("wear", "delivery_mode", "direct")
    env.tokens.set_watch_metadata("aw", "delivery_mode", "direct")
    assert env.call("send_test_notification", "pixel", {}).body == {"ok": True, "sent": 1}
    assert env.pushes[-1]["routes"] == [("wear", "wearos")]


def test_an_android_phone_whose_user_has_only_apple_watches_tests_itself(notif) -> None:
    env = _push_env(notif, {
        "pixel": _device("iphone", "u1", "android"),
        "aw": _device("watch", "u1"),
    })
    env.tokens.register("pixel", "PX", platform="android")
    env.tokens.register("aw", "AW", platform="watchos")
    reply = env.call("send_test_notification", "pixel", {})
    assert reply.body == {"ok": True, "sent": 1}
    assert env.delivered == [["pixel"]]
    assert env.pushes[-1]["routes"] == [("pixel", "android")]


def test_a_wear_watch_registers_wearos_and_a_mismatch_is_refused(notif) -> None:
    env = _push_env(notif, {"pixel": _device("iphone", "u1", "android"), "wear": _device("watch", "u1", "wearos")})
    ok = env.call("notifications_register", "wear", {"device_token": "WR", "platform": "wearos"})
    assert ok.status == 200
    assert env.tokens.get_entry("wear", "wearos").device_token == "WR"
    assert env.call(
        "notifications_register", "wear", {"device_token": "X", "platform": "android"}
    ).status == 400
    assert env.call(
        "notifications_register", "pixel", {"device_token": "X", "platform": "wearos"}
    ).status == 400


def test_a_wear_watch_asks_its_android_phone_to_show_pro(notif) -> None:
    env = _push_env(notif, {"pixel": _device("iphone", "u1", "android"), "wear": _device("watch", "u1", "wearos")})
    env.tokens.register("pixel", "PX", platform="android")
    reply = env.call("pro_open_on_phone", "wear", {})
    assert reply.body["ok"] is True
    assert env.delivered == [["pixel"]]
    # Over FCM to the phone's android token, with the key the Android app
    # opens the paywall on.
    assert env.pushes[-1]["routes"] == [("pixel", "android")]
    assert env.pushes[-1]["extra"] == {"wa_open_pro": True}


def test_pro_on_the_phone_stays_in_each_watch_s_own_store(notif) -> None:
    # One person with both families: each watch asks only its own family's
    # phones, since Pro is bought in each store.
    env = _push_env(notif, dict(MIXED))
    env.tokens.register("pixel", "PX", platform="android")
    env.tokens.register("iphone", "IP", platform="ios")
    assert env.call("pro_open_on_phone", "wear", {}).body["ok"] is True
    assert env.call("pro_open_on_phone", "aw", {}).body["ok"] is True
    assert env.delivered == [["pixel"], ["iphone"]]
    assert [p["routes"] for p in env.pushes] == [[("pixel", "android")], [("iphone", "ios")]]


def test_a_wear_watch_with_only_an_iphone_is_told_it_has_no_phone(notif) -> None:
    env = _push_env(notif, {"iphone": _device("iphone", "u1"), "wear": _device("watch", "u1", "wearos")})
    env.tokens.register("iphone", "IP", platform="ios")
    assert env.call("pro_open_on_phone", "wear", {}).body == {"ok": False, "reason": "no_phone"}
    assert env.delivered == []


def test_an_android_phone_cannot_ask_for_pro_on_a_phone(notif) -> None:
    env = _push_env(notif, {"pixel": _device("iphone", "u1", "android"), "wear": _device("watch", "u1", "wearos")})
    env.tokens.register("pixel", "PX", platform="android")
    assert env.call("pro_open_on_phone", "pixel", {}).body == {"ok": False, "reason": "not_a_watch"}


# ── the relay and the phone's complication push ──────────────────────────


def test_an_fcm_send_names_its_platform_and_an_apple_one_does_not() -> None:
    source = (_SRC / "apns_client.py").read_text()
    assert 'if is_fcm_platform(entry.platform):\n            payload["platform"] = entry.platform' in source


def test_no_sound_is_forced_on_an_fcm_push() -> None:
    source = (_SRC / "__init__.py").read_text()
    assert 'elif tok_entry.platform == "ios" and not target_sound:' in source


def test_an_android_phone_gets_its_complication_push_through_its_own_token() -> None:
    for env in _build_complication_push():
        env.secrets.register(
            "pixel-1", env._secret, env.secrets_mod.LABEL_IPHONE_SELF_PROVISION, platform="android"
        )
        env.tokens.register("pixel-1", "android", "fcm-tok")
        assert env.push.push_available("pixel-1") is True
        assert env.push.push_now("pixel-1", "refresh") is True
        assert len(env.sends) == 1
        send = env.sends[0]
        assert send["platform"] == "android"
        assert send["device_token"] == "fcm-tok"
        assert send["push_type"] == "background"
