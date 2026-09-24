// Resizing a selected group by its box: the box around the members, where
// each member lands when the box changes, a corner that keeps the box's
// proportions, and a side handle that snaps on its own axis only. Frames are
// fractions of the face, so the numbers read the way a frame does.

import { describe, expect, it } from "vitest";
import { beginGesture, boxAround, frameInResizedBox, snapResizeFrame, type GestureTarget } from "../src/interact.js";
import type { NormalizedFrame } from "../src/model.js";

const frame = (over: Partial<NormalizedFrame> = {}): NormalizedFrame =>
  ({ x: 0.2, y: 0.2, width: 0.3, height: 0.2, rotationDegrees: 0, ...over });

/** Just enough of an SVG for a gesture: one pixel per canvas unit, and the
 * listeners kept so a test can play pointer events into them. */
function fakeSvg() {
  const on = new Map<string, (ev: PointerEvent) => void>();
  const svg = {
    getScreenCTM: () => ({ a: 1, d: 1 }),
    setPointerCapture: () => {},
    releasePointerCapture: () => {},
    addEventListener: (type: string, fn: (ev: PointerEvent) => void) => on.set(type, fn),
    removeEventListener: (type: string) => on.delete(type),
  } as unknown as SVGSVGElement;
  const at = (x: number, y: number) => ({ pointerId: 1, clientX: x, clientY: y, altKey: false }) as PointerEvent;
  return { svg, start: at(0, 0), move: (x: number, y: number) => on.get("pointermove")?.(at(x, y)), up: (x: number, y: number) => on.get("pointerup")?.(at(x, y)) };
}

/** Drag a handle by (dx, dy) canvas units on a 100 by 100 canvas and return
 * the frame the gesture settles on. */
function drag(target: GestureTarget, dx: number, dy: number): NormalizedFrame {
  const f = fakeSvg();
  let last = target.frame;
  beginGesture(f.svg, { width: 100, height: 100 }, f.start, target, { onFrame: (_id, next) => { last = next; } });
  f.move(dx, dy);
  f.up(dx, dy);
  return last;
}

describe("boxAround", () => {
  it("is the smallest box holding every frame", () => {
    const box = boxAround([frame({ x: 0.1, y: 0.3, width: 0.2, height: 0.1 }), frame({ x: 0.4, y: 0.2, width: 0.3, height: 0.05 })]);
    expect(box.x).toBeCloseTo(0.1, 6);
    expect(box.y).toBeCloseTo(0.2, 6);
    expect(box.width).toBeCloseTo(0.6, 6);
    expect(box.height).toBeCloseTo(0.2, 6);
  });
});

describe("frameInResizedBox", () => {
  const from = frame({ x: 0.2, y: 0.2, width: 0.4, height: 0.2 });

  it("keeps a member at the same place inside a box twice the size", () => {
    const to = { ...from, width: 0.8, height: 0.4 };
    const inner = frame({ x: 0.4, y: 0.3, width: 0.1, height: 0.05 });
    expect(frameInResizedBox(inner, from, to)).toEqual({ ...inner, x: 0.6, y: 0.4, width: 0.2, height: 0.1 });
  });

  it("stretches only the axis a side handle pulled", () => {
    const to = { ...from, width: 0.6 };
    const inner = frame({ x: 0.2, y: 0.25, width: 0.4, height: 0.1 });
    const out = frameInResizedBox(inner, from, to);
    expect(out.x).toBe(0.2);
    expect(out.width).toBe(0.6);
    expect(out.y).toBe(0.25);
    expect(out.height).toBe(0.1);
  });

  it("follows the box when a top-left corner moves it", () => {
    const to = { ...from, x: 0.1, y: 0.15, width: 0.5, height: 0.25 };
    const out = frameInResizedBox(from, from, to);
    expect(out).toEqual({ ...to });
  });
});

describe("a group corner drag", () => {
  const box = frame({ x: 0.2, y: 0.2, width: 0.4, height: 0.2 });

  it("keeps the box's proportions, led by the side pulled further", () => {
    // 20 across on a 40-wide box is x1.5; 2 down on a 20-high one is x1.1.
    const out = drag({ elementId: "g", frame: box, handle: "se", keepAspect: true }, 20, 2);
    expect(out.x).toBe(0.2);
    expect(out.y).toBe(0.2);
    expect(out.width).toBeCloseTo(0.6, 6);
    expect(out.height).toBeCloseTo(0.3, 6);
  });

  it("pins the opposite corner when the top-left is pulled", () => {
    const out = drag({ elementId: "g", frame: box, handle: "nw", keepAspect: true }, -20, 0);
    expect(out.x + out.width).toBeCloseTo(0.6, 6);
    expect(out.y + out.height).toBeCloseTo(0.4, 6);
    expect(out.width / out.height).toBeCloseTo(2, 6);
  });

  it("stretches freely without keepAspect", () => {
    const out = drag({ elementId: "g", frame: box, handle: "se" }, 20, 2);
    expect(out.width).toBeCloseTo(0.6, 6);
    expect(out.height).toBeCloseTo(0.22, 6);
  });
});

describe("a group side drag", () => {
  const box = frame({ x: 0.2, y: 0.2, width: 0.4, height: 0.2 });

  it("moves only its own edge", () => {
    const e = drag({ elementId: "g", frame: box, handle: "e", keepAspect: true }, 10, 30);
    expect(e).toMatchObject({ x: 0.2, y: 0.2, height: 0.2 });
    expect(e.width).toBeCloseTo(0.5, 6);
    const n = drag({ elementId: "g", frame: box, handle: "n", keepAspect: true }, 30, -10);
    expect(n.x).toBe(0.2);
    expect(n.width).toBe(0.4);
    expect(n.y).toBeCloseTo(0.1, 6);
    expect(n.y + n.height).toBeCloseTo(0.4, 6);
  });

  it("snaps only on its own axis", () => {
    // Left edge 0.21 is near the 0.2 line, but a top handle must not take it.
    const lines = [{ axis: "x" as const, at: 0.2 }, { axis: "y" as const, at: 0.1 }];
    const out = snapResizeFrame(frame({ x: 0.21, y: 0.11, height: 0.3 }), "n", undefined, { lines, threshold: { x: 0.02, y: 0.02 } });
    expect(out.frame.x).toBe(0.21);
    expect(out.frame.y).toBe(0.1);
    expect(out.guides).toEqual([{ axis: "y", at: 0.1 }]);
  });
});
