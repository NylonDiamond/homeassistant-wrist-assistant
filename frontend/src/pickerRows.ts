// The picker's one list: every complication this home holds, on whichever
// device draws it, one card each. A complication is one record on one device,
// so a row is a record.
//
// The device is a tab over the grid rather than a folder to be opened first.
// The picker used to open on a pane of devices down the left and one device's
// complications down the right, so seeing what the home had at all meant
// walking the devices one by one. "All" is the first tab and shows every
// device at once, each under its own heading; the other tabs are that same
// grid narrowed to one device, for the household that knows which watch it
// means.
//
// Everything in this module is pure: it takes the copies the panel has already
// read off the devices and says which rows they make, in what order, which
// section or tab each one belongs to, and what the line under them says.

import { LIBRARY_OWNER_ID, type DeviceKind } from "./version.js";

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

/** The tab key that means every device, which is the tab the picker opens on. */
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
 * The copies as rows, one each.
 *
 * A complication is one record on one device, so nothing is grouped: two
 * people's watches showing "Kitchen" are two complications and read as two
 * cards. The list used to join the copies of a link into one row, which is
 * what one shape per complication did away with.
 *
 * `copies` stays a list because every reader of a row walks it, and because a
 * card still draws the devices its one copy sits on.
 */
export function pickerListRows<T>(
  copies: readonly PickerCopy<T>[],
  devices: readonly PickerDevice[],
): PickerListRow<T>[] {
  const rows: PickerListRow<T>[] = [];
  for (const copy of copies) {
    rows.push({ key: `rec:${copy.ownerId}\u0000${copy.id}`, name: copy.name, copies: [copy], open: copy });
  }
  return rows;
}

/** The rows one device draws. */
export function rowsOnDevice<T>(rows: readonly PickerListRow<T>[], ownerId: string): PickerListRow<T>[] {
  return rows.filter((row) => row.copies.some((c) => c.ownerId === ownerId));
}

/**
 * Whether every copy of this row sits in the home's library.
 *
 * That is a design on no device at all: the library is the home's shelf, not
 * somebody's watch. It reads in two places, the section a card falls under and
 * the dashed device its card is drawn on, so the question is asked once here.
 */
export function isShelvedRow<T>(row: PickerListRow<T>): boolean {
  return row.copies.length > 0 && row.copies.every((c) => c.ownerId === LIBRARY_OWNER_ID);
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

/** The list a tab asks for: every row, or one device's, in that view's own
 * order. */
export function pickerView<T>(
  rows: readonly PickerListRow<T>[],
  devices: readonly PickerDevice[],
  filter: string,
): PickerListRow<T>[] {
  if (filter === ALL_DEVICES) return sortPickerRows(rows, devices);
  return sortPickerRows(rowsOnDevice(rows, filter), devices, filter);
}

/** Whether a device is the home's shelf rather than somebody's watch. */
function isShelf(device: PickerDevice): boolean {
  return device.kind === "library" || device.ownerId === LIBRARY_OWNER_ID;
}

/**
 * The devices in the order the tabs and the sections take them.
 *
 * Whatever order the home's device list arrives in, the shelf goes last: it
 * is where a design waits rather than a place it is, so it reads after every
 * device that has one.
 */
function inTabOrder(devices: readonly PickerDevice[]): PickerDevice[] {
  return [...devices.filter((d) => !isShelf(d)), ...devices.filter(isShelf)];
}

/** One tab over the grid: every device, one device, or the library. `kind` is
 * what glyph it wears, and "all" is the tab that is no device. */
export interface PickerTab {
  key: string;
  label: string;
  kind: DeviceKind | "all";
  count: number;
}

/**
 * The tabs over the grid, with how many cards each one holds.
 *
 * "All" first, because the whole home is the question this surface exists to
 * answer; then a tab per device in the home's own order; then the library,
 * which is where a design with no device waits. A count on every tab so an
 * empty one says so before it is opened.
 *
 * A home whose integration is older than the library has no shelf, and gets
 * no Library tab rather than an empty one that can never fill.
 */
export function pickerTabs<T>(
  rows: readonly PickerListRow<T>[],
  devices: readonly PickerDevice[],
): PickerTab[] {
  const tabs: PickerTab[] = [{ key: ALL_DEVICES, label: "All", kind: "all", count: rows.length }];
  for (const device of inTabOrder(devices)) {
    tabs.push({
      key: device.ownerId,
      label: isShelf(device) ? "Library" : device.label,
      kind: device.kind,
      count: rowsOnDevice(rows, device.ownerId).length,
    });
  }
  return tabs;
}

/** One device's block of the All tab: the heading it wears and the cards
 * under it, in that device's own seat order. */
export interface PickerSection<T> {
  ownerId: string;
  label: string;
  kind: DeviceKind;
  rows: PickerListRow<T>[];
}

/**
 * The All tab, cut into one section per device.
 *
 * The same order the tabs are in, so the two views of this grid read as one
 * surface: a device is in the same place whichever way the picker is being
 * used. Every device gets a section whether or not it holds anything, since
 * an empty watch is a fact worth printing; the library's is dropped by the
 * caller when the shelf is bare, because a shelf nobody has used yet is not.
 */
export function pickerSections<T>(
  rows: readonly PickerListRow<T>[],
  devices: readonly PickerDevice[],
): PickerSection<T>[] {
  return inTabOrder(devices).map((device) => ({
    ownerId: device.ownerId,
    label: isShelf(device) ? "Library" : device.label,
    kind: device.kind,
    rows: sortPickerRows(rowsOnDevice(rows, device.ownerId), devices, device.ownerId),
  }));
}

/** One person as a card's who-line reads them: the name to print, and the
 * devices of theirs a copy could sit on. Structural rather than `Person`, so
 * this module goes on knowing nothing about the websocket types. */
export interface PickerPerson {
  label: string;
  devices: readonly { ownerId: string; kind: DeviceKind }[];
}

/** What one device is called inside the brackets after a person's name. The
 * short word, not the device's own name: "Jesse (watch, iPhone)" says whose
 * and which in five words, where "Jesse Apple Watch, Jesse's iPhone" says the
 * name twice and the useful part once. */
function deviceWord(kind: DeviceKind): string {
  return kind === "iphone" ? "iPhone" : "watch";
}

/**
 * Where one complication sits, in words.
 *
 * "Jesse (watch, iPhone) · Chen (watch)": people first, their devices in
 * brackets, in the order the household list draws them.
 *
 * The cards no longer print it, since the section or tab a card is under
 * already says whose device it is. It is what the search field reads: "chen"
 * is as reasonable a thing to type as "porch", and neither is the other's
 * field.
 *
 * A person with none of the copies is left out rather than printed empty, and
 * a complication on nothing at all says so in words: an empty line would read
 * as a card that failed to load.
 *
 * A design in the library is on nothing too, and says which nothing it is: it
 * is waiting on the home's shelf rather than half made. The library is never
 * named beside a person, so a design that somehow has both a device copy and a
 * shelf copy reads as being on the device.
 */
export function rowWhoText(ownerIds: readonly string[], people: readonly PickerPerson[]): string {
  const on = new Set(ownerIds);
  const parts: string[] = [];
  for (const person of people) {
    const mine = person.devices.filter((d) => on.has(d.ownerId));
    if (mine.length === 0) continue;
    parts.push(`${person.label} (${mine.map((d) => deviceWord(d.kind)).join(", ")})`);
  }
  if (parts.length > 0) return parts.join(" · ");
  return on.has(LIBRARY_OWNER_ID) ? "In the library, on no device" : "On no device yet";
}
