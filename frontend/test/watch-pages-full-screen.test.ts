// A page's Full screen switch, under Page title: on writes `fullScreen: true`,
// off removes the key, which the watch reads as off. Every other key stays.

import { describe, expect, it } from "vitest";

import { findWatchPage } from "../src/watch-pages/edit.js";
import type { WatchPage, WatchPagesDocument } from "../src/watch-pages/model.js";
import { setWatchPageFullScreen, watchPageSettings } from "../src/watch-pages/page-settings-model.js";

const PAGE = "C3A0E000-0000-4000-8000-0000000000AB";

function doc(extra: Record<string, unknown> = {}): WatchPagesDocument {
  return {
    schemaVersion: 1,
    pages: [{ hideFromSwitcher: false, id: PAGE, items: [], name: "Living", ...extra }],
  };
}

const pageOf = (d: WatchPagesDocument): WatchPage => findWatchPage(d, PAGE)!;

describe("the page's Full screen switch", () => {
  it("reads off while absent", () => {
    expect(watchPageSettings(pageOf(doc())).fullScreen).toBe(false);
  });

  it("writes true when on and removes the key when off", () => {
    const on = setWatchPageFullScreen(doc(), PAGE, true);
    expect(pageOf(on).fullScreen).toBe(true);
    expect(watchPageSettings(pageOf(on)).fullScreen).toBe(true);
    const off = setWatchPageFullScreen(on, PAGE, false);
    expect(Object.hasOwn(pageOf(off), "fullScreen")).toBe(false);
  });

  it("keeps every other key", () => {
    const on = setWatchPageFullScreen(doc({ switcherText: "Lounge", odd: 7 }), PAGE, true);
    expect(pageOf(on)).toMatchObject({ switcherText: "Lounge", odd: 7, name: "Living" });
  });
});
