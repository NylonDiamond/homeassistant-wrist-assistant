"""Legacy v1 notification registration view, kept alive for v1 watch app builds.

`NotificationRegisterView` is the bearer-authed POST endpoint at
`/api/wrist_assistant/notifications/register` used by app builds prior to
the v2 transport. The v2 watch transport drives the same registration via
`op=notifications_register` on `/v2/action`. Both paths write through
the shared `NotificationTokenStore`.

This file should be deleted in the release that retires v1 — it has no
callers inside the v2 codebase.
"""

from __future__ import annotations

import logging

from aiohttp.web import Request, Response

from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)


class NotificationRegisterView(HomeAssistantView):
    """POST endpoint to explicitly register a push notification token."""

    url = "/api/wrist_assistant/notifications/register"
    name = "api:wrist_assistant_notification_register"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def post(self, request: Request) -> Response:
        """Register a device token."""
        from .const import DOMAIN, WristAssistantData

        domain_data: WristAssistantData | None = self._hass.data.get(DOMAIN)
        if domain_data is None:
            return self.json_message("Integration not loaded", status_code=503)
        store = domain_data.notification_store

        try:
            payload = await request.json()
        except (ValueError, UnicodeDecodeError):
            return self.json_message("Invalid JSON body", status_code=400)

        if not isinstance(payload, dict):
            return self.json_message("Expected JSON object", status_code=400)

        watch_id = payload.get("watch_id")
        device_token = payload.get("device_token")
        platform = payload.get("platform", "watchos")
        environment = payload.get("environment", "production")

        if not isinstance(watch_id, str) or not watch_id:
            return self.json_message("watch_id is required", status_code=400)
        if not isinstance(device_token, str) or not device_token:
            return self.json_message("device_token is required", status_code=400)

        store.register(
            watch_id, device_token, platform=platform, environment=environment
        )
        return self.json({"status": "ok"})
