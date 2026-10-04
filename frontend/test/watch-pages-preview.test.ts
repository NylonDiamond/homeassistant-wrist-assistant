// The picture's reading of a tile's basic settings: the watch's label and
// icon sizes, No icon, the label's weight, design and color, and a header's
// look.

import { svg } from "lit";
import { describe, expect, it } from "vitest";

import type { WatchPage, WatchPageTile } from "../src/watch-pages/model.js";
import type { HassEntityState } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import { watchThemeRoleColors } from "../src/watch-pages/tile-new.js";
import {
  renderWatchTileFace,
  watchSpacerStyle,
  watchTileFallbackInk,
  renderWatchPageTitle,
  watchBadgeFontSize,
  watchBorderWidth,
  watchBrightnessVeil,
  watchPageTitleSize,
  watchPatternLayers,
  watchScreenBackground,
  watchScreenColor,
  watchTileBorder,
  watchTilePreviewActive,
  watchTileStatePercent,
  watchAutoLabelFontSize,
  watchHeaderLook,
  watchPreviewIconSize,
  watchTileHasNoIcon,
  watchTileIconSize,
  watchTileLabelColor,
  watchTileLabelFamily,
  watchTileLabelFontSize,
  watchTileLabelWeight,
  watchBatteryBadge,
  watchCameraBorderWidth,
  watchCameraCornerRadius,
  watchClimateTemperature,
  watchMultiCamBorder,
  watchMultiCamCellFill,
  watchMultiCamGrid,
  watchMultiCamRowHeights,
  watchPersonBadge,
  watchRemotePlayerId,
  watchRemoteSymbol,
  watchSpecialTileLook,
  watchTileIsTvRemote,
  watchTileStateKey,
  renderWatchClock,
  renderWatchPagePreview,
  watchClockFontSize,
  watchIconVerticalOffset,
  watchLabelBottomPadding,
  watchSensorValueText,
  watchStatusClock,
  watchTileBadge,
  watchTileCornerRadius,
  watchTileFill,
  watchTileIconTreatment,
  watchTileLabelShown,
  watchTileStyleActive,
  watchTimerText,
  watchBorderContentPadding,
  watchGearCentre,
  watchSaturate,
} from "../src/watch-pages/preview.js";
import { watchStylingTheme } from "../src/watch-pages/tile-styling.js";

const tile = (extra: Record<string, unknown> = {}): WatchPageTile => ({ id: "T1", entityId: "light.desk", ...extra });

/** The SVG inside every `data:image/svg+xml` URL in some CSS, decoded. */
const svgIn = (cssText: string | undefined): string =>
  [...(cssText ?? "").matchAll(/data:image\/svg\+xml,([^")]*)/g)].map((m) => decodeURIComponent(m[1]!)).join("\n");

describe("label size", () => {
  it("follows the watch's steps by width", () => {
    const at = [29.9, 30, 44.9, 45, 59.9, 60, 79.9, 80, 200].map(watchAutoLabelFontSize);
    expect(at).toEqual([6, 7, 7, 8, 8, 9, 9, 10, 10]);
  });

  it("takes the tile's own size over the automatic one", () => {
    expect(watchTileLabelFontSize(tile({ labelFontSizeOverride: 13 }), 40)).toBe(13);
    expect(watchTileLabelFontSize(tile(), 40)).toBe(7);
    expect(watchTileLabelFontSize(tile({ labelFontSizeOverride: "13" }), 40)).toBe(7);
  });
});

describe("icon size", () => {
  // 6 by 4 at 46 mm: about 103 by 68 points.
  const w = 103;
  const h = 68;

  it("is the watch's automatic size, capped at 36 with a label and 40 without", () => {
    expect(watchTileIconSize(tile(), w, h)).toBeCloseTo(36);
    expect(watchTileIconSize(tile({ showLabel: false }), w, h)).toBe(40);
    expect(watchTileIconSize(tile(), 30, 30)).toBe(Math.min(30 * 0.7, 30 * 0.68));
    expect(watchTileIconSize(tile(), 12, 12)).toBe(10);
  });

  it("holds the tile's own size to what fits, never under 8", () => {
    expect(watchTileIconSize(tile({ iconSizeOverride: 20 }), w, h)).toBe(20);
    expect(watchTileIconSize(tile({ iconSizeOverride: 90 }), w, h)).toBeCloseTo(h * 0.54);
    expect(watchTileIconSize(tile({ iconSizeOverride: 2 }), w, h)).toBe(8);
  });

  it("draws the watch's own size in the picture", () => {
    expect(watchPreviewIconSize(tile(), w, h)).toBe(watchTileIconSize(tile(), w, h));
    expect(watchPreviewIconSize(tile({ iconSizeOverride: 18 }), w, h)).toBe(18);
    // Width 0.64 and height 0.54 with a label, 0.7 and 0.68 without.
    expect(watchTileIconSize(tile(), 40, 40)).toBeCloseTo(Math.min(40 * 0.64, 40 * 0.54));
    expect(watchTileIconSize(tile(), 40, 34)).toBeCloseTo(Math.min(40 * 0.7, 34 * 0.68));
    expect(watchTileIconSize(tile(), 200, 200)).toBe(36);
    expect(watchTileIconSize(tile(), 200, 30)).toBeCloseTo(30 * 0.68);
    expect(watchTileIconSize(tile({ showLabel: false }), 200, 200)).toBe(40);
  });

  it("knows No icon from an absent icon", () => {
    expect(watchTileHasNoIcon(tile({ icon: "" }))).toBe(true);
    expect(watchTileHasNoIcon(tile())).toBe(false);
    expect(watchTileHasNoIcon(tile({ icon: "lightbulb" }))).toBe(false);
  });
});

describe("label look", () => {
  it("maps the weight, regular for absent or unknown", () => {
    expect(watchTileLabelWeight(tile())).toBe(400);
    expect(watchTileLabelWeight(tile({ labelFontWeight: "light" }))).toBe(300);
    expect(watchTileLabelWeight(tile({ labelFontWeight: "bold" }))).toBe(700);
    expect(watchTileLabelWeight(tile({ labelFontWeight: "heavy" }))).toBe(400);
  });

  it("maps the design to a family, none for the default", () => {
    expect(watchTileLabelFamily(tile())).toBeUndefined();
    expect(watchTileLabelFamily(tile({ labelFontDesign: "monospaced" }))).toMatch(/monospace/);
    expect(watchTileLabelFamily(tile({ labelFontDesign: "serif" }))).toMatch(/serif/);
    expect(watchTileLabelFamily(tile({ labelFontDesign: "rounded" }))).toMatch(/rounded/i);
  });

  it("draws a gradient label color as its first color", () => {
    expect(watchTileLabelColor(tile())).toBeUndefined();
    expect(watchTileLabelColor(tile({ labelColorHex: "#FFD60A" }))).toBe("#FFD60A");
    expect(watchTileLabelColor(tile({ labelColorHex: "GRADIENT|#FFD60A|#000000" }))).toBe("#FFD60A");
  });
});

describe("header look", () => {
  it("reads the style, text size and glow", () => {
    expect(watchHeaderLook({ id: "H", entityId: "divider.label.custom.g60", labelFontSizeOverride: 13 })).toEqual({
      style: "label",
      textSize: 13,
      glow: 0.6,
    });
    expect(watchHeaderLook({ id: "H", entityId: "divider.line.custom" })).toEqual({ style: "line", textSize: 10, glow: 0 });
  });
});

// ── styling, drawn flat (part 3d) ────────────────────────────────────────

const state = (entityId: string, value: string, attributes: Record<string, unknown> = {}): Record<string, HassEntityState> => ({
  [entityId]: { entity_id: entityId, state: value, attributes, last_changed: "", last_updated: "" },
});

/** A template's text with its values, for a look at what it draws. */
function text(t: unknown): string {
  if (typeof t === "symbol" || t === null || t === undefined) return "";
  if (Array.isArray(t)) return t.map(text).join("");
  if (typeof t !== "object") return String(t);
  const r = t as { strings?: readonly string[]; values?: unknown[] };
  if (r.strings === undefined) return "";
  return r.strings.map((s, i) => s + (i < (r.values?.length ?? 0) ? text(r.values![i]) : "")).join("");
}

describe("borders", () => {
  it("are as wide as the watch draws them", () => {
    expect(["extraThin", "thin", "medium", "thick", "none"].map((t) => watchBorderWidth(t, true))).toEqual([0.75, 1.5, 3, 5, 0]);
    expect(watchBorderWidth("auto", true)).toBe(1.8);
    expect(watchBorderWidth("auto", false)).toBe(1.1);
  });

  it("draw the line style and the glow, in the border color else the tile's", () => {
    const line = watchTileBorder(tile({ color: "#FF0000", borderStyle: "line", borderThickness: "medium", borderLineStyle: "dashed", borderGlow: 0.5 }), true)!;
    expect(line).toMatchObject({ width: 3, paint: { kind: "flat", css: "#FF0000" }, dash: [6, 4], glowInk: "#FF0000", animated: false });
    // Four wider strokes under the line at 0.15, 0.25, 0.4 and 0.7 of the glow.
    expect(line.glow).toEqual([{ width: 11, alpha: 0.075 }, { width: 8, alpha: 0.125 }, { width: 6, alpha: 0.2 }, { width: 4, alpha: 0.35 }]);
    expect(watchTileBorder(tile({ borderStyle: "line", borderColor: "#00FF00", borderLineStyle: "dotted" }), true)).toMatchObject({ paint: { css: "#00FF00" }, dash: [2, 2] });
    expect(watchTileBorder(tile({ borderStyle: "line", color: "GRADIENT|#112233|#445566" }), true)!.paint).toEqual({ kind: "gradient", from: "#112233", to: "#445566" });
    expect(watchTileBorder(tile({ borderStyle: "line", borderColor: "#RAINBOW" }), true)!.paint).toEqual({ kind: "rainbow" });
    expect(watchTileBorder(tile({ borderStyle: "none" }), true)).toBeUndefined();
  });

  it("stroke on the tile's edge, so the tile clips half of it, and pad the symbol and name", () => {
    const t = tile({ color: "#FF0000", borderStyle: "line", borderThickness: "medium", borderLineStyle: "dashed" });
    const drawn = text(renderWatchTileFace(t, { width: 60, height: 60 }, { page: { id: "P", name: "P", items: [] }, pages: [], screen: { width: 208, height: 248 }, scale: 2 }, 21));
    expect(drawn).toContain('class="wp-rim"');
    expect(drawn).toMatch(/<rect x="0" y="0" width=120 height=120 rx=16 fill="none" stroke=#FF0000 stroke-width=6 stroke-linecap="round" stroke-dasharray=12 8 \/>/);
    // Medium pads 2 points: the symbol's box and the name move in.
    expect(drawn).toContain("inset:4px");
    expect(drawn).toContain("bottom:12px;left:4px;right:4px");
    expect([undefined, "none", "extraThin", "thin", "medium", "thick", "auto"].map((t) => watchBorderContentPadding(tile({ borderStyle: "line", borderThickness: t })))).toEqual([0, 0, 0, 1, 2, 4, 1]);
    expect(watchBorderContentPadding(tile({ borderThickness: "thick" }))).toBe(0);
  });

  it("honor only when on with the picture's state", () => {
    const t = tile({ borderStyle: "line", color: "#FF0000" });
    expect(watchTileBorder(t, false)).toBeUndefined();
    // Off, the theme's hairline (white at 0.13) at 0.72.
    expect(watchTileBorder({ ...t, borderActiveOnly: false }, false)!.paint).toEqual({ kind: "flat", css: "rgba(255, 255, 255, 0.094)" });
    expect(watchTilePreviewActive(t, state("light.desk", "off"))).toBe(false);
    expect(watchTilePreviewActive(t, state("light.desk", "on"))).toBe(true);
    expect(watchTilePreviewActive(t)).toBe(true);
  });
});

describe("patterns and the state bar", () => {
  it("draw a pattern in its color at its opacity times the pattern's own", () => {
    const svgOf = svgIn;
    expect(svgOf(watchPatternLayers("stripes", "#FFFFFF", 1, 1)[0])).toContain('stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="2"');
    expect(watchPatternLayers("grid", "#FFFFFF", 0.5, 1)).toHaveLength(1);
    expect(svgOf(watchPatternLayers("grid", "#FFFFFF", 0.5, 1)[0])).toContain('stroke-opacity="0.075" stroke-width="1"');
    expect(svgOf(watchPatternLayers("hexagons", "#FF0000", 1, 1)[0])).toContain('stroke="#FF0000" stroke-opacity="0.15"');
    expect(svgOf(watchPatternLayers("diamond", "#FFFFFF", 0.5, 2)[0])).toMatch(/viewBox="0 0 10 10".*stroke-width="1.5"/);
    expect(watchPatternLayers("diamond", "#FFFFFF", 0.5, 2)[0]).toContain("0 0 / 20px 20px repeat");
    // An unknown pattern, and one drawn across the view without its size, is a wash.
    expect(watchPatternLayers("unknownThing", "#FF0000", 1, 1)[0]).toBe("linear-gradient(rgba(255, 0, 0, 0.15), rgba(255, 0, 0, 0.15))");
    expect(watchPatternLayers("sunburst", "#FF0000", 1, 1)[0]).toBe("linear-gradient(rgba(255, 0, 0, 0.2), rgba(255, 0, 0, 0.2))");
  });

  it("draw each pattern with the watch's geometry", () => {
    const svgOf = svgIn;
    // Stripes and crosshatch run through the view's centre.
    expect(watchPatternLayers("stripes", "#FFFFFF", 1, 2, { width: 100, height: 60 })[0]).toContain("50px 30px / 22.627px 22.627px");
    expect(svgOf(watchPatternLayers("horizontalLines", "#FFFFFF", 1, 1)[0])).toContain('<line x1="0" y1="4" x2="8" y2="4"');
    expect(svgOf(watchPatternLayers("dots", "#FFFFFF", 1, 1)[0])).toContain('<circle cx="4" cy="4" r="1.5"');
    expect(svgOf(watchPatternLayers("checkerboard", "#FFFFFF", 1, 1)[0])).toContain("M0 0h6v6H0zM6 6h6v6H6z");
    expect(svgOf(watchPatternLayers("waves", "#FFFFFF", 1, 1)[0])).toContain("M0 0L2 2.83L4 4L6 2.83L8 0");
    expect(svgOf(watchPatternLayers("zigzag", "#FFFFFF", 1, 1)[0])).toContain("M0 4L4 0L8 8L12 0L16 8");
    expect(svgOf(watchPatternLayers("triangles", "#FFFFFF", 1, 1)[0])).toContain('width="12" height="20.78"');
    expect(svgOf(watchPatternLayers("hexagons", "#FFFFFF", 1, 1)[0])).toContain('width="30" height="17.32"');
    const sun = svgOf(watchPatternLayers("sunburst", "#FFFFFF", 1, 1, { width: 100, height: 60 })[0]);
    expect(sun.match(/<line /g)).toHaveLength(16);
    const rings = svgOf(watchPatternLayers("concentric", "#FFFFFF", 1, 1, { width: 100, height: 60 })[0]);
    // Every 8 out to half the diagonal (58.3): 8 rings.
    expect(rings.match(/<circle /g)).toHaveLength(8);
    // The seeded noise: 40 dots per 1000 square points, the same every time.
    const noise = svgOf(watchPatternLayers("noise", "#FFFFFF", 1, 1, { width: 100, height: 60 })[0]);
    expect(noise.match(/<circle /g)).toHaveLength(240);
    expect(noise).toBe(svgOf(watchPatternLayers("noise", "#FFFFFF", 1, 1, { width: 100, height: 60 })[0]));
    expect(watchPatternLayers("vignette", "#FFFFFF", 1, 1, { width: 100, height: 60 })[0]).toContain("circle 70px,");
    expect(watchPatternLayers("cornerGlow", "#FFFFFF", 1, 1, { width: 100, height: 60 })[0]).toContain("circle 120px at 0% 100%");
  });

  it("read how full the bar is from the entity", () => {
    expect(watchTileStatePercent(tile(), state("light.desk", "on", { brightness: 255 }))).toBe(1);
    expect(watchTileStatePercent(tile(), state("light.desk", "off"))).toBe(0);
    expect(watchTileStatePercent({ id: "C", entityId: "cover.blind" }, state("cover.blind", "open", { current_position: 40 }))).toBe(0.4);
    expect(watchTileStatePercent(tile())).toBeUndefined();
  });

  it("size the value label by the tile's smaller side, or its own size", () => {
    expect([20, 30, 45, 60].map((side) => watchBadgeFontSize(tile(), 100, side))).toEqual([4, 5, 7, 9]);
    expect(watchBadgeFontSize(tile({ badgeFontSizeOverride: 12 }), 100, 20)).toBe(12);
  });
});

describe("tiles as the watch draws them", () => {
  const page = (extra: Record<string, unknown> = {}): WatchPage => ({ id: "P", name: "P", items: [], themeOverride: "ember", ...extra });
  const face = (t: WatchPageTile, states?: Record<string, HassEntityState>, size = { width: 60, height: 60 }) =>
    text(renderWatchTileFace(t, size, { page: page(), pages: [], screen: { width: 198, height: 242 }, states, scale: 1 }, 21));

  it("draw a spacer as SpacerTile does: a solid line at any thickness, nothing else of the border, no effect", () => {
    const spacer = { id: "S", entityId: "spacer.A", color: "#FF0000", borderStyle: "none", borderThickness: "thick", borderLineStyle: "dashed", borderGlow: 0.8, borderColor: "#00FF00", tileAnimation: "aurora" };
    const drawn = face(spacer);
    expect(drawn).toContain("border:5px solid rgba(255, 0, 0, 0.8)");
    expect(drawn).not.toContain("dashed");
    expect(drawn).not.toContain("box-shadow");
    expect(drawn).not.toContain("0, 255, 0");
    expect(drawn).not.toContain("radial-gradient(ellipse");
    expect(watchSpacerStyle({ id: "S", entityId: "spacer.A", borderThickness: "none" }, 1)).toContain("border:0");
    expect(watchSpacerStyle({ id: "S", entityId: "spacer.A", borderThickness: "auto" }, 1)).toContain("border:0");
    expect(watchSpacerStyle({ id: "S", entityId: "spacer.A", borderThickness: "auto", backgroundPattern: "dots" }, 1)).toContain("border:2px solid");
    expect(watchSpacerStyle({ id: "S", entityId: "spacer.A", color: "#FF0000", colorOpacity: 0.5 }, 1)).toContain("rgba(255, 0, 0, 0.4)");
  });

  it("honor the value label style on a sensor, a counter and a binary sensor, as a badge top left", () => {
    const sensor = state("sensor.temp", "21.53", { unit_of_measurement: "°C" });
    const t = { id: "T", entityId: "sensor.temp" };
    expect(face(t, sensor)).toContain("21.5°C");
    expect(face(t, sensor)).toContain('class="wp-badge"');
    expect(face(t, sensor)).not.toContain("wp-state");
    expect(face({ ...t, stateValueLabelStyle: "Off" }, sensor)).not.toContain("21.5");
    const pill = face({ ...t, stateValueLabelStyle: "Pill" }, sensor);
    expect(pill).toContain("21.5°C");
    expect(pill).toContain("border-radius:999px");
    expect(face(t, sensor)).not.toContain("border-radius:999px");
    for (const [entityId, value] of [["counter.cups", "4"], ["binary_sensor.door", "on"]] as const) {
      const states = state(entityId, value, { current_temperature: 20, temperature: 21 });
      expect(face({ id: "T", entityId }, states), entityId).toContain("wp-badge");
      expect(face({ id: "T", entityId, stateValueLabelStyle: "Off" }, states), entityId).not.toContain("wp-badge");
      expect(face({ id: "T", entityId, stateValueLabelStyle: "Pill" }, states), entityId).toContain("border-radius:999px");
    }
  });

  it("put a bar tile's value label top left", () => {
    const drawn = face({ id: "T", entityId: "light.desk", color: "#FF0000" }, state("light.desk", "on", { brightness: 128 }));
    const value = drawn.slice(drawn.indexOf("wp-badge"));
    expect(value).toMatch(/top:8px;left:6px/);
    expect(value).not.toMatch(/right:/);
    expect(value).toContain(">50%<");
  });

  it("multiply the fill and the border by colorOpacity, and not the pattern", () => {
    const t = { id: "T", entityId: "light.desk", color: "#FF0000", colorOpacity: 0.5, borderStyle: "line", borderActiveOnly: false, backgroundPattern: "stripes", patternOpacity: 1 };
    const drawn = face(t);
    // Lit: the color, at saturation 0.92, at 0.52 times 0.5.
    expect(drawn).toContain("rgba(239, 4, 4, 0.26)");
    expect(drawn).toContain("rgba(255, 255, 255, 0.16)");
    expect(drawn).toContain("stroke=rgba(255, 0, 0, 0.5)");
    // The pattern's gray at its own 0.2, whatever the color's opacity.
    expect(svgIn(drawn)).toContain('stroke="#737373" stroke-opacity="0.2"');
  });

  it("draw Animate with no animation as a plain line, no glow", () => {
    expect(watchTileBorder(tile({ borderStyle: "animate", color: "#FF0000" }), true)).toMatchObject({ animated: false, glow: [] });
    expect(watchTileBorder(tile({ borderStyle: "animate", borderAnimation: "none", color: "#FF0000" }), true)).toEqual({ width: 0.75, paint: { kind: "flat", css: "#FF0000" }, dash: undefined, glow: [], glowInk: "#FF0000", animated: false });
    expect(watchTileBorder(tile({ borderStyle: "animate", borderAnimation: "chase", color: "#FF0000" }), true)).toMatchObject({ animated: true });
  });

  it("draw the border and the bar of a tile with no color in its kind's color in the page's theme", () => {
    // A tile view's own fallback is sunnyBeachDay (the watch never applies a
    // theme to its tiles' colors), but no tile reaches a view without a
    // color: the sync rules give it its kind's color in its page's theme.
    const fallback = watchThemeRoleColors("sunnyBeachDay").entityLight!;
    const t = { id: "T", entityId: "light.desk", borderStyle: "line", borderActiveOnly: false, stateBarStyle: "Top" };
    expect(watchTileFallbackInk(t, page())).toBe(fallback);
    expect(watchTileFallbackInk(t, page({ themeOverride: undefined }))).toBe(fallback);
    const light = watchThemeRoleColors("ember").entityLight!;
    const drawn = face(t, state("light.desk", "on", { brightness: 255 }));
    expect(drawn).toContain(`stroke=${light}`);
    const n = parseInt(light.slice(1), 16);
    expect(drawn).toContain(`rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, 0.3)`);
    expect(drawn).not.toContain("solid #FFFFFF");
  });
});

describe("the page", () => {
  it("dims or brightens its base as the watch does", () => {
    expect(watchBrightnessVeil(0.6)).toBe("rgba(0, 0, 0, 0.4)");
    expect(watchBrightnessVeil(1)).toBeUndefined();
    expect(watchBrightnessVeil(1.5)).toBe("rgba(255, 255, 255, 0.12)");
    expect(watchBrightnessVeil(3)).toBe("rgba(255, 255, 255, 0.12)");
  });

  it("falls back to the theme's background when it has no color", () => {
    const page = { id: "P", name: "P", items: [], themeOverride: "ember" };
    expect(watchScreenColor(page)).toBe(watchStylingTheme("ember")!.pageDefaultBackground);
    expect(watchScreenColor({ ...page, backgroundColor: "#112233" })).toBe("rgba(17, 34, 51, 1)");
    const bg = watchScreenBackground({ ...page, backgroundColor: "GRADIENT|#112233|#445566", backgroundPattern: "dots", backgroundBrightness: 0.6 });
    expect(bg).toContain("linear-gradient(to bottom right, #112233, #445566)");
    expect(bg).toContain("rgba(0, 0, 0, 0.4)");
    expect(bg).toContain("data:image/svg+xml");
    // With the screen's size, along its diagonal in points.
    expect(watchScreenBackground({ ...page, backgroundColor: "GRADIENT|#112233|#445566" }, 1, { width: 208, height: 248 })).toContain("linear-gradient(140.01deg, #112233, #445566)");
  });

  it("draws a theme's own layered background when the page has no color", () => {
    const base = watchStylingTheme("ember")!.pageDefaultBackground;
    const bg = watchScreenBackground({ id: "P", name: "P", items: [], themeOverride: "ember", backgroundBrightness: 1 }, 2, { width: 208, height: 248 });
    // The glow from the bottom out to 150 points, the wash from the bottom
    // left corner, then the base.
    expect(bg).toBe(`radial-gradient(circle 300px at 50% 100%, rgba(232, 163, 61, 0.12), transparent), linear-gradient(39.99deg, rgba(232, 81, 47, 0.18), rgba(184, 114, 58, 0.14), transparent), linear-gradient(${base}, ${base})`);
    expect(watchScreenBackground({ id: "P", name: "P", items: [], themeOverride: "hyperPop", backgroundBrightness: 1 })).toContain("rgba(241, 91, 181, 0.22))");
  });

  it("puts the page's pattern over its veil and under its animated overlay", () => {
    const bg = watchScreenBackground({ id: "P", name: "P", items: [], backgroundColor: "#000000", backgroundPattern: "grid", backgroundOverlay: "aurora", backgroundBrightness: 0.6 });
    expect(bg.indexOf("radial-gradient(ellipse")).toBeLessThan(bg.indexOf("data:image/svg+xml"));
    expect(bg.indexOf("data:image/svg+xml")).toBeLessThan(bg.indexOf("rgba(0, 0, 0, 0.4)"));
  });

  it("draws the title with its size and icon, not with style none or full screen", () => {
    expect(watchPageTitleSize("size22")).toBe(22);
    expect(watchPageTitleSize(undefined)).toBe(10);
    const page = { id: "P", name: "Kitchen", items: [], pageTitleDisplayStyle: "pill", pageTitleTextSize: "size12" };
    expect(text(renderWatchPageTitle(page, 1, 34, undefined))).toContain("Kitchen");
    expect(text(renderWatchPageTitle(page, 1, 34, undefined))).toContain("font-size:12px");
    expect(text(renderWatchPageTitle({ ...page, pageTitleDisplayStyle: "none" }, 1, 34, undefined))).toBe("");
    expect(text(renderWatchPageTitle({ ...page, fullScreen: true }, 1, 34, undefined))).toBe("");
  });
});

// ── special tiles (part 3f) ──────────────────────────────────────────────

describe("special tiles as their own watch views draw them", () => {
  // The page is ember; the tiles' own colors are sunnyBeachDay all the same.
  const sunny = watchThemeRoleColors("sunnyBeachDay");
  const page: WatchPage = { id: "P", name: "P", items: [], themeOverride: "ember" };
  const look = (t: WatchPageTile, states?: Record<string, HassEntityState>) => watchSpecialTileLook(t, { page, states });
  const many = (...parts: Record<string, HassEntityState>[]) => Object.assign({}, ...parts) as Record<string, HassEntityState>;
  /** A provider that draws only the names it is given, each as its name. */
  const icons = (...names: string[]): IconProvider => ({
    render: (symbol: string) => (names.includes(symbol) ? svg`<title>${symbol}</title>` : undefined),
    available: () => true,
    names: () => names,
  });
  const face = (t: WatchPageTile, states?: Record<string, HassEntityState>, size = { width: 60, height: 60 }, provider?: IconProvider) =>
    text(renderWatchTileFace(t, size, { page, pages: [], screen: { width: 198, height: 242 }, states, scale: 1, icons: provider }, 21));

  describe("remote and TV", () => {
    const remote = { id: "R", entityId: "remote.living_room_apple_tv", icon: "appletv" };
    const player = (value: string, attrs: Record<string, unknown> = { volume_level: 0.42 }) => state("media_player.living_room_apple_tv", value, attrs);

    it("picks the symbol by platform unless the tile has one of its own", () => {
      expect(watchRemoteSymbol(remote)).toBe("appletv");
      expect(watchRemoteSymbol({ id: "R", entityId: "remote.xbox_den", icon: "av.remote" })).toBe("xbox.logo");
      expect(watchRemoteSymbol({ id: "R", entityId: "remote.lg_xbox", icon: "play.rectangle" })).toBe("av.remote");
      expect(watchRemoteSymbol({ id: "R", entityId: "remote.den" })).toBe("av.remote");
      expect(watchRemoteSymbol({ id: "R", entityId: "remote.den", icon: "tv" })).toBe("tv");
      expect(watchRemoteSymbol({ id: "R", entityId: "remote.den", icon: "" })).toBeUndefined();
    });

    it("shows play or pause top right and the volume top left from the linked player", () => {
      const states = many(state("remote.living_room_apple_tv", "on"), player("playing"));
      const l = look(remote, states)!;
      expect(l.topRight).toBe("play.fill");
      // A point higher than the badge padding, in the secondary color.
      expect(l.topLeft).toEqual({ kind: "text", lines: ["42%"], ink: { hex: "#EBEBF5", alpha: 0.6 }, weight: 500, pill: false, dy: -1 });
      expect(l.ink).toEqual({ hex: sunny.entityRemote, alpha: 1 });
      expect(look(remote, many(state("remote.living_room_apple_tv", "on"), player("paused")))!.topRight).toBe("pause.fill");
      expect(look(remote, many(state("remote.living_room_apple_tv", "on"), player("idle")))!.topRight).toBe("pause.fill");
      const off = look(remote, many(state("remote.living_room_apple_tv", "on"), player("off")))!;
      expect(off.topLeft).toBeUndefined();
      expect(off.topRight).toBeUndefined();
      expect(off.active).toBe(false);
      expect(look({ ...remote, showActivityStatus: false }, states)!.topLeft).toBeUndefined();
      expect(look({ ...remote, showActivityStatus: false }, states)!.topRight).toBeUndefined();
    });

    it("reads associatedMediaPlayerId first, and the remote's own state with no player", () => {
      expect(watchRemotePlayerId({ ...remote, associatedMediaPlayerId: "media_player.den" })).toBe("media_player.den");
      expect(watchRemotePlayerId(remote)).toBe("media_player.living_room_apple_tv");
      const states = many(state("remote.living_room_apple_tv", "off"), state("media_player.den", "playing", { volume_level: 0.1 }));
      expect(look({ ...remote, associatedMediaPlayerId: "media_player.den" }, states)!.topLeft).toMatchObject({ lines: ["10%"] });
      const alone = look(remote, state("remote.living_room_apple_tv", "off"))!;
      expect(alone.topLeft).toBeUndefined();
      expect(alone.active).toBe(false);
      expect(look(remote, state("remote.living_room_apple_tv", "on"))!.active).toBe(true);
    });

    it("draws a TV with no remote of its own as a remote, without the media player's bar", () => {
      const tv = { id: "T", entityId: "media_player.tv", color: "#FF0000", stateBarStyle: "Top" };
      const states = state("media_player.tv", "playing", { device_class: "tv", volume_level: 0.3 });
      expect(watchTileIsTvRemote(tv, states)).toBe(true);
      expect(watchTileIsTvRemote(tv, many(states, state("remote.tv", "on")))).toBe(false);
      expect(watchTileIsTvRemote(tv)).toBe(false);
      expect(watchTileIsTvRemote({ id: "T", entityId: "media_player.kitchen" }, state("media_player.kitchen", "playing"))).toBe(false);
      expect(look(tv, states)).toMatchObject({ symbol: "av.remote", topRight: "play.fill", topLeft: { lines: ["30%"] } });
      const drawn = face(tv, states);
      expect(drawn).not.toContain("wp-bar");
      expect(drawn).toContain("30%");
      expect(drawn).not.toContain("wp-state");
      expect(look({ id: "M", entityId: "media_player.kitchen" }, state("media_player.kitchen", "playing"))).toBeUndefined();
    });
  });

  describe("camera", () => {
    const cam = { id: "C", entityId: "camera.front_door", customLabel: "Front" };
    const picture = state("camera.front_door", "idle", { entity_picture: "/api/camera_proxy/camera.front_door?token=t" });

    it("draws icon mode as a dark box with the symbol, the label in white and a rim at 60%", () => {
      const drawn = face({ ...cam, borderThickness: "medium" }, picture);
      expect(drawn).toContain("wp-cam icon");
      expect(drawn).toContain("Front");
      expect(drawn).toContain("color:#FFFFFF");
      // The rim is stroked after the clip, so half of it lies outside. The
      // tile has no color, so it draws in the camera color of its page's
      // theme, as the sync rules color it.
      const n = parseInt(watchThemeRoleColors("ember").entityCamera!.slice(1), 16);
      const rim = `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, 0.6)`;
      expect(drawn).toContain(`inset 0 0 0 1px ${rim}`);
      expect(drawn).toContain(`box-shadow:0 0 0 1px ${rim}`);
      expect(drawn).not.toContain("wp-snap");
      expect(drawn).not.toContain("wp-tile");
      expect(face({ ...cam, color: "#00FF00" }, picture)).toContain("inset 0 0 0 0.38px rgba(0, 255, 0, 0.6)");
      // The symbol's glow in its color at 0.4, radius 8.
      expect(face({ ...cam, color: "#00FF00" }, picture)).toContain("drop-shadow(0 0 8px rgba(0, 255, 0, 0.4))");
      expect(face(cam, picture, undefined, icons("video"))).toContain("<title>video</title>");
    });

    it("draws preview mode as the snapshot, letterboxed unless it fills, with a 1 point rim at 30% and no label", () => {
      const preview = { ...cam, cameraDisplayMode: "preview", color: "#00FF00" };
      const fit = face(preview, picture);
      expect(fit).toContain('background-image:url("/api/camera_proxy/camera.front_door?token=t")');
      expect(fit).toContain("background-size:contain;background-position:50% 50%");
      expect(fit).toContain("inset 0 0 0 0.5px rgba(0, 255, 0, 0.3)");
      expect(fit).not.toContain("Front");
      const fill = face({ ...preview, cameraFillMode: "fill", cameraFillOffsetX: 1, cameraFillOffsetY: -0.5 }, picture);
      expect(fill).toContain("background-size:cover;background-position:calc(50% - 30px) calc(50% + 15px)");
      expect(face({ ...preview, cameraFillMode: "fit", cameraFillOffsetX: 1 }, picture)).toContain("background-position:50% 50%");
      const none = face(preview, state("camera.front_door", "idle"));
      expect(none).not.toContain("wp-snap");
      expect(none).toContain("opacity:0.6");
    });

    it("rounds the corners by the short side", () => {
      expect([20, 30, 50, 80].map((side) => watchCameraCornerRadius(100, side))).toEqual([4, 5, 6, 8]);
      expect(["none", "extraThin", "thin", "medium", "thick", "auto", undefined].map(watchCameraBorderWidth)).toEqual([0, 0.75, 1, 2, 3, 1, 0.75]);
    });
  });

  describe("camera group", () => {
    const ids = ["camera.a", "camera.b", "camera.c"];
    const group = { id: "G", entityId: "multicam.7E0B1C2D-3E4F-4A5B-8C6D-9E0F1A2B3C4D", cameraGroupIds: ids, cameraDisplayMode: "preview" };

    it("lays the cameras out by the watch's grid rule", () => {
      expect([0, 1, 2, 3, 4, 5, 9, 10].map((n) => watchMultiCamGrid(n))).toEqual([
        { columns: 1, rows: 1 }, { columns: 1, rows: 1 }, { columns: 1, rows: 2 }, { columns: 2, rows: 2 },
        { columns: 2, rows: 2 }, { columns: 3, rows: 2 }, { columns: 3, rows: 3 }, { columns: 4, rows: 3 },
      ]);
      expect(watchMultiCamGrid(4, 1)).toEqual({ columns: 1, rows: 4 });
      expect(watchMultiCamGrid(5, 2)).toEqual({ columns: 2, rows: 3 });
      expect(watchMultiCamGrid(3, 0)).toEqual({ columns: 2, rows: 2 });
    });

    it("weights the rows only with one column and one weight per row", () => {
      expect(watchMultiCamRowHeights(31, 2, 1, 1, [1, 2])).toEqual([10, 20]);
      expect(watchMultiCamRowHeights(31, 2, 1, 2, [1, 2])).toEqual([15, 15]);
      expect(watchMultiCamRowHeights(31, 2, 1, 1, [1])).toEqual([15, 15]);
      expect(watchMultiCamRowHeights(31, 2, 1, 1, [0, 0])).toEqual([15, 15]);
    });

    it("fills each cell by its own mode, then the tile's, then fill", () => {
      const t = { ...group, cameraFillModes: ["fit"], cameraFillMode: "fit" };
      expect(watchMultiCamCellFill(t, 0)).toBe("fit");
      expect(watchMultiCamCellFill(t, 1)).toBe("fit");
      expect(watchMultiCamCellFill({ ...group, cameraFillModes: ["fit"] }, 1)).toBe("fill");
      expect(watchMultiCamCellFill({ ...group, cameraFillModes: ["fill"], cameraFillMode: "fit" }, 0)).toBe("fill");
    });

    it("draws the border as gaps and an inset in its color, else 1 point black gaps", () => {
      expect(watchMultiCamBorder(group)).toEqual({ on: false, width: 0, spacing: 1, background: "#000" });
      expect(watchMultiCamBorder({ ...group, multiCamBorderEnabled: true })).toEqual({ on: true, width: 1, spacing: 1, background: "#FFFFFF" });
      expect(watchMultiCamBorder({ ...group, multiCamBorderEnabled: true, multiCamBorderThickness: "thick", multiCamBorderColor: "ff0000" })).toEqual({ on: true, width: 3, spacing: 3, background: "#FF0000" });
      expect(watchMultiCamBorder({ ...group, multiCamBorderEnabled: true, multiCamBorderThickness: "medium", multiCamBorderColor: "#RAINBOW" }).background).toContain("#AF52DE");
      expect(watchMultiCamBorder({ ...group, multiCamBorderEnabled: true, multiCamBorderColor: "GRADIENT|#112233|#445566" }).background).toBe("linear-gradient(135deg, #112233, #445566)");
    });

    it("draws a mosaic of snapshots, an empty cell black, a missing snapshot as a faint symbol and an unavailable one washed red", () => {
      const states = many(
        state("camera.a", "idle", { entity_picture: "/a.jpg" }),
        state("camera.b", "idle"),
        state("camera.c", "unavailable"),
      );
      const drawn = face({ ...group, multiCamBorderEnabled: true, multiCamBorderThickness: "medium", multiCamBorderColor: "00FF00" }, states, { width: 62, height: 62 });
      expect(drawn.match(/class="wp-cell"/g)).toHaveLength(4);
      expect(drawn).toContain('url("/a.jpg");background-size:cover');
      expect(drawn).toContain("opacity:0.2");
      expect(drawn).toContain("wp-cell-gone");
      expect(drawn).toContain("background:#00FF00");
      // Inset 2, gap 2: cells 28 wide at 2 and 32.
      expect(drawn).toContain("left:2px;top:2px;width:28px;height:28px");
      expect(drawn).toContain("left:32px;top:32px;width:28px;height:28px");
      expect(face({ ...group, cameraGroupIds: [] })).toContain("opacity:0.6");
    });

    it("draws icon mode with its symbol and Cameras when it has no label", () => {
      const iconMode = { ...group, cameraDisplayMode: "icon" };
      expect(face(iconMode)).toContain("Cameras");
      expect(face({ ...iconMode, customLabel: "Yard" })).toContain("Yard");
      expect(face(iconMode, undefined, undefined, icons("rectangle.split.2x2.fill"))).toContain("<title>rectangle.split.2x2.fill</title>");
    });
  });

  describe("vacuum", () => {
    const vac = { id: "V", entityId: "vacuum.robo" };

    it("picks the symbol and color by state, the tile's own symbol first", () => {
      expect(look(vac, state("vacuum.robo", "docked"))).toMatchObject({ symbol: "house", ink: { hex: "#FFFFFF", alpha: 0.7 }, active: false, topRight: undefined });
      expect(look(vac, state("vacuum.robo", "cleaning"))).toMatchObject({ symbol: "hurricane", ink: { hex: sunny.entityVacuum }, active: true, topRight: "play.fill" });
      expect(look(vac, state("vacuum.robo", "returning"))).toMatchObject({ symbol: "arrow.uturn.backward", topRight: "arrow.uturn.backward" });
      expect(look(vac, state("vacuum.robo", "paused"))).toMatchObject({ symbol: "pause.fill", topRight: "pause.fill" });
      expect(look(vac, state("vacuum.robo", "error"))).toMatchObject({ symbol: "exclamationmark.triangle", ink: { hex: "#E76F51" }, topRight: "exclamationmark.triangle" });
      expect(look(vac, state("vacuum.robo", "idle"))!.symbol).toBe("hurricane");
      expect(look({ ...vac, icon: "fan" }, state("vacuum.robo", "docked"))!.symbol).toBe("fan");
      expect(look({ ...vac, icon: "" }, state("vacuum.robo", "docked"))!.symbol).toBeUndefined();
      expect(look({ ...vac, showActivityStatus: false }, state("vacuum.robo", "cleaning"))!.topRight).toBeUndefined();
    });

    it("shows the battery top left by quarter, red under 20 and orange under 40", () => {
      expect(look(vac, state("vacuum.robo", "docked", { battery_level: 15 }))!.topLeft).toEqual({ kind: "battery", level: 15, symbol: "battery.25", ink: { hex: "#FF3B30", alpha: 1 } });
      expect(look(vac, state("vacuum.robo", "docked", { battery_level: 35 }))!.topLeft).toMatchObject({ symbol: "battery.50", ink: { hex: "#FF9500" } });
      expect(look(vac, state("vacuum.robo", "docked", { battery_level: 60 }))!.topLeft).toMatchObject({ symbol: "battery.75", ink: { hex: "#EBEBF5", alpha: 0.6 } });
      expect(watchBatteryBadge(75).symbol).toBe("battery.100");
      expect(look({ ...vac, showBatteryOnTile: false }, state("vacuum.robo", "docked", { battery_level: 60 }))!.topLeft).toBeUndefined();
      expect(look({ ...vac, vacuumBatteryEntityId: "sensor.robo_battery" }, many(state("vacuum.robo", "docked"), state("sensor.robo_battery", "50")))!.topLeft).toBeUndefined();
      const drawn = face(vac, state("vacuum.robo", "docked", { battery_level: 15 }));
      expect(drawn).toContain("color:#FF3B30");
      expect(drawn).toContain("<span>15</span>");
      expect(drawn).not.toContain("wp-state");
    });
  });

  describe("lawn mower", () => {
    const mower = { id: "L", entityId: "lawn_mower.lawny" };

    it("is the plain sensor tile with the battery top left and its status top right", () => {
      const states = many(state("lawn_mower.lawny", "mowing"), state("sensor.lawny_battery", "55"));
      expect(look(mower, states)).toMatchObject({ symbol: "leaf.fill", ink: { hex: "#34C759" }, topRight: "play.fill", topLeft: { symbol: "battery.75", level: 55 } });
      expect(look({ ...mower, mowerBatteryEntityId: "sensor.other" }, many(states, state("sensor.other", "12.7")))!.topLeft).toMatchObject({ level: 12, symbol: "battery.25" });
      expect(look({ ...mower, showBatteryOnTile: false }, states)!.topLeft).toBeUndefined();
      expect(look(mower, state("lawn_mower.lawny", "docked"))).toMatchObject({ topLeft: undefined, topRight: undefined });
      expect(look(mower, state("lawn_mower.lawny", "returning"))!.topRight).toBe("arrow.uturn.backward");
      expect(look({ ...mower, icon: "leaf", color: "#123456" }, states)).toMatchObject({ symbol: "leaf", ink: { hex: "#123456" } });
      // The battery is its only reading: no line of state under the name.
      const drawn = face(mower, states);
      expect(drawn).toContain("<span>55</span>");
      expect(drawn).not.toContain("Mowing");
    });
  });

  describe("climate", () => {
    const hall = { id: "C", entityId: "climate.hall" };
    const at = (mode: string, attrs: Record<string, unknown> = {}) => state("climate.hall", mode, { temperature: 21, current_temperature: 20.4, ...attrs });

    it("picks the symbol and color by mode", () => {
      expect(look(hall, at("heat"))).toMatchObject({ symbol: "flame", filled: true, ink: { hex: "#F4A261" }, opacity: 1, active: true });
      expect(look(hall, at("cool"))).toMatchObject({ symbol: "snowflake", ink: { hex: "#4DBFE0" } });
      expect(look(hall, at("auto"))).toMatchObject({ symbol: "thermometer.variable", ink: { hex: "#88B6C9" } });
      expect(look(hall, at("dry"))).toMatchObject({ symbol: "drop.degreesign", ink: { hex: sunny.entityClimate } });
      expect(look(hall, at("fan_only"))).toMatchObject({ symbol: "fan", ink: { hex: sunny.entityFan } });
      expect(look(hall, at("off"))).toMatchObject({ symbol: "power", filled: false, opacity: 0.85, active: false });
      expect(look({ ...hall, icon: "thermometer" }, at("heat"))!.symbol).toBe("thermometer");
      expect(look({ ...hall, color: "#00FF00" }, at("heat"))!.ink.hex).toBe("#00FF00");
    });

    it("writes the target then the current temperature top left, unless the value label is off", () => {
      expect(look(hall, at("heat"))!.topLeft).toMatchObject({ lines: ["21°", "20°"], pill: false });
      expect(look(hall, at("heat", { target_temp_step: 0.5, temperature: 21.5 }))!.topLeft).toMatchObject({ lines: ["21.5°", "20.4°"] });
      expect(look(hall, at("heat_cool", { target_temp_low: 19, target_temp_high: 24 }))!.topLeft).toMatchObject({ lines: ["19°/24°", "20°"] });
      expect(look(hall, at("heat", { supported_features: 2, target_temp_low: 18, target_temp_high: 23 }))!.topLeft).toMatchObject({ lines: ["18°/23°", "20°"] });
      expect(look({ ...hall, showTargetTempOnTile: false }, at("heat"))!.topLeft).toMatchObject({ lines: ["20°"] });
      expect(look({ ...hall, showCurrentTempOnTile: false }, at("heat"))!.topLeft).toMatchObject({ lines: ["21°"] });
      expect(look({ ...hall, showCurrentTempOnTile: false, showTargetTempOnTile: false }, at("heat"))!.topLeft).toBeUndefined();
      expect(look({ ...hall, stateValueLabelStyle: "Off" }, at("heat"))!.topLeft).toBeUndefined();
      expect(look({ ...hall, stateValueLabelStyle: "Pill" }, at("heat"))!.topLeft).toMatchObject({ pill: true });
      expect(watchClimateTemperature(20.44, 0.1)).toBe("20.4°");
      const drawn = face(hall, at("heat"));
      // The target in the secondary color, the room's temperature in white at 0.85.
      expect(drawn).toContain("<span style=color:rgba(235, 235, 245, 0.6)>21°</span><span style=color:rgba(255, 255, 255, 0.85)>20°</span>");
      expect(drawn).not.toContain("wp-state");
      expect(face({ ...hall, stateValueLabelStyle: "Pill" }, at("heat"))).toContain("border-radius:999px");
    });

    it("shows what it is doing top right while on", () => {
      expect(look(hall, at("heat", { hvac_action: "heating" }))!.topRight).toBe("flame.fill");
      expect(look(hall, at("cool", { hvac_action: "cooling" }))!.topRight).toBe("snowflake");
      expect(look(hall, at("dry", { hvac_action: "drying" }))!.topRight).toBe("dehumidifier.fill");
      expect(look(hall, at("fan_only", { hvac_action: "fan" }))!.topRight).toBe("fan.fill");
      expect(look(hall, at("heat", { hvac_action: "idle" }))!.topRight).toBeUndefined();
      expect(look(hall, at("off", { hvac_action: "heating" }))!.topRight).toBeUndefined();
      expect(look({ ...hall, showActivityStatus: false }, at("heat", { hvac_action: "heating" }))!.topRight).toBeUndefined();
    });

    it("takes the state icon and color first, only while state icons are in use", () => {
      const styled = { ...hall, icon: "thermometer", usesStateIcons: true, stateIcons: { heat: "sun.max" }, stateColors: { heat: "#00FF00", off: "#0000FF" } };
      expect(look(styled, at("heat"))).toMatchObject({ symbol: "sun.max", filled: false, ink: { hex: "#00FF00" } });
      expect(look(styled, at("off"))).toMatchObject({ symbol: "thermometer", ink: { hex: "#0000FF" } });
      expect(look({ ...styled, usesStateIcons: undefined }, at("heat"))).toMatchObject({ symbol: "thermometer", ink: { hex: "#F4A261" } });
      expect(watchTileStateKey(styled, "unknown")).toBe("unavailable");
      expect(watchTileStateKey(styled, "HEAT")).toBe("heat");
      expect(watchTileStateKey(hall, "heat")).toBeUndefined();
    });

    it("draws the fill variant while on when the provider has it", () => {
      expect(face(hall, at("heat"), undefined, icons("flame", "flame.fill"))).toContain("<title>flame.fill</title>");
      expect(face(hall, at("heat"), undefined, icons("flame"))).toContain("<title>flame</title>");
      expect(face(hall, at("off"), undefined, icons("power", "power.fill"))).toContain("<title>power</title>");
    });
  });

  describe("person", () => {
    const alex = { id: "P", entityId: "person.alex" };
    const at = (where: string, attrs: Record<string, unknown> = { entity_picture: "/api/image/serve/alex/512x512" }) => state("person.alex", where, attrs);

    it("draws the photo unless the icon was made custom or the photo is off", () => {
      expect(look(alex, at("home"))!.photo).toBe("/api/image/serve/alex/512x512");
      expect(look({ ...alex, icon: "person" }, at("home"))!.photo).toBeDefined();
      expect(look({ ...alex, icon: "star" }, at("home"))!.photo).toBeUndefined();
      expect(look({ ...alex, usesStateIcons: true, stateIcons: { home: "house" } }, at("home"))!.photo).toBeUndefined();
      expect(look({ ...alex, icon: "star", usePersonPhoto: true }, at("home"))!.photo).toBeDefined();
      expect(look({ ...alex, usePersonPhoto: false }, at("home"))!.photo).toBeUndefined();
      expect(look(alex, at("home", {}))!.photo).toBeUndefined();
      const drawn = face(alex, at("home"));
      expect(drawn).toContain('class="wp-photo"');
      expect(drawn).toContain(`solid rgba(`);
      expect(drawn).toContain("0.9)");
    });

    it("draws the symbol in its color, dimmed away from home", () => {
      expect(look({ ...alex, usePersonPhoto: false }, at("home"))).toMatchObject({ symbol: "person", filled: true, opacity: 1, ink: { hex: sunny.entityPerson }, active: true });
      expect(look({ ...alex, usePersonPhoto: false }, at("not_home"))).toMatchObject({ opacity: 0.6, active: false });
      expect(look({ ...alex, usePersonPhoto: false, dimWhenOff: false }, at("not_home"))!.opacity).toBe(1);
      expect(look({ ...alex, usesStateIcons: true, stateIcons: { not_home: "car" } }, at("not_home"))).toMatchObject({ symbol: "car", filled: false });
      expect(face({ ...alex, usePersonPhoto: false }, at("not_home"))).toContain("opacity:0.6");
    });

    it("writes where the person is top left", () => {
      expect(watchPersonBadge("home")).toBe("Home");
      expect(watchPersonBadge("not_home")).toBe("Away");
      expect(watchPersonBadge("work_office")).toBe("Work");
      expect(watchPersonBadge("Grandmas_house")).toBe("Grandm");
      expect(look(alex, at("work_office"))!.topLeft).toEqual({ kind: "text", lines: ["Work"], ink: { hex: "#FFFFFF", alpha: 0.8 }, weight: 500, pill: false });
      expect(look({ ...alex, showActivityStatus: false }, at("home"))!.topLeft).toBeUndefined();
    });
  });

  describe("alarm panel", () => {
    const panel = { id: "A", entityId: "alarm_control_panel.house" };
    const at = (value: string) => state("alarm_control_panel.house", value);

    it("picks the symbol, color and state word by state", () => {
      const cases: [string, string, string, string][] = [
        ["disarmed", "shield", "#FFFFFF", "OFF"],
        ["armed_home", "shield", "#E9C46A", "HOME"],
        ["armed_away", "shield", "#E76F51", "AWAY"],
        ["armed_night", "shield", "#BF5AF2", "NIGHT"],
        ["armed_vacation", "shield", "#E9C46A", "VACATION"],
        ["armed_custom_bypass", "shield", "#E9C46A", "CUSTOM"],
        ["pending", "shield.lefthalf.filled", "#2EC4B6", "PENDING"],
        ["arming", "shield.lefthalf.filled", "#2EC4B6", "ARMING"],
        ["disarming", "shield.lefthalf.filled", "#2EC4B6", "DISARMING"],
        ["triggered", "exclamationmark.shield", "#E76F51", "ALERT"],
        ["weird", "shield", "#FFFFFF", "OFF"],
      ];
      for (const [value, symbol, hex, word] of cases) {
        const l = look(panel, at(value))!;
        expect([l.symbol, l.ink.hex, l.topLeft?.kind === "text" ? l.topLeft.lines[0] : undefined], value).toEqual([symbol, hex, word]);
      }
      expect(look(panel, at("disarmed"))!.ink.alpha).toBe(0.7);
      expect(look(panel, at("disarmed"))!.active).toBe(false);
      expect(look(panel, at("arming"))!.active).toBe(true);
      expect(look(panel, at("triggered"))!.topLeft).toMatchObject({ weight: 600 });
    });

    it("keeps the tile's own symbol and honors the state overrides and showActivityStatus", () => {
      expect(look({ ...panel, icon: "shield" }, at("triggered"))!.symbol).toBe("shield");
      expect(look({ ...panel, color: "#00FF00" }, at("armed_away"))!.ink.hex).toBe("#00FF00");
      const styled = { ...panel, icon: "shield", usesStateIcons: true, stateIcons: { triggered: "bell" }, stateColors: { triggered: "#FF00FF" } };
      expect(look(styled, at("triggered"))).toMatchObject({ symbol: "bell", filled: false, ink: { hex: "#FF00FF" } });
      expect(look({ ...panel, showActivityStatus: false }, at("armed_home"))!.topLeft).toBeUndefined();
      expect(face(panel, at("armed_away"))).toContain("<span>AWAY</span>");
    });
  });

  it("leaves calendar and weather the plain tile", () => {
    expect(look({ id: "C", entityId: "calendar.family" }, state("calendar.family", "off"))).toBeUndefined();
    expect(look({ id: "W", entityId: "weather.home" }, state("weather.home", "sunny"))).toBeUndefined();
    // Outside the value label domains: a symbol and a name, no reading.
    const drawn = face({ id: "W", entityId: "weather.home" }, state("weather.home", "sunny"));
    expect(drawn).not.toContain("wp-badge");
    expect(drawn).not.toMatch(/sunny/i);
  });
});

// ── a tile laid out as the watch lays it out ─────────────────────────────

describe("the watch's tile layout", () => {
  const page: WatchPage = { id: "P", name: "P", items: [], themeOverride: "ember" };
  const face = (t: WatchPageTile, states?: Record<string, HassEntityState>, size = { width: 60, height: 60 }) =>
    text(renderWatchTileFace(t, size, { page, pages: [], screen: { width: 208, height: 248 }, states, scale: 1 }, 21));

  it("rounds the corners 4, 5, 6 or 8 by the smaller side", () => {
    expect([24.9, 25, 39.9, 40, 59.9, 60, 200].map((side) => watchTileCornerRadius(200, side))).toEqual([4, 5, 5, 6, 6, 8, 8]);
    expect(watchTileCornerRadius(30, 200)).toBe(5);
    expect(face(tile(), undefined, { width: 60, height: 30 })).toContain("border-radius:5px");
    expect(face(tile(), undefined, { width: 100, height: 100 })).toContain("border-radius:8px");
  });

  it("hides the name under 35 points tall and when it is turned off", () => {
    expect(watchTileLabelShown(tile(), 34.9)).toBe(false);
    expect(watchTileLabelShown(tile(), 35)).toBe(true);
    expect(watchTileLabelShown(tile({ showLabel: false }), 80)).toBe(false);
    expect(face(tile({ customLabel: "Desk" }), undefined, { width: 60, height: 34 })).not.toContain("wp-label");
    expect(face(tile({ customLabel: "Desk" }), undefined, { width: 60, height: 35 })).toContain(">Desk<");
  });

  it("sets the name's gap and lifts the symbol by the tile's height", () => {
    expect([34, 49, 69, 70].map(watchLabelBottomPadding)).toEqual([1, 3, 4, 5]);
    expect([40, 60, 80].map((h) => watchIconVerticalOffset(tile(), h))).toEqual([-2, -3, -4]);
    expect(watchIconVerticalOffset(tile(), 30)).toBe(0);
    expect(watchIconVerticalOffset(tile({ showLabel: false }), 80)).toBe(0);
    const drawn = face(tile({ customLabel: "Desk" }), undefined, { width: 60, height: 60 });
    expect(drawn).toContain("transform:translateY(-3px)");
    expect(drawn).toContain("bottom:4px");
  });

  it("draws the symbol at the watch's size, centred", () => {
    // 60 by 60 with a name: min(60 * 0.64, 60 * 0.54) = 32.4.
    expect(face(tile())).toMatch(/width=32\.4\d* /);
    expect(face(tile(), undefined, { width: 60, height: 30 })).toMatch(/width=20\.4\d* /);
  });

  it("writes each kind's badge as its watch view does, and none for the rest", () => {
    const badge = (t: WatchPageTile, states: Record<string, HassEntityState>, w = 60, h = 60) => watchTileBadge(t, { states }, w, h);
    expect(badge(tile(), state("light.desk", "off"))).toEqual({ text: "OFF", weight: 600, pill: false, top: 8 });
    expect(badge(tile(), state("light.desk", "on", { brightness: 128 }))).toMatchObject({ text: "50%", weight: 500 });
    expect(badge(tile(), state("light.desk", "on"))).toBeUndefined();
    expect(badge(tile({ stateBarStyle: "Fill" }), state("light.desk", "off"))!.top).toBe(6);
    expect(badge(tile({ stateValueLabelStyle: "Off" }), state("light.desk", "off"))).toBeUndefined();
    const cover = { id: "C", entityId: "cover.blind" };
    expect([0, 40, 100].map((p) => badge(cover, state("cover.blind", "open", { current_position: p }))!.text)).toEqual(["Closed", "40%", "Open"]);
    expect(badge(cover, state("cover.blind", "opening"))!.text).toBe("Opening");
    expect(badge(cover, state("cover.blind", "unavailable"))).toBeUndefined();
    expect(badge({ ...cover, stateBarStyle: "Fill" }, state("cover.blind", "closed"))!.top).toBe(5);
    expect(badge({ id: "F", entityId: "fan.ceiling" }, state("fan.ceiling", "on", { percentage: 33 }))!.text).toBe("33%");
    expect(badge({ id: "F", entityId: "fan.ceiling" }, state("fan.ceiling", "off", { percentage: 33 }))).toBeUndefined();
    expect(badge({ id: "M", entityId: "media_player.den" }, state("media_player.den", "paused", { volume_level: 0.257 }))!.text).toBe("25%");
    expect(badge({ id: "M", entityId: "media_player.den" }, state("media_player.den", "off", { volume_level: 0.2 }))).toBeUndefined();
    expect(badge({ id: "A", entityId: "automation.lights" }, state("automation.lights", "off"))).toEqual({ text: "OFF", weight: 600, pill: false, top: 6 });
    expect(badge({ id: "A", entityId: "automation.lights", showActivityStatus: false }, state("automation.lights", "on"))).toBeUndefined();
    expect(badge({ id: "T", entityId: "timer.tea" }, state("timer.tea", "active", { remaining: "0:04:05" }))).toMatchObject({ text: "4:05", top: 8 });
    expect(badge({ id: "T", entityId: "timer.tea" }, state("timer.tea", "idle", { remaining: "0:04:05" }))).toBeUndefined();
    expect(badge({ id: "N", entityId: "counter.cups" }, state("counter.cups", "4"))!.text).toBe("4");
    expect(badge({ id: "B", entityId: "binary_sensor.door" }, state("binary_sensor.door", "on", { device_class: "door" }))!.text).toBe("Open");
    expect(badge({ id: "S", entityId: "sensor.temp" }, state("sensor.temp", "unavailable"))).toBeUndefined();
    for (const [entityId, value] of [["switch.fan", "off"], ["lock.door", "unlocked"], ["scene.night", "scening"], ["input_boolean.guest", "off"]] as const) {
      expect(badge({ id: "X", entityId }, state(entityId, value)), entityId).toBeUndefined();
    }
    expect(face(tile(), state("light.desk", "off"))).toContain(">OFF<");
  });

  it("formats a sensor's value as the watch does", () => {
    expect(watchSensorValueText("21.53", "°C", undefined, undefined)).toBe("21.5°C");
    expect(watchSensorValueText("4.05", "kWh", undefined, 1)).toBe("4.1 kWh");
    expect(watchSensorValueText("12.50", "%", undefined, 2)).toBe("12.5%");
    expect(watchSensorValueText("7", "", undefined, 0)).toBe("7");
    expect(watchSensorValueText("-0.04", undefined, undefined, 1)).toBe("0");
    expect(watchSensorValueText("Cloudy", "x", undefined, 1)).toBe("Cloudyx");
    expect(watchSensorValueText("off", undefined, "moisture", 1)).toBe("Dry");
    expect(watchSensorValueText("on", undefined, "weird", 1)).toBe("On");
    expect(watchSensorValueText("idle", undefined, undefined, 1)).toBe("idle");
    expect(watchTimerText("1:02:03")).toBe("1:02:03");
    expect(watchTimerText("0:00:00")).toBe("--:--");
    expect(watchTimerText(undefined)).toBeUndefined();
  });

  it("lights the glass as each watch view hands isActive to its style", () => {
    expect(watchTileStyleActive(tile(), state("light.desk", "off"))).toBe(false);
    expect(watchTileStyleActive(tile(), state("light.desk", "on"))).toBe(true);
    expect(watchTileStyleActive({ id: "L", entityId: "lock.door" }, state("lock.door", "unlocked"))).toBe(true);
    expect(watchTileStyleActive({ id: "C", entityId: "cover.blind" }, state("cover.blind", "closed"))).toBe(true);
    expect(watchTileStyleActive({ id: "S", entityId: "sensor.t" }, state("sensor.t", "unavailable"))).toBe(false);
    expect(watchTileStyleActive({ id: "S", entityId: "binary_sensor.d" }, state("binary_sensor.d", "off"))).toBe(true);
    expect(watchTileStyleActive({ id: "M", entityId: "media_player.den" }, state("media_player.den", "idle"))).toBe(true);
    expect(watchTileStyleActive({ id: "M", entityId: "media_player.den" }, state("media_player.den", "off"))).toBe(false);
    expect(watchTileStyleActive({ id: "A", entityId: "automation.x" }, state("automation.x", "off"))).toBe(false);
    expect(watchTileStyleActive({ id: "P", entityId: "point_control.X" })).toBe(false);
    expect(watchTileStyleActive(tile())).toBe(true);
  });

  it("fills a lit tile in its color with the sheen and leaves an unlit one near clear and desaturated", () => {
    // Lit: the color at saturation 0.92 and 0.52 over the material, which
    // darkens what is behind it (black at 0.62 times 0.8).
    const lit = watchTileFill({ kind: "solid", hex: "#FF0000", opacity: 1 }, "#FFFFFF", true);
    expect(lit).toContain("rgba(239, 4, 4, 0.52)");
    expect(lit).toContain("rgba(255, 255, 255, 0.32)");
    expect(lit).toContain("rgba(0, 0, 0, 0.496)");
    expect(watchTileFill(undefined, "#00FF00", true)).toContain("rgba(15, 249, 15, 0.52)");
    const off = watchTileFill({ kind: "solid", hex: "#FF0000", opacity: 1 }, "#FFFFFF", false);
    expect(off).toContain("rgba(255, 0, 0, 0.025)");
    expect(off).toContain("rgba(142, 142, 147, 0.06)");
    expect(off).toContain("rgba(0, 0, 0, 0.24)");
    expect(off).not.toContain("0.52");
    // A gradient is its mesh, the rainbow a gradient along the tile's diagonal.
    expect(watchTileFill({ kind: "gradient", from: "#112233", to: "#445566" }, "#FFFFFF", true)).toContain("linear-gradient(to bottom right, rgba(");
    expect(watchTileFill({ kind: "rainbow" }, "#FFFFFF", true, 1, { width: 100, height: 50 })).toContain("linear-gradient(116.57deg, rgba(255, 69, 58, 0.42)");
    expect(watchSaturate("#FF0000", 0.92)).toBe("#ef0404");
    const drawn = face(tile({ color: "#FF0000" }), state("light.desk", "off"));
    expect(drawn).toContain("filter:saturate(0.5) brightness(0.94)");
    expect(drawn).toContain("wp-tile off");
    expect(face(tile({ color: "#FF0000", dimWhenOff: false }), state("light.desk", "off"))).not.toContain("saturate");
    expect(face(tile({ color: "#FF0000" }), state("light.desk", "on"))).not.toContain("saturate");
  });

  it("draws the symbol filled, faded and glowing as each kind does", () => {
    expect(watchTileIconTreatment(tile(), state("light.desk", "off"))).toEqual({ filled: false, opacity: 0.68, glow: undefined });
    // A light glows only with its active icon animation on, which it is
    // not by default.
    expect(watchTileIconTreatment(tile(), state("light.desk", "on"))).toEqual({ filled: true, opacity: 1, glow: undefined });
    expect(watchTileIconTreatment(tile({ activeIconAnimationEnabled: true }), state("light.desk", "on"))).toEqual({ filled: true, opacity: 1, glow: "lit" });
    // A sensor's soft shadow only while it is available.
    expect(watchTileIconTreatment({ id: "S", entityId: "sensor.x" }, state("sensor.x", "21")).glow).toBe("soft");
    expect(watchTileIconTreatment({ id: "S", entityId: "sensor.x" }, state("sensor.x", "unknown")).glow).toBeUndefined();
    expect(watchTileIconTreatment(tile({ dimWhenOff: false }), state("light.desk", "off")).opacity).toBe(1);
    expect(watchTileIconTreatment({ id: "S", entityId: "switch.x" }, state("switch.x", "off"))).toEqual({ filled: false, opacity: 0.85, glow: undefined });
    expect(watchTileIconTreatment({ id: "L", entityId: "lock.x" }, state("lock.x", "unlocked"))).toEqual({ filled: true, opacity: 0.6, glow: undefined });
    expect(watchTileIconTreatment({ id: "S", entityId: "scene.x" }, state("scene.x", "scening"))).toEqual({ filled: true, opacity: 1, glow: "soft" });
    expect(watchTileIconTreatment({ id: "S", entityId: "sensor.x" }, state("sensor.x", "unavailable")).opacity).toBe(0.5);
    expect(face(tile({ activeIconAnimationEnabled: true }), state("light.desk", "on"))).toContain("drop-shadow(0 0 5.83px");
    expect(face(tile(), state("light.desk", "on"))).not.toContain("drop-shadow(0 0 5.83px");
  });

  it("puts the clock where the device's clock is and the settings gear where the app parks it", () => {
    expect(watchStatusClock({ width: 208, height: 248 })).toEqual({ centreY: 25.5, leftFromTrailing: 53.5, rightMargin: 16.5 });
    expect(watchStatusClock({ width: 199, height: 243 })).toEqual({ centreY: 23, leftFromTrailing: 51, rightMargin: 14 });
    // The same size on every watch.
    expect(watchClockFontSize(208)).toBe(16);
    expect(watchClockFontSize(162)).toBe(16);
    const clock = text(renderWatchClock({ width: 208, height: 248 }, 1, 34, undefined));
    // The digits end at the right margin, less the figure's own side room.
    expect(clock).toContain("right:15.5px;top:25.5px;font-size:16px");
    // The gear's 26 point box: 2 in from the edge, leftFromTrailing less 4.5.
    expect(watchGearCentre({ width: 208, height: 248 })).toEqual({ x: 144, y: 25.5 });
    expect(watchGearCentre({ width: 162, height: 197 })).toEqual({ x: 105, y: 15 });
    expect(clock).toContain("left:131px;top:12.5px;width:26px;height:26px");
    expect(clock.indexOf("wp-gear")).toBeLessThan(clock.indexOf("10:09"));
    expect(text(renderWatchClock({ width: 208, height: 248 }, 1, 0, undefined))).toBe("");
  });

  it("draws the page inside the watch's case", () => {
    const drawn = text(renderWatchPagePreview({ page: { ...page, items: [tile()] }, pages: [], screen: { width: 208, height: 248 }, scale: 1 }));
    expect(drawn).toContain('class="wa-watch"');
    expect(drawn).toContain("--wf-radius:");
    expect(drawn).toContain("--wf-crown-top:");
    expect(drawn.indexOf("wa-watch")).toBeLessThan(drawn.indexOf("wp-screen"));
  });
});
