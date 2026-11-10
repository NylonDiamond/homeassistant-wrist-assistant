// The Lines setting of a template tile. Both devices read `templateLines`;
// an absent key is 10 lines.

import { describe, expect, it } from "vitest";
import { WATCH_TEMPLATE_LINES, setWatchTemplateLines, watchTemplateRowLimit } from "../src/watch-pages/app-model.js";
import { keyDevices, type WatchPagesDocument } from "../src/watch-pages/model.js";
import { watchTemplateLinesMenu } from "../src/watch-pages/tile-settings-options.js";

const PAGE = "P";
const TILE = "T";
const TEMPLATE = "template.6F3A";
const document = (extra: Record<string, unknown> = {}, entityId = TEMPLATE) =>
  ({ schemaVersion: 1, pages: [{ id: PAGE, name: "Home", items: [{ id: TILE, entityId, ...extra }] }] }) as unknown as WatchPagesDocument;
const stored = (doc: WatchPagesDocument) => (doc as unknown as { pages: { items: Record<string, unknown>[] }[] }).pages[0]!.items[0]!;

describe("Lines", () => {
  it("is read by both devices and runs from 1 to 10 with 10 as the default", () => {
    expect(keyDevices("templateLines")).toEqual(["watch", "iphone"]);
    expect(WATCH_TEMPLATE_LINES).toEqual({ min: 1, max: 10, absent: 10 });
  });

  it("offers 1 to 10 and marks 10 as the default", () => {
    const menu = watchTemplateLinesMenu({ entityId: TEMPLATE });
    expect(menu.options.map((o) => o.label)).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10 (default)"]);
    expect(menu.selected).toBe("10");
  });

  it("writes the number, and removes the key for the default", () => {
    expect(stored(setWatchTemplateLines(document(), PAGE, TILE, 5)).templateLines).toBe(5);
    expect(Object.hasOwn(stored(setWatchTemplateLines(document({ templateLines: 3 }), PAGE, TILE, 10)), "templateLines")).toBe(false);
  });

  it("refuses a number off the range or not whole, and any other kind of tile", () => {
    const doc = document();
    for (const lines of [0, 11, 2.5]) expect(setWatchTemplateLines(doc, PAGE, TILE, lines)).toBe(doc);
    const light = document({}, "light.desk");
    expect(setWatchTemplateLines(light, PAGE, TILE, 6)).toBe(light);
  });

  it("draws the key's rows, kept in range, and 10 without it", () => {
    expect(watchTemplateRowLimit({ entityId: TEMPLATE })).toBe(10);
    expect(watchTemplateRowLimit({ entityId: TEMPLATE, templateLines: 7 })).toBe(7);
    expect(watchTemplateRowLimit({ entityId: TEMPLATE, templateLines: 0 })).toBe(1);
    expect(watchTemplateRowLimit({ entityId: TEMPLATE, templateLines: 40 })).toBe(10);
  });
});
