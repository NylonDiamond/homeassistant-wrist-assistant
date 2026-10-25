// One Look's colours (`src/watch-pages/one-look/colour.ts`), each case the
// app's own from `WristAssistantTests/OneLookColourTests.swift`, with the
// same hex: the deepening for white text, the pearl glyph, the palette's
// order and the fill.

import { describe, expect, it } from "vitest";

import {
  ONE_LOOK_AMBER,
  ONE_LOOK_GRAPHITE,
  ONE_LOOK_GRAPHITE_BASE,
  ONE_LOOK_OFFLINE_GROUND,
  type OneLookInk,
  type OneLookPaletteInput,
  type OneLookRGB,
  oneLookBareGlyph,
  oneLookBarColour,
  oneLookBlendCss,
  oneLookBrightnessMixed,
  oneLookColourStops,
  oneLookContrast,
  oneLookDeepenForWhite,
  oneLookFill,
  oneLookFillColourAt,
  oneLookFillTrackStops,
  oneLookFromHSL,
  oneLookGlyphHaloOpacity,
  oneLookGlyphInk,
  oneLookHSL,
  oneLookHSVSaturation,
  oneLookHex,
  oneLookInkCss,
  oneLookMix,
  oneLookOffBulb,
  oneLookPalette,
  oneLookParseHex,
  oneLookPearl,
  oneLookPearlGlyph,
  oneLookRimStops,
  oneLookSheenCss,
  oneLookWhiteContrast,
} from "../src/watch-pages/one-look/colour.js";

const rgb = (hex: string): OneLookRGB => oneLookParseHex(hex)!;
const deepen = (hex: string) => oneLookHex(oneLookDeepenForWhite(rgb(hex)));
const white = (opacity: number): OneLookInk => ({ rgb: [255, 255, 255], opacity });
const palette = (input: OneLookPaletteInput) => oneLookPalette(input);
const LIT = { kind: "light", on: true, brightness: 1 } as const;
const OFF = { kind: "light", on: false } as const;
const PLAIN = { kind: "plain" } as const;
const near = (a: number | undefined, b: number, tolerance = 0.0001) => a !== undefined && Math.abs(a - b) < tolerance;

describe("deepening for white text (OneLookColour.deepenForWhite)", () => {
  it("deepens light fills to the mock's hex", () => {
    expect(deepen("#FFCC00")).toBe("#B49000");
    expect(deepen("#A4E34B")).toBe("#67A411");
    expect(deepen("#F2F2F7")).toBe("#949497");
    expect(deepen("#F2AE4E")).toBe("#D68006");
    expect(deepen("#DE9A55")).toBe("#D97D1E");
    expect(deepen("#A9C4E8")).toBe("#6197DE");
    expect(deepen("#5AC8FA")).toBe("#009DE4");
    expect(deepen("#EE7470")).toBe("#F46762");
    expect(deepen("#F5A524")).toBe("#D38201");
    expect(deepen("#3FBFA6")).toBe("#2CA68E");
  });

  it("leaves fills that pass alone", () => {
    for (const hex of ["#8F7BEA", "#3D8CF0", "#FF3B30", "#AF52DE", "#8E8E93", "#000000"]) expect(deepen(hex)).toBe(hex);
    expect(near(oneLookWhiteContrast(rgb("#000000")), 21)).toBe(true);
  });

  it("brings every deepened fill to three to one", () => {
    for (const hex of ["#FFCC00", "#A4E34B", "#F2F2F7", "#F2AE4E", "#DE9A55", "#A9C4E8", "#5AC8FA", "#FFFFFF", "#EE7470", "#65C466", "#F5A524", "#3FBFA6", "#FF9500", "#32ADE6"]) {
      expect(oneLookWhiteContrast(oneLookDeepenForWhite(rgb(hex))), hex).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps greys neutral", () => {
    for (const hex of ["#FFFFFF", "#F0F0F0", "#CCCCCC", "#AAAAAA"]) {
      const [r, g, b] = oneLookDeepenForWhite(rgb(hex));
      expect(r === g && g === b, hex).toBe(true);
    }
    expect(deepen("#FFFFFF")).toBe("#949494");
  });
});

describe("the pearl disc's glyph and the off bulb", () => {
  it("matches the mock's pearl glyphs", () => {
    for (const [hue, glyph] of [["#FFCC00", "#997A00"], ["#A4E34B", "#588B0E"], ["#F2F2F7", "#7E7E80"], ["#F2AE4E", "#B66D05"]] as const) {
      const base = oneLookDeepenForWhite(rgb(hue));
      const g = oneLookPearlGlyph(base);
      expect(oneLookHex(g), hue).toBe(glyph);
      expect(oneLookContrast(g, oneLookPearl(base))).toBeGreaterThanOrEqual(3.5);
    }
    // A hue that passes still darkens 15% at least.
    expect(oneLookHex(oneLookPearlGlyph(rgb("#8F7BEA")))).toBe("#7A69C7");
  });

  it("mixes a dimmed light toward graphite", () => {
    const lavender = rgb("#8F7BEA");
    expect(oneLookHex(oneLookBrightnessMixed(lavender, 0.6))).toBe("#7D6DC9");
    expect(oneLookHex(oneLookBrightnessMixed(lavender, 0.3))).toBe("#6F62AF");
    expect(oneLookHex(oneLookBrightnessMixed(lavender, 1))).toBe("#8F7BEA");
    expect(oneLookHex(oneLookBrightnessMixed(ONE_LOOK_AMBER, 0.6))).toBe("#CE9649");
    expect(oneLookHex(oneLookDeepenForWhite(oneLookBrightnessMixed(ONE_LOOK_AMBER, 0.6)))).toBe("#C9862A");
  });

  it("draws the off bulb a quarter toward white", () => {
    expect(oneLookHex(oneLookOffBulb(rgb("#8F7BEA")))).toBe("#AB9CEF");
    expect(oneLookHex(oneLookOffBulb(ONE_LOOK_AMBER))).toBe("#F5C27A");
  });
});

describe("the helpers", () => {
  it("round trips HSL and rounds each mix", () => {
    for (const hex of ["#8F7BEA", "#FFCC00", "#3D8CF0", "#202125", "#FFFFFF", "#000000"]) {
      const [h, s, l] = oneLookHSL(rgb(hex));
      expect(oneLookHex(oneLookFromHSL(h, s, l))).toBe(hex);
    }
    // 42 + 101 x .82 = 124.82 -> 125; channels round half up.
    expect(oneLookHex(oneLookMix(rgb("#2A2B30"), rgb("#8F7BEA"), 0.82))).toBe("#7D6DC9");
    expect(oneLookHex(oneLookMix([0, 0, 0], rgb("#050505"), 0.5))).toBe("#030303");
    expect(near(oneLookHSVSaturation(rgb("#F2F2F7")), 5 / 247)).toBe(true);
    expect(oneLookHSVSaturation([0, 0, 0])).toBe(0);
  });

  it("parses colour strings and draws junk as no colour", () => {
    expect(oneLookColourStops("#8f7bea")).toEqual([rgb("#8F7BEA")]);
    expect(oneLookColourStops("8F7BEA")).toEqual([rgb("#8F7BEA")]);
    // An 8-digit colour drops its alpha.
    expect(oneLookColourStops("#8F7BEA80")).toEqual([rgb("#8F7BEA")]);
    expect(oneLookColourStops("GRADIENT|#FF0000|#0000ff")).toEqual([rgb("#FF0000"), rgb("#0000FF")]);
    expect(oneLookColourStops("#RAINBOW")).toHaveLength(7);
    expect(oneLookColourStops("#rainbow")?.[0]).toEqual(rgb("#FF3B30"));
    expect(oneLookColourStops("yellow")).toEqual([rgb("#FFCC00")]);
    for (const junk of [undefined, null, "", "  ", "#12", "theme.accent", "entityLight", "GRADIENT|nope", "#GGGGGG", 7]) {
      expect(oneLookColourStops(junk), String(junk)).toBeUndefined();
    }
    // A theme token draws as no colour.
    expect(palette({ role: PLAIN, hue: "theme.accent" }).surface).toBe("graphite");
  });
});

describe("the palette's order (OneLookPalette.resolve)", () => {
  it("draws a lit light with no colour amber with the pearl", () => {
    const p = palette({ role: LIT });
    expect(p.surface).toBe("coloured");
    expect(oneLookHex(p.base)).toBe("#D68006");
    expect(oneLookHex(p.light)).toBe("#E6B065");
    expect(oneLookHex(p.shade)).toBe("#B46C05");
    expect(p.deepened).toBe(true);
    expect(p.isLit && p.pearlGlow).toBe(true);
    expect(p.disc).toEqual(white(0.95));
    expect(oneLookHex(p.glyph.rgb)).toBe("#B66D05");
    expect(oneLookHex(p.glow!)).toBe("#D68006");
    expect(near(p.sheen, 0.26)).toBe(true);
    expect(near(p.sheenStop, 31)).toBe(true);
    expect(near(p.rimOpacity, 0.45)).toBe(true);
    expect(p.ink).toEqual(white(1));
    expect(p.ink2).toEqual(white(1));
    expect(p.textShadow).toBe(true);
  });

  it("draws an off light with no colour as an amber bulb on graphite", () => {
    const p = palette({ role: OFF });
    expect(p.surface).toBe("graphite");
    expect(p.base).toEqual(ONE_LOOK_GRAPHITE_BASE);
    expect(p.disc).toEqual({ rgb: rgb("#F2AE4E"), opacity: 0.2 });
    expect(oneLookHex(p.glyph.rgb)).toBe("#F5C27A");
    expect(p.ink2).toEqual(white(0.6));
    expect(p.isLit || p.glow !== undefined || p.textShadow).toBe(false);

    const lavender = palette({ role: OFF, hue: "#8F7BEA" });
    expect(lavender.disc).toEqual({ rgb: rgb("#8F7BEA"), opacity: 0.2 });
    expect(oneLookHex(lavender.glyph.rgb)).toBe("#AB9CEF");
    expect(lavender.hue).toEqual(rgb("#8F7BEA"));
  });

  it("dims a light under the Top style as the mock does", () => {
    const p6 = palette({ role: { kind: "light", on: true, brightness: 0.6 }, hue: "#8F7BEA" });
    expect(oneLookHex(p6.base)).toBe("#7D6DC9");
    expect(oneLookHex(p6.light)).toBe("#9B8ED5");
    expect(oneLookHex(p6.shade)).toBe("#7162B5");
    expect(oneLookHex(p6.glyph.rgb)).toBe("#6A5DAB");
    expect(p6.deepened).toBe(false);
    expect(near(p6.sheen, 0.156)).toBe(true);
    expect(near(p6.sheenStop, 25.8)).toBe(true);
    expect(near(p6.glowOpacity, 0.432)).toBe(true);
    expect(p6.fillShare).toBeUndefined();

    const p3 = palette({ role: { kind: "light", on: true, brightness: 0.3 }, hue: "#8F7BEA" });
    expect(oneLookHex(p3.base)).toBe("#6F62AF");
    expect(oneLookHex(p3.light)).toBe("#7F74B8");
    expect(oneLookHex(p3.shade)).toBe("#64589E");

    const amber = palette({ role: { kind: "light", on: true, brightness: 0.6 } });
    expect(oneLookHex(amber.base)).toBe("#C9862A");
    expect(oneLookHex(amber.shade)).toBe("#A97123");
    expect(oneLookHex(amber.glyph.rgb)).toBe("#AB7224");
  });

  it("fills a dimmed light to its brightness in its full colour under the Fill style", () => {
    const full = palette({ role: LIT, hue: "#8F7BEA" });
    const p6 = palette({ role: { kind: "light", on: true, brightness: 0.6 }, hue: "#8F7BEA", brightnessFill: true });
    expect(full.fillShare).toBeUndefined();
    expect(near(p6.fillShare, 0.6)).toBe(true);
    expect(p6.base).toEqual(full.base);
    expect(p6.light).toEqual(full.light);
    expect(p6.shade).toEqual(full.shade);
    expect(near(p6.glowOpacity, 0.432)).toBe(true);
    expect(palette({ role: OFF, hue: "#8F7BEA", brightnessFill: true }).fillShare).toBeUndefined();
    expect(palette({ role: PLAIN, hue: "#8F7BEA", brightnessFill: true }).fillShare).toBeUndefined();
    // The spec's computed full colours, and their track.
    expect([full.light, full.base, full.shade].map(oneLookHex)).toEqual(["#BAADF2", "#8F7BEA", "#816FD3"]);
  });

  it("fills another kind to its level, 0 included, and a level of 1 not at all", () => {
    expect(near(palette({ role: PLAIN, hue: "#4A90D9", fillLevel: 0.4 }).fillShare, 0.4)).toBe(true);
    expect(near(palette({ role: PLAIN, hue: "#4A90D9", fillLevel: 0 }).fillShare, 0)).toBe(true);
    expect(palette({ role: PLAIN, hue: "#4A90D9", fillLevel: 1 }).fillShare).toBeUndefined();
    expect(palette({ role: PLAIN, hue: "#4A90D9" }).fillShare).toBeUndefined();
  });

  it("draws an idle tile calm only with calm when idle, which is off", () => {
    const calm = palette({ role: PLAIN, hue: "#8F7BEA", calm: true, calmWhenIdle: true });
    expect(calm.surface).toBe("graphite");
    expect(calm.disc).toEqual({ rgb: rgb("#8F7BEA"), opacity: 0.2 });
    expect(oneLookHex(calm.glyph.rgb)).toBe("#AB9CEF");
    expect(calm.ink2).toEqual(white(0.6));
    expect(palette({ role: PLAIN, hue: "#8F7BEA", calm: false, calmWhenIdle: true }).surface).toBe("coloured");
    expect(palette({ role: PLAIN, hue: "#8F7BEA", calm: true, calmWhenIdle: false }).surface).toBe("coloured");
    expect(palette({ role: PLAIN, hue: "#8F7BEA", stateHue: "#34C759", calm: true, calmWhenIdle: true }).surface).toBe("coloured");
    expect(palette({ role: PLAIN, hue: "#8F7BEA", calm: true, dimWhenOff: false, calmWhenIdle: true }).surface).toBe("coloured");
    expect(palette({ role: PLAIN, hue: "#8F7BEA", calm: true, pressed: true, calmWhenIdle: true }).surface).toBe("coloured");
    expect(palette({ role: { kind: "media", playing: false }, hue: "#8F7BEA", calm: true, calmWhenIdle: true }).surface).toBe("graphite");
    expect(palette({ role: LIT, hue: "#8F7BEA", calm: true, calmWhenIdle: true }).isLit).toBe(true);
    expect(palette({ role: PLAIN, calm: true, calmWhenIdle: true }).disc).toEqual(white(0.13));
    // The default is the app's: off.
    expect(palette({ role: PLAIN, hue: "#8F7BEA", calm: true }).surface).toBe("coloured");
  });

  it("draws media paused and playing", () => {
    const paused = palette({ role: { kind: "media", playing: false }, hue: "#DE9A55" });
    expect(paused.surface).toBe("coloured");
    expect(oneLookHex(paused.base)).toBe("#D97D1E");
    expect(oneLookHex(paused.shade)).toBe("#B66919");
    expect(paused.disc).toEqual(white(0.3));
    expect(oneLookHex(paused.glyph.rgb)).toBe("#52300B");
    expect(paused.isLit || paused.glow !== undefined).toBe(false);
    expect(paused.accessoryDisc).toEqual(white(0.3));
    expect(oneLookHex(paused.accessoryGlyph.rgb)).toBe("#52300B");

    const playing = palette({ role: { kind: "media", playing: true }, hue: "#DE9A55" });
    expect(playing.disc).toEqual(white(0.95));
    expect(oneLookHex(playing.glyph.rgb)).toBe("#B86A1A");
    expect(oneLookHex(playing.glow!)).toBe("#D97D1E");
    // Beside a pearl disc, the accessory keeps the 30% disc.
    expect(playing.accessoryDisc).toEqual(white(0.3));
    expect(playing.accessoryGlyph.rgb).toEqual(oneLookMix(playing.base, [0, 0, 0], 0.62));

    // Playing with no colour is amber, paused with none is graphite.
    expect(oneLookHex(palette({ role: { kind: "media", playing: true } }).base)).toBe("#D68006");
    expect(palette({ role: { kind: "media", playing: false } }).surface).toBe("graphite");
  });

  it("draws no colour as graphite", () => {
    const p = palette({ role: PLAIN });
    expect(p.surface).toBe("graphite");
    expect(p.disc).toEqual(white(0.13));
    expect(p.glyph).toEqual(white(0.92));
    expect(p.ink2).toEqual(white(0.74));
    expect(near(p.rimOpacity, 0.2)).toBe(true);
    expect(near(p.sheen, 0.07)).toBe(true);
    expect([p.light, p.base, p.shade].map(oneLookHex)).toEqual(["#2D2E33", "#202125", "#191A1D"]);
  });

  it("counts the theme's colour for every kind but lights only with option B", () => {
    const theme = palette({ role: PLAIN, themeHue: "#3D8CF0", noColour: "themeDefault" });
    expect(theme.surface).toBe("coloured");
    expect(oneLookHex(theme.base)).toBe("#3D8CF0");
    expect(oneLookHex(palette({ role: LIT, themeHue: "#3D8CF0", noColour: "themeDefault" }).base)).toBe("#D68006");
    // Option A, the app's now, ignores the theme.
    expect(palette({ role: PLAIN, themeHue: "#3D8CF0" }).surface).toBe("graphite");
  });

  it("lets unavailable win over everything but a camera", () => {
    const p = palette({ role: LIT, hue: "#F5A524", unavailable: true, quietOffline: false });
    expect(p.surface).toBe("graphite");
    expect(p.hatch && near(p.contentOpacity, 0.5)).toBe(true);
    expect(p.disc).toEqual(white(0.08));
    expect(p.glyph).toEqual(white(0.75));
    expect(p.isLit || p.glow !== undefined).toBe(false);

    const camera = palette({ role: { kind: "camera" }, hue: "#F5A524", unavailable: true });
    expect(camera.surface).toBe("camera");
    expect(camera.ink2).toEqual(white(0.9));
    expect(camera.disc).toEqual({ rgb: [0x10, 0x10, 0x12], opacity: 0.5 });
    expect(camera.glyph).toEqual(white(1));
    expect(near(camera.rimOpacity, 0.28)).toBe(true);

    // Quiet, the app's now: flat and dim, no hatch, no sheen.
    const quiet = palette({ role: PLAIN, hue: "#F5A524", unavailable: true, calm: true });
    expect(quiet.surface === "graphite" && !quiet.hatch && near(quiet.contentOpacity, 0.5)).toBe(true);
    expect(quiet.sheen).toBe(0);
    expect(quiet.light).toEqual(ONE_LOOK_OFFLINE_GROUND);
    expect(quiet.shade).toEqual(ONE_LOOK_OFFLINE_GROUND);
    expect(near(quiet.rimOpacity, 0.1)).toBe(true);
    expect(quiet.ink2).toEqual(white(0.74));
  });

  it("brightens the corner and rim when pressed", () => {
    const p = palette({ role: PLAIN, hue: "#FFA500", pressed: true });
    expect(oneLookHex(p.base)).toBe("#CE8500");
    expect(near(p.sheen, 0.416)).toBe(true);
    expect(near(p.sheenStop, 36)).toBe(true);
    expect(near(p.rimOpacity, 0.72)).toBe(true);
    // A full lamp pressed caps at 50%.
    expect(near(palette({ role: LIT, hue: "#8F7BEA", pressed: true }).sheen, 0.416)).toBe(true);
  });

  it("veils evenly wrist down", () => {
    const p = palette({ role: LIT, hue: "#8F7BEA", aod: true });
    expect(p.sheen).toBe(0);
    expect(near(p.rimOpacity, 0.12)).toBe(true);
    expect(near(p.veil, 0.52)).toBe(true);
    expect(p.disc).toEqual(white(0.62));
    expect(p.pearlGlow || p.glow !== undefined).toBe(false);
    expect(p.ink).toEqual(white(0.86));
    expect(p.ink2).toEqual(white(0.62));
    const fill = oneLookFill(p, { width: 102, height: 67 }, { x: 7, y: 40 });
    expect(fill.stops[0]?.color).toEqual(p.base);
    expect(fill.sheen).toEqual({ kind: "none" });

    const graphite = palette({ role: PLAIN, aod: true });
    expect(graphite.sheen === 0 && near(graphite.rimOpacity, 0.12) && near(graphite.veil, 0.52)).toBe(true);
    expect(graphite.ink2).toEqual(white(0.62));
  });

  it("draws an off light coloured with dim when off turned off", () => {
    const p = palette({ role: { kind: "light", on: false, brightness: 0.4 }, hue: "#8F7BEA", dimWhenOff: false });
    expect(p.surface).toBe("coloured");
    expect(oneLookHex(p.base)).toBe("#8F7BEA");
    expect(p.disc).toEqual(white(0.3));
    expect(p.isLit).toBe(false);
    expect(near(p.brightness, 1)).toBe(true);
  });

  it("mixes the colour opacity toward graphite before deepening", () => {
    const p = palette({ role: PLAIN, hue: "#FFCC00", colorOpacity: 0.5 });
    expect(p.base).toEqual(oneLookDeepenForWhite(oneLookMix(rgb("#FFCC00"), ONE_LOOK_GRAPHITE, 0.5)));
    expect(oneLookWhiteContrast(p.base)).toBeGreaterThanOrEqual(3);
  });

  it("lets the state's own colour win", () => {
    expect(oneLookHex(palette({ role: PLAIN, hue: "#FF3B30", stateHue: "#3D8CF0" }).base)).toBe("#3D8CF0");
  });

  it("keeps a gradient's and rainbow's stops, deepened", () => {
    const g = palette({ role: LIT, hue: "GRADIENT|#FFCC00|#3D8CF0" });
    expect(g.bases.map(oneLookHex)).toEqual(["#B49000", "#3D8CF0"]);
    expect(oneLookHex(g.base)).toBe("#B49000");
    expect(g.hue).toEqual(rgb("#FFCC00"));
    expect(oneLookHex(g.glyph.rgb)).toBe("#997A00");

    const rainbow = palette({ role: PLAIN, hue: "#RAINBOW" });
    expect(rainbow.bases).toHaveLength(7);
    for (const stop of rainbow.bases) expect(oneLookWhiteContrast(stop)).toBeGreaterThanOrEqual(3);
    const fill = oneLookFill(rainbow, { width: 179, height: 115.3 }, { x: 12, y: 70 });
    // light, six stops from the hue stop on, the last one's shade at the end.
    expect(fill.stops).toHaveLength(8);
    expect(fill.stops[0]?.location).toBe(0);
    expect(fill.stops[7]?.location).toBe(1);
    expect(fill.stops[1]?.location).toBe(fill.baseStop);
    for (let i = 1; i < fill.stops.length; i += 1) expect(fill.stops[i]!.location).toBeGreaterThanOrEqual(fill.stops[i - 1]!.location);
  });

  it("keeps a light's brightness to 1%, as the app's cache does", () => {
    const a = palette({ role: { kind: "light", on: true, brightness: 0.643 }, hue: "#8F7BEA" });
    const b = palette({ role: { kind: "light", on: true, brightness: 0.64 }, hue: "#8F7BEA" });
    expect(a).toBe(b);
    expect(near(a.brightness, 0.64)).toBe(true);
  });
});

describe("the fill (OneLookFill)", () => {
  const lavender60 = () => palette({ role: { kind: "light", on: true, brightness: 0.6 }, hue: "#8F7BEA" });

  it("moves the hue stop with the text", () => {
    const stacked = oneLookFill(lavender60(), { width: 179, height: 115.3 }, { x: 12.67, y: 70 });
    expect(near(stacked.baseStop, 0.2709038396194359)).toBe(true);
    expect(stacked.stops.map((s) => oneLookHex(s.color))).toEqual(["#9B8ED5", "#7D6DC9", "#7162B5"]);
    expect(stacked.sheen.kind).toBe("ellipse");
    if (stacked.sheen.kind === "ellipse") {
      expect(near(stacked.sheen.opacity, 0.156)).toBe(true);
      expect(near(stacked.sheen.end, 0.258)).toBe(true);
    }

    const strip = oneLookFill(lavender60(), { width: 179, height: 51.7 }, { x: 49.3, y: 10 }, true, 42.7);
    expect(near(strip.baseStop, 0.24704377980060682)).toBe(true);
    expect(strip.sheen.kind).toBe("circle");
    if (strip.sheen.kind === "circle") {
      expect(near(strip.sheen.opacity, 0.156)).toBe(true);
      expect(near(strip.sheen.radius, 38.43)).toBe(true);
    }

    // Text right in the corner floors the stop at 6%; text far along caps it at 30%.
    expect(near(oneLookFill(lavender60(), { width: 400, height: 115.3 }, { x: 12, y: 5 }).baseStop, 0.06)).toBe(true);
    expect(near(oneLookFill(lavender60(), { width: 100, height: 100 }, { x: 60, y: 60 }).baseStop, 0.3)).toBe(true);
  });

  it("reads back the mock's self check", () => {
    // A text start giving a 21% share sets the stop at .2, as the mock's check used.
    const fill = oneLookFill(lavender60(), { width: 179, height: 115.3 }, { x: 30.9015, y: 30.9015 });
    expect(near(fill.baseStop, 0.2, 0.00001)).toBe(true);
    expect(oneLookHex(oneLookFillColourAt(fill, { x: 20, y: 60 }))).toBe("#7C6CC7");
  });

  it("keeps white at three to one from the hue stop on", () => {
    const size = { width: 179, height: 115.3 };
    for (const hue of ["#FFCC00", "#A4E34B", "#F2F2F7", "#5AC8FA", "#A9C4E8", "#DE9A55", "#3FBFA6", undefined]) {
      for (const role of [LIT, { kind: "light", on: true, brightness: 0.3 } as const, PLAIN]) {
        const p = palette({ role, hue });
        if (p.surface !== "coloured") continue;
        const fill = oneLookFill(p, size, { x: 12.67, y: 70 });
        for (let share = fill.baseStop; share <= 1; share += 0.05) {
          const along = share * (size.width + size.height);
          const point = { x: along * 0.75, y: along * 0.25 };
          if (point.x > size.width) continue;
          expect(oneLookWhiteContrast(oneLookFillColourAt(fill, point)), `${hue} ${role.kind} ${share}`).toBeGreaterThanOrEqual(2.95);
        }
      }
    }
  });

  it("draws graphite and camera fills", () => {
    const fill = oneLookFill(palette({ role: PLAIN }), { width: 100, height: 60 }, { x: 0, y: 0 }, true, 30);
    expect(fill.stops.map((s) => oneLookHex(s.color))).toEqual(["#2D2E33", "#202125", "#191A1D"]);
    expect(fill.baseStop).toBe(0.55);
    expect(fill.sheen).toEqual({ kind: "ellipse", opacity: 0.07, end: 0.55 });

    const camera = oneLookFill(palette({ role: { kind: "camera" } }), { width: 100, height: 60 }, { x: 0, y: 0 });
    expect(camera.stops.every((s) => oneLookHex(s.color) === "#222222")).toBe(true);
    expect(camera.sheen).toEqual({ kind: "none" });

    const quiet = oneLookFill(palette({ role: PLAIN, unavailable: true }), { width: 100, height: 60 }, { x: 0, y: 0 });
    expect(quiet.stops.every((s) => oneLookHex(s.color) === "#18191C")).toBe(true);
    expect(quiet.sheen).toEqual({ kind: "none" });
  });

  it("darkens the Fill style's track toward graphite (the spec's computed hex)", () => {
    const full = oneLookFill(palette({ role: LIT, hue: "#8F7BEA" }), { width: 100, height: 60 }, { x: 60, y: 60 });
    expect(oneLookFillTrackStops(full).map((s) => oneLookHex(s.color))).toEqual(["#615C7B", "#4F4778", "#49426E"]);
    const amber = oneLookFill(palette({ role: LIT }), { width: 100, height: 60 }, { x: 60, y: 60 });
    expect(oneLookFillTrackStops(amber).map((s) => oneLookHex(s.color))).toEqual(["#735D40", "#6C4918", "#5E4118"]);
  });
});

describe("what the views paint", () => {
  it("tints the bar from the base, white with the White style or no hue", () => {
    expect(oneLookHex(oneLookBarColour(palette({ role: LIT, hue: "#8F7BEA" }), false))).toBe("#DDD7F9");
    expect(oneLookHex(oneLookBarColour(palette({ role: LIT }), false))).toBe("#F3D9B4");
    expect(oneLookHex(oneLookBarColour(palette({ role: LIT, hue: "#8F7BEA" }), true))).toBe("#FFFFFF");
    expect(oneLookHex(oneLookBarColour(palette({ role: PLAIN }), false))).toBe("#FFFFFF");
  });

  it("draws the bridge look's bare glyph and its halo", () => {
    expect(oneLookHex(oneLookBareGlyph(rgb("#8F7BEA")))).toBe("#EFEDFC");
    expect(oneLookHex(oneLookBareGlyph(rgb("#4A90D9")))).toBe("#E6EFFA");
    expect(oneLookGlyphInk(palette({ role: LIT, hue: "#8F7BEA" }), false)).toEqual({ rgb: rgb("#FFF8EA"), opacity: 1 });
    expect(oneLookGlyphInk(palette({ role: PLAIN, hue: "#8F7BEA" }), false)).toEqual({ rgb: rgb("#EFEDFC"), opacity: 1 });
    expect(oneLookGlyphInk(palette({ role: OFF }), false).rgb).toEqual(rgb("#F5C27A"));
    expect(oneLookGlyphInk(palette({ role: PLAIN }), false)).toEqual(white(0.92));
    // On a disc the palette's glyph.
    expect(oneLookHex(oneLookGlyphInk(palette({ role: LIT }), true).rgb)).toBe("#B66D05");
    expect(oneLookGlyphHaloOpacity(palette({ role: LIT, hue: "#8F7BEA" }))).toBe(0.32);
    expect(oneLookGlyphHaloOpacity(palette({ role: PLAIN, hue: "#8F7BEA" }))).toBe(0.14);
    expect(oneLookGlyphHaloOpacity(palette({ role: PLAIN }))).toBeUndefined();
    expect(oneLookGlyphHaloOpacity(palette({ role: PLAIN, hue: "#8F7BEA" }), { picture: true })).toBeUndefined();
  });

  it("fades the rim from its corner", () => {
    expect(oneLookRimStops(0.45).map((s) => s.location)).toEqual([0, 0.3, 0.58, 1]);
  });

  it("writes the fill as CSS", () => {
    const fill = oneLookFill(palette({ role: PLAIN }), { width: 100, height: 60 }, { x: 0, y: 0 });
    expect(oneLookBlendCss(fill.stops)).toBe("linear-gradient(135deg, #2D2E33 0%, #202125 55%, #191A1D 100%)");
    expect(oneLookSheenCss(fill.sheen)).toBe("radial-gradient(120% 100% at 0% 0%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 55%)");
    expect(oneLookSheenCss({ kind: "circle", opacity: 0.2, radius: 30 }, 2)).toBe("radial-gradient(circle 60px at 0 0, rgba(255, 255, 255, 0.2) 0, rgba(255, 255, 255, 0) 100%)");
    expect(oneLookInkCss(white(0.3))).toBe("rgba(255, 255, 255, 0.3)");
    expect(oneLookInkCss(rgb("#8F7BEA"))).toBe("#8F7BEA");
  });
});
