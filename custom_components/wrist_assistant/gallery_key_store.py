"""The key this Home Assistant uses with the complication gallery.

The panel uploads complications to the public gallery on wrist-assistant.com
and later lists or deletes its own uploads. The gallery needs something that
says "the same uploader as before" without an account, so each Home Assistant
gets one random key, made the first time the panel asks and kept in storage.

It is random on purpose. The instance UUID would work as an identifier, but it
names this Home Assistant everywhere else it is used, and nothing about the
house should reach a public service. A random key identifies only the uploads.

The file is deliberately left alone when the integration is removed: a key
that changed on reinstall would orphan every upload made with the old one,
and those could then only be removed by asking.
"""

from __future__ import annotations

import asyncio
import re
import secrets

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import GALLERY_KEY_STORAGE_KEY, GALLERY_KEY_STORAGE_VERSION

# What the gallery accepts in its `X-Gallery-Key` header. A stored value that
# does not fit (hand edited, truncated) is replaced rather than sent.
_KEY_RE = re.compile(r"^[A-Za-z0-9_-]{32,128}$")

# Where the one instance lives in hass.data. Separate from the config entry's
# runtime data so the key can be read whenever the panel is open.
DATA_GALLERY_KEY_STORE = "wrist_assistant_gallery_key_store"


class GalleryKeyStore:
    """Loads the gallery key, or makes and saves one on first use."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store = Store(
            hass, GALLERY_KEY_STORAGE_VERSION, GALLERY_KEY_STORAGE_KEY
        )
        self._key: str | None = None
        self._lock = asyncio.Lock()

    async def async_get_key(self) -> str:
        """The key, created and saved the first time it is asked for."""
        if self._key is not None:
            return self._key
        # Two panel tabs asking at once must not each write a different key.
        async with self._lock:
            if self._key is not None:
                return self._key
            data = await self._store.async_load()
            key = data.get("gallery_key") if isinstance(data, dict) else None
            if not isinstance(key, str) or not _KEY_RE.match(key):
                # token_urlsafe(32) is 43 characters of [A-Za-z0-9_-].
                key = secrets.token_urlsafe(32)
                await self._store.async_save({"gallery_key": key})
            self._key = key
            return key


def gallery_key_store(hass: HomeAssistant) -> GalleryKeyStore:
    """The one store for this Home Assistant, made on first use."""
    store = hass.data.get(DATA_GALLERY_KEY_STORE)
    if store is None:
        store = GalleryKeyStore(hass)
        hass.data[DATA_GALLERY_KEY_STORE] = store
    return store
