// On photo tint (app repo docs/photo_tiles_plan_2026-10.md, "On photo
// tint", revision 2): the glow mask W from the On photo's bright, lit
// pixels, made once in the photo store; the tint colour C and level k from a
// light's live state; a
// light's On photo drawn as the Off photo, the On photo at k and C multiply
// blended through W at k, in the normal look and the Clear look; and the
// Clear look's clean glow, screen blended. The numbers are shared with the
// watch and the iPhone, which check theirs the same way.

import { afterEach, describe, expect, it } from "vitest";

import type { HassEntityState, HassLike } from "../src/ha-api.js";
import type { WatchPage, WatchPageTile } from "../src/watch-pages/model.js";
import type { OneLookLightPixels } from "../src/watch-pages/one-look/glow.js";
import { type OneLookTileFaceInput, ONE_LOOK_CLEAR, oneLookClearGlowColour, oneLookPreviewModel, renderOneLookTile } from "../src/watch-pages/one-look/render.js";
import {
  ONE_LOOK_TINT,
  oneLookKelvinRGB,
  oneLookOnGlowMask,
  oneLookOnMaskRadius,
  oneLookOnTintMask,
  oneLookTintColour,
  oneLookTintLevel,
  oneLookTintOf,
  oneLookTintRGB8,
} from "../src/watch-pages/one-look/tint.js";
import { PagePhotoStore, base64OfBytes, forgetPagePhotos } from "../src/watch-pages/page-photo-store.js";
import type { WatchPagePreviewInput } from "../src/watch-pages/preview.js";

// ── the glow mask W ──────────────────────────────────────────────────────

/** A photo of one grey `v` (0 to 255) and one alpha, `w` by `h`; `at` sets
 * a pixel's grey of its own. */
function grey(w: number, h: number, v: number, alpha = 255, at?: (x: number, y: number) => number | undefined): OneLookLightPixels {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      const g = at?.(x, y) ?? v;
      data[o] = g;
      data[o + 1] = g;
      data[o + 2] = g;
      data[o + 3] = alpha;
    }
  }
  return { width: w, height: h, data };
}

const maxOf = (d: Float32Array) => d.reduce((m, v) => Math.max(m, v), 0);
const minOf = (d: Float32Array) => d.reduce((m, v) => Math.min(m, v), 1);

describe("the glow mask W (from the On photo alone)", () => {
  it("a dark On photo gives 0 everywhere; a bright one gives 1", () => {
    // Luma 0.2 is under the 0.38 edge, 0.9 over the 0.80 one.
    const dark = oneLookOnGlowMask(grey(40, 30, 51))!;
    expect(dark.width).toBe(40);
    expect(dark.height).toBe(30);
    expect(maxOf(dark.data)).toBe(0);
    expect(minOf(oneLookOnGlowMask(grey(20, 20, 230))!.data)).toBeCloseTo(1, 6);
  });

  it("a bright patch gives 1 deep inside, 0 far outside, soft between", () => {
    // A 40 by 40 bright patch in a dark 100 by 100 photo (blur radius 4).
    const patch = (x: number, y: number) => (x >= 30 && x < 70 && y >= 30 && y < 70 ? 230 : undefined);
    const w = oneLookOnGlowMask(grey(100, 100, 51, 255, patch))!;
    expect(w.data[50 * 100 + 50]).toBeCloseTo(1, 6);
    expect(w.data[5 * 100 + 5]).toBe(0);
    const edge = w.data[50 * 100 + 30]!;
    expect(edge).toBeGreaterThan(0);
    expect(edge).toBeLessThan(1);
  });

  it("follows smoothstep(0.38, 0.80, luma) between the edges", () => {
    const t = (oneLookLumaOf(150) - 0.38) / (0.8 - 0.38);
    const w = oneLookOnGlowMask(grey(10, 10, 150))!;
    expect(w.data[55]).toBeCloseTo(t * t * (3 - 2 * t), 5);
    expect(ONE_LOOK_TINT).toMatchObject({ maskLow: 0.38, maskHigh: 0.8 });
  });

  it("alpha 0 gives 0, and its alpha scales W", () => {
    expect(maxOf(oneLookOnGlowMask(grey(20, 20, 230, 0))!.data)).toBe(0);
    expect(maxOf(oneLookOnTintMask(grey(20, 20, 230, 0))!.data)).toBe(0);
    const half = oneLookOnGlowMask(grey(20, 20, 230, 128))!;
    expect(half.data[210]).toBeCloseTo(128 / 255, 5);
    // The tint layer's mask is W clipped to the On photo's alpha.
    expect(oneLookOnTintMask(grey(20, 20, 230, 128))!.data[210]).toBeCloseTo((128 / 255) ** 2, 5);
  });

  it("is blurred by 4% of the long side (at least 1 pixel); pixels short of the size give none", () => {
    expect(oneLookOnMaskRadius(256, 384)).toBe(15);
    expect(oneLookOnMaskRadius(100, 100)).toBe(4);
    expect(oneLookOnMaskRadius(40, 20)).toBe(2);
    expect(oneLookOnMaskRadius(10, 10)).toBe(1);
    expect(ONE_LOOK_TINT.blurShare).toBe(0.04);
    expect(oneLookOnGlowMask({ width: 20, height: 20, data: new Uint8ClampedArray(10) })).toBeUndefined();
  });
});

function oneLookLumaOf(v: number): number {
  return (0.2126 + 0.7152 + 0.0722) * (v / 255);
}

// ── the tint colour C and the level k ────────────────────────────────────

describe("the tint colour C", () => {
  it("4000 K is white, by kelvin or by mireds", () => {
    expect(oneLookTintColour({ color_mode: "color_temp", color_temp_kelvin: 4000 })).toEqual({ colour: [1, 1, 1], known: true });
    const byMireds = oneLookTintColour({ color_mode: "color_temp", color_temp: 250 });
    expect(byMireds.known).toBe(true);
    for (const c of byMireds.colour) expect(c).toBeCloseTo(1, 10);
  });

  it("2700 K is warm: red 1, blue under green under 1", () => {
    const { colour: [r, g, b], known } = oneLookTintColour({ color_mode: "color_temp", color_temp_kelvin: 2700 });
    expect(known).toBe(true);
    expect(r).toBe(1);
    expect(g).toBeLessThan(1);
    expect(b).toBeLessThan(g);
    // kelvinRGB(2700) / kelvinRGB(4000), then 85% from white.
    const at = oneLookKelvinRGB(2700);
    const white = oneLookKelvinRGB(4000);
    expect(g).toBeCloseTo(1 + (at[1] / white[1] - 1) * 0.85, 10);
    expect(b).toBeCloseTo(1 + (at[2] / white[2] - 1) * 0.85, 10);
  });

  it("a cool white is blue: blue 1, red under 1", () => {
    const { colour: [r, , b] } = oneLookTintColour({ color_mode: "color_temp", color_temp_kelvin: 6500 });
    expect(b).toBe(1);
    expect(r).toBeLessThan(1);
  });

  it("rgb (255, 0, 0) gives (1, 0.15, 0.15), in every colour mode that has it", () => {
    for (const mode of ["hs", "rgb", "rgbw", "rgbww", "xy"]) {
      const { colour, known } = oneLookTintColour({ color_mode: mode, rgb_color: [255, 0, 0] });
      expect(known, mode).toBe(true);
      expect(colour[0], mode).toBe(1);
      expect(colour[1], mode).toBeCloseTo(0.15, 10);
      expect(colour[2], mode).toBeCloseTo(0.15, 10);
    }
    // Normalised to its largest channel first.
    const dim = oneLookTintColour({ color_mode: "hs", rgb_color: [128, 0, 0] }).colour;
    expect(dim[0]).toBe(1);
    expect(dim[1]).toBeCloseTo(0.15, 10);
    expect(oneLookTintRGB8(dim)).toEqual([255, 38, 38]);
  });

  it("an unknown white is white: on/off, brightness or white mode, colour_temp with no temperature, black, or nothing", () => {
    for (const attrs of [
      undefined,
      {},
      { color_mode: "onoff" },
      { color_mode: "brightness", brightness: 100 },
      { color_mode: "white", rgb_color: [255, 0, 0] },
      { color_mode: "color_temp", rgb_color: [255, 120, 0] },
      { rgb_color: [255, 0, 0] },
      { color_mode: "rgb", rgb_color: [0, 0, 0] },
      { color_mode: "rgb", rgb_color: "red" },
    ]) {
      const { colour } = oneLookTintColour(attrs);
      expect(colour, JSON.stringify(attrs)).toEqual([1, 1, 1]);
    }
    expect(oneLookTintColour({ color_mode: "rgb", rgb_color: [0, 0, 0] }).known).toBe(true);
    expect(oneLookTintColour({ color_mode: "onoff" }).known).toBe(false);
  });
});

describe("the level k", () => {
  it("is 0.35 + 0.65 b, b the brightness over 255, else 1", () => {
    expect(oneLookTintLevel(0)).toBeCloseTo(0.35, 10);
    expect(oneLookTintLevel(128)).toBeCloseTo(0.35 + 0.65 * (128 / 255), 10);
    expect(oneLookTintLevel(255)).toBe(1);
    expect(oneLookTintLevel(undefined)).toBe(1);
    expect(oneLookTintLevel("bright")).toBe(1);
    expect(oneLookTintLevel(300)).toBe(1);
    expect(oneLookTintOf({ brightness: 0 }).level).toBeCloseTo(0.35, 10);
  });
});

// ── drawing ──────────────────────────────────────────────────────────────

function html(t: unknown): string {
  if (typeof t === "symbol" || t === null || t === undefined) return "";
  if (Array.isArray(t)) return t.map(html).join("");
  if (typeof t !== "object") return String(t);
  const r = t as { strings?: readonly string[]; values?: unknown[] };
  if (r.strings === undefined) return "";
  return r.strings.map((s, i) => s + (i < (r.values?.length ?? 0) ? html(r.values![i]) : "")).join("");
}

/** Every element whose class list starts with `cls`: its src and style. */
function all(out: string, cls: string): { src?: string; style: string }[] {
  return [...out.matchAll(new RegExp(`<[a-z]+ class="${cls}(?: [^"]*)?"([^>]*)>`, "g"))].map((m) => {
    const attrs = m[1]!;
    const src = /src=([^ >]*)/.exec(attrs)?.[1];
    const style = (/style=([^>]*)/.exec(attrs)?.[1] ?? "").replace(/\s*\/$/, "");
    return { ...(src === undefined ? {} : { src }), style };
  });
}

const ID = "0A1B2C3D-4E5F-4A6B-8C7D-9E0F1A2B3C4D";
const page: WatchPage = { id: "P", name: "P", items: [] };
const UNIT = 15.5;
const CELL = { width: 6 * UNIT + 10, height: 4 * UNIT + 6 };
type Photos = Partial<Pick<WatchPagePreviewInput, "photo" | "photoSize" | "photoGlow" | "photoOn" | "photoOnMask">>;
const PHOTOS: Photos = {
  photo: (id) => (id === ID ? "blob:off" : undefined),
  photoSize: () => ({ width: 200, height: 100 }),
  photoOn: (id) => (id === ID ? "blob:on" : undefined),
  photoOnMask: (id) => (id === ID ? "blob:mask" : undefined),
};

function face(tile: WatchPageTile, entityId: string, state: string, attributes: Record<string, unknown>, photos: Photos = PHOTOS): OneLookTileFaceInput {
  const states: Record<string, HassEntityState> = { [entityId]: { entity_id: entityId, state, attributes, last_changed: "", last_updated: "" } };
  const input: WatchPagePreviewInput = { page, pages: [page], screen: { width: 211, height: 251 }, states, scale: 1, ...photos };
  return { tile, input, stub: false, device: "watch", look: undefined, width: CELL.width - 1, height: CELL.height - 1, cell: CELL, unit: UNIT, box: "", s: 1 };
}

const lamp = (extra: Partial<WatchPageTile> = {}): WatchPageTile => ({ id: "T", entityId: "light.lamp", customLabel: "Lamp", colSpan: 6, rowSpan: 4, iconPhotoId: ID, ...extra });
const RED_HALF = { brightness: 128, color_mode: "hs", rgb_color: [255, 0, 0] };
const K_HALF = Math.round((0.35 + 0.65 * (128 / 255)) * 10000) / 10000;

describe("a light's On photo, tinted", () => {
  it("normal look: the Off photo, the On photo at k, then C multiply blended through W at k", () => {
    const out = html(renderOneLookTile(face(lamp(), "light.lamp", "on", RED_HALF)));
    const photos = all(out, "ol-cutout");
    expect(photos.map((p) => p.src)).toEqual(["blob:off", "blob:on"]);
    expect(photos[0]!.style).not.toContain("opacity");
    expect(photos[0]!.style).not.toContain("filter");
    expect(photos[1]!.style).toContain(`;opacity:${K_HALF}`);
    const tint = all(out, "ol-tint");
    expect(tint).toHaveLength(1);
    expect(tint[0]!.style).toContain(`background:rgba(255, 38, 38, 1);opacity:${K_HALF};-webkit-mask-image:url("blob:mask");mask-image:url("blob:mask")`);
    // Over both photos, in the same place, corners and all.
    expect(out.indexOf(`class="ol-tint"`)).toBeGreaterThan(out.lastIndexOf(`class="ol-cutout"`));
    const box = (s: string) => s.slice(0, s.indexOf("px;border-radius")).replace(/;opacity.*/, "");
    expect(box(tint[0]!.style)).toBe(box(photos[0]!.style));
    expect(tint[0]!.style).toContain("border-radius:");
    expect(oneLookPreviewModel(face(lamp(), "light.lamp", "on", RED_HALF))!.tint).toEqual({ colour: [1, 0.15000000000000002, 0.15000000000000002], known: true, level: 0.35 + 0.65 * (128 / 255) });
  });

  it("a white light at full brightness draws exactly as its On photo did before", () => {
    const before: Photos = { ...PHOTOS, photoOnMask: () => undefined };
    for (const attrs of [{ brightness: 255 }, { brightness: 255, color_mode: "color_temp", color_temp_kelvin: 4000 }, { brightness: 255, color_mode: "rgb", rgb_color: [255, 255, 255] }, {}]) {
      const out = html(renderOneLookTile(face(lamp(), "light.lamp", "on", attrs)));
      expect(all(out, "ol-cutout").map((p) => p.src), JSON.stringify(attrs)).toEqual(["blob:on"]);
      expect(out).not.toContain("ol-tint");
      expect(out).toBe(html(renderOneLookTile(face(lamp(), "light.lamp", "on", attrs, before))));
    }
  });

  it("a dimmed white light: the On photo at k over the Off photo, no tint layer", () => {
    const out = html(renderOneLookTile(face(lamp(), "light.lamp", "on", { brightness: 128 })));
    expect(all(out, "ol-cutout").map((p) => p.src)).toEqual(["blob:off", "blob:on"]);
    expect(out).not.toContain("ol-tint");
  });

  it("a coloured light at full brightness: the On photo and the tint, no Off photo under it", () => {
    const out = html(renderOneLookTile(face(lamp(), "light.lamp", "on", { brightness: 255, color_mode: "rgb", rgb_color: [255, 0, 0] })));
    expect(all(out, "ol-cutout").map((p) => p.src)).toEqual(["blob:on"]);
    expect(all(out, "ol-tint")[0]!.style).toContain("opacity:1;");
  });

  it("no mask yet: the photos at k, the tint waits", () => {
    const out = html(renderOneLookTile(face(lamp(), "light.lamp", "on", RED_HALF, { ...PHOTOS, photoOnMask: () => undefined })));
    expect(all(out, "ol-cutout").map((p) => p.src)).toEqual(["blob:off", "blob:on"]);
    expect(out).not.toContain("ol-tint");
  });

  it("off, or another kind: drawn as before", () => {
    const off = html(renderOneLookTile(face(lamp(), "light.lamp", "off", {})));
    expect(all(off, "ol-cutout").map((p) => p.src)).toEqual(["blob:off"]);
    expect(off).not.toContain("ol-tint");
    const sw = face(lamp({ entityId: "switch.kettle", color: "#30A0FF" }), "switch.kettle", "on", RED_HALF);
    const drawn = html(renderOneLookTile(sw));
    expect(all(drawn, "ol-cutout").map((p) => p.src)).toEqual(["blob:on"]);
    expect(drawn).not.toContain("ol-tint");
    expect(oneLookPreviewModel(sw)!.tint).toBeUndefined();
  });

  it("Clear look: the same three layers, and the glow in the light's colour scaled by k", () => {
    const out = html(renderOneLookTile(face(lamp({ iconPhotoLook: "clear", color: "#30A0FF" }), "light.lamp", "on", RED_HALF)));
    const photos = all(out, "ol-cutout clear");
    expect(photos.map((p) => p.src)).toEqual(["blob:off", "blob:on"]);
    expect(photos[1]!.style).toContain(`;opacity:${K_HALF}`);
    expect(all(out, "ol-tint")[0]!.style).toContain(`background:rgba(255, 38, 38, 1);opacity:${K_HALF}`);
    const glow = all(out, "ol-layer ol-clear-glow")[0]!.style;
    const a4 = (v: number) => Math.round(v * 10000) / 10000;
    const k = 0.35 + 0.65 * (128 / 255);
    expect(glow).toContain(`rgba(255, 38, 38, ${a4(0.42 * k)}) 0%, rgba(255, 38, 38, ${a4(0.18 * k)}) 45%, rgba(255, 38, 38, 0) 100%`);
    expect(glow).toContain("mix-blend-mode:screen");
    expect(out.indexOf("ol-clear-glow")).toBeLessThan(out.indexOf("ol-cutout"));
    // The state line in C too, so the words and the lamp agree.
    expect(all(out, "ol-clear-state")[0]!.style).toContain("color:rgba(255, 38, 38, 1)");
  });

  it("Clear look glow and state: the tile's colour for a light whose colour is unknown (glow still scaled by k); full for another kind", () => {
    const light = html(renderOneLookTile(face(lamp({ iconPhotoLook: "clear", color: "#30A0FF" }), "light.lamp", "on", { brightness: 0 })));
    expect(all(light, "ol-layer ol-clear-glow")[0]!.style).toContain("rgba(48, 160, 255, 0.147) 0%, rgba(48, 160, 255, 0.063) 45%");
    expect(all(light, "ol-clear-state")[0]!.style).toContain("color:rgba(48, 160, 255, 1)");
    const cover = html(renderOneLookTile(face(lamp({ entityId: "cover.blind", iconPhotoLook: "clear", color: "#30A0FF" }), "cover.blind", "open", { current_position: 100 })));
    expect(all(cover, "ol-layer ol-clear-glow")[0]!.style).toContain("rgba(48, 160, 255, 0.42) 0%");
    expect(all(cover, "ol-clear-state")[0]!.style).toContain("color:rgba(48, 160, 255, 1)");
    expect(ONE_LOOK_CLEAR).toMatchObject({ glowCentreOpacity: 0.42, glowMidOpacity: 0.18, glowMidStop: 0.45, glowRadiusShare: 0.7 });
    expect(oneLookClearGlowColour({ hue: [1, 2, 3] }, undefined)).toEqual([1, 2, 3]);
    expect(oneLookClearGlowColour({ hue: [1, 2, 3] }, { colour: [1, 1, 1], known: true, level: 1 })).toEqual([255, 255, 255]);
    expect(oneLookClearGlowColour({ hue: [1, 2, 3] }, { colour: [1, 1, 1], known: false, level: 1 })).toEqual([1, 2, 3]);
  });

  it("Clear look, off or wrist down: no glow, the Off photo alone", () => {
    const out = html(renderOneLookTile(face(lamp({ iconPhotoLook: "clear" }), "light.lamp", "off", {})));
    expect(out).not.toContain("ol-clear-glow");
    expect(all(out, "ol-cutout clear").map((p) => p.src)).toEqual(["blob:off"]);
  });
});

// ── the store makes W once ───────────────────────────────────────────────

afterEach(() => forgetPagePhotos());

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function be32(n: number): number[] {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}
function chunk(type: string, body: number[]): number[] {
  return [...be32(body.length), ...[...type].map((c) => c.charCodeAt(0)), ...body, 0, 0, 0, 0];
}
function png(width: number, height: number, ...chunks: number[][]): Uint8Array {
  const ihdr = chunk("IHDR", [...be32(width), ...be32(height), 8, 6, 0, 0, 0]);
  return new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, ...ihdr, ...chunks.flat(), ...chunk("IEND", [])]);
}

function hassAnswering(bytes: Uint8Array): HassLike {
  return {
    states: {},
    connection: {
      sendMessagePromise: async (m: Record<string, unknown>) => ({ image_id: m.image_id, content_type: "image/png", data: base64OfBytes(bytes) }),
      subscribeMessage: async () => async () => {},
    },
  } as unknown as HassLike;
}

describe("the photo store and the tint mask", () => {
  const inner = png(40, 20, chunk("IDAT", [7]));
  const outer = png(40, 20, chunk("IDAT", [1, 2]), chunk("waOn", [...inner]));

  it("makes it once with the On photo, from the On photo's bytes alone, then redraws once", async () => {
    const made: number[][] = [];
    let changed = 0;
    const store = new PagePhotoStore(() => hassAnswering(outer), () => changed++, {
      makeUrl: () => "blob:off",
      makeOn: async () => ({ url: "blob:on", width: 40, height: 20 }),
      makeOnMask: async (on) => {
        made.push([...on]);
        return "blob:mask";
      },
    });
    expect(store.onMask(ID)).toBeUndefined();
    store.url(ID);
    await flush();
    expect(changed).toBe(1);
    expect(store.onUrl(ID)).toBe("blob:on");
    expect(store.onMask(ID.toLowerCase())).toBe("blob:mask");
    expect(made).toEqual([[...inner]]);
    // A second store reads the same memory and makes nothing again.
    const other = new PagePhotoStore(() => hassAnswering(outer), () => {}, { makeOnMask: async () => { throw new Error("again"); } });
    expect(other.onMask(ID)).toBe("blob:mask");
  });

  it("a mask that cannot be made leaves the On photo untinted; no On photo, no mask", async () => {
    const failing = new PagePhotoStore(() => hassAnswering(outer), () => {}, {
      makeUrl: () => "u",
      makeOn: async () => ({ url: "blob:on", width: 40, height: 20 }),
      makeOnMask: async () => { throw new Error("no canvas"); },
    });
    failing.url(ID);
    await flush();
    expect(failing.onUrl(ID)).toBe("blob:on");
    expect(failing.onMask(ID)).toBeUndefined();
    forgetPagePhotos();
    let calls = 0;
    const plain = new PagePhotoStore(() => hassAnswering(png(40, 20, chunk("IDAT", [1]))), () => {}, {
      makeUrl: () => "u",
      makeOnMask: async () => { calls++; return "m"; },
    });
    plain.url(ID);
    await flush();
    expect(plain.onMask(ID)).toBeUndefined();
    expect(calls).toBe(0);
  });
});
