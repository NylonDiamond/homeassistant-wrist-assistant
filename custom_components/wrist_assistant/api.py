"""Long-poll delta coordinator for Wrist Assistant.

The HTTP wrappers for the watch's traffic now live in `wa_v2_views.py`
under `/api/wrist_assistant/v2/*`. This module owns the coordinator,
session bookkeeping, and the info_summary computation that v2 op
handlers call directly.
"""

from __future__ import annotations

import asyncio
from collections import deque
from collections.abc import Callable, Iterable
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import hashlib
import logging
import secrets
from typing import Any

from homeassistant.const import EVENT_STATE_CHANGED
from homeassistant.core import Event, HomeAssistant, State, callback
from homeassistant.helpers.template import Template
from homeassistant.util import dt as dt_util

from .logbook_events import log_first_sync


DEFAULT_TIMEOUT_SECONDS = 45
MIN_TIMEOUT_SECONDS = 5
MAX_TIMEOUT_SECONDS = 55
# A watch re-polls right after each reply; a gap longer than this between
# two polls means it is not holding a poll here any more (is_polling).
POLL_GAP_SECONDS = 10
MAX_EVENTS_BUFFER = 5000
MAX_EVENTS_PER_RESPONSE = 250
SESSION_TTL = timedelta(minutes=5)
# How long a parked poll waits after a wake before it collects, so a burst
# (a scene setting a dozen lights) goes out as one reply, not a dozen.
WAKE_COALESCE_SECONDS = 0.15
# A watch told about a new complication token polls again at once while its
# pull runs, still reporting the old one. That poll is not a lost hint, so a
# lagging report is told again only once the first telling is this old.
TOKEN_REPEAT_AFTER_SECONDS = 20.0
# The watch config kinds the delta reply names, as `watch_config: {kind: rev}`.
# The eight a watch applies (WATCH_CONFIG_PANEL_KINDS in const.py). Never the
# catalog, which only the phone and the panel read.
DELTA_WATCH_CONFIG_KINDS = (
    "pages",
    "behavior",
    "menus",
    "voice",
    "notification_style",
    "status_pages",
    "control_center",
    "rooms",
)

_LOGGER = logging.getLogger(__name__)
_ATTR_DIFF_SENTINEL = object()


def capabilities_hash(capabilities: Iterable[str]) -> str:
    """The ``caps_hash`` a lean poll and its reply carry: the first 16
    lowercase hex digits of SHA-256 over the capabilities, sorted by their
    UTF-8 bytes and joined with ``,``. The watch computes the same over the
    list it holds, so a match means the reply can leave the list out."""
    encoded = sorted(cap.encode() for cap in capabilities)
    return hashlib.sha256(b",".join(encoded)).hexdigest()[:16]


@dataclass(frozen=True, slots=True)
class HeldConfig:
    """The config numbers a polling device says it holds, sent on the poll
    under the same keys a reply carries them (``watch_config``,
    ``http_actions``, ``client_certificate``). None for a number it did not
    send, and an older app sends none.

    The server records what each reply carried (``_watch_config_sent`` and
    its siblings) when it builds the reply, before the bytes reach the
    device. A reply written into a half-open connection is lost, yet counts
    as delivered. What the device reports on its next poll is the proof: a
    number that differs from the current one means it never learned of the
    change (see ``DeltaCoordinator._held_behind``).
    """

    watch_config: dict[str, int] | None = None
    http_actions: int | None = None
    client_certificate: int | None = None

    def watch_config_lags(self, current: dict[str, int]) -> bool:
        """Whether a kind the device reported differs from the current
        revision. A kind it left out is not judged."""
        held = self.watch_config
        if held is None:
            return False
        return any(kind in held and held[kind] != rev for kind, rev in current.items())


@dataclass(slots=True)
class _TemplateDeps:
    """Tracked dependencies for a rendered template."""

    entities: frozenset[str]  # specific entity_ids
    domains: frozenset[str]  # domain-level deps (e.g. "light")
    all_states: bool  # True if template uses bare `states`


@dataclass(slots=True)
class WatchSession:
    """Per-watch subscription data."""

    watch_id: str
    config_hash: str = ""
    entities: set[str] = field(default_factory=set)
    entities_synced: bool = False
    templates: dict[str, str] = field(default_factory=dict)
    template_values: dict[str, str] = field(default_factory=dict)
    template_deps: dict[str, _TemplateDeps] = field(default_factory=dict)
    last_seen: datetime = field(default_factory=dt_util.utcnow)
    first_seen: datetime = field(default_factory=dt_util.utcnow)
    last_poll_interval: timedelta | None = None
    last_sent_attrs: dict[str, dict[str, Any]] = field(default_factory=dict)
    # The state word last sent per entity, beside last_sent_attrs and reset
    # with it. A change whose state matches it and whose attribute diff is
    # empty tells this watch nothing and is left out of its reply.
    last_sent_state: dict[str, str] = field(default_factory=dict)
    # The cursor of the last reply written while diffs were on, so the
    # baselines above match a device holding exactly that reply. A poll from
    # an older cursor never got it (a lost or cancelled reply), and its
    # baselines are dropped.
    diff_cursor: int | None = None

    def keep_baselines(self, entity_ids: set[str]) -> None:
        """Forget the attribute and state baselines of every entity not in
        ``entity_ids``, keeping the rest."""
        for baseline in (self.last_sent_attrs, self.last_sent_state):
            for entity_id in [e for e in baseline if e not in entity_ids]:
                del baseline[entity_id]

    def clear_baselines(self) -> None:
        self.last_sent_attrs.clear()
        self.last_sent_state.clear()
        self.diff_cursor = None


@dataclass(slots=True)
class DeltaEvent:
    """Single state change in the ring buffer.

    Holds HA's own State, which is immutable, and leaves the watch payload
    to be built the first time a poll asks for it (see _event_payload).
    Most buffered changes belong to entities no watch follows, and a
    payload walks every attribute, so building it on arrival cost a deep
    copy per state change in the house.
    """

    cursor: int
    entity_id: str
    state: State
    payload: dict[str, Any] | None = None


_SLIM_ATTRIBUTES: dict[str, set[str]] = {
    "light": {
        "friendly_name", "brightness", "color_temp", "color_temp_kelvin",
        "rgb_color", "hs_color", "xy_color", "color_mode", "supported_color_modes",
        "min_mireds", "max_mireds", "min_color_temp_kelvin", "max_color_temp_kelvin",
        "effect", "effect_list", "supported_features", "rgbw_color",
        "icon", "entity_picture",
    },
    "switch": {
        "friendly_name", "device_class", "icon", "entity_picture",
    },
    "cover": {
        "friendly_name", "device_class", "current_position", "current_tilt_position",
        "supported_features", "icon", "entity_picture",
    },
    "valve": {
        "friendly_name", "device_class", "current_position", "current_tilt_position",
        "supported_features", "icon", "entity_picture",
    },
    "climate": {
        "friendly_name", "hvac_modes", "hvac_action", "current_temperature",
        "temperature", "target_temp_high", "target_temp_low", "fan_mode", "fan_modes",
        "preset_mode", "preset_modes", "humidity", "target_humidity",
        "current_humidity", "min_humidity", "max_humidity", "target_temp_step",
        "swing_mode", "swing_modes", "aux_heat",
        "supported_features",
        "min_temp", "max_temp", "icon", "entity_picture",
    },
    "fan": {
        "friendly_name", "percentage", "preset_mode", "preset_modes",
        "oscillating", "direction", "percentage_step", "supported_features",
        "icon", "entity_picture",
    },
    "lock": {
        "friendly_name", "code_format", "icon", "entity_picture",
    },
    "media_player": {
        "friendly_name", "media_title", "media_artist", "media_album_name",
        "media_content_type", "media_content_id", "media_duration", "media_position",
        "media_position_updated_at", "app_name", "group_members",
        "volume_level", "is_volume_muted", "source", "source_list",
        "sound_mode", "sound_mode_list", "shuffle", "repeat",
        "supported_features", "entity_picture",
        "icon", "device_class",
        "mass_player_type",
        "mass_player_id", "active_queue", "queue_index", "items_in_queue",
        "stream_title",
    },
    "camera": {
        "friendly_name", "entity_picture", "frontend_stream_type", "icon",
    },
    "binary_sensor": {
        "friendly_name", "device_class", "icon", "entity_picture",
    },
    "sensor": {
        "friendly_name", "device_class", "unit_of_measurement", "state_class",
        "supported_features", "icon", "entity_picture",
    },
    "person": {
        "friendly_name", "entity_picture", "gps_accuracy", "latitude", "longitude",
        "source", "source_type", "location_accuracy", "location_name",
        "icon",
    },
    "alarm_control_panel": {
        "friendly_name", "code_arm_required", "code_format", "changed_by",
        "supported_features", "icon",
        "entity_picture",
    },
    "vacuum": {
        "friendly_name", "battery_level", "fan_speed", "fan_speed_list",
        "rooms", "room_list", "cleaning_modes", "cleaning_mode_list",
        "supported_features", "status", "icon", "entity_picture",
    },
    "input_boolean": {
        "friendly_name", "icon", "entity_picture",
    },
    "input_number": {
        "friendly_name", "min", "max", "step", "mode",
        "unit_of_measurement", "icon", "entity_picture",
    },
    "number": {
        "friendly_name", "min", "max", "step", "mode",
        "unit_of_measurement", "icon", "entity_picture",
    },
    "input_select": {
        "friendly_name", "options", "icon", "entity_picture",
    },
    "select": {
        "friendly_name", "options", "icon", "entity_picture",
    },
    "scene": {
        "friendly_name", "icon", "entity_picture",
    },
    "script": {
        "friendly_name", "icon", "entity_picture",
    },
    "automation": {
        "friendly_name", "last_triggered", "mode", "icon", "entity_picture",
    },
    "timer": {
        "friendly_name", "duration", "remaining", "finishes_at", "icon",
    },
    "remote": {
        "friendly_name", "activity_list", "current_activity", "icon",
        "entity_picture",
    },
    "button": {
        "friendly_name", "device_class", "icon", "entity_picture",
    },
    "input_button": {
        "friendly_name", "icon", "entity_picture",
    },
    "update": {
        "friendly_name", "installed_version", "latest_version", "skipped_version",
        "in_progress", "release_summary", "release_url", "title",
        "supported_features", "icon", "entity_picture",
    },
    "device_tracker": {
        "friendly_name", "source_type", "latitude", "longitude",
        "gps_accuracy", "location_accuracy", "location_name",
        "icon", "entity_picture",
    },
    "water_heater": {
        "friendly_name", "current_operation", "operation_list",
        "temperature", "current_temperature", "min_temp", "max_temp",
        "target_temp_step", "is_away_mode_on", "away_mode", "supported_features",
        "icon", "entity_picture",
    },
    "humidifier": {
        "friendly_name", "target_humidity", "humidity", "current_humidity",
        "min_humidity", "max_humidity", "target_humidity_step",
        "available_modes", "mode", "action", "supported_features",
        "icon", "entity_picture",
    },
    "calendar": {
        "friendly_name", "message", "description", "location",
        "start_time", "end_time", "all_day",
        "icon", "entity_picture",
    },
    "image": {
        "friendly_name", "entity_picture", "icon",
    },
    "weather": {
        "friendly_name", "temperature", "apparent_temperature", "dew_point",
        "humidity", "pressure", "wind_speed", "wind_bearing", "wind_gust_speed",
        "visibility", "cloud_coverage", "uv_index",
        "temperature_unit", "pressure_unit", "wind_speed_unit",
        "visibility_unit", "precipitation_unit",
        "forecast", "icon", "entity_picture",
    },
    "zone": {
        "friendly_name", "latitude", "longitude", "radius",
        "passive", "persons", "icon", "entity_picture",
    },
    "lawn_mower": {
        "friendly_name", "icon", "entity_picture",
    },
    "siren": {
        "friendly_name", "supported_features", "available_tones",
        "icon", "entity_picture",
    },
    "event": {
        "friendly_name", "icon", "entity_picture",
    },
    "todo": {
        "friendly_name", "icon", "entity_picture",
    },
    "input_text": {
        "friendly_name", "icon", "entity_picture",
    },
    "input_datetime": {
        "friendly_name", "has_date", "has_time",
        "icon", "entity_picture",
    },
    "date": {
        "friendly_name", "icon", "entity_picture",
    },
    "time": {
        "friendly_name", "icon", "entity_picture",
    },
    "datetime": {
        "friendly_name", "icon", "entity_picture",
    },
    "assist_satellite": {
        "friendly_name", "assist_pipeline", "pipeline",
        "vad_sensitivity", "use_wake_word",
        "wake_word_engine", "wake_word_id",
        "icon", "entity_picture",
    },
}


class DeltaCoordinator:
    """Tracks state changes and serves filtered long-poll responses."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._sessions: dict[str, WatchSession] = {}
        self._events: deque[DeltaEvent] = deque(maxlen=MAX_EVENTS_BUFFER)
        self._cursor = 0
        self._generation = 0
        # Names this coordinator's cursors. A new one on every start and every
        # reload, so a lean poll holding a cursor from an earlier one is told
        # to resync even when the number happens to be in range.
        self._epoch = secrets.token_hex(8)
        self._waiters: dict[str, asyncio.Event] = {}  # watch_id → per-waiter event
        self._entity_to_watchers: dict[str, set[str]] = {}  # entity_id → {watch_ids}
        self._domain_watchers: set[str] = set()  # watch_ids with domain-level template deps
        self._wake_all_watchers: set[str] = set()  # watch_ids with all_states template deps
        self._event_times: deque[float] = deque(maxlen=MAX_EVENTS_BUFFER)
        self._session_callbacks: list[callback] = []
        self._poll_callbacks: list[Callable[[str], None]] = []
        self._capabilities: set[str] = {"smart_camera_stream", "template_subscriptions", "compact_events", "attribute_diffs", "instant_poll"}
        self._sorted_capabilities: list[str] = sorted(self._capabilities)
        self._caps_hash = capabilities_hash(self._capabilities)
        # Devices whose first sync since this server started is logged, so a
        # watch coming back after the session TTL is not logged again.
        self._first_sync_logged: set[str] = set()
        # Custom complications ride the poll: the owner's store token goes
        # out on every reply, the watch's applied token comes in on every
        # request, and a commit wakes the parked poll. None until setup
        # attaches the store (attach_complication_store).
        self._complication_store: Any | None = None
        # watch_id → loop time of its last poll, for is_polling().
        self._last_poll_at: dict[str, float] = {}
        # watch_id → store token the watch was last handed on a reply while
        # its applied token differed. Bounds the "you are behind" reply to
        # once per token change, so a watch whose pull keeps failing waits
        # out the poll window instead of spinning on immediate empty replies.
        self._token_notified: dict[str, int] = {}
        # watch_id → the token it was told once more because its applied
        # token still lagged one it had been told (the first reply may have
        # been lost in a half-open connection). Once per token, like
        # _held_repeated for the config numbers.
        self._token_repeated: dict[str, int] = {}
        # watch_id → loop time of the first telling of _token_notified.
        self._token_notified_at: dict[str, float] = {}
        # Watch config rides the poll the same way: every reply with a body
        # names the signer's revision of every kind a watch applies
        # (DELTA_WATCH_CONFIG_KINDS), and a save wakes the parked poll (see
        # watch_config_changed). None until setup attaches the store
        # (attach_watch_config_store).
        self._watch_config_store: Any | None = None
        # watch_id → the watch_config revisions its last reply with a body
        # carried. A poll whose revisions moved since then is answered at once
        # with an empty reply, once per change, like _token_notified. A poll
        # that parks or probes with nothing recorded (its first after a prune,
        # or after a bodiless 204) records the current revisions first, so a
        # save that wakes it has something to compare against.
        self._watch_config_sent: dict[str, dict[str, int]] = {}
        # Each watch's stored voice list, asked about on every poll that
        # carries `voices_hash` (see handle_poll). None until setup attaches
        # it (attach_watch_voices_store).
        self._watch_voices_store: Any | None = None
        # The home's HTTP action library rides the poll too: every reply with
        # a body names its revision as `http_actions`, and a save or a
        # hand-over wakes every parked poll (see http_actions_changed). None
        # until setup attaches the store (attach_http_actions_store).
        self._http_actions_store: Any | None = None
        # watch_id → the library revision its last reply with a body carried,
        # kept like _watch_config_sent so a woken poll can tell news.
        self._http_actions_sent: dict[str, int] = {}
        # The bound user's client certificate rides the poll the same way:
        # every reply with a body names that user's revision as
        # `client_certificate` once the user has a record, and a change wakes
        # the parked polls of that user's devices (see
        # client_certificate_changed). None until setup attaches the store and
        # the question that names a device's user
        # (attach_client_certificate_store).
        self._client_certificate_store: Any | None = None
        self._user_of: Callable[[str], str | None] | None = None
        # watch_id → the certificate revision its last reply with a body
        # carried, kept like _http_actions_sent.
        self._client_certificate_sent: dict[str, int] = {}
        # watch_id → for each of "watch_config", "http_actions" and
        # "client_certificate", the value a reply carried to a poll whose own
        # report (HeldConfig) was behind it. A report still behind that value
        # earns no second immediate reply: once per change, as for the
        # complication token, so a device whose pull keeps failing parks.
        self._held_repeated: dict[str, dict[str, Any]] = {}
        # Answers whether a device id still has a secret here. None until
        # setup attaches it (attach_device_check), and then a poll for an id
        # it says no to gets a bodiless 204 and opens no session.
        self._device_known: Callable[[str], bool] | None = None
        self._unsub_state_changed = hass.bus.async_listen(
            EVENT_STATE_CHANGED, self._handle_state_changed
        )

    def register_capability(self, cap: str) -> None:
        """Register a server capability advertised to clients."""
        self._capabilities.add(cap)
        self._sorted_capabilities = sorted(self._capabilities)
        self._caps_hash = capabilities_hash(self._capabilities)

    @property
    def epoch(self) -> str:
        """This coordinator's epoch (see ``_epoch``)."""
        return self._epoch

    @property
    def capabilities(self) -> list[str]:
        """Every registered capability, sorted.

        The same list the delta reply carries. The unauthenticated version
        probe serves it too, because an app has to know what this server can
        do before it has a signed identity to ask with.
        """
        return list(self._sorted_capabilities)

    # ── custom complications on the poll ──────────────────────────────

    @callback
    def attach_complication_store(self, store: Any) -> None:
        """Wire the complication store in: token on replies, ack on requests,
        and a commit wakes the owner's parked poll."""
        self._complication_store = store
        store.async_set_wake_callback(self.wake_watch)

    @callback
    def wake_watch(self, watch_id: str, *, renotify: bool = False) -> None:
        """Release this watch's parked long-poll, if it has one.

        ``renotify`` forgets that the watch was already told about the
        current token, so the panel's "Send to watch" can hand it out again
        to a watch that missed the first wake.
        """
        if renotify:
            self._token_notified.pop(watch_id, None)
            self._token_repeated.pop(watch_id, None)
            self._token_notified_at.pop(watch_id, None)
        waiter = self._waiters.get(watch_id)
        if waiter is not None:
            waiter.set()

    def is_polling(self, watch_id: str) -> bool:
        """Whether this watch holds a long-poll here right now (or did within
        the gap between two consecutive polls)."""
        if watch_id in self._waiters:
            return True
        last = self._last_poll_at.get(watch_id)
        return last is not None and self.hass.loop.time() - last < POLL_GAP_SECONDS

    def seconds_since_poll(self, watch_id: str) -> float | None:
        """How long since this watch last polled, or None when it has not
        polled since this server started.

        Read from `_last_poll_at`, which is pruned alongside the watch's
        session once both are five minutes stale, and in memory only. So the
        answer is None after a restart, and None again once a watch has been
        away long enough for the number to matter. The panel's chip reads the
        watch's Last activity sensor when this returns None, which is a
        RestoreSensor holding the same moment across both gaps.
        """
        last = self._last_poll_at.get(watch_id)
        if last is None:
            return None
        return max(0.0, self.hass.loop.time() - last)

    def complications_token(self, watch_id: str) -> int | None:
        """The owner's store token, or None when no store is attached."""
        if self._complication_store is None:
            return None
        return self._complication_store.owner_token(watch_id)

    def _complications_behind(self, watch_id: str, applied: int | None) -> bool:
        """True when the watch should be handed the current token now: it
        told us what it applied, that is older, and it has not been told
        about this token yet, or was told only once, at least
        TOKEN_REPEAT_AFTER_SECONDS ago, and still lags it."""
        if applied is None:
            return False
        server = self.complications_token(watch_id)
        if server is None or server == applied:
            return False
        if self._token_notified.get(watch_id) != server:
            return True
        if self._token_repeated.get(watch_id) == server:
            return False
        told_at = self._token_notified_at.get(watch_id)
        return (
            told_at is None
            or self.hass.loop.time() - told_at >= TOKEN_REPEAT_AFTER_SECONDS
        )

    def _note_complications_notified(
        self, watch_id: str, token: int, applied: int | None
    ) -> None:
        """After a reply carries ``token`` to a poll that applied
        ``applied``: a watch that differs has now been told. One told before
        and still lagging has now been told once more."""
        if applied is None or token == applied:
            return
        if self._token_notified.get(watch_id) == token:
            self._token_repeated[watch_id] = token
        else:
            self._token_notified_at[watch_id] = self.hass.loop.time()
        self._token_notified[watch_id] = token

    # ── watch config on the poll ──────────────────────────────────────

    @callback
    def attach_watch_config_store(self, store: Any) -> None:
        """Wire the watch config store in for reading: the signer's revisions
        go out on every reply. The wake on a save is wired by setup, which
        adds watch_config_changed as a store listener."""
        self._watch_config_store = store

    def watch_config_revisions(self, watch_id: str) -> dict[str, int] | None:
        """The signer's own revision of every kind in DELTA_WATCH_CONFIG_KINDS,
        0 for a kind it holds no record of. None when no store is attached or
        this owner's file could not be read: the reply then leaves the field
        out rather than saying "no record", which would be wrong."""
        store = self._watch_config_store
        if store is None:
            return None
        try:
            held = store.revisions(watch_id)
        except Exception:  # noqa: BLE001 (an unreadable file must not fail the poll)
            _LOGGER.debug("No watch config revisions for %s", watch_id, exc_info=True)
            return None
        return {kind: int(held.get(kind, 0)) for kind in DELTA_WATCH_CONFIG_KINDS}

    def _watch_config_behind(
        self, watch_id: str, held: HeldConfig | None = None
    ) -> bool:
        """True when the revisions moved since the last reply this watch was
        handed with a body (or recorded before it parked or probed, see
        _note_watch_config_baseline), or when the watch's own report says it
        never got them (see _held_behind). A watch with nothing recorded and
        nothing reported is not behind: its next reply with a body carries
        the field anyway."""
        current = self.watch_config_revisions(watch_id)
        if current is None:
            return False
        sent = self._watch_config_sent.get(watch_id)
        if sent is not None and current != sent:
            return True
        return held is not None and self._held_behind(
            watch_id, "watch_config", held.watch_config_lags(current), current
        )

    def _held_behind(
        self, watch_id: str, channel: str, lags: bool, current: Any
    ) -> bool:
        """True when the device's own report on this poll lags the current
        value of ``channel`` and no reply has yet answered such a report
        with that value.

        The ``_sent`` records say what a reply carried, not what arrived: a
        reply woken into a half-open connection is lost while counting as
        delivered, and without this the replacement poll would park. The
        report settles it. The once-per-value rule keeps a device whose pull
        keeps failing (and so keeps reporting the old number) from turning
        every poll into an immediate reply."""
        if not lags:
            return False
        return self._held_repeated.get(watch_id, {}).get(channel) != current

    def _note_held(
        self, watch_id: str, channel: str, lags: bool, carried: Any
    ) -> None:
        """After a reply carries ``carried`` for ``channel``: remember it
        when the poll's report lagged it (see _held_behind), and forget any
        earlier one when it did not. A mark only ever holds back a report
        lagging that same value, so one left over after the value moves on
        does no harm; it goes with the session."""
        if lags:
            self._held_repeated.setdefault(watch_id, {})[channel] = carried
            return
        repeated = self._held_repeated.get(watch_id)
        if repeated is not None:
            repeated.pop(channel, None)
            if not repeated:
                del self._held_repeated[watch_id]

    def _note_watch_config_baseline(self, watch_id: str) -> None:
        """Record the current revisions for a watch that has none recorded.

        Called before a poll parks or a probe answers. Without it, a watch
        whose record was pruned, or whose last answer was a bodiless 204,
        would not count as behind when a save wakes it: the poll would park
        again and the save would wait for the next reply with a body. An
        unreadable owner file records nothing, as it puts nothing on a reply.
        """
        if watch_id in self._watch_config_sent:
            return
        current = self.watch_config_revisions(watch_id)
        if current is not None:
            self._watch_config_sent[watch_id] = current

    @callback
    def watch_config_changed(self, change: Any) -> None:
        """Store listener: a save of any kind in DELTA_WATCH_CONFIG_KINDS wakes
        that owner's parked poll, which answers at once with the new revision.

        Any saver counts (a panel save, a restore, a device's own put, a
        forget or move). ``renotify`` stays False: it only re-arms the
        complication token, which this change did not touch. An owner with no
        parked poll is a no-op, as for every wake.
        """
        if change.kind not in DELTA_WATCH_CONFIG_KINDS:
            return
        self.wake_watch(change.owner_watch_id, renotify=False)

    # ── the home's HTTP action library on the poll ────────────────────

    @callback
    def attach_http_actions_store(self, store: Any) -> None:
        """Wire the HTTP action library in for reading: its revision goes out
        on every reply. The wake on a change is wired by setup, which adds
        http_actions_changed as a store listener."""
        self._http_actions_store = store

    def http_actions_revision(self) -> int | None:
        """The library's revision, 0 for none yet. None when no store is
        attached or its file could not be read: the reply then leaves the
        field out."""
        store = self._http_actions_store
        if store is None or not store.available:
            return None
        return int(store.revision)

    def _http_actions_behind(
        self, watch_id: str, held: HeldConfig | None = None
    ) -> bool:
        """True when the library moved since the last reply this watch was
        handed with a body (or the baseline noted before it parked), or the
        watch's own report lags it (see _held_behind)."""
        current = self.http_actions_revision()
        if current is None:
            return False
        sent = self._http_actions_sent.get(watch_id)
        if sent is not None and current != sent:
            return True
        return held is not None and self._held_behind(
            watch_id,
            "http_actions",
            held.http_actions is not None and held.http_actions != current,
            current,
        )

    def _config_behind(self, watch_id: str, held: HeldConfig | None = None) -> bool:
        """The watch's own config, the home's library or its user's client
        certificate moved since it was last told, or its own report on this
        poll says it does not have them: any of them earns an empty reply
        carrying the new numbers."""
        return (
            self._watch_config_behind(watch_id, held)
            or self._http_actions_behind(watch_id, held)
            or self._client_certificate_behind(watch_id, held)
        )

    def _note_config_baseline(self, watch_id: str) -> None:
        """_note_watch_config_baseline, and the same for the library and the
        client certificate."""
        self._note_watch_config_baseline(watch_id)
        if watch_id not in self._http_actions_sent:
            current = self.http_actions_revision()
            if current is not None:
                self._http_actions_sent[watch_id] = current
        if watch_id not in self._client_certificate_sent:
            current = self._client_certificate_baseline(watch_id)
            if current is not None:
                self._client_certificate_sent[watch_id] = current

    @callback
    def http_actions_changed(self, _revision: int) -> None:
        """Store listener: the library is the home's, so a change wakes every
        parked poll, each of which answers at once with the new revision.
        Waking leaves the waiters in place: the polls deliver, they are not
        superseded."""
        for watch_id in list(self._waiters):
            self.wake_watch(watch_id, renotify=False)

    # ── the bound user's client certificate on the poll ───────────────

    @callback
    def attach_client_certificate_store(
        self, store: Any, user_of: Callable[[str], str | None]
    ) -> None:
        """Wire the client certificate store in for reading, with
        ``user_of(watch_id)``, the Home Assistant user a device is bound to.
        The wake on a change is wired by setup, which adds
        client_certificate_changed as a store listener."""
        self._client_certificate_store = store
        self._user_of = user_of

    def _bound_user(self, watch_id: str) -> str | None:
        if self._user_of is None:
            return None
        try:
            return self._user_of(watch_id)
        except Exception:  # noqa: BLE001 (a failed lookup must not fail the poll)
            _LOGGER.debug("No bound user for %s", watch_id, exc_info=True)
            return None

    def client_certificate_revision(self, watch_id: str) -> int | None:
        """The revision of the certificate record of the user this device is
        bound to. None with no store, no bound user, no record for that user
        or an unreadable file: the reply then leaves the field out."""
        store = self._client_certificate_store
        if store is None:
            return None
        user_id = self._bound_user(watch_id)
        if user_id is None:
            return None
        return store.revision(user_id)

    def _client_certificate_baseline(self, watch_id: str) -> int | None:
        """What to note for a watch before it parks: the revision, or 0
        for a device whose user has no record yet, so that a phone's first
        hand-over counts as news. None with no store, an unreadable file or
        no bound user, which notes nothing."""
        current = self.client_certificate_revision(watch_id)
        if current is not None:
            return current
        store = self._client_certificate_store
        if store is None or not store.available or self._bound_user(watch_id) is None:
            return None
        return 0

    def _client_certificate_behind(
        self, watch_id: str, held: HeldConfig | None = None
    ) -> bool:
        """True when the user's record moved since the last reply this
        watch was handed with a body (or the baseline noted before it
        parked), or the watch's own report lags it (see _held_behind). A
        watch with nothing noted and nothing reported is not behind: its
        next reply with a body carries the field anyway."""
        current = self.client_certificate_revision(watch_id)
        if current is None:
            return False
        sent = self._client_certificate_sent.get(watch_id)
        if sent is not None and current != sent:
            return True
        return held is not None and self._held_behind(
            watch_id,
            "client_certificate",
            held.client_certificate is not None and held.client_certificate != current,
            current,
        )

    @callback
    def client_certificate_changed(self, user_id: str) -> None:
        """Store listener: a user's certificate changed, so every parked
        poll of a device bound to that user answers at once with the new
        revision. Other users' polls stay parked."""
        for watch_id in list(self._waiters):
            if self._bound_user(watch_id) == user_id:
                self.wake_watch(watch_id, renotify=False)

    # ── the watch's voice list on the poll ────────────────────────────

    @callback
    def attach_watch_voices_store(self, store: Any) -> None:
        """Wire the voice list store in, for the `voices_wanted` question."""
        self._watch_voices_store = store

    def _voices_wanted(self, watch_id: str, voices_hash: str | None) -> bool:
        """True when the poll carried a hash and it is not the stored one
        (or nothing is stored). False with no hash, from a watch that does
        not report its voices, and with no store attached."""
        if voices_hash is None or self._watch_voices_store is None:
            return False
        return bool(self._watch_voices_store.wants(watch_id, voices_hash))

    @callback
    def async_add_session_listener(self, cb: callback) -> callback:
        """Register a callback fired when sessions change. Returns unsubscribe.

        "Change" means a session appears or goes away, or a session's entity
        list moves. A plain poll that changes neither fires nothing: use
        async_add_poll_listener for per-poll values.
        """
        self._session_callbacks.append(cb)

        @callback
        def _unsub() -> None:
            self._session_callbacks.remove(cb)

        return _unsub

    @callback
    def async_add_poll_listener(self, cb: Callable[[str], None]) -> callback:
        """Register a callback fired with the watch_id on every poll.

        For values that move on each poll (last seen, poll interval). A
        foreground watch polls many times a minute, so a listener that writes
        entity state should throttle itself. Returns unsubscribe.
        """
        self._poll_callbacks.append(cb)

        @callback
        def _unsub() -> None:
            self._poll_callbacks.remove(cb)

        return _unsub

    @callback
    def _fire_session_callbacks(self) -> None:
        """Notify all session listeners.

        Iterates a copy so a listener may unsubscribe itself mid-dispatch, and
        isolates each listener so one raising entity cannot turn every poll
        into a 500 for every watch.
        """
        for cb in list(self._session_callbacks):
            try:
                cb()
            except Exception:  # noqa: BLE001 — one bad listener must not break sync
                _LOGGER.exception("Session listener %s raised", cb)

    @callback
    def _fire_poll_callbacks(self, watch_id: str) -> None:
        """Notify poll listeners, isolated the same way as session listeners."""
        for cb in list(self._poll_callbacks):
            try:
                cb(watch_id)
            except Exception:  # noqa: BLE001
                _LOGGER.exception("Poll listener %s raised", cb)

    @callback
    def _rebuild_watcher_index(self, watch_id: str) -> None:
        """Rebuild the entity→watcher reverse index for a session.

        Call after session entity set or template deps change.
        """
        # Remove old entries for this watcher
        self._remove_watcher_index(watch_id)

        session = self._sessions.get(watch_id)
        if session is None:
            return

        # Index direct entity subscriptions
        for entity_id in session.entities:
            self._entity_to_watchers.setdefault(entity_id, set()).add(watch_id)

        # Index template entity deps
        has_domain_deps = False
        has_all_states = False
        for deps in session.template_deps.values():
            for entity_id in deps.entities:
                self._entity_to_watchers.setdefault(entity_id, set()).add(watch_id)
            if deps.domains:
                has_domain_deps = True
            if deps.all_states:
                has_all_states = True

        if has_domain_deps:
            self._domain_watchers.add(watch_id)
        if has_all_states:
            self._wake_all_watchers.add(watch_id)

    @callback
    def _remove_watcher_index(self, watch_id: str) -> None:
        """Remove a watcher from all reverse indexes."""
        empty_keys = []
        for entity_id, watchers in self._entity_to_watchers.items():
            watchers.discard(watch_id)
            if not watchers:
                empty_keys.append(entity_id)
        for key in empty_keys:
            del self._entity_to_watchers[key]
        self._domain_watchers.discard(watch_id)
        self._wake_all_watchers.discard(watch_id)

    @callback
    def _wake_watchers_for_entity(self, entity_id: str) -> None:
        """Wake only the long-poll waiters that care about this entity."""
        domain = entity_id.split(".", 1)[0] if "." in entity_id else ""
        to_wake: set[str] = set()

        # Direct entity subscribers
        watchers = self._entity_to_watchers.get(entity_id)
        if watchers:
            to_wake.update(watchers)

        # Sessions with domain-level template deps (check each)
        for wid in self._domain_watchers:
            session = self._sessions.get(wid)
            if session is None:
                continue
            for deps in session.template_deps.values():
                if domain in deps.domains:
                    to_wake.add(wid)
                    break

        # Sessions with all_states template deps
        to_wake.update(self._wake_all_watchers)

        for wid in to_wake:
            waiter = self._waiters.get(wid)
            if waiter is not None:
                waiter.set()

    @callback
    def _wake_all_waiters(self) -> None:
        """Release every parked long-poll so it exits (ownership check fails)."""
        waiters = list(self._waiters.values())
        self._waiters.clear()
        for waiter in waiters:
            waiter.set()

    @callback
    def async_shutdown(self) -> None:
        """Clean up listeners."""
        if self._unsub_state_changed is not None:
            self._unsub_state_changed()
            self._unsub_state_changed = None
        self._wake_all_waiters()

    @property
    def events_per_minute(self) -> float:
        """Return the number of state change events in the last 60 seconds."""
        if not self._event_times:
            return 0.0
        cutoff = self.hass.loop.time() - 60
        count = 0
        for t in reversed(self._event_times):
            if t < cutoff:
                break
            count += 1
        return float(count)

    @callback
    def async_prune_idle_sessions(self) -> None:
        """Drop sessions whose last_seen is older than SESSION_TTL.

        Public wrapper around `_prune_sessions` for callers outside this
        module — specifically the periodic timer in __init__.py. Pruning
        otherwise only runs on the inbound delta path (handle_long_poll),
        which means when every watch goes idle simultaneously the count of
        active sessions stays "stuck" at its last value until something polls
        again. A periodic tick fixes that.
        """
        self._prune_sessions()

    @callback
    def async_force_resync(self) -> None:
        """Clear all sessions, forcing watches to do a full state refresh."""
        self._sessions.clear()
        self._entity_to_watchers.clear()
        self._domain_watchers.clear()
        self._wake_all_watchers.clear()
        self._wake_all_waiters()
        self._fire_session_callbacks()

    @callback
    def attach_device_check(self, device_known: Callable[[str], bool]) -> None:
        """Wire in the question "does this device still have a secret here".

        A poll authenticates before it reaches the coordinator, and the view
        awaits a user check in between. A device removed during that await
        would otherwise open a fresh session after `drop_session` cleared it,
        and get one more reply with a body. With this attached, such a poll
        gets a bodiless 204 and leaves nothing behind.
        """
        self._device_known = device_known

    @callback
    def drop_session(self, watch_id: str) -> bool:
        """Forget everything held here for a device that is being removed.

        Called by both removal paths (HA's device page and the panel's Forget)
        before the device's secret and registry entry go. Without it the
        session stayed in `real_sessions` until SESSION_TTL ran out, and in
        that window any session listener saw a watch whose entities had just
        been deleted and added them back, re-creating the device as an empty
        shell with no secret behind it.

        The parked poll is released the way a superseded one is: its waiter
        is taken out of `_waiters` before it is set, so the poll fails its
        ownership check and ends with a bodiless 204. Taking it out first also
        means the store saves that follow (the watch config's `forget_owner`,
        the complication release) find no waiter to wake, so the removed
        device is never handed one more reply with a body.

        Returns whether a session existed. Session listeners fire when one
        did, so the counts on the diagnostic sensors drop at once.
        """
        had_session = self._sessions.pop(watch_id, None) is not None
        waiter = self._waiters.pop(watch_id, None)
        if waiter is not None:
            waiter.set()  # parked poll re-checks ownership and exits with a 204
        self._remove_watcher_index(watch_id)
        self._last_poll_at.pop(watch_id, None)
        self._token_notified.pop(watch_id, None)
        self._token_repeated.pop(watch_id, None)
        self._token_notified_at.pop(watch_id, None)
        self._watch_config_sent.pop(watch_id, None)
        self._http_actions_sent.pop(watch_id, None)
        self._client_certificate_sent.pop(watch_id, None)
        self._held_repeated.pop(watch_id, None)
        # A device paired again under the same id is a first sync again.
        self._first_sync_logged.discard(watch_id)
        if had_session:
            self._fire_session_callbacks()
        return had_session

    async def handle_poll(
        self,
        watch_id: str,
        since: str | int | None,
        config_hash: str,
        entities: list[str] | None,
        timeout: int,
        force_delta: bool = False,
        battery_threshold: int = 20,
        summary_entities: dict[str, list[str]] | None = None,
        slim: bool = False,
        compact: bool = False,
        attribute_diffs: bool = False,
        include_summary: bool = False,
        templates: dict[str, str] | None = None,
        custom_entity_ids: list[str] | None = None,
        complications_token: int | None = None,
        voices_hash: str | None = None,
        held: HeldConfig | None = None,
        lean: bool = False,
        caps_hash: str | None = None,
        epoch: str | None = None,
        attrs_reset: bool = False,
    ) -> tuple[int, dict[str, Any] | None]:
        """Handle a single long-poll request.

        ``complications_token`` is the custom-complication store token the
        watch last applied (None from apps that predate it). It is recorded
        as the watch's ack, and every reply with a body carries the owner's
        current token as ``complications_token`` so the watch can pull only
        when the two differ.

        Every reply with a body also carries ``watch_config``: the signer's
        revision of every kind in DELTA_WATCH_CONFIG_KINDS (0 for a kind with
        no record), so the watch pulls a kind through ``watch_config_get`` when
        its revision is above the one it applied.

        ``voices_hash`` is the watch's hash of its installed speech voices
        (see ``watch_voices_store.voices_hash``), None from a watch that does
        not report them. When it is not the stored hash, a reply with a body
        carries ``voices_wanted: true`` and the watch sends its list with
        ``watch_voices_put``. The question never wakes or holds a poll: it
        rides the next reply with a body, and a voice list changes only when
        the user installs or removes a voice.

        Once the Home Assistant user the device is bound to has a client
        certificate record, every reply with a body also carries
        ``client_certificate``: that record's revision. The watch fetches the
        certificate with ``client_certificate_get`` when the number moves
        past the one it saw, and a change wakes the parked polls of that
        user's devices.

        ``held`` is what the device says it holds of those three numbers
        (see HeldConfig). A poll whose report lags a current number is
        answered at once with an empty reply carrying it, like a poll whose
        last reply predates the change, once per value. It is how a hint
        lost in a half-open connection reaches the device on its next poll.
        A watch config kind it reports at the stored revision counts as a
        confirmed delivery, as a ``watch_config_get`` from that revision does.

        ``lean`` (the ``delta_lean`` capability) shapes every reply with a
        body down to what the device does not already hold (see
        ``_lean_reply``). ``caps_hash`` is the hash of the capability list it
        holds and ``epoch`` the epoch its cursor came from; both are read
        only on a lean poll.
        """
        # A device removed while its request was in flight: no session, no
        # stamps, no body.
        if self._device_known is not None and not self._device_known(watch_id):
            return 204, None
        self._last_poll_at[watch_id] = self.hass.loop.time()
        store = self._complication_store
        if store is not None and complications_token is not None:
            store.set_applied_token(watch_id, complications_token)
        reported = held or HeldConfig()
        self._confirm_held_watch_config(watch_id, reported)
        status, body = await self._handle_poll_inner(
            watch_id=watch_id,
            since=since,
            config_hash=config_hash,
            entities=entities,
            timeout=timeout,
            force_delta=force_delta,
            battery_threshold=battery_threshold,
            summary_entities=summary_entities,
            slim=slim,
            compact=compact,
            attribute_diffs=attribute_diffs,
            include_summary=include_summary,
            templates=templates,
            custom_entity_ids=custom_entity_ids,
            applied_complications_token=complications_token,
            held=held,
            lean=lean,
            epoch=epoch,
            attrs_reset=attrs_reset,
        )
        if body is not None:
            self._stamp_reply(watch_id, body, reported, complications_token, voices_hash)
            if lean:
                self._lean_reply(body, reported, complications_token, caps_hash, epoch)
            else:
                # A new watch's first poll of a connection is not lean yet
                # (it has not seen `delta_lean`), and its next one names
                # this epoch. Older apps ignore the key.
                body["epoch"] = self._epoch
        return status, body

    def _stamp_reply(
        self,
        watch_id: str,
        body: dict[str, Any],
        reported: HeldConfig,
        applied_token: int | None,
        voices_hash: str | None,
    ) -> None:
        """Put the config numbers on a reply with a body, and record what it
        carried (see HeldConfig)."""
        token = self.complications_token(watch_id)
        if token is not None:
            body["complications_token"] = token
            self._note_complications_notified(watch_id, token, applied_token)
        revisions = self.watch_config_revisions(watch_id)
        if revisions is not None:
            body["watch_config"] = revisions
            self._watch_config_sent[watch_id] = revisions
            self._note_held(
                watch_id, "watch_config", reported.watch_config_lags(revisions), revisions
            )
        library_revision = self.http_actions_revision()
        if library_revision is not None:
            body["http_actions"] = library_revision
            self._http_actions_sent[watch_id] = library_revision
            self._note_held(
                watch_id,
                "http_actions",
                reported.http_actions is not None
                and reported.http_actions != library_revision,
                library_revision,
            )
        certificate_revision = self.client_certificate_revision(watch_id)
        if certificate_revision is not None:
            body["client_certificate"] = certificate_revision
            self._client_certificate_sent[watch_id] = certificate_revision
            self._note_held(
                watch_id,
                "client_certificate",
                reported.client_certificate is not None
                and reported.client_certificate != certificate_revision,
                certificate_revision,
            )
        if self._voices_wanted(watch_id, voices_hash):
            body["voices_wanted"] = True

    def _lean_reply(
        self,
        body: dict[str, Any],
        reported: HeldConfig,
        applied_token: int | None,
        caps_hash: str | None,
        epoch: str | None,
    ) -> None:
        """Shape a stamped reply for a lean poll: leave out what the device
        already holds, so a quiet reply is little more than its cursor.

        * ``capabilities`` only when the poll's ``caps_hash`` is not the
          server's, and then with ``caps_hash``.
        * ``need_entities`` and ``resync_required`` only when true, and
          ``events`` only when there are some. ``next_cursor`` always.
        * Each config number only when it differs from what the poll
          reported holding; ``watch_config`` names only the kinds that differ.
        * ``epoch`` only when the poll's is not this coordinator's.

        The device fills a missing number in from the request it sent, so
        what reaches the rest of the app reads like a full reply.
        """
        if caps_hash == self._caps_hash:
            body.pop("capabilities", None)
        else:
            body["caps_hash"] = self._caps_hash
        for key in ("need_entities", "resync_required"):
            if body.get(key) is False:
                del body[key]
        if not body.get("events"):
            body.pop("events", None)
        revisions = body.get("watch_config")
        if revisions is not None:
            held_revisions = reported.watch_config or {}
            changed = {
                kind: revision
                for kind, revision in revisions.items()
                if held_revisions.get(kind) != revision
            }
            if changed:
                body["watch_config"] = changed
            else:
                del body["watch_config"]
        for key, held_value in (
            ("http_actions", reported.http_actions),
            ("client_certificate", reported.client_certificate),
            ("complications_token", applied_token),
        ):
            if key in body and body[key] == held_value:
                del body[key]
        if epoch != self._epoch:
            body["epoch"] = self._epoch

    def _confirm_held_watch_config(self, watch_id: str, reported: HeldConfig) -> None:
        """A kind the device reports holding at the stored revision is a
        confirmed delivery: the same mark ``watch_config_get`` makes for a get
        from the stored revision, which also clears an unreadable report about
        it. The store saves only when something moves."""
        held = reported.watch_config
        store = self._watch_config_store
        if not held or store is None:
            return
        current = self.watch_config_revisions(watch_id)
        if current is None:
            return
        for kind, revision in current.items():
            if revision > 0 and held.get(kind) == revision:
                try:
                    store.mark_delivered(watch_id, kind, revision, confirmed=True)
                except Exception:  # noqa: BLE001 (a mark must not fail the poll)
                    _LOGGER.debug(
                        "Could not mark %s %s delivered", watch_id, kind, exc_info=True
                    )

    def _collect(
        self,
        session: WatchSession,
        since_cursor: int,
        *,
        slim: bool,
        compact: bool,
        attribute_diffs: bool,
    ) -> tuple[list[dict[str, Any]], int]:
        """The watch's entity changes past ``since_cursor`` and its templates
        whose value moved, with the cursor to hand back."""
        changed_ids = self._changed_entity_ids(since_cursor)
        events, cursor = self._collect_events(
            since_cursor=since_cursor,
            entities=session.entities,
            limit=MAX_EVENTS_PER_RESPONSE,
            slim=slim,
            compact=compact,
            session=session if attribute_diffs else None,
            attribute_diffs=attribute_diffs,
        )
        events.extend(self._evaluate_templates(session, changed_ids=changed_ids))
        return events, cursor

    async def _handle_poll_inner(
        self,
        watch_id: str,
        since: str | int | None,
        config_hash: str,
        entities: list[str] | None,
        timeout: int,
        force_delta: bool = False,
        battery_threshold: int = 20,
        summary_entities: dict[str, list[str]] | None = None,
        slim: bool = False,
        compact: bool = False,
        attribute_diffs: bool = False,
        include_summary: bool = False,
        templates: dict[str, str] | None = None,
        custom_entity_ids: list[str] | None = None,
        applied_complications_token: int | None = None,
        held: HeldConfig | None = None,
        lean: bool = False,
        epoch: str | None = None,
        attrs_reset: bool = False,
    ) -> tuple[int, dict[str, Any] | None]:
        self._prune_sessions()
        session = self._sessions.get(watch_id)
        is_new_session = session is None
        if is_new_session:
            session = WatchSession(watch_id=watch_id)
            self._sessions[watch_id] = session
            # Once per device while this server runs. A watch gets a new
            # session after every SESSION_TTL away (each wrist down), which
            # is no news.
            if watch_id not in self._first_sync_logged:
                self._first_sync_logged.add(watch_id)
                log_first_sync(self.hass, watch_id=watch_id)

        now = dt_util.utcnow()
        if not is_new_session:
            session.last_poll_interval = now - session.last_seen
        session.last_seen = now

        # Session listeners (the diagnostic sensors, new-watch discovery) only
        # show which sessions exist and each one's entity list, so they run
        # when one of those moves rather than on every poll.
        sessions_changed = is_new_session
        if entities is not None:
            new_entities = {entity_id for entity_id in entities if isinstance(entity_id, str)}
            sessions_changed = sessions_changed or new_entities != session.entities
            session.entities = new_entities
            session.config_hash = config_hash
            session.entities_synced = True
            # A lean watch keeps its attribute cache across a resent list, so
            # the baselines of the entities still in it stay. An older watch
            # empties its cache whenever it sends the list (each loop start)
            # while keeping its cursor, and must get full attributes again.
            if lean:
                session.keep_baselines(new_entities)
            else:
                session.clear_baselines()
        elif session.config_hash != config_hash:
            # Watch config changed, ask client to send the latest entity list.
            session.config_hash = config_hash
            sessions_changed = sessions_changed or bool(session.entities)
            session.entities.clear()
            session.entities_synced = False
            session.clear_baselines()

        # The baselines must match the attribute cache the device holds, or
        # its next diffs merge into the wrong set. They go when the device
        # says it emptied its cache (`attrs_reset`), when it polls without
        # diffs (nothing then keeps them in step), and when it polls from a
        # cursor older than the last reply written with diffs: that reply
        # moved the baselines and never reached it.
        if attrs_reset or not attribute_diffs:
            session.clear_baselines()
        elif (
            session.diff_cursor is not None
            and since is not None
            and since != ""
        ):
            since_cursor, invalid_since = self._parse_since(
                since=since, default_cursor=self._cursor
            )
            if invalid_since or since_cursor < session.diff_cursor:
                session.clear_baselines()

        # Store template subscriptions (sent alongside entities)
        if templates is not None:
            session.templates = {k: v for k, v in templates.items() if isinstance(k, str) and isinstance(v, str)}
            session.template_values.clear()
            session.template_deps.clear()

        if sessions_changed:
            self._fire_session_callbacks()
        self._fire_poll_callbacks(watch_id)

        def reply(
            events: list[dict[str, Any]],
            next_cursor: int,
            *,
            need_entities: bool = False,
            resync_required: bool = False,
            include_details: bool = False,
        ) -> dict[str, Any]:
            if attribute_diffs:
                session.diff_cursor = next_cursor
            return self._response_payload(
                events=events,
                next_cursor=next_cursor,
                need_entities=need_entities,
                resync_required=resync_required,
                include_details=include_details,
                battery_threshold=battery_threshold,
                summary_entities=summary_entities,
                include_summary=include_summary,
                custom_entity_ids=custom_entity_ids,
            )

        # A lean poll names the epoch its cursor came from. A cursor from an
        # earlier coordinator (a restart or a reload) can be in range by
        # chance and still mean nothing here, so it is answered with a resync.
        if (
            lean
            and epoch is not None
            and since is not None
            and since != ""
            and epoch != self._epoch
        ):
            return 410, reply(
                [],
                self._cursor,
                need_entities=not session.entities_synced,
                resync_required=True,
            )

        if not session.entities_synced:
            # The device is asked for its entity list. Its next poll carries
            # the list with whatever cursor this reply hands back, and the
            # device keeps any cursor at or above its own. Handing back the
            # current cursor to a device that sent an older one made it skip
            # every change in between, with no 410 to tell it so.
            #
            # So a device that sent a cursor is judged on it first. A stale or
            # unreadable cursor gets the same 410 any poll would, and the
            # device answers that with a full snapshot. A good one is echoed
            # back, so the next poll resumes from where the device really is:
            # changes are buffered with or without a session, so a watch back
            # after SESSION_TTL collects exactly what it missed. A brand-new
            # device (no cursor) has nothing to skip and keeps the current
            # cursor, as before.
            reply_cursor = self._cursor
            if since is not None and since != "":
                since_cursor, invalid_since = self._parse_since(
                    since=since, default_cursor=self._cursor
                )
                if invalid_since or self._is_stale_cursor(since_cursor):
                    return 410, reply(
                        [], self._cursor, need_entities=True, resync_required=True
                    )
                reply_cursor = since_cursor
            return 200, reply([], reply_cursor, need_entities=True)

        # When since is nil, the client is requesting a full state snapshot.
        # Fetch current state directly from HA's state machine (in-memory, instant).
        if since is None or since == "":
            # Capture the cursor before building the snapshot so in-flight
            # state changes are re-delivered as deltas instead of being skipped.
            snapshot_cursor = self._cursor
            snapshot_events = self._snapshot_current_state(
                session.entities, slim=slim, compact=compact,
                session=session if attribute_diffs else None, attribute_diffs=attribute_diffs,
            )
            snapshot_events.extend(self._snapshot_templates(session))
            return 200, reply(snapshot_events, snapshot_cursor)

        since_cursor, invalid_since = self._parse_since(
            since=since, default_cursor=self._cursor
        )
        if invalid_since or self._is_stale_cursor(since_cursor):
            return 410, reply([], self._cursor, resync_required=True)

        request_cursor = since_cursor

        def collect(cursor: int) -> tuple[list[dict[str, Any]], int]:
            return self._collect(
                session, cursor, slim=slim, compact=compact, attribute_diffs=attribute_diffs
            )

        def quiet_reply(cursor: int) -> tuple[int, dict[str, Any] | None]:
            """Answer a poll that found nothing for this watch.

            A 204 makes the watch keep the cursor it sent. When unrelated
            changes moved the cursor past it, send the new cursor in a small
            200 instead (no info summary), so a watch in a busy house never
            falls out of the ring buffer between polls.
            """
            if cursor <= request_cursor:
                return 204, None
            return 200, self._response_payload(
                events=[],
                next_cursor=cursor,
                need_entities=False,
                resync_required=False,
            )

        def timed_out() -> tuple[int, dict[str, Any] | None]:
            """Last scan before a held poll gives up.

            A change can land in the same loop tick the wait timed out, and
            the cursor about to go back must not skip it.
            """
            events, cursor = collect(since_cursor)
            if events:
                return 200, reply(events, cursor)
            return quiet_reply(cursor)

        events, next_cursor = collect(since_cursor)
        if events:
            return 200, reply(events, next_cursor, include_details=force_delta)

        # Force delta: skip long-poll wait, return immediately with detailed info_summary
        if force_delta:
            return 200, reply([], next_cursor, include_details=True)

        # Probe: timeout 0 means "answer now". Nothing for this watch past the
        # cursor, so the answer is an empty 204, or a small 200 carrying the
        # moved cursor (see quiet_reply): no summary work. Returned before the
        # waiter below is registered so a probe never wakes or supersedes a
        # long poll the same watch is holding. The watch sends one of these as
        # its first poll after a short background pause, purely to learn that
        # the server is reachable and the screen is current. Advertised as the
        # "instant_poll" capability; older clients never send timeout 0.
        #
        # A watch that is behind on its custom complications gets an empty
        # 200 instead of parking or probing: the wrapper stamps the current
        # token on it and the watch pulls. Once per token change (and once
        # more while its report still lags), so a pull that keeps failing
        # does not turn this into a tight loop. A watch config save (or a
        # change to the home's HTTP action library) since this watch's last
        # reply gets the same empty 200, once per change, since the wrapper
        # records what each reply carried.
        def behind() -> bool:
            return self._complications_behind(
                watch_id, applied_complications_token
            ) or self._config_behind(watch_id, held)

        if behind():
            return 200, reply([], next_cursor)
        # Not behind. Before probing or parking, make sure there is something
        # recorded for a later save to be compared against.
        self._note_config_baseline(watch_id)
        if timeout <= 0:
            return quiet_reply(next_cursor)
        since_cursor = next_cursor

        deadline = self.hass.loop.time() + timeout

        # Register per-waiter event and build watcher index. A newer poll for
        # the same watch supersedes any older one still parked (half-open
        # connection after a network handoff, proxied remote access): wake the
        # old waiter so it exits instead of holding a slot, and let THIS poll
        # own the entry. Ownership is re-checked after every wake and in the
        # finally block below, so the old poll's cleanup can never evict us.
        waiter_event = asyncio.Event()
        previous_waiter = self._waiters.get(watch_id)
        if previous_waiter is not None:
            previous_waiter.set()
        self._waiters[watch_id] = waiter_event
        self._rebuild_watcher_index(watch_id)

        try:
            while True:
                remaining = deadline - self.hass.loop.time()
                if remaining <= 0:
                    return timed_out()
                try:
                    await asyncio.wait_for(waiter_event.wait(), timeout=remaining)
                except TimeoutError:
                    return timed_out()

                waiter_event.clear()
                # Superseded by a newer poll (or shutdown/force_resync)? Let
                # the newer poll deliver; this one just ends quietly.
                if self._waiters.get(watch_id) is not waiter_event:
                    return 204, None

                # Let the rest of a burst land before collecting, inside the
                # poll's own window. Wakes during the pause are collected now.
                pause = min(WAKE_COALESCE_SECONDS, deadline - self.hass.loop.time())
                if pause > 0:
                    await asyncio.sleep(pause)
                    if self._waiters.get(watch_id) is not waiter_event:
                        return 204, None
                    waiter_event.clear()

                events, next_cursor = collect(since_cursor)
                if events:
                    return 200, reply(events, next_cursor)
                # Woken by a complication commit (or a panel nudge) or a
                # watch config save or an HTTP action library change rather
                # than an entity: nothing to deliver but the token and the
                # revisions, which the wrapper stamps on this empty reply.
                if behind():
                    return 200, reply([], next_cursor)
                # Nothing this watch has not seen (every change was a no-op
                # for it): back to waiting, inside the same window.
                since_cursor = next_cursor
        finally:
            # Keep the session in self._sessions across a client cancel; it
            # holds the attribute baselines and the entity list. SESSION_TTL
            # (5 min) handles truly abandoned sessions via _prune_sessions on
            # the next poll from any watch.
            #
            # Only remove OUR waiter. If a newer poll for this watch already
            # replaced it, popping unconditionally would blind that live poll:
            # _wake_watchers_for_entity would find no waiter and the new poll
            # would sleep until MAX_TIMEOUT_SECONDS with stale tiles.
            if self._waiters.get(watch_id) is waiter_event:
                del self._waiters[watch_id]

    @callback
    def _handle_state_changed(self, event: Event) -> None:
        """Track every state change in a bounded in-memory ring buffer.

        Buffered whether or not any watch has a session: a watch back after
        SESSION_TTL then collects only what changed, and the ring's size
        alone decides when a cursor is too old. The ring keeps HA's own
        State and builds a payload only when a poll reads it (see
        DeltaEvent), so an unwatched house costs a reference per change.
        """
        new_state: State | None = event.data.get("new_state")
        if new_state is None:
            return

        self._cursor += 1
        self._events.append(
            DeltaEvent(
                cursor=self._cursor,
                entity_id=new_state.entity_id,
                state=new_state,
            )
        )
        self._event_times.append(self.hass.loop.time())
        self._generation += 1
        self._wake_watchers_for_entity(new_state.entity_id)

    @staticmethod
    def _diff_attributes(
        full_attrs: dict[str, Any],
        previous: dict[str, Any] | None,
    ) -> dict[str, Any]:
        """Compute attribute diff between full_attrs and previously sent attrs.

        Returns a dict with only changed/new keys. If any keys were removed,
        includes "_removed": [list of removed keys].
        """
        if previous is None:
            return full_attrs
        diff: dict[str, Any] = {}
        for k, v in full_attrs.items():
            prev_v = previous.get(k, _ATTR_DIFF_SENTINEL)
            if prev_v is _ATTR_DIFF_SENTINEL or prev_v != v:
                diff[k] = v
        removed = [k for k in previous if k not in full_attrs]
        if removed:
            diff["_removed"] = removed
        return diff

    @staticmethod
    def _compact_event(event: dict[str, Any]) -> dict[str, Any]:
        """Flatten a nested event payload into compact format.

        Lifts attributes from new_state to top level and drops the
        redundant new_state wrapper.
        """
        ns = event.get("new_state")
        if ns is None:
            return event
        return {
            "entity_id": event["entity_id"],
            "state": event.get("state", ns.get("state")),
            "attributes": ns.get("attributes", {}),
            "context_id": event.get("context_id"),
            "last_updated": event.get("last_updated", ns.get("last_updated")),
        }

    def _snapshot_current_state(
        self, entities: set[str], *,
        slim: bool = False, compact: bool = False,
        session: "WatchSession | None" = None, attribute_diffs: bool = False,
    ) -> list[dict[str, Any]]:
        """Build a full state snapshot from HA's state machine for the given entities.

        When attribute_diffs is True, populates session.last_sent_attrs (and
        last_sent_state) so subsequent delta events can compute diffs against
        this baseline, and marks every entry ``attrs_full``: it carries the
        whole attribute set.
        """
        to_payload = self._slim_state_to_payload if slim else self._state_to_payload
        snapshot: list[dict[str, Any]] = []
        for entity_id in entities:
            state = self.hass.states.get(entity_id)
            if state is None:
                continue
            if compact:
                attrs = to_payload(state).get("attributes", {})
                entry = {
                    "entity_id": state.entity_id,
                    "state": state.state,
                    "attributes": attrs,
                    "context_id": (
                        state.context.id if state.context is not None else None
                    ),
                    "last_updated": state.last_updated.timestamp(),
                }
            else:
                entry = {
                    "entity_id": state.entity_id,
                    "state": state.state,
                    "new_state": to_payload(state),
                    "context_id": (
                        state.context.id if state.context is not None else None
                    ),
                    "last_updated": state.last_updated.timestamp(),
                }
            # Record baseline for attribute diffs on subsequent deltas
            if attribute_diffs and session is not None:
                if compact:
                    session.last_sent_attrs[entity_id] = dict(attrs)
                else:
                    ns_payload = entry.get("new_state", {})
                    session.last_sent_attrs[entity_id] = dict(ns_payload.get("attributes", {}))
                session.last_sent_state[entity_id] = state.state
                entry["attrs_full"] = True
            snapshot.append(entry)
        return snapshot

    def _bisect_cursor(self, since_cursor: int) -> int:
        """Return the deque index of the first event with cursor > since_cursor.

        Cursors are monotonically increasing. They were once not contiguous
        with the ring buffer (a change with no watch session consumed a
        cursor value without appending an event), and deriving the index
        arithmetically from the oldest event's cursor then overshot and
        yielded an empty slice: every later poll answered "nothing changed"
        and the watch kept stale tiles forever. Binary search is correct
        whether or not cursors are contiguous.

        Returns len(deque) if all events are at or before since_cursor.
        """
        events = self._events
        lo = 0
        hi = len(events)
        while lo < hi:
            mid = (lo + hi) // 2
            if events[mid].cursor > since_cursor:
                hi = mid
            else:
                lo = mid + 1
        return lo

    def _collect_events(
        self, since_cursor: int, entities: set[str], limit: int,
        *, slim: bool = False, compact: bool = False,
        session: "WatchSession | None" = None, attribute_diffs: bool = False,
    ) -> tuple[list[dict[str, Any]], int]:
        """Collect filtered events after the provided cursor."""
        matched: list[dict[str, Any]] = []
        last_sent_cursor = since_cursor
        start = self._bisect_cursor(since_cursor)
        for i in range(start, len(self._events)):
            event = self._events[i]
            if event.entity_id not in entities:
                continue

            payload = self._event_payload(event)
            if slim:
                payload = self._slim_event_payload(payload)
            if compact:
                payload = self._compact_event(payload)
            # Apply attribute-level diff if enabled. None: the watch already
            # holds this state and every attribute in it, so it is left out.
            if attribute_diffs and session is not None:
                payload = self._apply_attribute_diff(payload, session, compact)
                if payload is None:
                    continue
            matched.append(payload)
            last_sent_cursor = event.cursor
            if len(matched) >= limit:
                return matched, last_sent_cursor

        # The scan reached the newest change without filling the page, so
        # every change up to it has been checked. Move the cursor past the
        # unrelated ones too. Holding it at the last match let a busy house
        # push it out of the ring buffer, and the watch then paid a full
        # resync (410) for changes it never subscribed to.
        if self._events:
            return matched, max(since_cursor, self._events[-1].cursor)
        return matched, since_cursor

    def _apply_attribute_diff(
        self,
        payload: dict[str, Any],
        session: "WatchSession",
        compact: bool,
    ) -> dict[str, Any] | None:
        """Replace full attributes with a diff against last-sent values.

        Updates session.last_sent_attrs and last_sent_state for the next diff.
        With no baseline for the entity the full set goes out, marked
        ``attrs_full`` so the watch replaces its cached attributes rather than
        merging into them. Returns None when the state word matches the last
        one sent and no attribute moved: the watch already holds all of it
        (only ``last_updated`` and the context moved, which it never shows).
        """
        entity_id = payload.get("entity_id", "")
        if compact:
            full_attrs = payload.get("attributes", {})
        else:
            ns = payload.get("new_state")
            if not isinstance(ns, dict):
                return payload
            full_attrs = ns.get("attributes", {})

        previous = session.last_sent_attrs.get(entity_id)
        diffed = self._diff_attributes(full_attrs, previous)
        session.last_sent_attrs[entity_id] = dict(full_attrs)
        state = payload.get("state")
        previous_state = session.last_sent_state.get(entity_id, _ATTR_DIFF_SENTINEL)
        session.last_sent_state[entity_id] = state
        if previous is not None and not diffed and previous_state == state:
            return None

        if compact:
            shaped = {**payload, "attributes": diffed}
        else:
            shaped = {
                **payload,
                "new_state": {**payload["new_state"], "attributes": diffed},
            }
        if previous is None:
            shaped["attrs_full"] = True
        return shaped

    def _is_stale_cursor(self, since_cursor: int) -> bool:
        """Return True if requested cursor is out of range.

        Covers two cases:
        - Cursor is older than the oldest retained event (buffer overflow).
        - Cursor is ahead of the current server cursor (HA restarted and
          the coordinator's cursor reset to 0 while the watch kept its old
          cursor from a previous instance).

        Every change is buffered, session or not, so the ring is the only
        record of what a cursor missed.
        """
        if since_cursor > self._cursor:
            return True
        if not self._events:
            return False
        oldest_cursor = self._events[0].cursor
        return since_cursor < (oldest_cursor - 1)

    @staticmethod
    def _parse_since(since: str | int | None, default_cursor: int) -> tuple[int, bool]:
        """Parse the client cursor."""
        if since is None or since == "":
            return default_cursor, False
        if isinstance(since, int):
            return max(since, 0), False
        try:
            cursor = int(since)
        except ValueError:
            return 0, True
        return max(cursor, 0), False

    @property
    def real_sessions(self) -> dict[str, "WatchSession"]:
        """Return sessions excluding diagnostic probes."""
        return {
            wid: s
            for wid, s in self._sessions.items()
            if not (wid.startswith("__") and wid.endswith("__"))
        }

    def _changed_entity_ids(self, since_cursor: int) -> set[str]:
        """Collect all entity_ids that changed after the given cursor."""
        changed: set[str] = set()
        start = self._bisect_cursor(since_cursor)
        for i in range(start, len(self._events)):
            changed.add(self._events[i].entity_id)
        return changed

    @staticmethod
    def _template_needs_render(
        deps: _TemplateDeps, changed_ids: set[str], changed_domains: set[str] | None = None,
    ) -> bool:
        """Check if a template's dependencies overlap with changed entities."""
        if deps.all_states:
            return True
        if deps.entities & changed_ids:
            return True
        if deps.domains:
            if changed_domains is None:
                changed_domains = {eid.split(".", 1)[0] for eid in changed_ids}
            if deps.domains & changed_domains:
                return True
        return False

    def _render_template_tracked(
        self, template_str: str,
    ) -> tuple[str, _TemplateDeps]:
        """Render a template and return (value, dependencies)."""
        import time as _time

        tpl = Template(template_str, self.hass)
        tpl.hass = self.hass
        t0 = _time.monotonic()
        info = tpl.async_render_to_info()
        elapsed_ms = (_time.monotonic() - t0) * 1000
        if elapsed_ms > 50:
            _LOGGER.warning(
                "Slow template render (%.0fms): %.120s",
                elapsed_ms, template_str,
            )
        # The dependencies are read before the result: a render that raised
        # still recorded what it read, and keeping them is what makes the
        # template render again when one of those entities changes. Empty
        # deps would leave it showing "" until the next snapshot.
        deps = _TemplateDeps(
            entities=frozenset(info.entities or ()),
            domains=frozenset(info.domains or ()),
            all_states=bool(info.all_states),
        )
        # info.result is a method on RenderInfo, not the rendered value;
        # calling str() on it gave back the bound-method repr instead of
        # the actual template output. It raises the render's own error.
        try:
            rendered = info.result()
        except Exception:  # noqa: BLE001 (a template error renders as "")
            _LOGGER.debug("Template render failed: %.120s", template_str, exc_info=True)
            return "", deps
        value = str(rendered).strip() if rendered is not None else ""
        return value, deps

    @staticmethod
    def _template_event(tile_id: str, value: str, now_ts: float) -> dict[str, Any]:
        """Build a delta event dict for a template value.

        If the rendered value contains newlines, each line is sent as an
        equal entry in the ``lines`` attribute for uniform rendering.
        """
        lines = [l for l in value.split("\n") if l] if value else []
        entity_id = f"template.{tile_id}"
        return {
            "entity_id": entity_id,
            "lines": lines,
            "last_updated": now_ts,
        }

    def _evaluate_templates(
        self, session: WatchSession, changed_ids: set[str] | None = None,
    ) -> list[dict[str, Any]]:
        """Render subscribed templates and return events for changed values.

        When *changed_ids* is provided, only templates whose tracked
        dependencies overlap with the changed entities are re-rendered.
        Templates without cached deps (first render) are always rendered.
        """
        if not session.templates:
            return []

        changed: list[dict[str, Any]] = []
        now_ts = dt_util.utcnow().timestamp()

        # Pre-compute changed domains once for all templates
        changed_domains: set[str] | None = None
        if changed_ids:
            changed_domains = {eid.split(".", 1)[0] for eid in changed_ids}

        for tile_id, template_str in session.templates.items():
            # Skip render if deps are cached and no relevant entity changed
            cached_deps = session.template_deps.get(tile_id)
            if cached_deps is not None and changed_ids is not None:
                if not self._template_needs_render(cached_deps, changed_ids, changed_domains):
                    continue

            try:
                value, deps = self._render_template_tracked(template_str)
                session.template_deps[tile_id] = deps
            except Exception:
                value = ""
                session.template_deps[tile_id] = _TemplateDeps(frozenset(), frozenset(), False)

            previous = session.template_values.get(tile_id)
            if value != previous:
                session.template_values[tile_id] = value
                changed.append(self._template_event(tile_id, value, now_ts))

        return changed

    def _snapshot_templates(
        self, session: WatchSession
    ) -> list[dict[str, Any]]:
        """Render all subscribed templates for a full snapshot response."""
        if not session.templates:
            return []

        results: list[dict[str, Any]] = []
        now_ts = dt_util.utcnow().timestamp()

        for tile_id, template_str in session.templates.items():
            try:
                value, deps = self._render_template_tracked(template_str)
                session.template_deps[tile_id] = deps
            except Exception:
                value = ""
                session.template_deps[tile_id] = _TemplateDeps(frozenset(), frozenset(), False)

            session.template_values[tile_id] = value
            results.append(self._template_event(tile_id, value, now_ts))

        return results

    def _prune_sessions(self) -> None:
        """Drop idle watch sessions, and the per-watch bookkeeping beside them.

        ``_sessions`` was the only thing pruned here, so ``_token_notified``
        and ``_last_poll_at`` grew for the lifetime of the process, one entry
        per watch id ever seen. Real households have a handful; a dev box
        running the HTTP suite provisions a throwaway id on every run.
        """
        cutoff = dt_util.utcnow() - SESSION_TTL
        expired = [
            watch_id
            for watch_id, session in self._sessions.items()
            if session.last_seen < cutoff
        ]
        stale_poll = self.hass.loop.time() - SESSION_TTL.total_seconds()
        for watch_id in expired:
            self._sessions.pop(watch_id, None)
            # Forgetting this only costs the watch one extra "you are behind"
            # reply, which is what a watch back after five idle minutes wants.
            self._token_notified.pop(watch_id, None)
            self._token_repeated.pop(watch_id, None)
            self._token_notified_at.pop(watch_id, None)
            # The same for the watch config revisions: the next reply with a
            # body carries them again and records them afresh.
            self._watch_config_sent.pop(watch_id, None)
            self._http_actions_sent.pop(watch_id, None)
            self._client_certificate_sent.pop(watch_id, None)
            self._held_repeated.pop(watch_id, None)
            # `handle_poll` stamps `_last_poll_at` before this runs, so a watch
            # polling again after a long idle arrives with a fresh stamp and a
            # session that is about to expire. Drop the stamp only when it is
            # itself stale, or that watch would read as never having polled.
            last = self._last_poll_at.get(watch_id)
            if last is None or last <= stale_poll:
                self._last_poll_at.pop(watch_id, None)
            waiter = self._waiters.pop(watch_id, None)
            if waiter is not None:
                waiter.set()  # parked poll re-checks ownership and exits
            self._remove_watcher_index(watch_id)
        # No logbook entry: a watch's session lapses every time it is put
        # down for SESSION_TTL, so "disconnected" filled the logbook with
        # one line per wrist cycle.
        if expired:
            self._fire_session_callbacks()

    def _response_payload(
        self,
        events: list[dict[str, Any]],
        next_cursor: int,
        need_entities: bool,
        resync_required: bool,
        include_details: bool = False,
        include_summary: bool = False,
        battery_threshold: int = 20,
        summary_entities: dict[str, list[str]] | None = None,
        custom_entity_ids: list[str] | None = None,
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "events": events,
            "next_cursor": next_cursor,
            "need_entities": need_entities,
            "resync_required": resync_required,
            "capabilities": self._sorted_capabilities,
        }
        if include_summary or include_details:
            payload["info_summary"] = self._compute_info_summary(
                include_details=include_details,
                battery_threshold=battery_threshold,
                summary_entities=summary_entities,
                custom_entity_ids=custom_entity_ids,
            )
        return payload

    def _compute_info_summary(self, *, include_details: bool = False, battery_threshold: int = 20, summary_entities: dict[str, list[str]] | None = None, custom_entity_ids: list[str] | None = None, fetch_domains: dict[str, list[str] | None] | None = None) -> dict[str, Any]:
        """Compute domain summaries from HA state machine (in-memory, instant).

        When summary_entities is provided, filter each domain to only the requested
        entity IDs and recompute counts from the filtered set. Entity details are
        always included for filtered domains (the caller asked for specific entities).

        When fetch_domains is provided, return all entities for each requested domain
        (optionally filtered by device_class list) in a ``domain_entities`` dict.
        """
        summary: dict[str, Any] = {}
        light_filter = (summary_entities or {}).get("light")
        person_filter = (summary_entities or {}).get("person")
        sensor_filter = (summary_entities or {}).get("sensor")
        binary_filter = (summary_entities or {}).get("binary_sensor")

        # Lights
        light_states = [
            s for s in self.hass.states.async_all("light")
            if s.entity_id.startswith("light.")
        ]
        if light_filter:
            light_filter_set = set(light_filter)
            light_states = [s for s in light_states if s.entity_id in light_filter_set]
        light_on = sum(1 for s in light_states if s.state == "on")
        light_data: dict[str, Any] = {"on": light_on, "total": len(light_states)}
        if include_details or light_filter:
            light_data["entities"] = [
                {
                    "entity_id": s.entity_id,
                    "state": s.state,
                    "name": s.attributes.get("friendly_name", s.entity_id),
                    "brightness": s.attributes.get("brightness"),
                }
                for s in light_states
            ]
        summary["light"] = light_data

        # Persons
        person_states = [
            s for s in self.hass.states.async_all("person")
            if s.entity_id.startswith("person.")
        ]
        if person_filter:
            person_filter_set = set(person_filter)
            person_states = [s for s in person_states if s.entity_id in person_filter_set]
        person_home = sum(1 for s in person_states if s.state == "home")
        person_data: dict[str, Any] = {"home": person_home, "total": len(person_states)}
        if include_details or person_filter:
            person_data["entities"] = [
                {
                    "entity_id": s.entity_id,
                    "state": s.state,
                    "name": s.attributes.get("friendly_name", s.entity_id),
                }
                for s in person_states
            ]
        summary["person"] = person_data

        # Sensors (temperature/humidity)
        sensor_states = [
            s for s in self.hass.states.async_all("sensor")
            if s.entity_id.startswith("sensor.")
            and s.attributes.get("device_class") in ("temperature", "humidity")
        ]
        if sensor_filter:
            sensor_filter_set = set(sensor_filter)
            sensor_states = [s for s in sensor_states if s.entity_id in sensor_filter_set]
        sensor_data: dict[str, Any] = {"total": len(sensor_states)}
        if include_details or sensor_filter:
            sensor_data["entities"] = [
                {
                    "entity_id": s.entity_id,
                    "state": s.state,
                    "name": s.attributes.get("friendly_name", s.entity_id),
                    "unit": s.attributes.get("unit_of_measurement"),
                }
                for s in sensor_states
            ]
        summary["sensor"] = sensor_data

        # Binary sensors (door/window/opening)
        binary_states = [
            s for s in self.hass.states.async_all("binary_sensor")
            if s.entity_id.startswith("binary_sensor.")
            and s.attributes.get("device_class") in ("door", "window", "opening", "garage_door")
        ]
        if binary_filter:
            binary_filter_set = set(binary_filter)
            binary_states = [s for s in binary_states if s.entity_id in binary_filter_set]
        binary_open = sum(1 for s in binary_states if s.state == "on")
        binary_data: dict[str, Any] = {"open": binary_open, "total": len(binary_states)}
        if include_details or binary_filter:
            binary_data["entities"] = [
                {
                    "entity_id": s.entity_id,
                    "state": s.state,
                    "name": s.attributes.get("friendly_name", s.entity_id),
                    "device_class": s.attributes.get("device_class"),
                }
                for s in binary_states
            ]
        summary["binary_sensor"] = binary_data

        # Battery sensors (device_class=battery, state is numeric percentage)
        LOW_BATTERY_THRESHOLD = battery_threshold
        battery_states = [
            s for s in self.hass.states.async_all("sensor")
            if s.entity_id.startswith("sensor.")
            and s.attributes.get("device_class") == "battery"
        ]
        # Parse numeric state values, skip unavailable/unknown
        battery_levels: list[tuple[Any, float]] = []
        for s in battery_states:
            try:
                level = float(s.state)
                battery_levels.append((s, level))
            except (ValueError, TypeError):
                continue
        low_count = sum(1 for _, lvl in battery_levels if lvl < LOW_BATTERY_THRESHOLD)
        battery_data: dict[str, Any] = {"low": low_count, "total": len(battery_levels)}
        if include_details:
            # Send all battery entities (watch filters by user-selected entity IDs)
            # Sort by level ascending (most critical first)
            battery_levels.sort(key=lambda x: x[1])
            battery_data["entities"] = [
                {
                    "entity_id": s.entity_id,
                    "name": s.attributes.get("friendly_name", s.entity_id),
                    "level": int(lvl),
                }
                for s, lvl in battery_levels
            ]
        summary["battery"] = battery_data

        # Custom entities: arbitrary entity IDs from any domain (e.g. status page rows)
        if custom_entity_ids:
            custom = []
            for eid in custom_entity_ids:
                state = self.hass.states.get(eid)
                if state is None:
                    continue
                entry: dict[str, Any] = {
                    "entity_id": state.entity_id,
                    "state": state.state,
                    "name": state.attributes.get("friendly_name", state.entity_id),
                }
                unit = state.attributes.get("unit_of_measurement")
                if unit:
                    entry["unit"] = unit
                dc = state.attributes.get("device_class")
                if dc:
                    entry["device_class"] = dc
                if eid.startswith("light."):
                    brightness = state.attributes.get("brightness")
                    if brightness is not None:
                        entry["brightness"] = brightness
                custom.append(entry)
            summary["custom_entities"] = custom

        # Domain entities: return all entities for requested domains, optionally
        # filtered by device_class.  Used by status page peek on the watch.
        if fetch_domains:
            domain_entities: dict[str, list[dict[str, Any]]] = {}
            for domain, dc_filter in fetch_domains.items():
                states = [
                    s for s in self.hass.states.async_all(domain)
                    if s.entity_id.startswith(f"{domain}.")
                ]
                if dc_filter:
                    dc_set = set(dc_filter)
                    states = [s for s in states if s.attributes.get("device_class") in dc_set]
                entities: list[dict[str, Any]] = []
                for s in states:
                    entry: dict[str, Any] = {
                        "entity_id": s.entity_id,
                        "state": s.state,
                        "name": s.attributes.get("friendly_name", s.entity_id),
                    }
                    dc = s.attributes.get("device_class")
                    if dc:
                        entry["device_class"] = dc
                    unit = s.attributes.get("unit_of_measurement")
                    if unit:
                        entry["unit"] = unit
                    entities.append(entry)
                domain_entities[domain] = entities
            summary["domain_entities"] = domain_entities

        return summary

    def _event_payload(self, event: DeltaEvent) -> dict[str, Any]:
        """Build a buffered change's payload once, on first use.

        Every later step (slim, compact, attribute diff) returns a new dict
        rather than editing this one, so one copy serves every watch.
        """
        if event.payload is None:
            state = event.state
            event.payload = {
                "entity_id": state.entity_id,
                "state": state.state,
                "new_state": self._state_to_payload(state),
                "context_id": state.context.id if state.context is not None else None,
                "last_updated": state.last_updated.timestamp(),
            }
        return event.payload

    def _state_to_payload(self, state: State) -> dict[str, Any]:
        """Return HA state payload shape expected by the watch client."""
        return {
            "entity_id": state.entity_id,
            "state": state.state,
            "attributes": self._json_safe(state.attributes),
            "last_updated": state.last_updated.timestamp(),
        }

    def _slim_state_to_payload(self, state: State) -> dict[str, Any]:
        """Return a state payload with attributes filtered to domain whitelist."""
        domain = state.entity_id.split(".", 1)[0] if "." in state.entity_id else ""
        allowed = _SLIM_ATTRIBUTES.get(domain)
        if allowed is not None:
            attrs = {k: v for k, v in state.attributes.items() if k in allowed}
        else:
            attrs = state.attributes
        return {
            "entity_id": state.entity_id,
            "state": state.state,
            "attributes": self._json_safe(attrs),
            "last_updated": state.last_updated.timestamp(),
        }

    def _slim_event_payload(self, payload: dict[str, Any]) -> dict[str, Any]:
        """Post-filter an event payload's new_state attributes for slim mode."""
        new_state = payload.get("new_state")
        if not isinstance(new_state, dict):
            return payload
        attrs = new_state.get("attributes")
        if not isinstance(attrs, dict):
            return payload
        entity_id = new_state.get("entity_id", payload.get("entity_id", ""))
        domain = entity_id.split(".", 1)[0] if "." in entity_id else ""
        allowed = _SLIM_ATTRIBUTES.get(domain)
        if allowed is None:
            return payload
        trimmed = {k: v for k, v in attrs.items() if k in allowed}
        return {
            **payload,
            "new_state": {**new_state, "attributes": trimmed},
        }

    def _json_safe(self, value: Any) -> Any:
        """Best-effort conversion for attribute values into JSON-safe types."""
        if value is None or isinstance(value, (bool, int, float, str)):
            return value

        if isinstance(value, dict):
            return {str(key): self._json_safe(item) for key, item in value.items()}

        if isinstance(value, (list, tuple, set)):
            return [self._json_safe(item) for item in value]

        if isinstance(value, datetime):
            return value.timestamp()

        if isinstance(value, timedelta):
            return value.total_seconds()

        enum_value = getattr(value, "value", None)
        if enum_value is not None and not callable(enum_value):
            return self._json_safe(enum_value)

        return str(value)


def _get_mass_client(hass: HomeAssistant):
    """Find the Music Assistant client from its config entry, if available."""
    for domain in ("mass", "music_assistant"):
        for entry in hass.config_entries.async_entries(domain):
            rd = getattr(entry, "runtime_data", None)
            if rd is None:
                continue
            # Try both attribute paths: rd.mass (older) and rd directly (newer)
            client = getattr(rd, "mass", None)
            if client is not None:
                return client
            # Newer versions may store client differently
            if hasattr(rd, "client"):
                return rd.client
    return None


