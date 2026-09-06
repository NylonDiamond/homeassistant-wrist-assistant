// Layers belong to the document, not to one shape, and every shape may draw
// them. That used to mean a shape added to a complication already drawn
// arrived carrying every layer on it. These pin down the three parts of the
// fix: a new shape starts blank, one shape's arrangement copies onto another
// in one step, and a copy taken on one shape pastes onto another as "show
// these here" rather than as second copies.

import { describe, expect, it } from "vitest";

import { copyShapeLayout, effectivePlacement, shownCount, showOnlyOn } from "../src/editors.js";
import { addFamily } from "../src/layouts.js";
import { copyElements, newConfig, newElement, pasteElements, placeElements } from "../src/model.js";

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
  it("puts every layer on the blank shape where it sits on the other one", () => {
    const { cfg, a } = twoShapes();
    copyShapeLayout(cfg, "rectangular", "circular");
    expect(shownCount(cfg, "circular")).toBe(2);
    expect(effectivePlacement(cfg, "circular", a).frame).toEqual(a.payload.frame);
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
    expect(effectivePlacement(cfg, "circular", a).frame).toEqual(a.payload.frame);
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
