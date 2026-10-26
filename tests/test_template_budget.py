"""Offline tests for the template budget: ``template_budget`` in
watch_config_store.py, which counts the distinct Show tile templates a pages
document asks a device to send, and the ``template_budget`` field of the
pages save replies (``watch_config/save`` and ``library/item/save``).

Also the constants it rests on, const.py against the delta's own caps and
the stand-in const module the store tests load.

Nothing here talks to a live Home Assistant.
"""

from __future__ import annotations

import ast
import copy
from pathlib import Path
from typing import Any

from test_watch_config_store import TEMPLATE_CONSTS, mod  # noqa: F401 (mod: fixture)
from test_watch_config_ws import ROOT, env  # noqa: F401 (env: the links fixture's own)
from test_watch_pages_link_ws import (  # noqa: F401 (links is a fixture)
    HOME,
    LIGHTS,
    WATCH,
    _run,
    links,
)

_CC = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"

TILE = "1B6E1F4C-6E83-4B5E-9C5C-7F3A2D1E0A11"
PAGE = "6F1C2D0E-0000-4000-8000-000000000001"


def _tile(*, tile_id: str = TILE, **keys: Any) -> dict:
    tile: dict[str, Any] = {"id": tile_id, "entityId": "person.chen", "colSpan": 6, "rowSpan": 4}
    tile.update(keys)
    return tile


def _pages(*tiles: dict, page_id: str = PAGE) -> dict:
    return {"schemaVersion": 1, "pages": [{"id": page_id, "name": "Home", "items": list(tiles)}]}


def _budget(used: int, scope: str) -> dict:
    return {"used": used, "limit": 100, "scope": scope}


# ── Constants ────────────────────────────────────────────────────────────


def _module_constants(path: Path) -> dict[str, Any]:
    values: dict[str, Any] = {}
    for node in ast.parse(path.read_text()).body:
        if isinstance(node, ast.Assign) and len(node.targets) == 1 and isinstance(node.targets[0], ast.Name):
            try:
                values[node.targets[0].id] = ast.literal_eval(node.value)
            except ValueError:
                pass
    return values


def test_the_constants_match_the_delta() -> None:
    const = _module_constants(_CC / "const.py")
    views = _module_constants(_CC / "wa_v2_views.py")
    # A show-when template the budget counts is one the delta takes, and the
    # budget's limit is the delta's.
    assert const["SHOW_TEMPLATE_MAX_CHARS"] == views["DELTA_MAX_TEMPLATE_CHARS"] == 4096
    assert const["TEMPLATE_BUDGET_LIMIT"] == views["DELTA_MAX_TEMPLATES"] == 100
    # The store tests' stand-in const module carries the same numbers.
    assert TEMPLATE_CONSTS == {key: const[key] for key in TEMPLATE_CONSTS}


def test_tile_layers_are_gone_from_const_and_the_capabilities() -> None:
    const = _module_constants(_CC / "const.py")
    for name in (
        "CUSTOM_TILES_CAPABILITY",
        "TILE_DESIGN_MAX_BYTES",
        "TILE_DESIGN_MAX_LAYERS",
        "TILE_DESIGN_MAX_ZONES",
        "TILE_TEMPLATE_MAX_CHARS",
    ):
        assert name not in const
    assert "custom_tiles" not in const.values()
    assert "custom_tiles" not in (_CC / "__init__.py").read_text()


# ── template_budget ──────────────────────────────────────────────────────


def test_the_budget_counts_distinct_show_templates(mod) -> None:  # noqa: F811
    budget = mod.template_budget
    one = "{{ is_state('light.a', 'on') }}"
    two = "{{ is_state('light.b', 'on') }}"
    document = {
        "pages": [
            {
                "id": "P1",
                "items": [
                    _tile(tile_id="A", showWhenTemplate=one),
                    _tile(tile_id="B", showWhenTemplate=one),
                    _tile(tile_id="C"),
                ],
            },
            {"id": "P2", "items": [_tile(tile_id="D", showWhenTemplate=two)]},
        ]
    }
    assert budget(document) == 2


def test_the_budget_leaves_out_what_a_device_does_not_send(mod) -> None:  # noqa: F811
    budget = mod.template_budget
    document = _pages(
        _tile(tile_id="A", showWhenTemplate="   \n"),
        _tile(tile_id="B", showWhenTemplate="x" * 4097),
        _tile(tile_id="C", showWhenTemplate=3),
        # An old tile layers template is no template any more.
        _tile(tile_id="D", design={"v": 1, "template": "{{ 1 }}", "doc": {"elements": []}}),
    )
    assert budget(document) == 0
    document["pages"][0]["items"].append(_tile(tile_id="G", showWhenTemplate="x" * 4096))
    assert budget(document) == 1


def test_the_budget_takes_any_document(mod) -> None:  # noqa: F811
    budget = mod.template_budget
    for document in (None, [], {}, {"pages": "x"}, {"pages": [1, {"items": "x"}, {"items": [2]}]}):
        assert budget(document) == 0


# ── The save replies ─────────────────────────────────────────────────────


def test_a_pages_save_reply_names_the_device_s_budget(links) -> None:  # noqa: F811
    store = links.store
    pages = copy.deepcopy(store.get(WATCH, "pages").document)
    home = next(page for page in pages["pages"] if page["id"] == HOME)
    home["items"].append(_tile(tile_id="T9", showWhenTemplate="{{ true }}"))
    lights = next(page for page in pages["pages"] if page["id"] == LIGHTS)
    lights["items"] = [
        _tile(showWhenTemplate="{{ 2 }}"),
        _tile(tile_id="T2", showWhenTemplate="{{ true }}"),
    ]
    saved = _run(
        links,
        links.ws.ws_watch_config_save,
        owner_watch_id=WATCH,
        kind="pages",
        base_revision=store.get(WATCH, "pages").revision,
        document=pages,
    )
    assert saved.errors == []
    assert saved.results[1]["template_budget"] == _budget(2, "device")

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
        _tile(showWhenTemplate="{{ 2 }}"),
        _tile(tile_id="T2", showWhenTemplate="{{ 2 }}"),
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
    # The page alone: its one show-when text, not Home's.
    assert connection.results[1] == {"revision": item["revision"] + 1, "template_budget": _budget(1, "page")}
