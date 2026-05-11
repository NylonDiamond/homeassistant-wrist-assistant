"""Persistent store of widget HMAC secrets keyed by watch_id.

Each paired watch generates a 32-byte random secret on its keychain and
registers it with HA via `WidgetSecretRegisterView`. The watch — and the
watch's widget extension via the App Group — keep the secret locally; HA
keeps a copy here so it can validate HMACs on widget requests.

The bearer token never reaches the watch's widget extension under this
design; the secret is what authorizes widget requests.
"""

from __future__ import annotations

import base64
import logging
from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import datetime

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import WIDGET_SECRET_STORAGE_KEY, WIDGET_SECRET_STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 2

# Label values the iOS / watchOS app uses when self-provisioning. Surfaced as
# constants so sensor.py can infer device_kind without re-spelling the strings.
LABEL_IPHONE_SELF_PROVISION = "iphone-self-provision"
LABEL_WATCH_SELF_PROVISION = "watch-self-provision"

DEVICE_KIND_IPHONE = "iphone"
DEVICE_KIND_WATCH = "watch"


@dataclass
class WidgetSecretEntry:
    """A registered widget secret for a single paired watch."""

    secret_b64: str
    """Base64-encoded HMAC secret. Length depends on `algo` (32 bytes for
    hmac-sha256)."""

    label: str | None
    """Human-readable label (e.g. watch model) shown in diagnostics. Optional."""

    algo: str = "hmac-sha256"
    """MAC algorithm tag this secret was generated for. The validator dispatches
    on this so a future protocol version can roll out a new algorithm without
    forcing every watch to re-pair — register a fresh entry alongside, and the
    old watches keep verifying under the old algo until they upgrade. Legacy
    entries on disk default to `hmac-sha256` since the v1 schema only supported
    that."""

    app_version: str | None = None
    """Marketing version (CFBundleShortVersionString) reported by the iOS / watch
    app on the most recent `register_secret` call. None for entries written by
    builds that predate this field — sensors fall back to "unknown"."""

    app_build: str | None = None
    """Build number (CFBundleVersion) reported alongside `app_version`."""

    last_provision: datetime | None = None
    """UTC timestamp of the most recent successful register_secret call for this
    entry. Updated on every call even when the secret material is unchanged so
    the iPhone device's "Last provision" sensor reflects the latest ping."""

    secret_bytes: bytes | None = field(init=False, repr=False, default=None)
    """Decoded HMAC key bytes, cached on construction to avoid base64-decoding
    on every signed request and every signed response. None if `secret_b64`
    isn't valid base64 (storage corruption); validators treat this as
    `invalid_secret` and reject the request."""

    def __post_init__(self) -> None:
        try:
            self.secret_bytes = base64.b64decode(self.secret_b64)
        except (ValueError, TypeError):
            self.secret_bytes = None

    @property
    def device_kind(self) -> str:
        """Inferred device family for UX grouping. Driven off the label so older
        entries (and any future device that re-uses the self-provision flow)
        classify without a storage migration."""
        if self.label == LABEL_IPHONE_SELF_PROVISION:
            return DEVICE_KIND_IPHONE
        return DEVICE_KIND_WATCH


class WidgetSecretStore:
    """Persistent map of watch_id → WidgetSecretEntry."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._secrets: dict[str, WidgetSecretEntry] = {}
        self._store: Store = Store(
            hass,
            WIDGET_SECRET_STORAGE_VERSION,
            WIDGET_SECRET_STORAGE_KEY,
        )
        # Listeners notified after register/remove so sensor.py can spawn / tear
        # down iPhone-device entities without a HA restart. Mirrors the pattern
        # `DeltaCoordinator.async_add_session_listener` uses for watch sessions.
        self._listeners: list[Callable[[], None]] = []

    async def async_load(self) -> None:
        """Load persisted secrets from disk."""
        data = await self._store.async_load()
        if not data or not isinstance(data, dict):
            return
        secrets = data.get("secrets", {})
        for watch_id, entry in secrets.items():
            if isinstance(entry, dict) and "secret_b64" in entry:
                last_provision: datetime | None = None
                raw_ts = entry.get("last_provision")
                if isinstance(raw_ts, str):
                    parsed = dt_util.parse_datetime(raw_ts)
                    if parsed is not None:
                        last_provision = parsed
                self._secrets[watch_id] = WidgetSecretEntry(
                    secret_b64=entry["secret_b64"],
                    label=entry.get("label"),
                    algo=entry.get("algo", "hmac-sha256"),
                    app_version=entry.get("app_version"),
                    app_build=entry.get("app_build"),
                    last_provision=last_provision,
                )
        _LOGGER.debug("Loaded %d widget secrets from storage", len(self._secrets))

    def _serialize(self) -> dict:
        return {
            "secrets": {
                watch_id: {
                    "secret_b64": entry.secret_b64,
                    "label": entry.label,
                    "algo": entry.algo,
                    "app_version": entry.app_version,
                    "app_build": entry.app_build,
                    "last_provision": (
                        entry.last_provision.isoformat()
                        if entry.last_provision is not None
                        else None
                    ),
                }
                for watch_id, entry in self._secrets.items()
            }
        }

    def register(
        self,
        watch_id: str,
        secret_b64: str,
        label: str | None,
        *,
        algo: str = "hmac-sha256",
        app_version: str | None = None,
        app_build: str | None = None,
    ) -> bool:
        """Register or replace a secret for a watch.

        Returns True if this is a brand-new watch_id (caller can fire a
        first-pair logbook entry), False if it's an update to an existing
        registration (including a no-op re-provision).
        """
        existing = self._secrets.get(watch_id)
        is_new = existing is None
        now = dt_util.utcnow()

        if (
            existing
            and existing.secret_b64 == secret_b64
            and existing.label == label
            and existing.algo == algo
            and existing.app_version == app_version
            and existing.app_build == app_build
        ):
            # Idempotent re-provision: secret material + identity unchanged.
            # Still refresh `last_provision` so the iPhone "Last provision"
            # sensor reflects the ping; debounced save keeps disk writes cheap.
            existing.last_provision = now
            self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)
            self._notify_listeners()
            return False

        self._secrets[watch_id] = WidgetSecretEntry(
            secret_b64=secret_b64,
            label=label,
            algo=algo,
            app_version=app_version,
            app_build=app_build,
            last_provision=now,
        )
        _LOGGER.info(
            "Registered widget secret for watch_id=%s algo=%s app_version=%s",
            watch_id,
            algo,
            app_version,
        )
        self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)
        self._notify_listeners()
        return is_new

    def get(self, watch_id: str) -> WidgetSecretEntry | None:
        return self._secrets.get(watch_id)

    def remove(self, watch_id: str) -> None:
        if self._secrets.pop(watch_id, None) is not None:
            self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)
            self._notify_listeners()

    @property
    def all_watch_ids(self) -> list[str]:
        return list(self._secrets.keys())

    @property
    def all_entries(self) -> dict[str, WidgetSecretEntry]:
        """Snapshot copy of (watch_id → entry) for callers that iterate. Returns
        a shallow copy so iteration is safe against concurrent register/remove
        calls fired from listeners."""
        return dict(self._secrets)

    def async_add_listener(self, listener: Callable[[], None]) -> Callable[[], None]:
        """Subscribe to register/remove events. Returns an unsubscribe callback."""
        self._listeners.append(listener)

        def _unsub() -> None:
            try:
                self._listeners.remove(listener)
            except ValueError:
                pass

        return _unsub

    def _notify_listeners(self) -> None:
        for listener in list(self._listeners):
            try:
                listener()
            except Exception:  # noqa: BLE001
                _LOGGER.exception("Widget secret store listener raised")
