// The icon glow's save check and the code point count (`tile-glow.ts`).

import { describe, expect, it } from "vitest";
import type { WatchPageTile } from "../src/watch-pages/model.js";
import { codePoints, tileGlowProblems } from "../src/watch-pages/tile-glow.js";

const BED: WatchPageTile = { id: "6A1C2B3D-0001-4000-8000-000000000001", entityId: "light.bed", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#F2AE4E" };

describe("tileGlowProblems", () => {
  it("refuses the shapes the integration refuses and leaves ranges to the readers", () => {
    expect(tileGlowProblems(BED)).toEqual([]);
    expect(tileGlowProblems({ ...BED, iconGlow: null })).toEqual([]);
    expect(tileGlowProblems({ ...BED, iconGlow: { mode: "on", size: 900, brightness: -3, color: "red" } })).toEqual([]);
    expect(tileGlowProblems({ ...BED, iconGlow: "on" })).toEqual(["iconGlow must be an object."]);
    expect(tileGlowProblems({ ...BED, iconGlow: [] })).toEqual(["iconGlow must be an object."]);
    expect(tileGlowProblems({ ...BED, iconGlow: { mode: "ON", size: true, brightness: "x", color: 3 } })).toEqual([
      'iconGlow.mode must be "auto", "on" or "off".',
      "iconGlow.size must be a number.",
      "iconGlow.brightness must be a number.",
      "iconGlow.color must be a string.",
    ]);
  });
});

describe("codePoints", () => {
  it("counts code points, as Python's len does, not UTF-16 units", () => {
    expect(codePoints("")).toBe(0);
    expect(codePoints("abc")).toBe(3);
    expect(codePoints("é")).toBe(1);
    expect(codePoints("😀")).toBe(1);
    expect("😀".length).toBe(2);
  });
});
