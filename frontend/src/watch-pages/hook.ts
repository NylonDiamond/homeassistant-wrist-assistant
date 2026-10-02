// The panel's way into the watch page editor, kept out of `panel.ts`: the
// route it answers to, the top bar's button, the bar shown over the editor,
// and the one `import()` that loads the editor's own chunk.
//
// The editor lives on a sub-path of the panel, `/wrist-assistant/pages`, so a
// reload stays in it and the browser's Back button leaves it. Home Assistant
// hands a custom panel its `route` (`{prefix, path}`) and changes it when the
// address changes; the panel draws the editor whenever the path is `/pages`.
//
// Only this file is in the panel's first download. `page-editor.ts`, its
// model and its preview arrive the first time the route is opened.

import { css, html, nothing, type TemplateResult } from "lit";
import type { HassLike, OwnerSummary } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";
import { settingsWatches } from "../watch-settings.js";

/** What Home Assistant passes a custom panel as `route`. */
export interface PanelRoute {
  prefix: string;
  path: string;
}

export const WATCH_PAGES_PATH = "/pages";

export function isWatchPagesRoute(route: PanelRoute | undefined): boolean {
  const path = route?.path ?? "";
  return path === WATCH_PAGES_PATH || path.startsWith(`${WATCH_PAGES_PATH}/`);
}

/** The panel's own address, with or without the editor's sub-path. Without a
 * route (a frontend that does not pass one) it is worked out from the
 * address bar. */
export function watchPagesUrl(route: PanelRoute | undefined, pages: boolean, pathname = ""): string {
  const prefix = route?.prefix ?? pathname.replace(/\/pages(\/.*)?$/, "");
  return pages ? `${prefix}${WATCH_PAGES_PATH}` : prefix;
}

/** Go to the editor or back, the way Home Assistant's own frontend moves
 * between addresses: a new history entry, then `location-changed`, which
 * makes it hand the panel the new route. */
export function navigateWatchPages(route: PanelRoute | undefined, pages: boolean): void {
  const url = watchPagesUrl(route, pages, window.location.pathname);
  if (url === "" || url === window.location.pathname) return;
  history.pushState(null, "", url);
  window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
}

/** What the editor's chunk tells the entry about the page drafts it keeps. */
export interface WatchPagesDraftProbe {
  /** Whether any kept draft holds edits. */
  dirty(): boolean;
  /** Drop every kept draft. */
  drop(): void;
}

let draftProbe: WatchPagesDraftProbe | undefined;

/** Called once by the editor's chunk when it loads. Before that there can be
 * no draft, so the entry never needs the chunk to answer. */
export function registerWatchPagesDrafts(probe: WatchPagesDraftProbe): void {
  draftProbe = probe;
}

/** Whether a page draft holds edits, for the panel's leave guards. */
export function watchPagesDirty(): boolean {
  return draftProbe?.dirty() ?? false;
}

/** The person agreed to leave with page edits unsaved: drop them, as the
 * complication draft is lost with the panel. */
export function dropWatchPagesDrafts(): void {
  draftProbe?.drop();
}

let loading: Promise<void> | undefined;
let loadFailed = false;

/** Load the editor's chunk once. A failure is remembered and the view asks
 * for a reload rather than trying again on every draw: the usual cause is an
 * integration updated under an open page, whose old chunk names are gone, and
 * only a reload fetches the new entry that names the new ones. */
function loadPageEditor(): Promise<void> {
  loading ??= import("./page-editor.js").then(
    () => undefined,
    (err: unknown) => {
      loadFailed = true;
      throw err;
    },
  );
  return loading;
}

/** The top bar's way in, beside Watch settings. Administrators only, in a
 * home with a watch, as for Watch settings: both read admin commands. */
export function renderWatchPagesButton(hass: HassLike, owners: readonly OwnerSummary[], open: () => void): TemplateResult | typeof nothing {
  if (!hass.user?.is_admin || settingsWatches(owners).length === 0) return nothing;
  return html`<button class="tb-btn tb-pages" title="The watch's pages, as Home Assistant keeps them"
    @click=${open}>${uiIcon("pages")}<span>Pages</span></button>`;
}

export interface WatchPagesViewInput {
  hass: HassLike;
  owners: readonly OwnerSummary[];
  ownerId: string | undefined;
  narrow: boolean;
  icons: IconProvider;
  /** Whether the bar offers Home Assistant's menu, as the panel's own does on
   * a phone or with the sidebar hidden. */
  menu: boolean;
  onMenu: () => void;
  onBack: () => void;
  /** Buttons for the right of the bar. */
  actions: TemplateResult | typeof nothing;
  /** Dialogs the bar's buttons open. */
  dialogs: TemplateResult | typeof nothing;
  /** Called once the editor's chunk has loaded or failed, to draw again. */
  onLoaded: () => void;
}

/** The whole panel while the route is `/pages`: a bar with the way back, and
 * the editor under it. */
export function renderWatchPagesView(input: WatchPagesViewInput): TemplateResult {
  const ready = customElements.get("wa-page-editor") !== undefined;
  if (!ready && !loadFailed) void loadPageEditor().then(input.onLoaded, input.onLoaded);
  return html`<header class="wp-bar">
      ${input.menu ? html`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${input.onMenu}>${uiIcon("menu")}</button>` : nothing}
      <button class="tb-btn tb-back" title="Back to complications" @click=${input.onBack}>${uiIcon("left")}<span>Complications</span></button>
      <span class="spacer"></span>
      ${input.actions}
    </header>
    ${input.dialogs}
    ${ready
      ? html`<wa-page-editor .hass=${input.hass} .owners=${input.owners} .ownerId=${input.ownerId}
          .icons=${input.icons} ?narrow=${input.narrow}></wa-page-editor>`
      : html`<div class="wp-loading">${loadFailed
          ? html`<span>The page editor did not load. Reload the page to try again.</span>`
          : "Loading…"}</div>`}`;
}

/** The two buttons' look, added to the panel's sheet: the glyph and its
 * words on one line, like Watch settings. */
export const watchPagesHookStyles = css`
  button.tb-btn.tb-pages, button.tb-btn.tb-back { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-pages svg.ui-icon, button.tb-btn.tb-back svg.ui-icon { width: 14px; height: 14px; }
  .wp-loading { padding: 24px 16px; color: var(--wa-muted); }
`;
