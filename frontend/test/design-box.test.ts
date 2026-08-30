import { describe, expect, it } from "vitest";
import { CANVAS, CASES, REFERENCE_CASE, fitBox } from "../src/renderer.js";

// Mirror of CustomComplicationDesignBoxTests.swift in the app repo. The two
// fit functions must agree to the point, or the panel preview drifts from the
// wrist.
describe("design box", () => {
  it("the measured 46 mm slot is the identity fit", () => {
    for (const family of ["rectangular", "circular", "corner"] as const) {
      const fit = fitBox(CANVAS[family], family);
      expect(fit.scale).toBe(1);
      expect(fit.x).toBe(0);
      expect(fit.y).toBe(0);
      expect(fit.width).toBe(CANVAS[family].width);
      expect(fit.height).toBe(CANVAS[family].height);
    }
  });

  it("the reference case row is CANVAS itself", () => {
    expect(REFERENCE_CASE.measured).toBe(true);
    expect(REFERENCE_CASE.slots).toBe(CANVAS);
  });

  it("a smaller slot scales down uniformly and centres", () => {
    const fit = fitBox({ width: 153, height: 55.5 }, "rectangular");
    expect(fit.scale).toBeCloseTo(153 / 181, 6);
    expect(fit.width).toBeCloseTo(153, 6);
    expect(fit.height).toBeLessThan(55.5);
    expect(fit.y * 2 + fit.height).toBeCloseTo(55.5, 6);
    expect(fit.x).toBe(0);
  });

  it("a wider slot letterboxes instead of stretching", () => {
    const fit = fitBox({ width: 100, height: 34 }, "corner");
    expect(fit.scale).toBe(1);
    expect(fit.width).toBe(34);
    expect(fit.x).toBe(33);
    expect(fit.y).toBe(0);
  });

  it("every case scales to at most 1 against the reference", () => {
    for (const c of CASES) {
      for (const family of ["rectangular", "circular", "corner"] as const) {
        expect(fitBox(c.slots[family], family).scale).toBeLessThanOrEqual(1 + 1e-9);
      }
    }
  });

  it("a zero slot never yields NaN", () => {
    const fit = fitBox({ width: 0, height: 0 }, "circular");
    expect(fit.scale).toBe(0);
    expect(Number.isNaN(fit.x)).toBe(false);
  });
});
