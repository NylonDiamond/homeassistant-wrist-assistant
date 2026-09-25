"""Card previews: one picture of each complication, for the panel's Browse grid.

The panel draws a complication's card from its document, its entities and its
pictures. That is a camera request per picture layer and a full resolve per
card, every time the grid draws. So on each save the panel draws the card
once, turns it into a PNG and sends it here, and Browse shows that PNG instead.

A preview belongs to one revision of one record. The list reply names the
previews whose revision is still the record's, and nothing else: a record
saved from somewhere that took no picture (a copy written to another device,
the iPhone app, a restore) simply has no preview until the panel makes one.

The pictures never leave Home Assistant's own login. The panel fetches the
bytes over its authenticated WebSocket and keeps them in the browser under the
revision, so a card is fetched once per revision per browser. There is no
public URL: a preview can hold a frame from a camera in the house.

Storage is a small index in ``.storage`` plus one PNG file per record beside
it, so a save rewrites one file and a few hundred bytes of index rather than
every picture in the home.
"""

from __future__ import annotations

import hashlib
import logging
import os
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import CARD_PREVIEW_STORAGE_KEY, CARD_PREVIEW_STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 1

# A card is a few hundred pixels across. A camera frame drawn into one at three
# times its size is well under this; anything bigger is not a card.
MAX_PREVIEW_BYTES = 512 * 1024
# Well past the records any home keeps, low enough that a runaway client
# cannot fill the disk through this door.
MAX_PREVIEWS = 2000
_PNG_MAGIC = b"\x89PNG\r\n\x1a\n"

# What the panel needs to lay the picture back into a card without drawing
# the complication: which shape on which device it is, the size the shape
# was drawn at, and for a corner, where its disc sits in the quadrant.
_DEVICES = {"watch", "iphone"}
_FAMILIES = {
    "rectangular", "circular", "corner", "small", "medium", "large", "xlarge",
}
_MAX_SIDE = 4000.0


class CardPreviewError(Exception):
    """Base class; ``code`` is the stable machine-readable reason."""

    code = "error"

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class CardPreviewInvalidError(CardPreviewError):
    """The picture or its description is malformed or too big."""

    code = "invalid"


def _key(owner_watch_id: str, record_id: str) -> str:
    return f"{owner_watch_id}/{record_id}"


def _file_name(key: str) -> str:
    # Owner and record ids are not guaranteed to be safe in a file name; a
    # digest of the pair always is, and never collides in practice.
    return hashlib.sha256(key.encode()).hexdigest()[:32] + ".png"


def _number(raw: Any, name: str) -> float:
    if isinstance(raw, bool) or not isinstance(raw, (int, float)):
        raise CardPreviewInvalidError(f"{name} must be a number")
    value = float(raw)
    if not 0 < value <= _MAX_SIDE:
        raise CardPreviewInvalidError(f"{name} is out of range")
    return value


def clean_meta(raw: Any) -> dict[str, Any]:
    """The description a preview is laid back into a card with, checked."""
    if not isinstance(raw, dict):
        raise CardPreviewInvalidError("meta must be an object")
    family = raw.get("family")
    device = raw.get("device")
    if family not in _FAMILIES:
        raise CardPreviewInvalidError("meta.family is not a drawable shape")
    if device not in _DEVICES:
        raise CardPreviewInvalidError("meta.device must be watch or iphone")
    meta: dict[str, Any] = {
        "family": family,
        "device": device,
        "width": _number(raw.get("width"), "meta.width"),
        "height": _number(raw.get("height"), "meta.height"),
    }
    focus = raw.get("focus")
    if focus is not None:
        if not isinstance(focus, dict):
            raise CardPreviewInvalidError("meta.focus must be an object")
        meta["focus"] = {
            "cx": _number(focus.get("cx"), "meta.focus.cx"),
            "cy": _number(focus.get("cy"), "meta.focus.cy"),
            "diameter": _number(focus.get("diameter"), "meta.focus.diameter"),
        }
    # How the panel drew the picture. It retakes a picture drawn by an older
    # way that it knows came out wrong; absent is the first way.
    version = raw.get("version")
    if version is not None:
        if isinstance(version, bool) or not isinstance(version, int) or not 1 <= version <= 1000:
            raise CardPreviewInvalidError("meta.version must be a small whole number")
        meta["version"] = version
    return meta


def check_png(data: bytes) -> None:
    if len(data) > MAX_PREVIEW_BYTES:
        raise CardPreviewInvalidError(
            f"a preview is at most {MAX_PREVIEW_BYTES // 1024} KB"
        )
    if not data.startswith(_PNG_MAGIC):
        raise CardPreviewInvalidError("a preview must be a PNG")


class CardPreviewStore:
    """The index in ``.storage`` and the PNG files beside it."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store: Store = Store(
            hass, CARD_PREVIEW_STORAGE_VERSION, CARD_PREVIEW_STORAGE_KEY
        )
        self._dir = Path(hass.config.path(".storage", "wrist_assistant_card_previews"))
        self._index: dict[str, dict[str, Any]] = {}

    async def async_load(self) -> None:
        try:
            data = await self._store.async_load()
        except Exception:  # noqa: BLE001 - a damaged index starts empty
            _LOGGER.warning("Card preview index could not be read; starting empty")
            data = None
        previews = data.get("previews") if isinstance(data, dict) else None
        if not isinstance(previews, dict):
            return
        for key, entry in previews.items():
            if not isinstance(key, str) or not isinstance(entry, dict):
                continue
            revision = entry.get("revision")
            if isinstance(revision, bool) or not isinstance(revision, int):
                continue
            try:
                meta = clean_meta(entry.get("meta"))
            except CardPreviewError:
                continue
            self._index[key] = {
                "revision": revision,
                "meta": meta,
                "updated_at": str(entry.get("updated_at", "")),
            }

    def _serialize(self) -> dict[str, Any]:
        return {"previews": self._index}

    def _save(self) -> None:
        self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)

    def previews_for(self, owner_watch_id: str, records: list[Any]) -> dict[str, Any]:
        """The current preview of each record that has one, by record id.

        A preview of an older revision is left out, which is the whole of how
        a card knows to draw itself live again after a save that took none.
        """
        out: dict[str, Any] = {}
        for record in records:
            if getattr(record, "deleted", False):
                continue
            entry = self._index.get(_key(owner_watch_id, record.id))
            if entry is None or entry["revision"] != record.revision:
                continue
            out[record.id] = {"revision": entry["revision"], **entry["meta"]}
        return out

    def revision_of(self, owner_watch_id: str, record_id: str) -> int | None:
        entry = self._index.get(_key(owner_watch_id, record_id))
        return None if entry is None else entry["revision"]

    async def async_read(self, owner_watch_id: str, record_id: str) -> bytes | None:
        key = _key(owner_watch_id, record_id)
        if key not in self._index:
            return None
        path = self._dir / _file_name(key)

        def read() -> bytes | None:
            try:
                return path.read_bytes()
            except OSError:
                return None

        return await self._hass.async_add_executor_job(read)

    async def async_put(
        self,
        owner_watch_id: str,
        record_id: str,
        revision: int,
        data: bytes,
        meta: Any,
    ) -> dict[str, Any]:
        check_png(data)
        cleaned = clean_meta(meta)
        key = _key(owner_watch_id, record_id)
        if key not in self._index and len(self._index) >= MAX_PREVIEWS:
            raise CardPreviewInvalidError("too many previews")
        path = self._dir / _file_name(key)

        def write() -> None:
            self._dir.mkdir(parents=True, exist_ok=True)
            # Written beside and moved over, so a reader never sees half a file.
            partial = path.with_suffix(".tmp")
            partial.write_bytes(data)
            os.replace(partial, path)

        await self._hass.async_add_executor_job(write)
        self._index[key] = {
            "revision": revision,
            "meta": cleaned,
            "updated_at": dt_util.utcnow().isoformat(),
        }
        self._save()
        return {"revision": revision, **cleaned}

    async def async_remove(self, owner_watch_id: str, record_id: str) -> None:
        key = _key(owner_watch_id, record_id)
        if self._index.pop(key, None) is None:
            return
        self._save()
        await self._hass.async_add_executor_job(self._unlink, [_file_name(key)])

    async def async_prune(self, live: set[tuple[str, str]]) -> None:
        """Drop the previews of records that are gone, and stray files."""
        keep = {_key(owner, record_id) for owner, record_id in live}
        gone = [key for key in self._index if key not in keep]
        for key in gone:
            del self._index[key]
        if gone:
            self._save()
        wanted = {_file_name(key) for key in self._index}

        def strays() -> list[str]:
            try:
                return [p.name for p in self._dir.iterdir() if p.name not in wanted]
            except OSError:
                return []

        names = await self._hass.async_add_executor_job(strays)
        if names:
            await self._hass.async_add_executor_job(self._unlink, names)

    def _unlink(self, names: list[str]) -> None:
        for name in names:
            try:
                (self._dir / name).unlink(missing_ok=True)
            except OSError:
                _LOGGER.debug("Could not remove card preview %s", name)
