"""WebSocket commands for the panel's Watch settings view, and the phone's
watch config live line.

The panel reads a watch's stored config, saves it, and lists and restores its
history over the authenticated WebSocket the frontend already holds, the same
way the complication editor talks to ``complication_ws.py``. The devices never
read or write through these; they use the signed ``watch_config_get`` /
``watch_config_put`` ops in ``wa_v2_views.py``.

The panel is open to every signed-in user. A read hands out a watch's whole
page config, so every command that names a watch (``owner_watch_id``, or
``watch_id`` for the voice list) is allowed only for one the caller may
manage (``may_manage_owner`` in ``panel_access.py``): an administrator any
watch, anyone else a device bound to their own user. Anything else is
refused ``unauthorized`` before it is read. ``summary`` answers an
administrator about every watch and anyone else about their own.

``subscribe`` is the iPhone app's live line over its own WebSocket, so that a
panel save reaches it while it is open rather than on its next foreground.
All it is ever told is revision numbers, the same way
``complications/owner_subscribe`` tells it only tokens. The documents still
travel only over the signed get. It follows the same owner rule.

Commands:

    wrist_assistant/watch_config/get            {owner_watch_id, kind}
    wrist_assistant/watch_config/summary        {}
    wrist_assistant/watch_config/save           {owner_watch_id, kind,
                                                 base_revision, document}
    wrist_assistant/watch_config/history        {owner_watch_id, kind}
    wrist_assistant/watch_config/history_entry  {owner_watch_id, kind, revision}
    wrist_assistant/watch_config/restore        {owner_watch_id, kind, revision,
                                                 base_revision}
    wrist_assistant/watch_config/subscribe      {owner_watch_id}
    wrist_assistant/watch_voices/get            {watch_id}
    wrist_assistant/watch_pages/link            {source_id, units, targets,
                                                 kind: "voice", replace?}
    wrist_assistant/watch_pages/places          {kind?: "voice"}
    wrist_assistant/library/pick                {owner_id, kind, item_id, on? | unit?}
    wrist_assistant/library/menus/create        {unit, name, sections}
    wrist_assistant/library/menus/copy          {owner_id, unit, name}
    wrist_assistant/library/menus/rename        {item_id, name}
    wrist_assistant/library/menus/delete        {item_id}
    wrist_assistant/library/delete              {kind, item_id}
    wrist_assistant/library/summary             {}

(The item is ``item_id``, where the plan says ``id``: a WebSocket message's
own ``id`` is its message number.)

Pages, status pages and menus live once, in the home's library
(``library.py``), and each device picks from it; its records are built from
the library and its picks. The ``library/*`` commands tick and untick items
on devices, make, copy, rename and delete menus, delete items, and list the
whole library with who picks what. Only a watch's voice settings still link
watch to watch, copy by copy (``page_links.py``): ``watch_pages/link`` and
``watch_pages/places`` serve kind ``voice`` alone and refuse pages, status
pages and menus ``invalid``. A link's refusals add ``unknown_device``,
``unit_taken`` (a target with its own phrase library, unless ``replace``)
and ``awaiting_move`` (a target watch whose iPhone may still move its own
setup here, which a link made first would leave behind).

``watch_voices/get`` is the voice list a watch reported over the signed
``watch_voices_put`` (see ``watch_voices_store.py``), for the panel's Watch
voice picker. It is not a watch config record and has no revision.

Every refusal is a WebSocket error with the store's code: ``invalid``,
``unavailable``, ``no_record``, ``conflict``, ``not_found`` or
``not_for_iphone`` (a kind an iPhone may not own, saved or restored for an
iPhone, see ``WATCH_CONFIG_PHONE_KINDS``), plus ``unauthorized`` for a watch
that is not the caller's (not the store's). A
conflict's
message always begins ``stored revision is <N>``, which is how the panel
learns the revision to reload at; an error carries no data besides its code
and message.
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.websocket_api import ActiveConnection
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr

from .const import DOMAIN, WATCH_CONFIG_PANEL_KINDS
from .device_lookup import paired_device_name
from .listener_relay import (
    HTTP_ACTIONS_DELIVERY,
    WATCH_CONFIG,
    WATCH_CONFIG_DELIVERY,
    listener_relay,
)
from .page_links import LINK_UNITS
from .panel_access import is_admin, may_manage_owner, require_owner
from .watch_config_store import (
    WatchConfigChange,
    WatchConfigDelivery,
    WatchConfigStore,
    WatchConfigStoreError,
    short_hash,
)

if TYPE_CHECKING:
    from .watch_voices_store import WatchVoicesStore

_LOGGER = logging.getLogger(__name__)

_CMD_GET = f"{DOMAIN}/watch_config/get"
_CMD_SUMMARY = f"{DOMAIN}/watch_config/summary"
_CMD_SAVE = f"{DOMAIN}/watch_config/save"
_CMD_HISTORY = f"{DOMAIN}/watch_config/history"
_CMD_HISTORY_ENTRY = f"{DOMAIN}/watch_config/history_entry"
_CMD_RESTORE = f"{DOMAIN}/watch_config/restore"
_CMD_SUBSCRIBE = f"{DOMAIN}/watch_config/subscribe"
_CMD_SUBSCRIBE_DELIVERY = f"{DOMAIN}/watch_config/subscribe_delivery"
_CMD_VOICES_GET = f"{DOMAIN}/watch_voices/get"
_CMD_PAGES_LINK = f"{DOMAIN}/watch_pages/link"
_CMD_PAGES_PLACES = f"{DOMAIN}/watch_pages/places"
_CMD_LIBRARY_PICK = f"{DOMAIN}/library/pick"
_CMD_LIBRARY_MENUS_CREATE = f"{DOMAIN}/library/menus/create"
_CMD_LIBRARY_MENUS_COPY = f"{DOMAIN}/library/menus/copy"
_CMD_LIBRARY_MENUS_RENAME = f"{DOMAIN}/library/menus/rename"
_CMD_LIBRARY_MENUS_DELETE = f"{DOMAIN}/library/menus/delete"
_CMD_LIBRARY_DELETE = f"{DOMAIN}/library/delete"
_CMD_LIBRARY_SUMMARY = f"{DOMAIN}/library/summary"


# The kinds whose documents are a list of items, and the key holding it.
_ITEM_LISTS = {"pages": "pages", "status_pages": "statusPages", "control_center": "entities"}


def _item_count(kind: str, document: Any) -> int | None:
    """How many items a record lists, as its editor lists them, or None for a
    kind that is not a list. The watch's own system pages are not the
    household's, so they are not counted; a missing or malformed list is
    none. The panel's ``watchConfigCount`` reads a document the same way."""
    key = _ITEM_LISTS.get(kind)
    if key is None:
        return None
    items = document.get(key) if isinstance(document, dict) else None
    if not isinstance(items, list):
        return 0
    return sum(
        1
        for item in items
        if isinstance(item, dict) and not (kind == "pages" and item.get("isSystemPage") is True)
    )


def _link_failures(hass: HomeAssistant, owners: list[str]) -> list[dict[str, Any]]:
    """The linked copies a save or restore could not keep in step, as the
    panel names them: ``[{"owner": <id>, "name": <name or null>}]``. The name
    is what its user calls the device (``paired_device_name``), null for an
    owner the secret store does not know."""
    if not owners:
        return []
    secrets = getattr(hass.data.get(DOMAIN), "widget_secret_store", None)
    device_registry = dr.async_get(hass)
    failures: list[dict[str, Any]] = []
    for owner in owners:
        entry = secrets.get(owner) if secrets is not None else None
        name = paired_device_name(device_registry, entry, owner) if entry is not None else None
        failures.append({"owner": owner, "name": name})
    return failures


def _store(hass: HomeAssistant) -> WatchConfigStore | None:
    domain_data = hass.data.get(DOMAIN)
    if domain_data is None:
        return None
    return getattr(domain_data, "watch_config_store", None)


def _may_follow_owner(
    hass: HomeAssistant, connection: ActiveConnection, owner: str
) -> bool:
    """Whether the signed-in user may hear about `owner`'s saves.

    The rule every owner scoped panel command follows, ``may_manage_owner``
    in ``panel_access.py``: an administrator any watch, every signed-in
    user the Library, anyone else only a device bound to their own user.
    Kept under this name for the phone's live line and its tests.
    """
    return may_manage_owner(hass, connection, owner)


def _voices_store(hass: HomeAssistant) -> WatchVoicesStore | None:
    domain_data = hass.data.get(DOMAIN)
    if domain_data is None:
        return None
    return getattr(domain_data, "watch_voices_store", None)


@callback
def async_register_watch_config_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_watch_config_get)
    websocket_api.async_register_command(hass, ws_watch_config_summary)
    websocket_api.async_register_command(hass, ws_watch_config_save)
    websocket_api.async_register_command(hass, ws_watch_config_history)
    websocket_api.async_register_command(hass, ws_watch_config_history_entry)
    websocket_api.async_register_command(hass, ws_watch_config_restore)
    websocket_api.async_register_command(hass, ws_watch_config_subscribe)
    websocket_api.async_register_command(hass, ws_watch_config_subscribe_delivery)
    websocket_api.async_register_command(hass, ws_watch_voices_get)
    websocket_api.async_register_command(hass, ws_watch_pages_link)
    websocket_api.async_register_command(hass, ws_watch_pages_places)
    websocket_api.async_register_command(hass, ws_library_pick)
    websocket_api.async_register_command(hass, ws_library_menus_create)
    websocket_api.async_register_command(hass, ws_library_menus_copy)
    websocket_api.async_register_command(hass, ws_library_menus_rename)
    websocket_api.async_register_command(hass, ws_library_menus_delete)
    websocket_api.async_register_command(hass, ws_library_delete)
    websocket_api.async_register_command(hass, ws_library_summary)


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
             "delivered_revision", "delivered_at",
             "rejected_revision", "rejected_at", "rejected_reason",
             "multiple_pages", "document"?}

    With no record, ``revision``, ``delivered_revision`` and
    ``rejected_revision`` are 0, the strings are null, and there is no
    ``document``: the view's "no record yet" state, which the panel's start
    button (a save over base 0) or the iPhone mirror's first upload ends.
    ``rejected_revision`` equal to ``revision`` means a device fetched this
    save and could not decode it, which outranks delivery; any lower value is
    an old report a later save has replaced, and 0 also follows the device
    confirming it has since read the save. ``rejected_reason`` is the
    device's own words for why, null when it gave none (an older watch app
    never does). ``multiple_pages`` is the plan the watch last said it is on
    (pages only): false on the free plan, null when it never said. Reading
    changes nothing,
    delivery included: the panel is not the device.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not require_owner(hass, connection, msg, msg["owner_watch_id"]):
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
                "rejected_revision": 0,
                "rejected_at": None,
                "rejected_reason": None,
                "multiple_pages": None,
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
            "rejected_revision": record.rejected_revision,
            "rejected_at": record.rejected_at,
            "rejected_reason": record.rejected_reason,
            "multiple_pages": record.multiple_pages,
            "document": record.document,
        },
    )


@websocket_api.websocket_command({vol.Required("type"): _CMD_SUMMARY})
@callback
def ws_watch_config_summary(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Where every watch's panel-written records have got to, in one answer.

    Result: {"owners": {<owner_watch_id>: {<kind>: {"revision", "hash",
             "delivered_revision", "rejected_revision", "items"?}}},
             "http_actions"?: {"revision", "delivered": {<owner id>: <n>}}}

    The panel's Home asks this to say which watches are still waiting, where
    it used to read every record of every watch, document and all. Only
    numbers travel: no document, no names. ``hash`` is the record's short
    hash (``watch_config_store.short_hash``, the first 16 hex digits of its
    SHA-256, null for a record with none), the value the watch is shown
    beside the revision in the delta reply's ``watch_config_hashes``. ``items`` is how many
    the record lists, on the kinds whose editors list items (`_ITEM_LISTS`):
    the pages (the watch's own system pages left out), the status pages and
    the Control Center controls. Home puts it on each watch's card. Only the kinds the panel
    writes are listed, a kind with no record is left out, and so is a watch
    whose stored file could not be read: the panel then says nothing about
    that watch rather than calling it fine. Reading changes nothing.

    ``http_actions`` is the home's one HTTP action library (step 4d batch
    4): its revision and the last revision each device pulled, so Home can
    say which watch still waits for it. It is left out when the library's
    file could not be read, and on an integration that has no library.

    An administrator hears about every watch. Anyone else hears only about
    the watches they may manage (``may_manage_owner``), in ``owners`` and in
    ``http_actions.delivered`` alike, so the two never name a watch the
    other leaves out. The library's ``revision`` is the home's and is the
    same for everyone.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    admin = is_admin(connection)

    def listed(owner: str) -> bool:
        return admin or may_manage_owner(hass, connection, owner)

    owners: dict[str, dict[str, dict[str, Any]]] = {}
    for owner_watch_id in store.owners():
        if not listed(owner_watch_id):
            continue
        kinds: dict[str, dict[str, Any]] = {}
        try:
            for kind in sorted(WATCH_CONFIG_PANEL_KINDS):
                record = store.get(owner_watch_id, kind)
                if record is None:
                    continue
                numbers: dict[str, Any] = {
                    "revision": record.revision,
                    "hash": short_hash(record.hash),
                    "delivered_revision": record.delivered_revision,
                    "rejected_revision": record.rejected_revision,
                }
                items = _item_count(kind, record.document)
                if items is not None:
                    numbers["items"] = items
                kinds[kind] = numbers
        except WatchConfigStoreError:
            continue
        owners[owner_watch_id] = kinds
    result: dict[str, Any] = {"owners": owners}
    http_actions = getattr(hass.data.get(DOMAIN), "http_actions_store", None)
    if http_actions is not None and http_actions.available:
        delivered = http_actions.delivered()
        result["http_actions"] = {
            "revision": http_actions.revision,
            "delivered": {
                owner: revision for owner, revision in delivered.items() if listed(owner)
            },
        }
    connection.send_result(msg["id"], result)


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
    """Save one watch's page config, behavior settings, menus, voice
    settings, notification style, status pages or Control Center list as
    edited in the panel.

    Result: {"revision": <new revision>, "link_failures": [{"owner", "name"}]}

    The panel sends the whole document, keys it does not show included, and
    the store keeps it as sent. ``base_revision`` 0 with nothing stored
    creates revision 1 for a paired watch (the result is then
    ``{"revision": 1}``). Refused with ``no_record`` when nothing is stored
    and either the base is above 0 or the watch is not paired, with
    ``conflict`` when ``base_revision`` is not the stored revision (message
    ``stored revision is <N>, save was based on <M>``, a base of 0 over a
    stored record included), and with ``invalid`` for an unknown kind or a
    malformed document, one that fails its kind's shape guard included (the
    message names the page, slot list, phrase, row or entry by where it
    sits).
    The hash is computed here and ``updated_by`` is ``panel``; the replaced
    document goes into the record's history like any save.

    For an iPhone owner (phone pages) ``base_revision`` 0 with nothing stored
    creates its first record too, of a kind a phone owns; any other kind is
    refused ``not_for_iphone``. A phone's ``behavior`` keeps only the phone's
    settings, the rest dropped without a word: ``get`` then shows what was
    kept.

    ``link_failures`` lists the other devices holding a linked copy of a
    saved page that could not take the change (over their size cap): the
    save stands, those copies stay as they were. ``name`` is the device's
    name, null for one the secret store does not know. Empty when every copy
    took it, and for a kind that is never linked.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not require_owner(hass, connection, msg, msg["owner_watch_id"]):
        return
    failed: list[str] = []
    try:
        record = store.panel_save(
            msg["owner_watch_id"],
            msg["kind"],
            msg["document"],
            base_revision=msg["base_revision"],
            link_failures=failed,
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
    connection.send_result(
        msg["id"],
        {"revision": record.revision, "link_failures": _link_failures(hass, failed)},
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_HISTORY,
        vol.Required("owner_watch_id"): str,
        vol.Required("kind"): str,
    }
)
@callback
def ws_watch_config_history(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """The documents later saves replaced, newest first, without the documents.

    Result: {"entries": [{"revision", "hash", "updated_at", "updated_by",
                          "size"}, ...]}

    At most five entries; the current document is not one of them (``get``
    returns it). ``size`` is the document's compact UTF-8 JSON size in bytes.
    ``hash``, ``updated_at`` and ``updated_by`` are null for an entry stored
    without them. Empty when there is no record or nothing has been replaced
    yet. Two entries can share a revision after a move onto a watch that
    already had a record; ``history_entry`` and ``restore`` then mean the
    newer one.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not require_owner(hass, connection, msg, msg["owner_watch_id"]):
        return
    try:
        entries = store.history(msg["owner_watch_id"], msg["kind"])
    except WatchConfigStoreError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    connection.send_result(
        msg["id"], {"entries": [entry.summary() for entry in entries]}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_HISTORY_ENTRY,
        vol.Required("owner_watch_id"): str,
        vol.Required("kind"): str,
        vol.Required("revision"): int,
    }
)
@callback
def ws_watch_config_history_entry(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """One history entry with its document, for the panel to show before a
    restore.

    Result: {"revision", "hash", "updated_at", "updated_by", "document"}

    Refused with ``not_found`` when the record holds no entry at that
    revision, or there is no record.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not require_owner(hass, connection, msg, msg["owner_watch_id"]):
        return
    try:
        entry = store.history_entry(msg["owner_watch_id"], msg["kind"], msg["revision"])
    except WatchConfigStoreError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    connection.send_result(msg["id"], entry.as_dict())


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_RESTORE,
        vol.Required("owner_watch_id"): str,
        vol.Required("kind"): str,
        vol.Required("revision"): int,
        vol.Required("base_revision"): int,
    }
)
@callback
def ws_watch_config_restore(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Save a history entry's document as the record's next revision.

    Result: {"revision": <new revision>, "link_failures": [{"owner", "name"}]}

    A panel save of the old document: ``updated_by`` is ``panel``, the hash
    is computed here, the replaced document goes into the history, delivery
    is left where it was, and the phone hears of it like any save. The same
    refusals as ``save`` (``no_record``, ``conflict`` with ``stored revision
    is <N>, restore was based on <M>``, ``invalid`` when the old document
    fails the shape guard), plus ``not_found`` when the record holds no entry
    at ``revision``. A stale ``base_revision`` is a conflict even when the
    entry is also gone. ``link_failures`` is ``save``'s.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not require_owner(hass, connection, msg, msg["owner_watch_id"]):
        return
    failed: list[str] = []
    try:
        record = store.restore(
            msg["owner_watch_id"],
            msg["kind"],
            msg["revision"],
            base_revision=msg["base_revision"],
            link_failures=failed,
        )
    except WatchConfigStoreError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    _LOGGER.info(
        "Panel restored %s revision %d for %s as revision %d",
        record.kind,
        msg["revision"],
        record.owner_watch_id,
        record.revision,
    )
    connection.send_result(
        msg["id"],
        {"revision": record.revision, "link_failures": _link_failures(hass, failed)},
    )


@websocket_api.websocket_command({vol.Required("type"): _CMD_SUBSCRIBE_DELIVERY})
@callback
def ws_watch_config_subscribe_delivery(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Tell the panel's Home the moment a device picks up what Home waits on.

    Result: null
    Event:  {"owner_watch_id": owner, "kind": kind}

    One event each time what a device holds of a watch config record moves
    (a delivery, or an unreadable report: ``mark_delivered`` and
    ``report_unreadable``), and each time a device's pulled revision of the
    HTTP action library moves (kind ``http_actions``). Home answers with its
    ``watch_config/summary``, which says where every kind stands, so only
    the owner and the kind travel here.

    Kept off ``watch_config/subscribe`` and the store's change listeners on
    purpose: the watch's delta wake rides on those, and a delivery heard
    there would wake the watch that was just delivered to.

    An administrator hears about every device. Anyone else hears only about
    the devices they may manage (``may_manage_owner``), asked on each event
    as ``watch_config/summary`` asks, so a device paired to them later is
    heard too.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    admin = is_admin(connection)

    def _send(owner: str, kind: str) -> None:
        if not admin and not may_manage_owner(hass, connection, owner):
            return
        connection.send_message(
            websocket_api.event_message(msg["id"], {"owner_watch_id": owner, "kind": kind})
        )

    @callback
    def _on_delivery(delivery: WatchConfigDelivery) -> None:
        _send(delivery.owner_watch_id, delivery.kind)

    @callback
    def _on_http_actions(owner: str) -> None:
        _send(owner, "http_actions")

    # Through the relays, as for watch_config/subscribe: a reload replaces
    # the stores but keeps this subscription open.
    config_relay = listener_relay(hass, WATCH_CONFIG_DELIVERY)
    config_relay.follow(store)
    removers = [config_relay.add_listener(_on_delivery)]
    http_actions = getattr(hass.data.get(DOMAIN), "http_actions_store", None)
    actions_relay = listener_relay(hass, HTTP_ACTIONS_DELIVERY)
    if http_actions is not None:
        actions_relay.follow(http_actions)
    removers.append(actions_relay.add_listener(_on_http_actions))

    def _unsubscribe() -> None:
        for remove in removers:
            remove()

    connection.subscriptions[msg["id"]] = _unsubscribe
    connection.send_result(msg["id"], None)


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
    if not _may_follow_owner(hass, connection, owner):
        connection.send_error(
            msg["id"], "unauthorized", "not a device paired to this user"
        )
        return
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

    # Through the relay, not the store: a config entry reload replaces the
    # store but keeps this subscription open (see listener_relay.py).
    relay = listener_relay(hass, WATCH_CONFIG)
    relay.follow(store)
    connection.subscriptions[msg["id"]] = relay.add_listener(_on_change)
    connection.send_result(msg["id"], {"revisions": revisions})


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_PAGES_LINK,
        vol.Required("source_id"): str,
        vol.Optional("page_ids"): [str],
        vol.Required("targets"): [str],
        vol.Optional("kind"): str,
        vol.Optional("units"): [str],
        vol.Optional("replace"): bool,
    }
)
@callback
def ws_watch_pages_link(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Put a watch's voice settings on other watches, linked.

    Request: {source_id, targets, kind: "voice", units: ["phrases"], replace?}
    Result:  {"targets": {<target id>: {"pages": [], "status_pages": [],
                                        "adopted_status_pages": [],
                                        "units": [units written]}},
              "link_ids": {"phrases": <linkId>}}

    The phrase library and its defaults go onto each target under one link
    id, never the watch's own speech settings, and from then on a save of
    any copy reaches every copy (``WatchConfigStore.link_units``). Only
    watches hold voice.

    Pages, status pages and menus no longer link: each lives once in the
    library and a device picks it (``library/pick``). A ``kind`` of
    ``pages``, ``status_pages`` or ``menus``, or none (the old default was
    pages), is refused ``invalid`` with a message saying so.

    Checked whole before anything is written. Refused ``unknown_device`` (a
    source or target that is not a paired device), ``not_found`` (no voice
    settings on the source), ``unit_taken`` (a target with its own phrase
    library, unless ``replace``), ``not_for_iphone`` (voice is a watch's
    alone), ``awaiting_move``, ``invalid``, and ``unauthorized`` for a
    device the caller may not manage: the source and every target follow
    the ``save`` rule.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not require_owner(hass, connection, msg, msg["source_id"], *msg["targets"]):
        return
    try:
        result = store.link_units(
            msg.get("kind", "pages"),
            msg["source_id"],
            msg.get("units"),
            msg["targets"],
            replace=msg.get("replace", False),
        )
    except WatchConfigStoreError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {vol.Required("type"): _CMD_PAGES_PLACES, vol.Optional("kind"): str}
)
@callback
def ws_watch_pages_places(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Which watches hold each linked voice library, for the voice editor's
    Devices menu.

    Result: {"voice": {<linkId>: {"unit": "phrases", "owners": [owner id, ...]}}}

    Only the devices the caller may manage are named (all of them for an
    administrator), and a link none of them holds is left out. Who has a
    page, status page or menu is ``library/summary``: a ``kind`` of
    ``pages``, ``status_pages`` or ``menus`` is refused ``invalid``.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    kind = msg.get("kind", "voice")
    if kind not in LINK_UNITS:
        connection.send_error(
            msg["id"],
            "invalid",
            f"only voice links; who has {kind.replace('_', ' ')} is library/summary",
        )
        return
    admin = is_admin(connection)
    result: dict[str, dict[str, Any]] = {}
    for linked, places in store.link_places().items():
        shown: dict[str, Any] = {}
        for link, place in places.items():
            kept = [o for o in place["owners"] if admin or may_manage_owner(hass, connection, o)]
            if kept:
                shown[link] = {**place, "owners": kept}
        result[linked] = shown
    connection.send_result(msg["id"], result)


# ── the library: one of every page, status page and menu, devices pick ──


def _may_change_item(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    store: WatchConfigStore,
    kind: str,
    item_id: str,
) -> bool:
    """Whether the caller may rename or delete one library item: they must
    manage every device that picks it (``require_owner``), and an item no
    device picks is an administrator's. An id the library does not hold is
    let through, so the store answers ``not_found`` (or ``invalid`` for a
    kind it does not hold)."""
    owners = store.library_item_owners(kind, item_id)
    if owners is None:
        return True
    if not owners and not is_admin(connection):
        connection.send_error(msg["id"], "unauthorized", "only an administrator may change this")
        return False
    return require_owner(hass, connection, msg, *owners)


def _may_take_item(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    store: WatchConfigStore,
    kind: str,
    item_id: str,
) -> bool:
    """Whether the caller may put one library item on a device of theirs: an
    item is theirs to take when a device they manage already has it, and an
    item no device has is an administrator's, as ``library/summary`` shows
    them. Otherwise anyone could pull another user's page onto their own
    watch by id and then edit it there, which a link never allowed (the
    starter status pages have fixed ids). An id the library does not hold is
    let through, so the store answers ``not_found``."""
    owners = store.library_item_owners(kind, item_id)
    if owners is None or is_admin(connection):
        return True
    if any(may_manage_owner(hass, connection, owner) for owner in owners):
        return True
    connection.send_error(msg["id"], "unauthorized", "no device of yours has this item")
    return False


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_LIBRARY_PICK,
        vol.Required("owner_id"): str,
        vol.Required("kind"): str,
        vol.Required("item_id"): str,
        vol.Optional("on"): bool,
        vol.Optional("unit"): str,
        vol.Optional("start"): dict,
    }
)
@callback
def ws_library_pick(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Tick or untick a library item on one device.

    Request: {owner_id, kind: "pages" | "status_pages", item_id, on} or
             {owner_id, kind: "menus", unit: "anywhere" | "entity", item_id,
              start?}
    Result:  {"revisions": {<owner id>: {<kind>: <revision>}}}

    A page or status page ticked on goes at the end of the device's order,
    visible; a page brings the status pages its tiles open. Ticked off, the
    device no longer has it; the item stays in the library. A menu is the
    one the device uses for that unit from then on
    (``WatchConfigStore.library_pick``). ``start`` is a whole menus document
    (the panel sends the app's defaults) that a device with no menus record
    starts from when no device with menus uses the menu yet, as after New
    menu; it is read only then. ``revisions`` names every record written,
    which are only that device's own.
    Refused ``invalid``, ``unknown_device``, ``not_for_iphone``,
    ``not_found``, ``no_record``, ``awaiting_move``, and ``unauthorized``
    for a device the caller may not manage, or for an item put on that no
    device the caller manages has (for anyone but an administrator).
    Taking an item off needs only the device.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not require_owner(hass, connection, msg, msg["owner_id"]):
        return
    taking = msg["kind"] == "menus" or msg.get("on") is True
    if taking and not _may_take_item(hass, connection, msg, store, msg["kind"], msg["item_id"]):
        return
    try:
        result = store.library_pick(
            msg["owner_id"],
            msg["kind"],
            msg["item_id"],
            on=msg.get("on"),
            unit=msg.get("unit"),
            start=msg.get("start"),
            may_read=None
            if is_admin(connection)
            else lambda owner: may_manage_owner(hass, connection, owner),
        )
    except WatchConfigStoreError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_LIBRARY_MENUS_COPY,
        vol.Required("owner_id"): str,
        vol.Required("unit"): str,
        vol.Required("name"): str,
    }
)
@callback
def ws_library_menus_copy(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Make a copy of the menu a device uses for a unit, as a new library
    menu named ``name``, and use it there in its place ("Make a copy for
    this watch").

    Result: {"id": <new menu id>, "revisions": {<owner id>: {<kind>: <revision>}}}

    Refused ``invalid`` (an empty name, an unknown unit), ``unknown_device``,
    ``not_found`` (the device uses no menu for the unit) and
    ``unauthorized``.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not require_owner(hass, connection, msg, msg["owner_id"]):
        return
    try:
        result = store.library_copy_menu(msg["owner_id"], msg["unit"], msg["name"])
    except WatchConfigStoreError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_LIBRARY_MENUS_CREATE,
        vol.Required("unit"): str,
        vol.Required("name"): str,
        vol.Required("sections"): dict,
    }
)
@callback
def ws_library_menus_create(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Make a new library menu that no device uses yet (the Menus tab's New
    menu). A tick (``library/pick``) then puts it on a device; no device
    moves off its menu here.

    Request: {unit: "anywhere" | "entity", name, sections}
    Result:  {"id": <new menu id>, "revisions": {}}

    ``sections`` is the menu's sections exactly as a menus document holds
    them for the unit: ``quickAction`` and ``pageSwitcher`` for
    ``anywhere``, ``entityRadial`` for ``entity`` (the panel sends the app's
    defaults), checked as every menus document is
    (``WatchConfigStore.library_create_menu``). Administrators only (a menu
    no device uses is an administrator's). Refused ``invalid`` (an unknown
    unit, an empty name, sections of another shape) and ``unauthorized``.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    try:
        result = store.library_create_menu(msg["unit"], msg["name"], msg["sections"])
    except WatchConfigStoreError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_LIBRARY_MENUS_RENAME,
        vol.Required("item_id"): str,
        vol.Required("name"): str,
    }
)
@callback
def ws_library_menus_rename(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Rename a library menu. No device's record holds a menu's name, so
    nothing is written but the library.

    Result: {}

    Refused ``not_found``, ``invalid`` (an empty name) and ``unauthorized``
    for a menu used by a device the caller may not manage (or, used by none,
    for anyone but an administrator).
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not _may_change_item(hass, connection, msg, store, "menus", msg["item_id"]):
        return
    try:
        store.library_rename_menu(msg["item_id"], msg["name"])
    except WatchConfigStoreError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    connection.send_result(msg["id"], {})


def _send_delete(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    store: WatchConfigStore,
    kind: str,
) -> None:
    try:
        result = store.library_delete(kind, msg["item_id"])
    except WatchConfigStoreError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    connection.send_result(
        msg["id"],
        {
            "revisions": result["revisions"],
            "link_failures": _link_failures(hass, result["link_failures"]),
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_LIBRARY_MENUS_DELETE,
        vol.Required("item_id"): str,
    }
)
@callback
def ws_library_menus_delete(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Delete a library menu that no device uses.

    Result: {"revisions": {}, "link_failures": []}

    Refused ``in_use`` while any device uses it, ``not_found`` and
    ``unauthorized`` (a menu no device uses is an administrator's).
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not _may_change_item(hass, connection, msg, store, "menus", msg["item_id"]):
        return
    _send_delete(hass, connection, msg, store, "menus")


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_LIBRARY_DELETE,
        vol.Required("kind"): str,
        vol.Required("item_id"): str,
    }
)
@callback
def ws_library_delete(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Delete a page, status page or menu from the library.

    Result: {"revisions": {<owner id>: {<kind>: <revision>}},
             "link_failures": [{"owner", "name"}]}

    A page or status page goes from every device that has it, and the menu
    slots and tiles that opened it go with it, everywhere
    (``WatchConfigStore.library_delete``); ``revisions`` names every record
    written, and ``link_failures`` the devices whose record could not take
    it. A menu is refused ``in_use`` while any device uses it. Refused
    ``invalid`` for another kind, ``not_found``, and ``unauthorized`` for an
    item a device the caller may not manage has (or that no device has, for
    anyone but an administrator).
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not _may_change_item(hass, connection, msg, store, msg["kind"], msg["item_id"]):
        return
    _send_delete(hass, connection, msg, store, msg["kind"])


@websocket_api.websocket_command({vol.Required("type"): _CMD_LIBRARY_SUMMARY})
@callback
def ws_library_summary(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Every library item and the devices that pick it, for the Pages,
    Status pages and Menus tabs, in one read.

    Result: {"pages": {<id>: {"item": <page>, "owners": [owner id, ...]}},
             "status_pages": {<id>: {"item": <status page>, "owners": [...]}},
             "menus": {<id>: {"name", "kind": "anywhere" | "entity",
                              "sections": {...}, "owners": [...]}},
             "picks": {<owner id>: {"pages": [{"id", "isHidden"?} | {"id", "page"}],
                                    "status_pages": [{"id", "isHidden"?}],
                                    "menus": {"anywhere"?: <id>, "entity"?: <id>}}}}

    An administrator hears about everything. Anyone else hears only about
    the devices they may manage (``may_manage_owner``): ``owners`` and
    ``picks`` name only those, and an item none of them picks is left out.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    summary = store.library_summary()
    if is_admin(connection):
        connection.send_result(msg["id"], summary)
        return

    def listed(owner: str) -> bool:
        return may_manage_owner(hass, connection, owner)

    result: dict[str, Any] = {}
    for kind in ("pages", "status_pages", "menus"):
        shown: dict[str, Any] = {}
        for item_id, entry in summary[kind].items():
            kept = [owner for owner in entry["owners"] if listed(owner)]
            if kept:
                shown[item_id] = {**entry, "owners": kept}
        result[kind] = shown
    result["picks"] = {owner: held for owner, held in summary["picks"].items() if listed(owner)}
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_VOICES_GET,
        vol.Required("watch_id"): str,
    }
)
@callback
def ws_watch_voices_get(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """The speech voices one watch has installed, as it last reported them.

    Result: {"voices": [{"id", "name", "language", "quality"}, ...],
             "updated_at": <ISO time> | null}

    Sorted by id. An empty list with a null time when the watch has sent
    none yet: one that predates the watch_voices capability, or one that has
    not polled since. The panel's picker groups the list by language and
    offers "System voice" for no choice. Only for a watch the caller may
    manage, like every other read of one watch.
    """
    store = _voices_store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not require_owner(hass, connection, msg, msg["watch_id"]):
        return
    entry = store.get(msg["watch_id"])
    if entry is None:
        connection.send_result(msg["id"], {"voices": [], "updated_at": None})
        return
    connection.send_result(
        msg["id"], {"voices": list(entry.voices), "updated_at": entry.updated_at}
    )
