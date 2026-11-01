// The panel's shell: the tabs across the top (Devices, Pages, Status pages,
// Menus, Complications, Shared; `BAR_TABS`), which address each screen lives
// at, and the bar that moves between them. A watch's or an iPhone's own
// screens have no tab: each lights the tab it belongs to (`barTabOfScreen`).
//
// The tab is never stored. It is read from the route Home Assistant hands the
// panel, so a reload, a bookmark and the browser's Back button all agree with
// what is on screen:
//
//   "", /devices        the Devices tab (once Home; its id is still "home")
//   /devices/<owner_watch_id>, /devices/all
//                       one device's page, or every device (`devicePath`)
//   /shared             the Shared tab's landing page: one card for each
//                       thing the whole home keeps (`SHARED_PATH`)
//   /complications      the complication list, and the editor once a design
//                       is open (the open draft decides, not the address)
//   /complications/design/<owner>/<id>
//                       one design open in the editor (`designPath`)
//   /pages, /menus, /voice, /status-pages, /control-center, /rooms, each with
//   an optional /<owner_watch_id>
//                       the Watch app, as before
//   /http-actions       the home's HTTP actions, shared by every device, so
//                       the address never names one
//   /cameras            how each camera is framed in alerts, the camera's
//                       own and shared likewise
//   /home-map           the home's map, its rooms and device pins, the
//                       home's and shared likewise (with `home_map`)
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
//   /all-pages          the Pages tab: every page on every watch and
//                       iPhone (`watch-pages/all-pages.ts`). Not `/pages`,
//                       which is the Watch app's page editor
//   /all-status-pages   the Status pages tab: every status page, the same
//                       element. Not `/status-pages`, which is the Watch
//                       app's status pages editor and marks Home
//   /all-menus          the Menus tab: every Anywhere menu and Entity
//                       quick menu on every device
//                       (`watch-menus/all-menus.ts`). Not `/menus`, the
//                       Watch app's menu editor, which marks Home
//   /library/pages/<id>, /library/status-pages/<id>, /library/menus/<id>
//                       one item edited in the library itself, in its
//                       kind's editor with no device (`library/item-mode.ts`).
//                       It marks its kind's tab, and Back goes there
//
// Every watch address is the one the iPhone app builds for "Open in Home
// Assistant", unchanged; this file only reads them. An older iPhone app
// opens its own pages at `/pages/<iphone id>`, which the panel moves to the
// iPhone app (`iphoneAddressFor` in `phone-pages.ts`).
//
// Moving between tabs is the watch hooks' way: a new history entry, then
// `location-changed`, which makes Home Assistant hand the panel the new route.

import { css, html, nothing, type TemplateResult } from "lit";
import type { LibraryKind } from "./library/client.js";
import type { LibraryItemRef } from "./library/item-mode.js";
import { type UiIconName, uiIcon } from "./ui-icons.js";

export type { LibraryItemRef };
import { HOME_MAP_PATH, isHomeMapRoute } from "./home-map/hook.js";
import { HOME_MAP_CAPABILITY } from "./home-map/store.js";
import { WATCH_CAMERAS_PATH, isWatchCamerasRoute } from "./watch-cameras/hook.js";
import { WATCH_COMPLICATIONS_PATH, isWatchComplicationsRoute } from "./watch-complications.js";
import { WATCH_CONTROL_CENTER_PATH, isWatchControlCenterRoute } from "./watch-control-center/hook.js";
import { WATCH_HTTP_ACTIONS_PATH, isWatchHttpActionsRoute } from "./watch-http-actions/hook.js";
import { ALL_MENUS_PATH } from "./watch-menus/all-menus-hook.js";
import { WATCH_MENUS_PATH, isWatchMenusRoute } from "./watch-menus/hook.js";
import { ALL_PAGES_PATH, ALL_STATUS_PAGES_PATH, listFocusPath } from "./watch-pages/all-pages-hook.js";
import { type PanelRoute, WATCH_PAGES_PATH, isWatchPagesRoute } from "./watch-pages/hook.js";
import { WATCH_ROOMS_PATH, isWatchRoomsRoute } from "./watch-rooms/hook.js";
import { WATCH_SETTINGS_PATH, isWatchSettingsRoute } from "./watch-settings-page.js";
import { WATCH_STATUS_PAGES_PATH, isWatchStatusPagesRoute } from "./watch-status-pages/hook.js";
import { WATCH_VOICE_PATH, isWatchVoiceRoute } from "./watch-voice/hook.js";

/** The panel's own address, with nothing after it: the sidebar's link. It
 * shows the Devices tab, as `DEVICES_PATH` does. */
export const HOME_PATH = "";
/** The Devices tab (the old Home): `/devices`, then one device's page at
 * `/devices/<owner_watch_id>` and every device at `/devices/all`
 * (`devicePath`, `deviceRouteOf`). Its tab id stays "home". */
export const DEVICES_PATH = "/devices";
/** `/devices/all`: every device at once, in place of one. */
export const DEVICES_ALL = "all";
/** The Shared tab's landing page: what the whole home keeps once (HTTP
 * actions, Camera framing, the Home map), each a card that opens its
 * screen. */
export const SHARED_PATH = "/shared";
export const COMPLICATIONS_PATH = "/complications";
/** One complication open in the editor: `/complications/design/<owner>/<id>`
 * (`designPath`, `designRouteOf`). */
export const DESIGN_SEGMENT = "design";
/** The iPhone app's addresses all start with this. */
export const IPHONE_PATH = "/iphone";

/**
 * The tabs across the top, in the bar's order: each one's id, its name, the
 * address it opens on and its glyph. A route at that address or under it is
 * that tab (`tabOfRoute`), and so is the panel's bare address (`HOME_PATH`),
 * which is Devices. A new tab is one line here, then its screen in the
 * panel's `renderTab`.
 *
 * The Devices tab keeps the id "home" it had as Home, so the panel's many
 * "on Home" checks read the same; only its name and address changed.
 * Shared sits apart after a hairline: it holds what no one device owns.
 */
export const BAR_TABS = [
  { id: "home", label: "Devices", path: DEVICES_PATH, icon: "watch" },
  { id: "pages", label: "Pages", path: ALL_PAGES_PATH, icon: "pages" },
  { id: "status-pages", label: "Status pages", path: ALL_STATUS_PAGES_PATH, icon: "checklist" },
  { id: "menus", label: "Menus", path: ALL_MENUS_PATH, icon: "radial" },
  { id: "complications", label: "Complications", path: COMPLICATIONS_PATH, icon: "gauge" },
  { id: "shared", label: "Shared", path: SHARED_PATH, icon: "layers" },
] as const satisfies readonly { id: string; label: string; path: string; icon: UiIconName }[];

/** A tab of the bar. */
export type BarTab = (typeof BAR_TABS)[number]["id"];

/** Which part of the panel a route shows: a tab of the bar, or a watch's or
 * an iPhone's own screens, which have no tab. */
export type PanelTab = BarTab | "watch" | "iphone";

/** A bar tab's glyph (`uiIcon`). */
export const TAB_ICON: Record<BarTab, UiIconName> = Object.fromEntries(BAR_TABS.map((t) => [t.id, t.icon])) as Record<BarTab, UiIconName>;

export const TAB_LABEL: Record<PanelTab, string> = {
  ...(Object.fromEntries(BAR_TABS.map((t) => [t.id, t.label])) as Record<BarTab, string>),
  watch: "Watch app",
  iphone: "iPhone app",
};

/** One of the watch app's screens, as Home lists them and the watch row
 * walks them. */
export interface WatchScreen {
  id: "pages" | "menus" | "status-pages" | "control-center" | "rooms" | "voice" | "watch-complications" | "http-actions" | "cameras" | "home-map" | "settings";
  label: string;
  /** What the screen is, written to follow its name as one sentence: the
   * Watch app row's line under it reads "**Pages** are the screens you swipe
   * between…" (`watchScreenSentence`). Plain words, as the Help sheet reads
   * them too. */
  blurb: string;
  path: string;
  /** Shared by every watch: the address never names one, and the screen
   * follows none. These are Home's Library. */
  shared?: true;
  /** No longer linked from the watch row or Home, and no screen of its own:
   * its address still works and moves to the Complications board. Control
   * Center is one: its tiles moved into complication controls. */
  retired?: true;
  /** Still being tried out: Home draws a BETA pill after its name, or an
   * ALPHA pill for "alpha". */
  beta?: true | "alpha";
  /** Listed only once the integration advertises this capability: the
   * Home map, with `home_map` (`home-map/store.ts`). Its address still
   * opens without it and says to update the integration. */
  capability?: string;
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
  { id: "http-actions", label: "HTTP actions", blurb: "are web requests Home Assistant sends when a watch or an iPhone runs one from a tile, a menu or a complication, shared by every watch and iPhone.", path: WATCH_HTTP_ACTIONS_PATH, shared: true },
  // "Camera framing", not "Cameras": Settings has a Cameras group of its
  // own, and this screen only sets how each picture is cut in alerts.
  { id: "cameras", label: "Camera framing", blurb: "sets how each camera's picture is framed in alerts, the same on the watch and the iPhone.", path: WATCH_CAMERAS_PATH, shared: true },
  // One pre-release word for the Home map everywhere: BETA, read from here.
  { id: "home-map", label: "Home map", blurb: "is the plan of your home from the iPhone's scan, with a pin for each device, shown on the iPhone, the watch and a Home map tile.", path: HOME_MAP_PATH, shared: true, beta: true, capability: HOME_MAP_CAPABILITY },
];

/** The Settings page: a screen of the Watch app with an address like the
 * others, kept out of `WATCH_SCREENS` because Home lists it on its own (its
 * Devices card, and the pairing card in a home with no watch) and the row
 * draws it last, apart from the others. */
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
  if (isHomeMapRoute(route)) return of("home-map");
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
 * Watch app's for a watch. A device's Pages, Status pages and Menus are its
 * column on the board (`deviceListPath`). */
export function deviceScreenPath(kind: "watch" | "iphone", screen: WatchScreen, owner: string): string {
  return deviceListPath(screen.id, owner) ?? (kind === "iphone" ? iphoneScreenPath(screen, owner) : watchScreenPath(screen, owner));
}

/** A device's own Pages, Status pages or Menus screen is its column on the
 * board now (plan step 4): that tab's address, focused on the device, or on
 * every device with no owner. Undefined for any other screen. */
export function deviceListPath(id: WatchScreen["id"], owner: string | undefined): string | undefined {
  const base = id === "pages" ? ALL_PAGES_PATH : id === "status-pages" ? ALL_STATUS_PAGES_PATH : id === "menus" ? ALL_MENUS_PATH : undefined;
  return base === undefined ? undefined : listFocusPath(base, owner);
}

export function isComplicationsRoute(route: PanelRoute | undefined): boolean {
  const path = route?.path ?? "";
  return path === COMPLICATIONS_PATH || path.startsWith(`${COMPLICATIONS_PATH}/`);
}

/** Every library item's own address starts with this: one page, status page
 * or menu edited in the library, with no device (`libraryItemPath`). */
export const LIBRARY_PATH = "/library";

/** The address part of each kind under `LIBRARY_PATH`, and the tab its
 * address marks. */
const LIBRARY_SEGMENTS: readonly { kind: LibraryKind; segment: string; tab: BarTab; screen: WatchScreen["id"] }[] = [
  { kind: "pages", segment: "pages", tab: "pages", screen: "pages" },
  { kind: "status_pages", segment: "status-pages", tab: "status-pages", screen: "status-pages" },
  { kind: "menus", segment: "menus", tab: "menus", screen: "menus" },
];

/** One item's address in the library: `/library/pages/<id>`,
 * `/library/status-pages/<id>` or `/library/menus/<id>`. Opened from one
 * device's focused board, the device follows (`/library/pages/<id>/<owner>`):
 * the editor rings it, and Back goes to that board. */
export function libraryItemPath(kind: LibraryKind, id: string, from?: string): string {
  const segment = LIBRARY_SEGMENTS.find((s) => s.kind === kind)!.segment;
  const base = `${LIBRARY_PATH}/${segment}/${encodeURIComponent(id)}`;
  return from === undefined || from === "" ? base : `${base}/${encodeURIComponent(from)}`;
}

/** The item a library address names, or undefined for any other route. */
export function libraryRouteOf(route: PanelRoute | undefined): LibraryItemRef | undefined {
  const path = route?.path ?? "";
  if (!path.startsWith(`${LIBRARY_PATH}/`)) return undefined;
  const [segment, raw, fromRaw, ...rest] = path.slice(LIBRARY_PATH.length + 1).split("/");
  const known = LIBRARY_SEGMENTS.find((s) => s.segment === segment);
  if (known === undefined || raw === undefined || raw === "" || rest.some((p) => p !== "")) return undefined;
  let id: string;
  let from: string | undefined;
  try {
    id = decodeURIComponent(raw);
    from = fromRaw === undefined || fromRaw === "" ? undefined : decodeURIComponent(fromRaw);
  } catch {
    return undefined;
  }
  return from === undefined ? { kind: known.kind, id } : { kind: known.kind, id, from };
}

/** The tab a library address marks: the item's kind's. */
function libraryTabOf(ref: LibraryItemRef): BarTab {
  return LIBRARY_SEGMENTS.find((s) => s.kind === ref.kind)!.tab;
}

/** Which tab a route shows. Anything the panel does not know, an empty path
 * and a missing route included, is Home. A library item's address is its
 * kind's tab. */
export function tabOfRoute(route: PanelRoute | undefined): PanelTab {
  if (watchScreenOf(route) !== undefined) return "watch";
  if (iphoneScreenOf(route) !== undefined) return "iphone";
  const item = libraryRouteOf(route);
  if (item !== undefined) return libraryTabOf(item);
  const path = route?.path ?? "";
  const tab = BAR_TABS.find((t) => path === t.path || path.startsWith(`${t.path}/`));
  return tab?.id ?? "home";
}

/** The leave question's name for a tab that lists things across devices,
 * kept apart from the device screen of the same name: the Pages tab is
 * "all-pages", never the page editor's "pages", the Status pages tab
 * "all-status-pages" and the Menus tab "all-menus". */
type ListScreenId = `all-${Exclude<BarTab, "home" | "complications" | "shared">}`;

/** The screen a route shows, as the leave question counts screens: one of
 * the Watch app's screens, Home, Complications, or a tab that lists things
 * (`ListScreenId`). An iPhone app screen counts as the watch screen of the
 * same name: it is the same editor, with the same drafts kept per device, so
 * moving between the two is a move to another device. The device an address
 * names, and anything after it, is not part of it. A library item's address
 * counts as its kind's editor too, whose drafts it keeps beside the
 * devices'. */
export function screenIdOf(route: PanelRoute | undefined): WatchScreen["id"] | "home" | "complications" | "shared" | ListScreenId {
  const item = libraryRouteOf(route);
  if (item !== undefined) return LIBRARY_SEGMENTS.find((s) => s.kind === item.kind)!.screen;
  const id = watchScreenOf(route)?.id ?? iphoneScreenOf(route)?.id;
  if (id !== undefined) return id;
  const tab = barTabOf(route);
  return tab === "home" || tab === "complications" || tab === "shared" ? tab : `all-${tab}`;
}

/** Where a click on a tab goes. The Watch app opens on Pages, on the shared
 * watch when there is one, and the iPhone app on Pages of its shared iPhone
 * (`watch-pick.ts`). */
export function tabPath(tab: PanelTab, watch?: string, iphone?: string): string {
  if (tab === "watch") return watchScreenPath(WATCH_SCREENS[0]!, watch);
  if (tab === "iphone") return iphoneScreenPath(IPHONE_SCREENS[0]!, iphone);
  return BAR_TABS.find((t) => t.id === tab)?.path ?? HOME_PATH;
}

/** The tabs across the top, in order (`BAR_TABS`). Every signed in person
 * gets them all: the server lists each person only the devices they may
 * manage. The Watch app and the iPhone app have no tab of their own: each
 * of their screens lights the tab it belongs to (`barTabOfScreen`). */
export const PANEL_TABS: readonly BarTab[] = BAR_TABS.map((t) => t.id);

/**
 * The tab a watch or iPhone screen lights, so the bar always says where you
 * are (the review found Home lit on 7 of 12 screens): a device's Pages,
 * Status pages and Menus editors light their kind's tab, its Complications
 * (and the retired Control Center, which moved there) light Complications,
 * what the whole home keeps (HTTP actions, Camera framing, the Home map)
 * lights Shared, and the device's very own screens (Settings, Rooms, Voice)
 * light Devices, where the device's page opens them.
 */
export function barTabOfScreen(id: WatchScreen["id"]): BarTab {
  switch (id) {
    case "pages": return "pages";
    case "status-pages": return "status-pages";
    case "menus": return "menus";
    case "watch-complications":
    case "control-center": return "complications";
    case "http-actions":
    case "cameras":
    case "home-map": return "shared";
    case "rooms":
    case "voice":
    case "settings": return "home";
  }
}

/** The tab the bar marks for a route: its own tab, or for a watch's or an
 * iPhone's screen the tab that screen belongs to (`barTabOfScreen`). */
export function barTabOf(route: PanelRoute | undefined): BarTab {
  const tab = tabOfRoute(route);
  if (tab !== "watch" && tab !== "iphone") return tab;
  const screen = tab === "watch" ? watchScreenOf(route) : iphoneScreenOf(route);
  return screen === undefined ? "home" : barTabOfScreen(screen.id);
}

// ── addresses of the redesign (2026-10-31 review, fix 4) ─────────────────

/** Where one device's page is: `/devices/<owner>`, every device with
 * "all" (`DEVICES_ALL`), or the Devices tab with no device named. */
export function devicePath(owner?: string): string {
  if (owner === undefined || owner === "") return DEVICES_PATH;
  return `${DEVICES_PATH}/${owner === DEVICES_ALL ? DEVICES_ALL : encodeURIComponent(owner)}`;
}

/** What a Devices address names: one device (`{ owner }`), every device
 * (`{ all: true }`), or nothing (the bare tab, `/devices` or the panel's
 * own address), which is undefined. Undefined on every other tab too. A
 * device id spelt "all" cannot be told from every device; ids are UUIDs. */
export type DeviceRoute = { owner: string } | { all: true };

export function deviceRouteOf(route: PanelRoute | undefined): DeviceRoute | undefined {
  const path = route?.path ?? "";
  if (!path.startsWith(`${DEVICES_PATH}/`)) return undefined;
  const [raw] = path.slice(DEVICES_PATH.length + 1).split("/");
  if (raw === undefined || raw === "") return undefined;
  if (raw === DEVICES_ALL) return { all: true };
  try {
    return { owner: decodeURIComponent(raw) };
  } catch {
    return undefined;
  }
}

/** One complication's address in the editor:
 * `/complications/design/<owner>/<id>`. Push it when a design opens, so
 * Back returns to the list and a reload or a shared link reopens it. */
export function designPath(owner: string, id: string): string {
  return `${COMPLICATIONS_PATH}/${DESIGN_SEGMENT}/${encodeURIComponent(owner)}/${encodeURIComponent(id)}`;
}

/** The design a Complications address names, or undefined. */
export function designRouteOf(route: PanelRoute | undefined): { owner: string; id: string } | undefined {
  const path = route?.path ?? "";
  const head = `${COMPLICATIONS_PATH}/${DESIGN_SEGMENT}/`;
  if (!path.startsWith(head)) return undefined;
  const [owner, id, ...rest] = path.slice(head.length).split("/");
  if (owner === undefined || owner === "" || id === undefined || id === "" || rest.some((p) => p !== "")) return undefined;
  try {
    return { owner: decodeURIComponent(owner), id: decodeURIComponent(id) };
  } catch {
    return undefined;
  }
}

/** Whether a route is the Shared tab's own landing page (not one of the
 * shared screens it opens, which keep their own addresses). */
export function isSharedRoute(route: PanelRoute | undefined): boolean {
  const path = route?.path ?? "";
  return path === SHARED_PATH || path === `${SHARED_PATH}/`;
}

/**
 * An old address that now lives elsewhere, rewritten in place (no new
 * history step) so old bookmarks keep working. Undefined: it stands.
 *
 *   /library, /library/   the bare library, which landed silently on Home;
 *                         its landing page is Shared now
 *   /devices/             the bare Devices tab with a trailing slash
 */
export function redirectPath(route: PanelRoute | undefined): string | undefined {
  const path = route?.path ?? "";
  if (path === LIBRARY_PATH || path === `${LIBRARY_PATH}/`) return SHARED_PATH;
  if (path === `${DEVICES_PATH}/`) return DEVICES_PATH;
  return undefined;
}

/** Every tab's sub-path, as one pattern anchored at the end of an address:
 * the first one in it and everything after. Each bar tab's address is in
 * it, so `/all-status-pages` is never read as `/all` and then
 * `/status-pages`. */
const SUB_PATH = new RegExp(`(${[
  ...BAR_TABS.map((t) => t.path),
  LIBRARY_PATH, IPHONE_PATH, WATCH_PAGES_PATH, WATCH_MENUS_PATH, WATCH_VOICE_PATH,
  WATCH_STATUS_PAGES_PATH, WATCH_CONTROL_CENTER_PATH, WATCH_ROOMS_PATH, WATCH_HTTP_ACTIONS_PATH, WATCH_CAMERAS_PATH, WATCH_SETTINGS_PATH,
  WATCH_COMPLICATIONS_PATH, HOME_MAP_PATH,
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
  return !editorKeysLive(route, hasDraft) && tab !== "watch" && tab !== "iphone" && libraryRouteOf(route) === undefined;
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
  /** Open the Help sheet (`help-sheet.ts`). The Help button sits at the
   * bar's right end, on every tab; without this there is none. */
  onHelp?: () => void;
  /** Whether any watch or iPhone screen holds unsaved work, when the panel
   * cannot say which: the Devices tab then carries an orange dot. Prefer
   * `unsavedTabs`. */
  watchUnsaved?: boolean;
  /** The tabs whose screens hold unsaved work, each marked with an orange
   * dot seen from every other tab too (`barTabOfScreen` names the tab of a
   * device screen). */
  unsavedTabs?: ReadonlySet<BarTab>;
  /** The home's sync pill (`sync-pill.ts`), drawn before Help on every
   * screen. */
  sync?: TemplateResult | typeof nothing;
}

/** A question mark in a circle, the Help button's sign, drawn at the stroke
 * of `uiIcon`'s set. */
const HELP_ICON = html`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5" />
  <path d="M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.7" /><path d="M12 17V17.2" /></svg>`;

/** The tabs, above whatever the tab draws: one segmented group with a glyph
 * on each, Shared after a hairline, then the sync pill and Help at the
 * right. Each tab is a real link, so a middle click opens it in a new
 * browser tab; a plain click moves in place. */
export function renderTabBar(input: TabBarInput): TemplateResult {
  const current = barTabOf(input.route);
  const href = (tab: PanelTab) => panelUrl(input.route, tabPath(tab), globalThis.location?.pathname ?? "");
  const unsaved = (tab: BarTab) => input.unsavedTabs?.has(tab) === true || (tab === "home" && input.watchUnsaved === true);
  return html`<nav class="wa-tabs" aria-label="Wrist Assistant">
    ${input.menu ? html`<button class="wa-tabs-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
      @click=${input.onMenu}>${uiIcon("menu")}</button>` : nothing}
    <span class="wa-tabs-name">Wrist Assistant</span>
    <span class="wa-tabs-list">${PANEL_TABS.map((tab) => html`${tab === "shared" ? html`<span class="wa-tabs-sep" aria-hidden="true"></span>` : nothing}<a class="wa-tab ${tab === current ? "on" : ""}"
      href=${href(tab)} aria-current=${tab === current ? "page" : "false"}
      @click=${(e: MouseEvent) => {
        if (!isPlainClick(e)) return;
        e.preventDefault();
        input.onTab(tab);
      }}>${uiIcon(TAB_ICON[tab])}${TAB_LABEL[tab]}${unsaved(tab) ? unsavedDot() : nothing}</a>`)}</span>
    <span class="wa-tabs-end">${input.sync ?? nothing}${input.onHelp ? html`<button type="button" class="wa-tabs-help" title="Help and setup guide" aria-label="Help" aria-haspopup="dialog"
      @click=${input.onHelp}>${HELP_ICON}<span>Help</span></button>` : nothing}</span>
  </nav>`;
}

/** The orange dot that marks unsaved work, on the Home tab and on each
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
  /* One segmented group, the panel's own switch look: a field with a one
     pixel inset outline, and the tab on screen raised in the switch's "on"
     fill with a light rim, so it reads at a glance. */
  .wa-tabs-list {
    display: inline-flex; flex-wrap: wrap; align-items: center; gap: 2px; min-width: 0; padding: 2px;
    border-radius: 8px; background: var(--wa-field, var(--wa-panel)); box-shadow: inset 0 0 0 1px var(--wa-line-strong);
  }
  a.wa-tab {
    display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 10px; border-radius: 6px;
    font-size: 13px; font-weight: 500; color: var(--wa-muted); text-decoration: none; white-space: nowrap;
    background: transparent;
  }
  a.wa-tab svg.ui-icon { width: 13px; height: 13px; flex: none; }
  a.wa-tab:hover { color: var(--wa-ink); background: var(--wa-hover); }
  a.wa-tab:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  a.wa-tab.on {
    color: var(--wa-ink); font-weight: 600; background: var(--wa-seg-on);
    outline: 1px solid color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); outline-offset: -1px;
  }
  .wa-tabs-sep { width: 1px; height: 16px; margin: 0 4px; background: var(--wa-line-strong); flex: none; }
  /* The sync pill and Help, together at the bar's right end. */
  .wa-tabs-end { display: inline-flex; align-items: center; gap: 8px; margin-left: auto; }
  button.wa-tabs-menu {
    display: grid; place-items: center; width: 30px; height: 30px; padding: 0; margin-left: -4px; border-radius: 6px; cursor: pointer;
    color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line-strong);
  }
  button.wa-tabs-menu:hover { background: var(--wa-hover); }
  button.wa-tabs-menu:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.wa-tabs-menu svg.ui-icon { width: 16px; height: 16px; }
  /* Help, neutral and outlined like a tab, pushed to the bar's right end. */
  button.wa-tabs-help {
    display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 11px 0 9px; border-radius: 6px;
    font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap;
    color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line-strong);
  }
  button.wa-tabs-help:hover { background: var(--wa-hover); }
  button.wa-tabs-help:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.wa-tabs-help svg.ui-icon { width: 15px; height: 15px; }
  /* A phone: the name on top, then the tabs and Help on one line under it.
     The empty ::after is the line break, a full width item of no height, so
     the rows carry their own margins instead of a row gap counted twice.
     Help keeps only its sign, and the tabs wrap onto a second line if the
     screen cannot hold them all: sliding sideways hid Complications behind
     the edge with nothing to say it was there (2026-10-23). */
  @media (max-width: 480px) {
    nav.wa-tabs { row-gap: 0; padding-block: 3px; }
    nav.wa-tabs > * { margin-block: 3px; }
    nav.wa-tabs::after { content: ""; order: 1; flex: 0 0 100%; height: 0; margin: 0; }
    .wa-tabs-list { order: 2; }
    .wa-tabs-list { flex: 1 1 0; min-width: 0; flex-wrap: wrap; }
    a.wa-tab { flex: none; padding: 0 8px; }
    a.wa-tab svg.ui-icon { display: none; }
    .wa-tabs-sep { display: none; }
    button.wa-tabs-help { width: 28px; padding: 0; justify-content: center; flex: none; }
    button.wa-tabs-help > span { display: none; }
  }
  @media (max-width: 380px) {
    a.wa-tab { padding: 0 7px; font-size: 12.5px; }
  }
  /* Orange, the one hue in the tabs and the row: it says "not saved yet",
     so it never stands for the tab or the screen on show. */
  i.wa-unsaved {
    display: inline-block; flex: none; width: 6px; height: 6px; margin-left: 6px; border-radius: 50%;
    background: var(--wa-hue-orange);
  }
`;
