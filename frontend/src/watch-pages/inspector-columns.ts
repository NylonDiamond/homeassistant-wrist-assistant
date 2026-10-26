// How many columns of at least `INSPECTOR_COLUMN_MIN` the page editor's
// inspector width holds, up to three, by its measured width.
//
// The cards themselves no longer go by this count: a tile's four groups and
// the page's own cards lay themselves out with CSS container queries on the
// inspector (`renderTileInspector`, `.pe-insp-cols`), so nothing is balanced
// in script. Only the editor's width observer still reads it.

/** The narrowest a column of cards reads well at. */
export const INSPECTOR_COLUMN_MIN = 360;

/** The gap between two columns, as `.pe-insp-cols` draws it. */
export const INSPECTOR_COLUMN_GAP = 14;

/** The most columns the inspector lays out. */
export const INSPECTOR_MAX_COLUMNS = 3;

/** How many columns fit an inspector body this wide: 1 to 3. */
export function inspectorColumnCount(width: number): number {
  if (!(width > 0)) return 1;
  const fit = Math.floor((width + INSPECTOR_COLUMN_GAP) / (INSPECTOR_COLUMN_MIN + INSPECTOR_COLUMN_GAP));
  return Math.max(1, Math.min(INSPECTOR_MAX_COLUMNS, fit));
}
