"""WebSocket commands for the panel's home map (app repo
``docs/home_map_plan_2026-10.md``).

The panel reads the home's map to draw it and saves it after moving pins or
changing a room, over the WebSocket it already holds. The map is the
home's, not one device's, so it follows the rule of a save in the home's
library (``require_owner`` with ``LIBRARY_OWNER_ID``, see
``panel_access.py``): every signed-in user may read and save it.

Commands:

    wrist_assistant/home_map/get   {}
    wrist_assistant/home_map/save  {doc, base_rev}

Every refusal is a WebSocket error with a stable code: ``invalid``,
``too_large``, ``conflict`` or ``unavailable``, plus ``unauthorized`` for a
connection with no user. A conflict's message always begins ``stored
revision is <N>``, as a watch config conflict's does: that is how the panel
learns the rev to read again at.
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.websocket_api import ActiveConnection
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN, LIBRARY_OWNER_ID
from .home_map_store import HomeMapError
from .panel_access import require_owner

if TYPE_CHECKING:
    from .home_map_store import HomeMapStore

_LOGGER = logging.getLogger(__name__)

_CMD_GET = f"{DOMAIN}/home_map/get"
_CMD_SAVE = f"{DOMAIN}/home_map/save"


def _store(hass: HomeAssistant) -> HomeMapStore | None:
    return getattr(hass.data.get(DOMAIN), "home_map_store", None)


@callback
def async_register_home_map_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_home_map_get)
    websocket_api.async_register_command(hass, ws_home_map_save)


@websocket_api.websocket_command({vol.Required("type"): _CMD_GET})
@callback
def ws_home_map_get(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """The home's map and its rev.

    Result: {"doc": <the map> | null, "rev": <int>}

    ``doc`` is null and ``rev`` 0 before the first save.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not require_owner(hass, connection, msg, LIBRARY_OWNER_ID):
        return
    try:
        doc, rev = store.get()
    except HomeMapError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    connection.send_result(msg["id"], {"doc": doc, "rev": rev})


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_SAVE,
        vol.Required("doc"): dict,
        vol.Required("base_rev"): int,
    }
)
@callback
def ws_home_map_save(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Save the home's map as edited in the panel.

    Result: {"rev": <the new rev>}

    ``doc`` is the whole map, ``base_rev`` the rev it was read at (0 for the
    first map). Refused ``invalid`` (the message says where the map leaves
    the contract), ``too_large`` (over 256 KiB as stored) and ``conflict``
    (``stored revision is <N>, save was based on <M>``: read again, put the
    change on top, save again). See ``home_map_store.check_document``.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not require_owner(hass, connection, msg, LIBRARY_OWNER_ID):
        return
    try:
        rev = store.save(msg["doc"], msg["base_rev"])
    except HomeMapError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    _LOGGER.info("Panel saved the home map at revision %d", rev)
    connection.send_result(msg["id"], {"rev": rev})
