// A gauge draws in only part of its frame: a ring or arc in the middle square,
// a bar in a strip across it, dots in a row. These pin down that the selection
// box sits on that part, and that a corner drag resizes it.

import { describe, expect, it } from "vitest";

import { lineResize } from "../src/interact.js";
import type { ResolvedElement } from "../src/resolver.js";
import { LINE_OUTLINE_MIN, handleResize, layerOutline } from "../src/renderer.js";

const box = { x: 0, y: 0, w: 100, h: 40, cx: 50, cy: 20 };
const canvas = { width: 200, height: 100 };

function gauge(style: string, extra: Record<string, unknown> = {}): ResolvedElement {
  return {
    kind: "gauge",
    style,
    lineWidth: 6,
    dotCount: 5,
    frame: { x: 0, y: 0, width: 0.5, height: 0.4, rotationDegrees: 0 },
    ...extra,
  } as unknown as ResolvedElement;
}

describe("a gauge's selection box", () => {
  it("is the middle square for a ring and an arc", () => {
    for (const style of ["ring", "arc"]) {
      expect(layerOutline(gauge(style), box)).toEqual({ x: 30, y: 0, w: 40, h: 40, cx: 50, cy: 20 });
    }
  });

  it("is a line width tall strip across the frame for a bar", () => {
    expect(layerOutline(gauge("bar"), box)).toEqual({ x: 0, y: 17, w: 100, h: 6, cx: 50, cy: 20 });
  });

  it("keeps a thin bar thick enough to grab", () => {
    expect(layerOutline(gauge("bar", { lineWidth: 1 }), box).h).toBe(LINE_OUTLINE_MIN);
  });

  it("wraps the row of dots", () => {
    // 5 dots in 100 pt: 18 pt each, 2 pt gaps, 98 pt across.
    expect(layerOutline(gauge("dots"), box)).toEqual({ x: 1, y: 11, w: 98, h: 18, cx: 50, cy: 20 });
  });
});

describe("a corner drag on a gauge", () => {
  it("resizes a ring or arc as a square", () => {
    expect(handleResize(gauge("ring"), gauge("ring").frame, canvas)).toEqual({ square: true });
  });

  it("starts a dots drag from the box around the dots", () => {
    const { outline } = handleResize(gauge("dots"), gauge("dots").frame, canvas);
    expect(outline!.x * canvas.width).toBeCloseTo(1);
    expect(outline!.width * canvas.width).toBeCloseTo(98);
    expect(outline!.height * canvas.height).toBeCloseTo(18);
  });

  it("changes only a bar's width, even in a tall frame", () => {
    const tall = { x: 0.1, y: 0.1, width: 0.1, height: 0.8, rotationDegrees: 0 };
    const f = lineResize(tall, canvas, "se", { x: 20, y: 30 }, true);
    expect(f.width * canvas.width).toBeCloseTo(40);
    expect(f.height).toBe(0.8);
  });
});
