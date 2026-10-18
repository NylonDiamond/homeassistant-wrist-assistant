"""The iPhone only tile kinds and keys in const.py against the panel's table.

The panel's device table (frontend/src/watch-pages/tile-devices.json) says
which device draws each tile kind and which tile keys only the iPhone reads.
The runtime does not ship frontend/src, so const.py carries the iPhone only
entries as PHONE_ONLY_TILE_KINDS and PHONE_ONLY_TILE_KEYS. This keeps the two
equal, in both directions. The server strips nothing with them (app repo
docs/phone_native_pages_plan_2026-10.md, decision 2).

Read out of the source with ``ast``, the way test_phone_behavior_keys.py
reads the phone's settings: const.py cannot be imported without Home
Assistant.
"""

from __future__ import annotations

import ast
import json
from pathlib import Path

_ROOT = Path(__file__).resolve().parents[1]
_CONST = _ROOT / "custom_components" / "wrist_assistant" / "const.py"
_TABLE = _ROOT / "frontend" / "src" / "watch-pages" / "tile-devices.json"

_BOTH = ["watch", "iphone"]
_PHONE = ["iphone"]


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


def _table() -> dict:
    return json.loads(_TABLE.read_text())


def _phone_only(entries: dict[str, list[str]]) -> frozenset[str]:
    return frozenset(name for name, devices in entries.items() if devices == _PHONE)


def test_every_entry_is_both_devices_or_the_iphone_only() -> None:
    table = _table()
    assert table["version"] == 1
    for section in ("kinds", "keys"):
        for name, devices in table[section].items():
            assert devices in (_BOTH, _PHONE), f"{section}.{name}: {devices}"


def test_phone_only_tile_kinds_match_the_table() -> None:
    table_kinds = _phone_only(_table()["kinds"])
    const_kinds = _const_set("PHONE_ONLY_TILE_KINDS")
    assert table_kinds == const_kinds, (
        f"only in tile-devices.json: {sorted(table_kinds - const_kinds)}, "
        f"only in const.py: {sorted(const_kinds - table_kinds)}"
    )
    assert const_kinds == {"map", "chart", "text_field", "web"}


def test_phone_only_tile_keys_match_the_table() -> None:
    table_keys = _phone_only(_table()["keys"])
    const_keys = _const_set("PHONE_ONLY_TILE_KEYS")
    assert table_keys == const_keys, (
        f"only in tile-devices.json: {sorted(table_keys - const_keys)}, "
        f"only in const.py: {sorted(const_keys - table_keys)}"
    )
    # Every key the table lists is iPhone only: nothing is watch only, and a
    # key both devices read is simply not listed.
    assert table_keys == frozenset(_table()["keys"])
