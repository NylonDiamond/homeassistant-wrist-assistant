// The one watch the Watch app tab is about, shared by its six screens and
// Watch settings, and remembered per browser.
//
// It is never the complications device (`ownerId` in the panel): that one
// may be a phone, and picking a complication must not move the watch app.
// Today's choice only stands in for it when nothing better is known.
//
// Which watch is on screen, in order:
//   1. the watch the address names (`/pages/<owner_watch_id>`, as the iPhone
//      app's "Open in Home Assistant" builds it), when it is a listed watch;
//   2. the remembered pick, when it is still a listed watch;
//   3. today's fallback: the complications device when it is a watch, else
//      the first watch (`initialWatch`).
// A watch the address names also becomes the remembered pick, so the next
// visit without one opens on it, but only once the device list says it is a
// watch of this home.

import type { OwnerSummary } from "./ha-api.js";
import { watchControlCenterRouteOwner } from "./watch-control-center/hook.js";
import { watchMenusRouteOwner } from "./watch-menus/hook.js";
import { type PanelRoute, watchPagesRouteOwner } from "./watch-pages/hook.js";
import { watchRoomsRouteOwner } from "./watch-rooms/hook.js";
import { initialWatch } from "./watch-settings.js";
import { watchStatusPagesRouteOwner } from "./watch-status-pages/hook.js";
import { watchVoiceRouteOwner } from "./watch-voice/hook.js";

/** localStorage: `{"watch": "<owner_watch_id>"}`. */
export const WATCH_PICK_KEY = "wrist-assistant-panel.watch.v1";

/** The watch a watch screen's address names, decoded the way that screen
 * decodes it; undefined off the Watch app or with no watch in the address. */
export function watchRouteOwner(route: PanelRoute | undefined): string | undefined {
  return watchPagesRouteOwner(route)
    ?? watchMenusRouteOwner(route)
    ?? watchVoiceRouteOwner(route)
    ?? watchStatusPagesRouteOwner(route)
    ?? watchControlCenterRouteOwner(route)
    ?? watchRoomsRouteOwner(route);
}

/** What the shared watch is worked out from. */
export interface WatchPickInput {
  /** The watch the address names. */
  route: string | undefined;
  /** The remembered pick. */
  saved: string | undefined;
  /** Today's choice: the complications device, which may be a phone. */
  fallback: string | undefined;
}

/**
 * The watch the Watch app shows. Until the device list is in (`watches`
 * empty) nothing can be checked, so the address's watch, else the remembered
 * one, is handed on as it is: a screen checks it against its own list, and
 * the screen never opens some other watch first only to move.
 */
export function resolveWatchPick(watches: readonly OwnerSummary[], input: WatchPickInput): string | undefined {
  if (watches.length === 0) return input.route ?? input.saved;
  const listed = (id: string | undefined) => id !== undefined && watches.some((w) => w.owner_watch_id === id);
  if (listed(input.route)) return input.route;
  if (listed(input.saved)) return input.saved;
  return initialWatch(watches, input.fallback);
}

/** The pick to remember once the address names a watch: that watch, once
 * the device list is in and lists it as one of the home's watches. Until the
 * list is in the pick stays as it was, so a link to a watch of some other
 * home never replaces a good one; the screen gets the address's watch in the
 * meantime through `resolveWatchPick`, and the pick is taken when the list
 * arrives. */
export function adoptRouteWatch(saved: string | undefined, routeOwner: string | undefined, watches: readonly OwnerSummary[]): string | undefined {
  if (routeOwner === undefined || routeOwner === saved) return saved;
  if (!watches.some((w) => w.owner_watch_id === routeOwner)) return saved;
  return routeOwner;
}

/** Storage as far as the pick needs it. */
export type PickStorage = Pick<Storage, "getItem" | "setItem">;

/** The remembered pick, or undefined: none, unreadable, or storage off. The
 * storage itself is asked for inside, since merely reaching it can throw. */
export function loadWatchPick(storage: () => PickStorage | undefined): string | undefined {
  try {
    const raw = storage()?.getItem(WATCH_PICK_KEY);
    if (!raw) return undefined;
    const saved = JSON.parse(raw) as { watch?: unknown } | null;
    return typeof saved?.watch === "string" && saved.watch !== "" ? saved.watch : undefined;
  } catch {
    return undefined;
  }
}

/** Remember the pick. Storage off: it still holds for this visit. */
export function saveWatchPick(storage: () => PickStorage | undefined, watch: string): void {
  try {
    storage()?.setItem(WATCH_PICK_KEY, JSON.stringify({ watch }));
  } catch {
    /* Storage off. */
  }
}
