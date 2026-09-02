// The General tab's rename note (rule: the watch face picker caches names).

import { describe, expect, it } from "vitest";
import { nameChangedFromWatch } from "../src/editors.js";

describe("nameChangedFromWatch", () => {
  it("is false for a brand-new complication (no saved name)", () => {
    expect(nameChangedFromWatch(undefined, "Porch")).toBe(false);
  });

  it("is false when the name is unchanged", () => {
    expect(nameChangedFromWatch("Porch", "Porch")).toBe(false);
    expect(nameChangedFromWatch("Porch", "  Porch  ")).toBe(false);
  });

  it("is false while the field is blank, so a mid-edit clear does not warn", () => {
    expect(nameChangedFromWatch("Porch", "")).toBe(false);
    expect(nameChangedFromWatch("Porch", "   ")).toBe(false);
  });

  it("is true once the name really differs", () => {
    expect(nameChangedFromWatch("Porch", "Porch 2")).toBe(true);
    expect(nameChangedFromWatch("", "Porch")).toBe(true);
  });
});
