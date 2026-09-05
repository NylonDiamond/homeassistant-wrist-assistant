// Layer groups are editor-only: a folder in the Layers list whose members sit
// together in the draw order. The watch ignores the field, so the one thing
// the model has to get right is keeping each block whole through reorders,
// deletes and a round trip through the wire.

import { describe, expect, it } from "vitest";

import {
  auditUnknownKeys,
  createGroup,
  encodeConfig,
  groupMembers,
  groupOf,
  newConfig,
  newElement,
  packGroups,
  parseConfig,
  removeElement,
  setGroup,
  ungroup,
} from "../src/model.js";

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

const order = (cfg: ReturnType<typeof newConfig>) => cfg.elements.map((e) => e.payload.id);

describe("layer groups", () => {
  it("packs the members together where the topmost one was", () => {
    const { cfg, ids } = config();
    const [shape, text, icon, gauge] = ids as [string, string, string, string];
    const gid = createGroup(cfg, [shape, icon], "Dial")!;
    expect(gid).toBeDefined();
    // The block lands where its topmost member (the icon) was, above the text.
    expect(order(cfg)).toEqual([text, shape, icon, gauge]);
    expect(groupMembers(cfg, gid).map((e) => e.payload.id)).toEqual([shape, icon]);
    expect(groupOf(cfg, shape)?.name).toBe("Dial");
    expect(groupOf(cfg, text)).toBeUndefined();
  });

  it("refuses a group of one", () => {
    const { cfg, ids } = config();
    expect(createGroup(cfg, [ids[0]!])).toBeUndefined();
    expect(cfg.groups).toBeUndefined();
  });

  it("keeps a block whole after a reorder splits it", () => {
    const { cfg, ids } = config();
    const [shape, text, icon, gauge] = ids as [string, string, string, string];
    createGroup(cfg, [shape, text]);
    // Someone drags the gauge into the middle of the block.
    const g = cfg.elements.find((e) => e.payload.id === gauge)!;
    cfg.elements = cfg.elements.filter((e) => e !== g);
    cfg.elements.splice(1, 0, g);
    packGroups(cfg);
    const o = order(cfg);
    expect(o.indexOf(text) - o.indexOf(shape)).toBe(1);
    expect(o).toContain(gauge);
    expect(o).toContain(icon);
  });

  it("drops a group when its last member goes", () => {
    const { cfg, ids } = config();
    const [shape, text] = ids as [string, string];
    const gid = createGroup(cfg, [shape, text])!;
    removeElement(cfg, shape);
    expect(groupMembers(cfg, gid)).toHaveLength(1);
    removeElement(cfg, text);
    expect(cfg.groups).toBeUndefined();
  });

  it("lets a layer join and leave", () => {
    const { cfg, ids } = config();
    const [shape, text, icon] = ids as [string, string, string];
    const gid = createGroup(cfg, [shape, text])!;
    setGroup(cfg, icon, gid);
    expect(groupMembers(cfg, gid)).toHaveLength(3);
    setGroup(cfg, icon, undefined);
    expect(groupMembers(cfg, gid)).toHaveLength(2);
    ungroup(cfg, gid);
    expect(cfg.groups).toBeUndefined();
    expect(cfg.elements.every((e) => e.payload.groupId === undefined)).toBe(true);
  });

  it("survives the wire and passes the unknown-key audit", () => {
    const { cfg, ids } = config();
    const gid = createGroup(cfg, [ids[0]!, ids[1]!], "Dial")!;
    cfg.groups![0]!.locked = false;
    const raw = encodeConfig(cfg);
    expect(auditUnknownKeys(raw)).toEqual([]);
    const back = parseConfig(raw);
    expect(back.groups).toEqual([{ id: gid, name: "Dial", locked: false }]);
    expect(groupMembers(back, gid)).toHaveLength(2);
    // A document with no groups writes no groups key at all.
    ungroup(cfg, gid);
    expect("groups" in encodeConfig(cfg)).toBe(false);
  });

  it("forgets a membership that names no group", () => {
    const { cfg, ids } = config();
    const raw = encodeConfig(cfg) as { elements: { payload: Record<string, unknown> }[] };
    raw.elements[0]!.payload.groupId = "NOPE";
    const back = parseConfig(raw);
    expect(back.elements.find((e) => e.payload.id === ids[0])?.payload.groupId).toBeUndefined();
  });
});
