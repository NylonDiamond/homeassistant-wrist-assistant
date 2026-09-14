// A drag on one layer of a pick moves every picked layer. What it moves is
// decided in the model, so the rules are pinned here: groups come whole, and a
// layer the chart places is left where the chart puts it.

import { describe, expect, it } from "vitest";

import { createGroup, newConfig, newElement, pickedMoveIds } from "../src/model.js";

function config() {
  const cfg = newConfig("Test", 0);
  const ids: string[] = [];
  for (const kind of ["shape", "text", "icon", "gauge"] as const) {
    const el = newElement(kind);
    cfg.elements.push(el);
    ids.push(el.payload.id);
  }
  return { cfg, ids };
}

describe("dragging a pick", () => {
  it("moves the picked layers in draw order", () => {
    const { cfg, ids } = config();
    const [shape, , icon, gauge] = ids as [string, string, string, string];
    expect(pickedMoveIds(cfg, [gauge, shape, icon])).toEqual([shape, icon, gauge]);
  });

  it("brings every member of a picked layer's group", () => {
    const { cfg, ids } = config();
    const [shape, text, icon, gauge] = ids as [string, string, string, string];
    createGroup(cfg, [shape, icon], "Dial");
    const moved = pickedMoveIds(cfg, [icon, gauge]);
    expect(new Set(moved)).toEqual(new Set([shape, icon, gauge]));
    expect(moved).not.toContain(text);
  });

  it("leaves a layer anchored to a chart reading where the chart puts it", () => {
    const { cfg, ids } = config();
    const [shape, text] = ids as [string, string, string, string];
    const el = cfg.elements.find((e) => e.payload.id === text)!;
    el.payload.chartAnchor = { chartId: "chart", at: "latest", place: "above" } as unknown as typeof el.payload.chartAnchor;
    expect(pickedMoveIds(cfg, [shape, text])).toEqual([shape]);
  });

  it("ignores a picked id that is no longer a layer", () => {
    const { cfg, ids } = config();
    const [shape] = ids as [string, string, string, string];
    expect(pickedMoveIds(cfg, [shape, "gone"])).toEqual([shape]);
  });
});
