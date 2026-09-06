// ⌘C / ⌘V for layers. A copy has to carry what a duplicate carries (the
// attached tap, a chart's numbers, every shape's placement, the group), and a
// paste has to point every link at the copies, in this document or another.

import { describe, expect, it } from "vitest";

import {
  attachedTapsOf,
  chartLabelsOf,
  copyElements,
  createGroup,
  groupMembers,
  groupOf,
  newConfig,
  newElement,
  pasteElements,
  syncAttachedTaps,
  type TapElement,
  type TextElement,
} from "../src/model.js";
import { setPlacement } from "../src/editors.js";

function withIconAndTap() {
  const cfg = newConfig("Test", 0);
  const icon = newElement("icon");
  const tap = newElement("tap");
  (tap.payload as TapElement).attachedTo = icon.payload.id;
  cfg.elements = [icon, tap];
  syncAttachedTaps(cfg);
  return { cfg, icon, tap };
}

describe("copyElements", () => {
  it("takes the attached tap, the placements and the group along", () => {
    const { cfg, icon, tap } = withIconAndTap();
    const text = newElement("text");
    cfg.elements.push(text);
    setPlacement(cfg, "circular", icon.payload.id, { isHidden: true });
    const gid = createGroup(cfg, [icon.payload.id, text.payload.id], "Dial")!;
    const clip = copyElements(cfg, [icon.payload.id, text.payload.id]);
    expect(clip.elements.map((e) => e.payload.id).sort()).toEqual([icon.payload.id, tap.payload.id, text.payload.id].sort());
    expect(clip.placements.circular?.[icon.payload.id]?.isHidden).toBe(true);
    expect(clip.groups.map((g) => g.id)).toEqual([gid]);
    // A clone, not a view: editing the clip leaves the document alone.
    clip.elements[0]!.payload.frame.x = 0.123;
    expect(cfg.elements[0]!.payload.frame.x).not.toBe(0.123);
  });

  it("takes a chart's numbers with the chart", () => {
    const cfg = newConfig("Test", 0);
    const chart = newElement("chart");
    const label = newElement("text");
    (label.payload as TextElement).value = { kind: { kind: "chartStat", layer: chart.payload.id, stat: "latest" } };
    cfg.elements = [chart, label];
    expect(chartLabelsOf(cfg, chart.payload.id)).toHaveLength(1);
    const clip = copyElements(cfg, [chart.payload.id]);
    expect(clip.elements).toHaveLength(2);
  });
});

describe("pasteElements", () => {
  it("pastes under fresh ids, on top, nudged, with the tap on the copy", () => {
    const { cfg, icon, tap } = withIconAndTap();
    const clip = copyElements(cfg, [icon.payload.id]);
    const pasted = pasteElements(cfg, clip);
    expect(pasted).toHaveLength(1);
    const copyId = pasted[0]!;
    expect(copyId).not.toBe(icon.payload.id);
    expect(cfg.elements).toHaveLength(4);
    const copy = cfg.elements.find((e) => e.payload.id === copyId)!;
    expect(copy.payload.frame.x).toBeCloseTo(icon.payload.frame.x + 0.05, 9);
    const copyTap = attachedTapsOf(cfg, copyId)[0]!;
    expect(copyTap.payload.id).not.toBe(tap.payload.id);
    // The original keeps its own tap.
    expect(attachedTapsOf(cfg, icon.payload.id)[0]!.payload.id).toBe(tap.payload.id);
  });

  it("does not nudge when pasting into another document, and copies placements", () => {
    const { cfg, icon } = withIconAndTap();
    setPlacement(cfg, "circular", icon.payload.id, { frame: { x: 0.2, y: 0.3, width: 0.4, height: 0.4, rotationDegrees: 0 } });
    const clip = copyElements(cfg, [icon.payload.id]);
    const other = newConfig("Other", 0);
    const [copyId] = pasteElements(other, clip);
    const copy = other.elements.find((e) => e.payload.id === copyId)!;
    expect(copy.payload.frame).toEqual(icon.payload.frame);
    expect(other.perFamily.circular?.placements[copyId!]?.frame.x).toBe(0.2);
    expect(other.perFamily.circular?.placements[icon.payload.id]).toBeUndefined();
  });

  it("recreates a group when two of its members paste together", () => {
    const cfg = newConfig("Test", 0);
    const a = newElement("text");
    const b = newElement("icon");
    const c = newElement("shape");
    cfg.elements = [a, b, c];
    const gid = createGroup(cfg, [a.payload.id, b.payload.id], "Pair")!;
    const both = pasteElements(cfg, copyElements(cfg, [a.payload.id, b.payload.id]));
    const newGroup = groupOf(cfg, both[0]!)!;
    expect(newGroup.id).not.toBe(gid);
    expect(newGroup.name).toBe("Pair");
    expect(groupMembers(cfg, newGroup.id).map((e) => e.payload.id).sort()).toEqual([...both].sort());
    // Alone, a member is just a layer.
    const [lone] = pasteElements(cfg, copyElements(cfg, [a.payload.id]));
    expect(groupOf(cfg, lone!)).toBeUndefined();
  });

  it("points a pasted number at the pasted chart, and drops one with no chart", () => {
    const cfg = newConfig("Test", 0);
    const chart = newElement("chart");
    const label = newElement("text");
    (label.payload as TextElement).value = { kind: { kind: "chartStat", layer: chart.payload.id, stat: "latest" } };
    cfg.elements = [chart, label];
    const clip = copyElements(cfg, [chart.payload.id]);
    const other = newConfig("Other", 0);
    const pasted = pasteElements(other, clip);
    const newChart = pasted.find((id) => other.elements.find((e) => e.payload.id === id)?.kind === "chart")!;
    expect(chartLabelsOf(other, newChart)).toHaveLength(1);
    // The number alone, somewhere its chart does not exist: nothing to print.
    const loneClip = copyElements(cfg, [label.payload.id]);
    expect(pasteElements(newConfig("Empty", 0), loneClip)).toEqual([]);
    // In its own document it still reads the chart it always did.
    expect(pasteElements(cfg, loneClip)).toHaveLength(1);
  });
});
