// A rich text part's tracking: the schema key, its resolution and drawing.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  type CustomComplicationConfig,
  type Element,
  type TextElement,
  type TextPart,
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

function docOf(...elements: Element[]): CustomComplicationConfig {
  const cfg = newConfig("Tracking", 0);
  for (const el of elements) cfg.elements.push(el);
  return cfg;
}

function layoutOf(cfg: CustomComplicationConfig): ResolvedLayout {
  const ctx: ResolveContext = { entityStates: new Map(), templateResults: new Map(), namedValues: cfg.values };
  return resolveAll(cfg, ctx).rectangular!;
}

function textWith(parts: TextPart[]): Extract<Element, { kind: "text" }> {
  const el = newElement("text") as Extract<Element, { kind: "text" }>;
  el.payload.colorSlot = { baseColorHex: "#FFFFFF" };
  el.payload.parts = parts;
  el.payload.value = richTextFallback(parts);
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  return el;
}

describe("a part's tracking on the wire", () => {
  it("reads and writes a part's tracking, last of its own keys", () => {
    const text = textWith([{ id: "P1", value: literal("50"), colorHex: "#FFFFFF", italic: false, tracking: -0.01 }]);
    const encoded = encodeConfig(docOf(text)) as { elements: { payload: Record<string, unknown> }[] };
    const part = (encoded.elements[0]!.payload.parts as Record<string, unknown>[])[0]!;
    expect(Object.keys(part)).toEqual(["id", "value", "colorHex", "italic", "tracking"]);
    expect(part.tracking).toBe(-0.01);
    expect(auditUnknownKeys(encoded)).toEqual([]);
    const back = parseConfig(encodeConfig(docOf(text)));
    expect((back.elements[0]!.payload as TextElement).parts![0]).toMatchObject({ tracking: -0.01 });
  });

  it("drops a tracking that is not a number, clamps one past half an em, and never writes a tracking of 0", () => {
    const raw = encodeConfig(docOf(textWith([{ id: "P1", value: literal("x") }]))) as { elements: { payload: Record<string, unknown> }[] };
    raw.elements[0]!.payload.parts = [
      { id: "P1", value: { kind: { kind: "literal", text: "a" } }, tracking: "wide" },
      { id: "P2", value: { kind: { kind: "literal", text: "b" } }, tracking: 2 },
      { id: "P3", value: { kind: { kind: "literal", text: "c" } }, tracking: true },
      { id: "P4", value: { kind: { kind: "literal", text: "d" } }, tracking: 0 },
    ];
    const read = parseConfig(raw);
    const el = read.elements[0]!.payload as TextElement;
    expect(el.parts![0]!.tracking).toBeUndefined();
    expect(el.parts![1]!.tracking).toBe(0.5);
    expect(el.parts![2]!.tracking).toBeUndefined();
    expect(el.parts![3]!.tracking).toBeUndefined();
    const again = encodeConfig(read) as { elements: { payload: { parts: Record<string, unknown>[] } }[] };
    expect(again.elements[0]!.payload.parts.map((p) => p.tracking)).toEqual([undefined, 0.5, undefined, undefined]);
  });
});

describe("resolving a part's tracking", () => {
  it("carries it only when it has one, on an icon part as on a part of words (as the app resolves it)", () => {
    const text = textWith([
      { id: "F", value: literal("50"), tracking: -0.01 },
      { id: "U", value: literal("%") },
      { id: "I", value: literal(""), icon: literal("bolt.fill"), tracking: 0.2 },
    ]);
    const t = layoutOf(docOf(text)).elements[0]! as { parts: { tracking?: number; symbol?: string }[] };
    expect(t.parts[0]!.tracking).toBe(-0.01);
    expect("tracking" in t.parts[1]!).toBe(false);
    expect(t.parts[2]).toMatchObject({ symbol: "bolt.fill", tracking: 0.2 });
  });
});

describe("drawing a part's tracking", () => {
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
