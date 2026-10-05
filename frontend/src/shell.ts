// The panel's shell: the three tabs across the top (Home, Watch app,
// Complications), which address each one lives at, and the bar that moves
// between them.
//
// The tab is never stored. It is read from the route Home Assistant hands the
// panel, so a reload, a bookmark and the browser's Back button all agree with
// what is on screen:
//
//   ""                  Home
//   /complications      the complication list, and the editor once a design
//                       is open (the open draft decides, not the address)
//   /pages, /menus, /voice, /status-pages, /control-center, /rooms, each with
//   an optional /<owner_watch_id>
//                       the Watch app, as before
//   /http-actions       the home's HTTP actions, shared by every watch, so
//                       the address never names one
//   /settings, with an optional /<owner_watch_id>
//                       the Watch app's Settings page
//
// Every watch address is the one the iPhone app builds for "Open in Home
// Assistant", unchanged; this file only reads them.
//
// Moving between tabs is the watch hooks' way: a new history entry, then
// `location-changed`, which makes Home Assistant hand the panel the new route.

import { css, html, nothing, type TemplateResult } from "lit";
import { uiIcon } from "./ui-icons.js";
import { WATCH_CONTROL_CENTER_PATH, isWatchControlCenterRoute } from "./watch-control-center/hook.js";
import { WATCH_HTTP_ACTIONS_PATH, isWatchHttpActionsRoute } from "./watch-http-actions/hook.js";
import { WATCH_MENUS_PATH, isWatchMenusRoute } from "./watch-menus/hook.js";
import { type PanelRoute, WATCH_PAGES_PATH, isWatchPagesRoute } from "./watch-pages/hook.js";
import { WATCH_ROOMS_PATH, isWatchRoomsRoute } from "./watch-rooms/hook.js";
import { WATCH_SETTINGS_PATH, isWatchSettingsRoute } from "./watch-settings-page.js";
import { WATCH_STATUS_PAGES_PATH, isWatchStatusPagesRoute } from "./watch-status-pages/hook.js";
import { WATCH_VOICE_PATH, isWatchVoiceRoute } from "./watch-voice/hook.js";

export type PanelTab = "home" | "watch" | "complications";

/** Home is the panel's own address, with nothing after it. */
export const HOME_PATH = "";
export const COMPLICATIONS_PATH = "/complications";

export const TAB_LABEL: Record<PanelTab, string> = {
  home: "Home",
  watch: "Watch app",
  complications: "Complications",
};

/** One of the watch app's screens, as Home lists them and the watch row
 * walks them. */
export interface WatchScreen {
  id: "pages" | "menus" | "status-pages" | "control-center" | "rooms" | "voice" | "http-actions" | "settings";
  label: string;
  /** One line under the name on Home. */
  blurb: string;
  path: string;
  /** Shared by every watch: the address never names one, and the screen
   * follows none. */
  shared?: true;
}

/** In the order Home and the watch row show them. */
export const WATCH_SCREENS: readonly WatchScreen[] = [
  { id: "pages", label: "Pages", blurb: "The screens you swipe between", path: WATCH_PAGES_PATH },
  { id: "menus", label: "Menus", blurb: "Quick menus and their items", path: WATCH_MENUS_PATH },
  { id: "status-pages", label: "Status pages", blurb: "Read-only views of your home", path: WATCH_STATUS_PAGES_PATH },
  { id: "control-center", label: "Control Center", blurb: "The list of controls", path: WATCH_CONTROL_CENTER_PATH },
  { id: "rooms", label: "Rooms", blurb: "Which rooms show, and in what order", path: WATCH_ROOMS_PATH },
  { id: "voice", label: "Voice", blurb: "How voice commands work", path: WATCH_VOICE_PATH },
  { id: "http-actions", label: "HTTP actions", blurb: "Web requests Home Assistant sends for a watch", path: WATCH_HTTP_ACTIONS_PATH, shared: true },
];

/** The Settings page: a screen of the Watch app with an address like the
 * others, kept out of `WATCH_SCREENS` because Home lists it on its own (its
 * Devices card, and the pairing card in a home with no watch) and the row
 * draws it last, apart from the seven. */
export const WATCH_SETTINGS_SCREEN: WatchScreen = {
  id: "settings", label: "Settings", blurb: "How the watch behaves", path: WATCH_SETTINGS_PATH,
};

/** A watch screen's address, on one watch when one is named. The owner is
 * encoded the way each screen's `watch*RouteOwner` decodes it. A shared
 * screen's address never names a watch. */
export function watchScreenPath(screen: WatchScreen, owner?: string): string {
  return owner && screen.shared !== true ? `${screen.path}/${encodeURIComponent(owner)}` : screen.path;
}

/** The watch screen a route is on, or undefined off the Watch app. */
export function watchScreenOf(route: PanelRoute | undefined): WatchScreen | undefined {
  if (isWatchPagesRoute(route)) return WATCH_SCREENS[0];
  if (isWatchMenusRoute(route)) return WATCH_SCREENS[1];
  if (isWatchStatusPagesRoute(route)) return WATCH_SCREENS[2];
  if (isWatchControlCenterRoute(route)) return WATCH_SCREENS[3];
  if (isWatchRoomsRoute(route)) return WATCH_SCREENS[4];
  if (isWatchVoiceRoute(route)) return WATCH_SCREENS[5];
  if (isWatchHttpActionsRoute(route)) return WATCH_SCREENS[6];
  if (isWatchSettingsRoute(route)) return WATCH_SETTINGS_SCREEN;
  return undefined;
}

export function isComplicationsRoute(route: PanelRoute | undefined): boolean {
  const path = route?.path ?? "";
  return path === COMPLICATIONS_PATH || path.startsWith(`${COMPLICATIONS_PATH}/`);
}

/** Which tab a route shows. Anything the panel does not know, an empty path
 * and a missing route included, is Home. */
export function tabOfRoute(route: PanelRoute | undefined): PanelTab {
  if (watchScreenOf(route) !== undefined) return "watch";
  if (isComplicationsRoute(route)) return "complications";
  return "home";
}

/** Where a click on a tab goes. The Watch app opens on Pages, on the shared
 * watch when there is one (`watch-pick.ts`). */
export function tabPath(tab: PanelTab, watch?: string): string {
  if (tab === "complications") return COMPLICATIONS_PATH;
  if (tab === "watch") return watchScreenPath(WATCH_SCREENS[0]!, watch);
  return HOME_PATH;
}

/** The tabs a person sees: the Watch app only for an administrator, as its
 * screens read admin commands. */
export function tabsFor(admin: boolean): PanelTab[] {
  return admin ? ["home", "watch", "complications"] : ["home", "complications"];
}

/** Every tab's sub-path, as one pattern anchored at the end of an address:
 * the first one in it and everything after. */
const SUB_PATH = new RegExp(`(${[
  COMPLICATIONS_PATH, WATCH_PAGES_PATH, WATCH_MENUS_PATH, WATCH_VOICE_PATH,
  WATCH_STATUS_PAGES_PATH, WATCH_CONTROL_CENTER_PATH, WATCH_ROOMS_PATH, WATCH_HTTP_ACTIONS_PATH, WATCH_SETTINGS_PATH,
].join("|")})(/.*)?$`);

/** The panel's own address without any tab's sub-path. Without a route (a
 * frontend that does not pass one) it is worked out from the address bar. */
export function panelPrefix(route: PanelRoute | undefined, pathname = ""): string {
  if (route) return route.prefix;
  return pathname.replace(SUB_PATH, "").replace(/\/$/, "");
}

/** The full address of a path inside the panel. */
export function panelUrl(route: PanelRoute | undefined, path: string, pathname = ""): string {
  return `${panelPrefix(route, pathname)}${path}`;
}

/**
 * Go to a path inside the panel, the way Home Assistant's own frontend moves:
 * a new history entry (or, with `replace`, the current one rewritten), then
 * `location-changed`. Gives back the route the panel is now at, so the caller
 * can draw it at once rather than wait for Home Assistant to hand it over;
 * undefined when the address did not change.
 */
export function navigatePanel(route: PanelRoute | undefined, path: string, replace = false): PanelRoute | undefined {
  const prefix = panelPrefix(route, window.location.pathname);
  const url = `${prefix}${path}`;
  if (url === "" || url === window.location.pathname) return undefined;
  if (replace) history.replaceState(history.state, "", url);
  else history.pushState(null, "", url);
  window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace } }));
  return { prefix, path };
}

/** A plain left click, which the panel turns into its own move. Anything
 * else (a middle click, ⌘ or Ctrl for a new tab, Shift for a window) is left
 * to the browser and the link's own address. */
export function isPlainClick(e: Pick<MouseEvent, "button" | "metaKey" | "ctrlKey" | "shiftKey" | "altKey">): boolean {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

/** Whether the complication editor's keyboard shortcuts are live: only on
 * the Complications tab with a design open. On Home, on the list with
 * nothing open and on every watch screen they stay still, so a key never
 * acts on a draft that is out of sight. */
export function editorKeysLive(route: PanelRoute | undefined, hasDraft: boolean): boolean {
  return hasDraft && tabOfRoute(route) === "complications";
}

/** ⌘S or Ctrl+S, read the way the editor reads it. */
export function isSaveKey(e: Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey">): boolean {
  return (e.metaKey || e.ctrlKey) && e.key === "s";
}

/** Whether ⌘S or Ctrl+S is held back from the browser while the editor's
 * keys are still: on Home and on the list with nothing open, where it would
 * otherwise open the browser's Save Page dialog. A watch screen saves on it
 * itself, so there the key is left alone; the Settings page is the panel's
 * own, and the panel saves it (`settingsPageSavesOnKey`). */
export function swallowsSaveKey(route: PanelRoute | undefined, hasDraft: boolean): boolean {
  return !editorKeysLive(route, hasDraft) && tabOfRoute(route) !== "watch";
}

/**
 * Where the panel should be on first open, when that is not where it is.
 *
 * A share link (`#…`) opens Import, which belongs to the Complications tab.
 * Nothing else moves the panel: opening it with no path is always Home, even
 * when a complication was open before (`reopensDesign`). Undefined: stay.
 */
export function landingPath(route: PanelRoute | undefined, why: { shareLink: boolean }): string | undefined {
  if (tabOfRoute(route) === "complications") return undefined;
  return why.shareLink ? COMPLICATIONS_PATH : undefined;
}

/**
 * Whether a reload reopens the complication that was open before it. Only on
 * the Complications tab, where its editor shows. Opened anywhere else (the
 * sidebar's link to Home, a watch screen) the panel starts with nothing
 * open, so Home is what the panel opens on and the Complications tab then
 * shows its list.
 */
export function reopensDesign(route: PanelRoute | undefined): boolean {
  return tabOfRoute(route) === "complications";
}

export interface TabBarInput {
  route: PanelRoute | undefined;
  admin: boolean;
  /** Whether the bar offers Home Assistant's menu: a phone, or the sidebar
   * hidden. */
  menu: boolean;
  onMenu: () => void;
  onTab: (tab: PanelTab) => void;
  /** The Watch app's shared watch, which its tab's link carries. */
  watch?: string;
}

/** The tabs, above whatever the tab draws. Each is a real link, so a middle
 * click opens it in a new browser tab; a plain click moves in place. */
export function renderTabBar(input: TabBarInput): TemplateResult {
  const current = tabOfRoute(input.route);
  const href = (tab: PanelTab) => panelUrl(input.route, tabPath(tab, input.watch), globalThis.location?.pathname ?? "");
  return html`<nav class="wa-tabs" aria-label="Wrist Assistant">
    ${input.menu ? html`<button class="wa-tabs-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
      @click=${input.onMenu}>${uiIcon("menu")}</button>` : nothing}
    <span class="wa-tabs-name">Wrist Assistant</span>
    <span class="wa-tabs-list">${tabsFor(input.admin).map((tab) => html`<a class="wa-tab ${tab === current ? "on" : ""}"
      href=${href(tab)} aria-current=${tab === current ? "page" : "false"}
      @click=${(e: MouseEvent) => {
        if (!isPlainClick(e)) return;
        e.preventDefault();
        input.onTab(tab);
      }}>${TAB_LABEL[tab]}</a>`)}</span>
  </nav>`;
}

/** The tab bar's look, added to the panel's sheet. Neutral: the tab on
 * screen is marked by weight and a grey fill, never by a hue. Every tab is a
 * box with a one pixel outline, so it reads as something to press. The bar
 * wraps on a narrow screen rather than scroll sideways. */
export const shellStyles = css`
  nav.wa-tabs {
    display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; flex: none;
    min-height: 44px; box-sizing: border-box; padding: 6px 12px;
    background: var(--wa-top); color: var(--wa-ink); border-bottom: 1px solid var(--wa-line);
    position: relative; z-index: 21;
  }
  .wa-tabs-name { font-size: 14px; font-weight: 600; letter-spacing: -.01em; white-space: nowrap; }
  .wa-tabs-list { display: flex; flex-wrap: wrap; gap: 6px; min-width: 0; }
  a.wa-tab {
    display: inline-flex; align-items: center; height: 28px; padding: 0 12px; border-radius: 6px;
    font-size: 13px; font-weight: 500; color: var(--wa-muted); text-decoration: none; white-space: nowrap;
    border: 1px solid var(--wa-line-strong); background: transparent;
  }
  a.wa-tab:hover { color: var(--wa-ink); background: var(--wa-hover); }
  a.wa-tab:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  a.wa-tab.on {
    color: var(--wa-ink); font-weight: 600;
    background: color-mix(in srgb, var(--wa-ink) 10%, transparent);
  }
  button.wa-tabs-menu {
    display: grid; place-items: center; width: 30px; height: 30px; padding: 0; margin-left: -4px; border-radius: 6px; cursor: pointer;
    color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line-strong);
  }
  button.wa-tabs-menu:hover { background: var(--wa-hover); }
  button.wa-tabs-menu:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.wa-tabs-menu svg.ui-icon { width: 16px; height: 16px; }
`;
