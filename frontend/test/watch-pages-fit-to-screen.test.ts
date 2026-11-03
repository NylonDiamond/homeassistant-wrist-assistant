// A page's Fit to screen switch, in the On the iPhone card: on writes
// `fitToScreen: true`, off removes the key, which the iPhone reads as off.
// Every other key stays.

import { describe, expect, it } from "vitest";

import { findWatchPage } from "../src/watch-pages/edit.js";
import type { WatchPage, WatchPagesDocument } from "../src/watch-pages/model.js";
import {
  fitDrawnRowSpan,
  fitDrawnTile,
  fitDropsArrange,
  fitPageRows,
  fitRowKinds,
  fitRowsOf,
  fitRowTop,
  fitState,
  fitStateWords,
  fittedLayout,
  type FitRowKind,
} from "../src/watch-pages/fit-rows.js";
import { watchPageLayout, type WatchPageTile } from "../src/watch-pages/model.js";
import { cellAtPx, cellDelta, cellRectPx, cellsPath, nearestCell, rowsOnScreen, rowTopPx, stageGrid, withFitRows } from "../src/watch-pages/stage.js";
import { setWatchPageFitToScreen } from "../src/watch-pages/page-settings-model.js";

const PAGE = "C3A0E000-0000-4000-8000-0000000000AC";

function doc(extra: Record<string, unknown> = {}): WatchPagesDocument {
  return {
    schemaVersion: 1,
    pages: [{ hideFromSwitcher: false, id: PAGE, items: [], name: "TV", ...extra }],
  };
}

const pageOf = (d: WatchPagesDocument): WatchPage => findWatchPage(d, PAGE)!;

describe("the page's Fit to screen switch", () => {
  it("writes true when on and removes the key when off", () => {
    const on = setWatchPageFitToScreen(doc(), PAGE, true);
    expect(pageOf(on).fitToScreen).toBe(true);
    const off = setWatchPageFitToScreen(on, PAGE, false);
    expect(Object.hasOwn(pageOf(off), "fitToScreen")).toBe(false);
  });

  it("keeps every other key", () => {
    const on = setWatchPageFitToScreen(doc({ switcherText: "Remote", odd: 7 }), PAGE, true);
    expect(pageOf(on)).toMatchObject({ switcherText: "Remote", odd: 7, name: "TV" });
  });
});

const kinds = (tile: number, empty = 0): FitRowKind[] => [...Array<FitRowKind>(tile).fill("tile"), ...Array<FitRowKind>(empty).fill("empty")];
const total = (rows: { heights: number[]; tileRow: number }): number => fitRowTop(rows, rows.heights.length) - 2;

/** A page of `rows` rows of three tiles, each 4 columns by 3 rows. */
function remote(rows: number): WatchPage {
  const items: Record<string, unknown>[] = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      items.push({ entityId: `light.r${r}c${c}`, gridRow: r * 3, gridCol: c * 4, colSpan: 4, rowSpan: 3 });
    }
  }
  return { hideFromSwitcher: false, id: PAGE, name: "TV", items, fitToScreen: true } as unknown as WatchPage;
}

// The same cases as `FitToScreenTests` in the app repo: the two must agree.
describe("Fit to screen's rows", () => {
  it("leaves a page that already fits", () => {
    expect(fitRowsOf(kinds(10), 3, 0, 30, 1000)).toBeUndefined();
  });

  it("makes a tall page's rows shorter until they fit", () => {
    const rows = fitRowsOf(kinds(28), 4, 0, 30, 700)!;
    expect(rows.tileRow).toBeLessThan(30);
    expect(total(rows)).toBeLessThanOrEqual(700);
    expect((rows.tileRow + 0.5) * 28 + 27 * 2).toBeGreaterThan(700);
  });

  it("takes room from empty rows before any tile", () => {
    const rows = fitRowsOf(kinds(10, 2), 3, 0, 30, 360)!;
    expect(rows.tileRow).toBe(30);
    expect(rows.heights[10]).toBe(19);
  });

  it("stops empty rows at their floor, then shrinks tiles", () => {
    const rows = fitRowsOf(kinds(10, 2), 3, 0, 30, 300)!;
    expect(rows.heights[10]).toBe(7.5);
    expect(rows.tileRow).toBeLessThan(30);
    expect(total(rows)).toBeLessThanOrEqual(300);
  });

  it("keeps a header row's height", () => {
    const rows = fitRowsOf(["header", ...kinds(27)], 3, 1, 30, 700)!;
    expect(rows.heights[0]).toBe(30);
    expect(rows.tileRow).toBeLessThan(30);
    expect(total(rows) - 18).toBeLessThanOrEqual(700);
  });

  it("lets tall tiles take far shorter rows", () => {
    const rows = fitRowsOf(kinds(58), 4, 0, 29, 640)!;
    expect(rows.tileRow).toBe(9);
    expect(fitRowTop(rows, 4) - 2).toBe(42);
  });

  it("gives up when a tile would go too short", () => {
    expect(fitRowsOf(kinds(37), 1, 0, 30, 630)).toBeUndefined();
    expect(fitRowsOf(kinds(37), 2, 0, 30, 630)).toBeDefined();
  });

  it("fits the remote page that asked for this, as short tiles", () => {
    const rows = fitRowsOf(kinds(35, 2), 2, 0, 28.9, 612)!;
    expect(rows.tileRow).toBeGreaterThanOrEqual(13);
    expect(total(rows)).toBeLessThanOrEqual(612);
    const tile = fitRowTop(rows, 3) - 2;
    expect(fitDrawnRowSpan(tile, 28.9)).toBeLessThan(4);
  });

  it("reads a spacer as an empty row and a divider as a header", () => {
    const page = { hideFromSwitcher: false, id: PAGE, name: "TV", items: [
      { entityId: "light.a", gridRow: 0, gridCol: 0, colSpan: 4, rowSpan: 2 },
      { entityId: "spacer.a", gridRow: 2, gridCol: 0, colSpan: 4, rowSpan: 2 },
      { entityId: "divider.a", gridRow: 4, gridCol: 0, colSpan: 12, rowSpan: 1 },
    ] } as unknown as WatchPage;
    expect(fitRowKinds(page)).toEqual(["tile", "tile", "empty", "empty", "header"]);
  });
});

describe("a fitted layout", () => {
  const screen = { width: 370, height: 600 };

  it("keeps each tile's width and fits every row", () => {
    const page = remote(10);
    const layout = watchPageLayout(page, screen);
    const fitted = fittedLayout(layout, page, 500);
    expect(fitted.tiles[0]!.width).toBe(layout.tiles[0]!.width);
    expect(fitted.tiles[0]!.height).toBeLessThan(layout.tiles[0]!.height);
    const last = fitted.tiles[fitted.tiles.length - 1]!;
    expect(last.y + last.height).toBeLessThanOrEqual(500);
  });

  it("draws a squashed tile as the rows it now looks like", () => {
    const page = remote(10);
    const fitted = fittedLayout(watchPageLayout(page, screen), page, 500);
    expect((fitted.tiles[0]!.tile as { rowSpan: number }).rowSpan).toBeLessThan(3);
  });

  it("takes the Custom layout off a tile squashed to a strip", () => {
    expect(fitDropsArrange(4, 1)).toBe(true);
    expect(fitDropsArrange(4, 3)).toBe(true);
    expect(fitDropsArrange(6, 4)).toBe(false);
    expect(fitDropsArrange(3, 3)).toBe(false);
    const page = remote(10);
    const first = (page as unknown as { items: Record<string, unknown>[] }).items[0]!;
    first.arrange = { v: 1, parts: { icon: { scale: 1.5 } } };
    const fitted = fittedLayout(watchPageLayout(page, screen), page, 500);
    expect(Object.hasOwn(fitted.tiles[0]!.tile, "arrange")).toBe(false);
    expect(Object.hasOwn(first, "arrange")).toBe(true);
  });

  it("draws a squashed tile from a copy that knows its height", () => {
    const tile = { entityId: "home_map.a", gridRow: 0, gridCol: 0, colSpan: 12, rowSpan: 6 } as unknown as WatchPageTile;
    const drawn = fitDrawnTile(tile, 64, 29);
    expect(drawn).toMatchObject({ rowSpan: 2, fittedCellHeight: 64 });
    expect(tile).not.toHaveProperty("fittedCellHeight");
    // Its rows did not get shorter: the tile itself.
    expect(fitDrawnTile(tile, 6 * 29 + 5 * 2, 29)).toBe(tile);
  });

  it("leaves a page it cannot fit alone", () => {
    const page = remote(40);
    const layout = watchPageLayout(page, screen);
    expect(fittedLayout(layout, page, 500)).toBe(layout);
    expect(fitPageRows(page, layout.unit, 500)).toBeUndefined();
  });
});

describe("what the panel says of a fit", () => {
  const unit = 28.9;

  it("says when it fits, squashes or scrolls", () => {
    expect(fitState(remote(2), unit, 600).kind).toBe("fits");
    expect(fitState(remote(8), unit, 600)).toMatchObject({ kind: "squashed" });
    expect(fitState(remote(40), unit, 600).kind).toBe("scrolls");
  });

  it("says when only the empty rows give", () => {
    const page = { hideFromSwitcher: false, id: PAGE, name: "TV", items: [
      { entityId: "light.a", gridRow: 0, gridCol: 0, colSpan: 12, rowSpan: 18 },
      { entityId: "light.b", gridRow: 20, gridCol: 0, colSpan: 12, rowSpan: 1 },
    ] } as unknown as WatchPage;
    expect(fitState(page, 30, 21 * 30 + 20 * 2 - 10).kind).toBe("empty-rows");
  });

  it("has words for each", () => {
    expect(fitStateWords({ kind: "squashed", share: 0.48 })).toContain("48%");
    expect(fitStateWords({ kind: "scrolls" })).toContain("scrolls as normal");
  });
});

describe("the edit stage on fitted rows", () => {
  const rows = { heights: [10, 10, 5, 10], tileRow: 10 };
  const grid = withFitRows(stageGrid(370, 3, 2, 0), rows);

  it("places a tile on its row's height", () => {
    expect(rowTopPx(grid, 3)).toBe((10 + 2 + 10 + 2 + 5 + 2) * 2);
    const box = cellRectPx(grid, { col: 0, row: 1, colSpan: 4, rowSpan: 2 });
    expect(box.top).toBe(6 + 12 * 2);
    expect(box.height).toBe((10 + 2 + 5) * 2);
  });

  it("finds the cell under a point, gap and all", () => {
    expect(cellAtPx(grid, 1, 6 + 0).row).toBe(0);
    expect(cellAtPx(grid, 1, 6 + 23).row).toBe(0);
    expect(cellAtPx(grid, 1, 6 + 24).row).toBe(1);
    expect(cellAtPx(grid, 1, 6 + 50).row).toBe(2);
    // Past the known rows, at the tile row's height.
    expect(cellAtPx(grid, 1, 6 + rowTopPx(grid, 5) + 1).row).toBe(5);
    expect(cellAtPx(grid, 1, 0).row).toBe(-1);
  });

  it("takes the nearest row for a dragged corner", () => {
    expect(nearestCell(grid, 0, 6 + 11, 4).row).toBe(0);
    expect(nearestCell(grid, 0, 6 + 13, 4).row).toBe(1);
    expect(nearestCell(grid, 0, 0, 4).row).toBe(0);
  });

  it("reads a resize in tile rows, and the screen in fitted rows", () => {
    expect(cellDelta(grid, 0, 24).rows).toBe(1);
    expect(rowsOnScreen(grid, 6 + rowTopPx(grid, 4) - 4)).toBe(4);
  });

  it("draws each empty cell at its row's height", () => {
    const path = cellsPath(withFitRows(stageGrid(370, 0, 1, 0), rows), 3, 0);
    expect(path).toContain("v10h");
    expect(path).toContain("v5h");
  });

  it("is the old grid without fitted rows", () => {
    const plain = stageGrid(370, 3, 2, 0);
    expect(withFitRows(plain, undefined)).toBe(plain);
    expect(rowTopPx(plain, 3)).toBe(3 * plain.step);
  });
});
