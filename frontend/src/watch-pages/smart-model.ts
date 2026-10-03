// Smart pages (part 3f batch 3), without any drawing: a page with a
// `dynamicConfig` object, which the watch fills itself from domain rules.
//
// Four parts. The readers: typed views over the raw `dynamicConfig` and its
// rules that read a missing or mistyped key as the decoder's default. The
// writers of the Page card's smart rows and the Rules card (convert, disable,
// the page keys, add, every rule row, the header, resolve, move, delete,
// reset), and the stand-in tile through which the tile settings sections
// edit a rule's `tileStyle`. The fill: the watch's active test per domain,
// the groups, and the layout of `buildDynamicPage` in the watch's
// `TileGridPageView.swift`, which turns them into the synthetic page the
// preview draws, with the watch's title and tracking words. And the save
// step that resolves every `all` rule of the smart pages a draft changed.
//
// The writers follow `tile-settings-model.ts`: the raw document and a page
// id (and a rule id) in, only the objects on the path changed, a new key at
// its sorted place (the phone encodes sorted keys), a removed key deleted,
// and the document they were given back for a refusal or an edit that
// changes nothing. A page that is missing, a system page, or not a smart
// page refuses every rule and page key writer. After an edit the config
// holds all eight keys the decoder needs, and the edited rule is written as
// the phone's encoder writes it (`page-keys.json` `domainRule`: the always
// written keys with their defaults, `mediaPlayerPlayingOnly` only when true,
// `headerGlow` only above 0).
//
// The lists and words (the domains, the Add Domain presets, the header
// styles) come from `tile-smart.json`, written from the app's Swift code; the
// eight page keys and their defaults, and the style keys a rule may hold,
// from `page-keys.json`. Home Assistant's states come in as plain values.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md, "3f batch 3 build
// contract".

import type { HassEntityState } from "../ha-api.js";
import pageKeys from "./page-keys.json";
import tileSmart from "./tile-smart.json";
import { type WatchEditOptions, findWatchPage, randomWatchId, sameWatchId } from "./edit.js";
import { sameWatchPagesJson } from "./merge.js";
import {
  type JsonObject,
  type WatchPage,
  type WatchPageTile,
  type WatchPagesDocument,
  WATCH_GRID_COLUMNS,
  isJsonObject,
  watchPageId,
  watchPagesOf,
} from "./model.js";
import { normalizeWatchColor, sameValue, withField } from "./tile-settings-model.js";
import { watchCapitalized } from "./tile-new.js";

type States = Readonly<Record<string, HassEntityState>>;

// ── the tables ───────────────────────────────────────────────────────────

/** One domain the watch can fill a smart page from. */
export interface WatchSmartDomain {
  domain: string;
  /** "Lights", "Binary Sensors": the watch's headers, title and words. */
  displayName: string;
  icon: string;
  /** The theme role of the domain's color (`tile-defaults.json` roles). */
  colorRole: string;
  /** The state the domain reads as active ("on", "open", ...). */
  activeWord: string;
  /** The word of "Show when <inverted>". */
  invertedWord: string;
  /** The invert switch's label, undefined where the row has no switch. */
  showWhen?: string;
  /** Whether the rule row offers "Playing only". */
  playingOnly: boolean;
  /** Whether the rule row offers the max value box. */
  maxValue: boolean;
  /** The device class chips, empty when the domain has none. */
  deviceClasses: { value: string; label: string }[];
  /** Whether the rule row offers "Active when state is". */
  activeWhen: boolean;
  /** Whether the State section is offered for the domain's style. */
  stateTask: boolean;
}

/** One Add Domain choice: a whole domain, or a domain narrowed to device
 * classes ("Doors"). */
export interface WatchSmartPreset {
  label: string;
  icon: string;
  domain: string;
  /** Absent for a whole domain. */
  deviceClassFilter?: string[];
}

/** A size preset: "Small" 2 by 2. */
export interface WatchSmartSizePreset {
  name: string;
  colSpan: number;
  rowSpan: number;
}

/** `tile-smart.json` as the readers here use it. */
export interface WatchSmartTable {
  domains: WatchSmartDomain[];
  presets: WatchSmartPreset[];
  /** The page's tile size presets. */
  pageSizes: WatchSmartSizePreset[];
  /** The per-domain style's size presets. */
  styleSizes: WatchSmartSizePreset[];
  /** The header styles with their words, in the phone's order. */
  headerStyles: { value: string; label: string }[];
  /** Every quoted word, by name. */
  words: Readonly<Record<string, string>>;
  /** The raw table, for the parts no reader here needs. */
  raw: JsonObject;
}

function str(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

function objects(value: unknown): JsonObject[] {
  if (Array.isArray(value)) return value.filter(isJsonObject);
  return [];
}

/** A list of objects, or a map of objects keyed by `keyName` (the key put
 * into each). */
function listOrMap(value: unknown, keyName: string): JsonObject[] {
  if (Array.isArray(value)) return objects(value);
  if (!isJsonObject(value)) return [];
  return Object.entries(value)
    .filter((e): e is [string, JsonObject] => isJsonObject(e[1]))
    .map(([k, v]) => ({ [keyName]: k, ...v }));
}

function choices(value: unknown): { value: string; label: string }[] {
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
    return (value as string[]).map((v) => ({ value: v, label: watchCapitalized(v) }));
  }
  return listOrMap(value, "value").flatMap((c) => {
    const v = str(c.value);
    if (v === undefined) return [];
    return [{ value: v, label: str(c.label) ?? watchCapitalized(v) }];
  });
}

function sizes(value: unknown): WatchSmartSizePreset[] {
  return objects(value).flatMap((s) => {
    const name = str(s.name);
    const colSpan = s.cols;
    const rowSpan = s.rows;
    if (name === undefined || !Number.isInteger(colSpan) || !Number.isInteger(rowSpan)) return [];
    return [{ name, colSpan: colSpan as number, rowSpan: rowSpan as number }];
  });
}

/** A part of the table that is a list, or an object holding it as `list`. */
function listed(value: unknown): unknown {
  return isJsonObject(value) && Array.isArray(value.list) ? value.list : value;
}

/**
 * The table as typed views, with tolerance: a missing part reads as empty,
 * an entry without its key (a domain without `domain`, a preset without a
 * domain) is left out.
 */
export function readWatchSmartTable(raw: unknown): WatchSmartTable {
  const t = isJsonObject(raw) ? raw : {};
  const domains = listOrMap(listed(t.domains), "domain").flatMap((d): WatchSmartDomain[] => {
    const domain = str(d.domain);
    if (domain === undefined) return [];
    const showWhen = str(d.showWhen);
    return [
      {
        domain,
        displayName: str(d.displayName) ?? watchCapitalized(domain),
        icon: str(d.icon) ?? "",
        colorRole: str(d.colorRole) ?? "",
        activeWord: str(d.activeWord) ?? "",
        invertedWord: str(d.invertedWord) ?? "",
        ...(showWhen !== undefined ? { showWhen } : {}),
        playingOnly: d.playingOnly === true,
        maxValue: d.maxValue === true,
        deviceClasses: choices(d.deviceClasses),
        activeWhen: d.activeWhen === true,
        stateTask: d.stateTask === true,
      },
    ];
  });
  const presets = objects(listed(t.presets)).flatMap((p): WatchSmartPreset[] => {
    const domain = str(p.domain);
    const label = str(p.label);
    if (domain === undefined || label === undefined) return [];
    const filter = p.deviceClassFilter;
    return [{ label, icon: str(p.icon) ?? "", domain, ...(Array.isArray(filter) ? { deviceClassFilter: strings(filter) } : {}) }];
  });
  const page = isJsonObject(t.page) ? t.page : {};
  const style = isJsonObject(t.domainStyle) ? t.domainStyle : {};
  const header = isJsonObject(t.header) ? t.header : {};
  const words: Record<string, string> = {};
  if (isJsonObject(t.words)) for (const [k, v] of Object.entries(t.words)) if (typeof v === "string") words[k] = v;
  return {
    domains,
    presets,
    pageSizes: sizes(page.tileSizePresets),
    styleSizes: sizes(style.sizePresets),
    headerStyles: choices(header.styles),
    words,
    raw: t,
  };
}

/** The table, from `tile-smart.json`. */
export const WATCH_SMART: Readonly<WatchSmartTable> = readWatchSmartTable(tileSmart);

/** A word of the table with its `{name}` placeholders filled. */
export function smartWord(name: string, values: Readonly<Record<string, string | number>> = {}, table: WatchSmartTable = WATCH_SMART): string {
  const word = table.words[name] ?? "";
  return word.replace(/\{(\w+)\}/g, (all, key: string) => (Object.hasOwn(values, key) ? String(values[key]) : all));
}

/** A domain's table entry, or undefined for a domain the watch cannot fill. */
export function smartDomainInfo(domain: string, table: WatchSmartTable = WATCH_SMART): WatchSmartDomain | undefined {
  return table.domains.find((d) => d.domain === domain);
}

/** The domain's display name ("Lights"), else the domain capitalized as
 * Swift's `capitalized` does (the watch's title fallback). */
export function smartDomainName(domain: string, table: WatchSmartTable = WATCH_SMART): string {
  return smartDomainInfo(domain, table)?.displayName ?? watchCapitalized(domain);
}

interface KeySpec {
  type: string;
  enum?: string;
  required?: boolean;
  default?: unknown;
  fresh?: boolean;
  writeWhen?: { key: string; not?: unknown; gt?: number };
}

const KEYS = pageKeys as unknown as {
  enums: Record<string, string[]>;
  types: Record<string, { keys: Record<string, KeySpec> }>;
};

const PAGE_SPEC: Readonly<Record<string, KeySpec>> = KEYS.types.dynamicPage?.keys ?? {};
const RULE_SPEC: Readonly<Record<string, KeySpec>> = KEYS.types.domainRule?.keys ?? {};

/** The keys a rule's `tileStyle` may hold (`page-keys.json`
 * `domainTileStyle`), in the table's order. */
export const WATCH_DOMAIN_TILE_STYLE_KEYS: readonly string[] = Object.keys(KEYS.types.domainTileStyle?.keys ?? {});
const STYLE_KEYS: ReadonlySet<string> = new Set(WATCH_DOMAIN_TILE_STYLE_KEYS);

/** The eight `dynamicConfig` keys, each with the default a new smart page
 * gets, sorted as the phone encodes them. */
export const WATCH_SMART_PAGE_DEFAULTS: Readonly<JsonObject> = Object.fromEntries(
  Object.keys(PAGE_SPEC)
    .sort()
    .map((k) => [k, PAGE_SPEC[k]!.default]),
);

/** The header styles: none, gap, line, label. */
export const WATCH_SMART_HEADER_STYLES: readonly string[] = KEYS.enums.DomainHeaderStyle ?? [];
/** The two sort orders: domain, alphabetical. */
export const WATCH_SMART_SORT_ORDERS: readonly string[] = KEYS.enums.DynamicSortOrder ?? [];
/** The two rule modes: all, specific. */
export const WATCH_SMART_MODES: readonly string[] = KEYS.enums.SelectionMode ?? [];

/** The range of the page's tile spans and of a rule's own spans. */
export const WATCH_SMART_SPAN_RANGE = { min: 1, max: 12 } as const;
/** The range of a header's text size, and what an absent one reads as. */
export const WATCH_SMART_HEADER_SIZE_RANGE = { min: 8, max: 20, auto: 10 } as const;
/** The domains the watch skips the active test for. */
export const WATCH_SMART_NUMERIC_DOMAINS: ReadonlySet<string> = new Set(["sensor"]);

// ── the readers ──────────────────────────────────────────────────────────

/** A rule's `tileStyle`, as far as the watch reads it: only the listed keys,
 * each as stored. */
export interface WatchDomainTileStyle {
  /** The listed keys the style holds, as stored (`null` left out). */
  keys: JsonObject;
  colSpan?: number;
  rowSpan?: number;
  showLabel?: boolean;
  icon?: string;
  color?: string;
}

/** One rule as the decoder reads it. */
export interface WatchSmartRule {
  /** The rule as stored. */
  raw: JsonObject;
  /** The id as stored, "" when it has none (the phone would make one). */
  id: string;
  domain: string;
  mode: "all" | "specific";
  entityIds: string[];
  /** Undefined when absent; an empty list reads as none on the watch. */
  resolvedEntityIds?: string[];
  activeWhen?: string;
  invertActive: boolean;
  mediaPlayerPlayingOnly: boolean;
  deviceClassFilter?: string[];
  maxNumericValue?: number;
  tileStyle?: WatchDomainTileStyle;
  header: "none" | "gap" | "line" | "label";
  headerColor?: string;
  headerLabel?: string;
  headerLabelSize?: number;
  headerGlow: number;
}

/** A smart page's `dynamicConfig` as the decoder reads it. */
export interface WatchSmartConfig {
  /** The rules with a string `domain`, in order; a rule without one is
   * skipped here and kept in the document. */
  rules: WatchSmartRule[];
  tileColSpan: number;
  tileRowSpan: number;
  tileShowLabel: boolean;
  sortOrder: "domain" | "alphabetical";
  liveUpdates: boolean;
  refreshOnAppear: boolean;
  pullToRefresh: boolean;
}

function num(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function int(value: unknown, fallback: number): number {
  return Number.isInteger(value) ? (value as number) : fallback;
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function oneOf<T extends string>(value: unknown, allowed: readonly string[], fallback: T): T {
  return typeof value === "string" && allowed.includes(value) ? (value as T) : fallback;
}

/** A rule's `tileStyle` view, or undefined when it has none. */
export function readDomainTileStyle(value: unknown): WatchDomainTileStyle | undefined {
  if (!isJsonObject(value)) return undefined;
  const keys: JsonObject = {};
  for (const key of Object.keys(value)) {
    if (STYLE_KEYS.has(key) && value[key] !== null && value[key] !== undefined) keys[key] = value[key];
  }
  const out: WatchDomainTileStyle = { keys };
  if (Number.isInteger(keys.colSpan)) out.colSpan = keys.colSpan as number;
  if (Number.isInteger(keys.rowSpan)) out.rowSpan = keys.rowSpan as number;
  if (typeof keys.showLabel === "boolean") out.showLabel = keys.showLabel;
  if (typeof keys.icon === "string") out.icon = keys.icon;
  if (typeof keys.color === "string") out.color = keys.color;
  return out;
}

/** One rule's view, or undefined for a rule without a string `domain`. */
export function readSmartRule(value: unknown): WatchSmartRule | undefined {
  if (!isJsonObject(value) || typeof value.domain !== "string") return undefined;
  const rule: WatchSmartRule = {
    raw: value,
    id: str(value.id) ?? "",
    domain: value.domain,
    mode: oneOf(value.mode, WATCH_SMART_MODES, "all"),
    entityIds: strings(value.entityIds),
    invertActive: bool(value.invertActive, false),
    mediaPlayerPlayingOnly: value.mediaPlayerPlayingOnly === true,
    header: oneOf(value.header, WATCH_SMART_HEADER_STYLES, "label"),
    headerGlow: num(value.headerGlow) ?? 0,
  };
  if (Array.isArray(value.resolvedEntityIds)) rule.resolvedEntityIds = strings(value.resolvedEntityIds);
  if (typeof value.activeWhen === "string") rule.activeWhen = value.activeWhen;
  if (Array.isArray(value.deviceClassFilter)) rule.deviceClassFilter = strings(value.deviceClassFilter);
  const max = num(value.maxNumericValue);
  if (max !== undefined) rule.maxNumericValue = max;
  const style = readDomainTileStyle(value.tileStyle);
  if (style !== undefined) rule.tileStyle = style;
  if (typeof value.headerColor === "string") rule.headerColor = value.headerColor;
  if (typeof value.headerLabel === "string") rule.headerLabel = value.headerLabel;
  const size = num(value.headerLabelSize);
  if (size !== undefined) rule.headerLabelSize = size;
  return rule;
}

/** The page's `dynamicConfig` view, or undefined for a page that is not
 * smart. */
export function readSmartConfig(page: WatchPage): WatchSmartConfig | undefined {
  const c = page.dynamicConfig;
  if (!isJsonObject(c)) return undefined;
  const d = WATCH_SMART_PAGE_DEFAULTS;
  return {
    rules: Array.isArray(c.rules) ? c.rules.flatMap((r) => readSmartRule(r) ?? []) : [],
    tileColSpan: int(c.tileColSpan, d.tileColSpan as number),
    tileRowSpan: int(c.tileRowSpan, d.tileRowSpan as number),
    tileShowLabel: bool(c.tileShowLabel, d.tileShowLabel as boolean),
    sortOrder: oneOf(c.sortOrder, WATCH_SMART_SORT_ORDERS, d.sortOrder as "domain"),
    liveUpdates: bool(c.liveUpdates, d.liveUpdates as boolean),
    refreshOnAppear: bool(c.refreshOnAppear, d.refreshOnAppear as boolean),
    pullToRefresh: bool(c.pullToRefresh, d.pullToRefresh as boolean),
  };
}

/** The ids the watch counts for a rule (`effectiveEntityIds`): an `all`
 * rule's resolved list (none when absent), a `specific` rule's picks. */
export function smartEffectiveEntityIds(rule: WatchSmartRule): string[] {
  return rule.mode === "all" ? (rule.resolvedEntityIds ?? []) : rule.entityIds;
}

/** The first rule with the entity's domain (the part before the first
 * dot), as the watch's `rule(for:)` finds it, with its index in
 * `config.rules`. */
function ruleForEntity(config: WatchSmartConfig, entityId: string): number {
  const domain = entityId.split(".")[0] ?? "";
  return config.rules.findIndex((r) => r.domain === domain);
}

// ── presets ──────────────────────────────────────────────────────────────

function sameFilter(a: readonly string[] | undefined, b: readonly string[] | undefined): boolean {
  if (a === undefined || b === undefined) return a === b;
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/** The preset a rule was added from: same domain and an equal device class
 * filter, order included (an absent filter equals only an absent one). */
export function smartPresetForRule(rule: WatchSmartRule, table: WatchSmartTable = WATCH_SMART): WatchSmartPreset | undefined {
  return table.presets.find((p) => p.domain === rule.domain && sameFilter(p.deviceClassFilter, rule.deviceClassFilter));
}

/** Whether a preset is on the page already (Add Domain shows it checked
 * and disabled). */
export function smartPresetAdded(config: WatchSmartConfig, preset: WatchSmartPreset): boolean {
  return config.rules.some((r) => r.domain === preset.domain && sameFilter(preset.deviceClassFilter, r.deviceClassFilter));
}

/** The preset a reset writes: the rule's own preset, else the whole domain
 * preset, else none. */
export function smartResetPreset(rule: WatchSmartRule, table: WatchSmartTable = WATCH_SMART): WatchSmartPreset | undefined {
  return smartPresetForRule(rule, table) ?? table.presets.find((p) => p.domain === rule.domain && p.deviceClassFilter === undefined);
}

/** A rule chip's name: its preset's label, else the domain's name. */
export function smartRuleName(rule: WatchSmartRule, table: WatchSmartTable = WATCH_SMART): string {
  return smartPresetForRule(rule, table)?.label ?? smartDomainName(rule.domain, table);
}

// ── plumbing ─────────────────────────────────────────────────────────────

/** An object with `key` set: in place when it is there, at its sorted place
 * when it is new; the object itself when the key holds that value. */
function withValue(object: JsonObject, key: string, value: unknown): JsonObject {
  if (Object.hasOwn(object, key) && sameValue(object[key], value)) return object;
  return withField(object, key, value);
}

function without(object: JsonObject, key: string): JsonObject {
  if (!Object.hasOwn(object, key)) return object;
  const next = { ...object };
  delete next[key];
  return next;
}

/** `withValue`, or `without` for undefined. */
function withOptional(object: JsonObject, key: string, value: unknown): JsonObject {
  return value === undefined ? without(object, key) : withValue(object, key, value);
}

/** A fresh object with the keys in sorted order. */
function sortedObject(object: JsonObject): JsonObject {
  const out: JsonObject = {};
  for (const key of Object.keys(object).sort()) out[key] = object[key];
  return out;
}

/** The config with every key the decoder needs, a missing one written with
 * its default at its sorted place. */
function encodeConfig(config: JsonObject): JsonObject {
  let next = config;
  for (const [key, value] of Object.entries(WATCH_SMART_PAGE_DEFAULTS)) {
    if (!Object.hasOwn(next, key) || next[key] === null) next = withField(without(next, key), key, structuredClone(value));
  }
  return next;
}

/** A rule as the phone's encoder writes it: the always written keys
 * (`fresh` with a default) present, the conditional ones only while their
 * condition holds. */
function encodeRule(rule: JsonObject): JsonObject {
  let next = rule;
  for (const [key, spec] of Object.entries(RULE_SPEC)) {
    const when = spec.writeWhen;
    if (when !== undefined) {
      const v = next[key];
      const keep = Object.hasOwn(when, "not") ? v !== undefined && v !== null && !sameValue(v, when.not) : typeof v === "number" && v > (when.gt ?? 0);
      if (!keep) next = without(next, key);
    } else if (spec.fresh === true && Object.hasOwn(spec, "default") && (!Object.hasOwn(next, key) || next[key] === null)) {
      next = withField(without(next, key), key, structuredClone(spec.default));
    }
  }
  return next;
}

/** The document with one page replaced. */
function replacePage(document: WatchPagesDocument, page: WatchPage, next: WatchPage): WatchPagesDocument {
  if (next === page) return document;
  const pages = (document.pages as unknown[]).slice();
  pages[pages.indexOf(page)] = next;
  return { ...document, pages };
}

/** A listed page of the document (system pages are not), with a pages
 * list. */
function listedPage(document: WatchPagesDocument, pageId: string): WatchPage | undefined {
  const page = findWatchPage(document, pageId);
  return page !== undefined && Array.isArray(document.pages) ? page : undefined;
}

/** The document with a smart page's `dynamicConfig` changed, then given the
 * eight keys. The document itself when the page is not a listed smart page,
 * or the change refuses (undefined) or returns the config it was given. */
function editConfig(document: WatchPagesDocument, pageId: string, change: (config: JsonObject) => JsonObject | undefined): WatchPagesDocument {
  const page = listedPage(document, pageId);
  if (page === undefined || !isJsonObject(page.dynamicConfig)) return document;
  const changed = change(page.dynamicConfig);
  if (changed === undefined || changed === page.dynamicConfig) return document;
  return replacePage(document, page, withField(page, "dynamicConfig", encodeConfig(changed)));
}

function ruleList(config: JsonObject): unknown[] {
  return Array.isArray(config.rules) ? config.rules : [];
}

function ruleIndex(config: JsonObject, ruleId: string): number {
  return ruleList(config).findIndex((r) => isJsonObject(r) && sameWatchId(r.id, ruleId));
}

/** The document with one rule changed (the first with that id, without
 * regard to case), then encoded (`encodeRule`). */
function editRule(
  document: WatchPagesDocument,
  pageId: string,
  ruleId: string,
  change: (rule: JsonObject) => JsonObject | undefined,
): WatchPagesDocument {
  return editConfig(document, pageId, (config) => {
    const index = ruleIndex(config, ruleId);
    if (index < 0) return undefined;
    const rule = ruleList(config)[index] as JsonObject;
    const changed = change(rule);
    if (changed === undefined || changed === rule) return undefined;
    const rules = ruleList(config).slice();
    rules[index] = encodeRule(changed);
    return withField(config, "rules", rules);
  });
}

/** The rule's view in the document, for a writer that needs its domain. */
function viewOf(rule: JsonObject): WatchSmartRule | undefined {
  return readSmartRule(rule);
}

// ── convert and disable ──────────────────────────────────────────────────

/** How many tiles converting the page removes (the dialog's N); undefined
 * for a page that is missing or smart already. */
export function smartConvertTileCount(document: WatchPagesDocument, pageId: string): number | undefined {
  const page = listedPage(document, pageId);
  if (page === undefined || isJsonObject(page.dynamicConfig)) return undefined;
  return Array.isArray(page.items) ? page.items.length : 0;
}

/** Makes a page smart: the eight keys with their defaults, `items: []` and
 * `groups: []`; every other page key stays. Refused for a smart page. */
export function convertToSmartPage(document: WatchPagesDocument, pageId: string): WatchPagesDocument {
  const page = listedPage(document, pageId);
  if (page === undefined || isJsonObject(page.dynamicConfig)) return document;
  let next: JsonObject = without(page, "dynamicConfig");
  next = withField(next, "dynamicConfig", structuredClone(WATCH_SMART_PAGE_DEFAULTS));
  next = withValue(next, "items", []);
  next = withValue(next, "groups", []);
  return replacePage(document, page, next as WatchPage);
}

/** Makes a smart page a normal one again: `dynamicConfig` removed, nothing
 * else (the page is then empty). */
export function disableSmartPage(document: WatchPagesDocument, pageId: string): WatchPagesDocument {
  const page = listedPage(document, pageId);
  if (page === undefined || !Object.hasOwn(page, "dynamicConfig")) return document;
  return replacePage(document, page, without(page, "dynamicConfig") as WatchPage);
}

// ── page keys ────────────────────────────────────────────────────────────

/** A whole number from 1 to 12: rounded, then clamped; undefined for a
 * value that is not a finite number. */
function span(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return Math.min(WATCH_SMART_SPAN_RANGE.max, Math.max(WATCH_SMART_SPAN_RANGE.min, Math.round(value)));
}

function configBool(key: string) {
  return (document: WatchPagesDocument, pageId: string, on: boolean): WatchPagesDocument =>
    typeof on !== "boolean" ? document : editConfig(document, pageId, (c) => withValue(c, key, on));
}

function configSpan(key: string) {
  return (document: WatchPagesDocument, pageId: string, value: number): WatchPagesDocument => {
    const v = span(value);
    return v === undefined ? document : editConfig(document, pageId, (c) => withValue(c, key, v));
  };
}

/** "Live Updates". */
export const setSmartLiveUpdates = configBool("liveUpdates");
/** "Refresh on Page View" (shown while live updates are off; kept when on). */
export const setSmartRefreshOnAppear = configBool("refreshOnAppear");
/** "Pull to Refresh" (as `refreshOnAppear`). */
export const setSmartPullToRefresh = configBool("pullToRefresh");
/** "Show labels". */
export const setSmartTileShowLabel = configBool("tileShowLabel");
/** The page's tile columns, a whole number from 1 to 12. */
export const setSmartTileColSpan = configSpan("tileColSpan");
/** The page's tile rows, a whole number from 1 to 12. */
export const setSmartTileRowSpan = configSpan("tileRowSpan");

/** "Sort order": domain or alphabetical. */
export function setSmartSortOrder(document: WatchPagesDocument, pageId: string, order: string): WatchPagesDocument {
  if (!WATCH_SMART_SORT_ORDERS.includes(order)) return document;
  return editConfig(document, pageId, (c) => withValue(c, "sortOrder", order));
}

/** The page's tile size: a preset writes both spans in one edit, a box
 * one (the other undefined); each clamped as `setSmartTileColSpan`. */
export function setSmartTileSize(
  document: WatchPagesDocument,
  pageId: string,
  colSpan: number | undefined,
  rowSpan: number | undefined,
): WatchPagesDocument {
  const c = colSpan === undefined ? undefined : span(colSpan);
  const r = rowSpan === undefined ? undefined : span(rowSpan);
  if ((colSpan !== undefined && c === undefined) || (rowSpan !== undefined && r === undefined)) return document;
  return editConfig(document, pageId, (config) => {
    let next = config;
    if (c !== undefined) next = withValue(next, "tileColSpan", c);
    if (r !== undefined) next = withValue(next, "tileRowSpan", r);
    return next;
  });
}

/** The Page card's switches and the sort order by key (the case files'
 * `smartPageKey`). */
export const WATCH_SMART_PAGE_SETTERS: Readonly<Record<string, (document: WatchPagesDocument, pageId: string, value: never) => WatchPagesDocument>> = {
  liveUpdates: setSmartLiveUpdates,
  refreshOnAppear: setSmartRefreshOnAppear,
  pullToRefresh: setSmartPullToRefresh,
  tileShowLabel: setSmartTileShowLabel,
  sortOrder: setSmartSortOrder,
};

// ── resolve ──────────────────────────────────────────────────────────────

/** Every entity id of the domain in Home Assistant's states, sorted (plain
 * code unit order, as the phone's `sorted()`). The device class filter is
 * not applied: the watch filters at fill time. */
export function resolveSmartRule(states: States | undefined, domain: string): string[] {
  if (states === undefined || domain === "") return [];
  const prefix = `${domain}.`;
  return Object.keys(states)
    .filter((id) => id.startsWith(prefix))
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

function resolved(rule: JsonObject, states: States | undefined): JsonObject {
  const domain = typeof rule.domain === "string" ? rule.domain : "";
  const ids = resolveSmartRule(states, domain);
  return withValue(rule, "resolvedEntityIds", ids);
}

/** The Resolve button: the rule's `resolvedEntityIds` from the states,
 * written even when empty (the watch reads `[]` as none). The document
 * itself when the stored list is that list already. */
export function withResolvedRule(document: WatchPagesDocument, pageId: string, ruleId: string, states: States | undefined): WatchPagesDocument {
  if (states === undefined) return document;
  return editRule(document, pageId, ruleId, (rule) => resolved(rule, states));
}

/**
 * The save step: every `all` rule with a string domain, on each smart page
 * that is new or differs from the page of the same id in `base`, resolved
 * from the states. A list already equal is not rewritten, so a page whose
 * lists are current comes back as it was. Without states, the document.
 */
export function resolveSmartPagesBeforeSave(
  document: WatchPagesDocument,
  base: WatchPagesDocument | null | undefined,
  states: States | undefined,
): WatchPagesDocument {
  if (states === undefined) return document;
  const before = new Map<string, WatchPage>();
  if (base !== null && base !== undefined) {
    for (const page of watchPagesOf(base)) {
      const id = watchPageId(page).toUpperCase();
      if (id !== "" && !before.has(id)) before.set(id, page);
    }
  }
  let next = document;
  for (const page of watchPagesOf(document)) {
    if (!isJsonObject(page.dynamicConfig)) continue;
    const old = before.get(watchPageId(page).toUpperCase());
    if (old !== undefined && (old === page || sameWatchPagesJson(old, page))) continue;
    const pageId = watchPageId(page);
    for (const rule of ruleList(page.dynamicConfig)) {
      if (!isJsonObject(rule) || typeof rule.id !== "string") continue;
      const view = viewOf(rule);
      if (view === undefined || view.mode !== "all") continue;
      next = withResolvedRule(next, pageId, rule.id, states);
    }
  }
  return next;
}

// ── rules ────────────────────────────────────────────────────────────────

/**
 * Adds a rule from an Add Domain preset, at the end: a new upper case id,
 * the domain, `mode` all, no picks, the preset's device class filter
 * (absent for a whole domain), `tileStyle` {color, icon} with the domain's
 * role color for the page theme (`colorHex`, passed in) and the preset's
 * icon, `headerLabel` the preset's label, `header` label, `invertActive`
 * false; then, when `states` are given, every `all` rule of the page is
 * resolved from them, as the phone does after an add.
 */
export function addSmartRule(
  document: WatchPagesDocument,
  pageId: string,
  preset: WatchSmartPreset,
  colorHex: string,
  states: States | undefined,
  options?: WatchEditOptions,
): WatchPagesDocument {
  const color = normalizeWatchColor(colorHex, "tile");
  if (color === undefined || typeof preset.domain !== "string" || preset.domain === "") return document;
  const id = (options?.newId ?? randomWatchId)().toUpperCase();
  const rule: JsonObject = sortedObject({
    domain: preset.domain,
    entityIds: [],
    header: "label",
    headerLabel: preset.label,
    id,
    invertActive: false,
    mode: "all",
    tileStyle: sortedObject({ color, ...(preset.icon !== "" ? { icon: preset.icon } : {}) }),
    ...(preset.deviceClassFilter !== undefined ? { deviceClassFilter: preset.deviceClassFilter.slice() } : {}),
  });
  return editConfig(document, pageId, (config) => {
    const rules = [...ruleList(config), encodeRule(rule)].map((r) => {
      if (states === undefined || !isJsonObject(r) || readSmartRule(r)?.mode !== "all") return r;
      const next = resolved(r, states);
      return next === r ? r : encodeRule(next);
    });
    return withField(config, "rules", rules);
  });
}

/** Mode All or Specific. Set to All, the rule is resolved from `states`
 * when they are given. Picks and the resolved list are kept. */
export function setSmartRuleMode(
  document: WatchPagesDocument,
  pageId: string,
  ruleId: string,
  mode: string,
  states?: States,
): WatchPagesDocument {
  if (!WATCH_SMART_MODES.includes(mode)) return document;
  return editRule(document, pageId, ruleId, (rule) => {
    const next = withValue(rule, "mode", mode);
    return mode === "all" && states !== undefined ? resolved(next, states) : next;
  });
}

/** A specific rule's picks, in pick order, a repeat dropped. */
export function setSmartRuleEntityIds(document: WatchPagesDocument, pageId: string, ruleId: string, ids: readonly string[]): WatchPagesDocument {
  if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string")) return document;
  return editRule(document, pageId, ruleId, (rule) => withValue(rule, "entityIds", [...new Set(ids)]));
}

/** "Show when <inverted>": `invertActive`, true or false. */
export function setSmartRuleInvert(document: WatchPagesDocument, pageId: string, ruleId: string, on: boolean): WatchPagesDocument {
  if (typeof on !== "boolean") return document;
  return editRule(document, pageId, ruleId, (rule) => withValue(rule, "invertActive", on));
}

/** "Playing only" of a media player rule: true written, false removes the
 * key. Refused for any other domain. */
export function setSmartRulePlayingOnly(document: WatchPagesDocument, pageId: string, ruleId: string, on: boolean): WatchPagesDocument {
  if (typeof on !== "boolean") return document;
  return editRule(document, pageId, ruleId, (rule) => {
    if (rule.domain !== "media_player") return undefined;
    return on ? withValue(rule, "mediaPlayerPlayingOnly", true) : without(rule, "mediaPlayerPlayingOnly");
  });
}

/** A device class chip: removed when the filter holds it, else added at
 * the end; an empty filter removes the key. */
export function toggleSmartRuleDeviceClass(document: WatchPagesDocument, pageId: string, ruleId: string, value: string): WatchPagesDocument {
  if (typeof value !== "string" || value === "") return document;
  return editRule(document, pageId, ruleId, (rule) => {
    const now = strings(rule.deviceClassFilter);
    const next = now.includes(value) ? now.filter((v) => v !== value) : [...now, value];
    return next.length === 0 ? without(rule, "deviceClassFilter") : withValue(rule, "deviceClassFilter", next);
  });
}

/** Swift's `Double(text)` for the forms a decimal pad can type, signs and
 * exponents included; undefined for anything else. */
export function parseSmartNumber(text: string): number | undefined {
  if (!/^[+-]?(?:[0-9]+\.?[0-9]*|\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/.test(text)) return undefined;
  const n = Number(text);
  return Number.isFinite(n) ? n : undefined;
}

/** The max value box: trimmed, empty removes the key, a number is written
 * (a whole number as a whole number), anything else is refused. */
export function setSmartRuleMaxValue(document: WatchPagesDocument, pageId: string, ruleId: string, text: string): WatchPagesDocument {
  if (typeof text !== "string") return document;
  const t = text.trim();
  const n = t === "" ? undefined : parseSmartNumber(t);
  if (t !== "" && n === undefined) return document;
  return editRule(document, pageId, ruleId, (rule) => withOptional(rule, "maxNumericValue", n));
}

/** The max value box's caption, read from the first device class of the
 * rule's filter ("Max value (%)" for battery), by the table's samples;
 * "Max value" for any other. */
export function smartMaxValueLabel(rule: WatchSmartRule, table: WatchSmartTable = WATCH_SMART): string {
  const samples = objects(isJsonObject(table.raw.domains) ? table.raw.domains.maxValueLabels : undefined);
  const first = rule.deviceClassFilter?.[0];
  const label = (s: JsonObject) => str(s.label);
  const plain = samples.find((s) => s.filter === null);
  const match = first === undefined ? undefined : samples.find((s) => Array.isArray(s.filter) && s.filter[0] === first);
  return (match && label(match)) ?? (plain && label(plain)) ?? "";
}

/** The count a rule row shows, undefined for none: the resolved list's in
 * All, the picks' in Specific. */
export function smartCountBadge(rule: WatchSmartRule): number | undefined {
  const count = rule.mode === "all" ? (rule.resolvedEntityIds ?? []).length : rule.entityIds.length;
  return count > 0 ? count : undefined;
}

/** "Not resolved": an `all` rule whose list is absent or empty. */
export function smartRuleUnresolved(rule: WatchSmartRule): boolean {
  return rule.mode === "all" && (rule.resolvedEntityIds ?? []).length === 0;
}

/** How the max value box shows a stored value: a whole number without a
 * fraction, "" when there is none. */
export function smartMaxValueText(rule: WatchSmartRule): string {
  return rule.maxNumericValue === undefined ? "" : String(rule.maxNumericValue);
}

/** "Active when state is": empty removes the key. */
export function setSmartRuleActiveWhen(document: WatchPagesDocument, pageId: string, ruleId: string, text: string): WatchPagesDocument {
  if (typeof text !== "string") return document;
  const t = text.trim();
  return editRule(document, pageId, ruleId, (rule) => withOptional(rule, "activeWhen", t === "" ? undefined : t));
}

/** The header style: none, gap, line, label. */
export function setSmartRuleHeader(document: WatchPagesDocument, pageId: string, ruleId: string, style: string): WatchPagesDocument {
  if (!WATCH_SMART_HEADER_STYLES.includes(style)) return document;
  return editRule(document, pageId, ruleId, (rule) => withValue(rule, "header", style));
}

/** The header's label text, as typed: empty removes the key (the watch then
 * draws the domain's name). */
export function setSmartRuleHeaderLabel(document: WatchPagesDocument, pageId: string, ruleId: string, text: string): WatchPagesDocument {
  if (typeof text !== "string") return document;
  return editRule(document, pageId, ruleId, (rule) => withOptional(rule, "headerLabel", text === "" ? undefined : text));
}

/** Swift's `rounded()`: half away from zero. */
function swiftRounded(value: number): number {
  return Math.sign(value) * Math.round(Math.abs(value));
}

/** The header's text size: rounded to a whole number and clamped to 8 to
 * 20; `null` removes it (reads 10). */
export function setSmartRuleHeaderSize(document: WatchPagesDocument, pageId: string, ruleId: string, size: number | null): WatchPagesDocument {
  let value: number | undefined;
  if (size !== null) {
    if (typeof size !== "number" || !Number.isFinite(size)) return document;
    const { min, max } = WATCH_SMART_HEADER_SIZE_RANGE;
    value = Math.min(max, Math.max(min, swiftRounded(size)));
  }
  return editRule(document, pageId, ruleId, (rule) => withOptional(rule, "headerLabelSize", value));
}

/** The glow's steps per unit: it moves in twentieths (0.05). */
export const WATCH_SMART_GLOW_STEPS = 20;

/** The header's glow: rounded to the nearest twentieth and clamped to 0 to
 * 1; 0 removes the key. */
export function setSmartRuleHeaderGlow(document: WatchPagesDocument, pageId: string, ruleId: string, glow: number): WatchPagesDocument {
  if (typeof glow !== "number" || !Number.isFinite(glow)) return document;
  const stepped = Math.min(1, Math.max(0, swiftRounded(glow * WATCH_SMART_GLOW_STEPS) / WATCH_SMART_GLOW_STEPS));
  return editRule(document, pageId, ruleId, (rule) => withOptional(rule, "headerGlow", stepped > 0 ? stepped : undefined));
}

/** The header's color, `#RRGGBB`; undefined (Default) removes the key, and
 * the watch draws white. */
export function setSmartRuleHeaderColor(document: WatchPagesDocument, pageId: string, ruleId: string, color: string | undefined): WatchPagesDocument {
  const value = color === undefined ? undefined : normalizeWatchColor(color, "solid");
  if (color !== undefined && value === undefined) return document;
  return editRule(document, pageId, ruleId, (rule) => withOptional(rule, "headerColor", value));
}

/** A rule's own size, written into `tileStyle`: both spans (a preset), or
 * undefined for "Page size", which removes both (and an emptied
 * `tileStyle`). */
export function setSmartRuleSize(
  document: WatchPagesDocument,
  pageId: string,
  ruleId: string,
  size: { colSpan: number; rowSpan: number } | undefined,
): WatchPagesDocument {
  const c = size === undefined ? undefined : span(size.colSpan);
  const r = size === undefined ? undefined : span(size.rowSpan);
  if (size !== undefined && (c === undefined || r === undefined)) return document;
  return editRule(document, pageId, ruleId, (rule) => withStyle(rule, (style) => withOptional(withOptional(style, "colSpan", c), "rowSpan", r)));
}

/** One of a rule's own spans (the two boxes), a whole number from 1 to 12;
 * `null` removes it. */
export function setSmartRuleSpan(
  document: WatchPagesDocument,
  pageId: string,
  ruleId: string,
  key: "colSpan" | "rowSpan",
  value: number | null,
): WatchPagesDocument {
  if (key !== "colSpan" && key !== "rowSpan") return document;
  const v = value === null ? undefined : span(value);
  if (value !== null && v === undefined) return document;
  return editRule(document, pageId, ruleId, (rule) => withStyle(rule, (style) => withOptional(style, key, v)));
}

/** The rule with its `tileStyle` changed; an emptied style is removed. */
function withStyle(rule: JsonObject, change: (style: JsonObject) => JsonObject): JsonObject {
  const style = isJsonObject(rule.tileStyle) ? rule.tileStyle : {};
  const next = change(style);
  if (next === style) return rule;
  return Object.keys(next).length === 0 ? without(rule, "tileStyle") : withValue(rule, "tileStyle", next);
}

/** Moves a rule to another place in the list (Up is `index - 1`, Down
 * `index + 1`); refused outside the list. */
export function moveSmartRule(document: WatchPagesDocument, pageId: string, ruleId: string, toIndex: number): WatchPagesDocument {
  return editConfig(document, pageId, (config) => {
    const from = ruleIndex(config, ruleId);
    const rules = ruleList(config);
    if (from < 0 || !Number.isInteger(toIndex) || toIndex < 0 || toIndex >= rules.length || toIndex === from) return undefined;
    const next = rules.slice();
    const [rule] = next.splice(from, 1);
    next.splice(toIndex, 0, rule);
    return withField(config, "rules", next);
  });
}

/** Deletes a rule. */
export function deleteSmartRule(document: WatchPagesDocument, pageId: string, ruleId: string): WatchPagesDocument {
  return editConfig(document, pageId, (config) => {
    const index = ruleIndex(config, ruleId);
    if (index < 0) return undefined;
    const rules = ruleList(config).slice();
    rules.splice(index, 1);
    return withField(config, "rules", rules);
  });
}

/** The rule's id after a delete: the one now at its place, else the last,
 * else none (the selection clamps). */
export function smartRuleAfterDelete(config: WatchSmartConfig, deletedIndex: number): string | undefined {
  if (config.rules.length === 0) return undefined;
  return config.rules[Math.min(Math.max(0, deletedIndex), config.rules.length - 1)]!.id;
}

/** The keys a reset removes. */
const RESET_REMOVES = ["headerColor", "headerLabelSize", "headerGlow", "activeWhen", "maxNumericValue", "mediaPlayerPlayingOnly"];

/**
 * Reset: what the matching preset's add writes, keeping `id`, `domain`,
 * `mode`, `entityIds`, `resolvedEntityIds` and `deviceClassFilter`:
 * `tileStyle` {color (`colorHex`, the domain's role color for the page
 * theme), icon of the preset (`smartResetPreset`), else the domain's icon},
 * `headerLabel` the preset's label (removed when there is none), `header`
 * label, `invertActive` false, and the header color, size and glow,
 * `activeWhen`, the max value and playing only removed.
 */
export function resetSmartRule(
  document: WatchPagesDocument,
  pageId: string,
  ruleId: string,
  colorHex: string,
  table: WatchSmartTable = WATCH_SMART,
): WatchPagesDocument {
  const color = normalizeWatchColor(colorHex, "tile");
  if (color === undefined) return document;
  return editRule(document, pageId, ruleId, (rule) => {
    const view = viewOf(rule);
    if (view === undefined) return undefined;
    const preset = smartResetPreset(view, table);
    const icon = preset?.icon || smartDomainInfo(view.domain, table)?.icon || "";
    let next = rule;
    for (const key of RESET_REMOVES) next = without(next, key);
    next = withValue(next, "tileStyle", sortedObject({ color, ...(icon !== "" ? { icon } : {}) }));
    next = withOptional(next, "headerLabel", preset?.label);
    next = withValue(next, "header", "label");
    next = withValue(next, "invertActive", false);
    return next;
  });
}

// ── the per-domain style through a stand-in tile ─────────────────────────

/** The entity id of a rule's stand-in tile: `<domain>.rule`, so every tile
 * setter reads the rule's domain as the tile's kind. */
export function smartStandInEntityId(domain: string): string {
  return `${domain}.rule`;
}

/** The stand-in tile of a rule: `{id: <rule id>, entityId: <domain>.rule}`
 * with the page's spans and label switch, then each `tileStyle` key the
 * watch reads over them, sorted. */
function standInTileOf(rule: JsonObject, config: WatchSmartConfig | undefined): JsonObject {
  const style = isJsonObject(rule.tileStyle) ? rule.tileStyle : {};
  const d = WATCH_SMART_PAGE_DEFAULTS;
  const tile: JsonObject = {
    id: typeof rule.id === "string" ? rule.id : "",
    entityId: smartStandInEntityId(typeof rule.domain === "string" ? rule.domain : ""),
    colSpan: config?.tileColSpan ?? d.tileColSpan,
    rowSpan: config?.tileRowSpan ?? d.tileRowSpan,
    showLabel: config?.tileShowLabel ?? d.tileShowLabel,
  };
  for (const key of WATCH_DOMAIN_TILE_STYLE_KEYS) {
    if (Object.hasOwn(style, key) && style[key] !== null && style[key] !== undefined) tile[key] = style[key];
  }
  return sortedObject(tile);
}

/**
 * A one page document whose only tile stands for a rule's style (`rule` as
 * stored, a view's `raw`), so the tile settings sections can edit it with
 * the tile setters. The tile is `{id: <rule id>, entityId:
 * "<domain>.rule"}`, every tile setter reading the domain as its kind, with
 * the page's `tileColSpan`, `tileRowSpan` and `tileShowLabel` as its spans
 * and label switch, and each `tileStyle` key the watch reads
 * (`WATCH_DOMAIN_TILE_STYLE_KEYS`) over them as a tile key of the same name,
 * which is how the watch stamps them on its tiles. The stand-in page is
 * `{id: pageId, items: [tile]}` plus, when the real `page` is given, every
 * key of it but `items` and `dynamicConfig` (a smart page refuses every tile
 * setter); its config gives the spans, else the defaults.
 *
 * The setters read nothing of the page beyond refusing smart and system
 * pages; the settings view reads the page for its colors: the swatches and
 * the rainbow fallback come from `watchPageSwatchTheme(host.page)`, which
 * reads the page's `themeOverride` and `useGradientColors`. So a host for
 * the stand-in hands out the stand-in page, built with the real page. The
 * resize setters of `edit.ts` place the tile on the stand-in page alone;
 * use `setSmartRuleSize` and `setSmartRuleSpan` for a rule's spans instead.
 */
export function smartStyleStandIn(rule: JsonObject, pageId: string, page?: WatchPage): WatchPagesDocument {
  const config = page === undefined ? undefined : readSmartConfig(page);
  const standInPage: JsonObject = page === undefined ? {} : without(without(page, "items"), "dynamicConfig");
  return { pages: [{ ...standInPage, id: pageId, items: [standInTileOf(rule, config)] }] };
}

/** The stand-in tile of a stand-in document. */
export function smartStandInTile(standIn: WatchPagesDocument, pageId: string, ruleId: string): WatchPageTile | undefined {
  const page = watchPagesOf(standIn).find((p) => sameWatchId(p.id, pageId));
  const items = page?.items;
  if (!Array.isArray(items)) return undefined;
  return items.find((t): t is WatchPageTile => isJsonObject(t) && sameWatchId(t.id, ruleId));
}

/**
 * Writes a tile setter's work on the stand-in back into the rule: the
 * stand-in is built again from the rule and the page in `document`, and
 * each `tileStyle` key the watch reads whose value on the stand-in tile in
 * `next` differs from it is written, one the setter removed is removed, and
 * an emptied `tileStyle` is removed. So a span or the label switch the
 * stand-in only carried from the page is written only once a setter
 * changes it. Keys outside the list are never written (a setter's
 * `customLabel`, `stateIcons`, placement). The document itself when nothing
 * changed or the stand-in is gone.
 */
export function applySmartStyleStandIn(document: WatchPagesDocument, pageId: string, ruleId: string, next: WatchPagesDocument): WatchPagesDocument {
  const after = smartStandInTile(next, pageId, ruleId);
  const page = listedPage(document, pageId);
  if (after === undefined || page === undefined) return document;
  const config = readSmartConfig(page);
  const value = (tile: JsonObject, key: string) => (Object.hasOwn(tile, key) && tile[key] !== null ? tile[key] : undefined);
  return editRule(document, pageId, ruleId, (rule) => {
    const before = standInTileOf(rule, config);
    return withStyle(rule, (style) => {
      let out = style;
      for (const key of WATCH_DOMAIN_TILE_STYLE_KEYS) {
        const was = value(before, key);
        const now = value(after, key);
        if (now === undefined ? was === undefined : sameValue(now, was)) continue;
        out = withOptional(out, key, now);
      }
      return out;
    });
  });
}

// ── the fill ─────────────────────────────────────────────────────────────

function lower(value: unknown): string {
  return typeof value === "string" ? value.toLowerCase() : "";
}

function domainOf(entityId: string): string {
  return entityId.split(".")[0] ?? "";
}

/** Whether the watch counts an entity as there: present, and not
 * `unavailable` or `unknown`. */
export function smartEntityAvailable(entityId: string, states: States | undefined): boolean {
  const s = states !== undefined && Object.hasOwn(states, entityId) ? states[entityId] : undefined;
  if (s === undefined) return false;
  const state = lower(s.state);
  return state !== "unavailable" && state !== "unknown";
}

const MEDIA_ACTIVE: ReadonlySet<string> = new Set(["playing", "paused", "on", "idle", "buffering"]);

function mediaActive(s: HassEntityState | undefined): boolean {
  return s !== undefined && MEDIA_ACTIVE.has(lower(s.state));
}

/**
 * The watch's `isEntityActive` with a rule: by the entity's own domain,
 * light, switch, fan, input boolean and automation `on`; cover and valve
 * `open`; lock not `locked`; climate an `hvac_action` other than off or
 * idle, else a state other than off; media player `playing` with playing
 * only, else playing, paused, on, idle or buffering; vacuum cleaning,
 * returning or paused; remote its matching media player's test when
 * `media_player.<object id>` exists, else `on`; alarm panel not
 * `disarmed`; any other domain the state equal to `activeWhen` when the
 * rule has one, else on, open or unlocked, all lower cased. A missing
 * entity is not active. Then inverted when the rule says so.
 */
export function smartEntityActive(entityId: string, rule: WatchSmartRule | undefined, states: States | undefined): boolean {
  const s = states !== undefined && Object.hasOwn(states, entityId) ? states[entityId] : undefined;
  let raw = false;
  if (s !== undefined) {
    const state = lower(s.state);
    switch (domainOf(entityId)) {
      case "light":
      case "switch":
      case "fan":
      case "input_boolean":
      case "automation":
        raw = state === "on";
        break;
      case "cover":
      case "valve":
        raw = state === "open";
        break;
      case "lock":
        raw = state !== "locked";
        break;
      case "climate": {
        const action = s.attributes?.hvac_action;
        raw = typeof action === "string" ? !["off", "idle"].includes(action.toLowerCase()) : state !== "off";
        break;
      }
      case "media_player":
        raw = rule?.mediaPlayerPlayingOnly === true ? state === "playing" : mediaActive(s);
        break;
      case "vacuum":
        raw = state === "cleaning" || state === "returning" || state === "paused";
        break;
      case "remote": {
        const player = `media_player.${entityId.slice("remote.".length)}`;
        const p = states !== undefined && Object.hasOwn(states, player) ? states[player] : undefined;
        raw = p !== undefined ? mediaActive(p) : state === "on";
        break;
      }
      case "alarm_control_panel":
        raw = state !== "disarmed";
        break;
      default:
        raw = rule?.activeWhen !== undefined ? state === rule.activeWhen.toLowerCase() : state === "on" || state === "open" || state === "unlocked";
    }
  }
  return rule?.invertActive === true ? !raw : raw;
}

/** The watch's `passesSmartRule`: the device class filter, the max value
 * (the state read as a number), then the active test, which a sensor rule
 * skips. */
function passesRule(entityId: string, rule: WatchSmartRule, states: States | undefined): boolean {
  const s = states?.[entityId];
  if (rule.deviceClassFilter !== undefined && rule.deviceClassFilter.length > 0) {
    const dc = s?.attributes?.device_class;
    if (typeof dc !== "string" || !rule.deviceClassFilter.includes(dc)) return false;
  }
  if (rule.maxNumericValue !== undefined) {
    const n = typeof s?.state === "string" ? parseSmartNumber(s.state) : undefined;
    if (n === undefined || n > rule.maxNumericValue) return false;
  }
  if (WATCH_SMART_NUMERIC_DOMAINS.has(rule.domain)) return true;
  return smartEntityActive(entityId, rule, states);
}

/** An entity's name as the watch sorts by it: `friendly_name`, else the
 * id without its domain, underscores as spaces, capitalized. */
export function smartFriendlyName(entityId: string, states: States | undefined): string {
  const name = states?.[entityId]?.attributes?.friendly_name;
  if (typeof name === "string" && name !== "") return name;
  return watchCapitalized(entityId.split(".").slice(1).join(".").replaceAll("_", " "));
}

/** One rule's active entities, tagged with the rule's index in
 * `config.rules`. */
export interface WatchSmartGroup {
  ruleIndex: number;
  entityIds: string[];
}

/**
 * The watch's `activeEntityIdsByDomain`: per rule in order, its source ids
 * (an `all` rule's resolved list when non-empty, else every entity of the
 * domain in the states, sorted; a `specific` rule's picks), kept when
 * available and passing the rule, sorted by friendly name (case folded)
 * for an alphabetical page. Empty groups are dropped.
 */
export function smartActiveGroups(config: WatchSmartConfig, states: States | undefined): WatchSmartGroup[] {
  const groups: WatchSmartGroup[] = [];
  config.rules.forEach((rule, ruleIndex) => {
    const source =
      rule.mode === "all"
        ? rule.resolvedEntityIds !== undefined && rule.resolvedEntityIds.length > 0
          ? rule.resolvedEntityIds
          : resolveSmartRule(states, rule.domain)
        : rule.entityIds;
    const ids = source.filter((id) => smartEntityAvailable(id, states) && passesRule(id, rule, states));
    if (config.sortOrder === "alphabetical") {
      ids.sort((a, b) => smartFriendlyName(a, states).localeCompare(smartFriendlyName(b, states), undefined, { sensitivity: "accent" }));
    }
    if (ids.length > 0) groups.push({ ruleIndex, entityIds: ids });
  });
  return groups;
}

/** A header item as the watch's `makeHeaderItem` makes it, or undefined for
 * none and gap. */
function headerItem(rule: WatchSmartRule, columns: number, row: number, id: string): JsonObject | undefined {
  if (rule.header !== "line" && rule.header !== "label") return undefined;
  const glow = rule.headerGlow > 0 ? `.g${Math.round(rule.headerGlow * 100)}` : "";
  const item: JsonObject = {
    id,
    entityId: `divider.${rule.header}.${rule.domain}${glow}`,
    colSpan: columns,
    rowSpan: 1,
    gridCol: 0,
    gridRow: row,
    showLabel: false,
  };
  if (rule.headerColor !== undefined) item.color = rule.headerColor;
  if (rule.header === "label") {
    if (rule.headerLabel !== undefined) item.customLabel = rule.headerLabel;
    if (rule.headerLabelSize !== undefined) item.labelFontSizeOverride = rule.headerLabelSize;
  }
  return sortedObject(item);
}

/**
 * The synthetic tiles, exactly as the watch's `buildDynamicPage` places
 * them. A group's rule is the first rule with the domain of its first id
 * (a group with none is skipped), as each tile's is with its own id. After
 * a group a new row starts when the last one is not full, advanced by the
 * previous group's row span. A header takes one row (a gap too, drawing
 * nothing). A tile is `tileStyle.colSpan ?? tileColSpan` by `rowSpan ??
 * tileRowSpan`, wraps when it would pass the last column, and gets every
 * style key the rule holds, with `showLabel` from the style or the page.
 * Ids are made up for the panel (`smart:<n>`), the watch's are random.
 */
export function smartPageLayout(config: WatchSmartConfig, groups: readonly WatchSmartGroup[], columns: number = WATCH_GRID_COLUMNS): WatchPageTile[] {
  const items: WatchPageTile[] = [];
  let col = 0;
  let row = 0;
  let prev: WatchSmartRule | undefined;
  let n = 0;
  groups.forEach((group, g) => {
    const first = group.entityIds[0];
    const index = first === undefined ? -1 : ruleForEntity(config, first);
    if (index < 0) return;
    const rule = config.rules[index]!;
    if (g > 0 && col > 0) {
      row += prev?.tileStyle?.rowSpan ?? config.tileRowSpan;
      col = 0;
    }
    if (rule.header !== "none") {
      const header = headerItem(rule, columns, row, `smart:${n++}`);
      if (header !== undefined) items.push(header);
      row += 1;
    }
    for (const entityId of group.entityIds) {
      const i = ruleForEntity(config, entityId);
      const matched = i < 0 ? undefined : config.rules[i];
      const cs = matched?.tileStyle?.colSpan ?? config.tileColSpan;
      const rs = matched?.tileStyle?.rowSpan ?? config.tileRowSpan;
      if (col + cs > columns) {
        col = 0;
        row += rs;
      }
      const item: JsonObject = { id: `smart:${n++}`, entityId, showLabel: config.tileShowLabel, colSpan: cs, rowSpan: rs, gridCol: col, gridRow: row };
      const style = matched?.tileStyle;
      if (style !== undefined) {
        Object.assign(item, style.keys);
        item.showLabel = style.showLabel ?? config.tileShowLabel;
      }
      items.push(sortedObject(item));
      col += cs;
      if (col >= columns) {
        col = 0;
        row += rs;
      }
    }
    prev = rule;
  });
  return items;
}

/** The title words from the counts: "All Off" with no active entity, "N
 * <Domain> On" when exactly one rule has active entities (its count and
 * domain name), else "N Active" with the page's total. */
export function smartTitleWords(
  totalActive: number,
  ruleCounts: readonly { domain: string; count: number }[],
  table: WatchSmartTable = WATCH_SMART,
): string {
  if (totalActive <= 0) return smartWord("allOff", {}, table);
  const counted = ruleCounts.filter((c) => c.count > 0);
  if (counted.length === 1) return smartWord("domainOn", { count: counted[0]!.count, name: smartDomainName(counted[0]!.domain, table) }, table);
  return smartWord("active", { count: totalActive }, table);
}

/**
 * The watch's `dynamicPageTitle` (`smartTitleWords`): the total is every
 * active entity of the groups, and each rule's count is of the ids it
 * counts (`smartEffectiveEntityIds`) by the active test alone, as the watch
 * counts them.
 */
export function smartPageTitle(
  config: WatchSmartConfig,
  groups: readonly WatchSmartGroup[],
  states: States | undefined,
  table: WatchSmartTable = WATCH_SMART,
): string {
  const total = groups.reduce((sum, g) => sum + g.entityIds.length, 0);
  const counts = config.rules.map((rule) => ({
    domain: rule.domain,
    count: smartEffectiveEntityIds(rule).filter((id) => smartEntityActive(id, rule, states)).length,
  }));
  return smartTitleWords(total, counts, table);
}

/** The watch's empty state line: "Tracking 47 lights, 12 switches" (each
 * rule with ids, its domain's name lower cased, an unknown domain as is),
 * or "No entities configured". */
export function smartTrackingWords(config: WatchSmartConfig, table: WatchSmartTable = WATCH_SMART): string {
  const parts: string[] = [];
  for (const rule of config.rules) {
    const count = smartEffectiveEntityIds(rule).length;
    if (count === 0) continue;
    const name = smartDomainInfo(rule.domain, table)?.displayName.toLowerCase() ?? rule.domain;
    parts.push(`${count} ${name}`);
  }
  return parts.length === 0 ? smartWord("noEntities", {}, table) : smartWord("tracking", { parts: parts.join(", ") }, table);
}

/** The page the watch draws for a smart page: its own keys, `items` the
 * synthetic tiles, `switcherText` the title. The page itself when it is
 * not smart. */
export function smartSyntheticPage(page: WatchPage, states: States | undefined, table: WatchSmartTable = WATCH_SMART): WatchPage {
  const config = readSmartConfig(page);
  if (config === undefined) return page;
  const groups = smartActiveGroups(config, states);
  return { ...page, items: smartPageLayout(config, groups), switcherText: smartPageTitle(config, groups, states, table) };
}

/** The domains more than one rule names, in first rule order. */
export function smartSharedDomains(config: WatchSmartConfig): string[] {
  const seen = new Set<string>();
  const shared: string[] = [];
  for (const rule of config.rules) {
    if (seen.has(rule.domain) && !shared.includes(rule.domain)) shared.push(rule.domain);
    seen.add(rule.domain);
  }
  return shared;
}

/** The note for rules that share a domain (the watch draws every group of
 * the domain with the first rule's header and style), one sentence per
 * shared domain, naming the domain as stored; undefined when no two rules
 * share one. A note, never a refusal. */
export function smartDuplicateDomainNote(config: WatchSmartConfig, table: WatchSmartTable = WATCH_SMART): string | undefined {
  const shared = smartSharedDomains(config);
  if (shared.length === 0) return undefined;
  return shared.map((domain) => smartWord("sharedDomain", { domain }, table)).join(" ");
}

/** Which rule drew a synthetic tile, by index in `config.rules`: the first
 * rule of the tile's domain, or for a header (`divider.<style>.<domain>`)
 * of its domain; undefined when none. */
export function smartRuleIndexForTile(config: WatchSmartConfig, item: WatchPageTile): number | undefined {
  const entityId = typeof item.entityId === "string" ? item.entityId : "";
  const parts = entityId.split(".");
  const domain = parts[0] === "divider" && parts.length >= 3 ? parts[2]! : (parts[0] ?? "");
  const index = config.rules.findIndex((r) => r.domain === domain);
  return index < 0 ? undefined : index;
}
