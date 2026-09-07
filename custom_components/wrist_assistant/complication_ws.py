"""WebSocket API for the custom complication editor panel.

The HA frontend panel is the only editor of custom complications. It talks to
this module over the authenticated WebSocket the frontend already holds; every
mutation requires an HA administrator. The watch never uses these commands;
it pulls over the HMAC-signed ``/v2/action`` ops in ``wa_v2_views.py``.

Commands:

    wrist_assistant/complications/owners
    wrist_assistant/devices/forget            {watch_id, force?}
    wrist_assistant/complications/list        {owner_watch_id}
    wrist_assistant/complications/get         {owner_watch_id, id}
    wrist_assistant/complications/save        {owner_watch_id, document, base_revision?}
    wrist_assistant/complications/delete      {owner_watch_id, id, base_revision?}
    wrist_assistant/complications/subscribe   {owner_watch_id?}
    wrist_assistant/complications/move_owner  {source_owner_watch_id,
                                               target_owner_watch_id}
    wrist_assistant/complications/render_values {templates: {key: jinja}}
    wrist_assistant/complications/history_series
                                              {requests: {key: {entity_id,
                                                                minutes,
                                                                points}}}

``save`` is all-or-nothing: the browser submits the whole document plus the
revision it loaded. A mismatch returns error code ``conflict`` with the
current record so the panel can offer reload / save-as-copy / discard. There
is deliberately no force flag; last-write-wins is not a path that exists.

``devices/forget`` is the odd one out: it is not a complication command at
all, it drops a provisioned device from the widget secret store. It lives
here because ``owners`` is what surfaces that store to a human, so the list
and the way to prune it stay in one file.
"""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.websocket_api import ActiveConnection
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.template import Template, TemplateError

from .complication_store import (
    ComplicationChange,
    ComplicationConflictError,
    ComplicationStore,
    ComplicationStoreError,
)
from .const import COMPLICATION_MAX_SCHEMA_VERSION, DOMAIN
from .history_series import (
    MODE_NUMERIC,
    MODE_STATES,
    HistorySeriesError,
    async_history_series,
    normalize_mode,
)
from .widget_secret_store import DEVICE_KIND_WATCH

_LOGGER = logging.getLogger(__name__)

_CMD_OWNERS = f"{DOMAIN}/complications/owners"
_CMD_LIST = f"{DOMAIN}/complications/list"
_CMD_GET = f"{DOMAIN}/complications/get"
_CMD_SAVE = f"{DOMAIN}/complications/save"
_CMD_DELETE = f"{DOMAIN}/complications/delete"
_CMD_SUBSCRIBE = f"{DOMAIN}/complications/subscribe"
_CMD_MOVE_OWNER = f"{DOMAIN}/complications/move_owner"
_CMD_RENDER = f"{DOMAIN}/complications/render_values"
_CMD_HISTORY = f"{DOMAIN}/complications/history_series"
_CMD_NUDGE = f"{DOMAIN}/complications/nudge"
_CMD_FORGET = f"{DOMAIN}/devices/forget"


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
    websocket_api.async_register_command(hass, ws_move_owner)
    websocket_api.async_register_command(hass, ws_render_values)
    websocket_api.async_register_command(hass, ws_history_series)
    websocket_api.async_register_command(hass, ws_nudge)
    websocket_api.async_register_command(hass, ws_forget_device)


@websocket_api.websocket_command({vol.Required("type"): _CMD_OWNERS})
@callback
def ws_owners(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Every provisioned watch, with how many live complications it owns.

    Owners come from the widget secret store (a watch self-provisions under
    its own id), not from the complication store, so a watch with nothing
    saved yet still shows up as a target for the first complication.

    Names come from HA's device registry first and the secret store second.
    The store holds what the watch reported at provision time, which on
    current watchOS is the plain model name rather than anything per-device,
    so two watches in one household can arrive with the same one. The
    registry holds whatever the user renamed the device to, and
    ``paired_iphone_name`` tells apart the two that are still called the
    same thing.
    """
    domain_data = hass.data.get(DOMAIN)
    if domain_data is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    store: ComplicationStore = domain_data.complication_store
    secret_store = domain_data.widget_secret_store
    device_registry = dr.async_get(hass)

    def registry_name(device_id: str) -> str | None:
        """What HA calls this device, honouring a manual rename."""
        device = device_registry.async_get_device(
            identifiers={(DOMAIN, f"watch_{device_id}")}
        )
        if device is None:
            return None
        return device.name_by_user or device.name

    owners: list[dict[str, Any]] = []
    seen: set[str] = set()
    for device_id, entry in secret_store.all_entries.items():
        if entry.device_kind != DEVICE_KIND_WATCH:
            continue
        seen.add(device_id)
        paired_id = entry.owner_iphone_id
        paired_name: str | None = None
        if paired_id:
            paired_entry = secret_store.get(paired_id)
            paired_name = registry_name(paired_id) or (
                paired_entry.device_name if paired_entry is not None else None
            )
        owners.append(
            {
                "owner_watch_id": device_id,
                "device_name": registry_name(device_id) or entry.device_name,
                "paired_iphone_name": paired_name,
                "app_version": entry.app_version,
                "screen_size": entry.screen_size,
                "complication_count": len(store.list(device_id)),
                "token": store.owner_token(device_id),
                "is_orphan": False,
            }
        )
    # An owner whose watch entry was removed still has records; list it so
    # the data is reachable rather than orphaned. `is_orphan` is what the
    # panel offers the Move action on, so it says so rather than making the
    # browser infer it from a missing name.
    for owner in store.owners():
        if owner in seen or store.is_empty(owner):
            continue
        owners.append(
            {
                "owner_watch_id": owner,
                "device_name": None,
                "paired_iphone_name": None,
                "app_version": None,
                "screen_size": None,
                "complication_count": len(store.list(owner)),
                "token": store.owner_token(owner),
                "is_orphan": True,
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


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_FORGET,
        vol.Required("watch_id"): str,
        vol.Optional("force", default=False): bool,
    }
)
@callback
def ws_forget_device(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Drop one provisioned device from the widget secret store.

    The same teardown ``async_remove_config_entry_device`` performs when an
    admin deletes the device from HA's UI, reachable without a device
    registry entry to click on. That matters for anything that provisions an
    id and then wants it gone again: the HTTP test suite registers throwaway
    identities on every run, and without this each run left an entry behind
    that the ``owners`` list then offered as a real watch.

    A device that still holds a push token or a live complication is refused
    with ``in_use`` unless ``force`` is set, so a mistyped id cannot silently
    unregister somebody's watch. Removal is not reversible: the device has to
    re-provision, which the app does on its next foreground identity check.
    """
    domain_data = hass.data.get(DOMAIN)
    if domain_data is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return

    watch_id = msg["watch_id"]
    if domain_data.widget_secret_store.get(watch_id) is None:
        connection.send_error(
            msg["id"], "not_found", f"no registered device with id {watch_id}"
        )
        return

    if not msg["force"]:
        blockers: list[str] = []
        if domain_data.notification_store.get_entries(watch_id):
            blockers.append("a registered push token")
        if not domain_data.complication_store.is_empty(watch_id):
            blockers.append("live complications")
        if blockers:
            connection.send_error(
                msg["id"],
                "in_use",
                f"{watch_id} still has {' and '.join(blockers)}; "
                "pass force to remove it anyway",
            )
            return

    domain_data.widget_secret_store.remove(watch_id)
    domain_data.notification_store.remove(watch_id)

    # Removing the store entry strips the device's entities on the next
    # listener pass, but the device registry record itself would linger as an
    # empty shell until a restart pruned it. Drop it here so the UI matches
    # the store, exactly as the UI-initiated removal leaves things.
    device_registry = dr.async_get(hass)
    device = device_registry.async_get_device(
        identifiers={(DOMAIN, f"watch_{watch_id}")}
    )
    if device is not None:
        device_registry.async_remove_device(device.id)

    _LOGGER.info("Forgot device watch_id=%s (force=%s)", watch_id, msg["force"])
    connection.send_result(
        msg["id"],
        {
            "ok": True,
            "watch_id": watch_id,
            "device_removed": device is not None,
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
    domain_data = hass.data.get(DOMAIN)
    coordinator = domain_data.coordinator if domain_data is not None else None
    connection.send_result(
        msg["id"],
        {
            "owner_watch_id": owner,
            "token": store.owner_token(owner),
            # The token the watch last said it applied. Equal to `token`
            # means everything here is on the wrist ("Send to watch" is
            # green); anything else means not yet.
            "applied_token": store.applied_token(owner),
            # Whether this watch holds a long-poll on this server right now,
            # which is the only way a save can reach it without the user
            # tapping Sync now on the watch.
            "polling": bool(coordinator and coordinator.is_polling(owner)),
            "max_schema_version": COMPLICATION_MAX_SCHEMA_VERSION,
            # iPhone presets on this watch (slot + name, its last sync
            # report). The panel's auto-assigner must skip these slots (a
            # custom written under a preset is masked at render time) and
            # lists the presets by name as locked rows.
            "presets": store.presets(owner),
            # Every slot something other than this server's records holds:
            # the presets above plus customs on another home, each with a
            # kind and a home name. The panel lists them as locked rows and
            # its auto-assigner skips them all.
            "occupied": store.occupied(owner),
            # Watch-app pages (id + name, watch order), for the "Open the
            # page" tap-action picker.
            "pages": store.pages(owner),
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
    """Push every commit (save, delete, restore) and every watch ack to the
    panel as an event.

    Lets a second tab or a second admin see that the record they hold is now
    stale before they try to save it, and lets "Send to watch" go green the
    moment the watch reports the token it applied (``record`` is null on
    those, ``applied_token`` carries the news). Optional owner filter.
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
                    "record": change.record.as_dict() if change.record else None,
                    "applied_token": change.applied_token,
                },
            )
        )

    connection.subscriptions[msg["id"]] = store.async_add_listener(_on_change)
    connection.send_result(msg["id"], {"token": store.token})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_NUDGE,
        vol.Required("owner_watch_id"): str,
    }
)
@callback
def ws_nudge(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """The panel's "Send to watch": wake the watch's parked long-poll so it
    is handed the current token again.

    Changes nothing in the store. A watch that already applied the current
    token gets nothing from it; the ack that turns the button green arrives
    on the watch's next poll request either way. ``polling`` in the reply is
    whether there was a poll to wake at all.
    """
    domain_data = hass.data.get(DOMAIN)
    if domain_data is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    owner = msg["owner_watch_id"]
    coordinator = domain_data.coordinator
    polling = coordinator.is_polling(owner)
    coordinator.wake_watch(owner, renotify=True)
    connection.send_result(
        msg["id"],
        {
            "polling": polling,
            "token": domain_data.complication_store.owner_token(owner),
            "applied_token": domain_data.complication_store.applied_token(owner),
        },
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_MOVE_OWNER,
        vol.Required("source_owner_watch_id"): str,
        vol.Required("target_owner_watch_id"): str,
    }
)
@callback
def ws_move_owner(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Hand one watch's complications to another watch.

    Reinstalling the watch app can change the id the watch signs with, which
    leaves its complications under an owner no device answers for. ``owners``
    lists such an owner as an orphan; this is the only way to get its records
    back onto a watch, because Restore cannot help once the reinstall has
    wiped the watch's own copies.

    The target does not have to be a registered watch. The panel only offers
    registered ones, but refusing an unregistered id here would make the
    command useless in exactly the situation it exists for: a watch that has
    not re-provisioned yet.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    user = connection.user
    updated_by = f"ha-panel:{user.name or user.id}" if user else "ha-panel"
    target = msg["target_owner_watch_id"]
    try:
        records = store.move_owner(
            msg["source_owner_watch_id"], target, updated_by=updated_by
        )
    except ComplicationStoreError as err:
        _send_store_error(connection, msg["id"], err)
        return
    connection.send_result(
        msg["id"],
        {
            "records": [record.as_dict() for record in records],
            "token": store.owner_token(target),
        },
    )


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


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_HISTORY,
        vol.Required("requests"): {
            str: {
                vol.Required("entity_id"): str,
                vol.Required("minutes"): int,
                vol.Required("points"): int,
                # Absent means numeric, which is what every caller before the
                # state timeline asked for.
                vol.Optional("mode"): vol.In([MODE_NUMERIC, MODE_STATES]),
            }
        },
    }
)
@websocket_api.async_response
async def ws_history_series(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Recorder history for the preview's chart layers, one series per key.

    The browser cannot answer this from ``hass.states``: a state object knows
    only the present. It could call HA's own history API and bucket the rows
    itself, but then the editor's arithmetic and the watch's would be two
    implementations of the same average, free to drift. This runs the module
    the watch's signed ``op=history`` runs, so what the preview draws is what
    the wrist draws.

    Keys are the caller's own; the reply mirrors them. Each resolves
    independently, so one entity with no recorder coverage does not blank the
    other charts: ``{key: {ok, series}}`` or ``{key: {ok: false, error}}``.
    """
    results: dict[str, dict[str, Any]] = {}
    for key, request in msg["requests"].items():
        entity_id = request["entity_id"]
        if not entity_id:
            results[key] = {"ok": False, "error": "entity_id required"}
            continue
        try:
            series = await async_history_series(
                hass,
                entity_id,
                request["minutes"],
                request["points"],
                mode=normalize_mode(request.get("mode")),
            )
        except HistorySeriesError as err:
            results[key] = {"ok": False, "error": str(err)}
            continue
        results[key] = {"ok": True, "series": series}
    connection.send_result(msg["id"], {"results": results})
