"""Static checks over the integration's WebSocket command table.

Needs no Home Assistant, so it runs alongside the other offline tests in
front of the live HTTP suite.

Two failures are worth catching before a deploy. A command that is defined
but never registered is invisible: the frontend and the test suite get
``unknown_command`` back with nothing in the log to explain it. And a command
that loses its ``require_admin`` decorator becomes callable by any logged-in
non-admin user, which no test hitting a real box would notice.

Every command in both modules is admin-only, reads included: the panel is
admin-only, and the reads hand out the slot pool of every watch in the house
along with rendered templates, or a watch's whole page config. The one
exception is listed in ``_NOT_ADMIN``.

Two modules hold commands: ``complication_ws.py`` (the editor) and
``watch_config_ws.py`` (the Watch settings view). Each is checked on its own,
since each has its own registration function.
"""

from __future__ import annotations

import ast
from pathlib import Path

import pytest

_PKG = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_MODULE = _PKG / "complication_ws.py"
_WATCH_CONFIG_MODULE = _PKG / "watch_config_ws.py"

# The Watch settings view's two commands. Admin-only like every other.
_WATCH_CONFIG_ADMIN_ONLY = {
    "ws_watch_config_get",
    "ws_watch_config_save",
}

# Every command this module defines. All of them are admin-only; the set is
# spelled out rather than derived so that adding a command without deciding
# about its gating fails here instead of shipping ungated.
_ADMIN_ONLY = {
    "ws_owners",
    "ws_forget_device",
    "ws_list",
    "ws_get",
    "ws_save",
    "ws_delete",
    "ws_subscribe",
    "ws_save_history",
    "ws_save_history_get",
    "ws_save_history_restore",
    "ws_watch_status",
    "ws_nudge",
    "ws_move_owner",
    "ws_render_values",
    "ws_history_series",
    "ws_statistics_series",
    "ws_list_items",
    "ws_gallery_key",
    "ws_parts_list",
    "ws_parts_save",
    "ws_parts_delete",
    "ws_preview_save",
    "ws_preview_get",
}

# The commands a non-admin may call, each one a decision made on purpose.
# ``ws_owner_subscribe`` is the iPhone app's live line: its user need not be
# an administrator, and it hands out nothing but the token of a commit.
_NOT_ADMIN = {
    "ws_owner_subscribe",
}


_MODULES = [_MODULE, _WATCH_CONFIG_MODULE]
# Per module: the commands it must define, and which of them skip the gate.
_EXPECTED = {
    _MODULE.name: (_ADMIN_ONLY | _NOT_ADMIN, _NOT_ADMIN),
    _WATCH_CONFIG_MODULE.name: (_WATCH_CONFIG_ADMIN_ONLY, set()),
}


def _tree(module: Path = _MODULE) -> ast.Module:
    return ast.parse(module.read_text(), filename=str(module))


_Func = (ast.FunctionDef, ast.AsyncFunctionDef)


def _decorator_names(node: ast.FunctionDef | ast.AsyncFunctionDef) -> set[str]:
    names: set[str] = set()
    for dec in node.decorator_list:
        target = dec.func if isinstance(dec, ast.Call) else dec
        if isinstance(target, ast.Attribute):
            names.add(target.attr)
        elif isinstance(target, ast.Name):
            names.add(target.id)
    return names


def _command_functions(tree: ast.Module) -> list[ast.FunctionDef | ast.AsyncFunctionDef]:
    """Every websocket command handler, sync and async.

    ``async def`` parses to a different node type, so a walk that looked only
    for ``FunctionDef`` skipped ``ws_history_series`` entirely: it was neither
    checked for registration nor for its admin gate.
    """
    return [
        node
        for node in ast.walk(tree)
        if isinstance(node, _Func) and "websocket_command" in _decorator_names(node)
    ]


def _registered_names(tree: ast.Module) -> set[str]:
    """Second argument of every ``async_register_command`` call."""
    registered: set[str] = set()
    for node in ast.walk(tree):
        if not isinstance(node, ast.Call):
            continue
        func = node.func
        if not isinstance(func, ast.Attribute) or func.attr != "async_register_command":
            continue
        if len(node.args) == 2 and isinstance(node.args[1], ast.Name):
            registered.add(node.args[1].id)
    return registered


@pytest.mark.parametrize("module", _MODULES, ids=[m.name for m in _MODULES])
def test_every_command_is_registered(module: Path) -> None:
    tree = _tree(module)
    defined = {node.name for node in _command_functions(tree)}
    missing = sorted(defined - _registered_names(tree))
    assert not missing, (
        "defined but never passed to async_register_command: " + ", ".join(missing)
    )


@pytest.mark.parametrize("module", _MODULES, ids=[m.name for m in _MODULES])
def test_every_command_requires_admin(module: Path) -> None:
    tree = _tree(module)
    _expected, not_admin = _EXPECTED[module.name]
    offenders = sorted(
        node.name
        for node in _command_functions(tree)
        if node.name not in not_admin
        and "require_admin" not in _decorator_names(node)
    )
    assert not offenders, "missing @require_admin: " + ", ".join(offenders)


@pytest.mark.parametrize("module", _MODULES, ids=[m.name for m in _MODULES])
def test_admin_only_commands_exist(module: Path) -> None:
    """Guards the lists above against a rename that would silently empty
    them, and against a new command nobody made a gating decision about."""
    defined = {node.name for node in _command_functions(_tree(module))}
    expected, _not_admin = _EXPECTED[module.name]
    assert defined == expected, sorted(defined ^ expected)


def test_the_watch_config_commands_are_registered_at_setup() -> None:
    """The module's own registration function is no use if setup never calls
    it: the panel would get ``unknown_command`` with nothing in the log."""
    source = (_PKG / "__init__.py").read_text()
    assert "async_register_watch_config_commands(hass)" in source
