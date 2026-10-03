"""Pending watch pairings, and the field rules every pairing obeys.

A watch can pair without the iPhone. It posts its id and a fresh secret to
the unauthenticated ``/v2/pair/start`` and gets back a short code. An admin
types that code into the panel, which looks the request up and confirms it
over the WebSocket (``pairing_ws.py``). Only the confirm writes the secret
into the widget secret store, bound to the admin who confirmed it. Until
then the pair signs nothing.

``PairRequestStore`` holds the requests in memory, modelled on
``StreamTokenStore``: one TTL for every entry, so insertion order is expiry
order, a hard cap, and an injectable clock. One request per watch id; a new
start for the same watch replaces the old one. A restart drops them all,
which only means the watch asks for a new code.

``validate_pair_fields`` is the one set of rules for the fields a pairing
carries. ``/v2/register_secret``, ``/v2/pair/start`` and the confirm all call
it, so the three can never disagree on what is accepted or on the error text.
"""

from __future__ import annotations

import base64
import math
import secrets
import time
from collections import OrderedDict
from collections.abc import Callable, Mapping
from dataclasses import dataclass
from typing import Any, NamedTuple

from .const import LIBRARY_OWNER_ID
from .widget_hmac import DEFAULT_HMAC_ALGO, SUPPORTED_HMAC_ALGOS

# The relay's Notifier pairing uses the same code: six characters with the
# look-alikes (0, O, 1, I) left out, so a code read off a watch face is
# typed right the first time.
PAIR_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
PAIR_CODE_LENGTH = 6
PAIR_REQUEST_TTL_SECONDS = 600
# How often the watch is told to check whether the code was confirmed.
PAIR_POLL_AFTER_SECONDS = 3

# Free-text fields the app reports about itself end up in logs, the device
# registry and the panel. Cap them so a bad client cannot stuff them.
REGISTER_ID_MAX_LEN = 128
REGISTER_TEXT_MAX_LEN = 256

# The fields /v2/pair/start reads. A watch pairing by code has no iPhone, so
# it never names an owner, and its label is set by the confirm.
PAIR_START_FIELDS = (
    "watch_id",
    "secret_b64",
    "algo",
    "device_name",
    "screen_size",
    "app_version",
    "app_build",
)


@dataclass(frozen=True)
class PairFields:
    """A pairing's fields after the checks, in the shape the store takes."""

    watch_id: str
    secret_b64: str
    label: str | None
    algo: str
    app_version: str | None
    app_build: str | None
    owner_iphone_id: str | None
    device_name: str | None
    screen_size: str | None


class PairFieldsError(NamedTuple):
    """Why a pairing's fields were refused.

    ``status`` and ``message`` are what the HTTP views answer; ``code`` is
    the WebSocket error code the confirm sends with the same message.
    """

    status: int
    message: str
    code: str


def validate_pair_fields(
    payload: Mapping[str, Any],
) -> tuple[PairFields, None] | tuple[None, PairFieldsError]:
    """Check a pairing's fields. Returns the fields or the first refusal."""
    watch_id = payload.get("watch_id")
    secret_b64 = payload.get("secret_b64")
    label = payload.get("label")
    # Optional. Older iOS builds don't send this; default to the v1 algo
    # so they keep working unchanged. Future builds opt into a new algo
    # by sending it here.
    algo = payload.get("algo", DEFAULT_HMAC_ALGO)
    # Diagnostic-only metadata for the per-device sensors. Older app builds
    # omit these: store None and the sensors render "unknown" until the
    # next provision call from an updated app.
    raw_app_version = payload.get("app_version")
    raw_app_build = payload.get("app_build")
    raw_owner_iphone_id = payload.get("owner_iphone_id")
    raw_device_name = payload.get("device_name")
    app_version = (
        raw_app_version if isinstance(raw_app_version, str) and raw_app_version else None
    )
    app_build = raw_app_build if isinstance(raw_app_build, str) and raw_app_build else None
    # `owner_iphone_id` links a watch entry to its paired iPhone entry so
    # HA's device tree shows the watches under their iPhone. Watches paired
    # by an older iOS build, or by code, omit it and root under the global
    # service device instead. iPhones never set this field on themselves.
    owner_iphone_id = (
        raw_owner_iphone_id
        if isinstance(raw_owner_iphone_id, str) and raw_owner_iphone_id
        else None
    )
    # User-visible device name (WKInterfaceDevice.name on watchOS,
    # UIDevice.name on iOS with the user-assigned-device-name entitlement).
    # Older builds omit it, and DeviceInfo falls back to `Watch <short_id>` /
    # `iPhone <short_id>`. Strip whitespace so "  " doesn't shadow the
    # fallback with an empty-looking name.
    device_name = (
        raw_device_name.strip()
        if isinstance(raw_device_name, str) and raw_device_name.strip()
        else None
    )
    # Screen size in points ("208x248"). The complication panel matches it
    # against its watch-case table so the preview dropdown defaults to this
    # watch's case. Older builds omit it and the panel keeps its 46 mm
    # reference default.
    raw_screen_size = payload.get("screen_size")
    screen_size = (
        raw_screen_size.strip()
        if isinstance(raw_screen_size, str) and raw_screen_size.strip()
        else None
    )

    if not isinstance(watch_id, str) or not watch_id:
        return None, PairFieldsError(400, "watch_id required", "invalid_watch_id")
    # The Library's owner id is not a device. A secret under it would let
    # whoever holds that secret pull, create and restore the home's Library
    # designs as if they were a watch's own.
    if watch_id == LIBRARY_OWNER_ID:
        return None, PairFieldsError(400, "watch_id is reserved", "invalid_watch_id")
    if len(watch_id) > REGISTER_ID_MAX_LEN or (
        owner_iphone_id is not None and len(owner_iphone_id) > REGISTER_ID_MAX_LEN
    ):
        return None, PairFieldsError(400, "watch_id too long", "invalid_watch_id")
    for field_name, value in (
        ("label", label),
        ("device_name", device_name),
        ("screen_size", screen_size),
        ("app_version", app_version),
        ("app_build", app_build),
    ):
        if isinstance(value, str) and len(value) > REGISTER_TEXT_MAX_LEN:
            return None, PairFieldsError(400, f"{field_name} too long", "invalid_field")
    if not isinstance(secret_b64, str) or not secret_b64:
        return None, PairFieldsError(400, "secret_b64 required", "invalid_secret")
    if not isinstance(algo, str) or algo not in SUPPORTED_HMAC_ALGOS:
        return None, PairFieldsError(
            400, f"algo must be one of: {sorted(SUPPORTED_HMAC_ALGOS)}", "invalid_algo"
        )

    try:
        secret_bytes = base64.b64decode(secret_b64, validate=True)
    except (ValueError, TypeError):
        return None, PairFieldsError(400, "secret_b64 is not valid base64", "invalid_secret")
    # Per-algo key-length check. Only sha256 is wired today; when adding a
    # new algo to `SUPPORTED_HMAC_ALGOS`, add its expected key length here
    # too. Silently accepting the wrong size would let a typo turn into a
    # very weak HMAC.
    if algo == "hmac-sha256" and len(secret_bytes) != 32:
        return None, PairFieldsError(
            400, "secret must be 32 bytes (256 bits) for hmac-sha256", "invalid_secret"
        )

    return (
        PairFields(
            watch_id=watch_id,
            secret_b64=secret_b64,
            label=label if isinstance(label, str) else None,
            algo=algo,
            app_version=app_version,
            app_build=app_build,
            owner_iphone_id=owner_iphone_id,
            device_name=device_name,
            screen_size=screen_size,
        ),
        None,
    )


def normalize_pair_code(code: str) -> str:
    """A code as typed, trimmed and upper-cased, for comparison."""
    return code.strip().upper()


def new_pair_code() -> str:
    """A fresh random code."""
    return "".join(secrets.choice(PAIR_CODE_ALPHABET) for _ in range(PAIR_CODE_LENGTH))


@dataclass
class PendingPair:
    """A watch waiting for an admin to confirm its code."""

    code: str
    fields: PairFields
    created_at: float
    expires_at: float

    @property
    def watch_id(self) -> str:
        return self.fields.watch_id


class PairRequestStore:
    """Bounded TTL store of pending pairings, keyed by code."""

    _MAX_ENTRIES = 64
    # A free code is found on the first try unless the generator is broken:
    # 64 entries out of 32^6 codes.
    _MAX_CODE_ATTEMPTS = 32

    def __init__(
        self,
        *,
        ttl_seconds: float = PAIR_REQUEST_TTL_SECONDS,
        clock: Callable[[], float] = time.time,
        code_factory: Callable[[], str] = new_pair_code,
    ) -> None:
        self._entries: OrderedDict[str, PendingPair] = OrderedDict()
        self._ttl = ttl_seconds
        self._clock = clock
        self._code_factory = code_factory

    def now(self) -> float:
        return self._clock()

    def start(self, fields: PairFields, *, now: float | None = None) -> PendingPair | None:
        """Store a pending pairing and return it, or None when the store is full.

        An earlier request for the same watch is replaced, so a watch that
        asks again is never refused by its own old code.
        """
        current = self._clock() if now is None else now
        self._evict_expired(current)
        for code, pending in list(self._entries.items()):
            if pending.watch_id == fields.watch_id:
                del self._entries[code]
        if len(self._entries) >= self._MAX_ENTRIES:
            return None
        for _ in range(self._MAX_CODE_ATTEMPTS):
            code = normalize_pair_code(self._code_factory())
            if code not in self._entries:
                break
        else:
            raise RuntimeError("could not find a free pairing code")
        pending = PendingPair(
            code=code,
            fields=fields,
            created_at=current,
            expires_at=current + self._ttl,
        )
        self._entries[code] = pending
        return pending

    def get(self, code: str, *, now: float | None = None) -> PendingPair | None:
        """The pending pairing for a code as typed, or None when unknown or expired."""
        current = self._clock() if now is None else now
        self._evict_expired(current)
        pending = self._entries.get(normalize_pair_code(code))
        if pending is None or pending.expires_at <= current:
            return None
        return pending

    def remove(self, code: str) -> bool:
        return self._entries.pop(normalize_pair_code(code), None) is not None

    def expires_in(self, pending: PendingPair, *, now: float | None = None) -> int:
        """Whole seconds left on a pending pairing, rounded up, never negative."""
        current = self._clock() if now is None else now
        return max(0, math.ceil(pending.expires_at - current))

    def __len__(self) -> int:
        return len(self._entries)

    def _evict_expired(self, now: float) -> None:
        # Every entry has the same TTL, so the head is always the oldest.
        while self._entries:
            code = next(iter(self._entries))
            if self._entries[code].expires_at > now:
                return
            self._entries.popitem(last=False)

    def shutdown(self) -> None:
        self._entries.clear()
