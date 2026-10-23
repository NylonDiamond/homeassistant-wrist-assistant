// The old address of a watch's Complications screen,
// `/watch-complications/<owner_watch_id>`. The screen itself is gone: a
// watch's complications are its column on the Complications board, and the
// panel moves this address there (`boardAddressFor` in panel.ts). Only the
// address is kept, so an old link still lands on that watch.
//
// It is not `/complications/...`, which is the Complications tab's own.

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
