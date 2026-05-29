"""In-memory TTL cache of camera snapshots served to notifications.

A doorbell push can't carry image bytes (APNs caps the payload at ~4 KB), so
`send_notification` captures the camera frame at send time, parks the JPEG here
under an opaque token, and embeds a token-authed URL
(`/api/wrist_assistant/notification/snapshot/<token>`) in the push. The iOS
content extension and the watch long look fetch that URL to render the image.

Unlike the single-use stream tokens (`wa_stream_tokens.py`), a snapshot token is
*multi-use within its TTL*: one notification may be fetched independently by the
iPhone banner, the expanded content extension, and the watch, and re-rendered if
the user reopens it from Notification Center. The TTL bounds how long a leaked
URL exposes the frame; the bounded store bounds memory.
"""

from __future__ import annotations

import asyncio
import logging
import secrets
import time
from collections import OrderedDict
from dataclasses import dataclass

_LOGGER = logging.getLogger(__name__)

# 10 min: long enough that opening the notification from Notification Center a
# few minutes after it lands still resolves the image, short enough that a
# leaked URL ages out quickly.
DEFAULT_SNAPSHOT_TTL_SECONDS = 600


@dataclass(slots=True)
class SnapshotEntry:
    """A cached snapshot served at a token URL."""

    content_type: str
    expires_at: float
    # Source camera, so the `/live` endpoint can re-capture a fresh frame for
    # the same token. None for tokens minted from a pre-built image (no camera
    # to re-capture from) — those fall back to the cached bytes.
    entity_id: str | None = None
    # The JPEG bytes. None while a reserved token's background capture is still
    # in flight (see reserve()/fulfill()); a waiting GET blocks on `ready`.
    data: bytes | None = None
    # Set by fulfill()/fail() to wake any GET parked in get_wait(). Always
    # present in practice; Optional only so the dataclass needs no loop at
    # construction for callers that don't await.
    ready: asyncio.Event | None = None
    # True when the background capture gave up — waiters serve 404 and the
    # client falls back to fetching the image via camera_entity_id.
    failed: bool = False


class NotificationSnapshotStore:
    """Bounded, TTL-bound store of notification snapshot bytes keyed by token.

    At the default 250 KB cap per snapshot, the 32-entry ceiling bounds the
    store at ~8 MB even under a burst of doorbell pushes.
    """

    _MAX_ENTRIES = 32

    def __init__(self) -> None:
        self._entries: OrderedDict[str, SnapshotEntry] = OrderedDict()

    def put(
        self,
        data: bytes,
        *,
        content_type: str = "image/jpeg",
        ttl_seconds: float = DEFAULT_SNAPSHOT_TTL_SECONDS,
        entity_id: str | None = None,
        now: float | None = None,
    ) -> str:
        """Store ready snapshot bytes; return a 48-hex-char (192-bit) token.

        For bytes already in hand (pre-built images, non-camera sources). Camera
        pushes instead reserve() a token up front and fulfill() it from a
        background capture so the snapshot never blocks the alert.
        """
        current = time.time() if now is None else now
        self._evict_expired(current)
        token = secrets.token_hex(24)
        ready = asyncio.Event()
        ready.set()  # bytes already present — a GET resolves immediately
        self._entries[token] = SnapshotEntry(
            content_type=content_type,
            expires_at=current + ttl_seconds,
            entity_id=entity_id,
            data=data,
            ready=ready,
        )
        # Cap-eviction safety net: drop oldest-inserted until under the ceiling.
        while len(self._entries) > self._MAX_ENTRIES:
            self._entries.popitem(last=False)
        return token

    def reserve(
        self,
        *,
        entity_id: str | None = None,
        ttl_seconds: float = DEFAULT_SNAPSHOT_TTL_SECONDS,
        now: float | None = None,
    ) -> str:
        """Mint a token whose bytes aren't captured yet; return the token.

        A GET that arrives before the background capture finishes blocks in
        get_wait() on the entry's `ready` event rather than 404ing. Cheap — no
        camera I/O — so it runs on the notification send path while the actual
        capture happens in the background and lands via fulfill()/fail().
        """
        current = time.time() if now is None else now
        self._evict_expired(current)
        token = secrets.token_hex(24)
        self._entries[token] = SnapshotEntry(
            content_type="image/jpeg",
            expires_at=current + ttl_seconds,
            entity_id=entity_id,
            data=None,
            ready=asyncio.Event(),
        )
        while len(self._entries) > self._MAX_ENTRIES:
            self._entries.popitem(last=False)
        return token

    def fulfill(
        self, token: str, data: bytes, *, content_type: str = "image/jpeg"
    ) -> None:
        """Attach captured bytes to a reserved token and wake any waiting GET.

        No-op if the token was evicted/expired before capture finished (the
        waiter then times out and the client falls back to camera_entity_id).
        """
        entry = self._entries.get(token)
        if entry is None:
            return
        entry.data = data
        entry.content_type = content_type
        if entry.ready is not None:
            entry.ready.set()

    def fail(self, token: str) -> None:
        """Mark a reserved token's capture as failed and wake any waiter so it
        serves 404 immediately instead of blocking for the full timeout."""
        entry = self._entries.get(token)
        if entry is None:
            return
        entry.failed = True
        if entry.ready is not None:
            entry.ready.set()

    def get(self, token: str, *, now: float | None = None) -> SnapshotEntry | None:
        """Return the entry for a token (multi-use), or None if missing/expired.

        May return a still-pending entry whose `data` is None (capture in
        flight) — callers that need the bytes should use get_wait() instead.
        """
        current = time.time() if now is None else now
        entry = self._entries.get(token)
        if entry is None:
            return None
        if entry.expires_at <= current:
            self._entries.pop(token, None)
            return None
        return entry

    async def get_wait(
        self, token: str, *, timeout: float = 6.0, now: float | None = None
    ) -> SnapshotEntry | None:
        """Like get(), but if the token is reserved-but-pending, wait up to
        `timeout` seconds for fulfill()/fail() rather than returning empty.

        Returns the entry once its bytes are present, or None on
        missing/expired/failed/timeout. Bounded so a dead camera can't pin the
        connection; on None the caller serves 404 and the client falls back to
        fetching the image via camera_entity_id. The waiter holds a reference to
        the entry, so a fulfill() that lands even after an intervening eviction
        is still observed.
        """
        entry = self.get(token, now=now)
        if entry is None:
            return None
        if entry.data is not None:
            return entry  # already fulfilled — fast path, no wait
        if entry.ready is None:
            return None
        try:
            await asyncio.wait_for(entry.ready.wait(), timeout=timeout)
        except TimeoutError:
            return None
        if entry.failed or entry.data is None:
            return None
        return entry

    def _evict_expired(self, now: float) -> None:
        expired = [t for t, e in self._entries.items() if e.expires_at <= now]
        for token in expired:
            self._entries.pop(token, None)

    def clear(self) -> None:
        self._entries.clear()
