// The picture's reading of a tile's basic settings: the watch's label and
// icon sizes, No icon, the label's weight, design and color, and a header's
// look.

import { describe, expect, it } from "vitest";

import type { WatchPageTile } from "../src/watch-pages/model.js";
import {
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
