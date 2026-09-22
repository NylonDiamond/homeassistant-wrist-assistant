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
  /** The uuid this copy shares with the same design on other devices, when
   * it is on more than one. Absent on a copy that is on its own. */
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

/** The key a row of one link has, and a lone copy's, so a menu held open by
 * key can follow a design as it gains its first link. */
export function rowKeyFor(copy: { ownerId: string; id: string; linkId?: string }): string {
  return copy.linkId !== undefined && copy.linkId !== ""
    ? `link:${copy.linkId}`
    : `rec:${copy.ownerId}\u0000${copy.id}`;
}

/**
 * The copies as rows: one per design.
 *
 * A design on several devices is one record per device, each carrying the
 * same `linkId`, and reads as one card: the list groups by that link, never
 * by record id, since the copies keep different ids on purpose so placed
 * faces and widgets go on pointing at the right one. A copy with no link is
 * its own row. Two people's watches each holding their own "Kitchen", made
 * separately, are two rows.
 *
 * The row draws and opens the copy on `preferOwnerId` when the link has one,
 * which is the device the panel has up: opening it needs no device switch.
 * Otherwise the first copy in device order.
 */
export function pickerListRows<T>(
  copies: readonly PickerCopy<T>[],
  devices: readonly PickerDevice[],
  preferOwnerId?: string,
): PickerListRow<T>[] {
  const groups = new Map<string, PickerCopy<T>[]>();
  for (const copy of copies) {
    const key = rowKeyFor(copy);
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
    const open = ordered.find((c) => c.ownerId === preferOwnerId) ?? first;
    rows.push({ key, name: open.name, copies: ordered, open });
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

/** What the home's shelf is called wherever anyone reads it. The owner kind
 * stays `library` everywhere in the code; this is the one word for it on
 * screen, and a design kept there is on no device rather than filed away. */
export const UNASSIGNED_LABEL = "Unassigned";

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
      label: isShelf(device) ? UNASSIGNED_LABEL : device.label,
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
    label: isShelf(device) ? UNASSIGNED_LABEL : device.label,
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
  return on.has(LIBRARY_OWNER_ID) ? "Unassigned, on no device" : "On no device yet";
}

/**
 * Which person a device belongs to, by their place in the household list.
 *
 * The picker gives every person a color of their own, and both of that
 * person's tabs wear it: a household reads its own row of tabs by hue before
 * it reads the names. The index is the person's place in the list the panel
 * already draws them in, so the color a person has is the same on every visit
 * and does not move when somebody else's watch is added.
 *
 * -1 for a device nobody owns, which is the shelf and an orphan: those keep
 * the accent rather than borrowing a person's color.
 */
export function personIndex(people: readonly PickerPerson[], ownerId: string): number {
  return people.findIndex((person) => person.devices.some((d) => d.ownerId === ownerId));
}

/** How many colors the palette holds. A seventh person starts the six again
 * rather than going uncolored. */
export const PERSON_COLORS = 6;

/**
 * The custom property holding one person's color, ready to be set on a tab.
 *
 * Undefined for a device that is nobody's, which is what leaves the tab on
 * the accent: the CSS reads `var(--pk-person, var(--wa-accent))`, so a tab
 * with nothing set is the accent without a rule of its own.
 */
export function personColorVar(index: number): string | undefined {
  if (index < 0) return undefined;
  return `var(--wa-person-${(index % PERSON_COLORS) + 1})`;
}

// ── shape groups and person bands ─────────────────────────────────────────
//
// One device's block used to be one flat grid of every shape that device
// draws, which in a watch holding twenty-three complications means rectangular
// cards, circular cards and inline cards shuffled together in name order. The
// two layers below cut that block up: the cards by the shape they draw, and
// the blocks themselves by whose devices they are.

/** One shape's box inside a device's block: what the box is called, and the
 * cards in it. `key` is the shape itself, so a box keeps its identity while
 * the list reloads. */
export interface PickerShapeGroup<T> {
  key: string;
  label: string;
  rows: PickerListRow<T>[];
}

/**
 * One device's rows cut into a box per shape.
 *
 * `shapeOf` is what reads a row's shape, which lives with the panel: this
 * module keeps knowing nothing about what a complication is made of. It
 * answers the key to group by and the words over the box.
 *
 * `order` is the order the boxes come in, by key. A shape the caller did not
 * list sorts last, in the order it was first met, so a shape added to the app
 * before it is added to that list still gets a box rather than disappearing.
 * Inside a box the rows keep the order they arrived in, which is the order the
 * list was already sorted into.
 */
export function pickerShapeGroups<T>(
  rows: readonly PickerListRow<T>[],
  shapeOf: (row: PickerListRow<T>) => { key: string; label: string },
  order: readonly string[],
): PickerShapeGroup<T>[] {
  const groups = new Map<string, PickerShapeGroup<T>>();
  for (const row of rows) {
    const { key, label } = shapeOf(row);
    const hit = groups.get(key);
    if (hit) hit.rows.push(row);
    else groups.set(key, { key, label, rows: [row] });
  }
  const rank = (key: string) => {
    const i = order.indexOf(key);
    return i < 0 ? order.length : i;
  };
  return [...groups.values()].sort((a, b) => rank(a.key) - rank(b.key));
}

/**
 * One person's band of the All tab: their name, and their devices' blocks.
 *
 * A band with `personIndex` of -1 is the devices that are nobody's, which is
 * Unassigned and any orphan. Those keep no name over them: "Unassigned" is
 * already the heading of the only block in it, and a band labelled for nobody
 * would read as a person called nothing.
 */
export interface PickerBand<T> {
  key: string;
  label: string;
  personIndex: number;
  sections: PickerSection<T>[];
}

/**
 * The sections grouped under the person who owns them.
 *
 * The sections keep the order they came in, and a band takes the place of its
 * first section, so the bands read down the page in the same order the device
 * tabs read across it. A person's second device follows their first however
 * far apart the home's own device list put them: that grouping is the whole
 * point of the band.
 */
export function pickerBands<T>(
  sections: readonly PickerSection<T>[],
  people: readonly PickerPerson[],
  labelOf: (index: number) => string,
): PickerBand<T>[] {
  const bands: PickerBand<T>[] = [];
  for (const section of sections) {
    const index = personIndex(people, section.ownerId);
    const key = index < 0 ? "none" : `who:${index}`;
    const hit = bands.find((b) => b.key === key);
    if (hit) hit.sections.push(section);
    else bands.push({ key, label: index < 0 ? "" : labelOf(index), personIndex: index, sections: [section] });
  }
  return bands;
}
