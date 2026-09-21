// How the panel names its devices and what order it puts them in. The order is
// the one the picker's list sorts by and the link save writes in; the grouping
// is what a device list heads its sections with, and `ownerLines` is the
// two-line form of a device's name for a list that has room for both.

import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import { ownerGroups, ownerLines, ownersByKind } from "../src/panel.js";

const owner = (over: Partial<OwnerSummary> = {}): OwnerSummary => ({
  owner_watch_id: "w1",
  device_name: "Apple Watch",
  paired_iphone_name: null,
  app_version: "2.8.0",
  screen_size: null,
  complication_count: 0,
  token: 1,
  is_orphan: false,
  ...over,
});

describe("ownerLines", () => {
  it("puts the paired phone under a watch's own name", () => {
    expect(ownerLines(owner({ paired_iphone_name: "Jesse's iPhone" })))
      .toEqual({ name: "Apple Watch", note: "paired with Jesse's iPhone" });
  });

  it("leaves a watch with nothing to disambiguate a single line", () => {
    expect(ownerLines(owner())).toEqual({ name: "Apple Watch", note: undefined });
  });

  it("falls back to the owner id when the device never reported a name", () => {
    expect(ownerLines(owner({ device_name: null })).name).toBe("w1");
  });

  it("marks a phone as one unless its name already says so", () => {
    expect(ownerLines(owner({ device_kind: "iphone", device_name: "Kitchen display" })).note).toBe("iPhone");
    expect(ownerLines(owner({ device_kind: "iphone", device_name: "Jesse's iPhone" })).note).toBeUndefined();
  });

  // Why the complications under it cannot be sent anywhere outranks which
  // phone it was once paired with.
  it("says an unregistered watch is unregistered, ahead of its pairing", () => {
    expect(ownerLines(owner({ is_orphan: true, paired_iphone_name: "Jesse's iPhone" })).note)
      .toBe("no longer registered");
  });
});

describe("ownerGroups", () => {
  it("heads the watches first and the phones after", () => {
    const groups = ownerGroups([
      owner({ owner_watch_id: "p1", device_kind: "iphone" }),
      owner({ owner_watch_id: "w1" }),
      owner({ owner_watch_id: "p2", device_kind: "iphone" }),
    ]);
    expect(groups.map((g) => g.label)).toEqual(["Watch", "iPhones"]);
    expect(groups.flatMap((g) => g.owners.map((o) => o.owner_watch_id))).toEqual(["w1", "p1", "p2"]);
  });

  // One group means the pane draws no heading at all, rather than a heading
  // over every row it has.
  it("gives a home with one kind of device a single group", () => {
    expect(ownerGroups([owner({ owner_watch_id: "w1" }), owner({ owner_watch_id: "w2" })]))
      .toHaveLength(1);
    expect(ownerGroups([owner({ owner_watch_id: "w1" })])[0]!.label).toBe("Watch");
  });

  it("has no group at all for a home with no devices", () => {
    expect(ownerGroups([])).toEqual([]);
  });

  // The library is not a device. Counted among the watches it would both be
  // misnamed and sort ahead of every phone in every list that reads this
  // order, the picker's and the link save's included.
  it("puts the library last and on its own", () => {
    const groups = ownerGroups([
      owner({ owner_watch_id: "library", device_kind: "library", device_name: "Library" }),
      owner({ owner_watch_id: "p1", device_kind: "iphone" }),
      owner({ owner_watch_id: "w1" }),
    ]);
    expect(groups.map((g) => g.label)).toEqual(["Watch", "iPhone", "Unassigned"]);
    expect(ownersByKind([
      owner({ owner_watch_id: "library", device_kind: "library", device_name: "Library" }),
      owner({ owner_watch_id: "w1" }),
    ]).map((o) => o.owner_watch_id)).toEqual(["w1", "library"]);
  });

  // The header's own order comes from these groups now, so the two can never
  // disagree about where a phone sits.
  it("agrees with the flat order the rest of the panel uses", () => {
    const rows = [
      owner({ owner_watch_id: "p1", device_kind: "iphone" }),
      owner({ owner_watch_id: "w1" }),
      owner({ owner_watch_id: "orphan", device_kind: null, is_orphan: true }),
    ];
    expect(ownersByKind(rows).map((o) => o.owner_watch_id))
      .toEqual(ownerGroups(rows).flatMap((g) => g.owners.map((o) => o.owner_watch_id)));
  });
});
