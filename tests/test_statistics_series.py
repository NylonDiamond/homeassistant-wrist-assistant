"""The arithmetic behind a complication chart's long-term statistics.

Same bargain as `test_history_series`: `statistics_series` keeps Home
Assistant out of its module body (the runtime imports sit inside
`async_statistics_series`), so the gap filling can be checked without a full
HA install, and this file is what proves the split still holds.

The one difference from the history test is how the module is loaded.
`statistics_series` imports `series_to_string` from `history_series` rather
than growing a second copy of the formatter, and a relative import needs a
package to resolve against. So a synthetic package is built pointing at the
integration directory and the two modules are imported through it. The real
`custom_components/wrist_assistant/__init__.py` never runs, which is the
point: it imports Home Assistant.

The numbers here are the contract the watch and the editor preview both draw
from. Swift never reimplements them; it receives the finished string.
"""

from __future__ import annotations

import importlib
import sys
import types
from datetime import datetime, timedelta, timezone
from pathlib import Path

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_PKG_NAME = "wa_offline_pkg"

if _PKG_NAME not in sys.modules:
    _pkg = types.ModuleType(_PKG_NAME)
    _pkg.__path__ = [str(_PKG_DIR)]
    sys.modules[_PKG_NAME] = _pkg

statistics_series = importlib.import_module(f"{_PKG_NAME}.statistics_series")
history_series = importlib.import_module(f"{_PKG_NAME}.history_series")

clamp_minutes = statistics_series.clamp_minutes
normalize_period = statistics_series.normalize_period
normalize_type = statistics_series.normalize_type
row_start_ts = statistics_series.row_start_ts
fill_series = statistics_series.fill_series
series_to_string = statistics_series.series_to_string
PERIOD_SECONDS = statistics_series.PERIOD_SECONDS

HOUR = PERIOD_SECONDS["hour"]
MONTH = PERIOD_SECONDS["month"]

START = datetime(2026, 9, 5, 0, 0, tzinfo=timezone.utc).timestamp()


def row(hours: float, **values: float | None) -> dict:
    """One statistics row, `hours` after the window's start."""
    return {"start": START + hours * HOUR, "end": START + (hours + 1) * HOUR, **values}


# --- clamping and normalising -------------------------------------------


def test_span_is_capped_at_a_year_and_a_leap_day():
    assert clamp_minutes(10_000_000) == 366 * 24 * 60
    assert clamp_minutes(0) == 1
    assert clamp_minutes(-5) == 1
    assert clamp_minutes(1440) == 1440


def test_junk_span_falls_back_to_the_default():
    assert clamp_minutes(None) == 24 * 60
    assert clamp_minutes("banana") == 24 * 60
    assert clamp_minutes({}) == 24 * 60
    assert clamp_minutes("90") == 90


def test_period_normalises_and_junk_reads_as_hour():
    assert normalize_period("day") == "day"
    assert normalize_period("  5MINUTE ") == "5minute"
    assert normalize_period("fortnight") == "hour"
    assert normalize_period(None) == "hour"
    assert normalize_period(7) == "hour"


def test_type_normalises_and_junk_reads_as_mean():
    assert normalize_type("change") == "change"
    assert normalize_type(" SUM ") == "sum"
    assert normalize_type("median") == "mean"
    assert normalize_type(None) == "mean"


# --- reading a row's start ----------------------------------------------


def test_row_start_reads_a_float():
    assert row_start_ts({"start": 1_757_030_400.0}) == 1_757_030_400.0
    assert row_start_ts({"start": 1_757_030_400}) == 1_757_030_400.0


def test_row_start_reads_an_aware_datetime():
    when = datetime(2026, 9, 5, 0, 0, tzinfo=timezone.utc)
    assert row_start_ts({"start": when}) == when.timestamp()


def test_row_start_reads_a_naive_datetime_as_utc():
    naive = datetime(2026, 9, 5, 0, 0)
    aware = naive.replace(tzinfo=timezone.utc)
    assert row_start_ts({"start": naive}) == aware.timestamp()


def test_row_start_returns_none_for_junk():
    assert row_start_ts({}) is None
    assert row_start_ts({"start": None}) is None
    assert row_start_ts({"start": "yesterday"}) is None
    assert row_start_ts({"start": True}) is None


def test_row_start_reads_an_object_as_well_as_a_dict():
    class Row:
        start = 1_757_030_400.0

    assert row_start_ts(Row()) == 1_757_030_400.0


# --- gap filling ---------------------------------------------------------


def test_contiguous_rows_pass_through_untouched():
    rows = [row(i, mean=float(i)) for i in range(5)]
    assert fill_series(rows, HOUR, "mean") == [0, 1, 2, 3, 4]


def test_rows_out_of_order_are_sorted_by_start():
    rows = [row(2, mean=2.0), row(0, mean=0.0), row(1, mean=1.0)]
    assert fill_series(rows, HOUR, "mean") == [0, 1, 2]


def test_a_gap_carries_the_previous_mean_forward():
    # Hours 0 and 4 have rows; 1, 2 and 3 do not. A sensor that did not
    # report had not changed, so the chart holds the line rather than
    # squeezing five hours into two bars.
    rows = [row(0, mean=10.0), row(4, mean=20.0)]
    assert fill_series(rows, HOUR, "mean") == [10, 10, 10, 10, 20]


def test_a_gap_of_one_and_a_half_periods_is_not_a_gap():
    # Half a period of slack absorbs a row written late.
    rows = [row(0, mean=1.0), row(1.4, mean=2.0)]
    assert fill_series(rows, HOUR, "mean") == [1, 2]


def test_a_gap_zero_fills_for_change():
    # An hour with no row is an hour nothing was used, which is 0 kWh, not
    # "the same as last hour again".
    rows = [row(0, change=0.4), row(3, change=0.9)]
    assert fill_series(rows, HOUR, "change") == [0.4, 0, 0, 0.9]


def test_min_and_max_and_sum_carry_forward_like_mean():
    for stat in ("min", "max", "sum"):
        rows = [row(0, **{stat: 5.0}), row(3, **{stat: 8.0})]
        assert fill_series(rows, HOUR, stat) == [5, 5, 5, 8], stat


def test_a_none_value_is_a_hole_and_is_filled_the_same_way():
    rows = [row(0, mean=4.0), row(1, mean=None), row(2, mean=6.0)]
    assert fill_series(rows, HOUR, "mean") == [4, 4, 6]


def test_a_none_value_zero_fills_for_change():
    rows = [row(0, change=1.0), row(1, change=None), row(2, change=3.0)]
    assert fill_series(rows, HOUR, "change") == [1, 0, 3]


def test_a_missing_column_reads_as_a_hole():
    # The row exists but the recorder wrote no column for the type asked for.
    rows = [row(0, mean=4.0), row(1), row(2, mean=6.0)]
    assert fill_series(rows, HOUR, "mean") == [4, 4, 6]


def test_leading_fillers_with_nothing_before_them_are_dropped():
    # Statistics that start halfway through the window draw a shorter series
    # rather than a flat run that never happened.
    rows = [row(0, mean=None), row(1, mean=None), row(2, mean=7.0), row(3, mean=8.0)]
    assert fill_series(rows, HOUR, "mean") == [7, 8]


def test_a_leading_zero_stands_on_its_own_for_change():
    # `change` has nothing to carry, so its filler does not depend on a
    # previous value and the series keeps its left edge.
    rows = [row(0, change=None), row(1, change=2.0)]
    assert fill_series(rows, HOUR, "change") == [0, 2]


def test_month_rows_are_never_filled():
    # A month has no fixed length, so a gap cannot be counted in months
    # without inventing one. The rows are the series.
    rows = [
        {"start": datetime(2026, 1, 1, tzinfo=timezone.utc).timestamp(), "change": 100.0},
        {"start": datetime(2026, 6, 1, tzinfo=timezone.utc).timestamp(), "change": 60.0},
    ]
    assert fill_series(rows, MONTH, "change") == [100, 60]


def test_the_newest_points_survive_the_cap():
    rows = [row(i, mean=float(i)) for i in range(200)]
    filled = fill_series(rows, HOUR, "mean")
    assert len(filled) == 120
    assert filled[0] == 80
    assert filled[-1] == 199


def test_a_huge_gap_does_not_build_more_than_the_cap_needs():
    # A year-long hole at five-minute resolution would otherwise be a
    # hundred thousand copies of one number, all but 120 of them discarded.
    rows = [row(0, mean=3.0), row(5000, mean=9.0)]
    filled = fill_series(rows, HOUR, "mean")
    assert len(filled) == 120
    assert filled[-1] == 9
    assert filled[0] == 3


def test_rows_without_a_readable_start_are_skipped():
    rows = [row(0, mean=1.0), {"mean": 99.0}, row(1, mean=2.0)]
    assert fill_series(rows, HOUR, "mean") == [1, 2]


def test_an_unparseable_value_is_a_hole():
    rows = [row(0, mean=1.0), row(1, mean="unavailable"), row(2, mean=3.0)]
    assert fill_series(rows, HOUR, "mean") == [1, 1, 3]


def test_no_rows_is_an_empty_series_not_an_error():
    assert fill_series([], HOUR, "mean") == []


def test_a_limit_below_one_returns_nothing():
    assert fill_series([row(0, mean=1.0)], HOUR, "mean", limit=0) == []


def test_an_unknown_stat_type_is_normalised_before_reading_the_row():
    rows = [row(0, mean=5.0), row(1, mean=6.0)]
    assert fill_series(rows, HOUR, "median") == [5, 6]


# --- the wire string -----------------------------------------------------


def test_the_series_string_is_the_history_one():
    # Not a second formatter: the module imports history's. This asserts the
    # import still resolves to the same function rather than a copy that has
    # drifted.
    assert series_to_string is history_series.series_to_string


def test_the_series_string_is_comma_joined_oldest_first():
    assert series_to_string([1.0, 2.5, 3.0]) == "1,2.5,3"


def test_the_series_string_trims_to_three_decimals():
    assert series_to_string([0.123456, 10.0, -0.0004]) == "0.123,10,0"


def test_a_filled_change_series_reaches_the_wire_as_zeros():
    rows = [row(0, change=0.42), row(2, change=0.5)]
    assert series_to_string(fill_series(rows, HOUR, "change")) == "0.42,0,0.5"


# --- the module's own bounds --------------------------------------------


def test_the_period_table_covers_every_period_the_module_serves():
    assert set(PERIOD_SECONDS) == set(statistics_series.PERIODS)
    assert PERIOD_SECONDS["5minute"] == 300
    assert PERIOD_SECONDS["week"] == 7 * 24 * 3600
    assert PERIOD_SECONDS["month"] == 0


def test_a_day_span_of_hourly_rows_fits_under_the_cap():
    span = timedelta(minutes=clamp_minutes(1440))
    assert span.total_seconds() / HOUR <= statistics_series.MAX_POINTS
