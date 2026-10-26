"""Offline tests for a tile's ``iconGlow`` on the server side: the glow
behind its icon, checked at the tile level of a panel save or a restore
(``_check_items`` and ``_check_icon_glow`` in watch_config_store.py) and
never on a device save.

Nothing here talks to a live Home Assistant.
"""

from __future__ import annotations

from typing import Any

import pytest
from test_watch_config_store import OWNER, _new, mod  # noqa: F401 (mod: fixture)

TILE = "1B6E1F4C-6E83-4B5E-9C5C-7F3A2D1E0A11"
PAGE = "6F1C2D0E-0000-4000-8000-000000000001"
GLOW_AT = f'document.pages[0] (id "{PAGE}").items[0].iconGlow'


def _tile(*, tile_id: str = TILE, **keys: Any) -> dict:
    tile: dict[str, Any] = {"id": tile_id, "entityId": "person.chen", "colSpan": 6, "rowSpan": 4}
    tile.update(keys)
    return tile


def _pages(*tiles: dict, page_id: str = PAGE) -> dict:
    return {"schemaVersion": 1, "pages": [{"id": page_id, "name": "Home", "items": list(tiles)}]}


def _glow_refusal(mod, glow: Any) -> str:  # noqa: F811
    with pytest.raises(mod.WatchConfigValidationError) as err:
        mod.validate_document("pages", _pages(_tile(iconGlow=glow)), check_items=True)
    return err.value.message


def test_a_valid_icon_glow_saves(mod) -> None:  # noqa: F811
    for glow in (
        {"mode": "on", "size": 180, "brightness": 150, "color": "tile"},
        {"mode": "off"},
        {"size": 12.5, "color": "#f2ae4e"},
        # Ranges and colour forms are the readers' to clamp and fall back.
        {"size": 900, "brightness": -3, "color": "red"},
        {},
    ):
        mod.validate_document("pages", _pages(_tile(iconGlow=glow)), check_items=True)


def test_a_null_icon_glow_is_no_setting(mod) -> None:  # noqa: F811
    mod.validate_document("pages", _pages(_tile(iconGlow=None)), check_items=True)


def test_a_bad_icon_glow_is_refused(mod) -> None:  # noqa: F811
    for glow in ("on", [1], 1, True):
        assert _glow_refusal(mod, glow) == f"{GLOW_AT} must be an object"
    for mode in ("ON", "", None, 1):
        assert _glow_refusal(mod, {"mode": mode}) == f'{GLOW_AT}.mode must be "auto", "on" or "off"'
    for key in ("size", "brightness"):
        for value in (True, "big", None, float("nan"), float("inf")):
            assert _glow_refusal(mod, {key: value}) == f"{GLOW_AT}.{key} must be a number"
    for color in (3, None, ["#FFFFFF"]):
        assert _glow_refusal(mod, {"color": color}) == f"{GLOW_AT}.color must be a string"


def test_the_refusal_names_the_tile_by_page_and_index(mod) -> None:  # noqa: F811
    document = _pages(_tile(tile_id="T0"), _tile(tile_id="T1", iconGlow={"mode": "bright"}))
    with pytest.raises(mod.WatchConfigValidationError) as err:
        mod.validate_document("pages", document, check_items=True)
    assert err.value.message == (
        f'document.pages[0] (id "{PAGE}").items[1].iconGlow.mode must be "auto", "on" or "off"'
    )


def test_a_device_save_with_a_bad_icon_glow_is_not_refused(mod) -> None:  # noqa: F811
    broken = _pages(_tile(iconGlow="bright"))
    assert mod.validate_document("pages", broken) > 0
    store = _new(mod)
    record = store.put(
        OWNER, "pages", broken, document_hash="a" * 64, base_revision=0, updated_by=OWNER
    )
    assert record.document == broken
    with pytest.raises(mod.WatchConfigValidationError):
        store.panel_save(OWNER, "pages", broken, base_revision=1)
