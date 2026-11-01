// The board: one picture of where things are, the same on the Pages, the
// Status pages and the Menus tab. A row is a thing, a column is a device,
// and a box is where the thing is (plan: app repo
// docs/panel_one_board_plan_2026-10.md, step 2).
//
// A box is drawn from a `TickChip` (`ticks.ts`), so it says what a card's
// chip says and a click asks for the same write: a square tick puts a page
// or a status page on that device or takes it off; a round dot has the
// device use that menu, like a radio button, and a used dot cannot be
// unticked. A dash is a device the thing does not fit. Under a box, a small
// word says what is special there: "skips 2", "hidden", "1st page".
//
// Each column head has one Focus pill: it focuses that column, and the host
// then lists that device's things first, in its order, and lights the
// column. The rows and their words are the host's; this file only draws
// them, so the table, its sticky first column and its focus look are the
// same on every tab.
//
// The heads are their own row over the table (2026-10-31 review, fix 2). A
// table that scrolls sideways is a scroller of its own, so a head inside it
// could never stick to the page while the page scrolled. So the heads sit in
// a sticky strip of their own, the two scrollers move together
// (`WaBoardFrame`), and one set of column tracks keeps them lined up.

import { css, html, nothing, render, svg, unsafeCSS, type ReactiveController, type ReactiveControllerHost, type TemplateResult } from "lit";
import { uiIcon } from "../ui-icons.js";
import { setupMoveNeedsUpdate } from "../version.js";
import type { LinkDevice } from "../watch-pages/devices.js";
import { TICK_MARK, type TickAsk, type TickChip, type TickNoteKind, renderTickAsk } from "./ticks.js";

/** How a list tab shows its things: the board, or one card each. */
export type ListView = "board" | "cards";

/** How tall a board's rows are: 46 px with small pictures, or today's big
 * ones for whoever picks by look. */
export type BoardDensity = "compact" | "large";

/** How big a Compact row's picture is, in CSS pixels. */
export const COMPACT_PICTURE_PX = 32;

/** Where a browser keeps its density. One for every board. */
export const BOARD_DENSITY_STORE_KEY = "wrist-assistant-panel.board-density.v1";

let keptDensity: BoardDensity | undefined;

/** Large unless Compact was picked in this browser. */
export function boardDensity(storage: () => Pick<Storage, "getItem"> = () => window.localStorage): BoardDensity {
  if (keptDensity !== undefined) return keptDensity;
  try {
    keptDensity = storage().getItem(BOARD_DENSITY_STORE_KEY) === "compact" ? "compact" : "large";
  } catch {
    keptDensity = "large";
  }
  return keptDensity;
}

/** Compact or Large, picked by hand: remembered in this browser. */
export function setBoardDensity(density: BoardDensity, storage: () => Pick<Storage, "setItem"> = () => window.localStorage): void {
  keptDensity = density;
  try {
    storage().setItem(BOARD_DENSITY_STORE_KEY, density);
  } catch {
    /* Storage off: the choice still holds while the panel is open. */
  }
}

/** Forget what was read, for a test. */
export function resetBoardDensity(): void {
  keptDensity = undefined;
}

/** A screen this narrow (a phone) shows a list tab's things as cards: the
 * board's device columns would scroll sideways. */
export const PHONE_LIST_QUERY = "(max-width: 640px)";

/** The tabs where Board was picked on this visit, which a phone then keeps. */
const boardPickedHere = new Set<string>();

/** The view a tab shows: its kept one, except Cards on a phone unless Board
 * was picked on this visit (`noteViewPick`). */
export function phoneView(tab: string, view: ListView, narrow = phoneNarrow()): ListView {
  return view === "board" && narrow && !boardPickedHere.has(tab) ? "cards" : view;
}

/** A tab's Board or Cards, picked by hand. */
export function noteViewPick(tab: string, view: ListView): void {
  if (view === "board") boardPickedHere.add(tab);
  else boardPickedHere.delete(tab);
}

function phoneNarrow(): boolean {
  try {
    return window.matchMedia(PHONE_LIST_QUERY).matches;
  } catch {
    return false;
  }
}

/** A device's own screens, one click away from its focused column. */
export type DeviceOwnScreen = "settings" | "rooms" | "voice";

export const DEVICE_OWN_LABELS: Readonly<Record<DeviceOwnScreen, string>> = { settings: "Settings", rooms: "Rooms", voice: "Voice" };

/** How long "Saved" shows beside the head after a box's write lands. */
export const SAVED_FLASH_MS = 1800;

/** A list tab at least this wide (a big screen at normal zoom) draws its
 * rows' pictures `BOARD_WIDE_SCALE` times bigger, so the room shows the
 * things themselves instead of empty space either side; one at least
 * `BOARD_MID_PX` wide, `BOARD_MID_SCALE` times. */
const BOARD_WIDE_PX = 1500;
export const BOARD_WIDE_SCALE = 2.2;
/** A 4K screen at normal zoom: bigger again. */
const BOARD_HUGE_PX = 1900;
export const BOARD_HUGE_SCALE = 3.2;
const BOARD_MID_PX = 900;
export const BOARD_MID_SCALE = 1.5;
/** Under this width (a phone), smaller, so the names keep their room. */
const BOARD_SMALL_PX = 560;
export const BOARD_SMALL_SCALE = 0.8;

/** Tells its host whether it is wide (`BOARD_WIDE_PX`), and asks it to draw
 * again when that, or its picture scale, changes. */
export class WideWatch implements ReactiveController {
  wide = false;
  private scale = 1;
  private seen?: ResizeObserver;

  constructor(private readonly host: ReactiveControllerHost & HTMLElement) {
    host.addController(this);
  }

  hostConnected(): void {
    if (typeof ResizeObserver === "undefined") return;
    this.seen = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      const wide = width >= BOARD_WIDE_PX;
      const scale = width >= BOARD_HUGE_PX ? BOARD_HUGE_SCALE : wide ? BOARD_WIDE_SCALE : width >= BOARD_MID_PX ? BOARD_MID_SCALE : width > 0 && width < BOARD_SMALL_PX ? BOARD_SMALL_SCALE : 1;
      if (wide === this.wide && scale === this.scale) return;
      this.wide = wide;
      this.scale = scale;
      this.host.requestUpdate();
    });
    this.seen.observe(this.host);
  }

  hostDisconnected(): void {
    this.seen?.disconnect();
    this.seen = undefined;
  }

  /** A picture size for this width. */
  size(base: number): number {
    return Math.round(base * this.scale);
  }
}

/** Board or Cards, in a list tab's head. `many` names what is listed. */
export function renderViewSwitch(view: ListView, onPick: (view: ListView) => void, many: string): TemplateResult {
  const opt = (v: ListView, label: string, title: string) => html`<button type="button" class="bd-view-opt ${view === v ? "on" : ""}"
    aria-pressed=${view === v ? "true" : "false"} title=${title} @click=${() => { if (view !== v) onPick(v); }}>${uiIcon(v === "board" ? "checklist" : "grid")}<span>${label}</span></button>`;
  return html`<span class="bd-view" role="group" aria-label=${`How to show the ${many}`}>
    ${opt("board", "Board", `Every ${many.replace(/s$/, "")} as a row, every device as a column`)}${opt("cards", "Cards", `Every ${many.replace(/s$/, "")} as a card with its picture`)}
  </span>`;
}

/** Compact or Large, beside Board or Cards. */
export function renderDensitySwitch(density: BoardDensity, onPick: (density: BoardDensity) => void): TemplateResult {
  const opt = (d: BoardDensity, label: string, title: string, icon: TemplateResult) => html`<button type="button" class="bd-view-opt ${density === d ? "on" : ""}"
    aria-pressed=${density === d ? "true" : "false"} title=${title} @click=${() => { if (density !== d) onPick(d); }}>${icon}<span>${label}</span></button>`;
  return html`<span class="bd-view bd-density" role="group" aria-label="How big the rows are">
    ${opt("compact", "Compact", "Small rows, so more fit on one screen. Hover a picture to see it big.", COMPACT_ICON)}${opt("large", "Large", "Big rows with big pictures", LARGE_ICON)}
  </span>`;
}

const icon16 = (body: ReturnType<typeof svg>): TemplateResult => html`<svg class="bd-i" viewBox="0 0 16 16" aria-hidden="true">${body}</svg>`;
const COMPACT_ICON = icon16(svg`<path d="M2.5 3.5h11M2.5 6.5h11M2.5 9.5h11M2.5 12.5h11"/>`);
const LARGE_ICON = icon16(svg`<rect x="2.5" y="2.5" width="11" height="4.6" rx="1.2"/><rect x="2.5" y="9" width="11" height="4.6" rx="1.2"/>`);
const CROSSHAIR_ICON = icon16(svg`<circle cx="8" cy="8" r="4.6"/><path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3"/><circle class="bd-i-dot" cx="8" cy="8" r="1"/>`);
const CLOSE_ICON = icon16(svg`<path d="M4.5 4.5l7 7M11.5 4.5l-7 7"/>`);
const ARROW_ICON = icon16(svg`<path d="M3 8h9M8.5 4.5L12 8l-3.5 3.5"/>`);
const EYE_ICON = icon16(svg`<path d="M1.6 8s2.4-4.3 6.4-4.3S14.4 8 14.4 8s-2.4 4.3-6.4 4.3S1.6 8 1.6 8z"/><circle cx="8" cy="8" r="1.9"/>`);

/** One device across the top. */
export interface BoardColumn {
  device: LinkDevice;
  /** The device's color var (`device-colors.ts`). */
  color: string | undefined;
  /** How many things of the board's kind the device has. */
  count: number;
  /** The device cannot take any of these yet: the head's small badge, and
   * the words it opens (`boardColumnBlock`). Its boxes are dashes. */
  blocked?: BoardBlock;
}

/** Why a column takes nothing, on its head. */
export interface BoardBlock {
  badge: string;
  text: string;
}

/** A watch waiting for its iPhone's move, on a board's head: "Update app"
 * when its app is too old for the move, "Waiting" when only the move is out.
 * `text` says the rest. */
export function boardColumnBlock(appVersion: string | null | undefined, text: string): BoardBlock {
  return { badge: setupMoveNeedsUpdate(appVersion) ? "Update app" : "Waiting", text };
}

/** A square box's tooltip: what one click does there, with the device's name,
 * so a box low on the page still says whose it is. Anything a click cannot do
 * keeps the chip's own words. */
export function boardBoxTitle(chip: Pick<TickChip, "name" | "next" | "shape" | "title" | "hidden" | "skips">): string {
  if (chip.next === undefined || chip.shape === "round") return chip.title;
  const word = `${chip.next ? "Put on" : "Take off"} ${chip.name}`;
  const more = [...(chip.hidden ? ["It is hidden there."] : []), ...(chip.skips === undefined ? [] : [chip.skips.title])];
  return more.length === 0 ? word : `${word}. ${more.join(" ")}`;
}

/** One box: the device's chip for the row's thing, or a dash. */
export interface BoardCell {
  /** The chip's state and what a click asks for. Undefined draws a dash:
   * the thing does not fit this device. */
  chip?: TickChip;
  /** Why the dash, as its tooltip. */
  dashTitle?: string;
  /** Drawn greyed, with no dash: this kind of thing never goes on this kind
   * of device. The section's `note` says so once. */
  grey?: boolean;
  /** Where the row comes on the focused device, in the focused column's
   * ticked box (1, 2, 3...). */
  order?: number;
  /** A short word under the box ("skips 2", "1st page"), and its tooltip. */
  note?: string;
  noteTitle?: string;
  /** The word reads as a warning: the device will not show the thing. */
  noteWarn?: boolean;
  /** A click on the box: what the chip's `next` asks for. */
  onPick?: (on: boolean) => void;
  /** Hide here, in a focused column on one of its device's pages. */
  eye?: { hidden: boolean; busy: boolean; title: string; onToggle: () => void };
}

/** Drag and keyboard moves on a focused device's rows. */
export interface BoardDrag {
  on: boolean;
  dragging: boolean;
  over: boolean;
  below: boolean;
  onStart: (e: DragEvent) => void;
  onOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  onEnd: () => void;
  onKey: (e: KeyboardEvent) => void;
}

/** One thing down the side. */
export interface BoardRow {
  key: string;
  name: string;
  detail: string;
  /** A small picture beside the name. */
  picture?: TemplateResult;
  /** The name's tooltip, and what a click on it does. */
  openTitle: string;
  onOpen: (e: MouseEvent) => void;
  /** One cell per column, in column order. */
  cells: BoardCell[];
  /** Drawn dimmed: not on the focused device. */
  dim?: boolean;
  /** Multi select's box before the name. */
  select?: { picked: boolean; disabled: boolean; label: string; onPick: (e: MouseEvent) => void };
  drag?: BoardDrag;
  /** Small buttons after the name (a menu no device uses: Delete), out only
   * on the row under the pointer or the keyboard. */
  actions?: TemplateResult;
  /** What the "..." after them lists. */
  more?: readonly BoardMenuItem[];
  /** The big picture a Compact row's small one opens on hover. Drawn only
   * then. */
  peek?: () => BoardPeek;
  /** An untick asking first, drawn across the row under it. */
  ask?: TickAsk;
  /** The row's last refusal, or what its last tick did, under it. */
  note?: { text: string; kind: TickNoteKind };
  /** Anything else drawn across the row under it (a delete question). */
  under?: TemplateResult;
  /** A heading inside the section, drawn over the first of a run of rows
   * that share it (a complication's shape). */
  group?: string;
}

/** A group of rows under a heading. */
export interface BoardSection {
  key: string;
  title?: string;
  count?: number;
  /** The words at the heading's right. */
  hint?: string;
  /** One line under the heading, for what its rows all share. */
  note?: TemplateResult | string;
  rows: BoardRow[];
  /** What the section says with no rows. */
  empty?: string;
}

/** One choice in a row's "..." list. */
export interface BoardMenuItem {
  label: string;
  title?: string;
  disabled?: boolean;
  onPick: () => void;
}

/** What a Compact row's big picture shows. */
export interface BoardPeek {
  picture: TemplateResult | typeof nothing;
  /** Where the thing is: "3rd on Apple Watch, also on iPhone 15 Pro". */
  where?: string;
}

/** The one line under the column heads, in the host's words. */
export interface BoardLegend {
  /** After the box: "on that device". */
  tick: string;
  /** The box is a round dot: a device uses one of these. */
  round?: boolean;
  /** After Focus: "a device to order its pages". */
  focus: string;
  /** After the eye, on a board that has one: "hide but keep its place". */
  eye?: string;
  /** "Ticks save at once, with Undo". */
  saves: string;
}

export interface BoardInput {
  /** The table's name for a screen reader: "Pages on each device". */
  label: string;
  /** The first column's head: "Page", "Status page", "Menu". */
  thing: string;
  columns: readonly BoardColumn[];
  /** The focused device, by owner id. */
  focus?: string;
  /** A click on a Focus pill: focus that device, or undefined for all. */
  onFocus: (ownerId: string | undefined) => void;
  /** A Focus pill's tooltip, for a device not focused. */
  focusTitle: (device: LinkDevice) => string;
  sections: readonly BoardSection[];
  /** A big screen (`WideWatch`): bigger type and a roomier first column, in
   * Large only. */
  wide?: boolean;
  /** Compact or Large; the browser's (`boardDensity`) when not given. */
  density?: BoardDensity;
  /** The focused column numbers its ticks: the device keeps an order. */
  ordered?: boolean;
  /** The line under the heads. None when not given. */
  legend?: BoardLegend;
  /** Drawn in the sticky strip, over the heads (Multi select's bar). */
  pinned?: TemplateResult;
}

/** Whether two owner ids name one device. */
const same = (a: string | undefined, b: string | undefined): boolean => a !== undefined && b !== undefined && a.toUpperCase() === b.toUpperCase();

export function renderBoard(input: BoardInput): TemplateResult {
  const span = input.columns.length + 1;
  const focusAt = input.columns.findIndex((c) => same(c.device.ownerId, input.focus));
  const density = input.density ?? boardDensity();
  const wide = input.wide === true && density === "large";
  return html`<wa-board-frame class="bd-frame ${density} ${focusAt >= 0 ? "focused" : ""} ${wide ? "wide" : ""}" style=${`--bd-n:${input.columns.length}`} data-n=${input.columns.length}>
    <div class="bd-pin">
      ${input.pinned ?? nothing}
      <div class="bd-head-scroll">
        <div class="bd-head" role="group" aria-label="Devices">
          <div class="bd-hthing">${input.thing}</div>
          ${input.columns.map((col) => renderHead(col, same(col.device.ownerId, input.focus), input))}
        </div>
      </div>
      <button type="button" class="bd-more" hidden><span class="bd-more-t"></span>${ARROW_ICON}</button>
    </div>
    ${input.legend === undefined ? nothing : renderLegend(input.legend)}
    <div class="bd-scroll">
      <table class="bd ${density} ${focusAt >= 0 ? "focused" : ""} ${wide ? "wide" : ""}" aria-label=${input.label}>
        <thead class="bd-thead"><tr>
          <th scope="col" class="bd-thing"><span class="bd-sr">${input.thing}</span></th>
          ${input.columns.map((col, i) => html`<th scope="col" class="bd-col ${i === focusAt ? "on" : ""}"><span class="bd-sr">${col.device.name}</span></th>`)}
        </tr></thead>
        ${input.sections.map((section) => html`<tbody class="bd-sect-body" data-section=${section.key}>
          ${section.title === undefined ? nothing : html`<tr class="bd-sect"><th colspan=${span} scope="colgroup">
            <span class="bd-sect-t">${section.title}${section.count === undefined ? nothing : html` <small>${section.count}</small>`}</span>
            ${section.hint === undefined ? nothing : html`<span class="bd-sect-r">${section.hint}</span>`}
            ${section.note === undefined ? nothing : html`<span class="bd-sect-note">${uiIcon("info")}<span>${section.note}</span></span>`}
          </th></tr>`}
          ${section.rows.length === 0 && section.empty !== undefined
            ? html`<tr class="bd-none"><td colspan=${span}>${section.empty}</td></tr>`
            : section.rows.map((row, i) => html`${row.group !== undefined && row.group !== section.rows[i - 1]?.group
              ? renderGroup(row.group, section.rows.slice(i).findIndex((r) => r.group !== row.group), section.rows.length - i, span)
              : nothing}${renderRow(row, input, focusAt, span, density)}`)}
        </tbody>`)}
      </table>
    </div>
    <div class="bd-peek" hidden aria-hidden="true"></div>
    <div class="bd-pop" hidden></div>
  </wa-board-frame>`;
}

/**
 * A small table in a board's frame, for what has nothing to tick: the same heads
 * and column tracks as a board, so it lines up with the boards around it and
 * scrolls sideways the same way, with no count or Focus in its heads. `body` is
 * the table's own rows, each with a `.bd-thing` and a `.bd-cell` per column.
 */
export function renderPlainBoard(input: {
  label: string;
  thing: string;
  columns: readonly Pick<BoardColumn, "device" | "color">[];
  body: unknown;
}): TemplateResult {
  const density = boardDensity();
  return html`<wa-board-frame class="bd-frame ${density}" style=${`--bd-n:${input.columns.length}`} data-n=${input.columns.length}>
    <div class="bd-pin">
      <div class="bd-head-scroll">
        <div class="bd-head" role="group" aria-label="Devices">
          <div class="bd-hthing">${input.thing}</div>
          ${input.columns.map((col) => html`<div class="bd-hcol" style=${col.color === undefined ? nothing : `--dc:${col.color}`}>${renderHeadName(col.device)}</div>`)}
        </div>
      </div>
      <button type="button" class="bd-more" hidden><span class="bd-more-t"></span>${ARROW_ICON}</button>
    </div>
    <div class="bd-scroll">
      <table class="bd ${density}" aria-label=${input.label}>
        <thead class="bd-thead"><tr>
          <th scope="col" class="bd-thing"><span class="bd-sr">${input.thing}</span></th>
          ${input.columns.map((col) => html`<th scope="col" class="bd-col"><span class="bd-sr">${col.device.name}</span></th>`)}
        </tr></thead>
        ${input.body}
      </table>
    </div>
    <div class="bd-peek" hidden aria-hidden="true"></div>
    <div class="bd-pop" hidden></div>
  </wa-board-frame>`;
}

/** A device's glyph and name, at the top of its head. */
function renderHeadName(d: LinkDevice): TemplateResult {
  return html`<span class="bd-col-top" title=${d.name}>
    <span class="bd-col-glyph" aria-hidden="true">${uiIcon(d.kind === "iphone" ? "phone" : "watch")}</span>
    <span class="bd-col-name">${d.name}</span>
  </span>`;
}

/** The line under the heads: what a box, Focus and the eye do, and that a
 * tick needs no Save. */
function renderLegend(legend: BoardLegend): TemplateResult {
  const dot = html`<i aria-hidden="true">·</i>`;
  return html`<div class="bd-legend">
    <span><span class="bd-legend-box ${legend.round === true ? "rd" : ""}" aria-hidden="true">${legend.round === true ? nothing : TICK_MARK}</span> ${legend.tick}</span>${dot}
    <span>${CROSSHAIR_ICON} <b>Focus</b> ${legend.focus}</span>${dot}
    ${legend.eye === undefined ? nothing : html`<span>${EYE_ICON} ${legend.eye}</span>${dot}`}
    <span>${legend.saves}</span>
  </div>`;
}

/** A focused device's banner over its board: which device comes first, what
 * it has, its own screens, and the way back to every device. */
export function renderFocusBanner(banner: {
  device: LinkDevice;
  color: string | undefined;
  /** After the name: "9 pages, in the order the watch shows them". */
  text: string;
  /** Open one of the device's own screens; no links when not given. */
  onOwn?: (screen: DeviceOwnScreen) => void;
  onAll: () => void;
}): TemplateResult {
  const { device } = banner;
  const own: DeviceOwnScreen[] = device.kind === "watch" ? ["settings", "rooms", "voice"] : ["settings", "rooms"];
  const onOwn = banner.onOwn;
  return html`<div class="bd-focus" style=${banner.color === undefined ? nothing : `--dc:${banner.color}`}>
    <span class="bd-focus-glyph" aria-hidden="true">${uiIcon(device.kind === "iphone" ? "phone" : "watch")}</span>
    <span class="bd-focus-t"><b>Showing ${device.name} first</b><span class="bd-focus-sep" aria-hidden="true">·</span><span>${banner.text}</span></span>
    ${onOwn === undefined ? nothing : html`<span class="bd-focus-own">Also on this ${device.kind === "iphone" ? "iPhone" : "watch"}:
      ${own.map((screen) => html`<button type="button" class="bd-link" @click=${() => onOwn(screen)}>${DEVICE_OWN_LABELS[screen]}</button>`)}</span>`}
    <button type="button" class="bd-focus-all" @click=${() => banner.onAll()}>${uiIcon("grid")}<span>Show every device</span></button>
  </div>`;
}

/** A run of rows' heading: its name and how many rows it has (`ends`, the
 * index of the first row past the run, or -1 when the run reaches the
 * section's last of `left` rows). */
function renderGroup(group: string, ends: number, left: number, span: number): TemplateResult {
  return html`<tr class="bd-group"><th colspan=${span} scope="rowgroup">
    <span class="bd-group-t">${group} <small>${ends < 0 ? left : ends}</small></span>
  </th></tr>`;
}

/** A device's head: its name, how many it has, and its one Focus pill. */
function renderHead(col: BoardColumn, focused: boolean, input: BoardInput): TemplateResult {
  const d = col.device;
  const blocked = col.blocked;
  return html`<div class="bd-hcol ${focused ? "on" : ""}" style=${col.color === undefined ? nothing : `--dc:${col.color}`}>
    ${renderHeadName(d)}
    ${blocked === undefined ? nothing : html`<button type="button" class="bd-upd" title=${blocked.text} aria-label=${`${blocked.badge}. ${blocked.text}`}
      @click=${(e: Event) => frameOf(e)?.openNote(e.currentTarget as HTMLElement, blocked.text)}>${blocked.badge}${uiIcon("info")}</button>`}
    <span class="bd-col-sub"><span class="bd-col-n">${col.count}</span>
      <button type="button" class="bd-focus-pill ${focused ? "on" : ""}" aria-pressed=${focused ? "true" : "false"}
        aria-label=${focused ? `Stop focusing ${d.name}` : `Focus ${d.name}`}
        title=${focused ? "Show every device" : input.focusTitle(d)}
        @click=${() => input.onFocus(focused ? undefined : d.ownerId)}>${focused ? html`<span>Focused</span>${CLOSE_ICON}` : html`${CROSSHAIR_ICON}<span>Focus</span>`}</button></span>
  </div>`;
}

function renderRow(row: BoardRow, input: BoardInput, focusAt: number, span: number, density: BoardDensity): TemplateResult {
  const columns = input.columns;
  const ordered = input.ordered === true && focusAt >= 0;
  const drag = row.drag;
  const cls = `bd-row ${row.dim ? "dim" : ""} ${row.select?.picked ? "picked" : ""} ${drag?.dragging ? "dragging" : ""} ${drag?.over ? "drag-over" : ""} ${drag?.below ? "below" : ""}`;
  const peek = density === "compact" ? row.peek : undefined;
  const show = (at: Element) => { if (peek !== undefined) frameOf({ currentTarget: at })?.showPeek(at, () => renderPeekCard(row, peek())); };
  const hide = (e: Event) => { if (peek !== undefined) frameOf(e)?.hidePeek(); };
  const more = row.more;
  const main = html`<tr class=${cls} data-row=${row.key} draggable=${drag?.on ? "true" : "false"}
    @dragstart=${(e: DragEvent) => drag?.onStart(e)}
    @dragover=${(e: DragEvent) => drag?.onOver(e)}
    @drop=${(e: DragEvent) => drag?.onDrop(e)}
    @dragend=${() => drag?.onEnd()}
    @keydown=${(e: KeyboardEvent) => drag?.onKey(e)}>
    <th scope="row" class="bd-thing">
      <span class="bd-thing-in">
        ${drag === undefined
          ? ordered ? html`<span class="bd-grip none" aria-hidden="true">${uiIcon("grip")}</span>` : nothing
          : html`<span class="bd-grip" aria-hidden="true" title=${drag.on ? "Drag to order" : ""}>${uiIcon("grip")}</span>`}
        ${row.select === undefined ? nothing : html`<input type="checkbox" class="pk-card-pick" .checked=${row.select.picked}
          ?disabled=${row.select.disabled} aria-label=${row.select.label}
          @click=${(e: MouseEvent) => { e.stopPropagation(); row.select!.onPick(e); }} />`}
        <button type="button" class="bd-open" title=${row.openTitle} @click=${(e: MouseEvent) => row.onOpen(e)}
          @focusin=${(e: FocusEvent) => { const at = e.currentTarget as HTMLElement; if (at.matches(":focus-visible")) show(at.querySelector(".bd-pic") ?? at); }}
          @focusout=${hide}>
          ${row.picture === undefined ? nothing : html`<span class="bd-pic"
            @pointerenter=${(e: PointerEvent) => { if (e.pointerType !== "touch") show(e.currentTarget as Element); }}
            @pointerleave=${hide}>${row.picture}</span>`}
          <span class="bd-nm"><span class="bd-n">${row.name}</span><span class="bd-m">${row.detail}</span></span>
        </button>
        ${row.actions === undefined && more === undefined ? nothing : html`<span class="bd-row-acts">
          ${row.actions ?? nothing}
          ${more === undefined ? nothing : html`<button type="button" class="bd-act" title="More" aria-label=${`More for ${row.name}`} aria-haspopup="menu"
            @click=${(e: Event) => { e.stopPropagation(); frameOf(e)?.openMenu(e.currentTarget as HTMLElement, `More for ${row.name}`, more); }}>${uiIcon("more")}</button>`}
        </span>`}
      </span>
    </th>
    ${columns.map((col, i) => renderCell(row, row.cells[i], col, i === focusAt, ordered, input.legend?.eye !== undefined))}
  </tr>`;
  const under = row.ask !== undefined || row.note !== undefined || row.under !== undefined;
  if (!under) return main;
  return html`${main}<tr class="bd-under ${row.dim ? "dim" : ""}"><td colspan=${span}>
    ${row.ask === undefined ? nothing : renderTickAsk(row.ask)}
    ${row.note === undefined ? nothing : row.note.kind === "ok"
      ? html`<p class="lt-note ok" role="status">${row.note.text}</p>`
      : html`<p class="lt-note" role="alert">${row.note.text}</p>`}
    ${row.under ?? nothing}
  </td></tr>`;
}

function renderCell(row: BoardRow, cell: BoardCell | undefined, col: BoardColumn, focused: boolean, ordered: boolean, eyes: boolean): TemplateResult {
  const style = col.color === undefined ? nothing : `--dc:${col.color}`;
  const chip = cell?.chip;
  if (chip === undefined) {
    const why = cell?.dashTitle ?? `Does not fit ${col.device.name}`;
    return html`<td class="bd-cell ${focused ? "on" : ""} ${cell?.grey ? "grey" : ""}" style=${style}>
      <span class=${cell?.grey ? "bd-grey" : "bd-dash"} role="img" aria-label=${why} title=${why}></span>
    </td>`;
  }
  const round = chip.shape === "round";
  // The focused column's boxes line up whichever rows have a number or an eye.
  const slots = focused && ordered;
  return html`<td class="bd-cell ${focused ? "on" : ""}" style=${style}>
    <span class="bd-cell-in ${slots ? "slots" : ""}">
      <button type="button" role="checkbox" class="bd-box ${chip.on ? "ticked" : ""} ${round ? "rd" : ""} ${chip.busy ? "busy" : ""} ${chip.stuck === undefined ? "" : "stuck"} ${chip.hidden ? "dim" : ""}"
        title=${chip.title} aria-label=${`${row.name} on ${chip.name}`}
        aria-checked=${chip.on ? "true" : "false"} aria-disabled=${chip.next === undefined ? "true" : "false"}
        @click=${(e: Event) => {
          e.stopPropagation();
          // A box asks for nothing while busy, locked, or a used menu's dot.
          if (chip.next !== undefined) cell?.onPick?.(chip.next);
        }}><span class="bd-mark" aria-hidden="true">${chip.on && !round ? TICK_MARK : nothing}</span></button>
      ${slots ? html`<span class="bd-ord" title=${cell?.order === undefined ? nothing : `Number ${cell.order} on ${chip.name}`}>${cell?.order ?? nothing}</span>` : nothing}
      ${cell?.eye === undefined ? (slots && eyes ? html`<span class="bd-no-eye" aria-hidden="true"></span>` : nothing) : html`<button type="button" class="bd-eye ${cell.eye.hidden ? "hid" : ""}" ?disabled=${cell.eye.busy}
        title=${cell.eye.title} aria-label=${cell.eye.title} aria-pressed=${cell.eye.hidden ? "true" : "false"}
        @click=${(e: Event) => { e.stopPropagation(); cell.eye!.onToggle(); }}>${uiIcon(cell.eye.hidden ? "hide" : "show")}</button>`}
    </span>
    ${chip.hidden && cell?.note === undefined ? html`<em class="bd-note">hidden</em>` : nothing}
    ${cell?.note === undefined ? nothing : html`<em class="bd-note ${cell.noteWarn ? "warn" : ""}" title=${cell.noteTitle ?? nothing}>${cell.note}</em>`}
  </td>`;
}

/** A Compact row's big picture, over the page while the pointer is on its
 * small one. */
function renderPeekCard(row: BoardRow, peek: BoardPeek): TemplateResult {
  return html`<div class="bd-peek-h"><b>${row.name}</b><span>${row.detail}</span></div>
    <div class="bd-peek-pic">${peek.picture}</div>
    ${peek.where === undefined ? nothing : html`<div class="bd-peek-w">${peek.where}</div>`}
    <div class="bd-peek-k">Click the row to open the editor</div>`;
}

/** How many columns are not really on screen: more than half of each is past
 * the right edge. */
export function columnsPastEdge(columns: readonly { left: number; right: number }[], edge: number): number {
  return columns.filter((c) => c.right - edge > (c.right - c.left) / 2).length;
}

/** The button at the right of a narrow board's heads: "+2 devices". */
export function moreDevicesText(n: number): string {
  return `+${n} ${n === 1 ? "device" : "devices"}`;
}

/** How long the pointer rests on a small picture before the big one opens. */
const PEEK_AFTER_MS = 180;

/** The room a big picture wants under its small one, or it opens above. */
const PEEK_ROOM_PX = 380;

/** Node has no HTMLElement, and the tests import this through the board;
 * there the element is defined but never made. */
const FrameBase = (typeof HTMLElement === "undefined" ? class {} : HTMLElement) as typeof HTMLElement;

/** The board's frame around one thing. */
function frameOf(e: { currentTarget: EventTarget | Element | null }): WaBoardFrame | null {
  const at = e.currentTarget as Element | null;
  return at?.closest?.("wa-board-frame") as WaBoardFrame | null ?? null;
}

/**
 * What a board does that a template cannot: it keeps the sticky heads and the
 * table scrolled to one place sideways, says how many device columns are past
 * the right edge ("+2 devices"), and opens the big picture and the small
 * lists over the page. It draws nothing itself: everything in it is the
 * host's light DOM, so the host's sheet styles it. Those two lists and the
 * big picture stand outside both scrollers and are `position: fixed`, or a
 * scroller would cut them off.
 */
export class WaBoardFrame extends FrameBase {
  static get observedAttributes(): string[] {
    return ["class", "data-n"];
  }

  private sized?: ResizeObserver;
  private peekTimer: ReturnType<typeof setTimeout> | undefined;
  private popAnchor: HTMLElement | undefined;
  /** Where the two scrollers were last moved to. */
  private pushed = 0;
  /** Scrolls in the host's shadow root do not cross it, so it is watched too. */
  private watchedRoot: Node | undefined;
  /** Where the outside-press listener went. Once this element has left the
   * page, `getRootNode` can no longer find that node. */
  private popRoot: Node | undefined;

  private child<T extends HTMLElement>(selector: string): T | null {
    return this.querySelector<T>(selector);
  }

  connectedCallback(): void {
    this.addEventListener("scroll", this.onInnerScroll, { capture: true, passive: true });
    this.addEventListener("click", this.onClick);
    this.addEventListener("keydown", this.onKey);
    this.addEventListener("dragstart", this.onOuterScroll);
    if (typeof ResizeObserver !== "undefined") {
      this.sized = new ResizeObserver(() => this.measure());
      this.sized.observe(this);
    }
    queueMicrotask(() => this.measure());
  }

  disconnectedCallback(): void {
    this.removeEventListener("scroll", this.onInnerScroll, { capture: true });
    this.removeEventListener("click", this.onClick);
    this.removeEventListener("keydown", this.onKey);
    this.removeEventListener("dragstart", this.onOuterScroll);
    this.sized?.disconnect();
    this.sized = undefined;
    this.hidePeek();
    this.closePop(false);
  }

  attributeChangedCallback(): void {
    if (this.isConnected) requestAnimationFrame(() => this.measure());
  }

  /** The heads and the table move together, whichever was scrolled. */
  private onInnerScroll = (e: Event): void => {
    const head = this.child(".bd-head-scroll");
    const body = this.child(".bd-scroll");
    if (head === null || body === null || (e.target !== body && e.target !== head)) return;
    const from = e.target === body ? body : head;
    const to = e.target === body ? head : body;
    // The other one's echo of a move made here: answering it would stop a
    // smooth scroll on its way.
    if (Math.abs(from.scrollLeft - this.pushed) >= 1) {
      this.pushed = from.scrollLeft;
      to.scrollLeft = from.scrollLeft;
    }
    this.measure();
    this.onOuterScroll();
  };

  private onOuterScroll = (): void => {
    this.hidePeek();
    this.closePop(false);
  };

  private onClick = (e: Event): void => {
    const more = this.child(".bd-more");
    if (more !== null && e.composedPath().includes(more)) this.showMore();
  };

  private onKey = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      if (this.popAnchor !== undefined) {
        e.stopPropagation();
        this.closePop(true);
      }
      this.hidePeek();
      return;
    }
    if (this.popAnchor === undefined || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
    const items = [...(this.child(".bd-pop")?.querySelectorAll<HTMLButtonElement>("[role=menuitem]:not(:disabled)") ?? [])];
    if (items.length === 0) return;
    e.preventDefault();
    const at = items.indexOf(e.composedPath()[0] as HTMLButtonElement);
    items[(at + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
  };

  private measure(): void {
    const head = this.child(".bd-head-scroll");
    const body = this.child(".bd-scroll");
    const more = this.child<HTMLButtonElement>(".bd-more");
    if (head === null || body === null || more === null) return;
    const edge = head.getBoundingClientRect().right;
    const columns = [...head.querySelectorAll(".bd-hcol")].map((c) => c.getBoundingClientRect()).filter((r) => r.width > 0);
    const past = columnsPastEdge(columns, edge);
    this.toggleAttribute("fades", body.scrollLeft + body.clientWidth < body.scrollWidth - 1);
    more.hidden = past === 0;
    const words = more.querySelector(".bd-more-t");
    if (words !== null) words.textContent = moreDevicesText(past);
  }

  /** "+2 devices": on by a screen of device columns. */
  private showMore(): void {
    const body = this.child(".bd-scroll");
    if (body === null) return;
    const first = this.child(".bd-hthing")?.offsetWidth ?? 0;
    const calm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
    body.scrollBy({ left: Math.max(96, body.clientWidth - first), behavior: calm ? "auto" : "smooth" });
  }

  /** Shut the big picture and the lists when the page moves under them. */
  private watchOuterScroll(on: boolean): void {
    const root = this.getRootNode();
    if (on && this.watchedRoot === undefined) {
      this.watchedRoot = root;
      root.addEventListener("scroll", this.onOuterScroll, { capture: true, passive: true });
      window.addEventListener("scroll", this.onOuterScroll, { capture: true, passive: true });
    } else if (!on && this.watchedRoot !== undefined && this.popAnchor === undefined && this.child(".bd-peek")?.hidden !== false) {
      this.watchedRoot.removeEventListener("scroll", this.onOuterScroll, { capture: true });
      window.removeEventListener("scroll", this.onOuterScroll, { capture: true });
      this.watchedRoot = undefined;
    }
  }

  /** Open a row's big picture by its small one, after a short rest. */
  showPeek(anchor: Element, draw: () => TemplateResult): void {
    clearTimeout(this.peekTimer);
    this.peekTimer = setTimeout(() => {
      const peek = this.child(".bd-peek");
      if (peek === null || !anchor.isConnected) return;
      const at = anchor.getBoundingClientRect();
      render(draw(), peek);
      peek.style.left = `${Math.max(8, Math.min(at.left, window.innerWidth - 250))}px`;
      if (window.innerHeight - at.bottom >= PEEK_ROOM_PX) {
        peek.style.top = `${at.bottom + 8}px`;
        peek.style.bottom = "";
      } else {
        peek.style.top = "";
        peek.style.bottom = `${Math.max(8, window.innerHeight - at.top + 8)}px`;
      }
      peek.hidden = false;
      this.watchOuterScroll(true);
    }, PEEK_AFTER_MS);
  }

  hidePeek(): void {
    clearTimeout(this.peekTimer);
    const peek = this.child(".bd-peek");
    if (peek !== null) peek.hidden = true;
    this.watchOuterScroll(false);
  }

  /** A row's "..." list, under its button, focused on its first choice. */
  openMenu(anchor: HTMLElement, label: string, items: readonly BoardMenuItem[]): void {
    if (this.popAnchor === anchor) {
      this.closePop(true);
      return;
    }
    this.openPop(anchor, html`<div role="menu" aria-label=${label}>${items.map((item) => html`<button type="button" role="menuitem" class="bd-pop-item"
      ?disabled=${item.disabled === true} title=${item.title ?? nothing}
      @click=${() => { this.closePop(true); item.onPick(); }}>${item.label}</button>`)}</div>`);
    this.child(".bd-pop")?.querySelector<HTMLButtonElement>("[role=menuitem]:not(:disabled)")?.focus();
  }

  /** A few words under a button: what its tooltip says, for a touch screen. */
  openNote(anchor: HTMLElement, text: string): void {
    if (this.popAnchor === anchor) {
      this.closePop(true);
      return;
    }
    this.openPop(anchor, html`<p class="bd-pop-note" role="status">${text}</p>`);
  }

  private openPop(anchor: HTMLElement, content: TemplateResult): void {
    const pop = this.child(".bd-pop");
    if (pop === null) return;
    this.closePop(false);
    render(content, pop);
    pop.hidden = false;
    const at = anchor.getBoundingClientRect();
    const width = pop.offsetWidth;
    const height = pop.offsetHeight;
    pop.style.left = `${Math.max(8, Math.min(at.left, window.innerWidth - width - 8))}px`;
    pop.style.top = `${at.bottom + height + 12 > window.innerHeight ? Math.max(8, at.top - height - 4) : at.bottom + 4}px`;
    this.popAnchor = anchor;
    anchor.setAttribute("aria-expanded", "true");
    anchor.closest(".bd-row")?.classList.add("pop-open");
    this.popRoot = this.getRootNode();
    this.popRoot.addEventListener("pointerdown", this.onOutside, true);
    this.watchOuterScroll(true);
  }

  private onOutside = (e: Event): void => {
    const pop = this.child(".bd-pop");
    const path = e.composedPath();
    if (pop === null || path.includes(pop) || (this.popAnchor !== undefined && path.includes(this.popAnchor))) return;
    this.closePop(false);
  };

  private closePop(refocus: boolean): void {
    const anchor = this.popAnchor;
    if (anchor === undefined) return;
    this.popAnchor = undefined;
    const pop = this.child(".bd-pop");
    if (pop !== null) pop.hidden = true;
    anchor.removeAttribute("aria-expanded");
    anchor.closest(".bd-row")?.classList.remove("pop-open");
    this.popRoot?.removeEventListener("pointerdown", this.onOutside, true);
    this.popRoot = undefined;
    this.watchOuterScroll(false);
    if (refocus) anchor.focus();
  }
}

if (typeof customElements !== "undefined" && !customElements.get("wa-board-frame")) {
  customElements.define("wa-board-frame", WaBoardFrame);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-board-frame": WaBoardFrame;
  }
}

/** The board's look, in the panel's tokens. The first column stays put
 * while a wide home scrolls sideways inside the board; the page itself
 * never scrolls sideways. */
export const boardStyles = css`
  /* One set of column tracks for the heads and the table, so a head stands
     over its boxes whichever way they scroll. Large: the device columns keep
     one narrow width (--bd-col-w) and the first column takes the rest, so a
     wide screen gives its room to the things' pictures, not to gaps between
     ticks (Jesse, 2026-10-23). Compact: the first column stops at 320 px and
     the device columns share the rest, so a row's box is beside its name. */
  wa-board-frame { display: block; position: relative; min-width: 0; }
  .bd-frame {
    --bd-ground: var(--wa-bg); --bd-col-w: 104px; --bd-min-first: 220px;
    --bd-first-track: minmax(0, 1fr); --bd-col-track: var(--bd-col-w);
    --bd-first-w: auto; --bd-cell-w: var(--bd-col-w);
    --bd-width-min: calc(var(--bd-min-first) + var(--bd-n, 0) * var(--bd-col-w));
    --bd-width-max: none;
  }
  .bd-frame.compact {
    --bd-col-w: 96px; --bd-min-first: 320px;
    --bd-first-track: 320px; --bd-col-track: minmax(var(--bd-col-w), 1fr);
    --bd-first-w: 320px; --bd-cell-w: auto;
  }
  @media (max-width: 1100px) {
    .bd-frame.compact { --bd-min-first: 240px; --bd-first-track: 240px; --bd-first-w: 240px; }
  }
  .bd-frame.wide { --bd-col-w: 124px; --bd-min-first: 320px; }

  /* The heads stay on screen while the page scrolls, under the tab bar. */
  .bd-pin { position: sticky; top: var(--bd-pin-top, 0px); z-index: 6; background: var(--bd-ground); box-shadow: 0 6px 8px -6px rgba(0, 0, 0, .45); }
  .bd-head-scroll { overflow-x: auto; scrollbar-width: none; }
  .bd-head-scroll::-webkit-scrollbar { display: none; }
  .bd-head {
    display: grid; grid-template-columns: var(--bd-first-track) repeat(var(--bd-n, 0), var(--bd-col-track));
    width: 100%; min-width: var(--bd-width-min); max-width: var(--bd-width-max); box-sizing: border-box;
    border-bottom: 1px solid var(--wa-line); background: var(--wa-card);
  }
  .bd-hthing {
    position: sticky; left: 0; z-index: 2; display: flex; align-items: flex-end; padding: 8px 10px 10px;
    background: var(--wa-card); font-size: 12px; font-weight: 600; color: var(--wa-muted);
  }
  .bd-hcol {
    display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 5px; min-width: 0;
    padding: 8px 4px 8px; box-sizing: border-box; margin-bottom: -1px; text-align: center; color: var(--wa-ink);
    border-bottom: 3px solid color-mix(in srgb, var(--dc, var(--wa-muted)) 70%, transparent);
  }
  .bd-hcol.on { background: color-mix(in srgb, var(--dc, var(--wa-accent)) 14%, var(--wa-card)); border-bottom-color: var(--dc, var(--wa-muted)); }
  .bd-i { display: block; width: 13px; height: 13px; flex: none; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
  .bd-i .bd-i-dot { fill: currentColor; stroke: none; }
  /* One action on every column: bring this device to the front. */
  .bd-focus-pill {
    display: inline-flex; align-items: center; gap: 4px; height: 21px; padding: 0 8px 0 6px; box-sizing: border-box; flex: none;
    border-radius: 11px; border: 1px solid var(--wa-line-strong); background: none; font: inherit; font-size: 11.5px; font-weight: 600;
    color: var(--wa-ink); cursor: pointer; white-space: nowrap;
  }
  .bd-focus-pill .bd-i { width: 12px; height: 12px; }
  .bd-focus-pill:hover { background: var(--wa-hover); }
  .bd-focus-pill:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .bd-focus-pill.on { padding: 0 6px 0 9px; border-color: var(--dc, var(--wa-ink)); background: var(--dc, var(--wa-ink)); color: var(--wa-card); }
  .bd-focus-pill.on:hover { filter: brightness(1.08); }
  .bd-upd {
    display: inline-flex; align-items: center; gap: 4px; height: 18px; padding: 0 6px; box-sizing: border-box; flex: none;
    border-radius: 5px; font: inherit; font-size: 10.5px; font-weight: 600; white-space: nowrap; cursor: pointer;
    color: var(--wa-amber); background: color-mix(in srgb, var(--wa-amber) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--wa-amber) 40%, transparent);
  }
  .bd-upd svg { width: 11px; height: 11px; flex: none; }
  .bd-upd:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  /* A narrow board: what is cut off fades at the right, and a button says how
     many devices are past it and goes there. */
  .bd-more {
    position: absolute; right: 4px; bottom: 11px; z-index: 3; display: inline-flex; align-items: center; gap: 4px; height: 23px; padding: 0 8px;
    border-radius: 12px; border: 1px solid var(--wa-line-strong); background: var(--wa-panel, var(--wa-card)); color: var(--wa-ink);
    font: inherit; font-size: 11.5px; font-weight: 600; white-space: nowrap; cursor: pointer;
    box-shadow: -12px 0 12px var(--wa-card);
  }
  .bd-more[hidden] { display: none; }
  .bd-more:hover { background: var(--wa-hover); }
  .bd-more:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  wa-board-frame[fades] .bd-head-scroll, wa-board-frame[fades] .bd-scroll {
    -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 56px), transparent);
    mask-image: linear-gradient(to right, #000 calc(100% - 56px), transparent);
  }
  /* What a box, Focus and the eye do, once, under the heads. */
  .bd-legend {
    display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; min-height: 30px; padding: 4px 8px; box-sizing: border-box;
    border-bottom: 1px solid var(--wa-line); font-size: 12px; color: var(--wa-muted);
  }
  .bd-legend span { display: inline-flex; align-items: center; gap: 6px; }
  .bd-legend i { font-style: normal; color: var(--wa-muted); opacity: .6; }
  .bd-legend b { font-weight: 600; color: var(--wa-ink); }
  .bd-legend .bd-i { color: var(--wa-ink); }
  .bd-legend-box {
    display: inline-grid; place-items: center; width: 14px; height: 14px; box-sizing: border-box; flex: none; border-radius: 4px;
    background: var(--wa-muted); color: var(--wa-card);
  }
  .bd-legend-box.rd { border-radius: 50%; box-shadow: inset 0 0 0 3px var(--wa-card), 0 0 0 1.5px var(--wa-muted); }
  .bd-legend-box .lt-tick { display: block; width: 11px; height: 11px; fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }

  .bd-scroll { overflow-x: auto; overflow-y: hidden; max-width: 100%; -webkit-overflow-scrolling: touch; }
  table.bd {
    table-layout: fixed; border-collapse: separate; border-spacing: 0; width: 100%;
    min-width: var(--bd-width-min); max-width: var(--bd-width-max); font-size: 12.5px;
  }
  .bd th, .bd td { padding: 0; text-align: left; font-weight: inherit; }
  /* The column names stay in the table for a screen reader; the strip above
     it is what shows. They hold the columns' widths. */
  .bd-thead th { height: 0; overflow: hidden; border: 0; line-height: 0; }
  .bd-thead .bd-thing { width: var(--bd-first-w); }
  .bd-col { width: var(--bd-cell-w); }
  .bd-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  /* The rows stand on the page's own ground, the first column too, so the
     board reads as one surface under a raised head. */
  .bd .bd-thing { position: sticky; left: 0; z-index: 1; background: var(--bd-ground); }
  /* A long name takes two lines rather than widen its column. */
  .bd-col-top { display: inline-flex; align-items: flex-start; justify-content: center; gap: 4px; max-width: 100%; }
  .bd-col-glyph { display: inline-flex; flex: none; margin-top: 1px; color: var(--dc, var(--wa-muted)); }
  .bd-col-glyph svg { width: 14px; height: 14px; }
  .bd-col-name {
    min-width: 0; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
    overflow-wrap: anywhere; line-height: 1.25; font-weight: 600; font-size: 12.5px;
  }
  .bd-col-sub { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
  .bd-col-n { font-variant-numeric: tabular-nums; }

  .bd-sect th { padding: 14px 10px 6px; border-bottom: 1px solid var(--wa-line); background: var(--bd-ground); }
  .compact .bd-sect th { padding: 9px 8px 6px; }
  .bd-sect th > * { position: sticky; left: 10px; }
  .bd-sect-t { font-size: 12.5px; font-weight: 600; color: var(--wa-ink); }
  .bd-sect-t small { margin-left: 4px; font-size: 12px; font-weight: 500; color: var(--wa-muted); }
  .bd-sect-r { margin-left: 12px; font-size: 11.5px; color: var(--wa-muted); font-weight: 400; }
  /* What every row of a section shares, once, in place of a column of dashes. */
  .bd-sect-note { display: flex; align-items: center; gap: 6px; margin-top: 4px; width: fit-content; font-size: 11.5px; font-weight: 400; color: var(--wa-muted); }
  .bd-sect-note svg { width: 13px; height: 13px; flex: none; }
  .bd-sect-note b { font-weight: 600; color: var(--wa-ink); }
  .bd-none td { padding: 10px; font-size: 12.5px; color: var(--wa-muted); }
  /* A run of rows of one kind inside a section (a shape): a band in small
     capitals with room above it, so one kind ends before the next begins. */
  /* A phone shows a board only when it is focused on one device (else it
     shows Cards, \`phoneView\`): then only that device's column, so the board
     never scrolls sideways. */
  @media ${unsafeCSS(PHONE_LIST_QUERY)} {
    /* No width, not gone: a section's heading still spans every column, and a
       fixed table would hand a gone column's share of the room back to it. */
    table.bd.focused .bd-col:not(.on), table.bd.focused td.bd-cell:not(.on) { width: 0; padding: 0; overflow: hidden; visibility: hidden; border: 0; }
    wa-board-frame.bd-frame.focused {
      --bd-n: 1 !important; --bd-col-w: 112px; --bd-min-first: 150px;
      --bd-first-track: minmax(0, 1fr); --bd-col-track: var(--bd-col-w); --bd-first-w: auto; --bd-cell-w: var(--bd-col-w);
    }
    .bd-frame.focused .bd-hcol:not(.on) { display: none; }
    /* With every column in a narrow first column, a row keeps its room for
       its name. Delete is on the card, a phone's first view. */
    .bd-frame:not(.focused) .bd-row-acts { display: none; }
  }
  .bd-group th {
    padding: 9px 10px; background: color-mix(in srgb, var(--wa-ink) 5%, var(--bd-ground));
    border-top: 14px solid var(--bd-ground); border-bottom: 1px solid var(--wa-line-strong);
    box-shadow: inset 0 1px 0 var(--wa-line-strong);
  }
  .bd-group th > * { position: sticky; left: 10px; }
  .bd-group-t { font-size: 12px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--wa-ink); }
  .bd-group-t small { margin-left: 6px; font-size: 12px; font-weight: 500; letter-spacing: 0; color: var(--wa-muted); }
  .bd-sect + .bd-group th { border-top-width: 0; }

  .bd-row > * { border-bottom: 1px solid var(--wa-line); }
  .bd-row:hover > * { background: color-mix(in srgb, var(--wa-hover) 60%, var(--bd-ground)); }
  .bd-row:hover > .bd-cell.on, .bd-cell.on { background: color-mix(in srgb, var(--dc, var(--wa-accent)) 8%, var(--bd-ground)); }
  .bd-row.picked > .bd-thing { box-shadow: inset 3px 0 0 var(--wa-ink); }
  .bd-row.dragging { opacity: .5; }
  .bd-row.drag-over > * { box-shadow: inset 0 2px 0 var(--wa-accent); }
  .bd-row.drag-over.below > * { box-shadow: inset 0 -2px 0 var(--wa-accent); }
  .bd-thing-in { display: flex; align-items: center; gap: 6px; padding: 6px 10px; min-width: 0; }
  .bd-grip { display: inline-flex; flex: none; color: var(--wa-muted); cursor: grab; }
  .bd-grip.none { visibility: hidden; }
  .bd-grip svg { width: 14px; height: 14px; }
  /* Trash and "...": out only on the row under the pointer or the keyboard. */
  .bd-row-acts { display: inline-flex; flex: none; align-items: center; gap: 2px; margin-left: auto; opacity: 0; transition: opacity .12s ease-out; }
  .bd-row:hover .bd-row-acts, .bd-row:focus-within .bd-row-acts, .bd-row.pop-open .bd-row-acts { opacity: 1; }
  @media (hover: none) { .bd-row-acts { opacity: 1; } }
  .bd-pic { display: inline-flex; flex: none; }
  /* Compact: 46 px rows, 32 px pictures, a box beside each name. */
  .compact .bd-row { height: 46px; }
  .compact .bd-thing-in { padding: 0 4px 0 2px; gap: 8px; }
  .compact .bd-open { gap: 10px; }
  .compact .bd-pic { align-items: flex-start; justify-content: center; height: 32px; min-width: 32px; max-width: 76px; overflow: hidden; border-radius: 7px; }
  .compact .bd-pic .lr-ring { width: 32px !important; height: 32px !important; }
  .compact.bd .bd-cell { padding: 2px 4px; }
  .compact .bd-box { width: 24px; height: 24px; }
  .compact .bd-note { margin-top: 0; font-size: 10px; line-height: 1.1; }
  .bd-open {
    display: flex; align-items: center; gap: 10px; flex: 1 1 auto; min-width: 0; padding: 2px; margin: 0;
    border: 0; border-radius: 8px; background: none; font: inherit; color: var(--wa-ink); text-align: left; cursor: pointer;
  }
  .bd-open:hover .bd-n { text-decoration: underline; text-underline-offset: 2px; }
  .bd-open:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .bd-nm { display: flex; flex-direction: column; min-width: 0; }
  .bd-n { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .bd-m { font-size: 11.5px; color: var(--wa-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .bd .bd-cell { text-align: center; vertical-align: middle; padding: 6px 4px; }
  .bd-cell-in { display: inline-flex; align-items: center; gap: 4px; }
  .bd-cell-in.slots { display: inline-grid; grid-auto-flow: column; grid-template-columns: auto 16px; grid-auto-columns: 24px; }
  /* The focused column's order, beside each tick. */
  .bd-ord { font-size: 12.5px; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--dc, var(--wa-ink)); }
  .bd-box {
    display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; padding: 0;
    border: 0; border-radius: 7px; background: none; cursor: pointer;
  }
  .bd-box:hover:not(.stuck):not(.busy) { background: var(--wa-hover); }
  .bd-box:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .bd-mark {
    display: grid; place-items: center; width: 17px; height: 17px; box-sizing: border-box; border-radius: 4.5px;
    border: 1.6px solid color-mix(in srgb, var(--dc, var(--wa-muted)) 72%, transparent);
  }
  .bd-box.rd .bd-mark { border-radius: 50%; }
  .bd-box.ticked .bd-mark { background: var(--dc, var(--wa-accent)); border-color: var(--dc, var(--wa-accent)); }
  /* The tick in the card's color, so it reads on the device's fill in either
     skin, as a chip's does (\`.lt-tick\`). */
  .bd-mark .lt-tick { display: block; width: 13px; height: 13px; fill: none; stroke: var(--wa-card); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
  .bd-box.ticked.rd .bd-mark { box-shadow: inset 0 0 0 3px var(--wa-card); }
  .bd-box.ticked.rd { cursor: default; }
  .bd-box.dim .bd-mark { opacity: .5; }
  .bd-box.busy { opacity: .55; cursor: progress; }
  .bd-box.stuck { opacity: .4; cursor: not-allowed; }
  .bd-dash { display: inline-block; width: 12px; height: 2px; border-radius: 1px; background: var(--wa-line-strong); vertical-align: middle; }
  /* A kind of device this kind of thing never goes on: greyed, not 120 bare
     dashes. The section's note says why. */
  .bd .bd-cell.grey {
    padding: 0;
    background: repeating-linear-gradient(135deg, transparent 0 5px, color-mix(in srgb, var(--wa-ink) 6%, transparent) 5px 6px);
  }
  .bd-grey { display: block; width: 100%; height: 100%; min-height: 28px; }
  .bd-no-eye { display: block; width: 24px; }
  .bd-eye {
    display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; padding: 0;
    border: 0; border-radius: 6px; background: none; color: var(--wa-muted); cursor: pointer;
  }
  .bd-eye svg { width: 15px; height: 15px; }
  .bd-eye:hover:not(:disabled) { background: var(--wa-hover); color: var(--wa-ink); }
  .bd-eye.hid { color: var(--wa-ink); }
  .bd-eye:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .bd-eye:disabled { opacity: .45; cursor: progress; }
  .bd-note { display: block; margin-top: 1px; font-style: normal; font-size: 10.5px; line-height: 1.2; color: var(--wa-muted); white-space: nowrap; }
  .bd-note.warn { color: var(--wa-need); }

  /* Board | Cards, in the head: the panel's segmented switch. */
  .bd-view { display: inline-flex; flex: none; padding: 2px; gap: 2px; border-radius: 8px; background: var(--wa-seg, var(--wa-field)); border: 1px solid var(--wa-line); }
  .bd-view-opt {
    display: inline-flex; align-items: center; gap: 5px; height: 24px; padding: 0 9px; border: 0; border-radius: 6px;
    background: none; font: inherit; font-size: 12px; font-weight: 600; color: var(--wa-muted); cursor: pointer;
  }
  .bd-view-opt svg { width: 13px; height: 13px; }
  .bd-view-opt.on { background: var(--wa-seg-on, var(--wa-card)); color: var(--wa-ink); }
  .bd-view-opt:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  /* "Saved" for a moment after a box's write, apart from any Save button. */
  .bd-saved { display: inline-flex; align-items: center; gap: 4px; flex: none; font-size: 12px; color: var(--wa-ok, var(--wa-muted)); }
  .bd-saved svg { width: 13px; height: 13px; }
  /* A focused device's head, over the board, in the device's color. */
  .bd-focus {
    display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; margin: 0 0 10px; padding: 10px 12px;
    border-radius: 10px; border: 1px solid color-mix(in srgb, var(--dc, var(--wa-accent)) 45%, var(--wa-line));
    background: color-mix(in srgb, var(--dc, var(--wa-accent)) 8%, var(--wa-card));
  }
  .bd-focus-glyph { display: inline-flex; color: var(--dc, var(--wa-muted)); }
  .bd-focus-glyph svg { width: 16px; height: 16px; }
  .bd-focus-t { flex: 1 1 260px; min-width: 0; font-size: 13px; color: var(--wa-muted); }
  .bd-focus-t b { font-weight: 600; color: var(--wa-ink); }
  .bd-focus-sep { margin: 0 7px; opacity: .6; }
  .bd-focus-own { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; font-size: 12px; color: var(--wa-muted); }
  .bd-link {
    padding: 0; border: 0; background: none; font: inherit; font-size: 12px; font-weight: 600; color: var(--wa-ink); cursor: pointer;
    text-decoration: underline; text-decoration-color: var(--wa-line-strong); text-underline-offset: 2px;
  }
  .bd-link:hover { text-decoration-color: currentColor; }
  .bd-link:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 3px; }
  .bd-focus-all {
    display: inline-flex; align-items: center; gap: 5px; height: 28px; padding: 0 10px; border-radius: 7px;
    border: 1px solid var(--wa-line-strong); background: var(--wa-card); color: var(--wa-ink);
    font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer;
  }
  .bd-focus-all svg { width: 13px; height: 13px; }
  .bd-focus-all:hover { background: var(--wa-hover); }
  .bd-focus-all:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .bd-foot-line { margin-top: 8px; }

  .bd-under td { padding: 0 10px 8px; border-bottom: 1px solid var(--wa-line); }
  .bd-under td > * { position: sticky; left: 10px; max-width: min(560px, calc(100vw - 60px)); }
  .bd-under .lt-ask { margin-top: 2px; }
  /* A Compact row's big picture, and the small lists, over the page. Outside
     both scrollers, or they would cut these off. */
  .bd-peek {
    position: fixed; z-index: 40; width: 226px; padding: 12px; box-sizing: border-box; pointer-events: none;
    border-radius: 12px; border: 1px solid var(--wa-line-strong); background: var(--wa-card);
    box-shadow: var(--wa-shadow-pop, 0 18px 44px rgba(0, 0, 0, .5));
  }
  .bd-peek[hidden], .bd-pop[hidden] { display: none; }
  .bd-peek-h { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 9px; font-size: 13px; color: var(--wa-ink); }
  .bd-peek-h b { font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .bd-peek-h span { flex: none; font-size: 12px; color: var(--wa-muted); }
  .bd-peek-pic { display: grid; place-items: center; }
  .bd-peek-w { margin-top: 9px; font-size: 11.5px; line-height: 1.35; color: var(--wa-muted); }
  .bd-peek-k { margin-top: 3px; font-size: 11px; color: var(--wa-muted); opacity: .75; }
  .bd-pop {
    position: fixed; z-index: 40; min-width: 150px; max-width: 280px; padding: 4px; box-sizing: border-box;
    border-radius: 9px; border: 1px solid var(--wa-line-strong); background: var(--wa-card);
    box-shadow: var(--wa-shadow-pop, 0 8px 24px rgba(0, 0, 0, .35));
  }
  .bd-pop-item {
    display: block; width: 100%; padding: 6px 9px; border: 0; border-radius: 6px; background: none;
    font: inherit; font-size: 12.5px; color: var(--wa-ink); text-align: left; cursor: pointer;
  }
  .bd-pop-item:hover:not(:disabled), .bd-pop-item:focus-visible { outline: none; background: var(--wa-hover); }
  .bd-pop-item:disabled { opacity: .45; cursor: default; }
  .bd-pop-note { margin: 0; padding: 6px 8px; font-size: 12px; line-height: 1.4; color: var(--wa-ink); }
  .bd.wide { font-size: 13.5px; }
  .bd.wide .bd-thing-in { padding: 8px 14px; gap: 10px; }
  .bd.wide .bd-open { gap: 16px; }
  .bd.wide .bd-n { font-size: 15px; }
  .bd.wide .bd-m { font-size: 12.5px; }
  .bd.wide .bd-col-name { font-size: 13px; }
  /* A phone: the first column stays put and narrow while the device
     columns scroll sideways under it. */
  @media (max-width: 640px) {
    .bd-frame, .bd-frame.compact, .bd-frame.wide {
      --bd-col-w: 78px; --bd-min-first: 150px; --bd-first-track: 150px; --bd-col-track: minmax(var(--bd-col-w), 1fr);
      --bd-first-w: 150px; --bd-cell-w: auto;
    }
    .bd-hthing { padding: 8px 6px 10px; }
    .bd-thing-in, .bd.wide .bd-thing-in { padding: 6px; gap: 6px; }
    .bd-open, .bd.wide .bd-open { gap: 8px; }
    .bd-n, .bd.wide .bd-n { font-size: 13px; white-space: normal; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow-wrap: break-word; }
    .bd-col-name, .bd.wide .bd-col-name { font-size: 11.5px; }
    .bd-col-glyph { display: none; }
    .bd-col-sub { gap: 4px; font-size: 10.5px; }
    .bd-focus-pill { padding: 0 6px 0 4px; font-size: 10.5px; }
    .bd-focus-pill.on { padding: 0 4px 0 6px; }
  }
`;

/** Boards stacked into one table on Home's "All devices" (plan step 6):
 * each a fixed layout with one device column width, so their device columns
 * line up, in either density; the name column takes the rest, never less than
 * --bd-thing-min. An element drawn there carries `embedded`; the panel's own
 * board sits in a `.bd-fixed`. --bd-n is the table's number of device columns. */
export const boardStackStyles = css`
  :host([embedded]) { display: block; }
  :host([embedded]) .bd-frame, .bd-fixed .bd-frame.bd-frame {
    --bd-col-w: var(--bd-stack-col-w, 112px); --bd-min-first: var(--bd-thing-min, 300px);
    --bd-first-track: minmax(0, 1fr); --bd-col-track: var(--bd-col-w);
    --bd-first-w: auto; --bd-cell-w: var(--bd-col-w); --bd-width-max: none;
  }
  @media (max-width: 640px) {
    :host([embedded]) .bd-frame, .bd-fixed .bd-frame.bd-frame { --bd-col-w: 78px; --bd-min-first: 150px; --bd-first-track: 150px; --bd-col-track: minmax(78px, 1fr); --bd-first-w: 150px; --bd-cell-w: auto; }
  }
`;
