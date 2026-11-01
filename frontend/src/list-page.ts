// The Complications tab's list page: the Browse dialog's surface drawn in the
// page itself, while no design is open. The drawing is `renderPickerSurface`
// in panel.ts, which owns the state it reads; what can be worked out without
// the panel lives here, where a test can reach it.
//
// One surface, two forms. Over an open design it is the modal dialog it always
// was; with nothing open it is the page. The two are never on screen together:
// the dialog belongs to the editor's top bar, which is only drawn while a
// design is open, and the page only while none is.

import { css } from "lit";
import { ALL_DEVICES } from "./pickerRows.js";
import { COMPLICATIONS_PATH, designPath, designRouteOf, tabOfRoute } from "./shell.js";
import type { PanelRoute } from "./watch-pages/hook.js";

/** Where the surface is drawn: the modal dialog over the editor, or the page. */
export type PickerForm = "dialog" | "page";

/**
 * The class list of the surface's root. Both forms carry `pk-surface`, which
 * is what every rule shared by the two is keyed on (the Shape view's tighter
 * grid among them); `pk-dialog` and `pk-page` hold only what differs. The
 * dialog keeps its old class, which `showModal` and `close` find it by.
 */
export function pickerSurfaceClass(form: PickerForm, bare: boolean): string {
  return [form === "dialog" ? "pk-dialog" : "pk-page", "pk-surface", ...(bare ? ["bare"] : [])].join(" ");
}

/** Whether the list page is what the panel shows: the Complications tab, with
 * no design open. A design open on any device, even one that could not be
 * read, is the editor's. */
export function listPageShown(route: PanelRoute | undefined, designOpen: boolean): boolean {
  return !designOpen && tabOfRoute(route) === "complications";
}

/** What the list page draws: the list, the old start page as its empty state,
 * or a loading line while it is not known yet which of the two is true. */
export type ListPageState = "loading" | "empty" | "list";

/**
 * Which of the three the page is. Anything to show is the list, at once, even
 * while other devices are still being read. Nothing to show is only the
 * empty state once every list has answered: a home whose complications are
 * all on the second watch would otherwise be told it has none while that
 * watch's reply was on the way. A design being made and not saved yet is
 * something to show.
 */
export function listPageState(input: { rows: number; unsaved: boolean; ready: boolean }): ListPageState {
  if (input.rows > 0 || input.unsaved) return "list";
  return input.ready ? "empty" : "loading";
}

/**
 * Whether every list the page counts has answered: the device list, the
 * edited device's own list (no switch is underway), and the other devices'
 * lists, read for this same edited device. A home with no device at all has
 * nothing more to wait for once the device list is in.
 */
export function listsReady(input: {
  devicesLoaded: boolean;
  ownerBusy: boolean;
  ownerId: string | undefined;
  otherListsOwner: string | undefined;
  otherListsRead: boolean;
}): boolean {
  if (!input.devicesLoaded || input.ownerBusy) return false;
  if (input.ownerId === undefined) return true;
  return input.otherListsRead && input.otherListsOwner === input.ownerId;
}

/**
 * The device tab the surface is on, and the one the page comes back to.
 *
 * The two are apart for one reason: Browse all, over the editor, opens the
 * dialog on All, as its name promises, and that must not cost the page the
 * tab it was left on. A tab picked by hand, in either form, is remembered.
 */
export interface TabMemory {
  shown: string;
  remembered: string;
}

/** A tab picked by hand: shown, and remembered for the page. */
export function pickTab(_memory: TabMemory, key: string): TabMemory {
  return { shown: key, remembered: key };
}

/** Browse all: the dialog shows All, and the page's tab is left as it was. */
export function browseAllTab(memory: TabMemory): TabMemory {
  return { shown: ALL_DEVICES, remembered: memory.remembered };
}

/** The dialog shut, or the page entered: back to the remembered tab. */
export function restoreTab(memory: TabMemory): TabMemory {
  return { shown: memory.remembered, remembered: memory.remembered };
}

/**
 * What Escape closes on the page, most recent first: the Devices menu on a
 * card, then picking several. The dialog's own order is the same menu first,
 * then the dialog, which ends picking with it; the page has no dialog to
 * close, so picking is the next thing out. Undefined when there is nothing
 * open, and the key is left alone.
 */
export function listPageEscape(state: { dupOpen: boolean; selecting: boolean }): "dup" | "select" | undefined {
  if (state.dupOpen) return "dup";
  if (state.selecting) return "select";
  return undefined;
}

/** A saved design, by the two ids its address names. */
export interface DesignAt {
  owner: string;
  id: string;
}

/** What keeping the address and the open design in step asks for. */
export type DesignAddressStep =
  | { kind: "stay" }
  /** The design changed: the address follows it. */
  | { kind: "write"; path: string; replace: boolean }
  /** The address changed (Back, a link): open the design it names. */
  | { kind: "open"; owner: string; id: string }
  /** Back from a design to its list: close the design. */
  | { kind: "close" };

function sameDesign(a: DesignAt | undefined, b: DesignAt | undefined): boolean {
  return a !== undefined && b !== undefined && a.owner === b.owner && a.id === b.id;
}

/**
 * One open design has one address, `/complications/design/<owner>/<id>`, and
 * either can move first.
 *
 * Opening one writes the address: a new step for Back from the list, or the
 * same step when the editor moved from one design to another copy of it. A
 * design with no record yet has no address, so the list's address stands for
 * it until its first Save. Pressing Back moves the address first: a design's
 * address opens that design, and the list's closes the one Back came from.
 * Arriving at the list's address from another tab with a design still open
 * (it kept unsaved work) is that design's own address written over it.
 *
 * Closing a design is not here: whoever closes it knows whether the address
 * should move (`leaveDesignAddress` in the panel), and a device switch empties
 * the editor for a moment on its way to the next design.
 */
export function designAddressStep(input: {
  route: PanelRoute | undefined;
  /** The address before this draw, only when this draw moved it. */
  previous: PanelRoute | undefined;
  open: DesignAt | undefined;
  /** A design nobody has saved yet is open. */
  unsaved: boolean;
  /** A design opened, or got its first record, since the last draw. */
  opened: boolean;
}): DesignAddressStep {
  if (tabOfRoute(input.route) !== "complications") return { kind: "stay" };
  const named = designRouteOf(input.route);
  if (input.opened) {
    if (input.unsaved) return named === undefined ? { kind: "stay" } : { kind: "write", path: COMPLICATIONS_PATH, replace: false };
    if (input.open === undefined || sameDesign(named, input.open)) return { kind: "stay" };
    return { kind: "write", path: designPath(input.open.owner, input.open.id), replace: named !== undefined };
  }
  if (input.previous === undefined) return { kind: "stay" };
  if (named !== undefined) return sameDesign(named, input.open) ? { kind: "stay" } : { kind: "open", ...named };
  if (input.open === undefined) return { kind: "stay" };
  if (designRouteOf(input.previous) !== undefined) return { kind: "close" };
  return { kind: "write", path: designPath(input.open.owner, input.open.id), replace: true };
}

/** The line under the page's title: how many there are, and the one fact
 * about them a newcomer gets wrong. The title says Complications, as the tab
 * does, so this line is where an iPhone's widgets are counted in. */
export function listPageLead(total: number): string {
  const count = `${total} ${total === 1 ? "complication or widget" : "complications and widgets"}.`;
  return `${count} One design can be on more than one device.`;
}

/**
 * The page's look, added to the panel's sheet. The surface's own rules
 * (head, tabs, cards, foot) are the dialog's and stay in panel.ts, keyed on
 * `pk-surface`; these are only what the page form changes: no fixed height and
 * no scroll of its own, since the page scrolls, and a plain outlined card in
 * place of the dialog's frame and shadow. Every color is a panel token, so
 * the light skin reads as well as the dark one.
 */
export const listPageStyles = css`
  .cl-page {
    --cl-top: clamp(20px, 4vh, 40px);
    flex: 1 1 auto; min-height: 0; overflow: auto; box-sizing: border-box;
    padding: var(--cl-top) clamp(16px, 4vw, 40px) 48px;
    background: var(--wa-bg); color: var(--wa-ink);
  }
  .cl-wrap { width: min(2200px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
  .cl-head { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px 16px; padding: 0 2px; }
  .cl-head-text { flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .cl-head h1 { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -.02em; }
  .cl-lead { margin: 0; font-size: 14px; color: var(--wa-muted); }
  .cl-acts { display: flex; flex-wrap: wrap; gap: 8px; }
  a.cl-btn, button.cl-btn {
    display: inline-flex; align-items: center; gap: 6px; box-sizing: border-box; height: 30px; padding: 0 12px;
    border-radius: 6px; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; text-decoration: none;
    color: var(--wa-ink); background: var(--wa-card); border: 1px solid var(--wa-line-strong);
  }
  a.cl-btn:hover, button.cl-btn:hover:not(:disabled) { background: var(--wa-hover); }
  a.cl-btn:focus-visible, button.cl-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.cl-btn:disabled { opacity: .5; cursor: default; }
  .cl-btn svg.ui-icon { width: 14px; height: 14px; }
  /* The main job gets the one filled button on the page. */
  button.cl-btn.cl-new { background: var(--wa-primary-bg); color: var(--wa-primary-ink); border-color: transparent; }
  button.cl-btn.cl-new:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-primary-bg) 85%, var(--wa-muted)); }
  .cl-loading { margin: 0; padding: 24px 2px; font-size: 13px; color: var(--wa-muted); }
  .pk-surface.pk-page {
    display: flex; flex-direction: column; min-width: 0;
    border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-lg);
    background: var(--wa-card); color: var(--wa-ink);
  }
  .pk-page > .pk-body { flex: none; overflow: visible; min-height: 160px; }
  .pk-page > :first-child { border-top-left-radius: calc(var(--wa-r-lg) - 1px); border-top-right-radius: calc(var(--wa-r-lg) - 1px); }
  .pk-page > :last-child { border-bottom-left-radius: calc(var(--wa-r-lg) - 1px); border-bottom-right-radius: calc(var(--wa-r-lg) - 1px); }
  .pk-page .pk-head > .pk-search { margin-left: auto; }
  /* The head, the device tabs and the picking bar, pinned to the top of the
     page while the cards scroll under them. Not on a phone, where the tabs
     wrap to several rows and would leave too little room for the cards.
     A sticky box stops at the scroller's padding, so it reaches back over
     the page's top padding to sit on the very top edge. */
  .pk-page > .pk-pin { position: sticky; top: calc(-1 * var(--cl-top, 0px)); z-index: 3; background: var(--wa-card); }
  /* The editor's way back to the list leads its bar on one row or two: the
     stacked bar sends every other button to the second row. */
  header.stacked > button.tb-btn.tb-list, .wa-bar.stacked > button.tb-btn.tb-list { order: 0; }
  @media (max-width: 640px) {
    .cl-page { padding: 14px 12px 32px; }
    .cl-head h1 { font-size: 22px; }
    .pk-page .pk-head > .pk-search { margin-left: 0; flex: 1 1 100%; }
    .pk-page .pk-vsep { display: none; }
    .pk-page > .pk-pin { position: static; }
    /* The dialog's device tabs scroll sideways on a phone, to keep its fixed
       height for the cards. The page scrolls down instead, so here they wrap
       and nothing moves sideways. */
    .pk-page .pk-tabs {
      flex-wrap: wrap; overflow-x: visible;
      -webkit-mask-image: none; mask-image: none;
    }
  }
`;
