"""WebSocket API for the custom complication editor panel.

The HA frontend panel is the only editor of custom complications. It talks to
this module over the authenticated WebSocket the frontend already holds; every
mutation requires an HA administrator. The watch never uses these commands;
it pulls over the HMAC-signed ``/v2/action`` ops in ``wa_v2_views.py``.

Commands:

    wrist_assistant/complications/owners
    wrist_assistant/complications/list        {owner_watch_id}
    wrist_assistant/complications/get         {owner_watch_id, id}
    wrist_assistant/complications/save        {owner_watch_id, document, base_revision?}
    wrist_assistant/complications/delete      {owner_watch_id, id, base_revision?}
    wrist_assistant/complications/subscribe   {owner_watch_id?}
    wrist_assistant/complications/render_values {templates: {key: jinja}}

``save`` is all-or-nothing: the browser submits the whole document plus the
revision it loaded. A mismatch returns error code ``conflict`` with the
current record so the panel can offer reload / save-as-copy / discard. There
is deliberately no force flag; last-write-wins is not a path that exists.
"""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.websocket_api import ActiveConnection
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.template import Template, TemplateError

from .complication_store import (
    ComplicationChange,
    ComplicationConflictError,
    ComplicationStore,
    ComplicationStoreError,
)
from .const import COMPLICATION_MAX_SCHEMA_VERSION, DOMAIN
from .widget_secret_store import DEVICE_KIND_WATCH

_LOGGER = logging.getLogger(__name__)

_CMD_OWNERS = f"{DOMAIN}/complications/owners"
_CMD_LIST = f"{DOMAIN}/complications/list"
_CMD_GET = f"{DOMAIN}/complications/get"
_CMD_SAVE = f"{DOMAIN}/complications/save"
_CMD_DELETE = f"{DOMAIN}/complications/delete"
_CMD_SUBSCRIBE = f"{DOMAIN}/complications/subscribe"
_CMD_RENDER = f"{DOMAIN}/complications/render_values"


def _store(hass: HomeAssistant) -> ComplicationStore | None:
    domain_data = hass.data.get(DOMAIN)
    if domain_data is None:
        return None
    return domain_data.complication_store


def _send_store_error(
    connection: ActiveConnection, msg_id: int, err: ComplicationStoreError
) -> None:
    if isinstance(err, ComplicationConflictError):
        # The frontend needs the current record to render the conflict
        # screen; ``send_error`` only carries a string, so send it as a
        # result with ``ok: false`` instead.
        connection.send_result(
            msg_id,
            {
                "ok": False,
                "error": err.code,
                "message": err.message,
                "current": err.current.as_dict() if err.current else None,
            },
        )
        return
    connection.send_error(msg_id, err.code, err.message)


@callback
def async_register_websocket_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_owners)
    websocket_api.async_register_command(hass, ws_list)
    websocket_api.async_register_command(hass, ws_get)
    websocket_api.async_register_command(hass, ws_save)
    websocket_api.async_register_command(hass, ws_delete)
    websocket_api.async_register_command(hass, ws_subscribe)
    websocket_api.async_register_command(hass, ws_render_values)


@websocket_api.websocket_command({vol.Required("type"): _CMD_OWNERS})
@callback
def ws_owners(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Every provisioned watch, with how many live complications it owns.

    Owners come from the widget secret store (a watch self-provisions under
    its own id), not from the complication store, so a watch with nothing
    saved yet still shows up as a target for the first complication.
    """
    domain_data = hass.data.get(DOMAIN)
    if domain_data is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    store: ComplicationStore = domain_data.complication_store
    owners: list[dict[str, Any]] = []
    seen: set[str] = set()
    for device_id, entry in domain_data.widget_secret_store.all_entries.items():
        if entry.device_kind != DEVICE_KIND_WATCH:
            continue
        seen.add(device_id)
        owners.append(
            {
                "owner_watch_id": device_id,
                "device_name": entry.device_name,
                "app_version": entry.app_version,
                "complication_count": len(store.list(device_id)),
                "token": store.owner_token(device_id),
            }
        )
    # An owner whose watch entry was removed still has records; list it so
    # the data is reachable rather than orphaned.
    for owner in store.owners():
        if owner in seen or store.is_empty(owner):
            continue
        owners.append(
            {
                "owner_watch_id": owner,
                "device_name": None,
                "app_version": None,
                "complication_count": len(store.list(owner)),
                "token": store.owner_token(owner),
            }
        )
    owners.sort(key=lambda o: (o["device_name"] or "", o["owner_watch_id"]))
    connection.send_result(
        msg["id"],
        {
            "owners": owners,
            "max_schema_version": COMPLICATION_MAX_SCHEMA_VERSION,
            "token": store.token,
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_LIST,
        vol.Required("owner_watch_id"): str,
        vol.Optional("include_deleted", default=False): bool,
    }
)
@callback
def ws_list(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    owner = msg["owner_watch_id"]
    connection.send_result(
        msg["id"],
        {
            "owner_watch_id": owner,
            "token": store.owner_token(owner),
            "max_schema_version": COMPLICATION_MAX_SCHEMA_VERSION,
            "records": [
                r.as_dict()
                for r in store.list(owner, include_deleted=msg["include_deleted"])
            ],
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_GET,
        vol.Required("owner_watch_id"): str,
        vol.Required("complication_id"): str,
    }
)
@callback
def ws_get(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    record = store.get(msg["owner_watch_id"], msg["complication_id"].upper())
    if record is None:
        connection.send_error(msg["id"], "not_found", "no such complication")
        return
    connection.send_result(msg["id"], {"record": record.as_dict()})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_SAVE,
        vol.Required("owner_watch_id"): str,
        vol.Required("document"): dict,
        vol.Optional("base_revision"): vol.Any(int, None),
    }
)
@callback
def ws_save(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    user = connection.user
    updated_by = f"ha-panel:{user.name or user.id}" if user else "ha-panel"
    try:
        record = store.save(
            msg["owner_watch_id"],
            msg["document"],
            base_revision=msg.get("base_revision"),
            updated_by=updated_by,
        )
    except ComplicationStoreError as err:
        _send_store_error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], {"ok": True, "record": record.as_dict()})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_DELETE,
        vol.Required("owner_watch_id"): str,
        vol.Required("complication_id"): str,
        vol.Optional("base_revision"): vol.Any(int, None),
    }
)
@callback
def ws_delete(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    user = connection.user
    updated_by = f"ha-panel:{user.name or user.id}" if user else "ha-panel"
    try:
        record = store.delete(
            msg["owner_watch_id"],
            msg["complication_id"],
            base_revision=msg.get("base_revision"),
            updated_by=updated_by,
        )
    except ComplicationStoreError as err:
        _send_store_error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], {"ok": True, "record": record.as_dict()})


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_SUBSCRIBE,
        vol.Optional("owner_watch_id"): str,
    }
)
@callback
def ws_subscribe(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Push every commit (save, delete, restore) to the panel as an event.

    Lets a second tab or a second admin see that the record they hold is now
    stale before they try to save it. Optional owner filter.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    owner_filter = msg.get("owner_watch_id")

    @callback
    def _on_change(change: ComplicationChange) -> None:
        if owner_filter is not None and change.owner_watch_id != owner_filter:
            return
        connection.send_message(
            websocket_api.event_message(
                msg["id"],
                {
                    "owner_watch_id": change.owner_watch_id,
                    "token": change.token,
                    "record": change.record.as_dict(),
                },
            )
        )

    connection.subscriptions[msg["id"]] = store.async_add_listener(_on_change)
    connection.send_result(msg["id"], {"token": store.token})


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_RENDER,
        vol.Required("templates"): {str: str},
    }
)
@callback
def ws_render_values(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Render a batch of Jinja templates for the preview.

    The browser resolves plain entity states from ``hass.states`` itself; only
    Jinja needs the server, because the browser must not reimplement Home
    Assistant's template engine. Each key resolves independently so one bad
    template does not blank the whole preview: ``{key: {ok, value}}`` or
    ``{key: {ok: false, error}}``. Renders with the same ``Template`` path the
    watch's signed ``template`` op uses, so the panel and the watch agree.
    """
    results: dict[str, dict[str, Any]] = {}
    for key, template_str in msg["templates"].items():
        if not template_str.strip():
            results[key] = {"ok": False, "error": "empty template"}
            continue
        try:
            value = Template(template_str, hass).async_render(parse_result=False)
        except TemplateError as err:
            results[key] = {"ok": False, "error": str(err)}
            continue
        results[key] = {"ok": True, "value": value}
    connection.send_result(msg["id"], {"results": results})
