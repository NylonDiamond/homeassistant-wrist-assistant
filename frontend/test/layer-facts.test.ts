// The third line of an expanded Layers row. It says what the layer is made of.
// It deliberately does not say where the layer is or how big it is: those
// numbers live on the Place card, they change on every nudge, and two long
// facts made the line wrap, which made the row change height on hover.

import { describe, expect, it } from "vitest";

import type { EditorHost } from "../src/editors.js";
import type { HassLike } from "../src/ha-api.js";
import { newConfig, newElement, type Element as CElement } from "../src/model.js";
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
  it("says what the layer is made of", () => {
    const el = textAt(0.5, 0.25, 0.25, 0.5);
    const facts = layerFacts(HOST, "rectangular", el, { frame: el.payload.frame, isHidden: false, fromPlacement: false });
    expect(fact(facts, "Shows")).toBeDefined();
    expect(fact(facts, "Looks")).toBeDefined();
  });

  it("never gives the place or the size", () => {
    const el = textAt(0.5, 0.25, 0.25, 0.5);
    const facts = layerFacts(HOST, "rectangular", el, { frame: el.payload.frame, isHidden: false, fromPlacement: false });
    expect(fact(facts, "At")).toBeUndefined();
    expect(fact(facts, "Size")).toBeUndefined();
  });

  it("stays quiet about rotation and per-shape frames when there is nothing to say", () => {
    const el = textAt(0, 0, 1, 1);
    const facts = layerFacts(HOST, "rectangular", el, { frame: el.payload.frame, isHidden: false, fromPlacement: false });
    expect(fact(facts, "Turned")).toBeUndefined();
    expect(fact(facts, "Frame")).toBeUndefined();
  });

  // Every layer is on one shape and has its own placement there, so "this one
  // has its own frame" says nothing any more and the row does not print it.
  it("never says which shape the frame belongs to", () => {
    const el = textAt(0, 0, 1, 1, 45);
    const facts = layerFacts(HOST, "circular", el, { frame: el.payload.frame, isHidden: false, fromPlacement: true });
    expect(fact(facts, "Turned")).toBe("45°");
    expect(fact(facts, "Frame")).toBeUndefined();
  });
});
