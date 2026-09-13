// The Extras card preview: every button it can point at has a picture and a sentence.

import { describe, expect, it } from "vitest";
import { CHART_ANCHOR_POINTS, CHART_STATS } from "../src/model.js";
import { type ChartExtraKey, extraInfo, extraPreview } from "../src/extra-previews.js";

const KEYS: ChartExtraKey[] = [
  ...(["threshold", "now", "zero", "times", "dots", "grid"] as const).map((d): ChartExtraKey => `draw:${d}`),
  ...CHART_STATS.map(([s]): ChartExtraKey => `number:${s}`),
  ...CHART_ANCHOR_POINTS.map(([a]): ChartExtraKey => `marker:${a}`),
];

describe("extra previews", () => {
  it("describes every button in one sentence", () => {
    for (const key of KEYS) {
      const text = extraInfo(key);
      expect(text, key).toMatch(/^[A-Z].*\.$/);
      expect(text, key).not.toMatch(/[—–]| - /);
    }
  });

  it("draws a picture for every button and for none", () => {
    for (const key of [...KEYS, undefined]) expect(() => extraPreview(key)).not.toThrow();
  });
});
