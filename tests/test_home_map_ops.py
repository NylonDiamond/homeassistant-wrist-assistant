"""In-process tests for the home map's ways in.

The three signed ops are pulled out of ``wa_v2_views.py`` by name, the way
``test_page_images_ops.py`` pulls its own, and run against a real
``HomeMapStore`` over the stand-ins of ``test_home_map_store.py``. The
WebSocket commands are loaded from ``home_map_ws.py``, and the areas from
``home_areas.py``, with stubbed Home Assistant modules. ``home_map_rev`` is
checked on real delta replies from the coordinator fixture of
``test_delta_coordinator_inprocess.py``. The wire shapes the app and the
panel are built against are asserted as whole dicts.

Static checks at the bottom: the ops in the dispatch table, and setup
building the store, attaching it to the coordinator, registering the
commands, advertising the capability beside ``tile_photos`` and writing the
store out on unload.
"""

from __future__ import annotations
import __future__

import ast
import asyncio
import json
import sys
import types
from pathlib import Path
from typing import Any

import pytest
from test_delta_coordinator_inprocess import _poll, coordinator  # noqa: F401
from test_home_map_store import KEY, LIVING, basic, loaded_package
from test_http_actions_store import FakeStore

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_VIEWS = _PKG_DIR / "wa_v2_views.py"
_NAMES = (
    "_caller_is_iphone",
    "_home_map_refusal",
    "_op_home_map_get",
    "_op_home_map_put",
    "_op_areas_get",
)
IPHONE = "iphone-1"
WATCH = "watch-A"


class _Response:
    def __init__(self, status: int, body: Any) -> None:
        self.status = status
        self.body = body


class _Ctx:
    def __init__(self, env, watch_id: str, payload: dict, body: bytes | None = None) -> None:
        self.hass = env.hass
        self.domain_data = env.domain
        self.watch_id = watch_id
        self.payload = payload
        self.body = json.dumps(payload).encode() if body is None else body

    def signed_json(self, payload: dict, status: int = 200) -> _Response:
        # Through JSON, as the wire carries it.
        return _Response(status, json.loads(json.dumps(payload)))


class _Secrets:
    """The widget secret store: an iPhone and a watch."""

    def __init__(self) -> None:
        self.entries = {
            IPHONE: types.SimpleNamespace(device_kind="iphone"),
            WATCH: types.SimpleNamespace(device_kind="watch"),
        }

    def get(self, watch_id: str):
        return self.entries.get(watch_id)


def _ops(store_mod: Any, areas: Any) -> dict[str, Any]:
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
        and node.targets[0].id.startswith("_HOME_MAP_")
    ]
    code = compile(
        ast.Module(body=wanted, type_ignores=[]),
        str(_VIEWS),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    namespace: dict[str, Any] = {
        "Any": Any,
        "Response": _Response,
        "_LOGGER": types.SimpleNamespace(debug=lambda *a, **k: None),
        "is_iphone_entry": lambda secret: getattr(secret, "device_kind", None) == "iphone",
        "home_areas": areas.home_areas,
        "home_entities": areas.home_entities,
        **{
            name: getattr(store_mod, name)
            for name in (
                "HomeMapError",
                "HomeMapConflictError",
                "HomeMapInvalidError",
                "HomeMapTooLargeError",
                "HomeMapUnavailableError",
            )
        },
    }
    exec(code, namespace)  # noqa: S102
    return namespace


# ── stand-ins for the registries ─────────────────────────────────────────


def _area(area_id: str, name: str):
    return types.SimpleNamespace(id=area_id, name=name)


def _entity(entity_id: str, area_id=None, device_id=None, hidden_by=None, disabled_by=None):
    return types.SimpleNamespace(
        entity_id=entity_id,
        area_id=area_id,
        device_id=device_id,
        hidden_by=hidden_by,
        disabled_by=disabled_by,
    )


class _Registries:
    """What ``ar``, ``dr`` and ``er`` hand back for the test's hass."""

    def __init__(self) -> None:
        self.areas = [
            _area("living_room", "Living room"),
            _area("kitchen", "Kitchen"),
            _area("attic", "attic"),
            _area("bedroom", "Bedroom"),
        ]
        self.devices = {
            "dev-lamp": types.SimpleNamespace(area_id="living_room"),
            "dev-hub": types.SimpleNamespace(area_id="kitchen"),
            "dev-none": types.SimpleNamespace(area_id=None),
        }
        self.entities = {
            e.entity_id: e
            for e in (
                _entity("light.reading_lamp", device_id="dev-lamp"),
                # Its own area wins over its device's.
                _entity("light.pendants", area_id="kitchen", device_id="dev-lamp"),
                _entity("lock.side_door", area_id="living_room"),
                _entity("climate.thermostat", device_id="dev-hub"),
                _entity("sensor.hub_signal", device_id="dev-hub", hidden_by="integration"),
                _entity("light.old", area_id="kitchen", disabled_by="user"),
                _entity("switch.loose", device_id="dev-none"),
                _entity("switch.unknown_device", device_id="dev-gone"),
                _entity("fan.gone_area", area_id="garage"),
                _entity("light.ceiling", device_id="dev-lamp"),
            )
        }
        # What has a state: the registry's entities that are not disabled,
        # and one that is in no registry at all.
        self.states = [
            _state(entity_id, entity_id.split(".")[1].replace("_", " ").title())
            for entity_id, entry in self.entities.items()
            if entry.disabled_by is None
        ] + [_state("sun.sun", None)]


def _state(entity_id: str, friendly_name):
    attributes = {} if friendly_name is None else {"friendly_name": friendly_name}
    return types.SimpleNamespace(entity_id=entity_id, attributes=attributes)


@pytest.fixture
def env():
    with loaded_package() as loaded:
        registries = _Registries()
        hass = types.SimpleNamespace(
            data={}, states=types.SimpleNamespace(async_all=lambda: list(registries.states))
        )
        sys.modules["homeassistant.helpers.area_registry"] = types.SimpleNamespace(
            async_get=lambda h: types.SimpleNamespace(async_list_areas=lambda: list(registries.areas))
        )
        sys.modules["homeassistant.helpers.device_registry"] = types.SimpleNamespace(
            async_get=lambda h: types.SimpleNamespace(async_get=registries.devices.get)
        )
        sys.modules["homeassistant.helpers.entity_registry"] = types.SimpleNamespace(
            async_get=lambda h: types.SimpleNamespace(entities=registries.entities)
        )
        sys.modules["homeassistant.helpers"].area_registry = sys.modules["homeassistant.helpers.area_registry"]
        sys.modules["homeassistant.helpers"].device_registry = sys.modules["homeassistant.helpers.device_registry"]
        sys.modules["homeassistant.helpers"].entity_registry = sys.modules["homeassistant.helpers.entity_registry"]
        sys.modules["homeassistant.components"] = types.ModuleType("homeassistant.components")
        sys.modules["homeassistant.components.websocket_api"] = types.SimpleNamespace(
            ActiveConnection=type("ActiveConnection", (), {}),
            async_register_command=lambda hass, func: None,
            require_admin=lambda func: func,
            websocket_command=lambda schema: (lambda func: func),
            async_response=lambda func: func,
        )
        sys.modules["homeassistant.components"].websocket_api = sys.modules[
            "homeassistant.components.websocket_api"
        ]
        sys.modules["voluptuous"] = types.SimpleNamespace(
            Required=lambda key, **_k: key, Optional=lambda key, **_k: key
        )
        areas = loaded.load("home_areas")
        loaded.load("panel_access")
        ws = loaded.load("home_map_ws")
        store = loaded.store_mod.HomeMapStore(object())
        asyncio.run(store.async_load())
        domain = types.SimpleNamespace(home_map_store=store, widget_secret_store=_Secrets())
        hass.data["wrist_assistant"] = domain
        yield types.SimpleNamespace(
            loaded=loaded,
            mod=loaded.store_mod,
            store=store,
            domain=domain,
            hass=hass,
            registries=registries,
            areas=areas,
            ws=ws,
            ops=_ops(loaded.store_mod, areas),
        )


def op(env, name: str, payload: dict, *, watch_id: str = IPHONE, body: bytes | None = None) -> _Response:
    return asyncio.run(env.ops[name](_Ctx(env, watch_id, payload, body)))


def put(env, doc: Any, base_rev: Any, **kwargs: Any) -> _Response:
    return op(env, "_op_home_map_put", {"doc": doc, "base_rev": base_rev}, **kwargs)


# ── home_map_get ─────────────────────────────────────────────────────────


def test_get_with_no_map_is_null_at_rev_0(env) -> None:
    reply = op(env, "_op_home_map_get", {})
    assert (reply.status, reply.body) == (200, {"ok": True, "doc": None, "rev": 0})
    # A watch reads it as well as the phone.
    assert op(env, "_op_home_map_get", {}, watch_id=WATCH).body == reply.body
    assert op(env, "_op_home_map_get", {"rev": 0}).body == {"ok": True, "not_modified": True, "rev": 0}


def test_get_answers_the_map_unless_the_caller_holds_its_rev(env) -> None:
    env.store.save(basic(), 0)
    assert op(env, "_op_home_map_get", {}, watch_id=WATCH).body == {"ok": True, "doc": basic(), "rev": 1}
    assert op(env, "_op_home_map_get", {"rev": 0}, watch_id=WATCH).body == {"ok": True, "doc": basic(), "rev": 1}
    assert op(env, "_op_home_map_get", {"rev": 5}).body == {"ok": True, "doc": basic(), "rev": 1}
    assert op(env, "_op_home_map_get", {"rev": 1}, watch_id=WATCH).body == {
        "ok": True, "not_modified": True, "rev": 1,
    }
    assert op(env, "_op_home_map_get", {"rev": None}).body["doc"] == basic()


@pytest.mark.parametrize("rev", [-1, True, "1", 1.0, [1]])
def test_get_refuses_a_rev_that_is_not_a_whole_number(env, rev) -> None:
    reply = op(env, "_op_home_map_get", {"rev": rev})
    assert reply.status == 400
    assert reply.body == {"ok": False, "error": "invalid", "message": "rev must be a whole number of 0 or more"}


# ── home_map_put ─────────────────────────────────────────────────────────


def test_an_iphone_puts_the_map(env) -> None:
    reply = put(env, basic(), 0)
    assert (reply.status, reply.body) == (200, {"ok": True, "rev": 1})
    assert env.store.get() == (basic(), 1)
    assert FakeStore.files[KEY] == {"rev": 1, "doc": basic()}
    doc = basic()
    doc["floors"][0]["pins"].pop()
    assert put(env, doc, 1).body == {"ok": True, "rev": 2}
    assert op(env, "_op_home_map_get", {"rev": 1}, watch_id=WATCH).body == {"ok": True, "doc": doc, "rev": 2}


def test_a_watch_may_not_put_the_map(env) -> None:
    reply = put(env, basic(), 0, watch_id=WATCH)
    assert reply.status == 403
    assert reply.body == {"ok": False, "error": "not_an_iphone", "message": "Only an iPhone saves the home map."}
    # Nor may an id the secret store does not know.
    assert put(env, basic(), 0, watch_id="stranger").status == 403
    assert env.store.get() == (None, 0)
    assert KEY not in FakeStore.files


def test_a_stale_put_is_a_409_naming_the_stored_rev(env) -> None:
    put(env, basic(), 0)
    put(env, basic(), 1)
    reply = put(env, basic(), 1)
    assert reply.status == 409
    assert reply.body == {
        "ok": False,
        "error": "conflict",
        "message": "stored revision is 2, save was based on 1",
        "rev": 2,
    }


@pytest.mark.parametrize(
    ("doc", "base_rev", "message"),
    [
        ({"v": 1}, 0, "doc.floors is missing"),
        (None, 0, "doc must be an object"),
        ("map", 0, "doc must be an object"),
        (basic(), None, "base_rev must be a whole number of 0 or more"),
        (basic(), "0", "base_rev must be a whole number of 0 or more"),
    ],
)
def test_put_refuses_a_bad_map(env, doc, base_rev, message) -> None:
    reply = put(env, doc, base_rev)
    assert reply.status == 400
    assert reply.body == {"ok": False, "error": "invalid", "message": message}
    assert KEY not in FakeStore.files


def test_put_of_a_pin_on_a_room_of_no_floor_says_where(env) -> None:
    doc = basic()
    doc["floors"][0]["pins"][3]["roomId"] = LIVING.replace("0010", "0099")
    reply = put(env, doc, 0)
    assert reply.status == 400
    assert reply.body["message"] == "doc.floors[0].pins[3].roomId names no room of this floor"


def test_a_map_over_256_kib_is_a_413(env) -> None:
    doc = basic()
    sofa = {"kind": "sofa", "c": [2.71, 4.15], "size": [3.01, 0.91, 0.75], "turn": 12.5}
    for item in doc["floors"][0]["rooms"]:
        item["objects"] = [dict(sofa) for _ in range(256)]
    for n in range(2, 20):
        extra = json.loads(json.dumps(doc["floors"][0]["rooms"][0]))
        extra["id"] = f"00000000-0000-4000-8000-{n:012d}"
        doc["floors"][0]["rooms"].append(extra)
    # Sent as a small body (the cap is checked on the raw bytes), it is
    # refused by the store's own measure.
    reply = put(env, doc, 0, body=b"{}")
    assert reply.status == 413 and reply.body["error"] == "too_large"
    assert reply.body["message"].startswith("a home map is at most 256 KiB")


def test_a_put_body_over_the_cap_is_refused_before_it_is_read(env) -> None:
    reply = put(env, basic(), 0, body=b"x" * (384 * 1024 + 1))
    assert reply.status == 413
    assert reply.body == {"ok": False, "error": "too_large", "message": "a home map is at most 256 KiB"}
    assert put(env, basic(), 0, body=b"x" * (384 * 1024)).body == {"ok": True, "rev": 1}


def test_both_map_ops_are_unavailable_with_no_store_or_an_unreadable_one(env) -> None:
    env.domain.home_map_store = None
    for reply in (op(env, "_op_home_map_get", {}), put(env, basic(), 0)):
        assert reply.status == 503
        assert reply.body == {"ok": False, "error": "unavailable", "message": "integration not ready"}
    FakeStore.unreadable.add(KEY)
    store = env.mod.HomeMapStore(object())
    asyncio.run(store.async_load())
    env.domain.home_map_store = store
    for reply in (op(env, "_op_home_map_get", {}), put(env, basic(), 0)):
        assert reply.status == 503 and reply.body["error"] == "unavailable"


# ── areas_get ────────────────────────────────────────────────────────────

AREAS = [
    {"id": "attic", "name": "attic", "entity_ids": []},
    {"id": "bedroom", "name": "Bedroom", "entity_ids": []},
    {"id": "kitchen", "name": "Kitchen", "entity_ids": ["climate.thermostat", "light.pendants"]},
    {
        "id": "living_room",
        "name": "Living room",
        "entity_ids": ["light.ceiling", "light.reading_lamp", "lock.side_door"],
    },
]


ENTITIES = [
    {"id": "light.ceiling", "name": "Ceiling", "area_id": "living_room"},
    {"id": "fan.gone_area", "name": "Gone Area", "area_id": "garage"},
    {"id": "switch.loose", "name": "Loose", "area_id": None},
    {"id": "light.pendants", "name": "Pendants", "area_id": "kitchen"},
    {"id": "light.reading_lamp", "name": "Reading Lamp", "area_id": "living_room"},
    {"id": "lock.side_door", "name": "Side Door", "area_id": "living_room"},
    {"id": "sun.sun", "name": "sun.sun", "area_id": None},
    {"id": "climate.thermostat", "name": "Thermostat", "area_id": "kitchen"},
    {"id": "switch.unknown_device", "name": "Unknown Device", "area_id": None},
]


def test_areas_get_lists_every_area_and_its_entities(env) -> None:
    for watch_id in (IPHONE, WATCH):
        reply = op(env, "_op_areas_get", {}, watch_id=watch_id)
        assert (reply.status, reply.body) == (200, {"ok": True, "areas": AREAS, "entities": ENTITIES})


def test_every_entity_with_a_state_is_listed_by_name(env) -> None:
    rows = env.areas.home_entities(env.hass)
    ids = [row["id"] for row in rows]
    # Hidden left out, disabled has no state; one outside the registry is in.
    assert "sensor.hub_signal" not in ids and "light.old" not in ids
    assert "sun.sun" in ids
    # Its own area wins over its device's, as for the areas.
    assert {row["id"]: row["area_id"] for row in rows}["light.pendants"] == "kitchen"
    names = [row["name"].casefold() for row in rows]
    assert names == sorted(names)


def test_an_entitys_own_area_wins_over_its_devices(env) -> None:
    by_id = {a["id"]: a["entity_ids"] for a in env.areas.home_areas(env.hass)}
    assert "light.pendants" in by_id["kitchen"]
    assert "light.pendants" not in by_id["living_room"]
    env.registries.entities["light.pendants"].area_id = None
    by_id = {a["id"]: a["entity_ids"] for a in env.areas.home_areas(env.hass)}
    assert "light.pendants" in by_id["living_room"]


def test_hidden_disabled_and_unplaced_entities_are_left_out(env) -> None:
    listed = {e for a in env.areas.home_areas(env.hass) for e in a["entity_ids"]}
    for entity_id in (
        "sensor.hub_signal",  # hidden
        "light.old",  # disabled
        "switch.loose",  # its device has no area
        "switch.unknown_device",  # its device is gone
        "fan.gone_area",  # its area is gone
    ):
        assert entity_id not in listed, entity_id
    env.registries.entities["sensor.hub_signal"].hidden_by = None
    listed = {e for a in env.areas.home_areas(env.hass) for e in a["entity_ids"]}
    assert "sensor.hub_signal" in listed


def test_areas_sort_by_name_whatever_the_case_then_by_id(env) -> None:
    rows = env.areas.areas_from_registries(
        [_area("b2", "Hall"), _area("z", "attic"), _area("b1", "Hall"), _area("a", "Bath")],
        [],
        lambda _device: None,
    )
    assert [row["id"] for row in rows] == ["z", "a", "b1", "b2"]


def test_a_home_with_no_areas_has_an_empty_list(env) -> None:
    env.registries.areas.clear()
    assert op(env, "_op_areas_get", {}).body["areas"] == []


# ── WebSocket ────────────────────────────────────────────────────────────


class _Connection:
    def __init__(self, user: Any = "default") -> None:
        self.user = types.SimpleNamespace(id="user-1", is_admin=False) if user == "default" else user
        self.results: dict[int, Any] = {}
        self.errors: list[tuple[int, str, str]] = []

    def send_result(self, msg_id: int, payload: Any) -> None:
        self.results[msg_id] = json.loads(json.dumps(payload))

    def send_error(self, msg_id: int, code: str, message: str) -> None:
        self.errors.append((msg_id, code, message))


def ws_call(env, command, connection: _Connection | None = None, **msg) -> _Connection:
    connection = connection or _Connection()
    command(env.hass, connection, {"id": 1, **msg})
    return connection


def test_ws_get_save_and_get_again(env) -> None:
    assert ws_call(env, env.ws.ws_home_map_get).results[1] == {"doc": None, "rev": 0}
    saved = ws_call(env, env.ws.ws_home_map_save, doc=basic(), base_rev=0)
    assert saved.results[1] == {"rev": 1} and saved.errors == []
    assert ws_call(env, env.ws.ws_home_map_get).results[1] == {"doc": basic(), "rev": 1}
    # The iPhone reads what the panel saved.
    assert op(env, "_op_home_map_get", {}).body == {"ok": True, "doc": basic(), "rev": 1}


def test_ws_a_stale_save_is_a_conflict_whose_message_names_the_rev(env) -> None:
    put(env, basic(), 0)
    [(_, code, message)] = ws_call(env, env.ws.ws_home_map_save, doc=basic(), base_rev=0).errors
    assert code == "conflict"
    assert message == "stored revision is 1, save was based on 0"


def test_ws_refusals(env) -> None:
    for msg, code in (
        ({"doc": {"v": 2, "floors": []}, "base_rev": 0}, "invalid"),
        ({"doc": basic(), "base_rev": -1}, "invalid"),
    ):
        [(_, got, _m)] = ws_call(env, env.ws.ws_home_map_save, **msg).errors
        assert got == code
    assert env.store.get() == (None, 0)


def test_ws_is_open_to_every_signed_in_user_and_no_one_else(env) -> None:
    admin = _Connection(types.SimpleNamespace(id="admin", is_admin=True))
    assert ws_call(env, env.ws.ws_home_map_save, admin, doc=basic(), base_rev=0).results[1] == {"rev": 1}
    member = _Connection()
    assert ws_call(env, env.ws.ws_home_map_save, member, doc=basic(), base_rev=1).results[1] == {"rev": 2}
    for command, msg in (
        (env.ws.ws_home_map_get, {}),
        (env.ws.ws_home_map_save, {"doc": basic(), "base_rev": 2}),
    ):
        [(_, code, _m)] = ws_call(env, command, _Connection(None), **msg).errors
        assert code == "unauthorized"
    assert env.store.rev == 2


def test_ws_commands_are_unavailable_without_the_integration(env) -> None:
    env.hass.data = {}
    for command, msg in (
        (env.ws.ws_home_map_get, {}),
        (env.ws.ws_home_map_save, {"doc": basic(), "base_rev": 0}),
    ):
        [(_, code, _m)] = ws_call(env, command, **msg).errors
        assert code == "unavailable"


# ── home_map_rev on the delta reply ──────────────────────────────────────


def test_the_delta_reply_names_the_map_rev_only_once_a_map_is_stored(coordinator) -> None:  # noqa: F811
    _module, hass, coord = coordinator
    hass.states.set("light.x", "off")
    with loaded_package() as loaded:
        store =loaded.store_mod.HomeMapStore(object())
        asyncio.run(store.async_load())

        async def run() -> None:
            # No store attached: nothing.
            _status, body = await _poll(coord, entities=["light.x"], timeout=0)
            assert "home_map_rev" not in body
            # A store with no map: still nothing.
            coord.attach_home_map_store(store)
            _status, body = await _poll(coord, entities=["light.x"], timeout=0)
            assert "home_map_rev" not in body
            store.save(basic(), 0)
            _status, body = await _poll(coord, entities=["light.x"], timeout=0)
            assert body["home_map_rev"] == 1
            store.save(basic(), 1)
            _status, body = await _poll(coord, entities=["light.x"], timeout=0, lean=True)
            # Whole on a lean reply too: the poll does not report it.
            assert body["home_map_rev"] == 2
            _status, body = await _poll(coord, entities=["light.x"], timeout=0, lean=True)
            assert body["home_map_rev"] == 2

        asyncio.run(run())
        assert coord.home_map_revision() == 2


def test_an_unreadable_map_leaves_the_field_out(coordinator) -> None:  # noqa: F811
    _module, hass, coord = coordinator
    hass.states.set("light.x", "off")
    with loaded_package() as loaded:
        FakeStore.files[KEY] = {"rev": 3, "doc": basic()}
        FakeStore.unreadable.add(KEY)
        store = loaded.store_mod.HomeMapStore(object())
        asyncio.run(store.async_load())
        coord.attach_home_map_store(store)
        _status, body = asyncio.run(_poll(coord, entities=["light.x"], timeout=0))
        assert "home_map_rev" not in body
        assert coord.home_map_revision() is None


# ── static ───────────────────────────────────────────────────────────────


def test_the_three_ops_are_in_the_dispatch_table() -> None:
    tree = ast.parse(_VIEWS.read_text())
    for node in tree.body:
        target = node.target if isinstance(node, ast.AnnAssign) else (
            node.targets[0] if isinstance(node, ast.Assign) else None
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
    assert table["home_map_get"] == "_op_home_map_get"
    assert table["home_map_put"] == "_op_home_map_put"
    assert table["areas_get"] == "_op_areas_get"


def test_setup_builds_the_store_attaches_it_and_advertises() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    for expected in (
        "home_map_store = HomeMapStore(hass)",
        "await home_map_store.async_load()",
        "coordinator.attach_home_map_store(home_map_store)",
        "home_map_store=home_map_store,",
        "register_capability(HOME_MAP_CAPABILITY)",
        "async_register_home_map_commands(hass)",
        # Listed among the stores unload writes out and stops.
        '"home_map_store",',
    ):
        assert expected in init, expected
    assert 'HOME_MAP_CAPABILITY = "home_map"' in const
    assert 'HOME_MAP_STORAGE_KEY = "wrist_assistant.home_map"' in const
    assert "home_map_store: HomeMapStore" in const
    # Registered right beside tile_photos.
    lines = [line.strip() for line in init.splitlines() if "register_capability(" in line]
    assert lines.index("coordinator.register_capability(HOME_MAP_CAPABILITY)") == lines.index(
        "coordinator.register_capability(TILE_PHOTOS_CAPABILITY)"
    ) + 1


def test_the_panel_commands_use_the_library_guard() -> None:
    """The map is the home's: the rule of a save in the home's library,
    every signed-in user, checked before anything is read or written."""
    source = (_PKG_DIR / "home_map_ws.py").read_text()
    assert source.count("require_owner(hass, connection, msg, LIBRARY_OWNER_ID)") == 2
    assert "require_admin" not in source
