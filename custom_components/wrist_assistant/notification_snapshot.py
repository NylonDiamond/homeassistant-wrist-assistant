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

    data: bytes
    content_type: str
    expires_at: float
    # Source camera, so the `/live` endpoint can re-capture a fresh frame for
    # the same token. None for tokens minted from a pre-built image (no camera
    # to re-capture from) — those fall back to the cached bytes.
    entity_id: str | None = None


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
        """Store snapshot bytes; return a 48-hex-char (192-bit) opaque token."""
        current = time.time() if now is None else now
        self._evict_expired(current)
        token = secrets.token_hex(24)
        self._entries[token] = SnapshotEntry(
            data=data,
            content_type=content_type,
            expires_at=current + ttl_seconds,
            entity_id=entity_id,
        )
        # Cap-eviction safety net: drop oldest-inserted until under the ceiling.
        while len(self._entries) > self._MAX_ENTRIES:
            self._entries.popitem(last=False)
        return token

    def get(self, token: str, *, now: float | None = None) -> SnapshotEntry | None:
        """Return the entry for a token (multi-use), or None if missing/expired."""
        current = time.time() if now is None else now
        entry = self._entries.get(token)
        if entry is None:
            return None
        if entry.expires_at <= current:
            self._entries.pop(token, None)
            return None
        return entry

    def _evict_expired(self, now: float) -> None:
        expired = [t for t, e in self._entries.items() if e.expires_at <= now]
        for token in expired:
            self._entries.pop(token, None)

    def clear(self) -> None:
        self._entries.clear()
