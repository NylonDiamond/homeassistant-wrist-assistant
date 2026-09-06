// The third line of an expanded Layers row. It exists so a row can answer
// "where is this and what is it made of?" without opening the inspector, so
// the numbers have to be the same design points the Place card writes, not
// the 0-to-1 fractions the document stores.

import { describe, expect, it } from "vitest";

import type { EditorHost } from "../src/editors.js";
import type { HassLike } from "../src/ha-api.js";
import { DESIGN_BOX, newConfig, newElement, type Element as CElement } from "../src/model.js";
import { layerFacts } from "../src/panel.js";

const config = newConfig("Test", 0);
const HOST = { hass: { states: {} } as HassLike, config } as EditorHost;

const textAt = (x: number, y: number, width: number, height: number, rotationDegrees = 0): CElement => {
  const el = newElement("text") as CElement;
  el.payload.frame = { x, y, width, height, rotationDegrees };
  return el;
};

const fact = (facts: { label: string; value: string }[], label: string) =>
  facts.find((f) => f.label === label)?.value;

describe("layerFacts", () => {
  it("gives the place and the size in design points", () => {
    const el = textAt(0.5, 0.25, 0.25, 0.5);
    const facts = layerFacts(HOST, "rectangular", el, { frame: el.payload.frame, isHidden: false, fromPlacement: false });
    const box = DESIGN_BOX.rectangular;
    expect(fact(facts, "At")).toBe(`${Math.round(0.5 * box.width)}, ${Math.round(0.25 * box.height)} pt`);
    expect(fact(facts, "Size")).toBe(`${Math.round(0.25 * box.width)} x ${Math.round(0.5 * box.height)} pt`);
  });

  it("measures against the shape being edited, not always the rectangle", () => {
    const el = textAt(0.5, 0.5, 0.5, 0.5);
    const rect = layerFacts(HOST, "rectangular", el, { frame: el.payload.frame, isHidden: false, fromPlacement: false });
    const corner = layerFacts(HOST, "corner", el, { frame: el.payload.frame, isHidden: false, fromPlacement: false });
    expect(fact(rect, "Size")).not.toBe(fact(corner, "Size"));
    expect(fact(corner, "Size")).toBe("17 x 17 pt");
  });

  it("stays quiet about rotation and per-shape frames when there is nothing to say", () => {
    const el = textAt(0, 0, 1, 1);
    const facts = layerFacts(HOST, "rectangular", el, { frame: el.payload.frame, isHidden: false, fromPlacement: false });
    expect(fact(facts, "Turned")).toBeUndefined();
    expect(fact(facts, "Frame")).toBeUndefined();
  });

  it("says when a layer has stopped following the shared frame", () => {
    // A layer with its own placement here no longer moves with the other
    // shapes, which is the one thing a row cannot show by drawing it.
    const el = textAt(0, 0, 1, 1, 45);
    const facts = layerFacts(HOST, "circular", el, { frame: el.payload.frame, isHidden: false, fromPlacement: true });
    expect(fact(facts, "Turned")).toBe("45°");
    expect(fact(facts, "Frame")).toBe("Circular only");
  });
});
