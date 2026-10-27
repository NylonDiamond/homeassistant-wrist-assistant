"""Offline tests for a tile's ``iconPhotoId`` on the server side: the photo
drawn in place of its icon (app repo docs/photo_tiles_plan_2026-10.md, "Tile
key"), checked at the tile level of a panel save or a restore
(``_check_items`` and ``_check_icon_photo`` in watch_config_store.py) and
never on a device save.

Nothing here talks to a live Home Assistant.
"""

from __future__ import annotations

import copy
from typing import Any

import pytest
from test_watch_config_store import OWNER, _new, mod  # noqa: F401 (mod: fixture)

TILE = "1B6E1F4C-6E83-4B5E-9C5C-7F3A2D1E0A11"
PAGE = "6F1C2D0E-0000-4000-8000-000000000001"
PHOTO = "A1B2C3D4-E5F6-4A7B-8C9D-0E1F2A3B4C5D"
AT = f'document.pages[0] (id "{PAGE}").items[0].iconPhotoId'


def _tile(*, tile_id: str = TILE, **keys: Any) -> dict:
    tile: dict[str, Any] = {"id": tile_id, "entityId": "light.desk_lamp", "icon": "lamp.desk"}
    tile.update(keys)
    return tile


def _pages(*tiles: dict, page_id: str = PAGE) -> dict:
    return {"schemaVersion": 1, "pages": [{"id": page_id, "name": "Home", "items": list(tiles)}]}


def _refusal(mod, photo_id: Any) -> str:  # noqa: F811
    with pytest.raises(mod.WatchConfigValidationError) as err:
        mod.validate_document("pages", _pages(_tile(iconPhotoId=photo_id)), check_items=True)
    return err.value.message


def test_a_photo_id_in_any_case_saves_as_sent(mod) -> None:  # noqa: F811
    for photo_id in (PHOTO, PHOTO.lower(), "a1B2c3D4-e5F6-4a7B-8c9D-0e1F2a3B4c5D"):
        mod.validate_document("pages", _pages(_tile(iconPhotoId=photo_id)), check_items=True)
    store = _new(mod)
    store.put(OWNER, "pages", _pages(_tile()), document_hash="a" * 64, base_revision=0, updated_by=OWNER)
    sent = _pages(_tile(iconPhotoId=PHOTO.lower()))
    record = store.panel_save(OWNER, "pages", copy.deepcopy(sent), base_revision=1)
    assert record.document["pages"][0]["items"][0]["iconPhotoId"] == PHOTO.lower()
    # The tile keeps its icon beside the photo.
    assert record.document["pages"][0]["items"][0]["icon"] == "lamp.desk"


def test_absent_or_null_is_no_photo(mod) -> None:  # noqa: F811
    mod.validate_document("pages", _pages(_tile()), check_items=True)
    mod.validate_document("pages", _pages(_tile(iconPhotoId=None)), check_items=True)


@pytest.mark.parametrize(
    "photo_id",
    [
        "",
        "preset_waves",
        "lamp",
        PHOTO.replace("-", ""),
        "{" + PHOTO + "}",
        PHOTO + " ",
        PHOTO[:-1],
        PHOTO[:-1] + "G",
        "../" + PHOTO,
        7,
        True,
        [PHOTO],
        {"id": PHOTO},
    ],
)
def test_anything_but_a_uuid_is_refused(mod, photo_id) -> None:  # noqa: F811
    assert _refusal(mod, photo_id) == f"{AT} must be a photo's UUID"


def test_the_refusal_names_the_tile(mod) -> None:  # noqa: F811
    good = _tile(tile_id="T0", iconPhotoId=PHOTO)
    bad = _tile(tile_id="T1", iconPhotoId="not-a-photo")
    with pytest.raises(mod.WatchConfigValidationError) as err:
        mod.validate_document("pages", _pages(good, bad), check_items=True)
    assert err.value.message == f'document.pages[0] (id "{PAGE}").items[1].iconPhotoId must be a photo\'s UUID'


def test_a_device_save_skips_the_photo_guard(mod) -> None:  # noqa: F811
    broken = _pages(_tile(iconPhotoId="not-a-photo"))
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
