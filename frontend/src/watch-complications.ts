// The Watch app's Complications screen: the home's complications seen from
// one watch. The ones on the shared watch come first, then every other design
// under "Not on this watch", so adding one to this watch is a tick in its
// card's Devices menu rather than a hunt through the Complications tab.
//
// The screen edits nothing itself. Its cards are the Complications tab's
// cards (`renderPickerCard` in panel.ts), and opening one moves to that tab,
// where the editor is. What can be worked out without the panel lives here,
// where a test can reach it.
//
// The address names the watch like every per-watch screen:
// `/watch-complications/<owner_watch_id>`. It is not `/complications/...`,
// which is the Complications tab's own.

import { css } from "lit";
import { type PickerListRow, isShelvedRow } from "./pickerRows.js";
import type { PanelRoute } from "./watch-pages/hook.js";

export const WATCH_COMPLICATIONS_PATH = "/watch-complications";

export function isWatchComplicationsRoute(route: PanelRoute | undefined): boolean {
  const path = route?.path ?? "";
  return path === WATCH_COMPLICATIONS_PATH || path.startsWith(`${WATCH_COMPLICATIONS_PATH}/`);
}

/** The watch the address names, or undefined with none. */
export function watchComplicationsRouteOwner(route: PanelRoute | undefined): string | undefined {
  const path = route?.path ?? "";
  const lead = `${WATCH_COMPLICATIONS_PATH}/`;
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

/** One card under "Not on this watch": the design, and the device whose
 * copy the card draws. */
export interface OffWatchCard<T> {
  row: PickerListRow<T>;
  at: string;
}

/** The screen's two lists: the designs on the watch, and the other watch
 * designs. */
export interface WatchComplicationSplit<T> {
  on: PickerListRow<T>[];
  off: OffWatchCard<T>[];
}

/** What the split needs to know about devices and designs. */
export interface WatchSplitRules<T> {
  /** Whether a device is a watch. */
  isWatch: (ownerId: string) => boolean;
  /** Whether a design on no device (Unassigned) has a shape a watch draws. */
  shelfFitsWatch: (row: PickerListRow<T>) => boolean;
}

/**
 * The rows split by whether the watch draws them. A design on this watch and
 * on a phone is on this watch. "Not on this watch" holds only watch designs:
 * one on another watch, drawn as that watch's copy, then one on no device
 * with a watch shape. A design only on phones is left out: an iPhone widget
 * is no use to a watch. Otherwise the order is the order they came in.
 */
export function splitForWatch<T>(
  rows: readonly PickerListRow<T>[],
  watchId: string | undefined,
  rules: WatchSplitRules<T>,
): WatchComplicationSplit<T> {
  const isOn = (row: PickerListRow<T>) => watchId !== undefined && row.copies.some((c) => c.ownerId === watchId);
  const on = rows.filter(isOn);
  const onWatches: OffWatchCard<T>[] = [];
  const shelved: OffWatchCard<T>[] = [];
  for (const row of rows) {
    if (isOn(row)) continue;
    const watchCopy = row.copies.find((c) => rules.isWatch(c.ownerId));
    if (watchCopy) onWatches.push({ row, at: watchCopy.ownerId });
    else if (isShelvedRow(row) && rules.shelfFitsWatch(row)) shelved.push({ row, at: row.open.ownerId });
  }
  return { on, off: [...onWatches, ...shelved] };
}

/** The line under the screen's title. */
export function watchComplicationsLead(on: number, watchName: string): string {
  if (on === 0) return `Nothing is on ${watchName} yet. Open a card's Devices menu to add it here.`;
  return `${on} ${on === 1 ? "complication is" : "complications are"} on ${watchName}.`;
}

/** The note under "Not on this watch". */
export const NOT_ON_WATCH_NOTE = "Open a card's Devices menu and tick this watch to add it here.";

/** The screen's look, added to the panel's sheet. The cards and their shape
 * boxes are the Complications tab's own rules (`pk-*` in panel.ts); this is
 * only the page round them. */
export const watchComplicationsStyles = css`
  .wc-page {
    flex: 1 1 auto; min-height: 0; overflow: auto; box-sizing: border-box;
    padding: 14px clamp(12px, 3vw, 28px) 40px;
    background: var(--wa-bg); color: var(--wa-ink);
  }
  .wc-wrap { width: min(1400px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
  .wc-head { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px 16px; padding: 0 2px; }
  .wc-head-text { flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .wc-head h1 { margin: 0; font-size: 19px; font-weight: 600; letter-spacing: -.02em; }
  .wc-lead { margin: 0; font-size: 13px; color: var(--wa-muted); }
  .wc-acts { display: flex; flex-wrap: wrap; gap: 8px; }
  /* Each list is a card with a lit outline in its own hue (the recipe of
     \`litOutline\` in editor-chrome.ts): green for what is on the watch, red
     for what is not. */
  .wc-sec {
    --c: var(--wa-line-strong);
    display: flex; flex-direction: column; gap: 10px; padding: 0 12px 12px; overflow: hidden;
    border-radius: var(--wa-r-lg);
    background:
      linear-gradient(var(--wa-card), var(--wa-card)) padding-box,
      linear-gradient(140deg, var(--c) 0%, color-mix(in srgb, var(--c) 45%, transparent) 30%,
        color-mix(in srgb, var(--c) 30%, var(--wa-line-strong)) 62%, color-mix(in srgb, var(--c) 35%, transparent) 100%) border-box;
    border: 2px solid transparent;
  }
  .wc-sec.on { --c: var(--wa-hue-green); }
  .wc-sec.off { --c: var(--wa-hue-red); }
  /* Compact cards: as many columns as fit, each sized to its shape, small
     names and tight padding. Two classes deep, so the Complications tab's
     fixed column counts do not win it back. */
  .wc-page .pk-boxes { gap: 10px; }
  .wc-page .pk-box-top { margin-bottom: 5px; }
  .wc-page .pk-grid { grid-template-columns: repeat(auto-fill, minmax(128px, 1fr)); gap: 6px; }
  .wc-page .pk-grid:is([data-shape="rectangular"], [data-shape="inline"]) {
    grid-template-columns: repeat(auto-fill, minmax(176px, 1fr));
  }
  .wc-page .pk-grid[data-shape="circular"] { grid-template-columns: repeat(auto-fill, minmax(112px, 1fr)); }
  .wc-page .pk-card { padding: 6px; border-radius: 8px; }
  .wc-page .pk-card-top { margin-bottom: 5px; min-height: 16px; gap: 5px; }
  .wc-page .pk-card-name { font-size: 11.5px; }
  /* Each list's head is a band across the card's top, washed in its hue from
     the left: a chip with a tick or a plus, the name large, a line on what
     the list is, and the count in a pill of the same hue. */
  .wc-sec-top {
    display: flex; align-items: center; gap: 12px; margin: 0 -12px; padding: 12px 14px;
    background: linear-gradient(90deg, color-mix(in srgb, var(--c) 16%, transparent), transparent 70%);
    border-bottom: 1px solid color-mix(in srgb, var(--c) 28%, var(--wa-line));
  }
  .wc-sec-chip {
    flex: none; display: grid; place-items: center; width: 32px; height: 32px; box-sizing: border-box; border-radius: 9px;
    color: var(--c); border: 1.5px solid var(--c); background: color-mix(in srgb, var(--c) 12%, transparent);
  }
  .wc-sec-chip svg.ui-icon { width: 17px; height: 17px; }
  .wc-sec-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .wc-sec-top h2 { margin: 0; font-size: 17px; font-weight: 600; letter-spacing: -.01em; color: var(--wa-ink); }
  .wc-sec-count {
    flex: none; min-width: 30px; box-sizing: border-box; padding: 3px 10px; border-radius: 999px; text-align: center;
    font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums;
    color: var(--c); border: 1px solid color-mix(in srgb, var(--c) 60%, transparent);
  }
  .wc-sec-note { margin: 0; font-size: 12.5px; color: var(--wa-muted); }
  .wc-dev { display: flex; flex-direction: column; gap: 8px; }
  .wc-dev + .wc-dev { margin-top: 6px; }
  .wc-dev-name { display: flex; align-items: center; gap: 6px; margin: 0; font-size: 13px; font-weight: 600; color: var(--wa-ink); }
  .wc-dev-name svg.ui-icon { width: 14px; height: 14px; color: var(--wa-muted); }
  .wc-empty { padding: 18px 4px; font-size: 13px; color: var(--wa-muted); }
  /* The other designs are a step quieter, so the watch's own read first. A
     card under the pointer or with its menu open comes up to full. */
  .wc-sec.off .pk-card:not(:hover):not(.over) { opacity: .75; }
  @media (max-width: 640px) {
    .wc-page { padding: 14px 12px 32px; }
    .wc-sec { padding: 0 10px 10px; }
    .wc-sec-top { margin: 0 -10px; padding: 10px 12px; }
  }
`;
