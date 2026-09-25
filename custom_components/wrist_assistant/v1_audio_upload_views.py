"""Legacy v1 audio upload view, kept alive for v1 watch app builds.

`AudioUploadView` is the bearer-authed POST endpoint at
`/api/wrist_assistant/audio/upload` used by app builds prior to the
v2 transport. The v2 watch transport drives the same upload via
`_op_audio_upload` in `wa_v2_views.py`. Both paths share the naming,
size and cleanup rules in `audio_upload.py`.

This file should be deleted in the release that retires v1 — it has
no callers inside the v2 codebase.
"""

from __future__ import annotations

import logging

from aiohttp.web import Request, Response

from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

from .audio_upload import MAX_UPLOAD_SIZE, async_cleanup_clips, async_save_clip

_LOGGER = logging.getLogger(__name__)


class AudioUploadView(HomeAssistantView):
    """POST endpoint to receive audio clips from the watch for broadcast."""

    url = "/api/wrist_assistant/audio/upload"
    name = "api:wrist_assistant_audio_upload"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def post(self, request: Request) -> Response:
        """Receive an audio file and store it in /config/www/wrist_assistant/."""
        # Clean up old files in the background
        self._hass.async_create_task(async_cleanup_clips(self._hass))

        content_length = request.content_length or 0
        if content_length > MAX_UPLOAD_SIZE:
            return self.json_message("File too large", status_code=413)

        body = await request.read()
        if len(body) > MAX_UPLOAD_SIZE:
            return self.json_message("File too large", status_code=413)

        if not body:
            return self.json_message("Empty body", status_code=400)

        filename, local_url = await async_save_clip(self._hass, body)
        return self.json({"url": local_url, "filename": filename, "size": len(body)})
