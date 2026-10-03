"""WebSocket commands that confirm a watch's pairing code in the panel.

A watch with no iPhone posts its id and a fresh secret to the unauthenticated
``/v2/pair/start`` (``WAPairStartView``) and shows the code it gets back. An
admin types the code into the panel's Watch settings, which looks it up and
then confirms it here. The confirm is what writes the pair into the widget
secret store, bound to the admin who confirmed it, the same way
``register_secret`` binds a pair to the user behind its bearer. Both commands
are admin only.

Commands:

    wrist_assistant/pair/lookup   {code}
    wrist_assistant/pair/confirm  {code}

Codes are compared trimmed and upper-cased. Refusals are WebSocket errors:
``unavailable`` (the integration is not ready), ``unknown_code`` (no such
code, or it expired, or it was already confirmed), ``paired_by_other_user``,
and the field checks' own codes (``invalid_watch_id``, ``invalid_field``,
``invalid_secret``, ``invalid_algo``) with ``register_secret``'s texts.
"""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.websocket_api import ActiveConnection
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr

from .const import DOMAIN
from .logbook_events import log_secret_registered, log_secret_reprovisioned
from .wa_pair_requests import PairRequestStore, validate_pair_fields
from .widget_secret_store import LABEL_WATCH_CODE_PAIR, WidgetSecretStore

_LOGGER = logging.getLogger(__name__)

_CMD_LOOKUP = f"{DOMAIN}/pair/lookup"
_CMD_CONFIRM = f"{DOMAIN}/pair/confirm"


def _stores(hass: HomeAssistant) -> tuple[PairRequestStore, WidgetSecretStore] | None:
    domain_data = hass.data.get(DOMAIN)
    pair_store = getattr(domain_data, "pair_request_store", None)
    secret_store = getattr(domain_data, "widget_secret_store", None)
    if pair_store is None or secret_store is None:
        return None
    return pair_store, secret_store


def _user_id(connection: ActiveConnection) -> str | None:
    user = getattr(connection, "user", None)
    return user.id if user is not None else None


@callback
def async_register_pairing_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_pair_lookup)
    websocket_api.async_register_command(hass, ws_pair_confirm)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_LOOKUP,
        vol.Required("code"): str,
    }
)
@callback
def ws_pair_lookup(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """What a code stands for, so the admin can check it before confirming.

    Result: {"found": true, "watch_id", "device_name", "screen_size",
             "app_version", "app_build", "expires_in", "already_paired",
             "paired_by_other_user"}
         or {"found": false}

    ``expires_in`` is whole seconds left. ``already_paired`` means the watch
    id holds a secret already (a confirm replaces it), and
    ``paired_by_other_user`` that the secret is bound to another user.
    Looking up changes nothing.
    """
    stores = _stores(hass)
    if stores is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    pair_store, secret_store = stores
    now = pair_store.now()
    pending = pair_store.get(msg["code"], now=now)
    if pending is None:
        connection.send_result(msg["id"], {"found": False})
        return
    fields = pending.fields
    existing = secret_store.get(fields.watch_id)
    user_id = _user_id(connection)
    connection.send_result(
        msg["id"],
        {
            "found": True,
            "watch_id": fields.watch_id,
            "device_name": fields.device_name,
            "screen_size": fields.screen_size,
            "app_version": fields.app_version,
            "app_build": fields.app_build,
            "expires_in": pair_store.expires_in(pending, now=now),
            "already_paired": existing is not None,
            "paired_by_other_user": bool(
                existing is not None
                and existing.user_id is not None
                and existing.user_id != user_id
            ),
        },
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_CONFIRM,
        vol.Required("code"): str,
    }
)
@callback
def ws_pair_confirm(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Pair the watch behind a code, bound to the confirming admin.

    Result: {"ok": true, "watch_id", "device_name", "result"}

    ``result`` is ``new``, ``rekey`` or ``idempotent``, as the store reports
    it. Runs ``register_secret``'s path: the same field checks, the same
    store write (label ``watch-code-pair``, no owner iPhone), the same
    binding, Logbook entry and device rename. The request is then removed, so
    a second confirm of the same code is ``unknown_code``.
    """
    stores = _stores(hass)
    if stores is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    pair_store, secret_store = stores
    pending = pair_store.get(msg["code"])
    if pending is None:
        connection.send_error(
            msg["id"], "unknown_code", "No pairing with that code. Codes last 10 minutes."
        )
        return

    stored = pending.fields
    fields, error = validate_pair_fields(
        {
            "watch_id": stored.watch_id,
            "secret_b64": stored.secret_b64,
            "label": LABEL_WATCH_CODE_PAIR,
            "algo": stored.algo,
            "app_version": stored.app_version,
            "app_build": stored.app_build,
            "device_name": stored.device_name,
            "screen_size": stored.screen_size,
        }
    )
    if error is not None:
        connection.send_error(msg["id"], error.code, error.message)
        return

    user = getattr(connection, "user", None)
    user_id = user.id if user is not None else None
    is_admin = bool(user is not None and user.is_admin)
    watch_id = fields.watch_id

    # Cannot fire behind require_admin; kept so this path refuses exactly
    # what register_secret refuses.
    existing = secret_store.get(watch_id)
    if (
        existing is not None
        and existing.user_id is not None
        and existing.user_id != user_id
        and not is_admin
    ):
        _LOGGER.warning("Refused pair confirm for watch_id=%s: bound to another user", watch_id)
        connection.send_error(
            msg["id"],
            "paired_by_other_user",
            "This device is paired by another user. Ask an admin to forget "
            "it in the Wrist Assistant panel first.",
        )
        return

    result = secret_store.register(
        watch_id=watch_id,
        secret_b64=fields.secret_b64,
        label=fields.label,
        algo=fields.algo,
        app_version=fields.app_version,
        app_build=fields.app_build,
        owner_iphone_id=None,
        device_name=fields.device_name,
        screen_size=fields.screen_size,
        user_id=user_id,
    )
    if result == "new":
        log_secret_registered(
            hass, watch_id=watch_id, label=fields.label, app_version=fields.app_version
        )
    elif result == "rekey":
        log_secret_reprovisioned(
            hass, watch_id=watch_id, label=fields.label, app_version=fields.app_version
        )
    if user_id is not None:
        secret_store.bind_owned_watches(watch_id, user_id)
    secret_store.inherit_owner_user(watch_id)
    # A watch that was paired before keeps its device; show the name it
    # reports now. A user's own rename (`name_by_user`) still wins on display.
    if fields.device_name is not None:
        device_registry = dr.async_get(hass)
        device = device_registry.async_get_device(identifiers={(DOMAIN, f"watch_{watch_id}")})
        if device is not None and device.name != fields.device_name:
            device_registry.async_update_device(device.id, name=fields.device_name)

    pair_store.remove(pending.code)
    _LOGGER.info("Paired watch_id=%s by code (%s), user=%s", watch_id, result, user_id)
    connection.send_result(
        msg["id"],
        {
            "ok": True,
            "watch_id": watch_id,
            "device_name": fields.device_name,
            "result": result,
        },
    )
