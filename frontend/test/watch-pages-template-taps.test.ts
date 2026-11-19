// Tap areas on a template tile (`templateTaps`). The reader must match the
// app's `TemplateTileTaps`: both pass the samples in `tile-app.json`
// `template.taps`.

import { describe, expect, it } from "vitest";
import tileApp from "../src/watch-pages/tile-app.json";
import pageKeys from "../src/watch-pages/page-keys.json";
import { setWatchTemplateTaps, watchTemplateTaps } from "../src/watch-pages/app-model.js";
import { keyDevices, type WatchPagesDocument } from "../src/watch-pages/model.js";
import {
  TEMPLATE_TAPS,
  movedTemplateTapArea,
  newTemplateTapArea,
  normalizeTemplateTaps,
  resizedTemplateTapArea,
  spannedTemplateTapArea,
  templateTapAt,
  withTemplateTapAction,
} from "../src/watch-pages/template-taps.js";

const PAGE = "P";
const TILE = "T";
const TEMPLATE = "template.6F3A";
const document = (extra: Record<string, unknown> = {}, entityId = TEMPLATE) =>
  ({ schemaVersion: 1, pages: [{ id: PAGE, name: "Home", items: [{ id: TILE, entityId, ...extra }] }] }) as unknown as WatchPagesDocument;
const stored = (doc: WatchPagesDocument) => (doc as unknown as { pages: { items: Record<string, unknown>[] }[] }).pages[0]!.items[0]!;

describe("Tap areas", () => {
  it("reads every shared sample as the app does", () => {
    const samples = tileApp.template.taps.samples as { input: unknown; areas: unknown }[];
    expect(samples.length).toBeGreaterThan(0);
    for (const sample of samples) expect(normalizeTemplateTaps(sample.input)).toEqual(sample.areas);
  });

  it("takes its numbers from the shared table", () => {
    expect(TEMPLATE_TAPS).toEqual({ key: "templateTaps", max: 8, minSize: 0.05, maxText: 2000, actions: ["maps", "link", "refresh", "page"] });
    expect(keyDevices("templateTaps")).toEqual(["watch", "iphone"]);
    expect((pageKeys as unknown as { types: { tile: { keys: Record<string, unknown> } } }).types.tile.keys["templateTaps"]).toEqual({ type: "json", required: false });
  });

  it("writes only the areas the rule keeps, and an empty list removes the key", () => {
    const doc = setWatchTemplateTaps(document(), PAGE, TILE, [{ x: -1, y: 0, w: 2, h: 0.5, action: "refresh", extra: 1 }, { x: 0, y: 0, w: 1, h: 1, action: "maps" }]);
    expect(stored(doc)["templateTaps"]).toEqual([{ x: 0, y: 0, w: 1, h: 0.5, action: "refresh" }]);
    expect(watchTemplateTaps(stored(doc) as never)).toEqual([{ x: 0, y: 0, w: 1, h: 0.5, action: "refresh" }]);
    expect(Object.hasOwn(stored(setWatchTemplateTaps(doc, PAGE, TILE, [])), "templateTaps")).toBe(false);
    expect(Object.hasOwn(stored(setWatchTemplateTaps(document(), PAGE, TILE, [{ action: "dance" }])), "templateTaps")).toBe(false);
    // The same list again is no change; another kind of tile is never written.
    expect(setWatchTemplateTaps(doc, PAGE, TILE, [{ x: 0, y: 0, w: 1, h: 0.5, action: "refresh" }])).toBe(doc);
    const light = document({}, "light.kitchen");
    expect(setWatchTemplateTaps(light, PAGE, TILE, [newTemplateTapArea()])).toBe(light);
  });

  it("edits an area inside the face", () => {
    const area = newTemplateTapArea();
    expect(area).toEqual({ x: 0.25, y: 0.25, w: 0.5, h: 0.5, action: "refresh" });
    expect(movedTemplateTapArea(area, 0.9, -0.2)).toEqual({ ...area, x: 0.5, y: 0 });
    expect(resizedTemplateTapArea(area, 2, 0.26)).toEqual({ ...area, w: 0.75, h: 0.05 });
    expect(spannedTemplateTapArea({ x: 0.6, y: 0.8 }, { x: 0.2, y: 0.81 })).toEqual({ x: 0.2, y: 0.8, w: 0.4, h: 0.05, action: "refresh" });
    expect(withTemplateTapAction(area, "maps", " zone.home ")).toEqual({ ...area, action: "maps", place: "zone.home" });
    // No text for an action that needs it keeps the area as it was.
    expect(withTemplateTapAction(area, "link")).toBe(area);
    expect(withTemplateTapAction({ ...area, action: "maps", place: "a.b" }, "refresh")).toEqual(area);
  });

  it("finds the last area under a point, as the devices do", () => {
    const areas = normalizeTemplateTaps([{ x: 0, y: 0, w: 1, h: 1, action: "refresh" }, { x: 0.5, y: 0.5, w: 0.5, h: 0.5, action: "page", page: "p" }]);
    expect(templateTapAt(areas, 0.75, 0.75)).toBe(1);
    expect(templateTapAt(areas, 0.1, 0.1)).toBe(0);
    expect(templateTapAt([], 0.1, 0.1)).toBeUndefined();
  });
});
