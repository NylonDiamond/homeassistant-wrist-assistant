import { describe, expect, it } from "vitest";
import { templateSelectionRect, templateMarqueeSelection } from "../src/watch-pages/template-item-selection.js";

const boxes = [
  { key: "icon", x: .05, y: .1, width: .1, height: .12 },
  { key: "value", x: .25, y: .1, width: .1, height: .12 },
  { key: "label", x: .4, y: .1, width: .4, height: .12 },
  { key: "other-row", x: .25, y: .6, width: .1, height: .12 },
];
describe("template preview box selection", () => {
  it("selects multiple overlapping items without selecting another row", () => {
    const rect = templateSelectionRect({ x: .2, y: .05 }, { x: .6, y: .3 });
    expect(templateMarqueeSelection(boxes, rect)).toEqual(["value", "label"]);
  });
  it("works when dragged up and left", () => {
    const rect = templateSelectionRect({ x: .6, y: .3 }, { x: .2, y: .05 });
    expect(templateMarqueeSelection(boxes, rect)).toEqual(["value", "label"]);
  });
  it("clips a drag that extends outside the tile", () => {
    const rect = templateSelectionRect({ x: -.2, y: -.1 }, { x: 1.3, y: 1.2 });
    expect(rect).toEqual({ x: 0, y: 0, width: 1, height: 1 });
    expect(templateMarqueeSelection(boxes, rect)).toEqual(boxes.map(p => p.key));
  });
  it("adds to the original selection without duplicate keys", () => {
    const rect = templateSelectionRect({ x: .2, y: .05 }, { x: .6, y: .3 });
    expect(templateMarqueeSelection(boxes, rect, ["icon", "value"], true)).toEqual(["icon", "value", "label"]);
    expect(templateMarqueeSelection(boxes, { x: .9, y: .9, width: .1, height: .1 }, ["icon", "value"], true)).toEqual(["icon", "value"]);
  });
  it("replaces the previous selection without a modifier", () => {
    const rect = templateSelectionRect({ x: .2, y: .05 }, { x: .6, y: .3 });
    expect(templateMarqueeSelection(boxes, rect, ["other-row"])).toEqual(["value", "label"]);
  });
  it("does not select an item by merely touching its edge or clicking empty space", () => {
    expect(templateMarqueeSelection(boxes, { x: .15, y: .1, width: .1, height: .12 })).toEqual([]);
    expect(templateMarqueeSelection(boxes, { x: .25, y: .1, width: 0, height: 0 })).toEqual([]);
  });
});
