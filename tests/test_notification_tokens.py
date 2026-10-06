"""Pure-unit regression tests for NotificationTokenStore.

``register()``, and (step 6) the one-time move of iPhone tokens from their
companion watch's id to the phone's own, ``migrate_ios_tokens_to_phones``.

Like test_camera_stream.py (and unlike the HTTP black-box suite), these import
``notifications`` directly and exercise ``register()`` in-process — no HA
instance, no HA_URL/HA_TOKEN, so they run in plain CI.

They guard the relay_token lifecycle. The hosted relay binds a ``relay_token``
to one specific APNs ``device_token``; a send with a mismatched pair is rejected
as ``device_token_mismatch``. After an app reinstall/update APNs re-issues the
device_token, and the app re-registers it with no relay_token (the relay_token
is server-internal). register() must DROP the stale relay_token on a token
change so the next send re-registers and rebinds — otherwise the user hits
``device_token_mismatch`` until they manually re-run setup.

``notifications`` imports ``homeassistant.helpers.storage.Store`` and its
package-local ``.const`` at load time; both are stubbed here.
"""

from __future__ import annotations

import asyncio
import contextlib
import importlib.util
import sys
import types
from pathlib import Path

_NOTIFICATIONS_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "notifications.py"
)

_PKG = "wa_notif_test_pkg"


class _FakeStore:
    """Stand-in for homeassistant.helpers.storage.Store.

    register() constructs a Store in __init__ and calls async_delay_save() (not
    awaited) on each change; both are no-ops here so the store works in-process.
    """

    def __init__(self, *args: object, **kwargs: object) -> None:
        pass

    def async_delay_save(self, *args: object, **kwargs: object) -> None:
        pass


@contextlib.contextmanager
def _loaded_notifications():
    """Load a fresh copy of ``notifications`` with HA + .const stubbed, then restore.

    Snapshots sys.modules and restores it on exit so the stubs can't leak into
    the rest of the session.
    """
    saved_modules = dict(sys.modules)
    try:
        def stub(name: str, **attrs: object) -> None:
            module = sys.modules.get(name) or types.ModuleType(name)
            for key, value in attrs.items():
                setattr(module, key, value)
            sys.modules[name] = module

        stub("homeassistant")
        stub("homeassistant.helpers")
        stub("homeassistant.helpers.storage", Store=_FakeStore)
        stub("homeassistant.core", HomeAssistant=type("HomeAssistant", (), {}))

        # Synthetic parent package so notifications' ``from .const import ...``
        # relative import resolves without dragging in the real package __init__.
        pkg = types.ModuleType(_PKG)
        pkg.__path__ = []  # mark as a package
        sys.modules[_PKG] = pkg
        stub(
            f"{_PKG}.const",
            NOTIFICATION_TOKEN_STORAGE_KEY="wrist_assistant_notification_tokens",
            NOTIFICATION_TOKEN_STORAGE_VERSION=1,
        )

        spec = importlib.util.spec_from_file_location(
            f"{_PKG}.notifications", _NOTIFICATIONS_PATH
        )
        module = importlib.util.module_from_spec(spec)
        # Register before exec so dataclass(slots=True) introspection resolves it.
        sys.modules[f"{_PKG}.notifications"] = module
        spec.loader.exec_module(module)
        yield module
    finally:
        for key in list(sys.modules):
            if key not in saved_modules:
                del sys.modules[key]
        sys.modules.update(saved_modules)


def _new_store(mod):
    return mod.NotificationTokenStore(object())


def test_register_keeps_relay_token_when_same_device_token() -> None:
    """Re-registering the same token (the long-poll piggyback path, no
    relay_token) must preserve the cached relay binding."""
    with _loaded_notifications() as mod:
        store = _new_store(mod)
        assert store.register("w1", "tokenA", relay_token="RELAY1") == "new"
        assert store.get_entry("w1", "watchos").relay_token == "RELAY1"

        # Same token + env, no relay_token supplied → idempotent, binding kept.
        assert store.register("w1", "tokenA") == "idempotent"
        assert store.get_entry("w1", "watchos").relay_token == "RELAY1"


def test_register_clears_stale_relay_token_on_device_token_change() -> None:
    """THE regression guard: a reinstall issues a new device_token; the app
    re-registers it with no relay_token. The stale binding must be dropped."""
    with _loaded_notifications() as mod:
        store = _new_store(mod)
        store.register("w1", "tokenA", relay_token="RELAY1")

        result = store.register("w1", "tokenB")  # new APNs token, no relay_token
        assert result == "updated"
        entry = store.get_entry("w1", "watchos")
        assert entry.device_token == "tokenB"
        assert entry.relay_token is None  # stale RELAY1 discarded, not retained


def test_register_uses_explicit_relay_token_on_token_change() -> None:
    """An explicit relay_token (as APNsClient._register_device passes after a
    rebind) always wins, even across a device_token change."""
    with _loaded_notifications() as mod:
        store = _new_store(mod)
        store.register("w1", "tokenA", relay_token="RELAY1")

        result = store.register("w1", "tokenB", relay_token="RELAY2")
        assert result == "updated"
        assert store.get_entry("w1", "watchos").relay_token == "RELAY2"


def test_register_clears_stale_relay_token_per_platform() -> None:
    """The ios (mirror) token goes through the same method; a companion-iPhone
    reinstall must clear its stale binding without touching the watchos entry."""
    with _loaded_notifications() as mod:
        store = _new_store(mod)
        store.register("w1", "watchTokenA", platform="watchos", relay_token="WRELAY")
        store.register("w1", "iosTokenA", platform="ios", relay_token="IRELAY")

        # iPhone reinstalls → new ios token, no relay_token.
        store.register("w1", "iosTokenB", platform="ios")

        assert store.get_entry("w1", "ios").relay_token is None
        assert store.get_entry("w1", "ios").device_token == "iosTokenB"
        # watchos binding untouched.
        assert store.get_entry("w1", "watchos").relay_token == "WRELAY"


# ── step 6: the one-time move of iPhone tokens to their phones ───────────


def _phone(user_id: str | None = None):
    return types.SimpleNamespace(device_kind="iphone", user_id=user_id, owner_iphone_id=None)


def _watch(user_id: str | None = None, owner: str | None = None):
    return types.SimpleNamespace(device_kind="watch", user_id=user_id, owner_iphone_id=owner)


class _LoadableStore:
    """A Store stand-in that hands back what was last saved."""

    def __init__(self) -> None:
        self.saved: dict | None = None

    async def async_load(self):
        return self.saved

    def async_delay_save(self, serialize, *_args: object) -> None:
        self.saved = serialize()


def _store_with(mod, tokens: dict[str, dict[str, tuple[str, str | None]]]):
    """A store holding ``{id: {platform: (device_token, relay_token)}}``."""
    store = _new_store(mod)
    store._store = _LoadableStore()
    for store_id, by_platform in tokens.items():
        for platform, (device_token, relay_token) in by_platform.items():
            store.register(store_id, device_token, platform=platform, relay_token=relay_token)
    return store


def test_the_move_files_a_watch_s_ios_token_under_its_owner_phone() -> None:
    with _loaded_notifications() as mod:
        store = _store_with(
            mod, {"w1": {"watchos": ("watch-tok", "WR"), "ios": ("phone-tok", "IR")}}
        )
        secrets = {"p1": _phone("u1"), "w1": _watch("u1", owner="p1")}

        counts = store.migrate_ios_tokens_to_phones(secrets)

        assert counts == {"moved": 1, "dropped": 0, "left": 0}
        assert sorted(store.get_entries("w1")) == ["watchos"]
        moved = store.get_entry("p1", "ios")
        assert (moved.device_token, moved.relay_token, moved.platform) == (
            "phone-tok", "IR", "ios"
        )
        # The watch's own token and its relay binding are untouched.
        assert store.get_entry("w1", "watchos").relay_token == "WR"


def test_the_move_falls_back_to_the_only_phone_of_the_watch_s_user() -> None:
    with _loaded_notifications() as mod:
        store = _store_with(mod, {"w1": {"ios": ("phone-tok", None)}})
        secrets = {
            "p1": _phone("u1"),
            "p2": _phone("u2"),
            "w1": _watch("u1", owner="gone-phone"),
        }

        assert store.migrate_ios_tokens_to_phones(secrets)["moved"] == 1
        assert store.get_entries("w1") == {}
        assert store.get_entry("p1", "ios").device_token == "phone-tok"


def test_the_move_leaves_a_token_whose_phone_is_not_found() -> None:
    """No owner entry, and the user has two phones (or none): it stays put,
    and routing still reads it there."""
    with _loaded_notifications() as mod:
        store = _store_with(
            mod,
            {
                "w1": {"ios": ("tok-1", None)},
                "w2": {"ios": ("tok-2", None)},
                "w3": {"ios": ("tok-3", None)},
            },
        )
        secrets = {
            "p1": _phone("u1"),
            "p2": _phone("u1"),
            "w1": _watch("u1"),
            "w2": _watch(None),
        }  # w3 has no secret entry at all

        assert store.migrate_ios_tokens_to_phones(secrets) == {
            "moved": 0, "dropped": 0, "left": 3
        }
        for watch_id, token in (("w1", "tok-1"), ("w2", "tok-2"), ("w3", "tok-3")):
            assert store.get_entry(watch_id, "ios").device_token == token
        assert store.ios_tokens_moved is True


def test_the_move_keeps_the_phone_s_own_token_and_drops_the_watch_s() -> None:
    with _loaded_notifications() as mod:
        store = _store_with(
            mod,
            {
                "p1": {"ios": ("own-tok", "OWN")},
                "w1": {"watchos": ("watch-tok", None), "ios": ("old-tok", "OLD")},
                "w2": {"ios": ("old-tok", "OLD")},
            },
        )
        secrets = {
            "p1": _phone("u1"),
            "w1": _watch("u1", owner="p1"),
            "w2": _watch("u1", owner="p1"),
        }

        assert store.migrate_ios_tokens_to_phones(secrets) == {
            "moved": 0, "dropped": 2, "left": 0
        }
        assert store.get_entry("p1", "ios").device_token == "own-tok"
        assert store.get_entry("p1", "ios").relay_token == "OWN"
        assert sorted(store.get_entries("w1")) == ["watchos"]
        assert "w2" not in store.all_entries


def test_a_token_already_under_a_phone_is_not_moved() -> None:
    with _loaded_notifications() as mod:
        store = _store_with(mod, {"p1": {"ios": ("own-tok", None)}})
        assert store.migrate_ios_tokens_to_phones({"p1": _phone("u1")}) == {
            "moved": 0, "dropped": 0, "left": 0
        }
        assert store.get_entry("p1", "ios").device_token == "own-tok"


def test_the_move_runs_once_and_its_flag_survives_a_restart() -> None:
    with _loaded_notifications() as mod:
        store = _store_with(mod, {"w1": {"ios": ("phone-tok", None)}})
        secrets = {"p1": _phone("u1"), "w1": _watch("u1", owner="p1")}
        assert store.migrate_ios_tokens_to_phones(secrets)["moved"] == 1
        assert store._store.saved["ios_tokens_moved"] is True

        # A token an old app files under the watch afterwards stays there:
        # the move never runs again, on this instance or after a restart.
        store.register("w1", "phone-tok-2", platform="ios")
        assert store.migrate_ios_tokens_to_phones(secrets) is None
        assert store.get_entry("w1", "ios").device_token == "phone-tok-2"

        reloaded = _new_store(mod)
        reloaded._store = store._store
        asyncio.run(reloaded.async_load())
        assert reloaded.ios_tokens_moved is True
        assert reloaded.migrate_ios_tokens_to_phones(secrets) is None
        assert reloaded.get_entry("p1", "ios").device_token == "phone-tok"


def test_a_store_from_before_the_move_has_no_flag() -> None:
    with _loaded_notifications() as mod:
        store = _store_with(mod, {"w1": {"watchos": ("watch-tok", None)}})
        assert "ios_tokens_moved" not in store._store.saved
        assert store.ios_tokens_moved is False


def test_registering_a_phone_s_token_drops_its_copies_under_watches() -> None:
    with _loaded_notifications() as mod:
        store = _store_with(
            mod,
            {
                "w1": {"watchos": ("watch-tok", None), "ios": ("phone-tok", None)},
                "w2": {"ios": ("phone-tok", None)},
                "w3": {"ios": ("someone-else", None)},
            },
        )
        store.register("p1", "phone-tok", platform="ios")
        assert store.drop_ios_copies("phone-tok", "p1") == 2
        assert sorted(store.get_entries("w1")) == ["watchos"]
        assert "w2" not in store.all_entries
        assert store.get_entry("w3", "ios").device_token == "someone-else"
        assert store.get_entry("p1", "ios").device_token == "phone-tok"


def test_delivery_modes_lists_only_the_watches_that_said() -> None:
    with _loaded_notifications() as mod:
        store = _new_store(mod)
        store.set_watch_metadata("w1", "delivery_mode", "direct")
        store.set_watch_metadata("w2", "webhook_id", "abc")
        assert store.delivery_modes() == {"w1": "direct"}
