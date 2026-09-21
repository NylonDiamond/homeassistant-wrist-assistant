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
} from "./model.js";
import { ALL_FAMILIES, dropFamily, isHomeFamily, supportedFamilies } from "./layouts.js";
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
  const taken = new Set<number>();
  for (const o of blocked) taken.add(o.slot);
  for (const h of held) {
    if (family === undefined || h.families.length === 0 || h.families.includes(family)) taken.add(h.slotIndex);
  }
  for (let i = 0; i < MAX_SLOTS; i++) if (!taken.has(i)) return i;
  return -1;
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
