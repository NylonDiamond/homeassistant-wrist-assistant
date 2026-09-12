// A chart's clock times as a layer of their own (`chartTimes`): the conversion,
// the wire, and what the layer resolves to.

import { describe, expect, it } from "vitest";
import {
  auditUnknownKeys,
  ConfigParseError,
  convertChartTimes,
  encodeConfig,
  groupOf,
  newConfig,
  newElement,
  parseConfig,
  removeElement,
  type CustomComplicationConfig,
  type Element,
} from "../src/model.js";
import { resolveAll, type EntityState, type ResolvedElement } from "../src/resolver.js";

type Chart = Extract<Element, { kind: "chart" }>;
type Times = Extract<Element, { kind: "chartTimes" }>;

function historyChart(tweak: (c: Chart) => void = () => {}): { cfg: CustomComplicationConfig; chart: Chart } {
  const cfg = newConfig("Voltage", 0);
  const chart = newElement("chart") as Chart;
  chart.payload.value = { kind: { kind: "entityState", entityId: "sensor.voltage", displayName: "Voltage", domain: "sensor" } };
  chart.payload.frame = { x: 0.1, y: 0.2, width: 0.8, height: 0.5, rotationDegrees: 0 };
  chart.payload.historyMinutes = 360;
  chart.payload.historyPoints = 6;
  chart.payload.timeLabelCount = 4;
  chart.payload.labelSize = 7;
  chart.payload.labelColorHex = "#FF0000";
  chart.payload.hourCycle = "h24";
  chart.payload.minutes = "never";
  tweak(chart);
  cfg.elements.push(chart);
  return { cfg, chart };
}

function resolved(cfg: CustomComplicationConfig): readonly ResolvedElement[] {
  const entityStates = new Map<string, EntityState>([
    ["sensor.voltage", { entityId: "sensor.voltage", state: "230", domain: "sensor", iconName: "" }],
  ]);
  return resolveAll(cfg, {
    entityStates,
    templateResults: new Map(),
    namedValues: cfg.values,
    historySeries: new Map([["sensor.voltage|360|6", "1,2,3,4,5,6"]]),
  }).rectangular!.elements;
}

const payloadOf = (cfg: CustomComplicationConfig, id: string) =>
  ((encodeConfig(cfg).elements as { payload: Record<string, unknown> }[]).find((e) => e.payload.id === id))!.payload;

describe("convertChartTimes", () => {
  it("makes a times layer from the chart's keys and stops the chart drawing its own", () => {
    const { cfg, chart } = historyChart();
    const id = convertChartTimes(cfg, chart.payload.id)!;
    const index = cfg.elements.findIndex((e) => e.payload.id === id);
    const times = cfg.elements[index] as Times;
    expect(times.kind).toBe("chartTimes");
    expect(cfg.elements[index - 1]!.payload.id).toBe(chart.payload.id);
    expect(times.payload).toMatchObject({
      chart: chart.payload.id,
      timeLabelCount: 4,
      labelSize: 7,
      labelColorHex: "#FF0000",
      hourCycle: "h24",
      minutes: "never",
    });
    expect(chart.payload.drawsTimeLabels).toBe(false);
    // The chart's width, one line tall, just under the chart.
    expect(times.payload.frame.x).toBeCloseTo(0.1);
    expect(times.payload.frame.width).toBeCloseTo(0.8);
    expect(times.payload.frame.y).toBeCloseTo(0.7);
    expect(times.payload.frame.height).toBeGreaterThan(0);
    expect(times.payload.frame.height).toBeLessThan(0.2);
    expect(groupOf(cfg, id)?.id).toBe(groupOf(cfg, chart.payload.id)?.id);
  });

  it("sits above a chart that printed its times above, held inside the face", () => {
    const { cfg, chart } = historyChart((c) => {
      c.payload.labelsAbove = true;
      c.payload.frame = { x: 0, y: 0, width: 1, height: 0.5, rotationDegrees: 0 };
    });
    const id = convertChartTimes(cfg, chart.payload.id)!;
    const times = cfg.elements.find((e) => e.payload.id === id) as Times;
    expect(times.payload.frame.y).toBe(0);
  });

  it("does nothing for a layer that is not a chart", () => {
    const cfg = newConfig("Text", 0);
    const text = newElement("text");
    cfg.elements.push(text);
    expect(convertChartTimes(cfg, text.payload.id)).toBeUndefined();
    expect(cfg.elements).toHaveLength(1);
  });
});

describe("chartTimes on the wire", () => {
  it("omits drawsTimeLabels while the chart draws its own times", () => {
    const { cfg, chart } = historyChart();
    expect("drawsTimeLabels" in payloadOf(cfg, chart.payload.id)).toBe(false);
    convertChartTimes(cfg, chart.payload.id);
    expect(payloadOf(cfg, chart.payload.id).drawsTimeLabels).toBe(false);
  });

  it("round-trips the layer and the chart with no unknown keys", () => {
    const { cfg, chart } = historyChart();
    const id = convertChartTimes(cfg, chart.payload.id)!;
    const raw = JSON.parse(JSON.stringify(encodeConfig(cfg)));
    expect(auditUnknownKeys(raw)).toEqual([]);
    const back = parseConfig(raw);
    const times = back.elements.find((e) => e.payload.id === id) as Times;
    expect(times.kind).toBe("chartTimes");
    expect(times.payload.chart).toBe(chart.payload.id);
    expect(times.payload.hourCycle).toBe("h24");
    expect((back.elements.find((e) => e.payload.id === chart.payload.id) as Chart).payload.drawsTimeLabels).toBe(false);
    // No labelsAbove and no colorSlot on the layer's payload.
    const payload = payloadOf(cfg, id);
    expect("labelsAbove" in payload).toBe(false);
    expect("colorSlot" in payload).toBe(false);
  });

  it("reads leniently: a count past the range is clamped, an unknown clock is auto", () => {
    const { cfg, chart } = historyChart();
    const id = convertChartTimes(cfg, chart.payload.id)!;
    const raw = JSON.parse(JSON.stringify(encodeConfig(cfg)));
    const el = raw.elements.find((e: { payload: { id: string } }) => e.payload.id === id);
    el.payload.timeLabelCount = 99;
    el.payload.hourCycle = "h36";
    const times = parseConfig(raw).elements.find((e) => e.payload.id === id) as Times;
    expect(times.payload.timeLabelCount).toBe(12);
    expect(times.payload.hourCycle).toBe("auto");
  });

  it("refuses the whole document on an element kind it does not know", () => {
    const { cfg } = historyChart();
    const raw = JSON.parse(JSON.stringify(encodeConfig(cfg)));
    raw.elements.push({ kind: "hologram", payload: { id: "0F0F0F0F-0000-4000-8000-000000000000" } });
    expect(() => parseConfig(raw)).toThrow(ConfigParseError);
  });
});

describe("chartTimes resolved", () => {
  it("draws the chart's times at the layer's own count, and the chart draws none", () => {
    const { cfg, chart } = historyChart();
    const id = convertChartTimes(cfg, chart.payload.id)!;
    const els = resolved(cfg);
    const c = els.find((e) => e.id === chart.payload.id);
    const t = els.find((e) => e.id === id);
    expect(c?.kind === "chart" && c.labels).toEqual([]);
    expect(t?.kind).toBe("chartTimes");
    if (t?.kind !== "chartTimes") return;
    expect(t.labels.map((l) => l.position)).toEqual([0, 1 / 3, 2 / 3, 1]);
    expect(t.labels.every((l) => l.text !== "")).toBe(true);
    expect(t.labelSize).toBe(7);
    expect(t.labelColorHex).toBe("#FF0000");

    (cfg.elements.find((e) => e.payload.id === id) as Times).payload.timeLabelCount = 3;
    const three = resolved(cfg).find((e) => e.id === id);
    expect(three?.kind === "chartTimes" && three.labels.map((l) => l.position)).toEqual([0, 0.5, 1]);
  });

  it("reads its chart whatever order the two sit in", () => {
    const { cfg, chart } = historyChart();
    const id = convertChartTimes(cfg, chart.payload.id)!;
    cfg.elements.reverse();
    const t = resolved(cfg).find((e) => e.id === id);
    expect(t?.kind === "chartTimes" && t.labels).toHaveLength(4);
  });

  it("draws nothing once its chart is gone, or when the link is not a chart", () => {
    const { cfg, chart } = historyChart();
    const id = convertChartTimes(cfg, chart.payload.id)!;
    const orphan = structuredClone(cfg);
    orphan.elements = orphan.elements.filter((e) => e.payload.id !== chart.payload.id);
    const t = resolved(orphan).find((e) => e.id === id);
    expect(t?.kind === "chartTimes" && t.labels).toEqual([]);

    const text = newElement("text");
    cfg.elements.push(text);
    (cfg.elements.find((e) => e.payload.id === id) as Times).payload.chart = text.payload.id;
    const wrong = resolved(cfg).find((e) => e.id === id);
    expect(wrong?.kind === "chartTimes" && wrong.labels).toEqual([]);
  });

  it("draws nothing for a chart with no evenly spaced span", () => {
    const { cfg, chart } = historyChart((c) => { c.payload.historyPoints = 0; });
    const id = convertChartTimes(cfg, chart.payload.id)!;
    const t = resolved(cfg).find((e) => e.id === id);
    expect(t?.kind === "chartTimes" && t.labels).toEqual([]);
  });

  it("goes with its chart when the chart is deleted", () => {
    const { cfg, chart } = historyChart();
    const id = convertChartTimes(cfg, chart.payload.id)!;
    removeElement(cfg, chart.payload.id);
    expect(cfg.elements.some((e) => e.payload.id === id)).toBe(false);
  });
});
