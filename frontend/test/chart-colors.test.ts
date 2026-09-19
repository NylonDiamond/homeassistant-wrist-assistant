// Which color rows a chart's Look card shows. Each case pins one fact about
// what paints a chart (see chart-colors.ts), so a row never offers a color the
// chart ignores.

import { describe, expect, it } from "vitest";
import { chartColorRows } from "../src/chart-colors.js";
import { type ChartElement, chartBarColors, chartSortedBands, newElement } from "../src/model.js";

function chart(patch: Partial<ChartElement> = {}): ChartElement {
  const c = newElement("chart").payload as ChartElement;
  return Object.assign(c, patch);
}

const BANDS = [
  { id: "a", upTo: 10, colorHex: "#00FF00" },
  { id: "b", upTo: 20, colorHex: "#FFFF00" },
];

describe("chart color rows", () => {
  it("names the layer color the bar color on a one color bars chart, with no duplicate fill row", () => {
    const rows = chartColorRows(chart({ style: "bars" }));
    expect(rows.main).toBe("Bar color");
    expect(rows.fill).toBeUndefined();
    expect(rows.border).toBeUndefined();
  });

  it("keeps a fill color that was set, and says it wins over Bar color", () => {
    const c = chart({ style: "bars", fillColorHex: "#112233", barBorderWidth: 1 });
    const rows = chartColorRows(c);
    expect(rows.fill?.warn).toBe(true);
    expect(rows.border?.label).toBe("Border color");
    // The fact the warning states.
    expect(chartBarColors(c, 5, [], "#FFFFFF").fill).toBe("#112233");
  });

  it("drops the layer color on a banded bars chart, because the bands paint every bar", () => {
    const c = chart({ style: "bars", coloring: "bands", bands: BANDS, barBorderWidth: 1 });
    const rows = chartColorRows(c);
    expect(rows.main).toBeUndefined();
    expect(rows.fill?.label).toBe("Band fill");
    expect(rows.fill?.empty).toBe("Each band's color");
    expect(rows.border?.label).toBe("Band border");
    expect(chartBarColors(c, 5, chartSortedBands(c), "#ABCDEF").fill).toBe("#00FF00");
    expect(chartBarColors(c, 50, chartSortedBands(c), "#ABCDEF").fill).toBe(c.bandAboveColorHex);
  });

  it("hides the band fill on a banded chart with no border until one is set, then warns", () => {
    expect(chartColorRows(chart({ style: "bars", coloring: "bands", bands: BANDS })).fill).toBeUndefined();
    const set = chartColorRows(chart({ style: "bars", coloring: "bands", bands: BANDS, fillColorHex: "#000000" }));
    expect(set.fill?.warn).toBe(true);
  });

  it("treats By value with no bands as one color, the way it draws", () => {
    expect(chartColorRows(chart({ style: "bars", coloring: "bands", bands: [] })).main).toBe("Bar color");
  });

  it("drops the layer color on a banded line", () => {
    expect(chartColorRows(chart({ style: "line" })).main).toBe("Line color");
    expect(chartColorRows(chart({ style: "line", coloring: "bands", bands: BANDS }))).toEqual({});
  });

  it("offers one fill row on a banded area, whichever color paints the wash", () => {
    const area = { style: "area" as const, coloring: "bands" as const, bands: BANDS };
    expect(chartColorRows(chart({ ...area, fillBands: false }))).toEqual({ main: "Fill color" });
    expect(chartColorRows(chart({ ...area, fillBands: true }))).toEqual({});
    const own = chartColorRows(chart({ ...area, fillBands: true, fillColorHex: "#123456" }));
    expect(own.main).toBeUndefined();
    expect(own.fill?.warn).toBe(true);
  });

  it("writes no dashes", () => {
    const all = [
      chart({ style: "bars", fillColorHex: "#000000", barBorderWidth: 1 }),
      chart({ style: "bars", coloring: "bands", bands: BANDS, fillColorHex: "#000000", barBorderWidth: 1 }),
      chart({ style: "bars", coloring: "bands", bands: BANDS, fillColorHex: "#000000" }),
      chart({ style: "area", coloring: "bands", bands: BANDS, fillBands: true, fillColorHex: "#000000" }),
    ].flatMap((c) => { const r = chartColorRows(c); return [r.main, r.fill?.label, r.fill?.note, r.border?.note]; });
    for (const t of all) if (t) expect(t).not.toMatch(/[—–]| - /);
  });
});
