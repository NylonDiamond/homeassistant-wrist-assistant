"""Long-poll delta coordinator for Wrist Assistant.

The HTTP wrappers for the watch's traffic now live in `wa_v2_views.py`
under `/api/wrist_assistant/v2/*`. This module owns the coordinator,
session bookkeeping, and the info_summary computation that v2 op
handlers call directly.
"""

from __future__ import annotations

import asyncio
from collections import deque
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.const import EVENT_STATE_CHANGED
from homeassistant.core import Event, HomeAssistant, State, callback
from homeassistant.helpers.template import Template
from homeassistant.util import dt as dt_util

from .logbook_events import log_first_sync, log_session_dropped


DEFAULT_TIMEOUT_SECONDS = 45
MIN_TIMEOUT_SECONDS = 5
MAX_TIMEOUT_SECONDS = 55
# A watch re-polls right after each reply; a gap longer than this between
# two polls means it is not holding a poll here any more (is_polling).
POLL_GAP_SECONDS = 10
MAX_EVENTS_BUFFER = 5000
MAX_EVENTS_PER_RESPONSE = 250
SESSION_TTL = timedelta(minutes=5)

_LOGGER = logging.getLogger(__name__)
_ATTR_DIFF_SENTINEL = object()


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


@dataclass(slots=True)
class DeltaEvent:
    """Single tracked entity update."""

    cursor: int
    entity_id: str
    payload: dict[str, Any]


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
        # Cursor value at the most recent state change that was NOT buffered
        # because no watch was connected. A watch resuming with a cursor at or
        # below this point missed at least one change, so it must resync even
        # though the ring buffer itself has no gap. None = nothing dropped yet.
        self._gap_cursor: int | None = None
        self._waiters: dict[str, asyncio.Event] = {}  # watch_id → per-waiter event
        self._entity_to_watchers: dict[str, set[str]] = {}  # entity_id → {watch_ids}
        self._domain_watchers: set[str] = set()  # watch_ids with domain-level template deps
        self._wake_all_watchers: set[str] = set()  # watch_ids with all_states template deps
        self._event_times: deque[float] = deque(maxlen=MAX_EVENTS_BUFFER)
        self._session_callbacks: list[callback] = []
        self._capabilities: set[str] = {"smart_camera_stream", "template_subscriptions", "compact_events", "attribute_diffs", "instant_poll"}
        self._sorted_capabilities: list[str] = sorted(self._capabilities)
        # Custom complications ride the poll: the owner's store token goes
        # out on every reply, the watch's applied token comes in on every
        # request, and a commit wakes the parked poll. None until setup
        # attaches the store (attach_complication_store).
        self._complication_store: Any | None = None
        # watch_id → loop time of its last poll, for is_polling().
        self._last_poll_at: dict[str, float] = {}
        # watch_id → store token the watch was last handed in a "you are
        # behind" reply. Bounds that reply to once per token change, so a
        # watch whose pull keeps failing waits out the poll window instead
        # of spinning on immediate empty replies.
        self._token_notified: dict[str, int] = {}
        self._unsub_state_changed = hass.bus.async_listen(
            EVENT_STATE_CHANGED, self._handle_state_changed
        )

    def register_capability(self, cap: str) -> None:
        """Register a server capability advertised to clients."""
        self._capabilities.add(cap)
        self._sorted_capabilities = sorted(self._capabilities)

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

    def complications_token(self, watch_id: str) -> int | None:
        """The owner's store token, or None when no store is attached."""
        if self._complication_store is None:
            return None
        return self._complication_store.owner_token(watch_id)

    def _complications_behind(self, watch_id: str, applied: int | None) -> bool:
        """True when the watch should be handed the current token now: it
        told us what it applied, that is older, and it has not been told
        about this token yet."""
        if applied is None:
            return False
        server = self.complications_token(watch_id)
        if server is None or server == applied:
            return False
        return self._token_notified.get(watch_id) != server

    def _note_complications_notified(self, watch_id: str) -> None:
        server = self.complications_token(watch_id)
        if server is not None:
            self._token_notified[watch_id] = server

    @callback
    def async_add_session_listener(self, cb: callback) -> callback:
        """Register a callback fired when sessions change. Returns unsubscribe."""
        self._session_callbacks.append(cb)

        @callback
        def _unsub() -> None:
            self._session_callbacks.remove(cb)

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
    ) -> tuple[int, dict[str, Any] | None]:
        """Handle a single long-poll request.

        ``complications_token`` is the custom-complication store token the
        watch last applied (None from apps that predate it). It is recorded
        as the watch's ack, and every reply with a body carries the owner's
        current token as ``complications_token`` so the watch can pull only
        when the two differ.
        """
        self._last_poll_at[watch_id] = self.hass.loop.time()
        store = self._complication_store
        if store is not None and complications_token is not None:
            store.set_applied_token(watch_id, complications_token)
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
        )
        if body is not None:
            token = self.complications_token(watch_id)
            if token is not None:
                body["complications_token"] = token
        return status, body

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
    ) -> tuple[int, dict[str, Any] | None]:
        self._prune_sessions()
        session = self._sessions.get(watch_id)
        is_new_session = session is None
        if is_new_session:
            session = WatchSession(watch_id=watch_id)
            self._sessions[watch_id] = session
            log_first_sync(self.hass, watch_id=watch_id)

        now = dt_util.utcnow()
        if not is_new_session:
            session.last_poll_interval = now - session.last_seen
        session.last_seen = now

        if entities is not None:
            session.entities = {entity_id for entity_id in entities if isinstance(entity_id, str)}
            session.config_hash = config_hash
            session.entities_synced = True
            session.last_sent_attrs.clear()
        elif session.config_hash != config_hash:
            # Watch config changed, ask client to send the latest entity list.
            session.config_hash = config_hash
            session.entities.clear()
            session.entities_synced = False
            session.last_sent_attrs.clear()

        # Store template subscriptions (sent alongside entities)
        if templates is not None:
            session.templates = {k: v for k, v in templates.items() if isinstance(k, str) and isinstance(v, str)}
            session.template_values.clear()
            session.template_deps.clear()

        self._fire_session_callbacks()

        if not session.entities_synced:
            return 200, self._response_payload(
                events=[],
                next_cursor=self._cursor,
                need_entities=True,
                resync_required=False,
                battery_threshold=battery_threshold,
                summary_entities=summary_entities,
                include_summary=include_summary,
                custom_entity_ids=custom_entity_ids,
            )

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
            return 200, self._response_payload(
                events=snapshot_events,
                next_cursor=snapshot_cursor,
                need_entities=False,
                resync_required=False,
                battery_threshold=battery_threshold,
                summary_entities=summary_entities,
                include_summary=include_summary,
                custom_entity_ids=custom_entity_ids,
            )

        since_cursor, invalid_since = self._parse_since(
            since=since, default_cursor=self._cursor
        )
        if invalid_since:
            return 410, self._response_payload(
                events=[],
                next_cursor=self._cursor,
                need_entities=False,
                resync_required=True,
                battery_threshold=battery_threshold,
                summary_entities=summary_entities,
                include_summary=include_summary,
                custom_entity_ids=custom_entity_ids,
            )

        if self._is_stale_cursor(since_cursor):
            return 410, self._response_payload(
                events=[],
                next_cursor=self._cursor,
                need_entities=False,
                resync_required=True,
                battery_threshold=battery_threshold,
                summary_entities=summary_entities,
                include_summary=include_summary,
                custom_entity_ids=custom_entity_ids,
            )

        changed_ids = self._changed_entity_ids(since_cursor)
        events, next_cursor = self._collect_events(
            since_cursor=since_cursor,
            entities=session.entities,
            limit=MAX_EVENTS_PER_RESPONSE,
            slim=slim,
            compact=compact,
            session=session if attribute_diffs else None,
            attribute_diffs=attribute_diffs,
        )
        # Evaluate subscribed templates and include any changed values
        template_events = self._evaluate_templates(session, changed_ids=changed_ids)
        if template_events:
            events.extend(template_events)
        if events:
            return 200, self._response_payload(
                events=events,
                next_cursor=next_cursor,
                need_entities=False,
                resync_required=False,
                include_details=force_delta,
                battery_threshold=battery_threshold,
                summary_entities=summary_entities,
                include_summary=include_summary,
                custom_entity_ids=custom_entity_ids,
            )

        # Force delta: skip long-poll wait, return immediately with detailed info_summary
        if force_delta:
            return 200, self._response_payload(
                events=[],
                next_cursor=next_cursor,
                need_entities=False,
                resync_required=False,
                include_details=True,
                battery_threshold=battery_threshold,
                summary_entities=summary_entities,
                include_summary=include_summary,
                custom_entity_ids=custom_entity_ids,
            )

        # Probe: timeout 0 means "answer now". Nothing past the cursor, so the
        # answer is an empty 204: no body, no summary work. Returned before the
        # waiter below is registered so a probe never wakes or supersedes a
        # long poll the same watch is holding. The watch sends one of these as
        # its first poll after a short background pause, purely to learn that
        # the server is reachable and the screen is current. Advertised as the
        # "instant_poll" capability; older clients never send timeout 0.
        #
        # A watch that is behind on its custom complications gets an empty
        # 200 instead of parking or probing: the wrapper stamps the current
        # token on it and the watch pulls. Once per token change, so a pull
        # that keeps failing does not turn this into a tight loop.
        if self._complications_behind(watch_id, applied_complications_token):
            self._note_complications_notified(watch_id)
            return 200, self._response_payload(
                events=[],
                next_cursor=next_cursor,
                need_entities=False,
                resync_required=False,
                battery_threshold=battery_threshold,
                summary_entities=summary_entities,
                include_summary=include_summary,
                custom_entity_ids=custom_entity_ids,
            )
        if timeout <= 0:
            return 204, None

        deadline = self.hass.loop.time() + timeout
        observed_generation = self._generation

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
                    return 204, None

                if self._generation != observed_generation:
                    observed_generation = self._generation
                    changed_ids = self._changed_entity_ids(since_cursor)
                    events, next_cursor = self._collect_events(
                        since_cursor=since_cursor,
                        entities=session.entities,
                        limit=MAX_EVENTS_PER_RESPONSE,
                        slim=slim,
                        compact=compact,
                        session=session if attribute_diffs else None,
                        attribute_diffs=attribute_diffs,
                    )
                    template_events = self._evaluate_templates(session, changed_ids=changed_ids)
                    if template_events:
                        events.extend(template_events)
                    if events:
                        return 200, self._response_payload(
                            events=events,
                            next_cursor=next_cursor,
                            need_entities=False,
                            resync_required=False,
                            battery_threshold=battery_threshold,
                            summary_entities=summary_entities,
                            include_summary=include_summary,
                            custom_entity_ids=custom_entity_ids,
                        )
                    since_cursor = next_cursor
                    continue

                try:
                    await asyncio.wait_for(waiter_event.wait(), timeout=remaining)
                except TimeoutError:
                    return 204, None

                waiter_event.clear()
                # Superseded by a newer poll (or shutdown/force_resync)? Let
                # the newer poll deliver; this one just ends quietly.
                if self._waiters.get(watch_id) is not waiter_event:
                    return 204, None
                observed_generation = self._generation

                changed_ids = self._changed_entity_ids(since_cursor)
                events, next_cursor = self._collect_events(
                    since_cursor=since_cursor,
                    entities=session.entities,
                    limit=MAX_EVENTS_PER_RESPONSE,
                    slim=slim,
                    compact=compact,
                    session=session if attribute_diffs else None,
                    attribute_diffs=attribute_diffs,
                )
                template_events = self._evaluate_templates(session, changed_ids=changed_ids)
                if template_events:
                    events.extend(template_events)
                if events:
                    return 200, self._response_payload(
                        events=events,
                        next_cursor=next_cursor,
                        need_entities=False,
                        resync_required=False,
                        battery_threshold=battery_threshold,
                        summary_entities=summary_entities,
                        include_summary=include_summary,
                        custom_entity_ids=custom_entity_ids,
                    )
                # Woken by a complication commit (or a panel nudge) rather
                # than an entity: nothing to deliver but the token, which the
                # wrapper stamps on this empty reply.
                if self._complications_behind(watch_id, applied_complications_token):
                    self._note_complications_notified(watch_id)
                    return 200, self._response_payload(
                        events=[],
                        next_cursor=next_cursor,
                        need_entities=False,
                        resync_required=False,
                        battery_threshold=battery_threshold,
                        summary_entities=summary_entities,
                        include_summary=include_summary,
                        custom_entity_ids=custom_entity_ids,
                    )
                since_cursor = next_cursor
        finally:
            # Keep the session in self._sessions across a client cancel so
            # state_changed events fired during a brief background→foreground
            # cycle still land in the ring buffer for this watch to pick up
            # on reconnect. Otherwise the early-return in
            # _handle_state_changed (`if not self._sessions: return`) drops
            # every event between disconnect and reconnect — and the watch
            # comes back with next_cursor == since and stale tiles.
            # SESSION_TTL (5 min) handles truly abandoned sessions via
            # _prune_sessions on the next poll from any watch.
            #
            # Only remove OUR waiter. If a newer poll for this watch already
            # replaced it, popping unconditionally would blind that live poll:
            # _wake_watchers_for_entity would find no waiter and the new poll
            # would sleep until MAX_TIMEOUT_SECONDS with stale tiles.
            if self._waiters.get(watch_id) is waiter_event:
                del self._waiters[watch_id]

    @callback
    def _handle_state_changed(self, event: Event) -> None:
        """Track every state change in a bounded in-memory ring buffer."""
        if not self._sessions:
            # No watches connected — skip payload construction, but still
            # consume a cursor value for the dropped change and remember it.
            # A watch that later resumes with a cursor BELOW this point missed
            # the change and is told to resync (see _is_stale_cursor). Bumping
            # the cursor is what keeps that check from looping: a snapshot
            # taken after the gap hands out a cursor >= _gap_cursor, which is
            # distinguishable from the pre-gap cursor a stale watch holds.
            self._cursor += 1
            self._gap_cursor = self._cursor
            return
        new_state: State | None = event.data.get("new_state")
        if new_state is None:
            return

        self._cursor += 1
        payload = {
            "entity_id": new_state.entity_id,
            "state": new_state.state,
            "new_state": self._state_to_payload(new_state),
            "context_id": new_state.context.id if new_state.context is not None else None,
            "last_updated": new_state.last_updated.timestamp(),
        }

        self._events.append(
            DeltaEvent(
                cursor=self._cursor,
                entity_id=new_state.entity_id,
                payload=payload,
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

        When attribute_diffs is True, populates session.last_sent_attrs so
        subsequent delta events can compute diffs against this baseline.
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
            snapshot.append(entry)
        return snapshot

    def _bisect_cursor(self, since_cursor: int) -> int:
        """Return the deque index of the first event with cursor > since_cursor.

        Cursors are monotonically increasing but NOT contiguous with the ring
        buffer: a state change that arrives while no watch session exists
        consumes a cursor value without appending an event (see
        _handle_state_changed). Deriving the index arithmetically from the
        oldest event's cursor therefore overshoots by the number of dropped
        changes and silently yields an empty slice — every later poll then
        answers "nothing changed" and the watch keeps stale tiles forever.
        Binary search is correct whether or not cursors are contiguous.

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

            payload = event.payload
            if slim:
                payload = self._slim_event_payload(payload)
            if compact:
                payload = self._compact_event(payload)
            # Apply attribute-level diff if enabled
            if attribute_diffs and session is not None:
                payload = self._apply_attribute_diff(payload, session, compact)
            matched.append(payload)
            last_sent_cursor = event.cursor
            if len(matched) >= limit:
                break

        if matched:
            return matched, last_sent_cursor
        return [], since_cursor

    def _apply_attribute_diff(
        self,
        payload: dict[str, Any],
        session: "WatchSession",
        compact: bool,
    ) -> dict[str, Any]:
        """Replace full attributes with a diff against last-sent values.

        Updates session.last_sent_attrs with the full attributes for next diff.
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

        if compact:
            return {**payload, "attributes": diffed}
        else:
            return {
                **payload,
                "new_state": {**payload["new_state"], "attributes": diffed},
            }

    def _is_stale_cursor(self, since_cursor: int) -> bool:
        """Return True if requested cursor is out of range.

        Covers three cases:
        - Cursor is older than the oldest retained event (buffer overflow).
        - Cursor is ahead of the current server cursor (HA restarted and
          the coordinator's cursor reset to 0 while the watch kept its old
          cursor from a previous instance).
        - Cursor is before the last change that was dropped because no watch
          was connected (idle gap). The dropped change consumed cursor value
          _gap_cursor without an event in the buffer, so a watch holding an
          older cursor missed it. A cursor equal to _gap_cursor came from a
          snapshot taken after the gap and is fine.
        """
        if since_cursor > self._cursor:
            return True
        if self._gap_cursor is not None and since_cursor < self._gap_cursor:
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
        # info.result is a method on RenderInfo, not the rendered value —
        # calling str() on it gave back the bound-method repr instead of
        # the actual template output. Invoke it; _evaluate_templates wraps
        # this in try/except so a render error becomes "".
        rendered = info.result()
        value = str(rendered).strip() if rendered is not None else ""
        deps = _TemplateDeps(
            entities=info.entities or frozenset(),
            domains=info.domains or frozenset(),
            all_states=info.all_states,
        )
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
        """Drop idle watch sessions."""
        cutoff = dt_util.utcnow() - SESSION_TTL
        expired = [
            watch_id
            for watch_id, session in self._sessions.items()
            if session.last_seen < cutoff
        ]
        for watch_id in expired:
            self._sessions.pop(watch_id, None)
            waiter = self._waiters.pop(watch_id, None)
            if waiter is not None:
                waiter.set()  # parked poll re-checks ownership and exits
            self._remove_watcher_index(watch_id)
        if expired:
            for watch_id in expired:
                log_session_dropped(self.hass, watch_id=watch_id, reason="idle_ttl")
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


