// Home's Library: the side bar section over the whole home's screens (HTTP
// actions and Cameras) and the row over those screens.

import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import { HOME_LIBRARY_LEAD, HOME_LIBRARY_TITLE, HOME_SHARED_SUB, homeLibraryScreens } from "../src/home.js";
import { screenHowTo } from "../src/screen-howto.js";
import { WATCH_SCREENS, tabOfRoute, watchScreenOf } from "../src/shell.js";
import { SHARED_ROW_LABEL, type WatchRowInput, renderWatchRow, sharedRowLinks } from "../src/watch-row.js";

const route = (path: string) => ({ prefix: "/wrist-assistant", path });

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

const owner = (o: Partial<OwnerSummary>): OwnerSummary => ({
  owner_watch_id: "x",
  device_name: "Apple Watch",
  device_kind: "watch",
  paired_iphone_name: null,
  app_version: "3.0.0",
  screen_size: null,
  complication_count: 0,
  token: 3,
  applied_token: 3,
  is_orphan: false,
  ...o,
} as OwnerSummary);

const OWNERS = [
  owner({ owner_watch_id: "w1", device_name: "Jesse's Watch" }),
  owner({ owner_watch_id: "p1", device_name: "Jesse's iPhone", device_kind: "iphone" }),
];

describe("Home's Library", () => {
  it("is the side bar section of the whole home's screens, with its own line", () => {
    expect(HOME_LIBRARY_TITLE).toBe("Library");
    expect(HOME_LIBRARY_LEAD).toBe("Building blocks your devices' pages and menus point at.");
    expect(homeLibraryScreens().map((s) => s.id)).toEqual(["http-actions", "cameras"]);
    for (const screen of homeLibraryScreens()) {
      expect(HOME_SHARED_SUB[screen.id], screen.id).toBeTruthy();
      expect(screen.shared).toBe(true);
      expect(screenHowTo(screen.id), screen.id).toBeDefined();
    }
    expect(Object.keys(HOME_SHARED_SUB)).toEqual(["http-actions", "cameras"]);
  });

  it("names the row over its screens Library, with the Home button and each screen", () => {
    expect(SHARED_ROW_LABEL).toBe(HOME_LIBRARY_TITLE);
    const input: WatchRowInput = {
      route: route("/cameras"), owners: OWNERS, watch: "w1", loaded: true, menuOpen: false,
      onMenu: () => undefined, onPick: () => undefined, onGo: () => undefined, onHome: () => undefined,
    };
    const text = flat(renderWatchRow(input));
    expect(text).toContain(`<span class="wa-wr-shared">Library</span>`);
    expect(text).toContain(`class="wa-wr-home"`);
    expect(text).toContain("Back to Home");
    for (const label of ["HTTP actions", "Cameras"]) expect(text).toContain(`>${label}</a>`);
    for (const label of ["Photos", "Parts"]) expect(text).not.toContain(`>${label}</a>`);
    expect(text).not.toContain("wa-wr-picker");
    expect(sharedRowLinks(route("/cameras")).filter((l) => l.on).map((l) => l.screen.id)).toEqual(["cameras"]);
  });

  it("has no Photos or Parts screen: those addresses are no screen and open Home", () => {
    for (const id of ["photos", "parts"]) {
      expect(WATCH_SCREENS.some((s) => (s.id as string) === id)).toBe(false);
      expect(screenHowTo(id)).toBeUndefined();
    }
    for (const path of ["/photos", "/parts"]) {
      expect(watchScreenOf(route(path))).toBeUndefined();
      expect(tabOfRoute(route(path))).toBe("home");
    }
  });
});
