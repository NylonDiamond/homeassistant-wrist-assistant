// A menu hangs off its button by a fixed edge. On a phone the top bar wraps,
// and the ··· menu, hung by its right edge from a button at the left of the
// screen, opened 170px off the left edge. menuShift is how far the panel
// slides an open menu back inside the window.

import { describe, expect, it } from "vitest";

import { menuShift } from "../src/panel.js";

describe("menuShift", () => {
  it("leaves a menu that fits where it is", () => {
    expect(menuShift(40, 260, 393)).toBe(0);
  });

  it("brings a menu off the left edge back in", () => {
    // The phone case that was reported: left -173, right 47.
    expect(menuShift(-173, 47, 393)).toBe(181);
  });

  it("pulls a menu off the right edge back in", () => {
    expect(menuShift(250, 430, 393)).toBe(-45);
  });

  it("keeps the left edge in when the menu is wider than the window", () => {
    expect(menuShift(-20, 400, 360)).toBe(28);
  });

  it("takes the margin it is given", () => {
    expect(menuShift(0, 100, 393, 0)).toBe(0);
    expect(menuShift(0, 100, 393, 12)).toBe(12);
  });
});
