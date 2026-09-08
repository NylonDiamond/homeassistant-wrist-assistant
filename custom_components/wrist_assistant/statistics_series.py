"""Long-term statistics, shaped into the same series a chart already draws.

The recorder keeps two different things. State history is every reported
reading and it is purged (ten days by default), which is why
`history_series` caps its span at a week. Long-term statistics are the
pre-aggregated rows the recorder writes per five minutes, hour, day, week and
month, and they are *never* purged: a year of hourly energy is one cheap
query. The five-minute rows are the exception; they are compacted into hourly
rows after about ten days, so a five-minute request over a long span quietly
returns only its recent tail.

The reply is byte-identical in shape to the history endpoint's: readings
joined by commas, oldest first. That is deliberate. The watch's chart draw
path, the panel preview's, and the fixtures all stay exactly as they are, and
the only thing that changes is where the numbers came from.

The window is rolling: the span ends at "now" and runs back `minutes`. A
calendar-aligned window ("today", "this month") is a different question and a
follow-up; nothing here rounds to midnight.

Like `history_series`, Home Assistant is imported for types only at module
level. The runtime imports live inside `async_statistics_series`, which keeps
this module importable on its own and lets the gap arithmetic below be tested
without a full HA install.
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from functools import partial
from typing import TYPE_CHECKING, Any

from .history_series import series_to_string

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

# Statistics are never purged, so the span cap is about what a complication
# can usefully draw rather than about what the database still holds. A year
# plus a leap day is the longest window the panel offers.
MIN_MINUTES = 1
MAX_MINUTES = 366 * 24 * 60
DEFAULT_MINUTES = 24 * 60

# The point cap matches `history_series.MAX_POINTS`: past this the bars are
# thinner than a pixel on any complication, and the newest ones are the ones
# anybody looks at.
MAX_POINTS = 120

PERIOD_5MINUTE = "5minute"
PERIOD_HOUR = "hour"
PERIOD_DAY = "day"
PERIOD_WEEK = "week"
PERIOD_MONTH = "month"

# Ordered for the panel's segmented control; "hour" is the default because it
# is what an energy dashboard shows and what the recorder keeps forever.
PERIODS = (PERIOD_5MINUTE, PERIOD_HOUR, PERIOD_DAY, PERIOD_WEEK, PERIOD_MONTH)
DEFAULT_PERIOD = PERIOD_HOUR

# How long one row of each period covers, in seconds. A month has no fixed
# length, so it gets zero: gap filling is skipped entirely for month rows
# rather than guessing at 30 or 31 days and inventing a bar.
PERIOD_SECONDS: dict[str, int] = {
    PERIOD_5MINUTE: 5 * 60,
    PERIOD_HOUR: 60 * 60,
    PERIOD_DAY: 24 * 60 * 60,
    PERIOD_WEEK: 7 * 24 * 60 * 60,
    PERIOD_MONTH: 0,
}

STAT_MEAN = "mean"
STAT_MIN = "min"
STAT_MAX = "max"
STAT_CHANGE = "change"
STAT_SUM = "sum"

# `change` is the amount consumed during the period, which is the energy
# question; `sum` is the running total the meter reads. Everything else is
# the ordinary mean/min/max of a measurement.
STAT_TYPES = (STAT_MEAN, STAT_MIN, STAT_MAX, STAT_CHANGE, STAT_SUM)
DEFAULT_STAT_TYPE = STAT_MEAN

# A row that starts more than this many periods after the previous one has a
# hole in front of it. Half a period of slack absorbs the recorder writing a
# row a few seconds late without reading as a gap.
GAP_TOLERANCE = 1.5


# The one `StatisticsSeriesError` message a caller may want to tell apart:
# no recorder at all is a 503 (the box cannot answer this), a failed query is
# a 502 (it tried and could not).
RECORDER_UNAVAILABLE = "recorder unavailable"


class StatisticsSeriesError(Exception):
    """Raised when the series cannot be produced at all."""


def clamp_minutes(raw: Any, default: int = DEFAULT_MINUTES) -> int:
    """Coerce a caller's span into range. Junk falls back to the default."""
    try:
        value = int(raw)
    except (TypeError, ValueError):
        return default
    return max(MIN_MINUTES, min(MAX_MINUTES, value))


def normalize_period(raw: Any, default: str = DEFAULT_PERIOD) -> str:
    """Coerce a caller's period into one the recorder serves.

    Anything unrecognised, missing or misspelled reads as `hour`, so a
    document written by a newer panel never fails the whole chart.
    """
    if isinstance(raw, str):
        candidate = raw.strip().lower()
        if candidate in PERIODS:
            return candidate
    return default


def normalize_type(raw: Any, default: str = DEFAULT_STAT_TYPE) -> str:
    """Coerce a caller's statistic type into one the recorder serves."""
    if isinstance(raw, str):
        candidate = raw.strip().lower()
        if candidate in STAT_TYPES:
            return candidate
    return default


def _as_number(value: Any) -> float | None:
    """A statistic column as a number, or None when it is not one.

    A row whose column is `None` is ordinary: the recorder writes one for a
    period it has no sum for, and a sensor that was unavailable for an hour
    has exactly that.
    """
    if value is None or isinstance(value, str):
        return None
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    if number != number or number in (float("inf"), float("-inf")):
        return None
    return number


def row_start_ts(row: Any) -> float | None:
    """A statistics row's start as a unix timestamp, or None if unreadable.

    The recorder hands back `StatisticsRow`, a TypedDict whose `start` is a
    float. Older recorders (and anything hand-built in a test) use a
    `datetime`, so both are read. A naive datetime is taken as UTC, which is
    the only timezone the recorder ever stores.
    """
    start = row.get("start") if isinstance(row, dict) else getattr(row, "start", None)
    if isinstance(start, datetime):
        if start.tzinfo is None:
            start = start.replace(tzinfo=timezone.utc)
        return start.timestamp()
    if isinstance(start, bool) or start is None:
        return None
    try:
        value = float(start)
    except (TypeError, ValueError):
        return None
    if value != value or value in (float("inf"), float("-inf")):
        return None
    return value


def fill_series(
    rows: list[Any],
    period_seconds: int,
    stat_type: str,
    limit: int = MAX_POINTS,
) -> list[float]:
    """Statistics rows as an evenly spaced series, oldest first.

    A chart's x axis is time, so a period the recorder has no row for has to
    occupy the same width as one it does. Dropping the hole instead would
    compress the axis and draw a quiet night the same width as a busy hour.

    What fills the hole depends on what is being read. `mean`, `min`, `max`
    and `sum` carry the previous value forward, because a sensor that did not
    report had not changed and a meter that did not report still reads what it
    read. `change` inserts 0, because an hour with no row is an hour nothing
    was used. A row whose value is `None` is a hole in exactly the same way
    and is filled the same way.

    Leading fillers with nothing before them are dropped rather than invented,
    so a sensor whose statistics start halfway through the window draws a
    shorter series instead of a flat run that never happened. `change` has
    nothing to carry, so its zero stands on its own from the first row.

    `period_seconds` of 0 means the period has no fixed length (month), and
    then nothing is filled at all: the rows are the series.

    The newest `limit` values are kept. The right edge is the edge anybody
    looks at, so a long window sheds its oldest end.
    """
    if limit < 1:
        return []

    stat_type = normalize_type(stat_type)
    zero_fills = stat_type == STAT_CHANGE

    ordered: list[tuple[float, float | None]] = []
    for row in rows:
        start = row_start_ts(row)
        if start is None:
            continue
        value = row.get(stat_type) if isinstance(row, dict) else getattr(row, stat_type, None)
        ordered.append((start, _as_number(value)))
    ordered.sort(key=lambda item: item[0])

    out: list[float] = []
    carried: float | None = None
    previous: float | None = None

    for start, value in ordered:
        if previous is not None and period_seconds > 0:
            gap = start - previous
            if gap > period_seconds * GAP_TOLERANCE:
                # Round rather than floor: a row written a few seconds late
                # should not read as one more missing period than there is.
                # Capped at `limit` because a year-long hole would otherwise
                # build a list whose newest `limit` values are all this
                # filler anyway.
                missing = min(int(round(gap / period_seconds)) - 1, limit)
                filler = 0.0 if zero_fills else carried
                if filler is not None:
                    out.extend([filler] * max(0, missing))
        previous = start

        if value is None:
            filler = 0.0 if zero_fills else carried
            if filler is not None:
                out.append(filler)
            continue

        carried = value
        out.append(value)

    return out[-limit:]


async def async_statistics_series(
    hass: HomeAssistant,
    entity_id: str,
    minutes: int,
    period: str,
    stat_type: str,
    now: datetime | None = None,
) -> str:
    """Fetch one entity's long-term statistics. Returns the wire string.

    The window is `[now - minutes, now)`, rolling. The point count is not a
    parameter: it is however many periods the span holds, newest
    `MAX_POINTS` kept, because the recorder has already decided what a row
    covers.

    Raises `StatisticsSeriesError` when the recorder is missing or the query
    fails. An entity with no recorded statistics is not an error: it returns
    an empty string, and the layer draws nothing.
    """
    minutes = clamp_minutes(minutes)
    period = normalize_period(period)
    stat_type = normalize_type(stat_type)
    end = now or datetime.now(timezone.utc)
    start = end - timedelta(minutes=minutes)

    try:
        from homeassistant.components.recorder import get_instance
        from homeassistant.components.recorder.statistics import (
            statistics_during_period,
        )
        from homeassistant.exceptions import HomeAssistantError
    except ImportError as err:
        raise StatisticsSeriesError(RECORDER_UNAVAILABLE) from err

    recorder = get_instance(hass)
    try:
        # Keyword args via `partial` for the same reason `history_series`
        # does it: the positional signature has moved between recorder
        # versions. `units=None` keeps the statistic's own recorded unit, so
        # the number matches what the entity's unit says it is. Asking for
        # `change` alone is supported; the recorder reads `sum` underneath
        # and drops it from the row.
        rows_by_id = await recorder.async_add_executor_job(
            partial(
                statistics_during_period,
                hass,
                start_time=start,
                end_time=end,
                statistic_ids={entity_id},
                period=period,
                units=None,
                types={stat_type},
            )
        )
    except HomeAssistantError as err:
        _LOGGER.warning("statistics series failed for %s: %s", entity_id, err)
        raise StatisticsSeriesError(str(err)) from err

    rows = rows_by_id.get(entity_id, []) or []
    return series_to_string(fill_series(rows, PERIOD_SECONDS[period], stat_type))
