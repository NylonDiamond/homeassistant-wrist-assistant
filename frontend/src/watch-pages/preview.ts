// A plain picture of one watch page: the screen at the watch's size in the
// watch's case, its 12 column grid, and each tile at its place and size with
// its color, symbol, name and badge.
//
// The placement comes from `watchPageLayout`, which is the watch's own
// arithmetic, and a tile is laid out as the watch lays it out (the symbol's
// size and lift, the name's size and gap, the badges, the corners, the lit
// and unlit glass), in CSS. Styling is drawn flat (part 3d): borders at the
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
  WATCH_KIND_FALLBACK_LABELS,
  dividerParts,
  isSmartWatchPage,
  parseTileColor,
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
import {
  type WatchTemplateRender,
  watchInboxLabel,
  watchMusicHubActiveSpeaker,
  watchTemplateRender,
  watchTemplateText,
} from "./app-model.js";
import { templateIconColor, templateRichTextSegments } from "./rich-text.js";
import { renderWatchFrame } from "../watch-frame.js";
import { readSmartConfig, smartRuleIndexForTile, smartSyntheticPage, smartTrackingWords, smartWord } from "./smart-model.js";

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
  /** The template tiles' renders by tile id (`render_values`), each with the
   * text it was asked for, which a template tile draws as the watch does. A
   * tile missing here, or whose render was for another text, draws "...". */
  templates?: ReadonlyMap<string, WatchTemplateRender>;
  /** A smart page's view (part 3f batch 3): the selected rule's index in
   * its `rules`, whose tiles draw full while every other tile and header
   * draws at 30%, and what a click on a tile does with the index of the
   * rule that drew it. Without `pick` the tiles are not buttons. */
  smart?: { rule?: number; pick?: (ruleIndex: number) => void };
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

/** A tile's corner radius on the watch in points, by its smaller side
 * (`TileStyleModifier.cornerRadius`, the spacer's and the camera's too): 4
 * under 25, 5 under 40, 6 under 60, else 8. */
export function watchTileCornerRadius(widthPt: number, heightPt: number): number {
  const side = Math.min(widthPt, heightPt);
  return side < 25 ? 4 : side < 40 ? 5 : side < 60 ? 6 : 8;
}

/** Whether the watch draws a tile's name: the tile is at least 35 points
 * tall and its label is not turned off (`shouldShowLabel`). */
export function watchTileLabelShown(tile: WatchPageTile, heightPt: number): boolean {
  return heightPt >= 35 && tileShowsLabel(tile);
}

/** The gap under a tile's name in points, by the tile's height
 * (`dynamicLabelBottomPadding`): 1 under 35, 3 under 50, 4 under 70, else 5. */
export function watchLabelBottomPadding(heightPt: number): number {
  return heightPt < 35 ? 1 : heightPt < 50 ? 3 : heightPt < 70 ? 4 : 5;
}

/** How far the symbol is lifted off the centre in points while the name
 * shows (`dynamicIconVerticalOffset`): 2 under 50 tall, 3 under 70, else 4;
 * none without a name. Negative is up. */
export function watchIconVerticalOffset(tile: WatchPageTile, heightPt: number): number {
  if (!watchTileLabelShown(tile, heightPt)) return 0;
  return heightPt < 50 ? -2 : heightPt < 70 ? -3 : -4;
}

function rgba(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1, 7), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${Math.round(alpha * 1000) / 1000})`;
}

const RAINBOW_STOPS = ["255, 59, 48", "255, 149, 0", "255, 204, 0", "52, 199, 89", "0, 122, 255", "175, 82, 222"];

/**
 * A tile's glass as CSS background layers, top first, everything times
 * `alpha` (the tile's `colorOpacity`). On (`activeGlassBackground`): a white
 * sheen from 0.32 at the top through 0.10 to clear at the middle, the color
 * at 0.52 (a gradient at 0.32, the rainbow at 0.42), over the frosted
 * material at 0.62. Off (`inactiveGlassBackground`): the faint material at
 * 0.3, the color at 0.025 (a gradient at 0.03) and gray at 0.06. A tile with
 * no color of its own is filled in `ink`, its kind's color.
 */
export function watchTileFill(color: WatchTileColor | undefined, ink: string, active: boolean, alpha = 1): string {
  const a = (n: number) => Math.round(n * alpha * 1000) / 1000;
  const flat = (c: string) => `linear-gradient(${c}, ${c})`;
  if (active) {
    const sheen = `linear-gradient(180deg, rgba(255, 255, 255, ${a(0.32)}), rgba(255, 255, 255, ${a(0.1)}) 25%, rgba(255, 255, 255, 0) 50%)`;
    const tint = color?.kind === "rainbow"
      ? `linear-gradient(135deg, ${RAINBOW_STOPS.map((c) => `rgba(${c}, ${a(0.42)})`).join(", ")})`
      : color?.kind === "gradient"
        ? `linear-gradient(135deg, ${rgba(color.from, 0.32 * alpha)}, ${rgba(color.to, 0.32 * alpha)})`
        : flat(rgba(color?.kind === "solid" ? color.hex : ink, 0.52 * (color?.kind === "solid" ? color.opacity : 1) * alpha));
    // The frosted material over a black screen reads as a faint white.
    return [sheen, tint, flat(`rgba(255, 255, 255, ${a(0.62 * 0.15)})`)].join(", ");
  }
  const tint = color?.kind === "gradient"
    ? `linear-gradient(135deg, ${rgba(color.from, 0.03 * alpha)}, ${rgba(color.to, 0.03 * alpha)})`
    : flat(rgba(color?.kind === "solid" ? color.hex : color?.kind === "rainbow" ? "#FF9F0A" : ink, 0.025 * alpha));
  return [tint, flat(`rgba(142, 142, 147, ${a(0.06)})`), flat(`rgba(255, 255, 255, ${a(0.3 * 0.1)})`)].join(", ");
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
  // A music hub is on while one of its speakers plays, pauses or idles.
  if (tileKind(tileEntityId(tile)) === "music_hub") return watchMusicHubActiveSpeaker(tile, states) !== undefined;
  const entity = states?.[tileEntityId(tile)];
  if (entity === undefined) return true;
  const special = specialActive(tile, states!, entity);
  if (special !== undefined) return special;
  return !OFF_STATES.has(String(entity.state ?? "").toLowerCase());
}

/** The kinds whose watch tile passes `isActive: true` to its style whatever
 * the state, so they always draw the lit glass. */
const ALWAYS_LIT: ReadonlySet<string> = new Set([
  "lock", "cover", "valve", "climate", "button", "input_button", "scene", "script", "page", "show_page", "status_page",
  "http_action", "macro", "template", "webhook_inbox", "assist", "speak_message",
]);

/** The kinds the watch draws with `SimpleSensorTile`. */
const SENSOR_KINDS: ReadonlySet<string> = new Set([
  "sensor", "binary_sensor", "text", "input_text", "counter", "todo", "update", "water_heater", "lawn_mower", "humidifier",
  "device_tracker", "zone", "event", "calendar", "date", "time", "datetime", "input_datetime", "image", "weather", "siren",
  "assist_satellite", "conversation", "tts", "stt", "wake_word",
]);

function available(state: string): boolean {
  return state !== "unavailable" && state !== "unknown" && state !== "none";
}

/**
 * Whether the watch draws a tile's glass lit, which is the `isActive` its
 * tile view hands `tileStyle` and is not always "on": a lock, cover,
 * climate, scene and the app's own tiles are always lit; a sensor, number or
 * select while it is available (a siren while it sounds); an automation
 * while enabled; a media player while it plays, pauses or idles; a timer
 * while it runs or pauses; the rest as `watchTilePreviewActive` says. A tile
 * whose entity the picture has no state for is lit, so its styling shows; a
 * point control is not, as it rests.
 */
export function watchTileStyleActive(tile: WatchPageTile, states?: Readonly<Record<string, HassEntityState>>): boolean {
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  if (ALWAYS_LIT.has(kind)) return true;
  if (kind === "point_control") return false;
  if (kind === "music_hub") return watchTilePreviewActive(tile, states);
  const entity = states !== undefined && Object.hasOwn(states, entityId) ? states[entityId] : undefined;
  if (entity === undefined) return true;
  const state = lower(entity.state);
  if (kind === "media_player" && !watchTileIsTvRemote(tile, states)) return state === "playing" || state === "paused" || state === "idle";
  if (kind === "siren") return state === "on";
  if (SENSOR_KINDS.has(kind) || ["input_number", "number", "input_select", "select"].includes(kind)) return available(state);
  if (kind === "automation") return state === "on";
  if (kind === "timer") return state === "active" || state === "paused";
  return watchTilePreviewActive(tile, states);
}

/** How the watch draws a plain tile's symbol: the fill variant or not, its
 * opacity, and its glow. `glow` "lit" is `activeIconGlow` (the symbol's
 * color at 0.18, blur the larger of 4 and 0.18 of the symbol); "soft" is the
 * fixed shadow the app tiles, sensors, scenes and scripts carry (0.3, blur
 * 6). */
export interface WatchIconTreatment {
  filled: boolean;
  opacity: number;
  glow: "lit" | "soft" | undefined;
}

/** The kinds whose symbol takes its fill only while on. */
const FILL_WHEN_ON: ReadonlySet<string> = new Set(["light", "switch", "input_boolean", "fan", "automation"]);
/** The kinds with the fixed soft shadow under the symbol. */
const SOFT_GLOW: ReadonlySet<string> = new Set([
  "assist", "speak_message", "http_action", "macro", "scene", "script", "page", "show_page", "status_page", "webhook_inbox", "music_hub",
]);

export function watchTileIconTreatment(tile: WatchPageTile, states?: Readonly<Record<string, HassEntityState>>): WatchIconTreatment {
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  const entity = states !== undefined && Object.hasOwn(states, entityId) ? states[entityId] : undefined;
  const raw = entity === undefined ? undefined : String(entity.state ?? "");
  const state = lower(raw);
  const on = watchTilePreviewActive(tile, states);
  const dim = tile.dimWhenOff !== false;
  // A symbol picked for this state is drawn as picked.
  const override = stateEntry(tile.stateIcons, watchTileStateKey(tile, raw)) !== undefined;
  const filled = !override && (!FILL_WHEN_ON.has(kind) || on);
  let opacity = 1;
  let glow: WatchIconTreatment["glow"];
  switch (kind) {
    case "light":
      opacity = on || !dim ? 1 : 0.68;
      glow = on ? "lit" : undefined;
      break;
    case "switch":
      opacity = on ? 1 : 0.85;
      glow = on ? "lit" : undefined;
      break;
    case "lock": {
      const locked = entity === undefined || state === "locked";
      opacity = locked || !dim ? 1 : 0.6;
      glow = locked ? "lit" : undefined;
      break;
    }
    case "cover":
    case "valve": {
      const position = storedNumber(entity?.attributes?.current_position);
      glow = entity === undefined || (position !== undefined ? position > 0 : state === "open" || state === "opening") ? "lit" : undefined;
      break;
    }
    case "automation":
      opacity = on ? 1 : 0.8;
      break;
    case "fan":
      opacity = on ? 1 : 0.85;
      glow = on ? "soft" : undefined;
      break;
    case "media_player":
      if (watchTileIsTvRemote(tile, states)) break;
      opacity = entity === undefined || ["playing", "paused", "idle"].includes(state) ? 1 : 0.85;
      glow = entity === undefined || state === "playing" || state === "paused" ? "soft" : undefined;
      break;
    case "timer":
      glow = entity === undefined || state === "active" || state === "paused" ? "lit" : undefined;
      break;
    case "point_control":
      opacity = dim ? 0.68 : 1;
      break;
    default:
      if (kind === "siren") glow = state === "on" ? "lit" : "soft";
      else if (SENSOR_KINDS.has(kind)) {
        opacity = entity === undefined || available(state) ? 1 : 0.5;
        glow = "soft";
      } else if (SOFT_GLOW.has(kind)) glow = "soft";
  }
  return { filled, opacity, glow };
}

/** The CSS filter for the glow of a symbol `symbolPt` points across in
 * `ink`, at scale `s`, or "" for none. */
function glowFilter(glow: WatchIconTreatment["glow"], ink: string, symbolPt: number, s: number): string {
  if (glow === undefined) return "";
  const [alpha, blur] = glow === "lit" ? [0.18, Math.max(4, symbolPt * 0.18)] : [0.3, 6];
  return `drop-shadow(0 0 ${Math.round(blur * s * 100) / 100}px ${rgba(ink, alpha)})`;
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

/** Each theme's semantic info color (`DS+Color.swift`), a webhook inbox
 * tile's default. */
const THEME_INFO: Readonly<Record<string, string>> = {
  midnight: "#5CA9FF", sunrise: "#6EA7ED", forest: "#4FB2D2", sunnyBeachDay: "#4BBDE0", neonLagoon: "#7CC7FF",
  softVintage: "#8F86A5", hyperPop: "#00BBF9", ember: "#7AA4D4", sakura: "#8AABE0", polar: "#8EC8E8",
};

/** A theme color for a special tile: `hex` at `alpha` (the secondary text
 * is white at the theme's opacity). */
export interface WatchInk {
  hex: string;
  alpha: number;
}

function themeInk(page: WatchPage | undefined, token: "warning" | "danger" | "accent" | "secondary" | "info" | "tempWarm" | "tempCool" | "tempNeutral" | `entity${string}`): WatchInk {
  const theme = page === undefined ? WATCH_TILE_DEFAULTS.watchFallbackTheme : watchPageTheme(page);
  if (token === "info") return { hex: THEME_INFO[theme] ?? THEME_INFO[WATCH_TILE_DEFAULTS.watchFallbackTheme] ?? THEME_INFO.midnight!, alpha: 1 };
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
 * symbol. None of them draws a line of state under its name.
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
  /** The name the tile shows in place of its own (a music hub's media
   * title, a webhook inbox's topic). */
  label?: string;
  /** A music hub's album art, which fills the tile (fit) with the label in
   * white over a dark band; the symbol is not drawn then. */
  art?: string;
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
        : undefined,    };
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
        topRight: activity ? status[v] : undefined,      };
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
        topRight: activity ? status : undefined,      };
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
        topRight: activity && on ? badge : undefined,      };
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
        topLeft: activity && raw !== undefined ? { kind: "text", lines: [watchPersonBadge(raw)], ink: { hex: "#FFFFFF", alpha: 0.8 }, weight: 500, pill: false } : undefined,      };
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
        topLeft: activity && entity !== undefined ? { kind: "text", lines: [ALARM_WORDS[a]!], ink: secondary, weight: 600, pill: false } : undefined,      };
    }
    case "music_hub": {
      // `SimpleMusicHubTile`: at rest its symbol and name; with a speaker
      // playing, paused or idle, play or pause, the media title, a badge,
      // and the album art when it is on (the default) and there is one.
      const speaker = watchMusicHubActiveSpeaker(tile, states);
      const custom = typeof tile.customLabel === "string" && tile.customLabel.trim() !== "" ? tile.customLabel : undefined;
      const playing = speaker?.state === "playing";
      return {
        symbol: noIcon ? undefined : speaker !== undefined ? (playing ? "pause.fill" : "play.fill") : (typeof tile.icon === "string" ? tile.icon : "music.note.house"),
        filled: true,
        ink: ownInk(tile.color) ?? { hex: "#E89545", alpha: 1 },
        opacity: 1,
        active: speaker !== undefined,
        topRight: activity && speaker !== undefined ? (playing ? "play.fill" : "pause.fill") : undefined,        label: speaker?.title ?? custom ?? WATCH_KIND_FALLBACK_LABELS.music_hub!,
        art: tile.showAlbumArt !== false ? speaker?.picture : undefined,
      };
    }
    case "webhook_inbox": {
      // `SimpleWebhookInboxTile`: its symbol (absent is the tray), the
      // theme's info color, the label, else the topic, else "Inbox". The
      // corner mark for an inbox not set up on the watch is the watch's to
      // know.
      // A `customLabel` of "" draws no words, as on the watch.
      return {
        symbol: noIcon ? undefined : (ownIcon ?? "tray"),
        filled: true,
        ink: ownInk(tile.color) ?? themeInk(page, "info"),
        opacity: 1,
        active: true,        label: watchInboxLabel(tile),
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

/** A camera tile's corner radius by its short side in points: every tile's
 * (`watchTileCornerRadius`). */
export function watchCameraCornerRadius(widthPt: number, heightPt: number): number {
  return watchTileCornerRadius(widthPt, heightPt);
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
  const symbolPt = watchTileIconSize(tile, width, height);
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
      ${watchTileLabelShown(tile, height) ? html`<span class="wp-label" style=${`${labelStyle(tile, width, s)};color:${color}`}>${label}</span>` : nothing}
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

/** A music hub's album art filling the tile (fit, as the watch draws it),
 * under a band from clear to black over its lower half. */
function albumArt(url: string): TemplateResult {
  const css = `background-image:url("${url.replace(/["\\]/g, (c) => `\\${c}`)}")`;
  return html`<span class="wp-art" role="img" aria-label="Album art" style=${css}></span><span class="wp-art-band"></span>`;
}

// ── templates ────────────────────────────────────────────────────────────

/** The SF Symbol a template tile with no template shows, at 40%. */
export const WATCH_TEMPLATE_PLACEHOLDER_SYMBOL = "chevron.left.forwardslash.chevron.right";

/** What a template tile draws (`SimpleTemplateTile`, `TemplateTileOverlay`):
 * no symbol, name or badge of its own, whatever its keys say. */
export type WatchTemplateTileLook =
  /** No template: the placeholder symbol at 40% in the tile's color. */
  | { kind: "placeholder"; symbol: string; ink: string }
  /** Home Assistant refused the template: a yellow warning triangle. */
  | { kind: "error"; error: string }
  /** The rendered text in the tile's color, five lines at most, centered
   * when it is one line and leading otherwise. `pending` while the first
   * answer is out ("..."). */
  | { kind: "text"; text: string; multiLine: boolean; ink: string; pending: boolean };

/** A template tile's look from its text and its render, if any. The tile's
 * color is `color`, else the theme's sensor color. A text of white space
 * alone is not asked about (Home Assistant refuses it); the watch renders
 * it to nothing, so it draws as an empty line. */
export function watchTemplateTileLook(tile: WatchPageTile, input: Pick<WatchPagePreviewInput, "templates" | "page">): WatchTemplateTileLook {
  const ink = flatInk(tile.color, themeInk(input.page, "entitySensor").hex);
  const text = watchTemplateText(tile);
  if (text === "") return { kind: "placeholder", symbol: WATCH_TEMPLATE_PLACEHOLDER_SYMBOL, ink };
  if (text.trim() === "") return { kind: "text", text: "", multiLine: false, ink, pending: false };
  const result = watchTemplateRender(input.templates, tile);
  if (result === undefined) return { kind: "text", text: "...", multiLine: false, ink, pending: true };
  if (!result.ok) return { kind: "error", error: result.error };
  return { kind: "text", text: result.value, multiLine: result.value.includes("\n"), ink, pending: false };
}

/** The watch's body size in points, which a template's text starts at. */
const TEMPLATE_FONT_PT = 16;
/** SwiftUI's `minimumScaleFactor(0.4)` on it. */
const TEMPLATE_MIN_FONT_PT = TEMPLATE_FONT_PT * 0.4;

/**
 * The size a template's text is drawn at, in points: the body size, shrunk
 * (to 40% at most) until the text fits the box in five lines, as SwiftUI
 * wraps and then scales it. Widths are estimated (0.58 of the size a
 * character, an icon a little over one size), which is close enough for a
 * picture.
 */
export function watchTemplateFontSize(text: string, widthPt: number, heightPt: number): number {
  const lines = text.split("\n").map((line) => {
    let units = 0;
    for (const segment of templateRichTextSegments(line)) units += segment.kind === "icon" ? 1.15 : [...segment.text].length * 0.58;
    return units;
  });
  const w = Math.max(1, widthPt);
  const h = Math.max(1, heightPt);
  for (let size = TEMPLATE_FONT_PT; size > TEMPLATE_MIN_FONT_PT; size -= 0.4) {
    const rows = lines.reduce((sum, units) => sum + Math.max(1, Math.ceil((units * size) / w)), 0);
    if (rows <= 5 && Math.min(rows, 5) * size * 1.2 <= h) return Math.round(size * 10) / 10;
  }
  return TEMPLATE_MIN_FONT_PT;
}

/** The rendered text with its `[icon:]` markers drawn as symbols the size of
 * the text, each in its own color or the text's. A symbol the provider does
 * not know draws nothing, as `Image(systemName:)` does. The stage's
 * template tile and the Template task's Preview both draw through it. */
export function watchTemplateRichText(text: string, ink: string, px: number, icons: IconProvider | undefined): TemplateResult[] {
  return templateRichTextSegments(text).map((segment) => {
    if (segment.kind === "text") return html`${segment.text}`;
    const own = segment.color === undefined ? undefined : templateIconColor(segment.color);
    const glyph = icons?.render(segment.symbol, px, own?.hex ?? ink);
    if (glyph === undefined) return html``;
    const fade = own !== undefined && own.alpha < 1 ? `opacity:${own.alpha}` : "";
    return html`<svg class="wp-tpl-icon" width=${px} height=${px} viewBox=${`0 0 ${px} ${px}`} style=${fade} aria-hidden="true">${glyph}</svg>`;
  });
}

/** A template tile as the watch draws it: its ground, border, pattern and
 * effect, and only the template's text (or the placeholder or the warning)
 * inside. */
function templateFace(tile: WatchPageTile, width: number, height: number, box: string, input: WatchPagePreviewInput, unit: number, s: number, hint: string | undefined): TemplateResult {
  const radius = watchTileCornerRadius(width, height) * s;
  // Always lit, as `SimpleTemplateTile` passes `isActive: true`.
  const ground = watchTileFill(parseTileColor(tile.color), flatInk(tile.color, themeInk(input.page, "entitySensor").hex), true, watchTileColorOpacity(tile));
  const border = watchTileBorderStyle(tile, true, s, watchTileFallbackInk(tile, input.page));
  const look = watchTemplateTileLook(tile, input);
  const padX = 4 + Math.min(2, width / 8);
  const padY = Math.min(6, height / 4);
  let content: TemplateResult;
  if (look.kind === "placeholder") {
    const px = watchTileIconSize(tile, width, height) * s;
    content = html`<span style="opacity:0.4;display:flex">${symbolMark(input.icons, look.symbol, px, look.ink)}</span>`;
  } else if (look.kind === "error") {
    content = html`<span title=${look.error} style="display:flex">${symbolMark(input.icons, "exclamationmark.triangle", 16 * s, "#FFCC00")}</span>`;
  } else {
    const size = watchTemplateFontSize(look.text, width - padX * 2, height - padY * 2) * s;
    const style = [
      `font-size:${size}px`, `color:${look.ink}`, `text-align:${look.multiLine ? "left" : "center"}`,
      `text-shadow:0 0 ${4 * s}px ${rgba(look.ink, 0.3)}`,
    ].join(";");
    content = html`<span class="wp-tpl-text" style=${style}>${watchTemplateRichText(look.text, look.ink, size, input.icons)}</span>`;
  }
  return html`<div class="wp-tile wp-tpl" title=${hint ?? nothing}
    style=${`${box}border-radius:${radius}px;background:${ground};padding:${padY * s}px ${padX * s}px;${border}`}>
    ${tileUnderlay(tile, input, true, height, s)}
    ${content}
  </div>`;
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

/** The top bar, over the content. */
function tileOverlay(tile: WatchPageTile, input: WatchPagePreviewInput, active: boolean, widthPt: number, s: number): TemplateResult | typeof nothing {
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
  return parts.length === 0 ? nothing : html`${parts}`;
}

/** A plain tile's badge in its top left: its words, weight (600 for OFF and
 * ON, else 500), whether it sits in a capsule, and its top in points. */
export interface WatchTileBadge {
  text: string;
  weight: number;
  pill: boolean;
  top: number;
}

/** What a binary sensor's on and off read as, by device class
 * (`SensorEntity.binaryStateLabel`); any other class reads On and Off. */
const BINARY_WORDS: Readonly<Record<string, readonly [string, string]>> = {
  battery: ["Low", "Normal"], battery_charging: ["Charging", "Not charging"],
  carbon_monoxide: ["Detected", "Clear"], gas: ["Detected", "Clear"], motion: ["Detected", "Clear"], smoke: ["Detected", "Clear"],
  sound: ["Detected", "Clear"], vibration: ["Detected", "Clear"], tamper: ["Detected", "Clear"],
  cold: ["Cold", "Normal"], heat: ["Hot", "Normal"], connectivity: ["Connected", "Disconnected"],
  door: ["Open", "Closed"], garage_door: ["Open", "Closed"], window: ["Open", "Closed"], opening: ["Open", "Closed"], lock: ["Open", "Closed"],
  light: ["Detected", "No light"], moisture: ["Wet", "Dry"], moving: ["Moving", "Stopped"], occupancy: ["Occupied", "Not occupied"],
  plug: ["Plugged in", "Unplugged"], power: ["Detected", "No power"], presence: ["Home", "Away"], problem: ["Detected", "OK"],
  running: ["Running", "Not running"], safety: ["Unsafe", "Safe"], update: ["Available", "Up-to-date"],
};

const SWIFT_NUMBER = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

/**
 * A sensor's value as its watch badge writes it
 * (`SensorEntity.formattedDisplayValue`): a number rounded half up to
 * `decimals` places (1 when absent, 0 to 6), trailing zeros dropped, then
 * its unit, with a space unless the unit starts with ° or %. Anything else
 * is the state with its unit run on, else a binary state's words, else the
 * state.
 */
export function watchSensorValueText(state: string, unit: unknown, deviceClass: unknown, decimals: unknown): string {
  const u = typeof unit === "string" ? unit : "";
  if (SWIFT_NUMBER.test(state)) {
    const places = Math.max(0, Math.min(6, Math.trunc(storedNumber(decimals) ?? 1)));
    const v = Number(state);
    const f = 10 ** places;
    const rounded = (Math.sign(v) * Math.round(Math.abs(v) * f)) / f;
    let number = rounded.toFixed(places);
    if (number.includes(".")) number = number.replace(/\.?0+$/, "");
    if (number === "-0") number = "0";
    if (u === "") return number;
    return u.startsWith("°") || u.startsWith("%") ? `${number}${u}` : `${number} ${u}`;
  }
  if (u !== "") return `${state}${u}`;
  const s = state.toLowerCase();
  if (s === "on" || s === "off") {
    const words = BINARY_WORDS[lower(deviceClass)] ?? ["On", "Off"];
    return s === "on" ? words[0] : words[1];
  }
  return state;
}

/** A timer's remaining time as its watch badge counts it down: m:ss, or
 * h:mm:ss from an hour up, "--:--" at none. Read from `remaining`
 * ("H:MM:SS"). */
export function watchTimerText(remaining: unknown): string | undefined {
  if (typeof remaining !== "string") return undefined;
  const parts = remaining.split(":").map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return undefined;
  const total = Math.max(0, Math.trunc(parts[0]! * 3600 + parts[1]! * 60 + parts[2]!));
  if (total === 0) return "--:--";
  const h = Math.trunc(total / 3600);
  const m = Math.trunc((total % 3600) / 60);
  const sec = String(total % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

/**
 * The badge a plain tile's own watch view draws top left, or undefined for
 * a kind that draws none (a switch, lock, scene, button and every app tile
 * among them). With its value label on: a light reads OFF while off, else
 * its brightness; a cover or valve its position (Closed at 0, Open at 100,
 * else a percentage, else its state's word); a fan its speed while on; a
 * media player its volume while it plays, pauses or idles; a sensor or
 * binary sensor its value (`watchSensorValueText`) and a counter its count
 * while available. With its activity status on: an automation ON or OFF, a
 * timer its time left while it runs or pauses. The top is the badge padding,
 * 2 more under a top bar, 1 less with a fill bar on a cover, fan or media
 * player, 2 more on a timer. The climate, remote, vacuum, mower, person and
 * alarm panel draw their own (`watchSpecialTileLook`).
 */
export function watchTileBadge(tile: WatchPageTile, input: Pick<WatchPagePreviewInput, "states">, widthPt: number, heightPt: number): WatchTileBadge | undefined {
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  const states = input.states;
  const entity = states !== undefined && Object.hasOwn(states, entityId) ? states[entityId] : undefined;
  if (entity === undefined) return undefined;
  const raw = String(entity.state ?? "");
  const state = raw.toLowerCase();
  const attrs = entity.attributes ?? {};
  const pad = watchBadgePadding(widthPt, heightPt);
  const style = watchValueLabelStyle(tile);
  const labels = style !== undefined && style !== "Off";
  const pill = style === "Pill";
  const fillBar = tile.stateBarStyle === "Fill";
  const activity = watchStateDomains("activityStatus").includes(kind) && tile.showActivityStatus !== false;
  const percent = (v: unknown, k: number) => (typeof v === "number" && Number.isFinite(v) ? Math.round((v / k) * 100) : undefined);
  const mk = (text: string | undefined, top: number, weight = 500, capsule = pill): WatchTileBadge | undefined =>
    text === undefined ? undefined : { text, weight, pill: capsule, top };
  switch (kind) {
    case "light": {
      if (!labels) return undefined;
      const top = fillBar ? pad : pad + 2;
      if (!watchTilePreviewActive(tile, states)) return mk("OFF", top, 600);
      const b = percent(attrs.brightness, 255);
      return b === undefined ? undefined : mk(`${b}%`, top);
    }
    case "cover":
    case "valve": {
      if (!labels) return undefined;
      const top = fillBar ? pad - 1 : pad + 2;
      const p = storedNumber(attrs.current_position);
      if (p !== undefined) return mk(p <= 0 ? "Closed" : p >= 100 ? "Open" : `${Math.round(p)}%`, top);
      const words: Record<string, string> = { open: "Open", closed: "Closed", opening: "Opening", closing: "Closing" };
      return mk(words[state], top);
    }
    case "fan": {
      const p = percent(attrs.percentage, 100);
      if (!labels || !watchTilePreviewActive(tile, states) || p === undefined || p <= 0) return undefined;
      return mk(`${p}%`, fillBar ? pad - 1 : pad + 2);
    }
    case "media_player": {
      const v = storedNumber(attrs.volume_level);
      if (!labels || watchTileIsTvRemote(tile, states) || !["playing", "paused", "idle"].includes(state) || v === undefined) return undefined;
      return mk(`${Math.trunc(v * 100)}%`, fillBar ? pad - 1 : pad + 2);
    }
    case "automation":
      return activity ? mk(state === "on" ? "ON" : "OFF", pad, 600, false) : undefined;
    case "timer":
      return activity && (state === "active" || state === "paused") ? mk(watchTimerText(attrs.remaining), pad + 2, 500, false) : undefined;
    case "counter":
      return labels && available(state) ? mk(raw, pad) : undefined;
    case "sensor":
    case "binary_sensor":
      return labels && available(state) ? mk(watchSensorValueText(raw, attrs.unit_of_measurement, attrs.device_class, tile.decimalPlaces), pad) : undefined;
    default:
      return undefined;
  }
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

// ── the clock ────────────────────────────────────────────────────────────

/** Where the system clock sits on each watch screen, measured on the
 * devices (`WatchStatusClock` in the app): the centre of its line from the
 * top, and the left edge of its digits from the right edge, in points. */
const WATCH_STATUS_CLOCKS: readonly { width: number; height: number; centreY: number; leftFromTrailing: number }[] = [
  { width: 162, height: 197, centreY: 15, leftFromTrailing: 46.5 },
  { width: 176, height: 215, centreY: 20, leftFromTrailing: 48.5 },
  { width: 184, height: 224, centreY: 19, leftFromTrailing: 49 },
  { width: 187, height: 223, centreY: 22, leftFromTrailing: 50 },
  { width: 198, height: 242, centreY: 23, leftFromTrailing: 51 },
  { width: 208, height: 248, centreY: 25.5, leftFromTrailing: 53.5 },
  { width: 205, height: 251, centreY: 27, leftFromTrailing: 54.5 },
  { width: 211, height: 257, centreY: 28, leftFromTrailing: 55 },
];

/** The clock's place on a screen: its own row, else the nearest by size,
 * as the watch falls back. */
export function watchStatusClock(screen: { width: number; height: number }): { centreY: number; leftFromTrailing: number } {
  let best = WATCH_STATUS_CLOCKS[5]!;
  let distance = Infinity;
  for (const row of WATCH_STATUS_CLOCKS) {
    const d = (row.width - screen.width) ** 2 + (row.height - screen.height) ** 2;
    if (d < distance) [best, distance] = [row, d];
  }
  return { centreY: best.centreY, leftFromTrailing: best.leftFromTrailing };
}

/** The clock's size in points: bold and about 20 on a 46 mm watch, in
 * proportion on the others. */
export function watchClockFontSize(screenWidth: number): number {
  return Math.round(20 * (screenWidth / 208) * 10) / 10;
}

/** The time the picture shows. */
const CLOCK_TIME = "10:09";

/** The settings gear's color: the app's healthy green, muted to 0.55 so it
 * does not compete with the time (`settingsCogColor`). */
const GEAR_INK = "#30D158";

/** An outline gear `px` across, for a provider without `gearshape`: eight
 * square teeth round a ring, in a light line. */
function gearGlyph(px: number, ink: string): TemplateResult {
  const points: string[] = [];
  const teeth = 8;
  for (let i = 0; i < teeth * 4; i++) {
    const a = ((i - 0.5) * Math.PI * 2) / (teeth * 4);
    const r = i % 4 < 2 ? 10.5 : 8;
    points.push(`${(12 + r * Math.cos(a)).toFixed(2)},${(12 + r * Math.sin(a)).toFixed(2)}`);
  }
  return html`<svg width=${px} height=${px} viewBox="0 0 24 24" aria-hidden="true">${svg`<polygon points=${points.join(" ")} fill="none" stroke=${ink} stroke-width="1.5" stroke-linejoin="round" /><circle cx="12" cy="12" r="3.4" fill="none" stroke=${ink} stroke-width="1.5" />`}</svg>`;
}

/**
 * The clock in the top band as the watch shows it: the system time, bold
 * and white, its line centred where the device's clock is and its digits
 * about 16 points in from the right edge, and the app's settings gear
 * (`gearshape`, 11 points, light) 3 points left of the digits. None on a
 * full screen page.
 */
export function renderWatchClock(screen: { width: number; height: number }, s: number, topInset: number, icons: IconProvider | undefined): TemplateResult | typeof nothing {
  if (topInset <= 0) return nothing;
  const place = watchStatusClock(screen);
  const gearPx = 11 * s;
  const glyph = icons?.render("gearshape", gearPx, GEAR_INK);
  const gear = glyph === undefined ? gearGlyph(gearPx, GEAR_INK)
    : html`<svg width=${gearPx} height=${gearPx} viewBox=${`0 0 ${gearPx} ${gearPx}`} aria-hidden="true">${glyph}</svg>`;
  const style = [
    `top:${place.centreY * s}px`, `right:${16 * s}px`, `gap:${3 * s}px`, `font-size:${watchClockFontSize(screen.width) * s}px`,
  ].join(";");
  return html`<span class="wp-clock" style=${style}><span class="wp-gear">${gear}</span><span>${CLOCK_TIME}</span></span>`;
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

/** The symbol's size in the picture: the watch's own (`watchTileIconSize`),
 * now that the picture lays a tile out as the watch does. */
export function watchPreviewIconSize(tile: WatchPageTile, widthPt: number, heightPt: number): number {
  return watchTileIconSize(tile, widthPt, heightPt);
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
  const unknown = cls === "unknown";
  // A remote, vacuum, mower, climate, person, alarm panel, music hub or
  // webhook inbox: its own symbol, color, badges and name.
  const look = unknown || cls === "divider" || cls === "spacer" ? undefined : watchSpecialTileLook(tile, input);
  const label = look?.label ?? watchPreviewTileLabel(tile, input);
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
    return html`<div class="wp-spacer" style=${`${box}border-radius:${watchTileCornerRadius(width, height) * s}px;${watchSpacerStyle(tile, s)}`} title=${titled ? hint : nothing}>${tileUnderlay(tile, input, true, height, s, true)}</div>`;
  }

  if (kind === "camera" || kind === "multicam") return cameraFace(tile, width, height, box, input, unit, s, titled ? hint : undefined);
  if (kind === "template") return templateFace(tile, width, height, box, input, unit, s, titled ? hint : undefined);

  // As the watch lays every tile out (`SimpleTileViews`): the symbol
  // centred and lifted a little while the name shows, the name centred on
  // one line at the bottom, a badge top left. There is no other layout for a
  // short tile: under 35 points tall the name goes and the symbol grows.
  const states = input.states;
  const radius = watchTileCornerRadius(width, height) * s;
  const raw = states !== undefined && Object.hasOwn(states, entityId) ? String(states[entityId]?.state ?? "") : undefined;
  const key = watchTileStateKey(tile, raw);
  const stateSymbol = look === undefined && !unknown ? stateEntry(tile.stateIcons, key) : undefined;
  const stateInk = look === undefined && !unknown ? ownInk(stateEntry(tile.stateColors, key)) : undefined;
  const fallbackInk = watchTileFallbackInk(tile, input.page);
  // A tile with no color of its own is drawn in its kind's color.
  const iconInk = unknown ? "#8E8E93" : look !== undefined ? look.ink.hex : (stateInk?.hex ?? flatInk(tile.color, fallbackInk));
  const symbolPt = watchTileIconSize(tile, width, height);
  const special = look === undefined ? undefined : specialBadges(tile, look, input, width, height, s);
  const badge = unknown || look !== undefined ? undefined : watchTileBadge(tile, input, width, height);
  const art = look?.art;
  // Tile Value: the value in place of the symbol, the name under it unless
  // Show Name is off, whatever the tile's height.
  const value = watchHTTPTileValueLook(tile);
  const showLabel = value !== undefined ? tileShowsLabel(tile) && value.showName : watchTileLabelShown(tile, height);
  // A number or a select shows its value where the name goes.
  const valueInLabel = !unknown && ["input_number", "number", "input_select", "select"].includes(kind) && raw !== undefined && available(lower(raw));
  const words = valueInLabel ? (tileStateText(tile, states) ?? label) : label;
  const lit = unknown ? false : watchTileStyleActive(tile, states);
  // A tile that opts out of dimming draws lit while off, as on the watch.
  const dimmed = !unknown && !lit && tile.dimWhenOff !== false;
  const ground = unknown ? "rgba(255, 255, 255, 0.08)"
    : watchTileFill(stateInk !== undefined ? undefined : color, iconInk, !dimmed, watchTileColorOpacity(tile));
  const border = unknown ? "" : watchTileBorderStyle(tile, lit, s, fallbackInk);
  const treat: WatchIconTreatment = unknown
    ? { filled: true, opacity: 0.5, glow: undefined }
    : look !== undefined
      ? { filled: look.filled, opacity: 1, glow: specialGlow(kind, look) }
      : watchTileIconTreatment(tile, states);
  const offset = watchIconVerticalOffset(tile, height);
  const glow = art === undefined && value === undefined ? glowFilter(treat.glow, iconInk, symbolPt, s) : "";
  const iconStyle = [
    offset === 0 ? "" : `transform:translateY(${offset * s}px)`,
    treat.opacity >= 1 ? "" : `opacity:${treat.opacity}`,
    glow === "" ? "" : `filter:${glow}`,
  ].filter((p) => p !== "").join(";");
  let icon: TemplateResult | typeof nothing;
  if (value !== undefined) {
    const size = value.fontSize ?? Math.max(11, symbolPt * 0.6);
    icon = html`<span class="wp-value" style=${`font-size:${size * s}px;color:${value.color ?? "#FFFFFF"}${value.offsetY === 0 ? "" : `;transform:translateY(${value.offsetY * s}px)`}`}>${String.fromCharCode(0x2014)}</span>`;
  } else if (art !== undefined) {
    icon = nothing;
  } else if (look !== undefined) {
    icon = specialSymbol(look, input.icons, symbolPt, Infinity, s, tile.iconShadow === true);
  } else if (watchTileHasNoIcon(tile) && stateSymbol === undefined) {
    icon = nothing;
  } else {
    const base = unknown ? (tileSymbol(tile) ?? "questionmark.circle") : (stateSymbol ?? tileSymbol(tile));
    const own = typeof tile.icon === "string" && tile.icon.trim() !== "";
    const name = base === undefined || stateSymbol !== undefined ? base
      : treat.filled ? filledSymbol(input.icons, base, true)
      : own ? base : unfilledSymbol(input.icons, base);
    icon = symbolMark(input.icons, name, symbolPt * s, iconInk, tile.iconShadow === true);
  }
  const labelCss = [
    `bottom:${watchLabelBottomPadding(height) * s}px`,
    labelStyle(tile, width, s),
    art !== undefined ? `color:#FFFFFF;text-shadow:0 ${s}px ${3 * s}px rgba(0, 0, 0, 0.9)` : "",
    unknown ? "color:rgba(142, 142, 147, 0.5);font-weight:500" : "",
  ].filter((p) => p !== "").join(";");
  const badgeCss = badge === undefined ? "" : [
    `font-size:${watchBadgeFontSize(tile, width, height) * s}px`, `top:${badge.top * s}px`, `left:${watchBadgePadding(width, height) * s}px`,
    `color:rgba(255, 255, 255, 0.62)`, `font-weight:${badge.weight}`, badge.pill ? pillStyle(s) : "",
    tile.statusTextShadow === false ? "" : `text-shadow:0 ${s}px ${2 * s}px rgba(0, 0, 0, 0.8)`,
  ].filter((p) => p !== "").join(";");
  return html`<div class="wp-tile ${dimmed ? "off" : ""} ${unknown ? "unknown" : ""} ${art === undefined ? "" : "art"}"
    style=${`${box}border-radius:${radius}px;background:${ground};${border}${dimmed ? ";filter:saturate(0.5) brightness(0.94)" : ""}`}
    title=${titled ? hint : nothing}>
    ${unknown ? nothing : tileUnderlay(tile, input, lit, height, s)}
    ${unknown ? nothing : coverSideBars(tile, input, height, s)}
    ${art === undefined ? nothing : albumArt(art)}
    <span class="wp-icon" style=${iconStyle}>${icon}</span>
    ${showLabel ? html`<span class="wp-label" style=${labelCss}>${words}</span>` : nothing}
    ${unknown ? nothing : tileOverlay(tile, input, lit, width, s)}
    ${badge === undefined ? nothing : html`<span class="wp-badge" style=${badgeCss}>${badge.text}</span>`}
    ${special === undefined ? nothing : special.parts}
  </div>`;
}

/** The glow under a special tile's symbol: lit for a climate, person or
 * vacuum while on, the soft shadow for a mower, music hub or inbox. */
function specialGlow(kind: string, look: WatchSpecialLook): WatchIconTreatment["glow"] {
  if (kind === "climate" || kind === "person" || kind === "vacuum") return look.active ? "lit" : undefined;
  return kind === "lawn_mower" || kind === "music_hub" || kind === "webhook_inbox" ? "soft" : undefined;
}

/** A default symbol's outline form, when the provider draws it: the kinds
 * whose symbol fills only while on stand off as an outline. */
function unfilledSymbol(icons: IconProvider | undefined, name: string): string {
  if (!name.endsWith(".fill")) return name;
  const plain = name.slice(0, -5);
  return icons?.render(plain, 1, "#FFFFFF") !== undefined ? plain : name;
}

/** A cover's or valve's two side bars (`SimpleCoverTile`): 4 points wide, 4
 * in from each side and 5 from the bottom, as tall as the position says,
 * from 0.8 at the bottom to 0.3 at the top, while the position is above 0. */
function coverSideBars(tile: WatchPageTile, input: WatchPagePreviewInput, heightPt: number, s: number): TemplateResult | typeof nothing {
  const kind = tileKind(tileEntityId(tile));
  if (kind !== "cover" && kind !== "valve") return nothing;
  const percent = watchTileStatePercent(tile, input.states);
  if (percent === undefined || percent <= 0) return nothing;
  const ink = tile.stateBarColorStyle === "White" ? "#B3B3B3" : flatInk(tile.color, watchTileFallbackInk(tile, input.page));
  const h = Math.max(0, Math.min(heightPt * percent, heightPt - 10));
  const bar = (side: "left" | "right") =>
    html`<span class="wp-side" style=${`${side}:${4 * s}px;bottom:${5 * s}px;width:${4 * s}px;height:${Math.round(h * s * 100) / 100}px;border-radius:${2 * s}px;background:linear-gradient(0deg, ${rgba(ink, 0.8)}, ${rgba(ink, 0.3)})`}></span>`;
  return html`${bar("left")}${bar("right")}`;
}

/** One page drawn at the watch's size. A page taller than the screen grows
 * downward, with a line where the screen ends. */
export function renderWatchPagePreview(input: WatchPagePreviewInput): TemplateResult {
  const s = input.scale ?? 1.5;
  const { page, screen } = input;
  const width = screen.width * s;
  const name = watchPageName(page);
  if (isSmartWatchPage(page)) return renderSmartPreview(input);
  const layout = watchPageLayout(page, screen);
  const scrolls = watchPagePreviewScrolls(page, screen);
  return renderWatchFrame(screen, s, html`<div class="wp-screen" role="group" aria-label=${`Preview of ${name}`}
    style=${`width:${width}px;height:${layout.height * s}px;background:${watchScreenBackground(page, s)}`}>
    ${renderWatchClock(screen, s, layout.topInset, input.icons)}
    ${renderWatchPageTitle(page, s, layout.topInset, input.icons)}
    ${layout.tiles.length === 0 ? html`<div class="wp-smart"><span>No tiles on this page.</span></div>` : nothing}
    ${layout.tiles.map((placed) => renderTile(placed, input, layout.unit, layout.topInset, s))}
    ${scrolls ? renderWatchScreenFold(screen.height * s) : nothing}
  </div>`);
}

/**
 * A smart page as the watch fills it (part 3f batch 3): the synthetic page
 * from Home Assistant's states, its tiles plain tiles drawn as any other,
 * each in a box of its own (a button when `input.smart.pick` is given) that
 * draws at 30% when the selected rule is of another domain. With no active entity, the
 * watch's empty state: "All Off" and what the page tracks.
 */
function renderSmartPreview(input: WatchPagePreviewInput): TemplateResult {
  const s = input.scale ?? 1.5;
  const { page, screen } = input;
  const width = screen.width * s;
  const name = watchPageName(page);
  const config = readSmartConfig(page);
  const synthetic = smartSyntheticPage(page, input.states);
  const shown: WatchPage = { ...synthetic };
  delete shown.dynamicConfig;
  const layout = watchPageLayout(shown, screen);
  if (config === undefined || layout.tiles.length === 0) {
    const tracking = config === undefined ? "" : smartTrackingWords(config);
    const check = input.icons?.render("checkmark.circle.fill", 28 * s, "#34C759");
    return renderWatchFrame(screen, s, html`<div class="wp-screen" role="img" aria-label=${`${name}: ${smartWord("allOff")}. ${tracking}`}
      style=${`width:${width}px;height:${screen.height * s}px;background:${watchScreenBackground(page, s)}`}>
      ${renderWatchClock(screen, s, layout.topInset, input.icons)}
      ${renderWatchPageTitle(shown, s, layout.topInset, input.icons)}
      <div class="wp-smart">
        ${check === undefined ? nothing : html`<span class="wp-smart-check">${check}</span>`}
        <b>${smartWord("allOff")}</b>
        <span>${tracking}</span>
      </div>
    </div>`);
  }
  const selected = input.smart?.rule;
  const pick = input.smart?.pick;
  // By domain, as the phone dims: the watch draws every group of a domain
  // with its first rule, so a second rule on the domain lights them all.
  const selectedDomain = selected === undefined ? undefined : config.rules[selected]?.domain;
  const tile = (placed: PlacedWatchTile): TemplateResult => {
    const index = smartRuleIndexForTile(config, placed.tile);
    const domain = index === undefined ? undefined : config.rules[index]?.domain;
    const dim = selected !== undefined && (domain === undefined || domain !== selectedDomain);
    const box = `left:${placed.x * s}px;top:${(layout.topInset + placed.y) * s}px;width:${placed.width * s}px;height:${placed.height * s}px`;
    const face = tileFace(placed.tile, placed.width, placed.height, "inset:0;", input, layout.unit, s, pick === undefined);
    const cls = `wp-smart-item ${dim ? "dim" : ""}`;
    if (pick === undefined || index === undefined) return html`<div class=${cls} style=${box}>${face}</div>`;
    const label = watchPreviewTileLabel(placed.tile, input);
    // A click on a tile of the selected rule's domain keeps that rule.
    const target = selected !== undefined && !dim ? selected : index;
    return html`<button type="button" class=${cls} style=${box} data-rule=${index}
      aria-label=${label} title=${label} aria-pressed=${selected !== undefined && !dim ? "true" : "false"}
      @click=${(e: Event) => { e.stopPropagation(); pick(target); }}>${face}</button>`;
  };
  return renderWatchFrame(screen, s, html`<div class="wp-screen" role="group" aria-label=${`Preview of ${name}`}
    style=${`width:${width}px;height:${layout.height * s}px;background:${watchScreenBackground(page, s)}`}>
    ${renderWatchClock(screen, s, layout.topInset, input.icons)}
    ${renderWatchPageTitle(shown, s, layout.topInset, input.icons)}
    ${layout.tiles.map(tile)}
    ${layout.height > screen.height + 0.5 ? renderWatchScreenFold(screen.height * s) : nothing}
  </div>`);
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
    /* The watch case (watch-frame.ts) sets the screen's corners. */
    border-radius: var(--wf-radius, 28px);
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", Roboto, sans-serif;
    line-height: 1.15;
  }
  /* The system clock, its line centred on the device's clock row. */
  .wp-clock {
    position: absolute;
    display: flex;
    align-items: center;
    transform: translateY(-50%);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.01em;
    white-space: nowrap;
    color: #fff;
    font-variant-numeric: tabular-nums;
    pointer-events: none;
  }
  .wp-gear { display: flex; opacity: 0.55; }
  .wp-gear svg { display: block; }
  /* A tile as the watch lays it out: everything placed in its own layer,
     the symbol centred, the name at the bottom, badges in the corners. */
  .wp-tile {
    position: absolute;
    box-sizing: border-box;
    overflow: hidden;
  }
  /* The glass's inner shadow, deeper while lit. */
  .wp-tile::after {
    content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
    box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.22);
  }
  .wp-tile.off::after { box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25); }
  .wp-tile.unknown::after { display: none; }
  .wp-icon { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
  .wp-tile > .wp-label {
    position: absolute; left: 0; right: 0; padding: 0 1px; text-align: center; line-height: 1.2; pointer-events: none;
  }
  .wp-side { position: absolute; pointer-events: none; }
  .wp-art { position: absolute; inset: 0; border-radius: inherit; background-size: contain; background-position: center; background-repeat: no-repeat; pointer-events: none; }
  .wp-art-band { position: absolute; left: 0; right: 0; bottom: 0; height: 50%; border-radius: inherit; background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.85)); pointer-events: none; }
  .wp-tpl { display: flex; flex-direction: column; justify-content: center; align-items: center; }
  .wp-tpl-text {
    position: relative; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 5; overflow: hidden;
    width: 100%; white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.2;
    font-family: ui-rounded, "SF Pro Rounded", "Nunito", system-ui, sans-serif; font-weight: 600;
  }
  .wp-tpl-icon { display: inline-block; vertical-align: -0.12em; }
  .wp-tile.unknown { outline: 1px dashed rgba(255, 255, 255, 0.3); outline-offset: -1px; }
  .wp-sym { display: block; flex: none; position: relative; }
  .wp-under { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; }
  .wp-bar { position: absolute; border-radius: 999px; pointer-events: none; }
  /* An HTTP action's Tile Value, where the symbol goes. */
  .wp-value {
    position: relative; flex: none; line-height: 1; text-align: center; font-weight: 600; font-variant-numeric: tabular-nums;
    font-family: ui-rounded, "SF Pro Rounded", "Nunito", system-ui, sans-serif;
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
  .wp-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
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
  .wp-smart-check { display: block; line-height: 0; }
  /* A smart page's tile, in a box of its own so a rule's tiles can be told
     apart: the tiles of every other rule draw faint, as on the phone. */
  .wp-smart-item {
    position: absolute; display: block; margin: 0; padding: 0; border: 0; border-radius: 6px;
    background: transparent; color: inherit; font: inherit; text-align: inherit; transition: opacity .12s ease-out;
  }
  button.wp-smart-item { cursor: pointer; }
  button.wp-smart-item:focus-visible { outline: 2px solid var(--wa-accent, #0a84ff); outline-offset: 1px; }
  .wp-smart-item.dim { opacity: 0.3; }
`;
