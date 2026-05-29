"""Pure-unit tests for the notification snapshot store's reserve/fulfill flow.

Like ``test_camera_stream.py``, these import the module directly and run
in-process — no HA instance, no HA_URL/HA_TOKEN, so they run in plain CI.
``notification_snapshot`` is pure stdlib at import time (asyncio + secrets +
collections), so no HA stubs are needed; we load it from its file path to avoid
triggering the package ``__init__`` (which does pull in HA).

They pin the decoupled-snapshot contract added so a camera push no longer blocks
the alert on the camera grab:

  * reserve() mints a token whose bytes arrive later via fulfill().
  * get_wait() blocks a fetch that beats the capture, then returns the bytes.
  * fail()/timeout make get_wait() return None so the caller 404s and the client
    falls back to camera_entity_id.
  * a still-ready put() resolves get_wait() with no wait (fast path).
  * a pending reservation evicted under a burst degrades to None, and a late
    fulfill() on it is a harmless no-op.
"""

from __future__ import annotations

import asyncio
import importlib.util
import sys
from pathlib import Path

_NS_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "notification_snapshot.py"
)


def _load_store_module():
    """Load notification_snapshot.py standalone (no package __init__, no HA)."""
    spec = importlib.util.spec_from_file_location(
        "wa_notification_snapshot_under_test", _NS_PATH
    )
    module = importlib.util.module_from_spec(spec)
    # Register before exec so dataclass(slots=True) introspection resolves it.
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


_ns = _load_store_module()
NotificationSnapshotStore = _ns.NotificationSnapshotStore


# ── put(): already-ready bytes ────────────────────────────────────────────


def test_put_then_get_wait_returns_bytes_without_waiting() -> None:
    async def _t() -> None:
        store = NotificationSnapshotStore()
        token = store.put(b"JPEGBYTES", entity_id="camera.front")
        # Fast path: bytes already present, so even a near-zero timeout resolves.
        entry = await store.get_wait(token, timeout=0.01)
        assert entry is not None
        assert entry.data == b"JPEGBYTES"
        assert entry.content_type == "image/jpeg"

    asyncio.run(_t())


# ── reserve() + fulfill(): the push beat the camera, then the frame lands ──


def test_get_wait_blocks_then_resolves_on_fulfill() -> None:
    async def _t() -> None:
        store = NotificationSnapshotStore()
        token = store.reserve(entity_id="camera.front")

        # A fetch that arrives before the capture finishes must not 404 — it
        # parks until fulfill() lands the bytes.
        fetch = asyncio.create_task(store.get_wait(token, timeout=2.0))
        await asyncio.sleep(0)  # let the fetch reach its await
        assert not fetch.done()

        store.fulfill(token, b"FRESHFRAME", content_type="image/jpeg")
        entry = await fetch
        assert entry is not None
        assert entry.data == b"FRESHFRAME"

    asyncio.run(_t())


def test_get_wait_fast_path_when_already_fulfilled() -> None:
    async def _t() -> None:
        store = NotificationSnapshotStore()
        token = store.reserve(entity_id="camera.front")
        store.fulfill(token, b"ALREADY")  # lands before anyone waits
        entry = await store.get_wait(token, timeout=0.01)
        assert entry is not None
        assert entry.data == b"ALREADY"

    asyncio.run(_t())


# ── fail() / timeout: caller must 404 so the client falls back ─────────────


def test_get_wait_returns_none_on_fail() -> None:
    async def _t() -> None:
        store = NotificationSnapshotStore()
        token = store.reserve(entity_id="camera.front")

        fetch = asyncio.create_task(store.get_wait(token, timeout=2.0))
        await asyncio.sleep(0)
        store.fail(token)
        assert await fetch is None  # capture gave up → 404, not a hang

    asyncio.run(_t())


def test_get_wait_times_out_when_capture_never_lands() -> None:
    async def _t() -> None:
        store = NotificationSnapshotStore()
        token = store.reserve(entity_id="camera.front")
        # No fulfill()/fail() ever → bounded wait returns None.
        assert await store.get_wait(token, timeout=0.05) is None

    asyncio.run(_t())


def test_get_wait_unknown_token_returns_none() -> None:
    async def _t() -> None:
        store = NotificationSnapshotStore()
        assert await store.get_wait("deadbeef", timeout=0.01) is None

    asyncio.run(_t())


# ── eviction of a pending reservation under a burst ────────────────────────


def test_pending_reservation_evicted_under_burst_degrades_gracefully() -> None:
    async def _t() -> None:
        store = NotificationSnapshotStore()
        pending = store.reserve(entity_id="camera.front")

        # A doorbell storm: enough ready snapshots to push the oldest-inserted
        # entry (our pending reservation) past the cap.
        for i in range(store._MAX_ENTRIES + 1):
            store.put(b"x", entity_id=f"camera.cam{i}")

        # The reservation was evicted → a fetch 404s (client falls back), and a
        # late fulfill() on the gone token is a harmless no-op (no raise).
        assert await store.get_wait(pending, timeout=0.05) is None
        store.fulfill(pending, b"late-and-unwanted")

    asyncio.run(_t())


# ── expiry still applies to a fulfilled token ──────────────────────────────


def test_expired_token_is_not_returned() -> None:
    async def _t() -> None:
        store = NotificationSnapshotStore()
        token = store.put(b"BYTES", entity_id="camera.front", ttl_seconds=10, now=1_000.0)
        # Fetch well past the TTL: gone.
        assert await store.get_wait(token, timeout=0.01, now=2_000.0) is None

    asyncio.run(_t())
