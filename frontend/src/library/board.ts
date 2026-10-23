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
// The name in a column head is a real button: it focuses that column. The
// host then lists that device's things first, in its order, and lights the
// column. The rows and their words are the host's; this file only draws
// them, so the table, its sticky first column and its focus look are the
// same on every tab.

import { css, html, nothing, unsafeCSS, type ReactiveController, type ReactiveControllerHost, type TemplateResult } from "lit";
import { uiIcon } from "../ui-icons.js";
import type { LinkDevice } from "../watch-pages/devices.js";
import { type TickAsk, type TickChip, type TickNoteKind, renderTickAsk } from "./ticks.js";

/** How a list tab shows its things: the board, or one card each. */
export type ListView = "board" | "cards";

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

/** One device across the top. */
export interface BoardColumn {
  device: LinkDevice;
  /** The device's color var (`device-colors.ts`). */
  color: string | undefined;
  /** How many things of the board's kind the device has. */
  count: number;
}

/** One box: the device's chip for the row's thing, or a dash. */
export interface BoardCell {
  /** The chip's state and what a click asks for. Undefined draws a dash:
   * the thing does not fit this device. */
  chip?: TickChip;
  /** Why the dash, as its tooltip. */
  dashTitle?: string;
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
  /** Small buttons after the name (a menu no device uses: Delete). */
  actions?: TemplateResult;
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
  rows: BoardRow[];
  /** What the section says with no rows. */
  empty?: string;
}

export interface BoardInput {
  /** The table's name for a screen reader: "Pages on each device". */
  label: string;
  /** The first column's head: "Page", "Status page", "Menu". */
  thing: string;
  columns: readonly BoardColumn[];
  /** The focused device, by owner id. */
  focus?: string;
  /** A click on a column head: focus that device, or undefined for all. */
  onFocus: (ownerId: string | undefined) => void;
  /** The word beside a head's chevron ("Order"), and the head's tooltip
   * for a device not focused. */
  focusWord: string;
  focusTitle: (device: LinkDevice) => string;
  sections: readonly BoardSection[];
  /** A big screen (`WideWatch`): bigger type and a roomier first column. */
  wide?: boolean;
}

/** Whether two owner ids name one device. */
const same = (a: string | undefined, b: string | undefined): boolean => a !== undefined && b !== undefined && a.toUpperCase() === b.toUpperCase();

export function renderBoard(input: BoardInput): TemplateResult {
  const span = input.columns.length + 1;
  const focusAt = input.columns.findIndex((c) => same(c.device.ownerId, input.focus));
  return html`<div class="bd-scroll">
    <table class="bd ${focusAt >= 0 ? "focused" : ""} ${input.wide === true ? "wide" : ""}" aria-label=${input.label} style=${`--bd-n:${input.columns.length}`}>
      <thead><tr>
        <th scope="col" class="bd-thing">${input.thing}</th>
        ${input.columns.map((col) => renderHead(col, same(col.device.ownerId, input.focus), input))}
      </tr></thead>
      ${input.sections.map((section) => html`<tbody class="bd-sect-body" data-section=${section.key}>
        ${section.title === undefined ? nothing : html`<tr class="bd-sect"><th colspan=${span} scope="colgroup">
          <span class="bd-sect-t">${section.title}${section.count === undefined ? nothing : html` <small>${section.count}</small>`}</span>
          ${section.hint === undefined ? nothing : html`<span class="bd-sect-r">${section.hint}</span>`}
        </th></tr>`}
        ${section.rows.length === 0 && section.empty !== undefined
          ? html`<tr class="bd-none"><td colspan=${span}>${section.empty}</td></tr>`
          : section.rows.map((row, i) => html`${row.group !== undefined && row.group !== section.rows[i - 1]?.group
            ? renderGroup(row.group, section.rows.slice(i).findIndex((r) => r.group !== row.group), section.rows.length - i, span)
            : nothing}${renderRow(row, input.columns, focusAt, span)}`)}
      </tbody>`)}
    </table>
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

function renderHead(col: BoardColumn, focused: boolean, input: BoardInput): TemplateResult {
  const d = col.device;
  return html`<th scope="col" class="bd-col ${focused ? "on" : ""}" style=${col.color === undefined ? nothing : `--dc:${col.color}`}>
    <button type="button" class="bd-col-btn" aria-pressed=${focused ? "true" : "false"}
      title=${focused ? "Back to every device" : input.focusTitle(d)}
      @click=${() => input.onFocus(focused ? undefined : d.ownerId)}>
      <span class="bd-col-top">
        <span class="bd-col-glyph" aria-hidden="true">${uiIcon(d.kind === "iphone" ? "phone" : "watch")}</span>
        <span class="bd-col-name">${d.name}</span>
      </span>
      <span class="bd-col-sub"><span class="bd-col-n">${col.count}</span>
        <span class="bd-col-go">${focused ? "All" : input.focusWord}<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 4l2.5 2.5L7.5 4"/></svg></span></span>
    </button>
  </th>`;
}

function renderRow(row: BoardRow, columns: readonly BoardColumn[], focusAt: number, span: number): TemplateResult {
  const drag = row.drag;
  const cls = `bd-row ${row.dim ? "dim" : ""} ${row.select?.picked ? "picked" : ""} ${drag?.dragging ? "dragging" : ""} ${drag?.over ? "drag-over" : ""} ${drag?.below ? "below" : ""}`;
  const main = html`<tr class=${cls} data-row=${row.key} draggable=${drag?.on ? "true" : "false"}
    @dragstart=${(e: DragEvent) => drag?.onStart(e)}
    @dragover=${(e: DragEvent) => drag?.onOver(e)}
    @drop=${(e: DragEvent) => drag?.onDrop(e)}
    @dragend=${() => drag?.onEnd()}
    @keydown=${(e: KeyboardEvent) => drag?.onKey(e)}>
    <th scope="row" class="bd-thing">
      <span class="bd-thing-in">
        ${drag === undefined ? nothing : html`<span class="bd-grip" aria-hidden="true" title=${drag.on ? "Drag to order" : ""}>${uiIcon("grip")}</span>`}
        ${row.select === undefined ? nothing : html`<input type="checkbox" class="pk-card-pick" .checked=${row.select.picked}
          ?disabled=${row.select.disabled} aria-label=${row.select.label}
          @click=${(e: MouseEvent) => { e.stopPropagation(); row.select!.onPick(e); }} />`}
        <button type="button" class="bd-open" title=${row.openTitle} @click=${(e: MouseEvent) => row.onOpen(e)}>
          ${row.picture ?? nothing}
          <span class="bd-nm"><span class="bd-n">${row.name}</span><span class="bd-m">${row.detail}</span></span>
        </button>
        ${row.actions ?? nothing}
      </span>
    </th>
    ${columns.map((col, i) => renderCell(row.cells[i], col, i === focusAt))}
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

function renderCell(cell: BoardCell | undefined, col: BoardColumn, focused: boolean): TemplateResult {
  const style = col.color === undefined ? nothing : `--dc:${col.color}`;
  const chip = cell?.chip;
  if (chip === undefined) {
    return html`<td class="bd-cell ${focused ? "on" : ""}" style=${style}>
      <span class="bd-dash" role="img" aria-label=${cell?.dashTitle ?? `Does not fit ${col.device.name}`} title=${cell?.dashTitle ?? `Does not fit ${col.device.name}`}></span>
    </td>`;
  }
  const round = chip.shape === "round";
  return html`<td class="bd-cell ${focused ? "on" : ""}" style=${style}>
    <span class="bd-cell-in">
      <button type="button" class="bd-box ${chip.on ? "ticked" : ""} ${round ? "rd" : ""} ${chip.busy ? "busy" : ""} ${chip.stuck === undefined ? "" : "stuck"} ${chip.hidden ? "dim" : ""}"
        title=${chip.title} aria-label=${`${chip.name}: ${chip.title}`}
        aria-pressed=${chip.on ? "true" : "false"} aria-disabled=${chip.next === undefined ? "true" : "false"}
        @click=${(e: Event) => {
          e.stopPropagation();
          // A box asks for nothing while busy, locked, or a used menu's dot.
          if (chip.next !== undefined) cell?.onPick?.(chip.next);
        }}><span class="bd-mark" aria-hidden="true"></span></button>
      ${cell?.eye === undefined ? nothing : html`<button type="button" class="bd-eye ${cell.eye.hidden ? "hid" : ""}" ?disabled=${cell.eye.busy}
        title=${cell.eye.title} aria-label=${cell.eye.title} aria-pressed=${cell.eye.hidden ? "true" : "false"}
        @click=${(e: Event) => { e.stopPropagation(); cell.eye!.onToggle(); }}>${uiIcon(cell.eye.hidden ? "hide" : "show")}</button>`}
    </span>
    ${chip.hidden && cell?.note === undefined ? html`<em class="bd-note">hidden</em>` : nothing}
    ${cell?.note === undefined ? nothing : html`<em class="bd-note ${cell.noteWarn ? "warn" : ""}" title=${cell.noteTitle ?? nothing}>${cell.note}</em>`}
  </td>`;
}

/** The board's look, in the panel's tokens. The first column stays put
 * while a wide home scrolls sideways inside the board; the page itself
 * never scrolls sideways. */
export const boardStyles = css`
  .bd-scroll { overflow-x: auto; max-width: 100%; -webkit-overflow-scrolling: touch; }
  /* The device columns keep one narrow width (--bd-col-w) and the first
     column takes the rest, so a wide screen gives its room to the things'
     pictures, not to gaps between ticks (Jesse, 2026-10-23). */
  table.bd { --bd-col-w: 104px; --bd-ground: var(--wa-bg); border-collapse: separate; border-spacing: 0; width: 100%; min-width: max-content; font-size: 12.5px; }
  .bd th, .bd td { padding: 0; text-align: left; font-weight: inherit; }
  .bd thead th { position: sticky; top: 0; z-index: 2; background: var(--wa-card); border-bottom: 1px solid var(--wa-line); vertical-align: bottom; }
  /* The rows stand on the page's own ground, the first column too, so the
     board reads as one surface under a raised head. */
  .bd .bd-thing { position: sticky; left: 0; z-index: 1; background: var(--bd-ground); min-width: 220px; }
  .bd thead .bd-thing { z-index: 3; padding: 8px 10px; font-size: 11.5px; color: var(--wa-muted); font-weight: 600; }
  .bd-col { width: var(--bd-col-w); min-width: var(--bd-col-w); max-width: var(--bd-col-w); text-align: center; }
  .bd td.bd-cell { width: var(--bd-col-w); }
  .bd-col.on { background: color-mix(in srgb, var(--dc, var(--wa-accent)) 14%, var(--wa-card)); }
  .bd-col-btn {
    display: flex; flex-direction: column; align-items: center; gap: 3px; width: 100%; padding: 8px 4px 7px; box-sizing: border-box;
    border: 0; background: none; font: inherit; color: var(--wa-ink); cursor: pointer; border-radius: 8px 8px 0 0;
    border-bottom: 3px solid color-mix(in srgb, var(--dc, var(--wa-muted)) 70%, transparent);
  }
  .bd-col-btn:hover { background: var(--wa-hover); }
  .bd-col-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  /* A long name takes two lines rather than widen its column. */
  .bd-col-top { display: inline-flex; align-items: flex-start; justify-content: center; gap: 4px; max-width: 100%; }
  .bd-col-glyph { display: inline-flex; flex: none; margin-top: 1px; color: var(--dc, var(--wa-muted)); }
  .bd-col-glyph svg { width: 14px; height: 14px; }
  .bd-col-name {
    min-width: 0; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
    overflow-wrap: anywhere; line-height: 1.25; font-weight: 600; font-size: 12.5px;
  }
  .bd-col-sub { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: var(--wa-muted); white-space: nowrap; }
  .bd-col-n { font-variant-numeric: tabular-nums; }
  .bd-col-go { display: inline-flex; align-items: center; gap: 2px; padding: 1px 6px; border-radius: 999px; border: 1px solid var(--wa-line); }
  .bd-col-btn:hover .bd-col-go, .bd-col.on .bd-col-go { color: var(--wa-ink); border-color: var(--wa-line-strong); }
  .bd-col-go svg { width: 9px; height: 9px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }

  .bd-sect th { padding: 14px 10px 6px; border-bottom: 1px solid var(--wa-line); background: var(--bd-ground); }
  .bd-sect th > * { position: sticky; left: 10px; }
  .bd-sect-t { font-size: 12.5px; font-weight: 600; color: var(--wa-ink); }
  .bd-sect-t small { margin-left: 4px; font-size: 12px; font-weight: 500; color: var(--wa-muted); }
  .bd-sect-r { margin-left: 12px; font-size: 11.5px; color: var(--wa-muted); font-weight: 400; }
  .bd-none td { padding: 10px; font-size: 12.5px; color: var(--wa-muted); }
  /* A run of rows of one kind inside a section (a shape): a band in small
     capitals with room above it, so one kind ends before the next begins. */
  /* A phone shows a board only when it is focused on one device (else it
     shows Cards, \`phoneView\`): then only that device's column, so the board
     never scrolls sideways. */
  @media ${unsafeCSS(PHONE_LIST_QUERY)} {
    table.bd.focused .bd-col:not(.on), table.bd.focused td.bd-cell:not(.on) { display: none; }
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
  .bd-row.dim .bd-open { opacity: .6; }
  .bd-row.picked > .bd-thing { box-shadow: inset 3px 0 0 var(--wa-ink); }
  .bd-row.dragging { opacity: .5; }
  .bd-row.drag-over > * { box-shadow: inset 0 2px 0 var(--wa-accent); }
  .bd-row.drag-over.below > * { box-shadow: inset 0 -2px 0 var(--wa-accent); }
  .bd-thing-in { display: flex; align-items: center; gap: 6px; padding: 6px 10px; min-width: 0; }
  .bd-grip { display: inline-flex; flex: none; color: var(--wa-muted); cursor: grab; }
  .bd-grip svg { width: 14px; height: 14px; }
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
  .bd-box {
    display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; padding: 0;
    border: 0; border-radius: 7px; background: none; cursor: pointer;
  }
  .bd-box:hover:not(.stuck):not(.busy) { background: var(--wa-hover); }
  .bd-box:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .bd-mark {
    display: block; width: 16px; height: 16px; box-sizing: border-box; border-radius: 4px;
    border: 1.5px solid color-mix(in srgb, var(--dc, var(--wa-muted)) 70%, var(--wa-line-strong));
  }
  .bd-box.rd .bd-mark { border-radius: 50%; }
  .bd-box.ticked .bd-mark { background: var(--dc, var(--wa-accent)); border-color: var(--dc, var(--wa-accent)); position: relative; }
  .bd-box.ticked:not(.rd) .bd-mark::after {
    content: ""; position: absolute; top: 1px; left: 4.5px; width: 4px; height: 8px;
    border: solid var(--wa-card); border-width: 0 2px 2px 0; transform: rotate(45deg);
  }
  .bd-box.ticked.rd .bd-mark { box-shadow: inset 0 0 0 3px var(--wa-card); }
  .bd-box.ticked.rd { cursor: default; }
  .bd-box.dim .bd-mark { opacity: .5; }
  .bd-box.busy { opacity: .55; cursor: progress; }
  .bd-box.stuck { opacity: .4; cursor: not-allowed; }
  .bd-dash { display: inline-block; width: 12px; height: 2px; border-radius: 1px; background: var(--wa-line-strong); vertical-align: middle; }
  .bd-eye {
    display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; padding: 0;
    border: 0; border-radius: 6px; background: none; color: var(--wa-muted); cursor: pointer;
  }
  .bd-eye svg { width: 15px; height: 15px; }
  .bd-eye:hover:not(:disabled) { background: var(--wa-hover); color: var(--wa-ink); }
  .bd-eye.hid { color: var(--wa-need); }
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
  .bd-focus-t b { font-weight: 600; color: var(--wa-ink); margin-right: 4px; }
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
  .bd.wide { --bd-col-w: 124px; font-size: 13.5px; }
  .bd.wide .bd-thing { min-width: 320px; }
  .bd.wide .bd-thing-in { padding: 8px 14px; gap: 10px; }
  .bd.wide .bd-open { gap: 16px; }
  .bd.wide .bd-n { font-size: 15px; }
  .bd.wide .bd-m { font-size: 12.5px; }
  .bd.wide .bd-col-name { font-size: 13px; }
  /* A phone: the first column stays put and narrow while the device
     columns scroll sideways under it. */
  @media (max-width: 640px) {
    table.bd { --bd-col-w: 78px; }
    .bd .bd-thing, .bd.wide .bd-thing { min-width: 0; width: 150px; max-width: 150px; }
    .bd-thing-in, .bd.wide .bd-thing-in { padding: 6px; gap: 6px; }
    .bd-open, .bd.wide .bd-open { gap: 8px; }
    .bd-n, .bd.wide .bd-n { font-size: 13px; white-space: normal; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow-wrap: break-word; }
    .bd-col-name, .bd.wide .bd-col-name { font-size: 11.5px; }
    .bd-col-glyph { display: none; }
    .bd-col-sub { gap: 4px; font-size: 10.5px; }
    .bd-col-go { padding: 1px 4px; }
  }
`;

/** Boards stacked into one table on Home's "All devices" (plan step 6):
 * each a fixed layout with one device column width, so their device columns
 * line up; the name column takes the rest, never less than --bd-thing-min.
 * An element drawn there carries `embedded`; the panel's own board sits in
 * a `.bd-fixed`. --bd-n is the table's number of device columns. */
export const boardStackStyles = css`
  :host([embedded]) { display: block; }
  :host([embedded]) table.bd, .bd-fixed table.bd {
    --bd-col-w: var(--bd-stack-col-w, 112px);
    table-layout: fixed; min-width: calc(var(--bd-thing-min, 300px) + var(--bd-n, 0) * var(--bd-col-w));
  }
  @media (max-width: 640px) {
    :host([embedded]) table.bd, .bd-fixed table.bd { --bd-col-w: 78px; --bd-thing-min: 150px; }
  }
`;
