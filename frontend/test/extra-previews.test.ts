// The Extras card: every control it can point at has a picture, a name and a
// sentence, the pictures read the chart's own readings, and the Readings list
// offers each number and marker exactly once.

import { describe, expect, it } from "vitest";
import { CHART_ANCHOR_POINTS, CHART_STATS, chartAnchorIsColumn } from "../src/model.js";
import {
  CHART_DRAW_EXTRAS, CHART_READINGS, type ExtraKey,
  chartPreviewPlot, extraInfo, extraName, extraOwner, extraPreview,
} from "../src/extra-previews.js";

const KEYS: ExtraKey[] = [
  ...CHART_DRAW_EXTRAS.map(([d]): ExtraKey => `draw:${d}`),
  ...CHART_STATS.map(([s]): ExtraKey => `number:${s}`),
  ...CHART_ANCHOR_POINTS.map(([a]): ExtraKey => `marker:${a}`),
  "timeline:times",
  "image:time",
];

const text = (t: unknown): string => {
  const r = t as { strings: readonly string[]; values: unknown[] };
  return r.strings.join("") + r.values.map((v): string => (Array.isArray(v) ? v.map(text).join("") : v && typeof v === "object" && "strings" in v ? text(v) : String(v))).join("");
};

describe("extra previews", () => {
  it("names and describes every control in one sentence", () => {
    for (const key of KEYS) {
      expect(extraName(key), key).not.toBe("");
      const info = extraInfo(key);
      expect(info, key).toMatch(/^[A-Z].*\.$/);
      expect(info, key).not.toMatch(/[—–]| - /);
    }
  });

  it("draws a picture for every control and for none", () => {
    for (const key of KEYS) expect(() => extraPreview(extraOwner(key), key)).not.toThrow();
    for (const owner of ["chart", "timeline", "image"] as const) expect(() => extraPreview(owner, undefined)).not.toThrow();
  });

  it("draws a bars chart's samples on bars, and a line's on a line", () => {
    expect(text(extraPreview("chart", "draw:grid", true))).toContain("<rect");
    expect(text(extraPreview("chart", "draw:grid"))).not.toContain("<rect");
  });

  it("puts timeline and picture extras on their own samples", () => {
    expect(extraOwner("timeline:times")).toBe("timeline");
    expect(extraOwner("image:time")).toBe("image");
    expect(extraOwner("draw:times")).toBe("chart");
  });

  it("prints the chart's own number, and no made up one without readings", () => {
    const sample = { values: [123.26, 122.95, 124.1, 121.8], texts: { highest: "124.1" } };
    expect(text(extraPreview("chart", "number:highest", true, sample))).toContain("124.1");
    const bare = text(extraPreview("chart", "number:highest", true));
    expect(bare).not.toMatch(/<text[^>]*>[^<]*\d/);
  });

  it("places marks on the chart's own readings", () => {
    const plot = chartPreviewPlot({ values: [5, 9, 1, 4], now: 2, threshold: 20 });
    expect(plot.real).toBe(true);
    expect(plot.column).toEqual({ highest: 1, lowest: 2, first: 0, latest: 3, now: 2 });
    // The threshold stretches the plot, so it sits at the very top.
    expect(plot.thresholdY).toBeCloseTo(6);
    expect(chartPreviewPlot({ values: [3] }).real).toBe(false);
  });

  it("lists every number once and every column marker once", () => {
    const stats = CHART_READINGS.flatMap((r) => (r.stat ? [r.stat] : []));
    const marks = CHART_READINGS.flatMap((r) => (r.marker ? [r.marker] : []));
    expect([...stats].sort()).toEqual(CHART_STATS.map(([s]) => s).sort());
    expect([...marks].sort()).toEqual(CHART_ANCHOR_POINTS.filter(([a]) => chartAnchorIsColumn(a)).map(([a]) => a).sort());
    for (const r of CHART_READINGS) expect(r.label).not.toMatch(/[—–]| - /);
  });
});
