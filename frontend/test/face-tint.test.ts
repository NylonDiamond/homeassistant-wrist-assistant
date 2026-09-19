import { describe, expect, it } from "vitest";
import { accentTint, tintGroup, tintMatrix } from "../src/renderer.js";

// The groups mirror the app's views: `.widgetAccentable()` on shapes, icons,
// gauges, charts and timelines, the default group for text, and
// `.accentedDesaturated` on a camera picture.
describe("a tinted face preview", () => {
  it("puts each kind of layer in the group the watch does", () => {
    for (const kind of ["shape", "icon", "gauge", "chart", "timeline", "chartTimes", "chartDots", "chartGrid"] as const) {
      expect(tintGroup(kind)).toBe("accent");
    }
    expect(tintGroup("text")).toBe("plain");
    expect(tintGroup("imageTime")).toBe("plain");
    expect(tintGroup("image")).toBe("picture");
  });

  it("repaints the accent group in the tint and keeps only alpha", () => {
    expect(tintMatrix("accent", "#FF0000")).toBe("0 0 0 0 1.0000 0 0 0 0 0.0000 0 0 0 0 0.0000 0 0 0 1 0");
  });

  it("draws the default group in white whatever the tint", () => {
    expect(tintMatrix("plain", "#0A84FF")).toBe("0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0");
  });

  it("turns a picture's brightness into alpha", () => {
    expect(tintMatrix("picture", "#FFFFFF").endsWith("0.2126 0.7152 0.0722 0 0")).toBe(true);
  });

  it("puts a layer the document accented in the accent group", () => {
    expect(tintGroup("text", "watch", true)).toBe("accent");
    expect(tintGroup("text", "watch", false)).toBe("plain");
  });
});

// The iPhone surface is WidgetKit's `accented` mode: the tile's ground goes and
// every layer is painted in the tint at the brightness it was drawn in.
describe("a tinted Home Screen preview", () => {
  it("keeps the kinds the app already marks accentable in the accent group", () => {
    for (const kind of ["shape", "icon", "gauge", "chart", "timeline"] as const) {
      expect(tintGroup(kind, "phone")).toBe("phoneAccent");
    }
    expect(tintGroup("text", "phone")).toBe("phonePrimary");
    expect(tintGroup("image", "phone")).toBe("phonePrimary");
  });

  it("moves a layer the document accented into the accent group", () => {
    expect(tintGroup("text", "phone", true)).toBe("phoneAccent");
    expect(tintGroup("imageTime", "phone", true)).toBe("phoneAccent");
  });

  it("turns every layer's brightness into alpha, not its see-through-ness", () => {
    expect(tintMatrix("phonePrimary", "#0A84FF").endsWith("0.2126 0.7152 0.0722 0 0")).toBe(true);
    expect(tintMatrix("phoneAccent", "#0A84FF").endsWith("0.2126 0.7152 0.0722 0 0")).toBe(true);
  });

  it("paints the accent group in the lighter of the two colors", () => {
    expect(accentTint("#000000")).toBe("#808080");
    expect(accentTint("#FFFFFF")).toBe("#FFFFFF");
    expect(tintMatrix("phonePrimary", "#FF0000").startsWith("0 0 0 0 1.0000 0 0 0 0 0.0000")).toBe(true);
    // #FF0000 lifted halfway to white is #FF8080, so green and blue stop at zero.
    expect(tintMatrix("phoneAccent", "#FF0000").startsWith("0 0 0 0 1.0000 0 0 0 0 0.5020")).toBe(true);
  });
});
