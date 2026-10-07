// The Watch app tab's second row, under the tabs on every watch screen: the
// shared watch at the left, then the eight screens and Settings, the screen
// on show marked. The panel draws it (`renderWatchRow`) and owns its state:
// the shared watch (`watch-pick.ts`), whether the watch menu is open, and what
// a pick or a screen does. Settings is a screen with an address like the
// others. HTTP actions and Cameras are shared by every watch, so their links
// never name one and a pick on them changes nothing they show. What can be worked out without
// the panel lives here, where a test can reach it.
//
// The row is neutral, like the tabs: the screen on show is marked by weight
// and a grey fill, never by a hue. Every link and button is a box with a one
// pixel outline. It wraps on a narrow screen rather than scroll sideways.

import { css, html, nothing, type TemplateResult } from "lit";
import type { OwnerSummary } from "./ha-api.js";
import { type DeviceSync, deviceSync, deviceSyncLabel } from "./send-state.js";
import { WATCH_SCREENS, WATCH_SETTINGS_SCREEN, type WatchScreen, isPlainClick, panelUrl, watchScreenOf, watchScreenPath } from "./shell.js";
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

export function watchRowLinks(route: PanelRoute | undefined, watch: string | undefined): WatchRowLink[] {
  const shown = watchScreenOf(route)?.id;
  return WATCH_SCREENS.map((screen) => ({ screen, path: watchScreenPath(screen, watch), on: screen.id === shown }));
}

/** The row's last link, Settings, on the shared watch. In a home with no
 * watch it is also where the first one pairs. */
export function watchRowSettingsLink(route: PanelRoute | undefined, watch: string | undefined): WatchRowLink {
  const screen = WATCH_SETTINGS_SCREEN;
  return { screen, path: watchScreenPath(screen, watch), on: watchScreenOf(route)?.id === screen.id };
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
  /** Settings and pairing are an administrator's, as every command in them
   * is; anyone else who lands on a watch screen gets the row without them. */
  admin: boolean;
  onMenu: (open: boolean) => void;
  onPick: (watchId: string) => void;
  /** A screen link pressed, Settings and Pair a watch included: its path
   * inside the panel. */
  onGo: (path: string) => void;
}

export function renderWatchRow(input: WatchRowInput): TemplateResult {
  const choices = watchRowChoices(input.owners, input.watch);
  const slot = watchRowSlot(input.loaded, choices.length);
  const href = (path: string) => panelUrl(input.route, path, globalThis.location?.pathname ?? "");
  const link = (l: WatchRowLink, cls = "", title?: string) => html`<a class="wa-wr-link ${cls}${l.on ? "on" : ""}"
    href=${href(l.path)} aria-current=${l.on ? "page" : "false"} title=${title ?? nothing}
    @click=${(e: MouseEvent) => {
      if (!isPlainClick(e)) return;
      e.preventDefault();
      if (!l.on) input.onGo(l.path);
    }}>${l.screen.label}</a>`;
  return html`<nav class="wa-watchrow" aria-label="Watch app">
    ${renderWatchSlot(input, slot, choices)}
    ${slot === "none" && input.admin ? html`<span class="wa-wr-note">${WATCH_ROW_NONE_NOTE}</span>` : nothing}
    <span class="wa-wr-links">
      ${slot === "none" ? nothing : watchRowLinks(input.route, input.watch).map((l) => link(l))}
      ${input.admin ? link(watchRowSettingsLink(input.route, input.watch), "wa-wr-settings ",
        "How the watch behaves: gestures, pages, cameras and connection") : nothing}
    </span>
  </nav>`;
}

function renderWatchSlot(input: WatchRowInput, slot: WatchRowSlot, choices: readonly WatchRowChoice[]) {
  if (slot === "loading") {
    return html`<span class="wa-wr-watch"><span class="wa-wr-chip" aria-hidden="true">${uiIcon("watch")}</span><span class="wa-wr-k">Watch</span><span class="wa-wr-wait">Loading…</span></span>`;
  }
  if (slot === "none") {
    if (!input.admin) return html`<span class="wa-wr-watch"><span class="wa-wr-chip" aria-hidden="true">${uiIcon("watch")}</span><span class="wa-wr-k">Watch</span><span class="wa-wr-wait">None yet</span></span>`;
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
`;
