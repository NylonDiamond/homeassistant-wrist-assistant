"""The iPhone's settings list in const.py against the panel's catalog.

An iPhone owns a `behavior` record of its own (phone pages, app repo
docs/phone_pages_mvp_2026-10.md), and the integration keeps only the phone's
settings on it. The panel's catalog (frontend/src/watch-settings-catalog.json)
says which those are with a `devices` field on every setting; the runtime does
not ship frontend/src, so const.py carries the same list as
PHONE_BEHAVIOR_KEYS. This keeps the two equal, and keeps the keys the app
needs to decode a document (PHONE_BEHAVIOR_DECODE_KEYS) equal to what the
panel writes beside the catalog's rows.

Read out of the source with ``ast``, the way test_watch_config_store.py
reads the kinds: const.py cannot be imported without Home Assistant.
"""

from __future__ import annotations

import ast
import json
import re
from pathlib import Path

_ROOT = Path(__file__).resolve().parents[1]
_CONST = _ROOT / "custom_components" / "wrist_assistant" / "const.py"
_CATALOG = _ROOT / "frontend" / "src" / "watch-settings-catalog.json"
_SETTINGS_TS = _ROOT / "frontend" / "src" / "watch-settings.ts"


def _const_set(name: str) -> frozenset[str]:
    tree = ast.parse(_CONST.read_text())
    for node in tree.body:
        if (
            isinstance(node, ast.Assign)
            and len(node.targets) == 1
            and isinstance(node.targets[0], ast.Name)
            and node.targets[0].id == name
        ):
            # frozenset({...}): the set literal is the call's one argument.
            return frozenset(ast.literal_eval(node.value.args[0]))
    raise AssertionError(f"{name} is not in const.py")


def _catalog_settings() -> list[dict]:
    catalog = json.loads(_CATALOG.read_text())
    return [setting for section in catalog["sections"] for setting in section["settings"]]


def _document_keys(setting: dict) -> set[str]:
    """The behavior keys one catalog row writes: its own, and for the wrist
    twists' row the two target keys beside it."""
    keys = {setting["key"]}
    for extra in ("sceneKey", "scriptKey"):
        if extra in setting:
            keys.add(setting[extra])
    return keys


IPHONE_BEFORE_ANDROID = {
    "phonePageLook",
    "topSectionDoubleTapAction",
    "topSectionDoubleTapSceneTargetId",
    "topSectionDoubleTapScriptTargetId",
}


def test_every_catalog_setting_says_which_devices_read_it() -> None:
    settings = _catalog_settings()
    assert len(settings) == 46
    for setting in settings:
        assert setting.get("devices") in (
            ["watch"],
            ["watch", "iphone"],
            ["iphone"],
            # The same rows read by the Android apps too: a Wear OS watch reads
            # a watch row (`wearos`), an Android phone an iPhone row (`android`).
            ["watch", "wearos"],
            ["watch", "iphone", "wearos", "android"],
            # The title double-tap reached the iPhone (2026-11-26) before
            # the Android phone app.
            ["watch", "iphone", "wearos"],
        ), setting["key"]
        devices = setting["devices"]
        # An Android phone reads every iPhone row but the Page look, which
        # it draws one way only, and the title double-tap, not in it yet.
        if setting["key"] not in IPHONE_BEFORE_ANDROID:
            assert ("android" in devices) == ("iphone" in devices), setting["key"]


def test_a_wear_watch_reads_every_watch_row_but_the_double_pinch() -> None:
    """Wear OS has no double pinch; every other watch row applies there, the
    crown's to the rotary input."""
    left_out = [
        s["key"]
        for s in _catalog_settings()
        if "watch" in s["devices"] and "wearos" not in s["devices"]
    ]
    assert left_out == ["handGestureAction", "handGestureSceneTargetId", "handGestureScriptTargetId"]


def test_only_the_page_look_is_an_iphone_only_setting() -> None:
    """``phonePageLook`` is the one row only the iPhone reads: how it draws
    its pages, like an iPhone app (the default) or like a big watch."""
    iphone_only = [s for s in _catalog_settings() if s["devices"] == ["iphone"]]
    assert [s["key"] for s in iphone_only] == ["phonePageLook"]
    look = iphone_only[0]
    assert look["type"] == "enum"
    assert look["default"] == "iphone"
    assert [o["value"] for o in look["options"]] == ["iphone", "watch"]


def test_the_phone_keys_are_the_catalog_s_iphone_keys() -> None:
    from_catalog: set[str] = set()
    for setting in _catalog_settings():
        if "iphone" in setting["devices"]:
            from_catalog |= _document_keys(setting)
    assert _const_set("PHONE_BEHAVIOR_KEYS") == from_catalog
    assert len(from_catalog) == 35


def test_no_watch_only_key_is_a_phone_key() -> None:
    watch_only: set[str] = set()
    for setting in _catalog_settings():
        if "iphone" not in setting["devices"]:
            watch_only |= _document_keys(setting)
    assert not watch_only & _const_set("PHONE_BEHAVIOR_KEYS")
    assert {
        "serverMode",
        "deltaTimeout",
        "handGestureAction",
        "sliderCrownSensitivity",
        "bottomEdgePageSwipeSensitivity",
        "motionGestureActionsJSON",
    } <= watch_only


def test_the_decode_keys_are_what_the_panel_writes_beside_the_rows() -> None:
    """``schemaVersion`` and the panel's BEHAVIOR_APP_DEFAULTS, the keys the
    app's decoder needs that have no row. None of them is a catalog key."""
    source = _SETTINGS_TS.read_text()
    block = re.search(
        r"const BEHAVIOR_APP_DEFAULTS[^=]*=\s*\{(?P<body>[^}]*)\}", source
    )
    assert block is not None, "BEHAVIOR_APP_DEFAULTS is not in watch-settings.ts"
    app_defaults = set(re.findall(r"^\s*(\w+):", block["body"], re.MULTILINE))
    decode = _const_set("PHONE_BEHAVIOR_DECODE_KEYS")
    assert decode == app_defaults | {"schemaVersion"}
    catalog_keys = {setting["key"] for setting in _catalog_settings()}
    assert not decode & catalog_keys
