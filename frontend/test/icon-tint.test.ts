import { describe, expect, it } from "vitest";
import { iconTint } from "../src/editors.js";

describe("the color an icon field paints its glyphs in", () => {
  it("takes a plain hex, with or without its hash", () => {
    expect(iconTint("#FFD70A")).toBe("#FFD70A");
    expect(iconTint(" ffd70a ")).toBe("#ffd70a");
  });

  it("drops the alpha, so a see-through color still reads", () => {
    expect(iconTint("#FFD70A40")).toBe("#FFD70A");
  });

  it("leaves the ink color for anything else", () => {
    for (const color of [undefined, null, "", "red", "theme", "#FFF", "linear-gradient(#000, #fff)", 42]) {
      expect(iconTint(color), String(color)).toBeUndefined();
    }
  });
});
