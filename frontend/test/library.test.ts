// Home's Library: the side bar section over the whole home's screens, the
// row over those screens, the Photos and Parts screens' routes, and their
// words (`library/model.ts`).

import { describe, expect, it } from "vitest";

import type { OwnerSummary, PageImageEntry } from "../src/ha-api.js";
import { HOME_LIBRARY_LEAD, HOME_LIBRARY_TITLE, HOME_SHARED_SUB, homeLibraryScreens } from "../src/home.js";
import { LIBRARY_PARTS_PATH, LIBRARY_PHOTOS_PATH, isLibraryPartsRoute, isLibraryPhotosRoute } from "../src/library/hook.js";
import {
  PHOTO_DELETE_QUESTION,
  libraryBytes,
  partBytes,
  partDeleteQuestion,
  partFactsText,
  photoDeleteBlocked,
  photoFactsText,
  photoUseText,
} from "../src/library/model.js";
import { screenHowTo } from "../src/screen-howto.js";
import { WATCH_SCREENS, screenIdOf, watchScreenOf } from "../src/shell.js";
import { SHARED_ROW_LABEL, WATCH_SCREEN_LOOK, type WatchRowInput, renderWatchRow, sharedRowLinks } from "../src/watch-row.js";

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
  owner({ owner_watch_id: "w2", device_name: "Chen's Watch" }),
];

describe("Home's Library", () => {
  it("is the side bar section of the whole home's screens, with its own line", () => {
    expect(HOME_LIBRARY_TITLE).toBe("Library");
    expect(HOME_LIBRARY_LEAD).toBe("Building blocks your devices' pages and menus point at.");
    expect(homeLibraryScreens().map((s) => s.id)).toEqual(["http-actions", "cameras", "photos", "parts"]);
    for (const screen of homeLibraryScreens()) {
      expect(HOME_SHARED_SUB[screen.id], screen.id).toBeTruthy();
      expect(screen.shared).toBe(true);
    }
    expect(homeLibraryScreens().some((s) => s.retired === true)).toBe(false);
  });

  it("names the row over its screens Library, with the Home button and each screen", () => {
    expect(SHARED_ROW_LABEL).toBe(HOME_LIBRARY_TITLE);
    const input: WatchRowInput = {
      route: route("/photos"), owners: OWNERS, watch: "w1", loaded: true, menuOpen: false,
      onMenu: () => undefined, onPick: () => undefined, onGo: () => undefined, onHome: () => undefined,
    };
    const text = flat(renderWatchRow(input));
    expect(text).toContain(`<span class="wa-wr-shared">Library</span>`);
    expect(text).toContain(`class="wa-wr-home"`);
    expect(text).toContain("Back to Home");
    for (const label of ["HTTP actions", "Cameras", "Photos", "Parts"]) expect(text).toContain(`>${label}</a>`);
    expect(text).not.toContain("wa-wr-picker");
    expect(sharedRowLinks(route("/photos")).filter((l) => l.on).map((l) => l.screen.id)).toEqual(["photos"]);
  });

  it("gives Photos and Parts a glyph, a hue and a how-to of their own", () => {
    expect(WATCH_SCREEN_LOOK.photos).toEqual({ icon: "image", hue: "var(--wa-hue-pink)" });
    expect(WATCH_SCREEN_LOOK.parts).toEqual({ icon: "layers", hue: "var(--wa-hue-yellow)" });
    expect(screenHowTo("photos")?.art).toBe("photo");
    expect(screenHowTo("parts")?.label).toBe("In the editor");
  });
});

describe("the Photos and Parts routes", () => {
  it("answers each screen's address and nothing near it", () => {
    expect(LIBRARY_PHOTOS_PATH).toBe("/photos");
    expect(LIBRARY_PARTS_PATH).toBe("/parts");
    expect(isLibraryPhotosRoute(route("/photos"))).toBe(true);
    expect(isLibraryPhotosRoute(route("/photos/anything"))).toBe(true);
    expect(isLibraryPhotosRoute(route("/photosx"))).toBe(false);
    expect(isLibraryPartsRoute(route("/parts"))).toBe(true);
    expect(isLibraryPartsRoute(route("/pages"))).toBe(false);
    expect(isLibraryPartsRoute(undefined)).toBe(false);
    expect(watchScreenOf(route("/photos"))?.id).toBe("photos");
    expect(watchScreenOf(route("/parts"))?.id).toBe("parts");
    expect(screenIdOf(route("/parts"))).toBe("parts");
    expect(WATCH_SCREENS.find((s) => s.id === "photos")?.path).toBe(LIBRARY_PHOTOS_PATH);
  });
});

describe("the Photos screen's words", () => {
  const NOW = Date.parse("2026-10-16T12:00:00Z");
  const photo = (used_by: string[]): PageImageEntry => ({
    id: "P1", width: 640, height: 480, bytes: 84_213, added_at: "2026-10-13T12:00:00Z", used_by,
  });

  it("says which devices' pages show a photo", () => {
    expect(photoUseText(photo([]), OWNERS)).toBe("Not on any page");
    expect(photoUseText(photo(["w1"]), OWNERS)).toBe("On Jesse's Watch");
    expect(photoUseText(photo(["w1", "p1"]), OWNERS)).toBe("On Jesse's Watch and Jesse's iPhone");
    expect(photoUseText(photo(["w1", "p1", "w2"]), OWNERS)).toBe("On 3 devices");
    expect(photoUseText(photo(["gone"]), OWNERS)).toBe("On another device");
  });

  it("gives its size and when it came", () => {
    expect(photoFactsText(photo([]), NOW)).toBe("640 × 480 · 84.2 KB · added 3 days ago");
    expect(photoFactsText({ ...photo([]), added_at: "" }, NOW)).toBe("640 × 480 · 84.2 KB");
  });

  it("keeps Delete off while a page shows the photo, and asks before one goes", () => {
    expect(photoDeleteBlocked(photo([]))).toBeUndefined();
    expect(photoDeleteBlocked(photo(["w1"]))).toMatch(/^A page shows this photo\./);
    expect(PHOTO_DELETE_QUESTION).toBe("Delete this photo? It cannot be brought back.");
  });
});

describe("the Parts screen's words", () => {
  const NOW = Date.parse("2026-10-16T12:00:00Z");

  it("sizes a part by its text and says when it was saved", () => {
    const part = { text: "é".repeat(1200), updated_at: "2026-10-16T11:58:00Z" };
    expect(partBytes(part)).toBe(2400);
    expect(partFactsText(part, NOW)).toBe("Saved 2 min ago · 2.4 KB");
    expect(partFactsText({ text: "abc", updated_at: "" }, NOW)).toBe("3 bytes");
  });

  it("asks before a part goes, and says complications keep what they took", () => {
    expect(partDeleteQuestion("Clock")).toBe(`Delete the part "Clock"? Complications it went into keep their layers.`);
  });

  it("writes sizes the way the editors do", () => {
    expect(libraryBytes(640)).toBe("640 bytes");
    expect(libraryBytes(1000)).toBe("1 KB");
    expect(libraryBytes(Number.NaN)).toBe("");
  });
});
