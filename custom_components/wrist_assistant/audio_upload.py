"""The watch's broadcast/intercom audio upload: naming, storage, cleanup.

The upload op lives at `_op_audio_upload` in `wa_v2_views.py` (and, until v1
is retired, at the bearer-authed `AudioUploadView`). Both save the clip under
`/config/www/wrist_assistant/`, which Home Assistant serves at
`/local/wrist_assistant/` without authentication, because a media player has
to be able to fetch the clip with a plain GET.

That folder being public is why the file name is random: a name built from
the upload time could be found by walking the clock. A 144-bit token cannot
be guessed, so the URL is only known to the watch that uploaded it and the
player it hands it to. Clips are short-lived either way: `async_cleanup_clips`
runs on every upload and on a timer, and deletes anything older than
`CLEANUP_AGE_SECONDS`.
"""

from __future__ import annotations

import logging
import os
import secrets
import time
from pathlib import Path

from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

# Maximum upload size: 100KB (voice clips are typically 10-20KB)
MAX_UPLOAD_SIZE = 100 * 1024

# Keep uploaded files for 5 minutes, then clean up
CLEANUP_AGE_SECONDS = 300

# How often the timer sweep runs. Anything left behind by the last upload's
# sweep is gone within CLEANUP_AGE_SECONDS + this.
CLEANUP_INTERVAL_SECONDS = 120

_CLIP_PREFIX = "broadcast_"
_CLIP_SUFFIX = ".m4a"


def clips_dir(hass: HomeAssistant) -> Path:
    """The public folder the clips are written to."""
    return Path(hass.config.path("www", "wrist_assistant"))


def new_clip_filename() -> str:
    """An unguessable clip name, `broadcast_<token>.m4a`."""
    return f"{_CLIP_PREFIX}{secrets.token_urlsafe(18)}{_CLIP_SUFFIX}"


def clip_url(filename: str) -> str:
    """The `/local/` URL a media player fetches the clip from."""
    return f"/local/wrist_assistant/{filename}"


async def async_save_clip(hass: HomeAssistant, audio: bytes) -> tuple[str, str]:
    """Write `audio` to a fresh random name; return `(filename, url)`."""
    directory = clips_dir(hass)
    await hass.async_add_executor_job(directory.mkdir, 0o755, True, True)
    filename = new_clip_filename()
    await hass.async_add_executor_job((directory / filename).write_bytes, audio)
    _LOGGER.debug("Audio upload saved: %s (%d bytes)", filename, len(audio))
    return filename, clip_url(filename)


def _sweep(directory: Path, now: float) -> int:
    removed = 0
    if not directory.is_dir():
        return 0
    for path in directory.glob(f"{_CLIP_PREFIX}*{_CLIP_SUFFIX}"):
        try:
            if now - os.stat(path).st_mtime > CLEANUP_AGE_SECONDS:
                path.unlink(missing_ok=True)
                removed += 1
        except OSError:
            _LOGGER.debug("Could not remove audio clip %s", path.name, exc_info=True)
    return removed


async def async_cleanup_clips(hass: HomeAssistant) -> None:
    """Delete every clip older than CLEANUP_AGE_SECONDS. Never raises."""
    try:
        removed = await hass.async_add_executor_job(
            _sweep, clips_dir(hass), time.time()
        )
        if removed:
            _LOGGER.debug("Cleaned up %d old audio clip(s)", removed)
    except Exception:  # noqa: BLE001
        _LOGGER.debug("Audio cleanup error", exc_info=True)
