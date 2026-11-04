// The row of device tabs over a list of cards: All, a tab per device, "+N more"
// for the devices with nothing on them, then Not on a device set apart. The
// Complications list and the Pages, Status pages and Menus tabs draw one row.

import { css, html, nothing, type ReactiveController, type ReactiveControllerHost, type TemplateResult } from "lit";
import { splitPickerTabs } from "../complication-cards.js";
import { type PickerTab, UNASSIGNED_LABEL } from "../pickerRows.js";
import { type UiIconName, uiIcon } from "../ui-icons.js";
import type { DeviceKind } from "../version.js";
import type { LinkDevice } from "../watch-pages/devices.js";

/** The glyph a picker tab or section heading wears: the device itself, the
 * shelf for the library, and the grid for the All tab, which is no device. */
export function tabIcon(kind: DeviceKind | "all"): UiIconName {
  return kind === "all" ? "grid" : kind === "iphone" ? "phone" : kind === "library" ? "layers" : "watch";
}

export interface DeviceTabsInput {
  tabs: readonly PickerTab[];
  current: string;
  /** Whether "+N more" is open. */
  open: boolean;
  /** Open or shut "+N more"; with no value, the other of the two. */
  onToggle: (open?: boolean) => void;
  onPick: (key: string) => void;
  /** A tab's `--dc`, its device's color. */
  styleOf: (key: string) => string | typeof nothing;
}

export function renderDeviceTabs(input: DeviceTabsInput): TemplateResult {
  const { current, open, onToggle, onPick, styleOf } = input;
  const row = splitPickerTabs(input.tabs, current);
  const tabButton = (tab: PickerTab, extra = "") => html`<button type="button" role="tab" class="pk-tab ${extra} ${tab.key === current ? "on" : ""}"
      style=${styleOf(tab.key)} id=${`pk-tab-${tab.key}`} aria-selected=${tab.key === current ? "true" : "false"}
      aria-controls="pk-tabpanel" @click=${() => onPick(tab.key)}>
      <span class="pk-tab-glyph" aria-hidden="true">${uiIcon(tabIcon(tab.kind))}</span>
      <span class="pk-tab-name">${tab.label}</span>
      <span class="pk-tab-count">${tab.count}</span>
    </button>`;
  return html`<div class="pk-tabs" role="tablist" aria-label="Devices">
    ${row.all === undefined ? nothing : tabButton(row.all)}
    ${row.shown.map((tab) => tabButton(tab))}
    ${row.more.length === 0 ? nothing : html`<span class="pk-more" data-menu="tabs" role="presentation"
      @keydown=${(e: KeyboardEvent) => { if (e.key === "Escape" && open) { e.preventDefault(); e.stopPropagation(); onToggle(false); } }}>
      <button type="button" class="pk-more-btn" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"}
        title="The devices with nothing on them" @click=${() => onToggle()}>+${row.more.length} more${uiIcon("chevron")}</button>
      ${open ? html`<div class="pop-menu pk-more-menu" role="menu" aria-label="The devices with nothing on them">
        ${row.more.map((tab) => html`<button type="button" class="row" role="menuitem" style=${styleOf(tab.key)}
          @click=${() => { onToggle(false); onPick(tab.key); }}>
          <span class="pk-tab-glyph" aria-hidden="true">${uiIcon(tabIcon(tab.kind))}</span>
          <span class="pk-tab-name">${tab.label}</span><span class="pk-tab-count">${tab.count}</span></button>`)}
      </div>` : nothing}
    </span>`}
    ${row.shelf === undefined ? nothing : html`<span class="pk-vsep" aria-hidden="true"></span>${tabButton(row.shelf, "chip")}`}
  </div>`;
}

// ── the Pages, Status pages and Menus tabs ────────────────────────────────

/** The tab that lists what no device has. */
export const SHELF_TAB = "not-on-a-device";

/** A library tab's row: every device a list's item can be on, and Not on a
 * device while something waits there or it is the tab on screen. */
export function libraryDeviceTabs(input: {
  devices: readonly LinkDevice[];
  total: number;
  countOf: (ownerId: string) => number;
  shelved: number;
  current: string;
}): PickerTab[] {
  const tabs: PickerTab[] = [{ key: "all", label: "All", kind: "all", count: input.total }];
  for (const d of input.devices) tabs.push({ key: d.ownerId, label: d.name, kind: d.kind, count: input.countOf(d.ownerId) });
  if (input.shelved > 0 || input.current === SHELF_TAB) tabs.push({ key: SHELF_TAB, label: UNASSIGNED_LABEL, kind: "library", count: input.shelved });
  return tabs;
}

/** The list tabs on Not on a device. A device's tab lives in the address; this
 * has none, and holds until the panel is closed. */
const onShelf = new Set<string>();

export function shelfPicked(list: string): boolean {
  return onShelf.has(list);
}

export function pickShelf(list: string, on: boolean): void {
  if (on) onShelf.add(list);
  else onShelf.delete(list);
}

/** For a list tab, the device whose Focus pill was clicked: its address draws
 * the focused board for it, where any other way there draws the view kept. */
const boardFocus = new Map<string, string>();

export function focusedOnBoard(list: string, ownerId: string | undefined): boolean {
  return ownerId !== undefined && boardFocus.get(list) === ownerId;
}

export function noteBoardFocus(list: string, ownerId: string | undefined): void {
  if (ownerId === undefined) boardFocus.delete(list);
  else boardFocus.set(list, ownerId);
}

/** How long What next's New page waits for the Pages tab to take it. Only so a
 * tab that never came does not open a form much later. */
const NEW_PAGE_ASK_MS = 30_000;

/** What next's New page: the watch whose form the Pages tab opens on arrival. */
let newPageAsk: { ownerId: string; at: number } | undefined;

export function askNewPageOn(ownerId: string): void {
  newPageAsk = { ownerId, at: Date.now() };
}

/** The watch New page was asked for, while the ask is fresh. */
export function newPageAsked(): string | undefined {
  if (newPageAsk !== undefined && Date.now() - newPageAsk.at > NEW_PAGE_ASK_MS) newPageAsk = undefined;
  return newPageAsk?.ownerId;
}

export function takeNewPageAsked(): void {
  newPageAsk = undefined;
}

/** For a test: forget all of it. */
export function resetDeviceTabsForTest(): void {
  onShelf.clear();
  boardFocus.clear();
  newPageAsk = undefined;
}

/** "+N more" on an element with no menu of its own: open or shut, and shut by
 * a press anywhere else. */
export class DeviceTabsMenu implements ReactiveController {
  open = false;

  constructor(private readonly host: ReactiveControllerHost) {
    host.addController(this);
  }

  toggle = (next: boolean = !this.open): void => {
    if (next === this.open) return;
    this.open = next;
    if (next) window.addEventListener("pointerdown", this.outside, { capture: true });
    else window.removeEventListener("pointerdown", this.outside, { capture: true });
    this.host.requestUpdate();
  };

  hostDisconnected(): void {
    window.removeEventListener("pointerdown", this.outside, { capture: true });
    this.open = false;
  }

  private outside = (e: Event): void => {
    if (!e.composedPath().some((n) => n instanceof HTMLElement && n.dataset.menu === "tabs")) this.toggle(false);
  };
}

/* The device tabs under a list's head. They wrap onto a second row rather than
   scrolling sideways. A household of four people has eight device tabs, and a
   sideways scroller hides half of them behind a bar nobody thinks to drag: the
   whole point of the row is that the home is visible at a glance. */
export const deviceTabsStyles = css`
  .pk-tabs {
    display: flex; align-items: stretch; flex-wrap: wrap; gap: 0 2px; flex: none;
    padding: 0 8px; border-bottom: 1px solid var(--wa-line);
  }
  /* A hairline between things of two kinds: the view from the preview in
     the head, the devices from Not on a device in the tabs. */
  .pk-vsep { width: 1px; height: 20px; flex: none; align-self: center; margin: 0 6px; background: var(--wa-line-strong); }
  /* Not on a device is a state, not a device, so it is a chip and no tab. */
  .pk-tab.chip {
    align-self: center; height: 28px; box-sizing: border-box; padding: 0 11px; margin: 4px 0; gap: 6px;
    border: 1px solid var(--wa-line-strong); border-radius: 999px; background: var(--wa-card); color: var(--wa-soft, var(--wa-ink));
  }
  .pk-tab.chip.on { border-color: var(--wa-ink); color: var(--wa-ink); }
  .pk-tab.chip:focus-visible { border-radius: 999px; }
  /* "+2 more": the devices holding nothing, a click away. */
  .pk-more { position: relative; display: inline-flex; align-items: center; flex: none; margin: 0 2px; }
  .pk-more-btn {
    display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 9px; cursor: pointer;
    font: inherit; font-size: 12.5px; font-weight: 500; color: var(--wa-muted);
    border: 1px dashed var(--wa-line-strong); border-radius: 999px; background: transparent;
  }
  .pk-more-btn:hover, .pk-more-btn[aria-expanded="true"] { color: var(--wa-ink); border-color: var(--wa-muted); }
  .pk-more-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .pk-more-btn svg { width: 11px; height: 11px; }
  .pop-menu.pk-more-menu {
    position: absolute; top: calc(100% + 6px); left: 0; right: auto; width: max-content; min-width: 200px; max-width: min(320px, calc(100vw - 16px)); z-index: 6;
    background: var(--wa-card); color: var(--wa-ink); border: 1px solid var(--wa-line-strong);
    border-radius: var(--wa-r-md); box-shadow: var(--wa-shadow-pop); padding: 4px;
    display: flex; flex-direction: column; gap: 1px;
  }
  .pk-more-menu .row {
    display: flex; align-items: center; gap: 7px; width: 100%;
    font: inherit; font-size: 12.5px; font-weight: 600; text-align: left; white-space: nowrap;
    background: transparent; border: 0; color: inherit; padding: 6px 10px; border-radius: 7px; cursor: pointer;
  }
  .pk-more-menu .row:hover { background: var(--wa-panel); }
  .pk-more-menu .row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .pk-more-menu .pk-tab-glyph svg { width: 14px; height: 14px; }
  .pk-more-menu .pk-tab-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  /* Every tab alike but for its device's color (--dc, device-colors.ts) on the
     glyph and the selected one's underline. */
  .pk-tab {
    display: inline-flex; align-items: center; gap: 7px; flex: none; cursor: pointer;
    font: inherit; font-size: 12.5px; font-weight: 500; color: var(--wa-muted); white-space: nowrap;
    padding: 10px 7px; border: 0; background: transparent;
    border-bottom: 2px solid transparent; margin-bottom: -1px;
  }
  .pk-tab:hover { color: var(--wa-ink); }
  .pk-tab:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 7px 7px 0 0; }
  .pk-tab.on { color: var(--wa-ink); font-weight: 600; border-bottom-color: var(--dc, var(--wa-ink)); }
  .pk-tab svg { width: 15px; height: 15px; }
  .pk-tab-glyph { display: inline-flex; flex: none; color: var(--dc, var(--wa-muted)); }
  .pk-tab-count { font-size: 11.5px; font-weight: 400; color: var(--wa-muted); }
`;
