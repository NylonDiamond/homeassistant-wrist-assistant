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
