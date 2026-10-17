// The header row over every device screen: Home at the left, to go back,
// then the shared watch, then the same doors Home shows for that watch
// (`deviceSheetTabs`) as one segmented track with Settings last, the screen
// on show marked, then the screen's own save controls at the right. A
// door that is a list (Control Center controls, an iPhone's widgets) opens
// the Complications tab on the device, as on Home. The panel draws it
// (`renderWatchRow`) and owns its state: the shared watch (`watch-pick.ts`),
// whether the watch menu is open, and what a pick or a screen does.
// Settings is a screen with an address like the others. HTTP actions,
// Cameras, Photos and Parts are the whole home's, Home's Library: their row
// says Library in place of a device and links only them, with the same Home
// button. What can be worked out without the panel lives here,
// where a test can reach it.
//
// An iPhone's screens draw the same row for the iPhones (`iphone`): the
// shared iPhone at the left, then an iPhone's doors, each screen at its
// `/iphone` address. A home with no iPhone gets the way to pair one instead.
//
// The row is neutral: the watch's chip and every button are grey boxes with a
// one pixel outline. The tab on show is raised in grey, and only its glyph
// takes the screen's hue. What a screen is, and how its work is used on the
// watch, lives in its tab's hover card (`watchScreenSentence` and
// `screen-howto.ts`), never on the editors. On a phone the watch and the save controls share
// the first line and the screens are a second line that scrolls sideways.
//
// The save controls are each screen's own (`head-bar.ts`): the panel puts an
// empty box at the row's right end (`end`) and the screen draws its bar
// there. Under the row, only while another screen holds unsaved work, a slim
// line names every screen that does. Unsaved work is also an orange dot on
// its screen in the row. Each editor keeps its own drafts and saves them
// itself, so there is no Save all here: the line only says where the work is
// and links to it.

import { css, html, nothing, type TemplateResult } from "lit";
import { deviceColor, deviceColors } from "./device-colors.js";
import type { OwnerSummary } from "./ha-api.js";
import { homeMiniArt } from "./home-art.js";
import { HOME_LIBRARY_TITLE, deviceSheetTabs, homeLibraryScreens } from "./home.js";
import type { Person } from "./people.js";
import { hasPhoneAwaitingUpdate, iphoneDevices } from "./phone-pages.js";
import { howToStyles, renderHowTo, screenHowTo } from "./screen-howto.js";
import { type DeviceSync, deviceSync, deviceSyncLabel } from "./send-state.js";
import {
  COMPLICATIONS_PATH, WATCH_SCREENS, WATCH_SETTINGS_SCREEN, type WatchScreen,
  iphoneScreenOf, iphoneScreenPath, isPlainClick, panelUrl, unsavedDot, watchScreenOf, watchScreenPath, watchScreenSentence,
} from "./shell.js";
import { type UiIconName, uiIcon } from "./ui-icons.js";
import type { PanelRoute } from "./watch-pages/hook.js";
import { settingsWatches, watchName } from "./watch-settings.js";

/** Which app's row: the Watch app's, or the iPhone app's. */
export type RowKind = "watch" | "iphone";

/** One device in the row's menu. */
export interface WatchRowChoice {
  id: string;
  name: string;
  /** A watch in the Watch app's row, an iPhone in the iPhone app's. */
  kind: RowKind;
  /** How it stands, by Home's verdict where the panel has one (`syncs`),
   * else by its complications and widgets alone. */
  sync: DeviceSync | undefined;
  /** The device on show. */
  on: boolean;
}

/** The home's devices as the row's menu lists them: the watches, or in the
 * iPhone app's row the iPhones; never the Library or an orphan. Named as
 * every watch screen names them. */
export function watchRowChoices(
  owners: readonly OwnerSummary[],
  current: string | undefined,
  kind: RowKind = "watch",
  syncs: ReadonlyMap<string, DeviceSync> = new Map(),
): WatchRowChoice[] {
  const watches = kind === "iphone" ? iphoneDevices(owners) : settingsWatches(owners);
  return watches.map((w) => ({
    id: w.owner_watch_id,
    name: watchName(w, watches),
    kind,
    sync: syncs.get(w.owner_watch_id) ?? deviceSync({
      name: w.device_name ?? w.owner_watch_id,
      kind: w.device_kind,
      token: w.token,
      appliedToken: w.applied_token,
      count: w.complication_count,
      orphan: w.is_orphan,
    }),
    on: w.owner_watch_id === current,
  }));
}

/** One of the row's links: a screen on the device, or one of its lists on
 * the Complications tab (`list`). */
export interface WatchRowLink {
  screen: WatchScreen;
  /** The link's word where it is not the screen's own: "Widgets", "Control
   * Center". */
  label?: string;
  /** The screen's address on the shared watch, so moving keeps the watch. */
  path: string;
  /** The screen on show. */
  on: boolean;
  /** Opens the device's complications on the Complications tab: all of them
   * (an iPhone's widgets), or only those with a Control Center control. */
  list?: "all" | "control";
}

const screenById = (id: WatchScreenId): WatchScreen => WATCH_SCREENS.find((screen) => screen.id === id)!;

/** The row's links, in the order of Home's doors on the same device
 * (`deviceSheetTabs`), Settings apart (`watchRowSettingsLink`). A watch's
 * complications are its own screen; an iPhone's widgets and any device's
 * Control Center controls open the Complications tab on that device, as
 * Home's doors do. In the iPhone app's row, each screen is at its
 * `/iphone` address. The Library's screens are the home's, never in a
 * device's row (`sharedRowLinks`). */
export function watchRowLinks(route: PanelRoute | undefined, watch: string | undefined, kind: RowKind = "watch"): WatchRowLink[] {
  const shown = kind === "iphone" ? iphoneScreenOf(route)?.id : watchScreenOf(route)?.id;
  const linkOf = (screen: WatchScreen): WatchRowLink => ({
    screen, path: kind === "iphone" ? iphoneScreenPath(screen, watch) : watchScreenPath(screen, watch), on: screen.id === shown,
  });
  return deviceSheetTabs(kind, true).flatMap((tab): WatchRowLink[] => {
    if (tab.kind === "screen") return tab.screen.id === WATCH_SETTINGS_SCREEN.id ? [] : [linkOf(tab.screen)];
    if (kind === "watch" && tab.filter === "all") return [linkOf(screenById("watch-complications"))];
    // An old link to the retired Control Center screen marks its door.
    const screen = screenById(tab.filter === "all" ? "watch-complications" : "control-center");
    return [{ screen, label: tab.label, path: COMPLICATIONS_PATH, on: tab.filter === "control" && shown === "control-center", list: tab.filter }];
  });
}

/** The row's links on a screen of the whole home: the Library's screens
 * (`homeLibraryScreens`), as Home's side bar lists them, which name no
 * device. */
export function sharedRowLinks(route: PanelRoute | undefined): WatchRowLink[] {
  const shown = watchScreenOf(route)?.id;
  return homeLibraryScreens().map((screen) => ({ screen, path: watchScreenPath(screen), on: screen.id === shown }));
}

/** Over the shared screens' links, in place of a device: the name of the
 * side bar section they are listed under on Home. */
export const SHARED_ROW_LABEL = HOME_LIBRARY_TITLE;

/** The row's last link, Settings, on the shared device. In a home with no
 * watch the Watch app's is also where the first one pairs. */
export function watchRowSettingsLink(route: PanelRoute | undefined, watch: string | undefined, kind: RowKind = "watch"): WatchRowLink {
  const screen = WATCH_SETTINGS_SCREEN;
  if (kind === "iphone") return { screen, path: iphoneScreenPath(screen, watch), on: iphoneScreenOf(route)?.id === screen.id };
  return { screen, path: watchScreenPath(screen, watch), on: watchScreenOf(route)?.id === screen.id };
}

export type WatchScreenId = WatchScreen["id"];

/** The screens with unsaved work, in the row's order (Settings last), from
 * each screen's own answer. */
export function unsavedScreens(dirty: Partial<Record<WatchScreenId, boolean>>): WatchScreen[] {
  return [...WATCH_SCREENS, WATCH_SETTINGS_SCREEN].filter((screen) => dirty[screen.id] === true);
}

/** A piece of the unsaved bar's sentence: plain words, or a screen it names. */
export type UnsavedPiece = string | WatchScreen;

/**
 * The unsaved bar's sentence, in pieces so each screen it names can be a
 * link: "Menus has unsaved changes." or "2 screens have unsaved changes:
 * Pages and Menus." Every screen with unsaved work is named, the one on show
 * too, so the count is the whole truth. Undefined while no screen but the one
 * on show has any: that screen's own Save already says so.
 */
export function unsavedNotice(unsaved: readonly WatchScreen[], shown: WatchScreenId | undefined): UnsavedPiece[] | undefined {
  if (!unsaved.some((screen) => screen.id !== shown)) return undefined;
  if (unsaved.length === 1) return [unsaved[0]!, " has unsaved changes."];
  const pieces: UnsavedPiece[] = [`${unsaved.length} screens have unsaved changes: `];
  unsaved.forEach((screen, i) => {
    if (i > 0) pieces.push(i === unsaved.length - 1 ? " and " : ", ");
    pieces.push(screen);
  });
  pieces.push(".");
  return pieces;
}

/** The sentence as plain text. */
export function unsavedNoticeText(pieces: readonly UnsavedPiece[]): string {
  return pieces.map((p) => (typeof p === "string" ? p : p.label)).join("");
}

/** What the watch slot at the row's left holds: nothing known yet, no watch
 * (the way to pair one), one watch (its name, no menu), or a menu. */
export type WatchRowSlot = "loading" | "none" | "one" | "many";

export function watchRowSlot(loaded: boolean, watches: number): WatchRowSlot {
  if (watches === 0) return loaded ? "none" : "loading";
  return watches === 1 ? "one" : "many";
}

/** Under the menu's watches. */
export const WATCH_ROW_PHONES_NOTE = "Phones are not here. Phones only get complications and widgets.";
/** Under the menu's watches on a home with phone pages. */
export const WATCH_ROW_IPHONE_TAB_NOTE = "iPhones are set up from Home: pick one there.";
/** Beside the pairing button in a home with no watch. */
export const WATCH_ROW_NONE_NOTE = "No watch has connected yet. Pair one to set up its pages, menus and the rest.";
/** Beside the pairing button in a home with no iPhone. */
export const IPHONE_ROW_NONE_NOTE = "No iPhone has connected yet. Pair one to set up its pages, menus and the rest.";
/** Beside the pairing button in a home whose iPhones all run an app too old
 * for pages of their own (`hasPhoneAwaitingUpdate`). */
export const IPHONE_ROW_UPDATE_NOTE = "Update the Wrist Assistant app on your iPhone to set up its pages, menus and the rest.";

export interface WatchRowInput {
  route: PanelRoute | undefined;
  owners: readonly OwnerSummary[];
  /** The shared watch, or in the iPhone app's row the shared iPhone. */
  watch: string | undefined;
  /** The iPhone app's row, not the Watch app's. */
  iphone?: boolean;
  /** The home has phone pages: the watch menu says where the iPhones are. */
  phones?: boolean;
  /** Whether the device list has been read, so "no watch" is the truth. */
  loaded: boolean;
  menuOpen: boolean;
  onMenu: (open: boolean) => void;
  onPick: (watchId: string) => void;
  /** A screen link pressed, Settings and Pair a watch included: its path
   * inside the panel. */
  onGo: (path: string) => void;
  /** The screens with unsaved work (`unsavedScreens`). */
  unsaved?: readonly WatchScreen[];
  /** The household as people (`peopleOf`), so the watch's chip names whose
   * it is. Its drawing wears the device's own color (`device-colors.ts`). */
  people?: readonly Person[];
  /** What stands at the row's right end: the save controls of the screen on
   * show, which each screen draws itself (`head-bar.ts`). */
  end?: unknown;
  /** Pair an iPhone pressed, in the iPhone app's row of a home with none. */
  onPair?: () => void;
  /** Each device's verdict as Home gives it (complications, pages and
   * settings together), so the chip never says Synced while the screen's
   * own bar says Waiting. */
  syncs?: ReadonlyMap<string, DeviceSync>;
  /** Home pressed: back to Home, with this device picked. */
  onHome?: () => void;
  /** A list link pressed (`WatchRowLink.list`): the device's complications
   * on the Complications tab. */
  onList?: (filter: "all" | "control") => void;
}

/** The Settings link's hover text, for the device on show. */
export function watchRowSettingsTitle(kind: WatchRowChoice["kind"] | undefined): string {
  return kind === "iphone"
    ? "How the iPhone app behaves: gestures, pages and cameras"
    : "How the watch behaves: gestures, pages, cameras and connection";
}

/** How each screen's tab looks in the row: its glyph, and the section hue
 * the glyph takes while the screen is on show. The same glyphs and hues as
 * Home's doors (`homeDoorLook`), so a screen is the same color everywhere. */
export const WATCH_SCREEN_LOOK: Record<WatchScreenId, { icon: UiIconName; hue: string }> = {
  "pages": { icon: "pages", hue: "var(--wa-hue-green)" },
  "menus": { icon: "radial", hue: "var(--wa-hue-orange)" },
  "status-pages": { icon: "checklist", hue: "var(--wa-hue-yellow)" },
  "control-center": { icon: "tap", hue: "var(--wa-hue-orange)" },
  "rooms": { icon: "home", hue: "var(--wa-hue-pink)" },
  "voice": { icon: "mic", hue: "var(--wa-hue-red)" },
  "watch-complications": { icon: "gauge", hue: "var(--wa-hue-blue)" },
  "http-actions": { icon: "globe", hue: "var(--wa-hue-blue)" },
  "cameras": { icon: "image", hue: "var(--wa-hue-grey)" },
  "photos": { icon: "image", hue: "var(--wa-hue-pink)" },
  "parts": { icon: "layers", hue: "var(--wa-hue-yellow)" },
  "settings": { icon: "sliders", hue: "var(--wa-hue-grey)" },
};

/** A tab's tooltip: what the screen is, as one sentence. A retired screen
 * has its own note on the screen, so it has none. */
export function watchRowLinkTitle(screen: WatchScreen): string | undefined {
  return screen.retired === true ? undefined : watchScreenSentence(screen);
}

/** The line under the watch's name on its chip: whose it is, then its
 * complications' verdict, "Jesse · Synced". Either may be missing. */
export function watchChipSub(person: string | undefined, sync: DeviceSync | undefined): string {
  return [person, sync === undefined ? undefined : deviceSyncLabel(sync)].filter((w): w is string => w !== undefined && w !== "").join(" · ");
}

/**
 * The Watch app's one header row, under the tabs: the watch at the left, as
 * a chip with its small drawing, its name, whose it is and how it stands;
 * the screens in the middle, one segmented track that scrolls sideways; and
 * at the right the screen's own save controls (`end`). Under it, only while
 * another screen holds unsaved work, a slim line that says where.
 */
export function renderWatchRow(input: WatchRowInput): TemplateResult {
  const kind: RowKind = input.iphone === true ? "iphone" : "watch";
  const choices = watchRowChoices(input.owners, input.watch, kind, input.syncs);
  const slot = watchRowSlot(input.loaded, choices.length);
  const href = (path: string) => panelUrl(input.route, path, globalThis.location?.pathname ?? "");
  const unsaved = new Set((input.unsaved ?? []).map((screen) => screen.id));
  // The Library's screens belong to the whole home: their row names no
  // device and links only them.
  const shared = kind === "watch" && watchScreenOf(input.route)?.shared === true;
  // An iPhone app with no iPhone has nothing to link to, Settings included:
  // the way to pair one is all it offers.
  const links = shared ? sharedRowLinks(input.route).map((l) => ({ l, cls: "" }))
    : slot === "none" && kind === "iphone" ? [] : [
      ...(slot === "none" ? [] : watchRowLinks(input.route, input.watch, kind).map((l) => ({ l, cls: "" }))),
      { l: watchRowSettingsLink(input.route, input.watch, kind), cls: "wa-wr-settings " },
    ];
  const link = (l: WatchRowLink, cls = "") => {
    const look = WATCH_SCREEN_LOOK[l.screen.id];
    const tip = l.list !== undefined || watchRowLinkTitle(l.screen) === undefined ? undefined : `wa-wr-tip-${l.screen.id}`;
    const label = l.label ?? l.screen.label;
    return html`<a class="wa-wr-link ${cls}${l.on ? "on" : ""}"
    href=${href(l.path)} aria-current=${l.on ? "page" : "false"} aria-describedby=${tip ?? nothing} style=${`--h: ${look.hue}`}
    @pointerenter=${(e: PointerEvent) => { if (e.pointerType === "mouse") hoverRowTip(e.currentTarget as HTMLElement, true); }}
    @pointerleave=${(e: PointerEvent) => hoverRowTip(e.currentTarget as HTMLElement, false)}
    @focus=${(e: FocusEvent) => { const a = e.currentTarget as HTMLElement; if (a.matches(":focus-visible")) hoverRowTip(a, true); }}
    @blur=${(e: FocusEvent) => hoverRowTip(e.currentTarget as HTMLElement, false)}
    @pointerdown=${closeRowTip}
    @click=${(e: MouseEvent) => {
      closeRowTip();
      if (!isPlainClick(e)) return;
      e.preventDefault();
      if (l.list !== undefined) input.onList?.(l.list);
      else if (!l.on) input.onGo(l.path);
    }}><span class="wa-wr-ic" aria-hidden="true">${uiIcon(look.icon)}</span>${label}${l.list === undefined && unsaved.has(l.screen.id) ? unsavedDot() : nothing}</a>`;
  };
  return html`<div class="wa-watchrow ${slot === "none" && !shared ? "no-watch" : ""}">
    ${input.onHome === undefined ? nothing : html`<button type="button" class="wa-wr-home"
      title=${shared ? "Back to Home" : `Back to Home, with this ${kind === "iphone" ? "iPhone" : "watch"} picked`}
      @click=${() => { closeRowTip(); input.onHome?.(); }}>${uiIcon("left")}<span>Home</span></button>`}
    ${shared ? html`<span class="wa-wr-shared">${SHARED_ROW_LABEL}</span>` : renderWatchSlot(input, slot, choices, kind)}
    ${slot === "none" && !shared ? html`<span class="wa-wr-note">${kind === "iphone" ? (hasPhoneAwaitingUpdate(input.owners) ? IPHONE_ROW_UPDATE_NOTE : IPHONE_ROW_NONE_NOTE) : WATCH_ROW_NONE_NOTE}</span>` : nothing}
    ${links.length === 0 ? nothing : html`<nav class="wa-wr-links" aria-label=${kind === "iphone" ? "iPhone app" : "Watch app"} @scroll=${(e: Event) => { markRowMore(e.currentTarget as HTMLElement); closeRowTip(); }}>
      ${links.map(({ l, cls }) => link(l, cls))}
    </nav>`}
    ${links.filter(({ l }) => l.list === undefined).map(({ l }) => renderRowTip(l.screen, kind))}
    <div class="wa-wr-end">${input.end ?? nothing}</div>
  </div>${renderUnsavedBar(input, href, kind)}`;
}

/** A tab's hover card: what the screen is, then how its work is used on the
 * watch. A popover, so the row's sideways scroll never clips it. None for a
 * retired screen. */
function renderRowTip(screen: WatchScreen, kind: RowKind = "watch") {
  // The iPhone's Settings are its own, and work as the iPhone app does, so
  // its card says so and leaves out how the watch uses them.
  const phoneSettings = kind === "iphone" && screen.id === "settings";
  const what = phoneSettings ? `${watchRowSettingsTitle("iphone")}.` : watchRowLinkTitle(screen);
  if (what === undefined) return nothing;
  const how = phoneSettings ? undefined : screenHowTo(screen.id);
  return html`<div class="wa-wr-tip" id=${`wa-wr-tip-${screen.id}`} popover="manual" role="tooltip"
    style=${`--howto-hue: ${WATCH_SCREEN_LOOK[screen.id].hue}`}>
    <p class="wa-wr-tip-what">${what}</p>
    ${how === undefined ? nothing : renderHowTo(how)}
  </div>`;
}

// One hover card open at a time. It opens after a short rest on a tab, so a
// pointer passing over the row opens nothing; once one is open, the next tab
// swaps at once.
let tipTimer: ReturnType<typeof setTimeout> | undefined;
let tipOpen: HTMLElement | undefined;

function tipOf(link: HTMLElement): HTMLElement | undefined {
  const id = link.getAttribute("aria-describedby");
  return id ? link.closest(".wa-watchrow")?.querySelector<HTMLElement>(`#${id}`) ?? undefined : undefined;
}

/** Where a hover card sits: under its tab, centred on it, kept 8px inside
 * the window. */
export function rowTipLeft(tab: { left: number; width: number }, tipWidth: number, viewWidth: number): number {
  return Math.max(8, Math.min(viewWidth - tipWidth - 8, tab.left + tab.width / 2 - tipWidth / 2));
}

function openRowTip(link: HTMLElement): void {
  const tip = tipOf(link);
  if (tip === undefined || !link.isConnected) return;
  if (tipOpen !== undefined && tipOpen !== tip) closeRowTip();
  try {
    if (!tip.matches(":popover-open")) tip.showPopover();
  } catch {
    return;
  }
  const r = link.getBoundingClientRect();
  tip.style.left = `${rowTipLeft(r, tip.offsetWidth, globalThis.innerWidth)}px`;
  tip.style.top = `${r.bottom + 8}px`;
  tipOpen = tip;
}

/** A tab hovered (or focused from the keyboard), or left. */
function hoverRowTip(link: HTMLElement, on: boolean): void {
  clearTimeout(tipTimer);
  tipTimer = on ? setTimeout(() => openRowTip(link), tipOpen === undefined ? 450 : 0) : setTimeout(closeRowTip, 60);
}

function closeRowTip(): void {
  clearTimeout(tipTimer);
  try {
    if (tipOpen?.matches(":popover-open")) tipOpen.hidePopover();
  } catch {
    /* already gone */
  }
  tipOpen = undefined;
}

/** The bar under the row while another screen holds unsaved work. Each other
 * screen it names is a link there, on the shared watch. */
function renderUnsavedBar(input: WatchRowInput, href: (path: string) => string, kind: RowKind = "watch") {
  const shown = kind === "iphone" ? iphoneScreenOf(input.route)?.id : watchScreenOf(input.route)?.id;
  const pieces = unsavedNotice(input.unsaved ?? [], shown);
  if (pieces === undefined) return nothing;
  return html`<p class="wa-wr-unsaved" role="status">${unsavedDot()}<span>${pieces.map((p) => {
    if (typeof p === "string") return p;
    if (p.id === shown) return html`<b>${p.label}</b>`;
    const path = kind === "iphone" ? iphoneScreenPath(p, input.watch) : watchScreenPath(p, input.watch);
    return html`<a href=${href(path)} @click=${(e: MouseEvent) => {
      if (!isPlainClick(e)) return;
      e.preventDefault();
      input.onGo(path);
    }}>${p.label}</a>`;
  })}</span></p>`;
}

/** The screens' track scrolls sideways when it cannot show them all: mark
 * whether more of it is hidden past the right edge, and past the left edge
 * once scrolled, which draws the fade at that edge. A pixel of slack, so a
 * line scrolled to its end is not still claiming more under a rounding
 * error. */
export function markRowMore(box: HTMLElement): void {
  const slack = box.scrollWidth - box.clientWidth;
  box.toggleAttribute("data-more", slack > 1 && box.scrollLeft < slack - 1);
  box.toggleAttribute("data-back", slack > 1 && box.scrollLeft > 1);
}

/** Where the screen links' line should scroll to so the link on show sits in
 * the middle of it, held inside the line's ends. Every measure is in pixels:
 * the line's width and full scroll width, and the link's left edge and width
 * along the full line. Undefined when the line does not scroll. */
export function rowScrollFor(line: { width: number; scrollWidth: number }, link: { left: number; width: number }): number | undefined {
  const max = line.scrollWidth - line.width;
  if (max <= 1) return undefined;
  return Math.round(Math.min(max, Math.max(0, link.left - (line.width - link.width) / 2)));
}

/** Bring the link on show into view in the line, without moving the page
 * itself, and mark the fade. Called by the panel after it draws the row. */
export function showRowLink(root: ParentNode): void {
  const box = root.querySelector<HTMLElement>(".wa-watchrow .wa-wr-links");
  if (!box) return;
  const on = box.querySelector<HTMLElement>("a.wa-wr-link.on");
  if (on) {
    const lineRect = box.getBoundingClientRect();
    const linkRect = on.getBoundingClientRect();
    const left = rowScrollFor(
      { width: box.clientWidth, scrollWidth: box.scrollWidth },
      { left: box.scrollLeft + linkRect.left - lineRect.left, width: linkRect.width },
    );
    if (left !== undefined) box.scrollLeft = left;
  }
  markRowMore(box);
}

/** The watch's small drawing on its chip, in its device's color
 * (`device-colors.ts`, the color it wears on the Pages and Complications
 * tabs): the box round it outlined in it, and the drawing lit in it once it
 * holds complications. */
function chipArt(input: WatchRowInput, id: string | undefined, kind: RowKind = "watch") {
  const held = input.owners.find((o) => o.owner_watch_id === id)?.complication_count ?? 0;
  const color = deviceColor(deviceColors(input.owners), id);
  return html`<span class="wa-wr-art ${color === undefined ? "" : "tinted"}" style=${`--c: ${color ?? "var(--wa-hue-grey)"}`} aria-hidden="true">${homeMiniArt(kind, held > 0)}</span>`;
}

/** The chip's name and the line under it. */
function chipWords(input: WatchRowInput, c: WatchRowChoice) {
  const person = (input.people ?? []).find((p) => p.owners.some((o) => o.owner_watch_id === c.id))?.label;
  const sub = watchChipSub(person, c.sync);
  return html`<span class="wa-wr-id"><b class="wa-wr-name">${c.name}</b>${sub === ""
    ? nothing
    : html`<span class="wa-wr-sub"><i class="wa-wr-dot ${c.sync ?? ""}" aria-hidden="true"></i>${sub}</span>`}</span>`;
}

/** The way to pair the first device: for a watch, Settings, where a watch
 * pairs; for an iPhone, the panel's Pair a device. */
function renderPairButton(input: WatchRowInput, kind: RowKind): TemplateResult {
  if (kind === "iphone") {
    return html`<button type="button" class="wa-wr-pair" title="Pair an iPhone, by a QR code or a code"
      @click=${() => input.onPair?.()}>${uiIcon("phone")}<span>Pair an iPhone</span></button>`;
  }
  const settings = watchRowSettingsLink(input.route, undefined);
  return html`<button type="button" class="wa-wr-pair" title="Opens Settings, where a watch pairs with a code"
    @click=${() => { if (!settings.on) input.onGo(settings.path); }}>${uiIcon("watch")}<span>Pair a watch</span></button>`;
}

function renderWatchSlot(input: WatchRowInput, slot: WatchRowSlot, choices: readonly WatchRowChoice[], kind: RowKind = "watch") {
  const word = kind === "iphone" ? "iPhone" : "Watch";
  if (slot === "loading") {
    return html`<span class="wa-wr-watch">${chipArt(input, undefined, kind)}<span class="wa-wr-id"><span class="wa-wr-wait">Loading…</span></span></span>`;
  }
  if (slot === "none") return renderPairButton(input, kind);
  const current = choices.find((c) => c.on) ?? choices[0]!;
  if (slot === "one") {
    return kind === "iphone"
      ? html`<span class="wa-wr-watch" title="The iPhone you are setting up">${chipArt(input, current.id, kind)}${chipWords(input, current)}</span>`
      : html`<span class="wa-wr-watch" title="The watch you are setting up">${chipArt(input, current.id, kind)}${chipWords(input, current)}</span>`;
  }
  const open = input.menuOpen;
  const colors = deviceColors(input.owners);
  const note = kind === "iphone" ? undefined : input.phones === true ? WATCH_ROW_IPHONE_TAB_NOTE : WATCH_ROW_PHONES_NOTE;
  return html`<span class="wa-wr-picker" @keydown=${(e: KeyboardEvent) => {
      if (e.key === "Escape" && open) { e.stopPropagation(); input.onMenu(false); }
    }}>
    <button type="button" class="wa-wr-open" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"}
      title=${kind === "iphone" ? "Pick the iPhone to set up" : "Pick the watch to set up"} aria-label=${`${word}: ${current.name}. Pick another`}
      @click=${() => input.onMenu(!open)}>
      ${chipArt(input, current.id, kind)}${chipWords(input, current)}${uiIcon("chevron")}
    </button>
    ${open ? html`<div class="wa-wr-menu" role="menu" aria-label=${kind === "iphone" ? "iPhones" : "Watches"}>
      <div class="wa-wr-menu-h">You are editing</div>
      ${choices.map((c) => [c, deviceColor(colors, c.id)] as const).map(([c, color]) => html`<button type="button" class="wa-wr-row ${c.on ? "on" : ""} ${color === undefined ? "" : "tinted"}" role="menuitemradio"
        style=${color === undefined ? nothing : `--dc:${color}`}
        aria-checked=${c.on ? "true" : "false"} data-watch=${c.id} data-kind=${c.kind}
        title=${c.sync ? deviceSyncLabel(c.sync) : nothing}
        @click=${() => { input.onMenu(false); if (!c.on) input.onPick(c.id); }}>
        <i class="wa-wr-dot ${c.sync ?? ""}" aria-hidden="true"></i><span class="wa-wr-row-name">${c.name}</span>
        ${c.on ? html`<span class="wa-wr-check" aria-hidden="true">${uiIcon("check")}</span>`
          : c.sync === "synced" || c.sync === "waiting" ? html`<span class="wa-wr-sync">${deviceSyncLabel(c.sync)}</span>` : nothing}
      </button>`)}
      ${note === undefined ? nothing : html`<p class="wa-wr-menu-note">${note}</p>`}
    </div>` : nothing}
  </span>`;
}

/** The row's look, added to the panel's sheet. Every color is a panel token,
 * so the light skin reads as well as the dark one. Controls are neutral grey
 * with a one pixel outline; a section's hue shows only on its tab's glyph
 * while it is on show. */
export const watchRowStyles = css`
  ${howToStyles}
  /* A tab's hover card, in the top layer. The script places it under its
     tab; it never takes the pointer, so the tab under it stays hovered. */
  .wa-wr-tip {
    position: fixed; inset: auto; margin: 0; box-sizing: border-box; width: 360px; max-width: calc(100vw - 16px);
    padding: 12px 14px; border: 1px solid var(--wa-line-strong); border-radius: 12px;
    background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop); pointer-events: none;
  }
  .wa-wr-tip-what { margin: 0 0 10px; font-size: 13px; line-height: 1.45; color: var(--wa-label); }
  .wa-wr-tip .howto { width: auto; margin: 0; padding: 10px 0 0; border: 0; border-top: 1px solid var(--wa-line); border-radius: 0; background: none; }
  .wa-wr-tip .howto-chip { width: 32px; height: 32px; border-radius: 8px; }
  .wa-wr-tip .howto-art { width: 18px; height: 18px; }
  .wa-watchrow {
    display: flex; flex-wrap: nowrap; align-items: center; gap: 14px; flex: none;
    min-height: 60px; box-sizing: border-box; padding: 8px 18px;
    background: var(--wa-top); color: var(--wa-ink); border-bottom: 1px solid var(--wa-line);
    position: relative; z-index: 20;
  }
  /* The watch: a chip with its small drawing, its name and, under it, whose
     it is and how its complications stand. */
  .wa-wr-watch, button.wa-wr-open {
    display: inline-flex; align-items: center; gap: 10px; min-height: 42px; max-width: 300px; box-sizing: border-box;
    padding: 5px 12px 5px 6px; border-radius: 11px; text-align: left;
    font: inherit; color: var(--wa-ink); background: var(--wa-card); border: 1px solid var(--wa-line-strong);
  }
  .wa-wr-watch, .wa-wr-picker, button.wa-wr-pair { flex: none; min-width: 0; }
  .wa-wr-art {
    width: 30px; height: 30px; box-sizing: border-box; flex: none; display: grid; place-items: center;
    border-radius: 8px; background: var(--wa-bg); border: 1px solid var(--wa-line);
  }
  .wa-wr-art svg.ha-mini { width: 16px; height: 21px; display: block; }
  .wa-wr-art .ha-lit { stroke: var(--c); }
  .wa-wr-art.tinted { border-color: color-mix(in srgb, var(--c) 60%, transparent); }
  .wa-wr-id { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .wa-wr-name { font-size: 13px; font-weight: 500; line-height: 1.2; overflow-wrap: anywhere; }
  .wa-wr-sub { display: flex; align-items: center; gap: 5px; font-size: 11px; line-height: 1.2; color: var(--wa-muted); overflow-wrap: anywhere; }
  .wa-wr-sub .wa-wr-dot { width: 6px; height: 6px; }
  .wa-wr-wait { font-size: 13px; color: var(--wa-muted); }
  .wa-wr-picker { position: relative; display: inline-flex; }
  button.wa-wr-open { cursor: pointer; }
  button.wa-wr-open:hover { background: var(--wa-hover); }
  button.wa-wr-open > svg.ui-icon { width: 12px; height: 12px; flex: none; color: var(--wa-muted); }
  button.wa-wr-pair {
    display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 12px; max-width: 100%;
    border-radius: 9px; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; color: var(--wa-ink);
    background: var(--wa-card); border: 1px solid var(--wa-line-strong);
  }
  button.wa-wr-pair:hover { background: var(--wa-hover); }
  /* Back to Home, at the row's left: a quiet link with a chevron. */
  button.wa-wr-home {
    flex: none; display: inline-flex; align-items: center; gap: 4px; height: 32px; padding: 0 10px 0 6px;
    border-radius: 8px; font: inherit; font-size: 13px; cursor: pointer; color: var(--wa-muted);
    background: transparent; border: 0;
  }
  button.wa-wr-home:hover { color: var(--wa-ink); background: var(--wa-hover); }
  button.wa-wr-home:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.wa-wr-home svg.ui-icon { width: 14px; height: 14px; }
  .wa-wr-shared { flex: none; font-size: 13px; font-weight: 500; color: var(--wa-ink); }
  button.wa-wr-pair svg.ui-icon { width: 14px; height: 14px; }
  button.wa-wr-open:focus-visible, button.wa-wr-pair:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .wa-wr-menu {
    position: absolute; left: 0; top: calc(100% + 6px); width: min(300px, calc(100vw - 24px)); box-sizing: border-box;
    display: flex; flex-direction: column; gap: 2px; padding: 6px;
    background: var(--wa-card); border: 1px solid var(--wa-line-strong); border-radius: 10px;
    box-shadow: var(--wa-shadow-pop); z-index: 2;
  }
  .wa-wr-menu-h { padding: 6px 8px 4px; font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted); }
  button.wa-wr-row {
    display: flex; align-items: center; gap: 10px; min-height: 40px; padding: 0 10px; box-sizing: border-box;
    border-radius: 6px; font: inherit; font-size: 13px; text-align: left; cursor: pointer;
    color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line);
  }
  button.wa-wr-row:hover { background: var(--wa-hover); border-color: var(--wa-line-strong); }
  button.wa-wr-row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.wa-wr-row.on { font-weight: 600; background: color-mix(in srgb, var(--wa-ink) 10%, transparent); border-color: var(--wa-line-strong); }
  .wa-wr-row-name { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  /* Each device's color on the row's left edge, as in the Pages tab's menus. */
  button.wa-wr-row.tinted { box-shadow: inset 3px 0 0 var(--dc); }
  button.wa-wr-row.tinted:focus-visible { box-shadow: inset 3px 0 0 var(--dc), var(--wa-ring); }
  .wa-wr-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--wa-muted); }
  .wa-wr-dot.synced { background: var(--wa-green); }
  .wa-wr-dot.waiting { background: var(--wa-amber); }
  .wa-wr-sync { flex: none; font-size: 12px; font-weight: 400; color: var(--wa-muted); }
  .wa-wr-check { display: inline-flex; flex: none; }
  .wa-wr-check svg.ui-icon { width: 14px; height: 14px; }
  .wa-wr-menu-note { margin: 4px 0 0; padding: 8px 8px 4px; border-top: 1px solid var(--wa-line); font-size: 12px; color: var(--wa-muted); }
  .wa-wr-note { font-size: 12.5px; color: var(--wa-muted); min-width: 0; flex: 0 1 auto; }
  /* The iPhone app with no iPhone: what it is for and the way to pair one,
     centred under the row. */
  .wa-ip-empty {
    flex: 1 1 auto; min-height: 0; overflow: auto; box-sizing: border-box; padding: 48px 16px;
    display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center;
    background: var(--wa-bg); color: var(--wa-ink);
  }
  .wa-ip-empty h2 { margin: 0; font-size: 18px; font-weight: 500; }
  .wa-ip-empty p { margin: 0; max-width: 440px; font-size: 13px; line-height: 1.45; color: var(--wa-muted); }
  span.wa-ip-empty-chip {
    display: grid; place-items: center; width: 40px; height: 40px; border-radius: 10px; box-sizing: border-box;
    color: var(--wa-muted); border: 1px solid var(--wa-line-strong);
  }
  span.wa-ip-empty-chip svg.ui-icon { width: 20px; height: 20px; }
  /* The screens: one segmented track. The tab on show is raised in grey and
     its glyph takes the screen's hue (--h); the others are muted with faint
     glyphs. The track scrolls sideways, with no scroll bar, when it cannot
     show every tab, and fades at an edge while more is hidden past it. */
  nav.wa-wr-links {
    flex: 1 1 auto; min-width: 0; display: flex; flex-wrap: nowrap; gap: 2px; padding: 3px; box-sizing: border-box;
    border-radius: 11px; background: var(--wa-card); border: 1px solid var(--wa-line);
    overflow-x: auto; overscroll-behavior-x: contain; scrollbar-width: none; scroll-padding-inline: 12px;
  }
  .wa-watchrow.no-watch nav.wa-wr-links { flex: 0 1 auto; }
  nav.wa-wr-links::-webkit-scrollbar { display: none; }
  nav.wa-wr-links[data-more] {
    -webkit-mask-image: linear-gradient(to right, black calc(100% - 56px), transparent);
    mask-image: linear-gradient(to right, black calc(100% - 56px), transparent);
  }
  nav.wa-wr-links[data-back] {
    -webkit-mask-image: linear-gradient(to right, transparent, black 40px);
    mask-image: linear-gradient(to right, transparent, black 40px);
  }
  nav.wa-wr-links[data-back][data-more] {
    -webkit-mask-image: linear-gradient(to right, transparent, black 40px, black calc(100% - 56px), transparent);
    mask-image: linear-gradient(to right, transparent, black 40px, black calc(100% - 56px), transparent);
  }
  a.wa-wr-link {
    flex: none; display: inline-flex; align-items: center; gap: 7px; height: 32px; padding: 0 11px; box-sizing: border-box;
    border-radius: 8px; font-size: 12.5px; font-weight: 400; color: var(--wa-muted); text-decoration: none; white-space: nowrap;
    background: transparent; border: 0;
  }
  a.wa-wr-link .wa-wr-ic { display: inline-flex; flex: none; color: var(--wa-faint); }
  a.wa-wr-link .wa-wr-ic svg.ui-icon { width: 14px; height: 14px; display: block; }
  a.wa-wr-link:hover { color: var(--wa-ink); background: var(--wa-hover); }
  a.wa-wr-link:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  a.wa-wr-link.on { color: var(--wa-ink); font-weight: 500; background: var(--wa-hover); box-shadow: var(--wa-seg-shadow); }
  a.wa-wr-link.on .wa-wr-ic { color: var(--h); }
  /* The screen's own save controls, at the right end. */
  .wa-wr-end { flex: none; display: flex; align-items: center; justify-content: flex-end; min-width: 0; }
  .wa-wr-host { display: contents; }
  .wa-wr-end .wa-head-bar {
    display: flex; flex: 0 1 auto; min-width: 0; min-height: 0; padding: 0; margin: 0;
    overflow: visible; container-type: normal; background: none; border: 0; font-size: 14px; color: var(--wa-ink);
  }
  /* Where the unsaved work is, a slim line under the row while there is
     some on another screen. Neutral: the orange dot at its start is the
     same mark the row and the tab carry. */
  p.wa-wr-unsaved {
    display: flex; align-items: baseline; gap: 8px; margin: 0; flex: none; padding: 5px 18px;
    font-size: 12.5px; line-height: 1.4; color: var(--wa-ink);
    background: var(--wa-top); border-bottom: 1px solid var(--wa-line);
  }
  p.wa-wr-unsaved > span { min-width: 0; }
  p.wa-wr-unsaved i.wa-unsaved { margin-left: 0; align-self: center; }
  p.wa-wr-unsaved a { color: var(--wa-ink); font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
  p.wa-wr-unsaved a:focus-visible { outline: none; border-radius: 3px; box-shadow: var(--wa-ring); }
  /* A phone: the watch and the save controls share the first line, the
     watch at the left; the screens are the second line, edge to edge, one
     line that scrolls sideways. The page itself never scrolls sideways. */
  @media (max-width: 640px) {
    .wa-watchrow { flex-wrap: wrap; gap: 8px 10px; padding: 8px 12px; }
    .wa-wr-watch, .wa-wr-picker, button.wa-wr-pair { flex: 0 1 auto; max-width: 100%; }
    .wa-wr-watch, button.wa-wr-open { max-width: 100%; }
    /* No width of its own to claim, so it shares the first line with the
       watch however long its words are, and fills what the watch leaves. */
    .wa-wr-end { order: 1; flex: 1 1 0; }
    .wa-wr-note { order: 2; flex: 1 1 100%; }
    nav.wa-wr-links { order: 3; flex: 1 1 100%; scroll-snap-type: x proximity; }
    nav.wa-wr-links > a.wa-wr-link { scroll-snap-align: start; }
    p.wa-wr-unsaved { padding: 5px 12px; }
  }
`;
