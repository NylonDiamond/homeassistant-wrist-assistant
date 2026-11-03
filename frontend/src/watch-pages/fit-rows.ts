// Fit to screen's rows, the panel's copy of the iPhone's `PageFitRows`
// (`TileFaces.swift`, in the app repo): a page keeps its full width and its
// rows get shorter until they all fit the height. Empty rows give up room
// first, so a page just over the height squashes no tile. Header rows keep
// their height. Under the floors the page scrolls at its normal size. Change
// the two together; each has a test of the same remote page.

import { tileEntityId, tileGeometry, tileKind, watchPageTiles, WATCH_GRID_SPACING, type WatchPage, type WatchPageLayout } from "./model.js";

/** An empty row never goes under this share of a normal row. */
export const FIT_EMPTY_ROW_FLOOR = 0.25;
/** A tile's row never goes under this share of a normal row. */
export const FIT_TILE_ROW_FLOOR = 0.45;
/** No tile's cell goes under this height in points. */
export const FIT_SMALLEST_TILE_HEIGHT = 30;
/** One Look's room under a page's last row, with the dock under it
 * (`OneLookGrid.phoneBottomPadding`). */
export const PHONE_FIT_BOTTOM_ROOM = 7;
/** A row with a header pulls the rows below it up by these shares of a row,
 * as on any page (`PageGridLayout`). */
const FIRST_HEADER_SHIFT = 0.6;
const LATER_HEADER_SHIFT = 0.4;
/** Row heights step by this, so tiles land on whole pixels. */
const STEP = 0.5;

export type FitRowKind = "empty" | "tile" | "header";

export interface FitRows {
  /** One height per row, top first. */
  heights: number[];
  /** The height of a row with a tile in it. */
  tileRow: number;
}

/** How far `count` headers pull the rows below them up. */
function headerPull(count: number, natural: number): number {
  return count === 0 ? 0 : natural * (FIRST_HEADER_SHIFT + (count - 1) * LATER_HEADER_SHIFT);
}

/** What fills each of a page's rows. A spacer leaves its row empty. */
export function fitRowKinds(page: WatchPage): FitRowKind[] {
  const kinds: FitRowKind[] = [];
  const reach = (end: number): void => {
    while (kinds.length < end) kinds.push("empty");
  };
  for (const tile of watchPageTiles(page)) {
    const g = tileGeometry(tile);
    const kind = tileKind(tileEntityId(tile));
    reach(g.row + g.rowSpan);
    if (kind === "spacer") continue;
    for (let row = g.row; row < g.row + g.rowSpan; row += 1) {
      if (kinds[row] !== "header") kinds[row] = kind === "divider" ? "header" : "tile";
    }
  }
  return kinds;
}

/** The fit itself, on what fills each row. Undefined when the rows already
 * fit at `natural`, or when fitting them would pass a floor. */
export function fitRowsOf(
  kinds: readonly FitRowKind[],
  shortestTileRows: number | undefined,
  headerCount: number,
  natural: number,
  height: number,
  spacing = WATCH_GRID_SPACING,
): FitRows | undefined {
  if (kinds.length === 0 || natural <= 0 || height <= 0) return undefined;
  const count = (kind: FitRowKind): number => kinds.filter((k) => k === kind).length;
  const tileRows = count("tile");
  const emptyRows = count("empty");
  const room = height - (count("header") * natural + (kinds.length - 1) * spacing - headerPull(headerCount, natural));
  if (natural * (tileRows + emptyRows) <= room) return undefined;

  const emptyFloor = natural * FIT_EMPTY_ROW_FLOOR;
  let emptyRow = emptyFloor;
  let tileRow = natural;
  if (emptyRows > 0 && (room - natural * tileRows) / emptyRows >= emptyFloor) {
    emptyRow = (room - natural * tileRows) / emptyRows;
  } else {
    if (tileRows === 0) return undefined;
    tileRow = Math.floor((room - emptyFloor * emptyRows) / tileRows / STEP) * STEP;
    if (tileRow < natural * FIT_TILE_ROW_FLOOR) return undefined;
    if (shortestTileRows !== undefined && tileRow * shortestTileRows + spacing * (shortestTileRows - 1) < FIT_SMALLEST_TILE_HEIGHT) return undefined;
  }
  return {
    heights: kinds.map((kind) => (kind === "empty" ? emptyRow : kind === "tile" ? tileRow : natural)),
    tileRow,
  };
}

/** A page's rows fitted in `height`, at a normal row of `natural`. */
export function fitPageRows(page: WatchPage, natural: number, height: number): FitRows | undefined {
  const tiles = watchPageTiles(page).map((tile) => ({ g: tileGeometry(tile), kind: tileKind(tileEntityId(tile)) }));
  const spans = tiles.filter((t) => t.kind !== "spacer" && t.kind !== "divider").map((t) => t.g.rowSpan);
  const headerCount = new Set(tiles.filter((t) => t.kind === "divider").map((t) => t.g.row)).size;
  return fitRowsOf(fitRowKinds(page), spans.length === 0 ? undefined : Math.min(...spans), headerCount, natural, height);
}

/** Where `row` starts. A row past the last counts as a tile's row. */
export function fitRowTop(rows: FitRows, row: number, spacing = WATCH_GRID_SPACING): number {
  let top = 0;
  for (let r = 0; r < row; r += 1) top += (rows.heights[r] ?? rows.tileRow) + spacing;
  return top;
}

/** The rows a tile of `height` looks like at normal size: One Look picks its
 * layout from the rows, so a squashed 3 row tile draws as a short tile's strip,
 * its icon beside its name. */
export function fitDrawnRowSpan(height: number, natural: number, spacing = WATCH_GRID_SPACING): number {
  return Math.max(1, Math.round((height + spacing) / (natural + spacing)));
}

/** `layout` with its rows fitted in `height`, or as it is when no fit
 * applies. Each tile looks like the rows it now draws. */
export function fittedLayout(layout: WatchPageLayout, page: WatchPage, height: number): WatchPageLayout {
  const rows = fitPageRows(page, layout.unit, height);
  if (rows === undefined) return layout;
  const step = layout.unit + layout.spacing;
  const tiles = layout.tiles.map((placed) => {
    const g = tileGeometry(placed.tile);
    // A header's pull up stays what it is at the normal size.
    const pull = g.row * step - placed.y;
    const top = fitRowTop(rows, g.row, layout.spacing);
    const tall = fitRowTop(rows, g.row + g.rowSpan, layout.spacing) - top - layout.spacing;
    return {
      ...placed,
      y: top - pull,
      height: tall,
      tile: { ...placed.tile, rowSpan: fitDrawnRowSpan(tall, layout.unit, layout.spacing) },
    };
  });
  return { ...layout, tiles, contentHeight: height, height: layout.screen.height };
}

/** How Fit to screen treats a page: it already fits, only its empty rows get
 * shorter, its rows are `share` of their normal height, or it cannot fit. */
export type FitState =
  | { kind: "fits" }
  | { kind: "empty-rows" }
  | { kind: "squashed"; share: number }
  | { kind: "scrolls" };

export function fitState(page: WatchPage, natural: number, height: number): FitState {
  const rows = fitPageRows(page, natural, height);
  if (rows !== undefined) {
    return rows.tileRow >= natural ? { kind: "empty-rows" } : { kind: "squashed", share: rows.tileRow / natural };
  }
  // No fit is either no need or too many rows.
  const dividers = watchPageTiles(page).filter((tile) => tileKind(tileEntityId(tile)) === "divider");
  const headerCount = new Set(dividers.map((tile) => tileGeometry(tile).row)).size;
  const rowCount = fitRowKinds(page).length;
  const whole = rowCount * natural + Math.max(0, rowCount - 1) * WATCH_GRID_SPACING - headerPull(headerCount, natural);
  return whole <= height ? { kind: "fits" } : { kind: "scrolls" };
}

/** A fit's state in words. */
export function fitStateWords(state: FitState): string {
  switch (state.kind) {
    case "fits": return "This page already fits this iPhone's screen.";
    case "empty-rows": return "Fits: only its empty rows get shorter.";
    case "squashed": return `Fits: its rows are ${Math.round(state.share * 100)}% of their normal height.`;
    case "scrolls": return "Too tall for this iPhone's screen, so this page scrolls as normal. Remove some rows to fit it.";
  }
}
