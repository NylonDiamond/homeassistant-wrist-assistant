"""In-process tests for the complication panel's WebSocket commands.

Loads ``complication_ws.py`` with stubbed Home Assistant modules, the same
approach ``test_delta_coordinator_inprocess.py`` takes with ``api.py``, so the
shape of an owner row can be asserted field by field with no live box. The
live HTTP suite still covers the round trip.

``test_ws_command_registration.py`` is the other half of the coverage here and
stays static: it reads the module's AST to prove every command is registered
and admin-gated. This one runs them.

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
            WIDGET_SECRET_STORAGE_KEY="wrist_assistant.widget_secrets",
            WIDGET_SECRET_STORAGE_VERSION=1,
        )
        # Neither series module is exercised here; complication_ws only needs
        # their names to build its command schemas at import time.
        _stub(
            f"{_PKG}.history_series",
            MODE_NUMERIC="numeric",
            MODE_STATES="states",
            HistorySeriesError=type("HistorySeriesError", (Exception,), {}),
            async_history_series=None,
            normalize_mode=lambda value: value,
        )
        _stub(
            f"{_PKG}.statistics_series",
            PERIODS=("hour",),
            STAT_TYPES=("mean",),
            StatisticsSeriesError=type("StatisticsSeriesError", (Exception,), {}),
            async_statistics_series=None,
        )

        store_mod = _load("complication_store")
        secrets_mod = _load("widget_secret_store")
        yield _load("complication_ws"), store_mod, secrets_mod
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


class _DeviceRegistry:
    def __init__(self) -> None:
        self.by_identifier: dict[tuple[str, str], _Device] = {}

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

    def is_polling(self, watch_id: str) -> bool:
        return watch_id in self.polling

    def seconds_since_poll(self, watch_id: str) -> float | None:
        return 3.0 if watch_id in self.polling else None

    def wake_watch(self, watch_id: str, *, renotify: bool = False) -> None:
        self.woken.append((watch_id, renotify))


class _Connection:
    user = None

    def __init__(self) -> None:
        self.results: dict[int, Any] = {}
        self.errors: list[tuple[int, str, str]] = []

    def send_result(self, msg_id: int, payload: Any) -> None:
        self.results[msg_id] = payload

    def send_error(self, msg_id: int, code: str, message: str) -> None:
        self.errors.append((msg_id, code, message))


class _DomainData:
    def __init__(self, store, secret_store, coordinator) -> None:
        self.complication_store = store
        self.widget_secret_store = secret_store
        self.coordinator = coordinator


class _Hass:
    def __init__(self, domain_data) -> None:
        self.data = {DOMAIN: domain_data}
        self.devices = _DeviceRegistry()
        self.entities = _EntityRegistry()


@dataclass
class _Env:
    ws: Any
    store: Any
    secrets: Any
    coordinator: _Coordinator
    hass: _Hass
    secrets_mod: Any
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
        command(self.hass, connection, msg)
        assert connection.errors == [], connection.errors
        return connection.results[1]

    def owners(self) -> list[dict]:
        return self.call(self.ws.ws_owners)["owners"]


@pytest.fixture
def env():
    with _loaded_modules() as (ws, store_mod, secrets_mod):
        store = store_mod.ComplicationStore(object())
        asyncio.run(store.async_load())
        secrets = secrets_mod.WidgetSecretStore(object())
        coordinator = _Coordinator()
        hass = _Hass(_DomainData(store, secrets, coordinator))
        yield _Env(ws, store, secrets, coordinator, hass, secrets_mod)


# ── owners ───────────────────────────────────────────────────────────────


def test_a_watch_row_gains_the_device_kind_field_and_nothing_else(env) -> None:
    env.add_watch(
        "watch-A",
        app_version="2.7.0",
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
        "app_version": "2.7.0",
        "screen_size": "208x248",
        "complication_count": 1,
        "token": 1,
        "applied_token": 1,
        "is_orphan": False,
    }


def test_a_phone_is_an_owner_in_its_own_right(env) -> None:
    """The whole server change: a phone entry is no longer skipped.

    Its records are keyed by caller id like any other owner's, so the counts
    and tokens come from the same store path the watch uses.
    """
    env.add_phone("phone-1", app_version="2.8.0", device_name="Jesse's iPhone")
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
            "screen_size": None,
            "app_version": "2.8.0",
            "complication_count": 2,
            "token": 2,
            "applied_token": 2,
            "is_orphan": False,
        }
    ]


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
    ]


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


def test_an_orphan_row_reports_no_device_kind_and_sorts_with_the_watches(env) -> None:
    env.add_phone("phone-1", device_name="Jesse's iPhone")
    env.save_document("phone-1")
    env.save_document("gone-watch")

    rows = env.owners()
    assert [(r["owner_watch_id"], r["device_kind"]) for r in rows] == [
        ("gone-watch", None),
        ("phone-1", "iphone"),
    ]
    assert rows[0]["is_orphan"] is True


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
    }
    assert env.coordinator.woken == [("phone-1", True)]
