// The panel's way into the menu editor, kept out of `panel.ts`: the route it
// answers to, the top bar's button, what the editor's own top bar is handed
// from the panel (the way back, the Home Assistant menu, Watch settings), and
// the one `import()` that loads the editor's own chunk. The same pattern as
// the page editor's (`watch-pages/hook.ts`).
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

/** The help page the editor's "?" opens. */
export const WATCH_MENUS_HELP_URL = "https://docs.wrist-assistant.com/watch-app/quick-menu-editor/";

/** The page editor's sub-path. The same as `WATCH_PAGES_PATH`, written out
 * here so the two hooks do not import each other (a test holds them equal). */
export const PAGES_PATH_FROM_MENUS = "/pages";

/** From the menu editor to the page editor: the panel's own address (the
 * route's prefix, else the address bar less `/menus`) with `/pages`, the way
 * the panel's own Pages button goes. */
export function navigatePagesFromMenus(route: PanelRoute | undefined): void {
  const url = `${watchMenusUrl(route, false, window.location.pathname)}${PAGES_PATH_FROM_MENUS}`;
  if (url === window.location.pathname) return;
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

/** The top bar's way in, beside Pages. Only in a home with a watch, as for
 * Pages. */
export function renderWatchMenusButton(owners: readonly OwnerSummary[], open: () => void): TemplateResult | typeof nothing {
  if (settingsWatches(owners).length === 0) return nothing;
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
  /** Whether the bar offers Home Assistant's menu, as the panel's own does on
   * a phone or with the sidebar hidden. */
  menu: boolean;
  onMenu: () => void;
  onBack: () => void;
  /** The panel's Watch app row owns the watch (`watch-row.ts`): the editor
   * follows `ownerId` and leaves out its own watch picker, the way back and
   * its links to the other screens. Left out, the editor is as it was. */
  shell?: boolean;
  /** The home keeps phone pages: the editor opens an iPhone too. */
  phones?: boolean;
  /** To the page editor. Without it the editor goes there from the address
   * bar (`navigatePagesFromMenus`). */
  onPages?: () => void;
  /** Buttons for the right of the bar: the panel's Watch settings. */
  actions: TemplateResult | typeof nothing;
  /** Dialogs the bar's buttons open. */
  dialogs: TemplateResult | typeof nothing;
  onLoaded: () => void;
}

/** The whole panel while the route is `/menus`: the editor, which draws its
 * own top bar (the complication editor's, `editor-chrome.ts`) with the way
 * back, the Home Assistant menu and the panel's Watch settings button handed
 * in here. The dialogs that button opens stay the panel's, drawn beside it.
 * Until the chunk is in, a plain line with the way back stands in. */
export function renderWatchMenusView(input: WatchMenusViewInput): TemplateResult {
  const ready = customElements.get("wa-menu-editor") !== undefined;
  if (!ready && !loadFailed) void loadMenuEditor().then(input.onLoaded, input.onLoaded);
  return html`${input.dialogs}
    ${ready
      ? html`<wa-menu-editor .hass=${input.hass} .owners=${input.owners} .ownerId=${input.ownerId}
          .icons=${input.icons} .iconsTick=${input.iconsTick} ?narrow=${input.narrow}
          .haMenu=${input.menu} .onHaMenu=${input.onMenu} .onBack=${input.onBack} .onPages=${input.onPages}
          .barActions=${input.actions} .shellOwnsWatch=${input.shell === true}
          .phones=${input.phones === true}></wa-menu-editor>`
      : html`<div class="wp-loading">
          ${input.shell === true ? nothing : html`<button class="tb-btn tb-back" title="Back to complications" @click=${input.onBack}>${uiIcon("left")}<span>Complications</span></button>`}
          ${loadFailed ? html`<span>The menu editor did not load. Reload the page to try again.</span>` : html`<span>Loading…</span>`}
        </div>`}`;
}

/** The button's look, added to the panel's sheet beside the page editor's. */
export const watchMenusHookStyles = css`
  button.tb-btn.tb-menus { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-menus svg.ui-icon { width: 14px; height: 14px; }
`;
