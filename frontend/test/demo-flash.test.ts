// The success flash, drawn the way the watch draws it.
//
// The watch does not wash the face in colour. It strokes a line round the
// complication's own shape, or round the one tap area that fired, and that is
// the whole point of the demo showing it: a flash that looked different here
// would teach the wrong thing. The shapes and weights are copied from the app
// (WristAssistant Widgets/CustomComplicationViewHelpers.swift), so these tests
// pin the numbers rather than the pictures.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import type { NormalizedFrame } from "../src/model.js";
import { renderLayout, type IconProvider } from "../src/renderer.js";
import type { ResolvedElement, ResolvedLayout } from "../src/resolver.js";

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

function frame(x: number, y: number, width: number, height: number): NormalizedFrame {
  return { x, y, width, height, rotationDegrees: 0 };
}

function layout(family: ResolvedLayout["family"], elements: ResolvedElement[] = []): ResolvedLayout {
  return { family, elements, cornerBodyShape: "circle", borderWidth: 0 };
}

/** The drawn face, with no slot given, so the design box is drawn at 1:1 and
 * every size below is the watch's own number. */
function draw(l: ResolvedLayout, flash?: { color: string; frame?: NormalizedFrame }) {
  return flatten(renderLayout(l, { icons: noIcons, ...(flash ? { flash } : {}) }));
}

describe("the success flash", () => {
  it("is not drawn at all when the panel does not ask for it", () => {
    expect(draw(layout("rectangular"))).not.toContain("wa-flash");
  });

  it("rings a rectangular face on the slot's own corner", () => {
    const out = draw(layout("rectangular"), { color: "#30D158" });
    expect(out).toContain("wa-flash");
    expect(out).toContain("rx=10");
    expect(out).toContain("stroke-width=1.5");
    expect(out).toContain("stroke=#30D158");
  });

  it("rings a circular face as a circle, the shape the system masks it to", () => {
    const out = draw(layout("circular"), { color: "#30D158" });
    expect(out).toMatch(/<circle class="wa-flash"/);
    expect(out).toContain("stroke-width=2.5");
  });

  it("rings a Home Screen tile with the heavier line a tile needs", () => {
    const out = draw(layout("medium"), { color: "#30D158" });
    expect(out).toContain("rx=22");
    expect(out).toContain("stroke-width=3");
  });

  it("rings the corner's content disc, not the screen quadrant round it", () => {
    // The corner preview draws a whole black quadrant. The widget is only the
    // disc inside it, so the ring has to be the disc's size, which is far
    // smaller than the quadrant.
    const out = draw(layout("corner"), { color: "#30D158" });
    const ring = /<circle class="wa-flash"[\s\S]*?r=([\d.]+)/.exec(out);
    const quad = /viewBox=0 0 ([\d.]+) /.exec(out);
    expect(ring).not.toBeNull();
    expect(quad).not.toBeNull();
    expect(Number(ring![1])).toBeLessThan(Number(quad![1]) / 2);
  });

  it("rings one tap area when the press landed on a tap", () => {
    // A quarter of the face, well over the size that also gets tinted.
    const out = draw(layout("rectangular"), { color: "#30D158", frame: frame(0.25, 0.25, 0.5, 0.5) });
    expect(out).toContain("stroke-width=1.5");
    // The 3 pt radius, inset by half the stroke so the line sits inside the box.
    expect(out).toContain("rx=2.25");
    // The ring only, no tint, and nothing shaped like the whole face.
    expect(out).not.toContain('fill-opacity="0.3"');
    expect(out).not.toContain("rx=10");
  });

  it("tints a small tap area as well, because a hairline round it is easy to miss", () => {
    const out = draw(layout("rectangular"), { color: "#30D158", frame: frame(0.1, 0.1, 0.05, 0.05) });
    expect(out).toContain('fill-opacity="0.3"');
  });

  it("turns the ring with the tap area it rings", () => {
    const turned = { ...frame(0.25, 0.25, 0.5, 0.5), rotationDegrees: 30 };
    expect(draw(layout("rectangular"), { color: "#30D158", frame: turned })).toContain("rotate(30 ");
  });
});
