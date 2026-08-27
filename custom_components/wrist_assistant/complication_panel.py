"""Sidebar panel registration for the custom complication editor.

The panel is a single prebuilt ES module (``frontend/wrist-assistant-panel.js``,
built from ``frontend/src`` by esbuild and committed so HACS installs need no
build step). HA serves it from a static path under ``/wrist_assistant_static``
and mounts it in the sidebar as a custom panel that receives the live ``hass``
object.

The module URL carries the integration version as a cache-buster: browsers
cache panel modules aggressively and a stale bundle after an upgrade is the
first thing users would otherwise report.
"""

from __future__ import annotations

import hashlib
import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

PANEL_URL_PATH = "wrist-assistant"
_STATIC_URL = f"/{DOMAIN}_static"
_BUNDLE_NAME = "wrist-assistant-panel.js"
_WEBCOMPONENT = "wrist-assistant-panel"


def _frontend_dir() -> Path:
    return Path(__file__).parent / "frontend"


def _bundle_digest(bundle: Path) -> str:
    return hashlib.sha256(bundle.read_bytes()).hexdigest()[:12]


async def async_register_panel(hass: HomeAssistant, version: str) -> None:
    bundle = _frontend_dir() / _BUNDLE_NAME
    if not bundle.is_file():
        _LOGGER.warning(
            "Complication panel bundle missing at %s; sidebar panel not registered",
            bundle,
        )
        return

    flag = f"{DOMAIN}_static_registered"
    if not hass.data.get(flag):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(_STATIC_URL, str(_frontend_dir()), cache_headers=True)]
        )
        hass.data[flag] = True

    # Cache-bust on the bundle's own content, not the integration version: a
    # dev deploy that only touches the JS would otherwise serve the browser's
    # stale copy until the next version bump.
    digest = await hass.async_add_executor_job(_bundle_digest, bundle)

    await panel_custom.async_register_panel(
        hass,
        webcomponent_name=_WEBCOMPONENT,
        frontend_url_path=PANEL_URL_PATH,
        module_url=f"{_STATIC_URL}/{_BUNDLE_NAME}?v={version}-{digest}",
        sidebar_title="Wrist Assistant",
        sidebar_icon="mdi:watch-variant",
        require_admin=True,
        config={"version": version},
    )


def async_remove_panel(hass: HomeAssistant) -> None:
    frontend.async_remove_panel(hass, PANEL_URL_PATH)
