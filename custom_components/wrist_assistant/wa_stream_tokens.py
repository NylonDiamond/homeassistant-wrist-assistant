"""Single-use handshake tokens for the v2 camera stream endpoint.

The watch can't HMAC every MJPEG frame — multipart streams aren't a single
request body. Instead the watch handshakes via `op=stream_open` on the
HMAC-authed /v2/action endpoint; the server mints an opaque token bound to
the watch and the camera and returns a signed URL. The watch then opens a
plain GET to /v2/stream/<token>; auth on that GET is the token-store
lookup (single-use, short-lived) rather than HMAC headers.

Properties this gives us:
* Frame-by-frame cost is unchanged from a bearer GET — no per-frame HMAC.
* A leaked token is bounded to one stream (single-use) and ~30 s (TTL).
* The watch can't reuse a token if the stream drops — it re-handshakes.
* Token issuance is HMAC-authed, so an attacker can't request a token they
  could brute-force; they'd have to brute-force the 24-byte token itself
  (2^192 search space) inside the TTL window.

Bounded size guards against pathological clients spamming `op=stream_open`:
the OrderedDict evicts oldest first, so under attack new tokens displace
old ones rather than letting memory grow unbounded.
"""

from __future__ import annotations

import logging
import secrets
import time
from collections import OrderedDict
from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .camera_stream import ViewportState

_LOGGER = logging.getLogger(__name__)


@dataclass
class StreamTokenEntry:
    """A pending stream session bound to a single token."""

    watch_id: str
    entity_id: str
    width: int
    quality: int
    fps: float
    viewport: "ViewportState"
    expires_at: float
    consumed: bool = False


class StreamTokenStore:
    """Bounded TTL store of single-use camera stream tokens.

    Insert order matches expiry order because every entry uses the same TTL,
    so eviction walks from the head until it hits a still-fresh entry.

    Single-use semantics: `claim(token)` returns the entry once and marks it
    consumed; subsequent claims of the same token return None even before
    the TTL elapses. This bounds the value of a leaked token to one stream
    session.
    """

    _MAX_ENTRIES = 1024

    def __init__(self) -> None:
        self._entries: OrderedDict[str, StreamTokenEntry] = OrderedDict()

    def mint(
        self,
        *,
        watch_id: str,
        entity_id: str,
        width: int,
        quality: int,
        fps: float,
        viewport: "ViewportState",
        ttl_seconds: float,
        now: float | None = None,
    ) -> tuple[str, float]:
        """Create a single-use token. Returns (token, expires_at).

        Token is 48 hex chars (24 random bytes). At 192 bits of entropy and
        a 30 s TTL, brute force is not a meaningful threat — an attacker
        would have to guess one of at most _MAX_ENTRIES live tokens out of
        a 2^192 space inside the window.
        """
        current = time.time() if now is None else now
        self._evict_expired(current)
        token = secrets.token_hex(24)
        expires_at = current + ttl_seconds
        self._entries[token] = StreamTokenEntry(
            watch_id=watch_id,
            entity_id=entity_id,
            width=width,
            quality=quality,
            fps=fps,
            viewport=viewport,
            expires_at=expires_at,
        )
        if len(self._entries) > self._MAX_ENTRIES:
            self._entries.popitem(last=False)
        return token, expires_at

    def claim(self, token: str, *, now: float | None = None) -> StreamTokenEntry | None:
        """Consume a token. Returns the entry, or None if missing/expired/consumed.

        Consumption marks the entry consumed but leaves it in the dict so a
        retry doesn't accidentally hand the same token out twice. The entry
        is purged on the next eviction sweep.
        """
        current = time.time() if now is None else now
        self._evict_expired(current)
        entry = self._entries.get(token)
        if entry is None:
            return None
        if entry.consumed:
            return None
        if entry.expires_at <= current:
            self._entries.pop(token, None)
            return None
        entry.consumed = True
        return entry

    def release(self, token: str) -> bool:
        """Delete a token early (e.g. user cancelled before connecting)."""
        return self._entries.pop(token, None) is not None

    def _evict_expired(self, now: float) -> None:
        # OrderedDict is insertion-ordered, and every mint() uses the same TTL,
        # so the head is always the oldest entry. Stop at the first non-expired
        # one — everything behind it is younger.
        while self._entries:
            token = next(iter(self._entries))
            entry = self._entries[token]
            if entry.expires_at > now:
                return
            self._entries.popitem(last=False)

    def shutdown(self) -> None:
        self._entries.clear()
