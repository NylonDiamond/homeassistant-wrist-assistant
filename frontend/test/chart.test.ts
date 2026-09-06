// The chart layer: parsing one string into a series, the scale that series is
// drawn against, and the marks that come out of it.
//
// `chartNumbers` and `chartDomain` are ports of the Swift in the app repo
// (`CustomComplication.numbers(in:)` and `chartDomain`), and the cases here are
// deliberately the same ones `CustomComplicationChartTests` uses, so drift
// between the two implementations fails on both sides.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  addChartLabel,
  auditUnknownKeys,
  chartHistoryEntity,
  chartHistoryKey,
  chartHistoryPoints,
  chartHistoryRequests,
  chartHistorySignature,
  chartLabelsOf,
  encodeConfig,
  groupMembers,
  groupOf,
  literal,
  newConfig,
  newElement,
  parseConfig,
  removeElement,
  type ChartElement,
  type ChartStat,
  type CustomComplicationConfig,
  type Element,
  type Value,
  type ValueFormat,
} from "../src/model.js";
import { describeValue } from "../src/editors.js";
import { compile } from "../src/compiler.js";
import { renderLayout, type IconProvider } from "../src/renderer.js";
import { chartDomain, chartNumbers, resolveAll, type EntityState, type ResolvedChart, type ResolvedLayout } from "../src/resolver.js";

const noIcons: IconProvider = { render: () => undefined, available: () => false, names: () => undefined };

function flatten(node: unknown): string {
  if (node === undefined || node === null || node === nothing) return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  return String(node);
}

describe("chartNumbers", () => {
  it("treats commas, spaces and brackets as separators alike", () => {
    const expected = [13, 14, 16];
    expect(chartNumbers("13,14,16")).toEqual(expected);
    expect(chartNumbers("13 14 16")).toEqual(expected);
    expect(chartNumbers("[13, 14, 16]")).toEqual(expected);
    expect(chartNumbers("13ct 14ct 16ct")).toEqual(expected);
    expect(chartNumbers("€13; €14; €16")).toEqual(expected);
  });

  it("reads a dot as a decimal point and a comma never as one", () => {
    expect(chartNumbers("1.5,2.25")).toEqual([1.5, 2.25]);
    expect(chartNumbers("1,5")).toEqual([1, 5]);
  });

  it("only counts a sign where nothing numeric precedes it", () => {
    expect(chartNumbers("-4.5, 3")).toEqual([-4.5, 3]);
    expect(chartNumbers("12,-3,+7")).toEqual([12, -3, 7]);
    // The reason for that rule: a date must not read as negative numbers.
    expect(chartNumbers("2026-09-05")).toEqual([2026, 9, 5]);
  });

  it("ends a reading at a stray second dot instead of voiding it", () => {
    expect(chartNumbers("1.2.3")).toEqual([1.2, 0.3]);
  });

  it("reads nothing numeric as an empty series", () => {
    expect(chartNumbers("")).toEqual([]);
    expect(chartNumbers("unavailable")).toEqual([]);
    expect(chartNumbers("▁▂▃▄▅▆▇█")).toEqual([]);
  });

  it("caps a runaway template", () => {
    const huge = Array.from({ length: 500 }, (_, i) => i).join(",");
    expect(chartNumbers(huge)).toHaveLength(240);
    expect(chartNumbers(huge, 5)).toEqual([0, 1, 2, 3, 4]);
  });
});

describe("chartDomain", () => {
  const auto = { scale: "auto", minValue: 0, maxValue: 100, baseline: "lowest" } as const;

  it("fits the readings edge to edge", () => {
    expect(chartDomain([13, 14, 16, 30], auto)).toEqual({ min: 13, max: 30 });
  });

  it("stretches to include zero on a zero baseline", () => {
    expect(chartDomain([13, 14, 16], { ...auto, baseline: "zero" })).toEqual({ min: 0, max: 16 });
    expect(chartDomain([-4, -2, 3], { ...auto, baseline: "zero" })).toEqual({ min: -4, max: 3 });
  });

  it("ignores the readings on a fixed scale and survives a reversed pair", () => {
    expect(chartDomain([13, 14], { scale: "fixed", minValue: 100, maxValue: 0, baseline: "lowest" }))
      .toEqual({ min: 0, max: 100 });
  });

  it("gives a flat series a range to divide by", () => {
    const d = chartDomain([20, 20, 20], auto);
    expect(d.max).toBeGreaterThan(d.min);
  });
});

// ── resolve + draw ────────────────────────────────────────────────────────

const HIGH = "#FF6B35";
const LOW = "#32D74B";

function chartConfig(state: string, tweak: (p: ChartElement) => void = () => {}) {
  const cfg = newConfig("Prices", 0);
  const el = newElement("chart") as Extract<Element, { kind: "chart" }>;
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  el.payload.value = { kind: { kind: "entityState", entityId: "sensor.prices", displayName: "Prices", domain: "sensor" } };
  // These charts draw the sensor's own list of numbers. A new chart starts on
  // history, which would ask the recorder instead and draw nothing here.
  el.payload.historyMinutes = 0;
  tweak(el.payload);
  cfg.elements.push(el);
  return { cfg, id: el.payload.id, state };
}

function rectangular(cfg: CustomComplicationConfig, state: string): ResolvedLayout {
  const entityStates = new Map<string, EntityState>([
    ["sensor.prices", { entityId: "sensor.prices", state, domain: "sensor", iconName: "chart.bar" }],
  ]);
  return resolveAll(cfg, { entityStates, templateResults: new Map(), namedValues: cfg.values }).rectangular!;
}

function chartOf(layout: ResolvedLayout): ResolvedChart {
  const el = layout.elements.find((e) => e.kind === "chart");
  if (!el || el.kind !== "chart") throw new Error("no chart layer resolved");
  return el;
}

/** Every `<rect>` the layout drew, as numbers. The invisible full-frame hit box
 * each layer carries is dropped: it is chrome, not a bar. */
function rects(svg: string): { x: number; y: number; w: number; h: number }[] {
  const out: { x: number; y: number; w: number; h: number }[] = [];
  for (const m of svg.matchAll(/<rect x="?([-\d.]+)"? y="?([-\d.]+)"? width="?([-\d.]+)"? height="?([-\d.]+)"?/g)) {
    out.push({ x: Number(m[1]), y: Number(m[2]), w: Number(m[3]), h: Number(m[4]) });
  }
  return out.filter((r) => !(r.x === 0 && r.y === 0));
}

describe("resolving a chart", () => {
  it("marks the first occurrence of each end", () => {
    const { cfg, state } = chartConfig("15,13,14,17,19,22,24,28,30", (p) => { p.highlight = "both"; });
    const chart = chartOf(rectangular(cfg, state));
    expect(chart.values).toEqual([15, 13, 14, 17, 19, 22, 24, 28, 30]);
    expect(chart.highIndex).toBe(8);
    expect(chart.lowIndex).toBe(1);
  });

  it("never marks one reading as both ends", () => {
    const { cfg, state } = chartConfig("20,20,20", (p) => { p.highlight = "both"; });
    const chart = chartOf(rectangular(cfg, state));
    expect(chart.highIndex).toBe(0);
    expect(chart.lowIndex).toBeUndefined();
  });

  it("trims to the limit from the end it was told to", () => {
    const { cfg, state } = chartConfig("1,2,3,4,5", (p) => { p.limit = 3; p.takeFromEnd = true; });
    expect(chartOf(rectangular(cfg, state)).values).toEqual([3, 4, 5]);
  });
});

// ── history ───────────────────────────────────────────────────────────────
//
// The cases here mirror the "History" section of `CustomComplicationChartTests`
// in the app repo. The shared fixture `chart_series.json` covers the resolved
// output; these cover the decisions around it.

describe("chart history", () => {
  function historyChart(tweak: (p: ChartElement) => void = () => {}) {
    const cfg = newConfig("Volts", 0);
    const el = newElement("chart") as Extract<Element, { kind: "chart" }>;
    el.payload.value = { kind: { kind: "entityState", entityId: "sensor.voltage", displayName: "Voltage", domain: "sensor" } };
    el.payload.historyMinutes = 360;
    el.payload.historyPoints = 24;
    tweak(el.payload);
    cfg.elements.push(el);
    return { cfg, payload: el.payload };
  }

  it("asks for history only when a span and an entity are both set", () => {
    const plain = newElement("chart") as Extract<Element, { kind: "chart" }>;
    expect(chartHistoryKey(plain.payload)).toBeUndefined();

    // A span with the default typed-in list: a string has no past.
    plain.payload.historyMinutes = 360;
    expect(chartHistoryKey(plain.payload)).toBeUndefined();

    const { payload } = historyChart();
    expect(chartHistoryEntity(payload)).toBe("sensor.voltage");
    expect(chartHistoryKey(payload)).toBe("sensor.voltage|360|24");

    payload.historyMinutes = 0;
    expect(chartHistoryKey(payload)).toBeUndefined();
  });

  it("makes a wider window a different question, not a stale answer", () => {
    const { payload } = historyChart();
    const six = chartHistoryKey(payload);
    payload.historyMinutes = 720;
    expect(chartHistoryKey(payload)).not.toBe(six);
  });

  it("clamps the point count the same way the watch and the server do", () => {
    const { payload } = historyChart((p) => { p.historyPoints = 5000; });
    expect(chartHistoryPoints(payload)).toBe(120);
    payload.historyPoints = 1;
    expect(chartHistoryPoints(payload)).toBe(2);
    // The clamp is in the key, so the panel asks for what it will draw.
    expect(chartHistoryKey(payload)).toBe("sensor.voltage|360|2");
    // Zero is a different question, not too few: every recorded reading.
    payload.historyPoints = 0;
    expect(chartHistoryPoints(payload)).toBe(0);
    expect(chartHistoryKey(payload)).toBe("sensor.voltage|360|0");
  });

  it("collects one request per distinct question", () => {
    const { cfg } = historyChart();
    const twin = newElement("chart") as Extract<Element, { kind: "chart" }>;
    twin.payload.value = { kind: { kind: "entityState", entityId: "sensor.voltage", displayName: "Voltage", domain: "sensor" } };
    twin.payload.historyMinutes = 360;
    twin.payload.historyPoints = 24;
    twin.payload.style = "line";
    cfg.elements.push(twin);

    const wider = newElement("chart") as Extract<Element, { kind: "chart" }>;
    wider.payload.value = { kind: { kind: "entityState", entityId: "sensor.voltage", displayName: "Voltage", domain: "sensor" } };
    wider.payload.historyMinutes = 1440;
    wider.payload.historyPoints = 24;
    cfg.elements.push(wider);

    const requests = chartHistoryRequests(cfg);
    expect(requests.map((r) => r.key).sort()).toEqual(["sensor.voltage|1440|24", "sensor.voltage|360|24"]);
    expect(requests[0]).toMatchObject({ entityId: "sensor.voltage", minutes: 360, points: 24 });
  });

  it("draws the fetched series and never the entity's own state", () => {
    const { cfg } = historyChart((p) => { p.historyPoints = 6; });
    const entityStates = new Map<string, EntityState>([
      ["sensor.voltage", { entityId: "sensor.voltage", state: "3068", domain: "sensor", iconName: "bolt" }],
    ]);
    const layout = resolveAll(cfg, {
      entityStates,
      templateResults: new Map(),
      historySeries: new Map([["sensor.voltage|360|6", "3068,3071,3069,3075,3063,3070"]]),
      namedValues: cfg.values,
    }).rectangular!;
    expect(chartOf(layout).values).toEqual([3068, 3071, 3069, 3075, 3063, 3070]);
  });

  it("is empty before the first fetch, not one bar of the current state", () => {
    // The behaviour the whole feature exists to replace: a plain sensor reads
    // 3068, and drawing that single number as a chart is the confusing part.
    const { cfg } = historyChart();
    const entityStates = new Map<string, EntityState>([
      ["sensor.voltage", { entityId: "sensor.voltage", state: "3068", domain: "sensor", iconName: "bolt" }],
    ]);
    const layout = resolveAll(cfg, {
      entityStates,
      templateResults: new Map(),
      namedValues: cfg.values,
    }).rectangular!;
    expect(chartOf(layout).values).toEqual([]);
  });

  it("leaves the value in charge when the chart names no entity", () => {
    const cfg = newConfig("Volts", 0);
    const el = newElement("chart") as Extract<Element, { kind: "chart" }>;
    el.payload.value = literal("1,2,3");
    el.payload.historyMinutes = 720;
    cfg.elements.push(el);

    const layout = resolveAll(cfg, {
      entityStates: new Map(),
      templateResults: new Map(),
      namedValues: cfg.values,
    }).rectangular!;
    expect(chartOf(layout).values).toEqual([1, 2, 3]);
    expect(chartHistoryRequests(cfg)).toEqual([]);
  });

  // The panel schedules a refetch by comparing this between edits. It used to
  // compare only the compiled Jinja document, which a history chart never
  // contributes to, so changing a span left the preview on the old series until
  // the 30-second heartbeat came round.
  it("changes its signature whenever the question changes", () => {
    const { cfg, payload } = historyChart();
    const before = chartHistorySignature(cfg);
    expect(before).not.toBe("");

    payload.historyMinutes = 4320;
    expect(chartHistorySignature(cfg)).not.toBe(before);

    payload.historyMinutes = 360;
    expect(chartHistorySignature(cfg)).toBe(before);

    payload.historyPoints = 48;
    expect(chartHistorySignature(cfg)).not.toBe(before);

    payload.historyPoints = 24;
    payload.value = { kind: { kind: "entityState", entityId: "sensor.other", displayName: "Other", domain: "sensor" } };
    expect(chartHistorySignature(cfg)).not.toBe(before);
  });

  it("has an empty signature when nothing draws history", () => {
    // Compiling this config produces no Jinja document either, which is exactly
    // why the two have to be watched separately rather than one standing in.
    const cfg = newConfig("Prices", 0);
    cfg.elements.push(newElement("chart"));
    expect(chartHistorySignature(cfg)).toBe("");
  });

  it("does not change its signature for an edit that asks the same question", () => {
    const { cfg, payload } = historyChart();
    const before = chartHistorySignature(cfg);
    payload.style = "area";
    payload.highlight = "both";
    payload.colorSlot.baseColorHex = "#FF0000";
    expect(chartHistorySignature(cfg)).toBe(before);
  });

  it("survives an encode and parse round trip", () => {
    const { cfg } = historyChart((p) => { p.historyMinutes = 1440; p.historyPoints = 30; });
    const back = parseConfig(encodeConfig(cfg) as Record<string, unknown>);
    const el = back.elements[0]!;
    expect(el.kind).toBe("chart");
    if (el.kind !== "chart") throw new Error("unreachable");
    expect(el.payload.historyMinutes).toBe(1440);
    expect(el.payload.historyPoints).toBe(30);
  });
});

describe("drawing a chart", () => {
  const prices = "15,13,14,17,19,22,24,28,30";

  function draw(state: string, tweak?: (p: ChartElement) => void): string {
    const { cfg } = chartConfig(state, tweak);
    return flatten(renderLayout(rectangular(cfg, state), { icons: noIcons }));
  }

  it("draws one bar per reading, tallest for the highest", () => {
    const bars = rects(draw(prices));
    expect(bars).toHaveLength(9);
    const heights = bars.map((b) => b.h);
    expect(heights.indexOf(Math.max(...heights))).toBe(8); // the 30
    expect(heights.indexOf(Math.min(...heights))).toBe(1); // the 13
  });

  it("keeps a visible stub under the lowest reading", () => {
    const bars = rects(draw(prices));
    expect(bars[1]!.h).toBeGreaterThan(0);
    // A flat run must not vanish either.
    for (const b of rects(draw("20,20,20"))) expect(b.h).toBeGreaterThan(0);
  });

  it("keeps every bar inside the layer's frame", () => {
    const bars = rects(draw(prices));
    const bottom = Math.max(...bars.map((b) => b.y + b.h));
    for (const b of bars) {
      expect(b.y).toBeGreaterThanOrEqual(-0.001);
      expect(b.y + b.h).toBeLessThanOrEqual(bottom + 0.001);
      expect(b.h).toBeGreaterThan(0);
    }
    // Bars sit left to right in reading order and never overlap.
    for (let i = 1; i < bars.length; i++) expect(bars[i]!.x).toBeGreaterThanOrEqual(bars[i - 1]!.x + bars[i - 1]!.w - 0.001);
  });

  it("paints the marked ends in their own colours", () => {
    const svg = draw(prices, (p) => { p.highlight = "both"; });
    expect(svg).toContain(HIGH);
    expect(svg).toContain(LOW);
    expect(svg).not.toContain(HIGH.toLowerCase() + "x"); // guard against a substring match
  });

  it("draws a triangle over the highest and a dot over the lowest", () => {
    const svg = draw(prices, (p) => { p.highlight = "both"; p.marker = "pointer"; });
    expect(svg).toMatch(/<path d=M[\d.]+ [\d.]+ L/); // the triangle
    expect(svg).toContain("<circle");
  });

  it("draws no marker when nothing is highlighted", () => {
    const svg = draw(prices);
    expect(svg).not.toContain("<circle");
    expect(svg).not.toContain(HIGH);
  });

  it("draws a line and an area fill instead of bars", () => {
    const line = draw(prices, (p) => { p.style = "line"; });
    expect(rects(line)).toHaveLength(0);
    expect(line).toContain("stroke-linejoin");

    const area = draw(prices, (p) => { p.style = "area"; });
    expect(area).toContain("fill-opacity=0.28");
  });

  it("hangs a negative reading below the zero line", () => {
    const svg = draw("-4,-2,3", (p) => { p.baseline = "zero"; });
    const bars = rects(svg);
    expect(bars).toHaveLength(3);
    // The two negatives start where zero falls and grow down; the positive ends there.
    expect(bars[0]!.y).toBeCloseTo(bars[1]!.y, 6);
    expect(bars[2]!.y + bars[2]!.h).toBeCloseTo(bars[0]!.y, 6);
  });

  it("draws nothing at all when the series is empty", () => {
    expect(rects(draw("unavailable"))).toHaveLength(0);
  });
});

/** Turn a chart into a colour table: `[upTo, colour]` steps plus the rest. */
function band(p: ChartElement, table: [number, string][], above = "#FF0000") {
  p.coloring = "bands";
  p.bands = table.map(([upTo, colorHex], i) => ({ id: `B${i}`, upTo, colorHex }));
  p.bandAboveColorHex = above;
}

describe("colouring a chart by value", () => {
  it("carries no per-reading colours while the chart is one colour", () => {
    const { cfg, state } = chartConfig("1,5,9");
    expect(chartOf(rectangular(cfg, state)).pointColorHexes).toEqual([]);
  });

  it("gives each reading the colour of the band it falls in", () => {
    const { cfg, state } = chartConfig("5, 10, 15, 20, 25",
      (p) => band(p, [[10, "#00FF00"], [20, "#9A6BFF"]]));
    // A band says where it ends, so a reading sitting exactly on a step belongs to
    // that step rather than to the one after it.
    expect(chartOf(rectangular(cfg, state)).pointColorHexes)
      .toEqual(["#00FF00", "#00FF00", "#9A6BFF", "#9A6BFF", "#FF0000"]);
  });

  it("takes as many steps as the table has", () => {
    const { cfg, state } = chartConfig("5, 15, 25, 35",
      (p) => band(p, [[10, "#FF0000"], [20, "#FF9500"], [30, "#FFD60A"]], "#32D74B"));
    expect(chartOf(rectangular(cfg, state)).pointColorHexes)
      .toEqual(["#FF0000", "#FF9500", "#FFD60A", "#32D74B"]);
  });

  it("reads steps typed out of order lowest first anyway", () => {
    const { cfg, state } = chartConfig("5, 15, 25",
      (p) => band(p, [[20, "#FF9500"], [10, "#FF0000"]], "#32D74B"));
    expect(chartOf(rectangular(cfg, state)).pointColorHexes)
      .toEqual(["#FF0000", "#FF9500", "#32D74B"]);
  });

  it("leaves a chart with an empty table one colour", () => {
    const { cfg, state } = chartConfig("5, 15, 25", (p) => { p.coloring = "bands"; });
    expect(chartOf(rectangular(cfg, state)).pointColorHexes).toEqual([]);
  });

  it("has no colours to hand out when the series is empty", () => {
    const { cfg, state } = chartConfig("unavailable",
      (p) => band(p, [[10, "#00FF00"]]));
    expect(chartOf(rectangular(cfg, state)).pointColorHexes).toEqual([]);
  });

  it("paints each bar its own band and lets a highlight win over it", () => {
    const { cfg } = chartConfig("5, 15, 25", (p) => {
      band(p, [[10, "#00FF00"], [20, "#9A6BFF"]]);
      p.highlight = "highest";
      p.highColorHex = "#FF6B35";
    });
    const svg = flatten(renderLayout(rectangular(cfg, "5, 15, 25"), { icons: noIcons }));
    expect(svg).toContain("#00FF00");
    // The tallest reading is past the last band, but the highlight is the more
    // specific statement, so its colour is what lands.
    expect(svg).not.toContain("#FF0000");
    expect(svg).toContain("#FF6B35");
  });

  it("splits a banded line into one stroke per leg", () => {
    const { cfg } = chartConfig("5, 15, 25", (p) => {
      p.style = "line";
      band(p, [[10, "#00FF00"], [20, "#9A6BFF"]]);
    });
    const svg = flatten(renderLayout(rectangular(cfg, "5, 15, 25"), { icons: noIcons }));
    // Two readings make one leg, three make two. Each takes the band of the reading
    // it arrives at, so the last leg carries the newest reading's colour.
    expect(svg.match(/stroke-linejoin/g) ?? []).toHaveLength(2);
    expect(svg).toContain("#FF0000");
  });

  it("leaves an area's fill one colour until asked otherwise", () => {
    const { cfg } = chartConfig("5, 15, 25", (p) => {
      p.style = "area";
      band(p, [[10, "#00FF00"], [20, "#9A6BFF"]]);
      p.colorSlot.baseColorHex = "#123456";
    });
    const svg = flatten(renderLayout(rectangular(cfg, "5, 15, 25"), { icons: noIcons }));
    // One wash, in the layer's own colour, under a banded stroke.
    expect(svg.match(/fill-opacity=0\.28/g) ?? []).toHaveLength(1);
    expect(svg).toContain("#123456");
  });

  it("bands an area's fill when asked, one quad per leg", () => {
    const { cfg } = chartConfig("5, 15, 25", (p) => {
      p.style = "area";
      band(p, [[10, "#00FF00"], [20, "#9A6BFF"]]);
      p.fillBands = true;
    });
    const svg = flatten(renderLayout(rectangular(cfg, "5, 15, 25"), { icons: noIcons }));
    // Two legs, so two quads, each at the same wash opacity as the single fill.
    expect(svg.match(/fill-opacity=0\.28/g) ?? []).toHaveLength(2);
  });

  it("reads the two-bound band shape forward into a table", () => {
    // What the first cut of banded colour wrote, on the morning of 2026-09-05.
    const doc = {
      schemaVersion: 6,
      id: "AAAAAAAA-0000-4000-8000-0000000000FF",
      name: "Old",
      slotIndex: 0,
      supportedFamilies: ["rectangular"],
      values: [],
      elements: [{
        kind: "chart",
        payload: {
          id: "EEEEEEEE-0000-4000-8000-0000000000FF",
          value: { kind: { kind: "literal", value: "5,15,25" } },
          colorSlot: { baseColorHex: "#9A6BFF" },
          coloring: "bands",
          bandLowerBound: 10,
          bandUpperBound: 20,
          bandLowColorHex: "#00FF00",
          bandHighColorHex: "#FF0000",
        },
      }],
      perFamily: [],
      dataSources: [],
      refreshMinutes: 15,
      tapAction: { type: "refresh" },
    };
    const parsed = parseConfig(doc);
    const el = parsed.elements[0]!;
    if (el.kind !== "chart") throw new Error("expected a chart");
    expect(el.payload.bands.map((b): [number, string] => [b.upTo, b.colorHex]))
      .toEqual([[10, "#00FF00"], [20, "#9A6BFF"]]);
    expect(el.payload.bandAboveColorHex).toBe("#FF0000");
    // And the retired keys are not written back out.
    const encoded = encodeConfig(parsed) as Record<string, unknown>;
    const payload = (encoded.elements as { payload: Record<string, unknown> }[])[0]!.payload;
    expect(payload.bandLowerBound).toBeUndefined();
    expect(payload.bandLowColorHex).toBeUndefined();
  });
});

describe("a chart's numbers", () => {
  // A text layer beside the chart, printing one of its numbers. The text sits
  // *below* the chart in the list on purpose: the chart has to be settled
  // before its readers, whatever order the two are in.
  function withStat(state: string, stat: ChartStat, tweak: (p: ChartElement) => void = () => {}, format?: ValueFormat) {
    const { cfg, id } = chartConfig(state, tweak);
    const text = newElement("text") as Extract<Element, { kind: "text" }>;
    const value: Value = { kind: { kind: "chartStat", layer: id, stat } };
    if (format) value.format = format;
    text.payload.value = value;
    cfg.elements.unshift(text);
    return { cfg, state, chartId: id, textId: text.payload.id };
  }

  function printed(cfg: CustomComplicationConfig, state: string, unit?: string): string {
    const entityStates = new Map<string, EntityState>([
      ["sensor.prices", { entityId: "sensor.prices", state, domain: "sensor", iconName: "chart.bar", unitOfMeasurement: unit }],
    ]);
    const layout = resolveAll(cfg, { entityStates, templateResults: new Map(), namedValues: cfg.values }).rectangular!;
    const el = layout.elements.find((e) => e.kind === "text");
    if (!el || el.kind !== "text") throw new Error("no text layer resolved");
    return el.text;
  }

  const stat = (state: string, s: ChartStat, tweak?: (p: ChartElement) => void, format?: ValueFormat, unit?: string) => {
    const { cfg } = withStat(state, s, tweak, format);
    return printed(cfg, state, unit);
  };

  it("reads every stat off the series the chart draws", () => {
    expect(stat("13, 20, 30", "latest")).toBe("30");
    expect(stat("13, 30, 20", "highest")).toBe("30");
    expect(stat("20, 13, 30", "lowest")).toBe("13");
    expect(stat("10, 20, 30", "average")).toBe("20");
  });

  it("prints the ends of the scale from the domain, not the readings", () => {
    expect(stat("13, 20, 30", "top")).toBe("30");
    expect(stat("13, 20, 30", "bottom")).toBe("13");
    const fixed = (p: ChartElement) => { p.scale = "fixed"; p.minValue = 0; p.maxValue = 50; };
    expect(stat("13, 20, 30", "top", fixed)).toBe("50");
    expect(stat("13, 20, 30", "bottom", fixed)).toBe("0");
  });

  it("takes its decimals from the span, so every number off one chart has one shape", () => {
    expect(stat("13, 30", "top")).toBe("30");
    // A spread of 0.4 would otherwise print "21" at both ends.
    expect(stat("21.1, 21.5", "top")).toBe("21.50");
    expect(stat("21.1, 21.5", "bottom")).toBe("21.10");
    expect(stat("9, 11, 12", "latest")).toBe("12.0");
  });

  it("follows the trimmed series, because the number has to name what is on screen", () => {
    const trim = (p: ChartElement) => { p.limit = 2; p.takeFromEnd = false; };
    expect(stat("13, 20, 30", "latest", trim)).toBe("20.0");
    expect(stat("13, 20, 30", "highest", trim)).toBe("20.0");
  });

  it("prints the placeholder when there is nothing to read", () => {
    expect(stat("unavailable", "latest")).toBe("--");
    expect(stat("", "average")).toBe("--");
    expect(stat("", "top")).toBe("--");
  });

  it("borrows the chart's entity's unit, and a format can round it", () => {
    expect(stat("119.2, 119.6", "latest", undefined, { useEntityUnit: true }, "V")).toBe("119.60 V");
    expect(stat("119.2, 119.6", "latest", undefined, { decimals: 1, useEntityUnit: true }, "V")).toBe("119.6 V");
  });

  it("prints the placeholder for a chart the document no longer has", () => {
    const { cfg, chartId } = withStat("1,2,3", "latest");
    cfg.elements = cfg.elements.filter((e) => e.payload.id !== chartId);
    expect(printed(cfg, "1,2,3")).toBe("--");
  });

  it("is local: it compiles to no template and no fetch of its own", () => {
    const { cfg } = withStat("1,2,3", "latest");
    const compiled = compile(cfg);
    expect([...compiled.entities.keys()]).toEqual(["sensor.prices"]);
    expect(compiled.expressions.size).toBe(0);
  });

  it("survives an encode and parse round trip in the flat wire shape", () => {
    const { cfg, chartId } = withStat("1,2,3", "average");
    const encoded = encodeConfig(cfg) as { elements: { payload: { value: { kind: Record<string, unknown> } } }[] };
    expect(encoded.elements[0]!.payload.value.kind).toEqual({ kind: "chartStat", layer: chartId, stat: "average" });
    const back = parseConfig(encodeConfig(cfg)).elements[0]!;
    if (back.kind !== "text") throw new Error("expected a text layer");
    expect(back.payload.value.kind).toEqual({ kind: "chartStat", layer: chartId, stat: "average" });
    expect(auditUnknownKeys(encodeConfig(cfg))).toEqual([]);
  });
});

describe("adding a chart's numbers in the editor", () => {
  it("adds a text layer in the chart's group, directly above the chart", () => {
    const { cfg, id } = chartConfig("13,20,30");
    const shape = newElement("shape");
    cfg.elements.push(shape);
    const labelId = addChartLabel(cfg, id, "top")!;
    expect(labelId).toBeDefined();
    expect(cfg.elements.map((e) => e.payload.id)).toEqual([id, labelId, shape.payload.id]);
    const label = chartLabelsOf(cfg, id)[0]!;
    expect(label.payload.value.kind).toEqual({ kind: "chartStat", layer: id, stat: "top" });
    const group = groupOf(cfg, id);
    expect(group).toBeDefined();
    expect(group!.name).toBe("Prices");
    // Unlocked, so the new number can be dragged into place without towing
    // the chart. Selecting the group row still moves everything together.
    expect(group!.locked).toBe(false);
    expect(groupMembers(cfg, group!.id).map((m) => m.payload.id).sort()).toEqual([id, labelId].sort());
  });

  it("joins the chart's existing group instead of making a second one", () => {
    const { cfg, id } = chartConfig("13,20,30");
    const a = addChartLabel(cfg, id, "top")!;
    const b = addChartLabel(cfg, id, "bottom")!;
    expect(cfg.groups).toHaveLength(1);
    expect(groupMembers(cfg, cfg.groups![0]!.id).map((m) => m.payload.id).sort()).toEqual([id, a, b].sort());
  });

  it("gives the newest reading the entity's unit by default and the rest none", () => {
    const { cfg, id } = chartConfig("13,20,30");
    addChartLabel(cfg, id, "latest");
    addChartLabel(cfg, id, "highest");
    const byStat = (stat: string) => chartLabelsOf(cfg, id).find((l) => (l.payload.value.kind as { stat?: string }).stat === stat)!;
    expect(byStat("latest").payload.value.format).toEqual({ useEntityUnit: true });
    expect(byStat("highest").payload.value.format).toBeUndefined();
  });

  it("refuses a layer that is not a chart", () => {
    const cfg = newConfig("Test", 0);
    const text = newElement("text");
    cfg.elements.push(text);
    expect(addChartLabel(cfg, text.payload.id, "latest")).toBeUndefined();
    expect(cfg.elements).toHaveLength(1);
  });

  it("goes when its chart goes", () => {
    const { cfg, id } = chartConfig("13,20,30");
    const other = newElement("text");
    cfg.elements.push(other);
    addChartLabel(cfg, id, "latest");
    addChartLabel(cfg, id, "top");
    removeElement(cfg, id);
    expect(cfg.elements.map((e) => e.payload.id)).toEqual([other.payload.id]);
    expect(cfg.groups).toBeUndefined();
  });

  it("names the number after its chart", () => {
    const { cfg, id } = chartConfig("13,20,30");
    const labelId = addChartLabel(cfg, id, "latest")!;
    const label = cfg.elements.find((e) => e.payload.id === labelId)!;
    if (label.kind !== "text") throw new Error("expected a text layer");
    expect(describeValue(label.payload.value, { elements: cfg.elements })).toBe("newest reading of Prices (with unit)");
    expect(describeValue({ kind: { kind: "chartStat", layer: "", stat: "top" } })).toBe("top of the scale (no chart chosen)");
    expect(describeValue({ kind: { kind: "chartStat", layer: "nope", stat: "average" } }, { elements: cfg.elements })).toBe("average reading of a missing chart");
  });
});

describe("reading the built-in numbers forward", () => {
  // What a chart saved on the afternoon of 2026-09-05 carried: its numbers as
  // keys on the chart itself.
  const doc = (payload: Record<string, unknown>) => ({
    schemaVersion: 6,
    id: "AAAAAAAA-0000-4000-8000-0000000000FE",
    name: "Old",
    slotIndex: 0,
    supportedFamilies: ["rectangular"],
    values: [],
    elements: [{
      kind: "chart",
      payload: {
        id: "EEEEEEEE-0000-4000-8000-0000000000FE",
        value: { kind: { kind: "entityState", entityId: "sensor.prices", displayName: "Prices", domain: "sensor" } },
        frame: { x: 0.1, y: 0.2, width: 0.8, height: 0.6, rotationDegrees: 0 },
        ...payload,
      },
    }],
    perFamily: [],
    dataSources: [],
    refreshMinutes: 15,
    tapAction: { type: "refresh" },
  });

  it("turns the scale and newest labels into text layers in the chart's group", () => {
    const cfg = parseConfig(doc({
      scaleLabels: "range",
      topLabelStyle: { fontSize: 11, colorHex: "#FF0000" },
      bottomLabelStyle: { fontSize: 6, colorHex: "#00FF00" },
      latestLabel: "end",
      latestLabelStyle: { fontSize: 14, colorHex: "#0000FF" },
    }));
    const chartId = "EEEEEEEE-0000-4000-8000-0000000000FE";
    const labels = chartLabelsOf(cfg, chartId);
    expect(labels.map((l) => (l.payload.value.kind as { stat: string }).stat)).toEqual(["top", "bottom", "latest"]);
    expect(labels.map((l) => l.payload.fontSize)).toEqual([11, 6, 14]);
    expect(labels.map((l) => l.payload.colorSlot.baseColorHex)).toEqual(["#FF0000", "#00FF00", "#0000FF"]);
    // Every number sits inside the face, beside the chart.
    for (const l of labels) {
      expect(l.payload.frame.x).toBeGreaterThanOrEqual(0);
      expect(l.payload.frame.x + l.payload.frame.width).toBeLessThanOrEqual(1);
    }
    const group = groupOf(cfg, chartId)!;
    expect(group.name).toBe("Prices");
    expect(groupMembers(cfg, group.id)).toHaveLength(4);
  });

  it("falls back to the first cut's single colour when a label has no style", () => {
    const cfg = parseConfig(doc({ scaleLabels: "top", scaleLabelColorHex: "#ABCDEF" }));
    const [top] = chartLabelsOf(cfg, "EEEEEEEE-0000-4000-8000-0000000000FE");
    expect(top!.payload.colorSlot.baseColorHex).toBe("#ABCDEF");
    expect(top!.payload.fontSize).toBe(8);
  });

  it("puts a capsule under a number that had a plate", () => {
    const cfg = parseConfig(doc({
      latestLabel: "corner",
      latestLabelStyle: { fontSize: 10, colorHex: "#FFFFFF", pillColorHex: "#0A84FF66" },
    }));
    const [chart, pill, text] = cfg.elements;
    expect(chart!.kind).toBe("chart");
    expect(pill!.kind).toBe("shape");
    if (pill!.kind !== "shape") throw new Error("unreachable");
    expect(pill!.payload.kind).toBe("capsule");
    expect(pill!.payload.colorSlot.baseColorHex).toBe("#0A84FF66");
    expect(pill!.payload.frame).toEqual(text!.payload.frame);
    expect(groupMembers(cfg, groupOf(cfg, chart!.payload.id)!.id)).toHaveLength(3);
  });

  it("leaves a chart that printed nothing alone, and drops the old keys on save", () => {
    const untouched = parseConfig(doc({ scaleLabels: "none", latestLabel: "none", topLabelStyle: { fontSize: 8, colorHex: "#FFFFFF" } }));
    expect(untouched.elements).toHaveLength(1);
    expect(untouched.groups).toBeUndefined();
    const raw = doc({ scaleLabels: "range", latestLabel: "end" });
    expect(auditUnknownKeys(raw)).toEqual([]);
    const encoded = encodeConfig(parseConfig(raw)) as { elements: { payload: Record<string, unknown> }[] };
    const chart = encoded.elements[0]!.payload;
    expect(chart.scaleLabels).toBeUndefined();
    expect(chart.latestLabel).toBeUndefined();
    expect(chart.topLabelStyle).toBeUndefined();
  });
});
