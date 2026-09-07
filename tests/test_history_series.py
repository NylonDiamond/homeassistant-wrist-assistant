"""The arithmetic behind a complication chart's history.

`history_series` is imported directly rather than through the integration
package: it deliberately keeps Home Assistant out of its module body (the
runtime imports sit inside `async_history_series`), so the bucketing can be
checked without a full HA install. That is the whole point of the split, and
this file is what proves it still holds.

The numbers here are the contract the watch and the editor preview both draw
from. Swift never reimplements them; it receives the finished string.
"""

from __future__ import annotations

import importlib.util
from datetime import datetime, timedelta, timezone
from pathlib import Path

_MODULE_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "history_series.py"
)
_spec = importlib.util.spec_from_file_location("history_series", _MODULE_PATH)
assert _spec is not None and _spec.loader is not None
history_series = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(history_series)

bucket_series = history_series.bucket_series
raw_series = history_series.raw_series
series_to_string = history_series.series_to_string
clamp_points = history_series.clamp_points
clamp_minutes = history_series.clamp_minutes
state_pairs = history_series.state_pairs
states_to_string = history_series.states_to_string
normalize_mode = history_series.normalize_mode

START = datetime(2026, 9, 5, 9, 0, tzinfo=timezone.utc)
END = START + timedelta(hours=6)


def at(minutes: float) -> datetime:
    return START + timedelta(minutes=minutes)


def test_one_reading_per_slot_keeps_its_own_value():
    samples = [(at(30 + 60 * i), float(i)) for i in range(6)]
    assert bucket_series(samples, START, END, 6) == [0, 1, 2, 3, 4, 5]


def test_several_readings_in_one_slot_average():
    # Three readings inside the first hour, nothing after.
    samples = [(at(5), 10.0), (at(20), 20.0), (at(50), 30.0)]
    assert bucket_series(samples, START, END, 6) == [20, 20, 20, 20, 20, 20]


def test_a_quiet_slot_carries_the_previous_value_forward():
    # A sensor that does not report has not changed; the chart must show that
    # as a flat run, not as a gap that shortens the time axis.
    samples = [(at(10), 5.0), (at(310), 9.0)]
    assert bucket_series(samples, START, END, 6) == [5, 5, 5, 5, 5, 9]


def test_leading_slots_with_nothing_before_them_are_dropped():
    # Recording started halfway through: a shorter series is honest, a flat run
    # back to the start of the window is invented data.
    samples = [(at(200), 7.0), (at(260), 8.0)]
    assert bucket_series(samples, START, END, 6) == [7, 8, 8]


def test_the_anchor_fills_the_leading_slots():
    # The state as it was just before the window opened. This is what recorder
    # hands back alongside the changes, and what makes a slow sensor chartable.
    samples = [(at(310), 9.0)]
    assert bucket_series(samples, START, END, 6, anchor=4.0) == [4, 4, 4, 4, 4, 9]


def test_a_reading_exactly_on_the_end_lands_in_the_last_slot():
    # Not in a seventh slot that does not exist.
    assert bucket_series([(END, 3.0)], START, END, 6, anchor=1.0) == [1, 1, 1, 1, 1, 3]


def test_no_readings_and_no_anchor_is_an_empty_series():
    assert bucket_series([], START, END, 6) == []


def test_an_anchor_alone_still_draws_a_flat_line():
    assert bucket_series([], START, END, 4, anchor=2.5) == [2.5, 2.5, 2.5, 2.5]


def test_a_zero_length_window_draws_nothing():
    assert bucket_series([(START, 1.0)], START, START, 6) == []


def test_readings_are_written_as_short_as_they_can_be():
    # Trailing zeros are pure payload on a watch's radio.
    assert series_to_string([3068.0, 3070.5, 3071.25]) == "3068,3070.5,3071.25"
    assert series_to_string([0.0001]) == "0"
    assert series_to_string([-4.5, -0.0]) == "-4.5,0"


def test_point_counts_are_clamped_and_junk_falls_back():
    assert clamp_points(5000) == 120
    assert clamp_points(1) == 2
    assert clamp_points(24) == 24
    assert clamp_points("nonsense") == 24
    assert clamp_points(None) == 24


def test_zero_points_means_every_reading():
    assert clamp_points(0) == history_series.EVERY_READING
    assert clamp_points(-3) == history_series.EVERY_READING


def test_every_reading_keeps_each_state_change_in_order():
    samples = [(at(5), 1.0), (at(6), 3.0), (at(200), 2.0)]
    assert raw_series(samples) == [1.0, 3.0, 2.0]
    assert raw_series([]) == []


def test_every_reading_keeps_only_the_newest_when_capped():
    samples = [(at(i), float(i)) for i in range(150)]
    kept = raw_series(samples)
    assert len(kept) == 120
    assert kept[0] == 30.0
    assert kept[-1] == 149.0


def test_spans_are_clamped_and_junk_falls_back():
    assert clamp_minutes(999_999) == 7 * 24 * 60
    assert clamp_minutes(0) == 1
    assert clamp_minutes(360) == 360
    assert clamp_minutes(None) == 360


# --- States mode: what a state timeline draws -------------------------------


def test_modes_fall_back_to_numeric():
    assert normalize_mode("states") == "states"
    assert normalize_mode(" States ") == "states"
    assert normalize_mode("numeric") == "numeric"
    assert normalize_mode(None) == "numeric"
    assert normalize_mode("nonsense") == "numeric"
    assert normalize_mode(7) == "numeric"


def test_the_anchor_is_the_offset_zero_pair():
    # Whatever was in force when the window opened owns the left edge, so the
    # first run always has a start.
    changes = [(at(20), "on"), (at(31), "off")]
    assert state_pairs(changes, START, "off") == [(0, "off"), (1200, "on"), (1860, "off")]


def test_without_an_anchor_the_first_change_starts_the_strip():
    changes = [(at(20), "on"), (at(31), "off")]
    assert state_pairs(changes, START) == [(1200, "on"), (1860, "off")]


def test_a_change_on_the_span_start_replaces_the_anchor():
    changes = [(START, "on"), (at(10), "off")]
    assert state_pairs(changes, START, "off") == [(0, "on"), (600, "off")]


def test_a_repeated_state_is_not_a_change():
    changes = [(at(10), "on"), (at(20), "on"), (at(30), "off")]
    assert state_pairs(changes, START, "on") == [(0, "on"), (1800, "off")]


def test_unavailable_is_an_ordinary_state():
    changes = [(at(10), "unavailable"), (at(40), "on")]
    assert state_pairs(changes, START, "off") == [
        (0, "off"),
        (600, "unavailable"),
        (2400, "on"),
    ]


def test_nothing_recorded_is_an_empty_strip():
    assert state_pairs([], START) == []
    assert states_to_string([]) == ""


def test_the_newest_changes_win_when_capped():
    # 300 changes in the window, and only 120 pairs may go on the wire. The
    # right edge is the edge someone reads, so the oldest are what go.
    changes = [(at(i), f"s{i}") for i in range(300)]
    pairs = state_pairs(changes, START, "old")
    assert len(pairs) == 120
    assert pairs[0] == (0, "s180")
    assert pairs[1] == (181 * 60, "s181")
    assert pairs[-1] == (299 * 60, "s299")


def test_a_cap_that_lands_on_offset_zero_does_not_double_it():
    # 130 changes all at the same instant, the window's own start. The kept
    # window already begins at offset 0, so no carried pair is prepended.
    changes = [(START, f"s{i}") for i in range(130)]
    pairs = state_pairs(changes, START)
    assert pairs == [(0, "s129")]


def test_states_are_percent_encoded_on_the_wire():
    pairs = [(0, "not_home"), (60, "Kitchen: back door"), (120, "20°C")]
    assert states_to_string(pairs) == (
        "0:not_home 60:Kitchen%3A%20back%20door 120:20%C2%B0C"
    )


def test_unreserved_characters_survive_encoding():
    assert states_to_string([(0, "a-z_0.9~")]) == "0:a-z_0.9~"
