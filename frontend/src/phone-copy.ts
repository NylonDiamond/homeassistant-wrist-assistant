// "Copy from watch": a watch's pages copied onto an iPhone, by hand. A phone
// starts with no pages (`phone-pages.ts`), and this is the one way a watch's
// setup reaches it. Nothing keeps the two in step afterwards.
//
// Two scopes. All pages copies the four kinds a phone keeps besides its
// settings: every listed page, every status page, the menus and the rooms.
// One page copies that page and what it links to: the pages its Go to page
// and Peek page tiles open, theirs in turn, and the status pages any of them
// opens. Never `behavior`: a phone's settings are its own.
//
// Every page and status page copied gets a new id, never one the phone or
// the watch already uses, and every link inside the copy (a tile's target, a
// menu slot's page, a room's page) is rewritten to the new ids, so the phone
// and the watch never share a page. A link to something not copied stays as
// it was. Menu slots keep their ids: the app gives its default slots fixed
// ids every device shares (`QuickActionConfig.swift`), and a slot is
// addressed only inside its own record.
//
// Pages and status pages are added after the phone's own. The menus and the
// rooms are one record each, so the watch's take the place of the phone's.
//
// The copy is a save of the phone's own records, the way each editor saves
// them, and never a write to the watch: the watch's records are only read.
// Status pages go first and pages next, so a link is never saved before what
// it opens; then the menus and the rooms, which point at the pages. The
// pages go through the page editor's draft (`savePages`), so the copy is one
// undo step there and lands in History like any save.
//
// Plan: app repo docs/phone_pages_mvp_2026-10.md, step 2.

import type { WatchConfigPanelKind } from "./ha-api.js";
import { listedWatchPages, randomWatchId } from "./watch-pages/edit.js";
import { checkWatchPages, checkWatchPagesValues } from "./watch-pages/merge.js";
import {
  type JsonObject,
  type WatchPage,
  type WatchPagesDocument,
  WATCH_CONFIG_LIMIT_BYTES,
  WATCH_PAGES_LIMIT_BYTES,
  isJsonObject,
  isSmartWatchPage,
  sizeOf,
  tileEntityId,
  tileKind,
  tileTarget,
  watchPageId,
  watchPageTiles,
} from "./watch-pages/model.js";
import { watchCommandError } from "./watch-pages/save-note.js";
import { type MenusDocument, checkWatchMenus, watchMenuAction } from "./watch-menus/model.js";
import { type BehaviorDocument, HOME_ROOMS_LIMIT_BYTES, HOME_ROOM_KEYS, homeRoomsStart } from "./watch-rooms/model.js";
import { ROOM_KEYS } from "./watch-rooms/rules.js";
import { STATUS_PAGES_KEY, type StatusPagesDocument, checkStatusPages, statusPagesEmpty, statusPagesOf } from "./watch-status-pages/model.js";

/** What is copied: every page, or one page and what it links to. */
export type PhoneCopyScope = { kind: "all" } | { kind: "page"; pageId: string };

/** The watch's records, as read. A kind the watch has no record of is
 * undefined. `rooms` is the document its room keys live in on this home:
 * its `behavior`, or its `rooms` record (`roomsKindFor`). */
export interface PhoneCopySource {
  pages: WatchPagesDocument | undefined;
  statusPages: StatusPagesDocument | undefined;
  menus?: MenusDocument | undefined;
  rooms?: BehaviorDocument | undefined;
}

/** The ids the copy must never take: the phone's own pages and status
 * pages. The watch's are added by `planPhoneCopy`. */
export interface PhoneCopyHeld {
  pages: WatchPagesDocument | undefined;
  statusPages: StatusPagesDocument | undefined;
}

/** What one copy adds, with its ids already new and its links rewritten. */
export interface PhoneCopyPlan {
  scope: PhoneCopyScope["kind"];
  /** The copied pages, in the watch's order. */
  pages: WatchPage[];
  statusPages: JsonObject[];
  /** The watch's menus with their links rewritten, for All pages when the
   * watch has menus. */
  menus?: MenusDocument;
  /** The watch's six room keys with their pages rewritten (a key the watch
   * has not set is absent), for All pages when the watch has any. */
  rooms?: BehaviorDocument;
  /** Watch id to phone id, upper case on both sides. */
  pageIds: ReadonlyMap<string, string>;
  statusPageIds: ReadonlyMap<string, string>;
}

const key = (id: unknown): string | undefined => (typeof id === "string" && id !== "" ? id.toUpperCase() : undefined);

/** The page a `page.` or `show_page.` tile opens, or the status page a
 * `status_page.` tile opens, as an upper case id. */
function tileLink(tile: JsonObject): { to: "page" | "status"; id: string } | undefined {
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  const id = key(tileTarget(entityId));
  if (id === undefined) return undefined;
  if (kind === "page" || kind === "show_page") return { to: "page", id };
  if (kind === "status_page") return { to: "status", id };
  return undefined;
}

/** What one page reaches: itself, every listed page its links open in turn,
 * and the status pages any of them opens, in the watch's order. A link to a
 * page the watch does not list is not followed. */
export function phoneCopyReach(pages: WatchPagesDocument, pageId: string): { pageIds: string[]; statusPageIds: string[] } {
  const listed = listedWatchPages(pages);
  const byId = new Map<string, WatchPage>();
  for (const page of listed) {
    const id = key(page.id);
    if (id !== undefined && !byId.has(id)) byId.set(id, page);
  }
  const start = key(pageId);
  if (start === undefined || !byId.has(start)) return { pageIds: [], statusPageIds: [] };
  const seen = new Set([start]);
  const status: string[] = [];
  const queue = [start];
  while (queue.length > 0) {
    const page = byId.get(queue.shift()!)!;
    if (isSmartWatchPage(page)) continue;
    for (const tile of watchPageTiles(page)) {
      const link = tileLink(tile);
      if (link === undefined) continue;
      if (link.to === "status") {
        if (!status.includes(link.id)) status.push(link.id);
      } else if (byId.has(link.id) && !seen.has(link.id)) {
        seen.add(link.id);
        queue.push(link.id);
      }
    }
  }
  return { pageIds: listed.flatMap((p) => key(p.id) ?? []).filter((id) => seen.has(id)), statusPageIds: status };
}

/** A copied page: its new id, and every tile that opens a copied page or
 * status page pointed at the copy. */
function rewritePage(page: WatchPage, pageIds: ReadonlyMap<string, string>, statusIds: ReadonlyMap<string, string>): WatchPage {
  const copy = structuredClone(page);
  copy.id = pageIds.get(key(page.id)!)!;
  if (Array.isArray(copy.items)) {
    copy.items = copy.items.map((tile: unknown) => {
      if (!isJsonObject(tile)) return tile;
      const link = tileLink(tile);
      const to = link === undefined ? undefined : (link.to === "page" ? pageIds : statusIds).get(link.id);
      return to === undefined ? tile : { ...tile, entityId: `${tileKind(tileEntityId(tile))}.${to}` };
    });
  }
  return copy;
}

/** Every slot action in the menus whose page or status page was copied,
 * pointed at the copy. The action table names which payload keys are pages
 * (`menu-actions.json`), so every list is covered: the Anywhere menu, each
 * domain's list and each entity's own. */
function rewriteMenus(menus: MenusDocument, pageIds: ReadonlyMap<string, string>, statusIds: ReadonlyMap<string, string>): MenusDocument {
  const walk = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(walk);
    if (!isJsonObject(value)) return value;
    const out: JsonObject = {};
    for (const [k, v] of Object.entries(value)) out[k] = walk(v);
    const action = out.action;
    if (isJsonObject(action) && typeof action.type === "string") {
      let next = action;
      for (const spec of watchMenuAction(action.type)?.payload ?? []) {
        const map = spec.target === "page" ? pageIds : spec.target === "statusPage" ? statusIds : undefined;
        const to = map?.get(key(action[spec.key]) ?? "");
        if (to !== undefined) next = { ...next, [spec.key]: to };
      }
      out.action = next;
    }
    return out;
  };
  return walk(menus) as MenusDocument;
}

/** The watch's six room keys, its pages pointed at the copies: the fallback
 * page and each room's page. Undefined when the watch has none set. */
function copiedRooms(rooms: BehaviorDocument, pageIds: ReadonlyMap<string, string>): BehaviorDocument | undefined {
  const out: BehaviorDocument = {};
  const page = (value: unknown): unknown => (typeof value === "string" ? pageIds.get(value.trim().toUpperCase()) ?? value : value);
  for (const k of HOME_ROOM_KEYS) {
    if (!Object.hasOwn(rooms, k) || rooms[k] === undefined || rooms[k] === null) continue;
    let value: unknown = structuredClone(rooms[k]);
    if (k === ROOM_KEYS.fallback) value = page(value);
    if (k === ROOM_KEYS.mappings && isJsonObject(value)) value = Object.fromEntries(Object.entries(value).map(([room, id]) => [room, page(id)]));
    out[k] = value;
  }
  return Object.keys(out).length === 0 ? undefined : out;
}

/**
 * What a copy adds, worked out from the records alone. New ids come from
 * `newId` (upper cased), drawn again while one is taken: a page or status
 * page id of the phone or of the watch, or one this copy already gave out.
 * Undefined when there is nothing to copy (no pages on the watch, or the one
 * page asked for is not one it lists).
 */
export function planPhoneCopy(
  source: PhoneCopySource,
  held: PhoneCopyHeld,
  scope: PhoneCopyScope,
  newId: () => string = randomWatchId,
): PhoneCopyPlan | undefined {
  const watchPages = source.pages === undefined ? [] : listedWatchPages(source.pages);
  const watchStatus = statusPagesOf(source.statusPages);
  let pageKeys: string[];
  let statusKeys: string[];
  if (scope.kind === "all") {
    pageKeys = watchPages.flatMap((p) => key(p.id) ?? []);
    statusKeys = watchStatus.flatMap((p) => key(p.id) ?? []);
  } else {
    if (source.pages === undefined) return undefined;
    const reach = phoneCopyReach(source.pages, scope.pageId);
    pageKeys = reach.pageIds;
    // Only the status pages the watch has: a tile opening one it lost has
    // nothing to copy and stays as it is.
    statusKeys = reach.statusPageIds.filter((id) => watchStatus.some((p) => key(p.id) === id));
  }
  if (pageKeys.length === 0) return undefined;

  const taken = new Set<string>();
  const take = (id: unknown) => { const k = key(id); if (k !== undefined) taken.add(k); };
  watchPagesOfAny(held.pages).forEach((p) => take(p.id));
  statusPagesOf(held.statusPages).forEach((p) => take(p.id));
  watchPagesOfAny(source.pages).forEach((p) => take(p.id));
  watchStatus.forEach((p) => take(p.id));
  const fresh = (): string => {
    for (;;) {
      const id = newId().toUpperCase();
      if (id !== "" && !taken.has(id)) {
        taken.add(id);
        return id;
      }
    }
  };
  const pageIds = new Map(pageKeys.map((id) => [id, fresh()] as const));
  const statusPageIds = new Map(statusKeys.map((id) => [id, fresh()] as const));

  const pages = watchPages.filter((p) => pageIds.has(key(p.id) ?? "")).map((p) => rewritePage(p, pageIds, statusPageIds));
  const statusPages = watchStatus
    .filter((p) => statusPageIds.has(key(p.id) ?? ""))
    .map((p) => ({ ...structuredClone(p), id: statusPageIds.get(key(p.id)!)! }));
  const plan: PhoneCopyPlan = { scope: scope.kind, pages, statusPages, pageIds, statusPageIds };
  if (scope.kind === "all") {
    if (source.menus !== undefined) plan.menus = rewriteMenus(source.menus, pageIds, statusPageIds);
    const rooms = source.rooms === undefined ? undefined : copiedRooms(source.rooms, pageIds);
    if (rooms !== undefined) plan.rooms = rooms;
  }
  return plan;
}

/** Every page of a document, system pages too, for the ids in use. */
function watchPagesOfAny(document: WatchPagesDocument | undefined): JsonObject[] {
  const pages = document?.pages;
  return Array.isArray(pages) ? pages.filter(isJsonObject) : [];
}

/** The phone's pages with the copies added after its own. A phone with no
 * pages record gets a new one, at schema 1 as a first page is saved. */
export function withCopiedPages(phone: WatchPagesDocument | undefined, plan: PhoneCopyPlan): WatchPagesDocument {
  if (phone === undefined) return { pages: plan.pages, schemaVersion: 1 };
  const pages = Array.isArray(phone.pages) ? phone.pages : [];
  return { ...phone, pages: [...pages, ...plan.pages] };
}

/** The phone's status pages with the copies added after its own. */
export function withCopiedStatusPages(phone: StatusPagesDocument | undefined, plan: PhoneCopyPlan): StatusPagesDocument {
  const base = phone ?? statusPagesEmpty();
  const list = Array.isArray(base[STATUS_PAGES_KEY]) ? (base[STATUS_PAGES_KEY] as unknown[]) : [];
  return { ...base, [STATUS_PAGES_KEY]: [...list, ...plan.statusPages] };
}

/** The phone's rooms record with the watch's room keys in place of its own.
 * A key the watch has not set leaves the phone's record too. */
export function withCopiedRooms(phone: BehaviorDocument | undefined, rooms: BehaviorDocument): BehaviorDocument {
  const out: BehaviorDocument = { ...(phone ?? homeRoomsStart()) };
  for (const k of HOME_ROOM_KEYS) delete out[k];
  return { ...out, ...rooms };
}

/** "812 KB", as the editors' foot bars say a size. */
function kb(bytes: number): string {
  return `${Math.ceil(bytes / 1024)} KB`;
}

/** Why a record the copy would save cannot be: the editor's own checks for
 * that kind, then the size Home Assistant keeps of it. Empty when it can. */
export function phoneCopyProblems(kind: "pages" | "status_pages" | "menus" | "rooms", document: JsonObject): string[] {
  const noun = { pages: "pages", status_pages: "status pages", menus: "menus", rooms: "rooms" }[kind];
  const limit = kind === "pages" ? WATCH_PAGES_LIMIT_BYTES : kind === "rooms" ? HOME_ROOMS_LIMIT_BYTES : WATCH_CONFIG_LIMIT_BYTES;
  const shape = kind === "pages" ? checkWatchPages(document)
    : kind === "status_pages" ? checkStatusPages(document)
    : kind === "menus" ? checkWatchMenus(document)
    : [];
  const problems = shape.length > 0 || kind !== "pages" ? shape : checkWatchPagesValues(document);
  if (problems.length > 0) return problems;
  const size = sizeOf(document);
  return size > limit ? [`With the copy the iPhone's ${noun} would be ${kb(size)}, more than the ${kb(limit)} Home Assistant keeps.`] : [];
}

// ── the copy ─────────────────────────────────────────────────────────────

/** A stored record as the copy reads it. */
export interface PhoneCopyRecord {
  revision: number;
  document: unknown;
}

/** The calls a copy needs, so it has no network of its own. Every save goes
 * to the phone; nothing here can write a record of the watch. */
export interface PhoneCopyIO {
  read(owner: string, kind: WatchConfigPanelKind): Promise<PhoneCopyRecord>;
  /** Saves one of the phone's records over `baseRevision` (0 makes the
   * first). Rejects with `conflict` when Home Assistant holds a newer one. */
  savePhone(kind: "status_pages" | "menus" | "rooms", baseRevision: number, document: JsonObject): Promise<{ revision: number }>;
  /** Saves the phone's pages, as the page editor saves them. */
  savePages(document: WatchPagesDocument): Promise<{ ok: boolean; code?: string; message?: string }>;
}

export interface PhoneCopyInput {
  watch: string;
  /** Where the watch keeps its rooms on this home (`roomsKindFor`). */
  watchRooms: "behavior" | "rooms";
  phone: string;
  scope: PhoneCopyScope;
  /** The phone's pages as the editor holds them now; undefined with no
   * record yet. */
  phonePages: WatchPagesDocument | undefined;
  newId?: () => string;
}

/** The kinds a copy saves, in the order it saves them. */
export type PhoneCopyKind = "status_pages" | "pages" | "menus" | "rooms";

export type PhoneCopyResult =
  | { ok: true; pages: number; statusPages: number; saved: PhoneCopyKind[]; firstPageId: string }
  | { ok: false; code: string; message: string; stage?: PhoneCopyKind; saved: PhoneCopyKind[]; problems?: string[] };

/** The most saves one record is sent before conflicts end the copy. */
export const PHONE_COPY_SAVE_ATTEMPTS = 3;

const docOf = (record: PhoneCopyRecord): JsonObject | undefined =>
  record.revision > 0 && isJsonObject(record.document) ? record.document : undefined;

class CopyStop extends Error {
  constructor(readonly code: string, message: string, readonly stage?: PhoneCopyKind, readonly problems?: string[]) {
    super(message);
  }
}

/** One of the phone's records saved as `build` makes it from the copy
 * Home Assistant holds; a conflict reads it again and builds again. */
async function saveRebuilt(
  io: PhoneCopyIO,
  phone: string,
  kind: "status_pages" | "menus" | "rooms",
  first: PhoneCopyRecord,
  build: (held: JsonObject | undefined) => JsonObject,
): Promise<void> {
  let record = first;
  for (let attempt = 1; ; attempt++) {
    const document = build(docOf(record));
    const problems = phoneCopyProblems(kind, document);
    if (problems.length > 0) throw new CopyStop("invalid", problems.join(" "), kind, problems);
    try {
      await io.savePhone(kind, Math.max(0, record.revision), document);
      return;
    } catch (error) {
      const { code = "unknown", message } = watchCommandError(error);
      if (code !== "conflict" || attempt >= PHONE_COPY_SAVE_ATTEMPTS) throw new CopyStop(code, message, kind);
      record = await readRecord(io, phone, kind);
    }
  }
}

async function readRecord(io: PhoneCopyIO, owner: string, kind: WatchConfigPanelKind): Promise<PhoneCopyRecord> {
  try {
    return await io.read(owner, kind);
  } catch (error) {
    const { code = "unknown", message } = watchCommandError(error);
    // An integration older than a kind refuses it: then there is none.
    if (code === "invalid" || code === "unknown_command") return { revision: 0, document: null };
    throw new CopyStop(code, message);
  }
}

/**
 * Copy from the watch onto the phone: read the watch's records and the
 * phone's, work the copy out, check every record it would save, and only
 * then save them, status pages, pages, menus, rooms. A check that fails
 * sends nothing. A save that fails ends the copy there, and the result says
 * which kinds were saved before it.
 */
export async function copyToPhone(io: PhoneCopyIO, input: PhoneCopyInput): Promise<PhoneCopyResult> {
  const saved: PhoneCopyKind[] = [];
  const all = input.scope.kind === "all";
  try {
    const [pages, status, menus, rooms, phoneStatus, phoneMenus, phoneRooms] = await Promise.all([
      readRecord(io, input.watch, "pages"),
      readRecord(io, input.watch, "status_pages"),
      all ? readRecord(io, input.watch, "menus") : undefined,
      all ? readRecord(io, input.watch, input.watchRooms) : undefined,
      readRecord(io, input.phone, "status_pages"),
      all ? readRecord(io, input.phone, "menus") : undefined,
      all ? readRecord(io, input.phone, "rooms") : undefined,
    ]);
    const plan = planPhoneCopy(
      {
        pages: docOf(pages),
        statusPages: docOf(status),
        menus: menus === undefined ? undefined : docOf(menus),
        rooms: rooms === undefined ? undefined : docOf(rooms),
      },
      { pages: input.phonePages, statusPages: docOf(phoneStatus) },
      input.scope,
      input.newId,
    );
    if (plan === undefined) {
      return { ok: false, code: "nothing", message: all ? "The watch has no pages to copy." : "The watch no longer has that page.", saved };
    }

    // Every record is checked before the first is sent.
    const nextPages = withCopiedPages(input.phonePages, plan);
    const checks: [PhoneCopyKind, JsonObject | undefined][] = [
      ["status_pages", plan.statusPages.length > 0 ? withCopiedStatusPages(docOf(phoneStatus), plan) : undefined],
      ["pages", nextPages],
      ["menus", plan.menus],
      ["rooms", plan.rooms === undefined ? undefined : withCopiedRooms(phoneRooms === undefined ? undefined : docOf(phoneRooms), plan.rooms)],
    ];
    for (const [kind, document] of checks) {
      if (document === undefined) continue;
      const problems = phoneCopyProblems(kind, document);
      if (problems.length > 0) return { ok: false, code: "invalid", message: problems.join(" "), stage: kind, saved, problems };
    }

    if (plan.statusPages.length > 0) {
      await saveRebuilt(io, input.phone, "status_pages", phoneStatus, (held) => withCopiedStatusPages(held, plan));
      saved.push("status_pages");
    }
    const result = await io.savePages(nextPages);
    if (!result.ok) {
      return { ok: false, code: result.code ?? "unknown", message: result.message ?? "", stage: "pages", saved };
    }
    saved.push("pages");
    if (plan.menus !== undefined && phoneMenus !== undefined) {
      const menusDoc = plan.menus;
      await saveRebuilt(io, input.phone, "menus", phoneMenus, () => menusDoc);
      saved.push("menus");
    }
    if (plan.rooms !== undefined && phoneRooms !== undefined) {
      const roomKeys = plan.rooms;
      await saveRebuilt(io, input.phone, "rooms", phoneRooms, (held) => withCopiedRooms(held, roomKeys));
      saved.push("rooms");
    }
    return { ok: true, pages: plan.pages.length, statusPages: plan.statusPages.length, saved, firstPageId: watchPageId(plan.pages[0]!) };
  } catch (error) {
    if (error instanceof CopyStop) {
      return {
        ok: false, code: error.code, message: error.message, saved,
        ...(error.stage === undefined ? {} : { stage: error.stage }),
        ...(error.problems === undefined ? {} : { problems: error.problems }),
      };
    }
    const { code = "unknown", message } = watchCommandError(error);
    return { ok: false, code, message, saved };
  }
}

/** The kinds in a sentence: "the status pages and the menus". */
function kindsText(kinds: readonly PhoneCopyKind[]): string {
  const words = kinds.map((k) => ({ status_pages: "the status pages", pages: "the pages", menus: "the menus", rooms: "the rooms" }[k]));
  return words.length <= 1 ? (words[0] ?? "") : `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

function count(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/** What the page editor says once a copy ends. `watchName` is the watch
 * copied from. */
export function phoneCopyNote(result: PhoneCopyResult, watchName: string): { kind: "ok" | "warn" | "err"; text: string } {
  if (result.ok) {
    const what = [count(result.pages, "page", "pages")];
    if (result.statusPages > 0) what.push(count(result.statusPages, "status page", "status pages"));
    if (result.saved.includes("menus")) what.push("the menus");
    if (result.saved.includes("rooms")) what.push("the rooms");
    const list = what.length === 1 ? what[0]! : `${what.slice(0, -1).join(", ")} and ${what[what.length - 1]}`;
    return { kind: "ok", text: `Copied ${list} from ${watchName}. The iPhone picks them up the next time it checks. Undo takes the pages back.` };
  }
  const reason = result.message === "" ? "" : `: ${result.message}`;
  if (result.code === "nothing") return { kind: "warn", text: `Nothing copied. ${result.message}` };
  if (result.saved.length === 0) return { kind: "err", text: `Not copied${reason}` };
  return { kind: "warn", text: `Copied ${kindsText(result.saved)}, then stopped${reason}` };
}
