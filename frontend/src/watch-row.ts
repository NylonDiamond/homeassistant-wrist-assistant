// The Watch app tab's second row, under the tabs on every watch screen: the
// shared watch at the left, then the screens and Settings, the screen on show
// marked. Control Center is retired and left out (`retired` in `shell.ts`). The panel draws it (`renderWatchRow`) and owns its state:
// the shared watch (`watch-pick.ts`), whether the watch menu is open, and what
// a pick or a screen does. Settings is a screen with an address like the
// others. HTTP actions and Cameras are shared by every watch, so their links
// never name one and a pick on them changes nothing they show. What can be worked out without
// the panel lives here, where a test can reach it.
//
// The row is neutral, like the tabs: the screen on show is marked by weight
// and a grey fill, never by a hue. Every link and button is a box with a one
// pixel outline. It wraps on a wide screen. On a phone the watch takes a line
// of its own and the screens are one line that scrolls sideways, so the row
// stays two lines however many screens there are.
//
// Under the row, two lines: what the screen on show is (its `blurb`), and,
// while another screen holds unsaved work, a bar that names every screen
// that does. Unsaved work is also an orange dot on its screen in the row.
// Each editor keeps its own drafts and saves them itself, so there is no
// Save all here: the bar only says where the work is and links to it.

import { css, html, nothing, type TemplateResult } from "lit";
import type { OwnerSummary } from "./ha-api.js";
import { type DeviceSync, deviceSync, deviceSyncLabel } from "./send-state.js";
import { WATCH_SCREENS, WATCH_SETTINGS_SCREEN, type WatchScreen, isPlainClick, panelUrl, unsavedDot, watchScreenOf, watchScreenPath } from "./shell.js";
import { uiIcon } from "./ui-icons.js";
import type { PanelRoute } from "./watch-pages/hook.js";
import { settingsWatches, watchName } from "./watch-settings.js";

/** One watch in the row's menu. */
export interface WatchRowChoice {
  id: string;
  name: string;
  /** Its complications and widgets, by the rule Home's Devices card uses. */
  sync: DeviceSync | undefined;
  /** The watch on show. */
  on: boolean;
}

/** The home's watches as the row's menu lists them: watches only (no phone,
 * no Library, no orphan), named as every watch screen names them. */
export function watchRowChoices(owners: readonly OwnerSummary[], current: string | undefined): WatchRowChoice[] {
  const watches = settingsWatches(owners);
  return watches.map((w) => ({
    id: w.owner_watch_id,
    name: watchName(w, watches),
    sync: deviceSync({
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

/** One of the row's screen links. */
export interface WatchRowLink {
  screen: WatchScreen;
  /** The screen's address on the shared watch, so moving keeps the watch. */
  path: string;
  /** The screen on show. */
  on: boolean;
}

/** The row's screen links. A retired screen (Control Center) is left out,
 * unless an old link has it on show, so the row still marks where you are. */
export function watchRowLinks(route: PanelRoute | undefined, watch: string | undefined): WatchRowLink[] {
  const shown = watchScreenOf(route)?.id;
  return WATCH_SCREENS.filter((screen) => screen.retired !== true || screen.id === shown)
    .map((screen) => ({ screen, path: watchScreenPath(screen, watch), on: screen.id === shown }));
}

/** The row's last link, Settings, on the shared watch. In a home with no
 * watch it is also where the first one pairs. */
export function watchRowSettingsLink(route: PanelRoute | undefined, watch: string | undefined): WatchRowLink {
  const screen = WATCH_SETTINGS_SCREEN;
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
/** Beside the pairing button in a home with no watch. */
export const WATCH_ROW_NONE_NOTE = "No watch has connected yet. Pair one to set up its pages, menus and the rest.";

export interface WatchRowInput {
  route: PanelRoute | undefined;
  owners: readonly OwnerSummary[];
  /** The shared watch. */
  watch: string | undefined;
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
}

export function renderWatchRow(input: WatchRowInput): TemplateResult {
  const choices = watchRowChoices(input.owners, input.watch);
  const slot = watchRowSlot(input.loaded, choices.length);
  const href = (path: string) => panelUrl(input.route, path, globalThis.location?.pathname ?? "");
  const unsaved = new Set((input.unsaved ?? []).map((screen) => screen.id));
  const link = (l: WatchRowLink, cls = "", title?: string) => html`<a class="wa-wr-link ${cls}${l.on ? "on" : ""}"
    href=${href(l.path)} aria-current=${l.on ? "page" : "false"} title=${title ?? nothing}
    @click=${(e: MouseEvent) => {
      if (!isPlainClick(e)) return;
      e.preventDefault();
      if (!l.on) input.onGo(l.path);
    }}>${l.screen.label}${unsaved.has(l.screen.id) ? unsavedDot() : nothing}</a>`;
  return html`<nav class="wa-watchrow" aria-label="Watch app">
    ${renderWatchSlot(input, slot, choices)}
    ${slot === "none" ? html`<span class="wa-wr-note">${WATCH_ROW_NONE_NOTE}</span>` : nothing}
    <span class="wa-wr-links" @scroll=${(e: Event) => markRowMore(e.currentTarget as HTMLElement)}>
      ${slot === "none" ? nothing : watchRowLinks(input.route, input.watch).map((l) => link(l))}
      ${link(watchRowSettingsLink(input.route, input.watch), "wa-wr-settings ",
        "How the watch behaves: gestures, pages, cameras and connection")}
    </span>
  </nav>${renderScreenLine(input.route)}${renderUnsavedBar(input, href)}`;
}

/** The line that says what the screen on show is: its name in bold, then its
 * blurb. A retired screen has its own note on the screen, so it has none. */
function renderScreenLine(route: PanelRoute | undefined) {
  const screen = watchScreenOf(route);
  if (screen === undefined || screen.retired === true) return nothing;
  return html`<p class="wa-wr-blurb"><b>${screen.label}</b> ${screen.blurb}</p>`;
}

/** The bar under the row while another screen holds unsaved work. Each other
 * screen it names is a link there, on the shared watch. */
function renderUnsavedBar(input: WatchRowInput, href: (path: string) => string) {
  const shown = watchScreenOf(input.route)?.id;
  const pieces = unsavedNotice(input.unsaved ?? [], shown);
  if (pieces === undefined) return nothing;
  return html`<p class="wa-wr-unsaved" role="status">${unsavedDot()}<span>${pieces.map((p) => {
    if (typeof p === "string") return p;
    if (p.id === shown) return html`<b>${p.label}</b>`;
    const path = watchScreenPath(p, input.watch);
    return html`<a href=${href(path)} @click=${(e: MouseEvent) => {
      if (!isPlainClick(e)) return;
      e.preventDefault();
      input.onGo(path);
    }}>${p.label}</a>`;
  })}</span></p>`;
}

/** On a phone the screen links are one line that scrolls sideways: mark
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
  const box = root.querySelector<HTMLElement>("nav.wa-watchrow .wa-wr-links");
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

function renderWatchSlot(input: WatchRowInput, slot: WatchRowSlot, choices: readonly WatchRowChoice[]) {
  if (slot === "loading") {
    return html`<span class="wa-wr-watch"><span class="wa-wr-chip" aria-hidden="true">${uiIcon("watch")}</span><span class="wa-wr-k">Watch</span><span class="wa-wr-wait">Loading…</span></span>`;
  }
  if (slot === "none") {
    const settings = watchRowSettingsLink(input.route, undefined);
    return html`<button type="button" class="wa-wr-pair" title="Opens Settings, where a watch pairs with a code"
      @click=${() => { if (!settings.on) input.onGo(settings.path); }}>${uiIcon("watch")}<span>Pair a watch</span></button>`;
  }
  const current = choices.find((c) => c.on) ?? choices[0]!;
  if (slot === "one") {
    return html`<span class="wa-wr-watch"><span class="wa-wr-chip" aria-hidden="true">${uiIcon("watch")}</span><span class="wa-wr-k">Watch</span><b class="wa-wr-name">${current.name}</b></span>`;
  }
  const open = input.menuOpen;
  return html`<span class="wa-wr-picker" @keydown=${(e: KeyboardEvent) => {
      if (e.key === "Escape" && open) { e.stopPropagation(); input.onMenu(false); }
    }}>
    <button type="button" class="wa-wr-open" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"}
      title="Pick the watch to set up" aria-label=${`Watch: ${current.name}. Pick another`}
      @click=${() => input.onMenu(!open)}>
      <span class="wa-wr-chip" aria-hidden="true">${uiIcon("watch")}</span><span class="wa-wr-k">Watch</span><b class="wa-wr-name">${current.name}</b>${uiIcon("chevron")}
    </button>
    ${open ? html`<div class="wa-wr-menu" role="menu" aria-label="Watches">
      <div class="wa-wr-menu-h">You are editing</div>
      ${choices.map((c) => html`<button type="button" class="wa-wr-row ${c.on ? "on" : ""}" role="menuitemradio"
        aria-checked=${c.on ? "true" : "false"} data-watch=${c.id}
        title=${c.sync ? `Complications and widgets: ${deviceSyncLabel(c.sync)}` : nothing}
        @click=${() => { input.onMenu(false); if (!c.on) input.onPick(c.id); }}>
        <i class="wa-wr-dot ${c.sync ?? ""}" aria-hidden="true"></i><span class="wa-wr-row-name">${c.name}</span>
        ${c.on ? html`<span class="wa-wr-check" aria-hidden="true">${uiIcon("check")}</span>`
          : c.sync === "synced" || c.sync === "waiting" ? html`<span class="wa-wr-sync">${deviceSyncLabel(c.sync)}</span>` : nothing}
      </button>`)}
      <p class="wa-wr-menu-note">${WATCH_ROW_PHONES_NOTE}</p>
    </div>` : nothing}
  </span>`;
}

/** The row's look, added to the panel's sheet. Every color is a panel token,
 * so the light skin reads as well as the dark one. */
export const watchRowStyles = css`
  nav.wa-watchrow {
    display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; flex: none;
    min-height: 44px; box-sizing: border-box; padding: 6px 12px;
    background: var(--wa-top); color: var(--wa-ink); border-bottom: 1px solid var(--wa-line);
    position: relative; z-index: 20;
  }
  /* Which watch is being set up is the first thing to read on this row: it
     carries the Watch app's color on its chip and its outline, a larger
     name, and a rule between it and the screens. The screens stay neutral. */
  .wa-wr-watch {
    display: inline-flex; align-items: baseline; gap: 8px; min-width: 0; height: 32px; box-sizing: border-box;
    padding: 0 10px 0 6px; line-height: 30px; border-radius: 6px; border: 1px solid var(--wa-line-strong);
  }
  .wa-wr-watch, .wa-wr-picker { margin-right: 2px; }
  .wa-wr-watch::after, .wa-wr-picker::after {
    content: ""; position: absolute; right: -9px; top: 4px; bottom: 4px; width: 1px; background: var(--wa-line-strong);
  }
  .wa-wr-watch { position: relative; }
  span.wa-wr-chip {
    display: inline-flex; align-items: center; justify-content: center; align-self: center; flex: none;
    width: 20px; height: 20px; border-radius: 5px;
    color: var(--wa-top); background: var(--wa-hue-blue);
  }
  .wa-wr-k { font-size: 12px; color: var(--wa-label); }
  .wa-wr-name { font-size: 14px; font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .wa-wr-wait { font-size: 13px; color: var(--wa-muted); }
  .wa-wr-picker { position: relative; display: inline-flex; min-width: 0; }
  button.wa-wr-open, button.wa-wr-pair {
    display: inline-flex; align-items: center; gap: 8px; height: 32px; padding: 0 10px; max-width: 100%;
    border-radius: 6px; font: inherit; cursor: pointer; color: var(--wa-ink);
    background: var(--wa-field); border: 1px solid var(--wa-line-strong);
  }
  button.wa-wr-open { align-items: baseline; padding: 0 10px 0 6px; line-height: 30px; border-color: var(--wa-hue-blue); background: color-mix(in srgb, var(--wa-hue-blue) 16%, var(--wa-field)); }
  button.wa-wr-pair:hover { background: var(--wa-hover); }
  button.wa-wr-open:hover { background: color-mix(in srgb, var(--wa-hue-blue) 26%, var(--wa-field)); }
  button.wa-wr-open .wa-wr-k { color: var(--wa-hue-blue); }
  button.wa-wr-open:focus-visible, button.wa-wr-pair:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.wa-wr-open svg.ui-icon { width: 12px; height: 12px; align-self: center; color: var(--wa-hue-blue); }
  span.wa-wr-chip svg.ui-icon { width: 13px; height: 13px; color: inherit; }
  button.wa-wr-pair { font-size: 13px; font-weight: 600; }
  button.wa-wr-pair svg.ui-icon { width: 14px; height: 14px; }
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
  .wa-wr-row-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .wa-wr-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--wa-muted); }
  .wa-wr-dot.synced { background: var(--wa-green); }
  .wa-wr-dot.waiting { background: var(--wa-amber); }
  .wa-wr-sync { flex: none; font-size: 12px; font-weight: 400; color: var(--wa-muted); }
  .wa-wr-check { display: inline-flex; flex: none; }
  .wa-wr-check svg.ui-icon { width: 14px; height: 14px; }
  .wa-wr-menu-note { margin: 4px 0 0; padding: 8px 8px 4px; border-top: 1px solid var(--wa-line); font-size: 12px; color: var(--wa-muted); }
  .wa-wr-note { font-size: 12.5px; color: var(--wa-muted); min-width: 0; }
  .wa-wr-links { display: flex; flex-wrap: wrap; gap: 6px; min-width: 0; }
  a.wa-wr-link, button.wa-wr-link {
    display: inline-flex; align-items: center; height: 28px; padding: 0 12px; border-radius: 6px; box-sizing: border-box;
    font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-muted); text-decoration: none; white-space: nowrap; cursor: pointer;
    border: 1px solid var(--wa-line-strong); background: transparent;
  }
  a.wa-wr-link:hover, button.wa-wr-link:hover { color: var(--wa-ink); background: var(--wa-hover); }
  a.wa-wr-link:focus-visible, button.wa-wr-link:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  a.wa-wr-link.on, button.wa-wr-link.on {
    color: var(--wa-ink); font-weight: 600;
    background: color-mix(in srgb, var(--wa-ink) 10%, transparent);
  }
  /* What the screen on show is, one quiet line under the row. */
  p.wa-wr-blurb {
    margin: 0; flex: none; padding: 8px 12px; font-size: 13px; line-height: 1.4; color: var(--wa-muted);
    background: var(--wa-top); border-bottom: 1px solid var(--wa-line);
  }
  p.wa-wr-blurb b { color: var(--wa-ink); font-weight: 600; }
  /* Where the unsaved work is. Slim and neutral: the orange dot at its start
     is the same mark the row and the tab carry. */
  p.wa-wr-unsaved {
    display: flex; align-items: baseline; gap: 8px; margin: 0; flex: none; padding: 6px 12px;
    font-size: 12.5px; line-height: 1.4; color: var(--wa-ink);
    background: var(--wa-top); border-bottom: 1px solid var(--wa-line);
  }
  p.wa-wr-unsaved > span { min-width: 0; }
  p.wa-wr-unsaved i.wa-unsaved { margin-left: 0; align-self: center; }
  p.wa-wr-unsaved a { color: var(--wa-ink); font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
  p.wa-wr-unsaved a:focus-visible { outline: none; border-radius: 3px; box-shadow: var(--wa-ring); }
  /* A phone: the watch on a line of its own, then the screens as one line
     that scrolls sideways, edge to edge, with no scroll bar. While more of it
     is hidden past the right edge (\`markRowMore\`) that edge fades out. The
     panel scrolls the screen on show into view (\`showRowLink\`). Wrapped,
     nine screens took four lines before the screen itself began. */
  @media (max-width: 640px) {
    .wa-wr-watch, .wa-wr-picker, button.wa-wr-pair { flex: 1 1 100%; margin-right: 0; }
    .wa-wr-watch::after, .wa-wr-picker::after { display: none; }
    button.wa-wr-open { flex: 1; min-width: 0; }
    button.wa-wr-open .wa-wr-name { flex: 1; text-align: left; }
    .wa-wr-links {
      flex: 1 1 calc(100% + 24px); flex-wrap: nowrap; margin: 0 -12px; padding: 3px 12px;
      overflow-x: auto; overscroll-behavior-x: contain; scrollbar-width: none;
      scroll-snap-type: x proximity; scroll-padding-inline: 12px;
    }
    .wa-wr-links::-webkit-scrollbar { display: none; }
    .wa-wr-links > a.wa-wr-link { flex: none; scroll-snap-align: start; }
    .wa-wr-links[data-more] {
      -webkit-mask-image: linear-gradient(to right, black calc(100% - 72px), transparent);
      mask-image: linear-gradient(to right, black calc(100% - 72px), transparent);
    }
    .wa-wr-links[data-back] {
      -webkit-mask-image: linear-gradient(to right, transparent, black 40px);
      mask-image: linear-gradient(to right, transparent, black 40px);
    }
    .wa-wr-links[data-back][data-more] {
      -webkit-mask-image: linear-gradient(to right, transparent, black 40px, black calc(100% - 72px), transparent);
      mask-image: linear-gradient(to right, transparent, black 40px, black calc(100% - 72px), transparent);
    }
  }
`;
