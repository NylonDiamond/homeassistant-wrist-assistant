// The names the 3.0.1 iPhone app gave settings that now live in the panel,
// so Find a setting still finds them for someone who learned the old names
// (R5-038). Each key is a catalog key (`watch-settings-catalog.json`) or a
// notification style key (`notification-style-keys.json`); a test keeps
// every key real. Only names the current label, help and choices do not
// already hold are listed.
//
// Some old settings now have a page of their own, Rooms and Voice, which the
// Settings page does not draw. A search that names one of them gets a line
// that points there (`otherScreensFor`).

import type { SettingDevice } from "./watch-settings.js";
import { matchesSearch } from "./watch-settings-nav.js";

/** The 3.0.1 iPhone names, by the key that holds the setting now. */
export const OLD_SETTING_NAMES: Readonly<Record<string, readonly string[]>> = {
  serverMode: ["Server mode", "Connection mode"],
  deltaTimeout: ["Timeout", "Delta timeout"],
  entityRadialVerticalQuickRadialGestureEnabled: ["Quick Radial Gesture", "Quick radial"],
  dismissControlsOnClose: ["Reset View on Exit", "Dismiss controls on close"],
  showControlEntityName: ["Show Entity Name", "Entity name"],
  showPendingAnimation: ["Pending Animation"],
  pendingAnimationDisabledDomains: ["Pending Animation", "Per-Domain Overrides"],
  motionGestureSensitivity: ["Motion Gestures"],
  motionGestureActionsJSON: ["Motion Gestures", "Gesture Actions"],
  showPageIndicator: ["Page Indicator"],
  pageTransitionStyle: ["Transition", "Page transition"],
  cameraStreamMode: ["Stream mode", "Camera stream"],
  cameraRefreshRate: ["Standard Rate", "Refresh rate"],
  cameraHDRefreshRate: ["HD Rate", "HD refresh rate"],
  cameraRefreshOnOpenDebounce: ["Debounce"],
  storedDeliveryMode: ["Delivery Mode"],
  useEntityTintColor: ["Match Entity Color", "Entity color"],
};

/** The old names of one setting, none for most. */
export function oldNamesOf(key: string): readonly string[] {
  return OLD_SETTING_NAMES[key] ?? [];
}

/** A page of its own that holds settings the Settings page does not draw. */
export interface OtherScreen {
  /** The screen's id in `WATCH_SCREENS`. */
  screen: "rooms" | "voice";
  /** The line the search shows. */
  text: string;
  /** The devices that have this page. */
  devices: readonly SettingDevice[];
  /** What a search can name to be sent there, old names included. */
  words: string;
}

export const OTHER_SCREENS: readonly OtherScreen[] = [
  {
    screen: "rooms",
    text: "Rooms, the room source sensor and Point Control with its live tile have their own page: Rooms.",
    devices: ["watch", "iphone"],
    words: "rooms, room, source sensor, presence, point control, point at, compass, live tile",
  },
  {
    screen: "voice",
    text: "Voice settings (Assist, the conversation agent, the text to speech engine, speakers and saved phrases) have their own page: Voice.",
    devices: ["watch"],
    words: "voice, assist, conversation agent, tts engine, text to speech, speak, speakers, saved phrases, dictation, listen",
  },
];

/** The other pages a search names, for this device. None with no terms. */
export function otherScreensFor(terms: readonly string[], device: SettingDevice): OtherScreen[] {
  if (terms.length === 0) return [];
  return OTHER_SCREENS.filter((o) => o.devices.includes(device) && matchesSearch(terms, [o.words]));
}
