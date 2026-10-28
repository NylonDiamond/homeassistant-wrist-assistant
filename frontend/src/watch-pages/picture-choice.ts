// Picture choices for the tile settings: a row of small pictures, one per
// option, each with its label under it, in place of a row of words where a
// picture says more (Glow, When it is off, State value and bar, Border
// style, Size, Pattern), and the small ones (a border's thickness and line
// style as sample lines, a label's weight and design as "Aa").
//
// Only a choice about the tile's own color and glow (Glow, When it is off)
// is drawn as the tile: the real tile renderer (`renderWatchTileFace`)
// drawing a copy of the selected tile with that option applied to a copy of
// the document, through the same setter the control writes with. Every
// other choice is a small sample on one neutral dark ground (a value in
// plain text or on a pill, a bar alone, a plain tile with its line, a
// pattern on gray), so each picture shows only what differs between the
// choices, not a row of full tiles that all look alike. Those samples are
// drawn from the value the setter stores, read back from the tile it leaves
// (`tile-settings.ts`), so no picture shows what a pick would not store.
// Pictures are small, draw no live camera or chart subscription, and are
// kept per tile revision.
//
// The tried tile: pointing at a choice, or moving the focus to it, draws the
// tile as that choice would leave it, on the stage and on the inspector
// head's preview tile, through the same edit a click stores (`tryTileEdit`),
// so a try never shows what a click would not store. Every picture choice
// here tries, as do the color picker's swatches and chips and the menus whose
// choices move (Effect, a border's Animation). With several tiles picked the
// edit is made on each (`acrossPicked`), so the try shows on all of them. It
// lives in `uiState` until the pointer leaves the row or the focus leaves it,
// or a click picks; nothing is written to the draft, so a try makes no undo
// step and no save prompt. The stage names what is tried over the device
// (`watchTryLabel`).
//
// Plan: app repo docs/page_editor_calm_plan_2026-10.md, step 9.

import { css, html, nothing, type TemplateResult } from "lit";
import { settingTitle } from "../editors.js";
import type { HassEntityState } from "../ha-api.js";
import { uiIcon } from "../ui-icons.js";
import { type TileSettingsHost, hostDevice } from "./editor-host.js";
import { findWatchPage, sameWatchId } from "./edit.js";
import { MIXED_WORD, acrossPicked } from "./multi-pick.js";
import type { WatchPageTile, WatchPagesDocument } from "./model.js";
import { type WatchTilePreviewAs, renderWatchTileFace, watchPatternLayers, watchTileStatesAs } from "./preview.js";
import { type ArrangeFrame, arrangeFrame } from "./arrange-model.js";
import { watchTileIconPhotoId } from "./tile-settings-model.js";
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
 * one large tile picture, a neutral sample (`valueSample`, `barSample`, `borderSample`), a small
 * chip (a sample line, "Aa"), a pattern swatch, a page strip, or a Home map
 * tile's floor in one of its looks (96 by 64). */
export type PictureChoiceSize = "tile" | "pair" | "large" | "mini" | "small" | "swatch" | "strip" | "map";

/** Trying a choice before it is picked (`tryTileEdit`): what pointing at a
 * choice or focusing it does, and what leaving the row does. */
export interface ChoiceTrial<T extends string> {
  /** Try `value`, which the stage's pill calls `label`. */
  try(value: T, label: string): void;
  /** The pointer or the focus left the row, or a click picked. */
  end(): void;
}

export interface PictureChoiceOptions<T extends string> {
  /** The choice the title's reset dot goes back to. */
  def?: T;
  size?: PictureChoiceSize;
  /** The picked tiles differ here: no choice is on, and the title says
   * Mixed in grey. */
  mixed?: boolean;
  /** Pointing at a choice tries it on the tile. */
  trial?: ChoiceTrial<T>;
}

/** The grey word a setting's title carries while the picked tiles differ. */
export function mixedWord(): TemplateResult {
  return html`<em class="pc-mixed">${MIXED_WORD}</em>`;
}

/** The row's handler for the pointer or the focus leaving it, which ends a
 * try. On the row, not on each choice, so moving from one choice to the
 * next never draws the stored tile between the two. */
function leaveRow(end: () => void): (e: Event) => void {
  return (e: Event) => {
    // A focus move inside the row is not a leave.
    const box = e.currentTarget as HTMLElement | null;
    const to = (e as FocusEvent).relatedTarget;
    if (e.type === "focusout" && typeof Node !== "undefined" && to instanceof Node && box?.contains(to)) return;
    end();
  };
}

/**
 * A radio group of pictures, the title over it. A click on a choice that is
 * not on picks it, as a `segField` button does; Tab reaches each choice and
 * the arrow keys move between them, Enter or Space picking. A value that is
 * none of the options leaves every choice off, as Mixed does. With a
 * `trial`, pointing at a choice or focusing it tries it on the tile, and a
 * click ends the try.
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
  const mixed = opts.mixed === true;
  const shown = mixed ? undefined : value;
  const title = mixed ? html`<span>${label} ${mixedWord()}</span>`
    : shown === undefined ? html`<span>${label}</span>` : settingTitle(label, shown, opts.def, (v: T) => pick(v), name);
  const trial = opts.trial;
  const leave = trial === undefined ? nothing : leaveRow(() => trial.end());
  return html`<div class="field pc-field pc-size-${size}">${title}
    <div class="pc-group" role="radiogroup" aria-label=${label} @keydown=${moveBetweenChoices}
      @pointerleave=${leave} @focusout=${leave}>
      ${options.map((o) => {
        const on = o.value === shown;
        const tryIt = trial === undefined || o.disabled === true ? nothing : () => trial.try(o.value, o.label);
        return html`<button type="button" role="radio" class="pc-opt ${on ? "on" : ""}" aria-checked=${on ? "true" : "false"}
          data-value=${o.value} title=${o.title ?? nothing} ?disabled=${o.disabled === true}
          @pointerenter=${tryIt} @focus=${tryIt}
          @click=${() => { if (!on) pick(o.value); trial?.end(); }}>
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
  /** The document the try was made on: a try is about it alone, so once an
   * edit, an undo or a merge moves the draft the try is stale. */
  document: WatchPagesDocument;
  /** Each tried tile by its id in capitals. */
  tiles: ReadonlyMap<string, WatchPageTile>;
  /** What the stage's pill calls the try ("Glow: Always"), if anything. */
  label: string | undefined;
}

/** The try in `uiState`, unless it was made on another document. */
function triedOn(uiState: Map<string, unknown>, document: WatchPagesDocument | undefined): Tried | undefined {
  const tried = uiState.get(TRY_KEY) as Tried | undefined;
  return tried !== undefined && (document === undefined || tried.document === document) ? tried : undefined;
}

/** The tile with `tileId` on `pageId` of a document. */
export function watchTileIn(document: WatchPagesDocument, pageId: string, tileId: string): WatchPageTile | undefined {
  const page = findWatchPage(document, pageId);
  const items = Array.isArray(page?.items) ? page.items : [];
  return items.find((t): t is WatchPageTile => typeof t === "object" && t !== null && sameWatchId((t as WatchPageTile).id, tileId));
}

/** The tile being tried under the pointer for `tileId`, which the stage and
 * the head's preview tile draw in place of the stored one; undefined while
 * none is. With `document`, a try made on another document is none. */
export function watchTriedTile(uiState: Map<string, unknown>, tileId: string, document?: WatchPagesDocument): WatchPageTile | undefined {
  return typeof tileId === "string" ? triedOn(uiState, document)?.tiles.get(tileId.toUpperCase()) : undefined;
}

/** What the stage's pill names while a try is on ("Glow: Always"), or
 * undefined. With `document`, a try made on another document is none. */
export function watchTryLabel(uiState: Map<string, unknown>, document?: WatchPagesDocument): string | undefined {
  return triedOn(uiState, document)?.label;
}

/**
 * Try an edit: every picked tile as `edit` would leave it (`acrossPicked`,
 * the host's one tile when only one is picked), kept in `uiState` only and
 * drawn by the stage and the head's preview tile. The draft is not touched.
 * `label` is what the stage's pill calls it. Only the edit is run, once: no
 * other tile is drawn again for it.
 */
export function tryTileEdit(host: TileSettingsHost, edit: (d: WatchPagesDocument) => WatchPagesDocument, label?: string): void {
  const document = host.document;
  const ids = host.picked?.ids ?? [host.tileId];
  // The same try again (the focus a press gives the choice pointed at)
  // draws nothing new.
  const was = host.uiState.get(TRY_KEY) as Tried | undefined;
  if (label !== undefined && was?.document === document && was.label === label && was.tiles.size === ids.length
    && ids.every((id) => was.tiles.has(id.toUpperCase()))) return;
  const next = acrossPicked(host, edit)(document);
  const tiles = new Map<string, WatchPageTile>();
  for (const id of ids) {
    const tile = watchTileIn(next, host.pageId, id);
    if (tile !== undefined) tiles.set(id.toUpperCase(), tile);
  }
  if (tiles.size === 0) return;
  host.uiState.set(TRY_KEY, { document, tiles, label } satisfies Tried);
  host.requestUpdate();
}

/** The pointer or the focus left, or a click picked: the stage and the
 * preview tile draw what is stored. */
export function endTileTry(host: Pick<TileSettingsHost, "uiState" | "requestUpdate">): void {
  if (host.uiState.delete(TRY_KEY)) host.requestUpdate();
}

/** Drop a try without drawing again: the selection moved, so the tiles it
 * was made on are no longer the ones edited. */
export function forgetTileTry(uiState: Map<string, unknown>): void {
  uiState.delete(TRY_KEY);
}

/**
 * The trial of a choice whose picks make `edit(value)`: trying a value
 * makes the same edit on a copy (`tryTileEdit`), its pill reading
 * "`name`: option". For `pictureChoice`, `colorPickerView` and the like.
 */
export function tileTrial<T extends string>(host: TileSettingsHost, name: string, edit: (value: T) => (d: WatchPagesDocument) => WatchPagesDocument): ChoiceTrial<T> {
  return {
    try: (value, label) => tryTileEdit(host, edit(value), `${name}: ${label}`),
    end: () => endTileTry(host),
  };
}

// ── the menu whose choices play on the preview tile ──────────────────────

const openKey = (host: TileSettingsHost, setting: string) => `${KEY}:open:${host.tileId.toUpperCase()}:${setting}`;

/**
 * A menu for a choice that moves (a tile's Effect, a border's Animation),
 * where a still picture says little: a button naming the stored choice,
 * which opens the list under it. Pointing at an entry, or moving the focus
 * to it with the arrow keys, plays it on the head's preview tile
 * (`tryTileEdit`); leaving the list draws the stored one again. A click or
 * Enter picks it and closes the list, Escape closes it. `opts.name` is what
 * the stage's pill calls the setting, where the label alone says too little;
 * `opts.mixed` names no choice, for picked tiles that differ.
 */
export function tryMenuField(
  host: TileSettingsHost,
  setting: string,
  label: string,
  choices: readonly { value: string; label: string }[],
  value: string,
  pick: (v: string) => void,
  edit: (v: string) => (d: WatchPagesDocument) => WatchPagesDocument,
  opts: { name?: string; mixed?: boolean } = {},
): TemplateResult {
  const name = opts.name ?? label;
  const key = openKey(host, setting);
  const open = host.uiState.get(key) === true;
  const mixed = opts.mixed === true;
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
        @click=${() => setOpen(!open)}>${mixed ? mixedWord() : html`<span>${now}</span>`}<span class="pc-chev" aria-hidden="true">${uiIcon("chevron")}</span></button>
      ${open ? html`<div class="pc-menu-list" role="listbox" aria-label=${label} @keydown=${keys} @pointerleave=${() => endTileTry(host)}>
        ${choices.map((c) => {
          const on = !mixed && c.value === value;
          return html`<button type="button" role="option" class="pc-menu-opt ${on ? "on" : ""}" aria-selected=${on ? "true" : "false"}
            @pointerenter=${() => tryTileEdit(host, edit(c.value), `${name}: ${c.label}`)} @focus=${() => tryTileEdit(host, edit(c.value), `${name}: ${c.label}`)}
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
  // The tile's icon photo, drawn as the stage draws it. Its bytes, size,
  // Light Look and On photo come in after the first draw, so each is part
  // of the kept picture's key: a picture drawn before they came is not kept
  // over one drawn after.
  const photos = host.photos;
  const photoId = watchTileIconPhotoId(host.tile);
  const photoInput = photos === undefined ? {} : {
    photo: (id: string) => photos.url(id),
    photoSize: (id: string) => photos.size(id),
    photoGlow: (id: string) => photos.glow(id),
    photoOn: (id: string) => photos.onUrl(id),
  };
  const photoKey = photos === undefined || photoId === undefined ? "" : [
    photos.url(photoId) ?? "", photos.size(photoId) === undefined ? 0 : 1, photos.glow(photoId) === undefined ? 0 : 1, photos.onUrl(photoId) ?? "",
  ].join(",");
  return {
    tile(key, edit, as, w, h) {
      const drawn = remembered(host.icons, host.page, host.tile);
      const id = `${key}|${as}|${w}x${h}|${hostDevice(host)}|${oneLook}|${photoKey}`;
      const kept = drawn.get(id);
      if (kept !== undefined) return kept;
      const f = frameOf();
      const tile = f === undefined ? undefined : watchTileIn(edit(host.document), host.pageId, host.tileId);
      if (f === undefined || tile === undefined) {
        drawn.set(id, nothing);
        return nothing;
      }
      const s = Math.min(w / f.cell.width, h / f.cell.height);
      const input = { ...f.input, ...photoInput, oneLook, scale: s, stateMode: "live" as const, states: watchTileStatesAs(tile, f.input.states, as) };
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

// ── the neutral samples ──────────────────────────────────────────────────

/** A state value as it reads on the tile: "80%" in plain text, the same on a
 * pill, or nothing for Off. */
export function valueSample(style: string | undefined): TemplateResult {
  if (style === "Off") return html`<span class="pc-mini"></span>`;
  return html`<span class="pc-mini"><span class="pc-val ${style === "Pill" ? "pill" : ""}">80%</span></span>`;
}

/** A state bar alone: a thin bar along the top, or a fill from the left. */
export function barSample(style: string | undefined): TemplateResult {
  return html`<span class="pc-mini"><span class="pc-bar ${style === "Fill" ? "fill" : "top"}"></span></span>`;
}

/** A border's style on a plain tile: none, a line in its thickness and line
 * style, or Animate's line with a light moving round it. */
export function borderSample(b: { style: string; thickness?: string; lineStyle?: string }): TemplateResult {
  if (b.style === "line") {
    const px = Math.max(1, THICKNESS_PX[b.thickness ?? "thin"] ?? 1.5);
    const line = b.lineStyle === "dashed" ? "dashed" : b.lineStyle === "dotted" ? "dotted" : "solid";
    return html`<span class="pc-mini" style=${`outline:${px}px ${line} rgba(255, 255, 255, .85);outline-offset:-${px}px`}></span>`;
  }
  return html`<span class="pc-mini ${b.style === "animate" ? "pc-anim" : ""}"></span>`;
}

/** The size of a pattern swatch, in CSS pixels. */
const SWATCH_W = 40;
const SWATCH_H = 26;

/** The neutral gray every pattern swatch is drawn on, so the gallery shows
 * the patterns and not the tile's color thirty times. */
export const PATTERN_GROUND = "#3a3d42";

/** A pattern on a swatch (on `PATTERN_GROUND` in the tile settings), as the
 * tile draws it (`watchPatternLayers`), its marks white so a small swatch
 * still reads. None is the bare ground. */
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
  /* The picked tiles differ here. */
  .pc-mixed { margin-left: 4px; font-style: italic; font-weight: 400; color: var(--wa-hint, var(--wa-muted)); }
  .pc-group { display: flex; flex-wrap: wrap; gap: 6px; min-width: 0; }
  /* Light options: a hairline, small words, the picture doing the talking. */
  .pc-opt {
    display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 0; padding: 4px 5px 5px;
    border: 1px solid color-mix(in srgb, var(--wa-line) 75%, transparent); border-radius: 9px; background: transparent; color: var(--wa-muted);
    font: inherit; cursor: pointer;
  }
  .pc-opt:hover:not(:disabled) { color: var(--wa-ink); }
  .pc-opt.on { color: var(--wa-ink); }
  .pc-opt:hover:not(:disabled) { background: var(--wa-hover, var(--wa-panel)); }
  .pc-opt:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .pc-opt.on { border-color: var(--wa-sel-ring, var(--wa-accent)); background: var(--wa-sel-bg, var(--wa-panel)); }
  .pc-opt:disabled { opacity: .45; cursor: default; }
  .pc-pic { display: flex; align-items: center; justify-content: center; gap: 5px; border-radius: 8px; }
  /* A real tile, smaller, on the watch's black: only Glow and When it is off. */
  .pc-size-tile .pc-pic, .pc-size-pair .pc-pic { width: 58px; height: 40px; background: #000; }
  .pc-size-pair .pc-pic { width: 92px; gap: 4px; }
  .pc-size-large .pc-pic { width: 136px; height: 90px; background: #000; }
  .pc-label { font-size: 11px; font-weight: 500; line-height: 1.2; text-align: center; }
  /* A neutral sample: a plain dark tile with only what the choice changes. */
  .pc-size-mini .pc-pic { width: 46px; height: 32px; }
  .pc-mini { position: relative; display: grid; place-items: center; width: 42px; height: 30px; border-radius: 8px; overflow: hidden; background: #2a2d32; }
  .pc-val { font-size: 10.5px; font-weight: 700; line-height: 1; color: #e8eaed; }
  .pc-val.pill { padding: 2px 5px; border-radius: 7px; background: #e8eaed; color: #1a1d21; font-size: 9.5px; }
  .pc-bar { position: absolute; left: 0; top: 0; }
  .pc-bar.top { left: 5px; right: 12px; top: 4px; height: 3px; border-radius: 2px; background: #e8eaed; }
  .pc-bar.fill { bottom: 0; width: 62%; background: rgba(232, 234, 237, .4); }
  .pc-mini.pc-anim { box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, .35), inset 0 0 0 3px var(--wa-hue-blue, #8c9bef); }
  .pc-tile { position: relative; display: block; flex: none; }
  .pc-size-small .pc-opt { flex-direction: row; gap: 7px; min-height: 30px; padding: 3px 9px; }
  .pc-size-small .pc-label { font-weight: 500; }
  .pc-line { display: block; width: 22px; height: 0; }
  .pc-aa { font-size: 15px; line-height: 1; }
  .pc-size-swatch .pc-group { gap: 4px; }
  .pc-size-swatch .pc-opt { gap: 3px; padding: 3px; border-color: transparent; }
  .pc-size-swatch .pc-opt.on { border-color: var(--wa-sel-ring, var(--wa-accent)); }
  .pc-size-swatch .pc-label { font-size: 10px; }
  .pc-swatch { display: block; width: 40px; height: 26px; border-radius: 6px; }
  .pc-size-strip .pc-pic { padding: 4px; }
  .pc-strip { --pc-lane: color-mix(in srgb, var(--wa-ink) 14%, transparent); position: relative; display: block; border-radius: 5px; }
  .pc-block { position: absolute; left: 0; top: 0; border-radius: 4px; background: var(--wa-accent); }
  /* A Home map tile's floor in one look, on the look's own ground. */
  .pc-size-map .pc-group { display: grid; grid-template-columns: repeat(auto-fill, minmax(106px, 1fr)); }
  .pc-size-map .pc-pic { width: 96px; height: 64px; overflow: hidden; background: #111; }
  .pc-size-map .pc-pic svg { display: block; }

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
