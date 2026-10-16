// "Add all watch pages": a watch's pages put on an iPhone as linked pages.
// A phone starts with no pages (`phone-pages.ts`), and this is how a watch's
// whole setup reaches it in one go.
//
// One call does it all in Home Assistant (`watch_pages/link_all`): every
// page the watch lists (never a system page) and every status page goes on
// the phone with its id, linked, so Home Assistant keeps the two in step
// from then on; then the watch's menus and rooms are copied, each only when
// the phone has no record of that kind. They are never linked, and a phone
// that has its own keeps them. Their slots and rooms keep working as they
// are, since the page ids match.
//
// A Speak Phrase slot is copied as it is, though its phrase is one of the
// watch's voice phrases, which a phone does not keep: the note after the add
// says how many such slots will not work on the iPhone.
//
// Plan: app repo docs/linked_pages_plan_2026-10.md, step 3.

import type { WatchConfigPanelKind, WatchPagesLinkAllReply } from "./ha-api.js";
import { listedWatchPages } from "./watch-pages/edit.js";
import { linkErrorText } from "./watch-pages/links.js";
import { type WatchPagesDocument, isJsonObject, watchPageId, watchPagesOf } from "./watch-pages/model.js";
import { watchCommandError } from "./watch-pages/save-note.js";
import type { MenusDocument } from "./watch-menus/model.js";

/** How many slots in the menus run Speak Phrase, every list counted. Its
 * phrase is one of the watch's voice phrases, which a phone does not keep. */
export function speakPhraseSlotCount(menus: MenusDocument): number {
  let n = 0;
  const walk = (value: unknown): void => {
    if (Array.isArray(value)) value.forEach(walk);
    else if (isJsonObject(value)) {
      if (isJsonObject(value.action) && value.action.type === "speakPhrase") n++;
      Object.values(value).forEach(walk);
    }
  };
  walk(menus);
  return n;
}

/** The pages an add brings: every page the watch lists, in its order, but
 * those whose id the phone already holds. For the question's count. */
export function watchPagesToAdd(watchPages: WatchPagesDocument | undefined, phonePages: WatchPagesDocument | undefined): string[] {
  if (watchPages === undefined) return [];
  const held = new Set((phonePages === undefined ? [] : watchPagesOf(phonePages)).map((p) => watchPageId(p).toUpperCase()));
  return listedWatchPages(watchPages).map(watchPageId).filter((id) => id !== "" && !held.has(id.toUpperCase()));
}

// ── the add ──────────────────────────────────────────────────────────────

/** A stored record as the add reads it. */
export interface PhoneCopyRecord {
  revision: number;
  document?: unknown;
}

/** The calls an add needs, so it has no network of its own. */
export interface PhoneAddIO {
  /** `watch_pages/link_all`: every page and status page of `source` onto
   * `target`, and its menus and rooms where `target` has none. */
  linkAll(source: string, target: string): Promise<WatchPagesLinkAllReply>;
  /** Reads a record, for the copied menus' Speak Phrase slots. */
  read(owner: string, kind: WatchConfigPanelKind): Promise<PhoneCopyRecord>;
}

export interface PhoneAddInput {
  watch: string;
  phone: string;
}

export type PhoneAddKind = "pages" | "menus" | "rooms";

export type PhoneAddResult =
  | {
    ok: true;
    /** Pages and status pages the link put on the phone. */
    pages: number; statusPages: number;
    /** What was written: `pages` when anything was linked, then the menus
     * and rooms copied. */
    saved: PhoneAddKind[];
    /** The first page added, to open after the add. */
    firstPageId?: string;
    /** The copied menus' Speak Phrase slots, which do nothing on a phone;
     * absent when none were copied. */
    speakPhraseSlots?: number;
  }
  | { ok: false; code: string; message: string; saved: PhoneAddKind[] };

/** Add the watch's pages to the phone, in one call. The watch's menus are
 * read afterwards only when they were copied, to count their Speak Phrase
 * slots; a failed read there only leaves the count out. */
export async function addWatchPagesToPhone(io: PhoneAddIO, input: PhoneAddInput): Promise<PhoneAddResult> {
  let reply: WatchPagesLinkAllReply;
  try {
    reply = await io.linkAll(input.watch, input.phone);
  } catch (error) {
    const { code = "unknown" } = watchCommandError(error);
    return { ok: false, code, message: linkErrorText(error), saved: [] };
  }
  const pages = Array.isArray(reply?.pages) ? reply.pages.filter((id): id is string => typeof id === "string") : [];
  const statusPages = Array.isArray(reply?.status_pages) ? reply.status_pages.length : 0;
  const copied = Array.isArray(reply?.copied) ? reply.copied : [];
  const saved: PhoneAddKind[] = [];
  if (pages.length > 0 || statusPages > 0) saved.push("pages");
  if (copied.includes("menus")) saved.push("menus");
  if (copied.includes("rooms")) saved.push("rooms");
  if (saved.length === 0) {
    return { ok: false, code: "nothing", message: "The iPhone has every page of this watch already.", saved };
  }
  let speak = 0;
  if (saved.includes("menus")) {
    try {
      const menus = await io.read(input.watch, "menus");
      if (menus.revision > 0 && isJsonObject(menus.document)) speak = speakPhraseSlotCount(menus.document);
    } catch {
      // Not knowing only leaves the count out of the note.
    }
  }
  return {
    ok: true, pages: pages.length, statusPages, saved,
    ...(pages.length > 0 ? { firstPageId: pages[0]! } : {}),
    ...(speak > 0 ? { speakPhraseSlots: speak } : {}),
  };
}

function count(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

function list(words: readonly string[]): string {
  return words.length <= 1 ? (words[0] ?? "") : `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

/** What the page editor says once an add ends. `watchName` is the watch the
 * pages came from. */
export function phoneAddNote(result: PhoneAddResult, watchName: string): { kind: "ok" | "warn" | "err"; text: string } {
  if (result.ok) {
    const what: string[] = [];
    if (result.pages > 0) what.push(count(result.pages, "page", "pages"));
    if (result.statusPages > 0) what.push(count(result.statusPages, "status page", "status pages"));
    if (result.saved.includes("menus")) what.push("the menus");
    if (result.saved.includes("rooms")) what.push("the rooms");
    const linked = result.pages > 0 || result.statusPages > 0 ? " They stay linked: an edit on one device shows on both." : "";
    const speak = result.speakPhraseSlots ?? 0;
    const voice = speak === 0 ? "" : ` ${speak === 1 ? "1 Speak Phrase slot" : `${speak} Speak Phrase slots`} in the menus will not work on the iPhone, which has no voice phrases.`;
    return { kind: "ok", text: `Added ${list(what)} from ${watchName}.${linked}${voice}` };
  }
  if (result.code === "nothing") return { kind: "warn", text: `Nothing added. ${result.message}` };
  const reason = result.message === "" ? "" : `: ${result.message}`;
  return { kind: "err", text: `Not added${reason}` };
}
