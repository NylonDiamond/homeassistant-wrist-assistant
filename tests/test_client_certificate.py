"""In-process tests for the client certificate through Home Assistant (step 4
of the phone watch link removal, batch A).

The real ``sealed_box.py`` (round trip, the fixed vector the Swift side
copies, refusals), the real ``client_certificate_store.py`` over the
one-payload-per-key ``FakeStore`` of ``test_http_actions_store.py``, the
three signed ops pulled out of ``wa_v2_views.py`` by name, and the
``client_certificate`` revision on the delta poll with the in-process
coordinator of ``test_delta_coordinator_inprocess.py``. The ``.p12`` is a
real one made here with ``cryptography``, not a committed binary.

Static checks at the bottom: the ops in the dispatch table, the capability,
the setup wiring and the removal with the entry.
"""

from __future__ import annotations
import __future__

import ast
import asyncio
import base64
import contextlib
import functools
import hashlib
import hmac
import importlib.util
import json
import sys
import types
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any, ClassVar

import pytest
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.serialization import pkcs12
from cryptography.x509.oid import NameOID
from test_delta_coordinator_inprocess import _poll, coordinator  # noqa: F401
from test_http_actions_store import FakeStore
from test_page_images_store import FakeHass

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_VIEWS = _PKG_DIR / "wa_v2_views.py"
_VECTOR = Path(__file__).resolve().parent / "fixtures" / "sealed_box_vector.json"
_PKG = "wa_client_certificate_test_pkg"
KEY = "wrist_assistant.client_certificates"
MAX_P12 = 32 * 1024

USER = "user-jesse"
OTHER_USER = "user-guest"
PHONE = "iphone:phone-A"
WATCH = "0123456789abcdef0123456789abcdef"
PHONE_SECRET = bytes(range(32))
WATCH_SECRET = bytes(range(100, 132))
PASSWORD = "hunter2 ünïcode"


# ── a real .p12 ──────────────────────────────────────────────────────────


@functools.cache
def make_p12(password: str = PASSWORD, common_name: str = "wa-test", *, with_key: bool = True) -> bytes:
    """A self-signed EC certificate and its key as a .p12 locked with
    ``password`` (an empty one means no encryption)."""
    key = ec.generate_private_key(ec.SECP256R1())
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, common_name)])
    now = datetime.now(UTC)
    cert = (
        x509.CertificateBuilder()
        .subject_name(name)
        .issuer_name(name)
        .public_key(key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(now - timedelta(days=1))
        .not_valid_after(now + timedelta(days=30))
        .sign(key, hashes.SHA256())
    )
    encryption = (
        serialization.BestAvailableEncryption(password.encode())
        if password
        else serialization.NoEncryption()
    )
    return pkcs12.serialize_key_and_certificates(
        b"wa", key if with_key else None, cert, None, encryption
    )


def cert_body(p12: bytes | None = None, password: str = PASSWORD, fp: str | None = None) -> dict:
    p12 = make_p12() if p12 is None else p12
    return {
        "pkcs12": base64.b64encode(p12).decode(),
        "passphrase": password,
        "fingerprint": hashlib.sha256(p12).hexdigest() if fp is None else fp,
    }


# ── loading ──────────────────────────────────────────────────────────────


class PrivateStore(FakeStore):
    """``FakeStore`` that also notes whether each key was opened private."""

    private: ClassVar[dict[str, bool]] = {}

    def __init__(self, hass: object, version: int, key: str, *args: object, **kwargs: object) -> None:
        super().__init__(hass, version, key)
        PrivateStore.private[key] = bool(kwargs.get("private"))


def _stub(name: str, **attrs: object) -> None:
    module = sys.modules.get(name) or types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module


def _load_into_pkg(name: str):
    spec = importlib.util.spec_from_file_location(f"{_PKG}.{name}", _PKG_DIR / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[f"{_PKG}.{name}"] = module
    spec.loader.exec_module(module)
    return module


@contextlib.contextmanager
def loaded_package():
    """The real ``const``, ``sealed_box``, ``client_certificate_store`` and
    ``watch_logs_store`` over stubbed Home Assistant modules. Dropped after."""
    saved = dict(sys.modules)
    FakeStore.files, FakeStore.writes, FakeStore.removed = {}, [], []
    FakeStore.unreadable = set()
    FakeStore.deferred, FakeStore.pending = False, {}
    PrivateStore.private = {}
    try:
        _stub("homeassistant")
        _stub("homeassistant.helpers")
        _stub("homeassistant.helpers.storage", Store=PrivateStore)
        _stub(
            "homeassistant.core",
            HomeAssistant=type("HomeAssistant", (), {}),
            callback=lambda f: f,
        )
        pkg = types.ModuleType(_PKG)
        pkg.__path__ = []
        sys.modules[_PKG] = pkg
        const = _load_into_pkg("const")
        sealed = _load_into_pkg("sealed_box")
        store_mod = _load_into_pkg("client_certificate_store")
        logs_mod = _load_into_pkg("watch_logs_store")
        yield types.SimpleNamespace(
            const=const, sealed=sealed, store_mod=store_mod, logs_mod=logs_mod,
            load=_load_into_pkg,
        )
    finally:
        for key in list(sys.modules):
            if key not in saved:
                del sys.modules[key]
        sys.modules.update(saved)


@pytest.fixture
def pkg():
    with loaded_package() as loaded:
        yield loaded


def new_store(pkg, tmp_path: Path):
    store = pkg.store_mod.ClientCertificateStore(FakeHass(tmp_path))
    asyncio.run(store.async_load())
    return store


# ── the sealed box ───────────────────────────────────────────────────────


def _hkdf_by_hand(secret: bytes, info: bytes, salt: bytes, length: int = 32) -> bytes:
    """RFC 5869, written out, so the vector is not checked only against the
    library that made it."""
    prk = hmac.new(salt, secret, hashlib.sha256).digest()
    okm, block, counter = b"", b"", 1
    while len(okm) < length:
        block = hmac.new(prk, block + info + bytes([counter]), hashlib.sha256).digest()
        okm += block
        counter += 1
    return okm[:length]


def test_the_fixed_vector_seals_byte_for_byte(pkg) -> None:
    vector = json.loads(_VECTOR.read_text())
    secret = base64.b64decode(vector["secret_b64"])
    nonce = base64.b64decode(vector["nonce_b64"])
    plaintext = vector["plaintext_utf8"].encode("utf-8")
    assert vector["salt"] == "wrist-assistant-sealed-v1"
    key = pkg.sealed.derive_key(secret, vector["signer_id"])
    assert key.hex() == vector["key_hex"]
    assert key == _hkdf_by_hand(secret, vector["signer_id"].encode(), b"wrist-assistant-sealed-v1")
    envelope = pkg.sealed.seal(secret, vector["signer_id"], vector["op"], plaintext, nonce=nonce)
    assert envelope == vector["envelope"]
    # The box is AES-GCM's ciphertext followed by its 16 byte tag, with the op
    # as associated data, exactly as CryptoKit lays it out.
    box = base64.b64decode(envelope["box"])
    assert len(box) == len(plaintext) + 16
    assert AESGCM(key).decrypt(nonce, box, vector["op"].encode()) == plaintext
    assert pkg.sealed.open_box(secret, vector["signer_id"], vector["op"], envelope) == plaintext


def test_a_box_round_trips_with_a_fresh_nonce_each_time(pkg) -> None:
    one = pkg.sealed.seal(PHONE_SECRET, PHONE, "client_certificate_put", b"hello")
    two = pkg.sealed.seal(PHONE_SECRET, PHONE, "client_certificate_put", b"hello")
    assert one["v"] == 1 and len(base64.b64decode(one["nonce"])) == 12
    assert one["nonce"] != two["nonce"] and one["box"] != two["box"]
    for envelope in (one, two):
        assert pkg.sealed.open_box(PHONE_SECRET, PHONE, "client_certificate_put", envelope) == b"hello"


@pytest.mark.parametrize(
    ("secret", "signer", "op"),
    [
        (WATCH_SECRET, PHONE, "client_certificate_put"),
        (PHONE_SECRET, WATCH, "client_certificate_put"),
        (PHONE_SECRET, PHONE, "client_certificate_get"),
    ],
    ids=["wrong secret", "wrong signer id", "wrong op"],
)
def test_a_box_does_not_open_with_another_key_or_op(pkg, secret, signer, op) -> None:
    envelope = pkg.sealed.seal(PHONE_SECRET, PHONE, "client_certificate_put", b"hello")
    with pytest.raises(pkg.sealed.SealedBoxError, match="does not open"):
        pkg.sealed.open_box(secret, signer, op, envelope)


def test_a_tampered_box_does_not_open(pkg) -> None:
    envelope = pkg.sealed.seal(PHONE_SECRET, PHONE, "client_certificate_put", b"hello")
    box = bytearray(base64.b64decode(envelope["box"]))
    box[0] ^= 1
    envelope["box"] = base64.b64encode(bytes(box)).decode()
    with pytest.raises(pkg.sealed.SealedBoxError, match="does not open"):
        pkg.sealed.open_box(PHONE_SECRET, PHONE, "client_certificate_put", envelope)


@pytest.mark.parametrize(
    ("envelope", "message"),
    [
        (None, "sealed must be an object"),
        ({"v": 2, "nonce": "AAAAAAAAAAAAAAAA", "box": "AAAAAAAAAAAAAAAAAAAAAA=="}, "sealed.v must be 1"),
        ({"v": True, "nonce": "AAAAAAAAAAAAAAAA", "box": "AAAAAAAAAAAAAAAAAAAAAA=="}, "sealed.v must be 1"),
        ({"v": 1, "nonce": "AAAA", "box": "AAAAAAAAAAAAAAAAAAAAAA=="}, "sealed.nonce must be 12 bytes"),
        ({"v": 1, "nonce": "not base64!", "box": "AAAA"}, "sealed.nonce is not base64"),
        ({"v": 1, "nonce": "AAAAAAAAAAAAAAAA", "box": "AAAA"}, "shorter than its tag"),
        ({"v": 1, "nonce": "AAAAAAAAAAAAAAAA"}, "sealed.box must be base64 text"),
    ],
)
def test_a_malformed_envelope_is_refused(pkg, envelope, message) -> None:
    with pytest.raises(pkg.sealed.SealedBoxError, match=message):
        pkg.sealed.open_box(PHONE_SECRET, PHONE, "client_certificate_put", envelope)


def test_the_key_rule_is_spelled_out_where_swift_can_find_it() -> None:
    source = (_PKG_DIR / "sealed_box.py").read_text()
    assert "base64.b64decode(entry.secret_b64)" in source
    assert "``algo`` does not enter the derivation" in source
    assert 'SEALED_BOX_SALT = b"wrist-assistant-sealed-v1"' in source
    assert "tests/fixtures/sealed_box_vector.json" in source


# ── the store ────────────────────────────────────────────────────────────


def test_the_file_is_a_private_store(pkg, tmp_path) -> None:
    new_store(pkg, tmp_path)
    assert PrivateStore.private[KEY] is True


def test_a_put_stores_the_certificate_at_revision_one(pkg, tmp_path) -> None:
    store = new_store(pkg, tmp_path)
    body = cert_body()
    record, changed = asyncio.run(store.async_put(USER, body))
    assert changed is True and record.revision == 1 and record.present
    assert record.certificate.pkcs12 == make_p12()
    assert record.certificate.passphrase == PASSWORD
    assert store.revision(USER) == 1 and store.revision(OTHER_USER) is None
    assert FakeStore.files[KEY]["users"][USER] == {
        "revision": 1,
        "updated_at": record.updated_at,
        "certificate": body,
    }


def test_the_same_fingerprint_again_changes_nothing(pkg, tmp_path) -> None:
    store = new_store(pkg, tmp_path)
    seen: list[str] = []
    store.async_add_listener(seen.append)
    first, _ = asyncio.run(store.async_put(USER, cert_body()))
    writes = len(FakeStore.writes)
    again, changed = asyncio.run(store.async_put(USER, cert_body()))
    assert changed is False and again is first and again.revision == 1
    assert len(FakeStore.writes) == writes and seen == [USER]


def test_a_new_certificate_and_a_delete_each_add_one(pkg, tmp_path) -> None:
    store = new_store(pkg, tmp_path)
    seen: list[str] = []
    store.async_add_listener(seen.append)
    asyncio.run(store.async_put(USER, cert_body()))
    other = make_p12(common_name="wa-other")
    record, changed = asyncio.run(store.async_put(USER, cert_body(other)))
    assert changed and record.revision == 2 and record.certificate.pkcs12 == other
    assert store.delete(USER) == (3, True)
    held = store.get(USER)
    assert held.revision == 3 and held.present is False
    assert FakeStore.files[KEY]["users"][USER]["certificate"] is None
    # A second delete changes nothing; the revision never goes down.
    assert store.delete(USER) == (3, False)
    record, _ = asyncio.run(store.async_put(USER, cert_body()))
    assert record.revision == 4
    assert seen == [USER, USER, USER, USER]


def test_a_delete_with_no_record_changes_nothing(pkg, tmp_path) -> None:
    store = new_store(pkg, tmp_path)
    assert store.delete(USER) == (0, False)
    assert store.get(USER) is None and FakeStore.writes == []


def test_users_are_kept_apart(pkg, tmp_path) -> None:
    store = new_store(pkg, tmp_path)
    asyncio.run(store.async_put(USER, cert_body()))
    asyncio.run(store.async_put(OTHER_USER, cert_body(make_p12(common_name="guest"))))
    store.delete(OTHER_USER)
    assert store.get(USER).present and store.get(OTHER_USER).present is False


def test_records_survive_a_restart(pkg, tmp_path) -> None:
    store = new_store(pkg, tmp_path)
    record, _ = asyncio.run(store.async_put(USER, cert_body()))
    again = new_store(pkg, tmp_path).get(USER)
    assert again == record


@pytest.mark.parametrize(
    ("body", "code", "message"),
    [
        (None, "invalid", "must be an object"),
        ({**cert_body(), "pkcs12": ""}, "invalid", "pkcs12 must be"),
        ({**cert_body(), "pkcs12": "not base64!"}, "invalid", "pkcs12 is not base64"),
        ({**cert_body(), "passphrase": None}, "invalid", "passphrase must be a string"),
        ({**cert_body(), "fingerprint": "ABC"}, "invalid", "64 lowercase hex"),
        (cert_body(fp="0" * 64), "fingerprint_mismatch", "not the SHA-256"),
        (cert_body(password="wrong"), "bad_pkcs12", "does not open with this password"),
        (cert_body(b"\x30\x82" + b"\x00" * 64), "bad_pkcs12", "does not open"),
        (cert_body(make_p12(with_key=False)), "bad_pkcs12", "private key and its certificate"),
        (cert_body(b"\x00" * (MAX_P12 + 1)), "too_large", "at most 32 KiB"),
    ],
    ids=[
        "not an object", "empty", "not base64", "no password", "bad fingerprint",
        "fingerprint mismatch", "wrong password", "not a p12", "no key", "too big",
    ],
)
def test_a_refused_put_keeps_what_was_stored(pkg, tmp_path, body, code, message) -> None:
    store = new_store(pkg, tmp_path)
    record, _ = asyncio.run(store.async_put(USER, cert_body()))
    with pytest.raises(pkg.store_mod.ClientCertificateError, match=message) as exc:
        asyncio.run(store.async_put(USER, body))
    assert exc.value.code == code
    assert store.get(USER) is record


def test_exactly_32_kib_is_not_refused_for_size(pkg, tmp_path) -> None:
    store = new_store(pkg, tmp_path)
    with pytest.raises(pkg.store_mod.ClientCertificateError) as exc:
        asyncio.run(store.async_put(USER, cert_body(b"\x00" * MAX_P12)))
    assert exc.value.code == "bad_pkcs12"


def test_a_p12_with_no_password_opens_with_an_empty_one(pkg, tmp_path) -> None:
    store = new_store(pkg, tmp_path)
    p12 = make_p12(password="")
    record, changed = asyncio.run(store.async_put(USER, cert_body(p12, password="")))
    assert changed and record.certificate.passphrase == ""


def test_an_unreadable_file_is_refused_and_never_saved_over(pkg, tmp_path) -> None:
    FakeStore.files[KEY] = {"users": {USER: "kept as it is"}}
    FakeStore.unreadable.add(KEY)
    store = new_store(pkg, tmp_path)
    assert store.available is False and store.revision(USER) is None
    with pytest.raises(pkg.store_mod.ClientCertificateError) as exc:
        asyncio.run(store.async_put(USER, cert_body()))
    assert exc.value.code == "unavailable"
    with pytest.raises(pkg.store_mod.ClientCertificateError):
        store.delete(USER)
    assert FakeStore.files[KEY] == {"users": {USER: "kept as it is"}}
    assert store.diagnostics() == {"available": False, "users": {}}


def test_a_record_on_disk_that_is_not_one_is_dropped(pkg, tmp_path) -> None:
    good = {"revision": 2, "updated_at": "2026-10-06T10:00:00Z", "certificate": cert_body()}
    FakeStore.files[KEY] = {
        "users": {
            USER: good,
            "cleared": {**good, "certificate": None},
            "bad-fp": {**good, "certificate": cert_body(fp="1" * 64)},
            "rev-zero": {**good, "revision": 0},
            "no-time": {**good, "updated_at": None},
        }
    }
    store = new_store(pkg, tmp_path)
    assert store.revision(USER) == 2
    assert store.revision("cleared") == 2 and store.get("cleared").present is False
    for user in ("bad-fp", "rev-zero", "no-time"):
        assert store.get(user) is None


def test_diagnostics_show_presence_revision_and_eight_characters(pkg, tmp_path) -> None:
    store = new_store(pkg, tmp_path)
    record, _ = asyncio.run(store.async_put(USER, cert_body()))
    asyncio.run(store.async_put(OTHER_USER, cert_body(make_p12(common_name="g"))))
    store.delete(OTHER_USER)
    diag = store.diagnostics()
    assert diag["users"][USER] == {
        "present": True,
        "revision": 1,
        "updated_at": record.updated_at,
        "fingerprint_prefix": record.certificate.fingerprint[:8],
    }
    assert diag["users"][OTHER_USER]["present"] is False
    assert diag["users"][OTHER_USER]["fingerprint_prefix"] is None
    text = json.dumps(diag)
    assert PASSWORD not in text and cert_body()["pkcs12"][:16] not in text
    assert record.certificate.fingerprint not in text


def test_async_remove_deletes_the_file(pkg, tmp_path) -> None:
    store = new_store(pkg, tmp_path)
    asyncio.run(store.async_put(USER, cert_body()))
    asyncio.run(pkg.store_mod.ClientCertificateStore(FakeHass(tmp_path)).async_remove())
    assert KEY not in FakeStore.files and FakeStore.removed == [KEY]


# ── the signed ops ───────────────────────────────────────────────────────


_OP_NAMES = (
    "_client_certificate_refusal",
    "_client_certificate_gate",
    "_op_client_certificate_put",
    "_op_client_certificate_delete",
    "_op_client_certificate_get",
)


class _Response:
    def __init__(self, status: int, body: Any) -> None:
        self.status = status
        self.body = body


class _Ctx:
    def __init__(
        self,
        domain_data: Any,
        op: str,
        payload: dict,
        *,
        watch_id: str = PHONE,
        secret: bytes = PHONE_SECRET,
        user_id: str | None = USER,
        body: bytes | None = None,
    ) -> None:
        self.domain_data = domain_data
        self.op = op
        self.payload = payload
        self.watch_id = watch_id
        self.secret_bytes = secret
        self.user_id = user_id
        self.body = json.dumps(payload).encode() if body is None else body

    def signed_json(self, payload: dict, status: int = 200) -> _Response:
        # Through JSON, as the wire would: nothing in a reply may be bytes.
        return _Response(status, json.loads(json.dumps(payload)))


_FAKE_ORJSON = types.SimpleNamespace(
    loads=json.loads,
    dumps=lambda obj: json.dumps(obj, separators=(",", ":")).encode(),
    JSONDecodeError=json.JSONDecodeError,
)


def _ops(pkg, names: tuple[str, ...] = _OP_NAMES, prefix: str = "_CLIENT_CERTIFICATE_") -> dict[str, Any]:
    tree = ast.parse(_VIEWS.read_text(), filename=str(_VIEWS))
    wanted = [
        node
        for node in tree.body
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in names
    ]
    assert sorted(n.name for n in wanted) == sorted(names)
    wanted[:0] = [
        node
        for node in tree.body
        if isinstance(node, ast.Assign)
        and isinstance(node.targets[0], ast.Name)
        and node.targets[0].id.startswith(prefix)
    ]
    code = compile(
        ast.Module(body=wanted, type_ignores=[]),
        str(_VIEWS),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    namespace: dict[str, Any] = {
        "Any": Any,
        "Response": _Response,
        "_OpContext": object,
        "orjson": _FAKE_ORJSON,
        "ClientCertificateError": pkg.store_mod.ClientCertificateError,
        "SealedBoxError": pkg.sealed.SealedBoxError,
        "open_box": pkg.sealed.open_box,
        "seal": pkg.sealed.seal,
        "WatchLogsError": pkg.logs_mod.WatchLogsError,
        "WATCH_LOGS_MAX_BODY_BYTES": pkg.const.WATCH_LOGS_MAX_BODY_BYTES,
    }
    exec(code, namespace)  # noqa: S102
    return namespace


@pytest.fixture
def env(pkg, tmp_path):
    store = new_store(pkg, tmp_path)
    domain = types.SimpleNamespace(client_certificate_store=store)
    return types.SimpleNamespace(pkg=pkg, store=store, domain=domain, ops=_ops(pkg))


def call(env, name: str, payload: dict, **kw: Any) -> _Response:
    op = name.removeprefix("_op_")
    return asyncio.run(env.ops[name](_Ctx(env.domain, op, payload, **kw)))


def sealed_put(env, body: Any, *, secret: bytes = PHONE_SECRET, signer: str = PHONE,
               op: str = "client_certificate_put") -> dict:
    plaintext = json.dumps(body).encode()
    return {"sealed": env.pkg.sealed.seal(secret, signer, op, plaintext)}


def test_put_stores_the_sealed_certificate_for_the_bound_user(env) -> None:
    reply = call(env, "_op_client_certificate_put", sealed_put(env, cert_body()))
    fp = hashlib.sha256(make_p12()).hexdigest()
    assert (reply.status, reply.body) == (
        200, {"ok": True, "revision": 1, "changed": True, "fingerprint": fp}
    )
    assert env.store.get(USER).certificate.pkcs12 == make_p12()
    again = call(env, "_op_client_certificate_put", sealed_put(env, cert_body()))
    assert again.body == {"ok": True, "revision": 1, "changed": False, "fingerprint": fp}


def test_get_seals_the_certificate_with_the_caller_s_own_secret(env) -> None:
    call(env, "_op_client_certificate_put", sealed_put(env, cert_body()))
    reply = call(
        env, "_op_client_certificate_get", {}, watch_id=WATCH, secret=WATCH_SECRET
    )
    fp = hashlib.sha256(make_p12()).hexdigest()
    assert reply.status == 200
    assert {k: v for k, v in reply.body.items() if k != "sealed"} == {
        "ok": True, "revision": 1, "present": True, "fingerprint": fp,
    }
    opened = env.pkg.sealed.open_box(
        WATCH_SECRET, WATCH, "client_certificate_get", reply.body["sealed"]
    )
    assert json.loads(opened) == cert_body()
    # Not with the phone's secret, and not as the put's op.
    with pytest.raises(env.pkg.sealed.SealedBoxError):
        env.pkg.sealed.open_box(PHONE_SECRET, PHONE, "client_certificate_get", reply.body["sealed"])
    with pytest.raises(env.pkg.sealed.SealedBoxError):
        env.pkg.sealed.open_box(WATCH_SECRET, WATCH, "client_certificate_put", reply.body["sealed"])
    # The password never travels in the clear.
    assert PASSWORD not in json.dumps(reply.body)


def test_get_with_no_record_and_after_a_delete(env) -> None:
    reply = call(env, "_op_client_certificate_get", {})
    assert reply.body == {"ok": True, "revision": 0, "present": False}
    call(env, "_op_client_certificate_put", sealed_put(env, cert_body()))
    reply = call(env, "_op_client_certificate_delete", {})
    assert reply.body == {"ok": True, "revision": 2, "changed": True}
    reply = call(env, "_op_client_certificate_delete", {})
    assert reply.body == {"ok": True, "revision": 2, "changed": False}
    reply = call(env, "_op_client_certificate_get", {}, watch_id=WATCH, secret=WATCH_SECRET)
    assert reply.body == {"ok": True, "revision": 2, "present": False}


def test_a_device_of_another_user_does_not_see_the_certificate(env) -> None:
    call(env, "_op_client_certificate_put", sealed_put(env, cert_body()))
    reply = call(env, "_op_client_certificate_get", {}, user_id=OTHER_USER)
    assert reply.body == {"ok": True, "revision": 0, "present": False}


@pytest.mark.parametrize("name", ["_op_client_certificate_put", "_op_client_certificate_get",
                                  "_op_client_certificate_delete"])
def test_a_device_bound_to_no_user_is_a_signed_403(env, name) -> None:
    reply = call(env, name, sealed_put(env, cert_body()), user_id=None)
    assert reply.status == 403
    assert reply.body["ok"] is False and reply.body["error"] == "forbidden"
    assert env.store.get(USER) is None


@pytest.mark.parametrize("name", ["_op_client_certificate_put", "_op_client_certificate_get",
                                  "_op_client_certificate_delete"])
def test_no_store_or_an_unreadable_one_is_a_signed_503(env, name) -> None:
    env.domain.client_certificate_store = None
    reply = call(env, name, {})
    assert (reply.status, reply.body) == (
        503, {"ok": False, "error": "unavailable", "message": "integration not ready"}
    )
    env.store._load_failed = True
    env.domain.client_certificate_store = env.store
    assert call(env, name, {}).status == 503


@pytest.mark.parametrize(
    ("payload_of", "status", "code"),
    [
        (lambda env: {}, 400, "invalid"),
        (lambda env: {"sealed": "nope"}, 400, "invalid"),
        (lambda env: sealed_put(env, cert_body(), secret=WATCH_SECRET), 400, "invalid"),
        (lambda env: sealed_put(env, cert_body(), signer=WATCH), 400, "invalid"),
        (lambda env: sealed_put(env, cert_body(), op="client_certificate_get"), 400, "invalid"),
        (lambda env: {"sealed": env.pkg.sealed.seal(PHONE_SECRET, PHONE, "client_certificate_put", b"[1")}, 400, "invalid"),
        (lambda env: sealed_put(env, [1, 2]), 400, "invalid"),
        (lambda env: sealed_put(env, cert_body(fp="0" * 64)), 400, "fingerprint_mismatch"),
        (lambda env: sealed_put(env, cert_body(password="wrong")), 400, "bad_pkcs12"),
        (lambda env: sealed_put(env, cert_body(b"\x00" * (MAX_P12 + 1))), 413, "too_large"),
    ],
    ids=[
        "no sealed", "sealed not an object", "sealed with another secret",
        "sealed for another signer", "sealed for another op", "not JSON inside",
        "not an object inside", "fingerprint mismatch", "wrong password", "too big",
    ],
)
def test_put_refusals_are_signed_and_store_nothing(env, payload_of, status, code) -> None:
    reply = call(env, "_op_client_certificate_put", payload_of(env))
    assert reply.status == status
    assert reply.body["ok"] is False and reply.body["error"] == code
    assert isinstance(reply.body["message"], str) and reply.body["message"]
    assert env.store.get(USER) is None


def test_a_body_over_the_cap_is_refused_before_it_is_opened(env) -> None:
    reply = call(env, "_op_client_certificate_put", {"sealed": {}}, body=b"x" * (96 * 1024 + 1))
    assert reply.status == 413 and reply.body["error"] == "too_large"


def test_a_put_at_the_p12_cap_fits_under_the_body_cap(env) -> None:
    """A .p12 of exactly 32 KiB with a long password, base64 twice over,
    still gets past the body check to the .p12 check."""
    payload = sealed_put(env, cert_body(b"\x01" * MAX_P12, password="p" * 1024))
    assert len(json.dumps(payload)) < 96 * 1024
    reply = call(env, "_op_client_certificate_put", payload)
    assert reply.body["error"] == "bad_pkcs12"


# ── the delta poll ───────────────────────────────────────────────────────


def _bound(mapping: dict[str, str]):
    return lambda watch_id: mapping.get(watch_id)


def test_the_reply_names_the_bound_user_s_revision_once_there_is_a_record(
    coordinator, tmp_path  # noqa: F811
) -> None:
    _module, hass, coord = coordinator
    ent = "wrist_assistant.cc1"
    hass.states.set(ent, "off")
    with loaded_package() as loaded:
        store = new_store(loaded, tmp_path)

        async def run() -> None:
            _s, body = await _poll(coord, watch_id="w1", entities=[ent])
            assert "client_certificate" not in body
            coord.attach_client_certificate_store(store, _bound({"w1": USER, "w2": OTHER_USER}))
            _s, body = await _poll(coord, watch_id="w1", entities=[ent])
            assert "client_certificate" not in body
            await store.async_put(USER, cert_body())
            _s, body = await _poll(coord, watch_id="w1", entities=[ent])
            assert body["client_certificate"] == 1
            # Another user's device, and an unbound one, are not told.
            _s, body = await _poll(coord, watch_id="w2", entities=[ent])
            assert "client_certificate" not in body
            _s, body = await _poll(coord, watch_id="w3", entities=[ent])
            assert "client_certificate" not in body
            store.delete(USER)
            _s, body = await _poll(coord, watch_id="w1", entities=[ent])
            assert body["client_certificate"] == 2
            store._load_failed = True
            _s, body = await _poll(coord, watch_id="w1", entities=[ent])
            assert "client_certificate" not in body

        asyncio.run(run())


def test_a_change_wakes_only_that_user_s_parked_polls_once(coordinator, tmp_path) -> None:  # noqa: F811
    _module, hass, coord = coordinator
    ent = "wrist_assistant.cc2"
    hass.states.set(ent, "off")
    with loaded_package() as loaded:
        store = new_store(loaded, tmp_path)
        coord.attach_client_certificate_store(store, _bound({"w1": USER, "w2": OTHER_USER}))
        store.async_add_listener(coord.client_certificate_changed)

        async def run() -> None:
            _s, body = await _poll(coord, watch_id="w1", entities=[ent])
            c1 = body["next_cursor"]
            _s, body = await _poll(coord, watch_id="w2", entities=[ent])
            c2 = body["next_cursor"]
            mine = asyncio.create_task(
                _poll(coord, watch_id="w1", since=c1, entities=[ent], timeout=10)
            )
            theirs = asyncio.create_task(
                _poll(coord, watch_id="w2", since=c2, entities=[ent], timeout=1)
            )
            await asyncio.sleep(0.05)
            assert {"w1", "w2"} <= set(coord._waiters)
            started = hass.loop.time()
            # The phone's first hand-over: the user had no record before.
            await store.async_put(USER, cert_body())
            status, body = await asyncio.wait_for(mine, timeout=2)
            assert status == 200 and body["events"] == []
            assert body["client_certificate"] == 1
            assert hass.loop.time() - started < 1.0
            # The other user's poll stays parked and times out quietly.
            status, body = await asyncio.wait_for(theirs, timeout=3)
            assert status == 204 and body is None
            # Told once: the next poll parks and times out quietly.
            status, body = await asyncio.wait_for(
                _poll(coord, watch_id="w1", since=c1, entities=[ent], timeout=1), timeout=3
            )
            assert status == 204 and body is None
            # A delete wakes it again.
            held = asyncio.create_task(
                _poll(coord, watch_id="w1", since=c1, entities=[ent], timeout=10)
            )
            await asyncio.sleep(0.05)
            store.delete(USER)
            status, body = await asyncio.wait_for(held, timeout=2)
            assert status == 200 and body["client_certificate"] == 2

        asyncio.run(run())


def test_prune_forgets_the_certificate_revision_a_watch_was_told(coordinator, tmp_path) -> None:  # noqa: F811
    module, hass, coord = coordinator
    ent = "wrist_assistant.cc3"
    hass.states.set(ent, "off")
    with loaded_package() as loaded:
        store = new_store(loaded, tmp_path)
        coord.attach_client_certificate_store(store, _bound({"w1": USER}))

        async def run() -> None:
            await store.async_put(USER, cert_body())
            await _poll(coord, watch_id="w1", entities=[ent])
            assert coord._client_certificate_sent["w1"] == 1
            coord._sessions["w1"].last_seen -= module.SESSION_TTL + timedelta(seconds=1)
            coord._prune_sessions()
            assert "w1" not in coord._client_certificate_sent

        asyncio.run(run())


# ── static: dispatch, capability, setup, removal ─────────────────────────


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


def test_the_ops_are_in_the_dispatch_table() -> None:
    table = _op_table()
    assert table["client_certificate_put"] == "_op_client_certificate_put"
    assert table["client_certificate_get"] == "_op_client_certificate_get"
    assert table["client_certificate_delete"] == "_op_client_certificate_delete"


def test_the_client_certificate_capability_is_advertised() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    assert "register_capability(CLIENT_CERTIFICATE_CAPABILITY)" in init
    assert 'CLIENT_CERTIFICATE_CAPABILITY = "client_certificate"' in const
    assert f'CLIENT_CERTIFICATE_STORAGE_KEY = "{KEY}"' in const
    assert "CLIENT_CERTIFICATE_MAX_PKCS12_BYTES = 32 * 1024" in const


def test_setup_loads_the_store_and_attaches_it_to_the_poll() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    assert "await client_certificate_store.async_load()" in init
    assert (
        "coordinator.attach_client_certificate_store(client_certificate_store, _bound_user)"
        in init
    )
    assert (
        "client_certificate_store.async_add_listener(coordinator.client_certificate_changed)"
        in init
    )
    assert "client_certificate_store=client_certificate_store," in init


def test_the_file_goes_with_the_entry_but_not_with_a_device() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    assert "await ClientCertificateStore(hass).async_remove()" in init
    device_removal = init.split("async def async_remove_config_entry_device", 1)[1].split(
        "async def async_remove_entry", 1
    )[0]
    assert "client_certificate_store" not in device_removal


def test_the_readme_no_longer_says_the_certificate_comes_from_the_phone() -> None:
    readme = (_PKG_DIR.parents[1] / "README.md").read_text()
    assert "a second home and the mTLS certificate" not in readme
    assert "The phone hands it to Home Assistant" in readme
