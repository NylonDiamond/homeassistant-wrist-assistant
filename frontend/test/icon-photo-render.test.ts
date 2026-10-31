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

import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import { renderPageRowPicture } from "../src/library/row-picture.js";
import type { WatchPage, WatchPageTile } from "../src/watch-pages/model.js";
import type { OneLookPalette } from "../src/watch-pages/one-look/colour.js";
import type { WatchPagePreviewInput } from "../src/watch-pages/preview.js";
import {
  type OneLookTileFaceInput,
  ONE_LOOK_CUTOUT_OFF_FILTER,
  oneLookCutoutDimmed,
  oneLookCutoutOf,
  oneLookCutoutRect,
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
