// Find a setting knows the 3.0.1 iPhone names (R5-038): every old name
// points at a key the panel still draws, the names from the audit find a
// setting, and the settings that moved to Rooms and Voice point there.

import { describe, expect, it } from "vitest";

import catalog from "../src/watch-settings-catalog.json";
import styleKeys from "../src/watch-notification-style/notification-style-keys.json";
import { searchTerms } from "../src/watch-settings-nav.js";
import { OLD_SETTING_NAMES, oldNamesOf, otherScreensFor } from "../src/watch-settings-old-names.js";
import { WATCH_SCREENS, screenTakesPhone } from "../src/shell.js";

const catalogKeys = new Set(catalog.sections.flatMap((s) => s.settings.map((x) => x.key)));
const styleRowKeys = new Set(Object.keys(styleKeys.keys));

describe("the 3.0.1 setting names", () => {
  it("name only keys the page draws", () => {
    for (const key of Object.keys(OLD_SETTING_NAMES)) {
      expect(catalogKeys.has(key) || styleRowKeys.has(key), key).toBe(true);
    }
  });

  // The old names the audit typed in that found nothing.
  const settings = [
    "Server mode", "Timeout", "Quick Radial Gesture", "Reset View on Exit", "Show Entity Name",
    "Pending Animation", "Per-Domain Overrides", "Motion Gestures", "Gesture Actions", "Page Indicator",
    "Transition", "Stream mode", "Standard Rate", "HD Rate", "Debounce", "Delivery Mode", "Match Entity Color",
  ];
  it.each(settings)("%s finds a setting", (name) => {
    const terms = searchTerms(name);
    const hit = Object.keys(OLD_SETTING_NAMES).some((key) =>
      oldNamesOf(key).some((n) => terms.every((t) => n.toLowerCase().includes(t))));
    expect(hit).toBe(true);
  });

  it.each(["Source sensor", "Live Tile", "Rooms", "point control"])("%s points to Rooms", (name) => {
    expect(otherScreensFor(searchTerms(name), "watch").map((o) => o.screen)).toEqual(["rooms"]);
    expect(otherScreensFor(searchTerms(name), "iphone").map((o) => o.screen)).toEqual(["rooms"]);
  });

  it.each(["Conversation Agent", "TTS Engine", "Speakers", "Phrase", "Voice"])("%s points to Voice on a watch", (name) => {
    expect(otherScreensFor(searchTerms(name), "watch").map((o) => o.screen)).toEqual(["voice"]);
  });

  it("sends an iPhone only to pages an iPhone has", () => {
    for (const name of ["Conversation Agent", "Source sensor"]) {
      for (const o of otherScreensFor(searchTerms(name), "iphone")) {
        const screen = WATCH_SCREENS.find((w) => w.id === o.screen);
        expect(screen && screenTakesPhone(screen)).toBe(true);
      }
    }
  });

  it("points nowhere with no search, or for a plain setting", () => {
    expect(otherScreensFor([], "watch")).toEqual([]);
    expect(otherScreensFor(searchTerms("camera"), "watch")).toEqual([]);
  });
});
