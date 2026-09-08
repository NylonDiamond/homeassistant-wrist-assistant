"""Static checks over the integration's WebSocket command table.

Needs no Home Assistant, so it runs alongside the other offline tests in
front of the live HTTP suite.

Two failures are worth catching before a deploy. A command that is defined
but never registered is invisible: the frontend and the test suite get
``unknown_command`` back with nothing in the log to explain it. And a command
that loses its ``require_admin`` decorator becomes callable by any logged-in
non-admin user, which no test hitting a real box would notice.

Every command in the module is admin-only, reads included: the panel is
admin-only, and the reads hand out the slot pool of every watch in the house
along with rendered templates.
"""

from __future__ import annotations

import ast
from pathlib import Path

_MODULE = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "complication_ws.py"
)

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
    "ws_watch_status",
    "ws_nudge",
    "ws_move_owner",
    "ws_render_values",
    "ws_history_series",
    "ws_statistics_series",
}


def _tree() -> ast.Module:
    return ast.parse(_MODULE.read_text(), filename=str(_MODULE))


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


def test_every_command_is_registered() -> None:
    tree = _tree()
    defined = {node.name for node in _command_functions(tree)}
    missing = sorted(defined - _registered_names(tree))
    assert not missing, (
        "defined but never passed to async_register_command: " + ", ".join(missing)
    )


def test_every_command_requires_admin() -> None:
    tree = _tree()
    offenders = sorted(
        node.name
        for node in _command_functions(tree)
        if "require_admin" not in _decorator_names(node)
    )
    assert not offenders, "missing @require_admin: " + ", ".join(offenders)


def test_admin_only_commands_exist() -> None:
    """Guards the list above against a rename that would silently empty it,
    and against a new command nobody made a gating decision about."""
    defined = {node.name for node in _command_functions(_tree())}
    assert defined == _ADMIN_ONLY, sorted(defined ^ _ADMIN_ONLY)
