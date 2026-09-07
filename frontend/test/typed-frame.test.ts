// Numbers typed into the Place card. They reach the same clamp a drag does, so
// a frame that could not be reached with the mouse cannot be reached by typing
// either: nothing shrinks below the corner-drag floor, and nothing leaves the
// face entirely.

import { describe, expect, it } from "vitest";
import { typedFrame } from "../src/interact.js";
import type { NormalizedFrame } from "../src/model.js";

const frame = (over: Partial<NormalizedFrame> = {}): NormalizedFrame =>
  ({ x: 0.25, y: 0.25, width: 0.5, height: 0.5, rotationDegrees: 0, ...over });

describe("typedFrame", () => {
  it("keeps the numbers it is given", () => {
    const next = typedFrame(frame(), { x: 0.1, width: 0.2 });
    expect(next).toEqual({ x: 0.1, y: 0.25, width: 0.2, height: 0.5, rotationDegrees: 0 });
  });

  it("leaves the rest of the frame alone", () => {
    expect(typedFrame(frame(), { rotationDegrees: 45 })).toEqual(frame({ rotationDegrees: 45 }));
  });

  it("holds a size to the floor a corner drag stops at", () => {
    const next = typedFrame(frame(), { width: 0, height: -1 });
    expect(next.width).toBe(0.04);
    expect(next.height).toBe(0.04);
  });

  it("keeps a sliver on the face when a position is typed past the edge", () => {
    const right = typedFrame(frame(), { x: 5 });
    expect(right.x).toBe(0.96);
    const left = typedFrame(frame(), { x: -5 });
    expect(left.x).toBe(-0.46);
  });

  it("rounds to the three decimals the wire carries", () => {
    expect(typedFrame(frame(), { x: 0.123456 }).x).toBe(0.123);
    expect(typedFrame(frame(), { width: 0.987654 }).width).toBe(0.988);
  });
});
