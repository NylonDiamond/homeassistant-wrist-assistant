"""One silent background push to the phone when its complications change.

A watch parks a long poll, so a save reaches it the moment the store commits.
An iPhone parks nothing, so until this module existed a phone owner's records
sat on the server until somebody opened the app. This sends the phone a
content-available push instead, and the app runs the same ``complications_sync``
pull it runs at launch, writes the App Group, acks and reloads its widgets.

The transport is ``APNsClient.send_push`` directly rather than ``_deliver_push``
in ``__init__.py``. That path forces a sound on iOS and raises when it finds no
target, and a panel save must never raise into the WebSocket handler that is
waiting on it.

Two timers per owner keep a burst of saves from spending the phone's background
allowance. iOS budgets an app to a few background pushes an hour, so a batch
of commits has to arrive as one push, and a user editing for a minute must not
spend the whole allowance inside it.
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

from .widget_secret_store import DEVICE_KIND_IPHONE, DEVICE_KIND_WATCH

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

    from .apns_client import APNsClient
    from .complication_store import ComplicationStore
    from .notifications import NotificationTokenStore, TokenEntry
    from .widget_secret_store import WidgetSecretStore

_LOGGER = logging.getLogger(__name__)

# Trailing debounce. A save restarts the timer, so a batch the panel writes as
# several commits (a move, a restore, a multi-record change) costs one push,
# sent after the last one. Half a second covers a batch of back-to-back
# WebSocket round trips. It was 2 s while the editor saved on every drag; the
# editor now saves only on Save, and a person watching an open phone was
# waiting out those 2 s for nothing.
_DEBOUNCE_SECONDS = 0.5
# No owner gets a second push inside this. A save during the floor is not
# dropped, it is scheduled for the end of it, so the last save of a long
# editing session always reaches the phone.
_FLOOR_SECONDS = 30.0
# The APNs category. The relay uses it as the collapse id too, so a burst that
# somehow got past the timers still coalesces at Apple rather than on the
# phone.
_PUSH_CATEGORY = "wa_complications"
# The key the app routes on: a push whose ``userInfo`` holds this dictionary is
# a complication pull, anything else is left to the normal notification path.
# Same string as the category, and deliberately so: one name on the wire.
_PUSH_DATA_KEY = "wa_complications"
# Which token entry on a device is the phone's. A watch entry can hold both.
_IOS_PLATFORM = "ios"


class ComplicationPhonePush:
    """Schedules, rate-limits and sends the phone push for one HA instance.

    One per config entry, built at setup and handed to the complication store
    as its commit hook. All of its state is per owner and in memory: the floor
    protects a background budget measured in minutes, and a restart has spent
    none of it.
    """

    def __init__(
        self,
        hass: HomeAssistant,
        *,
        notification_store: NotificationTokenStore,
        widget_secret_store: WidgetSecretStore,
        apns_client: APNsClient | None,
        complication_store: ComplicationStore,
    ) -> None:
        self._hass = hass
        self._notification_store = notification_store
        self._widget_secret_store = widget_secret_store
        self._apns_client = apns_client
        self._complication_store = complication_store
        # owner id → the timer handle for its pending push, if it has one.
        self._pending: dict[str, Any] = {}
        # owner id → the loop clock reading when its last push was dispatched.
        self._last_push: dict[str, float] = {}

    # ── the store's hook ───────────────────────────────────────────────

    def on_commit(self, owner_id: str, token: int) -> None:
        """Schedule a push for the owner whose records just changed.

        Installed on ``ComplicationStore.async_set_push_callback``, so it runs
        inside the save the panel is waiting on. Nothing here may raise: a
        phone that cannot be reached is not a reason to fail a save that is
        already written and already on its way to every other listener.

        ``token`` is the store token this commit produced. It is logged rather
        than sent, because the timers collapse a burst and the push has to
        carry the token the phone will actually find when it pulls.
        """
        try:
            if not self.push_available(owner_id):
                return
            delay = self._delay_for(owner_id)
            self._cancel(owner_id)
            self._pending[owner_id] = self._hass.loop.call_later(
                delay, self._fire, owner_id, "save"
            )
            _LOGGER.debug(
                "Complication push for %s scheduled in %.1fs (commit token %s)",
                owner_id,
                delay,
                token,
            )
        except Exception:
            _LOGGER.warning(
                "Could not schedule a complication push for %s", owner_id, exc_info=True
            )

    # ── the panel's Refresh now ────────────────────────────────────────

    def push_now(self, owner_id: str, reason: str) -> bool:
        """Push this owner at once, ignoring the debounce and the floor.

        A person pressing Refresh now is the one case where waiting is worse
        than spending a slot of the budget. Returns whether a push was
        dispatched, which is all the reply's ``pushed`` claims: the relay's
        verdict arrives later, and whether the phone acted on it arrives later
        still, as the ack the panel already watches for.
        """
        if not self.push_available(owner_id):
            return False
        self._cancel(owner_id)
        self._dispatch(owner_id, reason)
        return True

    # ── what the panel asks about ──────────────────────────────────────

    def push_available(self, owner_id: str) -> bool:
        """Whether anything saved for this owner could reach a phone.

        False for a watch owner, for a phone nobody has registered a token
        for, and when the relay client failed to build at setup. The panel
        reads it to choose between "Sending to the phone" and asking the user
        to open the app once.
        """
        if self._apns_client is None:
            return False
        if self._phone_entry(owner_id) is None:
            return False
        return self._resolve_token(owner_id) is not None

    def seconds_since_push(self, owner_id: str) -> int | None:
        """Seconds since this owner's last push attempt, or None for never.

        This HA run only. The stamp lives in memory with the floor it feeds,
        so a restart reads as "never pushed" rather than inventing a number.
        """
        last = self._last_push.get(owner_id)
        if last is None:
            return None
        return max(0, int(self._hass.loop.time() - last))

    # ── teardown ───────────────────────────────────────────────────────

    def shutdown(self) -> None:
        """Drop every parked timer, on unload and on HA stop.

        A timer that outlives the entry fires against the relay client and the
        store of a setup that is already gone, so at best it sends a push
        nobody asked for and at worst it names a token the reloaded store has
        not reached yet. A reload builds a fresh instance, which schedules its
        own.
        """
        for handle in self._pending.values():
            handle.cancel()
        self._pending.clear()

    # ── timers ─────────────────────────────────────────────────────────

    def _delay_for(self, owner_id: str) -> float:
        """How long the push for a save arriving now should wait."""
        now = self._hass.loop.time()
        fire_at = now + _DEBOUNCE_SECONDS
        last = self._last_push.get(owner_id)
        if last is not None:
            fire_at = max(fire_at, last + _FLOOR_SECONDS)
        return fire_at - now

    def _cancel(self, owner_id: str) -> None:
        handle = self._pending.pop(owner_id, None)
        if handle is not None:
            handle.cancel()

    def _fire(self, owner_id: str, reason: str) -> None:
        self._pending.pop(owner_id, None)
        self._dispatch(owner_id, reason)

    def _dispatch(self, owner_id: str, reason: str) -> None:
        self._hass.async_create_task(self._async_send(owner_id, reason))

    # ── sending ────────────────────────────────────────────────────────

    async def _async_send(self, owner_id: str, reason: str) -> None:
        """Send one push. Never raises; a failed push is a log line."""
        resolved = self._resolve_token(owner_id)
        if resolved is None or self._apns_client is None:
            _LOGGER.debug(
                "No iOS push token for complication owner %s; nothing sent", owner_id
            )
            return
        filed_under, entry = resolved
        # Stamped before the round trip rather than after it. The floor spaces
        # out attempts, and a relay that takes five seconds to answer has
        # already spent the phone's budget by the time it does.
        self._last_push[owner_id] = self._hass.loop.time()
        # Read here, not carried from the commit: the timers collapse a burst
        # into one push, so the number the phone is told has to be the one it
        # will find when it pulls.
        token = self._complication_store.owner_token(owner_id)
        try:
            sent, why, _environment = await self._apns_client.send_push(
                watch_id=filed_under,
                device_token=entry.device_token,
                category=_PUSH_CATEGORY,
                data={_PUSH_DATA_KEY: {"token": token, "reason": reason}},
                sound=None,
                push_type="background",
                environment=entry.environment,
                platform=_IOS_PLATFORM,
            )
        except Exception:
            _LOGGER.warning(
                "Complication push to %s could not be sent", owner_id, exc_info=True
            )
            return
        if sent:
            _LOGGER.debug(
                "Complication push sent to %s (token %s, %s)", owner_id, token, reason
            )
        else:
            _LOGGER.warning("Complication push to %s was refused: %s", owner_id, why)

    # ── finding the phone ──────────────────────────────────────────────

    def _phone_entry(self, owner_id: str) -> Any:
        """The secret store entry for this owner, when it is an iPhone.

        Watch owners are filtered out here rather than deeper down: they keep
        the long-poll wake, which is faster and costs no budget at all.
        """
        entry = self._widget_secret_store.get(owner_id)
        if entry is None or entry.device_kind != DEVICE_KIND_IPHONE:
            return None
        return entry

    def _resolve_token(self, owner_id: str) -> tuple[str, TokenEntry] | None:
        """This phone's iOS token, and the id it is filed under.

        The app registers the phone's token under its companion watch's id, so
        that both of a pair's tokens sit on one entry and ``send_notification``
        can route between them. A phone owner therefore usually has no entry
        of its own, and the token has to be found by asking which watch names
        this phone as its owner, the same walk ``binary_sensor.py`` makes for
        the "push token registered" sensor.

        The id comes back with the entry because ``send_push`` writes the
        refreshed ``relay_token`` back under the id it is given: passing the
        phone's own id for a token filed under a watch would orphan the
        binding and re-register on every push.

        Order: the phone's own id first (a scoped secondary instance with no
        watch credentials does file the token there), then the reverse scan,
        first match wins.
        """
        own = self._notification_store.get_entry(owner_id, _IOS_PLATFORM)
        if own is not None:
            return (owner_id, own)
        for watch_id, secret in self._widget_secret_store.all_entries.items():
            if secret.device_kind != DEVICE_KIND_WATCH:
                continue
            if secret.owner_iphone_id != owner_id:
                continue
            entry = self._notification_store.get_entry(watch_id, _IOS_PLATFORM)
            if entry is not None:
                return (watch_id, entry)
        return None
