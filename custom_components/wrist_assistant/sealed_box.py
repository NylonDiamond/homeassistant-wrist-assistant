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
"""

from __future__ import annotations

import base64
import binascii
import os
from typing import Any

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.hkdf import HKDF

SEALED_BOX_VERSION = 1
SEALED_BOX_SALT = b"wrist-assistant-sealed-v1"
KEY_BYTES = 32
NONCE_BYTES = 12
TAG_BYTES = 16


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
    if nonce is None:
        nonce = os.urandom(NONCE_BYTES)
    if len(nonce) != NONCE_BYTES:
        raise SealedBoxError(f"the nonce must be {NONCE_BYTES} bytes")
    box = AESGCM(derive_key(secret, signer_id)).encrypt(
        nonce, plaintext, op.encode("utf-8")
    )
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
    try:
        return AESGCM(derive_key(secret, signer_id)).decrypt(
            nonce, box, op.encode("utf-8")
        )
    except InvalidTag as err:
        raise SealedBoxError("the sealed box does not open with this device's secret") from err
