"""In-process tests for the watch config WebSocket commands.

Loads ``watch_config_ws.py`` with stubbed Home Assistant modules over a real
``WatchConfigStore``, the way ``test_complication_ws.py`` runs the editor's
commands. The panel's Watch settings view is built against the get and save
shapes, and the phone against the subscribe shapes, so results and events are
asserted as whole dicts and errors as exact (code, message) pairs.
``test_ws_command_registration.py`` covers the registration and the admin
gate statically.
"""

from __future__ import annotations

import asyncio
import importlib.util
import re
import sys
import types
from pathlib import Path
from typing import Any

import pytest

from test_watch_config_store import _PKG, _FakeStore, _Hass, _loaded_module

_WS_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "watch_config_ws.py"
)

DOMAIN = "wrist_assistant"
WATCH = "watch-A"
PHONE_HASH = "a" * 64

# What the panel parses a conflict's stored revision out of.
CONFLICT_REVISION = re.compile(r"^stored revision is (\d+)")


class _Marker:
    """``vol.Required``: a hashable schema dict key."""

    def __init__(self, *args: object, **kwargs: object) -> None:
        self.args = args


class _Connection:
    def __init__(self) -> None:
        self.results: dict[int, Any] = {}
        self.errors: list[tuple[int, str, str]] = []
        self.messages: list[Any] = []
        self.subscriptions: dict[int, Any] = {}

    def send_result(self, msg_id: int, payload: Any) -> None:
        self.results[msg_id] = payload

    def send_error(self, msg_id: int, code: str, message: str) -> None:
        self.errors.append((msg_id, code, message))

    def send_message(self, message: Any) -> None:
        self.messages.append(message)

    def events(self) -> list[Any]:
        return [m["event"] for m in self.messages if m.get("type") == "event"]


def _event_message(msg_id: int, event: Any) -> dict[str, Any]:
    """``websocket_api.event_message``, shaped as Home Assistant shapes it."""
    return {"id": msg_id, "type": "event", "event": event}


def _stub(name: str, **attrs: object) -> None:
    module = sys.modules.get(name) or types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module


@pytest.fixture
def env():
    with _loaded_module() as store_mod:
        _stub("homeassistant.components")
        _stub(
            "homeassistant.components.websocket_api",
            ActiveConnection=type("ActiveConnection", (), {}),
            async_register_command=lambda hass, func: None,
            event_message=_event_message,
            require_admin=lambda func: func,
            websocket_command=lambda schema: (lambda func: func),
        )
        _stub("voluptuous", Required=_Marker, Optional=_Marker)
        _stub(f"{_PKG}.const", DOMAIN=DOMAIN)
        spec = importlib.util.spec_from_file_location(f"{_PKG}.watch_config_ws", _WS_PATH)
        ws = importlib.util.module_from_spec(spec)
        sys.modules[f"{_PKG}.watch_config_ws"] = ws
        spec.loader.exec_module(ws)

        hass = _Hass()
        store = store_mod.WatchConfigStore(hass)
        asyncio.run(store.async_load())
        hass.data = {DOMAIN: types.SimpleNamespace(watch_config_store=store)}
        yield types.SimpleNamespace(ws=ws, store=store, mod=store_mod, hass=hass)


def _call(env, command, **msg) -> _Connection:
    connection = _Connection()
    command(env.hass, connection, {"id": 1, **msg})
    return connection


def _ok(env, command, **msg) -> Any:
    connection = _call(env, command, **msg)
    assert connection.errors == [], connection.errors
    return connection.results[1]


def _error(env, command, **msg) -> tuple[str, str]:
    connection = _call(env, command, **msg)
    assert connection.results == {}
    [(_id, code, message)] = connection.errors
    return code, message


def _get(env, kind: str = "behavior", owner: str = WATCH) -> Any:
    return _ok(env, env.ws.ws_watch_config_get, owner_watch_id=owner, kind=kind)


def _save(env, document: dict, base: int, kind: str = "behavior", owner: str = WATCH):
    return _call(
        env,
        env.ws.ws_watch_config_save,
        owner_watch_id=owner,
        kind=kind,
        base_revision=base,
        document=document,
    )


def _phone_upload(env, kind: str, document: dict, base: int = 0) -> None:
    env.store.put(
        WATCH, kind, document, document_hash=PHONE_HASH, base_revision=base, updated_by=WATCH
    )


# ── get ──────────────────────────────────────────────────────────────────


def test_get_with_no_record(env) -> None:
    assert _get(env) == {
        "kind": "behavior",
        "revision": 0,
        "hash": None,
        "updated_at": None,
        "updated_by": None,
        "delivered_revision": 0,
        "delivered_at": None,
    }


def test_get_returns_the_record_with_its_delivery(env) -> None:
    settings = {"longPressDuration": "Long", "somethingThePanelHides": 3}
    _phone_upload(env, "behavior", settings)
    record = env.store.get(WATCH, "behavior")
    assert _get(env) == {
        "kind": "behavior",
        "revision": 1,
        "hash": PHONE_HASH,
        "updated_at": record.updated_at,
        "updated_by": WATCH,
        "delivered_revision": 1,
        "delivered_at": record.delivered_at,
        "document": settings,
    }


def test_get_may_read_pages(env) -> None:
    _phone_upload(env, "pages", {"pages": [{"name": "Home"}]})
    assert _get(env, "pages")["document"] == {"pages": [{"name": "Home"}]}


def test_get_never_moves_delivery(env) -> None:
    _phone_upload(env, "behavior", {})
    assert _save(env, {"wrapPages": True}, 1).errors == []
    _FakeStore.writes.clear()
    result = _get(env)
    assert (result["revision"], result["delivered_revision"]) == (2, 1)
    assert _FakeStore.writes == []


def test_get_refuses_an_unknown_kind(env) -> None:
    code, message = _error(
        env, env.ws.ws_watch_config_get, owner_watch_id=WATCH, kind="quick_actions"
    )
    assert code == "invalid"
    assert "kind" in message


# ── save ─────────────────────────────────────────────────────────────────


def test_save_on_the_stored_revision(env) -> None:
    original = {"longPressDuration": "Normal", "keyThePanelDoesNotShow": [1, 2]}
    _phone_upload(env, "behavior", original)
    edited = dict(original, longPressDuration="Short")

    connection = _save(env, edited, 1)
    assert connection.errors == []
    assert connection.results[1] == {"revision": 2}

    result = _get(env)
    assert result["revision"] == 2
    assert result["updated_by"] == "panel"
    assert result["document"] == edited
    assert result["hash"] == env.mod.canonical_hash(edited)
    assert result["delivered_revision"] == 1
    assert [e.document for e in env.store.get(WATCH, "behavior").history] == [original]


def test_after_the_phone_collects_a_save_it_reads_as_delivered(env) -> None:
    _phone_upload(env, "behavior", {})
    _save(env, {"wrapPages": True}, 1)
    # What the signed watch_config_get does on the phone's next check.
    env.store.mark_delivered(WATCH, "behavior", 2)
    result = _get(env)
    assert result["delivered_revision"] == result["revision"] == 2
    assert result["delivered_at"]


def test_save_with_base_zero_is_no_record(env) -> None:
    _phone_upload(env, "behavior", {})
    assert _error(
        env,
        env.ws.ws_watch_config_save,
        owner_watch_id=WATCH,
        kind="behavior",
        base_revision=0,
        document={},
    ) == (
        "no_record",
        "there is no stored behavior record to save over; the iPhone uploads the first copy",
    )


def test_save_with_nothing_stored_is_no_record(env) -> None:
    code, _message = _error(
        env,
        env.ws.ws_watch_config_save,
        owner_watch_id=WATCH,
        kind="behavior",
        base_revision=3,
        document={},
    )
    assert code == "no_record"
    assert _get(env)["revision"] == 0


def test_a_stale_save_is_a_conflict_naming_the_stored_revision(env) -> None:
    _phone_upload(env, "behavior", {})
    _phone_upload(env, "behavior", {"wrapPages": True}, base=1)
    code, message = _error(
        env,
        env.ws.ws_watch_config_save,
        owner_watch_id=WATCH,
        kind="behavior",
        base_revision=1,
        document={"wrapPages": False},
    )
    assert (code, message) == ("conflict", "stored revision is 2, save was based on 1")
    match = CONFLICT_REVISION.match(message)
    assert match is not None and int(match.group(1)) == 2
    assert _get(env)["document"] == {"wrapPages": True}


def test_save_refuses_pages(env) -> None:
    _phone_upload(env, "pages", {"pages": []})
    code, message = _error(
        env,
        env.ws.ws_watch_config_save,
        owner_watch_id=WATCH,
        kind="pages",
        base_revision=1,
        document={"pages": []},
    )
    assert code == "invalid"
    assert message == "the panel cannot save pages; it may save behavior"
    assert _get(env, "pages")["revision"] == 1


def test_save_refuses_an_oversized_document(env) -> None:
    _phone_upload(env, "behavior", {})
    code, message = _error(
        env,
        env.ws.ws_watch_config_save,
        owner_watch_id=WATCH,
        kind="behavior",
        base_revision=1,
        document={"b": "x" * (256 * 1024)},
    )
    assert code == "invalid"
    assert "limit for behavior" in message


def test_both_commands_answer_unavailable_before_the_integration_is_ready(env) -> None:
    env.hass.data = {}
    assert _error(
        env, env.ws.ws_watch_config_get, owner_watch_id=WATCH, kind="behavior"
    ) == ("unavailable", "integration not ready")
    assert _error(
        env,
        env.ws.ws_watch_config_save,
        owner_watch_id=WATCH,
        kind="behavior",
        base_revision=1,
        document={},
    ) == ("unavailable", "integration not ready")


def test_an_unreadable_file_is_unavailable(env) -> None:
    _phone_upload(env, "behavior", {})
    _FakeStore.unreadable.add(env.mod._owner_key(WATCH))
    store = env.mod.WatchConfigStore(env.hass)
    asyncio.run(store.async_load())
    env.hass.data[DOMAIN].watch_config_store = store
    code, _message = _error(
        env, env.ws.ws_watch_config_get, owner_watch_id=WATCH, kind="behavior"
    )
    assert code == "unavailable"
    assert _save(env, {}, 1).errors[0][1] == "unavailable"


# ── subscribe (the phone's live line) ────────────────────────────────────


def _subscribe(env, owner: str = WATCH) -> _Connection:
    connection = _call(env, env.ws.ws_watch_config_subscribe, owner_watch_id=owner)
    assert connection.errors == [], connection.errors
    return connection


def test_subscribe_with_no_record_answers_an_empty_object(env) -> None:
    connection = _subscribe(env)
    assert connection.results[1] == {"revisions": {}}
    assert connection.events() == []
    assert 1 in connection.subscriptions


def test_subscribe_answers_every_kind_the_watch_has(env) -> None:
    _phone_upload(env, "pages", {"pages": []})
    _phone_upload(env, "behavior", {})
    _save(env, {"wrapPages": True}, 1)
    assert _subscribe(env).results[1] == {"revisions": {"behavior": 2, "pages": 1}}


def test_a_phone_upload_is_an_event(env) -> None:
    """The phone's own upload echoes back; it ignores a revision it holds."""
    connection = _subscribe(env)
    _phone_upload(env, "behavior", {})
    _phone_upload(env, "pages", {"pages": []})
    assert connection.events() == [
        {"kind": "behavior", "revision": 1},
        {"kind": "pages", "revision": 1},
    ]
    assert all(m["id"] == 1 for m in connection.messages)


def test_a_panel_save_is_an_event(env) -> None:
    _phone_upload(env, "behavior", {})
    connection = _subscribe(env)
    assert _save(env, {"wrapPages": True}, 1).errors == []
    assert connection.events() == [{"kind": "behavior", "revision": 2}]


def test_a_refused_save_or_a_delivery_is_not_an_event(env) -> None:
    _phone_upload(env, "behavior", {})
    connection = _subscribe(env)
    assert _save(env, {"wrapPages": True}, 7).errors[0][1] == "conflict"
    _save(env, {"wrapPages": True}, 1)
    env.store.mark_delivered(WATCH, "behavior", 2)
    assert connection.events() == [{"kind": "behavior", "revision": 2}]


def test_another_watch_s_saves_are_never_sent(env) -> None:
    connection = _subscribe(env)
    other = _subscribe(env, "watch-B")
    env.store.put(
        "watch-B", "behavior", {}, document_hash=PHONE_HASH, base_revision=0, updated_by="watch-B"
    )
    assert connection.events() == []
    assert other.events() == [{"kind": "behavior", "revision": 1}]


def test_a_forget_sends_revision_zero_for_each_kind(env) -> None:
    _phone_upload(env, "pages", {"pages": []})
    _phone_upload(env, "behavior", {})
    connection = _subscribe(env)
    env.store.forget_owner(WATCH)
    assert connection.events() == [
        {"kind": "behavior", "revision": 0},
        {"kind": "pages", "revision": 0},
    ]


def test_a_move_tells_each_side_its_own_news(env) -> None:
    _phone_upload(env, "behavior", {})
    _save(env, {"wrapPages": True}, 1)
    source = _subscribe(env)
    target = _subscribe(env, "watch-B")
    env.store.move_owner(WATCH, "watch-B", updated_by="t")
    assert source.events() == [{"kind": "behavior", "revision": 0}]
    assert target.events() == [{"kind": "behavior", "revision": 2}]


def test_unsubscribing_stops_the_events(env) -> None:
    connection = _subscribe(env)
    _phone_upload(env, "behavior", {})
    connection.subscriptions.pop(1)()
    _save(env, {"wrapPages": True}, 1)
    assert connection.events() == [{"kind": "behavior", "revision": 1}]


def test_subscribe_answers_unavailable_before_the_integration_is_ready(env) -> None:
    env.hass.data = {}
    connection = _call(env, env.ws.ws_watch_config_subscribe, owner_watch_id=WATCH)
    assert connection.errors == [(1, "unavailable", "integration not ready")]
    assert connection.subscriptions == {}


def test_subscribe_to_an_unreadable_file_is_unavailable_and_not_subscribed(env) -> None:
    _phone_upload(env, "behavior", {})
    _FakeStore.unreadable.add(env.mod._owner_key(WATCH))
    store = env.mod.WatchConfigStore(env.hass)
    asyncio.run(store.async_load())
    env.hass.data[DOMAIN].watch_config_store = store
    connection = _call(env, env.ws.ws_watch_config_subscribe, owner_watch_id=WATCH)
    assert connection.results == {}
    [(_id, code, message)] = connection.errors
    assert (code, message) == (
        "unavailable",
        "the stored watch config could not be read; restart Home Assistant",
    )
    assert connection.subscriptions == {}
