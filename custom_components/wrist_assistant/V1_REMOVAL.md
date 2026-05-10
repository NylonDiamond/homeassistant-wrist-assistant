# Retiring v1 endpoints

This integration ships **two** watch transports side-by-side:

- **v2** — HMAC-signed traffic on `/api/wrist_assistant/v2/*` (the future).
- **v1** — bearer-authed legacy endpoints (kept alive for app builds prior to the v2 cutover).

The v1 surface is isolated in five files (`v1_*.py`) so it can be removed cleanly. This doc is the removal checklist.

## When to remove

Remove v1 once **all** of the following hold:

1. The v2 iOS/watch app build has been live on the App Store long enough that crash/usage telemetry shows v1 traffic has decayed (target: <1% of polls). Look for hits on `/api/watch/updates`, `/api/wrist_assistant/summary`, `/api/wrist_assistant/states_batch`, `/api/wrist_assistant/camera/*`, `/api/wrist_assistant/audio/upload`, `/api/wrist_assistant/notifications/register`, `/api/wrist_assistant/mass/*`, `/api/watch/remote_command`.
2. The minimum supported app version is bumped accordingly (`MIN_SUPPORTED_APP_PROTOCOL_VERSION` in `const.py` past `2`, or whatever the v3 wire version becomes).
3. You're cutting a release bumped past 2.x — typically a major version (e.g. 3.0.0). Removal is a breaking change for any user still on a v1 app build.

## What to delete

### Files (5)

```
custom_components/wrist_assistant/v1_api_views.py
custom_components/wrist_assistant/v1_audio_upload_views.py
custom_components/wrist_assistant/v1_camera_devices_views.py
custom_components/wrist_assistant/v1_camera_stream_views.py
custom_components/wrist_assistant/v1_notifications_views.py
```

```bash
rm custom_components/wrist_assistant/v1_*.py
rm custom_components/wrist_assistant/V1_REMOVAL.md
```

### Edits to `__init__.py` (2 blocks)

**1. Imports** — remove the six v1 import statements:

```python
from .v1_api_views import (
    MusicAssistantPlayersView,
    MusicAssistantQueueView,
    RemoteCommandView,
    WatchStatesBatchView,
    WatchSummaryView,
    WatchUpdatesView,
)
from .v1_audio_upload_views import AudioUploadView
from .v1_camera_devices_views import CameraDevicesView
from .v1_camera_stream_views import (
    CameraBatchView,
    CameraSnapshotView,
    CameraStreamView,
    CameraViewportView,
)
from .v1_notifications_views import NotificationRegisterView
```

**2. Registrations** — remove the `# Legacy v1 transport: ...` block inside `async_setup_entry`'s `_views_registered` guard (13 `register_view` calls plus the leading comment).

## Things that DO NOT need to change

The v1 files import private helpers from their paired v2 modules:

| v1 file | imports from |
|---|---|
| `v1_api_views.py` | `.api` (`_get_mass_client`, timeout constants) |
| `v1_camera_stream_views.py` | `.camera_stream` (parsers, `_process_frame`, `_process_snapshot`, `ViewportState`, `_UNSET`, constants) |
| `v1_camera_devices_views.py` | `.camera_devices` (`build_camera_device_groups`) |
| `v1_audio_upload_views.py` | `.audio_upload` (size + cleanup constants) |
| `v1_notifications_views.py` | (nothing — uses runtime data only) |

Deleting the v1 files makes those imports go away. **Do not delete or rename the helpers** — the v2 transport still uses them.

## Verification after removal

1. `python3 -c "import ast; ast.parse(open('custom_components/wrist_assistant/__init__.py').read())"` parses clean.
2. Restart HA with the integration loaded; watch for `ImportError` or `View not registered` in the log.
3. Hit `/api/wrist_assistant/version` (v2, unauthenticated) — should still return 200 with `wa_protocol_version: 2`.
4. Hit `/api/watch/updates` with a valid bearer — should now return **404** (the v1 view is gone).
5. Wire up a watch app on the latest build; long-poll, camera stream, voice broadcast, and remote-command flows all work via `/v2/*`.

## Why this exists

When the v2 transport was first written, the v1 view classes were deleted outright in the same branch. Shipping that to HACS would have broken every existing v1 app user the moment HA auto-updated the integration, well before the v2 app build cleared App Store review. Re-adding them as quarantined `v1_*.py` files preserved the v2 cleanup intact while keeping older clients working through the rollout.
