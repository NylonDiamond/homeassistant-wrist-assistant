"""Pure-unit tests for the phone push behind a complication save.

``complication_push.py`` keeps its Home Assistant imports under TYPE_CHECKING,
so the only live dependency it has is the widget secret store's ``device_kind``
constants. It is loaded here the way ``test_complication_ws.py`` loads the
WebSocket module: stub the Home Assistant modules, then load the real files
into a throwaway package so the relative imports resolve.

The clock is fake on purpose. Every rule this module has is about time (two
seconds of debounce, thirty of floor), and a test that proved them with real
sleeps would take a minute to run and still be flaky. ``_Loop`` is the whole
trick: ``time()`` is a number the test moves, ``call_later`` is a list, and
``advance`` fires what is due.

What they guard:
- A burst of saves costs one push, and a second push waits out the floor.
- Refresh now ignores both timers.
- A watch owner is never pushed; it has a long-poll that is faster and free.
- A phone with no token anywhere sends nothing and reports itself unavailable.
- The token filed under the paired watch is found, and the push goes out under
  the *watch's* id, because that is where ``send_push`` writes the refreshed
  relay token back.
- The pushed payload carries the store token as it stands when the push is
  sent, not as it stood when the save scheduled it.
"""

from __future__ import annotations

import base64
import contextlib
import importlib.util
import sys
import types
from dataclasses import dataclass, field
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import pytest

_SRC = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_PKG = "wa_push_test_pkg"

DEBOUNCE = 0.5
FLOOR = 30.0


class _FakeStore:
    """Stand-in for homeassistant.helpers.storage.Store, per instance."""

    def __init__(self, *args: object, **kwargs: object) -> None:
        self._saved: dict | None = None

    async def async_load(self):
        return self._saved

    def async_delay_save(self, serialize, *_args: object, **_kwargs: object) -> None:
        self._saved = serialize()

    async def async_remove(self) -> None:
        self._saved = None


def _stub(name: str, **attrs: object) -> types.ModuleType:
    module = sys.modules.get(name) or types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module
    parent, _, leaf = name.rpartition(".")
    if parent and parent in sys.modules:
        setattr(sys.modules[parent], leaf, module)
    return module


def _load(name: str):
    spec = importlib.util.spec_from_file_location(f"{_PKG}.{name}", _SRC / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[f"{_PKG}.{name}"] = module
    spec.loader.exec_module(module)
    return module


@contextlib.contextmanager
def _loaded_modules():
    saved_modules = dict(sys.modules)
    try:
        _stub("homeassistant")
        _stub("homeassistant.core", HomeAssistant=type("HomeAssistant", (), {}))
        _stub("homeassistant.helpers")
        _stub("homeassistant.helpers.storage", Store=_FakeStore)
        _stub("homeassistant.util")
        _stub(
            "homeassistant.util.dt",
            parse_datetime=lambda value: None,
            utcnow=lambda: datetime.now(UTC),
        )

        pkg = types.ModuleType(_PKG)
        pkg.__path__ = []
        sys.modules[_PKG] = pkg
        _stub(
            f"{_PKG}.const",
            WIDGET_SECRET_STORAGE_KEY="wrist_assistant.widget_secrets",
            WIDGET_SECRET_STORAGE_VERSION=1,
        )
        secrets_mod = _load("widget_secret_store")
        yield _load("complication_push"), secrets_mod
    finally:
        for key in list(sys.modules):
            if key not in saved_modules:
                del sys.modules[key]
        sys.modules.update(saved_modules)


# ── fakes ────────────────────────────────────────────────────────────────


@dataclass
class _Handle:
    """What ``call_later`` hands back: something with ``cancel``."""

    due: float
    callback: Any
    args: tuple
    cancelled: bool = False

    def cancel(self) -> None:
        self.cancelled = True


class _Loop:
    """A clock the test moves by hand, plus the timers parked on it."""

    def __init__(self) -> None:
        self.now = 1000.0
        self.handles: list[_Handle] = []

    def time(self) -> float:
        return self.now

    def call_later(self, delay: float, callback, *args) -> _Handle:
        handle = _Handle(due=self.now + delay, callback=callback, args=args)
        self.handles.append(handle)
        return handle

    def advance(self, seconds: float) -> None:
        """Move to now + seconds, firing every timer due on the way."""
        target = self.now + seconds
        while True:
            due = sorted(
                (h for h in self.handles if not h.cancelled and h.due <= target),
                key=lambda h: h.due,
            )
            if not due:
                break
            handle = due[0]
            self.handles.remove(handle)
            self.now = max(self.now, handle.due)
            handle.callback(*handle.args)
        self.now = target


class _Hass:
    def __init__(self) -> None:
        self.loop = _Loop()

    def async_create_task(self, coro) -> None:
        """Run the send to completion inline.

        Everything it awaits is the fake relay client, which never suspends,
        so one ``send`` finishes it. A coroutine that did suspend would say so
        here rather than quietly never running.
        """
        try:
            coro.send(None)
        except StopIteration:
            return
        raise AssertionError("the push awaited something this fake cannot drive")


@dataclass
class _TokenEntry:
    device_token: str
    platform: str = "ios"
    environment: str = "production"
    relay_token: str | None = "rt"


class _NotificationStore:
    """Only the one read ``complication_push`` makes: (id, platform)."""

    def __init__(self) -> None:
        self.entries: dict[tuple[str, str], _TokenEntry] = {}

    def register(self, device_id: str, platform: str, token: str) -> None:
        self.entries[(device_id, platform)] = _TokenEntry(
            device_token=token, platform=platform
        )

    def get_entry(self, device_id: str, platform: str | None = None):
        return self.entries.get((device_id, platform))


class _ComplicationStore:
    """Just the owner token; the real store's writes are tested elsewhere."""

    def __init__(self) -> None:
        self.tokens: dict[str, int] = {}

    def owner_token(self, owner_id: str) -> int:
        return self.tokens.get(owner_id, 0)


class _APNsClient:
    """Records every send and answers however the test told it to."""

    def __init__(self, ok: bool = True) -> None:
        self.ok = ok
        self.sends: list[dict] = []

    async def send_push(self, **kwargs):
        self.sends.append(kwargs)
        return (self.ok, None if self.ok else "BadDeviceToken", "production")


@dataclass
class _Env:
    push_mod: Any
    secrets_mod: Any
    hass: _Hass
    secrets: Any
    tokens: _NotificationStore
    store: _ComplicationStore
    client: _APNsClient
    push: Any
    _secret: str = field(default=base64.b64encode(b"k" * 32).decode("ascii"))

    @property
    def loop(self) -> _Loop:
        return self.hass.loop

    @property
    def sends(self) -> list[dict]:
        return self.client.sends

    def add_phone(self, device_id: str) -> None:
        self.secrets.register(
            device_id, self._secret, self.secrets_mod.LABEL_IPHONE_SELF_PROVISION
        )

    def add_watch(self, device_id: str, owner_iphone_id: str | None = None) -> None:
        self.secrets.register(
            device_id,
            self._secret,
            self.secrets_mod.LABEL_WATCH_SELF_PROVISION,
            owner_iphone_id=owner_iphone_id,
        )

    def save(self, owner_id: str) -> None:
        """What one commit looks like from the store's side."""
        self.store.tokens[owner_id] = self.store.owner_token(owner_id) + 1
        self.push.on_commit(owner_id, self.store.owner_token(owner_id))


def _build(client: _APNsClient | None = None):
    with _loaded_modules() as (push_mod, secrets_mod):
        hass = _Hass()
        secrets = secrets_mod.WidgetSecretStore(object())
        tokens = _NotificationStore()
        store = _ComplicationStore()
        apns = client if client is not None else _APNsClient()
        push = push_mod.ComplicationPhonePush(
            hass,
            notification_store=tokens,
            widget_secret_store=secrets,
            apns_client=apns,
            complication_store=store,
        )
        yield _Env(push_mod, secrets_mod, hass, secrets, tokens, store, apns, push)


@pytest.fixture
def env():
    yield from _build()


@pytest.fixture
def phone(env):
    """One phone whose token is filed under its own id."""
    env.add_phone("phone-1")
    env.tokens.register("phone-1", "ios", "ios-tok")
    return env


# ── debounce and floor ───────────────────────────────────────────────────


def test_three_saves_inside_the_debounce_send_one_push(phone) -> None:
    phone.save("phone-1")
    phone.loop.advance(DEBOUNCE / 2)
    phone.save("phone-1")
    phone.loop.advance(DEBOUNCE / 2)
    phone.save("phone-1")
    assert phone.sends == []

    phone.loop.advance(DEBOUNCE)
    assert len(phone.sends) == 1
    # The third save's token, not the first: the burst collapsed into the push
    # the phone will actually be able to pull.
    assert phone.sends[0]["data"]["wa_complications"]["token"] == 3
    assert phone.sends[0]["data"]["wa_complications"]["reason"] == "save"


def test_a_second_push_waits_out_the_thirty_second_floor(phone) -> None:
    phone.save("phone-1")
    phone.loop.advance(DEBOUNCE)
    assert len(phone.sends) == 1

    phone.loop.advance(1.0)
    phone.save("phone-1")
    # The debounce alone would have sent it moments after the save.
    phone.loop.advance(DEBOUNCE + 1.0)
    assert len(phone.sends) == 1

    # The floor ends 30 s after the first push, and the save that arrived
    # inside it is sent then rather than dropped.
    phone.loop.advance(FLOOR)
    assert len(phone.sends) == 2
    assert phone.sends[1]["data"]["wa_complications"]["token"] == 2


def test_the_push_carries_the_token_as_it_stands_when_it_is_sent(phone) -> None:
    """The store keeps moving while a push is parked on a timer.

    A push that carried the token from its own commit would tell the phone to
    expect a revision that is already two behind, and the panel's chip would
    never go green, because the ack it waits for names the current token.
    """
    phone.save("phone-1")
    phone.loop.advance(DEBOUNCE / 2)
    # A commit the debounce swallows, e.g. the delete half of a slot move.
    phone.store.tokens["phone-1"] = 9
    phone.loop.advance(DEBOUNCE)

    assert phone.sends[0]["data"]["wa_complications"]["token"] == 9


def test_refresh_now_bypasses_both_timers(phone) -> None:
    phone.save("phone-1")
    phone.loop.advance(DEBOUNCE)
    assert len(phone.sends) == 1

    # Inside the floor, and with no wait at all.
    assert phone.push.push_now("phone-1", "refresh") is True
    assert len(phone.sends) == 2
    assert phone.sends[1]["data"]["wa_complications"]["reason"] == "refresh"

    # It also takes over a scheduled push rather than sending twice.
    phone.save("phone-1")
    assert phone.push.push_now("phone-1", "refresh") is True
    phone.loop.advance(FLOOR * 2)
    assert len(phone.sends) == 3


def test_seconds_since_push_counts_from_the_last_attempt(phone) -> None:
    assert phone.push.seconds_since_push("phone-1") is None
    phone.push.push_now("phone-1", "refresh")
    assert phone.push.seconds_since_push("phone-1") == 0
    phone.loop.advance(45.0)
    assert phone.push.seconds_since_push("phone-1") == 45


# ── who gets a push ──────────────────────────────────────────────────────


def test_a_watch_owner_is_never_pushed(env) -> None:
    """It holds a long-poll, which is faster and costs no push budget."""
    env.add_watch("watch-A", owner_iphone_id="phone-1")
    env.tokens.register("watch-A", "watchos", "watch-tok")
    env.tokens.register("watch-A", "ios", "ios-tok")

    assert env.push.push_available("watch-A") is False
    env.save("watch-A")
    env.loop.advance(FLOOR * 2)
    assert env.sends == []
    assert env.push.push_now("watch-A", "refresh") is False
    assert env.sends == []


def test_a_phone_with_no_token_anywhere_sends_nothing(env) -> None:
    env.add_phone("phone-1")
    env.add_watch("watch-A", owner_iphone_id="phone-1")
    # The watch has registered, but only its own token: the phone has never
    # been opened, so nothing holds an ios token for this pair.
    env.tokens.register("watch-A", "watchos", "watch-tok")

    assert env.push.push_available("phone-1") is False
    env.save("phone-1")
    env.loop.advance(FLOOR * 2)
    assert env.sends == []
    assert env.push.push_now("phone-1", "refresh") is False
    assert env.push.seconds_since_push("phone-1") is None


def test_an_unknown_owner_is_not_pushed(env) -> None:
    """An orphan row has no secret entry left to say what kind of device it was."""
    assert env.push.push_available("gone-watch") is False
    env.save("gone-watch")
    env.loop.advance(FLOOR * 2)
    assert env.sends == []


def test_the_token_under_the_paired_watch_is_found_and_used(env) -> None:
    """The normal pairing: the phone files its token under its watch's id.

    ``send_push`` writes the refreshed relay token back under the id it is
    given, so the push has to go out under the watch's id. Sending it under
    the phone's would orphan the binding and re-register on every push.
    """
    env.add_phone("phone-1")
    env.add_watch("watch-A", owner_iphone_id="phone-1")
    env.add_watch("watch-B", owner_iphone_id="other-phone")
    env.tokens.register("watch-A", "ios", "ios-tok")
    env.tokens.register("watch-B", "ios", "other-tok")

    assert env.push.push_available("phone-1") is True
    env.save("phone-1")
    env.loop.advance(DEBOUNCE)

    assert len(env.sends) == 1
    sent = env.sends[0]
    assert sent["watch_id"] == "watch-A"
    assert sent["device_token"] == "ios-tok"
    assert sent["platform"] == "ios"
    assert sent["push_type"] == "background"
    assert sent["category"] == "wa_complications"
    assert sent["sound"] is None
    assert sent["environment"] == "production"
    assert sent["data"] == {"wa_complications": {"token": 1, "reason": "save"}}


def test_the_phones_own_entry_wins_over_the_reverse_scan(env) -> None:
    """A scoped secondary instance with no watch files the token itself."""
    env.add_phone("phone-1")
    env.add_watch("watch-A", owner_iphone_id="phone-1")
    env.tokens.register("watch-A", "ios", "watch-filed-tok")
    env.tokens.register("phone-1", "ios", "own-tok")

    env.push.push_now("phone-1", "refresh")
    assert env.sends[0]["watch_id"] == "phone-1"
    assert env.sends[0]["device_token"] == "own-tok"


# ── failure is never the save's problem ──────────────────────────────────


def test_a_refused_push_does_not_raise_and_still_holds_the_floor() -> None:
    for env in _build(_APNsClient(ok=False)):
        env.add_phone("phone-1")
        env.tokens.register("phone-1", "ios", "ios-tok")
        env.save("phone-1")
        env.loop.advance(DEBOUNCE)
        assert len(env.sends) == 1
        assert env.push.seconds_since_push("phone-1") == 0


def test_teardown_cancels_a_parked_timer_and_nothing_is_sent_after_it(phone) -> None:
    """Unload and HA stop both call it, and a reload builds a fresh instance.

    A timer that outlived the entry would fire against a relay client and a
    store that are already gone, and send the phone a token the reloaded store
    may not have reached.
    """
    phone.save("phone-1")
    phone.push.shutdown()

    phone.loop.advance(FLOOR * 2)
    assert phone.sends == []
    assert phone.push.seconds_since_push("phone-1") is None

    # Idempotent, and the object still works if something does reach it: a
    # second shutdown is what a stop straight after an unload looks like.
    phone.push.shutdown()
    assert phone.push.push_now("phone-1", "refresh") is True
    assert len(phone.sends) == 1


def test_a_commit_hook_that_cannot_schedule_never_raises_into_the_save(phone) -> None:
    """The hook runs inside the save the panel is waiting on.

    A phone that cannot be reached is not a reason to fail a save that is
    already written, so anything that goes wrong in here is a log line.
    """

    def _explode(*_args, **_kwargs):
        raise RuntimeError("no timers today")

    phone.loop.call_later = _explode
    phone.save("phone-1")
    assert phone.sends == []
