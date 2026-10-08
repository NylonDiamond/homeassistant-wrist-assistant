"""Each watch's installed speech voices, kept so the panel can offer them.

Part of step 4d batch 2 (decision 1A in ``docs/pages_in_home_assistant_step4.md``
in the app repo). The voice settings (the ``voice`` watch config kind) carry
``watchSpeechVoiceIdentifier``, an ``AVSpeechSynthesisVoice`` id that must be
installed on that watch, and only the watch knows which are. Before this the
list went to the phone over WatchConnectivity and Home Assistant never saw it,
so a watch with no phone could not be given a voice. Now the watch reports it
here:

* Every ``/v2/delta`` request carries ``voices_hash``, the watch's own hash of
  its list (:func:`voices_hash`). When it is not the hash stored here, or
  nothing is stored, a reply with a body carries ``voices_wanted: true`` (see
  ``DeltaCoordinator.handle_poll``).
* The watch then sends the list with the signed ``watch_voices_put`` op. The
  server checks its shape (:func:`validate_voices`), sorts it by id, computes
  the hash itself and stores list, hash and time under the signing watch id.
  The next poll's hash then matches and the question stops.
* The panel's Watch voice picker reads it over
  ``wrist_assistant/watch_voices/get`` (``watch_config_ws.py``).

A device removal and the panel's Forget drop a watch's list, as they drop its
config records. A move between owners does not carry it: the list describes
the hardware that signs, and a watch under a new id reports its own on its
first poll.

Storage is one Home Assistant ``Store`` file for every watch. A file that
cannot be read is logged and treated as empty, and the next put writes over
it: the list is only a copy of what each watch can send again, and every
watch is asked for it again on its next poll.
"""

from __future__ import annotations

import hashlib
import json
import logging
import re
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    WATCH_VOICES_MAX_ENTRIES,
    WATCH_VOICES_STORAGE_KEY,
    WATCH_VOICES_STORAGE_VERSION,
)

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 2

# The compact JSON size one watch's list may reach. A real list is a couple of
# hundred entries of about 120 bytes; this bounds what one signed request can
# put on disk, alongside the entry count.
_MAX_LIST_BYTES = 256 * 1024

# A SHA-256 digest as lowercase hex, which is what the watch sends as
# `voices_hash` and what voices_hash() writes.
VOICES_HASH_RE = re.compile(r"[0-9a-f]{64}")

# The string keys every entry must carry besides its id. An entry is
# `WatchVoiceInfo` in the app: `id`, `name`, `language`, and `quality`, the
# raw value of AVSpeechSynthesisVoiceQuality.
_STRING_KEYS = ("name", "language")


class WatchVoicesValidationError(Exception):
    """The voice list is malformed. ``code`` is the stable reason."""

    code = "invalid"

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


def _now_iso() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _encode(voices: list[dict[str, Any]]) -> str:
    return json.dumps(voices, separators=(",", ":"), sort_keys=True, ensure_ascii=False)


def voices_hash(voices: list[dict[str, Any]]) -> str:
    """The hash of a voice list already sorted by id, as lowercase hex.

    The rule, which the watch must follow byte for byte to arrive at the same
    value:

    1. Sort the entries by ``id``, comparing ids by Unicode code point.
    2. Encode the sorted list as compact JSON with sorted keys, exactly
       ``json.dumps(sorted_list, separators=(",", ":"), sort_keys=True,
       ensure_ascii=False)``: no whitespace, object keys in code point order,
       non-ASCII characters written as themselves, ``/`` not escaped,
       ``quality`` a plain integer. In Swift that is ``JSONEncoder`` with
       ``.sortedKeys`` and ``.withoutEscapingSlashes`` over the sorted
       ``[WatchVoiceInfo]``.
    3. Take SHA-256 of that text as UTF-8 and write it as 64 lowercase hex
       digits.

    The empty list is the text ``[]``.
    """
    return hashlib.sha256(_encode(voices).encode("utf-8")).hexdigest()


def validate_voices(voices: Any) -> list[dict[str, Any]]:
    """The list as stored: checked and sorted by id.

    A list of at most ``WATCH_VOICES_MAX_ENTRIES`` objects, each with a
    non-empty string ``id``, no two sharing one, a string ``name`` and
    ``language`` and an integer ``quality``. Ids are compared exactly: a voice
    identifier is not a UUID, and two that differ in case are two voices. Any
    other key an entry carries is kept as sent, and hashed with it, so a newer
    watch can add some.
    """
    if not isinstance(voices, list):
        raise WatchVoicesValidationError("voices must be a list")
    if len(voices) > WATCH_VOICES_MAX_ENTRIES:
        raise WatchVoicesValidationError(
            f"voices holds {len(voices)} entries; the limit is {WATCH_VOICES_MAX_ENTRIES}"
        )
    seen: dict[str, int] = {}
    for index, voice in enumerate(voices):
        where = f"voices[{index}]"
        if not isinstance(voice, dict):
            raise WatchVoicesValidationError(f"{where} must be an object")
        voice_id = voice.get("id")
        if not isinstance(voice_id, str) or not voice_id:
            raise WatchVoicesValidationError(f"{where}.id must be a non-empty string")
        if voice_id in seen:
            raise WatchVoicesValidationError(
                f'{where} has the id "{voice_id}" of voices[{seen[voice_id]}]; '
                "voice ids must be unique"
            )
        seen[voice_id] = index
        for key in _STRING_KEYS:
            if not isinstance(voice.get(key), str):
                raise WatchVoicesValidationError(f"{where}.{key} must be a string")
        quality = voice.get("quality")
        if isinstance(quality, bool) or not isinstance(quality, int):
            raise WatchVoicesValidationError(f"{where}.quality must be an integer")
    ordered = sorted(voices, key=lambda voice: voice["id"])
    size = len(_encode(ordered).encode("utf-8"))
    if size > _MAX_LIST_BYTES:
        raise WatchVoicesValidationError(
            f"voices is {size} bytes; the limit is {_MAX_LIST_BYTES}"
        )
    return ordered


@dataclass
class WatchVoices:
    """One watch's list as last sent: sorted by id, its hash, and when."""

    voices: list[dict[str, Any]]
    hash: str
    updated_at: str

    def as_storage_dict(self) -> dict[str, Any]:
        return {"voices": self.voices, "hash": self.hash, "updated_at": self.updated_at}

    @classmethod
    def from_dict(cls, raw: Any) -> WatchVoices | None:
        """A stored entry, or None when it is not one (it is then dropped,
        and the watch is asked for its list again)."""
        if not isinstance(raw, dict):
            return None
        voices, digest, updated_at = raw.get("voices"), raw.get("hash"), raw.get("updated_at")
        if (
            not isinstance(voices, list)
            or not isinstance(digest, str)
            or not VOICES_HASH_RE.fullmatch(digest)
            or not isinstance(updated_at, str)
        ):
            return None
        return cls(voices=voices, hash=digest, updated_at=updated_at)


class WatchVoicesStore:
    """Every watch's voice list, keyed on the watch id that signed it."""

    def __init__(self, hass: HomeAssistant) -> None:
        # A debounced save is waiting (see async_shutdown), and whether the
        # entry has unloaded, after which this instance saves nothing.
        self._save_pending = False
        self._closed = False
        self._store: Store = Store(
            hass, WATCH_VOICES_STORAGE_VERSION, WATCH_VOICES_STORAGE_KEY
        )
        self._watches: dict[str, WatchVoices] = {}

    async def async_load(self) -> None:
        try:
            data = await self._store.async_load()
        except Exception:  # noqa: BLE001 (see the module docstring)
            _LOGGER.exception("Watch voice lists could not be read; starting empty")
            return
        if not isinstance(data, dict) or not isinstance(data.get("watches"), dict):
            return
        for watch_id, raw in data["watches"].items():
            entry = WatchVoices.from_dict(raw)
            if isinstance(watch_id, str) and entry is not None:
                self._watches[watch_id] = entry

    def _serialize(self) -> dict[str, Any]:
        return {
            "watches": {
                watch_id: entry.as_storage_dict()
                for watch_id, entry in sorted(self._watches.items())
            }
        }

    async def async_shutdown(self) -> None:
        """Called on unload: write a save still waiting out its debounce now,
        which cancels the delayed one, and save nothing after. A reload then
        reads every change, and an uninstall that follows removes a file no
        one writes again."""
        self._closed = True
        if not self._save_pending:
            return
        self._save_pending = False
        await self._store.async_save(self._serialize())

    def _schedule_save(self) -> None:
        if self._closed:
            return
        self._save_pending = True
        self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)

    async def async_remove(self) -> None:
        """Delete the file. Called when the integration is removed."""
        self._watches.clear()
        await self._store.async_remove()

    def get(self, watch_id: str) -> WatchVoices | None:
        return self._watches.get(watch_id)

    def wants(self, watch_id: str, reported_hash: str) -> bool:
        """Whether the watch should send its list: the hash it reported is not
        the stored one, or nothing is stored."""
        entry = self._watches.get(watch_id)
        return entry is None or entry.hash != reported_hash

    def put(self, watch_id: str, voices: Any) -> WatchVoices:
        """Check, sort, hash and store one watch's list, replacing what it had.

        Refused with :class:`WatchVoicesValidationError` for a malformed list,
        which leaves the stored one alone.
        """
        if not isinstance(watch_id, str) or not watch_id:
            raise WatchVoicesValidationError("watch_id is required")
        ordered = validate_voices(voices)
        entry = WatchVoices(voices=ordered, hash=voices_hash(ordered), updated_at=_now_iso())
        self._watches[watch_id] = entry
        self._schedule_save()
        return entry

    def forget(self, watch_id: str) -> bool:
        """Drop one watch's list. True when it had one."""
        if self._watches.pop(watch_id, None) is None:
            return False
        self._schedule_save()
        return True
