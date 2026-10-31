"""WebSocket commands for the panel's home map (app repo
``docs/home_map_plan_2026-10.md``).

The panel reads the home's map to draw it and saves it after moving pins or
changing a room, over the WebSocket it already holds. The map is the
home's, not one device's, so it follows the rule of a save in the home's
library (``require_owner`` with ``LIBRARY_OWNER_ID``, see
``panel_access.py``): every signed-in user may read and save it.

Commands:

    wrist_assistant/home_map/get        {rev?}
    wrist_assistant/home_map/save       {doc, base_rev}
    wrist_assistant/home_map/scans      {}
    wrist_assistant/home_map/subscribe  {}

``scans`` reads each room as the iPhone scanned it (``home_map_store.py``,
"Scans"), which Shape draws over the plan and puts a room back to. A panel
save never records a scan.

``subscribe`` is how an open panel hears of a save made anywhere else (the
iPhone, another panel) without a reload: an event ``{"rev"}`` on every
save, and one at once with the rev now. A custom bus event would not do,
since only an administrator may subscribe to those and the map is every
user's. The panel reads the map again with ``get``, naming the rev it holds,
which answers ``not_modified`` when nothing changed.

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
from .listener_relay import HOME_MAP, listener_relay
from .panel_access import require_owner

if TYPE_CHECKING:
    from .home_map_store import HomeMapStore

_LOGGER = logging.getLogger(__name__)

_CMD_GET = f"{DOMAIN}/home_map/get"
_CMD_SAVE = f"{DOMAIN}/home_map/save"
_CMD_SCANS = f"{DOMAIN}/home_map/scans"
_CMD_SUBSCRIBE = f"{DOMAIN}/home_map/subscribe"


def _store(hass: HomeAssistant) -> HomeMapStore | None:
    return getattr(hass.data.get(DOMAIN), "home_map_store", None)


@callback
def async_register_home_map_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_home_map_get)
    websocket_api.async_register_command(hass, ws_home_map_save)
    websocket_api.async_register_command(hass, ws_home_map_scans)
    websocket_api.async_register_command(hass, ws_home_map_subscribe)


@websocket_api.websocket_command(
    {vol.Required("type"): _CMD_GET, vol.Optional("rev"): int}
)
@callback
def ws_home_map_get(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """The home's map and its rev.

    Result: {"doc": <the map> | null, "rev": <int>}, or
            {"not_modified": true, "rev": <int>} when ``rev`` names the
            stored rev

    ``doc`` is null and ``rev`` 0 before the first save. ``rev`` is the rev
    the panel holds, as the signed ``home_map_get`` takes it, so a check
    after a tab comes back or the socket reconnects costs no map.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not require_owner(hass, connection, msg, LIBRARY_OWNER_ID):
        return
    held = msg.get("rev")
    if held is not None and (isinstance(held, bool) or not isinstance(held, int) or held < 0):
        connection.send_error(msg["id"], "invalid", "rev must be a whole number of 0 or more")
        return
    try:
        doc, rev = store.get()
    except HomeMapError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    if held == rev:
        connection.send_result(msg["id"], {"not_modified": True, "rev": rev})
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


@websocket_api.websocket_command({vol.Required("type"): _CMD_SCANS})
@callback
def ws_home_map_scans(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Each room of the map as the iPhone scanned it, and the map's rev.

    Result: {"scans": {<room id>: {"outline", "walls", "openings",
                                   "objects", "at"}},
             "rev": <int>}

    Only rooms on the map now, by their id as the map spells it; a room
    drawn in the panel and never scanned has none. ``unavailable`` while
    the map or its scans could not be read.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not require_owner(hass, connection, msg, LIBRARY_OWNER_ID):
        return
    try:
        scans = store.scans()
    except HomeMapError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    connection.send_result(msg["id"], {"scans": scans, "rev": store.rev})


@websocket_api.websocket_command({vol.Required("type"): _CMD_SUBSCRIBE})
@callback
def ws_home_map_subscribe(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Tell an open panel each time the home's map is saved, by anyone.

    Result: null
    Event:  {"rev": <int>}

    One event right after the result with the rev now, so a save that
    landed between the panel's read and this subscription is heard, then
    one on every accepted save (``HomeMapStore.async_add_listener``): the
    iPhone's ``home_map_put``, this panel's own save and any other panel's.
    The panel compares the rev with the one it holds and reads the map
    again with ``get`` when they differ. Open to every signed-in user, as
    ``get`` is.

    Through the relay, as for ``watch_config/subscribe``: a reload replaces
    the store but keeps this subscription open, and Home Assistant sends
    the subscription again after the socket reconnects, which brings a
    fresh first event.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not require_owner(hass, connection, msg, LIBRARY_OWNER_ID):
        return

    @callback
    def _on_save(rev: int) -> None:
        connection.send_message(websocket_api.event_message(msg["id"], {"rev": rev}))

    relay = listener_relay(hass, HOME_MAP)
    relay.follow(store)
    connection.subscriptions[msg["id"]] = relay.add_listener(_on_save)
    connection.send_result(msg["id"], None)
    connection.send_message(websocket_api.event_message(msg["id"], {"rev": store.rev}))
