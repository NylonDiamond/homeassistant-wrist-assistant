// The panel's way into the status page editor, kept out of `panel.ts`: the
// route it answers to, the top bar's button, what the editor's own top bar is
// handed from the panel (the way back, the Home Assistant menu, Watch
// settings), and the one `import()` that loads the editor's own chunk. The
// same pattern as the menu editor's (`watch-menus/hook.ts`).
//
// The editor lives on a sub-path of the panel, `/wrist-assistant/status-pages`,
// and `/status-pages/<owner_watch_id>` opens it on one watch. Only this file
// is in the panel's first download; `status-pages-editor.ts`, its model and
// its tables arrive the first time the route is opened.

import { css, html, nothing, type TemplateResult } from "lit";
import type { HassLike, OwnerSummary } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";
import type { PanelRoute } from "../watch-pages/hook.js";
import { settingsWatches } from "../watch-settings.js";

export const WATCH_STATUS_PAGES_PATH = "/status-pages";

export function isWatchStatusPagesRoute(route: PanelRoute | undefined): boolean {
  const path = route?.path ?? "";
  return path === WATCH_STATUS_PAGES_PATH || path.startsWith(`${WATCH_STATUS_PAGES_PATH}/`);
}

/** The watch a link opens the editor on: the first segment after
 * `/status-pages/`, decoded. None, or one that does not decode, gives
 * nothing. */
export function watchStatusPagesRouteOwner(route: PanelRoute | undefined): string | undefined {
  const path = route?.path ?? "";
  const lead = `${WATCH_STATUS_PAGES_PATH}/`;
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

/** The panel's own address, with or without the editor's sub-path. Without a
 * route it is worked out from the address bar. */
export function watchStatusPagesUrl(route: PanelRoute | undefined, open: boolean, pathname = ""): string {
  const prefix = route?.prefix ?? pathname.replace(/\/status-pages(\/.*)?$/, "");
  return open ? `${prefix}${WATCH_STATUS_PAGES_PATH}` : prefix;
}

/** Go to the editor or back, as Home Assistant's own frontend moves between
 * addresses: a new history entry, then `location-changed`. */
export function navigateWatchStatusPages(route: PanelRoute | undefined, open: boolean): void {
  const url = watchStatusPagesUrl(route, open, window.location.pathname);
  if (url === "" || url === window.location.pathname) return;
  history.pushState(null, "", url);
  window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
}

/** The help page the editor's "?" opens. */
export const WATCH_STATUS_PAGES_HELP_URL = "https://docs.wrist-assistant.com/features/status-pages/";

/** What the editor's chunk tells the entry about the drafts it keeps. */
export interface WatchStatusPagesDraftProbe {
  dirty(): boolean;
  drop(): void;
}

let draftProbe: WatchStatusPagesDraftProbe | undefined;

/** Called once by the editor's chunk when it loads. */
export function registerWatchStatusPagesDrafts(probe: WatchStatusPagesDraftProbe): void {
  draftProbe = probe;
}

/** Whether a status pages draft holds edits, for the panel's leave guards. */
export function watchStatusPagesDirty(): boolean {
  return draftProbe?.dirty() ?? false;
}

/** The person agreed to leave with status page edits unsaved: drop them. */
export function dropWatchStatusPagesDrafts(): void {
  draftProbe?.drop();
}

let loading: Promise<void> | undefined;
let loadFailed = false;

/** Load the editor's chunk once. A failure is remembered and the view asks
 * for a reload (an integration updated under an open page). */
function loadStatusPagesEditor(): Promise<void> {
  loading ??= import("./status-pages-editor.js").then(
    () => undefined,
    (err: unknown) => {
      loadFailed = true;
      throw err;
    },
  );
  return loading;
}

/** The top bar's way in, beside Pages and Menus. Administrators only, in a
 * home with a watch, as for those. */
export function renderWatchStatusPagesButton(hass: HassLike, owners: readonly OwnerSummary[], open: () => void): TemplateResult | typeof nothing {
  if (!hass.user?.is_admin || settingsWatches(owners).length === 0) return nothing;
  return html`<button class="tb-btn tb-status-pages" title="The watch's status pages"
    @click=${open}>${uiIcon("list")}<span>Status pages</span></button>`;
}

export interface WatchStatusPagesViewInput {
  hass: HassLike;
  owners: readonly OwnerSummary[];
  ownerId: string | undefined;
  narrow: boolean;
  icons: IconProvider;
  iconsTick: number;
  /** Whether the bar offers Home Assistant's menu, as the panel's own does on
   * a phone or with the sidebar hidden. */
  menu: boolean;
  onMenu: () => void;
  onBack: () => void;
  /** The panel's Watch app row owns the watch (`watch-row.ts`): the editor
   * follows `ownerId` and leaves out its own watch picker, the way back and
   * its links to the other screens. Left out, the editor is as it was. */
  shell?: boolean;
  /** Buttons for the right of the bar: the panel's Watch settings. */
  actions: TemplateResult | typeof nothing;
  /** Dialogs the bar's buttons open. */
  dialogs: TemplateResult | typeof nothing;
  onLoaded: () => void;
}

/** The whole panel while the route is `/status-pages`: the editor, which
 * draws its own top bar with the way back, the Home Assistant menu and the
 * panel's Watch settings button handed in here. Until the chunk is in, a
 * plain line with the way back stands in. */
export function renderWatchStatusPagesView(input: WatchStatusPagesViewInput): TemplateResult {
  const ready = customElements.get("wa-status-pages-editor") !== undefined;
  if (!ready && !loadFailed) void loadStatusPagesEditor().then(input.onLoaded, input.onLoaded);
  return html`${input.dialogs}
    ${ready
      ? html`<wa-status-pages-editor .hass=${input.hass} .owners=${input.owners} .ownerId=${input.ownerId}
          .icons=${input.icons} .iconsTick=${input.iconsTick} ?narrow=${input.narrow}
          .haMenu=${input.menu} .onHaMenu=${input.onMenu} .onBack=${input.onBack}
          .barActions=${input.actions} .shellOwnsWatch=${input.shell === true}></wa-status-pages-editor>`
      : html`<div class="wp-loading">
          ${input.shell === true ? nothing : html`<button class="tb-btn tb-back" title="Back to complications" @click=${input.onBack}>${uiIcon("left")}<span>Complications</span></button>`}
          ${loadFailed ? html`<span>The status page editor did not load. Reload the page to try again.</span>` : html`<span>Loading…</span>`}
        </div>`}`;
}

/** The button's look, added to the panel's sheet beside the other editors'. */
export const watchStatusPagesHookStyles = css`
  button.tb-btn.tb-status-pages { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-status-pages svg.ui-icon { width: 14px; height: 14px; }
`;
