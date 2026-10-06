"""Push notification token storage for Wrist Assistant.

The legacy bearer-authed `NotificationRegisterView` was removed when the
watch transport went pure-v2; the watch now registers its push token via
`op=notifications_register` on `/v2/action`. The token store and APNs
helpers below are still the single source of truth for the runtime.
"""

from __future__ import annotations

import logging
from collections.abc import Callable, Iterable, Mapping
from dataclasses import dataclass, field
from typing import Any, Literal

from homeassistant.helpers.storage import Store

from .const import NOTIFICATION_TOKEN_STORAGE_KEY, NOTIFICATION_TOKEN_STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)

PLATFORM_IOS = "ios"
PLATFORM_WATCHOS = "watchos"
DELIVERY_MODE_MIRROR = "mirror"
DELIVERY_MODE_DIRECT = "direct"
# `widget_secret_store.DEVICE_KIND_IPHONE`, repeated so this module stays free
# of that one's Home Assistant imports and the routing below stays pure.
_DEVICE_KIND_IPHONE = "iphone"


def _normalize_environment(environment: object) -> str:
    """Normalize APNs environment values stored by the integration."""
    if environment == "development":
        return "development"
    return "production"


@dataclass(slots=True)
class TokenEntry:
    """Stored device token for a watch."""

    device_token: str
    platform: str
    environment: str  # "development" or "production"
    relay_token: str | None = None


class NotificationTokenStore:
    """Persistent store of device id → {platform → APNs device token}.

    The key is the id of the device that signed the registration. A watch
    holds its own ``watchos`` token (watch-direct delivery), and an iPhone
    holds its own ``ios`` token (the phone-mirror fast path). Since step 6 the
    iPhone files under its own id; Home Assistant pairs it with the watches of
    the same Home Assistant user at send time (``resolve_push_routes``).
    Before that the iPhone filed under its companion watch's id, and
    ``migrate_ios_tokens_to_phones`` moves those entries once.
    """

    def __init__(self, hass: HomeAssistant) -> None:
        # device id -> platform -> TokenEntry
        self._tokens: dict[str, dict[str, TokenEntry]] = {}
        # watch_id -> arbitrary per-watch metadata, e.g. {"delivery_mode": "mirror"}.
        # Kept separate from _tokens so it can never leak into routing iteration.
        self._watch_meta: dict[str, dict] = {}
        # Whether the one-time move of iOS tokens from watch ids to their
        # phones has run on this install (`migrate_ios_tokens_to_phones`).
        self._ios_tokens_moved = False
        self._store: Store = Store(
            hass,
            NOTIFICATION_TOKEN_STORAGE_VERSION,
            NOTIFICATION_TOKEN_STORAGE_KEY,
        )
        self._listeners: list[Callable[[], None]] = []

    async def async_load(self) -> None:
        """Load persisted tokens from disk, migrating the legacy shape.

        Legacy (single-token) records stored ``tokens[watch_id]`` as a flat
        ``{device_token, platform, ...}`` dict. The current shape nests by
        platform: ``tokens[watch_id] = {platform: {device_token, ...}}``. Both
        are accepted so a live install upgrades without wiping registrations.
        """
        data = await self._store.async_load()
        if not data or not isinstance(data, dict):
            return
        tokens = data.get("tokens", {})
        for watch_id, entry in tokens.items():
            if not isinstance(entry, dict):
                continue
            if "device_token" in entry:
                # Legacy flat record — wrap under its platform.
                parsed = self._parse_entry(entry)
                if parsed is not None:
                    self._tokens[watch_id] = {parsed.platform: parsed}
            else:
                # Current nested-by-platform record.
                by_platform: dict[str, TokenEntry] = {}
                for platform, raw in entry.items():
                    if isinstance(raw, dict):
                        parsed = self._parse_entry(raw, default_platform=platform)
                        if parsed is not None:
                            by_platform[parsed.platform] = parsed
                if by_platform:
                    self._tokens[watch_id] = by_platform
        meta = data.get("watch_metadata", {})
        if isinstance(meta, dict):
            self._watch_meta = {
                watch_id: dict(m)
                for watch_id, m in meta.items()
                if isinstance(m, dict)
            }
        self._ios_tokens_moved = data.get("ios_tokens_moved") is True
        _LOGGER.debug(
            "Loaded notification tokens for %d watches from storage",
            len(self._tokens),
        )

    @staticmethod
    def _parse_entry(
        raw: dict, default_platform: str = "watchos"
    ) -> TokenEntry | None:
        device_token = raw.get("device_token")
        if not isinstance(device_token, str) or not device_token:
            return None
        return TokenEntry(
            device_token=device_token,
            platform=raw.get("platform", default_platform),
            environment=_normalize_environment(raw.get("environment")),
            relay_token=raw.get("relay_token"),
        )

    def _serialize(self) -> dict:
        """Serialize tokens for storage (nested-by-platform shape)."""
        data: dict = {
            "tokens": {
                watch_id: {
                    platform: {
                        "device_token": entry.device_token,
                        "platform": entry.platform,
                        "environment": entry.environment,
                        "relay_token": entry.relay_token,
                    }
                    for platform, entry in by_platform.items()
                }
                for watch_id, by_platform in self._tokens.items()
            },
            "watch_metadata": {
                watch_id: dict(m) for watch_id, m in self._watch_meta.items()
            },
        }
        if self._ios_tokens_moved:
            data["ios_tokens_moved"] = True
        return data

    def register(
        self,
        watch_id: str,
        device_token: str,
        platform: str = "watchos",
        environment: str = "production",
        relay_token: str | None = None,
    ) -> Literal["new", "updated", "idempotent"]:
        """Store or update a device token for a (watch_id, platform).

        Returns:
            "new"        — first token we've seen for this watch_id+platform.
            "updated"    — replaces a different token or environment (APNs
                           re-issue, environment flip, etc.).
            "idempotent" — same token + environment as before; no state change.
        """
        platform = platform if isinstance(platform, str) and platform else "watchos"
        normalized_environment = _normalize_environment(environment)
        by_platform = self._tokens.setdefault(watch_id, {})
        existing = by_platform.get(platform)
        if (
            existing
            and existing.device_token == device_token
            and existing.environment == normalized_environment
            and (
                relay_token is None
                or existing.relay_token == relay_token
            )
        ):
            return "idempotent"
        # A relay_token is only valid for the device_token it was bound to at
        # the relay. When the incoming device_token differs from what we hold
        # (e.g. APNs re-issued it after a reinstall/update), the cached
        # relay_token is stale — drop it so the next send re-registers and
        # rebinds at the relay. Keeping it would send (new device_token, old
        # relay_token), which the relay rejects as device_token_mismatch.
        if relay_token is not None:
            resolved_relay_token = relay_token
        elif existing is not None and existing.device_token == device_token:
            resolved_relay_token = existing.relay_token
        else:
            resolved_relay_token = None
        by_platform[platform] = TokenEntry(
            device_token=device_token,
            platform=platform,
            environment=normalized_environment,
            relay_token=resolved_relay_token,
        )
        _LOGGER.info(
            "Registered push token for watch_id=%s (platform=%s, environment=%s)",
            watch_id,
            platform,
            normalized_environment,
        )
        self._store.async_delay_save(self._serialize, 5)
        self._notify_listeners()
        return "new" if existing is None else "updated"

    def get_token(self, watch_id: str, platform: str | None = None) -> str | None:
        """Return a device token for a watch, or None.

        With no platform, prefers the watch-direct token, then any token —
        preserving the pre-dual-token single-token callers.
        """
        entry = self.get_entry(watch_id, platform)
        return entry.device_token if entry else None

    def get_entry(
        self, watch_id: str, platform: str | None = None
    ) -> TokenEntry | None:
        """Return the token entry for a watch (optionally a specific platform).

        With no platform, prefers ``watchos`` then any registered platform, so
        existence checks and legacy single-token callers keep working.
        """
        by_platform = self._tokens.get(watch_id)
        if not by_platform:
            return None
        if platform is not None:
            return by_platform.get(platform)
        return by_platform.get("watchos") or next(iter(by_platform.values()), None)

    def get_entries(self, watch_id: str) -> dict[str, TokenEntry]:
        """Return all platform entries for a watch (empty if none)."""
        return dict(self._tokens.get(watch_id, {}))

    def get_watch_metadata(self, watch_id: str, key: str, default=None):
        """Return a per-watch metadata value (e.g. ``delivery_mode``), or default."""
        return self._watch_meta.get(watch_id, {}).get(key, default)

    def set_watch_metadata(self, watch_id: str, key: str, value) -> None:
        """Set a per-watch metadata value, persisting only on change."""
        meta = self._watch_meta.setdefault(watch_id, {})
        if meta.get(key) == value:
            return
        meta[key] = value
        self._store.async_delay_save(self._serialize, 5)
        # Notify so diagnostic entities (e.g. the Delivery mode sensor) reflect
        # a mode change as soon as the app pushes it, not on the next restart.
        self._notify_listeners()

    @property
    def all_tokens(self) -> dict[str, TokenEntry]:
        """Return one representative entry per watch_id (watchos preferred).

        Kept for diagnostics and legacy callers that expect a flat
        watch_id → TokenEntry mapping.
        """
        result: dict[str, TokenEntry] = {}
        for watch_id, by_platform in self._tokens.items():
            entry = by_platform.get("watchos") or next(iter(by_platform.values()), None)
            if entry is not None:
                result[watch_id] = entry
        return result

    @property
    def all_entries(self) -> dict[str, dict[str, TokenEntry]]:
        """Return every watch_id's full platform map. Used by routing."""
        return {wid: dict(by) for wid, by in self._tokens.items()}

    def remove(self, watch_id: str, platform: str | None = None) -> None:
        """Remove a watch's token(s).

        With no platform, removes the whole watch (all platforms). With a
        platform, removes just that token — so a dead iOS token doesn't take
        the still-valid watch-direct token with it.
        """
        changed = False
        if platform is None:
            if self._tokens.pop(watch_id, None) is not None:
                changed = True
            if self._watch_meta.pop(watch_id, None) is not None:
                changed = True
        else:
            by_platform = self._tokens.get(watch_id)
            if by_platform and by_platform.pop(platform, None) is not None:
                changed = True
                if not by_platform:
                    self._tokens.pop(watch_id, None)
        if changed:
            self._store.async_delay_save(self._serialize, 5)
            self._notify_listeners()

    def delivery_modes(self) -> dict[str, str]:
        """Every watch's stored ``delivery_mode``; a watch not listed is "mirror"."""
        return {
            watch_id: meta["delivery_mode"]
            for watch_id, meta in self._watch_meta.items()
            if isinstance(meta.get("delivery_mode"), str)
        }

    def drop_ios_copies(self, device_token: str, keep_id: str) -> int:
        """Remove ``ios`` entries holding ``device_token`` under any id but ``keep_id``.

        A phone that registers its token under its own id leaves no copy of
        it filed under a watch (an old app's companion registration, or a
        leftover the migration could not place). Returns how many went.
        """
        removed = 0
        for store_id in list(self._tokens):
            if store_id == keep_id:
                continue
            by_platform = self._tokens[store_id]
            entry = by_platform.get(PLATFORM_IOS)
            if entry is None or entry.device_token != device_token:
                continue
            del by_platform[PLATFORM_IOS]
            if not by_platform:
                del self._tokens[store_id]
            removed += 1
        if removed:
            self._store.async_delay_save(self._serialize, 5)
            self._notify_listeners()
        return removed

    @property
    def ios_tokens_moved(self) -> bool:
        """Whether `migrate_ios_tokens_to_phones` has run on this install."""
        return self._ios_tokens_moved

    def migrate_ios_tokens_to_phones(self, secrets: Mapping[str, Any]) -> dict[str, int] | None:
        """Once: move each ``ios`` token filed under a watch to the phone that owns it.

        Before step 6 the iPhone filed its token under its companion watch's
        id. The token now lives under the phone's own id, so this moves every
        such entry (relay token included, since the relay binds it to the
        device token, not to the id) to the watch's owner phone
        (`owning_phone_id`). When that phone already holds an ``ios`` token
        the phone's is kept and the watch's copy dropped. A token whose phone
        cannot be found stays where it is; routing still reads it there.

        ``secrets`` is the widget secret store's ``all_entries``. Runs once:
        the store file then carries ``ios_tokens_moved: true``. Returns the
        counts, or None when it had already run. Logs counts, never tokens.
        """
        if self._ios_tokens_moved:
            return None
        counts = {"moved": 0, "dropped": 0, "left": 0}
        for store_id in list(self._tokens):
            by_platform = self._tokens[store_id]
            entry = by_platform.get(PLATFORM_IOS)
            if entry is None or is_iphone_entry(secrets.get(store_id)):
                continue
            phone_id = owning_phone_id(secrets, store_id)
            if phone_id is None:
                counts["left"] += 1
                continue
            del by_platform[PLATFORM_IOS]
            if not by_platform:
                del self._tokens[store_id]
            phone_tokens = self._tokens.setdefault(phone_id, {})
            if PLATFORM_IOS in phone_tokens:
                counts["dropped"] += 1
            else:
                phone_tokens[PLATFORM_IOS] = entry
                counts["moved"] += 1
        self._ios_tokens_moved = True
        self._store.async_delay_save(self._serialize, 5)
        if counts["moved"] or counts["dropped"]:
            self._notify_listeners()
        _LOGGER.info(
            "Moved iPhone push tokens to their phones: %d moved, %d dropped "
            "(the phone already had one), %d left under a watch (no phone found)",
            counts["moved"],
            counts["dropped"],
            counts["left"],
        )
        return counts

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
                _LOGGER.exception("Notification token store listener raised")


# ── pairing a phone's token with a watch, by Home Assistant user ──────────
#
# Pure functions over the widget secret store's entries (anything with
# `device_kind`, `user_id` and `owner_iphone_id`), the token store's entries
# and the watches' delivery modes, so the routing is tested without Home
# Assistant. Step 6 of the phone and watch link removal: the phone never names
# a watch; Home Assistant pairs it with the watches of the same user.


def is_iphone_entry(secret: Any) -> bool:
    return secret is not None and getattr(secret, "device_kind", None) == _DEVICE_KIND_IPHONE


def owning_phone_id(secrets: Mapping[str, Any], watch_id: str) -> str | None:
    """The phone a watch's old companion ``ios`` token belongs to, for the move.

    The watch's ``owner_iphone_id`` when that is a known iPhone entry, else
    the only iPhone entry of the watch's user. None when neither finds one.
    """
    secret = secrets.get(watch_id)
    if secret is None:
        return None
    owner = getattr(secret, "owner_iphone_id", None)
    if owner and is_iphone_entry(secrets.get(owner)):
        return owner
    user_id = getattr(secret, "user_id", None)
    if user_id is None:
        return None
    phones = [
        phone_id
        for phone_id, phone in secrets.items()
        if is_iphone_entry(phone) and getattr(phone, "user_id", None) == user_id
    ]
    return phones[0] if len(phones) == 1 else None


def watch_phone_ids(
    secrets: Mapping[str, Any],
    tokens: Mapping[str, Mapping[str, TokenEntry]],
    watch_id: str,
) -> list[str]:
    """The ids of the phones a Fast alert for this watch goes to, sorted.

    Every iPhone entry holding an ``ios`` token whose Home Assistant user is
    the watch's. For a watch bound to no user, its ``owner_iphone_id`` phone
    when that holds an ``ios`` token. Plus the watch's own id when an ``ios``
    token is still filed there (a leftover the move could not place, or an
    old app's registration).
    """
    secret = secrets.get(watch_id)
    user_id = getattr(secret, "user_id", None) if secret is not None else None
    phone_ids: list[str] = []
    if user_id is not None:
        phone_ids = sorted(
            phone_id
            for phone_id, phone in secrets.items()
            if phone_id != watch_id
            and is_iphone_entry(phone)
            and getattr(phone, "user_id", None) == user_id
            and PLATFORM_IOS in tokens.get(phone_id, {})
        )
    elif secret is not None:
        owner = getattr(secret, "owner_iphone_id", None)
        if owner and owner != watch_id and PLATFORM_IOS in tokens.get(owner, {}):
            phone_ids = [owner]
    if PLATFORM_IOS in tokens.get(watch_id, {}):
        phone_ids.append(watch_id)
    return phone_ids


def phone_watch_ids(secrets: Mapping[str, Any], phone_id: str) -> list[str]:
    """The watches whose Fast alerts reach this phone, sorted.

    The other side of `watch_phone_ids`, without the token check: the
    watches of the phone's Home Assistant user, and any watch bound to no
    user that names this phone as its owner.
    """
    phone = secrets.get(phone_id)
    user_id = getattr(phone, "user_id", None) if phone is not None else None
    watch_ids: list[str] = []
    for watch_id, secret in secrets.items():
        if watch_id == phone_id or is_iphone_entry(secret):
            continue
        watch_user = getattr(secret, "user_id", None)
        if watch_user is not None:
            if user_id is not None and watch_user == user_id:
                watch_ids.append(watch_id)
        elif getattr(secret, "owner_iphone_id", None) == phone_id:
            watch_ids.append(watch_id)
    return sorted(watch_ids)


@dataclass(slots=True)
class PushRoute:
    """One send: a token, the id it is filed under, and what led to it.

    ``store_id`` is where the token lives, so a dead token is removed there
    and a refreshed relay token is written back there. ``targets`` are the
    watches (or the phone) whose alert chose this token; a token two watches
    lead to is still sent once.
    """

    store_id: str
    entry: TokenEntry
    targets: list[str] = field(default_factory=list)


def resolve_push_routes(
    secrets: Mapping[str, Any],
    tokens: Mapping[str, Mapping[str, TokenEntry]],
    modes: Mapping[str, str],
    target_ids: Iterable[str] | None = None,
) -> list[PushRoute]:
    """Which tokens one alert goes to.

    ``secrets`` is the widget secret store's ``all_entries``, ``tokens`` the
    token store's ``all_entries`` and ``modes`` its `delivery_modes` (a
    watch not listed is "mirror"). ``target_ids`` are the ids a service call
    named, or None for an alert to every watch.

    For a target watch W, with W's phones from `watch_phone_ids`:

    * "mirror": W's phones; with none, W's own ``watchos`` token.
    * "direct": W's ``watchos`` token; with none, W's phones.

    A target that is an iPhone entry is sent to that phone's own token. With
    no target, every watch is a target: each id in the secret store that is
    not an iPhone, and each id in the token store that is not one either. A
    phone is reached only through a watch of its user or by being named, so
    someone who installed the app for its widgets alone gets no alerts.

    Each device token is sent once per alert, whichever targets led to it.
    The order is stable: targets sorted, then each target's tokens in order.
    """
    if target_ids is None:
        ids = {wid for wid, secret in secrets.items() if not is_iphone_entry(secret)}
        ids.update(wid for wid in tokens if not is_iphone_entry(secrets.get(wid)))
        ordered = sorted(ids)
    else:
        ordered = list(dict.fromkeys(target_ids))

    routes: list[PushRoute] = []
    by_token: dict[str, PushRoute] = {}

    def add(target: str, store_id: str, entry: TokenEntry | None) -> None:
        if entry is None:
            return
        route = by_token.get(entry.device_token)
        if route is None:
            route = PushRoute(store_id=store_id, entry=entry)
            by_token[entry.device_token] = route
            routes.append(route)
        if target not in route.targets:
            route.targets.append(target)

    for target in ordered:
        own = tokens.get(target, {})
        if is_iphone_entry(secrets.get(target)):
            add(target, target, own.get(PLATFORM_IOS) or next(iter(own.values()), None))
            continue
        phones = [
            (phone_id, tokens[phone_id][PLATFORM_IOS])
            for phone_id in watch_phone_ids(secrets, tokens, target)
        ]
        watch_entry = own.get(PLATFORM_WATCHOS)
        if modes.get(target, DELIVERY_MODE_MIRROR) == DELIVERY_MODE_DIRECT:
            chosen = [(target, watch_entry)] if watch_entry is not None else phones
        else:
            chosen = phones or ([(target, watch_entry)] if watch_entry is not None else [])
        for store_id, entry in chosen:
            add(target, store_id, entry)
    return routes
