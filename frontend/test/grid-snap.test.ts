// Snap to grid. The grid is in fractions of the face, the same unit the frame
// is stored in, so a snapped layer lands on the same numbers on every shape.
// A move puts the nearest edge or middle on a line; a corner drag puts the
// edge it pulls on a line; an arrow goes to the next line.

import { describe, expect, it } from "vitest";
import { gridNudgeFrame, snapFrameEdges, snapFrameMove } from "../src/interact.js";
import type { NormalizedFrame } from "../src/model.js";

const frame = (over: Partial<NormalizedFrame> = {}): NormalizedFrame =>
  ({ x: 0.12, y: 0.31, width: 0.3, height: 0.2, rotationDegrees: 0, ...over });

describe("snapFrameMove", () => {
  it("lands the nearest edge on a line and keeps the size", () => {
    // Left 0.11, middle 0.26 and right 0.41 are each 0.01 past a line; a tie
    // goes to the left edge. The same holds for top, middle and bottom.
    const next = snapFrameMove(frame({ x: 0.11 }), 0.05);
    expect(next.x).toBe(0.1);
    expect(next.y).toBe(0.3);
    expect(next.width).toBe(0.3);
    expect(next.height).toBe(0.2);
  });

  it("lands the middle on a line when that is nearest", () => {
    // Middle 0.5 + 0.004: nearer the 0.5 line than either edge is to one.
    const next = snapFrameMove(frame({ x: 0.354, width: 0.3 }), 0.1);
    expect(next.x + next.width / 2).toBeCloseTo(0.5, 3);
  });

  it("leaves a frame already on the grid alone", () => {
    const on = frame({ x: 0.25, y: 0.3 });
    expect(snapFrameMove(on, 0.05)).toEqual(on);
  });

  it("does nothing without a step", () => {
    expect(snapFrameMove(frame(), 0)).toEqual(frame());
  });
});

describe("snapFrameEdges", () => {
  it("snaps the pulled right and bottom edges and pins the others", () => {
    const next = snapFrameEdges(frame({ x: 0.1, y: 0.3, width: 0.33, height: 0.18 }), "se", 0.05);
    expect(next.x).toBe(0.1);
    expect(next.y).toBe(0.3);
    expect(next.width).toBe(0.35);
    expect(next.height).toBe(0.2);
  });

  it("snaps the pulled left and top edges and keeps the far edges", () => {
    const next = snapFrameEdges(frame({ x: 0.12, y: 0.29, width: 0.38, height: 0.21 }), "nw", 0.05);
    expect(next.x).toBe(0.1);
    expect(next.y).toBe(0.3);
    expect(next.x + next.width).toBeCloseTo(0.5, 3);
    expect(next.y + next.height).toBeCloseTo(0.5, 3);
  });

  it("only touches the axes it is told to", () => {
    const line = frame({ x: 0.1, y: 0.47, width: 0.33, height: 0.06 });
    const next = snapFrameEdges(line, "se", 0.05, { x: true, y: false });
    expect(next.width).toBe(0.35);
    expect(next.height).toBe(0.06);
  });
});

describe("gridNudgeFrame", () => {
  it("moves a layer on a line one step", () => {
    const next = gridNudgeFrame(frame({ x: 0.25, y: 0.3 }), 1, -1, 0.05);
    expect(next.x).toBe(0.3);
    expect(next.y).toBe(0.25);
  });

  it("moves a layer between lines to the next line first", () => {
    const right = gridNudgeFrame(frame({ x: 0.12 }), 1, 0, 0.05);
    expect(right.x).toBe(0.15);
    const left = gridNudgeFrame(frame({ x: 0.12 }), -1, 0, 0.05);
    expect(left.x).toBe(0.1);
  });

  it("leaves the other axis alone", () => {
    expect(gridNudgeFrame(frame(), 1, 0, 0.1).y).toBe(0.31);
  });
});
