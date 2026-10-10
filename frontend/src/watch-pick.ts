// The one watch the Watch app tab is about, shared by its screens and its
// Settings page, and remembered per browser. HTTP actions, the home's own
// library, names no watch in its address, so a visit there leaves the
// remembered watch as it was.
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
//
// The iPhone app tab keeps its own pick the same way: the iPhone its address
// names (`iphoneRouteOwner`), else the remembered one, else the first iPhone.
// It is handed the home's iPhones alone, and remembered under its own key,
// so neither tab's pick ever moves the other's.

import type { OwnerSummary } from "./ha-api.js";
import { iphoneInnerRoute } from "./shell.js";
import { deviceKindOf } from "./version.js";
import { watchControlCenterRouteOwner } from "./watch-control-center/hook.js";
import { watchMenusRouteOwner } from "./watch-menus/hook.js";
import { type PanelRoute, watchPagesRouteOwner } from "./watch-pages/hook.js";
import { watchRoomsRouteOwner } from "./watch-rooms/hook.js";
import { initialWatch } from "./watch-settings.js";
import { watchSettingsRouteOwner } from "./watch-settings-page.js";
import { watchStatusPagesRouteOwner } from "./watch-status-pages/hook.js";
import { watchVoiceRouteOwner } from "./watch-voice/hook.js";

/** localStorage: `{"watch": "<owner_watch_id>"}`. */
export const WATCH_PICK_KEY = "wrist-assistant-panel.watch.v1";
/** localStorage: `{"iphone": "<owner_watch_id>"}`, the iPhone app's pick. */
export const IPHONE_PICK_KEY = "wrist-assistant-panel.iphone.v1";

/** Which tab's pick: the Watch app's or the iPhone app's. */
export type PickKind = "watch" | "iphone";

/** The watch a watch screen's address names, decoded the way that screen
 * decodes it; undefined off the Watch app or with no watch in the address. */
export function watchRouteOwner(route: PanelRoute | undefined): string | undefined {
  return watchPagesRouteOwner(route)
    ?? watchMenusRouteOwner(route)
    ?? watchVoiceRouteOwner(route)
    ?? watchStatusPagesRouteOwner(route)
    ?? watchControlCenterRouteOwner(route)
    ?? watchRoomsRouteOwner(route)
    ?? watchSettingsRouteOwner(route);
}

/** The iPhone an iPhone app address names, decoded the way the screen it
 * wraps decodes a watch; undefined off the iPhone app or with none in it. */
export function iphoneRouteOwner(route: PanelRoute | undefined): string | undefined {
  return watchRouteOwner(iphoneInnerRoute(route));
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
  return initialWatch(watches.filter((w) => deviceKindOf(w) === "watch"), input.fallback) ?? watches[0]?.owner_watch_id;
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

const PICK_KEY: Record<PickKind, string> = { watch: WATCH_PICK_KEY, iphone: IPHONE_PICK_KEY };

/** The remembered pick, or undefined: none, unreadable, or storage off. The
 * storage itself is asked for inside, since merely reaching it can throw. */
export function loadWatchPick(storage: () => PickStorage | undefined, kind: PickKind = "watch"): string | undefined {
  try {
    const raw = storage()?.getItem(PICK_KEY[kind]);
    if (!raw) return undefined;
    const saved = JSON.parse(raw) as Partial<Record<PickKind, unknown>> | null;
    const id = saved?.[kind];
    return typeof id === "string" && id !== "" ? id : undefined;
  } catch {
    return undefined;
  }
}

/** Remember the pick. Storage off: it still holds for this visit. */
export function saveWatchPick(storage: () => PickStorage | undefined, watch: string, kind: PickKind = "watch"): void {
  try {
    storage()?.setItem(PICK_KEY[kind], JSON.stringify({ [kind]: watch }));
  } catch {
    /* Storage off. */
  }
}
