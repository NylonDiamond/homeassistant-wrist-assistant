// The panel's way into the Cameras screen, kept out of `panel.ts`: the route
// it answers to, the draft probe the panel's leave guards read, and the one
// `import()` that loads the editor's own chunk. The same pattern as the HTTP
// actions screen's (`watch-http-actions/hook.ts`).
//
// A camera's framing in alert pictures belongs to the camera in Home
// Assistant, shared by every device and person, so the address names no
// watch: `/wrist-assistant/cameras`, and anything after it is ignored. The
// iPhone app links straight to it. Only this file is in the panel's first
// download; the editor arrives the first time the route is opened.

import { html, type TemplateResult } from "lit";
import type { HassLike } from "../ha-api.js";
import type { PanelRoute } from "../watch-pages/hook.js";

export const WATCH_CAMERAS_PATH = "/cameras";

export function isWatchCamerasRoute(route: PanelRoute | undefined): boolean {
  const path = route?.path ?? "";
  return path === WATCH_CAMERAS_PATH || path.startsWith(`${WATCH_CAMERAS_PATH}/`);
}

/** The help page the screen's "?" opens. */
export const WATCH_CAMERAS_HELP_URL = "https://docs.wrist-assistant.com/watch-app/cameras/#notification-snapshots";

/** What the editor's chunk tells the entry about the draft it keeps. */
export interface WatchCamerasDraftProbe {
  dirty(): boolean;
  drop(): void;
}

let draftProbe: WatchCamerasDraftProbe | undefined;

/** Called once by the editor's chunk when it loads. */
export function registerWatchCamerasDrafts(probe: WatchCamerasDraftProbe): void {
  draftProbe = probe;
}

/** Whether the open camera holds unsaved framing, for the panel's leave
 * guards. */
export function watchCamerasDirty(): boolean {
  return draftProbe?.dirty() ?? false;
}

/** The person agreed to leave with framing unsaved: drop it. */
export function dropWatchCamerasDrafts(): void {
  draftProbe?.drop();
}

let loading: Promise<void> | undefined;
let loadFailed = false;

/** Load the editor's chunk once. A failure is remembered and the view asks
 * for a reload (an integration updated under an open page). */
function loadCamerasEditor(): Promise<void> {
  loading ??= import("./cameras-editor.js").then(
    () => undefined,
    (err: unknown) => {
      loadFailed = true;
      throw err;
    },
  );
  return loading;
}

export interface WatchCamerasViewInput {
  hass: HassLike;
  narrow: boolean;
  onLoaded: () => void;
}

/** The screen under the watch row while the route is `/cameras`. It is
 * handed no watch: the framing is the camera's. Until the chunk is in, a
 * plain line stands in. */
export function renderWatchCamerasView(input: WatchCamerasViewInput): TemplateResult {
  const ready = customElements.get("wa-cameras-editor") !== undefined;
  if (!ready && !loadFailed) void loadCamerasEditor().then(input.onLoaded, input.onLoaded);
  return ready
    ? html`<wa-cameras-editor .hass=${input.hass} ?narrow=${input.narrow}></wa-cameras-editor>`
    : html`<div class="wp-loading">
        ${loadFailed ? html`<span>The Cameras screen did not load. Reload the page to try again.</span>` : html`<span>Loading…</span>`}
      </div>`;
}
