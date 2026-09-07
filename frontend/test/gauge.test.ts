// The gauge layer: the colour table it can take, the threshold tick it puts on
// its scale, and the dots style.
//
// The resolution rules here are ports of the Swift in the app repo
// (`resolveGauge` and `dotCounts` in `CustomComplicationRendering.swift`), and
// the cases are the ones `CustomComplicationRulesTests` uses, so drift between
// the two implementations fails on both sides.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import { GAUGE_MAX_DOTS, literal, newConfig, newElement, type Element, type GaugeElement } from "../src/model.js";
import { renderLayout, type IconProvider } from "../src/renderer.js";
import { resolveAll, type EntityState, type ResolvedLayout } from "../src/resolver.js";

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

/** One gauge filling a rectangular face, resolved against a single sensor. */
function gaugeLayout(state: string, tweak: (p: GaugeElement) => void = () => {}): ResolvedLayout {
  const cfg = newConfig("Gauge", 0);
  const el = newElement("gauge") as Extract<Element, { kind: "gauge" }>;
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  el.payload.value = { kind: { kind: "entityState", entityId: "sensor.g", displayName: "G", domain: "sensor" } };
  tweak(el.payload);
  cfg.elements.push(el);
  const entityStates = new Map<string, EntityState>([
    ["sensor.g", { entityId: "sensor.g", state, domain: "sensor", iconName: "gauge" }],
  ]);
  return resolveAll(cfg, { entityStates, templateResults: new Map(), namedValues: cfg.values }).rectangular!;
}

function gaugeOf(state: string, tweak: (p: GaugeElement) => void = () => {}) {
  const el = gaugeLayout(state, tweak).elements.find((e) => e.kind === "gauge");
  if (!el || el.kind !== "gauge") throw new Error("no gauge layer resolved");
  return el;
}

/** Every `<circle>` the layout drew, as numbers. */
function circles(svg: string): { cx: number; cy: number; r: number }[] {
  const out: { cx: number; cy: number; r: number }[] = [];
  for (const m of svg.matchAll(/<circle cx="?([-\d.]+)"? cy="?([-\d.]+)"? r="?([-\d.]+)"?/g)) {
    out.push({ cx: Number(m[1]), cy: Number(m[2]), r: Number(m[3]) });
  }
  return out;
}

/** Turn a gauge into a colour table: `[upTo, colour]` steps plus the rest. */
function gaugeBands(p: GaugeElement, table: [number, string][], above = "#FF0000") {
  p.coloring = "bands";
  p.bands = table.map(([upTo, colorHex], i) => ({ id: `B${i}`, upTo, colorHex }));
  p.bandAboveColorHex = above;
}

/** A rule that always matches and paints the layer one colour. */
function alwaysSetColor(p: GaugeElement, hex: string) {
  p.rules = [{
    id: "R1",
    cases: [{
      id: "C1",
      when: { join: "all", tests: [] },
      then: [{ kind: "setColor", value: literal(hex) }],
    }],
  }];
}

describe("colouring a gauge by value", () => {
  it("stays one colour while the table is empty", () => {
    expect(gaugeOf("62", (p) => { p.coloring = "bands"; }).colorHex).toBe("#FFFFFF");
  });

  it("takes the colour of the row its reading falls in, lowest first", () => {
    const bands = (p: GaugeElement) => gaugeBands(p, [[20, "#FF453A"], [50, "#FF9F0A"]], "#32D74B");
    expect(gaugeOf("10", bands).colorHex).toBe("#FF453A");
    // A band says where it ends, so a reading sitting on a step belongs to it.
    expect(gaugeOf("20", bands).colorHex).toBe("#FF453A");
    expect(gaugeOf("35", bands).colorHex).toBe("#FF9F0A");
    expect(gaugeOf("62", bands).colorHex).toBe("#32D74B");
  });

  it("reads steps typed out of order lowest first anyway", () => {
    expect(gaugeOf("35", (p) => gaugeBands(p, [[50, "#FF9F0A"], [20, "#FF453A"]], "#32D74B")).colorHex)
      .toBe("#FF9F0A");
  });

  it("lets a band beat a rule that recolours the gauge, but not a uniform one", () => {
    expect(gaugeOf("62", (p) => { alwaysSetColor(p, "#BF5AF2"); }).colorHex).toBe("#BF5AF2");
    expect(gaugeOf("62", (p) => {
      gaugeBands(p, [[20, "#FF453A"], [50, "#FF9F0A"]], "#32D74B");
      alwaysSetColor(p, "#BF5AF2");
    }).colorHex).toBe("#32D74B");
  });

  it("has no band to hand out when the reading is not a number", () => {
    expect(gaugeOf("unavailable", (p) => gaugeBands(p, [[20, "#FF453A"]], "#32D74B")).colorHex)
      .toBe("#FFFFFF");
  });
});

describe("a gauge threshold tick", () => {
  it("places the threshold as a fraction of the scale", () => {
    expect(gaugeOf("62", (p) => { p.thresholdValue = 80; }).thresholdFraction).toBe(0.8);
    expect(gaugeOf("62", (p) => { p.thresholdValue = 0; }).thresholdFraction).toBe(0);
    expect(gaugeOf("62", (p) => { p.thresholdValue = 100; }).thresholdFraction).toBe(1);
  });

  it("draws nothing when there is no threshold or it falls off the scale", () => {
    expect(gaugeOf("62").thresholdFraction).toBeUndefined();
    expect(gaugeOf("62", (p) => { p.thresholdValue = 150; }).thresholdFraction).toBeUndefined();
    expect(gaugeOf("62", (p) => { p.thresholdValue = -1; }).thresholdFraction).toBeUndefined();
    expect(gaugeOf("62", (p) => { p.thresholdValue = 5; p.minValue = 5; p.maxValue = 5; }).thresholdFraction)
      .toBeUndefined();
  });
});

describe("a gauge drawn as dots", () => {
  it("counts the range when there is no total", () => {
    const g = gaugeOf("3", (p) => { p.style = "dots"; p.minValue = 0; p.maxValue = 8; });
    expect(g.dotCount).toBe(8);
    expect(g.filledCount).toBe(3);
  });

  it("counts the total when there is one, and rounds both", () => {
    const g = gaugeOf("2.6", (p) => { p.style = "dots"; p.total = literal("7.5"); });
    expect(g.dotCount).toBe(8);
    expect(g.filledCount).toBe(3);
  });

  it("caps the dots and never fills more than it draws", () => {
    const g = gaugeOf("300", (p) => { p.style = "dots"; p.total = literal("400"); });
    expect(g.dotCount).toBe(GAUGE_MAX_DOTS);
    expect(g.filledCount).toBe(GAUGE_MAX_DOTS);
  });

  it("draws at least one dot, and fills none for a reading it cannot read", () => {
    const g = gaugeOf("unavailable", (p) => { p.style = "dots"; p.total = literal("0"); });
    expect(g.dotCount).toBe(1);
    expect(g.filledCount).toBe(0);
  });

  it("falls back to the range when the total is not a number", () => {
    const g = gaugeOf("2", (p) => { p.style = "dots"; p.minValue = 0; p.maxValue = 5; p.total = literal("lots"); });
    expect(g.dotCount).toBe(5);
    expect(g.filledCount).toBe(2);
  });
});

describe("drawing a gauge", () => {
  const draw = (state: string, tweak?: (p: GaugeElement) => void) =>
    flatten(renderLayout(gaugeLayout(state, tweak), { icons: noIcons }));

  it("draws one circle per dot, the filled ones first", () => {
    const svg = draw("3", (p) => { p.style = "dots"; p.minValue = 0; p.maxValue = 8; p.colorSlot.baseColorHex = "#32D74B"; p.trackColorHex = "#FF453A"; });
    const dots = circles(svg);
    expect(dots).toHaveLength(8);
    // Same size, evenly spaced along the long side, centred on it.
    expect(new Set(dots.map((d) => d.r)).size).toBe(1);
    expect(new Set(dots.map((d) => d.cy)).size).toBe(1);
    for (let i = 1; i < dots.length; i++) expect(dots[i]!.cx).toBeGreaterThan(dots[i - 1]!.cx);
    expect(svg.split("#32D74B").length - 1).toBe(3);
    expect(svg.split("#FF453A").length - 1).toBe(5);
  });

  it("stacks the dots when the frame is taller than it is wide", () => {
    const dots = circles(draw("1", (p) => {
      p.style = "dots";
      p.minValue = 0;
      p.maxValue = 4;
      p.frame = { x: 0.4, y: 0, width: 0.1, height: 1, rotationDegrees: 0 };
    }));
    expect(dots).toHaveLength(4);
    expect(new Set(dots.map((d) => d.cx)).size).toBe(1);
    for (let i = 1; i < dots.length; i++) expect(dots[i]!.cy).toBeGreaterThan(dots[i - 1]!.cy);
  });

  it("marks the threshold on a ring and leaves it off when there is none", () => {
    expect(draw("62", (p) => { p.style = "ring"; p.thresholdValue = 80; })).toContain("<line");
    expect(draw("62", (p) => { p.style = "ring"; })).not.toContain("<line");
    expect(draw("62", (p) => { p.style = "ring"; p.thresholdValue = 150; })).not.toContain("<line");
  });

  it("marks the threshold on a bar as a third rectangle", () => {
    const bare = draw("62", (p) => { p.style = "bar"; });
    const marked = draw("62", (p) => { p.style = "bar"; p.thresholdValue = 80; });
    expect(marked.split("<rect").length).toBe(bare.split("<rect").length + 1);
  });
});
