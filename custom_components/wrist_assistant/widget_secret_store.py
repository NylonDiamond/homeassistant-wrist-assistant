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
from dataclasses import dataclass, field

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import WIDGET_SECRET_STORAGE_KEY, WIDGET_SECRET_STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 2


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


class WidgetSecretStore:
    """Persistent map of watch_id → WidgetSecretEntry."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._secrets: dict[str, WidgetSecretEntry] = {}
        self._store: Store = Store(
            hass,
            WIDGET_SECRET_STORAGE_VERSION,
            WIDGET_SECRET_STORAGE_KEY,
        )

    async def async_load(self) -> None:
        """Load persisted secrets from disk."""
        data = await self._store.async_load()
        if not data or not isinstance(data, dict):
            return
        secrets = data.get("secrets", {})
        for watch_id, entry in secrets.items():
            if isinstance(entry, dict) and "secret_b64" in entry:
                self._secrets[watch_id] = WidgetSecretEntry(
                    secret_b64=entry["secret_b64"],
                    label=entry.get("label"),
                    algo=entry.get("algo", "hmac-sha256"),
                )
        _LOGGER.debug("Loaded %d widget secrets from storage", len(self._secrets))

    def _serialize(self) -> dict:
        return {
            "secrets": {
                watch_id: {
                    "secret_b64": entry.secret_b64,
                    "label": entry.label,
                    "algo": entry.algo,
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
    ) -> None:
        """Register or replace a secret for a watch."""
        existing = self._secrets.get(watch_id)
        if (
            existing
            and existing.secret_b64 == secret_b64
            and existing.label == label
            and existing.algo == algo
        ):
            return
        self._secrets[watch_id] = WidgetSecretEntry(
            secret_b64=secret_b64, label=label, algo=algo
        )
        _LOGGER.info(
            "Registered widget secret for watch_id=%s algo=%s", watch_id, algo
        )
        self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)

    def get(self, watch_id: str) -> WidgetSecretEntry | None:
        return self._secrets.get(watch_id)

    def remove(self, watch_id: str) -> None:
        if self._secrets.pop(watch_id, None) is not None:
            self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)

    @property
    def all_watch_ids(self) -> list[str]:
        return list(self._secrets.keys())
