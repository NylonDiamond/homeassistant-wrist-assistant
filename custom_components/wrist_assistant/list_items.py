"""Calendar events, to-do items and forecast rows, shaped for a list layer.

A list layer draws a row template once per item. Most of its sources are Jinja
(the integration already renders one template document per face, and Jinja can
select, sort and slice entity states on its own), but three of them are not:
calendar events, to-do items and a weather forecast all need a service call
with `return_response`, which no template can make. Those three live here.

Both callers share this module on purpose. The signed `op=list` endpoint feeds
the watch and the widget, and the panel's websocket command feeds the editor
preview; they must agree row for row, or the list the user arranged in the
browser is not the list that appears on the wrist.

Home Assistant is imported for types only at module level, and the runtime
imports live inside `async_list_items`. That keeps this module importable on
its own, which is what lets the shaping below (the response walkers, the
timestamp conversion, the merge, the caps and the trim) be tested without a
full HA install.

What the caller gets back is already finished: capped strings, unix-second
timestamps in Home Assistant's own time zone, sorted, sliced to the row count,
and trimmed to a size a watch will accept. Everything time-relative (a
countdown to an event, how overdue a to-do is) is computed on the client from
the timestamp and its own clock, so a cached list stays right between fetches.
"""

from __future__ import annotations

import json
import logging
from datetime import datetime, time, timedelta
from typing import TYPE_CHECKING, Any, NamedTuple

if TYPE_CHECKING:
    from datetime import tzinfo

    from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

# The three sources that need a service call. Everything else a list layer can
# name is rendered as Jinja alongside the rest of the face's values and never
# reaches this module.
SOURCE_CALENDAR = "calendar"
SOURCE_TODO = "todo"
SOURCE_FORECAST = "forecast"
SERVICE_SOURCES = (SOURCE_CALENDAR, SOURCE_TODO, SOURCE_FORECAST)

# Named so the refusal can say *why* rather than "unknown source": a panel that
# sent one of these has picked the wrong transport, not made a typo.
TEMPLATE_SOURCES = ("entities", "attribute", "template")

# A calendar window. Two weeks is already more than any complication can draw;
# the cap is about what a caller may ask the calendar integrations to search.
MIN_HOURS = 1
MAX_HOURS = 336
DEFAULT_HOURS = 24

# Cells a list layer can hold, so the row count is also the item cap. The
# server slices to this after sorting and reports the pre-slice count, which is
# what a `listStat total` draws.
MAX_ITEMS = 12

# Calendars or to-do lists one source may merge.
MAX_ENTITIES = 5

# Text caps. A row on a complication shows a handful of words; a calendar entry
# with an agenda pasted into it would otherwise spend the whole reply budget.
MAX_STRING_CHARS = 120
MAX_DESCRIPTION_CHARS = 200
_LONG_STRING_FIELDS = frozenset({"description"})

# The whole reply, compact JSON. Past this the rows at the end are dropped:
# twelve short rows never come close, and a list that would have been refused
# whole is worth less than a list missing its tail.
MAX_REPLY_BYTES = 16 * 1024

# What a to-do row counts as. The wire words are the short ones; Home
# Assistant's own spellings are the two below them.
STATUS_OPEN = "open"
STATUS_DONE = "done"
STATUS_ALL = "all"
STATUSES = (STATUS_OPEN, STATUS_DONE, STATUS_ALL)
HA_STATUS_OPEN = "needs_action"
HA_STATUS_DONE = "completed"

# `list` keeps the order the to-do list itself is in, which is the order the
# user dragged the items into. `due` sorts by date, undated last.
SORT_LIST = "list"
SORT_DUE = "due"
SORTS = (SORT_LIST, SORT_DUE)

# Forecast granularity. The wire spelling is camel case like every other key in
# a complication document; Home Assistant's service wants `twice_daily`.
FORECAST_HOURLY = "hourly"
FORECAST_DAILY = "daily"
FORECAST_TWICE_DAILY = "twiceDaily"
FORECAST_TYPES = (FORECAST_HOURLY, FORECAST_DAILY, FORECAST_TWICE_DAILY)
_FORECAST_SERVICE_TYPES = {
    FORECAST_HOURLY: "hourly",
    FORECAST_DAILY: "daily",
    FORECAST_TWICE_DAILY: "twice_daily",
}

# How deep the response walker will follow wrappers before giving up. Home
# Assistant has returned several shapes for `todo.get_items` over its releases
# and may yet return another, so the walker searches rather than assumes; the
# depth is what stops a hostile or circular response from spinning.
_MAX_WALK_DEPTH = 10

# One key per service, and the field names that say "this array is the rows"
# when the walker finds an array with no wrapper to identify it.
_ROWS_KEY = {
    SOURCE_CALENDAR: "events",
    SOURCE_TODO: "items",
    SOURCE_FORECAST: "forecast",
}
_ROW_MARKERS: dict[str, frozenset[str]] = {
    "events": frozenset({"summary", "start", "end"}),
    "items": frozenset({"summary", "uid", "status"}),
    "forecast": frozenset({"datetime", "condition", "temperature"}),
}

# Wrapper keys a `return_response` payload has been seen inside.
_WRAPPER_KEYS = ("response", "service_response", "result", "data")


class ListItemsError(Exception):
    """Raised when the request itself cannot be served.

    A bad spec, not a bad box: an unknown source, a missing entity, too many
    calendars. Service failures come back as `HomeAssistantError` instead, so
    the two map onto different status codes.
    """


def clamp_hours(raw: Any, default: int = DEFAULT_HOURS) -> int:
    """Coerce a calendar window into range. Junk falls back to the default."""
    try:
        value = int(raw)
    except (TypeError, ValueError):
        return default
    return max(MIN_HOURS, min(MAX_HOURS, value))


def clamp_limit(raw: Any, default: int = MAX_ITEMS) -> int:
    """Coerce a caller's row count into range. Junk falls back to the default."""
    try:
        value = int(raw)
    except (TypeError, ValueError):
        return default
    return max(1, min(MAX_ITEMS, value))


def normalize_status(raw: Any, default: str = STATUS_OPEN) -> str:
    """Coerce a to-do status filter into one of the three we serve.

    Anything unrecognised reads as `open`, which is what a shopping list on a
    wrist is asking for and what a document written before the key existed
    meant without saying so.
    """
    if isinstance(raw, str):
        candidate = raw.strip().lower()
        for known in STATUSES:
            if candidate == known.lower():
                return known
    return default


def normalize_sort(raw: Any, default: str = SORT_LIST) -> str:
    """Coerce a to-do sort into one of the two we serve."""
    if isinstance(raw, str) and raw.strip().lower() == SORT_DUE:
        return SORT_DUE
    return default


def normalize_forecast_type(raw: Any, default: str = FORECAST_HOURLY) -> str:
    """Coerce a forecast granularity into one of the three we serve.

    Case-insensitive, so a document holding `twicedaily` still draws rather
    than silently falling back to hourly.
    """
    if isinstance(raw, str):
        candidate = raw.strip().lower()
        for known in FORECAST_TYPES:
            if candidate == known.lower():
                return known
    return default


def forecast_service_type(kind: str) -> str:
    """The word `weather.get_forecasts` wants for one of our granularities."""
    return _FORECAST_SERVICE_TYPES.get(kind, "hourly")


def normalize_entities(raw: Any, single: Any = None) -> list[str]:
    """The entity list of a list request, cleaned, deduplicated and capped.

    Blanks and non-strings drop, surrounding space goes, and a repeated id is
    kept once: naming the same calendar twice is one calendar, not every event
    drawn twice. `single` is the flat `entity_id` key a single-entity source
    (forecast) sends instead of a list.

    Raises `ListItemsError` above `MAX_ENTITIES`, because a request the server
    silently truncated would draw a list that answers a different question
    than the one the editor showed.
    """
    candidates: list[Any] = []
    if isinstance(raw, (list, tuple)):
        candidates.extend(raw)
    elif isinstance(raw, str):
        candidates.append(raw)
    if isinstance(single, str):
        candidates.append(single)

    seen: list[str] = []
    for candidate in candidates:
        if not isinstance(candidate, str):
            continue
        entity_id = candidate.strip()
        if entity_id and entity_id not in seen:
            seen.append(entity_id)
    if len(seen) > MAX_ENTITIES:
        raise ListItemsError(
            f"at most {MAX_ENTITIES} entities per list, got {len(seen)}"
        )
    return seen


def _parse_iso(text: str) -> datetime | None:
    """One ISO 8601 date or datetime, however the integration spelled it."""
    candidate = text.strip()
    if not candidate:
        return None
    if candidate[-1] in ("Z", "z"):
        candidate = candidate[:-1] + "+00:00"
    try:
        return datetime.fromisoformat(candidate)
    except ValueError:
        return None


def parse_time_value(raw: Any, tz: tzinfo) -> tuple[int | None, bool]:
    """One calendar or to-do time as `(unix seconds, is all-day)`.

    Home Assistant's calendar integrations answer in more than one shape. A
    timed event is an ISO datetime string, usually with an offset; an all-day
    event is a bare `2026-09-15`, and some integrations wrap either in
    `{"dateTime": …}` / `{"date": …}`. A bare date is a floating local date, so
    it becomes local midnight in Home Assistant's own time zone rather than
    midnight UTC, which is a day out for most of the world.

    A datetime with no offset is read as local too, for the same reason.
    """
    if isinstance(raw, bool):
        return None, False
    if isinstance(raw, (int, float)):
        return int(raw), False
    if isinstance(raw, dict):
        moment = raw.get("dateTime")
        if isinstance(moment, str):
            return parse_time_value(moment, tz)[0], False
        day = raw.get("date")
        if isinstance(day, str):
            return parse_time_value(day, tz)[0], True
        return None, False
    if not isinstance(raw, str):
        return None, False

    text = raw.strip()
    if not text:
        return None, False
    all_day = len(text) <= 10
    parsed = _parse_iso(text)
    if parsed is None:
        return None, all_day
    if all_day:
        parsed = datetime.combine(parsed.date(), time.min)
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=tz)
    return int(parsed.timestamp()), all_day


def _text(raw: Any) -> str | None:
    """A non-empty stripped string, or None so the field is left out."""
    if not isinstance(raw, str):
        return None
    trimmed = raw.strip()
    return trimmed or None


def _number(raw: Any) -> float | int | None:
    """A number as it stands. Numeric strings count; booleans do not."""
    if isinstance(raw, bool) or raw is None:
        return None
    if isinstance(raw, (int, float)):
        return raw if raw == raw else None
    if isinstance(raw, str):
        try:
            return float(raw.strip())
        except ValueError:
            return None
    return None


def _clean(item: dict[str, Any]) -> dict[str, Any]:
    """Drop the fields that have no value, keeping the rest in order.

    An absent field resolves nil on the client and draws `--`, which is the
    same answer as sending a null and costs nothing on the wire.
    """
    return {key: value for key, value in item.items() if value is not None}


def cap_strings(item: dict[str, Any]) -> dict[str, Any]:
    """Cut every string field of one item to its cap.

    `description` gets the longer one: it is the only field anybody writes a
    sentence into, and a row that shows it usually shows nothing else.
    """
    capped: dict[str, Any] = {}
    for key, value in item.items():
        if isinstance(value, str):
            limit = (
                MAX_DESCRIPTION_CHARS
                if key in _LONG_STRING_FIELDS
                else MAX_STRING_CHARS
            )
            capped[key] = value[:limit]
        else:
            capped[key] = value
    return capped


def reply_bytes(items: list[dict[str, Any]], total: int) -> int:
    """How long the reply would be on the wire: compact JSON, UTF-8."""
    encoded = json.dumps(
        {"items": items, "total": total},
        separators=(",", ":"),
        ensure_ascii=False,
        default=str,
    )
    return len(encoded.encode("utf-8"))


def trim_to_bytes(
    items: list[dict[str, Any]], total: int, limit: int = MAX_REPLY_BYTES
) -> list[dict[str, Any]]:
    """Drop rows from the end until the reply fits.

    From the end because a list is read from the top: the next event matters
    more than the fifth one. `total` stays as it was, so a layer reading
    `listStat total` still reports what the source held.
    """
    kept = list(items)
    while kept and reply_bytes(kept, total) > limit:
        kept.pop()
    return kept


def looks_like_rows(rows: Any, key: str) -> bool:
    """Whether an array the walker found is the rows it was looking for.

    An empty array counts: a to-do list with nothing on it is an answer, not a
    failed search.
    """
    if not isinstance(rows, list):
        return False
    if not rows:
        return True
    first = rows[0]
    if not isinstance(first, dict):
        return False
    return bool(_ROW_MARKERS.get(key, frozenset()) & set(first))


def extract_rows(
    container: Any, entity_id: str, key: str, depth: int = 0
) -> list[dict[str, Any]] | None:
    """Find the rows in whatever shape the service answered with.

    The common shape is `{"<entity_id>": {"<key>": [...]}}`, and that is what
    the first two branches take. The rest is the search the watch app already
    does for `todo.get_items`, which has come back bare, wrapped in
    `response`, and wrapped in `service_response` across Home Assistant
    releases. Returns None when nothing that looks like rows is found, which
    reads as "no items" rather than as an error.
    """
    if depth > _MAX_WALK_DEPTH:
        return None

    if looks_like_rows(container, key):
        return [row for row in container if isinstance(row, dict)]

    if isinstance(container, dict):
        payload = container.get(entity_id)
        if isinstance(payload, dict) and looks_like_rows(payload.get(key), key):
            return [row for row in payload[key] if isinstance(row, dict)]
        if looks_like_rows(container.get(key), key):
            return [row for row in container[key] if isinstance(row, dict)]
        for wrapper in _WRAPPER_KEYS:
            if wrapper in container:
                found = extract_rows(container[wrapper], entity_id, key, depth + 1)
                if found is not None:
                    return found
        for value in container.values():
            found = extract_rows(value, entity_id, key, depth + 1)
            if found is not None:
                return found
        return None

    if isinstance(container, list):
        for value in container:
            found = extract_rows(value, entity_id, key, depth + 1)
            if found is not None:
                return found
    return None


def _entity_payloads(
    response: Any, entity_ids: list[str]
) -> list[tuple[str, Any]]:
    """Split a multi-entity response into one payload per entity.

    A response keyed by entity id is split on those keys, so every row knows
    which calendar or which list it came from. Any other shape is handed to
    the first entity whole: one list answered in an old shape is still one
    list, and claiming it for each of five entities would draw it five times.
    """
    if isinstance(response, dict) and any(one in response for one in entity_ids):
        return [(one, response[one]) for one in entity_ids if one in response]
    return [(entity_ids[0] if entity_ids else "", response)]


def normalize_calendar_events(
    response: Any,
    entity_ids: list[str],
    names: dict[str, str],
    tz: tzinfo,
) -> list[dict[str, Any]]:
    """`calendar.get_events` rows as list items, unsorted.

    An event with no summary or no readable start is dropped rather than drawn
    as a blank row. `isAllDay` is true when either end of the event is a bare
    date, which is how a single-day all-day entry and a multi-day one both
    read as all-day.
    """
    items: list[dict[str, Any]] = []
    for entity_id, payload in _entity_payloads(response, entity_ids):
        for row in extract_rows(payload, entity_id, "events") or []:
            title = _text(row.get("summary"))
            start, start_all_day = parse_time_value(row.get("start"), tz)
            if title is None or start is None:
                continue
            end, end_all_day = parse_time_value(row.get("end"), tz)
            items.append(
                cap_strings(
                    _clean(
                        {
                            "title": title,
                            "start": start,
                            "end": end,
                            "isAllDay": bool(start_all_day or end_all_day),
                            "location": _text(row.get("location")),
                            "description": _text(row.get("description")),
                            "calendar": names.get(entity_id, entity_id),
                            "calendarId": entity_id,
                        }
                    )
                )
            )
    return items


def merge_and_sort(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Calendar items from every calendar in one list, earliest first.

    An all-day event sorts before a timed one that starts at the same second,
    which is the reading a day's agenda wants: bin collection and birthdays at
    the top, then the morning's meetings. The sort is stable, so two events at
    the same moment keep the order their calendars were named in.
    """
    return sorted(
        items,
        key=lambda item: (item.get("start", 0), 0 if item.get("isAllDay") else 1),
    )


def normalize_todo_items(
    response: Any,
    entity_ids: list[str],
    names: dict[str, str],
    status: str,
    sort: str,
    tz: tzinfo,
) -> list[dict[str, Any]]:
    """`todo.get_items` rows as list items, filtered and sorted.

    The status filter is applied here as well as in the request: an
    integration that ignores the service's `status` argument would otherwise
    put completed items on a list the user asked to see the open ones of. A
    row with no status at all counts as open, which is what an item that has
    never been ticked is.

    `due` is unix seconds, or the empty string when the item has no date. Not
    a missing key: a row template binding `due` should draw nothing rather
    than `--` for an item nobody has dated.
    """
    items: list[dict[str, Any]] = []
    for entity_id, payload in _entity_payloads(response, entity_ids):
        for row in extract_rows(payload, entity_id, "items") or []:
            raw_status = row.get("status")
            done = (
                isinstance(raw_status, str)
                and raw_status.strip().lower() == HA_STATUS_DONE
            )
            if status == STATUS_OPEN and done:
                continue
            if status == STATUS_DONE and not done:
                continue
            title = _text(row.get("summary"))
            if title is None:
                continue
            due, _ = parse_time_value(
                row.get("due")
                if row.get("due") is not None
                else row.get("due_datetime") or row.get("due_date"),
                tz,
            )
            items.append(
                cap_strings(
                    _clean(
                        {
                            "title": title,
                            "status": STATUS_DONE if done else STATUS_OPEN,
                            "due": due if due is not None else "",
                            "description": _text(row.get("description")),
                            "uid": _text(row.get("uid")),
                            "list": names.get(entity_id, entity_id),
                            "listId": entity_id,
                        }
                    )
                )
            )

    if sort == SORT_DUE:
        # Undated items last, and stable inside each group so a list's own
        # order still shows through among items sharing a date.
        items = sorted(
            items,
            key=lambda item: (0, item["due"]) if isinstance(item["due"], int) else (1, 0),
        )
    return items


def normalize_forecast(
    response: Any,
    entity_id: str,
    unit: str | None,
    tz: tzinfo,
) -> list[dict[str, Any]]:
    """`weather.get_forecasts` rows as list items, in the order given.

    A forecast is already chronological, so nothing is sorted. `unit` is the
    weather entity's own `temperature_unit`, carried on every row so a
    template can print it without a second lookup.
    """
    items: list[dict[str, Any]] = []
    for row in extract_rows(response, entity_id, "forecast") or []:
        moment, _ = parse_time_value(row.get("datetime"), tz)
        if moment is None:
            continue
        daytime = row.get("is_daytime")
        items.append(
            cap_strings(
                _clean(
                    {
                        "time": moment,
                        "condition": _text(row.get("condition")),
                        "temperature": _number(row.get("temperature")),
                        "templow": _number(row.get("templow")),
                        "unit": _text(unit),
                        "precipitation": _number(row.get("precipitation")),
                        "precipitationProbability": _number(
                            row.get("precipitation_probability")
                        ),
                        "humidity": _number(row.get("humidity")),
                        "windSpeed": _number(row.get("wind_speed")),
                        "isDaytime": daytime if isinstance(daytime, bool) else None,
                    }
                )
            )
        )
    return items


class ListResult(NamedTuple):
    """The finished rows and how many there were before the slice.

    `total` is what a `listStat total` draws, so it counts the items the
    source held after filtering and before the row count cut them down.
    """

    items: list[dict[str, Any]]
    total: int


def _friendly_names(hass: HomeAssistant, entity_ids: list[str]) -> dict[str, str]:
    """Each entity's display name, falling back to its id."""
    names: dict[str, str] = {}
    for entity_id in entity_ids:
        state = hass.states.get(entity_id)
        name = None
        if state is not None:
            name = state.attributes.get("friendly_name")
        names[entity_id] = name if isinstance(name, str) and name.strip() else entity_id
    return names


async def _call_service(
    hass: HomeAssistant,
    domain: str,
    service: str,
    data: dict[str, Any],
) -> Any:
    """One `return_response` service call, with its failure named.

    Voluptuous errors are caught alongside Home Assistant's own: a service
    that rejects an argument raises `vol.Invalid`, which is not a
    `HomeAssistantError`, and without this it would reach the caller as an
    unhandled 500 rather than as this list's error.
    """
    import voluptuous as vol
    from homeassistant.exceptions import HomeAssistantError

    try:
        return await hass.services.async_call(
            domain, service, data, blocking=True, return_response=True
        )
    except HomeAssistantError as err:
        _LOGGER.warning("%s.%s failed: %s", domain, service, err)
        raise HomeAssistantError(f"{domain}.{service} failed: {err}") from err
    except vol.Invalid as err:
        _LOGGER.warning("%s.%s rejected the request: %s", domain, service, err)
        raise HomeAssistantError(f"{domain}.{service} rejected the request") from err


async def async_list_items(
    hass: HomeAssistant,
    spec: dict[str, Any],
    now: datetime | None = None,
) -> ListResult:
    """Fetch one list source. Returns the rows and the pre-slice count.

    `spec` is the same object on both transports:

        {"source": "calendar", "entities": [...], "hours": 24, "limit": 4}
        {"source": "todo", "entities": [...], "status": "open",
         "sort": "list", "limit": 6}
        {"source": "forecast", "entity_id": "weather.home",
         "type": "hourly", "limit": 6}

    Raises `ListItemsError` when the spec cannot be served (an unknown source,
    no entity, too many of them) and `HomeAssistantError` when the service
    call itself fails. The two are separate so a caller can answer 400 for the
    first and 502 for the second.
    """
    source = spec.get("source")
    if isinstance(source, str) and source in TEMPLATE_SOURCES:
        raise ListItemsError(
            f"source {source} is rendered as a template, not fetched here"
        )
    if source not in SERVICE_SOURCES:
        raise ListItemsError(f"unknown list source {source!r}")

    from homeassistant.util import dt as dt_util

    tz = dt_util.DEFAULT_TIME_ZONE
    moment = now or dt_util.now()
    limit = clamp_limit(spec.get("limit"))
    entity_ids = normalize_entities(spec.get("entities"), spec.get("entity_id"))
    if not entity_ids:
        raise ListItemsError("entities required")

    if source == SOURCE_CALENDAR:
        hours = clamp_hours(spec.get("hours"))
        response = await _call_service(
            hass,
            "calendar",
            "get_events",
            {
                "entity_id": entity_ids,
                # The window starts now, so an event in progress comes back
                # (every calendar integration answers with what overlaps the
                # window, not only what begins inside it).
                "start_date_time": moment.isoformat(),
                "end_date_time": (moment + timedelta(hours=hours)).isoformat(),
            },
        )
        items = merge_and_sort(
            normalize_calendar_events(
                response, entity_ids, _friendly_names(hass, entity_ids), tz
            )
        )
    elif source == SOURCE_TODO:
        status = normalize_status(spec.get("status"))
        wanted = (
            [HA_STATUS_OPEN, HA_STATUS_DONE]
            if status == STATUS_ALL
            else [HA_STATUS_DONE if status == STATUS_DONE else HA_STATUS_OPEN]
        )
        response = await _call_service(
            hass,
            "todo",
            "get_items",
            {"entity_id": entity_ids, "status": wanted},
        )
        items = normalize_todo_items(
            response,
            entity_ids,
            _friendly_names(hass, entity_ids),
            status,
            normalize_sort(spec.get("sort")),
            tz,
        )
    else:
        entity_id = entity_ids[0]
        kind = normalize_forecast_type(spec.get("type"))
        response = await _call_service(
            hass,
            "weather",
            "get_forecasts",
            {"entity_id": entity_id, "type": forecast_service_type(kind)},
        )
        state = hass.states.get(entity_id)
        unit = state.attributes.get("temperature_unit") if state is not None else None
        items = normalize_forecast(
            response, entity_id, unit if isinstance(unit, str) else None, tz
        )

    total = len(items)
    return ListResult(trim_to_bytes(items[:limit], total), total)
