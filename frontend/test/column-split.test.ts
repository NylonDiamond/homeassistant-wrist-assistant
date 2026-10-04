// The side columns a person widens by dragging a gutter (the page editor's,
// shaped like the complication editor's): the width limits, the fit to the
// measured width, and the preference kept in storage.

import { describe, expect, it } from "vitest";

import { type ColumnStorage, clampColumnWidth, fitColumnWidths, loadColumnWidths, saveColumnWidths } from "../src/column-split.js";

const LIMITS = { min: 200, max: 720, middleMin: 320 };
const DEFAULTS = { left: 250, right: 300 };
const KEY = "test.columns";

function memoryStorage(seed: Record<string, string> = {}): ColumnStorage & { data: Record<string, string> } {
  const data = { ...seed };
  return {
    data,
    getItem: (key) => (Object.hasOwn(data, key) ? data[key]! : null),
    setItem: (key, value) => { data[key] = String(value); },
  };
}

describe("clampColumnWidth", () => {
  it("keeps a width within the limits, in whole pixels", () => {
    expect(clampColumnWidth(150, LIMITS)).toBe(200);
    expect(clampColumnWidth(900, LIMITS)).toBe(720);
    expect(clampColumnWidth(333.6, LIMITS)).toBe(334);
    expect(clampColumnWidth(200, LIMITS)).toBe(200);
    expect(clampColumnWidth(720, LIMITS)).toBe(720);
  });
});

describe("fitColumnWidths", () => {
  it("leaves the asked-for widths alone when they fit beside the middle column", () => {
    expect(fitColumnWidths(1400, { left: 300, right: 400 }, LIMITS)).toEqual({ left: 300, right: 400 });
    // Exactly enough is still enough.
    expect(fitColumnWidths(250 + 300 + 320, DEFAULTS, LIMITS)).toEqual(DEFAULTS);
  });

  it("keeps the asked-for widths before the first measurement", () => {
    expect(fitColumnWidths(0, { left: 600, right: 700 }, LIMITS)).toEqual({ left: 600, right: 700 });
    expect(fitColumnWidths(-28, DEFAULTS, LIMITS)).toEqual(DEFAULTS);
  });

  it("shrinks both sides by the same factor rather than squeezing the middle", () => {
    const fit = fitColumnWidths(1000, { left: 600, right: 300 }, LIMITS);
    expect(fit.left + fit.right).toBeLessThanOrEqual(1000 - 320);
    expect(fit.left).toBeGreaterThan(fit.right);
    expect(fit.left / fit.right).toBeCloseTo(2, 1);
  });

  it("never goes below the minimum, taking the rest off the side with slack", () => {
    const fit = fitColumnWidths(800, { left: 700, right: 210 }, LIMITS);
    expect(fit.right).toBe(200);
    expect(fit.left).toBe(800 - 320 - 200);
  });

  it("holds both sides at the minimum when even that does not leave the middle its room", () => {
    expect(fitColumnWidths(600, { left: 400, right: 400 }, LIMITS)).toEqual({ left: 200, right: 200 });
  });
});

describe("loadColumnWidths and saveColumnWidths", () => {
  it("round-trip the widths under the key", () => {
    const storage = memoryStorage();
    saveColumnWidths(KEY, { left: 333, right: 444 }, storage);
    expect(JSON.parse(storage.data[KEY]!)).toEqual({ left: 333, right: 444 });
    expect(loadColumnWidths(KEY, DEFAULTS, LIMITS, storage)).toEqual({ left: 333, right: 444 });
    // Another key reads its own defaults.
    expect(loadColumnWidths("other", DEFAULTS, LIMITS, storage)).toEqual(DEFAULTS);
  });

  it("fall back to the defaults for nothing saved, no storage, or a value that does not read", () => {
    expect(loadColumnWidths(KEY, DEFAULTS, LIMITS, memoryStorage())).toEqual(DEFAULTS);
    expect(loadColumnWidths(KEY, DEFAULTS, LIMITS, undefined)).toEqual(DEFAULTS);
    expect(loadColumnWidths(KEY, DEFAULTS, LIMITS, memoryStorage({ [KEY]: "{not json" }))).toEqual(DEFAULTS);
    expect(loadColumnWidths(KEY, DEFAULTS, LIMITS, memoryStorage({ [KEY]: "null" }))).toEqual(DEFAULTS);
    // One side saved: the other keeps its default.
    expect(loadColumnWidths(KEY, DEFAULTS, LIMITS, memoryStorage({ [KEY]: '{"right":512}' }))).toEqual({ left: 250, right: 512 });
  });

  it("clamp what was saved, so an old or edited value cannot break the grid", () => {
    const storage = memoryStorage({ [KEY]: '{"left":5,"right":5000}' });
    expect(loadColumnWidths(KEY, DEFAULTS, LIMITS, storage)).toEqual({ left: 200, right: 720 });
  });

  it("swallow a storage that throws", () => {
    const broken: ColumnStorage = {
      getItem: () => { throw new Error("off"); },
      setItem: () => { throw new Error("off"); },
    };
    expect(() => saveColumnWidths(KEY, DEFAULTS, broken)).not.toThrow();
    expect(loadColumnWidths(KEY, DEFAULTS, LIMITS, broken)).toEqual(DEFAULTS);
  });
});
