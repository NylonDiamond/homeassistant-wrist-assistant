"""HMAC validation for Wrist Assistant signed requests.

Used by both the watch widget extension (small ops on /v2/action) and the
watch's main transport (long-poll on /v2/delta, plus the full /v2/action
op vocabulary). The wire format is identical for both — only the op string
and endpoint URL differ.

Wire format (mirrors `WidgetHMACSigner` on the Swift side):

    Headers
        X-WA-Version: <int>            protocol version (currently 2)
        X-WA-Op:      <str>            see WAActionView for current op vocabulary
        X-WA-Watch:   <str>            16-byte hex watch identifier
        X-WA-Ts:      <int>            unix seconds, request build time
        X-WA-Nonce:   <str>            16-byte hex random
        X-WA-Sig:     <str>            HMAC-SHA256 hex over canonical input

    Canonical input bytes for the HMAC:
        f"v{version}|{op}|{watch_id}|{ts}|{nonce}".encode("utf-8") + b"\\n" + body_bytes

The body is signed verbatim (raw bytes) so neither side has to agree on a
JSON canonicalization. The watch sends whatever JSON (or gzipped JSON, for
delta responses) it built; HA hashes the same bytes it received before
parsing.

Op is part of the canonical input, so a signature for `op=service` cannot
be replayed as `op=delta` even on the same body — which lets us share the
nonce cache across the action and delta endpoints.

Returned dataclasses describe success and the various reject reasons so
callers can log specific 4xx codes — invalid sig, stale ts, replayed
nonce, unknown watch — without leaking which check failed to clients
(they all surface as 401 to the network).
"""

from __future__ import annotations

import hashlib
import hmac
import json
import logging
import time
from collections import OrderedDict
from dataclasses import dataclass
from typing import Any

from aiohttp.web import Request

from .const import (
    WA_ACCEPTED_PROTOCOL_VERSIONS,
    WA_HMAC_TIMESTAMP_WINDOW_SECONDS,
    WA_PROTOCOL_VERSION,
)
from .widget_secret_store import WidgetSecretStore

_LOGGER = logging.getLogger(__name__)


# Default MAC algorithm for entries registered without an explicit `algo`
# field — covers every entry written before that field existed, plus any iOS
# build that hasn't started sending it yet.
DEFAULT_HMAC_ALGO = "hmac-sha256"

# Algo tag → hashlib digest factory. Adding a new algorithm is one line here
# plus accepting the new tag in `WARegisterSecretView`. Callers must NOT
# hardcode `hashlib.sha256` directly — go through this table so a per-entry
# algo upgrade just works without touching the validator.
_HMAC_DIGESTS = {
    DEFAULT_HMAC_ALGO: hashlib.sha256,
}
SUPPORTED_HMAC_ALGOS: frozenset[str] = frozenset(_HMAC_DIGESTS)


# Reject the request and log a specific reason. All failures surface to
# the network as 401 so a probing client can't distinguish "wrong sig"
# from "wrong watch" — both mean the same thing operationally.
class WAHMACError(Exception):
    """Raised when validation fails. The `reason` is a short tag for logging."""

    def __init__(self, reason: str) -> None:
        super().__init__(reason)
        self.reason = reason


# The body of every unsigned 401 but one. The apps count a 401 with exactly
# this body as a strike against the pair (`WatchPairRejectionRules`), and
# enough strikes a minute apart drop it.
REFUSAL_TEXT = "Unauthorized"

# What the one other body says: the request's timestamp was outside the
# window. That is a clock off on one side, which pairing again cannot fix.
CLOCK_OFF_ERROR = "clock_off"


def refusal_reply(err: WAHMACError, *, now: float | None = None) -> tuple[str, str]:
    """The text and content type of the unsigned 401 a view answers for
    ``err``.

    Every reason reads ``Unauthorized``, so a probing client still cannot
    tell a wrong signature from an unknown watch. A timestamp outside the
    window is the one exception (R5-065): it answers
    ``{"ok": false, "error": "clock_off", "server_time": <unix seconds>}``.
    The apps once told it apart only by the reply's ``Date`` header, and a
    proxy that sets its own ``Date`` hid it, so a box whose clock was off
    made a watch drop a pair Home Assistant still held. The timestamp is
    checked before the watch is looked up, so the reply says nothing about
    which watches are paired, and the server's time is in every ``Date``
    header anyway. An app older than this reply reads the new body as a 401
    that is not the integration's own, which counts no strike either.
    """
    if err.reason != "ts_out_of_window":
        return REFUSAL_TEXT, "text/plain"
    current = time.time() if now is None else now
    body = json.dumps({"ok": False, "error": CLOCK_OFF_ERROR, "server_time": int(current)})
    return body, "application/json"


@dataclass
class ValidatedWARequest:
    """A request that passed HMAC validation."""

    version: int
    op: str
    watch_id: str
    body: bytes
    algo: str
    """MAC algorithm the entry was registered with. Carried out so the response
    signer can match it without re-reading the secret store."""


class WANonceCache:
    """Bounded TTL set of (watch_id, nonce) pairs to defeat replay.

    Implemented as an `OrderedDict` for O(1) insert + O(n) eviction, where
    n is the count of expired entries on each insert. Memory ceiling
    `_MAX_ENTRIES` protects against an attacker who is somehow already
    past the auth check spamming nonces; in practice the cache stays
    small because TTL is ~90 s and only authenticated requests land here.

    A single shared instance covers /v2/action and /v2/delta — the op is part
    of the canonical input, so a nonce captured on one endpoint cannot be
    replayed against the other.
    """

    _MAX_ENTRIES = 10_000

    def __init__(self, ttl_seconds: float) -> None:
        self._ttl = ttl_seconds
        self._entries: OrderedDict[tuple[str, str], float] = OrderedDict()

    def check_and_record(self, watch_id: str, nonce: str, now: float) -> bool:
        """Return True if the nonce is fresh; record it. False if replayed."""
        self._evict_expired(now)
        key = (watch_id, nonce)
        if key in self._entries:
            return False
        self._entries[key] = now + self._ttl
        if len(self._entries) > self._MAX_ENTRIES:
            self._entries.popitem(last=False)
        return True

    def _evict_expired(self, now: float) -> None:
        # OrderedDict insertion order matches expiry order because TTL is constant.
        while self._entries:
            expires_at = next(iter(self._entries.values()))
            if expires_at > now:
                return
            self._entries.popitem(last=False)


@dataclass
class _CheckedHeaders:
    version: int
    op: str
    watch_id: str
    ts: int
    nonce: str
    sig_hex: str
    secret: bytes
    algo: str
    digest: Any
    now: float


def precheck_wa_request(
    request: Request,
    secret_store: WidgetSecretStore,
    *,
    now: float | None = None,
) -> None:
    """Every check :func:`validate_wa_request` makes that needs no body: the
    headers are there and plain, the version is one this build takes, the
    timestamp is in the window, and the watch is known with a usable
    secret. A view runs it before it reads the body, so a stranger who
    knows no paired watch cannot make Home Assistant read a large body.
    Raises WAHMACError with the same reasons."""
    _check_headers(request, secret_store, now)


def _check_headers(
    request: Request, secret_store: WidgetSecretStore, now: float | None
) -> _CheckedHeaders:
    version_str = request.headers.get("X-WA-Version", "")
    op = request.headers.get("X-WA-Op", "")
    watch_id = request.headers.get("X-WA-Watch", "")
    ts_str = request.headers.get("X-WA-Ts", "")
    nonce = request.headers.get("X-WA-Nonce", "")
    sig_hex = request.headers.get("X-WA-Sig", "")

    if not all((version_str, op, watch_id, ts_str, nonce, sig_hex)):
        raise WAHMACError("missing_headers")

    # aiohttp hands header bytes over as UTF-8 text with surrogate escapes, so
    # a header can carry characters a real client never sends. A non-ASCII
    # signature makes `hmac.compare_digest` raise TypeError, and an escaped
    # byte in the nonce makes the canonical `.encode("utf-8")` raise. Refuse
    # them here so they get the same 401 as any other bad request.
    if not all(
        value.isascii() for value in (version_str, op, watch_id, ts_str, nonce, sig_hex)
    ):
        raise WAHMACError("invalid_header")

    try:
        version = int(version_str)
    except ValueError as err:
        raise WAHMACError("invalid_version") from err
    if version not in WA_ACCEPTED_PROTOCOL_VERSIONS:
        raise WAHMACError("unsupported_version")

    try:
        ts = int(ts_str)
    except ValueError as err:
        raise WAHMACError("invalid_ts") from err

    current = time.time() if now is None else now
    if abs(current - ts) > WA_HMAC_TIMESTAMP_WINDOW_SECONDS:
        raise WAHMACError("ts_out_of_window")

    entry = secret_store.get(watch_id)
    if entry is None:
        raise WAHMACError("unknown_watch")

    secret = entry.secret_bytes
    if secret is None:
        # Storage corruption — log loudly but treat as `invalid_secret` over
        # the wire (the watch sees the same 401 either way).
        _LOGGER.error("Widget secret for %s is not valid base64", watch_id)
        raise WAHMACError("invalid_secret")

    digest = _HMAC_DIGESTS.get(entry.algo)
    if digest is None:
        # Stored entry references an algo this build doesn't support — likely
        # a downgrade from a future version. Same uniform 401 to the wire.
        _LOGGER.error(
            "Widget secret for %s has unsupported algo %r", watch_id, entry.algo
        )
        raise WAHMACError("unsupported_algo")

    return _CheckedHeaders(
        version=version,
        op=op,
        watch_id=watch_id,
        ts=ts,
        nonce=nonce,
        sig_hex=sig_hex,
        secret=secret,
        algo=entry.algo,
        digest=digest,
        now=current,
    )


def validate_wa_request(
    request: Request,
    body: bytes,
    secret_store: WidgetSecretStore,
    nonce_cache: WANonceCache,
    *,
    now: float | None = None,
) -> ValidatedWARequest:
    """Validate the headers + signature on `request`. Raises WAHMACError on any failure."""
    h = _check_headers(request, secret_store, now)
    canonical = f"v{h.version}|{h.op}|{h.watch_id}|{h.ts}|{h.nonce}".encode() + b"\n" + body
    expected = hmac.new(h.secret, canonical, h.digest).hexdigest()
    if not hmac.compare_digest(expected, h.sig_hex.lower()):
        raise WAHMACError("bad_signature")

    if not nonce_cache.check_and_record(h.watch_id, h.nonce, h.now):
        raise WAHMACError("replayed_nonce")

    return ValidatedWARequest(
        version=h.version, op=h.op, watch_id=h.watch_id, body=body, algo=h.algo
    )


def sign_response(
    secret_bytes: bytes,
    op: str,
    watch_id: str,
    ts: int,
    body: bytes,
    *,
    version: int = WA_PROTOCOL_VERSION,
    algo: str = DEFAULT_HMAC_ALGO,
) -> str:
    """Sign a response body so the watch can verify the host that answered.

    Uses the same canonical format as the request, but with a fixed
    `nonce="response"` since responses don't need replay protection
    (they only matter to the watch that just made the request).

    Takes raw secret bytes (already base64-decoded) so the hot response
    path doesn't pay a fresh decode per call. Pass `entry.secret_bytes`
    from `WidgetSecretStore.get(...)` rather than the b64 string.

    `version` defaults to the latest protocol version. Callers handling a
    request validated with an older version should pass that version through
    so the watch's verifier — which uses its own protocol_version constant
    when reconstructing the canonical input — agrees.

    `algo` selects the MAC algorithm; it must match the algo on the entry
    whose secret is being used. Callers in the request path should plumb
    `validated.algo` through rather than relying on the default — the default
    only exists so utility callers (tests, one-off signers) don't have to
    name it.
    """
    digest = _HMAC_DIGESTS.get(algo)
    if digest is None:
        raise ValueError(f"Unsupported HMAC algo: {algo!r}")
    canonical = (
        f"v{version}|{op}|{watch_id}|{ts}|response".encode()
        + b"\n"
        + body
    )
    return hmac.new(secret_bytes, canonical, digest).hexdigest()
