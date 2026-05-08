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
import logging
import time
from collections import OrderedDict
from dataclasses import dataclass

from aiohttp.web import Request

from .const import (
    WA_ACCEPTED_PROTOCOL_VERSIONS,
    WA_HMAC_NONCE_TTL_SECONDS,
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
            key, expires_at = next(iter(self._entries.items()))
            if expires_at > now:
                return
            self._entries.popitem(last=False)


def validate_wa_request(
    request: Request,
    body: bytes,
    secret_store: WidgetSecretStore,
    nonce_cache: WANonceCache,
    *,
    now: float | None = None,
) -> ValidatedWARequest:
    """Validate the headers + signature on `request`. Raises WAHMACError on any failure."""

    version_str = request.headers.get("X-WA-Version", "")
    op = request.headers.get("X-WA-Op", "")
    watch_id = request.headers.get("X-WA-Watch", "")
    ts_str = request.headers.get("X-WA-Ts", "")
    nonce = request.headers.get("X-WA-Nonce", "")
    sig_hex = request.headers.get("X-WA-Sig", "")

    if not all((version_str, op, watch_id, ts_str, nonce, sig_hex)):
        raise WAHMACError("missing_headers")

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

    canonical = f"v{version}|{op}|{watch_id}|{ts}|{nonce}".encode("utf-8") + b"\n" + body
    expected = hmac.new(secret, canonical, digest).hexdigest()
    if not hmac.compare_digest(expected, sig_hex.lower()):
        raise WAHMACError("bad_signature")

    if not nonce_cache.check_and_record(watch_id, nonce, current):
        raise WAHMACError("replayed_nonce")

    return ValidatedWARequest(
        version=version, op=op, watch_id=watch_id, body=body, algo=entry.algo
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
        f"v{version}|{op}|{watch_id}|{ts}|response".encode("utf-8")
        + b"\n"
        + body
    )
    return hmac.new(secret_bytes, canonical, digest).hexdigest()
