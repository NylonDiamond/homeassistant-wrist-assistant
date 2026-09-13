// A line draws as a bar down the middle of its frame's long side, and its
// selection box and corner handles sit on that bar. These pin down that the box
// hugs the bar and that a corner drag changes only the line's length.

import { describe, expect, it } from "vitest";

import { lineResize } from "../src/interact.js";
import { LINE_OUTLINE_MIN, lineOutline } from "../src/renderer.js";

const canvas = { width: 200, height: 100 };

describe("a line's selection box", () => {
  it("hugs a thick horizontal bar", () => {
    const box = { x: 0, y: 0, w: 100, h: 40, cx: 50, cy: 20 };
    expect(lineOutline(box, 6)).toEqual({ x: 0, y: 17, w: 100, h: 6, cx: 50, cy: 20 });
  });

  it("stays thick enough to grab on a thin line", () => {
    const box = { x: 0, y: 0, w: 100, h: 40, cx: 50, cy: 20 };
    expect(lineOutline(box, 1).h).toBe(LINE_OUTLINE_MIN);
  });

  it("runs down a vertical bar", () => {
    const box = { x: 0, y: 0, w: 10, h: 60, cx: 5, cy: 30 };
    expect(lineOutline(box, 2)).toEqual({ x: 3, y: 0, w: 4, h: 60, cx: 5, cy: 30 });
  });
});

describe("a corner drag on a line", () => {
  // 100 x 40 pt frame: a horizontal line.
  const base = { x: 0.1, y: 0.2, width: 0.5, height: 0.4, rotationDegrees: 0 };

  it("changes only the length", () => {
    const f = lineResize(base, canvas, "se", { x: 20, y: 30 });
    expect(f.width * canvas.width).toBeCloseTo(120);
    expect(f.x).toBe(0.1);
    expect(f.y).toBe(0.2);
    expect(f.height).toBe(0.4);
  });

  it("keeps the right end when the left handle moves", () => {
    const f = lineResize(base, canvas, "nw", { x: 20, y: -30 });
    expect((f.x + f.width) * canvas.width).toBeCloseTo(120);
    expect(f.width * canvas.width).toBeCloseTo(80);
  });

  it("never gets shorter than the frame is tall, so it stays horizontal", () => {
    const f = lineResize(base, canvas, "se", { x: -500, y: 0 });
    expect(f.width * canvas.width).toBeGreaterThanOrEqual(40);
  });
});
