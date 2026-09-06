// Layers belong to the document, not to one shape, and every shape may draw
// them. That used to mean a shape added to a complication already drawn
// arrived carrying every layer on it. These pin down the three parts of the
// fix: a new shape starts blank, one shape's arrangement copies onto another
// in one step, and a copy taken on one shape pastes onto another as "show
// these here" rather than as second copies.

import { describe, expect, it } from "vitest";

import { copyShapeLayout, effectivePlacement, shownCount, showOnlyOn } from "../src/editors.js";
import { addFamily } from "../src/layouts.js";
import { copyElements, elementSize, newConfig, newElement, pasteElements, placeElements, refitPlacement } from "../src/model.js";

/** The middle of a frame, which is what the refit keeps put. */
function centre(f: { x: number; y: number; width: number; height: number }) {
  return [f.x + f.width / 2, f.y + f.height / 2];
}

function twoShapes() {
  const cfg = newConfig("X", 0, ["rectangular"]);
  const a = newElement("text");
  const b = newElement("icon");
  a.payload.frame = { x: 0.1, y: 0.2, width: 0.3, height: 0.4, rotationDegrees: 0 };
  cfg.elements = [a, b];
  addFamily(cfg, "circular");
  return { cfg, a, b };
}

describe("a shape added to a complication that is already drawn", () => {
  it("starts blank", () => {
    const { cfg } = twoShapes();
    expect(shownCount(cfg, "rectangular")).toBe(2);
    expect(shownCount(cfg, "circular")).toBe(0);
  });

  it("keeps each layer's own frame under the hidden placement", () => {
    const { cfg, a } = twoShapes();
    expect(effectivePlacement(cfg, "circular", a).frame).toEqual(a.payload.frame);
  });

  it("is blank only because it hides them, so one eye brings one back", () => {
    const { cfg, a } = twoShapes();
    cfg.perFamily.circular!.placements[a.payload.id]!.isHidden = false;
    expect(shownCount(cfg, "circular")).toBe(1);
  });
});

describe("copyShapeLayout", () => {
  it("puts every layer on the blank shape, refitted for its canvas", () => {
    const { cfg, a } = twoShapes();
    copyShapeLayout(cfg, "rectangular", "circular");
    expect(shownCount(cfg, "circular")).toBe(2);
    const f = effectivePlacement(cfg, "circular", a).frame;
    // Pulled onto the square that fits inside the circle, about its own middle.
    expect(f.width).toBeCloseTo(a.payload.frame.width * Math.SQRT1_2, 5);
    expect(centre(f)[0]).toBeCloseTo(0.5 + (centre(a.payload.frame)[0]! - 0.5) * Math.SQRT1_2, 5);
  });

  it("shrinks the sizes to match the smaller canvas", () => {
    const { cfg, a } = twoShapes();
    copyShapeLayout(cfg, "rectangular", "circular");
    const size = effectivePlacement(cfg, "circular", a).size;
    expect(size).toBeDefined();
    expect(size!).toBeLessThan(elementSize(a)!);
  });

  it("never scales a size below what the editor's own field allows", () => {
    const { cfg, a } = twoShapes();
    copyShapeLayout(cfg, "rectangular", "corner");
    expect(effectivePlacement(cfg, "corner", a).size).toBeGreaterThanOrEqual(4);
  });

  it("copies what the source hides as hidden, not as shown", () => {
    const { cfg, a } = twoShapes();
    cfg.perFamily.rectangular!.placements[a.payload.id] = { frame: { ...a.payload.frame }, isHidden: true };
    copyShapeLayout(cfg, "rectangular", "circular");
    expect(effectivePlacement(cfg, "circular", a).isHidden).toBe(true);
    expect(shownCount(cfg, "circular")).toBe(1);
  });

  it("leaves the shape it copied from alone", () => {
    const { cfg } = twoShapes();
    copyShapeLayout(cfg, "rectangular", "circular");
    expect(shownCount(cfg, "rectangular")).toBe(2);
  });
});

describe("a copy taken on one shape and pasted on another", () => {
  it("shows those layers here instead of making new ones", () => {
    const { cfg, a } = twoShapes();
    const clip = copyElements(cfg, [a.payload.id], "rectangular");
    const before = cfg.elements.length;
    const landed = placeElements(cfg, clip, "circular");
    expect(cfg.elements).toHaveLength(before);
    expect(landed).toEqual([a.payload.id]);
    expect(shownCount(cfg, "circular")).toBe(1);
    const f = effectivePlacement(cfg, "circular", a).frame;
    expect(f.width).toBeCloseTo(a.payload.frame.width * Math.SQRT1_2, 5);
  });

  it("leaves the layers it did not name hidden", () => {
    const { cfg, a, b } = twoShapes();
    placeElements(cfg, copyElements(cfg, [a.payload.id], "rectangular"), "circular");
    expect(effectivePlacement(cfg, "circular", b).isHidden).toBe(true);
  });

  it("still duplicates when the same clip is pasted the old way", () => {
    const { cfg, a } = twoShapes();
    const clip = copyElements(cfg, [a.payload.id], "rectangular");
    const before = cfg.elements.length;
    pasteElements(cfg, clip);
    expect(cfg.elements.length).toBe(before + 1);
  });

  it("skips an id the document no longer holds", () => {
    const { cfg, a } = twoShapes();
    const clip = copyElements(cfg, [a.payload.id], "rectangular");
    cfg.elements = cfg.elements.filter((el) => el.payload.id !== a.payload.id);
    expect(placeElements(cfg, clip, "circular")).toEqual([]);
  });
});

describe("showOnlyOn", () => {
  it("keeps a new layer on the shape being edited and off the others", () => {
    const { cfg } = twoShapes();
    const fresh = newElement("gauge");
    cfg.elements.push(fresh);
    showOnlyOn(cfg, fresh.payload.id, "circular");
    expect(effectivePlacement(cfg, "circular", fresh).isHidden).toBe(false);
    expect(effectivePlacement(cfg, "rectangular", fresh).isHidden).toBe(true);
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
