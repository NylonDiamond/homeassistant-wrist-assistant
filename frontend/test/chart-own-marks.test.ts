// A chart's highlight, threshold and now lines, and clock times are always
// layers: the Extras toggles add and remove them, and a document where the chart
// still draws its own is converted when a draft opens it.

import { describe, expect, it } from "vitest";
import { Draft } from "../src/draft.js";
import {
  chartDotsOf,
  chartGridsOf,
  chartMarkersOf,
  chartTimesOf,
  chartZeroLinesOf,
  convertChartTimes,
  encodeConfig,
  liftChartOwnMarks,
  newConfig,
  newElement,
  setChartNow,
  setChartThreshold,
  type CustomComplicationConfig,
  type Element,
} from "../src/model.js";

type Chart = Extract<Element, { kind: "chart" }>;

function historyChart(tweak: (c: Chart) => void = () => {}): { cfg: CustomComplicationConfig; chart: Chart } {
  const cfg = newConfig("Voltage", 0);
  const chart = newElement("chart") as Chart;
  chart.payload.value = { kind: { kind: "entityState", entityId: "sensor.voltage", displayName: "Voltage", domain: "sensor" } };
  chart.payload.frame = { x: 0.1, y: 0.2, width: 0.8, height: 0.5, rotationDegrees: 0 };
  chart.payload.historyMinutes = 360;
  chart.payload.historyPoints = 24;
  tweak(chart);
  cfg.elements.push(chart);
  return { cfg, chart };
}

const chartOf = (cfg: CustomComplicationConfig, id: string) => cfg.elements.find((e) => e.payload.id === id) as Chart;

describe("threshold and now toggles", () => {
  it("adds a threshold line layer and stops the chart drawing its own", () => {
    const { cfg, chart } = historyChart();
    setChartThreshold(cfg, chart.payload.id, 120);
    const c = chartOf(cfg, chart.payload.id).payload;
    expect(c.thresholdValue).toBe(120);
    expect(c.drawsThreshold).toBe(false);
    const lines = chartMarkersOf(cfg, chart.payload.id);
    expect(lines.map((m) => m.payload.chartAnchor)).toEqual([{ layer: chart.payload.id, at: "threshold", place: "through" }]);
    // Turning it on again does not stack a second line.
    setChartThreshold(cfg, chart.payload.id, 130);
    expect(chartMarkersOf(cfg, chart.payload.id)).toHaveLength(1);
  });

  it("removes the threshold and every layer following it when turned off", () => {
    const { cfg, chart } = historyChart();
    setChartThreshold(cfg, chart.payload.id, 120);
    setChartThreshold(cfg, chart.payload.id, undefined);
    const c = chartOf(cfg, chart.payload.id).payload;
    expect(c.thresholdValue).toBeUndefined();
    expect(c.drawsThreshold).toBeUndefined();
    expect(chartMarkersOf(cfg, chart.payload.id)).toHaveLength(0);
  });

  it("seeds the hour and adds a now line, and takes both away again", () => {
    const { cfg, chart } = historyChart();
    setChartNow(cfg, chart.payload.id, true);
    let c = chartOf(cfg, chart.payload.id).payload;
    expect(c.nowIndex).toEqual({ kind: { kind: "time", timeField: "hour" } });
    expect(c.drawsNowLine).toBe(false);
    expect(chartMarkersOf(cfg, chart.payload.id).map((m) => m.payload.chartAnchor?.at)).toEqual(["now"]);
    setChartNow(cfg, chart.payload.id, false);
    c = chartOf(cfg, chart.payload.id).payload;
    expect(c.nowIndex).toBeUndefined();
    expect(chartMarkersOf(cfg, chart.payload.id)).toHaveLength(0);
  });
});

describe("times layer", () => {
  it("starts with four times when the chart never printed any", () => {
    const { cfg, chart } = historyChart();
    expect(chart.payload.timeLabelCount).toBe(0);
    convertChartTimes(cfg, chart.payload.id);
    const [times] = chartTimesOf(cfg, chart.payload.id);
    expect(times?.payload.timeLabelCount).toBe(4);
    expect(chartOf(cfg, chart.payload.id).payload.drawsTimeLabels).toBe(false);
  });
});

describe("liftChartOwnMarks", () => {
  it("turns a chart's own marks, lines and times into layers", () => {
    const { cfg, chart } = historyChart((c) => {
      c.payload.highlight = "both";
      c.payload.marker = "pointer";
      c.payload.thresholdValue = 50;
      c.payload.nowIndex = { kind: { kind: "time", timeField: "hour" } };
      c.payload.timeLabelCount = 3;
    });
    liftChartOwnMarks(cfg);
    const c = chartOf(cfg, chart.payload.id).payload;
    expect(c.highlight).toBe("none");
    expect(c.drawsThreshold).toBe(false);
    expect(c.drawsNowLine).toBe(false);
    expect(c.drawsTimeLabels).toBe(false);
    const anchors = chartMarkersOf(cfg, chart.payload.id).map((m) => m.payload.chartAnchor?.at).sort();
    expect(anchors).toEqual(["highest", "lowest", "now", "threshold"]);
    // "pointer" drew a triangle over the highest and a dot under the lowest.
    const symbolAt = (at: string) => {
      const m = chartMarkersOf(cfg, chart.payload.id).find((e) => e.payload.chartAnchor?.at === at);
      return m?.kind === "icon" ? JSON.stringify(m.payload.symbol) : "";
    };
    expect(symbolAt("highest")).toContain("arrowtriangle.up.fill");
    expect(symbolAt("lowest")).toContain("circle.fill");
    expect(chartTimesOf(cfg, chart.payload.id)[0]?.payload.timeLabelCount).toBe(3);
  });

  it("turns the one-day dots, grid and zero line keys into layers and drops the keys", () => {
    const { cfg, chart } = historyChart((c) => {
      c.payload.style = "line";
      c.payload.pointDots = "all";
      c.payload.pointDotSize = 5;
      c.payload.pointDotColorHex = "#FF9F0A";
      c.payload.gridLines = 2;
      c.payload.gridColorHex = "#FF000080";
      c.payload.zeroLine = true;
    });
    liftChartOwnMarks(cfg);
    const id = chart.payload.id;
    const c = chartOf(cfg, id).payload;
    for (const key of ["pointDots", "pointDotSize", "pointDotColorHex", "gridLines", "gridColorHex", "zeroLine"]) {
      expect(key in c, key).toBe(false);
    }
    expect(chartDotsOf(cfg, id).map((d) => d.payload)).toMatchObject([{ dots: "all", size: 5, colorHex: "#FF9F0A" }]);
    expect(chartGridsOf(cfg, id).map((g) => g.payload)).toMatchObject([{ lines: 2, colorHex: "#FF000080" }]);
    const zero = chartZeroLinesOf(cfg, id);
    expect(zero).toHaveLength(1);
    // The chart drew its zero line in the grid colour.
    expect(zero[0]!.kind === "shape" && zero[0]!.payload.colorSlot.baseColorHex).toBe("#FF000080");
    // Grid behind the chart, dots in front of it.
    const at = (layerId: string) => cfg.elements.findIndex((e) => e.payload.id === layerId);
    expect(at(chartGridsOf(cfg, id)[0]!.payload.id)).toBeLessThan(at(id));
    expect(at(chartDotsOf(cfg, id)[0]!.payload.id)).toBeGreaterThan(at(id));
  });

  it("makes no layer for dots off, no grid lines and no zero line", () => {
    const { cfg, chart } = historyChart((c) => { c.payload.pointDots = "none"; c.payload.gridLines = 0; c.payload.zeroLine = false; });
    liftChartOwnMarks(cfg);
    const id = chart.payload.id;
    expect(chartDotsOf(cfg, id)).toHaveLength(0);
    expect(chartGridsOf(cfg, id)).toHaveLength(0);
    expect(chartZeroLinesOf(cfg, id)).toHaveLength(0);
    expect("pointDots" in chartOf(cfg, id).payload).toBe(false);
  });

  it("opens a document saved with the one-day keys converted, clean and seated on the chart's shape", () => {
    const { cfg, chart } = historyChart((c) => { c.payload.style = "line"; });
    const raw = JSON.parse(JSON.stringify(encodeConfig(cfg)));
    const payload = raw.elements.find((e: { payload: { id: string } }) => e.payload.id === chart.payload.id).payload;
    Object.assign(payload, { pointDots: "auto", gridLines: 3, zeroLine: true });
    const draft = Draft.fromDocument(raw, 1);
    expect(draft.dirty).toBe(false);
    const opened = draft.config;
    const id = chart.payload.id;
    const added = [...chartDotsOf(opened, id), ...chartGridsOf(opened, id), ...chartZeroLinesOf(opened, id)];
    expect(added).toHaveLength(3);
    const seat = Object.entries(opened.perFamily).find(([, l]) => l?.placements[id] !== undefined)?.[0];
    expect(seat).toBeDefined();
    for (const layer of added) {
      expect(opened.perFamily[seat as keyof typeof opened.perFamily]?.placements[layer.payload.id]?.isHidden).toBe(false);
    }
    const saved = JSON.stringify(encodeConfig(opened));
    for (const key of ["\"pointDots\"", "\"gridLines\"", "\"zeroLine\""]) expect(saved).not.toContain(key);
  });

  it("leaves a chart with nothing of its own alone", () => {
    const { cfg } = historyChart();
    const before = JSON.stringify(encodeConfig(cfg));
    liftChartOwnMarks(cfg);
    expect(JSON.stringify(encodeConfig(cfg))).toBe(before);
  });

  it("opens a draft converted and clean, with the new layers on the chart's shape", () => {
    const { cfg, chart } = historyChart((c) => {
      c.payload.thresholdValue = 50;
      c.payload.highlight = "highest";
    });
    const draft = Draft.fromDocument(encodeConfig(cfg), 1);
    expect(draft.dirty).toBe(false);
    const opened = draft.config;
    const layers = chartMarkersOf(opened, chart.payload.id);
    expect(layers.map((m) => m.payload.chartAnchor?.at).sort()).toEqual(["highest", "threshold"]);
    const seat = Object.entries(opened.perFamily).find(([, l]) => l?.placements[chart.payload.id] !== undefined)?.[0];
    expect(seat).toBeDefined();
    for (const m of layers) {
      expect(opened.perFamily[seat as keyof typeof opened.perFamily]?.placements[m.payload.id]?.isHidden).toBe(false);
    }
  });
});
