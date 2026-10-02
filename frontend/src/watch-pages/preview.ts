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

function screenColor(page: WatchPage): string {
  const color = parseTileColor(page.backgroundColor);
  return color?.kind === "solid" ? rgba(color.hex, color.opacity) : "#000";
}

function symbolMark(icons: IconProvider | undefined, symbol: string | undefined, px: number, ink: string): TemplateResult {
  const glyph = symbol === undefined ? undefined : icons?.render(symbol, px, ink);
  return html`<svg class="wp-sym" width=${px} height=${px} viewBox=${`0 0 ${px} ${px}`} aria-hidden="true">${glyph
    ?? svg`<circle cx=${px / 2} cy=${px / 2} r=${px / 5} fill=${ink} fill-opacity="0.7" />`}</svg>`;
}

function renderTile(placed: PlacedWatchTile, input: WatchPagePreviewInput, unit: number, top: number, s: number): TemplateResult {
  const { tile, x, y, width, height } = placed;
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  const cls = tileClass(entityId, input.states);
  const box = `left:${x * s}px;top:${(top + y) * s}px;width:${width * s}px;height:${height * s}px;`;
  const color = parseTileColor(tile.color);
  const ink = tileInkColor(color);
  const label = tileLabel(tile, input.states, input.pages);
  const kindLabel = tileKindLabel(kind);
  const hint = [label, kindLabel, entityId].filter((t, i, all) => t !== "" && all.indexOf(t) === i).join(" · ");

  if (cls === "divider") {
    const { style } = dividerParts(entityId);
    return html`<div class="wp-divider" style=${`${box}--ink:${ink};font-size:${9 * s}px`} title=${hint}>
      ${style === "label" && label !== "" ? html`<span class="wp-divider-label">${label}</span>` : nothing}
      <span class="wp-divider-line"></span>
    </div>`;
  }
  if (cls === "spacer") {
    return html`<div class="wp-spacer" style=${`${box}border-radius:${Math.min(TILE_RADIUS, width / 2, height / 2) * s}px`} title=${hint}></div>`;
  }

  const unknown = cls === "unknown";
  const radius = Math.min(TILE_RADIUS, width / 2, height / 2) * s;
  // A tile shorter than two and a half units has no room for a column, so its
  // symbol and words sit side by side.
  const compact = height < unit * 2.5;
  const symbolPt = Math.max(9, Math.min(24, Math.min(width, height) * (compact ? 0.5 : 0.3)));
  const state = unknown ? kindLabel : cls === "virtual" ? kindLabel : tileStateText(tile, input.states);
  const showLabel = tileShowsLabel(tile);
  const ground = unknown ? "rgba(255, 255, 255, 0.08)" : tileGround(color);
  return html`<div class="wp-tile ${compact ? "compact" : ""} ${unknown ? "unknown" : ""}"
    style=${`${box}border-radius:${radius}px;background:${ground};padding:${Math.min(TILE_PAD, height / 4) * s}px ${Math.min(TILE_PAD + 1, width / 4) * s}px;gap:${3 * s}px`}
    title=${hint}>
    ${symbolMark(input.icons, unknown ? undefined : tileSymbol(tile), symbolPt * s, unknown ? "#8E8E93" : ink)}
    <span class="wp-words">
      ${showLabel ? html`<span class="wp-label" style=${`font-size:${10.5 * s}px`}>${label}</span>` : nothing}
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
      style=${`width:${width}px;height:${screen.height * s}px;background:${screenColor(page)}`}>
      <div class="wp-smart">
        <b>Smart page</b>
        <span>${domains.length > 0
          ? `The watch fills this page itself with: ${domains.join(", ")}.`
          : "The watch fills this page itself."}</span>
      </div>
    </div>`;
  }
  const layout = watchPageLayout(page, screen);
  const scrolls = layout.height > screen.height + 0.5;
  return html`<div class="wp-screen" role="group" aria-label=${`Preview of ${name}`}
    style=${`width:${width}px;height:${layout.height * s}px;background:${screenColor(page)}`}>
    ${layout.topInset > 0 ? html`<span class="wp-clock" style=${`font-size:${13 * s}px;height:${layout.topInset * s}px;padding-right:${12 * s}px`}>10:09</span>` : nothing}
    ${layout.tiles.length === 0 ? html`<div class="wp-smart"><span>No tiles on this page.</span></div>` : nothing}
    ${layout.tiles.map((placed) => renderTile(placed, input, layout.unit, layout.topInset, s))}
    ${scrolls ? html`<div class="wp-fold" style=${`top:${screen.height * s}px`}><span>End of the screen, the page scrolls on</span></div>` : nothing}
  </div>`;
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
  .wp-words { display: flex; flex-direction: column; min-width: 0; max-width: 100%; }
  .wp-label, .wp-state { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .wp-label { font-weight: 600; }
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
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .wp-divider-label { flex: none; max-width: 70%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .wp-divider-line { flex: 1; height: 1px; background: var(--ink); opacity: 0.55; }
  .wp-fold {
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px dashed rgba(255, 255, 255, 0.55);
    pointer-events: none;
  }
  .wp-fold > span {
    position: absolute;
    right: 8px;
    top: 2px;
    padding: 1px 6px;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.7);
    color: rgba(255, 255, 255, 0.8);
    font-size: 10px;
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
