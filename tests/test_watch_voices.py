"""In-process tests for the watch's voice list (step 4d batch 2, decision 1A).

The real ``watch_voices_store.py`` over the one-file-per-key ``Store``
stand-in of ``test_watch_config_store.py``, the signed ``watch_voices_put``
op pulled out of ``wa_v2_views.py`` by name, and the panel's
``wrist_assistant/watch_voices/get`` loaded from ``watch_config_ws.py`` with
the stubs ``test_watch_config_ws.py`` uses. The watch computes the same hash
in Swift, so the rule is pinned here against a value worked out by hand.

The poll's half (``voices_hash`` in, ``voices_wanted`` out) is in
``test_delta_coordinator_inprocess.py``; the static half (the op in the
dispatch table, the capability, the forget on device removal) sits at the
bottom.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import hashlib
import importlib.util
import sys
import types
from pathlib import Path
from typing import Any

import pytest

from test_watch_config_store import _PKG, _FakeStore, _Hass, _loaded_module
from test_watch_config_ws import (
    _WS_PATH,
    _Connection,
    _event_message,
    _load_relay,
    _Marker,
    _stub,
)

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_STORE_PATH = _PKG_DIR / "watch_voices_store.py"
_VIEWS = _PKG_DIR / "wa_v2_views.py"

DOMAIN = "wrist_assistant"
VOICES_KEY = "wrist_assistant.watch_voices"
MAX_ENTRIES = 500
WATCH = "watch-A"
OTHER = "watch-B"


def _load():
    """Load watch_voices_store into the stub package ``_loaded_module`` made,
    with the voice constants on its const stub."""
    _stub(
        f"{_PKG}.const",
        DOMAIN=DOMAIN,
        WATCH_VOICES_STORAGE_KEY=VOICES_KEY,
        WATCH_VOICES_STORAGE_VERSION=1,
        WATCH_VOICES_MAX_ENTRIES=MAX_ENTRIES,
    )
    spec = importlib.util.spec_from_file_location(f"{_PKG}.watch_voices_store", _STORE_PATH)
    module = importlib.util.module_from_spec(spec)
    sys.modules[f"{_PKG}.watch_voices_store"] = module
    spec.loader.exec_module(module)
    return module


@pytest.fixture
def mod():
    with _loaded_module():
        yield _load()


def _new(mod):
    store = mod.WatchVoicesStore(_Hass())
    asyncio.run(store.async_load())
    return store


def _voice(voice_id: str, name: str = "Samantha", language: str = "en-US", quality: int = 1,
           **extra: Any) -> dict:
    voice = {"id": voice_id, "name": name, "language": language, "quality": quality}
    voice.update(extra)
    return voice


_SAMANTHA = _voice("com.apple.voice.compact.en-US.Samantha")
_THOMAS = _voice("com.apple.voice.compact.fr-FR.Thomas", "Thomas", "fr-FR", 2)
_ANNA = _voice("com.apple.voice.enhanced.de-DE.Anna", "Anna", "de-DE", 2)


# ── the hash rule ────────────────────────────────────────────────────────


def test_the_hash_is_sha256_of_compact_sorted_key_json_of_the_sorted_list(mod):
    ordered = mod.validate_voices([_THOMAS, _SAMANTHA, _ANNA])
    assert [v["id"] for v in ordered] == [_SAMANTHA["id"], _THOMAS["id"], _ANNA["id"]]
    text = (
        '[{"id":"com.apple.voice.compact.en-US.Samantha","language":"en-US",'
        '"name":"Samantha","quality":1},'
        '{"id":"com.apple.voice.compact.fr-FR.Thomas","language":"fr-FR",'
        '"name":"Thomas","quality":2},'
        '{"id":"com.apple.voice.enhanced.de-DE.Anna","language":"de-DE",'
        '"name":"Anna","quality":2}]'
    )
    assert mod.voices_hash(ordered) == hashlib.sha256(text.encode("utf-8")).hexdigest()


def test_the_hash_leaves_non_ascii_and_slashes_as_they_are(mod):
    ordered = mod.validate_voices([_voice("a/b", "Zoë", "nb-NO")])
    text = '[{"id":"a/b","language":"nb-NO","name":"Zoë","quality":1}]'
    assert mod.voices_hash(ordered) == hashlib.sha256(text.encode("utf-8")).hexdigest()


def test_the_empty_list_hashes_the_text_of_an_empty_array(mod):
    assert mod.voices_hash(mod.validate_voices([])) == hashlib.sha256(b"[]").hexdigest()


def test_order_sent_does_not_change_the_hash(mod):
    one = mod.voices_hash(mod.validate_voices([_SAMANTHA, _THOMAS]))
    two = mod.voices_hash(mod.validate_voices([_THOMAS, _SAMANTHA]))
    assert one == two


def test_ids_differing_in_case_are_two_voices(mod):
    ordered = mod.validate_voices([_voice("b"), _voice("B")])
    assert [v["id"] for v in ordered] == ["B", "b"]


def test_extra_keys_are_kept_and_hashed(mod):
    ordered = mod.validate_voices([_voice("a", gender=2)])
    assert ordered == [_voice("a", gender=2)]
    text = '[{"gender":2,"id":"a","language":"en-US","name":"Samantha","quality":1}]'
    assert mod.voices_hash(ordered) == hashlib.sha256(text.encode()).hexdigest()


# ── the shape ────────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    ("voices", "message"),
    [
        (None, "voices must be a list"),
        ({"id": "a"}, "voices must be a list"),
        ([_voice(f"v{i}") for i in range(MAX_ENTRIES + 1)],
         f"voices holds {MAX_ENTRIES + 1} entries; the limit is {MAX_ENTRIES}"),
        (["com.apple.voice.compact.en-US.Samantha"], r"voices\[0\] must be an object"),
        ([_voice("a"), {"name": "x", "language": "en", "quality": 1}],
         r"voices\[1\].id must be a non-empty string"),
        ([_voice("")], r"voices\[0\].id must be a non-empty string"),
        ([_voice(7)], r"voices\[0\].id must be a non-empty string"),
        ([_voice("a"), _voice("b"), _voice("a")],
         r'voices\[2\] has the id "a" of voices\[0\]; voice ids must be unique'),
        ([_voice("a", name=None)], r"voices\[0\].name must be a string"),
        ([_voice("a", language=3)], r"voices\[0\].language must be a string"),
        ([{"id": "a", "name": "n", "language": "en"}], r"voices\[0\].quality must be an integer"),
        ([_voice("a", quality="1")], r"voices\[0\].quality must be an integer"),
        ([_voice("a", quality=1.0)], r"voices\[0\].quality must be an integer"),
        ([_voice("a", quality=True)], r"voices\[0\].quality must be an integer"),
    ],
)
def test_a_list_of_the_wrong_shape_is_refused(mod, voices, message):
    store = _new(mod)
    with pytest.raises(mod.WatchVoicesValidationError, match=message) as exc:
        store.put(WATCH, voices)
    assert exc.value.code == "invalid"
    assert store.get(WATCH) is None
    assert _FakeStore.writes == []


def test_exactly_the_entry_limit_is_taken(mod):
    store = _new(mod)
    entry = store.put(WATCH, [_voice(f"v{i:03d}") for i in range(MAX_ENTRIES)])
    assert len(entry.voices) == MAX_ENTRIES


def test_a_list_over_the_byte_cap_is_refused(mod):
    store = _new(mod)
    with pytest.raises(mod.WatchVoicesValidationError, match="the limit is 262144"):
        store.put(WATCH, [_voice(f"v{i}", name="x" * 600) for i in range(MAX_ENTRIES)])


# ── the store ────────────────────────────────────────────────────────────


def test_put_stores_the_sorted_list_its_hash_and_time(mod):
    store = _new(mod)
    entry = store.put(WATCH, [_THOMAS, _SAMANTHA])
    assert entry.voices == [_SAMANTHA, _THOMAS]
    assert entry.hash == mod.voices_hash([_SAMANTHA, _THOMAS])
    assert entry.updated_at.endswith("Z")
    assert store.get(WATCH) is entry
    assert store.get(OTHER) is None
    assert _FakeStore.files[VOICES_KEY] == {
        "watches": {
            WATCH: {"voices": [_SAMANTHA, _THOMAS], "hash": entry.hash,
                    "updated_at": entry.updated_at},
        }
    }


def test_wants_is_true_until_the_stored_hash_matches(mod):
    store = _new(mod)
    digest = mod.voices_hash([_SAMANTHA])
    assert store.wants(WATCH, digest) is True
    store.put(WATCH, [_SAMANTHA])
    assert store.wants(WATCH, digest) is False
    assert store.wants(WATCH, "0" * 64) is True
    assert store.wants(OTHER, digest) is True


def test_a_put_replaces_the_watch_s_list_and_leaves_others_alone(mod):
    store = _new(mod)
    store.put(WATCH, [_SAMANTHA])
    store.put(OTHER, [_ANNA])
    entry = store.put(WATCH, [_THOMAS])
    assert store.get(WATCH).voices == [_THOMAS] and entry.hash == mod.voices_hash([_THOMAS])
    assert store.get(OTHER).voices == [_ANNA]


def test_a_refused_put_keeps_what_was_stored(mod):
    store = _new(mod)
    entry = store.put(WATCH, [_SAMANTHA])
    with pytest.raises(mod.WatchVoicesValidationError):
        store.put(WATCH, [_voice("")])
    assert store.get(WATCH) is entry


def test_the_lists_survive_a_restart(mod):
    store = _new(mod)
    entry = store.put(WATCH, [_SAMANTHA, _ANNA])
    again = _new(mod).get(WATCH)
    assert (again.voices, again.hash, again.updated_at) == (
        entry.voices, entry.hash, entry.updated_at
    )


def test_an_entry_on_disk_that_is_not_one_is_dropped(mod):
    good = {"voices": [_SAMANTHA], "hash": "a" * 64, "updated_at": "2026-10-04T10:00:00Z"}
    _FakeStore.files[VOICES_KEY] = {
        "watches": {
            WATCH: good,
            "w-bad-hash": {**good, "hash": "A" * 64},
            "w-no-list": {**good, "voices": None},
            "w-no-time": {**good, "updated_at": None},
            "w-not-object": [],
        }
    }
    store = _new(mod)
    assert store.get(WATCH).hash == "a" * 64
    for watch_id in ("w-bad-hash", "w-no-list", "w-no-time", "w-not-object"):
        assert store.get(watch_id) is None


@pytest.mark.parametrize("payload", [None, [], {"watches": []}, {"other": {}}])
def test_a_file_of_the_wrong_shape_loads_empty(mod, payload):
    _FakeStore.files[VOICES_KEY] = payload
    assert _new(mod).get(WATCH) is None


def test_an_unreadable_file_loads_empty_and_the_next_put_writes(mod):
    _FakeStore.unreadable.add(VOICES_KEY)
    store = _new(mod)
    assert store.get(WATCH) is None
    _FakeStore.unreadable.clear()
    store.put(WATCH, [_SAMANTHA])
    assert WATCH in _FakeStore.files[VOICES_KEY]["watches"]


def test_forget_drops_one_watch_s_list(mod):
    store = _new(mod)
    store.put(WATCH, [_SAMANTHA])
    store.put(OTHER, [_ANNA])
    assert store.forget(WATCH) is True
    assert store.get(WATCH) is None
    assert store.wants(WATCH, mod.voices_hash([_SAMANTHA])) is True
    assert list(_FakeStore.files[VOICES_KEY]["watches"]) == [OTHER]
    writes = len(_FakeStore.writes)
    assert store.forget(WATCH) is False
    assert len(_FakeStore.writes) == writes


def test_async_remove_deletes_the_file(mod):
    store = _new(mod)
    store.put(WATCH, [_SAMANTHA])
    asyncio.run(mod.WatchVoicesStore(_Hass()).async_remove())
    assert VOICES_KEY not in _FakeStore.files
    assert _FakeStore.removed == [VOICES_KEY]


# ── the signed op ────────────────────────────────────────────────────────


class _Response:
    def __init__(self, status: int, body: Any) -> None:
        self.status = status
        self.body = body


class _Ctx:
    def __init__(self, store: Any, watch_id: str, payload: dict) -> None:
        self.watch_id = watch_id
        self.payload = payload
        self.domain_data = types.SimpleNamespace(watch_voices_store=store)

    def signed_json(self, payload: dict, status: int = 200) -> _Response:
        return _Response(status=status, body=payload)


def _op(mod) -> Any:
    tree = ast.parse(_VIEWS.read_text(), filename=str(_VIEWS))
    [node] = [
        n for n in tree.body
        if isinstance(n, ast.AsyncFunctionDef) and n.name == "_op_watch_voices_put"
    ]
    code = compile(
        ast.Module(body=[node], type_ignores=[]),
        str(_VIEWS),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    namespace: dict[str, Any] = {
        "Any": Any,
        "Response": _Response,
        "WatchVoicesValidationError": mod.WatchVoicesValidationError,
    }
    exec(code, namespace)  # noqa: S102
    return namespace["_op_watch_voices_put"]


def _put_op(mod, store, payload: dict, watch_id: str = WATCH) -> _Response:
    return asyncio.run(_op(mod)(_Ctx(store, watch_id, payload)))


def test_the_op_stores_the_signer_s_list_and_answers_its_hash(mod):
    store = _new(mod)
    reply = _put_op(mod, store, {"voices": [_THOMAS, _SAMANTHA], "watch_id": OTHER})
    assert reply.status == 200
    assert reply.body == {
        "ok": True,
        "hash": mod.voices_hash([_SAMANTHA, _THOMAS]),
        "count": 2,
    }
    # Keyed on the signing id; nothing in the body can change that.
    assert store.get(WATCH).voices == [_SAMANTHA, _THOMAS]
    assert store.get(OTHER) is None


def test_the_op_takes_an_empty_list(mod):
    store = _new(mod)
    reply = _put_op(mod, store, {"voices": []})
    assert reply.body == {"ok": True, "hash": hashlib.sha256(b"[]").hexdigest(), "count": 0}


def test_a_malformed_list_is_a_signed_400_and_keeps_the_stored_one(mod):
    store = _new(mod)
    _put_op(mod, store, {"voices": [_SAMANTHA]})
    reply = _put_op(mod, store, {"voices": [_SAMANTHA, _SAMANTHA]})
    assert reply.status == 400
    assert reply.body == {
        "ok": False,
        "error": "invalid",
        "message": f'voices[1] has the id "{_SAMANTHA["id"]}" of voices[0]; '
        "voice ids must be unique",
    }
    assert _put_op(mod, store, {}).body["message"] == "voices must be a list"
    assert store.get(WATCH).voices == [_SAMANTHA]


def test_the_op_without_a_store_is_a_signed_503(mod):
    reply = _put_op(mod, None, {"voices": []})
    assert reply.status == 503
    assert reply.body == {"ok": False, "error": "unavailable", "message": "integration not ready"}


# ── the panel's read ─────────────────────────────────────────────────────


@pytest.fixture
def ws_env():
    with _loaded_module():
        voices_mod = _load()
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
        _load_relay()
        spec = importlib.util.spec_from_file_location(f"{_PKG}.watch_config_ws", _WS_PATH)
        ws = importlib.util.module_from_spec(spec)
        sys.modules[f"{_PKG}.watch_config_ws"] = ws
        spec.loader.exec_module(ws)
        hass = _Hass()
        store = _new(voices_mod)
        hass.data = {DOMAIN: types.SimpleNamespace(watch_voices_store=store)}
        yield types.SimpleNamespace(ws=ws, store=store, mod=voices_mod, hass=hass)


def _ws_get(env, watch_id: str = WATCH) -> _Connection:
    connection = _Connection()
    env.ws.ws_watch_voices_get(env.hass, connection, {"id": 1, "watch_id": watch_id})
    return connection


def test_get_with_nothing_reported_is_an_empty_list(ws_env):
    connection = _ws_get(ws_env)
    assert connection.errors == []
    assert connection.results[1] == {"voices": [], "updated_at": None}


def test_get_answers_the_watch_s_sorted_list_and_its_time(ws_env):
    entry = ws_env.store.put(WATCH, [_THOMAS, _SAMANTHA])
    ws_env.store.put(OTHER, [_ANNA])
    connection = _ws_get(ws_env)
    assert connection.results[1] == {
        "voices": [_SAMANTHA, _THOMAS],
        "updated_at": entry.updated_at,
    }
    # A copy of the list: the panel's result is not the stored object.
    assert connection.results[1]["voices"] is not entry.voices


def test_get_is_unavailable_without_the_store(ws_env):
    ws_env.hass.data = {}
    connection = _ws_get(ws_env)
    assert connection.results == {}
    assert connection.errors == [(1, "unavailable", "integration not ready")]


# ── static: dispatch, capability, delta, forget ──────────────────────────


def _op_table() -> dict[str, str]:
    tree = ast.parse(_VIEWS.read_text(), filename=str(_VIEWS))
    for node in tree.body:
        if isinstance(node, ast.AnnAssign) and getattr(node.target, "id", None) == "_OP_HANDLERS":
            return {
                k.value: v.id
                for k, v in zip(node.value.keys, node.value.values, strict=True)
                if isinstance(k, ast.Constant) and isinstance(v, ast.Name)
            }
    raise AssertionError("wa_v2_views.py has no _OP_HANDLERS table")


def test_the_op_is_in_the_dispatch_table() -> None:
    assert _op_table()["watch_voices_put"] == "_op_watch_voices_put"


def test_the_watch_voices_capability_is_advertised() -> None:
    """The watch sends neither its hash nor its list without it."""
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    assert "register_capability(WATCH_VOICES_CAPABILITY)" in init
    assert 'WATCH_VOICES_CAPABILITY = "watch_voices"' in const
    assert f'WATCH_VOICES_STORAGE_KEY = "{VOICES_KEY}"' in const
    assert f"WATCH_VOICES_MAX_ENTRIES = {MAX_ENTRIES}" in const


def test_the_delta_view_hands_the_hash_to_the_poll() -> None:
    views = _VIEWS.read_text()
    assert 'raw_voices_hash = payload.get("voices_hash")' in views
    assert "VOICES_HASH_RE.fullmatch(raw_voices_hash)" in views
    assert "voices_hash=voices_hash," in views


def test_setup_loads_the_store_and_attaches_it_to_the_poll() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    assert "await watch_voices_store.async_load()" in init
    assert "coordinator.attach_watch_voices_store(watch_voices_store)" in init
    assert "watch_voices_store=watch_voices_store," in init
    assert "await WatchVoicesStore(hass).async_remove()" in init


def test_a_device_removal_and_the_panel_s_forget_drop_the_list() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    assert "domain_data.watch_voices_store.forget(watch_id)" in init
    forget = (_PKG_DIR / "complication_ws.py").read_text()
    assert "voices_store.forget(watch_id)" in forget


def test_the_hash_rule_is_spelled_out_where_swift_can_find_it() -> None:
    source = _STORE_PATH.read_text()
    assert (
        'json.dumps(sorted_list, separators=(",", ":"), sort_keys=True,\n'
        "       ensure_ascii=False)"
    ) in source
