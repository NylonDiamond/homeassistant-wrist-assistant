// Smart guides: the lines other layers offer, which one a drag lands on, and
// what happens where a guide and the grid both want the frame. Everything is
// in fractions of the face, so the numbers here read the way a frame does.

import { describe, expect, it } from "vitest";
import { guideCandidates, guideThreshold, nearestGuide, snapMoveFrame, snapResizeFrame, type GuideLine } from "../src/interact.js";
import { DESIGN_BOX, newConfig, newElement, type NormalizedFrame } from "../src/model.js";
import { renderLayout, type IconProvider, type RenderOptions } from "../src/renderer.js";
import { resolveAll } from "../src/resolver.js";

const frame = (over: Partial<NormalizedFrame> = {}): NormalizedFrame =>
  ({ x: 0.2, y: 0.2, width: 0.3, height: 0.2, rotationDegrees: 0, ...over });

/** A neighbour whose left, middle and right sit at 0.58, 0.73 and 0.88, none
 * of them on a 5% grid line, so a test can tell the two apart. Its own top,
 * middle and bottom are somewhere else again, so an axis mix-up shows up. */
const neighbour = frame({ x: 0.58, y: 0.62, width: 0.3, height: 0.3 });
const lines = guideCandidates([neighbour]);
const near = { x: 0.02, y: 0.02 };

describe("guideCandidates", () => {
  it("offers the face's middle lines with nothing else on the shape", () => {
    expect(guideCandidates([])).toEqual([{ axis: "x", at: 0.5 }, { axis: "y", at: 0.5 }]);
  });

  it("offers each other layer's edges and middle on both axes", () => {
    const at = (axis: "x" | "y") => lines.filter((l) => l.axis === axis).map((l) => l.at).sort((a, b) => a - b);
    expect(at("x")).toEqual([0.5, 0.58, 0.73, 0.88]);
    expect(at("y")).toEqual([0.5, 0.62, 0.77, 0.92]);
  });

  it("offers a line once however many layers sit on it", () => {
    const twice = guideCandidates([neighbour, { ...neighbour }]);
    expect(twice).toEqual(lines);
  });
});

describe("guideThreshold", () => {
  it("is the same distance in points on both axes of a wide face", () => {
    const t = guideThreshold(DESIGN_BOX.rectangular);
    expect(t.x * DESIGN_BOX.rectangular.width).toBeCloseTo(3, 6);
    expect(t.y * DESIGN_BOX.rectangular.height).toBeCloseTo(3, 6);
    // Which is a much larger fraction down the short side than across.
    expect(t.y).toBeGreaterThan(t.x);
  });
});

describe("nearestGuide", () => {
  it("takes the nearest line within reach", () => {
    const hit = nearestGuide([0.59], lines, "x", 0.02);
    expect(hit).toEqual({ at: 0.58, delta: expect.closeTo(-0.01, 6) });
  });

  it("ignores a line further off than the threshold", () => {
    expect(nearestGuide([0.55], lines, "x", 0.02)).toBeUndefined();
  });

  it("reads only its own axis", () => {
    expect(nearestGuide([0.59], lines, "y", 0.02)).toBeUndefined();
  });

  it("gives a tie to the earlier position, so an edge beats a middle", () => {
    const two: GuideLine[] = [{ axis: "x", at: 0.42 }, { axis: "x", at: 0.48 }];
    expect(nearestGuide([0.4, 0.45], two, "x", 0.05)?.at).toBe(0.42);
  });

  it("never snaps without a threshold", () => {
    expect(nearestGuide([0.58], lines, "x", 0)).toBeUndefined();
  });
});

describe("snapMoveFrame", () => {
  it("lands an edge on a guide and says which line it used", () => {
    const out = snapMoveFrame(frame({ x: 0.59 }), undefined, { lines, threshold: near });
    expect(out.frame.x).toBe(0.58);
    expect(out.guides).toEqual([{ axis: "x", at: 0.58 }]);
  });

  it("beats the grid where both are in reach", () => {
    // 0.59 is 0.01 from the guide at 0.58 and 0.01 from the 5% line at 0.6.
    const out = snapMoveFrame(frame({ x: 0.59 }), 0.05, { lines, threshold: near });
    expect(out.frame.x).toBe(0.58);
  });

  it("leaves the grid to an axis no guide reaches", () => {
    // Across, the guide at 0.58 catches it; down, no guide is near, so the 5%
    // grid takes the top edge from 0.21 to 0.2.
    const out = snapMoveFrame(frame({ x: 0.59, y: 0.21 }), 0.05, { lines, threshold: near });
    expect(out.frame.x).toBe(0.58);
    expect(out.frame.y).toBe(0.2);
    expect(out.guides).toEqual([{ axis: "x", at: 0.58 }]);
  });

  it("falls back to the grid entirely when nothing is near", () => {
    const out = snapMoveFrame(frame({ x: 0.31, y: 0.21 }), 0.05, { lines, threshold: near });
    expect(out.frame.x).toBe(0.3);
    expect(out.frame.y).toBe(0.2);
    expect(out.guides).toEqual([]);
  });

  it("moves nothing with neither a grid nor a guide in reach", () => {
    const start = frame({ x: 0.31, y: 0.21 });
    const out = snapMoveFrame(start, undefined, { lines, threshold: near });
    expect(out.frame).toEqual(start);
    expect(out.guides).toEqual([]);
  });

  it("keeps the size and the turn", () => {
    const out = snapMoveFrame(frame({ x: 0.59, rotationDegrees: 35 }), 0.05, { lines, threshold: near });
    expect(out.frame.width).toBe(0.3);
    expect(out.frame.height).toBe(0.2);
    expect(out.frame.rotationDegrees).toBe(35);
  });

  it("lands a middle on the face's own middle line", () => {
    // Middle 0.495, a hair off the 0.5 the face always offers.
    const out = snapMoveFrame(frame({ x: 0.345 }), undefined, { lines, threshold: near });
    expect(out.frame.x + out.frame.width / 2).toBeCloseTo(0.5, 6);
    expect(out.guides).toEqual([{ axis: "x", at: 0.5 }]);
  });
});

describe("snapResizeFrame", () => {
  it("lands the pulled edge on a guide and pins the far one", () => {
    const out = snapResizeFrame(frame({ x: 0.3, width: 0.29 }), "se", undefined, { lines, threshold: near });
    expect(out.frame.x).toBe(0.3);
    expect(out.frame.width).toBe(0.28);
    expect(out.guides).toEqual([{ axis: "x", at: 0.58 }]);
  });

  it("lands a pulled left edge and keeps the right one", () => {
    const out = snapResizeFrame(frame({ x: 0.59, width: 0.3 }), "nw", undefined, { lines, threshold: near });
    expect(out.frame.x).toBe(0.58);
    expect(out.frame.x + out.frame.width).toBeCloseTo(0.89, 6);
  });

  it("leaves the grid the axis no guide reached", () => {
    // Right edge 0.59 takes the guide at 0.58; the bottom, at 0.39, has no
    // guide and takes the 5% line at 0.4.
    const out = snapResizeFrame(frame({ x: 0.3, width: 0.29, y: 0.2, height: 0.19 }), "se", 0.05, { lines, threshold: near });
    expect(out.frame.width).toBe(0.28);
    expect(out.frame.height).toBe(0.2);
  });

  it("only touches the axes it is told to", () => {
    const out = snapResizeFrame(frame({ x: 0.3, width: 0.29, y: 0.59, height: 0.2 }), "se", undefined,
      { lines, threshold: near }, { x: true, y: false });
    expect(out.frame.width).toBe(0.28);
    expect(out.frame.height).toBe(0.2);
    expect(out.guides).toEqual([{ axis: "x", at: 0.58 }]);
  });

  it("refuses a guide that would take the layer under the smallest size", () => {
    // The right edge is 0.25 and the guide at 0.24 would leave 0.03 of width,
    // under the 0.04 a drag allows, so the frame is left as it was.
    const tight = frame({ x: 0.22, width: 0.03 });
    const out = snapResizeFrame(tight, "se", undefined, { lines: [{ axis: "x", at: 0.24 }], threshold: near });
    expect(out.frame).toEqual(tight);
    expect(out.guides).toEqual([]);
  });

  it("keeps the turn", () => {
    const out = snapResizeFrame(frame({ x: 0.3, width: 0.29, rotationDegrees: -20 }), "se", 0.05, { lines, threshold: near });
    expect(out.frame.rotationDegrees).toBe(-20);
  });
});

/** A lit template as plain text, the way the renderer tests read one. */
function flatten(node: unknown): string {
  if (node === null || node === undefined) return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  return String(node);
}

const noIcons: IconProvider = { render: () => undefined, available: () => false, names: () => undefined };

/** The rectangular face as text, with the given render options. */
function draw(opts: Partial<RenderOptions> = {}): string {
  const cfg = newConfig("Test", 0);
  cfg.elements.push(newElement("shape"));
  const layouts = resolveAll(cfg, { entityStates: new Map(), templateResults: new Map(), namedValues: cfg.values });
  return flatten(renderLayout(layouts.rectangular!, { icons: noIcons, ...opts }));
}

describe("the guides on the canvas", () => {
  it("draws nothing while nothing is being dragged", () => {
    expect(draw()).not.toContain("smart-guides");
    expect(draw({ guides: [] })).not.toContain("smart-guides");
  });

  it("draws a line across the face for each guide the drag landed on", () => {
    const out = draw({ guides: [{ axis: "x", at: 0.25 }, { axis: "y", at: 0.5 }] });
    expect(out).toContain("smart-guides");
    // A quarter across the 181 pt design box, and halfway down its 65.5 pt.
    expect(out).toContain(`x1=${0.25 * DESIGN_BOX.rectangular.width} `);
    expect(out).toContain(`y1=${0.5 * DESIGN_BOX.rectangular.height} `);
  });
});
