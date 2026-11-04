"""Persistent store of widget HMAC secrets keyed by watch_id.

Each paired device has a 32-byte random secret. The device and the watch's
widget extension (through the App Group) keep it locally; HA keeps a copy
here so it can validate HMACs on signed requests.

A pair comes from the iPhone's sign-in through `register_secret`
(`WARegisterSecretView`), from a code a watch or an iPhone shows and a user
confirms in the panel (`pairing_ws.py`), or from a QR code the panel shows and
an iPhone redeems (`WAPairRedeemView`). Either way the entry is bound to a Home
Assistant user, and the secret, never a bearer, is what authorizes the
watch's requests.
"""

from __future__ import annotations

import asyncio
import base64
import logging
import re
from collections.abc import Callable, Mapping
from dataclasses import dataclass, field, replace
from datetime import datetime, timedelta
from typing import Literal

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import WIDGET_SECRET_STORAGE_KEY, WIDGET_SECRET_STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 2

# How long a reply waits for a write it would like on disk first. Past this it
# goes out anyway, and the delayed save finishes the job.
_SAVE_BEFORE_REPLY_SECONDS = 5

# Label values the iOS / watchOS app uses when self-provisioning. Surfaced as
# constants so sensor.py can infer device_kind without re-spelling the strings.
LABEL_IPHONE_SELF_PROVISION = "iphone-self-provision"
LABEL_WATCH_SELF_PROVISION = "watch-self-provision"
# A watch paired by a code a user confirmed in the panel, with no iPhone.
LABEL_WATCH_CODE_PAIR = "watch-code-pair"

DEVICE_KIND_IPHONE = "iphone"
DEVICE_KIND_WATCH = "watch"
# The reserved owner that is not a device at all: the home's design Library
# (see LIBRARY_OWNER_ID in const.py). Nothing ever provisions under it, so no
# entry in this store ever carries this kind; it exists so the owners reply can
# label the one row it synthesizes, and so the panel has a name for it.
DEVICE_KIND_LIBRARY = "library"

# The longest app_version, app_build, device_name or screen_size
# `update_metadata` stores. The same number as `REGISTER_TEXT_MAX_LEN` in
# wa_pair_requests.py, the cap pairing enforces; kept here as well so this
# module needs nothing from that one, and a test holds the two equal.
METADATA_TEXT_MAX_LEN = 256


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

    owner_iphone_id: str | None = None
    """For watch entries, the iphoneId of the iPhone that paired this watch.
    Surfaces in HA's device registry as a `via_device` link so tapping the
    iPhone shows its watches as children. None for iPhone entries themselves
    and for watches paired by an iOS build that predates this field — those
    watches root under the global Wrist Assistant service device instead.

    A leftover of the old phone link: only a bearer registration writes it,
    and the signed metadata refresh never changes it."""

    device_name: str | None = None
    """User-visible device name reported by the app (WKInterfaceDevice.name on
    watchOS, UIDevice.name on iOS with the user-assigned-device-name
    entitlement). Used to set DeviceInfo.name so the user sees "Jesse's Apple
    Watch" instead of "Watch DD2509D8". None for entries written by builds
    that predate this field — DeviceInfo falls back to `Watch <short_id>` /
    `iPhone <short_id>`."""

    screen_size: str | None = None
    """Watch screen size in points, "WIDTHxHEIGHT" (e.g. "208x248"), as
    WKInterfaceDevice.screenBounds reports it. The complication panel matches
    it against its watch-case table so the preview dropdown defaults to the
    selected watch's case. None for entries written by builds that predate
    this field — the panel keeps its 46 mm reference default."""

    user_id: str | None = None
    """Id of the Home Assistant user whose bearer token registered this
    secret. Every HMAC-authenticated request from the device runs under a
    `Context` carrying this user, so Home Assistant applies the same admin
    checks it applies to that user's own calls, and the logbook attributes
    the action to them. This is the mobile_app model: the device is exactly
    as powerful as the person who paired it.

    None for entries written before this field existed. Those run without a
    user (the pre-binding behaviour) until the iPhone's next automatic
    re-provision fills it in; see `register()`."""

    main_house: bool = True
    """Whether this Home Assistant is the house the watch takes its watch
    settings and notification style from. A watch with several homes takes
    them from one, its main house, and says ``"main_house": false`` on every
    ``watch_config_get`` it sends any other; a get of ``behavior`` without
    that says this is the main house again (`note_main_house`). True for
    every watch that never said otherwise: one home, an older app, or an
    iPhone entry. Kept on disk only while False. Not secret material, so a
    `register()` keeps it."""

    phone_pages: bool = False
    """Whether this iPhone's app shows its own pages: it has long polled
    ``/v2/delta`` signed as itself, which only an app with phone pages does
    (`note_phone_pages`). The panel offers a phone for pages only once this
    is True, so a phone on an older app is never handed pages it cannot show.
    False for every watch. Kept on disk only while True. Not secret
    material, so a `register()` keeps it."""

    phone_pages_at: datetime | None = None
    """When this integration first heard the iPhone poll as itself
    (`note_phone_pages`), UTC. The app that does so is the one that moves a
    watch's setup here on its first launch, so once it has polled for
    `MOVE_GRACE` that move has had its chance (`watch_move_may_still_come`).
    None for every watch, for a phone that never polled, and for a phone
    marked before this field until its next poll stamps it. Kept on disk only
    while set. Not secret material, so a `register()` keeps it."""

    local_url: str | None = None
    """The home network address this device should use (watch_addresses.py):
    None to follow Home Assistant's Network settings (``auto``), ``""`` for
    none on purpose, or an address someone set, already cleaned. None for
    every entry from before this field. Kept on disk only while not None.
    Not secret material, so a `register()` keeps it."""

    remote_url: str | None = None
    """The internet address, kept like `local_url`. On ``auto`` it follows
    the external URL, else the Home Assistant Cloud one."""

    move_wait_ended: bool = False
    """A person said this watch's iPhone is gone, so nothing waits for that
    iPhone's move any more (`end_move_wait`, :func:`watch_has_iphone`). Only a
    person's choice sets it; no time or missing entry does. A `register()`
    keeps it while the watch names the same iPhone, and drops it for another
    one, whose move may yet come. Kept on disk only while True."""

    move_finished: bool = False
    """This watch's own iPhone said its move is finished: it retired its copy
    of the watch's key, so nothing more can come from it
    (`finish_move`, :func:`watch_has_iphone`). Only that iPhone sets it, signed
    as itself, and only an app that moves knows the op, so a phone on 3.0.1
    never ends a wait it could still fill. Kept like `move_wait_ended`: a
    `register()` keeps it while the watch names the same iPhone. Kept on disk
    only while True."""

    move_end_heard: bool = False
    """The watch has polled here since its wait ended, so it has had its chance
    to send its own setup (`note_move_end_heard`, :func:`watch_seed_pending`).
    A poll from an app too old to send one does not count. Dropped by a
    `register()` that names another iPhone. Kept on disk only while True."""

    move_end_heard_at: datetime | None = None
    """When that first poll came, UTC, which starts `SEED_LANDING_WINDOW`
    (:func:`watch_seed_may_land`). None for a watch that has not polled since
    its wait ended, and for one that did before this field, whose window is
    long over. Kept and dropped with `move_end_heard`. Kept on disk only while
    set."""

    old_link_setup: bool = False
    """The old phone link set this watch up, and it has since been paired again
    by code, so its label no longer says so. See `holds_old_setup`. Kept on
    disk only while True."""

    standard_settings: bool | None = None
    """What the watch said of its settings (``update_metadata``). True: it runs
    the standard settings, nobody ever changed them. False: it runs its own.
    None: it has not said. Kept on disk only once said."""

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

    @property
    def holds_old_setup(self) -> bool:
        """Whether this is a watch from before the setup move, so it holds a
        setup of its own that Home Assistant may not have seen. The old phone
        link registered every such watch under a label other than the code
        pair's. A watch that a code first paired has never run any other
        setup. Forgetting its iPhone does not change this, and neither does
        pairing it again by code (`old_link_setup`)."""
        if self.device_kind != DEVICE_KIND_WATCH:
            return False
        return self.old_link_setup or self.label != LABEL_WATCH_CODE_PAIR


class WidgetSecretStore:
    """Persistent map of watch_id → WidgetSecretEntry."""

    def __init__(self, hass: HomeAssistant) -> None:
        # A debounced save is waiting (see async_shutdown), and whether the
        # entry has unloaded, after which this instance saves nothing.
        self._save_pending = False
        self._closed = False
        self._secrets: dict[str, WidgetSecretEntry] = {}
        # Private: the file holds every device's key, and each key signs as
        # its device with that device's user's rights. Home Assistant then
        # writes it readable by its own account only, as it does for the
        # client certificates (client_certificate_store.py).
        self._store: Store = Store(
            hass,
            WIDGET_SECRET_STORAGE_VERSION,
            WIDGET_SECRET_STORAGE_KEY,
            private=True,
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
                    owner_iphone_id=entry.get("owner_iphone_id"),
                    device_name=entry.get("device_name"),
                    screen_size=entry.get("screen_size"),
                    user_id=entry.get("user_id"),
                    main_house=entry.get("main_house") is not False,
                    phone_pages=entry.get("phone_pages") is True,
                    phone_pages_at=_stored_time(entry.get("phone_pages_at")),
                    local_url=_stored_address(entry.get("local_url")),
                    remote_url=_stored_address(entry.get("remote_url")),
                    move_wait_ended=entry.get("move_wait_ended") is True,
                    move_finished=entry.get("move_finished") is True,
                    move_end_heard=entry.get("move_end_heard") is True,
                    move_end_heard_at=_stored_time(entry.get("move_end_heard_at")),
                    old_link_setup=entry.get("old_link_setup") is True,
                    standard_settings=(
                        entry["standard_settings"]
                        if isinstance(entry.get("standard_settings"), bool)
                        else None
                    ),
                )
        _LOGGER.debug("Loaded %d widget secrets from storage", len(self._secrets))

    def _schedule_save(self) -> None:
        if self._closed:
            return
        self._save_pending = True
        self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)

    async def async_shutdown(self) -> None:
        """Called on unload: write a save still waiting out its debounce now,
        which cancels the delayed one, and save nothing after. A reload then
        reads every change, and an uninstall that follows removes a file no
        one writes again."""
        self._closed = True
        if not self._save_pending:
            return
        self._save_pending = False
        await self._store.async_save(self._serialize())

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
                    "owner_iphone_id": entry.owner_iphone_id,
                    "device_name": entry.device_name,
                    "screen_size": entry.screen_size,
                    "user_id": entry.user_id,
                    # Only while False, so the file of a watch that never
                    # said otherwise is the one it always was.
                    **({} if entry.main_house else {"main_house": False}),
                    **({"phone_pages": True} if entry.phone_pages else {}),
                    **(
                        {"phone_pages_at": entry.phone_pages_at.isoformat()}
                        if entry.phone_pages_at is not None
                        else {}
                    ),
                    # Only while not auto, so the file of a device that never
                    # had an address set is the one it always was.
                    **(
                        {"local_url": entry.local_url}
                        if entry.local_url is not None
                        else {}
                    ),
                    **(
                        {"remote_url": entry.remote_url}
                        if entry.remote_url is not None
                        else {}
                    ),
                    **({"move_wait_ended": True} if entry.move_wait_ended else {}),
                    **({"move_finished": True} if entry.move_finished else {}),
                    **({"move_end_heard": True} if entry.move_end_heard else {}),
                    **(
                        {"move_end_heard_at": entry.move_end_heard_at.isoformat()}
                        if entry.move_end_heard_at is not None
                        else {}
                    ),
                    **({"old_link_setup": True} if entry.old_link_setup else {}),
                    **(
                        {"standard_settings": entry.standard_settings}
                        if entry.standard_settings is not None
                        else {}
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
        owner_iphone_id: str | None = None,
        device_name: str | None = None,
        screen_size: str | None = None,
        user_id: str | None = None,
    ) -> Literal["new", "rekey", "idempotent"]:
        """Register or replace a secret for a watch.

        `user_id` is the Home Assistant user behind the registering bearer.
        The caller decides whether that user may touch this watch_id (see
        `WARegisterSecretView`); this method only records the outcome. An
        entry that predates user binding (`user_id is None`) takes the
        first user it is re-provisioned by without counting as a rekey, so
        the automatic re-provision after an upgrade binds every existing
        device silently.

        Returns:
            "new"        — first time we've seen this watch_id (first pair).
            "rekey"      — existing watch_id, but secret material or identity
                           changed (user reset the keychain and re-paired the
                           same device, or a different user took it over).
            "idempotent" — everything identical, just refreshing last_provision.
        """
        existing = self._secrets.get(watch_id)
        now = dt_util.utcnow()

        if (
            existing
            and existing.secret_b64 == secret_b64
            and existing.label == label
            and existing.algo == algo
            and existing.app_version == app_version
            and existing.app_build == app_build
            and existing.owner_iphone_id == owner_iphone_id
            and existing.device_name == device_name
            and existing.screen_size == screen_size
            and existing.user_id in (None, user_id)
        ):
            # Idempotent re-provision: secret material + identity unchanged.
            # Still refresh `last_provision` so the iPhone "Last provision"
            # sensor reflects the ping; debounced save keeps disk writes cheap.
            if existing.user_id is None and user_id is not None:
                existing.user_id = user_id
                _LOGGER.info(
                    "Bound widget secret for watch_id=%s to user %s",
                    watch_id,
                    user_id,
                )
            existing.last_provision = now
            self._schedule_save()
            self._notify_listeners()
            return "idempotent"

        self._secrets[watch_id] = WidgetSecretEntry(
            secret_b64=secret_b64,
            label=label,
            algo=algo,
            app_version=app_version,
            app_build=app_build,
            last_provision=now,
            owner_iphone_id=owner_iphone_id,
            device_name=device_name,
            screen_size=screen_size,
            user_id=user_id,
            main_house=existing.main_house if existing is not None else True,
            phone_pages=existing.phone_pages if existing is not None else False,
            phone_pages_at=existing.phone_pages_at if existing is not None else None,
            local_url=existing.local_url if existing is not None else None,
            remote_url=existing.remote_url if existing is not None else None,
            move_wait_ended=(
                existing is not None
                and existing.move_wait_ended
                and existing.owner_iphone_id == owner_iphone_id
            ),
            move_finished=(
                existing is not None
                and existing.move_finished
                and existing.owner_iphone_id == owner_iphone_id
            ),
            move_end_heard=(
                existing is not None
                and existing.move_end_heard
                and existing.owner_iphone_id == owner_iphone_id
            ),
            move_end_heard_at=(
                existing.move_end_heard_at
                if existing is not None and existing.owner_iphone_id == owner_iphone_id
                else None
            ),
            old_link_setup=existing is not None and existing.holds_old_setup,
            standard_settings=existing.standard_settings if existing is not None else None,
        )
        _LOGGER.info(
            "Registered widget secret for watch_id=%s algo=%s app_version=%s owner_iphone_id=%s user=%s",
            watch_id,
            algo,
            app_version,
            owner_iphone_id,
            user_id,
        )
        self._schedule_save()
        self._notify_listeners()
        return "new" if existing is None else "rekey"

    def update_metadata(
        self,
        watch_id: str,
        *,
        app_version: str | None = None,
        app_build: str | None = None,
        device_name: str | None = None,
        screen_size: str | None = None,
        standard_settings: bool | None = None,
    ) -> bool:
        """Update diagnostic metadata on an existing entry without touching the
        secret material, algo, label, user or owner iPhone.

        Backs `op=update_metadata` on /v2/action — the HMAC-signed path an
        already-registered watch uses to report app updates. The bearer-authed
        `register()` remains the only way to write secret material; this
        method deliberately cannot rekey.

        It cannot set `owner_iphone_id` either. There is no owner phone any
        more, and the field is a leftover nothing updates. A signer that could
        name any iPhone here could also name another person's iPhone, and an
        unbound entry would then be bound to that person's user through it.

        None means "leave unchanged" (caller omitted the field), unlike
        `register()` which replaces the whole entry. ``standard_settings`` is
        the watch saying whether it runs only the standard settings; the panel
        words a watch with no settings record by it. Returns False when the
        watch_id has no entry — can only happen on a race with removal, since
        the op's HMAC validation already proved the entry existed.
        """
        entry = self._secrets.get(watch_id)
        if entry is None:
            return False

        # A second line behind the op's own check: a value over the cap
        # pairing enforces is refused here too, and the stored one kept, so
        # no caller can grow the file or the registry name past it.
        def _within_cap(name: str, value: str | None) -> str | None:
            if value is not None and len(value) > METADATA_TEXT_MAX_LEN:
                _LOGGER.warning(
                    "Ignored an over-long %s for watch_id=%s (%d characters)",
                    name,
                    watch_id,
                    len(value),
                )
                return None
            return value

        app_version = _within_cap("app_version", app_version)
        app_build = _within_cap("app_build", app_build)
        device_name = _within_cap("device_name", device_name)
        screen_size = _within_cap("screen_size", screen_size)

        changed = False
        if app_version is not None and entry.app_version != app_version:
            entry.app_version = app_version
            changed = True
        if app_build is not None and entry.app_build != app_build:
            entry.app_build = app_build
            changed = True
        if device_name is not None and entry.device_name != device_name:
            entry.device_name = device_name
            changed = True
        if screen_size is not None and entry.screen_size != screen_size:
            entry.screen_size = screen_size
            changed = True
        if standard_settings is not None and entry.standard_settings != standard_settings:
            entry.standard_settings = standard_settings
            changed = True

        # Refresh the provision timestamp either way — like `register()`'s
        # idempotent branch, a metadata ping is still a "this watch is alive
        # and configured" signal for the Last provision sensor.
        entry.last_provision = dt_util.utcnow()
        self._schedule_save()
        if changed:
            _LOGGER.info(
                "Updated metadata for watch_id=%s app_version=%s",
                watch_id,
                app_version,
            )
            self._notify_listeners()
        return True

    async def async_replace_secret(self, watch_id: str, secret_b64: str) -> bool:
        """Swap a device's secret for a new one, keeping everything else.

        Backs the signed ``rekey`` op: the device sends its new secret sealed
        with its old one, and this is the one write that makes the new one
        the only one. The label, user, owner and metadata stay as they are,
        so a re-key is never a way to change whose device it is. Returns
        False when the device has no entry (a race with removal).

        The file is written before this returns, not after the usual
        debounce. The op signs its reply with the new secret, and the phone
        takes that reply as proof Home Assistant holds the new key and drops
        the old one. A crash inside a debounce window would bring Home
        Assistant back on the old key with the phone holding only the new
        one, and only pairing again would fix that.
        """
        entry = self._secrets.get(watch_id)
        if entry is None:
            return False
        self._secrets[watch_id] = replace(
            entry, secret_b64=secret_b64, last_provision=dt_util.utcnow()
        )
        await self.async_save_now()
        _LOGGER.info("Re-keyed widget secret for watch_id=%s", watch_id)
        return True

    async def async_save_now(self) -> None:
        """Write the file at once, cancelling any debounced save.

        For a write a device will rely on as soon as it hears back (a re-key,
        a sealed pairing's key handed to its device), where losing it to a
        crash would leave the device with a key Home Assistant forgot.
        Nothing after shutdown: the unload wrote the last state.
        """
        if self._closed:
            return
        self._save_pending = False
        await self._store.async_save(self._serialize())

    async def async_save_before_reply(self) -> None:
        """:meth:`async_save_now` for a reply that goes out anyway. A failed or
        slow write never changes the reply: it is logged and the delayed save
        is set going again."""
        try:
            async with asyncio.timeout(_SAVE_BEFORE_REPLY_SECONDS):
                await self.async_save_now()
        except asyncio.CancelledError:
            self._schedule_save()
            raise
        except Exception:  # noqa: BLE001 (the delayed save retries it)
            _LOGGER.warning("Could not write the device keys before replying", exc_info=True)
            self._schedule_save()

    def is_paired_watch(self, watch_id: str) -> bool:
        """Whether ``watch_id`` is a paired watch, not an iPhone and not
        unknown. The watch config store asks this before the panel may make a
        watch's first record."""
        entry = self._secrets.get(watch_id)
        return entry is not None and entry.device_kind == DEVICE_KIND_WATCH

    def is_paired_iphone(self, watch_id: str) -> bool:
        """Whether ``watch_id`` is a paired iPhone. The watch config store
        asks this to keep an iPhone's records to the phone's own kinds and
        settings, and to let the panel make a phone's first record."""
        entry = self._secrets.get(watch_id)
        return entry is not None and entry.device_kind == DEVICE_KIND_IPHONE

    def may_await_move(self, watch_id: str) -> bool:
        """Whether an iPhone may still move this watch's setup here
        (:func:`watch_move_may_still_come`). The watch config store asks this
        before a link or the watch's own seed makes a watch's first record of
        a kind, which would leave that move nothing to send. The owner list's
        ``has_iphone`` and the delta reply's ``may_await_move`` say this same
        thing, so the panel and the watch never disagree on whether the wait
        is over."""
        return watch_move_may_still_come(self._secrets, watch_id, dt_util.utcnow())

    def end_move_wait(self, watch_id: str) -> bool | None:
        """Stop waiting for this watch's iPhone: a person said it is gone.

        Backs the panel's "Use what is on the watch". The watch's own seed
        then lands and the panel opens ready. ``owner_iphone_id`` stays as it
        is: other code reads it for push tokens and for whose device this is,
        and the iPhone may still be around. Returns whether it changed, or
        None for an id that is not a paired watch. No listeners are told: the
        device entities do not show it; the caller wakes the watch's poll.
        """
        entry = self._secrets.get(watch_id)
        if entry is None or entry.device_kind != DEVICE_KIND_WATCH:
            return None
        if entry.move_wait_ended:
            return False
        entry.move_wait_ended = True
        self._schedule_save()
        _LOGGER.info("watch_id=%s no longer waits for its iPhone's move", watch_id)
        return True

    def finish_move(self, watch_id: str, iphone_id: str) -> bool | None:
        """The iPhone that owns this watch says its move is finished.

        Backs the signed ``move_finished`` op. Returns whether it changed, or
        None when ``watch_id`` is not a paired watch naming ``iphone_id`` as
        its owner, so nobody else can end the wait. The caller writes the file
        before it answers and wakes the watch's poll. No listeners are told:
        the device entities do not show it.
        """
        entry = self._secrets.get(watch_id)
        if (
            entry is None
            or entry.device_kind != DEVICE_KIND_WATCH
            or not iphone_id
            or entry.owner_iphone_id != iphone_id
        ):
            return None
        if entry.move_finished:
            return False
        entry.move_finished = True
        self._schedule_save()
        _LOGGER.info("watch_id=%s: its iPhone finished its move", watch_id)
        return True

    def finish_moves_of_other_watches(self, watch_id: str, iphone_id: str) -> list[str]:
        """After an iPhone finished its move for ``watch_id``: end the wait of
        every other watch naming that iPhone as its owner, the ids it changed.
        An iPhone holds one watch's pair per home, so it can never move for
        them. Only the owning iPhone reaches this (:meth:`finish_move` answers
        first). The caller writes the file and wakes their polls."""
        ended = [
            other
            for other, entry in self._secrets.items()
            if other != watch_id
            and iphone_id
            and entry.device_kind == DEVICE_KIND_WATCH
            and entry.owner_iphone_id == iphone_id
            and not entry.move_finished
        ]
        for other in ended:
            self._secrets[other].move_finished = True
            _LOGGER.info("watch_id=%s: its iPhone finished with another watch", other)
        if ended:
            self._schedule_save()
        return ended

    def owner_iphone_moves(self, watch_id: str) -> bool:
        """Whether the iPhone that paired this watch already runs an app that
        moves: it has polled as itself (`phone_pages`). The panel then does not
        tell a person to update that iPhone. False for a watch with no such
        iPhone here, for an iPhone and for an unknown id."""
        entry = self._secrets.get(watch_id)
        if entry is None or entry.device_kind != DEVICE_KIND_WATCH or not entry.owner_iphone_id:
            return False
        phone = self._secrets.get(entry.owner_iphone_id)
        return phone is not None and phone.device_kind == DEVICE_KIND_IPHONE and phone.phone_pages

    def another_iphone_moves(self, watch_id: str) -> bool:
        """Whether another iPhone of this watch's Home Assistant user already
        runs an app that moves, while the iPhone the watch names as its owner
        does not count. That is someone who paired the updated iPhone again
        under a new id. Only words read this: the panel then does not tell that
        person to update an iPhone that is up to date. It ends no wait, and it
        gives that iPhone no right to send ``move_finished``. False for an
        iPhone, an unknown id, a watch with no owner and a watch with no user.
        """
        entry = self._secrets.get(watch_id)
        if entry is None or entry.device_kind != DEVICE_KIND_WATCH or not entry.owner_iphone_id:
            return False
        owner = self._secrets.get(entry.owner_iphone_id)
        user_id = entry.user_id or (owner.user_id if owner is not None else None)
        if not user_id:
            return False
        return any(
            phone.device_kind == DEVICE_KIND_IPHONE
            and phone.phone_pages
            and phone.user_id == user_id
            and phone_id != entry.owner_iphone_id
            for phone_id, phone in self._secrets.items()
        )

    def seed_pending(self, watch_id: str) -> bool:
        """:func:`watch_seed_pending`, now."""
        return watch_seed_pending(self._secrets, watch_id, dt_util.utcnow())

    def seed_may_land(self, watch_id: str) -> bool:
        """:func:`watch_seed_may_land`, now."""
        return watch_seed_may_land(self._secrets, watch_id, dt_util.utcnow())

    def stored_metadata(self, watch_id: str) -> dict[str, str | bool | None] | None:
        """What this store holds of a device's own report, for its poll's reply
        (``stored_metadata``). ``app_version`` is "" when none is stored. A
        watch also gets ``standard_settings``, null until it has said. None for
        an unknown id."""
        entry = self._secrets.get(watch_id)
        if entry is None:
            return None
        stored: dict[str, str | bool | None] = {"app_version": entry.app_version or ""}
        if entry.device_kind == DEVICE_KIND_WATCH:
            stored["standard_settings"] = entry.standard_settings
        return stored

    def note_move_end_heard(self, watch_id: str) -> bool:
        """Record that a watch from before the move polled after its wait
        ended, and when. Called on every ``/v2/delta`` poll; once set it costs
        one lookup. Returns whether it changed. An iPhone, a code paired watch,
        a watch still waiting and an unknown id change nothing. Nor does a
        watch whose app is too old to send its setup: its later update has to
        get the whole of ``SEED_LANDING_WINDOW``."""
        entry = self._secrets.get(watch_id)
        if (
            entry is None
            or entry.move_end_heard
            or not entry.holds_old_setup
            or self.may_await_move(watch_id)
            or too_old_to_seed(entry.app_version)
        ):
            return False
        entry.move_end_heard = True
        entry.move_end_heard_at = dt_util.utcnow()
        self._schedule_save()
        return True

    def note_main_house(self, watch_id: str, main_house: bool) -> bool:
        """Record whether this Home Assistant is `watch_id`'s main house.

        Backs the ``main_house`` field of ``watch_config_get``. Returns
        whether it changed. A watch with no entry, the race with removal the
        other ops share, changes nothing. No listeners are told: the device
        entities do not show it, and the panel reads it with the owners.
        """
        entry = self._secrets.get(watch_id)
        if entry is None or entry.main_house == main_house:
            return False
        entry.main_house = main_house
        self._schedule_save()
        _LOGGER.info(
            "watch_id=%s takes its settings from %s",
            watch_id,
            "this home" if main_house else "another home",
        )
        return True

    def note_phone_pages(self, watch_id: str) -> bool:
        """Record that `watch_id`'s app shows its own pages.

        Called on every ``/v2/delta`` poll an iPhone signs as itself. Returns
        whether it changed: once True it stays True. The first poll also
        stamps ``phone_pages_at``, and so does the first poll of a phone
        marked before that field, which is what starts the move's grace
        (`watch_move_may_still_come`). A watch, or an id with no entry,
        changes nothing. No listeners are told: the device entities do not
        show it, and the panel reads it with the owners.
        """
        entry = self._secrets.get(watch_id)
        if entry is None or entry.device_kind != DEVICE_KIND_IPHONE:
            return False
        if entry.phone_pages and entry.phone_pages_at is not None:
            return False
        changed = not entry.phone_pages
        entry.phone_pages = True
        entry.phone_pages_at = dt_util.utcnow()
        self._schedule_save()
        if changed:
            _LOGGER.info("watch_id=%s runs an iPhone app that shows its own pages", watch_id)
        return changed

    def set_addresses(
        self, watch_id: str, changes: Mapping[str, str | None]
    ) -> bool | None:
        """Write a device's address settings (watch_addresses.py).

        ``changes`` maps ``local_url`` or ``remote_url`` to the setting as
        kept: None for auto, ``""`` for none, or an address already cleaned
        by ``watch_addresses.parse_address_update``, the one parser every
        write path goes through. A slot left out is left alone, and any other
        key is ignored. Returns whether anything changed, or None when the
        device has no entry (the race with removal the other ops share). No
        listeners are told: the device entities do not show it; the caller
        wakes the device's poll.
        """
        entry = self._secrets.get(watch_id)
        if entry is None:
            return None
        changed = False
        for name in ("local_url", "remote_url"):
            if name not in changes:
                continue
            value = changes[name]
            if value is not None and not isinstance(value, str):
                continue
            if getattr(entry, name) != value:
                setattr(entry, name, value)
                changed = True
        if changed:
            self._schedule_save()
            _LOGGER.info(
                "watch_id=%s addresses: local=%r remote=%r",
                watch_id,
                entry.local_url,
                entry.remote_url,
            )
        return changed

    def bind_owned_watches(self, owner_iphone_id: str, user_id: str) -> list[str]:
        """Give every unbound watch paired by `owner_iphone_id` that iPhone's user.

        A watch paired through the iPhone's sign-in belongs to the iPhone's
        user. It refreshes over HMAC, which carries no user, but the iPhone
        re-registers on every app update, so a watch paired before user
        binding gets bound through its owner. A watch paired by code is bound
        to the confirming user at once and has no owner iPhone. Returns the
        watch ids that changed.

        Only this direction exists: the iPhone, already proven to be
        `owner_iphone_id` and bound to `user_id`, binds watches that named it.
        A watch can no longer name an owner after it is registered
        (`update_metadata` ignores the field), so no device can point itself
        at another person's iPhone and inherit that person's user.
        """
        bound: list[str] = []
        for watch_id, entry in self._secrets.items():
            if entry.user_id is None and entry.owner_iphone_id == owner_iphone_id:
                entry.user_id = user_id
                bound.append(watch_id)
        if bound:
            _LOGGER.info(
                "Bound %d watch(es) of iPhone %s to user %s", len(bound), owner_iphone_id, user_id
            )
            self._schedule_save()
            self._notify_listeners()
        return bound

    def get(self, watch_id: str) -> WidgetSecretEntry | None:
        return self._secrets.get(watch_id)

    def resolve_watch_owner_id(self, watch_id: str) -> str | None:
        """For a watch entry, return the iphoneId we should hang it off in HA's
        device registry. Returns None when the watch has no recorded owner OR
        when the recorded owner has no entry of its own — pointing at a ghost
        iPhone would just orphan the watch in the UI."""
        entry = self._secrets.get(watch_id)
        if entry is None or not entry.owner_iphone_id:
            return None
        owner_entry = self._secrets.get(entry.owner_iphone_id)
        if owner_entry is None:
            return None
        return entry.owner_iphone_id

    def remove(self, watch_id: str) -> list[str]:
        """Forget a device. A forgotten iPhone leaves the watches that named
        it with no owner, which ends their wait for its move at once: a person
        chose it, and a phone that comes back must pair them again to name
        them. Returns those watch ids, so the caller can wake their polls."""
        removed = self._secrets.pop(watch_id, None)
        if removed is None:
            return []
        released: list[str] = []
        for other_id, entry in self._secrets.items():
            if entry.owner_iphone_id == watch_id:
                entry.owner_iphone_id = None
                released.append(other_id)
        self._schedule_save()
        self._notify_listeners()
        return released

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


def _stored_address(raw: object) -> str | None:
    """An address setting as read from the file: a string (``""`` for none)
    or None for auto, which anything else reads as. The value is cleaned
    again whenever it is resolved (watch_addresses.effective_addresses)."""
    return raw if isinstance(raw, str) else None


def _stored_time(raw: object) -> datetime | None:
    """A time as read from the file, None for anything that is not one."""
    if not isinstance(raw, str):
        return None
    return dt_util.parse_datetime(raw)


# How long after the watch's iPhone first polls as itself (`phone_pages_at`)
# its one-time move still counts as coming. That app moves the watch's setup
# on its first launch, seconds after the poll, and a failed move tries again
# on every launch, foreground and reconnect. A day is ample for that, and short
# enough that a phone which holds no copy of the watch's key (restored,
# replaced in place, or never linked) stops holding the watch's own copy out.
MOVE_GRACE = timedelta(hours=24)


def watch_move_may_still_come(
    entries: Mapping[str, WidgetSecretEntry], watch_id: str, now: datetime
) -> bool:
    """Whether the watch's iPhone may still move its setup here, for a write
    that would make the watch's first record of a kind (a link, or the
    watch's own seed).

    A watch with no such iPhone (:func:`watch_has_iphone` is False) waits for
    nothing. Otherwise the move counts as coming until the iPhone that paired
    the watch (``owner_iphone_id``) has polled as itself for `MOVE_GRACE`:
    only the app that moves does that, and it moves on its first launch. So a
    kind still without a record after that is one this iPhone cannot send,
    and the watch's own copy is the best there is. Until then, and for good
    while that iPhone has no entry here or still runs an app that never
    polled as itself (3.0.1 and older, whose move comes once it updates),
    it counts as coming: the iPhone holds the uncut setup, and a free
    plan's watch may hold only one page of it.

    Pure over the entries and the time, so it is tested without Home
    Assistant.
    """
    if not watch_has_iphone(entries, watch_id):
        return False
    owner = entries[watch_id].owner_iphone_id or ""
    phone = entries.get(owner)
    if phone is None or phone.device_kind != DEVICE_KIND_IPHONE:
        return True
    if not phone.phone_pages or phone.phone_pages_at is None:
        return True
    return now - phone.phone_pages_at < MOVE_GRACE


# The first app that can move or seed a setup, as the panel's
# `MIN_VERSION_FOR_SETUP_MOVE` says.
MIN_VERSION_TO_SEED = (3, 1, 0)

_VERSION = re.compile(r"\s*v?(\d+)\.(\d+)(?:\.(\d+))?")


def too_old_to_seed(app_version: str | None) -> bool:
    """Whether an app at this version cannot send its setup. Unknown or
    unparseable reads as no, as the panel's `setupMoveNeedsUpdate` does."""
    match = _VERSION.match(app_version) if isinstance(app_version, str) else None
    if match is None:
        return False
    major, minor, patch = match.groups()
    return (int(major), int(minor), int(patch or 0)) < MIN_VERSION_TO_SEED


def watch_seed_pending(
    entries: Mapping[str, WidgetSecretEntry], watch_id: str, now: datetime
) -> bool:
    """Whether a watch from before the setup move has not had its chance to
    send its own setup since the wait for its iPhone ended.

    The panel asks first before a first record then, as that record would stop
    the watch's seed and replace what the watch holds. It only changes words
    and an ask: Home Assistant refuses nothing because of it, and no time ends
    it. A poll does, the first one after the wait ended from an app that can
    send it (:func:`too_old_to_seed`). False while the wait
    lasts (:func:`watch_move_may_still_come` covers that), for a watch a code
    first paired, for an iPhone and for an unknown id.
    """
    entry = entries.get(watch_id)
    if entry is None or not entry.holds_old_setup or entry.move_end_heard:
        return False
    return not watch_move_may_still_come(entries, watch_id, now)


# How long after a watch's first poll since its wait ended its seed may still
# be landing. A seed pass takes seconds, so after this a kind with no record has
# nothing coming: the watch sends nothing for a kind it holds no copy of.
SEED_LANDING_WINDOW = timedelta(minutes=10)


def watch_seed_may_land(
    entries: Mapping[str, WidgetSecretEntry], watch_id: str, now: datetime
) -> bool:
    """Whether a watch from before the setup move polled so lately since its
    wait ended that its own setup may still be landing.

    The panel asks first before a first record of a kind then, and does not say
    flatly that the watch has none. Only that question and those words end with
    this. It is no timer on the wait: :func:`watch_move_may_still_come` does not
    read it, and Home Assistant refuses nothing because of it. False before
    that poll (:func:`watch_seed_pending` covers that), for a watch a code first
    paired, for an iPhone and for an unknown id.
    """
    entry = entries.get(watch_id)
    if entry is None or not entry.holds_old_setup or entry.move_end_heard_at is None:
        return False
    if watch_move_may_still_come(entries, watch_id, now):
        return False
    return now - entry.move_end_heard_at < SEED_LANDING_WINDOW


def watch_has_iphone(entries: Mapping[str, WidgetSecretEntry], watch_id: str) -> bool:
    """Whether an iPhone may still move this watch's setup into Home Assistant.

    Backs the owner list's ``has_iphone``. The phone's one-time move uploads a
    kind only while Home Assistant holds no record of it, so the panel waits
    for it rather than starting a fresh record over it.

    The move signs as the watch, with the copy of the watch's key the phone
    kept from the old phone link. Only a watch the old link set up has such a
    copy, and every one of those names the iPhone that paired it
    (``owner_iphone_id``): the watch refused to register without it, and the
    phone's relay sent its own id. The field keeps the value that
    registration wrote (the watch's metadata refresh no longer changes it).
    So that is the one thing that counts, whether or not that phone has an
    entry here.

    Never for a watch whose key came from a code a user confirmed
    (``LABEL_WATCH_CODE_PAIR``): the watch made that key alone and no phone
    holds it, so no move signed as this watch can land. That covers a new
    watch paired by code, and an old one paired again by code, whose
    metadata refresh may still report its old phone. Another iPhone of the
    same Home Assistant user does not count either: a household where one person
    pairs every watch by code would otherwise wait on every one of them.

    Never once a person said that iPhone is gone: they pressed "Use what is on
    the watch" (``move_wait_ended``), or forgot the iPhone, which clears the
    field (`WidgetSecretStore.remove`). A missing entry alone says nothing, as
    a phone on an old app may have none. Never once that iPhone said its move
    is finished (``move_finished``).

    False for an iPhone entry and an unknown id. Pure over the entries, so it
    is tested without Home Assistant. A part of
    :func:`watch_move_may_still_come`, which is the rule everything else asks.
    """
    entry = entries.get(watch_id)
    if entry is None or entry.device_kind == DEVICE_KIND_IPHONE:
        return False
    if entry.label == LABEL_WATCH_CODE_PAIR or entry.move_wait_ended or entry.move_finished:
        return False
    return bool(entry.owner_iphone_id)


def build_device_info(
    secret_store: WidgetSecretStore,
    watch_id: str,
    *,
    kind: str,
    via_device: tuple[str, str],
    hass: HomeAssistant | None = None,
):
    """Construct a DeviceInfo for a paired watch / iPhone.

    Prefers the user-visible `device_name` reported by the app (e.g. "Jesse's
    Apple Watch") and falls back to the anonymous `Watch <short_id>` /
    `iPhone <short_id>` form for entries that predate the field. Called from
    every entity class so they all agree on what the device is named — the
    HA device registry merges DeviceInfo across entities with matching
    `identifiers`, and inconsistent names across siblings cause flicker as the
    last-registered entity wins.

    When the user has manually renamed the device in HA's UI (which sets
    `name_by_user` on the device registry entry), we omit `name` entirely
    rather than passing the app-reported value. HA's UI already prefers
    `name_by_user` over `name`, but skipping the update also keeps the
    underlying `name` field stable — anything reading the raw record sees
    the user's intent untouched. Requires `hass` to perform the lookup;
    callers that pass `hass=None` (e.g. during pre-setup wiring) get the
    legacy unconditional-write behavior, which is safe for first-create.

    Lives in this module rather than each platform file so adding a new sensor
    can't accidentally drift to a different naming scheme.
    """
    # Local import dodges a top-level dependency on homeassistant.helpers from
    # this otherwise-pure storage module. Tests import WidgetSecretEntry without
    # a Home Assistant runtime; keeping the import inside the function lets
    # them keep doing that.
    from homeassistant.helpers.device_registry import DeviceInfo
    from homeassistant.helpers.device_registry import (
        async_get as async_get_device_registry,
    )

    from .const import PANEL_CONFIGURATION_URL
    from .device_lookup import (
        find_paired_device,
        paired_identifier,
        parent_device_fields,
    )

    short_id = watch_id[:8]
    entry = secret_store.get(watch_id)
    if kind == DEVICE_KIND_IPHONE:
        default_name = f"iPhone {short_id}"
        model = "iPhone"
    else:
        default_name = f"Watch {short_id}"
        model = "Apple Watch"
    name: str | None = (
        entry.device_name if entry is not None and entry.device_name else default_name
    )

    # Respect manual renames: if the device already exists in HA's registry
    # with `name_by_user` set, don't push a new `name` value. HA leaves the
    # stored `name` alone when DeviceInfo omits the field.
    dev_reg = async_get_device_registry(hass) if hass is not None else None
    if dev_reg is not None:
        existing = find_paired_device(dev_reg, watch_id)
        if existing is not None and existing.name_by_user:
            name = None

    info = DeviceInfo(
        identifiers={paired_identifier(watch_id)},
        manufacturer="Wrist Assistant",
        model=model,
        # "Visit" on the device page opens the panel, where the device is set up.
        configuration_url=PANEL_CONFIGURATION_URL,
        **parent_device_fields(dev_reg, via_device),
    )
    if name is not None:
        info["name"] = name
    return info
