"""Every text source behind one watch face, answered in a single round trip.

A face-wide refresh used to mean one signed request per data source per
complication: a face with eight complications, each reading a template, a
couple of entity states and a chart, opened a dozen connections and paid the
HMAC and TLS cost on every one. `op=bundle` asks all of it at once.

Two things live here rather than in `wa_v2_views`:

* The core of each single op. `async_state_result`, `async_history_result`,
  `async_statistics_result`, `async_list_result` and `async_template_result`
  are what `op=state`, `op=history`, `op=statistics`, `op=list` and
  `op=template` do once their reply has been signed and shipped. The single
  ops call these and so does the bundle, so a bundled answer is the same
  bytes the single op would have sent. Copying the handler bodies into a
  second implementation is exactly how the two would drift.

* The bundle itself: `normalize_bundle_request` refuses a malformed request
  before any work starts, and `async_run_bundle` runs every section
  concurrently and captures each item's failure on its own, so one dead
  entity never blanks the other seven complications.

Like `history_series`, `list_items` and `statistics_series`, Home Assistant
is imported for types only at module level and the runtime imports sit inside
the functions. That keeps this module importable on its own, which is what
lets the caps, the request shaping and the gather be tested without a full HA
install.
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
from datetime import datetime, timezone
from functools import partial
from typing import TYPE_CHECKING, Any, NamedTuple

from .history_series import (
    HistorySeriesError,
    async_history_series,
    clamp_points,
    normalize_combine,
    normalize_entities,
    normalize_mode,
)
from .list_items import ListItemsError, async_list_items
from .statistics_series import (
    RECORDER_UNAVAILABLE,
    StatisticsSeriesError,
    async_statistics_series,
)

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

# Cap entries server-side so a flappy sensor over a wide window can't blow
# past the watch's budget. ~500 points renders cleanly in Charts and gzips
# down to a couple KB.
MAX_HISTORY_ENTRIES = 500

# What one bundle may ask for. A watch face holds at most a handful of
# complications and each reads a few sources, so these are far above any real
# face; they exist so a confused client cannot turn one signed request into
# hundreds of recorder queries. History, statistics and lists share a budget
# because they cost the same kind of work.
MAX_BUNDLE_ITEMS = 64
MAX_BUNDLE_STATES = 64

# How much of a failure's text rides back in `errors`. Long enough to name the
# entity and the reason, short enough that sixty of them stay a small reply.
MAX_ERROR_CHARS = 200


class OpError(Exception):
    """One source's failure, carrying how the single op answers it.

    `status` is the HTTP status the single op returns and `body` is the JSON
    it signs, or None when the single op answers plain text instead. The
    bundle uses neither: it records the message under `errors` and leaves that
    item out of its section.
    """

    def __init__(
        self,
        message: str,
        *,
        status: int = 400,
        body: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(message)
        self.status = status
        self.body = body


class BundleRequestError(Exception):
    """The bundle request itself is malformed; the caller answers 400."""


def template_text(value: Any) -> str:
    """One rendered template as the watch reads it.

    The signed `template` op renders with `parse_result=True`, so what leaves
    the server is native JSON: a number, a bool, an object. Swift flattens
    that back to text in `CodingUtilities.homeAssistantTemplateResult` before
    anything looks at it, and this is the same arithmetic, so the panel's
    preview, a bundled answer and the wrist all read one string rather than
    three formattings of one render. Rendering with `parse_result=False`
    instead was a second implementation of "what does this template say", and
    it disagreed: `21.50` stayed "21.50" in the browser and became "21.5" on
    the wrist.

    A float that lands on a whole number is written without its `.0`, which is
    what `NSNumber.stringValue` does with the same JSON on the watch.
    """
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, bool):
        return "true" if value else "false"
    if value is None:
        return ""
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    if isinstance(value, (int, float)):
        return str(value)
    try:
        return json.dumps(value, sort_keys=True, separators=(",", ":"))
    except (TypeError, ValueError):
        return str(value)


# ── the single ops' cores ────────────────────────────────────────────────


async def async_state_result(
    hass: HomeAssistant, payload: dict[str, Any]
) -> dict[str, Any]:
    """Single-entity state read.

    Payload: `{"entity_id": "<entity_id>"}`.

    Reply:
        {
          "found": true,
          "entity_id": "<entity_id>",
          "state": "<state>",
          "attributes": {...},
          "last_updated": "<iso8601>" | null
        }

    An entity the state machine does not hold raises `OpError` carrying the
    `{"found": false, ...}` body the single op signs with its 404.
    """
    entity_id = payload.get("entity_id")
    if not isinstance(entity_id, str) or not entity_id:
        raise OpError("entity_id required")

    state = hass.states.get(entity_id)
    if state is None:
        raise OpError(
            f"{entity_id} not found",
            status=404,
            body={"found": False, "entity_id": entity_id},
        )

    return {
        "found": True,
        "entity_id": state.entity_id,
        "state": state.state,
        "attributes": dict(state.attributes),
        "last_updated": state.last_updated.isoformat()
        if state.last_updated
        else None,
    }


async def async_history_result(
    hass: HomeAssistant, payload: dict[str, Any]
) -> dict[str, Any]:
    """Single-entity state-change history for the watch's chart view.

    Payload shape:
        {
          "entity_id": "<entity_id>",
          "start_ms": <epoch ms>,
          "end_ms":   <epoch ms>?,   # defaults to now
          "points":   <int>?,        # see below
          "mode":     "numeric" | "states"?,   # defaults to numeric
          "gaps":     <bool>?,       # chart form only, defaults to false
          "entities": [<entity_id>, ...]?,     # states form only, see below
          "combine":  "any" | "all"?,          # defaults to any
        }

    With `entities`, the reply merges those entities' histories into one
    strip instead of reading `entity_id` alone: `any` is on while at least
    one of them is active, `all` only while every one of them is. The series
    that comes back has exactly the shape of a single entity's states series.
    `entity_id` may be left out when `entities` is there; up to twenty
    entities, above which the request is refused rather than truncated.

    With `gaps: true`, a chart slot spent entirely `unavailable` or `unknown`
    is an empty token in the series (`12.1,,13.0`) instead of the last value
    carried forward. Only exactly `true` turns it on.

    With `points`, the reply is a complication chart's series instead of a
    state log: the window is cut into that many equal slots, the numeric
    states in each are averaged, and the result comes back as one string:

        {"entity_id": "<entity_id>", "series": "3068,3070,3071"}

    That form exists because a chart needs about twenty numbers and a busy
    sensor logs thousands of rows. Bucketing here keeps the difference off
    the watch's radio. The log form below is unchanged and still serves the
    watch's own history screen.

    With `mode: "states"` the same request answers a state timeline instead:
    nothing is read as a number, and the series is `offset:state` pairs, the
    offsets being seconds since the window opened.

        {"entity_id": "<entity_id>", "series": "0:off 1200:on 1860:off"}

    Log reply shape (compact, designed for cheap decode on watch):
        {
          "entity_id": "<entity_id>",
          "entries": [
            {"s": "<state>", "t": <epoch_ms>},
            ...
          ]
        }

    Backed by recorder's in-process `state_changes_during_period`: no
    WebSocket round-trip, no HTTP hop inside HA. `significant_changes_only`
    drops sub-resolution noise; `minimal_response` strips attributes (the
    chart only needs state + timestamp).
    """
    from homeassistant.exceptions import HomeAssistantError

    # An aggregate timeline names its entities in `entities` and may leave
    # `entity_id` out entirely. The first of them stands in for logging and
    # for the reply's echo, so every other reader of this op is unchanged.
    try:
        group = normalize_entities(payload.get("entities"))
    except HistorySeriesError as err:
        raise OpError(str(err)) from err

    entity_id = payload.get("entity_id")
    if (not isinstance(entity_id, str) or not entity_id) and group:
        entity_id = group[0]
    if not isinstance(entity_id, str) or not entity_id:
        raise OpError("entity_id required")

    start_raw = payload.get("start_ms")
    if not isinstance(start_raw, (int, float)):
        raise OpError("start_ms required")
    try:
        start = datetime.fromtimestamp(start_raw / 1000.0, tz=timezone.utc)
    except (ValueError, OSError, OverflowError) as err:
        raise OpError("start_ms invalid") from err

    end: datetime | None = None
    end_raw = payload.get("end_ms")
    if isinstance(end_raw, (int, float)):
        try:
            end = datetime.fromtimestamp(end_raw / 1000.0, tz=timezone.utc)
        except (ValueError, OSError, OverflowError) as err:
            raise OpError("end_ms invalid") from err

    # Chart form. The window is already known, so the span is derived from it
    # rather than re-sent, and the shared module does the rest.
    if payload.get("points") is not None:
        window_end = end or datetime.now(timezone.utc)
        minutes = max(1, int((window_end - start).total_seconds() // 60))
        try:
            series = await async_history_series(
                hass,
                entity_id,
                minutes,
                clamp_points(payload.get("points")),
                now=window_end,
                mode=normalize_mode(payload.get("mode")),
                gaps=payload.get("gaps") is True,
                entities=group,
                combine=normalize_combine(payload.get("combine")),
            )
        except HistorySeriesError as err:
            raise OpError(
                str(err), status=502, body={"ok": False, "error": str(err)}
            ) from err
        return {"entity_id": entity_id, "series": series}

    try:
        from homeassistant.components.recorder import get_instance
        from homeassistant.components.recorder.history import (
            state_changes_during_period,
        )
    except ImportError as err:
        raise OpError(
            "recorder unavailable",
            status=503,
            body={"ok": False, "error": "recorder unavailable"},
        ) from err

    recorder = get_instance(hass)
    try:
        # Keyword args via `partial`, because `state_changes_during_period`'s
        # positional signature changed across recorder versions, so binding
        # by name keeps us safe. Defaults give us oldest-first ordering,
        # no row limit (we cap below), and the start-of-window anchor state
        # so the chart has a leftmost data point. `no_attributes=True` is
        # the only override, since we never use attributes here.
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
        _LOGGER.warning("op=history failed for %s: %s", entity_id, err)
        raise OpError(
            str(err), status=502, body={"ok": False, "error": str(err)}
        ) from err

    raw = states_by_entity.get(entity_id, []) or []
    # Most recent N, since the chart only needs the tail of the window.
    if len(raw) > MAX_HISTORY_ENTRIES:
        raw = raw[-MAX_HISTORY_ENTRIES:]

    entries = []
    for s in raw:
        last_changed = getattr(s, "last_changed", None)
        if last_changed is None:
            continue
        entries.append(
            {
                "s": s.state,
                "t": int(last_changed.timestamp() * 1000),
            }
        )

    return {"entity_id": entity_id, "entries": entries}


async def async_statistics_result(
    hass: HomeAssistant, payload: dict[str, Any]
) -> dict[str, Any]:
    """Long-term statistics for a complication chart, as one series string.

    Payload shape:
        {
          "entity_id": "<entity_id>",
          "minutes":   <int>?,    # span, rolling back from now
          "period":    "5minute" | "hour" | "day" | "week" | "month"?,
          "type":      "mean" | "min" | "max" | "change" | "sum"?,
          "gaps":      <bool>?,   # defaults to false
        }

    With `gaps: true`, a missing period and a row with no value are empty
    tokens (`0.42,,0.38`) instead of carried or zero-filled.

    Reply:
        {"entity_id": "<entity_id>", "series": "0.42,0.51,0.38"}

    A separate source rather than a mode on `history`: the history reader
    already multiplexes two reply shapes on whether `points` is present, and
    the two questions share no parameters beyond the entity. The reply shape
    is the chart series form on purpose, so the watch's draw path does not
    care which of the two produced it.

    Unlike history, the span is not derived from a window the caller sends.
    Statistics are never purged, so there is no "start of what we still have"
    for the caller to compute; it asks for a span and the module clamps it.
    """
    entity_id = payload.get("entity_id")
    if not isinstance(entity_id, str) or not entity_id:
        raise OpError("entity_id required")

    try:
        series = await async_statistics_series(
            hass,
            entity_id,
            payload.get("minutes"),
            payload.get("period"),
            payload.get("type"),
            gaps=payload.get("gaps") is True,
        )
    except StatisticsSeriesError as err:
        status = 503 if str(err) == RECORDER_UNAVAILABLE else 502
        raise OpError(
            str(err), status=status, body={"ok": False, "error": str(err)}
        ) from err
    return {"entity_id": entity_id, "series": series}


async def async_list_result(
    hass: HomeAssistant, payload: dict[str, Any]
) -> dict[str, Any]:
    """Calendar, to-do or forecast rows for a complication's list layer.

    Payload shape:
        {
          "source":    "calendar" | "todo" | "forecast",
          "entities":  [<entity_id>, ...],   # calendar and todo, up to 5
          "entity_id": "<entity_id>",        # forecast, the flat form
          "hours":     <int>?,   # calendar window, 1..8784 (a year), default 24
          "status":    "open" | "done" | "all"?,   # todo, default open
          "sort":      "list" | "due"?,            # todo, default list
          "type":      "hourly" | "daily" | "twiceDaily"?,  # forecast
          "limit":     <int>?,   # the layer's row count, clamped to 12
        }

    Reply:
        {"items": [{...}, ...], "total": 7}

    `total` is the count before the slice, so a layer reading `listStat total`
    can say "7 events" while drawing four of them. The rows come back sorted,
    with strings capped and every timestamp in unix seconds; everything
    time-relative (a countdown, how overdue something is) is computed on the
    watch from its own clock, so a cached list stays right between fetches.

    The three Jinja sources (`entities`, `attribute`, `template`) are not
    served here. They ride in the face's rendered value document, which the
    watch already fetches, and asking for one is a refusal rather than a
    silently empty list.
    """
    from homeassistant.exceptions import HomeAssistantError

    try:
        fetched = await async_list_items(hass, payload)
    except ListItemsError as err:
        raise OpError(
            str(err), status=400, body={"ok": False, "error": str(err)}
        ) from err
    except HomeAssistantError as err:
        _LOGGER.warning("op=list failed: %s", err)
        raise OpError(
            str(err), status=502, body={"ok": False, "error": str(err)}
        ) from err
    return {"items": fetched.items, "total": fetched.total}


async def async_template_result(
    hass: HomeAssistant, payload: dict[str, Any]
) -> dict[str, Any]:
    """Render a Jinja template. Payload: `{template, variables?}`.

    Renders with `parse_result` left on, so `result` can be a number, a bool
    or an object rather than a string; the client flattens it to text
    (`CodingUtilities.homeAssistantTemplateResult`). The panel's
    `render_values` command renders the same way and flattens it server-side
    with `template_text`, so the editor preview reads the string the watch
    reads.

    Reply: `{"ok": true, "result": <native>}`.
    """
    from homeassistant.helpers.template import Template, TemplateError

    template_str = payload.get("template")
    variables = payload.get("variables")
    if not isinstance(template_str, str) or not template_str:
        raise OpError("template required")
    if variables is not None and not isinstance(variables, dict):
        raise OpError("variables must be an object")

    try:
        tpl = Template(template_str, hass)
        result = tpl.async_render(variables=variables)
    except TemplateError as err:
        raise OpError(
            str(err), status=400, body={"ok": False, "error": str(err)}
        ) from err

    return {"ok": True, "result": result}


# ── the bundle ───────────────────────────────────────────────────────────


class BundleRequest(NamedTuple):
    """A validated bundle request, ready to run.

    `history`, `statistics` and `lists` hold `(key, payload)` pairs in the
    order the caller sent them; the key is the caller's own opaque string and
    the payload is exactly what the matching single op takes.
    """

    template: str | None
    states: list[str]
    history: list[tuple[str, dict[str, Any]]]
    statistics: list[tuple[str, dict[str, Any]]]
    lists: list[tuple[str, dict[str, Any]]]

    @property
    def item_count(self) -> int:
        """History, statistics and list items together."""
        return len(self.history) + len(self.statistics) + len(self.lists)


def _normalize_items(
    payload: dict[str, Any], field: str
) -> list[tuple[str, dict[str, Any]]]:
    """Read one keyed section, refusing anything the runner could not answer.

    A missing section means "nothing asked". Everything else is checked up
    front and refused whole: a request whose shape is wrong is a client bug,
    and answering half of it would hide the bug behind a face that draws
    almost right.
    """
    raw = payload.get(field)
    if raw is None:
        return []
    if not isinstance(raw, list):
        raise BundleRequestError(f"{field} must be an array")

    items: list[tuple[str, dict[str, Any]]] = []
    seen: set[str] = set()
    for index, item in enumerate(raw):
        if not isinstance(item, dict):
            raise BundleRequestError(f"{field}[{index}] must be an object")
        key = item.get("key")
        if not isinstance(key, str) or not key:
            raise BundleRequestError(
                f"{field}[{index}] needs a non-empty string key"
            )
        if key in seen:
            # The reply is keyed by this string, so a repeat would silently
            # drop one of the two answers.
            raise BundleRequestError(f"duplicate {field} key {key!r}")
        seen.add(key)
        items.append((key, item))
    return items


def normalize_bundle_request(payload: dict[str, Any]) -> BundleRequest:
    """Validate a bundle body. Raises `BundleRequestError` for a 400."""
    template = payload.get("template")
    if template is not None and (not isinstance(template, str) or not template):
        raise BundleRequestError("template must be a non-empty string")

    raw_states = payload.get("states")
    states: list[str] = []
    if raw_states is not None:
        if not isinstance(raw_states, list):
            raise BundleRequestError("states must be an array")
        seen: set[str] = set()
        for index, entity_id in enumerate(raw_states):
            if not isinstance(entity_id, str) or not entity_id:
                raise BundleRequestError(
                    f"states[{index}] must be a non-empty entity id"
                )
            if entity_id in seen:
                raise BundleRequestError(f"duplicate states entry {entity_id!r}")
            seen.add(entity_id)
            states.append(entity_id)
        if len(states) > MAX_BUNDLE_STATES:
            raise BundleRequestError(
                f"at most {MAX_BUNDLE_STATES} states per bundle, got {len(states)}"
            )

    request = BundleRequest(
        template=template,
        states=states,
        history=_normalize_items(payload, "history"),
        statistics=_normalize_items(payload, "statistics"),
        lists=_normalize_items(payload, "lists"),
    )
    if request.item_count > MAX_BUNDLE_ITEMS:
        raise BundleRequestError(
            f"at most {MAX_BUNDLE_ITEMS} history, statistics and list items "
            f"per bundle, got {request.item_count}"
        )
    return request


def _error_text(err: BaseException) -> str:
    """A failure as the watch sees it: short, and never empty."""
    text = str(err) or type(err).__name__
    if len(text) > MAX_ERROR_CHARS:
        text = text[:MAX_ERROR_CHARS]
    return text


async def async_run_bundle(
    hass: HomeAssistant,
    request: BundleRequest,
    *,
    state_result=async_state_result,
    history_result=async_history_result,
    statistics_result=async_statistics_result,
    list_result=async_list_result,
    template_result=async_template_result,
) -> dict[str, Any]:
    """Run every section of a bundle at once and shape the reply.

    Reply:
        {
          "template":   "<flattened render>" | null,
          "states":     {"<entity_id>": {...}},
          "history":    {"<key>": {...}},
          "statistics": {"<key>": {...}},
          "lists":      {"<key>": {...}},
          "errors":     {"<key | entity_id | 'template'>": "<short message>"}
        }

    Every item runs concurrently and its failure is captured on its own, so a
    dead entity or a recorder hiccup costs that one complication and nothing
    else. A failed item is absent from its section and named in `errors`,
    which is why the watch must read both rather than assume a section holds
    one entry per request.

    `errors` is one flat map across the sections, so a caller that gives a
    history item the same key as an entity id it also asked for gets one of
    the two messages. Keys are the caller's own; distinct ones stay distinct.

    The per-source runners are arguments so a test can drive the gather
    without Home Assistant. Nothing in the integration passes them.
    """
    started = time.monotonic()

    jobs: list[tuple[str, str]] = []
    coros = []
    if request.template is not None:
        jobs.append(("template", "template"))
        coros.append(template_result(hass, {"template": request.template}))
    for entity_id in request.states:
        jobs.append(("states", entity_id))
        coros.append(state_result(hass, {"entity_id": entity_id}))
    for key, item in request.history:
        jobs.append(("history", key))
        coros.append(history_result(hass, item))
    for key, item in request.statistics:
        jobs.append(("statistics", key))
        coros.append(statistics_result(hass, item))
    for key, item in request.lists:
        jobs.append(("lists", key))
        coros.append(list_result(hass, item))

    # return_exceptions keeps one bad source from cancelling the rest; the
    # failures are sorted out below rather than raised.
    results = await asyncio.gather(*coros, return_exceptions=True)

    body: dict[str, Any] = {
        "template": None,
        "states": {},
        "history": {},
        "statistics": {},
        "lists": {},
        "errors": {},
    }
    for (section, key), result in zip(jobs, results):
        if isinstance(result, BaseException):
            body["errors"][key] = _error_text(result)
            continue
        if section == "template":
            body["template"] = template_text(result.get("result"))
        else:
            body[section][key] = result

    _LOGGER.debug(
        "op=bundle template=%s states=%d history=%d statistics=%d lists=%d "
        "errors=%d in %d ms",
        request.template is not None,
        len(request.states),
        len(request.history),
        len(request.statistics),
        len(request.lists),
        len(body["errors"]),
        int((time.monotonic() - started) * 1000),
    )
    return body
