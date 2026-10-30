// Light Look: the look the iPhone saves in a tile's icon photo (a PNG
// `tEXt` chunk, keyword `WristAssistantGlow`), read and turned into three
// masks here (one-look/glow.ts), made once in the photo store, and drawn
// while the tile is lit and bright (one-look/render.ts): the tile's own lit
// fill, the aura and beam behind the photo, the emission over it. And the
// On photo (a whole PNG in a `waOn` chunk), read, checked for its size and
// made a URL once in the store, and drawn in the photo's place while the
// tile is lit and bright, with no look over it (app repo
// docs/photo_tiles_plan_2026-10.md, "Light Look" and "On photo"). The mask
// maths is checked on small made up pixels, as the apps check theirs.

import { afterEach, describe, expect, it } from "vitest";

import type { HassEntityState, HassLike } from "../src/ha-api.js";
import { renderPageRowPicture } from "../src/library/row-picture.js";
import type { WatchPage, WatchPageTile } from "../src/watch-pages/model.js";
import { type OneLookPalette, ONE_LOOK_AMBER, oneLookMix } from "../src/watch-pages/one-look/colour.js";
import {
  type OneLookLightMask,
  type OneLookLightPixels,
  type OneLookLightRecipe,
  type OneLookPhotoLight,
  ONE_LOOK_GLOW_KEYWORD,
  ONE_LOOK_LIGHT_DEFAULT,
  ONE_LOOK_ON_CHUNK,
  oneLookAuraMask,
  oneLookBeamMask,
  oneLookBoxBlur,
  oneLookEmitMask,
  oneLookEmitUnblurred,
  oneLookGlowColour,
  oneLookLightMasks,
  oneLookLightPlacement,
  oneLookLightRecipeOf,
  oneLookLightSizes,
  oneLookMaskPixels,
  oneLookSmoothstep,
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

const RECIPE = '{"v":1,"dir":"up","glow":0.5}';
const IDAT = chunk("IDAT", [1, 2, 3, 4]);
const look = (json: string) => readIconPng(png(10, 10, text(ONE_LOOK_GLOW_KEYWORD, json)))?.recipe;

describe("reading the look from the photo's bytes", () => {
  it("reads the size and a look right after IHDR", () => {
    expect(readIconPng(png(120, 90, text(ONE_LOOK_GLOW_KEYWORD, RECIPE), IDAT))).toEqual({ width: 120, height: 90, recipe: { dir: "up", glow: 0.5 } });
  });

  it("finds the chunk anywhere before IEND, after IDAT too", () => {
    expect(readIconPng(png(10, 10, IDAT, chunk("prVt", [9, 9]), text(ONE_LOOK_GLOW_KEYWORD, RECIPE)))?.recipe?.dir).toBe("up");
  });

  it("only the first chunk with the keyword counts", () => {
    const down = '{"v":1,"dir":"down"}';
    expect(readIconPng(png(10, 10, text("Software", "x"), text(ONE_LOOK_GLOW_KEYWORD, RECIPE), text(ONE_LOOK_GLOW_KEYWORD, down)))?.recipe?.dir).toBe("up");
    // A first one that is no look is no look, whatever follows.
    expect(readIconPng(png(10, 10, text(ONE_LOOK_GLOW_KEYWORD, '{"v":2}'), text(ONE_LOOK_GLOW_KEYWORD, RECIPE)))?.recipe).toBeUndefined();
  });

  it("no chunk, or another keyword: no look", () => {
    expect(readIconPng(png(30, 40, IDAT))).toEqual({ width: 30, height: 40 });
    expect(readIconPng(png(30, 40, text("WristAssistantGlo", RECIPE)))?.recipe).toBeUndefined();
    expect(readIconPng(png(30, 40, text("wristassistantglow", RECIPE)))?.recipe).toBeUndefined();
  });

  it("dir is up, down or around; anything else or missing is around", () => {
    expect(look('{"v":1,"dir":"up"}')?.dir).toBe("up");
    expect(look('{"v":1,"dir":"down"}')?.dir).toBe("down");
    expect(look('{"v":1,"dir":"around"}')?.dir).toBe("around");
    for (const bad of ['"UP"', '"sideways"', "5", "null", '["up"]']) expect(look(`{"v":1,"dir":${bad}}`)?.dir, bad).toBe("around");
    expect(look('{"v":1}')).toEqual(ONE_LOOK_LIGHT_DEFAULT);
    expect(ONE_LOOK_LIGHT_DEFAULT).toEqual({ dir: "around", glow: 0.8 });
  });

  it("glow is clamped to 0 to 1, and 0.8 when missing or not a number", () => {
    expect(look('{"v":1,"glow":0.35}')?.glow).toBe(0.35);
    expect(look('{"v":1,"glow":-1}')?.glow).toBe(0);
    expect(look('{"v":1,"glow":3}')?.glow).toBe(1);
    expect(look('{"v":1,"glow":"0.5"}')?.glow).toBe(0.8);
    expect(look('{"v":1,"glow":null}')?.glow).toBe(0.8);
    // Other keys, the first version's among them, are ignored.
    expect(look('{"v":1,"x":0.2,"y":0.3,"rays":0.7,"glow":0.6,"dir":"down"}')).toEqual({ dir: "down", glow: 0.6 });
  });

  it("no look when v is not 1 (missing included), the text is not a JSON object, or it is over 1024 bytes", () => {
    for (const bad of ['{"v":2}', '{"v":"1"}', '{"dir":"up"}', "{", "[1]", "1", "null", '"v"']) expect(look(bad), bad).toBeUndefined();
    const long = `{"v":1,"dir":"up","pad":"${"a".repeat(1001)}"}`;
    expect(long.length).toBe(1028);
    expect(look(long)).toBeUndefined();
    const exact = `{"v":1,"dir":"up","pad":"${"a".repeat(997)}"}`;
    expect(exact.length).toBe(1024);
    expect(look(exact)?.dir).toBe("up");
    expect(oneLookLightRecipeOf([{ v: 1 }])).toBeUndefined();
  });

  it("is not a PNG whose first chunk is IHDR: nothing", () => {
    expect(readIconPng(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBeUndefined();
    const noHeader = png(10, 10);
    noHeader[12] = 0x4a;
    expect(readIconPng(noHeader)).toBeUndefined();
    // Cut off mid chunk: the size still reads, the look does not.
    const cut = png(10, 10, text(ONE_LOOK_GLOW_KEYWORD, RECIPE));
    expect(readIconPng(cut.subarray(0, cut.length - 20))).toEqual({ width: 10, height: 10 });
  });
});

/** A `waOn` chunk holding `inner`, a whole PNG or anything else. */
const onChunk = (inner: Uint8Array | number[]) => chunk(ONE_LOOK_ON_CHUNK, [...inner]);

describe("reading the On photo from the photo's bytes", () => {
  it("takes the data of a waOn chunk before IEND, with the look too", () => {
    const inner = png(120, 90, IDAT);
    const facts = readIconPng(png(120, 90, text(ONE_LOOK_GLOW_KEYWORD, RECIPE), IDAT, onChunk(inner)));
    expect(ONE_LOOK_ON_CHUNK).toBe("waOn");
    expect(facts?.recipe).toEqual({ dir: "up", glow: 0.5 });
    expect([...facts!.on!]).toEqual([...inner]);
    // A look after the On chunk is found as well.
    expect(readIconPng(png(10, 10, onChunk(png(10, 10)), text(ONE_LOOK_GLOW_KEYWORD, RECIPE)))?.recipe?.dir).toBe("up");
  });

  it("only the first waOn chunk counts", () => {
    const first = png(10, 10, chunk("IDAT", [1]));
    const second = png(10, 10, chunk("IDAT", [2]));
    expect([...readIconPng(png(10, 10, IDAT, onChunk(first), onChunk(second)))!.on!]).toEqual([...first]);
    // A first one that does not start with the PNG signature is none, whatever follows.
    const bad = [...first];
    bad[0] = 0x88;
    expect(readIconPng(png(10, 10, IDAT, onChunk(bad), onChunk(second)))?.on).toBeUndefined();
    expect(readIconPng(png(10, 10, onChunk([0x89, 0x50, 0x4e])))?.on).toBeUndefined();
    expect(readIconPng(png(10, 10, onChunk([])))?.on).toBeUndefined();
  });

  it("no chunk, another type, or one cut off: no On photo", () => {
    expect(readIconPng(png(30, 40, IDAT))).toEqual({ width: 30, height: 40 });
    expect(readIconPng(png(30, 40, chunk("waON", [...png(30, 40)])))?.on).toBeUndefined();
    expect(readIconPng(png(30, 40, chunk("wAOn", [...png(30, 40)])))?.on).toBeUndefined();
    const cut = png(30, 40, IDAT, onChunk(png(30, 40, IDAT)));
    expect(readIconPng(cut.subarray(0, cut.length - 20))).toEqual({ width: 30, height: 40 });
  });
});

// ── the masks ────────────────────────────────────────────────────────────

/** A photo of one colour and alpha everywhere. */
function solid(width: number, height: number, rgb: number, alpha = 255): OneLookLightPixels {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) data.set([rgb, rgb, rgb, alpha], i * 4);
  return { width, height, data };
}

function maskOf(width: number, height: number, value: (x: number, y: number) => number): OneLookLightMask {
  const data = new Float32Array(width * height);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) data[y * width + x] = value(x, y);
  return { width, height, data };
}

const at = (m: OneLookLightMask, x: number, y: number) => m.data[y * m.width + x]!;

describe("the masks", () => {
  it("the sizes for a 256 by 384 photo", () => {
    const z = oneLookLightSizes(256, 384);
    expect(z.long).toBe(384);
    expect(z.emitRadius).toBe(2);
    expect(z.pad).toBe(180);
    expect(z.auraRadius).toBe(22);
    expect(z.rim).toBeCloseTo(6.144, 10);
    expect(z.fadeIn).toBeCloseTo(11.904, 10);
    expect(z.fadeLength).toBeCloseTo(119.04, 10);
    // A small photo still blurs its emission by 1.
    expect(oneLookLightSizes(20, 12).emitRadius).toBe(1);
  });

  it("emission: smoothstep(0.40, 0.80, luma) where alpha is at least 0.5, else 0", () => {
    expect(oneLookSmoothstep(0.4, 0.8, 0.6)).toBeCloseTo(0.5, 12);
    // 153 of 255 is luma 0.6 on every weighting.
    expect(at(oneLookEmitUnblurred(solid(2, 2, 153)), 0, 0)).toBeCloseTo(0.5, 6);
    expect(at(oneLookEmitUnblurred(solid(2, 2, 255)), 1, 1)).toBe(1);
    expect(at(oneLookEmitUnblurred(solid(2, 2, 90)), 1, 1)).toBe(0);
    expect(at(oneLookEmitUnblurred(solid(2, 2, 255, 127)), 0, 0)).toBe(0);
    expect(at(oneLookEmitUnblurred(solid(2, 2, 255, 128)), 0, 0)).toBe(1);
    // Rec. 709 weights: pure green is luma 0.7152.
    const green: OneLookLightPixels = { width: 1, height: 1, data: new Uint8ClampedArray([0, 255, 0, 255]) };
    expect(at(oneLookEmitUnblurred(green), 0, 0)).toBeCloseTo(oneLookSmoothstep(0.4, 0.8, 0.7152), 6);
    // Blurred with the edge pixels repeating, a uniform photo stays uniform.
    const e = oneLookEmitMask(solid(9, 7, 153));
    expect(Math.min(...e.data)).toBeCloseTo(0.5, 5);
    expect(Math.max(...e.data)).toBeCloseTo(0.5, 5);
  });

  it("box blur: three passes each way, edges repeating or 0", () => {
    const dot = maskOf(7, 1, (x) => (x === 3 ? 1 : 0));
    const repeat = oneLookBoxBlur(dot, 1, "repeat");
    expect([...repeat.data].map((v) => Math.round(v * 27 * 1000) / 1000)).toEqual([1, 3, 6, 7, 6, 3, 1]);
    // Each pass down a one row mask reads 0 above and below: a third each time.
    const zero = oneLookBoxBlur(dot, 1, "zero");
    expect(at(zero, 3, 0)).toBeCloseTo(7 / 27 / 27, 8);
    // The two directions commute.
    const grid = maskOf(6, 5, (x, y) => ((x * 7 + y * 3) % 5) / 4);
    const both = oneLookBoxBlur(grid, 2, "repeat");
    const t = (m: OneLookLightMask) => maskOf(m.height, m.width, (x, y) => at(m, y, x));
    const flipped = t(oneLookBoxBlur(t(grid), 2, "repeat"));
    for (let i = 0; i < both.data.length; i++) expect(both.data[i]).toBeCloseTo(flipped.data[i]!, 5);
  });

  it("aura: the emission on the padded canvas, blurred, 0 past the edge", () => {
    const emit = maskOf(20, 10, (x, y) => (x >= 8 && x < 12 && y >= 3 && y < 7 ? 1 : 0));
    const z = oneLookLightSizes(20, 10);
    const aura = oneLookAuraMask(emit);
    expect([aura.width, aura.height]).toEqual([20 + 2 * z.pad, 10 + 2 * z.pad]);
    expect(z.pad).toBe(9);
    expect(z.auraRadius).toBe(1);
    expect(at(aura, 0, 0)).toBe(0);
    expect(at(aura, z.pad + 9, z.pad + 4)).toBeGreaterThan(0.5);
    const sum = (m: OneLookLightMask) => m.data.reduce((a, v) => a + v, 0);
    // Nothing reaches the canvas edge, so the blur keeps the whole emission.
    expect(sum(aura)).toBeCloseTo(sum(emit), 3);
  });

  // A 100 by 100 photo, the light's pale part a square from 40 to 59: L
  // 100, p 47, rim offset 1.6, fade in 3.1, fade length 31.
  const square = maskOf(100, 100, (x, y) => (x >= 40 && x <= 59 && y >= 40 && y <= 59 ? 1 : 0.2));
  const P = 47;

  it("beam up: nothing below the rim, symmetric about the light's centre, the numbers", () => {
    const beam = oneLookBeamMask(square, "up")!;
    expect([beam.width, beam.height]).toEqual([194, 194]);
    // t 40, rim 41.6: row 42 and below are 0.
    for (let y = 42; y < 100 + P; y++) for (let x = -P; x < 100 + P; x += 7) expect(at(beam, x + P, y + P)).toBe(0);
    expect(at(beam, 49 + P, 41 + P)).toBeGreaterThan(0);
    // cx 49.5: column 49 less k mirrors column 50 plus k.
    for (const y of [41, 30, 0, -40]) for (let k = 0; k < 49; k++) expect(at(beam, 49 - k + P, y + P)).toBeCloseTo(at(beam, 50 + k + P, y + P), 6);
    // Row 30: dy 11.6, spread 0.5 * 19 + 0.9 * 11.6, fade 1 * exp(-11.6 / 31).
    const dy = 41.6 - 30;
    const spread = 9.5 + 0.9 * dy;
    const fade = Math.min(1, dy / 3.1) * Math.exp(-dy / 31);
    expect(at(beam, 49 + P, 30 + P)).toBeCloseTo((1 - 0.5 / spread) ** 1.5 * fade, 5);
    expect(at(beam, 20 + P, 30 + P)).toBeCloseTo(Math.max(0, 1 - 29.5 / spread) ** 1.5 * fade, 5);
    // Row 41: dy 0.6, faded in by 0.6 / 3.1.
    expect(at(beam, 49 + P, 41 + P)).toBeCloseTo((1 - 0.5 / (9.5 + 0.54)) ** 1.5 * (0.6 / 3.1) * Math.exp(-0.6 / 31), 5);
  });

  it("beam down: nothing above the rim; around and no pale part: no beam", () => {
    const beam = oneLookBeamMask(square, "down")!;
    // b 59, rim 57.4: row 57 and above are 0, row 58 lit.
    for (let y = -P; y <= 57; y++) expect(at(beam, 49 + P, y + P)).toBe(0);
    expect(at(beam, 49 + P, 58 + P)).toBeGreaterThan(0);
    // Row 70 is 12.6 past the bottom rim, as row 29 is past the top one going up.
    expect(at(beam, 49 + P, 70 + P)).toBeGreaterThan(0);
    expect(at(beam, 49 + P, 70 + P)).toBeCloseTo(at(oneLookBeamMask(square, "up")!, 49 + P, 29 + P), 6);
    expect(oneLookBeamMask(square, "around")).toBeUndefined();
    // No pixel over 0.3 (0.3 itself is stored as a float a hair over it).
    expect(oneLookBeamMask(maskOf(30, 30, () => 0.29), "up")).toBeUndefined();
    expect(oneLookBeamMask(maskOf(30, 30, () => 0), "down")).toBeUndefined();
  });

  it("all three from pixels, and a mask as alpha pixels", () => {
    const pixels = solid(20, 20, 0);
    for (let y = 8; y < 12; y++) for (let x = 8; x < 12; x++) pixels.data.set([255, 255, 255, 255], (y * 20 + x) * 4);
    const set = oneLookLightMasks(pixels, "up");
    expect(set.pad).toBe(9);
    expect([set.emit.width, set.emit.height]).toEqual([20, 20]);
    expect([set.aura.width, set.aura.height, set.beam?.width]).toEqual([38, 38, 38]);
    expect(oneLookLightMasks(pixels, "around").beam).toBeUndefined();
    const out = oneLookMaskPixels(maskOf(3, 1, (x) => [0, 0.5, 1][x]!));
    expect([...out]).toEqual([255, 255, 255, 0, 255, 255, 255, 128, 255, 255, 255, 255]);
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
  const tag = new RegExp(`<[a-z]+ class="${cls}"[^>]*?style=([^>]*)>`).exec(out);
  return tag?.[1]?.replace(/\s*\/$/, "");
}

function tileStyle(out: string): string {
  return /<div class="wp-tile ol-tile"[^>]*?style=([^>]*?)\s*title/.exec(out)?.[1] ?? "";
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

type Photos = Partial<Pick<WatchPagePreviewInput, "photo" | "photoSize" | "photoGlow" | "photoOn">>;

function face(tile: WatchPageTile, state: string, photos: Photos, o: { brightness?: number; device?: "watch" | "phone" } = {}): OneLookTileFaceInput {
  const input: WatchPagePreviewInput = { page, pages: [page], screen: { width: 211, height: 251 }, states: states(state, o.brightness ?? 255), scale: 1, ...photos };
  return { tile, input, stub: false, device: o.device ?? "watch", look: undefined, width: CELL.width - 1, height: CELL.height - 1, cell: CELL, unit: UNIT, box: "", s: 1 };
}

const lamp = (extra: Partial<WatchPageTile> = {}): WatchPageTile => ({ id: "T", entityId: "light.lamp", customLabel: "Lamp", colSpan: 6, rowSpan: 4, iconPhotoId: ID, ...extra });
const photo = (id: string) => (id === ID ? "blob:lamp" : undefined);
const LIGHT = (recipe: OneLookLightRecipe = { dir: "up", glow: 0.8 }): OneLookPhotoLight => ({
  recipe, width: 200, height: 100, pad: 94, emit: "blob:emit", aura: "blob:aura", ...(recipe.dir === "around" ? {} : { beam: "blob:beam" }),
});
const lit = (light: OneLookPhotoLight | undefined): Photos => ({ photo, photoSize: () => ({ width: 200, height: 100 }), photoGlow: () => light });
const LAYERS = ["ol-light-aura", "ol-light-beam", "ol-light-emit"];

describe("a look on a One Look tile", () => {
  it("lit: aura and beam behind the photo in the pearl halo's place, the emission over it", () => {
    const out = html(renderOneLookTile(face(lamp(), "on", lit(LIGHT()))));
    const aura = out.indexOf(`class="ol-light ol-light-aura"`);
    const beam = out.indexOf(`class="ol-light ol-light-beam"`);
    const img = out.indexOf(`class="ol-cutout"`);
    const emit = out.indexOf(`class="ol-light ol-light-emit"`);
    expect(aura).toBeGreaterThan(0);
    expect(aura).toBeLessThan(beam);
    expect(beam).toBeLessThan(img);
    expect(img).toBeLessThan(emit);
    expect(out).not.toContain(`class="ol-halo"`);
    expect(out).not.toContain("ol-cutout-glow");
    expect(styleOf(out, "ol-cutout")).not.toContain("filter");
  });

  it("places and colours each layer: the emission on the photo, the aura and beam reaching the padding past it", () => {
    const f = face(lamp(), "on", lit(LIGHT()));
    const model = oneLookPreviewModel(f)!;
    const rect = oneLookCutoutRect(model.layout.discRect, 2).photo;
    const out = html(renderOneLookTile(f));
    const emit = place(styleOf(out, "ol-light ol-light-emit"));
    expect(emit.x).toBeCloseTo(rect.x, 1);
    expect(emit.w).toBeCloseTo(rect.width, 1);
    expect(emit.h).toBeCloseTo(rect.height, 1);
    const reach = 94 * (rect.width / 200);
    for (const cls of ["ol-light ol-light-aura", "ol-light ol-light-beam"]) {
      const p = place(styleOf(out, cls));
      expect(p.x).toBeCloseTo(rect.x - reach, 1);
      expect(p.y).toBeCloseTo(rect.y - reach, 1);
      expect(p.w).toBeCloseTo(rect.width + 2 * reach, 1);
      expect(p.h).toBeCloseTo(rect.height + 2 * reach, 1);
    }
    const [r, g, b] = oneLookMix(ONE_LOOK_AMBER, [255, 255, 255], 0.35);
    expect([r, g, b]).toEqual([247, 202, 140]);
    // Full brightness, glow 0.8: g is 0.8.
    expect(styleOf(out, "ol-light ol-light-aura")).toContain(`background:rgba(247, 202, 140, 1);opacity:0.76;-webkit-mask-image:url("blob:aura");mask-image:url("blob:aura")`);
    expect(styleOf(out, "ol-light ol-light-beam")).toContain(`opacity:0.72;-webkit-mask-image:url("blob:beam")`);
    expect(styleOf(out, "ol-light ol-light-emit")).toContain(`opacity:0.68;-webkit-mask-image:url("blob:emit")`);
  });

  it("the level follows the brightness, and the colour the tile's hue", () => {
    const place2 = oneLookLightPlacement({ x: 0, y: 0, width: 50, height: 25 }, LIGHT({ dir: "down", glow: 0.5 }), 0.4, [1, 2, 3]);
    expect(place2.level).toBeCloseTo(0.5 * (0.25 + 0.75 * 0.4), 10);
    expect(place2.aura.opacity).toBeCloseTo(0.95 * place2.level, 10);
    expect(place2.beam!.opacity).toBeCloseTo(0.9 * place2.level, 10);
    expect(place2.emit.opacity).toBeCloseTo(0.85 * place2.level, 10);
    expect(place2.aura.rect).toEqual({ x: -23.5, y: -23.5, width: 97, height: 72 });
    expect(oneLookGlowColour([0, 100, 200])).toEqual([89, 154, 219]);
    const half = html(renderOneLookTile(face(lamp(), "on", lit(LIGHT()), { brightness: 128 })));
    const b = oneLookPreviewModel(face(lamp(), "on", lit(LIGHT()), { brightness: 128 }))!.palette.brightness;
    expect(b).toBeLessThan(1);
    expect(styleOf(half, "ol-light ol-light-emit")).toContain(`opacity:${Math.round(0.85 * 0.8 * (0.25 + 0.75 * b) * 10000) / 10000}`);
  });

  it("the tile keeps its lit fill, sheen, Fill style bar, under-glow, rim and inks, as any lit tile", () => {
    const rim = (out: string) => /class="ol-rim" style=([^>]*)>/.exec(out)?.[1];
    const name = (out: string) => /class="ol-name" style=([^>]*)>/.exec(out)?.[1];
    // Everything under the content (the fill, its layers, the underlay).
    const under = (out: string) => out.slice(0, out.indexOf(`class="ol-content"`));
    for (const extra of [{}, { stateBarStyle: "Fill" }] as Partial<WatchPageTile>[]) {
      const glowing = html(renderOneLookTile(face(lamp(extra), "on", lit(LIGHT()), { device: "phone", brightness: 128 })));
      const plain = html(renderOneLookTile(face(lamp(extra), "on", lit(undefined), { device: "phone", brightness: 128 })));
      expect(glowing).toContain("ol-light-emit");
      expect(under(glowing)).toBe(under(plain));
      expect(under(glowing).includes(`class="ol-fill"`)).toBe(extra.stateBarStyle === "Fill");
      expect(rim(glowing)).toBe(rim(plain));
      expect(name(glowing)).toBe(name(plain));
    }
    const day = html(renderOneLookTile(face(lamp(), "on", lit(LIGHT()), { device: "phone" })));
    const off = html(renderOneLookTile(face(lamp(), "off", lit(undefined), { device: "phone" })));
    expect(tileStyle(day)).toContain("box-shadow");
    expect(tileStyle(day)).not.toBe(tileStyle(off));
    expect(rim(day)).not.toBe(rim(off));
  });

  it("all around: no beam", () => {
    const out = html(renderOneLookTile(face(lamp(), "on", lit(LIGHT({ dir: "around", glow: 0.8 })))));
    expect(out).not.toContain("ol-light-beam");
    expect(out).toContain("ol-light-aura");
    expect(out).toContain("ol-light-emit");
  });

  it("not lit: none of it, gray and dark as without a look", () => {
    const off = html(renderOneLookTile(face(lamp(), "off", lit(LIGHT()))));
    for (const l of LAYERS) expect(off).not.toContain(l);
    expect(styleOf(off, "ol-cutout")).toContain(`filter:${ONE_LOOK_CUTOUT_OFF_FILTER}`);
    expect(off).toBe(html(renderOneLookTile(face(lamp(), "off", lit(undefined)))));
  });

  it("a switch that is on glows as a light does; off, none of it", () => {
    const f = face(lamp({ entityId: "switch.fan", color: "#3B82F6" }), "on", lit(LIGHT()));
    f.input.states = { "switch.fan": { entity_id: "switch.fan", state: "on", attributes: {}, last_changed: "", last_updated: "" } };
    const drawn = html(renderOneLookTile(f));
    for (const l of LAYERS) expect(drawn).toContain(l);
    f.input.states = { "switch.fan": { entity_id: "switch.fan", state: "off", attributes: {}, last_changed: "", last_updated: "" } };
    const off = html(renderOneLookTile(f));
    expect(off).not.toContain("ol-light");
    expect(off).toContain("ol-cutout");
    f.input.photoGlow = () => undefined;
    expect(off).toBe(html(renderOneLookTile(f)));
  });

  it("dimmed (wrist down) or not lit: no look", () => {
    const p = (surface: string, isLit: boolean, aod = false) => ({ surface, isLit, aod }) as unknown as OneLookPalette;
    expect(oneLookCutoutGlows(p("coloured", true), true)).toBe(true);
    expect(oneLookCutoutGlows(p("coloured", true, true), true)).toBe(false);
    expect(oneLookCutoutGlows(p("graphite", false), true)).toBe(false);
    expect(oneLookCutoutGlows(p("coloured", false), false)).toBe(false);
    // Another kind that is on glows, coloured or graphite; not wrist down.
    expect(oneLookCutoutGlows(p("coloured", false), false, true)).toBe(true);
    expect(oneLookCutoutGlows(p("graphite", false), false, true)).toBe(true);
    expect(oneLookCutoutGlows(p("graphite", false, true), false, true)).toBe(false);
  });

  it("no look in the photo: drawn exactly as before", () => {
    const withNone = html(renderOneLookTile(face(lamp(), "on", lit(undefined))));
    const without = html(renderOneLookTile(face(lamp(), "on", { photo, photoSize: () => ({ width: 200, height: 100 }) })));
    expect(withNone).toBe(without);
    expect(withNone).toContain(`class="ol-halo"`);
    expect(withNone).not.toContain("ol-light");
    expect(oneLookCutoutOf(lamp(), { photo })).toEqual({ url: "blob:lamp" });
  });

  it("the photo's size comes from the look when the picture has no list", () => {
    expect(oneLookCutoutOf(lamp(), { photo, photoGlow: () => LIGHT() })?.aspect).toBe(2);
  });

  it("a hidden photo draws none of it", () => {
    const f = face(lamp(), "on", { ...lit(LIGHT()), photoOn: () => "blob:on" });
    f.hidden = { glyph: true, name: false, state: false };
    const out = html(renderOneLookTile(f));
    expect(out).not.toContain("ol-light");
    expect(out).not.toContain("blob:on");
    const day = face(lamp(), "on", lit(undefined));
    day.hidden = f.hidden;
    expect(out).toBe(html(renderOneLookTile(day)));
  });

  it("draws in a library row's picture when the row has the photos", () => {
    const withTile: WatchPage = { id: "R", name: "R", items: [{ ...lamp(), gridCol: 0, gridRow: 0 }] };
    const drawn = html(renderPageRowPicture({ page: withTile, states: states("on"), photo, photoGlow: () => LIGHT(), photoTick: 1 }));
    expect(drawn).toContain("ol-light-emit");
  });
});

describe("an On photo on a One Look tile", () => {
  const withOn = (light?: OneLookPhotoLight): Photos => ({ ...lit(light), photoOn: (id) => (id === ID ? "blob:on" : undefined) });
  const src = (out: string) => /<img class="ol-cutout"[^>]*?src=([^ >]*)/.exec(out)?.[1];

  it("lit and bright: the On photo in the photo's place, no filter, the halo as for any photo", () => {
    const out = html(renderOneLookTile(face(lamp(), "on", withOn())));
    expect(src(out)).toBe("blob:on");
    expect(styleOf(out, "ol-cutout")).not.toContain("filter");
    expect(out).toContain(`class="ol-halo"`);
    // Drawn as the Off photo would be, but for the picture.
    expect(out.replace("blob:on", "blob:lamp")).toBe(html(renderOneLookTile(face(lamp(), "on", lit(undefined)))));
    expect(oneLookCutoutOf(lamp(), withOn())?.on).toBe("blob:on");
  });

  it("the real photo wins over a look: none of the look's layers", () => {
    const out = html(renderOneLookTile(face(lamp(), "on", withOn(LIGHT()))));
    expect(src(out)).toBe("blob:on");
    for (const l of LAYERS) expect(out).not.toContain(l);
    expect(out).toBe(html(renderOneLookTile(face(lamp(), "on", withOn()))));
  });

  it("not lit: the Off photo, gray and dark", () => {
    const out = html(renderOneLookTile(face(lamp(), "off", withOn(LIGHT()))));
    expect(src(out)).toBe("blob:lamp");
    expect(out).not.toContain("blob:on");
    expect(styleOf(out, "ol-cutout")).toContain(`filter:${ONE_LOOK_CUTOUT_OFF_FILTER}`);
    expect(out).toBe(html(renderOneLookTile(face(lamp(), "off", lit(undefined)))));
  });

  it("a switch that is on shows its On photo; off and keeping its colour, the Off photo, bright", () => {
    const f = face(lamp({ entityId: "switch.fan", color: "#3B82F6" }), "on", withOn());
    f.input.states = { "switch.fan": { entity_id: "switch.fan", state: "on", attributes: {}, last_changed: "", last_updated: "" } };
    const on = html(renderOneLookTile(f));
    expect(src(on)).toBe("blob:on");
    expect(styleOf(on, "ol-cutout")).not.toContain("filter");
    f.input.states = { "switch.fan": { entity_id: "switch.fan", state: "off", attributes: {}, last_changed: "", last_updated: "" } };
    const off = html(renderOneLookTile(f));
    expect(src(off)).toBe("blob:lamp");
    expect(styleOf(off, "ol-cutout")).not.toContain("filter");
  });

  it("draws in a library row's picture when the row has the photos", () => {
    const withTile: WatchPage = { id: "R", name: "R", items: [{ ...lamp(), gridCol: 0, gridRow: 0 }] };
    const drawn = html(renderPageRowPicture({ page: withTile, states: states("on"), photo, photoOn: () => "blob:on", photoTick: 2 }));
    expect(drawn).toContain("blob:on");
  });
});

// ── the store makes the masks once ───────────────────────────────────────

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

describe("the photo store and a look", () => {
  it("makes a PNG's masks once its bytes are in, then redraws once", async () => {
    const bytes = png(300, 150, text(ONE_LOOK_GLOW_KEYWORD, RECIPE), IDAT);
    const made: { bytes: Uint8Array; recipe: OneLookLightRecipe }[] = [];
    let changed = 0;
    const store = new PagePhotoStore(() => hassAnswering("image/png", bytes), () => changed++, {
      makeUrl: () => "blob:x",
      makeLight: async (b, recipe) => {
        made.push({ bytes: b, recipe });
        return { recipe, width: 300, height: 150, pad: 141, emit: "e", aura: "a", beam: "b" };
      },
    });
    expect(store.glow(ID)).toBeUndefined();
    store.url(ID);
    await flush();
    expect(store.url(ID)).toBe("blob:x");
    expect(changed).toBe(1);
    expect(made).toHaveLength(1);
    expect([...made[0]!.bytes]).toEqual([...bytes]);
    expect(made[0]!.recipe).toEqual({ dir: "up", glow: 0.5 });
    expect(store.glow(ID.toLowerCase())?.emit).toBe("e");
    // A picture that never reads the list still has the size.
    expect(store.size(ID)).toEqual({ width: 300, height: 150 });
    // A second store reads the same memory and makes nothing again.
    const other = new PagePhotoStore(() => hassAnswering("image/png", bytes), () => {}, { makeLight: async () => { throw new Error("again"); } });
    expect(other.glow(ID)?.aura).toBe("a");
  });

  it("a PNG with no look, or a JPEG, makes no masks; masks that fail draw no light", async () => {
    let calls = 0;
    const makeLight = async () => {
      calls++;
      return undefined;
    };
    const plain = new PagePhotoStore(() => hassAnswering("image/png", png(20, 20, IDAT)), () => {}, { makeUrl: () => "u", makeLight });
    plain.url(ID);
    await flush();
    expect(plain.glow(ID)).toBeUndefined();
    forgetPagePhotos();
    const jpeg = new PagePhotoStore(() => hassAnswering("image/jpeg", png(20, 20, text(ONE_LOOK_GLOW_KEYWORD, RECIPE))), () => {}, { makeUrl: () => "u", makeLight });
    jpeg.url(ID);
    await flush();
    expect(jpeg.glow(ID)).toBeUndefined();
    expect(jpeg.size(ID)).toBeUndefined();
    expect(calls).toBe(0);
    forgetPagePhotos();
    const failing = new PagePhotoStore(() => hassAnswering("image/png", png(20, 20, text(ONE_LOOK_GLOW_KEYWORD, RECIPE))), () => {}, {
      makeUrl: () => "u",
      makeLight: async () => { throw new Error("no canvas"); },
    });
    failing.url(ID);
    await flush();
    expect(failing.url(ID)).toBe("u");
    expect(failing.glow(ID)).toBeUndefined();
  });
});

describe("the photo store and an On photo", () => {
  /** A store over `bytes` whose On maker reports `decoded` as the size it
   * decodes to, and which notes every URL made and revoked. */
  function storeFor(bytes: Uint8Array, decoded: { width: number; height: number } | undefined, o: { onChanged?: () => void } = {}) {
    const made: Uint8Array[] = [];
    const revoked: string[] = [];
    let lights = 0;
    const store = new PagePhotoStore(() => hassAnswering("image/png", bytes), o.onChanged ?? (() => {}), {
      makeUrl: () => "blob:off",
      makeOn: async (b) => {
        made.push(b);
        return decoded === undefined ? undefined : { url: `blob:on${made.length}`, ...decoded };
      },
      revokeUrl: (url) => revoked.push(url),
      makeLight: async (_b, recipe) => {
        lights++;
        return { recipe, width: 40, height: 20, pad: 19, emit: "e", aura: "a" };
      },
    });
    return { store, made, revoked, lights: () => lights };
  }

  it("makes the On photo's URL once its bytes are in and its size checks out, and makes no masks", async () => {
    const inner = png(40, 20, chunk("IDAT", [7]));
    let changed = 0;
    const { store, made, revoked, lights } = storeFor(png(40, 20, text(ONE_LOOK_GLOW_KEYWORD, RECIPE), IDAT, onChunk(inner)), { width: 40, height: 20 }, { onChanged: () => changed++ });
    expect(store.onUrl(ID)).toBeUndefined();
    store.url(ID);
    await flush();
    expect(store.url(ID)).toBe("blob:off");
    expect(store.onUrl(ID.toLowerCase())).toBe("blob:on1");
    expect(changed).toBe(1);
    expect(made.map((b) => [...b])).toEqual([[...inner]]);
    expect(revoked).toEqual([]);
    // The On photo wins whenever the look would draw: no masks are made.
    expect(lights()).toBe(0);
    expect(store.glow(ID)).toBeUndefined();
    // A second store reads the same memory and makes nothing again.
    const other = new PagePhotoStore(() => hassAnswering("image/png", inner), () => {}, { makeOn: async () => { throw new Error("again"); } });
    expect(other.onUrl(ID)).toBe("blob:on1");
  });

  it("an On photo whose IHDR names another size is never decoded; the look then draws", async () => {
    const { store, made, lights } = storeFor(png(40, 20, text(ONE_LOOK_GLOW_KEYWORD, RECIPE), IDAT, onChunk(png(40, 21))), { width: 40, height: 20 });
    store.url(ID);
    await flush();
    expect(store.onUrl(ID)).toBeUndefined();
    expect(made).toHaveLength(0);
    expect(lights()).toBe(1);
    expect(store.glow(ID)?.emit).toBe("e");
  });

  it("one that decodes to another size has its URL revoked; one that does not decode is none", async () => {
    const bytes = png(40, 20, IDAT, onChunk(png(40, 20)));
    const wrong = storeFor(bytes, { width: 20, height: 10 });
    wrong.store.url(ID);
    await flush();
    expect(wrong.made).toHaveLength(1);
    expect(wrong.store.onUrl(ID)).toBeUndefined();
    expect(wrong.revoked).toEqual(["blob:on1"]);
    expect(wrong.store.url(ID)).toBe("blob:off");
    forgetPagePhotos();
    const broken = storeFor(bytes, undefined);
    broken.store.url(ID);
    await flush();
    expect(broken.made).toHaveLength(1);
    expect(broken.store.onUrl(ID)).toBeUndefined();
    expect(broken.revoked).toEqual([]);
    forgetPagePhotos();
    const failing = new PagePhotoStore(() => hassAnswering("image/png", bytes), () => {}, { makeUrl: () => "u", makeOn: async () => { throw new Error("no canvas"); } });
    failing.url(ID);
    await flush();
    expect(failing.url(ID)).toBe("u");
    expect(failing.onUrl(ID)).toBeUndefined();
  });

  it("no waOn chunk, a bad one, or a JPEG: no On photo, nothing made", async () => {
    for (const [type, bytes] of [
      ["image/png", png(40, 20, IDAT)],
      ["image/png", png(40, 20, IDAT, onChunk([1, 2, 3, 4, 5, 6, 7, 8, 9]))],
      ["image/jpeg", png(40, 20, IDAT, onChunk(png(40, 20)))],
    ] as const) {
      forgetPagePhotos();
      let calls = 0;
      const store = new PagePhotoStore(() => hassAnswering(type, bytes), () => {}, { makeUrl: () => "u", makeOn: async () => { calls++; return { url: "x", width: 40, height: 20 }; } });
      store.url(ID);
      await flush();
      expect(store.onUrl(ID)).toBeUndefined();
      expect(calls).toBe(0);
    }
  });
});
