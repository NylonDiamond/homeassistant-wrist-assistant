// The row of device ticks on a library card: one chip per device, ticked
// when the device has the item. Square for pages and status pages (tick to
// put it on that device, untick to take it off), round for menus (a device
// uses one menu of each kind, so ticking one moves the device to it, and
// the ticked one cannot be unticked). Mock frames 1a and 1c.
//
// On a device tab's "Not on this device" cards the row is the item's own
// devices, then a dashed "Add to this watch" chip for that device (frame
// 2a). A tick shows the state asked for while its write is out, and the
// item's last refusal shows under the row in the tabs' warning ink. An
// untick that would clear menu slots or taps asks under the row first
// (`TickAsk`), and a note that is not a refusal reads in the quiet ink.
//
// A page holding tiles only the iPhone draws (a map, a web card) gives each
// ticked watch's chip a small count, "skips 2", whose tooltip names the
// tiles: a watch packs the page without them.
//
// `tickChips` is the pure part (testable without a browser);
// `renderTicks` draws it through `renderTickChips`, whose row folds the
// unticked chips into one "+ Add to a device" chip when they do not fit the
// device strip (`chip-row.ts`). The writes are the caller's: usually the
// shared store's `pick` and `pickMenu` (`store.ts`).

import { css, html, nothing, type TemplateResult } from "lit";
import "./chip-row.js";
import { type LinkDevice, deviceWord, joinWords } from "../watch-pages/devices.js";
import type { LibraryKind } from "./client.js";
import { type Library, libraryItem, libraryMenu, sameId } from "./model.js";
import { type PendingPick, pendingKey } from "./store.js";

/** What a tick row is drawn from. */
export interface TicksInput {
  library: Library;
  kind: LibraryKind;
  itemId: string;
  /** Every device that can have it, in device order (`linkDevicesOf`). */
  devices: readonly LinkDevice[];
  /** A device's color var (`device-colors.ts`). */
  colorOf: (ownerId: string) => string | undefined;
  /** The store's pending ticks (`LibraryStore.pending`). */
  pending?: ReadonlyMap<string, PendingPick>;
  /** The item's last refusal (`LibraryStore.noteFor`), or what its last
   * tick did. */
  note?: string;
  /** How `note` reads: "warn" (a refusal, the default) in the tabs' warning
   * ink, "ok" in the quiet ink. */
  noteKind?: TickNoteKind;
  /** An untick asking first, under the row (`TickAsk`). */
  ask?: TickAsk;
  /** The signed in user is an administrator: only one can put on a device
   * an item no device has. */
  admin?: boolean;
  /** Why a device's tick cannot be clicked now (a watch waiting for its
   * iPhone's move, an editor there holding unsaved edits), or undefined. */
  locked?: (ownerId: string) => string | undefined;
  /** A device tab's "Not on this device" card: only the item's devices,
   * then "Add to this watch" for this one. */
  addFor?: string;
  /** The words over a menu's row; "Used by" unless given, none with
   * false. Never drawn for pages or status pages. */
  hint?: string | false;
  /** The tiles a watch skips on this page, by name (`watchSkippedTileNames`):
   * each ticked watch's chip then says how many ("skips 2") and lists them
   * in its tooltip. Pages only; empty or absent adds nothing. */
  skips?: readonly string[];
}

/** How a row's note reads. */
export type TickNoteKind = "ok" | "warn" | "err";

/** An untick that asks first: the question under the row, then Remove and
 * Cancel. The editors ask when taking an item off a device would clear its
 * menu slots or complication taps there (`askUntick`). */
export interface TickAsk {
  /** The device the untick is for. */
  ownerId: string;
  text: string;
  onRemove: () => void;
  onCancel: () => void;
}

/** One chip of the row. */
export interface TickChip {
  ownerId: string;
  name: string;
  device: LinkDevice["kind"];
  color: string | undefined;
  shape: "square" | "round";
  /** Drawn ticked: the device has it, or a write asking for that is out. */
  on: boolean;
  /** On, and hidden on that device (Hide here). */
  hidden: boolean;
  /** Its write is out. */
  busy: boolean;
  /** The dashed "Add to this watch" chip. */
  add: boolean;
  /** What the chip says. */
  label: string;
  /** Its tooltip. */
  title: string;
  /** What a click asks for (on true, off false), or undefined when a click
   * does nothing: busy, locked, or a menu's ticked chip. */
  next: boolean | undefined;
  /** Why a click does nothing, when it is not plain. */
  stuck?: string;
  /** A short word after the name, in the chip's `<em>`: the complication
   * editor's "not this shape", "full" or "sure?", said on the chip because a
   * touch screen never shows the tooltip. */
  tag?: string;
  /** A watch's count of the page's tiles only the iPhone draws, in its own
   * `<em>` after the name ("skips 2"), and the tooltip that lists them. In
   * the chip, so the strip's fold measures the wider chip. */
  skips?: { text: string; title: string };
}

/** Why a device cannot take an item no device has. */
export const TICK_ADMIN_TEXT = "Only an administrator can put this on a device.";

/** The tooltip of a menu's ticked chip. */
export function menuOnTitle(name: string, unitTitle: string): string {
  return `${name} uses this menu. To change that, pick another ${unitTitle} for it.`;
}

/** A watch chip's count of the tiles it skips on the page: "skips 2". */
export function tickSkipsText(count: number): string {
  return `skips ${count}`;
}

/** That count's tooltip, naming the watch and the tiles: four names at
 * most, then how many more. */
export function tickSkipsTitle(name: string, tiles: readonly string[]): string {
  const shown = tiles.length <= 4 ? joinWords(tiles) : `${tiles.slice(0, 3).join(", ")} and ${tiles.length - 3} more`;
  return `${name} skips ${shown}: only an iPhone shows ${tiles.length === 1 ? "it" : "them"}.`;
}

/** The chips of one item's row, each ticked watch's with the tiles it skips
 * (`TicksInput.skips`). A watch that does not hold the page skips nothing,
 * so its chip says nothing about them. */
export function tickChips(input: TicksInput): TickChip[] {
  const chips = plainTickChips(input);
  const skipped = input.kind === "pages" ? (input.skips ?? []) : [];
  if (skipped.length === 0) return chips;
  return chips.map((chip) => {
    if (chip.device !== "watch" || !chip.on) return chip;
    const title = tickSkipsTitle(chip.name, skipped);
    return { ...chip, title: `${chip.title} ${title}`, skips: { text: tickSkipsText(skipped.length), title } };
  });
}

function plainTickChips(input: TicksInput): TickChip[] {
  const { library, kind, itemId, devices } = input;
  const round = kind === "menus";
  const menu = round ? libraryMenu(library, itemId) : undefined;
  const entry = round ? undefined : libraryItem(library, kind, itemId);
  const owners = (round ? menu?.owners : entry?.owners) ?? [];
  const unitTitle = menu?.unit === "entity" ? "Entity quick menu" : "Anywhere menu";
  const has = (ownerId: string) => owners.some((o) => sameId(o, ownerId));
  const hiddenOn = (ownerId: string) => {
    if (round) return false;
    const list = library.picks.get(ownerId.toUpperCase())?.[kind as "pages" | "status_pages"];
    return Array.isArray(list) && list.some((p) => typeof p?.id === "string" && sameId(p.id, itemId) && p.isHidden === true);
  };
  const shown = input.addFor === undefined ? devices : [
    ...devices.filter((d) => !sameId(d.ownerId, input.addFor) && has(d.ownerId)),
    ...devices.filter((d) => sameId(d.ownerId, input.addFor)),
  ];
  return shown.map((device): TickChip => {
    const ownerId = device.ownerId;
    const asked = input.pending?.get(pendingKey(kind, ownerId, round ? (menu?.unit ?? "") : itemId));
    const busy = asked !== undefined && (!round || ("menuId" in asked && (sameId(asked.menuId, itemId) || has(ownerId))));
    let on = has(ownerId);
    if (asked !== undefined) on = "on" in asked ? asked.on : sameId(asked.menuId, itemId);
    const add = input.addFor !== undefined && sameId(ownerId, input.addFor) && !on;
    const hidden = on && !busy && hiddenOn(ownerId);
    const color = input.colorOf(ownerId);
    const label = add ? `Add to this ${deviceWord(device.kind)}` : device.name;
    const base = { ownerId, name: device.name, device: device.kind, color, shape: round ? "round" as const : "square" as const, on, hidden, busy, add, label };
    if (busy) return { ...base, title: "Saving…", next: undefined };
    const locked = input.locked?.(ownerId);
    if (locked !== undefined) return { ...base, title: locked, next: undefined, stuck: locked };
    if (!on && owners.length === 0 && input.admin === false) return { ...base, title: TICK_ADMIN_TEXT, next: undefined, stuck: TICK_ADMIN_TEXT };
    if (round) {
      if (on) return { ...base, title: menuOnTitle(device.name, unitTitle), next: undefined };
      return { ...base, title: `Use this menu on ${device.name}.`, next: true };
    }
    const noun = kind === "status_pages" ? "status page" : "page";
    if (on) return { ...base, title: hidden ? `On ${device.name}, hidden there. Untick to take the ${noun} off it.` : `On ${device.name}. Untick to take the ${noun} off it.`, next: false };
    return { ...base, title: `Not on ${device.name}. Tick to put the ${noun} there.`, next: true };
  });
}

/**
 * The row: the chips, and the item's last refusal under them. A click asks
 * `onPick(ownerId, on)`; for a menu `on` is always true (use this menu
 * there). Clicks stop at the row, so a card that opens on click does not.
 */
export function renderTicks(input: TicksInput, onPick: (ownerId: string, on: boolean) => void): TemplateResult {
  const chips = tickChips(input);
  const hint = input.kind === "menus" && input.hint !== false ? (input.hint ?? "Used by") : undefined;
  return renderTickChips(chips, {
    foldLabel: input.kind === "menus" ? "Use on a device" : "Add to a device",
    ...(hint === undefined ? {} : { hint }),
    ...(input.note === undefined ? {} : { note: input.note }),
    ...(input.noteKind === undefined ? {} : { noteKind: input.noteKind }),
    ...(input.ask === undefined ? {} : { ask: input.ask }),
  }, onPick);
}

/** How a row of chips is drawn (`renderTickChips`). */
export interface TickChipsOptions {
  /** The fold chip's words, after the "+". */
  foldLabel: string;
  /** The words over the row (a menu's "Used by"). */
  hint?: string;
  /** The item's last refusal, or what its last tick did, under the row. */
  note?: string;
  /** How `note` reads; "warn" unless given. */
  noteKind?: TickNoteKind;
  /** An untick asking first, under the row. */
  ask?: TickAsk;
}

/**
 * Draws a row of chips: every chip inline, then, when one is off, a fold
 * chip that opens the whole list (on and off) in a small popover. The line
 * is a `<wa-chip-row>` (`chip-row.ts`), which marks itself `folded` only in
 * the device strip and only when every chip cannot fit one line of it; CSS
 * then shows the fold and steps the inline off chips aside, so the ticked
 * ones always stay in the line (Jesse, 2026-10-17: every device's chip
 * whenever they fit, folded only when they really do not). Pages, status
 * pages and menus come here through
 * `renderTicks`; the complication editor builds its own chips from its
 * device places and calls this directly.
 *
 * The popover is a `<details>`, so it needs no open state of its own; it
 * closes on a click outside it or Escape.
 */
export function renderTickChips(chips: readonly TickChip[], opts: TickChipsOptions, onPick: (ownerId: string, on: boolean) => void): TemplateResult {
  const chip = (c: TickChip) => html`<button type="button"
      class="lt-chip ${c.on ? "on" : "off"} ${c.shape === "round" ? "rd" : ""} ${c.add ? "add" : ""} ${c.busy ? "busy" : ""} ${c.stuck === undefined ? "" : "stuck"} ${c.hidden ? "dim" : ""}"
      style=${c.color === undefined ? nothing : `--dc:${c.color}`} title=${c.title}
      aria-pressed=${c.on ? "true" : "false"} aria-disabled=${c.next === undefined ? "true" : "false"}
      @click=${(e: Event) => {
        e.stopPropagation();
        if (c.next !== undefined) onPick(c.ownerId, c.next);
      }}><span class="lt-box" aria-hidden="true"></span><span class="lt-name">${c.label}</span>${c.hidden
        ? html`<em>hidden</em>`
        : c.tag === undefined ? nothing : html`<em>${c.tag}</em>`}${c.skips === undefined
        ? nothing
        : html`<em class="lt-skips" title=${c.skips.title}>${c.skips.text}</em>`}</button>`;
  // The dashed "Add to this watch" chip is already the way in, so it never
  // folds and never asks for a fold of its own.
  const folds = chips.some((c) => !c.on && !c.add);
  return html`<div class="lt-ticks" @click=${(e: Event) => e.stopPropagation()}>
    ${opts.hint === undefined ? nothing : html`<span class="lt-hint">${opts.hint}</span>`}
    <wa-chip-row class="lt-chips" role="group" aria-label=${opts.hint ?? "Devices"}>${chips.map(chip)}${folds
      // Inside the chips' line, so the fold sits right after the ticked
      // chips both in the strip's row and on a library card's column.
      ? html`<details class="lt-fold" @toggle=${foldToggled}>
      <summary class="lt-chip add lt-fold-sum"><span class="lt-name">+ ${opts.foldLabel}</span><svg class="lt-chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 4l2.5 2.5L7.5 4"/></svg></summary>
      <div class="lt-fold-pop" role="group" aria-label=${opts.foldLabel}>${chips.map(chip)}</div>
    </details>`
      : nothing}</wa-chip-row>
    ${opts.ask === undefined ? nothing : renderTickAsk(opts.ask)}
    ${opts.note === undefined ? nothing : opts.noteKind === "ok"
      ? html`<p class="lt-note ok" role="status">${opts.note}</p>`
      : html`<p class="lt-note" role="alert">${opts.note}</p>`}
  </div>`;
}

/** The untick's question in the row, the way the panel asks in place
 * elsewhere: the words, then Remove in the destructive style and a plain
 * Cancel. */
export function renderTickAsk(ask: TickAsk): TemplateResult {
  return html`<div class="lt-ask" role="alertdialog" aria-label=${ask.text}>
    <span class="lt-ask-q">${ask.text}</span>
    <span class="lt-ask-acts">
      <button type="button" class="lt-ask-btn danger" @click=${() => ask.onRemove()}>Remove</button>
      <button type="button" class="lt-ask-btn" @click=${() => ask.onCancel()}>Cancel</button>
    </span>
  </div>`;
}

/** While a fold's popover is open, a click outside it or Escape shuts it.
 * The listeners go when it shuts, however it shut. */
function foldToggled(e: Event): void {
  const details = e.currentTarget as HTMLDetailsElement;
  if (!details.open) return;
  const doc = details.ownerDocument;
  const outside = (ev: Event) => {
    if (!ev.composedPath().includes(details)) details.open = false;
  };
  const key = (ev: KeyboardEvent) => {
    if (ev.key === "Escape") details.open = false;
  };
  const stop = () => {
    if (details.open) return;
    doc.removeEventListener("pointerdown", outside, true);
    doc.removeEventListener("keydown", key, true);
    details.removeEventListener("toggle", stop);
  };
  doc.addEventListener("pointerdown", outside, true);
  doc.addEventListener("keydown", key, true);
  details.addEventListener("toggle", stop);
}

/** The row's look, in the panel's tokens: the mock's chip, 22px tall. */
export const libraryTicksStyles = css`
  .lt-ticks { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
  .lt-hint { font-size: 11.5px; line-height: 1.4; color: var(--wa-muted); }
  wa-chip-row { position: relative; display: flex; flex-wrap: wrap; align-items: center; gap: 4px; min-width: 0; }
  .lt-chip {
    display: inline-flex; align-items: center; gap: 5px; max-width: 100%; height: 22px; padding: 0 8px 0 6px;
    border-radius: 999px; border: 1px solid var(--wa-line-strong); background: var(--wa-input, var(--wa-hover));
    font: inherit; font-size: 11px; color: var(--wa-ink); cursor: pointer;
    transition: border-color .12s ease-out, background-color .12s ease-out;
  }
  .lt-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lt-box {
    flex: none; width: 11px; height: 11px; border-radius: 3px; box-sizing: border-box;
    border: 1.5px solid var(--dc, var(--wa-muted));
  }
  .lt-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .lt-chip.on {
    border-color: color-mix(in srgb, var(--dc, var(--wa-muted)) 60%, transparent);
    background: color-mix(in srgb, var(--dc, var(--wa-muted)) 18%, var(--wa-card));
  }
  .lt-chip.on .lt-box { background: var(--dc, var(--wa-muted)); border-color: var(--dc, var(--wa-muted)); }
  .lt-chip.off { color: var(--wa-muted); }
  .lt-chip.off:hover:not(.stuck):not(.busy) { color: var(--wa-ink); border-color: color-mix(in srgb, var(--dc, var(--wa-ink)) 60%, transparent); }
  .lt-chip.rd .lt-box { border-radius: 50%; }
  .lt-chip.on.rd .lt-box { box-shadow: inset 0 0 0 2.5px var(--wa-card); }
  .lt-chip.on.rd { cursor: default; }
  .lt-chip.add { border-style: dashed; background: transparent; color: var(--wa-muted); }
  .lt-chip.dim { opacity: .55; }
  /* The tags after the name never shrink or wrap: the name takes the
     ellipsis, so a narrow chip still says "skips 2" whole. */
  .lt-chip em { flex: none; white-space: nowrap; font-style: normal; font-size: 10px; color: var(--wa-muted); }
  .lt-chip.busy { opacity: .6; cursor: progress; }
  .lt-chip.stuck { opacity: .45; cursor: not-allowed; }
  .lt-note { margin: 0; font-size: 11.5px; line-height: 1.35; color: var(--wa-need); }
  .lt-note.ok { color: var(--wa-muted); }
  /* The untick's question (renderTickAsk): the words, then the two buttons
     in the form sheet's small and danger look, drawn here so a host
     without that sheet (the Pages tab) draws them the same. */
  .lt-ask {
    display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; max-width: 520px; padding: 8px 10px;
    border-radius: 8px; background: var(--wa-card); box-shadow: inset 0 0 0 1px var(--wa-line-strong);
    font-size: 12px; line-height: 1.4; color: var(--wa-ink);
  }
  .lt-ask-q { flex: 1 1 220px; min-width: 0; }
  .lt-ask-acts { display: inline-flex; gap: 6px; flex: none; }
  .lt-ask .lt-ask-btn {
    font: inherit; font-size: 12.5px; font-weight: 600; padding: 0 9px; min-height: 26px; border-radius: 6px; cursor: pointer;
    border: 1px solid var(--wa-line-strong); background: var(--wa-field, var(--wa-input)); color: var(--wa-ink);
  }
  .lt-ask .lt-ask-btn:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); background: var(--wa-hover); }
  .lt-ask .lt-ask-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lt-ask .lt-ask-btn.danger {
    color: var(--error-color, #e5484d); border-color: color-mix(in srgb, var(--error-color, #e5484d) 45%, transparent);
    background: color-mix(in srgb, var(--error-color, #e5484d) 8%, transparent);
  }
  .lt-ask .lt-ask-btn.danger:hover { background: color-mix(in srgb, var(--error-color, #e5484d) 16%, transparent); border-color: var(--error-color, #e5484d); }
  /* The fold (renderTickChips): in the DOM whenever a chip is off, shown
     only when the row has marked itself folded (chip-row.ts: the chips do
     not fit the device strip), and then the inline off chips step aside for
     it. Hidden, not gone: they keep their full width (no max-width to clamp
     them to the folded row), so the next measurement still knows how wide
     every chip is. The dashed "Add to this watch" chip never folds. */
  .lt-fold { display: none; position: relative; min-width: 0; }
  wa-chip-row[folded] > .lt-chip.off:not(.add) { position: absolute; top: 0; left: 0; max-width: none; visibility: hidden; pointer-events: none; }
  wa-chip-row[folded] > .lt-fold { display: inline-flex; }
  .lt-fold-sum { list-style: none; user-select: none; }
  .lt-fold-sum::-webkit-details-marker { display: none; }
  .lt-fold-sum::marker { content: ""; }
  .lt-fold-sum:hover { color: var(--wa-ink); border-color: var(--wa-muted); }
  .lt-chev { flex: none; width: 10px; height: 10px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; transition: transform .12s ease-out; }
  .lt-fold[open] > .lt-fold-sum { color: var(--wa-ink); border-color: var(--wa-muted); }
  .lt-fold[open] .lt-chev { transform: rotate(180deg); }
  .lt-fold-pop {
    position: absolute; top: calc(100% + 6px); left: 0; z-index: 50;
    display: flex; flex-wrap: wrap; gap: 6px; min-width: 240px; max-width: 360px; padding: 8px; box-sizing: border-box;
    background: var(--wa-card); border: 1px solid var(--wa-line-strong); border-radius: 10px;
    box-shadow: var(--wa-shadow-pop, 0 8px 24px rgba(0, 0, 0, .28));
  }
  .lt-fold-pop .lt-chip.off { display: inline-flex; }
`;
