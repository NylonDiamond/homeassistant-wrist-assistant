// New tiles for the watch page editor, built exactly as the phone builds them,
// without any drawing.
//
// A phone-made tile is every key marked `fresh` in the `tile` type of
// `page-keys.json`, each with its `new` value, else its `default`, plus a few
// keys by kind: an entity tile's icon, color and label, a spacer's own entity
// id, a header's size and color, a page link's target. The phone encodes with
// sorted keys, so the builders write keys in sorted order and the JSON is the
// phone's to the byte.
//
// Every icon, color, theme and domain rule comes from `tile-defaults.json`,
// which the app writes from its Swift code (`WatchPagesTablesTests`); none is
// written out here. The case files in `test/fixtures-pages/add` pin whole
// tiles, and the test runs every one.
//
// Adding follows the rules of `edit.ts`: the tile goes to the first free
// place for its size and is appended to `items`; only the document, `pages`,
// the page and its `items` are new objects. Ids are written in upper case.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md, "3c build contract".

import pageKeys from "./page-keys.json";
import tileDefaults from "./tile-defaults.json";
import { type WatchEditOptions, firstFreeWatchCell, randomWatchId, sameWatchId } from "./edit.js";
import {
  type JsonObject,
  type WatchPage,
  type WatchPageTile,
  type WatchPagesDocument,
  isJsonObject,
  isHiddenWatchPage,
  isSmartWatchPage,
  isSystemWatchPage,
  tileEntityId,
  tileKind,
  tileTarget,
  watchPageTiles,
  watchPagesOf,
} from "./model.js";

// ── the table ────────────────────────────────────────────────────────────

interface ThemeTable {
  displayName: string;
  roles: Record<string, string>;
  gradientRoles: Record<string, string>;
  expandedSwatchHexes: string[];
  expandedSwatchGradients: string[];
}

interface DomainLook {
  icon: string | null;
  role?: string;
  hex?: string;
  appleIcon?: string;
}

interface DomainSpec extends DomainLook {
  tvRemote?: DomainLook;
  stateRules?: boolean;
  fromMacroLibrary?: boolean;
}

interface SensorBand {
  atLeast?: number;
  below?: number;
  icon?: string;
  hex?: string;
}

interface DeviceClassSpec {
  icon?: string | null;
  hex?: string | null;
  iconBands?: SensorBand[];
  otherIcon?: string;
  hexBands?: SensorBand[];
  otherHex?: string;
}

interface AddRoute {
  via: string;
  picker: string;
  name: string;
  preferred?: boolean;
  tvOnly?: boolean;
  extras: Record<string, unknown>;
  writesCalendarSourceColor?: boolean;
  linksDeviceMediaPlayer?: boolean;
}

interface LinkSpec {
  entityIdPrefix: string;
  icon: string;
  role: string;
}

interface TileDefaultsTable {
  themeOrder: string[];
  themes: Record<string, ThemeTable>;
  roles: string[];
  addFallbackTheme: string;
  watchFallbackTheme: string;
  domains: Record<string, DomainSpec>;
  otherDomains: { icon: string | null; color: string | null };
  sensorState: {
    deviceClassIgnoresCase: boolean;
    byDomain: Record<string, { icon: string; hex: string }>;
    deviceClasses: Record<string, DeviceClassSpec>;
  };
  calendar: { swatchTheme: string; samples: Record<string, string> };
  label: { assist: string; speak_message: string; samples: { entityId: string; friendlyName?: string; label: string }[] };
  addable: { domain: string; routes: AddRoute[] }[];
  tile: { colSpan: number; rowSpan: number };
  spacer: { entityIdPrefix: string; showLabel: boolean; colSpan: number; rowSpan: number };
  header: { entityId: string; colSpan: number; rowSpan: number; showLabel: boolean; color: string };
  pageLink: LinkSpec;
  peekLink: LinkSpec;
}

/** The table as the app wrote it. Exported for the tests, which read its
 * test vectors; nothing else should reach into it. */
export const WATCH_TILE_DEFAULTS: Readonly<TileDefaultsTable> = tileDefaults as unknown as TileDefaultsTable;
const TABLE = WATCH_TILE_DEFAULTS;

interface PageKeySpec {
  fresh?: boolean;
  new?: unknown;
  default?: unknown;
}

const TILE_KEYS: Readonly<Record<string, PageKeySpec>> = (
  pageKeys as unknown as { types: { tile: { keys: Record<string, PageKeySpec> } } }
).types.tile.keys;

function own<T>(record: Readonly<Record<string, T>>, key: string): T | undefined {
  return Object.hasOwn(record, key) ? record[key] : undefined;
}

function newIdFrom(options: WatchEditOptions | undefined): string {
  return (options?.newId ?? randomWatchId)().toUpperCase();
}

function byCodeUnit(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** The object with its keys in sorted order, nested objects too, as the
 * phone's encoder writes them. */
function sortedKeys(value: JsonObject): JsonObject {
  const out: JsonObject = {};
  for (const key of Object.keys(value).sort(byCodeUnit)) {
    const v = value[key];
    out[key] = isJsonObject(v) ? sortedKeys(v) : v;
  }
  return out;
}

/** Every `fresh` tile key with its `new` value, else its `default`, then the
 * kind's own keys over them, in sorted key order. */
function freshTile(fields: JsonObject): WatchPageTile {
  const tile: JsonObject = {};
  for (const [key, spec] of Object.entries(TILE_KEYS)) {
    if (spec.fresh !== true) continue;
    if (Object.hasOwn(spec, "new")) tile[key] = structuredClone(spec.new);
    else if (Object.hasOwn(spec, "default")) tile[key] = structuredClone(spec.default);
  }
  return sortedKeys({ ...tile, ...fields });
}

// ── colors ───────────────────────────────────────────────────────────────

const GRADIENT_PREFIX = "GRADIENT|";

/** `DSThemeHex.normalizedHex`: trimmed, one `#`, upper case. */
function normalizedHex(hex: string): string {
  const trimmed = hex.trim();
  const body = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
  return `#${body.toUpperCase()}`;
}

/** `gradientComponents`: a value that starts with `GRADIENT|` and has a
 * second `|`. */
function isGradientToken(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.startsWith(GRADIENT_PREFIX) && trimmed.slice(GRADIENT_PREFIX.length).includes("|");
}

/** `rgbComponents`: six characters after `#` that Swift's `Int(_, radix: 16)`
 * reads, else undefined. */
function rgbOf(hex: string): [number, number, number] | undefined {
  const body = normalizedHex(hex).slice(1);
  if ([...body].length !== 6 || !/^[+-]?[0-9A-F]+$/.test(body)) return undefined;
  const value = parseInt(body, 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

/** Swift's `rounded()`: half away from zero. */
function swiftRound(x: number): number {
  return Math.sign(x) * Math.round(Math.abs(x));
}

function hsbOf(hex: string): { h: number; s: number; b: number } | undefined {
  const rgb = rgbOf(hex);
  if (rgb === undefined) return undefined;
  const [r, g, b] = rgb.map((c) => c / 255) as [number, number, number];
  const maxC = Math.max(r, g, b);
  const minC = Math.min(r, g, b);
  const delta = maxC - minC;
  let hue = 0;
  if (delta > 0) {
    // `%` is C's `fmod`, Swift's `truncatingRemainder`.
    if (maxC === r) hue = 60 * (((g - b) / delta) % 6);
    else if (maxC === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
    if (hue < 0) hue += 360;
  }
  return { h: hue, s: maxC > 0 ? delta / maxC : 0, b: maxC };
}

function hexFromHsb(h: number, s: number, b: number): string {
  const c = b * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = b - c;
  let r1: number;
  let g1: number;
  let b1: number;
  if (h >= 0 && h < 60) [r1, g1, b1] = [c, x, 0];
  else if (h >= 60 && h < 120) [r1, g1, b1] = [x, c, 0];
  else if (h >= 120 && h < 180) [r1, g1, b1] = [0, c, x];
  else if (h >= 180 && h < 240) [r1, g1, b1] = [0, x, c];
  else if (h >= 240 && h < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  const channel = (v: number) =>
    Math.min(swiftRound((v + m) * 255), 255)
      .toString(16)
      .toUpperCase()
      .padStart(2, "0");
  return `#${channel(r1)}${channel(g1)}${channel(b1)}`;
}

/** `hueShiftedHex`: hue turned by `degrees` and brightness times 0.85 (at
 * least 0.15), saturation kept; a color with saturation under 0.1 instead
 * moves its brightness by 0.3, down when over 0.5, else up. Undefined for a
 * value that is not a six digit hex color. */
function hueShiftedHex(hex: string, degrees: number): string | undefined {
  const hsb = hsbOf(hex);
  if (hsb === undefined) return undefined;
  if (hsb.s < 0.1) {
    const b = hsb.b > 0.5 ? Math.max(hsb.b - 0.3, 0) : Math.min(hsb.b + 0.3, 1);
    return hexFromHsb(hsb.h, hsb.s, b);
  }
  const hue = (hsb.h + degrees) % 360;
  return hexFromHsb(hue < 0 ? hue + 360 : hue, hsb.s, Math.max(hsb.b * 0.85, 0.15));
}

/**
 * The phone's gradient form of a color (`DSThemeHex.gradientVersion`):
 * `GRADIENT|<base>|<end>`, the base upper case with one `#`, the end the base
 * with its hue turned 150 degrees and brightness times 0.85 (at least 0.15);
 * a near gray (saturation under 0.1) moves its brightness by 0.3 instead.
 * Channels round half away from zero. `#RAINBOW` and a value already in the
 * gradient form come back as given; a value that is no hex color gets itself
 * as both ends.
 */
export function watchGradientOf(hex: string): string {
  const trimmed = hex.trim();
  if (trimmed === "#RAINBOW" || isGradientToken(trimmed)) return hex;
  const base = normalizedHex(trimmed);
  const end = hueShiftedHex(base, 150) ?? base;
  return `${GRADIENT_PREFIX}${normalizedHex(base)}|${normalizedHex(end)}`;
}

// ── themes ───────────────────────────────────────────────────────────────

function themeTable(name: string): ThemeTable {
  return own(TABLE.themes, name) ?? TABLE.themes[TABLE.addFallbackTheme]!;
}

/** The theme names in the phone's order. */
export function watchThemeNames(): string[] {
  return TABLE.themeOrder.slice();
}

/** The name a person sees for a theme ("Neon Lagoon"), or the name itself
 * for a theme the app does not have. */
export function watchThemeDisplayName(theme: string): string {
  return own(TABLE.themes, theme)?.displayName ?? theme;
}

/** Whether the app has a theme by this exact name. */
export function isWatchThemeName(theme: unknown): theme is string {
  return typeof theme === "string" && Object.hasOwn(TABLE.themes, theme);
}

/**
 * The theme an add colors with: the page's `themeOverride` when the app has
 * a theme by that exact name, else `sunnyBeachDay` (the phone's add falls back
 * there, although the watch falls back to `neonLagoon`).
 */
export function watchAddThemeOf(page: WatchPage | undefined): string {
  const name = page?.themeOverride;
  return isWatchThemeName(name) ? name : TABLE.addFallbackTheme;
}

/** Whether an add on this page writes colors in the gradient form. */
export function watchAddUsesGradient(page: WatchPage | undefined): boolean {
  return page?.useGradientColors === true;
}

/** Role name (`entityLight` and the rest) to the theme's color, in the
 * gradient form when asked. An unknown theme reads as the add fallback. */
export function watchThemeRoleColors(theme: string, gradient = false): Record<string, string> {
  const t = themeTable(theme);
  return { ...(gradient ? t.gradientRoles : t.roles) };
}

/** A theme's swatches in the phone's order, solid or in the gradient form.
 * An unknown theme reads as the add fallback. */
export function watchThemeSwatches(theme: string, gradient = false): string[] {
  const t = themeTable(theme);
  return (gradient ? t.expandedSwatchGradients : t.expandedSwatchHexes).slice();
}

/** One role's color in a theme, gradient when asked. */
function roleColor(theme: string, role: string, gradient: boolean): string | undefined {
  const t = themeTable(theme);
  const solid = own(t.roles, role);
  if (solid === undefined) return undefined;
  return gradient ? (own(t.gradientRoles, role) ?? watchGradientOf(solid)) : solid;
}

// ── calendar color ───────────────────────────────────────────────────────

/**
 * The color a new calendar tile gives its calendar (`calendarSourceColors`):
 * djb2 over the entity id's Unicode scalars in signed 64 bit arithmetic that
 * wraps (start 5381, then `hash * 33 + scalar`), its magnitude modulo the
 * swatch count, into the `sunnyBeachDay` swatches. Never the page theme.
 */
export function watchCalendarColor(entityId: string): string {
  const swatches = themeTable(TABLE.calendar.swatchTheme).expandedSwatchHexes;
  if (swatches.length === 0) return "#5E97F6";
  let hash = 5381n;
  for (const ch of entityId) {
    hash = BigInt.asIntN(64, (hash << 5n) + hash + BigInt(ch.codePointAt(0)!));
  }
  const magnitude = hash < 0n ? -hash : hash;
  return normalizedHex(swatches[Number(magnitude % BigInt(swatches.length))]!);
}

// ── labels ───────────────────────────────────────────────────────────────

/** Letters that have a title case form of their own (the Latin digraphs). */
const TITLE_CASE: Readonly<Record<string, string>> = {
  "Ǆ": "ǅ",
  "ǅ": "ǅ",
  "ǆ": "ǅ",
  "Ǉ": "ǈ",
  "ǈ": "ǈ",
  "ǉ": "ǈ",
  "Ǌ": "ǋ",
  "ǋ": "ǋ",
  "ǌ": "ǋ",
  "Ǳ": "ǲ",
  "ǲ": "ǲ",
  "ǳ": "ǲ",
};

function titleCase(ch: string): string {
  const digraph = TITLE_CASE[ch];
  if (digraph !== undefined) return digraph;
  const upper = [...ch.toUpperCase()];
  // "ß" upper cases to "SS"; its title case is "Ss".
  return upper[0]! + upper.slice(1).join("").toLowerCase();
}

/**
 * Foundation's `capitalized`, as the label samples show it: a letter right
 * after anything that is not a letter (a space, digit, dot, hyphen, the
 * start) takes its title case, every other letter its lower case. An
 * apostrophe does not end a word ("o'brien" is "O'brien"), and a combining
 * mark counts as a letter. Everything else is kept.
 */
function capitalized(text: string): string {
  let out = "";
  let inWord = false;
  for (const ch of text) {
    if (ch === "'" || ch === "’") {
      out += ch;
      continue;
    }
    const letter = /^[\p{L}\p{M}]$/u.test(ch);
    if (letter) out += inWord ? ch.toLowerCase() : titleCase(ch);
    else out += ch;
    inWord = letter;
  }
  return out;
}

/**
 * The label a new entity tile stores (`customLabel`): the friendly name when
 * it is not empty, else the object id (after the first dot) with `_` as
 * spaces, capitalized the way Foundation does it ("tv2go" reads "Tv2Go",
 * "hi-fi" reads "Hi-Fi"). `assist` and `speak_message` tiles are always
 * "Assist" and "Speak".
 */
export function watchEntityLabel(entityId: string, friendlyName?: string, picker?: string): string {
  const kind = picker ?? tileKind(entityId);
  if (kind === "assist") return TABLE.label.assist;
  if (kind === "speak_message" || kind === "speakMessage") return TABLE.label.speak_message;
  if (friendlyName !== undefined && friendlyName !== "") return friendlyName;
  return capitalized(tileTarget(entityId).replaceAll("_", " "));
}

// ── entity defaults ──────────────────────────────────────────────────────

/** What a new entity tile is built from: the entity, the picker it came
 * through, and what Home Assistant knows of it. `watchEntityAddFromHass`
 * fills it from the frontend's `hass`. */
export interface WatchEntityAdd {
  entityId: string;
  /** Home Assistant's friendly name; absent or empty means none. */
  friendlyName?: string;
  /** The phone's picker (`EntityDomain`) the add goes through, which decides
   * the extra keys (`addable[].routes[].picker`). Absent: the domain's
   * preferred route. */
  picker?: string;
  /** The entity's state, present only when Home Assistant has the entity. */
  state?: string;
  attributes?: { device_class?: unknown };
  /** A `media_player` that stands in for a TV remote: `device_class` `tv`
   * and no `remote.` entity with the same object id. */
  tvRemote?: boolean;
  /** For a `remote.`: every entity id on its device, in registry order. */
  deviceEntityIds?: readonly string[];
}

/** Swift's `Double(text)`: a decimal or hex floating point number, `inf`,
 * `infinity` or `nan`, with an optional sign and nothing around it. Anything
 * else, an empty text included, is not a number. */
function swiftDouble(text: string): number | undefined {
  if (/^[+-]?(?:[0-9]+\.?[0-9]*|\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/.test(text)) return Number(text);
  const special = /^([+-]?)(inf|infinity|nan)$/i.exec(text);
  if (special) {
    if (special[2]!.toLowerCase() === "nan") return NaN;
    return special[1] === "-" ? -Infinity : Infinity;
  }
  const hex = /^([+-]?)0[xX]([0-9a-fA-F]*)(?:\.([0-9a-fA-F]*))?(?:[pP]([+-]?[0-9]+))?$/.exec(text);
  if (hex && (hex[2]! + (hex[3] ?? "")).length > 0) {
    const whole = hex[2]! + (hex[3] ?? "");
    const mantissa = parseInt(whole, 16) / 16 ** (hex[3] ?? "").length;
    const value = mantissa * 2 ** Number(hex[4] ?? "0");
    return hex[1] === "-" ? -value : value;
  }
  return undefined;
}

function inBand(value: number | undefined, band: SensorBand): boolean {
  if (value === undefined) return false;
  return (band.atLeast === undefined || value >= band.atLeast) && (band.below === undefined || value < band.below);
}

/** Icon and color from the `sensorState` rules, for a domain with
 * `stateRules` whose state Home Assistant has. */
function stateLook(domain: string, state: string, deviceClass: unknown): { icon?: string; color?: string } | undefined {
  const rules = TABLE.sensorState;
  const base = own(rules.byDomain, domain);
  if (base === undefined) return undefined;
  let cls = typeof deviceClass === "string" ? deviceClass : "";
  if (rules.deviceClassIgnoresCase) cls = cls.toLowerCase();
  const spec = cls === "" ? undefined : own(rules.deviceClasses, cls);
  if (spec === undefined) return { icon: base.icon, color: base.hex };
  if (spec.iconBands !== undefined || spec.hexBands !== undefined) {
    const value = swiftDouble(state);
    const icon = spec.iconBands?.find((b) => inBand(value, b))?.icon ?? spec.otherIcon ?? base.icon;
    const color = spec.hexBands?.find((b) => inBand(value, b))?.hex ?? spec.otherHex ?? base.hex;
    return { icon, color };
  }
  return { icon: spec.icon ?? base.icon, color: spec.hex ?? base.hex };
}

/**
 * The icon and color a new entity tile gets (`defaultsForEntity`), from the
 * table row of the entity's domain: the icon (`appleIcon` when the entity id
 * contains "apple" in any case), and the page theme's role color, in the
 * gradient form on a `useGradientColors` page, or a fixed color never in the
 * gradient form. A TV `media_player` takes its `tvRemote` row. `sensor`,
 * `binary_sensor` and `counter` with a known state take both from
 * `device_class` and the state, as fixed colors. A domain with neither gives
 * neither (undefined).
 */
export function watchEntityDefaults(
  add: WatchEntityAdd,
  page: WatchPage | undefined,
): { icon: string | undefined; color: string | undefined } {
  const domain = tileKind(add.entityId);
  const spec = own(TABLE.domains, domain);
  if (spec === undefined) {
    return { icon: TABLE.otherDomains.icon ?? undefined, color: TABLE.otherDomains.color ?? undefined };
  }
  if (spec.stateRules === true && add.state !== undefined) {
    const look = stateLook(domain, add.state, add.attributes?.device_class);
    if (look !== undefined) return { icon: look.icon, color: look.color };
  }
  const look: DomainLook = add.tvRemote === true && spec.tvRemote !== undefined ? spec.tvRemote : spec;
  const apple = look.appleIcon !== undefined && add.entityId.toLowerCase().includes("apple");
  const icon = apple ? look.appleIcon : (look.icon ?? undefined);
  let color: string | undefined;
  if (look.role !== undefined) color = roleColor(watchAddThemeOf(page), look.role, watchAddUsesGradient(page));
  else if (look.hex !== undefined) color = look.hex;
  return { icon, color };
}

// ── what can be added ────────────────────────────────────────────────────

/** The route an add follows: the first route of the domain through this
 * picker, else (no picker) the preferred one. */
function routeFor(domain: string, picker: string | undefined): AddRoute | undefined {
  const routes = TABLE.addable.find((a) => a.domain === domain)?.routes;
  if (routes === undefined) return undefined;
  if (picker !== undefined) return routes.find((r) => r.picker === picker);
  return routes.find((r) => r.preferred === true) ?? routes[0];
}

export interface WatchAddableDomain {
  domain: string;
  /** The plain name of the domain for the picker ("Lights", "Media
   * Players"): the name of the domain's preferred route. */
  name: string;
  /** The picker of that route. */
  picker: string;
}

/** Whether an entity id's domain can be added as a tile (the table's
 * `addable`), with its picker name; undefined when it cannot. */
export function watchAddableDomain(entityId: string): WatchAddableDomain | undefined {
  const domain = tileKind(entityId);
  const route = routeFor(domain, undefined);
  return route === undefined ? undefined : { domain, name: route.name, picker: route.picker };
}

/** The entity ids among `states` (in their order) that can still be added to
 * the page: an addable domain, and no tile on the page with that exact
 * `entityId`. */
export function watchAddableEntityIds(page: WatchPage, states: Readonly<Record<string, unknown>>): string[] {
  const onPage = new Set(watchPageTiles(page).map(tileEntityId));
  return Object.keys(states).filter((id) => !onPage.has(id) && watchAddableDomain(id) !== undefined);
}

/**
 * The pages a go to page link (`pageLink`) or a peek link (`peekLink`) on
 * this page may point at, in stored order: every page but this one and the
 * system pages, and hidden pages only for a peek link. Smart pages are
 * offered.
 */
export function watchLinkTargetPages(
  document: WatchPagesDocument,
  pageId: string,
  kind: "pageLink" | "peekLink",
): WatchPage[] {
  return watchPagesOf(document).filter(
    (p) => !sameWatchId(p.id, pageId) && !isSystemWatchPage(p) && (kind === "peekLink" || !isHiddenWatchPage(p)),
  );
}

// ── Home Assistant ───────────────────────────────────────────────────────

/** What the builder needs of the frontend's `hass`: `states`, and the entity
 * registry (`hass.entities`) for a remote's device. */
export interface WatchHassView {
  states: Readonly<Record<string, { state?: unknown; attributes?: Readonly<Record<string, unknown>> } | undefined>>;
  entities?: Readonly<Record<string, { device_id?: string | null } | undefined>>;
}

/**
 * The builder's input for an entity, from `hass`: the friendly name (a
 * `friendly_name` that is empty or equals the entity id counts as none), the
 * state and `device_class` when Home Assistant has the entity, whether a
 * `media_player` stands in for a TV remote (`device_class` exactly `tv`, and
 * no `remote.` with the same object id in `states`), and for a `remote.`
 * every entity id on its device in registry order.
 */
export function watchEntityAddFromHass(hass: WatchHassView, entityId: string, picker?: string): WatchEntityAdd {
  const add: WatchEntityAdd = { entityId };
  const entity = Object.hasOwn(hass.states, entityId) ? hass.states[entityId] : undefined;
  const attributes = entity?.attributes;
  const friendly = attributes?.friendly_name;
  if (typeof friendly === "string" && friendly !== "" && friendly !== entityId) add.friendlyName = friendly;
  if (picker !== undefined) add.picker = picker;
  if (entity !== undefined) {
    add.state = typeof entity.state === "string" ? entity.state : "";
    add.attributes = typeof attributes?.device_class === "string" ? { device_class: attributes.device_class } : {};
  }
  const domain = tileKind(entityId);
  if (
    domain === "media_player" &&
    attributes?.device_class === "tv" &&
    !Object.hasOwn(hass.states, `remote.${tileTarget(entityId)}`)
  ) {
    add.tvRemote = true;
  }
  if (domain === "remote" && hass.entities !== undefined) {
    const device = Object.hasOwn(hass.entities, entityId) ? hass.entities[entityId]?.device_id : undefined;
    if (typeof device === "string" && device !== "") {
      add.deviceEntityIds = Object.keys(hass.entities).filter((id) => hass.entities![id]?.device_id === device);
    }
  }
  return add;
}

// ── builders ─────────────────────────────────────────────────────────────

/**
 * A new entity tile (`addEntityByDomain`): the fresh keys, `entityId`,
 * `icon` and `color` from `watchEntityDefaults` (each only when there is
 * one), `customLabel` from `watchEntityLabel`, size 6 by 4, and the extra
 * keys of the picker's route: `cameraDisplayMode: "preview"` for a camera,
 * `calendarSourceColors` for a calendar, `associatedMediaPlayerId` (the
 * first `media_player.` on the device) for a remote when there is one. No
 * `singleTapAction`, no `capabilities`. Placed at row 0, column 0; the add
 * places it.
 */
export function newWatchEntityTile(
  add: WatchEntityAdd,
  page: WatchPage | undefined,
  options?: WatchEditOptions,
): WatchPageTile {
  const domain = tileKind(add.entityId);
  const route = routeFor(domain, add.picker);
  const { icon, color } = watchEntityDefaults(add, page);
  const fields: JsonObject = {
    id: newIdFrom(options),
    entityId: add.entityId,
    customLabel: watchEntityLabel(add.entityId, add.friendlyName, add.picker),
    colSpan: TABLE.tile.colSpan,
    rowSpan: TABLE.tile.rowSpan,
  };
  if (icon !== undefined) fields.icon = icon;
  if (color !== undefined) fields.color = color;
  if (route !== undefined) {
    Object.assign(fields, structuredClone(route.extras));
    if (route.writesCalendarSourceColor === true) {
      fields.calendarSourceColors = { [add.entityId]: watchCalendarColor(add.entityId) };
    }
    if (route.linksDeviceMediaPlayer === true) {
      const player = add.deviceEntityIds?.find((id) => id.startsWith("media_player."));
      if (player !== undefined) fields.associatedMediaPlayerId = player;
    }
  }
  return freshTile(fields);
}

/** A new spacer: `spacer.<new id>` (that id made first), then its own tile
 * id, `showLabel` false, 6 by 4, no icon, color or label. */
export function newWatchSpacerTile(options?: WatchEditOptions): WatchPageTile {
  const spec = TABLE.spacer;
  const entityId = `${spec.entityIdPrefix}${newIdFrom(options)}`;
  return freshTile({
    id: newIdFrom(options),
    entityId,
    showLabel: spec.showLabel,
    colSpan: spec.colSpan,
    rowSpan: spec.rowSpan,
  });
}

/** A new header: `divider.line.custom`, 12 by 1, `showLabel` false, the fixed
 * color `#CCD8E6`, no icon, no label. */
export function newWatchHeaderTile(options?: WatchEditOptions): WatchPageTile {
  const spec = TABLE.header;
  return freshTile({
    id: newIdFrom(options),
    entityId: spec.entityId,
    showLabel: spec.showLabel,
    colSpan: spec.colSpan,
    rowSpan: spec.rowSpan,
    color: spec.color,
  });
}

/** A link target: a page, or any `{id, name}`. */
export interface WatchLinkTarget {
  id?: unknown;
  name?: unknown;
}

function newLinkTile(spec: LinkSpec, target: WatchLinkTarget, page: WatchPage | undefined, options?: WatchEditOptions) {
  const targetId = typeof target.id === "string" ? target.id.toUpperCase() : "";
  const fields: JsonObject = {
    id: newIdFrom(options),
    entityId: `${spec.entityIdPrefix}${targetId}`,
    icon: spec.icon,
    // A page with no name is "Page" on the phone, and its links say so.
    customLabel: typeof target.name === "string" ? target.name : "Page",
    colSpan: TABLE.tile.colSpan,
    rowSpan: TABLE.tile.rowSpan,
  };
  const color = roleColor(watchAddThemeOf(page), spec.role, watchAddUsesGradient(page));
  if (color !== undefined) fields.color = color;
  return freshTile(fields);
}

/** A new go to page tile: `page.<target id>` (upper case), its icon, the
 * page theme's page color (gradient on a gradient page), the target's name
 * as `customLabel` as it is now (`"Page"` for a page with none), 6 by 4. */
export function newWatchPageLinkTile(
  target: WatchLinkTarget,
  page: WatchPage | undefined,
  options?: WatchEditOptions,
): WatchPageTile {
  return newLinkTile(TABLE.pageLink, target, page, options);
}

/** A new peek page tile: as a go to page tile, with `show_page.` and the peek
 * icon. */
export function newWatchPeekLinkTile(
  target: WatchLinkTarget,
  page: WatchPage | undefined,
  options?: WatchEditOptions,
): WatchPageTile {
  return newLinkTile(TABLE.peekLink, target, page, options);
}

/** One add, in the shape the case files use. */
export type WatchTileAdd =
  | ({ kind: "entity" } & WatchEntityAdd)
  | { kind: "spacer" }
  | { kind: "header" }
  | { kind: "pageLink"; page: WatchLinkTarget }
  | { kind: "peekLink"; page: WatchLinkTarget };

/** The new tile for an add, colored for `page`. */
export function newWatchTile(add: WatchTileAdd, page: WatchPage | undefined, options?: WatchEditOptions): WatchPageTile {
  switch (add.kind) {
    case "entity":
      return newWatchEntityTile(add, page, options);
    case "spacer":
      return newWatchSpacerTile(options);
    case "header":
      return newWatchHeaderTile(options);
    case "pageLink":
      return newWatchPageLinkTile(add.page, page, options);
    case "peekLink":
      return newWatchPeekLinkTile(add.page, page, options);
  }
}

// ── adding ───────────────────────────────────────────────────────────────

/**
 * Why an add is refused:
 * - `noPage`: no page has this id.
 * - `systemPage`: the page is a system page.
 * - `smartPage`: the page is a smart page, which the watch fills itself.
 * - `badItems`: the page's `items` is there but is not a list, so an add
 *   would lose it.
 * - `onPage`: the page already holds a tile for this entity.
 */
export type WatchAddRefusal = "noPage" | "systemPage" | "smartPage" | "badItems" | "onPage";

/** Kinds that may sit on a page more than once (the phone checks nothing
 * for these). */
const REPEATABLE_KINDS: ReadonlySet<string> = new Set([
  "spacer",
  "divider",
  "page",
  "show_page",
  "assist",
  "speak_message",
  "http_action",
  "macro",
]);

/** The first page with this id, system pages included, with its place. */
function pageIndex(document: WatchPagesDocument, pageId: string): number {
  const pages = document.pages;
  if (!Array.isArray(pages)) return -1;
  return pages.findIndex((p) => isJsonObject(p) && sameWatchId(p.id, pageId));
}

/** The entity id an add will write, as far as the refusal needs it (a
 * spacer's own id is not known yet and does not matter). */
export function watchAddEntityId(add: WatchTileAdd): string {
  switch (add.kind) {
    case "entity":
      return add.entityId;
    case "spacer":
      return TABLE.spacer.entityIdPrefix;
    case "header":
      return TABLE.header.entityId;
    case "pageLink":
    case "peekLink": {
      const spec = add.kind === "pageLink" ? TABLE.pageLink : TABLE.peekLink;
      return `${spec.entityIdPrefix}${typeof add.page.id === "string" ? add.page.id.toUpperCase() : ""}`;
    }
  }
}

/**
 * Whether a tile with this entity id can be added to the page, and if not
 * why (`WatchAddRefusal`): the page must exist, be no system page and no
 * smart page, and, for an entity tile, hold no tile with the same `entityId`
 * (compared exactly, as on the phone). Spacers, headers, page links and the
 * app's assist, speak, HTTP and macro tiles may repeat. Undefined means it
 * can.
 */
export function watchAddRefusal(document: WatchPagesDocument, pageId: string, entityId: string): WatchAddRefusal | undefined {
  const index = pageIndex(document, pageId);
  if (index < 0) return "noPage";
  const page = (document.pages as unknown[])[index] as WatchPage;
  if (isSystemWatchPage(page)) return "systemPage";
  if (isSmartWatchPage(page)) return "smartPage";
  if (page.items !== undefined && !Array.isArray(page.items)) return "badItems";
  if (!REPEATABLE_KINDS.has(tileKind(entityId)) && watchPageTiles(page).some((t) => t.entityId === entityId)) {
    return "onPage";
  }
  return undefined;
}

/**
 * Add a built tile to a page: at the first free place for its size
 * (`firstFreeWatchCell`, which writes `gridRow` and `gridCol`), appended to
 * `items` (made when the page has none). Refused, returning the very
 * document it was given, for every reason of `watchAddRefusal`. Only the
 * document, `pages`, the page and its `items` are new objects.
 */
export function addWatchTile(document: WatchPagesDocument, pageId: string, tile: WatchPageTile): WatchPagesDocument {
  if (watchAddRefusal(document, pageId, tileEntityId(tile)) !== undefined) return document;
  const pages = document.pages as unknown[];
  const index = pageIndex(document, pageId);
  const page = pages[index] as WatchPage;
  const items = Array.isArray(page.items) ? page.items : [];
  const cell = firstFreeWatchCell(page, Number(tile.colSpan ?? 1), Number(tile.rowSpan ?? 1));
  const placed: WatchPageTile = { ...tile, gridCol: cell.col, gridRow: cell.row };
  const nextPages = pages.slice();
  nextPages[index] = { ...page, items: [...items, placed] };
  return { ...document, pages: nextPages };
}

export interface WatchTileAddResult {
  /** The new document, or the one given when refused. */
  document: WatchPagesDocument;
  /** The tile as placed, when added. */
  tile?: WatchPageTile;
  refusal?: WatchAddRefusal;
}

/**
 * Check, build and add in one step: refused first (no id is made then), else
 * the tile from `newWatchTile` colored for the page, then `addWatchTile`.
 */
export function addNewWatchTile(
  document: WatchPagesDocument,
  pageId: string,
  add: WatchTileAdd,
  options?: WatchEditOptions,
): WatchTileAddResult {
  const refusal = watchAddRefusal(document, pageId, watchAddEntityId(add));
  if (refusal !== undefined) return { document, refusal };
  const page = (document.pages as unknown[])[pageIndex(document, pageId)] as WatchPage;
  const next = addWatchTile(document, pageId, newWatchTile(add, page, options));
  const placedOn = (next.pages as unknown[])[pageIndex(next, pageId)] as WatchPage;
  const tiles = placedOn.items as unknown[];
  return { document: next, tile: tiles[tiles.length - 1] as WatchPageTile };
}
