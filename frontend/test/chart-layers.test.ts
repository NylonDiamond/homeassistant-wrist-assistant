// A chart's reading dots (`chartDots`), grid lines (`chartGrid`) and line at
// zero (a layer anchored `zero`) as layers of their own: the wire, the Extras
// helpers, the inset the dots give their chart, and how each draws.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  addChartDots,
  addChartGrid,
  addChartZeroLine,
  auditUnknownKeys,
  CHART_ZERO_LINE_HEX,
  chartDotsOf,
  chartGridsOf,
  chartMarkersOf,
  chartZeroLinesOf,
  encodeConfig,
  groupOf,
  newConfig,
  newElement,
  parseConfig,
  removeElement,
  type ChartElement,
  type CustomComplicationConfig,
  type Element,
} from "../src/model.js";
import { layerTitle } from "../src/editors.js";
import { renderLayout, type IconProvider } from "../src/renderer.js";
import {
  chartGeometry,
  chartGridYs,
  chartZeroFraction,
  resolveAll,
  type EntityState,
  type ResolvedChart,
  type ResolvedElement,
  type ResolvedLayout,
} from "../src/resolver.js";

type Dots = Extract<Element, { kind: "chartDots" }>;
type Grid = Extract<Element, { kind: "chartGrid" }>;

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

function chartConfig(state: string, tweak: (p: ChartElement) => void = () => {}) {
  const cfg = newConfig("Prices", 0);
  const el = newElement("chart") as Extract<Element, { kind: "chart" }>;
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  el.payload.value = { kind: { kind: "entityState", entityId: "sensor.prices", displayName: "Prices", domain: "sensor" } };
  el.payload.historyMinutes = 0;
  el.payload.style = "line";
  el.payload.lineWidth = 2;
  tweak(el.payload);
  cfg.elements.push(el);
  return { cfg, id: el.payload.id };
}

function rectangular(cfg: CustomComplicationConfig, state: string): ResolvedLayout {
  const entityStates = new Map<string, EntityState>([
    ["sensor.prices", { entityId: "sensor.prices", state, domain: "sensor", iconName: "" }],
  ]);
  return resolveAll(cfg, { entityStates, templateResults: new Map(), namedValues: cfg.values }).rectangular!;
}

const find = <K extends ResolvedElement["kind"]>(layout: ResolvedLayout, kind: K): Extract<ResolvedElement, { kind: K }> =>
  layout.elements.find((e) => e.kind === kind) as Extract<ResolvedElement, { kind: K }>;

const layerOf = <T extends Element>(cfg: CustomComplicationConfig, id: string | undefined) =>
  cfg.elements.find((e) => e.payload.id === id) as T;

const payloadOf = (cfg: CustomComplicationConfig, id: string) =>
  ((encodeConfig(cfg).elements as { payload: Record<string, unknown> }[]).find((e) => e.payload.id === id))!.payload;

/** Reparse a document after changing one layer's raw payload. */
function reread(cfg: CustomComplicationConfig, id: string, patch: Record<string, unknown>) {
  const raw = JSON.parse(JSON.stringify(encodeConfig(cfg)));
  Object.assign(raw.elements.find((e: { payload: { id: string } }) => e.payload.id === id).payload, patch);
  const back = parseConfig(raw);
  return { el: layerOf(back, id), written: payloadOf(back, id) };
}

const series = (n: number) => Array.from({ length: n }, (_, i) => (i % 5) + 1).join(",");

// ── wire ──────────────────────────────────────────────────────────────────

describe("chartDots on the wire", () => {
  it("writes only the keys it needs, in order, with no colorSlot", () => {
    const { cfg, id } = chartConfig("1,2,3");
    const dots = addChartDots(cfg, id)!;
    expect(Object.keys(payloadOf(cfg, dots))).toEqual(["id", "rules", "frame", "isHidden", "chart", "groupId"]);
    const layer = layerOf<Dots>(cfg, dots);
    layer.payload.dots = "all";
    layer.payload.size = 5;
    layer.payload.colorHex = "#FF9F0A";
    expect(Object.keys(payloadOf(cfg, dots))).toEqual(["id", "rules", "frame", "isHidden", "chart", "dots", "size", "colorHex", "groupId"]);
    const raw = JSON.parse(JSON.stringify(encodeConfig(cfg)));
    expect(auditUnknownKeys(raw)).toEqual([]);
    expect(layerOf<Dots>(parseConfig(raw), dots).payload).toMatchObject({ chart: id, dots: "all", size: 5, colorHex: "#FF9F0A" });
  });

  it("reads leniently: an unknown spelling is auto, a size is clamped, a wrong type is absent", () => {
    const { cfg, id } = chartConfig("1,2,3");
    const dots = addChartDots(cfg, id)!;
    expect(reread(cfg, dots, { dots: "some" }).el.payload).toMatchObject({ dots: "auto" });
    expect("dots" in reread(cfg, dots, { dots: "auto" }).written).toBe(false);
    expect(reread(cfg, dots, { size: 40 }).written.size).toBe(12);
    expect(reread(cfg, dots, { size: 0.2 }).written.size).toBe(1);
    expect(reread(cfg, dots, { size: 3.5 }).written.size).toBe(3.5);
    for (const bad of ["5", null, true]) {
      const { el, written } = reread(cfg, dots, { size: bad, colorHex: 7 });
      expect((el as Dots).payload.size).toBeUndefined();
      expect((el as Dots).payload.colorHex).toBeUndefined();
      expect("size" in written || "colorHex" in written).toBe(false);
    }
  });
});

describe("chartGrid on the wire", () => {
  it("omits every key at its default and writes the rest in order", () => {
    const { cfg, id } = chartConfig("1,2,3");
    const grid = addChartGrid(cfg, id)!;
    expect(Object.keys(payloadOf(cfg, grid))).toEqual(["id", "rules", "frame", "isHidden", "chart", "groupId"]);
    expect("colorHex" in reread(cfg, grid, { lines: 3, colorHex: "#ffffff33", thickness: 1 }).written).toBe(false);
    const layer = layerOf<Grid>(cfg, grid);
    layer.payload.lines = 2;
    layer.payload.colorHex = "#FF9F0A66";
    layer.payload.thickness = 0.5;
    expect(Object.keys(payloadOf(cfg, grid))).toEqual(["id", "rules", "frame", "isHidden", "chart", "lines", "colorHex", "thickness", "groupId"]);
    expect(auditUnknownKeys(JSON.parse(JSON.stringify(encodeConfig(cfg))))).toEqual([]);
  });

  it("clamps lines into 1 to 4 and thickness into 0.25 to 4, and reads a wrong type as the default", () => {
    const { cfg, id } = chartConfig("1,2,3");
    const grid = addChartGrid(cfg, id)!;
    expect(reread(cfg, grid, { lines: 9 }).written.lines).toBe(4);
    expect(reread(cfg, grid, { lines: 0 }).written.lines).toBe(1);
    expect(reread(cfg, grid, { lines: 2.4 }).written.lines).toBe(2);
    expect((reread(cfg, grid, { lines: "2" }).el as Grid).payload.lines).toBe(3);
    expect(reread(cfg, grid, { thickness: 10 }).written.thickness).toBe(4);
    expect(reread(cfg, grid, { thickness: 0.1 }).written.thickness).toBe(0.25);
    expect((reread(cfg, grid, { thickness: "2" }).el as Grid).payload.thickness).toBe(1);
  });
});

// ── the Extras helpers ────────────────────────────────────────────────────

describe("adding and removing chart extras", () => {
  it("puts dots directly above the chart, on its frame, in its group", () => {
    const { cfg, id } = chartConfig("1,2,3", (p) => { p.frame = { x: 0.1, y: 0.2, width: 0.5, height: 0.4, rotationDegrees: 0 }; });
    const dots = addChartDots(cfg, id)!;
    const index = cfg.elements.findIndex((e) => e.payload.id === dots);
    expect(cfg.elements[index - 1]!.payload.id).toBe(id);
    const layer = layerOf<Dots>(cfg, dots);
    expect(layer.payload).toMatchObject({ chart: id, dots: "auto", frame: { x: 0.1, y: 0.2, width: 0.5, height: 0.4 } });
    expect(groupOf(cfg, dots)?.id).toBe(groupOf(cfg, id)?.id);
    expect(chartDotsOf(cfg, id).map((d) => d.payload.id)).toEqual([dots]);
    expect(layerTitle(layer)).toBe("Reading dots");
  });

  it("starts dots on All when the chart still carries the one-day pointDots all", () => {
    const { cfg, id } = chartConfig("1,2,3", (p) => { p.pointDots = "all"; });
    expect(layerOf<Dots>(cfg, addChartDots(cfg, id)).payload.dots).toBe("all");
  });

  it("puts grid lines directly below the chart, in its group", () => {
    const { cfg, id } = chartConfig("1,2,3");
    const grid = addChartGrid(cfg, id)!;
    const index = cfg.elements.findIndex((e) => e.payload.id === grid);
    expect(cfg.elements[index + 1]!.payload.id).toBe(id);
    expect(layerOf<Grid>(cfg, grid).payload).toMatchObject({ chart: id, lines: 3, colorHex: "#FFFFFF33", thickness: 1 });
    expect(groupOf(cfg, grid)?.id).toBe(groupOf(cfg, id)?.id);
    expect(chartGridsOf(cfg, id)).toHaveLength(1);
    expect(layerTitle(layerOf(cfg, grid))).toBe("Grid lines");
  });

  it("adds a line at zero as a line shape anchored zero, through the plot", () => {
    const { cfg, id } = chartConfig("1,2,3");
    const line = layerOf<Extract<Element, { kind: "shape" }>>(cfg, addChartZeroLine(cfg, id));
    expect(line.payload).toMatchObject({ kind: "line", thickness: 1, colorSlot: { baseColorHex: CHART_ZERO_LINE_HEX } });
    expect(line.payload.chartAnchor).toEqual({ layer: id, at: "zero", place: "through" });
    expect(chartZeroLinesOf(cfg, id)).toHaveLength(1);
    expect(layerTitle(line)).toBe("Zero line");
  });

  it("does nothing for a layer that is not a chart", () => {
    const cfg = newConfig("Text", 0);
    const text = newElement("text");
    cfg.elements.push(text);
    expect(addChartDots(cfg, text.payload.id)).toBeUndefined();
    expect(addChartGrid(cfg, text.payload.id)).toBeUndefined();
    expect(addChartZeroLine(cfg, text.payload.id)).toBeUndefined();
    expect(cfg.elements).toHaveLength(1);
  });

  it("takes dots and grid with a deleted chart, and leaves the zero line unpinned", () => {
    const { cfg, id } = chartConfig("1,2,3");
    const dots = addChartDots(cfg, id)!;
    const grid = addChartGrid(cfg, id)!;
    const zero = addChartZeroLine(cfg, id)!;
    removeElement(cfg, id);
    expect(cfg.elements.map((e) => e.payload.id)).toEqual([zero]);
    expect(cfg.elements.some((e) => e.payload.id === dots || e.payload.id === grid)).toBe(false);
    expect(chartMarkersOf(cfg, id)).toHaveLength(0);
  });
});

// ── resolving ─────────────────────────────────────────────────────────────

describe("chart dots resolved", () => {
  function dotted(n: number, mode: "auto" | "all", size?: number, tweak: (p: ChartElement) => void = () => {}) {
    const state = series(n);
    const { cfg, id } = chartConfig(state, tweak);
    const layer = layerOf<Dots>(cfg, addChartDots(cfg, id));
    layer.payload.dots = mode;
    if (size !== undefined) layer.payload.size = size;
    const layout = rectangular(cfg, state);
    return { cfg, layer, layout, chart: find(layout, "chart"), dots: find(layout, "chartDots") };
  }
  const box = { x: 0, y: 0, w: 181, h: 65.5, cx: 90.5, cy: 32.75 };

  it("draws auto dots only while the readings sit three dots apart, and insets the plot for them", () => {
    // Dots are 3.6 across at line width 2, so neighbours need 10.8 of room. The
    // spacing is measured on the plot the stroke leaves (181 less 1 each side):
    // 17 readings sit 11.19 apart and draw, 18 sit 10.53 apart and do not.
    const sparse = dotted(17, "auto");
    expect(sparse.dots.diameter).toBeCloseTo(3.6, 9);
    expect(sparse.dots.indices).toHaveLength(17);
    expect(sparse.chart.dotDiameter).toBeCloseTo(3.6, 9);
    expect(chartGeometry(sparse.chart, box).point(0).x).toBeCloseTo(1.8, 9);
    const crowded = dotted(18, "auto");
    expect(crowded.dots.indices).toEqual([]);
    expect(crowded.chart.dotDiameter).toBeUndefined();
    expect(chartGeometry(crowded.chart, box).point(0).x).toBeCloseTo(1, 9);
    expect(dotted(120, "all").dots.indices).toHaveLength(120);
    expect(dotted(1, "auto").dots.indices).toEqual([0]);
  });

  it("reads a set size for the auto rule and the inset, clamped", () => {
    // Diameter 6 wants a gap of 18 across 179 points: 10 readings sit 19.89 apart, 11 sit 17.9.
    expect(dotted(10, "auto", 6).dots.indices).toHaveLength(10);
    expect(dotted(11, "auto", 6).dots.indices).toEqual([]);
    expect(dotted(18, "auto", 3).dots.indices).toHaveLength(18);
    const big = dotted(10, "all", 6);
    expect(big.dots).toMatchObject({ size: 6, diameter: 6 });
    const g = chartGeometry(big.chart, box);
    expect(g.point(0).x).toBeCloseTo(3, 9);
    expect(g.plotTop).toBeCloseTo(3, 9);
    // A dot narrower than the stroke keeps the stroke inset.
    expect(chartGeometry(dotted(10, "all", 1).chart, box).point(0).x).toBeCloseTo(1, 9);
  });

  it("widens the inset for the largest shown drawing layer only", () => {
    const state = series(4);
    const { cfg, id } = chartConfig(state);
    const small = layerOf<Dots>(cfg, addChartDots(cfg, id));
    small.payload.size = 4;
    const hidden = layerOf<Dots>(cfg, addChartDots(cfg, id));
    hidden.payload.size = 12;
    hidden.payload.isHidden = true;
    const layout = rectangular(cfg, state);
    expect(find(layout, "chart").dotDiameter).toBe(4);
  });

  it("never draws on bars, and leaves out the readings the chart highlights", () => {
    const bars = dotted(3, "all", undefined, (p) => { p.style = "bars"; });
    expect(bars.dots.indices).toEqual([]);
    expect(bars.chart.dotDiameter).toBeUndefined();
    const marked = dotted(4, "all", undefined, (p) => { p.highlight = "both"; });
    expect(marked.chart.highIndex).toBe(3);
    expect(marked.chart.lowIndex).toBe(0);
    expect(marked.dots.indices).toEqual([1, 2]);
  });

  it("sits on the chart's frame, and keeps its own with no chart", () => {
    const { layout, layer } = dotted(3, "all", undefined, (p) => { p.frame = { x: 0.2, y: 0.1, width: 0.5, height: 0.5, rotationDegrees: 0 }; });
    expect(find(layout, "chartDots").frame).toEqual({ x: 0.2, y: 0.1, width: 0.5, height: 0.5, rotationDegrees: 0 });
    const { cfg } = dotted(3, "all");
    layerOf<Dots>(cfg, chartDotsOf(cfg, cfg.elements[0]!.payload.id)[0]!.payload.id).payload.chart = "NOPE";
    const orphan = find(rectangular(cfg, series(3)), "chartDots");
    expect(orphan).toMatchObject({ diameter: 0, indices: [] });
    expect(layer.payload.chart).not.toBe("NOPE");
  });
});

describe("chart grid resolved", () => {
  it("draws on a chart with readings, on its frame", () => {
    const { cfg, id } = chartConfig("1,2,3", (p) => { p.frame = { x: 0.5, y: 0, width: 0.5, height: 1, rotationDegrees: 0 }; });
    addChartGrid(cfg, id);
    const grid = find(rectangular(cfg, "1,2,3"), "chartGrid");
    expect(grid).toMatchObject({ draws: true, lines: 3, thickness: 1, frame: { x: 0.5, width: 0.5 } });
    expect(find(rectangular(cfg, "unavailable"), "chartGrid").draws).toBe(false);
  });

  it("spaces its lines evenly inside the plot, never on its edges", () => {
    expect(chartGridYs({ plotTop: 0, plotBottom: 60 }, 1)).toEqual([30]);
    expect(chartGridYs({ plotTop: 0, plotBottom: 60 }, 3)).toEqual([15, 30, 45]);
  });
});

describe("zero anchor", () => {
  it("names zero only while it is strictly inside the range", () => {
    expect(chartZeroFraction({ domainMin: -2, domainMax: 6 })).toBe(0.25);
    expect(chartZeroFraction({ domainMin: 0, domainMax: 6 })).toBeUndefined();
    expect(chartZeroFraction({ domainMin: -6, domainMax: 0 })).toBeUndefined();
    expect(chartZeroFraction({ domainMin: 1, domainMax: 6 })).toBeUndefined();
  });

  it("settles a line at the y of zero like a threshold, and hides it otherwise", () => {
    const state = "-2,4,1,6";
    const { cfg, id } = chartConfig(state, (p) => { p.baseline = "zero"; p.style = "bars"; });
    const zero = addChartZeroLine(cfg, id)!;
    const layout = rectangular(cfg, state);
    const chart = find(layout, "chart") as ResolvedChart;
    const line = layout.elements.find((e) => e.id === zero)!;
    const g = chartGeometry(chart, { x: 0, y: 0, w: 181, h: 65.5, cx: 90.5, cy: 32.75 });
    const h = line.frame.height * 65.5;
    expect(line.isHidden).toBe(false);
    expect(line.frame.y * 65.5 + h / 2).toBeCloseTo(g.yAtFraction(0.25), 9);
    expect(line.frame.width).toBeCloseTo(1, 9);
    const above = rectangular(cfg, "1,2,3").elements.find((e) => e.id === zero)!;
    expect(above.isHidden).toBe(true);
  });
});

// ── drawing ───────────────────────────────────────────────────────────────

describe("drawing chart dots and grid", () => {
  const count = (s: string, needle: string) => s.split(needle).length - 1;

  it("draws every dot of one colour in one path, leaving the highlighted reading to its own dot", () => {
    const state = "1,2,5,6";
    const { cfg, id } = chartConfig(state, (p) => { p.highlight = "highest"; p.marker = "none"; });
    layerOf<Dots>(cfg, addChartDots(cfg, id)).payload.dots = "all";
    const svg = flatten(renderLayout(rectangular(cfg, state), { icons: noIcons }));
    expect(count(svg, " a1.8 1.8 0 1 0 3.6 0")).toBe(3);
  });

  it("draws dots at a set size, in a set colour that beats the bands", () => {
    const state = "1,2,5,6";
    const { cfg, id } = chartConfig(state, (p) => {
      p.coloring = "bands";
      p.bands = [{ id: "B1", upTo: 3, colorHex: "#00FF00" }];
      p.bandAboveColorHex = "#FF0000";
    });
    const layer = layerOf<Dots>(cfg, addChartDots(cfg, id));
    layer.payload.dots = "all";
    layer.payload.size = 6;
    layer.payload.colorHex = "#FF9F0A";
    const svg = flatten(renderLayout(rectangular(cfg, state), { icons: noIcons }));
    expect(count(svg, " a3 3 0 1 0 6 0")).toBe(4);
    expect(count(svg, "fill=#FF9F0A")).toBe(1);
    // Without a colour of its own each dot takes its band.
    delete layer.payload.colorHex;
    const banded = flatten(renderLayout(rectangular(cfg, state), { icons: noIcons }));
    expect(count(banded, "M") > 0 && banded.includes("fill=#00FF00") && banded.includes("fill=#FF0000")).toBe(true);
  });

  it("draws grid lines at their thickness, behind the series when below the chart", () => {
    const state = "1,2,3";
    const { cfg, id } = chartConfig(state);
    const grid = layerOf<Grid>(cfg, addChartGrid(cfg, id));
    grid.payload.lines = 2;
    grid.payload.thickness = 0.5;
    const svg = flatten(renderLayout(rectangular(cfg, state), { icons: noIcons }));
    expect(count(svg, "stroke-width=0.5")).toBe(2);
    expect(svg.indexOf("stroke-width=0.5")).toBeLessThan(svg.indexOf("stroke-linejoin"));
  });
});
