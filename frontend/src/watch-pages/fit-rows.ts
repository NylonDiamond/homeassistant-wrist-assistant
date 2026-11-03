// Fit to screen's rows, the panel's copy of the iPhone's `PageFitRows`
// (`TileFaces.swift`, in the app repo): a page keeps its full width and its
// rows get shorter until they all fit the height. Empty rows give up room
// first, so a page just over the height squashes no tile. Header rows keep
// their height. Under the floor the page scrolls at its normal size. Change
// the two together; each has a test of the same remote page.

import { tileEntityId, tileGeometry, tileKind, watchPageTiles, WATCH_GRID_SPACING, type WatchPage, type WatchPageLayout, type WatchPageTile, type WatchScreen } from "./model.js";

/** An empty row never goes under this share of a normal row. */
export const FIT_EMPTY_ROW_FLOOR = 0.25;
/** No tile's cell goes under this height in points. The only floor on tile
 * rows, as a tall tile's rows can get far shorter than a short tile's and
 * leave as good a button. */
export const FIT_SMALLEST_TILE_HEIGHT = 30;
/** The same on the watch, whose tiles are drawn in far less. */
export const FIT_SMALLEST_WATCH_TILE_HEIGHT = 22;
/** The room a fitted page leaves under its last row on the watch, for the
 * screen's rounded corners (`PageFitRows.watchBottomRoom`). */
export const WATCH_FIT_BOTTOM_ROOM = 6;

/** Whether a page is set to fit `screen`: each has its own key, as a page can
 * fit one and not the other. */
export function fitsOnScreen(page: WatchPage, screen: WatchScreen): boolean {
  return (screen === "iphone" ? page.fitToScreen : page.watchFitToScreen) === true;
}

/** The smallest cell a tile may have on `screen`. */
export function fitSmallestTile(screen: WatchScreen): number {
  return screen === "iphone" ? FIT_SMALLEST_TILE_HEIGHT : FIT_SMALLEST_WATCH_TILE_HEIGHT;
}

/** One Look's room under a page's last row, with the dock under it
 * (`OneLookGrid.phoneBottomPadding`). */
export const PHONE_FIT_BOTTOM_ROOM = 7;
/** A row with a header pulls the rows below it up by these shares of a row,
 * as on any page (`PageGridLayout`). */
const FIRST_HEADER_SHIFT = 0.6;
const LATER_HEADER_SHIFT = 0.4;
/** A tile under this many rows draws as a strip (`OneLookLayout.stripRows`). */
export const FIT_STRIP_ROWS = 4;
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
  smallestTile = FIT_SMALLEST_TILE_HEIGHT,
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
    if (tileRow <= 0) return undefined;
    if (shortestTileRows !== undefined && tileRow * shortestTileRows + spacing * (shortestTileRows - 1) < smallestTile) return undefined;
  }
  return {
    heights: kinds.map((kind) => (kind === "empty" ? emptyRow : kind === "tile" ? tileRow : natural)),
    tileRow,
  };
}

/** A page's rows fitted in `height`, at a normal row of `natural`. */
export function fitPageRows(page: WatchPage, natural: number, height: number, smallestTile = FIT_SMALLEST_TILE_HEIGHT): FitRows | undefined {
  const tiles = watchPageTiles(page).map((tile) => ({ g: tileGeometry(tile), kind: tileKind(tileEntityId(tile)) }));
  const spans = tiles.filter((t) => t.kind !== "spacer" && t.kind !== "divider").map((t) => t.g.rowSpan);
  const headerCount = new Set(tiles.filter((t) => t.kind === "divider").map((t) => t.g.row)).size;
  return fitRowsOf(fitRowKinds(page), spans.length === 0 ? undefined : Math.min(...spans), headerCount, natural, height, WATCH_GRID_SPACING, smallestTile);
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

/** Whether a tile of `rowSpan` rows, drawn as `drawn` rows, gives up its Custom
 * arrangement: squashed to a strip, there is no room for the parts where they
 * were put (`PageFitRows.dropsArrange`). */
export function fitDropsArrange(rowSpan: number, drawn: number): boolean {
  return drawn < rowSpan && drawn < FIT_STRIP_ROWS;
}

/** The copy of a tile to draw at `height`: it takes the rows it looks like,
 * and the height (`PageFitRows.drawnItem`). The tile itself when its rows did
 * not get shorter. The copy is for drawing only and is never saved. */
export function fitDrawnTile(tile: WatchPageTile, height: number, natural: number, spacing = WATCH_GRID_SPACING): WatchPageTile {
  const g = tileGeometry(tile);
  const kind = tileKind(tileEntityId(tile));
  if (kind === "spacer" || kind === "divider" || height >= natural * g.rowSpan + spacing * (g.rowSpan - 1) - 0.01) return tile;
  const drawn = fitDrawnRowSpan(height, natural, spacing);
  const copy: WatchPageTile = { ...tile, rowSpan: drawn, fittedCellHeight: height };
  if (fitDropsArrange(g.rowSpan, drawn)) delete copy.arrange;
  return copy;
}

/** `layout` placed on fitted `rows`. Each tile keeps its stored fields where
 * the editor reads them to move it (`keepTiles`), else it is the drawn copy. */
export function layoutOnFitRows(layout: WatchPageLayout, rows: FitRows, keepTiles = false): WatchPageLayout {
  const step = layout.unit + layout.spacing;
  const tiles = layout.tiles.map((placed) => {
    const g = tileGeometry(placed.tile);
    // A header's pull up stays what it is at the normal size.
    const pull = g.row * step - placed.y;
    const top = fitRowTop(rows, g.row, layout.spacing);
    const tall = fitRowTop(rows, g.row + g.rowSpan, layout.spacing) - top - layout.spacing;
    return { ...placed, y: top - pull, height: tall, tile: keepTiles ? placed.tile : fitDrawnTile(placed.tile, tall, layout.unit, layout.spacing) };
  });
  return { ...layout, tiles };
}

/** `layout` with its rows fitted in `height`, or as it is when no fit
 * applies. */
export function fittedLayout(layout: WatchPageLayout, page: WatchPage, height: number, smallestTile = FIT_SMALLEST_TILE_HEIGHT): WatchPageLayout {
  const rows = fitPageRows(page, layout.unit, height, smallestTile);
  if (rows === undefined) return layout;
  return { ...layoutOnFitRows(layout, rows), contentHeight: height, height: layout.screen.height };
}

/** How Fit to screen treats a page: it already fits, only its empty rows get
 * shorter, its rows are `share` of their normal height, or it cannot fit. */
export type FitState =
  | { kind: "fits" }
  | { kind: "empty-rows" }
  | { kind: "squashed"; share: number }
  | { kind: "scrolls" };

export function fitState(page: WatchPage, natural: number, height: number, smallestTile = FIT_SMALLEST_TILE_HEIGHT): FitState {
  const rows = fitPageRows(page, natural, height, smallestTile);
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

/** A fit's state in words, on `device`. */
export function fitStateWords(state: FitState, device = "iPhone"): string {
  switch (state.kind) {
    case "fits": return `This page already fits this ${device}'s screen.`;
    case "empty-rows": return "Fits: only its empty rows get shorter.";
    case "squashed": return `Fits: its rows are ${Math.round(state.share * 100)}% of their normal height.`;
    case "scrolls": return `Too tall for this ${device}'s screen, so this page scrolls as normal. Remove some rows to fit it.`;
  }
}

/** The line a tile's settings show when `screen` draws it squashed. */
export function fitTileNote(screen: WatchScreen): string {
  const [here, there] = screen === "iphone" ? ["iPhone", "watch"] : ["watch", "iPhone"];
  return `This page fits the ${here}'s screen, so this tile draws short there. Custom layouts show on the ${there} and on taller tiles.`;
}
