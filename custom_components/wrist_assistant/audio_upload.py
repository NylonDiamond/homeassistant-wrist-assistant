"""Constants for the watch's broadcast/intercom audio upload op.

The legacy bearer-authed `AudioUploadView` was removed when the watch
transport went pure-v2; the upload op now lives at `_op_audio_upload`
in `wa_v2_views.py` and reuses the size + cleanup constants below.
"""

from __future__ import annotations

# Maximum upload size: 100KB (voice clips are typically 10-20KB)
MAX_UPLOAD_SIZE = 100 * 1024

# Keep uploaded files for 5 minutes, then clean up
CLEANUP_AGE_SECONDS = 300
