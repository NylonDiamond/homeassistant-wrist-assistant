// The panel's shell: the four tabs across the top (Home, Watch app, iPhone
// app, Complications), which address each one lives at, and the bar that
// moves between them.
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
//   /cameras            how each camera is framed in alerts, the camera's
//                       own and shared likewise
//   /settings, with an optional /<owner_watch_id>
//                       the Watch app's Settings page
//   /iphone/pages, /iphone/menus, /iphone/status-pages, /iphone/rooms,
//   /iphone/settings, each with an optional /<owner_watch_id>
//                       the iPhone app, on a home with phone pages: the
//                       watch address of the same screen behind `/iphone`,
//                       so each screen's own reader finds the iPhone in it.
//                       `/iphone` alone is its Pages.
//   /watch-complications, with an optional /<owner_watch_id>
//                       the complications on one watch, a view of the
//                       Complications tab's cards
//
// Every watch address is the one the iPhone app builds for "Open in Home
// Assistant", unchanged; this file only reads them. An older iPhone app
// opens its own pages at `/pages/<iphone id>`, which the panel moves to the
// iPhone app (`iphoneAddressFor` in `phone-pages.ts`).
//
// Moving between tabs is the watch hooks' way: a new history entry, then
// `location-changed`, which makes Home Assistant hand the panel the new route.

import { css, html, nothing, type TemplateResult } from "lit";
import { uiIcon } from "./ui-icons.js";
import { WATCH_CAMERAS_PATH, isWatchCamerasRoute } from "./watch-cameras/hook.js";
import { WATCH_COMPLICATIONS_PATH, isWatchComplicationsRoute } from "./watch-complications.js";
import { WATCH_CONTROL_CENTER_PATH, isWatchControlCenterRoute } from "./watch-control-center/hook.js";
import { WATCH_HTTP_ACTIONS_PATH, isWatchHttpActionsRoute } from "./watch-http-actions/hook.js";
import { WATCH_MENUS_PATH, isWatchMenusRoute } from "./watch-menus/hook.js";
import { type PanelRoute, WATCH_PAGES_PATH, isWatchPagesRoute } from "./watch-pages/hook.js";
import { WATCH_ROOMS_PATH, isWatchRoomsRoute } from "./watch-rooms/hook.js";
import { WATCH_SETTINGS_PATH, isWatchSettingsRoute } from "./watch-settings-page.js";
import { WATCH_STATUS_PAGES_PATH, isWatchStatusPagesRoute } from "./watch-status-pages/hook.js";
import { WATCH_VOICE_PATH, isWatchVoiceRoute } from "./watch-voice/hook.js";

export type PanelTab = "home" | "watch" | "iphone" | "complications";

/** Home is the panel's own address, with nothing after it. */
export const HOME_PATH = "";
export const COMPLICATIONS_PATH = "/complications";
/** The iPhone app's addresses all start with this. */
export const IPHONE_PATH = "/iphone";

export const TAB_LABEL: Record<PanelTab, string> = {
  home: "Home",
  watch: "Watch app",
  iphone: "iPhone app",
  complications: "Complications",
};

/** One of the watch app's screens, as Home lists them and the watch row
 * walks them. */
export interface WatchScreen {
  id: "pages" | "menus" | "status-pages" | "control-center" | "rooms" | "voice" | "watch-complications" | "http-actions" | "cameras" | "settings";
  label: string;
  /** What the screen is, written to follow its name as one sentence: the
   * Watch app row's line under it reads "**Pages** are the screens you swipe
   * between…" (`watchScreenSentence`). Plain words, as the Help sheet reads
   * them too. */
  blurb: string;
  path: string;
  /** Shared by every watch: the address never names one, and the screen
   * follows none. */
  shared?: true;
  /** No longer linked from the watch row or Home: its address still works,
   * so an old link lands on the screen. Control Center is one: its tiles
   * moved into complication controls. */
  retired?: true;
}

/** In the order Home and the watch row show them. */
export const WATCH_SCREENS: readonly WatchScreen[] = [
  { id: "pages", label: "Pages", blurb: "are the screens you swipe between on the watch: tiles for lights, scenes, cameras and more.", path: WATCH_PAGES_PATH },
  { id: "menus", label: "Menus", blurb: "are the quick menus on the watch: the Anywhere menu, a menu for each kind of entity and the page switcher.", path: WATCH_MENUS_PATH },
  { id: "status-pages", label: "Status pages", blurb: "are lists to read at a glance, like the lights that are on or low batteries, opened from a tile, a menu or Siri.", path: WATCH_STATUS_PAGES_PATH },
  { id: "control-center", label: "Control Center", blurb: "The list of controls", path: WATCH_CONTROL_CENTER_PATH, retired: true },
  { id: "rooms", label: "Rooms", blurb: "let the watch open a room's page when you are in that room, and set up point control: point the watch at a thing to control it.", path: WATCH_ROOMS_PATH },
  { id: "voice", label: "Voice", blurb: "sets how the watch listens and speaks: the Assist and Speak defaults, your saved phrases and the watch voice.", path: WATCH_VOICE_PATH },
  { id: "watch-complications", label: "Complications", blurb: "are what this watch's faces show, with every other design you could add under them, made in the Complications tab.", path: WATCH_COMPLICATIONS_PATH },
  { id: "http-actions", label: "HTTP actions", blurb: "are web requests Home Assistant sends when a watch runs one from a tile, a menu or a complication, shared by every watch.", path: WATCH_HTTP_ACTIONS_PATH, shared: true },
  { id: "cameras", label: "Cameras", blurb: "sets how each camera's picture is framed in alerts, the same on the watch and the iPhone.", path: WATCH_CAMERAS_PATH, shared: true },
];

/** The Settings page: a screen of the Watch app with an address like the
 * others, kept out of `WATCH_SCREENS` because Home lists it on its own (its
 * Devices card, and the pairing card in a home with no watch) and the row
 * draws it last, apart from the eight. */
export const WATCH_SETTINGS_SCREEN: WatchScreen = {
  id: "settings", label: "Settings", blurb: "sets how the watch behaves: gestures, wrist twists, pages, cameras and how it connects.", path: WATCH_SETTINGS_PATH,
};

/** A screen's name and what it is, as one sentence. */
export function watchScreenSentence(screen: WatchScreen): string {
  return `${screen.label} ${screen.blurb}`;
}

/** A watch screen's address, on one watch when one is named. The owner is
 * encoded the way each screen's `watch*RouteOwner` decodes it. A shared
 * screen's address never names a watch. */
export function watchScreenPath(screen: WatchScreen, owner?: string): string {
  return owner && screen.shared !== true ? `${screen.path}/${encodeURIComponent(owner)}` : screen.path;
}

/** The watch screen a route is on, or undefined off the Watch app. */
export function watchScreenOf(route: PanelRoute | undefined): WatchScreen | undefined {
  const of = (id: WatchScreen["id"]) => WATCH_SCREENS.find((screen) => screen.id === id);
  if (isWatchPagesRoute(route)) return of("pages");
  if (isWatchMenusRoute(route)) return of("menus");
  if (isWatchStatusPagesRoute(route)) return of("status-pages");
  if (isWatchControlCenterRoute(route)) return of("control-center");
  if (isWatchRoomsRoute(route)) return of("rooms");
  if (isWatchVoiceRoute(route)) return of("voice");
  if (isWatchComplicationsRoute(route)) return of("watch-complications");
  if (isWatchHttpActionsRoute(route)) return of("http-actions");
  if (isWatchCamerasRoute(route)) return of("cameras");
  if (isWatchSettingsRoute(route)) return WATCH_SETTINGS_SCREEN;
  return undefined;
}

/** The screens an iPhone has: the four kinds it keeps, and Settings for the
 * settings that make sense on a phone. */
const IPHONE_SCREEN_IDS: ReadonlySet<WatchScreen["id"]> = new Set(["pages", "menus", "status-pages", "rooms", "settings"]);

/** Whether a screen edits an iPhone too. */
export function screenTakesPhone(screen: Pick<WatchScreen, "id">): boolean {
  return IPHONE_SCREEN_IDS.has(screen.id);
}

/** The iPhone app's screens, in the order the watch row walks them. Settings
 * is drawn last and apart, as on the watch row. */
export const IPHONE_SCREENS: readonly WatchScreen[] = WATCH_SCREENS.filter(screenTakesPhone);

/** The watch address an iPhone app address wraps: `/iphone/pages/p1` reads
 * as `/pages/p1`, so every screen's own reader works on it. `/iphone` alone
 * is Pages. Undefined off the iPhone app. */
export function iphoneInnerRoute(route: PanelRoute | undefined): PanelRoute | undefined {
  const path = route?.path ?? "";
  if (route === undefined || (path !== IPHONE_PATH && !path.startsWith(`${IPHONE_PATH}/`))) return undefined;
  const rest = path.slice(IPHONE_PATH.length);
  return { prefix: route.prefix, path: rest === "" || rest === "/" ? WATCH_PAGES_PATH : rest };
}

/** The iPhone app screen a route is on, or undefined off the iPhone app. A
 * watch only screen behind `/iphone` is no iPhone screen. */
export function iphoneScreenOf(route: PanelRoute | undefined): WatchScreen | undefined {
  const screen = watchScreenOf(iphoneInnerRoute(route));
  return screen !== undefined && screenTakesPhone(screen) ? screen : undefined;
}

/** An iPhone app screen's address, on one iPhone when one is named. */
export function iphoneScreenPath(screen: WatchScreen, owner?: string): string {
  return `${IPHONE_PATH}${watchScreenPath(screen, owner)}`;
}

/** A screen's address on one device: the iPhone app's for an iPhone, the
 * Watch app's for a watch. */
export function deviceScreenPath(kind: "watch" | "iphone", screen: WatchScreen, owner: string): string {
  return kind === "iphone" ? iphoneScreenPath(screen, owner) : watchScreenPath(screen, owner);
}

export function isComplicationsRoute(route: PanelRoute | undefined): boolean {
  const path = route?.path ?? "";
  return path === COMPLICATIONS_PATH || path.startsWith(`${COMPLICATIONS_PATH}/`);
}

/** Which tab a route shows. Anything the panel does not know, an empty path
 * and a missing route included, is Home. */
export function tabOfRoute(route: PanelRoute | undefined): PanelTab {
  if (watchScreenOf(route) !== undefined) return "watch";
  if (iphoneScreenOf(route) !== undefined) return "iphone";
  if (isComplicationsRoute(route)) return "complications";
  return "home";
}

/** The screen a route shows, as the leave question counts screens: one of
 * the Watch app's nine, or the Home or Complications tab. An iPhone app
 * screen counts as the watch screen of the same name: it is the same editor,
 * with the same drafts kept per device, so moving between the two is a move
 * to another device. The device an address names, and anything after it, is
 * not part of it. */
export function screenIdOf(route: PanelRoute | undefined): WatchScreen["id"] | "home" | "complications" {
  return watchScreenOf(route)?.id ?? iphoneScreenOf(route)?.id ?? (tabOfRoute(route) as "home" | "complications");
}

/** Where a click on a tab goes. The Watch app opens on Pages, on the shared
 * watch when there is one, and the iPhone app on Pages of its shared iPhone
 * (`watch-pick.ts`). */
export function tabPath(tab: PanelTab, watch?: string, iphone?: string): string {
  if (tab === "complications") return COMPLICATIONS_PATH;
  if (tab === "watch") return watchScreenPath(WATCH_SCREENS[0]!, watch);
  if (tab === "iphone") return iphoneScreenPath(IPHONE_SCREENS[0]!, iphone);
  return HOME_PATH;
}

/** The tabs across the top, in order. Every signed in person gets them all:
 * the server lists each person only the devices they may manage. The iPhone
 * app only shows on a home with phone pages (`panelTabs`). */
export const PANEL_TABS: readonly PanelTab[] = ["home", "watch", "iphone", "complications"];

/** The tabs the bar shows: all of them on a home with phone pages, else all
 * but the iPhone app, unless it is the tab on screen. */
export function panelTabs(phones: boolean, current?: PanelTab): PanelTab[] {
  return PANEL_TABS.filter((tab) => tab !== "iphone" || phones || current === "iphone");
}

/** Every tab's sub-path, as one pattern anchored at the end of an address:
 * the first one in it and everything after. */
const SUB_PATH = new RegExp(`(${[
  IPHONE_PATH, COMPLICATIONS_PATH, WATCH_PAGES_PATH, WATCH_MENUS_PATH, WATCH_VOICE_PATH,
  WATCH_STATUS_PAGES_PATH, WATCH_CONTROL_CENTER_PATH, WATCH_ROOMS_PATH, WATCH_HTTP_ACTIONS_PATH, WATCH_CAMERAS_PATH, WATCH_SETTINGS_PATH,
  WATCH_COMPLICATIONS_PATH,
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

/** From inside an editor to the HTTP actions screen, the panel's own way. An
 * editor's draft outlives its route, as on any move between screens, so
 * nothing is lost and the leave guards still cover it. */
export function goToWatchHttpActions(): void {
  navigatePanel(undefined, WATCH_HTTP_ACTIONS_PATH);
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
 * otherwise open the browser's Save Page dialog. A watch or iPhone screen
 * saves on it itself, so there the key is left alone; the Settings page is
 * the panel's own, and the panel saves it (`settingsPageSavesOnKey`). */
export function swallowsSaveKey(route: PanelRoute | undefined, hasDraft: boolean): boolean {
  const tab = tabOfRoute(route);
  return !editorKeysLive(route, hasDraft) && tab !== "watch" && tab !== "iphone";
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
  /** Whether the bar offers Home Assistant's menu: a phone, or the sidebar
   * hidden. */
  menu: boolean;
  onMenu: () => void;
  onTab: (tab: PanelTab) => void;
  /** The Watch app's shared watch, which its tab's link carries. */
  watch?: string;
  /** The iPhone app's shared iPhone, likewise. */
  iphone?: string;
  /** The home has phone pages: the bar shows the iPhone app. */
  phones?: boolean;
  /** Open the Help sheet (`help-sheet.ts`). The Help button sits at the
   * bar's right end, on every tab; without this there is none. */
  onHelp?: () => void;
  /** Whether any watch screen holds unsaved work: the Watch app tab then
   * carries an orange dot, seen from Home and Complications too. */
  watchUnsaved?: boolean;
}

/** A question mark in a circle, the Help button's sign, drawn at the stroke
 * of `uiIcon`'s set. */
const HELP_ICON = html`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5" />
  <path d="M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.7" /><path d="M12 17V17.2" /></svg>`;

/** The tabs, above whatever the tab draws. Each is a real link, so a middle
 * click opens it in a new browser tab; a plain click moves in place. */
export function renderTabBar(input: TabBarInput): TemplateResult {
  const current = tabOfRoute(input.route);
  const href = (tab: PanelTab) => panelUrl(input.route, tabPath(tab, input.watch, input.iphone), globalThis.location?.pathname ?? "");
  return html`<nav class="wa-tabs" aria-label="Wrist Assistant">
    ${input.menu ? html`<button class="wa-tabs-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
      @click=${input.onMenu}>${uiIcon("menu")}</button>` : nothing}
    <span class="wa-tabs-name">Wrist Assistant</span>
    <span class="wa-tabs-list">${panelTabs(input.phones === true, current).map((tab) => html`<a class="wa-tab ${tab === current ? "on" : ""}"
      href=${href(tab)} aria-current=${tab === current ? "page" : "false"}
      @click=${(e: MouseEvent) => {
        if (!isPlainClick(e)) return;
        e.preventDefault();
        input.onTab(tab);
      }}>${TAB_LABEL[tab]}${tab === "watch" && input.watchUnsaved === true ? unsavedDot() : nothing}</a>`)}</span>
    ${input.onHelp ? html`<button type="button" class="wa-tabs-help" title="Help and setup guide" aria-label="Help" aria-haspopup="dialog"
      @click=${input.onHelp}>${HELP_ICON}<span>Help</span></button>` : nothing}
  </nav>`;
}

/** The orange dot that marks unsaved work, on the Watch app tab and on each
 * screen of the Watch app row. A screen reader hears it as words. */
export function unsavedDot(): TemplateResult {
  return html`<i class="wa-unsaved" role="img" aria-label="unsaved changes"></i>`;
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
  /* Help, neutral and outlined like a tab, pushed to the bar's right end. */
  button.wa-tabs-help {
    display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 11px 0 9px; margin-left: auto; border-radius: 6px;
    font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap;
    color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line-strong);
  }
  button.wa-tabs-help:hover { background: var(--wa-hover); }
  button.wa-tabs-help:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.wa-tabs-help svg.ui-icon { width: 15px; height: 15px; }
  /* A phone: the name on top, then the tabs and Help on one line under it.
     The empty ::after is the line break, a full width item of no height, so
     the rows carry their own margins instead of a row gap counted twice.
     Help keeps only its sign, and the tabs slide sideways rather than wrap
     if a very narrow screen cannot hold all three. */
  @media (max-width: 480px) {
    nav.wa-tabs { row-gap: 0; padding-block: 3px; }
    nav.wa-tabs > * { margin-block: 3px; }
    nav.wa-tabs::after { content: ""; order: 1; flex: 0 0 100%; height: 0; margin: 0; }
    .wa-tabs-list, button.wa-tabs-help { order: 2; }
    .wa-tabs-list {
      flex: 1 1 0; min-width: 0; flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none;
      margin: 0 0 0 -3px; padding: 3px;
    }
    .wa-tabs-list::-webkit-scrollbar { display: none; }
    a.wa-tab { flex: none; padding: 0 10px; }
    button.wa-tabs-help { width: 28px; padding: 0; justify-content: center; flex: none; }
    button.wa-tabs-help > span { display: none; }
  }
  @media (max-width: 380px) {
    a.wa-tab { padding: 0 8px; font-size: 12.5px; }
  }
  /* Orange, the one hue in the tabs and the row: it says "not saved yet",
     so it never stands for the tab or the screen on show. */
  i.wa-unsaved {
    display: inline-block; flex: none; width: 6px; height: 6px; margin-left: 6px; border-radius: 50%;
    background: var(--wa-hue-orange);
  }
`;
