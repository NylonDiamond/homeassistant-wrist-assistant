// Tile layers round four (app repo docs/tile_layers_contract_2026-10.md,
// section 15): the schema's tile inks and part tracking, their resolution and
// drawing.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  type CustomComplicationConfig,
  type Element,
  type ShapeElement,
  type TextElement,
  type TextPart,
  type TileInks,
  auditUnknownKeys,
  encodeConfig,
  literal,
  newConfig,
  newElement,
  parseConfig,
  richTextFallback,
} from "../src/model.js";
import { type IconProvider, renderLayout } from "../src/renderer.js";
import { type ResolveContext, type ResolvedLayout, resolveAll } from "../src/resolver.js";

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

const INKS: TileInks = { ink: "#111111", ink2: "#222222", unit: "#333333D6", glyph: "#444444", hue: "#3366FF", hueClear: "#3366FF00" };

function docOf(...elements: Element[]): CustomComplicationConfig {
  const cfg = newConfig("Round four", 0);
  for (const el of elements) cfg.elements.push(el);
  return cfg;
}

function layoutOf(cfg: CustomComplicationConfig, inks?: TileInks): ResolvedLayout {
  const ctx: ResolveContext = { entityStates: new Map(), templateResults: new Map(), namedValues: cfg.values, ...(inks === undefined ? {} : { tileValues: { inks } }) };
  return resolveAll(cfg, ctx).rectangular!;
}

function textWith(parts: TextPart[], slot = "#FFFFFF"): Extract<Element, { kind: "text" }> {
  const el = newElement("text") as Extract<Element, { kind: "text" }>;
  el.payload.colorSlot = { baseColorHex: slot, tileInk: "ink" };
  el.payload.parts = parts;
  el.payload.value = richTextFallback(parts);
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  return el;
}

const roundTrip = (cfg: CustomComplicationConfig) => parseConfig(encodeConfig(cfg));

describe("the schema keys (15.4)", () => {
  it("reads and writes a colour slot's, a part's and a fill stop's tile ink, and a part's tracking, in the contract's key order", () => {
    const text = textWith([{ id: "P1", value: literal("50"), colorHex: "#FFFFFF", tileInk: "ink", italic: false, tracking: -0.01 }]);
    const shape = newElement("shape") as Extract<Element, { kind: "shape" }>;
    shape.payload.colorSlot = { baseColorHex: "#F2AE4E", tileInk: "hue" };
    shape.payload.fill = { kind: "radial", stops: [{ at: 0, colorHex: "#F2AE4E", tileInk: "hue" }, { at: 1, colorHex: "#F2AE4E00", tileInk: "hueClear" }] };
    const encoded = encodeConfig(docOf(text, shape)) as { elements: { payload: Record<string, unknown> }[] };
    const t = encoded.elements[0]!.payload;
    expect(t.colorSlot).toEqual({ baseColorHex: "#FFFFFF", tileInk: "ink" });
    expect(Object.keys((t.colorSlot as object))).toEqual(["baseColorHex", "tileInk"]);
    const part = (t.parts as Record<string, unknown>[])[0]!;
    expect(Object.keys(part)).toEqual(["id", "value", "colorHex", "tileInk", "italic", "tracking"]);
    expect(part.tracking).toBe(-0.01);
    const s = encoded.elements[1]!.payload;
    expect((s.fill as { stops: unknown[] }).stops).toEqual([{ at: 0, colorHex: "#F2AE4E", tileInk: "hue" }, { at: 1, colorHex: "#F2AE4E00", tileInk: "hueClear" }]);
    expect(auditUnknownKeys(encoded)).toEqual([]);
    const back = roundTrip(docOf(text, shape));
    expect((back.elements[0]!.payload as TextElement).parts![0]).toMatchObject({ tileInk: "ink", tracking: -0.01 });
    expect((back.elements[1]!.payload as ShapeElement).fill!.stops[1]!.tileInk).toBe("hueClear");
    expect((back.elements[0]!.payload as TextElement).colorSlot.tileInk).toBe("ink");
  });

  it("drops an unknown ink name and a tracking that is not a number, clamps a tracking past half an em, and never writes a tracking of 0", () => {
    const raw = encodeConfig(docOf(textWith([{ id: "P1", value: literal("x") }]))) as { elements: { payload: Record<string, unknown> }[] };
    const payload = raw.elements[0]!.payload;
    payload.colorSlot = { baseColorHex: "#FFFFFF", tileInk: "sparkle" };
    payload.parts = [
      { id: "P1", value: { kind: { kind: "literal", text: "a" } }, tileInk: 3, tracking: "wide" },
      { id: "P2", value: { kind: { kind: "literal", text: "b" } }, tracking: 2 },
      { id: "P3", value: { kind: { kind: "literal", text: "c" } }, tracking: true },
      { id: "P4", value: { kind: { kind: "literal", text: "d" } }, tracking: 0 },
    ];
    const read = parseConfig(raw);
    const el = read.elements[0]!.payload as TextElement;
    expect(el.colorSlot).toEqual({ baseColorHex: "#FFFFFF" });
    expect(el.parts![0]!.tileInk).toBeUndefined();
    expect(el.parts![0]!.tracking).toBeUndefined();
    expect(el.parts![1]!.tracking).toBe(0.5);
    expect(el.parts![2]!.tracking).toBeUndefined();
    expect(el.parts![3]!.tracking).toBeUndefined();
    const again = encodeConfig(read) as { elements: { payload: { parts: Record<string, unknown>[] } }[] };
    expect(again.elements[0]!.payload.parts.map((p) => p.tracking)).toEqual([undefined, 0.5, undefined, undefined]);
  });
});

describe("resolving tile inks (15.3)", () => {
  const icon = () => {
    const el = newElement("icon") as Extract<Element, { kind: "icon" }>;
    el.payload.colorSlot = { baseColorHex: "#FFF8EA", tileInk: "glyph" };
    return el;
  };

  it("takes a slot's, a part's and a fill stop's colour from the tile's inks, and the hex beside each without them", () => {
    const text = textWith([
      { id: "F", value: literal("50") },
      { id: "U", value: literal("%"), colorHex: "#FFFFFFD6", tileInk: "unit" },
      { id: "W", value: literal(""), colorHex: "#FFFFFFBD", tileInk: "ink2" },
      { id: "Q", value: literal("!"), colorHex: "#ABCDEF" },
    ]);
    const shape = newElement("shape") as Extract<Element, { kind: "shape" }>;
    shape.payload.colorSlot = { baseColorHex: "#F2AE4E", tileInk: "hue" };
    shape.payload.fill = { kind: "radial", stops: [{ at: 0, colorHex: "#F2AE4E", tileInk: "hue" }, { at: 1, colorHex: "#F2AE4E00", tileInk: "hueClear" }] };
    const cfg = docOf(text, icon(), shape);
    const live = layoutOf(cfg, INKS).elements;
    const t = live[0]! as Extract<typeof live[number], { kind: "text" }>;
    expect(t.colorHex).toBe("#111111");
    expect(t.parts!.map((p) => p.colorHex)).toEqual(["#111111", "#333333D6", "#222222", "#ABCDEF"]);
    expect(live[1]).toMatchObject({ kind: "icon", colorHex: "#444444" });
    expect(live[2]).toMatchObject({ kind: "shape", fillColorHex: "#3366FF" });
    expect((live[2] as { fill: { stops: { colorHex: string }[] } }).fill.stops.map((s) => s.colorHex)).toEqual(["#3366FF", "#3366FF00"]);

    const plain = layoutOf(cfg).elements;
    const p = plain[0]! as Extract<typeof plain[number], { kind: "text" }>;
    expect(p.colorHex).toBe("#FFFFFF");
    expect(p.parts!.map((x) => x.colorHex)).toEqual(["#FFFFFF", "#FFFFFFD6", "#FFFFFFBD", "#ABCDEF"]);
    expect(plain[1]).toMatchObject({ colorHex: "#FFF8EA" });
    expect((plain[2] as { fill: { stops: { colorHex: string }[] } }).fill.stops.map((s) => s.colorHex)).toEqual(["#F2AE4E", "#F2AE4E00"]);
  });

  it("lets a setColor rule beat a reference, on the layer and on a part", () => {
    const text = textWith([{ id: "W", value: literal("Off"), colorHex: "#FFFFFFBD", tileInk: "ink2" }]);
    text.payload.rules = [
      { id: "R1", cases: [{ id: "C1", when: { join: "all", tests: [] }, then: [{ kind: "setColor", value: literal("#FF0000") }] }] },
      { id: "R2", partId: "W", cases: [{ id: "C2", when: { join: "all", tests: [] }, then: [{ kind: "setColor", value: literal("#00FF00") }] }] },
    ];
    const el = icon();
    el.payload.rules = [{ id: "R3", cases: [{ id: "C3", when: { join: "all", tests: [] }, then: [{ kind: "setColor", value: literal("#0000FF") }] }] }];
    const out = layoutOf(docOf(text, el), INKS).elements;
    const t = out[0]! as Extract<typeof out[number], { kind: "text" }>;
    expect(t.colorHex).toBe("#FF0000");
    expect(t.parts![0]!.colorHex).toBe("#00FF00");
    expect(out[1]).toMatchObject({ colorHex: "#0000FF" });
  });

  it("carries a part's tracking, only when it has one and only on a part of words", () => {
    const text = textWith([{ id: "F", value: literal("50"), tracking: -0.01 }, { id: "U", value: literal("%") }]);
    const t = layoutOf(docOf(text)).elements[0]! as { parts: { tracking?: number }[] };
    expect(t.parts[0]!.tracking).toBe(-0.01);
    expect("tracking" in t.parts[1]!).toBe(false);
  });
});

describe("drawing a part's tracking (15.2)", () => {
  const drawn = (tracking: number | undefined, width = 1) => {
    const text = textWith([{ id: "F", value: literal("ABCDEFGHIJ"), ...(tracking === undefined ? {} : { tracking }) }]);
    text.payload.fontSize = 10;
    text.payload.minimumScale = 0.5;
    text.payload.frame = { x: 0, y: 0, width, height: 1, rotationDegrees: 0 };
    return flatten(renderLayout(layoutOf(docOf(text)), { icons: noIcons, bare: true, slot: { width: 200, height: 100 } }));
  };
  const spacing = (svg: string) => /letter-spacing: (-?[\d.]+)px/.exec(svg)?.[1];
  const sizeOf = (svg: string) => Number(/<tspan font-size=([\d.]+)/.exec(svg)?.[1]);

  it("draws a tracked run with its letter spacing in drawn units, and none for an untracked one", () => {
    const tracked = drawn(0.1);
    const plain = drawn(undefined);
    expect(spacing(plain)).toBeUndefined();
    const size = sizeOf(tracked);
    expect(Number(spacing(tracked))).toBeCloseTo(0.1 * size, 4);
  });

  it("measures a tracked run wider, so it shrinks where the untracked one fits", () => {
    // A box the plain run just fits in: the tracked one needs to shrink.
    const plain = drawn(undefined, 0.36);
    const tracked = drawn(0.3, 0.36);
    expect(sizeOf(tracked)).toBeLessThan(sizeOf(plain));
  });
});
