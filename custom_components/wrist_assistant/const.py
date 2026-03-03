"""Constants for Wrist Assistant delta API integration."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry

    from .api import DeltaCoordinator, PairingCoordinator
    from .apns_client import APNsClient
    from .apns_config import APNsConfigStore
    from .camera_stream import CameraStreamCoordinator
    from .notifications import NotificationTokenStore


@dataclass
class WristAssistantData:
    """Runtime data for the Wrist Assistant integration."""

    coordinator: DeltaCoordinator
    pairing_coordinator: PairingCoordinator
    camera_stream_coordinator: CameraStreamCoordinator
    notification_store: NotificationTokenStore
    apns_config_store: APNsConfigStore
    apns_client: APNsClient | None = field(default=None)


type WristAssistantConfigEntry = ConfigEntry[WristAssistantData]

DOMAIN = "wrist_assistant"
PLATFORMS = ["sensor", "binary_sensor", "text"]
NOTIFICATION_TOKEN_STORAGE_KEY = "wrist_assistant.notification_tokens"
NOTIFICATION_TOKEN_STORAGE_VERSION = 1
APNS_CONFIG_STORAGE_KEY = "wrist_assistant.apns_config"
APNS_CONFIG_STORAGE_VERSION = 1
