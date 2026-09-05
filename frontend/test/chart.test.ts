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
  chartHistoryEntity,
  chartHistoryKey,
  chartHistoryPoints,
  chartHistoryRequests,
  chartHistorySignature,
  encodeConfig,
  literal,
  newConfig,
  newElement,
  parseConfig,
  type ChartElement,
  type CustomComplicationConfig,
  type Element,
} from "../src/model.js";
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
    payload.historyPoints = 0;
    expect(chartHistoryPoints(payload)).toBe(2);
    // The clamp is in the key, so the panel asks for what it will draw.
    expect(chartHistoryKey(payload)).toBe("sensor.voltage|360|2");
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

describe("printing the newest reading", () => {
  it("prints nothing by default", () => {
    const { cfg, state } = chartConfig("1,2,3");
    expect(chartOf(rectangular(cfg, state)).latestLabel).toBeUndefined();
  });

  it("prints the last reading, formatted like the scale", () => {
    const label = (state: string) =>
      chartOf(rectangular(chartConfig(state, (p) => { p.latestLabel = "corner"; }).cfg, state)).latestLabel;
    expect(label("13, 20, 30")).toBe("30");
    expect(label("9, 11, 12")).toBe("12.0");
  });

  it("follows the trimmed series, not the raw one", () => {
    const { cfg, state } = chartConfig("13, 20, 30", (p) => {
      p.latestLabel = "end";
      p.limit = 2;
    });
    // 20 is the newest thing drawn, and the trim also narrows the span to 7,
    // which is what puts a decimal on it.
    expect(chartOf(rectangular(cfg, state)).latestLabel).toBe("20.0");
  });

  it("takes the newest reading's own band colour", () => {
    const { cfg, state } = chartConfig("5, 15, 25", (p) => {
      band(p, [[10, "#00FF00"], [20, "#9A6BFF"]]);
      p.latestLabel = "corner";
    });
    expect(chartOf(rectangular(cfg, state)).latestLabelColorHex).toBe("#FF0000");

    const plain = chartConfig("5, 15, 25", (p) => {
      p.latestLabel = "corner";
      p.scaleLabelColorHex = "#ABCDEF";
    });
    expect(chartOf(rectangular(plain.cfg, plain.state)).latestLabelColorHex).toBe("#ABCDEF");
  });

  it("draws it against the right-hand edge", () => {
    const { cfg } = chartConfig("13,20,30", (p) => { p.latestLabel = "corner"; });
    const svg = flatten(renderLayout(rectangular(cfg, "13,20,30"), { icons: noIcons }));
    expect(svg).toContain(">30<");
  });

  it("prints nothing when there is nothing to draw", () => {
    const { cfg, state } = chartConfig("unavailable", (p) => { p.latestLabel = "corner"; });
    expect(chartOf(rectangular(cfg, state)).latestLabel).toBeUndefined();
  });
});

describe("printing a chart's scale", () => {
  it("prints nothing by default, so an existing chart is untouched", () => {
    const { cfg, state } = chartConfig("1,2,3");
    const chart = chartOf(rectangular(cfg, state));
    expect(chart.topLabel).toBeUndefined();
    expect(chart.bottomLabel).toBeUndefined();
  });

  it("prints the top of the range only", () => {
    const { cfg, state } = chartConfig("13, 20, 30", (p) => { p.scaleLabels = "top"; });
    const chart = chartOf(rectangular(cfg, state));
    expect(chart.topLabel).toBe("30");
    expect(chart.bottomLabel).toBeUndefined();
  });

  it("prints the domain rather than the readings", () => {
    const { cfg, state } = chartConfig("13, 20, 30", (p) => {
      p.scaleLabels = "range";
      p.scale = "fixed";
      p.minValue = 0;
      p.maxValue = 50;
    });
    const chart = chartOf(rectangular(cfg, state));
    expect(chart.topLabel).toBe("50");
    expect(chart.bottomLabel).toBe("0");
  });

  it("takes its decimals from the span, so both ends carry one shape", () => {
    const label = (state: string) =>
      chartOf(rectangular(chartConfig(state, (p) => { p.scaleLabels = "range"; }).cfg, state));
    expect(label("13, 30").topLabel).toBe("30");
    // A spread of 0.4 would otherwise print "21" at both ends.
    expect(label("21.1, 21.5").topLabel).toBe("21.50");
    expect(label("21.1, 21.5").bottomLabel).toBe("21.10");
    expect(label("9, 12").topLabel).toBe("12.0");
  });

  it("prints no numbers when there is nothing to draw", () => {
    const { cfg, state } = chartConfig("unavailable", (p) => { p.scaleLabels = "range"; });
    expect(chartOf(rectangular(cfg, state)).topLabel).toBeUndefined();
  });

  it("gives the labels a gutter the bars then stay out of", () => {
    const plain = rects(flatten(renderLayout(
      rectangular(chartConfig("13,20,30").cfg, "13,20,30"), { icons: noIcons })));
    const { cfg } = chartConfig("13,20,30", (p) => { p.scaleLabels = "range"; });
    const svg = flatten(renderLayout(rectangular(cfg, "13,20,30"), { icons: noIcons }));
    const labelled = rects(svg);

    expect(svg).toContain(">30<");
    expect(svg).toContain(">13<");
    // The strip comes out of the plot, so the first bar starts further right and
    // every bar is narrower than it was without the numbers.
    expect(labelled[0]!.x).toBeGreaterThan(plain[0]!.x);
    expect(labelled[0]!.w).toBeLessThan(plain[0]!.w);
  });

  it("costs the plot nothing when the labels sit over the chart", () => {
    const plain = rects(flatten(renderLayout(
      rectangular(chartConfig("13,20,30").cfg, "13,20,30"), { icons: noIcons })));
    const { cfg } = chartConfig("13,20,30", (p) => {
      p.scaleLabels = "range";
      p.scaleLabelPlacement = "overlay";
    });
    const svg = flatten(renderLayout(rectangular(cfg, "13,20,30"), { icons: noIcons }));
    const overlaid = rects(svg);

    // Same numbers, in the same place a gutter would have put them, but the bars
    // are exactly where they were before the labels existed.
    expect(svg).toContain(">30<");
    expect(overlaid[0]!.x).toBeCloseTo(plain[0]!.x, 6);
    expect(overlaid[0]!.w).toBeCloseTo(plain[0]!.w, 6);
  });
});
