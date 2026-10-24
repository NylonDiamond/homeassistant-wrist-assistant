"""The two addresses a watch or an iPhone reaches this Home Assistant at.

Each paired device, a watch or an iPhone (both live in the one
WidgetSecretStore, told apart by ``device_kind``), keeps one record here,
beside its secret (``WidgetSecretEntry.local_url`` and ``remote_url``): a
home network address and an internet address. Each slot is one of three
settings:

* ``auto``: follow Home Assistant's own Settings, System, Network. The home
  network address is the internal URL (or the one Home Assistant works out for
  itself), the internet address is the external URL, else the Home Assistant
  Cloud one. Stored as None, which is what every entry from before this
  existed reads as.
* ``set``: an address someone typed, in the panel or on the watch. Stored as
  that address, sanitized.
* ``none``: deliberately no address in that slot. Stored as ``""``.

The device reads its record with the signed ``addresses_get`` op and writes
it with ``addresses_set``, signed as itself; the panel does both over the
WebSocket (``devices/addresses`` and ``devices/set_addresses`` in
complication_ws.py). Every reply with a body to a device's delta poll (a
watch's, or an iPhone's poll for its own pages) carries the record's
``hash`` as ``addresses``, so the device learns of a change, from the panel
or from Home Assistant's own Network settings, on its next poll.

Pure apart from ``detected_addresses``, which asks Home Assistant, so the
rules are tested with no Home Assistant at all.
"""

from __future__ import annotations

import hashlib
import re
from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any
from urllib.parse import urlsplit

SOURCE_AUTO = "auto"
SOURCE_SET = "set"
SOURCE_NONE = "none"

# The two slots, under the names the ops, the WebSocket and the store share.
LOCAL_FIELD = "local_url"
REMOTE_FIELD = "remote_url"
ADDRESS_FIELDS = (LOCAL_FIELD, REMOTE_FIELD)

# The longest address taken, before and after it is cleaned.
ADDRESS_MAX_LEN = 512

INVALID_URL_ERROR = "invalid_url"

# A host name or an IPv4 address. An IPv6 address comes out of urlsplit
# without its brackets and is checked apart (it holds a colon).
_HOST_RE = re.compile(r"^[a-z0-9_]([a-z0-9_.-]*[a-z0-9_])?$")
_IPV6_RE = re.compile(r"^[0-9a-f:.]+$")


class InvalidAddressError(ValueError):
    """An address that is not one, naming the slot it was sent for."""

    def __init__(self, field: str) -> None:
        super().__init__(f"{field} is not an http or https address")
        self.field = field


def sanitize_url(value: Any) -> str | None:
    """``value`` as ``scheme://host[:port]``, or None when it is not one.

    The one cleaner every write path uses, and the auto values from Home
    Assistant go through it too. Takes http and https only, with a host, and
    no user name or password. A trailing ``/`` is dropped; any other path, a
    query or a fragment makes it no address at all, since the watch joins its
    own paths onto it. The scheme and host come out lower case. At most
    ADDRESS_MAX_LEN characters, before and after.
    """
    if not isinstance(value, str):
        return None
    text = value.strip()
    if not text or len(text) > ADDRESS_MAX_LEN:
        return None
    if any(ch.isspace() or ord(ch) < 0x20 or ord(ch) == 0x7F for ch in text):
        return None
    try:
        parts = urlsplit(text)
        port = parts.port
    except ValueError:
        return None
    scheme = parts.scheme.lower()
    if scheme not in ("http", "https"):
        return None
    if parts.path not in ("", "/") or parts.query or parts.fragment:
        return None
    if "?" in text or "#" in text:
        return None
    netloc = parts.netloc
    if "@" in netloc or netloc.endswith(":"):
        return None
    host = (parts.hostname or "").lower()
    if not host:
        return None
    if ":" in host:
        if not _IPV6_RE.fullmatch(host):
            return None
        host_text = f"[{host}]"
    else:
        if not _HOST_RE.fullmatch(host) or ".." in host:
            return None
        host_text = host
    if port is not None and port == 0:
        return None
    cleaned = f"{scheme}://{host_text}" + (f":{port}" if port is not None else "")
    if len(cleaned) > ADDRESS_MAX_LEN:
        return None
    return cleaned


def source_of(setting: str | None) -> str:
    """The setting a stored slot value stands for."""
    if setting is None:
        return SOURCE_AUTO
    if setting == "":
        return SOURCE_NONE
    return SOURCE_SET


@dataclass(frozen=True, slots=True)
class DetectedAddresses:
    """What Home Assistant's own Network settings give, each cleaned."""

    internal: str | None = None
    external: str | None = None
    cloud: str | None = None

    @property
    def local(self) -> str | None:
        """A home network address on ``auto``."""
        return self.internal

    @property
    def remote(self) -> str | None:
        """An internet address on ``auto``: the external URL, else the
        Home Assistant Cloud one."""
        return self.external or self.cloud

    def as_dict(self) -> dict[str, str | None]:
        return {"internal": self.internal, "external": self.external, "cloud": self.cloud}


@dataclass(frozen=True, slots=True)
class AddressRecord:
    """The addresses a watch should use, and where each came from."""

    local_url: str | None
    remote_url: str | None
    local_source: str
    remote_source: str

    @property
    def hash(self) -> str:
        """The first 16 lowercase hex digits of SHA-256 over
        ``local_url|remote_url|local_source|remote_source`` (UTF-8, a null
        address as the empty string). It is over the effective record, so it
        moves on its own when Home Assistant's Network settings change what an
        ``auto`` slot resolves to."""
        joined = "|".join(
            (
                self.local_url or "",
                self.remote_url or "",
                self.local_source,
                self.remote_source,
            )
        )
        return hashlib.sha256(joined.encode("utf-8")).hexdigest()[:16]

    def as_wire(self) -> dict[str, Any]:
        """The ``addresses_get`` reply, and the ``addresses_set`` one."""
        return {
            "ok": True,
            "local_url": self.local_url,
            "remote_url": self.remote_url,
            "local_source": self.local_source,
            "remote_source": self.remote_source,
            "hash": self.hash,
        }


def _resolve(setting: str | None, automatic: str | None) -> tuple[str | None, str]:
    source = source_of(setting)
    if source == SOURCE_AUTO:
        return automatic, source
    if source == SOURCE_NONE:
        return None, source
    # A stored address is cleaned again, so a file edited by hand never puts
    # anything but an address on the wire; one that fails reads as none.
    return sanitize_url(setting), source


def effective_addresses(entry: Any, detected: DetectedAddresses) -> AddressRecord:
    """The record for one device: each slot's setting, resolved against what
    Home Assistant detects. ``entry`` is a WidgetSecretEntry (or anything with
    ``local_url`` and ``remote_url``); a missing attribute reads as auto."""
    local_url, local_source = _resolve(getattr(entry, LOCAL_FIELD, None), detected.local)
    remote_url, remote_source = _resolve(getattr(entry, REMOTE_FIELD, None), detected.remote)
    return AddressRecord(
        local_url=local_url,
        remote_url=remote_url,
        local_source=local_source,
        remote_source=remote_source,
    )


def parse_address_update(payload: Mapping[str, Any]) -> dict[str, str | None]:
    """The slot settings an ``addresses_set`` (or the panel's
    ``set_addresses``) asks for, as the store keeps them.

    A key that is absent leaves its slot alone. ``null`` sets it back to auto
    (None), ``""`` (or only spaces) to none (``""``), and any other string to
    that address, cleaned by ``sanitize_url``. Anything else, or a string
    that is not an address, raises InvalidAddressError naming the slot, and
    nothing is changed: the first bad slot in ADDRESS_FIELDS order is the one
    named.
    """
    changes: dict[str, str | None] = {}
    for field in ADDRESS_FIELDS:
        if field not in payload:
            continue
        raw = payload[field]
        if raw is None:
            changes[field] = None
        elif isinstance(raw, str) and not raw.strip():
            changes[field] = ""
        elif isinstance(raw, str):
            cleaned = sanitize_url(raw)
            if cleaned is None:
                raise InvalidAddressError(field)
            changes[field] = cleaned
        else:
            raise InvalidAddressError(field)
    return changes


def device_addresses(
    hass: Any, secret_store: Any, watch_id: str
) -> tuple[AddressRecord, DetectedAddresses] | None:
    """The record for ``watch_id`` and what Home Assistant detects, or None
    when the device has no entry."""
    entry = secret_store.get(watch_id)
    if entry is None:
        return None
    detected = detected_addresses(hass)
    return effective_addresses(entry, detected), detected


def update_device_addresses(
    hass: Any,
    secret_store: Any,
    coordinator: Any,
    watch_id: str,
    payload: Mapping[str, Any],
) -> tuple[AddressRecord, DetectedAddresses] | None:
    """Apply an ``addresses_set`` (or the panel's ``set_addresses``) to
    ``watch_id`` and return the new record, or None when the device has no
    entry. Raises InvalidAddressError, having changed nothing, for a slot
    that is not an address.

    A change wakes the device's parked poll, which answers at once with the
    new ``addresses`` hash (DeltaCoordinator._addresses_behind), so a watch
    hears of a panel edit without waiting out its long poll.
    """
    changes = parse_address_update(payload)
    changed = secret_store.set_addresses(watch_id, changes)
    if changed is None:
        return None
    if changed and coordinator is not None:
        coordinator.wake_watch(watch_id)
    return device_addresses(hass, secret_store, watch_id)


def addresses_hash_for(hass: Any, secret_store: Any, watch_id: str) -> str | None:
    """The ``addresses`` hash a delta reply carries for ``watch_id``: for
    any paired device, a watch or an iPhone polling for its own pages, and
    None for an unknown id."""
    entry = secret_store.get(watch_id)
    if entry is None:
        return None
    return effective_addresses(entry, detected_addresses(hass)).hash


def detected_addresses(hass: Any) -> DetectedAddresses:
    """What Home Assistant's Network settings give right now, through the
    same ``home_urls`` the pairing QR code uses. Never raises: a lookup that
    fails leaves its value out."""
    try:
        from .pairing_ws import home_urls

        internal, external, cloud = home_urls(hass)
    except Exception:  # noqa: BLE001 (a lookup must not fail a poll or an op)
        return DetectedAddresses()
    return DetectedAddresses(
        internal=sanitize_url(internal),
        external=sanitize_url(external),
        cloud=sanitize_url(cloud),
    )
