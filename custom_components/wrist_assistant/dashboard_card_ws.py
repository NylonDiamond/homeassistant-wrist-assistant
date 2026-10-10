"""WebSocket commands for the dashboard card (``custom:wrist-assistant-card``).

The card draws one complication on a Home Assistant dashboard, live. A
dashboard is seen by everybody in the house, and a wall tablet is often
signed in as somebody who owns no watch at all, so these three commands are
open to every signed-in user, whoever's device the design sits on. They only
read, and they hand out the document and nothing else: no tokens, no sync
state, no history. What a document can reach (entity states, templates, the
HTTP action library) is already open to the same users through the editor's
render commands and the shared libraries.

Commands:

    wrist_assistant/card/designs    {}
    wrist_assistant/card/get        {owner_watch_id, complication_id}
    wrist_assistant/card/subscribe  {owner_watch_id, complication_id}

A design can change hands: a forgotten device's designs go to the Library,
and a design can be moved between devices. A card keeps the owner it was set
up with, so ``get`` and ``subscribe`` fall back to the same id on any other
owner, the Library first, rather than going blank.

Every refusal is a WebSocket error with a stable code: ``not_found`` or
``unavailable``.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.websocket_api import ActiveConnection
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr

from .complication_store import dashboard_canvas
from .const import DOMAIN, LIBRARY_OWNER_ID
from .listener_relay import COMPLICATIONS, listener_relay

if TYPE_CHECKING:
    from .complication_store import (
        ComplicationChange,
        ComplicationRecord,
        ComplicationStore,
    )

_CMD_DESIGNS = f"{DOMAIN}/card/designs"
_CMD_GET = f"{DOMAIN}/card/get"
_CMD_SUBSCRIBE = f"{DOMAIN}/card/subscribe"


def _store(hass: HomeAssistant) -> ComplicationStore | None:
    return getattr(hass.data.get(DOMAIN), "complication_store", None)


@callback
def async_register_dashboard_card_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_card_designs)
    websocket_api.async_register_command(hass, ws_card_get)
    websocket_api.async_register_command(hass, ws_card_subscribe)


def find_design(
    store: ComplicationStore, owner: str, record_id: str
) -> ComplicationRecord | None:
    """The live record a card names, or the same design wherever it went.

    The named owner wins. Otherwise the Library, then every other owner in
    order, so the answer is the same on every call.
    """
    record_id = record_id.upper()
    wanted = store.get(owner, record_id)
    if wanted is not None and not wanted.deleted:
        return wanted
    others = [LIBRARY_OWNER_ID] + [o for o in store.owners() if o != LIBRARY_OWNER_ID]
    for other in others:
        if other == owner:
            continue
        record = store.get(other, record_id)
        if record is not None and not record.deleted:
            return record
    return None


def card_payload(record: ComplicationRecord) -> dict[str, Any]:
    """What a card is told about one design: the document, and which copy."""
    return {
        "owner_watch_id": record.owner_watch_id,
        "complication_id": record.id,
        "revision": record.revision,
        "updated_at": record.updated_at,
        "document": record.document,
    }


def _owner_name(hass: HomeAssistant, owner: str) -> str:
    if owner == LIBRARY_OWNER_ID:
        return "Library"
    device = dr.async_get(hass).async_get_device(identifiers={(DOMAIN, f"watch_{owner}")})
    if device is not None and (device.name_by_user or device.name):
        return device.name_by_user or device.name or owner
    secrets = getattr(hass.data.get(DOMAIN), "widget_secret_store", None)
    entry = secrets.get(owner) if secrets is not None else None
    name = getattr(entry, "device_name", None)
    return name or owner


@websocket_api.websocket_command({vol.Required("type"): _CMD_DESIGNS})
@callback
def ws_card_designs(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Every live design in the home, for the card's picker.

    The Library first, then each device by name. A design with no canvas
    (inline only) is still listed: the card draws it as a line of text.

    ``preview`` is the meta of the design's card picture when the panel holds
    one of its current revision, else null. The editor fetches the picture
    itself with ``complications/preview_get``, which is gated by owner like
    the panel's own reads; only the meta rides here.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    owners = store.owners()
    names = {owner: _owner_name(hass, owner) for owner in owners}
    ordered = sorted(
        owners, key=lambda o: (o != LIBRARY_OWNER_ID, names[o].casefold(), o)
    )
    previews = getattr(hass.data.get(DOMAIN), "card_preview_store", None)
    designs: list[dict[str, Any]] = []
    for owner in ordered:
        records = store.list(owner)
        pictured = previews.previews_for(owner, records) if previews is not None else {}
        for record in records:
            document = record.document or {}
            families = document.get("supportedFamilies")
            design: dict[str, Any] = {
                "owner_watch_id": owner,
                "owner_name": names[owner],
                "complication_id": record.id,
                "name": document.get("name") or "",
                "families": families if isinstance(families, list) else [],
                "revision": record.revision,
                "preview": pictured.get(record.id),
            }
            # A Dashboard design's size, so the editor can size the card on
            # the sections grid before the design itself loads.
            canvas = dashboard_canvas(document)
            if canvas is not None:
                design["canvas"] = canvas
            designs.append(design)
    connection.send_result(msg["id"], {"designs": designs})


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_GET,
        vol.Required("owner_watch_id"): str,
        vol.Required("complication_id"): str,
    }
)
@callback
def ws_card_get(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    record = find_design(store, msg["owner_watch_id"], msg["complication_id"])
    if record is None:
        connection.send_error(msg["id"], "not_found", "no such complication")
        return
    connection.send_result(msg["id"], card_payload(record))


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_SUBSCRIBE,
        vol.Required("owner_watch_id"): str,
        vol.Required("complication_id"): str,
    }
)
@callback
def ws_card_subscribe(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """An event each time the design a card shows changes.

    The event is the same shape ``get`` answers, or ``{"deleted": true}``
    once no owner holds a live copy. Each commit for the design's id is
    looked up again through ``find_design``, so a move or a delete of the
    named copy follows the design rather than the old owner. Watch acks carry
    no record and are not sent.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    owner = msg["owner_watch_id"]
    record_id = msg["complication_id"].upper()
    last: dict[str, Any] = {}

    def _current() -> dict[str, Any]:
        live = _store(hass)
        record = find_design(live, owner, record_id) if live is not None else None
        return card_payload(record) if record is not None else {"deleted": True}

    @callback
    def _on_change(change: ComplicationChange) -> None:
        if change.record is None or change.record.id != record_id:
            return
        payload = _current()
        # A save elsewhere in the home is none of this card's business, and a
        # commit that leaves the shown copy as it was need not redraw it.
        key = (payload.get("owner_watch_id"), payload.get("revision"), payload.get("deleted"))
        if last.get("key") == key:
            return
        last["key"] = key
        connection.send_message(websocket_api.event_message(msg["id"], payload))

    initial = _current()
    last["key"] = (initial.get("owner_watch_id"), initial.get("revision"), initial.get("deleted"))
    # Through the relay, not the store: a config entry reload replaces the
    # store but keeps this subscription open (see listener_relay.py).
    relay = listener_relay(hass, COMPLICATIONS)
    relay.follow(store)
    connection.subscriptions[msg["id"]] = relay.add_listener(_on_change)
    connection.send_result(msg["id"], None)
