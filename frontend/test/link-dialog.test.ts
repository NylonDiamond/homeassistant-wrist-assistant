// The New dialog across devices: which cards it draws for a set of ticked
// devices, how a shared shape's two sides tick, and what the footer and the
// line under the shapes say.

import { describe, expect, it } from "vitest";

import type { FamilyKind } from "../src/model.js";
import {
  type LinkOwner,
  type LinkPicks,
  SHARED_SIDE_NOTE,
  controlOwners,
  keepPicks,
  linkPlaceCards,
  pickedFamilies,
  pickedWords,
  setPick,
  sideTitle,
  startFromCopyLine,
} from "../src/linking.js";
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
  label: "Jesse's iPhone",
  kind: "iphone",
  families: familiesFor({ device_kind: "iphone", app_version: "2.8.0" }),
  comingSoon: ["xlarge"],
  controls: true,
  appVersion: "2.8.0",
};

const WATCH_2: LinkOwner = { ...WATCH, ownerId: "w2", label: "Work Watch" };
const PHONE_2: LinkOwner = { ...PHONE, ownerId: "p2", label: "Work iPhone" };

const ticked = (...ids: string[]) => new Set(ids);

const picks = (rows: Record<string, FamilyKind[]>): LinkPicks =>
  new Map(Object.entries(rows).map(([ownerId, families]) => [ownerId, new Set(families)]));

describe("linkPlaceCards", () => {
  // A household with one watch is being asked a question with one answer, and
  // must see exactly the dialog it saw before any of this existed.
  it("gives a watch alone one card holding its four shapes, widest first", () => {
    const cards = linkPlaceCards([WATCH], ticked("w1"));
    expect(cards).toHaveLength(1);
    expect(cards[0]!.key).toBe("watch");
    expect(cards[0]!.label).toBe("Watch face");
    expect(cards[0]!.shared).toBe(false);
    expect(cards[0]!.rows.map((r) => r.family)).toEqual(["rectangular", "circular", "corner", "inline"]);
    expect(cards[0]!.rows.every((r) => r.sides.length === 1)).toBe(true);
  });

  it("gives a phone alone the Home Screen first, then the Lock Screen", () => {
    const cards = linkPlaceCards([PHONE], ticked("p1"));
    expect(cards.map((c) => [c.key, c.label])).toEqual([["home", "Home Screen"], ["lock", "Lock Screen"]]);
    expect(cards[0]!.rows.map((r) => r.family)).toEqual(["large", "medium", "small"]);
    expect(cards[0]!.comingSoon.map((r) => r.family)).toEqual(["xlarge"]);
    expect(cards[1]!.rows.map((r) => r.family)).toEqual(["rectangular", "circular", "inline"]);
  });

  // The whole point: one design on both devices is shown once, not twice.
  it("folds the watch face and the Lock Screen into one card when both are ticked", () => {
    const cards = linkPlaceCards([WATCH, PHONE], ticked("w1", "p1"));
    expect(cards.map((c) => c.key)).toEqual(["home", "shared"]);
    expect(cards[0]!.label).toBe("iPhone Home Screen");
    const shared = cards[1]!;
    expect(shared.label).toBe("Watch and Lock Screen");
    expect(shared.shared).toBe(true);
    expect(shared.rows.map((r) => r.family)).toEqual(["rectangular", "circular", "corner", "inline"]);
  });

  it("gives a shared shape one side per device and corner only the watch's", () => {
    const shared = linkPlaceCards([WATCH, PHONE], ticked("w1", "p1"))[1]!;
    const row = (family: FamilyKind) => shared.rows.find((r) => r.family === family)!;
    expect(row("rectangular").sides.map((s) => [s.ownerId, s.label])).toEqual([["w1", "Watch"], ["p1", "Lock Screen"]]);
    expect(row("corner").sides.map((s) => s.ownerId)).toEqual(["w1"]);
  });

  // A link joins any set of devices, not one watch plus one phone.
  it("carries a side per device with two watches and two phones", () => {
    const cards = linkPlaceCards([WATCH, WATCH_2, PHONE, PHONE_2], ticked("w1", "w2", "p1", "p2"));
    const shared = cards.find((c) => c.key === "shared")!;
    const circular = shared.rows.find((r) => r.family === "circular")!;
    expect(circular.sides.map((s) => s.ownerId)).toEqual(["w1", "w2", "p1", "p2"]);
    const home = cards.find((c) => c.key === "home")!;
    expect(home.rows.find((r) => r.family === "medium")!.sides.map((s) => s.ownerId)).toEqual(["p1", "p2"]);
  });

  it("holds the Home Screen back from a phone too old for it", () => {
    const old: LinkOwner = { ...PHONE, appVersion: "2.7.0", families: familiesFor({ device_kind: "iphone", app_version: "2.7.0" }), comingSoon: [] };
    expect(linkPlaceCards([old], ticked("p1")).map((c) => c.key)).toEqual(["lock"]);
  });

  it("draws nothing for a device that is not ticked", () => {
    expect(linkPlaceCards([WATCH, PHONE], ticked("p1")).map((c) => c.key)).toEqual(["home", "lock"]);
    expect(linkPlaceCards([WATCH, PHONE], ticked())).toEqual([]);
  });
});

describe("side labels", () => {
  it("calls a watch's side Watch and every other place by its own name", () => {
    expect(sideTitle("watch")).toBe("Watch");
    expect(sideTitle("lock")).toBe("Lock Screen");
    expect(sideTitle("home")).toBe("Home Screen");
  });

  it("says once, on the card, that unticking one side drops it from that copy", () => {
    expect(SHARED_SIDE_NOTE).toContain("Lock Screen side");
    expect(SHARED_SIDE_NOTE).toContain("iPhone copy only");
  });
});

describe("the picks", () => {
  it("ticks a shared shape on both devices and unticks one side alone", () => {
    let p: LinkPicks = new Map();
    p = setPick(p, "circular", ["w1", "p1"], true);
    expect([...pickedFamilies(p)]).toEqual(["circular"]);
    p = setPick(p, "circular", ["p1"], false);
    expect(p.get("w1")!.has("circular")).toBe(true);
    expect(p.get("p1")!.has("circular")).toBe(false);
    // The shape is still on the complication: the phone copy simply goes
    // without it.
    expect([...pickedFamilies(p)]).toEqual(["circular"]);
  });

  it("leaves the map it was given alone", () => {
    const before = picks({ w1: ["rectangular"] });
    setPick(before, "circular", ["w1"], true);
    expect([...before.get("w1")!]).toEqual(["rectangular"]);
  });

  it("drops the picks of a device that was unticked", () => {
    const kept = keepPicks(picks({ w1: ["rectangular"], p1: ["small"] }), ticked("w1"));
    expect([...kept.keys()]).toEqual(["w1"]);
  });
});

describe("the footer count", () => {
  it("counts a shape once however many devices draw it", () => {
    const p = picks({ w1: ["rectangular", "circular"], p1: ["rectangular", "circular"] });
    expect(pickedWords(p, false, [WATCH, PHONE], ticked("w1", "p1")))
      .toBe("2 picked, on Jesse's Watch and Jesse's iPhone.");
  });

  it("counts the control beside the shapes and names one device by saying nothing", () => {
    expect(pickedWords(picks({ w1: ["rectangular"] }), true, [WATCH], ticked("w1"))).toBe("2 picked.");
  });

  it("is silent with nothing picked", () => {
    expect(pickedWords(new Map(), false, [WATCH], ticked("w1"))).toBe("");
  });
});

describe("the line under the shapes", () => {
  // "Nothing copies across on its own" stopped being true the moment a Home
  // Screen size started from the watch design.
  it("promises the copy when a Home Screen size is ticked", () => {
    expect(startFromCopyLine(picks({ p1: ["small"] }))).toBe("Home Screen sizes start from your watch design.");
  });

  it("says nothing at all when no size is ticked", () => {
    expect(startFromCopyLine(picks({ w1: ["rectangular", "circular", "corner", "inline"] }))).toBeUndefined();
    expect(startFromCopyLine(new Map())).toBeUndefined();
  });
});

describe("controlOwners", () => {
  it("names the ticked devices whose app draws a control", () => {
    const old: LinkOwner = { ...PHONE, controls: false };
    expect(controlOwners([WATCH, old], ticked("w1", "p1")).map((o) => o.ownerId)).toEqual(["w1"]);
  });
});
