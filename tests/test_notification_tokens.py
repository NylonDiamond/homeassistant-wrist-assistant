"""Pure-unit regression tests for NotificationTokenStore.register().

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
