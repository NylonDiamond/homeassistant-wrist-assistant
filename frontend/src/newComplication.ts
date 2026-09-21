// The New complication dialog, as four questions with pure answers.
//
// A complication is one shape on one kind of device, so the dialog asks for
// exactly that: a name, a device kind, one shape, and whose devices get a copy.
// Everything here is a function over the home's devices, so the wording and the
// refusals can be read in a test without a browser. Plan: app repo
// docs/complication_one_shape_per_document.md.

import type { DeviceOwner } from "./copies.js";
import { ALL_FAMILIES, comingSoonFamilies, familiesFor, isHomeFamily } from "./layouts.js";
import type { FamilyKind } from "./model.js";
import { familyTitle } from "./renderer.js";

/** What step 2 asks for: a device, or Control Center, which is a complication
 * with no shape at all. */
export type NewKind = "watch" | "iphone" | "control";

/** The three choices in the order they are drawn, watch first because that is
 * where these designs are built. */
export const NEW_KINDS: readonly NewKind[] = ["watch", "iphone", "control"];

export function kindTitle(kind: NewKind): string {
  switch (kind) {
    case "watch": return "Watch";
    case "iphone": return "iPhone";
    case "control": return "Control Center";
  }
}

export function kindNote(kind: NewKind): string {
  switch (kind) {
    case "watch": return "A watch face slot.";
    case "iphone": return "The Lock Screen or the Home Screen.";
    case "control": return "A toggle or a button, and no shape to draw.";
  }
}

/** The devices one choice is about: the devices of that kind, or every device
 * that draws a Control Center control. */
export function kindOwners(owners: readonly DeviceOwner[], kind: NewKind): DeviceOwner[] {
  if (kind === "control") return owners.filter((o) => o.controls);
  return owners.filter((o) => o.kind === kind);
}

/**
 * The choices this home is offered.
 *
 * A kind nobody in the home has is left out rather than drawn dead. A home
 * with no device the panel can write to is offered the watch and the iPhone
 * anyway: the design is made in the library and waits there for a device.
 */
export function kindChoices(owners: readonly DeviceOwner[]): NewKind[] {
  const had = NEW_KINDS.filter((kind) => kindOwners(owners, kind).length > 0);
  return had.length > 0 ? [...had] : ["watch", "iphone"];
}

/** One heading in the shape grid. A watch has one, an iPhone has two because
 * its Lock Screen and its Home Screen are different places to put a thing. */
export interface ShapeGroup {
  key: "watch" | "lock" | "home";
  title: string;
  /** The shapes offered here, in the panel's order. */
  families: FamilyKind[];
  /** Shapes named but not pickable yet, after the offered ones. */
  comingSoon: FamilyKind[];
}

/**
 * The shapes one device kind offers, grouped by where they sit.
 *
 * Offered is what the home's devices of that kind actually draw, so an iPhone
 * too old for the Home Screen tiles is never shown them. A home with no device
 * of that kind falls back to what such a device would draw, because the design
 * is going to the library and a shape missing from the shelf is a shape lost.
 *
 * Control Center has no shapes: it is the choice that skips this step.
 */
export function shapeGroups(kind: NewKind, owners: readonly DeviceOwner[]): ShapeGroup[] {
  if (kind === "control") return [];
  const mine = kindOwners(owners, kind);
  const draws = new Set<FamilyKind>(mine.flatMap((o) => [...o.families]));
  const soon = new Set<FamilyKind>(mine.flatMap((o) => [...o.comingSoon]));
  if (mine.length === 0) {
    for (const f of familiesFor({ device_kind: kind })) draws.add(f);
    for (const f of comingSoonFamilies({ device_kind: kind })) soon.add(f);
  }
  const groups: ShapeGroup[] = [];
  const add = (key: ShapeGroup["key"], title: string, members: readonly FamilyKind[]) => {
    const families = members.filter((f) => draws.has(f));
    const comingSoon = members.filter((f) => !draws.has(f) && soon.has(f));
    if (families.length > 0 || comingSoon.length > 0) groups.push({ key, title, families, comingSoon });
  };
  if (kind === "watch") {
    add("watch", "Watch face", ALL_FAMILIES.filter((f) => !isHomeFamily(f)));
    return groups;
  }
  add("lock", "Lock Screen", ALL_FAMILIES.filter((f) => !isHomeFamily(f) && f !== "corner"));
  add("home", "Home Screen", ALL_FAMILIES.filter(isHomeFamily));
  return groups;
}

/** Whether one shape is still on offer for the picked kind, which is what
 * clears the pick when the kind changes under it. */
export function shapeOffered(kind: NewKind, owners: readonly DeviceOwner[], family: FamilyKind | undefined): boolean {
  if (family === undefined) return false;
  return shapeGroups(kind, owners).some((g) => g.families.includes(family));
}

/** What the dialog knows about its own four steps, which is all the footer
 * line is about. */
export interface NewChoice {
  /** Whether step 1 has been answered at all. */
  named: boolean;
  /** Step 1's complaint, if it has one: a name another complication has. */
  nameProblem?: string;
  /** Step 2: the device kind, or undefined while it is unanswered. */
  kind?: NewKind;
  /** Step 3: the one shape. Undefined for a Control Center control, which has
   * no shape, and while the step is unanswered. */
  family?: FamilyKind;
  /** Step 4: how many devices are ticked. None is an answer of its own: the
   * complication is made in the home's library and waits there. */
  devices: number;
}

/** The one line in the footer: what is missing, or what Create is about to
 * make. The order is the order of the steps, so it always names the first
 * question still open rather than the last. */
export function newSummary(o: NewChoice): string {
  if (!o.named) return "Type a name to start.";
  if (o.nameProblem !== undefined) return o.nameProblem;
  if (o.kind === undefined) return "Now pick a watch, an iPhone or Control Center.";
  if (o.kind !== "control" && o.family === undefined) return "Now pick one shape.";
  const what = o.kind === "control"
    ? "A Control Center control"
    : `${familyTitle(o.family!)} on ${o.kind === "watch" ? "a watch" : "an iPhone"}`;
  if (o.devices === 0) return `${what}, unassigned. Tick a device any time.`;
  return `${what}, on ${o.devices} ${o.devices === 1 ? "device" : "devices"}`;
}

/** Whether every step that needs an answer has one, which is the only thing
 * that enables Create. Beside `newSummary` because the two must never
 * disagree. Step 4 is not one of them. */
export function newReady(o: NewChoice): boolean {
  if (!o.named || o.nameProblem !== undefined || o.kind === undefined) return false;
  return o.kind === "control" || o.family !== undefined;
}

/** One record Create is about to make: which device it goes on, and the seat
 * it takes there. `slotIndex` is -1 on a device with no seat left for this
 * shape, which is named rather than silently skipped. */
export interface NewRecord {
  ownerId: string;
  label: string;
  slotIndex: number;
}

/**
 * One record per ticked device, in the order the devices were given.
 *
 * Each is its own complication from the moment it is written, so each finds
 * its own seat: the lowest one free for this shape on that device. Nothing is
 * shared between them and nothing joins them afterwards.
 *
 * `freeSlot` is the panel's reading of a device's seats, passed in so this
 * stays a function over the answer rather than over the websocket.
 */
export function newRecords(
  owners: readonly DeviceOwner[],
  family: FamilyKind | undefined,
  freeSlot: (ownerId: string, family: FamilyKind | undefined) => number,
): NewRecord[] {
  return owners.map((owner) => ({
    ownerId: owner.ownerId,
    label: owner.label,
    slotIndex: freeSlot(owner.ownerId, family),
  }));
}
