// The tile inspector's head: one strip across the inspector over the four
// group columns. At its start the large live tile the page editor draws
// (with the path back to the page over it), then the tile's Name and what
// it Shows side by side, a row of short facts under them (what a tap does,
// when the tile shows, the kind's own target), and at its end Duplicate,
// Hide and Delete with how many parts hold a value of their own and Reset
// all under them.
//
// The head and the settings talk to each other. Each settings section
// stands for a part of the tile (`TILE_HEAD_PART_OF`): hovering it lights
// that part of the large tile, and a press on a part of the large tile goes
// to its section. The page editor draws the tile and its part boxes and
// wires the pointer; this module holds the words and the table.
//
// `<wa-page-editor>` puts `tileHeadStyles` in its sheet after
// `tileSettingsStyles`.

import { css, html, nothing, type TemplateResult } from "lit";
import { areaLookup } from "../editors.js";
import { type TileSettingsHost, hostDevice } from "./editor-host.js";
import { tileEntityId, tileKind, tileKindLabel, watchPagesOf } from "./model.js";
import { setWatchTileLabel, watchHoldSlideSettings, watchSingleTapSettings, watchTileIconSettings, watchTileTextSettings } from "./tile-settings-model.js";
import { watchLabelNote, watchTileFallbackName, watchTileSettingsSections } from "./tile-settings-options.js";
import { type WatchHassView, watchEntityAddFromHass, watchEntityDefaults } from "./tile-new.js";
import {
  TILE_KIND_PARTS,
  type TileInspectorPart,
  commit,
  partTitle,
  sectionSummary,
  showTileSummary,
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
  target: "tile",
  opens: "tile",
  request: "tile",
  action: "tile",
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
  if (target === null || target.closest(".ts-groups") === null) return undefined;
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

// ── the facts ────────────────────────────────────────────────────────────

/** One short fact in the head's row: its words, what it is, and the
 * section a press on it goes to. */
export interface TileHeadPill {
  label: string;
  value: string;
  part: TileInspectorPart;
}

/**
 * The facts the head lists under Name and Shows, each from the summary its
 * own section already makes: the kind's own card first ("Map: Upstairs"),
 * then what a single tap does, each hold and slide direction that holds an
 * action of its own, when the tile shows, how it looks while off, and its
 * background and border while they hold one.
 */
export function tileHeadPills(watchHost: TileSettingsHost): TileHeadPill[] {
  const host = tileWordsHost(watchHost);
  const tile = host.tile;
  const parts = tileInspectorParts(host).flatMap((g) => g.parts);
  const out: TileHeadPill[] = [];
  for (const part of parts) {
    if (!TILE_KIND_PARTS.has(part)) continue;
    // Every part of the kind's card is a settings section of its own name.
    const value = sectionSummary(host, part as Parameters<typeof sectionSummary>[1]);
    if (value !== "") out.push({ label: partTitle(host, part), value, part });
  }
  if (parts.includes("action") && host.domainStyle !== true) {
    const tap = watchSingleTapSettings(tile);
    if (tap.picker) out.push({ label: "Tap", value: tap.resolvedLabel, part: "action" });
    const slides = watchHoldSlideSettings(tile);
    if (slides.picker) {
      for (const d of slides.directions) {
        if (d.stored !== undefined) out.push({ label: `Hold ${d.direction}`, value: d.resolvedLabel, part: "action" });
      }
    }
  }
  if (parts.includes("visibility")) out.push({ label: "Shows", value: showTileSummary(host) || "Always", part: "visibility" });
  if (parts.includes("whenOff") && host.domainStyle !== true) {
    const dim = watchTileIconSettings(tile).dimWhenOff;
    if (dim.applies) out.push({ label: "Off look", value: dim.value ? "Dim" : "Keep color", part: "whenOff" });
  }
  for (const part of ["background", "border"] as const) {
    if (!parts.includes(part)) continue;
    const value = sectionSummary(host, part);
    if (value !== "") out.push({ label: partTitle(host, part), value, part });
  }
  return out;
}

/** How many of the tile's parts hold a value of their own: the count the
 * groups' headings add up to. */
export function tileHeadChangedCount(watchHost: TileSettingsHost): number {
  const host = tileWordsHost(watchHost);
  return tileInspectorParts(host)
    .flatMap((g) => g.parts)
    .filter((p) => p !== "size" && watchTileInspectorPartChanged(host, p)).length;
}

// ── the head ─────────────────────────────────────────────────────────────

/** What the page editor hands the head: what only it draws or does. */
export interface TileHeadParts {
  /** The strip's start: the path back to the page and the large tile. */
  lead: TemplateResult | typeof nothing;
  /** The actions before Delete (Duplicate, Hide). */
  actions: TemplateResult | typeof nothing;
  /** The last action (Delete). */
  remove: TemplateResult | typeof nothing;
  /** Under the facts: the group line, while the tile is in a group. */
  below?: TemplateResult | typeof nothing;
  /** Change beside what the tile shows, where the tile has another way to
   * say it (a library tile's Target). */
  change?: { title: string; go: () => void };
  /** Go to a section, for a press on one of the facts. Without it the facts
   * are words only. */
  go?: (part: TileInspectorPart) => void;
  /** The grey line at the end of the facts: which pages a change reaches
   * ("Changes apply to the Watch and iPhone pages"). */
  applies?: string;
}

/** What Shows says for a tile of Home Assistant's entity: the kind's icon,
 * the entity's friendly name, then in grey its area and its id. */
function renderEntityShown(host: TileSettingsHost, entityId: string): TemplateResult {
  const friendly = host.hass.states[entityId]?.attributes?.["friendly_name"];
  const name = typeof friendly === "string" && friendly.trim() !== "" ? friendly.trim() : undefined;
  const area = areaLookup(host.hass)?.(entityId);
  const icon = watchEntityDefaults(watchEntityAddFromHass(host.hass as unknown as WatchHassView, entityId), host.page).icon;
  const glyph = icon === undefined ? undefined : host.icons.render(icon, 16, "#a1a1aa");
  return html`<span class="ts-head-ent-nm">${glyph === undefined
    ? nothing
    : html`<svg class="ts-head-ent-ic" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">${glyph}</svg>`}${name === undefined
    ? nothing
    : html`<b title=${name}>${name}</b>`}<small>${area === undefined ? nothing : html`${area} · `}<code class="ts-head-entity" title=${entityId}>${entityId}</code></small></span>`;
}

/**
 * The tile inspector's head, one strip across the inspector that wraps on a
 * narrow one: at its start what the page editor draws (the path and the
 * large tile), in the middle the tile's Name (for a tile with a Text
 * section; empty shows the name the watch falls back to and stores no
 * label) and Shows (its entity by name, area and id), the facts under them
 * (`tileHeadPills`), and at its end the actions with how many parts are
 * changed and Reset all under them. Inside a `.ts-root`, so the editor lets
 * the name's box go when the selection moves.
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
    name = html`<div class="ts-head-f ts-head-name"><span class="ts-head-lab">Name</span>${typingField(host, "label", html`<input type="text" aria-label="Name" .value=${label}
      placeholder=${fallback} title=${watchLabelNote(tile, hostDevice(host))} ?disabled=${host.busy} @input=${(e: Event) => set((e.target as HTMLInputElement).value)} />`)}</div>`;
  }
  const shown = tileHeadHasEntity(tile)
    ? renderEntityShown(host, entityId)
    : html`<span class="ts-head-none">${entityId === "" || kind === "spacer" || kind === "divider" ? "No entity" : tileKindLabel(kind)}</span>`;
  const change = parts.change === undefined ? nothing
    : html`<button type="button" class="link ts-head-change" title=${parts.change.title} @click=${parts.change.go}>Change</button>`;
  const go = parts.go;
  const pills = tileHeadPills(host).map((p) => go === undefined
    ? html`<span class="ts-pill">${p.label}: <b>${p.value}</b></span>`
    : html`<button type="button" class="ts-pill" data-goes=${p.part} title=${`Go to ${partTitle(host, p.part)}`} @click=${() => go(p.part)}>${p.label}: <b>${p.value}</b></button>`);
  const facts = pills.length === 0 && parts.applies === undefined ? nothing
    : html`<div class="ts-head-pills">${pills}${parts.applies === undefined ? nothing : html`<span class="ts-head-applies">${parts.applies}</span>`}</div>`;
  const resettable = watchTileResettable(host);
  const n = tileHeadChangedCount(host);
  return html`<section class="ts-head ts-root" aria-label="Tile">
    <div class="ts-head-lead">${parts.lead}</div>
    <div class="ts-head-mid">
      ${name}
      <div class="ts-head-f ts-head-shows"><span class="ts-head-lab">Shows</span><div class="ts-head-ent">${shown}${change}</div></div>
      ${facts}
      ${parts.below ?? nothing}
    </div>
    <div class="ts-head-side">
      <div class="ts-head-acts" role="group" aria-label="Tile actions">
        ${parts.actions}
        ${parts.remove}
      </div>
      <div class="ts-head-changed">${n === 0 ? html`<span>Default look</span>` : html`<i aria-hidden="true"></i><span>${n} changed</span>`}
        <button type="button" class="link ts-reset-btn" ?disabled=${!resettable || host.busy}
          title=${resettable ? "Put the icon, color, text, state, border, background and arrangement back to their defaults. The name, size, tap and when it shows stay. Undo brings them back." : "The tile's look is at its defaults"}
          @click=${() => { host.endCoalesce(); commit(host, "resetTile", watchTileResetEdit(host)); }}>Reset all</button>
      </div>
    </div>
  </section>`;
}

/* The head's rules. A row, said outright: the head also wears .ts-root,
   which stands its children in a column, and in a column the parts' flex
   bases became heights. The large tile at its start, Name and Shows side
   by side with the facts across both under them, the actions at its end;
   on a narrow inspector the fields stand one over the other and the
   actions go under them in a row. */
export const tileHeadStyles = css`
  .ts-head {
    display: flex; flex-direction: row; flex-wrap: wrap; align-items: stretch; gap: 14px 18px;
    margin: 0; padding: 14px 18px; border: 1px solid var(--wa-line); border-radius: 14px; background: var(--wa-card);
  }
  .ts-head-lead { display: flex; flex-direction: column; gap: 8px; flex: 0 0 auto; min-width: 0; max-width: 240px; }
  .ts-head-mid {
    display: grid; grid-template-columns: minmax(180px, 1fr) minmax(220px, 1.4fr); gap: 8px 14px; align-content: start;
    flex: 1 1 360px; min-width: 0;
  }
  .ts-head-mid > :not(.ts-head-f) { grid-column: 1 / -1; }
  .ts-head-mid > .ts-head-shows:first-child { grid-column: 1 / -1; }
  .ts-head-side { display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; gap: 8px; flex: 0 0 auto; }
  .ts-head-f { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .ts-head-lab { font-size: 11.5px; color: var(--wa-muted); }
  .ts-head .ts-head-f .ts-typing { display: flex; flex-direction: column; flex: 1 1 auto; min-width: 0; }
  .ts-head .ts-head-f input[type=text] {
    width: 100%; min-width: 0; height: 34px; min-height: 34px; padding: 0 10px; font-size: 14px; font-weight: 500; border-radius: 8px;
    border-color: var(--wa-line-strong); background-color: var(--wa-field);
  }
  .ts-head-ent {
    display: flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 0; height: 34px; padding: 0 10px;
    border: 1px solid var(--wa-line-strong); border-radius: 8px; background: var(--wa-field);
  }
  .ts-head-ent-nm { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .ts-head-ent-ic { flex: none; }
  .ts-head-ent-nm > b { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; font-size: 13px; color: var(--wa-ink); }
  .ts-head-ent-nm > small {
    flex: 1 1 0; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    font-size: 11.5px; color: var(--wa-hint, var(--wa-muted));
  }
  .ts-head-entity { font-size: 11.5px; color: inherit; }
  .ts-head-none { font-size: 12.5px; color: var(--wa-muted); }
  button.link.ts-head-change { flex: none; padding: 2px 4px; border: 0; background: none; font: inherit; font-size: 12px; color: var(--ts-blue, var(--wa-accent)); cursor: pointer; }
  button.link.ts-head-change:hover { text-decoration: underline; text-underline-offset: 3px; }
  /* The facts: one pill each, a press goes to its section. */
  .ts-head-pills { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 2px; min-width: 0; }
  .ts-pill {
    display: inline-flex; align-items: center; gap: 5px; max-width: 100%; padding: 4px 10px;
    border: 1px solid var(--wa-line-strong); border-radius: 999px; background: var(--wa-field);
    font: inherit; font-size: 12px; color: var(--wa-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .ts-pill > b { min-width: 0; overflow: hidden; text-overflow: ellipsis; font-weight: 500; color: var(--wa-ink); }
  button.ts-pill { cursor: pointer; }
  button.ts-pill:hover { color: var(--wa-ink); border-color: var(--wa-muted); }
  button.ts-pill:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .ts-head-applies { margin-left: auto; font-size: 11.5px; color: var(--wa-hint, var(--wa-muted)); }
  .ts-head-acts { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 4px; }
  .ts-head-acts > button { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; min-height: 30px; padding: 0 10px; font-size: 12.5px; }
  .ts-head-acts > button svg.ui-icon { width: 15px; height: 15px; }
  .ts-head-changed { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
  .ts-head-changed > i { width: 6px; height: 6px; border-radius: 50%; background: var(--ts-blue, var(--wa-hue-blue, #4c8dff)); }
  button.link.ts-reset-btn {
    margin-left: 4px; padding: 2px 4px; border: 0; background: none; font: inherit; font-size: 12px;
    color: var(--ts-blue, var(--wa-hue-blue, #4c8dff)); cursor: pointer;
  }
  button.link.ts-reset-btn:hover:not(:disabled) { text-decoration: underline; text-underline-offset: 3px; }
  button.link.ts-reset-btn:disabled { opacity: .45; cursor: default; }
  @container insp (max-width: 680px) {
    .ts-head { gap: 12px; padding: 12px; }
    .ts-head-mid { grid-template-columns: minmax(0, 1fr); flex-basis: 200px; }
    .ts-head-mid > .ts-head-f { grid-column: 1 / -1; }
    .ts-head-side { flex-direction: row; flex-wrap: wrap; align-items: center; flex-basis: 100%; }
    .ts-head-applies { margin-left: 0; width: 100%; }
  }
  @container insp (max-width: 520px) {
    .ts-head-mid { flex-basis: 100%; }
  }
`;
