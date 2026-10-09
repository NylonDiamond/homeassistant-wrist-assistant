"""In-process tests for the watch config WebSocket commands.

Loads ``watch_config_ws.py`` with stubbed Home Assistant modules over a real
``WatchConfigStore``, the way ``test_complication_ws.py`` runs the editor's
commands. The panel's Watch settings view and page editor are built against
the get, save, history, history_entry and restore shapes, and the phone
against the subscribe shapes, so results and events are asserted as whole
dicts and errors as exact (code, message) pairs. The ``catalog`` kind (step
3e) is read through the same commands and refused to the panel's save and
restore. The ``menus`` kind (step 4d) is saved like the others, and a save
on base 0 creates a paired watch's first copy; so are ``voice``,
``notification_style`` and ``status_pages`` (step 4d batch 2) and
``control_center`` (step 4d batch 5) and a second home's ``rooms`` (step 8).
``test_ws_command_registration.py``
covers the registration and the owner gate statically.
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

_RELAY_PATH = _WS_PATH.with_name("listener_relay.py")

DOMAIN = "wrist_assistant"
WATCH = "watch-A"
PHONE_HASH = "a" * 64

# What the panel parses a conflict's stored revision out of.
CONFLICT_REVISION = re.compile(r"^stored revision is (\d+)")


class _Marker:
    """``vol.Required``: a hashable schema dict key."""

    def __init__(self, *args: object, **kwargs: object) -> None:
        self.args = args


def _signed_in(user_id: str, *, is_admin: bool = False) -> Any:
    """The Home Assistant user on a WebSocket connection."""
    return types.SimpleNamespace(id=user_id, is_admin=is_admin)


ROOT = _signed_in("root", is_admin=True)
ALICE = _signed_in("alice")
BOB = _signed_in("bob")


class _Connection:
    # An administrator unless a test says otherwise: an administrator may
    # touch every watch, and the non-admin rule has its own tests here and
    # in test_panel_access.py.
    user: Any = ROOT

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


def _load_relay() -> types.ModuleType:
    """Load ``listener_relay.py`` into the stub package, where
    ``watch_config_ws.py`` imports it from. It needs no stubs."""
    spec = importlib.util.spec_from_file_location(f"{_PKG}.listener_relay", _RELAY_PATH)
    relay = importlib.util.module_from_spec(spec)
    sys.modules[f"{_PKG}.listener_relay"] = relay
    spec.loader.exec_module(relay)
    return relay


def _load_panel_access() -> types.ModuleType:
    """Load ``panel_access.py`` into the stub package, where
    ``watch_config_ws.py`` imports it from. It needs only the two constants,
    added to whatever const stub is already there."""
    _stub(f"{_PKG}.const", DOMAIN=DOMAIN, LIBRARY_OWNER_ID="library")
    spec = importlib.util.spec_from_file_location(
        f"{_PKG}.panel_access", _WS_PATH.with_name("panel_access.py")
    )
    access = importlib.util.module_from_spec(spec)
    sys.modules[f"{_PKG}.panel_access"] = access
    spec.loader.exec_module(access)
    return access


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
        relay_mod = _load_relay()
        _load_panel_access()
        spec = importlib.util.spec_from_file_location(f"{_PKG}.watch_config_ws", _WS_PATH)
        ws = importlib.util.module_from_spec(spec)
        sys.modules[f"{_PKG}.watch_config_ws"] = ws
        spec.loader.exec_module(ws)

        hass = _Hass()
        store = store_mod.WatchConfigStore(hass)
        asyncio.run(store.async_load())
        hass.data = {DOMAIN: types.SimpleNamespace(watch_config_store=store)}
        yield types.SimpleNamespace(
            ws=ws, store=store, mod=store_mod, hass=hass, relay_mod=relay_mod
        )


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


def _pages_doc(name: str = "Home", *, items: list | None = None) -> dict:
    """A small page config: one page, made-up entity ids only."""
    return {
        "schemaVersion": 1,
        "pages": [
            {
                "id": "6F1C2D0E-0000-4000-8000-000000000001",
                "name": name,
                "items": items
                if items is not None
                else [{"id": "T1", "entityId": "light.made_up", "colSpan": 6}],
            }
        ],
    }


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
        "rejected_revision": 0,
        "rejected_at": None,
        "rejected_reason": None,
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
        "rejected_revision": 0,
        "rejected_at": None,
        "rejected_reason": None,
        "document": settings,
    }


def test_get_shows_the_unreadable_report(env) -> None:
    _phone_upload(env, "pages", _pages_doc())
    assert _save(env, _pages_doc("Renamed"), 1, kind="pages").errors == []
    env.store.report_unreadable(WATCH, "pages", 2)
    record = env.store.get(WATCH, "pages")
    result = _get(env, "pages")
    assert (result["revision"], result["rejected_revision"]) == (2, 2)
    assert result["rejected_at"] == record.rejected_at
    assert result["rejected_at"]
    # An older watch app gives no reason.
    assert result["rejected_reason"] is None


def test_get_shows_the_watch_s_reason_for_the_report(env) -> None:
    _phone_upload(env, "pages", _pages_doc())
    assert _save(env, _pages_doc("Renamed"), 1, kind="pages").errors == []
    env.store.report_unreadable(WATCH, "pages", 2, "too large for the watch")
    result = _get(env, "pages")
    assert (result["rejected_revision"], result["rejected_reason"]) == (2, "too large for the watch")


def test_get_may_read_pages(env) -> None:
    _phone_upload(env, "pages", _pages_doc())
    assert _get(env, "pages")["document"] == _pages_doc()


def test_get_never_moves_delivery(env) -> None:
    _phone_upload(env, "behavior", {})
    assert _save(env, {"wrapPages": True}, 1).errors == []
    _FakeStore.writes.clear()
    result = _get(env)
    assert (result["revision"], result["delivered_revision"]) == (2, 1)
    assert _FakeStore.writes == []


def test_summary_is_empty_with_nothing_stored(env) -> None:
    assert _ok(env, env.ws.ws_watch_config_summary) == {"owners": {}}


def test_summary_gives_each_watch_its_numbers_and_no_document(env) -> None:
    _phone_upload(env, "behavior", {"longPressDuration": "Long"})
    _save(env, {"longPressDuration": "Short"}, 1)
    assert _ok(env, env.ws.ws_watch_config_summary) == {
        "owners": {
            WATCH: {
                "behavior": {
                    "revision": 2,
                    "hash": env.store.get(WATCH, "behavior").hash[:16],
                    "delivered_revision": 1,
                    "rejected_revision": 0,
                }
            }
        }
    }


def test_summary_leaves_out_the_catalog_only_the_phone_writes(env) -> None:
    _phone_upload(env, "behavior", {"longPressDuration": "Long"})
    kinds = _ok(env, env.ws.ws_watch_config_summary)["owners"][WATCH]
    assert "catalog" not in kinds
    assert set(kinds) <= set(env.ws.WATCH_CONFIG_PANEL_KINDS)


def test_summary_counts_the_items_of_the_kinds_that_list_them(env) -> None:
    pages = _pages_doc()
    pages["pages"].append({"id": "SYS", "name": "Settings", "isSystemPage": True, "items": []})
    _phone_upload(env, "pages", pages)
    _phone_upload(env, "behavior", {"longPressDuration": "Long"})
    kinds = _ok(env, env.ws.ws_watch_config_summary)["owners"][WATCH]
    assert kinds["pages"]["items"] == 1
    assert "items" not in kinds["behavior"]


def test_item_count_reads_each_list_kind_and_nothing_else(env) -> None:
    count = env.ws._item_count
    assert count("status_pages", {"statusPages": [{"id": "a"}, {"id": "b"}, "junk"]}) == 2
    assert count("control_center", {"entities": [{"entityId": "light.x"}]}) == 1
    assert count("control_center", {"entities": "not a list"}) == 0
    assert count("pages", None) == 0
    assert count("behavior", {"pages": [{}]}) is None


def test_summary_never_moves_delivery(env) -> None:
    _phone_upload(env, "behavior", {"longPressDuration": "Long"})
    _save(env, {"longPressDuration": "Short"}, 1)
    _ok(env, env.ws.ws_watch_config_summary)
    assert env.store.get(WATCH, "behavior").delivered_revision == 1


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


def test_save_with_base_zero_over_a_stored_record_is_a_conflict(env) -> None:
    _phone_upload(env, "behavior", {})
    code, message = _error(
        env,
        env.ws.ws_watch_config_save,
        owner_watch_id=WATCH,
        kind="behavior",
        base_revision=0,
        document={},
    )
    assert (code, message) == ("conflict", "stored revision is 1, save was based on 0")
    match = CONFLICT_REVISION.match(message)
    assert match is not None and int(match.group(1)) == 1


def test_save_with_base_zero_and_nothing_stored_is_no_record_for_an_unpaired_watch(env) -> None:
    assert _error(
        env,
        env.ws.ws_watch_config_save,
        owner_watch_id=WATCH,
        kind="behavior",
        base_revision=0,
        document={},
    ) == (
        "no_record",
        "there is no stored behavior record and this watch is not paired; "
        "pair it before starting its config here",
    )
    assert _get(env)["revision"] == 0


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


def test_save_may_save_pages(env) -> None:
    _phone_upload(env, "pages", _pages_doc())
    edited = _pages_doc("Renamed")
    connection = _save(env, edited, 1, kind="pages")
    assert connection.errors == []
    assert connection.results[1] == {"revision": 2}
    result = _get(env, "pages")
    assert (result["updated_by"], result["document"]) == ("panel", edited)
    assert result["hash"] == env.mod.canonical_hash(edited)


def test_save_of_pages_with_nothing_stored_is_no_record(env) -> None:
    code, _message = _error(
        env,
        env.ws.ws_watch_config_save,
        owner_watch_id=WATCH,
        kind="pages",
        base_revision=0,
        document=_pages_doc(),
    )
    assert code == "no_record"


def test_save_of_pages_with_duplicate_item_ids_is_invalid(env) -> None:
    _phone_upload(env, "pages", _pages_doc())
    tile = {"id": "T1", "entityId": "light.made_up"}
    code, message = _error(
        env,
        env.ws.ws_watch_config_save,
        owner_watch_id=WATCH,
        kind="pages",
        base_revision=1,
        document=_pages_doc(items=[tile, dict(tile)]),
    )
    assert code == "invalid"
    assert message == (
        'document.pages[0] (id "6F1C2D0E-0000-4000-8000-000000000001").items[1] '
        'has the item id "T1" of items[0]; item ids must be unique in a page'
    )
    assert _get(env, "pages")["revision"] == 1


def test_save_of_pages_with_duplicate_page_ids_is_invalid(env) -> None:
    _phone_upload(env, "pages", _pages_doc())
    document = _pages_doc()
    document["pages"].append(dict(document["pages"][0], name="Copy"))
    code, message = _error(
        env,
        env.ws.ws_watch_config_save,
        owner_watch_id=WATCH,
        kind="pages",
        base_revision=1,
        document=document,
    )
    assert code == "invalid"
    assert message.startswith('document.pages[1] has the page id "6F1C2D0E-')


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
    for command, extra in (
        (env.ws.ws_watch_config_history, {}),
        (env.ws.ws_watch_config_history_entry, {"revision": 1}),
        (env.ws.ws_watch_config_restore, {"revision": 1, "base_revision": 2}),
    ):
        assert _error(env, command, owner_watch_id=WATCH, kind="behavior", **extra) == (
            "unavailable",
            "integration not ready",
        )


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
    assert _history_error(env)[0] == "unavailable"
    assert _restore_error(env, 1, 2)[0] == "unavailable"


# ── history, history_entry and restore ───────────────────────────────────


def _history(env, kind: str = "behavior") -> Any:
    return _ok(env, env.ws.ws_watch_config_history, owner_watch_id=WATCH, kind=kind)


def _history_error(env, kind: str = "behavior") -> tuple[str, str]:
    return _error(env, env.ws.ws_watch_config_history, owner_watch_id=WATCH, kind=kind)


def _entry(env, revision: Any, kind: str = "behavior") -> _Connection:
    return _call(
        env,
        env.ws.ws_watch_config_history_entry,
        owner_watch_id=WATCH,
        kind=kind,
        revision=revision,
    )


def _restore(env, revision: Any, base: Any, kind: str = "behavior") -> _Connection:
    return _call(
        env,
        env.ws.ws_watch_config_restore,
        owner_watch_id=WATCH,
        kind=kind,
        revision=revision,
        base_revision=base,
    )


def _restore_error(env, revision: Any, base: Any, kind: str = "behavior") -> tuple[str, str]:
    connection = _restore(env, revision, base, kind)
    assert connection.results == {}
    [(_id, code, message)] = connection.errors
    return code, message


def _three_behavior_saves(env) -> list[dict]:
    """Revisions 1 (phone), 2 (panel), 3 (phone); returns their documents."""
    docs = [{"wrapPages": False}, {"wrapPages": True, "longPressDuration": "Long"}, {}]
    _phone_upload(env, "behavior", docs[0])
    assert _save(env, docs[1], 1).errors == []
    _phone_upload(env, "behavior", docs[2], base=2)
    return docs


def test_history_lists_entries_newest_first_without_documents(env) -> None:
    docs = _three_behavior_saves(env)
    record = env.store.get(WATCH, "behavior")
    assert _history(env) == {
        "entries": [
            {
                "revision": 2,
                "hash": env.mod.canonical_hash(docs[1]),
                "updated_at": record.history[1].updated_at,
                "updated_by": "panel",
                "size": len('{"wrapPages":true,"longPressDuration":"Long"}'),
            },
            {
                "revision": 1,
                "hash": PHONE_HASH,
                "updated_at": record.history[0].updated_at,
                "updated_by": WATCH,
                "size": len('{"wrapPages":false}'),
            },
        ]
    }


def test_history_with_no_record_is_empty(env) -> None:
    assert _history(env) == {"entries": []}
    assert _history(env, "pages") == {"entries": []}


def test_history_refuses_an_unknown_kind(env) -> None:
    code, message = _history_error(env, "quick_actions")
    assert code == "invalid"
    assert "kind" in message


def test_history_entry_returns_the_document(env) -> None:
    docs = _three_behavior_saves(env)
    connection = _entry(env, 2)
    assert connection.errors == []
    entry = env.store.get(WATCH, "behavior").history[1]
    assert connection.results[1] == {
        "revision": 2,
        "hash": env.mod.canonical_hash(docs[1]),
        "updated_at": entry.updated_at,
        "updated_by": "panel",
        "document": docs[1],
    }


def test_history_entry_that_is_not_there_is_not_found(env) -> None:
    _three_behavior_saves(env)
    connection = _entry(env, 3)
    assert connection.results == {}
    assert connection.errors == [(1, "not_found", "revision 3 of behavior is not in the history")]
    assert _entry(env, 1, kind="pages").errors[0][1] == "not_found"
    assert _entry(env, 0).errors[0][1] == "invalid"


def test_restore_saves_the_entry_as_a_new_panel_revision(env) -> None:
    docs = _three_behavior_saves(env)
    events = _subscribe(env)
    connection = _restore(env, 1, 3)
    assert connection.errors == []
    assert connection.results[1] == {"revision": 4}
    result = _get(env)
    assert (result["revision"], result["updated_by"], result["document"]) == (4, "panel", docs[0])
    assert result["hash"] == env.mod.canonical_hash(docs[0])
    assert result["delivered_revision"] == 3
    assert [e["revision"] for e in _history(env)["entries"]] == [3, 2, 1]
    assert events.events() == [{"kind": "behavior", "revision": 4}]


def test_restore_of_pages(env) -> None:
    original = _pages_doc("Original")
    _phone_upload(env, "pages", original)
    assert _save(env, _pages_doc("Renamed"), 1, kind="pages").errors == []
    connection = _restore(env, 1, 2, kind="pages")
    assert connection.results[1] == {"revision": 3}
    assert _get(env, "pages")["document"] == original


def test_restore_on_a_stale_base_is_a_conflict_naming_the_stored_revision(env) -> None:
    _three_behavior_saves(env)
    code, message = _restore_error(env, 1, 2)
    assert (code, message) == ("conflict", "stored revision is 3, restore was based on 2")
    match = CONFLICT_REVISION.match(message)
    assert match is not None and int(match.group(1)) == 3
    assert _get(env)["revision"] == 3


def test_restore_of_an_unknown_revision_is_not_found(env) -> None:
    _three_behavior_saves(env)
    assert _restore_error(env, 9, 3) == (
        "not_found",
        "revision 9 of behavior is not in the history",
    )
    assert _get(env)["revision"] == 3


def test_restore_with_nothing_stored_is_no_record(env) -> None:
    assert _restore_error(env, 1, 1)[0] == "no_record"


def test_restore_of_a_tile_fault_a_device_wrote_is_invalid(env) -> None:
    tile = {"id": "T1", "entityId": "light.made_up"}
    _phone_upload(env, "pages", _pages_doc(items=[tile, dict(tile)]))
    _phone_upload(env, "pages", _pages_doc(), base=1)
    code, message = _restore_error(env, 1, 2, kind="pages")
    assert code == "invalid"
    assert "item ids must be unique in a page" in message
    assert _get(env, "pages")["revision"] == 2


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


def _reload(env) -> Any:
    """What a config entry reload does to the store: unload lets go of the
    old one, and the next setup builds a new one from the same file and
    points the live subscriptions at it. The WebSocket stays open."""
    relay = env.ws.listener_relay(env.hass, env.ws.WATCH_CONFIG)
    relay.release()
    store = env.mod.WatchConfigStore(env.hass)
    asyncio.run(store.async_load())
    env.hass.data[DOMAIN].watch_config_store = store
    relay.follow(store)
    old, env.store = env.store, store
    return old


def test_a_subscription_hears_the_new_store_after_a_reload(env) -> None:
    """The phone's live line survives a reload of the integration: a save on
    the reloaded store is an event, and the old store is heard no more."""
    _phone_upload(env, "behavior", {})
    connection = _subscribe(env)
    old = _reload(env)
    assert _save(env, {"wrapPages": True}, 1).errors == []
    # The reloaded store continues above its revision floor.
    revision = env.store._revision_floor + 1
    assert connection.events() == [{"kind": "behavior", "revision": revision}]
    old.put(WATCH, "behavior", {}, document_hash=PHONE_HASH, base_revision=1, updated_by=WATCH)
    assert connection.events() == [{"kind": "behavior", "revision": revision}]


def test_unsubscribing_after_a_reload_stops_the_events(env) -> None:
    connection = _subscribe(env)
    _reload(env)
    connection.subscriptions.pop(1)()
    _phone_upload(env, "behavior", {})
    assert connection.events() == []


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


class _Secrets:
    """The secret store's one read here: whose user a device is bound to."""

    def __init__(self, users: dict[str, str | None]) -> None:
        self.users = users

    def get(self, device_id: str) -> Any:
        if device_id not in self.users:
            return None
        return types.SimpleNamespace(user_id=self.users[device_id])


def _subscribe_as(env, user: Any, owner: str = WATCH) -> _Connection:
    env.hass.data[DOMAIN].widget_secret_store = _Secrets(
        {WATCH: "alice", "watch-legacy": None}
    )
    connection = _Connection()
    connection.user = user
    env.ws.ws_watch_config_subscribe(env.hass, connection, {"id": 1, "owner_watch_id": owner})
    return connection


def test_subscribe_lets_a_non_admin_follow_their_own_watch(env) -> None:
    connection = _subscribe_as(env, ALICE)
    assert connection.errors == []
    _phone_upload(env, "behavior", {})
    assert connection.events() == [{"kind": "behavior", "revision": 1}]


@pytest.mark.parametrize(
    ("user", "owner"),
    [
        (BOB, WATCH),
        (ALICE, "watch-legacy"),
        (ALICE, "no-such-watch"),
        (None, WATCH),
    ],
    ids=["another-user", "unbound-watch", "unknown-watch", "no-user"],
)
def test_subscribe_refuses_a_watch_not_paired_to_the_caller(env, user, owner) -> None:
    connection = _subscribe_as(env, user, owner)
    assert connection.results == {}
    assert connection.subscriptions == {}
    [(_id, code, _message)] = connection.errors
    assert code == "unauthorized"
    _phone_upload(env, "behavior", {})
    assert connection.events() == []


def test_subscribe_lets_an_admin_follow_any_watch(env) -> None:
    assert _subscribe_as(env, ROOT, "watch-legacy").errors == []
    assert _subscribe_as(env, ROOT, "no-such-watch").errors == []


# ── step 3e: the catalog (the phone writes it, the panel reads it) ───────


def _catalog(name: str = "Open Gate") -> dict:
    return {
        "httpActions": [{"id": "6F1C2D0E-0000-4000-8000-0000000000A1", "name": name}],
        "macros": [{"id": "6F1C2D0E-0000-4000-8000-0000000000B1", "name": "Bedtime",
                    "steps": 4}],
        "schemaVersion": 1,
    }


def test_get_may_read_the_catalog(env) -> None:
    _phone_upload(env, "catalog", _catalog())
    result = _get(env, "catalog")
    assert (result["kind"], result["revision"], result["updated_by"]) == ("catalog", 1, WATCH)
    assert result["document"] == _catalog()


def test_history_of_the_catalog_lists_the_phone_s_uploads(env) -> None:
    _phone_upload(env, "catalog", _catalog())
    _phone_upload(env, "catalog", _catalog("Gate"), base=1)
    assert [e["revision"] for e in _history(env, "catalog")["entries"]] == [1]
    connection = _entry(env, 1, kind="catalog")
    assert connection.results[1]["document"] == _catalog()


def test_the_panel_may_neither_save_nor_restore_the_catalog(env) -> None:
    _phone_upload(env, "catalog", _catalog())
    _phone_upload(env, "catalog", _catalog("Gate"), base=1)
    refusal = (
        "invalid",
        "the panel cannot save catalog; it may save behavior, control_center, "
        "menus, notification_style, pages, rooms, status_pages, voice",
    )
    connection = _save(env, _catalog("Panel"), 2, kind="catalog")
    assert connection.results == {}
    assert [(code, message) for _id, code, message in connection.errors] == [refusal]
    assert _restore_error(env, 1, 2, kind="catalog") == refusal
    result = _get(env, "catalog")
    assert (result["revision"], result["document"]) == (2, _catalog("Gate"))


def test_subscribe_lists_the_catalog_and_hears_its_uploads(env) -> None:
    _phone_upload(env, "pages", {"pages": []})
    _phone_upload(env, "catalog", _catalog())
    connection = _subscribe(env)
    assert connection.results[1] == {"revisions": {"catalog": 1, "pages": 1}}
    _phone_upload(env, "catalog", _catalog("Gate"), base=1)
    assert connection.events() == [{"kind": "catalog", "revision": 2}]


# ── step 4d: the menus, and the panel's first copy for a paired watch ────


def _menus(display_mode: str = "icons") -> dict:
    return {
        "schemaVersion": 1,
        "quickAction": {"schemaVersion": 1, "slots": [{"id": "S1", "position": "top"}]},
        "entityRadial": {"schemaVersion": 1, "lightSlots": [{"id": "S1"}]},
        "pageSwitcher": {"schemaVersion": 1, "displayMode": display_mode},
    }


def _paired_store(env) -> None:
    """Swap in a store whose secret store knows WATCH, as setup builds it."""
    store = env.mod.WatchConfigStore(env.hass, is_paired=lambda owner: owner == WATCH)
    asyncio.run(store.async_load())
    env.hass.data[DOMAIN].watch_config_store = store
    env.store = store


def test_save_creates_the_first_menus_for_a_paired_watch(env) -> None:
    _paired_store(env)
    subscriber = _subscribe(env)
    connection = _save(env, _menus(), 0, kind="menus")
    assert connection.errors == []
    assert connection.results[1] == {"revision": 1}
    result = _get(env, "menus")
    assert result == {
        "kind": "menus",
        "revision": 1,
        "hash": env.mod.canonical_hash(_menus()),
        "updated_at": result["updated_at"],
        "updated_by": "panel",
        "delivered_revision": 0,
        "delivered_at": None,
        "rejected_revision": 0,
        "rejected_at": None,
        "rejected_reason": None,
        "document": _menus(),
    }
    assert result["updated_at"]
    assert _history(env, "menus")["entries"] == []
    assert subscriber.events() == [{"kind": "menus", "revision": 1}]
    # The panel's next save builds on it, and the created copy is history.
    assert _save(env, _menus("text"), 1, kind="menus").results[1] == {"revision": 2}
    assert [e["revision"] for e in _history(env, "menus")["entries"]] == [1]
    assert _restore(env, 1, 2, "menus").results[1] == {"revision": 3}
    assert _get(env, "menus")["document"] == _menus()


def test_save_of_menus_for_an_unpaired_watch_is_no_record(env) -> None:
    _paired_store(env)
    code, _message = _error(
        env,
        env.ws.ws_watch_config_save,
        owner_watch_id="watch-never-paired",
        kind="menus",
        base_revision=0,
        document=_menus(),
    )
    assert code == "no_record"
    assert _get(env, "menus", owner="watch-never-paired")["revision"] == 0


def test_save_of_menus_with_a_duplicate_slot_id_is_invalid(env) -> None:
    _paired_store(env)
    document = _menus()
    document["quickAction"]["slots"].append({"id": "s1"})
    code, message = _error(
        env,
        env.ws.ws_watch_config_save,
        owner_watch_id=WATCH,
        kind="menus",
        base_revision=0,
        document=document,
    )
    assert code == "invalid"
    assert message == (
        'document.quickAction.slots[1] has the slot id "s1" of '
        "document.quickAction.slots[0]; slot ids must be unique in a list"
    )
    assert _get(env, "menus")["revision"] == 0


def test_restore_still_needs_a_record_for_a_paired_watch(env) -> None:
    _paired_store(env)
    assert _restore_error(env, 1, 0, kind="menus")[0] == "no_record"


# ── step 4d batch 2: voice, notification style, status pages ─────────────


def _batch_2_doc(kind: str, label: str = "Dinner") -> dict:
    """A first copy of each batch 2 kind (and the batch 5 Control Center
    list), made-up entities only."""
    return {
        "voice": {
            "schemaVersion": 1,
            "phrases": [{"id": "P1", "message": "Dinner is ready", "label": label}],
            "defaultTTSEngine": "tts.made_up_engine",
            "defaultSpeakers": ["media_player.made_up_kitchen"],
        },
        "notification_style": {"schemaVersion": 1, "buttonFill": label},
        "status_pages": {
            "schemaVersion": 1,
            "statusPages": [
                {"id": "SP1", "name": label, "rows": [{"id": "R1", "entityId": "sensor.made_up"}]}
            ],
        },
        "control_center": {
            "schemaVersion": 1,
            "entities": [
                {
                    "entityId": "light.made_up",
                    "displayName": label,
                    "iconName": "lightbulb.fill",
                    "domain": "light",
                }
            ],
        },
        "rooms": {
            "schemaVersion": 1,
            "roomQuickJumpSourceEntityId": "sensor.made_up_room",
            "roomQuickJumpMappings": {"kitchen": label},
        },
    }[kind]


# With the batch 5 Control Center list and the step 8 rooms, which the panel
# creates and saves the same way.
_BATCH_2_KINDS = ("voice", "notification_style", "status_pages", "control_center", "rooms")


@pytest.mark.parametrize("kind", _BATCH_2_KINDS)
def test_save_creates_the_first_batch_2_record_for_a_paired_watch(env, kind) -> None:
    _paired_store(env)
    subscriber = _subscribe(env)
    document = _batch_2_doc(kind)
    connection = _save(env, document, 0, kind=kind)
    assert connection.errors == []
    assert connection.results[1] == {"revision": 1}
    result = _get(env, kind)
    assert result == {
        "kind": kind,
        "revision": 1,
        "hash": env.mod.canonical_hash(document),
        "updated_at": result["updated_at"],
        "updated_by": "panel",
        "delivered_revision": 0,
        "delivered_at": None,
        "rejected_revision": 0,
        "rejected_at": None,
        "rejected_reason": None,
        "document": document,
    }
    assert subscriber.events() == [{"kind": kind, "revision": 1}]
    edited = _batch_2_doc(kind, "Supper")
    assert _save(env, edited, 1, kind=kind).results[1] == {"revision": 2}
    assert _restore(env, 1, 2, kind).results[1] == {"revision": 3}
    assert _get(env, kind)["document"] == document


@pytest.mark.parametrize("kind", _BATCH_2_KINDS)
def test_save_of_a_batch_2_kind_for_an_unpaired_watch_is_no_record(env, kind) -> None:
    _paired_store(env)
    code, message = _error(
        env,
        env.ws.ws_watch_config_save,
        owner_watch_id="watch-never-paired",
        kind=kind,
        base_revision=0,
        document=_batch_2_doc(kind),
    )
    assert (code, message) == (
        "no_record",
        f"there is no stored {kind} record and this watch is not paired; "
        "pair it before starting its config here",
    )
    assert _get(env, kind, owner="watch-never-paired")["revision"] == 0


@pytest.mark.parametrize(
    ("kind", "document", "message"),
    [
        ("voice", {"phrases": [{"id": "P1"}, {"id": "p1"}]},
         'document.phrases[1] has the phrase id "p1" of document.phrases[0]; '
         "phrase ids must be unique"),
        ("status_pages", {"statusPages": [{"id": "SP1", "rows": []}]},
         "document.statusPages[0].name must be a string"),
        ("control_center", {"entities": [{"entityId": "light.a", "displayName": "A",
                                          "iconName": "x"}]},
         "document.entities[0].domain must be a string"),
    ],
)
def test_save_of_a_malformed_batch_2_document_is_invalid(env, kind, document, message) -> None:
    _paired_store(env)
    code, got = _error(
        env,
        env.ws.ws_watch_config_save,
        owner_watch_id=WATCH,
        kind=kind,
        base_revision=0,
        document=document,
    )
    assert (code, got) == ("invalid", message)
    assert _get(env, kind)["revision"] == 0


class _FakeLibrary:
    """The bits of ``HTTPActionsStore`` the summary reads."""

    def __init__(self, revision: int, delivered: dict[str, int], available: bool = True) -> None:
        self.revision = revision
        self._delivered = delivered
        self.available = available

    def delivered(self) -> dict[str, int]:
        return dict(self._delivered)


def test_the_summary_names_the_home_s_http_action_library(env) -> None:
    """Step 4d batch 4: Home reads which watch still waits for the library
    from the same answer. Left out with no library, and for a file that
    could not be read."""
    assert "http_actions" not in _ok(env, env.ws.ws_watch_config_summary)
    domain = env.hass.data[DOMAIN]
    domain.http_actions_store = _FakeLibrary(3, {"watch-A": 3, "watch-B": 1})
    summary = _ok(env, env.ws.ws_watch_config_summary)
    assert summary["http_actions"] == {"revision": 3, "delivered": {"watch-A": 3, "watch-B": 1}}
    assert set(summary) == {"owners", "http_actions"}
    domain.http_actions_store = _FakeLibrary(3, {}, available=False)
    assert "http_actions" not in _ok(env, env.ws.ws_watch_config_summary)


# ── phone pages: an iPhone's own records ─────────────────────────────────

PHONE = "iphone-1"


def _phone_pages_store(env) -> None:
    """Swap in a store whose secret store knows WATCH as a watch and PHONE
    as an iPhone, as setup builds it."""
    store = env.mod.WatchConfigStore(
        env.hass,
        is_paired=lambda owner: owner == WATCH,
        is_iphone=lambda owner: owner == PHONE,
    )
    asyncio.run(store.async_load())
    env.hass.data[DOMAIN].watch_config_store = store
    env.store = store


def test_the_panel_starts_a_phone_s_pages_and_settings(env) -> None:
    _phone_pages_store(env)
    subscriber = _subscribe(env, owner=PHONE)
    assert _save(env, _pages_doc(), 0, kind="pages", owner=PHONE).results[1] == {"revision": 1}
    sent = {"schemaVersion": 1, "wrapPages": True, "serverMode": "Local", "roomQuickJumpEnabled": True}
    assert _save(env, sent, 0, kind="behavior", owner=PHONE).results[1] == {"revision": 1}
    # The watch only setting and the room key are gone, silently, and the
    # record the panel reads back says so.
    result = _get(env, "behavior", owner=PHONE)
    assert result["document"] == {"schemaVersion": 1, "wrapPages": True}
    assert result["hash"] == env.mod.canonical_hash({"schemaVersion": 1, "wrapPages": True})
    assert subscriber.events() == [
        {"kind": "pages", "revision": 1},
        {"kind": "behavior", "revision": 1},
    ]
    # Nothing landed on the watch.
    assert _get(env, "pages")["revision"] == 0
    assert _get(env, "behavior")["revision"] == 0


@pytest.mark.parametrize("kind", ["voice", "notification_style", "control_center"])
def test_the_panel_may_not_save_or_restore_a_watch_only_kind_for_a_phone(env, kind) -> None:
    _phone_pages_store(env)
    refusal = (
        "not_for_iphone",
        f"an iPhone cannot own {kind}; it may own behavior, menus, pages, rooms, status_pages",
    )
    connection = _save(env, {"schemaVersion": 1, "entities": [], "phrases": []}, 0, kind=kind, owner=PHONE)
    assert [(code, message) for _id, code, message in connection.errors] == [refusal]
    connection = _call(
        env,
        env.ws.ws_watch_config_restore,
        owner_watch_id=PHONE,
        kind=kind,
        revision=1,
        base_revision=1,
    )
    assert [(code, message) for _id, code, message in connection.errors] == [refusal]
    assert _get(env, kind, owner=PHONE)["revision"] == 0
