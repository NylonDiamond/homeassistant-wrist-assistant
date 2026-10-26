"""Offline tests for a tile's ``arrange`` (Arrangement) on the server side:
where the tile's own parts sit when it is set to Free, checked at the tile
level of a panel save or a restore (``_check_items`` and ``_check_arrange``
in watch_config_store.py) and never on a device save.

Nothing here talks to a live Home Assistant.
"""

from __future__ import annotations

import copy
from typing import Any

import pytest
from test_watch_config_store import OWNER, _new, mod  # noqa: F401 (mod: fixture)

TILE = "1B6E1F4C-6E83-4B5E-9C5C-7F3A2D1E0A11"
PAGE = "6F1C2D0E-0000-4000-8000-000000000001"
AT = f'document.pages[0] (id "{PAGE}").items[0].arrange'
SPOTS = ("tl", "tc", "tr", "ml", "mc", "mr", "bl", "bc", "br")

FULL = {
    "v": 1,
    "parts": {
        "icon": {"spot": "tr", "dx": 0, "dy": 0, "scale": 1.2, "hidden": False},
        "name": {"spot": "bl"},
        "state": {"hidden": True},
    },
}


def _tile(*, tile_id: str = TILE, **keys: Any) -> dict:
    tile: dict[str, Any] = {"id": tile_id, "entityId": "person.chen", "colSpan": 6, "rowSpan": 4}
    tile.update(keys)
    return tile


def _pages(*tiles: dict, page_id: str = PAGE) -> dict:
    return {"schemaVersion": 1, "pages": [{"id": page_id, "name": "Home", "items": list(tiles)}]}


def _ok(mod, arrange: Any) -> None:  # noqa: F811
    mod.validate_document("pages", _pages(_tile(arrange=arrange)), check_items=True)


def _refusal(mod, arrange: Any) -> str:  # noqa: F811
    with pytest.raises(mod.WatchConfigValidationError) as err:
        mod.validate_document("pages", _pages(_tile(arrange=arrange)), check_items=True)
    return err.value.message


def _part(**keys: Any) -> dict:
    return {"v": 1, "parts": {"icon": keys}}


# ── Valid ────────────────────────────────────────────────────────────────


def test_a_full_arrangement_saves_as_sent(mod) -> None:  # noqa: F811
    _ok(mod, FULL)
    store = _new(mod)
    store.put(OWNER, "pages", _pages(_tile()), document_hash="a" * 64, base_revision=0, updated_by=OWNER)
    record = store.panel_save(OWNER, "pages", _pages(_tile(arrange=copy.deepcopy(FULL))), base_revision=1)
    assert record.document["pages"][0]["items"][0]["arrange"] == FULL


def test_a_minimal_arrangement_saves(mod) -> None:  # noqa: F811
    for arrange in (
        {"v": 1},
        {"v": 1, "parts": {}},
        {"v": 1, "parts": {"name": {}}},
        {"v": 1, "parts": {"state": {"hidden": True}}},
    ):
        _ok(mod, arrange)


def test_absent_or_null_is_default(mod) -> None:  # noqa: F811
    mod.validate_document("pages", _pages(_tile()), check_items=True)
    _ok(mod, None)


def test_every_spot_and_the_ends_of_each_range_save(mod) -> None:  # noqa: F811
    for spot in SPOTS:
        _ok(mod, _part(spot=spot))
    for value in (-0.5, 0.5, 0, 0.25, -1 / 3):
        _ok(mod, _part(dx=value, dy=value))
    for value in (0.8, 1, 1.5, 1.25):
        _ok(mod, _part(scale=value))
    for value in (True, False):
        _ok(mod, _part(hidden=value))


# ── Refused ──────────────────────────────────────────────────────────────


def test_an_arrangement_that_is_not_an_object_is_refused(mod) -> None:  # noqa: F811
    for arrange in ("free", [1], 1, True):
        assert _refusal(mod, arrange) == f"{AT} must be an object"


@pytest.mark.parametrize("version", ["missing", 0, 2, "1", 1.0, 1.5, True, None])
def test_another_version_is_refused(mod, version) -> None:  # noqa: F811
    arrange: dict[str, Any] = {"parts": {}}
    if version != "missing":
        arrange["v"] = version
    assert _refusal(mod, arrange) == f"{AT}.v must be 1"


def test_an_unknown_top_level_key_is_refused(mod) -> None:  # noqa: F811
    assert _refusal(mod, {"v": 1, "parts": {}, "mode": "free"}) == f'{AT} has the unknown key "mode"'


def test_parts_that_are_not_an_object_are_refused(mod) -> None:  # noqa: F811
    for parts in ([], "icon", None, 3):
        assert _refusal(mod, {"v": 1, "parts": parts}) == f"{AT}.parts must be an object"


def test_an_unknown_part_is_refused(mod) -> None:  # noqa: F811
    for name in ("glow", "photo", "Icon", ""):
        assert _refusal(mod, {"v": 1, "parts": {"icon": {}, name: {}}}) == (
            f'{AT}.parts has the unknown part "{name}"; the parts are icon, name and state'
        )


def test_a_part_that_is_not_an_object_is_refused(mod) -> None:  # noqa: F811
    for part in (None, "tr", [], 1, True):
        assert _refusal(mod, {"v": 1, "parts": {"name": part}}) == f"{AT}.parts.name must be an object"


def test_an_unknown_part_key_is_refused(mod) -> None:  # noqa: F811
    for key in ("x", "size", "color", "align"):
        assert _refusal(mod, _part(**{key: 1})) == f'{AT}.parts.icon has the unknown key "{key}"'


def test_a_bad_spot_is_refused(mod) -> None:  # noqa: F811
    message = f"{AT}.parts.icon.spot must be one of tl, tc, tr, ml, mc, mr, bl, bc, br"
    for spot in ("TR", "top", "", None, 1, ["tr"]):
        assert _refusal(mod, _part(spot=spot)) == message


@pytest.mark.parametrize("key", ["dx", "dy"])
def test_a_bad_offset_is_refused(mod, key) -> None:  # noqa: F811
    message = f"{AT}.parts.icon.{key} must be a number from -0.5 to 0.5"
    for value in (0.51, -0.5000001, 1, -1, True, False, "0.1", None, float("nan"), float("inf"), float("-inf")):
        assert _refusal(mod, _part(**{key: value})) == message


def test_a_bad_scale_is_refused(mod) -> None:  # noqa: F811
    message = f"{AT}.parts.icon.scale must be a number from 0.8 to 1.5"
    for value in (0.79, 1.51, 0, 2, True, "1.2", None, float("nan"), float("inf")):
        assert _refusal(mod, _part(scale=value)) == message


def test_a_bad_hidden_is_refused(mod) -> None:  # noqa: F811
    message = f"{AT}.parts.icon.hidden must be true or false"
    for value in (0, 1, "true", None, [True]):
        assert _refusal(mod, _part(hidden=value)) == message


def test_the_refusal_names_the_tile_and_the_part(mod) -> None:  # noqa: F811
    good = _tile(tile_id="T0", arrange=FULL)
    bad = _tile(tile_id="T1", arrange={"v": 1, "parts": {"state": {"scale": 3}}})
    with pytest.raises(mod.WatchConfigValidationError) as err:
        mod.validate_document("pages", _pages(good, bad), check_items=True)
    assert err.value.message == (
        f'document.pages[0] (id "{PAGE}").items[1].arrange.parts.state.scale must be a number from 0.8 to 1.5'
    )


def test_a_device_save_skips_the_arrangement_guard(mod) -> None:  # noqa: F811
    broken = _pages(_tile(arrange={"v": 9, "parts": {"glow": 1}}))
    assert mod.validate_document("pages", broken) > 0
    store = _new(mod)
    record = store.put(
        OWNER, "pages", broken, document_hash="a" * 64, base_revision=0, updated_by=OWNER
    )
    assert record.document == broken
    # The panel saving the same is refused, and the record is left alone.
    with pytest.raises(mod.WatchConfigValidationError):
        store.panel_save(OWNER, "pages", broken, base_revision=1)
    assert store.get(OWNER, "pages").revision == 1
