"""In-process tests for the complication panel's WebSocket commands.

Loads ``complication_ws.py`` with stubbed Home Assistant modules, the same
approach ``test_delta_coordinator_inprocess.py`` takes with ``api.py``, so the
shape of an owner row can be asserted field by field with no live box. The
live HTTP suite still covers the round trip.

``test_ws_command_registration.py`` is the other half of the coverage here and
stays static: it reads the module's AST to prove every command is registered
and gated. This one runs them.

The owner row is a wire contract two other codebases build against (the panel
and the iOS app), which is why the watch row is asserted as a whole dict
rather than field by field: a key that quietly disappears is exactly the
failure this catches.
"""

from __future__ import annotations

import asyncio
import base64
import contextlib
import copy
import importlib.util
import sys
import types
import uuid
from dataclasses import dataclass, field
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import pytest

_SRC = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"

_PKG = "wa_ws_test_pkg"
DOMAIN = "wrist_assistant"
MAX_SCHEMA = 6
# The reserved owner that is not a device. Spelled here rather than imported
# because the const module is stubbed above, and the literal is the wire
# contract two other codebases build against.
LIBRARY = "library"


def _library_row(count: int = 0, token: int = 0) -> dict:
    """The Library row exactly as the owners reply writes it."""
    return {
        "owner_watch_id": LIBRARY,
        "device_kind": "library",
        "device_name": "Library",
        "paired_iphone_name": None,
        "paired_iphone_id": None,
        "app_version": None,
        "app_build": None,
        "screen_size": None,
        "complication_count": count,
        "token": token,
        "applied_token": None,
        "is_orphan": False,
    }


class _FakeStore:
    """Stand-in for homeassistant.helpers.storage.Store, per instance."""

    def __init__(self, *args: object, **kwargs: object) -> None:
        self._saved: dict | None = None

    async def async_load(self):
        return copy.deepcopy(self._saved)

    def async_delay_save(self, serialize, *_args: object, **_kwargs: object) -> None:
        self._saved = copy.deepcopy(serialize())

    async def async_remove(self) -> None:
        self._saved = None


class _Marker:
    """``vol.Required`` / ``vol.Optional``: a hashable schema dict key."""

    def __init__(self, *args: object, **kwargs: object) -> None:
        self.args = args


def _parse_datetime(value: str):
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def _stub(name: str, **attrs: object) -> types.ModuleType:
    module = sys.modules.get(name) or types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module
    parent, _, leaf = name.rpartition(".")
    if parent and parent in sys.modules:
        # ``from homeassistant.helpers import device_registry`` resolves the
        # attribute on the parent package, so registering in sys.modules alone
        # is not enough for every import form.
        setattr(sys.modules[parent], leaf, module)
    return module


def _load(name: str):
    spec = importlib.util.spec_from_file_location(f"{_PKG}.{name}", _SRC / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[f"{_PKG}.{name}"] = module
    spec.loader.exec_module(module)
    return module


@contextlib.contextmanager
def _loaded_modules():
    saved_modules = dict(sys.modules)
    try:
        _stub("homeassistant")
        _stub("homeassistant.components")
        _stub(
            "homeassistant.components.websocket_api",
            ActiveConnection=type("ActiveConnection", (), {}),
            async_register_command=lambda hass, func: None,
            require_admin=lambda func: func,
            websocket_command=lambda schema: (lambda func: func),
            async_response=lambda func: func,
            event_message=lambda msg_id, payload: {"id": msg_id, "event": payload},
        )
        _stub(
            "homeassistant.core",
            HomeAssistant=type("HomeAssistant", (), {}),
            callback=lambda f: f,
        )
        _stub(
            "homeassistant.exceptions",
            HomeAssistantError=type("HomeAssistantError", (Exception,), {}),
        )
        _stub("homeassistant.helpers")
        _stub("homeassistant.helpers.device_registry", async_get=lambda hass: hass.devices)
        _stub("homeassistant.helpers.entity_registry", async_get=lambda hass: hass.entities)
        _stub("homeassistant.helpers.storage", Store=_FakeStore)
        _stub(
            "homeassistant.helpers.template",
            Template=type("Template", (), {}),
            TemplateError=type("TemplateError", (Exception,), {}),
        )
        _stub("homeassistant.util")
        _stub(
            "homeassistant.util.dt",
            parse_datetime=_parse_datetime,
            utcnow=lambda: datetime.now(UTC),
        )
        _stub(
            "voluptuous",
            Required=_Marker,
            Optional=_Marker,
            Any=lambda *a, **k: object(),
            In=lambda *a, **k: object(),
        )

        pkg = types.ModuleType(_PKG)
        pkg.__path__ = []
        sys.modules[_PKG] = pkg
        _stub(
            f"{_PKG}.const",
            DOMAIN=DOMAIN,
            COMPLICATION_STORAGE_KEY="wrist_assistant.custom_complications",
            COMPLICATION_STORAGE_VERSION=1,
            COMPLICATION_MAX_SCHEMA_VERSION=MAX_SCHEMA,
            COMPLICATION_MAX_DOCUMENT_BYTES=4096,
            COMPLICATION_MAX_LAYERS=64,
            COMPLICATION_MAX_PER_OWNER=8,
            COMPLICATION_MAX_SLOTS=64,
            LIBRARY_OWNER_ID=LIBRARY,
            WIDGET_SECRET_STORAGE_KEY="wrist_assistant.widget_secrets",
            WIDGET_SECRET_STORAGE_VERSION=1,
            WATCH_CONFIG_STORAGE_KEY="wrist_assistant.watch_config",
            WATCH_CONFIG_STORAGE_VERSION=1,
            WATCH_CONFIG_KINDS=frozenset({"pages", "behavior"}),
            WATCH_CONFIG_PANEL_KINDS=frozenset({"pages", "behavior"}),
            WATCH_CONFIG_PANEL_WRITER="panel",
            WATCH_CONFIG_PHONE_KINDS=frozenset({"pages", "behavior"}),
            PHONE_BEHAVIOR_KEYS=frozenset({"wrapPages"}),
            PHONE_BEHAVIOR_DECODE_KEYS=frozenset({"schemaVersion"}),
            WATCH_CONFIG_MAX_DOCUMENT_BYTES={"pages": 4096, "behavior": 4096},
            WATCH_CONFIG_HISTORY_LIMIT=5,
        )
        # Neither series module is exercised here; complication_ws only needs
        # their names to build its command schemas at import time.
        _stub(
            f"{_PKG}.history_series",
            COMBINE_ANY="any",
            COMBINE_ALL="all",
            MODE_NUMERIC="numeric",
            MODE_STATES="states",
            HistorySeriesError=type("HistorySeriesError", (Exception,), {}),
            async_history_series_detail=None,
            normalize_mode=lambda value: value,
            normalize_combine=lambda value: value,
        )
        _stub(
            f"{_PKG}.statistics_series",
            PERIODS=("hour",),
            STAT_TYPES=("mean",),
            StatisticsSeriesError=type("StatisticsSeriesError", (Exception,), {}),
            async_statistics_series=None,
        )
        _stub(
            f"{_PKG}.list_items",
            FORECAST_TYPES=("hourly", "daily", "twiceDaily"),
            SORTS=("list", "due"),
            STATUSES=("open", "done", "all"),
            ListItemsError=type("ListItemsError", (Exception,), {}),
            async_list_items=None,
        )
        # The gallery key is fetched only by the share-to-gallery command,
        # which no test here calls.
        _stub(f"{_PKG}.gallery_key_store", gallery_key_store=None)
        # Only `ws_render_values` reaches for this, and the real one pulls in
        # the whole bundle path; the name is what the import needs.
        _stub(f"{_PKG}.bundle_ops", template_text=str)
        # The parts library has its own tests; the ws module only needs the
        # two names to import.
        _stub(
            f"{_PKG}.parts_store",
            PartsStore=type("PartsStore", (), {}),
            PartsStoreError=type("PartsStoreError", (Exception,), {}),
        )
        # Card previews too: tested in test_card_preview_store.py.
        _stub(
            f"{_PKG}.card_preview_store",
            CardPreviewStore=type("CardPreviewStore", (), {}),
            CardPreviewError=type("CardPreviewError", (Exception,), {}),
        )

        store_mod = _load("complication_store")
        secrets_mod = _load("widget_secret_store")
        # The real one: forget and move reach into it, and what they leave
        # behind is asserted below.
        watch_config_mod = _load("watch_config_store")
        # The real one: the live subscriptions reach the store through it.
        _load("listener_relay")
        # The real one: who may touch which owner is what these tests check.
        _load("panel_access")
        yield _load("complication_ws"), store_mod, secrets_mod, watch_config_mod
    finally:
        for key in list(sys.modules):
            if key not in saved_modules:
                del sys.modules[key]
        sys.modules.update(saved_modules)


# ── fakes the commands read ──────────────────────────────────────────────


@dataclass
class _Device:
    name: str | None = None
    name_by_user: str | None = None
    id: str = field(default_factory=lambda: uuid.uuid4().hex)


class _DeviceRegistry:
    def __init__(self) -> None:
        self.by_identifier: dict[tuple[str, str], _Device] = {}

    def async_update_device(self, device_id: str, **changes):
        for device in self.by_identifier.values():
            if device.id == device_id:
                for key, value in changes.items():
                    setattr(device, key, value)
                return device
        raise KeyError(device_id)

    def async_get_device(self, identifiers=None, **_kwargs):
        for identifier in identifiers or ():
            device = self.by_identifier.get(identifier)
            if device is not None:
                return device
        return None


class _EntityRegistry:
    def async_get_entity_id(self, *_args, **_kwargs):
        # No Last activity sensors in these tests, so `_seconds_since_poll`
        # falls back to the coordinator's answer alone.
        return None


class _Coordinator:
    def __init__(self) -> None:
        self.polling: set[str] = set()
        self.woken: list[tuple[str, bool]] = []
        self.dropped: list[str] = []
        # The secret store, when a test wants to know whether the secret was
        # still there at the drop.
        self.secrets: Any = None
        self.secret_at_drop: dict[str, bool] = {}

    def is_polling(self, watch_id: str) -> bool:
        return watch_id in self.polling

    def seconds_since_poll(self, watch_id: str) -> float | None:
        return 3.0 if watch_id in self.polling else None

    def wake_watch(self, watch_id: str, *, renotify: bool = False) -> None:
        self.woken.append((watch_id, renotify))

    def drop_session(self, watch_id: str) -> bool:
        """What a forget calls first. Records the id, and whether the device
        still had its secret at that moment (set by the test that asks)."""
        self.dropped.append(watch_id)
        if self.secrets is not None:
            self.secret_at_drop[watch_id] = self.secrets.get(watch_id) is not None
        self.polling.discard(watch_id)
        return True


class _Push:
    """Stand-in for ComplicationPhonePush.

    Its own rules (who is a phone, where the token is filed, the debounce and
    the floor) are `test_complication_push.py`'s subject. What matters here is
    only that the two commands ask it and carry its answers into the reply.
    """

    def __init__(self) -> None:
        self.available: set[str] = set()
        self.since: dict[str, int] = {}
        self.pushed: list[tuple[str, str]] = []

    def push_available(self, owner: str) -> bool:
        return owner in self.available

    def seconds_since_push(self, owner: str) -> int | None:
        return self.since.get(owner)

    def push_now(self, owner: str, reason: str) -> bool:
        if owner not in self.available:
            return False
        self.pushed.append((owner, reason))
        return True

    def on_commit(self, owner: str, token: int) -> None:
        """What the store's push hook runs on every commit.

        Gated on `push_available` the way the real one is: an owner no phone
        token stands behind is dropped before a timer is ever scheduled, which
        is why the Library costs a save nothing.
        """
        if not self.push_available(owner):
            return
        self.pushed.append((owner, "save"))


class _Connection:
    # An administrator unless a test says otherwise: an administrator may
    # touch every owner, and the non-admin rules have their own tests here
    # and in test_panel_access.py.
    user: Any = types.SimpleNamespace(id="root", name="Root", is_admin=True)

    def __init__(self) -> None:
        self.results: dict[int, Any] = {}
        self.errors: list[tuple[int, str, str]] = []

    def send_result(self, msg_id: int, payload: Any) -> None:
        self.results[msg_id] = payload

    def send_error(self, msg_id: int, code: str, message: str) -> None:
        self.errors.append((msg_id, code, message))


class _NotificationStore:
    """The two calls ``devices/forget`` makes; no test here holds a token."""

    def get_entries(self, _watch_id: str) -> list:
        return []

    def remove(self, _watch_id: str) -> None:
        return None


class _CameraStreams:
    """Stand-in for CameraStreamCoordinator: notes each device whose streams
    and stream tokens a Forget closed."""

    def __init__(self) -> None:
        self.closed: list[str] = []

    def close_device(self, watch_id: str) -> int:
        self.closed.append(watch_id)
        return 0


class _DomainData:
    def __init__(self, store, secret_store, coordinator, push, watch_config) -> None:
        self.complication_store = store
        self.widget_secret_store = secret_store
        self.coordinator = coordinator
        self.complication_push = push
        self.watch_config_store = watch_config
        self.notification_store = _NotificationStore()
        self.camera_stream_coordinator = _CameraStreams()


class _Hass:
    def __init__(self, domain_data) -> None:
        self.data = {DOMAIN: domain_data}
        self.devices = _DeviceRegistry()
        self.entities = _EntityRegistry()

    def async_create_task(self, coro, name: str | None = None, **_kwargs: object):
        """The watch config forget removes its file through this."""
        return asyncio.run(coro)


@dataclass
class _Env:
    ws: Any
    store: Any
    secrets: Any
    coordinator: _Coordinator
    hass: _Hass
    secrets_mod: Any
    push: _Push
    _slot: int = field(default=0)

    def _register(self, device_id: str, label: str, **extra) -> None:
        self.secrets.register(
            device_id,
            base64.b64encode(b"k" * 32).decode("ascii"),
            label,
            **extra,
        )

    def add_watch(self, device_id: str, **extra) -> None:
        self._register(device_id, self.secrets_mod.LABEL_WATCH_SELF_PROVISION, **extra)

    def add_phone(self, device_id: str, **extra) -> None:
        self._register(device_id, self.secrets_mod.LABEL_IPHONE_SELF_PROVISION, **extra)

    def add_code_watch(self, device_id: str, **extra) -> None:
        """A watch paired by a code an admin confirmed in the panel."""
        self._register(device_id, self.secrets_mod.LABEL_WATCH_CODE_PAIR, **extra)

    def rename_in_ha(self, device_id: str, name: str) -> None:
        """What a user renaming the device in HA's UI leaves behind."""
        self.hass.devices.by_identifier[(DOMAIN, f"watch_{device_id}")] = _Device(
            name="Apple Watch", name_by_user=name
        )

    def save_document(self, owner: str) -> dict:
        document = {
            "schemaVersion": 4,
            "id": str(uuid.uuid4()).upper(),
            "name": "Garage",
            "slotIndex": self._slot,
            "supportedFamilies": ["rectangular", "circular", "corner"],
            "perFamily": {},
            "elements": [{"kind": "text"}],
            "tapAction": {"type": "refresh"},
        }
        self._slot += 1
        self.store.save(owner, document, base_revision=None, updated_by="t")
        return document

    def call(self, command, **msg) -> Any:
        connection = _Connection()
        msg.setdefault("id", 1)
        outcome = command(self.hass, connection, msg)
        if asyncio.iscoroutine(outcome):
            asyncio.run(outcome)
        assert connection.errors == [], connection.errors
        return connection.results[1]

    def owners(self) -> list[dict]:
        return self.call(self.ws.ws_owners)["owners"]


@pytest.fixture
def env():
    with _loaded_modules() as (ws, store_mod, secrets_mod, watch_config_mod):
        store = store_mod.ComplicationStore(object())
        asyncio.run(store.async_load())
        secrets = secrets_mod.WidgetSecretStore(object())
        coordinator = _Coordinator()
        push = _Push()
        domain_data = _DomainData(store, secrets, coordinator, push, None)
        hass = _Hass(domain_data)
        watch_config = watch_config_mod.WatchConfigStore(
            hass, is_iphone=secrets.is_paired_iphone
        )
        asyncio.run(watch_config.async_load())
        domain_data.watch_config_store = watch_config
        yield _Env(ws, store, secrets, coordinator, hass, secrets_mod, push)


# ── owners ───────────────────────────────────────────────────────────────


def test_a_watch_row_gains_the_device_kind_field_and_nothing_else(env) -> None:
    env.add_watch(
        "watch-A",
        app_version="2.7.0",
        app_build="4",
        device_name="Apple Watch",
        screen_size="208x248",
        owner_iphone_id="phone-1",
    )
    env.add_phone("phone-1", app_version="2.8.0", device_name="Jesse's iPhone")
    env.save_document("watch-A")
    env.store.set_applied_token("watch-A", 1)

    row = next(r for r in env.owners() if r["owner_watch_id"] == "watch-A")
    assert row == {
        "owner_watch_id": "watch-A",
        "device_kind": "watch",
        "device_name": "Apple Watch",
        "paired_iphone_name": "Jesse's iPhone",
        # The same pairing by id, which is what the panel groups a household's
        # devices by: two watches can report the same name, and so can the two
        # phones they are paired to.
        "paired_iphone_id": "phone-1",
        "app_version": "2.7.0",
        # The build beside the version. Build numbers restart on every new
        # version, so the panel's split gate reads the two together.
        "app_build": "4",
        "screen_size": "208x248",
        "complication_count": 1,
        "token": 1,
        "applied_token": 1,
        # A watch that never said it takes its settings from another home.
        "main_house": True,
        # It names the iPhone that paired it, so that phone may still move
        # its setup here.
        "has_iphone": True,
        # Neither key is bound to a Home Assistant user.
        "user_id": None,
        "user_gone": False,
        "polling": False,
        "last_seen_seconds": None,
        "pending_changes": 0,
        "is_orphan": False,
    }


def test_a_device_row_names_its_user_and_where_it_has_got_to(env) -> None:
    """Home's line about each device: whose it is, whether it is polling,
    how long since it was last heard from, and what its next pull brings.
    A watch whose own key predates binding takes its paired phone's user."""
    env.add_phone("phone-1", device_name="Jesse's iPhone", user_id="user-jesse")
    env.add_watch("watch-A", device_name="Apple Watch", owner_iphone_id="phone-1")
    env.add_watch("watch-B", device_name="Chen", user_id="user-chen")
    env.add_watch("watch-C", device_name="Spare")
    env.coordinator.polling.add("watch-A")
    rows = {r["owner_watch_id"]: r for r in env.owners()}
    assert {k: r.get("user_id") for k, r in rows.items() if k != LIBRARY} == {
        "phone-1": "user-jesse",
        "watch-A": "user-jesse",
        "watch-B": "user-chen",
        "watch-C": None,
    }
    assert (rows["watch-A"]["polling"], rows["watch-A"]["last_seen_seconds"]) == (True, 3)
    assert (rows["watch-B"]["polling"], rows["watch-B"]["last_seen_seconds"]) == (False, None)
    # A phone holds no long-poll, whatever the coordinator says.
    env.coordinator.polling.add("phone-1")
    assert next(r for r in env.owners() if r["owner_watch_id"] == "phone-1")["polling"] is False


def test_a_phone_is_an_owner_in_its_own_right(env) -> None:
    """The whole server change: a phone entry is no longer skipped.

    Its records are keyed by caller id like any other owner's, so the counts
    and tokens come from the same store path the watch uses.
    """
    env.add_phone(
        "phone-1", app_version="2.8.0", app_build="11", device_name="Jesse's iPhone"
    )
    env.save_document("phone-1")
    env.save_document("phone-1")
    env.store.set_applied_token("phone-1", 2)

    assert env.owners() == [
        {
            "owner_watch_id": "phone-1",
            "device_kind": "iphone",
            "device_name": "Jesse's iPhone",
            # A phone is nobody's paired phone, and it reports no screen size:
            # the lock screen slot sizes are not the panel's design box.
            "paired_iphone_name": None,
            "paired_iphone_id": None,
            "screen_size": None,
            "app_version": "2.8.0",
            "app_build": "11",
            "complication_count": 2,
            "token": 2,
            "applied_token": 2,
            "main_house": True,
            "has_iphone": False,
            "user_id": None,
            "user_gone": False,
            "polling": False,
            "last_seen_seconds": None,
            "pending_changes": 0,
            "is_orphan": False,
        },
        _library_row(),
    ]


def test_a_watch_that_takes_its_settings_elsewhere_says_so(env) -> None:
    """``main_house`` follows the watch's entry, so the panel can say where
    its settings come from. Only device rows carry it."""
    env.add_watch("watch-A", device_name="Apple Watch")
    env.add_watch("watch-B", device_name="Other Watch")
    assert env.secrets.note_main_house("watch-A", False) is True

    rows = {r["owner_watch_id"]: r for r in env.owners()}
    assert rows["watch-A"]["main_house"] is False
    assert rows["watch-B"]["main_house"] is True
    assert "main_house" not in rows[LIBRARY]


def test_every_row_carries_the_paired_phone_id_or_none(env) -> None:
    """The pairing by id, which is the one the panel can trust.

    Both real watches report themselves as "Apple Watch" and a household can
    easily hold two phones called "iPhone", so grouping devices by person off
    `paired_iphone_name` guesses. A watch that names no phone reports None
    rather than being left out of the field. An owner nothing signs with is
    released to the Library before the listing, so it has no row at all.
    """
    env.add_watch("watch-A", device_name="Apple Watch", owner_iphone_id="phone-1")
    env.add_watch("watch-B", device_name="Apple Watch")
    env.add_phone("phone-1", device_name="Jesse's iPhone")
    env.save_document("gone-watch")

    assert {r["owner_watch_id"]: r["paired_iphone_id"] for r in env.owners()} == {
        "watch-A": "phone-1",
        "watch-B": None,
        "phone-1": None,
        LIBRARY: None,
    }


def test_has_iphone_only_for_a_watch_the_old_phone_link_set_up(env) -> None:
    """A watch waits for the iPhone's move only when it names the iPhone that
    paired it: only that phone holds the watch's key to sign the move with.
    A watch paired by code never waits, even with its user's iPhone here and
    even if it still names its old phone. Another iPhone of the same user
    does not count, a phone has none, and the Library carries no field."""
    env.add_watch(
        "watch-old", device_name="Old Watch", owner_iphone_id="phone-jesse", user_id="jesse"
    )
    env.add_watch("watch-gone-phone", device_name="Lost Watch", owner_iphone_id="phone-gone")
    env.add_code_watch("watch-new", device_name="New Watch", user_id="jesse")
    env.add_code_watch(
        "watch-again", device_name="Paired Again", owner_iphone_id="phone-jesse", user_id="jesse"
    )
    env.add_watch("watch-unnamed", device_name="Unnamed Watch", user_id="jesse")
    env.add_phone("phone-jesse", device_name="Jesse's iPhone", user_id="jesse")

    rows = {r["owner_watch_id"]: r for r in env.owners()}
    assert {owner: row.get("has_iphone") for owner, row in rows.items()} == {
        "watch-old": True,
        "watch-gone-phone": True,
        "watch-new": False,
        "watch-again": False,
        "watch-unnamed": False,
        "phone-jesse": False,
        LIBRARY: None,
    }


def test_owners_lists_every_watch_before_every_phone_by_name(env) -> None:
    env.add_watch("watch-Z", device_name="Zoe's Watch")
    env.add_watch("watch-A", device_name="Alice's Watch")
    env.add_phone("phone-Z", device_name="Zoe's iPhone")
    env.add_phone("phone-A", device_name="Alice's iPhone")

    assert [r["device_name"] for r in env.owners()] == [
        "Alice's Watch",
        "Zoe's Watch",
        "Alice's iPhone",
        "Zoe's iPhone",
        # Not a device, so it sorts under all of them rather than among them.
        "Library",
    ]


def test_every_row_carries_the_app_build_or_none(env) -> None:
    """The build number, which the panel's split migration gates on.

    The per-shape slot resolver landed part-way through the 2.8.0 beta, so the
    version alone cannot say whether a device understands a slot that holds one
    document per shape. Build numbers restart at 1 on every new version, which
    is why this is only ever read together with `app_version`.

    Every row carries the field: a device that reported no build and the
    Library, which has no app at all, both say None rather than leaving the
    key out. An owner nothing signs with is released to the Library before the
    listing, so it has no row.
    """
    env.add_watch("watch-A", app_version="2.8.0", app_build="11")
    env.add_watch("watch-B", app_version="2.8.0")
    env.add_phone("phone-1", app_version="2.8.0", app_build="9")
    env.save_document("gone-watch")

    assert {r["owner_watch_id"]: r["app_build"] for r in env.owners()} == {
        "watch-A": "11",
        "watch-B": None,
        "phone-1": "9",
        LIBRARY: None,
    }


def test_a_phone_renamed_in_ha_shows_the_new_name(env) -> None:
    """The registry lookup has to find a phone, not just a watch.

    `build_device_info` registers an iPhone under the same `watch_<id>`
    identifier a watch gets, so one lookup serves both. A second identifier
    scheme for phones would silently fall back to the provisioned name and
    ignore the rename.
    """
    env.add_phone("phone-1", device_name="iPhone")
    env.rename_in_ha("phone-1", "Kitchen iPhone")
    assert env.owners()[0]["device_name"] == "Kitchen iPhone"


def test_an_orphan_is_released_to_the_library_before_the_listing(env) -> None:
    """The sweep runs first, so the "Move all to" banner never has a row to draw.

    A design under an id nothing signs with lands in the Library, where the
    user can put it on a device from the card, and the id itself is gone from
    the list rather than shown as an orphan the user cannot get rid of.
    """
    env.add_phone("phone-1", device_name="Jesse's iPhone")
    env.save_document("phone-1")
    env.save_document("gone-watch")

    rows = env.owners()
    assert [(r["owner_watch_id"], r["device_kind"]) for r in rows] == [
        ("phone-1", "iphone"),
        (LIBRARY, "library"),
    ]
    assert all(r["is_orphan"] is False for r in rows)
    assert rows[-1]["complication_count"] == 1


# ── the Library ──────────────────────────────────────────────────────────
#
# One owner that is not a device: where a design lives before it is put on
# anything, and where it stays when it is taken off everything. Nothing polls
# it and nothing is pushed to it, so the only thing the row has to get right is
# that it is always there, always last, and counts what is on the shelf.


def test_the_library_is_listed_even_in_a_home_with_no_devices(env) -> None:
    """The one row a brand new home has, which is the point of the feature.

    Somewhere to build is exactly what a home with nothing provisioned needs,
    so the shelf cannot wait for a watch to show up first.
    """
    assert env.owners() == [_library_row()]


def test_the_library_sorts_after_every_device(env) -> None:
    env.add_watch("watch-A", device_name="Apple Watch")
    env.add_phone("phone-1", device_name="Jesse's iPhone")
    env.save_document("gone-watch")

    assert [r["owner_watch_id"] for r in env.owners()][-1] == LIBRARY


def test_the_library_is_never_listed_twice_as_an_orphan(env) -> None:
    """It owns records and has no secret store entry, which is the orphan test.

    Without the id in `seen` the owners loop would list the shelf a second
    time, as a device that went missing and can be moved elsewhere.
    """
    env.save_document(LIBRARY)

    rows = [r for r in env.owners() if r["owner_watch_id"] == LIBRARY]
    assert len(rows) == 1
    assert rows[0]["is_orphan"] is False


def test_the_library_counts_what_was_saved_to_it(env) -> None:
    env.save_document(LIBRARY)
    env.save_document(LIBRARY)

    row = env.owners()[-1]
    assert row["complication_count"] == 2
    assert row["token"] == 2
    # No device applies anything here, so the applied token stays null however
    # much is saved: a green "on the wrist" about a shelf would be a lie.
    assert row["applied_token"] is None


def test_records_saved_to_the_library_are_read_back_from_it(env) -> None:
    """The store keys by owner string, so the shelf needs no storage of its own."""
    document = env.save_document(LIBRARY)

    records = env.store.list(LIBRARY)
    assert [r.document["id"] for r in records] == [document["id"]]
    assert env.store.list("watch-A") == []


def test_a_save_to_the_library_disturbs_no_device(env) -> None:
    """A commit runs the same two hooks every owner's does, and neither bites.

    The store knows only that an owner's token moved, so both hooks are asked
    about the Library exactly as they are asked about a watch. The wake finds
    no parked poll under an id nothing polls, and the push drops the owner
    before a timer is scheduled because no iPhone entry stands behind it. So
    the shelf needs no special case on the store side.
    """
    env.add_phone("phone-1", device_name="Jesse's iPhone")
    env.push.available.add("phone-1")
    env.store.async_set_wake_callback(env.coordinator.wake_watch)
    env.store.async_set_push_callback(env.push.on_commit)

    env.save_document(LIBRARY)

    assert env.coordinator.woken == [(LIBRARY, False)]
    assert env.coordinator.is_polling(LIBRARY) is False
    assert env.push.pushed == []

    # The same two hooks on a real owner, so the push above stayed empty
    # because of the owner rather than because nobody installed the hook.
    env.save_document("phone-1")
    assert env.push.pushed == [("phone-1", "save")]


def test_forgetting_the_library_is_refused_rather_than_obeyed(env) -> None:
    """Nothing registered it, so there is nothing to unregister.

    `force` does not get past it either: the entry is looked up first.
    """
    env.save_document(LIBRARY)

    connection = _Connection()
    env.ws.ws_forget_device(
        env.hass, connection, {"id": 1, "watch_id": LIBRARY, "force": True}
    )
    assert [code for _id, code, _msg in connection.errors] == ["not_found"]
    assert len(env.store.list(LIBRARY)) == 1


# ── watch config on forget and move ──────────────────────────────────────


def _save_pages(env: _Env, owner: str, name: str) -> None:
    env.hass.data[DOMAIN].watch_config_store.put(
        owner,
        "pages",
        {"pages": [{"id": f"page-{name}", "name": name}]},
        document_hash="a" * 64,
        base_revision=0,
        updated_by=owner,
    )


def test_forgetting_a_device_deletes_its_watch_config(env) -> None:
    """A device's pages have no Library to go to, so they go with it."""
    env.add_watch("watch-A", device_name="Apple Watch")
    env.add_watch("watch-B", device_name="Other Watch")
    _save_pages(env, "watch-A", "A")
    _save_pages(env, "watch-B", "B")
    watch_config = env.hass.data[DOMAIN].watch_config_store

    result = env.call(env.ws.ws_forget_device, watch_id="watch-A", force=False)
    assert result["watch_config_removed"] is True
    assert watch_config.get("watch-A", "pages") is None
    assert watch_config.get("watch-B", "pages").document["pages"][0]["name"] == "B"

    env.add_watch("watch-C", device_name="Bare Watch")
    result = env.call(env.ws.ws_forget_device, watch_id="watch-C", force=False)
    assert result["watch_config_removed"] is False


def test_forgetting_a_device_drops_its_voice_list(env) -> None:
    """The voices a watch reported describe that watch alone (step 4d batch
    2). The real store's forget is tested in test_watch_voices.py; this pins
    that the Forget reaches it, and only for the device forgotten."""
    forgotten: list[str] = []
    env.hass.data[DOMAIN].watch_voices_store = types.SimpleNamespace(
        forget=lambda watch_id: forgotten.append(watch_id) or True
    )
    env.add_watch("watch-A", device_name="Apple Watch")
    env.add_watch("watch-B", device_name="Other Watch")
    env.call(env.ws.ws_forget_device, watch_id="watch-A", force=False)
    assert forgotten == ["watch-A"]


def test_forgetting_a_device_drops_its_live_session_first(env) -> None:
    """The Forget closes the device's poll session while its secret is still
    there, so the parked poll ends without a body and no session listener
    re-adds its entities after the registry device goes. A refused Forget
    leaves the session alone."""
    env.coordinator.secrets = env.secrets
    env.add_watch("watch-A", device_name="Apple Watch")
    env.add_watch("watch-B", device_name="Other Watch")
    env.coordinator.polling.update({"watch-A", "watch-B"})

    env.call(env.ws.ws_forget_device, watch_id="watch-A", force=False)
    assert env.coordinator.dropped == ["watch-A"]
    assert env.coordinator.secret_at_drop == {"watch-A": True}
    assert env.secrets.get("watch-A") is None
    assert env.coordinator.polling == {"watch-B"}

    connection = _Connection()
    env.ws.ws_forget_device(
        env.hass, connection, {"id": 2, "watch_id": "watch-gone", "force": True}
    )
    assert [code for _id, code, _msg in connection.errors] == ["not_found"]
    assert env.coordinator.dropped == ["watch-A"]


def test_forgetting_a_device_closes_its_camera_streams(env) -> None:
    """A Forget ends the device's running camera streams and voids the stream
    tokens it has not used, for the device forgotten only. A refused Forget
    closes nothing."""
    cameras = env.hass.data[DOMAIN].camera_stream_coordinator
    env.add_watch("watch-A", device_name="Apple Watch")
    env.add_watch("watch-B", device_name="Other Watch")

    env.call(env.ws.ws_forget_device, watch_id="watch-A", force=False)
    assert cameras.closed == ["watch-A"]

    connection = _Connection()
    env.ws.ws_forget_device(
        env.hass, connection, {"id": 2, "watch_id": "watch-gone", "force": True}
    )
    assert [code for _id, code, _msg in connection.errors] == ["not_found"]
    assert cameras.closed == ["watch-A"]


def test_moving_an_owner_carries_its_watch_config(env) -> None:
    """The reinstall recovery path: the pages follow the designs."""
    env.add_watch("watch-new", device_name="Apple Watch")
    env.save_document("watch-old")
    _save_pages(env, "watch-old", "old pages")
    watch_config = env.hass.data[DOMAIN].watch_config_store

    result = env.call(
        env.ws.ws_move_owner,
        source_owner_watch_id="watch-old",
        target_owner_watch_id="watch-new",
    )
    assert result["watch_config_moved"] == ["pages"]
    assert watch_config.get("watch-old", "pages") is None
    moved = watch_config.get("watch-new", "pages")
    assert moved.revision == 1
    assert moved.document["pages"][0]["name"] == "old pages"


def _save_behavior(env: _Env, owner: str, document: dict) -> None:
    env.hass.data[DOMAIN].watch_config_store.put(
        owner,
        "behavior",
        document,
        document_hash="b" * 64,
        base_revision=0,
        updated_by=owner,
    )


def test_a_move_onto_a_phone_of_a_watch_only_config_moves_nothing(env) -> None:
    """Phone pages: a config an iPhone may not hold refuses the whole move.

    Before the fix the designs moved first and the config's refusal was only
    logged, so the move was split between two owners and the reply said it
    worked. Now ``not_for_iphone`` comes back before any design moves."""
    env.add_phone("phone-1", device_name="Jesse's iPhone")
    document = env.save_document("watch-old")
    _save_pages(env, "watch-old", "old pages")
    _save_behavior(env, "watch-old", {"wrapPages": True, "serverMode": "auto"})

    connection = _Connection()
    env.ws.ws_move_owner(
        env.hass,
        connection,
        {"id": 1, "source_owner_watch_id": "watch-old", "target_owner_watch_id": "phone-1"},
    )
    assert [code for _id, code, _msg in connection.errors] == ["not_for_iphone"]
    assert connection.results == {}
    assert [r.id for r in env.store.list("watch-old")] == [document["id"]]
    assert env.store.list("phone-1") == []
    watch_config = env.hass.data[DOMAIN].watch_config_store
    assert watch_config.get("watch-old", "pages").revision == 1
    assert watch_config.get("watch-old", "behavior").revision == 1
    assert watch_config.get("phone-1", "pages") is None
    assert watch_config.get("phone-1", "behavior") is None


def test_a_move_onto_a_phone_of_a_phone_shaped_config_moves_it(env) -> None:
    """Records a phone may hold go onto a phone with the designs, as ever."""
    env.add_phone("phone-1", device_name="Jesse's iPhone")
    document = env.save_document("phone-old")
    _save_pages(env, "phone-old", "phone pages")
    _save_behavior(env, "phone-old", {"schemaVersion": 1, "wrapPages": True})

    result = env.call(
        env.ws.ws_move_owner,
        source_owner_watch_id="phone-old",
        target_owner_watch_id="phone-1",
    )
    assert result["watch_config_moved"] == ["behavior", "pages"]
    assert [r["id"] for r in result["records"]] == [document["id"]]
    watch_config = env.hass.data[DOMAIN].watch_config_store
    assert watch_config.get("phone-old", "pages") is None
    assert watch_config.get("phone-1", "pages").document["pages"][0]["name"] == "phone pages"
    assert watch_config.get("phone-1", "behavior").document == {
        "schemaVersion": 1,
        "wrapPages": True,
    }


def test_a_move_between_watches_still_carries_watch_only_settings(env) -> None:
    """The phone check never reaches a watch target: every setting moves."""
    env.add_watch("watch-new", device_name="Apple Watch")
    env.save_document("watch-old")
    _save_behavior(env, "watch-old", {"wrapPages": True, "serverMode": "auto"})

    result = env.call(
        env.ws.ws_move_owner,
        source_owner_watch_id="watch-old",
        target_owner_watch_id="watch-new",
    )
    assert result["watch_config_moved"] == ["behavior"]
    watch_config = env.hass.data[DOMAIN].watch_config_store
    assert watch_config.get("watch-new", "behavior").document == {
        "wrapPages": True,
        "serverMode": "auto",
    }


def test_a_refused_move_leaves_the_watch_config_where_it_was(env) -> None:
    """Nothing live to move refuses the whole command, pages included."""
    env.add_watch("watch-new", device_name="Apple Watch")
    _save_pages(env, "watch-old", "old pages")
    connection = _Connection()
    env.ws.ws_move_owner(
        env.hass,
        connection,
        {"id": 1, "source_owner_watch_id": "watch-old", "target_owner_watch_id": "watch-new"},
    )
    assert [code for _id, code, _msg in connection.errors] == ["not_found"]
    watch_config = env.hass.data[DOMAIN].watch_config_store
    assert watch_config.get("watch-old", "pages").revision == 1
    assert watch_config.get("watch-new", "pages") is None


def test_a_move_to_a_watch_that_has_not_paired_is_refused(env) -> None:
    """The orphan sweep would undo it.

    Before the fix the move committed the designs under the unpaired id, the
    panel's next owners call found that id unknown to the secret store and
    released the designs to the Library, tombstoning them under the target.
    The watch would then pair and pull only tombstones. Now the move is
    refused and the designs stay where they were.
    """
    env.add_watch("watch-other", device_name="Other Watch")
    document = env.save_document("watch-old")
    _save_pages(env, "watch-old", "old pages")

    connection = _Connection()
    env.ws.ws_move_owner(
        env.hass,
        connection,
        {"id": 1, "source_owner_watch_id": "watch-old", "target_owner_watch_id": "watch-unpaired"},
    )
    assert [code for _id, code, _msg in connection.errors] == ["not_found"]
    assert [r.id for r in env.store.list("watch-old")] == [document["id"]]
    assert "watch-unpaired" not in env.store.owners()
    watch_config = env.hass.data[DOMAIN].watch_config_store
    assert watch_config.get("watch-old", "pages").revision == 1
    assert watch_config.get("watch-unpaired", "pages") is None

    # The Library is not a device either.
    connection = _Connection()
    env.ws.ws_move_owner(
        env.hass,
        connection,
        {"id": 2, "source_owner_watch_id": "watch-old", "target_owner_watch_id": LIBRARY},
    )
    assert [code for _id, code, _msg in connection.errors] == ["not_found"]


def test_a_move_to_a_paired_watch_survives_the_next_owners_listing(env) -> None:
    """The designs land on the target and the orphan sweep leaves them there."""
    env.add_watch("watch-new", device_name="Apple Watch")
    document = env.save_document("watch-old")

    env.call(
        env.ws.ws_move_owner,
        source_owner_watch_id="watch-old",
        target_owner_watch_id="watch-new",
    )
    env.owners()
    assert [r.id for r in env.store.list("watch-new")] == [document["id"]]


# ── watch_status ─────────────────────────────────────────────────────────


def test_watch_status_reports_seconds_since_the_last_sync(env) -> None:
    """A phone owner's only sign of life: it parks no poll to report on."""
    env.add_phone("phone-1", device_name="Jesse's iPhone")
    status = env.call(env.ws.ws_watch_status, owner_watch_id="phone-1")
    assert status["last_sync_seconds"] is None
    assert status["polling"] is False
    assert status["last_poll_seconds"] is None

    env.store.set_last_sync("phone-1")
    status = env.call(env.ws.ws_watch_status, owner_watch_id="phone-1")
    assert 0 <= status["last_sync_seconds"] < 60


def test_watch_status_reports_whether_a_push_can_reach_this_owner(env) -> None:
    """The panel's chip branches on it: push, or ask the user to open the app.

    Null rather than 0 for a phone nothing has been sent to yet, the same
    distinction `last_poll_seconds` draws for a watch.
    """
    env.add_phone("phone-1", device_name="Jesse's iPhone")
    status = env.call(env.ws.ws_watch_status, owner_watch_id="phone-1")
    assert status["push_available"] is False
    assert status["last_push_seconds"] is None

    env.push.available.add("phone-1")
    env.push.since["phone-1"] = 12
    status = env.call(env.ws.ws_watch_status, owner_watch_id="phone-1")
    assert status["push_available"] is True
    assert status["last_push_seconds"] == 12


def test_a_phone_polling_for_its_pages_still_reports_no_poll(env) -> None:
    """Phone pages: an iPhone holds a long poll of its own, signed as itself.
    Its complications never ride it, so every chip reply says false and null
    for it, as the owners list does, while a watch's poll still shows."""
    env.add_phone("phone-1", device_name="Jesse's iPhone")
    env.add_watch("watch-A", device_name="Apple Watch")
    env.coordinator.polling.update({"phone-1", "watch-A"})

    status = env.call(env.ws.ws_watch_status, owner_watch_id="phone-1")
    assert (status["polling"], status["last_poll_seconds"]) == (False, None)
    listed = env.call(env.ws.ws_list, owner_watch_id="phone-1", include_deleted=False)
    assert (listed["polling"], listed["last_poll_seconds"]) == (False, None)
    nudged = env.call(env.ws.ws_nudge, owner_watch_id="phone-1")
    assert (nudged["polling"], nudged["last_poll_seconds"]) == (False, None)

    status = env.call(env.ws.ws_watch_status, owner_watch_id="watch-A")
    assert (status["polling"], status["last_poll_seconds"]) == (True, 3.0)
    listed = env.call(env.ws.ws_list, owner_watch_id="watch-A", include_deleted=False)
    assert (listed["polling"], listed["last_poll_seconds"]) == (True, 3.0)
    nudged = env.call(env.ws.ws_nudge, owner_watch_id="watch-A")
    assert (nudged["polling"], nudged["last_poll_seconds"]) == (True, 3.0)


def test_watch_status_on_a_watch_owner_reports_no_push(env) -> None:
    env.add_watch("watch-A", device_name="Apple Watch")
    status = env.call(env.ws.ws_watch_status, owner_watch_id="watch-A")
    assert status["push_available"] is False
    assert status["last_push_seconds"] is None


def test_pending_changes_counts_designs_since_the_ack(env) -> None:
    """The chip's "2 changes waiting": null before any ack, since there is no
    token to count from, then the records newer than the applied token."""
    env.add_watch("watch-A", device_name="Apple Watch")
    env.save_document("watch-A")
    assert env.call(env.ws.ws_watch_status, owner_watch_id="watch-A")["pending_changes"] is None

    env.store.set_applied_token("watch-A", env.store.owner_token("watch-A"))
    env.save_document("watch-A")
    env.save_document("watch-A")
    assert env.call(env.ws.ws_watch_status, owner_watch_id="watch-A")["pending_changes"] == 2
    assert env.call(env.ws.ws_nudge, owner_watch_id="watch-A")["pending_changes"] == 2
    # Called directly, so the schema default for include_deleted is not applied.
    listed = env.call(env.ws.ws_list, owner_watch_id="watch-A", include_deleted=False)
    assert listed["pending_changes"] == 2

    env.store.set_applied_token("watch-A", env.store.owner_token("watch-A"))
    assert env.call(env.ws.ws_watch_status, owner_watch_id="watch-A")["pending_changes"] == 0


# ── owner_subscribe ──────────────────────────────────────────────────────


class _LiveConnection(_Connection):
    """A connection that keeps its subscriptions and the events sent on them."""

    def __init__(self) -> None:
        super().__init__()
        self.subscriptions: dict[int, Any] = {}
        self.events: list[dict] = []

    def send_message(self, message: dict) -> None:
        self.events.append(message)


def _signed_in(user_id: str, *, is_admin: bool = False) -> Any:
    """The Home Assistant user on a WebSocket connection."""
    return types.SimpleNamespace(id=user_id, is_admin=is_admin)


ALICE = _signed_in("alice")
BOB = _signed_in("bob")
ROOT = _signed_in("root", is_admin=True)


def _try_owner_subscribe(env, owner: str, user: Any) -> _LiveConnection:
    connection = _LiveConnection()
    connection.user = user
    env.ws.ws_owner_subscribe(env.hass, connection, {"id": 7, "owner_id": owner})
    return connection


def _owner_subscribe(env, owner: str, user: Any = ALICE) -> _LiveConnection:
    connection = _try_owner_subscribe(env, owner, user)
    assert connection.errors == [], connection.errors
    return connection


def _refused(connection: _LiveConnection) -> bool:
    return (
        connection.results == {}
        and connection.subscriptions == {}
        and [code for _id, code, _message in connection.errors] == ["unauthorized"]
    )


def test_owner_subscribe_refuses_another_user_s_device(env) -> None:
    """A signed-in non-admin cannot follow someone else's watch or phone."""
    env.add_phone("phone-1", user_id="alice")
    env.add_watch("watch-A", user_id="alice")
    assert _refused(_try_owner_subscribe(env, "phone-1", BOB))
    connection = _try_owner_subscribe(env, "watch-A", BOB)
    assert _refused(connection)
    env.save_document("watch-A")
    assert connection.events == []


def test_owner_subscribe_refuses_an_unbound_or_unknown_owner_to_a_non_admin(env) -> None:
    env.add_watch("watch-legacy")
    assert _refused(_try_owner_subscribe(env, "watch-legacy", ALICE))
    assert _refused(_try_owner_subscribe(env, "no-such-device", ALICE))


def test_owner_subscribe_lets_any_signed_in_user_follow_the_library(env) -> None:
    """The Library is the household's shelf, editable by everyone, so
    everyone may hear about its commits too."""
    connection = _owner_subscribe(env, LIBRARY, ALICE)
    env.save_document(LIBRARY)
    assert connection.events == [
        {"id": 7, "event": {"token": env.store.owner_token(LIBRARY)}}
    ]


def test_owner_subscribe_refuses_a_connection_with_no_user(env) -> None:
    env.add_phone("phone-1", user_id="alice")
    assert _refused(_try_owner_subscribe(env, "phone-1", None))


def test_owner_subscribe_lets_a_user_follow_their_own_watch(env) -> None:
    env.add_watch("watch-A", user_id="alice")
    connection = _owner_subscribe(env, "watch-A", ALICE)
    env.save_document("watch-A")
    assert connection.events == [
        {"id": 7, "event": {"token": env.store.owner_token("watch-A")}}
    ]


def test_owner_subscribe_lets_an_admin_follow_any_owner(env) -> None:
    env.add_phone("phone-1", user_id="alice")
    env.add_watch("watch-legacy")
    _owner_subscribe(env, "phone-1", ROOT)
    _owner_subscribe(env, "watch-legacy", ROOT)


def test_owner_subscribe_replies_with_the_owner_token(env) -> None:
    """A commit made while the phone's socket was down is caught right here."""
    env.add_phone("phone-1", user_id="alice")
    env.save_document("phone-1")
    connection = _owner_subscribe(env, "phone-1")
    assert connection.results[7] == {"token": env.store.owner_token("phone-1")}


def test_owner_subscribe_sends_only_a_token_for_its_own_commits(env) -> None:
    """No record, no other owner, no ack: a number and nothing else."""
    env.add_phone("phone-1", user_id="alice")
    env.add_watch("watch-A")
    connection = _owner_subscribe(env, "phone-1")

    env.save_document("watch-A")
    assert connection.events == []

    env.save_document("phone-1")
    assert connection.events == [
        {"id": 7, "event": {"token": env.store.owner_token("phone-1")}}
    ]

    env.store.set_applied_token("phone-1", env.store.owner_token("phone-1"))
    assert len(connection.events) == 1


def test_owner_subscribe_sends_token_zero_on_forget(env) -> None:
    """A phone forgotten while open pulls at once and blanks its widgets."""
    env.add_phone("phone-1", user_id="alice")
    env.save_document("phone-1")
    connection = _owner_subscribe(env, "phone-1")
    env.store.forget_owner("phone-1")
    assert connection.events[-1] == {"id": 7, "event": {"token": 0}}


def test_owner_subscribe_stops_when_the_socket_unsubscribes(env) -> None:
    env.add_phone("phone-1", user_id="alice")
    connection = _owner_subscribe(env, "phone-1")
    connection.subscriptions.pop(7)()
    env.save_document("phone-1")
    assert connection.events == []


# ── nudge ────────────────────────────────────────────────────────────────


def test_nudge_on_an_owner_with_no_parked_poll_is_answered_not_refused(env) -> None:
    """The panel hides Resend for a phone, but a stale tab can still send one.

    An error here would put a dialog in front of a user for an action that is
    simply meaningless on that device. `DeltaCoordinator.wake_watch` on an id
    holding no waiter is itself a no-op, which
    `test_delta_coordinator_inprocess.py` covers.
    """
    env.add_phone("phone-1", device_name="Jesse's iPhone")
    env.save_document("phone-1")
    env.store.set_applied_token("phone-1", 1)

    reply = env.call(env.ws.ws_nudge, owner_watch_id="phone-1")
    assert reply == {
        "polling": False,
        "last_poll_seconds": None,
        "token": 1,
        "applied_token": 1,
        "pending_changes": 0,
        "pushed": False,
        "push_available": False,
    }
    assert env.coordinator.woken == [("phone-1", True)]
    assert env.push.pushed == []


def test_nudge_on_a_reachable_phone_sends_the_push_now(env) -> None:
    """Refresh now is the phone's counterpart to waking a parked poll.

    The reason travels with it so the app can tell a hand-pressed refresh from
    the push a save produced, and the panel learns nothing here about whether
    the phone acted. That arrives as the ack it already watches for.
    """
    env.add_phone("phone-1", device_name="Jesse's iPhone")
    env.save_document("phone-1")
    env.push.available.add("phone-1")

    reply = env.call(env.ws.ws_nudge, owner_watch_id="phone-1")
    assert reply["pushed"] is True
    assert reply["push_available"] is True
    assert env.push.pushed == [("phone-1", "refresh")]


def test_nudge_on_a_watch_owner_pushes_nothing(env) -> None:
    env.add_watch("watch-A", device_name="Apple Watch")
    env.save_document("watch-A")
    env.coordinator.polling.add("watch-A")

    reply = env.call(env.ws.ws_nudge, owner_watch_id="watch-A")
    assert reply["polling"] is True
    assert reply["pushed"] is False
    assert reply["push_available"] is False
    assert env.push.pushed == []
    assert env.coordinator.woken == [("watch-A", True)]


# ── save history ─────────────────────────────────────────────────────────


def _error(env, command, **msg) -> tuple[int, str, str]:
    """Call a command that is expected to refuse, and hand back the error."""
    connection = _Connection()
    msg.setdefault("id", 1)
    command(env.hass, connection, msg)
    assert connection.results == {}, connection.results
    assert len(connection.errors) == 1, connection.errors
    return connection.errors[0]


def test_history_lists_past_revisions_newest_first_without_bodies(env) -> None:
    env.add_watch("watch-A", device_name="Apple Watch")
    document = env.save_document("watch-A")
    env.store.save("watch-A", dict(document, name="v2"), base_revision=1, updated_by="t")
    env.store.save("watch-A", dict(document, name="v3"), base_revision=2, updated_by="t")

    reply = env.call(
        env.ws.ws_save_history,
        owner_watch_id="watch-A",
        complication_id=document["id"],
    )
    assert reply["owner_watch_id"] == "watch-A"
    assert reply["complication_id"] == document["id"]
    # The revision the record is on now; it is deliberately not an entry.
    assert reply["revision"] == 3
    assert [e["revision"] for e in reply["entries"]] == [2, 1]
    assert [e["name"] for e in reply["entries"]] == ["v2", "Garage"]
    assert all("document" not in entry for entry in reply["entries"])


def test_history_of_a_record_that_was_never_resaved_is_empty(env) -> None:
    env.add_watch("watch-A", device_name="Apple Watch")
    document = env.save_document("watch-A")
    reply = env.call(
        env.ws.ws_save_history,
        owner_watch_id="watch-A",
        complication_id=document["id"],
    )
    assert reply["entries"] == []
    assert reply["revision"] == 1


def test_history_of_an_unknown_record_is_not_found(env) -> None:
    env.add_watch("watch-A", device_name="Apple Watch")
    _id, code, _message = _error(
        env,
        env.ws.ws_save_history,
        owner_watch_id="watch-A",
        complication_id=str(uuid.uuid4()).upper(),
    )
    assert code == "not_found"


def test_history_get_returns_one_body(env) -> None:
    env.add_watch("watch-A", device_name="Apple Watch")
    document = env.save_document("watch-A")
    env.store.save("watch-A", dict(document, name="v2"), base_revision=1, updated_by="t")

    reply = env.call(
        env.ws.ws_save_history_get,
        owner_watch_id="watch-A",
        complication_id=document["id"],
        revision=1,
    )
    assert reply["entry"]["revision"] == 1
    assert reply["entry"]["document"]["name"] == "Garage"

    _id, code, _message = _error(
        env,
        env.ws.ws_save_history_get,
        owner_watch_id="watch-A",
        complication_id=document["id"],
        revision=9,
    )
    assert code == "not_found"


def test_history_restore_writes_the_old_body_as_a_new_revision(env) -> None:
    """Undoing a restore is another restore, not a special path."""
    env.add_watch("watch-A", device_name="Apple Watch")
    document = env.save_document("watch-A")
    env.store.save("watch-A", dict(document, name="v2"), base_revision=1, updated_by="t")

    reply = env.call(
        env.ws.ws_save_history_restore,
        owner_watch_id="watch-A",
        complication_id=document["id"],
        revision=1,
    )
    assert reply["ok"] is True
    assert reply["restored_revision"] == 1
    assert reply["record"]["revision"] == 3
    assert reply["record"]["document"]["name"] == "Garage"
    # The reply is the sync shape, so no history rides along with it.
    assert "history" not in reply["record"]
    # And the revision it replaced is now the newest entry.
    listed = env.call(
        env.ws.ws_save_history,
        owner_watch_id="watch-A",
        complication_id=document["id"],
    )
    assert [e["revision"] for e in listed["entries"]] == [2, 1]


def test_history_restore_leaves_the_stored_entry_alone(env) -> None:
    env.add_watch("watch-A", device_name="Apple Watch")
    document = env.save_document("watch-A")
    env.store.save("watch-A", dict(document, name="v2"), base_revision=1, updated_by="t")

    env.call(
        env.ws.ws_save_history_restore,
        owner_watch_id="watch-A",
        complication_id=document["id"],
        revision=1,
    )
    entry = env.store.history_entry("watch-A", document["id"], 1)
    assert entry.document["name"] == "Garage"


def test_history_restore_with_a_stale_base_revision_conflicts(env) -> None:
    env.add_watch("watch-A", device_name="Apple Watch")
    document = env.save_document("watch-A")
    env.store.save("watch-A", dict(document, name="v2"), base_revision=1, updated_by="t")

    reply = env.call(
        env.ws.ws_save_history_restore,
        owner_watch_id="watch-A",
        complication_id=document["id"],
        revision=1,
        base_revision=1,
    )
    assert reply["ok"] is False
    assert reply["error"] == "conflict"
    assert reply["current"]["revision"] == 2


def test_history_restore_of_an_unknown_revision_is_not_found(env) -> None:
    env.add_watch("watch-A", device_name="Apple Watch")
    document = env.save_document("watch-A")
    _id, code, _message = _error(
        env,
        env.ws.ws_save_history_restore,
        owner_watch_id="watch-A",
        complication_id=document["id"],
        revision=1,
    )
    assert code == "not_found"


# ── live subscriptions across a reload ───────────────────────────────────


def _reload(env) -> Any:
    """What a config entry reload does to the store: unload lets go of the
    old one, and the next setup builds a new one and points the live
    subscriptions at it. The panel's and the phone's WebSockets stay open."""
    relay = env.ws.listener_relay(env.hass, env.ws.COMPLICATIONS)
    relay.release()
    store = type(env.store)(object())
    asyncio.run(store.async_load())
    env.hass.data[DOMAIN].complication_store = store
    relay.follow(store)
    old, env.store = env.store, store
    return old


def test_live_subscriptions_hear_the_new_store_after_a_reload(env) -> None:
    """The panel's subscription and the phone's owner subscription both keep
    working: a commit on the reloaded store is an event on each, so Send to
    watch can still go green, and the old store is heard no more."""
    env.add_watch("watch-A", user_id="alice")
    panel = _LiveConnection()
    panel.user = ROOT
    env.ws.ws_subscribe(env.hass, panel, {"id": 5})
    assert panel.errors == []
    phone = _owner_subscribe(env, "watch-A", ALICE)

    old = _reload(env)
    env.save_document("watch-A")
    token = env.store.owner_token("watch-A")
    assert [e["event"]["owner_watch_id"] for e in panel.events] == ["watch-A"]
    assert panel.events[0]["event"]["token"] == env.store.token
    assert phone.events == [{"id": 7, "event": {"token": token}}]

    # The watch acks the new token: the panel hears it, as on a fresh page.
    env.store.set_applied_token("watch-A", token)
    assert panel.events[-1]["event"]["applied_token"] == token

    events_before = (len(panel.events), len(phone.events))
    env.store, live = old, env.store
    env.save_document("watch-A")
    env.store = live
    assert (len(panel.events), len(phone.events)) == events_before


def test_unsubscribing_after_a_reload_stops_the_events(env) -> None:
    env.add_watch("watch-A", user_id="alice")
    phone = _owner_subscribe(env, "watch-A", ALICE)
    _reload(env)
    phone.subscriptions.pop(7)()
    env.save_document("watch-A")
    assert phone.events == []
