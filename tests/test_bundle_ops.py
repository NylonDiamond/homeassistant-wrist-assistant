"""One round trip for a whole watch face: the caps, the gather, the answers.

`bundle_ops` holds the core of five signed ops (`state`, `history`,
`statistics`, `list`, `template`) plus `op=bundle`, which runs any number of
them at once. Like the modules beside it, it keeps Home Assistant out of its
body and does its runtime imports inside the functions, so everything here
runs with no HA install: the request shaping and the caps need nothing at
all, and the readers need only the handful of stub modules installed below.

Two things are worth stating about what these tests are for.

The bundle exists so a face-wide refresh is one request rather than one per
source per complication, which is only true if the sections really run at
once; `test_the_sources_run_at_once` fails if anything ever makes them
sequential, and would otherwise pass silently while the watch waited.

The other is drift. A bundled answer has to be what the single op would have
sent, or a complication reads one thing on a face refresh and another when it
fetches alone. The single ops and the bundle call the same reader, and the
equality tests below are what hold that: they compare the reader's own answer
with the answer the bundle put in its section, so a future copy of a handler
body into the bundle fails here.
"""

from __future__ import annotations

import asyncio
import importlib
import sys
import types
from pathlib import Path

import pytest

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_PKG_NAME = "wa_offline_pkg"

if _PKG_NAME not in sys.modules:
    _pkg = types.ModuleType(_PKG_NAME)
    _pkg.__path__ = [str(_PKG_DIR)]
    sys.modules[_PKG_NAME] = _pkg

bundle_ops = importlib.import_module(f"{_PKG_NAME}.bundle_ops")

BundleRequest = bundle_ops.BundleRequest
BundleRequestError = bundle_ops.BundleRequestError
OpError = bundle_ops.OpError
async_run_bundle = bundle_ops.async_run_bundle
normalize_bundle_request = bundle_ops.normalize_bundle_request
template_text = bundle_ops.template_text


# ── the stub Home Assistant the readers reach for at call time ────────────


class _HomeAssistantError(Exception):
    """Stands in for HA's own, which the readers catch by name."""


class _TemplateError(Exception):
    """Stands in for HA's template error."""


class _StubTemplate:
    """Renders `{{ x }}` as a float and `boom` as a failure."""

    def __init__(self, source: str, hass: object) -> None:
        self.source = source

    def async_render(self, variables: object = None) -> object:
        if self.source == "boom":
            raise _TemplateError("unknown filter")
        if self.source == "{{ dict }}":
            return {"b": 2, "a": 1}
        return 21.50


@pytest.fixture(autouse=True)
def _ha_stubs():
    """Install the modules the readers import inside their bodies.

    Only the names the readers actually reach for. Restored afterwards so a
    stub cannot leak into another test file in the same session.
    """
    saved = dict(sys.modules)

    def stub(name: str, **attrs: object) -> None:
        module = sys.modules.get(name) or types.ModuleType(name)
        for key, value in attrs.items():
            setattr(module, key, value)
        sys.modules[name] = module

    stub("homeassistant")
    stub("homeassistant.core", HomeAssistant=type("HomeAssistant", (), {}))
    stub("homeassistant.exceptions", HomeAssistantError=_HomeAssistantError)
    stub("homeassistant.helpers")
    stub(
        "homeassistant.helpers.template",
        Template=_StubTemplate,
        TemplateError=_TemplateError,
    )
    yield
    for key in list(sys.modules):
        if key not in saved:
            del sys.modules[key]
    sys.modules.update(saved)


class _FakeState:
    def __init__(self, entity_id: str, state: str, **attributes: object) -> None:
        self.entity_id = entity_id
        self.state = state
        self.attributes = attributes
        self.last_updated = None


class _FakeStates:
    def __init__(self, states: dict[str, _FakeState]) -> None:
        self._states = states

    def get(self, entity_id: str) -> _FakeState | None:
        return self._states.get(entity_id)


class _FakeHass:
    def __init__(self, *states: _FakeState) -> None:
        self.states = _FakeStates({s.entity_id: s for s in states})


def run(coro):
    return asyncio.run(coro)


def request(**kwargs) -> BundleRequest:
    """A validated request straight from a body, the way the op builds it."""
    return normalize_bundle_request(kwargs)


# ── caps and refusals ─────────────────────────────────────────────────────


def test_an_empty_request_asks_for_nothing():
    body = run(async_run_bundle(_FakeHass(), request()))
    assert body == {
        "template": None,
        "states": {},
        "history": {},
        "statistics": {},
        "lists": {},
        "errors": {},
    }


@pytest.mark.parametrize("field", ["history", "statistics", "lists"])
def test_a_section_that_is_not_an_array_is_refused(field: str):
    with pytest.raises(BundleRequestError) as err:
        request(**{field: {"key": "a"}})
    assert field in str(err.value)


@pytest.mark.parametrize("field", ["history", "statistics", "lists"])
def test_an_item_needs_a_non_empty_string_key(field: str):
    for bad in ({}, {"key": ""}, {"key": 7}, {"key": None}):
        with pytest.raises(BundleRequestError):
            request(**{field: [bad]})
    with pytest.raises(BundleRequestError):
        request(**{field: ["not an object"]})


@pytest.mark.parametrize("field", ["history", "statistics", "lists"])
def test_a_repeated_key_in_one_section_is_refused(field: str):
    """The reply is keyed by it, so a repeat would drop one of the answers."""
    with pytest.raises(BundleRequestError) as err:
        request(**{field: [{"key": "a"}, {"key": "a"}]})
    assert "duplicate" in str(err.value)


def test_the_same_key_in_two_sections_is_fine():
    """Sections are separate maps; only a repeat inside one is ambiguous."""
    built = request(
        history=[{"key": "a"}], statistics=[{"key": "a"}], lists=[{"key": "a"}]
    )
    assert built.item_count == 3


def test_the_item_cap_counts_the_three_sections_together():
    limit = bundle_ops.MAX_BUNDLE_ITEMS
    ok = request(
        history=[{"key": f"h{i}"} for i in range(limit - 2)],
        statistics=[{"key": "s"}],
        lists=[{"key": "l"}],
    )
    assert ok.item_count == limit

    with pytest.raises(BundleRequestError) as err:
        request(
            history=[{"key": f"h{i}"} for i in range(limit - 1)],
            statistics=[{"key": "s"}],
            lists=[{"key": "l"}],
        )
    assert str(limit) in str(err.value)


def test_the_state_cap_is_its_own():
    limit = bundle_ops.MAX_BUNDLE_STATES
    assert len(request(states=[f"timer.t{i}" for i in range(limit)]).states) == limit
    with pytest.raises(BundleRequestError) as err:
        request(states=[f"timer.t{i}" for i in range(limit + 1)])
    assert str(limit) in str(err.value)


def test_a_repeated_or_malformed_state_is_refused():
    with pytest.raises(BundleRequestError) as err:
        request(states=["timer.a", "timer.a"])
    assert "duplicate" in str(err.value)
    with pytest.raises(BundleRequestError):
        request(states=["timer.a", ""])
    with pytest.raises(BundleRequestError):
        request(states=["timer.a", 7])
    with pytest.raises(BundleRequestError):
        request(states="timer.a")


def test_a_template_that_is_not_a_non_empty_string_is_refused():
    for bad in ("", 7, [], {}):
        with pytest.raises(BundleRequestError):
            request(template=bad)
    assert request(template="{{ 1 }}").template == "{{ 1 }}"
    assert request().template is None


# ── the gather ────────────────────────────────────────────────────────────


async def _echo(hass, payload):
    return {"echo": payload.get("key")}


async def _boom(hass, payload):
    raise OpError("no such entity", status=404)


def test_every_section_comes_back_under_the_caller_s_own_key():
    body = run(
        async_run_bundle(
            _FakeHass(),
            request(
                history=[{"key": "chart-1"}, {"key": "chart-2"}],
                statistics=[{"key": "energy"}],
                lists=[{"key": "agenda"}],
            ),
            history_result=_echo,
            statistics_result=_echo,
            list_result=_echo,
        )
    )
    assert body["history"] == {
        "chart-1": {"echo": "chart-1"},
        "chart-2": {"echo": "chart-2"},
    }
    assert body["statistics"] == {"energy": {"echo": "energy"}}
    assert body["lists"] == {"agenda": {"echo": "agenda"}}
    assert body["errors"] == {}


def test_one_failing_item_leaves_every_other_one_alone():
    """The point of the whole op: a dead source costs one complication."""

    async def _mixed(hass, payload):
        if payload["key"] == "bad":
            raise OpError("recorder unavailable", status=503)
        return {"echo": payload["key"]}

    body = run(
        async_run_bundle(
            _FakeHass(),
            request(
                history=[{"key": "good"}, {"key": "bad"}, {"key": "also-good"}],
                statistics=[{"key": "stat"}],
            ),
            history_result=_mixed,
            statistics_result=_echo,
        )
    )
    assert set(body["history"]) == {"good", "also-good"}
    assert body["statistics"] == {"stat": {"echo": "stat"}}
    assert body["errors"] == {"bad": "recorder unavailable"}


def test_a_failure_that_is_not_an_op_error_is_caught_too():
    """A reader is allowed to have a bug; the face still draws."""

    async def _explode(hass, payload):
        raise ValueError("gauge min is not a number")

    body = run(
        async_run_bundle(
            _FakeHass(),
            request(lists=[{"key": "agenda"}], statistics=[{"key": "stat"}]),
            list_result=_explode,
            statistics_result=_echo,
        )
    )
    assert body["lists"] == {}
    assert body["statistics"] == {"stat": {"echo": "stat"}}
    assert body["errors"] == {"agenda": "gauge min is not a number"}


def test_an_error_with_no_message_still_says_something():
    async def _silent(hass, payload):
        raise RuntimeError

    body = run(
        async_run_bundle(
            _FakeHass(), request(lists=[{"key": "agenda"}]), list_result=_silent
        )
    )
    assert body["errors"]["agenda"] == "RuntimeError"


def test_a_long_failure_is_cut_to_something_a_watch_will_carry():
    async def _wordy(hass, payload):
        raise OpError("x" * 5000)

    body = run(
        async_run_bundle(
            _FakeHass(), request(lists=[{"key": "agenda"}]), list_result=_wordy
        )
    )
    assert len(body["errors"]["agenda"]) == bundle_ops.MAX_ERROR_CHARS


def test_the_sources_run_at_once():
    """Sequential execution would deadlock this, which is the whole point.

    Each reader waits until all four have started. Run one after another, the
    first never sees the others start and its wait times out; run together,
    all four pass through. A bundle that stopped gathering would still return
    the right answers, just slowly, and nothing else here would notice.
    """
    started = asyncio.Event()
    seen = 0

    async def _rendezvous(hass, payload):
        nonlocal seen
        seen += 1
        if seen == 4:
            started.set()
        await asyncio.wait_for(started.wait(), 2.0)
        return {"ok": True}

    body = run(
        async_run_bundle(
            _FakeHass(_FakeState("timer.kitchen", "active")),
            request(
                states=["timer.kitchen"],
                history=[{"key": "h"}],
                statistics=[{"key": "s"}],
                lists=[{"key": "l"}],
            ),
            state_result=_rendezvous,
            history_result=_rendezvous,
            statistics_result=_rendezvous,
            list_result=_rendezvous,
        )
    )
    assert body["errors"] == {}
    assert body["states"] and body["history"] and body["statistics"] and body["lists"]


# ── the readers, and the bundle agreeing with them ────────────────────────


def test_the_bundle_s_state_is_the_reader_s_state():
    hass = _FakeHass(_FakeState("timer.kitchen", "active", friendly_name="Kitchen"))
    single = run(
        bundle_ops.async_state_result(hass, {"entity_id": "timer.kitchen"})
    )
    body = run(async_run_bundle(hass, request(states=["timer.kitchen"])))

    assert single == {
        "found": True,
        "entity_id": "timer.kitchen",
        "state": "active",
        "attributes": {"friendly_name": "Kitchen"},
        "last_updated": None,
    }
    assert body["states"]["timer.kitchen"] == single
    assert body["errors"] == {}


def test_a_missing_entity_is_a_404_body_alone_and_an_error_in_a_bundle():
    """The single op signs `{"found": false}` with its 404; the bundle names
    the entity in `errors` instead, so the other sources still answer."""
    hass = _FakeHass()
    with pytest.raises(OpError) as err:
        run(bundle_ops.async_state_result(hass, {"entity_id": "timer.gone"}))
    assert err.value.status == 404
    assert err.value.body == {"found": False, "entity_id": "timer.gone"}

    body = run(async_run_bundle(hass, request(states=["timer.gone"])))
    assert body["states"] == {}
    assert "timer.gone" in body["errors"]


def test_an_entity_id_is_still_required():
    with pytest.raises(OpError) as err:
        run(bundle_ops.async_state_result(_FakeHass(), {}))
    assert err.value.status == 400
    # No body: the single op answers this one as plain text, not signed JSON.
    assert err.value.body is None


def test_the_bundle_s_history_is_the_reader_s_history(monkeypatch):
    async def _series(hass, entity_id, minutes, points, **kwargs):
        return "10,11,12"

    monkeypatch.setattr(bundle_ops, "async_history_series", _series)
    hass = _FakeHass()
    payload = {
        "key": "chart",
        "entity_id": "sensor.power",
        "start_ms": 1_757_000_000_000,
        "points": 3,
    }
    single = run(bundle_ops.async_history_result(hass, payload))
    body = run(async_run_bundle(hass, request(history=[payload])))

    assert single == {"entity_id": "sensor.power", "series": "10,11,12"}
    assert body["history"]["chart"] == single


def test_a_history_item_without_a_window_fails_on_its_own(monkeypatch):
    async def _series(hass, entity_id, minutes, points, **kwargs):
        return "1,2"

    monkeypatch.setattr(bundle_ops, "async_history_series", _series)
    body = run(
        async_run_bundle(
            _FakeHass(),
            request(
                history=[
                    {"key": "broken", "entity_id": "sensor.power", "points": 3},
                    {
                        "key": "fine",
                        "entity_id": "sensor.power",
                        "start_ms": 1_757_000_000_000,
                        "points": 3,
                    },
                ]
            ),
        )
    )
    assert body["errors"] == {"broken": "start_ms required"}
    assert body["history"]["fine"] == {"entity_id": "sensor.power", "series": "1,2"}


def test_the_bundle_s_statistics_is_the_reader_s_statistics(monkeypatch):
    async def _series(hass, entity_id, minutes, period, stat_type, *, gaps=False):
        return "0.42,0.51"

    monkeypatch.setattr(bundle_ops, "async_statistics_series", _series)
    hass = _FakeHass()
    payload = {"key": "energy", "entity_id": "sensor.energy", "minutes": 1440}
    single = run(bundle_ops.async_statistics_result(hass, payload))
    body = run(async_run_bundle(hass, request(statistics=[payload])))

    assert single == {"entity_id": "sensor.energy", "series": "0.42,0.51"}
    assert body["statistics"]["energy"] == single


def test_a_statistics_failure_keeps_the_status_the_single_op_answers(monkeypatch):
    async def _no_recorder(*args, **kwargs):
        raise bundle_ops.StatisticsSeriesError(bundle_ops.RECORDER_UNAVAILABLE)

    monkeypatch.setattr(bundle_ops, "async_statistics_series", _no_recorder)
    with pytest.raises(OpError) as err:
        run(
            bundle_ops.async_statistics_result(
                _FakeHass(), {"entity_id": "sensor.energy"}
            )
        )
    assert err.value.status == 503
    assert err.value.body == {"ok": False, "error": bundle_ops.RECORDER_UNAVAILABLE}


def test_the_bundle_s_list_is_the_reader_s_list(monkeypatch):
    async def _items(hass, spec):
        return types.SimpleNamespace(items=[{"t": "Milk"}, {"t": "Eggs"}], total=7)

    monkeypatch.setattr(bundle_ops, "async_list_items", _items)
    hass = _FakeHass()
    payload = {"key": "agenda", "source": "todo", "entities": ["todo.shopping"]}
    single = run(bundle_ops.async_list_result(hass, payload))
    body = run(async_run_bundle(hass, request(lists=[payload])))

    assert single == {"items": [{"t": "Milk"}, {"t": "Eggs"}], "total": 7}
    assert body["lists"]["agenda"] == single


def test_a_list_source_that_belongs_to_jinja_is_refused_per_item():
    """`async_list_items` itself refuses it; the bundle carries the reason."""
    body = run(
        async_run_bundle(
            _FakeHass(),
            request(lists=[{"key": "agenda", "source": "template"}]),
        )
    )
    assert body["lists"] == {}
    assert "template" in body["errors"]["agenda"]


def test_the_template_section_is_the_flattened_render():
    """The single op ships the native render; the bundle ships the text.

    Swift flattens `{"ok": true, "result": 21.5}` itself for the single op.
    A bundled face wants one string per complication, so the flattening
    happens here with the same arithmetic the panel preview uses.
    """
    hass = _FakeHass()
    single = run(bundle_ops.async_template_result(hass, {"template": "{{ x }}"}))
    assert single == {"ok": True, "result": 21.5}

    body = run(async_run_bundle(hass, request(template="{{ x }}")))
    assert body["template"] == "21.5"
    assert body["errors"] == {}


def test_a_template_that_will_not_render_leaves_the_field_null():
    body = run(
        async_run_bundle(
            _FakeHass(),
            request(template="boom", states=["timer.gone"]),
        )
    )
    assert body["template"] is None
    assert body["errors"]["template"] == "unknown filter"
    # And the rest of the face is unaffected by the template's failure.
    assert "timer.gone" in body["errors"]


def test_template_text_writes_what_the_watch_writes():
    """The watch's own decoder is the contract; this mirrors it."""
    assert template_text(21.50) == "21.5"
    assert template_text(21.0) == "21"
    assert template_text(3) == "3"
    assert template_text(True) == "true"
    assert template_text(False) == "false"
    assert template_text(None) == ""
    assert template_text("  Kitchen  ") == "Kitchen"
    assert template_text({"b": 2, "a": 1}) == '{"a":1,"b":2}'


def test_a_rendered_object_is_flattened_the_same_way_in_a_bundle():
    body = run(async_run_bundle(_FakeHass(), request(template="{{ dict }}")))
    assert body["template"] == '{"a":1,"b":2}'
