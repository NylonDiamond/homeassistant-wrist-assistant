// A layer's own name: editor-only, like its group. The Layers list shows it in
// place of the title derived from the layer's content, and a second series
// over a chart gets one so the two rows can be told apart.

import { describe, expect, it } from "vitest";

import {
  addChartSeries,
  auditUnknownKeys,
  copyElements,
  duplicateElement,
  encodeConfig,
  literal,
  newConfig,
  newElement,
  nextNumberedName,
  parseConfig,
  pasteElements,
  type Element,
} from "../src/model.js";
import { autoLayerTitle, layerTitle, typedLayerName } from "../src/editors.js";

function chartConfig() {
  const cfg = newConfig("Series", 0);
  const chart = newElement("chart") as Extract<Element, { kind: "chart" }>;
  chart.payload.value = literal("1,2,3");
  cfg.elements.push(chart);
  return { cfg, id: chart.payload.id, chart };
}

const title = (el: Element) => layerTitle(el);

describe("layer name", () => {
  it("falls back to the derived title when unset, and wins when set", () => {
    const { chart } = chartConfig();
    const derived = layerTitle(chart);
    expect(derived).not.toBe("");
    chart.payload.name = "Voltage";
    expect(layerTitle(chart)).toBe("Voltage");
    chart.payload.name = "";
    expect(layerTitle(chart)).toBe(derived);
  });

  it("saves a typed name trimmed, and a blank one as no name", () => {
    expect(typedLayerName("  Voltage 2 ")).toBe("Voltage 2");
    expect(typedLayerName("Voltage ")).toBe("Voltage");
    expect(typedLayerName("   ")).toBeUndefined();
    expect(typedLayerName("")).toBeUndefined();
  });

  it("keeps the automatic title for the placeholder while a name is set", () => {
    const { chart } = chartConfig();
    const derived = layerTitle(chart);
    chart.payload.name = "Voltage";
    expect(autoLayerTitle(chart)).toBe(derived);
  });

  it("round-trips through the wire and is a known key", () => {
    const { cfg, chart } = chartConfig();
    chart.payload.name = "Voltage";
    const wire = encodeConfig(cfg);
    expect(auditUnknownKeys(wire)).toEqual([]);
    expect(parseConfig(wire).elements[0]!.payload.name).toBe("Voltage");
  });

  it("numbers from 2, skipping names already taken, counting on from a numbered title", () => {
    expect(nextNumberedName("Voltage", ["Voltage"])).toBe("Voltage 2");
    expect(nextNumberedName("Voltage", ["Voltage", "Voltage 2"])).toBe("Voltage 3");
    expect(nextNumberedName("Voltage 2", ["Voltage", "Voltage 2"])).toBe("Voltage 3");
    expect(nextNumberedName("Room 101", ["Room 101"])).toBe("Room 2");
  });

  it("names a second series after the chart with the next free number", () => {
    const { cfg, id, chart } = chartConfig();
    const base = layerTitle(chart);
    const second = addChartSeries(cfg, id, title)!;
    const third = addChartSeries(cfg, id, title)!;
    const byId = (x: string) => cfg.elements.find((e) => e.payload.id === x)!;
    expect(layerTitle(byId(second))).toBe(`${base} 2`);
    expect(layerTitle(byId(third))).toBe(`${base} 3`);
    expect(chart.payload.name).toBeUndefined();
  });

  it("keeps the name through duplicate and copy and paste", () => {
    const { cfg, id, chart } = chartConfig();
    chart.payload.name = "Voltage";
    const dup = duplicateElement(cfg, id)!;
    expect(cfg.elements.find((e) => e.payload.id === dup)!.payload.name).toBe("Voltage");
    const pasted = pasteElements(cfg, copyElements(cfg, [id]));
    expect(cfg.elements.find((e) => e.payload.id === pasted[0])!.payload.name).toBe("Voltage");
  });
});
