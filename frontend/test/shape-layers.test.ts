// Every layer belongs to exactly one shape. Two shapes never point at the same
// layer, so a shape added to a finished complication starts with nothing on it
// and an empty layer list, and a layer edited on one shape cannot reach
// another. These pin down the three parts of that: what a new shape starts
// with, what "copy the other shape's layout" makes, and what a paste taken on
// one shape and dropped on another makes.

import { describe, expect, it } from "vitest";

import { copyShapeLayout, effectivePlacement, shownCount } from "../src/editors.js";
import { addFamily, removeFamily } from "../src/layouts.js";
import {
  type CustomComplicationConfig,
  type Element as CElement,
  copyElements,
  elementSize,
  newConfig,
  newElement,
  normalizeOwnership,
  ownedElements,
  pasteElements,
  pasteElementsOnto,
  refitPlacement,
} from "../src/model.js";

/** The middle of a frame, which is what the refit keeps put. */
function centre(f: { x: number; y: number; width: number; height: number }) {
  return [f.x + f.width / 2, f.y + f.height / 2];
}

/** Two layers on the rectangular shape, then a circular shape added after. */
function twoShapes() {
  const cfg = newConfig("X", 0, ["rectangular"]);
  const a = newElement("text");
  const b = newElement("icon");
  a.payload.frame = { x: 0.1, y: 0.2, width: 0.3, height: 0.4, rotationDegrees: 0 };
  const aFrame = { ...a.payload.frame };
  cfg.elements = [a, b];
  normalizeOwnership(cfg, "rectangular");
  addFamily(cfg, "circular");
  return { cfg, a, b, aFrame };
}

/** The one layer on a shape, for the shapes these tests copy onto. */
function only(cfg: CustomComplicationConfig, family: "rectangular" | "circular" | "corner"): CElement {
  const els = ownedElements(cfg, family);
  expect(els).toHaveLength(1);
  return els[0]!;
}

describe("a shape added to a complication that is already drawn", () => {
  it("starts with nothing on it", () => {
    const { cfg } = twoShapes();
    expect(shownCount(cfg, "rectangular")).toBe(2);
    expect(shownCount(cfg, "circular")).toBe(0);
  });

  it("lists none of the other shape's layers", () => {
    const { cfg } = twoShapes();
    expect(ownedElements(cfg, "circular")).toEqual([]);
    expect(ownedElements(cfg, "rectangular")).toHaveLength(2);
  });

  it("has no placement for them either, so nothing here can reach them", () => {
    const { cfg, a } = twoShapes();
    expect(cfg.perFamily.circular!.placements[a.payload.id]).toBeUndefined();
  });
});

describe("copyShapeLayout", () => {
  it("puts a copy of every layer on the blank shape, refitted for its canvas", () => {
    const { cfg, aFrame } = twoShapes();
    copyShapeLayout(cfg, "rectangular", "circular");
    expect(shownCount(cfg, "circular")).toBe(2);
    const copy = ownedElements(cfg, "circular").find((el) => el.kind === "text")!;
    const f = effectivePlacement(cfg, "circular", copy).frame;
    // Pulled onto the square that fits inside the circle, about its own middle.
    expect(f.width).toBeCloseTo(aFrame.width * Math.SQRT1_2, 5);
    expect(centre(f)[0]).toBeCloseTo(0.5 + (centre(aFrame)[0]! - 0.5) * Math.SQRT1_2, 5);
  });

  it("makes new layers, not a second pointer at the old ones", () => {
    const { cfg, a, b } = twoShapes();
    copyShapeLayout(cfg, "rectangular", "circular");
    expect(cfg.elements).toHaveLength(4);
    const ids = ownedElements(cfg, "circular").map((el) => el.payload.id);
    expect(ids).not.toContain(a.payload.id);
    expect(ids).not.toContain(b.payload.id);
  });

  it("leaves the shape it copied from alone, then and afterwards", () => {
    const { cfg, a } = twoShapes();
    copyShapeLayout(cfg, "rectangular", "circular");
    expect(shownCount(cfg, "rectangular")).toBe(2);
    // Editing a copy is an edit to the copy. The original keeps its own text.
    const copy = ownedElements(cfg, "circular").find((el) => el.kind === "text")!;
    if (copy.kind === "text" && a.kind === "text") {
      copy.payload.value = { kind: { kind: "literal", value: "circular only" } };
      expect(a.payload.value).not.toEqual(copy.payload.value);
    }
  });

  it("shrinks the sizes to match the smaller canvas", () => {
    const { cfg, a } = twoShapes();
    copyShapeLayout(cfg, "rectangular", "circular");
    const copy = ownedElements(cfg, "circular").find((el) => el.kind === "text")!;
    const size = effectivePlacement(cfg, "circular", copy).size;
    expect(size).toBeDefined();
    expect(size!).toBeLessThan(elementSize(a)!);
  });

  it("never scales a size below what the editor's own field allows", () => {
    const { cfg } = twoShapes();
    addFamily(cfg, "corner");
    copyShapeLayout(cfg, "rectangular", "corner");
    const copy = ownedElements(cfg, "corner").find((el) => el.kind === "text")!;
    expect(effectivePlacement(cfg, "corner", copy).size).toBeGreaterThanOrEqual(4);
  });

  it("copies what the source hides as hidden, not as shown", () => {
    const { cfg, a } = twoShapes();
    cfg.perFamily.rectangular!.placements[a.payload.id]!.isHidden = true;
    copyShapeLayout(cfg, "rectangular", "circular");
    const copy = ownedElements(cfg, "circular").find((el) => el.kind === "text")!;
    expect(effectivePlacement(cfg, "circular", copy).isHidden).toBe(true);
    expect(shownCount(cfg, "circular")).toBe(1);
  });
});

describe("a copy taken on one shape and pasted on another", () => {
  it("makes a layer of its own, refitted for this canvas", () => {
    const { cfg, a, aFrame } = twoShapes();
    const clip = copyElements(cfg, [a.payload.id], "rectangular");
    const landed = pasteElementsOnto(cfg, clip, "circular");
    expect(cfg.elements).toHaveLength(3);
    expect(landed).toHaveLength(1);
    expect(landed[0]).not.toBe(a.payload.id);
    expect(shownCount(cfg, "circular")).toBe(1);
    const f = effectivePlacement(cfg, "circular", only(cfg, "circular")).frame;
    expect(f.width).toBeCloseTo(aFrame.width * Math.SQRT1_2, 5);
  });

  it("brings only the layers it named", () => {
    const { cfg, a } = twoShapes();
    pasteElementsOnto(cfg, copyElements(cfg, [a.payload.id], "rectangular"), "circular");
    expect(ownedElements(cfg, "circular")).toHaveLength(1);
    expect(shownCount(cfg, "rectangular")).toBe(2);
  });

  it("still duplicates when the clip came from this same shape", () => {
    const { cfg, a } = twoShapes();
    const clip = copyElements(cfg, [a.payload.id], "rectangular");
    pasteElementsOnto(cfg, clip, "rectangular");
    expect(cfg.elements).toHaveLength(3);
    expect(shownCount(cfg, "rectangular")).toBe(3);
  });
});

describe("a layer with no shape of its own", () => {
  it("lands on the shape being edited", () => {
    const { cfg } = twoShapes();
    const fresh = newElement("gauge");
    cfg.elements.push(fresh);
    normalizeOwnership(cfg, "circular");
    expect(effectivePlacement(cfg, "circular", fresh).isHidden).toBe(false);
    expect(cfg.perFamily.rectangular!.placements[fresh.payload.id]).toBeUndefined();
    expect(shownCount(cfg, "circular")).toBe(1);
  });

  it("leaves the layers that already have one where they are", () => {
    const { cfg, a } = twoShapes();
    cfg.elements.push(newElement("gauge"));
    normalizeOwnership(cfg, "circular");
    expect(cfg.perFamily.rectangular!.placements[a.payload.id]).toBeDefined();
  });
});

describe("removing a shape", () => {
  it("takes its layers with it", () => {
    const { cfg } = twoShapes();
    copyShapeLayout(cfg, "rectangular", "circular");
    expect(cfg.elements).toHaveLength(4);
    removeFamily(cfg, "circular");
    expect(cfg.elements).toHaveLength(2);
    expect(shownCount(cfg, "rectangular")).toBe(2);
  });
});

describe("refitPlacement", () => {
  const frame = { x: 0.1, y: 0.2, width: 0.4, height: 0.4, rotationDegrees: 0 };
  const p = { frame, isHidden: false, size: 12 };

  it("leaves a placement alone when the shape has not changed", () => {
    expect(refitPlacement(p, "circular", "circular", "text")).toEqual(p);
  });

  it("scales a size down for a smaller canvas", () => {
    const out = refitPlacement(p, "rectangular", "circular", "text");
    expect(out.size!).toBeLessThan(12);
    expect(out.size!).toBeGreaterThanOrEqual(4);
  });

  it("scales a size up for a larger one", () => {
    const small = { ...p, size: 5, frame: { ...frame } };
    expect(refitPlacement(small, "circular", "rectangular", "text").size!).toBeGreaterThan(5);
  });

  it("keeps a frame's middle where it was", () => {
    const out = refitPlacement(p, "rectangular", "circular", "text");
    const [cx, cy] = centre(frame);
    expect(centre(out.frame)[0]).toBeCloseTo(0.5 + (cx! - 0.5) * Math.SQRT1_2, 5);
    expect(centre(out.frame)[1]).toBeCloseTo(0.5 + (cy! - 0.5) * Math.SQRT1_2, 5);
  });

  it("does not inset between two round shapes", () => {
    const out = refitPlacement(p, "circular", "corner", "text");
    expect(out.frame).toEqual(frame);
    expect(out.size!).toBeLessThan(12);
  });

  it("puts a frame back where it was on the round trip", () => {
    const there = refitPlacement(p, "rectangular", "circular", "text");
    const back = refitPlacement(there, "circular", "rectangular", "text");
    expect(back.frame.x).toBeCloseTo(frame.x, 5);
    expect(back.frame.width).toBeCloseTo(frame.width, 5);
  });

  it("leaves a shape layer's missing size missing", () => {
    const noSize = { frame, isHidden: false };
    expect(refitPlacement(noSize, "rectangular", "circular", "shape").size).toBeUndefined();
  });
});
