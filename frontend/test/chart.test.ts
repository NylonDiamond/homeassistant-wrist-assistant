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
  addChartSeries,
  auditUnknownKeys,
  CHART_END_MARKERS,
  chartEndMarkers,
  setChartEndMarkers,
  type ChartEndMarkers,
  type ChartMarker,
  chartHistoryEntity,
  chartHistoryKey,
  chartHistoryPoints,
  chartHistoryRequests,
  chartHistorySignature,
  chartStatisticsEntity,
  chartStatisticsKey,
  chartStatisticsRequests,
  chartLabelsOf,
  chartShowsTimeLabels,
  copyElements,
  encodeConfig,
  groupMembers,
  groupOf,
  literal,
  literalPartText,
  addChartMarker,
  type TextElement,
  type IconElement,
  chartMarkerToIcon,
  DESIGN_BOX,
  type ChartAnchorPoint,
  type ChartAnchorPlace,
  chartMarkersOf,
  chartDrawsBuiltInMarkers,
  convertChartMarkers,
  addChartLine,
  newConfig,
  newElement,
  parseConfig,
  pasteElements,
  TIMELINE_DEFAULT_LABEL_HEX,
  TIMELINE_DEFAULT_LABEL_SIZE,
  removeElement,
  type ChartElement,
  type ChartStat,
  type CustomComplicationConfig,
  type Element,
  type Value,
  type ValueFormat,
} from "../src/model.js";
import { describeValue, layerTitle } from "../src/editors.js";
import { compile } from "../src/compiler.js";
import { chartBarPath, renderLayout, type IconProvider } from "../src/renderer.js";
import { chartDomain, chartGeometry, chartLabels, chartLegs, chartMovingAverage, chartNumbers, chartRuns, chartSeriesWithHoles, chartStatValue, placeChartAnchors, resolveAll, type ChartPoint, type EntityState, type ResolvedChart, type ResolvedLayout } from "../src/resolver.js";
import { historySeriesRequest, statisticsSeriesRequest } from "../src/ha-api.js";

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

  it("ends on a test value in the panel, and only while it is a test", () => {
    const { cfg } = historyChart((p) => { p.historyPoints = 6; });
    const entityStates = new Map<string, EntityState>([
      ["sensor.voltage", { entityId: "sensor.voltage", state: "3100", domain: "sensor", iconName: "bolt" }],
    ]);
    const ctx = {
      entityStates,
      templateResults: new Map(),
      historySeries: new Map([["sensor.voltage|360|6", "3068,3071,3069,3075,3063,3070"]]),
      namedValues: cfg.values,
    };
    expect(chartOf(resolveAll(cfg, { ...ctx, testedEntities: new Set(["sensor.voltage"]) }).rectangular!).values)
      .toEqual([3068, 3071, 3069, 3075, 3063, 3100]);
    expect(chartOf(resolveAll(cfg, ctx).rectangular!).values).toEqual([3068, 3071, 3069, 3075, 3063, 3070]);
    // Before the first fetch, the test value is the one reading there is.
    expect(chartOf(resolveAll(cfg, { ...ctx, historySeries: new Map(), testedEntities: new Set(["sensor.voltage"]) }).rectangular!).values)
      .toEqual([3100]);
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

describe("each end's own marker", () => {
  const pairs: [string, ChartEndMarkers][] = CHART_END_MARKERS.flatMap((high) =>
    CHART_END_MARKERS.map((low): [string, ChartEndMarkers] => [`${high} over the highest, ${low} under the lowest`, { high, low }]));

  /** The shared marker each pair writes, and whether it needs the two keys. */
  const written: Record<string, [ChartMarker, boolean]> = {
    "none/none": ["none", false],
    "none/dot": ["dot", true],
    "none/triangle": ["dot", true],
    "dot/none": ["dot", true],
    "dot/dot": ["dot", false],
    "dot/triangle": ["dot", true],
    "triangle/none": ["pointer", true],
    "triangle/dot": ["pointer", false],
    "triangle/triangle": ["pointer", true],
  };

  function encodedPayload(cfg: CustomComplicationConfig): Record<string, unknown> {
    return (encodeConfig(cfg) as { elements: { payload: Record<string, unknown> }[] }).elements[0]!.payload;
  }

  it.each(pairs)("writes %s the way an older watch can read, and reads it back", (_name, pair) => {
    const { cfg } = chartConfig("1,2,3", (p) => { p.highlight = "both"; setChartEndMarkers(p, pair); });
    const [marker, keys] = written[`${pair.high}/${pair.low}`]!;
    const payload = encodedPayload(cfg);
    expect(payload.marker).toBe(marker);
    expect("highMarker" in payload).toBe(keys);
    expect("lowMarker" in payload).toBe(keys);
    if (keys) expect([payload.highMarker, payload.lowMarker]).toEqual([pair.high, pair.low]);
    const enc = encodeConfig(cfg);
    expect(auditUnknownKeys(enc)).toEqual([]);
    const back = parseConfig(enc).elements[0]!;
    if (back.kind !== "chart") throw new Error("expected a chart");
    expect(chartEndMarkers(back.payload)).toEqual(pair);
    expect(encodeConfig(parseConfig(enc))).toEqual(enc);
  });

  it("derives both ends from the shared marker when neither key is stored", () => {
    const derive = (marker: ChartMarker) => chartEndMarkers({ marker });
    expect(derive("none")).toEqual({ high: "none", low: "none" });
    expect(derive("dot")).toEqual({ high: "dot", low: "dot" });
    expect(derive("pointer")).toEqual({ high: "triangle", low: "dot" });
  });

  it("reads a marker word it does not know as what the shared marker implies", () => {
    const { cfg } = chartConfig("1,2,3");
    const raw = encodeConfig(cfg) as { elements: { payload: Record<string, unknown> }[] };
    Object.assign(raw.elements[0]!.payload, { marker: "pointer", highMarker: "star", lowMarker: 5 });
    const back = parseConfig(raw).elements[0]!;
    if (back.kind !== "chart") throw new Error("expected a chart");
    expect(chartEndMarkers(back.payload)).toEqual({ high: "triangle", low: "dot" });
    expect("highMarker" in encodedPayload(parseConfig(raw))).toBe(false);
  });

  it("resolves an end the highlight does not cover to no marker", () => {
    const stored = (p: ChartElement) => setChartEndMarkers(p, { high: "dot", low: "triangle" });
    const highest = chartOf(rectangular(chartConfig("3,9,1,5", (p) => { stored(p); p.highlight = "highest"; }).cfg, "3,9,1,5"));
    expect([highest.highMarker, highest.lowMarker]).toEqual(["dot", "none"]);
    const lowest = chartOf(rectangular(chartConfig("3,9,1,5", (p) => { stored(p); p.highlight = "lowest"; }).cfg, "3,9,1,5"));
    expect([lowest.highMarker, lowest.lowMarker]).toEqual(["none", "triangle"]);
    const none = chartOf(rectangular(chartConfig("3,9,1,5", stored).cfg, "3,9,1,5"));
    expect([none.highMarker, none.lowMarker]).toEqual(["none", "none"]);
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

  /** Every filled triangle the layout drew. */
  const triangles = (svg: string) => svg.match(/<path d=M[-\d.]+ [-\d.]+ L[-\d.]+ [-\d.]+ L[-\d.]+ [-\d.]+ Z/g)?.length ?? 0;
  const circleCount = (svg: string) => svg.match(/<circle/g)?.length ?? 0;

  it("paints the highest with no marker and puts a dot under the lowest", () => {
    const svg = draw(prices, (p) => { p.highlight = "both"; setChartEndMarkers(p, { high: "none", low: "dot" }); });
    expect(triangles(svg)).toBe(0);
    expect(circleCount(svg)).toBe(1);
    // The colour is the highlight's, marker or not.
    expect(svg).toContain(HIGH);
    expect(svg).toContain(LOW);
  });

  it("draws a triangle at both ends when each asks for one", () => {
    const svg = draw(prices, (p) => { p.highlight = "both"; setChartEndMarkers(p, { high: "triangle", low: "triangle" }); });
    expect(triangles(svg)).toBe(2);
    expect(circleCount(svg)).toBe(0);
  });

  it("keeps room along the top only when a highlighted end draws a marker", () => {
    const tops = (tweak: (p: ChartElement) => void) => rects(draw(prices, tweak)).map((b) => b.y);
    const plain = tops(() => {});
    // Highest highlighted with no marker: the lowest's stored triangle is not drawn and takes no room.
    expect(tops((p) => { p.highlight = "highest"; setChartEndMarkers(p, { high: "none", low: "triangle" }); })).toEqual(plain);
    const marked = tops((p) => { p.highlight = "both"; setChartEndMarkers(p, { high: "none", low: "dot" }); });
    expect(marked[8]!).toBeGreaterThan(plain[8]!);
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

    const area = draw(prices, (p) => { p.style = "area"; p.fillStyle = "flat"; });
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
      p.fillStyle = "flat";
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
      p.fillStyle = "flat";
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

  it("reads the first, the change and the total off the same trimmed series", () => {
    expect(stat("13, 20, 30", "first")).toBe("13");
    expect(stat("13, 20, 30", "delta")).toBe("17");
    expect(stat("13, 20, 30", "sum")).toBe("63");
    expect(stat("30, 20, 13", "delta")).toBe("-17");
    const trim = (p: ChartElement) => { p.limit = 2; p.takeFromEnd = false; };
    expect(stat("13, 20, 30", "first", trim)).toBe("13.0");
    expect(stat("13, 20, 30", "sum", trim)).toBe("33.0");
  });

  it("prints the trend as an arrow rather than a number", () => {
    expect(stat("13, 20, 30", "trend")).toBe("↑");
    expect(stat("30, 20, 13", "trend")).toBe("↓");
    expect(stat("20, 30, 20", "trend")).toBe("→");
  });

  it("reads a change too small for the chart to print as flat, not as a rise", () => {
    // Span 0.004, so the chart prints two decimals and a change of 0.004
    // rounds to "0.00". An arrow off a wobble in a digit nobody sees is a lie.
    expect(stat("21.100, 21.104", "trend")).toBe("→");
    expect(stat("21.10, 21.14", "trend")).toBe("↑");
  });

  it("never puts a unit or a rounding on the arrow, whatever the format says", () => {
    expect(stat("13, 30", "trend", undefined, { decimals: 2, useEntityUnit: true }, "V")).toBe("↑");
  });

  it("prints the placeholder for the newer stats when there is nothing to read", () => {
    expect(stat("", "first")).toBe("--");
    expect(stat("unavailable", "delta")).toBe("--");
    expect(stat("", "sum")).toBe("--");
    expect(stat("", "trend")).toBe("--");
  });

  it("lets a decimals format round the change and the total", () => {
    expect(stat("13, 20, 30", "delta", undefined, { decimals: 2 })).toBe("17.00");
    expect(stat("13, 20, 30", "sum", undefined, { decimals: 1, useEntityUnit: true }, "V")).toBe("63.0 V");
  });

  it("falls back to the newest reading when the stat spelling is not one it knows", () => {
    const { cfg, chartId } = withStat("13, 20, 30", "latest");
    const encoded = encodeConfig(cfg) as { elements: { payload: { value: { kind: Record<string, unknown> } } }[] };
    encoded.elements[0]!.payload.value.kind = { kind: "chartStat", layer: chartId, stat: "medianOfTomorrow" };
    const back = parseConfig(encoded).elements[0]!;
    if (back.kind !== "text") throw new Error("expected a text layer");
    expect(back.payload.value.kind).toEqual({ kind: "chartStat", layer: chartId, stat: "latest" });
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

// ── threshold and "now" ───────────────────────────────────────────────────
//
// The cases here mirror the "Threshold" and "Now marker" sections of
// `CustomComplicationChartTests` in the app repo. The shared fixture
// `chart_marks.json` pins the resolved output on both sides; these cover the
// decisions around it, the drawing, and the wire.

describe("chart threshold and now marker", () => {
  it("grows an auto scale to include the threshold", () => {
    const { cfg, state } = chartConfig("18,19,21,23,22,20", (p) => { p.thresholdValue = 25; });
    const chart = chartOf(rectangular(cfg, state));
    expect(chart.domainMax).toBe(25);
    expect(chart.thresholdY).toBe(1);
  });

  it("places the line inside a range that already covers it", () => {
    const { cfg, state } = chartConfig("10,20,30", (p) => { p.thresholdValue = 25; });
    expect(chartOf(rectangular(cfg, state)).thresholdY).toBeCloseTo(0.75, 9);
  });

  it("keeps a fixed range and draws nothing outside it", () => {
    const { cfg, state } = chartConfig("1,2,3", (p) => {
      p.scale = "fixed";
      p.minValue = 0;
      p.maxValue = 10;
      p.thresholdValue = 50;
    });
    const chart = chartOf(rectangular(cfg, state));
    expect(chart.domainMax).toBe(10);
    expect(chart.thresholdY).toBeUndefined();
  });

  it("rounds the now index and clamps it to the readings drawn", () => {
    const at = (raw: string) => {
      const { cfg, state } = chartConfig("1,2,3,4", (p) => { p.nowIndex = literal(raw); });
      return chartOf(rectangular(cfg, state)).nowIndex;
    };
    expect(at("2")).toBe(2);
    expect(at("2.4")).toBe(2);
    expect(at("2.6")).toBe(3);
    expect(at("9")).toBe(3);
    expect(at("-4")).toBe(0);
    expect(at("nothing numeric")).toBeUndefined();
  });

  it("has no now marker on an empty series", () => {
    const { cfg, state } = chartConfig("unavailable", (p) => { p.nowIndex = literal("1"); });
    expect(chartOf(rectangular(cfg, state)).nowIndex).toBeUndefined();
  });

  it("fetches the now index like any other value", () => {
    const { cfg } = chartConfig("1,2,3", (p) => { p.nowIndex = { kind: { kind: "time", timeField: "hour" } }; });
    expect([...compile(cfg).expressions.values()].some((e) => e.includes("hour"))).toBe(true);
  });

  it("draws a dashed line across the plot and a full-height line on now", () => {
    const { cfg, state } = chartConfig("10,20,30", (p) => {
      p.thresholdValue = 25;
      p.thresholdColorHex = "#FF453A";
      p.nowIndex = literal("1");
      p.nowColorHex = "#FFFFFF";
    });
    const svg = flatten(renderLayout(rectangular(cfg, state), { icons: noIcons }));
    expect(svg).toContain("stroke-dasharray");
    expect(svg).toContain("#FF453A");
    expect(svg).toContain("#FFFFFF");
  });

  it("omits both marks at their defaults and writes them once set", () => {
    const { cfg } = chartConfig("1,2,3");
    const bare = (encodeConfig(cfg) as { elements: { payload: Record<string, unknown> }[] }).elements[0]!.payload;
    for (const key of ["thresholdValue", "thresholdColorHex", "nowIndex", "nowColorHex", "scaleFrom"]) {
      expect(key in bare, key).toBe(false);
    }

    const { cfg: marked } = chartConfig("1,2,3", (p) => {
      p.thresholdValue = 2;
      p.nowIndex = literal("1");
      p.nowColorHex = "#0A84FF";
    });
    const set = (encodeConfig(marked) as { elements: { payload: Record<string, unknown> }[] }).elements[0]!.payload;
    expect(set.thresholdValue).toBe(2);
    expect(set.thresholdColorHex).toBeUndefined();
    expect(set.nowColorHex).toBe("#0A84FF");
    expect(parseConfig(encodeConfig(marked)).elements[0]!.payload).toEqual(marked.elements[0]!.payload);
  });
});

// ── a borrowed scale ──────────────────────────────────────────────────────

describe("scaleFrom", () => {
  /** Two chart layers on one frame, the second free to borrow the first. */
  function twoCharts(a: string, b: string, tweak: (second: ChartElement, firstId: string) => void = () => {}) {
    const cfg = newConfig("Two series", 0);
    const ids: string[] = [];
    for (const value of [a, b]) {
      const el = newElement("chart") as Extract<Element, { kind: "chart" }>;
      el.payload.historyMinutes = 0;
      el.payload.value = literal(value);
      el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
      cfg.elements.push(el);
      ids.push(el.payload.id);
    }
    tweak((cfg.elements[1] as Extract<Element, { kind: "chart" }>).payload, ids[0]!);
    return { cfg, first: ids[0]!, second: ids[1]! };
  }

  function charts(cfg: CustomComplicationConfig): ResolvedChart[] {
    const layout = resolveAll(cfg, { entityStates: new Map(), templateResults: new Map(), namedValues: cfg.values }).rectangular!;
    return layout.elements.filter((e): e is ResolvedChart => e.kind === "chart");
  }

  it("draws its own readings against the other chart's range", () => {
    const { cfg } = twoCharts("18,23", "5,14", (p, firstId) => { p.scaleFrom = firstId; });
    const [a, b] = charts(cfg);
    expect(a!.domainMin).toBe(18);
    expect(b!.values).toEqual([5, 14]);
    expect(b!.domainMin).toBe(18);
    expect(b!.domainMax).toBe(23);
  });

  it("falls back to its own scale for a link that goes nowhere", () => {
    const { cfg } = twoCharts("18,23", "5,14", (p) => { p.scaleFrom = "EEEEEEEE-0000-4000-8000-0000000000DF"; });
    expect(charts(cfg)[1]!.domainMax).toBe(14);
  });

  it("falls back for a chart that points at itself", () => {
    const cfg = twoCharts("18,23", "5,14").cfg;
    const second = cfg.elements[1] as Extract<Element, { kind: "chart" }>;
    second.payload.scaleFrom = second.payload.id;
    expect(charts(cfg)[1]!.domainMax).toBe(14);
  });

  it("breaks a cycle in document order, leaving the later chart on its own scale", () => {
    const cfg = twoCharts("100,200", "1,3").cfg;
    const [a, b] = cfg.elements as Extract<Element, { kind: "chart" }>[];
    a!.payload.scaleFrom = b!.payload.id;
    b!.payload.scaleFrom = a!.payload.id;
    const resolved = charts(cfg);
    expect(resolved[1]!.domainMin).toBe(1);
    expect(resolved[1]!.domainMax).toBe(3);
    expect(resolved[0]!.domainMin).toBe(1);
    expect(resolved[0]!.domainMax).toBe(3);
  });

  it("clears the link when the chart it borrowed from is deleted", () => {
    const { cfg, first } = twoCharts("18,23", "5,14");
    (cfg.elements[1] as Extract<Element, { kind: "chart" }>).payload.scaleFrom = first;
    removeElement(cfg, first);
    expect((cfg.elements[0] as Extract<Element, { kind: "chart" }>).payload.scaleFrom).toBeUndefined();
  });

  it("adds a second series on the same frame, linked to the first", () => {
    const { cfg, first } = twoCharts("18,23", "5,14");
    cfg.elements.pop();
    const copyId = addChartSeries(cfg, first)!;
    expect(cfg.elements).toHaveLength(2);
    const copy = cfg.elements[1] as Extract<Element, { kind: "chart" }>;
    expect(copy.payload.id).toBe(copyId);
    expect(copy.payload.scaleFrom).toBe(first);
    expect(copy.payload.frame).toEqual((cfg.elements[0] as Extract<Element, { kind: "chart" }>).payload.frame);
  });

  it("follows the copy when both charts are pasted, and drops a link to neither", () => {
    const { cfg, first, second } = twoCharts("18,23", "5,14");
    (cfg.elements[1] as Extract<Element, { kind: "chart" }>).payload.scaleFrom = first;
    const both = pasteElements(cfg, copyElements(cfg, [first, second]));
    const pasted = cfg.elements.filter((e) => both.includes(e.payload.id)) as Extract<Element, { kind: "chart" }>[];
    expect(pasted[1]!.payload.scaleFrom).toBe(pasted[0]!.payload.id);

    const alone = newConfig("Elsewhere", 1);
    pasteElements(alone, copyElements(cfg, [second]));
    expect((alone.elements[0] as Extract<Element, { kind: "chart" }>).payload.scaleFrom).toBeUndefined();
  });
});

// ── the clock times along the span ────────────────────────────────────────
//
// The same row a timeline draws, on the same six keys. The cases here mirror
// the "Time labels" section of `CustomComplicationChartTests` in the app repo;
// `test/timeline.test.ts` covers how one time reads, since both layers print
// through the same `timeLabels`.

describe("a chart's clock times", () => {
  // A fixed instant, so every expectation is arithmetic rather than a race with
  // the wall clock.
  const NOW = Date.UTC(2026, 8, 6, 21, 36, 0);
  const withMinutes = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
  const hourOnly = new Intl.DateTimeFormat(undefined, { hour: "numeric" });

  function labelled(tweak: (p: ChartElement) => void = () => {}): ChartElement {
    const el = newElement("chart") as Extract<Element, { kind: "chart" }>;
    el.payload.value = { kind: { kind: "entityState", entityId: "sensor.voltage", displayName: "Voltage", domain: "sensor" } };
    el.payload.historyMinutes = 60;
    el.payload.historyPoints = 12;
    el.payload.timeLabelCount = 4;
    tweak(el.payload);
    return el.payload;
  }

  const labelsOf = (tweak: (p: ChartElement) => void = () => {}) => chartLabels(labelled(tweak), NOW);

  it("spaces the times evenly from the start of the window to now", () => {
    expect(labelsOf((p) => { p.timeLabelCount = 0; })).toEqual([]);
    expect(labelsOf((p) => { p.timeLabelCount = 1; }).map((l) => l.position)).toEqual([1]);
    expect(labelsOf((p) => { p.timeLabelCount = 2; }).map((l) => l.position)).toEqual([0, 1]);

    const four = labelsOf();
    expect(four.map((l) => l.position)).toEqual([0, 1 / 3, 2 / 3, 1]);
    expect(four.map((l) => l.text)).toEqual([
      withMinutes.format(new Date(NOW - 60 * 60 * 1000)),
      withMinutes.format(new Date(NOW - 40 * 60 * 1000)),
      withMinutes.format(new Date(NOW - 20 * 60 * 1000)),
      withMinutes.format(new Date(NOW)),
    ]);
  });

  it("clamps a hand-edited count to the range the editor offers", () => {
    expect(labelsOf((p) => { p.timeLabelCount = 40; })).toHaveLength(12);
    expect(labelsOf((p) => { p.timeLabelCount = -3; })).toEqual([]);
  });

  it("prints nothing for a chart drawing its own value, which has no window", () => {
    expect(labelsOf((p) => { p.value = literal("1,2,3"); })).toEqual([]);
    expect(labelsOf((p) => { p.historyMinutes = 0; })).toEqual([]);
  });

  it("prints nothing for every recorded reading, where the points are uneven", () => {
    const every = labelled((p) => { p.historyPoints = 0; });
    expect(chartHistoryKey(every)).toBe("sensor.voltage|60|0");
    expect(chartShowsTimeLabels(every)).toBe(false);
    expect(chartLabels(every, NOW)).toEqual([]);

    // Averaged slots are evenly spaced, so the same chart does print them.
    every.historyPoints = 6;
    expect(chartShowsTimeLabels(every)).toBe(true);
    expect(chartLabels(every, NOW)).toHaveLength(4);
  });

  it("follows the span for the minute, and the layer when it says so", () => {
    expect(labelsOf((p) => { p.historyMinutes = 240; })[3]!.text).toBe(hourOnly.format(new Date(NOW)));
    expect(labelsOf((p) => { p.historyMinutes = 240; p.minutes = "always"; })[3]!.text)
      .toBe(withMinutes.format(new Date(NOW)));
    expect(labelsOf((p) => { p.minutes = "never"; })[3]!.text).toBe(hourOnly.format(new Date(NOW)));
  });

  it("prints its times before the history lands, because the window is known", () => {
    const cfg = newConfig("Volts", 0);
    const el = newElement("chart") as Extract<Element, { kind: "chart" }>;
    el.payload.value = { kind: { kind: "entityState", entityId: "sensor.voltage", displayName: "Voltage", domain: "sensor" } };
    el.payload.historyMinutes = 60;
    el.payload.historyPoints = 12;
    el.payload.timeLabelCount = 2;
    cfg.elements.push(el);
    const layout = resolveAll(cfg, {
      entityStates: new Map(),
      templateResults: new Map(),
      namedValues: cfg.values,
      nowMs: NOW,
    }).rectangular!;
    const chart = chartOf(layout);
    expect(chart.values).toEqual([]);
    expect(chart.labels).toHaveLength(2);
    expect(chart.labelSize).toBe(TIMELINE_DEFAULT_LABEL_SIZE);
    expect(chart.labelColorHex).toBe(TIMELINE_DEFAULT_LABEL_HEX);
    expect(chart.labelsAbove).toBe(false);
  });

  it("writes none of the six keys until the chart draws times", () => {
    const cfg = newConfig("Volts", 0);
    cfg.elements.push(newElement("chart"));
    const payload = (encodeConfig(cfg).elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>;
    for (const key of ["timeLabelCount", "labelSize", "labelColorHex", "labelsAbove", "hourCycle", "minutes"]) {
      expect(payload[key], key).toBeUndefined();
    }

    const el = cfg.elements[0] as Extract<Element, { kind: "chart" }>;
    el.payload.timeLabelCount = 4;
    el.payload.labelsAbove = true;
    el.payload.hourCycle = "h24";
    el.payload.minutes = "never";
    el.payload.labelSize = 7;
    const written = (encodeConfig(cfg).elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>;
    expect(written.timeLabelCount).toBe(4);
    expect(written.labelsAbove).toBe(true);
    expect(written.hourCycle).toBe("h24");
    expect(written.minutes).toBe("never");
    expect(written.labelSize).toBe(7);
    // And the six keys are ones the audit knows, so a document carrying them is
    // not read as corrupt.
    expect(auditUnknownKeys(encodeConfig(cfg))).toEqual([]);
  });

  it("reads a missing key and an unreadable one as the same fallback", () => {
    const cfg = newConfig("Volts", 0);
    cfg.elements.push(newElement("chart"));
    const doc = encodeConfig(cfg) as { elements: Record<string, unknown>[] };
    const payload = doc.elements[0]!.payload as Record<string, unknown>;
    payload.hourCycle = "h36";
    payload.minutes = "sometimes";
    payload.timeLabelCount = 99;
    const parsed = parseConfig(doc).elements[0] as Extract<Element, { kind: "chart" }>;
    expect(parsed.payload.hourCycle).toBe("auto");
    expect(parsed.payload.minutes).toBe("auto");
    expect(parsed.payload.timeLabelCount).toBe(12);
    expect(parsed.payload.labelSize).toBe(TIMELINE_DEFAULT_LABEL_SIZE);
    expect(parsed.payload.labelColorHex).toBe(TIMELINE_DEFAULT_LABEL_HEX);
    expect(parsed.payload.labelsAbove).toBe(false);
  });
});

describe("long-term statistics", () => {
  function statisticsChart(tweak: (p: ChartElement) => void = () => {}) {
    const cfg = newConfig("Energy", 0);
    const el = newElement("chart") as Extract<Element, { kind: "chart" }>;
    el.payload.value = { kind: { kind: "entityState", entityId: "sensor.energy", displayName: "Energy", domain: "sensor" } };
    el.payload.source = "statistics";
    el.payload.historyMinutes = 1440;
    el.payload.statPeriod = "hour";
    el.payload.statType = "change";
    tweak(el.payload);
    cfg.elements.push(el);
    return { cfg, payload: el.payload };
  }

  it("reads exactly one of the two stores", () => {
    const { payload } = statisticsChart();
    expect(chartStatisticsEntity(payload)).toBe("sensor.energy");
    expect(chartHistoryEntity(payload)).toBeUndefined();
    expect(chartHistoryKey(payload)).toBeUndefined();
    expect(chartStatisticsKey(payload)).toBe("sensor.energy|1440|hour|change");

    payload.source = "history";
    expect(chartStatisticsKey(payload)).toBeUndefined();
    expect(chartHistoryKey(payload)).toBe("sensor.energy|1440|24");
  });

  it("needs a span and an entity, like history does", () => {
    const { payload } = statisticsChart();
    payload.historyMinutes = 0;
    expect(chartStatisticsKey(payload)).toBeUndefined();

    const typed = newElement("chart") as Extract<Element, { kind: "chart" }>;
    typed.payload.source = "statistics";
    typed.payload.historyMinutes = 1440;
    expect(chartStatisticsKey(typed.payload)).toBeUndefined();
  });

  it("makes every parameter part of the question", () => {
    const { payload } = statisticsChart();
    const base = chartStatisticsKey(payload);
    payload.historyMinutes = 10_080;
    expect(chartStatisticsKey(payload)).not.toBe(base);
    payload.historyMinutes = 1440;
    payload.statPeriod = "day";
    expect(chartStatisticsKey(payload)).not.toBe(base);
    payload.statPeriod = "hour";
    payload.statType = "mean";
    expect(chartStatisticsKey(payload)).not.toBe(base);
  });

  it("collects one request per distinct question, and none from history charts", () => {
    const { cfg } = statisticsChart();
    const twin = newElement("chart") as Extract<Element, { kind: "chart" }>;
    twin.payload.value = { kind: { kind: "entityState", entityId: "sensor.energy", displayName: "Energy", domain: "sensor" } };
    twin.payload.source = "statistics";
    twin.payload.historyMinutes = 1440;
    twin.payload.statPeriod = "hour";
    twin.payload.statType = "change";
    twin.payload.style = "line";
    cfg.elements.push(twin);

    const daily = newElement("chart") as Extract<Element, { kind: "chart" }>;
    daily.payload.value = { kind: { kind: "entityState", entityId: "sensor.energy", displayName: "Energy", domain: "sensor" } };
    daily.payload.source = "statistics";
    daily.payload.historyMinutes = 10_080;
    daily.payload.statPeriod = "day";
    daily.payload.statType = "mean";
    cfg.elements.push(daily);

    const history = newElement("chart") as Extract<Element, { kind: "chart" }>;
    history.payload.value = { kind: { kind: "entityState", entityId: "sensor.voltage", displayName: "Voltage", domain: "sensor" } };
    history.payload.historyMinutes = 360;
    cfg.elements.push(history);

    const requests = chartStatisticsRequests(cfg);
    expect(requests.map((r) => r.key).sort())
      .toEqual(["sensor.energy|10080|day|mean", "sensor.energy|1440|hour|change"]);
    expect(requests[0]).toMatchObject({
      entityId: "sensor.energy", minutes: 1440, period: "hour", type: "change",
    });
    expect(chartHistoryRequests(cfg).map((r) => r.key)).toEqual(["sensor.voltage|360|24"]);
    // Both stores are in the signature, so retargeting either owes a refetch.
    const signature = chartHistorySignature(cfg);
    expect(signature).toContain("sensor.energy|1440|hour|change");
    expect(signature).toContain("sensor.voltage|360|24");
  });

  it("draws the series cached under its own key, never the entity's state", () => {
    const { cfg, payload } = statisticsChart();
    const key = chartStatisticsKey(payload)!;
    const entityStates = new Map<string, EntityState>([
      ["sensor.energy", { entityId: "sensor.energy", state: "0.5", domain: "sensor", iconName: "bolt" }],
    ]);
    const drawn = chartOf(resolveAll(cfg, {
      entityStates,
      templateResults: new Map(),
      historySeries: new Map([[key, "0.4,1.1,0.7"]]),
      namedValues: cfg.values,
    }).rectangular!);
    expect(drawn.values).toEqual([0.4, 1.1, 0.7]);

    // Nothing under that key draws nothing, rather than one bar of the state.
    const empty = chartOf(resolveAll(cfg, {
      entityStates,
      templateResults: new Map(),
      historySeries: new Map(),
      namedValues: cfg.values,
    }).rectangular!);
    expect(empty.values).toEqual([]);
  });

  it("always has a window, so it can draw times", () => {
    const { payload } = statisticsChart();
    expect(chartShowsTimeLabels(payload)).toBe(true);
    // The points count is history's knob and means nothing here.
    payload.historyPoints = 0;
    expect(chartShowsTimeLabels(payload)).toBe(true);
    payload.historyMinutes = 0;
    expect(chartShowsTimeLabels(payload)).toBe(false);
  });

  it("writes none of the three keys until the chart asks for statistics", () => {
    const cfg = newConfig("Volts", 0);
    cfg.elements.push(newElement("chart"));
    const payload = (encodeConfig(cfg).elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>;
    for (const key of ["source", "statPeriod", "statType"]) {
      expect(payload[key], key).toBeUndefined();
    }

    const el = cfg.elements[0] as Extract<Element, { kind: "chart" }>;
    el.payload.source = "statistics";
    el.payload.statType = "change";
    const written = (encodeConfig(cfg).elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>;
    expect(written.source).toBe("statistics");
    // `hour` is the default period, so asking for it is still silence.
    expect(written.statPeriod).toBeUndefined();
    expect(written.statType).toBe("change");
    expect(auditUnknownKeys(encodeConfig(cfg))).toEqual([]);
  });

  it("reads a missing key and an unreadable one as the same fallback", () => {
    const cfg = newConfig("Volts", 0);
    cfg.elements.push(newElement("chart"));
    const doc = encodeConfig(cfg) as { elements: Record<string, unknown>[] };
    const bare = parseConfig(doc).elements[0] as Extract<Element, { kind: "chart" }>;
    expect(bare.payload.source).toBe("history");
    expect(bare.payload.statPeriod).toBe("hour");
    expect(bare.payload.statType).toBe("mean");

    const payload = doc.elements[0]!.payload as Record<string, unknown>;
    payload.source = "forecast";
    payload.statPeriod = "fortnight";
    payload.statType = "median";
    const parsed = parseConfig(doc).elements[0] as Extract<Element, { kind: "chart" }>;
    expect(parsed.payload.source).toBe("history");
    expect(parsed.payload.statPeriod).toBe("hour");
    expect(parsed.payload.statType).toBe("mean");
  });
});

describe("chart markers as layers", () => {
  /** A config with one chart, and the chart. */
  const withChart = () => {
    const cfg = newConfig("Prices", 0);
    const chart = newElement("chart") as Extract<Element, { kind: "chart" }>;
    chart.payload.value = literal("10,40,20,5,30");
    cfg.elements.push(chart);
    return { cfg, chartId: chart.payload.id };
  };

  it("adds a marker as an icon layer in the chart's group, pinned to its reading", () => {
    const { cfg, chartId } = withChart();
    const id = addChartMarker(cfg, chartId, "lowest");
    expect(id).toBeDefined();
    const marker = cfg.elements.find((el) => el.payload.id === id)!;
    expect(marker.kind).toBe("icon");
    expect(marker.payload.chartAnchor).toEqual({ layer: chartId, at: "lowest", place: "above" });
    // Same group as the chart, so the Layers list files it under the chart and
    // a drag on the chart takes it along.
    expect(marker.payload.groupId).toBeDefined();
    expect(marker.payload.groupId).toBe(cfg.elements.find((el) => el.payload.id === chartId)!.payload.groupId);
    expect(chartMarkersOf(cfg, chartId).map((m) => m.payload.id)).toEqual([id]);
  });

  it("starts as the icon of the mark it replaces, and takes any other icon", () => {
    const { cfg, chartId } = withChart();
    const highId = addChartMarker(cfg, chartId, "highest")!;
    const lowId = addChartMarker(cfg, chartId, "lowest")!;
    const nowId = addChartMarker(cfg, chartId, "now")!;
    const symbol = (id: string) => literalPartText((cfg.elements.find((el) => el.payload.id === id)!.payload as IconElement).symbol);
    expect(symbol(highId)).toBe("arrowtriangle.up.fill");
    expect(symbol(lowId)).toBe("circle.fill");
    expect(symbol(nowId)).toBe("arrowtriangle.down.fill");

    const low = cfg.elements.find((el) => el.payload.id === lowId)!;
    (low.payload as IconElement).symbol = literal("heart.fill");
    const round = parseConfig(encodeConfig(cfg));
    const back = round.elements.find((el) => el.payload.id === lowId)!;
    expect(literalPartText((back.payload as IconElement).symbol)).toBe("heart.fill");
    expect(back.payload.chartAnchor).toEqual({ layer: chartId, at: "lowest", place: "above" });
  });

  it("swaps a text marker for an icon of the same shape, keeping its id, place and states", () => {
    const { cfg, chartId } = withChart();
    const text = newElement("text") as Extract<Element, { kind: "text" }>;
    text.payload.value = literal("▼");
    text.payload.fontSize = 9;
    text.payload.chartAnchor = { layer: chartId, at: "now", place: "above", dy: -2 };
    text.payload.rules = [{
      id: "r1",
      cases: [{ id: "c1", when: { kind: "always" } as never, then: [
        { kind: "setText", value: literal("▲") },
        { kind: "setFontWeight", weight: "bold" },
        { kind: "setColor", value: literal("#FF0000") },
      ] }],
      otherwise: [{ kind: "setText", value: literal("hot") }],
    }];
    cfg.elements.push(text);
    const id = text.payload.id;

    chartMarkerToIcon(cfg, id);
    const icon = cfg.elements.find((el) => el.payload.id === id)!;
    expect(icon.kind).toBe("icon");
    const p = icon.payload as IconElement;
    expect(literalPartText(p.symbol)).toBe("arrowtriangle.down.fill");
    expect(p.size).toBe(9);
    expect(p.chartAnchor).toEqual({ layer: chartId, at: "now", place: "above", dy: -2 });
    // A glyph becomes its icon, a word has no icon and goes, and weight means nothing to an icon.
    expect(p.rules[0]!.cases[0]!.then).toEqual([
      { kind: "setIcon", value: literal("arrowtriangle.up.fill") },
      { kind: "setColor", value: literal("#FF0000") },
    ]);
    expect(p.rules[0]!.otherwise).toEqual([]);
    expect(cfg.elements.filter((el) => el.payload.id === id)).toHaveLength(1);

    // An emoji has no match, so it takes the icon a new marker there starts as.
    const heart = newElement("text") as Extract<Element, { kind: "text" }>;
    heart.payload.value = literal("💚");
    heart.payload.chartAnchor = { layer: chartId, at: "lowest", place: "above" };
    cfg.elements.push(heart);
    chartMarkerToIcon(cfg, heart.payload.id);
    expect(literalPartText((cfg.elements.find((el) => el.payload.id === heart.payload.id)!.payload as IconElement).symbol))
      .toBe("circle.fill");
  });

  it("writes no anchor key on a layer that follows nothing", () => {
    const cfg = newConfig("Plain", 0);
    cfg.elements.push(newElement("text"));
    const doc = encodeConfig(cfg) as { elements: { payload: Record<string, unknown> }[] };
    expect("chartAnchor" in doc.elements[0]!.payload).toBe(false);
  });

  it("round-trips the nudge, and omits it at zero", () => {
    const { cfg, chartId } = withChart();
    const id = addChartMarker(cfg, chartId, "now", "on")!;
    const marker = cfg.elements.find((el) => el.payload.id === id)!;
    marker.payload.chartAnchor!.dx = 2;
    marker.payload.chartAnchor!.dy = -1.5;
    const doc = encodeConfig(cfg) as { elements: { payload: Record<string, unknown> }[] };
    const written = doc.elements.find((e) => (e.payload as { id: string }).id === id)!.payload.chartAnchor;
    expect(written).toEqual({ layer: chartId, at: "now", place: "on", dx: 2, dy: -1.5 });
    expect(parseConfig(doc).elements.find((el) => el.payload.id === id)!.payload.chartAnchor)
      .toEqual({ layer: chartId, at: "now", place: "on", dx: 2, dy: -1.5 });

    marker.payload.chartAnchor!.dx = 0;
    delete marker.payload.chartAnchor!.dy;
    const bare = (encodeConfig(cfg) as { elements: { payload: Record<string, unknown> }[] })
      .elements.find((e) => (e.payload as { id: string }).id === id)!.payload.chartAnchor;
    expect(bare).toEqual({ layer: chartId, at: "now", place: "on" });
  });

  it("reads an anchor written by a newer panel rather than refusing the document", () => {
    const { cfg, chartId } = withChart();
    const id = addChartMarker(cfg, chartId, "highest")!;
    const doc = encodeConfig(cfg) as { elements: { payload: Record<string, unknown> }[] };
    const payload = doc.elements.find((e) => (e.payload as { id: string }).id === id)!.payload;
    payload.chartAnchor = { layer: chartId, at: "median", place: "orbiting" };
    expect(auditUnknownKeys(doc)).toEqual([]);
    expect(parseConfig(doc).elements.find((el) => el.payload.id === id)!.payload.chartAnchor)
      .toEqual({ layer: chartId, at: "highest", place: "above" });
  });

  it("a new chart draws no marks of its own, so nothing is offered to convert", () => {
    const { cfg, chartId } = withChart();
    const chart = cfg.elements.find((el) => el.payload.id === chartId) as Extract<Element, { kind: "chart" }>;
    expect(chart.payload.marker).toBe("none");
    chart.payload.highlight = "both";
    expect(chartDrawsBuiltInMarkers(chart)).toBe(false);
  });

  it("converts a chart's built-in marks into layers, shape for shape, only when asked", () => {
    const { cfg, chartId } = withChart();
    const chart = cfg.elements.find((el) => el.payload.id === chartId) as Extract<Element, { kind: "chart" }>;
    chart.payload.highlight = "both";
    setChartEndMarkers(chart.payload, { high: "triangle", low: "dot" });
    expect(chartDrawsBuiltInMarkers(chart)).toBe(true);

    // Opening a document changes nothing: the conversion rewrites the chart and
    // shifts how its marks look, so it waits for the button.
    const reopened = parseConfig(encodeConfig(cfg));
    expect(chartMarkersOf(reopened, chartId)).toEqual([]);
    expect((reopened.elements.find((el) => el.payload.id === chartId)!.payload as ChartElement).marker)
      .toBe("pointer");

    convertChartMarkers(cfg, chartId);
    const markers = chartMarkersOf(cfg, chartId);
    expect(markers.map((m) => m.payload.chartAnchor!.at)).toEqual(["lowest", "highest"]);
    expect(markers.map((m) => literalPartText((m.payload as IconElement).symbol))).toEqual(["circle.fill", "arrowtriangle.up.fill"]);
    // And the chart stops drawing its own, so the band along the top goes too.
    expect(chart.payload.marker).toBe("none");
    expect(chartDrawsBuiltInMarkers(chart)).toBe(false);
  });

  it("converts only the ends the highlight actually marked", () => {
    const { cfg, chartId } = withChart();
    const chart = cfg.elements.find((el) => el.payload.id === chartId) as Extract<Element, { kind: "chart" }>;
    chart.payload.highlight = "lowest";
    setChartEndMarkers(chart.payload, { high: "triangle", low: "dot" });
    convertChartMarkers(cfg, chartId);
    expect(chartMarkersOf(cfg, chartId).map((m) => m.payload.chartAnchor!.at)).toEqual(["lowest"]);
  });

  it("keeps a marker when its chart is deleted, and stops it following nothing", () => {
    const { cfg, chartId } = withChart();
    const id = addChartMarker(cfg, chartId, "highest")!;
    removeElement(cfg, chartId);
    const marker = cfg.elements.find((el) => el.payload.id === id);
    expect(marker).toBeDefined();
    expect(marker!.payload.chartAnchor).toBeUndefined();
  });
});

describe("where an anchored marker lands", () => {
  /** One chart filling the whole canvas, plus the markers pinned to it, placed
   * the way the renderer places them. The chart takes the full frame so the
   * numbers below are the design box's own, with no sub-rect to allow for. */
  const placed = (
    readings: string,
    markers: { at: ChartAnchorPoint; place?: ChartAnchorPlace; dx?: number; dy?: number }[],
    tweak: (c: ChartElement) => void = () => {},
    edit: (markers: Element[]) => void = () => {},
  ) => {
    const cfg = newConfig("Prices", 0);
    const chart = newElement("chart") as Extract<Element, { kind: "chart" }>;
    chart.payload.value = literal(readings);
    chart.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
    tweak(chart.payload);
    cfg.elements.push(chart);
    const ids = markers.map((m) => {
      const id = addChartMarker(cfg, chart.payload.id, m.at, m.place ?? "above")!;
      const el = cfg.elements.find((e) => e.payload.id === id)!;
      el.payload.frame = { x: 0, y: 0, width: 0.05, height: 0.1, rotationDegrees: 0 };
      if (m.dx !== undefined) el.payload.chartAnchor!.dx = m.dx;
      if (m.dy !== undefined) el.payload.chartAnchor!.dy = m.dy;
      return id;
    });
    edit(ids.map((id) => cfg.elements.find((e) => e.payload.id === id)!));
    const resolved = resolveAll(cfg, {
      entityStates: new Map(), templateResults: new Map(), namedValues: [],
    }).rectangular!;
    const out = placeChartAnchors(resolved.elements, DESIGN_BOX.rectangular);
    return { cfg, ids, frameOf: (id: string) => out.find((e) => e.id === id)!.frame };
  };

  it("puts a marker over the column it names, not where its frame put it", () => {
    // Five readings, the lowest fourth and the highest second.
    const { ids, frameOf } = placed("10,40,20,5,30",
      [{ at: "lowest" }, { at: "highest" }], (c) => { c.barGap = 0; });
    const [low, high] = ids.map(frameOf);
    // Five even columns across the full width: the fourth is centred at 0.7,
    // the second at 0.3.
    expect(low!.x + low!.width / 2).toBeCloseTo(0.7, 3);
    expect(high!.x + high!.width / 2).toBeCloseTo(0.3, 3);
    // The lowest bar is short, so its marker hangs well below the highest one.
    expect(low!.y).toBeGreaterThan(high!.y);
  });

  it("pushes a marker over the tallest bar down rather than off the chart", () => {
    const { ids, frameOf } = placed("1,2,9", [{ at: "highest" }]);
    // The tallest bar reaches the top of the plot on an auto scale, so "above"
    // it is off the chart. The marker sits on the top edge instead, and the
    // bars keep every point of their height.
    expect(frameOf(ids[0]!).y).toBeGreaterThanOrEqual(0);
    expect(frameOf(ids[0]!).y).toBeLessThan(0.001);
  });

  it("lets the nudge lift a marker past the top of the chart, as far as the face", () => {
    // The chart takes the bottom half of the face, so there is room above it.
    const bottomHalf = (c: ChartElement) => { c.frame = { x: 0, y: 0.5, width: 1, height: 0.5, rotationDegrees: 0 }; };
    const { ids, frameOf } = placed("1,2,9",
      [{ at: "highest" }, { at: "highest", dy: -20 }, { at: "highest", dy: -1000 }], bottomHalf);
    const [plain, lifted, far] = ids.map((id) => frameOf(id).y);
    // Without a nudge the tall bar still holds the marker on the chart's top edge.
    expect(plain!).toBeCloseTo(0.5, 3);
    expect((plain! - lifted!) * DESIGN_BOX.rectangular.height).toBeCloseTo(20, 3);
    expect(far!).toBeCloseTo(0, 6);
  });

  it("starts the highest marker yellow and the lowest red", () => {
    const { cfg, ids } = placed("1,2,9", [{ at: "highest" }, { at: "lowest" }]);
    const colour = (id: string) => (cfg.elements.find((e) => e.payload.id === id)!.payload as IconElement).colorSlot.baseColorHex;
    expect(ids.map(colour)).toEqual(["#FFD60A", "#FF453A"]);
  });

  it("moves the marker around the bar top with the place", () => {
    // A fixed scale so the followed reading sits halfway up: on an auto scale
    // both ends clamp, which is a different test.
    const { ids, frameOf } = placed("5,9,9,9",
      [{ at: "lowest", place: "above" }, { at: "lowest", place: "on" },
       { at: "lowest", place: "below" }, { at: "lowest", place: "bottom" }],
      (c) => { c.scale = "fixed"; c.minValue = 0; c.maxValue = 10; c.baseline = "zero"; });
    const [above, on, below, bottom] = ids.map((id) => frameOf(id).y);
    expect(above!).toBeLessThan(on!);
    expect(on!).toBeLessThan(below!);
    expect(below!).toBeLessThan(bottom!);
  });

  it("shifts a marker by the nudge without giving up the follow", () => {
    const { ids, frameOf } = placed("5,9,9,9",
      [{ at: "lowest", place: "on" }, { at: "lowest", place: "on", dx: 4, dy: 3 }]);
    const [plain, nudged] = ids.map(frameOf);
    expect((nudged!.x - plain!.x) * DESIGN_BOX.rectangular.width).toBeCloseTo(4, 3);
    expect((nudged!.y - plain!.y) * DESIGN_BOX.rectangular.height).toBeCloseTo(3, 3);
  });

  it("leaves a layer alone when its anchor has nothing to point at", () => {
    const { ids, frameOf } = placed("not a series", [{ at: "highest" }]);
    expect(frameOf(ids[0]!)).toEqual({ x: 0, y: 0, width: 0.05, height: 0.1, rotationDegrees: 0 });
  });

  it("stands a layer through a column from the top of the plot to the bottom", () => {
    const { ids, frameOf } = placed("10,40,20,5,30",
      [{ at: "now", place: "through", dy: 5 }],
      (c) => { c.barGap = 0; c.nowIndex = literal("1"); });
    const f = frameOf(ids[0]!);
    // Column two of five is centred at 0.3, and the frame keeps its own width.
    expect(f.x + f.width / 2).toBeCloseTo(0.3, 3);
    expect(f.width).toBeCloseTo(0.05, 4);
    // The plot owns the height outright, so the nudge down is ignored.
    expect(f.y).toBeCloseTo(0, 4);
    expect(f.height).toBeCloseTo(1, 4);
  });

  it("settles only the height on the threshold, and runs the width through it", () => {
    const { ids, frameOf, cfg } = placed("1,2,3",
      [{ at: "threshold", place: "on" }, { at: "threshold", place: "through", dx: 7 }],
      (c) => { c.scale = "fixed"; c.minValue = 0; c.maxValue = 10; c.baseline = "zero"; c.thresholdValue = 5; },
      (els) => { els[0]!.payload.frame.x = 0.4; });
    void cfg;
    const [label, line] = ids.map(frameOf);
    // Halfway up a 0 to 10 scale.
    expect(label!.y + label!.height / 2).toBeCloseTo(0.5, 3);
    // A threshold names nothing across, so the label keeps the X its author gave it.
    expect(label!.x).toBeCloseTo(0.4, 4);
    // Through: left edge to right edge on the same height, the nudge across ignored.
    expect(line!.x).toBeCloseTo(0, 4);
    expect(line!.width).toBeCloseTo(1, 4);
    expect(line!.y + line!.height / 2).toBeCloseTo(0.5, 3);
  });
});

describe("chart lines as layers", () => {
  const chartWith = (tweak: (c: ChartElement) => void) => {
    const cfg = newConfig("Prices", 0);
    const chart = newElement("chart") as Extract<Element, { kind: "chart" }>;
    chart.payload.value = literal("1,2,3");
    tweak(chart.payload);
    cfg.elements.push(chart);
    return { cfg, chart };
  };

  it("hands the now line to a thin line shape and keeps the number", () => {
    const { cfg, chart } = chartWith((c) => { c.nowIndex = literal("1"); });
    const id = addChartLine(cfg, chart.payload.id, "now")!;
    const el = cfg.elements.find((e) => e.payload.id === id)!;
    expect(el.kind).toBe("shape");
    if (el.kind !== "shape") return;
    expect(el.payload.kind).toBe("line");
    expect(el.payload.chartAnchor).toEqual({ layer: chart.payload.id, at: "now", place: "through" });
    // Taller than wide, so the line stands up.
    expect(el.payload.frame.width).toBeLessThan(el.payload.frame.height);
    expect(el.payload.colorSlot.baseColorHex).toBe(chart.payload.nowColorHex);
    expect(chart.payload.drawsNowLine).toBe(false);
    expect(chart.payload.nowIndex).toBeDefined();
    // Straight after the chart, and in its group.
    expect(cfg.elements.indexOf(el)).toBe(cfg.elements.indexOf(chart) + 1);
  });

  it("hands the threshold line to a flat line shape", () => {
    const { cfg, chart } = chartWith((c) => { c.thresholdValue = 2; });
    const id = addChartLine(cfg, chart.payload.id, "threshold")!;
    const el = cfg.elements.find((e) => e.payload.id === id)!;
    expect(el.payload.frame.height).toBeLessThan(el.payload.frame.width);
    expect(el.payload.chartAnchor?.at).toBe("threshold");
    expect(chart.payload.drawsThreshold).toBe(false);
    expect(chart.payload.thresholdValue).toBe(2);
  });

  it("writes the draw flags only when off, and reads them back", () => {
    const { cfg, chart } = chartWith((c) => { c.thresholdValue = 2; c.nowIndex = literal("1"); });
    const plain = JSON.stringify(encodeConfig(cfg));
    expect(plain).not.toContain("drawsThreshold");
    expect(plain).not.toContain("drawsNowLine");
    addChartLine(cfg, chart.payload.id, "now");
    addChartLine(cfg, chart.payload.id, "threshold");
    const moved = encodeConfig(cfg);
    expect(JSON.stringify(moved)).toContain("\"drawsThreshold\":false");
    expect(JSON.stringify(moved)).toContain("\"drawsNowLine\":false");
    const back = parseConfig(moved).elements.find((e) => e.kind === "chart")!;
    if (back.kind !== "chart") return;
    expect(back.payload.drawsThreshold).toBe(false);
    expect(back.payload.drawsNowLine).toBe(false);
  });

  it("stops the chart drawing a line once a layer draws it", () => {
    const { cfg, chart } = chartWith((c) => { c.thresholdValue = 2; c.nowIndex = literal("1"); });
    addChartLine(cfg, chart.payload.id, "now");
    const resolved = resolveAll(cfg, {
      entityStates: new Map(), templateResults: new Map(), namedValues: [],
    }).rectangular!;
    const model = resolved.elements.find((e) => e.kind === "chart")!;
    if (model.kind !== "chart") return;
    expect(model.drawsNowLine).toBe(false);
    expect(model.drawsThreshold).toBe(true);
    // The layer still needs to know which reading is now.
    expect(model.nowIndex).toBe(1);
  });

  it("names each extra for what it marks, not for its glyph", () => {
    const { cfg, chart } = chartWith((c) => { c.thresholdValue = 2; });
    const title = (id: string | undefined) => layerTitle(cfg.elements.find((e) => e.payload.id === id)!);
    expect(title(addChartMarker(cfg, chart.payload.id, "highest"))).toBe("Highest reading marker");
    expect(title(addChartMarker(cfg, chart.payload.id, "now"))).toBe("Now marker");
    expect(title(addChartLine(cfg, chart.payload.id, "threshold"))).toBe("Threshold line");
  });

  it("gives the chart a now reading when a now marker or line is added first", () => {
    const { cfg, chart } = chartWith(() => {});
    expect(chart.payload.nowIndex).toBeUndefined();
    addChartMarker(cfg, chart.payload.id, "now");
    expect(chart.payload.nowIndex).toEqual({ kind: { kind: "time", timeField: "hour" } });
    // One the author already set is left alone.
    const other = chartWith((c) => { c.nowIndex = literal("3"); });
    addChartLine(other.cfg, other.chart.payload.id, "now");
    expect(other.chart.payload.nowIndex).toEqual(literal("3"));
  });
});

// ── curve and smoothing ───────────────────────────────────────────────────
//
// The watch runs the same maths in `CustomComplicationChartGeometry`, and its
// tests pin the same numbers, so drift fails on both sides.

describe("chart curve legs", () => {
  const golden: ChartPoint[] = [
    { x: 0, y: 10 }, { x: 10, y: 30 }, { x: 20, y: 25 }, { x: 30, y: 25 }, { x: 40, y: 5 }, { x: 50, y: 0 },
  ];
  const r4 = (n: number) => Math.round(n * 10000) / 10000;

  it("pins the monotone cubic control points both renderers share", () => {
    const legs = chartLegs(golden, "smooth").map((leg) => {
      if (leg.kind !== "smooth") throw new Error("expected a smooth leg");
      return [leg.start, leg.c1, leg.c2, leg.end].map((p) => [r4(p.x), r4(p.y)]);
    });
    expect(legs).toEqual([
      [[0, 10], [3.3333, 16.6667], [6.6667, 30], [10, 30]],
      [[10, 30], [13.3333, 30], [16.6667, 25], [20, 25]],
      [[20, 25], [23.3333, 25], [26.6667, 25], [30, 25]],
      [[30, 25], [33.3333, 25], [36.6667, 9.1667], [40, 5]],
      [[40, 5], [43.3333, 0.8333], [46.6667, 1.6667], [50, 0]],
    ]);
  });

  it("never puts a control point outside its leg's two readings", () => {
    const series = [
      [10, 30, 25, 25, 5, 0],
      [0, 100, 0, 100, 0],
      [1, 2, 40, 41, 42, 0, 0, 3],
      [5, 5.1, 90, 90.2, 1],
    ];
    for (const ys of series) {
      const points = ys.map((y, i) => ({ x: i * 7.5, y }));
      for (const leg of chartLegs(points, "smooth")) {
        if (leg.kind !== "smooth") throw new Error("expected a smooth leg");
        const lo = Math.min(leg.start.y, leg.end.y) - 1e-9;
        const hi = Math.max(leg.start.y, leg.end.y) + 1e-9;
        for (const c of [leg.c1, leg.c2]) {
          expect(c.y, `${ys.join(",")}`).toBeGreaterThanOrEqual(lo);
          expect(c.y, `${ys.join(",")}`).toBeLessThanOrEqual(hi);
        }
      }
    }
  });

  it("steps after each reading, 2n - 1 points in all", () => {
    const legs = chartLegs(golden, "step");
    const path = [golden[0]!, ...legs.flatMap((leg) => {
      if (leg.kind !== "step") throw new Error("expected a step leg");
      return [leg.corner, leg.end];
    })];
    expect(path).toHaveLength(2 * golden.length - 1);
    expect(legs[0]).toEqual({ kind: "step", start: { x: 0, y: 10 }, corner: { x: 10, y: 10 }, end: { x: 10, y: 30 } });
  });

  it("joins straight legs reading to reading, and draws no leg for one point", () => {
    expect(chartLegs(golden, "straight")[1]).toEqual({ kind: "straight", start: { x: 10, y: 30 }, end: { x: 20, y: 25 } });
    for (const curve of ["straight", "smooth", "step"] as const) {
      expect(chartLegs([{ x: 3, y: 4 }], curve)).toEqual([]);
      expect(chartLegs([], curve)).toEqual([]);
    }
  });
});

describe("chart smoothing", () => {
  it("averages a centred window that shrinks at the ends", () => {
    expect(chartMovingAverage([3, 9, 0, 6, 3, 9], 3)).toEqual([6, 4, 5, 3, 6, 6]);
    const five = chartMovingAverage([3, 9, 0, 6, 3, 9], 5);
    [4, 4.5, 4.2, 5.4, 4.5, 6].forEach((want, i) => expect(five[i]).toBeCloseTo(want, 12));
    expect(chartMovingAverage([3, 9, 0], 0)).toEqual([3, 9, 0]);
    expect(chartMovingAverage([], 9)).toEqual([]);
  });

  it("runs after the limit trim, and the range and highlights read the averaged series", () => {
    const { cfg, state } = chartConfig("100,3,9,0,6", (p) => {
      p.limit = 4;
      p.takeFromEnd = true;
      p.smoothing = 3;
      p.highlight = "both";
    });
    const chart = chartOf(rectangular(cfg, state));
    // [3, 9, 0, 6] averaged; the trimmed-off 100 never reaches the window.
    expect(chart.values).toEqual([6, 4, 5, 3]);
    expect(chart.smoothing).toBe(3);
    expect(chart.highIndex).toBe(0);
    expect(chart.lowIndex).toBe(3);
    expect(chart.domainMax).toBeLessThan(100);
  });
});

describe("chart curve and smoothing keys", () => {
  function payloadWith(extra: Record<string, unknown>) {
    const { cfg } = chartConfig("1,2,3");
    const enc = encodeConfig(cfg) as { elements: { payload: Record<string, unknown> }[] };
    const payload = enc.elements[0]!.payload;
    delete payload.curve;
    delete payload.fillStyle;
    Object.assign(payload, extra);
    const back = parseConfig(enc).elements[0]!;
    if (back.kind !== "chart") throw new Error("expected a chart");
    return { chart: back.payload, written: (encodeConfig(parseConfig(enc)) as typeof enc).elements[0]!.payload };
  }

  it("starts a new chart smooth, written out, so an older chart stays straight", () => {
    const el = newElement("chart") as Extract<Element, { kind: "chart" }>;
    expect(el.payload.curve).toBe("smooth");
    expect(el.payload.smoothing).toBeUndefined();
    const { chart, written } = payloadWith({});
    expect(chart.curve).toBeUndefined();
    expect("curve" in written).toBe(false);
    expect("smoothing" in written).toBe(false);
  });

  it("reads an unknown curve as straight and a window it does not offer as off", () => {
    for (const curve of ["bezier", 3, null]) {
      const { chart, written } = payloadWith({ curve });
      expect(chart.curve ?? "straight").toBe("straight");
      expect("curve" in written).toBe(false);
    }
    for (const smoothing of [4, 11, -3, "5", 2.5]) {
      const { chart, written } = payloadWith({ smoothing });
      expect(chart.smoothing ?? 0).toBe(0);
      expect("smoothing" in written).toBe(false);
    }
  });

  it("writes curve then smoothing after the end markers, and reads them back", () => {
    const { chart, written } = payloadWith({ highMarker: "dot", lowMarker: "none", smoothing: 7, curve: "step" });
    expect([chart.curve, chart.smoothing]).toEqual(["step", 7]);
    const keys = Object.keys(written);
    expect(keys.slice(keys.indexOf("lowMarker"), keys.indexOf("lowMarker") + 3)).toEqual(["lowMarker", "curve", "smoothing"]);
    expect(auditUnknownKeys(encodeConfig(parseConfig({ ...encodeConfig(chartConfig("1").cfg) })))).toEqual([]);
  });
});

// ── fill, dots and grid ───────────────────────────────────────────────────

describe("chart fill, dots and grid keys", () => {
  const LOOKS = ["fillStyle", "fillColorHex", "pointDots", "gridLines", "gridColorHex", "zeroLine"];

  function payloadWith(extra: Record<string, unknown>) {
    const { cfg } = chartConfig("1,2,3");
    const enc = encodeConfig(cfg) as { elements: { payload: Record<string, unknown> }[] };
    const payload = enc.elements[0]!.payload;
    delete payload.curve;
    delete payload.fillStyle;
    Object.assign(payload, extra);
    const back = parseConfig(enc).elements[0]!;
    if (back.kind !== "chart") throw new Error("expected a chart");
    return { chart: back.payload, written: (encodeConfig(parseConfig(enc)) as typeof enc).elements[0]!.payload };
  }

  it("starts a new chart fading, written out, so an older chart stays flat", () => {
    const el = newElement("chart") as Extract<Element, { kind: "chart" }>;
    expect(el.payload.fillStyle).toBe("fade");
    const { chart, written } = payloadWith({});
    expect(chart.fillStyle).toBeUndefined();
    for (const key of LOOKS) expect(key in written, key).toBe(false);
  });

  it("omits every key at its default", () => {
    const { written } = payloadWith({ fillStyle: "flat", pointDots: "none", gridLines: 0, gridColorHex: "#ffffff33", zeroLine: false });
    for (const key of LOOKS) expect(key in written, key).toBe(false);
  });

  it("reads a spelling it does not know as the default", () => {
    for (const bad of ["gradient", 3, null]) {
      const { chart, written } = payloadWith({ fillStyle: bad, pointDots: bad });
      expect(chart.fillStyle ?? "flat").toBe("flat");
      expect(chart.pointDots ?? "none").toBe("none");
      expect("fillStyle" in written).toBe(false);
      expect("pointDots" in written).toBe(false);
    }
  });

  it("clamps grid lines into 0 to 4 and keeps a colour that differs", () => {
    expect(payloadWith({ gridLines: 9 }).written.gridLines).toBe(4);
    expect("gridLines" in payloadWith({ gridLines: -2 }).written).toBe(false);
    expect("gridLines" in payloadWith({ gridLines: "3" }).written).toBe(false);
    expect(payloadWith({ gridLines: 2.4 }).written.gridLines).toBe(2);
    expect(payloadWith({ gridColorHex: "#FF9F0A66" }).written.gridColorHex).toBe("#FF9F0A66");
  });

  it("writes the looks keys between curve and smoothing, and reads them back", () => {
    const { chart, written } = payloadWith({
      curve: "smooth", smoothing: 3, zeroLine: true, gridColorHex: "#FF000080", gridLines: 3,
      pointDots: "auto", fillColorHex: "#0A84FF", fillStyle: "fade",
    });
    expect(chart).toMatchObject({ fillStyle: "fade", fillColorHex: "#0A84FF", pointDots: "auto", gridLines: 3, gridColorHex: "#FF000080", zeroLine: true });
    const keys = Object.keys(written);
    const from = keys.indexOf("curve");
    expect(keys.slice(from, from + 8)).toEqual(["curve", ...LOOKS, "smoothing"]);
    const dressed = chartConfig("1", (p) => { p.gridLines = 2; p.zeroLine = true; p.pointDots = "all"; p.fillColorHex = "#0A84FF"; });
    expect(auditUnknownKeys(encodeConfig(dressed.cfg))).toEqual([]);
  });
});

describe("chart fill, dots and grid geometry", () => {
  const box = { x: 0, y: 0, w: 181, h: 60, cx: 90.5, cy: 30 };
  function geometryOf(state: string, tweak: (p: ChartElement) => void) {
    const { cfg } = chartConfig(state, tweak);
    return chartGeometry(chartOf(rectangular(cfg, state)), box);
  }

  it("spaces grid lines evenly inside the plot, never on its edges", () => {
    expect(geometryOf("1,2,3", (p) => { p.gridLines = 1; }).gridYs).toEqual([30]);
    expect(geometryOf("1,2,3", (p) => { p.gridLines = 3; }).gridYs).toEqual([15, 30, 45]);
    expect(geometryOf("1,2,3", () => {}).gridYs).toEqual([]);
  });

  it("draws the zero line only where zero falls inside the plot", () => {
    expect(geometryOf("-2,4,1,6", (p) => { p.baseline = "zero"; p.zeroLine = true; }).zeroY).toBe(45);
    expect(geometryOf("-2,4,1,6", (p) => { p.baseline = "zero"; }).zeroY).toBeUndefined();
    expect(geometryOf("1,2,3", (p) => { p.zeroLine = true; }).zeroY).toBeUndefined();
    // Zero is the bottom of this range, which is the plot's own edge.
    expect(geometryOf("0,2,3", (p) => { p.baseline = "zero"; p.zeroLine = true; }).zeroY).toBeUndefined();
  });

  it("draws auto dots only while the readings sit three dots apart", () => {
    const series = (n: number) => Array.from({ length: n }, (_, i) => (i % 5) + 1).join(",");
    const dots = (n: number, pointDots: "auto" | "all") =>
      geometryOf(series(n), (p) => { p.style = "line"; p.lineWidth = 2; p.pointDots = pointDots; });
    // Dots are 3.6 across at line width 2, so neighbours need 10.8 of room. The
    // spacing is measured on the plot the stroke leaves (181 less 1 each side):
    // 17 readings sit 11.19 apart and draw, 18 sit 10.53 apart and do not.
    const sparse = dots(17, "auto");
    expect(sparse.drawsDots).toBe(true);
    expect(sparse.dotDiameter).toBeCloseTo(3.6, 9);
    // The stroke inset grows to a dot's radius so the edge dots are not clipped.
    expect(sparse.point(0).x).toBeCloseTo(1.8, 9);
    expect(dots(18, "auto").drawsDots).toBe(false);
    expect(dots(24, "auto").drawsDots).toBe(false);
    const crowded = dots(120, "auto");
    expect(crowded.drawsDots).toBe(false);
    expect(crowded.point(0).x).toBeCloseTo(1, 9);
    expect(dots(120, "all").drawsDots).toBe(true);
    expect(dots(1, "auto").drawsDots).toBe(true);
    expect(geometryOf(series(24), (p) => { p.pointDots = "all"; }).drawsDots).toBe(false); // bars
  });
});

describe("drawing chart fill, dots and grid", () => {
  function draw(state: string, tweak: (p: ChartElement) => void): string {
    const { cfg } = chartConfig(state, tweak);
    return flatten(renderLayout(rectangular(cfg, state), { icons: noIcons }));
  }
  const count = (s: string, needle: string) => s.split(needle).length - 1;

  it("defines one fade gradient per colour, and banded quads share them", () => {
    const svg = draw("1,2,5,6", (p) => {
      p.style = "area";
      p.fillStyle = "fade";
      p.coloring = "bands";
      p.bands = [{ id: "B1", upTo: 3, colorHex: "#00FF00" }];
      p.bandAboveColorHex = "#FF0000";
      p.fillBands = true;
    });
    expect(count(svg, "<linearGradient")).toBe(2);
    expect(count(svg, "fill=url(#chartfade-")).toBe(3);
    expect(svg).toContain("gradientUnits=\"userSpaceOnUse\"");
  });

  it("keeps a flat fill at 28 % with no gradient, and a fill colour of its own", () => {
    const flat = draw("1,2,5,6", (p) => { p.style = "area"; p.fillStyle = "flat"; p.fillColorHex = "#0A84FF"; });
    expect(flat).not.toContain("<linearGradient");
    expect(flat).toContain("fill=#0A84FF fill-opacity=0.28");
  });

  it("draws every dot of one colour in one path, before the highlight dots", () => {
    const svg = draw("1,2,5,6", (p) => { p.style = "line"; p.pointDots = "all"; p.highlight = "highest"; p.marker = "none"; });
    // Four readings, but the highest keeps only its highlight dot, so no ring
    // of the reading dot shows around it.
    expect(count(svg, " a1.8 1.8 0 1 0 3.6 0")).toBe(3);
    expect(svg.indexOf(" a1.8 1.8")).toBeLessThan(svg.indexOf("<circle"));
  });

  it("draws grid and zero lines under the series", () => {
    const svg = draw("-2,4,1,6", (p) => { p.style = "line"; p.baseline = "zero"; p.gridLines = 2; p.zeroLine = true; });
    expect(count(svg, "stroke-width=\"1\"")).toBe(3);
    expect(svg.indexOf("stroke-width=\"1\"")).toBeLessThan(svg.indexOf("stroke-linejoin"));
  });

  it("runs a fade from the plot bottom when the baseline sits at the top", () => {
    const grads = (svg: string) => [...svg.matchAll(/y1=([-\d.]+) x2="0" y2=([-\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
    // Every reading below zero on a zero baseline: zero is the top of the plot.
    const under = grads(draw("-5,-2,-3", (p) => { p.style = "area"; p.fillStyle = "fade"; p.baseline = "zero"; }));
    expect(under).toHaveLength(1);
    expect(under[0]![0]).toBeGreaterThan(under[0]![1]!);
    const over = grads(draw("1,2,5", (p) => { p.style = "area"; p.fillStyle = "fade"; }));
    expect(over[0]![0]).toBeLessThan(over[0]![1]!);
  });

  it("gives every drawing its own gradient ids", () => {
    const ids = (svg: string) => [...svg.matchAll(/<linearGradient id=([^\s>]+)/g)].map((m) => m[1]);
    const one = ids(draw("1,2,5", (p) => { p.style = "area"; p.fillStyle = "fade"; }));
    const two = ids(draw("1,2,5", (p) => { p.style = "area"; p.fillStyle = "fade"; }));
    expect(one).toHaveLength(1);
    expect(one[0]).not.toBe(two[0]);
    const svg = draw("1,2,5", (p) => { p.style = "area"; p.fillStyle = "fade"; });
    const id = ids(svg)[0]!;
    expect(svg).toContain(`fill=url(#${id})`);
  });

  it("gives every drawing of an image its own clip id", () => {
    const cfg = newConfig("Picture", 0);
    const img = newElement("image");
    img.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
    cfg.elements.push(img);
    const clip = () => {
      const layout = resolveAll(cfg, { entityStates: new Map(), templateResults: new Map(), namedValues: [] }).rectangular!;
      return /clipPath id=(imgclip-[^\s>]+)/.exec(flatten(renderLayout(layout, { icons: noIcons })))?.[1];
    };
    const a = clip();
    expect(a).toBeDefined();
    expect(a).not.toBe(clip());
  });
});

describe("bar corners", () => {
  function draw(state: string, tweak: (p: ChartElement) => void): string {
    const { cfg } = chartConfig(state, tweak);
    return flatten(renderLayout(rectangular(cfg, state), { icons: noIcons }));
  }

  function written(extra: Record<string, unknown>) {
    const { cfg } = chartConfig("1,2,3");
    const enc = encodeConfig(cfg) as { elements: { payload: Record<string, unknown> }[] };
    Object.assign(enc.elements[0]!.payload, extra);
    const back = parseConfig(enc).elements[0]!;
    if (back.kind !== "chart") throw new Error("expected a chart");
    return { chart: back.payload, payload: (encodeConfig(parseConfig(enc)) as typeof enc).elements[0]!.payload };
  }

  it("omits both keys at their defaults and reads bad values leniently", () => {
    for (const key of ["barRadius", "barCorners"]) expect(key in written({}).payload, key).toBe(false);
    expect("barRadius" in written({ barRadius: 1.2 }).payload).toBe(false);
    expect("barCorners" in written({ barCorners: "all" }).payload).toBe(false);
    expect("barCorners" in written({ barCorners: "rounded" }).payload).toBe(false);
    expect("barRadius" in written({ barRadius: "3" }).payload).toBe(false);
    expect(written({ barRadius: -4 }).payload.barRadius).toBe(0);
    expect(written({ barRadius: 3, barCorners: "top" }).chart).toMatchObject({ barRadius: 3, barCorners: "top" });
  });

  it("writes the keys between fillColorHex and pointDots, and gaps after smoothing", () => {
    const keys = Object.keys(written({
      gaps: true, smoothing: 3, pointDots: "all", barCorners: "top", barRadius: 2, fillColorHex: "#0A84FF", curve: "smooth",
    }).payload);
    const from = keys.indexOf("curve");
    expect(keys.slice(from)).toEqual(["curve", "fillStyle", "fillColorHex", "barRadius", "barCorners", "pointDots", "smoothing", "gaps"]);
    const dressed = chartConfig("1", (p) => { p.barRadius = 2; p.barCorners = "top"; p.gaps = true; });
    expect(auditUnknownKeys(encodeConfig(dressed.cfg))).toEqual([]);
  });

  it("keeps a rect with today's radius on every corner by default", () => {
    const svg = draw("1,2,3", () => {});
    expect(count(svg, "rx=1.2")).toBe(3);
    expect(svg).not.toMatch(/<path d=M[^>]* A/);
  });

  it("clamps the radius to half the bar", () => {
    const svg = draw("1,2,3", (p) => { p.barRadius = 500; });
    const bar = rects(svg)[0]!;
    const rx = Number(/rx=([\d.]+)/.exec(svg.slice(svg.indexOf(`width=${bar.w}`)))![1]);
    expect(rx).toBeCloseTo(Math.min(bar.w / 2, bar.h / 2), 9);
  });

  it("rounds only the end away from the baseline", () => {
    const top = chartBarPath({ x: 0, y: 10, w: 8, h: 20 }, 3, false);
    expect(top).toBe("M0 30 L0 13 A3 3 0 0 1 3 10 L5 10 A3 3 0 0 1 8 13 L8 30 Z");
    const bottom = chartBarPath({ x: 0, y: 10, w: 8, h: 20 }, 3, true);
    expect(bottom).toBe("M0 10 L8 10 L8 27 A3 3 0 0 1 5 30 L3 30 A3 3 0 0 1 0 27 Z");
    expect(chartBarPath({ x: 0, y: 0, w: 4, h: 4 }, 0, false)).not.toContain("A");

    // With a zero baseline a negative bar rounds its bottom end.
    const svg = draw("-2,4", (p) => { p.baseline = "zero"; p.barCorners = "top"; p.barRadius = 3; });
    const paths = [...svg.matchAll(/<path d=(M[^\s]+ [^\s]+ L[^"]*?Z)/g)].map((m) => m[1]!);
    expect(paths).toHaveLength(2);
    expect(paths[0]!.startsWith("M") && /L[-\d.]+ [-\d.]+ A/.test(paths[0]!)).toBe(true);
    // The negative bar's path starts along its flat top edge.
    expect(paths[0]).toMatch(/^M[-\d.]+ [-\d.]+ L[-\d.]+ [-\d.]+ L[-\d.]+ [-\d.]+ A/);
    // The positive bar's path climbs from its flat bottom straight into a corner.
    expect(paths[1]).toMatch(/^M[-\d.]+ [-\d.]+ L[-\d.]+ [-\d.]+ A/);
  });

  const count = (s: string, needle: string) => s.split(needle).length - 1;
});

describe("gaps for unavailable", () => {
  const F = false;
  const T = true;

  function recorderChart(series: string, tweak: (p: ChartElement) => void = () => {}) {
    const cfg = newConfig("Gaps", 0);
    const el = newElement("chart") as Extract<Element, { kind: "chart" }>;
    el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
    el.payload.value = { kind: { kind: "entityState", entityId: "sensor.t", displayName: "T", domain: "sensor" } };
    el.payload.historyMinutes = 360;
    el.payload.historyPoints = 24;
    el.payload.source = "history";
    el.payload.gaps = true;
    tweak(el.payload);
    cfg.elements.push(el);
    const key = chartHistoryKey(el.payload) ?? chartStatisticsKey(el.payload)!;
    const layout = resolveAll(cfg, {
      entityStates: new Map([["sensor.t", { entityId: "sensor.t", state: "1", domain: "sensor", iconName: "" }]]),
      templateResults: new Map(),
      namedValues: cfg.values,
      historySeries: new Map([[key, series]]),
    }).rectangular!;
    return { cfg, key, layout, chart: chartOf(layout), svg: () => flatten(renderLayout(layout, { icons: noIcons })) };
  }

  describe("reading a fetched series", () => {
    it("keeps an empty field as a hole carrying the reading before it", () => {
      expect(chartSeriesWithHoles("4,,,6,5")).toEqual({ values: [4, 4, 4, 6, 5], holes: [F, T, T, F, F] });
      expect(chartSeriesWithHoles("12.1, ,13.0")).toEqual({ values: [12.1, 12.1, 13], holes: [F, T, F] });
    });

    it("gives leading holes the first reading", () => {
      expect(chartSeriesWithHoles(",,3,,4")).toEqual({ values: [3, 3, 3, 3, 4], holes: [T, T, F, T, F] });
    });

    it("reads no readings at all as an empty series", () => {
      expect(chartSeriesWithHoles(",, ,")).toEqual({ values: [], holes: [] });
      expect(chartSeriesWithHoles("")).toEqual({ values: [], holes: [] });
    });

    it("normalises a series with no holes to an empty mask, and still skips junk", () => {
      expect(chartSeriesWithHoles("1,2,3")).toEqual({ values: [1, 2, 3], holes: [] });
      expect(chartSeriesWithHoles("1,junk,2")).toEqual({ values: [1, 2], holes: [] });
    });

    it("leaves the text parser alone", () => {
      expect(chartNumbers("4,,,6")).toEqual([4, 6]);
    });
  });

  describe("keys and requests", () => {
    it("appends |gaps to both readable keys only when the chart asks", () => {
      const history = recorderChart("1").cfg.elements[0]!.payload as ChartElement;
      expect(chartHistoryKey(history)).toBe("sensor.t|360|24|gaps");
      history.gaps = false;
      expect(chartHistoryKey(history)).toBe("sensor.t|360|24");
      const stats = recorderChart("1", (p) => { p.source = "statistics"; p.statPeriod = "hour"; p.statType = "mean"; }).cfg.elements[0]!.payload as ChartElement;
      expect(chartStatisticsKey(stats)).toBe("sensor.t|360|hour|mean|gaps");
      delete stats.gaps;
      expect(chartStatisticsKey(stats)).toBe("sensor.t|360|hour|mean");
    });

    it("sends gaps on the websocket only when true", () => {
      const withGaps = recorderChart("1").cfg;
      const [asked] = chartHistoryRequests(withGaps);
      expect(historySeriesRequest(asked!)).toEqual({ entity_id: "sensor.t", minutes: 360, points: 24, gaps: true });
      (withGaps.elements[0]!.payload as ChartElement).gaps = false;
      const plain = historySeriesRequest(chartHistoryRequests(withGaps)[0]!);
      expect("gaps" in plain).toBe(false);

      const stats = recorderChart("1", (p) => { p.source = "statistics"; }).cfg;
      const statAsked = chartStatisticsRequests(stats)[0]!;
      expect(statisticsSeriesRequest(statAsked).gaps).toBe(true);
      (stats.elements[0]!.payload as ChartElement).gaps = false;
      expect("gaps" in statisticsSeriesRequest(chartStatisticsRequests(stats)[0]!)).toBe(false);
    });

    it("omits gaps from the payload when false", () => {
      const { cfg } = chartConfig("1", (p) => { p.gaps = false; });
      const payload = (encodeConfig(cfg) as { elements: { payload: Record<string, unknown> }[] }).elements[0]!.payload;
      expect("gaps" in payload).toBe(false);
    });
  });

  describe("reading the series", () => {
    it("carries holes into the resolved chart", () => {
      const { chart } = recorderChart("4,,,6,5");
      expect(chart.values).toEqual([4, 4, 4, 6, 5]);
      expect(chart.holes).toEqual([F, T, T, F, F]);
      expect(recorderChart("4,5").chart.holes).toEqual([]);
    });

    it("trims holes in step with the limit", () => {
      expect(recorderChart("1,,3,4", (p) => { p.limit = 3; p.takeFromEnd = true; }).chart.holes).toEqual([T, F, F]);
      expect(recorderChart("1,2,,4", (p) => { p.limit = 2; }).chart.holes).toEqual([]);
    });

    it("averages across a hole without counting it, and re-carries the hole from the output", () => {
      expect(chartMovingAverage([1, 1, 9, 3, 5], 3, [F, F, T, F, F])).toEqual([1, 1, 1, 4, 4]);
      // Leading holes take the first real output.
      expect(chartMovingAverage([3, 3, 3, 5], 3, [T, T, F, F])).toEqual([4, 4, 4, 4]);
      // Without smoothing nothing changes.
      expect(chartMovingAverage([1, 1, 9], 0, [F, T, F])).toEqual([1, 1, 9]);
    });

    it("never highlights a hole", () => {
      // Averaged, the readings are 5, 5, 1, 1 with the hole carrying the 5
      // before it; the highlight picks the first real 5.
      const { chart } = recorderChart("1,9,,1,1", (p) => { p.smoothing = 3; p.highlight = "highest"; });
      expect(chart.values).toEqual([5, 5, 5, 1, 1]);
      expect(chart.highIndex).toBe(0);
      // A hole that would be first to the highest value is still passed over.
      const { chart: led } = recorderChart(",9,1", (p) => { p.highlight = "highest"; });
      expect(led.values).toEqual([9, 9, 1]);
      expect(led.highIndex).toBe(1);
    });

    it("reads stats from real readings only", () => {
      const r = { values: [3, 4, 4], holes: [F, F, T], domainMin: 3, domainMax: 4 };
      expect(chartStatValue(r, "latest")).toBe(4);
      expect(chartStatValue(r, "average")).toBe(3.5);
      expect(chartStatValue(r, "sum")).toBe(7);
      expect(chartStatValue({ values: [2, 2, 5], holes: [F, T, F], domainMin: 2, domainMax: 5 }, "delta")).toBe(3);
    });
  });

  describe("drawing", () => {
    it("splits into runs that never cross a hole", () => {
      expect(chartRuns(5, [F, F, T, F, F])).toEqual([[0, 1], [3, 4]]);
      expect(chartRuns(3, [])).toEqual([[0, 1, 2]]);
      expect(chartRuns(4, [T, F, F, T])).toEqual([[1, 2]]);
    });

    it("draws a line and a fill per run, and nothing for a lone reading", () => {
      const strokes = (svg: string) => svg.split("stroke-linejoin").length - 1;
      const fills = (svg: string) => svg.split("stroke=\"none\"").length - 1;
      // Against the same chart with no hole, which is one run: the layout adds
      // `stroke="none"` chrome of its own, so compare rather than count outright.
      const area = (p: ChartElement) => { p.style = "area"; p.curve = "smooth"; p.fillStyle = "flat"; };
      const whole = recorderChart("1,2,3,4,5", area).svg();
      const split = recorderChart("1,2,,4,5", area).svg();
      expect(strokes(whole)).toBe(1);
      expect(strokes(split)).toBe(2);
      expect(fills(split)).toBe(fills(whole) + 1);
      // No stroke path reaches from before the hole to after it.
      const { chart } = recorderChart("1,2,,4,5", (p) => { p.style = "line"; });
      const g = chartGeometry(chart, { x: 0, y: 0, w: 181, h: 60, cx: 90.5, cy: 30 });
      const holeX = g.point(2).x;
      for (const m of recorderChart("1,2,,4,5", (p) => { p.style = "line"; }).svg().matchAll(/<path d=(M[^"]*?) fill="none"/g)) {
        const xs = [...m[1]!.matchAll(/[MLC]([-\d.]+) /g)].map((x) => Number(x[1]));
        expect(xs.every((x) => x < holeX) || xs.every((x) => x > holeX)).toBe(true);
      }
      const lone = recorderChart("1,,3,,5", (p) => { p.style = "area"; }).svg();
      expect(strokes(lone)).toBe(0);
      expect(fills(lone)).toBe(fills(whole) - 1);
    });

    it("skips the bar and the reading dot at a hole", () => {
      const bars = recorderChart("1,,3", (p) => { p.style = "bars"; }).svg();
      expect(rects(bars)).toHaveLength(2);
      const dots = recorderChart("1,,3,4", (p) => { p.style = "line"; p.pointDots = "all"; }).svg();
      expect(dots.split(" a1.8 1.8 0 1 0 3.6 0").length - 1).toBe(3);
    });
  });
});
