// A local harness for `<wa-page-editor>`: the element on a page of its own,
// fed by a fake `hass` whose connection answers the integration's WebSocket
// commands from an in-memory store that behaves like the real one
// (`custom_components/wrist_assistant/watch_config_ws.py` and
// `watch_config_store.py`). A strip above the element plays the iPhone and
// the server, so conflicts, live reloads, delivery and failures can be seen
// without Home Assistant.
//
// The fake server answers by message type, never by what the element happens
// to call today. A type it does not know is refused with `unknown_command`,
// as Home Assistant refuses it, and is marked in the log, so a new call the
// element starts making shows up at once.
//
// Build: `node dev/build-harness.mjs` (or `--watch`) from `frontend/`.
// Serve: `python3 -m http.server 8765 --directory dev` and open
// http://localhost:8765/pages-harness.html.
//
// For a tester: `window.__harness.record(watchId?, kind?)` is a deep copy of
// a stored record (its history included), `window.__harness.log` every
// command with its reply or error, and `window.__harness.reset()` reseeds the
// store and mounts a fresh element.

import "../src/watch-pages/page-editor.js";
import "../src/watch-menus/menu-editor.js";
import "../src/watch-control-center/control-center-editor.js";
import "../src/watch-rooms/rooms-editor.js";
import type { HassEntityState, HassLike, OwnerSummary } from "../src/ha-api.js";
// The phone's menus as the app's tests write them, for `?menus`.
import menusConfigured from "../test/fixtures-menus/02-configured.json";
import menusDefaults from "../test/fixtures-menus/01-defaults.json";
import { EXTRA_STATES, type HomeRegistries, StandInIcons, homeRegistries } from "./harness-home.js";
// @ts-expect-error A module the harness build makes from the page fixtures.
import pageFixturesModule from "harness:page-fixtures";
// The phone's library catalog as the app's tests write it.
import catalogFixture from "../test/fixtures-catalog/catalog.json";

type Json = Record<string, unknown>;

const pageFixtures = pageFixturesModule as Record<string, Json>;

// ── the server's rules, as `const.py` sets them ──────────────────────────

let DELAY_MS = 150;
const KINDS = ["behavior", "catalog", "control_center", "menus", "pages"];
// The catalog is the phone's: the panel reads it and never saves it.
const PANEL_KINDS = ["behavior", "control_center", "menus", "pages"];
const MAX_DOCUMENT_BYTES: Record<string, number> = {
  pages: 2 * 1024 * 1024,
  behavior: 256 * 1024,
  catalog: 256 * 1024,
  menus: 256 * 1024,
  control_center: 256 * 1024,
};
const CATALOG_LIST_KEYS = ["httpActions", "macros", "statusPages"];
const MENUS_SECTION_KEYS = ["quickAction", "entityRadial", "pageSwitcher"];
const HISTORY_LIMIT = 5;
const PANEL_WRITER = "panel";
const KIND_LIST_KEYS: Record<string, string> = { pages: "pages", control_center: "entities" };

const WC = "wrist_assistant/watch_config";
const CMD = {
  owners: "wrist_assistant/complications/owners",
  get: `${WC}/get`,
  save: `${WC}/save`,
  history: `${WC}/history`,
  historyEntry: `${WC}/history_entry`,
  restore: `${WC}/restore`,
  subscribe: `${WC}/subscribe`,
  // Part 3f batch 2: the template renders and the two home wide calls.
  render: "wrist_assistant/complications/render_values",
  configEntries: "config_entries/get",
  cloudStatus: "cloud/status",
  // Rooms (`?rooms`): the area registry and the room sensor's states.
  areas: "config/area_registry/list",
  historyPeriod: "history/history_during_period",
} as const;

/** What a refusal rejects with: the `error` part of Home Assistant's result
 * message, as `sendMessagePromise` hands it over. */
interface WsError {
  code: string;
  message: string;
}

function fail(code: string, message: string): never {
  throw { code, message } satisfies WsError;
}

function clone<T>(value: T): T {
  return value === undefined ? value : (JSON.parse(JSON.stringify(value)) as T);
}

function isObject(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** `values` set on `target` in place, then every key of it in sorted order,
 * as the phone's encoder writes an object. */
function assignSorted(target: Json, values: Json): void {
  const all: Json = { ...target, ...values };
  for (const key of Object.keys(target)) delete target[key];
  for (const key of Object.keys(all).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))) target[key] = all[key];
}

function isInt(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value);
}

/** Python's `datetime.now(UTC)` without microseconds, as the store writes it. */
function isoAt(ms: number): string {
  return new Date(Math.floor(ms / 1000) * 1000).toISOString().replace(".000Z", "Z");
}

function nowIso(): string {
  return isoAt(Date.now());
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── the store ────────────────────────────────────────────────────────────

interface HistoryEntry {
  revision: number;
  hash: string | null;
  updated_at: string | null;
  updated_by: string | null;
  document: Json;
}

interface StoredRecord {
  revision: number;
  hash: string;
  updated_at: string;
  updated_by: string;
  delivered_revision: number;
  delivered_at: string | null;
  rejected_revision: number;
  rejected_at: string | null;
  document: Json;
  /** Oldest first, as the store files them. */
  history: HistoryEntry[];
}

/** Compact UTF-8 JSON size, as `document_size` measures it. */
function documentSize(document: unknown): number {
  return new TextEncoder().encode(JSON.stringify(document)).length;
}

function sortedJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(sortedJson).join(",")}]`;
  if (isObject(value)) {
    return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${sortedJson(value[k])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

/** A stable 64 hex character digest of the sorted-key JSON. Not SHA-256, as
 * the server's is: nothing on the panel side compares it with anything. */
function documentHash(document: Json): string {
  const text = sortedJson(document);
  let out = "";
  for (let round = 0; round < 8; round++) {
    let h = (0x811c9dc5 ^ (round * 0x9e3779b1)) >>> 0;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    out += h.toString(16).padStart(8, "0");
  }
  return out;
}

function validateKind(kind: unknown): string {
  if (typeof kind !== "string" || !KINDS.includes(kind)) fail("invalid", `kind must be one of ${KINDS.join(", ")}`);
  return kind;
}

function panelKind(kind: unknown): string {
  const k = validateKind(kind);
  if (!PANEL_KINDS.includes(k)) fail("invalid", `the panel cannot save ${k}; it may save ${PANEL_KINDS.join(", ")}`);
  return k;
}

function validateRevision(revision: unknown): number {
  if (!isInt(revision) || revision < 1) fail("invalid", "revision must be a positive integer");
  return revision;
}

function validateBaseRevision(baseRevision: unknown): number {
  if (!isInt(baseRevision) || baseRevision < 0) fail("invalid", "base_revision must be a non-negative integer");
  return baseRevision;
}

/** `validate_document`: an object, the kind's list key a list, under the
 * kind's cap, then the page shape guard. */
function validateDocument(kind: string, document: unknown, checkItems: boolean): number {
  if (!isObject(document)) fail("invalid", "document must be a JSON object");
  const listKey = KIND_LIST_KEYS[kind];
  if (listKey !== undefined && !Array.isArray(document[listKey])) fail("invalid", `document.${listKey} must be a list`);
  const size = documentSize(document);
  const limit = MAX_DOCUMENT_BYTES[kind] ?? 0;
  if (size > limit) fail("invalid", `document is ${size} bytes; the limit for ${kind} is ${limit}`);
  if (kind === "pages") checkPages(document.pages as unknown[], checkItems);
  else if (kind === "catalog") checkCatalog(document);
  else if (kind === "menus") checkMenus(document);
  return size;
}

/** `_check_menus`: the three sections absent or objects; `quickAction.slots`,
 * every `entityRadial` key ending in `Slots` and every value of
 * `entityRadial.entityOverrides` a slot list. Nothing else looked at. */
function checkMenus(document: Json): void {
  for (const key of MENUS_SECTION_KEYS) {
    if (key in document && !isObject(document[key])) fail("invalid", `document.${key} must be an object`);
  }
  const quickAction = document.quickAction as Json | undefined;
  if (quickAction !== undefined && "slots" in quickAction) checkSlotList(quickAction.slots, "document.quickAction.slots");
  const entityRadial = document.entityRadial as Json | undefined;
  if (entityRadial === undefined) return;
  for (const [key, slots] of Object.entries(entityRadial)) {
    if (key.endsWith("Slots")) checkSlotList(slots, `document.entityRadial.${key}`);
  }
  if (!("entityOverrides" in entityRadial)) return;
  const overrides = entityRadial.entityOverrides;
  if (!isObject(overrides)) fail("invalid", "document.entityRadial.entityOverrides must be an object");
  for (const [entityId, slots] of Object.entries(overrides)) {
    checkSlotList(slots, `document.entityRadial.entityOverrides["${entityId}"]`);
  }
}

/** `_check_slot_list`: objects with a non-empty string `id`, unique in the
 * list ignoring case. */
function checkSlotList(slots: unknown, where: string): void {
  if (!Array.isArray(slots)) fail("invalid", `${where} must be a list`);
  const seen = new Map<string, number>();
  slots.forEach((slot, index) => {
    const at = `${where}[${index}]`;
    if (!isObject(slot)) fail("invalid", `${at} must be an object`);
    const slotId = slot.id;
    if (typeof slotId !== "string" || slotId === "") fail("invalid", `${at}.id must be a non-empty string`);
    const folded = slotId.toUpperCase();
    if (seen.has(folded)) {
      fail("invalid", `${at} has the slot id "${slotId}" of ${where}[${seen.get(folded)}]; slot ids must be unique in a list`);
    }
    seen.set(folded, index);
  });
}

/** `_check_catalog`: each library list absent or a list of objects with a
 * non-empty string `id` and a string `name`; nothing else looked at. */
function checkCatalog(document: Json): void {
  for (const listKey of CATALOG_LIST_KEYS) {
    if (!(listKey in document)) continue;
    const entries = document[listKey];
    if (!Array.isArray(entries)) fail("invalid", `document.${listKey} must be a list`);
    entries.forEach((entry, index) => {
      const where = `document.${listKey}[${index}]`;
      if (!isObject(entry)) fail("invalid", `${where} must be an object`);
      if (typeof entry.id !== "string" || entry.id === "") fail("invalid", `${where}.id must be a non-empty string`);
      if (typeof entry.name !== "string") fail("invalid", `${where}.name must be a string`);
    });
  }
}

/** `_check_pages`: page ids always, tile ids and entity ids with
 * `checkItems` (a panel save or a restore). Ids compare ignoring case. */
function checkPages(pages: unknown[], checkItems: boolean): void {
  const seen = new Map<string, number>();
  pages.forEach((page, index) => {
    const where = `document.pages[${index}]`;
    if (!isObject(page)) fail("invalid", `${where} must be an object`);
    const pageId = page.id;
    if (typeof pageId !== "string" || pageId === "") fail("invalid", `${where}.id must be a non-empty string`);
    const folded = pageId.toUpperCase();
    if (seen.has(folded)) {
      fail("invalid", `${where} has the page id "${pageId}" of document.pages[${seen.get(folded)}]; page ids must be unique`);
    }
    seen.set(folded, index);
    if (checkItems) checkItemsOf(page, `${where} (id "${pageId}")`);
  });
}

function checkItemsOf(page: Json, where: string): void {
  if (!("items" in page)) return;
  const items = page.items;
  if (!Array.isArray(items)) fail("invalid", `${where}.items must be a list`);
  const seen = new Map<string, number>();
  items.forEach((item, index) => {
    const at = `${where}.items[${index}]`;
    if (!isObject(item)) fail("invalid", `${at} must be an object`);
    for (const key of ["id", "entityId"]) {
      const value = item[key];
      if (typeof value !== "string" || value === "") fail("invalid", `${at}.${key} must be a non-empty string`);
    }
    const id = item.id as string;
    const folded = id.toUpperCase();
    if (seen.has(folded)) {
      fail("invalid", `${at} has the item id "${id}" of items[${seen.get(folded)}]; item ids must be unique in a page`);
    }
    seen.set(folded, index);
  });
}

class FakeStore {
  readonly records = new Map<string, Map<string, StoredRecord>>();
  private listeners = new Set<(owner: string, kind: string, revision: number) => void>();
  /** One-shot: the next panel write that reaches the store is refused. */
  failNextWrite = false;

  addListener(listener: (owner: string, kind: string, revision: number) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(owner: string, kind: string, revision: number): void {
    if (!KINDS.includes(kind)) return;
    for (const listener of [...this.listeners]) listener(owner, kind, revision);
  }

  private checkAvailable(write: boolean): void {
    if (write && this.failNextWrite) {
      this.failNextWrite = false;
      onHarnessChange();
      fail("unavailable", "the stored watch config could not be read; restart Home Assistant");
    }
  }

  record(owner: string, kind: string): StoredRecord | undefined {
    return this.records.get(owner)?.get(kind);
  }

  get(owner: string, kind: unknown): StoredRecord | undefined {
    const k = validateKind(kind);
    this.checkAvailable(false);
    return this.record(owner, k);
  }

  revisions(owner: string): Record<string, number> {
    this.checkAvailable(false);
    const out: Record<string, number> = {};
    for (const [kind, record] of [...(this.records.get(owner) ?? new Map<string, StoredRecord>())].sort()) {
      if (KINDS.includes(kind)) out[kind] = record.revision;
    }
    return out;
  }

  history(owner: string, kind: unknown): HistoryEntry[] {
    const record = this.get(owner, kind);
    return record ? [...record.history].reverse() : [];
  }

  historyEntry(owner: string, kind: unknown, revision: unknown): HistoryEntry {
    const rev = validateRevision(revision);
    const record = this.get(owner, kind);
    const entry = record ? findEntry(record, rev) : undefined;
    if (!entry) fail("not_found", `revision ${rev} of ${String(kind)} is not in the history`);
    return entry;
  }

  /** A device upload (`put`): the page level of the shape guard only,
   * compare-and-swap on the base, delivered at once, listeners told. */
  put(owner: string, kind: string, document: Json, opts: { base: number; by: string; at?: string; notify?: boolean }): StoredRecord {
    const k = validateKind(kind);
    validateDocument(k, document, false);
    const existing = this.record(owner, k);
    const stored = existing?.revision ?? 0;
    if (opts.base !== stored) fail("conflict", `stored revision is ${stored}, save was based on ${opts.base}`);
    const at = opts.at ?? nowIso();
    let record: StoredRecord;
    if (!existing) {
      record = {
        revision: 1,
        hash: documentHash(document),
        updated_at: at,
        updated_by: opts.by,
        delivered_revision: 0,
        delivered_at: null,
        rejected_revision: 0,
        rejected_at: null,
        document,
        history: [],
      };
      if (!this.records.has(owner)) this.records.set(owner, new Map());
      this.records.get(owner)!.set(k, record);
    } else {
      record = existing;
      replace(record, document, opts.by, at);
    }
    markDelivered(record, record.revision, at);
    if (opts.notify !== false) this.notify(owner, k, record.revision);
    return record;
  }

  /** A record gone (the harness's No catalog switch): listeners hear
   * revision 0, as for a record that was removed. */
  remove(owner: string, kind: string): boolean {
    const had = this.records.get(owner)?.delete(kind) ?? false;
    if (had) this.notify(owner, kind, 0);
    return had;
  }

  panelSave(owner: unknown, kind: unknown, document: unknown, baseRevision: unknown): StoredRecord {
    if (typeof owner !== "string" || owner === "") fail("invalid", "owner_watch_id is required");
    const k = panelKind(kind);
    validateDocument(k, document, true);
    const base = validateBaseRevision(baseRevision);
    this.checkAvailable(true);
    const existing = this.record(owner, k);
    if (!existing) {
      // `panel_save`'s create path: base 0 and a paired watch (here, one the
      // owners list names) get revision 1; anything else is no_record.
      if (base !== 0) {
        fail("no_record", `there is no stored ${k} record to save over; the iPhone uploads the first copy`);
      }
      if (!OWNERS.some((o) => o.owner_watch_id === owner)) {
        fail("no_record", `there is no stored ${k} record and this watch is not paired; pair it before starting its config here`);
      }
      return this.panelCreate(owner, k, document as Json);
    }
    if (base !== existing.revision) {
      fail("conflict", `stored revision is ${existing.revision}, save was based on ${base}`);
    }
    return this.panelCommit(owner, k, existing, document as Json);
  }

  private panelCreate(owner: string, kind: string, document: Json): StoredRecord {
    const record: StoredRecord = {
      revision: 1,
      hash: documentHash(document),
      updated_at: nowIso(),
      updated_by: PANEL_WRITER,
      delivered_revision: 0,
      delivered_at: null,
      rejected_revision: 0,
      rejected_at: null,
      document,
      history: [],
    };
    if (!this.records.has(owner)) this.records.set(owner, new Map());
    this.records.get(owner)!.set(kind, record);
    this.notify(owner, kind, record.revision);
    return record;
  }

  restore(owner: unknown, kind: unknown, revision: unknown, baseRevision: unknown): StoredRecord {
    if (typeof owner !== "string" || owner === "") fail("invalid", "owner_watch_id is required");
    const k = panelKind(kind);
    const rev = validateRevision(revision);
    const base = validateBaseRevision(baseRevision);
    this.checkAvailable(true);
    const existing = this.panelTarget(owner, k, base, "restore");
    const entry = findEntry(existing, rev);
    if (!entry) fail("not_found", `revision ${rev} of ${k} is not in the history`);
    const document = clone(entry.document);
    validateDocument(k, document, true);
    return this.panelCommit(owner, k, existing, document);
  }

  private panelTarget(owner: string, kind: string, base: number, action: string): StoredRecord {
    const existing = this.record(owner, kind);
    if (base === 0 || !existing) {
      fail("no_record", `there is no stored ${kind} record to save over; the iPhone uploads the first copy`);
    }
    if (base !== existing.revision) {
      fail("conflict", `stored revision is ${existing.revision}, ${action} was based on ${base}`);
    }
    return existing;
  }

  private panelCommit(owner: string, kind: string, record: StoredRecord, document: Json): StoredRecord {
    replace(record, document, PANEL_WRITER, nowIso());
    this.notify(owner, kind, record.revision);
    return record;
  }
}

function findEntry(record: StoredRecord, revision: number): HistoryEntry | undefined {
  for (let i = record.history.length - 1; i >= 0; i--) {
    if (record.history[i]!.revision === revision) return record.history[i];
  }
  return undefined;
}

/** `_replace`: file the current document, then take the next revision. */
function replace(record: StoredRecord, document: Json, by: string, at: string): void {
  record.history.push({
    revision: record.revision,
    hash: record.hash,
    updated_at: record.updated_at,
    updated_by: record.updated_by,
    document: record.document,
  });
  if (record.history.length > HISTORY_LIMIT) record.history.splice(0, record.history.length - HISTORY_LIMIT);
  record.revision += 1;
  record.hash = documentHash(document);
  record.updated_at = at;
  record.updated_by = by;
  record.document = document;
}

/** Only forwards, never past the record's revision. */
function markDelivered(record: StoredRecord, revision: number, at = nowIso()): boolean {
  const rev = Math.min(revision, record.revision);
  if (rev <= record.delivered_revision) return false;
  record.delivered_revision = rev;
  record.delivered_at = at;
  return true;
}

/** Always the current revision; a repeat keeps the first time. */
function markRejected(record: StoredRecord): boolean {
  if (record.rejected_revision === record.revision) return false;
  record.rejected_revision = record.revision;
  record.rejected_at = nowIso();
  return true;
}

// ── the home: devices, documents, states ─────────────────────────────────

const ALEX_PHONE = "harness-iphone-alex";
const ALEX_WATCH = "harness-watch-alex";
const SAM_PHONE = "harness-iphone-sam";
const SAM_WATCH = "harness-watch-sam";
const ULTRA_WATCH = "harness-watch-ultra";

function owner(fields: Partial<OwnerSummary> & Pick<OwnerSummary, "owner_watch_id">): OwnerSummary {
  return {
    device_name: null,
    device_kind: "watch",
    paired_iphone_name: null,
    paired_iphone_id: null,
    app_version: "3.0.1",
    app_build: "2",
    screen_size: null,
    complication_count: 0,
    token: 0,
    applied_token: null,
    is_orphan: false,
    ...fields,
  };
}

/** As the owners command sorts them: watches by name, then phones, then the
 * Library. Two watches named "Apple Watch" are told apart by their phones. */
const OWNERS: OwnerSummary[] = [
  owner({ owner_watch_id: ALEX_WATCH, device_name: "Apple Watch", paired_iphone_name: "Alex's iPhone", paired_iphone_id: ALEX_PHONE, screen_size: "208x248" }),
  owner({ owner_watch_id: SAM_WATCH, device_name: "Apple Watch", paired_iphone_name: "Sam's iPhone", paired_iphone_id: SAM_PHONE, screen_size: "187x223" }),
  owner({ owner_watch_id: ULTRA_WATCH, device_name: "Apple Watch Ultra", paired_iphone_name: "Alex's iPhone", paired_iphone_id: ALEX_PHONE, screen_size: "205x251" }),
  owner({ owner_watch_id: ALEX_PHONE, device_kind: "iphone", device_name: "Alex's iPhone" }),
  owner({ owner_watch_id: SAM_PHONE, device_kind: "iphone", device_name: "Sam's iPhone" }),
  owner({ owner_watch_id: "library", device_kind: "library", device_name: "Library", app_version: null, app_build: null }),
];

const WATCH_IDS = OWNERS.filter((o) => o.device_kind === "watch").map((o) => o.owner_watch_id);

function pagesOf(document: Json | undefined): Json[] {
  const pages = document?.pages;
  return Array.isArray(pages) ? (pages.filter(isObject) as Json[]) : [];
}

/** One page document from several fixtures: the first one's top-level keys,
 * every page of each in order, a page id met twice kept once. A fixture that
 * is gone is skipped with a warning rather than failing the harness. */
function combine(...names: string[]): Json {
  const found = names.filter((name) => {
    if (pageFixtures[name]) return true;
    console.warn(`[harness] page fixture ${name}.json is missing; seeding without it`);
    return false;
  });
  const first = found[0] ? pageFixtures[found[0]]! : { schemaVersion: 1, pages: [] };
  const out: Json = { ...clone(first), pages: [] };
  const seen = new Set<string>();
  for (const name of found) {
    for (const page of pagesOf(pageFixtures[name])) {
      const id = String(page.id ?? "").toUpperCase();
      if (seen.has(id)) continue;
      seen.add(id);
      (out.pages as Json[]).push(clone(page));
    }
  }
  return out;
}

function pageIdByName(document: Json, name: string): string | undefined {
  const page = pagesOf(document).find((p) => p.name === name) ?? pagesOf(document)[0];
  return typeof page?.id === "string" ? page.id : undefined;
}

const store = new FakeStore();

function seedStore(): void {
  store.records.clear();
  store.failNextWrite = false;
  const minutesAgo = (m: number) => isoAt(Date.now() - m * 60_000);

  // Alex: three uploads from the iPhone, the last one delivered.
  store.put(ALEX_WATCH, "pages", combine("05-pages"), { base: 0, by: ALEX_WATCH, at: minutesAgo(60 * 24 * 6), notify: false });
  store.put(ALEX_WATCH, "pages", combine("05-pages", "03-hold-and-slide"), { base: 1, by: ALEX_WATCH, at: minutesAgo(60 * 26), notify: false });
  // The last one also has a page of the special tiles (part 3f).
  // And a second smart page, with two rules on one domain (part 3f batch 3).
  const alex = store.put(ALEX_WATCH, "pages", withSmartPage(withSpecialPage(combine("05-pages", "03-hold-and-slide", "01-entity-tiles"))), {
    base: 2, by: ALEX_WATCH, at: minutesAgo(40), notify: false,
  });
  // Alex's behavior settings, whose room quick jump points at two of the
  // pages above, so deleting either page has something to warn about.
  const home = pageIdByName(alex.document, "Home");
  const living = pageIdByName(alex.document, "Living room");
  store.put(ALEX_WATCH, "behavior", {
    serverMode: "Auto",
    showPageIndicator: true,
    wrapPages: true,
    topSectionDoubleTapAction: "Room Jump",
    roomQuickJumpEnabled: true,
    roomQuickJumpSourceEntityId: "sensor.alex_room",
    roomQuickJumpFallbackPageId: home ?? "",
    roomQuickJumpMappings: { living_room: living ?? "" },
    // One point control target, for the Rooms editor (`?rooms`).
    pointControlRoomMappingsJSON: "{\"living room\":[{\"entityId\":\"media_player.living_room_tv\",\"centerHeading\":90,\"label\":\"TV\"}]}",
    // The Camera task's "Default (On/30s)" words come from these (part 3f).
    cameraRefreshOnOpen: true,
    cameraRefreshOnOpenDebounce: "30s",
  }, { base: 0, by: ALEX_WATCH, at: minutesAgo(60 * 24 * 3), notify: false });

  // Sam: one upload, then a panel save the iPhone has not collected yet.
  store.put(SAM_WATCH, "pages", combine("02-virtual-tiles", "04-tile-settings"), { base: 0, by: SAM_WATCH, at: minutesAgo(60 * 50), notify: false });
  const sam = store.record(SAM_WATCH, "pages")!;
  const panelDocument = combine("02-virtual-tiles", "04-tile-settings", "06-new-page");
  try {
    validateDocument("pages", panelDocument, true);
    replace(sam, panelDocument, PANEL_WRITER, minutesAgo(8));
  } catch (err) {
    console.warn("[harness] Sam's seeded panel save fails the shape guard, so it is left out:", err);
  }

  // The Ultra has no record at all: the view's "no pages yet" state.

  // Menus (`?menus`): Alex's iPhone sent a configured set, Sam's the
  // defaults; the Ultra has none, for "Start with the defaults".
  store.put(ALEX_WATCH, "menus", clone(menusConfigured as Json), { base: 0, by: ALEX_WATCH, at: minutesAgo(90), notify: false });
  store.put(SAM_WATCH, "menus", clone(menusDefaults as Json), { base: 0, by: SAM_WATCH, at: minutesAgo(60 * 30), notify: false });

  // The Control Center list (`?control-center`): Alex's iPhone sent one with
  // a hidden entry, a tint and an entry in a domain the watch never shows;
  // Sam and the Ultra have none, for "Start with an empty list".
  store.put(ALEX_WATCH, "control_center", {
    entities: [
      { displayName: "Kitchen", domain: "light", entityId: "light.kitchen", iconName: "lightbulb", schemaVersion: 1 },
      { customDisplayName: "Door", displayName: "Front Door", domain: "lock", entityId: "lock.front_door", iconName: "lock", schemaVersion: 1, tintColorHex: "#34D399" },
      { displayName: "Garage", domain: "cover", entityId: "cover.garage_door", iconName: "blinds.horizontal.closed", isHidden: true, schemaVersion: 1 },
      { displayName: "Movie night", domain: "script", entityId: "script.movie_night", iconName: "scroll", schemaVersion: 1 },
      { displayName: "Outdoor", domain: "sensor", entityId: "sensor.outdoor_temperature", iconName: "circle", schemaVersion: 1 },
    ],
    schemaVersion: 1,
  }, { base: 0, by: ALEX_WATCH, at: minutesAgo(45), notify: false });

  // The phone's library catalog (part 3e), the bytes the app's tests write,
  // on both watches with pages unless the No catalog switch is on.
  if (catalogOn) {
    for (const watch of [ALEX_WATCH, SAM_WATCH]) {
      store.put(watch, "catalog", clone(catalogFixture as Json), { base: 0, by: watch, at: minutesAgo(30), notify: false });
    }
  }
}

/** Whether the store holds a catalog for the watches with pages: off is an
 * app older than the kind, or a phone that never published one.
 * `pages-harness.html?nocatalog` starts with it off. */
let catalogOn = !new URLSearchParams(location.search).has("nocatalog");
let libraryCount = 0;

/** The iPhone publishes its catalog again with one more HTTP action, as
 * after a save in its HTTP Actions settings: a new revision and a live
 * event. */
function iphoneAddsAnAction(): void {
  const watch = shownWatch();
  const record = store.record(watch, "catalog");
  if (!record) return say(`${watchLabel(watch)} has no catalog. Switch Catalog on first.`);
  const document = clone(record.document);
  const n = ++libraryCount;
  const id = `C3A0E000-0000-4000-8000-${String(n).padStart(12, "0")}`;
  (document.httpActions as Json[]).push({ id, name: `Harness Action ${n}`, ...(n % 2 === 0 ? { hasReply: true } : {}) });
  const saved = store.put(watch, "catalog", document, { base: record.revision, by: watch });
  addLog({ what: "iphone", note: `catalog with "Harness Action ${n}"; revision ${saved.revision}`, type: "device upload" });
  say(`iPhone: published its catalog with "Harness Action ${n}". Catalog revision ${saved.revision}.`);
}

function setCatalog(on: boolean): void {
  catalogOn = on;
  const watch = shownWatch();
  if (!on) {
    const removed = [ALEX_WATCH, SAM_WATCH, watch].filter((w, i, all) => all.indexOf(w) === i).filter((w) => store.remove(w, "catalog"));
    say(removed.length > 0 ? "No catalog: the store holds none, as with an app older than the kind." : "There was no catalog.");
    return;
  }
  if (!store.record(watch, "catalog")) {
    const saved = store.put(watch, "catalog", clone(catalogFixture as Json), { base: 0, by: watch });
    addLog({ what: "iphone", note: `first catalog; revision ${saved.revision}`, type: "device upload" });
  }
  say(`iPhone: published its catalog for ${watchLabel(watch)}.`);
}

const ENTITY_KEYS = /^(entityId|entityIds|resolvedEntityIds|.*EntityId|.*EntityIds)$/;
const ENTITY_ID = /^([a-z_][a-z0-9_]*)\.([a-z0-9_]+)$/;
const NOT_ENTITIES = new Set([
  "page", "show_page", "status_page", "http_action", "macro", "template", "spacer", "multicam",
  "point_control", "music_hub", "assist", "speak_message", "webhook_inbox", "divider",
]);

/** Every Home Assistant entity id a document names, found under keys that
 * hold entity ids. The app's own tile kinds are left out. */
function entityIdsIn(value: unknown, out: Set<string>, key = ""): void {
  if (Array.isArray(value)) {
    for (const v of value) entityIdsIn(v, out, key);
  } else if (isObject(value)) {
    for (const [k, v] of Object.entries(value)) entityIdsIn(v, out, k);
  } else if (typeof value === "string" && ENTITY_KEYS.test(key)) {
    const m = ENTITY_ID.exec(value);
    if (m && !NOT_ENTITIES.has(m[1]!)) out.add(value);
  }
}

function titleCase(objectId: string): string {
  const words = objectId.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function madeUpState(entityId: string, index: number): HassEntityState {
  const [domain, objectId] = entityId.split(".") as [string, string];
  const attributes: Record<string, unknown> = { friendly_name: titleCase(objectId) };
  const toggle = index % 3 === 0 ? "off" : "on";
  let state: string;
  switch (domain) {
    case "sensor":
      if (/temperature/.test(objectId)) { state = "21.4"; attributes.unit_of_measurement = "°C"; attributes.device_class = "temperature"; }
      else if (/battery/.test(objectId)) { state = "18"; attributes.unit_of_measurement = "%"; attributes.device_class = "battery"; }
      else if (/humidity/.test(objectId)) { state = "46"; attributes.unit_of_measurement = "%"; attributes.device_class = "humidity"; }
      else if (/room/.test(objectId)) { state = "living_room"; attributes.unit_of_measurement = ""; }
      else { state = String(10 + index); attributes.unit_of_measurement = "W"; attributes.device_class = "power"; }
      break;
    case "binary_sensor": state = toggle; attributes.device_class = /window/.test(objectId) ? "window" : "door"; break;
    case "lock": state = index % 2 === 0 ? "locked" : "unlocked"; break;
    case "cover": state = "open"; attributes.current_position = 70; break;
    // `hvac_modes` and `supported_features` narrow the State Icons and
    // Colors rows, as the phone narrows them.
    case "climate": state = "heat"; attributes.current_temperature = 20.5; attributes.temperature = 21; attributes.hvac_modes = ["off", "heat", "cool", "auto"]; break;
    case "media_player": state = "playing"; attributes.media_title = "Evening Mix"; attributes.volume_level = 0.4; attributes.supported_features = 1 | 4 | 128 | 256; break;
    case "person": case "device_tracker": state = "home"; break;
    case "alarm_control_panel": state = "armed_home"; attributes.supported_features = 1 | 2; break;
    case "light": state = toggle; if (toggle === "on") attributes.brightness = 180; break;
    case "fan": state = toggle; attributes.percentage = 66; break;
    case "vacuum": state = "docked"; break;
    case "lawn_mower": state = "docked"; break;
    case "weather": state = "partlycloudy"; attributes.temperature = 17; attributes.temperature_unit = "°C"; break;
    case "water_heater": state = "eco"; attributes.temperature = 55; break;
    case "humidifier": state = toggle; attributes.humidity = 45; break;
    case "number": case "input_number": state = "40"; attributes.unit_of_measurement = "%"; attributes.min = 0; attributes.max = 100; break;
    case "counter": state = "3"; break;
    case "timer": state = "idle"; attributes.duration = "0:05:00"; break;
    case "select": case "input_select": state = "Normal"; attributes.options = ["Normal", "Eco", "Away"]; break;
    case "text": case "input_text": state = "Welcome home"; break;
    case "date": state = "2026-11-14"; break;
    case "datetime": case "input_datetime": state = "2026-10-20T09:00:00"; break;
    case "time": state = "06:45:00"; break;
    case "calendar": state = "off"; attributes.message = "School run"; break;
    case "todo": state = "4"; break;
    case "update": state = "on"; attributes.installed_version = "1.2.0"; attributes.latest_version = "1.3.0"; break;
    case "valve": state = "closed"; break;
    case "zone": state = "1"; break;
    case "event": state = isoAt(Date.now() - 3_600_000); attributes.event_type = "pressed"; break;
    case "button": case "input_button": case "scene": state = isoAt(Date.now() - 7_200_000); break;
    case "camera": case "image": state = "idle"; break;
    case "siren": state = "off"; break;
    case "script": state = "off"; break;
    default: state = toggle;
  }
  const at = isoAt(Date.now() - (index + 1) * 300_000);
  return { entity_id: entityId, state, attributes, last_changed: at, last_updated: at };
}

// ── the special tiles page (part 3f) ─────────────────────────────────────

/** A stand-in snapshot: a data URL picture, so nothing goes to the network. */
function snapshotUrl(label: string, hue: number, width: number, height: number): string {
  const art = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`
    + `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},45%,38%)"/><stop offset="1" stop-color="hsl(${hue + 40},35%,14%)"/></linearGradient></defs>`
    + `<rect width="${width}" height="${height}" fill="url(#g)"/>`
    + `<rect x="${width * 0.1}" y="${height * 0.55}" width="${width * 0.8}" height="${height * 0.3}" fill="hsla(${hue},30%,70%,0.25)"/>`
    + `<text x="${width / 2}" y="${height * 0.4}" font-family="sans-serif" font-size="${height / 6}" fill="#fff" text-anchor="middle">${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(art)}`;
}

function specialState(entityId: string, state: string, attributes: Record<string, unknown>): HassEntityState {
  const at = isoAt(Date.now() - 600_000);
  return { entity_id: entityId, state, attributes, last_changed: at, last_updated: at };
}

/** The states the special tiles page reads: a remote with its playing
 * player, a TV with no remote of its own, three cameras (one with no
 * snapshot, one unavailable), and the rest at a state that shows a badge. */
const SPECIAL_STATES: readonly HassEntityState[] = [
  specialState("remote.living_room_apple_tv", "on", { friendly_name: "Living Room Apple TV" }),
  specialState("media_player.living_room_apple_tv", "playing", { friendly_name: "Living Room Apple TV", volume_level: 0.42, supported_features: 1 | 4 | 128 | 256 }),
  specialState("media_player.lounge_tv", "paused", { friendly_name: "Lounge TV", device_class: "tv", volume_level: 0.18, supported_features: 1 | 4 | 128 | 256 }),
  specialState("camera.front_door", "idle", { friendly_name: "Front Door", entity_picture: snapshotUrl("Front Door", 200, 640, 360) }),
  specialState("camera.back_yard", "idle", { friendly_name: "Back Yard", entity_picture: snapshotUrl("Back Yard", 110, 640, 360) }),
  specialState("camera.garage", "idle", { friendly_name: "Garage" }),
  specialState("camera.driveway", "unavailable", { friendly_name: "Driveway" }),
  specialState("vacuum.robo", "cleaning", { friendly_name: "Robo", battery_level: 64 }),
  specialState("lawn_mower.lawny", "mowing", { friendly_name: "Lawny" }),
  specialState("sensor.lawny_battery", "17", { friendly_name: "Lawny battery", unit_of_measurement: "%", device_class: "battery" }),
  specialState("climate.hall", "heat", { friendly_name: "Hall", hvac_action: "heating", temperature: 21.5, current_temperature: 20.2, target_temp_step: 0.5, hvac_modes: ["off", "heat", "cool", "auto"] }),
  specialState("person.alex", "home", { friendly_name: "Alex", entity_picture: snapshotUrl("A", 20, 256, 256) }),
  specialState("person.sam", "work_office", { friendly_name: "Sam" }),
  specialState("alarm_control_panel.house", "armed_away", { friendly_name: "House", supported_features: 1 | 2 }),
  specialState("calendar.family", "on", { friendly_name: "Family", message: "School run" }),
  specialState("calendar.work", "off", { friendly_name: "Work" }),
  specialState("weather.home", "partlycloudy", { friendly_name: "Home", temperature: 17, temperature_unit: "°C" }),
  // What the special tiles' settings pick from (part 3f): the remote's
  // quick action scripts, a receiver for its volume, and the vacuum's
  // companion entities, which share its device (`SPECIAL_DEVICES`).
  specialState("script.movie_night", "off", { friendly_name: "Movie Night" }),
  specialState("script.launch_netflix", "off", { friendly_name: "" }),
  specialState("media_player.living_room_receiver", "on", { friendly_name: "Living Room Receiver", volume_level: 0.3, supported_features: 4 | 8 | 1024 | 2048, source_list: ["TV", "Phono"] }),
  specialState("select.robo_cleaning_mode", "vacuum", { friendly_name: "Robo cleaning mode", options: ["vacuum", "mop", "vacuum_and_mop"] }),
  specialState("select.robo_mop_intensity", "medium", { friendly_name: "Robo mop intensity", options: ["low", "medium", "high"] }),
  specialState("switch.robo_do_not_disturb", "off", { friendly_name: "Robo do not disturb" }),
  specialState("switch.robo_child_lock", "off", { friendly_name: "Robo child lock" }),
  specialState("sensor.robo_battery", "64", { friendly_name: "Robo battery", unit_of_measurement: "%", device_class: "battery" }),
  // The music hub's speakers (part 3f batch 2): Music Assistant players with
  // the grouping bit, one playing with album art, one idle.
  specialState("media_player.kitchen_speaker", "playing", {
    friendly_name: "Kitchen Speaker", media_title: "So What", media_artist: "Miles Davis", entity_picture: snapshotUrl("So What", 30, 300, 300),
    supported_features: 524288 | 1 | 4 | 16384, mass_player_type: "player", group_members: [],
  }),
  specialState("media_player.office_speaker", "idle", { friendly_name: "Office Speaker", supported_features: 524288 | 1 | 4 | 16384, mass_player_type: "player", group_members: [] }),
  // The voice pickers' choices (part 3f batch 2): a conversation agent, two
  // voice engines (and `tts.cloud` from the `cloud_say` service), and a
  // speaker that announces, which the speaker lists put first.
  specialState("conversation.house_helper", "unknown", { friendly_name: "House Helper" }),
  specialState("tts.piper", "unknown", { friendly_name: "Piper" }),
  specialState("tts.google_translate_en_com", "unknown", { friendly_name: "Google Translate en com" }),
  specialState("media_player.hallway_display", "idle", { friendly_name: "Hallway Display", supported_features: 1048576 | 1 | 4 }),
];

/** The devices the special tiles' settings read beyond the home's: the
 * remote's (its "Use <player>" suggestion) and the vacuum's (discovery). */
const SPECIAL_DEVICES: readonly { id: string; entities: readonly string[] }[] = [
  { id: "dev_living_room_apple_tv", entities: ["remote.living_room_apple_tv", "media_player.living_room_apple_tv"] },
  { id: "dev_robo", entities: ["vacuum.robo", "select.robo_cleaning_mode", "select.robo_mop_intensity", "switch.robo_do_not_disturb", "switch.robo_child_lock", "sensor.robo_battery"] },
];

/** The registries with the special devices' entities on their devices. */
function withSpecialDevices(home: HomeRegistries): HomeRegistries {
  const entities = { ...home.entities };
  for (const device of SPECIAL_DEVICES) {
    for (const id of device.entities) {
      if (entities[id] !== undefined) entities[id] = { ...entities[id]!, device_id: device.id };
    }
  }
  return { ...home, entities };
}

/** A stand-in for the element's picture loader: the size a stand-in
 * snapshot was drawn at, read from its data URL, after a short wait, as a
 * snapshot from Home Assistant would arrive. Anything else does not load. */
function loadStandInImage(url: string): Promise<{ width: number; height: number } | undefined> {
  const svg = url.startsWith("data:image/svg+xml,") ? decodeURIComponent(url.slice("data:image/svg+xml,".length)) : "";
  const m = /width="(\d+)" height="(\d+)"/.exec(svg);
  const size = m === null ? undefined : { width: Number(m[1]), height: Number(m[2]) };
  return new Promise((resolve) => window.setTimeout(() => resolve(size), 250));
}

/** The symbols the special tiles draw beyond their tiles' own, for the
 * stand-in symbol provider. */
const SPECIAL_SYMBOLS = [
  "appletv", "appletv.fill", "av.remote", "av.remote.fill", "play.fill", "pause.fill", "video", "video.fill", "video.slash.fill",
  "rectangle.split.2x2", "rectangle.split.2x2.fill", "hurricane", "house", "house.fill", "arrow.uturn.backward",
  "exclamationmark.triangle", "battery.25", "battery.50", "battery.75", "battery.100", "leaf.fill", "flame", "flame.fill",
  "snowflake", "thermometer.variable", "power", "person", "person.fill", "shield", "shield.fill", "exclamationmark.shield",
  "shield.lefthalf.filled", "calendar", "cloud.sun.fill",
  // Part 3f batch 2: the template tile's placeholder and the Home Status
  // preset's icons, the music hub's.
  "chevron.left.forwardslash.chevron.right", "lightbulb.fill", "lock.open.fill", "music.note.house", "music.note.house.fill",
  "waveform.and.mic", "message.and.waveform", "hand.point.up.left", "hand.point.up.left.fill",
];

/** The Home Status preset's text, the phone's template add
 * (`TemplatePreset.all` in `AppTileRules.swift`). */
const HOME_STATUS_TEMPLATE = [
  "[icon:lightbulb.fill] {{ states.light | selectattr('state','eq','on') | list | count }} lights on",
  "[icon:lock.open.fill] {{ states.lock | selectattr('state','eq','unlocked') | list | count }} unlocked",
  "[icon:person.fill] {{ states.person | selectattr('state','eq','home') | list | count }} home",
].join("\n");

/** A stand-in for `render_values`: each `{{ states.<domain> |
 * selectattr('state','eq','<state>') | list | count }}` counted in the
 * harness's states, any other expression "42", and a `{{` left open the
 * syntax error Home Assistant gives. A blank template is refused, as there. */
function renderStandIn(template: string): { ok: true; value: string } | { ok: false; error: string } {
  if (template.trim() === "") return { ok: false, error: "empty template" };
  const open = template.split("{{").length - 1;
  if (open !== template.split("}}").length - 1) return { ok: false, error: "TemplateSyntaxError: unexpected 'end of template'" };
  const value = template.replace(/\{\{(.*?)\}\}/gs, (_all, expression: string) => {
    const m = /states\.(\w+)\s*\|\s*selectattr\('state'\s*,\s*'eq'\s*,\s*'([^']*)'\)\s*\|\s*list\s*\|\s*count/.exec(expression);
    if (m === null) return "42";
    return String(Object.values(states).filter((s) => s.entity_id.startsWith(`${m[1]}.`) && s.state === m[2]).length);
  });
  return { ok: true, value: value.trim() };
}

/** A page with one tile of each special kind, on Alex's watch. Each tile
 * starts from the first fixture tile, so it carries every key a tile the
 * iPhone uploads does. */
function specialTilesPage(): Json | undefined {
  const base = pagesOf(pageFixtures["01-entity-tiles"])[0];
  const first = Array.isArray(base?.items) && isObject(base.items[0]) ? (base.items[0] as Json) : undefined;
  if (base === undefined || first === undefined) return undefined;
  let n = 0;
  const tile = (fields: Json): Json => {
    const { icon: _icon, color: _color, customLabel: _label, ...rest } = clone(first);
    return { ...rest, id: `5F3C1A00-0000-4000-8000-${String(++n).padStart(12, "0")}`, ...fields };
  };
  const items = [
    tile({ entityId: "remote.living_room_apple_tv", icon: "appletv", color: "#8A5A68", gridCol: 0, gridRow: 0, colSpan: 4, rowSpan: 3 }),
    tile({ entityId: "media_player.lounge_tv", icon: "av.remote", color: "#8A5A68", gridCol: 4, gridRow: 0, colSpan: 4, rowSpan: 3 }),
    tile({ entityId: "climate.hall", gridCol: 8, gridRow: 0, colSpan: 4, rowSpan: 3 }),
    tile({ entityId: "camera.front_door", cameraDisplayMode: "preview", cameraFillMode: "fill", cameraFillOffsetX: 0.5, gridCol: 0, gridRow: 3, colSpan: 6, rowSpan: 4 }),
    tile({ entityId: "camera.back_yard", icon: "video", color: "#8A6450", gridCol: 6, gridRow: 3, colSpan: 6, rowSpan: 4 }),
    tile({
      entityId: "multicam.7E0B1C2D-3E4F-4A5B-8C6D-9E0F1A2B3C4D", icon: "rectangle.split.2x2", color: "#5A7FB8", customLabel: "4 Cameras",
      cameraDisplayMode: "preview", cameraGroupIds: ["camera.front_door", "camera.back_yard", "camera.garage", "camera.driveway"],
      cameraRowWeights: [1, 1, 1, 1], cameraFillModes: ["fill", "fit", "fill", "fill"], cameraFillOffsetsX: [0, 0, 0, 0], cameraFillOffsetsY: [0, 0, 0, 0],
      multiCamBorderEnabled: true, multiCamBorderColor: "5A7FB8", multiCamBorderThickness: "medium", gridCol: 0, gridRow: 7, colSpan: 12, rowSpan: 5,
    }),
    tile({ entityId: "vacuum.robo", gridCol: 0, gridRow: 12, colSpan: 4, rowSpan: 3 }),
    tile({ entityId: "lawn_mower.lawny", gridCol: 4, gridRow: 12, colSpan: 4, rowSpan: 3 }),
    tile({ entityId: "person.alex", gridCol: 8, gridRow: 12, colSpan: 4, rowSpan: 3 }),
    tile({ entityId: "alarm_control_panel.house", gridCol: 0, gridRow: 15, colSpan: 4, rowSpan: 3 }),
    tile({ entityId: "person.sam", usePersonPhoto: false, gridCol: 4, gridRow: 15, colSpan: 4, rowSpan: 3 }),
    tile({ entityId: "calendar.family", icon: "calendar", gridCol: 8, gridRow: 15, colSpan: 2, rowSpan: 3 }),
    tile({ entityId: "weather.home", icon: "cloud.sun.fill", gridCol: 10, gridRow: 15, colSpan: 2, rowSpan: 3 }),
    // Part 3f batch 2: a template tile as the phone adds it, rendered by the
    // stand-in `render_values`, and a music hub whose kitchen speaker plays.
    tile({
      entityId: "template.5F3C1A00-0000-4000-8000-0000000000A1", icon: "chevron.left.forwardslash.chevron.right", color: "#CCD8E6",
      customLabel: "Template", templateString: HOME_STATUS_TEMPLATE, gridCol: 0, gridRow: 18, colSpan: 6, rowSpan: 4,
    }),
    tile({
      entityId: "music_hub.5F3C1A00-0000-4000-8000-0000000000A2", icon: "music.note.house", color: "#E89545", customLabel: "Music",
      musicHubSpeakerIds: ["media_player.kitchen_speaker", "media_player.office_speaker"], showAlbumArt: true, gridCol: 6, gridRow: 18, colSpan: 6, rowSpan: 4,
    }),
    // The voice tiles as the phone adds them (a new Speak tile is on Choose
    // Speakers with none, so a save asks), and a point control tile.
    tile({ entityId: "assist.voice_hub", icon: "waveform.and.mic", color: "#5E9EFF", customLabel: "Assist", gridCol: 0, gridRow: 22, colSpan: 4, rowSpan: 3 }),
    tile({
      entityId: "speak_message.voice_hub", icon: "message.and.waveform", color: "#D057D9", customLabel: "Speak",
      speakMessageOutputMode: "configuredSpeakers", gridCol: 4, gridRow: 22, colSpan: 4, rowSpan: 3,
    }),
    tile({
      entityId: "point_control.5F3C1A00-0000-4000-8000-0000000000A3", icon: "hand.point.up.left", color: "#00FFFF", customLabel: "Point Control",
      gridCol: 8, gridRow: 22, colSpan: 4, rowSpan: 3,
    }),
  ];
  return { ...clone(base), id: "5F3C1A00-0000-4000-8000-0000000000FF", name: "Special tiles", items };
}

/** A document with the special tiles page added at the end. */
function withSpecialPage(document: Json): Json {
  const page = specialTilesPage();
  if (page === undefined) return document;
  return { ...document, pages: [...pagesOf(document), page] };
}

/** A smart page (part 3f batch 3) as the phone's Add Domain writes it:
 * Lights, then Doors and Windows, two rules on one domain, so the Rules
 * card shows its shared domain note. The doors are resolved, the windows
 * are not yet (a save resolves them). */
function smartOpeningsPage(): Json {
  const rule = (id: string, domain: string, label: string, icon: string, color: string, extra: Json = {}): Json => ({
    domain, entityIds: [], header: "label", headerLabel: label, id, invertActive: false, mode: "all",
    tileStyle: { color, icon }, ...extra,
  });
  return {
    id: "5F3C1A00-0000-4000-8000-0000000000FE",
    name: "Openings",
    items: [],
    groups: [],
    dynamicConfig: {
      liveUpdates: false, pullToRefresh: true, refreshOnAppear: false, sortOrder: "domain", tileColSpan: 4, tileRowSpan: 3, tileShowLabel: true,
      rules: [
        rule("5F3C1A00-0000-4000-8000-0000000000E1", "light", "Lights", "lightbulb.fill", "#FFCC00", {
          resolvedEntityIds: ["light.hallway", "light.kitchen", "light.porch"], headerGlow: 0.5,
        }),
        rule("5F3C1A00-0000-4000-8000-0000000000E2", "binary_sensor", "Doors", "door.left.hand.open", "#5AC8FA", {
          deviceClassFilter: ["door"], resolvedEntityIds: ["binary_sensor.back_door", "binary_sensor.front_door", "binary_sensor.kitchen_window"],
        }),
        rule("5F3C1A00-0000-4000-8000-0000000000E3", "binary_sensor", "Windows", "window.horizontal", "#5AC8FA", {
          deviceClassFilter: ["window"], header: "line",
        }),
      ],
    },
  };
}

/** A document with the smart Openings page added at the end. */
function withSmartPage(document: Json): Json {
  return { ...document, pages: [...pagesOf(document), smartOpeningsPage()] };
}

/** A made-up state for every entity a fixture or a stored document names,
 * and the few more the entity picker should meet (`harness-home.ts`). */
function buildStates(): Record<string, HassEntityState> {
  const ids = new Set<string>();
  for (const fixture of Object.values(pageFixtures)) entityIdsIn(fixture, ids);
  for (const byKind of store.records.values()) for (const record of byKind.values()) entityIdsIn(record.document, ids);
  const states: Record<string, HassEntityState> = {};
  [...ids].sort().forEach((id, i) => { states[id] = madeUpState(id, i); });
  for (const extra of EXTRA_STATES) states[extra.entity_id] ??= extra;
  for (const special of SPECIAL_STATES) states[special.entity_id] = special;
  // `?many=3000` adds that many more entities, a few of kinds the watch has
  // no tile for, to try the Add tile list on a large home.
  const many = Number(new URLSearchParams(location.search).get("many") ?? 0);
  const bulkDomains = ["light", "switch", "sensor", "binary_sensor", "media_player", "cover", "automation", "group", "sun"];
  for (let i = 0; i < many; i++) {
    const id = `${bulkDomains[i % bulkDomains.length]}.bulk_${String(i).padStart(4, "0")}`;
    states[id] ??= madeUpState(id, i);
  }
  return states;
}

/** Every `icon` a fixture's tiles name: real SF Symbols the stand-in symbol
 * provider then draws. */
function iconNamesIn(value: unknown, out = new Set<string>()): Set<string> {
  if (Array.isArray(value)) {
    for (const v of value) iconNamesIn(v, out);
  } else if (isObject(value)) {
    for (const [k, v] of Object.entries(value)) {
      if (k === "icon" && typeof v === "string" && v !== "" && !v.includes(":")) out.add(v);
      else iconNamesIn(v, out);
    }
  }
  return out;
}

// ── the connection ───────────────────────────────────────────────────────

interface LogEntry {
  seq: number;
  at: string;
  /** `command`, `subscribe`, `unsubscribe`, `event` (sent to the element),
   * `dropped` (an event the offline connection lost), or `iphone`. */
  what: string;
  type?: string;
  message?: Json;
  reply?: unknown;
  error?: unknown;
  ms?: number;
  note?: string;
}

const log: LogEntry[] = [];
let logSeq = 0;

function addLog(entry: Omit<LogEntry, "seq" | "at">): LogEntry {
  const full: LogEntry = { seq: ++logSeq, at: new Date().toISOString(), ...entry };
  log.push(full);
  renderLog();
  return full;
}

let offline = false;
let admin = true;
/** The watch the element shows: the last `owner_watch_id` it asked for the
 * pages of. */
let shownWatchId: string | undefined;

/** What `home-assistant-js-websocket` rejects a command with when the socket
 * drops: the whole result message, not its `error`, so `code` is not at the
 * top. */
const CONNECTION_LOST = { type: "result", success: false, error: { code: 3, message: "Connection lost" } };

type FieldType = "str" | "int" | "dict" | "list" | "bool";

/** Each command's voluptuous schema, `type` and `id` aside. Extra keys are
 * refused, as `BASE_COMMAND_MESSAGE_SCHEMA` refuses them. */
const SCHEMAS: Record<string, { fields: Record<string, FieldType>; admin: boolean }> = {
  [CMD.owners]: { fields: {}, admin: true },
  [CMD.get]: { fields: { owner_watch_id: "str", kind: "str" }, admin: true },
  [CMD.save]: { fields: { owner_watch_id: "str", kind: "str", base_revision: "int", document: "dict" }, admin: true },
  [CMD.history]: { fields: { owner_watch_id: "str", kind: "str" }, admin: true },
  [CMD.historyEntry]: { fields: { owner_watch_id: "str", kind: "str", revision: "int" }, admin: true },
  [CMD.restore]: { fields: { owner_watch_id: "str", kind: "str", revision: "int", base_revision: "int" }, admin: true },
  [CMD.subscribe]: { fields: { owner_watch_id: "str" }, admin: false },
  [CMD.render]: { fields: { templates: "dict" }, admin: true },
  [CMD.configEntries]: { fields: { domain: "str" }, admin: true },
  [CMD.cloudStatus]: { fields: {}, admin: false },
  [CMD.areas]: { fields: {}, admin: false },
  [CMD.historyPeriod]: {
    fields: { start_time: "str", entity_ids: "list", minimal_response: "bool", no_attributes: "bool", significant_changes_only: "bool" },
    admin: false,
  },
};

function checkMessage(message: Json): void {
  const type = message.type;
  const schema = typeof type === "string" ? SCHEMAS[type] : undefined;
  if (!schema) fail("unknown_command", "Unknown command.");
  for (const key of Object.keys(message)) {
    if (key !== "type" && key !== "id" && !(key in schema.fields)) {
      fail("invalid_format", `Message incorrectly formatted: extra keys not allowed @ data['${key}']`);
    }
  }
  for (const [key, want] of Object.entries(schema.fields)) {
    if (!(key in message)) fail("invalid_format", `Message incorrectly formatted: required key not provided @ data['${key}']`);
    const value = message[key];
    const ok = want === "str" ? typeof value === "string" : want === "int" ? isInt(value)
      : want === "list" ? Array.isArray(value) : want === "bool" ? typeof value === "boolean" : isObject(value);
    if (!ok) fail("invalid_format", `Message incorrectly formatted: expected ${want} for dictionary value @ data['${key}']`);
  }
  if (schema.admin && !admin) fail("unauthorized", "Unauthorized");
}

function recordReply(kind: string, record: StoredRecord | undefined): Json {
  if (!record) {
    return {
      kind, revision: 0, hash: null, updated_at: null, updated_by: null,
      delivered_revision: 0, delivered_at: null, rejected_revision: 0, rejected_at: null,
    };
  }
  return {
    kind,
    revision: record.revision,
    hash: record.hash,
    updated_at: record.updated_at,
    updated_by: record.updated_by,
    delivered_revision: record.delivered_revision,
    delivered_at: record.delivered_at,
    rejected_revision: record.rejected_revision,
    rejected_at: record.rejected_at,
    document: clone(record.document),
  };
}

/** The server: one answer per command, by type. Throws a `WsError`. */
function answer(message: Json): unknown {
  checkMessage(message);
  const owner = message.owner_watch_id as string;
  switch (message.type) {
    case CMD.owners:
      return { owners: clone(OWNERS), max_schema_version: 10, token: 0 };
    case CMD.get: {
      const record = store.get(owner, message.kind);
      if (message.kind === "pages") { shownWatchId = owner; onHarnessChange(); }
      return recordReply(message.kind as string, record);
    }
    case CMD.save:
      return { revision: store.panelSave(owner, message.kind, clone(message.document), message.base_revision).revision };
    case CMD.history:
      return {
        entries: store.history(owner, message.kind).map((e) => ({
          revision: e.revision, hash: e.hash, updated_at: e.updated_at, updated_by: e.updated_by, size: documentSize(e.document),
        })),
      };
    case CMD.historyEntry: {
      const e = store.historyEntry(owner, message.kind, message.revision);
      return { revision: e.revision, hash: e.hash, updated_at: e.updated_at, updated_by: e.updated_by, document: clone(e.document) };
    }
    case CMD.restore:
      return { revision: store.restore(owner, message.kind, message.revision, message.base_revision).revision };
    case CMD.render:
      return { results: Object.fromEntries(Object.entries(message.templates as Json).map(([key, t]) => [key, renderStandIn(String(t))])) };
    case CMD.configEntries:
      // Music Assistant is set up; nothing else is asked.
      return message.domain === "music_assistant"
        ? [{ entry_id: "01HARNESSMUSICASSISTANT0", domain: "music_assistant", title: "Music Assistant", source: "zeroconf", state: "loaded", disabled_by: null }]
        : [];
    case CMD.cloudStatus:
      return { logged_in: true, cloud: "connected", http_use_ssl: false };
    case CMD.areas:
      // The registry's areas, the living room with an alias.
      return Object.values(registries.areas).map((a) => ({
        area_id: a.area_id, name: a.name, aliases: a.area_id === "living_room" ? ["Lounge"] : [],
      }));
    case CMD.historyPeriod: {
      // Alex's room sensor moved round the house today; nothing else has
      // any history here. Compressed, as `minimal_response` answers.
      const now = Date.now() / 1000;
      const out: Json = {};
      for (const id of message.entity_ids as string[]) {
        if (id !== "sensor.alex_room") continue;
        out[id] = [
          { s: "Kitchen", lu: now - 6 * 3600 },
          { s: "unavailable", lu: now - 5 * 3600 },
          { s: "bedroom", lu: now - 4 * 3600 },
          { s: "Office", lu: now - 2 * 3600 },
          { s: "living_room", lu: now - 20 * 60 },
        ];
      }
      return out;
    }
    default:
      // A type with a schema but no answer here: a gap in the harness.
      return fail("unknown_command", "Unknown command.");
  }
}

/** Half the delay on the way in, the store, half on the way out. Going
 * offline in between loses the reply, as a dropped socket does. */
async function sendMessagePromise<T>(input: Record<string, unknown>): Promise<T> {
  const message = clone(input) as Json;
  const started = performance.now();
  const entry = addLog({ what: "command", type: String(message.type), message });
  const finish = (fields: Partial<LogEntry>) => {
    Object.assign(entry, fields, { ms: Math.round(performance.now() - started) });
    renderLog();
  };
  if (offline) {
    finish({ error: CONNECTION_LOST });
    throw clone(CONNECTION_LOST);
  }
  await sleep(DELAY_MS / 2);
  if (offline) {
    finish({ error: CONNECTION_LOST });
    throw clone(CONNECTION_LOST);
  }
  let reply: unknown;
  let error: unknown;
  try {
    reply = answer(message);
  } catch (err) {
    error = err;
  }
  if (isObject(error) && error.code === "unknown_command") {
    console.warn(`[harness] the element sent ${String(message.type)}, which the fake server does not know`, message);
  }
  onHarnessChange();
  await sleep(DELAY_MS / 2);
  if (offline) {
    finish({ reply, error: CONNECTION_LOST, note: "answered, but the reply was lost" });
    throw clone(CONNECTION_LOST);
  }
  finish(error === undefined ? { reply: clone(reply) } : { error });
  if (error !== undefined) throw clone(error);
  return clone(reply) as T;
}

let subscriptionSeq = 0;

async function subscribeMessage<T>(callback: (message: T) => void, input: Record<string, unknown>): Promise<() => Promise<void>> {
  const message = clone(input) as Json;
  const started = performance.now();
  const id = ++subscriptionSeq;
  const entry = addLog({ what: "subscribe", type: String(message.type), message, note: `subscription ${id}` });
  const finish = (fields: Partial<LogEntry>) => {
    Object.assign(entry, fields, { ms: Math.round(performance.now() - started) });
    renderLog();
  };
  if (offline) {
    finish({ error: CONNECTION_LOST });
    throw clone(CONNECTION_LOST);
  }
  await sleep(DELAY_MS / 2);
  let reply: unknown;
  let error: unknown;
  try {
    checkMessage(message);
    if (message.type !== CMD.subscribe) fail("unknown_command", "Unknown command.");
    reply = { revisions: store.revisions(message.owner_watch_id as string) };
  } catch (err) {
    error = err;
  }
  await sleep(DELAY_MS / 2);
  if (offline) error = CONNECTION_LOST;
  finish(error === undefined ? { reply } : { error });
  if (error !== undefined) {
    if (isObject(error) && error.code === "unknown_command") {
      console.warn(`[harness] the element subscribed to ${String(message.type)}, which the fake server does not know`, message);
    }
    throw clone(error);
  }
  const owner = message.owner_watch_id as string;
  let open = true;
  const remove = store.addListener((changedOwner, kind, revision) => {
    if (changedOwner !== owner) return;
    const event = { kind, revision };
    setTimeout(() => {
      if (!open) return;
      if (offline) {
        addLog({ what: "dropped", type: CMD.subscribe, reply: event, note: `subscription ${id}, offline` });
        return;
      }
      addLog({ what: "event", type: CMD.subscribe, reply: event, note: `subscription ${id}` });
      callback(clone(event) as T);
    }, DELAY_MS / 2);
  });
  // The initial result is not handed to the callback: Home Assistant's
  // subscribeMessage resolves with it and calls back for events only.
  return async () => {
    if (!open) return;
    open = false;
    remove();
    addLog({ what: "unsubscribe", type: CMD.subscribe, note: `subscription ${id}` });
  };
}

// `home-assistant-js-websocket` tells of a reconnect with a `ready` event on
// the one connection object it keeps; "Go online" fires it here.
const readyListeners = new Set<() => void>();
const connection: HassLike["connection"] & {
  addEventListener(type: string, listener: () => void): void;
  removeEventListener(type: string, listener: () => void): void;
} = {
  sendMessagePromise,
  subscribeMessage: subscribeMessage as HassLike["connection"]["subscribeMessage"],
  addEventListener(type, listener) {
    if (type === "ready") readyListeners.add(listener);
  },
  removeEventListener(type, listener) {
    if (type === "ready") readyListeners.delete(listener);
  },
};

let states: Record<string, HassEntityState> = {};
/** Made with the states on every reset, then the same objects on every
 * tick, as the frontend keeps them. */
let registries: HomeRegistries = { entities: {}, devices: {}, areas: {} };
let dark = false;

/** The services the panel reads: the `tts` domain's, as Home Assistant
 * lists them. */
const HARNESS_SERVICES: Record<string, Record<string, unknown>> = {
  tts: { speak: {}, clear_cache: {}, cloud_say: {} },
};

function makeHass(): HassLike {
  return {
    connection,
    states,
    entities: registries.entities,
    devices: registries.devices,
    areas: registries.areas,
    user: { id: "harness-user", name: "Harness admin", is_admin: admin },
    language: "en",
    themes: { darkMode: dark },
    // The voice engines list `tts.<platform>` for each `<platform>_say`
    // service (part 3f batch 2); Home Assistant Cloud's is the one here.
    services: HARNESS_SERVICES,
  };
}

// The panel hands the element its symbol provider and bumps `iconsTick` when
// the provider has more to draw. The stand-in's names arrive 600 ms after the
// page loads, as the panel's symbol file does. `?noicons` in the address
// mounts the element with no provider at all, as the harness did before.
const noIcons = new URLSearchParams(location.search).has("noicons");
const icons = new StandInIcons([...iconNamesIn(pageFixtures), ...SPECIAL_SYMBOLS]);
window.setTimeout(() => {
  icons.arrive();
  if (editor && "iconsTick" in editor) editor.iconsTick++;
}, 600);

// ── the page and the strip ───────────────────────────────────────────────

const frame = document.getElementById("frame") as HTMLElement;
const strip = document.getElementById("strip") as HTMLElement;
let editor: HTMLElementTagNameMap["wa-page-editor"] | HTMLElementTagNameMap["wa-menu-editor"] | HTMLElementTagNameMap["wa-control-center-editor"] | HTMLElementTagNameMap["wa-rooms-editor"] | undefined;

/** `pages-harness.html?menus` mounts the menu editor in place of the page
 * editor, on the same store. */
const menusMode = new URLSearchParams(location.search).has("menus");
/** `pages-harness.html?control-center` mounts the Control Center editor. */
const controlCenterMode = new URLSearchParams(location.search).has("control-center");
/** `pages-harness.html?rooms` mounts the Rooms editor, on the same store. */
const roomsMode = new URLSearchParams(location.search).has("rooms");

interface Prefs { dark: boolean; narrow: boolean; width: string }
const prefs: Prefs = { dark: false, narrow: false, width: "full" };
try {
  Object.assign(prefs, JSON.parse(localStorage.getItem("wa-pages-harness") ?? "{}"));
} catch {
  // No storage here: the defaults stand.
}
dark = prefs.dark;

function savePrefs(): void {
  try {
    localStorage.setItem("wa-pages-harness", JSON.stringify(prefs));
  } catch {
    // No storage here: nothing to remember.
  }
}

function mount(): void {
  frame.replaceChildren();
  if (controlCenterMode) {
    const cc = document.createElement("wa-control-center-editor");
    cc.hass = makeHass();
    cc.owners = OWNERS;
    cc.ownerId = undefined;
    cc.narrow = prefs.narrow;
    cc.icons = noIcons ? undefined : icons;
    frame.append(cc);
    editor = cc;
    return;
  }
  if (menusMode) {
    const menus = document.createElement("wa-menu-editor");
    menus.hass = makeHass();
    menus.owners = OWNERS;
    menus.ownerId = undefined;
    menus.narrow = prefs.narrow;
    menus.icons = noIcons ? undefined : icons;
    frame.append(menus);
    editor = menus;
    return;
  }
  if (roomsMode) {
    const rooms = document.createElement("wa-rooms-editor");
    rooms.hass = makeHass();
    rooms.owners = OWNERS;
    rooms.ownerId = undefined;
    rooms.narrow = prefs.narrow;
    frame.append(rooms);
    editor = rooms;
    return;
  }
  const el = document.createElement("wa-page-editor");
  el.hass = makeHass();
  el.owners = OWNERS;
  el.ownerId = undefined;
  el.narrow = prefs.narrow;
  el.icons = noIcons ? undefined : icons;
  el.loadImageSize = loadStandInImage;
  frame.append(el);
  editor = el;
}

function shownWatch(): string {
  return shownWatchId ?? WATCH_IDS.find((id) => store.record(id, "pages")) ?? WATCH_IDS[0]!;
}

function watchLabel(id: string): string {
  const o = OWNERS.find((w) => w.owner_watch_id === id);
  return o ? `${o.device_name ?? id}${o.paired_iphone_name ? ` (${o.paired_iphone_name})` : ""}` : id;
}

let said = "";
function say(text: string): void {
  said = text;
  onHarnessChange();
}

// The iPhone's changes: each one uploads a new revision of the shown watch's
// pages, signed by the watch, delivered at once, listeners told.

let renameCount = 0;

function iphoneUpload(action: string, change: (document: Json) => string | undefined): void {
  const watch = shownWatch();
  const record = store.record(watch, "pages");
  if (!record) {
    say(`${action}: ${watchLabel(watch)} has no pages record. "iPhone: add a page" uploads a first one.`);
    return;
  }
  const document = clone(record.document);
  const what = change(document);
  if (what === undefined) {
    say(`${action}: nothing to change on ${watchLabel(watch)}.`);
    return;
  }
  try {
    const saved = store.put(watch, "pages", document, { base: record.revision, by: watch });
    addLog({ what: "iphone", note: `${what}; revision ${saved.revision}`, type: "device upload" });
    say(`iPhone: ${what}. Revision ${saved.revision}, delivered.`);
  } catch (err) {
    say(`${action} refused: ${(err as WsError).message}`);
  }
}

function newPageId(): string {
  const random = typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx".replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));
  return random.toUpperCase();
}

function newPage(document: Json | undefined): Json {
  const template = pagesOf(pageFixtures["06-new-page"])[0] ?? { items: [], isDeletable: true, isHidden: false, isSystemPage: false };
  const names = new Set(pagesOf(document).map((p) => p.name));
  let n = 1;
  while (names.has(`New Page ${n}`)) n++;
  return { ...clone(template), id: newPageId(), name: `New Page ${n}`, items: [] };
}

const iphoneActions: [string, () => void][] = [
  ["iPhone: rename a page", () => iphoneUpload("Rename", (doc) => {
    const page = pagesOf(doc)[0];
    if (!page) return undefined;
    const base = String(page.name ?? "Untitled page").replace(/ \(iPhone \d+\)$/, "");
    page.name = `${base} (iPhone ${++renameCount})`;
    return `renamed "${base}" to "${page.name}"`;
  })],
  ["iPhone: move a tile", () => iphoneUpload("Move a tile", (doc) => {
    for (const page of pagesOf(doc)) {
      if (isObject(page.dynamicConfig) || !Array.isArray(page.items) || page.items.length < 2) continue;
      const items = page.items as Json[];
      const span = (t: Json) => `${t.colSpan ?? ""}x${t.rowSpan ?? ""}`;
      for (let j = items.length - 1; j > 0; j--) {
        const i = items.findIndex((t, k) => k < j && span(t) === span(items[j]!));
        if (i < 0) continue;
        const a = items[i]!;
        const b = items[j]!;
        [a.gridCol, b.gridCol] = [b.gridCol, a.gridCol];
        [a.gridRow, b.gridRow] = [b.gridRow, a.gridRow];
        items.splice(j, 1);
        items.splice(i, 0, b);
        return `moved ${String(b.entityId)} to the place of ${String(a.entityId)} on "${String(page.name)}"`;
      }
      const last = items.pop()!;
      items.unshift(last);
      return `moved ${String(last.entityId)} to the front of "${String(page.name)}"`;
    }
    return undefined;
  })],
  ["iPhone: reorder pages", () => iphoneUpload("Reorder pages", (doc) => {
    const pages = doc.pages as Json[];
    if (!Array.isArray(pages) || pages.length < 2) return undefined;
    const last = pages.pop()!;
    pages.unshift(last);
    return `moved "${String(last.name)}" to the front`;
  })],
  ["iPhone: delete a page", () => iphoneUpload("Delete a page", (doc) => {
    const pages = doc.pages as Json[];
    if (!Array.isArray(pages) || pages.length < 2) return undefined;
    for (let i = pages.length - 1; i >= 0; i--) {
      const page = pages[i]!;
      if (page.isDeletable === false || page.isSystemPage === true) continue;
      pages.splice(i, 1);
      return `deleted "${String(page.name)}"`;
    }
    return undefined;
  })],
  ["iPhone: style a page", () => iphoneUpload("Style a page", (doc) => {
    // Part 3d: a page with a pattern and a title, and its first tiles with a
    // border, a pattern, an effect and a state bar, as the phone writes
    // them: one decoration at a time (a pattern leaves the background black
    // at the cleared brightness, with no overlay or image keys), every key in
    // sorted order.
    const page = pagesOf(doc).find((p) => !isObject(p.dynamicConfig) && p.isSystemPage !== true && Array.isArray(p.items) && p.items.length > 0);
    if (!page) return undefined;
    for (const key of Object.keys(page)) {
      if (/^background(Overlay|Image)/.test(key)) delete page[key];
    }
    assignSorted(page, {
      backgroundColor: "#000000", backgroundBrightness: 0.6,
      backgroundPattern: "dots", backgroundPatternColor: "#A5B7CF", backgroundPatternOpacity: 0.6, backgroundPatternScale: 1,
      pageTitleDisplayStyle: "pill", pageTitleTextSize: "size12", pageTitleIcon: "house.fill",
    });
    const tiles = (page.items as Json[]).filter(isObject);
    const looks: Json[] = [
      { borderStyle: "line", borderThickness: "medium", borderLineStyle: "solid", borderGlow: 0.6, borderActiveOnly: false, stateBarStyle: "Top", stateBarBorder: true },
      { borderStyle: "line", borderThickness: "thin", borderLineStyle: "dashed", borderActiveOnly: false, backgroundPattern: "stripes", patternOpacity: 1 },
      { borderStyle: "animate", borderAnimation: "chase", borderActiveOnly: false, tileAnimation: "aurora", stateBarStyle: "Fill", stateValueLabelStyle: "Pill" },
    ];
    tiles.slice(0, looks.length).forEach((tile, i) => assignSorted(tile, looks[i]!));
    return `styled "${String(page.name)}" and ${Math.min(tiles.length, looks.length)} of its tiles`;
  })],
  ["iPhone: add a page", () => {
    const watch = shownWatch();
    if (!store.record(watch, "pages")) {
      const page = newPage(undefined);
      const saved = store.put(watch, "pages", { schemaVersion: 1, pages: [page] }, { base: 0, by: watch });
      addLog({ what: "iphone", note: `first upload with "${String(page.name)}"; revision ${saved.revision}`, type: "device upload" });
      say(`iPhone: first upload for ${watchLabel(watch)}, with "${String(page.name)}". Revision 1, delivered.`);
      return;
    }
    iphoneUpload("Add a page", (doc) => {
      const page = newPage(doc);
      (doc.pages as Json[]).push(page);
      return `added "${String(page.name)}"`;
    });
  }],
  ["iPhone picks up the save", () => {
    const watch = shownWatch();
    const record = store.record(watch, "pages");
    if (!record) return say(`${watchLabel(watch)} has no pages record.`);
    const moved = markDelivered(record, record.revision);
    addLog({ what: "iphone", note: `collected revision ${record.revision}`, type: "device get" });
    say(moved
      ? `The iPhone has revision ${record.revision}. The view learns it on its next check (every 15 s while waiting) or reload.`
      : `The iPhone already had revision ${record.revision}.`);
  }],
  ["iPhone cannot read it", () => {
    const watch = shownWatch();
    const record = store.record(watch, "pages");
    if (!record) return say(`${watchLabel(watch)} has no pages record.`);
    const moved = markRejected(record);
    addLog({ what: "iphone", note: `could not read revision ${record.revision}`, type: "device get" });
    say(moved
      ? `The iPhone could not read revision ${record.revision}. The view learns it on its next check or reload.`
      : `Already reported for revision ${record.revision}.`);
  }],
];

function button(label: string, onClick: () => void, title?: string): HTMLButtonElement {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = label;
  if (title) b.title = title;
  b.addEventListener("click", onClick);
  return b;
}

function row(tag: string, ...children: (HTMLElement | string)[]): HTMLElement {
  const div = document.createElement("div");
  div.className = "row";
  const t = document.createElement("span");
  t.className = "tag";
  t.textContent = tag;
  div.append(t, ...children);
  return div;
}

const statusEl = document.createElement("span");
statusEl.id = "status";
const saidEl = document.createElement("div");
saidEl.id = "said";
const failBtn = button("Next save fails: unavailable", () => {
  store.failNextWrite = !store.failNextWrite;
  say(store.failNextWrite ? "The next save or restore that reaches the store fails with unavailable." : "Armed failure taken back.");
}, "One shot: the next save or restore that passes the shape and revision checks is refused with code unavailable.");
const offlineBtn = button("Go offline", () => {
  offline = !offline;
  if (!offline) {
    addLog({ what: "event", type: "ready", note: `connection back, ${readyListeners.size} listening` });
    for (const listener of [...readyListeners]) listener();
  }
  say(offline
    ? "Offline: every command and subscribe rejects as a dropped socket does, and live events are lost."
    : "Online again. Events missed while offline are not replayed, as in Home Assistant.");
}, "Commands reject with home-assistant-js-websocket's connection-lost result: {type, success: false, error: {code: 3, message}}.");

const adminBox = document.createElement("input");
adminBox.type = "checkbox";
adminBox.checked = true;
adminBox.addEventListener("change", () => {
  admin = adminBox.checked;
  if (editor) editor.hass = makeHass();
  say(admin ? "Signed in as an administrator." : "Not an administrator: every admin command is refused with unauthorized.");
});

// Home Assistant hands the panel a new `hass` object whenever any state
// changes, which in a real home is several times a second. Each one redraws
// the editor; fields being typed in must survive it.
const tickBox = document.createElement("input");
tickBox.type = "checkbox";
tickBox.checked = true;
let tickTimer: number | undefined;
let ticks = 0;
function setTicking(on: boolean): void {
  if (tickTimer !== undefined) window.clearInterval(tickTimer);
  tickTimer = undefined;
  if (!on) return;
  tickTimer = window.setInterval(() => {
    ticks++;
    states = { ...states };
    if (editor) editor.hass = makeHass();
  }, 500);
}
tickBox.addEventListener("change", () => {
  setTicking(tickBox.checked);
  say(tickBox.checked ? "A fresh hass object every 500 ms, as Home Assistant sends on state changes." : "No state ticks.");
});
setTicking(true);

const catalogBox = document.createElement("input");
catalogBox.type = "checkbox";
catalogBox.checked = catalogOn;
catalogBox.addEventListener("change", () => setCatalog(catalogBox.checked));

const themeLight = button("Light", () => setDark(false));
const themeDark = button("Dark", () => setDark(true));

function setDark(on: boolean): void {
  dark = on;
  prefs.dark = on;
  savePrefs();
  frame.classList.toggle("dark", on);
  document.body.classList.toggle("dark", on);
  if (editor) editor.hass = makeHass();
  onHarnessChange();
}

const narrowBox = document.createElement("input");
narrowBox.type = "checkbox";
narrowBox.checked = prefs.narrow;
narrowBox.addEventListener("change", () => {
  prefs.narrow = narrowBox.checked;
  if (prefs.narrow) prefs.width = "390";
  savePrefs();
  applyLayout();
});

const widthSelect = document.createElement("select");
for (const [value, label] of [["390", "390 px"], ["820", "820 px"], ["1200", "1200 px"], ["full", "Full width"]]) {
  const option = document.createElement("option");
  option.value = value!;
  option.textContent = label!;
  widthSelect.append(option);
}
widthSelect.addEventListener("change", () => {
  prefs.width = widthSelect.value;
  savePrefs();
  applyLayout();
});

function applyLayout(): void {
  const width = prefs.narrow ? "390" : prefs.width;
  widthSelect.value = width;
  frame.style.width = width === "full" ? "100%" : `${width}px`;
  if (editor) editor.narrow = prefs.narrow;
}

function label(text: string, input: HTMLElement): HTMLLabelElement {
  const l = document.createElement("label");
  l.append(input, text);
  return l;
}

const logBox = document.createElement("details");
const logSummary = document.createElement("summary");
const logList = document.createElement("ol");
logBox.append(logSummary, logList);

function logLine(e: LogEntry): HTMLLIElement {
  const li = document.createElement("li");
  li.value = e.seq;
  const type = (e.type ?? "").replace(/^wrist_assistant\//, "");
  const m = e.message ?? {};
  const args = ["owner_watch_id", "kind", "revision", "base_revision"]
    .filter((k) => k in m)
    .map((k) => `${k === "owner_watch_id" ? "watch" : k}=${String(m[k])}`)
    .join(" ");
  const err = e.error as { code?: unknown; message?: unknown; error?: { code?: unknown } } | undefined;
  const outcome = e.error !== undefined
    ? `ERR ${String(err?.code ?? err?.error?.code)} ${String(err?.message ?? "")}`
    : e.reply !== undefined ? summarize(e.reply) : e.what === "command" || e.what === "subscribe" ? "…" : "";
  li.textContent = `${e.what} ${type} ${args} ${outcome}${e.note ? ` (${e.note})` : ""}${e.ms !== undefined ? ` ${e.ms}ms` : ""}`;
  if (e.error !== undefined) li.className = (err?.code === "unknown_command") ? "unknown" : "err";
  return li;
}

function summarize(reply: unknown): string {
  if (!isObject(reply)) return JSON.stringify(reply);
  if (Array.isArray(reply.entries)) return `${reply.entries.length} entries`;
  if (Array.isArray(reply.owners)) return `${reply.owners.length} owners`;
  if ("revisions" in reply) return JSON.stringify(reply.revisions);
  const parts = ["kind", "revision", "delivered_revision", "rejected_revision", "updated_by"]
    .filter((k) => k in reply)
    .map((k) => `${k}=${String(reply[k])}`);
  if ("document" in reply) parts.push("document");
  return parts.join(" ") || JSON.stringify(reply);
}

let logQueued = false;
function renderLog(): void {
  if (logQueued) return;
  logQueued = true;
  queueMicrotask(() => {
    logQueued = false;
    const unknown = log.filter((e) => isObject(e.error) && e.error.code === "unknown_command").length;
    logSummary.textContent = `Log: ${log.length} entries${unknown ? `, ${unknown} unknown command${unknown === 1 ? "" : "s"}` : ""} (window.__harness.log)`;
    logList.replaceChildren(...log.slice(-80).map(logLine));
    logList.scrollTop = logList.scrollHeight;
  });
}

function onHarnessChange(): void {
  const watch = shownWatch();
  const record = store.record(watch, "pages");
  const facts = record
    ? `pages rev ${record.revision} by ${record.updated_by}, delivered ${record.delivered_revision}, rejected ${record.rejected_revision}, ${record.history.length} in history`
    : "no pages record";
  statusEl.textContent = `Acting on ${watchLabel(watch)} [${watch}]: ${facts}. ${offline ? "OFFLINE." : "Online."}${store.failNextWrite ? " Next save fails." : ""}`;
  saidEl.textContent = said;
  failBtn.classList.toggle("on", store.failNextWrite);
  offlineBtn.textContent = offline ? "Go online" : "Go offline";
  offlineBtn.classList.toggle("on", offline);
  themeLight.classList.toggle("on", !dark);
  themeDark.classList.toggle("on", dark);
}

strip.append(
  row("Harness", statusEl),
  row("iPhone", ...iphoneActions.map(([text, run]) => button(text, run))),
  row("Library", label("Catalog", catalogBox), button("iPhone: add an HTTP action", iphoneAddsAnAction, "Publish the catalog again with one more HTTP action: a new revision and a live event.")),
  row("Server", failBtn, offlineBtn, label("Admin", adminBox), label("States tick", tickBox), button("Reset", () => reset(), "Reseed the store, clear the log, mount a fresh element.")),
  row("View", themeLight, themeDark, label("Narrow", narrowBox), widthSelect),
  saidEl,
  logBox,
);

function reset(): void {
  offline = false;
  admin = true;
  adminBox.checked = true;
  shownWatchId = undefined;
  renameCount = 0;
  log.length = 0;
  seedStore();
  states = buildStates();
  registries = withSpecialDevices(homeRegistries(states));
  mount();
  applyLayout();
  say("Store reseeded.");
  renderLog();
}

declare global {
  interface Window {
    __harness: {
      record(watchId?: string, kind?: string): (StoredRecord & { kind: string; owner_watch_id: string }) | undefined;
      log: LogEntry[];
      reset(): void;
      /** The watch the strip acts on. */
      shownWatch(): string;
      owners: OwnerSummary[];
      /** How many fresh `hass` objects the States tick has handed over. */
      ticks(): number;
      /** How long every reply waits, in ms (150 by default). */
      delay(ms: number): void;
    };
  }
}

window.__harness = {
  record(watchId?: string, kind = "pages") {
    const id = watchId ?? shownWatch();
    const record = store.record(id, kind);
    return record ? { owner_watch_id: id, kind, ...clone(record) } : undefined;
  },
  log,
  reset,
  shownWatch,
  owners: OWNERS,
  ticks: () => ticks,
  delay(ms: number) {
    DELAY_MS = ms;
  },
};

setDark(dark);
reset();
