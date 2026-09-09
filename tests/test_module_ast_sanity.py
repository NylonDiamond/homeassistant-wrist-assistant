"""Static sanity checks over every module in the integration.

These need no Home Assistant and run in milliseconds, so they sit in front of
the live HTTP suite. They exist because ``py_compile`` is not enough: the
first thing they guard is a decorator that silently attaches to the wrong
definition (a ``@dataclass`` left stranded above a function after code was
inserted between it and its class), which compiles fine and then makes the
whole integration fail to import on the HA box with a traceback that only
the Supervisor's container log ever sees.
"""

from __future__ import annotations

import ast
from pathlib import Path

import pytest

_PKG = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_MODULES = sorted(p for p in _PKG.glob("*.py"))

# Decorators that only make sense on a class.
_CLASS_ONLY_DECORATORS = {"dataclass"}


def _decorator_name(node: ast.expr) -> str:
    if isinstance(node, ast.Call):
        node = node.func
    if isinstance(node, ast.Attribute):
        return node.attr
    if isinstance(node, ast.Name):
        return node.id
    return ""


@pytest.mark.parametrize("path", _MODULES, ids=[p.name for p in _MODULES])
def test_class_only_decorators_sit_on_classes(path: Path) -> None:
    tree = ast.parse(path.read_text(), filename=str(path))
    offenders: list[str] = []
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            for dec in node.decorator_list:
                if _decorator_name(dec) in _CLASS_ONLY_DECORATORS:
                    offenders.append(f"{path.name}:{node.lineno} @{_decorator_name(dec)} on def {node.name}")
    assert not offenders, "\n".join(offenders)


@pytest.mark.parametrize("path", _MODULES, ids=[p.name for p in _MODULES])
def test_module_parses(path: Path) -> None:
    ast.parse(path.read_text(), filename=str(path))


def _function_source(module: str, name: str) -> str:
    source = (_PKG / module).read_text()
    tree = ast.parse(source, filename=module)
    found = [
        node
        for node in ast.walk(tree)
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name == name
    ]
    assert len(found) == 1, f"{module}: {name} is missing or defined twice"
    return ast.get_source_segment(source, found[0]) or ""


def test_the_sync_op_records_the_caller_s_ack_and_stamps_the_pull() -> None:
    """Both are wire contract, and neither can be checked without a real box.

    ``applied_token`` on the pull is the only way an iPhone owner's panel row
    ever goes green: the phone holds no long-poll, so it never gets the
    request the watch acks on. ``set_last_sync`` is what makes
    ``watch_status.last_sync_seconds`` a number rather than null. Dropping
    either fails nothing at import time and nothing on the watch, which is why
    it is asserted here.
    """
    body = _function_source("wa_v2_views.py", "_op_complications_sync")
    for expected in ("applied_token", "set_applied_token", "set_last_sync"):
        assert expected in body, f"_op_complications_sync no longer calls {expected}"


def test_the_iphone_complication_capability_is_advertised() -> None:
    """The app pulls its lock screen records only when it sees this.

    Registered unconditionally at setup, like ``custom_complications``, so a
    loaded integration always reports it and the app never has to guess from a
    version number.
    """
    source = (_PKG / "__init__.py").read_text()
    assert 'register_capability("custom_complications_iphone")' in source


def test_uninstall_removes_every_store_the_integration_writes() -> None:
    """`async_remove_entry` must wipe the complication store too.

    Nothing can check this against a live box, because the test would have to
    uninstall the integration, and the failure is silent when it happens: a
    re-added integration comes back holding complications for watch ids that
    no longer pair with anything. So it is asserted here, statically.
    """
    source = (_PKG / "__init__.py").read_text()
    tree = ast.parse(source, filename="__init__.py")
    removers = [
        node
        for node in ast.walk(tree)
        if isinstance(node, ast.AsyncFunctionDef) and node.name == "async_remove_entry"
    ]
    assert len(removers) == 1, "async_remove_entry is missing or defined twice"
    body = ast.get_source_segment(source, removers[0]) or ""
    for expected in (
        "WIDGET_SECRET_STORAGE_KEY",
        "NOTIFICATION_TOKEN_STORAGE_KEY",
        "ComplicationStore(hass).async_remove()",
    ):
        assert expected in body, f"async_remove_entry no longer removes {expected}"
