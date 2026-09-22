// Two documents sitting in one seat, and the move that pulls them apart.
//
// A seat holds at most one document per shape. The pickers on the iPhone and
// the watch draw one row per seat, so a second document of the same shape in
// the same seat is a row nobody ever sees: a tester ended up with four phone
// copies showing as one. The seat rule in copies.ts stops new ones being made;
// this is the other half, which finds the ones already written and says where
// each should go instead.
//
// Pure, so the finding and the plan can be read in a test without a browser.
// The panel hands over what it already read off each device's list, and takes
// back a list of moves to save.

import { type SlotHolder, freeSlotForFamily, joinNames, seatHoldersFor } from "./copies.js";
import type { FamilyKind } from "./model.js";

/** One live document on a device, as the clash rule reads it. */
export interface SeatRecord {
  /** The record id, so the panel can find the record again to save it. */
  id: string;
  /** The name the banner says, and the picker row it would have drawn. */
  name: string;
  /** Its seat on that device. */
  slotIndex: number;
  /** The shapes it draws there. */
  families: readonly FamilyKind[];
  /** Whether it carries a Control Center control. */
  control: boolean;
  /** The store token of its last write. The lowest one is the oldest, and it
   * is the copy that stays where it is. */
  token: number;
}

/** One device and what it holds, as the repair reads it. */
export interface SeatDevice {
  ownerId: string;
  /** What to call the device in a line the author reads. */
  label: string;
  /** Every live document on it. A deleted one holds nothing. */
  records: readonly SeatRecord[];
  /** The seats nothing of ours can share: an iPhone preset, or a custom
   * belonging to another home. */
  blocked?: readonly { slot: number }[];
  /** Whether this device's app resolves a shared seat by shape. False makes
   * every held seat a whole seat when a move looks for a free one, the way
   * `seatHoldersFor` does. Defaults to true. */
  canShare?: boolean;
}

/** Two or more documents in one seat that the device cannot tell apart. */
export interface SeatClash {
  ownerId: string;
  label: string;
  slotIndex: number;
  /** The documents in the clash, oldest write first. The first one stays. */
  records: SeatRecord[];
}

/** One document on its way to a seat of its own. */
export interface SeatMove {
  ownerId: string;
  label: string;
  recordId: string;
  name: string;
  from: number;
  to: number;
}

/** One document there was nowhere to move to. It stays where it is. */
export interface SeatStuck {
  ownerId: string;
  label: string;
  recordId: string;
  name: string;
}

export interface SeatRepairPlan {
  moves: SeatMove[];
  stuck: SeatStuck[];
}

/**
 * What one document occupies a seat with, as a set of words.
 *
 * A shape is one word. A Control Center control is its own word, because a
 * control has no shape to be told apart by and two of them in one seat are as
 * invisible to each other as two circulars. A document with neither draws
 * nowhere, so it clashes with nothing.
 */
function seatKeys(record: SeatRecord): string[] {
  const keys = record.families.map((f) => `shape:${f}`);
  if (record.control) keys.push("control");
  return keys;
}

/** The seat a holder of this document takes. A control holds the whole seat,
 * which is what an empty shape list means to `freeSlotForFamily`. */
function holderOf(record: SeatRecord): SlotHolder {
  return { slotIndex: record.slotIndex, families: record.control ? [] : [...record.families] };
}

/** The shape a move looks for a seat for. One shape is that shape; a control,
 * or a document that somehow still draws several, needs a seat nothing at all
 * holds, which is what `undefined` asks for. */
function familyOf(record: SeatRecord): FamilyKind | undefined {
  return !record.control && record.families.length === 1 ? record.families[0] : undefined;
}

/** Oldest write first, and the id decides a tie so the same list always keeps
 * the same document. */
function byToken(a: SeatRecord, b: SeatRecord): number {
  return a.token - b.token || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

/**
 * The groups of documents in one seat that share at least one word.
 *
 * Shared by way of a third document counts: a document drawing both circular
 * and rectangular joins a circular one and a rectangular one into one group,
 * because moving only one of them would leave the other two on top of each
 * other. That is rare now that a document is one shape, but the rule costs
 * nothing and a half-done repair would cost a second round of this.
 */
function groupsInSeat(records: readonly SeatRecord[]): SeatRecord[][] {
  const groups: { keys: Set<string>; members: SeatRecord[] }[] = [];
  for (const record of records) {
    const keys = seatKeys(record);
    if (keys.length === 0) continue;
    const joined = groups.filter((g) => keys.some((k) => g.keys.has(k)));
    const first = joined[0];
    if (!first) {
      groups.push({ keys: new Set(keys), members: [record] });
      continue;
    }
    first.members.push(record);
    for (const k of keys) first.keys.add(k);
    for (const other of joined.slice(1)) {
      first.members.push(...other.members);
      for (const k of other.keys) first.keys.add(k);
      groups.splice(groups.indexOf(other), 1);
    }
  }
  return groups.filter((g) => g.members.length > 1).map((g) => [...g.members].sort(byToken));
}

/**
 * Every seat in the home holding two documents a device cannot tell apart.
 *
 * Per device, per seat, and only for documents that draw something: a seat
 * number below zero is a document that has never been placed, and a document
 * with no shape and no control draws nowhere at all.
 */
export function findSeatClashes(devices: readonly SeatDevice[]): SeatClash[] {
  const out: SeatClash[] = [];
  for (const device of devices) {
    const seats = new Map<number, SeatRecord[]>();
    for (const record of device.records) {
      if (record.slotIndex < 0) continue;
      const seat = seats.get(record.slotIndex);
      if (seat) seat.push(record);
      else seats.set(record.slotIndex, [record]);
    }
    for (const slotIndex of [...seats.keys()].sort((a, b) => a - b)) {
      for (const members of groupsInSeat(seats.get(slotIndex)!)) {
        out.push({ ownerId: device.ownerId, label: device.label, slotIndex, records: members });
      }
    }
  }
  return out;
}

/**
 * Where each clashing document should go instead.
 *
 * The oldest write in a group stays where it is: it is the one the device has
 * been drawing all along, so a face or widget already using it keeps working.
 * Every other document in the group takes the lowest seat free for its shape
 * on that device, read off the same rule a new copy uses. A seat handed out
 * here is held for the rest of the plan, so two documents from one clash never
 * land on each other again.
 *
 * A device with no seat left for one of them is not a reason to move the rest
 * back: that document is named as stuck and stays where it is.
 */
export function planSeatRepair(devices: readonly SeatDevice[]): SeatRepairPlan {
  const clashes = findSeatClashes(devices);
  const moves: SeatMove[] = [];
  const stuck: SeatStuck[] = [];
  for (const device of devices) {
    const mine = clashes.filter((c) => c.ownerId === device.ownerId);
    if (mine.length === 0) continue;
    const moving = new Set(mine.flatMap((c) => c.records.slice(1)).map((r) => r.id));
    // Everything staying put still holds its seat. The documents on the move
    // let go of theirs, and take the new one back as soon as it is picked.
    const held = device.records.filter((r) => r.slotIndex >= 0 && !moving.has(r.id)).map(holderOf);
    const blocked = device.blocked ?? [];
    for (const clash of mine) {
      for (const record of clash.records.slice(1)) {
        const slot = freeSlotForFamily(
          familyOf(record),
          seatHoldersFor(held, device.canShare !== false),
          blocked,
        );
        if (slot < 0) {
          stuck.push({ ownerId: device.ownerId, label: device.label, recordId: record.id, name: record.name });
          continue;
        }
        moves.push({
          ownerId: device.ownerId,
          label: device.label,
          recordId: record.id,
          name: record.name,
          from: record.slotIndex,
          to: slot,
        });
        held.push({ slotIndex: slot, families: record.control ? [] : [...record.families] });
      }
    }
  }
  return { moves, stuck };
}

/** How many clashes the banner names before it stops counting. Past three the
 * line is longer than anybody reads, and the button fixes the lot anyway. */
const NAMED_CLASHES = 3;

/**
 * The banner's words: which documents share which seat, and on what.
 *
 * One sentence per clash, in the panel's device order, and one closing line
 * saying why it matters. Empty when nothing clashes, which is what hides the
 * banner.
 */
export function seatClashMessage(clashes: readonly SeatClash[]): string {
  if (clashes.length === 0) return "";
  const named = clashes.slice(0, NAMED_CLASHES).map((c) =>
    `${joinNames(c.records.map((r) => r.name))} share seat ${c.slotIndex} on ${c.label}.`);
  const rest = clashes.length - named.length;
  if (rest > 0) named.push(`${rest} more ${rest === 1 ? "seat" : "seats"} clash the same way.`);
  named.push(clashes.length === 1 ? "Only one of them can be placed." : "Only one of each can be placed.");
  return named.join(" ");
}

/** What the Fix button leaves behind: where things went, and what could not
 * go anywhere. Read after the saves, so the panel can say it in the same
 * quiet banner every other cross-device write uses. */
export function seatRepairSummary(plan: SeatRepairPlan): string {
  const lines: string[] = [];
  const first = plan.moves[0];
  if (plan.moves.length === 1 && first) lines.push(`${first.name} moved to seat ${first.to} on ${first.label}.`);
  else if (plan.moves.length > 1) lines.push(`${plan.moves.length} complications moved to seats of their own.`);
  if (plan.stuck.length > 0) {
    const where = [...new Set(plan.stuck.map((s) => s.label))];
    lines.push(`${joinNames(plan.stuck.map((s) => s.name))} stayed put: ${joinNames(where)} has no free seat. Delete something there first.`);
  }
  return lines.length > 0 ? lines.join(" ") : "Nothing to move.";
}
