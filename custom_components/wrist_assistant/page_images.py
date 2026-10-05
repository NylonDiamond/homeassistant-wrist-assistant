"""The rules for page background photos, with no Home Assistant in them.

Step 4d batch 6 (``docs/pages_in_home_assistant_step4.md`` in the app repo).
The store in ``page_images_store.py`` keeps the photos; this module only
decides: which ids are photos at all, whether some bytes are a JPEG the watch
can draw and how big it is, which photos the pages name, and what a sweep
does with the ones they no longer name.

A page names its photo as ``backgroundImageId``. A custom photo's id is the
UUID the phone or the panel made for it, which the phone writes in upper case;
it is compared without case and kept in upper case here. A built-in photo's
id is one of the ``preset_*`` ids the phone offers, whose pixels ship with
the integration (``page_image_presets/``).
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

_UUID_RE = re.compile(
    r"[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}"
)
_JPEG_MAGIC = b"\xff\xd8\xff"
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


def check_jpeg(data: bytes) -> tuple[int, int]:
    """(width, height) of a photo the store may keep, or a refusal: over
    256 KiB is ``too_large``; not a JPEG, no readable frame, or a side under
    16 or over 1024 px is ``invalid``."""
    if len(data) > MAX_IMAGE_BYTES:
        raise PageImageTooLarge(f"a photo is at most {MAX_IMAGE_BYTES // 1024} KB")
    if not data.startswith(_JPEG_MAGIC):
        raise PageImageInvalid("a photo must be a JPEG")
    size = jpeg_size(data)
    if size is None:
        raise PageImageInvalid("the JPEG has no frame header that can be read")
    width, height = size
    if not (MIN_SIDE <= width <= MAX_SIDE and MIN_SIDE <= height <= MAX_SIDE):
        raise PageImageInvalid(
            f"a photo is {MIN_SIDE} to {MAX_SIDE} px on each side, this one is "
            f"{width} by {height}"
        )
    return width, height


def ids_in_pages(document: Any) -> set[str]:
    """Every photo id a ``pages`` document names, normalized. Hidden pages
    count: they are still the owner's pages. An id that is neither a UUID nor
    a built-in id is left out, since no photo could ever be stored under it."""
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
) -> SweepPlan:
    """Decide a sweep over the stored custom photos.

    ``unused_since`` is each stored id's mark (None while in use).
    ``complete`` says whether every owner's pages could be read. When one
    could not, its photos look unused without being so, so only the clearing
    half runs: nothing is marked and nothing is deleted. A mark that cannot be
    read counts as made now, so a damaged index never deletes at once.
    """
    used = set(in_use)
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
        elif now - marked > grace:
            delete.append(image_id)
    return SweepPlan(tuple(stamp), tuple(clear), tuple(delete))
