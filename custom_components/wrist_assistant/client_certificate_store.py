"""Each Home Assistant user's client certificate, kept so every watch can have it.

Step 4 of the phone watch link removal (``docs/phone_watch_link_removal_2026-10.md``
in the app repo). A home behind an mTLS proxy needs a client certificate on
every device that reaches it. Before this the phone sent its certificate to
its watch over WatchConnectivity, and a watch paired by code had none.
Now the phone hands it to Home Assistant and each watch fetches it here:

* ``client_certificate_put`` (a phone, after an import, at sign-in and at
  launch) stores the ``.p12`` bytes, its password and its fingerprint for
  the signer's bound user. The body is a sealed box (``sealed_box.py``).
* ``client_certificate_delete`` clears it after a removal on the phone.
* ``client_certificate_get`` (a watch) answers the record, the certificate
  sealed with the caller's own secret.
* Every delta reply names the bound user's revision as
  ``client_certificate`` once that user has a record, and a change wakes the
  parked polls of that user's devices (``DeltaCoordinator``).

The key is the Home Assistant user, not the device or the home: every
device a user pairs gets the same certificate, which is what one keychain
slot per device holds on the apps' side.

Per user the store keeps the ``.p12`` as base64, its password, the
fingerprint (SHA-256 of the whole ``.p12`` file as 64 lowercase hex digits,
as ``ClientCertificateStore.swift`` works it out, not of the leaf
certificate), a revision and when it changed. The revision only goes up: a
put of a new certificate and a delete of a held one each add one, and a
delete keeps the record with no certificate in it, so a watch polling for
the number sees the change and removes its copy. A put of the certificate
already held (same fingerprint) changes nothing.

The file is a private ``Store`` (owner read and write only), since it holds
a private key and the password that opens it. A file that cannot be read is
logged and left alone: every read and write is refused with ``unavailable``
until a restart reads it, so it is never saved over with an empty one.
Uninstalling the integration removes it.
"""

from __future__ import annotations

import base64
import binascii
import hashlib
import logging
import re
from collections.abc import Callable
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store

from .const import (
    CLIENT_CERTIFICATE_MAX_PKCS12_BYTES,
    CLIENT_CERTIFICATE_STORAGE_KEY,
    CLIENT_CERTIFICATE_STORAGE_VERSION,
)

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 1
FINGERPRINT_RE = re.compile(r"[0-9a-f]{64}")
# Base64 is four characters per three bytes; anything longer than a .p12 at
# the cap could encode to is refused before it is decoded.
MAX_PKCS12_BASE64_CHARS = (CLIENT_CERTIFICATE_MAX_PKCS12_BYTES + 2) // 3 * 4
# A password longer than this is not one a person typed.
MAX_PASSPHRASE_CHARS = 1024


class ClientCertificateError(Exception):
    """Base class; ``code`` is the stable reason the ops send back."""

    code = "error"

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class ClientCertificateInvalidError(ClientCertificateError):
    code = "invalid"


class ClientCertificateTooLargeError(ClientCertificateError):
    code = "too_large"


class ClientCertificateFingerprintError(ClientCertificateError):
    code = "fingerprint_mismatch"


class ClientCertificateUnreadableError(ClientCertificateError):
    """The .p12 does not open with the password, or holds no key and
    certificate."""

    code = "bad_pkcs12"


class ClientCertificateUnavailableError(ClientCertificateError):
    code = "unavailable"


def _now_iso() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def fingerprint(pkcs12: bytes) -> str:
    """SHA-256 of the whole .p12 file as 64 lowercase hex digits."""
    return hashlib.sha256(pkcs12).hexdigest()


@dataclass(frozen=True)
class ClientCertificate:
    """A certificate as handed over: the .p12 bytes, the password that opens
    them, and their fingerprint."""

    pkcs12: bytes
    passphrase: str
    fingerprint: str

    def as_wire_dict(self) -> dict[str, str]:
        """The plaintext a sealed box carries, in both directions."""
        return {
            "pkcs12": base64.b64encode(self.pkcs12).decode("ascii"),
            "passphrase": self.passphrase,
            "fingerprint": self.fingerprint,
        }


@dataclass(frozen=True)
class ClientCertificateRecord:
    """One user's record: the certificate, or None after a removal."""

    revision: int
    updated_at: str
    certificate: ClientCertificate | None

    @property
    def present(self) -> bool:
        return self.certificate is not None

    def as_storage_dict(self) -> dict[str, Any]:
        return {
            "revision": self.revision,
            "updated_at": self.updated_at,
            "certificate": (
                self.certificate.as_wire_dict() if self.certificate is not None else None
            ),
        }

    @classmethod
    def from_dict(cls, raw: Any) -> ClientCertificateRecord | None:
        """A stored record, or None when it is not one (it is then dropped)."""
        if not isinstance(raw, dict):
            return None
        revision, updated_at = raw.get("revision"), raw.get("updated_at")
        if (
            isinstance(revision, bool)
            or not isinstance(revision, int)
            or revision < 1
            or not isinstance(updated_at, str)
        ):
            return None
        stored = raw.get("certificate")
        if stored is None:
            return cls(revision=revision, updated_at=updated_at, certificate=None)
        try:
            certificate = parse_certificate(stored, check_fingerprint=True)
        except ClientCertificateError:
            return None
        return cls(revision=revision, updated_at=updated_at, certificate=certificate)


def parse_certificate(raw: Any, *, check_fingerprint: bool = True) -> ClientCertificate:
    """The certificate in ``{"pkcs12": <base64>, "passphrase": <string>,
    "fingerprint": <hex>}``, checked for shape, size and fingerprint. It does
    not try the password; :func:`check_opens` does that, off the event loop.
    """
    if not isinstance(raw, dict):
        raise ClientCertificateInvalidError("the certificate must be an object")
    encoded = raw.get("pkcs12")
    if not isinstance(encoded, str) or not encoded:
        raise ClientCertificateInvalidError("pkcs12 must be the .p12 file as base64 text")
    if len(encoded) > MAX_PKCS12_BASE64_CHARS:
        raise ClientCertificateTooLargeError(
            f"a .p12 is at most {CLIENT_CERTIFICATE_MAX_PKCS12_BYTES // 1024} KiB"
        )
    try:
        pkcs12 = base64.b64decode(encoded, validate=True)
    except (binascii.Error, ValueError) as err:
        raise ClientCertificateInvalidError("pkcs12 is not base64") from err
    if not pkcs12:
        raise ClientCertificateInvalidError("pkcs12 is empty")
    if len(pkcs12) > CLIENT_CERTIFICATE_MAX_PKCS12_BYTES:
        raise ClientCertificateTooLargeError(
            f"a .p12 is at most {CLIENT_CERTIFICATE_MAX_PKCS12_BYTES // 1024} KiB"
        )
    passphrase = raw.get("passphrase")
    if not isinstance(passphrase, str) or len(passphrase) > MAX_PASSPHRASE_CHARS:
        raise ClientCertificateInvalidError("passphrase must be a string")
    claimed = raw.get("fingerprint")
    if not isinstance(claimed, str) or not FINGERPRINT_RE.fullmatch(claimed):
        raise ClientCertificateInvalidError(
            "fingerprint must be 64 lowercase hex digits"
        )
    if check_fingerprint and fingerprint(pkcs12) != claimed:
        raise ClientCertificateFingerprintError(
            "the fingerprint is not the SHA-256 of the .p12 bytes"
        )
    return ClientCertificate(pkcs12=pkcs12, passphrase=passphrase, fingerprint=claimed)


def check_opens(certificate: ClientCertificate) -> None:
    """Refuse a .p12 that does not open with its password, or that holds no
    private key or no certificate (a watch could not answer a challenge with
    it). Blocking: run it in the executor."""
    from cryptography.hazmat.primitives.serialization import pkcs12 as pkcs12_mod

    # An empty password is tried both as no password and as the empty one,
    # since tools write a password-less .p12 either way.
    passwords: tuple[bytes | None, ...] = (
        (certificate.passphrase.encode("utf-8"),) if certificate.passphrase else (None, b"")
    )
    loaded = None
    for password in passwords:
        try:
            loaded = pkcs12_mod.load_key_and_certificates(certificate.pkcs12, password)
            break
        except (ValueError, TypeError):
            continue
    if loaded is None:
        raise ClientCertificateUnreadableError("the .p12 does not open with this password")
    key, cert, _chain = loaded
    if key is None or cert is None:
        raise ClientCertificateUnreadableError(
            "the .p12 must hold a private key and its certificate"
        )


class ClientCertificateStore:
    """Every user's client certificate record, keyed on the Home Assistant
    user id."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store: Store = Store(
            hass,
            CLIENT_CERTIFICATE_STORAGE_VERSION,
            CLIENT_CERTIFICATE_STORAGE_KEY,
            private=True,
        )
        self._users: dict[str, ClientCertificateRecord] = {}
        self._load_failed = False
        self._listeners: list[Callable[[str], None]] = []

    # ── persistence ────────────────────────────────────────────────────

    async def async_load(self) -> None:
        try:
            data = await self._store.async_load()
        except Exception:  # A damaged file: see the module docstring.
            _LOGGER.exception(
                "The client certificate file could not be read; it is left alone "
                "and refused until a restart reads it"
            )
            self._load_failed = True
            return
        users = data.get("users") if isinstance(data, dict) else None
        for user_id, raw in (users.items() if isinstance(users, dict) else ()):
            record = ClientCertificateRecord.from_dict(raw)
            if isinstance(user_id, str) and user_id and record is not None:
                self._users[user_id] = record
            else:
                _LOGGER.warning("Dropped an unreadable client certificate record")

    def _serialize(self) -> dict[str, Any]:
        return {
            "users": {
                user_id: record.as_storage_dict()
                for user_id, record in sorted(self._users.items())
            }
        }

    def _schedule_save(self) -> None:
        if self._load_failed:
            return
        self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)

    async def async_remove(self) -> None:
        """Delete the file. Called when the integration is removed."""
        self._users.clear()
        await self._store.async_remove()

    @property
    def available(self) -> bool:
        return not self._load_failed

    def _check_available(self) -> None:
        if self._load_failed:
            raise ClientCertificateUnavailableError(
                "the stored client certificates could not be read"
            )

    # ── listeners ──────────────────────────────────────────────────────

    @callback
    def async_add_listener(self, listener: Callable[[str], None]) -> Callable[[], None]:
        """Call ``listener(user_id)`` after every change of a user's record.
        Returns the unsubscribe."""
        self._listeners.append(listener)

        def _unsub() -> None:
            if listener in self._listeners:
                self._listeners.remove(listener)

        return _unsub

    def _notify(self, user_id: str) -> None:
        for listener in list(self._listeners):
            try:
                listener(user_id)
            except Exception:
                _LOGGER.exception("Client certificate listener failed")

    # ── reads ──────────────────────────────────────────────────────────

    def get(self, user_id: str | None) -> ClientCertificateRecord | None:
        """The user's record, or None when there is none."""
        self._check_available()
        if not user_id:
            return None
        return self._users.get(user_id)

    def revision(self, user_id: str | None) -> int | None:
        """The user's revision, or None with no record or no readable file
        (the delta reply then leaves the field out)."""
        if self._load_failed or not user_id:
            return None
        record = self._users.get(user_id)
        return record.revision if record is not None else None

    def diagnostics(self) -> dict[str, Any]:
        """Per user: present or not, the revision, when, and the first eight
        characters of the fingerprint. Never the bytes or the password."""
        if self._load_failed:
            return {"available": False, "users": {}}
        return {
            "available": True,
            "users": {
                user_id: {
                    "present": record.present,
                    "revision": record.revision,
                    "updated_at": record.updated_at,
                    "fingerprint_prefix": (
                        record.certificate.fingerprint[:8]
                        if record.certificate is not None
                        else None
                    ),
                }
                for user_id, record in sorted(self._users.items())
            },
        }

    # ── writes ─────────────────────────────────────────────────────────

    async def async_put(
        self, user_id: str, raw: Any
    ) -> tuple[ClientCertificateRecord, bool]:
        """Check and store a user's certificate. Returns the record and
        whether it changed. The .p12 is opened with its password in the
        executor before anything is stored; a refusal leaves the record as
        it was."""
        self._check_available()
        if not isinstance(user_id, str) or not user_id:
            raise ClientCertificateInvalidError("a user is required")
        certificate = parse_certificate(raw)
        await self._hass.async_add_executor_job(check_opens, certificate)
        current = self._users.get(user_id)
        if (
            current is not None
            and current.certificate is not None
            and current.certificate.fingerprint == certificate.fingerprint
        ):
            return current, False
        record = ClientCertificateRecord(
            revision=(current.revision if current is not None else 0) + 1,
            updated_at=_now_iso(),
            certificate=certificate,
        )
        self._users[user_id] = record
        self._schedule_save()
        self._notify(user_id)
        return record, True

    def delete(self, user_id: str) -> tuple[int, bool]:
        """Clear a user's certificate, keeping the record with a new revision.
        Returns the revision (0 with no record) and whether it changed."""
        self._check_available()
        current = self._users.get(user_id) if user_id else None
        if current is None:
            return 0, False
        if current.certificate is None:
            return current.revision, False
        record = ClientCertificateRecord(
            revision=current.revision + 1, updated_at=_now_iso(), certificate=None
        )
        self._users[user_id] = record
        self._schedule_save()
        self._notify(user_id)
        return record.revision, True
