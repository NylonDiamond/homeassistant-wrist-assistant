// A plain picture of one watch page: the screen at the watch's size in the
// watch's case, its 12 column grid, and each tile at its place and size with
// its color, symbol, name and badge.
//
// The placement comes from `watchPageLayout`, which is the watch's own
// arithmetic, on the grid's width inside the side safe area
// (`watchPreviewLayout`), after the watch's own passes over the page: tiles
// with no color get the color the sync rules give them, tiles hidden while
// off are packed away, and an entity with no state draws its seeded state.
// A tile is laid out and painted as its watch view does it (the symbol at
// its font size with its gradient, the name in SF Compact, the badges, the
// corners, the lit and unlit glass, borders stroked on the edge and clipped,
// patterns with their real geometry), and the screen has the system clock,
// the settings gear, the page title and the page dots where the watch puts
// them. Every rule names the Swift it was copied from, and the numbers the
// code leaves open were measured against the 46 mm simulator. An effect or
// an animated border is a tinted hint; nothing moves.
//
// Drawn in HTML rather than one SVG so a long name can end in an ellipsis.
// Every size is in points times `scale`, so the picture is the screen grown
// evenly rather than a layout of its own.

import { css, html, nothing, svg, unsafeCSS, type TemplateResult } from "lit";
import type { HassEntityState } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";
import {
  type PlacedWatchTile,
  type WatchPage,
  type WatchPageLayout,
  type WatchPageLayoutOptions,
  WATCH_GRID_SIDE_INSET,
  type WatchPageTile,
  type WatchTileColor,
  WATCH_KIND_FALLBACK_LABELS,
  dividerParts,
  isSmartWatchPage,
  parseTileColor,
  tileClass,
  tileEntityId,
  tileGeometry,
  watchPageTiles,
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

export type WatchPreviewStateMode = "live" | "all-on";

export interface WatchPagePreviewInput {
  page: WatchPage;
  /** Every page of the document, so a page link can be named after its page. */
  pages: readonly WatchPage[];
  /** The watch's screen in points. */
  screen: { width: number; height: number };
  states?: Record<string, HassEntityState>;
  /** Which states the tiles draw: Home Assistant's as they are ("live", the
   * default), or each tile in a typical on state ("all-on",
   * `watchAllOnStates`), so a page is seen as it looks lit whatever its
   * entities are doing now. A smart page always draws live. */
  stateMode?: WatchPreviewStateMode;
  /** Entities whose state in `states` is one being tried in the page
   * editor's Live strip. The all-on picture leaves them as `states` has them,
   * so the state tried wins over the lit one. */
  testedIds?: ReadonlySet<string>;
  /** The panel's symbol provider. Without one, tiles draw a dot for a symbol. */
  icons?: IconProvider;
  /** CSS pixels per point. */
  scale?: number;
  /** The iPhone's library, which names a macro or status page tile with no
   * label of its own as the watch does. Its status pages are the watch's
   * own record's when there is one (`watchCatalogWithStatusPages`). */
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
  /** The watch's behavior settings (the keys of `watch-settings-catalog.json`,
   * such as `showPageIndicator`), for what the page draws from them. Absent
   * keys take the watch's defaults. */
  behavior?: Readonly<Record<string, unknown>>;
}

/** The watch's own page indicator, when the document has more than one
 * page it shows (`PageLineIndicator`, pinned to the screen's bottom or top
 * edge outside the safe area): dots (the default), lines or a dash, white
 * or its color, at the brightness's opacities (Subtle 0.5 and 0.15, Medium
 * 0.7 and 0.2, Bright 0.9 and 0.3) and the size's scale (Small 0.75, the
 * default; Medium 1; Large 1.35), all times the screen's uniform scale. */
export function renderWatchPageIndicator(input: WatchPagePreviewInput, s: number): TemplateResult | typeof nothing {
  const b = input.behavior ?? {};
  if (b.showPageIndicator === false) return nothing;
  const visible = input.pages.filter((p) => p.isHidden !== true && p.isSystemPage !== true);
  if (visible.length < 2) return nothing;
  const current = Math.max(0, visible.findIndex((p) => p.id === input.page.id));
  const { width, height } = input.screen;
  const metric = watchUniformScale(input.screen);
  const size = ({ Small: 0.75, Medium: 1, Large: 1.35 } as Record<string, number>)[String(b.pageIndicatorSize ?? "Small")] ?? 0.75;
  const [on, off] = ({ Subtle: [0.5, 0.15], Medium: [0.7, 0.2], Bright: [0.9, 0.3] } as Record<string, [number, number]>)[String(b.pageIndicatorOpacity ?? "Subtle")] ?? [0.5, 0.15];
  const color = parseTileColor(b.pageIndicatorColorHex);
  const ink = color?.kind === "solid" ? color.hex : "#FFFFFF";
  const style = String(b.pageIndicatorStyle ?? "Dots");
  const top = b.pageIndicatorPosition === "Top";
  const px = (pt: number) => `${Math.round(pt * s * 100) / 100}px`;
  let row: TemplateResult;
  let rowHeight: number;
  if (style === "Lines" || style === "Dash") {
    rowHeight = 2.5 * size * metric;
    const total = width * 0.5;
    if (style === "Dash") {
      const segment = total / visible.length;
      row = html`<span class="wp-pages-bar" style=${`width:${px(total)};height:${px(rowHeight)};background:${rgba(ink, off)}`}><span style=${`left:${px(segment * current)};width:${px(segment)};background:${rgba(ink, on)}`}></span></span>`;
    } else {
      const gap = 3 * size * metric;
      const each = (total - gap * (visible.length - 1)) / visible.length;
      row = html`${visible.map((_, i) => html`<span class="wp-pages-line" style=${`width:${px(each)};height:${px(rowHeight)};margin-left:${px(i === 0 ? 0 : gap)};background:${rgba(ink, i === current ? on : off)}`}></span>`)}`;
    }
  } else {
    rowHeight = 6 * size * metric;
    const gap = 5 * size * metric;
    row = html`${visible.map((_, i) => {
      const d = (i === current ? 6 : 5) * size * metric;
      return html`<span class="wp-pages-dot" style=${`width:${px(d)};height:${px(d)};margin-left:${px(i === 0 ? 0 : gap)};background:${rgba(ink, i === current ? on : off)}`}></span>`;
    })}`;
  }
  return html`<span class="wp-pages" style=${`top:${px(top ? 0 : height - rowHeight)};height:${px(rowHeight)};width:${px(width)}`}>${row}</span>`;
}

/** `WatchScreenMetrics.uniformScale`: the screen's width and height against
 * the 45 mm watch (198 by 242), each held to 0.82 to 1.18, mixed 0.72 to
 * 0.28 and held again. */
export function watchUniformScale(screen: { width: number; height: number }): number {
  const clamp = (v: number) => Math.max(0.82, Math.min(1.18, v));
  return clamp(clamp(screen.width / 198) * 0.72 + clamp(screen.height / 242) * 0.28);
}

/** The watch's system font, `.system(design: .default)`, which is SF Compact
 * on watchOS. */
export const WATCH_FONT_FAMILY = '"SF Compact Text", "SF Compact", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

/** `.system(design: .rounded)` on watchOS: SF Compact Rounded. */
export const WATCH_ROUNDED_FAMILY = '"SF Compact Rounded", ui-rounded, "SF Pro Rounded", "Nunito", system-ui, sans-serif';

/** The tracking SwiftUI gives a tile's name, in ems. */
export const WATCH_LABEL_TRACKING = 0.045;

/** How far below the middle of its line box the clock's digits' middle sits,
 * in ems of SF Compact (measured in Chrome against the simulator). */
const CLOCK_DIGIT_SHIFT = 0.01;

/** The room a 16 point SF Compact figure keeps right of its ink, in points. */
const CLOCK_SIDE_BEARING = 1;

/** The watch's side safe area, in points (`WATCH_GRID_SIDE_INSET`): the
 * grid's width is the screen less this on each side and every tile sits this
 * far in from the left. The settings gear sits this much further in than its
 * own constants say, too. */
export const WATCH_SCREEN_SIDE_INSET = WATCH_GRID_SIDE_INSET;

/** A page placed as the watch places it: `watchPageLayout` on the grid's
 * own width (the screen less the side safe area), moved in by that inset.
 * `flat` as `watchPageLayout` takes it: the editor's grid, with no pull up
 * at headers, in the same columns as the watch's. */
export function watchPreviewLayout(page: WatchPage, screen: { width: number; height: number }, options?: WatchPageLayoutOptions): WatchPageLayout {
  const inset = WATCH_SCREEN_SIDE_INSET;
  const inner = watchPageLayout(page, { width: Math.max(1, screen.width - inset * 2), height: screen.height }, options);
  return { ...inner, screen: { ...screen }, tiles: inner.tiles.map((t) => ({ ...t, x: t.x + inset })) };
}

/** Whether the watch counts an entity active for a tile's "hide when off"
 * (`EntityStateViewModel.isEntityActive` with no rule): a light, switch,
 * fan or toggle on, an automation enabled, a cover or valve open, a lock
 * unlocked, a climate not off, a media player not off or on standby, a
 * vacuum cleaning, returning or paused, a remote whose player is on (else
 * itself on), an alarm armed; anything else on, open or unlocked. A missing
 * entity is not active. */
export function watchEntityActive(entityId: string, states: Readonly<Record<string, HassEntityState>>): boolean {
  const entity = Object.hasOwn(states, entityId) ? states[entityId] : undefined;
  if (entity === undefined) return false;
  const state = lower(entity.state);
  switch (entityId.split(".")[0]) {
    case "light": case "switch": case "fan": case "input_boolean": case "automation":
      return state === "on";
    case "cover": case "valve": {
      const p = storedNumber(entity.attributes?.current_position);
      return p !== undefined ? p > 0 : state === "open" || state === "opening";
    }
    case "lock":
      return state !== "locked";
    case "climate":
      return state !== "off" && state !== "unavailable";
    case "media_player":
      return watchMediaPlayerOn(state);
    case "vacuum":
      return state === "cleaning" || state === "returning" || state === "paused";
    case "remote": {
      const player = states[`media_player.${entityId.slice("remote.".length)}`];
      return player !== undefined ? watchMediaPlayerOn(lower(player.state)) : state === "on";
    }
    case "alarm_control_panel":
      return Object.hasOwn(ALARM_WORDS, state) && state !== "disarmed";
    default:
      return state === "on" || state === "open" || state === "unlocked";
  }
}

/**
 * A page as the watch lays it out once its "hide when off" tiles that are
 * off are gone (`InteractiveGrid.computeReflow`): with nothing hidden, the
 * page itself; else every other tile but the headers is packed again, in
 * row then column order, into the first free place at or below the top of
 * its section (the rows between the headers around it), headers keeping
 * their rows; a tile that cannot fit its section stays where it is stored.
 * Without states nothing is hidden.
 */
export function watchReflowPage(page: WatchPage, states: Readonly<Record<string, HassEntityState>> | undefined, columns = 12): WatchPage {
  if (states === undefined) return page;
  const items = watchPageTiles(page);
  const hidden = new Set(items.filter((t) => t.hideWhenInactive === true && tileEntityId(t) !== "" && !watchEntityActive(tileEntityId(t), states)));
  if (hidden.size === 0) return page;
  const isDivider = (t: WatchPageTile) => tileKind(tileEntityId(t)) === "divider";
  const dividerRows = items.filter(isDivider).flatMap((t) => {
    const g = tileGeometry(t);
    return Array.from({ length: g.rowSpan }, (_, i) => g.row + i);
  }).sort((a, b) => a - b);
  const occupied = new Set<number>();
  for (const r of dividerRows) for (let c = 0; c < columns; c++) occupied.add(r * columns + c);
  const placed = new Map<WatchPageTile, { row: number; col: number }>();
  const visible = items.filter((t) => !isDivider(t) && !hidden.has(t))
    .sort((a, b) => tileGeometry(a).row - tileGeometry(b).row || tileGeometry(a).col - tileGeometry(b).col);
  for (const tile of visible) {
    const g = tileGeometry(tile);
    const cs = Math.min(Math.max(g.colSpan, 1), columns);
    const rs = Math.max(g.rowSpan, 1);
    const above = dividerRows.filter((r) => r < g.row);
    const start = above.length === 0 ? 0 : above[above.length - 1]! + 1;
    const end = dividerRows.find((r) => r > g.row) ?? Infinity;
    for (let r = start; ; r++) {
      if (r + rs > end) {
        placed.set(tile, { row: g.row, col: g.col });
        break;
      }
      let spot: number | undefined;
      for (let c = 0; c <= columns - cs && spot === undefined; c++) {
        let fits = true;
        for (let dr = 0; dr < rs && fits; dr++) for (let dc = 0; dc < cs && fits; dc++) if (occupied.has((r + dr) * columns + c + dc)) fits = false;
        if (fits) spot = c;
      }
      if (spot !== undefined) {
        for (let dr = 0; dr < rs; dr++) for (let dc = 0; dc < cs; dc++) occupied.add((r + dr) * columns + spot + dc);
        placed.set(tile, { row: r, col: spot });
        break;
      }
    }
  }
  const shown = items.filter((t) => !hidden.has(t)).map((t) => {
    const at = placed.get(t);
    return at === undefined ? t : { ...t, gridRow: at.row, gridCol: at.col };
  });
  return { ...page, items: shown };
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

/** `RainbowHelper.colors`: red, orange, yellow, green, cyan, blue and purple,
 * the system colors as a watch (always dark) draws them. */
const RAINBOW_STOPS = ["255, 69, 58", "255, 159, 10", "255, 214, 10", "48, 209, 88", "100, 210, 255", "10, 132, 255", "191, 90, 242"];

/**
 * A tile's glass as CSS background layers, top first, everything times
 * `alpha` (the tile's `colorOpacity`). On (`activeGlassBackground`): a white
 * sheen from 0.32 at the top through 0.10 to clear at the middle, the color
 * at 0.52 and saturation 0.92 (a gradient's mesh at 0.32, the rainbow at
 * 0.42), over the frosted material at 0.62. Off (`inactiveGlassBackground`):
 * the thin material at 0.3, the color at 0.025 (a gradient at 0.03) and
 * gray at 0.06. A tile with no color of its own is filled in `ink`, its
 * kind's color. The materials darken what is behind them and add no light
 * of their own: on the simulator a lit tile over black is its color at 0.52
 * and nothing more, and over navy the material passes about half the navy
 * (`WATCH_MATERIAL_DARKEN`).
 */
export function watchTileFill(color: WatchTileColor | undefined, ink: string, active: boolean, alpha = 1, size?: { width: number; height: number }): string {
  const a = (n: number) => Math.round(n * alpha * 1000) / 1000;
  const flat = (c: string) => `linear-gradient(${c}, ${c})`;
  if (active) {
    const sheen = `linear-gradient(180deg, rgba(255, 255, 255, ${a(0.32)}), rgba(255, 255, 255, ${a(0.1)}) 25%, rgba(255, 255, 255, 0) 50%)`;
    const tint = color?.kind === "rainbow"
      ? `linear-gradient(${watchDiagonal(size?.width, size?.height)}, ${RAINBOW_STOPS.map((c) => `rgba(${c}, ${a(0.42)})`).join(", ")})`
      : color?.kind === "gradient"
        ? watchMeshGradient(watchSaturate(color.from, 0.92), watchSaturate(color.to, 0.92), 0.32 * alpha)
        : flat(rgba(watchSaturate(color?.kind === "solid" ? color.hex : ink, 0.92), 0.52 * (color?.kind === "solid" ? color.opacity : 1) * alpha));
    return [sheen, tint, flat(`rgba(0, 0, 0, ${a(0.62 * WATCH_MATERIAL_DARKEN)})`)].join(", ");
  }
  const tint = color?.kind === "gradient"
    ? watchMeshGradient(color.from, color.to, 0.03 * alpha)
    : flat(rgba(color?.kind === "solid" ? color.hex : ink, 0.025 * alpha));
  return [tint, flat(`rgba(142, 142, 147, ${a(0.06)})`), flat(`rgba(0, 0, 0, ${a(0.3 * WATCH_MATERIAL_DARKEN)})`)].join(", ");
}

/** How much of what is behind a material at full opacity it takes away
 * (fitted: a lit tile's material at 0.62 left about half of the navy
 * page behind it). */
const WATCH_MATERIAL_DARKEN = 0.8;

/** A color with SwiftUI's `.saturation(amount)` applied (the luminance
 * preserving matrix CSS's `saturate()` uses too), as hex. */
export function watchSaturate(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1, 7), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const s = amount;
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${ch((0.213 + 0.787 * s) * r + (0.715 - 0.715 * s) * g + (0.072 - 0.072 * s) * b)}${ch((0.213 - 0.213 * s) * r + (0.715 + 0.285 * s) * g + (0.072 - 0.072 * s) * b)}${ch((0.213 - 0.213 * s) * r + (0.715 - 0.715 * s) * g + (0.072 + 0.928 * s) * b)}`;
}

/** The CSS direction of a SwiftUI `LinearGradient` from `.topLeading` to
 * `.bottomTrailing` over a box of this size: along the box's diagonal in
 * points, its bands square to it, so it reaches the far corners at 0 and
 * 100% and the other two corners part way (CSS's `to bottom right` would
 * put them at 50%). Without a size, `to bottom right`. */
export function watchDiagonal(width?: number, height?: number): string {
  if (width === undefined || height === undefined || width <= 0 || height <= 0) return "to bottom right";
  return `${Math.round((90 + (Math.atan2(height, width) * 180) / Math.PI) * 100) / 100}deg`;
}

/** A gradient color's mesh (`MeshGradientBuilder`, 3 by 3) at `alpha`, as
 * one CSS gradient: the first color in the top left and bottom right
 * corners, the second in the other two and, at 0.7, through the middle.
 * Along the diagonal that is the first color, the second at 0.7, the
 * first; the other two corners land on the middle stop, the second color. */
export function watchMeshGradient(from: string, to: string, alpha: number): string {
  return `linear-gradient(to bottom right, ${rgba(from, alpha)}, ${rgba(to, 0.7 * alpha)} 50%, ${rgba(from, alpha)})`;
}

/** A tile's `colorOpacity`, which the watch multiplies its fill, border and
 * pattern by: 0 to 1, 1 when absent. */
export function watchTileColorOpacity(tile: WatchPageTile): number {
  const v = storedNumber(tile.colorOpacity);
  return v === undefined ? 1 : Math.max(0, Math.min(1, v));
}

/** The theme every tile's own default colors resolve in on the watch. Tiles
 * read `DS.color(...)`, which reads `DSThemeStore.shared.currentTheme`; that
 * starts at `DSTheme.fallback` (sunnyBeachDay, `DS+Color.swift`) and nothing
 * in the app ever calls `DS.setTheme`. A page's theme reaches only its
 * background and its title. */
export const WATCH_TILE_THEME = "sunnyBeachDay";

/** The role whose color a tile with no color of its own is given, by its
 * entity's domain (`WatchPagesSyncRules.defaultColorHex`); undefined is the
 * accent, which the theme palette has no hex for, so white. */
const SYNC_COLOR_ROLES: Readonly<Record<string, string>> = {
  light: "entityLight", switch: "entitySwitch", lock: "entityLock", cover: "entityCover", valve: "entityCover",
  climate: "entityClimate", button: "entityButton", input_button: "entityButton", remote: "entityRemote", fan: "entityFan",
  sensor: "entitySensor", binary_sensor: "entitySensor", number: "entitySensor", input_number: "entitySensor", weather: "entitySensor",
  scene: "entityScene", script: "entityScript", person: "entityPerson", timer: "entityTimer", vacuum: "entityVacuum",
  media_player: "entityMediaPlayer", camera: "entityCamera", page: "entityPage",
};

/** The color the watch is sent for a tile with none
 * (`WatchPagesSyncRules.applyDefaultTileColors`, run by the phone before it
 * sends pages and by the watch on pages it pulls from Home Assistant): its
 * domain's color in its page's theme, else white. So a tile view's own
 * fallback color is never reached on the watch. */
export function watchSyncedTileColor(entityId: string, page: WatchPage | undefined): string {
  const domain = entityId.split(".")[0] ?? "";
  const role = SYNC_COLOR_ROLES[domain];
  if (role === undefined) return "#FFFFFF";
  const theme = page === undefined ? WATCH_TILE_DEFAULTS.watchFallbackTheme : watchPageTheme(page);
  return watchThemeRoleColors(theme)[role] ?? "#FFFFFF";
}

/** A tile as the watch receives it: with no color of its own, the color
 * `watchSyncedTileColor` gives it. */
export function watchSyncedTile(tile: WatchPageTile, page: WatchPage | undefined): WatchPageTile {
  return tile.color === undefined || tile.color === null ? { ...tile, color: watchSyncedTileColor(tileEntityId(tile), page) } : tile;
}

/** The colors a tile view falls back to where it does not use its kind's
 * row of the add table: a number the sensor color, a select the button
 * color, the action tiles the accent, a status page or inbox the info
 * color, a spoken message the media player's (`SimpleTileViews`). */
const WATCH_VIEW_DEFAULTS: Readonly<Record<string, string>> = {
  input_number: "entitySensor", number: "entitySensor", input_select: "entityButton", select: "entityButton",
  http_action: "accent", macro: "accent", assist: "accent", status_page: "info", webhook_inbox: "info", speak_message: "entityMediaPlayer",
};

/** A sensor family tile's default color (`SensorEntity.suggestedColor`):
 * by device class, then by kind, else gray. */
export function watchSensorSuggestedColor(entityId: string, entity: HassEntityState | undefined): string {
  const dc = lower(entity?.attributes?.device_class);
  const level = Number(entity?.state);
  const byClass: Record<string, string> = {
    temperature: "#FF9500", humidity: "#5AC8FA", power: "#FFCC00", energy: "#FFCC00", illuminance: "#FFD60A",
    motion: "#AF52DE", occupancy: "#AF52DE", door: "#FF9500", window: "#FF9500",
    pm25: "#FF6B6B", pm10: "#FF6B6B", pm1: "#FF6B6B", gas: "#FF6B6B", carbon_dioxide: "#FF6B6B", carbon_monoxide: "#FF6B6B",
  };
  if (dc === "battery") return entity !== undefined && String(entity.state).trim() !== "" && Number.isFinite(level) && level < 20 ? "#FF3B30" : "#34C759";
  if (Object.hasOwn(byClass, dc)) return byClass[dc]!;
  const byKind: Record<string, string> = {
    text: "#5AC8FA", input_text: "#5AC8FA", counter: "#64D2FF", todo: "#34C759", update: "#5AC8FA", water_heater: "#FF9500",
    lawn_mower: "#34C759", humidifier: "#5AC8FA", device_tracker: "#AF52DE", event: "#FF9500", zone: "#0A84FF", calendar: "#30B0C7",
    date: "#30B0C7", time: "#30B0C7", datetime: "#30B0C7", input_datetime: "#30B0C7", image: "#64D2FF", weather: "#5AC8FA",
    siren: "#FF3B30", assist_satellite: "#5AC8FA", conversation: "#64D2FF", tts: "#30D158", stt: "#0A84FF", wake_word: "#FFD60A",
  };
  return byKind[tileKind(entityId)] ?? "#8E8E93";
}

/** The flat color a tile with no color of its own draws its symbol,
 * border, glow and bar in: a sensor family tile's suggested color, a
 * view's own default (`WATCH_VIEW_DEFAULTS`), else its kind's color, all in
 * `WATCH_TILE_THEME` whatever the page's theme; else white. `page` is kept
 * for callers and no longer read. */
export function watchTileFallbackInk(tile: WatchPageTile, _page?: WatchPage, states?: Readonly<Record<string, HassEntityState>>): string {
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  if (SENSOR_KINDS.has(kind)) return watchSensorSuggestedColor(entityId, states !== undefined && Object.hasOwn(states, entityId) ? states[entityId] : undefined);
  const view = WATCH_VIEW_DEFAULTS[kind];
  if (view !== undefined) return themeInk(undefined, view as "accent" | "info" | `entity${string}`).hex;
  if (kind === "timer") {
    // The timer color while it runs or pauses, else the secondary text's
    // white (whose 0.7 the symbol's treatment carries).
    const state = lower(states !== undefined && Object.hasOwn(states, entityId) ? states[entityId]?.state : undefined);
    if (state !== "active" && state !== "paused") return "#FFFFFF";
  }
  const own = watchKindColor(entityId, WATCH_TILE_THEME);
  return own === undefined ? "#FFFFFF" : flatInk(own, "#FFFFFF");
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
export function watchScreenBackground(page: WatchPage, s = 1.5, screen?: { width: number; height: number }): string {
  const layers: string[] = [];
  // The animated overlay over the pattern, as `TileGridPageView` stacks them.
  const overlay = watchPageValue(page, "backgroundOverlay");
  if (typeof overlay === "string" && overlay !== "none") {
    const c = parseTileColor(watchPageValue(page, "backgroundOverlayColor"));
    const ink = tileInkColor(c, "#FFFFFF");
    layers.push(`radial-gradient(ellipse at 50% 30%, ${rgba(ink, 0.22)}, transparent 70%)`);
  }
  const pattern = watchPageValue(page, "backgroundPattern");
  if (typeof pattern === "string" && pattern !== "none") {
    const ink = tileInkColor(parseTileColor(watchPageValue(page, "backgroundPatternColor")));
    const opacity = numberOr(watchPageValue(page, "backgroundPatternOpacity"), 0.5);
    const scale = numberOr(watchPageValue(page, "backgroundPatternScale"), 1);
    layers.push(...watchPatternLayers(pattern, ink, opacity, scale * s, screen === undefined ? undefined : { width: screen.width * s, height: screen.height * s }));
  }
  const veil = watchBrightnessVeil(numberOr(watchPageValue(page, "backgroundBrightness"), 0.6));
  if (veil !== undefined) layers.push(`linear-gradient(${veil}, ${veil})`);
  const color = parseTileColor(page.backgroundColor);
  if (color?.kind === "gradient") layers.push(`linear-gradient(${watchDiagonal(screen?.width, screen?.height)}, ${color.from}, ${color.to})`);
  else if (color?.kind === "solid") layers.push(`linear-gradient(${watchScreenColor(page)}, ${watchScreenColor(page)})`);
  else layers.push(...watchThemeBackgroundLayers(watchPageTheme(page), s, screen));
  return layers.join(", ");
}

/** A theme's own page background (`TileGridPageView.fallbackPageBackground`),
 * drawn when a page has no color of its own: its dark base, a wash of two
 * colors to clear from one corner to the opposite one, and a glow of one
 * color from a point out to a radius in points. */
const THEME_BACKGROUNDS: Readonly<Record<string, { wash: [string, number][]; from: string; glow: [string, number]; at: string; radius: number }>> = {
  midnight: { wash: [["#3E78C4", 0.18], ["#6A74D8", 0.14]], from: "top left", glow: ["#F2D35C", 0.08], at: "100% 100%", radius: 160 },
  sunrise: { wash: [["#F78F42", 0.2], ["#F06A5E", 0.16]], from: "top left", glow: ["#F4CF63", 0.1], at: "50% 0%", radius: 140 },
  forest: { wash: [["#2BAF9A", 0.18], ["#3FC878", 0.12]], from: "top left", glow: ["#3DB1D0", 0.1], at: "0% 100%", radius: 150 },
  sunnyBeachDay: { wash: [["#2A9D8F", 0.2], ["#2F79B6", 0.14]], from: "top left", glow: ["#E9C46A", 0.08], at: "100% 100%", radius: 140 },
  neonLagoon: { wash: [["#02C3BD", 0.2], ["#4E148C", 0.3]], from: "top left", glow: ["#47C4FF", 0.18], at: "0% 0%", radius: 140 },
  softVintage: { wash: [["#AC8974", 0.16], ["#726A7E", 0.14]], from: "top left", glow: ["#C49186", 0.1], at: "50% 0%", radius: 130 },
  hyperPop: { wash: [["#00F5D4", 0.18], ["#9B5DE5", 0.24], ["#F15BB5", 0.22]], from: "top left", glow: ["#FEE440", 0.15], at: "0% 0%", radius: 140 },
  ember: { wash: [["#E8512F", 0.18], ["#B8723A", 0.14]], from: "bottom left", glow: ["#E8A33D", 0.12], at: "50% 100%", radius: 150 },
  sakura: { wash: [["#E080A0", 0.18], ["#9A80B8", 0.14]], from: "top left", glow: ["#F0B8C0", 0.1], at: "100% 0%", radius: 130 },
  polar: { wash: [["#6AABB8", 0.16], ["#5080A8", 0.12]], from: "top left", glow: ["#C8D8E0", 0.08], at: "50% 0%", radius: 140 },
};

/** A theme's page background as CSS layers, top first, at `s` pixels per
 * point. The hyper pop wash runs through three colors to the far corner;
 * every other through two and then clear. */
export function watchThemeBackgroundLayers(theme: string, s = 1.5, screen?: { width: number; height: number }): string[] {
  const base = watchStylingTheme(theme)?.pageDefaultBackground ?? "#000";
  const look = THEME_BACKGROUNDS[theme];
  if (look === undefined) return [`linear-gradient(${base}, ${base})`];
  // From the bottom left corner to the top right is the top left diagonal
  // turned a quarter back.
  const diagonal = watchDiagonal(screen?.width, screen?.height);
  const to = look.from !== "bottom left" ? diagonal
    : diagonal.endsWith("deg") ? `${Math.round((180 - parseFloat(diagonal)) * 100) / 100}deg` : "to top right";
  const stops = look.wash.map(([hex, a]) => rgba(hex, a));
  if (look.wash.length < 3) stops.push("transparent");
  const glow = `radial-gradient(circle ${Math.round(look.radius * s * 100) / 100}px at ${look.at}, ${rgba(look.glow[0], look.glow[1])}, transparent)`;
  return [glow, `linear-gradient(${to}, ${stops.join(", ")})`, `linear-gradient(${base}, ${base})`];
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

/** One repeating cell of a drawn pattern, in points at scale 1: its size,
 * its marks as SVG (each line stroked on its own, so crossings add up as
 * the watch's separately stroked paths do), and whether the cell is
 * anchored on the view's centre (the diagonal patterns, which the watch
 * draws rotated about the centre) rather than its top left corner. */
interface PatternCell {
  size: number;
  marks: (ink: string, alpha: number) => string;
  centred: boolean;
}

const line = (x1: number, y1: number, x2: number, y2: number, w: number) => (ink: string, alpha: number) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ink}" stroke-opacity="${alpha}" stroke-width="${w}"/>`;
const marks = (...parts: ((ink: string, alpha: number) => string)[]) => (ink: string, alpha: number) => parts.map((p) => p(ink, alpha)).join("");
const DIAGONAL = 8 * Math.SQRT2;

/** The patterns `TilePatterns.swift` draws with lines, dots and squares, by
 * their geometry there: stripes 2 wide every 8 at 45 degrees, crosshatch
 * 1.5 wide every 8 both ways, lines 2 wide every 8 starting 4 in, a grid 1
 * wide every 8 from the edge, dots 3 across every 8, diamonds 10 across
 * outlined 1.5 wide, and 6 point checks. */
const PATTERN_CELLS: Readonly<Record<string, PatternCell>> = {
  stripes: { size: DIAGONAL, centred: true, marks: marks(line(-DIAGONAL, DIAGONAL, DIAGONAL, -DIAGONAL, 2), line(-DIAGONAL, 2 * DIAGONAL, 2 * DIAGONAL, -DIAGONAL, 2), line(0, 2 * DIAGONAL, 2 * DIAGONAL, 0, 2)) },
  crosshatch: {
    size: DIAGONAL, centred: true,
    marks: marks(
      line(-DIAGONAL, DIAGONAL, DIAGONAL, -DIAGONAL, 1.5), line(-DIAGONAL, 2 * DIAGONAL, 2 * DIAGONAL, -DIAGONAL, 1.5), line(0, 2 * DIAGONAL, 2 * DIAGONAL, 0, 1.5),
      line(-DIAGONAL, 0, DIAGONAL, 2 * DIAGONAL, 1.5), line(0, -DIAGONAL, 2 * DIAGONAL, DIAGONAL, 1.5), line(-DIAGONAL, -DIAGONAL, 2 * DIAGONAL, 2 * DIAGONAL, 1.5),
    ),
  },
  horizontalLines: { size: 8, centred: false, marks: line(0, 4, 8, 4, 2) },
  verticalLines: { size: 8, centred: false, marks: line(4, 0, 4, 8, 2) },
  grid: { size: 8, centred: false, marks: marks(line(0, 0, 8, 0, 1), line(0, 8, 8, 8, 1), line(0, 0, 0, 8, 1), line(8, 0, 8, 8, 1)) },
  dots: { size: 8, centred: false, marks: (ink, alpha) => `<circle cx="4" cy="4" r="1.5" fill="${ink}" fill-opacity="${alpha}"/>` },
  diamond: { size: 10, centred: false, marks: marks(line(5, 0, 0, 5, 1.5), line(5, 0, 10, 5, 1.5), line(0, 5, 5, 10, 1.5), line(10, 5, 5, 10, 1.5)) },
  checkerboard: { size: 12, centred: false, marks: (ink, alpha) => `<path d="M0 0h6v6H0zM6 6h6v6H6z" fill="${ink}" fill-opacity="${alpha}"/>` },
};

const r2 = (v: number) => Math.round(v * 100) / 100;
const stroke = (d: string, w: number) => (ink: string, alpha: number) =>
  `<path d="${d}" fill="none" stroke="${ink}" stroke-opacity="${alpha}" stroke-width="${w}" stroke-linejoin="round"/>`;

/** One wave row (`WavesPattern`): amplitude 4, wavelength 16, drawn as the
 * watch does in 2 point steps, from x 0 to 16, at height `y`. */
function waveRow(y: number): string {
  const points: string[] = [];
  for (let x = 0; x <= 16; x += 2) points.push(`${x} ${r2(y + 4 * Math.sin((x / 16) * Math.PI * 2))}`);
  return `M${points.join("L")}`;
}

/** One zigzag row (`ZigzagPattern`): from (0, y), half segments of 4 up and
 * down by 4, to x 16. */
function zigzagRow(y: number): string {
  const points = [`0 ${y}`];
  let up = true;
  for (let x = 0; x < 16; x += 4) {
    points.push(`${x + 4} ${y + (up ? -4 : 4)}`);
    up = !up;
  }
  return `M${points.join("L")}`;
}

/** The patterns whose cells are wider or taller than square: their cell's
 * width and height in points at scale 1, from the top left corner. */
const PATTERN_RECT_CELLS: Readonly<Record<string, { width: number; height: number; marks: (ink: string, alpha: number) => string }>> = {
  // Rows every 16 (8 apart plus twice the amplitude).
  waves: { width: 16, height: 16, marks: marks(stroke(waveRow(0), 1.5), stroke(waveRow(16), 1.5)) },
  zigzag: { width: 16, height: 16, marks: marks(stroke(zigzagRow(4), 1.5), stroke(zigzagRow(20), 1.5), stroke(zigzagRow(-12), 1.5)) },
  // Upward triangles 12 across in rows 10.39 high, every other row moved 6.
  triangles: {
    width: 12, height: r2(12 * 0.866 * 2),
    marks: (ink, alpha) => {
      const h = 12 * 0.866;
      const tri = (x: number, y: number) => stroke(`M${r2(x + 6)} ${r2(y)}L${r2(x + 12)} ${r2(y + h)}L${r2(x)} ${r2(y + h)}Z`, 1)(ink, alpha);
      return [tri(0, 0), tri(-12, 0), tri(12, 0), tri(-6, h), tri(6, h), tri(0, 2 * h), tri(-12, 2 * h)].join("");
    },
  },
  // Hexagons of radius 10, columns 15 apart, every other column down by half.
  hexagons: {
    width: 30, height: r2(10 * Math.sqrt(3)),
    marks: (ink, alpha) => {
      const h = 10 * Math.sqrt(3);
      const parts: string[] = [];
      for (let col = -1; col <= 2; col++) {
        for (let row = -1; row <= 1; row++) {
          const cx = col * 15 + 10;
          const cy = row * h + (col % 2 === 0 ? 0 : h / 2) + h / 2;
          const pts = Array.from({ length: 6 }, (_, i) => {
            const a = (i * Math.PI) / 3 - Math.PI / 6;
            return `${r2(cx + 10 * Math.cos(a))} ${r2(cy + 10 * Math.sin(a))}`;
          });
          parts.push(stroke(`M${pts.join("L")}Z`, 1)(ink, alpha));
        }
      }
      return parts.join("");
    },
  },
};

/** `SeededRandomGenerator` (seed 12345) as Swift's `random(in:)` draws
 * from it: each double in a closed range takes one 64 bit step, scaled by
 * 2^53 + 1 (Lemire's method, retried in the rare biased case) over 2^53. */
function swiftRandom(seed: bigint): (lo: number, hi: number) => number {
  const MASK = (1n << 64n) - 1n;
  let state = seed;
  const next = () => {
    state = (state * 6364136223846793005n + 1442695040888963407n) & MASK;
    return state;
  };
  const bound = (1n << 53n) + 1n;
  const threshold = ((1n << 64n) - bound) % bound;
  return (lo, hi) => {
    let m = next() * bound;
    while ((m & MASK) < threshold) m = next() * bound;
    const rand = m >> 64n;
    const unit = rand === 1n << 53n ? 1 : Number(rand) / 2 ** 53;
    return lo + (hi - lo) * unit;
  };
}

/** The patterns drawn once across the whole view rather than tiled: the
 * sunburst's 16 rays and the concentric rings every 8 from the centre, and
 * the noise's seeded dots. `w` and `h` are the view's size in points at
 * scale 1. */
function wholePattern(pattern: string, ink: string, alpha: number, w: number, h: number): string | undefined {
  const cx = w / 2;
  const cy = h / 2;
  const reach = Math.sqrt(w * w + h * h) / 2;
  if (pattern === "sunburst") {
    return Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return line(r2(cx), r2(cy), r2(cx + Math.cos(a) * reach), r2(cy + Math.sin(a) * reach), 1.5)(ink, alpha);
    }).join("");
  }
  if (pattern === "concentric") {
    const count = Math.trunc(reach / 8) + 1;
    return Array.from({ length: count }, (_, i) => `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${(i + 1) * 8}" fill="none" stroke="${ink}" stroke-opacity="${alpha}" stroke-width="1"/>`).join("");
  }
  if (pattern === "noise") {
    const random = swiftRandom(12345n);
    const count = 40 * Math.trunc((w * h) / 1000);
    const dots: string[] = [];
    for (let i = 0; i < count; i++) {
      const x = random(0, w);
      const y = random(0, h);
      const a = random(0.5, 1) * alpha;
      dots.push(`<circle cx="${r2(x)}" cy="${r2(y)}" r="1" fill="${ink}" fill-opacity="${Math.round(a * 1000) / 1000}"/>`);
    }
    return dots.join("");
  }
  return undefined;
}

/**
 * A pattern as CSS background layers in `ink` at `opacity` times the
 * pattern's own, its features `unit` pixels per point. The line, grid,
 * dot, diamond and check patterns are drawn with the watch's geometry from
 * the view's top left corner (the diagonals through its centre, so `box`,
 * the view's size in pixels, places them); the glows are gradients; the
 * other patterns are a wash of the color.
 */
export function watchPatternLayers(pattern: string, ink: string, opacity: number, unit: number, box?: { width: number; height: number }): string[] {
  const own = PATTERN_OPACITY[pattern] ?? 0.15;
  const alpha = Math.round(Math.max(0, Math.min(1, opacity)) * own * 1000) / 1000;
  const c = rgba(ink, alpha);
  const cell = PATTERN_CELLS[pattern];
  if (cell !== undefined) {
    const n = Math.round(cell.size * 1000) / 1000;
    const tile = `<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${n}" viewBox="0 0 ${n} ${n}">${cell.marks(ink.slice(0, 7), alpha)}</svg>`;
    const size = Math.round(cell.size * unit * 1000) / 1000;
    const at = (v: number) => `${Math.round(v * 1000) / 1000}px`;
    const position = cell.centred ? `${at((box?.width ?? 0) / 2)} ${at((box?.height ?? 0) / 2)}` : "0 0";
    return [`url("data:image/svg+xml,${encodeURIComponent(tile)}") ${position} / ${size}px ${size}px repeat`];
  }
  const rect = PATTERN_RECT_CELLS[pattern];
  if (rect !== undefined) {
    const tile = `<svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}" viewBox="0 0 ${rect.width} ${rect.height}">${rect.marks(ink.slice(0, 7), alpha)}</svg>`;
    return [`url("data:image/svg+xml,${encodeURIComponent(tile)}") 0 0 / ${Math.round(rect.width * unit * 1000) / 1000}px ${Math.round(rect.height * unit * 1000) / 1000}px repeat`];
  }
  if (box !== undefined && box.width > 0 && box.height > 0) {
    // Drawn once over the view, which the watch's pattern fills at its scale.
    const w = box.width / unit;
    const h = box.height / unit;
    const drawn = wholePattern(pattern, ink.slice(0, 7), alpha, w, h);
    if (drawn !== undefined) {
      const image = `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(w)}" height="${r2(h)}" viewBox="0 0 ${r2(w)} ${r2(h)}">${drawn}</svg>`;
      return [`url("data:image/svg+xml,${encodeURIComponent(image)}") 0 0 / 100% 100% no-repeat`];
    }
  }
  switch (pattern) {
    case "gradient": {
      const a = (k: number) => rgba(ink, Math.max(0, Math.min(1, opacity)) * k);
      return [`linear-gradient(180deg, ${a(0.5)}, ${a(0.3)} 30%, ${a(0.1)} 60%, transparent)`];
    }
    case "cornerGlow": {
      // Out to 1.2 times the view's longer side from the bottom left corner.
      const a = (k: number) => rgba(ink, Math.max(0, Math.min(1, opacity)) * k);
      const size = box === undefined ? "" : ` ${Math.round(Math.max(box.width, box.height) * 1.2 * 100) / 100}px`;
      return [`radial-gradient(circle${size} at 0% 100%, ${a(0.4)}, ${a(0.2)} 40%, transparent 80%)`];
    }
    case "vignette": {
      // Out to 0.7 of the view's longer side from its centre.
      const a = (k: number) => rgba(ink, Math.max(0, Math.min(1, opacity)) * k);
      const size = box === undefined ? "" : ` ${Math.round(Math.max(box.width, box.height) * 0.7 * 100) / 100}px`;
      return [`radial-gradient(circle${size}, transparent 30%, ${a(0.15)} 70%, ${a(0.35)})`];
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
      // The light's glow is gated on its active icon animation, which is off
      // unless set (`resolvedActiveIconAnimationEnabled` is on by default for
      // fans only).
      opacity = on || !dim ? 1 : 0.68;
      glow = on && tile.activeIconAnimationEnabled === true ? "lit" : undefined;
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
    case "timer": {
      // An idle timer with no color of its own is in the secondary text
      // color, white at 0.7 (`SimpleTimerTile.defaultIconColor`).
      const running = entity === undefined || state === "active" || state === "paused";
      glow = running ? "lit" : undefined;
      opacity = running || parseTileColor(tile.color) !== undefined ? 1 : 0.7;
      break;
    }
    case "point_control":
      opacity = dim ? 0.68 : 1;
      break;
    default:
      if (kind === "siren") glow = state === "on" ? "lit" : "soft";
      else if (SENSOR_KINDS.has(kind)) {
        // The fixed shadow only while available (`SimpleSensorTile`).
        const up = entity === undefined || available(state);
        opacity = up ? 1 : 0.5;
        glow = up ? "soft" : undefined;
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

/** `.foregroundStyle(.secondary)` on the watch: the system's secondary
 * label color, #EBEBF5 at 0.6 (measured on the simulator: the OFF badge's
 * strokes peak at 145, 145, 151 over 11, 11, 10). */
export const WATCH_SECONDARY: WatchInk = { hex: "#EBEBF5", alpha: 0.6 };

/** `.primary.opacity(0.85)`, a climate's current temperature. */
const WATCH_PRIMARY_85: WatchInk = { hex: "#FFFFFF", alpha: 0.85 };

/** A tile's theme color. The watch's tiles resolve these in
 * `WATCH_TILE_THEME` whatever the page's theme, so `page` is not read. */
function themeInk(_page: WatchPage | undefined, token: "warning" | "danger" | "accent" | "secondary" | "info" | "tempWarm" | "tempCool" | "tempNeutral" | `entity${string}`): WatchInk {
  const theme = WATCH_TILE_THEME;
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
  const ink = level < 20 ? { hex: "#FF3B30", alpha: 1 } : level < 40 ? { hex: "#FF9500", alpha: 1 } : WATCH_SECONDARY;
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
  | { kind: "text"; lines: string[]; ink: WatchInk; weight: number; pill: boolean; lineInks?: WatchInk[]; dy?: number }
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
  const secondary = WATCH_SECONDARY;
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
        ? { kind: "text", lines: [`${Math.trunc(volume * 100)}%`], ink: secondary, weight: 500, pill: false, dy: -1 }
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
      const lineInks: WatchInk[] = [];
      if (style !== "Off" && entity !== undefined) {
        const step = storedNumber(attrs.target_temp_step) ?? 1;
        const features = storedNumber(attrs.supported_features) ?? 0;
        const dual = state === "heat_cool" || (features !== 0 && (features & 2) !== 0 && (features & 1) === 0);
        const low = storedNumber(attrs.target_temp_low);
        const high = storedNumber(attrs.target_temp_high);
        const target = storedNumber(attrs.temperature);
        const current = storedNumber(attrs.current_temperature);
        // The target in the secondary color, the room's temperature under it
        // in white at 0.85 (`SimpleClimateTile`).
        if (tile.showTargetTempOnTile !== false) {
          if (dual && low !== undefined && high !== undefined) lines.push(`${watchClimateTemperature(low, step)}/${watchClimateTemperature(high, step)}`);
          else if (target !== undefined) lines.push(watchClimateTemperature(target, step));
          if (lines.length > 0) lineInks.push(secondary);
        }
        if (tile.showCurrentTempOnTile !== false && current !== undefined) {
          lines.push(watchClimateTemperature(current, step));
          lineInks.push(WATCH_PRIMARY_85);
        }
      }
      const action = lower(attrs.hvac_action);
      const badge = action === "heating" ? "flame.fill" : action === "cooling" ? "snowflake" : action === "drying" ? "dehumidifier.fill" : action === "fan" ? "fan.fill" : undefined;
      return {
        symbol: stateIcon ?? (noIcon ? undefined : (ownIcon ?? (modeIcon[state] ?? "thermometer"))),
        filled: stateIcon === undefined && on,
        ink: stateColor ?? ownInk(tile.color) ?? modeInk,
        opacity: on ? 1 : 0.85,
        active,
        topLeft: lines.length === 0 ? undefined : { kind: "text", lines, lineInks, ink: secondary, weight: 500, pill: style === "Pill", dy: -1 },
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
function specialSymbol(look: WatchSpecialLook, icons: IconProvider | undefined, symbolPt: number, room: number, s: number, shadow: boolean, paint?: WatchSymbolPaint): TemplateResult | typeof nothing {
  const opacity = look.opacity * (look.photo === undefined ? look.ink.alpha : 1);
  const fade = opacity >= 1 ? "" : `opacity:${Math.round(opacity * 1000) / 1000}`;
  if (look.photo !== undefined) {
    const d = Math.max(8, Math.min(symbolPt * 1.35, room));
    const rim = Math.max(1, d * 0.045);
    return html`<img class="wp-photo" alt="" src=${look.photo}
      style=${`width:${d * s}px;height:${d * s}px;border:${Math.round(rim * s * 100) / 100}px solid ${rgba(look.ink.hex, 0.9)}${fade === "" ? "" : `;${fade}`}`} />`;
  }
  if (look.symbol === undefined) return nothing;
  const mark = symbolMark(icons, filledSymbol(icons, look.symbol, look.filled), Math.max(8, Math.min(symbolPt, room)) * s, look.ink.hex, shadow, paint);
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
  const shadow = tile.statusTextShadow === false ? "" : `text-shadow:${watchTextShadow(s)}`;
  const b = look.topLeft;
  if (b?.kind === "text") {
    // Each line's own color (a climate's two), the text 1 point in from its
    // padding (`.padding(.horizontal, 1)`).
    const top = pad + (b.dy ?? 0);
    const style = [`font-size:${size * s}px`, `top:${top * s}px`, `left:${pad * s}px`, `padding:0 ${s}px`, `color:${inkCss(b.ink)}`, `font-weight:${b.weight}`, b.pill ? pillStyle(s) : "", shadow].filter((p) => p !== "").join(";");
    parts.push(html`<span class="wp-badge" style=${style}>${b.lines.map((l, i) => {
      const ink = b.lineInks?.[i];
      return ink === undefined ? html`<span>${l}</span>` : html`<span style=${`color:${inkCss(ink)}`}>${l}</span>`;
    })}</span>`);
    bottom = top + b.lines.length * size * 1.2;
  } else if (b?.kind === "battery") {
    const font = Math.max(size - 1, 4);
    const style = [`font-size:${font * s}px`, `top:${pad * s}px`, `left:${pad * s}px`, `color:${inkCss(b.ink)}`, `gap:${s}px`, `text-shadow:0 ${s}px ${2 * s}px rgba(0, 0, 0, 0.6)`].join(";");
    parts.push(html`<span class="wp-badge row" style=${style}>${symbolMark(input.icons, b.symbol, Math.max(font - 2, 3) * s, b.ink.hex)}<span>${b.level}</span></span>`);
    bottom = pad + font * 1.15;
  }
  if (look.topRight !== undefined) parts.push(statusIcon(tile, look.topRight, pad - 1, pad, input.icons, s));
  return { parts, bottom };
}

/** A status symbol in a tile's top right corner (`effectiveSecondaryStatusIconSize`,
 * 0.7 of the status size, in the secondary color), its top `top` and its
 * right `right` points in. */
function statusIcon(tile: WatchPageTile, symbol: string, top: number, right: number, icons: IconProvider | undefined, s: number): TemplateResult {
  const px = (storedNumber(tile.statusIconSizeOverride) ?? 15) * 0.7 + (symbol.includes("exclamationmark") ? 1.5 : 0);
  return html`<span class="wp-badge" style=${`top:${Math.max(0, top) * s}px;right:${right * s}px;opacity:${WATCH_SECONDARY.alpha}`}>${symbolMark(icons, symbol, px * s, WATCH_SECONDARY.hex)}</span>`;
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
  // The watch strokes the rim after it clips the tile, so the line is
  // centred on the edge: half inside (the rim) and half outside (the box's
  // own shadow).
  const half = Math.round(((preview ? 1 : watchCameraBorderWidth(tile.borderThickness)) / 2) * s * 100) / 100;
  const rimInk = rgba(ink.hex, preview ? 0.3 : 0.6);
  const outer = `${box}border-radius:${radius}px;box-shadow:0 0 0 ${half}px ${rimInk}`;
  const rim = html`<span class="wp-cam-rim" style=${`box-shadow:inset 0 0 0 ${half}px ${rimInk}`}></span>`;
  if (!preview) {
    const symbol = group ? (typeof tile.icon === "string" ? tile.icon : "rectangle.split.2x2") : tile.icon === "" ? "" : (typeof tile.icon === "string" && tile.icon !== "" ? tile.icon : "video");
    const custom = typeof tile.customLabel === "string" ? tile.customLabel.trim() : "";
    const label = group ? (custom === "" ? "Cameras" : custom) : watchPreviewTileLabel(tile, input);
    const color = watchTileLabelColor(tile) ?? "#FFFFFF";
    // The symbol from its color to 0.7 of it, under a glow of the color at
    // 0.4, radius 8 (`SimpleCameraTile.iconModeContent`).
    const paint: WatchSymbolPaint = { kind: "fade", hex: ink.hex, start: 1, end: 0.7 };
    return html`<div class="wp-cam icon" style=${`${outer};gap:${4 * s}px`} title=${hint ?? nothing}>
      ${symbol === "" ? nothing : html`<span style=${`display:flex;filter:drop-shadow(0 0 ${8 * s}px ${rgba(ink.hex, 0.4)})`}>${symbolMark(input.icons, filledSymbol(input.icons, symbol, group), symbolPt * s, ink.hex, tile.iconShadow === true, paint)}</span>`}
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
  const ground = watchTileFill(parseTileColor(tile.color), flatInk(tile.color, themeInk(input.page, "entitySensor").hex), true, watchTileColorOpacity(tile), { width, height });
  const border = watchTileBorder(tile, true, watchTileFallbackInk(tile, input.page, input.states));
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
    style=${`${box}border-radius:${radius}px;background:${ground};padding:${padY * s}px ${padX * s}px`}>
    ${tileUnderlay(tile, input, true, { width, height }, s)}
    ${content}
    ${renderTileRim(border, width, height, s)}
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

/** A flat CSS color for a stored color, as `Color.from(colorString:)` reads
 * it: a gradient's first color; the rainbow does not parse as a color, so
 * it is `fallback` (the kind's color), as is no color at all. */
function flatInk(value: unknown, fallback: string): string {
  const c = parseTileColor(value);
  if (c?.kind === "rainbow") return fallback;
  return c === undefined ? fallback : tileInkColor(c);
}

/** A tile's border as the watch strokes it (`TileStyleModifier.borderOverlay`). */
export interface WatchTileBorder {
  /** The line's width in points; the tile clips it, so half of it shows. */
  width: number;
  /** A CSS color, or a gradient or the rainbow from the top left corner to
   * the bottom right. */
  paint: { kind: "flat"; css: string } | { kind: "gradient"; from: string; to: string } | { kind: "rainbow" };
  /** `[6, 4]` dashed, `[2, 2]` dotted, with round caps; none for solid. */
  dash?: [number, number];
  /** The glow strokes under the line, widest first: their widths and
   * opacities, in `glowInk`. */
  glow: { width: number; alpha: number }[];
  glowInk: string;
  /** An animated border, which the picture hints at with a soft glow. */
  animated: boolean;
}

/** The inactive line: the theme's hairline (white at 0.13) at 0.72. */
const INACTIVE_BORDER_ALPHA = 0.13 * 0.72;

/**
 * A tile's border, or undefined for none (style none, or "only when on"
 * and off). Its color is `borderColor` (`#THEME` or absent is the tile's
 * own, a gradient or the rainbow drawn as one), else `fallbackInk`, at the
 * tile's `colorOpacity` while on; while off the theme's hairline at 0.72.
 * A gradient or rainbow line is drawn whole, as the watch does. A Line
 * with glow adds four wider strokes under it at 0.15, 0.25, 0.4 and 0.7 of
 * the glow; Animate with no animation is the plain line.
 */
export function watchTileBorder(tile: WatchPageTile, active: boolean, fallbackInk = "#FFFFFF"): WatchTileBorder | undefined {
  const style = tile.borderStyle;
  if (style !== "line" && style !== "animate") return undefined;
  if (tile.borderActiveOnly !== false && !active) return undefined;
  const width = watchBorderWidth(tile.borderThickness, active);
  if (width <= 0) return undefined;
  const alpha = watchTileColorOpacity(tile);
  const own = tile.borderColor === "#THEME" ? undefined : parseTileColor(tile.borderColor);
  const source = own ?? parseTileColor(tile.color);
  const base = own !== undefined ? flatInk(tile.borderColor, fallbackInk) : flatInk(tile.color, fallbackInk);
  let paint: WatchTileBorder["paint"];
  if (!active) paint = { kind: "flat", css: `rgba(255, 255, 255, ${Math.round(INACTIVE_BORDER_ALPHA * alpha * 1000) / 1000})` };
  else if (source?.kind === "rainbow") paint = { kind: "rainbow" };
  else if (source?.kind === "gradient") paint = { kind: "gradient", from: source.from, to: source.to };
  else paint = { kind: "flat", css: alpha < 1 ? rgba(base, alpha) : base };
  const lineStyle = tile.borderLineStyle;
  const dash: [number, number] | undefined = lineStyle === "dashed" ? [6, 4] : lineStyle === "dotted" ? [2, 2] : undefined;
  const g = storedNumber(tile.borderGlow) ?? 0;
  const animated = style === "animate" && typeof tile.borderAnimation === "string" && tile.borderAnimation !== "none";
  const glow = !animated && active && g > 0
    ? [[8, 0.15], [5, 0.25], [3, 0.4], [1, 0.7]].map(([extra, a]) => ({ width: width + extra!, alpha: Math.min(1, a! * g) }))
    : [];
  return { width, paint, dash: animated ? undefined : dash, glow, glowInk: base, animated: animated && active };
}

/** How far a border pads the tile's symbol and name in from its edge
 * (`TileStyleModifier.contentPadding`): by thickness, whenever the style
 * is not none, on or off. */
export function watchBorderContentPadding(tile: WatchPageTile): number {
  if (tile.borderStyle !== "line" && tile.borderStyle !== "animate") return 0;
  switch (tile.borderThickness) {
    case "thin": return 1;
    case "medium": return 2;
    case "thick": return 4;
    case "auto": return 1;
    default: return 0;
  }
}

/** A tile's border drawn over its content: the rounded rectangle on the
 * tile's edge, stroked, the outer half clipped away by the tile. */
function renderTileRim(border: WatchTileBorder | undefined, widthPt: number, heightPt: number, s: number): TemplateResult | typeof nothing {
  if (border === undefined) return nothing;
  const w = widthPt * s;
  const h = heightPt * s;
  const r = watchTileCornerRadius(widthPt, heightPt) * s;
  const id = `wp-rim-${++paintSeq}`;
  const stroke = border.paint.kind === "flat" ? border.paint.css : `url(#${id})`;
  const defs = border.paint.kind === "gradient"
    ? svg`<defs><linearGradient id=${id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2=${w} y2=${h}><stop offset="0" stop-color=${border.paint.from} /><stop offset="1" stop-color=${border.paint.to} /></linearGradient></defs>`
    : border.paint.kind === "rainbow"
      ? svg`<defs><linearGradient id=${id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2=${w} y2=${h}>${RAINBOW_STOPS.map((c, i) => svg`<stop offset=${i / (RAINBOW_STOPS.length - 1)} stop-color=${`rgb(${c})`} />`)}</linearGradient></defs>`
      : nothing;
  const dash = border.dash === undefined ? nothing : border.dash.map((d) => d * s).join(" ");
  const glows = border.glow.map((g) => svg`<rect x="0" y="0" width=${w} height=${h} rx=${r} fill="none" stroke=${border.paint.kind === "flat" ? border.glowInk : stroke} stroke-opacity=${g.alpha} stroke-width=${g.width * s} />`);
  const hint = border.animated ? `filter:drop-shadow(0 0 ${2 * s}px ${border.paint.kind === "flat" ? border.paint.css : "#FFFFFF"})` : "";
  return html`<svg class="wp-rim" width=${w} height=${h} viewBox=${`0 0 ${w} ${h}`} style=${hint} aria-hidden="true">${defs}${glows}${svg`<rect x="0" y="0" width=${w} height=${h} rx=${r} fill="none" stroke=${stroke} stroke-width=${border.width * s} stroke-linecap="round" stroke-dasharray=${dash} />`}</svg>`;
}

/**
 * A spacer as the watch's `SpacerTile` draws it, as inline style: a wash of
 * its color (gray without one), stronger once anything is set, and a solid
 * line in that color at any `borderThickness` but none, whatever the border
 * style says (auto draws 2 points once anything is set). Its line style,
 * glow, "only when on", border color and animations do nothing there. All
 * times `colorOpacity`.
 */
export function watchSpacerStyle(tile: WatchPageTile, s: number, size?: { width: number; height: number }): string {
  const alpha = watchTileColorOpacity(tile);
  const ink = flatInk(tile.color, "#8E8E93");
  const pattern = typeof tile.backgroundPattern === "string" ? tile.backgroundPattern : "none";
  const thickness = typeof tile.borderThickness === "string" ? tile.borderThickness : "extraThin";
  const customized = (tile.color !== undefined && tile.color !== null) || pattern !== "none" || thickness !== "auto";
  const [a, b, c] = customized ? [0.5, 0.3, 0.4] : [0.2, 0.1, 0.15];
  const width = thickness === "auto" ? (customized ? 2 : 0) : watchBorderWidth(thickness, true);
  // Over the thin material at 0.6 (`SpacerTile`), which darkens what is
  // behind it as the tiles' glass does.
  const material = Math.round(0.6 * alpha * WATCH_MATERIAL_DARKEN * 1000) / 1000;
  const parts = [`background:linear-gradient(${watchDiagonal(size?.width, size?.height)}, ${rgba(ink, a * alpha)}, ${rgba(ink, b * alpha)} 50%, ${rgba(ink, c * alpha)}), linear-gradient(rgba(0, 0, 0, ${material}), rgba(0, 0, 0, ${material}))`];
  parts.push(width > 0 ? `border:${Math.round(width * s * 100) / 100}px solid ${rgba(ink, 0.8 * alpha)}` : "border:0");
  return parts.join(";");
}

/** The layers drawn inside a tile behind its content: the effect's hint,
 * the pattern (times `colorOpacity` on a tile; a spacer's is not), the state
 * bar's fill. A spacer has no effect and no bar. */
function tileUnderlay(tile: WatchPageTile, input: WatchPagePreviewInput, active: boolean, size: { width: number; height: number }, s: number, spacer = false): TemplateResult | typeof nothing {
  const tileInk = flatInk(tile.color, watchTileFallbackInk(tile, input.page, input.states));
  const layers: string[] = [];
  const pattern = typeof tile.backgroundPattern === "string" ? tile.backgroundPattern : "none";
  if (pattern !== "none") {
    // `PatternView` in gray at its own opacity times `patternOpacity`, or in
    // `patternColor` at `patternOpacity`; `colorOpacity` does not reach it.
    const own = parseTileColor(tile.patternColor);
    const ink = own === undefined ? "#737373" : tileInkColor(own);
    const opacity = storedNumber(tile.patternOpacity) ?? 1;
    layers.push(...watchPatternLayers(pattern, ink, opacity, (storedNumber(tile.patternScale) ?? 1) * s, { width: size.width * s, height: size.height * s }));
  }
  const effect = typeof tile.tileAnimation === "string" ? tile.tileAnimation : "none";
  if (!spacer && effect !== "none" && !(tile.effectActiveOnly === true && !active)) {
    const ink = flatInk(tile.animationColor, tileInk);
    layers.push(`radial-gradient(ellipse at 70% 30%, ${rgba(ink, 0.35)}, transparent 70%)`);
  }
  return layers.length === 0 ? nothing : html`<span class="wp-under" style=${`background:${layers.join(", ")}`}></span>`;
}

/** A Fill state bar as a background layer: from the bottom, as tall as the
 * reading, from 0.7 to 0.3. The watch puts it behind the tile's glass
 * (`.background` after `tileStyle`), so it goes under the ground. */
function fillBarLayer(tile: WatchPageTile, input: WatchPagePreviewInput, active: boolean, heightPt: number, s: number): string | undefined {
  const bar = barOf(tile, input, active);
  if (bar === undefined || !bar.fill) return undefined;
  const h = Math.round(heightPt * bar.percent * s * 100) / 100;
  return `linear-gradient(0deg, ${rgba(bar.ink, 0.7 * bar.alpha)}, ${rgba(bar.ink, 0.3 * bar.alpha)}) left bottom / 100% ${h}px no-repeat`;
}

/** Whether a media player is on as its tile's volume label, bar and badge
 * read it (`MediaPlayerEntity.isActive`): any state but off and standby. */
export function watchMediaPlayerOn(state: string): boolean {
  const s = state.toLowerCase();
  return s !== "off" && s !== "standby";
}

/** The state bar of a tile, when the picture draws one: in the tile's
 * color (its kind's when it has none), or white. A media player's shows
 * while it is on (`watchMediaPlayerOn`), lit or not. */
function barOf(tile: WatchPageTile, input: WatchPagePreviewInput, active: boolean): { fill: boolean; percent: number; ink: string; alpha: number } | undefined {
  const kind = tileKind(tileEntityId(tile));
  if (!watchStateDomains("bars").includes(kind) || watchTileIsTvRemote(tile, input.states)) return undefined;
  const percent = watchTileStatePercent(tile, input.states);
  const on = kind === "media_player" ? watchMediaPlayerOn(String(input.states?.[tileEntityId(tile)]?.state ?? "off")) : active;
  if (percent === undefined || percent <= 0 || !on) return undefined;
  // White is `Color.white.opacity(0.7)`, whose own opacity the bar's
  // multiplies.
  const white = tile.stateBarColorStyle === "White";
  const ink = white ? "#FFFFFF" : flatInk(tile.color, watchTileFallbackInk(tile, input.page, input.states));
  return { fill: tile.stateBarStyle === "Fill", percent, ink, alpha: white ? 0.7 : 1 };
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

/** The value label's capsule: a 0.5 point line in white at 0.2 on the
 * text's edge, `pad` points of room each side (5 on a sensor, else 1). */
function pillStyle(s: number, pad = 1): string {
  const half = Math.round(0.25 * s * 100) / 100;
  return `box-shadow:inset 0 0 0 ${half}px rgba(255, 255, 255, 0.2), 0 0 0 ${half}px rgba(255, 255, 255, 0.2);padding:0 ${pad * s}px;border-radius:999px`;
}

/** The top bar, over the content. */
function tileOverlay(tile: WatchPageTile, input: WatchPagePreviewInput, active: boolean, widthPt: number, s: number): TemplateResult | typeof nothing {
  const bar = barOf(tile, input, active);
  const parts: TemplateResult[] = [];
  if (bar !== undefined && !bar.fill) {
    const style = [
      `top:${4 * s}px`, `left:${6 * s}px`, `height:${3 * s}px`,
      `width:${Math.max(0, (widthPt - 12) * bar.percent * s)}px`,
      `background:${rgba(bar.ink, 0.3 * bar.alpha)}`, `border-radius:${1.5 * s}px`,
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

/** Seconds in an "H:MM:SS" duration, or undefined. */
function hms(value: unknown): number | undefined {
  if (typeof value !== "string") return undefined;
  const parts = value.split(":").map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return undefined;
  return parts[0]! * 3600 + parts[1]! * 60 + parts[2]!;
}

/** A timer's seconds left as the watch counts them: while active, to
 * `finishes_at` from `now`; else (or without one) its `remaining`. */
export function watchTimerRemaining(entity: HassEntityState | undefined, now = Date.now()): number | undefined {
  if (entity === undefined) return undefined;
  const finishes = entity.attributes?.finishes_at;
  if (lower(entity.state) === "active" && typeof finishes === "string") {
    const end = Date.parse(finishes);
    if (Number.isFinite(end)) return Math.max(0, (end - now) / 1000);
  }
  return hms(entity.attributes?.remaining);
}

/** A timer's time left as its badge writes it (`formatRemaining`): m:ss,
 * h:mm:ss from an hour, "--:--" at none. */
export function watchTimerRemainingText(entity: HassEntityState | undefined, now = Date.now()): string | undefined {
  const left = watchTimerRemaining(entity, now);
  if (left === undefined) return undefined;
  const total = Math.trunc(left);
  if (total <= 0) return "--:--";
  const mins = Math.trunc(total / 60);
  const sec = String(total % 60).padStart(2, "0");
  return mins >= 60 ? `${Math.trunc(mins / 60)}:${String(mins % 60).padStart(2, "0")}:${sec}` : `${mins}:${sec}`;
}

/** A running timer's extras (`SimpleTimerTile`): while it runs or pauses, a
 * top bar of the time left over the duration, anchored right, in its color
 * at 0.3; while it runs, the countdown across the tile at 0.28 of its width
 * in white at 0.6 over black at 0.35 fading out from the middle. */
function timerExtras(tile: WatchPageTile, input: WatchPagePreviewInput, widthPt: number, ink: string, s: number): TemplateResult | typeof nothing {
  const entityId = tileEntityId(tile);
  if (tileKind(entityId) !== "timer") return nothing;
  const entity = input.states !== undefined && Object.hasOwn(input.states, entityId) ? input.states[entityId] : undefined;
  const state = lower(entity?.state);
  if (state !== "active" && state !== "paused") return nothing;
  const left = watchTimerRemaining(entity) ?? 0;
  const duration = hms(entity?.attributes?.duration);
  const parts: TemplateResult[] = [];
  if (duration !== undefined && duration > 0) {
    const w = Math.max(0, (widthPt - 12) * Math.min(1, Math.max(0, left / duration)));
    parts.push(html`<span class="wp-bar" style=${`top:${4 * s}px;right:${6 * s}px;height:${3 * s}px;width:${w * s}px;border-radius:${1.5 * s}px;background:${rgba(ink, 0.3)}`}></span>`);
  }
  // A timer with no time to read (the all-on picture's) counts nothing.
  const countdown = state === "active" ? watchTimerRemainingText(entity) : undefined;
  if (countdown !== undefined) {
    const r = Math.round(widthPt * 0.7 * s * 100) / 100;
    parts.push(html`<span class="wp-timer" style=${`background:radial-gradient(circle ${r}px at 50% 50%, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.21) ${r / 2}px, transparent ${r}px);font-size:${widthPt * 0.28 * s}px`}>${countdown}</span>`);
  }
  return html`${parts}`;
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
      // Shown whenever the player is not off or on standby
      // (`MediaPlayerEntity.isActive`), "on" included.
      const v = storedNumber(attrs.volume_level);
      if (!labels || watchTileIsTvRemote(tile, states) || !watchMediaPlayerOn(state) || v === undefined) return undefined;
      return mk(`${Math.trunc(v * 100)}%`, fillBar ? pad - 1 : pad + 2);
    }
    case "automation":
      return activity ? mk(state === "on" ? "ON" : "OFF", pad, 600, false) : undefined;
    case "timer":
      return activity && (state === "active" || state === "paused") ? mk(watchTimerRemainingText(entity), pad + 2, 500, false) : undefined;
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

/**
 * The page title in the top band, as the watch draws it
 * (`InteractiveGrid.pageTitleView`): centred across the screen 3 points
 * down; its icon (absent is `house`, empty none) at the size less half a
 * point (at least 8.5), semibold, 4 points before the name in the rounded
 * semibold face; both in its color (else the theme's page color at 0.95),
 * 6 points in from each side under a faint shadow. A pill adds 8 points
 * either side and 3 above and below on black at 0.32 with a white line at
 * 0.16; glass the same room on the thin frosted material with a white wash
 * from the top left, a white rim from 0.5 to 0.16 and a highlight along
 * the top. The words are the page's switcher text, else its name. Hidden
 * with style none, on a full screen page, or with no words.
 */
export function renderWatchPageTitle(page: WatchPage, s: number, topInset: number, icons: IconProvider | undefined, behavior?: Readonly<Record<string, unknown>>): TemplateResult | typeof nothing {
  // The watch's own Page title setting: Off hides every page's title
  // (`InteractiveGrid.canDisplayPageTitle`); Auto shows it, then fades it.
  if (behavior?.pageTitleMode === "Off") return nothing;
  const style = watchPageValue(page, "pageTitleDisplayStyle");
  // `pageHeaderTitle`: the page's switcher text when it has one, else its name.
  const switcher = typeof page.switcherText === "string" ? page.switcherText.trim() : "";
  const name = switcher !== "" ? switcher : typeof page.name === "string" ? page.name.trim() : "";
  if (typeof style !== "string" || style === "none" || page.fullScreen === true || topInset <= 0 || name === "") return nothing;
  const sizePt = watchPageTitleSize(watchPageValue(page, "pageTitleTextSize"));
  const own = parseTileColor(page.pageTitleTextColor);
  const role = watchStylingTheme(watchPageTheme(page))?.roles.entityPage;
  const ink = own === undefined || own.kind === "rainbow" ? (role === undefined ? "rgba(255, 255, 255, 0.95)" : rgba(role, 0.95)) : tileInkColor(own);
  const iconInk = own === undefined || own.kind === "rainbow" ? (role ?? "#FFFFFF") : tileInkColor(own);
  const raw = page.pageTitleIcon === undefined || page.pageTitleIcon === null ? "house" : String(page.pageTitleIcon).trim();
  const icon = raw === "" ? nothing
    : html`<span class="wp-title-icon" style=${`margin:0 ${WATCH_TITLE_ICON_SIDE * s}px;opacity:${own === undefined || own.kind === "rainbow" ? 0.95 : 1}`}>${symbolMark(icons, raw, Math.max(sizePt - 0.5, 8.5) * s, iconInk)}</span>`;
  const capsule = style === "pill" || style === "glass";
  const half = Math.round(0.25 * s * 100) / 100;
  const box = [
    `top:${3 * s}px`, `font-size:${sizePt * s}px`, `color:${ink}`,
    capsule ? `padding:${3 * s}px ${8 * s}px` : "",
    style === "pill" ? `background:rgba(0, 0, 0, 0.32);box-shadow:inset 0 0 0 ${half}px rgba(255, 255, 255, 0.16), 0 0 0 ${half}px rgba(255, 255, 255, 0.16)` : "",
    style === "glass" ? `background:linear-gradient(to bottom right, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06) 50%, rgba(255, 255, 255, 0)), rgba(14, 10, 16, 0.5);backdrop-filter:blur(${3 * s}px)` : "",
  ].filter((p) => p !== "").join(";");
  const rim = style === "glass"
    ? html`<span class="wp-title-rim" style=${`padding:${0.9 * s}px;margin:${-0.45 * s}px`}></span><span class="wp-title-shine" style=${`left:${6 * s}px;right:${6 * s}px;top:${0.8 * s}px;height:${0.9 * s}px`}></span>`
    : nothing;
  return html`<span class="wp-title ${style}" style=${box}>${rim}<span class="wp-title-label" style=${`padding:0 ${6 * s}px;gap:${4 * s}px;filter:drop-shadow(0 ${s}px ${1.5 * s}px rgba(0, 0, 0, 0.2))`}>${icon}<span class="wp-title-name">${name}</span></span></span>`;
}

/** The room an SF Symbol image keeps either side of its glyph, in points
 * (the title's icon measured 7 points from the name's first letter with a
 * 4 point spacing). */
const WATCH_TITLE_ICON_SIDE = 1.25;

// ── the clock ────────────────────────────────────────────────────────────

/** Where the system clock sits on each watch screen, measured on the
 * devices (`WatchStatusClock` in the app, `Shared/WatchResponsiveLayout.swift`):
 * the centre of its digits from the top, the left edge of a two digit hour
 * from the right edge, and the right margin of the digits (the table's
 * comment), in points. */
const WATCH_STATUS_CLOCKS: readonly { width: number; height: number; centreY: number; leftFromTrailing: number; rightMargin: number }[] = [
  { width: 162, height: 197, centreY: 15, leftFromTrailing: 46.5, rightMargin: 11 },
  { width: 176, height: 215, centreY: 20, leftFromTrailing: 48.5, rightMargin: 13 },
  { width: 184, height: 224, centreY: 19, leftFromTrailing: 49, rightMargin: 12 },
  { width: 187, height: 223, centreY: 22, leftFromTrailing: 50, rightMargin: 14.5 },
  { width: 198, height: 242, centreY: 23, leftFromTrailing: 51, rightMargin: 14 },
  { width: 208, height: 248, centreY: 25.5, leftFromTrailing: 53.5, rightMargin: 16.5 },
  { width: 205, height: 251, centreY: 27, leftFromTrailing: 54.5, rightMargin: 17 },
  { width: 211, height: 257, centreY: 28, leftFromTrailing: 55, rightMargin: 18 },
];

/** The clock's place on a screen: its own row, else the nearest by size,
 * as the watch falls back (`WatchStatusClock.forScreen`). */
export function watchStatusClock(screen: { width: number; height: number }): { centreY: number; leftFromTrailing: number; rightMargin: number } {
  let best = WATCH_STATUS_CLOCKS[5]!;
  let distance = Infinity;
  for (const row of WATCH_STATUS_CLOCKS) {
    const d = (row.width - screen.width) ** 2 + (row.height - screen.height) ** 2;
    if (d < distance) [best, distance] = [row, d];
  }
  return { centreY: best.centreY, leftFromTrailing: best.leftFromTrailing, rightMargin: best.rightMargin };
}

/** The system clock's size in points. It is the same on every watch ("the
 * clock is the SAME WIDTH on every watch", `WatchStatusClock`): a 16 point
 * medium SF Compact with tabular figures, whose digits stand 11.5 points tall
 * (measured on the 46 mm simulator). */
export function watchClockFontSize(_screenWidth?: number): number {
  return 16;
}

/** Where the settings gear's centre sits, in points from the top left
 * (`WatchHomeView.settingsCog`): its 26 point box ends `leftFromTrailing`
 * less 4.5 (`settingsCogFrameOverlap`) in from the trailing edge of the
 * safe area, and is centred on the clock's line. */
export function watchGearCentre(screen: { width: number; height: number }): { x: number; y: number } {
  const clock = watchStatusClock(screen);
  return { x: screen.width - WATCH_SCREEN_SIDE_INSET - (clock.leftFromTrailing - 4.5) - 13, y: clock.centreY };
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
 * The clock in the top band as the watch shows it: the system time (16
 * points, medium, white, tabular figures), its digits centred on the
 * device's clock line and ending at the device's right margin, and the
 * app's settings gear (`gearshape`, 11 points, light, the healthy green at
 * 0.55) where `WatchHomeView` parks it (`watchGearCentre`), which does not
 * move with the width of the time. None on a full screen page.
 */
export function renderWatchClock(screen: { width: number; height: number }, s: number, topInset: number, icons: IconProvider | undefined): TemplateResult | typeof nothing {
  if (topInset <= 0) return nothing;
  const place = watchStatusClock(screen);
  const centre = watchGearCentre(screen);
  const gearPx = 11 * s * symbolScale(icons, "gearshape");
  const glyph = icons?.render("gearshape", gearPx, GEAR_INK);
  const gear = glyph === undefined ? gearGlyph(11 * s, GEAR_INK)
    : html`<svg width=${gearPx} height=${gearPx} viewBox=${`0 0 ${gearPx} ${gearPx}`} aria-hidden="true">${glyph}</svg>`;
  const box = 26 * s;
  const gearStyle = `left:${(centre.x - 13) * s}px;top:${(centre.y - 13) * s}px;width:${box}px;height:${box}px`;
  // The table's right margin is to the ink; a tabular figure keeps about a
  // point of its own room past it.
  const timeStyle = `right:${(place.rightMargin - CLOCK_SIDE_BEARING) * s}px;top:${place.centreY * s}px;font-size:${watchClockFontSize() * s}px`;
  return html`<span class="wp-clock"><span class="wp-gear" style=${gearStyle}>${gear}</span><span class="wp-time" style=${timeStyle}>${CLOCK_TIME}</span></span>`;
}

/** The point size the bundled symbols' viewBoxes are measured at: a glyph
 * the watch draws with `.font(.system(size: p))` stands its viewBox times
 * p / 22 (the light bulb at 36 points measured 38.7 points tall on the
 * simulator, the gear at 11 points 10.5 wide, the thermometer at 22 points
 * 22). */
export const WATCH_SYMBOL_EXPORT_SIZE = 22;

/** Old SF Symbol names the watch still draws, by the name the bundled file
 * keeps them under. */
const SYMBOL_ALIASES: Readonly<Record<string, string>> = {
  thermometer: "thermometer.medium",
  "thermometer.fill": "thermometer.medium",
  "battery.0": "battery.0percent",
  "battery.25": "battery.25percent",
  "battery.50": "battery.50percent",
  "battery.75": "battery.75percent",
  "battery.100": "battery.100percent",
  gauge: "gauge.with.dots.needle.33percent",
  speedometer: "gauge.with.dots.needle.67percent",
  "waveform.and.mic": "waveform.badge.microphone",
  "message.and.waveform": "message.badge.waveform",
  "message.and.waveform.fill": "message.badge.waveform.fill",
  "text.cursor": "character.cursor.ibeam",
};

/** A symbol's name as the provider knows it: its own, else its alias. */
function knownSymbol(icons: IconProvider | undefined, name: string): string {
  if (icons === undefined || icons.render(name, 1, "#FFFFFF") !== undefined) return name;
  const alias = SYMBOL_ALIASES[name];
  return alias !== undefined && icons.render(alias, 1, "#FFFFFF") !== undefined ? alias : name;
}

/** A provider glyph's viewBox width and height, read off what it renders,
 * or undefined when it says nothing readable. */
function glyphBox(icons: IconProvider | undefined, name: string): [number, number] | undefined {
  const result = icons?.render(knownSymbol(icons, name), 1, "#FFFFFF") as { values?: readonly unknown[] } | undefined;
  for (const v of result?.values ?? []) {
    const m = typeof v === "string" ? /^\s*-?[\d.]+\s+-?[\d.]+\s+([\d.]+)\s+([\d.]+)\s*$/.exec(v) : null;
    if (m) return [Number(m[1]), Number(m[2])];
  }
  return undefined;
}

/** How much larger than its font size a symbol's longer side draws: its
 * longer viewBox side over `WATCH_SYMBOL_EXPORT_SIZE`, else 1. */
export function symbolScale(icons: IconProvider | undefined, name: string): number {
  const box = glyphBox(icons, name);
  return box === undefined ? 1 : Math.max(box[0], box[1]) / WATCH_SYMBOL_EXPORT_SIZE;
}

/** How the watch paints a tile's symbol (`foregroundStyleWithRainbow`): the
 * rainbow, a gradient color's mesh, or one color from 0.98 at the top left
 * to 0.64 at the bottom right of the glyph. */
export type WatchSymbolPaint =
  /** From `start` (0.98 when absent) to `end` (0.64) of the color. */
  | { kind: "fade"; hex: string; start?: number; end?: number }
  | { kind: "mesh"; from: string; to: string }
  | { kind: "rainbow" };

export function watchSymbolPaint(stored: unknown, fallback: string): WatchSymbolPaint {
  const c = parseTileColor(stored);
  if (c?.kind === "rainbow") return { kind: "rainbow" };
  if (c?.kind === "gradient") return { kind: "mesh", from: c.from, to: c.to };
  return { kind: "fade", hex: c?.kind === "solid" ? c.hex : fallback };
}

let paintSeq = 0;

/** The gradient a paint fills its glyph with, in the glyph's own box. */
function paintFill(paint: WatchSymbolPaint, id: string, rect: { x: number; y: number; w: number; h: number }): TemplateResult {
  // A SwiftUI linear gradient runs corner to corner with its bands square
  // to that line, which `userSpaceOnUse` keeps; the mesh is the box's own.
  const r = (v: number) => Math.round(v * 100) / 100;
  const [x1, y1, x2, y2] = [r(rect.x), r(rect.y), r(rect.x + rect.w), r(rect.y + rect.h)];
  if (paint.kind === "fade") {
    return svg`<linearGradient id=${id} gradientUnits="userSpaceOnUse" x1=${x1} y1=${y1} x2=${x2} y2=${y2}><stop offset="0" stop-color=${paint.hex} stop-opacity=${paint.start ?? 0.98} /><stop offset="1" stop-color=${paint.hex} stop-opacity=${paint.end ?? 0.64} /></linearGradient>`;
  }
  if (paint.kind === "rainbow") {
    return svg`<linearGradient id=${id} gradientUnits="userSpaceOnUse" x1=${x1} y1=${y1} x2=${x2} y2=${y2}>${RAINBOW_STOPS.map((c, i) => svg`<stop offset=${i / (RAINBOW_STOPS.length - 1)} stop-color=${`rgb(${c})`} />`)}</linearGradient>`;
  }
  // The mesh (`MeshGradientBuilder`): the first color in the top left and
  // bottom right corners, the second in the other two and, at 0.7, through
  // the middle.
  return svg`<linearGradient id=${id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color=${paint.from} /><stop offset="0.5" stop-color=${paint.to} stop-opacity="0.7" /><stop offset="1" stop-color=${paint.from} /></linearGradient>`;
}

/**
 * A symbol drawn as the watch draws `Image(systemName:)` at font size `px`
 * (in pixels): its longer side `symbolScale` times that, centred. With a
 * `paint`, the glyph is filled with it (the tile symbols' gradient); without,
 * flat in `ink`. A symbol the provider lacks draws nothing, as
 * `Image(systemName:)` does for a name it does not know (an open cover's
 * default `window.ceiling.open` is one); with no provider at all it is a
 * faint dot, so the picture still shows where the symbol goes.
 */
function symbolMark(icons: IconProvider | undefined, symbol: string | undefined, px: number, ink: string, shadow = false, paint?: WatchSymbolPaint): TemplateResult {
  const name = symbol === undefined ? undefined : knownSymbol(icons, symbol);
  const box = Math.round(px * (name === undefined ? 1 : symbolScale(icons, name)) * 100) / 100;
  const glyph = name === undefined ? undefined : icons?.render(name, box, paint === undefined ? ink : "#FFFFFF");
  if (glyph === undefined) {
    return html`<svg class="wp-sym ${shadow ? "shadow" : ""}" width=${box} height=${box} viewBox=${`0 0 ${box} ${box}`} aria-hidden="true">${icons === undefined ? svg`<circle cx=${box / 2} cy=${box / 2} r=${box / 5} fill=${ink} fill-opacity="0.7" />` : nothing}</svg>`;
  }
  // The image is as big as its glyph, as SwiftUI frames a symbol, so a
  // symbol in a stack (a camera's, the title's) takes its own height: the
  // provider's square drawing is moved to sit inside the glyph's box.
  const vb = glyphBox(icons, name!) ?? [1, 1];
  const long = Math.max(vb[0], vb[1]);
  const gw = Math.round((vb[0] / long) * box * 100) / 100;
  const gh = Math.round((vb[1] / long) * box * 100) / 100;
  const placed = svg`<g transform=${`translate(${Math.round(((gw - box) / 2) * 100) / 100} ${Math.round(((gh - box) / 2) * 100) / 100})`}>${glyph}</g>`;
  if (paint === undefined) {
    return html`<svg class="wp-sym ${shadow ? "shadow" : ""}" width=${gw} height=${gh} viewBox=${`0 0 ${gw} ${gh}`} aria-hidden="true">${placed}</svg>`;
  }
  // The gradient spans the glyph's own box, as SwiftUI's does the image's.
  const id = `wp-paint-${++paintSeq}`;
  return html`<svg class="wp-sym ${shadow ? "shadow" : ""}" width=${gw} height=${gh} viewBox=${`0 0 ${gw} ${gh}`} aria-hidden="true">${svg`<defs>${paintFill(paint, `${id}-g`, { x: 0, y: 0, w: gw, h: gh })}<mask id=${`${id}-m`} maskUnits="userSpaceOnUse" x="0" y="0" width=${gw} height=${gh}>${placed}</mask></defs><rect x="0" y="0" width=${gw} height=${gh} fill=${`url(#${id}-g)`} mask=${`url(#${id}-m)`} />`}</svg>`;
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
  rounded: WATCH_ROUNDED_FAMILY,
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

/** The shadow the watch puts under a tile's name and its status words,
 * `.shadow(color: .black.opacity(0.8), radius: 2, y: 1)`, as CSS at scale
 * `s`. */
export function watchTextShadow(s: number): string {
  return `0 ${s}px ${Math.round(WATCH_SHADOW_BLUR * 2 * s * 100) / 100}px rgba(0, 0, 0, 0.8)`;
}

/** CSS blur per point of a SwiftUI shadow radius. */
const WATCH_SHADOW_BLUR = 1;

/** The label's inline style: size, weight, design, color and shadow. */
function labelStyle(tile: WatchPageTile, widthPt: number, s: number): string {
  const family = watchTileLabelFamily(tile);
  const color = watchTileLabelColor(tile);
  return [
    `font-size:${watchTileLabelFontSize(tile, widthPt) * s}px`,
    `font-weight:${watchTileLabelWeight(tile)}`,
    family === undefined ? "" : `font-family:${family}`,
    color === undefined ? "" : `color:${color}`,
    tile.labelShadow === false ? "" : `text-shadow:${watchTextShadow(s)}`,
  ].filter((p) => p !== "").join(";");
}

/** Where a header's line or label sits in its box (`DividerTile`): a header
 * in the page's first row rests on its bottom, 2 points up, to tuck under
 * the clock; any other is centred and moved down a fifth of its height. A
 * label header's row is 4 points in from each side and its lines 6 from
 * the words. */
export function watchHeaderPlacement(tile: WatchPageTile, labelled: boolean, heightPt: number, s: number): string {
  const first = tileGeometry(tile).row === 0;
  return [
    `justify-content:${first ? "flex-end" : "center"}`,
    `padding:0 ${labelled ? 4 * s : 0}px ${first ? 2 * s : 0}px`,
    first ? "" : `transform:translateY(${Math.round(heightPt * 0.2 * s * 100) / 100}px)`,
  ].filter((p) => p !== "").join(";");
}

/** A header's line: thicker and brighter with its glow. */
function headerLine(stored: number, s: number, quiet: boolean): TemplateResult {
  // The watch draws any glow above 0, through opacities that stop at 1, so
  // a glow above 1 draws as 1 does.
  const glow = Math.min(1, stored);
  // The line itself (`DividerTile`): 1 point at 0.5 (a label's side lines
  // 0.5 point at 0.35), at 0.7 under a glow, in a 1 point row.
  const thick = quiet ? 0.5 : 1;
  const line = `height:${Math.max(0.5, thick * s)}px;background:color-mix(in srgb, var(--ink) ${glow > 0 ? 70 : quiet ? 35 : 50}%, transparent)`;
  if (glow <= 0) return html`<span class="wp-divider-line" style=${`height:${s}px`}><span style=${line}></span></span>`;
  // Under the glow: a 2 point bloom in the color at 0.4 blurred 2, a 1 point
  // white core at 0.95 blurred 0.3, and the color at full added on top.
  const pct = (a: number) => `${Math.round(Math.min(1, a) * 100)}%`;
  return html`<span class="wp-divider-line" style=${`height:${s}px`}>
    <span style=${`height:${2 * s}px;background:color-mix(in srgb, var(--ink) ${pct(0.4 * glow)}, transparent);filter:blur(${2 * s}px)`}></span>
    <span style=${`height:${s}px;background:rgba(255, 255, 255, ${Math.round(0.95 * glow * 100) / 100});filter:blur(${0.3 * s}px)`}></span>
    <span style=${`height:${s}px;background:color-mix(in srgb, var(--ink) ${pct(glow)}, transparent);mix-blend-mode:plus-lighter`}></span>
    <span style=${line}></span>
  </span>`;
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

/** The state the watch seeds for an entity Home Assistant has not reported
 * (`EntityStateViewModel.seedEntitiesFromGrid`), by kind: off for a light,
 * switch, fan, toggle, automation, climate, remote or media player, closed
 * for a cover, locked for a lock, disarmed, docked, idle for a timer,
 * unknown for a person, 0 for a number, nothing for a select or any sensor
 * kind. Undefined for a kind with no seed (scenes, scripts, buttons and the
 * app's own tiles read no state). */
export function watchStubState(entityId: string): string | undefined {
  const kind = tileKind(entityId);
  if (Object.hasOwn(STUB_STATES, kind)) return STUB_STATES[kind];
  return SENSOR_KINDS.has(kind) ? "" : undefined;
}

const STUB_STATES: Readonly<Record<string, string>> = {
  light: "off", switch: "off", fan: "off", input_boolean: "off", automation: "off", climate: "off", remote: "off", media_player: "off",
  cover: "closed", lock: "locked", alarm_control_panel: "disarmed", vacuum: "docked", timer: "idle", person: "unknown",
  input_number: "0", number: "0", input_select: "", select: "",
};

/** The opacity the watch draws a tile at while it shows a seeded state
 * rather than a real one (`TileStateModifier`, `.unknownState`). */
export const WATCH_STUB_TILE_OPACITY = 0.7;

/** `input` with the seeded state in place for a tile whose entity is
 * missing from `states`, and whether it was put there. With no states at
 * all nothing is seeded: the picture then has nothing to say. */
function withStub(tile: WatchPageTile, input: WatchPagePreviewInput): { input: WatchPagePreviewInput; stub: boolean } {
  const states = input.states;
  const entityId = tileEntityId(tile);
  if (states === undefined || Object.hasOwn(states, entityId)) return { input, stub: false };
  const state = watchStubState(entityId);
  if (state === undefined) return { input, stub: false };
  const seeded: HassEntityState = { entity_id: entityId, state, attributes: {}, last_changed: "", last_updated: "" };
  return { input: { ...input, states: { ...states, [entityId]: seeded } }, stub: true };
}

/** The word each kind with an on state takes in the all-on picture, for the
 * kinds whose word is fixed. */
const ALL_ON_WORDS: Readonly<Record<string, string>> = {
  light: "on", switch: "on", input_boolean: "on", fan: "on", automation: "on", siren: "on", remote: "on",
  cover: "open", valve: "open", lock: "locked", media_player: "playing", vacuum: "cleaning", lawn_mower: "mowing",
  person: "home", timer: "active", climate: "heat", alarm_control_panel: "armed_home",
};

/**
 * `real` (or nothing, for an entity Home Assistant has not reported) as a
 * typical on state of its kind, which is what the watch draws lit: a light,
 * switch, toggle, fan, automation, siren or remote on; a cover or valve open
 * (at 100 when it has a position); a lock locked (its glowing look); a media
 * player playing; a vacuum cleaning; a mower mowing; a person home; a timer
 * running with no time to count; a climate in its own mode when it is on,
 * else its first mode that is not off, else heat; an alarm panel armed as it
 * is, else armed home. A light keeps its brightness and a fan its speed only
 * while they are really on (an off light has none to show), and every other
 * attribute (a player's volume, a climate's temperatures) is kept as it is.
 * Undefined for a kind with no on state: a sensor, number, select, scene,
 * button, script and the app's own tiles keep their real state.
 */
function allOnEntity(entityId: string, real: HassEntityState | undefined): HassEntityState | undefined {
  const kind = tileKind(entityId);
  if (!Object.hasOwn(ALL_ON_WORDS, kind)) return undefined;
  const was = lower(real?.state);
  const attributes: Record<string, unknown> = { ...(real?.attributes ?? {}) };
  let state = ALL_ON_WORDS[kind]!;
  switch (kind) {
    case "light":
    case "fan":
      if (was !== "on") delete attributes[kind === "light" ? "brightness" : "percentage"];
      break;
    case "cover":
    case "valve":
      if (storedNumber(attributes.current_position) !== undefined) attributes.current_position = 100;
      break;
    case "timer":
      // Nothing left to count, so no countdown, badge or bar.
      delete attributes.remaining;
      delete attributes.finishes_at;
      delete attributes.duration;
      break;
    case "climate": {
      const modes = Array.isArray(attributes.hvac_modes) ? attributes.hvac_modes.map(lower) : [];
      state = was !== "off" && available(was) && was !== "" ? was : (modes.find((m) => m !== "off" && m !== "") ?? state);
      break;
    }
    case "alarm_control_panel":
      if (Object.hasOwn(ALARM_WORDS, was) && was !== "disarmed") state = was;
      break;
  }
  return { last_changed: "", last_updated: "", ...real, entity_id: entityId, state, attributes };
}

/**
 * `states` with a tile's entity in a typical on state (`allOnEntity`), and
 * for a remote or a TV its media player too (playing, its volume kept), for
 * the all-on picture. `states` itself when the tile has nothing to light: a
 * kind with no on state, or an app tile. An entity in `tested` keeps the state
 * `states` gives it, the one being tried in the page editor's Live strip.
 */
export function watchAllOnStates(
  tile: WatchPageTile,
  states: Readonly<Record<string, HassEntityState>> | undefined,
  tested?: ReadonlySet<string>,
): Record<string, HassEntityState> | undefined {
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  const real = (id: string) => (states !== undefined && Object.hasOwn(states, id) ? states[id] : undefined);
  const lit: Record<string, HassEntityState> = {};
  const own = tested?.has(entityId) ? undefined : allOnEntity(entityId, real(entityId));
  if (own !== undefined) lit[entityId] = own;
  if (kind === "remote" || (kind === "media_player" && watchTileIsTvRemote(tile, states))) {
    const playerId = watchRemotePlayerId(tile);
    const player = real(playerId);
    if (playerId !== entityId && player !== undefined && !tested?.has(playerId)) lit[playerId] = allOnEntity(playerId, player) ?? player;
  }
  if (Object.keys(lit).length === 0) return states;
  return { ...states, ...lit };
}

/** `input` as a tile draws it: in the all-on picture, with that tile's
 * entity lit (`watchAllOnStates`), unless its state is being tried. */
function withStateMode(tile: WatchPageTile, input: WatchPagePreviewInput): WatchPagePreviewInput {
  if (input.stateMode !== "all-on") return input;
  const states = watchAllOnStates(tile, input.states, input.testedIds);
  return states === input.states ? input : { ...input, states };
}

function tileFace(
  stored: WatchPageTile,
  width: number,
  height: number,
  box: string,
  given: WatchPagePreviewInput,
  unit: number,
  s: number,
  titled: boolean,
): TemplateResult {
  // The tile as the watch receives it: colored, if it had no color.
  const tile = watchSyncedTile(stored, given.page);
  const { input, stub } = withStub(tile, withStateMode(tile, given));
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
    return html`<div class="wp-divider ${labelled ? "label" : ""}" style=${`${box}--ink:${ink};font-size:${look.textSize * s}px;${watchHeaderPlacement(tile, labelled, height, s)}`} title=${titled ? hint : nothing}>
      <span class="wp-divider-row" style=${`gap:${6 * s}px`}>${labelled ? html`${headerLine(look.glow, s, true)}${label !== "" ? html`<span class="wp-divider-label">${label}</span>` : nothing}${headerLine(look.glow, s, true)}` : headerLine(look.glow, s, false)}</span>
    </div>`;
  }
  if (cls === "spacer") {
    return html`<div class="wp-spacer" style=${`${box}border-radius:${watchTileCornerRadius(width, height) * s}px;${watchSpacerStyle(tile, s, { width, height })}`} title=${titled ? hint : nothing}>${tileUnderlay(tile, input, true, { width, height }, s, true)}</div>`;
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
  const stateColorRaw = look === undefined && !unknown ? stateEntry(tile.stateColors, key) : undefined;
  const stateInk = ownInk(stateColorRaw);
  const fallbackInk = watchTileFallbackInk(tile, input.page, input.states);
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
  const words = valueInLabel ? (watchValueInLabel(tile, states?.[entityId]) ?? tileStateText(tile, states) ?? label) : label;
  const lit = unknown ? false : watchTileStyleActive(tile, states);
  // A tile that opts out of dimming draws lit while off, as on the watch.
  const dimmed = !unknown && !lit && tile.dimWhenOff !== false;
  const fillBar = unknown ? undefined : fillBarLayer(tile, input, lit, height, s);
  const ground = unknown ? "rgba(255, 255, 255, 0.08)"
    : watchTileFill(stateInk !== undefined ? undefined : color, iconInk, !dimmed, watchTileColorOpacity(tile), { width, height });
  // The glass's inner shadows (`TileStyleModifier`) are cast by clear and
  // nearly clear fills, and the simulator shows none: the tile's edges keep
  // their color right up to the corner. So the glass has no depth here.
  const border = unknown ? undefined : watchTileBorder(tile, lit, fallbackInk);
  // The border's room around the symbol and the name.
  const pad = unknown ? 0 : watchBorderContentPadding(tile);
  const treat: WatchIconTreatment = unknown
    ? { filled: true, opacity: 0.5, glow: undefined }
    : look !== undefined
      ? { filled: look.filled, opacity: 1, glow: specialGlow(kind, look) }
      : watchTileIconTreatment(tile, states);
  const offset = watchIconVerticalOffset(tile, height);
  const glow = art === undefined && value === undefined ? glowFilter(treat.glow, iconInk, symbolPt, s) : "";
  const iconStyle = [
    pad === 0 ? "" : `inset:${pad * s}px`,
    offset === 0 ? "" : `transform:translateY(${offset * s}px)`,
    treat.opacity >= 1 ? "" : `opacity:${treat.opacity}`,
    glow === "" ? "" : `filter:${glow}`,
  ].filter((p) => p !== "").join(";");
  let icon: TemplateResult | typeof nothing;
  if (value !== undefined) {
    const size = value.fontSize ?? Math.max(11, symbolPt * 0.6);
    // Before its first run the watch writes a dash in the secondary color.
    icon = html`<span class="wp-value" style=${`font-size:${size * s}px;color:${value.color ?? inkCss(WATCH_SECONDARY)}${value.offsetY === 0 ? "" : `;transform:translateY(${value.offsetY * s}px)`}`}>${String.fromCharCode(0x2014)}</span>`;
  } else if (art !== undefined) {
    icon = nothing;
  } else if (look !== undefined) {
    // A gradient or the rainbow as the tile's own color paints the symbol as
    // it does any tile's; every other look paints its ink.
    const own = parseTileColor(tile.color);
    const fancy = own !== undefined && own.kind !== "solid" && stateEntry(tile.stateColors, key) === undefined;
    icon = specialSymbol(look, input.icons, symbolPt, Infinity, s, tile.iconShadow === true, watchSymbolPaint(fancy ? tile.color : look.ink.hex, look.ink.hex));
  } else if (watchTileHasNoIcon(tile) && stateSymbol === undefined) {
    icon = nothing;
  } else {
    const entity = states !== undefined && Object.hasOwn(states, entityId) ? states[entityId] : undefined;
    const base = unknown ? (tileSymbol(tile) ?? "questionmark.circle") : (stateSymbol ?? watchTileSymbol(tile, entity));
    const own = typeof tile.icon === "string" && tile.icon.trim() !== "";
    const name = base === undefined || stateSymbol !== undefined ? base
      : treat.filled ? filledSymbol(input.icons, base, true)
      : own ? base : unfilledSymbol(input.icons, base);
    const paint = unknown ? undefined : watchSymbolPaint(stateColorRaw ?? tile.color, iconInk);
    icon = symbolMark(input.icons, name, symbolPt * s, iconInk, tile.iconShadow === true, paint);
  }
  const labelCss = [
    `bottom:${(watchLabelBottomPadding(height) + pad) * s}px`,
    pad === 0 ? "" : `left:${pad * s}px;right:${pad * s}px`,
    labelStyle(tile, width, s),
    art !== undefined ? `color:#FFFFFF;text-shadow:0 ${s}px ${3 * s}px rgba(0, 0, 0, 0.9)` : "",
    unknown ? "color:rgba(142, 142, 147, 0.5);font-weight:500" : "",
  ].filter((p) => p !== "").join(";");
  const badgeCss = badge === undefined ? "" : [
    `font-size:${watchBadgeFontSize(tile, width, height) * s}px`, `top:${badge.top * s}px`, `left:${watchBadgePadding(width, height) * s}px`,
    `padding:0 ${s}px`, `color:${inkCss(WATCH_SECONDARY)}`, `font-weight:${badge.weight}`,
    badge.pill ? pillStyle(s, kind === "sensor" || kind === "binary_sensor" || kind === "counter" ? 5 : 1) : "",
    tile.statusTextShadow === false ? "" : `text-shadow:${watchTextShadow(s)}`,
  ].filter((p) => p !== "").join(";");
  const gone = cls === "entity" && raw !== undefined && watchStateUnavailable(raw, kind);
  const fade = (stub ? WATCH_STUB_TILE_OPACITY : 1) * (gone ? WATCH_UNAVAILABLE_OPACITY : 1);
  return html`<div class="wp-tile ${dimmed ? "off" : ""} ${unknown ? "unknown" : ""} ${art === undefined ? "" : "art"}"
    style=${`${box}border-radius:${radius}px${dimmed ? ";filter:saturate(0.5) brightness(0.94)" : ""}${fade < 1 ? `;opacity:${Math.round(fade * 1000) / 1000}` : ""}`}
    title=${titled ? hint : nothing}>
    ${unknown ? nothing : coverSideBars(tile, input, height, s)}
    ${fillBar === undefined ? nothing : html`<span class="wp-under" style=${`background:${fillBar};border-radius:${16 * s}px`}></span>`}
    <span class="wp-glass" style=${`background:${ground}`}></span>
    ${unknown ? nothing : tileUnderlay(tile, input, lit, { width, height }, s)}
    ${art === undefined ? nothing : albumArt(art)}
    <span class="wp-icon" style=${iconStyle}>${icon}</span>
    ${showLabel ? html`<span class="wp-label" style=${labelCss}>${words}</span>` : nothing}
    ${renderTileRim(border, width, height, s)}
    ${unknown ? nothing : tileOverlay(tile, input, lit, width, s)}
    ${badge === undefined ? nothing : html`<span class="wp-badge" style=${badgeCss}>${badge.text}</span>`}
    ${unknown || look !== undefined ? nothing : mediaStatusIcon(tile, input, width, height, s)}
    ${unknown || look !== undefined ? nothing : timerExtras(tile, input, width, iconInk, s)}
    ${special === undefined ? nothing : special.parts}
  </div>${gone ? unavailableMark(box, width, height, s) : nothing}`;
}

/** The opacity the watch draws an unavailable entity's tile at
 * (`UnavailableOverlay`), badges and all. */
export const WATCH_UNAVAILABLE_OPACITY = 0.4;

/** Whether an entity of `kind` in `state` is unavailable to the watch (its
 * model's `isAvailable`): "unavailable" or "unknown" for most; only
 * "unavailable" for a scene, script, button or siren (whose "unknown" means
 * never run); "none" too for the sensor family. */
export function watchStateUnavailable(state: string, kind = ""): boolean {
  const s = state.toLowerCase();
  if (s === "unavailable") return true;
  if (["scene", "script", "button", "input_button", "siren"].includes(kind)) return false;
  return s === "unknown" || (SENSOR_KINDS.has(kind) && s === "none");
}

/** `UnavailableOverlay`'s mark: a red line at 0.6, 1.5 points wide, from
 * the tile's top left corner to its bottom right, over the faded tile and
 * not faded itself. */
function unavailableMark(box: string, widthPt: number, heightPt: number, s: number): TemplateResult {
  const w = widthPt * s;
  const h = heightPt * s;
  return html`<svg class="wp-gone" style=${box} width=${w} height=${h} viewBox=${`0 0 ${w} ${h}`} aria-hidden="true">${svg`<line x1="0" y1="0" x2=${w} y2=${h} stroke="rgba(255, 69, 58, 0.6)" stroke-width=${1.5 * s} />`}</svg>`;
}

/** A media player's play or pause mark in its top right corner while it
 * plays, pauses or idles, with its activity status on
 * (`SimpleMediaPlayerTile`): 2 points lower under a top bar, else 1 point
 * higher than the badge padding. */
function mediaStatusIcon(tile: WatchPageTile, input: WatchPagePreviewInput, widthPt: number, heightPt: number, s: number): TemplateResult | typeof nothing {
  const entityId = tileEntityId(tile);
  if (tileKind(entityId) !== "media_player" || tile.showActivityStatus === false || watchTileIsTvRemote(tile, input.states)) return nothing;
  const state = lower(input.states?.[entityId]?.state);
  if (state !== "playing" && state !== "paused" && state !== "idle") return nothing;
  const pad = watchBadgePadding(widthPt, heightPt);
  const top = tile.stateBarStyle === "Fill" ? pad - 1 : pad + 2;
  return statusIcon(tile, state === "playing" ? "play.fill" : "pause.fill", top, pad, input.icons, s);
}

/** What a number or a select tile writes where the name goes: a number as
 * `displayValueString` writes it (grouped, 2 decimals at most when its step
 * is under 1, else none, then a space and its unit), a select its option as
 * it is. Undefined for any other tile or a missing entity. */
export function watchValueInLabel(tile: WatchPageTile, entity: HassEntityState | undefined): string | undefined {
  if (entity === undefined) return undefined;
  const kind = tileKind(tileEntityId(tile));
  if (kind === "input_select" || kind === "select") return String(entity.state ?? "");
  if (kind !== "input_number" && kind !== "number") return undefined;
  const value = Number(entity.state);
  if (String(entity.state ?? "").trim() === "" || !Number.isFinite(value)) return undefined;
  const step = storedNumber(entity.attributes?.step) ?? 1;
  const text = new Intl.NumberFormat("en-US", { maximumFractionDigits: step < 1 ? 2 : 0 }).format(value);
  const unit = typeof entity.attributes?.unit_of_measurement === "string" ? entity.attributes.unit_of_measurement : "";
  return unit === "" ? text : `${text} ${unit}`;
}

/** A cover's symbol by device class and whether it is open
 * (`TileStateVocabulary.coverIcon`). */
export function watchCoverSymbol(deviceClass: unknown, open: boolean): string {
  switch (lower(deviceClass)) {
    case "garage": return open ? "door.garage.open" : "door.garage.closed";
    case "gate": return open ? "door.french.open" : "door.french.closed";
    case "door": return open ? "door.left.hand.open" : "door.left.hand.closed";
    case "blind": return open ? "blinds.horizontal.open" : "blinds.horizontal.closed";
    case "curtain": return open ? "curtains.open" : "curtains.closed";
    case "shade": return open ? "roller.shade.open" : "roller.shade.closed";
    case "shutter": return open ? "blinds.vertical.open" : "blinds.vertical.closed";
    case "awning": return "tent";
    case "damper": return "rectangle.landscape.rotate";
    default: return open ? "window.ceiling.open" : "window.ceiling";
  }
}

const SENSOR_CLASS_SYMBOLS: Readonly<Record<string, string>> = {
  temperature: "thermometer.medium", humidity: "humidity", power: "bolt", energy: "bolt.circle", illuminance: "sun.max",
  pressure: "gauge", gas: "aqi.medium", carbon_dioxide: "carbon.dioxide.cloud", co2: "carbon.dioxide.cloud",
  carbon_monoxide: "exclamationmark.triangle", co: "exclamationmark.triangle", motion: "figure.walk", door: "door.left.hand.open",
  window: "window.horizontal", opening: "rectangle.portrait.and.arrow.right", garage_door: "door.garage.open", occupancy: "person.fill",
  moisture: "drop", voltage: "bolt.badge.clock", current: "waveform.path", frequency: "waveform", signal_strength: "wifi",
  timestamp: "clock", duration: "timer", speed: "speedometer", distance: "ruler", weight: "scalemass", mass: "scalemass",
  pm25: "aqi.medium", pm10: "aqi.medium", pm1: "aqi.medium", volatile_organic_compounds: "leaf", voc: "leaf",
  nitrogen_dioxide: "cloud", no2: "cloud", ozone: "sun.haze", o3: "sun.haze", sulphur_dioxide: "smoke", so2: "smoke",
};

const SENSOR_KIND_SYMBOLS: Readonly<Record<string, string>> = {
  text: "text.cursor", input_text: "text.cursor", counter: "number.circle", todo: "checklist", update: "square.and.arrow.down.fill",
  water_heater: "drop.degreesign.fill", lawn_mower: "leaf.fill", humidifier: "humidity.fill", device_tracker: "location.fill",
  event: "bolt.badge.clock.fill", zone: "mappin.and.ellipse", calendar: "calendar", date: "calendar.badge.clock", time: "clock",
  datetime: "calendar.badge.clock", input_datetime: "calendar.badge.clock", image: "photo", weather: "cloud.sun.fill",
  siren: "light.beacon.max.fill", assist_satellite: "dot.radiowaves.left.and.right", conversation: "quote.bubble.fill",
  tts: "text.bubble.fill", stt: "waveform.and.mic", wake_word: "ear.badge.waveform",
};

/** The symbols each tile view draws when the tile names none. */
const VIEW_SYMBOLS: Readonly<Record<string, string>> = {
  light: "lightbulb", switch: "switch.2", input_boolean: "togglepower", automation: "gearshape.2", fan: "fan", lock: "lock",
  button: "button.programmable", input_button: "button.programmable", input_number: "slider.horizontal.3", number: "slider.horizontal.3",
  input_select: "list.bullet", select: "list.bullet", scene: "play", script: "scroll", page: "rectangle.on.rectangle",
  show_page: "rectangle.on.rectangle", status_page: "list.bullet.rectangle.portrait", macro: "link", assist: "waveform.and.mic",
  speak_message: "message.and.waveform", http_action: "network",
};

/**
 * The symbol a plain tile draws (before its fill variant), as its watch
 * view picks it: a state's own symbol is the caller's; the tile's `icon`
 * when it has one (a lock's "lock" becomes "lock.open" while unlocked, and a
 * cover's ".ceiling" ".ceiling.open" while open); else the view's default:
 * a cover's by device class, a media player's by state, a timer's by
 * state, a sensor family tile's by device class then kind, every other
 * kind's own (`VIEW_SYMBOLS`), else the panel's.
 */
export function watchTileSymbol(tile: WatchPageTile, entity: HassEntityState | undefined): string | undefined {
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  const state = lower(entity?.state);
  const own = typeof tile.icon === "string" ? tile.icon.trim() : "";
  const coverOpen = () => {
    const p = storedNumber(entity?.attributes?.current_position);
    return entity !== undefined && (p !== undefined ? p > 0 : state === "open" || state === "opening");
  };
  if (own !== "") {
    if (kind === "lock" && entity !== undefined && state !== "locked") return own.replace(/lock/g, "lock.open");
    if ((kind === "cover" || kind === "valve") && coverOpen()) return own.replace(/\.ceiling/g, ".ceiling.open");
    return own;
  }
  if (kind === "lock") return entity === undefined || state === "locked" ? "lock" : "lock.open";
  if (kind === "cover" || kind === "valve") return watchCoverSymbol(entity?.attributes?.device_class, coverOpen());
  if (kind === "media_player") return state === "playing" ? "pause.fill" : state === "paused" ? "play.fill" : "play.circle";
  if (kind === "timer") return state === "paused" ? "pause.fill" : "timer";
  if (SENSOR_KINDS.has(kind) || kind === "sensor" || kind === "binary_sensor") {
    const dc = lower(entity?.attributes?.device_class);
    if (dc === "battery") {
      const level = Number(entity?.state);
      return !Number.isFinite(level) ? "battery.100" : level < 10 ? "battery.0" : level < 25 ? "battery.25" : level < 50 ? "battery.50" : level < 75 ? "battery.75" : "battery.100";
    }
    return SENSOR_CLASS_SYMBOLS[dc] ?? SENSOR_KIND_SYMBOLS[kind] ?? "sensor";
  }
  return VIEW_SYMBOLS[kind] ?? tileSymbol(tile);
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
 * in from each side and 5 from the bottom, as tall as the position says of
 * the whole tile (so a full one runs off the top, where the tile clips it),
 * from 0.8 at the bottom to 0.3 at the top, while the position is above 0.
 * They lie behind the tile's glass. */
function coverSideBars(tile: WatchPageTile, input: WatchPagePreviewInput, heightPt: number, s: number): TemplateResult | typeof nothing {
  const kind = tileKind(tileEntityId(tile));
  if (kind !== "cover" && kind !== "valve") return nothing;
  const percent = watchTileStatePercent(tile, input.states);
  if (percent === undefined || percent <= 0) return nothing;
  const white = tile.stateBarColorStyle === "White";
  const ink = white ? "#FFFFFF" : flatInk(tile.color, watchTileFallbackInk(tile, input.page, input.states));
  const a = white ? 0.7 : 1;
  const h = Math.max(0, heightPt * percent);
  const bar = (side: "left" | "right") =>
    html`<span class="wp-side" style=${`${side}:${4 * s}px;bottom:${5 * s}px;width:${4 * s}px;height:${Math.round(h * s * 100) / 100}px;border-radius:${2 * s}px;background:linear-gradient(0deg, ${rgba(ink, 0.8 * a)}, ${rgba(ink, 0.3 * a)})`}></span>`;
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
  // Tiles hidden while off are gone and the rest packed up, as on the watch;
  // in the all-on picture every tile is on, so none is hidden.
  const layout = watchPreviewLayout(watchReflowPage(page, input.stateMode === "all-on" ? undefined : input.states), screen);
  const scrolls = layout.height > screen.height + 0.5;
  return renderWatchFrame(screen, s, html`<div class="wp-screen" role="group" aria-label=${`Preview of ${name}`}
    style=${`width:${width}px;height:${layout.height * s}px;background:${watchScreenBackground(page, s, screen)}`}>
    ${renderWatchClock(screen, s, layout.topInset, input.icons)}
    ${renderWatchPageTitle(page, s, layout.topInset, input.icons, input.behavior)}
    ${layout.tiles.length === 0 ? html`<div class="wp-smart"><span>No tiles on this page.</span></div>` : nothing}
    ${layout.tiles.map((placed) => renderTile(placed, input, layout.unit, layout.topInset, s))}
    ${renderWatchPageIndicator(input, s)}
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
function renderSmartPreview(given: WatchPagePreviewInput): TemplateResult {
  // A smart page is a picture of what is on now, so it is always live.
  const input: WatchPagePreviewInput = given.stateMode === "all-on" ? { ...given, stateMode: "live" } : given;
  const s = input.scale ?? 1.5;
  const { page, screen } = input;
  const width = screen.width * s;
  const name = watchPageName(page);
  const config = readSmartConfig(page);
  const synthetic = smartSyntheticPage(page, input.states);
  const shown: WatchPage = { ...synthetic };
  delete shown.dynamicConfig;
  const layout = watchPreviewLayout(shown, screen);
  if (config === undefined || layout.tiles.length === 0) {
    const tracking = config === undefined ? "" : smartTrackingWords(config);
    const check = input.icons?.render("checkmark.circle.fill", 28 * s, "#34C759");
    return renderWatchFrame(screen, s, html`<div class="wp-screen" role="img" aria-label=${`${name}: ${smartWord("allOff")}. ${tracking}`}
      style=${`width:${width}px;height:${screen.height * s}px;background:${watchScreenBackground(page, s, screen)}`}>
      ${renderWatchClock(screen, s, layout.topInset, input.icons)}
      ${renderWatchPageTitle(shown, s, layout.topInset, input.icons, input.behavior)}
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
    style=${`width:${width}px;height:${layout.height * s}px;background:${watchScreenBackground(page, s, screen)}`}>
    ${renderWatchClock(screen, s, layout.topInset, input.icons)}
    ${renderWatchPageTitle(shown, s, layout.topInset, input.icons, input.behavior)}
    ${layout.tiles.map(tile)}
    ${renderWatchPageIndicator(input, s)}
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
  return !isSmartWatchPage(page) && watchPreviewLayout(page, screen).height > screen.height + 0.5;
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
    /* The watch's system font is SF Compact (macOS ships it as "SF Compact";
       the developer download adds the static "SF Compact Text"). */
    font-family: ${unsafeCSS(WATCH_FONT_FAMILY)};
    line-height: 1.15;
    /* The watch draws text without the Mac's stem darkening. */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  /* The system clock and the settings gear, each placed on its own. */
  .wp-clock { position: absolute; inset: 0 0 auto 0; height: 0; pointer-events: none; }
  .wp-time {
    position: absolute;
    line-height: 1;
    /* Centres the digits (not the line) on the clock's row. */
    transform: translateY(-0.5em);
    margin-top: ${unsafeCSS(CLOCK_DIGIT_SHIFT)}em;
    font-weight: 500;
    white-space: nowrap;
    color: #fff;
    font-variant-numeric: tabular-nums;
  }
  .wp-gear { position: absolute; display: flex; align-items: center; justify-content: center; opacity: 0.55; }
  .wp-gear svg { display: block; }
  /* A tile as the watch lays it out: everything placed in its own layer,
     the symbol centred, the name at the bottom, badges in the corners. */
  .wp-tile {
    position: absolute;
    box-sizing: border-box;
    overflow: hidden;
  }
  /* A template tile's glass is its own background. Every other tile's glass
     is a layer, over what the watch draws behind
     it (a cover's side bars, a Fill bar). */
  .wp-glass { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; }
  .wp-icon { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
  .wp-tile > .wp-label {
    position: absolute; left: 0; right: 0; padding: 0 1px; text-align: center; line-height: 1.2; pointer-events: none;
    /* SF Compact's own tracking at 8 to 10 points, which SwiftUI applies and
       a browser does not (measured against the simulator's names). */
    letter-spacing: ${unsafeCSS(WATCH_LABEL_TRACKING)}em;
  }
  .wp-side { position: absolute; pointer-events: none; }
  /* A running timer's countdown across its tile. */
  .wp-timer {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none;
    font-family: ${unsafeCSS(WATCH_ROUNDED_FAMILY)}; font-weight: 600; font-variant-numeric: tabular-nums; color: rgba(255, 255, 255, 0.6);
  }
  /* The watch's page indicator, over everything at the screen's edge. */
  .wp-pages { position: absolute; left: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; z-index: 3; }
  .wp-pages-dot { flex: none; border-radius: 50%; }
  .wp-pages-line { flex: none; border-radius: 999px; }
  .wp-pages-bar { position: relative; flex: none; border-radius: 999px; }
  .wp-pages-bar > span { position: absolute; top: 0; bottom: 0; border-radius: 999px; }
  /* An unavailable entity's red line, over its faded tile. */
  .wp-gone { position: absolute; display: block; overflow: visible; pointer-events: none; }
  /* The border, stroked on the tile's edge; the tile clips its outer half. */
  .wp-rim { position: absolute; left: 0; top: 0; display: block; overflow: visible; pointer-events: none; }
  .wp-art { position: absolute; inset: 0; border-radius: inherit; background-size: contain; background-position: center; background-repeat: no-repeat; pointer-events: none; }
  .wp-art-band { position: absolute; left: 0; right: 0; bottom: 0; height: 50%; border-radius: inherit; background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.85)); pointer-events: none; }
  .wp-tpl { display: flex; flex-direction: column; justify-content: center; align-items: center; }
  .wp-tpl-text {
    position: relative; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 5; overflow: hidden;
    width: 100%; white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.2;
    font-family: ${unsafeCSS(WATCH_ROUNDED_FAMILY)}; font-weight: 600;
  }
  .wp-tpl-icon { display: inline-block; vertical-align: -0.12em; }
  .wp-tile.unknown { outline: 1px dashed rgba(255, 255, 255, 0.3); outline-offset: -1px; }
  .wp-sym { display: block; flex: none; position: relative; }
  .wp-under { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; }
  .wp-bar { position: absolute; border-radius: 999px; pointer-events: none; }
  /* An HTTP action's Tile Value, where the symbol goes. */
  .wp-value {
    position: relative; flex: none; line-height: 1; text-align: center; font-weight: 600; font-variant-numeric: tabular-nums;
    font-family: ${unsafeCSS(WATCH_ROUNDED_FAMILY)};
  }
  /* The page title, centred across the screen. */
  .wp-title {
    position: absolute; left: 50%; transform: translateX(-50%); box-sizing: border-box; display: flex; max-width: 100%;
    border-radius: 999px; white-space: nowrap; pointer-events: none;
    font-family: ${unsafeCSS(WATCH_ROUNDED_FAMILY)}; font-weight: 600; line-height: normal;
  }
  .wp-title-label { position: relative; display: flex; align-items: center; min-width: 0; }
  .wp-title-icon { display: flex; flex: none; }
  .wp-title-name { overflow: hidden; text-overflow: ellipsis; }
  .wp-title svg { flex: none; display: block; }
  /* Glass: a rim from white at 0.5 to 0.16, half outside the capsule. */
  .wp-title-rim {
    position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
    background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.16));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
  }
  .wp-title-shine { position: absolute; border-radius: 999px; background: rgba(255, 255, 255, 0.24); pointer-events: none; }
  .wp-sym.shadow { filter: drop-shadow(0 1px 1.5px rgba(0, 0, 0, 0.7)); }
  .wp-sym-fade { display: block; flex: none; position: relative; }
  .wp-photo { display: block; flex: none; position: relative; box-sizing: border-box; border-radius: 50%; object-fit: cover; background: #000; }
  .wp-badge {
    position: absolute; display: flex; flex-direction: column; line-height: 1.15; white-space: nowrap; pointer-events: none;
    font-family: ${unsafeCSS(WATCH_ROUNDED_FAMILY)};
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
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: var(--ink);
  }
  /* The line, or the label between its two lines, centred on each other. */
  .wp-divider-row { display: flex; align-items: center; gap: 6px; width: 100%; }
  .wp-divider-label {
    flex: none; max-width: 70%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2;
    font-family: ${unsafeCSS(WATCH_ROUNDED_FAMILY)}; font-weight: 600; opacity: 0.8;
  }
  .wp-divider-line { position: relative; flex: 1; min-width: 0; }
  .wp-divider-line > span { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); border-radius: 999px; }
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
