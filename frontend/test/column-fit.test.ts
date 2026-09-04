// The panel used to size its columns from fixed pixels inside a grid that
// clips its overflow, so narrowing the window pushed the inspector off the
// right edge and simply cut it off. columnFit is what stops that: it decides
// how many columns fit and how wide the side ones may be, from the panel's own
// measured width.

import { describe, expect, it } from "vitest";

import { columnFit } from "../src/panel.js";

const CANVAS_MIN = 320;
const CHROME_3 = 32 + 4 * 8 + 2 * 8; // padding + four gaps + two gutters
const CHROME_2 = 32 + 2 * 8 + 8;

/** What the grid actually costs at this fit: every track plus the chrome. */
const used = (fit: { columns: number; left: number; right: number }, canvas: number) =>
  fit.columns === 3
    ? fit.left + fit.right + canvas + CHROME_3
    : fit.columns === 2
      ? fit.left + canvas + CHROME_2
      : canvas;

describe("columnFit", () => {
  it("leaves the asked-for widths alone when there is room", () => {
    const fit = columnFit(1800, 270, 340);
    expect(fit).toEqual({ columns: 3, left: 270, right: 340 });
  });

  it("assumes three columns before the first measurement", () => {
    // Flashing wide-then-narrow is better than narrow-then-wide, and the
    // observer corrects it on the same frame.
    expect(columnFit(0, 270, 340).columns).toBe(3);
  });

  it("shrinks both sides rather than letting the grid overflow", () => {
    // The reported bug: a left column dragged wide, then a narrower window.
    const fit = columnFit(1231, 570, 340);
    expect(fit.columns).toBe(3);
    expect(fit.left).toBeLessThan(570);
    expect(used(fit, CANVAS_MIN)).toBeLessThanOrEqual(1231);
  });

  it("keeps the canvas at its minimum across every width that still fits three", () => {
    for (let w = 720 + CHROME_3; w <= 2000; w += 7) {
      const fit = columnFit(w, 570, 480);
      expect(fit.columns).toBe(3);
      expect(fit.left).toBeGreaterThanOrEqual(200);
      expect(fit.right).toBeGreaterThanOrEqual(200);
      expect(used(fit, CANVAS_MIN)).toBeLessThanOrEqual(w);
    }
  });

  it("drops to two columns once both sides cannot hold their minimum", () => {
    const fit = columnFit(700, 270, 340);
    expect(fit.columns).toBe(2);
    expect(used(fit, CANVAS_MIN)).toBeLessThanOrEqual(700);
  });

  it("trims the remaining side column in two-column mode too", () => {
    const fit = columnFit(600, 640, 340);
    expect(fit.columns).toBe(2);
    expect(fit.left).toBeLessThan(640);
    expect(used(fit, CANVAS_MIN)).toBeLessThanOrEqual(600);
  });

  it("stacks to one column when even a side plus the canvas will not fit", () => {
    expect(columnFit(480, 270, 340).columns).toBe(1);
    expect(columnFit(320, 270, 340).columns).toBe(1);
  });

  it("never returns a side column narrower than the drag minimum", () => {
    for (let w = 100; w <= 2400; w += 13) {
      const fit = columnFit(w, 270, 340);
      if (fit.columns === 3) {
        expect(fit.left).toBeGreaterThanOrEqual(200);
        expect(fit.right).toBeGreaterThanOrEqual(200);
      }
      if (fit.columns === 2) expect(fit.left).toBeGreaterThanOrEqual(200);
    }
  });
});
