// The Pages tab's multi-select: which cards are picked, and what Add to,
// Remove from and Delete do with them.
//
// Picking is a set of card keys (`PageCard.key`): a click toggles one, a
// Shift+click adds the run between the last click and this one in the order
// the cards are shown, and Select all or none act on the shown cards only.
//
// An action is planned first, from the cards as last read: per device the
// pages it changes there, and what is left out and why (a device with unsaved
// edits in its page editor, a page another device already holds under its
// id, a page that would be left on no device). Then it runs, one device at a
// time: one link call per source and target for Add to, and for Remove from
// and Delete one read and one save of each device's pages (read again on a
// conflict, `removePagesFrom`), then one clearing of the menu slots and
// complication taps there that opened them (`clearPageRefs`). The element
// is `all-pages.ts`; this is the part a test reaches without it.

import type { WatchPagesLinkReply } from "../ha-api.js";
import { type PageCard, copyOn, linkSource } from "./all-pages-model.js";
import { type LinkDevice, type PagesRemoveResult, joinWords, linkErrorText } from "./links.js";
import { type WatchPagesDocument, watchPageId, watchPagesOf } from "./model.js";
import { type WatchPagesNote, watchCommandError } from "./save-note.js";

const upper = (id: string): string => id.toUpperCase();

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

const pages = (n: number): string => plural(n, "page", "pages");

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

/** Only the picked cards still among `keys`: a filter or a search that
 * hides a card unpicks it. */
export function keepPresent(selected: ReadonlySet<string>, keys: readonly string[]): Set<string> {
  const present = new Set(keys);
  return new Set([...selected].filter((k) => present.has(k)));
}

/**
 * The picks after a read, by page: a card's key moves when its page is
 * linked or unlinked, so a new card is picked when any of its copies was a
 * copy of a picked card (the same device and page id).
 */
export function remapSelection(picked: readonly PageCard[], cards: readonly PageCard[]): Set<string> {
  const copies = new Set(picked.flatMap((c) => c.copies.map((p) => `${p.device.ownerId}|${upper(watchPageId(p.page))}`)));
  return new Set(cards.filter((c) => c.copies.some((p) => copies.has(`${p.device.ownerId}|${upper(watchPageId(p.page))}`))).map((c) => c.key));
}

// ── plans ────────────────────────────────────────────────────────────────

/** Whether a device's page editor holds unsaved edits in this browser tab. */
export type DirtyCheck = (ownerId: string) => boolean;

/** One link call: pages of `source` put on `target`, linked. */
export interface LinkCall {
  source: string;
  target: string;
  pageIds: string[];
  /** The pages' names, in `pageIds` order, for the result line. */
  names: string[];
}

/** Pages a device could not take, by name. */
export interface DeviceNames {
  ownerId: string;
  names: string[];
}

export interface AddPlan {
  calls: LinkCall[];
  /** How many picked pages a ticked device holds already. */
  already: number;
  /** Per ticked device, the pages it holds another page under the id of. */
  taken: DeviceNames[];
  /** Ticked devices with unsaved edits, left alone. */
  dirty: string[];
  /** Pages whose every device has unsaved edits, so none can be the source. */
  blocked: string[];
}

function pushName(list: DeviceNames[], ownerId: string, name: string): void {
  const held = list.find((d) => d.ownerId === ownerId);
  if (held !== undefined) held.names.push(name);
  else list.push({ ownerId, names: [name] });
}

/**
 * Add to: every picked page on every ticked device, linked. A page goes from
 * one device that holds it (the first without unsaved edits, `linkSource`),
 * and the calls are grouped per source and target. Left out: a device that
 * has the page already, one whose page editor holds unsaved edits, and one
 * that holds another page under the same id (Home Assistant would refuse
 * the whole call, `id_taken`).
 */
export function addPlan(
  cards: readonly PageCard[],
  targets: readonly string[],
  docs: ReadonlyMap<string, WatchPagesDocument>,
  dirty: DirtyCheck,
): AddPlan {
  const plan: AddPlan = { calls: [], already: 0, taken: [], dirty: [], blocked: [] };
  const open = targets.filter((t) => {
    if (!dirty(t)) return true;
    plan.dirty.push(t);
    return false;
  });
  // The ids each target holds, and those the calls so far put there.
  const claimed = new Map(open.map((t) => [t, new Set((docs.get(t) === undefined ? [] : watchPagesOf(docs.get(t)!)).map((p) => upper(watchPageId(p))))]));
  for (const card of cards) {
    const wanted = open.filter((t) => copyOn(card, t) === undefined);
    plan.already += open.length - wanted.length;
    if (wanted.length === 0) continue;
    const source = linkSource(card, dirty);
    if (source === undefined) {
      plan.blocked.push(card.name);
      continue;
    }
    const pageId = watchPageId(copyOn(card, source)!.page);
    for (const target of wanted) {
      const ids = claimed.get(target)!;
      if (ids.has(upper(pageId))) {
        pushName(plan.taken, target, card.name);
        continue;
      }
      ids.add(upper(pageId));
      const call = plan.calls.find((c) => c.source === source && c.target === target);
      if (call !== undefined) {
        call.pageIds.push(pageId);
        call.names.push(card.name);
      } else plan.calls.push({ source, target, pageIds: [pageId], names: [card.name] });
    }
  }
  return plan;
}

/** One device's share of a remove or a delete: the page ids to take off. */
export interface DeviceWork {
  ownerId: string;
  pageIds: string[];
}

/** A picked page as a delete or a remove sees it: where it is. */
export interface PlannedPage {
  name: string;
  copies: { ownerId: string; pageId: string }[];
}

export interface RemovePlan {
  work: DeviceWork[];
  /** Pages that would be left on no device: kept, for Delete. */
  lastOnly: string[];
  /** Ticked devices with unsaved edits, left alone. */
  dirty: string[];
  /** How many picked pages none of the ticked devices holds. */
  notThere: number;
}

function addWork(work: DeviceWork[], ownerId: string, pageId: string): void {
  const held = work.find((w) => w.ownerId === ownerId);
  if (held !== undefined) held.pageIds.push(pageId);
  else work.push({ ownerId, pageIds: [pageId] });
}

function addOnce(list: string[], id: string): void {
  if (!list.includes(id)) list.push(id);
}

/**
 * Remove from: every picked page off every ticked device, each device in one
 * save. A page every one of whose devices is ticked stays (that is a delete,
 * and Delete says so). A device with unsaved edits in its page editor is left
 * alone.
 */
export function removePlan(cards: readonly PageCard[], targets: readonly string[], dirty: DirtyCheck): RemovePlan {
  const plan: RemovePlan = { work: [], lastOnly: [], dirty: [], notThere: 0 };
  const ticked = new Set(targets);
  for (const card of cards) {
    const on = card.copies.filter((c) => ticked.has(c.device.ownerId));
    if (on.length === 0) {
      plan.notThere++;
      continue;
    }
    if (on.length === card.copies.length) {
      plan.lastOnly.push(card.name);
      continue;
    }
    for (const copy of on) {
      const owner = copy.device.ownerId;
      if (dirty(owner)) addOnce(plan.dirty, owner);
      else addWork(plan.work, owner, watchPageId(copy.page));
    }
  }
  return plan;
}

export interface DeletePlan {
  work: DeviceWork[];
  /** Every picked page with where it is, to count those gone everywhere. */
  pages: PlannedPage[];
  /** Every device that holds a picked page, in device order. */
  devices: string[];
  /** Of those, the ones with unsaved edits, left alone. */
  dirty: string[];
}

/** Delete: every picked page off every device that holds it. A device with
 * unsaved edits in its page editor is left alone, its copies stay. */
export function deletePlan(cards: readonly PageCard[], devices: readonly LinkDevice[], dirty: DirtyCheck): DeletePlan {
  const plan: DeletePlan = { work: [], pages: [], devices: [], dirty: [] };
  const holders = new Set<string>();
  for (const card of cards) {
    plan.pages.push({ name: card.name, copies: card.copies.map((c) => ({ ownerId: c.device.ownerId, pageId: watchPageId(c.page) })) });
    for (const copy of card.copies) {
      const owner = copy.device.ownerId;
      holders.add(owner);
      if (dirty(owner)) addOnce(plan.dirty, owner);
      else addWork(plan.work, owner, watchPageId(copy.page));
    }
  }
  plan.devices = devices.map((d) => d.ownerId).filter((id) => holders.has(id));
  plan.work.sort((a, b) => plan.devices.indexOf(a.ownerId) - plan.devices.indexOf(b.ownerId));
  return plan;
}

const nameOf = (devices: readonly LinkDevice[], ownerId: string): string => devices.find((d) => d.ownerId === ownerId)?.name ?? "a device";

/** The delete question: "Delete 12 pages from 2 devices?", and a line on
 * where they go from and what else changes. */
export function deleteAskText(plan: DeletePlan, devices: readonly LinkDevice[]): { title: string; body: string } {
  const n = plan.pages.length;
  const where = plan.devices.map((id) => nameOf(devices, id));
  const title = `Delete ${pages(n)} from ${plural(where.length, "device", "devices")}?`;
  const parts = [
    `${n === 1 ? "It comes" : "They come"} off ${joinWords(where)}, with the menu slots and complication taps there that open ${n === 1 ? "it" : "them"}. This cannot be undone.`,
  ];
  if (plan.dirty.length > 0) {
    const names = plan.dirty.map((id) => nameOf(devices, id));
    parts.push(`${joinWords(names)} ${names.length === 1 ? "has" : "have"} unsaved edits, so ${names.length === 1 ? "its" : "their"} copies stay.`);
  }
  return { title, body: parts.join(" ") };
}

// ── running ──────────────────────────────────────────────────────────────

/** The calls an action makes, so a test can stand in for Home Assistant. */
export interface BulkIO {
  link(source: string, pageIds: readonly string[], target: string): Promise<WatchPagesLinkReply>;
  remove(ownerId: string, pageIds: readonly string[]): Promise<PagesRemoveResult>;
  /** Clear the menu slots and complication taps that opened the pages:
   * `clearPageRefs`, whose "warn" note means some could not be. */
  clearRefs(ownerId: string, pageIds: string[]): Promise<WatchPagesNote | undefined>;
}

/** What an action did, for its one result line. */
export interface BulkResult {
  action: "add" | "remove" | "delete";
  /** Per device, how many pages the action changed there. */
  done: { ownerId: string; count: number }[];
  /** Delete: how many pages are gone from every device. */
  gone: number;
  /** Add to: the pages and status pages the added pages' tiles brought. */
  also: number;
  taken: DeviceNames[];
  dirty: string[];
  blocked: string[];
  lastOnly: string[];
  failed: { ownerId: string; message: string }[];
  /** Devices whose menu slots or complication taps could not be cleared. */
  refs: string[];
}

function emptyResult(action: BulkResult["action"]): BulkResult {
  return { action, done: [], gone: 0, also: 0, taken: [], dirty: [], blocked: [], lastOnly: [], failed: [], refs: [] };
}

function addDone(result: BulkResult, ownerId: string, count: number): void {
  if (count === 0) return;
  const held = result.done.find((d) => d.ownerId === ownerId);
  if (held !== undefined) held.count += count;
  else result.done.push({ ownerId, count });
}

/** Progress: a line to show while an action runs. */
export type BulkStep = (text: string) => void;

function alsoCount(reply: WatchPagesLinkReply, target: string, asked: readonly string[]): number {
  const added = reply.targets?.[target];
  if (added === undefined) return 0;
  const askedKeys = new Set(asked.map(upper));
  return (added.pages ?? []).filter((id) => !askedKeys.has(upper(id))).length + (added.status_pages ?? []).length;
}

/** A refusal that names one page: worth asking again one page at a time. */
const PAGE_REFUSALS = new Set(["id_taken", "not_found", "system_page"]);

/**
 * Run an Add to plan: one link call per source and target. Home Assistant
 * checks a call whole, so a call refused for one of its pages (another page
 * under the id, say one a tile brings along) is sent again one page at a
 * time, and only the refused ones are left out.
 */
export async function runAdd(io: BulkIO, plan: AddPlan, devices: readonly LinkDevice[], step?: BulkStep): Promise<BulkResult> {
  const result = emptyResult("add");
  result.taken = plan.taken.map((t) => ({ ownerId: t.ownerId, names: [...t.names] }));
  result.dirty = [...plan.dirty];
  result.blocked = [...plan.blocked];
  const fail = (target: string, err: unknown, name?: string) => {
    if (watchCommandError(err).code === "id_taken" && name !== undefined) pushName(result.taken, target, name);
    else result.failed.push({ ownerId: target, message: `${name === undefined ? "" : `${name}: `}${linkErrorText(err)}` });
  };
  for (const [i, call] of plan.calls.entries()) {
    step?.(`Adding to ${nameOf(devices, call.target)} (${i + 1} of ${plan.calls.length})…`);
    try {
      const reply = await io.link(call.source, call.pageIds, call.target);
      addDone(result, call.target, call.pageIds.length);
      result.also += alsoCount(reply, call.target, call.pageIds);
    } catch (err) {
      const code = watchCommandError(err).code;
      if (call.pageIds.length === 1) {
        fail(call.target, err, call.names[0]);
        continue;
      }
      if (code === undefined || !PAGE_REFUSALS.has(code)) {
        fail(call.target, err);
        continue;
      }
      for (const [j, pageId] of call.pageIds.entries()) {
        try {
          const reply = await io.link(call.source, [pageId], call.target);
          addDone(result, call.target, 1);
          result.also += alsoCount(reply, call.target, [pageId]);
        } catch (one) {
          fail(call.target, one, call.names[j]);
        }
      }
    }
  }
  return result;
}

/** Take each device's pages off it, then clear what opened them there. */
async function runWork(io: BulkIO, work: readonly DeviceWork[], result: BulkResult, devices: readonly LinkDevice[], verb: string, step?: BulkStep): Promise<Map<string, Set<string>>> {
  const removed = new Map<string, Set<string>>();
  for (const [i, w] of work.entries()) {
    step?.(`${verb} ${nameOf(devices, w.ownerId)} (${i + 1} of ${work.length})…`);
    let res: PagesRemoveResult;
    try {
      res = await io.remove(w.ownerId, w.pageIds);
    } catch (err) {
      res = { ok: false, code: "unknown", message: watchCommandError(err).message };
    }
    if (!res.ok) {
      result.failed.push({ ownerId: w.ownerId, message: res.message });
      continue;
    }
    removed.set(w.ownerId, new Set(res.removed.map(upper)));
    addDone(result, w.ownerId, res.removed.length);
    if (res.removed.length === 0) continue;
    try {
      const note = await io.clearRefs(w.ownerId, res.removed);
      if (note?.kind === "warn" || note?.kind === "err") result.refs.push(w.ownerId);
    } catch {
      result.refs.push(w.ownerId);
    }
  }
  return removed;
}

/** Run a Remove from plan. */
export async function runRemove(io: BulkIO, plan: RemovePlan, devices: readonly LinkDevice[], step?: BulkStep): Promise<BulkResult> {
  const result = emptyResult("remove");
  result.dirty = [...plan.dirty];
  result.lastOnly = [...plan.lastOnly];
  await runWork(io, plan.work, result, devices, "Taking pages off", step);
  return result;
}

/** Run a Delete plan, then count the pages now gone from every device. */
export async function runDelete(io: BulkIO, plan: DeletePlan, devices: readonly LinkDevice[], step?: BulkStep): Promise<BulkResult> {
  const result = emptyResult("delete");
  result.dirty = [...plan.dirty];
  const removed = await runWork(io, plan.work, result, devices, "Deleting on", step);
  result.gone = plan.pages.filter((p) => p.copies.every((c) => removed.get(c.ownerId)?.has(upper(c.pageId)) ?? false)).length;
  return result;
}

// ── the result line ──────────────────────────────────────────────────────

const UNSAVED = "Save or discard the edits in its page editor first.";

/**
 * One line on what an action did, then what it left out and why. "ok" when
 * nothing was left out, "warn" when some was, "err" when nothing was done.
 */
export function bulkResultText(result: BulkResult, devices: readonly LinkDevice[]): WatchPagesNote {
  const name = (id: string) => nameOf(devices, id);
  const parts: string[] = [];
  const per = result.done.map((d) => `${pages(d.count)} ${result.action === "add" ? "to" : result.action === "remove" ? "off" : "on"} ${name(d.ownerId)}`);
  if (result.action === "add" && per.length > 0) {
    parts.push(`Added ${joinWords(per)}.`);
    if (result.also > 0) parts.push(`Their tiles brought ${pages(result.also)} more.`);
  } else if (result.action === "remove" && per.length > 0) {
    parts.push(`Took ${joinWords(per)}.`);
  } else if (result.action === "delete" && (result.gone > 0 || per.length > 0)) {
    parts.push(result.gone > 0 ? `Deleted ${pages(result.gone)}.` : `Deleted ${joinWords(per)}.`);
  }
  const done = parts.length > 0;
  let left = false;
  for (const t of result.taken) {
    left = true;
    parts.push(`Not added to ${name(t.ownerId)}: ${nameList(t.names)}. It already has ${t.names.length === 1 ? "a page" : "pages"} of its own with the same id.`);
  }
  if (result.blocked.length > 0) {
    left = true;
    parts.push(`Not added: ${nameList(result.blocked)}. Every device ${result.blocked.length === 1 ? "it is" : "they are"} on has unsaved edits.`);
  }
  if (result.lastOnly.length > 0) {
    left = true;
    parts.push(`Kept ${nameList(result.lastOnly)}: ${result.lastOnly.length === 1 ? "it" : "they"} would be left on no device. Use Delete for those.`);
  }
  for (const id of result.dirty) {
    left = true;
    parts.push(`Left ${name(id)} alone: its pages have unsaved edits. ${UNSAVED}`);
  }
  for (const f of result.failed) {
    left = true;
    const verb = result.action === "add" ? `Not added to ${name(f.ownerId)}` : result.action === "remove" ? `Not taken off ${name(f.ownerId)}` : `Not deleted on ${name(f.ownerId)}`;
    parts.push(`${verb}: ${f.message.replace(/\.$/, "")}.`);
  }
  if (result.refs.length > 0) {
    left = true;
    parts.push(`Could not clear the menu slots or complication taps that opened them on ${joinWords(result.refs.map(name))}. Change those by hand.`);
  }
  if (!done && !left) {
    const nothing = result.action === "add" ? "Those pages are on those devices already." : result.action === "remove" ? "None of those pages are on those devices." : "Nothing was deleted.";
    return { kind: "ok", text: nothing };
  }
  return { kind: left ? (done ? "warn" : "err") : "ok", text: parts.join(" ") };
}
