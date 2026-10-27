// Light Look: the light the iPhone saves in a tile's icon photo (a PNG
// `tEXt` chunk, keyword `WristAssistantGlow`), read here
// (one-look/glow.ts) and drawn with the photo while the tile is lit and
// bright (one-look/render.ts, `cutoutLayer`): its halo in the pearl halo's
// place, then the shade masked by the photo, the rays and the core, all
// screen blended (app repo docs/photo_tiles_plan_2026-10.md, "Light Look").
// The worked example there is checked here as numbers; the apps check the
// same one.

import { afterEach, describe, expect, it } from "vitest";

import type { HassEntityState, HassLike } from "../src/ha-api.js";
import { renderPageRowPicture } from "../src/library/row-picture.js";
import type { WatchPage, WatchPageTile } from "../src/watch-pages/model.js";
import { type OneLookPalette, ONE_LOOK_AMBER, oneLookMix } from "../src/watch-pages/one-look/colour.js";
import {
  type OneLookGlowRecipe,
  ONE_LOOK_GLOW_DEFAULT,
  ONE_LOOK_GLOW_KEYWORD,
  ONE_LOOK_GLOW_PRESETS,
  oneLookGlowColour,
  oneLookGlowLayers,
  oneLookGlowRecipeOf,
  readIconPng,
} from "../src/watch-pages/one-look/glow.js";
import {
  type OneLookTileFaceInput,
  ONE_LOOK_CUTOUT_OFF_FILTER,
  oneLookCutoutGlows,
  oneLookCutoutOf,
  oneLookCutoutRect,
  oneLookPreviewModel,
  renderOneLookTile,
} from "../src/watch-pages/one-look/render.js";
import { PagePhotoStore, base64OfBytes, forgetPagePhotos } from "../src/watch-pages/page-photo-store.js";
import type { WatchPagePreviewInput } from "../src/watch-pages/preview.js";

// ── PNG bytes ────────────────────────────────────────────────────────────

function latin1(text: string): number[] {
  return [...text].map((c) => c.charCodeAt(0) & 0xff);
}

function be32(n: number): number[] {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

/** A chunk with a zero CRC, which the reader does not check. */
function chunk(type: string, body: number[]): number[] {
  return [...be32(body.length), ...latin1(type), ...body, 0, 0, 0, 0];
}

function text(keyword: string, value: string): number[] {
  return chunk("tEXt", [...latin1(keyword), 0, ...latin1(value)]);
}

/** A PNG: the signature, `IHDR`, the chunks given, then `IEND`. */
function png(width: number, height: number, ...chunks: number[][]): Uint8Array {
  const ihdr = chunk("IHDR", [...be32(width), ...be32(height), 8, 6, 0, 0, 0]);
  return new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, ...ihdr, ...chunks.flat(), ...chunk("IEND", [])]);
}

const RECIPE = '{"v":1,"x":0.4,"y":0.3,"size":0.2,"glow":0.9,"spread":0.6,"rays":0.5,"shade":0.7}';
const IDAT = chunk("IDAT", [1, 2, 3, 4]);

describe("reading the light from the photo's bytes", () => {
  it("reads the size and a light right after IHDR", () => {
    expect(readIconPng(png(120, 90, text(ONE_LOOK_GLOW_KEYWORD, RECIPE), IDAT))).toEqual({
      width: 120, height: 90, glow: { x: 0.4, y: 0.3, size: 0.2, glow: 0.9, spread: 0.6, rays: 0.5, shade: 0.7 },
    });
  });

  it("finds a chunk anywhere before IEND, after IDAT too", () => {
    expect(readIconPng(png(10, 10, IDAT, chunk("prVt", [9, 9]), text(ONE_LOOK_GLOW_KEYWORD, RECIPE)))?.glow?.x).toBe(0.4);
  });

  it("takes the first chunk with the keyword, past other text", () => {
    const second = '{"v":1,"x":0.9}';
    const facts = readIconPng(png(10, 10, text("Software", "x"), text(ONE_LOOK_GLOW_KEYWORD, RECIPE), text(ONE_LOOK_GLOW_KEYWORD, second)));
    expect(facts?.glow?.x).toBe(0.4);
  });

  it("no chunk, or another keyword: no light", () => {
    expect(readIconPng(png(30, 40, IDAT))).toEqual({ width: 30, height: 40 });
    expect(readIconPng(png(30, 40, text("WristAssistantGlo", RECIPE)))?.glow).toBeUndefined();
    expect(readIconPng(png(30, 40, text("wristassistantglow", RECIPE)))?.glow).toBeUndefined();
  });

  it("ignores text over 1024 bytes, text that is not a JSON object, and a v other than 1", () => {
    const long = `{"v":1,"x":0.2,"pad":"${"a".repeat(1024)}"}`;
    expect(long.length).toBeGreaterThan(1024);
    const exact = `{"v":1,"x":0.2,"pad":"${"a".repeat(1024 - 24)}"}`;
    expect(exact.length).toBe(1024);
    expect(readIconPng(png(10, 10, text(ONE_LOOK_GLOW_KEYWORD, long)))?.glow).toBeUndefined();
    expect(readIconPng(png(10, 10, text(ONE_LOOK_GLOW_KEYWORD, exact)))?.glow?.x).toBe(0.2);
    for (const bad of ["{", "[1]", "1", "null", '"v"', '{"v":2,"x":0.2}', '{"v":"1"}', '{"x":0.2}']) {
      expect(readIconPng(png(10, 10, text(ONE_LOOK_GLOW_KEYWORD, bad)))?.glow, bad).toBeUndefined();
    }
  });

  it("is not a PNG whose first chunk is IHDR: nothing", () => {
    expect(readIconPng(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBeUndefined();
    const noHeader = png(10, 10);
    noHeader[12] = 0x49 + 1;
    expect(readIconPng(noHeader)).toBeUndefined();
    // Cut off mid chunk: the size still reads, the light does not.
    const cut = png(10, 10, text(ONE_LOOK_GLOW_KEYWORD, RECIPE));
    expect(readIconPng(cut.subarray(0, cut.length - 30))).toEqual({ width: 10, height: 10 });
  });

  it("clamps each field to 0 to 1, and a missing or bad field takes the Bulb preset's, centred", () => {
    expect(ONE_LOOK_GLOW_DEFAULT).toEqual({ x: 0.5, y: 0.5, size: 0.55, glow: 0.85, spread: 0.45, rays: 0, shade: 0.8 });
    expect(ONE_LOOK_GLOW_PRESETS.soft).toEqual({ size: 0.3, glow: 0.7, spread: 0.8, rays: 0, shade: 0.6 });
    expect(ONE_LOOK_GLOW_PRESETS.sparkle).toEqual({ size: 0.4, glow: 0.75, spread: 0.55, rays: 0.7, shade: 0.7 });
    expect(oneLookGlowRecipeOf({ v: 1 })).toEqual(ONE_LOOK_GLOW_DEFAULT);
    expect(oneLookGlowRecipeOf({ v: 1, x: -2, y: 7, size: "big", glow: null, spread: 0.25, rays: 1.5, shade: Number.NaN })).toEqual({
      ...ONE_LOOK_GLOW_DEFAULT, x: 0, y: 1, spread: 0.25, rays: 1,
    });
    expect(oneLookGlowRecipeOf([{ v: 1 }])).toBeUndefined();
  });
});

describe("the light's layers", () => {
  it("the worked example", () => {
    const recipe: OneLookGlowRecipe = { x: 0.5, y: 0.25, size: 0.5, glow: 1, spread: 0.5, rays: 0.5, shade: 1 };
    const g = oneLookGlowLayers({ x: 10, y: 20, width: 40, height: 40 }, recipe, 1, [1, 2, 3]);
    expect(g.level).toBe(1);
    for (const c of [g.halo, g.shade, g.rays!, g.core]) {
      expect(c.cx).toBe(30);
      expect(c.cy).toBe(30);
    }
    expect(g.halo.r).toBeCloseTo(33, 10);
    expect(g.shade.r).toBeCloseTo(18.4, 10);
    expect(g.rays!.r).toBeCloseTo(32, 10);
    expect(g.rays!.alpha).toBeCloseTo(0.275, 10);
    expect(g.core.r).toBeCloseTo(3.4, 10);
    expect(g.halo.alpha).toBe(1);
    expect(g.shade.opacity).toBe(1);
    expect(g.core.white).toBeCloseTo(0.95, 10);
    expect(g.core.tint).toBeCloseTo(0.85, 10);
  });

  it("the level follows the brightness, the longer side sets the size, and no rays at 0", () => {
    const g = oneLookGlowLayers({ x: 0, y: 0, width: 20, height: 40 }, { ...ONE_LOOK_GLOW_DEFAULT, x: 0.25, y: 1 }, 0.5, [0, 0, 0]);
    expect(g.level).toBeCloseTo(0.625, 10);
    expect(g.halo.cx).toBe(5);
    expect(g.halo.cy).toBe(40);
    expect(g.shade.r).toBeCloseTo(0.46 * 40, 10);
    expect(g.halo.alpha).toBeCloseTo(0.85 * 0.625, 10);
    expect(g.shade.opacity).toBeCloseTo(0.8 * 0.625, 10);
    expect(g.rays).toBeUndefined();
    expect(oneLookGlowLayers({ x: 0, y: 0, width: 1, height: 1 }, ONE_LOOK_GLOW_DEFAULT, 0, [0, 0, 0]).level).toBe(0.25);
  });

  it("is in the tile's hue, else amber, mixed 35% toward white", () => {
    expect(oneLookGlowColour(undefined)).toEqual(oneLookMix(ONE_LOOK_AMBER, [255, 255, 255], 0.35));
    expect(oneLookGlowColour([0, 100, 200])).toEqual([89, 154, 219]);
  });

  it("only while lit and not dimmed", () => {
    const p = (surface: string, isLit: boolean, aod = false) => ({ surface, isLit, aod }) as unknown as OneLookPalette;
    expect(oneLookCutoutGlows(p("coloured", true), true)).toBe(true);
    expect(oneLookCutoutGlows(p("coloured", false), true)).toBe(false);
    expect(oneLookCutoutGlows(p("graphite", false), true)).toBe(false);
    // A switch that keeps its colour is bright but not lit: no light.
    expect(oneLookCutoutGlows(p("coloured", false), false)).toBe(false);
    // Wrist down.
    expect(oneLookCutoutGlows(p("coloured", true, true), true)).toBe(false);
  });
});

// ── drawn on a tile ──────────────────────────────────────────────────────

function html(t: unknown): string {
  if (typeof t === "symbol" || t === null || t === undefined) return "";
  if (Array.isArray(t)) return t.map(html).join("");
  if (typeof t !== "object") return String(t);
  const r = t as { strings?: readonly string[]; values?: unknown[] };
  if (r.strings === undefined) return "";
  return r.strings.map((s, i) => s + (i < (r.values?.length ?? 0) ? html(r.values![i]) : "")).join("");
}

function styleOf(out: string, cls: string): string | undefined {
  const tag = new RegExp(`<[a-z]+ class="${cls}(?: [^"]*)?"[^>]*?style=([^>]*)>`).exec(out);
  return tag?.[1]?.replace(/\s*\/$/, "");
}

function place(style: string | undefined): { x: number; y: number; w: number; h: number } {
  const n = (k: string) => Number(new RegExp(`(?:^|;)${k}:(-?[\\d.]+)px`).exec(style ?? "")?.[1]);
  return { x: n("left"), y: n("top"), w: n("width"), h: n("height") };
}

const ID = "0A1B2C3D-4E5F-4A6B-8C7D-9E0F1A2B3C4D";
const page: WatchPage = { id: "P", name: "P", items: [] };
const states = (state: string, brightness = 255): Record<string, HassEntityState> => ({
  "light.lamp": { entity_id: "light.lamp", state, attributes: state === "on" ? { brightness } : {}, last_changed: "", last_updated: "" },
});
const UNIT = 15.5;
const CELL = { width: 6 * UNIT + 10, height: 4 * UNIT + 6 };

type Photos = Partial<Pick<WatchPagePreviewInput, "photo" | "photoSize" | "photoGlow">>;

function face(tile: WatchPageTile, state: string, photos: Photos, brightness = 255): OneLookTileFaceInput {
  const input: WatchPagePreviewInput = { page, pages: [page], screen: { width: 211, height: 251 }, states: states(state, brightness), scale: 1, ...photos };
  return { tile, input, stub: false, device: "watch", look: undefined, width: CELL.width - 1, height: CELL.height - 1, cell: CELL, unit: UNIT, box: "", s: 1 };
}

const lamp = (extra: Partial<WatchPageTile> = {}): WatchPageTile => ({ id: "T", entityId: "light.lamp", customLabel: "Lamp", colSpan: 6, rowSpan: 4, iconPhotoId: ID, ...extra });
const SPARKLE: OneLookGlowRecipe = { x: 0.5, y: 0.25, ...ONE_LOOK_GLOW_PRESETS.sparkle };
const photo = (id: string) => (id === ID ? "blob:lamp" : undefined);
const lit = (glow: OneLookGlowRecipe | undefined): Photos => ({ photo, photoSize: () => ({ width: 200, height: 100 }), photoGlow: () => glow });
const LIGHT_CLASSES = ["ol-light-halo", "ol-light-shade", "ol-light-rays", "ol-light-core"];

describe("a light on a One Look tile", () => {
  it("lit with a light: its halo behind the photo in the pearl halo's place, then the shade, rays and core over it", () => {
    const out = html(renderOneLookTile(face(lamp(), "on", lit(SPARKLE))));
    const at = LIGHT_CLASSES.map((c) => out.indexOf(`class="ol-light ${c}"`));
    const photoAt = out.indexOf(`class="ol-cutout"`);
    expect(at.every((i) => i >= 0)).toBe(true);
    expect(at[0]).toBeLessThan(photoAt);
    expect(photoAt).toBeLessThan(at[1]!);
    expect(at[1]).toBeLessThan(at[2]!);
    expect(at[2]).toBeLessThan(at[3]!);
    expect(out).not.toContain(`class="ol-halo"`);
    expect(out).not.toContain("ol-cutout-glow");
    expect(styleOf(out, "ol-cutout")).not.toContain("filter");
  });

  it("places every layer from the fitted photo rect, and masks the shade with the photo", () => {
    const f = face(lamp(), "on", lit(SPARKLE));
    const model = oneLookPreviewModel(f)!;
    expect(model.cutout?.glow).toEqual(SPARKLE);
    const rect = oneLookCutoutRect(model.layout.discRect, 2).photo;
    const g = oneLookGlowLayers(rect, SPARKLE, model.palette.brightness, oneLookGlowColour(model.palette.hue));
    const out = html(renderOneLookTile(f));
    const halo = place(styleOf(out, "ol-light"));
    expect(halo.x + halo.w / 2).toBeCloseTo(g.halo.cx, 1);
    expect(halo.y + halo.h / 2).toBeCloseTo(g.halo.cy, 1);
    expect(halo.w).toBeCloseTo(g.halo.r * 2, 1);
    const shadeStyle = out.match(/class="ol-light ol-light-shade" style=([^>]*)>/)?.[1] ?? "";
    const shade = place(shadeStyle);
    expect(shade.x).toBeCloseTo(rect.x, 1);
    expect(shade.w).toBeCloseTo(rect.width, 1);
    expect(shade.h).toBeCloseTo(rect.height, 1);
    expect(shadeStyle).toContain(`mask-image:url("blob:lamp")`);
    expect(shadeStyle).toContain(`-webkit-mask-image:url("blob:lamp")`);
    expect(shadeStyle).toContain(`opacity:${Math.round(g.shade.opacity * 10000) / 10000}`);
    expect(shadeStyle).toContain(`circle ${Math.round(g.shade.r * 100) / 100}px at`);
    const [r, gg, b] = g.colour;
    expect(out).toContain(`rgba(${r}, ${gg}, ${b}, ${Math.round(g.halo.alpha * 10000) / 10000}) 0%`);
    const raysStyle = out.match(/class="ol-light ol-light-rays" style=([^>]*)>/)?.[1] ?? "";
    expect(raysStyle).toContain("repeating-conic-gradient(from 8deg");
    expect(raysStyle).toContain("0deg 2.4deg");
    expect(raysStyle).toContain("2.4deg 24deg");
    expect(raysStyle).toContain("#000 12%, transparent 100%");
    expect(out).toContain("rgba(255, 255, 255, 0.95) 0%");
  });

  it("a dimmed light draws its light fainter", () => {
    const full = oneLookPreviewModel(face(lamp(), "on", lit(SPARKLE)))!;
    const half = oneLookPreviewModel(face(lamp(), "on", lit(SPARKLE), 128))!;
    expect(half.palette.brightness).toBeLessThan(full.palette.brightness);
    const level = 0.25 + 0.75 * half.palette.brightness;
    const out = html(renderOneLookTile(face(lamp(), "on", lit(SPARKLE), 128)));
    expect(out).toContain(`rgba(255, 255, 255, ${Math.round(0.95 * level * 10000) / 10000}) 0%`);
  });

  it("no rays at rays 0", () => {
    const out = html(renderOneLookTile(face(lamp(), "on", lit({ ...SPARKLE, rays: 0 }))));
    expect(out).not.toContain("ol-light-rays");
    expect(out).toContain("ol-light-halo");
    expect(out).toContain("ol-light-shade");
    expect(out).toContain("ol-light-core");
  });

  it("not lit: none of the light, gray and dark as without one", () => {
    const off = html(renderOneLookTile(face(lamp(), "off", lit(SPARKLE))));
    expect(off).not.toContain("ol-light");
    expect(styleOf(off, "ol-cutout")).toContain(`filter:${ONE_LOOK_CUTOUT_OFF_FILTER}`);
    expect(off).toBe(html(renderOneLookTile(face(lamp(), "off", lit(undefined)))));
  });

  it("a switch that keeps its colour is bright but not lit: no light, as without one", () => {
    const sw = (on: string): OneLookTileFaceInput => {
      const f = face(lamp({ entityId: "switch.fan", color: "#3B82F6" }), on, lit(SPARKLE));
      f.input.states = { "switch.fan": { entity_id: "switch.fan", state: on, attributes: {}, last_changed: "", last_updated: "" } };
      return f;
    };
    const f = sw("on");
    const drawn = html(renderOneLookTile(f));
    expect(drawn).not.toContain("ol-light");
    expect(drawn).toContain("ol-cutout");
    f.input.photoGlow = () => undefined;
    expect(drawn).toBe(html(renderOneLookTile(f)));
  });

  it("no light in the photo: drawn exactly as before", () => {
    const withNone = html(renderOneLookTile(face(lamp(), "on", lit(undefined))));
    const without = html(renderOneLookTile(face(lamp(), "on", { photo, photoSize: () => ({ width: 200, height: 100 }) })));
    expect(withNone).toBe(without);
    expect(withNone).toContain(`class="ol-halo"`);
    expect(withNone).not.toContain("ol-light");
    expect(oneLookCutoutOf(lamp(), { photo })).toEqual({ url: "blob:lamp" });
  });

  it("draws in a library row's picture when the row has the photos", () => {
    const withTile: WatchPage = { id: "R", name: "R", items: [{ ...lamp(), gridCol: 0, gridRow: 0 }] };
    const drawn = html(renderPageRowPicture({ page: withTile, states: states("on"), photo, photoGlow: () => SPARKLE, photoTick: 1 }));
    expect(drawn).toContain("ol-light-core");
  });
});

// ── the store reads it once ──────────────────────────────────────────────

afterEach(() => forgetPagePhotos());

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function hassAnswering(contentType: string, bytes: Uint8Array): HassLike {
  return {
    states: {},
    connection: {
      sendMessagePromise: async (m: Record<string, unknown>) => ({ image_id: m.image_id, content_type: contentType, data: base64OfBytes(bytes) }),
      subscribeMessage: async () => async () => {},
    },
  } as unknown as HassLike;
}

describe("the photo store and a light", () => {
  it("reads a PNG's light and size once its bytes are in", async () => {
    const bytes = png(300, 150, text(ONE_LOOK_GLOW_KEYWORD, RECIPE), IDAT);
    const store = new PagePhotoStore(() => hassAnswering("image/png", bytes), () => {}, { makeUrl: () => "blob:x" });
    expect(store.glow(ID)).toBeUndefined();
    store.url(ID);
    await flush();
    expect(store.url(ID)).toBe("blob:x");
    expect(store.glow(ID.toLowerCase())?.rays).toBe(0.5);
    // A picture that never reads the list still has the size.
    expect(store.size(ID)).toEqual({ width: 300, height: 150 });
  });

  it("a PNG with no light, or a JPEG, has none", async () => {
    const plain = new PagePhotoStore(() => hassAnswering("image/png", png(20, 20, IDAT)), () => {}, { makeUrl: () => "u" });
    plain.url(ID);
    await flush();
    expect(plain.glow(ID)).toBeUndefined();
    forgetPagePhotos();
    const jpeg = new PagePhotoStore(() => hassAnswering("image/jpeg", png(20, 20, text(ONE_LOOK_GLOW_KEYWORD, RECIPE))), () => {}, { makeUrl: () => "u" });
    jpeg.url(ID);
    await flush();
    expect(jpeg.glow(ID)).toBeUndefined();
    expect(jpeg.size(ID)).toBeUndefined();
  });
});
