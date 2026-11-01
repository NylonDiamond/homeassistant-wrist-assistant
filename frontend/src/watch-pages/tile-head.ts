// The tile inspector's head, over the groups: the path back to the page, the
// large live tile the page editor draws with the tile's Name beside it, a row
// of short facts as links to their settings (what a tap does, what the tile
// shows, the kind's own target), then Duplicate, Hide and Delete with how many
// parts hold a value of their own and Reset all at their end.
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
import { uiIcon } from "../ui-icons.js";
import { type TileSettingsHost, hostDevice } from "./editor-host.js";
import { tileEntityId, tileKind, tileKindLabel, watchPagesOf } from "./model.js";
import { setWatchTileLabel, watchHoldSlideSettings, watchSingleTapSettings, watchTileIconSettings, watchTileTextSettings } from "./tile-settings-model.js";
import { watchLabelNote, watchTileFallbackName, watchTileSettingsSections } from "./tile-settings-options.js";
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
  entity: "tile",
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
 * The facts the head lists under Name, each a link to its setting, each from
 * the summary its own section already makes: the kind's own card first ("Map:
 * Upstairs"), then what a single tap does, each hold and slide direction that
 * holds an action of its own, the entity the tile shows, when it shows if not
 * always, how a light looks while off (only a light has an off look worth
 * naming, so a lock is not told about it), and its background and border while
 * they hold one.
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
  if (parts.includes("entity")) out.push({ label: "Shows", value: tileEntityId(tile), part: "entity" });
  if (parts.includes("visibility")) {
    const rule = showTileSummary(host);
    if (rule !== "") out.push({ label: "Shows when", value: rule, part: "visibility" });
  }
  if (parts.includes("whenOff") && host.domainStyle !== true && tileKind(tileEntityId(tile)) === "light") {
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
  /** The first line: the path back to the page. */
  path?: TemplateResult | typeof nothing;
  /** The large tile, beside the Name. */
  lead: TemplateResult | typeof nothing;
  /** The actions before Delete (Duplicate, Hide). */
  actions: TemplateResult | typeof nothing;
  /** The last action (Delete). */
  remove: TemplateResult | typeof nothing;
  /** Right under the Name, over the facts: the page editor's "Tile on"
   * Watch and iPhone chips, or the question that stands in for them. */
  screens?: TemplateResult | typeof nothing;
  /** Under the facts: the group line, while the tile is in a group. */
  below?: TemplateResult | typeof nothing;
  /** Go to a section, for a press on one of the facts. Without it the facts
   * are words only. */
  go?: (part: TileInspectorPart) => void;
}

/**
 * The tile inspector's head: the path back to the page; the large tile with
 * the tile's Name beside it (for a tile with a Text section; empty shows the
 * name the watch falls back to and stores no label) and the screens it is on
 * under the Name; the facts as links to their settings (`tileHeadPills`, an
 * arrow on each says it goes somewhere); then the actions, with how many parts are
 * changed and Reset all at their end. A tile with no entity says what it is
 * where a Name would not be. Inside a `.ts-root`, so the editor lets the
 * name's box go when the selection moves.
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
  const what = tileHeadHasEntity(tile) ? nothing
    : html`<div class="ts-head-f ts-head-shows"><span class="ts-head-lab">Shows</span><span class="ts-head-none">${entityId === "" || kind === "spacer" || kind === "divider" ? "No entity" : tileKindLabel(kind)}</span></div>`;
  const go = parts.go;
  const pills = tileHeadPills(host).map((p) => {
    const value = p.part === "entity" ? html`<b class="ts-pill-id">${p.value}</b>` : html`<b>${p.value}</b>`;
    return go === undefined
      ? html`<span class="ts-pill">${p.label}: ${value}</span>`
      : html`<button type="button" class="ts-pill ts-pill-link" data-goes=${p.part} title=${`Go to ${partTitle(host, p.part)}`} @click=${() => go(p.part)}>${p.label}: ${value}${uiIcon("arrow")}</button>`;
  });
  const facts = pills.length === 0 ? nothing : html`<div class="ts-head-pills">${pills}</div>`;
  const resettable = watchTileResettable(host);
  const n = tileHeadChangedCount(host);
  return html`<section class="ts-head ts-root" aria-label="Tile">
    ${parts.path === undefined ? nothing : html`<div class="ts-head-path">${parts.path}</div>`}
    <div class="ts-head-row">
      <div class="ts-head-lead">${parts.lead}</div>
      <div class="ts-head-mid">${name}${what}${parts.screens ?? nothing}</div>
    </div>
    ${facts}
    ${parts.below ?? nothing}
    <div class="ts-head-side">
      <div class="ts-head-acts" role="group" aria-label="Tile actions">
        ${parts.actions}
        ${parts.remove}
      </div>
      <div class="ts-head-changed">${n === 0 ? nothing : html`<i aria-hidden="true"></i><span>${n} changed</span>`}
        <button type="button" class="link ts-reset-btn" ?disabled=${!resettable || host.busy}
          title=${resettable ? "Put the icon, color, text, state, border, background and arrangement back to their defaults. The name, size, tap and when it shows stay. Undo brings them back." : "The tile's look is at its defaults"}
          @click=${() => { host.endCoalesce(); commit(host, "resetTile", watchTileResetEdit(host)); }}>Reset all</button>
      </div>
    </div>
  </section>`;
}

/* The head's rules: one column of rows over the groups. The path; the large
   tile with the Name and the screens beside it; the facts; the actions with
   Reset all at their end. */
export const tileHeadStyles = css`
  .ts-head {
    gap: 10px; margin: 0; padding: 12px 14px; border: 1px solid var(--wa-line); border-radius: 14px; background: var(--wa-card);
  }
  .ts-head-path { min-width: 0; }
  .ts-head-row { display: flex; align-items: flex-end; gap: 12px; min-width: 0; }
  .ts-head-lead { flex: none; min-width: 0; max-width: 240px; }
  .ts-head-mid { display: flex; flex-direction: column; gap: 8px; flex: 1 1 0; min-width: 0; max-width: 420px; }
  .ts-head-side { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; }
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
  /* The facts: one link each, in the panel's link blue with its value
     underlined and an arrow, since a press jumps to its setting. */
  .ts-head-pills { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
  .ts-pill {
    display: inline-flex; align-items: center; gap: 5px; max-width: 100%; height: 26px; padding: 0 9px;
    border: 1px solid var(--wa-line-strong); border-radius: 13px; background: var(--wa-field);
    font: inherit; font-size: 12px; color: var(--wa-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .ts-pill > b { min-width: 0; overflow: hidden; text-overflow: ellipsis; font-weight: 600; color: var(--wa-ink); }
  .ts-pill > b.ts-pill-id { font-family: monospace; font-size: 11.5px; }
  .ts-pill > svg.ui-icon { flex: none; width: 12px; height: 12px; }
  button.ts-pill-link {
    border-color: color-mix(in srgb, var(--wa-hue-blue, #4c8dff) 40%, transparent);
    background: color-mix(in srgb, var(--wa-hue-blue, #4c8dff) 9%, transparent);
    color: color-mix(in srgb, var(--wa-hue-blue, #4c8dff) 70%, var(--wa-ink)); cursor: pointer;
  }
  button.ts-pill-link > b { text-decoration: underline; text-decoration-color: color-mix(in srgb, var(--wa-hue-blue, #4c8dff) 50%, transparent); text-underline-offset: 3px; }
  button.ts-pill-link:hover { background: color-mix(in srgb, var(--wa-hue-blue, #4c8dff) 16%, transparent); }
  button.ts-pill-link:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .ts-head-acts { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
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
`;
