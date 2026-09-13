// A bars chart's border and fill colours: the wire keys, the precedence the
// resolver picks each bar's colours by, and how the preview draws the border.
// The shared contract is `fixtures/chart_bar_border.json`; these cases cover
// what one fixture cannot: omission at the defaults, clamping, and drawing.

import { describe, expect, it } from "vitest";
import {
  auditUnknownKeys,
  encodeConfig,
  newConfig,
  newElement,
  parseConfig,
  type ChartElement,
  type CustomComplicationConfig,
  type Element,
  type GaugeElement,
} from "../src/model.js";
import { resolveAll, type ResolvedChart, type EntityState } from "../src/resolver.js";
import { renderLayout, type IconProvider } from "../src/renderer.js";

const noIcons: IconProvider = { render: () => undefined, available: () => false, names: () => undefined };

function flatten(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in (node as object) && "values" in (node as object)) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  if (typeof node === "symbol") return "";
  return String(node);
}

function chartConfig(state: string, tweak: (p: ChartElement) => void = () => {}) {
  const cfg = newConfig("Prices", 0);
  const el = newElement("chart") as Extract<Element, { kind: "chart" }>;
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  el.payload.value = { kind: { kind: "entityState", entityId: "sensor.prices", displayName: "Prices", domain: "sensor" } };
  el.payload.historyMinutes = 0;
  el.payload.highlight = "none";
  tweak(el.payload);
  cfg.elements.push(el);
  return { cfg, state };
}

function resolved(cfg: CustomComplicationConfig, state: string) {
  const entityStates = new Map<string, EntityState>([
    ["sensor.prices", { entityId: "sensor.prices", state, domain: "sensor", iconName: "chart.bar" }],
  ]);
  return resolveAll(cfg, { entityStates, templateResults: new Map(), namedValues: cfg.values }).rectangular!;
}

function chartOf(cfg: CustomComplicationConfig, state: string): ResolvedChart {
  const el = resolved(cfg, state).elements.find((e) => e.kind === "chart");
  if (!el || el.kind !== "chart") throw new Error("no chart");
  return el;
}

function draw(cfg: CustomComplicationConfig, state: string): string {
  return flatten(renderLayout(resolved(cfg, state), { icons: noIcons }));
}

/** The chart's payload after one write and read, with `extra` keys added on the wire. */
function roundTrip(extra: Record<string, unknown>, bands?: Record<string, unknown>[]) {
  const { cfg } = chartConfig("1,2,3");
  const enc = encodeConfig(cfg) as { elements: { payload: Record<string, unknown> }[] };
  Object.assign(enc.elements[0]!.payload, extra);
  if (bands) enc.elements[0]!.payload.bands = bands;
  const back = parseConfig(enc);
  const payload = (encodeConfig(back) as typeof enc).elements[0]!.payload;
  return { chart: back.elements[0]!.payload as ChartElement, payload, audit: auditUnknownKeys(enc) };
}

describe("bar border and fill keys", () => {
  it("writes none of the new keys for a chart that uses none", () => {
    const { payload } = roundTrip({});
    for (const key of ["barBorderWidth", "barBorderColorHex", "bandAboveFillColorHex", "bandAboveBorderColorHex", "fillColorHex"]) {
      expect(key in payload, key).toBe(false);
    }
    expect("barBorderWidth" in roundTrip({ barBorderWidth: 0 }).payload).toBe(false);
    expect("barBorderWidth" in roundTrip({ barBorderWidth: "2" }).payload).toBe(false);
  });

  it("round-trips every key, on the chart and on its bands, without unknown keys", () => {
    const { chart, payload, audit } = roundTrip(
      { barBorderWidth: 9, barBorderColorHex: "#FFD60A", bandAboveFillColorHex: "#11111180", bandAboveBorderColorHex: "#222222" },
      [{ id: "B1", upTo: 3, colorHex: "#32D74B", fillColorHex: "#32D74B66", borderColorHex: "#7CFF8A" }, { id: "B2", upTo: 6, colorHex: "#FFD60A" }],
    );
    expect(audit).toEqual([]);
    // Stored as written; the clamp is the resolver's.
    expect(chart.barBorderWidth).toBe(9);
    expect(payload).toMatchObject({ barBorderWidth: 9, barBorderColorHex: "#FFD60A", bandAboveFillColorHex: "#11111180", bandAboveBorderColorHex: "#222222" });
    expect(payload.bands).toEqual([
      { id: "B1", upTo: 3, colorHex: "#32D74B", fillColorHex: "#32D74B66", borderColorHex: "#7CFF8A" },
      { id: "B2", upTo: 6, colorHex: "#FFD60A" },
    ]);
  });

  it("keeps the band keys on a gauge's table, which ignores them", () => {
    const cfg = newConfig("Gauge", 0);
    const g = newElement("gauge") as Extract<Element, { kind: "gauge" }>;
    cfg.elements.push(g);
    const enc = encodeConfig(cfg) as { elements: { payload: Record<string, unknown> }[] };
    enc.elements[0]!.payload.bands = [{ id: "G1", upTo: 5, colorHex: "#FF0000", fillColorHex: "#00FF00", borderColorHex: "#0000FF" }];
    expect(auditUnknownKeys(enc)).toEqual([]);
    const back = parseConfig(enc);
    expect((back.elements[0]!.payload as GaugeElement).bands[0]).toMatchObject({ fillColorHex: "#00FF00", borderColorHex: "#0000FF" });
    const again = encodeConfig(back) as typeof enc;
    expect(again.elements[0]!.payload.bands).toEqual(enc.elements[0]!.payload.bands);
  });
});

describe("resolving bar border and fill", () => {
  it("clamps the width to 0…6 and reads a negative one as off", () => {
    expect(chartOf(chartConfig("1,2").cfg, "1,2").barBorderWidth).toBe(0);
    expect(chartOf(chartConfig("1,2", (p) => { p.barBorderWidth = 20; }).cfg, "1,2").barBorderWidth).toBe(6);
    const negative = chartOf(chartConfig("1,2", (p) => { p.barBorderWidth = -1; }).cfg, "1,2");
    expect(negative.barBorderWidth).toBe(0);
    expect(negative.barBorderColorHexes).toEqual([]);
  });

  it("resolves a line or an area as no border and no bar colours", () => {
    for (const style of ["line", "area"] as const) {
      const c = chartOf(chartConfig("1,2,3", (p) => { p.style = style; p.barBorderWidth = 2; p.fillColorHex = "#000000"; }).cfg, "1,2,3");
      expect(c.barBorderWidth).toBe(0);
      expect(c.barFillColorHexes).toEqual([]);
      expect(c.barBorderColorHexes).toEqual([]);
    }
  });

  it("fills a one-colour bar in the series colour and borders it in white when nothing is set", () => {
    const { cfg, state } = chartConfig("1,2", (p) => { p.style = "bars"; p.colorSlot.baseColorHex = "#0A84FF"; p.barBorderWidth = 1; });
    const c = chartOf(cfg, state);
    expect(c.barFillColorHexes).toEqual(["#0A84FF", "#0A84FF"]);
    expect(c.barBorderColorHexes).toEqual(["#FFFFFF", "#FFFFFF"]);
  });

  it("puts a band's own colour over the chart's, the chart's over the band colour, and a highlight over all", () => {
    const { cfg, state } = chartConfig("2,5,9,1", (p) => {
      p.style = "bars";
      p.coloring = "bands";
      p.bands = [
        { id: "A", upTo: 3, colorHex: "#00AA00", fillColorHex: "#00AA0066" },
        { id: "B", upTo: 6, colorHex: "#AAAA00", borderColorHex: "#FFFF00" },
      ];
      p.bandAboveColorHex = "#AA0000";
      p.bandAboveBorderColorHex = "#FF0000";
      p.fillColorHex = "#333333";
      p.barBorderColorHex = "#EEEEEE";
      p.barBorderWidth = 2;
      p.highlight = "lowest";
    });
    const c = chartOf(cfg, state);
    expect(c.lowIndex).toBe(3);
    expect(c.barFillColorHexes).toEqual(["#00AA0066", "#333333", "#333333", c.lowColorHex]);
    expect(c.barBorderColorHexes).toEqual(["#EEEEEE", "#FFFF00", "#FF0000", c.lowColorHex]);
  });
});

describe("drawing a bar border", () => {
  it("draws exactly as before while the border is off", () => {
    // A colour with no width draws nothing new. SVG ids differ per render, so
    // they are blanked before comparing.
    const ids = (s: string) => s.replace(/(id=|url\(#)[^\s>)"]+/g, "$1_");
    const plain = chartConfig("1,2,3", (p) => { p.style = "bars"; });
    const coloured = chartConfig("1,2,3", (p) => { p.style = "bars"; p.barBorderColorHex = "#FF0000"; });
    const svg = ids(draw(plain.cfg, plain.state));
    expect(svg).not.toContain('fill="none" stroke=');
    expect(ids(draw(coloured.cfg, coloured.state))).toBe(svg);
  });

  it("strokes the border inside the bar, never outside it", () => {
    const { cfg, state } = chartConfig("10,20", (p) => { p.style = "bars"; p.barBorderWidth = 2; p.barBorderColorHex = "#FF0000"; p.barGap = 10; });
    const svg = draw(cfg, state);
    const strokes = [...svg.matchAll(/<rect x=([-\d.]+) y=([-\d.]+) width=([-\d.]+) height=([-\d.]+) rx=[-\d.]+\s+fill="none" stroke=#FF0000/g)];
    expect(strokes).toHaveLength(2);
    const bars = [...svg.matchAll(/<rect x=([-\d.]+) y=([-\d.]+) width=([-\d.]+) height=([-\d.]+) rx=[-\d.]+\s+fill=#FFFFFF/g)];
    expect(bars).toHaveLength(2);
    const [bx, by, bw, bh] = bars[0]!.slice(1).map(Number) as [number, number, number, number];
    const [sx, sy, sw, sh] = strokes[0]!.slice(1).map(Number) as [number, number, number, number];
    expect(sx).toBeCloseTo(bx + 1, 9);
    expect(sy).toBeCloseTo(by + 1, 9);
    expect(sw).toBeCloseTo(bw - 2, 9);
    expect(sh).toBeCloseTo(bh - 2, 9);
  });

  it("paints a bar too small for its border solid in the border colour", () => {
    const { cfg, state } = chartConfig("1,2,3", (p) => {
      p.style = "bars"; p.barBorderWidth = 6; p.barBorderColorHex = "#FF0000"; p.baseline = "lowest";
      p.frame = { x: 0, y: 0, width: 0.05, height: 1, rotationDegrees: 0 };
    });
    const svg = draw(cfg, state);
    expect(svg).not.toContain('fill="none" stroke=#FF0000');
    expect((svg.match(/fill=#FF0000/g) ?? []).length).toBe(3);
  });

  it("follows a top-only outline with a path", () => {
    const { cfg, state } = chartConfig("10,20", (p) => { p.style = "bars"; p.barCorners = "top"; p.barRadius = 3; p.barBorderWidth = 1; p.barBorderColorHex = "#FF0000"; });
    const svg = draw(cfg, state);
    expect((svg.match(/fill="none" stroke=#FF0000/g) ?? []).length).toBe(2);
    expect(svg).toMatch(/<path d=M[^>]* A2\.5 2\.5 [^>]*fill="none" stroke=#FF0000/);
  });
});
