// Nested layer groups (decided 2026-09-23): a group can sit inside another one
// through `parentId`. The watch never reads groups, so what has to hold is the
// editor's side: the key rides the wire only when set, a bad parent is dropped
// on the way in, a group's whole subtree stays one block through every edit,
// every group operation reaches the whole subtree, copies land under fresh ids
// with their parents pointing at the copies, and a picture's timestamp sits in
// the picture's group.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { Draft } from "../src/draft.js";
import { applyGalleryOverrides, buildGallerySubmission, galleryPublicFields } from "../src/gallery.js";
import {
  type CustomComplicationConfig,
  type Element,
  type LayerGroup,
  addImageTime,
  auditUnknownKeys,
  copyElements,
  createGroup,
  encodeConfig,
  groupAncestors,
  groupById,
  groupChain,
  groupDepth,
  groupDescendants,
  groupLayers,
  groupMembers,
  groupMoveUnit,
  groupOf,
  liftChartOwnMarks,
  lockedUnitOf,
  moveRowBeside,
  newConfig,
  newElement,
  packGroups,
  parseConfig,
  pasteElements,
  pickedMoveIds,
  removeElement,
  removeImageTimestamp,
  setGroupParent,
  stepGroup,
  stepLayer,
  ungroup,
} from "../src/model.js";
import { layerListRows } from "../src/panel.js";
import { insertPart, partFromSelection } from "../src/parts.js";
import { exportText, parseImportText } from "../src/transfer.js";

type Image = Extract<Element, { kind: "image" }>;

const ids = (els: readonly Element[]) => els.map((e) => e.payload.id);
const order = (cfg: CustomComplicationConfig) => ids(cfg.elements.filter((e) => e.kind !== "tap"));
const group = (cfg: CustomComplicationConfig, id: string | undefined): LayerGroup => groupById(cfg, id)!;

/** Every group's subtree is one unbroken run of rows, every group holds a
 * layer somewhere, and every parent names a group of the document. */
function expectWhole(cfg: CustomComplicationConfig): void {
  const rows = order(cfg);
  for (const g of cfg.groups ?? []) {
    const at = ids(groupLayers(cfg, g.id)).map((id) => rows.indexOf(id)).sort((a, b) => a - b);
    expect(at.length, `group ${g.name} is empty`).toBeGreaterThan(0);
    expect(at[at.length - 1]! - at[0]! + 1, `group ${g.name} is split`).toBe(at.length);
    if (g.parentId !== undefined) expect(groupById(cfg, g.parentId), `group ${g.name} names a missing parent`).toBeDefined();
  }
  for (const el of cfg.elements) {
    if (el.payload.groupId !== undefined) expect(groupById(cfg, el.payload.groupId)).toBeDefined();
  }
}

/**
 * Five layers, a to e from the bottom. `outer` holds a, b, c and d; `inner`,
 * inside it, holds b and c. e is on its own.
 */
function nested() {
  const cfg = newConfig("Nest", 0);
  const layers = (["shape", "text", "icon", "gauge", "shape"] as const).map((kind) => {
    const el = newElement(kind);
    cfg.elements.push(el);
    return el.payload.id;
  });
  const [a, b, c, d, e] = layers as [string, string, string, string, string];
  const outer = createGroup(cfg, [a, b, c, d], "Outer")!;
  const inner = createGroup(cfg, [b, c], "Inner")!;
  return { cfg, a, b, c, d, e, outer, inner };
}

describe("nested groups on the wire", () => {
  it("writes parentId only on a group that has one, and reads it back", () => {
    const { cfg, outer, inner } = nested();
    expect(group(cfg, inner).parentId).toBe(outer);
    const raw = encodeConfig(cfg) as { groups: Record<string, unknown>[] };
    expect(raw.groups.find((g) => g.id === outer)).toEqual({ id: outer, name: "Outer", locked: true });
    expect(raw.groups.find((g) => g.id === inner)).toEqual({ id: inner, name: "Inner", locked: true, parentId: outer });
    expect(auditUnknownKeys(raw)).toEqual([]);
    const back = parseConfig(JSON.parse(JSON.stringify(raw)));
    expect(back.groups).toEqual(cfg.groups);
    expect(encodeConfig(back)).toEqual(encodeConfig(cfg));
  });

  it("encodes a document without nesting exactly as before", () => {
    // A fixture written before nesting existed: its groups come back unchanged,
    // key for key, and a second pass is identical to the first.
    const fixture = JSON.parse(readFileSync(join(__dirname, "fixtures", "chart_series.json"), "utf8")) as { config: { groups: unknown[] } };
    const once = encodeConfig(parseConfig(fixture.config));
    expect(once.groups).toEqual(fixture.config.groups);
    expect(JSON.stringify(once.groups)).not.toContain("parentId");
    expect(JSON.stringify(encodeConfig(parseConfig(JSON.parse(JSON.stringify(once)))))).toBe(JSON.stringify(once));
    // So does one made in the editor today with flat groups only.
    const cfg = newConfig("Flat", 0);
    for (let i = 0; i < 3; i++) cfg.elements.push(newElement("shape"));
    createGroup(cfg, ids(cfg.elements.slice(0, 2)));
    expect(JSON.stringify(encodeConfig(cfg))).not.toContain("parentId");
  });

  it("drops a parent that is missing, itself, or closes a loop, and keeps one that only points into a loop", () => {
    const cfg = newConfig("Bad", 0);
    const names = ["A", "B", "C", "D", "E", "F"];
    for (const name of names) {
      const el = newElement("shape");
      el.payload.groupId = name;
      cfg.elements.push(el);
    }
    const raw = encodeConfig(cfg) as Record<string, unknown>;
    raw.groups = [
      { id: "A", name: "A", locked: true, parentId: "NOPE" },
      { id: "B", name: "B", locked: true, parentId: "B" },
      { id: "C", name: "C", locked: true, parentId: "D" },
      { id: "D", name: "D", locked: true, parentId: "C" },
      { id: "E", name: "E", locked: true, parentId: "C" },
      { id: "F", name: "F", locked: true, parentId: "e" },
    ];
    expect(auditUnknownKeys(raw)).toEqual([]);
    const back = parseConfig(raw);
    expect(group(back, "A").parentId).toBeUndefined();
    expect(group(back, "B").parentId).toBeUndefined();
    // The loop is cut once, at the first group whose walk comes back to it.
    expect(group(back, "C").parentId).toBeUndefined();
    expect(group(back, "D").parentId).toBe("C");
    expect(group(back, "E").parentId).toBe("C");
    // Read upper-cased, like every other id.
    expect(group(back, "F").parentId).toBe("E");
    for (const g of back.groups!) expect(groupChain(back, g.id).length).toBeLessThanOrEqual(names.length);
  });
});

describe("model helpers", () => {
  it("walk a group's chain and subtree", () => {
    const { cfg, a, b, outer, inner } = nested();
    expect(groupChain(cfg, inner).map((g) => g.id)).toEqual([inner, outer]);
    expect(groupAncestors(cfg, inner).map((g) => g.id)).toEqual([outer]);
    expect(groupDepth(cfg, outer)).toBe(0);
    expect(groupDepth(cfg, inner)).toBe(1);
    expect(groupDescendants(cfg, outer).map((g) => g.id)).toEqual([inner]);
    expect(ids(groupMembers(cfg, outer))).toEqual([a, cfg.elements[3]!.payload.id]);
    expect(ids(groupLayers(cfg, outer))).toHaveLength(4);
    expect(groupOf(cfg, b)?.id).toBe(inner);
    expectWhole(cfg);
  });

  it("name the unit a press or a drag moves", () => {
    const { cfg, b, e, outer, inner } = nested();
    // Both locked: the outermost locked group is the unit.
    expect(lockedUnitOf(cfg, b)?.id).toBe(outer);
    expect(groupMoveUnit(cfg, inner)?.id).toBe(outer);
    // Outer unlocked: the inner group is its own unit.
    group(cfg, outer).locked = false;
    expect(lockedUnitOf(cfg, b)?.id).toBe(inner);
    expect(groupMoveUnit(cfg, inner)?.id).toBe(inner);
    expect(groupMoveUnit(cfg, outer)?.id).toBe(outer);
    // Nothing locked: a press takes the layer alone.
    group(cfg, inner).locked = false;
    expect(lockedUnitOf(cfg, b)).toBeUndefined();
    expect(lockedUnitOf(cfg, e)).toBeUndefined();
  });

  it("drag a pick with the unit each picked layer belongs to", () => {
    const { cfg, a, b, c, e, outer } = nested();
    // Locked outer: picking b brings all of outer.
    expect(new Set(pickedMoveIds(cfg, [b, e]))).toEqual(new Set([...ids(groupLayers(cfg, outer)), e]));
    // Unlocked outer, locked inner: b brings inner only, and a, whose own
    // group is now unlocked, moves alone.
    group(cfg, outer).locked = false;
    expect(new Set(pickedMoveIds(cfg, [b, e]))).toEqual(new Set([b, c, e]));
    expect(pickedMoveIds(cfg, [a])).toEqual([a]);
  });
});

describe("keeping every block whole", () => {
  it("packs a scrambled document into nested blocks, each where its topmost layer was", () => {
    const { cfg, a, b, c, d, e } = nested();
    // Shuffle the rows by hand: e lands in the middle of inner.
    const el = (id: string) => cfg.elements.find((x) => x.payload.id === id)!;
    cfg.elements = [el(b), el(e), el(a), el(c), el(d)];
    packGroups(cfg);
    expectWhole(cfg);
    // e stays below outer, whose topmost layer (d) stayed on top; inside
    // outer, inner's block sits where c, its topmost layer, was: above a.
    expect(order(cfg)).toEqual([e, a, b, c, d]);
  });

  it("drags a layer into a sub-group, out to the parent, and out to the top level", () => {
    const { cfg, a, b, e, outer, inner } = nested();
    expect(moveRowBeside(cfg, e, b, true, inner)).toBe(true);
    expect(groupOf(cfg, e)?.id).toBe(inner);
    expectWhole(cfg);
    expect(moveRowBeside(cfg, e, a, false, outer)).toBe(true);
    expect(groupOf(cfg, e)?.id).toBe(outer);
    expect(order(cfg)[0]).toBe(e);
    expectWhole(cfg);
    // Beside the outer folder's bottom edge: below the whole group, top level.
    expect(moveRowBeside(cfg, e, outer, false, undefined)).toBe(true);
    expect(groupOf(cfg, e)).toBeUndefined();
    expect(order(cfg)[0]).toBe(e);
    expectWhole(cfg);
  });

  it("drags a whole group into another group, and out again", () => {
    const { cfg, a, e, outer, inner } = nested();
    const lone = newElement("shape");
    cfg.elements.push(lone);
    const third = createGroup(cfg, [e, lone.payload.id], "Third")!;
    // Into inner, at its top: a sub-group two levels down.
    expect(moveRowBeside(cfg, third, inner, true, inner)).toBe(true);
    expect(group(cfg, third).parentId).toBe(inner);
    expect(groupDepth(cfg, third)).toBe(2);
    expectWhole(cfg);
    // Beside a member of outer: a sub-group of outer.
    expect(moveRowBeside(cfg, third, a, true, outer)).toBe(true);
    expect(group(cfg, third).parentId).toBe(outer);
    expectWhole(cfg);
    // To the top level above outer.
    expect(moveRowBeside(cfg, third, outer, true, undefined)).toBe(true);
    expect(group(cfg, third).parentId).toBeUndefined();
    expect(order(cfg).slice(-2)).toEqual([e, lone.payload.id]);
    expectWhole(cfg);
  });

  it("refuses to put a group inside itself or beside its own rows", () => {
    const { cfg, b, outer, inner } = nested();
    const before = structuredClone(cfg);
    expect(moveRowBeside(cfg, outer, inner, true, inner)).toBe(false);
    expect(moveRowBeside(cfg, outer, b, true, inner)).toBe(false);
    expect(setGroupParent(cfg, outer, inner)).toBe(false);
    expect(setGroupParent(cfg, outer, outer)).toBe(false);
    expect(cfg).toEqual(before);
  });

  it("steps a layer one level at a time, and swaps inside its own group", () => {
    const { cfg, b, c, d, e, outer, inner } = nested();
    // c is inner's top layer; forward leaves inner for outer, staying put.
    stepLayer(cfg, c, 1);
    expect(groupOf(cfg, c)?.id).toBe(outer);
    expectWhole(cfg);
    // Next forward swaps it past d, a layer of outer.
    stepLayer(cfg, c, 1);
    expect(order(cfg).indexOf(c)).toBeGreaterThan(order(cfg).indexOf(d));
    expectWhole(cfg);
    // At outer's top edge, forward leaves outer for the top level.
    stepLayer(cfg, c, 1);
    expect(groupOf(cfg, c)).toBeUndefined();
    expectWhole(cfg);
    // e, the top row now, steps back beside c... then into outer, then into
    // inner, one level each.
    stepLayer(cfg, e, -1);
    expect(order(cfg).indexOf(e)).toBeLessThan(order(cfg).indexOf(c));
    stepLayer(cfg, e, -1);
    expect(groupOf(cfg, e)?.id).toBe(outer);
    expectWhole(cfg);
    stepLayer(cfg, e, -1);
    expect(order(cfg).indexOf(e)).toBeLessThan(order(cfg).indexOf(d));
    stepLayer(cfg, e, -1);
    expect(groupOf(cfg, e)?.id).toBe(inner);
    expect(ids(groupLayers(cfg, inner)).sort()).toEqual([b, e].sort());
    expectWhole(cfg);
  });

  it("steps a whole group past a sibling, and out at its parent's edge", () => {
    const { cfg, d, outer, inner } = nested();
    stepGroup(cfg, inner, 1);
    expect(order(cfg).indexOf(d)).toBeLessThan(Math.min(...ids(groupLayers(cfg, inner)).map((id) => order(cfg).indexOf(id))));
    expect(group(cfg, inner).parentId).toBe(outer);
    expectWhole(cfg);
    stepGroup(cfg, inner, 1);
    expect(group(cfg, inner).parentId).toBeUndefined();
    expectWhole(cfg);
  });
});

describe("group and ungroup at depth", () => {
  it("makes a sub-group of layers that share a group", () => {
    const { cfg, inner, outer } = nested();
    expect(group(cfg, inner).parentId).toBe(outer);
    expect(group(cfg, inner).locked).toBe(true);
  });

  it("takes a whole sub-group along into the new group, and pulls other layers out", () => {
    const { cfg, b, c, d, outer, inner } = nested();
    const made = createGroup(cfg, [b, c, d], "Made")!;
    // All three share outer, so the new group is inside it, and inner, picked
    // whole, goes into the new group rather than being taken apart.
    expect(group(cfg, made).parentId).toBe(outer);
    expect(group(cfg, inner).parentId).toBe(made);
    expect(groupOf(cfg, d)?.id).toBe(made);
    expect(groupOf(cfg, b)?.id).toBe(inner);
    expectWhole(cfg);
  });

  it("ungroups one level: the layers and sub-groups move up to the parent", () => {
    const { cfg, a, b, c, d, outer, inner } = nested();
    ungroup(cfg, inner);
    expect(groupById(cfg, inner)).toBeUndefined();
    expect([b, c].map((id) => groupOf(cfg, id)?.id)).toEqual([outer, outer]);
    expectWhole(cfg);
    const again = nested();
    ungroup(again.cfg, again.outer);
    expect(groupOf(again.cfg, again.a)).toBeUndefined();
    expect(group(again.cfg, again.inner).parentId).toBeUndefined();
    expect(groupOf(again.cfg, again.b)?.id).toBe(again.inner);
    expectWhole(again.cfg);
    void a; void d;
  });
});

describe("copying, duplicating and deleting", () => {
  it("pastes a copied group with its sub-group under fresh ids, the parent pointing at the copy", () => {
    const { cfg, outer, inner } = nested();
    const landed = pasteElements(cfg, copyElements(cfg, ids(groupLayers(cfg, outer))));
    expect(landed).toHaveLength(4);
    const copies = cfg.groups!.filter((g) => g.id !== outer && g.id !== inner);
    expect(copies.map((g) => g.name).sort()).toEqual(["Inner", "Outer"]);
    const newOuter = copies.find((g) => g.name === "Outer")!;
    const newInner = copies.find((g) => g.name === "Inner")!;
    expect(newOuter.parentId).toBeUndefined();
    expect(newInner.parentId).toBe(newOuter.id);
    expect(ids(groupLayers(cfg, newOuter.id)).sort()).toEqual([...landed].sort());
    // The originals are untouched.
    expect(group(cfg, inner).parentId).toBe(outer);
    expectWhole(cfg);
  });

  it("pastes a copied sub-group alone at the top level, without a parent of one", () => {
    const { cfg, b, c, outer, inner } = nested();
    const before = cfg.groups!.length;
    const landed = pasteElements(cfg, copyElements(cfg, [b, c]));
    expect(cfg.groups!.length).toBe(before + 1);
    const g = groupOf(cfg, landed[0]!)!;
    expect(g.name).toBe("Inner");
    expect(g.id).not.toBe(inner);
    expect(g.parentId).toBeUndefined();
    void outer;
    expectWhole(cfg);
  });

  it("hands a lone copied member up to the group around it", () => {
    const { cfg, a, b, outer, inner } = nested();
    const landed = pasteElements(cfg, copyElements(cfg, [a, b]));
    const g = groupOf(cfg, landed[0]!)!;
    expect(g.name).toBe("Outer");
    expect(g.id).not.toBe(outer);
    expect(landed.map((id) => groupOf(cfg, id)?.id)).toEqual([g.id, g.id]);
    expect(cfg.groups!.some((x) => x.name === "Inner" && x.id !== inner)).toBe(false);
    expectWhole(cfg);
  });

  it("drops an emptied sub-group and keeps its parent, never an empty group or a stray parent", () => {
    const { cfg, a, b, c, d, outer, inner } = nested();
    removeElement(cfg, b);
    removeElement(cfg, c);
    expect(groupById(cfg, inner)).toBeUndefined();
    expect(groupById(cfg, outer)).toBeDefined();
    expectWhole(cfg);
    removeElement(cfg, a);
    removeElement(cfg, d);
    expect(cfg.groups).toBeUndefined();
  });

  it("drops a parent whose only layers were in a sub-group", () => {
    const { cfg, a, b, c, d } = nested();
    removeElement(cfg, a);
    removeElement(cfg, d);
    expectWhole(cfg);
    removeElement(cfg, b);
    removeElement(cfg, c);
    expect(cfg.groups).toBeUndefined();
  });
});

describe("parts, sharing and the gallery", () => {
  it("saves a nested group as a part and drops it into another document with fresh ids", () => {
    const { cfg, outer } = nested();
    const part = partFromSelection(cfg, ids(groupLayers(cfg, outer)), "Nest part", "rectangular");
    expect(part.groups!.map((g) => g.name).sort()).toEqual(["Inner", "Outer"]);
    expect(part.groups!.find((g) => g.name === "Inner")!.parentId).toBe(part.groups!.find((g) => g.name === "Outer")!.id);
    expect(auditUnknownKeys(encodeConfig(part))).toEqual([]);
    const target = newConfig("Target", 0);
    const landed = insertPart(target, part, "rectangular");
    expect(landed).toHaveLength(4);
    const newOuter = target.groups!.find((g) => g.name === "Outer")!;
    const newInner = target.groups!.find((g) => g.name === "Inner")!;
    expect(newInner.parentId).toBe(newOuter.id);
    expect(part.groups!.map((g) => g.id)).not.toContain(newOuter.id);
    expectWhole(target);
  });

  it("carries parentId through a share and back", () => {
    const { cfg, outer, inner } = nested();
    const text = exportText(cfg, "share");
    expect(text).toContain("\"parentId\"");
    const parsed = parseImportText(text, 99);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(groupById(parsed.config, inner)?.parentId).toBe(outer);
    expectWhole(parsed.config);
  });

  it("sends parentId to the gallery, never lists it as text, and renames a sub-group in place", () => {
    const { cfg, outer, inner } = nested();
    const body = buildGallerySubmission(cfg, [], { title: "Nest", description: "", authorName: "", tags: [], panelVersion: "test" });
    expect(body.shareText).toContain(`"parentId":"${outer}"`);
    const fields = galleryPublicFields(cfg, []);
    const all = fields.flatMap((f) => f.values);
    expect(all).not.toContain(outer);
    expect(fields.find((f) => f.label === "Group names")?.values.sort()).toEqual(["Inner", "Outer"]);
    const renamed = applyGalleryOverrides(cfg, { groupNames: new Map([[inner, "Renamed"]]) });
    expect(group(renamed, inner)).toEqual({ id: inner, name: "Renamed", locked: true, parentId: outer });
  });
});

describe("the Layers list", () => {
  it("nests a sub-group's folder inside its parent's, in list order", () => {
    const { cfg, a, b, c, d, e, outer, inner } = nested();
    const rows = layerListRows(cfg, cfg.elements, 1);
    expect(rows.map((r) => (r.kind === "layer" ? r.el.payload.id : r.group.id))).toEqual([e, outer]);
    const top = rows[1]!;
    if (top.kind !== "group") throw new Error("expected a folder");
    expect(ids(top.members)).toEqual([d, c, b, a]);
    expect(top.total).toBe(4);
    expect(top.rows.map((r) => (r.kind === "layer" ? r.el.payload.id : r.group.id))).toEqual([d, inner, a]);
    const sub = top.rows[1]!;
    if (sub.kind !== "group") throw new Error("expected a sub-folder");
    expect(sub.rows.map((r) => (r.kind === "layer" ? r.el.payload.id : ""))).toEqual([c, b]);
    expect(sub.total).toBe(2);
  });
});

// ── picture timestamps ────────────────────────────────────────────────────

function picture(name?: string): { cfg: CustomComplicationConfig; image: Image; other: Element } {
  const cfg = newConfig("Door", 0);
  const other = newElement("shape");
  const image = newElement("image") as Image;
  image.payload.source = "camera";
  image.payload.entity = { entityId: "camera.door", displayName: "Front door", domain: "camera" };
  if (name !== undefined) image.payload.name = name;
  cfg.elements.push(other, image);
  return { cfg, image, other };
}

describe("a picture's timestamp", () => {
  it("goes in a group made for the picture, named after its entity, directly above it", () => {
    const { cfg, image, other } = picture();
    const text = addImageTime(cfg, image.payload.id)!;
    const stamp = groupOf(cfg, text)!;
    const pictureGroup = groupOf(cfg, image.payload.id)!;
    expect(pictureGroup.name).toBe("Front door");
    expect(pictureGroup.locked).toBe(false);
    expect(pictureGroup.parentId).toBeUndefined();
    expect(stamp.name).toBe("Timestamp");
    expect(stamp.locked).toBe(true);
    expect(stamp.parentId).toBe(pictureGroup.id);
    const capsule = groupMembers(cfg, stamp.id)[0]!;
    expect(order(cfg)).toEqual([other.payload.id, image.payload.id, capsule.payload.id, text]);
    expectWhole(cfg);
  });

  it("takes the picture layer's own name for the group when it has one", () => {
    const { cfg, image } = picture("Porch cam");
    addImageTime(cfg, image.payload.id);
    expect(groupOf(cfg, image.payload.id)?.name).toBe("Porch cam");
  });

  it("goes into the picture's own group, directly above the picture", () => {
    const { cfg, image, other } = picture();
    const top = newElement("text");
    cfg.elements.push(top);
    const mine = createGroup(cfg, [image.payload.id, top.payload.id], "Mine")!;
    const text = addImageTime(cfg, image.payload.id)!;
    const stamp = groupOf(cfg, text)!;
    expect(stamp.parentId).toBe(mine);
    const rows = order(cfg);
    expect(rows.indexOf(text)).toBe(rows.indexOf(image.payload.id) + 2);
    expect(rows[rows.length - 1]).toBe(top.payload.id);
    expect(cfg.groups).toHaveLength(2);
    void other;
    expectWhole(cfg);
  });

  it("dissolves the picture's group when its timestamp is deleted, and leaves nothing when the picture is", () => {
    const { cfg, image } = picture();
    const text = addImageTime(cfg, image.payload.id)!;
    removeImageTimestamp(cfg, text);
    expect(cfg.groups).toBeUndefined();
    const again = picture();
    addImageTime(again.cfg, again.image.payload.id);
    removeElement(again.cfg, again.image.payload.id);
    expect(again.cfg.groups).toBeUndefined();
    expect(order(again.cfg)).toEqual([again.other.payload.id]);
  });

  it("leaves the author's group when the picture goes and something else is in it", () => {
    const { cfg, image, other } = picture();
    const mine = createGroup(cfg, [image.payload.id, other.payload.id], "Mine")!;
    addImageTime(cfg, image.payload.id);
    removeElement(cfg, image.payload.id);
    expect(cfg.groups).toEqual([{ id: mine, name: "Mine", locked: true }]);
    expect(groupOf(cfg, other.payload.id)?.id).toBe(mine);
  });
});

describe("opening a timestamp made before nesting", () => {
  /** The shape an open converted to on 2026-09-23: a top-level locked
   * "Timestamp" group of a capsule and a text, beside the picture. */
  function loose(opts: { pictureGroup?: boolean; below?: boolean; between?: boolean } = {}) {
    const { cfg, image, other } = picture();
    const text = addImageTime(cfg, image.payload.id)!;
    const stamp = groupOf(cfg, text)!;
    // Undo the nesting by hand: back to the top level, and no picture group.
    const pictureGroup = groupOf(cfg, image.payload.id)!;
    delete stamp.parentId;
    if (opts.pictureGroup) {
      const extra = newElement("icon");
      cfg.elements.splice(cfg.elements.indexOf(image), 0, extra);
      extra.payload.groupId = pictureGroup.id;
      pictureGroup.name = "Group 1";
    } else {
      delete image.payload.groupId;
      cfg.groups = cfg.groups!.filter((g) => g.id !== pictureGroup.id);
    }
    packGroups(cfg);
    const members = groupMembers(cfg, stamp.id);
    if (opts.below) {
      cfg.elements = [...cfg.elements.filter((e) => !members.includes(e))];
      cfg.elements.splice(1, 0, ...members);
    }
    if (opts.between) {
      const wedge = newElement("shape");
      cfg.elements.splice(cfg.elements.indexOf(members[0]!), 0, wedge);
    }
    return { doc: encodeConfig(cfg), image, text, stamp: stamp.id, other };
  }

  it("moves a loose timestamp into a new group for the picture, without an unsaved change", () => {
    const { doc, image, text, stamp } = loose();
    expect((doc as { groups: LayerGroup[] }).groups).toHaveLength(1);
    const draft = Draft.fromDocument(doc, 1);
    const cfg = draft.config;
    const pictureGroup = groupOf(cfg, image.payload.id)!;
    expect(pictureGroup.name).toBe("Front door");
    expect(group(cfg, stamp).parentId).toBe(pictureGroup.id);
    expect(order(cfg).indexOf(text)).toBe(order(cfg).indexOf(image.payload.id) + 2);
    expect(draft.dirty).toBe(false);
    expectWhole(cfg);
    // Opening again changes nothing.
    const again = structuredClone(cfg);
    liftChartOwnMarks(again);
    expect(encodeConfig(again)).toEqual(encodeConfig(cfg));
  });

  it("moves one sitting below the picture's group into that group, above the picture", () => {
    const { doc, image, text, stamp } = loose({ pictureGroup: true, below: true });
    const cfg = Draft.fromDocument(doc, 1).config;
    const pictureGroup = groupOf(cfg, image.payload.id)!;
    expect(pictureGroup.name).toBe("Group 1");
    expect(group(cfg, stamp).parentId).toBe(pictureGroup.id);
    expect(order(cfg).indexOf(text)).toBe(order(cfg).indexOf(image.payload.id) + 2);
    expectWhole(cfg);
  });

  it("leaves one the author moved away from the picture where it is", () => {
    const { doc, stamp } = loose({ between: true });
    const cfg = Draft.fromDocument(doc, 1).config;
    expect(group(cfg, stamp).parentId).toBeUndefined();
    expect(cfg.groups).toHaveLength(1);
  });

  it("does not pull a timestamp back after it was dragged out of the picture's group", () => {
    const { doc, stamp, other } = loose();
    const cfg = Draft.fromDocument(doc, 1).config;
    // Dragged out to the top level, below the other shape at the bottom.
    expect(moveRowBeside(cfg, stamp, other.payload.id, false, undefined)).toBe(true);
    expect(group(cfg, stamp).parentId).toBeUndefined();
    const reopened = Draft.fromDocument(encodeConfig(cfg), 2).config;
    expect(group(reopened, stamp).parentId).toBeUndefined();
    expect(order(reopened)[0]).toBe(groupMembers(reopened, stamp)[0]!.payload.id);
  });

  it("leaves a group that only looks like a timestamp alone", () => {
    const { doc, stamp } = loose();
    (doc as { groups: { id: string; locked: boolean }[] }).groups.find((g) => g.id === stamp)!.locked = false;
    const cfg = Draft.fromDocument(doc, 1).config;
    expect(group(cfg, stamp).parentId).toBeUndefined();
  });
});
