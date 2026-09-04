// Where a value popover lands. The popover is drawn in the browser's top layer,
// so these are window coordinates and nothing an ancestor does with overflow is
// involved: the only job here is staying under the chip and inside the window.

import { describe, expect, it } from "vitest";
import { placePopover } from "../src/editors.js";

const VIEW = { width: 1400, height: 900 };
const SIZE = { width: 380, height: 300 };
const chip = (left: number, top: number, height = 30) => ({ left, top, bottom: top + height, width: 260 });

describe("placePopover", () => {
  it("sits just under the chip when there is room", () => {
    const at = placePopover(chip(1000, 200), SIZE, VIEW);
    expect(at.above).toBe(false);
    expect(at.top).toBe(236);
    expect(at.left).toBe(1000);
  });

  it("flips above a chip near the bottom of the window", () => {
    const at = placePopover(chip(1000, 840), SIZE, VIEW);
    expect(at.above).toBe(true);
    expect(at.top).toBeGreaterThanOrEqual(8);
    expect(at.top + Math.min(SIZE.height, at.maxHeight)).toBeLessThanOrEqual(840);
  });

  it("stays below when below is tight but above is tighter", () => {
    const at = placePopover(chip(1000, 100), { width: 380, height: 900 }, { width: 1400, height: 260 });
    expect(at.above).toBe(false);
  });

  it("pulls back from the right edge instead of hanging off it", () => {
    const at = placePopover(chip(1300, 200), SIZE, VIEW);
    expect(at.left).toBe(VIEW.width - SIZE.width - 8);
    expect(at.left + SIZE.width).toBeLessThanOrEqual(VIEW.width);
  });

  it("never goes off the left edge, even in a window narrower than itself", () => {
    const at = placePopover(chip(4, 200), SIZE, { width: 320, height: 900 });
    expect(at.left).toBe(8);
  });

  it("reports the room it has, so a tall form scrolls instead of overflowing", () => {
    const at = placePopover(chip(100, 700), { width: 380, height: 600 }, VIEW);
    expect(at.maxHeight).toBeLessThanOrEqual(VIEW.height);
    expect(at.top + at.maxHeight).toBeLessThanOrEqual(VIEW.height + 1);
  });

  it("keeps a usable height even when the chip leaves almost none", () => {
    const at = placePopover(chip(100, 60), SIZE, { width: 1400, height: 150 });
    expect(at.maxHeight).toBeGreaterThanOrEqual(140);
    expect(at.top).toBeGreaterThanOrEqual(8);
  });
});
