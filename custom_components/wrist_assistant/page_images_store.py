"""The home's page background photos, kept by Home Assistant.

Step 4d batch 6 (``docs/pages_in_home_assistant_step4.md`` in the app repo).
One library for the whole home, as with the HTTP actions: a page of any
watch may name any photo, and any paired device may fetch one by id. The
rules (ids, the JPEG check, what a sweep does) live in ``page_images.py``.

Two kinds of photo:

* Custom photos, uploaded in the panel or handed over by a phone. Each has an
  entry in a small index in ``.storage/wrist_assistant.page_images`` (bytes,
  width, height, sha256, ``added_at`` and ``unused_since``) and one JPEG file,
  ``<id>.jpg``, in ``.storage/wrist_assistant_page_images`` beside it. So an
  upload writes one file and a few hundred bytes of index, never every photo.
* Built-in photos, the 15 the phone offers. Their pixels ship with the
  integration in ``page_image_presets/`` (the phone's asset files, as they are) with
  ``presets.json`` naming them in the phone's order. Read only: never in the
  index, never swept, never deleted.

A photo is in use while any owner's ``pages`` record names it as a page's
``backgroundImageId``. The sweep runs at start and after every write of a
``pages`` record, whoever made it (setup hangs :meth:`pages_changed` on the
watch config store's listeners, which hear every accepted save, restore,
forget and move). It marks photos that fell out of use, clears the mark on
photos back in use, and deletes photos unused for more than seven days. The
grace keeps an upload whose page save has not happened yet, and the panel's
undo. When some owner's pages could not be read the sweep marks and deletes
nothing, since those pages may name any photo.

An index that cannot be read is logged and left alone: every read and write
is then refused with ``unavailable`` until a restart reads it, so a damaged
index is never saved over with an empty one. Unloading writes a pending save
at once and stops saving, as the HTTP action library does. Uninstalling the
integration removes the index and the folder.
"""

from __future__ import annotations

import asyncio
import base64
import binascii
import hashlib
import json
import logging
import os
import re
import uuid
from collections.abc import Callable, Mapping
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store

from .const import PAGE_IMAGES_STORAGE_KEY, PAGE_IMAGES_STORAGE_VERSION
from .page_images import (
    MAX_CUSTOM_IMAGES,
    MAX_IMAGE_BYTES,
    PageImageInvalid,
    check_id,
    check_jpeg,
    is_preset,
    normalize_id,
    plan_sweep,
    usage,
)

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 1
_FOLDER = "wrist_assistant_page_images"
_PRESETS_DIR = Path(__file__).parent / "page_image_presets"
_SHA256_RE = re.compile(r"[0-9a-f]{64}")
# Base64 is four characters per three bytes; anything longer than a photo at
# the cap could encode to is refused before it is decoded.
_MAX_BASE64_CHARS = (MAX_IMAGE_BYTES + 2) // 3 * 4

# Every owner's current ``pages`` document, and whether that is all of them
# (``WatchConfigStore.documents``).
PagesSource = Callable[[], tuple[Mapping[str, Any], bool]]


class PageImagesError(Exception):
    """Base class; ``code`` is the stable reason the WebSocket and the ops
    send back."""

    code = "error"

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class PageImagesInvalidError(PageImagesError):
    code = "invalid"


class PageImagesTooLargeError(PageImagesError):
    code = "too_large"


class PageImagesFullError(PageImagesError):
    code = "full"


class PageImagesNotFoundError(PageImagesError):
    code = "not_found"


class PageImagesInUseError(PageImagesError):
    code = "in_use"


class PageImagesUnavailableError(PageImagesError):
    code = "unavailable"


def _utcnow() -> datetime:
    return datetime.now(UTC)


def _iso(moment: datetime) -> str:
    return moment.astimezone(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _rule_error(err: PageImageInvalid) -> PageImagesError:
    if err.code == "too_large":
        return PageImagesTooLargeError(err.message)
    return PageImagesInvalidError(err.message)


def decode_data(raw: Any) -> bytes:
    """The photo's bytes from the base64 text the panel and the phone send.
    Too long to be a photo at the cap is ``too_large``; anything that is not
    base64 is ``invalid``."""
    if not isinstance(raw, str) or not raw:
        raise PageImagesInvalidError("data must be the photo as base64 text")
    if len(raw) > _MAX_BASE64_CHARS:
        raise PageImagesTooLargeError(f"a photo is at most {MAX_IMAGE_BYTES // 1024} KB")
    try:
        return base64.b64decode(raw, validate=True)
    except (binascii.Error, ValueError) as err:
        raise PageImagesInvalidError("data is not base64") from err


def _clean_entry(raw: Any) -> dict[str, Any] | None:
    """One stored index entry, checked, or None to drop it."""
    if not isinstance(raw, dict):
        return None
    fields: dict[str, Any] = {}
    for key in ("bytes", "width", "height"):
        value = raw.get(key)
        if isinstance(value, bool) or not isinstance(value, int) or value <= 0:
            return None
        fields[key] = value
    digest = raw.get("sha256")
    added_at = raw.get("added_at")
    unused_since = raw.get("unused_since")
    if not isinstance(digest, str) or not _SHA256_RE.fullmatch(digest):
        return None
    if not isinstance(added_at, str):
        return None
    if unused_since is not None and not isinstance(unused_since, str):
        return None
    return {
        **fields,
        "sha256": digest,
        "added_at": added_at,
        "unused_since": unused_since,
    }


def _read_presets() -> list[dict[str, Any]]:
    """The built-in photos as ``presets.json`` lists them, each with the size
    read from its file. One that is not shipped or not a readable JPEG is
    left out and logged; the rest still work."""
    try:
        listed = json.loads((_PRESETS_DIR / "presets.json").read_text())
    except (OSError, ValueError):
        _LOGGER.error("The built-in page photos list could not be read")
        return []
    presets: list[dict[str, Any]] = []
    for item in listed if isinstance(listed, list) else []:
        image_id = item.get("id") if isinstance(item, dict) else None
        name = item.get("name") if isinstance(item, dict) else None
        if not isinstance(image_id, str) or not is_preset(image_id) or not isinstance(name, str):
            continue
        try:
            width, height = check_jpeg((_PRESETS_DIR / f"{image_id}.jpg").read_bytes())
        except (OSError, PageImageInvalid):
            _LOGGER.error("The built-in page photo %s is missing or unreadable", image_id)
            continue
        presets.append({"id": image_id, "name": name, "width": width, "height": height})
    return presets


class PageImagesStore:
    """The index in ``.storage``, the JPEG files beside it, and the built-in
    photos that ship with the integration."""

    def __init__(self, hass: HomeAssistant, pages: PagesSource | None = None) -> None:
        """``pages`` reads every owner's ``pages`` document. Without it no
        photo is ever in use, so nothing is swept and nothing is marked (what
        a store made only to remove its files, or a test of the files alone,
        wants)."""
        self._hass = hass
        self._pages = pages
        self._store: Store = Store(
            hass, PAGE_IMAGES_STORAGE_VERSION, PAGE_IMAGES_STORAGE_KEY
        )
        self._dir = Path(hass.config.path(".storage", _FOLDER))
        self._index: dict[str, dict[str, Any]] = {}
        self._presets: list[dict[str, Any]] = []
        self._load_failed = False
        self._save_pending = False
        self._closed = False
        # Held across every write of a file and its index entry, and by the
        # sweep's file removal, so a photo handed over again just after the
        # sweep dropped it is never unlinked under its new entry, and two
        # uploads of the same bytes make one photo.
        self._lock = asyncio.Lock()

    # ── persistence ────────────────────────────────────────────────────

    async def async_load(self) -> None:
        try:
            data = await self._store.async_load()
        except Exception:  # A damaged index: see the module docstring.
            _LOGGER.exception(
                "The page photo index could not be read; it is left alone and "
                "refused until a restart reads it"
            )
            self._load_failed = True
        else:
            images = data.get("images") if isinstance(data, dict) else None
            for key, raw in (images.items() if isinstance(images, dict) else ()):
                image_id = normalize_id(key)
                entry = _clean_entry(raw)
                if image_id is None or is_preset(image_id) or entry is None:
                    continue
                self._index[image_id] = entry
        self._presets = await self._hass.async_add_executor_job(_read_presets)

    def _serialize(self) -> dict[str, Any]:
        return {"images": self._index}

    def _schedule_save(self) -> None:
        if self._closed or self._load_failed:
            return
        self._save_pending = True
        self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)

    async def async_shutdown(self) -> None:
        """Called on unload: write a save still waiting out its debounce now
        and save nothing after, so an uninstall that follows removes an index
        no one writes again."""
        self._closed = True
        if not self._save_pending or self._load_failed:
            return
        self._save_pending = False
        await self._store.async_save(self._serialize())

    async def async_remove(self) -> None:
        """Delete the index and every photo file. Called when the integration
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
                _LOGGER.debug("Could not remove the page photo folder")

        await self._hass.async_add_executor_job(remove_folder)

    async def async_start(self) -> None:
        """The start of day sweep: index entries whose file is gone are
        dropped, files no entry names (a half written ``.tmp`` too) are
        removed, then the sweep runs against the pages as loaded."""
        if self._load_failed:
            return
        wanted = {f"{image_id}.jpg" for image_id in self._index}

        def on_disk() -> set[str]:
            try:
                return {p.name for p in self._dir.iterdir()}
            except OSError:
                return set()

        present = await self._hass.async_add_executor_job(on_disk)
        missing = [name[:-4] for name in wanted - present]
        for image_id in missing:
            del self._index[image_id]
        if missing:
            _LOGGER.warning("Page photo file(s) missing, dropped from the index: %s", missing)
            self._schedule_save()
        strays = sorted(present - wanted)
        if strays:
            await self._hass.async_add_executor_job(self._unlink, strays)
        self.sweep()

    def _unlink(self, names: list[str]) -> None:
        for name in names:
            try:
                (self._dir / name).unlink(missing_ok=True)
            except OSError:
                _LOGGER.debug("Could not remove page photo file %s", name)

    def _check_available(self) -> None:
        if self._load_failed:
            raise PageImagesUnavailableError("the stored page photo index could not be read")

    # ── reads ──────────────────────────────────────────────────────────

    @property
    def available(self) -> bool:
        return not self._load_failed

    def _usage(self) -> tuple[dict[str, list[str]], bool]:
        """Photo id to the owners whose pages name it, and whether every
        owner's pages could be read. With no way to read pages, nothing is
        in use (the sweep checks for that on its own)."""
        if self._pages is None:
            return {}, True
        documents, complete = self._pages()
        return usage(documents), complete

    def list(self) -> dict[str, Any]:
        """The panel's view: ``{"presets": [{id, name, width, height}],
        "images": [{id, width, height, bytes, added_at, used_by}]}``, the
        built-in photos in the phone's order and the custom ones newest
        first."""
        self._check_available()
        used, _complete = self._usage()
        # Newest first; among photos added in the same second, the one put in
        # the index later comes first.
        ordered = [
            item
            for _position, item in sorted(
                enumerate(self._index.items()),
                key=lambda pair: (pair[1][1]["added_at"], pair[0]),
                reverse=True,
            )
        ]
        return {
            "presets": [dict(preset) for preset in self._presets],
            "images": [
                {
                    "id": image_id,
                    "width": entry["width"],
                    "height": entry["height"],
                    "bytes": entry["bytes"],
                    "added_at": entry["added_at"],
                    "used_by": list(used.get(image_id, [])),
                }
                for image_id, entry in ordered
            ],
        }

    def entry(self, image_id: str) -> dict[str, Any] | None:
        """A custom photo's index entry, a copy, or None."""
        found = self._index.get(image_id)
        return None if found is None else dict(found)

    async def async_read(self, raw_id: Any) -> tuple[str, bytes]:
        """(the id as stored, the JPEG bytes) of a custom or built-in photo.
        ``invalid`` for something that is not a photo id, ``not_found`` for
        an id with no photo."""
        self._check_available()
        image_id = self._check_id(raw_id)
        if is_preset(image_id):
            path = _PRESETS_DIR / f"{image_id}.jpg"
        elif image_id in self._index:
            path = self._dir / f"{image_id}.jpg"
        else:
            raise PageImagesNotFoundError(f"there is no photo {image_id}")

        def read() -> bytes | None:
            try:
                return path.read_bytes()
            except OSError:
                return None

        data = await self._hass.async_add_executor_job(read)
        if data is None:
            raise PageImagesNotFoundError(f"the file of photo {image_id} is gone")
        return image_id, data

    @staticmethod
    def _check_id(raw_id: Any) -> str:
        try:
            return check_id(raw_id)
        except PageImageInvalid as err:
            raise PageImagesInvalidError(err.message) from err

    # ── writes ─────────────────────────────────────────────────────────

    async def async_upload(self, data: bytes) -> dict[str, Any]:
        """Keep a photo uploaded in the panel under a new upper case UUID.
        Returns ``{"image_id", "width", "height", "bytes"}``.

        The same bytes as a stored photo (by sha256) answer that photo's id
        instead of a copy, and restart its grace if no page names it, so the
        page save that follows finds it there.
        """
        self._check_available()
        width, height = self._check_bytes(data)
        digest = hashlib.sha256(data).hexdigest()
        async with self._lock:
            for image_id, entry in self._index.items():
                if entry["sha256"] == digest:
                    if entry["unused_since"] is not None:
                        entry["unused_since"] = _iso(_utcnow())
                        self._schedule_save()
                    return self._upload_reply(image_id, entry)
            image_id = str(uuid.uuid4()).upper()
            entry = await self._async_add(image_id, data, width, height, digest)
        return self._upload_reply(image_id, entry)

    async def async_put(self, raw_id: Any, data: bytes) -> str:
        """Keep a phone's photo under its own id. Returns ``"stored"``, or
        ``"exists"`` when that id is already stored or is a built-in id: the
        bytes are not compared, the first write wins."""
        self._check_available()
        image_id = self._check_id(raw_id)
        if is_preset(image_id) or image_id in self._index:
            return "exists"
        width, height = self._check_bytes(data)
        digest = hashlib.sha256(data).hexdigest()
        async with self._lock:
            if image_id in self._index:
                return "exists"
            await self._async_add(image_id, data, width, height, digest)
        return "stored"

    async def async_delete(self, raw_id: Any) -> str:
        """Delete a custom photo no page names. Returns the id as stored.

        ``invalid`` for a built-in id, ``not_found`` for one not stored,
        ``in_use`` while a page names it, and ``unavailable`` while some
        owner's pages could not be read, since they may name it.
        """
        self._check_available()
        image_id = self._check_id(raw_id)
        if is_preset(image_id):
            raise PageImagesInvalidError("a built-in photo cannot be deleted")
        async with self._lock:
            if image_id not in self._index:
                raise PageImagesNotFoundError(f"there is no photo {image_id}")
            used, complete = self._usage()
            if used.get(image_id):
                raise PageImagesInUseError(
                    f"photo {image_id} is on a page of {', '.join(used[image_id])}"
                )
            if not complete:
                raise PageImagesUnavailableError(
                    "some watches' pages could not be read, so they may use this photo"
                )
            del self._index[image_id]
            self._schedule_save()
            await self._hass.async_add_executor_job(self._unlink, [f"{image_id}.jpg"])
        _LOGGER.debug("Deleted page photo %s", image_id)
        return image_id

    @staticmethod
    def _check_bytes(data: bytes) -> tuple[int, int]:
        try:
            return check_jpeg(data)
        except PageImageInvalid as err:
            raise _rule_error(err) from err

    @staticmethod
    def _upload_reply(image_id: str, entry: dict[str, Any]) -> dict[str, Any]:
        return {
            "image_id": image_id,
            "width": entry["width"],
            "height": entry["height"],
            "bytes": entry["bytes"],
        }

    async def _async_add(
        self, image_id: str, data: bytes, width: int, height: int, digest: str
    ) -> dict[str, Any]:
        """Write the file, then the entry. Called with the lock held. A new
        photo no page names yet starts its grace now."""
        if len(self._index) >= MAX_CUSTOM_IMAGES:
            raise PageImagesFullError(
                f"the home holds {MAX_CUSTOM_IMAGES} photos; delete some first"
            )
        path = self._dir / f"{image_id}.jpg"

        def write() -> None:
            self._dir.mkdir(parents=True, exist_ok=True)
            # Written beside and moved over, so a reader never sees half a file.
            partial = path.with_suffix(".tmp")
            partial.write_bytes(data)
            os.replace(partial, path)

        await self._hass.async_add_executor_job(write)
        now = _iso(_utcnow())
        used, _complete = self._usage()
        entry = {
            "bytes": len(data),
            "width": width,
            "height": height,
            "sha256": digest,
            "added_at": now,
            "unused_since": None if used.get(image_id) else now,
        }
        self._index[image_id] = entry
        self._schedule_save()
        return entry

    # ── the sweep ──────────────────────────────────────────────────────

    @callback
    def pages_changed(self, change: Any) -> None:
        """The watch config store's listener: sweep after any ``pages``
        write, whoever made it. Every other kind is left alone."""
        if getattr(change, "kind", None) == "pages":
            self.sweep()

    @callback
    def sweep(self, now: datetime | None = None) -> tuple[str, ...]:
        """Mark, clear and delete by :func:`page_images.plan_sweep`. Returns
        the ids deleted. The index changes at once; the files go after, under
        the lock, each only if its id is still not stored."""
        if self._load_failed or self._pages is None:
            return ()
        moment = now or _utcnow()
        used, complete = self._usage()
        plan = plan_sweep(
            {image_id: entry["unused_since"] for image_id, entry in self._index.items()},
            used,
            moment,
            complete=complete,
        )
        if not (plan.stamp or plan.clear or plan.delete):
            return ()
        stamp = _iso(moment)
        for image_id in plan.stamp:
            self._index[image_id]["unused_since"] = stamp
        for image_id in plan.clear:
            self._index[image_id]["unused_since"] = None
        for image_id in plan.delete:
            del self._index[image_id]
        self._schedule_save()
        if plan.delete:
            _LOGGER.info(
                "Deleted %d page photo(s) no page has named for over seven days",
                len(plan.delete),
            )
            self._hass.async_create_task(
                self._async_unlink_swept(plan.delete),
                name="wrist_assistant_page_images_sweep",
            )
        return plan.delete

    async def _async_unlink_swept(self, image_ids: tuple[str, ...]) -> None:
        async with self._lock:
            names = [f"{image_id}.jpg" for image_id in image_ids if image_id not in self._index]
            if names:
                await self._hass.async_add_executor_job(self._unlink, names)

