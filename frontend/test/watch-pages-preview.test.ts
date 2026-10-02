// The picture's reading of a tile's basic settings: the watch's label and
// icon sizes, No icon, the label's weight, design and color, and a header's
// look.

import { describe, expect, it } from "vitest";

import type { WatchPage, WatchPageTile } from "../src/watch-pages/model.js";
import type { HassEntityState } from "../src/ha-api.js";
import { WATCH_TILE_DEFAULTS, watchThemeRoleColors } from "../src/watch-pages/tile-new.js";
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
  watchTileBorderStyle,
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
} from "../src/watch-pages/preview.js";
import { watchStylingTheme } from "../src/watch-pages/tile-styling.js";

const tile = (extra: Record<string, unknown> = {}): WatchPageTile => ({ id: "T1", entityId: "light.desk", ...extra });

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

  it("draws an own size in proportion to the picture's automatic size", () => {
    const auto = watchPreviewIconSize(tile(), w, h, false);
    expect(auto).toBeCloseTo(Math.min(24, h * 0.3));
    expect(watchPreviewIconSize(tile({ iconSizeOverride: 36 }), w, h, false)).toBeCloseTo(auto);
    expect(watchPreviewIconSize(tile({ iconSizeOverride: 18 }), w, h, false)).toBeCloseTo(auto / 2);
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
    const line = watchTileBorderStyle(tile({ color: "#FF0000", borderStyle: "line", borderThickness: "medium", borderLineStyle: "dashed", borderGlow: 0.5 }), true, 2);
    expect(line).toContain("border:6px dashed #FF0000");
    expect(line).toContain("box-shadow:");
    expect(watchTileBorderStyle(tile({ borderStyle: "line", borderColor: "#00FF00", borderLineStyle: "dotted" }), true, 1)).toContain("dotted #00FF00");
    expect(watchTileBorderStyle(tile({ borderStyle: "none" }), true, 1)).toBe("");
  });

  it("honor only when on with the picture's state", () => {
    const t = tile({ borderStyle: "line", color: "#FF0000" });
    expect(watchTileBorderStyle(t, false, 1)).toBe("");
    expect(watchTileBorderStyle({ ...t, borderActiveOnly: false }, false, 1)).toContain("rgba(255, 255, 255, 0.13)");
    expect(watchTilePreviewActive(t, state("light.desk", "off"))).toBe(false);
    expect(watchTilePreviewActive(t, state("light.desk", "on"))).toBe(true);
    expect(watchTilePreviewActive(t)).toBe(true);
  });
});

describe("patterns and the state bar", () => {
  it("draw a pattern in its color at its opacity times the pattern's own", () => {
    expect(watchPatternLayers("stripes", "#FFFFFF", 1, 1)[0]).toContain("rgba(255, 255, 255, 0.2)");
    expect(watchPatternLayers("grid", "#FFFFFF", 0.5, 1)).toHaveLength(2);
    expect(watchPatternLayers("hexagons", "#FF0000", 1, 1)[0]).toContain("rgba(255, 0, 0, 0.15)");
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

  it("honor the value label style on a sensor, a counter, a binary sensor and a climate", () => {
    const sensor = state("sensor.temp", "21.53", { unit_of_measurement: "°C" });
    const t = { id: "T", entityId: "sensor.temp" };
    expect(face(t, sensor)).toContain("21.5 °C");
    expect(face({ ...t, stateValueLabelStyle: "Off" }, sensor)).not.toContain("21.5");
    const pill = face({ ...t, stateValueLabelStyle: "Pill" }, sensor);
    expect(pill).toContain("21.5 °C");
    expect(pill).toContain("border-radius:999px");
    expect(face(t, sensor)).not.toContain("border-radius:999px");
    for (const [entityId, value] of [["counter.cups", "4"], ["binary_sensor.door", "on"], ["climate.hall", "heat"]] as const) {
      const states = state(entityId, value, { current_temperature: 20, temperature: 21 });
      expect(face({ id: "T", entityId }, states), entityId).toContain("wp-state");
      expect(face({ id: "T", entityId, stateValueLabelStyle: "Off" }, states), entityId).not.toContain("wp-state");
      expect(face({ id: "T", entityId, stateValueLabelStyle: "Pill" }, states), entityId).toContain("border-radius:999px");
    }
  });

  it("put a bar tile's value label top left", () => {
    const drawn = face({ id: "T", entityId: "light.desk", color: "#FF0000" }, state("light.desk", "on", { brightness: 128 }));
    const value = drawn.slice(drawn.indexOf("wp-value"));
    expect(value).toMatch(/top:8px;left:6px/);
    expect(value).not.toMatch(/right:/);
  });

  it("multiply the fill, the border and the pattern by colorOpacity", () => {
    const t = { id: "T", entityId: "light.desk", color: "#FF0000", colorOpacity: 0.5, borderStyle: "line", borderActiveOnly: false, backgroundPattern: "stripes", patternOpacity: 1 };
    const drawn = face(t);
    expect(drawn).toContain("background:rgba(255, 0, 0, 0.15)");
    expect(drawn).toContain("solid rgba(255, 0, 0, 0.5)");
    expect(drawn).toContain("rgba(115, 115, 115, 0.1)");
  });

  it("draw Animate with no animation as a plain line, no glow", () => {
    expect(watchTileBorderStyle(tile({ borderStyle: "animate", color: "#FF0000" }), true, 1)).not.toContain("box-shadow");
    expect(watchTileBorderStyle(tile({ borderStyle: "animate", borderAnimation: "none", color: "#FF0000" }), true, 1)).toBe("border:0.75px solid #FF0000");
    expect(watchTileBorderStyle(tile({ borderStyle: "animate", borderAnimation: "chase", color: "#FF0000" }), true, 1)).toContain("box-shadow");
  });

  it("draw the border and the bar of a tile with no color in its kind's theme color", () => {
    const light = watchThemeRoleColors("ember").entityLight!;
    const t = { id: "T", entityId: "light.desk", borderStyle: "line", borderActiveOnly: false, stateBarStyle: "Top" };
    expect(watchTileFallbackInk(t, page())).toBe(light);
    expect(watchTileFallbackInk(t, page({ themeOverride: undefined }))).toBe(watchThemeRoleColors(WATCH_TILE_DEFAULTS.watchFallbackTheme).entityLight);
    const drawn = face(t, state("light.desk", "on", { brightness: 255 }));
    expect(drawn).toContain(`solid ${light}`);
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
    expect(bg).toContain("linear-gradient(135deg, #112233, #445566)");
    expect(bg).toContain("rgba(0, 0, 0, 0.4)");
    expect(bg).toContain("radial-gradient(circle");
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
