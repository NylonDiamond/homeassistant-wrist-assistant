"""WebSocket commands for the panel's Watch settings view, and the phone's
watch config live line.

The panel reads a watch's stored config and saves its behavior settings over
the authenticated WebSocket the frontend already holds, the same way the
complication editor talks to ``complication_ws.py``. Both panel commands
require an HA administrator: the panel is admin-only, and a read hands out a
watch's whole page config. The devices never read or write through these;
they use the signed ``watch_config_get`` / ``watch_config_put`` ops in
``wa_v2_views.py``.

One exception: ``subscribe``, which the iPhone app sends over its own
WebSocket so that a panel save reaches it while it is open rather than on its
next foreground. The phone's user need not be an administrator, and all it is
ever told is revision numbers, the same way ``complications/owner_subscribe``
tells it only tokens. The documents still travel only over the signed get.

Commands:

    wrist_assistant/watch_config/get        {owner_watch_id, kind}
    wrist_assistant/watch_config/save       {owner_watch_id, kind,
                                             base_revision, document}
    wrist_assistant/watch_config/subscribe  {owner_watch_id}   (not admin)

Every refusal is a WebSocket error with the store's code: ``invalid``,
``unavailable``, ``no_record`` or ``conflict``. A conflict's message always
begins ``stored revision is <N>``, which is how the panel learns the revision
to reload at; an error carries no data besides its code and message.
"""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.websocket_api import ActiveConnection
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .watch_config_store import (
    WatchConfigChange,
    WatchConfigStore,
    WatchConfigStoreError,
)

_LOGGER = logging.getLogger(__name__)

_CMD_GET = f"{DOMAIN}/watch_config/get"
_CMD_SAVE = f"{DOMAIN}/watch_config/save"
_CMD_SUBSCRIBE = f"{DOMAIN}/watch_config/subscribe"


def _store(hass: HomeAssistant) -> WatchConfigStore | None:
    domain_data = hass.data.get(DOMAIN)
    if domain_data is None:
        return None
    return getattr(domain_data, "watch_config_store", None)


@callback
def async_register_watch_config_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_watch_config_get)
    websocket_api.async_register_command(hass, ws_watch_config_save)
    websocket_api.async_register_command(hass, ws_watch_config_subscribe)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_GET,
        vol.Required("owner_watch_id"): str,
        vol.Required("kind"): str,
    }
)
@callback
def ws_watch_config_get(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """One watch's stored record of one kind, with its delivery state.

    Result: {"kind", "revision", "hash", "updated_at", "updated_by",
             "delivered_revision", "delivered_at", "document"?}

    With no record, ``revision`` and ``delivered_revision`` are 0, the
    strings are null, and there is no ``document``: the view's "open the
    iPhone app once" state. Either kind may be read; only ``behavior`` may be
    saved. Reading changes nothing, delivery included: the panel is not the
    device.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    kind = msg["kind"]
    try:
        record = store.get(msg["owner_watch_id"], kind)
    except WatchConfigStoreError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    if record is None:
        connection.send_result(
            msg["id"],
            {
                "kind": kind,
                "revision": 0,
                "hash": None,
                "updated_at": None,
                "updated_by": None,
                "delivered_revision": 0,
                "delivered_at": None,
            },
        )
        return
    connection.send_result(
        msg["id"],
        {
            "kind": kind,
            "revision": record.revision,
            "hash": record.hash,
            "updated_at": record.updated_at,
            "updated_by": record.updated_by,
            "delivered_revision": record.delivered_revision,
            "delivered_at": record.delivered_at,
            "document": record.document,
        },
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_SAVE,
        vol.Required("owner_watch_id"): str,
        vol.Required("kind"): str,
        vol.Required("base_revision"): int,
        vol.Required("document"): dict,
    }
)
@callback
def ws_watch_config_save(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Save one watch's behavior settings as edited in the panel.

    Result: {"revision": <new revision>}

    The panel sends the whole document, keys it does not show included, and
    the store keeps it as sent. Refused with ``no_record`` when
    ``base_revision`` is 0 or nothing is stored (the phone makes the first
    copy), with ``conflict`` when ``base_revision`` is not the stored
    revision (message ``stored revision is <N>, save was based on <M>``), and
    with ``invalid`` for any other kind or a malformed document. The hash is
    computed here and ``updated_by`` is ``panel``; the replaced document goes
    into the record's history like any save.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    try:
        record = store.panel_save(
            msg["owner_watch_id"],
            msg["kind"],
            msg["document"],
            base_revision=msg["base_revision"],
        )
    except WatchConfigStoreError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    _LOGGER.info(
        "Panel saved %s for %s at revision %d",
        record.kind,
        record.owner_watch_id,
        record.revision,
    )
    connection.send_result(msg["id"], {"revision": record.revision})


# Deliberately not admin-only: see the module docstring.
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_SUBSCRIBE,
        vol.Required("owner_watch_id"): str,
    }
)
@callback
def ws_watch_config_subscribe(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Tell an open iPhone app the moment one watch's stored config changes.

    Result: {"revisions": {kind: revision, ...}}
    Event:  {"kind": kind, "revision": revision}

    The result names every kind the watch has a record of (an empty object
    when it has none), so a save that landed while the socket was down is
    caught at subscribe time. After that, every accepted save for that watch
    sends an event, whoever made it: the phone's own upload echoes back, and
    the phone ignores a revision it already holds. A forget sends revision 0
    for each kind it removed, and a move sends the target's revisions to the
    target's subscribers. Other watches are never mentioned.

    Only numbers travel here. The phone answers an event with its normal
    signed ``watch_config_get``, which is where the document comes from. An
    owner whose file could not be read answers ``unavailable`` and is not
    subscribed, the same refusal its get would meet.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    owner = msg["owner_watch_id"]
    try:
        revisions = store.revisions(owner)
    except WatchConfigStoreError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return

    @callback
    def _on_change(change: WatchConfigChange) -> None:
        if change.owner_watch_id != owner:
            return
        connection.send_message(
            websocket_api.event_message(
                msg["id"], {"kind": change.kind, "revision": change.revision}
            )
        )

    connection.subscriptions[msg["id"]] = store.async_add_listener(_on_change)
    connection.send_result(msg["id"], {"revisions": revisions})
