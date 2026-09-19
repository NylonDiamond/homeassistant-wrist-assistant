// The picker lists every complication this home holds in one list, with the
// copies of a linked complication collapsed to one row. These are the pure
// parts of that: what the rows are, what order they come in, and what the line
// under them says.

import { describe, expect, it } from "vitest";

import {
  ALL_DEVICES,
  type PickerCopy,
  type PickerDevice,
  type PickerPerson,
  isPersonFilter,
  isShelvedRow,
  personFilter,
  pickerCountText,
  pickerListRows,
  pickerView,
  rowWhoText,
  rowsOfPeople,
  rowsOnDevice,
  sortPickerRows,
} from "../src/pickerRows.js";
import { LIBRARY_OWNER_ID } from "../src/version.js";

const watch: PickerDevice = { ownerId: "w1", label: "Chen", kind: "watch" };
const watch2: PickerDevice = { ownerId: "w2", label: "Jesse Apple Watch", kind: "watch" };
const phone: PickerDevice = { ownerId: "p1", label: "iPhone 15 Pro", kind: "iphone" };
const devices = [watch, watch2, phone];

const copy = (over: Partial<PickerCopy<string>> & { ownerId: string; id: string }): PickerCopy<string> => ({
  slot: 0,
  name: "Porch",
  item: over.id,
  ...over,
});

describe("pickerListRows", () => {
  it("makes one row per unlinked complication, whichever device it is on", () => {
    const rows = pickerListRows([
      copy({ ownerId: "w1", id: "a", name: "Porch" }),
      copy({ ownerId: "p1", id: "b", name: "Kitchen" }),
    ], devices);
    expect(rows).toHaveLength(2);
    expect(rows.map((r) => r.copies.length)).toEqual([1, 1]);
  });

  // The ids of a link stay different on purpose, so placed faces and widgets
  // keep pointing at the right record. Grouping by id would split the link
  // back into the two rows this list exists to stop showing.
  it("collapses the copies of a link into one row, grouping by the link and not the id", () => {
    const rows = pickerListRows([
      copy({ ownerId: "w1", id: "a", linkId: "L1", name: "Porch" }),
      copy({ ownerId: "p1", id: "b", linkId: "L1", name: "Porch" }),
    ], devices);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.copies.map((c) => c.ownerId)).toEqual(["w1", "p1"]);
  });

  it("puts a row's copies in device order", () => {
    const rows = pickerListRows([
      copy({ ownerId: "p1", id: "b", linkId: "L1" }),
      copy({ ownerId: "w2", id: "c", linkId: "L1" }),
      copy({ ownerId: "w1", id: "a", linkId: "L1" }),
    ], devices);
    expect(rows[0]!.copies.map((c) => c.ownerId)).toEqual(["w1", "w2", "p1"]);
  });

  // The phone's copy is the one that is never trimmed: a watch copy can be
  // without the Home Screen sizes, and opening it would save them away.
  it("opens and names a linked row from the phone's copy", () => {
    const rows = pickerListRows([
      copy({ ownerId: "w1", id: "a", linkId: "L1", name: "Porch (watch)" }),
      copy({ ownerId: "p1", id: "b", linkId: "L1", name: "Porch" }),
    ], devices);
    expect(rows[0]!.open.id).toBe("b");
    expect(rows[0]!.name).toBe("Porch");
  });

  it("opens a link with no phone copy from its first device", () => {
    const rows = pickerListRows([
      copy({ ownerId: "w2", id: "c", linkId: "L1" }),
      copy({ ownerId: "w1", id: "a", linkId: "L1" }),
    ], devices);
    expect(rows[0]!.open.ownerId).toBe("w1");
  });

  it("keeps two links apart and treats an empty link as no link", () => {
    const rows = pickerListRows([
      copy({ ownerId: "w1", id: "a", linkId: "L1" }),
      copy({ ownerId: "p1", id: "b", linkId: "L2" }),
      copy({ ownerId: "w2", id: "c", linkId: "" }),
    ], devices);
    expect(rows).toHaveLength(3);
  });

  it("gives every row a key that stays the same across a reload", () => {
    const input = [
      copy({ ownerId: "w1", id: "a", linkId: "L1" }),
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
      copy({ ownerId: "w1", id: "a", linkId: "L1", name: "Zebra", slot: 0 }),
      copy({ ownerId: "p1", id: "a2", linkId: "L1", name: "Zebra", slot: 4 }),
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
  it("keeps a linked row on both of its devices", () => {
    const rows = pickerListRows([
      copy({ ownerId: "w1", id: "a", linkId: "L1", name: "Porch" }),
      copy({ ownerId: "p1", id: "b", linkId: "L1", name: "Porch" }),
      copy({ ownerId: "p1", id: "c", name: "Kitchen" }),
    ], devices);
    expect(rowsOnDevice(rows, "w1").map((r) => r.name)).toEqual(["Porch"]);
    expect(rowsOnDevice(rows, "p1").map((r) => r.name).sort()).toEqual(["Kitchen", "Porch"]);
    expect(rowsOnDevice(rows, "w2")).toEqual([]);
  });
});

describe("rowsOfPeople", () => {
  const rows = pickerListRows([
    copy({ ownerId: "w1", id: "a", name: "Porch" }),
    copy({ ownerId: "w2", id: "b", linkId: "L1", name: "Kitchen" }),
    copy({ ownerId: "p1", id: "c", linkId: "L1", name: "Kitchen" }),
  ], devices);

  it("keeps the rows on any of that person's devices", () => {
    expect(rowsOfPeople(rows, ["w2", "p1"]).map((r) => r.name)).toEqual(["Kitchen"]);
    expect(rowsOfPeople(rows, ["w1"]).map((r) => r.name)).toEqual(["Porch"]);
  });

  // The whole point of one row per complication: a link across a person's
  // watch and phone answers once, not once per device.
  it("counts a linked row once however many of the devices are theirs", () => {
    expect(rowsOfPeople(rows, ["w2", "p1"])).toHaveLength(1);
  });

  it("gives nothing for a person holding nothing", () => {
    expect(rowsOfPeople(rows, [])).toEqual([]);
    expect(rowsOfPeople(rows, ["nobody"])).toEqual([]);
  });
});

describe("person filter keys", () => {
  it("tells a person's key apart from a shape's", () => {
    expect(isPersonFilter(personFilter("p1"))).toBe(true);
    expect(isPersonFilter("all")).toBe(false);
    expect(isPersonFilter("rectangular")).toBe(false);
  });

  it("keys a chip by the person's own key, so two people never collide", () => {
    expect(personFilter("p1")).not.toBe(personFilter("p2"));
  });
});

describe("pickerView", () => {
  const rows = pickerListRows([
    copy({ ownerId: "w1", id: "a", linkId: "L1", name: "Porch", slot: 2 }),
    copy({ ownerId: "p1", id: "b", linkId: "L1", name: "Porch", slot: 0 }),
    copy({ ownerId: "p1", id: "c", name: "Kitchen", slot: 1 }),
    copy({ ownerId: "w1", id: "d", name: "Alarm", slot: 0 }),
  ], devices);

  it("shows every complication once under All", () => {
    expect(pickerView(rows, devices, ALL_DEVICES).map((r) => r.name))
      .toEqual(["Alarm", "Kitchen", "Porch"]);
  });

  it("narrows to a device and keeps that device's seat order", () => {
    expect(pickerView(rows, devices, "p1").map((r) => r.name)).toEqual(["Porch", "Kitchen"]);
    expect(pickerView(rows, devices, "w1").map((r) => r.name)).toEqual(["Alarm", "Porch"]);
  });

  it("gives an empty list for a device holding nothing", () => {
    expect(pickerView(rows, devices, "w2")).toEqual([]);
  });
});

describe("pickerCountText", () => {
  it("says how many cards are showing out of the whole home", () => {
    expect(pickerCountText(6, 9)).toBe("6 of 9");
    expect(pickerCountText(9, 9)).toBe("9 of 9");
    expect(pickerCountText(0, 0)).toBe("0 of 0");
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

  // On nothing and in the library are both "on no device", and they are not
  // the same news: one is a design waiting on the shelf.
  it("names the library when that is the only place a design is", () => {
    expect(rowWhoText([LIBRARY_OWNER_ID], people)).toBe("In the library, on no device");
  });

  // The library is not somebody's, so it is never printed beside a person. A
  // design that somehow has both reads as being on the device.
  it("says nothing about the library beside a person who has a copy", () => {
    expect(rowWhoText([LIBRARY_OWNER_ID, "w1"], people)).toBe("Chen (watch)");
  });
});

describe("the library in the picker's rows", () => {
  const shelf = (over: Partial<PickerCopy<string>> = {}) =>
    copy({ ownerId: LIBRARY_OWNER_ID, id: "lib", ...over });

  it("calls a row shelved only when every copy of it is on the shelf", () => {
    const [only] = pickerListRows([shelf({ linkId: "L1" })], devices);
    expect(isShelvedRow(only!)).toBe(true);
    const [both] = pickerListRows([shelf({ linkId: "L1" }), copy({ ownerId: "w1", id: "a", linkId: "L1" })], devices);
    expect(isShelvedRow(both!)).toBe(false);
    const [device] = pickerListRows([copy({ ownerId: "w1", id: "a" })], devices);
    expect(isShelvedRow(device!)).toBe(false);
  });

  // A design nobody has yet belongs to nobody, so hiding it behind a person's
  // chip would mean the only way to see the shelf is to clear the filter.
  it("shows a shelved row under whichever person's chip is on", () => {
    const rows = pickerListRows([
      shelf({ name: "Draft" }),
      copy({ ownerId: "w1", id: "a", name: "Porch" }),
    ], devices);
    expect(rowsOfPeople(rows, ["w1"]).map((r) => r.name)).toEqual(["Draft", "Porch"]);
    expect(rowsOfPeople(rows, ["p1"]).map((r) => r.name)).toEqual(["Draft"]);
  });
});
