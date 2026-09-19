// The picker lists every complication this home holds in one list, with the
// copies of a linked complication collapsed to one row. These are the pure
// parts of that: what the rows are, what order they come in, and what the line
// under them says.

import { describe, expect, it } from "vitest";

import {
  ALL_DEVICES,
  type PickerCopy,
  type PickerDevice,
  pickerFootText,
  pickerListRows,
  pickerView,
  rowsOnDevice,
  sortPickerRows,
} from "../src/pickerRows.js";

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

describe("pickerFootText", () => {
  it("counts the home, each linked complication once", () => {
    expect(pickerFootText(12)).toBe("12 complications");
    expect(pickerFootText(1)).toBe("1 complication");
    expect(pickerFootText(0)).toBe("0 complications");
  });
});
