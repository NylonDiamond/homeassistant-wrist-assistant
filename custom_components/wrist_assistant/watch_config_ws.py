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

``watch_voices/get`` is the voice list a watch reported over the signed
``watch_voices_put`` (see ``watch_voices_store.py``), for the panel's Watch
voice picker. It is not a watch config record and has no revision.

Every refusal is a WebSocket error with the store's code: ``invalid``,
``unavailable``, ``no_record``, ``conflict`` or ``not_found``, plus
``unauthorized`` for a watch that is not the caller's (not the store's). A
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

from .const import DOMAIN, WATCH_CONFIG_PANEL_KINDS
from .listener_relay import WATCH_CONFIG, listener_relay
from .panel_access import is_admin, may_manage_owner, require_owner
from .watch_config_store import (
    WatchConfigChange,
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
_CMD_VOICES_GET = f"{DOMAIN}/watch_voices/get"


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
    websocket_api.async_register_command(hass, ws_watch_voices_get)


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
             "rejected_revision", "rejected_at", "document"?}

    With no record, ``revision``, ``delivered_revision`` and
    ``rejected_revision`` are 0, the strings are null, and there is no
    ``document``: the view's "no record yet" state, which the panel's start
    button (a save over base 0) or the iPhone mirror's first upload ends.
    ``rejected_revision`` equal to ``revision`` means a device fetched this
    save and could not decode it, which outranks delivery; any lower value is
    an old report a later save has replaced, and 0 also follows the device
    confirming it has since read the save. Reading changes nothing,
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

    Result: {"revision": <new revision>}

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
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not require_owner(hass, connection, msg, msg["owner_watch_id"]):
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

    Result: {"revision": <new revision>}

    A panel save of the old document: ``updated_by`` is ``panel``, the hash
    is computed here, the replaced document goes into the history, delivery
    is left where it was, and the phone hears of it like any save. The same
    refusals as ``save`` (``no_record``, ``conflict`` with ``stored revision
    is <N>, restore was based on <M>``, ``invalid`` when the old document
    fails the shape guard), plus ``not_found`` when the record holds no entry
    at ``revision``. A stale ``base_revision`` is a conflict even when the
    entry is also gone.
    """
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    if not require_owner(hass, connection, msg, msg["owner_watch_id"]):
        return
    try:
        record = store.restore(
            msg["owner_watch_id"],
            msg["kind"],
            msg["revision"],
            base_revision=msg["base_revision"],
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
    connection.send_result(msg["id"], {"revision": record.revision})


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
