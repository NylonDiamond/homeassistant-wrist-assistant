// iPhones in the panel. On a home whose integration advertises `phone_pages`,
// an iPhone keeps its own pages, status pages, menus, rooms and settings,
// read and saved like a watch's and never a watch's own records; a phone
// starts with none and nothing is copied to it by itself. They are set up in
// the iPhone app tab, beside the Watch app, which lists the watches alone.
//
// Every other watch screen stays the watch's: Control Center and Voice
// belong to one watch, HTTP actions and Cameras to every watch. The iPhone
// app tab has no link to them.
//
// Plan: app repo docs/phone_pages_mvp_2026-10.md, step 2.

import type { OwnerSummary } from "./ha-api.js";
import type { PanelRoute } from "./watch-pages/hook.js";
import { IPHONE_PATH, screenTakesPhone, watchScreenOf } from "./shell.js";
import { deviceKindOf } from "./version.js";
import { watchRouteOwner } from "./watch-pick.js";

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

/** The home's iPhones, as the iPhone app tab lists them: no orphan. */
export function iphoneDevices(owners: readonly OwnerSummary[]): OwnerSummary[] {
  return owners.filter((o) => deviceKindOf(o) === "iphone" && !o.is_orphan);
}

/**
 * Where a Watch app address that names one of the home's iPhones goes now:
 * the same screen in the iPhone app, the rest of the address kept. The
 * iPhone app's "Add pages in Home Assistant" opened `/pages/<iphone id>`
 * before the iPhone app had a tab of its own. Undefined: stay. A watch only
 * screen (Control Center, Voice) stays too, and shows a watch, since the
 * Watch app's pick is only ever a watch.
 */
export function iphoneAddressFor(route: PanelRoute | undefined, owners: readonly OwnerSummary[], phones: boolean): string | undefined {
  if (!phones || route === undefined) return undefined;
  const screen = watchScreenOf(route);
  if (screen === undefined || !screenTakesPhone(screen)) return undefined;
  if (!isPhoneId(owners, watchRouteOwner(route))) return undefined;
  return `${IPHONE_PATH}${route.path}`;
}
