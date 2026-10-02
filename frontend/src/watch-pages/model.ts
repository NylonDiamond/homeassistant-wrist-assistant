// The watch's page config as Home Assistant keeps it, without any drawing.
//
// The document is the one the iPhone app encodes for its `GridConfiguration`
// and uploads as the `pages` kind: `{"schemaVersion": 1, "pages": [...]}`.
// A page holds tiles (`items`), each placed on a 12 column grid, and about 150
// keys per tile that only the phone understands today.
//
// The rule that shapes this file: the panel never rebuilds a document. It
// keeps the parsed JSON as it came and reads it through the functions here,
// so every key it does not know goes back exactly as it was read. An edit
// replaces only the objects on the path to the key it changes, and a model
// with no edit encodes to the very document it was opened with.
//
// The word `pages` already means complication pages in `../model.ts`, so
// everything here is named `watchPages` / `WatchPage`.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md.

import type { HassEntityState } from "../ha-api.js";

export type JsonObject = Record<string, unknown>;

/** The whole document. Every field is `unknown` because it is parsed JSON
 * that nothing has checked; the readers below decide what to make of it. */
export interface WatchPagesDocument {
  schemaVersion?: unknown;
  pages?: unknown;
  [key: string]: unknown;
}

/** One page, as stored. `dynamicConfig` present makes it a smart page whose
 * tiles the watch builds itself, and its `items` is then empty. */
export interface WatchPage {
  id?: unknown;
  name?: unknown;
  items?: unknown;
  groups?: unknown;
  isHidden?: unknown;
  isSystemPage?: unknown;
  dynamicConfig?: unknown;
  backgroundColor?: unknown;
  themeOverride?: unknown;
  fullScreen?: unknown;
  [key: string]: unknown;
}

/** One tile, as stored. There is no type field: the kind of a tile is the
 * part of `entityId` before the first dot. */
export interface WatchPageTile {
  id?: unknown;
  entityId?: unknown;
  gridCol?: unknown;
  gridRow?: unknown;
  colSpan?: unknown;
  rowSpan?: unknown;
  icon?: unknown;
  color?: unknown;
  customLabel?: unknown;
  showLabel?: unknown;
  [key: string]: unknown;
}

/** The watch's columns. Every grid density the app has is 12 columns. */
export const WATCH_GRID_COLUMNS = 12;
/** Points between two grid units, across and down. */
export const WATCH_GRID_SPACING = 2;
/** Points the grid starts below the top of the screen, for the clock, unless
 * the page is full screen. `WatchScreenMetrics.gridTopInset` in the app. */
export const WATCH_GRID_TOP_INSET = 34;
/** The most the phone sends the watch in one sync, before compression. A
 * document near this will not reach the watch whole. */
export const WATCH_SYNC_LIMIT_BYTES = 250_000;

export function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** The document itself when it is a JSON object, else undefined. Nothing is
 * copied: the model holds what was parsed. */
export function asWatchPagesDocument(value: unknown): WatchPagesDocument | undefined {
  return isJsonObject(value) ? value : undefined;
}

/** The pages in watch order. Anything in the array that is not an object is
 * skipped here and left where it is in the document. */
export function watchPagesOf(document: WatchPagesDocument | undefined): WatchPage[] {
  const pages = document?.pages;
  return Array.isArray(pages) ? pages.filter(isJsonObject) : [];
}

/** A page's tiles in stored order, which is also the order they are drawn
 * in: a later tile is drawn over an earlier one where they overlap. */
export function watchPageTiles(page: WatchPage | undefined): WatchPageTile[] {
  const items = page?.items;
  return Array.isArray(items) ? items.filter(isJsonObject) : [];
}

export function watchPageId(page: WatchPage): string {
  return typeof page.id === "string" ? page.id : "";
}

/** The page's name, or "Untitled page" when it has none. */
export function watchPageName(page: WatchPage): string {
  const name = typeof page.name === "string" ? page.name.trim() : "";
  return name === "" ? "Untitled page" : name;
}

export function isHiddenWatchPage(page: WatchPage): boolean {
  return page.isHidden === true;
}

export function isSystemWatchPage(page: WatchPage): boolean {
  return page.isSystemPage === true;
}

/** A smart page is one the watch fills itself from `dynamicConfig`. */
export function isSmartWatchPage(page: WatchPage): boolean {
  return isJsonObject(page.dynamicConfig);
}

/** The Home Assistant domains a smart page fills itself from, in rule order,
 * each once. Empty for a page that is not smart. */
export function smartPageDomains(page: WatchPage): string[] {
  const config = page.dynamicConfig;
  if (!isJsonObject(config) || !Array.isArray(config.rules)) return [];
  const out: string[] = [];
  for (const rule of config.rules) {
    const domain = isJsonObject(rule) && typeof rule.domain === "string" ? rule.domain : "";
    if (domain !== "" && !out.includes(domain)) out.push(domain);
  }
  return out;
}

// ── tile kinds ─────────────────────────────────────────────────────────────

export function tileEntityId(tile: WatchPageTile): string {
  return typeof tile.entityId === "string" ? tile.entityId : "";
}

/** The part of an entity id before the first dot: a Home Assistant domain
 * for an entity tile, or one of the app's own kinds (`page`, `spacer`, ...). */
export function tileKind(entityId: string): string {
  const dot = entityId.indexOf(".");
  return dot < 0 ? entityId : entityId.slice(0, dot);
}

/** The part after the first dot: the entity's object id, or the id of what a
 * virtual tile points at (a page's id for `page.` and `show_page.`). */
export function tileTarget(entityId: string): string {
  const dot = entityId.indexOf(".");
  return dot < 0 ? "" : entityId.slice(dot + 1);
}

/** The app's own tile kinds, which are not Home Assistant entities. */
export const VIRTUAL_TILE_KINDS: Readonly<Record<string, string>> = {
  page: "Go to page",
  show_page: "Peek page",
  status_page: "Status page",
  http_action: "HTTP action",
  macro: "Macro",
  template: "Template",
  spacer: "Spacer",
  multicam: "Multi camera",
  point_control: "Point control",
  music_hub: "Music hub",
  assist: "Assist",
  speak_message: "Speak message",
  webhook_inbox: "Webhook inbox",
  divider: "Header",
};

/** The Home Assistant domains a tile is likely to hold, by plain name. A
 * domain missing here is still an entity tile when Home Assistant has the
 * entity; see `tileClass`. */
const DOMAIN_LABELS: Readonly<Record<string, string>> = {
  alarm_control_panel: "Alarm",
  automation: "Automation",
  binary_sensor: "Binary sensor",
  button: "Button",
  calendar: "Calendar",
  camera: "Camera",
  climate: "Climate",
  counter: "Counter",
  cover: "Cover",
  device_tracker: "Device tracker",
  event: "Event",
  fan: "Fan",
  humidifier: "Humidifier",
  image: "Image",
  input_boolean: "Toggle",
  input_button: "Button",
  input_datetime: "Date and time",
  input_number: "Number",
  input_select: "Choice",
  input_text: "Text",
  lawn_mower: "Lawn mower",
  light: "Light",
  lock: "Lock",
  media_player: "Media player",
  number: "Number",
  person: "Person",
  remote: "Remote",
  scene: "Scene",
  script: "Script",
  select: "Choice",
  sensor: "Sensor",
  siren: "Siren",
  sun: "Sun",
  switch: "Switch",
  text: "Text",
  timer: "Timer",
  todo: "To-do list",
  update: "Update",
  vacuum: "Vacuum",
  valve: "Valve",
  water_heater: "Water heater",
  weather: "Weather",
  zone: "Zone",
};

/** The plural names the app gives the domains a smart page can list. */
const SMART_DOMAIN_LABELS: Readonly<Record<string, string>> = {
  light: "Lights",
  switch: "Switches",
  fan: "Fans",
  input_boolean: "Input booleans",
  automation: "Automations",
  cover: "Covers",
  valve: "Valves",
  lock: "Locks",
  climate: "Climate",
  media_player: "Media players",
  vacuum: "Vacuums",
  humidifier: "Humidifiers",
  water_heater: "Water heaters",
  remote: "Remotes",
  siren: "Sirens",
  binary_sensor: "Binary sensors",
  sensor: "Sensors",
  alarm_control_panel: "Alarm panels",
};

export function isVirtualTileKind(kind: string): boolean {
  return Object.hasOwn(VIRTUAL_TILE_KINDS, kind);
}

/** "media_player" as "Media player": what a kind with no name of its own is
 * called. */
function humanize(word: string): string {
  const spaced = word.replace(/_/g, " ").trim();
  return spaced === "" ? "" : spaced[0]!.toUpperCase() + spaced.slice(1);
}

/** A tile kind in plain words: the app's name for its own kinds, a plain name
 * for a known Home Assistant domain, else the kind itself made readable. */
export function tileKindLabel(kind: string): string {
  if (isVirtualTileKind(kind)) return VIRTUAL_TILE_KINDS[kind]!;
  return DOMAIN_LABELS[kind] ?? (humanize(kind) || "Tile");
}

/** A domain as a smart page's note lists it. */
export function smartDomainLabel(domain: string): string {
  return SMART_DOMAIN_LABELS[domain] ?? humanize(domain);
}

/**
 * How the preview draws a tile:
 *
 * - `divider`: a header row, a line or a label across the grid.
 * - `spacer`: an empty place.
 * - `virtual`: one of the app's own kinds, drawn as a tile with its kind.
 * - `entity`: a Home Assistant entity, by a known domain or by being in
 *   `states`.
 * - `unknown`: neither, so a neutral tile that names the kind.
 */
export type WatchTileClass = "divider" | "spacer" | "virtual" | "entity" | "unknown";

export function tileClass(entityId: string, states?: Readonly<Record<string, unknown>>): WatchTileClass {
  const kind = tileKind(entityId);
  if (kind === "divider") return "divider";
  if (kind === "spacer") return "spacer";
  if (isVirtualTileKind(kind)) return "virtual";
  if (Object.hasOwn(DOMAIN_LABELS, kind) || (states !== undefined && Object.hasOwn(states, entityId))) return "entity";
  return "unknown";
}

/** A header's look, read from `divider.<style>.<domain>[.g<NN>]`. `glow` is
 * 0 to 1. A style other than `label` is drawn as a line, as the watch does. */
export function dividerParts(entityId: string): { style: "line" | "label"; domain: string; glow: number } {
  const parts = entityId.split(".");
  const style = parts[1] === "label" ? "label" : "line";
  let glow = 0;
  for (const part of parts.slice(1)) {
    const m = /^g(\d+)$/.exec(part);
    if (m) glow = Math.min(1, Number(m[1]) / 100);
  }
  return { style, domain: parts[2] ?? "", glow };
}

/** The SF Symbol a kind is drawn with when its tile names none: the app's
 * own choice for the smart page domains, and a plain one for its own kinds. */
const DEFAULT_SYMBOLS: Readonly<Record<string, string>> = {
  light: "lightbulb.fill",
  switch: "switch.2",
  fan: "fan.fill",
  input_boolean: "togglepower",
  automation: "gearshape.2.fill",
  cover: "blinds.vertical.open",
  valve: "spigot.fill",
  lock: "lock.fill",
  climate: "thermometer.medium",
  media_player: "hifispeaker.fill",
  vacuum: "fan.floor.fill",
  humidifier: "humidity.fill",
  water_heater: "flame.fill",
  remote: "av.remote.fill",
  siren: "speaker.wave.3.fill",
  binary_sensor: "sensor.fill",
  sensor: "chart.line.uptrend.xyaxis",
  alarm_control_panel: "shield.fill",
  camera: "video.fill",
  scene: "sparkles",
  script: "scroll.fill",
  person: "person.fill",
  weather: "cloud.sun.fill",
  page: "arrow.right.circle.fill",
  show_page: "eye.fill",
  status_page: "list.bullet.rectangle",
  http_action: "network",
  macro: "list.bullet",
  template: "curlybraces",
  multicam: "video.fill",
  point_control: "hand.point.up.left.fill",
  music_hub: "music.note.house.fill",
  assist: "microphone.fill",
  speak_message: "speaker.wave.2.fill",
  webhook_inbox: "tray.fill",
};

/** The SF Symbol a tile is drawn with: its own, else its kind's. Undefined
 * when neither says. */
export function tileSymbol(tile: WatchPageTile): string | undefined {
  const own = typeof tile.icon === "string" ? tile.icon.trim() : "";
  if (own !== "") return own;
  return DEFAULT_SYMBOLS[tileKind(tileEntityId(tile))];
}

// ── labels and state ─────────────────────────────────────────────────────

/**
 * The words a tile shows as its name.
 *
 * A custom label first. Then, for an entity, its friendly name in Home
 * Assistant, else its entity id. A header with no label is named after its
 * domain, as the watch names it. A page link is named after the page it opens
 * when that page is in `pages`. Any other virtual kind is named by its kind.
 */
export function tileLabel(
  tile: WatchPageTile,
  states?: Readonly<Record<string, HassEntityState>>,
  pages?: readonly WatchPage[],
): string {
  const custom = typeof tile.customLabel === "string" ? tile.customLabel.trim() : "";
  if (custom !== "") return custom;
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  if (kind === "divider") {
    const { domain } = dividerParts(entityId);
    return domain === "" || domain === "custom" ? "" : smartDomainLabel(domain);
  }
  if (kind === "page" || kind === "show_page") {
    const target = tileTarget(entityId).toUpperCase();
    const page = pages?.find((p) => watchPageId(p).toUpperCase() === target);
    if (page) return watchPageName(page);
  }
  if (isVirtualTileKind(kind)) return tileKindLabel(kind);
  const name = states?.[entityId]?.attributes?.friendly_name;
  if (typeof name === "string" && name.trim() !== "") return name.trim();
  return entityId;
}

/** Whether the tile draws its name. Absent means it does. */
export function tileShowsLabel(tile: WatchPageTile): boolean {
  return tile.showLabel !== false;
}

/**
 * One line of what an entity is doing now, from Home Assistant's state: the
 * state with its unit when it has one ("21.5 °C"), else the state in plain
 * words ("Unlocked", "Armed away"). Undefined for a tile that is not an
 * entity, and "Not found" for an entity Home Assistant does not have.
 */
export function tileStateText(
  tile: WatchPageTile,
  states?: Readonly<Record<string, HassEntityState>>,
): string | undefined {
  const entityId = tileEntityId(tile);
  if (tileClass(entityId, states) !== "entity") return undefined;
  const entity = states?.[entityId];
  if (entity === undefined) return states === undefined ? undefined : "Not found";
  const state = String(entity.state ?? "");
  if (state === "unavailable") return "Unavailable";
  if (state === "unknown" || state === "") return "Unknown";
  const unit = entity.attributes?.unit_of_measurement;
  if (typeof unit === "string" && unit.trim() !== "") return `${state} ${unit.trim()}`;
  return humanize(state);
}

// ── colors ───────────────────────────────────────────────────────────────

/** A tile color the way the watch reads it. `opacity` is 0 to 1. */
export type WatchTileColor =
  | { kind: "solid"; hex: string; opacity: number }
  | { kind: "gradient"; from: string; to: string }
  | { kind: "rainbow" };

/** The names the app accepts besides hex, as SwiftUI's system colors. */
const NAMED_COLORS: Readonly<Record<string, string>> = {
  yellow: "#FFCC00",
  blue: "#007AFF",
  red: "#FF3B30",
  green: "#34C759",
  purple: "#AF52DE",
  orange: "#FF9500",
  white: "#FFFFFF",
};

const HEX = /^#?([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/;

function solid(value: string): WatchTileColor | undefined {
  const m = HEX.exec(value.trim());
  if (m) return { kind: "solid", hex: `#${m[1]!.toUpperCase()}`, opacity: m[2] === undefined ? 1 : parseInt(m[2], 16) / 255 };
  const named = NAMED_COLORS[value.trim()];
  return named === undefined ? undefined : { kind: "solid", hex: named, opacity: 1 };
}

/** `#RRGGBB`, `#RRGGBBAA`, `GRADIENT|#AAAAAA|#BBBBBB`, `#RAINBOW` or a named
 * color. Undefined for anything else, which the watch draws in its default. */
export function parseTileColor(value: unknown): WatchTileColor | undefined {
  if (typeof value !== "string") return undefined;
  if (value.trim().toUpperCase() === "#RAINBOW") return { kind: "rainbow" };
  if (value.startsWith("GRADIENT|")) {
    const [, a = "", b = ""] = value.split("|");
    const from = solid(a);
    const to = solid(b);
    if (from?.kind === "solid" && to?.kind === "solid") return { kind: "gradient", from: from.hex, to: to.hex };
    return undefined;
  }
  return solid(value);
}

/** One plain color standing for any tile color: a gradient's first stop,
 * white for the rainbow. What an icon is drawn in. */
export function tileInkColor(color: WatchTileColor | undefined, fallback = "#FFFFFF"): string {
  if (color === undefined || color.kind === "rainbow") return fallback;
  return color.kind === "gradient" ? color.from : color.hex;
}

// ── placement ────────────────────────────────────────────────────────────

/** A whole number, or `fallback` for anything else. */
function whole(value: unknown, fallback: number, min: number): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(min, Math.trunc(value)) : fallback;
}

/** Where a tile sits in grid units. Placement is absolute: nothing stops two
 * tiles from overlapping, and the later one is drawn on top. */
export function tileGeometry(tile: WatchPageTile): { col: number; row: number; colSpan: number; rowSpan: number } {
  return {
    col: whole(tile.gridCol, 0, 0),
    row: whole(tile.gridRow, 0, 0),
    colSpan: whole(tile.colSpan, 1, 1),
    rowSpan: whole(tile.rowSpan, 1, 1),
  };
}

/** The rows a page uses: one past the bottom of its lowest tile. 0 for a page
 * with no tiles. */
export function watchPageExtent(page: WatchPage): number {
  let rows = 0;
  for (const tile of watchPageTiles(page)) {
    const g = tileGeometry(tile);
    rows = Math.max(rows, g.row + g.rowSpan);
  }
  return rows;
}

export interface PlacedWatchTile {
  tile: WatchPageTile;
  /** Its place in `items`, which is also its place in the drawing order. */
  index: number;
  /** Points from the grid's top left corner, below the top inset. A header
   * at row 0 sits a little above the grid, under the clock. */
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WatchPageLayout {
  /** One grid unit, in points: a column, and the height of a row. */
  unit: number;
  spacing: number;
  /** Points between the top of the screen and the grid. */
  topInset: number;
  screen: { width: number; height: number };
  tiles: PlacedWatchTile[];
  /** The grid's own height, as the watch scrolls it: never shorter than the
   * screen, less what the headers take back. */
  contentHeight: number;
  /** What a picture of the page needs: the inset and the grid, and at least
   * the screen. More than the screen's height means the page scrolls. */
  height: number;
}

/** Whether a page holds a header (`divider.` tile), which the watch pulls the
 * rows below up for, so the flat editing grid and the watch differ. */
export function watchPageHasHeader(page: WatchPage): boolean {
  return watchPageTiles(page).some((t) => tileKind(tileEntityId(t)) === "divider");
}

export interface WatchPageLayoutOptions {
  /** Every row one step below the last, with no pull up at headers, so a
   * cell maps to points by plain multiplication. What the editor drags on. */
  flat?: boolean;
}

/**
 * Every tile of a page placed in points on a screen of `screen` points, by
 * the watch's own arithmetic (`GridLayout` in the app's `InteractiveGrid`).
 *
 * The screen's width is cut into 12 square units with 2 points between them
 * and no margin at the edges. A tile spans whole units and the gaps inside
 * it. Header rows are pulled up: everything below the first header moves up
 * by 0.6 of a unit and by 0.4 more for each later one, and a header moves up
 * with the headers at its own row too. A tile that hides itself when off is
 * drawn where it is stored; the watch closes such gaps, the editor does not.
 * With `flat`, nothing is pulled up.
 */
export function watchPageLayout(
  page: WatchPage,
  screen: { width: number; height: number },
  options?: WatchPageLayoutOptions,
): WatchPageLayout {
  const spacing = WATCH_GRID_SPACING;
  const unit = (screen.width - (WATCH_GRID_COLUMNS - 1) * spacing) / WATCH_GRID_COLUMNS;
  const step = unit + spacing;
  const items = watchPageTiles(page);
  const geometry = items.map(tileGeometry);
  const isDivider = items.map((t) => tileKind(tileEntityId(t)) === "divider");
  const headerRows = options?.flat === true
    ? []
    : [...new Set(geometry.filter((_, i) => isDivider[i]).map((g) => g.row))].sort((a, b) => a - b);
  const shift = (count: number) => (count === 0 ? 0 : unit * 0.6 + (count - 1) * unit * 0.4);
  const headersAbove = (row: number) => shift(headerRows.filter((r) => r < row).length);
  const headersAtOrAbove = (row: number) => shift(headerRows.filter((r) => r <= row).length);

  let maxBottom = 0;
  const tiles = items.map((tile, index): PlacedWatchTile => {
    const g = geometry[index]!;
    const width = unit * g.colSpan + spacing * (g.colSpan - 1);
    const height = unit * g.rowSpan + spacing * (g.rowSpan - 1);
    maxBottom = Math.max(maxBottom, g.row * step + height);
    const y = g.row * step - (isDivider[index] ? headersAtOrAbove(g.row) : headersAbove(g.row));
    return { tile, index, x: g.col * step, y, width, height };
  });
  const base = items.length === 0 ? screen.height : Math.max(maxBottom, screen.height);
  const contentHeight = base - shift(headerRows.length);
  const topInset = page.fullScreen === true ? 0 : WATCH_GRID_TOP_INSET;
  return {
    unit,
    spacing,
    topInset,
    screen: { ...screen },
    tiles,
    contentHeight,
    height: Math.max(screen.height, topInset + contentHeight),
  };
}

// ── size, and saving back ────────────────────────────────────────────────

/** The document's size as compact JSON in UTF-8 bytes, which is how the
 * phone and the watch sync measure it. */
export function sizeOf(document: WatchPagesDocument): number {
  return new TextEncoder().encode(JSON.stringify(document)).length;
}

/** A document as it was loaded, and as it is now. The two are the same
 * object until something is edited. */
export interface WatchPagesModel {
  readonly loaded: WatchPagesDocument;
  readonly document: WatchPagesDocument;
}

export function openWatchPages(document: WatchPagesDocument): WatchPagesModel {
  return { loaded: document, document };
}

/** Whether the document differs from the one loaded. An edit made and then
 * undone by hand is no edit. */
export function isWatchPagesEdited(model: WatchPagesModel): boolean {
  return model.document !== model.loaded && JSON.stringify(model.document) !== JSON.stringify(model.loaded);
}

/** What a save sends: the loaded document itself when nothing was edited,
 * else the edited one. Neither is ever rebuilt from typed fields. */
export function encodeWatchPages(model: WatchPagesModel): WatchPagesDocument {
  return isWatchPagesEdited(model) ? model.document : model.loaded;
}

/**
 * Rename one page, by id. Only that page and the `pages` array are new
 * objects; every key keeps its place, so the encoded JSON differs in the name
 * alone. A blank name, a name that is already the page's, or an id no page
 * has leaves the model as it is.
 */
export function renameWatchPage(model: WatchPagesModel, pageId: string, name: string): WatchPagesModel {
  const clean = name.trim();
  const pages = model.document.pages;
  if (clean === "" || !Array.isArray(pages)) return model;
  const index = pages.findIndex((p) => isJsonObject(p) && p.id === pageId);
  if (index < 0) return model;
  const page = pages[index] as JsonObject;
  if (page.name === clean) return model;
  const nextPages = pages.slice();
  nextPages[index] = { ...page, name: clean };
  return { loaded: model.loaded, document: { ...model.document, pages: nextPages } };
}
