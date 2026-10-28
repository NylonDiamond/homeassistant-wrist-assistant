// The panel's way into the Home map page, kept out of `panel.ts`: the route
// it answers to and the one `import()` that loads the page's own chunk. The
// same pattern as the Cameras screen's (`watch-cameras/hook.ts`).
//
// The map is the home's, shared by every device and person, so the address
// names no device: `/wrist-assistant/home-map`, and anything after it is
// ignored. It is one of the whole home's screens ("On every device"), shown
// only once the integration lists `home_map` (`store.ts`). Every edit is
// saved a moment after it is made, so the page keeps no draft for the
// panel's leave guards. Only
// this file is in the panel's first download; the page arrives the first
// time the route is opened.

import { html, type TemplateResult } from "lit";
import type { HassLike } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";
import type { PanelRoute } from "../watch-pages/hook.js";

export const HOME_MAP_PATH = "/home-map";

export function isHomeMapRoute(route: PanelRoute | undefined): boolean {
  const path = route?.path ?? "";
  return path === HOME_MAP_PATH || path.startsWith(`${HOME_MAP_PATH}/`);
}

let loading: Promise<void> | undefined;
let loadFailed = false;

/** Load the page's chunk once. A failure is remembered and the view asks
 * for a reload (an integration updated under an open page). */
function loadHomeMapEditor(): Promise<void> {
  loading ??= import("./home-map-editor.js").then(
    () => undefined,
    (err: unknown) => {
      loadFailed = true;
      throw err;
    },
  );
  return loading;
}

export interface HomeMapViewInput {
  hass: HassLike;
  narrow: boolean;
  /** The panel's symbol provider, for each pin's icon. */
  icons: IconProvider | undefined;
  /** Bumped when symbols arrive, so the pins draw them. */
  iconsTick: number;
  /** Whether the integration lists `home_map`. Without it the page says to
   * update the integration and reads nothing. */
  capable: boolean;
  /** The editor bar's ‹ Home. */
  onHome?: () => void;
  /** Open a library page in the page editor, for Style's Edit beside a
   * Home map tile. */
  onOpenPage?: (pageId: string) => void;
  onLoaded: () => void;
}

/** The page under the row while the route is `/home-map`. It is handed no
 * device: the map is the home's. Until the chunk is in, a plain line stands
 * in. */
export function renderHomeMapView(input: HomeMapViewInput): TemplateResult {
  const ready = customElements.get("wa-home-map-editor") !== undefined;
  if (!ready && !loadFailed) void loadHomeMapEditor().then(input.onLoaded, input.onLoaded);
  return ready
    ? html`<wa-home-map-editor .hass=${input.hass} ?narrow=${input.narrow} .icons=${input.icons} .iconsTick=${input.iconsTick}
        .capable=${input.capable} .onHome=${input.onHome} .onOpenPage=${input.onOpenPage}></wa-home-map-editor>`
    : html`<div class="wp-loading">
        ${loadFailed ? html`<span>The Home map page did not load. Reload the page to try again.</span>` : html`<span>Loading…</span>`}
      </div>`;
}
