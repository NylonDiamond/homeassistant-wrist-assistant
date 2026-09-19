// The picker's one list: every complication this home holds, on whichever
// device draws it, with the copies of a linked complication collapsed into one
// row.
//
// The device used to be a folder. The picker opened on a pane of devices down
// the left and one device's complications down the right, so a complication
// linked across a watch and a phone appeared twice, was counted twice, and read
// as two things to keep in step. It is one thing. So the device is a property
// of a row here (the icons it carries, and the chip that narrows the list to
// it) rather than the question that has to be answered before anything can be
// seen at all.
//
// Everything in this module is pure: it takes the copies the panel has already
// read off the devices and says which rows they make, in what order, and what
// the line under them says.

import type { DeviceKind } from "./version.js";

/** One device, as the list knows it: the id its copies carry, the name the
 * chips and tooltips call it, and which glyph stands for it. */
export interface PickerDevice {
  ownerId: string;
  label: string;
  kind: DeviceKind;
}

/**
 * One complication on one device.
 *
 * `item` is whatever the panel needs to draw the row with (a stored record, or
 * a slot something else holds), kept opaque so this module never has to know
 * what a complication is made of.
 */
export interface PickerCopy<T> {
  ownerId: string;
  /** The record's id on that device, or a stable stand-in for a locked slot. */
  id: string;
  /** Its seat on that device, which is the order that device's own list is in. */
  slot: number;
  name: string;
  /** The link this copy belongs to, upper-cased as `linkIdOf` gives it.
   * Undefined for a complication that lives on one device, which is most. */
  linkId?: string;
  item: T;
}

/** One row of the list: one complication, however many devices draw it. */
export interface PickerListRow<T> {
  /** Stable across renders, so a row keeps its place while a list reloads. */
  key: string;
  name: string;
  /** Every device this complication lives on, in device order. */
  copies: PickerCopy<T>[];
  /** The copy the row draws and opens. */
  open: PickerCopy<T>;
}

/** The filter key that means every device, which is the only view now. */
export const ALL_DEVICES = "all";

function deviceIndex(devices: readonly PickerDevice[], ownerId: string): number {
  const i = devices.findIndex((d) => d.ownerId === ownerId);
  // A copy on a device this home no longer lists sorts last rather than first.
  return i < 0 ? devices.length : i;
}

/** Names compare without case, so "porch" and "Porch" sit together instead of
 * every capital leading every lower-case name. */
function byName(a: string, b: string): number {
  const x = a.toLocaleLowerCase();
  const y = b.toLocaleLowerCase();
  return x < y ? -1 : x > y ? 1 : 0;
}

/**
 * The copies grouped into rows.
 *
 * Grouped by `linkId` and never by record id: the copies of a link keep
 * different ids on purpose, so placed faces and widgets go on pointing at the
 * right record. A copy with no link is its own row.
 *
 * The row draws and opens the phone's copy when the link has one, for the same
 * reason `openCopyOf` does: a watch copy can be without the Home Screen sizes
 * (an older watch app cannot decode them), and opening that one would show a
 * design with its tiles missing and then save them away.
 */
export function pickerListRows<T>(
  copies: readonly PickerCopy<T>[],
  devices: readonly PickerDevice[],
): PickerListRow<T>[] {
  const kinds = new Map(devices.map((d) => [d.ownerId, d.kind]));
  const groups = new Map<string, PickerCopy<T>[]>();
  for (const copy of copies) {
    const key = copy.linkId !== undefined && copy.linkId !== ""
      ? `link:${copy.linkId}`
      : `rec:${copy.ownerId}\u0000${copy.id}`;
    const hit = groups.get(key);
    if (hit) hit.push(copy);
    else groups.set(key, [copy]);
  }
  const rows: PickerListRow<T>[] = [];
  for (const [key, group] of groups) {
    const ordered = [...group].sort((a, b) =>
      deviceIndex(devices, a.ownerId) - deviceIndex(devices, b.ownerId) || a.slot - b.slot);
    const first = ordered[0];
    if (!first) continue;
    const open = ordered.find((c) => kinds.get(c.ownerId) === "iphone") ?? first;
    rows.push({ key, name: open.name, copies: ordered, open });
  }
  return rows;
}

/** The rows one device draws. A linked row belongs to every device it lives
 * on, so it answers to either chip. */
export function rowsOnDevice<T>(rows: readonly PickerListRow<T>[], ownerId: string): PickerListRow<T>[] {
  return rows.filter((row) => row.copies.some((c) => c.ownerId === ownerId));
}

/** The one device every row in a list sits on, when there is one. That is a
 * home with a single device, and a device chip's own list. */
function soleOwnerOf<T>(rows: readonly PickerListRow<T>[]): string | undefined {
  let only: string | undefined;
  for (const row of rows) {
    for (const copy of row.copies) {
      if (only === undefined) only = copy.ownerId;
      else if (only !== copy.ownerId) return undefined;
    }
  }
  return only;
}

/**
 * The rows in the order the list draws them.
 *
 * One device's list keeps the order it has always had, which is the seat order
 * the device itself shows. Across devices a seat number says nothing (two
 * devices both have a slot 0), so the names lead, and two complications sharing
 * a name fall back to the device order the rest of the panel uses.
 */
export function sortPickerRows<T>(
  rows: readonly PickerListRow<T>[],
  devices: readonly PickerDevice[],
  ownerId?: string,
): PickerListRow<T>[] {
  const one = ownerId ?? soleOwnerOf(rows);
  const seat = (row: PickerListRow<T>, id: string) =>
    row.copies.find((c) => c.ownerId === id)?.slot ?? Number.MAX_SAFE_INTEGER;
  if (one !== undefined) {
    return [...rows].sort((a, b) => seat(a, one) - seat(b, one) || byName(a.name, b.name));
  }
  return [...rows].sort((a, b) =>
    byName(a.name, b.name)
    || deviceIndex(devices, a.copies[0]?.ownerId ?? "") - deviceIndex(devices, b.copies[0]?.ownerId ?? "")
    || a.open.slot - b.open.slot);
}

/** The list a chip asks for: every row, or one device's, in that view's own
 * order. */
export function pickerView<T>(
  rows: readonly PickerListRow<T>[],
  devices: readonly PickerDevice[],
  filter: string,
): PickerListRow<T>[] {
  if (filter === ALL_DEVICES) return sortPickerRows(rows, devices);
  return sortPickerRows(rowsOnDevice(rows, filter), devices, filter);
}

/**
 * The line under the list.
 *
 * "12 complications" counts the whole home, each linked complication once,
 * because that is how many there are to keep in step. No device is named: with
 * every device in one list there is no "this iPhone" to point at. (Device chips
 * that narrowed the list existed for one evening, 2026-09-19, and went; the row
 * icons say where each complication lives.)
 */
export function pickerFootText(count: number): string {
  return `${count} complication${count === 1 ? "" : "s"}`;
}
