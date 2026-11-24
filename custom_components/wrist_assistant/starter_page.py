"""The starter page a new iPhone gets, as the panel would build it.

Magic setup (app repo ``docs/magic_setup_2026-11.md``): right after a new
iPhone pairs, the signed ``starter_page_make`` makes one page of the home's
main devices, so the first thing the person sees is their own home. The page
is built here, so the iPhone sends nothing but its ask.

Which entities: the home map's waiting rule (the panel's
``frontend/src/home-map/waiting.ts``): an entity of a main domain
(:data:`MAIN_DOMAINS`) with no entity category, not hidden and not disabled.
Areas go in floor order (the order ``home_areas.floors_from_registry`` gives:
level, no level last, then name), areas on no floor after them, each floor's
areas by name; entities with no area come last. Inside one area the main
domain order, then the name ignoring case, then the id
(``homeMapWaitOrder``). A first pass takes at most :data:`FIRST_PASS_PER_AREA`
of each area, a second pass fills from the rest in the same order, up to
:data:`MAX_TILES`. A home with fewer than two main entities also takes the
switch domains (:data:`SWITCH_DOMAINS`) the same way, after the main ones. The
page lists the picked entities area by area, in that order.

Each tile is the panel's ``newWatchEntityTile`` key for key: the fresh tile
keys (``page-keys.json``), the entity's icon and color from the domain's row
of ``tile-defaults.json`` in the page's ``neonLagoon`` theme (a TV
``media_player`` with no ``remote.`` of the same object id takes the remote
look, and its Apple icon when the id says "apple"), and the label of
``watchEntityLabel``. Two per row, 6 by 4: (0, 0), (6, 0), (0, 4), (6, 4)...
The page is the panel's ``newWatchPage`` named "Home". The keys below are
that data, written out. ``tests/fixtures/starter_page/starter_page.json`` is
written from the panel's own functions, and both test suites read it
(``starter-page-fixture.test.ts``, ``test_starter_page.py``), so a change on
either side fails a test.

Pure: no Home Assistant, no store.
"""

from __future__ import annotations

import copy
import unicodedata
from collections.abc import Collection, Iterable, Mapping
from typing import Any

STARTER_PAGE_NAME = "Home"

# The main devices' domains, in the order an area lists them
# (``HOME_MAP_MAIN_DOMAINS``).
MAIN_DOMAINS: tuple[str, ...] = (
    "light",
    "cover",
    "fan",
    "climate",
    "media_player",
    "lock",
    "vacuum",
    "humidifier",
    "water_heater",
    "alarm_control_panel",
    "valve",
)
# Taken too in a home with fewer than :data:`SMALL_HOME_BELOW` main entities,
# after the main ones.
SWITCH_DOMAINS: tuple[str, ...] = ("switch", "input_boolean")
SMALL_HOME_BELOW = 2
FIRST_PASS_PER_AREA = 3
MAX_TILES = 12

# A tile's size and the grid's width.
_TILE_COLS = 6
_TILE_ROWS = 4
_GRID_COLUMNS = 12

# Every key of a new page but ``id``, ``name`` and ``items``
# (``newWatchPage``).
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
    "pageTitleDisplayStyle": "none",
    "pageTitleIcon": "house",
    "pageTitleTextSize": "size10",
    "themeOverride": "neonLagoon",
    "useGradientColors": False,
}

# Every fresh key of a new tile (``freshTile``) but ``id``, ``entityId``, the
# place and the size.
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
    "colorOpacity": 1,
    "effectActiveOnly": False,
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

# The ``neonLagoon`` theme's role colors the looks below read.
_NEON_LAGOON: dict[str, str] = {
    "entityClimate": "#EC368D",
    "entityCover": "#6D64FF",
    "entityFan": "#47C4FF",
    "entityLight": "#FFC145",
    "entityLock": "#FF9E4D",
    "entityMediaPlayer": "#D057D9",
    "entityRemote": "#8A6FE8",
    "entitySensor": "#9EC2E8",
    "entitySwitch": "#02C3BD",
    "entityVacuum": "#2CCEA2",
}

# Each domain's icon and role (``tile-defaults.json`` ``domains``).
_LOOKS: dict[str, tuple[str, str]] = {
    "alarm_control_panel": ("shield", "entityLock"),
    "climate": ("thermometer", "entityClimate"),
    "cover": ("blinds.horizontal.closed", "entityCover"),
    "fan": ("fan", "entityFan"),
    "humidifier": ("humidity", "entitySensor"),
    "input_boolean": ("togglepower", "entitySwitch"),
    "light": ("lightbulb", "entityLight"),
    "lock": ("lock", "entityLock"),
    "media_player": ("play.circle", "entityMediaPlayer"),
    "switch": ("switch.2", "entitySwitch"),
    "vacuum": ("hurricane", "entityVacuum"),
    "valve": ("drop.circle", "entityCover"),
    "water_heater": ("drop.degreesign", "entitySensor"),
}
# A TV ``media_player``'s look (its ``tvRemote`` row), and its icon when the
# entity id holds "apple" in any case.
_TV_REMOTE_LOOK: tuple[str, str] = ("av.remote", "entityRemote")
_TV_REMOTE_APPLE_ICON = "appletv"

# Letters with a title case form of their own (the Latin digraphs).
_TITLE_CASE: dict[str, str] = {
    "Ǆ": "ǅ",
    "ǅ": "ǅ",
    "ǆ": "ǅ",
    "Ǉ": "ǈ",
    "ǈ": "ǈ",
    "ǉ": "ǈ",
    "Ǌ": "ǋ",
    "ǋ": "ǋ",
    "ǌ": "ǋ",
    "Ǳ": "ǲ",
    "ǲ": "ǲ",
    "ǳ": "ǲ",
}


def _domain(entity_id: str) -> str:
    """The text before the first dot (``tileKind``)."""
    return entity_id.split(".", 1)[0]


def _object_id(entity_id: str) -> str:
    """The text after the first dot, or "" (``tileTarget``)."""
    return entity_id.split(".", 1)[1] if "." in entity_id else ""


def _title_case(ch: str) -> str:
    if ch in _TITLE_CASE:
        return _TITLE_CASE[ch]
    upper = ch.upper()
    return upper[0] + upper[1:].lower()


def capitalized(text: str) -> str:
    """Foundation's ``capitalized`` as the panel writes it
    (``watchCapitalized``): a letter right after anything that is not a
    letter takes its title case, every other letter its lower case; an
    apostrophe does not end a word, and a combining mark counts as a
    letter."""
    out: list[str] = []
    in_word = False
    for ch in text:
        if ch in ("'", "’"):
            out.append(ch)
            continue
        letter = unicodedata.category(ch)[0] in ("L", "M")
        if letter:
            out.append(ch.lower() if in_word else _title_case(ch))
        else:
            out.append(ch)
        in_word = letter
    return "".join(out)


def entity_label(entity_id: str, friendly_name: str | None) -> str:
    """The label a new entity tile stores (``watchEntityLabel``): the
    friendly name when there is one, else the object id with ``_`` as
    spaces, capitalized."""
    if friendly_name:
        return friendly_name
    return capitalized(_object_id(entity_id).replace("_", " "))


def _friendly_name(row: Mapping[str, Any]) -> str | None:
    """A row's friendly name, or None when it is empty or is the entity id
    (``watchEntityAddFromHass``)."""
    name = row.get("name")
    if isinstance(name, str) and name and name != row["id"]:
        return name
    return None


def is_tv_remote(row: Mapping[str, Any], state_ids: Collection[str]) -> bool:
    """Whether a ``media_player`` stands in for a TV remote: ``device_class``
    exactly ``tv`` and no ``remote.`` entity with the same object id."""
    entity_id = row["id"]
    return (
        _domain(entity_id) == "media_player"
        and row.get("device_class") == "tv"
        and f"remote.{_object_id(entity_id)}" not in state_ids
    )


def _look(row: Mapping[str, Any], state_ids: Collection[str]) -> tuple[str | None, str | None]:
    """A new tile's icon and color (``watchEntityDefaults``) on a page in
    the ``neonLagoon`` theme with no gradient colors."""
    entity_id = row["id"]
    look = _LOOKS.get(_domain(entity_id))
    if look is None:
        return None, None
    icon, role = look
    if is_tv_remote(row, state_ids):
        icon, role = _TV_REMOTE_LOOK
        if "apple" in entity_id.lower():
            icon = _TV_REMOTE_APPLE_ICON
    return icon, _NEON_LAGOON.get(role)


def _sorted(value: dict[str, Any]) -> dict[str, Any]:
    return {key: value[key] for key in sorted(value)}


def starter_tile(
    row: Mapping[str, Any], tile_id: str, place: int, state_ids: Collection[str]
) -> dict[str, Any]:
    """The tile of one entity row at the ``place``-th spot of the page,
    with an upper case id."""
    icon, color = _look(row, state_ids)
    tile: dict[str, Any] = {
        **copy.deepcopy(_TILE_KEYS),
        "colSpan": _TILE_COLS,
        "customLabel": entity_label(row["id"], _friendly_name(row)),
        "entityId": row["id"],
        "gridCol": (place % (_GRID_COLUMNS // _TILE_COLS)) * _TILE_COLS,
        "gridRow": (place // (_GRID_COLUMNS // _TILE_COLS)) * _TILE_ROWS,
        "id": tile_id.upper(),
        "rowSpan": _TILE_ROWS,
    }
    if icon is not None:
        tile["icon"] = icon
    if color is not None:
        tile["color"] = color
    return _sorted(tile)


def new_starter_page(
    page_id: str,
    rows: Iterable[Mapping[str, Any]],
    tile_ids: Iterable[str],
    state_ids: Collection[str],
) -> dict[str, Any]:
    """The starter page: one tile per row in order, ids upper case."""
    ids = iter(tile_ids)
    items = [starter_tile(row, next(ids), place, state_ids) for place, row in enumerate(rows)]
    page = {
        **copy.deepcopy(_PAGE_KEYS),
        "id": page_id.upper(),
        "items": items,
        "name": STARTER_PAGE_NAME,
    }
    return _sorted(page)


def _kind(row: Mapping[str, Any], domains: tuple[str, ...]) -> bool:
    """Whether a row may be a tile of ``domains``: no category, not hidden,
    not disabled."""
    category = row.get("entity_category")
    if category is not None and category != "":
        return False
    if row.get("hidden") is True or row.get("disabled") is True:
        return False
    return _domain(row["id"]) in domains


def _order_key(row: Mapping[str, Any], domains: tuple[str, ...]) -> tuple[int, str, str]:
    """The domain order, then the name ignoring case, then the id
    (``homeMapWaitOrder``)."""
    name = row.get("name")
    name = name if isinstance(name, str) else row["id"]
    return (domains.index(_domain(row["id"])), name.lower(), row["id"])


def _area_order(
    floors: Iterable[Mapping[str, Any]], areas: Iterable[Mapping[str, Any]]
) -> list[str]:
    """Area ids in page order: by floor (its level, floors with no level
    last, then its name ignoring case, then its id, as
    ``home_areas.floors_from_registry`` sorts them), areas on no floor or on
    a floor not listed after every floor's, then by name ignoring case, then
    id."""
    listed = [floor for floor in floors if isinstance(floor.get("id"), str)]
    listed.sort(
        key=lambda floor: (
            not isinstance(floor.get("level"), int),
            floor["level"] if isinstance(floor.get("level"), int) else 0,
            str(floor.get("name") or "").lower(),
            floor["id"],
        )
    )
    floor_rank = {floor["id"]: index for index, floor in enumerate(listed)}
    rows = [area for area in areas if isinstance(area.get("id"), str)]
    rows.sort(
        key=lambda area: (
            floor_rank.get(area.get("floor_id"), len(floor_rank)),
            str(area.get("name") or "").lower(),
            area["id"],
        )
    )
    return [area["id"] for area in rows]


def starter_entities(
    floors: Iterable[Mapping[str, Any]],
    areas: Iterable[Mapping[str, Any]],
    entities: Iterable[Mapping[str, Any]],
) -> list[dict[str, Any]]:
    """The entity rows the starter page shows, in page order; empty when
    the home has nothing to show.

    ``floors`` are ``home_floors`` rows (``id``, ``name``, ``level``), ``areas``
    ``home_areas`` rows (``id``, ``name``, ``floor_id``), and ``entities``
    ``home_entities`` rows (``id``, ``name``, ``area_id``,
    ``entity_category``, ``hidden``, and ``disabled`` when a reader keeps
    disabled ones). An entity whose area is not listed counts as in none.
    """
    rows = [dict(row) for row in entities if isinstance(row.get("id"), str)]
    domains = MAIN_DOMAINS
    if sum(1 for row in rows if _kind(row, MAIN_DOMAINS)) < SMALL_HOME_BELOW:
        domains = MAIN_DOMAINS + SWITCH_DOMAINS
    order = _area_order(floors, areas)
    groups: dict[str | None, list[dict[str, Any]]] = {area_id: [] for area_id in order}
    groups[None] = []
    for row in rows:
        if not _kind(row, domains):
            continue
        area_id = row.get("area_id")
        groups[area_id if area_id in groups else None].append(row)
    keys: list[str | None] = [*order, None]
    for key in keys:
        groups[key].sort(key=lambda row: _order_key(row, domains))
    taken: dict[str | None, int] = {key: 0 for key in keys}
    total = 0
    for key in keys:
        take = min(FIRST_PASS_PER_AREA, len(groups[key]), MAX_TILES - total)
        taken[key] = take
        total += take
    for key in keys:
        take = min(len(groups[key]) - taken[key], MAX_TILES - total)
        taken[key] += take
        total += take
    return [row for key in keys for row in groups[key][: taken[key]]]


def tile_entity_ids(page: Mapping[str, Any]) -> list[str]:
    """The entity ids of a page's tiles, in order, each once."""
    out: list[str] = []
    items = page.get("items")
    for tile in items if isinstance(items, list) else []:
        entity_id = tile.get("entityId") if isinstance(tile, Mapping) else None
        if isinstance(entity_id, str) and entity_id not in out:
            out.append(entity_id)
    return out


# The attributes a tile reads, the only ones ``starter_page_make`` sends.
TILE_ATTRIBUTES: tuple[str, ...] = (
    "friendly_name",
    "unit_of_measurement",
    "device_class",
    "brightness",
    "color_mode",
    "supported_color_modes",
    "supported_features",
    "current_position",
    "percentage",
    "temperature",
    "target_temp_low",
    "target_temp_high",
    "current_temperature",
    "min_temp",
    "max_temp",
    "target_temp_step",
    "hvac_modes",
    "hvac_action",
    "media_title",
    "media_artist",
    "is_volume_muted",
    "icon",
)


def tile_state(state: str, attributes: Mapping[str, Any]) -> dict[str, Any]:
    """``{"state", "attributes"}`` with the attributes cut to
    :data:`TILE_ATTRIBUTES`."""
    return {
        "state": state,
        "attributes": {
            key: attributes[key] for key in TILE_ATTRIBUTES if key in attributes
        },
    }
