// A chart gets a group only once a second layer joins it, and loses the group
// again when its last extra leaves. A group of one layer is a folder with
// nothing to fold.

import { describe, expect, it } from "vitest";

import {
  addChartDots,
  addChartGrid,
  addChartLabel,
  addChartMarker,
  createGroup,
  extraOwnerOf,
  groupMembers,
  groupOf,
  newConfig,
  newElement,
  parseConfig,
  encodeConfig,
  removeElement,
  setChartThreshold,
  unwrapLoneOwnerGroup,
} from "../src/model.js";

function chartConfig() {
  const cfg = newConfig("Chart", 0);
  const chart = newElement("chart");
  cfg.elements.push(chart);
  return { cfg, id: chart.payload.id };
}

describe("a chart's group", () => {
  it("has no group while the chart is alone", () => {
    const { cfg, id } = chartConfig();
    expect(groupOf(cfg, id)).toBeUndefined();
    expect(cfg.groups).toBeUndefined();
  });

  it("makes one unlocked group when the first extra joins, and reuses it after", () => {
    const { cfg, id } = chartConfig();
    const label = addChartLabel(cfg, id, "latest")!;
    const group = groupOf(cfg, id)!;
    expect(group.locked).toBe(false);
    expect(groupOf(cfg, label)?.id).toBe(group.id);
    const dots = addChartDots(cfg, id)!;
    expect(groupOf(cfg, dots)?.id).toBe(group.id);
    expect(cfg.groups).toHaveLength(1);
    expect(groupMembers(cfg, group.id)).toHaveLength(3);
  });

  it("unwraps when the last extra is deleted, and keeps the chart", () => {
    const { cfg, id } = chartConfig();
    const label = addChartLabel(cfg, id, "latest")!;
    const grid = addChartGrid(cfg, id)!;
    removeElement(cfg, label);
    expect(groupOf(cfg, id)).toBeDefined();
    removeElement(cfg, grid);
    expect(cfg.groups).toBeUndefined();
    expect(cfg.elements.map((e) => e.payload.id)).toEqual([id]);
    expect(cfg.elements[0]!.payload.groupId).toBeUndefined();
    expect("groups" in encodeConfig(cfg)).toBe(false);
  });

  it("unwraps when turning a threshold off removes its only line", () => {
    const { cfg, id } = chartConfig();
    setChartThreshold(cfg, id, 10);
    expect(groupOf(cfg, id)).toBeDefined();
    setChartThreshold(cfg, id, undefined);
    expect(groupOf(cfg, id)).toBeUndefined();
    expect(cfg.groups).toBeUndefined();
  });

  it("keeps the group while another layer is still in it", () => {
    const { cfg, id } = chartConfig();
    const marker = addChartMarker(cfg, id, "highest")!;
    const text = newElement("text");
    cfg.elements.push(text);
    const gid = groupOf(cfg, id)!.id;
    text.payload.groupId = gid;
    removeElement(cfg, marker);
    expect(groupMembers(cfg, gid).map((e) => e.payload.id).sort()).toEqual([id, text.payload.id].sort());
  });

  it("leaves a group of one alone when the layer that left was not the chart's extra", () => {
    const { cfg, id } = chartConfig();
    const text = newElement("text");
    cfg.elements.push(text);
    const gid = createGroup(cfg, [id, text.payload.id], "Mine")!;
    removeElement(cfg, text.payload.id);
    expect(groupOf(cfg, id)?.id).toBe(gid);
  });

  it("does not unwrap a saved group of one when the document is opened", () => {
    const { cfg, id } = chartConfig();
    cfg.groups = [{ id: "G", name: "Voltage", locked: false }];
    cfg.elements[0]!.payload.groupId = "G";
    const back = parseConfig(encodeConfig(cfg));
    expect(groupOf(back, id)?.id).toBe("G");
  });
});

describe("extraOwnerOf", () => {
  it("names the chart for every kind of extra, and nothing for a plain layer", () => {
    const { cfg, id } = chartConfig();
    const ids = [
      addChartLabel(cfg, id, "latest")!,
      addChartMarker(cfg, id, "lowest")!,
      addChartDots(cfg, id)!,
      addChartGrid(cfg, id)!,
    ];
    for (const extra of ids) {
      expect(extraOwnerOf(cfg.elements.find((e) => e.payload.id === extra)!)).toBe(id);
    }
    expect(extraOwnerOf(newElement("text"))).toBeUndefined();
    expect(extraOwnerOf(cfg.elements.find((e) => e.payload.id === id)!)).toBeUndefined();
  });

  it("unwrapLoneOwnerGroup ignores a missing group or owner", () => {
    const { cfg, id } = chartConfig();
    expect(() => unwrapLoneOwnerGroup(cfg, undefined, id)).not.toThrow();
    expect(() => unwrapLoneOwnerGroup(cfg, "NOPE", id)).not.toThrow();
    expect(() => unwrapLoneOwnerGroup(cfg, "NOPE", undefined)).not.toThrow();
  });
});
