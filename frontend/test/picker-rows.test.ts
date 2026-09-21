// The picker lists every complication this home holds, one card each, under a
// row of device tabs. These are the pure parts of that: what the rows are,
// what order they come in, which tab and section each one falls under, and
// what the search reads.

import { describe, expect, it } from "vitest";

import {
  ALL_DEVICES,
  PERSON_COLORS,
  type PickerCopy,
  type PickerDevice,
  type PickerPerson,
  isShelvedRow,
  personColorVar,
  personIndex,
  pickerListRows,
  pickerSections,
  pickerTabs,
  pickerView,
  rowWhoText,
  rowsOnDevice,
  sortPickerRows,
} from "../src/pickerRows.js";
import { LIBRARY_OWNER_ID } from "../src/version.js";

const watch: PickerDevice = { ownerId: "w1", label: "Chen", kind: "watch" };
const watch2: PickerDevice = { ownerId: "w2", label: "Jesse Apple Watch", kind: "watch" };
const phone: PickerDevice = { ownerId: "p1", label: "iPhone 15 Pro", kind: "iphone" };
const shelf: PickerDevice = { ownerId: LIBRARY_OWNER_ID, label: "Unassigned", kind: "library" };
const devices = [watch, watch2, phone];

const copy = (over: Partial<PickerCopy<string>> & { ownerId: string; id: string }): PickerCopy<string> => ({
  slot: 0,
  name: "Porch",
  item: over.id,
  ...over,
});

describe("pickerListRows", () => {
  it("makes one row per complication, whichever device it is on", () => {
    const rows = pickerListRows([
      copy({ ownerId: "w1", id: "a", name: "Porch" }),
      copy({ ownerId: "p1", id: "b", name: "Kitchen" }),
    ], devices);
    expect(rows).toHaveLength(2);
    expect(rows.map((r) => r.copies.length)).toEqual([1, 1]);
  });

  // Two people's watches showing "Porch" are two complications now. They used
  // to be collapsed into one row by the link they shared.
  it("keeps two copies of one design on two devices apart", () => {
    const rows = pickerListRows([
      copy({ ownerId: "w1", id: "a", name: "Porch" }),
      copy({ ownerId: "p1", id: "b", name: "Porch" }),
    ], devices);
    expect(rows).toHaveLength(2);
    expect(rows.map((r) => r.open.ownerId)).toEqual(["w1", "p1"]);
  });

  it("opens and names each row from its own copy", () => {
    const rows = pickerListRows([copy({ ownerId: "w1", id: "a", name: "Porch (watch)" })], devices);
    expect(rows[0]!.open.id).toBe("a");
    expect(rows[0]!.name).toBe("Porch (watch)");
  });

  // What the card draws now: one device glyph and one shape glyph, both read
  // off the row's single copy. A row with two copies in it would have to
  // choose which device it was about.
  it("gives every row exactly one copy to draw", () => {
    const rows = pickerListRows([
      copy({ ownerId: "w1", id: "a", name: "Porch" }),
      copy({ ownerId: "p1", id: "b", name: "Porch" }),
      copy({ ownerId: LIBRARY_OWNER_ID, id: "c", name: "Porch" }),
    ], devices);
    for (const row of rows) {
      expect(row.copies).toHaveLength(1);
      expect(row.copies[0]).toBe(row.open);
    }
  });

  it("gives every row a key that stays the same across a reload", () => {
    const input = [
      copy({ ownerId: "w1", id: "a" }),
      copy({ ownerId: "p1", id: "b" }),
    ];
    expect(pickerListRows(input, devices).map((r) => r.key))
      .toEqual(pickerListRows(input, devices).map((r) => r.key));
    expect(new Set(pickerListRows(input, devices).map((r) => r.key)).size).toBe(2);
  });
});

describe("sortPickerRows", () => {
  it("keeps one device's list in seat order", () => {
    const rows = pickerListRows([
      copy({ ownerId: "w1", id: "a", name: "Zebra", slot: 0 }),
      copy({ ownerId: "w1", id: "b", name: "Apple", slot: 1 }),
    ], devices);
    expect(sortPickerRows(rows, devices).map((r) => r.name)).toEqual(["Zebra", "Apple"]);
  });

  it("sorts across devices by name, without case", () => {
    const rows = pickerListRows([
      copy({ ownerId: "w1", id: "a", name: "zebra", slot: 0 }),
      copy({ ownerId: "p1", id: "b", name: "Apple", slot: 0 }),
      copy({ ownerId: "w1", id: "c", name: "Mango", slot: 1 }),
    ], devices);
    expect(sortPickerRows(rows, devices).map((r) => r.name)).toEqual(["Apple", "Mango", "zebra"]);
  });

  it("breaks a tie on the name with the device order", () => {
    const rows = pickerListRows([
      copy({ ownerId: "p1", id: "b", name: "Porch" }),
      copy({ ownerId: "w2", id: "c", name: "Porch" }),
      copy({ ownerId: "w1", id: "a", name: "Porch" }),
    ], devices);
    expect(sortPickerRows(rows, devices).map((r) => r.open.ownerId)).toEqual(["w1", "w2", "p1"]);
  });

  it("uses the named device's own seats when a chip narrows the list", () => {
    const rows = pickerListRows([
      copy({ ownerId: "w1", id: "a", name: "Zebra", slot: 0 }),
      copy({ ownerId: "p1", id: "a2", name: "Zebra", slot: 4 }),
      copy({ ownerId: "p1", id: "b", name: "Apple", slot: 1 }),
    ], devices);
    expect(sortPickerRows(rowsOnDevice(rows, "p1"), devices, "p1").map((r) => r.name))
      .toEqual(["Apple", "Zebra"]);
  });

  it("leaves the rows it was given alone", () => {
    const rows = pickerListRows([
      copy({ ownerId: "w1", id: "a", name: "Zebra", slot: 0 }),
      copy({ ownerId: "p1", id: "b", name: "Apple", slot: 0 }),
    ], devices);
    const before = rows.map((r) => r.name);
    sortPickerRows(rows, devices);
    expect(rows.map((r) => r.name)).toEqual(before);
  });
});

describe("rowsOnDevice", () => {
  it("keeps each row on the device its copy is on", () => {
    const rows = pickerListRows([
      copy({ ownerId: "w1", id: "a", name: "Porch" }),
      copy({ ownerId: "p1", id: "b", name: "Porch" }),
      copy({ ownerId: "p1", id: "c", name: "Kitchen" }),
    ], devices);
    expect(rowsOnDevice(rows, "w1").map((r) => r.name)).toEqual(["Porch"]);
    expect(rowsOnDevice(rows, "p1").map((r) => r.name).sort()).toEqual(["Kitchen", "Porch"]);
    expect(rowsOnDevice(rows, "w2")).toEqual([]);
  });
});

describe("pickerTabs", () => {
  const rows = pickerListRows([
    copy({ ownerId: "w1", id: "a", name: "Porch" }),
    copy({ ownerId: "p1", id: "b", name: "Kitchen" }),
    copy({ ownerId: "p1", id: "c", name: "Alarm" }),
    copy({ ownerId: LIBRARY_OWNER_ID, id: "d", name: "Draft" }),
  ], [...devices, shelf]);

  it("puts All first, then the devices, then the library", () => {
    expect(pickerTabs(rows, [...devices, shelf]).map((t) => t.key))
      .toEqual([ALL_DEVICES, "w1", "w2", "p1", LIBRARY_OWNER_ID]);
  });

  // However the home's device list arrives, the shelf reads after every
  // device: it is where a design waits rather than a place it is.
  it("keeps the library last whatever order the devices come in", () => {
    expect(pickerTabs(rows, [shelf, phone, watch]).map((t) => t.key))
      .toEqual([ALL_DEVICES, "p1", "w1", LIBRARY_OWNER_ID]);
  });

  it("counts every card on All and each device's own on its tab", () => {
    const counts = new Map(pickerTabs(rows, [...devices, shelf]).map((t) => [t.key, t.count]));
    expect(counts.get(ALL_DEVICES)).toBe(4);
    expect(counts.get("w1")).toBe(1);
    expect(counts.get("w2")).toBe(0);
    expect(counts.get("p1")).toBe(2);
    expect(counts.get(LIBRARY_OWNER_ID)).toBe(1);
  });

  it("names each tab after its device, and the shelf Unassigned", () => {
    const tabs = pickerTabs(rows, [...devices, shelf]);
    expect(tabs.map((t) => t.label)).toEqual(["All", "Chen", "Jesse Apple Watch", "iPhone 15 Pro", "Unassigned"]);
    expect(tabs.map((t) => t.kind)).toEqual(["all", "watch", "watch", "iphone", "library"]);
  });

  // A home whose integration is older than the library has no shelf at all,
  // and gets no tab for one rather than an empty tab that can never fill.
  it("offers no Unassigned tab in a home with no shelf", () => {
    expect(pickerTabs(rows, devices).map((t) => t.key)).toEqual([ALL_DEVICES, "w1", "w2", "p1"]);
  });
});

describe("pickerSections", () => {
  const rows = pickerListRows([
    copy({ ownerId: "w1", id: "a", name: "Porch", slot: 2 }),
    copy({ ownerId: "w1", id: "b", name: "Alarm", slot: 0 }),
    copy({ ownerId: "p1", id: "c", name: "Kitchen" }),
    copy({ ownerId: LIBRARY_OWNER_ID, id: "d", name: "Draft" }),
  ], [...devices, shelf]);

  it("cuts the rows into one section per device, in the tabs' own order", () => {
    expect(pickerSections(rows, [...devices, shelf]).map((s) => s.ownerId))
      .toEqual(["w1", "w2", "p1", LIBRARY_OWNER_ID]);
  });

  it("keeps each device's own seat order inside its section", () => {
    const [first] = pickerSections(rows, [...devices, shelf]);
    expect(first!.rows.map((r) => r.name)).toEqual(["Alarm", "Porch"]);
  });

  // An empty watch is part of the answer to what this home has got, so its
  // section is still made; whether it is drawn is the caller's to decide.
  it("gives a device with nothing on it a section of its own", () => {
    const empty = pickerSections(rows, [...devices, shelf]).find((s) => s.ownerId === "w2");
    expect(empty?.rows).toEqual([]);
  });

  it("carries the heading each section wears", () => {
    const shelved = pickerSections(rows, [...devices, shelf]).at(-1);
    expect(shelved?.label).toBe("Unassigned");
    expect(shelved?.kind).toBe("library");
    expect(shelved?.rows.map((r) => r.name)).toEqual(["Draft"]);
  });

  it("leaves out a device this home does not list", () => {
    expect(pickerSections(rows, [watch]).map((s) => s.ownerId)).toEqual(["w1"]);
  });
});

describe("pickerView", () => {
  const rows = pickerListRows([
    copy({ ownerId: "w1", id: "a", name: "Porch", slot: 2 }),
    copy({ ownerId: "p1", id: "c", name: "Kitchen", slot: 1 }),
    copy({ ownerId: "w1", id: "d", name: "Alarm", slot: 0 }),
  ], devices);

  it("shows every complication under All, in name order", () => {
    expect(pickerView(rows, devices, ALL_DEVICES).map((r) => r.name))
      .toEqual(["Alarm", "Kitchen", "Porch"]);
  });

  it("narrows to a device and keeps that device's seat order", () => {
    expect(pickerView(rows, devices, "p1").map((r) => r.name)).toEqual(["Kitchen"]);
    expect(pickerView(rows, devices, "w1").map((r) => r.name)).toEqual(["Alarm", "Porch"]);
  });

  it("gives an empty list for a device holding nothing", () => {
    expect(pickerView(rows, devices, "w2")).toEqual([]);
  });
});

describe("rowWhoText", () => {
  const jesse: PickerPerson = {
    label: "Jesse",
    devices: [{ ownerId: "w2", kind: "watch" }, { ownerId: "p1", kind: "iphone" }],
  };
  const chen: PickerPerson = {
    label: "Chen",
    devices: [{ ownerId: "w1", kind: "watch" }, { ownerId: "p2", kind: "iphone" }],
  };
  const people = [jesse, chen];

  it("names each person once, with the devices of theirs that have a copy", () => {
    expect(rowWhoText(["w2", "p1", "w1"], people)).toBe("Jesse (watch, iPhone) · Chen (watch)");
  });

  it("leaves out a person who has none of the copies", () => {
    expect(rowWhoText(["w1"], people)).toBe("Chen (watch)");
  });

  // The devices come out in the household list's order, not in the order the
  // copies happened to be read off the devices.
  it("keeps the person's own device order whatever order the ids arrive in", () => {
    expect(rowWhoText(["p1", "w2"], people)).toBe("Jesse (watch, iPhone)");
  });

  it("says so in words when nothing has it, rather than drawing an empty line", () => {
    expect(rowWhoText([], people)).toBe("On no device yet");
    expect(rowWhoText(["nobody"], people)).toBe("On no device yet");
  });

  // A watch this home no longer lists belongs to nobody, so it names nobody.
  it("ignores an id that is not any of these people's", () => {
    expect(rowWhoText(["w1", "gone"], people)).toBe("Chen (watch)");
  });

  // On nothing and unassigned are both "on no device", and they are not the
  // same news: one is a design waiting on the shelf.
  it("names the library when that is the only place a design is", () => {
    expect(rowWhoText([LIBRARY_OWNER_ID], people)).toBe("Unassigned, on no device");
  });

  // The library is not somebody's, so it is never printed beside a person. A
  // design that somehow has both reads as being on the device.
  it("says nothing about the library beside a person who has a copy", () => {
    expect(rowWhoText([LIBRARY_OWNER_ID, "w1"], people)).toBe("Chen (watch)");
  });
});

// The picker colors its tabs by person, so both of one person's devices read
// as a pair before either name has been read.
describe("personIndex", () => {
  const jesse: PickerPerson = {
    label: "Jesse",
    devices: [{ ownerId: "w2", kind: "watch" }, { ownerId: "p1", kind: "iphone" }],
  };
  const chen: PickerPerson = {
    label: "Chen",
    devices: [{ ownerId: "w1", kind: "watch" }, { ownerId: "p2", kind: "iphone" }],
  };
  const people = [jesse, chen];

  it("gives a person's own devices the same place in the list", () => {
    expect(personIndex(people, "w2")).toBe(0);
    expect(personIndex(people, "p1")).toBe(0);
    expect(personIndex(people, "w1")).toBe(1);
    expect(personIndex(people, "p2")).toBe(1);
  });

  // The shelf is nobody's, and so is a device that has left the home. Both
  // keep the accent rather than borrowing the first person's color.
  it("gives a device nobody owns no person at all", () => {
    expect(personIndex(people, LIBRARY_OWNER_ID)).toBe(-1);
    expect(personIndex(people, ALL_DEVICES)).toBe(-1);
    expect(personIndex(people, "gone")).toBe(-1);
    expect(personIndex([], "w1")).toBe(-1);
  });

  it("hands out one custom property per person, and none to nobody", () => {
    expect(personColorVar(personIndex(people, "w2"))).toBe("var(--wa-person-1)");
    expect(personColorVar(personIndex(people, "p1"))).toBe("var(--wa-person-1)");
    expect(personColorVar(personIndex(people, "w1"))).toBe("var(--wa-person-2)");
    expect(personColorVar(personIndex(people, LIBRARY_OWNER_ID))).toBeUndefined();
  });

  // A household bigger than the palette starts it again rather than leaving
  // the seventh person uncolored.
  it("wraps round the palette rather than running out", () => {
    expect(personColorVar(PERSON_COLORS)).toBe("var(--wa-person-1)");
    expect(personColorVar(PERSON_COLORS - 1)).toBe(`var(--wa-person-${PERSON_COLORS})`);
  });
});

describe("the library in the picker's rows", () => {
  const shelved = (over: Partial<PickerCopy<string>> = {}) =>
    copy({ ownerId: LIBRARY_OWNER_ID, id: "lib", ...over });

  it("calls a row shelved when its copy is on the shelf", () => {
    const [only] = pickerListRows([shelved()], devices);
    expect(isShelvedRow(only!)).toBe(true);
    const [device] = pickerListRows([copy({ ownerId: "w1", id: "a" })], devices);
    expect(isShelvedRow(device!)).toBe(false);
  });

  // The shelf is a tab and a section of its own, so a design waiting on it is
  // never mixed in with a device's cards.
  it("keeps a shelved row out of every device's section", () => {
    const rows = pickerListRows([
      shelved({ name: "Draft" }),
      copy({ ownerId: "w1", id: "a", name: "Porch" }),
    ], [...devices, shelf]);
    const sections = pickerSections(rows, [...devices, shelf]);
    expect(sections.find((s) => s.ownerId === "w1")?.rows.map((r) => r.name)).toEqual(["Porch"]);
    expect(sections.at(-1)?.rows.map((r) => r.name)).toEqual(["Draft"]);
  });
});
