// Making a record on a device: which shapes a device's copy may carry, which
// seat a new one takes, and what the document looks like once it is somebody
// else's. The seed of "Duplicate as".

import { describe, expect, it } from "vitest";

import { type CustomComplicationConfig, type FamilyKind, MAX_SLOTS, legacyConfig, newConfig, newElement } from "../src/model.js";
import { addFamily, familiesFor } from "../src/layouts.js";
import {
  type DeviceOwner,
  copyForOwner,
  familiesKeptFor,
  freeSlotForFamily,
  joinNames,
  libraryComingSoon,
  libraryFamilies,
  newTargets,
  ownersDrawing,
  seatHoldersFor,
  slotForDuplicate,
} from "../src/copies.js";
import { type SplitOwnerLike, SPLIT_GATE, ownerCanSplit } from "../src/splitShapes.js";
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
const PHONE = owner({
  ownerId: "p1",
  label: "Jesse's iPhone",
  kind: "iphone",
  families: familiesFor({ device_kind: "iphone", app_version: "2.8.0" }),
});
const LIBRARY = owner({
  ownerId: LIBRARY_OWNER_ID,
  label: "Library",
  kind: "library",
  appVersion: null,
  families: libraryFamilies(),
  comingSoon: libraryComingSoon(),
});

/** A document an older panel wrote, with every shape on it. */
function everything(): CustomComplicationConfig {
  const cfg = legacyConfig("Kitchen", 0, ["rectangular", "circular", "corner", "inline"]);
  addFamily(cfg, "small");
  addFamily(cfg, "medium");
  return cfg;
}

/** Put a layer on one shape, which is what makes it that shape's layer. */
function place(cfg: CustomComplicationConfig, family: FamilyKind, id: string) {
  const el = cfg.elements.find((e) => e.payload.id === id)!;
  cfg.perFamily[family]!.placements[id] = { frame: { ...el.payload.frame }, isHidden: false };
}

describe("familiesKeptFor", () => {
  // Corner is a watch face slot: the phone widget has nothing to land it on.
  it("never lets a phone copy carry corner", () => {
    expect(familiesKeptFor(PHONE)).not.toContain("corner");
  });

  it("never lets a watch copy carry a Home Screen tile", () => {
    expect(familiesKeptFor(WATCH)).toEqual(["rectangular", "circular", "corner", "inline"]);
  });

  it("holds the Home Screen tiles back from a phone below the gate", () => {
    expect(familiesKeptFor({ kind: "iphone", appVersion: "2.7.0" }))
      .toEqual(["rectangular", "circular", "inline"]);
  });

  it("keeps everything on the shelf, which no app decodes", () => {
    expect(familiesKeptFor(LIBRARY)).toEqual(libraryFamilies());
  });
});

describe("newTargets", () => {
  it("is the ticked devices when any are ticked", () => {
    expect(newTargets(["w1", "p1"])).toEqual(["w1", "p1"]);
  });

  it("is the library when none is", () => {
    expect(newTargets([])).toEqual([LIBRARY_OWNER_ID]);
  });
});

describe("ownersDrawing", () => {
  it("is the devices whose app draws that shape", () => {
    expect(ownersDrawing([WATCH, PHONE], "corner").map((o) => o.ownerId)).toEqual(["w1"]);
    expect(ownersDrawing([WATCH, PHONE], "medium").map((o) => o.ownerId)).toEqual(["p1"]);
    expect(ownersDrawing([WATCH, PHONE], "rectangular").map((o) => o.ownerId)).toEqual(["w1", "p1"]);
  });
});

describe("joinNames", () => {
  it("reads as a sentence, however many names there are", () => {
    expect(joinNames([])).toBe("");
    expect(joinNames(["one"])).toBe("one");
    expect(joinNames(["one", "two"])).toBe("one and two");
    expect(joinNames(["one", "two", "three"])).toBe("one, two and three");
  });
});

describe("freeSlotForFamily", () => {
  it("takes the first seat nothing of that shape holds", () => {
    const held = [
      { slotIndex: 0, families: ["rectangular" as FamilyKind] },
      { slotIndex: 1, families: ["rectangular" as FamilyKind] },
    ];
    expect(freeSlotForFamily("rectangular", held)).toBe(2);
  });

  // The whole point of the rule: a face with "Kitchen" at seat 0 in its
  // rectangular and circular positions keeps drawing both.
  it("shares a seat with a document of another shape", () => {
    const held = [{ slotIndex: 0, families: ["rectangular" as FamilyKind] }];
    expect(freeSlotForFamily("circular", held)).toBe(0);
  });

  it("counts a document of several shapes against every one of them", () => {
    const held = [{ slotIndex: 0, families: ["rectangular", "circular"] as FamilyKind[] }];
    expect(freeSlotForFamily("rectangular", held)).toBe(1);
    expect(freeSlotForFamily("circular", held)).toBe(1);
    expect(freeSlotForFamily("corner", held)).toBe(0);
  });

  // An iPhone preset or another home's custom: the panel cannot read what
  // shape it draws, so it holds the whole seat.
  it("never shares a seat something unreadable holds", () => {
    expect(freeSlotForFamily("circular", [], [{ slot: 0 }])).toBe(1);
  });

  // A control has no shape to be told apart by, so it shares with nothing and
  // nothing shares with it.
  it("gives a document with no shape a seat of its own", () => {
    const held = [{ slotIndex: 0, families: ["rectangular" as FamilyKind] }];
    expect(freeSlotForFamily(undefined, held)).toBe(1);
    expect(freeSlotForFamily("rectangular", [{ slotIndex: 0, families: [] }])).toBe(1);
  });

  it("says -1 when every seat is taken", () => {
    const held = Array.from({ length: MAX_SLOTS }, (_, i) => ({ slotIndex: i, families: [] as FamilyKind[] }));
    expect(freeSlotForFamily("rectangular", held)).toBe(-1);
  });
});

// Seat sharing is a promise about the app on the device, not about the store:
// only an app that resolves a placed slot by shape can be given two documents
// in one seat. This is the panel's own composition, `seatHoldersFor` over
// `ownerCanSplit`, which is what `slotHoldersOn` does before either seat
// function ever sees a holder.
describe("seatHoldersFor", () => {
  /** One device as the gate reads it. */
  const device = (over: Partial<SplitOwnerLike> = {}): SplitOwnerLike => ({
    device_kind: "watch",
    app_version: SPLIT_GATE.version,
    app_build: String(SPLIT_GATE.build),
    ...over,
  });

  /** A rectangular "Kitchen" at seat 0, the seat a circular copy would want. */
  const held = [{ slotIndex: 0, families: ["rectangular" as FamilyKind] }];

  /** Where a circular document lands on a device in this state, both by the
   * lowest free seat and by asking for seat 0 outright. */
  function lands(owner: Parameters<typeof ownerCanSplit>[0]): [number, number] {
    const seats = seatHoldersFor(held, ownerCanSplit(owner));
    return [freeSlotForFamily("circular", seats), slotForDuplicate("circular", seats, [], 0)];
  }

  it("never shares a seat on an app below the gate", () => {
    // 2.8.0 build 10: the last build that resolves a placed slot with the
    // first document at it, whatever shape that document draws.
    expect(lands(device({ app_build: "10" }))).toEqual([1, 1]);
  });

  it("shares a seat on the first app that resolves by shape", () => {
    expect(lands(device())).toEqual([0, 0]);
  });

  it("shares a seat on the shelf, which no app resolves", () => {
    expect(lands(device({ device_kind: "library", app_version: null, app_build: null }))).toEqual([0, 0]);
  });

  it("never shares a seat on a device that reported no version", () => {
    // An orphan, or a device whose entry the panel has lost. Too old until it
    // says otherwise: a hidden setting costs less than a face drawing the
    // wrong design.
    expect(lands(device({ app_version: null, app_build: null }))).toEqual([1, 1]);
    expect(lands(undefined)).toEqual([1, 1]);
  });

  it("leaves the seat numbers alone whichever way it answers", () => {
    const many = [
      { slotIndex: 4, families: ["rectangular" as FamilyKind] },
      { slotIndex: 7, families: [] as FamilyKind[] },
    ];
    expect(seatHoldersFor(many, false).map((h) => h.slotIndex)).toEqual([4, 7]);
    expect(seatHoldersFor(many, false).every((h) => h.families.length === 0)).toBe(true);
    expect(seatHoldersFor(many, true)).toEqual(many);
  });
});

describe("copyForOwner", () => {
  it("strips the shapes this copy does not carry, layers and all", () => {
    const cfg = everything();
    const el = newElement("text");
    cfg.elements = [el];
    place(cfg, "corner", el.payload.id);
    const phone = copyForOwner(cfg, {
      id: "P",
      slotIndex: 3,
      hidden: false,
      families: familiesKeptFor(PHONE).filter((f) => cfg.supportedFamilies.includes(f)),
    });
    expect(phone.supportedFamilies).not.toContain("corner");
    expect(phone.perFamily.corner).toBeUndefined();
    expect(phone.elements).toHaveLength(0);
    // The document it was made from is untouched.
    expect(cfg.supportedFamilies).toContain("corner");
    expect(cfg.elements).toHaveLength(1);
  });

  it("wears this copy's identity", () => {
    const cfg = everything();
    cfg.hidden = true;
    const copy = copyForOwner(cfg, { id: "P", slotIndex: 3, hidden: false, families: cfg.supportedFamilies });
    expect(copy.id).toBe("P");
    expect(copy.slotIndex).toBe(3);
    expect(copy.hidden).toBeUndefined();
  });

  it("re-stamps the schema for the shapes it ends up with", () => {
    const cfg = everything();
    const watchOnly = copyForOwner(cfg, { id: "W", slotIndex: 0, hidden: false, families: ["rectangular", "circular", "corner", "inline"] });
    // Home Screen sizes are what forces schema 7; without them this is 6.
    expect(watchOnly.schemaVersion).toBe(6);
    expect(copyForOwner(cfg, { id: "P", slotIndex: 0, hidden: false, families: cfg.supportedFamilies }).schemaVersion).toBe(7);
  });

  it("copies a one-shape complication whole", () => {
    const cfg = newConfig("Porch", 1, "circular");
    const copy = copyForOwner(cfg, { id: "C", slotIndex: 6, hidden: true, families: ["circular"] });
    expect(copy.supportedFamilies).toEqual(["circular"]);
    expect(copy.hidden).toBe(true);
    expect(copy.name).toBe("Porch");
  });
});
