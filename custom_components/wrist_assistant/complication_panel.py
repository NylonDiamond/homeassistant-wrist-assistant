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


async def _async_serve_bundle_directory(hass: HomeAssistant) -> bool:
    """Expose the bundle directory at ``_STATIC_URL``. False when we cannot.

    ``StaticPathConfig`` and ``async_register_static_paths`` arrived in HA
    2024.7.0, which is the floor this integration declares. The import is done
    here rather than at module scope so an older core loses only the panel: an
    ``ImportError`` at the top of this module would travel up through
    ``__init__.py`` and take the whole integration down at import time, with
    nothing in the log to say why.
    """
    try:
        from homeassistant.components.http import StaticPathConfig
    except ImportError:
        register = getattr(hass.http, "register_static_path", None)
        if register is None:
            _LOGGER.warning(
                "This Home Assistant core can serve neither static path style; "
                "the Wrist Assistant panel is not available"
            )
            return False
        _LOGGER.warning(
            "Home Assistant core is older than 2024.7.0; serving the Wrist "
            "Assistant panel through the deprecated blocking static path"
        )
        register(_STATIC_URL, str(_frontend_dir()), True)
        return True

    await hass.http.async_register_static_paths(
        [StaticPathConfig(_STATIC_URL, str(_frontend_dir()), cache_headers=True)]
    )
    return True


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
        if not await _async_serve_bundle_directory(hass):
            return
        hass.data[flag] = True

    # Cache-bust on the bundle's own content, not the integration version: a
    # dev deploy that only touches the JS would otherwise serve the browser's
    # stale copy until the next version bump.
    digest = await hass.async_add_executor_job(_bundle_digest, bundle)

    # `panel_custom.async_register_panel` raises ValueError when the path is
    # already registered, so drop the previous registration first. A second
    # `async_setup_entry` without an intervening unload (a reload that failed
    # halfway, a second config entry) would otherwise fail setup over a
    # sidebar entry. The try/except is the belt to that brace: whatever else
    # panel registration ever refuses, it must not be what stops the watch
    # from talking to Home Assistant.
    frontend.async_remove_panel(hass, PANEL_URL_PATH, warn_if_unknown=False)
    try:
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
    except ValueError as err:
        _LOGGER.warning("Wrist Assistant sidebar panel not registered: %s", err)


def async_remove_panel(hass: HomeAssistant) -> None:
    frontend.async_remove_panel(hass, PANEL_URL_PATH)
