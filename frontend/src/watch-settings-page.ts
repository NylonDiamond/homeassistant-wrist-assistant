// Watch settings as a page of the Watch app tab: its address, and the rules
// the page follows that can be worked out without the panel. The drawing is
// the `WatchSettings` controller (`watch-settings-view.ts`), which the panel
// draws as the page body on this route.
//
// The page lives at `/settings`, and `/settings/<owner_watch_id>` opens it on
// one watch, the way every other watch screen's address names its watch.

import type { PanelRoute } from "./watch-pages/hook.js";

export const WATCH_SETTINGS_PATH = "/settings";

export function isWatchSettingsRoute(route: PanelRoute | undefined): boolean {
  const path = route?.path ?? "";
  return path === WATCH_SETTINGS_PATH || path.startsWith(`${WATCH_SETTINGS_PATH}/`);
}

/** The watch the address opens the page on: the first segment after
 * `/settings/`, decoded. None, or one that does not decode, gives nothing. */
export function watchSettingsRouteOwner(route: PanelRoute | undefined): string | undefined {
  const path = route?.path ?? "";
  const lead = `${WATCH_SETTINGS_PATH}/`;
  if (!path.startsWith(lead)) return undefined;
  const segment = path.slice(lead.length).split("/")[0] ?? "";
  if (segment === "") return undefined;
  try {
    const owner = decodeURIComponent(segment);
    return owner === "" ? undefined : owner;
  } catch {
    return undefined;
  }
}

/** ⌘S or Ctrl+S on the page: the panel draws it, so the panel saves it.
 * Every other watch screen is an element that saves on the key itself. */
export function settingsPageSavesOnKey(route: PanelRoute | undefined, e: Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey">): boolean {
  return (e.metaKey || e.ctrlKey) && e.key === "s" && isWatchSettingsRoute(route);
}

/**
 * What the page does about the watch it is handed, each time the panel
 * draws it.
 *
 * - `load`: read this watch's records. On the way onto the page (it was not
 *   on screen), and whenever the handed watch is not the one shown. Coming
 *   back reads again, so a save made meanwhile (Rooms writes the same
 *   record) is the copy the kept edits sit on.
 * - `clear`: no watch to show (a home with none yet): only the pairing card.
 * - `stay`: on screen already, on this watch.
 *
 * `target` is the watch to show, undefined for none. While the device list
 * is not in yet the panel hands nothing at all, so a home with watches never
 * flashes the "no watch" card first.
 */
export function settingsPageStep(active: boolean, shown: string | undefined, target: string | undefined): "load" | "clear" | "stay" {
  if (target === undefined) return active && shown === undefined ? "stay" : "clear";
  return active && shown === target ? "stay" : "load";
}

/** The narrowest a column of cards may be, CSS px, the widest it grows to,
 * and the most columns the page lays out. */
export const SETTINGS_COLUMN = { min: 460, max: 620, most: 4 } as const;
/** The page's side padding (each side) and the gap between columns, CSS px. */
export const SETTINGS_PAGE_PAD = 16;
export const SETTINGS_COLUMN_GAP = 20;

/** How many columns of cards fit across a page `width` CSS px wide: as many
 * as keep each at least `SETTINGS_COLUMN.min`, from one up to
 * `SETTINGS_COLUMN.most`. A page not measured yet has one. */
export function settingsColumnCount(width: number): number {
  if (!(width > 0)) return 1;
  const room = width - 2 * SETTINGS_PAGE_PAD + SETTINGS_COLUMN_GAP;
  const fit = Math.floor(room / (SETTINGS_COLUMN.min + SETTINGS_COLUMN_GAP));
  return Math.max(1, Math.min(SETTINGS_COLUMN.most, fit));
}

/** The widest the cards' block grows for `count` columns, CSS px, padding
 * included: past it the block stays centred rather than stretching each card.
 * One column is as wide as the dialog the page replaced. */
export function settingsPageWidth(count: number): number {
  const columns = count * SETTINGS_COLUMN.max + (count - 1) * SETTINGS_COLUMN_GAP + 2 * SETTINGS_PAGE_PAD;
  return Math.max(SETTINGS_ONE_COLUMN, columns);
}

/** The width of the page's single column, padding included, CSS px. */
export const SETTINGS_ONE_COLUMN = 720;

/**
 * Deal the cards into `count` columns: each card, in order, goes to the
 * column that is shortest so far by the guessed heights in `weights` (the
 * leftmost on a tie). Each column keeps the cards' order, so a column reads
 * top to bottom as the catalog does. Gives the indexes for each column;
 * a column can come back empty when there are fewer cards than columns.
 */
export function dealColumns(weights: readonly number[], count: number): number[][] {
  const n = Math.max(1, Math.floor(count));
  const columns: number[][] = Array.from({ length: n }, () => []);
  const heights = new Array<number>(n).fill(0);
  weights.forEach((weight, index) => {
    let at = 0;
    for (let c = 1; c < n; c++) if (heights[c]! < heights[at]!) at = c;
    columns[at]!.push(index);
    heights[at] = (heights[at] ?? 0) + Math.max(0, weight);
  });
  return columns;
}

/** Whether Save can run: something changed, nothing else is running, and
 * each record with changes is one that exists to be saved over (a watch with
 * no record is started by "Start with the defaults" instead). */
export function settingsCanSave(input: {
  behaviorChanges: number;
  styleChanges: number;
  busy: boolean;
  behaviorHeld: boolean;
  styleHeld: boolean;
}): boolean {
  return input.behaviorChanges + input.styleChanges > 0 && !input.busy
    && (input.behaviorChanges === 0 || input.behaviorHeld)
    && (input.styleChanges === 0 || input.styleHeld);
}
