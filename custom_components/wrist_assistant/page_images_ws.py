"""WebSocket commands for the panel's page photos (step 4d batch 6, and
photo tiles: app repo ``docs/photo_tiles_plan_2026-10.md``).

The panel lists the home's photos, fetches one to draw it, uploads a new one
and deletes one no page uses, over the WebSocket it already holds. A photo is
a page's background or a tile's icon photo, a JPEG or a PNG. The photos are
the home's, shared by every page of every watch, so every command is open to
every signed-in user. An upload writes to Home Assistant's disk, held to the
store's size and count limits (``too_large``, ``full``).

Commands:

    wrist_assistant/page_images/list    {}
    wrist_assistant/page_images/get     {image_id}
    wrist_assistant/page_images/upload  {data, kind?, label?, entity_id?}
    wrist_assistant/page_images/delete  {image_id}

Every refusal is a WebSocket error with a stable code: ``invalid``,
``too_large``, ``full``, ``not_found``, ``in_use`` or ``unavailable``.
"""

from __future__ import annotations

import base64
import logging
from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.websocket_api import ActiveConnection
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .page_images import content_type
from .page_images_store import PageImagesError, decode_data

if TYPE_CHECKING:
    from .page_images_store import PageImagesStore

_LOGGER = logging.getLogger(__name__)

_CMD_LIST = f"{DOMAIN}/page_images/list"
_CMD_GET = f"{DOMAIN}/page_images/get"
_CMD_UPLOAD = f"{DOMAIN}/page_images/upload"
_CMD_DELETE = f"{DOMAIN}/page_images/delete"


def _store(hass: HomeAssistant) -> PageImagesStore | None:
    return getattr(hass.data.get(DOMAIN), "page_images_store", None)


@callback
def async_register_page_images_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_page_images_list)
    websocket_api.async_register_command(hass, ws_page_images_get)
    websocket_api.async_register_command(hass, ws_page_images_upload)
    websocket_api.async_register_command(hass, ws_page_images_delete)


@websocket_api.websocket_command({vol.Required("type"): _CMD_LIST})
@callback
def ws_page_images_list(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """The built-in photos and the home's own.

    Result: {"presets": [{"id", "name", "width", "height"}],
             "images": [{"id", "width", "height", "bytes", "added_at",
                         "used_by": [owner id], "format", "kind", "label",
                         "entity_id"}]}

    Presets come in the phone's order, the home's photos newest first.
    ``used_by`` names the watches whose pages show the photo, as a page's
    background or a tile's photo; a photo with none may be deleted (and goes
    by itself seven days after it fell out of use, thirty for an icon photo).
    ``format`` is ``"jpeg"`` or ``"png"``, ``kind`` is ``"background"`` or
    ``"icon"``, and ``label`` and ``entity_id`` are null when the photo has
    none. Presets are all JPEG backgrounds.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    try:
        result = store.list()
    except PageImagesError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {vol.Required("type"): _CMD_GET, vol.Required("image_id"): str}
)
@websocket_api.async_response
async def ws_page_images_get(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """One photo's bytes, built-in ids included.

    Result: {"image_id", "content_type": "image/jpeg" | "image/png",
             "data": <base64>}

    ``image_id`` comes back as stored: a custom id in upper case, whatever
    case it was asked in.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    try:
        image_id, data = await store.async_read(msg["image_id"])
    except PageImagesError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    connection.send_result(
        msg["id"],
        {
            "image_id": image_id,
            "content_type": content_type(data),
            "data": base64.b64encode(data).decode("ascii"),
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_UPLOAD,
        vol.Required("data"): str,
        vol.Optional("kind"): vol.Any(str, None),
        vol.Optional("label"): vol.Any(str, None),
        vol.Optional("entity_id"): vol.Any(str, None),
    }
)
@websocket_api.async_response
async def ws_page_images_upload(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Keep a photo the panel made, under a new upper case UUID.

    Result: {"image_id", "width", "height", "bytes"}

    ``data`` is a JPEG or a PNG as base64, at most 256 KiB and 16 to 1024 px
    on each side. ``kind`` is ``"background"`` (the default) or ``"icon"``,
    ``label`` at most 60 characters once trimmed, ``entity_id`` shaped like
    an entity id; each is optional, and null is the same as absent. The same
    bytes as a stored photo answer that photo's id instead of a copy (see
    ``PageImagesStore.async_upload`` for what that does to its details).
    Refused ``too_large``, ``invalid`` (not base64, neither format, a side
    out of range, a bad kind, label or entity id) or ``full`` (500 photos).
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    try:
        result = await store.async_upload(
            decode_data(msg["data"]),
            kind=msg.get("kind"),
            label=msg.get("label"),
            entity_id=msg.get("entity_id"),
        )
    except PageImagesError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    _LOGGER.debug("Panel uploaded page photo %s", result["image_id"])
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {vol.Required("type"): _CMD_DELETE, vol.Required("image_id"): str}
)
@websocket_api.async_response
async def ws_page_images_delete(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Delete one of the home's photos.

    Result: {"image_id"}

    Refused ``in_use`` while any page names it, as its background or a
    tile's photo (the message names the watches), ``invalid`` for a built-in id, ``not_found``, and
    ``unavailable`` while some watch's pages could not be read.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    try:
        image_id = await store.async_delete(msg["image_id"])
    except PageImagesError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    connection.send_result(msg["id"], {"image_id": image_id})
