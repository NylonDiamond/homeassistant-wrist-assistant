"""A map page for an iPhone, as the panel's Add page makes one.

A map page (app repo ``docs/home_map_plan_2026-10.md``, "Map page") is a
page with ``mapPage`` true that holds one Home map tile, ``home_map.<floor
id>``, across the grid's width at the top. The iPhone draws the whole page as
that floor's live 3D map; a watch draws the tile.

The signed ``home_map_page_add`` builds the page here, so the iPhone sends
only a floor. The page is the panel's ``homeMapPageDocument("iphone", ...)``
(``frontend/src/home-map/page-step.ts``) key for key: the keys below are the
fresh keys ``newWatchPage`` and ``newWatchHomeMapTile`` write, as data.
``tests/fixtures/home_map/map_page.json`` is written from the panel's own
function, and both test suites read it (``home-map-page-fixture.test.ts``,
``test_home_map_page_add.py``), so a change on either side fails a test.

Pure: no Home Assistant, no store.
"""

from __future__ import annotations

import copy
from typing import Any

# A Home map tile's entity id is this prefix and the floor's id.
HOME_MAP_ENTITY_PREFIX = "home_map."
# The page's name on a map of one floor (``homeMapPageName``).
MAP_PAGE_NAME = "Home map"

# Every key of a new map page but ``id``, ``name`` and ``items``.
_PAGE_KEYS: dict[str, Any] = {
    "backgroundBrightness": 0.6,
    "backgroundColor": "#000000",
    "complicationDisplayMode": "text",
    "fullScreen": False,
    "gridDensity": "standard",
    "groups": [],
    "hideFromSwitcher": False,
    "isDeletable": True,
    "isHidden": False,
    "isSystemPage": False,
    "mapPage": True,
    "pageTitleDisplayStyle": "none",
    "pageTitleIcon": "house",
    "pageTitleTextSize": "size10",
    "themeOverride": "neonLagoon",
    "useGradientColors": False,
}

# Every key of its Home map tile but ``id`` and ``entityId``: placed at the
# top left across the whole width, the kind's own height, icon and color.
_TILE_KEYS: dict[str, Any] = {
    "animationIntensity": 1,
    "animationSize": 1,
    "animationSpeed": 1,
    "backgroundPattern": "none",
    "borderActiveOnly": True,
    "borderAnimation": "none",
    "borderAnimationIntensity": 1,
    "borderAnimationSize": 1,
    "borderAnimationSpeed": 1,
    "borderGlow": 0,
    "borderLineStyle": "solid",
    "borderStyle": "none",
    "borderThickness": "extraThin",
    "cameraDisplayMode": "icon",
    "cameraFillOffsetX": 0,
    "cameraFillOffsetY": 0,
    "colSpan": 12,
    "color": "#FFB340",
    "colorOpacity": 1,
    "customLabel": "Home map",
    "effectActiveOnly": False,
    "gridCol": 0,
    "gridRow": 0,
    "icon": "house.fill",
    "iconShadow": False,
    "iconTapAnimation": "replace",
    "labelFontWeight": "light",
    "labelShadow": True,
    "multiCamBorderColor": "FFFFFF",
    "multiCamBorderEnabled": False,
    "multiCamBorderThickness": "thin",
    "overlayColor": "#FFFFFF",
    "overlayIntensity": 1,
    "overlaySize": 1,
    "overlaySpeed": 1,
    "overlayStyle": "none",
    "patternOpacity": 1,
    "rowSpan": 6,
    "showAlbumArt": True,
    "showLabel": True,
    "stateBarBorder": False,
    "stateBarColorStyle": "Tile",
    "stateBarShadow": False,
    "stateBarStyle": "Top",
    "stateValueLabelStyle": "Plain",
    "statusTextShadow": True,
    "tileAnimation": "none",
}


def home_map_entity_id(floor_id: str) -> str:
    """The entity id of a Home map tile on ``floor_id``."""
    return f"{HOME_MAP_ENTITY_PREFIX}{floor_id}"


def map_floor(doc: Any, floor_id: Any) -> dict[str, Any] | None:
    """The floor of the stored map whose id is ``floor_id``, case aside, as
    the panel compares map ids (``sameHomeMapId``). None with no map, no
    such floor, or an id that is not text."""
    if not isinstance(doc, dict) or not isinstance(floor_id, str) or not floor_id:
        return None
    want = floor_id.upper()
    for floor in doc.get("floors") or []:
        if isinstance(floor, dict) and str(floor.get("id", "")).upper() == want:
            return floor
    return None


def map_floor_name(floor: dict[str, Any]) -> str:
    """A floor's name, or "Floor N" for one with none (``homeMapFloorName``)."""
    name = str(floor.get("name") or "").strip()
    return name if name else f"Floor {int(floor.get('story') or 0) + 1}"


def map_page_name(doc: dict[str, Any], floor: dict[str, Any]) -> str:
    """The name of a new map page: Home map, or the floor's name on a map of
    several floors (``homeMapPageName``)."""
    return map_floor_name(floor) if len(doc.get("floors") or []) > 1 else MAP_PAGE_NAME


def new_map_page(page_id: str, name: str, floor_id: str, tile_id: str) -> dict[str, Any]:
    """A new map page showing ``floor_id``, with upper case ids as the panel
    writes them."""
    tile = {
        **copy.deepcopy(_TILE_KEYS),
        "entityId": home_map_entity_id(floor_id),
        "id": tile_id.upper(),
    }
    page = {
        **copy.deepcopy(_PAGE_KEYS),
        "id": page_id.upper(),
        "items": [tile],
        "name": name,
    }
    return {key: page[key] for key in sorted(page)}
