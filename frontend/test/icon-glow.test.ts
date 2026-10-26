// The icon's glow setting (`iconGlow`, tile layers round three): reading and
// writing the key, the halo formula every renderer shares, and the native
// tile drawing it in the panel's watch and iPhone frames. App repo
// docs/tile_layers_contract_2026-10.md, sections 14.2 and 14.3.

import { svg } from "lit";
import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import { phonePagesLayout, phonePagesScreen } from "../src/phone-frame.js";
import type { WatchPage, WatchPageTile } from "../src/watch-pages/model.js";
import { type WatchPagePreviewInput, renderWatchTileFace } from "../src/watch-pages/preview.js";
import {
  type OneLookGlyphGlow,
  type OneLookPalette,
  ONE_LOOK_NATIVE_GLOW,
  encodeOneLookGlyphGlow,
  oneLookGlyphGlowOf,
  oneLookGlyphHalo,
  oneLookGlyphHaloOpacity,
  oneLookHex,
  oneLookParseHex,
} from "../src/watch-pages/one-look/colour.js";

// ── the formula (section 14.3's table) ───────────────────────────────────

/** A palette with only what the formula reads. */
function pal(surface: OneLookPalette["surface"], isLit: boolean, hue?: string, aod = false): OneLookPalette {
  return { surface, isLit, hue: hue === undefined ? undefined : oneLookParseHex(hue), aod } as unknown as OneLookPalette;
}
const glow = (raw: Record<string, unknown>): OneLookGlyphGlow => oneLookGlyphGlowOf(raw);
const BARE = { centred: true, picture: false, hasIcon: true, photo: false };
const round4 = (v: number) => Math.round(v * 10000) / 10000;
function halo(p: OneLookPalette, g: OneLookGlyphGlow, o: Partial<typeof BARE> = {}) {
  const h = oneLookGlyphHalo(p, { ...BARE, ...o }, g);
  return h === undefined ? undefined : { opacity: round4(h.opacity), share: h.share, hex: oneLookHex(h.rgb) };
}

describe("the glow's formula (section 14.3)", () => {
  it("draws every row of the table", () => {
    expect(halo(pal("coloured", true, "#F2AE4E"), ONE_LOOK_NATIVE_GLOW)).toEqual({ opacity: 0.32, share: 1.5, hex: "#FFFFFF" }); // 1
    expect(halo(pal("coloured", false), ONE_LOOK_NATIVE_GLOW)).toEqual({ opacity: 0.14, share: 1.5, hex: "#FFFFFF" }); // 2
    expect(halo(pal("graphite", false), ONE_LOOK_NATIVE_GLOW)).toBeUndefined(); // 3
    expect(halo(pal("graphite", false), glow({ mode: "on" }))).toMatchObject({ opacity: 0.14, share: 1.5 }); // 4
    expect(halo(pal("graphite", false), glow({ mode: "on" }), { photo: true })).toBeUndefined(); // 5
    expect(halo(pal("coloured", false), ONE_LOOK_NATIVE_GLOW, { photo: true })).toMatchObject({ opacity: 0.14, share: 1.5 }); // 6
    expect(halo(pal("coloured", true), glow({ brightness: 150, size: 200 }))).toMatchObject({ opacity: 0.48, share: 2 }); // 7
    expect(halo(pal("coloured", true), glow({ brightness: 300 }))).toMatchObject({ opacity: 0.96 }); // 8
    expect(halo(pal("coloured", false), glow({ brightness: 300 }))).toMatchObject({ opacity: 0.42 }); // 9
    expect(halo(pal("coloured", true), glow({ brightness: 0 }))).toBeUndefined(); // 10
    expect(halo(pal("coloured", true), glow({ mode: "off" }))).toBeUndefined(); // 11
    expect(halo(pal("camera", false), glow({ mode: "on" }))).toBeUndefined(); // 12
    expect(halo(pal("coloured", true, undefined, true), ONE_LOOK_NATIVE_GLOW)).toBeUndefined(); // 13
    expect(halo(pal("coloured", true), ONE_LOOK_NATIVE_GLOW, { picture: true })).toBeUndefined(); // 14
    expect(halo(pal("coloured", true, "#F2AE4E"), glow({ color: "tile" }))).toMatchObject({ opacity: 0.32, hex: "#F2AE4E" }); // 15
    expect(halo(pal("graphite", false), glow({ mode: "on", color: "tile" }))).toMatchObject({ opacity: 0.14, hex: "#FFFFFF" }); // 16
    expect(halo(pal("coloured", true), glow({ color: "#3366FF" }))).toMatchObject({ opacity: 0.32, hex: "#3366FF" }); // 17
  });

  it("draws none outside the bridge look or without an icon", () => {
    expect(halo(pal("coloured", true), ONE_LOOK_NATIVE_GLOW, { centred: false })).toBeUndefined();
    expect(halo(pal("coloured", true), ONE_LOOK_NATIVE_GLOW, { hasIcon: false })).toBeUndefined();
  });

  it("keeps the old opacity function as a wrapper over it", () => {
    expect(oneLookGlyphHaloOpacity(pal("coloured", true))).toBe(0.32);
    expect(oneLookGlyphHaloOpacity(pal("graphite", false))).toBeUndefined();
  });
});

describe("reading and writing iconGlow (section 14.2)", () => {
  it("reads every row of the read table", () => {
    expect(oneLookGlyphGlowOf({ size: 400 }).size).toBe(250);
    expect(oneLookGlyphGlowOf({ size: 10 }).size).toBe(50);
    expect(oneLookGlyphGlowOf({ size: "big" }).size).toBe(150);
    expect(oneLookGlyphGlowOf({ brightness: true }).brightness).toBe(100);
    expect(oneLookGlyphGlowOf({ brightness: 400 }).brightness).toBe(300);
    expect(oneLookGlyphGlowOf({ brightness: -5 }).brightness).toBe(0);
    expect(oneLookGlyphGlowOf({ mode: "ON" }).mode).toBe("auto");
    expect(oneLookGlyphGlowOf({ mode: "off" }).mode).toBe("off");
    expect(oneLookGlyphGlowOf({ color: "#f2ae4e" }).colour).toEqual({ kind: "custom", rgb: [0xf2, 0xae, 0x4e] });
    expect(oneLookGlyphGlowOf({ color: "red" }).colour).toEqual({ kind: "white" });
    expect(oneLookGlyphGlowOf({ color: "#F2AE4" }).colour).toEqual({ kind: "white" });
    expect(oneLookGlyphGlowOf({ color: "tile" }).colour).toEqual({ kind: "tile" });
    for (const raw of [[], "on", null, undefined, true, 3, {}]) expect(oneLookGlyphGlowOf(raw)).toEqual(ONE_LOOK_NATIVE_GLOW);
  });

  it("writes only the keys that are not their default, in order", () => {
    expect(encodeOneLookGlyphGlow(ONE_LOOK_NATIVE_GLOW)).toBeUndefined();
    expect(encodeOneLookGlyphGlow({ mode: "on", size: 150, brightness: 100, colour: { kind: "custom", rgb: [0xf2, 0xae, 0x4e] } })).toEqual({ mode: "on", color: "#F2AE4E" });
    const all = encodeOneLookGlyphGlow({ mode: "off", size: 180, brightness: 150, colour: { kind: "tile" } });
    expect(Object.keys(all!)).toEqual(["mode", "size", "brightness", "color"]);
    expect(all).toEqual({ mode: "off", size: 180, brightness: 150, color: "tile" });
  });
});

// ── the native tile in the panel's frames ────────────────────────────────

/** A template's text with its values, as lit would write it. */
function text(t: unknown): string {
  if (typeof t === "symbol" || t === null || t === undefined) return "";
  if (Array.isArray(t)) return t.map(text).join("");
  if (typeof t !== "object") return String(t);
  const r = t as { strings?: readonly string[]; values?: unknown[] };
  if (r.strings === undefined) return "";
  return r.strings.map((s, i) => s + (i < (r.values?.length ?? 0) ? text(r.values![i]) : "")).join("");
}
function styleOf(html: string, cls: string): string | undefined {
  return new RegExp(`<[a-z]+ class="${cls}(?: [^"]*)?"[^>]*?style=([^>]*)>`).exec(html)?.[1]?.replace(/\s*\/$/, "");
}
function place(style: string | undefined): { x: number; y: number; w: number; h: number } {
  const n = (k: string) => Number(new RegExp(`(?:^|;)${k}:(-?[\\d.]+)px`).exec(style ?? "")?.[1]);
  return { x: n("left"), y: n("top"), w: n("width"), h: n("height") };
}
const BOXES: Record<string, [number, number]> = {
  lightbulb: [13.53, 22.22], "lightbulb.fill": [13.53, 22.22], "lightbulb.slash": [13.53, 22.22],
};
const icons: IconProvider = {
  render: (name: string, size: number, colour: string) => {
    const box = BOXES[name];
    return box === undefined ? undefined : svg`<svg width=${size} height=${size} viewBox=${`0 0 ${box[0]} ${box[1]}`} fill=${colour}><rect /></svg>`;
  },
  available: () => true,
  names: () => Object.keys(BOXES),
};
const page: WatchPage = { id: "P", name: "P", items: [] };
const states = (state: string): Record<string, HassEntityState> => ({
  "light.kitchen": { entity_id: "light.kitchen", state, attributes: { brightness: 189 }, last_changed: "", last_updated: "" },
});
const tile = (extra: Partial<WatchPageTile> = {}): WatchPageTile => ({ id: "T", entityId: "light.kitchen", colSpan: 6, rowSpan: 4, customLabel: "Kitchen", color: "#8F7BEA", ...extra });
const phone = phonePagesLayout(undefined, { look: "iphone" });
const PHONE_UNIT = (380 - 22) / 12;
const PHONE_CELL = { width: 6 * PHONE_UNIT + 10, height: 4 * PHONE_UNIT + 6 };
const WATCH_UNIT = 15.5;
const WATCH_CELL = { width: 6 * WATCH_UNIT + 10, height: 4 * WATCH_UNIT + 6 };
function onPhone(t: WatchPageTile, state = "on"): string {
  const input: WatchPagePreviewInput = { page, pages: [page], screen: phonePagesScreen(phone), phone, states: states(state), icons, scale: 1 };
  return text(renderWatchTileFace(t, PHONE_CELL, input, PHONE_UNIT));
}
function onWatch(t: WatchPageTile, state = "on"): string {
  const input: WatchPagePreviewInput = { page, pages: [page], screen: { width: 211, height: 251 }, states: states(state), icons, scale: 1 };
  return text(renderWatchTileFace(t, WATCH_CELL, input, WATCH_UNIT));
}
const centre = (p: { x: number; y: number; w: number; h: number }) => ({ x: Math.round((p.x + p.w / 2) * 10) / 10, y: Math.round((p.y + p.h / 2) * 10) / 10 });

describe("the native tile draws the setting", () => {
  const custom = { mode: "on", size: 200, brightness: 150, color: "#3366FF" };

  for (const [frame, draw] of [["iPhone", onPhone], ["watch", onWatch]] as const) {
    it(`draws a custom glow in the ${frame} frame: its size, opacity and colour, on the same centre`, () => {
      const native = place(styleOf(draw(tile()), "ol-halo"));
      const html = draw(tile({ iconGlow: custom }));
      const style = styleOf(html, "ol-halo");
      const p = place(style);
      expect(p.w).toBeCloseTo((native.w / 1.5) * 2, 1);
      expect(centre(p)).toEqual(centre(native));
      expect(style).toContain("rgba(51, 102, 255, 0.48) 0%");
      expect(style).toContain("rgba(51, 102, 255, 0) 100%");
    });

    it(`draws no glow with the mode off in the ${frame} frame`, () => {
      expect(draw(tile({ iconGlow: { mode: "off" } }))).not.toContain("ol-halo");
    });

    it(`glows on an off light only with the mode on in the ${frame} frame`, () => {
      expect(draw(tile(), "off")).not.toContain("ol-halo");
      expect(styleOf(draw(tile({ iconGlow: { mode: "on" } }), "off"), "ol-halo")).toContain("rgba(255, 255, 255, 0.14) 0%");
    });
  }

  it("draws today's glow with no setting", () => {
    expect(styleOf(onPhone(tile()), "ol-halo")).toContain("rgba(255, 255, 255, 0.32) 0%");
  });
});
