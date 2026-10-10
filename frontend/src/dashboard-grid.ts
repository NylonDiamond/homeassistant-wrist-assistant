// The Home Assistant sections grid a Dashboard design is sized against.
//
// Its own tiny module because the dashboard card's loader answers
// `getGridOptions` before any drawing code has loaded, and that loader is
// fetched on every dashboard page for every user. `model.ts` re-exports all of
// it, so the panel reads it from there like every other model helper.

/** A width and a height in points. */
export interface GridBox {
  width: number;
  height: number;
}

/** The Home Assistant sections grid a dashboard card sits on: 12 columns to a
 * section, rows 56 px high, 8 px between both. The column width is the one a
 * section about 500 px wide gives, which is the default on a desktop. */
export const DASHBOARD_GRID = { columns: 12, columnWidth: 34, rowHeight: 56, gap: 8 } as const;

/** The canvas a card spanning `columns` by `rows` of the sections grid has. */
export function dashboardCanvasFor(columns: number, rows: number): GridBox {
  const g = DASHBOARD_GRID;
  return {
    width: columns * g.columnWidth + (columns - 1) * g.gap,
    height: rows * g.rowHeight + (rows - 1) * g.gap,
  };
}

/** The grid cells a canvas covers, rounded to the nearest and kept to 1...12
 * columns and at least one row. The card's `getGridOptions` reads this. */
export function dashboardGridFor(canvas: GridBox): { columns: number; rows: number } {
  const g = DASHBOARD_GRID;
  const columns = Math.round((canvas.width + g.gap) / (g.columnWidth + g.gap));
  const rows = Math.round((canvas.height + g.gap) / (g.rowHeight + g.gap));
  return { columns: Math.min(g.columns, Math.max(1, columns)), rows: Math.max(1, rows) };
}
