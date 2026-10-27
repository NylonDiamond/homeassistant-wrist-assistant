"""Unit tests for ``page_images.py``, the rules of the page background photos.

Pure: the module imports nothing from Home Assistant, so it is loaded on its
own. Covered: which ids are photo ids and how they fold, the JPEG check and
its frame header read (every built-in photo the integration ships among the
cases, against the sizes macOS reads), the PNG check and its ``IHDR`` read,
the content type each is served with, a photo's kind, label and entity id,
which ids a pages document names (backgrounds and tile photos), and every row
of the sweep's decision, the icon photo's longer grace included.
"""

from __future__ import annotations

import importlib.util
import json
import struct
import sys
import zlib
from datetime import UTC, datetime, timedelta
from pathlib import Path

import pytest

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_PRESETS = _PKG_DIR / "page_image_presets"


def _load():
    spec = importlib.util.spec_from_file_location("wa_page_images_rules", _PKG_DIR / "page_images.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


rules = _load()

UUID_UPPER = "0F8E9C2A-1B3D-4E5F-8A7B-6C5D4E3F2A1B"


def jpeg(width: int = 300, height: int = 400, *, sof: int = 0xC0, pad: int = 0, extra: bytes = b"") -> bytes:
    """A minimal JPEG: SOI, an APP0 segment, a quantization table, the frame
    header, then a scan and the end. Only the markers matter here."""
    app0 = b"\xff\xe0" + struct.pack(">H", 16) + b"JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00"
    dqt = b"\xff\xdb" + struct.pack(">H", 67) + b"\x00" + bytes(64)
    frame = b"\xff" + bytes([sof]) + struct.pack(">HBHHB", 11, 8, height, width, 1) + b"\x01\x11\x00"
    sos = b"\xff\xda" + struct.pack(">H", 8) + b"\x01\x01\x00\x00\x3f\x00"
    return b"\xff\xd8" + app0 + extra + dqt + b"\xff" * pad + frame + sos + bytes(pad) + b"\xff\xd9"


def png(width: int = 200, height: int = 300, *, pad: int = 0) -> bytes:
    """A minimal PNG: the signature, a whole ``IHDR`` chunk (8 bit RGBA), an
    empty ``IDAT`` and ``IEND``. Only the header matters here; ``pad`` bytes
    of a private chunk make it bigger."""

    def chunk(kind: bytes, body: bytes) -> bytes:
        return struct.pack(">I", len(body)) + kind + body + struct.pack(">I", zlib.crc32(kind + body))

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    filler = chunk(b"prVt", bytes(pad)) if pad else b""
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + filler + chunk(b"IDAT", b"") + chunk(b"IEND", b"")


# ── ids ──────────────────────────────────────────────────────────────────


def test_the_presets_are_the_fifteen_the_phone_offers_in_its_order() -> None:
    assert len(rules.PRESET_IDS) == 15
    assert "preset_stars" not in rules.PRESET_IDS
    listed = json.loads((_PRESETS / "presets.json").read_text())
    assert [item["id"] for item in listed] == list(rules.PRESET_IDS)
    assert [item["name"] for item in listed] == [
        "Waves", "Sand", "Ocean", "Aurora", "Fern", "Cloudy Sea", "Fog", "Ferns",
        "Lake", "Neon", "Twilight", "Canopy", "Dunes", "Rock", "Glow",
    ]
    assert all(set(item) == {"id", "name"} for item in listed)


def test_every_preset_ships_as_a_jpeg_and_nothing_else_is_in_the_folder() -> None:
    files = sorted(p.name for p in _PRESETS.iterdir())
    assert files == sorted([f"{i}.jpg" for i in rules.PRESET_IDS] + ["presets.json"])


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        (UUID_UPPER, UUID_UPPER),
        (UUID_UPPER.lower(), UUID_UPPER),
        ("preset_waves", "preset_waves"),
        ("preset_neon_red_blue", "preset_neon_red_blue"),
        ("PRESET_WAVES", None),
        ("preset_stars", None),
        ("preset_bg_waves", None),
        ("0F8E9C2A1B3D4E5F8A7B6C5D4E3F2A1B", None),
        ("{0F8E9C2A-1B3D-4E5F-8A7B-6C5D4E3F2A1B}", None),
        (UUID_UPPER + " ", None),
        ("../etc/passwd", None),
        ("", None),
        (None, None),
        (7, None),
    ],
)
def test_normalize_id(raw, expected) -> None:
    assert rules.normalize_id(raw) == expected
    if expected is None:
        with pytest.raises(rules.PageImageInvalid) as err:
            rules.check_id(raw)
        assert err.value.code == "invalid"
    else:
        assert rules.check_id(raw) == expected


# ── the JPEG check ───────────────────────────────────────────────────────


@pytest.mark.parametrize("sof", [0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC7, 0xC9, 0xCB, 0xCD, 0xCF])
def test_the_size_comes_from_any_frame_marker(sof) -> None:
    assert rules.jpeg_size(jpeg(321, 123, sof=sof)) == (321, 123)


def test_fill_bytes_and_restart_markers_before_the_frame_are_skipped() -> None:
    assert rules.jpeg_size(jpeg(64, 32, pad=3, extra=b"\xff\xd0")) == (64, 32)


@pytest.mark.parametrize(
    "data",
    [
        b"",
        b"\x89PNG\r\n\x1a\n",
        b"\xff\xd8\xff",
        b"\xff\xd8\xff\xd9",
        # A scan before any frame.
        b"\xff\xd8\xff\xda\x00\x08" + bytes(6),
        # A segment longer than the bytes.
        b"\xff\xd8\xff\xe0\x10\x00",
        # A length under 2.
        b"\xff\xd8\xff\xe0\x00\x01",
        # A frame header cut short.
        b"\xff\xd8\xff\xc0\x00\x05\x08\x00\x10",
        # Garbage where a marker should be.
        b"\xff\xd8\x00\x00",
        # DHT is in the frame range and is not a frame.
        b"\xff\xd8\xff\xc4\x00\x02\xff\xd9",
    ],
)
def test_bytes_with_no_readable_frame_have_no_size(data) -> None:
    assert rules.jpeg_size(data) is None


def test_check_jpeg_answers_the_size() -> None:
    assert rules.check_jpeg(jpeg(416, 416)) == (416, 416)
    assert rules.check_jpeg(jpeg(16, 1024)) == (16, 1024)


@pytest.mark.parametrize(
    ("data", "code"),
    [
        (b"\x89PNG\r\n\x1a\n" + bytes(64), "invalid"),
        (jpeg(15, 400), "invalid"),
        (jpeg(400, 1025), "invalid"),
        (jpeg(0, 400), "invalid"),
        (b"\xff\xd8\xff\xd9", "invalid"),
        (jpeg() + bytes(256 * 1024), "too_large"),
    ],
)
def test_check_jpeg_refusals(data, code) -> None:
    with pytest.raises(rules.PageImageInvalid) as err:
        rules.check_jpeg(data)
    assert err.value.code == code


def test_a_photo_at_the_cap_is_kept() -> None:
    data = jpeg()
    data = data[:-2] + bytes(256 * 1024 - len(data)) + b"\xff\xd9"
    assert len(data) == 256 * 1024
    assert rules.check_jpeg(data) == (300, 400)


# The sizes macOS reads (sips) for the files copied from the phone's assets.
_PRESET_SIZES = {
    "preset_waves": (314, 416),
    "preset_sand": (257, 416),
    "preset_ocean": (624, 416),
    "preset_aurora": (624, 416),
    "preset_fern": (308, 416),
    "preset_cloudy_sea": (554, 416),
    "preset_foggy_forest": (624, 416),
    "preset_ferns_dark": (624, 416),
    "preset_mountain_lake": (672, 416),
    "preset_neon_swirl": (624, 416),
    "preset_snow_twilight": (623, 416),
    "preset_forest_canopy": (234, 416),
    "preset_sand_dunes": (277, 416),
    "preset_dark_rock": (312, 416),
    "preset_neon_red_blue": (277, 416),
}


@pytest.mark.parametrize("image_id", list(_PRESET_SIZES))
def test_every_shipped_preset_passes_the_check_at_its_real_size(image_id) -> None:
    data = (_PRESETS / f"{image_id}.jpg").read_bytes()
    assert rules.check_jpeg(data) == _PRESET_SIZES[image_id]
    assert rules.check_image(data) == ("jpeg", *_PRESET_SIZES[image_id])


# ── the PNG check, and either format ─────────────────────────────────────


def test_the_png_size_comes_from_its_ihdr_chunk() -> None:
    assert rules.png_size(png(321, 123)) == (321, 123)
    # The width and height are 32 bit big endian at bytes 16 and 20.
    data = png(1024, 16)
    assert int.from_bytes(data[16:20], "big") == 1024
    assert int.from_bytes(data[20:24], "big") == 16
    assert rules.png_size(data) == (1024, 16)


_GOOD_PNG = png(64, 64)


@pytest.mark.parametrize(
    "data",
    [
        b"",
        b"\x89PNG\r\n\x1a\n",
        # Cut off inside the header.
        _GOOD_PNG[:23],
        # The first chunk is not IHDR.
        _GOOD_PNG[:12] + b"IDAT" + _GOOD_PNG[16:],
        # IHDR with a length other than 13.
        _GOOD_PNG[:8] + struct.pack(">I", 12) + _GOOD_PNG[12:],
        # A JPEG is not a PNG.
        jpeg(),
    ],
)
def test_bytes_with_no_readable_ihdr_have_no_png_size(data) -> None:
    assert rules.png_size(data) is None


def test_check_image_answers_the_format_and_the_size() -> None:
    assert rules.check_image(png(384, 200)) == ("png", 384, 200)
    assert rules.check_image(png(16, 1024)) == ("png", 16, 1024)
    assert rules.check_image(jpeg(416, 300)) == ("jpeg", 416, 300)


@pytest.mark.parametrize(
    ("data", "code"),
    [
        (_GOOD_PNG[:23], "invalid"),
        (_GOOD_PNG[:12] + b"IDAT" + _GOOD_PNG[16:], "invalid"),
        (_GOOD_PNG[:8] + struct.pack(">I", 12) + _GOOD_PNG[12:], "invalid"),
        (png(15, 400), "invalid"),
        (png(400, 1025), "invalid"),
        (png(0, 0), "invalid"),
        (png(2**31, 64), "invalid"),
        (png(pad=256 * 1024), "too_large"),
        (jpeg(15, 400), "invalid"),
        (jpeg() + bytes(256 * 1024), "too_large"),
        (b"GIF89a" + bytes(64), "invalid"),
        (b"", "invalid"),
    ],
)
def test_check_image_refusals(data, code) -> None:
    with pytest.raises(rules.PageImageInvalid) as err:
        rules.check_image(data)
    assert err.value.code == code


def test_a_png_at_the_cap_is_kept_and_one_byte_more_is_too_large() -> None:
    base = len(png())
    # A private chunk adds 12 bytes around its body.
    at_cap = png(pad=256 * 1024 - base - 12)
    assert len(at_cap) == 256 * 1024
    assert rules.check_image(at_cap) == ("png", 200, 300)
    with pytest.raises(rules.PageImageTooLarge):
        rules.check_image(png(pad=256 * 1024 - base - 11))


def test_a_png_is_served_as_a_png_and_anything_else_as_a_jpeg() -> None:
    assert rules.content_type(png()) == "image/png"
    assert rules.content_type(jpeg()) == "image/jpeg"
    assert rules.content_type((_PRESETS / "preset_waves.jpg").read_bytes()) == "image/jpeg"
    assert rules.EXTENSIONS == {"jpeg": "jpg", "png": "png"}


# ── a photo's kind, label and entity id ──────────────────────────────────


@pytest.mark.parametrize(("raw", "expected"), [(None, "background"), ("background", "background"), ("icon", "icon")])
def test_check_kind(raw, expected) -> None:
    assert rules.check_kind(raw) == expected


@pytest.mark.parametrize("raw", ["Icon", "", "photo", "tile", 1, True, ["icon"]])
def test_check_kind_refusals(raw) -> None:
    with pytest.raises(rules.PageImageInvalid) as err:
        rules.check_kind(raw)
    assert err.value.code == "invalid"


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        (None, None),
        ("Desk lamp", "Desk lamp"),
        ("  Desk lamp \n", "Desk lamp"),
        ("", None),
        ("   ", None),
        ("x" * 60, "x" * 60),
        ("  " + "x" * 60 + "  ", "x" * 60),
        ("Café ☕", "Café ☕"),
    ],
)
def test_check_label(raw, expected) -> None:
    assert rules.check_label(raw) == expected


@pytest.mark.parametrize("raw", ["x" * 61, 7, True, ["Lamp"], {"name": "Lamp"}])
def test_check_label_refusals(raw) -> None:
    with pytest.raises(rules.PageImageInvalid) as err:
        rules.check_label(raw)
    assert err.value.code == "invalid"


@pytest.mark.parametrize("raw", ["light.desk_lamp", "fan.bedroom", "switch.coffee_machine_2", "sensor.a"])
def test_check_entity_id(raw) -> None:
    assert rules.check_entity_id(raw) == raw
    assert rules.check_entity_id(None) is None


@pytest.mark.parametrize(
    "raw",
    ["", "light", "light.", ".lamp", "Light.Lamp", "light.desk lamp", "light.desk.lamp", "light-x.lamp", 3, True],
)
def test_check_entity_id_refusals(raw) -> None:
    with pytest.raises(rules.PageImageInvalid) as err:
        rules.check_entity_id(raw)
    assert err.value.code == "invalid"


# ── what pages name ──────────────────────────────────────────────────────


def test_ids_in_pages_reads_every_page_hidden_ones_included() -> None:
    document = {
        "pages": [
            {"id": "p1", "backgroundImageId": UUID_UPPER.lower()},
            {"id": "p2", "isHidden": True, "backgroundImageId": "preset_sand"},
            {"id": "p3"},
            {"id": "p4", "backgroundImageId": "not-a-photo"},
            {"id": "p5", "backgroundImageId": None},
            "junk",
        ]
    }
    assert rules.ids_in_pages(document) == {UUID_UPPER, "preset_sand"}


@pytest.mark.parametrize("document", [None, {}, {"pages": "x"}, [], {"pages": [1, 2]}])
def test_ids_in_pages_of_anything_else_is_empty(document) -> None:
    assert rules.ids_in_pages(document) == set()


ICON_UUID = "A1B2C3D4-E5F6-4A7B-8C9D-0E1F2A3B4C5D"
OTHER_ICON_UUID = "99999999-8888-4777-8666-555555555555"


def test_ids_in_pages_reads_each_tiles_photo_too() -> None:
    document = {
        "pages": [
            {
                "id": "p1",
                "backgroundImageId": UUID_UPPER,
                "items": [
                    {"id": "t1", "entityId": "light.lamp", "iconPhotoId": ICON_UUID.lower()},
                    {"id": "t2", "entityId": "fan.desk"},
                    {"id": "t3", "entityId": "fan.desk", "iconPhotoId": None},
                    {"id": "t4", "entityId": "fan.desk", "iconPhotoId": "not-a-photo"},
                    {"id": "t5", "entityId": "fan.desk", "iconPhotoId": 7},
                    "junk",
                ],
            },
            {"id": "p2", "isHidden": True, "items": [{"id": "t", "iconPhotoId": OTHER_ICON_UUID}]},
            {"id": "p3", "items": "not a list"},
            # A tile group holds no tiles, so a photo id there is not a use.
            {"id": "p4", "tileGroups": [{"id": "g", "iconPhotoId": "12345678-1234-4234-8234-123456789012"}]},
        ]
    }
    assert rules.ids_in_pages(document) == {UUID_UPPER, ICON_UUID, OTHER_ICON_UUID}


def test_usage_lists_the_owners_of_each_photo_sorted() -> None:
    def page(image_id: str) -> dict:
        return {"pages": [{"id": "p", "backgroundImageId": image_id}]}

    assert rules.usage(
        {"watch-B": page(UUID_UPPER), "watch-A": page(UUID_UPPER.lower()), "watch-C": page("preset_fern")}
    ) == {UUID_UPPER: ["watch-A", "watch-B"], "preset_fern": ["watch-C"]}


def test_usage_counts_a_tiles_photo() -> None:
    def tile(photo_id: str) -> dict:
        return {"pages": [{"id": "p", "items": [{"id": "t", "entityId": "light.x", "iconPhotoId": photo_id}]}]}

    assert rules.usage(
        {"watch-B": tile(ICON_UUID), "watch-A": tile(ICON_UUID.lower()), "watch-C": {"pages": [{"id": "p", "backgroundImageId": ICON_UUID}]}}
    ) == {ICON_UUID: ["watch-A", "watch-B", "watch-C"]}


# ── the sweep's decision ─────────────────────────────────────────────────

NOW = datetime(2026, 10, 5, 12, 0, tzinfo=UTC)


def _iso(moment: datetime) -> str:
    return moment.isoformat().replace("+00:00", "Z")


def test_plan_sweep_rows() -> None:
    marks = {
        "IN-USE-MARKED": _iso(NOW - timedelta(days=30)),
        "IN-USE-CLEAN": None,
        "NEWLY-UNUSED": None,
        "INSIDE-GRACE": _iso(NOW - timedelta(days=7)),
        "PAST-GRACE": _iso(NOW - timedelta(days=7, seconds=1)),
        "DAMAGED-MARK": "yesterday",
        "NAIVE-MARK": "2026-01-01T00:00:00",
    }
    plan = rules.plan_sweep(marks, {"IN-USE-MARKED", "IN-USE-CLEAN", "SOMETHING-ELSE"}, NOW, complete=True)
    assert plan.clear == ("IN-USE-MARKED",)
    assert plan.stamp == ("DAMAGED-MARK", "NAIVE-MARK", "NEWLY-UNUSED")
    assert plan.delete == ("PAST-GRACE",)


def test_plan_sweep_with_unread_pages_only_clears() -> None:
    marks = {
        "IN-USE-MARKED": _iso(NOW - timedelta(days=1)),
        "NEWLY-UNUSED": None,
        "PAST-GRACE": _iso(NOW - timedelta(days=30)),
    }
    plan = rules.plan_sweep(marks, {"IN-USE-MARKED"}, NOW, complete=False)
    assert plan == rules.SweepPlan(stamp=(), clear=("IN-USE-MARKED",), delete=())


def test_plan_sweep_of_nothing_changes_nothing() -> None:
    assert rules.plan_sweep({}, {"A"}, NOW, complete=True) == rules.SweepPlan((), (), ())


def test_the_graces_are_seven_days_and_thirty_for_an_icon() -> None:
    assert rules.UNUSED_GRACE == timedelta(days=7)
    assert rules.UNUSED_ICON_GRACE == timedelta(days=30)


def test_plan_sweep_keeps_an_icon_photo_for_thirty_days() -> None:
    marks = {
        "ICON-8-DAYS": _iso(NOW - timedelta(days=8)),
        "ICON-INSIDE": _iso(NOW - timedelta(days=30)),
        "ICON-PAST": _iso(NOW - timedelta(days=30, seconds=1)),
        "ICON-IN-USE": _iso(NOW - timedelta(days=60)),
        "ICON-NEW": None,
        "BACKGROUND-8-DAYS": _iso(NOW - timedelta(days=8)),
    }
    icons = {"ICON-8-DAYS", "ICON-INSIDE", "ICON-PAST", "ICON-IN-USE", "ICON-NEW", "NOT-STORED"}
    plan = rules.plan_sweep(marks, {"ICON-IN-USE"}, NOW, complete=True, icons=icons)
    assert plan.clear == ("ICON-IN-USE",)
    assert plan.stamp == ("ICON-NEW",)
    assert plan.delete == ("BACKGROUND-8-DAYS", "ICON-PAST")
    # Unread pages stop the icon deletes too.
    assert rules.plan_sweep(marks, (), NOW, complete=False, icons=icons).delete == ()
