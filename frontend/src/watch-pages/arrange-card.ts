// Where a tile's own parts sit, in the tile's head card under its live tile
// (`renderArrangeHead`), where the parts are dragged too: Arrange (Default
// or Free) and, in Free, the Part being placed, its Spot on a 3 by 3 grid of
// the tile's content box (or its native place), its Size, Shown or Hidden, a
// small move across and down, and "Put every part back". Every edit is one commit of the tile key
// `arrange` (`setWatchTileArrange`), so it goes through the draft and undo
// like every other tile setting; Default removes the key. The part picked
// is shared with the stage (`arrangePickedPart`): there the picked part of
// the selected tile is outlined and dragged, or nudged with the arrow keys.
//
// Free is offered only where One Look lays the tile out centred: a tile
// whose picture fills it, a chart, and a stacked or strip tile show Free
// greyed with the reason, and the renderer ignores a key stored on one.
// The placement math is `one-look/arrange.ts`, what the rows know about
// the tile `arrange-model.ts`.
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
import type { OneLookPreviewModel } from "./one-look/render.js";
import {
  type ArrangeFrameSource,
  arrangeFrame,
  arrangeFreeBlock,
  arrangeFreeOn,
  arrangePickedPart,
  setArrangeFreePicked,
  setArrangePickedPart,
} from "./arrange-model.js";
import {
  ARRANGE_OFFSET_RANGE,
  ARRANGE_SPOTS,
  type ArrangePart,
  type ArrangePartEntry,
  type ArrangeSpot,
  type TileArrange,
  withArrangePart,
} from "./one-look/arrange.js";
import { setWatchTileArrange, watchTileArrange } from "./tile-settings-model.js";
import { commit, resetButton, typed, typedNumber, typingField } from "./tile-settings.js";

// ── state kept between draws ─────────────────────────────────────────────
//
// Free and the part picked live in `uiState` by tile (`arrange-model.ts`),
// where the stage reads them too: a part clicked on the stage tile is the
// one this card shows, and Escape on the stage lets the pick go.

/** The part the card is placing: Icon until another is picked, undefined
 * once the pick was let go on the stage. */
export function arrangeSelectedPart(host: TileSettingsHost): ArrangePart | undefined {
  return arrangePickedPart(host.uiState, host.tileId);
}

/** Whether the card shows Free: a stored arrangement, or Free picked and
 * nothing moved yet (which stores nothing: no move is Default). */
export function arrangeFreeShown(host: TileSettingsHost): boolean {
  return arrangeFreeOn(host.uiState, host.tile);
}

// ── edits ────────────────────────────────────────────────────────────────

function writeArrange(host: TileSettingsHost, setting: string, next: (now: TileArrange | undefined) => TileArrange | undefined, typing = false): void {
  commit(host, `arrange:${setting}`, (d) => setWatchTileArrange(d, host.pageId, host.tileId, next(watchTileArrange(host.tile))), { typing });
}

function writePart(host: TileSettingsHost, setting: string, change: (entry: ArrangePartEntry) => ArrangePartEntry, typing = false): void {
  const part = arrangeSelectedPart(host);
  if (part === undefined) return;
  writeArrange(host, setting, (now) => withArrangePart(now, part, change), typing);
}

/** Default: the key goes (one undo step brings it back), and Free is
 * forgotten. */
export function pickArrangeDefault(host: TileSettingsHost): void {
  setArrangeFreePicked(host.uiState, host.tileId, false);
  host.endCoalesce();
  writeArrange(host, "default", () => undefined);
  host.requestUpdate();
}

/** Free: shown at once; nothing is written until a part moves. A part let
 * go before is picked again (Icon), so the stage tile can be grabbed at once. */
export function pickArrangeFree(host: TileSettingsHost): void {
  setArrangeFreePicked(host.uiState, host.tileId, true);
  if (arrangeSelectedPart(host) === undefined) setArrangePickedPart(host.uiState, host.tileId, "icon");
  host.requestUpdate();
}

/** Put every part back: the key goes, Free stays picked. */
export function putEveryPartBack(host: TileSettingsHost): void {
  setArrangeFreePicked(host.uiState, host.tileId, true);
  host.endCoalesce();
  writeArrange(host, "reset", () => undefined);
}

// ── the rows ─────────────────────────────────────────────────────────────

const PART_LABELS: [ArrangePart, string][] = [["icon", "Icon"], ["name", "Name"], ["state", "State"]];
const SCALES: [string, string][] = [["0.8", "80%"], ["1", "Normal"], ["1.2", "120%"], ["1.5", "150%"]];
const SPOT_WORDS: Readonly<Record<ArrangeSpot, string>> = {
  tl: "Top left", tc: "Top centre", tr: "Top right",
  ml: "Middle left", mc: "Middle", mr: "Middle right",
  bl: "Bottom left", bc: "Bottom centre", br: "Bottom right",
};
const PART_WORDS: Readonly<Record<ArrangePart, string>> = { icon: "icon", name: "name", state: "state" };

/** The names of the devices on the page whose app draws Default whatever is
 * stored. */
function tooOld(host: TileSettingsHost): string[] {
  return (host.pickers ?? []).filter((p) => !arrangementFor(p.version ?? null)).map((p) => p.name);
}

/** What the head's rows read: the stored arrangement, the tile's One
 * Look model, why Free cannot place it (undefined when it can), and whether
 * Free shows. */
function arrangeNow(host: TileSettingsHost): { stored: TileArrange | undefined; model: OneLookPreviewModel | undefined; block: string | undefined; free: boolean } {
  const tile = host.tile;
  const source: ArrangeFrameSource = {
    page: host.page, pages: [host.page, ...host.otherPages], device: hostDevice(host),
    states: host.hass.states as Record<string, HassEntityState>, icons: host.icons, behavior: host.behavior,
    ...(host.catalog === undefined ? {} : { catalog: host.catalog }),
  };
  const model = arrangeFrame(source, tile)?.model;
  const block = arrangeFreeBlock(model);
  return { stored: watchTileArrange(tile), model, block, free: block === undefined && arrangeFreeShown(host) };
}

/**
 * The head's rows under the live tile: Arrange (Default or Free, Free
 * greyed with the reason on a tile that cannot use it), and with Free the
 * Part being placed and that part's rows. The parts are dragged on the live
 * tile itself.
 */
export function renderArrangeHead(host: TileSettingsHost): TemplateResult {
  const { stored, model, block, free } = arrangeNow(host);
  const pick = (v: "default" | "free") => (v === "free" ? pickArrangeFree(host) : pickArrangeDefault(host));
  const arrange = segField<"default" | "free">("Arrange", free ? "free" : "default", [["default", "Default"], ["free", "Free"]], pick, {
    titles: { default: "Every part where the tile's layout puts it", free: block ?? "Move, size or hide the icon, the name and the state" },
    disabled: { free: block !== undefined },
  });
  const old = arrangementUpdateNote(tooOld(host));
  const notes = html`${block === undefined || stored === undefined ? nothing
      : html`<div class="hint keep ts-under">${block} The arrangement stored on it is kept but not drawn.</div>`}
    ${old === undefined ? nothing : html`<div class="hint warn ts-under" role="status">${old}</div>`}`;
  if (!free) {
    return html`<div class="ts-arr">${arrange}${notes}${block !== undefined && stored !== undefined
      ? html`<div class="ts-arr-foot">${resetButton("Put every part back", "Clear the stored arrangement", () => putEveryPartBack(host))}</div>`
      : nothing}</div>`;
  }
  const picked = arrangeSelectedPart(host);
  const moved = (p: ArrangePart) => stored?.parts[p] !== undefined;
  const pickPart = (p: ArrangePart | "none") => {
    setArrangePickedPart(host.uiState, host.tileId, p === "none" ? undefined : p);
    host.endCoalesce();
    host.requestUpdate();
  };
  return html`<div class="ts-arr">${arrange}${notes}${segField<ArrangePart | "none">("Part", picked ?? "none", PART_LABELS.map(([p, label]) => [p, moved(p) ? `${label} •` : label] as [ArrangePart, string]), (p) => pickPart(p), {
    titles: { icon: "The icon, with its glow or a person's photo", name: "The tile's name", state: "The state line" },
  })}${renderFreeRows(host, stored, model)}</div>`;
}

/** The rows under Free, for the part picked. */
function renderFreeRows(host: TileSettingsHost, stored: TileArrange | undefined, model: OneLookPreviewModel | undefined): TemplateResult {
  const picked = arrangeSelectedPart(host);
  if (picked === undefined) {
    return html`<div class="ts-arr-free">
      <div class="hint keep ts-under">Pick a part, or click it on the tile, then drag it there or use the arrow keys.</div>
      <div class="ts-arr-foot">${resetButton("Put every part back", "Every part back where the tile's layout puts it", () => putEveryPartBack(host))}</div>
    </div>`;
  }
  const part = picked;
  const entry = stored?.parts[part] ?? {};
  const drawn = model === undefined ? true
    : part === "icon" ? model.layout.discRect.width > 0
    : part === "name" ? model.layout.name.lines.length > 0
    : model.layout.stateRect !== undefined;
  // A spot or Native place puts the part exactly there: the move across and
  // down (what a drag on the stage writes) goes with it. Size and Show stay.
  const placeAt = (spot: ArrangeSpot | undefined) => writePart(host, "spot", (e) => {
    const { spot: _s, dx: _x, dy: _y, ...rest } = e;
    return spot === undefined ? rest : { ...rest, spot };
  });
  const nudged = (entry.dx ?? 0) !== 0 || (entry.dy ?? 0) !== 0;
  const native = entry.spot === undefined && !nudged;
  const scale = String(entry.scale ?? 1);
  const offset = (axis: "dx" | "dy") => {
    const label = axis === "dx" ? "Across" : "Down";
    const shown = typedNumber(typed(host, `arrange:${axis}`), Math.round((entry[axis] ?? 0) * 1000) / 10);
    const set = (v: number | undefined) => writePart(host, axis, (e) => ({ ...e, [axis]: v === undefined ? 0 : v / 100 }), true);
    return typingField(host, `arrange:${axis}`, numberField(label, shown, set, {
      step: 1, min: ARRANGE_OFFSET_RANGE[0] * 100, max: ARRANGE_OFFSET_RANGE[1] * 100, unit: "%", def: 0,
    }), Math.round((entry[axis] ?? 0) * 1000) / 10);
  };
  return html`<div class="ts-arr-free">
    ${drawn ? nothing : html`<div class="hint keep ts-under">This tile draws no ${PART_WORDS[part]} now; its arrangement is kept for when it does.</div>`}
    <div class="field ts-arr-spot-row"><span>Spot</span>
      <div class="ts-arr-spot-ctl">
        <div class="ts-arr-spots" role="radiogroup" aria-label=${`Spot of the ${PART_WORDS[part]}`}>
          ${ARRANGE_SPOTS.map((spot) => {
            const on = entry.spot === spot;
            const exact = on && !nudged;
            return html`<button type="button" class="ts-arr-spot ${on ? "on" : ""}" role="radio" aria-checked=${on ? "true" : "false"}
              title=${SPOT_WORDS[spot]} aria-label=${SPOT_WORDS[spot]}
              @click=${() => { if (!exact) placeAt(spot); }}><span></span></button>`;
          })}
        </div>
        <button type="button" class="pe-chip ${native ? "on" : ""}" aria-pressed=${native ? "true" : "false"}
          title=${`Back where the tile's layout puts the ${PART_WORDS[part]}`}
          @click=${() => { if (!native) placeAt(undefined); }}>Native place</button>
      </div>
    </div>
    ${segField("Size", scale, SCALES, (v) => writePart(host, "scale", (e) => ({ ...e, scale: Number(v) })), { def: "1" })}
    ${segField<"shown" | "hidden">("Show", entry.hidden === true ? "hidden" : "shown", [["shown", "Shown"], ["hidden", "Hidden"]],
      (v) => writePart(host, "hidden", (e) => ({ ...e, hidden: v === "hidden" })), { def: "shown" })}
    ${offset("dx")}${offset("dy")}
    <div class="hint ts-under">Moves the ${PART_WORDS[part]} from its spot by a share of the tile's width and height, so it lands in the same place on every watch size and the iPhone.</div>
    <div class="ts-arr-foot">${resetButton("Put every part back", "Every part back where the tile's layout puts it", () => putEveryPartBack(host))}</div>
  </div>`;
}
