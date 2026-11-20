"""An iPhone reading and saving the notification look and voice defaults of
its user's watches, and reading the speech voices a watch reported
(capability ``phone_watch_look``, app repo
``docs/device_look_voice_plan_2026-11.md``).

``watch_config_get`` and ``watch_config_put`` take an ``owner_watch_id`` for
``notification_style`` and ``voice`` as they do for ``behavior``
(``test_phone_watch_settings_ops.py``). The handlers run in the namespace
``test_watch_config_ops_inprocess.py`` builds, against a real store.
"""

from __future__ import annotations

import asyncio
import types
from pathlib import Path
from typing import Any

import pytest
from test_notification_tokens import _loaded_notifications
from test_watch_config_ops_inprocess import _Ctx, _device, _handlers, _Secrets
from test_watch_config_store import _Hass, _loaded_module

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"

PHONE = "iphone:1"
WATCH = "watch-A"
BARE = "watch-B"
STRANGER = "watch-C"
HASH_2 = "b" * 64
STYLE = {"schemaVersion": 1, "buttonFill": "tinted", "soundVolume": 0.05, "newerKey": 3}
VOICE = {
    "schemaVersion": 1,
    "defaultSpeakers": ["media_player.kitchen"],
    "defaultTTSEngine": "tts.piper",
    "phrases": [{"id": "6F1C2D0E-0000-4000-8000-0000000000D1", "label": "Dinner"}],
}
DOCUMENTS = {"notification_style": STYLE, "voice": VOICE}
KINDS = ("notification_style", "voice")


@pytest.fixture
def env():
    with _loaded_module() as store_mod, _loaded_notifications() as notif_mod:
        store = store_mod.WatchConfigStore(
            _Hass(),
            is_paired=lambda owner: owner in {WATCH, BARE, STRANGER},
            is_iphone=lambda owner: owner == PHONE,
        )
        asyncio.run(store.async_load())
        secrets = _Secrets()
        secrets.entries = {
            PHONE: _device("iphone", "user-1"),
            WATCH: _device("watch", "user-1"),
            BARE: _device("watch", "user-1"),
            STRANGER: _device("watch", "user-2"),
        }
        secrets.entries[BARE].standard_settings = True
        secrets.may_await_move = lambda watch_id: False
        for kind, document in DOCUMENTS.items():
            store.panel_save(WATCH, kind, dict(document), base_revision=0)
            store.mark_delivered(WATCH, kind, 1, confirmed=True)
        yield types.SimpleNamespace(store=store, secrets=secrets, views=_handlers(store_mod, notif_mod))


def _run(env, name: str, payload: dict, signer: str = PHONE, voices: Any = None) -> Any:
    ctx = _Ctx(env.store, signer, payload, env.secrets)
    ctx.domain_data.watch_voices_store = voices
    return asyncio.run(env.views[name](ctx))


def _get(env, payload: dict, signer: str = PHONE) -> Any:
    return _run(env, "_op_watch_config_get", payload, signer)


def _put(env, payload: dict, signer: str = PHONE) -> Any:
    return _run(env, "_op_watch_config_put", payload, signer)


def _save(kind: str, document: dict, base: int = 1, owner: str = WATCH) -> dict:
    return {"kind": kind, "owner_watch_id": owner, "base_revision": base, "hash": HASH_2, "document": document}


# ── get and put ──────────────────────────────────────────────────────────


@pytest.mark.parametrize("kind", KINDS)
def test_an_iphone_reads_its_watch_s_record_and_marks_nothing(env, kind) -> None:
    reply = _get(env, {"kind": kind, "owner_watch_id": WATCH})
    assert reply.status == 200
    assert (reply.body["revision"], reply.body["document"]) == (1, DOCUMENTS[kind])
    assert "may_start" not in reply.body
    assert env.secrets.main_house == {}


@pytest.mark.parametrize("kind", KINDS)
def test_an_iphone_saves_its_watch_s_record(env, kind) -> None:
    changed = dict(DOCUMENTS[kind], schemaVersion=1, extra="kept")
    reply = _put(env, _save(kind, changed))
    assert (reply.status, reply.body) == (200, {"ok": True, "revision": 2})
    record = env.store.get(WATCH, kind)
    assert record.document == changed
    assert record.updated_by == PHONE
    # Waiting for the watch to collect it.
    assert record.delivered_revision == 1
    assert env.store.get(PHONE, kind) is None


@pytest.mark.parametrize("kind", KINDS)
def test_a_stale_save_is_a_conflict(env, kind) -> None:
    reply = _put(env, _save(kind, dict(DOCUMENTS[kind]), base=0))
    assert (reply.status, reply.body["error"], reply.body["revision"]) == (409, "conflict", 1)


@pytest.mark.parametrize("kind", KINDS)
def test_the_iphone_never_makes_the_first_look_or_voice(env, kind) -> None:
    # watch-B runs only the standard settings, which lets the iPhone start
    # its settings record, but never these two: the watch seeds them.
    read = _get(env, {"kind": kind, "owner_watch_id": BARE})
    assert (read.body["revision"], read.body["may_start"]) == (0, False)
    reply = _put(env, _save(kind, dict(DOCUMENTS[kind]), base=0, owner=BARE))
    assert (reply.status, reply.body["error"]) == (400, "no_record")
    assert env.store.get(BARE, kind) is None


@pytest.mark.parametrize("kind", KINDS)
def test_another_user_s_watch_is_refused(env, kind) -> None:
    reply = _put(env, _save(kind, dict(DOCUMENTS[kind]), owner=STRANGER))
    assert (reply.status, reply.body["error"]) == (403, "not_owner")


def test_the_look_of_a_watch_on_another_main_home_is_refused(env) -> None:
    env.secrets.entries[WATCH].main_house = False
    reply = _put(env, _save("notification_style", dict(STYLE, buttonFill="solid")))
    assert (reply.status, reply.body["error"]) == (400, "not_main_house")
    assert env.store.get(WATCH, "notification_style").revision == 1


def test_the_voice_of_a_watch_on_another_main_home_is_this_home_s(env) -> None:
    env.secrets.entries[WATCH].main_house = False
    reply = _put(env, _save("voice", dict(VOICE, defaultTTSEngine="tts.cloud")))
    assert reply.status == 200
    assert env.store.get(WATCH, "voice").document["defaultTTSEngine"] == "tts.cloud"


def test_without_an_owner_the_phone_still_reads_its_watches_newest_look(env) -> None:
    reply = _get(env, {"kind": "notification_style"})
    assert reply.body["document"] == STYLE
    refused = _put(env, {"kind": "notification_style", "base_revision": 0, "hash": HASH_2, "document": STYLE})
    assert (refused.status, refused.body["error"]) == (400, "not_for_iphone")


# ── watch_voices_get ─────────────────────────────────────────────────────


class _Voices:
    def __init__(self, held: dict[str, Any]) -> None:
        self.held = held

    def get(self, watch_id: str) -> Any:
        return self.held.get(watch_id)


_ZOE = {"id": "com.apple.voice.premium.en-US.Zoe", "name": "Zoe", "language": "en-US", "quality": 3}


def _voices(env, payload: dict, signer: str = PHONE) -> Any:
    held = _Voices({WATCH: types.SimpleNamespace(voices=(_ZOE,), updated_at="2026-11-19T10:00:00+00:00")})
    return _run(env, "_op_watch_voices_get", payload, signer, voices=held)


def test_an_iphone_reads_the_voices_its_watch_reported(env) -> None:
    reply = _voices(env, {"owner_watch_id": WATCH})
    assert reply.body == {"ok": True, "voices": [_ZOE], "updated_at": "2026-11-19T10:00:00+00:00"}


def test_a_watch_that_never_reported_has_no_voices(env) -> None:
    reply = _voices(env, {"owner_watch_id": BARE})
    assert reply.body == {"ok": True, "voices": [], "updated_at": None}


@pytest.mark.parametrize("owner", [STRANGER, 7, None])
def test_the_voices_of_another_watch_are_refused(env, owner) -> None:
    reply = _voices(env, {"owner_watch_id": owner})
    assert (reply.status, reply.body["error"]) == (403, "not_owner")


def test_only_an_iphone_reads_a_watch_s_voices(env) -> None:
    reply = _voices(env, {"owner_watch_id": WATCH}, signer=WATCH)
    assert (reply.status, reply.body["error"]) == (403, "not_an_iphone")


# ── static ───────────────────────────────────────────────────────────────


def test_the_capability_and_op_are_there() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    views = (_PKG_DIR / "wa_v2_views.py").read_text()
    assert "register_capability(PHONE_WATCH_LOOK_CAPABILITY)" in init
    assert 'PHONE_WATCH_LOOK_CAPABILITY = "phone_watch_look"' in const
    assert '"watch_voices_get": _op_watch_voices_get,' in views
