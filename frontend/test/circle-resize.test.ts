// A circle draws in the square at the middle of its frame, and its selection box
// and corner handles sit on that square. These pin down that the box is that
// square and that a corner drag resizes it from the opposite corner.

import { describe, expect, it } from "vitest";

import { squareResize } from "../src/interact.js";
import { centredSquare } from "../src/renderer.js";

const canvas = { width: 200, height: 100 };

describe("a circle's selection box", () => {
  it("is the frame's shorter side, centred", () => {
    const box = { x: 0, y: 0, w: 100, h: 40, cx: 50, cy: 20 };
    expect(centredSquare(box)).toEqual({ x: 30, y: 0, w: 40, h: 40, cx: 50, cy: 20 });
  });
});

describe("a corner drag on a circle", () => {
  // 100 x 40 pt frame at (0, 0): the circle's square is 40 pt at x 30.
  const base = { x: 0, y: 0, width: 0.5, height: 0.4, rotationDegrees: 0 };

  it("grows the square from the opposite corner", () => {
    const f = squareResize(base, canvas, "se", { x: 10, y: 10 });
    expect(f.width * canvas.width).toBeCloseTo(50);
    expect(f.height * canvas.height).toBeCloseTo(50);
    expect(f.x * canvas.width).toBeCloseTo(30);
    expect(f.y * canvas.height).toBeCloseTo(0);
  });

  it("keeps the bottom right corner when the top left handle moves in", () => {
    const f = squareResize(base, canvas, "nw", { x: 10, y: 10 });
    expect(f.width * canvas.width).toBeCloseTo(30);
    expect((f.x + f.width) * canvas.width).toBeCloseTo(70);
    expect((f.y + f.height) * canvas.height).toBeCloseTo(40);
  });

  it("never shrinks below the smallest size a drag allows", () => {
    const f = squareResize(base, canvas, "se", { x: -500, y: -500 });
    expect(f.width).toBeGreaterThanOrEqual(0.04);
    expect(f.height).toBeGreaterThanOrEqual(0.04);
  });
});
