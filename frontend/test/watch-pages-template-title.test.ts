// The Title setting of a template tile. Both devices read `templateTitle`:
// one small line over the text that is not one of its Lines.

import { describe, expect, it } from "vitest";
import {
  WATCH_TEMPLATE_TITLE,
  WATCH_TEMPLATE_TITLE_BAND,
  setWatchTemplateTitle,
  watchTemplateTitle,
  watchTemplateTitleText,
} from "../src/watch-pages/app-model.js";
import { keyDevices, type WatchPage, type WatchPageTile, type WatchPagesDocument } from "../src/watch-pages/model.js";
import { watchTemplateTextScale } from "../src/watch-pages/preview.js";

const PAGE = "P";
const TILE = "T";
const TEMPLATE = "template.6F3A";
const document = (extra: Record<string, unknown> = {}, entityId = TEMPLATE) =>
  ({ schemaVersion: 1, pages: [{ id: PAGE, name: "Home", items: [{ id: TILE, entityId, ...extra }] }] }) as unknown as WatchPagesDocument;
const stored = (doc: WatchPagesDocument) => (doc as unknown as { pages: { items: Record<string, unknown>[] }[] }).pages[0]!.items[0]!;

describe("Title", () => {
  it("is read by both devices, and takes 18 points off the top", () => {
    expect(keyDevices("templateTitle")).toEqual(["watch", "iphone"]);
    expect(WATCH_TEMPLATE_TITLE).toEqual({ size: 11, top: 3, line: 14, gap: 1, inset: 4 });
    expect(WATCH_TEMPLATE_TITLE_BAND).toBe(18);
  });

  it("writes the text as typed, and removes the key when cleared", () => {
    expect(stored(setWatchTemplateTitle(document(), PAGE, TILE, "6-day forecast ")).templateTitle).toBe("6-day forecast ");
    for (const cleared of ["", "   "]) {
      expect(Object.hasOwn(stored(setWatchTemplateTitle(document({ templateTitle: "Next 10 hours" }), PAGE, TILE, cleared)), "templateTitle")).toBe(false);
    }
    const empty = document();
    expect(setWatchTemplateTitle(empty, PAGE, TILE, "")).toBe(empty);
  });

  it("refuses any other kind of tile", () => {
    const light = document({}, "light.desk");
    expect(setWatchTemplateTitle(light, PAGE, TILE, "Desk")).toBe(light);
  });

  it("draws the title trimmed, and nothing for an empty or wrong value", () => {
    expect(watchTemplateTitle({ entityId: TEMPLATE, templateTitle: "  Next 10 hours " })).toBe("Next 10 hours");
    expect(watchTemplateTitle({ entityId: TEMPLATE, templateTitle: "  " })).toBeUndefined();
    expect(watchTemplateTitle({ entityId: TEMPLATE, templateTitle: 4 })).toBeUndefined();
    expect(watchTemplateTitleText({ entityId: TEMPLATE, templateTitle: 4 })).toBe("");
  });

  it("fits the text in the room under the title, so it never takes a Line", () => {
    const text = Array.from({ length: 10 }, (_, i) => `${16 + i} 8° 0 2 ONO`).join("\n");
    const tile = (extra: Record<string, unknown>): WatchPageTile => ({ id: TILE, entityId: TEMPLATE, templateString: "{{ x }}", templateLines: 10, templateColumns: false, ...extra });
    const input = (t: WatchPageTile) => ({ page: { id: PAGE, name: "Home", items: [] } as unknown as WatchPage, templates: new Map([[TILE, { text: t.templateString as string, result: { ok: true as const, value: text } }]]) });
    const plain = tile({});
    const titled = tile({ templateTitle: "Next 10 hours" });
    const without = watchTemplateTextScale(plain, 180, 180, input(plain));
    const withTitle = watchTemplateTextScale(titled, 180, 180, input(titled));
    expect(withTitle).toBeLessThan(without);
    // The same as a tile 18 points shorter with no title.
    expect(withTitle).toBeCloseTo(watchTemplateTextScale(plain, 180, 180 - WATCH_TEMPLATE_TITLE_BAND, input(plain)), 6);
  });
});
