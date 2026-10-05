// The iPhone's library as the page editor reads it: the `catalog` watch
// config kind, which the phone publishes and nobody else writes. It names
// every HTTP action and status page a tile can point at (id, name and a few
// flags), never a URL, header or body. An older phone also lists its macros
// (`macros`); macros were removed, so that list is not read. Since part 3f
// batch 2 it also carries the phone's voice defaults (`voice`), which an
// assist or speak tile falls back to.
//
// No DOM here. `<wa-page-editor>` reads the record beside the pages record,
// keeps the reading on the element (never in the draft: it is never saved,
// undone or merged) and hands it to the modules on its host
// (`WatchPagesEditorHost.catalog`). Undefined there means no catalog: an app
// older than the kind, or a phone that has not published one yet. The
// pickers read it with the home's HTTP action library joined in
// (`http-library.ts`): its actions first, the phone's own after them.
//
// The reader is forgiving: an element without a UUID string `id` and a string
// `name` is skipped, and so is a second entry whose id differs only in case;
// an unknown key is ignored, a flag of the wrong type reads as absent, and so
// does a voice field of the wrong type or a blank one. Ids are
// compared without regard to case, as the phone's `UUID(uuidString:)` reads
// them.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md ("3e build contract").

import type { WatchConfigRecord } from "../ha-api.js";
import { sameWatchId } from "./edit.js";
import { isJsonObject, tileKind, tileTarget } from "./model.js";
import { isWatchUUID } from "./tile-settings-model.js";

/** One HTTP action. `icon` and `iconColor` style a picker row only; they
 * never reach a tile. */
export interface WatchCatalogHTTPAction {
  id: string;
  /** The label the phone's add writes: the trimmed name, else
   * "HTTP Action". Never the URL. */
  name: string;
  icon?: string;
  iconColor?: string;
  /** The action has a Reply Value, so a tile can show it (Tile Value). */
  hasReply: boolean;
  /** The action has no URL yet: on this iPhone (restored from a backup),
   * or in Home Assistant's library. */
  needsSetup: boolean;
  /** Where the action lives, once the home's library is joined in
   * (`http-library.ts`): Home Assistant's library, or only this watch's
   * iPhone. Absent on a catalog read on its own, which is all the iPhone's. */
  source?: "home" | "iphone";
}

/** One status page of the primary home. */
export interface WatchCatalogStatusPage {
  id: string;
  name: string;
  /** How many rows, when the phone said. */
  rows?: number;
}

/** The two library kinds, as the Add task and a tile's target name them. */
export type WatchLibraryKind = "httpAction" | "statusPage";

export type WatchCatalogEntry = WatchCatalogHTTPAction | WatchCatalogStatusPage;

/** The phone's voice defaults (part 3f batch 2): what an assist or speak
 * tile with no voice of its own falls back to. Each field only when the
 * phone has one; `{}` when it has none. */
export interface WatchCatalogVoice {
  /** The conversation agent's id (`conversation.<x>`). */
  defaultAssistAgentId?: string;
  /** Media player ids, in the phone's stored order. */
  defaultSpeakers?: readonly string[];
  /** The TTS engine's id. */
  defaultTTSEngine?: string;
}

/** The catalog as read. Lists keep the phone's library order. */
export interface WatchCatalog {
  /** The record's revision, for the live line: an event with another
   * revision reads it again. */
  revision: number;
  /** When the phone published it (ISO), when the record says. */
  updatedAt: string | undefined;
  httpActions: readonly WatchCatalogHTTPAction[];
  statusPages: readonly WatchCatalogStatusPage[];
  /** The phone's voice defaults. Undefined when the document has no `voice`
   * object: a phone older than the key, which cannot say. Never saved. */
  voice: WatchCatalogVoice | undefined;
  /** `statusPages` are the watch's own status pages record (the
   * `status_pages` kind), not the phone's list (`watchCatalogWithStatusPages`). */
  statusPagesFromWatch?: true;
  /** No iPhone catalog is behind this one: only the watch's status pages
   * (and the home's HTTP actions, when `httpLibrary` is "held") are known,
   * and the rest are not. */
  noPhone?: true;
  /** Home Assistant keeps the home's HTTP action library
   * (`http-library.ts`): "held" when it holds one, and `httpActions` lead
   * with its actions; "empty" when it holds none yet, and the list is the
   * iPhone's alone. Absent with an integration older than the library. */
  httpLibrary?: "held" | "empty";
}

/** The tile kind (`entityId` prefix before the dot) of each library kind. */
export const WATCH_LIBRARY_TILE_KINDS: Readonly<Record<WatchLibraryKind, string>> = {
  httpAction: "http_action",
  statusPage: "status_page",
};

/** The line shown in place of the library lists when there is no catalog. */
export const WATCH_NO_CATALOG_TEXT = "Open the iPhone app to list its HTTP actions and status pages here.";

/** What a tile whose library entry the catalog does not list says. */
export const WATCH_NOT_ON_IPHONE_TEXT = "Not on the iPhone";

// ── reading ──────────────────────────────────────────────────────────────

function text(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function count(value: unknown): number | undefined {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : undefined;
}

/** The objects of a list with a UUID string `id` and a string `name`, the
 * first of ids that differ only in case; anything else, and a value that is
 * no list, gives nothing. The id is a tile's `entityId` suffix and a slide
 * target, which the phone types `UUID`, so an entry with any other id could
 * never be picked. */
function entries(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.filter((e): e is Record<string, unknown> => {
    if (!isJsonObject(e) || !isWatchUUID(e.id) || typeof e.name !== "string") return false;
    const key = e.id.toUpperCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function withOptional<T extends object>(out: T, key: string, value: unknown): T {
  if (value !== undefined) (out as Record<string, unknown>)[key] = value;
  return out;
}

/** A string that is not blank, as stored; undefined otherwise. */
function filled(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

/** The `voice` object read: each field only when typed right. A speaker
 * list keeps its strings that are not blank, in order, and is left out
 * when none is left, as the phone leaves out an empty one. */
function readVoice(value: Record<string, unknown>): WatchCatalogVoice {
  const out: WatchCatalogVoice = {};
  withOptional(out, "defaultAssistAgentId", filled(value.defaultAssistAgentId));
  const speakers = Array.isArray(value.defaultSpeakers)
    ? value.defaultSpeakers.filter((s): s is string => filled(s) !== undefined)
    : [];
  if (speakers.length > 0) out.defaultSpeakers = speakers;
  return withOptional(out, "defaultTTSEngine", filled(value.defaultTTSEngine));
}

/**
 * The catalog document read into typed lists. `meta` carries the record's
 * revision and time. A document that is no object reads as an empty
 * catalog.
 */
export function readWatchCatalog(document: unknown, meta: { revision?: number; updatedAt?: string | null } = {}): WatchCatalog {
  const doc = isJsonObject(document) ? document : {};
  const httpActions = entries(doc.httpActions).map((e) => {
    const out: WatchCatalogHTTPAction = { id: e.id as string, name: e.name as string, hasReply: e.hasReply === true, needsSetup: e.needsSetup === true };
    withOptional(out, "icon", text(e.icon));
    return withOptional(out, "iconColor", text(e.iconColor));
  });
  const statusPages = entries(doc.statusPages).map((e) =>
    withOptional<WatchCatalogStatusPage>({ id: e.id as string, name: e.name as string }, "rows", count(e.rows)),
  );
  return {
    revision: typeof meta.revision === "number" ? meta.revision : 0,
    updatedAt: typeof meta.updatedAt === "string" ? meta.updatedAt : undefined,
    httpActions,
    statusPages,
    voice: isJsonObject(doc.voice) ? readVoice(doc.voice) : undefined,
  };
}

/** The catalog of a `catalog` record, or undefined when the phone has
 * published none (revision 0) or there is no record. */
export function watchCatalogFromRecord(record: WatchConfigRecord | undefined): WatchCatalog | undefined {
  if (record === undefined || !(record.revision > 0)) return undefined;
  return readWatchCatalog(record.document, { revision: record.revision, updatedAt: record.updated_at });
}

/**
 * The status pages of a `status_pages` record, as the pickers list them (id,
 * name and how many rows), read as the catalog's list is. Undefined when
 * Home Assistant holds no record (revision 0, or none read): the pickers then
 * fall back to the phone's catalog.
 */
export function watchStatusPagesFromRecord(record: { revision: number; document?: unknown } | undefined): WatchCatalogStatusPage[] | undefined {
  if (record === undefined || !(record.revision > 0)) return undefined;
  const doc = isJsonObject(record.document) ? record.document : {};
  return entries(doc.statusPages).map((e) => {
    const out: WatchCatalogStatusPage = { id: e.id as string, name: e.name as string };
    return Array.isArray(e.rows) ? withOptional(out, "rows", e.rows.length) : out;
  });
}

/**
 * The catalog the pickers read: the watch's own status pages first, when
 * Home Assistant holds a record of them, else the phone's list. With no
 * phone catalog the watch's pages still come through, on a catalog marked
 * `noPhone` whose other lists are empty and unknown.
 */
export function watchCatalogWithStatusPages(catalog: WatchCatalog | undefined, statusPages: readonly WatchCatalogStatusPage[] | undefined): WatchCatalog | undefined {
  if (statusPages === undefined) return catalog;
  if (catalog !== undefined) return { ...catalog, statusPages, statusPagesFromWatch: true };
  return { revision: 0, updatedAt: undefined, httpActions: [], statusPages, voice: undefined, statusPagesFromWatch: true, noPhone: true };
}

/** Whether the catalog knows the entries of a kind: an iPhone catalog knows
 * both; without one, the watch's status pages know only those, and
 * the home's HTTP action library only those. */
export function watchCatalogKnows(catalog: WatchCatalog | undefined, kind: WatchLibraryKind): boolean {
  if (catalog === undefined) return false;
  if (catalog.noPhone !== true) return true;
  if (kind === "httpAction") return catalog.httpLibrary === "held";
  return kind === "statusPage" && catalog.statusPagesFromWatch === true;
}

/** Whether the HTTP actions screen can add to the list: the integration
 * keeps the home's library, held or not yet. */
export function watchHttpScreenOffered(catalog: WatchCatalog | undefined): boolean {
  return catalog?.httpLibrary !== undefined;
}

/** Whether the entries of a kind come from the watch's own record. */
export function watchCatalogFromWatch(catalog: WatchCatalog | undefined, kind: WatchLibraryKind): boolean {
  return kind === "statusPage" && catalog?.statusPagesFromWatch === true;
}

/** What a tile whose status page the watch's own record does not list says. */
export const WATCH_NOT_IN_STATUS_PAGES_TEXT = "Not in this watch's status pages";

/** The line in place of the HTTP action list when the watch's status pages
 * are known and no iPhone catalog is. */
export const WATCH_NO_PHONE_LIBRARY_TEXT = "Open the iPhone app to list its HTTP actions here.";

/** The line in place of the status page list when the home's HTTP actions
 * are known and no iPhone catalog is. */
export const WATCH_NO_PHONE_STATUS_PAGES_TEXT = "Open the iPhone app to list its status pages here.";

/** The line in place of the list Home Assistant does not know without an
 * iPhone catalog: the HTTP actions unless the home's library lists them, the
 * status pages unless the watch's own record does. Undefined when both are
 * known. */
export function watchNoPhoneLibraryText(catalog: WatchCatalog | undefined): string | undefined {
  if (catalog?.httpLibrary !== "held") return WATCH_NO_PHONE_LIBRARY_TEXT;
  return catalog.statusPagesFromWatch === true ? undefined : WATCH_NO_PHONE_STATUS_PAGES_TEXT;
}

/** What a tile whose HTTP action Home Assistant's library, the only list
 * there is, does not hold says. */
export const WATCH_NOT_IN_LIST_TEXT = "Not in the list";

/** What an iPhone action says in a list that leads with the home's. */
export const WATCH_ON_IPHONE_TEXT = "On the iPhone";

/** Whether the home's library is the only list of HTTP actions: Home
 * Assistant holds one and no iPhone catalog is behind it. */
function httpLibraryOnly(catalog: WatchCatalog | undefined): boolean {
  return catalog?.httpLibrary === "held" && catalog.noPhone === true;
}

/** What a tile whose library entry is not listed says: "Not on the iPhone";
 * for a status page from the watch's own record "Not in this watch's
 * status pages"; for an HTTP action when the home's library is the only
 * list, "Not in the list". */
export function watchLibraryMissingText(catalog: WatchCatalog | undefined, kind: WatchLibraryKind): string {
  if (watchCatalogFromWatch(catalog, kind)) return WATCH_NOT_IN_STATUS_PAGES_TEXT;
  if (kind === "httpAction" && httpLibraryOnly(catalog)) return WATCH_NOT_IN_LIST_TEXT;
  return WATCH_NOT_ON_IPHONE_TEXT;
}

/** The line where a list of HTTP actions is empty and the HTTP actions
 * screen can add one. */
export const WATCH_NO_HTTP_ACTIONS_TEXT = "No HTTP actions yet. Add one on the HTTP actions screen, or in the iPhone app.";

/** Who lists the entries of a kind, for "The iPhone lists no …": the
 * iPhone, or this watch for its own status pages. */
export function watchLibraryLister(catalog: WatchCatalog | undefined, kind: WatchLibraryKind): string {
  return watchCatalogFromWatch(catalog, kind) ? "This watch" : "The iPhone";
}

/** Whether a failed read of the catalog means there is none: an integration
 * older than the kind refuses it as `invalid` ("kind must be one of ..."),
 * and one older than the store does not know the command. Anything else (a
 * dropped socket) says nothing about the phone's library. */
export function watchCatalogReadMeansNone(error: unknown): boolean {
  const code = isJsonObject(error) ? error.code : undefined;
  return code === "invalid" || code === "unknown_command";
}

/** Whether a live line event means the catalog should be read again: a
 * `catalog` event whose revision is not the one held (0 when none is
 * held). Every other kind is someone else's. */
export function watchCatalogEventIsNews(event: { kind?: unknown; revision?: unknown }, held: WatchCatalog | undefined): boolean {
  return event.kind === "catalog" && event.revision !== (held?.revision ?? 0);
}

// ── looking up ───────────────────────────────────────────────────────────

/** The entries of one kind, in library order. */
export function watchCatalogEntries(catalog: WatchCatalog, kind: "httpAction"): readonly WatchCatalogHTTPAction[];
export function watchCatalogEntries(catalog: WatchCatalog, kind: "statusPage"): readonly WatchCatalogStatusPage[];
export function watchCatalogEntries(catalog: WatchCatalog, kind: WatchLibraryKind): readonly WatchCatalogEntry[];
export function watchCatalogEntries(catalog: WatchCatalog, kind: WatchLibraryKind): readonly WatchCatalogEntry[] {
  return kind === "httpAction" ? catalog.httpActions : catalog.statusPages;
}

/** The first entry of a kind with this id, compared without regard to
 * case; undefined with no catalog or no such entry. */
export function findWatchCatalogEntry(catalog: WatchCatalog | undefined, kind: "httpAction", id: unknown): WatchCatalogHTTPAction | undefined;
export function findWatchCatalogEntry(catalog: WatchCatalog | undefined, kind: "statusPage", id: unknown): WatchCatalogStatusPage | undefined;
export function findWatchCatalogEntry(catalog: WatchCatalog | undefined, kind: WatchLibraryKind, id: unknown): WatchCatalogEntry | undefined;
export function findWatchCatalogEntry(catalog: WatchCatalog | undefined, kind: WatchLibraryKind, id: unknown): WatchCatalogEntry | undefined {
  if (catalog === undefined) return undefined;
  return watchCatalogEntries(catalog, kind).find((e) => sameWatchId(e.id, id));
}

/** The library entry a tile points at through its `entityId`
 * (`http_action.<ID>`, `status_page.<ID>`), the id as stored; undefined for
 * any other tile, a removed macro tile among them. */
export function watchLibraryTarget(entityId: string): { kind: WatchLibraryKind; id: string } | undefined {
  const tile = tileKind(entityId);
  const kind = (Object.keys(WATCH_LIBRARY_TILE_KINDS) as WatchLibraryKind[]).find((k) => WATCH_LIBRARY_TILE_KINDS[k] === tile);
  return kind === undefined ? undefined : { kind, id: tileTarget(entityId) };
}

/** The watch's own fallbacks for a library tile with no label of its own. */
const LIBRARY_LABEL_FALLBACKS: Readonly<Record<WatchLibraryKind, string>> = {
  httpAction: "Action",
  statusPage: "Status Page",
};

/**
 * The name the watch shows on a library tile with no label of its own: on
 * an HTTP action tile always "Action", never the action's name; on a status
 * page tile the catalog's name for its target, else "Status Page".
 * Undefined for any other tile.
 */
export function watchLibraryTileFallbackName(entityId: string, catalog: WatchCatalog | undefined): string | undefined {
  const target = watchLibraryTarget(entityId);
  if (target === undefined) return undefined;
  if (target.kind === "httpAction") return LIBRARY_LABEL_FALLBACKS.httpAction;
  return findWatchCatalogEntry(catalog, target.kind, target.id)?.name ?? LIBRARY_LABEL_FALLBACKS[target.kind];
}

// ── words ────────────────────────────────────────────────────────────────

/** The phone's subtitle for an entry: "6 rows" for a status page,
 * undefined when it has none. */
export function watchCatalogSubtitle(kind: WatchLibraryKind, entry: WatchCatalogEntry): string | undefined {
  if (kind === "statusPage") {
    const rows = (entry as WatchCatalogStatusPage).rows;
    return rows === undefined ? undefined : `${rows} row${rows === 1 ? "" : "s"}`;
  }
  return undefined;
}

/** What is wrong with an entry, in the phone's words, or undefined. The
 * panel still offers it, as the phone does. An action of the home's library
 * needs setup in Home Assistant, not on the iPhone. */
export function watchCatalogWarning(kind: WatchLibraryKind, entry: WatchCatalogEntry): string | undefined {
  if (kind === "httpAction" && (entry as WatchCatalogHTTPAction).needsSetup) {
    return (entry as WatchCatalogHTTPAction).source === "home" ? "Needs setup" : "Needs setup on the iPhone";
  }
  return undefined;
}

/** What a list says beside an entry's name: its warning, else "On the
 * iPhone" for an iPhone action in a list that leads with the home's. */
export function watchCatalogMark(kind: WatchLibraryKind, entry: WatchCatalogEntry): string | undefined {
  const warning = watchCatalogWarning(kind, entry);
  if (warning !== undefined) return warning;
  return kind === "httpAction" && (entry as WatchCatalogHTTPAction).source === "iphone" ? WATCH_ON_IPHONE_TEXT : undefined;
}

/** What one library kind is called, singular and plural. */
export const WATCH_LIBRARY_WORDS: Readonly<Record<WatchLibraryKind, { one: string; many: string }>> = {
  httpAction: { one: "HTTP action", many: "HTTP actions" },
  statusPage: { one: "Status page", many: "status pages" },
};

/** The line under a library list of a kind: when the phone listed it.
 * Undefined for the watch's own status pages, and for HTTP actions that
 * lead with the home's library, which the phone did not list. */
export function watchCatalogListedFor(catalog: WatchCatalog | undefined, kind: WatchLibraryKind, locale?: string): string | undefined {
  if (watchCatalogFromWatch(catalog, kind)) return undefined;
  if (kind === "httpAction" && catalog?.httpLibrary === "held") return undefined;
  return watchCatalogListedText(catalog, locale);
}

/** The line under a library list: when the phone listed it. Undefined when
 * the record has no time or it does not read as one. */
export function watchCatalogListedText(catalog: WatchCatalog | undefined, locale?: string): string | undefined {
  const at = catalog?.updatedAt;
  if (at === undefined) return undefined;
  const date = new Date(at);
  if (Number.isNaN(date.getTime())) return undefined;
  return `Listed by the iPhone on ${date.toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" })}.`;
}
