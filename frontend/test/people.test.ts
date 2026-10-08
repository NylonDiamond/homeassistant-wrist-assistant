// The household as people: which devices belong to whom, what each group is
// called, and what a device is called inside it.

import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import { deviceShortName, haPeople, libraryOwner, peopleNames, peopleOf, personOf } from "../src/people.js";

function owner(o: Partial<OwnerSummary> & { owner_watch_id: string }): OwnerSummary {
  return {
    device_name: null,
    device_kind: "watch",
    paired_iphone_name: null,
    app_version: "2.8.0",
    screen_size: null,
    complication_count: 0,
    token: 1,
    is_orphan: false,
    ...o,
  };
}

const watch = (id: string, name: string | null, extra: Partial<OwnerSummary> = {}) =>
  owner({ owner_watch_id: id, device_name: name, device_kind: "watch", ...extra });

const phone = (id: string, name: string | null, extra: Partial<OwnerSummary> = {}) =>
  owner({ owner_watch_id: id, device_name: name, device_kind: "iphone", ...extra });

/** The home's shelf, which the server lists after every device. */
const library = (extra: Partial<OwnerSummary> = {}) =>
  owner({ owner_watch_id: "library", device_name: "Library", device_kind: "library", app_version: null, ...extra });

/** Two people, each with a phone and a watch, and both watches reporting the
 * same model name: the home the id pairing exists for. */
function household() {
  return [
    watch("w1", "Apple Watch", { paired_iphone_id: "p1", paired_iphone_name: "Jesse's iPhone" }),
    watch("w2", "Apple Watch", { paired_iphone_id: "p2", paired_iphone_name: "Chen's iPhone" }),
    phone("p1", "Jesse's iPhone"),
    phone("p2", "Chen's iPhone"),
  ];
}

describe("peopleOf", () => {
  it("puts each watch with the phone its id names, phone first", () => {
    const people = peopleOf(household());
    expect(people.map((p) => [p.key, p.label])).toEqual([
      ["p1", "Jesse's iPhone"],
      ["p2", "Chen's iPhone"],
    ]);
    expect(people.map((p) => p.owners.map((o) => o.owner_watch_id))).toEqual([["p1", "w1"], ["p2", "w2"]]);
  });

  // The watches sort first, so a person is listed where their watch is rather
  // than where their phone is: the first group is the first watch's.
  it("puts a group where its first member stands", () => {
    const people = peopleOf([
      watch("w2", "Apple Watch", { paired_iphone_id: "p2" }),
      watch("w1", "Apple Watch", { paired_iphone_id: "p1" }),
      phone("p1", "Jesse's iPhone"),
      phone("p2", "Chen's iPhone"),
    ]);
    expect(people.map((p) => p.key)).toEqual(["p2", "p1"]);
  });

  // An integration older than `paired_iphone_id` sends the name and nothing
  // else, and the pairing still has to work.
  it("falls back to the paired phone's name when no id was sent", () => {
    const people = peopleOf([
      watch("w1", "Apple Watch", { paired_iphone_name: "Jesse's iPhone" }),
      phone("p1", "Jesse's iPhone"),
    ]);
    expect(people).toHaveLength(1);
    expect(people[0]!.owners.map((o) => o.owner_watch_id)).toEqual(["p1", "w1"]);
  });

  // The id is the one that can be trusted, so a name beside it is not
  // consulted: a watch whose phone has left the home is its own person rather
  // than attached to whichever phone happens to share the old one's name.
  it("leaves a watch on its own when its id names a phone that is gone", () => {
    const people = peopleOf([
      watch("w1", "Apple Watch", { paired_iphone_id: "gone", paired_iphone_name: "Jesse's iPhone" }),
      phone("p1", "Jesse's iPhone"),
    ]);
    expect(people.map((p) => [p.key, p.label])).toEqual([
      ["w1", "Apple Watch"],
      ["p1", "Jesse's iPhone"],
    ]);
  });

  it("makes a watch with no phone at all its own person", () => {
    const people = peopleOf([watch("w1", "Jesse's Watch"), phone("p1", "Chen's iPhone")]);
    expect(people.map((p) => [p.key, p.label])).toEqual([
      ["w1", "Jesse"],
      ["p1", "Chen's iPhone"],
    ]);
  });

  // There is no person in the data: an owner is an id and the name the device
  // reported. A watch is named by whoever wears it, so the name of the group
  // is read out of the watch, with the words about the watch taken off.
  describe("naming a person", () => {
    it("takes the person out of the watch's name", () => {
      const cases: [string, string][] = [
        ["Jesse Apple Watch", "Jesse"],
        ["Jesse's Apple Watch", "Jesse"],
        ["Jesse\u2019s Watch", "Jesse"],
        ["Chen", "Chen"],
        ["Chen Apple Watch Ultra", "Chen"],
        ["Chen Apple Watch 2", "Chen"],
        ["Watch Roel", "Roel"],
        ["Apple Watch van Roel", "Roel"],
        ["Apple Watch de Marie", "Marie"],
        ["Apple Watch von Jesse", "Jesse"],
        ["Apple Watch Ultra van Roel", "Roel"],
      ];
      for (const [given, want] of cases) {
        expect(peopleOf([watch("w1", given, { paired_iphone_id: "p1" }), phone("p1", "iPhone 15 Pro")])[0]?.label,
          `${given} should read as ${want}`).toBe(want);
      }
    });

    // A watch that kept the name it shipped with names nobody, and the phone's
    // name is the answer then, which is what this always used to be.
    it("falls back to the phone when the watch kept its own name", () => {
      for (const given of ["Apple Watch", "Watch", "  "]) {
        expect(peopleOf([watch("w1", given, { paired_iphone_id: "p1" }), phone("p1", "Jesse's iPhone")])[0]?.label,
          `${given} should fall back`).toBe("Jesse's iPhone");
      }
    });

    // A watch named after the phone it is paired to names nobody either.
    it("falls back when the watch is named after the phone", () => {
      expect(peopleOf([watch("w1", "iPhone 15 Pro", { paired_iphone_id: "p1" }), phone("p1", "iPhone 15 Pro")])[0]?.label)
        .toBe("iPhone 15 Pro");
    });

    // A person with a phone and no watch has nothing to read.
    it("keeps the phone's name for a person with no watch", () => {
      expect(peopleOf([phone("p1", "iPhone 15 Pro")])[0]?.label).toBe("iPhone 15 Pro");
    });
  });

  // Nothing can be saved to an orphan, so an "Appears on" list holding one would
  // be offering a box that cannot be ticked.
  it("leaves an orphan out entirely", () => {
    const people = peopleOf([
      owner({ owner_watch_id: "gone", device_kind: null, is_orphan: true }),
      phone("p1", "Jesse's iPhone"),
    ]);
    expect(people.map((p) => p.key)).toEqual(["p1"]);
  });

  it("falls back to the owner id when a device reported no name", () => {
    const people = peopleOf([owner({ owner_watch_id: "w1" }), phone("p1", null)]);
    expect(people.map((p) => p.label)).toEqual(["w1", "p1"]);
  });

  // The library belongs to nobody because it belongs to the whole home, so
  // filing it under a person would say the wrong thing about everyone else.
  it("leaves the library out of every person group", () => {
    const people = peopleOf([
      watch("w1", "Jesse's Watch", { paired_iphone_id: "p1" }),
      phone("p1", "Jesse's iPhone"),
      library(),
    ]);
    expect(people).toHaveLength(1);
    expect(people[0]!.owners.map((o) => o.owner_watch_id)).toEqual(["p1", "w1"]);
  });

  it("leaves a home with nothing but the library with no people at all", () => {
    expect(peopleOf([library()])).toEqual([]);
  });

  // An older integration would name the id without the kind, and the id alone
  // is the reserved word.
  it("leaves the library out on its id alone", () => {
    const people = peopleOf([library({ device_kind: null }), phone("p1", "Jesse's iPhone")]);
    expect(people.map((p) => p.key)).toEqual(["p1"]);
  });
});

describe("libraryOwner", () => {
  it("finds the home's shelf among the devices", () => {
    expect(libraryOwner([watch("w1", "Jesse's Watch"), library()])!.owner_watch_id).toBe("library");
  });

  // Undefined is the panel's cue to draw no shelf, rather than to invent one
  // an older integration knows nothing about.
  it("is undefined when the integration sends no library row", () => {
    expect(libraryOwner([watch("w1", "Jesse's Watch"), phone("p1", "Jesse's iPhone")])).toBeUndefined();
    expect(libraryOwner([])).toBeUndefined();
  });
});

describe("personOf", () => {
  it("finds the person either of their devices belongs to", () => {
    const people = peopleOf(household());
    expect(personOf(people, "w1")!.key).toBe("p1");
    expect(personOf(people, "p1")!.key).toBe("p1");
    expect(personOf(people, "w2")!.key).toBe("p2");
    expect(personOf(people, "nobody")).toBeUndefined();
  });

  // The shelf is nobody's, so it answers the same way an id that left the home
  // does. The panel draws it as its own row rather than inside a person.
  it("gives the library no person", () => {
    const people = peopleOf([...household(), library()]);
    expect(personOf(people, "library")).toBeUndefined();
  });
});

describe("peopleNames", () => {
  it("names a person once however many of their devices are named", () => {
    const people = peopleOf(household());
    expect(peopleNames(people, ["p1", "w1"])).toEqual(["Jesse's iPhone"]);
  });

  it("reads in the order the list draws, not the order it was asked", () => {
    const people = peopleOf(household());
    expect(peopleNames(people, ["w2", "w1"])).toEqual(["Jesse's iPhone", "Chen's iPhone"]);
  });

  it("ignores an id nobody owns and says nothing for none", () => {
    const people = peopleOf(household());
    expect(peopleNames(people, ["gone"])).toEqual([]);
    expect(peopleNames(people, [])).toEqual([]);
  });
});

describe("deviceShortName", () => {
  it("drops the phone's name when the group is already headed with it", () => {
    const people = peopleOf(household());
    const jesse = people[0]!;
    expect(jesse.owners.map((o) => deviceShortName(o, jesse))).toEqual(["iPhone", "Apple Watch"]);
  });

  it("keeps a lone phone's real name, since nothing else is listed with it", () => {
    const people = peopleOf([phone("p1", "Jesse's iPhone")]);
    expect(deviceShortName(people[0]!.owners[0]!, people[0]!)).toBe("Jesse's iPhone");
  });

  it("keeps a watch's own name always", () => {
    const people = peopleOf([watch("w1", "Jesse's Watch")]);
    expect(deviceShortName(people[0]!.owners[0]!, people[0]!)).toBe("Jesse's Watch");
  });
});

describe("people by Home Assistant user", () => {
  const state = (entity_id: string, attributes: Record<string, unknown>) =>
    ({ entity_id, state: "home", attributes, last_changed: "", last_updated: "" });

  it("reads each person bound to a user, with a name and a picture where there is one", () => {
    const persons = haPeople({
      "person.jesse": state("person.jesse", { user_id: "u1", friendly_name: "Jesse", entity_picture: "/api/image/serve/x/512x512" }),
      "person.chen_lin": state("person.chen_lin", { user_id: "u2" }),
      "person.guest": state("person.guest", { friendly_name: "Guest" }),
      "light.kitchen": state("light.kitchen", { user_id: "u3" }),
    });
    expect([...persons]).toEqual([
      ["u1", { entityId: "person.jesse", name: "Jesse", picture: "/api/image/serve/x/512x512" }],
      ["u2", { entityId: "person.chen_lin", name: "chen_lin" }],
    ]);
  });

  it("puts every device of one user together, under that user's person, every phone first", () => {
    const persons = new Map([["u1", { entityId: "person.jesse", name: "Jesse", picture: "/pic" }]]);
    const people = peopleOf([
      watch("w1", "Jesse Apple Watch", { user_id: "u1" }),
      watch("w2", "Chen", { user_id: "u2", paired_iphone_id: "p2" }),
      watch("w3", "Sim", { user_id: "u1", paired_iphone_id: "p3" }),
      watch("w4", "Spare"),
      phone("p1", "iPhone 15 Pro", { user_id: "u1" }),
      phone("p2", "iPhone 14 Pro Max", { user_id: "u2" }),
      phone("p3", "iPhone 17 Pro", { user_id: "u1" }),
    ], persons);
    expect(people.map((p) => [p.key, p.label, p.owners.map((o) => o.owner_watch_id), p.userId, p.picture])).toEqual([
      ["user:u1", "Jesse", ["p1", "p3", "w1", "w3"], "u1", "/pic"],
      // No person for this user: the name is read from the watch as before.
      ["user:u2", "Chen", ["p2", "w2"], "u2", undefined],
      ["w4", "Spare", ["w4"], undefined, undefined],
    ]);
  });

  it("puts an unbound watch with its bound phone's user", () => {
    const people = peopleOf([
      watch("w1", "Apple Watch", { paired_iphone_id: "p1" }),
      phone("p1", "iPhone", { user_id: "u1" }),
    ]);
    expect(people.map((p) => [p.key, p.owners.map((o) => o.owner_watch_id)])).toEqual([["user:u1", ["p1", "w1"]]]);
  });
});
