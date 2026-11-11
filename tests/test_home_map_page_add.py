"""In-process tests for ``home_map_page_add``: an iPhone puts a map page on
its own pages.

The op is pulled out of ``wa_v2_views.py`` by name, the way
``test_home_map_ops.py`` pulls its own, and run against a real
``WatchConfigStore`` (with its library) and a real ``HomeMapStore`` over the
in-memory ``Store`` of ``test_http_actions_store.py``.

Covered: the add (a new last page made in the library and picked by the
iPhone alone, a new revision of its pages record, its listeners told so its
poll wakes), the page pinned to the panel's own Add page through the shared
fixture ``tests/fixtures/home_map/map_page.json``, asking twice, no pages
record, an unknown floor, a watch or a watch's pair refused, the name rules,
the free plan line, a refused pick leaving no page behind, and the dispatch
table and the capability.
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
from test_home_map_store import FLOOR, basic
from test_http_actions_store import FakeStore
from test_page_images_store import FakeHass

_ROOT = Path(__file__).resolve().parents[1]
_PKG_DIR = _ROOT / "custom_components" / "wrist_assistant"
_PKG = "wa_home_map_page_add_test_pkg"
_VIEWS = _PKG_DIR / "wa_v2_views.py"
_FIXTURE = json.loads((_ROOT / "tests" / "fixtures" / "home_map" / "map_page.json").read_text())
_NAMES = (
    "_caller_is_iphone",
    "_home_map_refusal",
    "_watch_config_refusal",
    "_home_map_page_add_refusal",
    "_op_home_map_page_add",
)
IPHONE = "iphone:1"
BARE_IPHONE = "iphone:2"
WATCH = "watch-A"
HASH = "c" * 64
UPSTAIRS = "7B1E0C2A-5D3F-4A8B-9C6D-000000000099"
HOME = "AAAAAAAA-0000-4000-8000-000000000001"
SYSTEM = "AAAAAAAA-0000-4000-8000-0000000000FF"
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
        maps = _load("home_map_store")
        map_page = _load("map_page")
        yield types.SimpleNamespace(
            page_links=page_links, library=library, wc=wc, maps=maps, map_page=map_page
        )
    finally:
        for key in list(sys.modules):
            if key not in saved:
                del sys.modules[key]
        sys.modules.update(saved)


class _Response:
    def __init__(self, status: int, body: Any) -> None:
        self.status = status
        self.body = body


class _Ctx:
    def __init__(self, domain: Any, watch_id: str, payload: dict) -> None:
        self.domain_data = domain
        self.watch_id = watch_id
        self.payload = payload

    def signed_json(self, payload: dict, status: int = 200) -> _Response:
        # Through JSON, as the wire carries it.
        return _Response(status, json.loads(json.dumps(payload)))


class _Secrets:
    """The widget secret store: two iPhones and a watch."""

    def __init__(self) -> None:
        self.entries = {
            IPHONE: types.SimpleNamespace(device_kind="iphone"),
            BARE_IPHONE: types.SimpleNamespace(device_kind="iphone"),
            WATCH: types.SimpleNamespace(device_kind="watch"),
        }

    def get(self, watch_id: str):
        return self.entries.get(watch_id)


def _ops(loaded: Any) -> dict[str, Any]:
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
    wc, maps, mp = loaded.wc, loaded.maps, loaded.map_page
    namespace: dict[str, Any] = {
        "Any": Any,
        "Response": _Response,
        "_LOGGER": types.SimpleNamespace(info=lambda *a, **k: None, debug=lambda *a, **k: None),
        "is_iphone_entry": lambda secret: getattr(secret, "device_kind", None) == "iphone",
        "HomeMapError": maps.HomeMapError,
        "HomeMapConflictError": maps.HomeMapConflictError,
        "HomeMapUnavailableError": maps.HomeMapUnavailableError,
        "WatchConfigStoreError": wc.WatchConfigStoreError,
        "WatchConfigConflictError": wc.WatchConfigConflictError,
        "WatchConfigUnavailableError": wc.WatchConfigUnavailableError,
        "new_item_id": loaded.library.new_item_id,
        "home_map_entity_id": mp.home_map_entity_id,
        "map_floor": mp.map_floor,
        "map_page_name": mp.map_page_name,
        "new_map_page": mp.new_map_page,
        "listed_page_ids": loaded.page_links.listed_page_ids,
    }
    exec(code, namespace)  # noqa: S102
    return namespace


def _phone_pages() -> dict[str, Any]:
    return {
        "schemaVersion": 1,
        "pages": [
            {"id": SYSTEM, "name": "Settings", "isSystemPage": True, "items": []},
            {"id": HOME, "name": "Home", "items": [{"id": "T1", "entityId": "light.a"}]},
        ],
    }


def _two_floors() -> dict[str, Any]:
    doc = basic()
    doc["floors"].append({"id": UPSTAIRS, "name": "Upstairs", "story": 1, "rooms": [], "pins": []})
    return doc


@pytest.fixture
def env(tmp_path):
    with _loaded() as loaded:
        pages = loaded.wc.WatchConfigStore(
            FakeHass(tmp_path),
            is_paired=lambda owner: owner == WATCH,
            is_iphone=lambda owner: owner in (IPHONE, BARE_IPHONE),
        )
        asyncio.run(pages.async_load())
        changes: list[tuple[str, str, int]] = []
        pages.async_add_listener(lambda c: changes.append((c.owner_watch_id, c.kind, c.revision)))
        maps = loaded.maps.HomeMapStore(object())
        asyncio.run(maps.async_load())
        maps.save(basic(), 0)
        domain = types.SimpleNamespace(
            watch_config_store=pages, home_map_store=maps, widget_secret_store=_Secrets()
        )
        e = types.SimpleNamespace(
            loaded=loaded, pages=pages, maps=maps, domain=domain, changes=changes, ops=_ops(loaded)
        )
        put(e, IPHONE, _phone_pages())
        put(e, WATCH, _phone_pages())
        changes.clear()
        yield e


def put(env, owner: str, document: dict[str, Any]) -> None:
    """A device's signed put, forced so a test need not track revisions."""
    env.pages.put(
        owner, "pages", copy.deepcopy(document), document_hash=HASH, base_revision=0,
        force=True, updated_by=owner,
    )


def add(env, payload: dict, watch_id: str = IPHONE) -> _Response:
    return asyncio.run(env.ops["_op_home_map_page_add"](_Ctx(env.domain, watch_id, payload)))


def record(env, owner: str = IPHONE):
    return env.pages.get(owner, "pages")


def listed(env, owner: str = IPHONE) -> list[dict[str, Any]]:
    return [p for p in record(env, owner).document["pages"] if p.get("isSystemPage") is not True]


def fixed_ids(env, *ids: str) -> None:
    """The ids the op makes, in order: the page's, then its tile's."""
    queue = list(ids)
    env.ops["new_item_id"] = lambda: queue.pop(0)


# ── the add ──────────────────────────────────────────────────────────────


def test_an_iphone_adds_a_map_page_last_and_its_poll_wakes(env) -> None:
    before = record(env).revision
    reply = add(env, {"floor_id": FLOOR})
    assert reply.status == 200
    page_id = reply.body["page_id"]
    assert UUID_UPPER.match(page_id)
    assert reply.body == {
        "ok": True,
        "page_id": page_id,
        "already": False,
        "revision": record(env).revision,
        "free_plan_note": False,
    }
    assert record(env).revision > before
    # Last, visible, a map page with one Home map tile of the floor.
    page = listed(env)[-1]
    assert [p["id"] for p in listed(env)] == [HOME, page_id]
    assert page["mapPage"] is True
    assert page.get("isHidden") is not True
    assert page["name"] == "Home map"
    assert [t["entityId"] for t in page["items"]] == [f"home_map.{FLOOR}"]
    # In the library, picked by the iPhone alone; the watch is untouched.
    summary = env.pages.library_summary()
    assert summary["pages"][page_id]["owners"] == [IPHONE]
    assert [p["id"] for p in summary["picks"][IPHONE]["pages"]][-1] == page_id
    assert page_id not in [p["id"] for p in listed(env, WATCH)]
    # Told once, for the iPhone's pages only: what wakes its parked poll.
    assert env.changes == [(IPHONE, "pages", record(env).revision)]


def test_the_page_is_the_panels_add_page_for_an_iphone(env) -> None:
    """``map_page.py`` against the fixture the panel's own function wrote
    (``frontend/test/home-map-page-fixture.test.ts``)."""
    given = _FIXTURE["add"]
    built = env.loaded.map_page.new_map_page(
        given["page_id"], given["name"], given["floor_id"], given["tile_id"]
    )
    assert built == given["document"]["pages"][0]
    assert list(built) == sorted(built)
    # And after the library's create, as the panel's page would be.
    create = env.loaded.library.create_item
    empty = env.loaded.library.empty_library()
    ours = create(empty, "pages", built)
    panels = create(empty, "pages", given["document"]["pages"][0])
    assert ours.library["pages"] == panels.library["pages"]


@pytest.mark.parametrize("case", _FIXTURE["names"], ids=lambda c: c["name"])
def test_the_default_name_is_the_panels(env, case) -> None:
    mp = env.loaded.map_page
    doc = {"floors": case["floors"]}
    assert mp.map_page_name(doc, case["floors"][case["floor"]]) == case["name"]


def test_the_stored_page_is_the_panels_after_create(env) -> None:
    given = _FIXTURE["add"]
    fixed_ids(env, given["page_id"].upper(), given["tile_id"].upper())
    reply = add(env, {"floor_id": given["floor_id"]})
    assert reply.body["page_id"] == given["page_id"].upper()
    stored = env.pages.library_summary()["pages"][reply.body["page_id"]]["item"]
    made = env.loaded.library.create_item(
        env.loaded.library.empty_library(), "pages", given["document"]["pages"][0]
    )
    assert stored == made.library["pages"][given["page_id"].upper()]
    assert "isHidden" not in stored


def test_a_floor_id_in_another_case_names_the_stored_floor(env) -> None:
    reply = add(env, {"floor_id": FLOOR.lower()})
    assert reply.status == 200
    assert [t["entityId"] for t in listed(env)[-1]["items"]] == [f"home_map.{FLOOR}"]


def test_a_map_of_two_floors_names_the_page_after_its_floor(env) -> None:
    env.maps.save(_two_floors(), env.maps.rev)
    assert add(env, {"floor_id": UPSTAIRS}).status == 200
    assert listed(env)[-1]["name"] == "Upstairs"
    assert listed(env)[-1]["items"][0]["entityId"] == f"home_map.{UPSTAIRS}"


# ── asking twice ─────────────────────────────────────────────────────────


def test_asking_twice_adds_once(env) -> None:
    first = add(env, {"floor_id": FLOOR}).body
    env.changes.clear()
    library = copy.deepcopy(env.pages.library_summary())
    again = add(env, {"floor_id": FLOOR, "name": "Another"})
    assert again.status == 200
    assert again.body == {
        "ok": True,
        "page_id": first["page_id"],
        "already": True,
        "revision": first["revision"],
        "free_plan_note": False,
    }
    assert env.changes == []
    assert env.pages.library_summary() == library


def test_a_page_of_its_own_with_the_floors_tile_counts_as_already(env) -> None:
    doc = _phone_pages()
    doc["pages"][1]["items"].append({"id": "T2", "entityId": f"home_map.{FLOOR.lower()}"})
    put(env, IPHONE, doc)
    reply = add(env, {"floor_id": FLOOR})
    assert reply.body["already"] is True
    assert reply.body["page_id"] == HOME
    assert [p["id"] for p in listed(env)] == [HOME]


def test_a_tile_of_another_floor_is_no_reason_not_to_add(env) -> None:
    env.maps.save(_two_floors(), env.maps.rev)
    assert add(env, {"floor_id": UPSTAIRS}).body["already"] is False
    reply = add(env, {"floor_id": FLOOR})
    assert reply.body["already"] is False
    assert len(listed(env)) == 3


# ── refusals ─────────────────────────────────────────────────────────────


def test_an_iphone_with_no_pages_record_is_refused_and_nothing_is_made(env) -> None:
    library = copy.deepcopy(env.pages.library_summary())
    reply = add(env, {"floor_id": FLOOR}, watch_id=BARE_IPHONE)
    assert reply.status == 409
    assert reply.body["ok"] is False
    assert reply.body["error"] == "no_pages_record"
    assert record(env, BARE_IPHONE) is None
    assert env.pages.library_summary() == library
    assert env.changes == []


def test_the_store_never_makes_a_first_record_either(env) -> None:
    wc = env.loaded.wc
    page = env.loaded.map_page.new_map_page(
        env.loaded.library.new_item_id(), "Home map", FLOOR, env.loaded.library.new_item_id()
    )
    with pytest.raises(wc.WatchConfigLinkError) as raised:
        env.pages.library_add_page(BARE_IPHONE, {"schemaVersion": 1, "pages": [page]})
    assert raised.value.code == "no_pages_record"
    assert env.pages.library_summary()["pages"].get(page["id"]) is None


def test_a_refused_pick_leaves_no_page_in_the_library(env, monkeypatch) -> None:
    wc = env.loaded.wc
    library = copy.deepcopy(env.pages.library_summary())

    def refuse(*_args: Any, **_kwargs: Any) -> None:
        raise wc.WatchConfigValidationError("the pages record is over its cap")

    monkeypatch.setattr(env.pages, "library_pick", refuse)
    reply = add(env, {"floor_id": FLOOR})
    assert reply.status == 400
    assert reply.body["error"] == "invalid"
    assert env.pages.library_summary() == library
    assert env.changes == []


@pytest.mark.parametrize("floor_id", ["7B1E0C2A-5D3F-4A8B-9C6D-00000000ABCD", "not-a-floor"])
def test_a_floor_the_map_does_not_hold_is_refused(env, floor_id) -> None:
    reply = add(env, {"floor_id": floor_id})
    assert reply.status == 409
    assert reply.body["error"] == "unknown_floor"
    assert [p["id"] for p in listed(env)] == [HOME]


def test_with_no_map_every_floor_is_unknown(env) -> None:
    # The store's own answer before the first save.
    env.domain.home_map_store = types.SimpleNamespace(get=lambda: (None, 0))
    reply = add(env, {"floor_id": FLOOR})
    assert reply.status == 409
    assert reply.body["error"] == "unknown_floor"


@pytest.mark.parametrize("payload", [{}, {"floor_id": ""}, {"floor_id": 5}, {"floor_id": None}])
def test_a_missing_floor_id_is_invalid(env, payload) -> None:
    reply = add(env, payload)
    assert reply.status == 400
    assert reply.body["error"] == "invalid"


def test_a_watch_is_refused(env) -> None:
    reply = add(env, {"floor_id": FLOOR}, watch_id=WATCH)
    assert reply.status == 403
    assert reply.body["error"] == "not_an_iphone"
    assert [p["id"] for p in listed(env, WATCH)] == [HOME]


def test_an_iphone_signing_with_its_watchs_pair_is_refused(env) -> None:
    """The phone holds its watch's key too; signed with it, the signer is
    the watch, so nothing goes on either device."""
    library = copy.deepcopy(env.pages.library_summary())
    reply = add(env, {"floor_id": FLOOR}, watch_id=WATCH)
    assert reply.status == 403
    assert env.pages.library_summary() == library
    assert env.changes == []


def test_an_unknown_signer_is_refused(env) -> None:
    assert add(env, {"floor_id": FLOOR}, watch_id="who").status == 403


def test_every_refusal_with_no_store_is_unavailable(env) -> None:
    env.domain.watch_config_store = None
    reply = add(env, {"floor_id": FLOOR})
    assert (reply.status, reply.body["error"]) == (503, "unavailable")


def test_an_unreadable_map_is_unavailable(env) -> None:
    env.maps._load_failed = True
    reply = add(env, {"floor_id": FLOOR})
    assert (reply.status, reply.body["error"]) == (503, "unavailable")


# ── the name ─────────────────────────────────────────────────────────────


def test_a_name_is_kept_trimmed(env) -> None:
    assert add(env, {"floor_id": FLOOR, "name": "  Downstairs map  "}).status == 200
    assert listed(env)[-1]["name"] == "Downstairs map"


def test_a_null_name_is_the_default(env) -> None:
    assert add(env, {"floor_id": FLOOR, "name": None}).status == 200
    assert listed(env)[-1]["name"] == "Home map"


@pytest.mark.parametrize("name", ["", "   ", 3, True, ["Home"], {"n": 1}])
def test_a_name_that_is_not_text_or_is_blank_is_invalid(env, name) -> None:
    reply = add(env, {"floor_id": FLOOR, "name": name})
    assert reply.status == 400
    assert reply.body["error"] == "invalid"
    assert [p["id"] for p in listed(env)] == [HOME]


# ── the free plan ────────────────────────────────────────────────────────


def test_a_second_page_on_the_free_plan_says_so(env) -> None:
    env.pages.note_multiple_pages(IPHONE, "pages", False)
    reply = add(env, {"floor_id": FLOOR})
    assert reply.status == 200
    assert reply.body["free_plan_note"] is True


@pytest.mark.parametrize("plan", [True, None])
def test_no_line_off_the_free_plan_or_when_the_plan_is_unknown(env, plan) -> None:
    if plan is not None:
        env.pages.note_multiple_pages(IPHONE, "pages", plan)
    assert add(env, {"floor_id": FLOOR}).body["free_plan_note"] is False


def test_no_line_when_the_map_page_is_the_only_page(env) -> None:
    put(env, IPHONE, {"schemaVersion": 1, "pages": [_phone_pages()["pages"][0]]})
    env.pages.note_multiple_pages(IPHONE, "pages", False)
    reply = add(env, {"floor_id": FLOOR})
    assert reply.status == 200
    assert reply.body["free_plan_note"] is False


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
    assert table["home_map_page_add"] == "_op_home_map_page_add"


def test_setup_advertises_the_capability_after_the_scans() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    assert 'HOME_MAP_PAGE_ADD_CAPABILITY = "home_map_page_add"' in const
    lines = [line.strip() for line in init.splitlines() if "register_capability(" in line]
    assert lines.index("coordinator.register_capability(HOME_MAP_PAGE_ADD_CAPABILITY)") == lines.index(
        "coordinator.register_capability(HOME_MAP_SCANS_CAPABILITY)"
    ) + 1
