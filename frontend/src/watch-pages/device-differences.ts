// The lines under each picture of the page editor (app repo
// docs/pages_two_screens_plan_2026-11.md, step 2.4): the title, the status
// line and the "Not on the watch" chips, and the one toast a first drag or
// resize shows; the inspector's "Tile on" Watch and iPhone chips; and the
// "Watch only" badge on a tile of a picture that the other screen does not
// show. Each says one of the three things the two screens model says (a page
// is one list of tiles; each kind of device arranges it its own way; a tile
// can be off on one), and nothing else.
//
// The status line took the place of the old differences line ("Skips Map
// and Web. Cameras show a still picture."): what a kind leaves out is now
// the chips, and what an iPhone adds to a tile is the inspector's iPhone tag.

import type { PreviewKind } from "../library/item-mode.js";
import { joinNames } from "../copies.js";
import {
  type WatchPage,
  type WatchPageTile,
  type WatchScreen,
  isMapWatchPage,
  isSmartWatchPage,
  tileDrawsOn,
  tileOnScreen,
  watchScreensAlike,
  watchTilesOffScreen,
} from "./model.js";
import { WATCH_MAP_PAGE_WORDS } from "./map-page.js";

/** "watch" or "iPhone", as a sentence names the kind. */
export function screenWord(screen: WatchScreen | PreviewKind): string {
  return screen === "watch" ? "watch" : "iPhone";
}

/** "Watch" or "iPhone", as a title starts, and as the inspector's chip for
 * the screen is named. */
export function screenTitleWord(screen: WatchScreen): string {
  return screen === "watch" ? "Watch" : "iPhone";
}

/** The words in front of the inspector's Watch and iPhone chips. */
export const TILE_ON_TEXT = "Tile on";

/** "Watch only" or "iPhone only": a tile on that screen alone, as its badge
 * on the picture and a locked chip's tooltip say it. */
export function screenOnlyText(screen: WatchScreen): string {
  return `${screenTitleWord(screen)} only`;
}

/**
 * The tooltip of the inspector's chip for one screen: a click puts the tile
 * there or takes it off; a kind the screen cannot draw says which kind
 * draws it ("iPhone only") and why the chip does nothing.
 */
export function tileOnChipTitle(screen: WatchScreen, on: boolean, draws: boolean): string {
  const word = screenWord(screen);
  if (!draws) return `${screenOnlyText(screen === "watch" ? "iphone" : "watch")}. The ${word} cannot draw this kind of tile.`;
  return on ? `On the ${word}. Click to take it off the ${word}.` : `Not on the ${word}. Click to put it there.`;
}

/**
 * The ids (upper-cased) of the tiles on `screen` that are off on the other
 * one, a kind the other cannot draw included: each wears a small badge
 * naming `screen` on its picture ("Watch only"). Empty for a smart page and
 * a map page, which have no screens of their own. A tile with no id has no
 * badge.
 */
export function screenOnlyTileIds(page: WatchPage | undefined, screen: WatchScreen): Set<string> {
  const out = new Set<string>();
  if (page === undefined || isSmartWatchPage(page) || isMapWatchPage(page)) return out;
  for (const tile of watchTilesOffScreen(page, screen === "watch" ? "iphone" : "watch")) {
    if (typeof tile.id === "string" && tile.id !== "" && tileOnScreen(page, tile, screen)) out.add(tile.id.toUpperCase());
  }
  return out;
}

/** The title under a picture, after its device icon: the devices of that
 * kind that show the page ("Jesse's Watch, Chen's Watch"), or the kind while
 * none does. */
export function screenTitleText(screen: WatchScreen, names: readonly string[]): string {
  return names.length === 0 ? screenTitleWord(screen) : names.join(", ");
}

/** The status line under a picture: `text`, and the words of its one button
 * when there is one. */
export interface ScreenStatus {
  text: string;
  /** "Use the iPhone's order": copies the other screen's order onto this
   * one (`useOtherScreensOrder`). */
  useOther?: string;
}

/**
 * The status line under one screen's picture: "Same order as the iPhone",
 * or "Arranged differently" with "Use the iPhone's order". A map page says
 * how each kind draws it, with no button; a smart page, which fills itself,
 * has no line.
 */
export function screenStatus(page: WatchPage | undefined, screen: WatchScreen): ScreenStatus | undefined {
  if (page === undefined || isSmartWatchPage(page)) return undefined;
  if (isMapWatchPage(page)) return { text: screen === "watch" ? WATCH_MAP_PAGE_WORDS.watchDifference : WATCH_MAP_PAGE_WORDS.phoneDifference };
  const other = screenWord(screen === "watch" ? "iphone" : "watch");
  if (watchScreensAlike(page)) return { text: `Same order as the ${other}` };
  return { text: "Arranged differently", useOther: `Use the ${other}'s order` };
}

/** One chip of a screen's "Not on the watch" line. */
export interface ScreenOffChip {
  tile: WatchPageTile;
  id: string;
  /** A click puts the tile on this screen. False for a kind this screen
   * cannot draw, which stays grey with `tag`. */
  canPutOn: boolean;
  /** "iPhone only" for a kind the watch cannot draw (or "Watch only"). */
  tag?: string;
}

/** The words in front of the chips: "Not on the watch". */
export function screenOffLead(screen: WatchScreen): string {
  return `Not on the ${screenWord(screen)}`;
}

/**
 * The chips under one screen's picture: each tile Off there, in the page's
 * order (`watchTilesOffScreen`). A tile with an id can be put on with a
 * click; a kind the screen cannot draw (a map, a chart, a web card or a text
 * field on the watch) cannot, and says which kind draws it instead. Empty
 * for a smart page and a map page.
 */
export function screenOffChips(page: WatchPage | undefined, screen: WatchScreen): ScreenOffChip[] {
  if (page === undefined || isSmartWatchPage(page) || isMapWatchPage(page)) return [];
  const otherWord = screen === "watch" ? "iPhone" : "Watch";
  return watchTilesOffScreen(page, screen).flatMap((tile) => {
    const id = typeof tile.id === "string" ? tile.id : "";
    if (id === "") return [];
    const draws = tileDrawsOn(tile, screen);
    return [{ tile, id, canPutOn: draws, ...(draws ? {} : { tag: `${otherWord} only` }) }];
  });
}

/**
 * The toast of the first drag or resize: "Moved on the watch only. The
 * iPhone stays as it is." With several devices of the kind showing the page,
 * each is named: "Moved on Jesse's Watch and Chen's Watch only."
 */
export function screenMoveToastText(screen: WatchScreen, names: readonly string[]): string {
  const where = names.length >= 2 ? joinNames(names) : `the ${screenWord(screen)}`;
  return `Moved on ${where} only. The ${screenWord(screen === "watch" ? "iphone" : "watch")} stays as it is.`;
}

/** Where the toast is remembered as shown: once per user, in this browser. */
export const SCREEN_TOAST_KEY = "wa-pages-screen-toast-shown";

/** Whether the toast was shown already. A browser with no storage counts as
 * not yet, so it may show again on the next visit. */
export function screenToastShown(storage: Pick<Storage, "getItem"> | undefined = globalThis.localStorage): boolean {
  try {
    return storage?.getItem(SCREEN_TOAST_KEY) === "1";
  } catch {
    return false;
  }
}

/** Shown in this visit where storage could not keep it. */
let shownThisVisit = false;

/** The toast's text the first time ever, remembered as shown; undefined
 * every time after. A browser without storage shows it once per visit. */
export function takeScreenMoveToast(
  screen: WatchScreen,
  names: readonly string[],
  storage: Pick<Storage, "getItem" | "setItem"> | undefined = globalThis.localStorage,
): string | undefined {
  if (screenToastShown(storage)) return undefined;
  const text = screenMoveToastText(screen, names);
  try {
    if (storage !== undefined) {
      storage.setItem(SCREEN_TOAST_KEY, "1");
      return text;
    }
  } catch {
    // Kept for this visit only, below.
  }
  if (shownThisVisit) return undefined;
  shownThisVisit = true;
  return text;
}
