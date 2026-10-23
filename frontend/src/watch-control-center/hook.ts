// The old address of the watch's Control Center editor,
// `/wrist-assistant/control-center` and `/control-center/<owner_watch_id>`.
// The editor is gone: Home Assistant moved each watch's old list into
// complication controls (`control_center_move.py`), which the Complications
// tab edits. The panel moves this address to the Complications board,
// focused on the watch it names (`boardAddressFor` in panel.ts). Only the
// address is kept, so an old link still lands somewhere useful.

import type { PanelRoute } from "../watch-pages/hook.js";

export const WATCH_CONTROL_CENTER_PATH = "/control-center";

export function isWatchControlCenterRoute(route: PanelRoute | undefined): boolean {
  const path = route?.path ?? "";
  return path === WATCH_CONTROL_CENTER_PATH || path.startsWith(`${WATCH_CONTROL_CENTER_PATH}/`);
}

/** The watch a link names: the first segment after `/control-center/`,
 * decoded. None, or one that does not decode, gives nothing. */
export function watchControlCenterRouteOwner(route: PanelRoute | undefined): string | undefined {
  const path = route?.path ?? "";
  const lead = `${WATCH_CONTROL_CENTER_PATH}/`;
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

/** The help page about controls, which the Help sheet links. */
export const WATCH_CONTROL_CENTER_HELP_URL = "https://docs.wrist-assistant.com/watch-app/complications/#control-center";
