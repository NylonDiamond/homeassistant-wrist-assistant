// A tile's icon photo as One Look draws it (one-look/render.ts,
// `cutoutLayer`): in the icon's place with no disc fill, a square box on the
// disc's centre, the disc times the photo's aspect held to 1 to 1.35, with
// the photo fitted in it (never taller than the disc) and its corners
// rounded by 22% of the box, the halo behind it while lit, gray and dark
// while not, the icon while the bytes are not in, and moved by the tile's
// Arrangement like the icon (app repo docs/photo_tiles_plan_2026-10.md,
// "Drawing"). Read as the HTML lit would write, as one-look-render.test.ts
// does. With no symbol provider, an icon draws as a dot that names its
// symbol.

import { svg } from "lit";
import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import { renderPageRowPicture } from "../src/library/row-picture.js";
import type { WatchPage, WatchPageTile } from "../src/watch-pages/model.js";
import type { OneLookPalette } from "../src/watch-pages/one-look/colour.js";
import { ONE_LOOK_OLD_PLACE_INK_TRIM } from "../src/watch-pages/one-look/layout.js";
import type { WatchPagePreviewInput } from "../src/watch-pages/preview.js";
import {
  type OneLookTileFaceInput,
  ONE_LOOK_CUTOUT_OFF_FILTER,
  oneLookCutoutDimmed,
  oneLookCutoutOf,
  oneLookCutoutPlace,
  oneLookCutoutRect,
  oneLookCutoutSide,
  oneLookPreviewModel,
  renderOneLookTile,
} from "../src/watch-pages/one-look/render.js";

function text(t: unknown): string {
  if (typeof t === "symbol" || t === null || t === undefined) return "";
  if (Array.isArray(t)) return t.map(text).join("");
  if (typeof t !== "object") return String(t);
  const r = t as { strings?: readonly string[]; values?: unknown[] };
  if (r.strings === undefined) return "";
  return r.strings.map((s, i) => s + (i < (r.values?.length ?? 0) ? text(r.values![i]) : "")).join("");
}

/** The inline style of the first element with this class. */
function styleOf(html: string, cls: string): string | undefined {
  const tag = new RegExp(`<[a-z]+ class="${cls}(?: [^"]*)?"[^>]*?style=([^>]*)>`).exec(html);
  return tag?.[1]?.replace(/\s*\/$/, "");
}

function place(style: string | undefined): { x: number; y: number; w: number; h: number } {
  const n = (k: string) => Number(new RegExp(`(?:^|;)${k}:(-?[\\d.]+)px`).exec(style ?? "")?.[1]);
  return { x: n("left"), y: n("top"), w: n("width"), h: n("height") };
}

const ID = "0A1B2C3D-4E5F-4A6B-8C7D-9E0F1A2B3C4D";
const page: WatchPage = { id: "P", name: "P", items: [] };
const states = (state: string): Record<string, HassEntityState> => ({
  "light.lamp": { entity_id: "light.lamp", state, attributes: state === "on" ? { brightness: 255 } : {}, last_changed: "", last_updated: "" },
});

const UNIT = 15.5;
const CELL = { width: 6 * UNIT + 10, height: 4 * UNIT + 6 };

function face(tile: WatchPageTile, state: string, photos: Partial<Pick<WatchPagePreviewInput, "photo" | "photoSize">> = {}): OneLookTileFaceInput {
  const input: WatchPagePreviewInput = { page, pages: [page], screen: { width: 211, height: 251 }, states: states(state), scale: 1, ...photos };
  return { tile, input, stub: false, device: "watch", look: undefined, width: CELL.width - 1, height: CELL.height - 1, cell: CELL, unit: UNIT, box: "", s: 1 };
}

const lamp = (extra: Partial<WatchPageTile> = {}): WatchPageTile => ({ id: "T", entityId: "light.lamp", customLabel: "Lamp", colSpan: 6, rowSpan: 4, iconPhotoId: ID, ...extra });
const have = { photo: (id: string) => (id === ID ? "blob:lamp" : undefined) };

describe("an icon photo on a One Look tile", () => {
  it("takes the icon's place, with no disc fill", () => {
    const html = text(renderOneLookTile(face(lamp(), "on", have)));
    expect(html).toContain(`class="ol-cutout"`);
    expect(html).toContain(`src=blob:lamp`);
    expect(html).not.toContain("data-symbol=");
    expect(html).not.toContain(`class="ol-disc`);
    // Not the person photo's round one.
    expect(html).not.toContain(`class="ol-photo"`);
  });

  it("lit: the halo behind it and no filter", () => {
    const html = text(renderOneLookTile(face(lamp(), "on", have)));
    expect(html).toContain(`class="ol-halo"`);
    expect(styleOf(html, "ol-cutout")).not.toContain("filter");
  });

  it("not lit: gray and dark, no halo", () => {
    const html = text(renderOneLookTile(face(lamp(), "off", have)));
    expect(styleOf(html, "ol-cutout")).toContain(`filter:${ONE_LOOK_CUTOUT_OFF_FILTER}`);
    expect(ONE_LOOK_CUTOUT_OFF_FILTER).toBe("grayscale(.85) brightness(.62)");
    expect(html).not.toContain(`class="ol-halo"`);
  });

  it("gray only when graphite, a light is off, or wrist down; a switch or fan that keeps its colour stays bright", () => {
    const p = (surface: string, isLit: boolean, aod = false) => ({ surface, isLit, aod }) as unknown as OneLookPalette;
    expect(oneLookCutoutDimmed(p("coloured", true), true)).toBe(false);
    expect(oneLookCutoutDimmed(p("coloured", false), true)).toBe(true);
    expect(oneLookCutoutDimmed(p("graphite", false), true)).toBe(true);
    expect(oneLookCutoutDimmed(p("coloured", false), false)).toBe(false);
    expect(oneLookCutoutDimmed(p("graphite", false), false)).toBe(true);
    expect(oneLookCutoutDimmed(p("coloured", true, true), true)).toBe(true);
    expect(oneLookCutoutDimmed(p("coloured", false, true), false)).toBe(true);
  });

  it("draws the icon while the bytes are not in, or with no photos to read", () => {
    for (const f of [face(lamp(), "on", { photo: () => undefined }), face(lamp(), "on")]) {
      const html = text(renderOneLookTile(f));
      expect(html).not.toContain("ol-cutout");
      expect(html).toContain("data-symbol=");
    }
    // An empty id is none.
    expect(oneLookCutoutOf(lamp({ iconPhotoId: "" }), have)).toBeUndefined();
    expect(oneLookCutoutOf(lamp({ iconPhotoId: ID.toLowerCase() }), { photo: (id) => `u:${id}` })).toEqual({ url: `u:${ID.toLowerCase()}` });
  });

  it("sits in the glyph's ink square on its centre in the centred layout, corners 22% of the box", () => {
    const f = face(lamp(), "on", have);
    const model = oneLookPreviewModel(f)!;
    const disc = model.layout.discRect;
    const html = text(renderOneLookTile(f));
    const at = place(styleOf(html, "ol-cutout"));
    expect(model.layout.drawsDisc).toBe(false);
    const side = model.layout.glyphSize * 0.86;
    expect(at.w).toBeCloseTo(side, 1);
    expect(at.h).toBeCloseTo(side, 1);
    expect(at.x + at.w / 2).toBeCloseTo(disc.x + disc.width / 2, 1);
    expect(at.y + at.h / 2).toBeCloseTo(disc.y + disc.height / 2, 1);
    const radius = Number(/border-radius:([\d.]+)px/.exec(styleOf(html, "ol-cutout") ?? "")?.[1]);
    expect(radius).toBeCloseTo(side * 0.22, 1);
  });

  it("fits a photo of a known size with its aspect kept", () => {
    const rect = { x: 10, y: 20, width: 40, height: 40 };
    const wide = oneLookCutoutRect(rect, 2);
    expect(wide.box).toEqual({ x: 3, y: 13, width: 54, height: 54 });
    expect(wide.photo).toEqual({ x: 3, y: 26.5, width: 54, height: 27 });
    expect(wide.radius).toBeCloseTo(54 * 0.22, 10);
    const tall = oneLookCutoutRect(rect, 0.5);
    expect(tall.box).toEqual(rect);
    expect(tall.photo).toEqual({ x: 20, y: 20, width: 20, height: 40 });
    expect(oneLookCutoutRect(rect, undefined).photo).toEqual(rect);
    // The size comes from the list when the picture has it.
    const sized = face(lamp(), "on", { ...have, photoSize: () => ({ width: 300, height: 150 }) });
    expect(oneLookPreviewModel(sized)!.cutout).toEqual({ url: "blob:lamp", aspect: 2 });
    const at = place(styleOf(text(renderOneLookTile(sized)), "ol-cutout"));
    expect(at.w / at.h).toBeCloseTo(2, 1);
  });

  it("sizes the box by the apps' rule, from the glyph box or disc, never the bare glyph inside it", () => {
    // `OneLookCutout.boxSide(disc:aspect:onDisc:)` and the app's own cases:
    // on a disc 40 across, the lamp photo (384 by 322) takes 40 x 1.19, a
    // tall or unknown one 40, a very wide one 40 x 1.35; off a disc, the
    // glyph box's ink square, 40 x 0.86, whatever the photo's shape.
    expect(oneLookCutoutSide(40, 384 / 322, true)).toBeCloseTo(40 * 384 / 322, 10);
    expect(oneLookCutoutSide(40, 353 / 384, true)).toBe(40);
    expect(oneLookCutoutSide(40, undefined, true)).toBe(40);
    expect(oneLookCutoutSide(40, 3, true)).toBeCloseTo(54, 10);
    for (const aspect of [undefined, 0.5, 1, 384 / 322, 3]) expect(oneLookCutoutSide(40, aspect, false)).toBeCloseTo(34.4, 10);

    // A watch strip (6 by 3) draws no disc and its bare glyph at 85% of the
    // 20 point box; the photo takes the box's ink square, 20 x 0.86 = 17.2,
    // on the box's centre, as on the watch.
    const cell = { width: 6 * UNIT + 10, height: 3 * UNIT + 4 };
    const strip: OneLookTileFaceInput = {
      ...face(lamp({ colSpan: 6, rowSpan: 3 }), "on", { ...have, photoSize: () => ({ width: 384, height: 322 }) }),
      width: cell.width - 1, height: cell.height - 1, cell,
    };
    const model = oneLookPreviewModel(strip)!;
    expect(model.layout.mode).toBe("strip");
    expect(model.layout.drawsDisc).toBe(false);
    expect(model.layout.discRect.width).toBeCloseTo(20, 5);
    expect(model.layout.glyphSize).toBeCloseTo(17, 5);
    const { box } = oneLookCutoutPlace(model.layout, 384 / 322);
    expect(box.width).toBeCloseTo(17.2, 5);
    const at = place(styleOf(text(renderOneLookTile(strip)), "ol-cutout"));
    expect(at.w).toBeCloseTo(17.2, 1);
    expect(at.h).toBeCloseTo(17.2 * 322 / 384, 1);
    const disc = model.layout.discRect;
    expect(at.x + at.w / 2).toBeCloseTo(disc.x + disc.width / 2, 1);
    expect(at.y + at.h / 2).toBeCloseTo(disc.y + disc.height / 2, 1);
  });

  it("draws a 2-across light tile's lamp clear of the bar, the state and the name", () => {
    // Jesse's "Jesse Office Lights": a watch 6x4 light tile, on, with a
    // 384 by 310 lamp. Measured on the watch in the system font, the app (`takeOldSizes`, `oldPlaceGlyph`,
    // `OneLookCutout.boxSide` with no disc): icon size min(36, 68 x 0.54)
    // = 36, the bulb's extent 1.316 (its image over its point size), so the
    // glyph box is 36 x 1.316 / 0.86 = 55.1, clear of the bar, the state
    // and the name; the photo box its ink square, 55.1 x 0.86 = 47.4, and
    // the lamp fitted in it, 47.4 by 38.3: 57% of the tile's 67 points,
    // beside "100%", between the bar (to 7) and the name (from 50.4).
    const bulb = { lightbulb: [13.65, 23.68], "lightbulb.fill": [13.65, 23.68] } as Record<string, [number, number]>;
    const icons = {
      render: (name: string, size: number) => bulb[name] === undefined ? undefined
        : svg`<svg width=${size} height=${size} viewBox=${`0 0 ${bulb[name]![0]} ${bulb[name]![1]}`}><rect /></svg>`,
      available: () => true,
      names: () => Object.keys(bulb),
    } as unknown as WatchPagePreviewInput["icons"];
    const base = face(lamp({ customLabel: "Jesse Office Lights" }), "on", { ...have, photoSize: () => ({ width: 384, height: 310 }) });
    const f: OneLookTileFaceInput = { ...base, input: { ...base.input, icons } };
    const model = oneLookPreviewModel(f)!;
    const l = model.layout;
    expect(l.mode).toBe("centred");
    expect(l.glyphAtOldPlace).toBe(true);
    expect(model.style.iconSize).toBe(36);
    // In Inter the state "100%" is wide ("%" most of all): beside it the
    // glyph would shrink to 26.38. Under the state, in the middle of the
    // room above the name, it is bigger, so it goes there and the state
    // stays whole (2026-11-05, `ONE_LOOK_UNDER_GAIN`).
    const w = l.discRect.width;
    expect(w).toBeGreaterThan(26.38 + 0.5);
    expect(w).toBeCloseTo(40.59, 1);
    const at = place(styleOf(text(renderOneLookTile(f)), "ol-cutout"));
    expect(at.w).toBeCloseTo(w * 0.86, 1);
    expect(at.h).toBeCloseTo(at.w * 310 / 384, 1);
    expect(at.y).toBeGreaterThanOrEqual(l.barRect!.y + l.barRect!.height);
    // The layout keeps the glyph's ink clear of the name. A cut-out photo is
    // drawn over the whole ink square, while the layout trims a symbol's ink
    // by 8% a side (`ONE_LOOK_OLD_PLACE_INK_TRIM`, as the app does), so the
    // photo may reach into the state's and the name's line boxes by that
    // trim, clear of their letters.
    expect(l.glyphInk!.y + l.glyphInk!.height).toBeLessThanOrEqual(l.textOrigin.y);
    expect(at.y + at.h).toBeLessThanOrEqual(l.textOrigin.y + w * ONE_LOOK_OLD_PLACE_INK_TRIM);
    expect(l.glyphInk!.y).toBeGreaterThanOrEqual(l.stateRect!.y + l.stateRect!.height);
    expect(at.y).toBeGreaterThanOrEqual(l.stateRect!.y + l.stateRect!.height - w * ONE_LOOK_OLD_PLACE_INK_TRIM);
  });

  it("moves with the tile's Arrangement, as the icon does", () => {
    const arrange = { v: 1, parts: { icon: { spot: "tl" } } };
    const plain = place(styleOf(text(renderOneLookTile(face(lamp(), "on", have))), "ol-cutout"));
    const f = face(lamp({ arrange }), "on", have);
    const model = oneLookPreviewModel(f)!;
    const placed = model.arrange?.icon;
    expect(placed).toBeDefined();
    const at = place(styleOf(text(renderOneLookTile(f)), "ol-cutout"));
    expect(at.x).not.toBeCloseTo(plain.x, 0);
    expect(at.x + at.w / 2).toBeCloseTo(placed!.rect.x + placed!.rect.width / 2, 1);
    // The aspect is unknown here, so the photo fills the placed glyph's ink
    // square.
    expect(at.w).toBeCloseTo(model.layout.glyphSize * placed!.scale * 0.86, 1);
    // Hidden by the Arrangement: gone with the icon.
    const hidden = text(renderOneLookTile(face(lamp({ arrange: { v: 1, parts: { icon: { hidden: true } } } }), "on", have)));
    expect(hidden).not.toContain("ol-cutout");
  });

  it("draws in a library row's picture when the row has the photos", () => {
    const withTile: WatchPage = { id: "R", name: "R", items: [{ ...lamp(), gridCol: 0, gridRow: 0 }] };
    const drawn = text(renderPageRowPicture({ page: withTile, states: states("on"), photo: have.photo, photoTick: 1 }));
    expect(drawn).toContain("ol-cutout");
    const none = text(renderPageRowPicture({ page: { ...withTile }, states: states("on") }));
    expect(none).not.toContain("ol-cutout");
  });
});
