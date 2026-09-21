// The New complication dialog's four questions, as pure answers: which
// devices this home is offered, which shapes each kind has, what the footer
// says, and what Create is about to write.

import { describe, expect, it } from "vitest";

import { type DeviceOwner, freeSlotForFamily, libraryComingSoon, libraryFamilies } from "../src/copies.js";
import { XLARGE_OFFERED, familiesFor } from "../src/layouts.js";
import type { FamilyKind } from "../src/model.js";
import {
  type NewChoice,
  kindChoices,
  kindOwners,
  kindTitle,
  newReady,
  newRecords,
  newSummary,
  shapeGroups,
  shapeOffered,
} from "../src/newComplication.js";
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
/** A phone too old for the Home Screen tiles. */
const OLD_PHONE = owner({
  ownerId: "p2",
  label: "Chen's iPhone",
  kind: "iphone",
  appVersion: "2.7.0",
  families: familiesFor({ device_kind: "iphone", app_version: "2.7.0" }),
  comingSoon: [],
  controls: false,
});

const HOME_SHAPES = XLARGE_OFFERED
  ? ["small", "medium", "large", "xlarge"]
  : ["small", "medium", "large"];

describe("kindChoices", () => {
  it("offers only the kinds this home has", () => {
    expect(kindChoices([WATCH])).toEqual(["watch", "control"]);
    expect(kindChoices([WATCH, PHONE])).toEqual(["watch", "iphone", "control"]);
  });

  it("leaves out Control Center when no device draws one", () => {
    expect(kindChoices([OLD_PHONE])).toEqual(["iphone"]);
  });

  // A design made here goes to the library and waits for a device, so the
  // question is still worth asking.
  it("offers both devices in a home with none the panel can write to", () => {
    expect(kindChoices([])).toEqual(["watch", "iphone"]);
  });
});

describe("kindOwners", () => {
  it("is the devices of that kind", () => {
    expect(kindOwners([WATCH, WATCH2, PHONE], "watch").map((o) => o.ownerId)).toEqual(["w1", "w2"]);
    expect(kindOwners([WATCH, PHONE], "iphone").map((o) => o.ownerId)).toEqual(["p1"]);
  });

  it("is every device with a control, for Control Center", () => {
    expect(kindOwners([WATCH, PHONE, OLD_PHONE], "control").map((o) => o.ownerId)).toEqual(["w1", "p1"]);
  });
});

describe("shapeGroups", () => {
  it("gives a watch one group of its four shapes", () => {
    const groups = shapeGroups("watch", [WATCH]);
    expect(groups.map((g) => g.key)).toEqual(["watch"]);
    expect(groups[0]!.families).toEqual(["rectangular", "circular", "corner", "inline"]);
  });

  it("splits an iPhone into its Lock Screen and its Home Screen", () => {
    const groups = shapeGroups("iphone", [PHONE]);
    expect(groups.map((g) => g.key)).toEqual(["lock", "home"]);
    expect(groups[0]!.families).toEqual(["rectangular", "circular", "inline"]);
    expect(groups[1]!.families).toEqual(HOME_SHAPES);
  });

  it("never offers corner on an iPhone", () => {
    expect(shapeGroups("iphone", [PHONE]).flatMap((g) => g.families)).not.toContain("corner");
  });

  it("holds the Home Screen back from a home whose only phone is too old", () => {
    expect(shapeGroups("iphone", [OLD_PHONE]).map((g) => g.key)).toEqual(["lock"]);
  });

  it("has no shapes at all for Control Center", () => {
    expect(shapeGroups("control", [WATCH, PHONE])).toEqual([]);
  });

  // The design is going to the library, and a shape missing from the shelf is
  // a shape lost rather than one a device happens not to draw.
  it("offers what such a device would draw when the home has none", () => {
    expect(shapeGroups("watch", [PHONE])[0]!.families)
      .toEqual(["rectangular", "circular", "corner", "inline"]);
  });
});

describe("shapeOffered", () => {
  it("is true only for a shape the picked kind has", () => {
    expect(shapeOffered("watch", [WATCH, PHONE], "corner")).toBe(true);
    expect(shapeOffered("iphone", [WATCH, PHONE], "corner")).toBe(false);
    expect(shapeOffered("control", [WATCH], "rectangular")).toBe(false);
    expect(shapeOffered("watch", [WATCH], undefined)).toBe(false);
  });
});

describe("the footer line", () => {
  const choice = (over: Partial<NewChoice> = {}): NewChoice => ({ named: true, devices: 1, ...over });

  it("asks for each step in turn", () => {
    expect(newSummary(choice({ named: false }))).toBe("Type a name to start.");
    expect(newSummary(choice({ nameProblem: "Taken." }))).toBe("Taken.");
    expect(newSummary(choice())).toBe("Now pick a watch, an iPhone or Control Center.");
    expect(newSummary(choice({ kind: "watch" }))).toBe("Now pick one shape.");
  });

  it("says what Create is about to make", () => {
    expect(newSummary(choice({ kind: "watch", family: "circular" }))).toBe("Circular on a watch, on 1 device");
    expect(newSummary(choice({ kind: "iphone", family: "medium", devices: 2 })))
      .toBe("Medium on an iPhone, on 2 devices");
    expect(newSummary(choice({ kind: "control" }))).toBe("A Control Center control, on 1 device");
  });

  it("says where a design with no device ticked goes", () => {
    expect(newSummary(choice({ kind: "watch", family: "rectangular", devices: 0 })))
      .toBe("Rectangular on a watch, in the library. Tick a device any time.");
  });

  it("enables Create once the shape is picked, whatever step 4 says", () => {
    expect(newReady(choice({ kind: "watch", family: "rectangular", devices: 0 }))).toBe(true);
    expect(newReady(choice({ kind: "control", devices: 0 }))).toBe(true);
    expect(newReady(choice({ kind: "watch" }))).toBe(false);
    expect(newReady(choice({ named: false, kind: "watch", family: "rectangular" }))).toBe(false);
    expect(newReady(choice({ kind: "watch", family: "rectangular", nameProblem: "Taken." }))).toBe(false);
  });
});

describe("newRecords", () => {
  /** Two seats taken on the watch by rectangular designs, none on the phone. */
  const held: Record<string, { slotIndex: number; families: FamilyKind[] }[]> = {
    w1: [{ slotIndex: 0, families: ["rectangular"] }, { slotIndex: 1, families: ["rectangular"] }],
    w2: [],
    p1: [],
  };
  const freeSlot = (ownerId: string, family: FamilyKind | undefined) =>
    freeSlotForFamily(family, held[ownerId] ?? []);

  it("writes one record per ticked device", () => {
    const plan = newRecords([WATCH, WATCH2], "rectangular", freeSlot);
    expect(plan.map((r) => r.ownerId)).toEqual(["w1", "w2"]);
    expect(plan.map((r) => r.label)).toEqual(["Jesse's Watch", "Chen's Watch"]);
  });

  it("gives each record the lowest seat free for that shape on its own device", () => {
    const plan = newRecords([WATCH, WATCH2], "rectangular", freeSlot);
    expect(plan.map((r) => r.slotIndex)).toEqual([2, 0]);
  });

  // A slot holds one document per shape, so a circular design sits beside the
  // rectangular one already in seat 0.
  it("shares a seat with a document of another shape", () => {
    expect(newRecords([WATCH], "circular", freeSlot)[0]!.slotIndex).toBe(0);
  });

  it("names a device with no seat left rather than skipping it", () => {
    const full = () => -1;
    expect(newRecords([WATCH], "rectangular", full)[0]!.slotIndex).toBe(-1);
  });

  it("makes nothing at all when no device is ticked", () => {
    expect(newRecords([], "rectangular", freeSlot)).toEqual([]);
  });

  // Nothing ticked means the library, which the panel passes in as the one
  // target rather than as an empty list.
  it("writes the library's record the same way", () => {
    const shelf = owner({
      ownerId: LIBRARY_OWNER_ID,
      label: "Library",
      kind: "library",
      appVersion: null,
      families: libraryFamilies(),
      comingSoon: libraryComingSoon(),
    });
    expect(newRecords([shelf], "corner", freeSlot)).toEqual([
      { ownerId: LIBRARY_OWNER_ID, label: "Library", slotIndex: 0 },
    ]);
  });
});

describe("kindTitle", () => {
  it("names the three choices", () => {
    expect([kindTitle("watch"), kindTitle("iphone"), kindTitle("control")])
      .toEqual(["Watch", "iPhone", "Control Center"]);
  });
});
