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
import hashlib
import importlib.util
import sys
import types
from pathlib import Path

import pytest
from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey

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
        # The real sealed box: a sealed start's public key is checked with it.
        # It needs nothing from Home Assistant, only ``cryptography``.
        sealed_name = f"{_PKG}.sealed_box"
        sealed_spec = importlib.util.spec_from_file_location(sealed_name, _SRC / "sealed_box.py")
        sealed_module = importlib.util.module_from_spec(sealed_spec)
        sys.modules[sealed_name] = sealed_module
        sealed_spec.loader.exec_module(sealed_module)
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


# ── a sealed start ───────────────────────────────────────────────────────


def _public_b64() -> str:
    return base64.b64encode(X25519PrivateKey.generate().public_key().public_bytes_raw()).decode()


def test_an_old_form_start_is_a_watch_with_its_secret(mod) -> None:
    start, error = mod.validate_pair_start({"watch_id": "watch-1", "secret_b64": SECRET})
    assert error is None
    assert start.kind == "watch"
    assert start.public_key is None
    assert start.fields.secret_b64 == SECRET


@pytest.mark.parametrize("kind", ["watch", "iphone", None])
def test_a_sealed_start_carries_its_key_and_no_secret(mod, kind) -> None:
    public_b64 = _public_b64()
    body = {"watch_id": "device-1", "public_key_b64": public_b64, "device_name": " Phone "}
    if kind is not None:
        body["kind"] = kind
    start, error = mod.validate_pair_start(body)
    assert error is None
    assert start.kind == (kind or "watch")
    assert start.public_key == base64.b64decode(public_b64)
    assert start.fields.secret_b64 is None
    assert start.fields.device_name == "Phone"
    assert start.fields.algo == "hmac-sha256"


_LOW_ORDER = base64.b64encode(bytes(32)).decode()


@pytest.mark.parametrize(
    ("body", "message", "code"),
    [
        (
            {"watch_id": "w", "secret_b64": SECRET, "kind": "ipad"},
            "kind must be watch or iphone",
            "invalid_kind",
        ),
        (
            {"watch_id": "w", "secret_b64": SECRET, "kind": 1},
            "kind must be watch or iphone",
            "invalid_kind",
        ),
        (
            {"watch_id": "w", "secret_b64": SECRET, "kind": "iphone"},
            "public_key_b64 required for an iPhone",
            "invalid_public_key",
        ),
        (
            {"watch_id": "w", "secret_b64": SECRET, "public_key_b64": "PUBLIC"},
            "send public_key_b64 or secret_b64, not both",
            "invalid_secret",
        ),
        (
            {"watch_id": "w", "public_key_b64": "not base64!"},
            "public_key_b64 must be a 32-byte X25519 public key",
            "invalid_public_key",
        ),
        (
            {"watch_id": "w", "public_key_b64": base64.b64encode(b"k" * 31).decode()},
            "public_key_b64 must be a 32-byte X25519 public key",
            "invalid_public_key",
        ),
        (
            {"watch_id": "w", "public_key_b64": 32},
            "public_key_b64 must be a 32-byte X25519 public key",
            "invalid_public_key",
        ),
        (
            {"watch_id": "w", "public_key_b64": "A" * 100},
            "public_key_b64 must be a 32-byte X25519 public key",
            "invalid_public_key",
        ),
        (
            # A key of small order: every box sealed to it would open for anyone.
            {"watch_id": "w", "public_key_b64": _LOW_ORDER},
            "public_key_b64 must be a 32-byte X25519 public key",
            "invalid_public_key",
        ),
        ({"public_key_b64": "x"}, "watch_id required", "invalid_watch_id"),
        (
            {"watch_id": "w", "public_key_b64": "x", "algo": "hmac-md5"},
            "algo must be one of: ['hmac-sha256']",
            "invalid_algo",
        ),
    ],
)
def test_each_start_refusal_has_its_text_and_code(mod, body, message, code) -> None:
    if body.get("public_key_b64") == "x":
        body = {**body, "public_key_b64": _public_b64()}
    start, error = mod.validate_pair_start(body)
    assert start is None
    assert error == (400, message, code)


def test_a_secret_on_a_sealed_start_is_refused_even_when_valid(mod) -> None:
    _start, error = mod.validate_pair_start(
        {"watch_id": "w", "secret_b64": SECRET, "public_key_b64": _public_b64()}
    )
    assert error.code == "invalid_secret"


def test_a_secret_left_optional_is_still_checked_when_sent(mod) -> None:
    _fields, error = mod.validate_pair_fields(
        {"watch_id": "w", "secret_b64": "not base64!"}, secret_optional=True
    )
    assert error.message == "secret_b64 is not valid base64"
    fields, error = mod.validate_pair_fields({"watch_id": "w"}, secret_optional=True)
    assert error is None and fields.secret_b64 is None


def test_a_sealed_request_remembers_its_kind_and_key(mod) -> None:
    store = mod.PairRequestStore(clock=_Clock(), code_factory=_codes("AAAAAA", "BBBBBB"))
    public = base64.b64decode(_public_b64())
    pending = store.start(_fields(mod), kind="iphone", public_key=public)
    assert pending.kind == "iphone"
    assert pending.public_key == public
    assert pending.sealed is True
    assert store.start(_fields(mod, "watch-2")).sealed is False


# ── /v2/pair/status from the store ───────────────────────────────────────


_BOX = {"server_public_key_b64": "S", "nonce": "N", "box": "B"}


def test_status_runs_pending_then_confirmed_then_expired(mod) -> None:
    clock = _Clock()
    store = mod.PairRequestStore(clock=clock, code_factory=_codes("AAAAAA"))
    assert store.status("watch-1") == ("expired", None)
    pending = store.start(_fields(mod))
    assert store.status("watch-1") == ("pending", None)

    clock.now += 100
    store.confirm_sealed(pending, _BOX)
    assert store.get("AAAAAA") is None
    assert store.has_pending("watch-1") is False
    assert store.status("watch-1") == ("confirmed", _BOX)
    assert store.status("watch-2") == ("expired", None)

    # Ten minutes from the confirm, not from the start.
    clock.now += 599
    assert store.status("watch-1")[0] == "confirmed"
    clock.now += 1
    assert store.status("watch-1") == ("expired", None)


def test_status_hands_out_a_copy(mod) -> None:
    store = mod.PairRequestStore(clock=_Clock(), code_factory=_codes("AAAAAA"))
    store.confirm_sealed(store.start(_fields(mod)), dict(_BOX))
    _state, reply = store.status("watch-1")
    reply["box"] = "changed"
    assert store.status("watch-1")[1] == _BOX


def test_a_new_start_drops_a_waiting_box(mod) -> None:
    store = mod.PairRequestStore(clock=_Clock(), code_factory=_codes("AAAAAA", "BBBBBB"))
    store.confirm_sealed(store.start(_fields(mod)), _BOX)
    store.start(_fields(mod))
    assert store.status("watch-1") == ("pending", None)


def test_a_refused_start_keeps_a_waiting_box(mod) -> None:
    store = mod.PairRequestStore(clock=_Clock())
    store.confirm_sealed(store.start(_fields(mod, "mover"), remote="10.0.0.1"), _BOX)
    for index in range(4):
        store.start(_fields(mod, f"watch-{index}"), remote="10.0.0.2")
    assert store.start(_fields(mod, "mover"), remote="10.0.0.2") is None
    assert store.status("mover") == ("confirmed", _BOX)


def test_waiting_boxes_are_capped(mod) -> None:
    store = mod.PairRequestStore(clock=_Clock())
    cap = mod.PairRequestStore._MAX_ENTRIES
    for index in range(cap + 3):
        store.confirm_sealed(store.start(_fields(mod, f"watch-{index}")), _BOX)
    assert store.status("watch-0") == ("expired", None)
    assert store.status(f"watch-{cap + 2}")[0] == "confirmed"
    assert len(store._sealed) == cap


def test_shutdown_drops_waiting_boxes(mod) -> None:
    store = mod.PairRequestStore(clock=_Clock(), code_factory=_codes("AAAAAA"))
    store.confirm_sealed(store.start(_fields(mod)), _BOX)
    store.shutdown()
    assert store.status("watch-1") == ("expired", None)


# ── where a request came from: home or not ───────────────────────────────


@pytest.mark.parametrize(
    "remote",
    [
        "10.0.0.1",
        "10.255.255.255",
        "172.16.0.1",
        "172.31.255.254",
        "192.168.0.1",
        "127.0.0.1",
        "127.8.8.8",
        "::1",
        "[::1]",
        "fe80::1",
        "fe80::1%en0",
        "fc00::1",
        "fd12:3456:789a::1",
        "::ffff:10.1.2.3",
        " 192.168.1.2 ",
    ],
)
def test_home_addresses_are_not_public(mod, remote) -> None:
    assert mod.remote_is_public(remote) is False


@pytest.mark.parametrize(
    "remote",
    [
        "8.8.8.8",
        "172.15.0.1",
        "172.32.0.1",
        "192.169.0.1",
        "100.64.0.1",
        "169.254.1.1",
        "2001:db8::1",
        "::ffff:8.8.8.8",
        "not an address",
    ],
)
def test_other_addresses_are_public(mod, remote) -> None:
    assert mod.remote_is_public(remote) is True


@pytest.mark.parametrize("remote", [None, "", "   "])
def test_no_address_is_not_public(mod, remote) -> None:
    assert mod.remote_is_public(remote) is False


def test_a_start_works_out_whether_it_is_remote(mod) -> None:
    store = mod.PairRequestStore(clock=_Clock())
    assert store.start(_fields(mod, "a"), remote="8.8.8.8").remote_public is True
    assert store.start(_fields(mod, "b"), remote="192.168.1.2").remote_public is False
    assert store.start(_fields(mod, "c")).remote_public is False
    # The view knows more (a request through the cloud) and says so.
    assert store.start(_fields(mod, "d"), remote="127.0.0.1", remote_public=True).remote_public


# ── the QR link ──────────────────────────────────────────────────────────


_TOKEN = bytes(range(32))


def test_the_link_spells_every_field_in_order(mod) -> None:
    url = mod.build_offer_url(
        instance_id="abc123",
        token=_TOKEN,
        internal_url="http://homeassistant.local:8123",
        external_url="https://ha.example.com:8443/",
        cloud_url="https://xyz.ui.nabu.casa",
        home_name="Jesse's Home & Garden",
    )
    assert url == (
        "wristassistant://pair#v=1&i=abc123"
        "&t=AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8"
        "&u=http%3A%2F%2Fhomeassistant.local%3A8123"
        "&e=https%3A%2F%2Fha.example.com%3A8443%2F"
        "&c=https%3A%2F%2Fxyz.ui.nabu.casa"
        "&n=Jesse%27s%20Home%20%26%20Garden"
    )


def test_the_token_is_base64url_without_padding(mod) -> None:
    token = bytes([0xFB, 0xFF] * 16)
    text = mod.token_text(token)
    assert "=" not in text and "+" not in text and "/" not in text
    assert base64.urlsafe_b64decode(text + "=") == token
    assert mod.offer_id_for(token) == hashlib.sha256(token).hexdigest()


def test_empty_fields_are_left_out_of_the_link(mod) -> None:
    url = mod.build_offer_url(
        instance_id="abc", token=_TOKEN, internal_url=None, external_url="",
        cloud_url="  ", home_name=None,
    )
    assert url == "wristassistant://pair#v=1&i=abc&t=AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8"


# ── QR offers ────────────────────────────────────────────────────────────


def _tokens(*seeds: int):
    queue = [bytes([seed]) * 32 for seed in seeds]
    return lambda: queue.pop(0)


def test_an_offer_keeps_its_token_and_is_found_by_its_hash(mod) -> None:
    clock = _Clock()
    store = mod.PairOfferStore(clock=clock, token_factory=_tokens(7))
    offer = store.create(user_id="chen", admin_id="root", replace=True)
    assert offer.token == bytes([7]) * 32
    assert offer.offer_id == hashlib.sha256(offer.token).hexdigest()
    assert (offer.user_id, offer.admin_id, offer.replace) == ("chen", "root", True)
    assert store.get(offer.offer_id) is offer
    assert store.get(offer.offer_id.upper()) is offer
    assert store.get("0" * 64) is None
    assert store.get("short") is None
    assert store.get(None) is None
    assert store.expires_in(offer) == 300
    assert store.state(offer) == "open"
    # The token stays out of the record's repr, so it never lands in a log.
    assert str(offer.token) not in repr(offer)


def test_a_real_token_is_32_random_bytes(mod) -> None:
    store = mod.PairOfferStore(clock=_Clock())
    one = store.create(user_id="u", admin_id="a")
    two = store.create(user_id="u", admin_id="a")
    assert len(one.token) == 32 and one.token != two.token


def test_an_offer_runs_out_after_five_minutes(mod) -> None:
    clock = _Clock()
    store = mod.PairOfferStore(clock=clock, token_factory=_tokens(1))
    offer = store.create(user_id="u", admin_id="a")
    clock.now += 299.5
    assert store.state_of(offer.offer_id) == ("open", offer)
    clock.now += 0.5
    assert store.state_of(offer.offer_id) == ("expired", offer)
    # Remembered a while, then gone.
    clock.now += 599
    assert store.get(offer.offer_id) is offer
    clock.now += 1
    assert store.get(offer.offer_id) is None
    assert store.state_of(offer.offer_id) == ("expired", None)


def test_a_redeemed_offer_forgets_its_token_and_is_remembered(mod) -> None:
    clock = _Clock()
    store = mod.PairOfferStore(clock=clock, token_factory=_tokens(1))
    offer = store.create(user_id="u", admin_id="a")
    clock.now += 10
    store.redeem(offer, device_id="iphone:1", device_name="Phone")
    assert offer.token == b""
    assert (offer.device_id, offer.device_name, offer.redeemed_at) == ("iphone:1", "Phone", clock.now)
    # Redeemed stays redeemed past the expiry, until its own retention ends.
    clock.now += 300
    assert store.state_of(offer.offer_id)[0] == "redeemed"
    clock.now += 300
    assert store.get(offer.offer_id) is None


def test_at_most_sixteen_open_offers(mod) -> None:
    clock = _Clock()
    store = mod.PairOfferStore(clock=clock)
    offers = [store.create(user_id="u", admin_id="a") for _ in range(16)]
    assert all(offers)
    assert store.create(user_id="u", admin_id="a") is None
    # A redeemed or cancelled one frees a place.
    store.redeem(offers[0], device_id="d", device_name=None)
    assert store.create(user_id="u", admin_id="a") is not None
    assert store.cancel(offers[1].offer_id) is True
    assert store.create(user_id="u", admin_id="a") is not None
    assert store.create(user_id="u", admin_id="a") is None


def test_closed_offers_give_way_past_the_record_cap(mod) -> None:
    clock = _Clock()
    store = mod.PairOfferStore(clock=clock)
    for _ in range(80):
        offer = store.create(user_id="u", admin_id="a")
        store.redeem(offer, device_id="d", device_name=None)
    assert len(store) == mod.PairOfferStore._MAX_RECORDS


def test_cancel_reports_whether_the_offer_was_open(mod) -> None:
    clock = _Clock()
    store = mod.PairOfferStore(clock=clock, token_factory=_tokens(1, 2))
    one = store.create(user_id="u", admin_id="a")
    two = store.create(user_id="u", admin_id="a")
    store.redeem(two, device_id="d", device_name=None)
    assert store.cancel(one.offer_id) is True
    assert store.cancel(one.offer_id) is False
    assert store.cancel(two.offer_id) is False
    assert store.cancel("garbage") is False
    assert len(store) == 0


def test_a_broken_token_factory_raises(mod) -> None:
    store = mod.PairOfferStore(clock=_Clock(), token_factory=lambda: b"short")
    with pytest.raises(RuntimeError):
        store.create(user_id="u", admin_id="a")


def test_offer_shutdown_clears_everything(mod) -> None:
    store = mod.PairOfferStore(clock=_Clock())
    offer = store.create(user_id="u", admin_id="a")
    store.shutdown()
    assert store.get(offer.offer_id) is None
