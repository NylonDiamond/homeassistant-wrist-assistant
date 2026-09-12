// Every one with more readings than the server keeps: the server averages the
// whole span, the websocket reply says so, and the chart editor explains it.

import { describe, expect, it } from "vitest";
import { collectSeriesResults, type HistorySeriesResult } from "../src/ha-api.js";
import { everyReadingAveragedHint } from "../src/editors.js";

describe("every reading, averaged when the span has too many", () => {
  it("carries readings and averaged from the fetch, only where the server sent them", () => {
    const results: Record<string, HistorySeriesResult> = {
      "sensor.v|360|0": { ok: true, series: "1,2,3", readings: 514, averaged: true },
      "sensor.q|360|0": { ok: true, series: "4,5", readings: 2, averaged: false },
      "sensor.v|360|24": { ok: true, series: "7,8" },
      "sensor.bad|360|0": { ok: false, error: "recorder unavailable" },
    };
    const { series, readings } = collectSeriesResults(results);
    expect([...series.keys()]).toEqual(["sensor.v|360|0", "sensor.q|360|0", "sensor.v|360|24"]);
    expect(series.get("sensor.v|360|0")).toBe("1,2,3");
    expect(readings.get("sensor.v|360|0")).toEqual({ readings: 514, averaged: true });
    expect(readings.get("sensor.q|360|0")).toEqual({ readings: 2, averaged: false });
    expect(readings.has("sensor.v|360|24")).toBe(false);
    expect(readings.has("sensor.bad|360|0")).toBe(false);
  });

  it("hints only for an every-one chart whose latest fetch was averaged", () => {
    const averaged = { readings: 514, averaged: true };
    expect(everyReadingAveragedHint(true, averaged, "Last 6 hours")).toBe(
      "This span has 514 readings, more than 120, so they are averaged into 120 even slots to cover all 6 hours.",
    );
    expect(everyReadingAveragedHint(true, averaged, "Last hour")).toContain("to cover the whole hour.");
    expect(everyReadingAveragedHint(true, { readings: 80, averaged: false }, "Last 6 hours")).toBeUndefined();
    expect(everyReadingAveragedHint(true, undefined, "Last 6 hours")).toBeUndefined();
    expect(everyReadingAveragedHint(false, averaged, "Last 6 hours")).toBeUndefined();
  });
});
