"""WebSocket API for the custom complication editor panel.

The HA frontend panel is the only editor of custom complications. It talks to
this module over the authenticated WebSocket the frontend already holds; every
command requires an HA administrator, reads included. The panel itself is
admin-only, and the reads carry the whole slot pool of every watch in the
house plus rendered templates, so a non-admin household member has no reason
to reach them. The watch never uses these commands; it pulls over the
HMAC-signed ``/v2/action`` ops in ``wa_v2_views.py``.

Commands:

    wrist_assistant/complications/owners
    wrist_assistant/devices/forget            {watch_id, force?}
    wrist_assistant/complications/list        {owner_watch_id}
    wrist_assistant/complications/get         {owner_watch_id, id}
    wrist_assistant/complications/save        {owner_watch_id, document, base_revision?}
    wrist_assistant/complications/delete      {owner_watch_id, id, base_revision?}
    wrist_assistant/complications/subscribe   {owner_watch_id?}
    wrist_assistant/complications/history     {owner_watch_id, complication_id}
    wrist_assistant/complications/history_get {owner_watch_id, complication_id,
                                               revision}
    wrist_assistant/complications/history_restore
                                              {owner_watch_id, complication_id,
                                               revision, base_revision?}
    wrist_assistant/complications/move_owner  {source_owner_watch_id,
                                               target_owner_watch_id}
    wrist_assistant/complications/watch_status {owner_watch_id}
    wrist_assistant/complications/render_values {templates: {key: jinja}}
    wrist_assistant/complications/history_series
                                              {requests: {key: {entity_id,
                                                                minutes,
                                                                points}}}
    wrist_assistant/complications/statistics_series
                                              {requests: {key: {entity_id,
                                                                minutes,
                                                                period,
                                                                type}}}
    wrist_assistant/complications/list_items
                                              {requests: {key: {source,
                                                                entities |
                                                                entity_id,
                                                                hours | status |
                                                                sort | type,
                                                                limit}}}
    wrist_assistant/gallery_key

``save`` is all-or-nothing: the browser submits the whole document plus the
revision it loaded. A mismatch returns error code ``conflict`` with the
current record so the panel can offer reload / save-as-copy / discard. There
is deliberately no force flag; last-write-wins is not a path that exists.

The three ``history`` commands are the panel's save history: the list carries
no document bodies, ``history_get`` fetches one for the preview, and
``history_restore`` writes an old body back through ``save`` as a new
revision, so putting a restore back is itself one more entry rather than a
special case. Not to be confused with ``history_series``, which is recorder
data for a chart.

``devices/forget`` is the odd one out: it is not a complication command at
all, it drops a provisioned device from the widget secret store. It lives
here because ``owners`` is what surfaces that store to a human, so the list
and the way to prune it stay in one file.

``gallery_key`` hands the panel the random key it sends to the complication
gallery (see ``gallery_key_store.py``). Admin-only like the rest: the key is
what lets someone delete this home's gallery uploads.
"""

from __future__ import annotations

import logging
from copy import deepcopy
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.websocket_api import ActiveConnection
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.template import Template, TemplateError
from homeassistant.util import dt as dt_util

from .bundle_ops import template_text as _template_text
from .complication_store import (
    ComplicationChange,
    ComplicationConflictError,
    ComplicationStore,
    ComplicationStoreError,
)
from .const import COMPLICATION_MAX_SCHEMA_VERSION, DOMAIN
from .history_series import (
    COMBINE_ALL,
    COMBINE_ANY,
    MODE_NUMERIC,
    MODE_STATES,
    HistorySeriesError,
    async_history_series_detail,
    normalize_combine,
    normalize_mode,
)
from .list_items import (
    FORECAST_TYPES,
    SORTS,
    STATUSES,
    ListItemsError,
    async_list_items,
)
from .statistics_series import (
    PERIODS,
    STAT_TYPES,
    StatisticsSeriesError,
    async_statistics_series,
)
from .gallery_key_store import gallery_key_store
from .widget_secret_store import DEVICE_KIND_IPHONE

_LOGGER = logging.getLogger(__name__)

_CMD_OWNERS = f"{DOMAIN}/complications/owners"
_CMD_LIST = f"{DOMAIN}/complications/list"
_CMD_GET = f"{DOMAIN}/complications/get"
_CMD_SAVE = f"{DOMAIN}/complications/save"
_CMD_DELETE = f"{DOMAIN}/complications/delete"
_CMD_SUBSCRIBE = f"{DOMAIN}/complications/subscribe"
_CMD_MOVE_OWNER = f"{DOMAIN}/complications/move_owner"
_CMD_RENDER = f"{DOMAIN}/complications/render_values"
# The save history of one record. Named apart from `_CMD_HISTORY` below, which
# is recorder data for a chart and has nothing to do with past revisions.
_CMD_SAVE_HISTORY = f"{DOMAIN}/complications/history"
_CMD_SAVE_HISTORY_GET = f"{DOMAIN}/complications/history_get"
_CMD_SAVE_HISTORY_RESTORE = f"{DOMAIN}/complications/history_restore"
_CMD_HISTORY = f"{DOMAIN}/complications/history_series"
_CMD_STATISTICS = f"{DOMAIN}/complications/statistics_series"
_CMD_LIST_ITEMS = f"{DOMAIN}/complications/list_items"
_CMD_NUDGE = f"{DOMAIN}/complications/nudge"
_CMD_WATCH_STATUS = f"{DOMAIN}/complications/watch_status"
_CMD_FORGET = f"{DOMAIN}/devices/forget"
_CMD_GALLERY_KEY = f"{DOMAIN}/gallery_key"


def _store(hass: HomeAssistant) -> ComplicationStore | None:
    domain_data = hass.data.get(DOMAIN)
    if domain_data is None:
        return None
    return domain_data.complication_store


def _seconds_since_poll(hass: HomeAssistant, coordinator: Any, owner: str) -> float | None:
    """How long since this watch last polled, in seconds, or None.

    The coordinator's own clock is the live answer, but it lives in memory, so
    a restart wipes it and the chip would fall back to the very claim this is
    here to stop: a green "On watch" about a watch nobody has heard from. The
    watch's Last activity sensor is a RestoreSensor holding the same moment
    across restarts, so it answers for the gap until the watch polls again.
    """
    live = coordinator.seconds_since_poll(owner) if coordinator else None
    if live is not None:
        return live
    entity_id = er.async_get(hass).async_get_entity_id(
        "sensor", DOMAIN, f"wrist_assistant_{owner}_last_activity"
    )
    if entity_id is None:
        return None
    state = hass.states.get(entity_id)
    if state is None:
        return None
    seen = dt_util.parse_datetime(state.state)
    if seen is None:
        return None
    return max(0.0, (dt_util.utcnow() - seen).total_seconds())


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
    websocket_api.async_register_command(hass, ws_save_history)
    websocket_api.async_register_command(hass, ws_save_history_get)
    websocket_api.async_register_command(hass, ws_save_history_restore)
    websocket_api.async_register_command(hass, ws_move_owner)
    websocket_api.async_register_command(hass, ws_render_values)
    websocket_api.async_register_command(hass, ws_history_series)
    websocket_api.async_register_command(hass, ws_statistics_series)
    websocket_api.async_register_command(hass, ws_list_items)
    websocket_api.async_register_command(hass, ws_nudge)
    websocket_api.async_register_command(hass, ws_watch_status)
    websocket_api.async_register_command(hass, ws_forget_device)
    websocket_api.async_register_command(hass, ws_gallery_key)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): _CMD_GALLERY_KEY})
@websocket_api.async_response
async def ws_gallery_key(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """The key the panel sends to the complication gallery.

    Made on the first request and kept after that. Never the instance UUID:
    the gallery is public, and the key should identify the uploads and nothing
    else.
    """
    key = await gallery_key_store(hass).async_get_key()
    connection.send_result(msg["id"], {"key": key})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): _CMD_OWNERS})
@callback
def ws_owners(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Every provisioned device, with how many live complications it owns.

    Owners come from the widget secret store (a device self-provisions under
    its own id), not from the complication store, so a watch with nothing
    saved yet still shows up as a target for the first complication.

    iPhones are owners too, because the phone draws its own complications on
    the lock screen rather than mirroring the watch's. ``device_kind`` says
    which is which, and is null on an orphan row, where no store entry is left
    to ask. The panel reads it to decide which shapes to offer (no corner on a
    phone) and what the send state can say (a phone holds no long-poll, so a
    save reaches it as a background push rather than a wake, and only when
    this server holds its token). Watches sort first so the list a household
    with one phone and one watch sees does not reorder itself.

    Names come from HA's device registry first and the secret store second.
    The store holds what the device reported at provision time, which on
    current watchOS is the plain model name rather than anything per-device,
    so two watches in one household can arrive with the same one. The
    registry holds whatever the user renamed the device to, and
    ``paired_iphone_name`` tells apart the two that are still called the
    same thing. One lookup serves both kinds: ``build_device_info`` registers
    an iPhone under the same ``watch_<id>`` identifier a watch gets.
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
                "device_kind": entry.device_kind,
                "device_name": registry_name(device_id) or entry.device_name,
                "paired_iphone_name": paired_name,
                "app_version": entry.app_version,
                "screen_size": entry.screen_size,
                "complication_count": len(store.list(device_id)),
                "token": store.owner_token(device_id),
                # Null when this watch has never reported an applied token:
                # its app predates custom complications, or it has not opened
                # this home yet. Either way nothing sent here reaches it.
                "applied_token": store.applied_token(device_id),
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
                # Null rather than "watch": the entry that would have said is
                # the one that went missing, and a guess here would send the
                # panel's shape list and gate down the wrong branch.
                "device_kind": None,
                "device_name": None,
                "paired_iphone_name": None,
                "app_version": None,
                "screen_size": None,
                "complication_count": len(store.list(owner)),
                "token": store.owner_token(owner),
                "applied_token": store.applied_token(owner),
                "is_orphan": True,
            }
        )
    # Watches first, then phones, each block by name. An orphan sorts with the
    # watches, which is where it has always sorted; its records were a watch's
    # until the entry disappeared.
    owners.sort(
        key=lambda o: (
            o["device_kind"] == DEVICE_KIND_IPHONE,
            o["device_name"] or "",
            o["owner_watch_id"],
        )
    )
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
    re-provision, which the app does on its next foreground identity check,
    and everything the complication store held for it is erased rather than
    tombstoned (see ``ComplicationStore.forget_owner``).
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
    # Its complications go too: records, presets, pages, occupied slots and
    # the applied token. Leaving them behind is what made a forgotten watch
    # come back as an orphan owner on the next `owners` call, holding rows
    # nothing could ever deliver.
    purged = domain_data.complication_store.forget_owner(watch_id)

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
            "complications_removed": purged,
        },
    )


@websocket_api.require_admin
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
            # green); a lower number means not yet; null means this watch has
            # never acked at all, so there is nothing here to wake.
            "applied_token": store.applied_token(owner),
            # Whether this watch holds a long-poll on this server right now,
            # which is the only way a save can reach it without the user
            # tapping Sync now on the watch.
            "polling": bool(coordinator and coordinator.is_polling(owner)),
            # Seconds since the watch last polled, or null when it has not
            # polled since this server started. "On watch" is true forever
            # once the tokens match, so this is what stops a green tick from
            # implying a watch that went flat two hours ago is still listening.
            "last_poll_seconds": _seconds_since_poll(hass, coordinator, owner),
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


@websocket_api.require_admin
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


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_SAVE_HISTORY,
        vol.Required("owner_watch_id"): str,
        vol.Required("complication_id"): str,
    }
)
@callback
def ws_save_history(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Past revisions of one record, newest first, with no document bodies.

    The bodies are what makes a history expensive to send, and the list only
    needs enough to tell two entries apart. The preview fetches one at a time
    through ``history_get``.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    owner = msg["owner_watch_id"]
    record_id = msg["complication_id"].upper()
    record = store.get(owner, record_id)
    if record is None:
        connection.send_error(msg["id"], "not_found", "no such complication")
        return
    connection.send_result(
        msg["id"],
        {
            "owner_watch_id": owner,
            "complication_id": record_id,
            # The revision the record is on now. It is not in `entries`: it is
            # what the editor already has open.
            "revision": record.revision,
            "entries": [entry.summary() for entry in store.history(owner, record_id)],
        },
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_SAVE_HISTORY_GET,
        vol.Required("owner_watch_id"): str,
        vol.Required("complication_id"): str,
        vol.Required("revision"): int,
    }
)
@callback
def ws_save_history_get(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """One past revision's document, for the history dialog's preview."""
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    entry = store.history_entry(
        msg["owner_watch_id"], msg["complication_id"].upper(), msg["revision"]
    )
    if entry is None:
        connection.send_error(msg["id"], "not_found", "no such revision")
        return
    connection.send_result(
        msg["id"], {"entry": {**entry.summary(), "document": entry.document}}
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_SAVE_HISTORY_RESTORE,
        vol.Required("owner_watch_id"): str,
        vol.Required("complication_id"): str,
        vol.Required("revision"): int,
        vol.Optional("base_revision"): vol.Any(int, None),
    }
)
@callback
def ws_save_history_restore(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Put a past revision back, as a new one.

    Nothing rewinds: the old body is saved through the ordinary ``save`` path
    on top of the record's current revision, so the restore is a revision of
    its own and the revision it replaced becomes the newest history entry.
    Undoing a restore is then just another restore.

    ``base_revision`` is optional and defaults to whatever the record is on.
    A panel that sends the revision it has open gets the usual conflict reply
    when someone else saved first.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    owner = msg["owner_watch_id"]
    record_id = msg["complication_id"].upper()
    current = store.get(owner, record_id)
    if current is None:
        connection.send_error(msg["id"], "not_found", "no such complication")
        return
    entry = store.history_entry(owner, record_id, msg["revision"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "no such revision")
        return
    base_revision = msg.get("base_revision")
    if base_revision is None:
        base_revision = current.revision
    user = connection.user
    updated_by = f"ha-panel:{user.name or user.id}" if user else "ha-panel"
    try:
        record = store.save(
            owner,
            # The stored entry must survive a save that mutates what it is
            # handed, so the restore works on a copy of it.
            deepcopy(entry.document),
            base_revision=base_revision,
            updated_by=updated_by,
        )
    except ComplicationStoreError as err:
        _send_store_error(connection, msg["id"], err)
        return
    connection.send_result(
        msg["id"],
        {"ok": True, "record": record.as_dict(), "restored_revision": entry.revision},
    )


@websocket_api.require_admin
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
        vol.Required("type"): _CMD_WATCH_STATUS,
        vol.Required("owner_watch_id"): str,
    }
)
@callback
def ws_watch_status(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Just the owner's reachability, for the panel's header chip.

    The panel used to learn this only from a list reply, and a list arrives on
    a change or a save. Nothing fires when a watch simply stops polling or
    starts again, so a chip opened next to a watch on the wrist kept saying so
    for as long as the tab stayed open. This is the same few fields without
    the records, cheap enough to ask for on a timer.

    ``last_sync_seconds`` is the phone's answer to ``last_poll_seconds``. An
    iPhone owner holds no long-poll, so ``polling`` is always false and
    ``last_poll_seconds`` always null for one. What reaches a phone is a
    background push instead: ``push_available`` says whether this server holds
    a token to send one to, and ``last_push_seconds`` says how long ago it last
    tried. Both are false and null for a watch owner, which is woken rather
    than pushed.
    """
    domain_data = hass.data.get(DOMAIN)
    if domain_data is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    owner = msg["owner_watch_id"]
    coordinator = domain_data.coordinator
    store = domain_data.complication_store
    push = domain_data.complication_push
    connection.send_result(
        msg["id"],
        {
            "polling": coordinator.is_polling(owner),
            "last_poll_seconds": _seconds_since_poll(hass, coordinator, owner),
            "last_sync_seconds": store.seconds_since_sync(owner),
            "token": store.owner_token(owner),
            "applied_token": store.applied_token(owner),
            # Whether a save to this owner can reach a phone at all: an iPhone
            # owner this server holds an APNs token for. False for every watch,
            # and false for a phone that has never registered one, which is
            # what the panel turns into "open the app on it once".
            "push_available": push is not None and push.push_available(owner),
            # Seconds since the last push attempt for this owner, this HA run.
            # Null when there has been none; the stamp is in memory with the
            # rate limit it feeds.
            "last_push_seconds": push.seconds_since_push(owner) if push else None,
        },
    )


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
    """The panel's "Send to watch" and its "Refresh now" for a phone.

    For a watch this wakes the parked long-poll so the watch is handed the
    current token again. Changes nothing in the store: a watch that already
    applied the current token gets nothing from it, and the ack that turns the
    button green arrives on the watch's next poll request either way.
    ``polling`` is whether there was a poll to wake at all.

    For an iPhone owner there is no poll to wake, so this sends the background
    push instead, at once, past both of the timers a save goes through.
    ``pushed`` is whether one was dispatched and ``push_available`` whether
    this server holds a token to dispatch it to; both are false for a watch.
    Nothing here waits for the phone. The relay answers later and the phone
    acks later still, on the pull the push asks it to make, which is the same
    ack the panel already watches for.

    An owner that can be neither woken nor pushed is answered, not refused:
    false in every flag and nothing done. That covers a watch out of range and
    a phone that has not registered a token yet.
    """
    domain_data = hass.data.get(DOMAIN)
    if domain_data is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    owner = msg["owner_watch_id"]
    coordinator = domain_data.coordinator
    polling = coordinator.is_polling(owner)
    coordinator.wake_watch(owner, renotify=True)
    push = domain_data.complication_push
    push_available = push is not None and push.push_available(owner)
    connection.send_result(
        msg["id"],
        {
            "polling": polling,
            "last_poll_seconds": _seconds_since_poll(hass, coordinator, owner),
            "token": domain_data.complication_store.owner_token(owner),
            "applied_token": domain_data.complication_store.applied_token(owner),
            "pushed": push.push_now(owner, "refresh") if push_available else False,
            "push_available": push_available,
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


@websocket_api.require_admin
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
    ``{key: {ok: false, error}}``. Renders exactly as the watch's signed
    ``template`` op does, ``parse_result`` included, and flattens the native
    result to text the way the watch's decoder does (``bundle_ops``'s
    ``template_text``, which ``op=bundle`` uses too), so the browser and the
    wrist read one string rather than two formattings of one render.
    """
    results: dict[str, dict[str, Any]] = {}
    for key, template_str in msg["templates"].items():
        if not template_str.strip():
            results[key] = {"ok": False, "error": "empty template"}
            continue
        try:
            value = Template(template_str, hass).async_render(parse_result=True)
        except TemplateError as err:
            results[key] = {"ok": False, "error": str(err)}
            continue
        results[key] = {"ok": True, "value": _template_text(value)}
    connection.send_result(msg["id"], {"results": results})


@websocket_api.require_admin
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
                vol.Optional("gaps", default=False): bool,
                # An aggregate timeline: these entities merged into one strip.
                # Absent is the single-entity query every caller made before.
                vol.Optional("entities"): [str],
                vol.Optional("combine"): vol.In([COMBINE_ANY, COMBINE_ALL]),
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

    A numeric every-reading request (``points`` 0) also gets ``readings``, the
    count found in the span, and ``averaged``, true when there were more than
    fit and the server averaged the span instead. The editor explains the
    averaging from these; the watch's signed reply never carries them.
    """
    results: dict[str, dict[str, Any]] = {}
    for key, request in msg["requests"].items():
        entity_id = request["entity_id"]
        if not entity_id:
            results[key] = {"ok": False, "error": "entity_id required"}
            continue
        try:
            fetched = await async_history_series_detail(
                hass,
                entity_id,
                request["minutes"],
                request["points"],
                mode=normalize_mode(request.get("mode")),
                gaps=request["gaps"],
                # An aggregate timeline merges these into one strip; the cap
                # above twenty comes back as this key's own error rather than
                # blanking the other layers' series.
                entities=request.get("entities"),
                combine=normalize_combine(request.get("combine")),
            )
        except HistorySeriesError as err:
            results[key] = {"ok": False, "error": str(err)}
            continue
        result: dict[str, Any] = {"ok": True, "series": fetched.series}
        if fetched.readings is not None:
            result["readings"] = fetched.readings
            result["averaged"] = bool(fetched.averaged)
        results[key] = result
    connection.send_result(msg["id"], {"results": results})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_STATISTICS,
        vol.Required("requests"): {
            str: {
                vol.Required("entity_id"): str,
                vol.Required("minutes"): int,
                vol.Required("period"): vol.In(list(PERIODS)),
                vol.Required("type"): vol.In(list(STAT_TYPES)),
                vol.Optional("gaps", default=False): bool,
            }
        },
    }
)
@websocket_api.async_response
async def ws_statistics_series(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Long-term statistics for the preview's chart layers, one series per key.

    The sibling of ``history_series`` and the same bargain: the browser runs
    the module the watch's signed ``op=statistics`` runs, so the editor's
    hourly energy bars and the wrist's are one implementation rather than two
    that are free to drift.

    ``period`` and ``type`` are validated here rather than normalised,
    because the panel writes them from its own fixed pickers; a spelling this
    module does not serve is a panel bug worth seeing. The watch's op is the
    forgiving side, since it replays whatever a stored document holds.

    Keys are the caller's own; the reply mirrors them. Each resolves
    independently, so one entity with no statistics does not blank the other
    charts: ``{key: {ok, series}}`` or ``{key: {ok: false, error}}``.
    """
    results: dict[str, dict[str, Any]] = {}
    for key, request in msg["requests"].items():
        entity_id = request["entity_id"]
        if not entity_id:
            results[key] = {"ok": False, "error": "entity_id required"}
            continue
        try:
            series = await async_statistics_series(
                hass,
                entity_id,
                request["minutes"],
                request["period"],
                request["type"],
                gaps=request["gaps"],
            )
        except StatisticsSeriesError as err:
            results[key] = {"ok": False, "error": str(err)}
            continue
        results[key] = {"ok": True, "series": series}
    connection.send_result(msg["id"], {"results": results})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_LIST_ITEMS,
        vol.Required("requests"): {
            str: {
                # Checked in the handler rather than with `vol.In`, so a
                # source this command does not serve comes back as that one
                # key's error instead of failing the whole message.
                vol.Required("source"): str,
                vol.Optional("entities"): [str],
                vol.Optional("entity_id"): str,
                vol.Optional("hours"): int,
                vol.Optional("status"): vol.In(list(STATUSES)),
                vol.Optional("sort"): vol.In(list(SORTS)),
                vol.Optional("type"): vol.In(list(FORECAST_TYPES)),
                vol.Optional("limit"): int,
            }
        },
    }
)
@websocket_api.async_response
async def ws_list_items(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Calendar, to-do and forecast rows for the preview's list layers.

    The third sibling of ``history_series`` and ``statistics_series``, and the
    same bargain: the browser runs the module the watch's signed ``op=list``
    runs, so the rows the editor lays out are the rows the wrist draws, capped
    and sorted the same way.

    Only the three service-backed sources come through here. A list whose
    source is ``entities``, ``attribute`` or ``template`` is Jinja, and its
    items arrive with the rest of the face's rendered values through
    ``render_values``; asking for one here is a panel bug worth seeing, so it
    comes back as that key's error rather than quietly returning nothing.

    Keys are the caller's own; the reply mirrors them. Each resolves
    independently, so one calendar the user has since removed does not blank
    the other lists: ``{key: {ok, items, total}}`` or
    ``{key: {ok: false, error}}``. ``total`` is the count before the row slice,
    which is what a ``listStat total`` draws.
    """
    results: dict[str, dict[str, Any]] = {}
    for key, request in msg["requests"].items():
        try:
            fetched = await async_list_items(hass, request)
        except ListItemsError as err:
            results[key] = {"ok": False, "error": str(err)}
            continue
        except HomeAssistantError as err:
            results[key] = {"ok": False, "error": str(err)}
            continue
        results[key] = {"ok": True, "items": fetched.items, "total": fetched.total}
    connection.send_result(msg["id"], {"results": results})
