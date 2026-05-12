"""HMAC-authenticated /v2/* endpoints for the bearer-free watch transport.

The watch app no longer carries an HA bearer token. Every request from the
watch is HMAC-signed using a per-watch secret registered with HA at pair-time
(see `WARegisterSecretView` below). Read-style responses are
HMAC-signed back so a wrong host can't feed the watch forged data.

Endpoints registered here:

* `POST /api/wrist_assistant/v2/action` — small JSON ops dispatched by
  `X-WA-Op`. Vocabulary covers services, single-entity reads, batch reads,
  info summaries, snapshots, templates, Music Assistant queries, push
  registration, audio uploads, camera batches/devices, and remote commands.
  Service-style ops (todo / calendar / weather / notify / tts / conversation
  / assist_satellite / mass_search / etc.) all go through `op=service` with
  optional `return_response: true` since they're just service calls — there's
  no need for a separate op per HA service.

* `POST /api/wrist_assistant/v2/delta` — long-poll wrapper around the existing
  delta coordinator. Same payload, same gzip path, same response body as the
  legacy `/api/watch/updates`; the only difference is HMAC auth + a signed
  response body (post-gzip).

* `GET  /api/wrist_assistant/v2/stream/{token}` — multipart MJPEG stream. The
  token is a single-use opaque handshake artifact minted by `op=stream_open`;
  HMAC headers don't apply to this endpoint because per-frame signing isn't
  worth the cost. The token store binds the token to (watch_id, entity_id,
  params) for ~30 s; first GET consumes it and runs the frame loop until the
  client disconnects. Watch reconnects by re-handshaking.

Stream lifecycle on /v2/action:
  * `op=stream_open`   — mint a token, get back a signed URL.
  * `op=stream_update` — change viewport / width / quality / fps mid-stream.
  * `op=stream_close`  — release an unused token (no-op if already consumed).

Why share one nonce cache between /v2/action and /v2/delta?
The op string is part of the canonical input the HMAC signs, so a nonce
captured against `op=service` cannot be replayed against `op=delta` even
with the same body. One cache is cheaper than several, and replay protection
holds.
"""

from __future__ import annotations

import asyncio
import base64
import gzip
import logging
import os
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from functools import partial
from pathlib import Path
from typing import Any

import orjson
from aiohttp.web import Request, Response, StreamResponse
from homeassistant import loader
from homeassistant.components.camera import async_get_image
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant, ServiceResponse
from homeassistant.exceptions import HomeAssistantError, ServiceNotFound
from homeassistant.helpers.template import Template, TemplateError

from .audio_upload import CLEANUP_AGE_SECONDS, MAX_UPLOAD_SIZE
from .camera_devices import build_camera_device_groups
from .camera_stream import (
    DEFAULT_FPS,
    DEFAULT_QUALITY,
    DEFAULT_WIDTH,
    MAX_BATCH_CAMERAS,
    MAX_FPS,
    MAX_QUALITY,
    MAX_WIDTH,
    MIN_FPS,
    MIN_QUALITY,
    MIN_WIDTH,
    SNAPSHOT_DEFAULT_QUALITY,
    SNAPSHOT_MAX_BYTES,
    SNAPSHOT_MAX_HEIGHT,
    SNAPSHOT_MAX_WIDTH,
    ViewportState,
    _process_frame,
    _process_snapshot,
    _UNSET,
    run_mjpeg_stream,
)
from .const import (
    APP_UPDATE_MESSAGE,
    DOMAIN,
    MIN_SUPPORTED_APP_PROTOCOL_VERSION,
    WA_PROTOCOL_VERSION,
    WA_STREAM_TOKEN_TTL_SECONDS,
    WristAssistantData,
)
from .logbook_events import log_hmac_failure, log_secret_registered
from .widget_hmac import (
    DEFAULT_HMAC_ALGO,
    SUPPORTED_HMAC_ALGOS,
    WAHMACError,
    WANonceCache,
    sign_response,
    validate_wa_request,
)

_LOGGER = logging.getLogger(__name__)


# ── shared dispatch context ───────────────────────────────────────────────


@dataclass
class _OpContext:
    """Per-request state passed to op handlers.

    `body` is the raw request bytes (already HMAC-validated). For JSON ops the
    handler receives `payload` pre-parsed; raw-body ops (audio_upload) read
    `body` directly.
    """

    hass: HomeAssistant
    domain_data: WristAssistantData
    payload: dict[str, Any]
    body: bytes
    secret_bytes: bytes
    watch_id: str
    version: int
    request: Request
    op: str
    algo: str

    def signed_json(
        self,
        body: dict[str, Any],
        *,
        status: int = 200,
    ) -> Response:
        """Serialize JSON, sign it, return with X-WA-Ts/X-WA-Sig headers.

        `OPT_NON_STR_KEYS` lets us round-trip HA state attributes that contain
        nested dicts with non-string keys (e.g. a `number` entity's
        `reserved_values: {0: "..."}`). Without it, `orjson.dumps` raises
        `TypeError: Dict key must be str` and the op handler 500s.

        Response is gzipped when the client supports it and the body is large
        enough to benefit. Signing happens against the un-gzipped JSON bytes
        because watchOS URLSession decompresses transparently before the watch
        verifies; signing the wire bytes would never verify.
        """
        json_bytes = orjson.dumps(
            body, default=str, option=orjson.OPT_NON_STR_KEYS
        )
        accept_encoding = self.request.headers.get("Accept-Encoding", "")
        gzip_ok = "gzip" in accept_encoding and len(json_bytes) > 256

        ts = int(time.time())
        sig = sign_response(
            self.secret_bytes,
            self.op,
            self.watch_id,
            ts,
            json_bytes,
            version=self.version,
            algo=self.algo,
        )

        headers = {"X-WA-Ts": str(ts), "X-WA-Sig": sig}
        if gzip_ok:
            wire_body = gzip.compress(json_bytes, compresslevel=1)
            headers["Content-Encoding"] = "gzip"
        else:
            wire_body = json_bytes

        return Response(
            body=wire_body,
            status=status,
            content_type="application/json",
            headers=headers,
        )

    def signed_bytes(
        self,
        body: bytes,
        *,
        status: int = 200,
        content_type: str = "application/octet-stream",
        extra_headers: dict[str, str] | None = None,
    ) -> Response:
        """Sign arbitrary bytes and return the response with HMAC headers."""
        ts = int(time.time())
        sig = sign_response(
            self.secret_bytes,
            self.op,
            self.watch_id,
            ts,
            body,
            version=self.version,
            algo=self.algo,
        )
        headers = {"X-WA-Ts": str(ts), "X-WA-Sig": sig}
        if extra_headers:
            headers.update(extra_headers)
        return Response(
            body=body,
            status=status,
            content_type=content_type,
            headers=headers,
        )


# ── /v2/action view ──────────────────────────────────────────────────────


class WAActionView(HomeAssistantView):
    """HMAC-authenticated dispatch for small ops.

    Lives at `/api/wrist_assistant/v2/action`. Validates HMAC, parses the JSON
    body, looks up the op handler in `_OP_HANDLERS`, returns the handler's
    Response. Unknown op → 400. Auth failure → 401 (uniform reason regardless
    of which check failed; debug log carries the specific tag).
    """

    url = "/api/wrist_assistant/v2/action"
    name = "api:wrist_assistant_v2_action"
    # HMAC handles auth; HA's bearer middleware is bypassed.
    requires_auth = False

    def __init__(self, hass: HomeAssistant, nonce_cache: WANonceCache) -> None:
        self._hass = hass
        self._nonce_cache = nonce_cache

    async def post(self, request: Request) -> Response:
        domain_data: WristAssistantData | None = self._hass.data.get(DOMAIN)
        if domain_data is None:
            return Response(status=503, text="Integration not loaded")

        body = await request.read()

        try:
            validated = validate_wa_request(
                request,
                body,
                domain_data.widget_secret_store,
                self._nonce_cache,
            )
        except WAHMACError as err:
            _LOGGER.debug("WA HMAC rejected (v2/action): %s", err.reason)
            attempted_watch = request.headers.get("X-WA-Watch", "")
            log_hmac_failure(
                self._hass,
                watch_id=attempted_watch,
                reason=err.reason,
                is_known_watch=domain_data.widget_secret_store.get(attempted_watch)
                is not None,
            )
            return Response(status=401, text="Unauthorized")

        secret_entry = domain_data.widget_secret_store.get(validated.watch_id)
        if secret_entry is None or secret_entry.secret_bytes is None:
            # Race with deletion between validate and dispatch, or storage
            # corruption — either way, treat as unknown.
            return Response(status=401, text="Unauthorized")

        # Audio upload sends raw bytes; everything else is JSON.
        if validated.op == "audio_upload":
            payload: dict[str, Any] = {}
        else:
            try:
                parsed = orjson.loads(body) if body else {}
            except (ValueError, orjson.JSONDecodeError):
                return Response(status=400, text="Invalid JSON body")
            if not isinstance(parsed, dict):
                return Response(status=400, text="Expected JSON object body")
            payload = parsed

        ctx = _OpContext(
            hass=self._hass,
            domain_data=domain_data,
            payload=payload,
            body=body,
            secret_bytes=secret_entry.secret_bytes,
            watch_id=validated.watch_id,
            version=validated.version,
            request=request,
            op=validated.op,
            algo=validated.algo,
        )

        handler = _OP_HANDLERS.get(validated.op)
        if handler is None:
            return Response(status=400, text=f"Unknown op: {validated.op}")

        try:
            return await handler(ctx)
        except HomeAssistantError as err:
            _LOGGER.warning("Op %s failed: %s", validated.op, err)
            return ctx.signed_json({"ok": False, "error": str(err)}, status=502)
        except Exception:
            _LOGGER.exception("Unexpected error in op %s", validated.op)
            return Response(status=500, text="Internal error")


# ── /v2/delta view ───────────────────────────────────────────────────────


class WADeltaView(HomeAssistantView):
    """HMAC-authenticated long-poll wrapper for delta updates.

    Mirrors the legacy `/api/watch/updates` payload and response. Holds the
    connection up to MAX_TIMEOUT_SECONDS while waiting for state changes.
    Response body is gzipped when the client advertises it; HMAC signs the
    bytes shipped on the wire (post-gzip), so an attacker can't substitute
    a different uncompressed body that decompresses identically.
    """

    url = "/api/wrist_assistant/v2/delta"
    name = "api:wrist_assistant_v2_delta"
    requires_auth = False

    def __init__(self, hass: HomeAssistant, nonce_cache: WANonceCache) -> None:
        self._hass = hass
        self._nonce_cache = nonce_cache

    async def post(self, request: Request) -> Response:
        from .api import (  # local import — avoids module-load cycle
            DEFAULT_TIMEOUT_SECONDS,
            MAX_TIMEOUT_SECONDS,
            MIN_TIMEOUT_SECONDS,
        )

        domain_data: WristAssistantData | None = self._hass.data.get(DOMAIN)
        if domain_data is None:
            return Response(status=503, text="Integration not loaded")

        body = await request.read()

        try:
            validated = validate_wa_request(
                request,
                body,
                domain_data.widget_secret_store,
                self._nonce_cache,
            )
        except WAHMACError as err:
            _LOGGER.debug("WA HMAC rejected (v2/delta): %s", err.reason)
            attempted_watch = request.headers.get("X-WA-Watch", "")
            log_hmac_failure(
                self._hass,
                watch_id=attempted_watch,
                reason=err.reason,
                is_known_watch=domain_data.widget_secret_store.get(attempted_watch)
                is not None,
            )
            return Response(status=401, text="Unauthorized")

        secret_entry = domain_data.widget_secret_store.get(validated.watch_id)
        if secret_entry is None or secret_entry.secret_bytes is None:
            return Response(status=401, text="Unauthorized")

        try:
            payload = orjson.loads(body) if body else {}
        except (ValueError, orjson.JSONDecodeError):
            return Response(status=400, text="Invalid JSON body")
        if not isinstance(payload, dict):
            return Response(status=400, text="Expected JSON object body")

        # Cross-check: the watch_id in the HMAC header is the source of truth.
        # If the body's watch_id disagrees, reject — a confused client should
        # not be allowed to address another watch's session.
        body_watch_id = payload.get("watch_id")
        if isinstance(body_watch_id, str) and body_watch_id and body_watch_id != validated.watch_id:
            _LOGGER.debug("v2/delta watch_id mismatch (header vs body)")
            return Response(status=400, text="watch_id mismatch")

        # Use the HMAC-validated watch_id; ignore whatever the body said.
        watch_id = validated.watch_id
        config_hash = payload.get("config_hash")
        since = payload.get("since")
        entities = payload.get("entities")
        timeout = payload.get("timeout", DEFAULT_TIMEOUT_SECONDS)

        if not isinstance(config_hash, str) or not config_hash:
            return Response(status=400, text="config_hash is required")
        if since is not None and not isinstance(since, (str, int)):
            return Response(status=400, text="since must be a cursor")
        if entities is not None and not isinstance(entities, list):
            return Response(status=400, text="entities must be an array of entity IDs")

        normalized_entities: list[str] | None = None
        if entities is not None:
            normalized_entities = [
                eid for eid in entities if isinstance(eid, str) and eid
            ]

        if not isinstance(timeout, int):
            return Response(status=400, text="timeout must be an integer")
        timeout = max(MIN_TIMEOUT_SECONDS, min(timeout, MAX_TIMEOUT_SECONDS))

        force_delta = payload.get("force_delta", False) is True
        slim = payload.get("slim", False) is True
        compact = payload.get("compact", False) is True
        attribute_diffs = payload.get("attribute_diffs", False) is True
        include_summary = payload.get("include_summary", False) is True
        raw_threshold = payload.get("battery_threshold", 20)
        battery_threshold = max(
            5,
            min(95, int(raw_threshold) if isinstance(raw_threshold, (int, float)) else 20),
        )

        raw_summary_entities = payload.get("summary_entities")
        summary_entities: dict[str, list[str]] | None = None
        if isinstance(raw_summary_entities, dict):
            summary_entities = {}
            for d, ids in raw_summary_entities.items():
                if isinstance(d, str) and isinstance(ids, list):
                    summary_entities[d] = [
                        eid for eid in ids if isinstance(eid, str) and eid
                    ]

        raw_custom = payload.get("custom_entity_ids")
        custom_entity_ids: list[str] | None = None
        if isinstance(raw_custom, list):
            custom_entity_ids = [
                eid for eid in raw_custom if isinstance(eid, str) and eid
            ]

        raw_templates = payload.get("templates")
        templates: dict[str, str] | None = None
        if isinstance(raw_templates, dict):
            templates = {
                k: v
                for k, v in raw_templates.items()
                if isinstance(k, str) and isinstance(v, str) and k and v
            }

        # Push notification token registration piggybacks on long-poll.
        device_token = payload.get("device_token")
        notification_store = domain_data.notification_store
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

        coordinator = domain_data.coordinator
        status, body_dict = await coordinator.handle_poll(
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
            include_summary=(
                include_summary
                or force_delta
                or summary_entities is not None
                or custom_entity_ids is not None
            ),
            templates=templates,
            custom_entity_ids=custom_entity_ids,
        )

        if status == 204 or body_dict is None:
            # No body to sign — sign empty bytes so the watch can still verify
            # the timestamp and confirm the response came from the registered host.
            ts = int(time.time())
            sig = sign_response(
                secret_entry.secret_bytes,
                validated.op,
                watch_id,
                ts,
                b"",
                version=validated.version,
                algo=validated.algo,
            )
            return Response(
                status=status if status == 204 else status,
                headers={"X-WA-Ts": str(ts), "X-WA-Sig": sig},
            )

        # `OPT_NON_STR_KEYS` covers state attributes whose nested dicts use
        # non-string keys (e.g. a `number` entity's `reserved_values:
        # {0: "..."}`); see `_OpContext.signed_json`.
        json_bytes = orjson.dumps(body_dict, option=orjson.OPT_NON_STR_KEYS)

        # Sign the JSON bytes (pre-gzip). watchOS URLSession transparently
        # decompresses gzip-encoded responses even when the request set
        # `Accept-Encoding: gzip` explicitly, so the watch always sees the
        # JSON bytes — signing the wire (gzipped) bytes would fail to verify.
        ts = int(time.time())
        sig = sign_response(
            secret_entry.secret_bytes,
            validated.op,
            watch_id,
            ts,
            json_bytes,
            version=validated.version,
            algo=validated.algo,
        )

        # Gzip when the client supports it and the body is large enough to
        # benefit. The wire body is gzip(json_bytes); signing happened above
        # against json_bytes so transport-layer compression is invisible to
        # the verifier.
        accept_encoding = request.headers.get("Accept-Encoding", "")
        if "gzip" in accept_encoding and len(json_bytes) > 256:
            wire_body = gzip.compress(json_bytes, compresslevel=1)
            content_encoding = "gzip"
        else:
            wire_body = json_bytes
            content_encoding = None

        headers = {"X-WA-Ts": str(ts), "X-WA-Sig": sig}
        if content_encoding:
            headers["Content-Encoding"] = content_encoding

        return Response(
            body=wire_body,
            status=status,
            content_type="application/json",
            headers=headers,
        )


# ── op handlers ──────────────────────────────────────────────────────────


async def _op_service(ctx: _OpContext) -> Response:
    """Generic service call. Optionally returns the service response.

    Body shape:
        {
          "domain": "<domain>",
          "service": "<service>",
          "entity_id": "<entity_id>"?,
          "service_data": {...}?,
          "return_response": <bool>?,    # opt-in for return_response services
        }

    All non-direct-state ops route through this — todo/calendar/weather/
    notify/tts/conversation/assist_satellite/mass_search/etc. The watch sends
    the same shape it would have sent to /api/services/<domain>/<service>.
    """
    domain = ctx.payload.get("domain")
    service = ctx.payload.get("service")
    if not isinstance(domain, str) or not domain:
        return Response(status=400, text="domain required")
    if not isinstance(service, str) or not service:
        return Response(status=400, text="service required")

    service_data: dict[str, Any] = {}
    entity_id = ctx.payload.get("entity_id")
    if isinstance(entity_id, str) and entity_id:
        service_data["entity_id"] = entity_id
    extra = ctx.payload.get("service_data")
    if isinstance(extra, dict):
        # Body-level entity_id wins if both are set.
        for key, value in extra.items():
            if isinstance(key, str) and key not in service_data:
                service_data[key] = value

    return_response = ctx.payload.get("return_response") is True

    try:
        if return_response:
            response_data: ServiceResponse = await ctx.hass.services.async_call(
                domain,
                service,
                service_data,
                blocking=True,
                return_response=True,
            )
            return ctx.signed_json({"ok": True, "response": response_data})
        else:
            await ctx.hass.services.async_call(
                domain, service, service_data, blocking=False
            )
            return ctx.signed_json({"ok": True})
    except ServiceNotFound as err:
        return ctx.signed_json(
            {"ok": False, "error": f"Service not found: {err}"}, status=404
        )
    except HomeAssistantError as err:
        _LOGGER.warning(
            "Service %s.%s failed: %s", domain, service, err
        )
        return ctx.signed_json({"ok": False, "error": str(err)}, status=502)


async def _op_state(ctx: _OpContext) -> Response:
    """Single-entity state read."""
    entity_id = ctx.payload.get("entity_id")
    if not isinstance(entity_id, str) or not entity_id:
        return Response(status=400, text="entity_id required")

    state = ctx.hass.states.get(entity_id)
    if state is None:
        return ctx.signed_json(
            {"found": False, "entity_id": entity_id}, status=404
        )

    return ctx.signed_json(
        {
            "found": True,
            "entity_id": state.entity_id,
            "state": state.state,
            "attributes": dict(state.attributes),
            "last_updated": state.last_updated.isoformat()
            if state.last_updated
            else None,
        }
    )


# Cap entries server-side so a flappy sensor over a wide window can't blow
# past the watch's budget. ~500 points renders cleanly in Charts and gzips
# down to a couple KB.
MAX_HISTORY_ENTRIES = 500


async def _op_history(ctx: _OpContext) -> Response:
    """Single-entity state-change history for the watch's chart view.

    Payload shape:
        {
          "entity_id": "<entity_id>",
          "start_ms": <epoch ms>,
          "end_ms":   <epoch ms>?,   # defaults to now
        }

    Response shape (compact, designed for cheap decode on watch):
        {
          "entity_id": "<entity_id>",
          "entries": [
            {"s": "<state>", "t": <epoch_ms>},
            ...
          ]
        }

    Backed by recorder's in-process `state_changes_during_period` — no
    WebSocket round-trip, no HTTP hop inside HA. `significant_changes_only`
    drops sub-resolution noise; `minimal_response` strips attributes (the
    chart only needs state + timestamp).
    """
    entity_id = ctx.payload.get("entity_id")
    if not isinstance(entity_id, str) or not entity_id:
        return Response(status=400, text="entity_id required")

    start_raw = ctx.payload.get("start_ms")
    if not isinstance(start_raw, (int, float)):
        return Response(status=400, text="start_ms required")
    try:
        start = datetime.fromtimestamp(start_raw / 1000.0, tz=timezone.utc)
    except (ValueError, OSError, OverflowError):
        return Response(status=400, text="start_ms invalid")

    end: datetime | None = None
    end_raw = ctx.payload.get("end_ms")
    if isinstance(end_raw, (int, float)):
        try:
            end = datetime.fromtimestamp(end_raw / 1000.0, tz=timezone.utc)
        except (ValueError, OSError, OverflowError):
            return Response(status=400, text="end_ms invalid")

    try:
        from homeassistant.components.recorder import get_instance
        from homeassistant.components.recorder.history import (
            state_changes_during_period,
        )
    except ImportError:
        return ctx.signed_json(
            {"ok": False, "error": "recorder unavailable"}, status=503
        )

    recorder = get_instance(ctx.hass)
    try:
        # Keyword args via `partial` — `state_changes_during_period`'s
        # positional signature changed across recorder versions, so binding
        # by name keeps us safe. Defaults give us oldest-first ordering,
        # no row limit (we cap below), and the start-of-window anchor state
        # so the chart has a leftmost data point. `no_attributes=True` is
        # the only override — we never use attributes here.
        states_by_entity = await recorder.async_add_executor_job(
            partial(
                state_changes_during_period,
                ctx.hass,
                start,
                end,
                entity_id,
                no_attributes=True,
            )
        )
    except HomeAssistantError as err:
        _LOGGER.warning("op=history failed for %s: %s", entity_id, err)
        return ctx.signed_json({"ok": False, "error": str(err)}, status=502)

    raw = states_by_entity.get(entity_id, []) or []
    # Most recent N — chart only needs the tail of the window.
    if len(raw) > MAX_HISTORY_ENTRIES:
        raw = raw[-MAX_HISTORY_ENTRIES:]

    entries = []
    for s in raw:
        last_changed = getattr(s, "last_changed", None)
        if last_changed is None:
            continue
        entries.append(
            {
                "s": s.state,
                "t": int(last_changed.timestamp() * 1000),
            }
        )

    return ctx.signed_json({"entity_id": entity_id, "entries": entries})


async def _op_states_batch(ctx: _OpContext) -> Response:
    """Multi-entity state read with optional per-domain filters.

    Payload shape:
        {
          "custom_entity_ids": ["camera.front", ...]?,
          "fetch_domains": {"sensor": ["temperature", ...] | null}?,
          "all": <bool>?,    # opt-in for "every state in HA"
        }

    When `all` is true and no other filters are given, returns every state
    in HA (replaces the watch's old GET `/api/states` call, which is gone in
    bearer-free mode).
    """
    raw_custom = ctx.payload.get("custom_entity_ids")
    custom_entity_ids: list[str] = []
    if isinstance(raw_custom, list):
        custom_entity_ids = [
            eid for eid in raw_custom if isinstance(eid, str) and eid
        ]

    raw_fetch_domains = ctx.payload.get("fetch_domains")
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

    return_all = ctx.payload.get("all") is True

    seen_ids: set[str] = set()
    states_out: list[dict[str, Any]] = []

    def append_state(state) -> None:
        if state is None or state.entity_id in seen_ids:
            return
        seen_ids.add(state.entity_id)
        states_out.append(
            {
                "entity_id": state.entity_id,
                "state": state.state,
                "attributes": dict(state.attributes),
                "last_updated": state.last_updated.isoformat()
                if state.last_updated
                else None,
            }
        )

    if return_all and not custom_entity_ids and not fetch_domains:
        for state in ctx.hass.states.async_all():
            append_state(state)
    else:
        for eid in custom_entity_ids:
            append_state(ctx.hass.states.get(eid))

        for domain, dc_filter in fetch_domains.items():
            domain_prefix = f"{domain}."
            dc_set = set(dc_filter) if dc_filter else None
            for state in ctx.hass.states.async_all(domain):
                if not state.entity_id.startswith(domain_prefix):
                    continue
                if dc_set is not None:
                    if state.attributes.get("device_class") not in dc_set:
                        continue
                append_state(state)

    return ctx.signed_json({"states": states_out})


async def _op_info(ctx: _OpContext) -> Response:
    """Info-summary read. Mirrors `/api/wrist_assistant/summary`."""
    coordinator = ctx.domain_data.coordinator

    include_details = ctx.payload.get("include_details", True) is True
    raw_threshold = ctx.payload.get("battery_threshold", 20)
    battery_threshold = max(
        5,
        min(95, int(raw_threshold) if isinstance(raw_threshold, (int, float)) else 20),
    )

    raw_summary_entities = ctx.payload.get("summary_entities")
    summary_entities: dict[str, list[str]] | None = None
    if isinstance(raw_summary_entities, dict):
        summary_entities = {}
        for d, ids in raw_summary_entities.items():
            if isinstance(d, str) and isinstance(ids, list):
                summary_entities[d] = [
                    eid for eid in ids if isinstance(eid, str) and eid
                ]

    raw_custom = ctx.payload.get("custom_entity_ids")
    custom_entity_ids: list[str] | None = None
    if isinstance(raw_custom, list):
        custom_entity_ids = [
            eid for eid in raw_custom if isinstance(eid, str) and eid
        ]

    raw_fetch_domains = ctx.payload.get("fetch_domains")
    fetch_domains: dict[str, list[str] | None] | None = None
    if isinstance(raw_fetch_domains, dict):
        fetch_domains = {}
        for d, dc_list in raw_fetch_domains.items():
            if isinstance(d, str):
                if isinstance(dc_list, list):
                    fetch_domains[d] = [
                        dc for dc in dc_list if isinstance(dc, str) and dc
                    ]
                else:
                    fetch_domains[d] = None

    return ctx.signed_json(
        {
            "info_summary": coordinator._compute_info_summary(
                include_details=include_details,
                battery_threshold=battery_threshold,
                summary_entities=summary_entities,
                custom_entity_ids=custom_entity_ids,
                fetch_domains=fetch_domains,
            ),
            "capabilities": coordinator._sorted_capabilities,
        }
    )


async def _op_snapshot(ctx: _OpContext) -> Response:
    """Single resized JPEG. Body is binary; HMAC headers sign the bytes."""
    entity_id = ctx.payload.get("entity_id")
    if not isinstance(entity_id, str) or not entity_id.startswith("camera."):
        return Response(status=400, text="entity_id required and must be a camera")

    state = ctx.hass.states.get(entity_id)
    if state is None:
        return Response(status=404, text="Camera entity not found")

    def _bound(value: Any, default: int, lo: int, hi: int) -> int:
        try:
            v = int(value) if value is not None else default
        except (TypeError, ValueError):
            v = default
        return max(lo, min(hi, v))

    width = _bound(
        ctx.payload.get("width"), SNAPSHOT_MAX_WIDTH, MIN_WIDTH, SNAPSHOT_MAX_WIDTH
    )
    max_height = _bound(
        ctx.payload.get("max_height"),
        SNAPSHOT_MAX_HEIGHT,
        MIN_WIDTH,
        SNAPSHOT_MAX_HEIGHT,
    )
    quality = _bound(
        ctx.payload.get("quality"),
        SNAPSHOT_DEFAULT_QUALITY,
        MIN_QUALITY,
        MAX_QUALITY,
    )

    viewport = ViewportState()
    raw_viewport = ctx.payload.get("viewport")
    if isinstance(raw_viewport, dict):
        # Body uses `width`/`height` keys (Swift JSON convention); the
        # ViewportState dataclass uses `w`/`h`. Translate explicitly. Falls
        # back to `w`/`h` keys too so a future client sending the dataclass
        # shape directly still works.
        try:
            viewport = ViewportState(
                x=float(raw_viewport.get("x", 0.0)),
                y=float(raw_viewport.get("y", 0.0)),
                w=float(raw_viewport.get("width", raw_viewport.get("w", 1.0))),
                h=float(raw_viewport.get("height", raw_viewport.get("h", 1.0))),
            )
        except (TypeError, ValueError):
            viewport = ViewportState()

    try:
        image = await async_get_image(ctx.hass, entity_id, timeout=5)
    except HomeAssistantError:
        return Response(status=503, text="Camera unavailable")
    if image is None or image.content is None:
        return Response(status=503, text="No image available")

    processed = await ctx.hass.async_add_executor_job(
        _process_snapshot,
        image.content,
        viewport,
        width,
        max_height,
        quality,
        SNAPSHOT_MAX_BYTES,
    )
    if processed is None:
        return Response(status=503, text="Image exceeds size budget")

    return ctx.signed_bytes(
        processed,
        content_type="image/jpeg",
        extra_headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
        },
    )


async def _op_template(ctx: _OpContext) -> Response:
    """Render a Jinja template. Body: {template, variables?}."""
    template_str = ctx.payload.get("template")
    variables = ctx.payload.get("variables")
    if not isinstance(template_str, str) or not template_str:
        return Response(status=400, text="template required")
    if variables is not None and not isinstance(variables, dict):
        return Response(status=400, text="variables must be an object")

    try:
        tpl = Template(template_str, ctx.hass)
        result = tpl.async_render(variables=variables)
    except TemplateError as err:
        return ctx.signed_json(
            {"ok": False, "error": str(err)}, status=400
        )

    return ctx.signed_json({"ok": True, "result": result})


async def _op_services_list(ctx: _OpContext) -> Response:
    """List services for a domain. Used by the watch to enumerate the user's
    available `notify.*` services without calling `/api/services` directly.

    Body: {"domain": "<domain>"}
    """
    domain = ctx.payload.get("domain")
    if not isinstance(domain, str) or not domain:
        return Response(status=400, text="domain required")

    services_for_domain = ctx.hass.services.async_services().get(domain, {})
    services = [
        {"service": svc_name, "name": getattr(svc, "name", None) or svc_name}
        for svc_name, svc in services_for_domain.items()
    ]
    services.sort(key=lambda item: item["service"])
    return ctx.signed_json({"domain": domain, "services": services})


async def _op_config_entries_list(ctx: _OpContext) -> Response:
    """List config entries, optionally filtered by domain. Used by the watch
    to discover the Music Assistant `entry_id` without calling
    `/api/config/config_entries/entry` directly.

    Body: {"domain": "<domain>"?}  # optional filter
    """
    domain_filter = ctx.payload.get("domain")
    if domain_filter is not None and not isinstance(domain_filter, str):
        return Response(status=400, text="domain must be a string")

    entries: list[dict[str, Any]] = []
    for entry in ctx.hass.config_entries.async_entries():
        if domain_filter and entry.domain != domain_filter:
            continue
        entries.append(
            {
                "entry_id": entry.entry_id,
                "domain": entry.domain,
                "title": entry.title,
            }
        )
    return ctx.signed_json({"entries": entries})


async def _op_mass_players(ctx: _OpContext) -> Response:
    """Music Assistant player info."""
    from .api import _get_mass_client

    mass_client = _get_mass_client(ctx.hass)
    if mass_client is None:
        return ctx.signed_json({"available": False, "players": []})

    players = []
    for player in mass_client.players:
        info = {
            "player_id": player.player_id,
            "provider": player.provider,
            "can_group_with": sorted(player.can_group_with),
            "type": player.type.value
            if hasattr(player.type, "value")
            else str(player.type),
        }
        if hasattr(player, "display_name") and player.display_name:
            info["display_name"] = player.display_name
        elif hasattr(player, "name") and player.name:
            info["display_name"] = player.name
        players.append(info)
    return ctx.signed_json({"available": True, "players": players})


async def _op_mass_queue(ctx: _OpContext) -> Response:
    """Music Assistant queue contents for a given queue id."""
    from .api import _get_mass_client

    queue_id = ctx.payload.get("queue_id")
    if not isinstance(queue_id, str) or not queue_id:
        return Response(status=400, text="queue_id required")

    mass_client = _get_mass_client(ctx.hass)
    if mass_client is None:
        return ctx.signed_json({"available": False, "items": []})

    raw_limit = ctx.payload.get("limit", 50)
    raw_offset = ctx.payload.get("offset", 0)
    try:
        limit = int(raw_limit)
        offset = int(raw_offset)
    except (TypeError, ValueError):
        return Response(status=400, text="limit/offset must be integers")
    limit = max(1, min(limit, 200))
    offset = max(0, offset)

    try:
        queue = mass_client.player_queues.get(queue_id)
        current_index = queue.current_index if queue else None
        raw_items = await mass_client.player_queues.get_queue_items(
            queue_id, limit=limit, offset=offset
        )
    except Exception:  # noqa: BLE001
        return ctx.signed_json(
            {"available": True, "current_index": None, "items": []}
        )

    items = []
    for idx, item in enumerate(raw_items, start=offset):
        artist = None
        album = None
        image_url = None
        if hasattr(item, "media_item") and item.media_item:
            mi = item.media_item
            if hasattr(mi, "artists") and mi.artists:
                artist = (
                    mi.artists[0].name
                    if hasattr(mi.artists[0], "name")
                    else str(mi.artists[0])
                )
            if hasattr(mi, "album") and mi.album:
                album = mi.album.name if hasattr(mi.album, "name") else str(mi.album)
        if hasattr(item, "image") and item.image:
            image_url = (
                item.image.path
                if hasattr(item.image, "path")
                else str(item.image)
            )
        items.append(
            {
                "queue_item_id": item.queue_item_id,
                "name": item.name,
                "duration": item.duration,
                "index": idx,
                "artist": artist,
                "album": album,
                "image_url": image_url,
            }
        )

    return ctx.signed_json(
        {
            "available": True,
            "current_index": current_index,
            "items": items,
        }
    )


async def _op_mass_play_queue_item(ctx: _OpContext) -> Response:
    """Skip the queue to a specific queue item (or numeric index).

    Body: {"queue_id": "<id>", "queue_item_id": "<id>"}  # or "index": <int>
    """
    from .api import _get_mass_client

    queue_id = ctx.payload.get("queue_id")
    if not isinstance(queue_id, str) or not queue_id:
        return Response(status=400, text="queue_id required")

    item_id = ctx.payload.get("queue_item_id")
    if item_id is None:
        item_id = ctx.payload.get("index")
    if item_id is None:
        return Response(status=400, text="queue_item_id or index required")

    mass_client = _get_mass_client(ctx.hass)
    if mass_client is None:
        return ctx.signed_json({"ok": False, "error": "Music Assistant not available"}, status=503)

    try:
        await mass_client.player_queues.play_index(queue_id, item_id)
    except Exception as err:  # noqa: BLE001
        return ctx.signed_json({"ok": False, "error": str(err)}, status=500)

    return ctx.signed_json({"ok": True})


async def _op_fire_event(ctx: _OpContext) -> Response:
    """Fire a custom event on the HA event bus.

    Body: {"event_type": "wrist_assistant_*", "event_data": {...}?}

    Restricted to event types matching `wrist_assistant_*` so a misrouted
    request can't fire arbitrary HA events.
    """
    event_type = ctx.payload.get("event_type")
    if not isinstance(event_type, str) or not event_type:
        return Response(status=400, text="event_type required")
    if not event_type.startswith("wrist_assistant_"):
        return Response(status=400, text="event_type must start with wrist_assistant_")

    event_data = ctx.payload.get("event_data") or {}
    if not isinstance(event_data, dict):
        return Response(status=400, text="event_data must be an object")

    ctx.hass.bus.async_fire(event_type, event_data)
    return ctx.signed_json({"ok": True})


async def _op_remote_command(ctx: _OpContext) -> Response:
    """Server-side hold loop for remote D-pad navigation.

    Body: {entity_id, action: "hold_start"|"hold_stop", command?, hold_secs?}
    """
    entity_id = ctx.payload.get("entity_id")
    action = ctx.payload.get("action")
    if not isinstance(entity_id, str) or not entity_id:
        return Response(status=400, text="entity_id required")
    if action not in ("hold_start", "hold_stop"):
        return Response(status=400, text="action must be hold_start or hold_stop")

    holds = _remote_command_holds(ctx.hass)

    if action == "hold_stop":
        task = holds.pop(entity_id, None)
        if task is not None:
            task.cancel()
        return ctx.signed_json({"ok": True})

    # hold_start
    command = ctx.payload.get("command")
    if not isinstance(command, str) or not command:
        return Response(status=400, text="command required for hold_start")
    raw_hold = ctx.payload.get("hold_secs", 0.2)
    try:
        hold_secs = float(raw_hold)
    except (TypeError, ValueError):
        hold_secs = 0.2
    hold_secs = max(0.05, min(hold_secs, 1.0))

    existing = holds.pop(entity_id, None)
    if existing is not None:
        existing.cancel()

    holds[entity_id] = ctx.hass.async_create_task(
        _remote_command_hold_loop(ctx.hass, entity_id, command, hold_secs, holds)
    )
    return ctx.signed_json({"ok": True})


# Remote-command hold tasks are tracked in hass.data so they survive across
# requests. Keyed by entity_id; cancelled when hold_stop arrives or another
# hold_start preempts.
_REMOTE_HOLDS_KEY = f"{DOMAIN}.v2_remote_holds"
_REMOTE_HOLD_TIMEOUT_SECONDS = 10.0


def _remote_command_holds(hass: HomeAssistant) -> dict[str, asyncio.Task]:
    holds = hass.data.get(_REMOTE_HOLDS_KEY)
    if holds is None:
        holds = {}
        hass.data[_REMOTE_HOLDS_KEY] = holds
    return holds


async def _remote_command_hold_loop(
    hass: HomeAssistant,
    entity_id: str,
    command: str,
    hold_secs: float,
    holds: dict[str, asyncio.Task],
) -> None:
    """Repeat a remote command on a hold cadence until cancelled or timeout."""
    try:
        elapsed = 0.0
        while elapsed < _REMOTE_HOLD_TIMEOUT_SECONDS:
            await hass.services.async_call(
                "remote",
                "send_command",
                {
                    "entity_id": entity_id,
                    "command": command,
                    "hold_secs": hold_secs,
                },
            )
            await asyncio.sleep(hold_secs)
            elapsed += hold_secs
    except asyncio.CancelledError:
        pass
    finally:
        holds.pop(entity_id, None)


async def _op_notifications_register(ctx: _OpContext) -> Response:
    """Register a push device token for this watch."""
    store = ctx.domain_data.notification_store
    if store is None:
        return ctx.signed_json(
            {"ok": False, "error": "notifications unavailable"}, status=503
        )

    device_token = ctx.payload.get("device_token")
    platform = ctx.payload.get("platform", "watchos")
    environment = ctx.payload.get("environment", "production")

    if not isinstance(device_token, str) or not device_token:
        return Response(status=400, text="device_token required")
    if environment not in ("development", "production"):
        environment = "production"

    # The HMAC-validated watch_id is the source of truth.
    store.register(
        ctx.watch_id,
        device_token,
        platform=platform if isinstance(platform, str) else "watchos",
        environment=environment,
    )
    return ctx.signed_json({"ok": True})


async def _op_audio_upload(ctx: _OpContext) -> Response:
    """Receive an audio clip for broadcast.

    The HMAC-signed body is the raw audio bytes — there's no JSON wrapper. The
    server saves the file under /config/www/wrist_assistant/ and returns the
    URL the media player can pull.
    """
    audio = ctx.body
    if len(audio) > MAX_UPLOAD_SIZE:
        return Response(status=413, text="File too large")
    if not audio:
        return Response(status=400, text="Empty body")

    www_dir = Path(ctx.hass.config.path("www", "wrist_assistant"))
    await ctx.hass.async_add_executor_job(www_dir.mkdir, 0o755, True, True)
    # Background cleanup of stale files.
    ctx.hass.async_create_task(_audio_cleanup(ctx.hass, www_dir))

    timestamp = int(time.time() * 1000)
    filename = f"broadcast_{timestamp}.m4a"
    file_path = www_dir / filename
    await ctx.hass.async_add_executor_job(file_path.write_bytes, audio)

    local_url = f"/local/wrist_assistant/{filename}"
    _LOGGER.debug("Audio upload saved: %s (%d bytes)", filename, len(audio))

    return ctx.signed_json(
        {"ok": True, "url": local_url, "filename": filename, "size": len(audio)}
    )


async def _audio_cleanup(hass: HomeAssistant, directory: Path) -> None:
    try:
        now = time.time()
        files = await hass.async_add_executor_job(
            lambda: list(directory.glob("broadcast_*.m4a"))
        )
        for f in files:
            stat = await hass.async_add_executor_job(os.stat, f)
            if now - stat.st_mtime > CLEANUP_AGE_SECONDS:
                await hass.async_add_executor_job(f.unlink, True)
    except Exception:  # noqa: BLE001
        _LOGGER.debug("Audio cleanup error", exc_info=True)


async def _op_camera_batch(ctx: _OpContext) -> Response:
    """Parallel snapshot fetch for multiple cameras (returns base64 in JSON)."""
    cameras = ctx.payload.get("cameras")
    if not isinstance(cameras, list) or not cameras:
        return Response(status=400, text="cameras array required")

    cameras = cameras[:MAX_BATCH_CAMERAS]

    async def _fetch_one(spec: dict) -> dict | None:
        entity_id = spec.get("entity_id")
        if not isinstance(entity_id, str) or not entity_id.startswith("camera."):
            return None
        try:
            width = int(spec.get("width", DEFAULT_WIDTH))
            quality = int(spec.get("quality", DEFAULT_QUALITY))
        except (TypeError, ValueError):
            return {"entity_id": entity_id, "data": None, "size": 0}
        width = max(MIN_WIDTH, min(width, MAX_WIDTH))
        quality = max(MIN_QUALITY, min(quality, MAX_QUALITY))

        viewport = ViewportState()
        if isinstance(spec.get("viewport"), dict):
            vp = spec["viewport"]
            # Accept both width/height (Swift JSON convention) and w/h
            # (dataclass shape) — see _op_snapshot for context.
            try:
                viewport = ViewportState(
                    x=max(0.0, min(1.0, float(vp.get("x", 0.0)))),
                    y=max(0.0, min(1.0, float(vp.get("y", 0.0)))),
                    w=max(0.01, min(1.0, float(vp.get("width", vp.get("w", 1.0))))),
                    h=max(0.01, min(1.0, float(vp.get("height", vp.get("h", 1.0))))),
                )
            except (TypeError, ValueError):
                viewport = ViewportState()

        try:
            image = await async_get_image(ctx.hass, entity_id, timeout=5)
            if image is None or image.content is None:
                return {"entity_id": entity_id, "data": None, "size": 0}
            processed, _, _ = await ctx.hass.async_add_executor_job(
                _process_frame, image.content, viewport, width, quality
            )
            b64 = base64.b64encode(processed).decode("ascii")
            return {"entity_id": entity_id, "data": b64, "size": len(processed)}
        except (HomeAssistantError, Exception):  # noqa: BLE001
            _LOGGER.debug("Batch snapshot failed for %s", entity_id, exc_info=True)
            return {"entity_id": entity_id, "data": None, "size": 0}

    results = await asyncio.gather(*[_fetch_one(spec) for spec in cameras])
    snapshots = [r for r in results if r is not None]
    return ctx.signed_json({"snapshots": snapshots})


async def _op_entity_image(ctx: _OpContext) -> Response:
    """Return the rendered image bytes for an `image.*` entity.

    Used by the watch to render `image.*` controls without a bearer token.
    Body: {"entity_id": "image.X"}

    Falls back to an entity_picture attribute fetch only for relative
    `/local/...` paths — external URLs aren't fetched server-side because
    that would unbounded-amplify watch traffic against arbitrary hosts.
    """
    entity_id = ctx.payload.get("entity_id")
    if not isinstance(entity_id, str) or not entity_id:
        return Response(status=400, text="entity_id required")

    if not entity_id.startswith("image."):
        return Response(status=400, text="entity_id must be image.*")

    try:
        from homeassistant.components.image import async_get_image as _img_get
    except ImportError:
        return Response(status=501, text="image domain not available")

    try:
        image = await _img_get(ctx.hass, entity_id, timeout=10)
    except HomeAssistantError as err:
        _LOGGER.debug("entity_image: %s failed: %s", entity_id, err)
        return Response(status=503, text="Image unavailable")
    if image is None or image.content is None:
        return Response(status=503, text="No image available")

    return ctx.signed_bytes(
        image.content,
        content_type=image.content_type or "image/jpeg",
    )


async def _op_camera_devices(ctx: _OpContext) -> Response:
    """Camera devices grouped by physical device."""
    devices = build_camera_device_groups(ctx.hass)
    return ctx.signed_json({"devices": devices})


# ── camera stream lifecycle ──────────────────────────────────────────────


def _parse_stream_viewport(raw: Any) -> ViewportState:
    """Parse a viewport mapping from JSON. Accepts both `width`/`height`
    (Swift JSON convention) and `w`/`h` (dataclass shape) — see _op_snapshot
    for context.
    """
    if not isinstance(raw, dict):
        return ViewportState()
    try:
        return ViewportState(
            x=max(0.0, min(1.0, float(raw.get("x", 0.0)))),
            y=max(0.0, min(1.0, float(raw.get("y", 0.0)))),
            w=max(0.01, min(1.0, float(raw.get("width", raw.get("w", 1.0))))),
            h=max(0.01, min(1.0, float(raw.get("height", raw.get("h", 1.0))))),
        )
    except (TypeError, ValueError):
        return ViewportState()


def _bound_int(value: Any, default: int, lo: int, hi: int) -> int:
    try:
        v = int(value) if value is not None else default
    except (TypeError, ValueError):
        v = default
    return max(lo, min(hi, v))


def _bound_float(value: Any, default: float, lo: float, hi: float) -> float:
    try:
        v = float(value) if value is not None else default
    except (TypeError, ValueError):
        v = default
    return max(lo, min(hi, v))


async def _op_stream_open(ctx: _OpContext) -> Response:
    """Mint a single-use token bound to a camera stream session.

    Body shape:
        {
          "entity_id": "camera.front",
          "width": 400, "quality": 75, "fps": 2.0,
          "viewport": {"x": ..., "y": ..., "w"|"width": ..., "h"|"height": ...}
        }

    Response carries a relative URL the watch should fetch immediately; the
    URL is good for one connection and expires ~30 s after issue.
    """
    entity_id = ctx.payload.get("entity_id")
    if not isinstance(entity_id, str) or not entity_id.startswith("camera."):
        return Response(status=400, text="entity_id required and must be a camera")

    state = ctx.hass.states.get(entity_id)
    if state is None:
        return Response(status=404, text="Camera entity not found")

    width = _bound_int(ctx.payload.get("width"), DEFAULT_WIDTH, MIN_WIDTH, MAX_WIDTH)
    quality = _bound_int(
        ctx.payload.get("quality"), DEFAULT_QUALITY, MIN_QUALITY, MAX_QUALITY
    )
    fps = _bound_float(ctx.payload.get("fps"), DEFAULT_FPS, MIN_FPS, MAX_FPS)
    viewport = _parse_stream_viewport(ctx.payload.get("viewport"))

    token, expires_at = ctx.domain_data.stream_token_store.mint(
        watch_id=ctx.watch_id,
        entity_id=entity_id,
        width=width,
        quality=quality,
        fps=fps,
        viewport=viewport,
        ttl_seconds=WA_STREAM_TOKEN_TTL_SECONDS,
    )

    return ctx.signed_json(
        {
            "ok": True,
            "token": token,
            "stream_url": f"/api/wrist_assistant/v2/stream/{token}",
            "expires_at": int(expires_at),
            "fps": fps,
        }
    )


async def _op_stream_update(ctx: _OpContext) -> Response:
    """Change params on an active stream session.

    Replaces the legacy bearer-authed `/api/wrist_assistant/camera/viewport`.
    Same coordinator, same `(watch_id, entity_id)` keying — the watch_id is
    taken from the HMAC headers, not the body, so a confused client can't
    update another watch's session.
    """
    coordinator = ctx.domain_data.camera_stream_coordinator

    entity_id = ctx.payload.get("entity_id")
    if not isinstance(entity_id, str) or not entity_id:
        return Response(status=400, text="entity_id required")

    raw_viewport = ctx.payload.get("viewport")
    viewport: ViewportState | None = None
    if raw_viewport is not None:
        viewport = _parse_stream_viewport(raw_viewport)
    elif any(k in ctx.payload for k in ("x", "y", "w", "h")):
        # Back-compat: some callers may flatten the viewport into the body.
        viewport = _parse_stream_viewport(ctx.payload)

    width = (
        _bound_int(ctx.payload.get("width"), DEFAULT_WIDTH, MIN_WIDTH, MAX_WIDTH)
        if "width" in ctx.payload
        else None
    )
    quality = (
        _bound_int(
            ctx.payload.get("quality"), DEFAULT_QUALITY, MIN_QUALITY, MAX_QUALITY
        )
        if "quality" in ctx.payload
        else None
    )
    fps = (
        _bound_float(ctx.payload.get("fps"), DEFAULT_FPS, MIN_FPS, MAX_FPS)
        if "fps" in ctx.payload
        else None
    )

    # quality_level resolves through the camera device groups to produce a
    # source_entity_id override (sd vs hd substream). Empty string from the
    # client means "clear override".
    source_entity_override: object = _UNSET
    quality_level = ctx.payload.get("quality_level")
    if quality_level is not None:
        if quality_level in ("sd", "hd"):
            resolved = coordinator.resolve_quality_level(
                ctx.hass, entity_id, quality_level
            )
            if resolved:
                source_entity_override = resolved if resolved != entity_id else None
            else:
                source_entity_override = None
        else:
            return Response(
                status=400, text="quality_level must be 'sd' or 'hd'"
            )

    updated = coordinator.update_session(
        ctx.watch_id,
        entity_id,
        viewport=viewport,
        width=width,
        source_entity_id=source_entity_override,
        quality=quality,
        fps=fps,
    )
    if not updated:
        return ctx.signed_json(
            {"ok": False, "error": "no_active_stream"}, status=404
        )

    session = coordinator._sessions.get((ctx.watch_id, entity_id))
    body: dict[str, Any] = {"ok": True}
    if session is not None and session.source_width > 0:
        body["source_width"] = session.source_width
        body["source_height"] = session.source_height
    return ctx.signed_json(body)


async def _op_stream_close(ctx: _OpContext) -> Response:
    """Release a pending or unused stream token.

    Once the watch has connected to /v2/stream/<token>, the token is already
    consumed and `release` is a no-op — disconnecting the HTTP stream itself
    is what tears down the session via the coordinator's finally block.

    Body: `{"token": "..."}` (preferred) or `{"entity_id": "..."}` for forward
    compat with future cancellation flows.
    """
    token = ctx.payload.get("token")
    released = False
    if isinstance(token, str) and token:
        released = ctx.domain_data.stream_token_store.release(token)
    return ctx.signed_json({"ok": True, "released": released})


async def _op_verify_identity(ctx: _OpContext) -> Response:
    """Mutual-HMAC identity probe used by the iOS app before sending a bearer.

    The iOS app calls this against the local URL it's about to send a bearer
    to. Because the request must HMAC-verify against a key registered with
    this HA instance, AND the response is signed with the same key, a wrong
    server at the same private IP (e.g. on a coffee-shop LAN with subnet
    collision) cannot produce a valid response. The signature is the identity
    proof — the body carries no other secret.
    """
    return ctx.signed_json({"ok": True, "ts": int(time.time())})


# ── /v2/stream/{token} view ──────────────────────────────────────────────


class WAStreamView(HomeAssistantView):
    """MJPEG stream endpoint authenticated by a single-use token.

    The token is minted by `op=stream_open` on /v2/action and is the only
    credential required here — HMAC headers don't apply to a chunked
    multipart response. A leaked token is bounded by:

    * single-use: once claimed, future GETs of the same token return 404;
    * short TTL (~30 s): tokens not claimed in time are evicted;
    * binding: the token's parameters are fixed at mint time, so there's
      no "switch entity_id mid-stream" attack.

    The frame loop body is `run_mjpeg_stream` from `camera_stream.py`.
    """

    url = "/api/wrist_assistant/v2/stream/{token}"
    name = "api:wrist_assistant_v2_stream"
    requires_auth = False

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def get(self, request: Request, token: str) -> StreamResponse:
        domain_data: WristAssistantData | None = self._hass.data.get(DOMAIN)
        if domain_data is None:
            return Response(text="Integration not loaded", status=503)

        entry = domain_data.stream_token_store.claim(token)
        if entry is None:
            # Treat all rejection reasons identically to avoid leaking which
            # check failed (already consumed vs expired vs unknown).
            _LOGGER.debug("Rejected /v2/stream token (missing/expired/consumed)")
            return Response(text="Not Found", status=404)

        coordinator = domain_data.camera_stream_coordinator

        # Validate the entity still exists. A token minted against an entity
        # that has since gone away should fail clearly rather than streaming
        # frames from a non-existent camera.
        state = self._hass.states.get(entry.entity_id)
        if state is None or not entry.entity_id.startswith("camera."):
            return Response(text="Camera entity not available", status=404)

        coordinator.get_or_create_session(
            entry.watch_id,
            entry.entity_id,
            entry.width,
            entry.quality,
            entry.fps,
            entry.viewport,
        )

        return await run_mjpeg_stream(
            self._hass,
            request,
            coordinator,
            entry.watch_id,
            entry.entity_id,
        )


# ── /v2/register_secret view ─────────────────────────────────────────────


class WARegisterSecretView(HomeAssistantView):
    """Bearer-authenticated endpoint where the iOS app registers a per-watch
    HMAC secret with HA. Called once per (watch_id, baseURL) on iOS-side
    integration check. The watch never calls this — iOS owns provisioning
    so the watch process never needs the bearer.
    """

    url = "/api/wrist_assistant/v2/register_secret"
    name = "api:wrist_assistant_v2_register_secret"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def post(self, request: Request) -> Response:
        domain_data: WristAssistantData | None = self._hass.data.get(DOMAIN)
        if domain_data is None:
            return self.json_message("Integration not loaded", status_code=503)

        try:
            payload = await request.json()
        except (ValueError, UnicodeDecodeError):
            return self.json_message("Invalid JSON body", status_code=400)
        if not isinstance(payload, dict):
            return self.json_message("Expected JSON object body", status_code=400)

        watch_id = payload.get("watch_id")
        secret_b64 = payload.get("secret_b64")
        label = payload.get("label")
        # Optional. Older iOS builds don't send this; default to the v1 algo
        # so they keep working unchanged. Future builds opt into a new algo
        # by sending it here.
        algo = payload.get("algo", DEFAULT_HMAC_ALGO)
        # Diagnostic-only metadata for the per-device sensors. Older app builds
        # omit these — store None and the sensors render "unknown" until the
        # next provision call from an updated app.
        raw_app_version = payload.get("app_version")
        raw_app_build = payload.get("app_build")
        raw_owner_iphone_id = payload.get("owner_iphone_id")
        app_version = (
            raw_app_version
            if isinstance(raw_app_version, str) and raw_app_version
            else None
        )
        app_build = (
            raw_app_build
            if isinstance(raw_app_build, str) and raw_app_build
            else None
        )
        # `owner_iphone_id` links a watch entry to its paired iPhone entry so
        # HA's device tree shows the watches under their iPhone. Watches paired
        # by an older iOS build omit it — those watches root under the global
        # service device instead. iPhones never set this field on themselves.
        owner_iphone_id = (
            raw_owner_iphone_id
            if isinstance(raw_owner_iphone_id, str) and raw_owner_iphone_id
            else None
        )

        if not isinstance(watch_id, str) or not watch_id:
            return self.json_message("watch_id required", status_code=400)
        if not isinstance(secret_b64, str) or not secret_b64:
            return self.json_message("secret_b64 required", status_code=400)
        if not isinstance(algo, str) or algo not in SUPPORTED_HMAC_ALGOS:
            return self.json_message(
                f"algo must be one of: {sorted(SUPPORTED_HMAC_ALGOS)}",
                status_code=400,
            )

        try:
            secret_bytes = base64.b64decode(secret_b64, validate=True)
        except (ValueError, TypeError):
            return self.json_message("secret_b64 is not valid base64", status_code=400)
        # Per-algo key-length check. Only sha256 is wired today; when adding a
        # new algo to `SUPPORTED_HMAC_ALGOS`, add its expected key length here
        # too — silently accepting the wrong size would let a typo turn into a
        # very weak HMAC.
        if algo == "hmac-sha256" and len(secret_bytes) != 32:
            return self.json_message(
                "secret must be 32 bytes (256 bits) for hmac-sha256",
                status_code=400,
            )

        is_new = domain_data.widget_secret_store.register(
            watch_id=watch_id,
            secret_b64=secret_b64,
            label=label if isinstance(label, str) else None,
            algo=algo,
            app_version=app_version,
            app_build=app_build,
            owner_iphone_id=owner_iphone_id,
        )
        if is_new:
            log_secret_registered(
                self._hass,
                watch_id=watch_id,
                label=label if isinstance(label, str) else None,
                app_version=app_version,
            )
        return self.json(
            {
                "ok": True,
                "protocol_version": WA_PROTOCOL_VERSION,
                "algo": algo,
            }
        )


# ── version view ─────────────────────────────────────────────────────────


class WAVersionView(HomeAssistantView):
    """Unauthenticated metadata endpoint for the symmetric version handshake.

    The iOS app polls this on launch and on a slow timer. The response carries
    both directions of the version contract:

    * `integration_version` / `wa_protocol_version` — what we are.
    * `min_supported_app_protocol_version` — the oldest app proto we'll talk
      to. Apps below it should surface an "update Wrist Assistant" banner.
    * `app_update_message` — optional override copy for that banner.

    Unauthenticated because the bearer may not be configured yet when iOS first
    checks, and the response carries no secrets.

    **Path stability contract.** This URL lives at `/api/wrist_assistant/version`
    on purpose — outside any `/vN/` segment — so apps too old to talk to the
    current `/vN/*` endpoints can still probe it to learn they need updating.
    Future protocol breaks must keep this path responding even after retiring
    every other endpoint. Don't rename it. Don't move it under `/v3/` etc.
    """

    url = "/api/wrist_assistant/version"
    name = "api:wrist_assistant_version"
    requires_auth = False

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def get(self, request: Request) -> Response:
        # Pull the version off the loaded integration object instead of a
        # hand-synced const. Keeps the user-facing version string in lockstep
        # with manifest.json — the iOS "Update integration" banner copy quotes
        # this verbatim ("you're on v{X}"), so drift used to surface as the
        # banner naming a different release than HACS reports installed.
        # The endpoint is unauthenticated and polled by iOS on launch; if the
        # loader can't resolve us (rapid reload, test fixture without a
        # populated component cache), fall back rather than 500ing the banner.
        try:
            integration = await loader.async_get_integration(self._hass, DOMAIN)
            integration_version = str(integration.version)
        except Exception:  # noqa: BLE001
            integration_version = "unknown"
        return self.json(
            {
                "integration_version": integration_version,
                "wa_protocol_version": WA_PROTOCOL_VERSION,
                "min_supported_app_protocol_version": MIN_SUPPORTED_APP_PROTOCOL_VERSION,
                "app_update_message": APP_UPDATE_MESSAGE,
            }
        )


# Op dispatch table. Adding a new op = add a key here.
_OP_HANDLERS: dict[str, Any] = {
    "service": _op_service,
    "state": _op_state,
    "history": _op_history,
    "states_batch": _op_states_batch,
    "info": _op_info,
    "snapshot": _op_snapshot,
    "template": _op_template,
    "services_list": _op_services_list,
    "config_entries_list": _op_config_entries_list,
    "mass_players": _op_mass_players,
    "mass_queue": _op_mass_queue,
    "mass_play_queue_item": _op_mass_play_queue_item,
    "remote_command": _op_remote_command,
    "fire_event": _op_fire_event,
    "notifications_register": _op_notifications_register,
    "audio_upload": _op_audio_upload,
    "camera_batch": _op_camera_batch,
    "camera_devices": _op_camera_devices,
    "entity_image": _op_entity_image,
    "stream_open": _op_stream_open,
    "stream_update": _op_stream_update,
    "stream_close": _op_stream_close,
    "verify_identity": _op_verify_identity,
}
