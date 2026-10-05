// The watch's status pages as Home Assistant keeps them (the `status_pages`
// watch config kind), without any drawing: the document
// `{"schemaVersion": 1, "statusPages": [StatusPageConfig…]}`, its pages, their
// rows and their style.
//
// The document is kept raw, as the page and menu editors keep theirs. Every
// setter takes the document and returns a new one in which only the objects
// on the path of the change are new; every key it does not model goes back
// as it came. A key the document did not have goes in at its sorted place, as
// the phone's sorted-key encoder writes it. A setter refuses by returning the
// document it was given, and so does an edit that changes nothing.
//
// The tables are built from the app's Swift code by the app repo's
// `WatchStatusPagesDocumentTests`: `status-page-keys.json` (every key with its
// type and default, the enums and their words, the style controls, what a new
// page and a new row hold), `status-page-rules.json` (the fill rules and the
// add lists, read in `rules.ts`) and `status-page-defaults.json` (the
// document "Start with the defaults" saves).
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 2 build
// contract", items 16 to 19).

import statusPageDefaults from "./status-page-defaults.json";
import statusPageKeys from "./status-page-keys.json";
import { sameWatchPagesJson } from "../watch-pages/merge.js";
import { randomWatchId } from "../watch-pages/edit.js";
import { type JsonObject, WATCH_SYNC_LIMIT_BYTES, isJsonObject, sizeOf } from "../watch-pages/model.js";
import { watchCommandError } from "../watch-pages/save-note.js";
import { type StatusPagePreset, type StatusStates, STATUS_PAGE_RULES, defaultStatusIcon, readStatusRow } from "./rules.js";

// ── the tables ───────────────────────────────────────────────────────────

interface KeySpec {
  type: string;
  enum?: string;
  required?: boolean;
  optional?: boolean;
  default?: unknown;
}

/** One control of the Style card, as `status-page-keys.json` lists it. */
export interface StatusStyleField {
  key: string;
  label: string;
  kind: "segmented" | "switch" | "slider";
  default: unknown;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  help?: string;
}

interface KeysTable {
  document: { schemaVersion: number; listKey: string };
  enums: Record<string, string[]>;
  labels: Record<string, Record<string, string>>;
  types: { page: { keys: Record<string, KeySpec> }; row: { keys: Record<string, KeySpec> } };
  style: StatusStyleField[];
  newRows: { sectionHeader: JsonObject };
  systemDefaultIds: string[];
}

export const STATUS_PAGE_KEYS = statusPageKeys as unknown as KeysTable;

/** The document "Start with the defaults" saves: the app's five system
 * pages with their fixed ids. A fresh copy each call. */
export function statusPagesDefaults(): StatusPagesDocument {
  return structuredClone((statusPageDefaults as unknown as { document: StatusPagesDocument }).document);
}

/** The document "Start with an empty list" saves. */
export function statusPagesEmpty(): StatusPagesDocument {
  return { schemaVersion: STATUS_PAGE_KEYS.document.schemaVersion, statusPages: [] };
}

// ── the document ─────────────────────────────────────────────────────────

/** The status pages document, raw. */
export type StatusPagesDocument = JsonObject;

/** The key of the page list. */
export const STATUS_PAGES_KEY = "statusPages";

export const STATUS_PAGES_LIMIT_BYTES = WATCH_SYNC_LIMIT_BYTES;

export function asStatusPagesDocument(value: unknown): StatusPagesDocument | undefined {
  return isJsonObject(value) ? value : undefined;
}

/** The document as compact JSON in UTF-8 bytes, as the sync measures it. */
export function statusPagesSize(document: StatusPagesDocument): number {
  return sizeOf(document);
}

export function statusPagesBudget(document: StatusPagesDocument): { size: number; limit: number; share: number; near: boolean } {
  const size = statusPagesSize(document);
  const share = size / STATUS_PAGES_LIMIT_BYTES;
  return { size, limit: STATUS_PAGES_LIMIT_BYTES, share, near: share > 0.8 };
}

/** The raw page list, or an empty one when there is none. */
function rawPages(document: StatusPagesDocument): unknown[] {
  const list = Object.hasOwn(document, STATUS_PAGES_KEY) ? document[STATUS_PAGES_KEY] : undefined;
  return Array.isArray(list) ? list : [];
}

/** The pages, in the watch's order: every entry that is an object. */
export function statusPagesOf(document: StatusPagesDocument | undefined): JsonObject[] {
  return document === undefined ? [] : rawPages(document).filter(isJsonObject);
}

export function statusPageId(page: JsonObject): string {
  return typeof page.id === "string" ? page.id : "";
}

export function statusPageName(page: JsonObject): string {
  return typeof page.name === "string" ? page.name : "";
}

/** The rows of a page: every entry that is an object. */
export function statusPageRows(page: JsonObject): JsonObject[] {
  return Array.isArray(page.rows) ? page.rows.filter(isJsonObject) : [];
}

export function statusRowId(row: JsonObject): string {
  return typeof row.id === "string" ? row.id : "";
}

/** Two ids are one when they match ignoring case, as the app reads UUIDs. */
export function sameStatusId(a: unknown, b: unknown): boolean {
  return typeof a === "string" && typeof b === "string" && a !== "" && a.toUpperCase() === b.toUpperCase();
}

export function findStatusPage(document: StatusPagesDocument | undefined, pageId: string): JsonObject | undefined {
  return statusPagesOf(document).find((p) => sameStatusId(statusPageId(p), pageId));
}

export function findStatusRow(page: JsonObject | undefined, rowId: string): JsonObject | undefined {
  return page === undefined ? undefined : statusPageRows(page).find((r) => sameStatusId(statusRowId(r), rowId));
}

/** Whether a page is one of the app's five system pages: their fixed ids.
 * The watch treats them as any other page. */
export function isSystemStatusPage(page: JsonObject): boolean {
  return STATUS_PAGE_KEYS.systemDefaultIds.some((id) => sameStatusId(id, statusPageId(page)));
}

// ── writing keys ─────────────────────────────────────────────────────────

function put(object: JsonObject, key: string, value: unknown): void {
  if (key === "__proto__") Object.defineProperty(object, key, { value, enumerable: true, writable: true, configurable: true });
  else object[key] = value;
}

/** `object` with `key` set. A key it holds keeps its place; a new key goes at
 * its sorted place, as the phone's sorted-key encoder writes it. The object
 * itself when the value is the same JSON. */
export function withStatusKey(object: JsonObject, key: string, value: unknown): JsonObject {
  if (Object.hasOwn(object, key)) {
    if (sameWatchPagesJson(object[key], value) && typeof object[key] === typeof value) return object;
    const out: JsonObject = {};
    for (const k of Object.keys(object)) put(out, k, k === key ? value : object[k]);
    return out;
  }
  const out: JsonObject = {};
  let placed = false;
  for (const k of Object.keys(object)) {
    if (!placed && k > key) {
      put(out, key, value);
      placed = true;
    }
    put(out, k, object[k]);
  }
  if (!placed) put(out, key, value);
  return out;
}

/** `object` without `key`, or the object itself when it has none. */
export function withoutStatusKey(object: JsonObject, key: string): JsonObject {
  if (!Object.hasOwn(object, key)) return object;
  const out: JsonObject = {};
  for (const k of Object.keys(object)) if (k !== key) put(out, k, object[k]);
  return out;
}

/** An object with its keys in sorted order, as the phone writes a new one. */
function sortedObject(object: JsonObject): JsonObject {
  const out: JsonObject = {};
  for (const key of Object.keys(object).sort()) put(out, key, object[key]);
  return out;
}

function withPages(document: StatusPagesDocument, pages: unknown[]): StatusPagesDocument {
  return withStatusKey(document, STATUS_PAGES_KEY, pages);
}

/** The document with one page replaced through `change`. Refuses (the
 * document back) for a page it does not hold or a change that changes
 * nothing. */
function withPage(document: StatusPagesDocument, pageId: string, change: (page: JsonObject) => JsonObject): StatusPagesDocument {
  const list = rawPages(document);
  const index = list.findIndex((p) => isJsonObject(p) && sameStatusId(statusPageId(p), pageId));
  if (index < 0) return document;
  const page = list[index] as JsonObject;
  const next = change(page);
  if (next === page) return document;
  const copy = list.slice();
  copy[index] = next;
  return withPages(document, copy);
}

/** The page with one row replaced through `change`. */
function withRow(page: JsonObject, rowId: string, change: (row: JsonObject) => JsonObject): JsonObject {
  const list = Array.isArray(page.rows) ? page.rows : [];
  const index = list.findIndex((r) => isJsonObject(r) && sameStatusId(statusRowId(r), rowId));
  if (index < 0) return page;
  const row = list[index] as JsonObject;
  const next = change(row);
  if (next === row) return page;
  const copy = list.slice();
  copy[index] = next;
  return withStatusKey(page, "rows", copy);
}

/** `list` with the element at `from` moved to `to` (both clamped). */
function moved<T>(list: readonly T[], from: number, to: number): T[] {
  const copy = list.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(Math.max(0, Math.min(to, copy.length)), 0, item!);
  return copy;
}

// ── ids ──────────────────────────────────────────────────────────────────

/** Makes a new id. Upper case, as the phone's encoder writes a UUID. */
export type StatusIdMaker = () => string;

function newId(make: StatusIdMaker | undefined): string {
  return (make ?? randomWatchId)().toUpperCase();
}

// ── pages ────────────────────────────────────────────────────────────────

/** The name the phone gives a new page: "New Page <n>", n one more than the
 * largest among pages named so ("New Page" alone counts as 1), else 1. */
export function nextStatusPageName(document: StatusPagesDocument): string {
  let largest = 0;
  for (const page of statusPagesOf(document)) {
    const name = statusPageName(page);
    if (name === "New Page") largest = Math.max(largest, 1);
    else if (name.startsWith("New Page ")) {
      const rest = name.slice("New Page ".length);
      // Swift's Int(String): an optional sign and digits, nothing else.
      if (/^[+-]?\d+$/.test(rest)) {
        const n = Number(rest);
        if (Number.isSafeInteger(n)) largest = Math.max(largest, n);
      }
    }
  }
  return `New Page ${largest + 1}`;
}

/** A new page as the phone writes one: every key at its default, the
 * schema stamped, no rows, the keys sorted. */
export function newStatusPage(name: string, id: string): JsonObject {
  const page: JsonObject = {};
  for (const [key, spec] of Object.entries(STATUS_PAGE_KEYS.types.page.keys)) {
    if (key === "id" || key === "name" || key === "rows") continue;
    if (spec.default !== undefined && spec.default !== null) put(page, key, spec.default);
  }
  put(page, "id", id);
  put(page, "name", name);
  put(page, "rows", []);
  return sortedObject(page);
}

/** A new page at the end of the list, named as the phone names it. */
export function addStatusPage(document: StatusPagesDocument, make?: StatusIdMaker): { document: StatusPagesDocument; id: string } {
  const id = newId(make);
  const page = newStatusPage(nextStatusPageName(document), id);
  return { document: withPages(document, [...rawPages(document), page]), id };
}

export function removeStatusPage(document: StatusPagesDocument, pageId: string): StatusPagesDocument {
  const list = rawPages(document);
  const next = list.filter((p) => !(isJsonObject(p) && sameStatusId(statusPageId(p), pageId)));
  return next.length === list.length ? document : withPages(document, next);
}

/** The page moved to `index` in the list. */
export function moveStatusPage(document: StatusPagesDocument, pageId: string, index: number): StatusPagesDocument {
  const list = rawPages(document);
  const from = list.findIndex((p) => isJsonObject(p) && sameStatusId(statusPageId(p), pageId));
  if (from < 0) return document;
  const to = Math.max(0, Math.min(index, list.length - 1));
  return from === to ? document : withPages(document, moved(list, from, to));
}

export function renameStatusPage(document: StatusPagesDocument, pageId: string, name: string): StatusPagesDocument {
  return withPage(document, pageId, (page) => withStatusKey(page, "name", name));
}

// ── style ────────────────────────────────────────────────────────────────

export function statusStyleFields(): readonly StatusStyleField[] {
  return STATUS_PAGE_KEYS.style;
}

/** The choices of an enum, with the phone's words. */
export function statusEnumChoices(name: string): [string, string][] {
  const labels = STATUS_PAGE_KEYS.labels[name] ?? {};
  return (STATUS_PAGE_KEYS.enums[name] ?? []).map((v) => [v, labels[v] ?? v]);
}

function styleEnum(key: string): string | undefined {
  return STATUS_PAGE_KEYS.types.page.keys[key]?.enum;
}

/** A style key's value as the watch reads it: the stored one when it is of
 * the right type (and a known case), else the default. */
export function statusStyleValue(page: JsonObject, field: StatusStyleField): unknown {
  const value = Object.hasOwn(page, field.key) ? page[field.key] : undefined;
  switch (field.kind) {
    case "switch":
      return typeof value === "boolean" ? value : field.default;
    case "slider":
      return typeof value === "number" && Number.isFinite(value) ? value : field.default;
    default: {
      const name = styleEnum(field.key);
      const cases = name === undefined ? [] : (STATUS_PAGE_KEYS.enums[name] ?? []);
      return typeof value === "string" && cases.includes(value) ? value : field.default;
    }
  }
}

/** One style key set, held to its control's type, cases and range. */
export function setStatusPageStyle(document: StatusPagesDocument, pageId: string, key: string, value: unknown): StatusPagesDocument {
  const field = STATUS_PAGE_KEYS.style.find((f) => f.key === key);
  if (field === undefined) return document;
  let v: unknown;
  switch (field.kind) {
    case "switch":
      if (typeof value !== "boolean") return document;
      v = value;
      break;
    case "slider": {
      if (typeof value !== "number" || !Number.isFinite(value)) return document;
      const min = field.min ?? 0;
      const max = field.max ?? min;
      const step = field.step ?? 1;
      const snapped = Math.round((Math.max(min, Math.min(max, value)) - min) / step) * step + min;
      v = Math.round(snapped * 10_000) / 10_000;
      break;
    }
    default: {
      const name = styleEnum(key);
      if (name === undefined || typeof value !== "string" || !(STATUS_PAGE_KEYS.enums[name] ?? []).includes(value)) return document;
      v = value;
    }
  }
  return withPage(document, pageId, (page) => withStatusKey(page, key, v));
}

/** Every style key back to its default, as the phone's Reset to Defaults. */
export function resetStatusPageStyle(document: StatusPagesDocument, pageId: string): StatusPagesDocument {
  return withPage(document, pageId, (page) => {
    let next = page;
    for (const field of STATUS_PAGE_KEYS.style) next = withStatusKey(next, field.key, field.default);
    return next;
  });
}

/** Whether any style key reads other than its default. */
export function statusPageStyleChanged(page: JsonObject): boolean {
  return STATUS_PAGE_KEYS.style.some((f) => !sameWatchPagesJson(statusStyleValue(page, f), f.default));
}

// ── rows ─────────────────────────────────────────────────────────────────

/** An entity's name as Home Assistant has it, else its id. */
function friendlyName(states: StatusStates | undefined, entityId: string): string {
  const state = states === undefined || !Object.hasOwn(states, entityId) ? undefined : states[entityId];
  const name = state?.attributes?.friendly_name;
  return typeof name === "string" && name.trim() !== "" ? name : entityId;
}

function entityDomain(entityId: string): string {
  const dot = entityId.indexOf(".");
  return dot < 0 ? "" : entityId.slice(0, dot);
}

/** A new entity row, as the phone adds one: the entity's name, its domain,
 * the domain's icon. */
export function newStatusEntityRow(entityId: string, states?: StatusStates): JsonObject {
  const domain = entityDomain(entityId);
  return { displayName: friendlyName(states, entityId), domain, entityId, iconName: defaultStatusIcon(domain), rowType: "entity" };
}

/** A new section header, as the phone adds one. */
export function newStatusHeaderRow(): JsonObject {
  return sortedObject({ ...STATUS_PAGE_KEYS.newRows.sectionHeader });
}

/** A new group count from one of the phone's presets with the picked
 * entities; a device class preset keeps its classes and max value. */
export function newStatusGroupCountRow(preset: StatusPagePreset, entityIds: readonly string[]): JsonObject {
  const row: JsonObject = { ...preset.row, entityId: "", groupEntityIds: [...entityIds] };
  if (preset.picker === "deviceClass" && preset.deviceClassFilter !== undefined) row.deviceClassFilter = [...preset.deviceClassFilter];
  if (preset.maxNumericValue !== undefined) row.maxNumericValue = preset.maxNumericValue;
  return sortedObject(row);
}

/** A new dynamic list from one of the phone's tiles: all matching, or hand
 * picked with the picked entities. */
export function newStatusDynamicListRow(tile: StatusPagePreset, entityIds?: readonly string[]): JsonObject {
  const row: JsonObject = { ...tile.row };
  if (entityIds !== undefined) {
    row.dynamicMode = "specific";
    row.groupEntityIds = [...entityIds];
  }
  return sortedObject(row);
}

/** `row` with a new id at the end of the page's rows. */
export function addStatusRow(document: StatusPagesDocument, pageId: string, row: JsonObject, make?: StatusIdMaker): { document: StatusPagesDocument; id?: string } {
  if (findStatusPage(document, pageId) === undefined) return { document };
  const id = newId(make);
  const next = withPage(document, pageId, (page) => withStatusKey(page, "rows", [...(Array.isArray(page.rows) ? page.rows : []), withStatusKey(row, "id", id)]));
  return { document: next, id };
}

/** Whether a page has an entity row for this entity: the phone adds each
 * entity once. */
export function statusPageHasEntity(page: JsonObject, entityId: string): boolean {
  return statusPageRows(page).some((r) => r.entityId === entityId && entityId !== "");
}

export function removeStatusRow(document: StatusPagesDocument, pageId: string, rowId: string): StatusPagesDocument {
  return withPage(document, pageId, (page) => {
    const list = Array.isArray(page.rows) ? page.rows : [];
    const next = list.filter((r) => !(isJsonObject(r) && sameStatusId(statusRowId(r), rowId)));
    return next.length === list.length ? page : withStatusKey(page, "rows", next);
  });
}

/** The row moved to `index` among the page's rows. */
export function moveStatusRow(document: StatusPagesDocument, pageId: string, rowId: string, index: number): StatusPagesDocument {
  return withPage(document, pageId, (page) => {
    const list = Array.isArray(page.rows) ? page.rows : [];
    const from = list.findIndex((r) => isJsonObject(r) && sameStatusId(statusRowId(r), rowId));
    if (from < 0) return page;
    const to = Math.max(0, Math.min(index, list.length - 1));
    return from === to ? page : withStatusKey(page, "rows", moved(list, from, to));
  });
}

/** The row keys the inspector writes, each held to its type. */
const ROW_KEYS: Readonly<Record<string, "string" | "bool" | "number" | "strings" | "enum">> = {
  displayName: "string",
  iconName: "string",
  isHidden: "bool",
  headerAlignment: "enum",
  filterState: "string",
  dynamicMode: "enum",
  maxNumericValue: "number",
  groupEntityIds: "strings",
  showAllStates: "bool",
  deviceClassFilter: "strings",
};

/** One row key set, or removed with `undefined` (an optional key the phone
 * leaves out at nil). A value of the wrong type, or an enum case the table
 * does not name, is refused. */
export function setStatusRowKey(document: StatusPagesDocument, pageId: string, rowId: string, key: string, value: unknown): StatusPagesDocument {
  const kind = ROW_KEYS[key];
  if (kind === undefined) return document;
  if (value !== undefined) {
    switch (kind) {
      case "string":
        if (typeof value !== "string") return document;
        break;
      case "bool":
        if (typeof value !== "boolean") return document;
        break;
      case "number":
        if (typeof value !== "number" || !Number.isFinite(value)) return document;
        break;
      case "strings":
        if (!Array.isArray(value) || !value.every((v) => typeof v === "string")) return document;
        break;
      case "enum": {
        const name = STATUS_PAGE_KEYS.types.row.keys[key]?.enum;
        if (name === undefined || typeof value !== "string" || !(STATUS_PAGE_KEYS.enums[name] ?? []).includes(value)) return document;
        break;
      }
    }
  } else if (STATUS_PAGE_KEYS.types.row.keys[key]?.required === true) {
    return document;
  }
  return withPage(document, pageId, (page) => withRow(page, rowId, (row) => (value === undefined ? withoutStatusKey(row, key) : withStatusKey(row, key, value))));
}

// ── what a row can pick ──────────────────────────────────────────────────

/** The domains a row's entities come from: a sensor or binary sensor row
 * picks from both, as the phone's sensor picker does. */
function pickDomains(domain: string): string[] {
  return domain === "sensor" || domain === "binary_sensor" ? ["sensor", "binary_sensor"] : [domain];
}

/**
 * The entities a group count or a hand picked list can hold: those of its
 * domain (sensors and binary sensors together), of one of its device
 * classes when it has any, sorted by name. Entities it already holds come
 * along whatever they are.
 */
export function statusRowEntityChoices(row: JsonObject, states: StatusStates): string[] {
  const r = readStatusRow(row);
  return statusEntityChoices(r.domain, r.deviceClassFilter, states, r.groupEntityIds ?? []);
}

/** The entities of `domain` (and its sibling, for sensors) of one of
 * `classes` when any are named, sorted by name, with `held` added. */
export function statusEntityChoices(domain: string, classes: readonly string[] | undefined, states: StatusStates, held: readonly string[] = []): string[] {
  const domains = pickDomains(domain);
  const out = new Set<string>();
  for (const [id, state] of Object.entries(states)) {
    if (state === undefined || !domains.includes(entityDomain(id))) continue;
    if (classes !== undefined && classes.length > 0) {
      const cls = state.attributes?.device_class;
      if (typeof cls !== "string" || !classes.includes(cls)) continue;
    }
    out.add(id);
  }
  for (const id of held) out.add(id);
  return [...out].sort((a, b) => friendlyName(states, a).localeCompare(friendlyName(states, b)) || (a < b ? -1 : a > b ? 1 : 0));
}

/** The device classes a row could filter by: those the entities of its
 * domain report, and those it holds, sorted. */
export function statusDeviceClassChoices(domain: string, states: StatusStates, held: readonly string[] = []): string[] {
  const out = new Set<string>(held);
  for (const [id, state] of Object.entries(states)) {
    if (state === undefined || entityDomain(id) !== domain) continue;
    const cls = state.attributes?.device_class;
    if (typeof cls === "string" && cls !== "") out.add(cls);
  }
  return [...out].sort();
}

/** The add lists, from the table. */
export function statusGroupCountPresets(): readonly StatusPagePreset[] {
  return STATUS_PAGE_RULES.groupCountPresets;
}

export function statusDynamicListTiles(): readonly StatusPagePreset[] {
  return STATUS_PAGE_RULES.dynamicListTiles;
}

// ── checks ───────────────────────────────────────────────────────────────

/**
 * What Home Assistant's shape check (`_check_status_pages`) refuses, in
 * plain words, so a save that cannot land is not sent: `statusPages` a list
 * of objects, each with a non-empty string id no other page shares
 * (ignoring case) and a string name, its `rows` a list of objects with a
 * non-empty string id no other row of the page shares.
 */
export function checkStatusPages(document: unknown): string[] {
  if (!isJsonObject(document)) return ["The status pages are not an object."];
  const list = Object.hasOwn(document, STATUS_PAGES_KEY) ? document[STATUS_PAGES_KEY] : undefined;
  if (!Array.isArray(list)) return ["The status page list is missing."];
  const problems: string[] = [];
  const seen = new Set<string>();
  list.forEach((page, index) => {
    if (!isJsonObject(page)) {
      problems.push(`Status page ${index + 1} is not an object.`);
      return;
    }
    const label = typeof page.name === "string" && page.name !== "" ? `"${page.name}"` : `Status page ${index + 1}`;
    if (typeof page.id !== "string" || page.id === "") problems.push(`${label} has no id.`);
    else {
      const folded = page.id.toUpperCase();
      if (seen.has(folded)) problems.push(`${label} has the id of another page.`);
      seen.add(folded);
    }
    if (typeof page.name !== "string") problems.push(`${label} has no name.`);
    if (!Array.isArray(page.rows)) {
      problems.push(`${label} has no row list.`);
      return;
    }
    const rows = new Set<string>();
    for (const row of page.rows) {
      if (!isJsonObject(row) || typeof row.id !== "string" || row.id === "") {
        problems.push(`A row of ${label} has no id.`);
        return;
      }
      const folded = row.id.toUpperCase();
      if (rows.has(folded)) {
        problems.push(`Two rows of ${label} share an id.`);
        return;
      }
      rows.add(folded);
    }
  });
  return problems;
}

/** A restore's one line: how many pages and rows. */
export function statusPagesSummary(document: unknown): string {
  const pages = statusPagesOf(asStatusPagesDocument(document));
  const rows = pages.reduce((n, p) => n + statusPageRows(p).length, 0);
  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
  return `${plural(pages.length, "status page", "status pages")}, ${plural(rows, "row", "rows")} in all.`;
}

// ── no record ────────────────────────────────────────────────────────────

export const STATUS_PAGES_NO_RECORD_TITLE = "No status pages from this watch yet.";

export const STATUS_PAGES_NO_RECORD_TEXT =
  "Start with the defaults here, or open the iPhone app and turn on Edit pages in Home Assistant under Settings, Pages in Home Assistant.";

export const STATUS_PAGES_START_BUTTON = "Start with the defaults";

export const STATUS_PAGES_START_EMPTY_BUTTON = "Start with an empty list";

export const STATUS_PAGES_PAIR_FIRST_TEXT = "Pair this watch first.";

export const STATUS_PAGES_UPDATE_TEXT = "Update the integration to edit status pages here.";

/** Whether a failed read means this integration does not keep status pages:
 * one older than the kind refuses it as `invalid`, one older than the store
 * does not know the command. */
export function statusPagesReadMeansUnsupported(error: unknown): boolean {
  const code = watchCommandError(error).code;
  return code === "invalid" || code === "unknown_command";
}
