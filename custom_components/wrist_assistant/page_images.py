"""The rules for page photos, with no Home Assistant in them.

Step 4d batch 6 (``docs/pages_in_home_assistant_step4.md`` in the app repo),
and photo tiles (``docs/photo_tiles_plan_2026-10.md`` there, "Contract").
The store in ``page_images_store.py`` keeps the photos; this module only
decides: which ids are photos at all, whether some bytes are a JPEG or a PNG
the watch can draw and how big it is, what a photo's ``kind``, ``label`` and
``entity_id`` may be, which photos the pages name, and what a sweep does with
the ones they no longer name.

A page names its background photo as ``backgroundImageId``, and a tile in
``page.items`` names its photo as ``iconPhotoId``. Both come from the one
store, in one id space. A custom photo's id is the UUID the phone or the
panel made for it, which the phone writes in upper case; it is compared
without case and kept in upper case here. A built-in photo's id is one of the
``preset_*`` ids the phone offers, whose pixels ship with the integration
(``page_image_presets/``).
"""

from __future__ import annotations

import re
from collections.abc import Iterable, Mapping
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any

# The built-in photos the phone's page editor offers, in its order
# (``presetBackgroundImages`` in PageEditorView.swift). ``preset_stars`` is in
# the phone's asset catalog but never offered, so it is not here either.
PRESET_IDS: tuple[str, ...] = (
    "preset_waves",
    "preset_sand",
    "preset_ocean",
    "preset_aurora",
    "preset_fern",
    "preset_cloudy_sea",
    "preset_foggy_forest",
    "preset_ferns_dark",
    "preset_mountain_lake",
    "preset_neon_swirl",
    "preset_snow_twilight",
    "preset_forest_canopy",
    "preset_sand_dunes",
    "preset_dark_rock",
    "preset_neon_red_blue",
)
_PRESETS = frozenset(PRESET_IDS)

# What the phone sends today is at most 55,000 bytes and 416 px on its
# longest side, and the panel scales to 512 px and 200 KB. These leave room
# for both without letting a photo grow past what a watch should hold.
MAX_IMAGE_BYTES = 256 * 1024
MIN_SIDE = 16
MAX_SIDE = 1024
MAX_CUSTOM_IMAGES = 500
# How long a photo no page names is kept. It covers an upload whose page save
# has not happened yet, and the panel's undo after a photo was taken off.
UNUSED_GRACE = timedelta(days=7)
# How long an icon photo no tile names is kept. A photo sent from the phone
# waits until someone opens the panel and puts it on a tile, which can take a
# while longer than an upload made in the panel itself.
UNUSED_ICON_GRACE = timedelta(days=30)

# What a photo is for. A photo stored before photo tiles has no kind and
# reads as a background.
KIND_BACKGROUND = "background"
KIND_ICON = "icon"
KINDS = (KIND_BACKGROUND, KIND_ICON)
# The formats a photo may be stored in, each with its file extension and the
# content type it is served with. A photo stored before photo tiles has no
# format and reads as a JPEG.
FORMAT_JPEG = "jpeg"
FORMAT_PNG = "png"
EXTENSIONS = {FORMAT_JPEG: "jpg", FORMAT_PNG: "png"}
CONTENT_TYPES = {FORMAT_JPEG: "image/jpeg", FORMAT_PNG: "image/png"}
# A photo's label (the tile name the phone made it for) is short text.
MAX_LABEL_CHARS = 60

_UUID_RE = re.compile(
    r"[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}"
)
# An entity id as Home Assistant shapes one: a domain and an object id of
# lower case letters, digits and underscores, joined by one dot.
_ENTITY_ID_RE = re.compile(r"[a-z0-9_]+\.[a-z0-9_]+")
_JPEG_MAGIC = b"\xff\xd8\xff"
# The PNG signature, then the first chunk, which must be ``IHDR``: its length
# (4 bytes, 13), its type (4), then width and height, each a big endian
# 32 bit number, at bytes 16 and 20 of the file.
_PNG_MAGIC = b"\x89PNG\r\n\x1a\n"
_PNG_IHDR = b"\x00\x00\x00\x0dIHDR"
# Start of frame markers: baseline, extended, progressive and lossless, in
# their Huffman and arithmetic forms. C4 (DHT), C8 (JPG) and CC (DAC) sit in
# the same range and are not frames.
_SOF_MARKERS = frozenset(
    (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF)
)
# Markers that stand alone, with no length after them.
_STANDALONE = frozenset((0x01, *range(0xD0, 0xD8)))


class PageImageInvalid(Exception):
    """Something about a photo or its id breaks the rules. ``code`` is the
    stable reason the WebSocket and the ops send back."""

    code = "invalid"

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class PageImageTooLarge(PageImageInvalid):
    code = "too_large"


def is_preset(image_id: str) -> bool:
    return image_id in _PRESETS


def normalize_id(raw: Any) -> str | None:
    """The id as stored (a built-in id as it is, a UUID in upper case), or
    None when ``raw`` is neither."""
    if not isinstance(raw, str):
        return None
    if raw in _PRESETS:
        return raw
    folded = raw.upper()
    if _UUID_RE.fullmatch(folded):
        return folded
    return None


def check_id(raw: Any) -> str:
    """:func:`normalize_id`, refusing anything that is not a photo id."""
    image_id = normalize_id(raw)
    if image_id is None:
        raise PageImageInvalid(
            "image_id must be a UUID or one of the built-in preset ids"
        )
    return image_id


def check_kind(raw: Any) -> str:
    """A photo's ``kind`` as stored: ``"background"`` when absent (None),
    else ``"background"`` or ``"icon"`` as sent, anything else refused."""
    if raw is None:
        return KIND_BACKGROUND
    if raw not in KINDS:
        raise PageImageInvalid('kind must be "background" or "icon"')
    return raw


def check_label(raw: Any) -> str | None:
    """A photo's ``label`` as stored: the text with its ends trimmed, or None
    when absent or empty. Text over 60 characters once trimmed, or anything
    that is not text, is refused."""
    if raw is None:
        return None
    if not isinstance(raw, str):
        raise PageImageInvalid("label must be a string")
    label = raw.strip()
    if len(label) > MAX_LABEL_CHARS:
        raise PageImageInvalid(f"label is at most {MAX_LABEL_CHARS} characters")
    return label or None


def check_entity_id(raw: Any) -> str | None:
    """A photo's ``entity_id`` as stored, or None when absent. Anything not
    shaped like an entity id (``light.desk_lamp``) is refused. Whether the
    entity exists is not checked: it may be renamed or removed later anyway,
    and the id only puts the photo first among a tile's choices."""
    if raw is None:
        return None
    if not isinstance(raw, str) or not _ENTITY_ID_RE.fullmatch(raw):
        raise PageImageInvalid("entity_id must be an entity id, like light.desk_lamp")
    return raw


def jpeg_size(data: bytes) -> tuple[int, int] | None:
    """(width, height) from the JPEG's start of frame marker, or None when
    the bytes are not a JPEG this can read.

    Walks the marker segments from the start: each is ``FF``, the marker,
    then a two byte big endian length that counts itself. The frame header
    is precision (1 byte), height (2), width (2). Reaching the scan (``DA``)
    or the end (``D9``) before a frame means there is none to read.
    """
    if not data.startswith(_JPEG_MAGIC):
        return None
    i = 2
    end = len(data)
    while i < end:
        if data[i] != 0xFF:
            return None
        # Any number of FF fill bytes may sit before a marker.
        while i < end and data[i] == 0xFF:
            i += 1
        if i >= end:
            return None
        marker = data[i]
        i += 1
        if marker in _STANDALONE:
            continue
        if marker in (0xD8, 0xD9, 0xDA):
            return None
        if i + 2 > end:
            return None
        length = int.from_bytes(data[i : i + 2], "big")
        if length < 2 or i + length > end:
            return None
        if marker in _SOF_MARKERS:
            if length < 7:
                return None
            height = int.from_bytes(data[i + 3 : i + 5], "big")
            width = int.from_bytes(data[i + 5 : i + 7], "big")
            return width, height
        i += length
    return None


def png_size(data: bytes) -> tuple[int, int] | None:
    """(width, height) from the PNG's ``IHDR`` chunk, or None when the bytes
    are not a PNG whose first chunk is a whole ``IHDR`` header. Only the
    header is read: the image data after it is the device's to decode."""
    if not data.startswith(_PNG_MAGIC) or len(data) < 24:
        return None
    if data[8:16] != _PNG_IHDR:
        return None
    width = int.from_bytes(data[16:20], "big")
    height = int.from_bytes(data[20:24], "big")
    return width, height


def _check_sides(width: int, height: int) -> None:
    if not (MIN_SIDE <= width <= MAX_SIDE and MIN_SIDE <= height <= MAX_SIDE):
        raise PageImageInvalid(
            f"a photo is {MIN_SIDE} to {MAX_SIDE} px on each side, this one is "
            f"{width} by {height}"
        )


def check_jpeg(data: bytes) -> tuple[int, int]:
    """(width, height) of a JPEG the store may keep, or a refusal: over
    256 KiB is ``too_large``; not a JPEG, no readable frame, or a side under
    16 or over 1024 px is ``invalid``. The built-in photos are read by this
    one, since they are all JPEGs."""
    if len(data) > MAX_IMAGE_BYTES:
        raise PageImageTooLarge(f"a photo is at most {MAX_IMAGE_BYTES // 1024} KB")
    if not data.startswith(_JPEG_MAGIC):
        raise PageImageInvalid("a photo must be a JPEG")
    size = jpeg_size(data)
    if size is None:
        raise PageImageInvalid("the JPEG has no frame header that can be read")
    _check_sides(*size)
    return size


def check_image(data: bytes) -> tuple[str, int, int]:
    """(format, width, height) of a photo the store may keep, a JPEG or a
    PNG, or a refusal. The limits are the same for both: over 256 KiB is
    ``too_large``; neither format, a JPEG with no readable frame, a PNG with
    no whole ``IHDR`` chunk first, or a side under 16 or over 1024 px is
    ``invalid``."""
    if len(data) > MAX_IMAGE_BYTES:
        raise PageImageTooLarge(f"a photo is at most {MAX_IMAGE_BYTES // 1024} KB")
    if data.startswith(_PNG_MAGIC):
        size = png_size(data)
        if size is None:
            raise PageImageInvalid("the PNG has no IHDR header that can be read")
        _check_sides(*size)
        return (FORMAT_PNG, *size)
    if not data.startswith(_JPEG_MAGIC):
        raise PageImageInvalid("a photo must be a JPEG or a PNG")
    return (FORMAT_JPEG, *check_jpeg(data))


def content_type(data: bytes) -> str:
    """The content type a photo's bytes are served with: ``image/png`` for a
    PNG, ``image/jpeg`` for anything else, as every photo was before PNG."""
    return CONTENT_TYPES[FORMAT_PNG if data.startswith(_PNG_MAGIC) else FORMAT_JPEG]


def ids_in_pages(document: Any) -> set[str]:
    """Every photo id a ``pages`` document names, normalized: each page's
    ``backgroundImageId`` and each tile's ``iconPhotoId`` in its ``items``.
    Hidden pages count: they are still the owner's pages. An id that is
    neither a UUID nor a built-in id is left out, since no photo could ever
    be stored under it. Tile groups hold no tiles, so only ``items`` is read.
    """
    found: set[str] = set()
    pages = document.get("pages") if isinstance(document, dict) else None
    if not isinstance(pages, list):
        return found
    for page in pages:
        if not isinstance(page, dict):
            continue
        image_id = normalize_id(page.get("backgroundImageId"))
        if image_id is not None:
            found.add(image_id)
        items = page.get("items")
        for item in items if isinstance(items, list) else ():
            if not isinstance(item, dict):
                continue
            photo_id = normalize_id(item.get("iconPhotoId"))
            if photo_id is not None:
                found.add(photo_id)
    return found


def usage(documents: Mapping[str, Any]) -> dict[str, list[str]]:
    """Photo id to the owners whose pages name it, sorted, from each owner's
    ``pages`` document."""
    used: dict[str, set[str]] = {}
    for owner, document in documents.items():
        for image_id in ids_in_pages(document):
            used.setdefault(image_id, set()).add(owner)
    return {image_id: sorted(owners) for image_id, owners in used.items()}


@dataclass(frozen=True)
class SweepPlan:
    """What a sweep changes: ids to mark unused now, ids back in use, and
    ids unused for longer than the grace, to delete."""

    stamp: tuple[str, ...]
    clear: tuple[str, ...]
    delete: tuple[str, ...]


def parse_time(value: Any) -> datetime | None:
    if not isinstance(value, str) or not value:
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    return parsed if parsed.tzinfo is not None else None


def plan_sweep(
    unused_since: Mapping[str, str | None],
    in_use: Iterable[str],
    now: datetime,
    *,
    complete: bool,
    grace: timedelta = UNUSED_GRACE,
    icons: Iterable[str] = (),
    icon_grace: timedelta = UNUSED_ICON_GRACE,
) -> SweepPlan:
    """Decide a sweep over the stored custom photos.

    ``unused_since`` is each stored id's mark (None while in use).
    ``complete`` says whether every owner's pages could be read. When one
    could not, its photos look unused without being so, so only the clearing
    half runs: nothing is marked and nothing is deleted. A mark that cannot be
    read counts as made now, so a damaged index never deletes at once.
    ``icons`` are the stored ids whose kind is ``icon``: they are kept for
    ``icon_grace`` once unused, every other photo for ``grace``.
    """
    used = set(in_use)
    icon_ids = set(icons)
    stamp: list[str] = []
    clear: list[str] = []
    delete: list[str] = []
    for image_id, since in sorted(unused_since.items()):
        if image_id in used:
            if since is not None:
                clear.append(image_id)
            continue
        if not complete:
            continue
        marked = parse_time(since)
        if marked is None:
            stamp.append(image_id)
        elif now - marked > (icon_grace if image_id in icon_ids else grace):
            delete.append(image_id)
    return SweepPlan(tuple(stamp), tuple(clear), tuple(delete))
