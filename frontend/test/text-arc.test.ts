// Curved text: the `arc` key on a text layer. The shared fixture
// (fixtures/text_arc.json) pins what the resolver hands each shape on both
// sides; this file pins the wire shape, the clamps, the audit, and the glyph
// placement the preview draws from.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  ARC_RADIUS_MIN,
  ARC_SWEEP_DEFAULT,
  ARC_SWEEP_MAX,
  ARC_SWEEP_MIN,
  auditUnknownKeys,
  clampArcSweep,
  encodeConfig,
  familyAllowsArcText,
  newConfig,
  newElement,
  parseConfig,
  type Element,
  type TextElement,
} from "../src/model.js";
import { arcGlyphAngles, arcPoint, layerOutline, renderLayout, type IconProvider } from "../src/renderer.js";
import { frameBox, resolveAll, type ResolvedLayout, type ResolvedText } from "../src/resolver.js";

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

/** One text layer filling every shape the document supports. */
function curvedConfig(text: string, tweak: (p: TextElement) => void) {
  const cfg = newConfig("Curved", 0);
  cfg.supportedFamilies = ["rectangular", "circular", "small"];
  cfg.elements.length = 0;
  const el = newElement("text") as Extract<Element, { kind: "text" }>;
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  el.payload.value = { kind: { kind: "literal", value: text } };
  tweak(el.payload);
  cfg.elements.push(el);
  return cfg;
}

function layouts(text: string, tweak: (p: TextElement) => void) {
  const cfg = curvedConfig(text, tweak);
  return resolveAll(cfg, {
    entityStates: new Map(),
    templateResults: new Map(),
    historySeries: new Map(),
    namedValues: cfg.values,
  });
}

const textOf = (layout: ResolvedLayout | undefined): ResolvedText =>
  layout!.elements.find((e) => e.kind === "text") as ResolvedText;

describe("the arc key on the wire", () => {
  it("round-trips and writes only what is away from its default", () => {
    const cfg = curvedConfig("Kitchen", (p) => {
      p.arc = { radius: 0.6, startAngle: 180, sweep: -90, inside: true };
    });
    const back = parseConfig(encodeConfig(cfg)).elements[0];
    expect(back?.kind === "text" && back.payload.arc).toEqual({ radius: 0.6, startAngle: 180, sweep: -90, inside: true });

    const bare = encodeConfig(curvedConfig("x", (p) => { p.arc = { radius: 0.4 }; }));
    const bareJson = JSON.stringify(bare);
    expect(bareJson).toContain("\"radius\":0.4");
    expect(bareJson).not.toContain("startAngle");
    expect(bareJson).not.toContain("sweep");
    expect(bareJson).not.toContain("inside");

    // A straight layer writes no key at all, so a document that predates curves
    // keeps the bytes it always had.
    expect(JSON.stringify(encodeConfig(curvedConfig("x", () => {})))).not.toContain("arc");
  });

  it("holds the radius and the sweep to their ranges rather than rejecting them", () => {
    const wide = parseConfig(JSON.parse(JSON.stringify(encodeConfig(curvedConfig("x", (p) => {
      p.arc = { radius: 9, sweep: 4 };
    })))));
    const arc = wide.elements[0]?.kind === "text" ? wide.elements[0].payload.arc : undefined;
    expect(arc?.radius).toBe(1);
    expect(arc?.sweep).toBe(ARC_SWEEP_MIN);

    expect(clampArcSweep(-2000)).toBe(-ARC_SWEEP_MAX);
    expect(clampArcSweep(0)).toBe(ARC_SWEEP_DEFAULT);
    expect(clampArcSweep(Number.NaN)).toBe(ARC_SWEEP_DEFAULT);

    const tight = parseConfig(JSON.parse(JSON.stringify(encodeConfig(curvedConfig("x", (p) => {
      p.arc = { radius: 0.001 };
    })))));
    expect(tight.elements[0]?.kind === "text" ? tight.elements[0].payload.arc?.radius : 0).toBe(ARC_RADIUS_MIN);
  });

  it("is a key the audit knows, and its own keys are audited too", () => {
    const good = encodeConfig(curvedConfig("x", (p) => { p.arc = { radius: 0.4, inside: true }; }));
    expect(auditUnknownKeys(good)).toEqual([]);

    const bad = JSON.parse(JSON.stringify(good));
    bad.elements[0].payload.arc.lean = 3;
    expect(auditUnknownKeys(bad)).toEqual(["$.elements[0].payload.arc.lean"]);
  });
});

describe("which shapes curve", () => {
  it("is the circular shape and the two square-ish tiles", () => {
    expect(familyAllowsArcText("circular")).toBe(true);
    expect(familyAllowsArcText("small")).toBe(true);
    expect(familyAllowsArcText("large")).toBe(true);
    for (const family of ["rectangular", "corner", "medium", "xlarge", "inline"] as const) {
      expect(familyAllowsArcText(family)).toBe(false);
    }
  });

  it("settles the radius in points and drops the key everywhere else", () => {
    const all = layouts("Kitchen", (p) => { p.arc = { radius: 0.5 }; });
    // 0.5 of the circular design box's 51 point side.
    expect(textOf(all.circular).arc).toEqual({ radius: 25.5, startAngle: 0, sweep: ARC_SWEEP_DEFAULT, inside: false });
    expect(textOf(all.small).arc?.radius).toBeCloseTo(0.5 * 162.67, 9);
    expect(textOf(all.rectangular).arc).toBeUndefined();
  });

  it("never curves a countdown, which the watch ticks as one string", () => {
    const all = layouts("2026-01-01T00:00:00Z", (p) => {
      p.countdown = true;
      p.arc = { radius: 0.5 };
    });
    expect(textOf(all.circular).arc).toBeUndefined();
  });
});

describe("where the glyphs land", () => {
  // A 10 point advance on this radius turns exactly 10 degrees, so the sums are
  // readable. Mirrors `curvedGlyphsSitHalfAnAdvanceApartAndCentreOnTheArc` in the
  // app repo, case for case.
  const radius = 180 / Math.PI;

  it("sits half an advance apart, centred on the arc", () => {
    const placed = arcGlyphAngles([10, 10, 10], { radius, startAngle: 0, sweep: 120, inside: true }, 8);
    expect(placed.scale).toBe(1);
    expect(placed.truncated).toBe(false);
    expect(placed.placements.map((p) => p.angle)).toEqual([50, 60, 70]);
    expect(placed.placements.map((p) => p.rotation)).toEqual([50, 60, 70]);
  });

  it("adds half a turn when the letters face out", () => {
    const placed = arcGlyphAngles([10, 10, 10], { radius, startAngle: 0, sweep: 120, inside: false }, 8);
    expect(placed.placements.map((p) => p.angle)).toEqual([50, 60, 70]);
    expect(placed.placements.map((p) => p.rotation)).toEqual([230, 240, 250]);
  });

  it("reads the other way round on a negative sweep", () => {
    const placed = arcGlyphAngles([10, 10, 10], { radius, startAngle: 0, sweep: -120, inside: true }, 8);
    expect(placed.placements.map((p) => p.angle)).toEqual([-50, -60, -70]);
  });

  it("shrinks to fit, then loses its tail", () => {
    const shrunk = arcGlyphAngles(Array(12).fill(10), { radius, startAngle: 0, sweep: 90, inside: true }, 8);
    expect(shrunk.scale).toBeCloseTo(0.75, 12);
    expect(shrunk.truncated).toBe(false);
    expect(shrunk.placements).toHaveLength(12);

    const cut = arcGlyphAngles(Array(12).fill(10), { radius, startAngle: 0, sweep: 40, inside: true }, 8);
    expect(cut.scale).toBe(0.5);
    expect(cut.truncated).toBe(true);
    expect(cut.placements.length).toBeLessThan(12);
    expect(cut.placements.length).toBeGreaterThan(0);
  });

  it("runs clockwise from the top of the circle", () => {
    expect(arcPoint(0, 0, 10, 0)).toEqual({ x: 0, y: -10 });
    const right = arcPoint(0, 0, 10, 90);
    expect(right.x).toBeCloseTo(10, 9);
    expect(right.y).toBeCloseTo(0, 9);
    expect(arcPoint(0, 0, 10, 180).y).toBeCloseTo(10, 9);
  });
});

describe("the curved preview", () => {
  it("draws one turned glyph per character", () => {
    const svg = flatten(renderLayout(layouts("ABC", (p) => { p.arc = { radius: 0.5 }; }).circular!, { icons: noIcons }));
    const turned = [...svg.matchAll(/rotate\(/g)];
    expect(turned.length).toBeGreaterThanOrEqual(3);
    for (const ch of ["A", "B", "C"]) expect(svg).toContain(`>${ch}</text>`);
  });

  it("carries each number's own colour onto the arc", () => {
    const svg = flatten(renderLayout(layouts("32 70", (p) => {
      p.arc = { radius: 0.5 };
      p.coloring = "bands";
      p.bands = [{ id: "B0000000-0000-4000-8000-000000000001", upTo: 40, colorHex: "#32D74B" }];
      p.bandAboveColorHex = "#FF9F0A";
    }).circular!, { icons: noIcons }));
    expect(svg).toContain("#32D74B");
    expect(svg).toContain("#FF9F0A");
  });

  it("puts the selection box on the arc rather than the frame", () => {
    const layout = layouts("ABC", (p) => { p.arc = { radius: 0.5, sweep: 30 }; }).circular!;
    const el = textOf(layout);
    const box = frameBox(el, { width: 51, height: 51 });
    const outline = layerOutline(el, box);
    // Three glyphs over 30 degrees at the top of a 25.5 point circle: a band far
    // shorter than the layer's own 51 point frame, sitting above its centre.
    expect(outline.h).toBeLessThan(box.h);
    expect(outline.cy).toBeLessThan(box.cy);
  });
});
