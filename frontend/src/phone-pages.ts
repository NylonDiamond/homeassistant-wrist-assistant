// iPhones in the Watch app tab. On a home whose integration advertises
// `phone_pages`, an iPhone is one more device the Watch app's row offers,
// after the watches. It keeps its own pages, status pages, menus, rooms and
// settings, read and saved like a watch's and never a watch's own records;
// a phone starts with none and nothing is copied to it by itself.
//
// Every other watch screen stays the watch's: Control Center and Voice
// belong to one watch, HTTP actions and Cameras to every watch. While the
// row's pick is a phone their links leave the row, and one opened anyway (a
// bookmark, Home's cards) shows the first watch instead and says so.
//
// Plan: app repo docs/phone_pages_mvp_2026-10.md, step 2.

import type { OwnerSummary } from "./ha-api.js";
import type { WatchScreen } from "./shell.js";
import { deviceKindOf } from "./version.js";
import { settingsWatches, watchName } from "./watch-settings.js";

/** What the integration advertises once it keeps a phone's own pages. */
export const PHONE_PAGES_CAPABILITY = "phone_pages";

/** Whether the home's integration keeps phone pages: its owners reply lists
 * `phone_pages`. An integration older than the list says nothing, so no. */
export function phonePagesOn(capabilities: readonly string[] | undefined): boolean {
  return capabilities?.includes(PHONE_PAGES_CAPABILITY) ?? false;
}

/** Whether `id` is one of the home's iPhones. */
export function isPhoneId(owners: readonly OwnerSummary[], id: string | undefined): boolean {
  return id !== undefined && owners.some((o) => o.owner_watch_id === id && deviceKindOf(o) === "iphone");
}

/** The Watch app screens a phone has: the four kinds it keeps, and Settings
 * for the settings that make sense on a phone. */
const PHONE_SCREENS: ReadonlySet<WatchScreen["id"]> = new Set(["pages", "menus", "status-pages", "rooms", "settings"]);

/** Whether a screen edits a phone too. */
export function screenTakesPhone(screen: Pick<WatchScreen, "id">): boolean {
  return PHONE_SCREENS.has(screen.id);
}

/** What the phone does not have, for the line on a watch only screen. */
const WATCH_ONLY_WHAT: Partial<Record<WatchScreen["id"], string>> = {
  "control-center": "Control Center list",
  "voice": "voice commands",
  "http-actions": "HTTP actions",
  "cameras": "camera alerts",
};

/** A watch only screen opened while the row's pick is a phone: the watch it
 * shows instead (undefined in a home with no watch, or on a screen every
 * watch shares) and the line that says so. */
export interface WatchOnlyFallback {
  watch: string | undefined;
  text: string;
}

/**
 * The fallback for `screen` on the row's `pick`, or undefined when there is
 * none to make: the screen edits phones too, or the pick is no phone. A
 * screen of one watch shows the first watch; a shared screen shows what it
 * always does. With no watch at all the line says so.
 */
export function watchOnlyFallback(screen: WatchScreen, owners: readonly OwnerSummary[], pick: string | undefined): WatchOnlyFallback | undefined {
  if (screenTakesPhone(screen) || !isPhoneId(owners, pick)) return undefined;
  const what = WATCH_ONLY_WHAT[screen.id] ?? screen.label;
  if (screen.shared === true) return { watch: undefined, text: `The iPhone has no ${what}. These are for the watches.` };
  const watches = settingsWatches(owners);
  const first = watches[0];
  if (first === undefined) return { watch: undefined, text: `The iPhone has no ${what}, and no watch has connected yet.` };
  return { watch: first.owner_watch_id, text: `The iPhone has no ${what}. Showing ${watchName(first, watches)}.` };
}
