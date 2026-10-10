// The arithmetic under the page editor's pointer gestures, without any DOM.
//
// The editing stage draws a page on a flat grid (`watchPreviewLayout` with
// `flat`): 12 columns of square units 2 points apart across the screen less
// the watch's side safe area (`WATCH_GRID_SIDE_INSET` each side), so a tile
// sits at the same pixel as in the preview and on the watch (an iPhone's
// grid keeps no side room: it fills the phone's pages area); rows one step
// below the last, starting `topInset` points below the top of the screen.
// Every number
// here is in CSS pixels, the points times the scale the stage is drawn at, so
// the view hands in what it measured and gets cells back.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md ("3b build contract").

import { browserStorage, type ColumnStorage } from "../column-split.js";
import type { WatchCell, WatchRect } from "./edit.js";
import { WATCH_GRID_COLUMNS, WATCH_GRID_SIDE_INSET, WATCH_GRID_SPACING } from "./model.js";

const COLUMNS = WATCH_GRID_COLUMNS;

/** A press turns into a drag after this much travel, in pixels, so a click
 * that wobbles a little is still a click. */
export const STAGE_DRAG_THRESHOLD = 4;

/** Rows the stage draws below the lowest tile, so a tile can be dropped
 * under everything. */
export const STAGE_SPARE_ROWS = 3;

/** One grid on screen, in pixels. */
export interface StageGrid {
  /** Pixels per point. */
  scale: number;
  /** A unit (a column, and the height of a row). */
  unit: number;
  /** The gap between two units. */
  spacing: number;
  /** `unit + spacing`: from one column or row to the next. */
  step: number;
  /** From the top of the screen to row 0. */
  top: number;
  /** From the left of the screen to column 0: the side safe area. */
  left: number;
}

/** The grid of a screen `screenWidth` points wide whose rows start `topInset`
 * points down, drawn at `scale` pixels per point: the 12 columns share the
 * screen less `sideInset` points on each side (the watch's side safe area,
 * none in an iPhone's pages area), and start that far in. */
export function stageGrid(screenWidth: number, topInset: number, scale: number, sideInset = WATCH_GRID_SIDE_INSET): StageGrid {
  const spacing = WATCH_GRID_SPACING * scale;
  const usable = Math.max(1, screenWidth - sideInset * 2);
  const unit = ((usable - (COLUMNS - 1) * WATCH_GRID_SPACING) / COLUMNS) * scale;
  return { scale, unit, spacing, step: unit + spacing, top: topInset * scale, left: sideInset * scale };
}

/** Where a rectangle of cells sits, in pixels from the screen's top left. */
export function cellRectPx(grid: StageGrid, rect: WatchRect): { left: number; top: number; width: number; height: number } {
  return {
    left: grid.left + rect.col * grid.step,
    top: grid.top + rect.row * grid.step,
    width: rect.colSpan * grid.unit + (rect.colSpan - 1) * grid.spacing,
    height: rect.rowSpan * grid.unit + (rect.rowSpan - 1) * grid.spacing,
  };
}

/** The cell a point is in. A point in the gap after a cell counts as that
 * cell. Nothing is clamped: a point above row 0 or beside the grid gives a
 * cell no tile covers. */
export function cellAtPx(grid: StageGrid, x: number, y: number): WatchCell {
  return { col: Math.floor((x - grid.left) / grid.step), row: Math.floor((y - grid.top) / grid.step) };
}

/** The cell nearest a dragged tile's top left corner, kept inside the grid
 * for a tile `colSpan` columns wide: rows from 0 down, columns 0 to
 * `12 - colSpan`. */
export function nearestCell(grid: StageGrid, left: number, top: number, colSpan: number): WatchCell {
  const span = Math.max(1, Math.min(COLUMNS, Math.trunc(colSpan)));
  const col = Math.round((left - grid.left) / grid.step);
  const row = Math.round((top - grid.top) / grid.step);
  return { col: Math.max(0, Math.min(COLUMNS - span, col)), row: Math.max(0, row) };
}

/** A dragged tile's top left corner: the pointer less where on the tile it
 * was grabbed. A mouse keeps the grab; the phone centers the tile under a
 * finger, which the panel does not copy. */
export function draggedCorner(
  pointer: { x: number; y: number },
  grab: { x: number; y: number },
): { left: number; top: number } {
  return { left: pointer.x - grab.x, top: pointer.y - grab.y };
}

/** A drag in pixels as cells, not rounded: `watchResizeHandleRect` rounds. */
export function cellDelta(grid: StageGrid, dx: number, dy: number): { cols: number; rows: number } {
  return { cols: dx / grid.step, rows: dy / grid.step };
}

/** Whether a press has travelled far enough to be a drag. */
export function pastDragThreshold(dx: number, dy: number, threshold = STAGE_DRAG_THRESHOLD): boolean {
  return Math.hypot(dx, dy) >= threshold;
}

/**
 * How far to scroll this frame while a drag is near an edge of the scrolling
 * box from `top` to `bottom` (pixels, the pointer's `y` in the same frame):
 * negative near the top, positive near the bottom, faster the closer it is,
 * up to `max` at the edge and past it. 0 elsewhere, and in a box too short to
 * have two edge bands.
 */
export function autoScrollStep(y: number, top: number, bottom: number, edge = 48, max = 18): number {
  if (!(bottom - top > edge * 2)) return 0;
  if (y < top + edge) return -Math.round(max * Math.min(1, (top + edge - y) / edge));
  if (y > bottom - edge) return Math.round(max * Math.min(1, (y - (bottom - edge)) / edge));
  return 0;
}

/** The whole rows that fit in `height` pixels of screen below the grid's
 * top, at least 1. */
export function rowsOnScreen(grid: StageGrid, height: number): number {
  return Math.max(1, Math.floor((height - grid.top + grid.spacing) / grid.step));
}

/** How many rows the stage draws: the page's rows and `STAGE_SPARE_ROWS`
 * more, at least a screen's worth, and while a gesture reaches down to row
 * `reach` (one past its bottom), that and the spare rows too. */
export function stageRows(extent: number, onScreen: number, reach = 0): number {
  return Math.max(extent + STAGE_SPARE_ROWS, onScreen, reach + STAGE_SPARE_ROWS);
}

/** The empty cells of `rows` rows as one SVG path, each a square with
 * corners of `radius` pixels, with row 0 at y 0 and column 0 at the grid's
 * `left`, so the path is drawn from the screen's left edge. One path rather than a
 * pattern, whose `url(#id)` is not found the same way in every browser inside
 * a shadow root. */
export function cellsPath(grid: StageGrid, rows: number, radius: number): string {
  const u = grid.unit;
  const r = Math.max(0, Math.min(radius, u / 2));
  const side = u - 2 * r;
  const n = (v: number) => Math.round(v * 100) / 100;
  const parts: string[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const x = grid.left + col * grid.step;
      const y = row * grid.step;
      parts.push(
        r === 0
          ? `M${n(x)} ${n(y)}h${n(u)}v${n(u)}h${n(-u)}z`
          : `M${n(x + r)} ${n(y)}h${n(side)}a${n(r)} ${n(r)} 0 0 1 ${n(r)} ${n(r)}v${n(side)}a${n(r)} ${n(r)} 0 0 1 ${n(-r)} ${n(r)}h${n(-side)}a${n(r)} ${n(r)} 0 0 1 ${n(-r)} ${n(-r)}v${n(-side)}a${n(r)} ${n(r)} 0 0 1 ${n(r)} ${n(-r)}z`,
      );
    }
  }
  return parts.join("");
}

/**
 * Where a dragged row of a list lands: the number of rows whose middle is
 * above the pointer, 0 to `middles.length`. The line that shows it is drawn
 * above that row, or under the last.
 */
export function listDropIndex(middles: readonly number[], y: number): number {
  let index = 0;
  for (const middle of middles) if (y > middle) index++;
  return index;
}

/** Where the stage's Live switch is remembered: "1" on, "0" off. */
export const STAGE_LIVE_KEY = "wrist-assistant-panel.pages.live.v1";

/** Whether the stage draws Home Assistant's real states (Live on) rather
 * than every tile lit: as last switched, off when never switched or when
 * the browser keeps nothing. */
export function loadStageLive(storage: ColumnStorage | undefined = browserStorage()): boolean {
  try {
    return storage?.getItem(STAGE_LIVE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Remember the Live switch for the next visit. A browser that keeps
 * nothing just forgets it. */
export function saveStageLive(on: boolean, storage: ColumnStorage | undefined = browserStorage()): void {
  try {
    storage?.setItem(STAGE_LIVE_KEY, on ? "1" : "0");
  } catch {
    // Private windows and full storage keep the switch for this visit only.
  }
}

/** Where the stage's zoom is remembered: the scale the person stepped to, as
 * a number, or nothing while it fits. */
export const STAGE_ZOOM_KEY = "wrist-assistant-panel.pages.zoom.v1";

/** The scales the zoom buttons step through, pixels per point. The tool
 * strip shows each as a percent of the watch's own points: 100% to 200%. */
export const STAGE_ZOOM_STEPS: readonly number[] = [1, 1.25, 1.5, 2];

/** The scale that fits: 150%, or 125% on a narrow screen. */
export function stageFitZoom(narrow: boolean): number {
  return narrow ? 1.25 : 1.5;
}

/** The zoom as the tool strip says it: "150%". */
export function stageZoomLabel(scale: number): string {
  return `${Math.round(scale * 100)}%`;
}

/** One step in from `scale`, or `scale` when it is the largest already. A
 * scale between two steps goes to the next one up. */
export function stageZoomIn(scale: number): number {
  return STAGE_ZOOM_STEPS.find((step) => step > scale + 1e-9) ?? scale;
}

/** One step out from `scale`, or `scale` when it is the smallest already. */
export function stageZoomOut(scale: number): number {
  return [...STAGE_ZOOM_STEPS].reverse().find((step) => step < scale - 1e-9) ?? scale;
}

/** The zoom the person stepped to last time, or undefined (fit) when there
 * is none, it is not one of the steps, or the browser keeps nothing. */
export function loadStageZoom(storage: ColumnStorage | undefined = browserStorage()): number | undefined {
  try {
    const raw = storage?.getItem(STAGE_ZOOM_KEY);
    if (raw === null || raw === undefined || raw === "") return undefined;
    const scale = Number(raw);
    return STAGE_ZOOM_STEPS.includes(scale) ? scale : undefined;
  } catch {
    return undefined;
  }
}

/** Remember the zoom; undefined (fit) is kept as an empty value, so the next
 * visit fits whatever width it opens at. */
export function saveStageZoom(scale: number | undefined, storage: ColumnStorage | undefined = browserStorage()): void {
  try {
    storage?.setItem(STAGE_ZOOM_KEY, scale === undefined ? "" : String(scale));
  } catch {
    // Private windows and full storage keep the zoom for this visit only.
  }
}

/** The index a row dragged from `from` takes in the list without itself,
 * for a drop at `drop` (as `listDropIndex` gives it). */
export function listMoveIndex(from: number, drop: number): number {
  return drop > from ? drop - 1 : drop;
}
