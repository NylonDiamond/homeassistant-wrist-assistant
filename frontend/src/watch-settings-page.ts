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
