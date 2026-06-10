"""Pure-unit tests for webhook_relay (Wrist Webhooks provisioning/device sync).

Like test_notification_tokens.py these run with no HA instance — no
HA_URL/HA_TOKEN — so they execute in plain CI. ``webhook_relay`` keeps all its
Home Assistant imports under TYPE_CHECKING precisely so it can be imported and
exercised directly with fakes.

What they guard:
- Provisioning only ever persists the webhook_id in HA; the publish/read
  tokens pass through to the app and must never land in the store.
- Missing relay_tokens are re-minted (the store drops them on device-token
  rotation) before pairs are sent to the relay.
- Device sync is a no-op without a provisioned webhook, refreshes the mapping
  on success, and clears the stored webhook_id when the relay reports the
  webhook gone (revoked from the app).
"""

from __future__ import annotations

import asyncio
import importlib.util
import sys
from dataclasses import dataclass, field
from pathlib import Path

_MODULE_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "webhook_relay.py"
)

_spec = importlib.util.spec_from_file_location("webhook_relay", _MODULE_PATH)
webhook_relay = importlib.util.module_from_spec(_spec)
sys.modules["webhook_relay"] = webhook_relay
_spec.loader.exec_module(webhook_relay)


@dataclass
class FakeEntry:
    device_token: str
    platform: str
    environment: str = "production"
    relay_token: str | None = None


class FakeStore:
    def __init__(self, entries: dict[str, FakeEntry] | None = None) -> None:
        self.entries = entries or {}
        self.metadata: dict[str, dict] = {}

    def get_entries(self, watch_id: str) -> dict[str, FakeEntry]:
        return dict(self.entries)

    def get_entry(self, watch_id: str, platform: str | None = None):
        return self.entries.get(platform)

    def get_watch_metadata(self, watch_id: str, key: str, default=None):
        return self.metadata.get(watch_id, {}).get(key, default)

    def set_watch_metadata(self, watch_id: str, key: str, value) -> None:
        self.metadata.setdefault(watch_id, {})[key] = value


class FakeClient:
    """Scripted relay client recording every call."""

    def __init__(self, store: FakeStore, responses: list) -> None:
        self._store = store
        self.responses = list(responses)
        self.posts: list[tuple[str, dict]] = []
        self.minted: list[tuple[str, str]] = []

    async def ensure_relay_token(self, watch_id: str, platform: str):
        entry = self._store.entries.get(platform)
        if entry is None:
            return None
        if entry.relay_token:
            return entry.relay_token
        self.minted.append((watch_id, platform))
        entry.relay_token = f"minted-{platform}"
        return entry.relay_token

    async def relay_post(self, path: str, payload: dict):
        self.posts.append((path, payload))
        return self.responses.pop(0) if self.responses else None


@dataclass
class FakeDomainData:
    apns_client: FakeClient | None = None
    notification_store: FakeStore | None = None


def _two_device_store() -> FakeStore:
    return FakeStore(
        {
            "ios": FakeEntry(device_token="ios-tok", platform="ios", relay_token="rt-ios"),
            "watchos": FakeEntry(device_token="watch-tok", platform="watchos", relay_token="rt-watch"),
        }
    )


PROVISION_OK = {
    "webhook_id": "wh_abc",
    "publish_token": "wap_secret",
    "read_token": "war_secret",
    "publish_url": "https://push.example/w/wap_secret/{topic}",
}


def test_provision_returns_tokens_and_persists_only_webhook_id():
    store = _two_device_store()
    client = FakeClient(store, [PROVISION_OK])
    data = FakeDomainData(apns_client=client, notification_store=store)

    result = asyncio.run(webhook_relay.async_provision_webhook(data, "watch-1"))

    assert result["ok"] is True
    assert result["publish_token"] == "wap_secret"
    assert result["read_token"] == "war_secret"

    path, payload = client.posts[0]
    assert path == "/v1/webhook/provision"
    assert {d["device_token"] for d in payload["devices"]} == {"ios-tok", "watch-tok"}
    assert all(d["relay_token"] for d in payload["devices"])

    # Only the webhook_id may be persisted in HA — never the tokens.
    assert store.metadata["watch-1"] == {"webhook_id": "wh_abc"}
    flattened = repr(store.metadata) + repr(store.entries)
    assert "wap_secret" not in flattened
    assert "war_secret" not in flattened


def test_provision_mints_missing_relay_tokens_first():
    store = _two_device_store()
    store.entries["watchos"].relay_token = None  # dropped on token rotation
    client = FakeClient(store, [PROVISION_OK])
    data = FakeDomainData(apns_client=client, notification_store=store)

    result = asyncio.run(webhook_relay.async_provision_webhook(data, "watch-1"))

    assert result["ok"] is True
    assert client.minted == [("watch-1", "watchos")]
    _, payload = client.posts[0]
    assert {d["relay_token"] for d in payload["devices"]} == {"rt-ios", "minted-watchos"}


def test_provision_requires_a_registered_device():
    store = FakeStore({})
    client = FakeClient(store, [])
    data = FakeDomainData(apns_client=client, notification_store=store)

    result = asyncio.run(webhook_relay.async_provision_webhook(data, "watch-1"))

    assert result == {"ok": False, "error": "no_push_token", "status": 409}
    assert client.posts == []


def test_provision_relay_unreachable():
    store = _two_device_store()
    client = FakeClient(store, [None])
    data = FakeDomainData(apns_client=client, notification_store=store)

    result = asyncio.run(webhook_relay.async_provision_webhook(data, "watch-1"))

    assert result["ok"] is False
    assert result["error"] == "relay_unreachable"
    assert result["status"] == 502
    assert store.metadata == {}


def test_provision_propagates_relay_error():
    store = _two_device_store()
    client = FakeClient(store, [{"error": "rate_limited"}])
    data = FakeDomainData(apns_client=client, notification_store=store)

    result = asyncio.run(webhook_relay.async_provision_webhook(data, "watch-1"))

    assert result["ok"] is False
    assert result["error"] == "rate_limited"
    assert store.metadata == {}


def test_sync_noop_without_webhook():
    store = _two_device_store()
    client = FakeClient(store, [])
    data = FakeDomainData(apns_client=client, notification_store=store)

    asyncio.run(webhook_relay.async_sync_webhook_devices(data, "watch-1"))

    assert client.posts == []


def test_sync_rebinds_devices():
    store = _two_device_store()
    store.metadata["watch-1"] = {"webhook_id": "wh_abc"}
    client = FakeClient(store, [{"updated": True, "devices": 2}])
    data = FakeDomainData(apns_client=client, notification_store=store)

    asyncio.run(webhook_relay.async_sync_webhook_devices(data, "watch-1"))

    path, payload = client.posts[0]
    assert path == "/v1/webhook/update_devices"
    assert payload["webhook_id"] == "wh_abc"
    assert len(payload["devices"]) == 2
    # Still provisioned.
    assert store.metadata["watch-1"]["webhook_id"] == "wh_abc"


def test_sync_clears_webhook_id_when_relay_forgot_it():
    store = _two_device_store()
    store.metadata["watch-1"] = {"webhook_id": "wh_gone"}
    client = FakeClient(store, [{"error": "unknown_webhook"}])
    data = FakeDomainData(apns_client=client, notification_store=store)

    asyncio.run(webhook_relay.async_sync_webhook_devices(data, "watch-1"))

    assert store.metadata["watch-1"]["webhook_id"] is None


def test_sync_keeps_webhook_id_on_transient_failure():
    store = _two_device_store()
    store.metadata["watch-1"] = {"webhook_id": "wh_abc"}
    client = FakeClient(store, [None])
    data = FakeDomainData(apns_client=client, notification_store=store)

    asyncio.run(webhook_relay.async_sync_webhook_devices(data, "watch-1"))

    assert store.metadata["watch-1"]["webhook_id"] == "wh_abc"
