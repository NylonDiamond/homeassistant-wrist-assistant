"""Whose pages an iPhone draws: a watch's, or its own.

An iPhone draws its pages from the watch config store, as a watch does
(phone pages). Out of the box it draws a watch's: a user who already set up
pages for the watch finds them on the phone too, with nothing to copy. The
phone may instead draw pages of its own, which the panel edits under the
phone's id as before.

Three kinds follow that choice (`FOLLOWED_KINDS`): the pages, and the status
pages and menus they open, so a tile that opens one finds it. The phone's
settings and rooms stay its own whichever pages it draws.

The choice is kept on the phone's entry (`WidgetSecretEntry.pages_from`):

* ``None``, the default: a watch, picked here (`pages_owner`). Of the
  watches of the phone's Home Assistant user (`phone_watch_ids`) that hold
  pages, the one this phone paired, else the one whose pages were saved
  last. The phone's own when none of them holds pages.
* ``"own"``: the phone's own pages.
* a watch id: that watch, while it is still one of the phone's watches and
  holds pages; the default otherwise, so a removed watch never leaves the
  phone with nothing.

Reading a watch's records this way is read only: it marks no delivery on the
watch's record and files no report there. The watch is the one that collects
its pages; the phone only looks.

Pure over the secret entries and the store, so it is tested without Home
Assistant.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from .notifications import is_iphone_entry, phone_watch_ids

# The kinds an iPhone reads from the watch it follows.
FOLLOWED_KINDS = frozenset({"pages", "status_pages", "menus"})

# The stored choice for the phone's own pages.
PAGES_FROM_OWN = "own"


def pages_record(store: Any, owner_id: str) -> Any:
    """``owner_id``'s pages record, or None for none or an unreadable file."""
    try:
        return store.get(owner_id, "pages")
    except Exception:  # noqa: BLE001 (an unreadable owner is one with no pages)
        return None


def follow_candidates(secrets: Mapping[str, Any], phone_id: str) -> list[str]:
    """The watches an iPhone may draw the pages of: its user's watches, and
    any unbound watch that names it as its owner (`phone_watch_ids`)."""
    return phone_watch_ids(secrets, phone_id)


def pages_owner(secrets: Mapping[str, Any], store: Any, phone_id: str) -> str:
    """The owner whose `FOLLOWED_KINDS` the device ``phone_id`` reads.

    ``phone_id`` itself for a watch, an unknown id, a phone that chose its
    own pages, and a phone none of whose watches holds pages. Otherwise the
    watch the module docstring describes.
    """
    entry = secrets.get(phone_id)
    if not is_iphone_entry(entry):
        return phone_id
    choice = getattr(entry, "pages_from", None)
    if choice == PAGES_FROM_OWN:
        return phone_id
    candidates = follow_candidates(secrets, phone_id)
    if choice in candidates and pages_record(store, choice) is not None:
        return choice
    best: str | None = None
    best_key: tuple = ()
    for watch_id in candidates:
        record = pages_record(store, watch_id)
        if record is None:
            continue
        paired_here = getattr(secrets.get(watch_id), "owner_iphone_id", None) == phone_id
        key = (paired_here, record.updated_at or "", record.revision, watch_id)
        if best is None or key > best_key:
            best, best_key = watch_id, key
    return best if best is not None else phone_id


def read_owner(secrets: Mapping[str, Any], store: Any, signer_id: str, kind: Any) -> str:
    """The owner a signed get of ``kind`` from ``signer_id`` reads: the
    followed owner for an iPhone's `FOLLOWED_KINDS`, the signer otherwise."""
    if kind not in FOLLOWED_KINDS:
        return signer_id
    return pages_owner(secrets, store, signer_id)


def watch_name(secrets: Mapping[str, Any], watch_id: str) -> str:
    """A watch's name as its user sees it, for the phone's picker."""
    entry = secrets.get(watch_id)
    name = getattr(entry, "device_name", None) or getattr(entry, "label", None)
    if isinstance(name, str) and name.strip():
        return name.strip()
    return f"Watch {watch_id[:8]}"


def source_reply(secrets: Mapping[str, Any], store: Any, phone_id: str) -> dict[str, Any]:
    """What the phone's picker shows: its choice, the owner it reads now, and
    the watches it may pick, each with its name and whether it holds pages.

    ``choice`` is ``"auto"`` for the default, ``"own"``, or a watch id.
    ``pages_from`` is the owner read now (the phone's own id for its own).
    """
    entry = secrets.get(phone_id)
    choice = getattr(entry, "pages_from", None)
    return {
        "choice": choice if isinstance(choice, str) else "auto",
        "pages_from": pages_owner(secrets, store, phone_id),
        "watches": [
            {
                "id": watch_id,
                "name": watch_name(secrets, watch_id),
                "has_pages": pages_record(store, watch_id) is not None,
            }
            for watch_id in follow_candidates(secrets, phone_id)
        ],
    }


def parse_choice(
    secrets: Mapping[str, Any], phone_id: str, raw: Any
) -> tuple[bool, str | None]:
    """A choice the phone sent, as stored: ``(True, value)`` with ``None``
    for ``"auto"``, ``"own"``, or a watch id among the phone's watches;
    ``(False, None)`` for anything else."""
    if raw == "auto":
        return True, None
    if raw == PAGES_FROM_OWN:
        return True, PAGES_FROM_OWN
    if isinstance(raw, str) and raw in follow_candidates(secrets, phone_id):
        return True, raw
    return False, None
