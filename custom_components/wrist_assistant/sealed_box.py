"""A sealed box: a small payload encrypted for one signer.

Step 4 of the phone watch link removal (``docs/phone_watch_link_removal_2026-10.md``
in the app repo). The HMAC on a signed request or reply proves who sent it
but hides nothing, and the home address is often plain ``http://``. A client
certificate and its password must not cross that in the clear, so the
``client_certificate_put`` body and the ``client_certificate_get`` reply
carry it inside one of these. The Swift side is ``Shared/SealedBox.swift``
(CryptoKit ``HKDF<SHA256>`` and ``AES.GCM``) and must follow this byte for
byte.

The key
-------
HKDF-SHA256 (RFC 5869) with:

* input key material: the signer's own HMAC secret, as raw bytes. Those are
  exactly the bytes the request HMAC is keyed with:
  ``base64.b64decode(entry.secret_b64)`` for the signer's
  ``WidgetSecretEntry`` (``widget_secret_store.py``, cached there as
  ``secret_bytes``), which is the 32 random bytes the app generated and sent
  as base64 in ``secret_b64`` at ``register_secret`` or code pairing. Not the
  base64 text, not hex. In Swift, the same ``Data`` handed to
  ``SymmetricKey(data:)`` for ``HMAC<SHA256>``.
* The entry's ``algo`` does not enter the derivation. ``hmac-sha256`` is the
  only algo a secret can be registered with today, and it is checked to be
  32 bytes at registration. A future algo with a different key length would
  still feed its raw key bytes in here unchanged.
* salt: the ASCII bytes ``wrist-assistant-sealed-v1``.
* info: the signer id (the ``X-WA-Watch`` header the request was signed
  with) as UTF-8.
* output: 32 bytes, an AES-256 key.

The box
-------
AES-256-GCM with a 12 byte random nonce, a 16 byte tag, and the op name as
UTF-8 for associated data (``client_certificate_put`` on the way in,
``client_certificate_get`` on the way out), so a box made for one op does not
open as another.

The envelope is a JSON object::

    {"v": 1, "nonce": <base64 of the 12 nonce bytes>,
     "box": <base64 of the ciphertext followed by the 16 tag bytes>}

Base64 is the standard alphabet with ``=`` padding (Swift's
``base64EncodedString()``). In CryptoKit, ``box`` is
``sealedBox.ciphertext + sealedBox.tag``, and opening takes
``AES.GCM.SealedBox(nonce:ciphertext:tag:)`` with the last 16 bytes as the
tag. ``tests/fixtures/sealed_box_vector.json`` pins one worked example.

Two more keys, for pairing
--------------------------
Pairing has to hand a device its first secret, before there is any secret to
derive a key from. So the two pairing boxes use the same AES-256-GCM box but
key it differently, each with its own salt so no key of one kind can ever
equal a key of another. ``derive_key`` above is left exactly as it was.

*Code pairing, sealed* (``pair/start`` with ``public_key_b64``, then the
panel's confirm, then ``/v2/pair/status``). The device makes an X25519 key
pair and sends only the public half. On confirm the server makes the 32 byte
secret and a one-time X25519 key pair of its own, and seals the secret to the
device:

* input key material: ``X25519(server_private, device_public)``, the 32 byte
  shared secret (CryptoKit ``sharedSecretFromKeyAgreement``, then
  ``hkdfDerivedSymmetricKey`` with the same salt and info).
* salt: the ASCII bytes ``wrist-assistant-pair-v1``.
* info: the device's id (``watch_id`` in the request) as UTF-8.
* associated data: ``pair_secret``; plaintext: the 32 raw secret bytes.

The server's public half travels beside the box as
``server_public_key_b64`` (32 raw bytes, standard base64). The server keeps
no private half: it seals once and forgets it. ``seal_pair_secret`` and
``open_pair_secret``; the vector is ``tests/fixtures/pair_seal_vector.json``.

*QR offer* (``pair/offer`` in the panel, ``/v2/pair/redeem`` from the phone).
The QR code carries a 32 byte token; the phone makes the secret and seals it
with a key from the token, so the token itself never crosses the network:

* input key material: the 32 raw token bytes (the QR code's ``t`` is them as
  base64url without padding; decode that first).
* salt: the ASCII bytes ``wrist-assistant-offer-v1``.
* info: the phone's ``device_id`` as UTF-8.
* associated data: ``pair_redeem``; plaintext: the 32 raw secret bytes.

Its envelope is the ``{"v", "nonce", "box"}`` object above.
``seal_offer_secret`` and ``open_offer_secret``; the vector is
``tests/fixtures/offer_seal_vector.json``.

A re-key (the signed ``rekey`` op) needs nothing new: it is an ordinary box
from ``derive_key`` with the old secret and the op name ``rekey``.
"""

from __future__ import annotations

import base64
import binascii
import os
from typing import Any

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric.x25519 import (
    X25519PrivateKey,
    X25519PublicKey,
)
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.hkdf import HKDF

SEALED_BOX_VERSION = 1
SEALED_BOX_SALT = b"wrist-assistant-sealed-v1"
KEY_BYTES = 32
NONCE_BYTES = 12
TAG_BYTES = 16

# Code pairing, sealed: the X25519 box a confirmed request hands its device.
PAIR_SEAL_SALT = b"wrist-assistant-pair-v1"
PAIR_SEAL_AAD = "pair_secret"
# QR offer: the box the phone sends to /v2/pair/redeem.
OFFER_SEAL_SALT = b"wrist-assistant-offer-v1"
OFFER_SEAL_AAD = "pair_redeem"
X25519_KEY_BYTES = 32
# The size of the secret either pairing box carries (an hmac-sha256 key).
PAIRED_SECRET_BYTES = 32


class SealedBoxError(Exception):
    """The envelope is malformed or does not open with this key and op."""

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


def derive_key(secret: bytes, signer_id: str) -> bytes:
    """The AES-256 key for ``signer_id``'s boxes (see the module docstring)."""
    if not isinstance(secret, bytes | bytearray) or not secret:
        raise SealedBoxError("there is no secret to derive a key from")
    return HKDF(
        algorithm=hashes.SHA256(),
        length=KEY_BYTES,
        salt=SEALED_BOX_SALT,
        info=signer_id.encode("utf-8"),
    ).derive(bytes(secret))


def seal(
    secret: bytes,
    signer_id: str,
    op: str,
    plaintext: bytes,
    *,
    nonce: bytes | None = None,
) -> dict[str, Any]:
    """Seal ``plaintext`` for ``signer_id`` under ``op``. ``nonce`` is for the
    fixed test vector only: every real box takes a fresh random one."""
    return _seal_with_key(derive_key(secret, signer_id), op, plaintext, nonce=nonce)


def _seal_with_key(
    key: bytes, aad: str, plaintext: bytes, *, nonce: bytes | None = None
) -> dict[str, Any]:
    """The ``{"v", "nonce", "box"}`` envelope of ``plaintext`` under ``key``."""
    if nonce is None:
        nonce = os.urandom(NONCE_BYTES)
    if len(nonce) != NONCE_BYTES:
        raise SealedBoxError(f"the nonce must be {NONCE_BYTES} bytes")
    box = AESGCM(key).encrypt(nonce, plaintext, aad.encode("utf-8"))
    return {
        "v": SEALED_BOX_VERSION,
        "nonce": base64.b64encode(nonce).decode("ascii"),
        "box": base64.b64encode(box).decode("ascii"),
    }


def _b64(raw: Any, name: str, max_chars: int | None) -> bytes:
    if not isinstance(raw, str) or not raw:
        raise SealedBoxError(f"sealed.{name} must be base64 text")
    if max_chars is not None and len(raw) > max_chars:
        raise SealedBoxError(f"sealed.{name} is longer than {max_chars} characters")
    try:
        return base64.b64decode(raw, validate=True)
    except (binascii.Error, ValueError) as err:
        raise SealedBoxError(f"sealed.{name} is not base64") from err


def open_box(
    secret: bytes,
    signer_id: str,
    op: str,
    envelope: Any,
    *,
    max_box_chars: int | None = None,
) -> bytes:
    """The plaintext of ``envelope``, or :class:`SealedBoxError` when it is
    not an envelope of version 1, or does not open with this signer's key
    under this op (a wrong secret, a wrong signer id, a wrong op and a
    tampered box all look the same). ``max_box_chars`` refuses an oversized
    box before it is decoded."""
    nonce, box = _parse_envelope(envelope, max_box_chars)
    try:
        return AESGCM(derive_key(secret, signer_id)).decrypt(
            nonce, box, op.encode("utf-8")
        )
    except InvalidTag as err:
        raise SealedBoxError("the sealed box does not open with this device's secret") from err


def _parse_envelope(envelope: Any, max_box_chars: int | None) -> tuple[bytes, bytes]:
    """The nonce and box of a version 1 envelope, checked for shape only."""
    if not isinstance(envelope, dict):
        raise SealedBoxError("sealed must be an object")
    version = envelope.get("v")
    if isinstance(version, bool) or version != SEALED_BOX_VERSION:
        raise SealedBoxError(f"sealed.v must be {SEALED_BOX_VERSION}")
    nonce = _b64(envelope.get("nonce"), "nonce", 64)
    if len(nonce) != NONCE_BYTES:
        raise SealedBoxError(f"sealed.nonce must be {NONCE_BYTES} bytes")
    box = _b64(envelope.get("box"), "box", max_box_chars)
    if len(box) < TAG_BYTES:
        raise SealedBoxError("sealed.box is shorter than its tag")
    return nonce, box


# ── code pairing, sealed (X25519) ────────────────────────────────────────


def x25519_public_key(raw: Any) -> X25519PublicKey:
    """A device's X25519 public key from its 32 raw bytes, or
    :class:`SealedBoxError` when it is not one a box can be sealed to.

    Besides the length, a key of small order is refused: X25519 with one of
    those gives an all-zero shared secret whatever the server's key is, so a
    box sealed to it would open for anybody. The check is a trial exchange
    with a throwaway key, which is how the library reports that case.
    """
    if not isinstance(raw, bytes | bytearray) or len(raw) != X25519_KEY_BYTES:
        raise SealedBoxError(f"an X25519 public key is {X25519_KEY_BYTES} bytes")
    try:
        public = X25519PublicKey.from_public_bytes(bytes(raw))
        X25519PrivateKey.generate().exchange(public)
    except ValueError as err:
        raise SealedBoxError("that is not a usable X25519 public key") from err
    return public


def derive_pair_key(shared_secret: bytes, watch_id: str) -> bytes:
    """The AES-256 key of a sealed code pairing (see the module docstring):
    HKDF-SHA256 over the X25519 shared secret, salt ``wrist-assistant-pair-v1``,
    info the device id."""
    if not isinstance(shared_secret, bytes | bytearray) or not shared_secret:
        raise SealedBoxError("there is no shared secret to derive a key from")
    return HKDF(
        algorithm=hashes.SHA256(),
        length=KEY_BYTES,
        salt=PAIR_SEAL_SALT,
        info=watch_id.encode("utf-8"),
    ).derive(bytes(shared_secret))


def seal_pair_secret(
    device_public_key: bytes,
    watch_id: str,
    secret: bytes,
    *,
    server_private_key: bytes | None = None,
    nonce: bytes | None = None,
) -> dict[str, str]:
    """Seal a confirmed device's new secret to its X25519 public key.

    Returns ``{"server_public_key_b64", "nonce", "box"}``, what
    ``/v2/pair/status`` answers beside ``"state": "confirmed"``. A fresh
    server key pair is made for every box and its private half dropped on
    return. ``server_private_key`` and ``nonce`` are for the fixed test
    vector only.
    """
    device_public = x25519_public_key(device_public_key)
    server_private = (
        X25519PrivateKey.generate()
        if server_private_key is None
        else X25519PrivateKey.from_private_bytes(server_private_key)
    )
    shared = server_private.exchange(device_public)
    envelope = _seal_with_key(
        derive_pair_key(shared, watch_id), PAIR_SEAL_AAD, bytes(secret), nonce=nonce
    )
    return {
        "server_public_key_b64": base64.b64encode(
            server_private.public_key().public_bytes_raw()
        ).decode("ascii"),
        "nonce": envelope["nonce"],
        "box": envelope["box"],
    }


def open_pair_secret(device_private_key: bytes, watch_id: str, sealed: Any) -> bytes:
    """What the device does with a confirmed status reply: the secret inside,
    or :class:`SealedBoxError`. The server never calls this; it is here so the
    round trip and the vector are checked against the same code that seals."""
    if not isinstance(sealed, dict):
        raise SealedBoxError("sealed must be an object")
    server_public = x25519_public_key(
        _b64(sealed.get("server_public_key_b64"), "server_public_key_b64", 64)
    )
    nonce, box = _parse_envelope(
        {"v": SEALED_BOX_VERSION, "nonce": sealed.get("nonce"), "box": sealed.get("box")},
        None,
    )
    shared = X25519PrivateKey.from_private_bytes(device_private_key).exchange(server_public)
    try:
        return AESGCM(derive_pair_key(shared, watch_id)).decrypt(
            nonce, box, PAIR_SEAL_AAD.encode("utf-8")
        )
    except InvalidTag as err:
        raise SealedBoxError("the sealed box does not open with this device's key") from err


# ── QR offer ─────────────────────────────────────────────────────────────


def derive_offer_key(token: bytes, device_id: str) -> bytes:
    """The AES-256 key of a QR offer's redeem box (see the module docstring):
    HKDF-SHA256 over the raw token bytes, salt ``wrist-assistant-offer-v1``,
    info the phone's device id."""
    if not isinstance(token, bytes | bytearray) or not token:
        raise SealedBoxError("there is no token to derive a key from")
    return HKDF(
        algorithm=hashes.SHA256(),
        length=KEY_BYTES,
        salt=OFFER_SEAL_SALT,
        info=device_id.encode("utf-8"),
    ).derive(bytes(token))


def seal_offer_secret(
    token: bytes, device_id: str, secret: bytes, *, nonce: bytes | None = None
) -> dict[str, Any]:
    """What the phone sends as ``sealed`` to ``/v2/pair/redeem``. The server
    never calls this; it is the other half of ``open_offer_secret`` for the
    tests and the vector."""
    return _seal_with_key(
        derive_offer_key(token, device_id), OFFER_SEAL_AAD, bytes(secret), nonce=nonce
    )


def open_offer_secret(
    token: bytes, device_id: str, envelope: Any, *, max_box_chars: int | None = None
) -> bytes:
    """The secret inside a redeem box, or :class:`SealedBoxError` when the
    envelope is malformed or was not sealed with this offer's token for this
    device id (all of which look the same)."""
    nonce, box = _parse_envelope(envelope, max_box_chars)
    try:
        return AESGCM(derive_offer_key(token, device_id)).decrypt(
            nonce, box, OFFER_SEAL_AAD.encode("utf-8")
        )
    except InvalidTag as err:
        raise SealedBoxError("the sealed box does not open with this offer's token") from err
