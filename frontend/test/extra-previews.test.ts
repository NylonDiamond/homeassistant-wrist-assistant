// The Extras card preview: every button it can point at has a picture, a name and a sentence.

import { describe, expect, it } from "vitest";
import { CHART_ANCHOR_POINTS, CHART_STATS } from "../src/model.js";
import { type ExtraKey, extraInfo, extraName, extraOwner, extraPreview } from "../src/extra-previews.js";

const KEYS: ExtraKey[] = [
  ...(["threshold", "now", "zero", "times", "dots", "grid"] as const).map((d): ExtraKey => `draw:${d}`),
  ...CHART_STATS.map(([s]): ExtraKey => `number:${s}`),
  ...CHART_ANCHOR_POINTS.map(([a]): ExtraKey => `marker:${a}`),
  "timeline:times",
  "image:time",
];

describe("extra previews", () => {
  it("names and describes every button in one sentence", () => {
    for (const key of KEYS) {
      expect(extraName(key), key).not.toBe("");
      const text = extraInfo(key);
      expect(text, key).toMatch(/^[A-Z].*\.$/);
      expect(text, key).not.toMatch(/[—–]| - /);
    }
  });

  it("draws a picture for every button and for none", () => {
    for (const key of KEYS) expect(() => extraPreview(extraOwner(key), key)).not.toThrow();
    for (const owner of ["chart", "timeline", "image"] as const) expect(() => extraPreview(owner, undefined)).not.toThrow();
  });

  it("draws a bars chart's samples on bars, and a line's on a line", () => {
    const text = (t: unknown): string => {
      const r = t as { strings: readonly string[]; values: unknown[] };
      return r.strings.join("") + r.values.map((v): string => (Array.isArray(v) ? v.map(text).join("") : v && typeof v === "object" && "strings" in v ? text(v) : String(v))).join("");
    };
    expect(text(extraPreview("chart", "draw:grid", true))).toContain("<rect");
    expect(text(extraPreview("chart", "draw:grid"))).not.toContain("<rect");
  });

  it("puts timeline and picture extras on their own samples", () => {
    expect(extraOwner("timeline:times")).toBe("timeline");
    expect(extraOwner("image:time")).toBe("image");
    expect(extraOwner("draw:times")).toBe("chart");
  });
});
