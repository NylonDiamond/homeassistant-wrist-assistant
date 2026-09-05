// Arrow-key nudges. Frames are fractions of the canvas, so the only thing worth
// testing here is that one press is exactly one design point in whichever shape
// is on screen, and that the keyboard stops where a drag stops.

import { describe, expect, it } from "vitest";
import { NUDGE_COARSE, nudgeFrame, nudgePoint } from "../src/interact.js";
import { DESIGN_BOX, type NormalizedFrame } from "../src/model.js";

const frame = (x: number, y: number, width = 0.3, height = 0.3): NormalizedFrame =>
  ({ x, y, width, height, rotationDegrees: 0 });

describe("nudgeFrame", () => {
  // One point is a different fraction in every shape, and the fraction is kept
  // to the three decimals the wire carries, so a press lands within half a
  // thousandth of the canvas of a point: 0.09 pt on the widest box.
  it("moves one design point per press in every shape", () => {
    for (const family of ["rectangular", "circular", "corner"] as const) {
      const box = DESIGN_BOX[family];
      const start = frame(0.4, 0.4);
      const right = nudgeFrame(start, 1, 0, box);
      const down = nudgeFrame(start, 0, 1, box);
      expect((right.x - start.x) * box.width).toBeCloseTo(1, box.width < 100 ? 1 : 0);
      expect((down.y - start.y) * box.height).toBeCloseTo(1, box.height < 100 ? 1 : 0);
      expect(right.x - start.x).toBeCloseTo(Math.round(1000 / box.width) / 1000, 9);
      expect(down.y - start.y).toBeCloseTo(Math.round(1000 / box.height) / 1000, 9);
      expect(right.y).toBe(start.y);
      expect(down.x).toBe(start.x);
    }
  });

  it("Shift moves ten points, and back again lands where it started", () => {
    const box = DESIGN_BOX.rectangular;
    const start = frame(0.4, 0.4);
    const out = nudgeFrame(start, -NUDGE_COARSE, 0, box);
    expect((start.x - out.x) * box.width).toBeCloseTo(NUDGE_COARSE, 1);
    expect(nudgeFrame(out, NUDGE_COARSE, 0, box).x).toBeCloseTo(start.x, 6);
  });

  it("keeps the size and rotation it was given", () => {
    const start = { x: 0.2, y: 0.2, width: 0.5, height: 0.25, rotationDegrees: 30 };
    const out = nudgeFrame(start, 1, 1, DESIGN_BOX.circular);
    expect(out.width).toBe(0.5);
    expect(out.height).toBe(0.25);
    expect(out.rotationDegrees).toBe(30);
  });

  it("stops at the edge of the face, the way a drag does", () => {
    const box = DESIGN_BOX.circular;
    let f = frame(0.9, 0.9);
    for (let i = 0; i < 40; i++) f = nudgeFrame(f, 1, 1, box);
    expect(f.x).toBeLessThanOrEqual(1 - 0.04);
    expect(f.y).toBeLessThanOrEqual(1 - 0.04);
    // Once there, another press changes nothing at all.
    expect(nudgeFrame(f, 1, 1, box)).toEqual(f);
  });

  it("rounds to the three decimals the wire carries", () => {
    const out = nudgeFrame(frame(0, 0), 1, 1, DESIGN_BOX.rectangular);
    expect(out.x).toBe(Math.round(out.x * 1000) / 1000);
    expect(out.y).toBe(Math.round(out.y * 1000) / 1000);
  });

  it("leaves a zero-sized box alone rather than dividing by it", () => {
    const start = frame(0.3, 0.3);
    expect(nudgeFrame(start, 1, 1, { width: 0, height: 0 })).toEqual(start);
  });
});

describe("nudgePoint", () => {
  it("moves one point of the box it is given", () => {
    const out = nudgePoint({ x: 0.5, y: 0.5 }, 1, 0, { w: 50, h: 20 });
    expect(out.x).toBeCloseTo(0.52, 3);
    expect(out.y).toBe(0.5);
  });

  it("stays inside its picture", () => {
    expect(nudgePoint({ x: 0, y: 1 }, -10, 10, { w: 50, h: 20 })).toEqual({ x: 0, y: 1 });
  });

  it("leaves a zero-sized box alone", () => {
    expect(nudgePoint({ x: 0.4, y: 0.6 }, 1, 1, { w: 0, h: 0 })).toEqual({ x: 0.4, y: 0.6 });
  });
});
