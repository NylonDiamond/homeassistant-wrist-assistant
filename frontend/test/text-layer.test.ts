// The text layer's look fields: alignment, the two-line limit and monospaced
// digits. The app draws the same three with `.frame(maxWidth:alignment:)`,
// `.lineLimit(...)` and a monospaced-digit font, so a drift here is a preview
// that lies about what lands on the wrist.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import { newConfig, newElement, type Element, type TextElement } from "../src/model.js";
import { renderLayout, type IconProvider } from "../src/renderer.js";
import { resolveAll, type ResolvedLayout } from "../src/resolver.js";

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

/** One text layer filling a rectangular face. The design box is 181 points wide. */
function textLayout(text: string, tweak: (p: TextElement) => void = () => {}): ResolvedLayout {
  const cfg = newConfig("Text", 0);
  const el = newElement("text") as Extract<Element, { kind: "text" }>;
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  el.payload.value = { kind: { kind: "literal", value: text } };
  tweak(el.payload);
  cfg.elements.push(el);
  return resolveAll(cfg, {
    entityStates: new Map(),
    templateResults: new Map(),
    historySeries: new Map(),
    namedValues: cfg.values,
  }).rectangular!;
}

const draw = (text: string, tweak: (p: TextElement) => void = () => {}) =>
  flatten(renderLayout(textLayout(text, tweak), { icons: noIcons }));

/** The anchor and x of the text element, ignoring the layer's own hit boxes. */
function anchorOf(svg: string): { x: number; anchor: string } {
  const m = /<text x=([-\d.]+) y=[-\d.]+ text-anchor=(\w+)/.exec(svg);
  return { x: Number(m?.[1]), anchor: m?.[2] ?? "" };
}

describe("text layer alignment", () => {
  it("centres by default", () => {
    const { x, anchor } = anchorOf(draw("hi"));
    expect(anchor).toBe("middle");
    expect(x).toBeCloseTo(181 / 2, 5);
  });

  it("hangs off the left edge when asked", () => {
    const { x, anchor } = anchorOf(draw("hi", (p) => { p.alignment = "leading"; }));
    expect(anchor).toBe("start");
    expect(x).toBeCloseTo(0, 5);
  });

  it("hangs off the right edge when asked", () => {
    const { x, anchor } = anchorOf(draw("hi", (p) => { p.alignment = "trailing"; }));
    expect(anchor).toBe("end");
    expect(x).toBeCloseTo(181, 5);
  });
});

describe("text layer line limit", () => {
  const tspans = (svg: string) => [...svg.matchAll(/<tspan x=[-\d.]+ y=[-\d.]+>([^<]*)<\/tspan>/g)].map((m) => m[1]!);

  it("stays on one line by default", () => {
    expect(tspans(draw("Second bathroom humidity", (p) => { p.fontSize = 16; }))).toEqual([]);
  });

  it("breaks on a word boundary when two lines are allowed", () => {
    const lines = tspans(draw("Second bathroom humidity", (p) => { p.fontSize = 16; p.lineLimit = 2; }));
    expect(lines).toHaveLength(2);
    // Whole words only, and nothing is lost in the break.
    expect(lines.join(" ")).toBe("Second bathroom humidity");
  });

  it("keeps a single word on one line rather than splitting mid-word", () => {
    expect(tspans(draw("Unbreakablewordhere", (p) => { p.fontSize = 16; p.lineLimit = 2; }))).toEqual([]);
  });

  it("only shrinks once a wrapped line still overflows", () => {
    const size = (svg: string) => Number(/font-size=([\d.]+)/.exec(svg)?.[1]);
    // Two short words fit the 181 point box on two lines at full size.
    expect(size(draw("alpha beta", (p) => { p.fontSize = 16; p.lineLimit = 2; }))).toBeCloseTo(16, 5);
    // One long word cannot be wrapped, so the shrink step still runs.
    expect(size(draw("alphabetagammadeltaepsilonzeta", (p) => { p.fontSize = 16; }))).toBeLessThan(16);
  });
});

describe("text layer monospaced digits", () => {
  it("asks for tabular figures only when the layer does", () => {
    expect(draw("12:04")).not.toContain("tabular-nums");
    expect(draw("12:04", (p) => { p.monospacedDigits = true; })).toContain("font-variant-numeric: tabular-nums");
  });
});

describe("text layer colour by value", () => {
  /** Each coloured run as [text, fill]. */
  const runs = (svg: string) =>
    [...svg.matchAll(/<tspan fill=(.+?) fill-opacity=[\d.]+>([^<]*)<\/tspan>/g)].map((m) => [m[2]!, m[1]!] as const);
  const priced = (p: TextElement) => {
    p.coloring = "bands";
    p.bands = [
      { id: "B0000000-0000-4000-8000-000000000011", upTo: 35, colorHex: "#32D74B" },
      { id: "B0000000-0000-4000-8000-000000000012", upTo: 45, colorHex: "#FFD60A" },
    ];
    p.bandAboveColorHex = "#FF9F0A";
    p.highlight = "both";
  };

  it("draws nothing extra for a layer that does not ask", () => {
    expect(runs(draw("32 36 43 70"))).toEqual([]);
  });

  it("draws each run in its own colour and still spells the text", () => {
    const got = runs(draw("32 36 43 70", priced));
    expect(got.map(([t]) => t)).toEqual(["32", " ", "36", " ", "43", " ", "70"]);
    const fill = (text: string) => got.find(([t]) => t === text)![1];
    expect(fill("36")).toBe(fill("43"));
    expect(fill("70")).not.toBe(fill("36"));
    expect(fill("32")).not.toBe(fill("36"));
    expect(fill(" ")).not.toBe(fill("36"));
  });

  it("lays the text out exactly as it would in one colour", () => {
    const size = (svg: string) => Number(/font-size=([\d.]+)/.exec(svg)?.[1]);
    const text = "Prices for today 32 36 43 70";
    for (const tweak of [(p: TextElement) => { p.fontSize = 16; }, (p: TextElement) => { p.fontSize = 16; p.lineLimit = 2; p.alignment = "trailing"; }]) {
      const plain = draw(text, tweak);
      const coloured = draw(text, (p) => { tweak(p); priced(p); });
      expect(size(coloured)).toBeCloseTo(size(plain), 5);
      expect(anchorOf(coloured)).toEqual(anchorOf(plain));
    }
  });

  it("keeps each number's colour when the text wraps onto a second line", () => {
    const svg = draw("Prices for today 32 36 43 70", (p) => { p.fontSize = 16; p.lineLimit = 2; priced(p); });
    const lines = svg.split(/<tspan x=[-\d.]+ y=[-\d.]+>/).slice(1).map((chunk) => runs(chunk));
    expect(lines).toHaveLength(2);
    expect(lines.map((l) => l.map(([t]) => t).join("")).join(" ")).toBe("Prices for today 32 36 43 70");
    const [first, second] = lines as [ReturnType<typeof runs>, ReturnType<typeof runs>];
    expect(second.map(([t]) => t)).toEqual(["36", " ", "43", " ", "70"]);
    // 36 and 43 share a band on the second line; 32, the lowest, ends the first.
    expect(second[0]![1]).toBe(second[2]![1]);
    expect(first.at(-1)![0]).toBe("32");
    expect(first.at(-1)![1]).not.toBe(second[0]![1]);
  });

  it("paints the ellipsis in the colour of what it cut short", () => {
    const got = runs(draw("9".repeat(60), (p) => { p.fontSize = 16; priced(p); }));
    expect(got).toHaveLength(1);
    expect(got[0]![0].endsWith("…")).toBe(true);
  });
});
