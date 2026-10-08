"""Each device's latest log upload, kept for its diagnostics download.

Step 4 of the phone watch link removal (``docs/phone_watch_link_removal_2026-10.md``
in the app repo). The watch's support bundle used to reach support only by
way of the phone's mail composer. Now the watch sends it here with the signed
``watch_logs_put`` op ("Send logs to Home Assistant" in Connection Health),
and the user downloads it from the watch's device page in Home Assistant
(Download diagnostics, ``diagnostics.async_get_device_diagnostics``), which
passes it through the redaction once more.

Only the latest upload of each device is kept, under the id that signed it.
Each lives in its own JSON file in ``.storage/wrist_assistant_watch_logs``
(``{"watch_id", "received_at", "bytes", "bundle"}``), so an upload rewrites
one file and never every device's. A small index in
``.storage/wrist_assistant.watch_logs`` says which devices have one, when it
arrived and how big it is, which is all the config entry diagnostics show.

The logs are only a copy of what the device can send again, so an index that
cannot be read is logged and treated as empty (the next upload writes a new
one), and the start of day drops index entries whose file is gone and files
no entry names. A device removal (and the panel's Forget) drops its file;
uninstalling the integration removes the index and the folder.
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import logging
import os
import re
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import WATCH_LOGS_STORAGE_KEY, WATCH_LOGS_STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 1
_FOLDER = "wrist_assistant_watch_logs"
# A device id that is safe as a file name as it is. Anything else (an
# ``iphone:`` id, say) is named by its hash.
_SAFE_ID_RE = re.compile(r"[A-Za-z0-9_-]{1,128}")


class WatchLogsError(Exception):
    """Base class; ``code`` is the stable reason the op sends back."""

    code = "error"

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class WatchLogsInvalidError(WatchLogsError):
    code = "invalid"


def _now_iso() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def file_name(watch_id: str) -> str:
    """The file a device's upload lives in."""
    if _SAFE_ID_RE.fullmatch(watch_id):
        return f"w-{watch_id}.json"
    return f"h-{hashlib.sha256(watch_id.encode('utf-8')).hexdigest()}.json"


@dataclass(frozen=True)
class WatchLogsEntry:
    """What the index holds about one device's upload."""

    received_at: str
    bytes: int

    def as_storage_dict(self) -> dict[str, Any]:
        return {"received_at": self.received_at, "bytes": self.bytes}

    @classmethod
    def from_dict(cls, raw: Any) -> WatchLogsEntry | None:
        if not isinstance(raw, dict):
            return None
        received_at, size = raw.get("received_at"), raw.get("bytes")
        if (
            not isinstance(received_at, str)
            or isinstance(size, bool)
            or not isinstance(size, int)
            or size < 0
        ):
            return None
        return cls(received_at=received_at, bytes=size)


class WatchLogsStore:
    """Every device's latest log upload, keyed on the id that signed it."""

    def __init__(self, hass: HomeAssistant) -> None:
        # A debounced save is waiting (see async_shutdown), and whether the
        # entry has unloaded, after which this instance saves nothing.
        self._save_pending = False
        self._closed = False
        self._hass = hass
        self._store: Store = Store(hass, WATCH_LOGS_STORAGE_VERSION, WATCH_LOGS_STORAGE_KEY)
        self._dir = Path(hass.config.path(".storage", _FOLDER))
        self._index: dict[str, WatchLogsEntry] = {}
        # Held across a file write and its index entry, and a forget's
        # unlink, so a forget racing an upload never leaves one without the
        # other.
        self._lock = asyncio.Lock()

    # ── persistence ────────────────────────────────────────────────────

    async def async_load(self) -> None:
        try:
            data = await self._store.async_load()
        except Exception:
            _LOGGER.exception("The watch log index could not be read; starting empty")
            return
        watches = data.get("watches") if isinstance(data, dict) else None
        for watch_id, raw in (watches.items() if isinstance(watches, dict) else ()):
            entry = WatchLogsEntry.from_dict(raw)
            if isinstance(watch_id, str) and watch_id and entry is not None:
                self._index[watch_id] = entry

    async def async_start(self) -> None:
        """The start of day: index entries whose file is gone are dropped,
        and files no entry names (a half written ``.tmp`` too) removed."""
        wanted = {file_name(watch_id): watch_id for watch_id in self._index}

        def on_disk() -> set[str]:
            try:
                return {p.name for p in self._dir.iterdir()}
            except OSError:
                return set()

        present = await self._hass.async_add_executor_job(on_disk)
        missing = [watch_id for name, watch_id in wanted.items() if name not in present]
        for watch_id in missing:
            del self._index[watch_id]
        if missing:
            self._schedule_save()
        strays = sorted(present - set(wanted))
        if strays:
            await self._hass.async_add_executor_job(self._unlink, strays)

    def _serialize(self) -> dict[str, Any]:
        return {
            "watches": {
                watch_id: entry.as_storage_dict()
                for watch_id, entry in sorted(self._index.items())
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

    def _unlink(self, names: list[str]) -> None:
        for name in names:
            try:
                (self._dir / name).unlink(missing_ok=True)
            except OSError:
                _LOGGER.debug("Could not remove watch log file %s", name)

    async def async_remove(self) -> None:
        """Delete the index and every log file. Called when the integration
        is removed; works on a fresh instance, since it reads the folder."""
        self._index.clear()
        await self._store.async_remove()

        def remove_folder() -> None:
            try:
                names = [p.name for p in self._dir.iterdir()]
            except OSError:
                return
            self._unlink(names)
            try:
                self._dir.rmdir()
            except OSError:
                _LOGGER.debug("Could not remove the watch log folder")

        await self._hass.async_add_executor_job(remove_folder)

    # ── reads ──────────────────────────────────────────────────────────

    def entry(self, watch_id: str) -> WatchLogsEntry | None:
        return self._index.get(watch_id)

    def listing(self) -> list[dict[str, Any]]:
        """Which devices have logs, when they arrived and their size, newest
        first. Never the logs."""
        rows = [
            {"watch_id": watch_id, **entry.as_storage_dict()}
            for watch_id, entry in self._index.items()
        ]
        rows.sort(key=lambda row: (row["received_at"], row["watch_id"]), reverse=True)
        return rows

    async def async_read(self, watch_id: str) -> dict[str, Any] | None:
        """The device's latest upload as stored (``watch_id``,
        ``received_at``, ``bytes``, ``bundle``), or None when it has none or
        the file cannot be read."""
        if watch_id not in self._index:
            return None
        path = self._dir / file_name(watch_id)

        def read() -> Any:
            try:
                return json.loads(path.read_text(encoding="utf-8"))
            except (OSError, ValueError):
                return None

        data = await self._hass.async_add_executor_job(read)
        if not isinstance(data, dict) or data.get("watch_id") != watch_id:
            return None
        return data

    # ── writes ─────────────────────────────────────────────────────────

    async def async_put(self, watch_id: str, bundle: Any) -> WatchLogsEntry:
        """Store a device's upload, replacing the one it had."""
        if not isinstance(watch_id, str) or not watch_id:
            raise WatchLogsInvalidError("watch_id is required")
        if not isinstance(bundle, dict):
            raise WatchLogsInvalidError("bundle must be an object")
        received_at = _now_iso()
        path = self._dir / file_name(watch_id)

        def write() -> int:
            # Encoded here, off the event loop: a bundle may be 2 MiB.
            encoded_bundle = json.dumps(bundle, ensure_ascii=False, separators=(",", ":"))
            size = len(encoded_bundle.encode("utf-8"))
            head = json.dumps(
                {"watch_id": watch_id, "received_at": received_at, "bytes": size},
                ensure_ascii=False,
                separators=(",", ":"),
            )
            # The bundle is spliced in already encoded rather than encoded twice.
            text = head[:-1] + ',"bundle":' + encoded_bundle + "}"
            self._dir.mkdir(parents=True, exist_ok=True)
            # Written beside and moved over, so a reader never sees half a file.
            partial = path.with_suffix(".tmp")
            partial.write_text(text, encoding="utf-8")
            os.replace(partial, path)
            return size

        async with self._lock:
            size = await self._hass.async_add_executor_job(write)
            entry = WatchLogsEntry(received_at=received_at, bytes=size)
            self._index[watch_id] = entry
            self._schedule_save()
        return entry

    def forget(self, watch_id: str) -> bool:
        """Drop one device's upload; the file goes on a task. True when it had
        one."""
        if self._index.pop(watch_id, None) is None:
            return False
        self._schedule_save()
        self._hass.async_create_task(
            self._async_unlink_one(watch_id), name=f"wrist_assistant_watch_logs_forget_{watch_id}"
        )
        return True

    async def _async_unlink_one(self, watch_id: str) -> None:
        async with self._lock:
            if watch_id in self._index:
                # Uploaded again since the forget: the new file stays.
                return
            await self._hass.async_add_executor_job(self._unlink, [file_name(watch_id)])
