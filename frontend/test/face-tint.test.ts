import { describe, expect, it } from "vitest";
import { tintGroup, tintMatrix } from "../src/renderer.js";

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
});
