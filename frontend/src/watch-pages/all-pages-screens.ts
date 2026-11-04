// The Pages tab's words about a page's two screens: the one line under a
// page's name, the Screens differ filter, and the card that tells a home
// just updated that the watch and the iPhone can now be arranged apart.
//
// A page is one list of tiles; the watch and the iPhone each arrange it
// (`screens` in `model.ts`). The list says one fact per page, the first of
// these that holds: the page shows on one kind of device only, some tiles
// are off on the watch (or the iPhone), or the iPhone reads the tiles in
// another order or at other sizes. A tile the watch cannot draw (a map, a
// chart) is off on the watch on every page, so it is never counted.
// Spec: integration repo docs/ux-review-2026-10-31/pages-design-v4.md,
// "Pages list" and "What happens on update".

import { sameId } from "../library/model.js";
import type { LinkDevice } from "./devices.js";
import {
  type WatchPage,
  type WatchScreen,
  isSmartWatchPage,
  tileDrawsOn,
  tileOnScreen,
  watchPageTiles,
  watchScreensAlike,
} from "./model.js";

/** The tiles a screen could draw but has switched off. */
export function userOffTiles(page: WatchPage, screen: WatchScreen): number {
  return watchPageTiles(page).filter((t) => tileDrawsOn(t, screen) && !tileOnScreen(page, t, screen)).length;
}

/** Whether a page's screens differ, for the Screens differ filter: arranged
 * apart, or a tile switched off on one of them. A tile only the iPhone can
 * draw does not count: no page could put it on the watch. */
export function pageScreensDiffer(page: WatchPage): boolean {
  if (isSmartWatchPage(page)) return false;
  return !watchScreensAlike(page) || userOffTiles(page, "watch") > 0 || userOffTiles(page, "iphone") > 0;
}

/**
 * The kinds of device a page's card can draw, the watch first: those that
 * show the page, or, while none does, every kind the home has.
 */
export function cardScreens(owners: readonly string[], devices: readonly LinkDevice[]): WatchScreen[] {
  const kinds = (list: readonly LinkDevice[]) => (["watch", "iphone"] as const).filter((kind) => list.some((d) => d.kind === kind));
  const on = kinds(devices.filter((d) => owners.some((o) => sameId(o, d.ownerId))));
  return on.length > 0 ? on : kinds(devices);
}

/** The one screen a card draws: the one picked on it while the page still
 * shows there, else the first the card can draw. */
export function cardShownScreen(kinds: readonly WatchScreen[], picked: WatchScreen | undefined): WatchScreen {
  return picked !== undefined && kinds.includes(picked) ? picked : (kinds[0] ?? "watch");
}

/** "1 tile" or "3 tiles". */
const tilesText = (n: number): string => `${n} ${n === 1 ? "tile" : "tiles"}`;

/**
 * The one line under a page's name, or undefined when both screens match.
 * `owners` are the page's devices; `devices` every device of the home. Watch
 * only and iPhone only are said only in a home that has both kinds, and only
 * for a page some device shows.
 */
export function pageScreensLine(page: WatchPage, owners: readonly string[], devices: readonly LinkDevice[]): string | undefined {
  const kinds = new Set(devices.map((d) => d.kind));
  const on = new Set(devices.filter((d) => owners.some((o) => sameId(o, d.ownerId))).map((d) => d.kind));
  if (kinds.size > 1 && on.size === 1) return on.has("watch") ? "Watch only" : "iPhone only";
  if (isSmartWatchPage(page)) return undefined;
  const offWatch = userOffTiles(page, "watch");
  if (offWatch > 0) return `${tilesText(offWatch)} off on the watch`;
  const offPhone = userOffTiles(page, "iphone");
  if (offPhone > 0) return `${tilesText(offPhone)} off on the iPhone`;
  return watchScreensAlike(page) ? undefined : "iPhone arranged differently";
}

/** The list's two filters: every page, or the pages whose screens differ. */
export type PagesScreensFilter = "all" | "differ";

export const SCREENS_DIFFER_TEXT = "Screens differ";

/** The pages a filter keeps. */
export function keepsPage(filter: PagesScreensFilter, page: WatchPage): boolean {
  return filter === "all" || pageScreensDiffer(page);
}

/** What the list says when Screens differ keeps no page. */
export const NO_SCREENS_DIFFER_TEXT = "Every page is arranged the same on the watch and the iPhone.";

// ── the card after the update ─────────────────────────────────────────────

/** The card's words, once, on the Pages tab. */
export const TWO_SCREENS_CARD_TEXT = "Watch and iPhone can now be arranged apart. Nothing has changed on your devices.";

/** Where this browser remembers the card was dismissed. */
export const TWO_SCREENS_CARD_KEY = "wa-pages-two-screens-card-dismissed";

type ReadStore = Pick<Storage, "getItem">;
type WriteStore = Pick<Storage, "setItem">;

function storageOr<T>(storage: T | undefined): T | undefined {
  if (storage !== undefined) return storage;
  try {
    return globalThis.localStorage as unknown as T | undefined;
  } catch {
    return undefined;
  }
}

/** Dismissed while the panel is open, for a browser with storage off. */
let dismissedHere = false;

/** Whether the card was dismissed in this browser. */
export function twoScreensCardDismissed(storage?: ReadStore): boolean {
  if (dismissedHere) return true;
  try {
    return storageOr(storage)?.getItem(TWO_SCREENS_CARD_KEY) === "1";
  } catch {
    return false;
  }
}

/** Dismiss the card for good in this browser. */
export function dismissTwoScreensCard(storage?: WriteStore): void {
  dismissedHere = true;
  try {
    storageOr(storage)?.setItem(TWO_SCREENS_CARD_KEY, "1");
  } catch {
    /* Storage off: dismissed while the panel is open. */
  }
}

/** For tests: forget a dismiss made with storage off. */
export function resetTwoScreensCardForTest(): void {
  dismissedHere = false;
}
