"""Unloading the integration writes every store's waiting save and stops it.

Most stores save through Home Assistant's debounce (``Store.async_delay_save``),
which leaves a timer on the store instance. Unload drops the instance but not
the timer, so the save used to land after the entry was gone:

* after an uninstall: ``async_remove_entry`` deletes each file through a fresh
  ``Store``, which cancels nothing on the old one, and the old timer then
  writes the file back. Pairings with working keys, push tokens, or a user's
  private key and its password came back on disk.
* after a reload: the new instance reads the file first, and the old timer
  writes a newer copy a moment later, which the new instance then overwrites
  with the older state. A watch config revision could be reused for
  different content.

Covered here, with no Home Assistant:

* every store that debounces has an ``async_shutdown`` that writes the waiting
  save at once, cancels the timer and saves nothing after, and unload's list
  names every one of them (read from ``const.py`` and each store's source, so
  a new store cannot be left out);
* the uninstall and reload sequences above, on the real stores;
* ``async_unload_entry`` and ``async_remove_entry`` (pulled out of
  ``__init__.py`` by name, as ``test_device_removal_inprocess.py`` does);
* the one-time statistics unit cleanup names the unit class, which Home
  Assistant requires from 2026.11.
"""

from __future__ import annotations
import __future__

import ast
import asyncio
import base64
import contextlib
import copy
import importlib.util
import logging
import sys
import types
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import pytest

_SRC = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_PKG = "wa_unload_flush_test_pkg"
DOMAIN = "wrist_assistant"


# ── a Store whose debounce is a timer on the instance ────────────────────


class _Store:
    """``homeassistant.helpers.storage.Store`` as far as the debounce goes.

    As in Home Assistant, a delayed save is a timer on this instance:
    ``async_save`` and ``async_remove`` cancel this instance's timer and no
    other. ``fire_timers`` is the debounce running out.
    """

    disk: dict[str, Any] = {}
    instances: list[_Store] = []

    def __init__(self, _hass: object, _version: int, key: str, *_a: object, **_k: object) -> None:
        self.key = key
        self.timer: Any = None
        _Store.instances.append(self)

    async def async_load(self) -> Any:
        return copy.deepcopy(_Store.disk.get(self.key))

    def async_delay_save(self, data_func: Any, _delay: float = 0) -> None:
        self.timer = data_func

    async def async_save(self, data: Any) -> None:
        self.timer = None
        _Store.disk[self.key] = copy.deepcopy(data)

    async def async_remove(self) -> None:
        self.timer = None
        _Store.disk.pop(self.key, None)

    @classmethod
    def fire_timers(cls) -> None:
        for store in cls.instances:
            if store.timer is not None:
                data_func, store.timer = store.timer, None
                _Store.disk[store.key] = copy.deepcopy(data_func())

    @classmethod
    def waiting(cls) -> set[str]:
        return {store.key for store in cls.instances if store.timer is not None}


class _Hass:
    def __init__(self) -> None:
        self.data: dict[str, Any] = {}
        self.config = types.SimpleNamespace(
            path=lambda *parts: str(Path("/nonexistent-wa-test", *parts))
        )

    def async_create_task(self, coro: Any, name: str | None = None, **_k: object) -> Any:
        return asyncio.get_running_loop().create_task(coro)

    async def async_add_executor_job(self, func: Any, *args: Any) -> Any:
        return func(*args)


def _stub(name: str, **attrs: object) -> types.ModuleType:
    module = sys.modules.get(name) or types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module
    return module


def _load(name: str) -> types.ModuleType:
    spec = importlib.util.spec_from_file_location(f"{_PKG}.{name}", _SRC / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[f"{_PKG}.{name}"] = module
    spec.loader.exec_module(module)
    return module


@contextlib.contextmanager
def _loaded_package():
    saved = dict(sys.modules)
    _Store.disk, _Store.instances = {}, []
    try:
        _stub("homeassistant")
        _stub("homeassistant.core", HomeAssistant=type("HomeAssistant", (), {}), callback=lambda f: f)
        _stub("homeassistant.helpers")
        _stub("homeassistant.helpers.storage", Store=_Store)
        _stub("homeassistant.util")
        _stub(
            "homeassistant.util.dt",
            utcnow=lambda: datetime.now(UTC),
            parse_datetime=lambda value: datetime.fromisoformat(value),
        )
        sys.modules["homeassistant.util"].dt = sys.modules["homeassistant.util.dt"]
        pkg = types.ModuleType(_PKG)
        pkg.__path__ = []
        sys.modules[_PKG] = pkg
        # The real constants: const.py imports nothing at run time.
        _load("const")
        # The crop store's only import from it; the camera code needs aiohttp.
        _stub(
            f"{_PKG}.camera_stream",
            ViewportState=type("ViewportState", (), {}),
            viewport_matches=lambda a, b: a == b,
        )
        yield
    finally:
        for key in list(sys.modules):
            if key not in saved:
                del sys.modules[key]
        sys.modules.update(saved)


# Each store that saves through a debounce, and how to make it schedule one
# without going through its whole public surface.
_STORES = {
    "notifications": ("NotificationTokenStore", lambda s: s._schedule_save()),
    "widget_secret_store": ("WidgetSecretStore", lambda s: s._schedule_save()),
    "complication_store": ("ComplicationStore", lambda s: s._schedule_save()),
    "watch_config_store": (
        "WatchConfigStore",
        lambda s: (s._schedule_owner_save("watch-A"), s._schedule_index_save()),
    ),
    "watch_voices_store": ("WatchVoicesStore", lambda s: s._schedule_save()),
    "client_certificate_store": ("ClientCertificateStore", lambda s: s._schedule_save()),
    "watch_logs_store": ("WatchLogsStore", lambda s: s._schedule_save()),
    "parts_store": ("PartsStore", lambda s: s._schedule_save()),
    "card_preview_store": ("CardPreviewStore", lambda s: s._save()),
    "snapshot_crop_store": ("SnapshotCropStore", lambda s: s._schedule_save()),
    "snapshot_stream_store": ("SnapshotStreamStore", lambda s: s._schedule_save()),
    "snapshot_aspect_store": ("SnapshotAspectStore", lambda s: s._schedule_save()),
}


async def _new_store(module_name: str) -> Any:
    class_name, _ = _STORES[module_name]
    store = getattr(_load(module_name), class_name)(_Hass())
    await store.async_load()
    return store


@pytest.mark.parametrize("module_name", sorted(_STORES))
def test_shutdown_writes_the_waiting_save_and_saves_nothing_after(module_name) -> None:
    async def run() -> None:
        store = await _new_store(module_name)
        _STORES[module_name][1](store)
        waiting = _Store.waiting()
        assert waiting, "scheduling a save left no timer"
        await store.async_shutdown()
        assert _Store.waiting() == set()
        assert waiting <= set(_Store.disk)
        # Anything that reaches the unloaded instance later saves nothing.
        _Store.disk.clear()
        _STORES[module_name][1](store)
        assert _Store.waiting() == set()
        _Store.fire_timers()
        assert _Store.disk == {}

    with _loaded_package():
        asyncio.run(run())


@pytest.mark.parametrize("module_name", sorted(_STORES))
def test_shutdown_with_nothing_waiting_writes_nothing(module_name) -> None:
    async def run() -> None:
        store = await _new_store(module_name)
        await store.async_shutdown()
        assert _Store.disk == {}

    with _loaded_package():
        asyncio.run(run())


@pytest.mark.parametrize("module_name", sorted(_STORES))
def test_an_uninstall_right_after_a_change_leaves_no_file_behind(module_name) -> None:
    """Unload, then ``async_remove_entry`` deleting each file through a fresh
    Store, then the old debounce running out: nothing is written back."""

    async def run() -> None:
        store = await _new_store(module_name)
        _STORES[module_name][1](store)
        keys = _Store.waiting()
        await store.async_shutdown()
        for key in keys:
            await _Store(None, 1, key).async_remove()
        _Store.fire_timers()
        assert keys.isdisjoint(_Store.disk)

    with _loaded_package():
        asyncio.run(run())


def test_a_pairing_made_just_before_an_uninstall_does_not_come_back() -> None:
    """The audit's sequence: a pairing confirmed (secret store, 2 s debounce)
    and the integration deleted inside that window. Before, the old timer
    wrote the secrets file back and a re-added integration trusted the key."""

    async def run() -> None:
        store = await _new_store("widget_secret_store")
        store.register(
            "watch-A", base64.b64encode(b"k" * 32).decode("ascii"), "watch", user_id="alice"
        )
        await store.async_shutdown()
        await _Store(None, 1, "wrist_assistant.widget_secrets").async_remove()
        _Store.fire_timers()
        assert "wrist_assistant.widget_secrets" not in _Store.disk

    with _loaded_package():
        asyncio.run(run())


def test_a_watch_config_save_just_before_a_reload_is_read_by_the_new_store() -> None:
    """The audit's reload sequence: a save inside the 1 s debounce, then a
    reload. The new store must read that revision, so its next save is a new
    number rather than the one a watch may already have applied."""

    async def run() -> None:
        mod = _load("watch_config_store")
        old = mod.WatchConfigStore(_Hass(), is_paired=lambda _owner: True)
        await old.async_load()
        old.put("watch-A", "behavior", {}, document_hash="a" * 64, base_revision=0, updated_by="w")
        _Store.fire_timers()
        old.put(
            "watch-A",
            "behavior",
            {"wrapPages": True},
            document_hash="b" * 64,
            base_revision=1,
            updated_by="w",
        )
        await old.async_shutdown()

        new = mod.WatchConfigStore(_Hass(), is_paired=lambda _owner: True)
        await new.async_load()
        assert new.get("watch-A", "behavior").revision == 2
        _Store.fire_timers()
        assert new.get("watch-A", "behavior").document == {"wrapPages": True}

    with _loaded_package():
        asyncio.run(run())


# ── unload's list cannot miss a store ────────────────────────────────────


def _debouncing_classes() -> set[str]:
    """Every class in the package whose source calls async_delay_save."""
    found: set[str] = set()
    for path in _SRC.glob("*.py"):
        tree = ast.parse(path.read_text(), filename=path.name)
        for node in tree.body:
            if isinstance(node, ast.ClassDef) and "async_delay_save" in ast.unparse(node):
                found.add(node.name)
    return found


def _runtime_fields() -> dict[str, str]:
    """WristAssistantData's fields, by name, with their annotated class."""
    tree = ast.parse((_SRC / "const.py").read_text())
    [cls] = [n for n in tree.body if isinstance(n, ast.ClassDef) and n.name == "WristAssistantData"]
    return {
        node.target.id: ast.unparse(node.annotation).split(" ")[0]
        for node in cls.body
        if isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name)
    }


def test_every_debouncing_store_is_written_and_stopped_on_unload() -> None:
    debouncing = _debouncing_classes()
    expected = {name for name, cls in _runtime_fields().items() if cls in debouncing}
    assert expected, "found no debouncing store in the runtime data"
    namespace = _from_init({}, "_DEBOUNCED_STORES")
    assert set(namespace["_DEBOUNCED_STORES"]) == expected
    for path in _SRC.glob("*.py"):
        tree = ast.parse(path.read_text(), filename=path.name)
        for node in tree.body:
            if isinstance(node, ast.ClassDef) and node.name in debouncing:
                methods = {
                    n.name for n in node.body if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))
                }
                assert "async_shutdown" in methods, node.name


# ── async_unload_entry and async_remove_entry ────────────────────────────


def _from_init(namespace: dict[str, Any], *names: str) -> dict[str, Any]:
    """Compile the named top-level functions and assignments of __init__.py
    into ``namespace``."""
    source = (_SRC / "__init__.py").read_text()
    tree = ast.parse(source)

    def _named(node: ast.stmt) -> bool:
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            return node.name in names
        if isinstance(node, ast.Assign):
            return any(isinstance(t, ast.Name) and t.id in names for t in node.targets)
        return False

    nodes = [node for node in tree.body if _named(node)]
    assert len(nodes) == len(names), names
    code = compile(
        ast.Module(body=nodes, type_ignores=[]),
        str(_SRC / "__init__.py"),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    exec(code, namespace)  # noqa: S102
    return namespace


class _Result:
    """What a recorded call returns: awaitable when the caller awaits it (a
    store's async_shutdown), harmless when it does not (the coordinator's
    async_shutdown is a plain callback)."""

    def __init__(self, fail: bool) -> None:
        self.fail = fail

    def __await__(self):
        if self.fail:
            raise OSError("disk full")
        yield from ()


class _Journal(list):
    def recorder(self, label: str, *, fail: bool = False) -> Any:
        journal = self

        class _Recorder:
            def __getattr__(self, method: str) -> Any:
                def _call(*_a: object, **_k: object) -> _Result:
                    journal.append(f"{label}.{method}")
                    return _Result(fail)

                return _call

        return _Recorder()


def _runtime_data(journal: _Journal, *, failing: str | None = None) -> types.SimpleNamespace:
    return types.SimpleNamespace(
        **{
            name: journal.recorder(name, fail=name == failing)
            for name in (
                *_runtime_fields(),
                "coordinator",
                "http_action_runner",
            )
        }
    )


def _relay_module() -> types.ModuleType:
    spec = importlib.util.spec_from_file_location("wa_unload_relay", _SRC / "listener_relay.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _unload_namespace(journal: _Journal, relay: types.ModuleType) -> dict[str, Any]:
    namespace: dict[str, Any] = {
        "DOMAIN": DOMAIN,
        "PLATFORMS": [],
        "_LOGGER": logging.getLogger("wrist_assistant_unload_test"),
        "async_remove_panel": lambda hass: journal.append("panel removed"),
        "listener_relay": relay.listener_relay,
        "COMPLICATIONS": relay.COMPLICATIONS,
        "WATCH_CONFIG": relay.WATCH_CONFIG,
    }
    return _from_init(namespace, "async_unload_entry", "_async_shutdown_stores", "_DEBOUNCED_STORES")


def _hass_with(data: Any) -> types.SimpleNamespace:
    async def unload_platforms(_entry: object, _platforms: object) -> bool:
        return True

    return types.SimpleNamespace(
        data={DOMAIN: data},
        config_entries=types.SimpleNamespace(async_unload_platforms=unload_platforms),
    )


def test_unload_writes_every_store_and_lets_go_of_the_stores() -> None:
    journal = _Journal()
    relay = _relay_module()
    namespace = _unload_namespace(journal, relay)
    hass = _hass_with(_runtime_data(journal))
    # The live subscriptions follow this entry's stores until it unloads.
    followed = types.SimpleNamespace(async_add_listener=lambda _l: (lambda: journal.append("detached")))
    relay.listener_relay(hass, relay.COMPLICATIONS).follow(followed)
    relay.listener_relay(hass, relay.WATCH_CONFIG).follow(followed)

    assert asyncio.run(namespace["async_unload_entry"](hass, object())) is True
    shut = [line.split(".")[0] for line in journal if line.endswith(".async_shutdown")]
    assert set(shut) == set(namespace["_DEBOUNCED_STORES"]) | {
        "http_action_runner",
        "coordinator",
    }
    assert journal.count("detached") == 2
    assert DOMAIN not in hass.data


def test_one_store_failing_to_write_does_not_stop_the_others() -> None:
    journal = _Journal()
    namespace = _unload_namespace(journal, _relay_module())
    hass = _hass_with(_runtime_data(journal, failing="widget_secret_store"))
    assert asyncio.run(namespace["async_unload_entry"](hass, object())) is True
    shut = {line.split(".")[0] for line in journal if line.endswith(".async_shutdown")}
    assert set(namespace["_DEBOUNCED_STORES"]) <= shut


def _remove_namespace(journal: _Journal) -> dict[str, Any]:
    class _Fresh:
        """A store class whose fresh instance only removes its file."""

        def __init__(self, label: str) -> None:
            self.label = label

        def __call__(self, *_a: object, **_k: object) -> Any:
            return journal.recorder(f"fresh {self.label}")

    namespace: dict[str, Any] = {
        "DOMAIN": DOMAIN,
        "_LOGGER": logging.getLogger("wrist_assistant_remove_test"),
        "Store": lambda _hass, _version, key: journal.recorder(f"fresh {key}"),
        "WIDGET_SECRET_STORAGE_KEY": "secrets",
        "WIDGET_SECRET_STORAGE_VERSION": 1,
        "NOTIFICATION_TOKEN_STORAGE_KEY": "tokens",
        "NOTIFICATION_TOKEN_STORAGE_VERSION": 1,
    }
    for name in (
        "ComplicationStore",
        "WatchConfigStore",
        "WatchVoicesStore",
        "HTTPActionsStore",
        "PageImagesStore",
        "ClientCertificateStore",
        "WatchLogsStore",
    ):
        namespace[name] = _Fresh(name)
    return _from_init(namespace, "async_remove_entry", "_async_shutdown_stores", "_DEBOUNCED_STORES")


def test_remove_after_a_failed_unload_stops_the_old_stores_before_deleting() -> None:
    """Home Assistant still calls async_remove_entry when the unload failed,
    with the old stores alive. Their waiting saves are written and stopped
    first, so no timer writes a file back after it is deleted."""
    journal = _Journal()
    namespace = _remove_namespace(journal)
    hass = types.SimpleNamespace(data={DOMAIN: _runtime_data(journal)})
    asyncio.run(namespace["async_remove_entry"](hass, object()))
    shut = [i for i, line in enumerate(journal) if line.endswith(".async_shutdown")]
    removed = [i for i, line in enumerate(journal) if line.startswith("fresh ")]
    assert len(shut) == len(namespace["_DEBOUNCED_STORES"])
    assert removed and max(shut) < min(removed)
    assert DOMAIN not in hass.data


def test_remove_after_a_clean_unload_only_deletes() -> None:
    journal = _Journal()
    namespace = _remove_namespace(journal)
    hass = types.SimpleNamespace(data={})
    asyncio.run(namespace["async_remove_entry"](hass, object()))
    assert journal and all(line.startswith("fresh ") for line in journal)


# ── statistics unit cleanup ──────────────────────────────────────────────


def test_statistics_unit_cleanup_names_the_unit_class() -> None:
    """Since HA 2026.10, ``async_update_statistics_metadata`` with a new unit
    and no ``new_unit_class`` is reported as deprecated, and from 2026.11 it
    raises. The cleanup sets the unit to none, and a count has no unit class
    either, so both are passed as None."""
    calls: list[tuple[str, dict[str, Any]]] = []

    def update_metadata(_hass: object, statistic_id: str, **kwargs: Any) -> None:
        calls.append((statistic_id, kwargs))

    saved = dict(sys.modules)
    _stub("homeassistant")
    _stub("homeassistant.components")
    _stub("homeassistant.components.recorder")
    _stub(
        "homeassistant.components.recorder.statistics",
        async_update_statistics_metadata=update_metadata,
    )
    try:
        entries = [
            types.SimpleNamespace(domain="sensor", unique_id="x_watch_count", entity_id="sensor.watch_count"),
            types.SimpleNamespace(domain="sensor", unique_id="x_battery", entity_id="sensor.battery"),
        ]
        updates: list[dict[str, Any]] = []
        namespace: dict[str, Any] = {
            "_STATS_UNITS_DROPPED_FLAG": "stats_units_dropped",
            "_DROPPED_UNIT_SUFFIXES": ("_watch_count",),
            "_LOGGER": logging.getLogger("wrist_assistant_stats_test"),
            "er": types.SimpleNamespace(
                async_get=lambda hass: None,
                async_entries_for_config_entry=lambda reg, entry_id: entries,
            ),
            "ir": types.SimpleNamespace(async_delete_issue=lambda *a: None),
        }
        _from_init(namespace, "_clear_stale_statistic_units_once")
        hass = types.SimpleNamespace(
            config=types.SimpleNamespace(components={"recorder"}),
            config_entries=types.SimpleNamespace(
                async_update_entry=lambda entry, data: updates.append(data)
            ),
        )
        entry = types.SimpleNamespace(entry_id="e1", data={})
        asyncio.run(namespace["_clear_stale_statistic_units_once"](hass, entry))
    finally:
        for key in list(sys.modules):
            if key not in saved:
                del sys.modules[key]
        sys.modules.update(saved)

    assert calls == [
        ("sensor.watch_count", {"new_unit_class": None, "new_unit_of_measurement": None})
    ]
    assert updates == [{"stats_units_dropped": True}]
