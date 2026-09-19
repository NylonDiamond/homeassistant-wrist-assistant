// Add a shape: the New dialog's grid of places, over what is left to add.
//
// The panel used to offer the places of the one device the editor was sitting
// on, so a watch complication reached the phone only through the Devices
// dialog. These are the cards the popover draws instead: every place of every
// device, holding what that device's own copy does not draw yet.

import { describe, expect, it } from "vitest";

import type { FamilyKind } from "../src/model.js";
import { type LinkOwner, addShapeCards, joiningOwners } from "../src/linking.js";
import { familiesFor } from "../src/layouts.js";

const WATCH: LinkOwner = {
  ownerId: "w1",
  label: "Jesse's Watch",
  kind: "watch",
  families: familiesFor({ device_kind: "watch", app_version: "2.8.0" }),
  comingSoon: [],
  controls: true,
  appVersion: "2.8.0",
};

const PHONE: LinkOwner = {
  ownerId: "p1",
  label: "iPhone 15 Pro",
  kind: "iphone",
  families: familiesFor({ device_kind: "iphone", app_version: "2.8.0" }),
  comingSoon: ["xlarge"],
  controls: true,
  appVersion: "2.8.0",
};

const WATCH_2: LinkOwner = { ...WATCH, ownerId: "w2", label: "Work Watch" };

const ALL_WATCH: FamilyKind[] = ["rectangular", "circular", "corner", "inline"];

const cards = (owners: readonly LinkOwner[], on: readonly string[], have: readonly FamilyKind[]) =>
  addShapeCards(owners, new Set(on), have);

const shapes = (owners: readonly LinkOwner[], on: readonly string[], have: readonly FamilyKind[], key: string) =>
  cards(owners, on, have).find((c) => c.key === key)?.rows.map((r) => r.family);

describe("the places Add a shape offers", () => {
  // The bug this was built for: the complication is on the watch, the house has
  // a phone, and the phone's places were nowhere in the panel.
  it("lists every place of every device, not only the one being edited", () => {
    const out = cards([WATCH, PHONE], ["w1"], ["rectangular"]);
    expect(out.map((c) => [c.key, c.label, c.devices.join()])).toEqual([
      ["watch:w1", "Watch face", "Jesse's Watch"],
      ["lock:p1", "Lock Screen", "iPhone 15 Pro"],
      ["home:p1", "Home Screen", "iPhone 15 Pro"],
    ]);
  });

  // A device it is already on has its copy: only what the document lacks is
  // still to add there.
  it("offers a device it is on the shapes the document does not have", () => {
    expect(shapes([WATCH, PHONE], ["w1"], ["rectangular"], "watch:w1")).toEqual(["circular", "corner", "inline"]);
    expect(shapes([WATCH, PHONE], ["w1"], ALL_WATCH, "watch:w1")).toBeUndefined();
  });

  // A device it is not on draws none of them yet, so a shape the document
  // already has is still something to put there: that click is what joins the
  // device, and the copy then arrives with everything it can draw.
  it("offers a device it is not on every shape that device draws", () => {
    expect(shapes([WATCH, PHONE], ["w1"], ALL_WATCH, "lock:p1")).toEqual(["rectangular", "circular", "inline"]);
    expect(shapes([WATCH, PHONE], ["w1"], ALL_WATCH, "home:p1")).toEqual(["large", "medium", "small"]);
  });

  it("never offers corner on a phone", () => {
    for (const on of [["w1"], ["w1", "p1"]]) {
      for (const card of cards([WATCH, PHONE], on, [])) {
        if (card.places.includes("home") || card.label === "Lock Screen") {
          expect(card.rows.map((r) => r.family)).not.toContain("corner");
        }
      }
    }
    const shared = cards([WATCH, PHONE], ["w1", "p1"], []).find((c) => c.key === "shared")!;
    expect(shared.rows.find((r) => r.family === "corner")!.sides.map((s) => s.ownerId)).toEqual(["w1"]);
  });

  it("drops a place with nothing left to add rather than drawing it dead", () => {
    const out = cards([WATCH, PHONE], ["w1", "p1"], [...ALL_WATCH, "small", "medium", "large"]);
    expect(out.map((c) => c.key)).toEqual(["home:p1"]);
    // What is left there is the shape that is named but not pickable yet.
    expect(out[0]!.rows).toEqual([]);
    expect(out[0]!.comingSoon.map((r) => r.family)).toEqual(["xlarge"]);
  });

  it("has nothing at all to say about a complication already on every place", () => {
    expect(cards([WATCH], ["w1"], ALL_WATCH)).toEqual([]);
  });

  it("holds the Home Screen back from a phone too old for it", () => {
    const old: LinkOwner = {
      ...PHONE,
      appVersion: "2.7.0",
      families: familiesFor({ device_kind: "iphone", app_version: "2.7.0" }),
      comingSoon: [],
    };
    expect(cards([WATCH, old], ["w1"], []).map((c) => c.key)).toEqual(["watch:w1", "lock:p1"]);
  });
});

describe("the watch face and the Lock Screen", () => {
  // One design on both, so one row with a side each, exactly as the New dialog
  // folds them once both are ticked.
  it("folds into one card once the complication is on both devices", () => {
    const out = cards([WATCH, PHONE], ["w1", "p1"], ["rectangular"]);
    expect(out.map((c) => c.key)).toEqual(["shared", "home:p1"]);
    const shared = out[0]!;
    expect(shared.label).toBe("Watch face and Lock Screen");
    expect(shared.devices).toEqual(["Jesse's Watch", "iPhone 15 Pro"]);
    expect(shared.shared).toBe(true);
    expect(shared.rows.map((r) => r.family)).toEqual(["circular", "corner", "inline"]);
    expect(shared.rows[0]!.sides.map((s) => [s.ownerId, s.label])).toEqual([["w1", "Watch"], ["p1", "Lock Screen"]]);
  });

  // Until then the phone's card is its own thing, so picking a shape in it
  // says which device it is about.
  it("stays apart while the complication is on the watch alone", () => {
    expect(cards([WATCH, PHONE], ["w1"], ["rectangular"]).map((c) => c.key))
      .toEqual(["watch:w1", "lock:p1", "home:p1"]);
  });

  it("folds only the devices it is on and leaves the spare ones their own card", () => {
    const out = cards([WATCH, WATCH_2, PHONE], ["w1", "p1"], ["rectangular"]);
    expect(out.map((c) => c.key)).toEqual(["shared", "watch:w2", "home:p1"]);
    expect(out[0]!.ownerIds).toEqual(["w1", "p1"]);
    expect(out[1]!.rows.map((r) => r.family)).toEqual(ALL_WATCH);
  });
});

describe("a home with one device", () => {
  it("is today's panel with the device's name under the place", () => {
    const out = cards([WATCH], ["w1"], ["rectangular"]);
    expect(out).toHaveLength(1);
    expect([out[0]!.label, out[0]!.devices.join()]).toEqual(["Watch face", "Jesse's Watch"]);
    expect(out[0]!.rows.map((r) => r.family)).toEqual(["circular", "corner", "inline"]);
    expect(joiningOwners(out[0]!, new Set(["w1"]))).toEqual([]);
  });
});

describe("which devices a card would join", () => {
  it("names the ones the complication is not on yet and nobody else", () => {
    const out = cards([WATCH, PHONE], ["w1"], ["rectangular"]);
    const on = new Set(["w1"]);
    expect(joiningOwners(out.find((c) => c.key === "watch:w1")!, on)).toEqual([]);
    expect(joiningOwners(out.find((c) => c.key === "lock:p1")!, on)).toEqual(["p1"]);
    expect(joiningOwners(out.find((c) => c.key === "home:p1")!, on)).toEqual(["p1"]);
  });

  it("names nobody on a folded card, which is two devices it is already on", () => {
    const shared = cards([WATCH, PHONE], ["w1", "p1"], []).find((c) => c.key === "shared")!;
    expect(joiningOwners(shared, new Set(["w1", "p1"]))).toEqual([]);
  });
});
