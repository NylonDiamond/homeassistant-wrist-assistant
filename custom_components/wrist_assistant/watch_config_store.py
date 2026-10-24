"""Watch config documents kept in Home Assistant, one record per watch per kind.

Part of moving watch configuration out of the phone (see
``docs/pages_in_home_assistant_step1.md``, ``..._step2.md`` and
``..._step3.md`` and ``..._step4.md`` in the app repo). A record has three
parties:

* The iPhone mirror. With its switch on, the phone uploads its page config
  (kind ``pages``), its watch behavior settings (kind ``behavior``), its
  menus (kind ``menus``: the Anywhere menu, the Entity quick menu and the
  page switcher's style), its voice settings (kind ``voice``: the voice
  defaults and the phrase library), its notification style (kind
  ``notification_style``), its status pages (kind ``status_pages``) and its
  Control Center list (kind ``control_center``) here after each edit, and pulls a newer copy back down when it has nothing
  unsent. For a home that is not the watch's main house it uploads that
  home's rooms (kind ``rooms``) once, in place of the behavior settings. It also publishes its library catalog (kind ``catalog``), which
  only the phone writes.
* The panel. It may read, save and restore every kind but the catalog, and
  read the catalog (see ``watch_config_ws.py``), and it may make a watch's
  first record of those kinds.
* The watch's own pull. The watch reads its records over the signed get when
  the delta reply names a newer revision. Its one write is its ``behavior``
  record, when Connect via changes on the watch. The phone, when
  there is one, also picks a panel save up on its next check, or at once
  over the live line while the app is open.

The first record of a kind comes from the iPhone mirror or from the panel
(``base_revision`` 0 with nothing stored). The panel's create is taken only
for a watch the secret store knows: a watch with no phone never uploads, so
without it that watch would have no pages or settings at all, and an id
nothing has paired as must never gain a record the panel invented.

An iPhone is an owner too (phone pages, app repo
``docs/phone_pages_mvp_2026-10.md``): it owns its own pages, status pages,
menus, rooms and settings (``WATCH_CONFIG_PHONE_KINDS``), never a watch's,
and pulls them signed as itself. Every write for an iPhone owner is refused
any other kind, and its ``behavior`` keeps only the settings the panel's
catalog marks for the iPhone (:func:`phone_behavior_document`). The panel may
create a phone's first record of one of its kinds, as it may a watch's.

A record is keyed on the watch, not the phone: the owner is the id that signed
the request, which is the watch's own pair even when the phone sends it. The
watch must own its config from the first day, because the step where it reads
the record itself signs with that same id.

Each record carries:

* ``revision``: whole number, one more on every accepted save. Saves are
  compare-and-swap on it, so two writers can never silently overwrite each
  other; a forced save is the one exception, and it files what it replaced.
* ``hash``: SHA-256 of the document, as lowercase hex. For a device save it is
  the client's own, stored as opaque metadata and never recomputed here,
  because the client hashes its own serialized bytes and Python's
  re-serialization of the same JSON is not byte for byte what Swift wrote (key
  order, slash escaping, number spelling). The only promise is that the hash
  handed back is the one the writer sent. A panel save has no client hash, so
  the server computes one (:func:`canonical_hash`).
* ``updated_at`` / ``updated_by``: server time of the save, and the signing id
  of the writer, or ``panel`` for a panel save (a panel create included).
* ``document``: the JSON object exactly as parsed from the request, never
  rewritten. It is checked at the envelope (an object, a page config's
  ``pages`` is a list, under its kind's size cap) and, for a page config, a
  catalog, the menus, the voice settings and the status pages, at the shape
  the watch or the panel cannot survive without (:func:`validate_document`).
  The server does not understand tiles, slots, phrases, rows or settings.
* ``history``: the last few documents a save replaced, each with the
  revision, hash, time and writer it had. The signed get never returns it; the
  panel lists it and restores from it (:meth:`WatchConfigStore.history`,
  :meth:`WatchConfigStore.restore`), so a forced save, a wrong pull or a bad
  panel save loses nothing that cannot be put back.
* ``delivered_revision`` / ``delivered_at``: the highest revision a device is
  known to hold, and when that became known. Moved by a signed get that carried
  the document or answered "you already have it", and by a signed put (the
  device that wrote a revision holds it). The panel compares it with
  ``revision`` to say whether the phone has picked a panel save up yet. Files
  written before these fields existed load with 0 and no time.
* ``rejected_revision`` / ``rejected_at``: the last revision a device reported
  it fetched and could not decode, and when (0 and no time for never). Set by
  a signed get carrying ``unreadable_revision`` equal to the stored revision.
  A later save simply has a higher revision, so the panel reads "could not
  read this save" only while the two are equal, and then it outranks delivery
  (the get that fetched the document counted as a delivery before the device
  knew it could not read it). It is cleared by a forget, and by the device
  confirming it holds that revision or a later one: a signed get whose
  ``since_revision`` names the stored revision without a report about it.
  Only that confirmation clears it. A get that merely carried the document
  out proves nothing about whether the device could read it, and a put is the
  iPhone mirror writing, not the watch reading, so both move
  ``delivered_revision`` and leave the report standing. Files written before
  these fields existed load with 0 and no time.
* ``rejected_reason``: the device's own short words for why it could not use
  ``rejected_revision`` ("too large for the watch"), or ``None`` when it gave
  none. It travels beside ``unreadable_revision`` as ``reason`` and is kept
  and cleared with the report; the panel shows it after "could not use this
  save". Cut to :data:`REJECT_REASON_MAX_CHARS`, control characters dropped.
* ``multiple_pages``: on a pages record, the plan the watch last said it is
  on: ``True`` when it shows every page, ``False`` on the free plan (first
  page only), ``None`` when it never said (an older watch app). Sent as
  ``multiple_pages`` on the signed pages get. The panel shows its free plan
  note only for ``False``. Files written before the field load with ``None``.

Storage is one Home Assistant ``Store`` file per owner, holding every kind for
that owner, plus a small index naming the owners. A document can be large
(the cap is ``WATCH_CONFIG_MAX_DOCUMENT_BYTES``), so one watch's save must not
rewrite another watch's file. The index only changes when an owner appears or
goes away, and once per start for ``revision_floor``.

Saves are debounced, so a hard kill can lose a revision a device was already
handed. Counting on from the file would then hand the same number out again
for a different document, which a device holding it never fetches. So a load
that finds an index sets ``revision_floor`` above every revision an earlier
run can have handed out (:func:`_revision_floor`) and writes it to the index
before returning, and every new revision, a first one included, is above it.
A restore from a backup brings an old floor back, so the floor also moves by
a per-start step taken from the clock, and the watch compares each kind's
hash (:func:`short_hash`) beside its revision: a number can repeat after a
restore, a hash of a different document cannot.

Listeners (:meth:`WatchConfigStore.async_add_listener`) hear one
:class:`WatchConfigChange` per kind whose revision moved: every accepted save,
device or panel, a panel create and a restore included; revision 0 for each
kind a forget removed; and for a move, the target's resulting revisions and
revision 0 for each of the source's kinds. Delivery is not a change, and
neither is an unreadable report: a signed get that only moves
``delivered_revision`` or ``rejected_revision`` tells none of them. This is
what the phone's live line (``watch_config/subscribe`` in
``watch_config_ws.py``) and the watch's delta wake ride on.

The library (``library.py``, app repo ``docs/one_library_plan_2026-10.md``):
every page, status page and menu lives once, in the home's library
(``wrist_assistant.library``), and each owner picks from it. The ``pages``,
``status_pages`` and ``menus`` records are the materialised form: built from
the library and the owner's picks, so the apps read them as before. Every
accepted write of one of them, by any writer, is mapped back into the
library before it is stored, and every other record the change reaches is
rebuilt and written as a new revision there in the same call, so an edit
on one device reaches every device that picked the item. The records carry
no link keys: a ``linkId`` or ``linkIds`` still in an old record or a save
is dropped, and is never a pick, a fork or an unlink. The first start with
the library builds it from the records. The iPhone's copy of a watch's setup
(``link_device``, the signed ``phone_pages_link_watch``) is picks too. A
watch's voice settings still link copy by copy (``page_links.py``,
``link_units``): the phrase library with its defaults is one unit, kept in
step on every write (``_spread_links``), and the watch's own speech settings
never travel. Only watches hold voice, so an iPhone is never a voice
target.

Deliveries and reports have listeners of their own
(:meth:`WatchConfigStore.async_add_delivery_listener`), heard only by the panel's Home
(``watch_config/subscribe_delivery``), so the watch is never woken by its own
pick up.
"""

from __future__ import annotations

import copy
import hashlib
import json
import logging
import re
import time
from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Any, NamedTuple

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store

from .const import (
    PHONE_BEHAVIOR_DECODE_KEYS,
    PHONE_BEHAVIOR_KEYS,
    WATCH_CONFIG_HISTORY_LIMIT,
    WATCH_CONFIG_KINDS,
    WATCH_CONFIG_MAX_DOCUMENT_BYTES,
    WATCH_CONFIG_PANEL_KINDS,
    WATCH_CONFIG_PANEL_WRITER,
    WATCH_CONFIG_PHONE_KINDS,
    WATCH_CONFIG_STORAGE_KEY,
    WATCH_CONFIG_STORAGE_VERSION,
    WATCH_LIBRARY_STORAGE_KEY,
    WATCH_LIBRARY_STORAGE_VERSION,
)
from .library import (
    LIBRARY_KINDS,
    MENU_UNITS,
    LibraryError,
    changed_owners,
    copy_menu,
    copy_picks,
    create_item,
    create_menu,
    delete_item,
    empty_library,
    held_renames,
    hold_renames,
    item_revision,
    map_back,
    materialise,
    menu_targets,
    migrate,
    move_picks,
    new_menu_name,
    pick_menu,
    pick_page,
    pickers,
    rename_menu,
    rename_refs,
    replace_item,
    stored_item_id,
    validate_library,
)
from .library import forget as library_forget
from .library import reach as library_reach
from .page_links import (
    LINK_UNITS,
    LinkOps,
    PageLinkError,
    apply_unit_link,
    ids_in,
    link_ops,
    listed_page_ids,
    rooms_from_behavior,
    unit_link_places,
    unit_links,
    without_unit_links,
)

# The kinds still linked copy by copy (page_links.py): only the voice
# settings. Pages, status pages and menus live in the library.
_COPY_LINKED_KINDS: tuple[str, ...] = tuple(LINK_UNITS)

# Who the store names as the writer of what the first start with the
# library rewrote.
_MIGRATION_WRITER = "library"

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 1

# How far above the highest stored revision (and the stored floor) the next
# start's revisions begin: far more saves than one debounce chain, the most a
# hard kill can lose, ever holds.
_REVISION_MARGIN = 1000


def _revision_floor(saved_floor: int, highest: int, now: float | None = None) -> int:
    """Where revisions continue after a load that found an index.

    Above the stored floor and the highest stored revision by
    ``_REVISION_MARGIN``, and never below the minutes since 1970, which also
    clears an index that lost both; then a per-start step on top: the current
    Unix second modulo the margin. The result is written to the index before
    any revision goes out (see ``async_load``).

    The step is there for a restore from a backup. The backup brings the
    stored floor and revisions back, so without it every start from the same
    file computes the same floor (the minutes term only overtakes the margin
    some 16 hours later, and then two starts in one minute agree) and the
    first save after each start reuses a number
    an earlier run already handed out for a different document. A watch
    still holding that number would never fetch the new one. The clock is
    the one thing a backup cannot bring back, so two starts from the same
    file land on the same floor only when they start on the same second
    modulo the margin, and even then the record hash the watch also compares
    (:func:`short_hash`) tells the documents apart. Seconds rather than a
    random draw so a test can pin it, and modulo the margin so each start
    moves the floor by at most twice the margin, which keeps revisions far
    inside the 32-bit integer a watch reads them into.
    """
    now = time.time() if now is None else now
    step = int(now) % _REVISION_MARGIN
    return (
        max(int(now // 60), max(saved_floor, highest) + _REVISION_MARGIN) + step
    )

# The list key a kind's document must carry, for the kinds that have one: a
# page config without its page list is not a page config, while the behavior
# settings are a flat object whose every key is optional ("absent means the
# default"), so an object is enough. The page list's own shape is checked by
# _check_pages below. The same holds for the phrase library of the voice
# settings (`phrases`, which the app's decoder requires) and the status pages
# (`statusPages`, the list the document wraps) and the Control Center list
# (`entities`, likewise); the notification style is a flat object like the
# behavior settings.
_KIND_LIST_KEYS: dict[str, str] = {
    "pages": "pages",
    "voice": "phrases",
    "status_pages": "statusPages",
    "control_center": "entities",
}

# A SHA-256 digest as lowercase hex. Lowercase only, and refused otherwise
# rather than folded: the phone compares the hash it remembers with the one it
# computes, and a server that quietly lowercased an uppercase hash would hand
# back a value the phone never computes, which reads as an edit on every pull.
_HASH_RE = re.compile(r"[0-9a-f]{64}")

# How many hex digits of a record's hash the watch is shown (see short_hash).
SHORT_HASH_LENGTH = 16


def short_hash(document_hash: str | None) -> str | None:
    """The hash a watch compares beside a revision: the first
    ``SHORT_HASH_LENGTH`` (16) characters of the record's stored ``hash``.

    The stored hash is SHA-256 as 64 lowercase hex digits: the client's own
    for a device save, :func:`canonical_hash` for a panel save. 16 of them
    are 64 bits, plenty to tell two documents of one watch apart. A revision
    alone can repeat after Home Assistant is restored from a backup (see
    :func:`_revision_floor`); the hash cannot, so a watch pulls a kind when
    either differs from what it holds.

    ``None`` for a record with no hash (an empty one off a hand-edited
    file): nothing to compare, so the watch goes by the revision alone. The
    delta reply's ``watch_config_hashes``, the signed get's ``short_hash``
    and the panel summary's ``hash`` all carry this same value."""
    if not document_hash:
        return None
    return document_hash[:SHORT_HASH_LENGTH]


class WatchConfigStoreError(Exception):
    """Base class; ``code`` is the stable machine-readable reason."""

    code = "error"

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class WatchConfigValidationError(WatchConfigStoreError):
    """The request or its document envelope is malformed."""

    code = "invalid"


class WatchConfigConflictError(WatchConfigStoreError):
    """``base_revision`` does not match the stored revision.

    Carries the stored revision and hash (0 and ``None`` when there is no
    record), which is what the signed 409 tells the client.
    """

    code = "conflict"

    def __init__(self, message: str, revision: int, document_hash: str | None) -> None:
        super().__init__(message)
        self.revision = revision
        self.hash = document_hash


class WatchConfigNoRecordError(WatchConfigStoreError):
    """A panel write with nothing stored to write over.

    A restore, or a panel save on a base above 0, with no record. Also a panel
    save on base 0 for an owner the secret store does not know: the panel
    creates a first record only for a paired watch, so it never invents a
    document for an id nothing signs as.
    """

    code = "no_record"


class WatchConfigNotFoundError(WatchConfigStoreError):
    """A history revision the record does not hold (never saved, or dropped
    past the history limit)."""

    code = "not_found"


class WatchConfigPhoneKindError(WatchConfigStoreError):
    """A write of a kind an iPhone may not own, for an iPhone owner.

    Phone pages: an iPhone owns its pages, status pages, menus, rooms and
    settings (``WATCH_CONFIG_PHONE_KINDS``) and nothing else, whoever writes:
    the phone's own put, the panel's save or restore, or a move onto it.
    """

    code = "not_for_iphone"


class WatchConfigLinkError(WatchConfigStoreError):
    """A pick, a library change or a voice link that cannot be made.

    ``code`` is the reason: ``unknown_device`` for a device that is not a
    paired one, ``not_found`` for an item the library does not hold (or a
    source with no voice settings), ``in_use`` for a menu a device still
    uses, ``unit_taken`` for a target with its own phrase library
    (:meth:`WatchConfigStore.link_units`), ``awaiting_move`` for a watch
    whose iPhone may still move its own setup here (the write would make the
    first record that move skips).
    """

    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


class WatchConfigUnavailableError(WatchConfigStoreError):
    """The owner's file could not be read at startup.

    Reads and writes are both refused for that owner until a restart finds a
    readable file. Answering "no record" instead would invite the phone to
    upload over a file that may be fine or worth recovering by hand.
    """

    code = "unavailable"


def _note_failures(into: list[str] | None, failed: list[str]) -> None:
    """Hand the owners a fan out left behind to a caller that asked for
    them (``link_failures`` on a panel save or restore)."""
    if into is not None:
        into.extend(failed)


def _now_iso() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _owner_key(owner_watch_id: str) -> str:
    """The storage key of one owner's file.

    Owner ids are not guaranteed to be safe in a file name (an iPhone's has a
    colon in it); a digest always is, and never collides in practice. The
    owner's id is written inside the file, so a human reading ``.storage`` can
    still tell whose it is.
    """
    digest = hashlib.sha256(owner_watch_id.encode()).hexdigest()[:32]
    return f"{WATCH_CONFIG_STORAGE_KEY}.{digest}"


def document_size(document: Any) -> int:
    """The size the cap is measured against: compact UTF-8 JSON, in bytes.

    No whitespace and non-ASCII left unescaped, so it is close to what a
    compact client encoder sends. It is a guard on what lands on disk, not a
    promise about the request body, which may differ by a few escapes.
    """
    try:
        encoded = json.dumps(document, separators=(",", ":"), ensure_ascii=False)
    except (TypeError, ValueError) as err:
        raise WatchConfigValidationError("document is not JSON serializable") from err
    return len(encoded.encode("utf-8"))


def validate_kind(kind: Any) -> str:
    """The kind, if this server stores it."""
    if not isinstance(kind, str) or kind not in WATCH_CONFIG_KINDS:
        raise WatchConfigValidationError(
            f"kind must be one of {', '.join(sorted(WATCH_CONFIG_KINDS))}"
        )
    return kind


def phone_behavior_document(document: dict[str, Any]) -> tuple[dict[str, Any], list[str]]:
    """An iPhone's ``behavior`` document: only the phone's settings.

    Keeps the keys the panel's catalog marks for the iPhone
    (``PHONE_BEHAVIOR_KEYS``) and the ones the app needs to decode the
    document (``PHONE_BEHAVIOR_DECODE_KEYS``), in the order they came, and
    returns the dropped keys, sorted. What goes is a watch only setting, the
    room keys a watch's main house keeps in ``behavior`` (a phone has the
    ``rooms`` kind for those), a developer flag, or a key this build does not
    know. A new object; the values are the same ones.
    """
    kept = {
        key: value
        for key, value in document.items()
        if key in PHONE_BEHAVIOR_KEYS or key in PHONE_BEHAVIOR_DECODE_KEYS
    }
    return kept, sorted(key for key in document if key not in kept)


def validate_document(kind: str, document: Any, *, check_items: bool = False) -> int:
    """Check the envelope and shape of one document and return its size in bytes.

    An object, its kind's list key present and a list when the kind has one,
    and under the kind's cap. A page config's pages are then checked for the
    shape the watch needs to survive (see :func:`_check_pages`): the page
    level always, the tile level only with ``check_items``, which a panel save
    and a restore pass and a device save does not. A catalog's entries are
    checked for an id and a name (see :func:`_check_catalog`), the menus'
    sections and slot lists for their shape (see :func:`_check_menus`), the
    voice settings' phrases and defaults (see :func:`_check_voice`) and the
    status pages' pages and rows (see :func:`_check_status_pages`) and the
    Control Center list's entries (see :func:`_check_control_center`). The
    notification style and the rooms, like the behavior settings, are any
    object.

    The server guards the shape, not the content. No key's value is looked at
    beyond the ids: the app is the only thing that understands a tile or a
    setting, and a server that half understood one would refuse configs a
    newer app writes.
    """
    if not isinstance(document, dict):
        raise WatchConfigValidationError("document must be a JSON object")
    list_key = _KIND_LIST_KEYS.get(kind)
    if list_key is not None and not isinstance(document.get(list_key), list):
        raise WatchConfigValidationError(f"document.{list_key} must be a list")
    size = document_size(document)
    limit = WATCH_CONFIG_MAX_DOCUMENT_BYTES[kind]
    if size > limit:
        raise WatchConfigValidationError(
            f"document is {size} bytes; the limit for {kind} is {limit}"
        )
    if kind == "pages":
        _check_pages(document["pages"], check_items=check_items)
    elif kind == "catalog":
        _check_catalog(document)
    elif kind == "menus":
        _check_menus(document)
    elif kind == "voice":
        _check_voice(document)
    elif kind == "status_pages":
        _check_status_pages(document["statusPages"])
    elif kind == "control_center":
        _check_control_center(document["entities"])
    return size


# The phrase library's cap, `TTSConfiguration.maxPhrases` in the app.
_VOICE_MAX_PHRASES = 8
# The voice settings' keys besides the phrases that the guard checks when
# present, each with the JSON type it must have. `schemaVersion` and the last
# three are optionals in the app, so null is taken for them too; the defaults
# are not, but a document without them is left to the app's own decode (the
# contract asks for the shape only).
_VOICE_STRING_KEYS = ("defaultTTSEngine",)
_VOICE_OPTIONAL_STRING_KEYS = ("defaultAssistAgentId", "watchSpeechVoiceIdentifier")
_VOICE_OPTIONAL_BOOL_KEYS = ("watchSpeakReplyInSilentMode",)


def _check_voice(document: dict[str, Any]) -> None:
    """The voice settings' shape guard, for every writer.

    ``phrases`` (present and a list, see ``_KIND_LIST_KEYS``) holds at most
    eight objects, each with a non-empty string ``id``, no two sharing one:
    menus point at phrases by id, so a phrase with no id or a shared one
    would send a slot to the wrong phrase. ``defaultSpeakers`` is a list of
    strings when present, ``defaultTTSEngine`` a string, ``schemaVersion`` an
    integer, and ``defaultAssistAgentId``, ``watchSpeechVoiceIdentifier`` and
    ``watchSpeakReplyInSilentMode`` a string, a string and a bool (or null).
    No phrase key besides ``id`` is looked at, and no other key at all, so a
    newer app can add some.
    """
    phrases = document["phrases"]
    if len(phrases) > _VOICE_MAX_PHRASES:
        raise WatchConfigValidationError(
            f"document.phrases holds {len(phrases)} phrases; "
            f"the limit is {_VOICE_MAX_PHRASES}"
        )
    seen: dict[str, int] = {}
    for index, phrase in enumerate(phrases):
        where = f"document.phrases[{index}]"
        if not isinstance(phrase, dict):
            raise WatchConfigValidationError(f"{where} must be an object")
        phrase_id = phrase.get("id")
        if not isinstance(phrase_id, str) or not phrase_id:
            raise WatchConfigValidationError(f"{where}.id must be a non-empty string")
        folded = phrase_id.upper()
        if folded in seen:
            raise WatchConfigValidationError(
                f'{where} has the phrase id "{phrase_id}" of '
                f"document.phrases[{seen[folded]}]; phrase ids must be unique"
            )
        seen[folded] = index
    if "defaultSpeakers" in document:
        speakers = document["defaultSpeakers"]
        if not isinstance(speakers, list) or not all(
            isinstance(speaker, str) for speaker in speakers
        ):
            raise WatchConfigValidationError(
                "document.defaultSpeakers must be a list of strings"
            )
    if "schemaVersion" in document:
        version = document["schemaVersion"]
        if version is not None and (isinstance(version, bool) or not isinstance(version, int)):
            raise WatchConfigValidationError("document.schemaVersion must be an integer")
    for key in _VOICE_STRING_KEYS:
        if key in document and not isinstance(document[key], str):
            raise WatchConfigValidationError(f"document.{key} must be a string")
    for key in _VOICE_OPTIONAL_STRING_KEYS:
        if document.get(key) is not None and not isinstance(document[key], str):
            raise WatchConfigValidationError(f"document.{key} must be a string")
    for key in _VOICE_OPTIONAL_BOOL_KEYS:
        if document.get(key) is not None and not isinstance(document[key], bool):
            raise WatchConfigValidationError(f"document.{key} must be a bool")


def _check_status_pages(pages: list[Any]) -> None:
    """The status pages' shape guard, for every writer.

    Each page is an object with a non-empty string ``id``, no two pages
    sharing one, and a string ``name``. Its ``rows`` is a list of objects,
    each with a non-empty string ``id``, no two in the page sharing one. The
    same id in two pages is not refused: each page is a list of its own.

    The watch decodes the whole list or nothing, so a page or row with no id
    (the app's decoder requires both) must not land whoever writes it. Tiles
    and menu slots point at pages by id, so two pages sharing one would open
    the wrong page. Ids are compared ignoring case, as for pages: the app
    reads them as UUIDs. No other key is looked at, so a newer app can add
    some.
    """
    seen: dict[str, int] = {}
    for index, page in enumerate(pages):
        where = f"document.statusPages[{index}]"
        if not isinstance(page, dict):
            raise WatchConfigValidationError(f"{where} must be an object")
        page_id = page.get("id")
        if not isinstance(page_id, str) or not page_id:
            raise WatchConfigValidationError(f"{where}.id must be a non-empty string")
        folded = page_id.upper()
        if folded in seen:
            raise WatchConfigValidationError(
                f'{where} has the page id "{page_id}" of '
                f"document.statusPages[{seen[folded]}]; page ids must be unique"
            )
        seen[folded] = index
        if not isinstance(page.get("name"), str):
            raise WatchConfigValidationError(f"{where}.name must be a string")
        rows = page.get("rows")
        if not isinstance(rows, list):
            raise WatchConfigValidationError(f"{where}.rows must be a list")
        seen_rows: dict[str, int] = {}
        for row_index, row in enumerate(rows):
            at = f"{where}.rows[{row_index}]"
            if not isinstance(row, dict):
                raise WatchConfigValidationError(f"{at} must be an object")
            row_id = row.get("id")
            if not isinstance(row_id, str) or not row_id:
                raise WatchConfigValidationError(f"{at}.id must be a non-empty string")
            folded_row = row_id.upper()
            if folded_row in seen_rows:
                raise WatchConfigValidationError(
                    f'{at} has the row id "{row_id}" of rows[{seen_rows[folded_row]}]; '
                    "row ids must be unique in a page"
                )
            seen_rows[folded_row] = row_index


# The string keys every Control Center entry carries besides its `entityId`.
# The app's decoder (`CuratedEntity`) requires all of them.
_CONTROL_CENTER_STRING_KEYS = ("displayName", "iconName", "domain")


def _check_control_center(entities: list[Any]) -> None:
    """The Control Center list's shape guard, for every writer.

    Each entry is an object with a non-empty string ``entityId``, no two
    entries sharing one, and a string ``displayName``, ``iconName`` and
    ``domain``. The watch decodes the whole list or nothing, so an entry
    missing one of these (the app's decoder requires all four) must not land
    whoever writes it, and a control that offers the same entity twice is
    one the phone's editor cannot make. Entity ids are compared as written:
    Home Assistant's are lowercase. No other key is looked at, so a newer app
    can add some, and the domain is not checked against the ones the watch
    shows: an entry in any other domain is stored and never drawn.
    """
    seen: dict[str, int] = {}
    for index, entity in enumerate(entities):
        where = f"document.entities[{index}]"
        if not isinstance(entity, dict):
            raise WatchConfigValidationError(f"{where} must be an object")
        entity_id = entity.get("entityId")
        if not isinstance(entity_id, str) or not entity_id:
            raise WatchConfigValidationError(
                f"{where}.entityId must be a non-empty string"
            )
        if entity_id in seen:
            raise WatchConfigValidationError(
                f'{where} has the entity id "{entity_id}" of '
                f"document.entities[{seen[entity_id]}]; entity ids must be unique"
            )
        seen[entity_id] = index
        for key in _CONTROL_CENTER_STRING_KEYS:
            if not isinstance(entity.get(key), str):
                raise WatchConfigValidationError(f"{where}.{key} must be a string")


# The sections a menus document carries, every one required: the Anywhere
# menu (`QuickActionConfig`), the Entity quick menu (`EntityRadialConfig`) and
# the page switcher's style (`PageSwitcherConfig`). Both apps read a missing
# section as "refuse the document", never as "reset that menu", so a writer
# that drops one cannot wipe a menu by accident.
_MENUS_SECTION_KEYS = ("quickAction", "entityRadial", "pageSwitcher")


def _menus_probe(sections: dict[str, Any]) -> dict[str, Any]:
    """A whole menus document holding one menu's ``sections``, every other
    section a blank object, keys sorted as the phone writes them: what the
    menus guard (:func:`_check_menus`) needs to look at one menu, and the
    document a library read of a menu returns. The blanks are never saved:
    a library save of a menu reads only its own unit's sections."""
    whole = {"schemaVersion": 1, **{key: {} for key in _MENUS_SECTION_KEYS}, **sections}
    return {key: whole[key] for key in sorted(whole)}


def _check_menus(document: dict[str, Any]) -> None:
    """The menus' shape guard, for every writer.

    ``quickAction``, ``entityRadial`` and ``pageSwitcher`` are each present
    and an object. ``quickAction.slots`` and every key of ``entityRadial``
    whose name ends in ``Slots`` are slot lists (see :func:`_check_slot_list`),
    and ``entityRadial.entityOverrides`` is absent or an object whose every
    value is a slot list. A slot with no id is given a new one on every decode
    and two slots sharing one confuse the editor, so neither may land whoever
    writes it. No other key is looked at, so a newer app can add some.
    """
    for key in _MENUS_SECTION_KEYS:
        if key not in document:
            raise WatchConfigValidationError(f"document.{key} is required")
        if not isinstance(document[key], dict):
            raise WatchConfigValidationError(f"document.{key} must be an object")
    quick_action = document["quickAction"]
    if "slots" in quick_action:
        _check_slot_list(quick_action["slots"], "document.quickAction.slots")
    entity_radial = document["entityRadial"]
    for key, slots in entity_radial.items():
        if key.endswith("Slots"):
            _check_slot_list(slots, f"document.entityRadial.{key}")
    if "entityOverrides" not in entity_radial:
        return
    overrides = entity_radial["entityOverrides"]
    if not isinstance(overrides, dict):
        raise WatchConfigValidationError(
            "document.entityRadial.entityOverrides must be an object"
        )
    for entity_id, slots in overrides.items():
        _check_slot_list(
            slots, f'document.entityRadial.entityOverrides["{entity_id}"]'
        )


def _check_slot_list(slots: Any, where: str) -> None:
    """One menu slot list: a list of objects, each with a non-empty string
    ``id``, no two in the list sharing one.

    Ids are compared ignoring case, as for pages: the app reads them as UUIDs,
    which parse the same either way. The same id in two different lists is
    not refused: each list is a menu of its own.
    """
    if not isinstance(slots, list):
        raise WatchConfigValidationError(f"{where} must be a list")
    seen: dict[str, int] = {}
    for index, slot in enumerate(slots):
        at = f"{where}[{index}]"
        if not isinstance(slot, dict):
            raise WatchConfigValidationError(f"{at} must be an object")
        slot_id = slot.get("id")
        if not isinstance(slot_id, str) or not slot_id:
            raise WatchConfigValidationError(f"{at}.id must be a non-empty string")
        folded = slot_id.upper()
        if folded in seen:
            raise WatchConfigValidationError(
                f'{at} has the slot id "{slot_id}" of {where}[{seen[folded]}]; '
                "slot ids must be unique in a list"
            )
        seen[folded] = index


# The library lists a catalog may carry, each optional. Macros were removed,
# but an older phone still sends its `macros` list, so it stays accepted (and
# checked) here; the panel no longer reads it.
_CATALOG_LIST_KEYS = ("httpActions", "macros", "statusPages")


def _check_catalog(document: dict[str, Any]) -> None:
    """The library catalog's shape guard, for every writer.

    ``httpActions``, ``macros`` and ``statusPages`` are each absent or a list,
    and each entry an object with a non-empty string ``id`` and a string
    ``name``. What the panel's picker needs to list an entry and point a tile
    at it; ``macros`` is only an older phone's leftover, kept so its catalog
    is still accepted. No other key is looked at, so a newer app can add some.
    """
    for list_key in _CATALOG_LIST_KEYS:
        if list_key not in document:
            continue
        entries = document[list_key]
        if not isinstance(entries, list):
            raise WatchConfigValidationError(f"document.{list_key} must be a list")
        for index, entry in enumerate(entries):
            where = f"document.{list_key}[{index}]"
            if not isinstance(entry, dict):
                raise WatchConfigValidationError(f"{where} must be an object")
            entry_id = entry.get("id")
            if not isinstance(entry_id, str) or not entry_id:
                raise WatchConfigValidationError(f"{where}.id must be a non-empty string")
            if not isinstance(entry.get("name"), str):
                raise WatchConfigValidationError(f"{where}.name must be a string")


def _check_pages(pages: list[Any], *, check_items: bool) -> None:
    """The page config's shape guard, in two levels.

    Every writer: each page is an object with a non-empty string ``id``, and
    no two pages share one. Duplicate page ids crash the watch, and a page with
    no id is given a new one on every decode, so neither may land whoever
    writes it.

    With ``check_items`` (a panel save or a restore): ``items`` is a list when
    present, each item an object with a non-empty string ``id`` and
    ``entityId``, and no two items in one page share an id. A device save
    skips this level on purpose: a phone refused for a fault in its own old
    tiles could never upload again, while the panel can always fix what it
    sends.

    Ids are compared ignoring case. The app reads them as UUIDs, which parse
    the same either way, so ``"ab"`` and ``"AB"`` are one id on the watch.
    """
    seen: dict[str, int] = {}
    for index, page in enumerate(pages):
        where = f"document.pages[{index}]"
        if not isinstance(page, dict):
            raise WatchConfigValidationError(f"{where} must be an object")
        page_id = page.get("id")
        if not isinstance(page_id, str) or not page_id:
            raise WatchConfigValidationError(f"{where}.id must be a non-empty string")
        folded = page_id.upper()
        if folded in seen:
            raise WatchConfigValidationError(
                f'{where} has the page id "{page_id}" of '
                f"document.pages[{seen[folded]}]; page ids must be unique"
            )
        seen[folded] = index
        if check_items:
            _check_items(page, f'{where} (id "{page_id}")')


def _check_items(page: dict[str, Any], where: str) -> None:
    """The tile level of :func:`_check_pages` for one page. ``where`` names
    the page by index and id, so a refusal says which page to look at."""
    if "items" not in page:
        return
    items = page["items"]
    if not isinstance(items, list):
        raise WatchConfigValidationError(f"{where}.items must be a list")
    seen: dict[str, int] = {}
    for index, item in enumerate(items):
        at = f"{where}.items[{index}]"
        if not isinstance(item, dict):
            raise WatchConfigValidationError(f"{at} must be an object")
        for key in ("id", "entityId"):
            value = item.get(key)
            if not isinstance(value, str) or not value:
                raise WatchConfigValidationError(f"{at}.{key} must be a non-empty string")
        folded = item["id"].upper()
        if folded in seen:
            raise WatchConfigValidationError(
                f'{at} has the item id "{item["id"]}" of items[{seen[folded]}]; '
                "item ids must be unique in a page"
            )
        seen[folded] = index


def canonical_hash(document: dict[str, Any]) -> str:
    """The hash the server writes for a panel save: SHA-256 of compact,
    sorted-key JSON, as lowercase hex.

    Exactly ``json.dumps(document, sort_keys=True, separators=(",", ":"),
    ensure_ascii=False)`` encoded as UTF-8: keys in code point order, no
    whitespace, non-ASCII unescaped and ``/`` not escaped. The phone hashes its
    own encoder's bytes, which escape ``/`` and may order keys differently, so
    it should not expect to arrive at this value for the same document. A
    phone that compares its own hash with this one reads the panel's save as a
    local change and uploads it back once, which is harmless but visible as an
    extra revision.
    """
    encoded = json.dumps(
        document, sort_keys=True, separators=(",", ":"), ensure_ascii=False
    )
    return hashlib.sha256(encoded.encode("utf-8")).hexdigest()


def _validate_revision(revision: Any) -> int:
    """A history revision to look up: a whole number of at least 1."""
    if isinstance(revision, bool) or not isinstance(revision, int) or revision < 1:
        raise WatchConfigValidationError("revision must be a positive integer")
    return revision


def _validate_base_revision(base_revision: Any) -> int:
    if (
        isinstance(base_revision, bool)
        or not isinstance(base_revision, int)
        or base_revision < 0
    ):
        raise WatchConfigValidationError("base_revision must be a non-negative integer")
    return base_revision


def validate_hash(document_hash: Any) -> str:
    """The client's document hash: 64 lowercase hex characters."""
    if not isinstance(document_hash, str) or not _HASH_RE.fullmatch(document_hash):
        raise WatchConfigValidationError(
            "hash must be a SHA-256 digest in lowercase hex"
        )
    return document_hash


def _text_or_none(value: Any) -> str | None:
    """A stored string field, or ``None`` when it is absent, empty or junk."""
    return value if isinstance(value, str) and value else None


# The longest reason an unreadable report keeps. The watch sends a few words;
# anything longer is cut rather than refused, so the report itself still lands.
REJECT_REASON_MAX_CHARS = 120


def reject_reason(value: Any) -> str | None:
    """A device's reason for an unreadable report, made safe to keep and show.

    ``None`` for anything but a string, and for one that is empty once control
    characters are dropped and runs of white space are made one space. Longer
    than :data:`REJECT_REASON_MAX_CHARS` is cut to it. Never refuses: a bad
    reason must not cost the report it came with.
    """
    if not isinstance(value, str):
        return None
    text = " ".join(
        "".join(ch if ch.isprintable() else " " for ch in value).split()
    )
    return text[:REJECT_REASON_MAX_CHARS].rstrip() or None


@dataclass
class WatchConfigHistoryEntry:
    """One document a later save replaced, with that revision's own envelope.

    Every entry this build files carries all four envelope fields. ``None``
    is for one read off disk without a field (hand-edited, or written by a
    build that left it empty): the entry is kept, and the panel shows the
    field as unknown.
    """

    revision: int
    hash: str | None
    updated_at: str | None
    updated_by: str | None
    document: dict[str, Any]

    def as_dict(self) -> dict[str, Any]:
        return {
            "revision": self.revision,
            "hash": self.hash,
            "updated_at": self.updated_at,
            "updated_by": self.updated_by,
            "document": self.document,
        }

    def summary(self) -> dict[str, Any]:
        """The entry as the panel's history list shows it: the envelope and
        the document's size (compact UTF-8 JSON, as the cap measures it), but
        never the document."""
        return {
            "revision": self.revision,
            "hash": self.hash,
            "updated_at": self.updated_at,
            "updated_by": self.updated_by,
            "size": document_size(self.document),
        }

    @classmethod
    def from_dict(cls, raw: Any) -> WatchConfigHistoryEntry | None:
        """One entry off disk, or ``None`` for anything unusable.

        Junk drops rather than refuses: history is a safety net, and a
        hand-edited file must not cost someone their current config. Only a
        whole-number revision and an object document are required; a missing
        envelope field reads as ``None``.
        """
        if not isinstance(raw, dict):
            return None
        revision = raw.get("revision")
        document = raw.get("document")
        if isinstance(revision, bool) or not isinstance(revision, int):
            return None
        if not isinstance(document, dict):
            return None
        return cls(
            revision=revision,
            hash=_text_or_none(raw.get("hash")),
            updated_at=_text_or_none(raw.get("updated_at")),
            updated_by=_text_or_none(raw.get("updated_by")),
            document=document,
        )


@dataclass
class WatchConfigRecord:
    """One owner's document of one kind, plus its envelope."""

    owner_watch_id: str
    kind: str
    revision: int
    hash: str
    updated_at: str
    updated_by: str
    document: dict[str, Any]
    # Past documents, oldest first. No signed reply carries it; the panel
    # lists and restores it.
    history: list[WatchConfigHistoryEntry] = field(default_factory=list)
    # Measured on save and on load, never written to disk. Diagnostics report
    # it so a large config is visible without anyone reading the document.
    size_bytes: int = 0
    # The highest revision a device is known to hold (0 for none), and when
    # that became known (``None`` for never). See the module docstring.
    delivered_revision: int = 0
    delivered_at: str | None = None
    # The last revision a device reported it could not decode (0 for none),
    # and when (``None`` for never). See the module docstring.
    rejected_revision: int = 0
    rejected_at: str | None = None
    # The device's words for why, when it gave any. Kept and cleared with
    # ``rejected_revision``.
    rejected_reason: str | None = None
    # The watch's plan, pages only. See the module docstring.
    multiple_pages: bool | None = None

    def as_storage_dict(self) -> dict[str, Any]:
        stored: dict[str, Any] = {
            "revision": self.revision,
            "hash": self.hash,
            "updated_at": self.updated_at,
            "updated_by": self.updated_by,
            "delivered_revision": self.delivered_revision,
            "delivered_at": self.delivered_at,
            "rejected_revision": self.rejected_revision,
            "rejected_at": self.rejected_at,
            "rejected_reason": self.rejected_reason,
            "document": self.document,
        }
        if self.multiple_pages is not None:
            stored["multiple_pages"] = self.multiple_pages
        if self.history:
            stored["history"] = [entry.as_dict() for entry in self.history]
        return stored

    def mark_delivered(self, revision: int, *, confirmed: bool = False) -> bool:
        """Record that a device holds ``revision``. Returns whether anything
        moved.

        ``delivered_revision`` only ever forwards, and never past the record's
        own revision, so a reply carrying an older copy cannot make a newer
        save look delivered.

        ``confirmed`` means the device itself said it holds ``revision`` (it
        asked from that revision), not merely that the document was sent to
        it. Only then is an unreadable report about that revision
        or an earlier one cleared: the device has since read and applied it,
        and the panel must stop offering to restore an older save. A plain
        delivery leaves the report alone, because the get that carries the
        document out counts as a delivery before the device has tried to
        read it.
        """
        revision = min(revision, self.revision)
        moved = False
        if confirmed and 0 < self.rejected_revision <= revision:
            self.rejected_revision = 0
            self.rejected_at = None
            self.rejected_reason = None
            moved = True
        if revision > self.delivered_revision:
            self.delivered_revision = revision
            self.delivered_at = _now_iso()
            moved = True
        return moved

    def mark_rejected(self, reason: str | None = None) -> bool:
        """Record that a device could not decode the current revision, and
        why when it said (``reason``, already cleaned by
        :func:`reject_reason`). Returns whether anything moved.

        Always the current revision: a report about an older one says nothing
        about what is stored now. A repeat keeps the first time, so a phone
        reporting on every check costs no disk write after the first. A repeat
        that gives a reason the report lacks, or a different one, updates the
        reason only; a repeat with no reason keeps the one already given.
        """
        if self.rejected_revision == self.revision:
            if reason is None or reason == self.rejected_reason:
                return False
            self.rejected_reason = reason
            return True
        self.rejected_revision = self.revision
        self.rejected_at = _now_iso()
        self.rejected_reason = reason
        return True

    def history_entry(self, revision: int) -> WatchConfigHistoryEntry | None:
        """The history entry filed at ``revision``, or ``None``.

        The newest one when two share a revision, which a move onto a watch
        that already had a record can cause (the other watch's document is
        filed with its own numbering).
        """
        for entry in reversed(self.history):
            if entry.revision == revision:
                return entry
        return None

    @classmethod
    def from_dict(
        cls, owner_watch_id: str, kind: str, raw: Any
    ) -> WatchConfigRecord | None:
        if not isinstance(raw, dict):
            return None
        revision = raw.get("revision")
        document = raw.get("document")
        if isinstance(revision, bool) or not isinstance(revision, int) or revision < 1:
            return None
        if not isinstance(document, dict):
            return None
        history_raw = raw.get("history")
        history = (
            [
                entry
                for item in history_raw
                if (entry := WatchConfigHistoryEntry.from_dict(item)) is not None
            ]
            if isinstance(history_raw, list)
            else []
        )
        try:
            size = document_size(document)
        except WatchConfigValidationError:
            return None
        # Absent from every file written before delivery was tracked, which
        # reads as "not known to be delivered". Junk reads the same way: the
        # next device get sets it right, and a record is never dropped for it.
        delivered_revision = raw.get("delivered_revision", 0)
        if (
            isinstance(delivered_revision, bool)
            or not isinstance(delivered_revision, int)
            or delivered_revision < 0
        ):
            delivered_revision = 0
        delivered_at = _text_or_none(raw.get("delivered_at"))
        # The same for the unreadable report, which files written before it
        # existed lack: 0 and no time. One past the record's revision cannot
        # be about anything stored, so it reads as none too.
        rejected_revision = raw.get("rejected_revision", 0)
        if (
            isinstance(rejected_revision, bool)
            or not isinstance(rejected_revision, int)
            or not 0 < rejected_revision <= revision
        ):
            rejected_revision = 0
        rejected_at = _text_or_none(raw.get("rejected_at"))
        rejected_reason = reject_reason(raw.get("rejected_reason"))
        multiple_pages = raw.get("multiple_pages")
        return cls(
            owner_watch_id=owner_watch_id,
            kind=kind,
            revision=revision,
            hash=str(raw.get("hash", "")),
            updated_at=str(raw.get("updated_at", "")),
            updated_by=str(raw.get("updated_by", "")),
            document=document,
            history=history[-WATCH_CONFIG_HISTORY_LIMIT:],
            size_bytes=size,
            delivered_revision=min(delivered_revision, revision),
            delivered_at=delivered_at if delivered_revision > 0 else None,
            rejected_revision=rejected_revision,
            rejected_at=rejected_at if rejected_revision > 0 else None,
            rejected_reason=rejected_reason if rejected_revision > 0 else None,
            multiple_pages=multiple_pages if isinstance(multiple_pages, bool) else None,
        )

    def remember(self, entry: WatchConfigHistoryEntry) -> None:
        """File a document into the history, oldest dropped past the limit."""
        self.history.append(entry)
        if len(self.history) > WATCH_CONFIG_HISTORY_LIMIT:
            del self.history[: len(self.history) - WATCH_CONFIG_HISTORY_LIMIT]

    def current_as_history(self) -> WatchConfigHistoryEntry:
        return WatchConfigHistoryEntry(
            revision=self.revision,
            hash=self.hash,
            updated_at=self.updated_at,
            updated_by=self.updated_by,
            document=self.document,
        )


@dataclass(frozen=True)
class WatchConfigChange:
    """What a listener receives: one owner's ``kind`` now stands at ``revision``.

    Revision 0 means the owner holds nothing of that kind any more (a forget,
    or the source side of a move). Only the number travels, on purpose: the
    live line it feeds is open to any signed-in user, and the document still
    reaches the phone only through the signed get.
    """

    owner_watch_id: str
    kind: str
    revision: int


ChangeListener = Callable[[WatchConfigChange], None]


@dataclass(frozen=True)
class WatchConfigDelivery:
    """What a delivery listener receives: what a device holds of one owner's
    ``kind`` moved, by a delivery or an unreadable report. No revision
    travels: the panel reads where every kind stands from its summary."""

    owner_watch_id: str
    kind: str


DeliveryListener = Callable[[WatchConfigDelivery], None]


class _LibrarySave(NamedTuple):
    """A save of a library kind, worked out before anything is written: the
    document the record will hold, whether that is the document as sent, its
    size, the library after the save, the page and status page ids the save
    gave new ids (``{kind: {old: new}}``), and whether any id in what is
    stored differs from what was sent (this save's forks, or ids an earlier
    first record of the owner renamed), which a device cannot know."""

    document: dict[str, Any]
    kept: bool
    size: int
    library: dict[str, Any]
    renamed: dict[str, dict[str, str]]
    rewritten: bool


# Whether an owner id has a pair in the secret store: the one question the
# panel's create path asks (see WatchConfigStore.panel_save). The same shape
# answers whether an owner is an iPhone (see WatchConfigStore._for_owner).
PairedCheck = Callable[[str], bool]


class WatchConfigStore:
    """Every owner's watch config records, one storage file per owner."""

    def __init__(
        self,
        hass: HomeAssistant,
        *,
        is_paired: PairedCheck | None = None,
        is_iphone: PairedCheck | None = None,
        may_await_move: PairedCheck | None = None,
        device_name: Callable[[str], str | None] | None = None,
        rename_pages: Callable[[str, dict[str, str]], None] | None = None,
    ) -> None:
        """``is_paired`` answers whether an owner id is a paired watch in the
        secret store (an iPhone entry does not count). Setup passes
        ``WidgetSecretStore.is_paired_watch``; without it no
        owner counts as paired, so the panel can never create a record (what
        a store made only to remove its files, or a test, wants).

        ``is_iphone`` answers whether an owner id is a paired iPhone. Setup
        passes ``WidgetSecretStore.is_paired_iphone``. Every write for such an
        owner keeps to the phone's kinds and settings (:meth:`_for_owner`),
        and the panel may create its first record of one of those kinds.
        Without it no owner is an iPhone, as before phone pages.

        ``may_await_move`` answers whether an iPhone may still move a watch's
        own setup here (the owner list's ``has_iphone``). Setup passes
        ``WidgetSecretStore.may_await_move``. A pick, a copy or a voice link
        never makes such a watch's first record of a kind (``awaiting_move``, see
        :meth:`_check_not_awaiting_move`). Without it no watch waits.

        ``device_name`` names an owner as its user calls it, for the menus
        the library makes ("Jesse's Apple Watch's menu"); without it, or
        when it has no name, the owner id stands in. ``rename_pages`` is told
        ``(owner, {old page id: new page id})`` when the library gives one
        of an owner's pages a new id (the first start's migration, or a
        device's first upload of a page under an id another page holds), so
        setup can point that owner's complication taps at the new id; they
        live in another store."""
        self._hass = hass
        self._is_paired = is_paired
        self._is_iphone = is_iphone
        self._may_await_move = may_await_move
        self._device_name = device_name
        self._rename_pages = rename_pages
        # The library (library.py) and its file. Loaded after the records;
        # unreadable refuses every write of a library kind until a restart.
        self._library: dict[str, Any] = empty_library()
        self._library_file: Store = Store(
            hass, WATCH_LIBRARY_STORAGE_VERSION, WATCH_LIBRARY_STORAGE_KEY
        )
        self._library_failed = False
        self._library_save_pending = False
        # The owner order of the index as read, which the migration follows.
        self._index_order: list[str] = []
        self._listeners: list[ChangeListener] = []
        # Deliveries and unreadable reports, apart from the change listeners
        # (see the module docstring).
        self._delivery_listeners: list[DeliveryListener] = []
        # owner_watch_id → kind → record
        self._records: dict[str, dict[str, WatchConfigRecord]] = {}
        # One Store per owner, kept for the life of this instance so a forget
        # followed by a new save reuses the object whose pending write the
        # removal cancelled, rather than racing a second one at the same file.
        self._files: dict[str, Store] = {}
        # Owners whose file could not be read; see WatchConfigUnavailableError.
        self._failed_owners: set[str] = set()
        # Set when the index could not be read. Every owner is then unknown,
        # so everything is refused until a restart.
        self._load_failed = False
        self._index: Store = Store(
            hass, WATCH_CONFIG_STORAGE_VERSION, WATCH_CONFIG_STORAGE_KEY
        )
        # Debounced saves still waiting (see async_shutdown), and whether the
        # entry has unloaded, after which this instance saves nothing.
        self._index_save_pending = False
        self._pending_owners: set[str] = set()
        self._closed = False
        # Every new revision is above this (see _revision_floor). 0 until a
        # load finds an index: a fresh install has handed nothing out.
        self._revision_floor = 0

    # ── persistence ────────────────────────────────────────────────────

    def _next_revision(self, current: int) -> int:
        """The revision a save of a record now at ``current`` (0 for none)
        gets."""
        return max(current, self._revision_floor) + 1

    def _file(self, owner_watch_id: str) -> Store:
        store = self._files.get(owner_watch_id)
        if store is None:
            store = Store(
                self._hass, WATCH_CONFIG_STORAGE_VERSION, _owner_key(owner_watch_id)
            )
            self._files[owner_watch_id] = store
        return store

    async def _async_read_index(self) -> list[str] | None:
        """The owner ids the index names, or ``None`` when it is unreadable."""
        index = await self._async_read_index_file()
        return None if index is None else index[0]

    async def _async_read_index_file(self) -> tuple[list[str], int | None] | None:
        """``(owners, saved floor)`` from the index, the floor None when there
        is no index (0 for one written before the floor existed). ``None``
        when it is unreadable."""
        try:
            data = await self._index.async_load()
        except Exception:
            _LOGGER.exception(
                "Could not read .storage/%s; watch config is unavailable until "
                "Home Assistant restarts with a readable file",
                WATCH_CONFIG_STORAGE_KEY,
            )
            return None
        if not data:
            return [], None
        owners = data.get("owners") if isinstance(data, dict) else None
        if not isinstance(owners, list):
            _LOGGER.error(
                "Could not read .storage/%s: expected an owner list; watch "
                "config is unavailable until Home Assistant restarts with a "
                "readable file",
                WATCH_CONFIG_STORAGE_KEY,
            )
            return None
        floor = data.get("revision_floor")
        if isinstance(floor, bool) or not isinstance(floor, int) or floor < 0:
            floor = 0
        return [owner for owner in owners if isinstance(owner, str) and owner], floor

    async def async_load(self) -> None:
        """Read the index, then every owner file it names.

        A failure is contained the way ``ComplicationStore.async_load``
        contains one: setup carries on, and whatever could not be read is
        never saved over. An unreadable index refuses everything; an
        unreadable owner file refuses that owner alone.
        """
        index = await self._async_read_index_file()
        if index is None:
            self._load_failed = True
            return
        owners, saved_floor = index
        self._index_order = list(owners)
        dropped = False
        for owner in owners:
            try:
                data = await self._file(owner).async_load()
            except Exception:
                self._failed_owners.add(owner)
                _LOGGER.exception(
                    "Could not read the watch config file for %s; refusing its "
                    "reads and saves until Home Assistant restarts with a "
                    "readable file",
                    owner,
                )
                continue
            raw_records = data.get("records") if isinstance(data, dict) else None
            if data and not isinstance(raw_records, dict):
                self._failed_owners.add(owner)
                _LOGGER.error(
                    "Watch config file for %s is not the shape this store "
                    "writes; refusing its reads and saves",
                    owner,
                )
                continue
            records: dict[str, WatchConfigRecord] = {}
            for kind, raw in (raw_records or {}).items():
                if not isinstance(kind, str):
                    continue
                # A kind this build does not know is still kept on disk, its
                # document, revision, hash and history unchanged: a downgrade
                # must not erase what a newer build stored. It is held in
                # memory only to be written back (with this build's delivery
                # fields added, which a newer build reads the same way).
                record = WatchConfigRecord.from_dict(owner, kind, raw)
                if record is not None:
                    records[kind] = record
            if records:
                self._records[owner] = records
            else:
                # Listed but empty or missing: nothing to keep an entry for.
                dropped = True
        if saved_floor is not None:
            highest = max(
                (r.revision for by_kind in self._records.values() for r in by_kind.values()),
                default=0,
            )
            self._revision_floor = _revision_floor(saved_floor, highest)
            # Written now, before any revision above it is handed out, so the
            # next start's floor clears every revision this run gives out.
            try:
                await self._index.async_save(self._serialize_index())
                dropped = False
            except Exception:  # noqa: BLE001 (the debounced save retries it)
                _LOGGER.exception("Could not write the watch config revision floor")
                dropped = True
        if dropped:
            self._schedule_index_save()
        # After the floor is written, so every record the library rewrites
        # gets a revision above it.
        await self._async_load_library()
        _LOGGER.debug(
            "Loaded watch config for %d owner(s), %d unreadable",
            len(self._records),
            len(self._failed_owners),
        )

    # ── the library: load, migration, materialisation ──────────────────
    #
    # The home's pages, status pages and menus live once, in the library
    # (library.py); each owner's `pages`, `status_pages` and `menus` records
    # are built from it and the owner's picks (`materialise`). Every accepted
    # write of one of those records, by any writer, is turned back into
    # library and picks writes (`map_back`) before it is stored, and every
    # other record the change reaches is rebuilt and written through
    # `_write` (`_apply_library`). `_write` never maps back, so nothing
    # recurses. The records stay valid at every step: going back to code
    # without the library loses only the library, which the next start with
    # it builds again.

    async def _async_load_library(self) -> None:
        """Read the library, or build it from the records the first time.

        A missing file means a start with no library yet: :func:`migrate`
        builds it from every readable record, each record the migration
        changes (an id taken by another device's different page, an old link
        token) is written again as a new revision, and the file is written.
        A file that exists is never migrated again; instead each record whose
        hash is not the one the library last wrote or read for it (a save by
        older code after a rollback, or an owner that could not be read
        then) is mapped back as a save of that owner. An unreadable file
        refuses the library's kinds until a restart."""
        if self._load_failed:
            return
        try:
            raw = await self._library_file.async_load()
        except Exception:
            self._library_failed = True
            _LOGGER.exception(
                "Could not read .storage/%s; pages, status pages and menus "
                "cannot be saved until Home Assistant restarts with a readable file",
                WATCH_LIBRARY_STORAGE_KEY,
            )
            return
        if raw is None:
            self._migrate_library()
        else:
            self._library = validate_library(raw)
            self._reconcile_library()
        # A home with nothing to put in a library writes no file yet.
        changed = raw != self._library if raw is not None else self._library != empty_library()
        if changed:
            try:
                await self._library_file.async_save(self._serialize_library())
            except Exception:
                _LOGGER.exception("Could not write the library; the debounced save retries it")
                self._schedule_library_save()

    def _migrate_library(self) -> None:
        """Build the library from the records (the first start with it).

        Owners are taken in the index's order, which is the owner ids
        sorted. So where two copies of one page differ, whether linked (a
        fan-out that failed on a cap left them apart) or not, the owner
        whose id sorts first keeps its content under the id; which copy was
        edited last is not known here. The ids the migration renamed are
        kept in the library for each owner's later first records."""
        records = {
            owner: {
                kind: record.document
                for kind, record in by_kind.items()
                if kind in (*LIBRARY_KINDS, "rooms", "behavior")
            }
            for owner, by_kind in self._records.items()
            if owner not in self._failed_owners
        }
        names = {owner: self._owner_name(owner) for owner in records}
        result = migrate(records, self._index_order, names)
        self._library = result.library
        for owner, renamed in sorted(result.renamed.items()):
            self._library = hold_renames(self._library, owner, renamed)
        for owner, by_kind in sorted(result.rewritten.items()):
            for kind, document in by_kind.items():
                self._write_quietly(owner, kind, document, _MIGRATION_WRITER)
        self._sync_records(_MIGRATION_WRITER)
        for owner, renamed in sorted(result.renamed.items()):
            self._tell_page_renames(owner, renamed.get("pages", {}))
        _LOGGER.info(
            "Built the library from %d device(s): %d page(s), %d status page(s), "
            "%d menu(s); %d device(s) had records written again",
            len(result.library["picks"]),
            len(result.library["pages"]),
            len(result.library["status_pages"]),
            len(result.library["menus"]),
            len(result.changed),
        )

    def _reconcile_library(self) -> None:
        """Fold into the library what changed in the records behind its back.

        An owner the library still names but no record holds (forgotten by
        older code) is forgotten. Each readable record of a library kind
        whose hash is not the one the library noted for it is mapped back as
        that owner's save, in index order, a first one for a kind the owner
        picks nothing of (:func:`library.map_back` with ``fork_conflicts``),
        with the ids the library renamed for the owner so far (this run's
        and earlier ones) rewritten in it first, exactly as a first upload
        is (:meth:`_prepare_library_save`). A record at a revision below the
        one the library noted for it is not mapped back: its own save never
        reached the disk while the library's did (a hard crash inside the
        save window), so the library is the newer of the two. Then every
        record that differs from what the library now builds is written
        again, those stale ones included."""
        lib = self._library
        for owner in sorted(lib["picks"]):
            if owner not in self._records and owner not in self._failed_owners:
                lib = library_forget(lib, owner).library
        order = list(dict.fromkeys([*self._index_order, *sorted(self._records)]))
        mapped = 0
        for owner in order:
            if owner in self._failed_owners:
                continue
            for kind in LIBRARY_KINDS:
                record = self._records.get(owner, {}).get(kind)
                if record is None or lib["hashes"].get(owner, {}).get(kind) == record.hash:
                    continue
                noted = lib["revisions"].get(owner, {}).get(kind)
                if noted is not None and record.revision < noted:
                    _LOGGER.info(
                        "The %s of %s on disk is older than the library; building it again",
                        kind,
                        owner,
                    )
                    continue
                first = kind not in lib["picks"].get(owner, {})
                document = record.document
                if first:
                    renames = held_renames(lib, owner)
                    document = rename_refs(
                        kind, document, renames["pages"], renames["status_pages"]
                    )
                try:
                    result = map_back(
                        lib,
                        owner,
                        kind,
                        document,
                        fork_conflicts=first,
                        owner_name=self._owner_name(owner),
                    )
                except LibraryError as err:
                    _LOGGER.warning("Could not fold %s of %s into the library: %s", kind, owner, err)
                    continue
                lib = hold_renames(result.library, owner, result.renamed)
                mapped += 1
                self._follow_renames(owner, result.renamed, _MIGRATION_WRITER)
        self._library = lib
        self._sync_records(_MIGRATION_WRITER)
        if mapped:
            _LOGGER.info("Folded %d record(s) changed outside the library back into it", mapped)

    def _sync_records(self, updated_by: str) -> None:
        """Write again every readable record of a library kind that differs
        from what the library builds for it, and note every record's hash."""
        for owner in sorted(self._records):
            if owner in self._failed_owners:
                continue
            for kind in LIBRARY_KINDS:
                record = self._records[owner].get(kind)
                if record is None:
                    continue
                document = materialise(self._library, owner, kind, record.document)
                if document is not None and document != record.document:
                    self._write_quietly(owner, kind, document, updated_by)
                self._note_hash(owner, kind, save=False)

    def _write_quietly(
        self, owner_watch_id: str, kind: str, document: dict[str, Any], updated_by: str
    ) -> None:
        """:meth:`_write`, with a refusal (a cap) logged rather than raised."""
        try:
            self._write(owner_watch_id, kind, document, updated_by)
        except WatchConfigStoreError as err:
            _LOGGER.warning(
                "Could not write the %s of %s from the library: %s",
                kind,
                owner_watch_id,
                err.message,
            )

    def _serialize_library(self) -> dict[str, Any]:
        return self._library

    def _schedule_library_save(self) -> None:
        if self._load_failed or self._library_failed or self._closed:
            return
        self._library_save_pending = True
        self._library_file.async_delay_save(self._serialize_library, _SAVE_DEBOUNCE_SECONDS)

    def _set_library(self, library: dict[str, Any]) -> None:
        if library != self._library:
            self._library = library
            self._schedule_library_save()

    def _note_hash(self, owner_watch_id: str, kind: str, *, save: bool = True) -> None:
        """Remember the hash and revision of the owner's record of a library
        kind, as it now stands in step with the library (see
        :meth:`_reconcile_library`)."""
        record = self._records.get(owner_watch_id, {}).get(kind)
        if record is None or kind not in LIBRARY_KINDS:
            return
        held = self._library["hashes"].setdefault(owner_watch_id, {})
        revisions = self._library["revisions"].setdefault(owner_watch_id, {})
        if held.get(kind) == record.hash and revisions.get(kind) == record.revision:
            return
        held[kind] = record.hash
        revisions[kind] = record.revision
        if save:
            self._schedule_library_save()

    def _check_library(self) -> None:
        if self._library_failed:
            raise WatchConfigUnavailableError(
                "the stored library could not be read; restart Home Assistant"
            )

    def _owner_name(self, owner_watch_id: str) -> str:
        """What the owner is called, for a menu named after it."""
        if self._device_name is not None:
            try:
                name = self._device_name(owner_watch_id)
            except Exception:
                # A name is never worth a refusal.
                _LOGGER.debug("Could not name %s", owner_watch_id, exc_info=True)
                name = None
            if isinstance(name, str) and name.strip():
                return name.strip()
        return owner_watch_id

    def _tell_page_renames(self, owner_watch_id: str, pages: dict[str, str]) -> None:
        if not pages or self._rename_pages is None:
            return
        try:
            self._rename_pages(owner_watch_id, dict(pages))
        except Exception:
            _LOGGER.exception("Could not point the complications of %s at renamed pages", owner_watch_id)

    def _follow_renames(
        self, owner_watch_id: str, renamed: dict[str, dict[str, str]], updated_by: str
    ) -> None:
        """After a save gave some of an owner's pages or status pages new ids:
        point its rooms (the ``rooms`` record, or a watch's ``behavior``) and
        its complications at the new ids. The library remembers them for the
        owner's later first records (``renames``, :func:`library.hold_renames`),
        which its caller has already done."""
        pages = renamed.get("pages", {})
        status = renamed.get("status_pages", {})
        if not pages and not status:
            return
        for kind in ("rooms", "behavior"):
            document = self._document(owner_watch_id, kind)
            if document is None:
                continue
            renamed_doc = rename_refs(kind, document, pages, status)
            if renamed_doc != document:
                self._write_quietly(owner_watch_id, kind, renamed_doc, updated_by)
        self._tell_page_renames(owner_watch_id, pages)

    def _apply_library(
        self,
        library: dict[str, Any],
        updated_by: str,
        *,
        first: str | None = None,
        strict: bool = False,
        refuse_awaiting: bool = False,
        skip: frozenset[tuple[str, str]] = frozenset(),
        seeds: dict[tuple[str, str], dict[str, Any]] | None = None,
        base: dict[str, Any] | None = None,
    ) -> tuple[list[tuple[str, str]], list[str]]:
        """Make ``library`` the store's and write every record it changes.

        The records written are those of the owners and kinds the change
        reaches (:func:`library.changed_owners`), ``first``'s before the
        others', each owner's kinds in :data:`library.LIBRARY_KINDS` order
        (a status page before the page whose tile opens it, a page before
        the menu that opens it), each built with the owner's record as its
        template (or the ``seeds`` document for an owner with none yet). A
        record already equal to what the library builds is not written, so
        no device wakes for nothing. ``skip`` names records the caller
        writes itself.

        A record the change would create for a watch whose iPhone may still
        move that kind here is never made: refused ``awaiting_move`` before
        anything changes with ``refuse_awaiting``, else left out. With
        ``strict`` every record is checked first and a refusal (a cap)
        raises before anything changes; otherwise a record that cannot take
        the change is logged and left as it was, and its owner is returned
        among the failures. ``base`` is the library the change is measured
        from, when the store's already holds it (a move). Returns ``(records
        written, failed owners)``.
        """
        touched = changed_owners(self._library if base is None else base, library)
        order = ([first] if first in touched else []) + sorted(o for o in touched if o != first)
        writes: list[tuple[str, str, dict[str, Any]]] = []
        for owner in order:
            if owner in self._failed_owners:
                continue
            for kind in touched[owner]:
                if (owner, kind) in skip:
                    continue
                record = self._records.get(owner, {}).get(kind)
                template = record.document if record is not None else (seeds or {}).get((owner, kind))
                document = materialise(library, owner, kind, template)
                if document is None or (record is not None and record.document == document):
                    continue
                if record is None and self._awaits_move(owner, kind):
                    if refuse_awaiting:
                        self._check_not_awaiting_move(owner, kind)
                    _LOGGER.info(
                        "Left %s of %s alone: its iPhone may still move its own here",
                        kind,
                        owner,
                    )
                    continue
                writes.append((owner, kind, document))
        if strict:
            for owner, kind, document in writes:
                self._check_owner_kind(owner, kind)
                validate_document(kind, document)
        self._set_library(library)
        written: list[tuple[str, str]] = []
        failed: list[str] = []
        for owner, kind, document in writes:
            try:
                self._write(owner, kind, document, updated_by)
            except WatchConfigStoreError as err:
                if owner not in failed:
                    failed.append(owner)
                _LOGGER.warning(
                    "Could not write the %s of %s from the library: %s",
                    kind,
                    owner,
                    err.message,
                )
                continue
            self._note_hash(owner, kind)
            written.append((owner, kind))
        return written, sorted(failed)

    def _revisions_of(self, written: list[tuple[str, str]]) -> dict[str, dict[str, int]]:
        """The new revision of each record written, by owner and kind."""
        out: dict[str, dict[str, int]] = {}
        for owner, kind in written:
            record = self._records.get(owner, {}).get(kind)
            if record is not None:
                out.setdefault(owner, {})[kind] = record.revision
        return out

    def _serialize_index(self) -> dict[str, Any]:
        data: dict[str, Any] = {"owners": sorted(set(self._records) | self._failed_owners)}
        if self._revision_floor:
            data["revision_floor"] = self._revision_floor
        return data

    def _serialize_owner(self, owner_watch_id: str) -> dict[str, Any]:
        return {
            "owner_watch_id": owner_watch_id,
            "records": {
                kind: record.as_storage_dict()
                for kind, record in self._records.get(owner_watch_id, {}).items()
            },
        }

    def _schedule_index_save(self) -> None:
        if self._load_failed or self._closed:
            return
        self._index_save_pending = True
        self._index.async_delay_save(self._serialize_index, _SAVE_DEBOUNCE_SECONDS)

    def _schedule_owner_save(self, owner_watch_id: str) -> None:
        if self._closed:
            return
        self._pending_owners.add(owner_watch_id)
        self._file(owner_watch_id).async_delay_save(
            lambda: self._serialize_owner(owner_watch_id), _SAVE_DEBOUNCE_SECONDS
        )

    async def async_shutdown(self) -> None:
        """Called on unload: write every save still waiting out its debounce
        now, which cancels the delayed ones, and save nothing after.

        Without it a reload's new instance reads revision N while this one
        writes N+1 a moment later, and the next save there reuses N+1 for
        different content, which a watch that applied the first N+1 never
        pulls. And an uninstall that follows removes files no one writes
        again."""
        self._closed = True
        owners = sorted(self._pending_owners)
        self._pending_owners.clear()
        for owner in owners:
            await self._file(owner).async_save(self._serialize_owner(owner))
        if self._index_save_pending:
            self._index_save_pending = False
            await self._index.async_save(self._serialize_index())
        if self._library_save_pending:
            self._library_save_pending = False
            await self._library_file.async_save(self._serialize_library())

    def _remove_owner_file(self, owner_watch_id: str) -> None:
        """Delete one owner's file, from a synchronous caller.

        ``Store.async_remove`` cancels the pending debounced write before it
        unlinks, so a save scheduled just before the forget never lands.
        """
        self._pending_owners.discard(owner_watch_id)
        self._hass.async_create_task(
            self._file(owner_watch_id).async_remove(),
            name=f"wrist_assistant_watch_config_remove_{owner_watch_id}",
        )

    async def async_remove(self) -> None:
        """Delete every owner file and the index (the integration is removed).

        Reads the index itself, so it works on a fresh instance after the
        entry is unloaded, which is how ``async_remove_entry`` calls it.
        """
        owners = await self._async_read_index() or []
        for owner in set(owners) | set(self._records):
            await self._file(owner).async_remove()
        self._records.clear()
        await self._index.async_remove()
        await self._library_file.async_remove()
        self._library = empty_library()

    # ── change notification ────────────────────────────────────────────

    @callback
    def async_add_listener(self, listener: ChangeListener) -> Callable[[], None]:
        self._listeners.append(listener)

        def _remove() -> None:
            if listener in self._listeners:
                self._listeners.remove(listener)

        return _remove

    @callback
    def async_add_delivery_listener(self, listener: DeliveryListener) -> Callable[[], None]:
        """Hear every delivery and unreadable report that moved what a device
        holds. Kept apart from ``async_add_listener`` on purpose: the watch's
        delta wake rides on those, and a delivery heard there would wake the
        watch that was just delivered to. Only the panel's Home listens here
        (``watch_config/subscribe_delivery``)."""
        self._delivery_listeners.append(listener)

        def _remove() -> None:
            if listener in self._delivery_listeners:
                self._delivery_listeners.remove(listener)

        return _remove

    def _notify_delivery(self, owner_watch_id: str, kind: str) -> None:
        delivery = WatchConfigDelivery(owner_watch_id, kind)
        for listener in list(self._delivery_listeners):
            try:
                listener(delivery)
            except Exception:
                _LOGGER.exception("Watch config delivery listener failed")

    def _notify(self, owner_watch_id: str, kind: str, revision: int) -> None:
        """Tell every listener that ``kind`` of the owner is at ``revision``.

        Called after the change is in memory, so a listener that reads the
        store sees it. A listener that raises is logged and skipped: the save
        it was told about has already been accepted and must stay accepted.
        A kind this build does not know (kept on disk for a newer build) is
        never announced, since no get here could serve it.
        """
        if kind not in WATCH_CONFIG_KINDS:
            return
        change = WatchConfigChange(owner_watch_id, kind, revision)
        for listener in list(self._listeners):
            try:
                listener(change)
            except Exception:
                _LOGGER.exception("Watch config change listener failed")

    # ── reads ──────────────────────────────────────────────────────────

    def _check_available(self, owner_watch_id: str) -> None:
        if self._load_failed or owner_watch_id in self._failed_owners:
            raise WatchConfigUnavailableError(
                "the stored watch config could not be read; restart Home Assistant"
            )

    def owners(self) -> list[str]:
        return sorted(self._records)

    def get(self, owner_watch_id: str, kind: Any) -> WatchConfigRecord | None:
        """The owner's record of that kind, or ``None`` when there is none."""
        kind = validate_kind(kind)
        self._check_available(owner_watch_id)
        return self._records.get(owner_watch_id, {}).get(kind)

    def revisions(self, owner_watch_id: str) -> dict[str, int]:
        """The owner's current revision of every kind it holds a record of.

        Empty when it holds none. Only the kinds this build serves: one kept
        on disk for a newer build could not be fetched by any get here. What
        the live line answers at subscribe time, so a save that landed while
        the phone's socket was down is caught then.
        """
        self._check_available(owner_watch_id)
        return {
            kind: record.revision
            for kind, record in sorted(self._records.get(owner_watch_id, {}).items())
            if kind in WATCH_CONFIG_KINDS
        }

    def short_hashes(self, owner_watch_id: str) -> dict[str, str]:
        """The owner's :func:`short_hash` of every kind :meth:`revisions`
        names, leaving out a record that has no hash."""
        self._check_available(owner_watch_id)
        found: dict[str, str] = {}
        for kind, record in sorted(self._records.get(owner_watch_id, {}).items()):
            if kind not in WATCH_CONFIG_KINDS:
                continue
            digest = short_hash(record.hash)
            if digest is not None:
                found[kind] = digest
        return found

    def documents(self, kind: Any) -> tuple[dict[str, dict[str, Any]], bool]:
        """Every owner's current document of ``kind``, and whether that is
        all of them.

        The second value is False when the index or any owner's file could
        not be read: what those hold is unknown, so a caller deciding that
        nothing uses something (the page photo sweep) must not act on it.
        The documents are the stored objects, not copies; read only.
        """
        kind = validate_kind(kind)
        found = {
            owner: by_kind[kind].document
            for owner, by_kind in self._records.items()
            if kind in by_kind
        }
        return found, not (self._load_failed or self._failed_owners)

    def history_documents(self, kind: Any) -> tuple[dict[str, list[dict[str, Any]]], bool]:
        """Every owner's history documents of ``kind``, oldest first, and
        whether that is all of them.

        The documents :meth:`restore` can bring back, so a caller keeping
        what a restore would need (the page photo sweep) counts them as well
        as :meth:`documents`. An owner whose record has no history is left
        out. The second value is as in :meth:`documents`. The documents are
        the stored objects, not copies; read only.
        """
        kind = validate_kind(kind)
        found = {
            owner: [entry.document for entry in by_kind[kind].history]
            for owner, by_kind in self._records.items()
            if kind in by_kind and by_kind[kind].history
        }
        return found, not (self._load_failed or self._failed_owners)

    def history(self, owner_watch_id: str, kind: Any) -> list[WatchConfigHistoryEntry]:
        """The owner's history of that kind, newest first.

        Empty when there is no record, or a record nothing has replaced yet.
        The current document is not in it: that is the record itself.
        """
        record = self.get(owner_watch_id, kind)
        return list(reversed(record.history)) if record is not None else []

    def history_entry(
        self, owner_watch_id: str, kind: Any, revision: Any
    ) -> WatchConfigHistoryEntry:
        """One history entry by revision, or :class:`WatchConfigNotFoundError`
        when the record has none at that revision (or there is no record)."""
        revision = _validate_revision(revision)
        record = self.get(owner_watch_id, kind)
        entry = record.history_entry(revision) if record is not None else None
        if entry is None:
            raise WatchConfigNotFoundError(
                f"revision {revision} of {kind} is not in the history"
            )
        return entry

    def diagnostics(self) -> dict[str, dict[str, dict[str, Any]]]:
        """Revision, size, times, delivery and the unreadable report per owner
        and kind. Never a document."""
        report: dict[str, dict[str, dict[str, Any]]] = {
            owner: {
                kind: {
                    "revision": record.revision,
                    "size_bytes": record.size_bytes,
                    "updated_at": record.updated_at,
                    "updated_by": record.updated_by,
                    "delivered_revision": record.delivered_revision,
                    "delivered_at": record.delivered_at,
                    "rejected_revision": record.rejected_revision,
                    "rejected_at": record.rejected_at,
                    "rejected_reason": record.rejected_reason,
                    "multiple_pages": record.multiple_pages,
                    "history_count": len(record.history),
                }
                for kind, record in sorted(by_kind.items())
            }
            for owner, by_kind in sorted(self._records.items())
        }
        for owner in sorted(self._failed_owners):
            report[owner] = {"unreadable": {}}
        return report

    # ── writes ─────────────────────────────────────────────────────────

    def put(
        self,
        owner_watch_id: str,
        kind: Any,
        document: Any,
        *,
        document_hash: Any,
        base_revision: Any,
        force: Any = False,
        updated_by: str,
    ) -> WatchConfigRecord:
        """Save one document, compare-and-swap on the revision.

        Accepted when ``base_revision`` equals the stored revision (0 when
        there is no record), or when ``force`` is true. Every accepted save
        replacing a document files that document in the history first, so a
        forced save never loses the copy it overwrote. Everything about the
        request is checked before the revision is, so a malformed save is
        refused as malformed even when it is also stale.

        Only the page level of the shape guard applies here, never the tile
        level (see :func:`_check_pages`), so a device is never refused for a
        fault in its own older tiles.

        For an iPhone owner (phone pages) the kind must be one a phone owns,
        and a ``behavior`` document keeps only the phone's settings
        (:meth:`_for_owner`). When that drops a key, the stored hash is the
        server's (:func:`canonical_hash`) of what was kept rather than the
        client's of what it sent, so the record's hash describes its
        document.
        """
        if not isinstance(owner_watch_id, str) or not owner_watch_id:
            raise WatchConfigValidationError("owner_watch_id is required")
        kind = validate_kind(kind)
        document, trimmed = self._for_owner(owner_watch_id, kind, document)
        size = validate_document(kind, document)
        document_hash = validate_hash(document_hash)
        if trimmed:
            document_hash = canonical_hash(document)
        if not isinstance(force, bool):
            raise WatchConfigValidationError("force must be true or false")
        if not force:
            _validate_base_revision(base_revision)
        self._check_available(owner_watch_id)

        by_kind = self._records.get(owner_watch_id, {})
        existing = by_kind.get(kind)
        stored_revision = existing.revision if existing is not None else 0
        if not force and base_revision != stored_revision:
            raise WatchConfigConflictError(
                f"stored revision is {stored_revision}, save was based on "
                f"{base_revision}",
                stored_revision,
                existing.hash if existing is not None else None,
            )

        before = existing.document if existing is not None else None
        prep = None
        if kind in LIBRARY_KINDS:
            # Into the library first. What is stored is what the library
            # builds for this device; when that is not the document as sent
            # (a stale link key dropped, a page given a new id), the hash is
            # the server's, so it describes what is stored.
            prep = self._prepare_library_save(owner_watch_id, kind, document, existing, panel=False)
            if not prep.kept:
                document_hash = canonical_hash(prep.document)
            document, size = prep.document, prep.size
        if existing is None:
            record = WatchConfigRecord(
                owner_watch_id=owner_watch_id,
                kind=kind,
                revision=self._next_revision(0),
                hash=document_hash,
                updated_at=_now_iso(),
                updated_by=updated_by,
                document=document,
                size_bytes=size,
            )
            new_owner = owner_watch_id not in self._records
            self._records.setdefault(owner_watch_id, {})[kind] = record
            if new_owner:
                self._schedule_index_save()
        else:
            record = existing
            self._replace(record, document, document_hash, size, updated_by)
        # The device that wrote this revision holds it. Without this a phone's
        # own upload would read in the panel as "waiting for the iPhone" until
        # its next get. Not when the library gave one of its pages a new id,
        # now or at an earlier first upload: then the device holds something
        # else and must pull this. A dropped link key alone does not count;
        # the app never reads it.
        if prep is None or not prep.rewritten:
            record.mark_delivered(record.revision)
        self._schedule_owner_save(owner_watch_id)
        # Announced even though the writer already knows: the phone's own
        # upload echoes back to it, and it ignores a revision it has stored.
        self._notify(owner_watch_id, kind, record.revision)
        if prep is not None:
            self._finish_library_save(owner_watch_id, kind, prep, updated_by)
        else:
            self._spread_links(record, before)
        return record

    def _replace(
        self,
        record: WatchConfigRecord,
        document: dict[str, Any],
        document_hash: str,
        size: int,
        updated_by: str,
    ) -> None:
        """Make ``document`` the record's next revision, filing the current one
        into the history first. Every save that replaces a document, device or
        panel, a restore included, goes through here."""
        record.remember(record.current_as_history())
        record.revision = self._next_revision(record.revision)
        record.hash = document_hash
        record.updated_at = _now_iso()
        record.updated_by = updated_by
        record.document = document
        record.size_bytes = size

    def panel_save(
        self,
        owner_watch_id: str,
        kind: Any,
        document: Any,
        *,
        base_revision: Any,
        link_failures: list[str] | None = None,
    ) -> WatchConfigRecord:
        """Save a document edited in the panel, compare-and-swap on the revision.

        Stricter than a device save, on purpose:

        * Only the kinds in ``WATCH_CONFIG_PANEL_KINDS`` (every kind but the
          catalog).
        * The tile level of the page shape guard as well as the page level
          (:func:`validate_document` with ``check_items``). The panel builds
          what it sends, so it can always fix a fault there.
        * A new record only for a paired watch. ``base_revision`` 0 with no
          stored record creates the first revision when the secret store knows the
          owner (``is_paired``), and is refused with
          :class:`WatchConfigNoRecordError` otherwise, so the panel never
          invents a document for an id nothing signs as. A base above 0 with
          no record is ``no_record`` too, and a base of 0 over a stored record
          is a conflict: someone made the first copy since the panel looked.
        * No ``force``. A stale base is a conflict, and the panel reloads.
        * For an iPhone owner (phone pages), only a kind a phone owns, and a
          ``behavior`` document keeps only the phone's settings
          (:meth:`_for_owner`). The panel may create a phone's first record
          of such a kind, as it may a paired watch's.

        The server computes the hash (:func:`canonical_hash`) and writes
        ``updated_by`` as ``panel``. Delivery is left where it was (0 for a
        record the panel created), which is what makes the panel show the
        save as waiting until a device's next get collects it.

        A library kind then reaches every other device that picks what the
        save changed; linked voice settings are handed on to the other copies
        (:meth:`_spread_links`). The save stands even when a record cannot
        take it; each owner left out of step is appended to ``link_failures``
        when the caller passes a list, so the panel can say which device
        missed it.
        """
        if not isinstance(owner_watch_id, str) or not owner_watch_id:
            raise WatchConfigValidationError("owner_watch_id is required")
        kind = self._panel_kind(kind)
        document, _trimmed = self._for_owner(owner_watch_id, kind, document)
        size = validate_document(kind, document, check_items=True)
        base_revision = _validate_base_revision(base_revision)
        self._check_available(owner_watch_id)

        existing = self._records.get(owner_watch_id, {}).get(kind)
        if existing is None:
            if base_revision != 0:
                raise self._no_record(kind)
            if not (
                self._owner_is_paired(owner_watch_id)
                or self._owner_is_iphone(owner_watch_id)
            ):
                raise WatchConfigNoRecordError(
                    f"there is no stored {kind} record and this watch is not "
                    "paired; pair it before starting its config here"
                )
            return self._panel_write(owner_watch_id, kind, document, size, None, link_failures)
        self._check_panel_base(existing, base_revision, "save")
        return self._panel_write(owner_watch_id, kind, document, size, existing, link_failures)

    def _panel_write(
        self,
        owner_watch_id: str,
        kind: str,
        document: dict[str, Any],
        size: int,
        existing: WatchConfigRecord | None,
        link_failures: list[str] | None,
        *,
        restored: bool = False,
    ) -> WatchConfigRecord:
        """A panel save or restore once every check passed: a library kind
        goes into the library first and is stored as the library builds it;
        the voice settings are handed on to their linked copies."""
        before = existing.document if existing is not None else None
        prep = None
        if kind in LIBRARY_KINDS:
            prep = self._prepare_library_save(
                owner_watch_id, kind, document, existing, panel=True, restored=restored
            )
            document, size = prep.document, prep.size
        if existing is None:
            record = self._panel_create(owner_watch_id, kind, document, size)
        else:
            record = self._panel_commit(existing, document, size)
        if prep is not None:
            failed = self._finish_library_save(owner_watch_id, kind, prep, WATCH_CONFIG_PANEL_WRITER)
        else:
            failed = self._spread_links(record, before)
        _note_failures(link_failures, failed)
        return record

    # ── map-back: a saved record into the library ──────────────────────

    def _prepare_library_save(
        self,
        owner_watch_id: str,
        kind: str,
        document: dict[str, Any],
        existing: WatchConfigRecord | None,
        *,
        panel: bool,
        restored: bool = False,
    ) -> _LibrarySave:
        """Map one owner's saved document back into the library
        (:func:`library.map_back`), changing nothing yet.

        * A first record of the kind (``existing`` None: the iPhone's
          one-time upload of a watch's setup, or a panel start) forks: a
          page under an id the library holds with other content is another
          page and gets a new id. Ids an earlier first upload of this owner
          renamed are renamed in this one first.
        * A restore (``restored``) renames those same ids first too, but for
          an old id the owner picks now (it chose that item itself later):
          a revision from before the library gave the owner's copy a new id
          still names the old one, which is now another device's item, and
          must update the owner's own copy, never that item.
        * A ``linkId`` or ``linkIds`` the document still carries (loaded
          from a record written before the library dropped them, or a
          restored revision) means nothing: a menus save or restore maps
          onto the menus the device uses now, like any save.
        * A menus save that adds a Go to page or Status page slot to a menu
          other devices use brings that page (with what it reaches) to them.

        The document stored is what the library builds for the owner with
        the saved one as template; it is checked whole here, and so is any
        other record of the same owner the save changes, so a save is never
        half made."""
        self._check_library()
        before_doc = existing.document if existing is not None else None
        sent: dict[str, Any] = document
        if existing is None or restored:
            renames = held_renames(self._library, owner_watch_id)
            if existing is not None:
                for held_kind, ids in renames.items():
                    picked = self._picked_ids(self._library, owner_watch_id, held_kind)
                    renames[held_kind] = {
                        old: new for old, new in ids.items() if old.upper() not in picked
                    }
            if renames["pages"] or renames["status_pages"]:
                sent = rename_refs(kind, sent, renames["pages"], renames["status_pages"])
        try:
            result = map_back(
                self._library,
                owner_watch_id,
                kind,
                sent,
                fork_conflicts=existing is None,
                owner_name=self._owner_name(owner_watch_id),
            )
            lib = result.library
            if result.renamed:
                lib = hold_renames(lib, owner_watch_id, result.renamed)
            if kind == "menus":
                lib = self._with_slot_pages(lib, owner_watch_id, before_doc, sent)
        except LibraryError as err:
            raise WatchConfigValidationError(err.message) from err
        stored = materialise(lib, owner_watch_id, kind, sent)
        if stored is None:  # map_back always leaves picks of the kind
            stored = sent
        kept = stored == document
        final = document if kept else stored
        # The same guard the save itself met (the tile level for the panel):
        # what the library changes is ids, and stale link keys dropped,
        # never tiles.
        size = validate_document(kind, final, check_items=panel)
        for other in changed_owners(self._library, lib).get(owner_watch_id, []):
            if other == kind:
                continue
            record = self._records.get(owner_watch_id, {}).get(other)
            built = materialise(lib, owner_watch_id, other, record.document if record else None)
            if built is not None:
                validate_document(other, built)
        # Ids the device cannot know were rewritten (a fork of this save, or
        # of an earlier first record of the owner): the device holds
        # something else and must pull what is stored.
        rewritten = bool(result.renamed) or sent != document
        return _LibrarySave(final, kept, size, lib, result.renamed, rewritten)

    def _finish_library_save(
        self, owner_watch_id: str, kind: str, prep: _LibrarySave, updated_by: str
    ) -> list[str]:
        """After the saving record is written: the library takes the save,
        every other record it changes is written by the same writer, and
        renamed pages are followed. Returns the owners whose record could
        not take the change (the save stands; ``link_failures``)."""
        _written, failed = self._apply_library(
            prep.library,
            updated_by,
            first=owner_watch_id,
            skip=frozenset({(owner_watch_id, kind)}),
        )
        self._note_hash(owner_watch_id, kind)
        self._follow_renames(owner_watch_id, prep.renamed, updated_by)
        return failed

    def _copy_name(self, owner_watch_id: str) -> str:
        return f"{self._owner_name(owner_watch_id)}'s menu"

    def _with_slot_pages(
        self,
        lib: dict[str, Any],
        owner_watch_id: str,
        before_doc: dict[str, Any] | None,
        saved_doc: dict[str, Any],
    ) -> dict[str, Any]:
        """The library with the pages a menus save newly opens put on the
        other devices that use the same menu: each page a Go to page slot
        opens that ``before_doc`` did not, with the pages and status pages
        it reaches (:func:`library.reach`), and each status page a new
        Status page slot opens, appended where a device lacks it. A slot the
        menu already had brings nothing, even where the page was taken off:
        that was the device's own choice. A watch whose iPhone may still
        move its own pages here is left alone."""
        picked = lib["picks"].get(owner_watch_id, {}).get("menus", {})
        for unit, menu_id in picked.items():
            others = [
                other
                for other, held in sorted(lib["picks"].items())
                if other != owner_watch_id
                and other not in self._failed_owners
                and held.get("menus", {}).get(unit) == menu_id
            ]
            lib = self._bring_slot_pages(lib, unit, before_doc, saved_doc, others)
        return lib

    def _bring_slot_pages(
        self,
        lib: dict[str, Any],
        unit: str,
        before_doc: dict[str, Any] | None,
        saved_doc: dict[str, Any],
        owners: list[str],
    ) -> dict[str, Any]:
        """``lib`` with the pages the ``unit`` sections of ``saved_doc`` newly
        open (beside ``before_doc``'s) put on each of ``owners`` that lacks
        them, with what they reach (:meth:`_with_slot_pages`)."""
        if not owners:
            return lib
        old_pages, old_status = menu_targets(before_doc, [unit])
        new_pages, new_status = menu_targets(saved_doc, [unit])
        had_pages = {i.upper() for i in old_pages}
        had_status = {i.upper() for i in old_status}
        page_index = {k.upper(): k for k in lib["pages"]}
        status_index = {k.upper(): k for k in lib["status_pages"]}
        pages = [page_index[i.upper()] for i in new_pages if i.upper() not in had_pages and i.upper() in page_index]
        status = [
            status_index[i.upper()]
            for i in new_status
            if i.upper() not in had_status and i.upper() in status_index
        ]
        if not pages and not status:
            return lib
        reach_pages, reach_status = library_reach(lib, pages)
        status_ids = list(dict.fromkeys([*reach_status, *status]))
        for other in owners:
            lib = self._pick_all(lib, other, reach_pages, status_ids, quiet=True)
        return lib

    def _pick_all(
        self,
        lib: dict[str, Any],
        owner_watch_id: str,
        page_ids: list[str],
        status_ids: list[str],
        *,
        quiet: bool = False,
    ) -> dict[str, Any]:
        """``lib`` with each of ``status_ids`` and ``page_ids`` picked by the
        owner where it is not yet (appended, visible). ``quiet`` leaves out
        a kind that would make the first record of a watch awaiting its
        iPhone's move, rather than leaving that to a refusal."""
        for kind, ids in (("status_pages", status_ids), ("pages", page_ids)):
            if not ids:
                continue
            if quiet and self._awaits_move(owner_watch_id, kind):
                continue
            for item_id in ids:
                lib = pick_page(lib, owner_watch_id, kind, item_id, True).library
        return lib

    def _picked_ids(self, lib: dict[str, Any], owner_watch_id: str, kind: str) -> set[str]:
        """The ids (upper case) of the library items the owner picks."""
        return {
            pick["id"].upper()
            for pick in lib["picks"].get(owner_watch_id, {}).get(kind, [])
            if "page" not in pick
        }

    def restore(
        self,
        owner_watch_id: str,
        kind: Any,
        revision: Any,
        *,
        base_revision: Any,
        link_failures: list[str] | None = None,
    ) -> WatchConfigRecord:
        """Make a history entry's document the record's next revision.

        A panel save in every respect but where the document comes from: the
        same kinds, the same ``no_record`` and ``conflict`` refusals on
        ``base_revision``, the same shape guard with the tile level, the
        server's hash, ``updated_by`` ``panel``, the current document filed
        into the history, listeners told, and the other devices whose record
        could not take it appended to ``link_failures``. The entry stays in the
        history too, until five later saves push it out.

        Refused with :class:`WatchConfigNotFoundError` when the record holds
        no entry at ``revision``. The stale base is checked first, so a panel
        whose list is out of date is told to reload rather than that an entry
        it saw is gone. An entry a device wrote may fail the tile level (a
        device save never checks it); that is refused as ``invalid`` and the
        record is left alone.

        For an iPhone owner the kind must be one a phone owns, refused before
        anything else, and the restored ``behavior`` keeps only the phone's
        settings (:meth:`_for_owner`).
        """
        if not isinstance(owner_watch_id, str) or not owner_watch_id:
            raise WatchConfigValidationError("owner_watch_id is required")
        kind = self._panel_kind(kind)
        self._check_owner_kind(owner_watch_id, kind)
        revision = _validate_revision(revision)
        base_revision = _validate_base_revision(base_revision)
        self._check_available(owner_watch_id)

        existing = self._panel_target(owner_watch_id, kind, base_revision, "restore")
        entry = existing.history_entry(revision)
        if entry is None:
            raise WatchConfigNotFoundError(
                f"revision {revision} of {kind} is not in the history"
            )
        # A copy: the entry stays in the history, and the record's document
        # must not be the same object as the one filed there.
        document = copy.deepcopy(entry.document)
        document, _trimmed = self._for_owner(owner_watch_id, kind, document)
        size = validate_document(kind, document, check_items=True)
        return self._panel_write(
            owner_watch_id, kind, document, size, existing, link_failures, restored=True
        )

    @staticmethod
    def _panel_kind(kind: Any) -> str:
        kind = validate_kind(kind)
        if kind not in WATCH_CONFIG_PANEL_KINDS:
            raise WatchConfigValidationError(
                f"the panel cannot save {kind}; it may save "
                f"{', '.join(sorted(WATCH_CONFIG_PANEL_KINDS))}"
            )
        return kind

    def _owner_is_paired(self, owner_watch_id: str) -> bool:
        """Whether the secret store knows the owner as a watch. False when no
        check was handed in (see ``__init__``)."""
        return self._is_paired is not None and bool(self._is_paired(owner_watch_id))

    def _owner_is_iphone(self, owner_watch_id: str) -> bool:
        """Whether the secret store knows the owner as an iPhone. False when
        no check was handed in (see ``__init__``)."""
        return self._is_iphone is not None and bool(self._is_iphone(owner_watch_id))

    def _check_owner_kind(self, owner_watch_id: str, kind: str) -> None:
        """Refuse a kind an iPhone may not own, for an iPhone owner."""
        if kind not in WATCH_CONFIG_PHONE_KINDS and self._owner_is_iphone(owner_watch_id):
            raise WatchConfigPhoneKindError(
                f"an iPhone cannot own {kind}; it may own "
                f"{', '.join(sorted(WATCH_CONFIG_PHONE_KINDS))}"
            )

    def _for_owner(
        self, owner_watch_id: str, kind: str, document: Any
    ) -> tuple[Any, bool]:
        """The document as the owner may hold it, and whether keys were
        dropped.

        A watch's (any owner but an iPhone) is returned as it is. An iPhone's
        must be of a kind a phone owns (:class:`WatchConfigPhoneKindError`
        otherwise), and its ``behavior`` keeps only the phone's settings
        (:func:`phone_behavior_document`). The dropping is silent for the
        save, logged at debug; the record and its hash then say what was
        kept, so the panel sees it on its next read. Anything but an object
        is returned for :func:`validate_document` to refuse.
        """
        self._check_owner_kind(owner_watch_id, kind)
        if kind != "behavior" or not isinstance(document, dict):
            return document, False
        if not self._owner_is_iphone(owner_watch_id):
            return document, False
        kept, dropped = phone_behavior_document(document)
        if not dropped:
            return document, False
        _LOGGER.debug(
            "Kept the iPhone settings of %s's behavior, dropped %s",
            owner_watch_id,
            ", ".join(dropped),
        )
        return kept, True

    @staticmethod
    def _no_record(kind: str) -> WatchConfigNoRecordError:
        return WatchConfigNoRecordError(
            f"there is no stored {kind} record to save over"
        )

    @staticmethod
    def _check_panel_base(
        existing: WatchConfigRecord, base_revision: int, action: str
    ) -> None:
        """The ``conflict`` check of a panel write. ``action`` names the write
        in the message, which always begins ``stored revision is <N>``."""
        if base_revision != existing.revision:
            raise WatchConfigConflictError(
                f"stored revision is {existing.revision}, {action} was based on "
                f"{base_revision}",
                existing.revision,
                existing.hash,
            )

    def _panel_target(
        self, owner_watch_id: str, kind: str, base_revision: int, action: str
    ) -> WatchConfigRecord:
        """The record a restore replaces, after the ``no_record`` and
        ``conflict`` checks. A restore never creates: ``base_revision`` 0 or
        no stored record is ``no_record``."""
        existing = self._records.get(owner_watch_id, {}).get(kind)
        if base_revision == 0 or existing is None:
            raise self._no_record(kind)
        self._check_panel_base(existing, base_revision, action)
        return existing

    def _panel_create(
        self, owner_watch_id: str, kind: str, document: dict[str, Any], size: int
    ) -> WatchConfigRecord:
        """The first revision of a kind the owner holds no record of, written by the
        panel: the server's hash, ``updated_by`` ``panel``, no history, and
        nothing delivered yet. Listeners are told, so the watch's parked poll
        wakes and pulls it."""
        record = WatchConfigRecord(
            owner_watch_id=owner_watch_id,
            kind=kind,
            revision=self._next_revision(0),
            hash=canonical_hash(document),
            updated_at=_now_iso(),
            updated_by=WATCH_CONFIG_PANEL_WRITER,
            document=document,
            size_bytes=size,
        )
        new_owner = owner_watch_id not in self._records
        self._records.setdefault(owner_watch_id, {})[kind] = record
        if new_owner:
            self._schedule_index_save()
        self._schedule_owner_save(owner_watch_id)
        self._notify(owner_watch_id, kind, record.revision)
        return record

    def _panel_commit(
        self, record: WatchConfigRecord, document: dict[str, Any], size: int
    ) -> WatchConfigRecord:
        self._replace(
            record,
            document,
            canonical_hash(document),
            size,
            WATCH_CONFIG_PANEL_WRITER,
        )
        self._schedule_owner_save(record.owner_watch_id)
        self._notify(record.owner_watch_id, record.kind, record.revision)
        return record

    # ── records Home Assistant writes itself ───────────────────────────
    #
    # The library rebuilds every record a change reaches (`_apply_library`),
    # and linked voice settings are kept in step copy by copy: every
    # accepted write of a voice record (a device put, a panel save or create,
    # a restore) is handed on to each other owner holding one of its links
    # (`_spread_links`). Everything runs in the one call that made the
    # write, on the event loop, so no other write lands between them.

    def _write(
        self, owner_watch_id: str, kind: str, document: dict[str, Any], updated_by: str
    ) -> WatchConfigRecord:
        """Write a document Home Assistant made itself (a record the library
        rebuilt, a linked voice copy kept in step or its link dropped, a
        device's rooms copied) as the owner's next revision, or its first. The server's hash, ``updated_by``
        as given, delivery left where it was so the panel shows it waiting,
        listeners told so the device wakes. It never spreads links itself: its
        callers write every owner a change reaches, so a write never sets off
        another one."""
        self._check_owner_kind(owner_watch_id, kind)
        self._check_available(owner_watch_id)
        size = validate_document(kind, document)
        existing = self._records.get(owner_watch_id, {}).get(kind)
        if existing is None:
            record = WatchConfigRecord(
                owner_watch_id=owner_watch_id,
                kind=kind,
                revision=self._next_revision(0),
                hash=canonical_hash(document),
                updated_at=_now_iso(),
                updated_by=updated_by,
                document=document,
                size_bytes=size,
            )
            new_owner = owner_watch_id not in self._records
            self._records.setdefault(owner_watch_id, {})[kind] = record
            if new_owner:
                self._schedule_index_save()
        else:
            record = existing
            self._replace(record, document, canonical_hash(document), size, updated_by)
        self._schedule_owner_save(owner_watch_id)
        self._notify(owner_watch_id, kind, record.revision)
        return record

    def _spread_links(self, record: WatchConfigRecord, before: Any) -> list[str]:
        """Hand a write of a kind still linked copy by copy (the voice
        settings, :data:`_COPY_LINKED_KINDS`) on to the other owners.

        Each other owner whose document of the kind holds one of the saved
        document's links gets its linked units replaced by the saved ones
        (:func:`page_links.fan_out_units`). And a link the write took away
        (``before`` held it, the saved document does not) that is now left
        on exactly one other owner is dropped there. Each owner that changes
        gets one new revision, written by whoever made the save. An owner
        whose copy cannot take the change (over its size cap) is logged and
        left as it was; the save itself stands. Returns those owners, sorted,
        for the panel to name (empty when every copy took it).
        """
        ops = link_ops(record.kind) if record.kind in _COPY_LINKED_KINDS else None
        if ops is None:
            return []
        owner = record.owner_watch_id
        saved = ops.ids(record.document)
        lost = ops.ids(before) - saved
        if not saved and not lost:
            return []
        failed: list[str] = []
        others, held, last_copies = self._link_holders(record.kind, ops, owner, lost)
        for other, other_record in sorted(others.items()):
            document = (
                ops.fan_out(record.document, other_record.document)
                if held[other] & saved
                else None
            )
            for link in sorted(held[other] & last_copies):
                dropped = ops.drop(
                    document if document is not None else other_record.document, link
                )
                if dropped is not None:
                    document = dropped
            if document is None:
                continue
            try:
                self._write(other, record.kind, document, record.updated_by)
            except WatchConfigStoreError as err:
                failed.append(other)
                _LOGGER.warning(
                    "Could not keep the linked %s of %s in step with %s: %s",
                    record.kind,
                    other,
                    owner,
                    err.message,
                )
        return failed

    def _link_holders(
        self, kind: str, ops: LinkOps, owner: str | None, lost: set[str]
    ) -> tuple[dict[str, WatchConfigRecord], dict[str, set[str]], set[str]]:
        """Every owner but ``owner`` (and any unreadable one) holding a record
        of ``kind``, the links each holds, and which of the ``lost`` links are
        now left on exactly one of them: its last copy, no longer linked.
        ``owner`` None counts every owner."""
        others = {
            other: by_kind[kind]
            for other, by_kind in self._records.items()
            if other != owner and other not in self._failed_owners and kind in by_kind
        }
        held = {other: ops.ids(other_record.document) for other, other_record in others.items()}
        last_copies = {
            link
            for link in lost
            if sum(1 for links in held.values() if link in links) == 1
        }
        return others, held, last_copies

    def _drop_last_copies(
        self, owner: str | None, lost_by_kind: dict[str, set[str]], updated_by: str
    ) -> None:
        """After ``owner``'s records went (or, for ``owner`` None, after a
        link replaced some of a kind's links), drop each lost link that is now
        left on exactly one owner, as one new revision there (the same
        last-copy rule as :meth:`_spread_links`, with nothing to fan out). An
        owner whose copy cannot take the change is logged and left."""
        for kind, lost in lost_by_kind.items():
            ops = link_ops(kind)
            if not lost or ops is None:
                continue
            others, held, last_copies = self._link_holders(kind, ops, owner, lost)
            for other, other_record in sorted(others.items()):
                document = None
                for link in sorted(held[other] & last_copies):
                    dropped = ops.drop(
                        document if document is not None else other_record.document, link
                    )
                    if dropped is not None:
                        document = dropped
                if document is None:
                    continue
                try:
                    self._write(other, kind, document, updated_by)
                except WatchConfigStoreError as err:
                    _LOGGER.warning(
                        "Could not drop the last link of %s on %s after %s: %s",
                        kind,
                        other,
                        f"{owner} went" if owner is not None else "a link replaced it",
                        err.message,
                    )

    def _check_link_owner(self, owner_watch_id: Any) -> str:
        """A link's source or target: a paired watch or iPhone."""
        if not isinstance(owner_watch_id, str) or not (
            self._owner_is_paired(owner_watch_id) or self._owner_is_iphone(owner_watch_id)
        ):
            raise WatchConfigLinkError(
                "unknown_device", f"{owner_watch_id} is not a paired device"
            )
        self._check_available(owner_watch_id)
        return owner_watch_id

    def _awaits_move(self, owner_watch_id: str, kind: str) -> bool:
        """Whether ``owner_watch_id`` holds no record of ``kind`` while its
        iPhone may still move its own one here. The panel's rule
        (``noRecordStart`` is ``wait``): the move sends a kind only while Home
        Assistant holds none, so a record made first leaves the watch's own
        setup behind for good."""
        return (
            self._may_await_move is not None
            and self._document(owner_watch_id, kind) is None
            and bool(self._may_await_move(owner_watch_id))
        )

    def _check_not_awaiting_move(self, owner_watch_id: str, kind: str) -> None:
        """Refuse a write that would make a watch's first record of ``kind``
        while its iPhone may still move that kind here (:meth:`_awaits_move`)."""
        if self._awaits_move(owner_watch_id, kind):
            raise WatchConfigLinkError(
                "awaiting_move",
                "This watch is waiting for its iPhone to move its "
                f"{kind.replace('_', ' ')} here. Open Wrist Assistant on that "
                "iPhone first.",
            )

    def _document(self, owner_watch_id: str, kind: str) -> dict[str, Any] | None:
        record = self._records.get(owner_watch_id, {}).get(kind)
        return record.document if record is not None else None

    def _check_targets(self, source_owner: str, targets: Any, what: str) -> list[str]:
        """A link's targets: a list of paired devices, none of them the
        source, each once."""
        if not isinstance(targets, list) or not all(isinstance(t, str) for t in targets):
            raise WatchConfigValidationError("targets must be a list of device ids")
        for target in targets:
            if target == source_owner:
                raise WatchConfigValidationError(what)
            self._check_link_owner(target)
        return list(dict.fromkeys(targets))

    def _commit_writes(
        self, writes: list[tuple[str, str, dict[str, Any]]], updated_by: str
    ) -> None:
        """Check every write, then make them all, so a link is never half
        written for a document over its cap."""
        for owner, kind, document in writes:
            self._check_owner_kind(owner, kind)
            validate_document(kind, document)
        for owner, kind, document in writes:
            self._write(owner, kind, document, updated_by)

    def _link_onto(
        self,
        source_owner: str,
        targets: list[str],
        page_ids: list[str],
        status_ids: list[str],
        lib: dict[str, Any] | None = None,
    ) -> tuple[dict[str, Any], dict[str, dict[str, list[str]]]]:
        """The library with ``page_ids`` and ``status_ids`` picked by each
        target where it does not pick them yet, appended with the source's
        ``isHidden`` (:meth:`link_device`), and the reply's
        ``targets``: per target the ids it did not pick before.
        ``adopted_status_pages`` is always empty: one id is one item now, so
        there is never a target's own copy to adopt."""
        lib = self._library if lib is None else lib
        reply: dict[str, dict[str, list[str]]] = {}
        try:
            for target in targets:
                had_pages = self._picked_ids(lib, target, "pages")
                had_status = self._picked_ids(lib, target, "status_pages")
                lib = self._pick_all(lib, target, page_ids, status_ids)
                added = {
                    "pages": [i for i in page_ids if i.upper() not in had_pages],
                    "status_pages": [i for i in status_ids if i.upper() not in had_status],
                }
                for kind, ids in added.items():
                    self._copy_hidden(lib, source_owner, target, kind, ids)
                reply[target] = {**added, "adopted_status_pages": []}
        except LibraryError as err:
            raise WatchConfigLinkError(err.code, err.message) from err
        return lib, reply

    @staticmethod
    def _copy_hidden(
        lib: dict[str, Any], source_owner: str, target: str, kind: str, ids: list[str]
    ) -> None:
        """Give ``target``'s picks of ``ids`` (in ``lib``, a private copy,
        changed in place) the source's ``isHidden`` where the source's pick
        has one."""
        wanted = {i.upper() for i in ids}
        source = {
            pick["id"].upper(): pick
            for pick in lib["picks"].get(source_owner, {}).get(kind, [])
            if "page" not in pick
        }
        for pick in lib["picks"].get(target, {}).get(kind, []):
            key = pick["id"].upper()
            if key in wanted and "isHidden" in source.get(key, {}):
                pick["isHidden"] = copy.deepcopy(source[key]["isHidden"])

    def link_device(
        self, source_owner: Any, target_owner: Any, *, updated_by: str
    ) -> dict[str, Any]:
        """Give one device every page of another (the iPhone's signed
        ``phone_pages_link_watch``, "Use pages from <watch>"): the target
        picks what the source picks.

        Every page the source picks but its system pages, and every status
        page, appended to the target's own in the source's order with the
        source's ``isHidden``, where the target does not pick it yet. Then,
        for a target with no record of the kind, the source's menus (the
        target uses the same Anywhere and Entity quick menu, so an edit of
        either reaches both) and its rooms, copied once: the ids are the
        same, so the rooms open the same pages. A source whose rooms live in
        its ``behavior`` (a watch's main house) gives the room keys from
        there. Neither is put on a watch whose iPhone may still move that
        kind here (:meth:`_awaits_move`).

        Refused, before anything is written: ``unknown_device`` (a source or
        target that is not a paired device), ``invalid``, and
        ``awaiting_move`` for a target watch with no record of a kind this
        writes while its iPhone may still move its own here.

        Returns ``{"targets": {target: {"pages": [ids added],
        "status_pages": [ids added], "adopted_status_pages": []}},
        "page_ids": [every page of the source], "copied": [kinds given
        once]}``.
        """
        self._check_library()
        source_owner = self._check_link_owner(source_owner)
        target_owner = self._check_link_owner(target_owner)
        if target_owner == source_owner:
            raise WatchConfigValidationError("a device cannot be given its own pages")
        page_ids = listed_page_ids(self._document(source_owner, "pages"))
        status_ids = ids_in(self._document(source_owner, "status_pages"), "statusPages")
        lib, reply_targets = self._link_onto(source_owner, [target_owner], page_ids, status_ids)
        copied: list[str] = []
        seeds: dict[tuple[str, str], dict[str, Any]] = {}
        menus_doc = self._document(source_owner, "menus")
        if (
            menus_doc is not None
            and lib["picks"].get(source_owner, {}).get("menus")
            and self._document(target_owner, "menus") is None
            and not self._awaits_move(target_owner, "menus")
        ):
            try:
                lib = copy_picks(lib, source_owner, target_owner, ["menus"]).library
            except LibraryError as err:
                raise WatchConfigLinkError(err.code, err.message) from err
            seeds[(target_owner, "menus")] = without_unit_links(menus_doc)
            copied.append("menus")
        rooms = None
        if self._document(target_owner, "rooms") is None and not self._awaits_move(
            target_owner, "rooms"
        ):
            rooms = self._document(source_owner, "rooms")
            if rooms is None:
                rooms = rooms_from_behavior(self._document(source_owner, "behavior"))
            if rooms is not None:
                rooms = without_unit_links(rooms)
                self._check_owner_kind(target_owner, "rooms")
                validate_document("rooms", rooms)
        self._apply_library(
            lib, updated_by, first=source_owner, strict=True, refuse_awaiting=True, seeds=seeds
        )
        if rooms is not None:
            self._write(target_owner, "rooms", rooms, updated_by)
            copied.append("rooms")
        _LOGGER.info(
            "Put %d page(s) and %d status page(s) of %s on %s, gave %s",
            len(page_ids),
            len(status_ids),
            source_owner,
            target_owner,
            ", ".join(copied) or "nothing else",
        )
        return {"targets": reply_targets, "page_ids": page_ids, "copied": copied}

    def link_places(self) -> dict[str, dict[str, Any]]:
        """For each voice link id, its unit and the owners that hold it:
        ``{"voice": {linkId: {"unit": "phrases", "owners": [owner, ...]}}}``.
        Only the voice settings link; who has a page, status page or menu
        is ``library_summary``. An owner whose file could not be read is
        left out."""
        places: dict[str, dict[str, Any]] = {}
        for kind in _COPY_LINKED_KINDS:
            documents = {
                owner: by_kind[kind].document
                for owner, by_kind in self._records.items()
                if kind in by_kind and owner not in self._failed_owners
            }
            places[kind] = unit_link_places(documents, kind)
        return places

    def link_units(
        self,
        kind: Any,
        source_owner: Any,
        units: Any,
        targets: Any,
        *,
        replace: Any = False,
        updated_by: str = WATCH_CONFIG_PANEL_WRITER,
    ) -> dict[str, Any]:
        """Put units of one watch's voice settings on other watches
        (``watch_pages/link`` with kind ``voice``, :data:`LINK_UNITS`).

        The voice settings (unit ``phrases``) link copy by copy: each target
        is given the source's phrase library and defaults under one link id,
        kept in step on every save of any copy (:meth:`_spread_links`); a
        target holding no voice yet is given the source's document less the
        watch's own speech settings (:func:`page_links.apply_unit_link`).
        Pages, status pages and menus never link: each lives once in the
        library and a device picks it (:meth:`library_pick`).

        Refused, before anything is written: ``invalid`` for any kind but
        ``voice`` (a library kind among them) or a unit it does not name,
        ``unknown_device``, ``not_for_iphone`` for a target that may not own
        the kind (``WATCH_CONFIG_PHONE_KINDS``), ``not_found`` for a source
        with no record of the kind, ``unit_taken`` for a target that holds
        its own unit (another link, or other contents, never a blank unit
        such as a new watch's voice settings) unless ``replace`` is true,
        and ``awaiting_move``. A voice link that ``replace`` took off a
        target and is then left on one owner only is dropped there.

        Returns ``{"targets": {target: {"pages": [], "status_pages": [],
        "adopted_status_pages": [], "units": [units written]}},
        "link_ids": {unit: linkId}}``.
        """
        if kind in LIBRARY_KINDS:
            raise WatchConfigValidationError(
                f"{kind.replace('_', ' ')} no longer link: a device picks them from the library "
                "(library/pick); only voice links"
            )
        if kind not in LINK_UNITS:
            raise WatchConfigValidationError(
                f"kind must be one of {', '.join(sorted(LINK_UNITS))}"
            )
        if (
            not isinstance(units, list)
            or not units
            or not all(isinstance(unit, str) and unit in LINK_UNITS[kind] for unit in units)
        ):
            raise WatchConfigValidationError(
                f"units must be a non-empty list of {', '.join(LINK_UNITS[kind])}"
            )
        if not isinstance(replace, bool):
            raise WatchConfigValidationError("replace must be true or false")
        units = list(dict.fromkeys(units))
        source_owner = self._check_link_owner(source_owner)
        target_list = self._check_targets(
            source_owner, targets, f"a device's {kind} cannot be linked to itself"
        )
        for target in target_list:
            self._check_owner_kind(target, kind)
        source_doc = self._document(source_owner, kind)
        if source_doc is None:
            raise WatchConfigLinkError("not_found", f"{source_owner} has no {kind}")
        reply_targets: dict[str, dict[str, list[str]]] = {
            target: {"pages": [], "status_pages": [], "adopted_status_pages": []}
            for target in target_list
        }
        source = source_doc
        plans: list[tuple[str, dict[str, Any] | None, dict[str, Any], list[str]]] = []
        replaced: set[str] = set()
        link_ids_out: dict[str, str] = {}
        try:
            for target in target_list:
                before = self._document(target, kind)
                document = before
                written: list[str] = []
                held = unit_links(before, kind)
                for unit in units:
                    source, new, link = apply_unit_link(source, document, kind, unit, replace)
                    link_ids_out[unit] = link
                    if held.get(unit) not in (None, link):
                        replaced.add(held[unit])
                    if new != document:
                        written.append(unit)
                    document = new
                plans.append((target, before, document, written))
        except PageLinkError as err:
            raise WatchConfigLinkError(err.code, err.message) from err
        writes: list[tuple[str, str, dict[str, Any]]] = []
        if source != source_doc:
            writes.append((source_owner, kind, source))
        for target, before, document, written in plans:
            reply_targets[target]["units"] = written
            if document != before:
                if before is None:
                    self._check_not_awaiting_move(target, kind)
                writes.append((target, kind, document))
        self._commit_writes(writes, updated_by)
        self._drop_last_copies(None, {kind: replaced}, updated_by)
        if writes:
            _LOGGER.info(
                "Linked %s (%s) of %s to %s",
                kind,
                ", ".join(units),
                source_owner,
                ", ".join(reply_targets),
            )
        return {"targets": reply_targets, "link_ids": link_ids_out}

    # ── the library's own ops (library/* in watch_config_ws.py) ────────

    def library_summary(self) -> dict[str, Any]:
        """Every library item with the owners that pick it and its revision,
        and each owner's picks: ``{"pages": {id: {"item": page, "owners":
        [...], "revision": n}}, "status_pages": {...}, "menus": {id: {"name",
        "kind", "sections", "owners", "revision"}}, "picks": {owner:
        picks}}``. An item no one picks lists no owners. An owner whose file
        could not be read is left out. The objects are copies."""

        def readable(owners: list[str]) -> list[str]:
            return [owner for owner in owners if owner not in self._failed_owners]

        lib = self._library
        out: dict[str, Any] = {}
        for kind in ("pages", "status_pages"):
            out[kind] = {
                item_id: {
                    "item": copy.deepcopy(lib[kind][item_id]),
                    "owners": readable(owners),
                    "revision": item_revision(lib, kind, item_id),
                }
                for item_id, owners in pickers(lib, kind).items()
            }
        out["menus"] = {
            menu_id: {
                "name": lib["menus"][menu_id]["name"],
                "kind": lib["menus"][menu_id]["kind"],
                "sections": copy.deepcopy(lib["menus"][menu_id]["sections"]),
                "owners": readable(owners),
                "revision": item_revision(lib, "menus", menu_id),
            }
            for menu_id, owners in pickers(lib, "menus").items()
        }
        out["picks"] = {
            owner: copy.deepcopy(held)
            for owner, held in sorted(lib["picks"].items())
            if owner not in self._failed_owners
        }
        return out

    def library_item_owners(self, kind: Any, item_id: Any) -> list[str] | None:
        """The owners that pick one library item, or None when the library
        holds no such item or kind. The id is resolved as the item ops
        resolve it (:func:`stored_item_id`), so a permission check and the op
        it guards always name the same item."""
        if kind not in LIBRARY_KINDS or not isinstance(item_id, str):
            return None
        try:
            stored = stored_item_id(self._library, kind, item_id)
        except LibraryError:
            return None
        return pickers(self._library, kind)[stored]

    def _library_item_id(self, kind: Any, item_id: Any) -> tuple[str, str]:
        """``(kind, stored id)`` of one library item, for the item ops.
        Refused ``invalid`` for another kind or no id, ``not_found`` for an
        item the library does not hold."""
        if kind not in LIBRARY_KINDS:
            raise WatchConfigValidationError(
                f"kind must be one of {', '.join(sorted(LIBRARY_KINDS))}"
            )
        if not isinstance(item_id, str) or not item_id:
            raise WatchConfigValidationError("item_id is required")
        try:
            return kind, stored_item_id(self._library, kind, item_id)
        except LibraryError as err:
            raise WatchConfigLinkError(err.code, err.message) from err

    def library_item(self, kind: Any, item_id: Any) -> dict[str, Any]:
        """One library item as a whole document of its kind
        (``library/item``), for the panel's editors to edit it in the
        library itself: ``{"document", "revision"}``, plus ``"name"`` for a
        menu.

        The document has the shape a device's record of the kind has, so the
        editors read it as they read a record: pages ``{"schemaVersion": 1,
        "pages": [the page]}``, status pages ``{"schemaVersion": 1,
        "statusPages": [the page]}`` (no ``isHidden``: that is a device's
        pick), and a menu a menus document whose own unit's sections are the
        menu's and whose other unit's are blank objects
        (:func:`_menus_probe`). ``revision`` is the item's own
        (``item_revisions``), never a record's.

        Refused ``invalid`` for another kind and ``not_found`` for an item
        the library does not hold."""
        self._check_library()
        kind, stored = self._library_item_id(kind, item_id)
        revision = item_revision(self._library, kind, stored)
        if kind == "menus":
            menu = self._library["menus"][stored]
            return {
                "document": _menus_probe(copy.deepcopy(menu["sections"])),
                "revision": revision,
                "name": menu["name"],
            }
        page = copy.deepcopy(self._library[kind][stored])
        return {
            "document": {"schemaVersion": 1, _KIND_LIST_KEYS[kind]: [page]},
            "revision": revision,
        }

    def library_save_item(
        self,
        kind: Any,
        item_id: Any,
        base_revision: Any,
        document: Any,
        *,
        updated_by: str = WATCH_CONFIG_PANEL_WRITER,
    ) -> dict[str, Any]:
        """Save one library item edited in the library itself
        (``library/item/save``), compare and swap on the item's revision.

        ``base_revision`` is compared first: one other than the item's
        revision is a ``conflict`` whatever the document holds, so a stale
        editor always reads the item again before it hears anything else. (A
        record save checks the shape first, to match a device's save; no
        device saves a library item, so there is nothing here to match.)

        ``document`` is a whole document of the kind, as :meth:`library_item`
        gives it. It meets the guard a panel save of the kind meets
        (:func:`validate_document` with ``check_items``). Then the item is
        taken out of it: for pages and status pages the one page, whose id
        must be ``item_id`` (refused ``invalid`` for no page, another id
        beside it or a system page); for a menu its own unit's sections, the
        other unit's being ignored. ``base_revision`` other than the item's
        revision is a ``conflict``, its message beginning ``stored revision
        is <N>`` as a record save's does; the panel reads the item again.

        Content equal to the item's writes nothing and answers the current
        revision. Otherwise the item takes it, its revision goes up by 1 and
        every device that picks it gets its record built again by the path a
        record save's map-back takes (:meth:`_apply_library`): each record
        that changes gets a new revision, a history entry and a wake-up for
        its listeners, and every one is checked first, so a cap refuses the
        save before anything is written. A menu save that adds a Go to page
        or Status page slot brings that page, with what it reaches, to every
        device using the menu that lacks it, as a record save brings it to
        the other devices. An item no device picks writes no record.

        Refused ``invalid``, ``not_found`` or ``conflict``. Returns
        ``{"revision": <the item's revision>}``."""
        self._check_library()
        kind, stored = self._library_item_id(kind, item_id)
        base_revision = _validate_base_revision(base_revision)
        current = item_revision(self._library, kind, stored)
        if base_revision != current:
            raise WatchConfigConflictError(
                f"stored revision is {current}, save was based on {base_revision}",
                current,
                None,
            )
        validate_document(kind, document, check_items=True)
        if kind == "menus":
            unit = self._library["menus"][stored]["kind"]
            before = self._library["menus"][stored]["sections"]
            content: dict[str, Any] = {key: document[key] for key in MENU_UNITS[unit]}
        else:
            pages = document[_KIND_LIST_KEYS[kind]]
            if len(pages) != 1:
                raise WatchConfigValidationError(
                    f"the document must hold exactly one page, {stored}"
                )
            content = pages[0]
        try:
            change = replace_item(self._library, kind, stored, content)
        except LibraryError as err:
            raise WatchConfigValidationError(err.message) from err
        if item_revision(change.library, kind, stored) == current:
            return {"revision": current}
        lib = change.library
        if kind == "menus":
            users = [
                owner
                for owner in pickers(lib, "menus")[stored]
                if owner not in self._failed_owners
            ]
            lib = self._bring_slot_pages(lib, unit, before, content, users)
        self._apply_library(lib, updated_by, strict=True)
        _LOGGER.info("Saved %s %s in the library", kind, stored)
        return {"revision": item_revision(self._library, kind, stored)}

    def library_pick(
        self,
        owner_watch_id: Any,
        kind: Any,
        item_id: Any,
        *,
        on: Any = None,
        unit: Any = None,
        start: Any = None,
        updated_by: str = WATCH_CONFIG_PANEL_WRITER,
        may_read: Callable[[str], bool] | None = None,
    ) -> dict[str, Any]:
        """Tick or untick a library item on one device (``library/pick``).

        ``may_read`` limits the devices a first menus record may be started
        from to those the caller may manage (every device when None).

        Pages and status pages: ``on`` true appends the item to the device's
        order, visible; putting a page on also puts on the status pages its
        tiles open (:func:`library.reach`). ``on`` false takes it off; the
        item stays in the library. Menus: ``unit`` (``anywhere`` or
        ``entity``) and the menu ``item_id`` the device uses for it from
        now on; a device with no menus record yet starts from a device that
        uses that menu, keeping a copy of that device's other menu as its
        own, or, when no device with menus uses it (a menu just made with
        New menu), from ``start``, a whole menus document (the panel sends
        the app's defaults), whose other menu becomes a new library menu of
        the device's own (:meth:`_first_menus`). ``start`` is read only
        then. Only the device's own records are written (its pages and the
        status pages they bring along, or its menus); no other device's
        record changes.

        Refused, before anything is written: ``invalid`` (``start`` too, when
        it is read and is not a valid menus document), ``unknown_device``,
        ``not_for_iphone``, ``not_found`` for an item the library does not
        hold, ``no_record`` for a menu no device with menus uses picked onto
        a device with none and no ``start``, and ``awaiting_move`` for a
        watch whose iPhone may still move its own setup here.

        Returns ``{"revisions": {owner: {kind: revision}}}`` for the records
        written."""
        self._check_library()
        owner_watch_id = self._check_link_owner(owner_watch_id)
        if kind not in LIBRARY_KINDS:
            raise WatchConfigValidationError(
                f"kind must be one of {', '.join(sorted(LIBRARY_KINDS))}"
            )
        self._check_owner_kind(owner_watch_id, kind)
        if not isinstance(item_id, str) or not item_id:
            raise WatchConfigValidationError("id is required")
        seeds: dict[tuple[str, str], dict[str, Any]] = {}
        try:
            if kind == "menus":
                if unit not in MENU_UNITS:
                    raise WatchConfigValidationError(
                        f"unit must be one of {', '.join(MENU_UNITS)}"
                    )
                change = pick_menu(self._library, owner_watch_id, unit, item_id)
                if self._document(owner_watch_id, "menus") is None:
                    lib, seed = self._first_menus(
                        change.library, owner_watch_id, unit, item_id, may_read, start
                    )
                    change = change._replace(library=lib)
                    seeds[(owner_watch_id, "menus")] = seed
            else:
                if not isinstance(on, bool):
                    raise WatchConfigValidationError("on must be true or false")
                status = library_reach(self._library, [item_id])[1] if kind == "pages" and on else []
                change = pick_page(self._library, owner_watch_id, kind, item_id, on, status)
        except LibraryError as err:
            raise WatchConfigLinkError(err.code, err.message) from err
        written, _failed = self._apply_library(
            change.library,
            updated_by,
            first=owner_watch_id,
            strict=True,
            refuse_awaiting=True,
            seeds=seeds,
        )
        return {"revisions": self._revisions_of(written)}

    def _first_menus(
        self,
        lib: dict[str, Any],
        owner_watch_id: str,
        unit: str,
        menu_id: str,
        may_read: Callable[[str], bool] | None = None,
        start: Any = None,
    ) -> tuple[dict[str, Any], dict[str, Any]]:
        """For a menu picked onto a device with no menus record yet: the
        device starts from the record of a readable device that uses that menu
        (the first by id that ``may_read`` allows), with that device's menu
        of the other unit as the device's own copy, so only the picked menu
        is shared. ``(library, seed document)``.

        With no such device (nobody with menus uses the menu yet), the device
        starts from ``start``, a whole menus document checked by the same
        guard every menus document meets: its other unit becomes a new
        library menu the device uses, named as a first save names one.
        Refused ``no_record`` when there is no ``start`` either, since a
        menus record needs both units."""
        source = next(
            (
                other
                for other in pickers(lib, "menus").get(menu_id, [])
                if other != owner_watch_id
                and other not in self._failed_owners
                and (may_read is None or may_read(other))
                and self._document(other, "menus") is not None
            ),
            None,
        )
        if source is None:
            if start is None:
                raise WatchConfigNoRecordError(
                    "the device has no menus yet and no device uses this menu to "
                    "start them from; give it menus first"
                )
            return self._menus_from_start(lib, owner_watch_id, unit, start)
        for other, other_id in lib["picks"].get(source, {}).get("menus", {}).items():
            if other == unit:
                continue
            lib = pick_menu(lib, owner_watch_id, other, other_id).library
            lib = copy_menu(lib, owner_watch_id, other, self._copy_name(owner_watch_id)).library
        return lib, without_unit_links(self._document(source, "menus"))

    def _menus_from_start(
        self, lib: dict[str, Any], owner_watch_id: str, unit: str, start: Any
    ) -> tuple[dict[str, Any], dict[str, Any]]:
        """:meth:`_first_menus` with no device to start from: the menus
        document ``start`` is the seed, and each unit but ``unit`` (picked
        already) becomes a new library menu the device uses."""
        if not isinstance(start, dict):
            raise WatchConfigValidationError("start must be a menus document")
        seed = copy.deepcopy(start)
        validate_document("menus", seed)
        for other, keys in MENU_UNITS.items():
            if other == unit:
                continue
            name = new_menu_name(lib, other, self._owner_name(owner_watch_id))
            made = create_menu(lib, other, name, {key: seed[key] for key in keys})
            lib = pick_menu(made.library, owner_watch_id, other, made.id).library
        return lib, seed

    def library_copy_menu(
        self,
        owner_watch_id: Any,
        unit: Any,
        name: Any,
        *,
        updated_by: str = WATCH_CONFIG_PANEL_WRITER,
    ) -> dict[str, Any]:
        """A new menu made from the device's current one for ``unit``, used
        by that device in its place ("Make a copy for this watch",
        ``library/menus/copy``). Refused ``invalid`` (an empty name, an
        unknown unit), ``unknown_device`` and ``not_found`` (the device uses
        no menu for the unit). Returns ``{"id": <new menu id>, "revisions":
        {owner: {kind: revision}}}``."""
        self._check_library()
        owner_watch_id = self._check_link_owner(owner_watch_id)
        try:
            copied = copy_menu(self._library, owner_watch_id, unit, name)
        except LibraryError as err:
            raise WatchConfigLinkError(err.code, err.message) from err
        written, _failed = self._apply_library(
            copied.library, updated_by, first=owner_watch_id, strict=True
        )
        return {"id": copied.id, "revisions": self._revisions_of(written)}

    def library_create_item(self, kind: Any, document: Any) -> dict[str, Any]:
        """A new page or status page in the library that no device has yet
        (the Pages and Status pages tabs' New page, ``library/item/create``);
        the panel then opens it in the library, and a tick puts it on a
        device.

        ``document`` is a whole document of the kind holding the one new
        page, as ``library/item`` would give it back, and meets the guard a
        panel save of the kind meets (:func:`validate_document` with
        ``check_items``). No record is written, so no device changes.

        Refused ``invalid`` for a menu, a document of another shape or with
        other than one page, a system page, or an id the library already
        holds. Returns ``{"id": <the page's id>, "revision": 1}``."""
        self._check_library()
        if kind not in ("pages", "status_pages"):
            raise WatchConfigValidationError("kind must be pages or status_pages")
        validate_document(kind, document, check_items=True)
        pages = document[_KIND_LIST_KEYS[kind]]
        if len(pages) != 1:
            raise WatchConfigValidationError("the document must hold exactly one page")
        try:
            created = create_item(self._library, kind, pages[0])
        except LibraryError as err:
            raise WatchConfigValidationError(err.message) from err
        self._set_library(created.library)
        _LOGGER.info("Made %s %s in the library", kind, created.id)
        return {"id": created.id, "revision": item_revision(self._library, kind, created.id)}

    def library_create_menu(self, unit: Any, name: Any, sections: Any) -> dict[str, Any]:
        """A new library menu that no device uses yet (the Menus tab's New
        menu, ``library/menus/create``); a tick then puts it on a device.

        ``sections`` holds exactly the unit's keys as a menus document holds
        them (``quickAction`` and ``pageSwitcher`` for ``anywhere``,
        ``entityRadial`` for ``entity``), checked by the same guard every
        menus document meets (:func:`_check_menus`): each an object, every
        slot list a list of slots with unique ids. No record is written, so
        no device changes and ``revisions`` is empty.

        Refused ``invalid`` for an unknown unit, an empty name or sections of
        another shape. Returns ``{"id": <new menu id>, "revisions": {}}``."""
        self._check_library()
        if not isinstance(unit, str) or unit not in MENU_UNITS:
            raise WatchConfigValidationError(f"unit must be one of {', '.join(MENU_UNITS)}")
        if not isinstance(sections, dict):
            raise WatchConfigValidationError("sections must be an object")
        try:
            created = create_menu(self._library, unit, name, sections)
        except LibraryError as err:
            raise WatchConfigValidationError(err.message) from err
        # The menus guard needs every section; the other unit's are blanks
        # it does not look inside.
        validate_document("menus", _menus_probe(sections))
        self._set_library(created.library)
        _LOGGER.info("Made the %s menu %s in the library", unit, created.id)
        return {"id": created.id, "revisions": {}}

    def library_rename_menu(self, menu_id: Any, name: Any) -> None:
        """Rename a library menu (``library/menus/rename``). No record holds a
        menu's name, so no device changes. Refused ``not_found`` or
        ``invalid`` (an empty name)."""
        self._check_library()
        if not isinstance(menu_id, str):
            raise WatchConfigValidationError("id is required")
        try:
            lib = rename_menu(self._library, menu_id, name)
        except LibraryError as err:
            raise WatchConfigLinkError(err.code, err.message) from err
        self._set_library(lib)

    def library_delete(
        self, kind: Any, item_id: Any, *, updated_by: str = WATCH_CONFIG_PANEL_WRITER
    ) -> dict[str, Any]:
        """Delete an item from the library (``library/delete``).

        A page or status page goes from every device that picks it, and the
        menu slots and tiles that opened it go too, as the panel's delete
        everywhere clears them (:func:`library.delete_item` with
        ``clear_tiles``); every record that changes is written. A menu is
        refused ``in_use`` while any device uses it. ``not_found`` for an
        item the library does not hold, ``invalid`` for another kind.

        Returns ``{"revisions": {owner: {kind: revision}}, "link_failures":
        [owners whose record could not take it]}``."""
        self._check_library()
        if kind not in LIBRARY_KINDS:
            raise WatchConfigValidationError(
                f"kind must be one of {', '.join(sorted(LIBRARY_KINDS))}"
            )
        if not isinstance(item_id, str) or not item_id:
            raise WatchConfigValidationError("id is required")
        try:
            change = delete_item(self._library, kind, item_id, clear_tiles=True)
        except LibraryError as err:
            raise WatchConfigLinkError(err.code, err.message) from err
        written, failed = self._apply_library(change.library, updated_by)
        _LOGGER.info("Deleted %s %s from the library", kind, item_id)
        return {"revisions": self._revisions_of(written), "link_failures": failed}

    def library_diagnostics(self) -> dict[str, Any]:
        """How much the library holds, counts only: never a name or a page."""
        lib = self._library
        return {
            "readable": not (self._load_failed or self._library_failed),
            "pages": len(lib["pages"]),
            "status_pages": len(lib["status_pages"]),
            "menus": len(lib["menus"]),
            "devices": len(lib["picks"]),
            "shared": {
                kind: sum(1 for owners in pickers(lib, kind).values() if len(owners) >= 2)
                for kind in LIBRARY_KINDS
            },
        }

    def page_photo_history(self) -> tuple[dict[str, list[dict[str, Any]]], bool]:
        """:meth:`history_documents` of the pages, plus the library's pages
        as one more document under the key ``""`` (never an owner id), so
        the page photo sweep keeps a photo that only a library page no
        device picks names."""
        found, complete = self.history_documents("pages")
        pages = list(self._library["pages"].values())
        if pages:
            found = {**found, "": [{"pages": pages}]}
        return found, complete and not self._library_failed

    def mark_delivered(
        self, owner_watch_id: str, kind: str, revision: int, *, confirmed: bool = False
    ) -> bool:
        """Record that the owner's device holds ``revision`` of ``kind``.

        Called by the signed get for every reply about a stored record, the
        ones that carry the document and the ones that answer "you already
        have it". Saves only when something moves, so a phone checking in on
        every foreground costs no disk write once it is up to date.

        ``confirmed`` is for the "you already have it" case: the device asked
        from ``revision`` itself, so it has read and applied it. That clears
        an unreadable report about ``revision`` or an earlier one (see
        ``WatchConfigRecord.mark_delivered``). A get that carried the document
        out passes ``confirmed=False`` and leaves the report standing.
        """
        record = self._records.get(owner_watch_id, {}).get(kind)
        if record is None or not record.mark_delivered(revision, confirmed=confirmed):
            return False
        self._schedule_owner_save(owner_watch_id)
        self._notify_delivery(owner_watch_id, kind)
        return True

    def note_multiple_pages(
        self, owner_watch_id: str, kind: str, multiple_pages: Any
    ) -> bool:
        """A device says which plan it is on (``multiple_pages``, see the
        module docstring). Returns whether anything moved.

        Called by the signed pages get. Anything but a bool, and any kind but
        pages, changes nothing. Saves and tells the delivery feed only when
        the value moves, so a watch checking in costs no disk write.
        """
        if kind != "pages" or not isinstance(multiple_pages, bool):
            return False
        record = self._records.get(owner_watch_id, {}).get(kind)
        if record is None or record.multiple_pages is multiple_pages:
            return False
        record.multiple_pages = multiple_pages
        self._schedule_owner_save(owner_watch_id)
        self._notify_delivery(owner_watch_id, kind)
        return True

    def report_unreadable(
        self, owner_watch_id: str, kind: str, revision: int, reason: Any = None
    ) -> bool:
        """A device says it fetched ``revision`` of ``kind`` and could not
        decode it. Returns whether that is the stored revision.

        Called by the signed get carrying ``unreadable_revision``, with its
        ``reason`` when the device gave one (cleaned by :func:`reject_reason`;
        junk reads as none). Only a report about the stored revision counts:
        it sets ``rejected_revision``, ``rejected_reason`` and
        ``rejected_at`` (the first report's time, kept through repeats; a
        repeat may add or change the reason), and the caller must then not
        mark that revision delivered. A report
        about any other revision is stale (a newer save already replaced what
        the device could not read) and changes nothing. Since delivery never
        runs past the stored revision, that also means a report about a
        revision older than one already delivered never flags anything. Saves
        only when the value moves. Tells no change listener, since the
        revision did not change; a report that moved is told to the delivery
        feed.
        """
        record = self._records.get(owner_watch_id, {}).get(kind)
        if record is None or revision != record.revision:
            return False
        if record.mark_rejected(reject_reason(reason)):
            self._schedule_owner_save(owner_watch_id)
            self._notify_delivery(owner_watch_id, kind)
        return True

    @callback
    def forget_owner(self, owner_watch_id: str, *, updated_by: str | None = None) -> bool:
        """Delete everything stored for one watch. Returns whether there was any.

        Called beside the complication store's release on both forget paths.
        Unlike a complication there is nothing to tombstone: a watch config is
        not replicated to anything that could resurrect it, and the phone reads
        the empty answer as "upload", which is right for a device that is
        paired again. The file is removed, not emptied, and that includes a
        file that could not be read: the user asked for the device to go, and
        an unreadable copy of its config has nobody left to recover it for.

        Listeners hear revision 0 for each kind removed, so a phone forgotten
        while open stops treating its stored revision as current. An
        unreadable file had no kinds anyone could see, so it announces none.

        The owner's picks leave the library; the items stay, and no other
        owner's pages, status pages or menus change. A linked voice library
        (page_links.py) left on exactly one other owner is no longer linked
        to anything, so the link mark is dropped there, as that owner's next
        revision written by ``updated_by`` (``forget:<owner>`` when not
        given), after the forget's own announcements.
        """
        had = owner_watch_id in self._records or owner_watch_id in self._failed_owners
        records = self._records.pop(owner_watch_id, {})
        removed = sorted(records)
        lost = {
            kind: ops.ids(records[kind].document)
            for kind in _COPY_LINKED_KINDS
            if kind in records and (ops := link_ops(kind)) is not None
        }
        self._failed_owners.discard(owner_watch_id)
        if had:
            self._remove_owner_file(owner_watch_id)
            self._schedule_index_save()
            _LOGGER.info("Forgot watch config for %s", owner_watch_id)
        for kind in removed:
            self._notify(owner_watch_id, kind, 0)
        writer = updated_by or f"forget:{owner_watch_id}"
        if not self._library_failed and owner_watch_id in self._library["picks"]:
            self._apply_library(library_forget(self._library, owner_watch_id).library, writer)
        elif any(
            owner_watch_id in self._library[notes] for notes in ("hashes", "revisions", "renames")
        ):
            for notes in ("hashes", "revisions", "renames"):
                self._library[notes].pop(owner_watch_id, None)
            self._schedule_library_save()
        self._drop_last_copies(owner_watch_id, lost, writer)
        return had

    @callback
    def check_move_owner(self, source_owner: str, target_owner: str) -> None:
        """Refuse a move onto an iPhone that :meth:`move_owner` would refuse,
        changing nothing.

        Raises :class:`WatchConfigPhoneKindError` when the target is an iPhone
        and the source holds a kind a phone may not own, or a ``behavior``
        with a key that is not a phone setting. Any other move passes,
        whatever it is: between watches, onto a phone of records a phone may
        hold, or from an owner with nothing stored. The complication move
        asks this before it moves any design, so a move is never split
        between designs that moved and a config that could not.
        """
        if not self._owner_is_iphone(target_owner):
            return
        for kind, source_record in sorted(self._records.get(source_owner, {}).items()):
            self._check_owner_kind(target_owner, kind)
            if kind == "behavior" and isinstance(source_record.document, dict):
                _kept, dropped = phone_behavior_document(source_record.document)
                if dropped:
                    raise WatchConfigPhoneKindError(
                        "the behavior moving onto this iPhone holds settings "
                        f"an iPhone does not keep: {', '.join(dropped)}"
                    )

    def move_owner(
        self, source_owner: str, target_owner: str, *, updated_by: str
    ) -> list[str]:
        """Carry one watch's config onto another watch. Returns the kinds moved.

        The reinstall recovery path, run beside the complication move: a
        reinstalled watch can come back under a new id, and its config must
        follow it. Per kind:

        * The target holds nothing of that kind: the record moves whole, with
          its revision, hash and history unchanged. The document did not
          change, so a phone that synced it before still reads it as in step.
          Its delivery is reset to nothing: it said which revision the device
          signing as the old id held, and nothing signing as the new id has
          asked yet. The panel then reads "waiting to be collected" until the
          first get under the new id (the watch's own pull, or the iPhone
          mirror's), which is the honest answer. Its
          unreadable report moves with it: the document is the same one the
          device could not read.
        * The target already holds one: the target's record stays. It is what
          the device under the new id has been working with since it came
          back, so it is the newer truth. The source's current document is filed into
          the target's history, so nothing is lost. Its own older history is
          not carried: it would push the target's past documents out of a
          five-entry list.

        The source is then forgotten. An owner whose file is unreadable on
        either side is refused, so a move never writes over something this
        instance could not read.

        Listeners hear the forget of the source (revision 0 per kind, from
        :meth:`forget_owner`), then the target's resulting revision of every
        kind moved, the kept ones included: their history grew, and a repeat
        of a revision the phone holds costs it nothing.

        A move onto an iPhone (phone pages) is refused whole, with
        :class:`WatchConfigPhoneKindError` and nothing changed, when the
        source holds a kind a phone may not own or a ``behavior`` with a key
        that is not a phone setting: a record moves whole, history and all,
        so it is never trimmed on the way (:meth:`check_move_owner`).
        """
        if not isinstance(source_owner, str) or not source_owner:
            raise WatchConfigValidationError("source_owner_watch_id is required")
        if not isinstance(target_owner, str) or not target_owner:
            raise WatchConfigValidationError("target_owner_watch_id is required")
        if source_owner == target_owner:
            raise WatchConfigValidationError(
                "the source and the target are the same watch"
            )
        self._check_available(source_owner)
        self._check_available(target_owner)
        moving = self._records.get(source_owner)
        if not moving:
            return []
        self.check_move_owner(source_owner, target_owner)
        new_owner = target_owner not in self._records
        target = self._records.setdefault(target_owner, {})
        moved: list[str] = []
        whole: list[str] = []
        for kind, source_record in sorted(moving.items()):
            existing = target.get(kind)
            if existing is None:
                record = copy.deepcopy(source_record)
                record.owner_watch_id = target_owner
                record.delivered_revision = 0
                record.delivered_at = None
                target[kind] = record
                whole.append(kind)
            else:
                existing.remember(copy.deepcopy(source_record.current_as_history()))
            moved.append(kind)
        self._schedule_owner_save(target_owner)
        if new_owner:
            self._schedule_index_save()
        # The picks go with the records that moved whole; for a kind the
        # target kept, its own picks stay and the source's go. The library
        # moves now, so the forget below finds no picks of the source to
        # drop; the records the move reaches are written once it has
        # announced.
        before_move = None
        if not self._library_failed and source_owner in self._library["picks"]:
            before_move = self._library
            self._library = move_picks(
                self._library, source_owner, target_owner, [k for k in whole if k in LIBRARY_KINDS]
            ).library
            self._schedule_library_save()
        self.forget_owner(source_owner, updated_by=updated_by)
        for kind in moved:
            self._notify(target_owner, kind, target[kind].revision)
        if before_move is not None:
            self._apply_library(self._library, updated_by, base=before_move)
            for kind in whole:
                self._note_hash(target_owner, kind)
        _LOGGER.info(
            "Moved watch config (%s) from %s to %s by %s",
            ", ".join(moved),
            source_owner,
            target_owner,
            updated_by,
        )
        return moved
