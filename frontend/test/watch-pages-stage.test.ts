// The page editor's pointer arithmetic: pixels to cells at a scale, the grab
// offset, the cell delta of a resize handle, the drag threshold, the auto
// scroll, how many rows the stage draws, and where a dragged page row lands.

import { describe, expect, it } from "vitest";

import { type WatchRect, listedWatchPages, moveWatchPage, watchResizeHandleRect } from "../src/watch-pages/edit.js";
import { WATCH_GRID_TOP_INSET, watchPageHasHeader, watchPageLayout } from "../src/watch-pages/model.js";
import {
  STAGE_SPARE_ROWS,
  autoScrollStep,
  cellAtPx,
  cellDelta,
  cellRectPx,
  cellsPath,
  draggedCorner,
  listDropIndex,
  listMoveIndex,
  nearestCell,
  pastDragThreshold,
  rowsOnScreen,
  stageGrid,
  stageRows,
} from "../src/watch-pages/stage.js";

// A 208 point screen: 12 units of 15.5 points, 2 points apart, a step of 17.5.
const SCREEN = { width: 208, height: 248 };

describe("the stage grid", () => {
  it("scales the watch's units and the top inset", () => {
    const grid = stageGrid(208, WATCH_GRID_TOP_INSET, 2);
    expect(grid.unit).toBeCloseTo(31);
    expect(grid.spacing).toBe(4);
    expect(grid.step).toBeCloseTo(35);
    expect(grid.top).toBe(68);
    expect(grid.scale).toBe(2);
  });

  it("puts a rectangle of cells where the flat layout puts the tile", () => {
    const grid = stageGrid(208, WATCH_GRID_TOP_INSET, 1.5);
    const page = {
      items: [
        { id: "A", entityId: "divider.label.light", gridCol: 0, gridRow: 0, colSpan: 12, rowSpan: 1 },
        { id: "B", entityId: "light.a", gridCol: 3, gridRow: 5, colSpan: 4, rowSpan: 2 },
      ],
    };
    const layout = watchPageLayout(page, SCREEN, { flat: true });
    const b = layout.tiles[1]!;
    const px = cellRectPx(grid, { col: 3, row: 5, colSpan: 4, rowSpan: 2 });
    expect(px.left).toBeCloseTo(b.x * 1.5);
    expect(px.top).toBeCloseTo(grid.top + b.y * 1.5);
    expect(px.width).toBeCloseTo(b.width * 1.5);
    expect(px.height).toBeCloseTo(b.height * 1.5);
    // A full width rectangle spans the screen exactly.
    expect(cellRectPx(grid, { col: 0, row: 0, colSpan: 12, rowSpan: 1 }).width).toBeCloseTo(208 * 1.5);
  });

  it("finds the cell a point is in, the gap after a cell counting as that cell", () => {
    const grid = stageGrid(208, 0, 1);
    expect(cellAtPx(grid, 0, 0)).toEqual({ col: 0, row: 0 });
    expect(cellAtPx(grid, 16, 16)).toEqual({ col: 0, row: 0 });
    expect(cellAtPx(grid, 17.6, 35.1)).toEqual({ col: 1, row: 2 });
    // Outside the grid: a cell no tile covers.
    expect(cellAtPx(grid, -3, -3)).toEqual({ col: -1, row: -1 });
    const inset = stageGrid(208, WATCH_GRID_TOP_INSET, 1);
    expect(cellAtPx(inset, 1, WATCH_GRID_TOP_INSET + 1)).toEqual({ col: 0, row: 0 });
    expect(cellAtPx(inset, 1, 10).row).toBe(-2);
  });

  it("takes the cell nearest a dragged corner and keeps the tile inside the grid", () => {
    const grid = stageGrid(208, WATCH_GRID_TOP_INSET, 1.5);
    const step = grid.step;
    expect(nearestCell(grid, 2 * step + 0.4 * step, grid.top + 3 * step - 0.4 * step, 4)).toEqual({ col: 2, row: 3 });
    expect(nearestCell(grid, 2 * step + 0.6 * step, grid.top + 3 * step + 0.6 * step, 4)).toEqual({ col: 3, row: 4 });
    // Past the right edge: a 4 column tile starts no later than column 8.
    expect(nearestCell(grid, 11 * step, grid.top, 4)).toEqual({ col: 8, row: 0 });
    // Above the grid and left of it: row 0, column 0.
    expect(nearestCell(grid, -40, 0, 1)).toEqual({ col: 0, row: 0 });
    // A span out of range is read as 1 to 12.
    expect(nearestCell(grid, 11 * step, grid.top, 20)).toEqual({ col: 0, row: 0 });
  });

  it("keeps the grab offset: the corner is the pointer less where the tile was held", () => {
    expect(draggedCorner({ x: 100, y: 80 }, { x: 12, y: 30 })).toEqual({ left: 88, top: 50 });
  });

  it("gives a handle's drag in cells for watchResizeHandleRect to round", () => {
    const grid = stageGrid(208, WATCH_GRID_TOP_INSET, 2);
    const delta = cellDelta(grid, 35 * 1.4, -35 * 0.6);
    expect(delta.cols).toBeCloseTo(1.4);
    expect(delta.rows).toBeCloseTo(-0.6);
    const start: WatchRect = { col: 2, row: 2, colSpan: 4, rowSpan: 4 };
    expect(watchResizeHandleRect(start, "bottomRight", delta)).toEqual({ col: 2, row: 2, colSpan: 5, rowSpan: 3 });
  });

  it("starts a drag after four pixels of travel", () => {
    expect(pastDragThreshold(3, 0)).toBe(false);
    expect(pastDragThreshold(2, 2)).toBe(false);
    expect(pastDragThreshold(3, 3)).toBe(true);
    expect(pastDragThreshold(0, -4)).toBe(true);
    expect(pastDragThreshold(1, 1, 1)).toBe(true);
  });
});

describe("auto scroll", () => {
  it("scrolls up near the top and down near the bottom, faster at the edge", () => {
    expect(autoScrollStep(500, 0, 1000)).toBe(0);
    expect(autoScrollStep(0, 0, 1000)).toBe(-18);
    expect(autoScrollStep(24, 0, 1000)).toBe(-9);
    expect(autoScrollStep(1000, 0, 1000)).toBe(18);
    expect(autoScrollStep(976, 0, 1000)).toBe(9);
    // Past the edge it keeps the top speed.
    expect(autoScrollStep(1200, 0, 1000)).toBe(18);
    expect(autoScrollStep(-50, 0, 1000)).toBe(-18);
  });

  it("does nothing in a box too short for two edge bands", () => {
    expect(autoScrollStep(10, 0, 90)).toBe(0);
    expect(autoScrollStep(10, 0, 96)).toBe(0);
  });
});

describe("the rows the stage draws", () => {
  it("counts the whole rows on a screen", () => {
    const grid = stageGrid(208, WATCH_GRID_TOP_INSET, 1);
    // (248 - 34 + 2) / 17.5 = 12.3
    expect(rowsOnScreen(grid, 248)).toBe(12);
    expect(rowsOnScreen(stageGrid(208, 0, 1.5), 248 * 1.5)).toBe(14);
    expect(rowsOnScreen(grid, 10)).toBe(1);
  });

  it("draws spare rows below the lowest tile, a screen at least, and grows with a gesture", () => {
    expect(stageRows(0, 12)).toBe(12);
    expect(stageRows(20, 12)).toBe(20 + STAGE_SPARE_ROWS);
    expect(stageRows(10, 12)).toBe(13);
    expect(stageRows(10, 12, 18)).toBe(18 + STAGE_SPARE_ROWS);
    expect(stageRows(10, 12, 2)).toBe(13);
  });

  it("draws every cell of every row as one path", () => {
    const grid = stageGrid(208, 0, 1);
    const square = cellsPath(grid, 2, 0);
    expect(square.match(/M/g)).toHaveLength(24);
    expect(square.startsWith("M0 0h15.5v15.5h-15.5z")).toBe(true);
    const round = cellsPath(grid, 1, 3);
    expect(round.match(/M/g)).toHaveLength(12);
    expect(round.startsWith("M3 0h9.5a3 3 0 0 1 3 3v9.5")).toBe(true);
    expect(cellsPath(grid, 0, 3)).toBe("");
  });
});

describe("dragging a page row", () => {
  // Three rows 40 pixels high: middles at 20, 60 and 100.
  const middles = [20, 60, 100];

  it("lands before the first row whose middle is under the pointer", () => {
    expect(listDropIndex(middles, 5)).toBe(0);
    expect(listDropIndex(middles, 21)).toBe(1);
    expect(listDropIndex(middles, 70)).toBe(2);
    expect(listDropIndex(middles, 140)).toBe(3);
    expect(listDropIndex([], 10)).toBe(0);
  });

  it("turns the landing place into the index moveWatchPage takes", () => {
    // Row 0 dropped under row 1 (drop 2) becomes index 1; dropped on its own
    // place it stays.
    expect(listMoveIndex(0, 2)).toBe(1);
    expect(listMoveIndex(0, 0)).toBe(0);
    expect(listMoveIndex(0, 1)).toBe(0);
    expect(listMoveIndex(2, 0)).toBe(0);
    expect(listMoveIndex(1, 3)).toBe(2);
    const document = { pages: [{ id: "A" }, { id: "B" }, { id: "C" }] };
    const moved = moveWatchPage(document, "A", listMoveIndex(0, 3));
    expect(listedWatchPages(moved).map((p) => p.id)).toEqual(["B", "C", "A"]);
  });
});

describe("the flat layout", () => {
  const page = {
    items: [
      { id: "H1", entityId: "divider.label.light", gridCol: 0, gridRow: 0, colSpan: 12, rowSpan: 1 },
      { id: "L", entityId: "light.a", gridCol: 0, gridRow: 1, colSpan: 6, rowSpan: 4 },
      { id: "H2", entityId: "divider.line.switch", gridCol: 0, gridRow: 8, colSpan: 12, rowSpan: 1 },
      { id: "S", entityId: "switch.b", gridCol: 3, gridRow: 9, colSpan: 3, rowSpan: 3 },
    ],
  };

  it("pulls nothing up at headers", () => {
    const flat = watchPageLayout(page, SCREEN, { flat: true });
    expect(flat.tiles.map((t) => t.y)).toEqual([0, 17.5, 8 * 17.5, 9 * 17.5]);
    expect(flat.tiles[3]!.x).toBeCloseTo(3 * 17.5);
    // The grid is the screen, or the lowest tile when that is lower.
    expect(flat.contentHeight).toBe(248);
    expect(flat.height).toBe(WATCH_GRID_TOP_INSET + 248);
  });

  it("leaves the watch's own arithmetic as it was", () => {
    const watch = watchPageLayout(page, SCREEN);
    const u = watch.unit;
    expect(watch.tiles[0]!.y).toBeCloseTo(-0.6 * u);
    expect(watch.tiles[3]!.y).toBeCloseTo(9 * 17.5 - u);
    expect(watchPageLayout(page, SCREEN, { flat: false }).tiles[3]!.y).toBeCloseTo(9 * 17.5 - u);
  });

  it("tells a page with a header from one without", () => {
    expect(watchPageHasHeader(page)).toBe(true);
    expect(watchPageHasHeader({ items: [{ entityId: "light.a" }] })).toBe(false);
    expect(watchPageHasHeader({})).toBe(false);
  });
});
