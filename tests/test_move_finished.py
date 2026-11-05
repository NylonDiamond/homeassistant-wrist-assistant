"""The signed ``move_finished`` op: an iPhone says its move is finished.

Until this op only a person or the 24 hour grace ended a watch's wait, so a
phone with nothing to move left its watch waiting on a phone that was done.
Only the iPhone a watch names as its owner may end that watch's wait this way.
The handler is pulled out of ``wa_v2_views.py`` by name and run against the real
``WidgetSecretStore``, the way ``test_push_ops_inprocess.py`` runs its ops.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import types
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any

import pytest

from test_widget_secret_user_binding import SECRET_A, SECRET_B, _loaded_store

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_MODULE = _PKG_DIR / "wa_v2_views.py"
_NAMES = ("_caller_is_iphone", "_op_move_finished")


class _Response:
    def __init__(self, status: int, body: Any) -> None:
        self.status = status
        self.body = body


class _Coordinator:
    def __init__(self) -> None:
        self.polling: set[str] = set()
        self.woken: list[str] = []

    def is_polling(self, watch_id: str) -> bool:
        return watch_id in self.polling

    def wake_watch(self, watch_id: str) -> None:
        self.woken.append(watch_id)


class _Disk:
    """A ``Store`` that keeps the last write, in order with the wakes."""

    def __init__(self, log: list[str]) -> None:
        self.log = log
        self.data: Any = None

    def async_delay_save(self, *_a: object, **_k: object) -> None:
        self.log.append("delay")

    async def async_save(self, data: Any) -> None:
        self.data = data
        self.log.append("save")

    async def async_load(self) -> Any:
        return self.data


def _handlers() -> dict[str, Any]:
    tree = ast.parse(_MODULE.read_text(), filename=str(_MODULE))
    wanted = [
        node
        for node in tree.body
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in _NAMES
    ]
    assert sorted(n.name for n in wanted) == sorted(_NAMES)
    code = compile(
        ast.Module(body=wanted, type_ignores=[]),
        str(_MODULE),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    from test_notification_tokens import _loaded_notifications

    with _loaded_notifications() as notif:
        namespace: dict[str, Any] = {
            "Any": Any,
            "Response": _Response,
            "is_iphone_entry": notif.is_iphone_entry,
        }
        exec(code, namespace)  # noqa: S102
    return namespace


@pytest.fixture
def env():
    with _loaded_store() as mod:
        secrets = mod.WidgetSecretStore(object())
        log: list[str] = []
        disk = _Disk(log)
        secrets._store = disk
        secrets.register("p1", SECRET_A, mod.LABEL_IPHONE_SELF_PROVISION, user_id="u1")
        secrets.register("p2", SECRET_A, mod.LABEL_IPHONE_SELF_PROVISION, user_id="u1")
        secrets.register(
            "w1", SECRET_B, mod.LABEL_WATCH_SELF_PROVISION, owner_iphone_id="p1", user_id="u1"
        )
        secrets.register("w-code", SECRET_B, mod.LABEL_WATCH_CODE_PAIR, user_id="u1")
        log.clear()
        coordinator = _Coordinator()
        yield types.SimpleNamespace(
            mod=mod,
            secrets=secrets,
            disk=disk,
            log=log,
            coordinator=coordinator,
            views=_handlers(),
            data=types.SimpleNamespace(widget_secret_store=secrets, coordinator=coordinator),
        )


def _call(env, signer: str, payload: dict) -> _Response:
    ctx = types.SimpleNamespace(
        domain_data=env.data,
        payload=payload,
        watch_id=signer,
        signed_json=lambda body, status=200: _Response(status, body),
    )
    return asyncio.run(env.views["_op_move_finished"](ctx))


def test_the_owner_ends_the_wait_and_wakes_the_watch(env) -> None:
    env.coordinator.polling.add("w1")
    assert env.secrets.may_await_move("w1") is True

    reply = _call(env, "p1", {"watch_id": "w1"})

    assert reply.status == 200
    assert reply.body == {"ok": True, "watch_id": "w1", "changed": True, "polling": True}
    assert env.secrets.may_await_move("w1") is False
    assert env.coordinator.woken == ["w1"]
    # It writes no other field: push tokens and ownership read that one.
    assert env.secrets.get("w1").owner_iphone_id == "p1"
    assert env.secrets.get("w1").move_wait_ended is False


def test_the_owner_also_ends_the_wait_of_its_other_watches(env) -> None:
    """The iPhone holds one watch's pair per home, so it can never move for the
    other watch, which would wait out the grace on a finished phone."""
    env.secrets.register(
        "w2", SECRET_B, env.mod.LABEL_WATCH_SELF_PROVISION, owner_iphone_id="p1", user_id="u1"
    )
    env.secrets.register(
        "w3", SECRET_B, env.mod.LABEL_WATCH_SELF_PROVISION, owner_iphone_id="p2", user_id="u1"
    )
    env.log.clear()
    assert env.secrets.may_await_move("w2") is True

    reply = _call(env, "p1", {"watch_id": "w1"})

    assert reply.body == {"ok": True, "watch_id": "w1", "changed": True, "polling": False}
    assert env.secrets.may_await_move("w1") is False
    assert env.secrets.may_await_move("w2") is False
    assert env.disk.data["secrets"]["w2"]["move_finished"] is True
    assert sorted(env.coordinator.woken) == ["w1", "w2"]
    assert env.log.count("save") == 1
    # Another iPhone's watch is not this iPhone's to end.
    assert env.secrets.may_await_move("w3") is True
    assert env.secrets.get("w3").move_finished is False


def test_another_iphone_cannot_end_the_wait_of_any_watch(env) -> None:
    env.secrets.register(
        "w2", SECRET_B, env.mod.LABEL_WATCH_SELF_PROVISION, owner_iphone_id="p1", user_id="u1"
    )
    reply = _call(env, "p2", {"watch_id": "w1"})
    assert reply.status == 403
    assert env.secrets.may_await_move("w1") is True
    assert env.secrets.may_await_move("w2") is True
    assert env.coordinator.woken == []


def test_a_retry_still_ends_the_wait_of_a_watch_paired_since(env) -> None:
    _call(env, "p1", {"watch_id": "w1"})
    env.secrets.register(
        "w2", SECRET_B, env.mod.LABEL_WATCH_SELF_PROVISION, owner_iphone_id="p1", user_id="u1"
    )
    env.coordinator.woken.clear()

    reply = _call(env, "p1", {"watch_id": "w1"})

    assert reply.body["changed"] is False, "the reply speaks only of the named watch"
    assert env.secrets.may_await_move("w2") is False
    assert env.coordinator.woken == ["w2"]


def test_it_is_on_disk_before_the_reply(env) -> None:
    reply = _call(env, "p1", {"watch_id": "w1"})
    assert reply.status == 200
    assert env.log[-1] == "save"
    assert env.disk.data["secrets"]["w1"]["move_finished"] is True


def test_it_survives_a_restart(env) -> None:
    _call(env, "p1", {"watch_id": "w1"})

    again = env.mod.WidgetSecretStore(object())
    again._store = env.disk
    asyncio.run(again.async_load())

    assert again.get("w1").move_finished is True
    assert again.may_await_move("w1") is False


def test_a_retry_changes_nothing_and_wakes_nothing(env) -> None:
    _call(env, "p1", {"watch_id": "w1"})
    env.log.clear()
    env.coordinator.woken.clear()

    reply = _call(env, "p1", {"watch_id": "w1"})

    assert reply.status == 200
    assert reply.body["ok"] is True and reply.body["changed"] is False
    assert env.log == []
    assert env.coordinator.woken == []


@pytest.mark.parametrize("watch_id", ["w-code", "missing", "p2"])
def test_an_iphone_that_does_not_own_the_id_is_refused(env, watch_id) -> None:
    reply = _call(env, "p1", {"watch_id": watch_id})
    assert reply.status == 403
    assert reply.body["ok"] is False and reply.body["error"] == "not_owner"
    assert env.coordinator.woken == []
    assert env.log == []


def test_another_iphone_of_the_same_user_is_refused(env) -> None:
    reply = _call(env, "p2", {"watch_id": "w1"})
    assert reply.status == 403
    assert reply.body["error"] == "not_owner"
    assert env.secrets.may_await_move("w1") is True
    assert env.coordinator.woken == []


def test_a_watch_is_refused_even_for_itself(env) -> None:
    reply = _call(env, "w1", {"watch_id": "w1"})
    assert reply.status == 403
    assert reply.body["error"] == "not_an_iphone"
    assert env.secrets.may_await_move("w1") is True


@pytest.mark.parametrize("payload", [{}, {"watch_id": ""}, {"watch_id": 7}, {"watch_id": None}])
def test_a_body_with_no_usable_id_is_refused(env, payload) -> None:
    reply = _call(env, "p1", payload)
    assert reply.status == 400
    assert reply.body["error"] == "invalid_watch"


def test_the_finish_keeps_with_the_same_iphone_and_goes_with_another(env) -> None:
    mod = env.mod
    env.secrets.finish_move("w1", "p1")
    env.secrets.register(
        "w1", SECRET_A, mod.LABEL_WATCH_SELF_PROVISION, owner_iphone_id="p1", user_id="u1"
    )
    assert env.secrets.get("w1").move_finished is True
    # Another iPhone holds a key that has not been retired.
    env.secrets.register(
        "w1", SECRET_B, mod.LABEL_WATCH_SELF_PROVISION, owner_iphone_id="p2", user_id="u1"
    )
    assert env.secrets.get("w1").move_finished is False
    assert env.secrets.may_await_move("w1") is True


def test_an_iphone_with_no_op_keeps_the_wait(env) -> None:
    """A phone on 3.0.1 never sends this, so it can still move. Polling as
    itself or time short of the grace ends nothing here either."""
    mod = env.mod
    entries = env.secrets.all_entries
    now = datetime(2026, 11, 4, tzinfo=UTC)
    assert mod.watch_move_may_still_come(entries, "w1", now + timedelta(days=3650)) is True
    env.secrets.note_phone_pages("p1")
    assert env.secrets.get("w1").move_finished is False
    assert env.secrets.may_await_move("w1") is True


def test_seed_pending_lasts_from_the_end_of_the_wait_to_the_watch_s_next_poll(env) -> None:
    secrets = env.secrets
    assert secrets.seed_pending("w1") is False
    # Still waiting, so a poll hears nothing.
    assert secrets.note_move_end_heard("w1") is False
    secrets.finish_move("w1", "p1")
    assert secrets.seed_pending("w1") is True
    assert secrets.note_move_end_heard("w1") is True
    assert secrets.seed_pending("w1") is False
    assert secrets.note_move_end_heard("w1") is False
    assert secrets._serialize()["secrets"]["w1"]["move_end_heard"] is True


def test_seed_pending_is_for_a_watch_from_before_the_move(env) -> None:
    secrets = env.secrets
    # A watch a code first paired has nothing else to send.
    assert secrets.seed_pending("w-code") is False
    assert secrets.note_move_end_heard("w-code") is False
    assert secrets.seed_pending("p1") is False
    assert secrets.note_move_end_heard("p1") is False
    assert secrets.seed_pending("missing") is False
    # A person ending the wait counts the same.
    secrets.end_move_wait("w1")
    assert secrets.seed_pending("w1") is True


def test_seed_may_land_for_ten_minutes_after_the_first_poll(env) -> None:
    secrets = env.secrets
    assert secrets.seed_may_land("w1") is False
    # Still waiting, so a poll starts nothing.
    secrets.note_move_end_heard("w1")
    assert secrets.seed_may_land("w1") is False
    assert secrets.get("w1").move_end_heard_at is None

    secrets.finish_move("w1", "p1")
    # The wait is over, but the watch has not polled: that is seed_pending.
    assert secrets.seed_may_land("w1") is False
    assert secrets.note_move_end_heard("w1") is True
    assert secrets.seed_may_land("w1") is True

    entry = secrets.get("w1")
    first = entry.move_end_heard_at
    # A later poll is not the first, so it does not start them again.
    assert secrets.note_move_end_heard("w1") is False
    assert entry.move_end_heard_at == first

    entry.move_end_heard_at = first - env.mod.SEED_LANDING_WINDOW + timedelta(seconds=30)
    assert secrets.seed_may_land("w1") is True
    entry.move_end_heard_at = first - env.mod.SEED_LANDING_WINDOW - timedelta(seconds=1)
    assert secrets.seed_may_land("w1") is False
    assert secrets.note_move_end_heard("w1") is False
    assert secrets.seed_may_land("w1") is False


def test_a_too_old_watch_s_poll_does_not_start_the_ten_minutes(env) -> None:
    """A 3.0.1 watch cannot seed. If its poll started the window, the window
    could run out before its later update, and the panel would then say flatly
    that the watch holds nothing."""
    secrets = env.secrets
    secrets.finish_move("w1", "p1")
    secrets.get("w1").app_version = "3.0.1"
    assert secrets.note_move_end_heard("w1") is False
    assert secrets.get("w1").move_end_heard is False
    assert secrets.get("w1").move_end_heard_at is None
    assert secrets.seed_may_land("w1") is False
    # A watch that never updates has nothing on its way, so nothing asks.
    assert secrets.seed_pending("w1") is False

    # The update reports first, which brings its chance back, and the next poll
    # starts them.
    secrets.update_metadata("w1", app_version="3.2.0")
    assert secrets.seed_pending("w1") is True
    assert secrets.note_move_end_heard("w1") is True
    assert secrets.seed_may_land("w1") is True
    assert secrets.seed_pending("w1") is False


@pytest.mark.parametrize(
    ("version", "too_old"),
    [
        ("3.0.1", True),
        ("v3.0.1", True),
        ("2.8", True),
        (" 3.0.1 (3)", True),
        ("3.1.0", False),
        ("3.1", False),
        ("3.2.0", False),
        ("4.0.0-beta", False),
        (None, False),
        ("", False),
        ("not a version", False),
    ],
)
def test_too_old_to_seed_reads_a_version_as_the_panel_does(env, version, too_old) -> None:
    assert env.mod.MIN_VERSION_TO_SEED == (3, 1, 0)
    panel = (_MODULE.parents[2] / "frontend" / "src" / "version.ts").read_text()
    assert 'MIN_VERSION_FOR_SETUP_MOVE = "3.1.0"' in panel
    assert env.mod.too_old_to_seed(version) is too_old


def test_the_stored_metadata_says_what_a_device_last_reported(env) -> None:
    secrets = env.secrets
    assert secrets.stored_metadata("missing") is None
    # A watch that has not said gets null, and what it says comes back.
    secrets.get("w1").app_version = None
    assert secrets.stored_metadata("w1") == {"app_version": "", "standard_settings": None}
    secrets.update_metadata("w1", app_version="3.2.0", standard_settings=False)
    assert secrets.stored_metadata("w1") == {"app_version": "3.2.0", "standard_settings": False}
    # An iPhone has no settings to report here.
    secrets.update_metadata("p1", app_version="3.2.0")
    assert secrets.stored_metadata("p1") == {"app_version": "3.2.0"}


def test_a_watch_s_word_on_its_settings_outlives_a_restart_and_a_new_key(env) -> None:
    secrets = env.secrets
    assert secrets.get("w1").standard_settings is None
    secrets.update_metadata("w1", standard_settings=False)
    saved = secrets._serialize()
    assert saved["secrets"]["w1"]["standard_settings"] is False

    env.disk.data = saved
    again = env.mod.WidgetSecretStore(object())
    again._store = env.disk
    asyncio.run(again.async_load())
    assert again.get("w1").standard_settings is False

    again.register(
        "w1", SECRET_B, env.mod.LABEL_WATCH_CODE_PAIR, owner_iphone_id="p1", user_id="u1"
    )
    assert again.get("w1").standard_settings is False
    # A forget drops it: the watch has to say it again, and until then a new
    # pair has not said.
    again.remove("w1")
    again.register("w1", SECRET_B, env.mod.LABEL_WATCH_CODE_PAIR, user_id="u1")
    assert again.get("w1").standard_settings is None


def test_seed_may_land_is_for_a_watch_from_before_the_move(env) -> None:
    secrets = env.secrets
    for watch_id in ("w-code", "p1", "missing"):
        assert secrets.note_move_end_heard(watch_id) is False
        assert secrets.seed_may_land(watch_id) is False


def test_the_first_poll_s_time_survives_a_restart(env) -> None:
    secrets = env.secrets
    secrets.finish_move("w1", "p1")
    secrets.note_move_end_heard("w1")
    first = secrets.get("w1").move_end_heard_at
    env.disk.data = secrets._serialize()
    assert env.disk.data["secrets"]["w1"]["move_end_heard_at"] == first.isoformat()

    env.mod.dt_util.parse_datetime = datetime.fromisoformat
    again = env.mod.WidgetSecretStore(object())
    again._store = env.disk
    asyncio.run(again.async_load())

    assert again.get("w1").move_end_heard_at == first
    assert again.seed_may_land("w1") is True
    # A restart does not start the ten minutes again, as the poll is not new.
    again.get("w1").move_end_heard_at = first - env.mod.SEED_LANDING_WINDOW - timedelta(seconds=1)
    assert again.note_move_end_heard("w1") is False
    assert again.seed_may_land("w1") is False


def test_a_watch_that_polled_before_the_time_was_kept_has_no_ten_minutes(env) -> None:
    secrets = env.secrets
    secrets.finish_move("w1", "p1")
    secrets.note_move_end_heard("w1")
    saved = secrets._serialize()
    del saved["secrets"]["w1"]["move_end_heard_at"]
    env.disk.data = saved

    again = env.mod.WidgetSecretStore(object())
    again._store = env.disk
    asyncio.run(again.async_load())

    assert again.get("w1").move_end_heard is True
    assert again.get("w1").move_end_heard_at is None
    assert again.seed_may_land("w1") is False
    assert again.seed_pending("w1") is False


def test_the_first_poll_s_time_keeps_with_the_same_iphone_and_goes_with_another(env) -> None:
    secrets = env.secrets
    mod = env.mod
    secrets.finish_move("w1", "p1")
    secrets.note_move_end_heard("w1")
    first = secrets.get("w1").move_end_heard_at

    secrets.register("w1", SECRET_A, mod.LABEL_WATCH_SELF_PROVISION, owner_iphone_id="p1", user_id="u1")
    assert secrets.get("w1").move_end_heard_at == first

    secrets.register("w1", SECRET_B, mod.LABEL_WATCH_SELF_PROVISION, owner_iphone_id="p2", user_id="u1")
    assert secrets.get("w1").move_end_heard is False
    assert secrets.get("w1").move_end_heard_at is None
    assert secrets.seed_may_land("w1") is False


def test_seed_may_land_ends_only_a_question_and_not_the_wait(env) -> None:
    secrets = env.secrets
    entry = secrets.get("w1")
    # A wait that lasts is not touched by a time, however old.
    entry.move_end_heard_at = datetime(2020, 1, 1, tzinfo=UTC)
    assert secrets.may_await_move("w1") is True
    assert secrets.seed_may_land("w1") is False


def test_another_iphone_of_the_user_moving_ends_nothing(env) -> None:
    secrets = env.secrets
    assert secrets.another_iphone_moves("w1") is False
    secrets.note_phone_pages("p2")
    assert secrets.another_iphone_moves("w1") is True
    assert secrets.owner_iphone_moves("w1") is False
    assert secrets.may_await_move("w1") is True
    # Who may end the wait has not changed.
    assert secrets.finish_move("w1", "p2") is None
    assert secrets.get("w1").move_finished is False
    # Its own iPhone moving is the other field's to say.
    secrets.note_phone_pages("p1")
    assert secrets.owner_iphone_moves("w1") is True
    # A watch with no owner, an iPhone and an unknown id say nothing.
    assert secrets.another_iphone_moves("w-code") is False
    assert secrets.another_iphone_moves("p1") is False
    assert secrets.another_iphone_moves("missing") is False


def test_a_write_before_a_reply_never_raises_and_is_tried_again(env, monkeypatch) -> None:
    secrets = env.secrets

    async def boom(_data: Any) -> None:
        raise OSError("disk full")

    monkeypatch.setattr(env.disk, "async_save", boom)
    env.log.clear()
    asyncio.run(secrets.async_save_before_reply())
    assert env.log == ["delay"]

    async def slow(_data: Any) -> None:
        await asyncio.sleep(30)

    monkeypatch.setattr(env.disk, "async_save", slow)
    monkeypatch.setitem(type(secrets).async_save_before_reply.__globals__, "_SAVE_BEFORE_REPLY_SECONDS", 0.01)
    env.log.clear()
    asyncio.run(secrets.async_save_before_reply())
    assert env.log == ["delay"]


def test_an_old_watch_stays_old_when_paired_again_by_code_or_its_iphone_goes(env) -> None:
    mod = env.mod
    secrets = env.secrets
    assert secrets.get("w1").holds_old_setup is True
    assert secrets.get("w-code").holds_old_setup is False
    assert secrets.get("p1").holds_old_setup is False

    secrets.register("w1", SECRET_A, mod.LABEL_WATCH_CODE_PAIR, user_id="u1")
    assert secrets.get("w1").holds_old_setup is True
    assert secrets._serialize()["secrets"]["w1"]["old_link_setup"] is True

    secrets.register("w2", SECRET_B, mod.LABEL_WATCH_SELF_PROVISION, owner_iphone_id="p2", user_id="u1")
    secrets.remove("p2")
    assert secrets.get("w2").owner_iphone_id is None
    assert secrets.get("w2").holds_old_setup is True


def test_a_saved_file_of_a_watch_that_said_nothing_stays_the_same(env) -> None:
    saved = env.secrets._serialize()["secrets"]["w1"]
    for key in ("move_finished", "move_end_heard", "old_link_setup", "standard_settings"):
        assert key not in saved


def test_the_watch_says_it_runs_only_the_standard_settings(env) -> None:
    secrets = env.secrets
    assert secrets.update_metadata("w1", standard_settings=True) is True
    assert secrets.get("w1").standard_settings is True
    # None leaves it, and it can take it back.
    secrets.update_metadata("w1", app_version="3.2.0")
    assert secrets.get("w1").standard_settings is True
    secrets.update_metadata("w1", standard_settings=False)
    assert secrets.get("w1").standard_settings is False


def test_the_op_and_the_capability_are_wired() -> None:
    views = _MODULE.read_text()
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    assert '"move_finished": _op_move_finished,' in views
    assert "register_capability(MOVE_FINISHED_CAPABILITY)" in init
    assert 'MOVE_FINISHED_CAPABILITY = "move_finished"' in const
    # The poll is what tells the store the watch heard.
    assert "note_move_end_heard(watch_id)" in views
