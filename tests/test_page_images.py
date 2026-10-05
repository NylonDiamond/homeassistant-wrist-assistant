"""Unit tests for ``page_images.py``, the rules of the page background photos.

Pure: the module imports nothing from Home Assistant, so it is loaded on its
own. Covered: which ids are photo ids and how they fold, the JPEG check and
its frame header read (every built-in photo the integration ships among the
cases, against the sizes macOS reads), which ids a pages document names, and
every row of the sweep's decision.
"""

from __future__ import annotations

import importlib.util
import json
import struct
import sys
from datetime import UTC, datetime, timedelta
from pathlib import Path

import pytest

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_PRESETS = _PKG_DIR / "page_images"


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


def test_usage_lists_the_owners_of_each_photo_sorted() -> None:
    def page(image_id: str) -> dict:
        return {"pages": [{"id": "p", "backgroundImageId": image_id}]}

    assert rules.usage(
        {"watch-B": page(UUID_UPPER), "watch-A": page(UUID_UPPER.lower()), "watch-C": page("preset_fern")}
    ) == {UUID_UPPER: ["watch-A", "watch-B"], "preset_fern": ["watch-C"]}


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
