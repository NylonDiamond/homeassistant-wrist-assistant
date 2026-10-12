// `legacyControlEntityId`: the entity of the watch's old Control Center entry
// a control-only document was moved from. The watch's old Toggle and Action
// tiles find their document by it. The panel keeps it, in the app's key order
// (last, after `control`), on its own record, and drops it everywhere the
// document leaves that record: share, backup, gallery upload, import,
// duplicate, a copy onto another device, Save as new, a part, and the shape
// half of a split.
// Plan: app repo docs/control_center_move.md, slice 5.

import { describe, expect, it } from "vitest";

import { copyForOwner, duplicateAs, linkedCopy, linkedDocumentFor } from "../src/copies.js";
import { type GalleryMeta, buildGallerySubmission, designFingerprint } from "../src/gallery.js";
import { addFamily } from "../src/layouts.js";
import { auditUnknownKeys, encodeConfig, newConfig, newControlConfig, parseConfig } from "../src/model.js";
import { partFromSelection } from "../src/parts.js";
import { splitDocument } from "../src/splitShapes.js";
import { exportObject, exportText, parseImportText } from "../src/transfer.js";

const ENTITY = "light.kitchen";

function moved() {
  const cfg = newControlConfig("Kitchen", 3);
  cfg.legacyControlEntityId = ENTITY;
  return cfg;
}

const META: GalleryMeta = {
  title: "Kitchen",
  description: "A light.",
  authorName: "sam",
  tags: ["lights"],
  panelVersion: "3.1.2",
};

describe("the key on its own record", () => {
  it("round trips, written last, after control", () => {
    const encoded = encodeConfig(moved());
    expect(encoded.legacyControlEntityId).toBe(ENTITY);
    const keys = Object.keys(encoded);
    expect(keys.at(-1)).toBe("legacyControlEntityId");
    expect(keys.at(-2)).toBe("control");
    const back = parseConfig(JSON.parse(JSON.stringify(encoded)));
    expect(back.legacyControlEntityId).toBe(ENTITY);
    expect(JSON.stringify(encodeConfig(back))).toBe(JSON.stringify(encoded));
  });

  it("is a key the panel knows, so the document stays editable", () => {
    expect(auditUnknownKeys(encodeConfig(moved()))).toEqual([]);
  });

  it("is absent on every other document, and an empty one reads as absent", () => {
    expect("legacyControlEntityId" in encodeConfig(newControlConfig("Plain", 0))).toBe(false);
    const raw = { ...encodeConfig(moved()), legacyControlEntityId: "" };
    const parsed = parseConfig(raw);
    expect(parsed.legacyControlEntityId).toBeUndefined();
    expect("legacyControlEntityId" in encodeConfig(parsed)).toBe(false);
  });
});

describe("the key never leaves its record", () => {
  it("a share and a backup both drop it", () => {
    expect(JSON.parse(exportText(moved(), "share", [])).legacyControlEntityId).toBeUndefined();
    expect(JSON.parse(exportText(moved(), "backup")).legacyControlEntityId).toBeUndefined();
    expect(exportObject(moved(), "backup").control).toBeDefined();
  });

  it("an import drops it, even from text that carries it", () => {
    const text = JSON.stringify({ ...JSON.parse(exportText(moved(), "backup")), legacyControlEntityId: ENTITY });
    const parsed = parseImportText(text, 99);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.config.legacyControlEntityId).toBeUndefined();
  });

  it("a gallery upload drops it, and it does not move the design's fingerprint", () => {
    const body = buildGallerySubmission(moved(), [], META);
    expect(body.shareText).not.toContain("legacyControlEntityId");
    expect(body.shareText).not.toContain(ENTITY);
    const plain = moved();
    delete plain.legacyControlEntityId;
    expect(designFingerprint(moved())).toBe(designFingerprint(plain));
  });

  it("a duplicate drops it, as a control or as a shape", () => {
    const asControl = duplicateAs(moved(), undefined, { id: "B0000000-0000-4000-8000-000000000001", slotIndex: 4 });
    expect(asControl.control).toBeDefined();
    expect(asControl.legacyControlEntityId).toBeUndefined();
    const asShape = duplicateAs(moved(), "rectangular", { id: "B0000000-0000-4000-8000-000000000002", slotIndex: 4 });
    expect(asShape.legacyControlEntityId).toBeUndefined();
  });

  it("a copy onto another record drops it, and a linked copy too", () => {
    const copy = copyForOwner(moved(), { id: "B0000000-0000-4000-8000-000000000003", slotIndex: 5, hidden: false, families: [] });
    expect(copy.legacyControlEntityId).toBeUndefined();
    const linked = linkedCopy(moved(), "C0000000-0000-4000-8000-000000000001", { id: "B0000000-0000-4000-8000-000000000004", slotIndex: 6 });
    expect(linked.legacyControlEntityId).toBeUndefined();
  });

  it("a save written to a linked sibling keeps the sibling's own, never the saved one's", () => {
    const saved = moved();
    const sibling = { id: "B0000000-0000-4000-8000-000000000005", slotIndex: 1, hidden: false };
    expect(linkedDocumentFor(saved, sibling).legacyControlEntityId).toBeUndefined();
    expect(linkedDocumentFor(saved, { ...sibling, legacyControlEntityId: "switch.fan" }).legacyControlEntityId).toBe("switch.fan");
    const plain = moved();
    delete plain.legacyControlEntityId;
    expect(linkedDocumentFor(plain, { ...sibling, legacyControlEntityId: ENTITY }).legacyControlEntityId).toBe(ENTITY);
  });

  it("a part drops it", () => {
    const cfg = newConfig("Kitchen", 0, "rectangular");
    cfg.legacyControlEntityId = ENTITY;
    const ids = cfg.elements.map((e) => e.payload.id);
    expect(partFromSelection(cfg, ids, "Part", "rectangular").legacyControlEntityId).toBeUndefined();
  });

  it("a split leaves it on the control and takes it off the shape", () => {
    const cfg = moved();
    addFamily(cfg, "rectangular");
    let n = 0;
    const children = splitDocument(cfg, () => `D0000000-0000-4000-8000-00000000000${++n}`);
    const control = children.find((c) => c.control !== undefined);
    const shape = children.find((c) => c.control === undefined);
    expect(control?.legacyControlEntityId).toBe(ENTITY);
    expect(shape).toBeDefined();
    expect(shape?.legacyControlEntityId).toBeUndefined();
  });
});
