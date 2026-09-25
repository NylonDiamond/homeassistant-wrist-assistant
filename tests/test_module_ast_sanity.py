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
import re
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


def test_the_move_status_op_reads_and_stamps_nothing() -> None:
    """The preset move calls this op signed as the watch, before and after
    every create, to learn what is live and what the watch has applied. If it
    ever stamped the pull or wrote a report, the panel would show a sync the
    watch never made and the watch's own reports could be overwritten. The
    op must stay read-only, and it must keep answering the two fields the
    move's proof rests on."""
    body = _function_source("wa_v2_views.py", "_op_complications_move_status")
    for forbidden in (
        "set_last_sync",
        "set_applied_token",
        "set_occupied",
        "set_presets",
        "set_pages",
        "store.save",
        "store.delete",
        "acknowledge_forgotten",
    ):
        assert forbidden not in body, f"_op_complications_move_status calls {forbidden}"
    for expected in ("applied_token", "owner_token", "is_forgotten", "include_deleted"):
        assert expected in body, f"_op_complications_move_status no longer reads {expected}"


def test_the_setup_orphan_sweep_cannot_fail_setup() -> None:
    """The sweep is housekeeping. An exception out of it used to fail
    ``async_setup_entry``, taking notifications and cameras down over a
    complication tidy-up, so the call must sit inside a try with a handler."""
    source = (_PKG / "__init__.py").read_text()
    tree = ast.parse(source, filename="__init__.py")
    [setup] = [
        node
        for node in ast.walk(tree)
        if isinstance(node, ast.AsyncFunctionDef) and node.name == "async_setup_entry"
    ]

    def calls_sweep(node: ast.AST) -> bool:
        return any(
            isinstance(n, ast.Call)
            and isinstance(n.func, ast.Attribute)
            and n.func.attr == "release_orphans"
            for n in ast.walk(node)
        )

    assert calls_sweep(setup), "async_setup_entry no longer sweeps orphans"
    guarded = [
        node
        for node in ast.walk(setup)
        if isinstance(node, ast.Try)
        and node.handlers
        and any(calls_sweep(stmt) for stmt in node.body)
    ]
    assert guarded, "release_orphans in async_setup_entry is not inside try/except"


def test_the_iphone_complication_capability_is_advertised() -> None:
    """The app pulls its lock screen records only when it sees this.

    Registered unconditionally at setup, like ``custom_complications``, so a
    loaded integration always reports it and the app never has to guess from a
    version number.
    """
    source = (_PKG / "__init__.py").read_text()
    assert 'register_capability("custom_complications_iphone")' in source


def test_the_slot_per_shape_capability_is_advertised() -> None:
    """The iPhone app checks this before moving presets as per-shape documents.

    A slot holds one document per shape from this version on, which the create
    batch enforces as a (slot, shape) pair rather than a slot. An app that sent
    the second document to a server without the fix would get a slot conflict
    on it and leave the move half done, so the app asks first. Registered
    unconditionally at setup, like the other complication capabilities.
    """
    source = (_PKG / "__init__.py").read_text()
    assert 'register_capability("custom_complications_slot_per_shape")' in source


def _ts_constant(relative: str, name: str) -> int:
    """One `export const NAME = <int>;` out of a panel source file."""
    path = Path(__file__).resolve().parents[1] / relative
    match = re.search(rf"^export const {re.escape(name)} = (\d+);", path.read_text(), re.M)
    assert match is not None, f"{relative}: no `export const {name} = <number>;`"
    return int(match.group(1))


def _py_constant(module: str, name: str) -> int:
    """One module-level `NAME = <int>` out of the integration, read without
    importing it: const.py pulls in nothing, but neither does ast."""
    source = (_PKG / module).read_text()
    tree = ast.parse(source, filename=module)
    for node in tree.body:
        if isinstance(node, ast.Assign) and any(
            isinstance(t, ast.Name) and t.id == name for t in node.targets
        ):
            assert isinstance(node.value, ast.Constant) and isinstance(node.value.value, int)
            return node.value.value
        if (
            isinstance(node, ast.AnnAssign)
            and isinstance(node.target, ast.Name)
            and node.target.id == name
            and isinstance(node.value, ast.Constant)
            and isinstance(node.value.value, int)
        ):
            return node.value.value
    raise AssertionError(f"{module}: no int constant named {name}")


def test_the_panel_mirrors_the_per_owner_complication_cap() -> None:
    """The panel refuses a split that would pass the cap, so it holds the number.

    The store is the one that decides it, and it refuses the save that would
    pass it. The panel counts first, because a split writes several records per
    complication and a refusal part way through leaves a device half cut. Two
    copies of a number is the price of that, and this is what keeps them equal.
    """
    assert _ts_constant(
        "frontend/src/splitShapes.ts", "COMPLICATION_MAX_PER_OWNER"
    ) == _py_constant("const.py", "COMPLICATION_MAX_PER_OWNER")


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
