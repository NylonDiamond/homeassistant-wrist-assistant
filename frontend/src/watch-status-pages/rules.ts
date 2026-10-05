// The watch's rules for drawing a status page, in TypeScript: which states a
// row's filter matches, the value each row shows, its color, the rows a
// dynamic list turns into, the two column pairing, and the plan of what the
// watch fetches. The preview on the stage is drawn from these, from Home
// Assistant's own `hass.states`, so it shows what the watch would.
//
// The tables come from `status-page-rules.json`, built from the app's Swift
// code. Its entries whose `source` is `fill`, `display`, `rounding` or
// `colors` describe watch-only code (`StatusPageSnippetView`) in words; that
// code is ported here by hand and pinned by the case files in
// `test/fixtures-status-pages/rules`, which the app writes from Swift.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 2 build
// contract", items 16 and 19).

import rulesTable from "./status-page-rules.json";
import { type JsonObject, isJsonObject } from "../watch-pages/model.js";

// ── the table ────────────────────────────────────────────────────────────

interface StateOption {
  value: string;
  label: string;
}

interface MatchDomain {
  anyActiveTokens?: string[];
  inactiveStates?: string[];
  activeStates?: string[];
  tokenMeansState?: Record<string, string>;
}

/** One entry of the add lists: what the phone offers and the row it adds. */
export interface StatusPagePreset {
  label: string;
  icon: string;
  domain: string;
  /** Group counts only: how the entities are picked, from the domain or by
   * device class. */
  picker?: "domain" | "deviceClass";
  deviceClassFilter?: string[];
  maxNumericValue?: number;
  showAllStates?: boolean;
  /** The row's keys as the phone writes them, less `id` (and, for a group
   * count, the picked entities). */
  row: JsonObject;
}

interface RulesTable {
  defaultFilterState: Record<string, string>;
  activeLabel: Record<string, string>;
  stateOptions: Record<string, StateOption[]>;
  binarySensorClassStates: { classes: Record<string, { on: string; off: string }> };
  matchFilter: { domains: Record<string, MatchDomain> };
  coverValue: { naStates: string[]; na: string; words: Record<string, string> };
  maxValueLabels: { labels: Record<string, string> };
  defaultIcons: Record<string, string>;
  dynamicListTiles: StatusPagePreset[];
  groupCountPresets: StatusPagePreset[];
  display: {
    noState: string;
    domains: Record<string, Record<string, string> | string>;
    default: { words: Record<string, string> };
  };
  colors: Record<string, Record<string, string> | string>;
}

export const STATUS_PAGE_RULES = rulesTable as unknown as RulesTable;

const ANY = "*";

function byDomain<T>(map: Record<string, T>, domain: string): T {
  return (Object.hasOwn(map, domain) ? map[domain] : map[ANY]) as T;
}

// ── the row as the rules read it ─────────────────────────────────────────

/** The keys of a row the rules read, typed. A key of the wrong type reads as
 * absent, as the watch's decoder would refuse it anyway. */
export interface StatusRow {
  id: string;
  rowType: string;
  entityId: string;
  displayName: string;
  domain: string;
  iconName: string;
  groupEntityIds?: string[];
  dynamicMode?: string;
  filterState?: string;
  deviceClassFilter?: string[];
  showAllStates?: boolean;
  maxNumericValue?: number;
  isHidden?: boolean;
  headerAlignment?: string;
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function strings(value: unknown): string[] | undefined {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : undefined;
}

/** A stored row read for the rules. */
export function readStatusRow(row: JsonObject): StatusRow {
  const out: StatusRow = {
    id: str(row.id),
    rowType: str(row.rowType),
    entityId: str(row.entityId),
    displayName: str(row.displayName),
    domain: str(row.domain),
    iconName: str(row.iconName),
  };
  const ids = strings(row.groupEntityIds);
  if (ids !== undefined) out.groupEntityIds = ids;
  if (typeof row.dynamicMode === "string") out.dynamicMode = row.dynamicMode;
  if (typeof row.filterState === "string") out.filterState = row.filterState;
  const classes = strings(row.deviceClassFilter);
  if (classes !== undefined) out.deviceClassFilter = classes;
  if (typeof row.showAllStates === "boolean") out.showAllStates = row.showAllStates;
  if (typeof row.maxNumericValue === "number" && Number.isFinite(row.maxNumericValue)) out.maxNumericValue = row.maxNumericValue;
  if (typeof row.isHidden === "boolean") out.isHidden = row.isHidden;
  if (typeof row.headerAlignment === "string") out.headerAlignment = row.headerAlignment;
  return out;
}

// ── filters ──────────────────────────────────────────────────────────────

/** The state a row's filter counts: its `filterState`, else the domain's
 * default (`StatusRowConfig.effectiveFilterState`). */
export function effectiveFilterState(row: Pick<StatusRow, "filterState" | "domain">): string {
  return row.filterState ?? byDomain(STATUS_PAGE_RULES.defaultFilterState, row.domain);
}

/** The word a group count puts after its number when the row has no filter
 * of its own (`StatusRowConfig.activeLabel`). */
export function activeLabel(domain: string): string {
  return byDomain(STATUS_PAGE_RULES.activeLabel, domain);
}

/**
 * Whether a state counts for a row's filter (`StatusRowConfig.
 * matchesFilterState`), from the table: both lowercased; for a domain the
 * table lists, a token meaning "active" matches every state not inactive (or
 * every state in its active list), and a token the domain maps names one
 * state; any other token, and every other domain, matches the state equal
 * to it.
 */
export function matchesFilterState(row: Pick<StatusRow, "filterState" | "domain">, rawState: string): boolean {
  const state = rawState.toLowerCase();
  const token = effectiveFilterState(row).toLowerCase();
  const rule = Object.hasOwn(STATUS_PAGE_RULES.matchFilter.domains, row.domain) ? STATUS_PAGE_RULES.matchFilter.domains[row.domain] : undefined;
  if (rule !== undefined) {
    if (rule.anyActiveTokens?.includes(token)) {
      if (rule.activeStates !== undefined) return rule.activeStates.includes(state);
      return !(rule.inactiveStates ?? []).includes(state);
    }
    if (rule.tokenMeansState !== undefined && Object.hasOwn(rule.tokenMeansState, token)) {
      return state === rule.tokenMeansState[token];
    }
  }
  return state === token;
}

/** The Show State choices of a row (`StatusRowConfig.stateOptions(for:
 * deviceClassFilter:)`): a binary sensor filtered to exactly one class it
 * knows reads that class's words; any other row its domain's. */
export function stateOptions(domain: string, deviceClassFilter?: readonly string[]): StateOption[] {
  const classes = STATUS_PAGE_RULES.binarySensorClassStates.classes;
  if (domain === "binary_sensor" && deviceClassFilter?.length === 1 && Object.hasOwn(classes, deviceClassFilter[0]!)) {
    const words = classes[deviceClassFilter[0]!]!;
    return [{ value: "on", label: words.on }, { value: "off", label: words.off }];
  }
  return byDomain(STATUS_PAGE_RULES.stateOptions, domain);
}

/** The max value field's label, by the first device class. */
export function maxValueLabel(deviceClassFilter?: readonly string[]): string {
  const labels = STATUS_PAGE_RULES.maxValueLabels.labels;
  const first = deviceClassFilter?.[0];
  return first !== undefined && Object.hasOwn(labels, first) ? labels[first]! : labels[ANY]!;
}

/** The icon a new entity row of a domain gets. */
export function defaultStatusIcon(domain: string): string {
  return byDomain(STATUS_PAGE_RULES.defaultIcons, domain);
}

// ── Swift's own string and number rules ─────────────────────────────────

/**
 * Foundation's `String.capitalized` as the case file pins it: a letter is
 * upper cased when the character before it is not a letter (the start, a
 * space, a digit, `_`, `-`), and lower cased otherwise.
 */
export function swiftCapitalized(text: string): string {
  let out = "";
  let afterLetter = false;
  for (const ch of text) {
    const letter = /\p{L}/u.test(ch);
    if (letter) out += afterLetter ? ch.toLowerCase() : ch.toUpperCase();
    else out += ch;
    // A combining mark belongs to the letter before it.
    if (!/\p{M}/u.test(ch)) afterLetter = letter;
  }
  return out;
}

const DECIMAL = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/;
const HEX = /^([+-]?)0[xX]([0-9a-fA-F]*)(?:\.([0-9a-fA-F]*))?(?:[pP]([+-]?\d+))?$/;
const SPECIAL = /^([+-]?)(inf|infinity|nan)$/i;

/**
 * Swift's `Double(String)`: a decimal with an optional sign, a leading or a
 * trailing point and an exponent; a hexadecimal number (`0x1A`, with a
 * fraction and a binary exponent); `inf`, `infinity` and `nan`. No spaces.
 * Undefined for anything else.
 */
export function parseSwiftDouble(text: string): number | undefined {
  if (DECIMAL.test(text)) return Number(text);
  const hex = HEX.exec(text);
  if (hex !== null) {
    const whole = hex[2] ?? "";
    const fraction = hex[3] ?? "";
    if (whole === "" && fraction === "") return undefined;
    let value = whole === "" ? 0 : parseInt(whole, 16);
    for (let i = 0; i < fraction.length; i++) value += parseInt(fraction[i]!, 16) / 16 ** (i + 1);
    if (hex[4] !== undefined) value *= 2 ** Number(hex[4]);
    return hex[1] === "-" ? -value : value;
  }
  const special = SPECIAL.exec(text);
  if (special !== null) {
    const value = special[2]!.toLowerCase() === "nan" ? NaN : Infinity;
    return special[1] === "-" ? -value : value;
  }
  return undefined;
}

/** The bounds of Swift's `Int` on the watch's 64-bit builds: `Int(x)` traps
 * outside them. */
const INT_LIMIT = 9_223_372_036_854_775_808;

/** Swift's `rounded()`: the nearest whole number, halves away from zero
 * (2.5 is 3, -2.5 is -3), unlike `Math.round`. */
export function roundHalfAway(value: number): number {
  const magnitude = Math.abs(value);
  const whole = Math.trunc(magnitude);
  const rounded = magnitude - whole >= 0.5 ? whole + 1 : whole;
  return value < 0 ? -rounded : rounded;
}

/** `Int(value.rounded())` as text, or undefined where the watch would trap
 * (not finite, or past the range of `Int`). */
function wholeText(value: number): string | undefined {
  if (!Number.isFinite(value)) return undefined;
  const rounded = roundHalfAway(value);
  if (rounded >= INT_LIMIT || rounded < -INT_LIMIT) return undefined;
  return BigInt(rounded).toString();
}

/**
 * A state as the watch writes it with Round Numbers on
 * (`formattedNumericString`): a number rounded to a whole one; the state as
 * written when it does not parse, and where the watch would trap (inf, nan,
 * past the range of `Int`). Off: the state as written.
 */
export function roundedNumericText(raw: string, round: boolean): string {
  if (!round) return raw;
  const value = parseSwiftDouble(raw);
  if (value === undefined) return raw;
  return wholeText(value) ?? raw;
}

/** `String(format: "%.1f", value)`: one decimal, a tie to the even digit as
 * C rounds an exact half. `toFixed` takes the larger digit on a tie. */
function oneDecimal(value: number): string {
  const magnitude = Math.abs(value);
  // An exact tie at one decimal is a fraction of .25 or .75 that is exact in
  // binary; .25 goes down to the even .2, .75 up to .8 as toFixed does.
  const quarters = magnitude * 4;
  if (Number.isInteger(quarters) && quarters % 2 === 1 && quarters % 4 === 1) {
    const text = (magnitude - 0.05).toFixed(1);
    return value < 0 || Object.is(value, -0) ? `-${text}` : text;
  }
  return value.toFixed(1);
}

/** A climate row's temperature (`formatValue`, climate): rounded with Round
 * Numbers on; otherwise whole without decimals, else one decimal. */
export function climateTemperatureText(temperature: number, round: boolean): string {
  if (round) return wholeText(temperature) ?? String(temperature);
  if (!Number.isFinite(temperature)) return String(temperature);
  if (temperature % 1 === 0) return wholeText(temperature) ?? String(temperature);
  return oneDecimal(temperature);
}

/** A cover or valve row's value (`StatusRowConfig.coverValue`): N/A when
 * unavailable or unknown, Closed whatever the position, a position between
 * 1 and 99 as a percent, else the state's word or the state capitalized. */
export function coverValue(state: string, position: number | null | undefined): string {
  const rule = STATUS_PAGE_RULES.coverValue;
  if (rule.naStates.includes(state)) return rule.na;
  if (state === "closed") return rule.words.closed ?? "Closed";
  if (position !== null && position !== undefined && position > 0 && position < 100) return `${position}%`;
  return Object.hasOwn(rule.words, state) ? rule.words[state]! : swiftCapitalized(state);
}

// ── values and colors ────────────────────────────────────────────────────

/** What the watch knows of one entity: its state and the attributes the
 * rules read. */
export interface StatusEntityState {
  state: string;
  attributes?: Record<string, unknown>;
}

export type StatusStates = Readonly<Record<string, StatusEntityState | undefined>>;

function attribute(state: StatusEntityState, key: string): unknown {
  const attrs = state.attributes;
  return attrs !== undefined && Object.hasOwn(attrs, key) ? attrs[key] : undefined;
}

function textAttribute(state: StatusEntityState, key: string): string | undefined {
  const value = attribute(state, key);
  return typeof value === "string" ? value : undefined;
}

/** An `Int` attribute as the watch decodes it: a whole number, else none. */
function intAttribute(state: StatusEntityState, key: string): number | undefined {
  const value = attribute(state, key);
  return typeof value === "number" && Number.isInteger(value) ? value : undefined;
}

function numberAttribute(state: StatusEntityState, key: string): number | undefined {
  const value = attribute(state, key);
  return typeof value === "number" ? value : undefined;
}

/**
 * The value an entity row shows (`StatusPageSnippetView.formatValue`): N/A
 * with no state; a lock, an alarm panel, a light, switch, input boolean or
 * fan in the table's words; a climate entity's current temperature with its
 * unit (else °); a cover or valve by `coverValue`; any other state with its
 * unit when it has one, else in the table's words, else the number rounded
 * as the page says.
 */
export function formatStatusValue(state: StatusEntityState | undefined, domain: string, roundNumericValues: boolean): string {
  const display = STATUS_PAGE_RULES.display;
  if (state === undefined) return display.noState;
  const raw = state.state;
  switch (domain) {
    case "climate": {
      const temperature = numberAttribute(state, "current_temperature");
      if (temperature !== undefined) {
        return `${climateTemperatureText(temperature, roundNumericValues)}${textAttribute(state, "unit_of_measurement") ?? "°"}`;
      }
      return swiftCapitalized(raw);
    }
    case "cover":
    case "valve":
      return coverValue(raw, intAttribute(state, "current_position"));
    default:
      break;
  }
  const words = Object.hasOwn(display.domains, domain) ? display.domains[domain] : undefined;
  if (isJsonObject(words)) {
    const map = words as Record<string, string>;
    return Object.hasOwn(map, raw) ? map[raw]! : map[ANY]!;
  }
  const shown = roundedNumericText(raw, roundNumericValues);
  const unit = textAttribute(state, "unit_of_measurement");
  if (unit !== undefined && unit !== "") {
    return unit.startsWith("°") || unit.startsWith("%") ? `${shown}${unit}` : `${shown} ${unit}`;
  }
  const lower = raw.toLowerCase();
  const fallback = display.default.words;
  return Object.hasOwn(fallback, lower) ? fallback[lower]! : shown;
}

/** The SwiftUI color names the watch uses, as the dark watch draws them. */
export const STATUS_COLORS: Readonly<Record<string, string>> = {
  green: "#30D158",
  orange: "#FF9F0A",
  red: "#FF453A",
  cyan: "#64D2FF",
  yellow: "#FFD60A",
  gray: "#8E8E93",
  secondary: "#98989F",
};

/** The color name of a domain in a state (`defaultDomainColor`); an
 * entity with no state takes the domain's fallback. */
export function statusColorName(domain: string, state: string | undefined): string {
  const colors = STATUS_PAGE_RULES.colors;
  const entry = Object.hasOwn(colors, domain) && domain !== "groupCount" ? colors[domain] : colors[ANY];
  const map = (isJsonObject(entry) ? entry : colors[ANY]) as Record<string, string>;
  if (state !== undefined && Object.hasOwn(map, state)) return map[state]!;
  return map[ANY] ?? "secondary";
}

export function statusColor(domain: string, state: string | undefined): string {
  return STATUS_COLORS[statusColorName(domain, state)] ?? STATUS_COLORS.secondary!;
}

// ── the fetch plan ───────────────────────────────────────────────────────

export interface StatusFetchPlan {
  /** Entity ids, sorted. */
  customEntityIds: string[];
  /** Domains a list of all matching asks for whole, with the device classes
   * asked (null: the whole domain). */
  fetchDomains: Record<string, string[] | null>;
}

/**
 * What the watch asks `states_batch` for (`StatusPageConfig.fetchPlan`):
 * visible rows only; an entity row its entity, a group count and a hand
 * picked list their entities, a list of all matching its domain with its
 * device classes. One domain asked twice gets the sorted union of its
 * classes, and an ask for the whole domain wins.
 */
export function statusFetchPlan(rows: readonly StatusRow[]): StatusFetchPlan {
  const ids = new Set<string>();
  const domains = new Map<string, string[] | null>();
  for (const row of rows) {
    if (row.isHidden === true) continue;
    switch (row.rowType) {
      case "entity":
        if (row.entityId !== "") ids.add(row.entityId);
        break;
      case "groupCount":
        for (const id of row.groupEntityIds ?? []) ids.add(id);
        break;
      case "dynamicList":
        if (row.dynamicMode === "all") {
          const filter = row.deviceClassFilter ?? null;
          if (!domains.has(row.domain)) domains.set(row.domain, filter);
          else {
            const held = domains.get(row.domain)!;
            domains.set(row.domain, held === null || filter === null ? null : [...new Set([...held, ...filter])].sort());
          }
        } else {
          for (const id of row.groupEntityIds ?? []) ids.add(id);
        }
        break;
      default:
        break;
    }
  }
  return { customEntityIds: [...ids].sort(), fetchDomains: Object.fromEntries(domains) };
}

/**
 * The states the watch would hold for a page: Home Assistant's answer to the
 * fetch plan, from `states` (the server's `states_batch`: each entity asked
 * for that exists, and every entity of each domain asked, filtered by its
 * device classes when any are named).
 */
export function fetchedStatusStates(plan: StatusFetchPlan, states: StatusStates): Record<string, StatusEntityState> {
  const out: Record<string, StatusEntityState> = {};
  for (const id of plan.customEntityIds) {
    const state = Object.hasOwn(states, id) ? states[id] : undefined;
    if (state !== undefined) out[id] = state;
  }
  const domains = Object.entries(plan.fetchDomains);
  if (domains.length === 0) return out;
  for (const [id, state] of Object.entries(states)) {
    if (state === undefined) continue;
    for (const [domain, classes] of domains) {
      if (!id.startsWith(`${domain}.`)) continue;
      if (classes !== null && classes.length > 0) {
        const cls = textAttribute(state, "device_class");
        if (cls === undefined || !classes.includes(cls)) continue;
      }
      out[id] = state;
    }
  }
  return out;
}

// ── the rows the watch draws ─────────────────────────────────────────────

/** One row as the watch draws it. A header has no value. */
export interface StatusPreviewRow {
  /** The stored row this one comes from (a dynamic list's rows share it). */
  rowId: string;
  /** `entity`, `groupCount` or `sectionHeader`. */
  kind: "entity" | "groupCount" | "sectionHeader";
  label: string;
  icon: string;
  value: string;
  /** A color name of `STATUS_COLORS`. */
  color: string;
  /** Headers: leading, center or trailing. */
  align?: string;
  /** The entity drawn, for an entity row. */
  entityId?: string;
}

/** A group count's value (`groupCountValue`): how many of its entities
 * match, and the word for them. A sensor count with a max value counts the
 * states at or below it. */
export function groupCountValue(row: StatusRow, states: StatusStates): string {
  const ids = row.groupEntityIds ?? [];
  const stateOf = (id: string) => (Object.hasOwn(states, id) ? states[id] : undefined);
  if (row.domain === "sensor" && row.maxNumericValue !== undefined) {
    const max = row.maxNumericValue;
    const count = ids.filter((id) => {
      const s = stateOf(id);
      const n = s === undefined ? undefined : parseSwiftDouble(s.state);
      return n !== undefined && n <= max;
    }).length;
    return `${count} ${row.filterState ?? "low"}`;
  }
  const count = ids.filter((id) => {
    const s = stateOf(id);
    return s !== undefined && matchesFilterState(row, s.state);
  }).length;
  return `${count} ${row.filterState ?? activeLabel(row.domain)}`;
}

/**
 * The rows the watch draws for a page (`resolvedRows`): hidden rows
 * skipped; a dynamic list turned into one entity row per kept entity (all
 * of its domain by id, or its own entities in order; filtered by device
 * class, by having a state, by its state filter unless it shows all
 * states, and by its max value); each row with its value and color.
 */
export function statusPreviewRows(rows: readonly StatusRow[], states: StatusStates, roundNumericValues: boolean): StatusPreviewRow[] {
  const stateOf = (id: string) => (Object.hasOwn(states, id) ? states[id] : undefined);
  const out: StatusPreviewRow[] = [];
  const entityRow = (row: StatusRow, entityId: string, label: string): StatusPreviewRow => {
    const state = stateOf(entityId);
    return {
      rowId: row.id,
      kind: "entity",
      label,
      icon: row.iconName,
      value: formatStatusValue(state, row.domain, roundNumericValues),
      color: statusColorName(row.domain, state?.state),
      entityId,
    };
  };
  for (const row of rows) {
    if (row.isHidden === true) continue;
    switch (row.rowType) {
      case "sectionHeader":
        out.push({ rowId: row.id, kind: "sectionHeader", label: row.displayName.toUpperCase(), icon: row.iconName, value: "", color: "secondary", align: row.headerAlignment ?? "leading" });
        break;
      case "groupCount":
        out.push({ rowId: row.id, kind: "groupCount", label: row.displayName, icon: row.iconName, value: groupCountValue(row, states), color: statusColorName(row.domain, "on") });
        break;
      case "dynamicList": {
        let candidates = row.dynamicMode === "all"
          ? Object.keys(states).filter((id) => id.startsWith(`${row.domain}.`) && states[id] !== undefined).sort()
          : [...(row.groupEntityIds ?? [])];
        const classes = row.deviceClassFilter;
        if (classes !== undefined && classes.length > 0) {
          candidates = candidates.filter((id) => {
            const s = stateOf(id);
            const cls = s === undefined ? undefined : textAttribute(s, "device_class");
            return cls !== undefined && classes.includes(cls);
          });
        }
        for (const id of candidates) {
          const s = stateOf(id);
          if (s === undefined) continue;
          if (row.showAllStates !== true && !matchesFilterState(row, s.state)) continue;
          if (row.maxNumericValue !== undefined) {
            const n = parseSwiftDouble(s.state);
            if (n === undefined || !(n <= row.maxNumericValue)) continue;
          }
          const name = textAttribute(s, "friendly_name") ?? id.split(".").filter((p) => p !== "").pop() ?? id;
          out.push(entityRow(row, id, name));
        }
        break;
      }
      default:
        // An entity row, and any type a newer app wrote, as the watch's
        // decoder would have refused the latter whole.
        out.push(entityRow(row, row.entityId, row.displayName));
        break;
    }
  }
  return out;
}

/** One line of a two column page: a header across, or a pair of cells. */
export type StatusTwoColumnItem =
  | { kind: "header"; row: StatusPreviewRow }
  | { kind: "pair"; first: StatusPreviewRow; second?: StatusPreviewRow };

/** The two column layout (`buildTwoColumnLayout`): headers take the full
 * width, other rows pair up in order, a row left alone before a header or
 * at the end takes the left half. */
export function statusTwoColumnItems(rows: readonly StatusPreviewRow[]): StatusTwoColumnItem[] {
  const items: StatusTwoColumnItem[] = [];
  let pending: StatusPreviewRow | undefined;
  for (const row of rows) {
    if (row.kind === "sectionHeader") {
      if (pending !== undefined) items.push({ kind: "pair", first: pending });
      pending = undefined;
      items.push({ kind: "header", row });
    } else if (pending !== undefined) {
      items.push({ kind: "pair", first: pending, second: row });
      pending = undefined;
    } else {
      pending = row;
    }
  }
  if (pending !== undefined) items.push({ kind: "pair", first: pending });
  return items;
}

/** A page's rows as the watch would draw them now: the fetch plan applied to
 * `states`, then `statusPreviewRows`. */
export function statusPageFill(page: JsonObject, states: StatusStates): StatusPreviewRow[] {
  const rows = (Array.isArray(page.rows) ? page.rows : []).filter(isJsonObject).map(readStatusRow);
  const round = typeof page.roundNumericValues === "boolean" ? page.roundNumericValues : true;
  return statusPreviewRows(rows, fetchedStatusStates(statusFetchPlan(rows), states), round);
}
