"""The pending pairing store and the shared pairing field checks, with no
Home Assistant.

``wa_pair_requests.py`` needs only two names from the integration, so it is
loaded under small stubs. The store is driven with an explicit clock and a
scripted code generator; the checks are the ones ``register_secret``,
``pair/start`` and the panel's confirm all share, so their error texts are
pinned here once.
"""

from __future__ import annotations

import base64
import contextlib
import importlib.util
import sys
import types
from pathlib import Path

import pytest

_PKG = "custom_components.wrist_assistant"
_SRC = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"

SECRET = base64.b64encode(b"s" * 32).decode()


def _stub(name: str, **attrs: object) -> types.ModuleType:
    module = sys.modules.get(name) or types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module
    return module


@contextlib.contextmanager
def loaded_pair_module():
    """``wa_pair_requests`` under stubs; usable inside other stubbed loads."""
    saved_modules = dict(sys.modules)
    try:
        if _PKG not in sys.modules:
            pkg = types.ModuleType(_PKG)
            pkg.__path__ = []
            sys.modules[_PKG] = pkg
        _stub(f"{_PKG}.const", LIBRARY_OWNER_ID="library")
        _stub(
            f"{_PKG}.widget_hmac",
            DEFAULT_HMAC_ALGO="hmac-sha256",
            SUPPORTED_HMAC_ALGOS=frozenset({"hmac-sha256"}),
        )
        name = f"{_PKG}.wa_pair_requests"
        spec = importlib.util.spec_from_file_location(name, _SRC / "wa_pair_requests.py")
        module = importlib.util.module_from_spec(spec)
        sys.modules[name] = module
        spec.loader.exec_module(module)
        yield module
    finally:
        for key in list(sys.modules):
            if key not in saved_modules:
                del sys.modules[key]
        sys.modules.update(saved_modules)


@pytest.fixture
def mod():
    with loaded_pair_module() as module:
        yield module


class _Clock:
    def __init__(self, start: float = 1_000.0) -> None:
        self.now = start

    def __call__(self) -> float:
        return self.now


def _fields(mod, watch_id: str = "watch-1", **extra):
    fields, error = mod.validate_pair_fields({"watch_id": watch_id, "secret_b64": SECRET, **extra})
    assert error is None, error
    return fields


def _codes(*codes: str):
    """A code generator that hands out the given codes in order."""
    queue = list(codes)
    return lambda: queue.pop(0)


# ── the code ─────────────────────────────────────────────────────────────


def test_a_fresh_code_is_six_characters_of_the_alphabet(mod) -> None:
    for _ in range(50):
        code = mod.new_pair_code()
        assert len(code) == 6
        assert set(code) <= set("ABCDEFGHJKLMNPQRSTUVWXYZ23456789")


def test_codes_are_compared_trimmed_and_upper_cased(mod) -> None:
    store = mod.PairRequestStore(clock=_Clock(), code_factory=_codes("ABC234"))
    pending = store.start(_fields(mod))
    assert pending.code == "ABC234"
    assert store.get("  abc234 \n") is pending
    assert store.remove(" abc234") is True
    assert store.get("ABC234") is None


@pytest.mark.parametrize(
    "typed", ["ABC234", " abc234 ", "abc-234", "ABC 234", "a b-c\t2-3 4\n", "--abc234--"]
)
def test_spaces_and_hyphens_are_dropped_from_a_typed_code(mod, typed) -> None:
    assert mod.normalize_pair_code(typed) == "ABC234"
    store = mod.PairRequestStore(clock=_Clock(), code_factory=_codes("ABC234"))
    pending = store.start(_fields(mod))
    assert store.get(typed) is pending


# ── TTL ──────────────────────────────────────────────────────────────────


def test_a_request_lasts_ten_minutes(mod) -> None:
    clock = _Clock()
    store = mod.PairRequestStore(clock=clock, code_factory=_codes("AAAAAA"))
    pending = store.start(_fields(mod))
    assert store.expires_in(pending) == 600

    clock.now += 599.5
    assert store.get("AAAAAA") is pending
    assert store.expires_in(pending) == 1

    clock.now += 0.5
    assert store.get("AAAAAA") is None
    assert len(store) == 0


def test_expires_in_never_goes_negative(mod) -> None:
    clock = _Clock()
    store = mod.PairRequestStore(clock=clock, code_factory=_codes("AAAAAA"))
    pending = store.start(_fields(mod))
    assert store.expires_in(pending, now=clock.now + 10_000) == 0


# ── one request per watch ────────────────────────────────────────────────


def test_a_new_start_replaces_the_watch_s_earlier_request(mod) -> None:
    store = mod.PairRequestStore(clock=_Clock(), code_factory=_codes("AAAAAA", "BBBBBB", "CCCCCC"))
    store.start(_fields(mod, "watch-1"))
    store.start(_fields(mod, "watch-2"))
    again = store.start(_fields(mod, "watch-1", device_name="Second try"))

    assert store.get("AAAAAA") is None
    assert store.get("BBBBBB").watch_id == "watch-2"
    assert store.get("CCCCCC") is again
    assert again.fields.device_name == "Second try"
    assert len(store) == 2


# ── the cap ──────────────────────────────────────────────────────────────


def test_the_store_refuses_past_its_cap_and_a_replace_still_fits(mod) -> None:
    clock = _Clock()
    store = mod.PairRequestStore(clock=clock)
    cap = mod.PairRequestStore._MAX_ENTRIES
    assert cap == 64
    for index in range(cap):
        assert store.start(_fields(mod, f"watch-{index}"), remote=f"10.0.0.{index}") is not None
    assert store.start(_fields(mod, "one-too-many"), remote="10.0.1.1") is None
    assert len(store) == cap

    # A watch asking again is never refused by its own old request.
    assert store.start(_fields(mod, "watch-0"), remote="10.0.0.0") is not None
    assert len(store) == cap

    # Once the requests expire there is room again.
    clock.now += 601
    assert store.start(_fields(mod, "one-too-many"), remote="10.0.1.1") is not None
    assert len(store) == 1


def test_one_address_holds_at_most_four_requests(mod) -> None:
    clock = _Clock()
    store = mod.PairRequestStore(clock=clock)
    per_remote = mod.PairRequestStore._MAX_PER_REMOTE
    assert per_remote == 4
    for index in range(per_remote):
        assert store.start(_fields(mod, f"watch-{index}"), remote="10.0.0.9") is not None
    assert store.start(_fields(mod, "fifth"), remote="10.0.0.9") is None
    assert len(store) == per_remote

    # Another address is unaffected.
    assert store.start(_fields(mod, "fifth"), remote="10.0.0.8") is not None

    # A watch asking again from the full address replaces its own entry and
    # does not count twice.
    again = store.start(_fields(mod, "watch-0", device_name="Again"), remote="10.0.0.9")
    assert again is not None
    assert again.fields.device_name == "Again"
    assert sum(1 for p in store._entries.values() if p.remote == "10.0.0.9") == per_remote

    # Expired requests free the address.
    clock.now += 601
    assert store.start(_fields(mod, "sixth"), remote="10.0.0.9") is not None


def test_a_refused_start_keeps_the_watch_s_earlier_request(mod) -> None:
    store = mod.PairRequestStore(
        clock=_Clock(), code_factory=_codes("AAAAAA", "BBBBBB", "CCCCCC", "DDDDDD", "EEEEEE")
    )
    first = store.start(_fields(mod, "mover"), remote="10.0.0.1")
    for index in range(4):
        store.start(_fields(mod, f"watch-{index}"), remote="10.0.0.2")
    # The watch moves to the full address: refused, and its old code stays.
    assert store.start(_fields(mod, "mover"), remote="10.0.0.2") is None
    assert store.get(first.code) is first


# ── where a request came from ────────────────────────────────────────────


def test_a_request_keeps_its_address_and_start_time(mod) -> None:
    clock = _Clock()
    store = mod.PairRequestStore(clock=clock, code_factory=_codes("AAAAAA", "BBBBBB"))
    pending = store.start(_fields(mod), remote="192.0.2.7")
    assert pending.remote == "192.0.2.7"
    assert pending.created_at == clock.now
    assert store.age_seconds(pending) == 0

    clock.now += 42.9
    assert store.age_seconds(pending) == 42
    assert store.age_seconds(pending, now=pending.created_at - 5) == 0

    assert store.start(_fields(mod, "watch-2")).remote is None


# ── a watch with a request waiting ───────────────────────────────────────


def test_has_pending_is_true_only_while_the_watch_s_request_lives(mod) -> None:
    clock = _Clock()
    store = mod.PairRequestStore(clock=clock, code_factory=_codes("AAAAAA"))
    assert store.has_pending("watch-1") is False

    pending = store.start(_fields(mod, "watch-1"))
    assert store.has_pending("watch-1") is True
    assert store.has_pending("watch-2") is False

    clock.now += 599
    assert store.has_pending("watch-1") is True
    clock.now += 1
    assert store.has_pending("watch-1") is False
    assert len(store) == 0

    # Removed by a confirm reads the same as expired.
    store = mod.PairRequestStore(clock=clock, code_factory=_codes("BBBBBB"))
    pending = store.start(_fields(mod, "watch-1"))
    store.remove(pending.code)
    assert store.has_pending("watch-1") is False


# ── collisions ───────────────────────────────────────────────────────────


def test_a_colliding_code_is_regenerated(mod) -> None:
    store = mod.PairRequestStore(
        clock=_Clock(), code_factory=_codes("AAAAAA", "AAAAAA", "aaaaaa", "BBBBBB")
    )
    first = store.start(_fields(mod, "watch-1"))
    second = store.start(_fields(mod, "watch-2"))
    assert first.code == "AAAAAA"
    assert second.code == "BBBBBB"


def test_a_generator_that_never_finds_a_free_code_raises(mod) -> None:
    store = mod.PairRequestStore(clock=_Clock(), code_factory=lambda: "AAAAAA")
    store.start(_fields(mod, "watch-1"))
    with pytest.raises(RuntimeError):
        store.start(_fields(mod, "watch-2"))


def test_shutdown_clears_everything(mod) -> None:
    store = mod.PairRequestStore(clock=_Clock(), code_factory=_codes("AAAAAA"))
    store.start(_fields(mod))
    store.shutdown()
    assert len(store) == 0
    assert store.get("AAAAAA") is None


# ── the shared field checks ──────────────────────────────────────────────


@pytest.mark.parametrize(
    ("payload", "message", "code"),
    [
        ({"secret_b64": SECRET}, "watch_id required", "invalid_watch_id"),
        ({"watch_id": "", "secret_b64": SECRET}, "watch_id required", "invalid_watch_id"),
        ({"watch_id": "library", "secret_b64": SECRET}, "watch_id is reserved", "invalid_watch_id"),
        ({"watch_id": "w" * 129, "secret_b64": SECRET}, "watch_id too long", "invalid_watch_id"),
        (
            {"watch_id": "w", "secret_b64": SECRET, "owner_iphone_id": "i" * 129},
            "watch_id too long",
            "invalid_watch_id",
        ),
        ({"watch_id": "w", "secret_b64": SECRET, "label": "l" * 257}, "label too long", "invalid_field"),
        (
            {"watch_id": "w", "secret_b64": SECRET, "device_name": "n" * 257},
            "device_name too long",
            "invalid_field",
        ),
        (
            {"watch_id": "w", "secret_b64": SECRET, "screen_size": "s" * 257},
            "screen_size too long",
            "invalid_field",
        ),
        (
            {"watch_id": "w", "secret_b64": SECRET, "app_version": "v" * 257},
            "app_version too long",
            "invalid_field",
        ),
        (
            {"watch_id": "w", "secret_b64": SECRET, "app_build": "b" * 257},
            "app_build too long",
            "invalid_field",
        ),
        ({"watch_id": "w"}, "secret_b64 required", "invalid_secret"),
        (
            {"watch_id": "w", "secret_b64": SECRET, "algo": "hmac-md5"},
            "algo must be one of: ['hmac-sha256']",
            "invalid_algo",
        ),
        (
            {"watch_id": "w", "secret_b64": "not base64!"},
            "secret_b64 is not valid base64",
            "invalid_secret",
        ),
        (
            {"watch_id": "w", "secret_b64": base64.b64encode(b"short").decode()},
            "secret must be 32 bytes (256 bits) for hmac-sha256",
            "invalid_secret",
        ),
    ],
)
def test_each_refusal_has_its_text_and_code(mod, payload, message, code) -> None:
    fields, error = mod.validate_pair_fields(payload)
    assert fields is None
    assert error == (400, message, code)


def test_accepted_fields_are_cleaned_like_register_secret_cleans_them(mod) -> None:
    fields, error = mod.validate_pair_fields(
        {
            "watch_id": "watch-1",
            "secret_b64": SECRET,
            "label": 7,
            "device_name": "  Jesse's Watch  ",
            "screen_size": " 208x248 ",
            "app_version": "",
            "app_build": "12",
            "owner_iphone_id": "",
        }
    )
    assert error is None
    assert fields.label is None
    assert fields.algo == "hmac-sha256"
    assert fields.device_name == "Jesse's Watch"
    assert fields.screen_size == "208x248"
    assert fields.app_version is None
    assert fields.app_build == "12"
    assert fields.owner_iphone_id is None
