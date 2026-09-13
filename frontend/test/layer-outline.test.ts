// Icons, chart times and picture times draw in only part of their frame. These
// pin down that the selection box sits on what is drawn, and that a layer which
// fills its frame keeps the frame.

import { describe, expect, it } from "vitest";

import type { ResolvedElement } from "../src/resolver.js";
import { LINE_OUTLINE_MIN, handleResize, iconDrawnSide, layerOutline } from "../src/renderer.js";

const box = { x: 0, y: 0, w: 100, h: 40, cx: 50, cy: 20 };
const frame = { x: 0, y: 0, width: 0.5, height: 0.4, rotationDegrees: 0 };
const canvas = { width: 200, height: 100 };

const layer = (fields: Record<string, unknown>) => ({ frame, ...fields }) as unknown as ResolvedElement;

describe("an icon's selection box", () => {
  it("is the icon's own size, centred", () => {
    expect(layerOutline(layer({ kind: "icon", size: 16, symbol: "star" }), box)).toEqual({ x: 42, y: 12, w: 16, h: 16, cx: 50, cy: 20 });
  });

  it("allows for the padding an outline icon draws with", () => {
    const icon = layer({ kind: "icon", size: 20, symbol: "", path: "M0 0" }) as Extract<ResolvedElement, { kind: "icon" }>;
    expect(iconDrawnSide(icon)).toBeCloseTo(23);
    expect(layerOutline(icon, box).w).toBeCloseTo(23);
  });

  it("stays big enough to grab", () => {
    expect(layerOutline(layer({ kind: "icon", size: 1, symbol: "star" }), box).w).toBe(LINE_OUTLINE_MIN);
  });
});

describe("chart times", () => {
  const times = layer({ kind: "chartTimes", labels: ["9:00", "12:00"], labelSize: 8, labelColorHex: "#FFFFFF" });

  it("select as the row across the frame", () => {
    const o = layerOutline(times, box);
    expect(o.x).toBe(0);
    expect(o.w).toBe(100);
    expect(o.h).toBeLessThan(40);
    expect(o.y + o.h / 2).toBeCloseTo(20);
  });

  it("resize only in width", () => {
    expect(handleResize(times, frame, canvas)).toEqual({ bar: true });
  });
});

describe("a picture time", () => {
  it("selects as its chip, centred", () => {
    const o = layerOutline(layer({ kind: "imageTime", linked: true, url: "x" }), box);
    expect(o.h).toBeLessThanOrEqual(40);
    expect(o.w).toBeLessThanOrEqual(100);
    expect(o.x + o.w / 2).toBeCloseTo(50);
    expect(o.y + o.h / 2).toBeCloseTo(20);
  });

  it("starts a corner drag from the chip", () => {
    const { outline } = handleResize(layer({ kind: "imageTime", linked: true, url: "x" }), frame, canvas);
    expect(outline).toBeDefined();
    expect(outline!.width).toBeLessThanOrEqual(frame.width);
  });
});

describe("a layer that fills its frame", () => {
  it("keeps the frame as its box", () => {
    expect(layerOutline(layer({ kind: "shape", shapeKind: "rectangle" }), box)).toEqual(box);
    expect(layerOutline(layer({ kind: "text", text: "Hi" }), box)).toEqual(box);
  });
});
