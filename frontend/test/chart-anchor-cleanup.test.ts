// Deleting the last layer that follows a chart's threshold or "now" takes the
// number with it, so a deleted threshold line does not keep stretching the scale.

import { describe, expect, it } from "vitest";
import {
  addChartMarker,
  chartMarkersOf,
  newConfig,
  newElement,
  removeElement,
  setChartNow,
  setChartThreshold,
  type Element,
} from "../src/model.js";

type Chart = Extract<Element, { kind: "chart" }>;

function chartConfig() {
  const cfg = newConfig("Voltage", 0);
  const chart = newElement("chart") as Chart;
  cfg.elements.push(chart);
  return { cfg, id: chart.payload.id };
}

const payload = (cfg: ReturnType<typeof newConfig>, id: string) =>
  (cfg.elements.find((e) => e.payload.id === id) as Chart).payload;

describe("removing anchored layers", () => {
  it("clears the threshold when its only line is deleted", () => {
    const { cfg, id } = chartConfig();
    setChartThreshold(cfg, id, 120);
    const [line] = chartMarkersOf(cfg, id);
    removeElement(cfg, line!.payload.id);
    expect(payload(cfg, id).thresholdValue).toBeUndefined();
    expect(payload(cfg, id).drawsThreshold).toBeUndefined();
  });

  it("keeps now while another layer still follows it", () => {
    const { cfg, id } = chartConfig();
    setChartNow(cfg, id, true);
    addChartMarker(cfg, id, "now");
    const [first, second] = chartMarkersOf(cfg, id);
    removeElement(cfg, first!.payload.id);
    expect(payload(cfg, id).nowIndex).toBeDefined();
    removeElement(cfg, second!.payload.id);
    expect(payload(cfg, id).nowIndex).toBeUndefined();
  });
});
