// The New dialog: one grid of places, each named with its device. Which cards
// it draws, how ticking one picks shapes and a device at once, when a watch
// face and a Lock Screen fold into one card, and what the footer says.

import { describe, expect, it } from "vitest";

import type { FamilyKind } from "../src/model.js";
import {
  type LinkOwner,
  type LinkPicks,
  SHARED_SIDE_NOTE,
  cardPicked,
  controlOwners,
  keepPicks,
  linkPlaceCards,
  pickedFamilies,
  pickedWords,
  rowPicked,
  setPick,
  sideTitle,
  startFromCopyLine,
  untickCard,
  tickedOwners,
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

const picks = (rows: Record<string, FamilyKind[]>): LinkPicks =>
  new Map(Object.entries(rows).map(([ownerId, families]) => [ownerId, new Set(families)]));

const card = (owners: readonly LinkOwner[], p: LinkPicks, key: string) =>
  linkPlaceCards(owners, p).find((c) => c.key === key)!;

describe("linkPlaceCards", () => {
  // A household with one watch is being asked a question with one answer, and
  // the answer is a single card with its own name on it.
  it("gives a watch alone one card holding its four shapes, widest first", () => {
    const cards = linkPlaceCards([WATCH], new Map());
    expect(cards).toHaveLength(1);
    expect(cards[0]!.key).toBe("watch:w1");
    expect(cards[0]!.label).toBe("Watch face");
    expect(cards[0]!.devices).toEqual(["Jesse's Watch"]);
    expect(cards[0]!.shared).toBe(false);
    expect(cards[0]!.rows.map((r) => r.family)).toEqual(["rectangular", "circular", "corner", "inline"]);
    expect(cards[0]!.rows.every((r) => r.sides.length === 1)).toBe(true);
  });

  it("gives a phone alone the Lock Screen and the Home Screen, each named after it", () => {
    const cards = linkPlaceCards([PHONE], new Map());
    expect(cards.map((c) => [c.key, c.label])).toEqual([["lock:p1", "Lock Screen"], ["home:p1", "Home Screen"]]);
    expect(cards.every((c) => c.devices.join() === "Jesse's iPhone")).toBe(true);
    expect(cards[0]!.rows.map((r) => r.family)).toEqual(["rectangular", "circular", "inline"]);
    expect(cards[1]!.rows.map((r) => r.family)).toEqual(["large", "medium", "small"]);
    expect(cards[1]!.comingSoon.map((r) => r.family)).toEqual(["xlarge"]);
  });

  // There is no device step: every place of every device is in the one grid,
  // ticked or not.
  it("lists every place of every device before anything is ticked", () => {
    const cards = linkPlaceCards([WATCH, PHONE], new Map());
    expect(cards.map((c) => [c.key, c.label, c.devices.join()])).toEqual([
      ["watch:w1", "Watch face", "Jesse's Watch"],
      ["lock:p1", "Lock Screen", "Jesse's iPhone"],
      ["home:p1", "Home Screen", "Jesse's iPhone"],
    ]);
  });

  it("gives two watches a card each, each with its own name", () => {
    const cards = linkPlaceCards([WATCH, WATCH_2], new Map());
    expect(cards.map((c) => [c.key, c.devices.join()])).toEqual([
      ["watch:w1", "Jesse's Watch"],
      ["watch:w2", "Work Watch"],
    ]);
  });

  // The whole point: one design on both devices is asked about once.
  it("folds the watch face and the Lock Screen into one card once both are ticked", () => {
    const p = picks({ w1: ["rectangular"], p1: ["rectangular"] });
    const cards = linkPlaceCards([WATCH, PHONE], p);
    expect(cards.map((c) => c.key)).toEqual(["shared", "home:p1"]);
    const shared = cards[0]!;
    expect(shared.label).toBe("Watch face and Lock Screen");
    expect(shared.devices).toEqual(["Jesse's Watch", "Jesse's iPhone"]);
    expect(shared.ownerIds).toEqual(["w1", "p1"]);
    expect(shared.shared).toBe(true);
    expect(shared.rows.map((r) => r.family)).toEqual(["rectangular", "circular", "corner", "inline"]);
  });

  it("leaves the cards apart while only one of the two is ticked", () => {
    expect(linkPlaceCards([WATCH, PHONE], picks({ w1: ["rectangular"] })).map((c) => c.key))
      .toEqual(["watch:w1", "lock:p1", "home:p1"]);
  });

  it("gives a shared shape one side per device and corner only the watch's", () => {
    const shared = card([WATCH, PHONE], picks({ w1: ["rectangular"], p1: ["rectangular"] }), "shared");
    const row = (family: FamilyKind) => shared.rows.find((r) => r.family === family)!;
    expect(row("rectangular").sides.map((s) => [s.ownerId, s.label])).toEqual([["w1", "Watch"], ["p1", "Lock Screen"]]);
    expect(row("corner").sides.map((s) => s.ownerId)).toEqual(["w1"]);
  });

  // A link joins any set of devices, not one watch plus one phone.
  it("folds every ticked watch and Lock Screen together and leaves the rest alone", () => {
    const owners = [WATCH, WATCH_2, PHONE, PHONE_2];
    const p = picks({ w1: ["circular"], w2: ["circular"], p1: ["circular"], p2: ["circular"] });
    const cards = linkPlaceCards(owners, p);
    expect(cards.map((c) => c.key)).toEqual(["shared", "home:p1", "home:p2"]);
    const circular = cards[0]!.rows.find((r) => r.family === "circular")!;
    expect(circular.sides.map((s) => s.ownerId)).toEqual(["w1", "w2", "p1", "p2"]);
    const half = linkPlaceCards(owners, picks({ w1: ["circular"], p1: ["circular"] }));
    expect(half.map((c) => c.key)).toEqual(["shared", "watch:w2", "lock:p2", "home:p1", "home:p2"]);
  });

  it("holds the Home Screen back from a phone too old for it", () => {
    const old: LinkOwner = { ...PHONE, appVersion: "2.7.0", families: familiesFor({ device_kind: "iphone", app_version: "2.7.0" }), comingSoon: [] };
    expect(linkPlaceCards([old], new Map()).map((c) => c.key)).toEqual(["lock:p1"]);
  });
});

describe("unticking a card", () => {
  // A card is ticked through its shapes, never as a whole: opening one picks
  // nothing for the author. (It ticked its biggest shape for a day, which
  // put Rectangular on anyone who only clicked the watch face card to look.)
  it("counts a card's ticked shapes once however many devices draw them", () => {
    const p = picks({ w1: ["rectangular", "circular"], p1: ["rectangular", "circular"] });
    const shared = card([WATCH, PHONE], p, "shared");
    expect(cardPicked(shared, p)).toBe(2);
    expect(rowPicked(shared.rows[0]!, p)).toBe(true);
    expect(rowPicked(shared.rows.find((r) => r.family === "inline")!, p)).toBe(false);
  });

  it("unticks the folded card on both devices at once", () => {
    const p = picks({ w1: ["rectangular", "corner"], p1: ["rectangular"] });
    const shared = card([WATCH, PHONE], p, "shared");
    const off = untickCard(p, shared);
    expect([...pickedFamilies(off)]).toEqual([]);
  });

  it("leaves the other cards alone when one goes off", () => {
    const p = picks({ w1: ["rectangular"], p1: ["small"] });
    const home = card([WATCH, PHONE], p, "home:p1");
    const off = untickCard(p, home);
    expect([...pickedFamilies(off)]).toEqual(["rectangular"]);
  });
});

describe("the devices it lands on", () => {
  it("names the device of every ticked place and nobody else", () => {
    expect([...tickedOwners([WATCH, PHONE], picks({ w1: ["rectangular"] }), false)]).toEqual(["w1"]);
    expect([...tickedOwners([WATCH, PHONE], picks({ w1: ["rectangular"], p1: ["small"] }), false)]).toEqual(["w1", "p1"]);
  });

  it("counts a device that is only there for the control", () => {
    expect([...tickedOwners([WATCH, PHONE], new Map(), true)]).toEqual(["w1", "p1"]);
    const old: LinkOwner = { ...PHONE, controls: false };
    expect([...tickedOwners([WATCH, old], new Map(), true)]).toEqual(["w1"]);
  });

  it("forgets a device whose last shape was unticked", () => {
    const p = setPick(picks({ w1: ["rectangular"] }), "rectangular", ["w1"], false);
    expect([...tickedOwners([WATCH, PHONE], p, false)]).toEqual([]);
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

  it("drops the picks of a device that is no longer in the set", () => {
    const kept = keepPicks(picks({ w1: ["rectangular"], p1: ["small"] }), new Set(["w1"]));
    expect([...kept.keys()]).toEqual(["w1"]);
  });

  // A device on the link for the control alone has to say so out loud, or the
  // trimming reads it as having no opinion and gives it every shape.
  it("gives a device with nothing picked an empty set rather than no entry", () => {
    const kept = keepPicks(picks({ w1: ["rectangular"] }), new Set(["w1", "p1"]));
    expect([...kept.keys()]).toEqual(["w1", "p1"]);
    expect([...kept.get("p1")!]).toEqual([]);
  });
});

describe("the footer count", () => {
  it("counts a shape once however many devices draw it, and names how many", () => {
    const p = picks({ w1: ["rectangular", "circular"], p1: ["rectangular", "circular"] });
    expect(pickedWords(p, false, new Set(["w1", "p1"]))).toBe("2 shapes on 2 devices");
  });

  it("counts the control beside the shapes and leaves one device unsaid", () => {
    expect(pickedWords(picks({ w1: ["rectangular"] }), true, new Set(["w1"]))).toBe("2 shapes");
    expect(pickedWords(new Map(), true, new Set(["w1"]))).toBe("1 shape");
  });

  it("is silent with nothing picked", () => {
    expect(pickedWords(new Map(), false, new Set())).toBe("");
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
  it("names every device whose app draws a control", () => {
    const old: LinkOwner = { ...PHONE, controls: false };
    expect(controlOwners([WATCH, old]).map((o) => o.ownerId)).toEqual(["w1"]);
    expect(controlOwners([WATCH, PHONE]).map((o) => o.ownerId)).toEqual(["w1", "p1"]);
  });
});
