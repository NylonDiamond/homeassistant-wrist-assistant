// A shape added to a complication that already draws something starts from a
// copy of one of the shapes it has, rather than blank. These pin down which
// shape it copies, that a shape with a design on it is never overwritten, and
// that the copy is a set of layers of its own.

import { describe, expect, it } from "vitest";

import { seedHintText } from "../src/editors.js";
import { addFamily } from "../src/layouts.js";
import {
  type CustomComplicationConfig,
  type FamilyKind,
  legacyConfig,
  newConfig,
  newElement,
  normalizeOwnership,
  ownedElements,
  seedFamilyFromSibling,
  seedSourceFor,
} from "../src/model.js";

/** A document with one text layer on `home`, plus every other shape in
 * `families` left blank. */
function drawnOn(home: FamilyKind, ...families: FamilyKind[]): CustomComplicationConfig {
  const cfg = newConfig("X", 0, home);
  const el = newElement("text");
  el.payload.frame = { x: 0.1, y: 0.2, width: 0.5, height: 0.4, rotationDegrees: 0 };
  cfg.elements = [el];
  normalizeOwnership(cfg, home);
  for (const f of families) addFamily(cfg, f);
  return cfg;
}

/** The shapes the document draws something on. */
function drawnShapes(cfg: CustomComplicationConfig): FamilyKind[] {
  return cfg.supportedFamilies.filter((f) => f !== "inline" && ownedElements(cfg, f).length > 0);
}

describe("which shape a new one starts from", () => {
  it("copies Circular onto Small", () => {
    const cfg = drawnOn("circular", "rectangular", "small");
    // Rectangular is wider, and Small still takes the square shape.
    const el = newElement("icon");
    cfg.elements.push(el);
    normalizeOwnership(cfg, "rectangular");
    expect(seedSourceFor(cfg, "small")).toBe("circular");
    expect(seedFamilyFromSibling(cfg, "small")).toBe("circular");
  });

  it("copies Rectangular onto Medium", () => {
    const cfg = drawnOn("rectangular", "circular", "medium");
    const el = newElement("icon");
    cfg.elements.push(el);
    normalizeOwnership(cfg, "circular");
    expect(seedFamilyFromSibling(cfg, "medium")).toBe("rectangular");
  });

  it("copies the widest shape onto one with no twin", () => {
    const cfg = drawnOn("circular", "rectangular", "large");
    const el = newElement("icon");
    cfg.elements.push(el);
    normalizeOwnership(cfg, "rectangular");
    expect(seedFamilyFromSibling(cfg, "large")).toBe("rectangular");
  });

  it("falls back to the widest shape when the one it wants is not there", () => {
    const cfg = drawnOn("rectangular", "small");
    expect(seedFamilyFromSibling(cfg, "small")).toBe("rectangular");
  });

  it("falls back to the widest shape when the one it wants draws nothing", () => {
    const cfg = drawnOn("rectangular", "circular", "small");
    // Circular is in the document but blank, so it is no source.
    expect(ownedElements(cfg, "circular")).toEqual([]);
    expect(seedFamilyFromSibling(cfg, "small")).toBe("rectangular");
  });

  it("breaks a tie on width with the shortest shape", () => {
    const cfg = drawnOn("medium", "large", "xlarge");
    const el = newElement("icon");
    cfg.elements.push(el);
    normalizeOwnership(cfg, "xlarge");
    // Medium, Large and Extra Large are all 344.67 pt wide.
    expect(seedFamilyFromSibling(cfg, "large")).toBe("medium");
  });

  it("never copies Corner", () => {
    const cfg = drawnOn("corner", "circular");
    expect(seedSourceFor(cfg, "circular")).toBeUndefined();
    expect(seedFamilyFromSibling(cfg, "circular")).toBeUndefined();
    expect(ownedElements(cfg, "circular")).toEqual([]);
  });

  it("never copies Inline, and never fills it", () => {
    const cfg = drawnOn("rectangular", "inline", "small");
    expect(seedFamilyFromSibling(cfg, "inline")).toBeUndefined();
    // Inline is not a source either: Small still comes off Rectangular.
    expect(seedFamilyFromSibling(cfg, "small")).toBe("rectangular");
  });
});

describe("when nothing is copied", () => {
  it("leaves a shape alone when the document has no other shape", () => {
    const cfg = newConfig("X", 0, "small");
    expect(seedFamilyFromSibling(cfg, "small")).toBeUndefined();
    expect(cfg.elements).toEqual([]);
  });

  it("leaves a shape alone when every other shape is blank", () => {
    const cfg = legacyConfig("X", 0, ["rectangular", "circular", "small"]);
    expect(seedFamilyFromSibling(cfg, "small")).toBeUndefined();
  });

  it("never overwrites a shape that already has layers", () => {
    const cfg = drawnOn("rectangular", "small");
    expect(seedFamilyFromSibling(cfg, "small")).toBe("rectangular");
    const before = ownedElements(cfg, "small").map((el) => el.payload.id);
    expect(before).toHaveLength(1);
    // A second call is the one that must change nothing.
    expect(seedFamilyFromSibling(cfg, "small")).toBeUndefined();
    expect(ownedElements(cfg, "small").map((el) => el.payload.id)).toEqual(before);
  });

  it("leaves a shape the document does not support alone", () => {
    const cfg = drawnOn("rectangular");
    expect(seedFamilyFromSibling(cfg, "small")).toBeUndefined();
    expect(cfg.perFamily.small).toBeUndefined();
  });
});

describe("what the copy is", () => {
  it("gives the new shape layers of its own", () => {
    const cfg = drawnOn("rectangular", "small");
    const was = ownedElements(cfg, "rectangular").map((el) => el.payload.id);
    expect(seedFamilyFromSibling(cfg, "small")).toBe("rectangular");
    const now = ownedElements(cfg, "small").map((el) => el.payload.id);
    expect(now).toHaveLength(1);
    expect(now[0]).not.toBe(was[0]);
    // The shape it came from keeps exactly what it had.
    expect(ownedElements(cfg, "rectangular").map((el) => el.payload.id)).toEqual(was);
    expect(drawnShapes(cfg).sort()).toEqual(["rectangular", "small"]);
  });

  it("lands the copy where the original sits", () => {
    const cfg = drawnOn("rectangular", "medium");
    seedFamilyFromSibling(cfg, "medium");
    const id = ownedElements(cfg, "medium")[0]!.payload.id;
    const frame = cfg.perFamily.medium!.placements[id]!.frame;
    // Rectangular and Medium are both wide boxes, so nothing is pulled in.
    expect(frame.x).toBeCloseTo(0.1, 5);
    expect(frame.y).toBeCloseTo(0.2, 5);
    expect(frame.width).toBeCloseTo(0.5, 5);
  });

  it("scales text down on the way onto a smaller canvas", () => {
    const cfg = drawnOn("rectangular", "circular", "small");
    seedFamilyFromSibling(cfg, "circular");
    const id = ownedElements(cfg, "circular")[0]!.payload.id;
    const size = cfg.perFamily.circular!.placements[id]!.size;
    const was = ownedElements(cfg, "rectangular")[0]!.payload;
    expect(size).toBeDefined();
    expect(size!).toBeLessThan((was as { fontSize: number }).fontSize);
  });
});

describe("the line under the new shape", () => {
  it("warns about the corners on a Small copied from Circular", () => {
    expect(seedHintText("circular", "small")).toBe("Copied from your circular design. The corners are free.");
  });

  it("names the shape it came from otherwise", () => {
    expect(seedHintText("rectangular", "medium")).toBe("Copied from your Rectangular design.");
    expect(seedHintText("rectangular", "small")).toBe("Copied from your Rectangular design.");
    expect(seedHintText("medium", "large")).toBe("Copied from your Medium design.");
  });
});
