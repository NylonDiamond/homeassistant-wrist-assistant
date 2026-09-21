// The live picture on a shape tab. These cover the parts that are arithmetic
// rather than drawing: how big each shape is drawn in the tab's box, what the
// warning glyph is for, which layer stands for the selected one on another
// shape, and how a preview is tinted.

import { describe, expect, it } from "vitest";

import { addFamily } from "../src/layouts.js";
import {
  type CustomComplicationConfig,
  type FamilyKind,
  newConfig,
  newElement,
  normalizeOwnership,
  ownedElements,
  seedFamilyFromSibling,
} from "../src/model.js";
import type { ResolvedElement, ResolvedLayout } from "../src/resolver.js";
import {
  PREVIEW_ROOM,
  previewBox,
  previewTintFor,
  previewWarnings,
} from "../src/shapePreviews.js";

describe("how big a preview is drawn", () => {
  const room = { width: 200, height: 160 };

  it("fits a wide shape to the width", () => {
    const box = previewBox("rectangular", room);
    expect(box.width).toBeCloseTo(200, 5);
    expect(box.height).toBeLessThan(room.height);
    expect(box.scale).toBeCloseTo(200 / 181, 5);
  });

  it("fits a tall shape to the height", () => {
    const box = previewBox("xlarge", room);
    expect(box.height).toBeCloseTo(160, 5);
    expect(box.width).toBeLessThan(room.width);
  });

  it("gives a square shape the shorter side", () => {
    const box = previewBox("small", room);
    expect(box.width).toBeCloseTo(160, 5);
    expect(box.height).toBeCloseTo(160, 5);
  });

  it("never draws a shape outside the room it was given", () => {
    for (const f of ["rectangular", "circular", "corner", "small", "medium", "large", "xlarge"] as const) {
      const box = previewBox(f, room);
      expect(box.width).toBeLessThanOrEqual(room.width + 0.001);
      expect(box.height).toBeLessThanOrEqual(room.height + 0.001);
    }
  });

  it("keeps a tab's own room short enough for one row of tabs", () => {
    // The tabs sit in the bar over the canvas, so the box every shape is
    // fitted into has to stay a bar's worth of height.
    expect(PREVIEW_ROOM.height).toBeLessThanOrEqual(96);
    for (const f of ["rectangular", "circular", "small", "xlarge"] as const) {
      expect(previewBox(f).height).toBeLessThanOrEqual(PREVIEW_ROOM.height + 0.001);
      expect(previewBox(f).width).toBeLessThanOrEqual(PREVIEW_ROOM.width + 0.001);
    }
  });
});

describe("the warning badge", () => {
  const layer = (fields: Record<string, unknown>) => ({
    isHidden: false, opacity: 1, ...fields,
  }) as unknown as ResolvedElement;
  const layout = (family: FamilyKind, elements: ResolvedElement[]) => ({
    family, elements, cornerBodyShape: "circle", borderWidth: 0,
  }) as unknown as ResolvedLayout;
  const frame = (x: number, y: number, width: number, height: number) => ({ x, y, width, height, rotationDegrees: 0 });
  const text = (fields: Record<string, unknown>) => layer({
    kind: "text", fontSize: 14, minimumScale: 1, lineLimit: 1, text: "Hello", ...fields,
  });

  it("says nothing about a shape that is laid out inside its canvas", () => {
    expect(previewWarnings(layout("rectangular", [
      text({ frame: frame(0.1, 0.1, 0.8, 0.5) }),
    ]))).toEqual([]);
  });

  it("counts the layers that hang off the edge", () => {
    expect(previewWarnings(layout("rectangular", [
      text({ frame: frame(0.6, 0.1, 0.8, 0.3) }),
      text({ frame: frame(-0.2, 0.1, 0.3, 0.3) }),
      text({ frame: frame(0.1, 0.5, 0.2, 0.2) }),
    ]))[0]).toBe("2 layers hang off the edge.");
  });

  it("says nothing about a layer sitting exactly on the edge", () => {
    expect(previewWarnings(layout("rectangular", [text({ frame: frame(0, 0, 1, 1) })]))).toEqual([]);
  });

  it("counts the layers a round shape cuts off at the rim", () => {
    expect(previewWarnings(layout("circular", [
      // Inside the box, but its corners fall outside the circle.
      layer({ kind: "shape", frame: frame(0.02, 0.02, 0.96, 0.96) }),
    ]))[0]).toBe("1 layer runs under the rim.");
  });

  it("leaves a round shape alone when the layout is inside the rim", () => {
    expect(previewWarnings(layout("circular", [
      layer({ kind: "shape", frame: frame(0.3, 0.3, 0.4, 0.4) }),
    ]))).toEqual([]);
  });

  it("marks a word that cannot fit its layer even shrunk", () => {
    const lines = previewWarnings(layout("circular", [
      text({ frame: frame(0.1, 0.4, 0.3, 0.2), text: "Unbreakable", fontSize: 14, minimumScale: 1 }),
    ]));
    expect(lines.some((l) => l.startsWith("Text is cut short"))).toBe(true);
  });

  it("leaves text that can shrink or wrap alone", () => {
    expect(previewWarnings(layout("rectangular", [
      text({ frame: frame(0.05, 0.3, 0.9, 0.4), text: "Kitchen light", fontSize: 12 }),
    ]))).toEqual([]);
  });

  it("ignores what the shape does not draw", () => {
    expect(previewWarnings(layout("rectangular", [
      text({ frame: frame(1.5, 1.5, 0.8, 0.3), isHidden: true }),
      layer({ kind: "tap", frame: frame(1.5, 1.5, 0.8, 0.3) }),
    ]))).toEqual([]);
  });
});

describe("how a preview is tinted", () => {
  it("draws a phone's Lock Screen shapes in white", () => {
    expect(previewTintFor("rectangular", true, undefined)).toEqual({ tint: "#FFFFFF", tintSurface: "watch" });
    expect(previewTintFor("circular", true, undefined)).toEqual({ tint: "#FFFFFF", tintSurface: "watch" });
  });

  it("draws a phone's Home Screen tiles in full color", () => {
    expect(previewTintFor("small", true, undefined)).toEqual({});
  });

  it("leaves a watch's own shapes in full color", () => {
    expect(previewTintFor("rectangular", false, undefined)).toEqual({});
  });

  it("follows the tint tool when it is on", () => {
    expect(previewTintFor("rectangular", true, "#FF9F0A")).toEqual({ tint: "#FF9F0A", tintSurface: "watch" });
    expect(previewTintFor("medium", false, "#FF9F0A")).toEqual({ tint: "#FF9F0A", tintSurface: "phone" });
  });
});
