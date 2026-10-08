"""WebSocket commands for the panel's client certificate import.

A home behind an mTLS proxy needs a client certificate (a ``.p12``) on every
device that reaches it. The phone used to import it and hand it over with
the signed ``client_certificate_put``; now the panel imports it here, over
the WebSocket the signed-in user already holds. Everything lands in the same
per-user ``ClientCertificateStore`` the signed ops use, so each watch keeps
fetching it with ``client_certificate_get`` as before, and a change bumps the
revision the delta reply names, which wakes that user's devices.

The certificate belongs to a Home Assistant user, the same key the signed
ops bind to a device's user. By default that is the user on the connection:
any signed-in user reads and manages their own, so none of these commands is
admin only. An administrator can also name another user with ``user_id``,
which is how a watch an administrator paired for a household member gets
one: the phone no longer imports certificates, so without it a certificate
could only ever land under the administrator's own record, which that
member's watch never reads. Naming another user is refused for anyone
but an administrator (``unauthorized``), and the user must exist, be active
and not be one Home Assistant made for itself (``invalid_user``), the same
rule pairing applies when it binds a device to a user.

Commands:

    wrist_assistant/client_certificate/status  {user_id?}
    wrist_assistant/client_certificate/put     {pkcs12, passphrase, user_id?}
    wrist_assistant/client_certificate/delete  {user_id?}

Every command answers the status:

    {"present": bool, "fingerprint": <hex> | null, "updated_at": <ISO> | null,
     "revision": int, "source": "panel" | "iphone" | null}

``revision`` is 0 and ``source`` null when the user never had a record.
After a removal ``present`` is false with the record's revision and the
source that removed it.

Refusals are WebSocket errors with a stable code: ``invalid`` (pkcs12 is not
base64 text, or the passphrase is too long), ``too_large`` (a .p12 over
32 KiB), ``invalid_pkcs12`` (not a PKCS#12 file, or one with no private key
or no certificate), ``bad_passphrase`` (a .p12 the password does not open),
``unauthorized`` (no user on the connection, or a user who is not an
administrator naming someone else), ``invalid_user`` (the named user does
not exist, is deactivated, or is a system user) and ``unavailable`` (the
integration is not ready, or the stored certificates could not be read). A
refusal stores nothing.
"""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.websocket_api import ActiveConnection
from homeassistant.core import HomeAssistant, callback

from .client_certificate_store import (
    SOURCE_PANEL,
    ClientCertificateError,
    ClientCertificateRecord,
    ClientCertificateUnreadableError,
    certificate_from_upload,
)
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

_CMD_STATUS = f"{DOMAIN}/client_certificate/status"
_CMD_PUT = f"{DOMAIN}/client_certificate/put"
_CMD_DELETE = f"{DOMAIN}/client_certificate/delete"


def _store(hass: HomeAssistant) -> Any | None:
    store = getattr(hass.data.get(DOMAIN), "client_certificate_store", None)
    if store is None or not store.available:
        return None
    return store


def _user_id(connection: ActiveConnection) -> str | None:
    user = getattr(connection, "user", None)
    user_id = getattr(user, "id", None)
    return user_id if isinstance(user_id, str) and user_id else None


def _status(record: ClientCertificateRecord | None) -> dict[str, Any]:
    if record is None:
        return {
            "present": False,
            "fingerprint": None,
            "updated_at": None,
            "revision": 0,
            "source": None,
        }
    return {
        "present": record.present,
        "fingerprint": (
            record.certificate.fingerprint if record.certificate is not None else None
        ),
        "updated_at": record.updated_at,
        "revision": record.revision,
        "source": record.source,
    }


def _error_code(err: ClientCertificateError) -> str:
    if isinstance(err, ClientCertificateUnreadableError):
        return "bad_passphrase" if err.reason == "bad_passphrase" else "invalid_pkcs12"
    return err.code


async def _target_user(
    hass: HomeAssistant, connection: ActiveConnection, requested: Any
) -> tuple[str | None, tuple[str, str] | None]:
    """Whose certificate a command is about, or the refusal as (code,
    message).

    No ``user_id``, or the caller's own: the caller. Another user: only an
    administrator may name one, checked here since these commands and the
    panel that sends them are open to every signed-in user. The user must
    exist, be active and not be one Home
    Assistant made for itself (Supervisor, the content user): the same rule
    as ``_pick_user`` in ``pairing_ws.py``, which binds a paired device to
    a user, so a certificate can be stored for exactly the users a device
    can be paired for.
    """
    caller = getattr(connection, "user", None)
    caller_id = _user_id(connection)
    if caller_id is None:
        return None, ("unauthorized", "no Home Assistant user")
    if requested is None or requested == caller_id:
        return caller_id, None
    if not getattr(caller, "is_admin", False):
        return None, (
            "unauthorized",
            "Only an administrator can manage another user's client certificate.",
        )
    if not isinstance(requested, str) or not requested:
        return None, ("invalid_user", "Pick an active Home Assistant user for this certificate.")
    user = await hass.auth.async_get_user(requested)
    if user is None or not user.is_active or getattr(user, "system_generated", False):
        return None, ("invalid_user", "Pick an active Home Assistant user for this certificate.")
    return user.id, None


async def _gate(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> tuple[Any, str] | None:
    """The store and the id of the user the command is about, or None after
    sending the refusal."""
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return None
    user_id, refusal = await _target_user(hass, connection, msg.get("user_id"))
    if refusal is not None or user_id is None:
        code, message = refusal or ("unauthorized", "no Home Assistant user")
        connection.send_error(msg["id"], code, message)
        return None
    return store, user_id


def _for_whom(connection: ActiveConnection, user_id: str) -> str:
    """The log's words for the user a command was about, naming the
    administrator who acted when it was someone else."""
    caller_id = _user_id(connection)
    return user_id if caller_id == user_id else f"{user_id} (by administrator {caller_id})"


@callback
def async_register_client_certificate_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_client_certificate_status)
    websocket_api.async_register_command(hass, ws_client_certificate_put)
    websocket_api.async_register_command(hass, ws_client_certificate_delete)


# Deliberately not admin only: see the module docstring. Naming another
# user is the one admin-only part, checked in `_target_user`.
@websocket_api.websocket_command(
    {vol.Required("type"): _CMD_STATUS, vol.Optional("user_id"): str}
)
@websocket_api.async_response
async def ws_client_certificate_status(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """A user's certificate status: the caller's, or with ``user_id`` the
    named user's. Never the bytes or the password."""
    gated = await _gate(hass, connection, msg)
    if gated is None:
        return
    store, user_id = gated
    try:
        record = store.get(user_id)
    except ClientCertificateError as err:
        connection.send_error(msg["id"], _error_code(err), err.message)
        return
    connection.send_result(msg["id"], _status(record))


# Deliberately not admin only: see the module docstring. Naming another
# user is the one admin-only part, checked in `_target_user`.
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_PUT,
        vol.Required("pkcs12"): str,
        vol.Required("passphrase"): str,
        vol.Optional("user_id"): str,
    }
)
@websocket_api.async_response
async def ws_client_certificate_put(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Import a user's certificate: the caller's, or with ``user_id`` the
    named user's.

    ``pkcs12`` is the whole .p12 file as base64, ``passphrase`` the password
    that opens it ("" for none). The fingerprint is worked out here (SHA-256
    of the .p12 bytes, 64 lowercase hex digits), and the file is opened with
    the password before anything is stored. A new certificate adds one to
    the revision and wakes that user's devices; the same one again changes
    nothing, except that a phone's record of it becomes the panel's.
    """
    gated = await _gate(hass, connection, msg)
    if gated is None:
        return
    store, user_id = gated
    try:
        certificate = certificate_from_upload(msg.get("pkcs12"), msg.get("passphrase"))
        record, changed = await store.async_put_certificate(
            user_id, certificate, source=SOURCE_PANEL
        )
    except ClientCertificateError as err:
        connection.send_error(msg["id"], _error_code(err), err.message)
        return
    _LOGGER.info(
        "Panel %s the client certificate for user %s (revision %d, fingerprint %s)",
        "stored" if changed else "kept",
        _for_whom(connection, user_id),
        record.revision,
        certificate.fingerprint[:8],
    )
    connection.send_result(msg["id"], _status(record))


# Deliberately not admin only: see the module docstring. Naming another
# user is the one admin-only part, checked in `_target_user`.
@websocket_api.websocket_command(
    {vol.Required("type"): _CMD_DELETE, vol.Optional("user_id"): str}
)
@websocket_api.async_response
async def ws_client_certificate_delete(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Remove a user's certificate: the caller's, or with ``user_id`` the
    named user's.

    The record stays with no certificate and a new revision, so every
    device of the user removes its copy on its next poll. With nothing held
    nothing changes.
    """
    gated = await _gate(hass, connection, msg)
    if gated is None:
        return
    store, user_id = gated
    try:
        revision, changed = store.delete(user_id, source=SOURCE_PANEL)
        record = store.get(user_id)
    except ClientCertificateError as err:
        connection.send_error(msg["id"], _error_code(err), err.message)
        return
    if changed:
        _LOGGER.info(
            "Panel removed the client certificate for user %s (revision %d)",
            _for_whom(connection, user_id),
            revision,
        )
    connection.send_result(msg["id"], _status(record))
