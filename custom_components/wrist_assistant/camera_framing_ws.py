"""WebSocket commands for the panel's camera framing screen.

The iPhone's Camera Framing screen moves into the panel. The data was always
here: the notification crop and its ``open_zoomed`` flag
(``SnapshotCropStore``), the live stream a tapped alert opens
(``SnapshotStreamStore``) and the cached snapshot aspect
(``SnapshotAspectStore``, dropped on every re-frame). These commands do what
the phone's signed v2 ops did (``camera_devices``, ``set_snapshot_crop``,
``get_snapshot_crop``, ``snapshot_crops_status``, ``set_stream_entity``,
``get_stream_entity`` and ``send_test_notification``), over the WebSocket the
panel already holds, as the logged in admin. Every command is admin only, like
the rest of the panel: a crop changes what every alert of a camera shows, and
a test sends a real alert.

Commands:

    wrist_assistant/cameras/list  {}
    wrist_assistant/cameras/save  {entity_ids, viewport, open_zoomed?, stream_entity?}
    wrist_assistant/cameras/test  {camera, title?, message?}

Every refusal is a WebSocket error with a stable code: ``invalid`` (a bad
payload), ``unavailable`` (the integration is not ready, or notifications are
not) or ``failed`` (delivery raised, with its message).
"""

from __future__ import annotations

import logging
import math
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.websocket_api import ActiveConnection
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError

from .camera_devices import build_camera_device_groups, resolve_stream_sibling
from .camera_stream import ViewportState
from .const import DOMAIN
from .notifications import is_iphone_entry, resolve_push_routes

_LOGGER = logging.getLogger(__name__)

_CMD_LIST = f"{DOMAIN}/cameras/list"
_CMD_SAVE = f"{DOMAIN}/cameras/save"
_CMD_TEST = f"{DOMAIN}/cameras/test"

_DEFAULT_TEST_TITLE = "Test notification"
_DEFAULT_TEST_MESSAGE = "Camera framing test"


def _domain_data(hass: HomeAssistant) -> Any:
    return hass.data.get(DOMAIN)


def _user_id(connection: ActiveConnection) -> str | None:
    user = getattr(connection, "user", None)
    return user.id if user is not None else None


def _is_camera(value: Any) -> bool:
    return isinstance(value, str) and value.startswith("camera.") and len(value) > len("camera.")


@callback
def async_register_camera_framing_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_cameras_list)
    websocket_api.async_register_command(hass, ws_cameras_save)
    websocket_api.async_register_command(hass, ws_cameras_test)


# ── list ─────────────────────────────────────────────────────────────────


def _stream_choices(all_ids: list[str]) -> list[str]:
    """The variants a person may pick as the stream a tapped alert opens.

    The phone's picker rows: every variant whose id does not say "snapshot"
    (a still cannot open as a live stream), or all of them when that would
    leave none.
    """
    streams = [entity_id for entity_id in all_ids if "snapshot" not in entity_id]
    return streams or list(all_ids)


def _camera_row(
    hass: HomeAssistant, data: Any, entity_id: str, name: str, all_ids: list[str]
) -> dict[str, Any]:
    crop_store = data.snapshot_crop_store
    crop = crop_store.get(entity_id)
    return {
        "entity_id": entity_id,
        "name": name,
        "all_entity_ids": all_ids,
        "viewport": (
            {"x": crop.x, "y": crop.y, "w": crop.w, "h": crop.h} if crop is not None else None
        ),
        "open_zoomed": crop_store.get_open_zoomed(entity_id),
        "stream": {
            "override": data.snapshot_stream_store.get(entity_id),
            "auto": resolve_stream_sibling(hass, entity_id),
        },
        "stream_choices": _stream_choices(all_ids),
    }


def _state_name(state: Any) -> str:
    name = getattr(state, "name", None)
    if isinstance(name, str) and name:
        return name
    friendly = (getattr(state, "attributes", None) or {}).get("friendly_name")
    if isinstance(friendly, str) and friendly:
        return friendly
    return state.entity_id


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): _CMD_LIST})
@callback
def ws_cameras_list(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Every camera of the home, one row per physical camera (per lens).

    Result: {"cameras": [{"entity_id", "name", "all_entity_ids", "viewport",
             "open_zoomed", "stream": {"override", "auto"},
             "stream_choices"}]}

    Built as the phone built its list. Cameras come grouped by device
    (``build_camera_device_groups``). A row's ``entity_id`` is the variant an
    alert's image comes from and the one its framing is read from: the HD
    stream, else the SD stream, else the device's first camera.
    ``all_entity_ids`` is every variant of the device, the ones a save writes
    to. A camera Home Assistant has no registry entry for (one set up without
    a unique id) is not in any device, so it is a row of its own, named as
    its state names it; the phone showed such cameras only when no camera at
    all had a device.

    ``viewport`` is the saved crop, null for the full frame. ``stream`` is
    the saved override for the live stream a tapped alert opens (null when
    none) and the one picked without it (null when no device knows the
    camera). Rows are sorted by name.
    """
    data = _domain_data(hass)
    if (
        data is None
        or getattr(data, "snapshot_crop_store", None) is None
        or getattr(data, "snapshot_stream_store", None) is None
    ):
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return

    cameras: list[dict[str, Any]] = []
    covered: set[str] = set()
    for group in build_camera_device_groups(hass):
        group_ids = [e for e in group.get("all_entity_ids") or [] if isinstance(e, str)]
        roles = group.get("entities") or {}
        entity_id = roles.get("hd_stream") or roles.get("sd_stream") or (
            group_ids[0] if group_ids else None
        )
        if not entity_id:
            continue
        all_ids = group_ids or [entity_id]
        covered.update(all_ids)
        cameras.append(
            _camera_row(hass, data, entity_id, group.get("name") or entity_id, all_ids)
        )

    for state in hass.states.async_all("camera"):
        if state.entity_id in covered:
            continue
        covered.add(state.entity_id)
        cameras.append(
            _camera_row(hass, data, state.entity_id, _state_name(state), [state.entity_id])
        )

    cameras.sort(key=lambda row: (row["name"].lower(), row["entity_id"]))
    connection.send_result(msg["id"], {"cameras": cameras})


# ── save ─────────────────────────────────────────────────────────────────


def _number(raw: dict[str, Any], *keys: str, default: float) -> float:
    """The first of ``keys`` present in ``raw`` as a finite number.

    Raises TypeError or ValueError for a value that is not one, so a bad
    payload is refused rather than read as the full frame (which would clear
    a crop).
    """
    for key in keys:
        if key in raw:
            value = raw[key]
            if isinstance(value, bool) or not isinstance(value, (int, float)):
                raise TypeError(key)
            value = float(value)
            if not math.isfinite(value):
                raise ValueError(key)
            return value
    return default


def _parse_viewport(raw: Any) -> ViewportState:
    """A crop as the v2 op read it: ``w``/``h`` or ``width``/``height``,
    each edge clamped to the frame. None is the full frame."""
    if raw is None:
        return ViewportState()
    if not isinstance(raw, dict):
        raise TypeError("viewport")
    return ViewportState(
        x=max(0.0, min(1.0, _number(raw, "x", default=0.0))),
        y=max(0.0, min(1.0, _number(raw, "y", default=0.0))),
        w=max(0.01, min(1.0, _number(raw, "w", "width", default=1.0))),
        h=max(0.01, min(1.0, _number(raw, "h", "height", default=1.0))),
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_SAVE,
        vol.Required("entity_ids"): [str],
        vol.Required("viewport"): vol.Any(None, dict),
        vol.Optional("open_zoomed"): bool,
        vol.Optional("stream_entity"): vol.Any(None, str),
    }
)
@callback
def ws_cameras_save(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Save a camera's framing to every variant of it.

    Result: {"ok": true, "count": n}

    ``entity_ids`` are the row's ``all_entity_ids``, every one a ``camera.``
    id, or the command is refused ``invalid`` and nothing is written. The crop
    goes to each, as ``set_snapshot_crop`` wrote it: a null or full frame
    ``viewport`` clears it, and each id's cached snapshot aspect is dropped so
    the next alert measures the new shape. ``open_zoomed`` is left alone when
    it is not sent (the store keeps it true only while a crop exists).
    ``stream_entity`` is left alone when it is not sent; null or "" clears the
    override, a ``camera.`` id sets it, anything else is ``invalid``. ``count``
    is how many distinct ids were written.
    """
    data = _domain_data(hass)
    crop_store = getattr(data, "snapshot_crop_store", None)
    aspect_store = getattr(data, "snapshot_aspect_store", None)
    stream_store = getattr(data, "snapshot_stream_store", None)
    if crop_store is None or aspect_store is None or stream_store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return

    raw_ids = msg.get("entity_ids")
    if not isinstance(raw_ids, list) or not raw_ids or not all(_is_camera(e) for e in raw_ids):
        connection.send_error(
            msg["id"], "invalid", "entity_ids must be one or more camera entity ids"
        )
        return
    entity_ids = list(dict.fromkeys(raw_ids))

    try:
        viewport = _parse_viewport(msg.get("viewport"))
    except (TypeError, ValueError):
        connection.send_error(
            msg["id"], "invalid", "viewport must be null or {x, y, w, h} numbers"
        )
        return

    open_zoomed = msg.get("open_zoomed")
    if open_zoomed is not None and not isinstance(open_zoomed, bool):
        connection.send_error(msg["id"], "invalid", "open_zoomed must be true or false")
        return

    change_stream = "stream_entity" in msg
    stream_entity = msg.get("stream_entity")
    if change_stream and stream_entity not in (None, "") and not _is_camera(stream_entity):
        connection.send_error(
            msg["id"], "invalid", "stream_entity must be a camera entity id, or null"
        )
        return

    for entity_id in entity_ids:
        crop_store.set(entity_id, viewport)
        # After set(), so the crop exists for the store's "true only with a
        # crop" rule.
        if open_zoomed is not None:
            crop_store.set_open_zoomed(entity_id, open_zoomed)
        aspect_store.delete(entity_id)
        if change_stream:
            if stream_entity:
                stream_store.set(entity_id, stream_entity)
            else:
                stream_store.delete(entity_id)

    _LOGGER.debug("Panel saved camera framing for %s", ", ".join(entity_ids))
    connection.send_result(msg["id"], {"ok": True, "count": len(entity_ids)})


# ── test ─────────────────────────────────────────────────────────────────


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): _CMD_TEST,
        vol.Required("camera"): str,
        vol.Optional("title"): str,
        vol.Optional("message"): str,
    }
)
@websocket_api.async_response
async def ws_cameras_test(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Send a real alert with the camera's snapshot to the caller's devices.

    Result: {"ok": bool, "sent": n, "reason"?: str}

    The same pipeline a doorbell alert takes (``_deliver_push``, as
    ``send_test_notification`` used it): the snapshot is captured with the
    saved crop applied, behind a real token authed URL. The targets follow
    the phone's old rule: the calling Home Assistant user's watches, each
    routed as a real alert is (a watch on mirror delivery reaches its iPhone
    that way), or the user's iPhones when the user has no watch here. Never
    both, so a phone behind a mirrored watch is not targeted a second time.
    ``ok`` is false with ``reason`` ``no_devices`` when that user has no
    device here at all, and ``no_push_token`` when none of the targets leads
    to a push token. A failed delivery is the error ``failed``.
    """
    camera = msg.get("camera")
    if not _is_camera(camera):
        connection.send_error(msg["id"], "invalid", "camera must be a camera entity id")
        return

    data = _domain_data(hass)
    secret_store = getattr(data, "widget_secret_store", None)
    if data is None or secret_store is None:
        connection.send_error(msg["id"], "unavailable", "integration not ready")
        return
    token_store = getattr(data, "notification_store", None)
    if token_store is None:
        connection.send_error(msg["id"], "unavailable", "notifications unavailable")
        return

    user_id = _user_id(connection)
    secrets = secret_store.all_entries
    bound = sorted(
        device_id
        for device_id, entry in secrets.items()
        if user_id is not None and getattr(entry, "user_id", None) == user_id
    )
    if not bound:
        connection.send_result(msg["id"], {"ok": False, "sent": 0, "reason": "no_devices"})
        return
    watches = [device_id for device_id in bound if not is_iphone_entry(secrets[device_id])]
    targets = watches or bound
    if not resolve_push_routes(
        secrets, token_store.all_entries, token_store.delivery_modes(), targets
    ):
        connection.send_result(
            msg["id"], {"ok": False, "sent": 0, "reason": "no_push_token"}
        )
        return

    title = msg.get("title")
    if not isinstance(title, str) or not title:
        title = _DEFAULT_TEST_TITLE
    message = msg.get("message")
    if not isinstance(message, str) or not message:
        message = _DEFAULT_TEST_MESSAGE

    # Lazy import: _deliver_push lives in the package __init__, which imports
    # this module during setup.
    from . import _deliver_push

    try:
        result = await _deliver_push(
            hass,
            data,
            title=title,
            message=message,
            image_source=camera,
            target_watch_ids=targets,
        )
    except HomeAssistantError as err:
        connection.send_error(msg["id"], "failed", str(err))
        return

    sent = result.get("sent", 0) if isinstance(result, dict) else 0
    _LOGGER.info(
        "Panel camera test for %s by user %s: sent %d to %d device(s)",
        camera,
        user_id,
        sent,
        len(targets),
    )
    connection.send_result(msg["id"], {"ok": sent > 0, "sent": sent})
