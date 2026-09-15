"""The shaping behind a complication's list layer.

`list_items` is imported directly rather than through the integration package:
it deliberately keeps Home Assistant out of its module body (the runtime
imports sit inside `async_list_items`), so the response walking, the timestamp
conversion, the merge and the caps can be checked without a full HA install.
That is the whole point of the split, and this file is what proves it holds.

The rows here are the contract the watch and the editor preview both draw
from. Neither side reshapes them; they receive the finished items.
"""

from __future__ import annotations

import asyncio
import contextlib
import importlib.util
import json
import sys
import types
from datetime import datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

import pytest

_MODULE_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "list_items.py"
)
_spec = importlib.util.spec_from_file_location("list_items", _MODULE_PATH)
assert _spec is not None and _spec.loader is not None
list_items = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(list_items)

cap_strings = list_items.cap_strings
clamp_hours = list_items.clamp_hours
clamp_limit = list_items.clamp_limit
extract_rows = list_items.extract_rows
forecast_service_type = list_items.forecast_service_type
merge_and_sort = list_items.merge_and_sort
normalize_calendar_events = list_items.normalize_calendar_events
normalize_entities = list_items.normalize_entities
normalize_forecast = list_items.normalize_forecast
normalize_forecast_type = list_items.normalize_forecast_type
normalize_sort = list_items.normalize_sort
normalize_status = list_items.normalize_status
normalize_todo_items = list_items.normalize_todo_items
parse_time_value = list_items.parse_time_value
reply_bytes = list_items.reply_bytes
trim_to_bytes = list_items.trim_to_bytes

# A zone well off UTC, so a local-midnight bug cannot pass by accident.
TZ = ZoneInfo("America/Los_Angeles")

CAL_A = "calendar.work"
CAL_B = "calendar.family"
LIST_A = "todo.shopping"
LIST_B = "todo.chores"
WEATHER = "weather.home"

NAMES = {
    CAL_A: "Work",
    CAL_B: "Family",
    LIST_A: "Shopping",
    LIST_B: "Chores",
}


def local(year: int, month: int, day: int, hour: int = 0, minute: int = 0) -> int:
    """A wall-clock moment in the house's time zone, as unix seconds."""
    return int(datetime(year, month, day, hour, minute, tzinfo=TZ).timestamp())


# ── clamps and spellings ───────────────────────────────────────────────────


def test_the_calendar_window_clamps_to_two_weeks():
    assert clamp_hours(24) == 24
    assert clamp_hours(0) == 1
    assert clamp_hours(-5) == 1
    assert clamp_hours(10_000) == 336
    assert clamp_hours("nope") == 24
    assert clamp_hours(None) == 24


def test_the_row_limit_clamps_to_twelve():
    assert clamp_limit(4) == 4
    assert clamp_limit(12) == 12
    assert clamp_limit(99) == 12
    assert clamp_limit(0) == 1
    assert clamp_limit(None) == 12


def test_twice_daily_is_spelled_with_an_underscore_for_home_assistant():
    """The document says `twiceDaily` like every other key; the service does
    not, and a request spelled the document's way comes back empty."""
    assert normalize_forecast_type("twiceDaily") == "twiceDaily"
    assert normalize_forecast_type("twicedaily") == "twiceDaily"
    assert normalize_forecast_type("nonsense") == "hourly"
    assert forecast_service_type("twiceDaily") == "twice_daily"
    assert forecast_service_type("hourly") == "hourly"
    assert forecast_service_type("daily") == "daily"


def test_status_and_sort_fall_back_rather_than_fail():
    assert normalize_status("done") == "done"
    assert normalize_status("ALL") == "all"
    assert normalize_status(None) == "open"
    assert normalize_status("completed") == "open"
    assert normalize_sort("due") == "due"
    assert normalize_sort("anything") == "list"


def test_five_entities_is_the_cap_and_repeats_collapse():
    assert normalize_entities([CAL_A, CAL_B]) == [CAL_A, CAL_B]
    assert normalize_entities([CAL_A, " " + CAL_A, ""]) == [CAL_A]
    assert normalize_entities(None, WEATHER) == [WEATHER]
    assert normalize_entities([], WEATHER) == [WEATHER]
    # Refused rather than truncated: a list the server quietly cut would draw
    # a different answer than the one the editor showed.
    with pytest.raises(list_items.ListItemsError) as err:
        normalize_entities([f"calendar.c{i}" for i in range(6)])
    assert "5" in str(err.value)


# ── timestamps ─────────────────────────────────────────────────────────────


def test_an_all_day_date_becomes_local_midnight_not_utc_midnight():
    stamp, all_day = parse_time_value("2026-09-15", TZ)
    assert all_day is True
    assert stamp == local(2026, 9, 15)
    assert stamp != int(datetime(2026, 9, 15, tzinfo=timezone.utc).timestamp())


def test_a_timed_event_keeps_its_own_offset():
    stamp, all_day = parse_time_value("2026-09-15T09:30:00-07:00", TZ)
    assert all_day is False
    assert stamp == local(2026, 9, 15, 9, 30)


def test_a_naive_datetime_reads_as_house_local():
    stamp, all_day = parse_time_value("2026-09-15T09:30:00", TZ)
    assert (stamp, all_day) == (local(2026, 9, 15, 9, 30), False)


def test_the_wrapped_date_shapes_are_read_too():
    """Some calendar integrations answer `{"dateTime": …}` / `{"date": …}`."""
    assert parse_time_value({"dateTime": "2026-09-15T09:30:00-07:00"}, TZ) == (
        local(2026, 9, 15, 9, 30),
        False,
    )
    assert parse_time_value({"date": "2026-09-15"}, TZ) == (local(2026, 9, 15), True)


def test_junk_times_are_nothing_rather_than_an_exception():
    assert parse_time_value("", TZ) == (None, False)
    assert parse_time_value("not a date", TZ)[0] is None
    assert parse_time_value(None, TZ) == (None, False)
    assert parse_time_value(True, TZ) == (None, False)


# ── response shapes ────────────────────────────────────────────────────────


def test_every_known_todo_response_shape_finds_the_items():
    """Home Assistant has returned several over its releases, and the watch
    app's own parser already carries the list. One of them is what a box
    running an older core will answer with, so all of them are read."""
    rows = [{"summary": "Milk", "uid": "1", "status": "needs_action"}]
    shapes = [
        {LIST_A: {"items": rows}},
        {"items": rows},
        rows,
        {"response": {LIST_A: {"items": rows}}},
        {"service_response": {"items": rows}},
        {"result": {"anything": {LIST_A: {"items": rows}}}},
    ]
    for shape in shapes:
        assert extract_rows(shape, LIST_A, "items") == rows, shape


def test_a_response_with_nothing_in_it_reads_as_no_items():
    assert extract_rows({LIST_A: {"items": []}}, LIST_A, "items") == []
    assert extract_rows({}, LIST_A, "items") is None
    assert extract_rows(None, LIST_A, "items") is None


def test_the_calendar_and_forecast_shapes_are_found_the_same_way():
    events = [{"summary": "Standup", "start": "2026-09-15T09:00:00-07:00"}]
    assert extract_rows({CAL_A: {"events": events}}, CAL_A, "events") == events
    rows = [{"datetime": "2026-09-15T09:00:00-07:00", "condition": "sunny"}]
    assert extract_rows({WEATHER: {"forecast": rows}}, WEATHER, "forecast") == rows


# ── calendar ───────────────────────────────────────────────────────────────


def _calendar_response() -> dict:
    return {
        CAL_A: {
            "events": [
                {
                    "summary": "Standup",
                    "start": "2026-09-15T09:00:00-07:00",
                    "end": "2026-09-15T09:15:00-07:00",
                    "location": "Zoom",
                },
                {
                    "summary": "Review",
                    "start": "2026-09-15T14:00:00-07:00",
                    "end": "2026-09-15T15:00:00-07:00",
                },
            ]
        },
        CAL_B: {
            "events": [
                {
                    "summary": "Bin day",
                    "start": "2026-09-15",
                    "end": "2026-09-16",
                    "description": "Green bin",
                },
                {
                    "summary": "Swimming",
                    "start": "2026-09-15T11:00:00-07:00",
                    "end": "2026-09-15T12:00:00-07:00",
                },
            ]
        },
    }


def test_calendar_events_carry_the_contract_s_fields():
    items = normalize_calendar_events(_calendar_response(), [CAL_A, CAL_B], NAMES, TZ)
    standup = next(item for item in items if item["title"] == "Standup")
    assert standup == {
        "title": "Standup",
        "start": local(2026, 9, 15, 9, 0),
        "end": local(2026, 9, 15, 9, 15),
        "isAllDay": False,
        "location": "Zoom",
        "calendar": "Work",
        "calendarId": CAL_A,
    }


def test_an_all_day_event_starts_and_ends_at_local_midnight():
    items = normalize_calendar_events(_calendar_response(), [CAL_A, CAL_B], NAMES, TZ)
    bins = next(item for item in items if item["title"] == "Bin day")
    assert bins["isAllDay"] is True
    assert bins["start"] == local(2026, 9, 15)
    assert bins["end"] == local(2026, 9, 16)
    assert bins["calendar"] == "Family"


def test_two_calendars_merge_by_start_with_all_day_first():
    items = merge_and_sort(
        normalize_calendar_events(_calendar_response(), [CAL_A, CAL_B], NAMES, TZ)
    )
    assert [item["title"] for item in items] == [
        "Bin day",
        "Standup",
        "Swimming",
        "Review",
    ]


def test_an_all_day_event_beats_a_timed_one_that_starts_at_midnight():
    """The one case a plain sort by start cannot decide."""
    items = merge_and_sort(
        [
            {"title": "Midnight run", "start": local(2026, 9, 15), "isAllDay": False},
            {"title": "Birthday", "start": local(2026, 9, 15), "isAllDay": True},
        ]
    )
    assert [item["title"] for item in items] == ["Birthday", "Midnight run"]


def test_an_event_with_no_summary_or_no_start_is_dropped():
    response = {
        CAL_A: {
            "events": [
                {"summary": "", "start": "2026-09-15T09:00:00-07:00"},
                {"summary": "No start"},
                {"summary": "Fine", "start": "2026-09-15T09:00:00-07:00"},
            ]
        }
    }
    items = normalize_calendar_events(response, [CAL_A], NAMES, TZ)
    assert [item["title"] for item in items] == ["Fine"]


def test_a_calendar_with_no_friendly_name_falls_back_to_its_id():
    response = {CAL_A: {"events": [{"summary": "X", "start": "2026-09-15"}]}}
    items = normalize_calendar_events(response, [CAL_A], {}, TZ)
    assert items[0]["calendar"] == CAL_A


# ── to-do ──────────────────────────────────────────────────────────────────


def _todo_response() -> dict:
    return {
        LIST_A: {
            "items": [
                {"summary": "Milk", "uid": "a", "status": "needs_action"},
                {"summary": "Bread", "uid": "b", "status": "completed"},
                {
                    "summary": "Pay rent",
                    "uid": "c",
                    "status": "needs_action",
                    "due": "2026-09-16",
                    "description": "Standing order failed",
                },
            ]
        }
    }


def test_open_is_needs_action_and_done_is_completed():
    items = normalize_todo_items(_todo_response(), [LIST_A], NAMES, "open", "list", TZ)
    assert [item["title"] for item in items] == ["Milk", "Pay rent"]
    assert {item["status"] for item in items} == {"open"}

    done = normalize_todo_items(_todo_response(), [LIST_A], NAMES, "done", "list", TZ)
    assert [item["title"] for item in done] == ["Bread"]
    assert done[0]["status"] == "done"

    every = normalize_todo_items(_todo_response(), [LIST_A], NAMES, "all", "list", TZ)
    assert [item["title"] for item in every] == ["Milk", "Bread", "Pay rent"]


def test_a_todo_item_carries_the_contract_s_fields():
    items = normalize_todo_items(_todo_response(), [LIST_A], NAMES, "open", "list", TZ)
    assert items[1] == {
        "title": "Pay rent",
        "status": "open",
        "due": local(2026, 9, 16),
        "description": "Standing order failed",
        "uid": "c",
        "list": "Shopping",
        "listId": LIST_A,
    }


def test_an_undated_item_sends_an_empty_due_not_a_missing_key():
    items = normalize_todo_items(_todo_response(), [LIST_A], NAMES, "open", "list", TZ)
    assert items[0]["due"] == ""


def test_sorting_by_due_puts_the_undated_last_and_keeps_list_order_otherwise():
    response = {
        LIST_A: {
            "items": [
                {"summary": "No date", "uid": "1", "status": "needs_action"},
                {
                    "summary": "Later",
                    "uid": "2",
                    "status": "needs_action",
                    "due": "2026-09-20",
                },
                {"summary": "Also no date", "uid": "3", "status": "needs_action"},
                {
                    "summary": "Sooner",
                    "uid": "4",
                    "status": "needs_action",
                    "due": "2026-09-16T08:00:00-07:00",
                },
            ]
        }
    }
    by_due = normalize_todo_items(response, [LIST_A], NAMES, "open", "due", TZ)
    assert [item["title"] for item in by_due] == [
        "Sooner",
        "Later",
        "No date",
        "Also no date",
    ]
    in_list_order = normalize_todo_items(response, [LIST_A], NAMES, "open", "list", TZ)
    assert [item["title"] for item in in_list_order] == [
        "No date",
        "Later",
        "Also no date",
        "Sooner",
    ]


def test_two_lists_keep_their_own_names_and_ids():
    response = {
        LIST_A: {"items": [{"summary": "Milk", "uid": "a", "status": "needs_action"}]},
        LIST_B: {"items": [{"summary": "Bins", "uid": "b", "status": "needs_action"}]},
    }
    items = normalize_todo_items(response, [LIST_A, LIST_B], NAMES, "open", "list", TZ)
    assert [(item["title"], item["list"], item["listId"]) for item in items] == [
        ("Milk", "Shopping", LIST_A),
        ("Bins", "Chores", LIST_B),
    ]


def test_an_item_with_no_status_counts_as_open():
    """An integration that leaves the key out has not ticked anything."""
    response = {LIST_A: {"items": [{"summary": "Milk", "uid": "a"}]}}
    items = normalize_todo_items(response, [LIST_A], NAMES, "open", "list", TZ)
    assert items[0]["status"] == "open"


# ── forecast ───────────────────────────────────────────────────────────────


def test_a_forecast_row_carries_the_contract_s_fields():
    response = {
        WEATHER: {
            "forecast": [
                {
                    "datetime": "2026-09-15T09:00:00-07:00",
                    "condition": "partlycloudy",
                    "temperature": 21.5,
                    "templow": 12,
                    "precipitation": 0.2,
                    "precipitation_probability": 30,
                    "humidity": 61,
                    "wind_speed": 8.4,
                    "is_daytime": True,
                }
            ]
        }
    }
    items = normalize_forecast(response, WEATHER, "°C", TZ)
    assert items == [
        {
            "time": local(2026, 9, 15, 9, 0),
            "condition": "partlycloudy",
            "temperature": 21.5,
            "templow": 12,
            "unit": "°C",
            "precipitation": 0.2,
            "precipitationProbability": 30,
            "humidity": 61,
            "windSpeed": 8.4,
            "isDaytime": True,
        }
    ]


def test_forecast_fields_the_integration_omits_are_left_out():
    response = {
        WEATHER: {
            "forecast": [
                {"datetime": "2026-09-15T09:00:00-07:00", "condition": "sunny"},
                {"condition": "rainy"},
            ]
        }
    }
    items = normalize_forecast(response, WEATHER, None, TZ)
    assert items == [{"time": local(2026, 9, 15, 9, 0), "condition": "sunny"}]


def test_a_forecast_keeps_the_order_the_integration_gave():
    response = {
        WEATHER: {
            "forecast": [
                {"datetime": f"2026-09-15T{hour:02d}:00:00-07:00", "condition": "sunny"}
                for hour in (9, 10, 11)
            ]
        }
    }
    items = normalize_forecast(response, WEATHER, "°F", TZ)
    assert [item["time"] for item in items] == [
        local(2026, 9, 15, 9),
        local(2026, 9, 15, 10),
        local(2026, 9, 15, 11),
    ]


# ── caps, the slice and the trim ───────────────────────────────────────────


def test_strings_are_capped_at_120_and_a_description_at_200():
    item = cap_strings(
        {
            "title": "t" * 400,
            "description": "d" * 400,
            "location": "l" * 400,
            "start": 12345,
        }
    )
    assert len(item["title"]) == 120
    assert len(item["location"]) == 120
    assert len(item["description"]) == 200
    assert item["start"] == 12345


def test_the_caps_are_applied_while_the_items_are_shaped():
    response = {
        CAL_A: {
            "events": [
                {
                    "summary": "S" * 300,
                    "start": "2026-09-15T09:00:00-07:00",
                    "description": "D" * 300,
                }
            ]
        }
    }
    item = normalize_calendar_events(response, [CAL_A], NAMES, TZ)[0]
    assert len(item["title"]) == 120
    assert len(item["description"]) == 200


def test_a_reply_over_sixteen_kibibytes_drops_rows_from_the_end():
    # Each row is about 1.5 KiB once capped, so twelve of them clear the cap
    # and the tail is what goes.
    items = [
        {"title": "t" * 120, "description": "d" * 200, "index": i, "start": 1_700_000_000}
        for i in range(12)
    ]
    kept = trim_to_bytes(items, total=12, limit=2048)
    assert kept == items[: len(kept)]
    assert 0 < len(kept) < 12
    assert reply_bytes(kept, 12) <= 2048
    assert reply_bytes(items[: len(kept) + 1], 12) > 2048


def test_a_reply_that_already_fits_is_untouched():
    items = [{"title": "Milk", "status": "open", "due": ""}]
    assert trim_to_bytes(items, total=1) == items


def test_the_reply_is_measured_as_compact_utf8_json():
    items = [{"title": "café", "start": 1}]
    assert reply_bytes(items, 1) == len(
        json.dumps({"items": items, "total": 1}, separators=(",", ":"),
                   ensure_ascii=False).encode("utf-8")
    )


def test_the_total_counts_the_items_before_the_slice():
    """What a `listStat total` draws: "7 events" over four rows."""
    items = [{"title": f"Event {i}", "start": i} for i in range(7)]
    limit = clamp_limit(4)
    total = len(items)
    sliced = trim_to_bytes(items[:limit], total)
    assert total == 7
    assert [item["title"] for item in sliced] == [
        "Event 0",
        "Event 1",
        "Event 2",
        "Event 3",
    ]


def test_the_module_body_needs_no_home_assistant():
    """The point of the split: everything above ran without HA installed, and
    the runtime imports live inside the fetching functions."""
    source = _MODULE_PATH.read_text()
    for line in source.splitlines():
        assert not line.startswith("from homeassistant"), line
        assert not line.startswith("import homeassistant"), line


# ── the fetch itself ───────────────────────────────────────────────────────
#
# Everything above is pure. What follows exercises `async_list_items`, which
# is the only part that touches Home Assistant, against stubs of the three
# modules it imports at runtime. That is enough to pin the request the
# services actually receive: the window, the status list, and the
# `twice_daily` spelling are all things a box would answer emptily rather
# than loudly if they were wrong.

NOW = datetime(2026, 9, 15, 8, 0, tzinfo=TZ)


class _HomeAssistantError(Exception):
    """Stand-in for `homeassistant.exceptions.HomeAssistantError`."""


@contextlib.contextmanager
def _home_assistant_stubs(now: datetime = NOW):
    saved_modules = dict(sys.modules)
    try:

        def stub(name: str, **attrs: object) -> None:
            module = types.ModuleType(name)
            for key, value in attrs.items():
                setattr(module, key, value)
            sys.modules[name] = module

        stub("homeassistant")
        stub("homeassistant.exceptions", HomeAssistantError=_HomeAssistantError)
        stub("homeassistant.util")
        stub("homeassistant.util.dt", DEFAULT_TIME_ZONE=TZ, now=lambda: now)
        stub("voluptuous", Invalid=type("Invalid", (Exception,), {}))
        yield
    finally:
        for key in list(sys.modules):
            if key not in saved_modules:
                del sys.modules[key]
        sys.modules.update(saved_modules)


class _FakeStates:
    def __init__(self, attributes: dict[str, dict]) -> None:
        self._attributes = attributes

    def get(self, entity_id: str):
        if entity_id not in self._attributes:
            return None
        return types.SimpleNamespace(attributes=self._attributes[entity_id])


class _FakeServices:
    def __init__(self, response) -> None:
        self.response = response
        self.calls: list[tuple] = []

    async def async_call(
        self, domain, service, data, blocking=False, return_response=False
    ):
        self.calls.append((domain, service, data, blocking, return_response))
        if isinstance(self.response, Exception):
            raise self.response
        return self.response


class _FakeHass:
    def __init__(self, response, attributes: dict[str, dict] | None = None) -> None:
        self.services = _FakeServices(response)
        self.states = _FakeStates(attributes or {})


def _fetch(hass, spec: dict):
    with _home_assistant_stubs():
        return asyncio.run(list_items.async_list_items(hass, spec))


def test_a_calendar_fetch_asks_for_the_clamped_window_and_slices_after_sorting():
    hass = _FakeHass(
        _calendar_response(),
        {CAL_A: {"friendly_name": "Work"}, CAL_B: {"friendly_name": "Family"}},
    )
    result = _fetch(
        hass,
        {"source": "calendar", "entities": [CAL_A, CAL_B], "hours": 9999, "limit": 2},
    )
    domain, service, data, blocking, return_response = hass.services.calls[0]
    assert (domain, service) == ("calendar", "get_events")
    assert (blocking, return_response) == (True, True)
    assert data["entity_id"] == [CAL_A, CAL_B]
    assert data["start_date_time"] == NOW.isoformat()
    assert data["end_date_time"] == (NOW + timedelta(hours=336)).isoformat()
    # Four events found, two drawn, and the count is the one before the slice.
    assert result.total == 4
    assert [item["title"] for item in result.items] == ["Bin day", "Standup"]


def test_a_todo_fetch_sends_home_assistant_s_own_status_words():
    hass = _FakeHass(_todo_response(), {LIST_A: {"friendly_name": "Shopping"}})
    for status, wanted in (
        ("open", ["needs_action"]),
        ("done", ["completed"]),
        ("all", ["needs_action", "completed"]),
    ):
        hass.services.calls.clear()
        _fetch(hass, {"source": "todo", "entities": [LIST_A], "status": status})
        assert hass.services.calls[0][2]["status"] == wanted, status


def test_a_forecast_fetch_spells_twice_daily_the_way_the_service_wants():
    hass = _FakeHass(
        {
            WEATHER: {
                "forecast": [
                    {"datetime": "2026-09-15T09:00:00-07:00", "condition": "sunny"}
                ]
            }
        },
        {WEATHER: {"temperature_unit": "°F", "friendly_name": "Home"}},
    )
    result = _fetch(hass, {"source": "forecast", "entity_id": WEATHER, "type": "twiceDaily"})
    assert hass.services.calls[0][2] == {"entity_id": WEATHER, "type": "twice_daily"}
    # The unit is the weather entity's own attribute, carried on every row.
    assert result.items[0]["unit"] == "°F"


def test_a_jinja_source_is_refused_by_name_rather_than_answered_empty():
    hass = _FakeHass({})
    for source in ("entities", "attribute", "template"):
        with pytest.raises(list_items.ListItemsError) as err:
            _fetch(hass, {"source": source, "entities": ["light.a"]})
        assert source in str(err.value)
    assert hass.services.calls == []


def test_an_unknown_source_and_a_missing_entity_are_both_refused():
    hass = _FakeHass({})
    with pytest.raises(list_items.ListItemsError):
        _fetch(hass, {"source": "logbook", "entities": ["light.a"]})
    with pytest.raises(list_items.ListItemsError):
        _fetch(hass, {"source": "calendar", "entities": []})
    assert hass.services.calls == []


def test_a_service_failure_comes_back_as_a_home_assistant_error():
    """Separate from a bad spec, because the two answer different statuses:
    502 for a box that tried and could not, 400 for a request it never had a
    chance with."""
    hass = _FakeHass(_HomeAssistantError("calendar.work is not available"))
    with pytest.raises(_HomeAssistantError) as err:
        _fetch(hass, {"source": "calendar", "entities": [CAL_A]})
    assert "calendar.get_events" in str(err.value)
