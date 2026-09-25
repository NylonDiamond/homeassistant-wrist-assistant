// The face is drawn in the shape the system masks it to. The editor's svg lets
// its resize handles overflow, so a page border-radius no longer clips the
// face: the svg itself has to clip circular to a disc, or an empty circular
// complication draws as a black square.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import { newConfig } from "../src/model.js";
import { renderLayout, type IconProvider } from "../src/renderer.js";
import { resolveAll, type ResolveContext } from "../src/resolver.js";

const noIcons: IconProvider = { render: () => undefined, available: () => false, names: () => undefined };
const ctx: ResolveContext = { entityStates: new Map(), templateResults: new Map(), namedValues: [] };

function flatten(node: unknown): string {
  if (node === undefined || node === null || node === nothing) return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  return String(node);
}

function drawn(family: "circular" | "rectangular"): string {
  const layout = resolveAll(newConfig("Face", 0, family), ctx)[family]!;
  return flatten(renderLayout(layout, { icons: noIcons }));
}

describe("face shape", () => {
  it("clips a circular face and its black well to a disc", () => {
    const svg = drawn("circular");
    const width = Number(/viewBox=0 0 ([\d.]+) ([\d.]+)/.exec(svg)![1]);
    const clip = /<clipPath id=[^>]*>\s*<rect [^>]*rx=([\d.]+)/.exec(svg);
    expect(Number(clip![1])).toBe(width / 2);
    expect(svg).toMatch(new RegExp(`rx=${width / 2} fill="#000000"`));
  });

  it("keeps a rectangular face square cornered", () => {
    expect(drawn("rectangular")).toMatch(/<clipPath id=[^>]*>\s*<rect [^>]*rx=0 /);
  });
});
