"""iPhone pairing with no Home Assistant token, with no Home Assistant.

Step 1 of ``docs/iphone_pairing_without_sign_in_2026-10.md`` in the app repo.
Three things, each over the real code:

* The two fixed vectors the Swift side copies byte for byte:
  ``fixtures/pair_seal_vector.json`` (a sealed code pairing's box) and
  ``fixtures/offer_seal_vector.json`` (a QR offer's link, redeem box and
  signed reply). Each is checked against ``sealed_box.py`` and, separately,
  against HKDF written out by hand and raw AES-GCM, so a vector is never
  checked only against the code that made it.
* ``WAPairRedeemView``, pulled out of ``wa_v2_views.py`` by name the way
  ``test_pair_start_view.py`` pulls its views, over the real offer store,
  secret store and ``pairing_ws.store_paired_device`` (the
  ``pairing_env`` of ``test_pairing_ws.py``), and the real
  ``widget_hmac.sign_response``. Pinned: the reply, its signature, the label
  and user of the stored entry, the offer spent once, and each refusal with
  its status, in the contract's order.
* The signed ``rekey`` op: one write swaps the secret and keeps the rest,
  the reply is signed with the new secret, and a bad box changes nothing.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import base64
import contextlib
import hashlib
import hmac
import importlib.util
import json
import logging
import sys
import types
from pathlib import Path
from typing import Any

import pytest
from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from test_pairing_ws import INSTANCE_ID, pairing_env
from test_widget_secret_user_binding import _SRC, _View

_FIXTURES = Path(__file__).resolve().parent / "fixtures"
_PAIR_VECTOR = _FIXTURES / "pair_seal_vector.json"
_OFFER_VECTOR = _FIXTURES / "offer_seal_vector.json"
_VIEWS = _SRC / "wa_v2_views.py"

DOMAIN = "wrist_assistant"
PHONE = "iphone:0F1E2D3C-4B5A-6978-8796-A5B4C3D2E1F0"
NEW_SECRET = bytes(range(96, 128))


def _hkdf_by_hand(ikm: bytes, info: bytes, salt: bytes, length: int = 32) -> bytes:
    """RFC 5869, written out."""
    prk = hmac.new(salt, ikm, hashlib.sha256).digest()
    okm, block, counter = b"", b"", 1
    while len(okm) < length:
        block = hmac.new(prk, block + info + bytes([counter]), hashlib.sha256).digest()
        okm += block
        counter += 1
    return okm[:length]


@pytest.fixture
def sealed():
    name = "wa_pair_redeem_test_sealed_box"
    spec = importlib.util.spec_from_file_location(name, _SRC / "sealed_box.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


# ── the pair seal vector ─────────────────────────────────────────────────


def test_the_pair_seal_vector_seals_byte_for_byte(sealed) -> None:
    vector = json.loads(_PAIR_VECTOR.read_text())
    device_private = base64.b64decode(vector["device_private_key_b64"])
    server_private = base64.b64decode(vector["server_private_key_b64"])
    device_public = base64.b64decode(vector["device_public_key_b64"])
    secret = base64.b64decode(vector["secret_b64"])
    nonce = base64.b64decode(vector["nonce_b64"])
    watch_id = vector["watch_id"]
    assert (vector["salt"], vector["aad"]) == ("wrist-assistant-pair-v1", "pair_secret")
    assert sealed.PAIR_SEAL_SALT == vector["salt"].encode()
    assert sealed.PAIR_SEAL_AAD == vector["aad"]

    # The key pairs and the shared secret, from the library on its own.
    device_key = X25519PrivateKey.from_private_bytes(device_private)
    server_key = X25519PrivateKey.from_private_bytes(server_private)
    assert device_key.public_key().public_bytes_raw() == device_public
    assert server_key.public_key().public_bytes_raw() == base64.b64decode(
        vector["server_public_key_b64"]
    )
    shared = server_key.exchange(device_key.public_key())
    assert shared == device_key.exchange(server_key.public_key())
    assert shared.hex() == vector["shared_secret_hex"]

    key = sealed.derive_pair_key(shared, watch_id)
    assert key.hex() == vector["key_hex"]
    assert key == _hkdf_by_hand(shared, watch_id.encode(), b"wrist-assistant-pair-v1")

    reply = sealed.seal_pair_secret(
        device_public, watch_id, secret, server_private_key=server_private, nonce=nonce
    )
    assert {"state": "confirmed", **reply} == vector["reply"]
    box = base64.b64decode(reply["box"])
    assert len(box) == 32 + 16
    assert AESGCM(key).decrypt(nonce, box, b"pair_secret") == secret
    assert sealed.open_pair_secret(device_private, watch_id, reply) == secret


def test_a_pair_seal_does_not_open_for_another_id_or_key(sealed) -> None:
    vector = json.loads(_PAIR_VECTOR.read_text())
    device_private = base64.b64decode(vector["device_private_key_b64"])
    reply = {k: v for k, v in vector["reply"].items() if k != "state"}
    with pytest.raises(sealed.SealedBoxError, match="does not open"):
        sealed.open_pair_secret(device_private, "another-watch", reply)
    with pytest.raises(sealed.SealedBoxError, match="does not open"):
        sealed.open_pair_secret(bytes(range(1, 33)), vector["watch_id"], reply)


def test_every_pair_seal_has_its_own_server_key_and_nonce(sealed) -> None:
    device = X25519PrivateKey.generate()
    public = device.public_key().public_bytes_raw()
    one = sealed.seal_pair_secret(public, "w", NEW_SECRET)
    two = sealed.seal_pair_secret(public, "w", NEW_SECRET)
    assert one["server_public_key_b64"] != two["server_public_key_b64"]
    assert one["nonce"] != two["nonce"]
    for reply in (one, two):
        assert sealed.open_pair_secret(device.private_bytes_raw(), "w", reply) == NEW_SECRET


def test_a_key_of_small_order_cannot_be_sealed_to(sealed) -> None:
    with pytest.raises(sealed.SealedBoxError):
        sealed.seal_pair_secret(bytes(32), "w", NEW_SECRET)
    with pytest.raises(sealed.SealedBoxError):
        sealed.x25519_public_key(b"short")


def test_the_pair_and_offer_keys_never_equal_the_signed_box_key(sealed) -> None:
    """Three salts: the same input never gives the same key twice."""
    ikm = bytes(range(32))
    keys = {
        sealed.derive_key(ikm, "id"),
        sealed.derive_pair_key(ikm, "id"),
        sealed.derive_offer_key(ikm, "id"),
    }
    assert len(keys) == 3


# ── the offer seal vector ────────────────────────────────────────────────


def test_the_offer_seal_vector_seals_byte_for_byte(sealed) -> None:
    vector = json.loads(_OFFER_VECTOR.read_text())
    token = bytes.fromhex(vector["token_hex"])
    text = vector["token_b64url"]
    assert base64.urlsafe_b64decode(text + "=" * (-len(text) % 4)) == token
    assert "=" not in text
    assert hashlib.sha256(token).hexdigest() == vector["offer_id"]
    device_id = vector["device_id"]
    secret = base64.b64decode(vector["secret_b64"])
    nonce = base64.b64decode(vector["nonce_b64"])
    assert (vector["salt"], vector["aad"]) == ("wrist-assistant-offer-v1", "pair_redeem")
    assert sealed.OFFER_SEAL_SALT == vector["salt"].encode()
    assert sealed.OFFER_SEAL_AAD == vector["aad"]

    key = sealed.derive_offer_key(token, device_id)
    assert key.hex() == vector["key_hex"]
    assert key == _hkdf_by_hand(token, device_id.encode(), b"wrist-assistant-offer-v1")
    envelope = sealed.seal_offer_secret(token, device_id, secret, nonce=nonce)
    assert envelope == vector["envelope"]
    assert AESGCM(key).decrypt(nonce, base64.b64decode(envelope["box"]), b"pair_redeem") == secret
    assert sealed.open_offer_secret(token, device_id, envelope) == secret


def test_the_offer_vector_link_is_the_one_the_panel_shows() -> None:
    vector = json.loads(_OFFER_VECTOR.read_text())
    with pairing_env() as penv:
        url = penv.pair_mod.build_offer_url(
            instance_id="8a2e4b0c1d9f4e7a9b3c5d6e7f801234",
            token=bytes.fromhex(vector["token_hex"]),
            internal_url="http://192.168.1.20:8123",
            external_url="https://home.example.com",
            cloud_url="https://abcdefghijklmnop.ui.nabu.casa",
            home_name="Jesse's Home",
        )
    assert url == vector["url"]


def test_the_offer_vector_reply_signature(sealed) -> None:
    vector = json.loads(_OFFER_VECTOR.read_text())
    reply = vector["reply"]
    secret = base64.b64decode(vector["secret_b64"])
    canonical = (
        f"v2|pair_redeem|{vector['device_id']}|{reply['x_wa_ts']}|response".encode()
        + b"\n"
        + reply["body_utf8"].encode()
    )
    assert canonical.decode() == reply["canonical_utf8"]
    assert hmac.new(secret, canonical, hashlib.sha256).hexdigest() == reply["x_wa_sig"]
    with _real_hmac() as widget_hmac:
        assert (
            widget_hmac.sign_response(
                secret,
                "pair_redeem",
                vector["device_id"],
                int(reply["x_wa_ts"]),
                reply["body_utf8"].encode(),
            )
            == reply["x_wa_sig"]
        )


@pytest.mark.parametrize(
    ("token", "device_id", "aad"),
    [
        (bytes(32), PHONE, "pair_redeem"),
        (bytes(range(0xC0, 0xE0)), "iphone:other", "pair_redeem"),
        (bytes(range(0xC0, 0xE0)), PHONE, "rekey"),
    ],
    ids=["wrong token", "wrong device id", "wrong associated data"],
)
def test_an_offer_box_opens_only_with_its_token_and_device(sealed, token, device_id, aad) -> None:
    good_token = bytes(range(0xC0, 0xE0))
    key = sealed.derive_offer_key(token, device_id)
    envelope = sealed._seal_with_key(key, aad, NEW_SECRET)
    with pytest.raises(sealed.SealedBoxError, match="does not open"):
        sealed.open_offer_secret(good_token, PHONE, envelope)


# ── loading the views ────────────────────────────────────────────────────


@contextlib.contextmanager
def _real_hmac():
    """The real ``widget_hmac`` (and the real ``const`` it reads), loaded
    into a throwaway package over stubbed Home Assistant modules."""
    saved = dict(sys.modules)
    pkg_name = "wa_pair_redeem_test_pkg"
    try:
        for name, attrs in (
            ("homeassistant", {}),
            ("homeassistant.core", {"HomeAssistant": type("HomeAssistant", (), {})}),
            ("homeassistant.helpers", {}),
            ("homeassistant.helpers.storage", {"Store": object}),
            ("homeassistant.util", {}),
            ("homeassistant.util.dt", {"parse_datetime": lambda v: None, "utcnow": lambda: None}),
        ):
            # Fill in only what is missing: inside ``pairing_env`` these stubs
            # exist already, and the store there must keep its own.
            module = sys.modules.get(name) or types.ModuleType(name)
            for key, value in attrs.items():
                if not hasattr(module, key):
                    setattr(module, key, value)
            sys.modules[name] = module
        pkg = types.ModuleType(pkg_name)
        pkg.__path__ = []
        sys.modules[pkg_name] = pkg
        loaded = None
        for name in ("const", "widget_secret_store", "widget_hmac"):
            spec = importlib.util.spec_from_file_location(f"{pkg_name}.{name}", _SRC / f"{name}.py")
            loaded = importlib.util.module_from_spec(spec)
            sys.modules[f"{pkg_name}.{name}"] = loaded
            spec.loader.exec_module(loaded)
        yield loaded
    finally:
        for key in list(sys.modules):
            if key not in saved:
                del sys.modules[key]
        sys.modules.update(saved)


class _RawResponse:
    """What both the view's ``json`` and its raw signed ``Response`` give."""

    def __init__(
        self,
        *,
        body: Any = None,
        status: int = 200,
        content_type: str | None = None,
        headers: dict | None = None,
        text: str = "",
    ) -> None:
        self.status = status
        self.raw = body
        self.headers = headers or {}
        self.content_type = content_type
        self.body = json.loads(body) if isinstance(body, bytes) else body


class _JSONView(_View):
    def json(self, result: Any, status_code: int = 200, headers: Any = None) -> _RawResponse:
        return _RawResponse(body=result, status=status_code)


class _Request:
    def __init__(self, payload: Any) -> None:
        self._payload = payload

    async def json(self) -> Any:
        if isinstance(self._payload, Exception):
            raise self._payload
        return self._payload


_FAKE_ORJSON = types.SimpleNamespace(
    loads=json.loads,
    dumps=lambda obj, *a, **k: json.dumps(obj, separators=(",", ":")).encode(),
    JSONDecodeError=json.JSONDecodeError,
)


def _extract(names: set[str], namespace: dict[str, Any]) -> dict[str, Any]:
    tree = ast.parse(_VIEWS.read_text(), filename=str(_VIEWS))
    wanted = [
        node
        for node in tree.body
        if (
            isinstance(node, ast.ClassDef | ast.FunctionDef | ast.AsyncFunctionDef)
            and node.name in names
        )
        or (
            isinstance(node, ast.Assign)
            and isinstance(node.targets[0], ast.Name)
            and node.targets[0].id in names
        )
    ]
    found = {
        node.name if not isinstance(node, ast.Assign) else node.targets[0].id for node in wanted
    }
    assert found == names, names ^ found
    code = compile(
        ast.Module(body=wanted, type_ignores=[]),
        str(_VIEWS),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    exec(code, namespace)  # noqa: S102
    return namespace


@pytest.fixture
def env(sealed):
    with pairing_env() as penv, _real_hmac() as widget_hmac:
        instance = types.SimpleNamespace(value=INSTANCE_ID)

        async def async_get(_hass) -> str | None:
            return instance.value

        namespace = _extract(
            {"WAPairRedeemView", "_REDEEM_MAX_BOX_CHARS", "_op_rekey", "_REKEY_MAX_BOX_CHARS"},
            {
                "Any": Any,
                "base64": base64,
                "time": types.SimpleNamespace(time=lambda: 1_791_331_200.7),
                "orjson": _FAKE_ORJSON,
                "Response": _RawResponse,
                "HomeAssistantView": _JSONView,
                "HomeAssistant": object,
                "Request": object,
                "_OpContext": object,
                "DOMAIN": DOMAIN,
                "WA_PROTOCOL_VERSION": 2,
                "_LOGGER": logging.getLogger("test_pair_redeem"),
                "ha_instance_id": types.SimpleNamespace(async_get=async_get),
                "normalize_offer_id": penv.pair_mod.normalize_offer_id,
                "validate_pair_fields": penv.pair_mod.validate_pair_fields,
                "OFFER_STATE_OPEN": penv.pair_mod.OFFER_STATE_OPEN,
                "OFFER_STATE_EXPIRED": penv.pair_mod.OFFER_STATE_EXPIRED,
                "REGISTER_TEXT_MAX_LEN": penv.pair_mod.REGISTER_TEXT_MAX_LEN,
                "LABEL_IPHONE_SELF_PROVISION": "iphone-self-provision",
                "PAIRED_SECRET_BYTES": 32,
                "SealedBoxError": sys.modules[
                    "custom_components.wrist_assistant.sealed_box"
                ].SealedBoxError,
                "open_offer_secret": sys.modules[
                    "custom_components.wrist_assistant.sealed_box"
                ].open_offer_secret,
                "open_box": sys.modules["custom_components.wrist_assistant.sealed_box"].open_box,
                "sign_response": widget_hmac.sign_response,
                "store_paired_device": penv.ws.store_paired_device,
                "log_secret_reprovisioned": lambda hass, **kw: penv.logbook.append(
                    ("reprovisioned", kw)
                ),
            },
        )
        yield types.SimpleNamespace(
            penv=penv,
            sealed=sys.modules["custom_components.wrist_assistant.sealed_box"],
            widget_hmac=widget_hmac,
            instance=instance,
            view=namespace["WAPairRedeemView"](penv.hass),
            rekey=namespace["_op_rekey"],
        )


# ── redeem ───────────────────────────────────────────────────────────────


def _offer(env, **kwargs: Any):
    kwargs.setdefault("user_id", "chen")
    kwargs.setdefault("admin_id", "root")
    return env.penv.offer_store.create(**kwargs)


def _redeem_body(env, offer, *, secret: bytes = NEW_SECRET, device_id: str = PHONE, **extra):
    body = {
        "offer_id": offer.offer_id,
        "device_id": device_id,
        "device_name": "Chen's iPhone",
        "model": "iPhone17,1",
        "app_version": "3.2.0",
        "app_build": "4",
        "sealed": env.sealed.seal_offer_secret(offer.token, device_id, secret),
    }
    body.update(extra)
    return {key: value for key, value in body.items() if value is not None}


def _redeem(env, body: Any) -> _RawResponse:
    return asyncio.run(env.view.post(_Request(body)))


def test_a_redeem_pairs_the_phone_for_the_offer_s_person(env) -> None:
    offer = _offer(env)
    reply = _redeem(env, _redeem_body(env, offer))
    assert reply.status == 200, reply.body
    assert reply.body == {"instance_id": INSTANCE_ID, "server_time": 1_791_331_200}
    assert reply.content_type == "application/json"

    entry = env.penv.secret_store.get(PHONE)
    assert base64.b64decode(entry.secret_b64) == NEW_SECRET
    assert entry.label == "iphone-self-provision"
    assert entry.device_kind == "iphone"
    assert entry.user_id == "chen"
    assert entry.owner_iphone_id is None
    assert entry.device_name == "Chen's iPhone"
    assert (entry.app_version, entry.app_build) == ("3.2.0", "4")
    assert env.penv.logbook == [
        (
            "registered",
            {"watch_id": PHONE, "label": "iphone-self-provision", "app_version": "3.2.0"},
        )
    ]
    # The panel's poll learns it, and the token is gone.
    state, kept = env.penv.offer_store.state_of(offer.offer_id)
    assert state == "redeemed"
    assert (kept.device_id, kept.device_name) == (PHONE, "Chen's iPhone")
    assert kept.token == b""


def test_the_reply_is_signed_with_the_new_secret(env) -> None:
    reply = _redeem(env, _redeem_body(env, _offer(env)))
    assert reply.headers["X-WA-Ts"] == "1791331200"
    canonical = f"v2|pair_redeem|{PHONE}|1791331200|response".encode() + b"\n" + reply.raw
    assert reply.headers["X-WA-Sig"] == hmac.new(NEW_SECRET, canonical, hashlib.sha256).hexdigest()
    # The body is the exact bytes signed: compact JSON, nothing else.
    assert reply.raw == b'{"instance_id":"0123456789abcdef0123456789abcdef","server_time":1791331200}'


def test_an_offer_is_spent_once(env) -> None:
    offer = _offer(env)
    body = _redeem_body(env, offer)
    assert _redeem(env, body).status == 200
    again = _redeem(env, body)
    assert (again.status, again.body["error"]) == (404, "unknown_offer")


def test_an_upper_case_offer_id_is_found(env) -> None:
    offer = _offer(env)
    body = _redeem_body(env, offer, offer_id=offer.offer_id.upper())
    assert _redeem(env, body).status == 200


@pytest.mark.parametrize("how", ["unknown", "cancelled", "forgotten"])
def test_an_unknown_offer_is_404(env, how) -> None:
    offer = _offer(env)
    body = _redeem_body(env, offer)
    if how == "unknown":
        body["offer_id"] = "0" * 64
    elif how == "cancelled":
        env.penv.offer_store.cancel(offer.offer_id)
    else:
        env.penv.clock.now += 300 + 600
    reply = _redeem(env, body)
    assert (reply.status, reply.body["ok"], reply.body["error"]) == (404, False, "unknown_offer")
    assert env.penv.secret_store.get(PHONE) is None


def test_a_lapsed_offer_is_410(env) -> None:
    offer = _offer(env)
    body = _redeem_body(env, offer)
    env.penv.clock.now += 300
    reply = _redeem(env, body)
    assert (reply.status, reply.body["error"]) == (410, "expired")
    assert env.penv.secret_store.get(PHONE) is None


@pytest.mark.parametrize(
    "spoil",
    ["wrong token", "wrong device", "tampered", "not an envelope", "missing", "short secret"],
)
def test_a_box_that_does_not_open_is_400_and_leaves_the_offer_open(env, spoil) -> None:
    offer = _offer(env)
    body = _redeem_body(env, offer)
    if spoil == "wrong token":
        body["sealed"] = env.sealed.seal_offer_secret(bytes(32), PHONE, NEW_SECRET)
    elif spoil == "wrong device":
        body["sealed"] = env.sealed.seal_offer_secret(offer.token, "iphone:other", NEW_SECRET)
    elif spoil == "tampered":
        box = bytearray(base64.b64decode(body["sealed"]["box"]))
        box[3] ^= 1
        body["sealed"]["box"] = base64.b64encode(bytes(box)).decode()
    elif spoil == "not an envelope":
        body["sealed"] = "AAAA"
    elif spoil == "missing":
        del body["sealed"]
    else:
        body["sealed"] = env.sealed.seal_offer_secret(offer.token, PHONE, b"x" * 16)
    reply = _redeem(env, body)
    assert (reply.status, reply.body["error"]) == (400, "bad_box")
    assert env.penv.secret_store.get(PHONE) is None
    assert env.penv.offer_store.state_of(offer.offer_id)[0] == "open"
    # The real phone can still redeem it.
    assert _redeem(env, _redeem_body(env, offer)).status == 200


def test_an_oversized_box_is_refused_before_it_is_opened(env) -> None:
    offer = _offer(env)
    body = _redeem_body(env, offer)
    body["sealed"]["box"] = "A" * 4096
    assert _redeem(env, body).body["error"] == "bad_box"


def test_a_phone_bound_to_another_person_is_409(env) -> None:
    old = base64.b64encode(b"o" * 32).decode()
    env.penv.secret_store.register(PHONE, old, "iphone-self-provision", user_id="root")
    offer = _offer(env)
    reply = _redeem(env, _redeem_body(env, offer))
    assert (reply.status, reply.body["error"]) == (409, "bound_to_other_user")
    entry = env.penv.secret_store.get(PHONE)
    assert (entry.secret_b64, entry.user_id) == (old, "root")
    assert env.penv.offer_store.state_of(offer.offer_id)[0] == "open"


def test_replace_on_the_offer_takes_the_phone_over(env, caplog) -> None:
    old = base64.b64encode(b"o" * 32).decode()
    env.penv.secret_store.register(PHONE, old, "iphone-self-provision", user_id="root")
    offer = _offer(env, replace=True)
    with caplog.at_level(logging.WARNING):
        reply = _redeem(env, _redeem_body(env, offer))
    assert reply.status == 200
    entry = env.penv.secret_store.get(PHONE)
    assert (base64.b64decode(entry.secret_b64), entry.user_id) == (NEW_SECRET, "chen")
    assert any("from user root to user chen" in r.getMessage() for r in caplog.records)


def test_the_same_person_s_phone_needs_no_replace(env) -> None:
    old = base64.b64encode(b"o" * 32).decode()
    env.penv.secret_store.register(PHONE, old, "iphone-self-provision", user_id="chen")
    reply = _redeem(env, _redeem_body(env, _offer(env)))
    assert reply.status == 200
    assert env.penv.secret_store.get(PHONE).user_id == "chen"
    assert env.penv.logbook[-1][0] == "reprovisioned"


def test_a_phone_bound_to_no_one_needs_replace(env) -> None:
    """Paired before devices were tied to a person: nothing says it is the
    offer's person's, so a plain QR code does not take it over."""
    old = base64.b64encode(b"o" * 32).decode()
    env.penv.secret_store.register(PHONE, old, "iphone-self-provision")
    offer = _offer(env)
    reply = _redeem(env, _redeem_body(env, offer))
    assert (reply.status, reply.body["error"]) == (409, "unbound_needs_replace")
    assert "Replace" in reply.body["message"]
    entry = env.penv.secret_store.get(PHONE)
    assert (entry.secret_b64, entry.user_id) == (old, None)
    assert env.penv.offer_store.state_of(offer.offer_id)[0] == "open"

    reply = _redeem(env, _redeem_body(env, _offer(env, replace=True)))
    assert reply.status == 200, reply.body
    entry = env.penv.secret_store.get(PHONE)
    assert (base64.b64decode(entry.secret_b64), entry.user_id) == (NEW_SECRET, "chen")


@pytest.mark.parametrize("replace", [False, True], ids=["plain", "replace"])
@pytest.mark.parametrize("bound_to", ["root", "chen", None], ids=["other", "same", "nobody"])
@pytest.mark.parametrize("label", ["watch-self-provision", "watch-code-pair", None])
def test_a_watch_s_id_is_never_taken_over_as_an_iphone(env, label, bound_to, replace) -> None:
    """The QR code is not tied to a device id, so a redeemer could name a
    watch's. Replace means another person's iPhone, never any device."""
    old = base64.b64encode(b"o" * 32).decode()
    env.penv.secret_store.register(PHONE, old, label, user_id=bound_to)
    offer = _offer(env, replace=replace)
    reply = _redeem(env, _redeem_body(env, offer))
    assert (reply.status, reply.body["ok"], reply.body["error"]) == (409, False, "not_an_iphone")
    assert "watch" in reply.body["message"]
    entry = env.penv.secret_store.get(PHONE)
    assert (entry.secret_b64, entry.label, entry.user_id) == (old, label, bound_to)
    assert env.penv.offer_store.state_of(offer.offer_id)[0] == "open"
    assert env.penv.logbook == []


def test_a_new_id_does_not_collect_the_old_watches_of_a_forgotten_phone(env) -> None:
    """Watches that named a phone are bound through it only while that phone
    is still here; a redeem may name any id it likes."""
    env.penv.secret_store.register(
        "old-watch", base64.b64encode(b"w" * 32).decode(), "watch-self-provision",
        owner_iphone_id=PHONE,
    )
    assert _redeem(env, _redeem_body(env, _offer(env))).status == 200
    assert env.penv.secret_store.get("old-watch").user_id is None


def test_replacing_a_phone_that_was_here_binds_the_watches_that_named_it(env) -> None:
    old = base64.b64encode(b"o" * 32).decode()
    env.penv.secret_store.register(PHONE, old, "iphone-self-provision")
    env.penv.secret_store.register(
        "old-watch", base64.b64encode(b"w" * 32).decode(), "watch-self-provision",
        owner_iphone_id=PHONE,
    )
    assert _redeem(env, _redeem_body(env, _offer(env, replace=True))).status == 200
    assert env.penv.secret_store.get("old-watch").user_id == "chen"


@pytest.mark.parametrize(
    ("change", "status", "code"),
    [
        ({"offer_id": None}, 400, "invalid_request"),
        ({"offer_id": "abc"}, 400, "invalid_request"),
        ({"offer_id": 7}, 400, "invalid_request"),
        ({"device_id": None}, 400, "invalid_watch_id"),
        ({"device_id": "library"}, 400, "invalid_watch_id"),
        ({"device_id": "i" * 129}, 400, "invalid_watch_id"),
        ({"device_name": "n" * 257}, 400, "invalid_field"),
        ({"app_version": "v" * 257}, 400, "invalid_field"),
        ({"app_build": "b" * 257}, 400, "invalid_field"),
        ({"model": "m" * 257}, 400, "invalid_field"),
        ({"model": 5}, 400, "invalid_field"),
    ],
)
def test_bad_fields_are_400_before_the_offer_is_touched(env, change, status, code) -> None:
    offer = _offer(env)
    body = {**_redeem_body(env, offer), **change}
    body = {key: value for key, value in body.items() if value is not None}
    reply = _redeem(env, body)
    assert (reply.status, reply.body["ok"], reply.body["error"]) == (status, False, code)
    assert isinstance(reply.body["message"], str)
    assert env.penv.offer_store.state_of(offer.offer_id)[0] == "open"


@pytest.mark.parametrize("payload", [["a list"], ValueError("bad json")])
def test_a_body_that_is_not_an_object_is_400(env, payload) -> None:
    reply = _redeem(env, payload)
    assert (reply.status, reply.body["error"]) == (400, "invalid_request")


def test_503_while_not_loaded_or_without_an_instance_id(env) -> None:
    offer = _offer(env)
    body = _redeem_body(env, offer)
    env.instance.value = None
    assert (_redeem(env, body).status, _redeem(env, body).body["error"]) == (503, "unavailable")
    assert env.penv.offer_store.state_of(offer.offer_id)[0] == "open"
    env.penv.hass.data.clear()
    assert _redeem(env, body).status == 503


def test_the_token_never_reaches_the_log(env, caplog) -> None:
    offer = _offer(env)
    token_hex = offer.token.hex()
    with caplog.at_level(logging.DEBUG):
        _redeem(env, _redeem_body(env, offer))
    logged = "\n".join(r.getMessage() for r in caplog.records)
    assert token_hex not in logged
    assert offer.offer_id not in logged
    assert base64.b64encode(NEW_SECRET).decode() not in logged


# ── rekey ────────────────────────────────────────────────────────────────


OLD_SECRET = bytes(range(200, 232))


class _Ctx:
    """What ``_op_rekey`` reads, and a ``signed_json`` that notes the key it
    signed with at the moment it signed."""

    def __init__(self, env, payload: Any, *, watch_id: str = PHONE, secret: bytes = OLD_SECRET):
        self.hass = env.penv.hass
        self.domain_data = env.penv.hass.data[DOMAIN]
        self.payload = payload
        self.watch_id = watch_id
        self.secret_bytes = secret
        self.op = "rekey"

    def signed_json(self, body: dict, status: int = 200) -> Any:
        return types.SimpleNamespace(
            status=status, body=json.loads(json.dumps(body)), signed_with=self.secret_bytes
        )


def _rekey(env, payload: Any, **kw: Any) -> Any:
    return asyncio.run(env.rekey(_Ctx(env, payload, **kw)))


def _paired_phone(env) -> None:
    env.penv.secret_store.register(
        PHONE,
        base64.b64encode(OLD_SECRET).decode(),
        "iphone-self-provision",
        app_version="3.1.0",
        device_name="Phone",
        user_id="chen",
    )


def test_rekey_swaps_the_secret_and_keeps_everything_else(env) -> None:
    _paired_phone(env)
    before = env.penv.secret_store.get(PHONE)
    sealed = env.sealed.seal(OLD_SECRET, PHONE, "rekey", NEW_SECRET)
    reply = _rekey(env, {"sealed": sealed})
    assert (reply.status, reply.body) == (200, {"ok": True})
    # Signed with the new secret, so the phone knows the swap landed.
    assert reply.signed_with == NEW_SECRET

    after = env.penv.secret_store.get(PHONE)
    assert after.secret_bytes == NEW_SECRET
    assert base64.b64decode(after.secret_b64) == NEW_SECRET
    for name in ("label", "user_id", "device_name", "app_version", "owner_iphone_id", "algo"):
        assert getattr(after, name) == getattr(before, name), name
    assert env.penv.logbook == [
        ("reprovisioned", {"watch_id": PHONE, "label": "iphone-self-provision", "app_version": "3.1.0"})
    ]
    # Saved through the store.
    saved = env.penv.secret_store._store.saved["secrets"][PHONE]
    assert base64.b64decode(saved["secret_b64"]) == NEW_SECRET


def test_the_new_secret_is_on_disk_before_the_reply_is_signed_with_it(env) -> None:
    """The phone drops its old key once the reply verifies under the new
    one. A debounced save would leave a window in which a crash brings Home
    Assistant back on the old key with the phone holding only the new."""
    _paired_phone(env)
    file = env.penv.secret_store._store
    assert file.saved_now == []
    on_disk_at_signing: list[list[bytes]] = []

    class _WatchingCtx(_Ctx):
        def signed_json(self, body: dict, status: int = 200) -> Any:
            on_disk_at_signing.append(
                [base64.b64decode(data["secrets"][PHONE]["secret_b64"]) for data in file.saved_now]
            )
            return super().signed_json(body, status)

    sealed = env.sealed.seal(OLD_SECRET, PHONE, "rekey", NEW_SECRET)
    reply = asyncio.run(env.rekey(_WatchingCtx(env, {"sealed": sealed})))
    assert (reply.status, reply.signed_with) == (200, NEW_SECRET)
    assert on_disk_at_signing == [[NEW_SECRET]]


@pytest.mark.parametrize(
    "spoil", ["sealed with the new secret", "another op", "another id", "missing", "short"]
)
def test_a_rekey_box_that_does_not_open_changes_nothing(env, spoil) -> None:
    _paired_phone(env)
    sealed_box = env.sealed
    if spoil == "sealed with the new secret":
        payload = {"sealed": sealed_box.seal(NEW_SECRET, PHONE, "rekey", NEW_SECRET)}
    elif spoil == "another op":
        payload = {"sealed": sealed_box.seal(OLD_SECRET, PHONE, "client_certificate_put", NEW_SECRET)}
    elif spoil == "another id":
        payload = {"sealed": sealed_box.seal(OLD_SECRET, "iphone:other", "rekey", NEW_SECRET)}
    elif spoil == "missing":
        payload = {}
    else:
        payload = {"sealed": sealed_box.seal(OLD_SECRET, PHONE, "rekey", b"k" * 16)}
    reply = _rekey(env, payload)
    assert (reply.status, reply.body["ok"], reply.body["error"]) == (400, False, "bad_box")
    assert reply.signed_with == OLD_SECRET
    assert env.penv.secret_store.get(PHONE).secret_bytes == OLD_SECRET
    assert env.penv.logbook == []


def test_a_rekey_for_a_device_that_went_is_410(env) -> None:
    sealed = env.sealed.seal(OLD_SECRET, PHONE, "rekey", NEW_SECRET)
    reply = _rekey(env, {"sealed": sealed})
    assert reply.status == 410
    assert env.penv.secret_store.get(PHONE) is None


def test_the_old_secret_no_longer_signs_after_a_rekey(env) -> None:
    """The real validator over the real store: a request signed with the old
    secret is refused once the swap is made, and the new one is accepted."""
    _paired_phone(env)
    _rekey(env, {"sealed": env.sealed.seal(OLD_SECRET, PHONE, "rekey", NEW_SECRET)})
    hmac_mod = env.widget_hmac
    cache = hmac_mod.WANonceCache(ttl_seconds=90)

    def request(secret: bytes, nonce: str) -> Any:
        canonical = f"v2|verify_identity|{PHONE}|1000|{nonce}".encode() + b"\n{}"
        return types.SimpleNamespace(
            headers={
                "X-WA-Version": "2",
                "X-WA-Op": "verify_identity",
                "X-WA-Watch": PHONE,
                "X-WA-Ts": "1000",
                "X-WA-Nonce": nonce,
                "X-WA-Sig": hmac.new(secret, canonical, hashlib.sha256).hexdigest(),
            }
        )

    with pytest.raises(hmac_mod.WAHMACError, match="bad_signature"):
        hmac_mod.validate_wa_request(
            request(OLD_SECRET, "n1"), b"{}", env.penv.secret_store, cache, now=1000
        )
    validated = hmac_mod.validate_wa_request(
        request(NEW_SECRET, "n2"), b"{}", env.penv.secret_store, cache, now=1000
    )
    assert validated.watch_id == PHONE


# ── static ───────────────────────────────────────────────────────────────


def test_rekey_is_in_the_dispatch_table() -> None:
    source = _VIEWS.read_text()
    assert '"rekey": _op_rekey,' in source
