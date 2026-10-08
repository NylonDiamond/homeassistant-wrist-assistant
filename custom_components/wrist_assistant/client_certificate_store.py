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

Each record also says which path wrote it last (``source``): ``"panel"``
for the integration panel's own import (``client_certificate_ws.py``, over
the signed-in user's WebSocket), ``"iphone"`` for the phone's signed op. A
record saved before the field existed reads as ``"iphone"``. The panel is
now where a certificate is imported, and the phone's put is a migration path
only: once the panel has written a user's record (a certificate, or the
removal of one), a put or a delete from a phone changes nothing and is
answered as if it had been stored, so the phone stops trying. A put of the
same certificate from the panel over a phone's record takes it over without
a new revision, since the watches already hold it.

The file is a private ``Store`` (owner read and write only), since it holds
a private key and the password that opens it. A file that cannot be read is
logged and left alone: every read and write is refused with ``unavailable``
until a restart reads it, so it is never saved over with an empty one. A
file Home Assistant cannot decode is renamed by its ``Store`` and read as
nothing; that start is refused the same way, and the first start after it
counts new revisions from a saved floor above any a watch has seen (see
``ClientCertificateStore.async_load``). Uninstalling the integration removes
it.
"""

from __future__ import annotations

import base64
import binascii
import glob
import hashlib
import logging
import re
import time
from collections.abc import Callable
from dataclasses import dataclass, replace
from datetime import UTC, datetime
from pathlib import Path
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

# Which path wrote a record last.
SOURCE_PANEL = "panel"
SOURCE_IPHONE = "iphone"
_SOURCES = frozenset({SOURCE_PANEL, SOURCE_IPHONE})


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
    certificate.

    ``code`` stays ``bad_pkcs12`` for the signed ops. ``reason`` tells the
    cases apart for the panel: ``not_pkcs12`` (the bytes are not a PKCS#12
    file at all), ``bad_passphrase`` (they are, and the password does not
    open them) or ``no_key`` (it opens but lacks the key or the
    certificate)."""

    code = "bad_pkcs12"

    def __init__(self, message: str, reason: str) -> None:
        super().__init__(message)
        self.reason = reason


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
    """One user's record: the certificate, or None after a removal, and
    which path wrote it last (``SOURCE_PANEL`` or ``SOURCE_IPHONE``)."""

    revision: int
    updated_at: str
    certificate: ClientCertificate | None
    source: str = SOURCE_IPHONE

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
            "source": self.source,
        }

    @classmethod
    def from_dict(cls, raw: Any) -> ClientCertificateRecord | None:
        """A stored record, or None when it is not one (it is then dropped).

        A record whose revision and date read but whose certificate no
        longer does (a later build with a lower size cap, say) is kept with
        no certificate at its stored revision. Dropping it would start the
        user's next put at revision 1, below the number every watch already
        saw, and no watch would fetch it. Keeping the revision means the
        next put goes one above it. The revision does not move here: the
        watches keep the copy they hold until the user imports again."""
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
        # A record saved before the field existed came from a phone.
        source = raw.get("source")
        if source not in _SOURCES:
            source = SOURCE_IPHONE
        stored = raw.get("certificate")
        if stored is None:
            return cls(
                revision=revision, updated_at=updated_at, certificate=None, source=source
            )
        try:
            certificate = parse_certificate(stored, check_fingerprint=True)
        except ClientCertificateError as err:
            _LOGGER.warning(
                "A stored client certificate can no longer be read (%s); its "
                "record is kept at revision %d with no certificate",
                err,
                revision,
            )
            certificate = None
        return cls(
            revision=revision, updated_at=updated_at, certificate=certificate, source=source
        )


def _decode_pkcs12(encoded: Any) -> bytes:
    """The .p12 bytes of its base64 text, held to the size cap."""
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
    return pkcs12


def _check_passphrase(passphrase: Any) -> str:
    if not isinstance(passphrase, str) or len(passphrase) > MAX_PASSPHRASE_CHARS:
        raise ClientCertificateInvalidError("passphrase must be a string")
    return passphrase


def certificate_from_upload(encoded: Any, passphrase: Any) -> ClientCertificate:
    """The certificate the panel uploads: the .p12 as base64 and its
    password, checked for shape and size like :func:`parse_certificate`,
    with the fingerprint worked out here rather than taken from the caller.
    It does not try the password; :func:`check_opens` does that."""
    pkcs12 = _decode_pkcs12(encoded)
    return ClientCertificate(
        pkcs12=pkcs12,
        passphrase=_check_passphrase(passphrase),
        fingerprint=fingerprint(pkcs12),
    )


def parse_certificate(raw: Any, *, check_fingerprint: bool = True) -> ClientCertificate:
    """The certificate in ``{"pkcs12": <base64>, "passphrase": <string>,
    "fingerprint": <hex>}``, checked for shape, size and fingerprint. It does
    not try the password; :func:`check_opens` does that, off the event loop.
    """
    if not isinstance(raw, dict):
        raise ClientCertificateInvalidError("the certificate must be an object")
    pkcs12 = _decode_pkcs12(raw.get("pkcs12"))
    passphrase = _check_passphrase(raw.get("passphrase"))
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


def _der_length(data: bytes, offset: int) -> tuple[int | None, int] | None:
    """The DER length at ``offset`` and where its content starts, with None
    for BER's indefinite length; None when the bytes end first."""
    if offset >= len(data):
        return None
    first = data[offset]
    if first < 0x80:
        return first, offset + 1
    if first == 0x80:
        return None, offset + 1
    count = first & 0x7F
    if count > 4 or offset + 1 + count > len(data):
        return None
    return int.from_bytes(data[offset + 1 : offset + 1 + count], "big"), offset + 1 + count


def looks_like_pkcs12(data: bytes) -> bool:
    """Whether the bytes open as a PKCS#12 ``PFX``: a SEQUENCE spanning the
    whole file whose first element is the INTEGER 3 (RFC 7292). Only tells a
    wrong password from a file that is not a .p12 at all, since
    ``cryptography`` raises the same ``ValueError`` for both."""
    if len(data) < 5 or data[0] != 0x30:
        return False
    parsed = _der_length(data, 1)
    if parsed is None:
        return False
    length, start = parsed
    # A definite length must cover the file; BER's indefinite one is left
    # to the parser.
    if length is not None and start + length != len(data):
        return False
    return data[start : start + 3] == b"\x02\x01\x03"


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
        if not looks_like_pkcs12(certificate.pkcs12):
            raise ClientCertificateUnreadableError(
                "the file does not open: it is not a PKCS#12 (.p12) file", "not_pkcs12"
            )
        raise ClientCertificateUnreadableError(
            "the .p12 does not open with this password", "bad_passphrase"
        )
    key, cert, _chain = loaded
    if key is None or cert is None:
        raise ClientCertificateUnreadableError(
            "the .p12 must hold a private key and its certificate", "no_key"
        )


def _file_state(path: str) -> tuple[bool, bool]:
    """Whether the store's file is there, and whether a copy Home Assistant
    set aside as corrupt (``<file>.corrupt.<time>``) sits beside it. Run in
    the executor."""
    file = Path(path)
    if not file.parent.is_dir():
        return False, False
    set_aside = any(file.parent.glob(glob.escape(file.name) + ".corrupt.*"))
    return file.is_file(), set_aside


def _fresh_revision_floor() -> int:
    """A floor above any revision a watch can have seen before a corrupt
    file was set aside: the minutes since 1970. A revision goes up by one
    per import or removal, so a count that started at 1 never gets near it,
    and it stays well inside the 32-bit integer a watch reads it into."""
    return int(time.time() // 60)


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
        # Where a user with no record starts counting: 0, or a floor set
        # after Home Assistant set a corrupt file aside (see async_load).
        self._revision_floor = 0
        self._listeners: list[Callable[[str], None]] = []
        # Users whose phone was already told once that the panel's record
        # stays (see _kept_for_panel).
        self._kept_logged: set[str] = set()

    # ── persistence ────────────────────────────────────────────────────

    async def async_load(self) -> None:
        path = self._hass.config.path(".storage", CLIENT_CERTIFICATE_STORAGE_KEY)
        existed_before, _ = await self._async_file_state(path)
        try:
            data = await self._store.async_load()
        except Exception:  # A damaged file: see the module docstring.
            _LOGGER.exception(
                "The client certificate file could not be read; it is left alone "
                "and refused until a restart reads it"
            )
            self._load_failed = True
            return
        existed, set_aside = await self._async_file_state(path)
        if data is None and existed_before and not existed:
            # Home Assistant's Store answers None, rather than raising, for a
            # file it cannot decode: it renames the file to
            # ``<file>.corrupt.<time>`` and raises a repair. The file was
            # there before the load and is gone after it. Starting empty here
            # would hand out revision 1 to a user whose watches saw a higher
            # one, so this is refused like any unreadable file, which leaves
            # the user time to restore a backup.
            _LOGGER.error(
                "The client certificate file could not be decoded and was set "
                "aside by Home Assistant; certificates are refused until a "
                "restart"
            )
            self._load_failed = True
            return
        if isinstance(data, dict):
            floor = data.get("revision_floor")
            if isinstance(floor, int) and not isinstance(floor, bool) and floor > 0:
                self._revision_floor = floor
        elif data is None and set_aside:
            # The first start after the refusal above: the old records are
            # gone and their revisions with them. Every new record starts
            # above a floor no earlier revision can have reached, and the
            # floor is saved at once so it outlives the set-aside copy.
            self._revision_floor = _fresh_revision_floor()
            _LOGGER.warning(
                "The client certificate file was set aside as corrupt; new "
                "records start above revision %d so every watch fetches them",
                self._revision_floor,
            )
            self._schedule_save()
        users = data.get("users") if isinstance(data, dict) else None
        for user_id, raw in (users.items() if isinstance(users, dict) else ()):
            record = ClientCertificateRecord.from_dict(raw)
            if isinstance(user_id, str) and user_id and record is not None:
                self._users[user_id] = record
            else:
                _LOGGER.warning("Dropped an unreadable client certificate record")

    async def _async_file_state(self, path: str) -> tuple[bool, bool]:
        """``_file_state`` in the executor; a folder that cannot be listed
        reads as no file and nothing set aside."""
        try:
            return await self._hass.async_add_executor_job(_file_state, path)
        except OSError:
            return False, False

    def _serialize(self) -> dict[str, Any]:
        data: dict[str, Any] = {
            "users": {
                user_id: record.as_storage_dict()
                for user_id, record in sorted(self._users.items())
            }
        }
        if self._revision_floor:
            data["revision_floor"] = self._revision_floor
        return data

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

    def _kept_for_panel(self, user_id: str, source: str, action: str) -> ClientCertificateRecord | None:
        """The panel's record when a phone's write must leave it alone.
        Logged once per user until the panel's record changes."""
        if source != SOURCE_IPHONE:
            return None
        current = self._users.get(user_id)
        if current is None or current.source != SOURCE_PANEL:
            return None
        if user_id not in self._kept_logged:
            self._kept_logged.add(user_id)
            _LOGGER.info(
                "Kept the client certificate imported in the panel for user %s; "
                "a phone's %s changes nothing now (revision %d)",
                user_id,
                action,
                current.revision,
            )
        return current

    async def async_put(
        self, user_id: str, raw: Any, *, source: str = SOURCE_IPHONE
    ) -> tuple[ClientCertificateRecord, bool]:
        """Check and store a user's certificate as the signed op sends it.
        Returns the record and whether it changed. See
        :meth:`async_put_certificate`."""
        self._check_available()
        if not isinstance(user_id, str) or not user_id:
            raise ClientCertificateInvalidError("a user is required")
        kept = self._kept_for_panel(user_id, source, "put")
        if kept is not None:
            return kept, False
        return await self.async_put_certificate(
            user_id, parse_certificate(raw), source=source
        )

    async def async_put_certificate(
        self, user_id: str, certificate: ClientCertificate, *, source: str
    ) -> tuple[ClientCertificateRecord, bool]:
        """Store a user's certificate. Returns the record and whether it
        changed. The .p12 is opened with its password in the executor before
        anything is stored; a refusal leaves the record as it was.

        A phone's put over a record the panel wrote changes nothing and
        returns that record (see the module docstring). The same certificate
        again changes nothing, except that the panel takes over a phone's
        record of it: the source moves, the revision does not."""
        self._check_available()
        if not isinstance(user_id, str) or not user_id:
            raise ClientCertificateInvalidError("a user is required")
        if source not in _SOURCES:
            raise ClientCertificateInvalidError("unknown source")
        await self._hass.async_add_executor_job(check_opens, certificate)
        # Checked after the wait too: the panel may have written meanwhile.
        kept = self._kept_for_panel(user_id, source, "put")
        if kept is not None:
            return kept, False
        current = self._users.get(user_id)
        if (
            current is not None
            and current.certificate is not None
            and current.certificate.fingerprint == certificate.fingerprint
        ):
            if current.source == source:
                return current, False
            record = replace(current, source=source)
            self._users[user_id] = record
            self._kept_logged.discard(user_id)
            self._schedule_save()
            return record, False
        record = ClientCertificateRecord(
            revision=(current.revision if current is not None else self._revision_floor) + 1,
            updated_at=_now_iso(),
            certificate=certificate,
            source=source,
        )
        self._users[user_id] = record
        self._kept_logged.discard(user_id)
        self._schedule_save()
        self._notify(user_id)
        return record, True

    def delete(self, user_id: str, *, source: str = SOURCE_IPHONE) -> tuple[int, bool]:
        """Clear a user's certificate, keeping the record with a new revision.
        Returns the revision (0 with no record) and whether it changed. A
        phone's delete of a record the panel wrote changes nothing."""
        self._check_available()
        if source not in _SOURCES:
            raise ClientCertificateInvalidError("unknown source")
        current = self._users.get(user_id) if user_id else None
        if current is None:
            return 0, False
        if self._kept_for_panel(user_id, source, "delete") is not None:
            return current.revision, False
        if current.certificate is None:
            return current.revision, False
        record = ClientCertificateRecord(
            revision=current.revision + 1,
            updated_at=_now_iso(),
            certificate=None,
            source=source,
        )
        self._users[user_id] = record
        self._kept_logged.discard(user_id)
        self._schedule_save()
        self._notify(user_id)
        return record.revision, True
