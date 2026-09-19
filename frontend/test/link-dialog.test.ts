// The New dialog's shape sections: four fixed headings for the whole home,
// with the devices a separate tick. Which sections a home is offered, how each
// one is named, which devices can draw a shape, and how one set of shapes and
// one set of devices become the per-device picks the save plan takes.

import { describe, expect, it } from "vitest";

import type { FamilyKind } from "../src/model.js";
import {
  type LinkOwner,
  type LinkPicks,
  controlOwners,
  keepPicks,
  newReady,
  newSummary,
  ownersDrawing,
  pickedFamilies,
  picksFromChoice,
  sectionTitle,
  setPick,
  shapeSections,
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

describe("controlOwners", () => {
  it("names every device whose app draws a control", () => {
    const old: LinkOwner = { ...PHONE, controls: false };
    expect(controlOwners([WATCH, old]).map((o) => o.ownerId)).toEqual(["w1"]);
    expect(controlOwners([WATCH, PHONE]).map((o) => o.ownerId)).toEqual(["w1", "p1"]);
  });
});

// The sections replaced the per-device cards: four fixed headings for the
// whole home, with the devices a separate tick. A home with two watches and
// two phones drew seven cards to offer eight shapes.
describe("shapeSections", () => {
  const keys = (owners: readonly LinkOwner[]) => shapeSections(owners).map((s) => s.key);
  const section = (owners: readonly LinkOwner[], key: string) => shapeSections(owners).find((s) => s.key === key)!;

  it("gives a watch and a phone all four sections, shared first", () => {
    const sections = shapeSections([WATCH, PHONE]);
    expect(sections.map((s) => [s.key, s.title])).toEqual([
      ["shared", "Watch face and Lock Screen"],
      ["watch", "Watch face only"],
      ["home", "Home Screen"],
      ["control", "Control Center"],
    ]);
    expect(sections[0]!.families).toEqual(["rectangular", "circular", "inline"]);
    expect(sections[1]!.families).toEqual(["corner"]);
    expect(sections[2]!.families).toEqual(["large", "medium", "small"]);
    // The control is a tick, not a set of shapes to design.
    expect(sections[3]!.families).toEqual([]);
  });

  it("says which devices draw each section, watch before iPhone", () => {
    const sections = shapeSections([WATCH, PHONE]);
    expect(sections.map((s) => s.kinds)).toEqual([["watch", "iphone"], ["watch"], ["iphone"], ["watch", "iphone"]]);
  });

  // The whole point of the sections: a second watch and a second phone are two
  // more boxes to tick in "Appears on", not two more headings of shapes.
  it("gives a home with four devices the same four sections", () => {
    const sections = shapeSections([WATCH, WATCH_2, PHONE, PHONE_2]);
    expect(sections.map((s) => s.title)).toEqual([
      "Watch face and Lock Screen",
      "Watch face only",
      "Home Screen",
      "Control Center",
    ]);
    expect(sections[0]!.families).toEqual(["rectangular", "circular", "inline"]);
  });

  // A home with one kind of device is not shown a screen it does not have, and
  // the shared heading stops naming one.
  it("calls the shared shapes the Lock Screen in a home with only phones", () => {
    expect(keys([PHONE])).toEqual(["shared", "home", "control"]);
    expect(section([PHONE], "shared").title).toBe("Lock Screen");
    expect(section([PHONE], "shared").kinds).toEqual(["iphone"]);
  });

  it("calls them the Watch face in a home with only watches, and drops the Home Screen", () => {
    expect(keys([WATCH])).toEqual(["shared", "watch", "control"]);
    expect(section([WATCH], "shared").title).toBe("Watch face");
  });

  it("carries the coming soon shapes under the section that will hold them", () => {
    expect(section([WATCH, PHONE], "home").comingSoon).toEqual(["xlarge"]);
    expect(section([WATCH, PHONE], "shared").comingSoon).toEqual([]);
  });

  it("drops the Home Screen for a phone too old to have one", () => {
    const old: LinkOwner = { ...PHONE, appVersion: "2.7.0", families: familiesFor({ device_kind: "iphone", app_version: "2.7.0" }), comingSoon: [] };
    expect(keys([old])).toEqual(["shared", "control"]);
  });

  it("leaves the control section out when no app in the home draws one", () => {
    const owners = [{ ...WATCH, controls: false }, { ...PHONE, controls: false }];
    expect(keys(owners)).toEqual(["shared", "watch", "home"]);
  });

  it("names the control section after the devices that draw one, not the home", () => {
    expect(section([WATCH, { ...PHONE, controls: false }], "control").kinds).toEqual(["watch"]);
  });

  // The control card draws one device outline per kind in `kinds`, so this is
  // what decides whether a watch appears beside the phone on it. A watch draws
  // a control as much as a phone does: the only gate is the app version
  // (`deviceSupportsControls`), never the kind of device.
  it("puts the watch beside the iPhone on the control section", () => {
    expect(section([WATCH, PHONE], "control").kinds).toEqual(["watch", "iphone"]);
    expect(section([WATCH], "control").kinds).toEqual(["watch"]);
  });
});

// The line in the New dialog's footer, which replaced the tooltip on a Create
// button that refused to be pressed. It has to name the first step still open,
// in the order the steps are asked.
describe("newSummary", () => {
  const base = { named: true, shapes: 1, devices: 1, hasControl: true };

  it("asks for the name before anything else, whatever else is ticked", () => {
    expect(newSummary({ ...base, named: false, shapes: 0, devices: 0 })).toBe("Type a name to start.");
    expect(newSummary({ ...base, named: false })).toBe("Type a name to start.");
  });

  it("gives the name's own complaint once there is a name to complain about", () => {
    const nameProblem = "A complication on this watch already has that name.";
    expect(newSummary({ ...base, nameProblem })).toBe(nameProblem);
  });

  it("asks for a shape next, and says the control counts as one where there is one", () => {
    expect(newSummary({ ...base, shapes: 0 })).toBe("Tick a shape or the control first.");
    expect(newSummary({ ...base, shapes: 0, hasControl: false })).toBe("Now tick at least one shape.");
  });

  it("asks for a device last", () => {
    expect(newSummary({ ...base, devices: 0 })).toBe("Tick at least one device.");
  });

  it("counts what Create is about to make once nothing is missing", () => {
    expect(newSummary(base)).toBe("1 shape on 1 device");
    expect(newSummary({ ...base, shapes: 3, devices: 2 })).toBe("3 shapes on 2 devices");
  });
});

describe("newReady", () => {
  const base = { named: true, shapes: 1, devices: 1, hasControl: true };

  it("is true only when every step has been answered", () => {
    expect(newReady(base)).toBe(true);
    expect(newReady({ ...base, named: false })).toBe(false);
    expect(newReady({ ...base, nameProblem: "taken" })).toBe(false);
    expect(newReady({ ...base, shapes: 0 })).toBe(false);
    expect(newReady({ ...base, devices: 0 })).toBe(false);
  });

  // The footer and the button are one answer in two places: a summary that
  // counts shapes means Create is live, and any other summary means it is not.
  it("agrees with the summary about whether anything is missing", () => {
    for (const state of [
      base,
      { ...base, named: false },
      { ...base, nameProblem: "taken" },
      { ...base, shapes: 0 },
      { ...base, devices: 0 },
    ]) {
      expect(newReady(state)).toBe(newSummary(state).includes(" on "));
    }
  });
});

describe("ownersDrawing", () => {
  it("names the devices that can show a shape and nobody else", () => {
    expect(ownersDrawing([WATCH, PHONE], "rectangular").map((o) => o.ownerId)).toEqual(["w1", "p1"]);
    expect(ownersDrawing([WATCH, PHONE], "corner").map((o) => o.ownerId)).toEqual(["w1"]);
    expect(ownersDrawing([WATCH, PHONE], "small").map((o) => o.ownerId)).toEqual(["p1"]);
  });
});

describe("picksFromChoice", () => {
  const chosen = (families: FamilyKind[], ids: string[]) =>
    picksFromChoice([WATCH, PHONE], new Set(families), new Set(ids));

  it("gives each ticked device the shapes it can actually draw", () => {
    const p = chosen(["rectangular", "corner", "small"], ["w1", "p1"]);
    expect([...p.get("w1")!]).toEqual(["rectangular", "corner"]);
    expect([...p.get("p1")!]).toEqual(["rectangular", "small"]);
  });

  it("leaves an unticked device out altogether", () => {
    expect([...chosen(["rectangular"], ["w1"]).keys()]).toEqual(["w1"]);
  });

  // A control-only complication lands on a device with no shape, and that
  // device has to say so out loud: a missing entry reads as "no opinion" and
  // the trimming hands it every shape the others picked.
  it("gives a device that draws none of them an empty set rather than no entry", () => {
    const p = chosen(["corner"], ["w1", "p1"]);
    expect([...p.keys()]).toEqual(["w1", "p1"]);
    expect([...p.get("p1")!]).toEqual([]);
    expect([...chosen([], ["p1"]).get("p1")!]).toEqual([]);
  });
});

describe("sectionTitle", () => {
  it("names both screens only when the home has both devices", () => {
    expect(sectionTitle("shared", ["watch", "iphone"])).toBe("Watch face and Lock Screen");
    expect(sectionTitle("shared", ["watch"])).toBe("Watch face");
    expect(sectionTitle("shared", ["iphone"])).toBe("Lock Screen");
  });

  it("leaves the other three headings alone", () => {
    expect(sectionTitle("watch", ["watch"])).toBe("Watch face only");
    expect(sectionTitle("home", ["iphone"])).toBe("Home Screen");
    expect(sectionTitle("control", ["watch", "iphone"])).toBe("Control Center");
  });
});
