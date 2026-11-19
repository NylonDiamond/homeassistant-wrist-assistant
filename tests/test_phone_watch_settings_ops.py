"""An iPhone reading and saving the settings of its user's watches
(capability ``phone_watch_settings``, app repo
``docs/device_settings_edit_plan_2026-11.md``, step 4).

``watch_config_get`` and ``watch_config_put`` take an ``owner_watch_id`` from
an iPhone signing as itself. The handlers run in the namespace
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
STRANGER = "watch-C"
HASH_1 = "a" * 64
HASH_2 = "b" * 64
SETTINGS = {"schemaVersion": 3, "wrapPages": False, "serverMode": "Auto", "newerKey": {"kept": True}}


@pytest.fixture
def env():
    with _loaded_module() as store_mod, _loaded_notifications() as notif_mod:
        store = store_mod.WatchConfigStore(
            _Hass(),
            is_paired=lambda owner: owner in {WATCH, "watch-B", STRANGER},
            is_iphone=lambda owner: owner == PHONE,
        )
        asyncio.run(store.async_load())
        secrets = _Secrets()
        secrets.entries = {
            PHONE: _device("iphone", "user-1"),
            WATCH: _device("watch", "user-1"),
            STRANGER: _device("watch", "user-2"),
        }
        store.panel_save(WATCH, "behavior", dict(SETTINGS), base_revision=0)
        store.mark_delivered(WATCH, "behavior", 1, confirmed=True)
        yield types.SimpleNamespace(store=store, secrets=secrets, views=_handlers(store_mod, notif_mod))


def _run(env, name: str, payload: dict, signer: str = PHONE) -> Any:
    return asyncio.run(env.views[name](_Ctx(env.store, signer, payload, env.secrets)))


def _get(env, payload: dict, signer: str = PHONE) -> Any:
    return _run(env, "_op_watch_config_get", payload, signer)


def _put(env, payload: dict, signer: str = PHONE) -> Any:
    return _run(env, "_op_watch_config_put", payload, signer)


def _save(document: dict, base: int = 1, **extra: Any) -> dict:
    return {"kind": "behavior", "owner_watch_id": WATCH, "base_revision": base, "hash": HASH_2, "document": document, **extra}


# ── get ──────────────────────────────────────────────────────────────────


def test_an_iphone_reads_its_watch_s_settings_and_marks_nothing(env) -> None:
    reply = _get(env, {"kind": "behavior", "owner_watch_id": WATCH})
    assert reply.status == 200
    assert reply.body["revision"] == 1
    assert reply.body["document"] == SETTINGS
    held = _get(env, {"kind": "behavior", "owner_watch_id": WATCH, "since_revision": 1})
    assert "document" not in held.body
    # The watch has not collected anything, and no house was noted.
    assert env.secrets.main_house == {}
    assert env.store.get(WATCH, "behavior").delivered_revision == 1


def test_a_watch_with_no_record_reads_as_revision_zero(env) -> None:
    env.secrets.entries["watch-B"] = _device("watch", "user-1")
    reply = _get(env, {"kind": "behavior", "owner_watch_id": "watch-B"})
    assert reply.body["revision"] == 0
    assert "document" not in reply.body


# ── put ──────────────────────────────────────────────────────────────────


def test_an_iphone_saves_its_watch_s_settings(env) -> None:
    changed = dict(SETTINGS, wrapPages=True)
    reply = _put(env, _save(changed))
    assert (reply.status, reply.body) == (200, {"ok": True, "revision": 2})
    record = env.store.get(WATCH, "behavior")
    assert record.document == changed
    assert record.hash == HASH_2
    assert record.updated_by == PHONE
    # Waiting for the watch: the phone's save is not the watch holding it.
    assert record.delivered_revision == 1
    # The phone's own records are untouched.
    assert env.store.get(PHONE, "behavior") is None


def test_a_stale_save_is_a_conflict(env) -> None:
    reply = _put(env, _save(dict(SETTINGS), base=0))
    assert reply.status == 409
    assert reply.body["error"] == "conflict"
    assert reply.body["revision"] == 1


def test_force_is_never_taken(env) -> None:
    reply = _put(env, _save(dict(SETTINGS), base=0, force=True))
    assert reply.status == 409
    assert env.store.get(WATCH, "behavior").revision == 1


def test_a_watch_with_no_record_is_not_given_one(env) -> None:
    env.secrets.entries["watch-B"] = _device("watch", "user-1")
    reply = _put(env, dict(_save(dict(SETTINGS), base=0), owner_watch_id="watch-B"))
    assert (reply.status, reply.body["error"]) == (400, "no_record")
    assert env.store.get("watch-B", "behavior") is None


def _standard_watch(env, *, standard: bool | None = True, awaits_move: bool = False) -> None:
    """watch-B: no record, and what it said of its settings."""
    watch = _device("watch", "user-1")
    watch.standard_settings = standard
    env.secrets.entries["watch-B"] = watch
    env.secrets.may_await_move = lambda watch_id: awaits_move


def test_a_watch_on_the_standard_settings_may_start_from_the_iphone(env) -> None:
    _standard_watch(env)
    read = _get(env, {"kind": "behavior", "owner_watch_id": "watch-B"})
    assert (read.body["revision"], read.body["may_start"]) == (0, True)
    change = {"wrapPages": True}
    reply = _put(env, dict(_save(change, base=0), owner_watch_id="watch-B"))
    assert (reply.status, reply.body["ok"]) == (200, True)
    record = env.store.get("watch-B", "behavior")
    assert record.document == change
    assert record.updated_by == PHONE
    # Waiting for the watch to collect it.
    assert record.delivered_revision == 0


def test_a_first_record_from_the_iphone_needs_base_zero(env) -> None:
    _standard_watch(env)
    reply = _put(env, dict(_save({"wrapPages": True}, base=3), owner_watch_id="watch-B"))
    assert (reply.status, reply.body["error"]) == (400, "no_record")
    assert env.store.get("watch-B", "behavior") is None


@pytest.mark.parametrize(
    ("standard", "awaits_move"),
    [(None, False), (False, False), (True, True)],
    ids=["never-said", "own-settings", "move-may-come"],
)
def test_a_watch_that_may_still_send_its_own_is_not_started(env, standard, awaits_move) -> None:
    _standard_watch(env, standard=standard, awaits_move=awaits_move)
    read = _get(env, {"kind": "behavior", "owner_watch_id": "watch-B"})
    assert read.body["may_start"] is False
    reply = _put(env, dict(_save({"wrapPages": True}, base=0), owner_watch_id="watch-B"))
    assert (reply.status, reply.body["error"]) == (400, "no_record")
    assert env.store.get("watch-B", "behavior") is None


def test_a_watch_with_a_record_says_nothing_of_starting(env) -> None:
    reply = _get(env, {"kind": "behavior", "owner_watch_id": WATCH})
    assert "may_start" not in reply.body


# ── refusals ─────────────────────────────────────────────────────────────


def test_a_watch_naming_another_owner_still_means_its_own(env) -> None:
    reply = _put(env, _save(dict(SETTINGS), base=0), signer=STRANGER)
    assert reply.status == 200
    assert env.store.get(STRANGER, "behavior").revision == 1
    assert env.store.get(WATCH, "behavior").revision == 1
    read = _get(env, {"kind": "behavior", "owner_watch_id": WATCH}, signer=STRANGER)
    assert read.body["document"] == dict(SETTINGS)
    assert env.store.get(WATCH, "behavior").document == SETTINGS


@pytest.mark.parametrize("op", ["_op_watch_config_get", "_op_watch_config_put"])
def test_another_user_s_watch_is_refused(env, op) -> None:
    reply = _run(env, op, dict(_save(dict(SETTINGS)), owner_watch_id=STRANGER))
    assert (reply.status, reply.body["error"]) == (403, "not_owner")


def test_another_kind_naming_a_watch_is_the_phone_s_own(env) -> None:
    reply = _put(env, dict(_save({"schemaVersion": 1, "pages": []}, base=0), kind="pages"))
    assert reply.status == 200
    assert env.store.get(WATCH, "pages") is None
    assert env.store.get(PHONE, "pages") is not None


@pytest.mark.parametrize("op", ["_op_watch_config_get", "_op_watch_config_put"])
def test_a_watch_whose_settings_live_in_another_home_is_refused(env, op) -> None:
    env.secrets.entries[WATCH].main_house = False
    reply = _run(env, op, _save(dict(SETTINGS, wrapPages=True)))
    assert (reply.status, reply.body["error"]) == (400, "not_main_house")
    assert env.store.get(WATCH, "behavior").revision == 1


def test_an_id_that_is_not_a_string_is_refused(env) -> None:
    reply = _put(env, dict(_save(dict(SETTINGS)), owner_watch_id=7))
    assert (reply.status, reply.body["error"]) == (403, "not_owner")


def test_without_an_owner_a_phone_still_saves_its_own(env) -> None:
    reply = _put(env, {"kind": "behavior", "base_revision": 0, "hash": HASH_1, "document": {"wrapPages": True}})
    assert reply.status == 200
    assert env.store.get(PHONE, "behavior").document == {"wrapPages": True}
    assert env.store.get(WATCH, "behavior").revision == 1


# ── static ───────────────────────────────────────────────────────────────


def test_the_capability_is_advertised() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    assert "register_capability(PHONE_WATCH_SETTINGS_CAPABILITY)" in init
    assert 'PHONE_WATCH_SETTINGS_CAPABILITY = "phone_watch_settings"' in const
