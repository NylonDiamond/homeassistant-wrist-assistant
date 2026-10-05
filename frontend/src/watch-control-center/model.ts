// The watch's Control Center list as Home Assistant keeps it (the
// `control_center` watch config kind), without any drawing: the document
// `{"schemaVersion": 1, "entities": [CuratedEntity…]}`, the whole stored
// list in order, hidden entries and entries in other domains included.
//
// The document is kept raw, as the other watch editors keep theirs. Every
// setter takes the document and returns a new one in which only the objects
// on the path of the change are new; every key it does not model goes back
// as it came, on the document and on each entry. A key an object did not
// have goes in at its sorted place, as the phone's sorted-key encoder writes
// it. A setter refuses by returning the document it was given, and so does
// an edit that changes nothing. No setter writes a null: an optional key
// that is not set is left out, as the phone's encoder leaves out a nil.
//
// An entry is matched by its `entityId`, exactly: the list holds each entity
// once, and the watch's controls point at an entry by its entity id.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 5 build
// contract", items 2 to 4).

import { type JsonObject, WATCH_SYNC_LIMIT_BYTES, isJsonObject, sizeOf } from "../watch-pages/model.js";
import { sameWatchPagesJson } from "../watch-pages/merge.js";
import { watchCommandError } from "../watch-pages/save-note.js";
import { CONTROL_CENTER_CUSTOM_KEYS, controlCenterDefaultIcon, controlCenterKind } from "./rules.js";

// ── the document ─────────────────────────────────────────────────────────

/** The Control Center document, raw. */
export type ControlCenterDocument = JsonObject;

/** The key of the entry list. */
export const CONTROL_CENTER_KEY = "entities";

export const CONTROL_CENTER_SCHEMA_VERSION = 1;

export const CONTROL_CENTER_LIMIT_BYTES = WATCH_SYNC_LIMIT_BYTES;

export function asControlCenterDocument(value: unknown): ControlCenterDocument | undefined {
  return isJsonObject(value) ? value : undefined;
}

/** The document "Start with an empty list" saves. */
export function controlCenterEmpty(): ControlCenterDocument {
  return { schemaVersion: CONTROL_CENTER_SCHEMA_VERSION, [CONTROL_CENTER_KEY]: [] };
}

export function controlCenterBudget(document: ControlCenterDocument): { size: number; limit: number; share: number; near: boolean } {
  const size = sizeOf(document);
  const share = size / CONTROL_CENTER_LIMIT_BYTES;
  return { size, limit: CONTROL_CENTER_LIMIT_BYTES, share, near: share > 0.8 };
}

/** The raw entry list, or an empty one when there is none. */
function rawEntries(document: ControlCenterDocument): unknown[] {
  const list = Object.hasOwn(document, CONTROL_CENTER_KEY) ? document[CONTROL_CENTER_KEY] : undefined;
  return Array.isArray(list) ? list : [];
}

/** The entries, in the stored order: every element that is an object. */
export function controlCenterEntries(document: ControlCenterDocument | undefined): JsonObject[] {
  return document === undefined ? [] : rawEntries(document).filter(isJsonObject);
}

/** One entry as the watch reads it. */
export interface ControlCenterEntry {
  entityId: string;
  displayName: string;
  iconName: string;
  domain: string;
  customIconName?: string;
  customDisplayName?: string;
  tintColorHex?: string;
  isHidden: boolean;
}

function str(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function readControlCenterEntry(entry: JsonObject): ControlCenterEntry {
  const out: ControlCenterEntry = {
    entityId: str(entry.entityId) ?? "",
    displayName: str(entry.displayName) ?? "",
    iconName: str(entry.iconName) ?? "",
    domain: str(entry.domain) ?? "",
    isHidden: entry.isHidden === true,
  };
  const icon = str(entry.customIconName);
  const name = str(entry.customDisplayName);
  const tint = str(entry.tintColorHex);
  if (icon !== undefined) out.customIconName = icon;
  if (name !== undefined) out.customDisplayName = name;
  if (tint !== undefined) out.tintColorHex = tint;
  return out;
}

/** The name the watch shows: the custom one, else the stored one. */
export function controlCenterName(entry: ControlCenterEntry): string {
  return entry.customDisplayName ?? entry.displayName;
}

/** The icon the watch shows: the custom one, else the stored one. */
export function controlCenterIcon(entry: ControlCenterEntry): string {
  return entry.customIconName ?? entry.iconName;
}

/** Whether the watch's Control Center can show the entry at all. */
export function controlCenterShown(entry: ControlCenterEntry): boolean {
  return controlCenterKind(entry.domain) !== "none";
}

/** Whether any custom key is set, which Reset to defaults clears. */
export function controlCenterCustomized(entry: JsonObject): boolean {
  return CONTROL_CENTER_CUSTOM_KEYS.some((key) => Object.hasOwn(entry, key) && entry[key] !== null);
}

export function findControlCenterEntry(document: ControlCenterDocument | undefined, entityId: string): JsonObject | undefined {
  return controlCenterEntries(document).find((e) => e.entityId === entityId);
}

export function controlCenterHas(document: ControlCenterDocument | undefined, entityId: string): boolean {
  return findControlCenterEntry(document, entityId) !== undefined;
}

// ── writing keys ─────────────────────────────────────────────────────────

function put(object: JsonObject, key: string, value: unknown): void {
  if (key === "__proto__") Object.defineProperty(object, key, { value, enumerable: true, writable: true, configurable: true });
  else object[key] = value;
}

/** `object` with `key` set. A key it holds keeps its place; a new key goes at
 * its sorted place. The object itself when the value is the same JSON. */
export function withControlCenterKey(object: JsonObject, key: string, value: unknown): JsonObject {
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
export function withoutControlCenterKey(object: JsonObject, key: string): JsonObject {
  if (!Object.hasOwn(object, key)) return object;
  const out: JsonObject = {};
  for (const k of Object.keys(object)) if (k !== key) put(out, k, object[k]);
  return out;
}

function withEntries(document: ControlCenterDocument, entries: unknown[]): ControlCenterDocument {
  return withControlCenterKey(document, CONTROL_CENTER_KEY, entries);
}

/** The document with one entry replaced through `change`. Refuses for an
 * entry it does not hold, or a change that changes nothing. */
function withEntry(document: ControlCenterDocument, entityId: string, change: (entry: JsonObject) => JsonObject): ControlCenterDocument {
  const list = rawEntries(document);
  const index = list.findIndex((e) => isJsonObject(e) && e.entityId === entityId);
  if (index < 0) return document;
  const entry = list[index] as JsonObject;
  const next = change(entry);
  if (next === entry) return document;
  const copy = list.slice();
  copy[index] = next;
  return withEntries(document, copy);
}

// ── adding ───────────────────────────────────────────────────────────────

/** What the panel knows of an entity: its state's attributes. */
export type ControlCenterStates = Record<string, { state?: string; attributes?: Record<string, unknown> } | undefined>;

export function entityDomain(entityId: string): string {
  const dot = entityId.indexOf(".");
  return dot < 0 ? "" : entityId.slice(0, dot);
}

/** An entity's name as Home Assistant has it, else its id. */
export function controlCenterFriendlyName(states: ControlCenterStates | undefined, entityId: string): string {
  const state = states === undefined || !Object.hasOwn(states, entityId) ? undefined : states[entityId];
  const name = state?.attributes?.friendly_name;
  return typeof name === "string" && name.trim() !== "" ? name : entityId;
}

/** The schema stamp the phone writes on every entry it stores and uploads
 * (`CuratedEntity.currentSchemaVersion`). */
export const CONTROL_CENTER_ENTRY_SCHEMA_VERSION = 1;

/** A new entry as the phone stores one after its add: the entity's name,
 * the domain's icon, the domain and the schema stamp, nothing else. Keys
 * sorted. The stamp matters: both merges compare entries whole, so an entry
 * without it differs from the phone's stamped copy of the same entry and
 * reads as changed, which brings back an entry the other side deleted. */
export function newControlCenterEntry(entityId: string, states?: ControlCenterStates): JsonObject {
  const domain = entityDomain(entityId);
  return {
    displayName: controlCenterFriendlyName(states, entityId),
    domain,
    entityId,
    iconName: controlCenterDefaultIcon(domain),
    schemaVersion: CONTROL_CENTER_ENTRY_SCHEMA_VERSION,
  };
}

export interface ControlCenterAdd {
  document: ControlCenterDocument;
  /** The entity ids added, in order. */
  added: string[];
  /** The entity ids refused: on the list already, named twice, or empty. */
  refused: string[];
}

/** New entries at the end of the list, one per entity. An entity the list
 * holds already, or one named twice, is refused: the list holds each entity
 * once. */
export function addControlCenterEntries(document: ControlCenterDocument, entityIds: readonly string[], states?: ControlCenterStates): ControlCenterAdd {
  const held = new Set(controlCenterEntries(document).map((e) => str(e.entityId) ?? ""));
  const added: string[] = [];
  const refused: string[] = [];
  const fresh: JsonObject[] = [];
  for (const raw of entityIds) {
    const entityId = raw.trim();
    if (entityId === "" || held.has(entityId)) {
      refused.push(raw);
      continue;
    }
    held.add(entityId);
    added.push(entityId);
    fresh.push(newControlCenterEntry(entityId, states));
  }
  if (fresh.length === 0) return { document, added, refused };
  return { document: withEntries(document, [...rawEntries(document), ...fresh]), added, refused };
}

// ── removing and moving ──────────────────────────────────────────────────

export function removeControlCenterEntry(document: ControlCenterDocument, entityId: string): ControlCenterDocument {
  const list = rawEntries(document);
  const next = list.filter((e) => !(isJsonObject(e) && e.entityId === entityId));
  return next.length === list.length ? document : withEntries(document, next);
}

/** The entry moved to `index` in the list (clamped). */
export function moveControlCenterEntry(document: ControlCenterDocument, entityId: string, index: number): ControlCenterDocument {
  const list = rawEntries(document);
  const from = list.findIndex((e) => isJsonObject(e) && e.entityId === entityId);
  if (from < 0) return document;
  const to = Math.max(0, Math.min(index, list.length - 1));
  if (from === to) return document;
  const copy = list.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return withEntries(document, copy);
}

// ── an entry's own keys ──────────────────────────────────────────────────

/** An optional string key set, or left out when the value is empty, as the
 * phone's name field stores an empty name as nil. */
function setOptionalString(document: ControlCenterDocument, entityId: string, key: string, value: string | undefined): ControlCenterDocument {
  return withEntry(document, entityId, (entry) => (value === undefined || value === "" ? withoutControlCenterKey(entry, key) : withControlCenterKey(entry, key, value)));
}

/** The name the watch shows. Empty goes back to the stored name. */
export function setControlCenterName(document: ControlCenterDocument, entityId: string, name: string): ControlCenterDocument {
  return setOptionalString(document, entityId, "customDisplayName", name);
}

/** The icon the watch shows. Empty goes back to the stored icon. */
export function setControlCenterIcon(document: ControlCenterDocument, entityId: string, icon: string): ControlCenterDocument {
  return setOptionalString(document, entityId, "customIconName", icon.trim());
}

/** The tint, as `#RRGGBB`; undefined goes back to the watch's blue. */
export function setControlCenterTint(document: ControlCenterDocument, entityId: string, hex: string | undefined): ControlCenterDocument {
  if (hex !== undefined && !/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(hex)) return document;
  return setOptionalString(document, entityId, "tintColorHex", hex === undefined ? undefined : hex.toUpperCase());
}

/** Hidden writes `true`; shown leaves the key out, as the phone writes nil. */
export function setControlCenterHidden(document: ControlCenterDocument, entityId: string, hidden: boolean): ControlCenterDocument {
  return withEntry(document, entityId, (entry) => (hidden ? withControlCenterKey(entry, "isHidden", true) : withoutControlCenterKey(entry, "isHidden")));
}

/** Reset to defaults: the custom name, icon and tint left out. */
export function resetControlCenterEntry(document: ControlCenterDocument, entityId: string): ControlCenterDocument {
  return withEntry(document, entityId, (entry) => {
    let next = entry;
    for (const key of CONTROL_CENTER_CUSTOM_KEYS) next = withoutControlCenterKey(next, key);
    return next;
  });
}

// ── checks ───────────────────────────────────────────────────────────────

/**
 * What Home Assistant's shape check (`_check_control_center`) refuses, in
 * plain words, so a save that cannot land is not sent: `entities` a list of
 * objects, each with a non-empty string `entityId` no other entry shares and
 * string `displayName`, `iconName` and `domain`.
 */
export function checkControlCenter(document: unknown): string[] {
  if (!isJsonObject(document)) return ["The Control Center list is not an object."];
  const list = Object.hasOwn(document, CONTROL_CENTER_KEY) ? document[CONTROL_CENTER_KEY] : undefined;
  if (!Array.isArray(list)) return ["The Control Center list is missing."];
  const problems: string[] = [];
  const seen = new Set<string>();
  list.forEach((entry, index) => {
    if (!isJsonObject(entry)) {
      problems.push(`Entry ${index + 1} is not an object.`);
      return;
    }
    const id = entry.entityId;
    const label = typeof id === "string" && id !== "" ? id : `Entry ${index + 1}`;
    if (typeof id !== "string" || id === "") problems.push(`${label} has no entity.`);
    else {
      if (seen.has(id)) problems.push(`${label} is on the list twice.`);
      seen.add(id);
    }
    for (const key of ["displayName", "iconName", "domain"]) {
      if (typeof entry[key] !== "string") problems.push(`${label} has no ${key}.`);
    }
  });
  return problems;
}

/** A restore's one line: how many entries, and how many hidden. */
export function controlCenterSummary(document: unknown): string {
  const entries = controlCenterEntries(asControlCenterDocument(document)).map(readControlCenterEntry);
  const hidden = entries.filter((e) => e.isHidden).length;
  const n = entries.length;
  return `${n} ${n === 1 ? "entity" : "entities"}${hidden > 0 ? `, ${hidden} hidden` : ""}.`;
}

// ── no record ────────────────────────────────────────────────────────────

export const CONTROL_CENTER_NO_RECORD_TITLE = "No Control Center list from this watch yet.";

export const CONTROL_CENTER_NO_RECORD_TEXT =
  "Start with an empty list here, or open the iPhone app and turn on Edit pages in Home Assistant under Settings, Pages in Home Assistant.";

export const CONTROL_CENTER_START_EMPTY_BUTTON = "Start with an empty list";

export const CONTROL_CENTER_PAIR_FIRST_TEXT = "Pair this watch first.";

export const CONTROL_CENTER_UPDATE_TEXT = "Update the integration to edit the Control Center list here.";

/** Whether a failed read means this integration does not keep the Control
 * Center list: one older than the kind refuses it as `invalid`, one older
 * than the store does not know the command. */
export function controlCenterReadMeansUnsupported(error: unknown): boolean {
  const code = watchCommandError(error).code;
  return code === "invalid" || code === "unknown_command";
}
