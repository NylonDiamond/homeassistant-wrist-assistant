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
 * What a write says when it cannot see what a device already holds.
 *
 * A device whose list did not come back has no seats the panel can read, so
 * every seat looks free and a copy lands in seat 0 on top of whatever is
 * already there. That is how a tester ended up with four phone copies showing
 * as one row. The write refuses instead of guessing, and says to try again,
 * because the next fetch usually answers.
 */
export function unreadableRefusal(names: readonly string[]): string {
  return `${joinNames(names)} could not be read just now, so nothing was saved. Try again in a moment.`;
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
 * The holders one device shows the seat rule, given whether that device's app
 * can share a seat at all.
 *
 * Seat sharing is a promise about the app on the other end, not about the
 * store. A face placed on 2.8.0 build 11 or later resolves a slot by shape, so
 * two documents can sit in seat 5 and each draws where it belongs. Every older
 * app resolves the first document at the slot whatever shape it draws, so a
 * shared seat there is a face that quietly draws the wrong design, or prints
 * "No circular layout" where it used to draw fine.
 *
 * So `canShare` is `ownerCanSplit(owner)` from splitShapes.ts, the same gate
 * the one-time split runs behind. When it is false every held seat is reported
 * as holding the whole seat, which is what a holder with no shapes means, and
 * nothing of ours ever joins one. The Library passes: nothing draws the shelf,
 * so there is no resolver to get it wrong.
 */
export function seatHoldersFor(held: readonly SlotHolder[], canShare: boolean): SlotHolder[] {
  if (canShare) return [...held];
  return held.map((h) => ({ slotIndex: h.slotIndex, families: [] }));
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
 * That only holds on an app that resolves by shape. `held` must already have
 * been through `seatHoldersFor`, which collapses every holder to a whole seat
 * on a device below the gate, so nothing here has to know the app version.
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
 * about what a free seat is. A holder that names no shape holds the whole
 * seat, which is both how a control is held and how `seatHoldersFor` reports
 * every holder on a device whose app cannot resolve by shape. */
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
 *
 * Same rule about `held` as `freeSlotForFamily`: it comes from
 * `seatHoldersFor`, so on a device whose app cannot resolve by shape every
 * held seat is a whole seat and the preferred one is never shared into.
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

/** One copy of a design as the place list reads it: which device, which
 * record. */
export interface PlaceCopy {
  ownerId: string;
  id: string;
}

/** One device in a card's place list, with a box to tick. */
export interface DevicePlace {
  owner: DeviceOwner;
  /** The copies of this design on this device. One, as a rule; a link never
   * puts two on one device, but a list is what a reader walks. */
  copies: PlaceCopy[];
  /** Whether the box is ticked: the design has a copy here. */
  on: boolean;
  /** Whether this device's app draws the shape, so a copy could be written
   * there. A device of the right kind that cannot is still listed, greyed,
   * so the household sees every device rather than wondering where one went. */
  draws: boolean;
  /** Whether unticking here would take the design's last copy off every
   * device. That copy is moved to the library rather than deleted. */
  last: boolean;
}

/** The kind of device a design stands on, read off its copies: the first
 * device that is not the library, or the library when it is on nothing. */
export function designKind(copies: readonly PlaceCopy[], kindOf: (ownerId: string) => DeviceKind | undefined): DeviceKind {
  for (const c of copies) {
    const kind = kindOf(c.ownerId);
    if (kind !== undefined && kind !== "library") return kind;
  }
  return "library";
}

/**
 * The card's place list: every device this design could be on, each saying
 * whether it is.
 *
 * A design is its linked copies, one record per device, so a box is ticked
 * exactly where the link has a copy. Ticking writes a linked copy there;
 * unticking removes that device's copy, or moves the last one to the library.
 * The devices listed are the ones of the design's own kind, drawing this
 * shape or not, plus the library, which is where an unassigned design goes.
 * A watch design goes to the home's other watches from here; crossing to a
 * phone is "Duplicate as", where the shape is being chosen anyway. A design
 * on the shelf alone is on no kind of device, so every device is listed.
 * So is a control (no `family`): it has no shape to choose, and Control
 * Center on a watch and on an iPhone takes the same document.
 */
export function devicePlaces(
  owners: readonly DeviceOwner[],
  family: FamilyKind | undefined,
  copies: readonly PlaceCopy[],
  kind: DeviceKind,
): DevicePlace[] {
  const anyKind = kind === "library" || family === undefined;
  const listed = owners.filter((o) => o.kind === "library" || anyKind || o.kind === kind);
  return listed.map((owner) => {
    const here = copies.filter((c) => c.ownerId === owner.ownerId);
    const draws = owner.kind === "library"
      || (family === undefined ? owner.controls : owner.families.includes(family));
    return {
      owner,
      copies: here,
      on: here.length > 0,
      draws,
      last: here.length > 0 && here.length === copies.length,
    };
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

// ── linked copies: one design on several devices ──────────────────────────

/**
 * The same design on one more device, joined to the link.
 *
 * The whole document, the same shape, wearing the new record's id and seat
 * and carrying the link's uuid. Not hidden: the author just asked for it.
 * `link` is the design's link, or a fresh one when this is its first copy;
 * the caller writes that fresh link onto the original too.
 */
export function linkedCopy(
  cfg: CustomComplicationConfig,
  link: string,
  write: { id: string; slotIndex: number },
): CustomComplicationConfig {
  const next = copyForOwner(cfg, {
    id: write.id,
    slotIndex: write.slotIndex,
    hidden: false,
    families: [...cfg.supportedFamilies],
  });
  next.linkId = link;
  return next;
}

/**
 * A saved edit as one linked sibling should store it.
 *
 * Everything travels but what is that sibling's own: its record id, its seat
 * on its device, and its hidden flag. The link stays. This is what a save
 * of one copy writes to each of the others.
 */
export function linkedDocumentFor(
  saved: CustomComplicationConfig,
  sibling: { id: string; slotIndex: number; hidden: boolean },
): CustomComplicationConfig {
  const next = structuredClone(saved);
  next.id = sibling.id;
  next.slotIndex = sibling.slotIndex;
  if (sibling.hidden) next.hidden = true;
  else delete next.hidden;
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
 * The mirror of that: asking for a shape drops the source's control. A control
 * is its own document, and a copy that kept both would be two parts in one
 * document, which is exactly what `autoSplitShapes` cuts apart on the next
 * open. Duplicating a control as a shape therefore gives a plain shape, and
 * the control stays where it was.
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
  // A duplicate is a design of its own: it never joins the link its source
  // is in. A linked copy is written by `linkedCopy`, not by this.
  delete next.linkId;
  if (toFamily === undefined) {
    setControlShown(next, true);
  } else {
    delete next.control;
    if (!next.supportedFamilies.includes(toFamily)) {
      addFamily(next, toFamily);
      seedFamilyFromSibling(next, toFamily);
    }
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
