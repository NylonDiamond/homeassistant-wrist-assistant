// The watch's menus as Home Assistant keeps them (the `menus` watch config
// kind), without any drawing: the Anywhere menu (`quickAction`), the Entity
// quick menu (`entityRadial`) and the page switcher's style (`pageSwitcher`).
//
// The document is kept raw, as the page editor keeps pages. Every setter here
// takes the document and returns a new one in which only the objects on the
// path of the change are new; every key it does not model goes back as it
// came, the `keep` keys of `menu-keys.json` (a slot's voice routing, its
// phrase lists, its linked slot and its automation override) included. A key
// the document did not have goes in at its sorted place, as the phone's
// sorted-key encoder writes it. A setter refuses by returning the document it
// was given, and so does an edit that changes nothing.
//
// The three tables are the panel's own and are edited by hand:
// `menu-actions.json` (every action, its payload and where each menu offers
// it), `menu-keys.json` (every key the panel may write, with its enum values)
// and `menu-defaults.json` (the document "Start with the defaults" saves). The
// app repo's `WatchMenusTablesTests` and `WatchMenusKeysTests` check the parts
// the watch decides (enum values, keys, payloads, default ids) against the
// watch's code. The panel never writes a key or an enum value they do not
// name.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 1 build
// contract").

import menuActions from "./menu-actions.json";
import menuDefaults from "./menu-defaults.json";
import menuKeys from "./menu-keys.json";
import { randomWatchId } from "../watch-pages/edit.js";
import { sameWatchPagesJson } from "../watch-pages/merge.js";
import { type JsonObject, WATCH_CONFIG_LIMIT_BYTES, isJsonObject, sizeOf } from "../watch-pages/model.js";
import { watchCommandError } from "../watch-pages/save-note.js";

// ── the tables ───────────────────────────────────────────────────────────

/** One key of an action's payload, as `menu-actions.json` lists it. */
export interface MenuPayloadSpec {
  key: string;
  type: "entity" | "uuid" | "enum" | "bool" | "number";
  enum?: string;
  /** What a `uuid` points at. */
  target?: "httpAction" | "page" | "statusPage" | "ttsPhrase";
  required?: boolean;
  default?: unknown;
  /** The phone leaves the key out at its default. */
  omitted?: boolean;
  /** The phone writes the key even when it holds the domain's default. */
  alwaysWritten?: boolean;
  /** What an absent key means to the watch. */
  absentMeans?: unknown;
  min?: number;
  max?: number;
  /** What a freshly picked action starts with. */
  new?: unknown;
}

export interface MenuActionSpec {
  raw: string;
  label: string;
  category: string;
  icon: string;
  color: string;
  requiresPremium: boolean;
  description?: string;
  payload?: MenuPayloadSpec[];
}

export interface MenuActionGroup {
  category: string;
  actions: string[];
}

export interface MenuCategory {
  id: string;
  label: string;
  shortLabel: string;
}

interface MenuActionsTable {
  categories: MenuCategory[];
  actions: MenuActionSpec[];
  unknownActionLabel: string;
  unknownActionIcon: string;
  unknownActionColor: string;
  anywhereActions: MenuActionGroup[];
  entityActions: Record<string, MenuActionGroup[]>;
  multiInstanceOnly: string[];
  triggerEntity: {
    targetDomains: string[];
    modes: Record<string, string[]>;
    modeLabels: Record<string, string>;
    targetIcons: Record<string, string>;
    targetColors: Record<string, string>;
  };
  /** `mirrored` swaps left and right (the other wrist); `opposite` is where
   * the phone moves a linked slot's partner. */
  positions: { value: string; label: string; mirrored: string; opposite: string }[];
  /** The entity types the watch reports under the finger, the only ones an
   * Anywhere slot's "show for" filter can match. */
  showForEntityTypes: string[];
}

/** One entity domain of the Entity quick menu. Several domains can share a
 * slot list (`valve` uses the cover's). `inheritKey` is null for `all`. */
export interface MenuDomain {
  domain: string;
  label: string;
  icon: string;
  slotKey: string;
  inheritKey: string | null;
}

/** A style row of `menu-keys.json` (`style.quickAction`, `style.pageSwitcher`). */
export interface MenuStyleField {
  key: string;
  label: string;
  type: "bool" | "enum" | "number" | "color";
  enum?: string;
  default: unknown;
  min?: number;
  max?: number;
  step?: number;
  presets?: { label: string; value: number }[];
  swatches?: string[];
  shownWhen?: { key: string; not?: unknown };
  phone?: boolean;
}

interface MenuKeySpec {
  type: string;
  enum?: string;
  ref?: string;
  items?: unknown;
  required?: boolean;
  default?: unknown;
  keep?: boolean;
}

interface MenuKeysTable {
  enums: Record<string, string[]>;
  labels: Record<string, Record<string, string>>;
  types: Record<string, { swift: string; keys: Record<string, MenuKeySpec> }>;
  domains: MenuDomain[];
  // "macro" is kept for old documents: a stored macro tile's own menu still
  // reads the HTTP actions list.
  domainAliases: Record<string, string>;
  style: { quickAction: MenuStyleField[]; pageSwitcher: MenuStyleField[] };
}

export const MENU_ACTIONS = menuActions as unknown as MenuActionsTable;
export const MENU_KEYS = menuKeys as unknown as MenuKeysTable;

const ACTIONS_BY_RAW: ReadonlyMap<string, MenuActionSpec> = new Map(MENU_ACTIONS.actions.map((a) => [a.raw, a]));

/** The document "Start with the defaults" saves: the app's default menus,
 * with fixed slot ids. A fresh copy each call. */
export function watchMenusDefaults(): MenusDocument {
  return structuredClone((menuDefaults as unknown as { document: MenusDocument }).document);
}

// ── the document ─────────────────────────────────────────────────────────

/** The menus document, raw. */
export type MenusDocument = JsonObject;

/** The three sections, the keys the merge works at. */
export const WATCH_MENUS_SECTIONS = ["quickAction", "entityRadial", "pageSwitcher"] as const;
export type WatchMenusSection = (typeof WATCH_MENUS_SECTIONS)[number];

/** The most Home Assistant keeps of this document (see WATCH_CONFIG_LIMIT_BYTES). */
export const WATCH_MENUS_LIMIT_BYTES = WATCH_CONFIG_LIMIT_BYTES;

export function asWatchMenusDocument(value: unknown): MenusDocument | undefined {
  return isJsonObject(value) ? value : undefined;
}

/** The document as compact JSON in UTF-8 bytes, as the sync measures it. */
export function watchMenusSize(document: MenusDocument): number {
  return sizeOf(document);
}

/** The budget line: the size, its share of the limit, and whether it is
 * close to it (over 80 percent). */
export function watchMenusBudget(document: MenusDocument): { size: number; limit: number; share: number; near: boolean } {
  const size = watchMenusSize(document);
  const share = size / WATCH_MENUS_LIMIT_BYTES;
  return { size, limit: WATCH_MENUS_LIMIT_BYTES, share, near: share > 0.8 };
}

/** One section as stored, or an empty object when there is none. Never
 * written back as it is: a setter that changes nothing returns the document. */
export function watchMenusSection(document: MenusDocument, section: WatchMenusSection): JsonObject {
  const value = Object.hasOwn(document, section) ? document[section] : undefined;
  return isJsonObject(value) ? value : {};
}

/** `object` with `key` set. A key it holds keeps its place; a new key goes at
 * its sorted place, as the phone's sorted-key encoder writes it. The object
 * itself when the value is the same JSON. */
export function withMenuKey(object: JsonObject, key: string, value: unknown): JsonObject {
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
export function withoutMenuKey(object: JsonObject, key: string): JsonObject {
  if (!Object.hasOwn(object, key)) return object;
  const out: JsonObject = {};
  for (const k of Object.keys(object)) if (k !== key) put(out, k, object[k]);
  return out;
}

function put(object: JsonObject, key: string, value: unknown): void {
  if (key === "__proto__") Object.defineProperty(object, key, { value, enumerable: true, writable: true, configurable: true });
  else object[key] = value;
}

function withSection(document: MenusDocument, section: WatchMenusSection, value: JsonObject): MenusDocument {
  const old = Object.hasOwn(document, section) ? document[section] : undefined;
  if (old === value) return document;
  return withMenuKey(document, section, value);
}

// ── ids ──────────────────────────────────────────────────────────────────

/** Makes a new slot id. Upper case, as the phone's encoder writes a UUID. */
export type MenuIdMaker = () => string;

function newSlotId(make: MenuIdMaker | undefined): string {
  return (make ?? randomWatchId)().toUpperCase();
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isMenuUUID(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

function sameId(a: unknown, b: unknown): boolean {
  return typeof a === "string" && typeof b === "string" && a !== "" && a.toUpperCase() === b.toUpperCase();
}

// ── actions ──────────────────────────────────────────────────────────────

export function watchMenuAction(raw: string): MenuActionSpec | undefined {
  return ACTIONS_BY_RAW.get(raw);
}

/** The action's name, or the phone's "Sync Needed" for a type this table
 * does not know (a newer app wrote it). */
export function watchMenuActionLabel(raw: string): string {
  return ACTIONS_BY_RAW.get(raw)?.label ?? MENU_ACTIONS.unknownActionLabel;
}

export function watchMenuCategoryLabel(id: string): string {
  return MENU_ACTIONS.categories.find((c) => c.id === id)?.label ?? id;
}

/** The action type a slot holds, `""` when it has none. */
export function slotActionType(slot: JsonObject): string {
  const action = slot.action;
  return isJsonObject(action) && typeof action.type === "string" ? action.type : "";
}

export function slotAction(slot: JsonObject): JsonObject {
  return isJsonObject(slot.action) ? slot.action : {};
}

/** An HTTP action a slot can run: the home's library first, then the
 * iPhone's own (`watch-pages/http-library.ts`). `source` and `needsSetup`
 * only add words to its name in the picker. */
export interface MenuHTTPTarget {
  id: string;
  name: string;
  source?: "home" | "iphone";
  needsSetup?: boolean;
}

/** The pickable targets the panel knows, for an action that needs one. */
export interface MenuTargets {
  pages: readonly { id: string; name: string }[];
  statusPages: readonly { id: string; name: string }[];
  httpActions: readonly MenuHTTPTarget[];
  /** The phrases of the watch's voice settings, for Speak Phrase; absent or
   * empty while Home Assistant holds none. */
  phrases?: readonly { id: string; name: string }[];
}

export const NO_MENU_TARGETS: MenuTargets = { pages: [], statusPages: [], httpActions: [] };

function targetList(targets: MenuTargets, target: MenuPayloadSpec["target"]): readonly { id: string; name: string }[] {
  switch (target) {
    case "page":
      return targets.pages;
    case "statusPage":
      return targets.statusPages;
    case "httpAction":
      return targets.httpActions;
    case "ttsPhrase":
      return targets.phrases ?? [];
    default:
      return [];
  }
}

/** Why an action cannot be picked now, or undefined when it can: an action
 * that needs a target the panel has none of (a phrase before the voice
 * settings hold one; an HTTP action while neither Home Assistant's library
 * nor the iPhone lists one). */
export function watchMenuActionUnavailable(raw: string, targets: MenuTargets): string | undefined {
  const spec = ACTIONS_BY_RAW.get(raw);
  if (spec === undefined) return "Unknown action";
  for (const p of spec.payload ?? []) {
    if (p.type !== "uuid" || p.required !== true || p.new !== undefined) continue;
    if (targetList(targets, p.target).length > 0 || p.target === undefined) continue;
    if (p.target === "ttsPhrase") return "No phrases";
    if (p.target === "httpAction") return "No HTTP actions";
    if (p.target === "page") return "No pages";
    return "No status pages";
  }
  return undefined;
}

/** The enum values a payload key may take. */
function enumValues(name: string | undefined): readonly string[] {
  return name === undefined ? [] : (MENU_KEYS.enums[name] ?? []);
}

/**
 * `action` with one payload key written as the phone's encoder writes it,
 * or undefined when the value is refused. `undefined` removes the key (never
 * a required one). A flag the phone leaves out at its default is left out at
 * it; a number is held to its range; an id is upper case; an enum value must
 * be one the tables name.
 */
export function writeMenuActionKey(action: JsonObject, spec: MenuPayloadSpec, value: unknown): JsonObject | undefined {
  if (value === undefined || value === null) {
    if (spec.required === true) return undefined;
    return withoutMenuKey(action, spec.key);
  }
  let v: unknown = value;
  switch (spec.type) {
    case "bool":
      if (typeof value !== "boolean") return undefined;
      break;
    case "enum":
      if (typeof value !== "string" || !enumValues(spec.enum).includes(value)) return undefined;
      break;
    case "number": {
      if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
      v = Math.min(spec.max ?? Infinity, Math.max(spec.min ?? -Infinity, value));
      break;
    }
    case "uuid":
      if (!isMenuUUID(value)) return undefined;
      v = value.toUpperCase();
      break;
    case "entity":
      if (typeof value !== "string") return undefined;
      v = value.trim();
      break;
  }
  if (spec.omitted === true && spec.alwaysWritten !== true && Object.hasOwn(spec, "default") && v === spec.default) {
    return withoutMenuKey(action, spec.key);
  }
  return withMenuKey(action, spec.key, v);
}

/**
 * A freshly picked action, as the phone's picker makes it: the type, then
 * each payload key's starting value (`new`), and for a target it must have
 * and has no starting value, the first one the panel knows. Undefined when
 * there is no such target (`watchMenuActionUnavailable`).
 */
export function newWatchMenuAction(raw: string, targets: MenuTargets = NO_MENU_TARGETS): JsonObject | undefined {
  const spec = ACTIONS_BY_RAW.get(raw);
  if (spec === undefined) return undefined;
  let action: JsonObject | undefined = { type: raw };
  for (const p of spec.payload ?? []) {
    if (action === undefined) return undefined;
    if (p.new !== undefined) {
      action = writeMenuActionKey(action, p, p.new);
    } else if (p.required === true) {
      if (p.type !== "uuid") return undefined;
      const first = targetList(targets, p.target)[0];
      if (first === undefined) return undefined;
      action = writeMenuActionKey(action, p, first.id);
    }
  }
  return action;
}

// ── trigger entity ───────────────────────────────────────────────────────

export function entityDomain(entityId: string): string {
  const dot = entityId.indexOf(".");
  return dot > 0 ? entityId.slice(0, dot) : "";
}

/** The trigger modes an entity of `domain` offers, its default first. */
export function watchTriggerModes(domain: string): readonly string[] {
  const modes = MENU_ACTIONS.triggerEntity.modes;
  return (Object.hasOwn(modes, domain) ? modes[domain] : undefined) ?? modes["*"] ?? ["toggle"];
}

export function watchTriggerModeLabel(mode: string): string {
  return MENU_ACTIONS.triggerEntity.modeLabels[mode] ?? MENU_KEYS.labels.TriggerMode?.[mode] ?? mode;
}

/** The icon and color a trigger slot takes for a target of `domain`; `""`
 * is a slot with no target yet. */
export function watchTriggerLook(domain: string): { icon: string; color: string } {
  const t = MENU_ACTIONS.triggerEntity;
  const icon = (domain !== "" && Object.hasOwn(t.targetIcons, domain) ? t.targetIcons[domain] : undefined) ?? t.targetIcons["*"] ?? "target";
  const color = (domain !== "" && Object.hasOwn(t.targetColors, domain) ? t.targetColors[domain] : undefined) ?? t.targetColors["*"] ?? "#7CC4E8";
  return { icon, color };
}

/** The domains a trigger slot can point at. */
export function watchTriggerTargetDomains(): readonly string[] {
  return MENU_ACTIONS.triggerEntity.targetDomains;
}

function sameColor(a: unknown, b: unknown): boolean {
  return typeof a === "string" && typeof b === "string" && a.toUpperCase() === b.toUpperCase();
}

/**
 * A trigger slot pointed at another entity, by the phone's rule: the icon
 * and the color follow the new target's domain only while they still are the
 * old target's (a slot with no target counts as `target` in the info color),
 * and a mode the new domain does not list becomes its first.
 */
export function retargetTriggerSlot(slot: JsonObject, entityId: string): JsonObject {
  const action = slotAction(slot);
  if (slotActionType(slot) !== "triggerEntity") return slot;
  const spec = ACTIONS_BY_RAW.get("triggerEntity");
  const entitySpec = spec?.payload?.find((p) => p.key === "entityId");
  const modeSpec = spec?.payload?.find((p) => p.key === "triggerMode");
  if (entitySpec === undefined || modeSpec === undefined) return slot;
  const oldDomain = entityDomain(typeof action.entityId === "string" ? action.entityId : "");
  const newDomain = entityDomain(entityId.trim());
  let next = writeMenuActionKey(action, entitySpec, entityId);
  if (next === undefined) return slot;
  const modes = watchTriggerModes(newDomain);
  const mode = typeof next.triggerMode === "string" ? next.triggerMode : undefined;
  if (mode === undefined || !modes.includes(mode)) {
    next = writeMenuActionKey(next, modeSpec, modes[0]) ?? next;
  }
  let out = withMenuKey(slot, "action", next);
  const before = watchTriggerLook(oldDomain);
  const after = watchTriggerLook(newDomain);
  if (slot.icon === before.icon) out = withMenuKey(out, "icon", after.icon);
  if (sameColor(slot.color, before.color)) out = withMenuKey(out, "color", after.color);
  return out;
}

// ── domains ──────────────────────────────────────────────────────────────

export function watchMenuDomains(): readonly MenuDomain[] {
  return MENU_KEYS.domains;
}

export function watchMenuDomain(domain: string): MenuDomain | undefined {
  const real = Object.hasOwn(MENU_KEYS.domainAliases, domain) ? MENU_KEYS.domainAliases[domain]! : domain;
  return MENU_KEYS.domains.find((d) => d.domain === real);
}

/** The other domains whose menu is the same list as `domain`'s. */
export function watchMenuDomainsSharing(domain: string): MenuDomain[] {
  const own = watchMenuDomain(domain);
  if (own === undefined) return [];
  return MENU_KEYS.domains.filter((d) => d.slotKey === own.slotKey && d.domain !== own.domain);
}

// ── slot lists ───────────────────────────────────────────────────────────

/** Which slot list: the Anywhere menu's, one domain's of the Entity quick
 * menu, or one entity's own override. */
export type MenuListRef =
  | { list: "anywhere" }
  | { list: "domain"; domain: string }
  | { list: "entity"; entityId: string };

export const ANYWHERE: MenuListRef = { list: "anywhere" };

/** A key that names a list in view state. */
export function menuListKey(ref: MenuListRef): string {
  return ref.list === "anywhere" ? "anywhere" : ref.list === "domain" ? `domain:${ref.domain}` : `entity:${ref.entityId}`;
}

/** The domain whose actions a list offers. */
export function menuListDomain(ref: MenuListRef): string | undefined {
  if (ref.list === "anywhere") return undefined;
  if (ref.list === "domain") return ref.domain;
  return entityDomain(ref.entityId);
}

function rawList(document: MenusDocument, ref: MenuListRef): unknown {
  if (ref.list === "anywhere") return watchMenusSection(document, "quickAction").slots;
  const radial = watchMenusSection(document, "entityRadial");
  if (ref.list === "domain") {
    const key = watchMenuDomain(ref.domain)?.slotKey;
    return key === undefined ? undefined : radial[key];
  }
  const overrides = radial.entityOverrides;
  return isJsonObject(overrides) && Object.hasOwn(overrides, ref.entityId) ? overrides[ref.entityId] : undefined;
}

/** The slots of a list that are objects, in stored order. */
export function watchMenuSlots(document: MenusDocument, ref: MenuListRef): JsonObject[] {
  const list = rawList(document, ref);
  return Array.isArray(list) ? list.filter(isJsonObject) : [];
}

export function watchMenuSlotId(slot: JsonObject): string {
  return typeof slot.id === "string" ? slot.id : "";
}

export function findWatchMenuSlot(document: MenusDocument, ref: MenuListRef, id: string): JsonObject | undefined {
  return watchMenuSlots(document, ref).find((s) => sameId(s.id, id));
}

/** The document with a list replaced. Refused (the document) for a domain
 * the tables do not know. */
export function withWatchMenuSlots(document: MenusDocument, ref: MenuListRef, slots: unknown[]): MenusDocument {
  if (ref.list === "anywhere") {
    const qa = watchMenusSection(document, "quickAction");
    return withSection(document, "quickAction", withMenuKey(qa, "slots", slots));
  }
  const radial = watchMenusSection(document, "entityRadial");
  if (ref.list === "domain") {
    const key = watchMenuDomain(ref.domain)?.slotKey;
    if (key === undefined) return document;
    return withSection(document, "entityRadial", withMenuKey(radial, key, slots));
  }
  const overrides = isJsonObject(radial.entityOverrides) ? radial.entityOverrides : {};
  return withSection(document, "entityRadial", withMenuKey(radial, "entityOverrides", withMenuKey(overrides, ref.entityId, slots)));
}

/** The list with one slot changed. The document when the slot is missing or
 * the change keeps it as it was. */
export function editWatchMenuSlot(document: MenusDocument, ref: MenuListRef, id: string, change: (slot: JsonObject) => JsonObject): MenusDocument {
  return editSlot(document, ref, id, change);
}

function editSlot(document: MenusDocument, ref: MenuListRef, id: string, change: (slot: JsonObject) => JsonObject): MenusDocument {
  const list = rawList(document, ref);
  if (!Array.isArray(list)) return document;
  const index = list.findIndex((s) => isJsonObject(s) && sameId(s.id, id));
  if (index < 0) return document;
  const slot = list[index] as JsonObject;
  const next = change(slot);
  if (next === slot) return document;
  const slots = list.slice();
  slots[index] = next;
  return withWatchMenuSlots(document, ref, slots);
}

// ── positions ────────────────────────────────────────────────────────────

/** The eight places around the screen, in the phone's order. */
export function watchMenuPositions(): readonly string[] {
  return MENU_KEYS.enums.SlotPosition ?? [];
}

export function watchMenuPositionLabel(position: string): string {
  return MENU_ACTIONS.positions.find((p) => p.value === position)?.label ?? position;
}

const RING_ANGLES: Readonly<Record<string, number>> = {
  rightCenter: 0,
  bottomRight: 45,
  bottomCenter: 90,
  bottomLeft: 135,
  leftCenter: 180,
  topLeft: 225,
  topCenter: 270,
  topRight: 315,
};

/** Where a position sits on the ring preview, in a unit square: the center
 * is (0.5, 0.5) and the ring's radius is `radius`. Undefined for a position
 * the tables do not name. */
export function watchMenuRingPoint(position: string, radius = 0.36): { x: number; y: number } | undefined {
  const angle = RING_ANGLES[position];
  if (angle === undefined) return undefined;
  const r = (angle * Math.PI) / 180;
  const round = (n: number) => Math.round(n * 10000) / 10000;
  return { x: round(0.5 + radius * Math.cos(r)), y: round(0.5 + radius * Math.sin(r)) };
}

/** The positions a slot of the list holds. */
function takenPositions(document: MenusDocument, ref: MenuListRef): Set<string> {
  return new Set(watchMenuSlots(document, ref).map((s) => (typeof s.position === "string" ? s.position : "")));
}

/** Whether a domain's list also shows the All slots. */
export function watchMenuInherits(document: MenusDocument, domain: string): boolean {
  const key = watchMenuDomain(domain)?.inheritKey;
  return key !== null && key !== undefined && watchMenusSection(document, "entityRadial")[key] === true;
}

/** The All slots a domain's list takes in beside its own, as the phone's
 * `effectiveSlots(for:)` gives them: every All slot, hidden ones too, at a
 * place none of the list's own visible slots holds. Empty when it does not
 * inherit. */
export function watchMenuInheritedSlots(document: MenusDocument, ref: MenuListRef): JsonObject[] {
  if (ref.list !== "domain" || ref.domain === "all" || !watchMenuInherits(document, ref.domain)) return [];
  const own = new Set(watchMenuSlots(document, ref).filter((s) => s.isVisible !== false).map((s) => s.position));
  return watchMenuSlots(document, { list: "domain", domain: "all" }).filter((s) => !own.has(s.position));
}

/** The places a new slot can go, in the phone's order: none of the list's
 * own, and in a domain that shows the All slots, none a visible All slot
 * holds. */
export function watchMenuFreePositions(document: MenusDocument, ref: MenuListRef): string[] {
  const taken = takenPositions(document, ref);
  if (ref.list === "domain" && ref.domain !== "all" && watchMenuInherits(document, ref.domain)) {
    for (const s of watchMenuSlots(document, { list: "domain", domain: "all" })) {
      if (s.isVisible !== false && typeof s.position === "string") taken.add(s.position);
    }
  }
  return watchMenuPositions().filter((p) => !taken.has(p));
}

// ── what each list offers ────────────────────────────────────────────────

/** The actions a list offers, by category, as the phone's picker offers
 * them: the Anywhere menu's own set, or the domain's. */
export function watchMenuOfferedActions(ref: MenuListRef): readonly MenuActionGroup[] {
  if (ref.list === "anywhere") return MENU_ACTIONS.anywhereActions;
  const domain = menuListDomain(ref) ?? "all";
  const real = Object.hasOwn(MENU_KEYS.domainAliases, domain) ? MENU_KEYS.domainAliases[domain]! : domain;
  const table = MENU_ACTIONS.entityActions;
  return (Object.hasOwn(table, real) ? table[real] : undefined) ?? table.all ?? [];
}

/** Whether a list's picker offers an action. */
export function watchMenuOffers(ref: MenuListRef, raw: string): boolean {
  return watchMenuOfferedActions(ref).some((g) => g.actions.includes(raw));
}

/** Whether only a watch with more than one Home Assistant can use it. */
export function watchMenuActionNeedsInstances(raw: string): boolean {
  return MENU_ACTIONS.multiInstanceOnly.includes(raw);
}

// ── slot edits ───────────────────────────────────────────────────────────

export interface AddMenuSlotOptions {
  /** The place; the first free one when not given. */
  position?: string;
  /** The action; the first the list offers that can be picked now. */
  action?: string;
  targets?: MenuTargets;
  newId?: MenuIdMaker;
}

/**
 * A new slot at the end of the list, as the phone's add makes one: a new id,
 * the place, the action with its starting payload, the action's icon and
 * color, shown, and empty voice routing. Refused when the place is taken or
 * there is no free place, or the action cannot be picked now.
 */
export function addWatchMenuSlot(document: MenusDocument, ref: MenuListRef, options: AddMenuSlotOptions = {}): { document: MenusDocument; id?: string } {
  const free = watchMenuFreePositions(document, ref);
  const position = options.position ?? free[0];
  if (position === undefined || !free.includes(position)) return { document };
  const targets = options.targets ?? NO_MENU_TARGETS;
  const raw = options.action ?? watchMenuOfferedActions(ref).flatMap((g) => g.actions).find((a) => watchMenuActionUnavailable(a, targets) === undefined);
  if (raw === undefined || !watchMenuOffers(ref, raw)) return { document };
  const action = newWatchMenuAction(raw, targets);
  const spec = watchMenuAction(raw);
  if (action === undefined || spec === undefined) return { document };
  const id = newSlotId(options.newId);
  const slot: JsonObject = { action, color: spec.color, icon: spec.icon, id, isVisible: true, position, voiceConfig: {} };
  const list = rawList(document, ref);
  const slots = Array.isArray(list) ? [...list, slot] : [slot];
  return { document: withWatchMenuSlots(document, ref, slots), id };
}

export function removeWatchMenuSlot(document: MenusDocument, ref: MenuListRef, id: string): MenusDocument {
  const list = rawList(document, ref);
  if (!Array.isArray(list)) return document;
  const slots = list.filter((s) => !(isJsonObject(s) && sameId(s.id, id)));
  return slots.length === list.length ? document : withWatchMenuSlots(document, ref, slots);
}

/** Where the phone puts a linked slot's partner when the slot moves to
 * `position` (left and right swap, top and bottom center swap). */
export function watchMenuOppositePosition(position: string): string | undefined {
  return MENU_ACTIONS.positions.find((p) => p.value === position)?.opposite;
}

/**
 * The slot moved to another place. A slot linked to it in the same list (the
 * climate heat and cool pair, `linkedSlotId`) moves with it to the opposite
 * place, as the phone moves the pair. A slot of the list already at a place
 * the move takes goes to a place the move left, so two never share one.
 */
export function moveWatchMenuSlot(document: MenusDocument, ref: MenuListRef, id: string, position: string): MenusDocument {
  if (!watchMenuPositions().includes(position)) return document;
  const list = rawList(document, ref);
  if (!Array.isArray(list)) return document;
  const index = list.findIndex((s) => isJsonObject(s) && sameId(s.id, id));
  if (index < 0) return document;
  const moved = list[index] as JsonObject;
  if (moved.position === position) return document;
  // Each slot that moves, by its index in the list, and its new place.
  const moves = new Map<number, string>([[index, position]]);
  const partner = list.findIndex((s, i) => i !== index && isJsonObject(s) && sameId(s.id, moved.linkedSlotId));
  const opposite = watchMenuOppositePosition(position);
  if (partner >= 0 && opposite !== undefined) moves.set(partner, opposite);
  // The places the moving slots leave and do not take again, and the places
  // they take that they did not hold: a slot at the first taken place goes
  // to the first left one, and so on.
  const sources = [...moves.keys()].map((i) => (list[i] as JsonObject).position).filter((p): p is string => typeof p === "string");
  const targets = [...moves.values()];
  const left = sources.filter((p) => !targets.includes(p));
  const taken = targets.filter((p) => !sources.includes(p));
  const slots = list.map((s, i) => {
    const to = moves.get(i);
    if (to !== undefined) return withMenuKey(s as JsonObject, "position", to);
    if (!isJsonObject(s) || typeof s.position !== "string") return s;
    const at = taken.indexOf(s.position);
    const dest = at < 0 ? undefined : (left[at] ?? left[left.length - 1]);
    return dest === undefined ? s : withMenuKey(s, "position", dest);
  });
  return withWatchMenuSlots(document, ref, slots);
}

export function setWatchMenuSlotVisible(document: MenusDocument, ref: MenuListRef, id: string, visible: boolean): MenusDocument {
  if (typeof visible !== "boolean") return document;
  return editSlot(document, ref, id, (s) => withMenuKey(s, "isVisible", visible));
}

/** Whether a slot shows Skip Conditions: an Entity quick menu slot that
 * triggers an automation, as the phone showed it. The Anywhere menu never
 * offers that action. */
export function watchMenuSlotHasSkipConditions(ref: MenuListRef, slot: JsonObject): boolean {
  return ref.list !== "anywhere" && slotActionType(slot) === "automationTrigger";
}

/** The slot's Skip Conditions: `true` (Skip), `false` (Don't Skip), `null`
 * (Default, the key absent or not a boolean). */
export function watchMenuSlotSkipConditions(slot: JsonObject): boolean | null {
  return typeof slot.automationSkipConditionOverride === "boolean" ? slot.automationSkipConditionOverride : null;
}

/** Skip Conditions on an automation trigger slot: `true` or `false` writes
 * `automationSkipConditionOverride`, `null` (Default) removes it. Refused
 * for a slot that does not show the row. */
export function setWatchMenuSlotSkipConditions(document: MenusDocument, ref: MenuListRef, id: string, value: boolean | null): MenusDocument {
  if (value !== null && typeof value !== "boolean") return document;
  return editSlot(document, ref, id, (s) => {
    if (!watchMenuSlotHasSkipConditions(ref, s)) return s;
    return value === null ? withoutMenuKey(s, "automationSkipConditionOverride") : withMenuKey(s, "automationSkipConditionOverride", value);
  });
}

export function setWatchMenuSlotIcon(document: MenusDocument, ref: MenuListRef, id: string, icon: string): MenusDocument {
  const name = typeof icon === "string" ? icon.trim() : "";
  if (name === "") return document;
  return editSlot(document, ref, id, (s) => withMenuKey(s, "icon", name));
}

/** `#RRGGBB`, upper case, from what a color box gives; undefined otherwise.
 * The watch has no opacity, so `#RRGGBBAA` keeps its color only. */
export function normalizeMenuColor(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const m = /^#?([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/.exec(value.trim());
  return m ? `#${m[1]!.toUpperCase()}` : undefined;
}

export function setWatchMenuSlotColor(document: MenusDocument, ref: MenuListRef, id: string, color: string): MenusDocument {
  const hex = normalizeMenuColor(color);
  if (hex === undefined) return document;
  return editSlot(document, ref, id, (s) => withMenuKey(s, "color", hex));
}

/**
 * The slot's action changed to `raw`, as the phone's picker changes it: a new
 * action with its starting payload (nothing of the old action's payload
 * stays), and the action's own icon and color. Every other key of the slot
 * stays. The same action again changes nothing; one that cannot be picked
 * now is refused.
 */
export function setWatchMenuSlotAction(document: MenusDocument, ref: MenuListRef, id: string, raw: string, targets: MenuTargets = NO_MENU_TARGETS): MenusDocument {
  const spec = watchMenuAction(raw);
  if (spec === undefined || !watchMenuOffers(ref, raw)) return document;
  return editSlot(document, ref, id, (slot) => {
    if (slotActionType(slot) === raw) return slot;
    const action = newWatchMenuAction(raw, targets);
    if (action === undefined) return slot;
    let out = withMenuKey(slot, "action", action);
    out = withMenuKey(out, "icon", spec.icon);
    return withMenuKey(out, "color", spec.color);
  });
}

/** The payload key of the slot's action, as the tables list it. */
export function watchMenuPayloadSpec(raw: string, key: string): MenuPayloadSpec | undefined {
  return watchMenuAction(raw)?.payload?.find((p) => p.key === key);
}

/**
 * One payload key of the slot's action set (`writeMenuActionKey`). A trigger
 * slot's target goes through `retargetTriggerSlot`, and its mode must be one
 * the target's domain lists. Refused for a key the action does not have.
 */
export function setWatchMenuActionKey(document: MenusDocument, ref: MenuListRef, id: string, key: string, value: unknown): MenusDocument {
  return editSlot(document, ref, id, (slot) => {
    const raw = slotActionType(slot);
    const spec = watchMenuPayloadSpec(raw, key);
    if (spec === undefined) return slot;
    const action = slotAction(slot);
    if (raw === "triggerEntity" && key === "entityId") {
      return typeof value === "string" ? retargetTriggerSlot(slot, value) : slot;
    }
    if (raw === "triggerEntity" && key === "triggerMode") {
      const domain = entityDomain(typeof action.entityId === "string" ? action.entityId : "");
      if (typeof value !== "string" || !watchTriggerModes(domain).includes(value)) return slot;
    }
    const next = writeMenuActionKey(action, spec, value);
    return next === undefined ? slot : withMenuKey(slot, "action", next);
  });
}

/** A payload key as the watch reads it: the stored value, else what an
 * absent key means, else the key's default. */
export function watchMenuActionValue(slot: JsonObject, spec: MenuPayloadSpec): unknown {
  const action = slotAction(slot);
  if (Object.hasOwn(action, spec.key) && action[spec.key] !== null) return action[spec.key];
  if (spec.absentMeans !== undefined && spec.absentMeans !== "domainDefault") return spec.absentMeans;
  if (spec.absentMeans === "domainDefault" && spec.key === "triggerMode") {
    const entityId = typeof action.entityId === "string" ? action.entityId : "";
    return watchTriggerModes(entityDomain(entityId))[0];
  }
  return spec.default;
}

/** The entity types the watch reports under the finger, in its order: the
 * only types a "show for" filter can match. */
export function watchMenuShowForTypes(): readonly string[] {
  return MENU_ACTIONS.showForEntityTypes;
}

/** Whether the watch reports an entity type under the finger. */
export function watchMenuReportsType(type: string): boolean {
  return MENU_ACTIONS.showForEntityTypes.includes(type);
}

/**
 * The Anywhere slot's "show for" filter: undefined for every screen (the key
 * absent), or the entity types it shows for. An empty list is written as it
 * is: the watch then shows the slot only where no entity is under the finger
 * (`QuickActionSlot.shouldShow(for:)`). A type is written only when the watch
 * reports it (`showForEntityTypes`), or the slot held it already: a stored
 * type the watch never reports is kept, never added.
 */
export function setWatchMenuSlotEntityTypes(document: MenusDocument, id: string, types: readonly string[] | undefined): MenusDocument {
  return editSlot(document, ANYWHERE, id, (slot) => {
    if (types === undefined) return withoutMenuKey(slot, "entityTypes");
    const held = watchMenuSlotEntityTypes(slot) ?? [];
    if (!types.every((t) => typeof t === "string" && (watchMenuReportsType(t) || held.includes(t)))) return slot;
    return withMenuKey(slot, "entityTypes", [...new Set(types)]);
  });
}

export function watchMenuSlotEntityTypes(slot: JsonObject): string[] | undefined {
  return Array.isArray(slot.entityTypes) ? slot.entityTypes.filter((t): t is string => typeof t === "string") : undefined;
}

// ── the Entity quick menu ────────────────────────────────────────────────

export function setWatchMenuInherits(document: MenusDocument, domain: string, on: boolean): MenusDocument {
  const key = watchMenuDomain(domain)?.inheritKey;
  if (key === null || key === undefined || typeof on !== "boolean") return document;
  const radial = watchMenusSection(document, "entityRadial");
  return withSection(document, "entityRadial", withMenuKey(radial, key, on));
}

/** The entities that have a menu of their own, sorted as the phone lists
 * them. */
export function watchMenuOverrideIds(document: MenusDocument): string[] {
  const overrides = watchMenusSection(document, "entityRadial").entityOverrides;
  return isJsonObject(overrides) ? Object.keys(overrides).sort() : [];
}

/** What a domain shows: its own slots, with the All slots at the places they
 * leave free when it inherits. The phone seeds an entity's own menu with it. */
export function watchMenuEffectiveSlots(document: MenusDocument, domain: string): JsonObject[] {
  const own = watchMenuDomain(domain);
  if (own === undefined) return [];
  const ref: MenuListRef = { list: "domain", domain: own.domain };
  const slots = watchMenuSlots(document, ref);
  if (own.domain === "all") return slots;
  return [...watchMenuInheritedSlots(document, ref), ...slots];
}

/** An entity gets a menu of its own, seeded from its domain's, as the phone
 * does it (the slots copied as they are). Refused for an entity that has one
 * or an id that is no entity id. */
export function addWatchMenuOverride(document: MenusDocument, entityId: string): MenusDocument {
  const id = entityId.trim();
  if (entityDomain(id) === "" || watchMenuOverrideIds(document).includes(id)) return document;
  const seed = structuredClone(watchMenuEffectiveSlots(document, entityDomain(id)));
  return withWatchMenuSlots(document, { list: "entity", entityId: id }, seed);
}

/** An entity's own menu removed; it follows its domain's again. With none
 * left the map goes too, as the phone writes it. */
export function removeWatchMenuOverride(document: MenusDocument, entityId: string): MenusDocument {
  const radial = watchMenusSection(document, "entityRadial");
  const overrides = radial.entityOverrides;
  if (!isJsonObject(overrides) || !Object.hasOwn(overrides, entityId)) return document;
  const rest = withoutMenuKey(overrides, entityId);
  const next = Object.keys(rest).length === 0 ? withoutMenuKey(radial, "entityOverrides") : withMenuKey(radial, "entityOverrides", rest);
  return withSection(document, "entityRadial", next);
}

// ── style ────────────────────────────────────────────────────────────────

export type MenuStyleSection = "quickAction" | "pageSwitcher";

/**
 * The page switcher's keys the watch never reads, so the panel shows no
 * control for them and never writes them: they go back as they came. The
 * switcher reads only `glowIntensity` and `selectedScale`
 * (`PageSwitcherOverlay.swift`, lines 332 and 333); each page's display mode
 * is its own (`switcherDisplayMode`, text when it has none).
 */
export const WATCH_MENUS_UNREAD_SWITCHER_KEYS: readonly string[] = ["iconRadius", "displayOffset", "displayMode"];

/** The style rows the editor shows and writes, in the tables' order. */
export function watchMenuStyleFields(section: MenuStyleSection): readonly MenuStyleField[] {
  const rows = MENU_KEYS.style[section];
  return section === "pageSwitcher" ? rows.filter((f) => !WATCH_MENUS_UNREAD_SWITCHER_KEYS.includes(f.key)) : rows;
}

/** A style key as the watch reads it: stored, else its default. */
export function watchMenuStyleValue(document: MenusDocument, section: MenuStyleSection, field: MenuStyleField): unknown {
  const s = watchMenusSection(document, section);
  return Object.hasOwn(s, field.key) && s[field.key] !== null && s[field.key] !== undefined ? s[field.key] : field.default;
}

/** Whether a style row is drawn: its `shownWhen` holds. */
export function watchMenuStyleShown(document: MenusDocument, section: MenuStyleSection, field: MenuStyleField): boolean {
  const rule = field.shownWhen;
  if (rule === undefined) return true;
  const other = watchMenuStyleFields(section).find((f) => f.key === rule.key);
  const value = other === undefined ? watchMenusSection(document, section)[rule.key] : watchMenuStyleValue(document, section, other);
  return Object.hasOwn(rule, "not") ? value !== rule.not : true;
}

export function watchMenuEnumChoices(name: string | undefined): [string, string][] {
  const labels = name === undefined ? undefined : MENU_KEYS.labels[name];
  return enumValues(name).map((v) => [v, labels?.[v] ?? (v.charAt(0).toUpperCase() + v.slice(1))]);
}

/** One style key set, held to its row's type, enum and range (a number is
 * rounded off at four places so a slider never writes float dust). */
export function setWatchMenuStyle(document: MenusDocument, section: MenuStyleSection, key: string, value: unknown): MenusDocument {
  const field = watchMenuStyleFields(section).find((f) => f.key === key);
  if (field === undefined) return document;
  let v: unknown;
  switch (field.type) {
    case "bool":
      if (typeof value !== "boolean") return document;
      v = value;
      break;
    case "enum":
      if (typeof value !== "string" || !enumValues(field.enum).includes(value)) return document;
      v = value;
      break;
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value)) return document;
      v = Math.round(Math.min(field.max ?? Infinity, Math.max(field.min ?? -Infinity, value)) * 10000) / 10000;
      break;
    case "color":
      v = normalizeMenuColor(value);
      if (v === undefined) return document;
      break;
  }
  return withSection(document, section, withMenuKey(watchMenusSection(document, section), key, v));
}

// ── before a save ────────────────────────────────────────────────────────

/** Every slot list of the document: the Anywhere menu's, each `*Slots` list
 * of the Entity quick menu, and each entity's own. */
function everyList(document: MenusDocument): { ref: MenuListRef | { list: "raw"; key: string }; slots: unknown[] }[] {
  const out: { ref: MenuListRef | { list: "raw"; key: string }; slots: unknown[] }[] = [];
  const qa = watchMenusSection(document, "quickAction");
  if (Array.isArray(qa.slots)) out.push({ ref: ANYWHERE, slots: qa.slots });
  const radial = watchMenusSection(document, "entityRadial");
  for (const key of Object.keys(radial)) {
    if (key.endsWith("Slots") && Array.isArray(radial[key])) out.push({ ref: { list: "raw", key }, slots: radial[key] as unknown[] });
  }
  if (isJsonObject(radial.entityOverrides)) {
    for (const [entityId, slots] of Object.entries(radial.entityOverrides)) {
      if (Array.isArray(slots)) out.push({ ref: { list: "entity", entityId }, slots });
    }
  }
  return out;
}

function isOrphanTrigger(slot: unknown): boolean {
  if (!isJsonObject(slot) || slotActionType(slot) !== "triggerEntity") return false;
  const id = slotAction(slot).entityId;
  return typeof id !== "string" || id.trim() === "";
}

/**
 * The document as the phone's save leaves it: every trigger slot with no
 * entity picked is dropped (`scrubOrphanTriggerEntitySlots`), from every
 * list. The document itself when there is none.
 */
export function scrubWatchMenuOrphanTriggers(document: MenusDocument): MenusDocument {
  let out = document;
  for (const { ref, slots } of everyList(document)) {
    if (!slots.some(isOrphanTrigger)) continue;
    const kept = slots.filter((s) => !isOrphanTrigger(s));
    if (ref.list === "raw") {
      out = withSection(out, "entityRadial", withMenuKey(watchMenusSection(out, "entityRadial"), ref.key, kept));
    } else {
      out = withWatchMenuSlots(out, ref, kept);
    }
  }
  return out;
}

const SECTION_NAMES: Readonly<Record<WatchMenusSection, string>> = {
  quickAction: "the Anywhere menu",
  entityRadial: "the Entity quick menu",
  pageSwitcher: "the page switcher",
};

/** A section's name in a sentence: "the Anywhere menu". */
export function watchMenusSectionName(section: WatchMenusSection): string {
  return SECTION_NAMES[section];
}

/**
 * What Home Assistant's shape check (`_check_menus` in
 * `watch_config_store.py`) refuses, in plain words, so a save that cannot
 * land is not sent: the document an object; each of the three sections
 * there and an object (missing or null is a fault); `quickAction.slots`,
 * when there, and every `entityRadial` key ending in `Slots` a list (null is
 * a fault) of objects with a non-empty string `id`, no two in one list the
 * same ignoring case; `entityRadial.entityOverrides`, when there, an object
 * whose every value is such a list.
 */
export function checkWatchMenus(document: unknown): string[] {
  if (!isJsonObject(document)) return ["The menus are not an object."];
  const problems: string[] = [];
  for (const section of WATCH_MENUS_SECTIONS) {
    const value = Object.hasOwn(document, section) ? document[section] : undefined;
    if (value === undefined || value === null) problems.push(`${capital(SECTION_NAMES[section])} is missing.`);
    else if (!isJsonObject(value)) problems.push(`${capital(SECTION_NAMES[section])} is not an object.`);
  }
  const checkList = (name: string, list: unknown): void => {
    if (!Array.isArray(list)) {
      problems.push(`${capital(name)} is not a list.`);
      return;
    }
    const seen = new Set<string>();
    for (const slot of list) {
      if (!isJsonObject(slot) || typeof slot.id !== "string" || slot.id === "") {
        problems.push(`A slot in ${name} has no id.`);
        return;
      }
      const folded = slot.id.toUpperCase();
      if (seen.has(folded)) {
        problems.push(`Two slots in ${name} share an id.`);
        return;
      }
      seen.add(folded);
    }
  };
  const qa = document.quickAction;
  if (isJsonObject(qa) && Object.hasOwn(qa, "slots")) checkList(SECTION_NAMES.quickAction, qa.slots);
  const radial = document.entityRadial;
  if (isJsonObject(radial)) {
    for (const key of Object.keys(radial)) {
      if (key.endsWith("Slots")) checkList(key, radial[key]);
    }
    if (Object.hasOwn(radial, "entityOverrides")) {
      const overrides = radial.entityOverrides;
      if (!isJsonObject(overrides)) problems.push("The entity overrides are not an object.");
      else for (const [entityId, list] of Object.entries(overrides)) checkList(`the menu of ${entityId}`, list);
    }
  }
  return problems;
}

function capital(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// ── no record ────────────────────────────────────────────────────────────

export const WATCH_MENUS_NO_RECORD_TITLE = "No menus from this watch yet.";

/** The no-record line when no iPhone will send menus. While one may, the
 * editor says `WAIT_FOR_IPHONE_TEXT` instead (`noRecordText`). */
export const WATCH_MENUS_NO_RECORD_TEXT = "Start with the defaults to begin.";

export const WATCH_MENUS_START_BUTTON = "Start with the defaults";

export const WATCH_MENUS_PAIR_FIRST_TEXT = "Pair this watch first.";

export const WATCH_MENUS_UPDATE_TEXT = "Update the integration to edit menus here.";

/** Whether a failed read of the menus means this integration does not keep
 * them: one older than the kind refuses it as `invalid`, one older than the
 * store does not know the command. */
export function watchMenusReadMeansUnsupported(error: unknown): boolean {
  const code = watchCommandError(error).code;
  return code === "invalid" || code === "unknown_command";
}
