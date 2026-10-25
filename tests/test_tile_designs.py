"""Offline tests for tile layers on the server side (app repo
docs/tile_layers_contract_2026-10.md, section 7).

* ``_check_items`` guarding a tile's ``design``: every refusal by its exact
  message, a design at every cap passing, and a device save that skips the
  check, as it skips the rest of the tile level.
* The design kept as sent through a panel save, the library and a pick onto
  another device, since the apps read it byte for byte.
* ``template_budget`` and the ``template_budget`` field of the pages save
  replies (``watch_config/save`` and ``library/item/save``).
* The constants: const.py against the contract, the delta's own caps and the
  stand-in const module the store tests load.
* The delta's JSON answer: ``_render_template_tracked`` from ``api.py`` on a
  document built the way the compilers' ``buildDocument`` builds one gives
  text that ``json.loads`` reads back. This one needs Home Assistant itself
  (``homeassistant.helpers.template``) and is skipped where it is not
  installed, as in ``.venv-test``; every other test here runs on the stubs.

Nothing here talks to a live Home Assistant.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import copy
import json
import logging
import tempfile
import types
from pathlib import Path
from typing import Any

import pytest

# Home Assistant's own template engine, for the render test. Imported before
# any test runs: the store tests' stand-ins set attributes on whatever
# ``homeassistant`` modules are loaded, real ones included.
try:
    from homeassistant.core import HomeAssistant as _RealHomeAssistant
    from homeassistant.helpers.template import Template as _RealTemplate
except ImportError:  # .venv-test has no Home Assistant
    _RealHomeAssistant = None
    _RealTemplate = None

from test_watch_config_store import OWNER, TILE_DESIGN_CONSTS, _new, mod  # noqa: F401 (mod: fixture)
from test_watch_config_ws import ROOT, env  # noqa: F401 (env: the links fixture's own)
from test_watch_pages_link_ws import (  # noqa: F401 (links is a fixture)
    HOME,
    LIGHTS,
    PHONE,
    WATCH,
    WATCH_2,
    _run,
    links,
)

_CC = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"

TILE = "1B6E1F4C-6E83-4B5E-9C5C-7F3A2D1E0A11"
PAGE = "6F1C2D0E-0000-4000-8000-000000000001"
NAME_ID = "BA5E0000-0000-4000-8000-000000000003"
STATE_ID = "BA5E0000-0000-4000-8000-000000000004"
ZONE_1 = "6F1C2A1E-0B7D-4C55-9E0B-2B9B0D7C1A01"
WHERE = f'document.pages[0] (id "{PAGE}").items[0].design'


def _text(element_id: str, value_kind: str) -> dict:
    return {
        "id": element_id,
        "kind": "text",
        "value": {"kind": {"kind": value_kind}},
        "frame": {"x": 0.1, "y": 0.6, "width": 0.8, "height": 0.3, "rotationDegrees": 0},
    }


def _tap(element_id: str) -> dict:
    return {
        "id": element_id,
        "kind": "tap",
        "action": {"type": "none"},
        "frame": {"x": 0, "y": 0, "width": 0.5, "height": 1, "rotationDegrees": 0},
    }


def _design(
    elements: list | None = None,
    *,
    template: str | None = None,
    **extra: Any,
) -> dict:
    """A design as the panel writes one: keys in the contract's order, an
    unknown nested key included so a test can see it kept."""
    design: dict[str, Any] = {
        "v": 1,
        "owned": ["base.name"],
        "zones": {ZONE_1: {"action": "openControl", "futureKey": [1, {"a": None}]}},
    }
    if template is not None:
        design["template"] = template
    design["doc"] = {
        "schemaVersion": 6,
        "id": TILE,
        "name": "Chen",
        "values": [],
        "slotIndex": 0,
        "elements": elements
        if elements is not None
        else [_text(STATE_ID, "tileState"), _text(NAME_ID, "tileName"), _tap(ZONE_1)],
        "supportedFamilies": ["rectangular"],
        "dataSources": [],
        "tapAction": {"type": "none"},
    }
    design.update(extra)
    return design


def _tile(design: Any = None, *, tile_id: str = TILE, **keys: Any) -> dict:
    tile: dict[str, Any] = {"id": tile_id, "entityId": "person.chen", "colSpan": 6, "rowSpan": 4}
    tile.update(keys)
    if design is not None:
        tile["design"] = design
    return tile


def _pages(*tiles: dict, page_id: str = PAGE) -> dict:
    return {"schemaVersion": 1, "pages": [{"id": page_id, "name": "Home", "items": list(tiles)}]}


def _refusal(mod, design: Any) -> str:  # noqa: F811 (mod is the fixture's module)
    tile = _tile()
    tile["design"] = design
    with pytest.raises(mod.WatchConfigValidationError) as err:
        mod.validate_document("pages", _pages(tile), check_items=True)
    return err.value.message


# ── The delta's JSON answer (needs Home Assistant) ───────────────────────
# First in the file, before any store test sets its stand-ins on the loaded
# Home Assistant modules.


def _render_template_tracked():
    """``DeltaCoordinator._render_template_tracked`` out of api.py, as a plain
    function of ``(self, template_str)``, with Home Assistant's real
    ``Template``."""
    source = (_CC / "api.py").read_text()
    tree = ast.parse(source)
    [coordinator] = [
        node for node in tree.body if isinstance(node, ast.ClassDef) and node.name == "DeltaCoordinator"
    ]
    [method] = [
        node
        for node in coordinator.body
        if isinstance(node, ast.FunctionDef) and node.name == "_render_template_tracked"
    ]
    code = compile(
        ast.Module(body=[method], type_ignores=[]),
        str(_CC / "api.py"),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    namespace: dict[str, Any] = {
        "Any": Any,
        "Template": _RealTemplate,
        "_TemplateDeps": lambda **deps: types.SimpleNamespace(**deps),
        "_LOGGER": logging.getLogger("test_tile_designs"),
    }
    exec(code, namespace)  # noqa: S102
    return namespace["_render_template_tracked"]


def _build_document(expressions: dict[str, str]) -> str:
    """The compilers' ``buildDocument`` (``frontend/src/compiler.ts``)."""
    keys = sorted(expressions)
    lines = []
    for key in keys:
        expr = expressions[key]
        if "{{" in expr or "{%" in expr:
            lines.append(f"{{% set v_{key} %}}{expr}{{% endset %}}")
        else:
            lines.append(f"{{% set v_{key} = {expr} %}}")
    pairs = ", ".join(f'"{key}": v_{key}' for key in keys)
    lines.append(f"{{{{ {{ {pairs} }} | to_json }}}}")
    return "\n".join(lines)


@pytest.mark.skipif(_RealTemplate is None, reason="needs Home Assistant installed")
def test_a_tile_template_s_answer_is_the_json_text() -> None:
    render = _render_template_tracked()

    async def run() -> list[tuple[str | None, Any]]:
        hass = _RealHomeAssistant(tempfile.mkdtemp())
        hass.states.async_set(
            "sensor.chen_phone_battery", "82", {"battery_level": 82, "label": 'Chen\'s "phone"\nsecond line'}
        )
        coordinator = types.SimpleNamespace(hass=hass)
        try:
            return [
                # A string with a quote and a newline, and a true: not a
                # Python literal, so Home Assistant leaves the text alone.
                render(
                    coordinator,
                    _build_document(
                        {
                            "e_label": "state_attr('sensor.chen_phone_battery', 'label')",
                            "e_on": "true",
                        }
                    ),
                ),
                # Plain values: a Python literal too, which Home Assistant
                # parses into a dict whose str() is still the text.
                render(
                    coordinator,
                    _build_document(
                        {
                            "e_battery": "state_attr('sensor.chen_phone_battery', 'battery_level')",
                            "e_name": "'Chen'",
                        }
                    ),
                ),
            ]
        finally:
            await hass.async_stop(force=True)

    (quoted, quoted_deps), (plain, plain_deps) = asyncio.run(run())
    assert json.loads(quoted) == {"e_label": 'Chen\'s "phone"\nsecond line', "e_on": True}
    assert json.loads(plain) == {"e_battery": 82, "e_name": "Chen"}
    # One line each, so the delta's `lines` hands the whole text over.
    assert "\n" not in quoted and "\n" not in plain
    assert "sensor.chen_phone_battery" in quoted_deps.entities
    assert "sensor.chen_phone_battery" in plain_deps.entities


# ── Constants ────────────────────────────────────────────────────────────


def _module_constants(path: Path) -> dict[str, Any]:
    values: dict[str, Any] = {}
    for node in ast.parse(path.read_text()).body:
        if isinstance(node, ast.Assign) and len(node.targets) == 1 and isinstance(node.targets[0], ast.Name):
            try:
                values[node.targets[0].id] = ast.literal_eval(node.value)
            except ValueError:
                # 16 * 1024: a product of literals. Anything naming another
                # constant is left out.
                try:
                    values[node.targets[0].id] = eval(  # noqa: S307 (literals only)
                        compile(ast.Expression(node.value), str(path), "eval"), {"__builtins__": {}}
                    )
                except NameError:
                    pass
    return values


def test_the_constants_match_the_contract_and_the_delta() -> None:
    const = _module_constants(_CC / "const.py")
    views = _module_constants(_CC / "wa_v2_views.py")
    assert const["CUSTOM_TILES_CAPABILITY"] == "custom_tiles"
    contract = {
        "TILE_DESIGN_MAX_BYTES": 16384,
        "TILE_DESIGN_MAX_LAYERS": 8,
        "TILE_DESIGN_MAX_ZONES": 4,
        "TILE_TEMPLATE_MAX_CHARS": 4096,
        "TEMPLATE_BUDGET_LIMIT": 100,
    }
    assert {key: const[key] for key in contract} == contract
    # The store tests' stand-in const module carries the same numbers.
    assert TILE_DESIGN_CONSTS == contract
    # A tile template the server takes is one the delta takes, and the
    # budget's limit is the delta's.
    assert const["TILE_TEMPLATE_MAX_CHARS"] == views["DELTA_MAX_TEMPLATE_CHARS"]
    assert const["TEMPLATE_BUDGET_LIMIT"] == views["DELTA_MAX_TEMPLATES"]


def test_the_capability_is_registered() -> None:
    source = (_CC / "__init__.py").read_text()
    registered = [
        node.args[0].id
        for node in ast.walk(ast.parse(source))
        if isinstance(node, ast.Call)
        and isinstance(node.func, ast.Attribute)
        and node.func.attr == "register_capability"
        and node.args
        and isinstance(node.args[0], ast.Name)
    ]
    assert "CUSTOM_TILES_CAPABILITY" in registered
    assert registered.index("CUSTOM_TILES_CAPABILITY") == registered.index("PUSH_PAIRED_BY_USER_CAPABILITY") + 1


# ── _check_items: the design guard ───────────────────────────────────────


def test_a_valid_design_passes(mod) -> None:  # noqa: F811
    template = _build_document({"e_1": "states('sensor.x')"})
    document = _pages(_tile(_design(template=template)), _tile(tile_id="T2"))
    assert mod.validate_document("pages", document, check_items=True) > 0


def test_a_design_at_every_cap_passes(mod) -> None:  # noqa: F811
    layers = [_text(f"L{n}", "tileName") for n in range(8)]
    zones = [_tap(f"Z{n}") for n in range(4)]
    design = _design(layers + zones, template="x" * 4096, owned=[], zones={})
    mod.validate_document("pages", _pages(_tile(design)), check_items=True)
    # Padded to the byte cap exactly, counted as compact UTF-8 JSON: the
    # pound sign is two bytes.
    padded = _design(owned=[])
    size = len(json.dumps(padded, separators=(",", ":"), ensure_ascii=False).encode())
    padded["doc"]["name"] += "£" * ((16384 - size) // 2) + "x" * ((16384 - size) % 2)
    assert len(json.dumps(padded, separators=(",", ":"), ensure_ascii=False).encode()) == 16384
    mod.validate_document("pages", _pages(_tile(padded)), check_items=True)


def test_a_design_that_is_not_an_object_is_refused(mod) -> None:  # noqa: F811
    for design in ("layers", [1], 1, True):
        assert _refusal(mod, design) == f"{WHERE} must be an object"


def test_a_null_design_is_no_design(mod) -> None:  # noqa: F811
    tile = _tile()
    tile["design"] = None
    mod.validate_document("pages", _pages(tile), check_items=True)


def test_a_design_over_the_byte_cap_is_refused(mod) -> None:  # noqa: F811
    design = _design()
    size = len(json.dumps(design, separators=(",", ":"), ensure_ascii=False).encode())
    design["doc"]["name"] += "£" * ((16385 - size + 1) // 2)
    size = len(json.dumps(design, separators=(",", ":"), ensure_ascii=False).encode())
    assert size > 16384
    assert _refusal(mod, design) == f"{WHERE} is {size} bytes; the limit is 16384"


@pytest.mark.parametrize("version", [None, 0, 2, "1", 1.5, True])
def test_a_design_of_another_version_is_refused(mod, version) -> None:  # noqa: F811
    design = _design()
    if version is None:
        del design["v"]
    else:
        design["v"] = version
    assert _refusal(mod, design) == f"{WHERE}.v must be 1"


def test_a_design_without_a_doc_and_its_elements_is_refused(mod) -> None:  # noqa: F811
    message = f"{WHERE}.doc must be an object with a list of elements"
    for doc in (None, "doc", [], {}, {"elements": {}}, {"elements": None}):
        design = _design()
        if doc is None:
            del design["doc"]
        else:
            design["doc"] = doc
        assert _refusal(mod, design) == message


def test_too_many_layers_are_refused(mod) -> None:  # noqa: F811
    layers = [_text(f"L{n}", "tileName") for n in range(9)]
    assert _refusal(mod, _design(layers)) == f"{WHERE} has 9 layers; the limit is 8"
    # Something that is not an object, or has no kind, is a layer too; tap
    # zones are not.
    mixed = [_text(f"L{n}", "tileName") for n in range(7)] + ["junk", {"id": "X"}] + [_tap("Z")]
    assert _refusal(mod, _design(mixed)) == f"{WHERE} has 9 layers; the limit is 8"


def test_too_many_tap_zones_are_refused(mod) -> None:  # noqa: F811
    zones = [_tap(f"Z{n}") for n in range(5)]
    assert _refusal(mod, _design(zones)) == f"{WHERE} has 5 tap zones; the limit is 4"


def test_a_bad_owned_list_is_refused(mod) -> None:  # noqa: F811
    for owned in ("base.name", ["base.name", 3], {"base.name": True}, None):
        assert _refusal(mod, _design(owned=owned)) == f"{WHERE}.owned must be a list of strings"


def test_bad_zones_are_refused(mod) -> None:  # noqa: F811
    for zones in ([], "none", None):
        assert _refusal(mod, _design(zones=zones)) == f"{WHERE}.zones must be an object"


def test_a_bad_template_is_refused(mod) -> None:  # noqa: F811
    message = f"{WHERE}.template must be a string of at most 4096 characters"
    for template in (None, 3, ["x"], "x" * 4097):
        design = _design()
        design["template"] = template
        assert _refusal(mod, design) == message
    # Code points, not bytes: 4096 two-byte characters are within the cap.
    mod.validate_document("pages", _pages(_tile(_design(template="é" * 4096))), check_items=True)


def test_owned_zones_and_template_may_be_absent(mod) -> None:  # noqa: F811
    design = _design()
    for key in ("owned", "zones"):
        del design[key]
    mod.validate_document("pages", _pages(_tile(design)), check_items=True)


def test_the_refusal_names_the_tile_by_page_and_index(mod) -> None:  # noqa: F811
    document = _pages(_tile(tile_id="T0"), _tile(_design(owned="x"), tile_id="T1"))
    with pytest.raises(mod.WatchConfigValidationError) as err:
        mod.validate_document("pages", document, check_items=True)
    assert err.value.message == f'document.pages[0] (id "{PAGE}").items[1].design.owned must be a list of strings'


def test_a_device_save_skips_the_design_guard(mod) -> None:  # noqa: F811
    broken = _pages(_tile({"v": 9, "doc": "nonsense"}))
    assert mod.validate_document("pages", broken) > 0
    store = _new(mod)
    record = store.put(
        OWNER, "pages", broken, document_hash="a" * 64, base_revision=0, updated_by=OWNER
    )
    assert record.document == broken
    # The panel saving the same is refused, and so is a restore.
    with pytest.raises(mod.WatchConfigValidationError):
        store.panel_save(OWNER, "pages", broken, base_revision=1)


def test_a_panel_save_is_refused_over_a_cap(mod) -> None:  # noqa: F811
    store = _new(mod)
    store.put(OWNER, "pages", _pages(_tile()), document_hash="a" * 64, base_revision=0, updated_by=OWNER)
    with pytest.raises(mod.WatchConfigValidationError) as err:
        store.panel_save(OWNER, "pages", _pages(_tile(_design([_tap(f"Z{n}") for n in range(5)]))), base_revision=1)
    assert err.value.message == f"{WHERE} has 5 tap zones; the limit is 4"
    assert store.get(OWNER, "pages").revision == 1


# ── The design kept as sent ──────────────────────────────────────────────


def test_a_panel_save_keeps_the_design_as_sent(mod) -> None:  # noqa: F811
    store = _new(mod)
    store.put(OWNER, "pages", _pages(_tile()), document_hash="a" * 64, base_revision=0, updated_by=OWNER)
    design = _design(template="{{ 1 }}")
    sent = _pages(_tile(design))
    record = store.panel_save(OWNER, "pages", copy.deepcopy(sent), base_revision=1)
    assert record.document == sent
    stored = store.get(OWNER, "pages").document["pages"][0]["items"][0]["design"]
    assert stored == design
    # Key order too, which the panel's normal form fixes.
    assert list(stored) == ["v", "owned", "zones", "template", "doc"]


def test_the_library_and_a_pick_keep_the_design(links) -> None:  # noqa: F811
    store = links.store
    pages = copy.deepcopy(store.get(WATCH, "pages").document)
    design = _design(template="{{ 2 }}")
    lights = next(page for page in pages["pages"] if page["id"] == LIGHTS)
    lights["items"] = [_tile(design)]
    store.panel_save(WATCH, "pages", pages, base_revision=store.get(WATCH, "pages").revision)

    item = store.library_item("pages", LIGHTS)
    assert item["document"]["pages"][0]["items"][0]["design"] == design

    for device in (WATCH_2, PHONE):
        store.library_pick(device, "pages", LIGHTS, on=True)
        picked = next(p for p in store.get(device, "pages").document["pages"] if p["id"] == LIGHTS)
        assert picked["items"][0]["design"] == design

    # A save of the page in the library reaches every device with it.
    edited = copy.deepcopy(item["document"])
    edited["pages"][0]["items"][0]["design"]["owned"] = ["base.name", "base.state"]
    store.library_save_item("pages", LIGHTS, item["revision"], edited)
    for device in (WATCH, WATCH_2, PHONE):
        page = next(p for p in store.get(device, "pages").document["pages"] if p["id"] == LIGHTS)
        assert page["items"][0]["design"]["owned"] == ["base.name", "base.state"]


# ── template_budget ──────────────────────────────────────────────────────


def test_the_budget_counts_distinct_templates_of_each_kind(mod) -> None:  # noqa: F811
    budget = mod.template_budget
    one = "{{ is_state('light.a', 'on') }}"
    tile_a = _build_document({"e_1": "states('sensor.a')"})
    tile_b = _build_document({"e_1": "states('sensor.b')"})
    document = {
        "pages": [
            {
                "id": "P1",
                "items": [
                    _tile(tile_id="A", showWhenTemplate=one),
                    _tile(_design(template=tile_a), tile_id="B", showWhenTemplate=one),
                    _tile(_design(template=tile_a), tile_id="C"),
                ],
            },
            {"id": "P2", "items": [_tile(_design(template=tile_b), tile_id="D")]},
        ]
    }
    # one show, two tile texts.
    assert budget(document) == 3
    # The same text as a show-when and as a tile template is two keys
    # (show_<hash> and tile_<hash>).
    document["pages"][1]["items"].append(_tile(_design(template=one), tile_id="E"))
    assert budget(document) == 4


def test_the_budget_leaves_out_what_a_device_does_not_send(mod) -> None:  # noqa: F811
    budget = mod.template_budget
    document = _pages(
        _tile(tile_id="A", showWhenTemplate="   \n"),
        _tile(tile_id="B", showWhenTemplate="x" * 4097),
        _tile(tile_id="C", showWhenTemplate=3),
        _tile(_design(), tile_id="D"),
        _tile(_design(template=" "), tile_id="E"),
        _tile(tile_id="F", design="not a design"),
    )
    assert budget(document) == 0
    document["pages"][0]["items"].append(_tile(tile_id="G", showWhenTemplate="x" * 4096))
    assert budget(document) == 1


def test_the_budget_takes_any_document(mod) -> None:  # noqa: F811
    budget = mod.template_budget
    for document in (None, [], {}, {"pages": "x"}, {"pages": [1, {"items": "x"}, {"items": [2]}]}):
        assert budget(document) == 0


# ── The save replies ─────────────────────────────────────────────────────


def _budget(used: int, scope: str) -> dict:
    return {"used": used, "limit": 100, "scope": scope}


def test_a_pages_save_reply_names_the_device_s_budget(links) -> None:  # noqa: F811
    store = links.store
    pages = copy.deepcopy(store.get(WATCH, "pages").document)
    home = next(page for page in pages["pages"] if page["id"] == HOME)
    home["items"].append(_tile(_design(template="{{ 1 }}"), tile_id="T9", showWhenTemplate="{{ true }}"))
    lights = next(page for page in pages["pages"] if page["id"] == LIGHTS)
    lights["items"] = [_tile(_design(template="{{ 2 }}"))]
    saved = _run(
        links,
        links.ws.ws_watch_config_save,
        owner_watch_id=WATCH,
        kind="pages",
        base_revision=store.get(WATCH, "pages").revision,
        document=pages,
    )
    assert saved.errors == []
    assert saved.results[1]["template_budget"] == _budget(3, "device")

    # Another kind's reply has none.
    status = store.get(WATCH, "status_pages")
    saved = _run(
        links,
        links.ws.ws_watch_config_save,
        owner_watch_id=WATCH,
        kind="status_pages",
        base_revision=status.revision,
        document=status.document,
    )
    assert saved.errors == []
    assert "template_budget" not in saved.results[1]


def test_a_library_page_save_reply_names_the_page_s_budget(links) -> None:  # noqa: F811
    store = links.store
    pages = copy.deepcopy(store.get(WATCH, "pages").document)
    home = next(page for page in pages["pages"] if page["id"] == HOME)
    home["items"].append(_tile(tile_id="T9", showWhenTemplate="{{ true }}"))
    store.panel_save(WATCH, "pages", pages, base_revision=store.get(WATCH, "pages").revision)

    item = store.library_item("pages", LIGHTS)
    item["document"]["pages"][0]["items"] = [
        _tile(_design(template="{{ 2 }}")),
        _tile(_design(template="{{ 2 }}"), tile_id="T2"),
    ]
    connection = _run(
        links,
        links.ws.ws_library_item_save,
        ROOT,
        kind="pages",
        item_id=LIGHTS,
        base_revision=item["revision"],
        document=item["document"],
    )
    assert connection.errors == []
    # The page alone: its one tile template, not Home's show-when.
    assert connection.results[1] == {"revision": item["revision"] + 1, "template_budget": _budget(1, "page")}
