"""Tests for ``starter_page_make``: a new iPhone's starter page, and the same
page on its watch (app repo ``docs/magic_setup_2026-11.md``).

The page itself (``starter_page.py``) is pinned to the panel's own Add tile
through the shared fixture ``tests/fixtures/starter_page/starter_page.json``,
written by ``frontend/test/starter-page-fixture.test.ts``.

The op is pulled out of ``wa_v2_views.py`` by name, as
``test_home_map_page_add.py`` pulls its own, and run against a real
``WatchConfigStore`` (with its library) over the in-memory ``Store`` of
``test_http_actions_store.py``. Home Assistant's registries and states are
stand-ins handed to the op as ``home_areas.py`` would read them.

Covered: the page against the fixture; the made reply for a fresh iPhone (the
library page, the first record on disk, the states cut to what a tile reads);
has_pages; nothing_to_show; the small home's switches; the first pass of
three per area and the fill to twelve; not_an_iphone; a refused disk write
answered 503 and a retry that answers the page once it lands; the watch (one
library page both records hold, has_pages, asked again, not_your_watch,
unknown_device, awaiting_move, not_reported until the watch says what it
runs, has_own_setup for a watch with a setup of its own, unknown_page,
invalid bodies); the dispatch table and the capability.
"""

from __future__ import annotations
import __future__

import ast
import asyncio
import contextlib
import copy
import importlib.util
import json
import re
import sys
import types
from pathlib import Path
from typing import Any

import pytest
from platform_names import PLATFORM_HELPERS, platform_namespace
from test_http_actions_store import FakeStore
from test_page_images_store import FakeHass

_ROOT = Path(__file__).resolve().parents[1]
_PKG_DIR = _ROOT / "custom_components" / "wrist_assistant"
_PKG = "wa_starter_page_test_pkg"
_VIEWS = _PKG_DIR / "wa_v2_views.py"
_FIXTURE = json.loads((_ROOT / "tests" / "fixtures" / "starter_page" / "starter_page.json").read_text())
_NAMES = (
    "_caller_is_iphone",
    *PLATFORM_HELPERS,
    "_watch_config_refusal",
    "_starter_page_refusal",
    "_starter_page_unsaved",
    "_starter_page_store_refusal",
    "_held_page",
    "_starter_page_states",
    "_starter_page_made",
    "_op_starter_page_make",
    "_starter_page_on_watch",
)
IPHONE = "iphone:1"
OTHER_IPHONE = "iphone:2"
WATCH = "watch-A"
STRANGERS_WATCH = "watch-B"
UNBOUND_WATCH = "watch-C"
USER = "user-1"
OTHER_USER = "user-2"
HASH = "c" * 64
UUID_UPPER = re.compile(r"^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$")


def _stub(name: str, **attrs: object) -> None:
    module = sys.modules.get(name) or types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module


def _load(name: str):
    spec = importlib.util.spec_from_file_location(f"{_PKG}.{name}", _PKG_DIR / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[f"{_PKG}.{name}"] = module
    spec.loader.exec_module(module)
    return module


@contextlib.contextmanager
def _loaded():
    saved = dict(sys.modules)
    FakeStore.files, FakeStore.writes, FakeStore.removed = {}, [], []
    FakeStore.unreadable = set()
    FakeStore.deferred, FakeStore.pending = False, {}
    try:
        _stub("homeassistant")
        _stub("homeassistant.helpers")
        _stub("homeassistant.helpers.storage", Store=FakeStore)
        _stub("homeassistant.core", HomeAssistant=type("HomeAssistant", (), {}), callback=lambda f: f)
        pkg = types.ModuleType(_PKG)
        pkg.__path__ = []
        sys.modules[_PKG] = pkg
        _load("const")
        page_links = _load("page_links")
        library = _load("library")
        wc = _load("watch_config_store")
        starter = _load("starter_page")
        yield types.SimpleNamespace(page_links=page_links, library=library, wc=wc, starter=starter)
    finally:
        for key in list(sys.modules):
            if key not in saved:
                del sys.modules[key]
        sys.modules.update(saved)


class _Response:
    def __init__(self, status: int, body: Any) -> None:
        self.status = status
        self.body = body


class _States:
    """``hass.states``: a state object per entity id."""

    def __init__(self) -> None:
        self.by_id: dict[str, Any] = {}

    def set(self, entity_id: str, state: str, attributes: dict[str, Any] | None = None) -> None:
        self.by_id[entity_id] = types.SimpleNamespace(
            entity_id=entity_id, state=state, attributes=dict(attributes or {})
        )

    def get(self, entity_id: str):
        return self.by_id.get(entity_id)

    def async_entity_ids(self) -> list[str]:
        return list(self.by_id)


class _Home:
    """What ``home_areas.py`` reads of Home Assistant, as its three readers
    give it."""

    def __init__(self) -> None:
        self.floors: list[dict[str, Any]] = []
        self.areas: list[dict[str, Any]] = []
        self.entities: list[dict[str, Any]] = []
        self.states = _States()

    def add(self, entity_id: str, name: str, area: str | None = None, **extra: Any) -> None:
        self.entities.append({
            "id": entity_id,
            "name": name,
            "area_id": area,
            "device_class": extra.pop("device_class", None),
            "entity_category": extra.pop("entity_category", None),
            "hidden": extra.pop("hidden", False),
            "device_id": None,
            "device_name": None,
            "device_model": None,
        })
        attributes = {"friendly_name": name, **extra.pop("attributes", {})}
        self.states.set(entity_id, extra.pop("state", "on"), attributes)


class _Ctx:
    def __init__(self, domain: Any, hass: Any, watch_id: str, payload: dict, user_id: str | None) -> None:
        self.domain_data = domain
        self.hass = hass
        self.watch_id = watch_id
        self.payload = payload
        self.user_id = user_id

    def signed_json(self, payload: dict, status: int = 200) -> _Response:
        # Through JSON, as the wire carries it.
        return _Response(status, json.loads(json.dumps(payload)))


class _Secrets:
    """The widget secret store: two iPhones of two users, the first user's
    watch, another user's watch and a watch bound to no one. Each watch said
    it runs only the standard settings."""

    def __init__(self) -> None:
        self.entries = {
            IPHONE: types.SimpleNamespace(device_kind="iphone", user_id=USER),
            OTHER_IPHONE: types.SimpleNamespace(device_kind="iphone", user_id=OTHER_USER),
            WATCH: types.SimpleNamespace(device_kind="watch", user_id=USER, standard_settings=True),
            STRANGERS_WATCH: types.SimpleNamespace(
                device_kind="watch", user_id=OTHER_USER, standard_settings=True
            ),
            UNBOUND_WATCH: types.SimpleNamespace(
                device_kind="watch", user_id=None, owner_iphone_id=IPHONE, standard_settings=True
            ),
        }
        self.awaiting: set[str] = set()

    def get(self, watch_id: str):
        return self.entries.get(watch_id)

    @property
    def all_entries(self) -> dict[str, Any]:
        return dict(self.entries)

    def may_await_move(self, watch_id: str) -> bool:
        return watch_id in self.awaiting

    def is_watch(self, owner: str) -> bool:
        entry = self.entries.get(owner)
        return entry is not None and entry.device_kind == "watch"

    def is_iphone(self, owner: str) -> bool:
        entry = self.entries.get(owner)
        return entry is not None and entry.device_kind == "iphone"


def _ops(loaded: Any, home: _Home) -> dict[str, Any]:
    tree = ast.parse(_VIEWS.read_text(), filename=str(_VIEWS))
    wanted = [
        node
        for node in tree.body
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in _NAMES
    ]
    assert sorted(n.name for n in wanted) == sorted(_NAMES)
    wanted[:0] = [
        node
        for node in tree.body
        if isinstance(node, ast.Assign)
        and isinstance(node.targets[0], ast.Name)
        and node.targets[0].id == "_STARTER_PAGE_STATUS"
    ]
    code = compile(
        ast.Module(body=wanted, type_ignores=[]),
        str(_VIEWS),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    wc, sp = loaded.wc, loaded.starter
    namespace: dict[str, Any] = {
        **platform_namespace(),
        "Any": Any,
        "Response": _Response,
        "_LOGGER": types.SimpleNamespace(info=lambda *a, **k: None, debug=lambda *a, **k: None),
        "is_iphone_entry": lambda secret: getattr(secret, "device_kind", None) == "iphone",
        "WatchConfigStoreError": wc.WatchConfigStoreError,
        "WatchConfigConflictError": wc.WatchConfigConflictError,
        "WatchConfigUnavailableError": wc.WatchConfigUnavailableError,
        "new_item_id": loaded.library.new_item_id,
        "home_floors": lambda _hass: copy.deepcopy(home.floors),
        "home_areas": lambda _hass: copy.deepcopy(home.areas),
        "home_entities": lambda _hass: copy.deepcopy(home.entities),
        "new_starter_page": sp.new_starter_page,
        "starter_entities": sp.starter_entities,
        "tile_entity_ids": sp.tile_entity_ids,
        "tile_state": sp.tile_state,
    }
    exec(code, namespace)  # noqa: S102
    return namespace


def _a_home(home: _Home) -> None:
    """A small house: two lights and a TV in the living room, a lock with
    no area."""
    home.floors = [{"id": "ground", "name": "Ground", "level": 0}]
    home.areas = [{"id": "living", "name": "Living Room", "floor_id": "ground", "entity_ids": []}]
    home.add(
        "light.lamp",
        "Lamp",
        "living",
        attributes={
            "brightness": 200,
            "color_mode": "brightness",
            "supported_color_modes": ["brightness"],
            "supported_features": 40,
            "entity_picture": "/local/x.png",
            "effect_list": ["a", "b"],
        },
    )
    home.add("light.ceiling", "Ceiling", "living", state="off")
    home.add(
        "media_player.tv",
        "TV",
        "living",
        device_class="tv",
        attributes={"device_class": "tv", "media_title": "News", "source_list": ["HDMI 1"]},
    )
    home.add("lock.front", "Front Door", None, state="locked")
    home.add("sensor.temp", "Temperature", "living", attributes={"unit_of_measurement": "°C"})


@pytest.fixture
def env(tmp_path):
    with _loaded() as loaded:
        secrets = _Secrets()
        pages = loaded.wc.WatchConfigStore(
            FakeHass(tmp_path),
            is_paired=secrets.is_watch,
            is_iphone=secrets.is_iphone,
            may_await_move=secrets.may_await_move,
        )
        asyncio.run(pages.async_load())
        changes: list[tuple[str, str, int]] = []
        pages.async_add_listener(lambda c: changes.append((c.owner_watch_id, c.kind, c.revision)))
        home = _Home()
        _a_home(home)
        domain = types.SimpleNamespace(
            watch_config_store=pages, widget_secret_store=secrets, starter_pages={}
        )
        yield types.SimpleNamespace(
            loaded=loaded,
            pages=pages,
            secrets=secrets,
            home=home,
            hass=types.SimpleNamespace(states=home.states),
            domain=domain,
            changes=changes,
            ops=_ops(loaded, home),
        )


def make(env, payload: dict | None = None, signer: str = IPHONE) -> _Response:
    entry = env.secrets.get(signer)
    user = getattr(entry, "user_id", None) if entry is not None else None
    ctx = _Ctx(env.domain, env.hass, signer, payload if payload is not None else {}, user)
    return asyncio.run(env.ops["_op_starter_page_make"](ctx))


def record(env, owner: str = IPHONE):
    return env.pages.get(owner, "pages")


def put(env, owner: str, document: dict[str, Any]) -> None:
    env.pages.put(
        owner, "pages", copy.deepcopy(document), document_hash=HASH, base_revision=0,
        force=True, updated_by=owner,
    )


def _own_pages() -> dict[str, Any]:
    return {
        "schemaVersion": 1,
        "pages": [{"id": "AAAAAAAA-0000-4000-8000-000000000001", "name": "Mine", "items": []}],
    }


def _refuse_writes(env, owner: str) -> dict[str, Any]:
    """The owner's file as a full disk: every write is logged as failed.
    ``disk["full"] = False`` makes room again."""
    file = env.pages._file(owner)
    disk = {"full": True, "writes": 0}

    async def async_save(_data: Any) -> None:
        disk["writes"] += 1
        file.write_failed = disk["full"]

    file.async_save = async_save
    file.async_delay_save = lambda *_a, **_k: None
    return disk


# ── the page, against the panel ─────────────────────────────────────────


@pytest.mark.parametrize("case", _FIXTURE["cases"], ids=lambda c: c["name"])
def test_the_page_is_the_panels(env, case) -> None:
    """``starter_page.py`` against the fixture the panel's own functions
    wrote (``frontend/test/starter-page-fixture.test.ts``): the same picks,
    and the same page key for key and in the same key order."""
    sp = env.loaded.starter
    rows = sp.starter_entities(case["floors"], case["areas"], case["entities"])
    assert [r["id"] for r in rows] == case["picked"]
    if case["page"] is None:
        assert rows == []
        return
    state_ids = set(case["state_ids"]) | {e["id"] for e in case["entities"]}
    built = sp.new_starter_page(case["page_id"], rows, case["tile_ids"], state_ids)
    assert built == case["page"]
    assert json.dumps(built) == json.dumps(case["page"])
    # And after the library's create, as the panel's page would be.
    create = env.loaded.library.create_item
    empty = env.loaded.library.empty_library()
    assert create(empty, "pages", built).library["pages"] == create(empty, "pages", case["page"]).library["pages"]


@pytest.mark.parametrize("given", _FIXTURE["tiles"], ids=lambda t: t["row"]["id"])
def test_each_tile_is_the_panels_add_tile(env, given) -> None:
    state_ids = set(_FIXTURE["tile_state_ids"]) | {t["row"]["id"] for t in _FIXTURE["tiles"]}
    built = env.loaded.starter.starter_tile(given["row"], given["tile_id"], 0, state_ids)
    assert built == given["tile"]
    assert list(built) == list(given["tile"])


def test_the_page_lays_two_tiles_a_row() -> None:
    page = _FIXTURE["cases"][0]["page"]
    assert [(t["gridCol"], t["gridRow"]) for t in page["items"]] == [
        ((i % 2) * 6, (i // 2) * 4) for i in range(12)
    ]


def test_a_small_home_takes_its_switches(env) -> None:
    sp = env.loaded.starter
    rows = [
        {"id": "light.one", "name": "One", "area_id": None},
        {"id": "switch.two", "name": "Two", "area_id": None},
        {"id": "input_boolean.three", "name": "Three", "area_id": None},
        {"id": "camera.four", "name": "Four", "area_id": None},
    ]
    assert [r["id"] for r in sp.starter_entities([], [], rows)] == [
        "light.one", "switch.two", "input_boolean.three",
    ]
    # Two main devices: no switches.
    rows.append({"id": "fan.five", "name": "Five", "area_id": None})
    assert [r["id"] for r in sp.starter_entities([], [], rows)] == ["light.one", "fan.five"]


def test_three_per_area_first_then_the_rest_in_area_order(env) -> None:
    sp = env.loaded.starter
    areas = [{"id": a, "name": a, "floor_id": None} for a in ("a", "b", "c")]
    rows = [
        {"id": f"light.{area}{n:02d}", "name": f"{area}{n:02d}", "area_id": area}
        for area, count in (("a", 8), ("b", 5), ("c", 1))
        for n in range(count)
    ]
    picked = [r["id"] for r in sp.starter_entities([], areas, rows)]
    # First pass 3 + 3 + 1, then the fill: a's next five reach twelve.
    assert picked == [
        *(f"light.a{n:02d}" for n in range(8)),
        "light.b00", "light.b01", "light.b02",
        "light.c00",
    ]
    assert len(picked) == sp.MAX_TILES


def test_the_states_keep_only_what_a_tile_reads(env) -> None:
    sp = env.loaded.starter
    cut = sp.tile_state("on", {"friendly_name": "A", "brightness": 3, "entity_picture": "/x", "icon": "mdi:a"})
    assert cut == {"state": "on", "attributes": {"friendly_name": "A", "brightness": 3, "icon": "mdi:a"}}


# ── the iPhone ───────────────────────────────────────────────────────────


def test_a_fresh_iphone_gets_its_starter_page_on_disk(env) -> None:
    reply = make(env)
    assert reply.status == 200
    body = reply.body
    page_id = body["page_id"]
    assert UUID_UPPER.match(page_id)
    assert set(body) == {"ok", "made", "page_id", "revision", "page", "states"}
    assert body["ok"] is True and body["made"] is True
    assert body["revision"] == record(env).revision
    # The page: the four main devices, area by area, then no area.
    assert body["page"]["id"] == page_id
    assert body["page"]["name"] == "Home"
    assert body["page"]["pageTitleIcon"] == "house"
    assert "mapPage" not in body["page"]
    assert [t["entityId"] for t in body["page"]["items"]] == [
        "light.ceiling", "light.lamp", "media_player.tv", "lock.front",
    ]
    assert [t["icon"] for t in body["page"]["items"]] == ["lightbulb", "lightbulb", "av.remote", "lock"]
    assert all(UUID_UPPER.match(t["id"]) for t in body["page"]["items"])
    # The iPhone's first pages record holds that page alone, as the reply.
    assert record(env).document["pages"] == [body["page"]]
    # One library page, picked by the iPhone.
    summary = env.pages.library_summary()
    assert summary["pages"][page_id]["owners"] == [IPHONE]
    # On disk before the reply.
    assert FakeStore.files, "written"
    assert not env.pages.holds_unsaved(IPHONE)
    assert IPHONE not in env.pages._pending_owners
    # The states of the tiles, cut to what a tile reads.
    assert body["states"] == {
        "light.ceiling": {"state": "off", "attributes": {"friendly_name": "Ceiling"}},
        "light.lamp": {
            "state": "on",
            "attributes": {
                "friendly_name": "Lamp",
                "brightness": 200,
                "color_mode": "brightness",
                "supported_color_modes": ["brightness"],
                "supported_features": 40,
            },
        },
        "media_player.tv": {
            "state": "on",
            "attributes": {"friendly_name": "TV", "device_class": "tv", "media_title": "News"},
        },
        "lock.front": {"state": "locked", "attributes": {"friendly_name": "Front Door"}},
    }
    assert env.changes == [(IPHONE, "pages", record(env).revision)]


def test_asked_again_the_iphone_gets_the_same_page(env) -> None:
    first = make(env).body
    env.changes.clear()
    library = copy.deepcopy(env.pages.library_summary())
    again = make(env)
    assert again.status == 200
    assert again.body == first
    assert env.pages.library_summary() == library
    assert env.changes == []


def test_an_iphone_holding_pages_is_left_alone(env) -> None:
    put(env, IPHONE, _own_pages())
    env.changes.clear()
    library = copy.deepcopy(env.pages.library_summary())
    reply = make(env)
    assert reply.status == 200
    assert reply.body == {"ok": True, "made": False, "reason": "has_pages"}
    assert record(env).document == _own_pages()
    assert env.pages.library_summary() == library
    assert env.changes == []


def test_a_record_with_only_a_system_page_counts_as_pages(env) -> None:
    put(env, IPHONE, {"schemaVersion": 1, "pages": [{"id": "S", "name": "Settings", "isSystemPage": True, "items": []}]})
    assert make(env).body == {"ok": True, "made": False, "reason": "has_pages"}


def test_a_home_with_nothing_to_show_says_so(env) -> None:
    env.home.entities = [e for e in env.home.entities if e["id"] == "sensor.temp"]
    env.home.add("light.hidden", "Hidden", hidden=True)
    env.home.add("light.status", "Status", entity_category="diagnostic")
    reply = make(env)
    assert reply.status == 200
    assert reply.body == {"ok": True, "made": False, "reason": "nothing_to_show"}
    assert record(env) is None
    assert env.pages.library_summary()["pages"] == {}


def test_a_home_of_one_light_takes_its_switches(env) -> None:
    env.home.entities = [e for e in env.home.entities if e["id"] == "light.lamp"]
    env.home.add("switch.kettle", "Kettle", "living")
    env.home.add("input_boolean.guests", "Guests")
    reply = make(env)
    assert reply.status == 200
    assert [t["entityId"] for t in reply.body["page"]["items"]] == [
        "light.lamp", "switch.kettle", "input_boolean.guests",
    ]
    assert set(reply.body["states"]) == {"light.lamp", "switch.kettle", "input_boolean.guests"}


def test_a_big_home_shows_twelve_three_per_area_first(env) -> None:
    env.home.floors = [
        {"id": "up", "name": "Upstairs", "level": 1},
        {"id": "ground", "name": "Ground", "level": 0},
    ]
    env.home.areas = [
        {"id": "bed", "name": "Bedroom", "floor_id": "up"},
        {"id": "living", "name": "Living Room", "floor_id": "ground"},
        {"id": "kitchen", "name": "Kitchen", "floor_id": "ground"},
    ]
    env.home.entities = []
    for n in range(6):
        env.home.add(f"light.kitchen_{n}", f"Kitchen {n}", "kitchen")
        env.home.add(f"light.bed_{n}", f"Bed {n}", "bed")
    for n in range(2):
        env.home.add(f"fan.living_{n}", f"Living {n}", "living")
    env.home.add("vacuum.robot", "Robot")
    items = make(env).body["page"]["items"]
    # First pass: kitchen 3, living 2, bedroom 3, no area 1 = 9; the fill
    # gives the kitchen its next three.
    assert [t["entityId"] for t in items] == [
        *(f"light.kitchen_{n}" for n in range(6)),
        "fan.living_0", "fan.living_1",
        "light.bed_0", "light.bed_1", "light.bed_2",
        "vacuum.robot",
    ]
    assert [(t["gridCol"], t["gridRow"], t["colSpan"], t["rowSpan"]) for t in items] == [
        ((i % 2) * 6, (i // 2) * 4, 6, 4) for i in range(12)
    ]


def test_a_watch_is_refused(env) -> None:
    reply = make(env, signer=WATCH)
    assert reply.status == 403
    assert reply.body == {
        "ok": False, "error": "not_an_iphone", "message": "Only an iPhone asks for a starter page.",
    }
    assert record(env, WATCH) is None
    assert env.pages.library_summary()["pages"] == {}


def test_an_unknown_signer_is_refused(env) -> None:
    assert make(env, signer="who").status == 403


def test_with_no_store_it_is_unavailable(env) -> None:
    env.domain.watch_config_store = None
    reply = make(env)
    assert (reply.status, reply.body["error"]) == (503, "unavailable")


def test_a_refused_disk_write_is_a_503_and_a_retry_answers_the_page(env) -> None:
    """Home Assistant logs a write it could not make and returns. The phone
    must not take a page a restart could lose, and its retry must get that
    same page once the disk has room."""
    disk = _refuse_writes(env, IPHONE)
    reply = make(env)
    assert reply.status == 503
    assert reply.body == {
        "ok": False,
        "error": "unavailable",
        "message": "Home Assistant could not save to its disk. Try again in a moment.",
    }
    held = record(env).document["pages"][0]["id"]
    # Still full: still 503, and the file is written again.
    writes = disk["writes"]
    assert make(env).status == 503
    assert disk["writes"] > writes
    disk["full"] = False
    again = make(env)
    assert again.status == 200
    assert again.body["made"] is True
    assert again.body["page_id"] == held
    assert set(again.body["states"]) == {t["entityId"] for t in again.body["page"]["items"]}
    # One page only in the library.
    assert list(env.pages.library_summary()["pages"]) == [held]


def test_a_refused_pick_leaves_no_page_in_the_library(env, monkeypatch) -> None:
    wc = env.loaded.wc

    def refuse(*_args: Any, **_kwargs: Any) -> None:
        raise wc.WatchConfigValidationError("the pages record is over its cap")

    monkeypatch.setattr(env.pages, "library_pick", refuse)
    reply = make(env)
    assert reply.status == 400
    assert reply.body["error"] == "invalid"
    assert env.pages.library_summary()["pages"] == {}
    assert record(env) is None
    assert env.domain.starter_pages == {}


def test_the_store_never_makes_a_second_first_record(env) -> None:
    put(env, IPHONE, _own_pages())
    wc = env.loaded.wc
    page = env.loaded.starter.new_starter_page(
        "P", [{"id": "light.x", "name": "X"}], ["T"], set()
    )
    with pytest.raises(wc.WatchConfigLinkError) as raised:
        env.pages.library_first_page(IPHONE, {"schemaVersion": 1, "pages": [page]})
    assert raised.value.code == "has_pages"
    assert env.pages.library_summary()["pages"].get("P") is None


# ── the watch ────────────────────────────────────────────────────────────


def _made(env) -> str:
    reply = make(env)
    assert reply.status == 200
    env.changes.clear()
    return reply.body["page_id"]


def test_the_watch_gets_the_iphones_page(env) -> None:
    page_id = _made(env)
    reply = make(env, {"watch_id": WATCH, "page_id": page_id.lower()})
    assert reply.status == 200
    assert reply.body == {"ok": True, "made": True, "revision": record(env, WATCH).revision}
    # One library page, both records hold it.
    summary = env.pages.library_summary()
    assert list(summary["pages"]) == [page_id]
    assert sorted(summary["pages"][page_id]["owners"]) == sorted([IPHONE, WATCH])
    assert [p["id"] for p in record(env, WATCH).document["pages"]] == [page_id]
    assert [p["id"] for p in record(env).document["pages"]] == [page_id]
    assert [t["entityId"] for t in record(env, WATCH).document["pages"][0]["items"]] == [
        t["entityId"] for t in record(env).document["pages"][0]["items"]
    ]
    # On disk before the reply, and the watch's poll wakes.
    assert not env.pages.holds_unsaved(WATCH)
    assert WATCH not in env.pages._pending_owners
    assert env.changes == [(WATCH, "pages", record(env, WATCH).revision)]


def test_asked_again_the_watch_is_answered_as_made(env) -> None:
    page_id = _made(env)
    first = make(env, {"watch_id": WATCH, "page_id": page_id}).body
    env.changes.clear()
    assert make(env, {"watch_id": WATCH, "page_id": page_id}).body == first
    assert env.changes == []


def test_a_watch_holding_pages_is_left_alone(env) -> None:
    page_id = _made(env)
    put(env, WATCH, _own_pages())
    env.changes.clear()
    reply = make(env, {"watch_id": WATCH, "page_id": page_id})
    assert reply.status == 200
    assert reply.body == {"ok": True, "made": False, "reason": "has_pages"}
    assert record(env, WATCH).document == _own_pages()
    assert env.changes == []


def test_a_watch_of_another_user_is_refused(env) -> None:
    page_id = _made(env)
    for watch in (STRANGERS_WATCH, UNBOUND_WATCH, OTHER_IPHONE, IPHONE):
        reply = make(env, {"watch_id": watch, "page_id": page_id})
        assert reply.status == 403, watch
        assert reply.body == {
            "ok": False,
            "error": "not_your_watch",
            "message": "That watch is not one of this iPhone's watches.",
        }
    assert record(env, STRANGERS_WATCH) is None
    assert record(env, UNBOUND_WATCH) is None


def test_an_iphone_bound_to_no_user_has_no_watch(env) -> None:
    page_id = _made(env)
    env.secrets.entries[IPHONE].user_id = None
    reply = make(env, {"watch_id": UNBOUND_WATCH, "page_id": page_id})
    assert (reply.status, reply.body["error"]) == (403, "not_your_watch")


def test_a_watch_not_paired_yet_is_unknown(env) -> None:
    page_id = _made(env)
    reply = make(env, {"watch_id": "watch-new", "page_id": page_id})
    assert reply.status == 409
    assert reply.body == {
        "ok": False,
        "error": "unknown_device",
        "message": "That watch is not paired with Home Assistant yet.",
    }
    # Paired since (its status poll fetched the box) and reported: the
    # retry lands.
    env.secrets.entries["watch-new"] = types.SimpleNamespace(
        device_kind="watch", user_id=USER, standard_settings=True
    )
    assert make(env, {"watch_id": "watch-new", "page_id": page_id}).body["made"] is True


def test_a_watch_that_has_not_said_what_it_runs_is_asked_again(env) -> None:
    # Paired again after a Forget: Home Assistant holds no report yet, and
    # the watch may still send its own pages as its seed.
    page_id = _made(env)
    env.secrets.entries[WATCH].standard_settings = None
    reply = make(env, {"watch_id": WATCH, "page_id": page_id})
    assert reply.status == 409
    assert reply.body == {
        "ok": False,
        "error": "not_reported",
        "message": "That watch has not told Home Assistant about its own setup yet. Ask again in a moment.",
    }
    assert record(env, WATCH) is None
    assert env.changes == []
    # It reported a fresh watch: the retry lands.
    env.secrets.entries[WATCH].standard_settings = True
    assert make(env, {"watch_id": WATCH, "page_id": page_id}).body["made"] is True


def test_a_watch_with_a_setup_of_its_own_keeps_it(env) -> None:
    page_id = _made(env)
    env.secrets.entries[WATCH].standard_settings = False
    reply = make(env, {"watch_id": WATCH, "page_id": page_id})
    assert reply.status == 200
    assert reply.body == {"ok": True, "made": False, "reason": "has_own_setup"}
    assert record(env, WATCH) is None
    assert env.changes == []
    # Its seed lands later: the watch's own pages, never the starter page.
    put(env, WATCH, _own_pages())
    assert make(env, {"watch_id": WATCH, "page_id": page_id}).body == {
        "ok": True, "made": False, "reason": "has_pages",
    }


def test_an_entry_with_no_report_field_is_asked_again(env) -> None:
    # An entry read from an older store has no field at all.
    page_id = _made(env)
    env.secrets.entries[WATCH] = types.SimpleNamespace(device_kind="watch", user_id=USER)
    assert make(env, {"watch_id": WATCH, "page_id": page_id}).body["error"] == "not_reported"


def test_a_watch_awaiting_its_iphones_move_is_refused(env) -> None:
    page_id = _made(env)
    env.secrets.awaiting.add(WATCH)
    reply = make(env, {"watch_id": WATCH, "page_id": page_id})
    assert reply.status == 409
    assert reply.body["error"] == "awaiting_move"
    assert record(env, WATCH) is None
    assert env.changes == []


def test_a_page_the_iphone_does_not_hold_is_unknown(env) -> None:
    page_id = _made(env)
    # A library page the other iPhone holds, and an id the library lacks.
    put(env, OTHER_IPHONE, _own_pages())
    env.pages.library_pick(OTHER_IPHONE, "pages", page_id, on=False)
    others = env.pages.library_summary()["picks"][OTHER_IPHONE]["pages"][0]["id"]
    for asked in (others, "AAAAAAAA-0000-4000-8000-00000000ABCD"):
        reply = make(env, {"watch_id": WATCH, "page_id": asked})
        assert reply.status == 409, asked
        assert reply.body["error"] == "unknown_page"
    assert record(env, WATCH) is None


@pytest.mark.parametrize(
    "payload",
    [
        {"watch_id": WATCH},
        {"page_id": "P"},
        {"watch_id": "", "page_id": "P"},
        {"watch_id": WATCH, "page_id": ""},
        {"watch_id": 5, "page_id": "P"},
        {"watch_id": WATCH, "page_id": None},
        {"watch_id": [WATCH], "page_id": "P"},
    ],
)
def test_a_watch_body_without_both_ids_is_invalid(env, payload) -> None:
    _made(env)
    reply = make(env, payload)
    assert reply.status == 400
    assert reply.body["error"] == "invalid"
    assert record(env, WATCH) is None


def test_a_watch_write_the_disk_refused_is_a_503_then_made(env) -> None:
    page_id = _made(env)
    disk = _refuse_writes(env, WATCH)
    reply = make(env, {"watch_id": WATCH, "page_id": page_id})
    assert (reply.status, reply.body["error"]) == (503, "unavailable")
    assert make(env, {"watch_id": WATCH, "page_id": page_id}).status == 503
    disk["full"] = False
    again = make(env, {"watch_id": WATCH, "page_id": page_id})
    assert again.status == 200
    assert again.body == {"ok": True, "made": True, "revision": record(env, WATCH).revision}


def test_a_watch_signing_for_another_watch_is_refused(env) -> None:
    page_id = _made(env)
    reply = make(env, {"watch_id": WATCH, "page_id": page_id}, signer=WATCH)
    assert (reply.status, reply.body["error"]) == (403, "not_an_iphone")


# ── static ───────────────────────────────────────────────────────────────


def test_the_op_is_in_the_dispatch_table() -> None:
    tree = ast.parse(_VIEWS.read_text())
    for node in tree.body:
        target = node.targets[0] if isinstance(node, ast.Assign) else (
            node.target if isinstance(node, ast.AnnAssign) else None
        )
        if isinstance(target, ast.Name) and target.id == "_OP_HANDLERS":
            table = {
                k.value: v.id
                for k, v in zip(node.value.keys, node.value.values, strict=True)
                if isinstance(k, ast.Constant) and isinstance(v, ast.Name)
            }
            break
    else:
        raise AssertionError("no _OP_HANDLERS")
    assert table["starter_page_make"] == "_op_starter_page_make"


def test_setup_advertises_the_capability_last() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    assert 'STARTER_PAGE_CAPABILITY = "starter_page"' in const
    lines = [line.strip() for line in init.splitlines() if "register_capability(" in line]
    assert lines.index("coordinator.register_capability(STARTER_PAGE_CAPABILITY)") == lines.index(
        "coordinator.register_capability(DEVICE_PLATFORMS_CAPABILITY)"
    ) + 1


def test_the_runtime_data_keeps_the_pages_made() -> None:
    const = (_PKG_DIR / "const.py").read_text()
    assert "starter_pages: dict[str, str] = field(default_factory=dict)" in const
