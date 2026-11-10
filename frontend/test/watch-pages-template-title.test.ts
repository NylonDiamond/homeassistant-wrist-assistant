// The Title setting of a template tile. Both devices read `templateTitle`:
// one small line over the text that is not one of its Lines.

import { describe, expect, it } from "vitest";
import {
  WATCH_TEMPLATE_TITLE,
  setWatchTemplateTitle,
  setWatchTemplateTitlePosition,
  setWatchTemplateTitleColor,
  setWatchTemplateTitleFontSize,
  setWatchTemplateTitleHidden,
  watchTemplateTitleHidden,
  watchTemplateTitlePosition,
  watchTemplateTitleBand,
  watchTemplateTitleColor,
  watchTemplateTitleMetrics,
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
  it("is read by both devices, and takes its line box and 4 points off the top", () => {
    for (const key of ["templateTitle", "templateTitlePosition", "templateTitleFontSize", "templateTitleColor", "templateTitleHidden"]) expect(keyDevices(key)).toEqual(["watch", "iphone"]);
    expect(WATCH_TEMPLATE_TITLE).toEqual({ top: 3, gap: 1, inset: 0 });
    expect(watchTemplateTitleMetrics({ entityId: TEMPLATE })).toEqual({ size: 11, line: 14 });
    expect(watchTemplateTitleBand({ entityId: TEMPLATE })).toBe(18);
    expect(watchTemplateTitleMetrics({ entityId: TEMPLATE, templateTitleFontSize: 13 })).toEqual({ size: 13, line: 17 });
    expect(watchTemplateTitleMetrics({ entityId: TEMPLATE, templateTitleFontSize: 15.5 })).toEqual({ size: 15.5, line: 20 });
    expect(watchTemplateTitleMetrics({ entityId: TEMPLATE, templateTitleFontSize: 99 })).toEqual({ size: 30, line: 38 });
    // The word key of the first build reads as absent.
    expect(watchTemplateTitleBand({ entityId: TEMPLATE, templateTitleSize: "large" })).toBe(18);
    expect(watchTemplateTitleBand({ entityId: TEMPLATE, templateTitleFontSize: "large" })).toBe(18);
  });

  it("writes Size in half points within 6 to 30, removes it at 11, and drops the old word key", () => {
    expect(stored(setWatchTemplateTitleFontSize(document(), PAGE, TILE, 14.3)).templateTitleFontSize).toBe(14.5);
    expect(stored(setWatchTemplateTitleFontSize(document(), PAGE, TILE, 2)).templateTitleFontSize).toBe(3);
    const back = stored(setWatchTemplateTitleFontSize(document({ templateTitleFontSize: 20, templateTitleSize: "large" }), PAGE, TILE, 11));
    expect(Object.hasOwn(back, "templateTitleFontSize")).toBe(false);
    expect(Object.hasOwn(back, "templateTitleSize")).toBe(false);
  });

  it("sits centered unless Position moves it, in hundredths from 0 to 1, and drops the old word key", () => {
    expect(watchTemplateTitlePosition({ entityId: TEMPLATE })).toBe(0.5);
    expect(watchTemplateTitlePosition({ entityId: TEMPLATE, templateTitlePosition: 1.4 })).toBe(1);
    expect(watchTemplateTitlePosition({ entityId: TEMPLATE, templateTitleAlign: "leading" })).toBe(0.5);
    expect(stored(setWatchTemplateTitlePosition(document(), PAGE, TILE, 0.374)).templateTitlePosition).toBe(0.37);
    expect(stored(setWatchTemplateTitlePosition(document(), PAGE, TILE, 0)).templateTitlePosition).toBe(0);
    const back = stored(setWatchTemplateTitlePosition(document({ templateTitlePosition: 0, templateTitleAlign: "center" }), PAGE, TILE, 0.5));
    expect(Object.hasOwn(back, "templateTitlePosition")).toBe(false);
    expect(Object.hasOwn(back, "templateTitleAlign")).toBe(false);
  });

  it("keeps its own color, and goes back to the ink without one", () => {
    expect(stored(setWatchTemplateTitleColor(document(), PAGE, TILE, "#FF9500")).templateTitleColor).toBe("#FF9500");
    expect(Object.hasOwn(stored(setWatchTemplateTitleColor(document({ templateTitleColor: "#FF9500" }), PAGE, TILE, undefined)), "templateTitleColor")).toBe(false);
    expect(watchTemplateTitleColor({ entityId: TEMPLATE, templateTitleColor: " " })).toBeUndefined();
  });

  it("writes the text as typed, and removes the key when cleared", () => {
    expect(stored(setWatchTemplateTitle(document(), PAGE, TILE, "6-day forecast ")).templateTitle).toBe("6-day forecast ");
    for (const cleared of ["", "   "]) {
      expect(Object.hasOwn(stored(setWatchTemplateTitle(document({ templateTitle: "Next 10 hours" }), PAGE, TILE, cleared)), "templateTitle")).toBe(false);
    }
    const empty = document();
    expect(setWatchTemplateTitle(empty, PAGE, TILE, "")).toBe(empty);
  });

  it("keeps the words and look while Show title is off, and draws nothing", () => {
    const titled = document({ templateTitle: "Next 10 hours", templateTitleFontSize: 14 });
    const off = stored(setWatchTemplateTitleHidden(titled, PAGE, TILE, true));
    expect(off.templateTitleHidden).toBe(true);
    expect(off.templateTitle).toBe("Next 10 hours");
    expect(off.templateTitleFontSize).toBe(14);
    expect(watchTemplateTitleHidden(off)).toBe(true);
    expect(watchTemplateTitle(off)).toBeUndefined();
    const on = stored(setWatchTemplateTitleHidden(document(off), PAGE, TILE, false));
    expect(Object.hasOwn(on, "templateTitleHidden")).toBe(false);
    expect(watchTemplateTitle(on)).toBe("Next 10 hours");
    // Nothing to hide without words.
    const empty = document();
    expect(setWatchTemplateTitleHidden(empty, PAGE, TILE, true)).toBe(empty);
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
    expect(withTitle).toBeCloseTo(watchTemplateTextScale(plain, 180, 180 - 18, input(plain)), 6);
    const large = tile({ templateTitle: "Next 10 hours", templateTitleFontSize: 15 });
    expect(watchTemplateTextScale(large, 180, 180, input(large))).toBeCloseTo(watchTemplateTextScale(plain, 180, 180 - 23, input(plain)), 6);
  });
});
