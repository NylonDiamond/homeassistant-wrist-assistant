import { describe, expect, it } from "vitest";
import { snapTemplateItems, type TemplateSnapBox, type TemplateSnapInput } from "../src/watch-pages/template-item-snap.js";

const box = (key: string, x: number, y: number, width = .2, height = .1, baseline?: number): TemplateSnapBox => ({ key, x, y, width, height, ...(baseline === undefined ? {} : { baseline }) });
const first = box("home", .234, .62);
const neighbor = box("lights", .237, .2);
function input(over: Partial<TemplateSnapInput> = {}): TemplateSnapInput {
  return { moving: [first], others: [neighbor], centers: [{ x: .334, y: .67 }], lead: { x: .334, y: .67 }, width: 280, height: 196, dx: .01, dy: .06, on: true, free: false, ...over };
}

describe("template item alignment guides", () => {
  it("lands on an off-grid text edge rather than jumping to either grid line", () => {
    const result = snapTemplateItems(input());
    expect(first.x + result.dx).toBeCloseTo(neighbor.x, 12);
    expect(result.guides).toContainEqual(expect.objectContaining({ axis: "x", at: .237 }));
    expect((first.x + result.dx) / .05).not.toBeCloseTo(Math.round((first.x + result.dx) / .05), 3);
  });

  it("aligns right edges of different length labels", () => {
    const result = snapTemplateItems(input({ moving: [box("a", .602, .7, .15)], centers: [{ x: .677, y: .75 }], lead: { x: .677, y: .75 }, others: [box("b", .35, .2, .4)], dx: 0 }));
    expect(.602 + .15 + result.dx).toBeCloseTo(.75, 12);
  });

  it("aligns centers", () => {
    const result = snapTemplateItems(input({ moving: [box("a", .598, .7, .2)], centers: [{ x: .698, y: .75 }], lead: { x: .698, y: .75 }, others: [box("b", .6, .2, .2)], dx: 0 }));
    expect(.698 + result.dx).toBeCloseTo(.7, 12);
  });

  it("prefers a shared baseline for differently sized text", () => {
    const result = snapTemplateItems(input({ moving: [box("a", .1, .452, .1, .1, .525)], others: [box("b", .7, .4, .1, .2, .54)], centers: [{ x: .15, y: .502 }], lead: { x: .15, y: .502 }, dx: 0, dy: .01 }));
    expect(.525 + result.dy).toBeCloseTo(.54, 12);
    expect(result.guides).toContainEqual(expect.objectContaining({ axis: "y", at: .54 }));
  });

  it("uses the same correction for each member of a selected group", () => {
    const a = box("a", .1, .6, .1), b = box("b", .31, .6, .1);
    const result = snapTemplateItems(input({ moving: [a, b], others: [box("c", .317, .2, .3)], centers: [{ x: .15, y: .65 }, { x: .36, y: .65 }], lead: { x: .15, y: .65 }, dx: 0 }));
    expect(b.x + result.dx).toBeCloseTo(.317, 12);
    expect((b.x + result.dx) - (a.x + result.dx)).toBeCloseTo(.21, 12);
  });

  it("never snaps a selection back to its own starting points", () => {
    const result = snapTemplateItems(input({ others: [first], dx: .01, dy: .06 }));
    expect(result.guides).toEqual([]);
    expect(result.dx).toBeCloseTo(.35 - .334, 12);
  });

  it("falls back to the grid independently on the axis without a guide", () => {
    const result = snapTemplateItems(input());
    expect(result.dx).toBeCloseTo(.003, 12);
    expect(result.dy).toBeCloseTo(.75 - .67, 12);
    expect(result.guides).toEqual([expect.objectContaining({ axis: "x", at: .237 })]);
  });

  it.each([{ free: true }, { on: false }])("preserves free movement with %j", over => {
    const result = snapTemplateItems(input(over));
    expect(result).toEqual({ dx: .01, dy: .06, guides: [] });
  });

  it("holds the group inside the tile and removes a guide it cannot reach", () => {
    const result = snapTemplateItems(input({ moving: [box("a", .86, .8, .2)], others: [box("b", .974, .2, .01)], centers: [{ x: .99, y: .85 }], lead: { x: .99, y: .85 }, dx: .016 }));
    expect(result.dx).toBeCloseTo(.01, 12);
    expect(result.guides.some(g => g.axis === "x")).toBe(false);
  });

  it("shows one primary guide while both axes still snap", () => {
    const result = snapTemplateItems(input({ moving: [box("a", .2, .6)], others: [box("b", .223, .632)], centers: [{ x: .3, y: .65 }], lead: { x: .3, y: .65 }, dx: .02, dy: .03 }));
    expect(result.dx).toBeCloseTo(.023, 12);
    expect(result.dy).toBeCloseTo(.032, 12);
    expect(result.guides).toEqual([expect.objectContaining({ axis: "y", at: .632 })]);
  });

  it("does not show a stationary row guide while aligning a column", () => {
    const result = snapTemplateItems(input({ moving: [box("a", .2, .6)], others: [box("b", .223, .6)], centers: [{ x: .3, y: .65 }], lead: { x: .3, y: .65 }, dx: .02, dy: 0 }));
    expect(result.guides).toEqual([expect.objectContaining({ axis: "x", at: .223 })]);
  });

  it("limits the guide to the nearest aligned pair instead of crossing the tile", () => {
    const result = snapTemplateItems(input({ others: [neighbor, box("near", .237, .45)] }));
    expect(result.guides).toHaveLength(1);
    expect(result.guides[0]!.from).toBeCloseTo(.45 - 4 / 196, 12);
    expect(result.guides[0]!.to).toBeCloseTo(first.y + result.dy + first.height + 4 / 196, 12);
  });

  it("does not highlight the tile border as an item alignment", () => {
    const result = snapTemplateItems(input({ moving: [box("a", .04, .6)], others: [], centers: [{ x: .14, y: .65 }], lead: { x: .14, y: .65 }, dx: -.03, dy: 0 }));
    expect(result.dx).toBeCloseTo(-.04, 12);
    expect(result.guides).toEqual([]);
  });

  it("does not pull toward elements outside the visible-pixel tolerance", () => {
    const result = snapTemplateItems(input({ moving: [box("a", .1, .7, .1)], others: [box("b", .3, .2, .1)], centers: [{ x: .15, y: .75 }], lead: { x: .15, y: .75 }, dx: .06, dy: 0 }));
    expect(result.guides.some(g => g.axis === "x")).toBe(false);
    expect(.15 + result.dx).toBeCloseTo(.2, 12);
  });
});
