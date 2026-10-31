// A page's Fit to screen switch, in the On the iPhone card: on writes
// `fitToScreen: true`, off removes the key, which the iPhone reads as off.
// Every other key stays.

import { describe, expect, it } from "vitest";

import { findWatchPage } from "../src/watch-pages/edit.js";
import type { WatchPage, WatchPagesDocument } from "../src/watch-pages/model.js";
import { setWatchPageFitToScreen } from "../src/watch-pages/page-settings-model.js";

const PAGE = "C3A0E000-0000-4000-8000-0000000000AC";

function doc(extra: Record<string, unknown> = {}): WatchPagesDocument {
  return {
    schemaVersion: 1,
    pages: [{ hideFromSwitcher: false, id: PAGE, items: [], name: "TV", ...extra }],
  };
}

const pageOf = (d: WatchPagesDocument): WatchPage => findWatchPage(d, PAGE)!;

describe("the page's Fit to screen switch", () => {
  it("writes true when on and removes the key when off", () => {
    const on = setWatchPageFitToScreen(doc(), PAGE, true);
    expect(pageOf(on).fitToScreen).toBe(true);
    const off = setWatchPageFitToScreen(on, PAGE, false);
    expect(Object.hasOwn(pageOf(off), "fitToScreen")).toBe(false);
  });

  it("keeps every other key", () => {
    const on = setWatchPageFitToScreen(doc({ switcherText: "Remote", odd: 7 }), PAGE, true);
    expect(pageOf(on)).toMatchObject({ switcherText: "Remote", odd: 7, name: "TV" });
  });
});
