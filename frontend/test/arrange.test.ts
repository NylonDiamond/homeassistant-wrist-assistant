// Line up and even out: the maths behind the strip above the canvas. Two or
// more layers work against the box around themselves, one works against the
// face, and evening out the gaps leaves the outermost two where they are.

import { describe, expect, it } from "vitest";
import { alignFrames, framesBounds, spreadFrames } from "../src/arrange.js";
import type { NormalizedFrame } from "../src/model.js";

const f = (x: number, y: number, width: number, height: number, rotationDegrees = 0): NormalizedFrame =>
  ({ x, y, width, height, rotationDegrees });

// Three layers whose box runs 0.1 to 0.9 across and 0.1 to 0.7 down.
const a = f(0.1, 0.1, 0.2, 0.1);
const b = f(0.5, 0.3, 0.4, 0.2);
const c = f(0.3, 0.6, 0.1, 0.1);
const picked = [a, b, c];

const xs = (frames: readonly NormalizedFrame[]) => frames.map((n) => n.x);
const ys = (frames: readonly NormalizedFrame[]) => frames.map((n) => n.y);

describe("framesBounds", () => {
  it("is the box around every frame", () => {
    expect(framesBounds(picked)).toEqual({ x: 0.1, y: 0.1, width: 0.8, height: 0.6, rotationDegrees: 0 });
  });

  it("is a point at the origin for nothing at all", () => {
    expect(framesBounds([])).toEqual({ x: 0, y: 0, width: 0, height: 0, rotationDegrees: 0 });
  });
});

describe("alignFrames, two or more", () => {
  it("lines up the left edges", () => {
    expect(xs(alignFrames(picked, "left"))).toEqual([0.1, 0.1, 0.1]);
  });

  it("lines up the right edges", () => {
    expect(xs(alignFrames(picked, "right"))).toEqual([0.7, 0.5, 0.8]);
  });

  it("lines up the middles across", () => {
    expect(xs(alignFrames(picked, "centerX"))).toEqual([0.4, 0.3, 0.45]);
  });

  it("lines up the top edges", () => {
    expect(ys(alignFrames(picked, "top"))).toEqual([0.1, 0.1, 0.1]);
  });

  it("lines up the bottom edges", () => {
    expect(ys(alignFrames(picked, "bottom"))).toEqual([0.6, 0.5, 0.6]);
  });

  it("lines up the middles down", () => {
    expect(ys(alignFrames(picked, "middleY"))).toEqual([0.35, 0.3, 0.35]);
  });

  it("moves nothing on the other axis, and never resizes or turns", () => {
    const out = alignFrames([f(0.1, 0.1, 0.2, 0.1, 45), b], "left");
    expect(out[0]).toEqual({ x: 0.1, y: 0.1, width: 0.2, height: 0.1, rotationDegrees: 45 });
    expect(out[1]).toEqual({ ...b, x: 0.1 });
  });

  it("leaves the outermost layer where it is", () => {
    // Its left edge is the box's own left edge, so lining up cannot move it.
    expect(alignFrames(picked, "left")[0]).toEqual(a);
  });
});

describe("alignFrames, one on its own", () => {
  const one = [f(0.1, 0.1, 0.2, 0.1)];

  it("works against the face rather than against itself", () => {
    expect(xs(alignFrames(one, "left"))).toEqual([0]);
    expect(xs(alignFrames(one, "centerX"))).toEqual([0.4]);
    expect(xs(alignFrames(one, "right"))).toEqual([0.8]);
    expect(ys(alignFrames(one, "top"))).toEqual([0]);
    expect(ys(alignFrames(one, "middleY"))).toEqual([0.45]);
    expect(ys(alignFrames(one, "bottom"))).toEqual([0.9]);
  });

  it("has nothing to do with no layers at all", () => {
    expect(alignFrames([], "left")).toEqual([]);
  });
});

describe("spreadFrames", () => {
  // Widths 0.1, 0.2 and 0.1 between 0 and 0.9: 0.5 of space for two gaps.
  const across = [f(0, 0.1, 0.1, 0.1), f(0.3, 0.3, 0.2, 0.1), f(0.8, 0.5, 0.1, 0.1)];

  it("keeps the two outermost and evens the gaps between", () => {
    const out = spreadFrames(across, "across");
    expect(xs(out)).toEqual([0, 0.35, 0.8]);
    const gaps = [out[1]!.x - (out[0]!.x + out[0]!.width), out[2]!.x - (out[1]!.x + out[1]!.width)];
    expect(gaps[0]).toBeCloseTo(gaps[1]!, 6);
  });

  it("reads the run off the face, not off the list order", () => {
    const shuffled = [across[2]!, across[0]!, across[1]!];
    const out = spreadFrames(shuffled, "across");
    // Each frame comes back in the slot it went in, holding its own new place.
    expect(xs(out)).toEqual([0.8, 0, 0.35]);
  });

  it("evens the gaps down as well", () => {
    const down = [f(0.1, 0, 0.1, 0.1), f(0.3, 0.3, 0.1, 0.2), f(0.5, 0.8, 0.1, 0.1)];
    expect(ys(spreadFrames(down, "down"))).toEqual([0, 0.35, 0.8]);
  });

  it("moves nothing on the other axis, and never resizes or turns", () => {
    const out = spreadFrames([across[0]!, f(0.3, 0.3, 0.2, 0.1, 30), across[2]!], "across");
    expect(out[1]).toEqual({ x: 0.35, y: 0.3, width: 0.2, height: 0.1, rotationDegrees: 30 });
    expect(ys(out)).toEqual([0.1, 0.3, 0.5]);
  });

  it("leaves two layers alone, since one gap is even already", () => {
    const two = [across[0]!, across[2]!];
    expect(spreadFrames(two, "across")).toEqual(two);
  });

  it("spreads layers that overlap just as evenly", () => {
    const tight = [f(0.2, 0.1, 0.3, 0.1), f(0.25, 0.3, 0.3, 0.1), f(0.3, 0.5, 0.3, 0.1)];
    const out = spreadFrames(tight, "across");
    expect(xs(out)).toEqual([0.2, 0.25, 0.3]);
  });
});
