"""Static checks over the integration's WebSocket command table.

Needs no Home Assistant, so it runs alongside the other offline tests in
front of the live HTTP suite.

Two failures are worth catching before a deploy. A command that is defined
but never registered is invisible: the frontend and the test suite get
``unknown_command`` back with nothing in the log to explain it. And a command
that loses its ``require_admin`` decorator becomes callable by any logged-in
non-admin user, which no test hitting a real box would notice.

Every command is admin-only, reads included: the panel is admin-only, and the
reads hand out the slot pool of every watch in the house along with rendered
templates, a watch's whole page config, or what a watch waiting to pair
reported. The exceptions are listed in ``_NOT_ADMIN``: one live line each in
two modules, and ``client_certificate_ws.py``, whose commands only ever touch
the caller's own certificate.

Seven modules hold commands: ``complication_ws.py`` (the editor),
``watch_config_ws.py`` (the Watch settings view and the page editor),
``pairing_ws.py`` (confirming a watch's pairing code),
``http_actions_ws.py`` (the home's HTTP action library),
``page_images_ws.py`` (the home's page photos),
``camera_framing_ws.py`` (the cameras' notification framing) and
``client_certificate_ws.py`` (the user's own client certificate). Each is
checked on its own, since each has its own registration function.
"""

from __future__ import annotations

import ast
from pathlib import Path

import pytest

_PKG = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_MODULE = _PKG / "complication_ws.py"
_WATCH_CONFIG_MODULE = _PKG / "watch_config_ws.py"
_PAIRING_MODULE = _PKG / "pairing_ws.py"
_HTTP_ACTIONS_MODULE = _PKG / "http_actions_ws.py"
_PAGE_IMAGES_MODULE = _PKG / "page_images_ws.py"
_CAMERA_FRAMING_MODULE = _PKG / "camera_framing_ws.py"
_CLIENT_CERTIFICATE_MODULE = _PKG / "client_certificate_ws.py"

# The Watch settings view's and the page editor's commands. Admin-only like
# every other: history_entry hands out a whole past document, and restore
# writes one. The voice list read is the panel's too.
_WATCH_CONFIG_ADMIN_ONLY = {
    "ws_watch_config_get",
    "ws_watch_config_summary",
    "ws_watch_config_save",
    "ws_watch_config_history",
    "ws_watch_config_history_entry",
    "ws_watch_config_restore",
    "ws_watch_voices_get",
}

# Confirming a pairing code writes a device secret bound to the confirming
# user, and a lookup hands out what a waiting watch reported. Admin only.
_PAIRING_ADMIN_ONLY = {
    "ws_pair_lookup",
    "ws_pair_confirm",
}

# The panel's HTTP actions screen (step 4d batch 4). A read hands out every
# URL, header and global of the home, and a test sends a request from Home
# Assistant to wherever the draft points. Admin only.
_HTTP_ACTIONS_ADMIN_ONLY = {
    "ws_http_actions_get",
    "ws_http_actions_save",
    "ws_http_actions_test",
}

# The panel's page photos (step 4d batch 6). A photo can show the inside of
# the house, and an upload or a delete writes to Home Assistant's disk.
# Admin only.
_PAGE_IMAGES_ADMIN_ONLY = {
    "ws_page_images_list",
    "ws_page_images_get",
    "ws_page_images_upload",
    "ws_page_images_delete",
}

# The panel's camera framing screen. A save changes what every alert of a
# camera shows, and a test sends a real alert. Admin only.
_CAMERA_FRAMING_ADMIN_ONLY = {
    "ws_cameras_list",
    "ws_cameras_save",
    "ws_cameras_test",
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

# The commands a non-admin may call, per module, each one a decision made on
# purpose. Both are the iPhone app's live lines, and its user need not be an
# administrator:
# * ``ws_owner_subscribe`` hands out nothing but the token of a commit.
# * ``ws_watch_config_subscribe`` hands out nothing but revision numbers, the
#   same kind of thing. The documents themselves still travel only over the
#   signed ``watch_config_get``.
# * The client certificate commands read and write only the certificate of
#   the user on the connection, the same per-user record the signed ops keep,
#   and any signed-in user manages their own.
_NOT_ADMIN = {
    _MODULE.name: {"ws_owner_subscribe"},
    _WATCH_CONFIG_MODULE.name: {"ws_watch_config_subscribe"},
    _PAIRING_MODULE.name: set(),
    _HTTP_ACTIONS_MODULE.name: set(),
    _PAGE_IMAGES_MODULE.name: set(),
    _CAMERA_FRAMING_MODULE.name: set(),
    _CLIENT_CERTIFICATE_MODULE.name: {
        "ws_client_certificate_status",
        "ws_client_certificate_put",
        "ws_client_certificate_delete",
    },
}


_MODULES = [
    _MODULE,
    _WATCH_CONFIG_MODULE,
    _PAIRING_MODULE,
    _HTTP_ACTIONS_MODULE,
    _PAGE_IMAGES_MODULE,
    _CAMERA_FRAMING_MODULE,
    _CLIENT_CERTIFICATE_MODULE,
]
# Per module: the commands it must define, and which of them skip the gate.
_EXPECTED = {
    _MODULE.name: (_ADMIN_ONLY | _NOT_ADMIN[_MODULE.name], _NOT_ADMIN[_MODULE.name]),
    _WATCH_CONFIG_MODULE.name: (
        _WATCH_CONFIG_ADMIN_ONLY | _NOT_ADMIN[_WATCH_CONFIG_MODULE.name],
        _NOT_ADMIN[_WATCH_CONFIG_MODULE.name],
    ),
    _PAIRING_MODULE.name: (_PAIRING_ADMIN_ONLY, _NOT_ADMIN[_PAIRING_MODULE.name]),
    _HTTP_ACTIONS_MODULE.name: (
        _HTTP_ACTIONS_ADMIN_ONLY,
        _NOT_ADMIN[_HTTP_ACTIONS_MODULE.name],
    ),
    _PAGE_IMAGES_MODULE.name: (
        _PAGE_IMAGES_ADMIN_ONLY,
        _NOT_ADMIN[_PAGE_IMAGES_MODULE.name],
    ),
    _CAMERA_FRAMING_MODULE.name: (
        _CAMERA_FRAMING_ADMIN_ONLY,
        _NOT_ADMIN[_CAMERA_FRAMING_MODULE.name],
    ),
    _CLIENT_CERTIFICATE_MODULE.name: (
        _NOT_ADMIN[_CLIENT_CERTIFICATE_MODULE.name],
        _NOT_ADMIN[_CLIENT_CERTIFICATE_MODULE.name],
    ),
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


def test_the_watch_config_live_capability_is_advertised() -> None:
    """The phone subscribes only when it sees the capability, so a command
    that is registered but never advertised is never used."""
    init = (_PKG / "__init__.py").read_text()
    const = (_PKG / "const.py").read_text()
    assert "register_capability(WATCH_CONFIG_LIVE_CAPABILITY)" in init
    assert 'WATCH_CONFIG_LIVE_CAPABILITY = "watch_config_live"' in const


def test_the_pairing_commands_and_view_are_registered_at_setup() -> None:
    """The panel's confirm and the watch's pair/start are useless apart."""
    source = (_PKG / "__init__.py").read_text()
    assert "async_register_pairing_commands(hass)" in source
    assert "register_view(WAPairStartView(hass))" in source


def test_the_watch_pairing_capability_is_advertised() -> None:
    """A watch with no iPhone offers to pair by code only when it sees this."""
    init = (_PKG / "__init__.py").read_text()
    const = (_PKG / "const.py").read_text()
    assert "register_capability(WATCH_PAIRING_CAPABILITY)" in init
    assert 'WATCH_PAIRING_CAPABILITY = "watch_pairing"' in const


def test_the_http_actions_commands_are_registered_at_setup() -> None:
    source = (_PKG / "__init__.py").read_text()
    assert "async_register_http_actions_commands(hass)" in source


def test_the_page_images_commands_are_registered_at_setup() -> None:
    source = (_PKG / "__init__.py").read_text()
    assert "async_register_page_images_commands(hass)" in source


def test_the_camera_framing_commands_are_registered_at_setup() -> None:
    source = (_PKG / "__init__.py").read_text()
    assert "async_register_camera_framing_commands(hass)" in source


def test_the_client_certificate_commands_are_registered_at_setup() -> None:
    source = (_PKG / "__init__.py").read_text()
    assert "async_register_client_certificate_commands(hass)" in source


def test_the_page_images_capability_is_advertised() -> None:
    """A watch fetches the photos its pages name, and a phone hands its own
    over, only when it sees this."""
    init = (_PKG / "__init__.py").read_text()
    const = (_PKG / "const.py").read_text()
    assert "register_capability(PAGE_IMAGES_CAPABILITY)" in init
    assert 'PAGE_IMAGES_CAPABILITY = "page_images"' in const


def test_the_http_actions_capability_is_advertised() -> None:
    """The phone hands its library over, and a watch runs actions through
    Home Assistant, only when it sees this."""
    init = (_PKG / "__init__.py").read_text()
    const = (_PKG / "const.py").read_text()
    assert "register_capability(HTTP_ACTIONS_CAPABILITY)" in init
    assert 'HTTP_ACTIONS_CAPABILITY = "http_actions"' in const
