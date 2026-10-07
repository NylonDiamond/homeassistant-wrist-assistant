"""WebSocket commands that pair a device in the panel: by code, and by QR code.

**By code.** A watch with no iPhone, or an iPhone, posts its id to the
unauthenticated ``/v2/pair/start`` (``WAPairStartView``) and shows the code it
gets back. An admin types the code into the panel, which looks it up and then
confirms it here. The confirm is what writes the pair into the widget secret
store, bound to a Home Assistant user the same way ``register_secret`` binds a
pair to the user behind its bearer.

A device on a current build sends an X25519 public key rather than a secret
(``wa_pair_requests.validate_pair_start``). For such a request the confirm
makes the secret here and keeps a copy sealed to that key, which the device
fetches from ``/v2/pair/status``. An older watch sends its secret, and the
confirm stores that one, as it always did.

**By QR code.** ``pair/offer`` makes a one-use token for an iPhone and answers
the ``wristassistant://pair#...`` link the panel draws as a QR code. The phone
redeems it at ``/v2/pair/redeem`` (``WAPairRedeemView``), and the panel polls
``pair/offer_status`` to learn when. Closing the dialog cancels the offer.

The bound user is whose device it is: it runs with that user's rights, and
Fast alerts for it go to that user's iPhones. The panel asks "Whose watch is
this?" (or iPhone) and sends the answer as ``user_id``; with none (an older
panel) the confirming admin is bound, as before. Every command is admin only.

Commands:

    wrist_assistant/pair/lookup        {code}
    wrist_assistant/pair/confirm       {code, user_id?, replace?, allow_remote?}
    wrist_assistant/pair/offer         {user_id?, replace?, kind?}
    wrist_assistant/pair/offer_status  {offer_id}
    wrist_assistant/pair/offer_cancel  {offer_id}

Codes are compared upper-cased with spaces and hyphens dropped. Refusals are
WebSocket errors: ``unavailable`` (the integration is not ready),
``unknown_code`` (no such code, or it expired, or it was already confirmed),
``needs_replace`` (the device is paired already and ``replace`` was not
set), ``needs_allow_remote`` (the request came from outside the home network
and ``allow_remote`` was not set), ``paired_by_other_user``, ``unauthorized``
(a non-admin naming another user), ``invalid_user`` (no such user, a
deactivated one, or one Home Assistant made for itself),
``too_many_offers``, and the field checks' own codes (``invalid_watch_id``,
``invalid_field``, ``invalid_secret``, ``invalid_algo``) with
``register_secret``'s texts.
"""

from __future__ import annotations

import base64
import logging
import secrets
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.websocket_api import ActiveConnection
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import instance_id as ha_instance_id

from .const import DOMAIN
from .logbook_events import log_secret_registered, log_secret_reprovisioned
from .sealed_box import PAIRED_SECRET_BYTES, SealedBoxError, seal_pair_secret
from .wa_pair_requests import (
    OFFER_STATE_REDEEMED,
    PAIR_KIND_IPHONE,
    PAIR_KIND_WATCH,
    PairFields,
    PairOfferStore,
    PairRequestStore,
    build_offer_url,
    validate_pair_fields,
)
from .widget_secret_store import (
    LABEL_IPHONE_SELF_PROVISION,
    LABEL_WATCH_CODE_PAIR,
    WidgetSecretStore,
)

_LOGGER = logging.getLogger(__name__)

_CMD_LOOKUP = f"{DOMAIN}/pair/lookup"
_CMD_CONFIRM = f"{DOMAIN}/pair/confirm"
_CMD_OFFER = f"{DOMAIN}/pair/offer"
_CMD_OFFER_STATUS = f"{DOMAIN}/pair/offer_status"
_CMD_OFFER_CANCEL = f"{DOMAIN}/pair/offer_cancel"

# The label a confirmed code pairing is stored with, by kind. The label is
# what makes an entry an iPhone (`WidgetSecretEntry.device_kind`).
_LABEL_FOR_KIND = {
    PAIR_KIND_WATCH: LABEL_WATCH_CODE_PAIR,
    PAIR_KIND_IPHONE: LABEL_IPHONE_SELF_PROVISION,
}


def _stores(hass: HomeAssistant) -> tuple[PairRequestStore, WidgetSecretStore] | None:
    domain_data = hass.data.get(DOMAIN)
    pair_store = getattr(domain_data, "pair_request_store", None)
    secret_store = getattr(domain_data, "widget_secret_store", None)
    if pair_store is None or secret_store is None:
        return None
    return pair_store, secret_store


def _offer_store(hass: HomeAssistant) -> PairOfferStore | None:
    return getattr(hass.data.get(DOMAIN), "pair_offer_store", None)


def _user_id(connection: ActiveConnection) -> str | None:
    user = getattr(connection, "user", None)
    return user.id if user is not None else None


def _device_noun(kind: str) -> str:
    return "iPhone" if kind == PAIR_KIND_IPHONE else "watch"


@callback
def async_register_pairing_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_pair_lookup)
    websocket_api.async_register_command(hass, ws_pair_confirm)
    websocket_api.async_register_command(hass, ws_pair_offer)
    websocket_api.async_register_command(hass, ws_pair_offer_status)
    websocket_api.async_register_command(hass, ws_pair_offer_cancel)


def store_paired_device(
    hass: HomeAssistant,
    secret_store: WidgetSecretStore,
    fields: PairFields,
    *,
    user_id: str | None,
) -> str:
    """Write a pairing the admin approved, and everything that goes with it.

    Shared by the code confirm here and the QR redeem
    (``WAPairRedeemView``), so both make the same entry, the same Logbook
    row, the same binding and the same device rename. ``fields`` must carry
    the secret by now. Returns the store's ``new``, ``rekey`` or
    ``idempotent``.
    """
    watch_id = fields.watch_id
    existing = secret_store.get(watch_id)
    # An admin may hand a device over to another user, but the change of
    # owner should be visible in the log, not only in the store.
    if existing is not None and existing.user_id is not None and existing.user_id != user_id:
        _LOGGER.warning(
            "Pairing of watch_id=%s rebinds it from user %s to user %s",
            watch_id,
            existing.user_id,
            user_id,
        )
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
    # A device that was paired before keeps its registry entry; show the name
    # it reports now. A user's own rename (`name_by_user`) still wins on display.
    if fields.device_name is not None:
        device_registry = dr.async_get(hass)
        device = device_registry.async_get_device(identifiers={(DOMAIN, f"watch_{watch_id}")})
        if device is not None and device.name != fields.device_name:
            device_registry.async_update_device(device.id, name=fields.device_name)
    return result


# ── by code ──────────────────────────────────────────────────────────────


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

    Result: {"found": true, "watch_id", "kind", "device_name", "screen_size",
             "app_version", "app_build", "expires_in", "remote",
             "age_seconds", "already_paired", "paired_by_other_user",
             "bound_user_id", "needs_replace", "needs_allow_remote"}
         or {"found": false}

    ``kind`` is ``watch`` or ``iphone``. ``expires_in`` is whole seconds
    left. ``remote`` is the address the request came from (a string, or null
    when unknown) and ``age_seconds`` whole seconds since it was made, so the
    admin can tell their own device's code from a stranger's.
    ``already_paired`` means the id holds a secret already, and
    ``paired_by_other_user`` that the secret is bound to another user than
    the admin looking. ``bound_user_id`` is the user the device is bound to
    now (null when it is new or unbound), so the panel can offer that user
    first when a known device pairs again.

    ``needs_replace`` and ``needs_allow_remote`` are what the confirm will
    insist on, worked out with the same rules, so the panel shows the Replace
    box and the "I expect this watch" box exactly when the confirm would
    refuse without them. ``needs_allow_remote`` also covers a request that
    came in through Home Assistant Cloud, whose address can look local.
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
            "kind": pending.kind,
            "device_name": fields.device_name,
            "screen_size": fields.screen_size,
            "app_version": fields.app_version,
            "app_build": fields.app_build,
            "expires_in": pair_store.expires_in(pending, now=now),
            "remote": pending.remote,
            "age_seconds": pair_store.age_seconds(pending, now=now),
            "already_paired": existing is not None,
            "paired_by_other_user": bool(
                existing is not None
                and existing.user_id is not None
                and existing.user_id != user_id
            ),
            "bound_user_id": existing.user_id if existing is not None else None,
            "needs_replace": existing is not None,
            "needs_allow_remote": pending.remote_public,
        },
    )


async def _pick_user(
    hass: HomeAssistant, caller: Any, requested: str | None, *, noun: str = "watch"
) -> tuple[str | None, tuple[str, str] | None]:
    """The user to bind, or the refusal as (code, message).

    No ``user_id``, or the caller's own: the caller. Another user: only an
    admin may name one (the commands are admin only already; this keeps the
    rule next to the binding), and the user must exist, be active and not be
    one Home Assistant made for itself (Supervisor, the content user).
    """
    caller_id = caller.id if caller is not None else None
    if requested is None or requested == caller_id:
        return caller_id, None
    if caller is None or not caller.is_admin:
        return None, ("unauthorized", f"Only an administrator can pair a {noun} for another user.")
    user = await hass.auth.async_get_user(requested)
    if user is None or not user.is_active or getattr(user, "system_generated", False):
        return None, ("invalid_user", f"Pick an active Home Assistant user for this {noun}.")
    return user.id, None


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_CONFIRM,
        vol.Required("code"): str,
        vol.Optional("user_id"): str,
        vol.Optional("replace"): bool,
        vol.Optional("allow_remote"): bool,
    }
)
@websocket_api.async_response
async def ws_pair_confirm(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Pair the device behind a code, bound to the user it belongs to.

    Result: {"ok": true, "watch_id", "kind", "device_name", "result", "user_id"}

    ``user_id`` in the message is whose device it is (see ``_pick_user``);
    without it the confirming admin. The reply names the user bound.
    ``result`` is ``new``, ``rekey`` or ``idempotent``, as the store reports
    it.

    Two ticks guard against pairing the wrong thing. ``replace: true`` is
    required when the id is paired already, by anyone: a code for a known id
    would otherwise quietly re-key it, and whoever asked for that code would
    then hold the device's identity, push routes and designs. And
    ``allow_remote: true`` is required when the request came from outside
    the home network, so a stranger's code typed by mistake pairs nothing.
    Either refusal leaves the code waiting, so the admin can tick the box
    and confirm again.

    A sealed request gets its secret here: 32 random bytes, stored, and
    sealed to the device's public key for ``/v2/pair/status``. An old-form
    request stores the secret it brought. The label comes from the kind, so
    a confirmed iPhone is an iPhone. Then the shared write
    (``store_paired_device``), and the request goes, so a second confirm of
    the same code is ``unknown_code``.
    """
    stores = _stores(hass)
    if stores is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    pair_store, secret_store = stores
    user = getattr(connection, "user", None)
    # Only the user pick awaits, ahead of every read of the stores, so the
    # rest runs in one go as the synchronous command did.
    peek = pair_store.get(msg["code"])
    noun = _device_noun(peek.kind) if peek is not None else "watch"
    user_id, refusal = await _pick_user(hass, user, msg.get("user_id"), noun=noun)
    if refusal is not None:
        connection.send_error(msg["id"], *refusal)
        return
    pending = pair_store.get(msg["code"])
    if pending is None:
        connection.send_error(
            msg["id"], "unknown_code", "No pairing with that code. Codes last 10 minutes."
        )
        return
    noun = _device_noun(pending.kind)
    stored = pending.fields
    watch_id = stored.watch_id

    if pending.remote_public and msg.get("allow_remote") is not True:
        connection.send_error(
            msg["id"],
            "needs_allow_remote",
            f"This code came from outside your network. Tick \"I expect this {noun}\" "
            "to pair it anyway.",
        )
        return
    existing = secret_store.get(watch_id)
    if existing is not None and msg.get("replace") is not True:
        connection.send_error(
            msg["id"],
            "needs_replace",
            f"This {noun} is paired already. Tick Replace to give it a new key.",
        )
        return

    secret_b64 = stored.secret_b64
    if pending.sealed:
        secret_b64 = base64.b64encode(secrets.token_bytes(PAIRED_SECRET_BYTES)).decode("ascii")
    fields, error = validate_pair_fields(
        {
            "watch_id": watch_id,
            "secret_b64": secret_b64,
            "label": _LABEL_FOR_KIND.get(pending.kind, LABEL_WATCH_CODE_PAIR),
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

    is_admin = bool(user is not None and user.is_admin)
    # Cannot fire behind require_admin; kept so this path refuses exactly
    # what register_secret refuses.
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

    sealed_reply: dict[str, str] | None = None
    if pending.sealed:
        # Sealed before anything is written, so a key that cannot take a box
        # (checked at start already) leaves the store untouched.
        try:
            sealed_reply = seal_pair_secret(
                pending.public_key, watch_id, base64.b64decode(fields.secret_b64)
            )
        except SealedBoxError as err:
            connection.send_error(msg["id"], "invalid_public_key", err.message)
            return

    result = store_paired_device(hass, secret_store, fields, user_id=user_id)
    if sealed_reply is not None:
        pair_store.confirm_sealed(pending, sealed_reply)
    else:
        pair_store.remove(pending.code)
    _LOGGER.info(
        "Paired %s watch_id=%s by code (%s%s), user=%s, confirmed by %s",
        pending.kind,
        watch_id,
        result,
        ", sealed" if sealed_reply is not None else "",
        user_id,
        user.id if user is not None else None,
    )
    connection.send_result(
        msg["id"],
        {
            "ok": True,
            "watch_id": watch_id,
            "kind": pending.kind,
            "device_name": fields.device_name,
            "result": result,
            "user_id": user_id,
        },
    )


# ── by QR code ───────────────────────────────────────────────────────────


def _clean_url(value: Any) -> str | None:
    if isinstance(value, str) and value.strip():
        return value.strip().rstrip("/")
    return None


def home_urls(hass: HomeAssistant) -> tuple[str | None, str | None, str | None]:
    """The home, away and Home Assistant Cloud addresses for a QR offer.

    The first two are the ones set under Settings, Network. The third is
    the Nabu Casa remote address, only while the cloud integration is loaded
    and signed in with remote access on (``async_remote_ui_url`` refuses
    otherwise). Each lookup is guarded on its own, so a missing or broken
    one only leaves its field out of the link.
    """
    config = getattr(hass, "config", None)
    try:
        internal = _clean_url(getattr(config, "internal_url", None))
    except Exception:  # noqa: BLE001
        internal = None
    try:
        external = _clean_url(getattr(config, "external_url", None))
    except Exception:  # noqa: BLE001
        external = None
    cloud_url: str | None = None
    try:
        if "cloud" in getattr(config, "components", ()):
            from homeassistant.components import cloud

            if cloud.async_is_logged_in(hass):
                cloud_url = _clean_url(cloud.async_remote_ui_url(hass))
    except Exception:  # noqa: BLE001
        cloud_url = None
    return internal, external, cloud_url


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_OFFER,
        vol.Optional("user_id"): str,
        vol.Optional("replace"): bool,
        vol.Optional("kind"): vol.In([PAIR_KIND_IPHONE]),
    }
)
@websocket_api.async_response
async def ws_pair_offer(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Make a QR offer for an iPhone.

    Result: {"offer_id", "url", "expires_in"}

    ``user_id`` is whose iPhone it is, checked like the confirm's; without it
    the admin. ``replace: true`` lets the redeem take over a phone id that is
    bound to another user. ``kind`` may be sent and can only be ``iphone``.
    ``url`` is the ``wristassistant://pair#...`` link
    (``wa_pair_requests.build_offer_url``): this home's instance id, the
    token, its home, away and cloud addresses and its name. ``offer_id`` is
    ``sha256(token)`` in hex, for ``offer_status`` and ``offer_cancel``; the
    token is in the link only. Lasts five minutes; at most 16 may be open
    (``too_many_offers``).
    """
    offer_store = _offer_store(hass)
    if offer_store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    user = getattr(connection, "user", None)
    user_id, refusal = await _pick_user(hass, user, msg.get("user_id"), noun="iPhone")
    if refusal is not None:
        connection.send_error(msg["id"], *refusal)
        return
    try:
        instance_id = await ha_instance_id.async_get(hass)
    except Exception:  # noqa: BLE001
        instance_id = None
    if not instance_id:
        connection.send_error(msg["id"], "unavailable", "Home Assistant has no instance id yet.")
        return
    internal, external, cloud_url = home_urls(hass)
    offer = offer_store.create(
        user_id=user_id,
        admin_id=user.id if user is not None else None,
        replace=msg.get("replace") is True,
    )
    if offer is None:
        connection.send_error(
            msg["id"], "too_many_offers", "Too many QR codes are open. Close one and try again."
        )
        return
    url = build_offer_url(
        instance_id=instance_id,
        token=offer.token,
        internal_url=internal,
        external_url=external,
        cloud_url=cloud_url,
        home_name=getattr(getattr(hass, "config", None), "location_name", None),
    )
    # The offer id is a hash of the token, but only its head is logged all
    # the same; the token and the link are never logged.
    _LOGGER.info(
        "QR offer %s… made for user=%s by %s%s",
        offer.offer_id[:8],
        user_id,
        offer.admin_id,
        " (may replace)" if offer.replace else "",
    )
    connection.send_result(
        msg["id"],
        {
            "offer_id": offer.offer_id,
            "url": url,
            "expires_in": offer_store.expires_in(offer),
        },
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_OFFER_STATUS,
        vol.Required("offer_id"): str,
    }
)
@callback
def ws_pair_offer_status(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """What became of a QR offer. The panel polls it every two seconds.

    Result: {"state": "open"} or {"state": "expired"}
         or {"state": "redeemed", "device_name", "user_id"}

    An offer that is unknown, cancelled, or lost to a restart reads as
    ``expired``, which is what the panel should say about it anyway: "This
    code ran out. Show a new one." ``device_name`` is what the phone reported
    (null when it sent none) and ``user_id`` the user it was bound to.
    """
    offer_store = _offer_store(hass)
    if offer_store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    state, offer = offer_store.state_of(msg["offer_id"])
    result: dict[str, Any] = {"state": state}
    if state == OFFER_STATE_REDEEMED and offer is not None:
        result["device_name"] = offer.device_name
        result["user_id"] = offer.user_id
    connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_OFFER_CANCEL,
        vol.Required("offer_id"): str,
    }
)
@callback
def ws_pair_offer_cancel(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Drop a QR offer, so its code no longer pairs anything.

    Result: {"ok": true, "cancelled": bool}, ``cancelled`` true when the
    offer was still open. Cancelling an unknown, spent or lapsed offer is not
    an error. A redeemed phone stays paired; Remove in the Devices card is
    how it goes.
    """
    offer_store = _offer_store(hass)
    if offer_store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    connection.send_result(msg["id"], {"ok": True, "cancelled": offer_store.cancel(msg["offer_id"])})
