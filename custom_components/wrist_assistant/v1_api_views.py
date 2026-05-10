"""Legacy v1 long-poll / summary / states / Music Assistant / remote views.

These six views are the bearer-authed endpoints used by app builds prior
to the v2 transport:

- `WatchUpdatesView`           /api/watch/updates
- `WatchSummaryView`           /api/wrist_assistant/summary
- `WatchStatesBatchView`       /api/wrist_assistant/states_batch
- `MusicAssistantPlayersView`  /api/wrist_assistant/mass/players
- `MusicAssistantQueueView`    /api/wrist_assistant/mass/queue
- `RemoteCommandView`          /api/watch/remote_command

The v2 watch transport drives equivalent operations through ops on
`/v2/action` and the long-poll on `/v2/delta`. Both paths share the
runtime `DeltaCoordinator` and `_get_mass_client` helper from `api.py`.

This file should be deleted in the release that retires v1 — it has
no callers inside the v2 codebase. Note: `RemoteCommandView` owns
its own background task dictionary and is the one v1 view that does
not delegate work to the v2 op handlers.
"""

from __future__ import annotations

import asyncio
import gzip
import logging
from typing import Any

import orjson

from aiohttp.web import Request, Response

from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant, State

from .api import (
    DEFAULT_TIMEOUT_SECONDS,
    MAX_TIMEOUT_SECONDS,
    MIN_TIMEOUT_SECONDS,
    _get_mass_client,
)


class WatchUpdatesView(HomeAssistantView):
    """Authenticated long-poll endpoint for watch delta updates."""

    url = "/api/watch/updates"
    name = "api:wrist_assistant_updates"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def post(self, request: Request) -> Response:
        """Handle delta update poll request."""
        from .const import DOMAIN, WristAssistantData

        domain_data: WristAssistantData | None = self._hass.data.get(DOMAIN)
        if domain_data is None:
            return self.json_message("Integration not loaded", status_code=503)
        coordinator = domain_data.coordinator
        notification_store = domain_data.notification_store

        try:
            payload = await request.json()
        except (ValueError, UnicodeDecodeError):
            return self.json_message("Invalid JSON body", status_code=400)

        if not isinstance(payload, dict):
            return self.json_message("Expected JSON object body", status_code=400)

        watch_id = payload.get("watch_id")
        config_hash = payload.get("config_hash")
        since = payload.get("since")
        entities = payload.get("entities")
        timeout = payload.get("timeout", DEFAULT_TIMEOUT_SECONDS)

        if not isinstance(watch_id, str) or not watch_id:
            return self.json_message("watch_id is required", status_code=400)
        if not isinstance(config_hash, str) or not config_hash:
            return self.json_message("config_hash is required", status_code=400)
        if since is not None and not isinstance(since, (str, int)):
            return self.json_message("since must be a cursor", status_code=400)
        if entities is not None and not isinstance(entities, list):
            return self.json_message("entities must be an array of entity IDs", status_code=400)

        normalized_entities: list[str] | None = None
        if entities is not None:
            normalized_entities = []
            for entity_id in entities:
                if isinstance(entity_id, str) and entity_id:
                    normalized_entities.append(entity_id)

        if not isinstance(timeout, int):
            return self.json_message("timeout must be an integer", status_code=400)
        timeout = max(MIN_TIMEOUT_SECONDS, min(timeout, MAX_TIMEOUT_SECONDS))

        force_delta = payload.get("force_delta", False) is True
        slim = payload.get("slim", False) is True
        compact = payload.get("compact", False) is True
        attribute_diffs = payload.get("attribute_diffs", False) is True
        include_summary = payload.get("include_summary", False) is True
        raw_threshold = payload.get("battery_threshold", 20)
        battery_threshold = max(5, min(95, int(raw_threshold) if isinstance(raw_threshold, (int, float)) else 20))

        # Optional: per-domain entity filters for info_summary
        # e.g. {"light": ["light.kitchen"], "person": ["person.jesse"], "sensor": ["sensor.temp"]}
        raw_summary_entities = payload.get("summary_entities")
        summary_entities: dict[str, list[str]] | None = None
        if isinstance(raw_summary_entities, dict):
            summary_entities = {}
            for domain, ids in raw_summary_entities.items():
                if isinstance(domain, str) and isinstance(ids, list):
                    summary_entities[domain] = [eid for eid in ids if isinstance(eid, str) and eid]

        # Optional: arbitrary entity IDs for custom peek content (e.g. status page rows)
        raw_custom = payload.get("custom_entity_ids")
        custom_entity_ids: list[str] | None = None
        if isinstance(raw_custom, list):
            custom_entity_ids = [eid for eid in raw_custom if isinstance(eid, str) and eid]

        # Optional: template subscriptions (tile_id → Jinja2 string)
        raw_templates = payload.get("templates")
        templates: dict[str, str] | None = None
        if isinstance(raw_templates, dict):
            templates = {
                k: v for k, v in raw_templates.items()
                if isinstance(k, str) and isinstance(v, str) and k and v
            }

        # Piggyback device token registration on authenticated poll
        device_token = payload.get("device_token")
        if (
            notification_store is not None
            and isinstance(device_token, str)
            and device_token
        ):
            apns_env = payload.get("apns_environment", "production")
            if apns_env not in ("development", "production"):
                apns_env = "production"
            notification_store.register(
                watch_id, device_token, platform="watchos", environment=apns_env
            )

        status, body = await coordinator.handle_poll(
            watch_id=watch_id,
            since=since,
            config_hash=config_hash,
            entities=normalized_entities,
            timeout=timeout,
            force_delta=force_delta,
            battery_threshold=battery_threshold,
            summary_entities=summary_entities,
            slim=slim,
            compact=compact,
            attribute_diffs=attribute_diffs,
            include_summary=include_summary or force_delta or summary_entities is not None or custom_entity_ids is not None,
            templates=templates,
            custom_entity_ids=custom_entity_ids,
        )

        if status == 204:
            return Response(status=204)
        if body is None:
            return Response(status=status)

        json_bytes = orjson.dumps(body)

        # Gzip compress if the client supports it (skip for tiny payloads)
        accept_encoding = request.headers.get("Accept-Encoding", "")
        if "gzip" in accept_encoding and len(json_bytes) > 256:
            compressed = gzip.compress(json_bytes, compresslevel=1)
            return Response(
                body=compressed,
                status=status,
                content_type="application/json",
                headers={"Content-Encoding": "gzip"},
            )

        return Response(
            body=json_bytes,
            status=status,
            content_type="application/json",
        )


class WatchSummaryView(HomeAssistantView):
    """Authenticated endpoint for on-demand info summary snapshots."""

    url = "/api/wrist_assistant/summary"
    name = "api:wrist_assistant_summary"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def post(self, request: Request) -> Response:
        """Return an info summary without touching delta sessions."""
        from .const import DOMAIN, WristAssistantData

        domain_data: WristAssistantData | None = self._hass.data.get(DOMAIN)
        if domain_data is None:
            return self.json_message("Integration not loaded", status_code=503)
        coordinator = domain_data.coordinator

        try:
            payload = await request.json()
        except (ValueError, UnicodeDecodeError):
            payload = {}

        if payload is None:
            payload = {}
        if not isinstance(payload, dict):
            return self.json_message("Expected JSON object body", status_code=400)

        include_details = payload.get("include_details", True) is True
        raw_threshold = payload.get("battery_threshold", 20)
        battery_threshold = max(
            5,
            min(95, int(raw_threshold) if isinstance(raw_threshold, (int, float)) else 20),
        )

        raw_summary_entities = payload.get("summary_entities")
        summary_entities: dict[str, list[str]] | None = None
        if isinstance(raw_summary_entities, dict):
            summary_entities = {}
            for domain, ids in raw_summary_entities.items():
                if isinstance(domain, str) and isinstance(ids, list):
                    summary_entities[domain] = [
                        eid for eid in ids if isinstance(eid, str) and eid
                    ]

        raw_custom = payload.get("custom_entity_ids")
        custom_entity_ids: list[str] | None = None
        if isinstance(raw_custom, list):
            custom_entity_ids = [eid for eid in raw_custom if isinstance(eid, str) and eid]

        raw_fetch_domains = payload.get("fetch_domains")
        fetch_domains: dict[str, list[str] | None] | None = None
        if isinstance(raw_fetch_domains, dict):
            fetch_domains = {}
            for domain, dc_list in raw_fetch_domains.items():
                if isinstance(domain, str):
                    if isinstance(dc_list, list):
                        fetch_domains[domain] = [
                            dc for dc in dc_list if isinstance(dc, str) and dc
                        ]
                    else:
                        fetch_domains[domain] = None

        body = {
            "info_summary": coordinator._compute_info_summary(
                include_details=include_details,
                battery_threshold=battery_threshold,
                summary_entities=summary_entities,
                custom_entity_ids=custom_entity_ids,
                fetch_domains=fetch_domains,
            ),
            "capabilities": coordinator._sorted_capabilities,
        }

        json_bytes = orjson.dumps(body)
        accept_encoding = request.headers.get("Accept-Encoding", "")
        if "gzip" in accept_encoding and len(json_bytes) > 256:
            compressed = gzip.compress(json_bytes, compresslevel=1)
            return Response(
                body=compressed,
                status=200,
                content_type="application/json",
                headers={"Content-Encoding": "gzip"},
            )
        return Response(body=json_bytes, status=200, content_type="application/json")


class WatchStatesBatchView(HomeAssistantView):
    """Return full HA state objects for the entities a status page references.

    Used by the watch's full-screen status page sheet and the StatusPage Siri
    intent. Replaces calls to /api/states (which returns every entity in HA)
    plus N parallel /api/states/<id> calls for specific entities.
    """

    url = "/api/wrist_assistant/states_batch"
    name = "api:wrist_assistant_states_batch"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def post(self, request: Request) -> Response:
        try:
            payload = await request.json()
        except (ValueError, UnicodeDecodeError):
            payload = {}

        if not isinstance(payload, dict):
            return self.json_message("Expected JSON object body", status_code=400)

        raw_custom = payload.get("custom_entity_ids")
        custom_entity_ids: list[str] = []
        if isinstance(raw_custom, list):
            custom_entity_ids = [eid for eid in raw_custom if isinstance(eid, str) and eid]

        raw_fetch_domains = payload.get("fetch_domains")
        fetch_domains: dict[str, list[str] | None] = {}
        if isinstance(raw_fetch_domains, dict):
            for domain, dc_list in raw_fetch_domains.items():
                if isinstance(domain, str):
                    if isinstance(dc_list, list):
                        fetch_domains[domain] = [
                            dc for dc in dc_list if isinstance(dc, str) and dc
                        ]
                    else:
                        fetch_domains[domain] = None

        seen_ids: set[str] = set()
        states_out: list[dict[str, Any]] = []

        def append_state(state: State | None) -> None:
            if state is None or state.entity_id in seen_ids:
                return
            seen_ids.add(state.entity_id)
            states_out.append({
                "entity_id": state.entity_id,
                "state": state.state,
                "attributes": dict(state.attributes),
                "last_updated": state.last_updated.isoformat() if state.last_updated else None,
            })

        for eid in custom_entity_ids:
            append_state(self._hass.states.get(eid))

        for domain, dc_filter in fetch_domains.items():
            domain_prefix = f"{domain}."
            dc_set = set(dc_filter) if dc_filter else None
            for state in self._hass.states.async_all(domain):
                if not state.entity_id.startswith(domain_prefix):
                    continue
                if dc_set is not None:
                    if state.attributes.get("device_class") not in dc_set:
                        continue
                append_state(state)

        body = {"states": states_out}
        json_bytes = orjson.dumps(body, default=str)

        accept_encoding = request.headers.get("Accept-Encoding", "")
        if "gzip" in accept_encoding and len(json_bytes) > 256:
            compressed = gzip.compress(json_bytes, compresslevel=1)
            return Response(
                body=compressed,
                status=200,
                content_type="application/json",
                headers={"Content-Encoding": "gzip"},
            )
        return Response(body=json_bytes, status=200, content_type="application/json")


class MusicAssistantPlayersView(HomeAssistantView):
    """Return Music Assistant player info not available as HA entity attributes."""

    url = "/api/wrist_assistant/mass/players"
    name = "api:wrist_assistant_mass_players"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def get(self, request: Request) -> Response:
        mass_client = _get_mass_client(self._hass)
        if mass_client is None:
            return self.json({"available": False, "players": []})

        players = []
        for player in mass_client.players:
            info = {
                "player_id": player.player_id,
                "provider": player.provider,
                "can_group_with": sorted(player.can_group_with),
                "type": player.type.value if hasattr(player.type, "value") else str(player.type),
            }
            # Include display name so the watch app can match native HA entities
            if hasattr(player, "display_name") and player.display_name:
                info["display_name"] = player.display_name
            elif hasattr(player, "name") and player.name:
                info["display_name"] = player.name
            players.append(info)
        return self.json({"available": True, "players": players})


class MusicAssistantQueueView(HomeAssistantView):
    """Return queue items from Music Assistant's in-memory queue storage."""

    url = "/api/wrist_assistant/mass/queue"
    name = "api:wrist_assistant_mass_queue"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def get(self, request: Request) -> Response:
        queue_id = request.query.get("queue_id")
        if not queue_id:
            return self.json({"available": False, "error": "queue_id required"})

        mass_client = _get_mass_client(self._hass)
        if mass_client is None:
            return self.json({"available": False, "items": []})

        limit = int(request.query.get("limit", "50"))
        offset = int(request.query.get("offset", "0"))

        try:
            queue = mass_client.player_queues.get(queue_id)
            current_index = queue.current_index if queue else None
            raw_items = await mass_client.player_queues.get_queue_items(
                queue_id, limit=limit, offset=offset
            )
        except Exception:
            return self.json({"available": True, "current_index": None, "items": []})

        items = []
        for idx, item in enumerate(raw_items, start=offset):
            artist = None
            album = None
            image_url = None
            if hasattr(item, "media_item") and item.media_item:
                mi = item.media_item
                if hasattr(mi, "artists") and mi.artists:
                    artist = mi.artists[0].name if hasattr(mi.artists[0], "name") else str(mi.artists[0])
                if hasattr(mi, "album") and mi.album:
                    album = mi.album.name if hasattr(mi.album, "name") else str(mi.album)
            if hasattr(item, "image") and item.image:
                image_url = item.image.path if hasattr(item.image, "path") else str(item.image)
            items.append({
                "queue_item_id": item.queue_item_id,
                "name": item.name,
                "duration": item.duration,
                "index": idx,
                "artist": artist,
                "album": album,
                "image_url": image_url,
            })

        return self.json({
            "available": True,
            "current_index": current_index,
            "items": items,
        })

    async def post(self, request: Request) -> Response:
        """Play a specific queue item by index or queue_item_id."""
        mass_client = _get_mass_client(self._hass)
        if mass_client is None:
            return self.json({"error": "Music Assistant not available"}, status_code=503)

        body = await request.json()
        queue_id = body.get("queue_id")
        # Prefer queue_item_id (string) over index (int) — play_index accepts both
        item_id = body.get("queue_item_id") or body.get("index")

        if not queue_id or item_id is None:
            return self.json({"error": "queue_id and (queue_item_id or index) required"}, status_code=400)

        try:
            await mass_client.player_queues.play_index(queue_id, item_id)
            return self.json({"ok": True})
        except Exception as err:
            return self.json({"error": str(err)}, status_code=500)


_REMOTE_HOLD_TIMEOUT = 10.0  # Safety timeout in seconds
_logger = logging.getLogger(__name__)


class RemoteCommandView(HomeAssistantView):
    """Server-side remote hold endpoint for smooth D-pad navigation.

    Handles hold_start (begin repeat loop) and hold_stop (cancel it).
    Returns 200 immediately; the repeat loop runs in the background.
    """

    url = "/api/watch/remote_command"
    name = "api:wrist_assistant_remote_command"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._active_holds: dict[str, asyncio.Task] = {}

    async def post(self, request: Request) -> Response:
        body = await request.json()
        entity_id = body.get("entity_id")
        action = body.get("action")

        if not entity_id:
            return self.json({"error": "entity_id required"}, status_code=400)

        if action == "hold_stop":
            task = self._active_holds.pop(entity_id, None)
            if task is not None:
                task.cancel()
            return self.json({"ok": True})

        if action == "hold_start":
            command = body.get("command")
            if not command:
                return self.json({"error": "command required"}, status_code=400)
            hold_secs = body.get("hold_secs", 0.2)
            # Cancel any existing hold for this entity
            existing = self._active_holds.pop(entity_id, None)
            if existing is not None:
                existing.cancel()
            self._active_holds[entity_id] = self._hass.async_create_task(
                self._hold_loop(entity_id, command, hold_secs)
            )
            return self.json({"ok": True})

        return self.json({"error": "action required (hold_start or hold_stop)"}, status_code=400)

    async def _hold_loop(self, entity_id: str, command: str, hold_secs: float) -> None:
        """Repeat a remote command until cancelled or timeout."""
        try:
            elapsed = 0.0
            while elapsed < _REMOTE_HOLD_TIMEOUT:
                await self._hass.services.async_call(
                    "remote",
                    "send_command",
                    {"entity_id": entity_id, "command": command, "hold_secs": hold_secs},
                )
                await asyncio.sleep(hold_secs)
                elapsed += hold_secs
            _logger.debug("Remote hold timed out for %s", entity_id)
        except asyncio.CancelledError:
            pass
        finally:
            self._active_holds.pop(entity_id, None)

    def shutdown(self) -> None:
        """Cancel all active holds."""
        for task in self._active_holds.values():
            task.cancel()
        self._active_holds.clear()
