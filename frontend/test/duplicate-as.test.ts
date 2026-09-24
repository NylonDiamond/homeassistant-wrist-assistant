// "Duplicate as": one complication made again as another shape, on another
// device, or both. Every result is one shape on one device, laid out for the
// canvas it landed on, and the document it came from is never touched.

import { lockScreenTitle, placeLabel } from "../src/panel.js";
import { describe, expect, it } from "vitest";

import {
  type CustomComplicationConfig,
  type FamilyKind,
  DESIGN_BOX,
  MAX_SLOTS,
  newConfig,
  newControlConfig,
  newElement,
  newPagesSpec,
  schemaVersionFor,
} from "../src/model.js";
import { familiesFor, supportedFamilies } from "../src/layouts.js";
import {
  type DeviceOwner,
  type PlaceCopy,
  designKind,
  devicePlaces,
  duplicateAs,
  duplicateTargets,
  linkedCopy,
  linkedDocumentFor,
  freeSlotForFamily,
  libraryComingSoon,
  libraryFamilies,
  slotForDuplicate,
} from "../src/copies.js";
import { LIBRARY_OWNER_ID } from "../src/version.js";

const owner = (over: Partial<DeviceOwner> = {}): DeviceOwner => ({
  ownerId: "w1",
  label: "Jesse's Watch",
  kind: "watch",
  families: familiesFor({ device_kind: "watch", app_version: "2.8.0" }),
  comingSoon: [],
  controls: true,
  appVersion: "2.8.0",
  ...over,
});

const WATCH = owner();
const WATCH2 = owner({ ownerId: "w2", label: "Chen's Watch" });
const PHONE = owner({
  ownerId: "p1",
  label: "Jesse's iPhone",
  kind: "iphone",
  families: familiesFor({ device_kind: "iphone", app_version: "2.8.0" }),
});
const OLD_PHONE = owner({
  ownerId: "p2",
  label: "Chen's iPhone",
  kind: "iphone",
  families: familiesFor({ device_kind: "iphone", app_version: "2.7.0" }),
  appVersion: "2.7.0",
});
const LIBRARY = owner({
  ownerId: LIBRARY_OWNER_ID,
  label: "Library",
  kind: "library",
  appVersion: null,
  families: libraryFamilies(),
  comingSoon: libraryComingSoon(),
});

const WRITE = { id: "NEW", slotIndex: 2 };

/** A finished rectangular complication: two layers laid out on it, a data
 * source, a tap action and two pages. What a real "Duplicate as" starts
 * from. */
function kitchen(): CustomComplicationConfig {
  const cfg = newConfig("Kitchen", 5, "rectangular");
  const text = newElement("text");
  text.payload.frame = { x: 0.05, y: 0.1, width: 0.6, height: 0.3, rotationDegrees: 0 };
  (text.payload as { fontSize: number }).fontSize = 18;
  const icon = newElement("icon");
  icon.payload.page = 2;
  cfg.elements = [text, icon];
  const layout = cfg.perFamily.rectangular!;
  for (const el of cfg.elements) {
    layout.placements[el.payload.id] = { frame: { ...el.payload.frame }, isHidden: false, size: 18 };
  }
  cfg.dataSources = [{ kind: "entity", entityId: "sensor.oven", displayName: "Oven", domain: "sensor" }];
  cfg.tapAction = { type: "toggleEntity", entityId: "light.kitchen", displayName: "Kitchen", domain: "light" };
  cfg.pages = newPagesSpec(2, "tap");
  cfg.refreshMinutes = 15;
  return cfg;
}

/** Whether every frame of a shape sits inside its canvas, which is the box
 * frames are fractions of. */
function framesFit(cfg: CustomComplicationConfig, family: FamilyKind): boolean {
  const layout = cfg.perFamily[family];
  if (!layout) return false;
  return Object.values(layout.placements).every((p) =>
    p.frame.x >= 0 && p.frame.y >= 0
    && p.frame.x + p.frame.width <= 1.0001 && p.frame.y + p.frame.height <= 1.0001);
}

describe("duplicateAs", () => {
  it("makes a document of the one shape it was asked for", () => {
    const copy = duplicateAs(kitchen(), "circular", WRITE);
    expect(copy.supportedFamilies).toEqual(["circular"]);
    expect(copy.perFamily.rectangular).toBeUndefined();
    expect(copy.perFamily.circular).toBeDefined();
  });

  it("wears the identity it was given and leaves the original alone", () => {
    const cfg = kitchen();
    const copy = duplicateAs(cfg, "circular", { id: "NEW", slotIndex: 7, hidden: true });
    expect(copy.id).toBe("NEW");
    expect(copy.id).not.toBe(cfg.id);
    expect(copy.slotIndex).toBe(7);
    expect(copy.hidden).toBe(true);
    expect(cfg.supportedFamilies).toEqual(["rectangular"]);
    expect(cfg.slotIndex).toBe(5);
    expect(cfg.elements).toHaveLength(2);
    expect(cfg.hidden).toBeUndefined();
  });

  it("gives every copied layer an id of its own", () => {
    const cfg = kitchen();
    const copy = duplicateAs(cfg, "circular", WRITE);
    const before = cfg.elements.map((el) => el.payload.id);
    for (const el of copy.elements) expect(before).not.toContain(el.payload.id);
  });

  // The name travels unchanged: the pickers are per shape already, and the
  // grid card draws the shape beside it (decided in the plan).
  it("keeps the name", () => {
    expect(duplicateAs(kitchen(), "circular", WRITE).name).toBe("Kitchen");
  });

  it("brings the layers over, laid out for the shape they land on", () => {
    const copy = duplicateAs(kitchen(), "circular", WRITE);
    expect(copy.elements).toHaveLength(2);
    expect(Object.keys(copy.perFamily.circular!.placements)).toHaveLength(2);
    expect(framesFit(copy, "circular")).toBe(true);
    // The circular canvas is a third of the rectangular one's width, so 18 pt
    // text comes down with it rather than arriving as a headline.
    const sizes = Object.values(copy.perFamily.circular!.placements).map((p) => p.size);
    for (const size of sizes) expect(size).toBeLessThan(18);
    expect(DESIGN_BOX.circular.width).toBeLessThan(DESIGN_BOX.rectangular.width);
  });

  it("brings the data sources, the tap action and the pages", () => {
    const copy = duplicateAs(kitchen(), "circular", WRITE);
    expect(copy.dataSources).toHaveLength(1);
    expect(copy.tapAction).toEqual({ type: "toggleEntity", entityId: "light.kitchen", displayName: "Kitchen", domain: "light" });
    expect(copy.pages).toEqual({ count: 2, mode: "tap", dwell: [] });
    expect(copy.refreshMinutes).toBe(15);
    // A layer on page 2 is still on page 2 on the copy.
    expect(copy.elements.some((el) => el.payload.page === 2)).toBe(true);
  });

  // A control is its own document, so a copy asked for as a shape leaves the
  // control behind rather than writing a document of two parts, which is what
  // autoSplitShapes would cut apart on the next open.
  it("drops the Control Center control when a shape is asked for", () => {
    const cfg = kitchen();
    cfg.control = newControlConfig("Kitchen", 5, "rectangular").control!;
    const copy = duplicateAs(cfg, "small", WRITE);
    expect(copy.control).toBeUndefined();
    expect(copy.supportedFamilies).toEqual(["small"]);
  });

  it("copies a shape onto another device as it stands", () => {
    const cfg = kitchen();
    const copy = duplicateAs(cfg, "rectangular", WRITE);
    expect(copy.supportedFamilies).toEqual(["rectangular"]);
    expect(copy.elements).toHaveLength(2);
    expect(Object.keys(copy.perFamily.rectangular!.placements)).toHaveLength(2);
    expect(copy.id).not.toBe(cfg.id);
  });

  // Small and Circular are the same square box, so a tile made from a document
  // holding both starts from Circular rather than from the wider Rectangular.
  it("starts a Small tile from Circular when the document has one", () => {
    const cfg = newConfig("Kitchen", 0, "circular");
    const el = newElement("text");
    cfg.elements = [el];
    cfg.perFamily.circular!.placements[el.payload.id] = {
      frame: { ...el.payload.frame }, isHidden: false, size: 10,
    };
    const copy = duplicateAs(cfg, "small", WRITE);
    // Circular's box is 51 pt and Small's is 162 pt, so the copy scales up.
    expect(Object.values(copy.perFamily.small!.placements)[0]!.size).toBeGreaterThan(10);
  });

  it("only carries inline when inline is the shape asked for", () => {
    const line = duplicateAs(kitchen(), "inline", WRITE);
    expect(line.supportedFamilies).toEqual(["inline"]);
    expect(line.inline).toBeDefined();
    // An inline document has no canvas, so nothing came with it.
    expect(line.elements).toHaveLength(0);
    const back = duplicateAs(line, "circular", WRITE);
    expect(back.supportedFamilies).toEqual(["circular"]);
    expect(back.inline).toBeUndefined();
  });

  it("makes a control-only document when no shape is asked for", () => {
    const copy = duplicateAs(kitchen(), undefined, WRITE);
    expect(copy.supportedFamilies).toEqual([]);
    expect(copy.control).toBeDefined();
    expect(copy.elements).toHaveLength(0);
    expect(supportedFamilies(copy)).toEqual([]);
  });

  // The source keeps its control. The copy is a plain shape, because one
  // document draws one thing.
  it("turns a control-only document into a plain shape when one is asked for", () => {
    const control = newControlConfig("Doorbell", 3);
    const copy = duplicateAs(control, "circular", WRITE);
    expect(copy.supportedFamilies).toEqual(["circular"]);
    expect(copy.control).toBeUndefined();
    expect(copy.perFamily.circular).toBeDefined();
    expect(control.control).toBeDefined();
  });

  it("stamps the schema the document it ends up as needs", () => {
    const circular = duplicateAs(kitchen(), "circular", WRITE);
    expect(circular.schemaVersion).toBe(schemaVersionFor(circular));
    const tile = duplicateAs(kitchen(), "medium", WRITE);
    expect(tile.schemaVersion).toBe(schemaVersionFor(tile));
    // A plain one-shape document: the Home Screen tiles are what push it past
    // the shape rules of schema 6.
    const plain = newConfig("Porch", 0, "rectangular");
    expect(duplicateAs(plain, "circular", WRITE).schemaVersion).toBe(6);
    expect(duplicateAs(plain, "medium", WRITE).schemaVersion).toBe(7);
  });
});

describe("slotForDuplicate", () => {
  const held = [{ slotIndex: 5, families: ["rectangular" as FamilyKind] }];

  // The whole point of the rule: "Kitchen" rectangular and the circular copy
  // made from it both sit at seat 5, so a face that places both keeps one name
  // in one position group.
  it("gives a copy of another shape the source's own seat", () => {
    expect(slotForDuplicate("circular", held, [], 5)).toBe(5);
  });

  it("falls to the lowest free seat when that shape is already there", () => {
    expect(slotForDuplicate("rectangular", held, [], 5)).toBe(0);
  });

  it("falls to the lowest free seat when nothing is preferred", () => {
    expect(slotForDuplicate("circular", [{ slotIndex: 0, families: ["circular"] }])).toBe(1);
    expect(slotForDuplicate("circular", [{ slotIndex: 0, families: ["circular"] }], [], undefined))
      .toBe(freeSlotForFamily("circular", [{ slotIndex: 0, families: ["circular"] }]));
  });

  it("never takes a seat something unreadable holds", () => {
    expect(slotForDuplicate("circular", [], [{ slot: 5 }], 5)).toBe(0);
  });

  it("ignores a preferred seat that is no seat at all", () => {
    expect(slotForDuplicate("circular", held, [], -1)).toBe(0);
    expect(slotForDuplicate("circular", held, [], MAX_SLOTS)).toBe(0);
  });

  it("says -1 when the device is full", () => {
    const full = Array.from({ length: MAX_SLOTS }, (_, i) => ({ slotIndex: i, families: [] as FamilyKind[] }));
    expect(slotForDuplicate("rectangular", full, [], 3)).toBe(-1);
  });
});

describe("duplicateTargets", () => {
  const all = [WATCH, WATCH2, PHONE, OLD_PHONE, LIBRARY];

  it("offers the devices that draw this shape, and never the one it is on", () => {
    expect(duplicateTargets(all, "rectangular", "w1").map((o) => o.ownerId))
      .toEqual(["w2", "p1", "p2", LIBRARY_OWNER_ID]);
  });

  it("leaves out a device whose app does not draw the shape", () => {
    // Corner is a watch face slot; the Home Screen tiles need the newer phone.
    expect(duplicateTargets(all, "corner", "w1").map((o) => o.ownerId)).toEqual(["w2", LIBRARY_OWNER_ID]);
    expect(duplicateTargets(all, "medium", "w1").map((o) => o.ownerId)).toEqual(["p1", LIBRARY_OWNER_ID]);
  });

  it("offers a control to the devices that have Control Center", () => {
    const plain = owner({ ownerId: "w3", label: "Old Watch", controls: false });
    expect(duplicateTargets([WATCH2, plain, LIBRARY], undefined, "w1").map((o) => o.ownerId))
      .toEqual(["w2", LIBRARY_OWNER_ID]);
  });

  it("always offers the library, and never offers it to itself", () => {
    expect(duplicateTargets(all, "corner", LIBRARY_OWNER_ID).map((o) => o.ownerId)).toEqual(["w1", "w2"]);
  });

  // What the picker card's menu asks for: the home's other watches, and the
  // shelf. Crossing to a phone is "Duplicate as", where a shape is picked.
  it("narrows to one kind of device when asked, the library aside", () => {
    expect(duplicateTargets(all, "rectangular", "w1", "watch").map((o) => o.ownerId))
      .toEqual(["w2", LIBRARY_OWNER_ID]);
    expect(duplicateTargets(all, "rectangular", "p1", "iphone").map((o) => o.ownerId))
      .toEqual(["p2", LIBRARY_OWNER_ID]);
  });

  // A design on the shelf is on no kind of device, so every device that draws
  // its shape is a place it could go.
  it("narrows nothing for a design in the library", () => {
    expect(duplicateTargets(all, "rectangular", LIBRARY_OWNER_ID, "library").map((o) => o.ownerId))
      .toEqual(["w1", "w2", "p1", "p2"]);
  });
});

// The card's "Devices" menu: a box per device, ticked where the design's
// linked copies are.
describe("devicePlaces", () => {
  const all = [WATCH, WATCH2, PHONE, OLD_PHONE, LIBRARY];
  const kindOf = (id: string) => all.find((o) => o.ownerId === id)?.kind;
  const copies: PlaceCopy[] = [{ ownerId: "w1", id: "a" }, { ownerId: "w2", id: "c" }];

  it("lists the design's kind of device and the library, ticked where a copy is", () => {
    const places = devicePlaces(all, "rectangular", copies, "watch");
    expect(places.map((p) => [p.owner.ownerId, p.on])).toEqual([
      ["w1", true],
      ["w2", true],
      [LIBRARY_OWNER_ID, false],
    ]);
  });

  // A watch whose app is too old still shows, greyed: the household sees
  // every device it has rather than wondering where one went.
  it("lists a device of the kind that cannot draw the shape, marked as not drawing it", () => {
    const old = owner({ ownerId: "w3", label: "Chen's Watch", families: [], controls: false });
    const places = devicePlaces([WATCH, old, LIBRARY], "rectangular", copies, "watch");
    expect(places.map((p) => [p.owner.ownerId, p.draws])).toEqual([
      ["w1", true],
      ["w3", false],
      [LIBRARY_OWNER_ID, true],
    ]);
  });

  it("marks the device holding the design's last copy", () => {
    const places = devicePlaces(all, "rectangular", [{ ownerId: "w2", id: "c" }], "watch");
    expect(places.map((p) => [p.owner.ownerId, p.on, p.last])).toEqual([
      ["w1", false, false],
      ["w2", true, true],
      [LIBRARY_OWNER_ID, false, false],
    ]);
  });

  it("offers every kind to a design on the shelf alone", () => {
    const shelved: PlaceCopy[] = [{ ownerId: LIBRARY_OWNER_ID, id: "z" }];
    const places = devicePlaces(all, "rectangular", shelved, designKind(shelved, kindOf));
    expect(places.map((p) => [p.owner.ownerId, p.on])).toEqual([
      ["w1", false],
      ["w2", false],
      ["p1", false],
      ["p2", false],
      [LIBRARY_OWNER_ID, true],
    ]);
  });

  it("reads a design's kind off its first device, the shelf aside", () => {
    expect(designKind([{ ownerId: LIBRARY_OWNER_ID, id: "z" }, { ownerId: "p1", id: "e" }], kindOf)).toBe("iphone");
    expect(designKind([{ ownerId: "w1", id: "a" }], kindOf)).toBe("watch");
    expect(designKind([], kindOf)).toBe("library");
  });

  it("offers a control to the devices with Control Center", () => {
    const plain = owner({ ownerId: "w3", label: "Old Watch", controls: false });
    const places = devicePlaces([WATCH, plain, LIBRARY], undefined, [{ ownerId: "w1", id: "k" }], "watch");
    expect(places.map((p) => [p.owner.ownerId, p.draws])).toEqual([["w1", true], ["w3", false], [LIBRARY_OWNER_ID, true]]);
  });
});

// One design on several devices: the copies share a link and are kept alike.
describe("linkedCopy and linkedDocumentFor", () => {
  const LINK = "8B1C2D3E-0000-4000-8000-000000000001";

  it("writes the same design under a new id and seat, carrying the link", () => {
    const src = kitchen();
    const copy = linkedCopy(src, LINK, { id: "NEW", slotIndex: 2 });
    expect(copy.id).toBe("NEW");
    expect(copy.slotIndex).toBe(2);
    expect(copy.linkId).toBe(LINK);
    expect(copy.hidden).toBeUndefined();
    expect(copy.supportedFamilies).toEqual(src.supportedFamilies);
    expect(copy.elements).toEqual(src.elements);
    expect(src.linkId).toBeUndefined();
  });

  it("dresses a save in the sibling's own id, seat and hidden flag", () => {
    const saved = kitchen();
    saved.linkId = LINK;
    saved.name = "Kitchen 2";
    const doc = linkedDocumentFor(saved, { id: "SIB", slotIndex: 7, hidden: true });
    expect(doc.id).toBe("SIB");
    expect(doc.slotIndex).toBe(7);
    expect(doc.hidden).toBe(true);
    expect(doc.name).toBe("Kitchen 2");
    expect(doc.linkId).toBe(LINK);
    expect(linkedDocumentFor(saved, { id: "SIB", slotIndex: 7, hidden: false }).hidden).toBeUndefined();
  });

  it("never carries a link into a duplicate", () => {
    const src = kitchen();
    src.linkId = LINK;
    expect(duplicateAs(src, "rectangular", { id: "D", slotIndex: 1 }).linkId).toBeUndefined();
    expect(duplicateAs(src, "circular", { id: "D", slotIndex: 1 }).linkId).toBeUndefined();
  });
});

// An iPhone takes a watch-sized shape on its Lock Screen, and the list says so.
describe("placeLabel", () => {
  it("names the Lock Screen for an iPhone offered a shared shape", () => {
    expect(placeLabel({ kind: "iphone", label: "iPhone 15 Pro" }, "rectangular")).toBe("iPhone 15 Pro (Lock Screen)");
    expect(placeLabel({ kind: "iphone", label: "iPhone 15 Pro" }, "inline")).toBe("iPhone 15 Pro (Lock Screen)");
  });

  it("leaves watches, Home Screen tiles and controls alone", () => {
    expect(placeLabel({ kind: "watch", label: "Jesse Apple Watch" }, "rectangular")).toBe("Jesse Apple Watch");
    expect(placeLabel({ kind: "iphone", label: "iPhone 15 Pro" }, "small")).toBe("iPhone 15 Pro");
    expect(placeLabel({ kind: "iphone", label: "iPhone 15 Pro" }, undefined)).toBe("iPhone 15 Pro");
  });
});

describe("lockScreenTitle", () => {
  it("names the Lock Screen beside an iPhone's watch-sized shapes only", () => {
    expect(lockScreenTitle("rectangular", true)).toBe("Rectangular (Lock Screen)");
    expect(lockScreenTitle("circular", true)).toBe("Circular (Lock Screen)");
    expect(lockScreenTitle("inline", true)).toBe("Inline (Lock Screen)");
    expect(lockScreenTitle("rectangular", false)).toBe("Rectangular");
    expect(lockScreenTitle("small", true)).not.toContain("Lock Screen");
  });
});
