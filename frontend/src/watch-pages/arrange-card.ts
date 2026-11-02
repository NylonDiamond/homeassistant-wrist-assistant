// Where a tile's own parts sit: the Layout section of the tile inspector's
// Text and layout group (`renderArrangeSection`). First a row of ready made
// looks, each drawn with the tile itself, and Custom. One click on a look
// writes it (`arrange-looks.ts`), and Use on whole page offers it for every
// tile that can use it, one undo step.
//
// The looks always stay in view. Custom opens the tools under them: a large live
// tile with a grid, whose parts are pressed and dragged straight away and snap
// as they move (`arrange-snap.ts`), a row of the parts, each picked by its name
// and shown or hidden by its eye, the picked part's Spot on a 3 by 3 grid of the
// tile's content box beside its Size, and under More a small move across and
// down. Every edit is one commit of the tile key `arrange`
// (`setWatchTileArrange`), so it goes through the draft and undo like every
// other tile setting. The part picked is shared with the stage
// (`arrangePickedPart`): there the selected tile's parts are dragged too, or
// nudged with the arrow keys.
//
// A tile whose picture fills it and a chart get no looks, only the reason. A
// stacked or strip watch tile gets Standard and Icon only, and the renderer
// ignores an `arrange` key stored on any of them. An iPhone tile draws its
// layout at any size, so it gets them all. The placement math is
// `one-look/arrange.ts`, what the rows know about the tile `arrange-model.ts`.
// Plan: app repo docs/page_editor_calm_plan_2026-10.md, step 6.
//
// The rows' rules are in `tileSettingsStyles` (tile-settings.ts), under
// `.ts-arr`: this module imports that one, so it must not hand it values
// that are read while the two load.

import { html, nothing, type TemplateResult } from "lit";
import { numberField, segField } from "../editors.js";
import type { HassEntityState } from "../ha-api.js";
import { arrangementFor, arrangementUpdateNote } from "../version.js";
import { type TileSettingsHost, hostDevice } from "./editor-host.js";
import type { WatchPagesDocument, WatchPageTile } from "./model.js";
import {
  ARRANGE_UI_KEY,
  type ArrangeFrameSource,
  type ArrangeLook,
  ARRANGE_LOOKS,
  arrangeFaceBlock,
  arrangeFreeBlock,
  arrangeFreeOn,
  arrangeFrame,
  arrangePickedPart,
  arrangeStartFor,
  setArrangeFreePicked,
  setArrangePickedPart,
} from "./arrange-model.js";
import { type ArrangePagePlan, arrangePagePlan, tileLooks, tileWithLook } from "./arrange-looks.js";
import {
  ARRANGE_OFFSET_RANGE,
  ARRANGE_SPOTS,
  type ArrangePart,
  type ArrangePartEntry,
  type ArrangeSpot,
  type TileArrange,
  withArrangePart,
} from "./one-look/arrange.js";
import type { OneLookPreviewModel } from "./one-look/render.js";
import { pictureChoice } from "./picture-choice.js";
import { editTile, setWatchTileArrange, watchTileArrange } from "./tile-settings-model.js";
import { commit, moreLine, rareRow, resetButton, typed, typedNumber, typingField } from "./tile-settings.js";

// ── state kept between draws ─────────────────────────────────────────────
//
// Custom and the part picked live in `uiState` by tile (`arrange-model.ts`),
// where the stage reads them too: a part clicked on the stage tile is the
// one this card shows, and Escape on the stage lets the pick go.

/** The part the card is placing: Icon until another is picked, undefined
 * once the pick was let go on the stage. */
export function arrangeSelectedPart(host: TileSettingsHost): ArrangePart | undefined {
  return arrangePickedPart(host.uiState, host.tileId);
}

/** Whether the card shows Custom: an arrangement of its own, or Custom picked
 * with nothing moved yet. */
export function arrangeFreeShown(host: TileSettingsHost): boolean {
  return arrangeFreeOn(host.uiState, host.tile);
}

/** The question open under the looks, with the document it was asked about:
 * any other edit closes it, as its numbers no longer hold. */
const askKey = (tileId: string) => `${ARRANGE_UI_KEY}:ask:${tileId.toUpperCase()}`;
/** The line after a whole page edit, while that edit is the document. */
const doneKey = (tileId: string) => `${ARRANGE_UI_KEY}:done:${tileId.toUpperCase()}`;

interface ArrangeAsk { plan: ArrangePagePlan; document: WatchPagesDocument }
interface ArrangeDone { look: ArrangeLook; count: number; document: WatchPagesDocument }

// ── edits ────────────────────────────────────────────────────────────────

function writeArrange(host: TileSettingsHost, setting: string, next: (now: TileArrange | undefined) => TileArrange | undefined, typing = false): void {
  commit(host, `arrange:${setting}`, (d) => setWatchTileArrange(d, host.pageId, host.tileId, next(watchTileArrange(host.tile))), { typing });
}

function writePart(host: TileSettingsHost, setting: string, change: (entry: ArrangePartEntry) => ArrangePartEntry, typing = false): void {
  const part = arrangeSelectedPart(host);
  if (part === undefined) return;
  writeArrange(host, setting, (now) => withArrangePart(now, part, change), typing);
}

function forgetWholePage(host: TileSettingsHost): void {
  host.uiState.delete(askKey(host.tileId));
  host.uiState.delete(doneKey(host.tileId));
}

/** A look: it is written at once, one undo step, and Custom's tools close. */
export function pickArrangeLook(host: TileSettingsHost, look: ArrangeLook): void {
  setArrangeFreePicked(host.uiState, host.tileId, false);
  forgetWholePage(host);
  host.endCoalesce();
  const { pageId, tileId } = host;
  commit(host, "arrange:look", (d) => editTile(d, pageId, tileId, (tile) => tileWithLook(tile, look)));
  host.requestUpdate();
}

/**
 * Custom: the tools open at once, starting from what the tile has; nothing is
 * written until a part changes. A part let go before is picked again (Icon), so
 * the tile can be grabbed at once. An iPhone tile whose size gives it a layout
 * of few parts has nothing to grab until it holds a layout of its own, so it
 * starts from what it draws now (`arrangeStartFor`). `phoneModel` is that tile
 * as the page editor draws it on the iPhone.
 */
export function pickArrangeCustom(host: TileSettingsHost, phoneModel?: () => OneLookPreviewModel | undefined): void {
  setArrangeFreePicked(host.uiState, host.tileId, true);
  forgetWholePage(host);
  if (arrangeSelectedPart(host) === undefined) setArrangePickedPart(host.uiState, host.tileId, "icon");
  if (watchTileArrange(host.tile) === undefined) {
    const model = phoneModel?.() ?? (hostDevice(host) === "iphone" ? arrangeFrame(sourceOf(host), host.tile)?.model : undefined);
    const start = arrangeStartFor(model);
    if (start !== undefined) {
      host.endCoalesce();
      writeArrange(host, "start", () => start);
    }
  }
  host.requestUpdate();
}

/** The Layout section's Reset: the key goes, as Standard writes it, and
 * Custom, if picked, stays picked with nothing moved. */
export function arrangeResetEdit(host: TileSettingsHost): (d: WatchPagesDocument) => WatchPagesDocument {
  const { pageId, tileId } = host;
  return (d) => setWatchTileArrange(d, pageId, tileId, undefined);
}

/** Take a look or an arrangement off a tile that no longer draws it. */
function clearStored(host: TileSettingsHost): void {
  host.endCoalesce();
  writeArrange(host, "reset", () => undefined);
}

/** Open the question for the whole page, its numbers read now. */
function askWholePage(host: TileSettingsHost, look: ArrangeLook): void {
  const ask: ArrangeAsk = { plan: arrangePagePlan(sourceOf(host), host.page, look), document: host.document };
  host.uiState.delete(doneKey(host.tileId));
  host.uiState.set(askKey(host.tileId), ask);
  host.requestUpdate();
}

/** Use the look on every tile the question named: one edit, so one undo step
 * brings them all back. */
function useOnWholePage(host: TileSettingsHost, plan: ArrangePagePlan): void {
  const { pageId } = host;
  host.endCoalesce();
  host.uiState.delete(askKey(host.tileId));
  commit(host, "arrange:page", (d) => plan.changes.reduce((next, id) => editTile(next, pageId, id, (tile) => tileWithLook(tile, plan.look)), d));
  const done: ArrangeDone = { look: plan.look, count: plan.changes.length, document: host.document };
  host.uiState.set(doneKey(host.tileId), done);
  host.requestUpdate();
}

// ── the rows ─────────────────────────────────────────────────────────────

const PART_LABELS: [ArrangePart, string][] = [["icon", "Icon"], ["name", "Name"], ["state", "State"]];
const SCALES: [string, string][] = [["0.8", "80%"], ["1", "100%"], ["1.2", "120%"], ["1.5", "150%"]];
const SPOT_WORDS: Readonly<Record<ArrangeSpot, string>> = {
  tl: "Top left", tc: "Top centre", tr: "Top right",
  ml: "Middle left", mc: "Middle", mr: "Middle right",
  bl: "Bottom left", bc: "Bottom centre", br: "Bottom right",
};
const PART_WORDS: Readonly<Record<ArrangePart, string>> = { icon: "icon", name: "name", state: "state" };

/** The names of the devices on the page whose app draws Standard whatever is
 * stored. */
function tooOld(host: TileSettingsHost): string[] {
  return (host.pickers ?? []).filter((p) => !arrangementFor(p.version ?? null)).map((p) => p.name);
}

function sourceOf(host: TileSettingsHost): ArrangeFrameSource {
  return {
    page: host.page, pages: [host.page, ...host.otherPages], device: hostDevice(host),
    states: host.hass.states as Record<string, HassEntityState>, icons: host.icons, behavior: host.behavior,
    ...(host.catalog === undefined ? {} : { catalog: host.catalog }),
  };
}

const lookLabel = (look: ArrangeLook) => ARRANGE_LOOKS.find((l) => l.id === look)?.label ?? look;

/** "A, B and C", at most three names and then how many more. */
function namesLine(items: readonly { name: string; why: string }[]): string {
  const named = items.slice(0, 3).map((s) => `${s.name} (${s.why})`);
  const more = items.length - named.length;
  if (more > 0) return `${named.join(", ")} and ${more} more`;
  return named.length < 2 ? named.join("") : `${named.slice(0, -1).join(", ")} and ${named[named.length - 1]}`;
}

/** Under the looks: Use on whole page, its question, or the line after it. */
function renderWholePage(host: TileSettingsHost, look: ArrangeLook): TemplateResult {
  const ask = host.uiState.get(askKey(host.tileId)) as ArrangeAsk | undefined;
  if (ask !== undefined && ask.document === host.document && ask.plan.look === look) {
    const { plan } = ask;
    const close = () => { host.uiState.delete(askKey(host.tileId)); host.requestUpdate(); };
    const n = plan.changes.length;
    const tiles = (count: number) => (count === 1 ? "1 tile" : `${count} tiles`);
    if (n === 0) {
      return html`<div class="ts-arr-ask" role="status"><p>No other tile can change.</p>
        ${plan.skipped.length === 0 ? nothing : html`<p class="sub">${namesLine(plan.skipped)}.</p>`}
        <div class="ts-arr-ask-row"><button type="button" class="ghost ts-reset-btn" @click=${close}>Close</button></div></div>`;
    }
    return html`<div class="ts-arr-ask" role="group" aria-label="Use on whole page">
      <p><b>Use ${lookLabel(look)} on ${tiles(n)}?</b></p>
      ${plan.replaces === 0 ? nothing : html`<p class="sub">${plan.replaces === 1 ? "1 tile has a layout of its own, and this replaces it." : `${plan.replaces} tiles have a layout of their own, and this replaces them.`}</p>`}
      ${plan.skipped.length === 0 ? nothing : html`<p class="sub">${plan.skipped.length === 1 ? "1 tile stays as it is" : `${plan.skipped.length} tiles stay as they are`}: ${namesLine(plan.skipped)}.</p>`}
      <div class="ts-arr-ask-row">
        <button type="button" class="primary" @click=${() => useOnWholePage(host, plan)}>Use on ${tiles(n)}</button>
        ${html`<button type="button" class="ghost ts-reset-btn" @click=${close}>Cancel</button>`}
      </div>
    </div>`;
  }
  const done = host.uiState.get(doneKey(host.tileId)) as ArrangeDone | undefined;
  if (done !== undefined && done.document === host.document) {
    return html`<div class="ts-arr-done" role="status"><span>${lookLabel(done.look)} is on ${done.count === 1 ? "1 tile" : `${done.count} tiles`}.</span>
      ${host.undoEdit === undefined ? nothing : html`<button type="button" class="ghost ts-reset-btn" @click=${() => { host.uiState.delete(doneKey(host.tileId)); host.undoEdit?.(); host.requestUpdate(); }}>Undo</button>`}</div>`;
  }
  return html`<div class="ts-arr-foot start"><button type="button" class="ghost ts-reset-btn" title="Use this look on every tile of this page that can use it"
    @click=${() => askWholePage(host, look)}>Use on whole page</button></div>`;
}

/** Custom's picture: a tile with its parts as plain marks. */
const CUSTOM_PICTURE = html`<span class="ts-arr-custom"><i></i><i></i><i></i></span>`;

/**
 * The Layout section's rows: a tile's reason when it can use no look, else
 * the looks, each drawn by `lookPicture`, then under Custom the live tile the
 * page editor draws for the parts to be dragged on (`picture`, on a black
 * well) and the part's rows, and under a look Use on whole page.
 */
export function renderArrangeSection(
  host: TileSettingsHost,
  picture?: () => TemplateResult | typeof nothing,
  lookPicture?: (key: string, make: (tile: WatchPageTile) => WatchPageTile) => TemplateResult | typeof nothing,
  phoneModel?: () => OneLookPreviewModel | undefined,
): TemplateResult {
  const tile = host.tile;
  const stored = watchTileArrange(tile);
  const source = sourceOf(host);
  const read = tileLooks(source, tile);
  const old = arrangementUpdateNote(tooOld(host));
  const oldNote = old === undefined ? nothing : html`<div class="hint warn ts-under" role="status">${old}</div>`;
  const onWatch = stored !== undefined && source.device === "iphone" ? arrangeFrame({ ...source, device: "watch" }, tile)?.model : undefined;
  const watchNote = onWatch !== undefined && arrangeFreeBlock(onWatch) !== undefined
    ? html`<div class="hint keep">On the watch, this tile uses Standard, because it is too small there for this layout.</div>` : nothing;
  if (read.looks.length === 0) {
    return html`<div class="ts-arr">
      ${read.block === undefined ? nothing : html`<div class="hint keep">${read.block}${stored === undefined ? "" : " The layout stored on it is kept but not drawn."}</div>`}
      ${oldNote}
      ${read.block !== undefined && stored !== undefined ? html`<div class="ts-arr-foot">${resetButton("Clear the stored layout", "Clear the stored layout", () => clearStored(host))}</div>` : nothing}
    </div>`;
  }
  const custom = !read.short && arrangeFreeShown(host);
  const value = custom ? "custom" : read.current;
  const options = [
    ...read.looks.map((l) => ({
      value: l.id as ArrangeLook | "custom",
      label: l.label,
      ...(l.off === undefined ? {} : { disabled: true, title: `Off because ${l.off}` }),
      picture: () => lookPicture?.(l.id, (t) => tileWithLook(t, l.id)) ?? nothing,
    })),
    ...(read.short ? [] : [{ value: "custom" as ArrangeLook | "custom", label: "Custom", picture: () => CUSTOM_PICTURE }]),
  ];
  const offNotes = read.looks.filter((l) => l.off !== undefined);
  const looks = html`<div class="ts-arr-looks">${pictureChoice<ArrangeLook | "custom">("Look", value, options,
    (v) => (v === "custom" ? pickArrangeCustom(host, phoneModel) : pickArrangeLook(host, v)), { size: "large" })}</div>`;
  const notes = html`${read.short && read.block !== undefined ? html`<div class="hint keep">${read.block}${stored !== undefined && read.current !== "icon" ? " The layout stored on it is kept but not drawn." : ""}</div>` : nothing}
    ${offNotes.length === 0 ? nothing : html`<div class="hint keep">${offNotes.map((l) => `${l.label} is off because ${l.off}.`).join(" ")}</div>`}
    ${watchNote}
    ${oldNote}`;
  if (!custom) {
    return html`<div class="ts-arr">${looks}${notes}${value === "custom" ? nothing : renderWholePage(host, value)}</div>`;
  }
  const drawn = picture?.() ?? nothing;
  const well = drawn === nothing ? nothing : html`<div class="ts-arr-pic">${drawn}</div>`;
  const picked = arrangeSelectedPart(host);
  const pickedHidden = picked !== undefined && stored?.parts[picked]?.hidden === true;
  return html`<div class="ts-arr">
    ${looks}
    ${notes}
    <div class="ts-arr-work">
      <div class="ts-arr-stage">
        ${well}
        <div class="hint keep ts-arr-how">${pickedHidden
          ? `The ${PART_WORDS[picked]} is hidden. Press its eye to show it.`
          : "Drag a part to move it. It snaps to the grid and to the other parts. Hold Option or Alt to place it freely."}</div>
      </div>
      <div class="ts-arr-tools">
        ${renderPartRow(host, stored)}
        ${renderCustomRows(host, stored, arrangeFrame(source, tile)?.model)}
      </div>
    </div></div>`;
}

const EYE = html`<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="8" cy="8" r="2" fill="currentColor"/></svg>`;
const EYE_OFF = html`<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M3 13 13 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`;

/** The parts, one button each: its name picks it, its eye shows or hides it.
 * A hidden part has nothing to click on the tile, so it is picked here. */
function renderPartRow(host: TileSettingsHost, stored: TileArrange | undefined): TemplateResult {
  const picked = arrangeSelectedPart(host);
  const pick = (part: ArrangePart) => {
    setArrangePickedPart(host.uiState, host.tileId, part);
    host.endCoalesce();
    host.requestUpdate();
  };
  return html`<div class="ts-arr-parts" role="group" aria-label=Part>${PART_LABELS.map(([part, label]) => {
    const entry = stored?.parts[part];
    const hidden = entry?.hidden === true;
    const eye = html`<button type="button" class="ts-arr-eye" aria-pressed=${hidden ? "false" : "true"} aria-label=${`${hidden ? "Show" : "Hide"} the ${PART_WORDS[part]}`} title=${`${hidden ? "Show" : "Hide"} the ${PART_WORDS[part]}`}
      @click=${() => { host.endCoalesce(); writeArrange(host, `hidden:${part}`, (now) => withArrangePart(now, part, (e) => ({ ...e, hidden: !hidden }))); }}>${hidden ? EYE_OFF : EYE}</button>`;
    return html`<div class="ts-arr-part ${part === picked ? "on" : ""} ${hidden ? "off" : ""}">
      <button type="button" class="ts-arr-part-name" aria-pressed=${part === picked ? "true" : "false"} @click=${() => pick(part)}>${label}${entry === undefined ? nothing : html`<i class="ts-arr-moved" title="Changed"></i>`}</button>
      ${eye}
    </div>`;
  })}</div>`;
}

/** The rows under Custom, for the part picked. */
function renderCustomRows(host: TileSettingsHost, stored: TileArrange | undefined, model: OneLookPreviewModel | undefined): TemplateResult | typeof nothing {
  const picked = arrangeSelectedPart(host);
  if (picked === undefined) return nothing;
  const part = picked;
  const entry = stored?.parts[part] ?? {};
  const drawn = model === undefined ? true
    : part === "icon" ? model.layout.discRect.width > 0
    : part === "name" ? model.layout.name.lines.length > 0
    : model.layout.stateRect !== undefined;
  // A spot puts the part exactly there: the move across and down (what a drag
  // on the stage writes) goes with it. Size and Show stay.
  const placeAt = (spot: ArrangeSpot) => writePart(host, "spot", (e) => {
    const { spot: _s, dx: _x, dy: _y, ...rest } = e;
    return { ...rest, spot };
  });
  const nudged = (entry.dx ?? 0) !== 0 || (entry.dy ?? 0) !== 0;
  const scale = String(entry.scale ?? 1);
  const percent = (axis: "dx" | "dy") => Math.round((entry[axis] ?? 0) * 1000) / 10;
  const offset = (axis: "dx" | "dy") => {
    const label = axis === "dx" ? "Across" : "Down";
    const shown = typedNumber(typed(host, `arrange:${axis}`), percent(axis));
    const set = (v: number | undefined) => writePart(host, axis, (e) => ({ ...e, [axis]: v === undefined ? 0 : v / 100 }), true);
    return typingField(host, `arrange:${axis}`, numberField(label, shown, set, {
      step: 1, min: ARRANGE_OFFSET_RANGE[0] * 100, max: ARRANGE_OFFSET_RANGE[1] * 100, unit: "%", def: 0,
    }), percent(axis));
  };
  return html`<div class="ts-arr-free">
    ${drawn ? nothing : html`<div class="hint keep">This tile draws no ${PART_WORDS[part]} now; its layout is kept for when it does.</div>`}
    <div class="ts-arr-place">
      <div class="field ts-arr-spot-row"><span>Spot</span>
        <div class="ts-arr-spots" role="radiogroup" aria-label=${`Spot of the ${PART_WORDS[part]}`}>
          ${ARRANGE_SPOTS.map((spot) => {
            const on = entry.spot === spot;
            const exact = on && !nudged;
            return html`<button type="button" class="ts-arr-spot ${on ? "on" : ""}" role="radio" aria-checked=${on ? "true" : "false"}
              title=${SPOT_WORDS[spot]} aria-label=${SPOT_WORDS[spot]}
              @click=${() => { if (!exact) placeAt(spot); }}><span></span></button>`;
          })}
        </div>
      </div>
      ${segField("Size", scale, SCALES, (v) => writePart(host, "scale", (e) => ({ ...e, scale: Number(v) })), { def: "1" })}
    </div>
    ${rareRow(host, "arrange", nudged, html`${offset("dx")}${offset("dy")}
      <div class="hint ts-under">Moves the ${PART_WORDS[part]} from its spot by a share of the tile's width and height, so it lands in the same place on every watch size and the iPhone.</div>`)}
    <div class="ts-arr-foot between">
      ${moreLine(host, "arrange", nudged ? [] : [{ name: "Exact place" }])}
      <button type="button" class="ghost ts-reset-btn" title=${`Put the ${PART_WORDS[part]} back: its place, size and eye`} ?disabled=${stored?.parts[part] === undefined}
        @click=${() => writePart(host, "part-reset", () => ({}))}>Reset ${PART_WORDS[part]}</button>
    </div>
  </div>`;
}
