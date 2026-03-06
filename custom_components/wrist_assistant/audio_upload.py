"""Audio upload endpoint for Wrist Assistant broadcast/intercom feature."""

from __future__ import annotations

import logging
import os
import time
import asyncio
from pathlib import Path

from aiohttp.web import Request, Response

from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

# Maximum upload size: 100KB (voice clips are typically 10-20KB)
MAX_UPLOAD_SIZE = 100 * 1024

# Keep uploaded files for 5 minutes, then clean up
CLEANUP_AGE_SECONDS = 300


class AudioUploadView(HomeAssistantView):
    """POST endpoint to receive audio clips from the watch for broadcast."""

    url = "/api/wrist_assistant/audio/upload"
    name = "api:wrist_assistant_audio_upload"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def post(self, request: Request) -> Response:
        """Receive an audio file and store it in /config/www/wrist_assistant/."""
        www_dir = Path(self._hass.config.path("www", "wrist_assistant"))
        await self._hass.async_add_executor_job(www_dir.mkdir, 0o755, True, True)

        # Clean up old files in the background
        self._hass.async_create_task(self._cleanup_old_files(www_dir))

        content_length = request.content_length or 0
        if content_length > MAX_UPLOAD_SIZE:
            return self.json_message("File too large", status_code=413)

        body = await request.read()
        if len(body) > MAX_UPLOAD_SIZE:
            return self.json_message("File too large", status_code=413)

        if not body:
            return self.json_message("Empty body", status_code=400)

        timestamp = int(time.time() * 1000)
        filename = f"broadcast_{timestamp}.m4a"
        file_path = www_dir / filename

        await self._hass.async_add_executor_job(file_path.write_bytes, body)

        # Build the URL the media player can fetch
        local_url = f"/local/wrist_assistant/{filename}"

        _LOGGER.debug("Audio upload saved: %s (%d bytes)", filename, len(body))

        return self.json({"url": local_url, "filename": filename, "size": len(body)})

    async def _cleanup_old_files(self, directory: Path) -> None:
        """Remove audio files older than CLEANUP_AGE_SECONDS."""
        try:
            now = time.time()
            for f in await self._hass.async_add_executor_job(
                lambda: list(directory.glob("broadcast_*.m4a"))
            ):
                stat = await self._hass.async_add_executor_job(os.stat, f)
                if now - stat.st_mtime > CLEANUP_AGE_SECONDS:
                    await self._hass.async_add_executor_job(f.unlink, True)
                    _LOGGER.debug("Cleaned up old audio file: %s", f.name)
        except Exception:
            _LOGGER.debug("Audio cleanup error", exc_info=True)
