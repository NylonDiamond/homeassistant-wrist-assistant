// A page's five keys for the page switcher, in the menu editor's card "In
// the page switcher": hidden or not, text or icon, the name, the icon and the
// color there. Each absent reads as the watch's own pick; the setters write
// them as the phone does and every other key stays.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { findWatchPage } from "../src/watch-pages/edit.js";
import type { WatchPage, WatchPagesDocument } from "../src/watch-pages/model.js";
import pageKeys from "../src/watch-pages/page-keys.json";
import {
  WATCH_PAGE_STYLING_SETTERS,
  WATCH_PAGE_SWITCHER_MODES,
  setWatchPageHideFromSwitcher,
  setWatchPageSwitcherColor,
  setWatchPageSwitcherDisplayMode,
  setWatchPageSwitcherIcon,
  setWatchPageSwitcherText,
  watchPageSettings,
} from "../src/watch-pages/page-settings-model.js";

const PAGE = "C3A0E000-0000-4000-8000-0000000000AA";

function doc(extra: Record<string, unknown> = {}): WatchPagesDocument {
  return {
    schemaVersion: 1,
    pages: [{ hideFromSwitcher: false, id: PAGE, items: [], name: "Living", ...extra }],
  };
}

const pageOf = (d: WatchPagesDocument): WatchPage => findWatchPage(d, PAGE)!;
const isSorted = (o: object) => Object.keys(o).every((k, i, all) => i === 0 || all[i - 1]! < k);

describe("the page switcher keys", () => {
  it("are the five page-keys.json lists, with its display modes", () => {
    const keys = (pageKeys as unknown as { types: { page: { keys: Record<string, { type: string; enum?: string }> } } }).types.page.keys;
    for (const key of ["switcherIcon", "switcherColor", "switcherText", "switcherDisplayMode", "hideFromSwitcher"]) {
      expect(keys[key], key).toBeDefined();
      expect(Object.hasOwn(WATCH_PAGE_STYLING_SETTERS, key), key).toBe(true);
    }
    expect(WATCH_PAGE_SWITCHER_MODES).toEqual(["text", "icon"]);
  });

  it("read as the watch's own picks while absent", () => {
    const s = watchPageSettings(pageOf(doc()));
    expect(s).toMatchObject({ hideFromSwitcher: false, switcherIcon: undefined, switcherColor: undefined, switcherText: undefined, switcherDisplayMode: undefined });
  });

  it("read the phone's fixture as written", () => {
    const fixture = JSON.parse(readFileSync(join(__dirname, "fixtures-pages", "05-pages.json"), "utf8")) as WatchPagesDocument;
    const guests = (fixture.pages as WatchPage[]).find((p) => p.switcherText === "Guests")!;
    expect(watchPageSettings(guests)).toMatchObject({ switcherText: "Guests", switcherIcon: "person.2", switcherColor: "#FF9F0A", switcherDisplayMode: "icon" });
  });

  it("hide and show the page", () => {
    const hidden = setWatchPageHideFromSwitcher(doc(), PAGE, true);
    expect(pageOf(hidden).hideFromSwitcher).toBe(true);
    expect(pageOf(setWatchPageHideFromSwitcher(hidden, PAGE, false)).hideFromSwitcher).toBe(false);
    const d = doc();
    expect(setWatchPageHideFromSwitcher(d, PAGE, false)).toBe(d);
  });

  it("set text or icon, and refuse a mode the tables do not name", () => {
    const icon = setWatchPageSwitcherDisplayMode(doc(), PAGE, "icon");
    expect(pageOf(icon).switcherDisplayMode).toBe("icon");
    expect(isSorted(pageOf(icon))).toBe(true);
    expect(setWatchPageSwitcherDisplayMode(icon, PAGE, "both")).toBe(icon);
    expect(Object.hasOwn(pageOf(setWatchPageSwitcherDisplayMode(icon, PAGE, undefined)), "switcherDisplayMode")).toBe(false);
  });

  it("set the name; empty goes back to the page's own", () => {
    const named = setWatchPageSwitcherText(doc(), PAGE, "Lounge");
    expect(pageOf(named).switcherText).toBe("Lounge");
    expect(pageOf(named).name).toBe("Living");
    expect(Object.hasOwn(pageOf(setWatchPageSwitcherText(named, PAGE, "")), "switcherText")).toBe(false);
  });

  it("set the icon; empty is the automatic one", () => {
    const set = setWatchPageSwitcherIcon(doc(), PAGE, " sofa ");
    expect(pageOf(set).switcherIcon).toBe("sofa");
    expect(Object.hasOwn(pageOf(setWatchPageSwitcherIcon(set, PAGE, "")), "switcherIcon")).toBe(false);
  });

  it("set the color as plain #RRGGBB; undefined is the automatic one, a gradient is refused", () => {
    const set = setWatchPageSwitcherColor(doc(), PAGE, "#ff9f0acc");
    expect(pageOf(set).switcherColor).toBe("#FF9F0A");
    expect(setWatchPageSwitcherColor(set, PAGE, "GRADIENT|#000000|#FFFFFF")).toBe(set);
    expect(Object.hasOwn(pageOf(setWatchPageSwitcherColor(set, PAGE, undefined)), "switcherColor")).toBe(false);
  });

  it("change only their own key", () => {
    const before = doc({ pageTitleIcon: "house", themeOverride: "neonLagoon" });
    const after = setWatchPageSwitcherText(before, PAGE, "Den");
    const { switcherText, ...rest } = pageOf(after);
    expect(switcherText).toBe("Den");
    expect(rest).toEqual(pageOf(before));
  });
});
