// The layer-row thumbnails: each row's own picture, cropped to that layer.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import { newConfig, newElement, type CustomComplicationConfig } from "../src/model.js";
import { CANVAS, renderLayerThumb, thumbCrop, type IconProvider } from "../src/renderer.js";
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

function rectangular(cfg: CustomComplicationConfig): ResolvedLayout {
  return resolveAll(cfg, { entityStates: new Map(), templateResults: new Map(), namedValues: cfg.values }).rectangular!;
}

/** Two text layers: one small at the left, one wide across the top. */
function twoLayers() {
  const cfg = newConfig("Test", 0);
  const small = newElement("text");
  small.payload.frame = { x: 0, y: 0.5, width: 0.1, height: 0.3, rotationDegrees: 0 };
  const wide = newElement("text");
  wide.payload.frame = { x: 0.2, y: 0, width: 0.8, height: 0.3, rotationDegrees: 0 };
  cfg.elements.push(small, wide);
  return { cfg, small: small.payload.id, wide: wide.payload.id };
}

describe("thumbCrop", () => {
  it("crops to the one layer, padded, at the thumbnail's aspect", () => {
    const { cfg, small } = twoLayers();
    const crop = thumbCrop(rectangular(cfg), [small], 52 / 36);
    const box = CANVAS.rectangular;
    // The layer's own box sits inside the crop with room on every side.
    expect(crop.x).toBeLessThan(0);
    expect(crop.y).toBeLessThan(0.5 * box.height);
    expect(crop.x + crop.w).toBeGreaterThan(0.1 * box.width);
    expect(crop.y + crop.h).toBeGreaterThan(0.8 * box.height);
    expect(crop.w / crop.h).toBeCloseTo(52 / 36, 5);
    // And it is a close-up, not the whole face.
    expect(crop.w).toBeLessThan(box.width / 2);
  });

  it("takes the union of a group's layers", () => {
    const { cfg, small, wide } = twoLayers();
    const one = thumbCrop(rectangular(cfg), [small], 52 / 36);
    const both = thumbCrop(rectangular(cfg), [small, wide], 52 / 36);
    expect(both.w).toBeGreaterThan(one.w);
    expect(both.x + both.w).toBeGreaterThanOrEqual(CANVAS.rectangular.width);
  });

  it("shows the whole face for no layers, and for an unknown id", () => {
    const { cfg } = twoLayers();
    const box = CANVAS.rectangular;
    for (const ids of [[], ["nope"]]) {
      const crop = thumbCrop(rectangular(cfg), ids, box.width / box.height);
      expect(crop).toEqual({ x: 0, y: 0, w: box.width, h: box.height });
    }
  });

  it("keeps a rotated layer's corners inside the crop", () => {
    const cfg = newConfig("Test", 0);
    const el = newElement("shape");
    el.payload.frame = { x: 0.4, y: 0.4, width: 0.2, height: 0.02, rotationDegrees: 90 };
    cfg.elements.push(el);
    const crop = thumbCrop(rectangular(cfg), [el.payload.id], 1);
    const box = CANVAS.rectangular;
    // Standing up, the bar is 0.2 * width tall; the crop must cover that.
    const half = 0.2 * box.width / 2;
    expect(crop.y).toBeLessThan(0.41 * box.height - half);
    expect(crop.y + crop.h).toBeGreaterThan(0.41 * box.height + half);
  });
});

describe("renderLayerThumb", () => {
  it("draws only the asked-for layer, dimmed when hidden", () => {
    const { cfg, small, wide } = twoLayers();
    const layout = rectangular(cfg);
    const svg = flatten(renderLayerThumb(layout, [small], { icons: noIcons, width: 52, height: 36 }));
    expect(svg).toContain(`data-element-id=${small}`);
    expect(svg).not.toContain(`data-element-id=${wide}`);
    expect(svg).toContain('width=52 height=36');

    cfg.elements[0]!.payload.isHidden = true;
    const dimmed = flatten(renderLayerThumb(rectangular(cfg), [small], { icons: noIcons, width: 52, height: 36 }));
    expect(dimmed).toContain(`data-element-id=${small} opacity=0.35`);
  });

  it("draws the background and border for the face row", () => {
    const { cfg } = twoLayers();
    cfg.perFamily.rectangular!.backgroundColorHex = "#112233";
    cfg.perFamily.rectangular!.borderColorHex = "#FF0000";
    cfg.perFamily.rectangular!.borderWidth = 2;
    const svg = flatten(renderLayerThumb(rectangular(cfg), [], { icons: noIcons, width: 52, height: 36 }));
    expect(svg).toContain('fill=#112233');
    expect(svg).toContain('stroke=#FF0000');
    expect(svg).not.toContain("data-element-id");
  });
});
