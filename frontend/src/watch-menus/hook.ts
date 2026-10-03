// The panel's way into the menu editor, kept out of `panel.ts`: the route it
// answers to, the top bar's button, the bar shown over the editor, and the
// one `import()` that loads the editor's own chunk. The same pattern as the
// page editor's (`watch-pages/hook.ts`).
//
// The editor lives on a sub-path of the panel, `/wrist-assistant/menus`, and
// `/menus/<owner_watch_id>` opens it on one watch, as the iPhone app's "Open
// in Home Assistant" builds it. Only this file is in the panel's first
// download; `menu-editor.ts` and its model arrive the first time the route is
// opened.

import { css, html, nothing, type TemplateResult } from "lit";
import type { HassLike, OwnerSummary } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";
import type { PanelRoute } from "../watch-pages/hook.js";
import { settingsWatches } from "../watch-settings.js";

export const WATCH_MENUS_PATH = "/menus";

export function isWatchMenusRoute(route: PanelRoute | undefined): boolean {
  const path = route?.path ?? "";
  return path === WATCH_MENUS_PATH || path.startsWith(`${WATCH_MENUS_PATH}/`);
}

/** The watch a link opens the editor on: the first segment after
 * `/menus/`, decoded. None, or one that does not decode, gives nothing. */
export function watchMenusRouteOwner(route: PanelRoute | undefined): string | undefined {
  const path = route?.path ?? "";
  const lead = `${WATCH_MENUS_PATH}/`;
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
export function watchMenusUrl(route: PanelRoute | undefined, menus: boolean, pathname = ""): string {
  const prefix = route?.prefix ?? pathname.replace(/\/menus(\/.*)?$/, "");
  return menus ? `${prefix}${WATCH_MENUS_PATH}` : prefix;
}

/** Go to the editor or back, as Home Assistant's own frontend moves between
 * addresses: a new history entry, then `location-changed`. */
export function navigateWatchMenus(route: PanelRoute | undefined, menus: boolean): void {
  const url = watchMenusUrl(route, menus, window.location.pathname);
  if (url === "" || url === window.location.pathname) return;
  history.pushState(null, "", url);
  window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
}

/** What the editor's chunk tells the entry about the menu drafts it keeps. */
export interface WatchMenusDraftProbe {
  dirty(): boolean;
  drop(): void;
}

let draftProbe: WatchMenusDraftProbe | undefined;

/** Called once by the editor's chunk when it loads. */
export function registerWatchMenusDrafts(probe: WatchMenusDraftProbe): void {
  draftProbe = probe;
}

/** Whether a menu draft holds edits, for the panel's leave guards. */
export function watchMenusDirty(): boolean {
  return draftProbe?.dirty() ?? false;
}

/** The person agreed to leave with menu edits unsaved: drop them. */
export function dropWatchMenusDrafts(): void {
  draftProbe?.drop();
}

let loading: Promise<void> | undefined;
let loadFailed = false;

/** Load the editor's chunk once. A failure is remembered and the view asks
 * for a reload (an integration updated under an open page). */
function loadMenuEditor(): Promise<void> {
  loading ??= import("./menu-editor.js").then(
    () => undefined,
    (err: unknown) => {
      loadFailed = true;
      throw err;
    },
  );
  return loading;
}

/** The top bar's way in, beside Pages. Administrators only, in a home with a
 * watch, as for Pages. */
export function renderWatchMenusButton(hass: HassLike, owners: readonly OwnerSummary[], open: () => void): TemplateResult | typeof nothing {
  if (!hass.user?.is_admin || settingsWatches(owners).length === 0) return nothing;
  return html`<button class="tb-btn tb-menus" title="The watch's Anywhere menu, Entity quick menu and page switcher"
    @click=${open}>${uiIcon("radial")}<span>Menus</span></button>`;
}

export interface WatchMenusViewInput {
  hass: HassLike;
  owners: readonly OwnerSummary[];
  ownerId: string | undefined;
  narrow: boolean;
  icons: IconProvider;
  iconsTick: number;
  menu: boolean;
  onMenu: () => void;
  onBack: () => void;
  actions: TemplateResult | typeof nothing;
  dialogs: TemplateResult | typeof nothing;
  onLoaded: () => void;
}

/** The whole panel while the route is `/menus`: a bar with the way back, and
 * the editor under it. */
export function renderWatchMenusView(input: WatchMenusViewInput): TemplateResult {
  const ready = customElements.get("wa-menu-editor") !== undefined;
  if (!ready && !loadFailed) void loadMenuEditor().then(input.onLoaded, input.onLoaded);
  return html`<header class="wp-bar">
      ${input.menu ? html`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${input.onMenu}>${uiIcon("menu")}</button>` : nothing}
      <button class="tb-btn tb-back" title="Back to complications" @click=${input.onBack}>${uiIcon("left")}<span>Complications</span></button>
      <span class="spacer"></span>
      ${input.actions}
    </header>
    ${input.dialogs}
    ${ready
      ? html`<wa-menu-editor .hass=${input.hass} .owners=${input.owners} .ownerId=${input.ownerId}
          .icons=${input.icons} .iconsTick=${input.iconsTick} ?narrow=${input.narrow}></wa-menu-editor>`
      : html`<div class="wp-loading">${loadFailed
          ? html`<span>The menu editor did not load. Reload the page to try again.</span>`
          : "Loading…"}</div>`}`;
}

/** The button's look, added to the panel's sheet beside the page editor's. */
export const watchMenusHookStyles = css`
  button.tb-btn.tb-menus { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-menus svg.ui-icon { width: 14px; height: 14px; }
`;
