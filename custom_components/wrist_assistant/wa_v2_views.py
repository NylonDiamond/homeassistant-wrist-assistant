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
  no need for a separate op per HA service. `op=bundle` answers a whole watch
  face's text sources at once (template, states, history, statistics, lists)
  so a face-wide refresh is one signed request rather than one per source per
  complication; the readers behind it live in `bundle_ops`.

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
import time
import uuid
from dataclasses import dataclass
from typing import Any

import orjson
import voluptuous as vol
from aiohttp.web import Request, Response, StreamResponse
from homeassistant import loader
from homeassistant.components.camera import async_get_image
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import Context, HomeAssistant, ServiceResponse
from homeassistant.exceptions import HomeAssistantError, ServiceNotFound
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import instance_id as ha_instance_id

from .audio_upload import MAX_UPLOAD_SIZE, async_cleanup_clips, async_save_clip
from .bundle_ops import (
    BundleRequestError,
    OpError,
    async_history_result,
    async_list_result,
    async_run_bundle,
    async_state_result,
    async_statistics_result,
    async_template_result,
    normalize_bundle_request,
)
from .camera_devices import build_camera_device_groups, resolve_stream_sibling
from .camera_stream import (
    DEFAULT_FPS,
    DEFAULT_QUALITY,
    DEFAULT_WIDTH,
    MAX_BATCH_CAMERAS,
    MAX_BATCH_SNAPSHOT_CAMERAS,
    MAX_FPS,
    MAX_QUALITY,
    MAX_WIDTH,
    MIN_FPS,
    MIN_QUALITY,
    MIN_WIDTH,
    NOTIF_SNAPSHOT_MAX_BYTES,
    NOTIF_SNAPSHOT_MAX_HEIGHT,
    NOTIF_SNAPSHOT_MAX_WIDTH,
    SNAPSHOT_DEFAULT_QUALITY,
    SNAPSHOT_MAX_BYTES,
    SNAPSHOT_MAX_HEIGHT,
    SNAPSHOT_MAX_WIDTH,
    ViewportState,
    _process_frame,
    _process_snapshot,
    _UNSET,
    batch_snapshot_box,
    capture_notification_snapshot,
    jpeg_aspect,
    run_batch_snapshot_stream,
    run_mjpeg_stream,
)
from .complication_store import (
    ComplicationConflictError,
    ComplicationStoreError,
    ComplicationValidationError,
    shapes_of,
    validate_document,
)
from .const import (
    APP_UPDATE_MESSAGE,
    COMPLICATION_MAX_PER_OWNER,
    COMPLICATION_MAX_SCHEMA_VERSION,
    DOMAIN,
    LIBRARY_OWNER_ID,
    MIN_SUPPORTED_APP_PROTOCOL_VERSION,
    WA_PROTOCOL_VERSION,
    WA_STREAM_TOKEN_TTL_SECONDS,
    WristAssistantData,
)
from .logbook_events import (
    log_hmac_failure,
    log_push_token_registered,
    log_secret_registered,
    log_secret_reprovisioned,
)
from .webhook_relay import (
    WEBHOOK_ID_METADATA_KEY,
    async_provision_webhook,
    async_sync_webhook_devices,
)
from .widget_hmac import (
    DEFAULT_HMAC_ALGO,
    SUPPORTED_HMAC_ALGOS,
    WAHMACError,
    WANonceCache,
    sign_response,
    validate_wa_request,
)

_LOGGER = logging.getLogger(__name__)


def _prebind_relay_token(
    hass: HomeAssistant, domain_data: WristAssistantData, watch_id: str, platform: str
) -> None:
    """Mint the relay_token for a just-registered device in the background.

    Without this the FIRST push after registration pays an extra relay round
    trip (``/v1/register``) before ``/v1/push/send``, because ``send_push`` only
    binds lazily. Doing it now, off the request path, means the first alert
    goes out in one RTT. Best effort: a relay outage here is logged by the
    client and ``send_push`` simply falls back to binding lazily.
    """
    client = domain_data.apns_client
    if client is None:
        return

    async def _run() -> None:
        try:
            await client.ensure_relay_token(watch_id, platform)
        except Exception:  # noqa: BLE001 — background best-effort
            _LOGGER.debug("relay token prebind failed for %s/%s", watch_id, platform)

    hass.async_create_task(
        _run(), name=f"wrist_assistant_relay_prebind_{watch_id}_{platform}"
    )


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
    user_id: str | None = None
    """The Home Assistant user the device's secret is bound to (see
    `WidgetSecretEntry.user_id`). None for an entry that predates binding."""

    def new_context(self) -> Context:
        """A `Context` for anything this request does to Home Assistant.

        Carries the bound user so service calls and events run with that
        user's rights and are attributed to them, exactly as the mobile_app
        webhook does. With no bound user this is a plain anonymous context,
        which is what Home Assistant would have made on its own.
        """
        return Context(user_id=self.user_id)

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


async def _async_bound_user_ok(hass: HomeAssistant, user_id: str | None) -> bool:
    """Whether the user a secret is bound to may still act.

    A secret outlives Home Assistant's own tokens, so this is where a
    disabled or deleted user loses the devices they paired: the HMAC still
    verifies, but the request is refused. An unbound entry (paired before
    user binding, not yet re-provisioned) passes; there is no user to check.
    The lookup is an in-memory dictionary read, not I/O.
    """
    if user_id is None:
        return True
    user = await hass.auth.async_get_user(user_id)
    return user is not None and user.is_active


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
        if not await _async_bound_user_ok(self._hass, secret_entry.user_id):
            _LOGGER.debug(
                "WA request refused (v2/action): bound user of %s is disabled or gone",
                validated.watch_id,
            )
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
            user_id=secret_entry.user_id,
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
        if not await _async_bound_user_ok(self._hass, secret_entry.user_id):
            _LOGGER.debug(
                "WA request refused (v2/delta): bound user of %s is disabled or gone",
                validated.watch_id,
            )
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
        # 0 is a probe ("answer now", see DeltaCoordinator.handle_poll) and
        # passes through untouched; anything else is clamped to the long-poll
        # window as before.
        if timeout != 0:
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

        # The custom-complication store token the watch last applied. Its
        # ack for the panel's "Send to watch", and what the coordinator
        # compares against to hand out the current token. Absent from apps
        # that predate it; junk reads as absent.
        raw_complications_token = payload.get("complications_token")
        complications_token: int | None = None
        if (
            isinstance(raw_complications_token, int)
            and not isinstance(raw_complications_token, bool)
            and raw_complications_token >= 0
        ):
            complications_token = raw_complications_token

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
            token_result = notification_store.register(
                watch_id, device_token, platform="watchos", environment=apns_env
            )
            if token_result == "new":
                log_push_token_registered(self._hass, watch_id=watch_id, is_new=True)
            elif token_result == "updated":
                log_push_token_registered(self._hass, watch_id=watch_id, is_new=False)
            if token_result in ("new", "updated"):
                _prebind_relay_token(self._hass, domain_data, watch_id, "watchos")

        # The watch reports its per-user notification delivery mode here so
        # send_notification can route mirror (iPhone) vs direct (watch). Stored
        # per watch_id; unknown/absent values leave the default ("mirror").
        if notification_store is not None:
            delivery_mode = payload.get("delivery_mode")
            if isinstance(delivery_mode, str) and delivery_mode in ("mirror", "direct"):
                notification_store.set_watch_metadata(
                    watch_id, "delivery_mode", delivery_mode
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
            complications_token=complications_token,
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

    # The call runs as the user who paired the device. That is what makes
    # Home Assistant apply its admin-only check (`async_register_admin_service`
    # only checks when the context names a user) and what puts the person's
    # name in the logbook. No allow-list here: Home Assistant's own rules for
    # that user are the rules.
    context = ctx.new_context()
    try:
        if return_response:
            response_data: ServiceResponse = await ctx.hass.services.async_call(
                domain,
                service,
                service_data,
                blocking=True,
                return_response=True,
                context=context,
            )
            return ctx.signed_json({"ok": True, "response": response_data})
        else:
            await ctx.hass.services.async_call(
                domain, service, service_data, blocking=False, context=context
            )
            return ctx.signed_json({"ok": True})
    except ServiceNotFound as err:
        return ctx.signed_json(
            {"ok": False, "error": f"Service not found: {err}"}, status=404
        )
    except vol.Invalid as err:
        # Bad service_data (e.g. an unexpected key from an older watch app
        # version). Voluptuous validation errors aren't HomeAssistantError, so
        # without this they bubble up as an unhandled 500. Return a clean 400.
        _LOGGER.warning(
            "Invalid data for service %s.%s: %s", domain, service, err
        )
        return ctx.signed_json(
            {"ok": False, "error": f"Invalid service data: {err}"}, status=400
        )
    except HomeAssistantError as err:
        _LOGGER.warning(
            "Service %s.%s failed: %s", domain, service, err
        )
        return ctx.signed_json({"ok": False, "error": str(err)}, status=502)


def _op_failed(ctx: _OpContext, err: OpError) -> Response:
    """Answer a core reader's failure the way the single op always has.

    A core reader in `bundle_ops` raises rather than building a Response, so
    the bundle can put the message in `errors` instead. `OpError` carries the
    status and, when the single op signed a JSON body for that failure, the
    body itself; a plain-text refusal carries none.
    """
    if err.body is None:
        return Response(status=err.status, text=str(err))
    return ctx.signed_json(err.body, status=err.status)


async def _op_state(ctx: _OpContext) -> Response:
    """Single-entity state read. Shape: `bundle_ops.async_state_result`."""
    try:
        result = await async_state_result(ctx.hass, ctx.payload)
    except OpError as err:
        return _op_failed(ctx, err)
    return ctx.signed_json(result)


async def _op_history(ctx: _OpContext) -> Response:
    """Single-entity state-change history for the watch's chart view.

    Payload and reply shapes: `bundle_ops.async_history_result`.
    """
    try:
        result = await async_history_result(ctx.hass, ctx.payload)
    except OpError as err:
        return _op_failed(ctx, err)
    return ctx.signed_json(result)


async def _op_statistics(ctx: _OpContext) -> Response:
    """Long-term statistics for a complication chart, as one series string.

    Payload and reply shapes: `bundle_ops.async_statistics_result`.
    """
    try:
        result = await async_statistics_result(ctx.hass, ctx.payload)
    except OpError as err:
        return _op_failed(ctx, err)
    return ctx.signed_json(result)


async def _op_list(ctx: _OpContext) -> Response:
    """Calendar, to-do or forecast rows for a complication's list layer.

    Payload and reply shapes: `bundle_ops.async_list_result`.
    """
    try:
        result = await async_list_result(ctx.hass, ctx.payload)
    except OpError as err:
        return _op_failed(ctx, err)
    return ctx.signed_json(result)


async def _op_bundle(ctx: _OpContext) -> Response:
    """Every text source on one watch face, in a single signed round trip.

    A face-wide refresh asks each complication's sources at once instead of
    one signed request per source per complication. Body:

        {
          "template":   "<jinja source>"?,
          "states":     ["<entity_id>", ...]?,
          "history":    [{"key": "<opaque>", ...history payload...}, ...]?,
          "statistics": [{"key": "<opaque>", ...statistics payload...}, ...]?,
          "lists":      [{"key": "<opaque>", ...list payload...}, ...]?
        }

    Every item's payload is exactly what its single op takes, and every
    answer is exactly what its single op returns, because both call the same
    reader in `bundle_ops`. The keys are the caller's own and come back
    untouched. Reply shape and the `errors` map: `async_run_bundle`.

    A malformed request (a section that is not an array, an item with no key,
    a repeated key, more items than the caps allow) is a 400 and nothing
    runs. A single item that fails is not: it lands in `errors` and the rest
    of the face still draws.
    """
    try:
        asked = normalize_bundle_request(ctx.payload)
    except BundleRequestError as err:
        return Response(status=400, text=str(err))

    return ctx.signed_json(await async_run_bundle(ctx.hass, asked))


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

    # `hd` opts into the larger notification-snapshot budget (1024px / 250KB)
    # instead of the complication-optimized 400px tier. Used by the framing
    # editor's preview, where a crisp full-frame still matters and the payload
    # is fetched once. Absent/false keeps the small, complication-sized tier.
    hd = bool(ctx.payload.get("hd"))
    max_w = NOTIF_SNAPSHOT_MAX_WIDTH if hd else SNAPSHOT_MAX_WIDTH
    max_h = NOTIF_SNAPSHOT_MAX_HEIGHT if hd else SNAPSHOT_MAX_HEIGHT
    max_bytes = NOTIF_SNAPSHOT_MAX_BYTES if hd else SNAPSHOT_MAX_BYTES

    width = _bound(ctx.payload.get("width"), max_w, MIN_WIDTH, max_w)
    max_height = _bound(ctx.payload.get("max_height"), max_h, MIN_WIDTH, max_h)
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
        max_bytes,
    )
    if processed is None:
        return Response(status=503, text="Image exceeds size budget")

    # Warm the persisted aspect from this fetch so the *first* notification for
    # this camera can reserve the image's footprint (no black bars) — the iOS
    # framing page fetches a snapshot per camera on entry, which is usually long
    # before any push fires. Only when this fetch's viewport equals the saved
    # crop: the framing list always sends the saved crop (so its shape matches
    # the notification's), but the framing *editor* previews arbitrary in-progress
    # crops — caching those would reserve the wrong shape. Square bounding box on
    # both paths means the aspect here equals the notification's regardless of the
    # 220px-vs-1024px size difference. Per-entity only (variants differ in aspect).
    if ctx.domain_data.snapshot_crop_store.matches_saved(entity_id, viewport):
        aspect = await ctx.hass.async_add_executor_job(jpeg_aspect, processed)
        if aspect:
            ctx.domain_data.snapshot_aspect_store.set(entity_id, aspect)

    return ctx.signed_bytes(
        processed,
        content_type="image/jpeg",
        extra_headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
        },
    )


def _camera_ids_from_payload(payload: dict[str, Any]) -> list[str]:
    """Collect camera entity_ids from `entity_ids` (list) or `entity_id` (single).

    The iOS picker frames one physical camera but stores the crop against *all*
    of that device's camera entities (Clear/Fluent/Snapshots variants share a
    lens, and the notification may use a different variant than the one shown in
    the picker), so set/status accept a list.
    """
    raw = payload.get("entity_ids")
    if isinstance(raw, list):
        ids = [e for e in raw if isinstance(e, str) and e.startswith("camera.")]
    else:
        single = payload.get("entity_id")
        ids = [single] if isinstance(single, str) and single.startswith("camera.") else []
    # De-dupe while preserving order.
    return list(dict.fromkeys(ids))


async def _op_set_snapshot_crop(ctx: _OpContext) -> Response:
    """Save the user's notification framing for a camera's entities.

    Body: {"entity_ids": ["camera.x", ...] | "entity_id": "camera.x",
           "viewport": {x, y, w|width, h|height},
           "open_zoomed": true | false (optional)}.
    A full-frame viewport clears any saved crop (reset to full frame). The crop
    is written to every supplied entity_id so any variant the notification uses
    gets the same framing.

    `open_zoomed` (optional) sets whether the watch opens this camera's in-app
    live view pre-zoomed to the saved crop. Omitted by older app builds, so it
    leaves the existing flag untouched; the store ignores a True flag when the
    viewport is full-frame (nothing to zoom into).
    """
    entity_ids = _camera_ids_from_payload(ctx.payload)
    if not entity_ids:
        return Response(status=400, text="entity_id(s) required and must be cameras")

    viewport = _parse_stream_viewport(ctx.payload.get("viewport"))
    raw_open_zoomed = ctx.payload.get("open_zoomed")
    open_zoomed = bool(raw_open_zoomed) if isinstance(raw_open_zoomed, bool) else None
    store = ctx.domain_data.snapshot_crop_store
    aspect_store = ctx.domain_data.snapshot_aspect_store
    for entity_id in entity_ids:
        store.set(entity_id, viewport)
        # Only touch the open-zoomed flag when the client explicitly sent one
        # (older apps don't). set() ran first, so the crop exists for the
        # store's "True only with a crop" guard.
        if open_zoomed is not None:
            store.set_open_zoomed(entity_id, open_zoomed)
        # Re-framing changes the snapshot's aspect — drop the stored value so the
        # next push recomputes it instead of reserving the old footprint.
        aspect_store.delete(entity_id)
    return ctx.signed_json({"ok": True, "count": len(entity_ids)})


async def _op_get_snapshot_crop(ctx: _OpContext) -> Response:
    """Return the saved framing for a camera, or null when full-frame.

    Body: {"entity_id": "camera.x"}.
    Response: {"viewport": {x, y, w, h} | null, "open_zoomed": bool}.
    """
    entity_id = ctx.payload.get("entity_id")
    if not isinstance(entity_id, str) or not entity_id.startswith("camera."):
        return Response(status=400, text="entity_id required and must be a camera")

    store = ctx.domain_data.snapshot_crop_store
    crop = store.get(entity_id)
    viewport = (
        {"x": crop.x, "y": crop.y, "w": crop.w, "h": crop.h}
        if crop is not None
        else None
    )
    return ctx.signed_json(
        {"viewport": viewport, "open_zoomed": store.get_open_zoomed(entity_id)}
    )


async def _op_snapshot_crops_status(ctx: _OpContext) -> Response:
    """Report which of the supplied cameras have a saved framing.

    Body: {"entity_ids": ["camera.x", ...]}.
    Response: {"framed": ["camera.x", ...]} — the subset with a non-full-frame
    crop. Lets the iOS list show a marker without one request per camera.
    """
    raw = ctx.payload.get("entity_ids")
    ids = [e for e in raw if isinstance(e, str)] if isinstance(raw, list) else []
    store = ctx.domain_data.snapshot_crop_store
    framed = [eid for eid in ids if store.get(eid) is not None]
    return ctx.signed_json({"framed": framed})


async def _op_get_snapshot_concurrency(ctx: _OpContext) -> Response:
    """Return the installation's batch-snapshot parallel-grab concurrency.

    Response: {"concurrency": int} where 0 = unlimited. Lets the iOS Camera
    Settings show the current throttle.
    """
    store = ctx.domain_data.batch_snapshot_settings_store
    return ctx.signed_json({"concurrency": store.concurrency})


async def _op_set_snapshot_concurrency(ctx: _OpContext) -> Response:
    """Set how many cameras the batch-snapshot stream grabs in parallel.

    Body: {"concurrency": int} where 0 = unlimited (clamped to a sane ceiling).
    Installation-wide — a property of the camera source/NVR — so it applies to
    every paired device's batch streams, not just this one. Returns the stored
    (clamped) value so the client reflects exactly what took effect.
    """
    store = ctx.domain_data.batch_snapshot_settings_store
    value = store.set_concurrency(ctx.payload.get("concurrency"))
    return ctx.signed_json({"ok": True, "concurrency": value})


async def _op_set_stream_entity(ctx: _OpContext) -> Response:
    """Save (or clear) the live-stream override for a camera's entities.

    Body: {"entity_ids": ["camera.x", ...] | "entity_id": "camera.x",
           "stream_entity": "camera.y" | null}.
    A null/empty `stream_entity` clears the override (revert to auto-resolution).
    Written to every supplied entity_id so whichever variant a notification uses
    resolves to the same chosen stream.
    """
    entity_ids = _camera_ids_from_payload(ctx.payload)
    if not entity_ids:
        return Response(status=400, text="entity_id(s) required and must be cameras")

    raw = ctx.payload.get("stream_entity")
    stream_entity = raw if isinstance(raw, str) and raw.startswith("camera.") else None
    store = ctx.domain_data.snapshot_stream_store
    for entity_id in entity_ids:
        if stream_entity:
            store.set(entity_id, stream_entity)
        else:
            store.delete(entity_id)
    return ctx.signed_json({"ok": True, "count": len(entity_ids)})


async def _op_get_stream_entity(ctx: _OpContext) -> Response:
    """Return the live-stream entity a camera opens to, plus the auto-detected one.

    Body: {"entity_id": "camera.x"}.
    Response: {"override": "camera.y"|null, "auto": "camera.z"|null} — `override`
    is the user's saved choice (null = using auto); `auto` is what the device
    grouping resolves, so the iOS picker can label "Auto (detected)".
    """
    entity_id = ctx.payload.get("entity_id")
    if not isinstance(entity_id, str) or not entity_id.startswith("camera."):
        return Response(status=400, text="entity_id required and must be a camera")

    override = ctx.domain_data.snapshot_stream_store.get(entity_id)
    auto = resolve_stream_sibling(ctx.hass, entity_id)
    return ctx.signed_json({"override": override, "auto": auto})


async def _op_template(ctx: _OpContext) -> Response:
    """Render a Jinja template. Body: {template, variables?}.

    Payload and reply shapes: `bundle_ops.async_template_result`. The single
    op answers the native render; `op=bundle` flattens it to text first,
    because a bundled face wants one string per complication rather than five
    JSON types.
    """
    try:
        result = await async_template_result(ctx.hass, ctx.payload)
    except OpError as err:
        return _op_failed(ctx, err)
    return ctx.signed_json(result)


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

    ctx.hass.bus.async_fire(event_type, event_data, context=ctx.new_context())
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
        _remote_command_hold_loop(
            ctx.hass, entity_id, command, hold_secs, holds, ctx.new_context()
        )
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
    context: Context,
) -> None:
    """Repeat a remote command on a hold cadence until cancelled or timeout.

    Every repeat carries the context of the request that started the hold,
    so the whole hold is one user's action.
    """
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
                context=context,
            )
            await asyncio.sleep(hold_secs)
            elapsed += hold_secs
    except asyncio.CancelledError:
        pass
    finally:
        holds.pop(entity_id, None)


def _resolve_companion_target(
    ctx: _OpContext,
) -> tuple[str | None, Response | None]:
    """Resolve the watch_id an op should act on, honoring an optional
    ``companion_watch_id`` while enforcing that the caller owns it.

    An iPhone signs with its own identity (``ctx.watch_id``) but acts on its
    paired watch's entry via ``companion_watch_id`` — the push token / webhook
    live there. Without an ownership check, any authenticated device on a shared
    HA instance (multi-user, or a household with several paired watches) could
    name *another* user's watch and read or mutate its entry.

    Ownership is checked two ways, and both must pass:

    * the watch entry's recorded ``owner_iphone_id`` (set at pairing via
      register_secret / update_metadata) must equal the caller;
    * the watch entry's bound Home Assistant user must equal the caller's.
      ``owner_iphone_id`` is a value the registering client asserts about
      itself, so on its own it protects nothing against a client that
      registers a matching id; the user binding is what the server knows.

    Entries with no recorded owner or user — paired before either was
    tracked — are allowed through for backward compatibility; a properly
    paired watch is always protected.

    Returns ``(target_watch_id, None)`` on success, or ``(None, response)`` with
    a 403 when the caller names a companion it does not own.
    """
    companion = ctx.payload.get("companion_watch_id")
    if not (isinstance(companion, str) and companion):
        return ctx.watch_id, None
    if companion == ctx.watch_id:
        return companion, None
    store = ctx.domain_data.widget_secret_store
    entry = store.get(companion) if store is not None else None
    owner = entry.owner_iphone_id if entry is not None else None
    bound_user = entry.user_id if entry is not None else None
    if (owner is not None and owner != ctx.watch_id) or (
        bound_user is not None
        and ctx.user_id is not None
        and bound_user != ctx.user_id
    ):
        _LOGGER.warning(
            "Rejected cross-watch op=%s: caller %s is not owner of companion %s",
            ctx.op,
            ctx.watch_id,
            companion,
        )
        return None, Response(status=403, text="not authorized for companion watch")
    return companion, None


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
    platform = platform if isinstance(platform, str) and platform else "watchos"

    # By default the HMAC-validated identity is the storage key. The companion
    # iPhone signs with its own identity but its token must live on the paired
    # watch's entry (so send_notification, which targets a watch, can mirror via
    # it). A companion redirect is only honored for an iOS token whose target
    # watch the caller actually owns (owner_iphone_id == caller); otherwise any
    # authenticated device on a shared HA instance could plant its token on
    # another user's watch. See _resolve_companion_target.
    target_watch_id = ctx.watch_id
    if platform == "ios":
        target_watch_id, denied = _resolve_companion_target(ctx)
        if denied is not None:
            return denied

    token_result = store.register(
        target_watch_id,
        device_token,
        platform=platform,
        environment=environment,
    )
    if token_result == "new":
        log_push_token_registered(ctx.hass, watch_id=target_watch_id, is_new=True)
    elif token_result == "updated":
        log_push_token_registered(ctx.hass, watch_id=target_watch_id, is_new=False)
    if token_result in ("new", "updated"):
        _prebind_relay_token(ctx.hass, ctx.domain_data, target_watch_id, platform)
    # A changed device token stales the webhook's device mapping at the relay
    # (it would keep pushing to the pre-reinstall token). Re-bind in the
    # background; no-op when the watch has no provisioned webhook, and
    # "idempotent" registrations skip the round-trip entirely.
    if token_result in ("new", "updated") and store.get_watch_metadata(
        target_watch_id, WEBHOOK_ID_METADATA_KEY
    ):
        ctx.hass.async_create_task(
            async_sync_webhook_devices(ctx.domain_data, target_watch_id),
            name=f"wrist_assistant_webhook_device_sync_{target_watch_id}",
        )
    # Echo the platforms now on the entry so the caller can self-confirm the
    # token actually landed — the iPhone app uses this to verify the mirror
    # (ios) path is wired before showing its Notifications row green.
    return ctx.signed_json(
        {"ok": True, "platforms": sorted(store.get_entries(target_watch_id))}
    )


async def _op_notifications_status(ctx: _OpContext) -> Response:
    """Report which push platforms are registered for a watch.

    Lets the iPhone app verify the mirror (``ios``) token actually landed in HA
    before claiming notifications are fully set up — selecting "Fast" is moot if
    HA has no iOS token to mirror through and would fall back to the slow
    watch-direct path. Resolves the target watch the same way
    ``notifications_register`` does: an iPhone caller signs with its own identity
    but reads the paired watch's entry via ``companion_watch_id``. Returns only
    platform *names* (never tokens), and all identities here are the user's own
    devices, so this is strictly less sensitive than the existing register write.
    """
    store = ctx.domain_data.notification_store
    if store is None:
        return ctx.signed_json(
            {"ok": False, "error": "notifications unavailable"}, status=503
        )

    target_watch_id, denied = _resolve_companion_target(ctx)
    if denied is not None:
        return denied

    entries = store.get_entries(target_watch_id)
    return ctx.signed_json(
        {
            "ok": True,
            "platforms": sorted(entries),
            "delivery_mode": store.get_watch_metadata(
                target_watch_id, "delivery_mode", "mirror"
            ),
        }
    )


async def _op_webhook_provision(ctx: _OpContext) -> Response:
    """Provision a Wrist Webhooks endpoint at the hosted push relay.

    The relay only accepts provisioning from something that can present
    relay_token + device_token pairs — proof of control over the devices the
    webhook will push to — and this integration is the only party holding
    those. The app cannot (and should not) provision directly.

    Targeting mirrors ``notifications_register``: an iPhone caller signs with
    its own identity and declares the paired watch via ``companion_watch_id``,
    because the device tokens live on the watch's entry. All identities here
    are the user's own devices.

    Response (success): ``{"ok": true, "webhook_id", "publish_token",
    "read_token", "publish_url"}``. The two tokens are returned exactly once
    and the app must store them in the Keychain — HA persists only the
    webhook_id (needed to re-bind device tokens after a reinstall) and never
    logs the tokens. The response rides the HMAC-signed channel like every
    other v2 secret exchange (device tokens, identity verification); transport
    privacy is TLS's job, same as those.

    Re-provisioning replaces the stored webhook_id; the previous webhook is
    orphaned at the relay (the app's recovery path for a lost publish token is
    ``rotate`` against the relay directly, not re-provisioning).
    """
    target_watch_id, denied = _resolve_companion_target(ctx)
    if denied is not None:
        return denied

    result = await async_provision_webhook(ctx.domain_data, target_watch_id)
    if result.get("ok") is not True:
        status = result.pop("status", 502)
        return ctx.signed_json(result, status=status)
    return ctx.signed_json(result)


async def _op_watch_secret_status(ctx: _OpContext) -> Response:
    """Report whether a watch's HMAC key is registered in this instance's HACS.

    Fills the iPhone app's "Watch Integration Key" row when it's re-skinned to
    view a *secondary* instance. The watch's per-instance HMAC secret lives only
    on the watch and here in HACS — the iPhone never stores a secondary's watch
    secret (relay provisioning mirrors it to the iPhone only for the primary),
    so the iPhone can't answer locally and asks us instead.

    Targeting mirrors ``notifications_status``: an iPhone caller signs with its
    own per-instance identity and names the paired watch via ``companion_watch_id``.
    Returns only a boolean — never the secret — and the queried watch is the
    user's own device, so this is strictly less sensitive than the register write.
    """
    store = ctx.domain_data.widget_secret_store

    target_watch_id, denied = _resolve_companion_target(ctx)
    if denied is not None:
        return denied

    registered = store.get(target_watch_id) is not None
    return ctx.signed_json({"ok": True, "registered": registered})


async def _op_send_test_notification(ctx: _OpContext) -> Response:
    """Send a *real* camera notification back to the requesting device.

    Powers the "Send Test" button in the iOS snapshot-framing editor: the app
    saves the crop (via ``set_snapshot_crop``) and then calls this, which fires
    an actual push through the same pipeline a doorbell event would use — real
    snapshot capture (applying the just-saved crop), real token-authed
    ``snapshot_url``, real relay delivery — so what arrives is exactly what a
    live notification would look like.

    Body: {"camera": "camera.x", "title"?, "message"?, "companion_watch_id"?}.
    Targeting mirrors ``notifications_register``/``notifications_status``: an
    iPhone caller signs with its own identity, but its mirror (``ios``) token
    lives on the paired watch's entry, declared via ``companion_watch_id``.
    Mirror delivery lands on the iPhone and watchOS mirrors it to the wrist when
    the phone is locked. Returns {"ok": bool, ...}; ``ok:false`` with
    ``reason:"no_push_token"`` when the device hasn't registered for push.
    """
    store = ctx.domain_data.notification_store
    if store is None:
        return ctx.signed_json(
            {"ok": False, "error": "notifications unavailable"}, status=503
        )

    # Camera is OPTIONAL. When present, the test push includes a real snapshot
    # (the iOS snapshot-framing editor's "Send Test"). When absent, it's a
    # plain test push — used by the app's advanced setup check to verify the
    # end-to-end notification pipeline without needing a camera entity.
    camera = ctx.payload.get("camera")
    if camera is not None and (
        not isinstance(camera, str) or not camera.startswith("camera.")
    ):
        return Response(status=400, text="camera must be a camera.* entity id")
    image_source = camera if isinstance(camera, str) and camera.startswith("camera.") else None

    target_watch_id, denied = _resolve_companion_target(ctx)
    if denied is not None:
        return denied

    if not store.get_entries(target_watch_id):
        return ctx.signed_json({"ok": False, "reason": "no_push_token"})

    title = ctx.payload.get("title")
    if not isinstance(title, str) or not title:
        title = "Test notification"
    message = ctx.payload.get("message")
    if not isinstance(message, str) or not message:
        message = "Your Wrist Assistant setup is working." if image_source is None else "Camera snapshot framing test"

    # Optional sample action buttons. The advanced setup check sends a few
    # self-contained demo entities (entity_id + state + friendly_name +
    # attributes already supplied by the app) so the test push arrives with the
    # full interactive WA_ACTIONS UI — buttons and all — exactly like a real
    # notification. These IDs are fakes that won't exist in this HA, so we pass
    # them straight through without state enrichment (the watch/extension renders
    # from the supplied fields). Cap at 4 (matches the watch/extension row limit).
    actions_raw = ctx.payload.get("actions")
    enriched_actions = None
    if isinstance(actions_raw, list):
        action_dicts = [a for a in actions_raw if isinstance(a, dict)][:4]
        if action_dicts:
            enriched_actions = action_dicts

    # Lazy import: _deliver_push lives in the package __init__, importing it at
    # module load would be circular (this module is imported during setup).
    from . import _deliver_push

    try:
        result = await _deliver_push(
            ctx.hass,
            ctx.domain_data,
            title=title,
            message=message,
            image_source=image_source,
            enriched_actions=enriched_actions,
            target_watch_ids=[target_watch_id],
        )
    except HomeAssistantError as err:
        return ctx.signed_json({"ok": False, "reason": str(err)})

    sent = result.get("sent", 0)
    return ctx.signed_json({"ok": sent > 0, "sent": sent})


async def _op_audio_upload(ctx: _OpContext) -> Response:
    """Receive an audio clip for broadcast.

    The HMAC-signed body is the raw audio bytes — there's no JSON wrapper. The
    server saves the file under /config/www/wrist_assistant/ under a random
    name (that folder is served without authentication, see `audio_upload`)
    and returns the URL the media player can pull.
    """
    audio = ctx.body
    if len(audio) > MAX_UPLOAD_SIZE:
        return Response(status=413, text="File too large")
    if not audio:
        return Response(status=400, text="Empty body")

    # Background cleanup of stale files; the timer in __init__ covers the gap
    # after the last upload.
    ctx.hass.async_create_task(async_cleanup_clips(ctx.hass))

    filename, local_url = await async_save_clip(ctx.hass, audio)
    return ctx.signed_json(
        {"ok": True, "url": local_url, "filename": filename, "size": len(audio)}
    )


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


async def _op_entity_picture(ctx: _OpContext) -> Response:
    """Return the `entity_picture` bytes for any entity that carries one.

    A person's profile photo, a media player's cover art, a weather icon: they
    are all the same attribute, and it is a path on this HA instance (e.g.
    `/api/image/serve/<id>/512x512` for a UI-uploaded photo, `/local/...` for a
    static file, `/api/media_player_proxy/...` for cover art). We fetch it
    server-side over the instance's own URL and sign the bytes, so neither the
    watch nor the widget needs a bearer token, the same trust model as
    `entity_image`.

    Only relative paths are fetched. An absolute `http(s)://` entity_picture
    (a gravatar, or Spotify's art) is refused rather than proxied, so this op
    can't be turned into an open relay against arbitrary hosts. That refusal is
    a signed 400 carrying `reason: "external"`, which is what lets the caller
    tell "hosted somewhere else" apart from "the fetch failed".

    Registered twice: as `entity_picture`, and as `person_picture`, the name it
    was born under and the one the watch app's person tiles still send.
    Body: {"entity_id": "<any entity id>"}
    """
    entity_id = ctx.payload.get("entity_id")
    if not isinstance(entity_id, str) or not entity_id:
        return Response(status=400, text="entity_id required")

    state = ctx.hass.states.get(entity_id)
    if state is None:
        return Response(status=404, text="Unknown entity")

    picture = state.attributes.get("entity_picture")
    if not isinstance(picture, str) or not picture:
        return Response(status=404, text="No entity_picture")

    # Only fetch paths on this instance. Reject absolute/external URLs and any
    # non-path value (e.g. a `data:` URI) — see the anti-amplification note above.
    if "://" in picture or not picture.startswith("/"):
        return ctx.signed_json({"ok": False, "reason": "external"}, status=400)

    import aiohttp
    from homeassistant.helpers.aiohttp_client import async_get_clientsession
    from homeassistant.helpers.network import NoURLAvailableError, get_url

    try:
        base = get_url(ctx.hass, prefer_external=False)
    except NoURLAvailableError:
        return Response(status=503, text="No reachable HA URL")

    session = async_get_clientsession(ctx.hass)
    try:
        async with session.get(
            base + picture, timeout=aiohttp.ClientTimeout(total=10)
        ) as resp:
            if resp.status != 200:
                _LOGGER.debug(
                    "entity_picture: %s -> HTTP %s", entity_id, resp.status
                )
                return Response(status=503, text="Picture unavailable")
            data = await resp.read()
            content_type = resp.headers.get("Content-Type", "image/jpeg")
    except (aiohttp.ClientError, asyncio.TimeoutError) as err:
        _LOGGER.debug("entity_picture: %s fetch failed: %s", entity_id, err)
        return Response(status=503, text="Picture fetch failed")

    if not data:
        return Response(status=503, text="Empty picture")

    # A 1500 px album cover would blow the widget's 100 KB per-image budget on
    # its way to the watch, so anything over that budget goes through the same
    # crop-free downscale a complication snapshot gets. Under it the bytes are
    # passed through untouched: re-encoding a small avatar would only flatten
    # its transparency onto black and cost a JPEG generation for nothing.
    if len(data) > SNAPSHOT_MAX_BYTES:
        try:
            processed = await ctx.hass.async_add_executor_job(
                _process_snapshot,
                data,
                ViewportState(),
                SNAPSHOT_MAX_WIDTH,
                SNAPSHOT_MAX_HEIGHT,
                SNAPSHOT_DEFAULT_QUALITY,
                SNAPSHOT_MAX_BYTES,
            )
        except Exception as err:  # noqa: BLE001 (a picture Pillow cannot read)
            _LOGGER.debug("entity_picture: %s downscale failed: %s", entity_id, err)
            processed = None
        if processed is None:
            return Response(status=503, text="Picture exceeds size budget")
        data = processed
        content_type = "image/jpeg"

    return ctx.signed_bytes(data, content_type=content_type or "image/jpeg")


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
          "viewport": {"x": ..., "y": ..., "w"|"width": ..., "h"|"height": ...},
          "apply_saved_crop": true
        }

    `apply_saved_crop` (used by the notification live stream) falls back to the
    camera's saved Camera Framing crop when no explicit `viewport` is given,
    so the live view matches the framed snapshot.

    Response carries a relative URL the watch should fetch immediately; the
    URL is good for one connection and expires ~30 s after issue. It also
    includes the camera's `saved_crop` (or null) and `open_zoomed` flag so the
    in-app full-screen view can start pre-zoomed to the framed region.
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
    raw_viewport = ctx.payload.get("viewport")
    viewport = _parse_stream_viewport(raw_viewport)
    crop_store = ctx.domain_data.snapshot_crop_store
    stored_crop = crop_store.get(entity_id)
    # Honor the user's saved per-camera framing (iOS app → Camera Framing) for
    # streams that opt in. The notification live stream sets apply_saved_crop so
    # it matches the framed snapshot; the in-app full-screen view sends neither a
    # viewport nor the flag, so it stays full-frame (it seeds a *client-side*
    # zoom from `saved_crop` below instead, which stays zoomable). Only falls
    # back when the client gave no explicit viewport. Mirrors
    # capture_notification_snapshot.
    if not isinstance(raw_viewport, dict) and ctx.payload.get("apply_saved_crop"):
        if stored_crop is not None:
            viewport = stored_crop

    token, expires_at = ctx.domain_data.stream_token_store.mint(
        watch_id=ctx.watch_id,
        entity_id=entity_id,
        width=width,
        quality=quality,
        fps=fps,
        viewport=viewport,
        ttl_seconds=WA_STREAM_TOKEN_TTL_SECONDS,
    )

    # Surface the saved crop + open-zoomed flag so the in-app full-screen view
    # can start pre-zoomed to the framed region without a second round-trip. The
    # stream itself stays full-frame (no viewport sent), so the Crown can zoom
    # back out. Older watch apps ignore these extra fields.
    saved_crop = (
        {"x": stored_crop.x, "y": stored_crop.y, "w": stored_crop.w, "h": stored_crop.h}
        if stored_crop is not None
        else None
    )

    return ctx.signed_json(
        {
            "ok": True,
            "token": token,
            "stream_url": f"/api/wrist_assistant/v2/stream/{token}",
            "expires_at": int(expires_at),
            "fps": fps,
            "saved_crop": saved_crop,
            "open_zoomed": crop_store.get_open_zoomed(entity_id),
        }
    )


async def _op_snapshots_open(ctx: _OpContext) -> Response:
    """Mint a single-use token for a progressive batch-snapshot stream.

    Body:
        { "cameras": [ {"entity_id": "camera.x", "width": 220,
                        "max_height": 140}, ... ],
          "quality": 75 }

    `max_height` is optional and bounds the other side of the box the image is
    fitted into. Left out, the box stays square (`width` on both sides), which
    is what every caller before it asked for and what the watch's camera tiles
    still want.

    Returns a relative URL the watch fetches immediately; the multipart stream
    flushes each camera's JPEG as it's ready. See run_batch_snapshot_stream.
    """
    raw = ctx.payload.get("cameras")
    if not isinstance(raw, list) or not raw:
        return Response(status=400, text="cameras array required")

    quality = _bound_int(
        ctx.payload.get("quality"), SNAPSHOT_DEFAULT_QUALITY, MIN_QUALITY, MAX_QUALITY
    )

    cameras: list[tuple[str, int, int]] = []
    seen: set[str] = set()
    for spec in raw[:MAX_BATCH_SNAPSHOT_CAMERAS]:
        if not isinstance(spec, dict):
            continue
        entity_id = spec.get("entity_id")
        if (
            not isinstance(entity_id, str)
            or not entity_id.startswith("camera.")
            or entity_id in seen
            or ctx.hass.states.get(entity_id) is None
        ):
            continue
        # The bounding box lives next to the size constants in camera_stream,
        # which is also what lets it be checked without a Home Assistant.
        width, max_height = batch_snapshot_box(
            spec.get("width"), spec.get("max_height")
        )
        cameras.append((entity_id, width, max_height))
        seen.add(entity_id)

    if not cameras:
        return Response(status=400, text="no valid camera entities")

    token, expires_at = ctx.domain_data.batch_snapshot_token_store.mint(
        watch_id=ctx.watch_id,
        cameras=cameras,
        quality=quality,
        ttl_seconds=WA_STREAM_TOKEN_TTL_SECONDS,
    )

    return ctx.signed_json(
        {
            "ok": True,
            "token": token,
            "stream_url": f"/api/wrist_assistant/v2/snapshots/{token}",
            "expires_at": int(expires_at),
            "count": len(cameras),
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


async def _op_update_metadata(ctx: _OpContext) -> Response:
    """HMAC-signed metadata refresh for an already-registered watch.

    Body: `{app_version?, app_build?, owner_iphone_id?, device_name?,
    screen_size?}` — all optional strings; omitted/empty fields are left
    unchanged.

    This exists so a registered watch never needs the HA bearer token to keep
    its diagnostic sensors current. The bearer-authed `register_secret` path
    used to double as the metadata-update channel, which meant a watch holding
    a stale bearer (e.g. the non-active watch after a sign-out/in on the
    iPhone) fired a doomed authenticated request on every cold start — each
    one writing a "Login attempt failed" warning + persistent notification in
    HA and counting toward `ip_ban`'s threshold. HMAC failures stay inside
    this integration, so this path can never pollute HA's auth log.

    Identity comes from the validated HMAC (`ctx.watch_id`), so a watch can
    only update its own entry, and only metadata — never secret material.
    Watches newer than this integration get 400 "Unknown op" from the
    dispatch table and fall back to the bearer path themselves; watches too
    old to know this op simply keep using the bearer path.
    """

    def _clean(key: str) -> str | None:
        value = ctx.payload.get(key)
        if isinstance(value, str):
            stripped = value.strip()
            if stripped:
                return stripped
        return None

    device_name = _clean("device_name")
    ok = ctx.domain_data.widget_secret_store.update_metadata(
        ctx.watch_id,
        app_version=_clean("app_version"),
        app_build=_clean("app_build"),
        owner_iphone_id=_clean("owner_iphone_id"),
        device_name=device_name,
        screen_size=_clean("screen_size"),
    )
    if not ok:
        # Entry vanished between HMAC validation and dispatch (concurrent
        # removal). Signed 410 tells the watch its registration is gone.
        return ctx.signed_json({"ok": False, "error": "not registered"}, status=410)

    # HMAC carries no user, so this op cannot bind on its own; but a watch
    # that just reported its owner can take the owner's user.
    ctx.domain_data.widget_secret_store.inherit_owner_user(ctx.watch_id)

    # Same registry propagation as the register_secret view: surface a renamed
    # watch immediately instead of waiting for the next HA restart. Manual
    # renames (`name_by_user`) always win on display and are left untouched.
    if device_name is not None:
        device_registry = dr.async_get(ctx.hass)
        device = device_registry.async_get_device(
            identifiers={(DOMAIN, f"watch_{ctx.watch_id}")}
        )
        if device is not None and device.name != device_name:
            device_registry.async_update_device(device.id, name=device_name)

    # Echo the stored entry so the caller (and the live test suite) can
    # confirm what actually persisted — it's the watch's own data, signed
    # back to the watch that owns it.
    entry = ctx.domain_data.widget_secret_store.get(ctx.watch_id)
    return ctx.signed_json(
        {
            "ok": True,
            "app_version": entry.app_version if entry else None,
            "app_build": entry.app_build if entry else None,
            "owner_iphone_id": entry.owner_iphone_id if entry else None,
            "device_name": entry.device_name if entry else None,
            "screen_size": entry.screen_size if entry else None,
            "user_bound": bool(entry is not None and entry.user_id),
        }
    )


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


class WABatchSnapshotView(HomeAssistantView):
    """Progressive multipart snapshot stream authed by a single-use token.

    The token is minted by `op=snapshots_open` on /v2/action and bound to the
    requested cameras at mint time. Same auth model as WAStreamView (token, not
    HMAC headers — a chunked multipart response can't carry per-part request
    signatures): single-use, ~30 s TTL, indistinguishable 404 on any rejection.
    The frame loop is `run_batch_snapshot_stream` in camera_stream.py.
    """

    url = "/api/wrist_assistant/v2/snapshots/{token}"
    name = "api:wrist_assistant_v2_snapshots"
    requires_auth = False

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def get(self, request: Request, token: str) -> StreamResponse:
        domain_data: WristAssistantData | None = self._hass.data.get(DOMAIN)
        if domain_data is None:
            return Response(text="Integration not loaded", status=503)

        entry = domain_data.batch_snapshot_token_store.claim(token)
        if entry is None:
            # Indistinguishable from expired/consumed, matching WAStreamView.
            _LOGGER.debug("Rejected /v2/snapshots token (missing/expired/consumed)")
            return Response(text="Not Found", status=404)

        return await run_batch_snapshot_stream(
            self._hass,
            request,
            entry.cameras,
            entry.quality,
            # Read the throttle at stream time (not mint time) so a concurrency
            # change from the iOS Camera Settings takes effect on the next batch.
            concurrency=domain_data.batch_snapshot_settings_store.concurrency,
        )


# ── /notification/snapshot view ──────────────────────────────────────────

# How long a snapshot GET waits for an in-flight background capture before
# 404ing. Slightly above NOTIF_SNAPSHOT_CAPTURE_TIMEOUT (5 s) so a slow-but-
# responsive camera still resolves on the first fetch; well within iOS's
# notification-service-extension execution budget (~30 s).
SNAPSHOT_FETCH_WAIT_SECONDS = 6.0


class WANotificationSnapshotView(HomeAssistantView):
    """Serve a camera snapshot captured for a notification, authed by token.

    The token is minted by `send_notification` when a push carries an `image`
    camera entity; it's embedded in the push as `snapshot_url`. Auth is the
    token lookup (multi-use within a short TTL) rather than HMAC/bearer, so the
    iOS content extension and the watch long look can fetch the image with a
    plain GET — neither can carry the watch's HMAC headers. A leaked URL exposes
    one frame for the TTL window only.
    """

    url = "/api/wrist_assistant/notification/snapshot/{token}"
    name = "api:wrist_assistant_notification_snapshot"
    requires_auth = False

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def get(self, request: Request, token: str) -> Response:
        domain_data: WristAssistantData | None = self._hass.data.get(DOMAIN)
        if domain_data is None:
            return Response(text="Integration not loaded", status=503)

        # If the push beat the camera, wait briefly for the in-flight capture to
        # land instead of 404ing. Bounded so a dead/slow camera can't pin the
        # connection; on timeout the client falls back to camera_entity_id.
        entry = await domain_data.notification_snapshot_store.get_wait(
            token, timeout=SNAPSHOT_FETCH_WAIT_SECONDS
        )
        if entry is None or entry.data is None:
            # Missing / expired / failed / still-pending are indistinguishable
            # to the caller by design.
            return Response(text="Not Found", status=404)

        return Response(
            body=entry.data,
            content_type=entry.content_type,
            headers={"Cache-Control": "private, max-age=600"},
        )


class WANotificationSnapshotLiveView(HomeAssistantView):
    """Re-capture a *fresh* frame for an existing snapshot token.

    The base snapshot URL serves the frame frozen at send time; this sibling
    re-captures live from the same camera on every GET, applying the camera's
    saved framing crop. Lets the iOS notification's image be tapped to refresh.

    Auth is the same multi-use token lookup as `WANotificationSnapshotView`
    (the content extension can't carry HMAC/bearer). The token already scopes
    which camera may be captured, and each token allows only a handful of
    live re-captures (`NotificationSnapshotStore.consume_live`), so a leaked
    URL is a few fresh frames of one camera, not a ten-minute live feed. Past
    the cap the tap serves the frozen frame. Responses are `no-store` so each
    tap re-fetches.
    """

    url = "/api/wrist_assistant/notification/snapshot/{token}/live"
    name = "api:wrist_assistant_notification_snapshot_live"
    requires_auth = False

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def get(self, request: Request, token: str) -> Response:
        domain_data: WristAssistantData | None = self._hass.data.get(DOMAIN)
        if domain_data is None:
            return Response(text="Integration not loaded", status=503)

        entry = domain_data.notification_snapshot_store.get(token)
        if entry is None:
            return Response(text="Not Found", status=404)

        # No source camera (pre-built image token) → nothing to re-capture;
        # hand back the cached frame so the tap is at worst a no-op. The same
        # once the token has spent its live re-captures.
        if not entry.entity_id or not domain_data.notification_snapshot_store.consume_live(
            token
        ):
            if entry.data is None:
                return Response(text="Not Found", status=404)
            return Response(
                body=entry.data,
                content_type=entry.content_type,
                headers={"Cache-Control": "no-store"},
            )

        crop = domain_data.snapshot_crop_store.get(entry.entity_id)
        try:
            jpeg = await capture_notification_snapshot(
                self._hass, entry.entity_id, viewport=crop
            )
        except Exception:  # noqa: BLE001 — never 500 a notification refresh
            jpeg = None

        # Capture failed (camera unavailable, away from home) → cached frame, if
        # we have one (None while the original send-time capture is still in
        # flight); otherwise 404 and let the client fall back.
        if not jpeg:
            if entry.data is None:
                return Response(text="Not Found", status=404)
            return Response(
                body=entry.data,
                content_type=entry.content_type,
                headers={"Cache-Control": "no-store"},
            )

        return Response(
            body=jpeg,
            content_type="image/jpeg",
            headers={"Cache-Control": "no-store"},
        )


# ── /v2/register_secret view ─────────────────────────────────────────────


# Free-text fields the app reports about itself end up in logs, the device
# registry and the panel. Cap them so a bad client cannot stuff them.
_REGISTER_ID_MAX_LEN = 128
_REGISTER_TEXT_MAX_LEN = 256


class WARegisterSecretView(HomeAssistantView):
    """Bearer-authenticated endpoint where the iOS app registers a per-watch
    HMAC secret with HA. Called once per (watch_id, baseURL) on iOS-side
    integration check. The watch never calls this — iOS owns provisioning
    so the watch process never needs the bearer.

    The secret is bound to the Home Assistant user behind the bearer. Every
    later request signed with it runs as that user (`_OpContext.new_context`),
    so pairing never grants more than the pairing user already has. Any user
    may pair, as with the Companion app. A watch_id that is already bound to
    someone else can only be re-registered by that same user or by an admin;
    otherwise a second account could silently replace a device's key and take
    over its identity, push registration and complications.
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
        raw_device_name = payload.get("device_name")
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
        # User-visible device name (WKInterfaceDevice.name on watchOS,
        # UIDevice.name on iOS with the user-assigned-device-name entitlement).
        # Older builds omit it — DeviceInfo falls back to `Watch <short_id>` /
        # `iPhone <short_id>`. Strip whitespace so "  " doesn't shadow the
        # fallback with an empty-looking name.
        device_name = (
            raw_device_name.strip()
            if isinstance(raw_device_name, str) and raw_device_name.strip()
            else None
        )
        # Screen size in points ("208x248"). The complication panel matches it
        # against its watch-case table so the preview dropdown defaults to
        # this watch's case. Older builds omit it — the panel keeps its 46 mm
        # reference default.
        raw_screen_size = payload.get("screen_size")
        screen_size = (
            raw_screen_size.strip()
            if isinstance(raw_screen_size, str) and raw_screen_size.strip()
            else None
        )

        if not isinstance(watch_id, str) or not watch_id:
            return self.json_message("watch_id required", status_code=400)
        # The Library's owner id is not a device. A secret under it would let
        # whoever holds that secret pull, create and restore the home's
        # Library designs as if they were a watch's own.
        if watch_id == LIBRARY_OWNER_ID:
            return self.json_message("watch_id is reserved", status_code=400)
        if len(watch_id) > _REGISTER_ID_MAX_LEN or (
            owner_iphone_id is not None and len(owner_iphone_id) > _REGISTER_ID_MAX_LEN
        ):
            return self.json_message("watch_id too long", status_code=400)
        for field_name, value in (
            ("label", label),
            ("device_name", device_name),
            ("screen_size", screen_size),
            ("app_version", app_version),
            ("app_build", app_build),
        ):
            if isinstance(value, str) and len(value) > _REGISTER_TEXT_MAX_LEN:
                return self.json_message(f"{field_name} too long", status_code=400)
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

        # HA's auth middleware put the bearer's user here (requires_auth).
        user = request.get("hass_user")
        user_id = user.id if user is not None else None
        is_admin = bool(user is not None and user.is_admin)

        existing = domain_data.widget_secret_store.get(watch_id)
        if (
            existing is not None
            and existing.user_id is not None
            and existing.user_id != user_id
            and not is_admin
        ):
            _LOGGER.warning(
                "Refused register_secret for watch_id=%s: bound to another user",
                watch_id,
            )
            return self.json_message(
                "This device is paired by another user. Ask an admin to forget "
                "it in the Wrist Assistant panel first.",
                status_code=403,
            )

        register_result = domain_data.widget_secret_store.register(
            watch_id=watch_id,
            secret_b64=secret_b64,
            label=label if isinstance(label, str) else None,
            algo=algo,
            app_version=app_version,
            app_build=app_build,
            owner_iphone_id=owner_iphone_id,
            device_name=device_name,
            screen_size=screen_size,
            user_id=user_id,
        )
        if register_result == "new":
            log_secret_registered(
                self._hass,
                watch_id=watch_id,
                label=label if isinstance(label, str) else None,
                app_version=app_version,
            )
        elif register_result == "rekey":
            log_secret_reprovisioned(
                self._hass,
                watch_id=watch_id,
                label=label if isinstance(label, str) else None,
                app_version=app_version,
            )
        # An iPhone re-registers on every app update; its watches never
        # re-send a bearer registration once they hold a secret. Carry the
        # user across so a watch paired before binding is bound through its
        # owner, and a watch registered under an already-bound owner inherits.
        if user_id is not None:
            domain_data.widget_secret_store.bind_owned_watches(watch_id, user_id)
        domain_data.widget_secret_store.inherit_owner_user(watch_id)
        # Propagate the freshly-reported `device_name` to HA's device registry
        # immediately so the user sees their watch renamed from "Watch
        # DD2509D8" → "Jesse's Apple Watch" without waiting for the next HA
        # restart to re-run entity __init__. Only updates the integration's
        # default name (the `name` field); any user override set via the HA UI
        # (`name_by_user`) wins on display and is left untouched.
        if device_name is not None:
            device_registry = dr.async_get(self._hass)
            device = device_registry.async_get_device(
                identifiers={(DOMAIN, f"watch_{watch_id}")}
            )
            if device is not None and device.name != device_name:
                device_registry.async_update_device(device.id, name=device_name)
        # `user_bound` tells the app the integration binds secrets to users,
        # so it can stop re-sending this registration; an integration without
        # the field is one the app keeps nudging until it is updated.
        bound_entry = domain_data.widget_secret_store.get(watch_id)
        return self.json(
            {
                "ok": True,
                "protocol_version": WA_PROTOCOL_VERSION,
                "algo": algo,
                "user_bound": bool(bound_entry is not None and bound_entry.user_id),
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
    * `capabilities` — the sorted capability list the delta reply also carries,
      so an app can check for a server feature (`custom_complications`) before
      it has a signed identity to ask with.

    Unauthenticated because the bearer may not be configured yet when iOS first
    checks, and the response carries no secrets.

    While the config entry is not loaded (a reload is under way) it answers 503
    with `{"ok": false, "error": "restarting"}` rather than a reply with no
    capabilities, so the app retries instead of taking the home for an old
    integration.

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
        # The view outlives a config-entry reload, which pops the entry's data
        # and builds it again. Answering 200 in that window meant an empty
        # capability list, which an app reads as an old integration and stops
        # asking. A 503 says "try again", like every other v2 view.
        domain_data = self._hass.data.get(DOMAIN)
        coordinator = getattr(domain_data, "coordinator", None)
        if coordinator is None:
            return self.json({"ok": False, "error": "restarting"}, status_code=503)
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
        # This HA install's stable instance UUID — the matching key a
        # multi-instance app uses to bind a push (stamped with the same id on the
        # `data` dict) back to the right local instance. Same source on both
        # sides, so it's the robust anchor even if the WS-config `instance_id`
        # ever diverges. Additive + unauthenticated; absent → app falls back to
        # the WS-config value.
        try:
            instance_uuid = await ha_instance_id.async_get(self._hass)
        except Exception:  # noqa: BLE001
            instance_uuid = None
        # What this server can do, the same sorted list every delta reply
        # carries. The app needs some of these before it has anything to sign
        # with: the custom-complication move wizard is only offered for a home
        # whose integration reports `custom_complications`, and until now the
        # only way to learn that was a signed poll. The entry registers them
        # all before it publishes its data, so a loaded entry's list is whole.
        payload = {
            "integration_version": integration_version,
            "wa_protocol_version": WA_PROTOCOL_VERSION,
            "min_supported_app_protocol_version": MIN_SUPPORTED_APP_PROTOCOL_VERSION,
            "app_update_message": APP_UPDATE_MESSAGE,
            "capabilities": coordinator.capabilities,
        }
        if instance_uuid:
            payload["instance_id"] = instance_uuid
        return self.json(payload)


# ── custom complications (watch replica pull) ────────────────────────────


async def _op_complications_sync(ctx: _OpContext) -> Response:
    """Return every complication record committed after the caller's token.

    The watch is a read-only replica: it pulls this on app foreground and on
    manual Sync, then applies tombstones first. The owner is always the caller
    (a watch self-provisions under its own id), so no cross-device scoping is
    possible.

    Body: {"since_token": <int>,   # 0 or absent = full collection incl. tombstones
           "presets": [{"slot": <int>, "name": <str>}, ...],  # optional
           "applied_token": <int>}  # optional
    Reply: {"token", "since_token", "max_schema_version", "records": [...]}

    ``applied_token`` is the caller saying which store token it has finished
    applying. The watch reports the same thing on every long-poll request, so
    it never needs this; the iPhone holds no poll, and without it a phone
    owner's panel row could never go green. Advisory like the reports below: a
    value that is not a non-negative integer is ignored rather than refused,
    because the pull itself is what the caller came for.

    ``presets`` is the watch reporting the iPhone presets it renders: which
    slots they occupy and the names the user gave them. The panel cannot see
    presets, and its auto-assigner draws from the same slot pool; without this
    it can put a new custom under a preset, which then masks it. The names let
    the panel list the presets as locked rows. Advisory: bad entries are
    dropped, and an absent key leaves the last report standing (old apps never
    send it). ``preset_slots`` (bare ints) is the shape one pre-release build
    sent and is still accepted.
    """
    raw_since = ctx.payload.get("since_token", 0)
    if isinstance(raw_since, bool) or not isinstance(raw_since, int) or raw_since < 0:
        return Response(status=400, text="since_token must be a non-negative integer")
    store = ctx.domain_data.complication_store
    # ``occupied`` is the whole slot pool minus this server's own records:
    # presets from every home plus customs that live on another Home
    # Assistant, each with a kind and a home name. Newer apps send it and it
    # replaces the preset report (the preset rows are derived from it).
    # Older apps send ``presets`` alone.
    raw_occupied = ctx.payload.get("occupied")
    if isinstance(raw_occupied, list):
        store.set_occupied(ctx.watch_id, raw_occupied)
    else:
        raw_presets = ctx.payload.get("presets", ctx.payload.get("preset_slots"))
        if isinstance(raw_presets, list):
            store.set_presets(ctx.watch_id, raw_presets)
    # The watch's page list (id + name), feeding the panel's "Open the page"
    # tap-action picker. Advisory like the preset report; absent = keep last.
    raw_pages = ctx.payload.get("pages")
    if isinstance(raw_pages, list):
        store.set_pages(ctx.watch_id, raw_pages)
    raw_applied = ctx.payload.get("applied_token")
    if (
        not isinstance(raw_applied, bool)
        and isinstance(raw_applied, int)
        and raw_applied >= 0
    ):
        store.set_applied_token(ctx.watch_id, raw_applied)
    # Stamp the pull itself, whatever it carried. This is what
    # `watch_status.last_sync_seconds` reports, and for a phone owner it is
    # the only sign of life the panel gets.
    store.set_last_sync(ctx.watch_id)
    records = store.changes_since(ctx.watch_id, raw_since)
    forgotten = store.is_forgotten(ctx.watch_id)
    reply = ctx.signed_json(
        {
            "token": store.owner_token(ctx.watch_id),
            "since_token": raw_since,
            "max_schema_version": COMPLICATION_MAX_SCHEMA_VERSION,
            "records": [r.as_dict() for r in records],
            # True when the user forgot this device and nothing has been put
            # on it since. An empty reply on its own means "keep your copies,
            # Restore may want them"; this says the empty is deliberate, and
            # the device drops its copies. Older apps ignore the key.
            "owner_forgotten": forgotten,
        }
    )
    # Said once. The device drops its copies on this reply, and a device
    # that pairs again under the same id must read as a normal owner after
    # it, or the preset move would stop at "forgotten" for good.
    if forgotten:
        store.acknowledge_forgotten(ctx.watch_id)
    return reply


async def _op_complications_restore(ctx: _OpContext) -> Response:
    """Seed an empty HA collection from the watch's last accepted replica.

    Recovery only (integration reinstalled, store wiped). Refused with a
    signed 409 when HA already holds live complications for this owner, so a
    stale watch can never overwrite the panel's data. Not an editing path.

    Body: {"documents": [<CustomComplicationConfig JSON>, ...]}
    """
    documents = ctx.payload.get("documents")
    if not isinstance(documents, list):
        return Response(status=400, text="documents must be a list")
    store = ctx.domain_data.complication_store
    try:
        records = store.restore(
            ctx.watch_id, documents, updated_by=f"watch-restore:{ctx.watch_id}"
        )
    except ComplicationConflictError as err:
        return ctx.signed_json(
            {"ok": False, "error": err.code, "message": err.message}, status=409
        )
    except ComplicationStoreError as err:
        return ctx.signed_json(
            {"ok": False, "error": err.code, "message": err.message}, status=400
        )
    return ctx.signed_json(
        {
            "ok": True,
            "token": store.owner_token(ctx.watch_id),
            "records": [r.as_dict() for r in records],
        }
    )


async def _op_complications_create(ctx: _OpContext) -> Response:
    """Create complication documents alongside whatever the owner already has.

    The iPhone's one-time preset transfer signs with the watch's pair and
    posts the converted documents here, so unlike ``complications_restore``
    this must coexist with records the panel already authored.

    Body: {"documents": [<CustomComplicationConfig JSON>, ...]}
    Reply: {"ok", "token", "results": [{"id", "slotIndex", "status", "message"?}]}

    Two phases. Structural problems (bad shape, duplicate id/slot inside the
    batch, over the per-owner cap) refuse the whole batch with a signed 400
    and write nothing, so a clean retry is always possible. Per-document
    outcomes then commit in order: "created", "exists" (same id already live,
    the idempotent-retry case; document ids are stable across retries),
    "slot_conflict" (a different live record holds the slot), or "error"
    (the id was deleted on the server; never revive a tombstone).

    Slot conflicts are checked against live records only, never against the
    owner's reported preset slots: at transfer time the presets being handed
    over are still in the report, and the app guarantees it is transferring
    exactly those slots.
    """
    documents = ctx.payload.get("documents")
    if not isinstance(documents, list) or not documents:
        return ctx.signed_json(
            {
                "ok": False,
                "error": "invalid",
                "message": "documents must be a non-empty list",
            },
            status=400,
        )
    store = ctx.domain_data.complication_store

    validated: list[tuple[str, dict[str, Any]]] = []
    batch_ids: set[str] = set()
    # A slot holds at most one document per shape, so two documents in one
    # batch may share a slot number when they draw different shapes (the
    # preset move wizard writes one document per shape at the preset's slot).
    batch_shapes: set[tuple[int, str]] = set()
    try:
        for document in documents:
            cleaned = validate_document(document)
            doc_id = str(uuid.UUID(cleaned["id"])).upper()
            if doc_id in batch_ids:
                raise ComplicationValidationError(f"duplicate document id {doc_id}")
            slot = cleaned["slotIndex"]
            shapes = {(slot, shape) for shape in shapes_of(cleaned)}
            if shapes & batch_shapes:
                raise ComplicationValidationError(
                    f"duplicate slotIndex {slot} in the batch"
                )
            batch_ids.add(doc_id)
            batch_shapes |= shapes
            validated.append((doc_id, cleaned))
    except ComplicationStoreError as err:
        return ctx.signed_json(
            {"ok": False, "error": err.code, "message": err.message}, status=400
        )

    live = store.list(ctx.watch_id)
    live_by_id = {r.id: r for r in live}
    new_creates = sum(1 for doc_id, _ in validated if doc_id not in live_by_id)
    if len(live) + new_creates > COMPLICATION_MAX_PER_OWNER:
        return ctx.signed_json(
            {
                "ok": False,
                "error": "invalid",
                "message": (
                    f"batch would exceed {COMPLICATION_MAX_PER_OWNER} "
                    "complications for this owner"
                ),
            },
            status=400,
        )

    results: list[dict[str, Any]] = []
    for doc_id, document in validated:
        slot = document["slotIndex"]
        outcome: dict[str, Any] = {"id": doc_id, "slotIndex": slot}
        if doc_id in live_by_id:
            outcome["status"] = "exists"
        elif store.get(ctx.watch_id, doc_id) is not None:
            outcome["status"] = "error"
            # ``reason`` is the machine-readable half: the app used to match
            # the word "deleted" in the message, which any other store error
            # mentioning a deletion would also have matched.
            outcome["reason"] = "deleted"
            outcome["message"] = "id was deleted on the server"
        else:
            shapes = shapes_of(document)
            slot_holder = next(
                (
                    r
                    for r in live
                    if (r.document or {}).get("slotIndex") == slot
                    and shapes_of(r.document) & shapes
                ),
                None,
            )
            if slot_holder is not None:
                outcome["status"] = "slot_conflict"
                outcome["message"] = f"slot {slot} is held by {slot_holder.id}"
            else:
                try:
                    record = store.save(
                        ctx.watch_id,
                        document,
                        base_revision=None,
                        updated_by=f"app-import:{ctx.watch_id}",
                    )
                except ComplicationStoreError as err:
                    outcome["status"] = "error"
                    outcome["message"] = err.message
                else:
                    outcome["status"] = "created"
                    # Claim the slot for later collision checks in this batch.
                    live.append(record)
                    live_by_id[record.id] = record
        results.append(outcome)

    return ctx.signed_json(
        {
            "ok": True,
            "token": store.owner_token(ctx.watch_id),
            "results": results,
        }
    )


async def _op_complications_move_status(ctx: _OpContext) -> Response:
    """What this owner holds and what its watch has applied, changing nothing.

    The iPhone's preset move signs with the watch's pair and needs two things
    before it may delete a preset: which of its derived document ids are live
    or tombstoned (to send only what is missing), and whether the watch has
    applied the token its create returned (proof the face already draws the
    document). ``complications_sync`` answers the first but not the second,
    and a pull signed as the watch stamps ``last_sync`` and would overwrite
    the watch's own reports, so the move must never call it. This op reads
    and returns; it stamps no sync, records no ack, touches no report.

    Body: {}
    Reply: {"ok", "token", "applied_token", "owner_forgotten",
            "max_schema_version", "max_per_owner", "live_count",
            "tombstone_count",
            "live": [{"id", "name", "slotIndex", "shapes"}],
            "tombstones": [<id>, ...]}

    ``applied_token`` is ``None`` when the watch has never acked. The cap
    counts live records only; ``tombstone_count`` is there so the app can
    tell "full" from "mostly deleted" in what it shows the user.
    """
    store = ctx.domain_data.complication_store
    live: list[dict[str, Any]] = []
    tombstones: list[str] = []
    for record in store.list(ctx.watch_id, include_deleted=True):
        if record.deleted:
            tombstones.append(record.id)
            continue
        document = record.document or {}
        live.append(
            {
                "id": record.id,
                "name": document.get("name", ""),
                "slotIndex": document.get("slotIndex"),
                "shapes": sorted(shapes_of(document)),
            }
        )
    return ctx.signed_json(
        {
            "ok": True,
            "token": store.owner_token(ctx.watch_id),
            "applied_token": store.applied_token(ctx.watch_id),
            "owner_forgotten": store.is_forgotten(ctx.watch_id),
            "max_schema_version": COMPLICATION_MAX_SCHEMA_VERSION,
            "max_per_owner": COMPLICATION_MAX_PER_OWNER,
            "live_count": len(live),
            "tombstone_count": len(tombstones),
            "live": live,
            "tombstones": tombstones,
        }
    )


# Op dispatch table. Adding a new op = add a key here.
_OP_HANDLERS: dict[str, Any] = {
    "complications_sync": _op_complications_sync,
    "complications_restore": _op_complications_restore,
    "complications_create": _op_complications_create,
    "complications_move_status": _op_complications_move_status,
    "service": _op_service,
    "state": _op_state,
    "history": _op_history,
    "statistics": _op_statistics,
    "list": _op_list,
    # One request for a whole face's text sources. Every section is answered
    # by the same reader the single op above calls.
    "bundle": _op_bundle,
    "states_batch": _op_states_batch,
    "info": _op_info,
    "snapshot": _op_snapshot,
    "set_snapshot_crop": _op_set_snapshot_crop,
    "get_snapshot_crop": _op_get_snapshot_crop,
    "snapshot_crops_status": _op_snapshot_crops_status,
    "get_snapshot_concurrency": _op_get_snapshot_concurrency,
    "set_snapshot_concurrency": _op_set_snapshot_concurrency,
    "set_stream_entity": _op_set_stream_entity,
    "get_stream_entity": _op_get_stream_entity,
    "template": _op_template,
    "services_list": _op_services_list,
    "config_entries_list": _op_config_entries_list,
    "mass_players": _op_mass_players,
    "mass_queue": _op_mass_queue,
    "mass_play_queue_item": _op_mass_play_queue_item,
    "remote_command": _op_remote_command,
    "fire_event": _op_fire_event,
    "notifications_register": _op_notifications_register,
    "notifications_status": _op_notifications_status,
    "webhook_provision": _op_webhook_provision,
    "watch_secret_status": _op_watch_secret_status,
    "send_test_notification": _op_send_test_notification,
    "audio_upload": _op_audio_upload,
    "camera_batch": _op_camera_batch,
    "snapshots_open": _op_snapshots_open,
    "camera_devices": _op_camera_devices,
    "entity_image": _op_entity_image,
    "entity_picture": _op_entity_picture,
    # The name the op was born under. Kept registered because the watch app's
    # person tiles still send it, and an older watch never learns the new one.
    "person_picture": _op_entity_picture,
    "stream_open": _op_stream_open,
    "stream_update": _op_stream_update,
    "stream_close": _op_stream_close,
    "verify_identity": _op_verify_identity,
    "update_metadata": _op_update_metadata,
}
