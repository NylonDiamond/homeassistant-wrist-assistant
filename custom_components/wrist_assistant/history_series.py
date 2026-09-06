"""Recorder history, averaged down to a handful of readings.

A complication chart wants a short list of numbers, not a state-change log. A
voltage sensor can log thousands of rows in a day; a rectangular complication
draws about twenty bars. Bucketing on the server rather than on the watch is
what keeps that difference off the watch's radio and out of its JSON decoder.

Both callers share this module on purpose. The signed `op=history` endpoint
feeds the watch, and the panel's websocket command feeds the editor preview;
they must agree to the digit, or the chart the user placed in the browser is
not the chart that appears on the wrist.
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from functools import partial
from typing import TYPE_CHECKING, Any

# Home Assistant is imported for types only, and the runtime imports live inside
# `async_history_series`. That keeps this module importable on its own, which is
# what lets the bucketing arithmetic below be tested without a full HA install.
if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

# Bounds on what a caller may ask for. The point count is capped well under the
# pixel width of a complication; the span is capped at a week because the
# recorder's default purge keeps ten days and a longer window would quietly
# return a partial answer.
#
# A point count of `EVERY_READING` asks for the recorded states themselves, one
# reading per state change, instead of an average per time slot. The same cap
# applies: a chatty sensor keeps its newest `MAX_POINTS` readings.
EVERY_READING = 0
MIN_POINTS = 2
MAX_POINTS = 120
MIN_MINUTES = 1
MAX_MINUTES = 7 * 24 * 60


class HistorySeriesError(Exception):
    """Raised when the series cannot be produced at all."""


def clamp_points(raw: Any, default: int = 24) -> int:
    """Coerce a caller's point count into range. Junk falls back to the default.

    Zero (or less) means every reading, and comes back as `EVERY_READING`.
    """
    try:
        value = int(raw)
    except (TypeError, ValueError):
        return default
    if value < 1:
        return EVERY_READING
    return max(MIN_POINTS, min(MAX_POINTS, value))


def clamp_minutes(raw: Any, default: int = 360) -> int:
    """Coerce a caller's span into range. Junk falls back to the default."""
    try:
        value = int(raw)
    except (TypeError, ValueError):
        return default
    return max(MIN_MINUTES, min(MAX_MINUTES, value))


def _as_number(state: Any) -> float | None:
    """A recorded state as a number, or None when it is not one.

    `unavailable` and `unknown` land here on every sensor that has ever
    restarted, and a boolean-ish state ("on") is not a reading either.
    """
    if state is None:
        return None
    try:
        value = float(state)
    except (TypeError, ValueError):
        return None
    if value != value or value in (float("inf"), float("-inf")):
        return None
    return value


def _format(value: float) -> str:
    """One reading, as short as it can be written without losing the shape.

    Three decimals is past the resolution of anything a complication can draw,
    and trailing zeros are pure payload.
    """
    text = f"{round(value, 3):.3f}".rstrip("0").rstrip(".")
    return text if text not in ("", "-0") else "0"


def bucket_series(
    samples: list[tuple[datetime, float]],
    start: datetime,
    end: datetime,
    points: int,
    anchor: float | None = None,
) -> list[float]:
    """Average timestamped readings into `points` equal time slots.

    `samples` must be oldest-first and already numeric. `anchor` is the entity's
    value immediately before the window, which fills leading slots that hold no
    reading of their own.

    A slot with no reading carries the previous slot's value forward. That is
    what the recorder itself means: a sensor that did not report simply had not
    changed. Dropping empty slots instead would compress the time axis, so a
    quiet night would render the same width as a busy hour.

    Leading slots with nothing before them are dropped rather than invented, so
    a sensor that only started recording halfway through the window draws a
    shorter series instead of a flat run that never happened.
    """
    if points < 1 or end <= start:
        return []

    span = (end - start).total_seconds()
    slot = span / points
    sums = [0.0] * points
    counts = [0] * points

    for when, value in samples:
        offset = (when - start).total_seconds()
        index = int(offset / slot) if slot > 0 else 0
        if index < 0:
            index = 0
        elif index >= points:
            index = points - 1
        sums[index] += value
        counts[index] += 1

    out: list[float] = []
    carried = anchor
    for index in range(points):
        if counts[index]:
            carried = sums[index] / counts[index]
        if carried is not None:
            out.append(carried)
    return out


def raw_series(samples: list[tuple[datetime, float]], limit: int = MAX_POINTS) -> list[float]:
    """Every recorded reading as it stands, oldest first, newest `limit` kept.

    The other answer to "how many readings": none of the averaging above, one
    point per state change. A sensor that reports on change draws its real
    shape this way, with a step for every report and no quiet slots invented
    between them. The time axis is no longer even, which is the trade.
    """
    if limit < 1:
        return []
    values = [value for _, value in samples]
    return values[-limit:]


def series_to_string(values: list[float]) -> str:
    """The wire form: readings joined by commas, oldest first."""
    return ",".join(_format(value) for value in values)


async def async_history_series(
    hass: HomeAssistant,
    entity_id: str,
    minutes: int,
    points: int,
    now: datetime | None = None,
) -> str:
    """Fetch and bucket one entity's recent history. Returns the wire string.

    `points` of `EVERY_READING` skips the bucketing and returns the recorded
    states themselves, newest `MAX_POINTS` of them.

    Raises `HistorySeriesError` when the recorder is missing or the query
    fails. An entity that simply has no recorded history is not an error: it
    returns an empty string, and the chart draws nothing.
    """
    minutes = clamp_minutes(minutes)
    points = clamp_points(points)
    end = now or datetime.now(timezone.utc)
    start = end - timedelta(minutes=minutes)

    try:
        from homeassistant.components.recorder import get_instance
        from homeassistant.components.recorder.history import (
            state_changes_during_period,
        )
        from homeassistant.exceptions import HomeAssistantError
    except ImportError as err:
        raise HistorySeriesError("recorder unavailable") from err

    recorder = get_instance(hass)
    try:
        # Keyword args via `partial`: the positional signature of
        # `state_changes_during_period` has moved between recorder versions.
        # `include_start_time_state` defaults on, which is what gives us the
        # anchor reading that fills the leading slots.
        states_by_entity = await recorder.async_add_executor_job(
            partial(
                state_changes_during_period,
                hass,
                start,
                end,
                entity_id,
                no_attributes=True,
            )
        )
    except HomeAssistantError as err:
        _LOGGER.warning("history series failed for %s: %s", entity_id, err)
        raise HistorySeriesError(str(err)) from err

    raw = states_by_entity.get(entity_id, []) or []

    anchor: float | None = None
    samples: list[tuple[datetime, float]] = []
    for state in raw:
        when = getattr(state, "last_changed", None)
        if when is None:
            continue
        value = _as_number(getattr(state, "state", None))
        if value is None:
            continue
        if when < start:
            # The start-of-window anchor recorder hands back. It is not inside
            # any slot, but it is what the first slot inherits.
            anchor = value
            continue
        samples.append((when, value))

    if points == EVERY_READING:
        return series_to_string(raw_series(samples))
    return series_to_string(bucket_series(samples, start, end, points, anchor))
