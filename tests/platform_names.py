"""The names the in-process op tests give `wa_v2_views.py`'s handlers so the
platform words resolve: the real ``device_platform.py`` and the helpers in
`wa_v2_views.py` that read it (``_entry_platform``, ``_caller_runs_android``,
``_phone_noun``, ``_a_phone``).

A harness adds ``PLATFORM_HELPERS`` to the handler names it pulls out of the
module, and ``platform_namespace()`` to the namespace it runs them in.
"""

from __future__ import annotations

import importlib.util
from pathlib import Path
from typing import Any

_FILE = (
    Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant" / "device_platform.py"
)

PLATFORM_HELPERS = ("_entry_platform", "_caller_runs_android", "_phone_noun", "_a_phone")


def device_platform_module() -> Any:
    spec = importlib.util.spec_from_file_location("wa_device_platform_for_ops", _FILE)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def platform_namespace() -> dict[str, Any]:
    mod = device_platform_module()
    return {
        "FCM_PLATFORMS": mod.FCM_PLATFORMS,
        "default_platform": mod.default_platform,
        "resolve_platform": mod.resolve_platform,
    }
