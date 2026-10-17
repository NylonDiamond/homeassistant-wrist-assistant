// The multi-select of the Pages and Status pages tabs: which cards are
// picked, and what Delete does with them.
//
// Picking is a set of library item ids: a click toggles one, a Shift+click
// adds the run between the last click and this one in the order the cards
// are shown, and Select all or none act on the shown cards only. The ticks on
// each card put a page on a device or take it off, so Delete is the one
// action left: it deletes the picked items from the library (`library/
// delete`), which takes each off every device that has it, with the tiles and
// menu slots that opened it there. Complication taps live in another store,
// so for pages they are cleared here afterwards, on each device that had the
// page. The element is `all-pages.ts`; this is the part a test reaches
// without it.

import type { LibraryDeleteReply, LibraryKind } from "../library/client.js";
import type { LibraryItem } from "../library/model.js";
import { sameId } from "../library/model.js";
import type { LibraryWrite } from "../library/store.js";
import { type CardKind, cardNoun } from "./all-pages-model.js";
import { type LinkDevice, joinWords } from "./devices.js";
import type { WatchPagesNote } from "./save-note.js";

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/** Up to three names, then how many more: "Hall, Den, Lights and 4 more". */
export function nameList(names: readonly string[]): string {
  if (names.length <= 3) return joinWords(names);
  return `${names.slice(0, 3).join(", ")} and ${names.length - 3} more`;
}

// ── picking ──────────────────────────────────────────────────────────────

/** One card in or out. */
export function toggleSelected(selected: ReadonlySet<string>, key: string): Set<string> {
  const next = new Set(selected);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

/**
 * Shift+click: every card from `anchor` to `key` in `order` (the order the
 * cards are shown) is picked, both ends included, besides what was. With no
 * anchor, or one no longer shown, only `key` is.
 */
export function rangeSelected(selected: ReadonlySet<string>, order: readonly string[], anchor: string | undefined, key: string): Set<string> {
  const next = new Set(selected);
  const to = order.indexOf(key);
  const from = anchor === undefined ? -1 : order.indexOf(anchor);
  if (to < 0) return next;
  if (from < 0) {
    next.add(key);
    return next;
  }
  for (let i = Math.min(from, to); i <= Math.max(from, to); i++) next.add(order[i]!);
  return next;
}

/** Select all: every shown card picked, besides what was. */
export function withAll(selected: ReadonlySet<string>, shown: readonly string[]): Set<string> {
  return new Set([...selected, ...shown]);
}

/** Select none: the shown cards dropped. */
export function withNone(selected: ReadonlySet<string>, shown: readonly string[]): Set<string> {
  const drop = new Set(shown);
  return new Set([...selected].filter((k) => !drop.has(k)));
}

/** Only the picked cards still among `keys`: a filter, a search or a delete
 * that hides a card unpicks it. */
export function keepPresent(selected: ReadonlySet<string>, keys: readonly string[]): Set<string> {
  const present = new Set(keys);
  return new Set([...selected].filter((k) => present.has(k)));
}

/** A card's key in the selection: its item id, upper-cased, so a read that
 * spells it another way keeps it picked. */
export function itemKey(entry: { id: string }): string {
  return entry.id.toUpperCase();
}

// ── the delete ───────────────────────────────────────────────────────────

/** Whether a device's page editor (or for status pages its status pages
 * editor) holds unsaved edits in this browser tab. */
export type DirtyCheck = (ownerId: string, kind: CardKind) => boolean;

/** One item the delete takes out of the library. */
export interface PlannedItem {
  id: string;
  name: string;
  /** The devices that have it now, for the complication taps after. */
  owners: string[];
}

export interface DeletePlan {
  kind: CardKind;
  items: PlannedItem[];
  /** Items left alone because a device that has them holds unsaved edits:
   * the delete would land under those edits. */
  kept: { name: string; dirty: string[] }[];
  /** Every device that has an item to delete, in device order. */
  devices: string[];
}

/** Delete: every picked item from the library, but those a device with
 * unsaved edits has. */
export function deletePlan(entries: readonly LibraryItem[], devices: readonly LinkDevice[], dirty: DirtyCheck): DeletePlan {
  const kind: CardKind = entries[0]?.kind ?? "pages";
  const plan: DeletePlan = { kind, items: [], kept: [], devices: [] };
  const holders = new Set<string>();
  for (const entry of entries) {
    const held = devices.filter((d) => entry.owners.some((o) => sameId(o, d.ownerId))).map((d) => d.ownerId);
    const busy = held.filter((o) => dirty(o, entry.kind));
    if (busy.length > 0) {
      plan.kept.push({ name: entry.name, dirty: busy });
      continue;
    }
    plan.items.push({ id: entry.id, name: entry.name, owners: [...entry.owners] });
    for (const o of held) holders.add(o);
  }
  plan.devices = devices.map((d) => d.ownerId).filter((id) => holders.has(id));
  return plan;
}

const nameOf = (devices: readonly LinkDevice[], ownerId: string): string =>
  devices.find((d) => sameId(d.ownerId, ownerId))?.name ?? "a device";

/** The delete question: "Delete 2 pages from the library?", and a line on
 * the devices they come off and what goes with them, as the editors' delete
 * everywhere says. */
export function deleteAskText(plan: DeletePlan, devices: readonly LinkDevice[]): { title: string; body: string } {
  const n = plan.items.length;
  const it = n === 1 ? "it" : "them";
  const title = `Delete ${n} ${cardNoun(plan.kind, n)} from the library?`;
  const where = plan.devices.map((id) => nameOf(devices, id));
  const what = plan.kind === "status_pages"
    ? `with the tiles and menu slots that open ${it}`
    : `with the tiles, menu slots and complication taps that open ${it}`;
  const parts = [
    where.length === 0
      ? `No device has ${it}. This cannot be undone.`
      : `${n === 1 ? "It comes" : "They come"} off ${joinWords(where)}, ${what}. This cannot be undone.`,
  ];
  for (const k of plan.kept) {
    const names = k.dirty.map((id) => nameOf(devices, id));
    parts.push(`${k.name} stays: ${joinWords(names)} ${names.length === 1 ? "has" : "have"} unsaved edits.`);
  }
  return { title, body: parts.join(" ") };
}

/** The calls a delete makes, so a test can stand in for Home Assistant. */
export interface BulkIO {
  /** `library/delete` of one item (through the library store, or not). */
  delete(kind: LibraryKind, itemId: string): Promise<LibraryWrite<LibraryDeleteReply>>;
  /** Make every complication tap of one device that opened one of the
   * pages do nothing. False when some could not be. */
  clearTaps(ownerId: string, pageIds: readonly string[]): Promise<boolean>;
}

/** What a delete did, for its one result line. */
export interface BulkResult {
  kind: CardKind;
  /** The names of the items deleted. */
  gone: string[];
  kept: DeletePlan["kept"];
  failed: { name: string; text: string }[];
  /** Devices whose record could not take a delete (`link_failures`). */
  stuck: string[];
  /** Devices whose complication taps could not be cleared. */
  taps: string[];
}

/** Progress: a line to show while a delete runs. */
export type BulkStep = (text: string) => void;

/** Run a Delete plan: one `library/delete` per item, then, for pages, the
 * complication taps on each device that had one. */
export async function runDelete(io: BulkIO, plan: DeletePlan, devices: readonly LinkDevice[], step?: BulkStep): Promise<BulkResult> {
  const result: BulkResult = { kind: plan.kind, gone: [], kept: plan.kept.map((k) => ({ ...k, dirty: [...k.dirty] })), failed: [], stuck: [], taps: [] };
  const gone = new Map<string, string[]>();
  for (const [i, item] of plan.items.entries()) {
    step?.(`Deleting ${item.name} (${i + 1} of ${plan.items.length})…`);
    const res = await io.delete(plan.kind, item.id);
    if (!res.ok) {
      result.failed.push({ name: item.name, text: res.text });
      continue;
    }
    result.gone.push(item.name);
    for (const f of res.reply.link_failures ?? []) {
      const name = f.name ?? nameOf(devices, f.owner);
      if (!result.stuck.includes(name)) result.stuck.push(name);
    }
    for (const o of item.owners) gone.set(o, [...(gone.get(o) ?? []), item.id]);
  }
  if (plan.kind === "pages") {
    for (const [ownerId, ids] of gone) {
      step?.(`Clearing complication taps on ${nameOf(devices, ownerId)}…`);
      let ok = false;
      try {
        ok = await io.clearTaps(ownerId, ids);
      } catch {
        ok = false;
      }
      if (!ok) result.taps.push(nameOf(devices, ownerId));
    }
  }
  return result;
}

/**
 * One line on what a delete did, then what it left out and why. "ok" when
 * nothing was left out, "warn" when some was, "err" when nothing was done.
 */
export function bulkResultText(result: BulkResult): WatchPagesNote {
  const count = (n: number) => `${n} ${cardNoun(result.kind, n)}`;
  const parts: string[] = [];
  if (result.gone.length > 0) parts.push(`Deleted ${result.gone.length === 1 ? result.gone[0]! : count(result.gone.length)}.`);
  const done = parts.length > 0;
  let left = false;
  for (const k of result.kept) {
    left = true;
    parts.push(`Kept ${k.name}: a device that has it has unsaved edits. Save or discard them first.`);
  }
  for (const f of result.failed) {
    left = true;
    parts.push(`Not deleted: ${f.name}. ${f.text}`);
  }
  if (result.stuck.length > 0) {
    left = true;
    parts.push(`Could not take ${result.gone.length === 1 ? "it" : "them"} off ${joinWords(result.stuck)}.`);
  }
  if (result.taps.length > 0) {
    left = true;
    parts.push(`Could not clear the complication taps that opened ${result.gone.length === 1 ? "it" : "them"} on ${joinWords(result.taps)}. Change those by hand.`);
  }
  if (!done && !left) return { kind: "ok", text: "Nothing was deleted." };
  return { kind: left ? (done ? "warn" : "err") : "ok", text: parts.join(" ") };
}

/** "3 pages", for the bar's lines. */
export function countText(kind: CardKind, n: number): string {
  return plural(n, cardNoun(kind), cardNoun(kind, 2));
}
