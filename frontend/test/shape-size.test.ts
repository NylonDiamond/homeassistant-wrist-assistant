// A layer's size belongs to the shape it is being drawn in, the same way its
// frame does. The Look card writes a placement for the shape on screen, so
// this pins down that a size set on one shape never reaches another, and that
// a shape which has never been placed still falls back to the layer's own
// value.

import { describe, expect, it } from "vitest";

import { effectivePlacement, elementSize, setPlacement } from "../src/editors.js";
import { type TextElement, elementsFor, newConfig, newElement } from "../src/model.js";

function textConfig() {
  const cfg = newConfig("Test", 0);
  const el = newElement("text");
  cfg.elements.push(el);
  return { cfg, id: el.payload.id, shared: elementSize(el)! };
}

function fontSizeIn(cfg: ReturnType<typeof textConfig>["cfg"], family: "rectangular" | "circular", id: string) {
  const el = elementsFor(cfg, family).find((e) => e.payload.id === id);
  return (el?.payload as TextElement).fontSize;
}

describe("a size set on one shape", () => {
  it("changes that shape and leaves the others on the shared value", () => {
    const { cfg, id, shared } = textConfig();
    setPlacement(cfg, "rectangular", id, { size: shared + 12 });
    expect(fontSizeIn(cfg, "rectangular", id)).toBe(shared + 12);
    expect(fontSizeIn(cfg, "circular", id)).toBe(shared);
  });

  it("does not touch the layer's own value, which the unplaced shapes read", () => {
    const { cfg, id, shared } = textConfig();
    setPlacement(cfg, "rectangular", id, { size: shared + 12 });
    expect(elementSize(cfg.elements[0]!)).toBe(shared);
  });

  it("is what the size control reads back for that shape only", () => {
    const { cfg, id, shared } = textConfig();
    setPlacement(cfg, "rectangular", id, { size: shared + 12 });
    const el = cfg.elements[0]!;
    expect(effectivePlacement(cfg, "rectangular", el).size).toBe(shared + 12);
    expect(effectivePlacement(cfg, "circular", el).size).toBeUndefined();
  });

  it("survives a second size on another shape", () => {
    const { cfg, id, shared } = textConfig();
    setPlacement(cfg, "rectangular", id, { size: shared + 12 });
    setPlacement(cfg, "circular", id, { size: shared + 4 });
    expect(fontSizeIn(cfg, "rectangular", id)).toBe(shared + 12);
    expect(fontSizeIn(cfg, "circular", id)).toBe(shared + 4);
  });
});
