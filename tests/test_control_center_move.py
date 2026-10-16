"""Pure-unit tests for the Control Center move (``control_center_move.py``).

In-process, no HA instance, the same stub-and-load pattern as
test_complication_store.py and test_watch_config_store.py, with the real
``const.py`` and both real stores loaded beside the module under test.

Covered: the converter against the shared fixture ``control_moved.json``
(which the app's ``ControlCenterHandover`` wrote), byte for byte and in key
order; the ids; every row of the mapping; the runner's seats, the tombstone
and live id rules, the cap, the per-document refusal, hidden entries, a
re-run; and a ``control_center`` save (device or panel) triggering the move.
"""

from __future__ import annotations

import asyncio
import contextlib
import copy
import importlib.util
import json
import sys
import types
from pathlib import Path
from typing import Any, ClassVar

import pytest

_ROOT = Path(__file__).resolve().parents[1]
_SRC = _ROOT / "custom_components" / "wrist_assistant"
_FIXTURE = _ROOT / "frontend" / "test" / "fixtures" / "control_moved.json"

_PKG = "wa_control_center_move_test_pkg"

OWNER = "WATCH-1234"
OTHER = "WATCH-5678"
HASH = "a" * 64


class _FakeStore:
    """Stand-in for ``homeassistant.helpers.storage.Store``, one payload per
    key, saved at once rather than after the debounce."""

    files: ClassVar[dict[str, Any]] = {}

    def __init__(self, _hass: object, _version: int, key: str, *_a: object, **_k: object) -> None:
        self.key = key

    async def async_load(self):
        return copy.deepcopy(_FakeStore.files.get(self.key))

    def async_delay_save(self, serialize, *_args: object, **_kwargs: object) -> None:
        _FakeStore.files[self.key] = copy.deepcopy(serialize())

    async def async_save(self, data: Any) -> None:
        _FakeStore.files[self.key] = copy.deepcopy(data)

    async def async_remove(self) -> None:
        _FakeStore.files.pop(self.key, None)


class _Hass:
    def async_create_task(self, coro, name: str | None = None, **_kwargs: object):
        return asyncio.run(coro)


def _load(name: str) -> types.ModuleType:
    spec = importlib.util.spec_from_file_location(f"{_PKG}.{name}", _SRC / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[f"{_PKG}.{name}"] = module
    spec.loader.exec_module(module)
    return module


@contextlib.contextmanager
def _loaded_modules():
    saved_modules = dict(sys.modules)
    _FakeStore.files = {}
    try:

        def stub(name: str, **attrs: object) -> None:
            module = sys.modules.get(name) or types.ModuleType(name)
            for key, value in attrs.items():
                setattr(module, key, value)
            sys.modules[name] = module

        stub("homeassistant")
        stub("homeassistant.helpers")
        stub("homeassistant.helpers.storage", Store=_FakeStore)
        stub(
            "homeassistant.core",
            HomeAssistant=type("HomeAssistant", (), {}),
            callback=lambda f: f,
        )
        pkg = types.ModuleType(_PKG)
        pkg.__path__ = []
        sys.modules[_PKG] = pkg
        _load("const")
        _load("page_links")
        yield types.SimpleNamespace(
            complications=_load("complication_store"),
            watch_config=_load("watch_config_store"),
            move=_load("control_center_move"),
        )
    finally:
        for key in list(sys.modules):
            if key not in saved_modules:
                del sys.modules[key]
        sys.modules.update(saved_modules)


@pytest.fixture
def mods():
    with _loaded_modules() as loaded:
        yield loaded


def _entry(
    entity_id: str,
    name: str = "Name",
    icon: str = "circle",
    *,
    custom_name: str | None = None,
    custom_icon: str | None = None,
    tint: str | None = None,
    hidden: bool | None = None,
) -> dict[str, Any]:
    """A `CuratedEntity` as the app encodes it (absent optionals left out)."""
    entry: dict[str, Any] = {
        "entityId": entity_id,
        "displayName": name,
        "iconName": icon,
        "domain": entity_id.split(".")[0],
    }
    if custom_icon is not None:
        entry["customIconName"] = custom_icon
    if custom_name is not None:
        entry["customDisplayName"] = custom_name
    if tint is not None:
        entry["tintColorHex"] = tint
    if hidden is not None:
        entry["isHidden"] = hidden
    entry["schemaVersion"] = 1
    return entry


class _World:
    """Both stores, loaded, plus a mover whose jobs wait in a queue until
    ``drain`` runs them, the way ``hass.loop.call_soon`` would."""

    def __init__(self, mods, *, paired: set[str] | None = None) -> None:
        self.mods = mods
        self.paired = {OWNER, OTHER} if paired is None else paired
        self.complications = mods.complications.ComplicationStore(object())
        asyncio.run(self.complications.async_load())
        self.watch_config = mods.watch_config.WatchConfigStore(
            _Hass(), is_paired=lambda owner: owner in self.paired
        )
        asyncio.run(self.watch_config.async_load())
        self.woken: list[str] = []
        self.pushed: list[tuple[str, int]] = []
        self.complications.async_set_wake_callback(self.woken.append)
        self.complications.async_set_push_callback(
            lambda owner, token: self.pushed.append((owner, token))
        )
        self.queue: list[Any] = []
        self.mover = mods.move.ControlCenterMover(
            self.complications,
            self.watch_config,
            is_paired=lambda owner: owner in self.paired,
            schedule=self.queue.append,
        )
        self.watch_config.async_add_listener(self.mover.watch_config_changed)

    def drain(self) -> int:
        ran = 0
        while self.queue:
            self.queue.pop(0)()
            ran += 1
        return ran

    def put_list(self, entries: list[dict[str, Any]], owner: str = OWNER) -> None:
        """The device upload of the old list (a signed put)."""
        current = self.watch_config.get(owner, "control_center")
        self.watch_config.put(
            owner,
            "control_center",
            {"schemaVersion": 1, "entities": entries},
            document_hash=HASH,
            base_revision=current.revision if current else 0,
            updated_by=owner,
        )

    def controls(self, owner: str = OWNER) -> list[Any]:
        return [
            r for r in self.complications.list(owner)
            if r.updated_by == self.mods.move.UPDATED_BY
        ]


def _shape_doc(slot: int, *, families=("rectangular",), **extra: Any) -> dict[str, Any]:
    """A plain one-shape document an author made, holding ``slot``."""
    import uuid

    doc = {
        "schemaVersion": 6,
        "id": str(uuid.uuid4()).upper(),
        "name": f"Shape {slot}",
        "values": [],
        "elements": [],
        "slotIndex": slot,
        "supportedFamilies": list(families),
        "perFamily": {},
        "dataSources": [],
        "refreshMinutes": 0,
        "tapAction": {"type": "refresh"},
    }
    doc.update(extra)
    return doc


# ── the converter ──────────────────────────────────────────────────────────


def test_the_shared_fixture_is_what_the_converter_writes(mods):
    """`ControlCenterHandoverTests.theSharedFixtureIsWhatTheConverterWrites`:
    the same entry, owner and seat give the fixture's config exactly, in the
    same key order at every level."""
    fixture = json.loads(_FIXTURE.read_text())
    expected = fixture["config"]
    written = mods.move.document(
        _entry(
            "light.kitchen",
            name="Kitchen",
            icon="lightbulb",
            custom_name="Kitchen lights",
            custom_icon="lightbulb.led",
            tint="#FF9F0A",
        ),
        OWNER,
        3,
    )
    assert written == expected
    # json.dumps keeps insertion order, so equal strings means equal key order.
    assert json.dumps(written) == json.dumps(expected)


def test_ids_are_the_apps_name_based_uuids(mods):
    move = mods.move
    assert move.document_id("WATCH-1234", "light.kitchen") == "44E5931C-79A6-5670-970D-07B5C5C3190C"
    assert move.document_id("owner-A", "light.kitchen") == "33F69269-1522-52A5-B019-511AA3021FC4"
    assert move.document_id("owner-B", "light.kitchen") == "F8593D37-5140-5D00-BB6E-F9894DCDED20"
    assert move.document_id("owner-A", "lock.front_door") == "E835F683-AB04-5C06-84C9-33303105DA48"


@pytest.mark.parametrize("domain", ["light", "switch", "fan", "input_boolean", "lock", "cover"])
def test_every_toggle_domain_is_a_toggle_of_its_entity(mods, domain):
    doc = mods.move.document(_entry(f"{domain}.thing", "Thing"), OWNER, 0)
    ref = {"entityId": f"{domain}.thing", "displayName": "Thing", "domain": domain}
    assert doc["control"]["kind"] == "toggle"
    assert doc["control"]["action"] == {"type": "toggleEntity", **ref}
    assert doc["control"]["state"] == {"kind": {"kind": "entityState", **ref}}


def test_scenes_scripts_and_automations_are_buttons(mods):
    move = mods.move
    scene = move.document(_entry("scene.evening", "Evening"), OWNER, 0)["control"]
    assert scene["kind"] == "button" and "state" not in scene
    assert scene["action"] == {
        "type": "runScene", "entityId": "scene.evening", "displayName": "Evening", "domain": "scene",
    }
    script = move.document(_entry("script.bedtime", "Bedtime"), OWNER, 0)["control"]
    assert script["action"]["type"] == "runScript"
    automation = move.document(_entry("automation.lights_out", "Lights out"), OWNER, 0)["control"]
    assert automation["kind"] == "button" and "state" not in automation
    action = automation["action"]
    assert action == {
        "type": "callService",
        "serviceDomain": "automation",
        "serviceName": "trigger",
        "entityId": "automation.lights_out",
        "displayName": "Lights out",
        "domain": "automation",
    }
    assert list(action) == [
        "type", "serviceDomain", "serviceName", "entityId", "displayName", "domain",
    ]


def test_other_domains_and_repeats_are_not_moved(mods):
    move = mods.move
    entries = [
        _entry("sensor.temperature"),
        _entry("climate.living_room"),
        _entry("light.kitchen", "First"),
        _entry("media_player.tv"),
        _entry("light.kitchen", "Second"),
    ]
    docs = move.documents(entries, OWNER)
    assert [d["name"] for d in docs] == ["First"]
    assert move.document(_entry("sensor.temperature"), OWNER, 0) is None
    assert move.documents([], OWNER) == []
    assert move.documents(None, OWNER) == []


def test_names_symbols_tint_and_hidden(mods):
    move = mods.move
    custom = move.document(_entry("light.a", "Kitchen", custom_name="Cooking"), OWNER, 0)
    assert custom["name"] == "Cooking"
    assert custom["control"]["title"] == {"kind": {"kind": "literal", "value": "Cooking"}}
    assert move.document(_entry("light.a", "  "), OWNER, 0)["name"] == "light.a"

    assert move.document(_entry("light.a", icon="lightbulb"), OWNER, 0)["control"]["symbol"] == "lightbulb"
    assert move.document(_entry("light.a", custom_icon="lamp.desk"), OWNER, 0)["control"]["symbol"] == "lamp.desk"
    assert move.document(_entry("lock.door", icon=""), OWNER, 0)["control"]["symbol"] == "lock"
    assert move.document(_entry("vacuum.x", icon=""), OWNER, 0) is None
    assert "symbolOff" not in move.document(_entry("light.a"), OWNER, 0)["control"]

    assert move.document(_entry("light.a", tint="#FF0000"), OWNER, 0)["control"]["tintColorHex"] == "#FF0000"
    assert "tintColorHex" not in move.document(_entry("light.a"), OWNER, 0)["control"]
    assert "tintColorHex" not in move.document(_entry("light.a", tint=""), OWNER, 0)["control"]

    hidden = move.document(_entry("light.a", hidden=True), OWNER, 0)
    assert hidden["hidden"] is True
    assert list(hidden)[-3:] == ["hidden", "control", "legacyControlEntityId"]
    assert "hidden" not in move.document(_entry("light.a", hidden=False), OWNER, 0)
    assert "hidden" not in move.document(_entry("light.a"), OWNER, 0)


def test_free_slots_take_the_lowest_nothing_holds(mods):
    move = mods.move
    assert move.free_slots(3, {0, 2}) == [1, 3, 4]
    assert move.free_slots(0, {0}) == []
    assert move.free_slots(3, set(range(64)) - {40}) == [40]
    every = move.free_slots(64, {1})
    assert len(every) == 63 and 1 not in every and max(every) == 63


# ── the runner ─────────────────────────────────────────────────────────────


def test_a_list_save_moves_every_movable_entry(mods):
    world = _World(mods)
    world.put_list([
        _entry("light.kitchen", "Kitchen", custom_name="Cooking", tint="#FF9F0A"),
        _entry("lock.door", "Door", hidden=True),
        _entry("automation.away", "Away"),
        _entry("sensor.temperature", "Temperature"),
    ])
    assert len(world.queue) == 1
    world.drain()
    controls = world.controls()
    assert [r.document["legacyControlEntityId"] for r in controls] == [
        "light.kitchen", "lock.door", "automation.away",
    ]
    assert [r.document["slotIndex"] for r in controls] == [0, 1, 2]
    assert all(r.revision == 1 for r in controls)
    assert controls[1].document["hidden"] is True
    assert "hidden" not in controls[0].document
    assert controls[0].id == mods.move.document_id(OWNER, "light.kitchen")
    # Each create went through the store's commit: a wake and a push per
    # record, exactly as a panel save gets.
    assert world.woken == [OWNER] * 3
    assert [owner for owner, _token in world.pushed] == [OWNER] * 3


def test_seats_are_distinct_and_skip_every_held_seat(mods):
    world = _World(mods)
    store = world.complications
    store.save(OWNER, _shape_doc(0), base_revision=None, updated_by="t")
    store.save(OWNER, _shape_doc(2, families=("circular",)), base_revision=None, updated_by="t")
    # A control already in seat 4, and a hidden shape in seat 5: both hold it.
    store.save(
        OWNER,
        _shape_doc(4, families=(), control={"kind": "button", "title": {}, "symbol": "x", "action": {"type": "openApp"}}),
        base_revision=None,
        updated_by="t",
    )
    store.save(OWNER, _shape_doc(5, hidden=True), base_revision=None, updated_by="t")
    # A deleted record holds nothing.
    gone = store.save(OWNER, _shape_doc(1), base_revision=None, updated_by="t")
    store.delete(OWNER, gone.id, base_revision=gone.revision, updated_by="t")
    # Another owner's seats are its own.
    store.save(OTHER, _shape_doc(3), base_revision=None, updated_by="t")

    world.put_list([_entry(f"light.l{i}") for i in range(4)])
    world.drain()
    assert [r.document["slotIndex"] for r in world.controls()] == [1, 3, 6, 7]


def test_fewer_free_seats_than_entries_moves_what_fits(mods, caplog):
    world = _World(mods)
    for slot in range(62):
        world.complications.save(OWNER, _shape_doc(slot), base_revision=None, updated_by="t")
    world.put_list([_entry(f"switch.s{i}") for i in range(5)])
    with caplog.at_level("INFO"):
        world.drain()
    controls = world.controls()
    assert [r.document["legacyControlEntityId"] for r in controls] == ["switch.s0", "switch.s1"]
    assert [r.document["slotIndex"] for r in controls] == [62, 63]
    assert "3 of 5 control(s) have no room" in caplog.text


def test_the_per_owner_cap_is_respected(mods, monkeypatch):
    monkeypatch.setattr(mods.move, "COMPLICATION_MAX_PER_OWNER", 4)
    monkeypatch.setattr(mods.complications, "COMPLICATION_MAX_PER_OWNER", 4)
    world = _World(mods)
    # Three records sharing seat 0 by shape: three of four used, 63 seats free.
    for family in ("rectangular", "circular", "corner"):
        world.complications.save(OWNER, _shape_doc(0, families=(family,)), base_revision=None, updated_by="t")
    world.put_list([_entry("light.a"), _entry("light.b"), _entry("light.c")])
    world.drain()
    assert [r.document["legacyControlEntityId"] for r in world.controls()] == ["light.a"]
    assert len(world.complications.list(OWNER)) == 4


def test_a_deleted_control_is_never_revived(mods):
    world = _World(mods)
    world.put_list([_entry("light.a"), _entry("light.b")])
    world.drain()
    first = world.complications.get(OWNER, mods.move.document_id(OWNER, "light.a"))
    world.complications.delete(OWNER, first.id, base_revision=first.revision, updated_by="panel")
    token = world.complications.token

    world.put_list([_entry("light.a", "Renamed"), _entry("light.b")])
    world.drain()
    assert world.complications.token == token
    assert world.complications.get(OWNER, first.id).deleted is True
    assert [r.document["legacyControlEntityId"] for r in world.controls()] == ["light.b"]


def test_an_existing_live_control_is_left_alone(mods):
    world = _World(mods)
    move = mods.move
    # The user already edited the moved control in the panel.
    edited = move.document(_entry("light.a", "Panel name"), OWNER, 9)
    world.complications.save(OWNER, edited, base_revision=None, updated_by="ha-panel:jesse")
    world.put_list([_entry("light.a", "List name"), _entry("light.b")])
    world.drain()
    kept = world.complications.get(OWNER, edited["id"])
    assert kept.revision == 1
    assert kept.updated_by == "ha-panel:jesse"
    assert kept.document["name"] == "Panel name"
    assert [r.document["legacyControlEntityId"] for r in world.controls()] == ["light.b"]
    assert world.controls()[0].document["slotIndex"] == 0


def test_a_rerun_makes_nothing(mods):
    world = _World(mods)
    world.put_list([_entry("light.a"), _entry("scene.b"), _entry("script.c")])
    world.drain()
    token = world.complications.token
    assert world.mover.run_owner(OWNER) == []
    world.mover.schedule_all()
    world.drain()
    world.put_list([_entry("light.a"), _entry("scene.b"), _entry("script.c")])
    world.drain()
    assert world.complications.token == token
    assert len(world.controls()) == 3


def test_lists_with_nothing_to_move_make_nothing(mods):
    world = _World(mods)
    world.put_list([])
    world.drain()
    world.put_list([_entry("sensor.a"), _entry("climate.b"), _entry("media_player.c")])
    world.drain()
    assert world.complications.token == 0
    assert world.mover.run_owner("no-list-owner") == []


def test_one_refused_document_does_not_stop_the_rest(mods, monkeypatch, caplog):
    world = _World(mods)
    save = world.complications.save
    refused = mods.move.document_id(OWNER, "light.b")

    def picky_save(owner, doc, **kwargs):
        if doc["id"] == refused:
            raise mods.complications.ComplicationValidationError("refused for the test")
        return save(owner, doc, **kwargs)

    monkeypatch.setattr(world.complications, "save", picky_save)
    world.put_list([_entry("light.a"), _entry("light.b"), _entry("light.c")])
    with caplog.at_level("WARNING"):
        world.drain()
    assert [r.document["legacyControlEntityId"] for r in world.controls()] == ["light.a", "light.c"]
    assert "refused for the test" in caplog.text


# ── when it runs ───────────────────────────────────────────────────────────


def test_a_panel_save_of_the_list_triggers_the_move(mods):
    world = _World(mods)
    world.watch_config.panel_save(
        OWNER,
        "control_center",
        {"schemaVersion": 1, "entities": [_entry("fan.ceiling")]},
        base_revision=0,
    )
    assert world.drain() == 1
    assert [r.document["legacyControlEntityId"] for r in world.controls()] == ["fan.ceiling"]


def test_only_a_control_center_save_queues_a_run(mods):
    world = _World(mods)
    world.watch_config.put(
        OWNER, "pages", {"schemaVersion": 1, "pages": []},
        document_hash=HASH, base_revision=0, updated_by=OWNER,
    )
    assert world.queue == []
    # Two saves before the job runs queue one run.
    world.put_list([_entry("light.a")])
    world.put_list([_entry("light.a"), _entry("light.b")])
    assert len(world.queue) == 1
    world.drain()
    assert len(world.controls()) == 2


def test_setup_runs_every_owner_with_a_list(mods):
    world = _World(mods)
    # Lists saved before the mover listened (as on a restart).
    world.watch_config._listeners.clear()
    world.put_list([_entry("light.a")], owner=OWNER)
    world.put_list([_entry("light.b")], owner=OTHER)
    assert world.queue == []
    world.mover.schedule_all()
    assert world.drain() == 2
    assert [r.document["legacyControlEntityId"] for r in world.controls(OWNER)] == ["light.a"]
    assert [r.document["legacyControlEntityId"] for r in world.controls(OTHER)] == ["light.b"]
    # The other owner's id is its own.
    assert world.controls(OTHER)[0].id == mods.move.document_id(OTHER, "light.b")


def test_never_for_an_unpaired_or_forgotten_owner(mods):
    world = _World(mods, paired={OTHER})
    world.put_list([_entry("light.a")], owner=OWNER)
    world.drain()
    assert world.controls(OWNER) == []

    world.paired.add(OWNER)
    world.complications.forget_owner(OWNER)
    assert world.complications.is_forgotten(OWNER)
    world.put_list([_entry("light.a")], owner=OWNER)
    world.drain()
    assert world.controls(OWNER) == []

    # The full forget drops the list too: revision 0 queues nothing.
    world.watch_config.forget_owner(OWNER)
    assert world.queue == []


def test_nothing_when_the_complication_file_could_not_be_read(mods, monkeypatch):
    world = _World(mods)
    monkeypatch.setattr(world.complications, "_load_failed", True)
    world.put_list([_entry("light.a")])
    world.drain()
    assert world.complications.token == 0


def test_a_closed_mover_does_nothing(mods):
    world = _World(mods)
    world.put_list([_entry("light.a")])
    world.mover.close()
    world.drain()
    world.put_list([_entry("light.a"), _entry("light.b")])
    assert world.queue == []
    assert world.complications.token == 0


def test_a_moved_list_follows_a_reinstalled_watch(mods):
    """A reinstall move carries the list to the new id; the target's run
    makes controls under the new id's own ids."""
    world = _World(mods)
    world.watch_config._listeners.clear()
    world.put_list([_entry("light.a")], owner=OWNER)
    world.watch_config.async_add_listener(world.mover.watch_config_changed)
    world.watch_config.move_owner(OWNER, OTHER, updated_by="test")
    world.drain()
    assert world.controls(OWNER) == []
    assert [r.id for r in world.controls(OTHER)] == [mods.move.document_id(OTHER, "light.a")]
