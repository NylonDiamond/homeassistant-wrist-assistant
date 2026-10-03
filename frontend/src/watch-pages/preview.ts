// A plain picture of one watch page: the screen at the watch's size, its 12
// column grid, and each tile at its place and size with its color, symbol,
// name and one line of state.
//
// It is right about layout and nothing more. The placement comes from
// `watchPageLayout`, which is the watch's own arithmetic; the look of a tile
// is a flat stand-in. Styling is drawn flat (part 3d): borders at the
// watch's widths with their line style and glow, a pattern as a tinted
// pattern or wash, the state bar and value label, the page's background with
// its brightness and pattern, and the page title. An effect or an animated
// border is a tinted hint; nothing moves.
//
// Drawn in HTML rather than one SVG so a long name can end in an ellipsis.
// Every size is in points times `scale`, so the picture is the screen grown
// evenly rather than a layout of its own.

import { css, html, nothing, svg, type TemplateResult } from "lit";
import type { HassEntityState } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";
import {
  type PlacedWatchTile,
  type WatchPage,
  type WatchPageTile,
  type WatchTileColor,
  dividerParts,
  isSmartWatchPage,
  parseTileColor,
  smartDomainLabel,
  smartPageDomains,
  tileClass,
  tileEntityId,
  tileInkColor,
  tileKind,
  tileKindLabel,
  tileLabel,
  tileShowsLabel,
  tileStateText,
  tileSymbol,
  tileTarget,
  watchPageLayout,
  watchPageName,
} from "./model.js";
import { watchPageTheme, watchPageValue } from "./page-settings-model.js";
import { WATCH_TILE_DEFAULTS, watchKindColor, watchThemeRoleColors } from "./tile-new.js";
import { watchStateDomains, watchStylingTheme } from "./tile-styling.js";
import { type WatchCatalog, watchLibraryTileFallbackName } from "./catalog.js";
import { isWatchTvRemote, watchUsesPersonPhoto } from "./special-model.js";

export interface WatchPagePreviewInput {
  page: WatchPage;
  /** Every page of the document, so a page link can be named after its page. */
  pages: readonly WatchPage[];
  /** The watch's screen in points. */
  screen: { width: number; height: number };
  states?: Record<string, HassEntityState>;
  /** The panel's symbol provider. Without one, tiles draw a dot for a symbol. */
  icons?: IconProvider;
  /** CSS pixels per point. */
  scale?: number;
  /** The iPhone's library, which names a macro or status page tile with no
   * label of its own as the watch does. */
  catalog?: WatchCatalog;
}

/** The name a tile draws: its own label, else for an HTTP action, macro or
 * status page tile the watch's fallback ("Action", the macro's or status
 * page's name in the catalog, else "Macro" or "Status Page"), else
 * `tileLabel`. */
export function watchPreviewTileLabel(tile: WatchPageTile, input: Pick<WatchPagePreviewInput, "states" | "pages" | "catalog">): string {
  const custom = typeof tile.customLabel === "string" ? tile.customLabel.trim() : "";
  if (custom === "") {
    const library = watchLibraryTileFallbackName(tileEntityId(tile), input.catalog);
    if (library !== undefined) return library;
  }
  return tileLabel(tile, input.states, input.pages);
}

/** The watch's corner radius for a tile, `DS.radius(.tileWatch)` in the app. */
const TILE_RADIUS = 16;
/** Padding inside a tile, in points. */
const TILE_PAD = 6;

function rgba(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1, 7), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${Math.round(alpha * 1000) / 1000})`;
}

/** A tile's ground: its color, faint, as a tile reads when it is off, all
 * of it times `alpha` (the tile's `colorOpacity`). */
function tileGround(color: WatchTileColor | undefined, alpha = 1): string {
  const a = (n: number) => Math.round(n * alpha * 1000) / 1000;
  if (color === undefined) return `rgba(255, 255, 255, ${a(0.12)})`;
  if (color.kind === "solid") return rgba(color.hex, 0.3 * color.opacity * alpha);
  if (color.kind === "gradient") return `linear-gradient(135deg, ${rgba(color.from, 0.38 * alpha)}, ${rgba(color.to, 0.38 * alpha)})`;
  return `linear-gradient(135deg, ${["255,59,48", "255,149,0", "255,204,0", "52,199,89", "0,122,255", "175,82,222"].map((c) => `rgba(${c},${a(0.35)})`).join(", ")})`;
}

/** A tile's `colorOpacity`, which the watch multiplies its fill, border and
 * pattern by: 0 to 1, 1 when absent. */
export function watchTileColorOpacity(tile: WatchPageTile): number {
  const v = storedNumber(tile.colorOpacity);
  return v === undefined ? 1 : Math.max(0, Math.min(1, v));
}

/** The flat color a tile with no color of its own draws its border, glow
 * and bar in: its kind's color in the page's theme (the watch's fallback
 * theme when the page has none), else white. */
export function watchTileFallbackInk(tile: WatchPageTile, page: WatchPage | undefined): string {
  const kind = watchKindColor(tileEntityId(tile), page === undefined ? WATCH_TILE_DEFAULTS.watchFallbackTheme : watchPageTheme(page));
  return kind === undefined ? "#FFFFFF" : flatInk(kind, "#FFFFFF");
}

/** The page's base color as one CSS color: its own (a gradient's first
 * color), else its theme's default background. */
export function watchScreenColor(page: WatchPage): string {
  const color = parseTileColor(page.backgroundColor);
  if (color?.kind === "solid") return rgba(color.hex, color.opacity);
  if (color?.kind === "gradient") return color.from;
  return watchStylingTheme(watchPageTheme(page))?.pageDefaultBackground ?? "#000";
}

/** What brightness `b` lays over the base color (`TileGridPageView`): black
 * at 1 minus b under 1, white at (b minus 1) times 0.24 over 1, nothing at
 * 1. Clamped to 0 to 1.5. */
export function watchBrightnessVeil(b: number): string | undefined {
  const v = Math.max(0, Math.min(1.5, Number.isFinite(b) ? b : 0.6));
  if (v < 1) return `rgba(0, 0, 0, ${Math.round((1 - v) * 1000) / 1000})`;
  if (v > 1) return `rgba(255, 255, 255, ${Math.round((v - 1) * 0.24 * 1000) / 1000})`;
  return undefined;
}

/**
 * The page's whole background as CSS layers, top first: its pattern (when
 * not none, in its color at its opacity), the brightness veil, then the base
 * (a gradient top left to bottom right, else one color). An animation is a
 * faint wash of its color.
 */
export function watchScreenBackground(page: WatchPage, s = 1.5): string {
  const layers: string[] = [];
  const pattern = watchPageValue(page, "backgroundPattern");
  if (typeof pattern === "string" && pattern !== "none") {
    const ink = tileInkColor(parseTileColor(watchPageValue(page, "backgroundPatternColor")));
    const opacity = numberOr(watchPageValue(page, "backgroundPatternOpacity"), 0.5);
    const scale = numberOr(watchPageValue(page, "backgroundPatternScale"), 1);
    layers.push(...watchPatternLayers(pattern, ink, opacity, scale * s));
  }
  const overlay = watchPageValue(page, "backgroundOverlay");
  if (typeof overlay === "string" && overlay !== "none") {
    const c = parseTileColor(watchPageValue(page, "backgroundOverlayColor"));
    const ink = tileInkColor(c, "#FFFFFF");
    layers.push(`radial-gradient(ellipse at 50% 30%, ${rgba(ink, 0.22)}, transparent 70%)`);
  }
  const veil = watchBrightnessVeil(numberOr(watchPageValue(page, "backgroundBrightness"), 0.6));
  if (veil !== undefined) layers.push(`linear-gradient(${veil}, ${veil})`);
  const color = parseTileColor(page.backgroundColor);
  layers.push(color?.kind === "gradient" ? `linear-gradient(135deg, ${color.from}, ${color.to})` : `linear-gradient(${watchScreenColor(page)}, ${watchScreenColor(page)})`);
  return layers.join(", ");
}

function numberOr(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

// ── styling, drawn flat ──────────────────────────────────────────────────

/** Each pattern's own opacity on the watch (`TilePatterns.swift`). */
const PATTERN_OPACITY: Readonly<Record<string, number>> = {
  stripes: 0.2, crosshatch: 0.15, checkerboard: 0.15, horizontalLines: 0.2, verticalLines: 0.2, grid: 0.15,
  dots: 0.15, diamond: 0.15, waves: 0.2, zigzag: 0.2, sunburst: 0.2, concentric: 0.15, triangles: 0.15,
  hexagons: 0.15, noise: 0.2, gradient: 1, cornerGlow: 1, vignette: 1,
};

/**
 * A pattern as CSS background layers in `ink` at `opacity` times the
 * pattern's own, its features `unit` pixels per point. The lines, grids,
 * dots and glows are drawn; the other patterns are a wash of the color.
 */
export function watchPatternLayers(pattern: string, ink: string, opacity: number, unit: number): string[] {
  const own = PATTERN_OPACITY[pattern] ?? 0.15;
  const c = rgba(ink, Math.max(0, Math.min(1, opacity)) * own);
  const px = (pt: number) => `${Math.round(pt * unit * 100) / 100}px`;
  switch (pattern) {
    case "stripes":
      return [`repeating-linear-gradient(45deg, ${c} 0 ${px(2)}, transparent ${px(2)} ${px(8)})`];
    case "crosshatch":
      return [`repeating-linear-gradient(45deg, ${c} 0 ${px(1.5)}, transparent ${px(1.5)} ${px(8)})`, `repeating-linear-gradient(-45deg, ${c} 0 ${px(1.5)}, transparent ${px(1.5)} ${px(8)})`];
    case "horizontalLines":
      return [`repeating-linear-gradient(0deg, ${c} 0 ${px(2)}, transparent ${px(2)} ${px(8)})`];
    case "verticalLines":
      return [`repeating-linear-gradient(90deg, ${c} 0 ${px(2)}, transparent ${px(2)} ${px(8)})`];
    case "grid":
      return [`repeating-linear-gradient(0deg, ${c} 0 ${px(1)}, transparent ${px(1)} ${px(8)})`, `repeating-linear-gradient(90deg, ${c} 0 ${px(1)}, transparent ${px(1)} ${px(8)})`];
    case "dots":
      return [`radial-gradient(circle, ${c} ${px(1.5)}, transparent ${px(1.6)}) 0 0 / ${px(8)} ${px(8)}`];
    case "checkerboard":
      return [`conic-gradient(${c} 25%, transparent 0 50%, ${c} 0 75%, transparent 0) 0 0 / ${px(12)} ${px(12)}`];
    case "gradient": {
      const a = (k: number) => rgba(ink, Math.max(0, Math.min(1, opacity)) * k);
      return [`linear-gradient(180deg, ${a(0.5)}, ${a(0.3)} 30%, ${a(0.1)} 60%, transparent)`];
    }
    case "cornerGlow": {
      const a = (k: number) => rgba(ink, Math.max(0, Math.min(1, opacity)) * k);
      return [`radial-gradient(circle at 0% 100%, ${a(0.4)}, ${a(0.2)} 40%, transparent 80%)`];
    }
    case "vignette": {
      const a = (k: number) => rgba(ink, Math.max(0, Math.min(1, opacity)) * k);
      return [`radial-gradient(circle, transparent 30%, ${a(0.15)} 70%, ${a(0.35)})`];
    }
    default:
      return [`linear-gradient(${c}, ${c})`];
  }
}

/** The watch's border widths in points, by thickness (`TileStyleModifier`);
 * auto is thicker while the tile is on. */
export function watchBorderWidth(thickness: unknown, active: boolean): number {
  switch (thickness) {
    case "extraThin":
      return 0.75;
    case "thin":
      return 1.5;
    case "medium":
      return 3;
    case "thick":
      return 5;
    case "none":
      return 0;
    case "auto":
      return active ? 1.8 : 1.1;
    default:
      return 0.75;
  }
}

const OFF_STATES: ReadonlySet<string> = new Set([
  "off", "closed", "locked", "idle", "paused", "standby", "not_home", "unavailable", "unknown", "disarmed", "docked", "",
]);

/** Whether the picture draws a tile as on: an entity whose state is not an
 * off state; a tile with no entity state to read (no states, a virtual
 * tile) is drawn on, so its styling shows. A remote, vacuum, climate,
 * person or alarm panel is on as its own watch tile says (`specialActive`). */
export function watchTilePreviewActive(tile: WatchPageTile, states?: Readonly<Record<string, HassEntityState>>): boolean {
  const entity = states?.[tileEntityId(tile)];
  if (entity === undefined) return true;
  const special = specialActive(tile, states!, entity);
  if (special !== undefined) return special;
  return !OFF_STATES.has(String(entity.state ?? "").toLowerCase());
}

// ── special tiles, as their own watch views draw them (part 3f) ─────────

/** The theme tokens the special tiles take their default colors from, per
 * theme (`DS+Color.swift`): the semantic warning, danger and accent, the
 * secondary text's white opacity, and the three temperature colors. The
 * entity role colors come from the tile table (`watchThemeRoleColors`). */
const THEME_TOKENS: Readonly<Record<string, { warning: string; danger: string; accent: string; secondary: number; tempWarm: string; tempCool: string; tempNeutral: string }>> = {
  midnight: { warning: "#F5BD3A", danger: "#FF5D72", accent: "#8CA8FF", secondary: 0.72, tempWarm: "#F3A43D", tempCool: "#4EB6F0", tempNeutral: "#8FAAC7" },
  sunrise: { warning: "#F7B24A", danger: "#F06B5C", accent: "#F0A55B", secondary: 0.78, tempWarm: "#F78F42", tempCool: "#53B7E6", tempNeutral: "#A9B0C5" },
  forest: { warning: "#E0B654", danger: "#DD6A62", accent: "#4CCF8F", secondary: 0.74, tempWarm: "#D99343", tempCool: "#3DB1D0", tempNeutral: "#77A79E" },
  sunnyBeachDay: { warning: "#E9C46A", danger: "#E76F51", accent: "#2EC4B6", secondary: 0.7, tempWarm: "#F4A261", tempCool: "#4DBFE0", tempNeutral: "#88B6C9" },
  neonLagoon: { warning: "#FFC145", danger: "#EC368D", accent: "#02C3BD", secondary: 0.78, tempWarm: "#FF9E4D", tempCool: "#47C4FF", tempNeutral: "#9EC2E8" },
  softVintage: { warning: "#AC8974", danger: "#C49186", accent: "#C49186", secondary: 0.78, tempWarm: "#AC8974", tempCool: "#918AA4", tempNeutral: "#B8ACA0" },
  hyperPop: { warning: "#FEE440", danger: "#FF4D9E", accent: "#00F5D4", secondary: 0.8, tempWarm: "#FB5607", tempCool: "#00BBF9", tempNeutral: "#A9CFFF" },
  ember: { warning: "#E8A33D", danger: "#E8512F", accent: "#E8512F", secondary: 0.74, tempWarm: "#E88A30", tempCool: "#A08070", tempNeutral: "#B8A090" },
  sakura: { warning: "#E8B85A", danger: "#E85A72", accent: "#F2A0B5", secondary: 0.76, tempWarm: "#E8A088", tempCool: "#A890C0", tempNeutral: "#C0B0B8" },
  polar: { warning: "#D4B87A", danger: "#D47080", accent: "#8EC8E8", secondary: 0.74, tempWarm: "#B8A090", tempCool: "#70B0D0", tempNeutral: "#90A8B8" },
};

/** A theme color for a special tile: `hex` at `alpha` (the secondary text
 * is white at the theme's opacity). */
export interface WatchInk {
  hex: string;
  alpha: number;
}

function themeInk(page: WatchPage | undefined, token: "warning" | "danger" | "accent" | "secondary" | "tempWarm" | "tempCool" | "tempNeutral" | `entity${string}`): WatchInk {
  const theme = page === undefined ? WATCH_TILE_DEFAULTS.watchFallbackTheme : watchPageTheme(page);
  if (token.startsWith("entity")) {
    const role = watchThemeRoleColors(theme)[token];
    return { hex: role ?? "#FFFFFF", alpha: 1 };
  }
  const t = THEME_TOKENS[theme] ?? THEME_TOKENS[WATCH_TILE_DEFAULTS.watchFallbackTheme] ?? THEME_TOKENS.midnight!;
  if (token === "secondary") return { hex: "#FFFFFF", alpha: t.secondary };
  return { hex: t[token as Exclude<keyof typeof t, "secondary">], alpha: 1 };
}

/** A stored color as one plain ink, or undefined when there is none. */
function ownInk(value: unknown): WatchInk | undefined {
  const c = parseTileColor(value);
  return c === undefined ? undefined : { hex: tileInkColor(c), alpha: 1 };
}

function lower(value: unknown): string {
  return String(value ?? "").toLowerCase();
}

/** Whether a `media_player.` tile is drawn as a remote: the Remote task's
 * rule (`isWatchTvRemote`), which is the watch's. */
export function watchTileIsTvRemote(tile: WatchPageTile, states?: Readonly<Record<string, HassEntityState>>): boolean {
  return isWatchTvRemote(tileEntityId(tile), states);
}

/** The key a tile's state icons and colors are read under, as the watch
 * resolves it (`resolvedStateKey`): undefined unless `usesStateIcons` is
 * true and the entity is there; `unavailable` for unknown or unavailable. */
export function watchTileStateKey(tile: WatchPageTile, raw: string | undefined): string | undefined {
  if (tile.usesStateIcons !== true || raw === undefined) return undefined;
  const key = raw.toLowerCase();
  return key === "unknown" || key === "unavailable" ? "unavailable" : key;
}

function stateEntry(map: unknown, key: string | undefined): string | undefined {
  if (key === undefined || map === null || typeof map !== "object" || Array.isArray(map)) return undefined;
  const value = Object.hasOwn(map, key) ? (map as Record<string, unknown>)[key] : undefined;
  return typeof value === "string" ? value : undefined;
}

/** The linked media player of a remote tile: `associatedMediaPlayerId`,
 * else `media_player.<object id>` (a TV tile is its own player). */
export function watchRemotePlayerId(tile: WatchPageTile): string {
  const own = typeof tile.associatedMediaPlayerId === "string" ? tile.associatedMediaPlayerId.trim() : "";
  if (own !== "") return own;
  const entityId = tileEntityId(tile);
  return tileKind(entityId) === "media_player" ? entityId : `media_player.${tileTarget(entityId)}`;
}

/** The remote's symbol: its own unless it is one of the three the pickers
 * assign, else by the platform the entity id names (`RemotePlatform`). */
export function watchRemoteSymbol(tile: WatchPageTile): string | undefined {
  if (tile.icon === "") return undefined;
  const own = typeof tile.icon === "string" ? tile.icon : "";
  if (own !== "" && !["appletv", "play.rectangle", "av.remote"].includes(own)) return own;
  const id = tileEntityId(tile).toLowerCase();
  if (id.includes("apple_tv")) return "appletv";
  if (["android", "shield", "samsung", "lg", "webos", "roku"].some((w) => id.includes(w))) return "av.remote";
  if (id.includes("xbox")) return "xbox.logo";
  return "av.remote";
}

/** The battery symbol and color the watch draws by level. */
export function watchBatteryBadge(level: number): { symbol: string; ink: WatchInk } {
  const symbol = level < 25 ? "battery.25" : level < 50 ? "battery.50" : level < 75 ? "battery.75" : "battery.100";
  const ink = level < 20 ? { hex: "#FF3B30", alpha: 1 } : level < 40 ? { hex: "#FF9500", alpha: 1 } : { hex: "#FFFFFF", alpha: 0.62 };
  return { symbol, ink };
}

/** A climate's temperature as the watch writes it: one decimal when the
 * step is under 1, else none, then a degree sign. */
export function watchClimateTemperature(value: number, step: number): string {
  return `${value.toFixed(step > 0 && step < 1 ? 1 : 0)}°`;
}

/** The person's location badge: Home, Away, else the zone's first word, at
 * most 6 characters, capitalized (`PersonEntity.locationBadge`). */
export function watchPersonBadge(state: string): string {
  const s = state.toLowerCase();
  if (s === "home") return "Home";
  if (s === "not_home") return "Away";
  const first = state.replace(/_/g, " ").split(" ").find((w) => w !== "") ?? state;
  const short = first.slice(0, 6);
  return short === "" ? "" : short[0]!.toUpperCase() + short.slice(1).toLowerCase();
}

const ALARM_WORDS: Readonly<Record<string, string>> = {
  disarmed: "OFF", armed_home: "HOME", armed_away: "AWAY", armed_night: "NIGHT", armed_vacation: "VACATION",
  armed_custom_bypass: "CUSTOM", pending: "PENDING", arming: "ARMING", disarming: "DISARMING", triggered: "ALERT",
};

/** An alarm panel's state as the watch parses it: an unknown state reads as
 * disarmed (`AlarmState(rawValue:) ?? .disarmed`). */
function alarmState(raw: string): string {
  return Object.hasOwn(ALARM_WORDS, raw) ? raw : "disarmed";
}

/** Whether a special tile is on as its watch view says, or undefined for
 * any other tile. */
function specialActive(tile: WatchPageTile, states: Readonly<Record<string, HassEntityState>>, entity: HassEntityState): boolean | undefined {
  const state = lower(entity.state);
  switch (tileKind(tileEntityId(tile))) {
    case "remote":
      return remoteActive(tile, states, entity);
    case "media_player":
      return watchTileIsTvRemote(tile, states) ? remoteActive(tile, states, entity) : undefined;
    case "vacuum":
      return state === "cleaning" || state === "returning";
    case "climate":
      return state !== "off" && state !== "unavailable";
    case "person":
      return state === "home";
    case "alarm_control_panel": {
      const a = alarmState(state);
      return a !== "disarmed";
    }
    default:
      return undefined;
  }
}

function remoteActive(tile: WatchPageTile, states: Readonly<Record<string, HassEntityState>>, entity: HassEntityState): boolean {
  const id = watchRemotePlayerId(tile);
  const player = Object.hasOwn(states, id) ? states[id] : undefined;
  if (player !== undefined) return !["off", "standby"].includes(lower(player.state));
  return tileKind(tileEntityId(tile)) === "remote" ? lower(entity.state) === "on" : !["off", "standby"].includes(lower(entity.state));
}

/** A badge in a tile's top left: lines of words, or a battery. */
export type WatchSpecialBadge =
  | { kind: "text"; lines: string[]; ink: WatchInk; weight: number; pill: boolean }
  | { kind: "battery"; level: number; symbol: string; ink: WatchInk };

/**
 * How a remote (or a TV), vacuum, lawn mower, climate, person or alarm
 * panel tile draws at rest, as its own watch view does; undefined for any
 * other tile. `symbol` undefined is no symbol, `filled` asks for the
 * symbol's fill variant, `photo` is a person's picture in place of the
 * symbol, `stateLine` keeps the picture's line of state (the mower, a plain
 * sensor tile on the watch).
 */
export interface WatchSpecialLook {
  symbol: string | undefined;
  filled: boolean;
  ink: WatchInk;
  opacity: number;
  photo?: string;
  active: boolean;
  topLeft?: WatchSpecialBadge;
  topRight?: string;
  stateLine: boolean;
}

export function watchSpecialTileLook(
  tile: WatchPageTile,
  input: Pick<WatchPagePreviewInput, "states" | "page">,
): WatchSpecialLook | undefined {
  const states = input.states;
  const entityId = tileEntityId(tile);
  const entity = states !== undefined && Object.hasOwn(states, entityId) ? states[entityId] : undefined;
  const raw = entity === undefined ? undefined : String(entity.state ?? "");
  const state = lower(raw);
  const attrs = entity?.attributes ?? {};
  const active = watchTilePreviewActive(tile, states);
  const activity = tile.showActivityStatus !== false;
  const kind = tileKind(entityId);
  const page = input.page;
  const secondary: WatchInk = { hex: "#FFFFFF", alpha: 0.62 };
  const key = watchTileStateKey(tile, raw);
  const stateIcon = stateEntry(tile.stateIcons, key);
  const stateColor = ownInk(stateEntry(tile.stateColors, key));
  const noIcon = tile.icon === "";
  const ownIcon = typeof tile.icon === "string" && tile.icon !== "" ? tile.icon : undefined;

  if (kind === "remote" || watchTileIsTvRemote(tile, states)) {
    const playerId = watchRemotePlayerId(tile);
    const player = states !== undefined && Object.hasOwn(states, playerId) ? states[playerId] : undefined;
    const ps = lower(player?.state);
    const playerOn = player !== undefined && ps !== "off" && ps !== "standby";
    const volume = player?.attributes?.volume_level;
    return {
      symbol: watchRemoteSymbol(tile),
      filled: true,
      ink: ownInk(tile.color) ?? themeInk(page, "entityRemote"),
      opacity: 1,
      active,
      topRight: !activity || player === undefined ? undefined : ps === "playing" ? "play.fill" : ps === "paused" || ps === "idle" ? "pause.fill" : undefined,
      topLeft: activity && playerOn && typeof volume === "number" && Number.isFinite(volume)
        ? { kind: "text", lines: [`${Math.trunc(volume * 100)}%`], ink: secondary, weight: 500, pill: false }
        : undefined,
      stateLine: false,
    };
  }

  switch (kind) {
    case "vacuum": {
      const v = ["cleaning", "docked", "returning", "idle", "paused", "error"].includes(state) ? state : "unknown";
      const byState: Record<string, string> = { cleaning: "hurricane", docked: "house", returning: "arrow.uturn.backward", idle: "hurricane", paused: "pause.fill", error: "exclamationmark.triangle", unknown: "hurricane" };
      const ink = v === "cleaning" || v === "returning" || v === "paused" ? themeInk(page, "entityVacuum") : v === "error" ? themeInk(page, "danger") : themeInk(page, "secondary");
      const battery = attrs.battery_level;
      const status: Record<string, string> = { cleaning: "play.fill", returning: "arrow.uturn.backward", paused: "pause.fill", error: "exclamationmark.triangle" };
      return {
        symbol: noIcon ? undefined : (ownIcon ?? byState[v]),
        filled: true,
        ink: ownInk(tile.color) ?? ink,
        opacity: 1,
        active,
        topLeft: tile.showBatteryOnTile !== false && typeof battery === "number" && Number.isFinite(battery) ? batteryBadge(Math.trunc(battery)) : undefined,
        topRight: activity ? status[v] : undefined,
        stateLine: false,
      };
    }
    case "lawn_mower": {
      const batteryId = typeof tile.mowerBatteryEntityId === "string" && tile.mowerBatteryEntityId !== "" ? tile.mowerBatteryEntityId : `sensor.${tileTarget(entityId)}_battery`;
      const sensor = states !== undefined && Object.hasOwn(states, batteryId) ? states[batteryId] : undefined;
      const level = sensor === undefined || String(sensor.state ?? "").trim() === "" ? NaN : Number(sensor.state);
      const status = ({ mowing: "play.fill", starting: "play.fill", on: "play.fill", returning: "arrow.uturn.backward", paused: "pause.fill", error: "exclamationmark.triangle" } as Record<string, string>)[state];
      return {
        symbol: stateIcon ?? (noIcon ? undefined : (ownIcon ?? "leaf.fill")),
        filled: false,
        ink: stateColor ?? ownInk(tile.color) ?? { hex: "#34C759", alpha: 1 },
        opacity: 1,
        active,
        topLeft: tile.showBatteryOnTile !== false && Number.isFinite(level) ? batteryBadge(Math.trunc(level)) : undefined,
        topRight: activity ? status : undefined,
        stateLine: true,
      };
    }
    case "climate": {
      const modeIcon: Record<string, string> = { off: "power", heat: "flame", cool: "snowflake", heat_cool: "thermometer.variable", auto: "thermometer.variable", dry: "drop.degreesign", fan_only: "fan" };
      const modeInk = state === "heat" ? themeInk(page, "tempWarm") : state === "cool" ? themeInk(page, "tempCool")
        : state === "heat_cool" || state === "auto" ? themeInk(page, "tempNeutral") : state === "fan_only" ? themeInk(page, "entityFan") : themeInk(page, "entityClimate");
      const on = state !== "off" && state !== "unavailable";
      const style = watchValueLabelStyle(tile);
      const lines: string[] = [];
      if (style !== "Off" && entity !== undefined) {
        const step = storedNumber(attrs.target_temp_step) ?? 1;
        const features = storedNumber(attrs.supported_features) ?? 0;
        const dual = state === "heat_cool" || (features !== 0 && (features & 2) !== 0 && (features & 1) === 0);
        const low = storedNumber(attrs.target_temp_low);
        const high = storedNumber(attrs.target_temp_high);
        const target = storedNumber(attrs.temperature);
        const current = storedNumber(attrs.current_temperature);
        if (tile.showTargetTempOnTile !== false) {
          if (dual && low !== undefined && high !== undefined) lines.push(`${watchClimateTemperature(low, step)}/${watchClimateTemperature(high, step)}`);
          else if (target !== undefined) lines.push(watchClimateTemperature(target, step));
        }
        if (tile.showCurrentTempOnTile !== false && current !== undefined) lines.push(watchClimateTemperature(current, step));
      }
      const action = lower(attrs.hvac_action);
      const badge = action === "heating" ? "flame.fill" : action === "cooling" ? "snowflake" : action === "drying" ? "dehumidifier.fill" : action === "fan" ? "fan.fill" : undefined;
      return {
        symbol: stateIcon ?? (noIcon ? undefined : (ownIcon ?? (modeIcon[state] ?? "thermometer"))),
        filled: stateIcon === undefined && on,
        ink: stateColor ?? ownInk(tile.color) ?? modeInk,
        opacity: on ? 1 : 0.85,
        active,
        topLeft: lines.length === 0 ? undefined : { kind: "text", lines, ink: secondary, weight: 500, pill: style === "Pill" },
        topRight: activity && on ? badge : undefined,
        stateLine: false,
      };
    }
    case "person": {
      const home = state === "home";
      const usePhoto = watchUsesPersonPhoto(tile);
      const picture = attrs.entity_picture;
      return {
        symbol: stateIcon ?? (noIcon ? undefined : (ownIcon ?? "person")),
        filled: stateIcon === undefined,
        ink: stateColor ?? ownInk(tile.color) ?? themeInk(page, "entityPerson"),
        opacity: home || tile.dimWhenOff === false || entity === undefined ? 1 : 0.6,
        photo: usePhoto && typeof picture === "string" && picture !== "" ? picture : undefined,
        active,
        topLeft: activity && raw !== undefined ? { kind: "text", lines: [watchPersonBadge(raw)], ink: { hex: "#FFFFFF", alpha: 0.8 }, weight: 500, pill: false } : undefined,
        stateLine: false,
      };
    }
    case "alarm_control_panel": {
      const a = alarmState(state);
      const byState: Record<string, string> = { triggered: "exclamationmark.shield", pending: "shield.lefthalf.filled", arming: "shield.lefthalf.filled", disarming: "shield.lefthalf.filled" };
      const ink = a === "disarmed" ? themeInk(page, "secondary")
        : a === "armed_away" || a === "triggered" ? themeInk(page, "danger")
        : a === "armed_night" ? { hex: "#BF5AF2", alpha: 1 }
        : a === "pending" || a === "arming" || a === "disarming" ? themeInk(page, "accent")
        : themeInk(page, "warning");
      return {
        symbol: stateIcon ?? (noIcon ? undefined : (ownIcon ?? byState[a] ?? "shield")),
        filled: stateIcon === undefined,
        ink: stateColor ?? ownInk(tile.color) ?? ink,
        opacity: 1,
        active,
        topLeft: activity && entity !== undefined ? { kind: "text", lines: [ALARM_WORDS[a]!], ink: secondary, weight: 600, pill: false } : undefined,
        stateLine: false,
      };
    }
    default:
      return undefined;
  }
}

/** A special tile's symbol, or a person's photo in a circle 1.35 times the
 * symbol's size with a rim in the symbol's color at 90%. */
function specialSymbol(look: WatchSpecialLook, icons: IconProvider | undefined, symbolPt: number, room: number, s: number, shadow: boolean): TemplateResult | typeof nothing {
  const opacity = look.opacity * (look.photo === undefined ? look.ink.alpha : 1);
  const fade = opacity >= 1 ? "" : `opacity:${Math.round(opacity * 1000) / 1000}`;
  if (look.photo !== undefined) {
    const d = Math.max(8, Math.min(symbolPt * 1.35, room));
    const rim = Math.max(1, d * 0.045);
    return html`<img class="wp-photo" alt="" src=${look.photo}
      style=${`width:${d * s}px;height:${d * s}px;border:${Math.round(rim * s * 100) / 100}px solid ${rgba(look.ink.hex, 0.9)}${fade === "" ? "" : `;${fade}`}`} />`;
  }
  if (look.symbol === undefined) return nothing;
  const mark = symbolMark(icons, filledSymbol(icons, look.symbol, look.filled), Math.max(8, Math.min(symbolPt, room)) * s, look.ink.hex, shadow);
  return fade === "" ? mark : html`<span class="wp-sym-fade" style=${fade}>${mark}</span>`;
}

function batteryBadge(level: number): WatchSpecialBadge {
  const { symbol, ink } = watchBatteryBadge(level);
  return { kind: "battery", level, symbol, ink };
}

function inkCss(ink: WatchInk): string {
  return ink.alpha >= 1 ? ink.hex : rgba(ink.hex, ink.alpha);
}

/** The symbol's fill variant when the provider draws one, else the name. */
function filledSymbol(icons: IconProvider | undefined, name: string, filled: boolean): string {
  if (!filled || name.endsWith(".fill")) return name;
  const f = `${name}.fill`;
  return icons?.render(f, 1, "#FFFFFF") !== undefined ? f : name;
}

/** A special tile's badges, top left and top right, at the badge padding.
 * Returns the bottom of the top left one in points (0 for none). */
function specialBadges(tile: WatchPageTile, look: WatchSpecialLook, input: WatchPagePreviewInput, widthPt: number, heightPt: number, s: number): { parts: TemplateResult[]; bottom: number } {
  const pad = watchBadgePadding(widthPt, heightPt);
  const size = watchBadgeFontSize(tile, widthPt, heightPt);
  const parts: TemplateResult[] = [];
  let bottom = 0;
  const shadow = tile.statusTextShadow === false ? "" : `text-shadow:0 ${s}px ${2 * s}px rgba(0, 0, 0, 0.8)`;
  const b = look.topLeft;
  if (b?.kind === "text") {
    const style = [`font-size:${size * s}px`, `top:${pad * s}px`, `left:${pad * s}px`, `color:${inkCss(b.ink)}`, `font-weight:${b.weight}`, b.pill ? pillStyle(s) : "", shadow].filter((p) => p !== "").join(";");
    parts.push(html`<span class="wp-badge" style=${style}>${b.lines.map((l) => html`<span>${l}</span>`)}</span>`);
    bottom = pad + b.lines.length * size * 1.15;
  } else if (b?.kind === "battery") {
    const font = Math.max(size - 1, 4);
    const style = [`font-size:${font * s}px`, `top:${pad * s}px`, `left:${pad * s}px`, `color:${inkCss(b.ink)}`, `gap:${s}px`, `text-shadow:0 ${s}px ${2 * s}px rgba(0, 0, 0, 0.6)`].join(";");
    parts.push(html`<span class="wp-badge row" style=${style}>${symbolMark(input.icons, b.symbol, Math.max(font - 2, 3) * s, b.ink.hex)}<span>${b.level}</span></span>`);
    bottom = pad + font * 1.15;
  }
  if (look.topRight !== undefined) {
    const px = (storedNumber(tile.statusIconSizeOverride) ?? 15) * 0.7 + (look.topRight.includes("exclamationmark") ? 1.5 : 0);
    parts.push(html`<span class="wp-badge" style=${`top:${Math.max(0, pad - 1) * s}px;right:${pad * s}px;opacity:0.62`}>${symbolMark(input.icons, look.topRight, px * s, "#FFFFFF")}</span>`);
  }
  return { parts, bottom };
}

// ── cameras ──────────────────────────────────────────────────────────────

/** A camera tile's corner radius by its short side in points. */
export function watchCameraCornerRadius(widthPt: number, heightPt: number): number {
  const side = Math.min(widthPt, heightPt);
  return side < 25 ? 4 : side < 40 ? 5 : side < 60 ? 6 : 8;
}

/** A camera tile's border width in icon mode, by `borderThickness`. */
export function watchCameraBorderWidth(thickness: unknown): number {
  switch (thickness) {
    case "none": return 0;
    case "thin": return 1;
    case "medium": return 2;
    case "thick": return 3;
    case "auto": return 1;
    default: return 0.75;
  }
}

/** A camera group's grid (`multiCamGridSize`): `columns` when set above 0,
 * else one column for 1 or 2 cameras, else ceil(sqrt(n)) columns. */
export function watchMultiCamGrid(count: number, columns?: unknown): { columns: number; rows: number } {
  if (count <= 0) return { columns: 1, rows: 1 };
  const own = typeof columns === "number" && Number.isFinite(columns) ? Math.trunc(columns) : 0;
  if (own > 0) return { columns: own, rows: Math.ceil(count / own) };
  if (count <= 2) return { columns: 1, rows: count };
  const cols = Math.ceil(Math.sqrt(count));
  return { columns: cols, rows: Math.ceil(count / cols) };
}

/** The rows' heights (`multiCamRowHeights`): in proportion to the weights
 * only with one column and one weight per row, else even. */
export function watchMultiCamRowHeights(total: number, rows: number, spacing: number, columns: number, weights: unknown): number[] {
  if (rows <= 0) return [];
  const w = Array.isArray(weights) && weights.every((x) => typeof x === "number" && Number.isFinite(x)) ? (weights as number[]) : undefined;
  if (columns === 1 && w !== undefined && w.length === rows) {
    const available = total - spacing * (rows - 1);
    if (available <= 0) return Array(rows).fill(Math.max(0, total / rows));
    const sum = w.reduce((a, b) => a + b, 0);
    if (sum <= 0) return Array(rows).fill(available / rows);
    return w.map((x) => (x / sum) * available);
  }
  return Array(rows).fill(Math.max(0, (total - spacing * (rows - 1)) / rows));
}

/** How cell `i` of a camera group fills: `cameraFillModes[i]`, then
 * `cameraFillMode`, then fill. */
export function watchMultiCamCellFill(tile: WatchPageTile, i: number): "fill" | "fit" {
  const modes = Array.isArray(tile.cameraFillModes) ? tile.cameraFillModes : [];
  const own = i < modes.length ? modes[i] : undefined;
  const mode = own === "fill" || own === "fit" ? own : tile.cameraFillMode;
  return mode === "fit" ? "fit" : "fill";
}

/** A camera group's border: on, its width (gaps and outer inset) and the
 * CSS background that shows through the gaps. Off is 1 point black gaps. */
export function watchMultiCamBorder(tile: WatchPageTile): { on: boolean; width: number; spacing: number; background: string } {
  if (tile.multiCamBorderEnabled !== true) return { on: false, width: 0, spacing: 1, background: "#000" };
  const t = tile.multiCamBorderThickness;
  const width = t === "medium" ? 2 : t === "thick" ? 3 : t === "none" ? 0 : t === "extraThin" ? 0.75 : t === "auto" ? 0 : 1;
  const raw = typeof tile.multiCamBorderColor === "string" ? tile.multiCamBorderColor : "FFFFFF";
  const c = parseTileColor(raw);
  const background = c?.kind === "rainbow" ? "linear-gradient(135deg, #FF3B30, #FF9500, #FFCC00, #34C759, #007AFF, #AF52DE)"
    : c?.kind === "gradient" ? `linear-gradient(135deg, ${c.from}, ${c.to})`
    : c?.kind === "solid" ? c.hex : "#FFFFFF";
  return { on: true, width, spacing: Math.max(width, 1), background };
}

function pictureOf(states: Readonly<Record<string, HassEntityState>> | undefined, entityId: string): string | undefined {
  const p = states !== undefined && Object.hasOwn(states, entityId) ? states[entityId]?.attributes?.entity_picture : undefined;
  return typeof p === "string" && p !== "" ? p : undefined;
}

/** A snapshot in a box of `w` by `h` points: letterboxed with fit, else
 * cropped and moved by the offsets (half the box per 1). The move shifts
 * the whole scaled picture, as the watch's offset does, so what overflows
 * the box comes into view before any black does. */
function snapshot(url: string, fill: boolean, w: number, h: number, ox: number, oy: number, s: number): TemplateResult {
  const shift = (v: number) => {
    const px = Math.round(v * s * 100) / 100;
    return px === 0 ? "50%" : `calc(50% ${px < 0 ? "-" : "+"} ${Math.abs(px)}px)`;
  };
  const position = fill ? `${shift(-ox * w * 0.5)} ${shift(-oy * h * 0.5)}` : "50% 50%";
  const css = `background-image:url("${url.replace(/["\\]/g, (c) => `\\${c}`)}");background-size:${fill ? "cover" : "contain"};background-position:${position}`;
  return html`<span class="wp-snap" role="img" aria-label="Snapshot" style=${css}></span>`;
}

/** A camera or camera group tile as the watch draws it: no tile ground, a
 * rounded box with its own border. */
function cameraFace(tile: WatchPageTile, width: number, height: number, box: string, input: WatchPagePreviewInput, unit: number, s: number, hint: string | undefined): TemplateResult {
  const entityId = tileEntityId(tile);
  const group = tileKind(entityId) === "multicam";
  const ink = ownInk(tile.color) ?? themeInk(input.page, "entityCamera");
  const radius = watchCameraCornerRadius(width, height) * s;
  const preview = tile.cameraDisplayMode === "preview";
  const symbolPt = watchPreviewIconSize(tile, width, height, height < unit * 2.5);
  const outer = `${box}border-radius:${radius}px`;
  // The watch strokes the rim over the content.
  const rim = html`<span class="wp-cam-rim" style=${`box-shadow:inset 0 0 0 ${(preview ? 1 : watchCameraBorderWidth(tile.borderThickness)) * s}px ${rgba(ink.hex, preview ? 0.3 : 0.6)}`}></span>`;
  if (!preview) {
    const symbol = group ? (typeof tile.icon === "string" ? tile.icon : "rectangle.split.2x2") : tile.icon === "" ? "" : (typeof tile.icon === "string" && tile.icon !== "" ? tile.icon : "video");
    const custom = typeof tile.customLabel === "string" ? tile.customLabel.trim() : "";
    const label = group ? (custom === "" ? "Cameras" : custom) : watchPreviewTileLabel(tile, input);
    const color = watchTileLabelColor(tile) ?? "#FFFFFF";
    return html`<div class="wp-cam icon" style=${`${outer};gap:${4 * s}px`} title=${hint ?? nothing}>
      ${symbol === "" ? nothing : symbolMark(input.icons, filledSymbol(input.icons, symbol, group), symbolPt * s, ink.hex, tile.iconShadow === true)}
      ${tileShowsLabel(tile) ? html`<span class="wp-label" style=${`${labelStyle(tile, width, s)};color:${color}`}>${label}</span>` : nothing}
      ${rim}
    </div>`;
  }
  if (!group) {
    const url = pictureOf(input.states, entityId);
    const symbol = tile.icon === "" ? undefined : (typeof tile.icon === "string" && tile.icon !== "" ? tile.icon : "video");
    const fill = tile.cameraFillMode === "fill";
    return html`<div class="wp-cam" style=${`${outer};background:#000`} title=${hint ?? nothing}>
      ${url !== undefined
        ? snapshot(url, fill, width, height, storedNumber(tile.cameraFillOffsetX) ?? 0, storedNumber(tile.cameraFillOffsetY) ?? 0, s)
        : html`<span class="wp-cam-empty"></span>${symbol === undefined ? nothing : html`<span style="opacity:0.6;display:flex">${symbolMark(input.icons, symbol, symbolPt * s, ink.hex)}</span>`}`}
      ${rim}
    </div>`;
  }
  const ids = Array.isArray(tile.cameraGroupIds) ? tile.cameraGroupIds.filter((id): id is string => typeof id === "string") : [];
  const border = watchMultiCamBorder(tile);
  if (ids.length === 0) {
    return html`<div class="wp-cam" style=${`${outer};background:${border.background}`} title=${hint ?? nothing}>
      <span style="opacity:0.6;display:flex">${symbolMark(input.icons, filledSymbol(input.icons, "rectangle.split.2x2", true), symbolPt * s, ink.hex)}</span>
      ${rim}
    </div>`;
  }
  const grid = watchMultiCamGrid(ids.length, tile.cameraGridColumns);
  const inset = border.on ? border.width : 0;
  const innerW = width - inset * 2;
  const innerH = height - inset * 2;
  const cellW = (innerW - border.spacing * (grid.columns - 1)) / Math.max(grid.columns, 1);
  const rows = watchMultiCamRowHeights(innerH, grid.rows, border.spacing, grid.columns, tile.cameraRowWeights);
  const offsetsX = Array.isArray(tile.cameraFillOffsetsX) ? tile.cameraFillOffsetsX : [];
  const offsetsY = Array.isArray(tile.cameraFillOffsetsY) ? tile.cameraFillOffsetsY : [];
  const cells: TemplateResult[] = [];
  let y = inset;
  for (let r = 0; r < grid.rows; r++) {
    const h = rows[r] ?? 0;
    for (let c = 0; c < grid.columns; c++) {
      const i = r * grid.columns + c;
      const x = inset + c * (cellW + border.spacing);
      const place = `left:${x * s}px;top:${y * s}px;width:${Math.max(0, cellW) * s}px;height:${Math.max(0, h) * s}px`;
      if (i >= ids.length) {
        cells.push(html`<span class="wp-cell" style=${place}></span>`);
        continue;
      }
      const id = ids[i]!;
      const url = pictureOf(input.states, id);
      const gone = lower(input.states?.[id]?.state) === "unavailable";
      const small = Math.min(cellW, h);
      cells.push(html`<span class="wp-cell" style=${place} title=${id}>
        ${url !== undefined
          ? snapshot(url, watchMultiCamCellFill(tile, i) === "fill", cellW, h, storedNumber(offsetsX[i]) ?? 0, storedNumber(offsetsY[i]) ?? 0, s)
          : html`<span style="opacity:0.2;display:flex">${symbolMark(input.icons, "video.fill", small * 0.3 * s, "#FFFFFF")}</span>`}
        ${gone ? html`<span class="wp-cell-gone"><span style="opacity:0.7;display:flex">${symbolMark(input.icons, "video.slash.fill", small * 0.25 * s, "#FFFFFF")}</span></span>` : nothing}
      </span>`);
    }
    y += h + border.spacing;
  }
  return html`<div class="wp-cam" style=${`${outer};background:${border.background}`} title=${hint ?? nothing}>${cells}${rim}</div>`;
}

/** How full the state bar is, 0 to 1, from the entity's attributes, or
 * undefined when the picture has nothing to read. */
export function watchTileStatePercent(tile: WatchPageTile, states?: Readonly<Record<string, HassEntityState>>): number | undefined {
  const entity = states?.[tileEntityId(tile)];
  if (entity === undefined) return undefined;
  const a = entity.attributes ?? {};
  const n = (v: unknown, k: number) => (typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.min(1, v / k)) : undefined);
  switch (tileKind(tileEntityId(tile))) {
    case "light":
      return watchTilePreviewActive(tile, states) ? (n(a.brightness, 255) ?? 1) : 0;
    case "cover":
    case "valve":
      return n(a.current_position, 100);
    case "fan":
      return watchTilePreviewActive(tile, states) ? (n(a.percentage, 100) ?? 1) : 0;
    case "media_player":
      return n(a.volume_level, 1);
    default:
      return undefined;
  }
}

/** The value label's size on the watch: its own, else by the tile's
 * smaller side (`dynamicBadgeFontSize`). */
export function watchBadgeFontSize(tile: WatchPageTile, widthPt: number, heightPt: number): number {
  const own = storedNumber(tile.badgeFontSizeOverride);
  if (own !== undefined) return own;
  const side = Math.min(widthPt, heightPt);
  return side < 25 ? 4 : side < 35 ? 5 : side < 50 ? 7 : 9;
}

/** A flat CSS color for a stored color: a gradient's first, a hint for the
 * rainbow. */
function flatInk(value: unknown, fallback: string): string {
  const c = parseTileColor(value);
  if (c?.kind === "rainbow") return "#FF9F0A";
  return c === undefined ? fallback : tileInkColor(c);
}

/**
 * The border and glow of a tile as inline style, or "" for none. A tile
 * with no color of its own draws in `fallbackInk` (its kind's color,
 * `watchTileFallbackInk`). Everything is times the tile's `colorOpacity`.
 * An animated border is its line with a tinted hint; Animate with no
 * animation is the plain line the watch draws, no glow.
 */
export function watchTileBorderStyle(tile: WatchPageTile, active: boolean, s: number, fallbackInk = "#FFFFFF"): string {
  const style = tile.borderStyle;
  if (style !== "line" && style !== "animate") return "";
  if (tile.borderActiveOnly !== false && !active) return "";
  const alpha = watchTileColorOpacity(tile);
  const w = watchBorderWidth(tile.borderThickness, active) * s;
  const tileInk = flatInk(tile.color, fallbackInk);
  const hex = flatInk(tile.borderColor === "#THEME" ? undefined : tile.borderColor, tileInk);
  const ink = active ? (alpha < 1 ? rgba(hex, alpha) : hex) : `rgba(255, 255, 255, ${Math.round(0.13 * alpha * 1000) / 1000})`;
  const line = style === "line" && (tile.borderLineStyle === "dashed" || tile.borderLineStyle === "dotted") ? tile.borderLineStyle : "solid";
  const parts = [`border:${Math.round(w * 100) / 100}px ${line} ${ink}`];
  const glow = storedNumber(tile.borderGlow) ?? 0;
  const animated = style === "animate" && typeof tile.borderAnimation === "string" && tile.borderAnimation !== "none";
  if (style === "line" && active && glow > 0) {
    const g = Math.min(1, glow);
    const ring = (spread: number, a: number) => `0 0 ${spread * s}px ${(spread / 2) * s}px ${rgba(hex, a * g * alpha)}`;
    parts.push(`box-shadow:${[ring(4, 0.15), ring(2.5, 0.25), ring(1.5, 0.4), ring(0.5, 0.7)].join(", ")}`);
  } else if (animated && active) {
    parts.push(`box-shadow:0 0 ${3 * s}px ${rgba(hex, 0.45 * alpha)}`);
  }
  return parts.join(";");
}

/**
 * A spacer as the watch's `SpacerTile` draws it, as inline style: a wash of
 * its color (gray without one), stronger once anything is set, and a solid
 * line in that color at any `borderThickness` but none, whatever the border
 * style says (auto draws 2 points once anything is set). Its line style,
 * glow, "only when on", border color and animations do nothing there. All
 * times `colorOpacity`.
 */
export function watchSpacerStyle(tile: WatchPageTile, s: number): string {
  const alpha = watchTileColorOpacity(tile);
  const ink = flatInk(tile.color, "#8E8E93");
  const pattern = typeof tile.backgroundPattern === "string" ? tile.backgroundPattern : "none";
  const thickness = typeof tile.borderThickness === "string" ? tile.borderThickness : "extraThin";
  const customized = (tile.color !== undefined && tile.color !== null) || pattern !== "none" || thickness !== "auto";
  const [a, b, c] = customized ? [0.5, 0.3, 0.4] : [0.2, 0.1, 0.15];
  const width = thickness === "auto" ? (customized ? 2 : 0) : watchBorderWidth(thickness, true);
  const parts = [`background:linear-gradient(135deg, ${rgba(ink, a * alpha)}, ${rgba(ink, b * alpha)} 50%, ${rgba(ink, c * alpha)})`];
  parts.push(width > 0 ? `border:${Math.round(width * s * 100) / 100}px solid ${rgba(ink, 0.8 * alpha)}` : "border:0");
  return parts.join(";");
}

/** The layers drawn inside a tile behind its content: the effect's hint,
 * the pattern (times `colorOpacity` on a tile; a spacer's is not), the state
 * bar's fill. A spacer has no effect and no bar. */
function tileUnderlay(tile: WatchPageTile, input: WatchPagePreviewInput, active: boolean, heightPt: number, s: number, spacer = false): TemplateResult | typeof nothing {
  const tileInk = flatInk(tile.color, watchTileFallbackInk(tile, input.page));
  const layers: string[] = [];
  const pattern = typeof tile.backgroundPattern === "string" ? tile.backgroundPattern : "none";
  if (pattern !== "none") {
    const own = parseTileColor(tile.patternColor);
    const ink = own === undefined ? "#737373" : tileInkColor(own);
    const opacity = (storedNumber(tile.patternOpacity) ?? 1) * (spacer ? 1 : watchTileColorOpacity(tile));
    layers.push(...watchPatternLayers(pattern, ink, opacity, (storedNumber(tile.patternScale) ?? 1) * s));
  }
  const effect = typeof tile.tileAnimation === "string" ? tile.tileAnimation : "none";
  if (!spacer && effect !== "none" && !(tile.effectActiveOnly === true && !active)) {
    const ink = flatInk(tile.animationColor, tileInk);
    layers.push(`radial-gradient(ellipse at 70% 30%, ${rgba(ink, 0.35)}, transparent 70%)`);
  }
  const bar = spacer ? undefined : barOf(tile, input, active);
  if (bar !== undefined && bar.fill) {
    const h = Math.round(heightPt * bar.percent * s * 100) / 100;
    layers.push(`linear-gradient(0deg, ${rgba(bar.ink, 0.7)}, ${rgba(bar.ink, 0.3)}) left bottom / 100% ${h}px no-repeat`);
  }
  return layers.length === 0 ? nothing : html`<span class="wp-under" style=${`background:${layers.join(", ")}`}></span>`;
}

/** The state bar of a tile, when the picture draws one: in the tile's
 * color (its kind's when it has none), or white. */
function barOf(tile: WatchPageTile, input: WatchPagePreviewInput, active: boolean): { fill: boolean; percent: number; ink: string } | undefined {
  if (!watchStateDomains("bars").includes(tileKind(tileEntityId(tile))) || watchTileIsTvRemote(tile, input.states)) return undefined;
  const percent = watchTileStatePercent(tile, input.states);
  if (percent === undefined || percent <= 0 || !active) return undefined;
  const ink = tile.stateBarColorStyle === "White" ? "#B3B3B3" : flatInk(tile.color, watchTileFallbackInk(tile, input.page));
  return { fill: tile.stateBarStyle === "Fill", percent, ink };
}

/** The watch's padding of a tile's value label, by the tile's smaller side
 * (`dynamicBadgePadding`). */
export function watchBadgePadding(widthPt: number, heightPt: number): number {
  const side = Math.min(widthPt, heightPt);
  return side < 25 ? 2 : side < 35 ? 3 : side < 50 ? 4 : 6;
}

/** How a tile shows its reading: hidden (Off), plain, or in a capsule
 * (Pill), for the domains whose value label the watch draws. Undefined for
 * every other tile. */
export function watchValueLabelStyle(tile: WatchPageTile): "Off" | "Plain" | "Pill" | undefined {
  if (!watchStateDomains("valueLabels").includes(tileKind(tileEntityId(tile)))) return undefined;
  const style = tile.stateValueLabelStyle;
  return style === "Off" || style === "Pill" ? style : "Plain";
}

function pillStyle(s: number): string {
  return `box-shadow:inset 0 0 0 ${0.5 * s}px rgba(255, 255, 255, 0.2);padding:0 ${3 * s}px;border-radius:999px`;
}

/** The top bar and the value label, over the content. */
function tileOverlay(tile: WatchPageTile, input: WatchPagePreviewInput, active: boolean, widthPt: number, heightPt: number, s: number): TemplateResult | typeof nothing {
  const bar = barOf(tile, input, active);
  const parts: TemplateResult[] = [];
  if (bar !== undefined && !bar.fill) {
    const style = [
      `top:${4 * s}px`, `left:${6 * s}px`, `height:${3 * s}px`,
      `width:${Math.max(0, (widthPt - 12) * bar.percent * s)}px`,
      `background:${rgba(bar.ink, 0.3)}`,
      tile.stateBarBorder === true ? `box-shadow:inset 0 0 0 ${s}px rgba(255, 255, 255, 0.25)${tile.stateBarShadow === true ? `, 0 ${0.5 * s}px ${1.5 * s}px rgba(0, 0, 0, 0.6)` : ""}`
        : tile.stateBarShadow === true ? `box-shadow:0 ${0.5 * s}px ${1.5 * s}px rgba(0, 0, 0, 0.6)` : "",
    ].filter((p) => p !== "").join(";");
    parts.push(html`<span class="wp-bar" style=${style}></span>`);
  }
  const badge = valueBadge(tile, input, active, widthPt, heightPt);
  if (badge !== undefined) {
    const style = [
      `font-size:${badge.size * s}px`,
      `top:${badge.top * s}px`,
      `left:${badge.left * s}px`,
      badge.pill ? pillStyle(s) : "",
      tile.statusTextShadow === false ? "" : `text-shadow:0 ${s}px ${2 * s}px rgba(0, 0, 0, 0.8)`,
    ].filter((p) => p !== "").join(";");
    parts.push(html`<span class="wp-value" style=${style}>${badge.text}</span>`);
  }
  return parts.length === 0 ? nothing : html`${parts}`;
}

/** The value label of a tile with a state bar, in points: top left at the
 * badge padding, 2 points lower under a top bar, as the watch puts it. */
function valueBadge(tile: WatchPageTile, input: WatchPagePreviewInput, active: boolean, widthPt: number, heightPt: number) {
  const kind = tileKind(tileEntityId(tile));
  const style = watchValueLabelStyle(tile);
  if (!watchStateDomains("bars").includes(kind) || style === undefined || style === "Off" || watchTileIsTvRemote(tile, input.states)) return undefined;
  const percent = watchTileStatePercent(tile, input.states);
  if (percent === undefined) return undefined;
  const bar = barOf(tile, input, active);
  const pad = watchBadgePadding(widthPt, heightPt);
  const top = pad + (bar !== undefined && !bar.fill ? 2 : 0);
  const size = watchBadgeFontSize(tile, widthPt, heightPt);
  return { text: !active && kind === "light" ? "OFF" : `${Math.round(percent * 100)}%`, top, left: pad, size, pill: style === "Pill", bottom: top + size * 1.3 };
}

/** A sensor's state with the tile's decimals when it is a number. */
function stateWithDecimals(tile: WatchPageTile, text: string | undefined, input: WatchPagePreviewInput): string | undefined {
  if (text === undefined || !watchStateDomains("decimals").includes(tileKind(tileEntityId(tile)))) return text;
  const entity = input.states?.[tileEntityId(tile)];
  const raw = entity === undefined ? NaN : Number(entity.state);
  if (!Number.isFinite(raw) || String(entity?.state ?? "").trim() === "") return text;
  const places = Math.max(0, Math.min(3, Math.trunc(storedNumber(tile.decimalPlaces) ?? 1)));
  const unit = entity?.attributes?.unit_of_measurement;
  return `${raw.toFixed(places)}${typeof unit === "string" && unit.trim() !== "" ? ` ${unit.trim()}` : ""}`;
}

// ── the page title ───────────────────────────────────────────────────────

/** The title's size in points: `size12` is 12. */
export function watchPageTitleSize(value: unknown): number {
  const m = typeof value === "string" ? /^size(\d+)$/.exec(value) : null;
  return m ? Number(m[1]) : 10;
}

/** The page title in the top band, as the watch draws it: hidden with style
 * none or on a full screen page; its icon (absent is `house`, empty none),
 * its color (else the theme's page color at 0.95), its size. */
export function renderWatchPageTitle(page: WatchPage, s: number, topInset: number, icons: IconProvider | undefined): TemplateResult | typeof nothing {
  const style = watchPageValue(page, "pageTitleDisplayStyle");
  if (typeof style !== "string" || style === "none" || page.fullScreen === true || topInset <= 0) return nothing;
  const size = watchPageTitleSize(watchPageValue(page, "pageTitleTextSize")) * s;
  const own = parseTileColor(page.pageTitleTextColor);
  const role = watchStylingTheme(watchPageTheme(page))?.roles.entityPage;
  const ink = own === undefined || own.kind === "rainbow" ? (role === undefined ? "rgba(255, 255, 255, 0.95)" : rgba(role, 0.95)) : tileInkColor(own);
  const iconName = page.pageTitleIcon === undefined || page.pageTitleIcon === null ? "house" : String(page.pageTitleIcon);
  const glyph = iconName === "" ? undefined : icons?.render(iconName, size, own === undefined ? (role ?? "#FFFFFF") : tileInkColor(own));
  const box = [
    `top:${(topInset * s - size * 1.6) / 2}px`, `left:${12 * s}px`, `font-size:${size}px`, `color:${ink}`, `height:${size * 1.6}px`,
    style === "pill" ? `background:rgba(255, 255, 255, 0.12);padding:0 ${size * 0.6}px;border-radius:999px` : "",
    style === "glass" ? `background:rgba(255, 255, 255, 0.18);box-shadow:inset 0 0 0 1px rgba(255, 255, 255, 0.25);padding:0 ${size * 0.6}px;border-radius:999px` : "",
  ].filter((p) => p !== "").join(";");
  return html`<span class="wp-title ${style}" style=${box}>${glyph === undefined ? nothing : html`<svg width=${size} height=${size} viewBox=${`0 0 ${size} ${size}`} aria-hidden="true">${glyph}</svg>`}<span>${watchPageName(page)}</span></span>`;
}

function symbolMark(icons: IconProvider | undefined, symbol: string | undefined, px: number, ink: string, shadow = false): TemplateResult {
  const glyph = symbol === undefined ? undefined : icons?.render(symbol, px, ink);
  return html`<svg class="wp-sym ${shadow ? "shadow" : ""}" width=${px} height=${px} viewBox=${`0 0 ${px} ${px}`} aria-hidden="true">${glyph
    ?? svg`<circle cx=${px / 2} cy=${px / 2} r=${px / 5} fill=${ink} fill-opacity="0.7" />`}</svg>`;
}

// ── the basic settings, as the watch reads them ─────────────────────────

/** The watch's label size for a tile with no size of its own, by the
 * tile's width in points (`dynamicLabelFontSize` in the app). */
export function watchAutoLabelFontSize(widthPt: number): number {
  if (widthPt < 30) return 6;
  if (widthPt < 45) return 7;
  if (widthPt < 60) return 8;
  if (widthPt < 80) return 9;
  return 10;
}

function storedNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/** The label's size in points: `labelFontSizeOverride`, else the watch's
 * automatic size for the tile's width (`effectiveLabelFontSize`). */
export function watchTileLabelFontSize(tile: WatchPageTile, widthPt: number): number {
  return storedNumber(tile.labelFontSizeOverride) ?? watchAutoLabelFontSize(widthPt);
}

/**
 * The symbol's size on the watch, in points, for a tile of this size
 * (`effectiveIconSize` in the app): `iconSizeOverride` held to what fits, at
 * least 8; with none, the most that fits, from 10 up to 36 (40 when there is
 * no label). A tile under 35 points tall, or one with its label off, gives
 * the label's room to the symbol.
 */
export function watchTileIconSize(tile: WatchPageTile, widthPt: number, heightPt: number): number {
  const roomForLabel = heightPt >= 35 && tile.showLabel !== false;
  const fit = Math.min(roomForLabel ? widthPt * 0.64 : widthPt * 0.7, roomForLabel ? heightPt * 0.54 : heightPt * 0.68);
  const override = storedNumber(tile.iconSizeOverride);
  if (override !== undefined) return Math.max(8, Math.min(override, fit));
  return Math.max(10, Math.min(fit, roomForLabel ? 36 : 40));
}

/**
 * The symbol's size in the picture. The picture's tiles carry a state line
 * the watch draws elsewhere, so its own automatic size is smaller than the
 * watch's; an icon size of the tile's own is drawn in the same proportion to
 * that as on the watch, so setting the watch's automatic size changes
 * nothing and a smaller one draws smaller.
 */
export function watchPreviewIconSize(tile: WatchPageTile, widthPt: number, heightPt: number, compact: boolean): number {
  const auto = Math.max(9, Math.min(24, Math.min(widthPt, heightPt) * (compact ? 0.5 : 0.3)));
  if (storedNumber(tile.iconSizeOverride) === undefined) return auto;
  const { iconSizeOverride: _own, ...rest } = tile;
  return (auto * watchTileIconSize(tile, widthPt, heightPt)) / watchTileIconSize(rest, widthPt, heightPt);
}

/** Whether the tile draws no symbol: `icon` is `""`, the phone's No icon. */
export function watchTileHasNoIcon(tile: WatchPageTile): boolean {
  return tile.icon === "";
}

const LABEL_WEIGHTS: Readonly<Record<string, number>> = { light: 300, regular: 400, medium: 500, semibold: 600, bold: 700 };

/** The label's CSS weight. An absent or unknown weight is regular, as on
 * the watch (`resolvedLabelWeight`). */
export function watchTileLabelWeight(tile: WatchPageTile): number {
  const w = tile.labelFontWeight;
  return typeof w === "string" && Object.hasOwn(LABEL_WEIGHTS, w) ? LABEL_WEIGHTS[w]! : 400;
}

const LABEL_FAMILIES: Readonly<Record<string, string>> = {
  rounded: 'ui-rounded, "SF Pro Rounded", "Nunito", "Varela Round", system-ui, sans-serif',
  monospaced: 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace',
  serif: 'ui-serif, "New York", Georgia, "Times New Roman", serif',
};

/** The label's CSS font family for its design, or undefined for the
 * default design (the preview's own system font). */
export function watchTileLabelFamily(tile: WatchPageTile): string | undefined {
  const d = tile.labelFontDesign;
  return typeof d === "string" && Object.hasOwn(LABEL_FAMILIES, d) ? LABEL_FAMILIES[d] : undefined;
}

/** The label's own color as one hex (a gradient's first color, as the
 * watch draws it), or undefined for the theme's. */
export function watchTileLabelColor(tile: WatchPageTile): string | undefined {
  const color = parseTileColor(tile.labelColorHex);
  return color === undefined || color.kind === "rainbow" ? undefined : tileInkColor(color);
}

/** A header's look: its style, text size (`labelFontSizeOverride`, else
 * 10) and line glow as the watch reads it (`dividerParts`: not held to 0 to
 * 1, and 0 or below draws no glow). */
export function watchHeaderLook(tile: WatchPageTile): { style: "line" | "label"; textSize: number; glow: number } {
  const { style, glow } = dividerParts(tileEntityId(tile));
  return { style, textSize: storedNumber(tile.labelFontSizeOverride) ?? 10, glow };
}

/** An HTTP action tile that shows its reply on the tile (Tile Value): the
 * watch draws the value where the icon would be, sized, colored and moved by
 * the tile's keys, with the name under it unless Show Name is off. The
 * preview has no value to show, so it draws a dash, as the watch does before
 * the first run. Undefined for any other tile. */
export function watchHTTPTileValueLook(
  tile: WatchPageTile,
): { fontSize: number | undefined; color: string | undefined; offsetY: number; showName: boolean } | undefined {
  if (tileKind(tileEntityId(tile)) !== "http_action" || tile.httpResponseDisplay !== "tileValue") return undefined;
  const size = storedNumber(tile.httpTileValueFontSize);
  const color = parseTileColor(tile.httpTileValueColorHex);
  return {
    fontSize: size !== undefined && size > 0 ? Math.min(Math.max(size, 6), 60) : undefined,
    color: color === undefined || color.kind === "rainbow" ? undefined : tileInkColor(color),
    offsetY: Math.max(-20, Math.min(20, storedNumber(tile.httpTileValueOffsetY) ?? 0)),
    showName: tile.httpTileValueShowName !== false,
  };
}

/** The label's inline style: size, weight, design, color and shadow. */
function labelStyle(tile: WatchPageTile, widthPt: number, s: number): string {
  const family = watchTileLabelFamily(tile);
  const color = watchTileLabelColor(tile);
  return [
    `font-size:${watchTileLabelFontSize(tile, widthPt) * s}px`,
    `font-weight:${watchTileLabelWeight(tile)}`,
    family === undefined ? "" : `font-family:${family}`,
    color === undefined ? "" : `color:${color}`,
    tile.labelShadow === false ? "" : `text-shadow:0 ${0.5 * s}px ${1.5 * s}px rgba(0, 0, 0, 0.75)`,
  ].filter((p) => p !== "").join(";");
}

/** A header's line: thicker and brighter with its glow. */
function headerLine(stored: number, s: number, quiet: boolean): TemplateResult {
  const base = quiet ? 0.35 : 0.5;
  // The watch draws any glow above 0, through opacities that stop at 1, so
  // a glow above 1 draws as 1 does.
  const glow = Math.min(1, stored);
  const style = glow > 0
    ? `height:${(1 + glow) * s}px;opacity:${0.7 + 0.3 * glow};background:color-mix(in srgb, var(--ink), #fff ${Math.round(glow * 45)}%);box-shadow:0 0 ${2 * glow * s}px ${glow * s}px color-mix(in srgb, var(--ink) ${Math.round(40 * glow)}%, transparent)`
    : `height:${Math.max(1, (quiet ? 0.5 : 1) * s)}px;opacity:${base}`;
  return html`<span class="wp-divider-line" style=${style}></span>`;
}

function renderTile(placed: PlacedWatchTile, input: WatchPagePreviewInput, unit: number, top: number, s: number): TemplateResult {
  const { tile, x, y, width, height } = placed;
  const box = `left:${x * s}px;top:${(top + y) * s}px;width:${width * s}px;height:${height * s}px;`;
  return tileFace(tile, width, height, box, input, unit, s, true);
}

/** A tile's look alone, filling the box it is put in (which must be
 * positioned), for the editor's tiles: the editor wraps each in a button of
 * its own and moves that. `width` and `height` are the tile's size in points,
 * which the look is worked out from. */
export function renderWatchTileFace(
  tile: WatchPageTile,
  size: { width: number; height: number },
  input: WatchPagePreviewInput,
  unit: number,
): TemplateResult {
  return tileFace(tile, size.width, size.height, "inset:0;", input, unit, input.scale ?? 1.5, false);
}

function tileFace(
  tile: WatchPageTile,
  width: number,
  height: number,
  box: string,
  input: WatchPagePreviewInput,
  unit: number,
  s: number,
  titled: boolean,
): TemplateResult {
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  const cls = tileClass(entityId, input.states);
  const color = parseTileColor(tile.color);
  const ink = tileInkColor(color);
  const label = watchPreviewTileLabel(tile, input);
  const kindLabel = tileKindLabel(kind);
  const hint = [label, kindLabel, entityId].filter((t, i, all) => t !== "" && all.indexOf(t) === i).join(" · ");

  if (cls === "divider") {
    // As the watch draws it: a line across, or the label between two
    // fainter lines.
    const look = watchHeaderLook(tile);
    const labelled = look.style === "label";
    return html`<div class="wp-divider ${labelled ? "label" : ""}" style=${`${box}--ink:${ink};font-size:${look.textSize * s}px`} title=${titled ? hint : nothing}>
      ${labelled ? html`${headerLine(look.glow, s, true)}${label !== "" ? html`<span class="wp-divider-label">${label}</span>` : nothing}${headerLine(look.glow, s, true)}` : headerLine(look.glow, s, false)}
    </div>`;
  }
  if (cls === "spacer") {
    return html`<div class="wp-spacer" style=${`${box}border-radius:${Math.min(TILE_RADIUS, width / 2, height / 2) * s}px;${watchSpacerStyle(tile, s)}`} title=${titled ? hint : nothing}>${tileUnderlay(tile, input, true, height, s, true)}</div>`;
  }

  if (kind === "camera" || kind === "multicam") return cameraFace(tile, width, height, box, input, unit, s, titled ? hint : undefined);

  const unknown = cls === "unknown";
  const radius = Math.min(TILE_RADIUS, width / 2, height / 2) * s;
  // A tile shorter than two and a half units has no room for a column, so its
  // symbol and words sit side by side.
  const compact = height < unit * 2.5;
  const symbolPt = watchPreviewIconSize(tile, width, height, compact);
  // A remote, vacuum, mower, climate, person or alarm panel: its own
  // symbol, color and badges.
  const look = unknown ? undefined : watchSpecialTileLook(tile, input);
  const special = look === undefined ? undefined : specialBadges(tile, look, input, width, height, s);
  // The reading of a tile whose value label the watch draws without a bar
  // (a sensor, a climate): hidden with Off, in a capsule with Pill.
  const readingStyle = unknown || watchStateDomains("bars").includes(kind) ? undefined : watchValueLabelStyle(tile);
  const reading = unknown ? kindLabel : cls === "virtual" ? kindLabel : stateWithDecimals(tile, tileStateText(tile, input.states), input);
  // Tile Value: the value in place of the symbol, the name under it or not,
  // and no line of the kind.
  const value = watchHTTPTileValueLook(tile);
  const state = readingStyle === "Off" || value !== undefined || (look !== undefined && !look.stateLine) ? undefined : reading;
  const showLabel = tileShowsLabel(tile) && (value === undefined || value.showName);
  const ground = unknown ? "rgba(255, 255, 255, 0.08)" : tileGround(color, watchTileColorOpacity(tile));
  const active = watchTilePreviewActive(tile, input.states);
  const border = unknown ? "" : watchTileBorderStyle(tile, active, s, watchTileFallbackInk(tile, input.page));
  // The picture's symbol sits top left, where the watch puts the value
  // label: a column moves down under the label.
  const badge = unknown || compact ? undefined : valueBadge(tile, input, active, width, height);
  const badgeBottom = Math.max(badge?.bottom ?? 0, compact ? 0 : (special?.bottom ?? 0));
  const padTop = Math.max(Math.min(TILE_PAD, height / 4), badgeBottom === 0 ? 0 : Math.min(badgeBottom + 1, height / (special === undefined ? 3 : 2)));
  // A special tile's badges can stand taller than a value label: its symbol
  // (or photo) shrinks to the room left, so nothing is drawn over it.
  const room = compact ? Infinity
    : height - padTop - Math.min(TILE_PAD, height / 4) - 3
      - (showLabel ? watchTileLabelFontSize(tile, width) * 1.15 + 3 : 0) - (state !== undefined ? 9 * 1.15 + 3 : 0);
  return html`<div class="wp-tile ${compact ? "compact" : ""} ${unknown ? "unknown" : ""}"
    style=${`${box}border-radius:${radius}px;background:${ground};padding:${padTop * s}px ${Math.min(TILE_PAD + 1, width / 4) * s}px ${Math.min(TILE_PAD, height / 4) * s}px;gap:${3 * s}px;${border}`}
    title=${titled ? hint : nothing}>
    ${unknown ? nothing : tileUnderlay(tile, input, active, height, s)}
    ${unknown ? nothing : tileOverlay(tile, input, active, width, height, s)}
    ${special === undefined ? nothing : special.parts}
    ${value !== undefined
      ? html`<span class="wp-value" style=${`font-size:${(value.fontSize ?? symbolPt) * s}px;color:${value.color ?? "#FFFFFF"}${value.offsetY === 0 ? "" : `;transform:translateY(${value.offsetY * s}px)`}`}>—</span>`
      : look !== undefined
        ? specialSymbol(look, input.icons, symbolPt, room, s, tile.iconShadow === true)
        : !unknown && watchTileHasNoIcon(tile)
          ? nothing
          : symbolMark(input.icons, unknown ? undefined : tileSymbol(tile), symbolPt * s, unknown ? "#8E8E93" : ink, tile.iconShadow === true)}
    <span class="wp-words">
      ${showLabel ? html`<span class="wp-label" style=${labelStyle(tile, width, s)}>${label}</span>` : nothing}
      ${state === undefined ? nothing : html`<span class="wp-state ${readingStyle === "Pill" ? "pill" : ""}" style=${`font-size:${9 * s}px${readingStyle === "Pill" ? `;${pillStyle(s)}` : ""}`}>${state}</span>`}
    </span>
  </div>`;
}

/** One page drawn at the watch's size. A page taller than the screen grows
 * downward, with a line where the screen ends. */
export function renderWatchPagePreview(input: WatchPagePreviewInput): TemplateResult {
  const s = input.scale ?? 1.5;
  const { page, screen } = input;
  const width = screen.width * s;
  const name = watchPageName(page);
  if (isSmartWatchPage(page)) {
    const domains = smartPageDomains(page).map(smartDomainLabel);
    return html`<div class="wp-screen" role="img" aria-label=${`${name}, a smart page`}
      style=${`width:${width}px;height:${screen.height * s}px;background:${watchScreenBackground(page, s)}`}>
      <div class="wp-smart">
        <b>Smart page</b>
        <span>${domains.length > 0
          ? `The watch fills this page itself with: ${domains.join(", ")}.`
          : "The watch fills this page itself."}</span>
      </div>
    </div>`;
  }
  const layout = watchPageLayout(page, screen);
  const scrolls = watchPagePreviewScrolls(page, screen);
  return html`<div class="wp-screen" role="group" aria-label=${`Preview of ${name}`}
    style=${`width:${width}px;height:${layout.height * s}px;background:${watchScreenBackground(page, s)}`}>
    ${layout.topInset > 0 ? html`<span class="wp-clock" style=${`font-size:${13 * s}px;height:${layout.topInset * s}px;padding-right:${12 * s}px`}>10:09</span>` : nothing}
    ${renderWatchPageTitle(page, s, layout.topInset, input.icons)}
    ${layout.tiles.length === 0 ? html`<div class="wp-smart"><span>No tiles on this page.</span></div>` : nothing}
    ${layout.tiles.map((placed) => renderTile(placed, input, layout.unit, layout.topInset, s))}
    ${scrolls ? renderWatchScreenFold(screen.height * s) : nothing}
  </div>`;
}

/** The dashed line where the watch's screen ends. The words that explain it
 * go outside the picture (`WATCH_SCREEN_FOLD_TEXT`), where they cover no
 * tile. */
export function renderWatchScreenFold(top: number): TemplateResult {
  return html`<div class="wp-fold" style=${`top:${top}px`} title=${WATCH_SCREEN_FOLD_TEXT}></div>`;
}

export const WATCH_SCREEN_FOLD_TEXT = "The dashed line marks the end of the watch's screen. The page scrolls on below it.";

/** Whether the picture of a page runs past the screen, so it shows the
 * fold. A smart page never does. */
export function watchPagePreviewScrolls(page: WatchPage, screen: { width: number; height: number }): boolean {
  return !isSmartWatchPage(page) && watchPageLayout(page, screen).height > screen.height + 0.5;
}

/** The picture's own rules. The screen is dark in both of the panel's skins,
 * as a watch screen is. */
export const watchPagePreviewStyles = css`
  .wp-screen {
    position: relative;
    flex: none;
    overflow: hidden;
    border-radius: 28px;
    box-shadow: 0 0 0 6px var(--wa-art-case, #2b2f3d);
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", Roboto, sans-serif;
    line-height: 1.15;
  }
  .wp-clock {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.85);
    font-variant-numeric: tabular-nums;
  }
  .wp-tile {
    position: absolute;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    overflow: hidden;
  }
  .wp-tile.compact { flex-direction: row; align-items: center; justify-content: flex-start; }
  .wp-tile.unknown { outline: 1px dashed rgba(255, 255, 255, 0.3); outline-offset: -1px; }
  .wp-sym { display: block; flex: none; position: relative; }
  .wp-words { position: relative; }
  .wp-under { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; }
  .wp-bar { position: absolute; border-radius: 999px; pointer-events: none; }
  .wp-value {
    position: absolute; line-height: 1.3; color: rgba(255, 255, 255, 0.62); pointer-events: none;
    font-family: ui-rounded, "SF Pro Rounded", "Nunito", system-ui, sans-serif; font-weight: 600;
  }
  .wp-title {
    position: absolute; display: flex; align-items: center; gap: 0.35em; max-width: 60%;
    font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none;
  }
  .wp-title svg { flex: none; display: block; }
  .wp-title > span { overflow: hidden; text-overflow: ellipsis; }
  .wp-sym.shadow { filter: drop-shadow(0 1px 1.5px rgba(0, 0, 0, 0.7)); }
  .wp-sym-fade { display: block; flex: none; position: relative; }
  .wp-photo { display: block; flex: none; position: relative; box-sizing: border-box; border-radius: 50%; object-fit: cover; background: #000; }
  .wp-badge {
    position: absolute; display: flex; flex-direction: column; line-height: 1.15; white-space: nowrap; pointer-events: none;
    font-family: ui-rounded, "SF Pro Rounded", "Nunito", system-ui, sans-serif; font-variant-numeric: tabular-nums;
  }
  .wp-badge.row { flex-direction: row; align-items: center; font-weight: 500; }
  .wp-badge svg { display: block; }
  .wp-cam {
    position: absolute; box-sizing: border-box; overflow: hidden;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .wp-cam.icon { background: rgba(0, 0, 0, 0.3); }
  .wp-cam .wp-label { max-width: 90%; position: relative; }
  .wp-cam-rim { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; }
  .wp-cam-empty { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.3); }
  .wp-snap { position: absolute; inset: 0; display: block; background-repeat: no-repeat; }
  .wp-cell { position: absolute; overflow: hidden; background: #000; display: flex; align-items: center; justify-content: center; }
  .wp-cell-gone { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(255, 59, 48, 0.3); }
  .wp-value { flex: none; line-height: 1; font-weight: 600; font-variant-numeric: tabular-nums; }
  .wp-words { display: flex; flex-direction: column; min-width: 0; max-width: 100%; }
  .wp-label, .wp-state { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .wp-state { color: rgba(255, 255, 255, 0.62); }
  .wp-spacer {
    position: absolute;
    box-sizing: border-box;
    overflow: hidden;
  }
  .wp-divider {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--ink);
  }
  .wp-divider-label {
    flex: none; max-width: 70%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    font-family: ui-rounded, "SF Pro Rounded", "Nunito", system-ui, sans-serif; font-weight: 600; opacity: 0.8;
  }
  .wp-divider-line { flex: 1; min-width: 0; border-radius: 999px; background: var(--ink); }
  .wp-fold {
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px dashed rgba(255, 255, 255, 0.55);
    pointer-events: none;
  }
  .wp-smart {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 24px;
    text-align: center;
    color: rgba(255, 255, 255, 0.75);
    font-size: 13px;
  }
  .wp-smart > b { color: #fff; font-size: 15px; }
`;
