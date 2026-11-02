// The first row of the tile inspector's top card: the tile's Name, how many
// parts hold a value of their own with Reset all, then the tile's actions
// (Duplicate, Copy look, Paste look, Delete).
//
// The stage and the settings talk to each other. Each settings section stands
// for a part of the tile (`TILE_HEAD_PART_OF`): hovering it lights that part of
// the selected tile on the stage, and a press on a part of the selected tile
// goes to its section. The page editor draws the part boxes and wires the
// pointer; this module holds the words and the table.
//
// `<wa-page-editor>` puts `tileHeadStyles` in its sheet after
// `tileSettingsStyles`.

import { css, html, nothing, type TemplateResult } from "lit";
import { type TileSettingsHost, hostDevice } from "./editor-host.js";
import { requiredTileKeyDefault } from "./merge.js";
import { tileEntityId, tileKind, tileKindLabel, watchPagesOf } from "./model.js";
import { watchStylingReset } from "./tile-styling.js";
import { editTile, setWatchTileLabel, watchTileTextSettings } from "./tile-settings-model.js";
import { watchLabelNote, watchTileFallbackName, watchTileSettingsSections } from "./tile-settings-options.js";
import {
  type TileInspectorPart,
  commit,
  tileHeadHasEntity,
  tileInspectorParts,
  tileWordsHost,
  typed,
  typingField,
  watchTileInspectorPartChanged,
  watchTileResetEdit,
  watchTileResettable,
} from "./tile-settings.js";
import { arrangeStageParts } from "./arrange-model.js";
import { type WatchPagePreviewInput, watchTileOneLookModel } from "./preview.js";
import type { WatchPageTile } from "./model.js";
import type { OneLookRect } from "./one-look/layout.js";

// ── the parts of the large tile ──────────────────────────────────────────

/** A part of the head's large tile a settings section stands for: its
 * icon, its name, its state, its state bar, or the whole tile (its fill,
 * background, border, what a tap does, when it shows). */
export type TileHeadPart = "icon" | "name" | "state" | "bar" | "tile";

/** The parts drawn as boxes over the large tile, in drawing order: the bar
 * first, so the state over it takes a press where they overlap. */
export const TILE_HEAD_BOX_PARTS: readonly Exclude<TileHeadPart, "tile">[] = ["bar", "icon", "name", "state"];

/**
 * The part of the large tile each section of the inspector stands for.
 * The icon, its glow and its tap animation light the icon; Name the name;
 * State the state (its State bar card lights the bar, `tileHeadPartAt`);
 * the rest the whole tile.
 */
export const TILE_HEAD_PART_OF: Readonly<Record<TileInspectorPart, TileHeadPart>> = {
  removed: "tile",
  header: "tile",
  color: "tile",
  icon: "icon",
  iconLook: "icon",
  glow: "icon",
  whenOff: "tile",
  tapAnimation: "icon",
  text: "name",
  state: "state",
  visibility: "tile",
  arrange: "tile",
  size: "tile",
  background: "tile",
  border: "tile",
  phoneExtras: "tile",
  phoneTile: "tile",
  special: "tile",
  phone: "tile",
  entity: "tile",
  target: "tile",
  opens: "tile",
  request: "tile",
  action: "tile",
  tap: "tile",
};

/** The title of the State section's card that holds the state bar's rows,
 * as the styling table names its `bar` card (`tile-styling.json`). */
export const STATE_BAR_CARD_TITLE = "State bar";

/** A State card's title: its first sub heading's words. */
function cardTitle(card: Element): string | undefined {
  return card.querySelector(".ts-sub-h")?.textContent?.trim();
}

/** The State section's card of the bar's rows, inside `section`, or null. */
export function tileHeadBarCard(section: Element): HTMLElement | null {
  return [...section.querySelectorAll<HTMLElement>(".ts-group")].find((g) => cardTitle(g) === STATE_BAR_CARD_TITLE) ?? null;
}

/** Where a press on a part of the large tile goes: the first of these
 * sections the tile has, and inside it the element `within` picks, if any
 * (the State section's bar card). */
export const TILE_HEAD_GOES_TO: Readonly<Record<TileHeadPart, { sections: readonly TileInspectorPart[]; within?: (section: HTMLElement) => HTMLElement | null }>> = {
  icon: { sections: ["icon", "header"] },
  name: { sections: ["text", "header"] },
  state: { sections: ["state"] },
  bar: { sections: ["state"], within: tileHeadBarCard },
  tile: { sections: ["color", "header", "visibility"] },
};

/**
 * The part of the large tile a pointer over `target` in the inspector's
 * groups stands for: an element's own `data-tile-part`, else its section's
 * (`TILE_HEAD_PART_OF`), the bar inside the State section's bar card, else
 * the whole tile inside the kind's card. Undefined outside the groups, and
 * over a group's own title.
 */
export function tileHeadPartAt(target: Element | null): TileHeadPart | undefined {
  if (target === null || target.closest(".ts-insp") === null) return undefined;
  const own = target.closest<HTMLElement>("[data-tile-part]");
  if (own !== null) return own.dataset["tilePart"] as TileHeadPart;
  const section = target.closest<HTMLElement>(".ts-sec[data-part]");
  if (section !== null) {
    const part = TILE_HEAD_PART_OF[section.dataset["part"] as TileInspectorPart] ?? "tile";
    if (part !== "state") return part;
    const card = target.closest(".ts-group");
    return card !== null && cardTitle(card) === STATE_BAR_CARD_TITLE ? "bar" : "state";
  }
  return target.closest(".ts-kind") === null ? undefined : "tile";
}

/** The boxes of the large tile's parts, in the face's points, and how far
 * the face sits in from the cell's edge. */
export interface TileHeadPartRects {
  inset: number;
  parts: Partial<Record<Exclude<TileHeadPart, "tile">, OneLookRect>>;
}

/**
 * Where the large tile draws its icon, name, state and state bar, as One
 * Look lays it out (`arrangeStageParts` for the first three, as arranged,
 * and the layout's bar). Undefined for a tile One Look does not lay out
 * that way (a picture filling the tile, a chart, an older look): the whole
 * tile then lights for every section.
 */
export function tileHeadPartRects(tile: WatchPageTile, cell: { width: number; height: number }, input: WatchPagePreviewInput, unit: number): TileHeadPartRects | undefined {
  const stage = arrangeStageParts(tile, cell, input, unit);
  if (stage === undefined) return undefined;
  const parts: TileHeadPartRects["parts"] = { ...stage.parts };
  const bar = watchTileOneLookModel(tile, cell, input, unit)?.layout.barRect;
  if (bar !== undefined && bar.width > 0 && bar.height > 0) parts.bar = bar;
  return { inset: stage.inset, parts };
}

/** How many of the tile's parts hold a value of their own: the count the
 * groups' headings add up to. */
export function tileHeadChangedCount(watchHost: TileSettingsHost): number {
  const host = tileWordsHost(watchHost);
  return tileInspectorParts(host)
    .flatMap((g) => g.parts)
    .filter((p) => p !== "size" && watchTileInspectorPartChanged(host, p)).length;
}

// ── Copy look and Paste look ─────────────────────────────────────────────

/** Where the copied look is kept: across tiles and pages, until the editor
 * closes. */
const LOOK_COPY_KEY = "tile-settings:look-copy";

/** The look keys besides the styling tasks' own: the color, the glow and the
 * dimming, the text's look, and the layout. Never the tile's icon or photo,
 * its name, its state icons or what it does: those belong to the tile itself. */
const LOOK_KEYS: readonly string[] = [
  "color", "iconSizeOverride", "iconShadow", "iconGlow", "dimWhenOff", "activeIconAnimationEnabled", "iconTapAnimation",
  "labelFontSizeOverride", "labelFontWeight", "labelFontDesign", "labelShadow", "labelColorHex", "arrange",
];

/** Every key a look holds. */
export function watchTileLookKeys(): string[] {
  const tasks = (["state", "border", "background"] as const).flatMap((task) => Object.keys(watchStylingReset(task)));
  return [...new Set([...LOOK_KEYS, ...tasks])];
}

/** The look of a tile: each of its look keys it holds. */
export function watchTileLookOf(tile: WatchPageTile): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of watchTileLookKeys()) if (Object.hasOwn(tile, key)) out[key] = structuredClone(tile[key]);
  return out;
}

/** A tile wearing `look`: each look key set as the look has it, and one the
 * look does not hold put back. A key the phone and the watch require keeps its
 * default, since a tile without it makes both refuse the whole page. */
export function watchTileWithLook(tile: WatchPageTile, look: Readonly<Record<string, unknown>>): WatchPageTile {
  const next: WatchPageTile = { ...tile };
  for (const key of watchTileLookKeys()) {
    const required = requiredTileKeyDefault(key);
    if (Object.hasOwn(look, key)) next[key] = structuredClone(look[key]);
    else if (required !== undefined) next[key] = structuredClone(required);
    else delete next[key];
  }
  return next;
}

/** Copy look and Paste look, as two of the head's actions. */
function renderLookActions(host: TileSettingsHost): TemplateResult {
  const copied = host.uiState.get(LOOK_COPY_KEY) as Record<string, unknown> | undefined;
  const { pageId, tileId } = host;
  return html`<button type="button" class="ghost pe-strip-copy" title="Copy this tile's color, glow, text, state, border, background and layout"
      @click=${() => { host.uiState.set(LOOK_COPY_KEY, watchTileLookOf(host.tile)); host.requestUpdate(); }}>Copy look</button>
    <button type="button" class="ghost pe-strip-paste" ?disabled=${copied === undefined || host.busy} title=${copied === undefined ? "Copy a tile's look first" : "Give this tile the copied look. Its icon, name and what it does stay."}
      @click=${() => { if (copied !== undefined) { host.endCoalesce(); commit(host, "pasteLook", (d) => editTile(d, pageId, tileId, (tile) => watchTileWithLook(tile, copied))); } }}>Paste look</button>`;
}

// ── the head ─────────────────────────────────────────────────────────────

/** What the page editor hands the head: what only it draws or does. */
export interface TileHeadParts {
  /** The way back to the page's settings. */
  path?: TemplateResult | typeof nothing;
  /** The actions before Copy look (Duplicate). */
  actions: TemplateResult | typeof nothing;
  /** The last action (Delete). */
  remove: TemplateResult | typeof nothing;
  /** Under the row: the group line, while the tile is in a group. */
  below?: TemplateResult | typeof nothing;
  /** The Tile on chips, Watch and iPhone, right after the Name. */
  screens?: TemplateResult | typeof nothing;
}

/**
 * The first row of the top card: the tile's Name (for a tile with a Text
 * section; empty shows the name the watch falls back to and stores no label),
 * which devices it is on, how many parts are changed with Reset all, then the
 * actions. A tile with no
 * entity says what it is where a Name would not be. Inside a `.ts-root`, so
 * the editor lets the name's box go when the selection moves.
 */
export function renderTileHead(watchHost: TileSettingsHost, parts: TileHeadParts): TemplateResult {
  const host = tileWordsHost(watchHost);
  const tile = host.tile;
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  const named = host.domainStyle !== true && watchTileSettingsSections(tile, host.hass.states).includes("text");
  let name: TemplateResult | typeof nothing = nothing;
  if (named) {
    const fallback = watchTileFallbackName(tile, host.hass.states, watchPagesOf(host.document), host.catalog);
    const label = typed(host, "label") ?? watchTileTextSettings(tile).label ?? "";
    const set = (v: string) =>
      commit(host, "label", (d) => setWatchTileLabel(d, host.pageId, host.tileId, v, { emptyRemoves: true }), { typing: true });
    name = html`<div class="ts-head-f ts-head-name"><span class="ts-top-lab">Name</span>${typingField(host, "label", html`<input type="text" aria-label="Name" .value=${label}
      placeholder=${fallback} title=${watchLabelNote(tile, hostDevice(host))} ?disabled=${host.busy} @input=${(e: Event) => set((e.target as HTMLInputElement).value)} />`)}</div>`;
  }
  const what = tileHeadHasEntity(tile) ? nothing
    : html`<div class="ts-head-f ts-head-shows"><span class="ts-top-lab">Shows</span><span class="ts-head-none">${entityId === "" || kind === "spacer" || kind === "divider" ? "No entity" : tileKindLabel(kind)}</span></div>`;
  const resettable = watchTileResettable(host);
  const n = tileHeadChangedCount(host);
  return html`<div class="ts-head ts-root" role="group" aria-label="Tile">
    <div class="ts-head-row">
      ${parts.path === undefined ? nothing : html`<div class="ts-head-path">${parts.path}</div>`}
      ${name}${name === nothing ? what : nothing}
      ${parts.screens === undefined || parts.screens === nothing ? nothing : html`<div class="ts-head-on" data-tile-part="tile">${parts.screens}</div>`}
      <div class="ts-head-side">
        <div class="ts-head-changed">${n === 0 ? nothing : html`<i aria-hidden="true"></i><span>${n} changed</span>`}
          <button type="button" class="link ts-reset-btn" ?disabled=${!resettable || host.busy}
            title=${resettable ? "Put the icon, color, text, state, border, background and layout back to their defaults. The name, size, tap and when it shows stay. Undo brings them back." : "The tile's look is at its defaults"}
            @click=${() => { host.endCoalesce(); commit(host, "resetTile", watchTileResetEdit(host)); }}>Reset all</button>
        </div>
        <div class="ts-head-acts" role="group" aria-label="Tile actions">
          ${parts.actions}
          ${renderLookActions(host)}
          ${parts.remove}
        </div>
      </div>
    </div>
    ${parts.below ?? nothing}
  </div>`;
}

/* The head's rules: one row in the top card. */
export const tileHeadStyles = css`
  .ts-head { display: flex; flex-direction: column; gap: 8px; min-width: 0; margin: 0; padding: 0; border: 0; background: none; }
  .ts-head-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; min-width: 0; }
  .ts-head-path { flex: 1 1 100%; min-width: 0; }
  .ts-head-f { display: grid; grid-template-columns: var(--ts-top-lab) minmax(0, 1fr); align-items: center; gap: 10px; flex: 1 1 320px; min-width: 0; }
  .ts-head .ts-head-f .ts-typing { display: flex; flex-direction: column; flex: 1 1 auto; min-width: 0; }
  .ts-head .ts-head-f input[type=text] {
    width: 100%; min-width: 0; height: 36px; min-height: 36px; padding: 0 12px; font-size: 14px; font-weight: 500; border-radius: 9px;
    border-color: var(--wa-line-strong); background-color: var(--wa-field);
  }
  .ts-head-none { font-size: 13px; color: var(--wa-muted); }
  .ts-head-on { flex: none; max-width: 100%; min-width: 0; }
  .ts-head-side { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 6px 12px; margin-left: auto; }
  .ts-head-acts { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .ts-head-acts > button { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; min-height: 28px; padding: 0 10px; font-size: 12.5px; border: 1px solid var(--wa-line-strong); border-radius: 7px; }
  .ts-head-acts > button svg.ui-icon { width: 15px; height: 15px; }
  .ts-head-acts > button:disabled { opacity: .45; }
  .ts-head-changed { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
  .ts-head-changed > i { width: 6px; height: 6px; border-radius: 50%; background: var(--ts-blue, var(--wa-hue-blue, #4c8dff)); }
  button.link.ts-reset-btn {
    margin-left: 4px; padding: 2px 4px; border: 0; background: none; font: inherit; font-size: 12px;
    color: var(--ts-blue, var(--wa-hue-blue, #4c8dff)); cursor: pointer;
  }
  button.link.ts-reset-btn:hover:not(:disabled) { text-decoration: underline; text-underline-offset: 3px; }
  button.link.ts-reset-btn:disabled { opacity: .45; cursor: default; }
`;
