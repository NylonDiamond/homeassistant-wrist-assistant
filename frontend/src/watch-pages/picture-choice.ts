// Picture choices for the tile settings: a row of small pictures, one per
// option, each with its label under it, in place of a row of words where a
// picture says more (Glow, When it is off, State value and bar, Border
// style, Size, Pattern), and the small ones (a border's thickness and line
// style as sample lines, a label's weight and design as "Aa").
//
// A tile picture is the real tile renderer (`renderWatchTileFace`) drawing
// a copy of the selected tile with that option applied to a copy of the
// document, through the same setter the control writes with, so a picture
// never shows what a pick would not store. Pictures are small, draw no live
// camera or chart subscription, and are kept per tile revision.
//
// The tried tile: pointing at a choice of a menu whose choices move (Effect,
// a border's Animation) draws it on the inspector head's preview tile only.
// It lives in `uiState` until the pointer or the focus leaves; nothing is
// written to the draft.
//
// Plan: app repo docs/page_editor_calm_plan_2026-10.md, step 9.

import { css, html, nothing, type TemplateResult } from "lit";
import { settingTitle } from "../editors.js";
import type { HassEntityState } from "../ha-api.js";
import { uiIcon } from "../ui-icons.js";
import { type TileSettingsHost, hostDevice } from "./editor-host.js";
import { findWatchPage, sameWatchId } from "./edit.js";
import type { WatchPageTile, WatchPagesDocument } from "./model.js";
import { type WatchTilePreviewAs, renderWatchTileFace, watchPatternLayers, watchTileStatesAs } from "./preview.js";
import { type ArrangeFrame, arrangeFrame } from "./arrange-model.js";
import { ONE_LOOK_FONT_FAMILIES } from "./one-look/measurer.js";

/** Every `uiState` key of this module starts with this. */
const KEY = "tile-settings:picture";

// ── the choice ───────────────────────────────────────────────────────────

/** One option of a picture choice. */
export interface PictureOption<T extends string> {
  value: T;
  label: string;
  /** The button's tooltip, such as why it is greyed. */
  title?: string;
  disabled?: boolean;
  /** The picture over the label; nothing draws the label alone. */
  picture: () => TemplateResult | typeof nothing;
}

/** How big each option is drawn: a tile picture, two of them side by side,
 * a small chip (a sample line, "Aa"), a pattern swatch, or a page strip. */
export type PictureChoiceSize = "tile" | "pair" | "small" | "swatch" | "strip";

export interface PictureChoiceOptions<T extends string> {
  /** The choice the title's reset dot goes back to. */
  def?: T;
  size?: PictureChoiceSize;
}

/**
 * A radio group of pictures, the title over it. A click on a choice that is
 * not on picks it, as a `segField` button does; Tab reaches each choice and
 * the arrow keys move between them, Enter or Space picking. A value that is
 * none of the options leaves every choice off.
 */
export function pictureChoice<T extends string>(
  label: string,
  value: T | undefined,
  options: readonly PictureOption<T>[],
  pick: (v: T) => void,
  opts: PictureChoiceOptions<T> = {},
): TemplateResult {
  const size = opts.size ?? "tile";
  const name = (v: T) => options.find((o) => o.value === v)?.label ?? v;
  const title = value === undefined ? html`<span>${label}</span>` : settingTitle(label, value, opts.def, (v: T) => pick(v), name);
  return html`<div class="field pc-field pc-size-${size}">${title}
    <div class="pc-group" role="radiogroup" aria-label=${label} @keydown=${moveBetweenChoices}>
      ${options.map((o) => {
        const on = o.value === value;
        return html`<button type="button" role="radio" class="pc-opt ${on ? "on" : ""}" aria-checked=${on ? "true" : "false"}
          data-value=${o.value} title=${o.title ?? nothing} ?disabled=${o.disabled === true}
          @click=${() => { if (!on) pick(o.value); }}>
          <span class="pc-pic" aria-hidden="true">${o.picture()}</span>
          <span class="pc-label">${o.label}</span>
        </button>`;
      })}
    </div>
  </div>`;
}

/** The arrow keys, Home and End move the focus between a group's choices
 * (skipping greyed ones); they pick nothing, so a run of arrows is not a
 * run of edits. */
function moveBetweenChoices(e: KeyboardEvent): void {
  const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
  if (step === 0 && e.key !== "Home" && e.key !== "End") return;
  const group = e.currentTarget as HTMLElement | null;
  if (group === null || typeof group.querySelectorAll !== "function") return;
  const buttons = [...group.querySelectorAll<HTMLButtonElement>("button.pc-opt")].filter((b) => !b.disabled);
  if (buttons.length === 0) return;
  const at = buttons.indexOf(e.target as HTMLButtonElement);
  const next = e.key === "Home" ? 0 : e.key === "End" ? buttons.length - 1 : (Math.max(0, at) + step + buttons.length) % buttons.length;
  e.preventDefault();
  buttons[next]!.focus();
}

// ── the tried tile ───────────────────────────────────────────────────────

const TRY_KEY = `${KEY}:try`;

interface Tried {
  tileId: string;
  tile: WatchPageTile;
}

/** The tile with `tileId` on `pageId` of a document. */
export function watchTileIn(document: WatchPagesDocument, pageId: string, tileId: string): WatchPageTile | undefined {
  const page = findWatchPage(document, pageId);
  const items = Array.isArray(page?.items) ? page.items : [];
  return items.find((t): t is WatchPageTile => typeof t === "object" && t !== null && sameWatchId((t as WatchPageTile).id, tileId));
}

/** The tile being tried under the pointer for `tileId`, which the head's
 * preview tile draws in place of the stored one; undefined while none is. */
export function watchTriedTile(uiState: Map<string, unknown>, tileId: string): WatchPageTile | undefined {
  const tried = uiState.get(TRY_KEY) as Tried | undefined;
  return tried !== undefined && sameWatchId(tried.tileId, tileId) ? tried.tile : undefined;
}

/** Try an edit on the head's preview tile: the tile as `edit` would leave
 * it, kept in `uiState` only. The draft is not touched. */
export function tryTileEdit(host: TileSettingsHost, edit: (d: WatchPagesDocument) => WatchPagesDocument): void {
  const tile = watchTileIn(edit(host.document), host.pageId, host.tileId);
  if (tile === undefined) return;
  host.uiState.set(TRY_KEY, { tileId: host.tileId, tile } satisfies Tried);
  host.requestUpdate();
}

/** The pointer or the focus left: the preview tile draws what is stored. */
export function endTileTry(host: Pick<TileSettingsHost, "uiState" | "requestUpdate">): void {
  if (host.uiState.delete(TRY_KEY)) host.requestUpdate();
}

// ── the menu whose choices play on the preview tile ──────────────────────

const openKey = (host: TileSettingsHost, setting: string) => `${KEY}:open:${host.tileId.toUpperCase()}:${setting}`;

/**
 * A menu for a choice that moves (a tile's Effect, a border's Animation),
 * where a still picture says little: a button naming the stored choice,
 * which opens the list under it. Pointing at an entry, or moving the focus
 * to it with the arrow keys, plays it on the head's preview tile
 * (`tryTileEdit`); leaving the list draws the stored one again. A click or
 * Enter picks it and closes the list, Escape closes it.
 */
export function tryMenuField(
  host: TileSettingsHost,
  setting: string,
  label: string,
  choices: readonly { value: string; label: string }[],
  value: string,
  pick: (v: string) => void,
  edit: (v: string) => (d: WatchPagesDocument) => WatchPagesDocument,
): TemplateResult {
  const key = openKey(host, setting);
  const open = host.uiState.get(key) === true;
  const now = choices.find((c) => c.value === value)?.label ?? value;
  const setOpen = (on: boolean) => {
    if (on) host.uiState.set(key, true);
    else host.uiState.delete(key);
    if (!on) endTileTry(host);
    host.requestUpdate();
  };
  const keys = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      ((e.currentTarget as HTMLElement | null)?.closest?.(".pc-menu")?.querySelector(".pc-menu-btn") as HTMLElement | null)?.focus();
      return;
    }
    const step = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    if (step === 0) return;
    const list = e.currentTarget as HTMLElement | null;
    if (list === null || typeof list.querySelectorAll !== "function") return;
    const items = [...list.querySelectorAll<HTMLButtonElement>("button.pc-menu-opt")];
    const at = items.indexOf(e.target as HTMLButtonElement);
    e.preventDefault();
    items[(Math.max(0, at) + step + items.length) % items.length]?.focus();
  };
  const leave = (e: FocusEvent) => {
    const box = e.currentTarget as HTMLElement | null;
    if (e.relatedTarget instanceof Node && box?.contains(e.relatedTarget)) return;
    if (host.uiState.get(key) === true) setOpen(false);
  };
  return html`<div class="field pc-menu-field"><span>${label}</span>
    <div class="pc-menu" @focusout=${leave}>
      <button type="button" class="pc-menu-btn" aria-haspopup="listbox" aria-expanded=${open ? "true" : "false"}
        @click=${() => setOpen(!open)}><span>${now}</span><span class="pc-chev" aria-hidden="true">${uiIcon("chevron")}</span></button>
      ${open ? html`<div class="pc-menu-list" role="listbox" aria-label=${label} @keydown=${keys} @pointerleave=${() => endTileTry(host)}>
        ${choices.map((c) => {
          const on = c.value === value;
          return html`<button type="button" role="option" class="pc-menu-opt ${on ? "on" : ""}" aria-selected=${on ? "true" : "false"}
            @pointerenter=${() => tryTileEdit(host, edit(c.value))} @focus=${() => tryTileEdit(host, edit(c.value))}
            @click=${() => { setOpen(false); if (!on) pick(c.value); }}>${c.label}</button>`;
        })}
      </div>` : nothing}
    </div>
  </div>
  <div class="hint ts-under">Point at one to play it on the preview tile.</div>`;
}

// ── tile pictures ────────────────────────────────────────────────────────

/** Pictures of the selected tile, each with one edit made to a copy. */
export interface TilePictures {
  /** The tile as `edit` leaves it, drawn in `as` at most `w` by `h` CSS
   * pixels in its own shape. `key` names the edit, for the memo. */
  tile(key: string, edit: (d: WatchPagesDocument) => WatchPagesDocument, as: WatchTilePreviewAs, w: number, h: number): TemplateResult | typeof nothing;
}

/** Drawn pictures, kept per symbol provider, page and tile revision: an edit
 * makes a new page and tile, so a picture is drawn again only after one. */
const memo = new WeakMap<object, WeakMap<object, WeakMap<object, Map<string, TemplateResult | typeof nothing>>>>();

function remembered(icons: object, page: object, tile: object): Map<string, TemplateResult | typeof nothing> {
  let byPage = memo.get(icons);
  if (byPage === undefined) memo.set(icons, (byPage = new WeakMap()));
  let byTile = byPage.get(page);
  if (byTile === undefined) byPage.set(page, (byTile = new WeakMap()));
  let drawn = byTile.get(tile);
  if (drawn === undefined) byTile.set(tile, (drawn = new Map()));
  return drawn;
}

/** The selected tile's pictures, laid out as its page lays it out on the
 * device the page is shown on (`arrangeFrame`), in One Look when the
 * settings speak for it. Every picture of a tile with no place on the page
 * is nothing. */
export function tilePictures(host: TileSettingsHost): TilePictures {
  let frame: ArrangeFrame | undefined | null = null;
  const frameOf = (): ArrangeFrame | undefined => {
    if (frame === null) {
      frame = arrangeFrame({
        page: host.page, pages: [host.page, ...host.otherPages], device: hostDevice(host),
        states: host.hass.states as Record<string, HassEntityState>, icons: host.icons, behavior: host.behavior,
        ...(host.catalog === undefined ? {} : { catalog: host.catalog }),
      }, host.tile);
    }
    return frame;
  };
  const oneLook = host.oneLook === true;
  return {
    tile(key, edit, as, w, h) {
      const drawn = remembered(host.icons, host.page, host.tile);
      const id = `${key}|${as}|${w}x${h}|${hostDevice(host)}|${oneLook}`;
      const kept = drawn.get(id);
      if (kept !== undefined) return kept;
      const f = frameOf();
      const tile = f === undefined ? undefined : watchTileIn(edit(host.document), host.pageId, host.tileId);
      if (f === undefined || tile === undefined) {
        drawn.set(id, nothing);
        return nothing;
      }
      const s = Math.min(w / f.cell.width, h / f.cell.height);
      const input = { ...f.input, oneLook, scale: s, stateMode: "live" as const, states: watchTileStatesAs(tile, f.input.states, as) };
      const picture = html`<span class="pc-tile" style=${`width:${Math.round(f.cell.width * s)}px;height:${Math.round(f.cell.height * s)}px`}>${renderWatchTileFace(tile, f.cell, input, f.unit)}</span>`;
      drawn.set(id, picture);
      return picture;
    },
  };
}

// ── the small pictures ───────────────────────────────────────────────────

/** A border thickness as a sample line, in CSS pixels. */
const THICKNESS_PX: Readonly<Record<string, number>> = { none: 0, extraThin: 0.5, thin: 1, medium: 2, thick: 4, auto: 1.5 };

/** A border's thickness as a sample line of that weight. */
export function thicknessLine(thickness: string): TemplateResult {
  const px = THICKNESS_PX[thickness] ?? 1;
  return html`<span class="pc-line" style=${`border-top:${px}px solid currentColor`}></span>`;
}

/** A border's line style as a sample line drawn in it. */
export function lineStyleLine(style: string): TemplateResult {
  const css = style === "dashed" ? "dashed" : style === "dotted" ? "dotted" : "solid";
  return html`<span class="pc-line" style=${`border-top:2px ${css} currentColor`}></span>`;
}

/** The CSS weight of each label weight. */
const WEIGHT_CSS: Readonly<Record<string, number>> = { light: 300, regular: 400, medium: 500, semibold: 600, bold: 700 };

/** "Aa" in a label weight, in the watch's own font. */
export function weightSample(weight: string): TemplateResult {
  return html`<span class="pc-aa" style=${`font-family:${ONE_LOOK_FONT_FAMILIES.watch.standard};font-weight:${WEIGHT_CSS[weight] ?? 400}`}>Aa</span>`;
}

/** "Aa" in a label design. */
export function designSample(design: string): TemplateResult {
  const families = ONE_LOOK_FONT_FAMILIES.watch;
  const family = design === "rounded" ? families.rounded : design === "monospaced" ? families.monospaced : design === "serif" ? families.serif : families.standard;
  return html`<span class="pc-aa" style=${`font-family:${family}`}>Aa</span>`;
}

/** The size of a pattern swatch, in CSS pixels. */
const SWATCH_W = 52;
const SWATCH_H = 34;

/** A pattern on a swatch of the tile's color, as the tile draws it
 * (`watchPatternLayers`), its marks white so a small swatch still reads.
 * None is the bare color. */
export function patternSwatch(pattern: string, background: string): TemplateResult {
  const layers = pattern === "none" ? [] : watchPatternLayers(pattern, "#FFFFFF", 1, 0.6, { width: SWATCH_W, height: SWATCH_H });
  return html`<span class="pc-swatch" style=${`background:${[...layers, background].join(", ")}`}></span>`;
}

/** The width of a page strip, in CSS pixels, and its height for four rows. */
const STRIP_W = 76;
const STRIP_H = 30;

/** A size preset as a strip as wide as the page's grid (`columns` columns,
 * drawn as faint lanes) with the tile's block of `colSpan` columns at its
 * left, `rowSpan` rows tall against a four row strip. */
export function sizeStrip(colSpan: number, rowSpan: number, columns: number): TemplateResult {
  const w = Math.round((STRIP_W * Math.min(colSpan, columns)) / columns);
  const h = Math.round((STRIP_H * Math.min(rowSpan, 4)) / 4);
  const lane = STRIP_W / columns;
  return html`<span class="pc-strip" style=${`width:${STRIP_W}px;height:${STRIP_H}px;background:repeating-linear-gradient(90deg, var(--pc-lane) 0 ${lane - 1}px, transparent ${lane - 1}px ${lane}px)`}>
    <span class="pc-block" style=${`width:${w}px;height:${h}px`}></span>
  </span>`;
}


/** This module's rules, in the tile settings' sheet (`tileSettingsStyles`).
 * Prefix `pc-`. A picture choice stands its title over its pictures, where
 * they have the card's whole width; a row of small chips keeps the title in
 * the row's column, as every other row does. */
export const pictureChoiceStyles = css`
  .field.pc-field { display: flex; flex-direction: column; align-items: stretch; gap: 5px; padding: 4px 0; }
  .field.pc-field.pc-size-small { display: grid; align-items: center; }
  .pc-group { display: flex; flex-wrap: wrap; gap: 8px; min-width: 0; }
  .pc-opt {
    display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 0; padding: 5px;
    border: 1px solid var(--wa-line); border-radius: 10px; background: transparent; color: var(--wa-ink);
    font: inherit; cursor: pointer;
  }
  .pc-opt:hover:not(:disabled) { background: var(--wa-hover, var(--wa-panel)); }
  .pc-opt:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .pc-opt.on { border-color: var(--wa-sel-ring, var(--wa-accent)); background: var(--wa-sel-bg, var(--wa-panel)); }
  .pc-opt:disabled { opacity: .45; cursor: default; }
  .pc-pic { display: flex; align-items: center; justify-content: center; gap: 5px; border-radius: 8px; }
  .pc-size-tile .pc-pic, .pc-size-pair .pc-pic { width: 76px; height: 54px; background: #000; }
  .pc-size-pair .pc-pic { width: 118px; }
  .pc-label { font-size: 11.5px; font-weight: 600; line-height: 1.2; text-align: center; }
  .pc-tile { position: relative; display: block; flex: none; }
  .pc-size-small .pc-opt { flex-direction: row; gap: 7px; min-height: 30px; padding: 3px 9px; }
  .pc-size-small .pc-label { font-weight: 500; }
  .pc-line { display: block; width: 22px; height: 0; }
  .pc-aa { font-size: 15px; line-height: 1; }
  .pc-size-swatch .pc-group { gap: 6px; }
  .pc-size-swatch .pc-opt { gap: 3px; padding: 3px; }
  .pc-size-swatch .pc-label { font-weight: 500; font-size: 10.5px; }
  .pc-swatch { display: block; width: 52px; height: 34px; border-radius: 7px; }
  .pc-size-strip .pc-pic { padding: 4px; }
  .pc-strip { --pc-lane: color-mix(in srgb, var(--wa-ink) 14%, transparent); position: relative; display: block; border-radius: 5px; }
  .pc-block { position: absolute; left: 0; top: 0; border-radius: 4px; background: var(--wa-accent); }

  .field.pc-menu-field { align-items: start; }
  .field.pc-menu-field > span:first-child { padding-top: 7px; }
  .pc-menu { position: relative; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .pc-menu-btn {
    display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 28px; padding: 0 8px 0 10px;
    border: 1px solid var(--wa-line-strong); border-radius: 6px; background: var(--wa-field); color: var(--wa-ink);
    font: inherit; font-size: 12.5px; cursor: pointer;
  }
  .pc-menu-btn:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .pc-chev { display: inline-flex; color: var(--wa-muted); }
  .pc-menu-btn[aria-expanded="true"] .pc-chev { transform: rotate(180deg); }
  .pc-chev svg { width: 12px; height: 12px; }
  .pc-menu-list {
    display: flex; flex-direction: column; max-height: 240px; overflow-y: auto; padding: 4px; scrollbar-width: thin;
    border: 1px solid var(--wa-line-strong); border-radius: 8px; background: var(--wa-card);
  }
  .pc-menu-opt {
    padding: 5px 8px; border: 0; border-radius: 6px; background: transparent; color: var(--wa-ink);
    font: inherit; font-size: 12.5px; text-align: left; cursor: pointer;
  }
  .pc-menu-opt:hover, .pc-menu-opt:focus-visible { outline: none; background: var(--wa-hover, var(--wa-panel)); }
  .pc-menu-opt.on { font-weight: 650; }
`;
