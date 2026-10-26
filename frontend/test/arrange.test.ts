// A tile's Arrangement (`arrange`): reading and writing the key, the
// placement math, and the One Look drawing that applies it. The shared fixtures have their own test
// (`arrange-fixtures.test.ts`). Plan: app repo
// docs/page_editor_calm_plan_2026-10.md, "The Arrangement key", steps 5 and 6.

import { svg } from "lit";
import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import { phonePagesLayout, phonePagesScreen } from "../src/phone-frame.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { type WatchPagePreviewInput, renderWatchTileFace, watchTileOneLookModel } from "../src/watch-pages/preview.js";
import {
  arrangeNameAlign,
  arrangePartRect,
  encodeTileArrange,
  normalizeTileArrange,
  withArrangePart,
} from "../src/watch-pages/one-look/arrange.js";
import { arrangeFreeBlock } from "../src/watch-pages/arrange-model.js";
import { setWatchTileArrange } from "../src/watch-pages/tile-settings-model.js";

(globalThis as { document?: unknown }).document ??= { activeElement: null };
(globalThis as { HTMLElement?: unknown }).HTMLElement ??= class {};
(globalThis as { HTMLInputElement?: unknown }).HTMLInputElement ??= class {};

// ── the key ──────────────────────────────────────────────────────────────

describe("reading and writing the key", () => {
  it("reads Default for anything that is not an arrangement", () => {
    for (const raw of [undefined, null, 3, "tr", [], {}, { v: 1 }, { v: 1, parts: [] }, { v: 1, parts: {} }, { v: 2, parts: { icon: { spot: "tr" } } }]) {
      expect(normalizeTileArrange(raw), JSON.stringify(raw)).toBeUndefined();
    }
  });

  it("clamps numbers, drops junk and defaults, and keeps an unversioned key", () => {
    expect(normalizeTileArrange({ parts: { icon: { spot: "tr", dx: 0.9, dy: -2, scale: 3, hidden: true, glow: 1 }, wings: { spot: "tl" } } }))
      .toEqual({ v: 1, parts: { icon: { spot: "tr", dx: 0.5, dy: -0.5, scale: 1.5, hidden: true } } });
    expect(normalizeTileArrange({ v: 1, parts: { icon: { scale: 0.2 }, name: { spot: "middle", dx: "1", hidden: "yes" } } }))
      .toEqual({ v: 1, parts: { icon: { scale: 0.8 } } });
    // A part at every default is no change, and goes.
    expect(normalizeTileArrange({ v: 1, parts: { icon: { dx: 0, dy: 0, scale: 1, hidden: false }, state: { hidden: true } } }))
      .toEqual({ v: 1, parts: { state: { hidden: true } } });
    expect(normalizeTileArrange({ v: 1, parts: { name: { dx: 0.1 + 0.2 } } })?.parts.name?.dx).toBe(0.3);
  });

  it("writes the parts and their keys in a fixed order, and nothing for Default", () => {
    const out = encodeTileArrange({ v: 1, parts: { state: { hidden: true }, icon: { hidden: true, scale: 1.2, spot: "tr" } } });
    expect(JSON.stringify(out)).toBe('{"v":1,"parts":{"icon":{"spot":"tr","scale":1.2,"hidden":true},"state":{"hidden":true}}}');
    expect(encodeTileArrange(undefined)).toBeUndefined();
  });

  it("changes one part, dropping it and then the key when it goes back", () => {
    const a = withArrangePart(undefined, "icon", (e) => ({ ...e, spot: "tl" }));
    expect(a).toEqual({ v: 1, parts: { icon: { spot: "tl" } } });
    const b = withArrangePart(a, "name", (e) => ({ ...e, scale: 1.2 }));
    expect(b).toEqual({ v: 1, parts: { icon: { spot: "tl" }, name: { scale: 1.2 } } });
    const c = withArrangePart(b, "icon", ({ spot: _, ...rest }) => rest);
    expect(c).toEqual({ v: 1, parts: { name: { scale: 1.2 } } });
    expect(withArrangePart(c, "name", (e) => ({ ...e, scale: 1 }))).toBeUndefined();
  });

  it("sets the tile key sparsely, removes it for Default, and changes nothing when it is already so", () => {
    const doc = { schemaVersion: 1, pages: [{ id: "P", name: "P", items: [{ id: "T", entityId: "light.a" }] }] } as unknown as WatchPagesDocument;
    const set = setWatchTileArrange(doc, "P", "T", { v: 1, parts: { icon: { spot: "br", dx: 0 } } });
    const tileOf = (d: WatchPagesDocument) => ((d.pages as WatchPage[])[0]!.items as WatchPageTile[])[0]!;
    expect(tileOf(set).arrange).toEqual({ v: 1, parts: { icon: { spot: "br" } } });
    expect(setWatchTileArrange(set, "P", "T", { v: 1, parts: { icon: { spot: "br" } } })).toBe(set);
    const gone = setWatchTileArrange(set, "P", "T", undefined);
    expect(Object.hasOwn(tileOf(gone), "arrange")).toBe(false);
    expect(setWatchTileArrange(gone, "P", "T", undefined)).toBe(gone);
  });
});

// ── the math ─────────────────────────────────────────────────────────────

describe("the placement math", () => {
  const T = { width: 100, height: 80 };
  const C = { x: 6, y: 6, width: 88, height: 68 };
  const R = { x: 30, y: 20, width: 40, height: 40 };

  it("anchors each spot to the content box", () => {
    expect(arrangePartRect(T, C, R, "icon", { spot: "tl" }).rect).toEqual({ x: 6, y: 6, width: 40, height: 40 });
    expect(arrangePartRect(T, C, R, "icon", { spot: "mc" }).rect).toEqual({ x: 30, y: 20, width: 40, height: 40 });
    expect(arrangePartRect(T, C, R, "icon", { spot: "br" }).rect).toEqual({ x: 54, y: 34, width: 40, height: 40 });
    expect(arrangePartRect(T, C, R, "icon", { spot: "tc" }).rect).toEqual({ x: 30, y: 6, width: 40, height: 40 });
    expect(arrangePartRect(T, C, R, "icon", { spot: "ml" }).rect).toEqual({ x: 6, y: 20, width: 40, height: 40 });
  });

  it("scales about the native centre, the name only in height, then moves by shares of the tile", () => {
    expect(arrangePartRect(T, C, R, "icon", { scale: 1.5 }).rect).toEqual({ x: 20, y: 10, width: 60, height: 60 });
    expect(arrangePartRect(T, C, R, "name", { scale: 1.5 }).rect).toEqual({ x: 30, y: 10, width: 40, height: 60 });
    expect(arrangePartRect(T, C, R, "icon", { dx: 0.1, dy: -0.25 }).rect).toEqual({ x: 40, y: 0, width: 40, height: 40 });
    expect(arrangePartRect(T, C, R, "state", { spot: "br", scale: 0.8, dx: -0.05 }).rect).toEqual({ x: 57, y: 42, width: 32, height: 32 });
  });

  it("keeps an unlisted part native, and reports hidden and the name's alignment", () => {
    expect(arrangePartRect(T, C, R, "state", undefined)).toEqual({ rect: R, scale: 1, hidden: false });
    expect(arrangePartRect(T, C, R, "state", { hidden: true }).hidden).toBe(true);
    expect(arrangeNameAlign({ spot: "bl" }, "center")).toBe("leading");
    expect(arrangeNameAlign({ spot: "tc" }, "center")).toBe("center");
    expect(arrangeNameAlign({ spot: "mr" }, "center")).toBe("trailing");
    expect(arrangeNameAlign({ dx: 0.2 }, "center")).toBe("center");
  });
});

// ── the drawing ──────────────────────────────────────────────────────────

/** A template's text with its values, as lit would write it. */
function text(t: unknown): string {
  if (typeof t === "symbol" || t === null || t === undefined) return "";
  if (Array.isArray(t)) return t.map(text).join("");
  if (typeof t !== "object") return String(t);
  const r = t as { strings?: readonly string[]; values?: unknown[] };
  if (r.strings === undefined) return "";
  return r.strings.map((s, i) => s + (i < (r.values?.length ?? 0) ? text(r.values![i]) : "")).join("");
}
function styleOf(markup: string, cls: string): string | undefined {
  return new RegExp(`<[a-z]+ class="${cls}(?: [^"]*)?"[^>]*?style=([^>]*)>`).exec(markup)?.[1]?.replace(/\s*\/$/, "");
}
function place(style: string | undefined): { x: number; y: number; w: number; h: number } {
  const n = (k: string) => Number(new RegExp(`(?:^|;)${k}:(-?[\\d.]+)px`).exec(style ?? "")?.[1]);
  return { x: n("left"), y: n("top"), w: n("width"), h: n("height") };
}
const BOXES: Record<string, [number, number]> = { lightbulb: [13.53, 22.22], "lightbulb.fill": [13.53, 22.22], person: [18, 20], "person.fill": [18, 20] };
const icons: IconProvider = {
  render: (name: string, size: number, colour: string) => {
    const box = BOXES[name];
    return box === undefined ? undefined : svg`<svg width=${size} height=${size} viewBox=${`0 0 ${box[0]} ${box[1]}`} fill=${colour}><rect /></svg>`;
  },
  available: () => true,
  names: () => Object.keys(BOXES),
};
const page: WatchPage = { id: "P", name: "P", items: [] };
const lit = (id: string, extra: Record<string, unknown> = {}): Record<string, HassEntityState> => ({
  [id]: { entity_id: id, state: "on", attributes: { brightness: 189, ...extra }, last_changed: "", last_updated: "" },
});
const UNIT = 15.5;
const cellOf = (cols: number, rows: number) => ({ width: cols * UNIT + (cols - 1) * 2, height: rows * UNIT + (rows - 1) * 2 });
const light = (extra: Partial<WatchPageTile> = {}): WatchPageTile => ({ id: "T", entityId: "light.kitchen", colSpan: 6, rowSpan: 4, customLabel: "Kitchen", color: "#8F7BEA", ...extra });
function watchInput(states: Record<string, HassEntityState>): WatchPagePreviewInput {
  return { page, pages: [page], screen: { width: 211, height: 251 }, states, icons, scale: 1, oneLook: true };
}
const onWatch = (t: WatchPageTile, cols = 6, rows = 4, states = lit("light.kitchen")) =>
  text(renderWatchTileFace(t, cellOf(cols, rows), watchInput(states), UNIT));

describe("One Look draws the arrangement", () => {
  it("moves the glyph and its glow together to a spot, at its size", () => {
    const native = onWatch(light());
    const moved = onWatch(light({ arrange: { v: 1, parts: { icon: { spot: "tl", scale: 1.2 } } } }));
    const g0 = place(styleOf(native, "ol-glyph"));
    const g1 = place(styleOf(moved, "ol-glyph"));
    const h0 = place(styleOf(native, "ol-halo"));
    const h1 = place(styleOf(moved, "ol-halo"));
    expect(g1.w).toBeCloseTo(g0.w * 1.2, 1);
    expect(h1.w).toBeCloseTo(h0.w * 1.2, 1);
    // The glow stays centred on the glyph.
    expect(h1.x + h1.w / 2).toBeCloseTo(g1.x + g1.w / 2, 1);
    expect(h1.y + h1.h / 2).toBeCloseTo(g1.y + g1.h / 2, 1);
    // Top left of the content box: the tile's inset.
    const model = watchTileOneLookModel(light({ arrange: { v: 1, parts: { icon: { spot: "tl" } } } }), cellOf(6, 4), watchInput(lit("light.kitchen")), UNIT)!;
    expect(model.arrange?.icon?.rect.x).toBeCloseTo(model.layout.insetH, 5);
    expect(model.arrange?.icon?.rect.y).toBeCloseTo(model.layout.insetV, 5);
  });

  it("aligns the name by its spot's column and scales its font", () => {
    const native = onWatch(light());
    const moved = onWatch(light({ arrange: { v: 1, parts: { name: { spot: "tl", scale: 1.5 } } } }));
    const nameStyle = styleOf(moved, "ol-text");
    expect(nameStyle).toContain("align-items:flex-start");
    expect(place(nameStyle).w).toBeCloseTo(place(styleOf(native, "ol-text")).w, 2);
    const size = (m: string) => Number(/font:\d+ ([\d.]+)px/.exec(styleOf(m, "ol-name") ?? "")?.[1]);
    expect(size(moved)).toBeCloseTo(size(native) * 1.5, 1);
    expect(styleOf(onWatch(light({ arrange: { v: 1, parts: { name: { spot: "br" } } } })), "ol-text")).toContain("align-items:flex-end");
  });

  it("hides a part without moving the others", () => {
    const native = onWatch(light());
    const hidden = onWatch(light({ arrange: { v: 1, parts: { state: { hidden: true }, icon: { hidden: true } } } }));
    expect(native).toContain(`class="ol-state`);
    expect(hidden).not.toContain(`class="ol-state`);
    expect(hidden).not.toContain(`class="ol-glyph"`);
    expect(hidden).not.toContain(`class="ol-halo"`);
    expect(styleOf(hidden, "ol-text")).toBe(styleOf(native, "ol-text"));
  });

  it("puts a person's photo where the icon goes", () => {
    const states: Record<string, HassEntityState> = {
      "person.jesse": { entity_id: "person.jesse", state: "home", attributes: { entity_picture: "/p.jpg" }, last_changed: "", last_updated: "" },
    };
    const person = (extra: Partial<WatchPageTile> = {}): WatchPageTile => ({ id: "T", entityId: "person.jesse", colSpan: 6, rowSpan: 5, customLabel: "Jesse", ...extra });
    const native = place(styleOf(onWatch(person(), 6, 5, states), "ol-photo"));
    const moved = place(styleOf(onWatch(person({ arrange: { v: 1, parts: { icon: { spot: "tr", scale: 0.8 } } } }), 6, 5, states), "ol-photo"));
    expect(native.w).toBeGreaterThan(0);
    expect(moved.w).toBeCloseTo(native.w * 0.8, 1);
    expect(moved.x + moved.w).toBeGreaterThan(native.x + native.w);
  });

  it("ignores the key where Free is not offered: a strip, a chart, a camera picture", () => {
    const key = { v: 1, parts: { icon: { spot: "br", scale: 1.5 }, state: { hidden: true } } };
    expect(onWatch(light({ rowSpan: 3, arrange: key }), 12, 3)).toBe(onWatch(light({ rowSpan: 3 }), 12, 3));
    const camStates: Record<string, HassEntityState> = {
      "camera.porch": { entity_id: "camera.porch", state: "idle", attributes: { entity_picture: "/c.jpg" }, last_changed: "", last_updated: "" },
    };
    const cam = (extra: Partial<WatchPageTile> = {}): WatchPageTile => ({ id: "C", entityId: "camera.porch", colSpan: 6, rowSpan: 4, cameraDisplayMode: "preview", ...extra });
    const camModel = watchTileOneLookModel(cam({ arrange: key }), cellOf(6, 4), watchInput(camStates), UNIT);
    expect(camModel?.arrange).toBeUndefined();
    expect(arrangeFreeBlock(camModel)).toContain("camera's picture");
    const strip = watchTileOneLookModel(light({ rowSpan: 3, arrange: key }), cellOf(12, 3), watchInput(lit("light.kitchen")), UNIT);
    expect(arrangeFreeBlock(strip)).toContain("under 4 rows");
    expect(arrangeFreeBlock(watchTileOneLookModel(light(), cellOf(6, 4), watchInput(lit("light.kitchen")), UNIT))).toBeUndefined();
  });

  it("draws it on the iPhone too", () => {
    const phone = phonePagesLayout(undefined, { look: "iphone" });
    const input: WatchPagePreviewInput = { page, pages: [page], screen: phonePagesScreen(phone), phone, states: lit("light.kitchen"), icons, scale: 1 };
    const unit = (380 - 22) / 12;
    const cell = { width: 6 * unit + 10, height: 4 * unit + 6 };
    const model = watchTileOneLookModel(light({ arrange: { v: 1, parts: { icon: { spot: "br" } } } }), cell, input, unit)!;
    expect(model.device).toBe("phone");
    const r = model.arrange!.icon!.rect;
    expect(r.x + r.width).toBeCloseTo(model.layout.size.width - model.layout.insetH, 5);
    expect(r.y + r.height).toBeCloseTo(model.layout.size.height - model.layout.insetV, 5);
  });
});
