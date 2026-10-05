"""WebSocket commands for the panel's HTTP actions screen (step 4d batch 4).

The panel reads the home's HTTP action library, saves it, and tests a draft
action over the WebSocket it already holds. Every command is admin only: a
read hands out every URL, header and global in the house, and a test sends
a request from Home Assistant to wherever the draft points.

Commands:

    wrist_assistant/http_actions/get    {}
    wrist_assistant/http_actions/save   {base_revision, document}
    wrist_assistant/http_actions/test   {action, global_variables?, values?}

Every refusal is a WebSocket error with a stable code: ``invalid``,
``conflict`` (the message always begins ``stored revision is <N>``),
``unavailable`` or ``busy``.
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.websocket_api import ActiveConnection
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .http_actions_runner import HTTPActionRefusal
from .http_actions_store import HTTPActionsStoreError

if TYPE_CHECKING:
    from .http_actions_runner import HTTPActionRunner
    from .http_actions_store import HTTPActionsStore

_LOGGER = logging.getLogger(__name__)

_CMD_GET = f"{DOMAIN}/http_actions/get"
_CMD_SAVE = f"{DOMAIN}/http_actions/save"
_CMD_TEST = f"{DOMAIN}/http_actions/test"


def _store(hass: HomeAssistant) -> HTTPActionsStore | None:
    return getattr(hass.data.get(DOMAIN), "http_actions_store", None)


def _runner(hass: HomeAssistant) -> HTTPActionRunner | None:
    return getattr(hass.data.get(DOMAIN), "http_action_runner", None)


@callback
def async_register_http_actions_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_http_actions_get)
    websocket_api.async_register_command(hass, ws_http_actions_save)
    websocket_api.async_register_command(hass, ws_http_actions_test)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): _CMD_GET})
@callback
def ws_http_actions_get(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """The home's library with its marks.

    Result: {"revision", "hash", "updated_at", "updated_by",
             "handed_over": [owner id], "delivered": {owner id: revision},
             "document"?}

    At revision 0 the strings are null and there is no ``document``: the
    screen's "No HTTP actions yet" state, which a save over base 0 or a
    phone's hand-over ends. Reading changes nothing.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    try:
        result = store.get()
    except HTTPActionsStoreError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_SAVE,
        vol.Required("base_revision"): int,
        vol.Required("document"): dict,
    }
)
@callback
def ws_http_actions_save(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Save the library as edited in the panel, compare and swap.

    Result: {"revision": <new revision>}

    ``base_revision`` is the revision the panel loaded (0 for none yet).
    Refused with ``conflict`` when it is not the stored one (message
    ``stored revision is <N>, save was based on <M>``) and with ``invalid``
    for a document that breaks the rules (the message names the action,
    header, variable or global by where it sits). The parked delta polls of
    every device are woken with the new revision.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    try:
        revision = store.save(msg["document"], base_revision=msg["base_revision"])
    except HTTPActionsStoreError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    _LOGGER.info("Panel saved the HTTP action library at revision %d", revision)
    connection.send_result(msg["id"], {"revision": revision})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_TEST,
        vol.Required("action"): dict,
        vol.Optional("global_variables", default=[]): list,
        vol.Optional("values", default={}): dict,
    }
)
@websocket_api.async_response
async def ws_http_actions_test(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Send one draft action, not saved, and say what came back.

    Result: {"status": int | null, "value": str | null, "snippet": str,
             "error": str | null, "headers": {name: value},
             "paths": [{"path", "value"}], "elapsed_ms": int}

    The draft is built with the globals and values given, exactly as a
    device's run would build the stored one, and sent under the same rules.
    ``status`` is null when no answer came, and ``error`` then says why.
    ``paths`` are the JSON leaves of the answer, for the reply picker.
    Refused with ``invalid`` for a malformed draft or for values over a
    run's limits (more than 64, a key over 64 characters, a value over
    4096), and ``busy`` while four tests are still running.
    """
    runner = _runner(hass)
    if runner is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    try:
        result = await runner.async_test(
            msg["action"], msg.get("global_variables", []), msg.get("values", {})
        )
    except HTTPActionRefusal as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    connection.send_result(msg["id"], result)
