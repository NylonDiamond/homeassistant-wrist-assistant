// The selected layer's resize handles on the stage: which sides drag on their
// own, the pointer each handle shows, and handles held at the face's edge when
// the layer is dragged past it. Also the quiet free-standing tap boxes.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import { type CustomComplicationConfig, type Element as CElement, legacyConfig, newElement } from "../src/model.js";
import { renderLayout, type IconProvider, type RenderOptions } from "../src/renderer.js";
import { resolveAll } from "../src/resolver.js";

/** Flattens a lit template tree to plain text. */
function flatten(node: unknown): string {
  if (node === undefined || node === null || node === nothing) return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  return String(node);
}

const noIcons: IconProvider = { render: () => undefined, available: () => false, names: () => undefined };

function draw(cfg: CustomComplicationConfig, opts: Partial<RenderOptions> = {}): string {
  const layouts = resolveAll(cfg, { entityStates: new Map(), templateResults: new Map(), namedValues: cfg.values });
  return flatten(renderLayout(layouts.rectangular!, { icons: noIcons, showHidden: true, tapAreas: true, ...opts }));
}

function withLayer(kind: CElement["kind"], frame = { x: 0.2, y: 0.2, width: 0.5, height: 0.4 }): { cfg: CustomComplicationConfig; el: CElement } {
  const cfg = legacyConfig("Test", 0);
  const el = newElement(kind);
  el.payload.frame = { ...frame, rotationDegrees: 0 };
  cfg.elements.push(el);
  return { cfg, el };
}

const handlesOf = (out: string) => (out.match(/data-handle=(\w+)/g) ?? []).map((m) => m.slice("data-handle=".length));

describe("resize handles", () => {
  it("gives a text layer four corners and all four sides", () => {
    const { cfg, el } = withLayer("text");
    const spots = new Set(handlesOf(draw(cfg, { highlightId: el.payload.id, handles: true })));
    expect([...spots].sort()).toEqual(["e", "n", "ne", "nw", "s", "se", "sw", "w"]);
  });

  it("gives an icon corners only, since it draws at one size either way", () => {
    const { cfg, el } = withLayer("icon");
    const spots = new Set(handlesOf(draw(cfg, { highlightId: el.payload.id, handles: true })));
    expect([...spots].sort()).toEqual(["ne", "nw", "se", "sw"]);
  });

  it("gives a bar gauge only its two ends", () => {
    const { cfg, el } = withLayer("gauge");
    if (el.kind === "gauge") el.payload.style = "bar";
    const spots = new Set(handlesOf(draw(cfg, { highlightId: el.payload.id, handles: true })));
    expect([...spots].sort()).toEqual(["e", "ne", "nw", "se", "sw", "w"]);
  });

  it("shows a two-way arrow along the way each handle drags", () => {
    const { cfg, el } = withLayer("text");
    const out = draw(cfg, { highlightId: el.payload.id, handles: true });
    expect(out).toMatch(/data-handle=nw[^>]*cursor:nwse-resize/);
    expect(out).toMatch(/data-handle=ne[^>]*cursor:nesw-resize/);
    expect(out).toMatch(/data-handle=n [^>]*cursor:ns-resize/);
    expect(out).toMatch(/data-handle=e [^>]*cursor:ew-resize/);
  });

  it("holds the handles at the face's edge when the layer hangs past it", () => {
    const { cfg, el } = withLayer("text", { x: -0.6, y: 0.2, width: 0.8, height: 0.4 });
    const out = draw(cfg, { highlightId: el.payload.id, handles: true });
    const xs = [...out.matchAll(/data-handle=(?:nw|sw|w) x=([-\d.e]+)/g)].map((m) => Number(m[1]));
    expect(xs.length).toBeGreaterThan(0);
    // Past the face the stage cuts it off; held, the handle sits just outside the edge.
    for (const x of xs) expect(x).toBeGreaterThanOrEqual(-3 - 1e-6);
  });
});

describe("quiet taps", () => {
  it("draws a free-standing tap only while it is selected or hovered", () => {
    const { cfg, el } = withLayer("tap");
    const id = el.payload.id;
    expect(draw(cfg, { quietTaps: true })).not.toContain(id);
    expect(draw(cfg, { quietTaps: true, highlightId: id })).toContain(id);
    expect(draw(cfg, { quietTaps: true, hoverIds: [id] })).toContain(id);
    expect(draw(cfg, { quietTaps: true, tapReview: true })).toContain(id);
    expect(draw(cfg)).toContain(id);
  });
});

describe("hidden layers", () => {
  it("shows where a hidden layer is while it is pointed at or selected, and nothing else", () => {
    const { cfg, el } = withLayer("icon");
    el.payload.isHidden = true;
    const id = el.payload.id;
    const ghost = `data-hidden-ghost=${id}`;
    // Never drawn and never clickable on its own.
    expect(draw(cfg, { showHidden: false })).not.toContain(id);
    // Pointed at in the Layers list or through a shared value it reads.
    const hovered = draw(cfg, { showHidden: false, hoverIds: [id] });
    expect(hovered).toContain(ghost);
    expect(hovered).not.toContain(`data-element-id=${id}`);
    expect(hovered).toContain('pointer-events="none"');
    // Selected, or peeked from its row.
    expect(draw(cfg, { showHidden: false, highlightId: id })).toContain(ghost);
    // No handles: there is nothing drawn to resize.
    expect(handlesOf(draw(cfg, { showHidden: false, highlightId: id, handles: true }))).toEqual([]);
  });
});
