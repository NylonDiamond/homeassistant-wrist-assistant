"""Pending watch pairings, and the field rules every pairing obeys.

A watch can pair without the iPhone. It posts its id and a fresh secret to
the unauthenticated ``/v2/pair/start`` and gets back a short code. A user
types that code into the panel, which looks the request up and confirms it
over the WebSocket (``pairing_ws.py``). Only a confirmed pairing reaches the
widget secret store, bound to the user the confirmer picked. Until then the pair
signs nothing.

``PairRequestStore`` holds the requests in memory, modelled on
``StreamTokenStore``: one TTL for every entry, so insertion order is expiry
order, a hard cap, and an injectable clock. One request per watch id; a new
start for the same watch replaces the old one. Each request remembers the
address it came from, so one address can hold only a few at once and the
user sees where a code came from before confirming it. A restart drops
them all, which only means the watch asks for a new code.

``validate_pair_fields`` is the one set of rules for the fields a pairing
carries. ``/v2/register_secret``, ``/v2/pair/start``, the confirm and
``/v2/pair/redeem`` all call it, so they can never disagree on what is
accepted or on the error text.

Sealed code pairing
-------------------
A watch that sends its secret in ``pair/start`` sends it in the clear, and
over plain ``http://`` anyone on the network then holds a working key the
moment the user confirms. A device that knows better sends an X25519
``public_key_b64`` instead (``validate_pair_start``). The confirm then makes
the secret on the server and keeps a copy sealed to that key
(``sealed_box.seal_pair_secret``) for ten minutes; the device fetches it from
the unauthenticated ``/v2/pair/status``, which this store answers too
(``PairRequestStore.status``). Anybody may fetch it: only the holder of the
device's private key can open it. Nobody can throw it away either: while it
waits, a new start for the same id is refused (``ConfirmedPairWaiting``,
409 from the view). The old, clear form is still accepted from
a watch, so watches on older builds keep pairing.

The sealed confirm writes nothing to the secret store. It parks the pairing
with the box (``ParkedPairing``), and the first fetch of the box stores it.
The box lives only in memory, so a key stored at the confirm could be lost
with it (a restart, or a device that never fetched in time) and leave a
"paired" entry whose key nobody holds, which the next code for that device
would then have to Replace. The old form still stores at the confirm: its
device made the secret and holds it already.

``kind`` says what is pairing: ``"watch"`` (the default, and the only kind
an older build ever meant) or ``"iphone"``. A confirmed iPhone is stored with
the iPhone label, so it is an iPhone everywhere else. An iPhone must use the
sealed form; no build ever sent an iPhone's secret in the clear here, and
none should start.

QR offers
---------
``PairOfferStore`` holds the panel's QR offers for an iPhone
(``pairing_ws.py`` makes them, ``/v2/pair/redeem`` spends them). Each is a
32 byte random token the panel shows in a QR code, found again by
``sha256(token)`` as its ``offer_id``. The token stays in memory, never on
disk and never in a log, because the server needs it to open the box the
phone seals with a key derived from it. Five minutes, one use, at most 16
open. A spent or lapsed offer is remembered for a while without its token,
so the panel can still be told what became of it.
"""

from __future__ import annotations

import base64
import binascii
import hashlib
import ipaddress
import math
import re
import secrets
import time
from collections import OrderedDict
from collections.abc import Callable, Mapping
from dataclasses import dataclass, field
from typing import Any, NamedTuple
from urllib.parse import quote

from .const import LIBRARY_OWNER_ID
from .sealed_box import SealedBoxError, x25519_public_key
from .widget_hmac import DEFAULT_HMAC_ALGO, SUPPORTED_HMAC_ALGOS

# The relay's Notifier pairing uses the same code: six characters with the
# look-alikes (0, O, 1, I) left out, so a code read off a watch face is
# typed right the first time.
PAIR_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
PAIR_CODE_LENGTH = 6
PAIR_REQUEST_TTL_SECONDS = 600
# How often the watch is told to check whether the code was confirmed.
PAIR_POLL_AFTER_SECONDS = 3
# How long a confirmed sealed pairing's box waits for its device to fetch it.
PAIR_SEALED_COPY_TTL_SECONDS = 600

# What is pairing by code. Older builds send no kind and are always watches.
PAIR_KIND_WATCH = "watch"
PAIR_KIND_IPHONE = "iphone"
PAIR_KINDS = (PAIR_KIND_WATCH, PAIR_KIND_IPHONE)

# QR offers: a 32 byte token, five minutes, at most 16 open at once. A spent
# or lapsed offer is remembered this long after, without its token, so the
# panel's poll learns "redeemed" or "expired" rather than nothing.
PAIR_OFFER_TOKEN_BYTES = 32
PAIR_OFFER_TTL_SECONDS = 300
PAIR_OFFER_MAX_OPEN = 16
PAIR_OFFER_RETAIN_SECONDS = 600

# Free-text fields the app reports about itself end up in logs, the device
# registry and the panel. Cap them so a bad client cannot stuff them.
REGISTER_ID_MAX_LEN = 128
REGISTER_TEXT_MAX_LEN = 256

# The fields /v2/pair/start reads. A device pairing by code has no iPhone to
# name as its owner, and its label is set by the confirm from its kind.
PAIR_START_FIELDS = (
    "watch_id",
    "secret_b64",
    "public_key_b64",
    "kind",
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
    secret_b64: str | None
    """The device's secret as base64. None only for a sealed code pairing,
    whose secret the confirm makes; every path that writes the store has
    one by then."""
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
    *,
    secret_optional: bool = False,
) -> tuple[PairFields, None] | tuple[None, PairFieldsError]:
    """Check a pairing's fields. Returns the fields or the first refusal.

    ``secret_optional`` is for a pairing whose secret does not exist yet: a
    sealed ``pair/start`` and a redeem before its box is opened. With it an
    absent ``secret_b64`` gives ``PairFields.secret_b64`` None; one that is
    present is still checked in full.
    """
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
    no_secret_yet = secret_optional and secret_b64 is None
    if not no_secret_yet and (not isinstance(secret_b64, str) or not secret_b64):
        return None, PairFieldsError(400, "secret_b64 required", "invalid_secret")
    if not isinstance(algo, str) or algo not in SUPPORTED_HMAC_ALGOS:
        return None, PairFieldsError(
            400, f"algo must be one of: {sorted(SUPPORTED_HMAC_ALGOS)}", "invalid_algo"
        )

    if not no_secret_yet:
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


@dataclass(frozen=True)
class PairStart:
    """A ``pair/start`` after the checks."""

    fields: PairFields
    kind: str
    public_key: bytes | None
    """The device's raw 32 byte X25519 public key for a sealed pairing; None
    for the old form, whose secret is in ``fields.secret_b64``."""


def validate_pair_start(
    payload: Mapping[str, Any],
) -> tuple[PairStart, None] | tuple[None, PairFieldsError]:
    """Check a ``pair/start`` body. Returns the request or the first refusal.

    A body with no ``public_key_b64`` is the old form and goes through
    ``validate_pair_fields`` exactly as before, so its refusals still match
    ``register_secret``'s word for word. A body with one must not carry
    ``secret_b64`` as well (that would leave the clear copy on the wire the
    sealed form exists to keep off it), and its key must be one a box can be
    sealed to. ``kind: "iphone"`` must use the sealed form.
    """
    raw_kind = payload.get("kind")
    kind = PAIR_KIND_WATCH if raw_kind is None else raw_kind
    if not isinstance(kind, str) or kind not in PAIR_KINDS:
        return None, PairFieldsError(400, "kind must be watch or iphone", "invalid_kind")

    raw_public_key = payload.get("public_key_b64")
    if raw_public_key is None:
        if kind == PAIR_KIND_IPHONE:
            return None, PairFieldsError(
                400, "public_key_b64 required for an iPhone", "invalid_public_key"
            )
        fields, error = validate_pair_fields(payload)
        if error is not None:
            return None, error
        return PairStart(fields=fields, kind=kind, public_key=None), None

    if payload.get("secret_b64") is not None:
        return None, PairFieldsError(
            400, "send public_key_b64 or secret_b64, not both", "invalid_secret"
        )
    fields, error = validate_pair_fields(payload, secret_optional=True)
    if error is not None:
        return None, error
    bad_key = PairFieldsError(
        400, "public_key_b64 must be a 32-byte X25519 public key", "invalid_public_key"
    )
    if not isinstance(raw_public_key, str) or len(raw_public_key) > 64:
        return None, bad_key
    try:
        public_key = base64.b64decode(raw_public_key, validate=True)
        x25519_public_key(public_key)
    except (binascii.Error, ValueError, SealedBoxError):
        return None, bad_key
    return PairStart(fields=fields, kind=kind, public_key=public_key), None


# The ranges the panel's ``isPrivateAddress`` (frontend/src/watch-settings.ts)
# calls the home network. Kept the same so the confirm refuses exactly what
# the panel warns about.
_PRIVATE_NETWORKS = tuple(
    ipaddress.ip_network(net)
    for net in (
        "10.0.0.0/8",
        "172.16.0.0/12",
        "192.168.0.0/16",
        "127.0.0.0/8",
        "::1/128",
        "fe80::/10",
        "fc00::/7",
    )
)


def remote_is_public(remote: str | None) -> bool:
    """Whether a request's address (aiohttp's ``request.remote``) is outside
    the home network.

    10/8, 172.16/12, 192.168/16 and loopback for IPv4; loopback, link local
    and unique local for IPv6; an IPv4 address in IPv6 form counts as its
    IPv4 self. No address at all is not public: there is nothing to judge
    (the panel shows no warning for it either). Anything else that does not
    parse as an address is public, the careful answer.
    """
    if not isinstance(remote, str) or not remote.strip():
        return False
    text = remote.strip()
    if text.startswith("[") and text.endswith("]"):
        text = text[1:-1]
    try:
        address = ipaddress.ip_address(text.split("%", 1)[0])
    except ValueError:
        return True
    if isinstance(address, ipaddress.IPv6Address) and address.ipv4_mapped is not None:
        address = address.ipv4_mapped
    return not any(address in network for network in _PRIVATE_NETWORKS)


def offer_id_for(token: bytes) -> str:
    """An offer's id: ``sha256(token)`` as lower-case hex."""
    return hashlib.sha256(token).hexdigest()


def token_text(token: bytes) -> str:
    """The token as the QR code carries it: base64url with no padding."""
    return base64.urlsafe_b64encode(token).decode("ascii").rstrip("=")


def build_offer_url(
    *,
    instance_id: str,
    token: bytes,
    internal_url: str | None,
    external_url: str | None,
    cloud_url: str | None,
    home_name: str | None,
) -> str:
    """The ``wristassistant://pair#...`` link a QR offer shows.

    Everything is in the fragment, so the token never reaches a server log
    if the link is ever opened in a browser. The keys come in a fixed order,
    ``v``, ``i``, ``t``, ``u``, ``e``, ``c``, ``n``, each value
    percent-encoded with nothing left safe (a space is ``%20``, never ``+``),
    and an empty ``u``, ``e``, ``c`` or ``n`` is left out.
    """
    parts = [("v", "1"), ("i", instance_id), ("t", token_text(token))]
    for key, value in (("u", internal_url), ("e", external_url), ("c", cloud_url), ("n", home_name)):
        if isinstance(value, str) and value.strip():
            parts.append((key, value.strip()))
    fragment = "&".join(f"{key}={quote(value, safe='')}" for key, value in parts)
    return f"wristassistant://pair#{fragment}"


def normalize_pair_code(code: str) -> str:
    """A code as typed, for comparison: upper-cased, with every space and
    hyphen dropped, so ``abc-234`` and `` ABC 234 `` both read as ``ABC234``.
    """
    return re.sub(r"[\s-]+", "", code).upper()


def new_pair_code() -> str:
    """A fresh random code."""
    return "".join(secrets.choice(PAIR_CODE_ALPHABET) for _ in range(PAIR_CODE_LENGTH))


@dataclass
class PendingPair:
    """A watch waiting for a user to confirm its code."""

    code: str
    fields: PairFields
    created_at: float
    expires_at: float
    # The address the start came from (aiohttp's ``request.remote``), shown
    # to the user at lookup. None when the transport reports none.
    remote: str | None = None
    # Whether that address is outside the home network, or the request came
    # in through Home Assistant Cloud (whose requests can look local). The
    # confirm then needs ``allow_remote``.
    remote_public: bool = False
    kind: str = PAIR_KIND_WATCH
    # The device's X25519 public key for a sealed pairing, None for the old
    # form that carried its secret.
    public_key: bytes | None = None

    @property
    def watch_id(self) -> str:
        return self.fields.watch_id

    @property
    def sealed(self) -> bool:
        return self.public_key is not None


@dataclass
class ParkedPairing:
    """What a sealed confirm will write to the secret store, once its device
    fetches the box.

    The confirm decides everything (the fields with the new secret, the user
    to bind) but writes nothing: a key stored before its box is fetched is a
    key nobody may ever hold. ``/v2/pair/status`` writes it the first time
    it hands the box out (``pairing_ws.async_pair_status``).
    """

    fields: PairFields
    user_id: str | None
    taken: bool = False
    """Set by the first fetch, so only one fetch ever writes it."""
    result: str | None = None
    """The secret store's ``new``, ``rekey`` or ``idempotent`` once written."""


@dataclass
class SealedCopy:
    """A confirmed sealed pairing's box, waiting for its device to fetch it."""

    watch_id: str
    reply: dict[str, str]
    """``{"server_public_key_b64", "nonce", "box"}`` from
    ``sealed_box.seal_pair_secret``."""
    expires_at: float
    parked: ParkedPairing | None = None
    """The pairing to store on the first fetch. None for a copy made with
    nothing to store."""


class ConfirmedPairWaiting(Exception):
    """A start refused because a confirmed box still waits for this id.

    ``expires_in`` is the whole seconds until that box runs out, after which
    a start for the id is taken again.
    """

    def __init__(self, watch_id: str, expires_in: int) -> None:
        super().__init__(f"a confirmed pairing is waiting for {watch_id}")
        self.watch_id = watch_id
        self.expires_in = expires_in


class PairRequestStore:
    """Bounded TTL store of pending pairings, keyed by code, and of the
    sealed boxes of confirmed ones, keyed by watch id."""

    _MAX_ENTRIES = 64
    # One address may hold only this many requests at once, so a single
    # client cannot fill the whole store. A home rarely pairs more than one
    # watch at a time; behind a proxy that hides client addresses every
    # watch shares the proxy's, and four is still room enough.
    _MAX_PER_REMOTE = 4
    # A free code is found on the first try unless the generator is broken:
    # 64 entries out of 32^6 codes.
    _MAX_CODE_ATTEMPTS = 32

    def __init__(
        self,
        *,
        ttl_seconds: float = PAIR_REQUEST_TTL_SECONDS,
        sealed_ttl_seconds: float = PAIR_SEALED_COPY_TTL_SECONDS,
        clock: Callable[[], float] = time.time,
        code_factory: Callable[[], str] = new_pair_code,
    ) -> None:
        self._entries: OrderedDict[str, PendingPair] = OrderedDict()
        # Every copy has the same TTL from its confirm, so insertion order is
        # expiry order here as well.
        self._sealed: OrderedDict[str, SealedCopy] = OrderedDict()
        self._ttl = ttl_seconds
        self._sealed_ttl = sealed_ttl_seconds
        self._clock = clock
        self._code_factory = code_factory

    def now(self) -> float:
        return self._clock()

    def start(
        self,
        fields: PairFields,
        *,
        remote: str | None = None,
        remote_public: bool | None = None,
        kind: str = PAIR_KIND_WATCH,
        public_key: bytes | None = None,
        now: float | None = None,
    ) -> PendingPair | None:
        """Store a pending pairing and return it, or None when the store is
        full or ``remote`` already holds its share of requests.

        An earlier request for the same watch is replaced, and does not count
        against either cap, so a watch that asks again is never refused by
        its own old code. A refused start leaves the store as it was.

        ``remote_public`` defaults to what ``remote_is_public`` says of
        ``remote``; the view passes it when it knows more (a request through
        Home Assistant Cloud).

        While a confirmed sealed box waits for this watch id, a start is
        refused with ``ConfirmedPairWaiting`` and the store is left as it
        was. ``/v2/pair/start`` needs no sign-in and a watch id is not
        secret (it rides in the clear in every status poll), so anyone on
        the network could otherwise post a start for it and throw the box
        away before the device fetched it, and with it the pairing the user
        just confirmed.

        Refusing is safe for the apps. The watch and the iPhone both make a
        fresh key pair for every start and keep it only for that one flow,
        so no restart of theirs could ever open an older box, and none
        needs to throw one away: a device that still holds its key polls
        ``/v2/pair/status`` for the box rather than starting again. The cost
        is that a device which leaves the code screen between the user's
        confirm and its own fetch (a second or two at the usual poll rate)
        must wait out the box, at most ten minutes, before a new code.
        """
        current = self._clock() if now is None else now
        self._evict_expired(current)
        waiting = self._sealed.get(fields.watch_id)
        if waiting is not None and waiting.expires_at > current:
            raise ConfirmedPairWaiting(
                fields.watch_id, max(1, math.ceil(waiting.expires_at - current))
            )
        replaced = [
            code for code, pending in self._entries.items() if pending.watch_id == fields.watch_id
        ]
        if len(self._entries) - len(replaced) >= self._MAX_ENTRIES:
            return None
        same_remote = sum(
            1
            for pending in self._entries.values()
            if pending.remote == remote and pending.watch_id != fields.watch_id
        )
        if same_remote >= self._MAX_PER_REMOTE:
            return None
        for _ in range(self._MAX_CODE_ATTEMPTS):
            code = normalize_pair_code(self._code_factory())
            if code not in self._entries or code in replaced:
                break
        else:
            raise RuntimeError("could not find a free pairing code")
        for old_code in replaced:
            del self._entries[old_code]
        pending = PendingPair(
            code=code,
            fields=fields,
            created_at=current,
            expires_at=current + self._ttl,
            remote=remote,
            remote_public=remote_is_public(remote) if remote_public is None else remote_public,
            kind=kind,
            public_key=public_key,
        )
        self._entries[code] = pending
        return pending

    def confirm_sealed(
        self,
        pending: PendingPair,
        reply: dict[str, str],
        *,
        fields: PairFields | None = None,
        user_id: str | None = None,
        now: float | None = None,
    ) -> ParkedPairing | None:
        """Replace a confirmed sealed request with its box, kept for
        ``/v2/pair/status`` for ten minutes from now.

        ``fields`` (with the secret the box carries) and ``user_id`` are the
        pairing to store when the device first fetches the box; it is
        returned so the confirm can tell when that happened. If the box runs
        out, or Home Assistant restarts, before anyone fetches it, nothing
        was ever stored: the device asks for a new code, which needs no
        Replace for a device that was new, and a device that was paired
        before keeps the key it has.
        """
        current = self._clock() if now is None else now
        self._evict_expired(current)
        self._entries.pop(pending.code, None)
        self._sealed.pop(pending.watch_id, None)
        parked = ParkedPairing(fields=fields, user_id=user_id) if fields is not None else None
        self._sealed[pending.watch_id] = SealedCopy(
            watch_id=pending.watch_id,
            reply=dict(reply),
            expires_at=current + self._sealed_ttl,
            parked=parked,
        )
        while len(self._sealed) > self._MAX_ENTRIES:
            self._sealed.popitem(last=False)
        return parked

    def take_parked(self, watch_id: str, *, now: float | None = None) -> ParkedPairing | None:
        """The pairing a fetch of ``watch_id``'s box must store now, or None.

        None when there is no unexpired box, the box has nothing to store, or
        an earlier fetch took it already. The first call marks it taken, so
        two fetches never store it twice.
        """
        current = self._clock() if now is None else now
        self._evict_expired(current)
        copy = self._sealed.get(watch_id)
        if copy is None or copy.expires_at <= current:
            return None
        parked = copy.parked
        if parked is None or parked.taken:
            return None
        parked.taken = True
        return parked

    def status(
        self, watch_id: str, *, now: float | None = None
    ) -> tuple[str, dict[str, str] | None]:
        """What ``/v2/pair/status`` answers for a watch id.

        ``("pending", None)`` while a request waits for a user,
        ``("confirmed", box)`` while a confirmed sealed box waits for the
        device, and ``("expired", None)`` otherwise: a code that ran out, a
        box that ran out, an id never seen, and an old-form request that was
        confirmed (its device holds its secret already and polls
        ``verify_identity`` instead).
        """
        current = self._clock() if now is None else now
        self._evict_expired(current)
        if self.has_pending(watch_id, now=current):
            return "pending", None
        copy = self._sealed.get(watch_id)
        if copy is not None and copy.expires_at > current:
            return "confirmed", dict(copy.reply)
        return "expired", None

    def has_pending(self, watch_id: str, *, now: float | None = None) -> bool:
        """Whether a watch id has an unexpired request waiting for a confirm."""
        current = self._clock() if now is None else now
        self._evict_expired(current)
        return any(
            pending.watch_id == watch_id and pending.expires_at > current
            for pending in self._entries.values()
        )

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

    def age_seconds(self, pending: PendingPair, *, now: float | None = None) -> int:
        """Whole seconds since a pending pairing started, rounded down, never negative."""
        current = self._clock() if now is None else now
        return max(0, math.floor(current - pending.created_at))

    def __len__(self) -> int:
        return len(self._entries)

    def _evict_expired(self, now: float) -> None:
        # Every entry has the same TTL, so the head is always the oldest.
        while self._entries:
            code = next(iter(self._entries))
            if self._entries[code].expires_at > now:
                break
            self._entries.popitem(last=False)
        while self._sealed:
            watch_id = next(iter(self._sealed))
            if self._sealed[watch_id].expires_at > now:
                break
            self._sealed.popitem(last=False)

    def shutdown(self) -> None:
        self._entries.clear()
        self._sealed.clear()


# ── QR offers ────────────────────────────────────────────────────────────


OFFER_STATE_OPEN = "open"
OFFER_STATE_REDEEMED = "redeemed"
OFFER_STATE_EXPIRED = "expired"

_OFFER_ID_RE = re.compile(r"^[0-9a-f]{64}$")


def normalize_offer_id(offer_id: Any) -> str | None:
    """An offer id as sent, lower-cased, or None when it is not 64 hex digits."""
    if not isinstance(offer_id, str):
        return None
    text = offer_id.strip().lower()
    return text if _OFFER_ID_RE.match(text) else None


@dataclass
class PairOffer:
    """One QR offer the panel made for an iPhone."""

    offer_id: str
    token: bytes = field(repr=False)
    """The raw token. Emptied the moment the offer is redeemed."""
    user_id: str | None
    """Whose iPhone it is: the user the redeemed key is bound to."""
    admin_id: str | None
    """The user who made the offer, for the log and for ``offer_status`` /
    ``offer_cancel``, which show a non-administrator only their own. Named
    from when only an administrator could make one."""
    replace: bool
    """Whether a device id already bound to another user may be taken over."""
    created_at: float
    expires_at: float
    redeemed_at: float | None = None
    device_id: str | None = None
    device_name: str | None = None


class PairOfferStore:
    """Bounded store of QR offers, keyed by ``offer_id``.

    Memory only, like ``PairRequestStore``: a restart drops every offer and
    the panel shows a new one. At most ``PAIR_OFFER_MAX_OPEN`` may be open at
    once. A redeemed or lapsed offer stays for ``PAIR_OFFER_RETAIN_SECONDS``
    so the panel's poll learns what became of it; a redeemed one keeps no
    token, so it can never be spent twice.
    """

    # Every record, open or not. Past this the oldest closed ones go first.
    _MAX_RECORDS = 64

    def __init__(
        self,
        *,
        ttl_seconds: float = PAIR_OFFER_TTL_SECONDS,
        retain_seconds: float = PAIR_OFFER_RETAIN_SECONDS,
        max_open: int = PAIR_OFFER_MAX_OPEN,
        clock: Callable[[], float] = time.time,
        token_factory: Callable[[], bytes] = lambda: secrets.token_bytes(PAIR_OFFER_TOKEN_BYTES),
    ) -> None:
        self._offers: OrderedDict[str, PairOffer] = OrderedDict()
        self._ttl = ttl_seconds
        self._retain = retain_seconds
        self._max_open = max_open
        self._clock = clock
        self._token_factory = token_factory

    def now(self) -> float:
        return self._clock()

    def create(
        self,
        *,
        user_id: str | None,
        admin_id: str | None,
        replace: bool = False,
        now: float | None = None,
    ) -> PairOffer | None:
        """A new open offer, or None when ``PAIR_OFFER_MAX_OPEN`` are open."""
        current = self._clock() if now is None else now
        if self.open_count(now=current) >= self._max_open:
            return None
        token = self._token_factory()
        if not isinstance(token, bytes) or len(token) != PAIR_OFFER_TOKEN_BYTES:
            raise RuntimeError("the offer token factory must make 32 bytes")
        offer = PairOffer(
            offer_id=offer_id_for(token),
            token=token,
            user_id=user_id,
            admin_id=admin_id,
            replace=bool(replace),
            created_at=current,
            expires_at=current + self._ttl,
        )
        self._offers.pop(offer.offer_id, None)
        self._offers[offer.offer_id] = offer
        while len(self._offers) > self._MAX_RECORDS:
            closed = next(
                (
                    key
                    for key, kept in self._offers.items()
                    if self.state(kept, now=current) != OFFER_STATE_OPEN
                ),
                None,
            )
            if closed is None:
                break
            del self._offers[closed]
        return offer

    def get(self, offer_id: Any, *, now: float | None = None) -> PairOffer | None:
        """The record for an offer id in any state, or None when it is
        unknown, malformed, cancelled or long gone."""
        current = self._clock() if now is None else now
        self._evict(current)
        key = normalize_offer_id(offer_id)
        return None if key is None else self._offers.get(key)

    def state(self, offer: PairOffer, *, now: float | None = None) -> str:
        current = self._clock() if now is None else now
        if offer.redeemed_at is not None:
            return OFFER_STATE_REDEEMED
        if offer.expires_at > current:
            return OFFER_STATE_OPEN
        return OFFER_STATE_EXPIRED

    def state_of(self, offer_id: Any, *, now: float | None = None) -> tuple[str, PairOffer | None]:
        """What ``pair/offer_status`` answers: the state, and the record when
        there is one. An unknown or cancelled offer reads as expired."""
        current = self._clock() if now is None else now
        offer = self.get(offer_id, now=current)
        if offer is None:
            return OFFER_STATE_EXPIRED, None
        return self.state(offer, now=current), offer

    def redeem(
        self,
        offer: PairOffer,
        *,
        device_id: str,
        device_name: str | None,
        now: float | None = None,
    ) -> None:
        """Mark an offer spent and forget its token."""
        current = self._clock() if now is None else now
        offer.redeemed_at = current
        offer.device_id = device_id
        offer.device_name = device_name
        offer.token = b""

    def cancel(self, offer_id: Any) -> bool:
        """Drop an offer. True when it was still open."""
        key = normalize_offer_id(offer_id)
        if key is None:
            return False
        offer = self._offers.pop(key, None)
        return offer is not None and self.state(offer) == OFFER_STATE_OPEN

    def expires_in(self, offer: PairOffer, *, now: float | None = None) -> int:
        """Whole seconds left on an offer, rounded up, never negative."""
        current = self._clock() if now is None else now
        return max(0, math.ceil(offer.expires_at - current))

    def open_count(self, *, now: float | None = None) -> int:
        current = self._clock() if now is None else now
        self._evict(current)
        return sum(
            1
            for offer in self._offers.values()
            if self.state(offer, now=current) == OFFER_STATE_OPEN
        )

    def __len__(self) -> int:
        return len(self._offers)

    def _evict(self, now: float) -> None:
        # Few records, and their retention runs from two different moments
        # (the redeem or the expiry), so a plain sweep rather than a queue.
        for key in [
            key
            for key, offer in self._offers.items()
            if (offer.redeemed_at if offer.redeemed_at is not None else offer.expires_at)
            + self._retain
            <= now
        ]:
            del self._offers[key]

    def shutdown(self) -> None:
        self._offers.clear()
