"""Legacy v1 camera devices view, kept alive for v1 watch app builds.

`CameraDevicesView` is the bearer-authed GET endpoint at
`/api/wrist_assistant/camera/devices` used by app builds prior to the
v2 transport. The v2 watch transport drives the same grouping via
`op=camera_devices` on `/v2/action`. Both paths call the shared
`build_camera_device_groups` helper.

This file should be deleted in the release that retires v1 — it has no
callers inside the v2 codebase.
"""

from __future__ import annotations

from aiohttp.web import Request, Response

from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

from .camera_devices import build_camera_device_groups


class CameraDevicesView(HomeAssistantView):
    """GET endpoint returning camera devices grouped by physical device."""

    url = "/api/wrist_assistant/camera/devices"
    name = "api:wrist_assistant_camera_devices"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def get(self, request: Request) -> Response:
        devices = build_camera_device_groups(self._hass)
        return self.json({"devices": devices})
