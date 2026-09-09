// The device list in the header. Watches and iPhones both own records now, so
// a row has to say which it is, and the list has to stay in two groups.

import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import { ownerLabel, ownersByKind } from "../src/panel.js";

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

describe("ownerLabel", () => {
  it("keeps the paired phone as a watch's disambiguator", () => {
    expect(ownerLabel(owner({ paired_iphone_name: "Jesse's iPhone" }))).toBe("Apple Watch (Jesse's iPhone)");
    expect(ownerLabel(owner({ device_kind: "watch" }))).toBe("Apple Watch");
  });

  it("falls back to the owner id when the device never reported a name", () => {
    expect(ownerLabel(owner({ device_name: null }))).toBe("w1");
  });

  it("badges a phone so a mixed list says which row is which", () => {
    expect(ownerLabel(owner({ device_kind: "iphone", device_name: "Kitchen display" }))).toBe("Kitchen display (iPhone)");
  });

  // A phone is almost always called something ending in "iPhone", and a badge
  // there would only say it twice.
  it("leaves a name that already reads as an iPhone alone", () => {
    expect(ownerLabel(owner({ device_kind: "iphone", device_name: "Jesse's iPhone" }))).toBe("Jesse's iPhone");
  });

  it("never badges a watch, whatever it is called", () => {
    expect(ownerLabel(owner({ device_name: "iPhone-ish watch" }))).toBe("iPhone-ish watch");
  });
});

describe("ownersByKind", () => {
  it("puts watches first and phones after, each group in the order given", () => {
    const rows = [
      owner({ owner_watch_id: "p1", device_kind: "iphone" }),
      owner({ owner_watch_id: "w1" }),
      owner({ owner_watch_id: "p2", device_kind: "iphone" }),
      owner({ owner_watch_id: "w2", device_kind: "watch" }),
      owner({ owner_watch_id: "orphan", device_kind: null, is_orphan: true }),
    ];
    expect(ownersByKind(rows).map((o) => o.owner_watch_id)).toEqual(["w1", "w2", "orphan", "p1", "p2"]);
  });

  it("leaves a list of watches exactly as it found it", () => {
    const rows = [owner({ owner_watch_id: "b" }), owner({ owner_watch_id: "a" })];
    expect(ownersByKind(rows).map((o) => o.owner_watch_id)).toEqual(["b", "a"]);
  });
});
