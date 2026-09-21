// Making a record on a device: which devices there are, which seat a new one
// takes, and what the document looks like once it is somebody else's.
//
// A complication is one shape on one kind of device, so nothing here joins two
// records together: every copy is an independent complication from the moment
// it is written. What is left is the small set of rules a copy needs, and they
// are pure so the New dialog and "Duplicate as" can both be read in a test
// without a browser. Plan: app repo docs/complication_one_shape_per_document.md.

import {
  type CustomComplicationConfig,
  type FamilyKind,
  MAX_SLOTS,
  schemaVersionFor,
  seedFamilyFromSibling,
  setControlShown,
} from "./model.js";
import { ALL_FAMILIES, addFamily, dropFamily, isHomeFamily, supportedFamilies } from "./layouts.js";
import { type DeviceKind, LIBRARY_OWNER_ID, MIN_IPHONE_VERSION_FOR_HOME_SCREEN, watchSupportsShapes } from "./version.js";
import { familiesFor, comingSoonFamilies } from "./layouts.js";

// ── the devices a complication can go on ──────────────────────────────────

/**
 * One device, as the dialogs need it.
 *
 * Structural rather than an `OwnerSummary`, so this module never has to know
 * about the websocket types or about how a device's name is built: the panel
 * hands over the name it already draws in the picker.
 */
export interface DeviceOwner {
  ownerId: string;
  /** The name the device list shows, "Jesse's Watch" or "Jesse's iPhone". */
  label: string;
  /** Which device this is. Can be `"library"`, which is not a device at all
   * but the home's shelf: it holds a design that is on nothing yet, so it
   * carries every shape and is never narrowed by an app version. */
  kind: DeviceKind;
  /** The shapes this device's app draws, from `familiesFor`. */
  families: readonly FamilyKind[];
  /** Shapes named but not pickable yet, from `comingSoonFamilies`. */
  comingSoon: readonly FamilyKind[];
  /** Whether its app draws a Control Center control. */
  controls: boolean;
  /** The app version it reported, for the trimming below. */
  appVersion?: string | null;
}

/**
 * The shapes the Library holds, which is every shape a newest watch and a
 * newest phone draw between them.
 *
 * Nothing narrows it, because nothing draws it. A design on the shelf has not
 * been given to a device yet, so trimming it to what some device happens to
 * run today would quietly throw away the shape the moment it went on.
 */
export function libraryFamilies(): FamilyKind[] {
  return familiesFor({ device_kind: "library" });
}

/** The shapes the Library is promised but cannot be given yet, which is
 * whatever the newest phone is promised: a shape coming to any device in the
 * home is coming to the shelf. */
export function libraryComingSoon(): FamilyKind[] {
  return comingSoonFamilies({ device_kind: "library" });
}

/**
 * Where a new complication goes: the ticked devices, or the Library when none
 * is ticked.
 *
 * A design with no device ticked is not a design with nowhere to go, it is a
 * design that lives on the shelf until somebody wants it on a wrist.
 */
export function newTargets(ticked: readonly string[]): string[] {
  return ticked.length > 0 ? [...ticked] : [LIBRARY_OWNER_ID];
}

/** The devices that draw one shape, which is who a shape can be made for. */
export function ownersDrawing(owners: readonly DeviceOwner[], family: FamilyKind): DeviceOwner[] {
  return owners.filter((o) => o.families.includes(family));
}

export function joinNames(names: readonly string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]!}`;
}

/**
 * The shapes a device's record may carry.
 *
 * Not `familiesFor`, which answers what the panel offers this device to build.
 * A copy is trimmed to what its device can draw:
 *
 *   - A phone never carries corner. It is a watch face slot, the widget drops
 *     it on import, and there is nothing on a phone for it to land on.
 *   - A phone below the Home Screen release keeps its three Lock Screen
 *     shapes and loses the tiles, which is the same gate `familiesFor` uses.
 *   - A watch never carries the Home Screen sizes, whatever its version. An
 *     app below the per-shape release fails the whole document on a raw value
 *     it predates (the Swift decoder reads `supportedFamilies` as a
 *     `Set<FamilyKind>`), and an app on that release resolves and archives up
 *     to four tiles it never draws on every timeline entry.
 *   - The Library keeps everything. No app decodes the shelf, so a shape
 *     trimmed off it would be a shape lost for good.
 */
export function familiesKeptFor(owner: Pick<DeviceOwner, "kind" | "appVersion">): FamilyKind[] {
  if (owner.kind === "library") return libraryFamilies();
  if (owner.kind === "iphone") {
    const home = watchSupportsShapes(owner.appVersion, MIN_IPHONE_VERSION_FOR_HOME_SCREEN);
    return ALL_FAMILIES.filter((f) => f !== "corner" && (home || !isHomeFamily(f)));
  }
  return ALL_FAMILIES.filter((f) => !isHomeFamily(f));
}

// ── which seat a new record takes ─────────────────────────────────────────

/** One document already on a device, as the slot rule reads it: where it sits
 * and which shape it draws there. */
export interface SlotHolder {
  slotIndex: number;
  families: readonly FamilyKind[];
}

/**
 * The seat a new complication of this shape takes on one device.
 *
 * A slot holds at most one document per shape. Placed faces and widgets
 * resolve by slot and then by the shape being drawn, so "Kitchen" rectangular
 * and "Kitchen" circular can share seat 5 and both keep drawing. The rule that
 * follows is this one: a seat is free for a shape when nothing of that shape
 * is in it.
 *
 * `blocked` is the seats nothing of ours can share at all: an iPhone preset,
 * or a custom belonging to another home. Those hold the whole seat, since the
 * panel cannot read what shape they draw.
 *
 * A document with no shape (a Control Center control) shares with nothing: it
 * has no shape to be told apart by, so it takes a seat of its own.
 *
 * Returns -1 when the device is full.
 */
export function freeSlotForFamily(
  family: FamilyKind | undefined,
  held: readonly SlotHolder[],
  blocked: Iterable<{ slot: number }> = [],
): number {
  const taken = seatsTaken(family, held, blocked);
  for (let i = 0; i < MAX_SLOTS; i++) if (!taken.has(i)) return i;
  return -1;
}

/** The seats this shape cannot go in on one device. The rule `freeSlotForFamily`
 * and `slotForDuplicate` both read, written once so the two can never disagree
 * about what a free seat is. */
function seatsTaken(
  family: FamilyKind | undefined,
  held: readonly SlotHolder[],
  blocked: Iterable<{ slot: number }>,
): Set<number> {
  const taken = new Set<number>();
  for (const o of blocked) taken.add(o.slot);
  for (const h of held) {
    if (family === undefined || h.families.length === 0 || h.families.includes(family)) taken.add(h.slotIndex);
  }
  return taken;
}

/**
 * The seat a duplicate takes, which is the source's own when it can have it.
 *
 * A "Duplicate as" to another shape on the same device offers `preferred`, the
 * seat the original sits in: a slot holds one document per shape, so a
 * rectangular "Kitchen" at seat 5 and the circular copy made from it can both
 * live there, and a face that later places both shows one name in the same
 * position group. A seat that shape already holds, or one something unreadable
 * holds, falls through to the lowest free one, and so does every cross-device
 * copy, where the source's seat number means nothing.
 */
export function slotForDuplicate(
  family: FamilyKind | undefined,
  held: readonly SlotHolder[],
  blocked: Iterable<{ slot: number }> = [],
  preferred?: number,
): number {
  if (preferred !== undefined && preferred >= 0 && preferred < MAX_SLOTS) {
    if (!seatsTaken(family, held, blocked).has(preferred)) return preferred;
  }
  return freeSlotForFamily(family, held, blocked);
}

/**
 * The devices one design can be duplicated onto.
 *
 * Every device whose app draws this shape, bar the one the design is already
 * on: a second copy of "Kitchen" on the watch it is already on is two of the
 * same name in one picker, and the editor's own Duplicate is where that is
 * asked for. A control has no shape, so what it needs is a device with Control
 * Center. The Library draws nothing and holds everything, so it is always
 * offered: shelving a design is how it comes off a device without being
 * deleted.
 *
 * `sameKind` narrows the devices to one kind, which is what the picker card's
 * menu asks for: a watch design goes to the home's other watches from there,
 * and crossing to a phone is "Duplicate as", where the shape is being chosen
 * anyway. A design on the shelf is on no kind of device at all, so passing
 * `"library"` narrows nothing.
 */
export function duplicateTargets(
  owners: readonly DeviceOwner[],
  family: FamilyKind | undefined,
  fromOwnerId: string,
  sameKind?: DeviceKind,
): DeviceOwner[] {
  return owners.filter((o) => {
    if (o.ownerId === fromOwnerId) return false;
    if (o.kind === "library") return true;
    if (sameKind !== undefined && sameKind !== "library" && o.kind !== sameKind) return false;
    return family === undefined ? o.controls : o.families.includes(family);
  });
}

// ── where one design is, device by device ─────────────────────────────────

/** One stored record as the place list reads it: enough to tell whether it
 * is the same design as the card's, and nothing about what it draws. */
export interface PlaceRecord {
  id: string;
  name: string;
  /** The shapes its document lists; one, or none for a control-only document. */
  families: readonly FamilyKind[];
  control: boolean;
}

/** One device in a card's place list, with a box to tick. */
export interface DevicePlace {
  owner: DeviceOwner;
  /** Whether this is the device the card's own record sits on. */
  self: boolean;
  /** The other records on this device that are this design: same name, same
   * shape. The card's own record is never in here. */
  copies: PlaceRecord[];
  /** Whether the box is ticked: the card's own device, or one with a copy. */
  on: boolean;
  /** Whether this device's app draws the shape, so a copy could be written
   * there. A device of the right kind that cannot is still listed, greyed,
   * so the household sees every device rather than wondering where one went. */
  draws: boolean;
}

/** Whether two records are one design in two places: the same name, letter
 * case and outer spaces aside, drawing the same shape. Nothing links a copy to
 * what it was copied from, so the name and the shape are what there is. */
export function sameDesign(a: PlaceRecord, name: string, family: FamilyKind | undefined): boolean {
  if (a.name.trim().toLocaleLowerCase() !== name.trim().toLocaleLowerCase()) return false;
  return family === undefined ? a.control && a.families.length === 0 : a.families.includes(family);
}

/**
 * The card's place list: every device this design could be on, each saying
 * whether it is.
 *
 * The same devices `duplicateTargets` offers, plus the one the card is on, so
 * the list reads as a set of boxes rather than a set of destinations. A box
 * is ticked for the card's own device, and for any device holding a record
 * with this name and shape. Ticking writes a copy there; unticking removes
 * that device's copy, or unassigns the card's own record when it is the
 * card's device. The library is always in the list, since it is where an
 * unassigned design goes.
 *
 * `recordsOn` answers each device's live records. A device whose list the
 * panel has not read answers none, so it reads as unticked until it has.
 */
export function devicePlaces(
  owners: readonly DeviceOwner[],
  family: FamilyKind | undefined,
  from: { ownerId: string; id: string; name: string },
  recordsOn: (ownerId: string) => readonly PlaceRecord[],
  sameKind?: DeviceKind,
): DevicePlace[] {
  const writable = duplicateTargets(owners, family, from.ownerId, sameKind);
  // Every device of the kind, drawing this shape or not, and the library.
  const listed = owners.filter((o) =>
    o.ownerId === from.ownerId
    || o.kind === "library"
    || sameKind === undefined || sameKind === "library" || o.kind === sameKind);
  return listed.map((owner) => {
    const copies = recordsOn(owner.ownerId)
      .filter((r) => r.id !== from.id || owner.ownerId !== from.ownerId)
      .filter((r) => sameDesign(r, from.name, family));
    const isSelf = owner.ownerId === from.ownerId;
    return { owner, self: isSelf, copies, on: isSelf || copies.length > 0, draws: isSelf || writable.includes(owner) };
  });
}

// ── the document one device gets ──────────────────────────────────────────

/** What one write is: the identity of the record and the shapes it carries.
 * The document itself comes from `copyForOwner`. */
export interface CopyWrite {
  ownerId: string;
  label: string;
  id: string;
  slotIndex: number;
  hidden: boolean;
  baseRevision: number | null;
  families: FamilyKind[];
}

/**
 * The document one device gets: the whole complication, minus the shapes this
 * copy does not carry, wearing this copy's identity.
 *
 * The shapes go the way the editor's own remove goes, layers and all, so a
 * trimmed copy is a complete document rather than a set that names a layout
 * nothing draws. This is what "Duplicate as" is built on.
 */
export function copyForOwner(
  cfg: CustomComplicationConfig,
  write: Pick<CopyWrite, "id" | "slotIndex" | "hidden" | "families">,
): CustomComplicationConfig {
  const next = structuredClone(cfg);
  for (const family of supportedFamilies(next)) {
    if (!write.families.includes(family)) dropFamily(next, family);
  }
  next.id = write.id;
  next.slotIndex = write.slotIndex;
  if (write.hidden) next.hidden = true;
  else delete next.hidden;
  next.schemaVersion = schemaVersionFor(next);
  return next;
}

// ── duplicate as another shape, or onto another device ────────────────────

/** Where one duplicate lands: the record it becomes on the device it is going
 * to. The shape it takes is `duplicateAs`'s own argument, since that is the
 * question the dialog asks first. */
export interface DuplicateWrite {
  /** The id the new record takes. Fresh: a duplicate is its own complication
   * from the moment it is written. */
  id: string;
  /** Its seat on the target device, from `slotForDuplicate`. */
  slotIndex: number;
  /** Whether it arrives hidden from that device's own list. A duplicate is
   * something the author just asked for, so it does not by default. */
  hidden?: boolean;
}

/**
 * One complication as another shape, or on another device, or both.
 *
 * The whole design travels: the layers, the data sources, the rules, the tap
 * action, the pages and the Control Center control. Only the shape is new, and
 * a new shape is filled the way the editor used to fill one that was added,
 * from the shape in the document worth copying: Small from Circular, Medium
 * from Rectangular, anything else from the widest shape there is, every frame
 * refitted for the canvas it lands on.
 *
 * The result has exactly one shape, or none with a control, because that is
 * what a complication is. `toFamily` undefined asks for the control-only form,
 * and a design that had no control gets the default one rather than a document
 * that shows nowhere.
 *
 * Nothing links the copy to the original. They are two complications from here
 * on, and editing one never touches the other. The document passed in is never
 * touched. Plan: app repo docs/complication_one_shape_per_document.md.
 */
export function duplicateAs(
  cfg: CustomComplicationConfig,
  toFamily: FamilyKind | undefined,
  write: DuplicateWrite,
): CustomComplicationConfig {
  const next = structuredClone(cfg);
  if (toFamily === undefined) {
    setControlShown(next, true);
  } else if (!next.supportedFamilies.includes(toFamily)) {
    addFamily(next, toFamily);
    seedFamilyFromSibling(next, toFamily);
  }
  // Every other shape goes the way the editor's own remove goes, layers and
  // all, which is what makes this a document of one shape rather than the
  // original with one more shape on it.
  return copyForOwner(next, {
    id: write.id,
    slotIndex: write.slotIndex,
    hidden: write.hidden === true,
    families: toFamily === undefined ? [] : [toFamily],
  });
}
