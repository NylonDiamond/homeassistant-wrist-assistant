import { describe, expect, it } from "vitest";

import { inspectorColumnCount, splitColumns } from "../src/watch-pages/inspector-columns.js";

describe("the inspector's column count", () => {
  it("fits columns of at least 360px with 14px between, one to three", () => {
    expect(inspectorColumnCount(0)).toBe(1);
    expect(inspectorColumnCount(Number.NaN)).toBe(1);
    expect(inspectorColumnCount(500)).toBe(1);
    expect(inspectorColumnCount(733)).toBe(1);
    expect(inspectorColumnCount(734)).toBe(2);
    expect(inspectorColumnCount(1107)).toBe(2);
    expect(inspectorColumnCount(1108)).toBe(3);
    expect(inspectorColumnCount(4000)).toBe(3);
  });
});

describe("splitting cards into columns", () => {
  const one = () => 1;
  it("keeps the order and makes the heaviest column as light as it can be", () => {
    const w: Record<string, number> = { a: 9, b: 4, c: 4, d: 2, e: 2, f: 2, g: 6, h: 5, i: 4 };
    expect(splitColumns(Object.keys(w), (k) => w[k]!, 3)).toEqual([["a", "b"], ["c", "d", "e", "f"], ["g", "h", "i"]]);
    expect(splitColumns(Object.keys(w), (k) => w[k]!, 3).flat()).toEqual(Object.keys(w));
  });
  it("gives one column all of them, and never an empty column", () => {
    expect(splitColumns(["a", "b", "c"], one, 1)).toEqual([["a", "b", "c"]]);
    expect(splitColumns(["a", "b"], one, 3)).toEqual([["a"], ["b"]]);
    expect(splitColumns([], one, 3)).toEqual([]);
  });
  it("gives earlier columns more on a tie", () => {
    expect(splitColumns(["a", "b", "c"], one, 2)).toEqual([["a", "b"], ["c"]]);
  });
});
