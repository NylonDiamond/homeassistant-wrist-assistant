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

/** The screen's two lists: the designs on the watch, and every other one. */
export interface WatchComplicationSplit<T> {
  on: PickerListRow<T>[];
  off: PickerListRow<T>[];
}

/**
 * The rows split by whether the watch draws them. A design on this watch and
 * on a phone is on this watch. Under "Not on this watch", designs on another
 * device come before the ones on no device at all (Unassigned), and the order
 * is otherwise the order they came in.
 */
export function splitForWatch<T>(rows: readonly PickerListRow<T>[], watchId: string | undefined): WatchComplicationSplit<T> {
  const isOn = (row: PickerListRow<T>) => watchId !== undefined && row.copies.some((c) => c.ownerId === watchId);
  const on = rows.filter(isOn);
  const rest = rows.filter((row) => !isOn(row));
  const off = [...rest.filter((row) => !isShelvedRow(row)), ...rest.filter((row) => isShelvedRow(row))];
  return { on, off };
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
    padding: clamp(16px, 3vh, 28px) clamp(16px, 4vw, 40px) 48px;
    background: var(--wa-bg); color: var(--wa-ink);
  }
  .wc-wrap { width: min(1400px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
  .wc-head { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px 16px; padding: 0 2px; }
  .wc-head-text { flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .wc-head h1 { margin: 0; font-size: 22px; font-weight: 600; letter-spacing: -.02em; }
  .wc-lead { margin: 0; font-size: 14px; color: var(--wa-muted); }
  .wc-acts { display: flex; flex-wrap: wrap; gap: 8px; }
  .wc-sec {
    display: flex; flex-direction: column; gap: 12px; padding: 14px;
    border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-lg); background: var(--wa-card);
  }
  .wc-sec-top { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; }
  .wc-sec-top h2 {
    margin: 0; font-size: 12px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-label);
  }
  .wc-sec-count { font-size: 12px; color: var(--wa-muted); }
  .wc-sec-note { margin: 0; font-size: 12.5px; color: var(--wa-muted); }
  .wc-dev { display: flex; flex-direction: column; gap: 8px; }
  .wc-dev + .wc-dev { margin-top: 6px; }
  .wc-dev-name { display: flex; align-items: center; gap: 6px; margin: 0; font-size: 13px; font-weight: 600; color: var(--wa-ink); }
  .wc-dev-name svg.ui-icon { width: 14px; height: 14px; color: var(--wa-muted); }
  .wc-empty { padding: 18px 4px; font-size: 13px; color: var(--wa-muted); }
  /* The other designs are a step quieter, so the watch's own read first. A
     card under the pointer or with its menu open comes up to full. */
  .wc-sec.off .pk-card:not(:hover):not(.over) { opacity: .62; }
  @media (max-width: 640px) {
    .wc-page { padding: 14px 12px 32px; }
    .wc-sec { padding: 10px; }
  }
`;
