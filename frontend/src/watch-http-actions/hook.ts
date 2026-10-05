// The panel's way into the HTTP actions screen, kept out of `panel.ts`: the
// route it answers to, the draft probe the panel's leave guards read, and
// the one `import()` that loads the editor's own chunk. The same pattern as
// the Control Center editor's (`watch-control-center/hook.ts`).
//
// The library is the home's, one for every watch, so its address names no
// watch: `/wrist-assistant/http-actions`, and anything after it is ignored.
// It sits in the Watch app tab under the watch row like the other screens,
// and it follows no watch. Only this file is in the panel's first download;
// the editor, its model and its views arrive the first time the route is
// opened.

import { html, type TemplateResult } from "lit";
import type { HassLike, OwnerSummary } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";
import type { PanelRoute } from "../watch-pages/hook.js";

export const WATCH_HTTP_ACTIONS_PATH = "/http-actions";

export function isWatchHttpActionsRoute(route: PanelRoute | undefined): boolean {
  const path = route?.path ?? "";
  return path === WATCH_HTTP_ACTIONS_PATH || path.startsWith(`${WATCH_HTTP_ACTIONS_PATH}/`);
}

/** The help page the screen's "?" opens. */
export const WATCH_HTTP_ACTIONS_HELP_URL = "https://docs.wrist-assistant.com/features/http-actions/";

/** What the editor's chunk tells the entry about the draft it keeps. */
export interface WatchHttpActionsDraftProbe {
  dirty(): boolean;
  drop(): void;
}

let draftProbe: WatchHttpActionsDraftProbe | undefined;

/** Called once by the editor's chunk when it loads. */
export function registerWatchHttpActionsDrafts(probe: WatchHttpActionsDraftProbe): void {
  draftProbe = probe;
}

/** Whether the HTTP actions draft holds edits, for the panel's leave guards. */
export function watchHttpActionsDirty(): boolean {
  return draftProbe?.dirty() ?? false;
}

/** The person agreed to leave with HTTP action edits unsaved: drop them. */
export function dropWatchHttpActionsDrafts(): void {
  draftProbe?.drop();
}

let loading: Promise<void> | undefined;
let loadFailed = false;

/** Load the editor's chunk once. A failure is remembered and the view asks
 * for a reload (an integration updated under an open page). */
function loadHttpActionsEditor(): Promise<void> {
  loading ??= import("./http-actions-editor.js").then(
    () => undefined,
    (err: unknown) => {
      loadFailed = true;
      throw err;
    },
  );
  return loading;
}

export interface WatchHttpActionsViewInput {
  hass: HassLike;
  /** The home's devices: the watches whose pulls the screen reports, and
   * whether the home has a phone that could hand its actions over. */
  owners: readonly OwnerSummary[];
  narrow: boolean;
  icons: IconProvider;
  iconsTick: number;
  onLoaded: () => void;
}

/** The screen under the watch row while the route is `/http-actions`. It is
 * handed no watch: the library is shared by every watch. Until the chunk is
 * in, a plain line stands in. */
export function renderWatchHttpActionsView(input: WatchHttpActionsViewInput): TemplateResult {
  const ready = customElements.get("wa-http-actions-editor") !== undefined;
  if (!ready && !loadFailed) void loadHttpActionsEditor().then(input.onLoaded, input.onLoaded);
  return ready
    ? html`<wa-http-actions-editor .hass=${input.hass} .owners=${input.owners}
        .icons=${input.icons} .iconsTick=${input.iconsTick} ?narrow=${input.narrow}></wa-http-actions-editor>`
    : html`<div class="wp-loading">
        ${loadFailed ? html`<span>The HTTP actions screen did not load. Reload the page to try again.</span>` : html`<span>Loading…</span>`}
      </div>`;
}
