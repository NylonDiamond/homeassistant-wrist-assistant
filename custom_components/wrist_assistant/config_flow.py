"""Config flow for Wrist Assistant."""

from __future__ import annotations

from homeassistant.config_entries import ConfigFlow

from .const import DOMAIN

# Linked from the setup step. Home Assistant wants URLs in placeholders, not in
# the translation strings themselves.
SETUP_GUIDE_URL = "https://docs.wrist-assistant.com/getting-started/setup/"


class WristAssistantConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Wrist Assistant."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Handle the initial step."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            return self.async_create_entry(
                title="Wrist Assistant",
                data={},
            )

        return self.async_show_form(
            step_id="user",
            description_placeholders={"docs_url": SETUP_GUIDE_URL},
        )
