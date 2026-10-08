"""Static checks over the integration's WebSocket command table.

Needs no Home Assistant, so it runs alongside the other offline tests in
front of the live HTTP suite.

Two failures are worth catching before a deploy. A command that is defined
but never registered is invisible: the frontend and the test suite get
``unknown_command`` back with nothing in the log to explain it. And a command
whose gate slips (a lost ``require_admin``, a forgotten owner check) becomes
callable by the wrong signed-in user, which no test hitting a real box as an
administrator would notice.

The panel is open to every signed-in user (``complication_panel.py``), and
each command falls in exactly one of four groups (``panel_access.py``):

* ``_ADMIN``: keeps ``@websocket_api.require_admin``. Only the gallery key,
  which is about the home's public face rather than anyone's devices.
* ``_OWNER``: names one device (or two, for a move) and calls an owner
  check before it reads or writes: ``require_owner`` for the panel's
  commands, and ``may_follow_owner`` / ``_may_follow_owner`` for the
  phone's two live lines. A non-admin may name only their own device or the
  Library.
* ``_FILTERED``: answers about many owners and leaves out, for a
  non-admin, every owner they may not manage (``may_manage_owner``).
* ``_OPEN``: the home's shared libraries and the editor's renders, plus
  pairing and the client certificate, whose few admin-only parts are
  checked inside the command (pinned below).

Every set is spelled out rather than derived, so a new command nobody made a
gating decision about fails here instead of shipping open. And any command
whose schema names an owner must be owner scoped, so a new one that forgets
the check fails here too.

Seven modules hold commands: ``complication_ws.py`` (the editor),
``watch_config_ws.py`` (the Watch settings view and the page editor),
``pairing_ws.py`` (confirming a pairing code, and the QR offers),
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

_MODULES = [
    _MODULE,
    _WATCH_CONFIG_MODULE,
    _PAIRING_MODULE,
    _HTTP_ACTIONS_MODULE,
    _PAGE_IMAGES_MODULE,
    _CAMERA_FRAMING_MODULE,
    _CLIENT_CERTIFICATE_MODULE,
]

# The gallery key lets whoever holds it delete this home's gallery uploads.
_ADMIN = {
    _MODULE.name: {"ws_gallery_key"},
}

# Command -> the owner check it must call. Every one of them is refused for
# a device that is not the caller's.
_OWNER = {
    _MODULE.name: {
        "ws_forget_device": "require_owner",
        "ws_list": "require_owner",
        "ws_get": "require_owner",
        "ws_save": "require_owner",
        "ws_delete": "require_owner",
        "ws_subscribe": "require_owner",
        "ws_save_history": "require_owner",
        "ws_save_history_get": "require_owner",
        "ws_save_history_restore": "require_owner",
        "ws_watch_status": "require_owner",
        "ws_nudge": "require_owner",
        "ws_move_owner": "require_owner",
        "ws_preview_save": "require_owner",
        "ws_preview_get": "require_owner",
        # The iPhone app's live line: hands out nothing but a commit token.
        "ws_owner_subscribe": "may_follow_owner",
    },
    _WATCH_CONFIG_MODULE.name: {
        "ws_watch_config_get": "require_owner",
        "ws_watch_config_save": "require_owner",
        "ws_watch_config_history": "require_owner",
        "ws_watch_config_history_entry": "require_owner",
        "ws_watch_config_restore": "require_owner",
        "ws_watch_voices_get": "require_owner",
        # The iPhone app's live line: hands out nothing but revision numbers.
        "ws_watch_config_subscribe": "_may_follow_owner",
    },
}

# Answer about many owners; a non-admin hears only about their own.
_FILTERED = {
    _MODULE.name: {"ws_owners"},
    _WATCH_CONFIG_MODULE.name: {"ws_watch_config_summary"},
}

# Open to every signed-in user, each one a decision made on purpose:
# * Parts and the four renders the editor previews with are the home's.
# * The HTTP action library, the page photos and the camera framing are the
#   home's too. A camera test goes only to the caller's own devices.
# * Pairing: any user pairs their own devices, as /v2/register_secret has
#   always allowed. Pairing for someone else, taking over another user's
#   device, a Replace offer, and another user's offers are refused inside
#   (pinned in test_the_open_pairing_commands_keep_their_inner_checks).
# * The client certificate commands read and write the caller's own record;
#   naming another user is the admin-only part, checked in `_target_user`.
_OPEN = {
    _MODULE.name: {
        "ws_parts_list",
        "ws_parts_save",
        "ws_parts_delete",
        "ws_render_values",
        "ws_history_series",
        "ws_statistics_series",
        "ws_list_items",
    },
    _WATCH_CONFIG_MODULE.name: set(),
    _PAIRING_MODULE.name: {
        "ws_pair_lookup",
        "ws_pair_confirm",
        "ws_pair_offer",
        "ws_pair_offer_status",
        "ws_pair_offer_cancel",
    },
    _HTTP_ACTIONS_MODULE.name: {
        "ws_http_actions_get",
        "ws_http_actions_save",
        "ws_http_actions_test",
    },
    _PAGE_IMAGES_MODULE.name: {
        "ws_page_images_list",
        "ws_page_images_get",
        "ws_page_images_upload",
        "ws_page_images_delete",
    },
    _CAMERA_FRAMING_MODULE.name: {
        "ws_cameras_list",
        "ws_cameras_save",
        "ws_cameras_test",
    },
    _CLIENT_CERTIFICATE_MODULE.name: {
        "ws_client_certificate_status",
        "ws_client_certificate_put",
        "ws_client_certificate_delete",
    },
}

# Schema keys that name a device. A command whose schema has one must be in
# `_OWNER`.
_OWNER_KEYS = {
    "owner_watch_id",
    "owner_id",
    "watch_id",
    "source_owner_watch_id",
    "target_owner_watch_id",
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
    checked for registration nor for its gate.
    """
    return [
        node
        for node in ast.walk(tree)
        if isinstance(node, _Func) and "websocket_command" in _decorator_names(node)
    ]


def _command(module: Path, name: str) -> ast.FunctionDef | ast.AsyncFunctionDef:
    [node] = [n for n in _command_functions(_tree(module)) if n.name == name]
    return node


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


def _called(node: ast.AST) -> set[str]:
    """Plain names called anywhere in ``node``."""
    return {
        call.func.id
        for call in ast.walk(node)
        if isinstance(call, ast.Call) and isinstance(call.func, ast.Name)
    }


def _schema_keys(node: ast.FunctionDef | ast.AsyncFunctionDef) -> set[str]:
    """The top-level keys of a command's ``websocket_command`` schema."""
    for dec in node.decorator_list:
        if not isinstance(dec, ast.Call):
            continue
        target = dec.func
        if not (isinstance(target, ast.Attribute) and target.attr == "websocket_command"):
            continue
        [schema] = dec.args
        assert isinstance(schema, ast.Dict)
        keys: set[str] = set()
        for key in schema.keys:
            if (
                isinstance(key, ast.Call)
                and key.args
                and isinstance(key.args[0], ast.Constant)
                and isinstance(key.args[0].value, str)
            ):
                keys.add(key.args[0].value)
        return keys
    raise AssertionError(f"{node.name} has no websocket_command schema")


def _groups(module: Path) -> tuple[set[str], set[str], set[str], set[str]]:
    name = module.name
    return (
        _ADMIN.get(name, set()),
        set(_OWNER.get(name, {})),
        _FILTERED.get(name, set()),
        _OPEN.get(name, set()),
    )


@pytest.mark.parametrize("module", _MODULES, ids=[m.name for m in _MODULES])
def test_every_command_is_registered(module: Path) -> None:
    tree = _tree(module)
    defined = {node.name for node in _command_functions(tree)}
    missing = sorted(defined - _registered_names(tree))
    assert not missing, (
        "defined but never passed to async_register_command: " + ", ".join(missing)
    )


@pytest.mark.parametrize("module", _MODULES, ids=[m.name for m in _MODULES])
def test_every_command_has_exactly_one_gating_decision(module: Path) -> None:
    """Guards the sets above against a rename that would silently empty
    them, and against a new command nobody made a gating decision about."""
    admin, owner, filtered, open_ = _groups(module)
    groups = [admin, owner, filtered, open_]
    for i, group in enumerate(groups):
        for other in groups[i + 1 :]:
            assert not group & other, sorted(group & other)
    defined = {node.name for node in _command_functions(_tree(module))}
    expected = admin | owner | filtered | open_
    assert defined == expected, sorted(defined ^ expected)


@pytest.mark.parametrize("module", _MODULES, ids=[m.name for m in _MODULES])
def test_only_the_admin_commands_require_admin(module: Path) -> None:
    admin, _owner, _filtered, _open = _groups(module)
    gated = {
        node.name
        for node in _command_functions(_tree(module))
        if "require_admin" in _decorator_names(node)
    }
    assert gated == admin, sorted(gated ^ admin)


@pytest.mark.parametrize(
    ("module", "command", "check"),
    [
        (module, command, check)
        for module in _MODULES
        for command, check in _OWNER.get(module.name, {}).items()
    ],
)
def test_each_owner_scoped_command_checks_whose_device_it_is(
    module: Path, command: str, check: str
) -> None:
    """Open to non-admins, so each must ask whether the owner it names is
    the caller's before it reads or writes. The in-process tests run the
    rule itself (test_panel_access.py)."""
    assert check in _called(_command(module, command))


def test_a_move_checks_both_of_its_owners() -> None:
    """A move takes designs off one device and puts them on another; a
    non-admin must own both, or they could empty someone else's watch."""
    node = _command(_MODULE, "ws_move_owner")
    [call] = [
        c
        for c in ast.walk(node)
        if isinstance(c, ast.Call) and isinstance(c.func, ast.Name) and c.func.id == "require_owner"
    ]
    named = {
        arg.slice.value
        for arg in call.args
        if isinstance(arg, ast.Subscript) and isinstance(arg.slice, ast.Constant)
    }
    assert named == {"source_owner_watch_id", "target_owner_watch_id"}


@pytest.mark.parametrize(
    ("module", "command"),
    [(module, command) for module in _MODULES for command in _FILTERED.get(module.name, set())],
)
def test_each_filtered_command_leaves_out_what_the_caller_may_not_manage(
    module: Path, command: str
) -> None:
    called = _called(_command(module, command))
    assert {"is_admin", "may_manage_owner"} <= called


@pytest.mark.parametrize("module", _MODULES, ids=[m.name for m in _MODULES])
def test_every_command_that_names_a_device_is_owner_scoped(module: Path) -> None:
    """A new command whose schema names an owner must make the owner check,
    or it would hand any signed-in user another person's device."""
    owner = set(_OWNER.get(module.name, {}))
    offenders = sorted(
        node.name
        for node in _command_functions(_tree(module))
        if _schema_keys(node) & _OWNER_KEYS and node.name not in owner
    )
    assert not offenders, "names a device without an owner check: " + ", ".join(offenders)


@pytest.mark.parametrize(
    ("command", "check"),
    [
        ("ws_pair_confirm", "_pick_user"),
        ("ws_pair_offer", "_pick_user"),
        ("ws_pair_offer_status", "_may_see_offer"),
        ("ws_pair_offer_cancel", "_may_see_offer"),
    ],
)
def test_the_open_pairing_commands_keep_their_inner_checks(command: str, check: str) -> None:
    """Open to every signed-in user, so the admin-only parts live inside:
    pairing for another user, and another user's QR offers. Run in
    test_pairing_ws.py and test_panel_access.py."""
    assert check in _called(_command(_PAIRING_MODULE, command))


def test_a_replace_offer_is_admin_only() -> None:
    """Replace lets whichever phone redeems the code take over an id bound
    to someone else, so the offer must look at whether the caller is an
    admin before it makes one."""
    source = ast.unparse(_command(_PAIRING_MODULE, "ws_pair_offer"))
    assert "msg.get('replace') is True and (not (user is not None and user.is_admin))" in source


@pytest.mark.parametrize(
    "command",
    sorted(_OPEN[_CLIENT_CERTIFICATE_MODULE.name]),
)
def test_the_client_certificate_commands_resolve_their_user(command: str) -> None:
    """Each goes through ``_gate``, which asks ``_target_user`` whose
    certificate it is: the caller's, or another user's for an admin only."""
    assert "_gate" in _called(_command(_CLIENT_CERTIFICATE_MODULE, command))
    [gate] = [
        node
        for node in _tree(_CLIENT_CERTIFICATE_MODULE).body
        if isinstance(node, _Func) and node.name == "_gate"
    ]
    assert "_target_user" in _called(gate)


def test_the_panel_is_open_to_every_signed_in_user() -> None:
    """The sidebar entry itself; what each command allows is decided above."""
    source = (_PKG / "complication_panel.py").read_text()
    assert "require_admin=False," in source
    assert "require_admin=True" not in source


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


def test_the_sealed_pairing_and_redeem_views_are_registered_at_setup() -> None:
    """A sealed code pairing is useless without the status view, and a QR
    offer without the redeem view."""
    source = (_PKG / "__init__.py").read_text()
    assert "register_view(WAPairStatusView(hass))" in source
    assert "register_view(WAPairRedeemView(hass))" in source
    assert "pair_offer_store=pair_offer_store," in source
    assert "pair_offer_store.shutdown()" in source


def test_the_sealed_and_phone_pairing_capabilities_are_advertised() -> None:
    """A device sends its public key, and the app pairs an iPhone with no
    token, only when /version lists these."""
    init = (_PKG / "__init__.py").read_text()
    const = (_PKG / "const.py").read_text()
    assert "register_capability(SEALED_CODE_PAIRING_CAPABILITY)" in init
    assert "register_capability(PHONE_PAIRING_CAPABILITY)" in init
    assert 'SEALED_CODE_PAIRING_CAPABILITY = "sealed_code_pairing"' in const
    assert 'PHONE_PAIRING_CAPABILITY = "phone_pairing"' in const


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
