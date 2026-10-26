// How many columns the page editor's inspector lays its cards in, and which
// cards go in each.
//
// The inspector keeps one width whether a tile is picked or not, so the stage
// never jumps; that width is measured, and as many columns of at least
// `INSPECTOR_COLUMN_MIN` as fit stand side by side, up to three. Cards keep
// their reading order: the first column holds the first cards, top to bottom.

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

/**
 * Split `items` into at most `count` runs, in order, so the heaviest run is
 * as light as it can be (each item's weight a rough height). Never an empty
 * run: fewer items than columns gives one run per item.
 */
export function splitColumns<T>(items: readonly T[], weight: (item: T) => number, count: number): T[][] {
  const n = Math.max(1, Math.min(Math.floor(count), items.length));
  if (items.length === 0) return [];
  if (n === 1) return [items.slice()];
  const w = items.map((item) => Math.max(0, weight(item)));
  const prefix = [0];
  for (const x of w) prefix.push(prefix[prefix.length - 1]! + x);
  const sum = (from: number, to: number) => prefix[to]! - prefix[from]!;
  // best[k][i]: the lightest heaviest run splitting the first i items into k
  // runs; cut[k][i]: where the last of those runs starts.
  const best: number[][] = [];
  const cut: number[][] = [];
  for (let k = 0; k <= n; k++) {
    best.push(new Array<number>(items.length + 1).fill(Infinity));
    cut.push(new Array<number>(items.length + 1).fill(0));
  }
  best[0]![0] = 0;
  for (let k = 1; k <= n; k++) {
    for (let i = k; i <= items.length; i++) {
      for (let j = k - 1; j < i; j++) {
        const heaviest = Math.max(best[k - 1]![j]!, sum(j, i));
        // Ties go to the later cut, so earlier columns take more.
        if (heaviest <= best[k]![i]!) {
          best[k]![i] = heaviest;
          cut[k]![i] = j;
        }
      }
    }
  }
  const runs: T[][] = [];
  let end = items.length;
  for (let k = n; k >= 1; k--) {
    const start = cut[k]![end]!;
    runs.unshift(items.slice(start, end));
    end = start;
  }
  return runs;
}
