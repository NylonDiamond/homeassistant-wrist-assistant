// A plain picture of one watch page: the screen at the watch's size, its 12
// column grid, and each tile at its place and size with its color, symbol,
// name and one line of state.
//
// It is right about layout and nothing more. The placement comes from
// `watchPageLayout`, which is the watch's own arithmetic; the look of a tile
// is a flat stand-in. No animation, no patterns, no borders or glows.
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
  watchPageLayout,
  watchPageName,
} from "./model.js";

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
}

/** The watch's corner radius for a tile, `DS.radius(.tileWatch)` in the app. */
const TILE_RADIUS = 16;
/** Padding inside a tile, in points. */
const TILE_PAD = 6;

function rgba(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1, 7), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${Math.round(alpha * 1000) / 1000})`;
}

/** A tile's ground: its color, faint, as a tile reads when it is off. */
function tileGround(color: WatchTileColor | undefined): string {
  if (color === undefined) return "rgba(255, 255, 255, 0.12)";
  if (color.kind === "solid") return rgba(color.hex, 0.3 * color.opacity);
  if (color.kind === "gradient") return `linear-gradient(135deg, ${rgba(color.from, 0.38)}, ${rgba(color.to, 0.38)})`;
  return "linear-gradient(135deg, rgba(255,59,48,.35), rgba(255,149,0,.35), rgba(255,204,0,.35), rgba(52,199,89,.35), rgba(0,122,255,.35), rgba(175,82,222,.35))";
}

/** The page's own background, black when it has none. */
export function watchScreenColor(page: WatchPage): string {
  const color = parseTileColor(page.backgroundColor);
  return color?.kind === "solid" ? rgba(color.hex, color.opacity) : "#000";
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
 * 10) and line glow, 0 to 1. */
export function watchHeaderLook(tile: WatchPageTile): { style: "line" | "label"; textSize: number; glow: number } {
  const { style, glow } = dividerParts(tileEntityId(tile));
  return { style, textSize: storedNumber(tile.labelFontSizeOverride) ?? 10, glow };
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
function headerLine(glow: number, s: number, quiet: boolean): TemplateResult {
  const base = quiet ? 0.35 : 0.5;
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
  const label = tileLabel(tile, input.states, input.pages);
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
    return html`<div class="wp-spacer" style=${`${box}border-radius:${Math.min(TILE_RADIUS, width / 2, height / 2) * s}px`} title=${titled ? hint : nothing}></div>`;
  }

  const unknown = cls === "unknown";
  const radius = Math.min(TILE_RADIUS, width / 2, height / 2) * s;
  // A tile shorter than two and a half units has no room for a column, so its
  // symbol and words sit side by side.
  const compact = height < unit * 2.5;
  const symbolPt = watchPreviewIconSize(tile, width, height, compact);
  const state = unknown ? kindLabel : cls === "virtual" ? kindLabel : tileStateText(tile, input.states);
  const showLabel = tileShowsLabel(tile);
  const ground = unknown ? "rgba(255, 255, 255, 0.08)" : tileGround(color);
  return html`<div class="wp-tile ${compact ? "compact" : ""} ${unknown ? "unknown" : ""}"
    style=${`${box}border-radius:${radius}px;background:${ground};padding:${Math.min(TILE_PAD, height / 4) * s}px ${Math.min(TILE_PAD + 1, width / 4) * s}px;gap:${3 * s}px`}
    title=${titled ? hint : nothing}>
    ${!unknown && watchTileHasNoIcon(tile)
      ? nothing
      : symbolMark(input.icons, unknown ? undefined : tileSymbol(tile), symbolPt * s, unknown ? "#8E8E93" : ink, tile.iconShadow === true)}
    <span class="wp-words">
      ${showLabel ? html`<span class="wp-label" style=${labelStyle(tile, width, s)}>${label}</span>` : nothing}
      ${state === undefined ? nothing : html`<span class="wp-state" style=${`font-size:${9 * s}px`}>${state}</span>`}
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
      style=${`width:${width}px;height:${screen.height * s}px;background:${watchScreenColor(page)}`}>
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
    style=${`width:${width}px;height:${layout.height * s}px;background:${watchScreenColor(page)}`}>
    ${layout.topInset > 0 ? html`<span class="wp-clock" style=${`font-size:${13 * s}px;height:${layout.topInset * s}px;padding-right:${12 * s}px`}>10:09</span>` : nothing}
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
  .wp-sym { display: block; flex: none; }
  .wp-sym.shadow { filter: drop-shadow(0 1px 1.5px rgba(0, 0, 0, 0.7)); }
  .wp-words { display: flex; flex-direction: column; min-width: 0; max-width: 100%; }
  .wp-label, .wp-state { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .wp-state { color: rgba(255, 255, 255, 0.62); }
  .wp-spacer {
    position: absolute;
    box-sizing: border-box;
    border: 1px dashed rgba(255, 255, 255, 0.28);
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
