// A chart's highlight, threshold and now lines, and clock times are always
// layers: the Extras toggles add and remove them, and a document where the chart
// still draws its own is converted when a draft opens it.

import { describe, expect, it } from "vitest";
import { Draft } from "../src/draft.js";
import {
  chartMarkersOf,
  chartTimesOf,
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
