"""Logbook entries for Wrist Assistant lifecycle moments.

Fires user-visible events into HA's built-in Logbook view (System →
Logbook) for the moments a user actually cares about when something is
going wrong: a new device pairing, a watch dropping off, repeated HMAC
failures. The volume is intentionally low — these aren't debug
breadcrumbs (use `_LOGGER.debug` for those) — they're "tell the user
something interesting happened" events.

All entries are addressed to the device registry entry for the watch or
iPhone they describe, so the Logbook view's per-device filter works out
of the box: click into the Watch device in HA's UI and you'll see its
pair / sync / drop history without any further config.
"""

from __future__ import annotations

import logging

from homeassistant.components import logbook
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr

from .const import DOMAIN
from .widget_secret_store import (
    DEVICE_KIND_IPHONE,
    LABEL_IPHONE_SELF_PROVISION,
)

_LOGGER = logging.getLogger(__name__)


def _short(watch_id: str) -> str:
    return watch_id[:8]


def _device_name(hass: HomeAssistant, watch_id: str, *, kind: str) -> str:
    """Resolve the user-visible device name for a watch_id. Falls back to a
    short form if the device registry entry hasn't been created yet (e.g. an
    iPhone whose sensors are about to be added in this same tick)."""
    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_device(identifiers={(DOMAIN, f"watch_{watch_id}")})
    if device is not None and device.name:
        return device.name
    prefix = "iPhone" if kind == DEVICE_KIND_IPHONE else "Watch"
    return f"{prefix} {_short(watch_id)}"


def _entity_id_for(watch_id: str, *, kind: str) -> str | None:
    """A stable entity_id the Logbook view can scope the entry to. We use the
    per-device "last activity" / "last provision" sensor since it exists for
    both watches and iPhones in the registry. Returns None if the kind is
    unknown — Logbook still accepts entries without an entity_id."""
    if kind == DEVICE_KIND_IPHONE:
        return f"sensor.iphone_{_short(watch_id)}_last_provision"
    return f"sensor.watch_{_short(watch_id)}_last_activity"


def log_secret_registered(
    hass: HomeAssistant,
    *,
    watch_id: str,
    label: str | None,
    app_version: str | None,
) -> None:
    """Fire a Logbook entry the first time a new (watch_id, secret) pair is
    written. Idempotent re-provisions don't fire — `WidgetSecretStore.register`
    returns False for those and the caller skips this helper."""
    kind = (
        DEVICE_KIND_IPHONE
        if label == LABEL_IPHONE_SELF_PROVISION
        else "watch"
    )
    name = _device_name(hass, watch_id, kind=kind)
    suffix = f" (app {app_version})" if app_version else ""
    logbook.async_log_entry(
        hass,
        name,
        f"paired with Home Assistant{suffix}",
        DOMAIN,
        _entity_id_for(watch_id, kind=kind),
    )


def log_secret_reprovisioned(
    hass: HomeAssistant,
    *,
    watch_id: str,
    label: str | None,
    app_version: str | None,
) -> None:
    """Fire when a known watch_id re-provisions with new secret material — the
    "I reset my keychain and re-paired the same watch" case. Distinct from
    `log_secret_registered` (first-pair) so the user can tell first-pair apart
    from a key roll in the Logbook history."""
    kind = (
        DEVICE_KIND_IPHONE
        if label == LABEL_IPHONE_SELF_PROVISION
        else "watch"
    )
    name = _device_name(hass, watch_id, kind=kind)
    suffix = f" (app {app_version})" if app_version else ""
    logbook.async_log_entry(
        hass,
        name,
        f"re-paired with Home Assistant{suffix}",
        DOMAIN,
        _entity_id_for(watch_id, kind=kind),
    )


def log_push_token_registered(
    hass: HomeAssistant,
    *,
    watch_id: str,
    is_new: bool,
) -> None:
    """Fire when a watch registers (or rotates) its APNs push token with HA.
    `is_new=True` means this is the first token we've ever stored for this
    watch_id; False means we replaced an older token (APNs re-issue, build
    flip between dev and prod, etc.)."""
    name = _device_name(hass, watch_id, kind="watch")
    verb = "registered a push token" if is_new else "rotated its push token"
    logbook.async_log_entry(
        hass,
        name,
        verb,
        DOMAIN,
        _entity_id_for(watch_id, kind="watch"),
    )


def log_first_sync(hass: HomeAssistant, *, watch_id: str) -> None:
    """Fire when a watch_id appears in DeltaCoordinator for the first time —
    i.e. its first authenticated /v2/delta call after pairing. Distinct from
    "secret registered" because there can be a delay (or a never) between
    iPhone-side provisioning and the watch actually reaching HA."""
    name = _device_name(hass, watch_id, kind="watch")
    logbook.async_log_entry(
        hass,
        name,
        "completed first sync",
        DOMAIN,
        _entity_id_for(watch_id, kind="watch"),
    )


def log_session_dropped(hass: HomeAssistant, *, watch_id: str, reason: str) -> None:
    """Fire when a watch session is torn down — either explicit cancel or TTL
    expiry. The reason ("idle_ttl", "client_disconnect", etc.) lands in the
    Logbook message so a user can tell "I unpaired it" apart from "it fell off
    Wi-Fi and timed out."""
    name = _device_name(hass, watch_id, kind="watch")
    logbook.async_log_entry(
        hass,
        name,
        f"disconnected ({reason})",
        DOMAIN,
        _entity_id_for(watch_id, kind="watch"),
    )


def log_hmac_failure(
    hass: HomeAssistant,
    *,
    watch_id: str | None,
    reason: str,
    is_known_watch: bool,
) -> None:
    """Fire when an HMAC-signed request is rejected. Volume control: only fire
    when the watch is a known/paired one — anonymous probes and bogus watch_id
    values would otherwise fill the user's Logbook with attacker noise. View
    callers should set `is_known_watch=False` when the rejection is
    "unknown_watch" or when no entry exists in the secret store."""
    if not watch_id or not is_known_watch:
        return
    # Reasons that aren't worth surfacing to the user — they describe
    # malformed/probing requests that don't correspond to a real device
    # malfunction. `_LOGGER.debug` in the view already captures these.
    if reason in {"missing_headers", "invalid_version", "unsupported_version"}:
        return
    name = _device_name(hass, watch_id, kind="watch")
    logbook.async_log_entry(
        hass,
        name,
        f"rejected a signed request ({reason})",
        DOMAIN,
        _entity_id_for(watch_id, kind="watch"),
    )
