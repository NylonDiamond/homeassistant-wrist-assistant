// Tile groups in the inspector, the old iPhone editor's "Overlay Mode:
// Individual / Unified" and its group look (`StyleTabContent`, removed in
// app commit bbbb37b2):
//
// - With several tiles picked, the picked card ends with the Group card:
//   Make group while they are not one group (only when they touch, as the
//   phone required), or, once they are, the group's background pattern and
//   animated overlay and Ungroup.
// - With one tile of a group selected, a line under its name says so, with
//   Edit group (picks every tile of the group, so the Group card shows) and
//   Leave group (the phone's "Remove").
//
// Edits go through `commit` of `tile-settings.ts` on the host of the
// selected (primary) tile, and only through the setters of `group-model.ts`
// and `edit.ts`. The rows use the tile settings' look and its rules, which
// the page editor's sheet already carries.

import { type TemplateResult, html, nothing } from "lit";
import { colorField, sliderField } from "../editors.js";
import { uiIcon } from "../ui-icons.js";
import type { TileSettingsHost } from "./editor-host.js";
import { leaveWatchTileGroup, makeWatchTileGroup, ungroupWatchTileGroup, watchTilesAdjacent } from "./edit.js";
import {
  WATCH_GROUP_SLIDERS,
  setWatchGroupOverlay,
  setWatchGroupOverlayColor,
  setWatchGroupOverlayIntensity,
  setWatchGroupOverlaySize,
  setWatchGroupOverlaySpeed,
  setWatchGroupPattern,
  setWatchGroupPatternColor,
  setWatchGroupPatternOpacity,
  setWatchGroupPatternScale,
  watchGroupLook,
  watchGroupTileIds,
  watchSharedGroupId,
  watchTileGroup,
} from "./group-model.js";
import type { WatchPagesDocument } from "./model.js";
import { watchPageSwatchTheme } from "./page-settings-model.js";
import { watchThemeSwatches } from "./tile-new.js";
import { watchColorRefusal, watchCustomBoxColor } from "./tile-settings-options.js";
import { commit, stylingEnumField, swatchRow, typed, typingField } from "./tile-settings.js";
import type { WatchStylingSlider } from "./tile-styling.js";

/** Words the card and its tests share. */
export const WATCH_GROUP_TEXT = {
  title: "Group",
  make: "Make group",
  ungroup: "Ungroup",
  leave: "Leave group",
  edit: "Edit group",
  notAdjacent: "Tiles must touch to make a group.",
  about: "A group draws one background pattern and one animated overlay across its tiles.",
} as const;

/** What the page editor does for the group rows that change the pick. */
export interface WatchGroupActions {
  /** Pick these tiles together (a group's tiles), or select the one. */
  pick(ids: readonly string[]): void;
}

type GroupEdit<V> = (document: WatchPagesDocument, pageId: string, groupId: string, value: V) => WatchPagesDocument;

function percent(v: number): string {
  return `${Math.round(v * 100)}%`;
}

function times(v: number): string {
  return `${v.toFixed(2).replace(/0$/, "")}x`;
}

/** A slider of the group card, one undo step per drag or run of typing; its
 * dot goes back to `def`. */
function groupSlider(
  host: TileSettingsHost,
  groupId: string,
  setting: string,
  label: string,
  spec: WatchStylingSlider,
  value: number,
  def: number,
  set: GroupEdit<number>,
  format?: (v: number) => string,
): TemplateResult {
  return typingField(host, setting, sliderField(label, value, (v) => commit(host, setting, (d) => set(d, host.pageId, groupId, v), { typing: true }), {
    min: spec.min,
    max: spec.max,
    step: spec.step,
    def,
    ...(format === undefined ? {} : { format }),
  }), value);
}

/** The page theme's solid swatches and a custom box; `clear` adds the chip
 * for no color of its own. */
function groupColor(
  host: TileSettingsHost,
  setting: string,
  label: string,
  color: string | undefined,
  set: (d: WatchPagesDocument, value: string) => WatchPagesDocument,
  clear?: { label: string; title: string; write: (d: WatchPagesDocument) => WatchPagesDocument },
): TemplateResult {
  const swatches = watchThemeSwatches(watchPageSwatchTheme(host.page), false);
  const custom = (value: string | undefined): void => {
    const reason = watchColorRefusal(value);
    if (reason !== undefined || value === undefined) return commit(host, setting, (d) => d, { reason: reason ?? "Pick a color." });
    commit(host, setting, (d) => set(d, value), { typing: true });
  };
  return html`
    <div class="ts-sub-h"><span>${label}</span></div>
    <div class="ts-swatch-row">${swatchRow(label, swatches, color, (v) => commit(host, setting, (d) => set(d, v)))}</div>
    ${typingField(host, setting, html`<div class="ts-no-alpha">${colorField("Custom", typed(host, setting) ?? watchCustomBoxColor(color), custom)}</div>`)}
    ${clear === undefined ? nothing : html`<div class="ts-after">
      <button type="button" class="pe-chip ${color === undefined ? "on" : ""}" aria-pressed=${color === undefined ? "true" : "false"}
        title=${clear.title} @click=${() => commit(host, setting, clear.write)}>${clear.label}</button>
    </div>`}`;
}

/** The group's look: Pattern with its opacity, size and color, then
 * Overlay with its color, speed, intensity and size. */
function renderGroupLook(host: TileSettingsHost, groupId: string): TemplateResult | typeof nothing {
  const group = watchTileGroup(host.page, groupId);
  if (group === undefined) return nothing;
  const g = watchGroupLook(group);
  const pid = host.pageId;
  const key = (s: string) => `group:${groupId.toUpperCase()}:${s}`;
  return html`
    <div class="ts-sub-h"><span>Background pattern</span></div>
    ${stylingEnumField("Pattern", "backgroundPattern", g.pattern, (v) => commit(host, key("pattern"), (d) => setWatchGroupPattern(d, pid, groupId, v)))}
    ${g.pattern === "none" ? nothing : html`
      ${groupSlider(host, groupId, key("patternOpacity"), "Opacity", WATCH_GROUP_SLIDERS.patternOpacity, g.patternOpacity, g.patternColor === undefined ? 1 : 0.5, setWatchGroupPatternOpacity, percent)}
      ${groupSlider(host, groupId, key("patternScale"), "Size", WATCH_GROUP_SLIDERS.patternScale, g.patternScale, 1, setWatchGroupPatternScale, times)}
      ${groupColor(host, key("patternColor"), "Pattern color", g.patternColor,
        (d, v) => setWatchGroupPatternColor(d, pid, groupId, v),
        { label: "Default gray", title: "No color of its own: the watch draws the pattern in gray", write: (d) => setWatchGroupPatternColor(d, pid, groupId, null) })}`}
    <div class="ts-sub-h"><span>Animated overlay</span></div>
    ${stylingEnumField("Overlay", "tileAnimation", g.overlay, (v) => commit(host, key("overlay"), (d) => setWatchGroupOverlay(d, pid, groupId, v)))}
    ${g.overlay === "none" ? nothing : html`
      ${groupColor(host, key("overlayColor"), "Overlay color", g.overlayColor, (d, v) => setWatchGroupOverlayColor(d, pid, groupId, v))}
      ${groupSlider(host, groupId, key("overlaySpeed"), "Speed", WATCH_GROUP_SLIDERS.overlaySpeed, g.overlaySpeed, 1, setWatchGroupOverlaySpeed, times)}
      ${groupSlider(host, groupId, key("overlayIntensity"), "Intensity", WATCH_GROUP_SLIDERS.overlayIntensity, g.overlayIntensity, 1, setWatchGroupOverlayIntensity, times)}
      ${groupSlider(host, groupId, key("overlaySize"), "Size", WATCH_GROUP_SLIDERS.overlaySize, g.overlaySize, 1, setWatchGroupOverlaySize, times)}`}`;
}

/**
 * The Group card under the picked tiles. `host` is the primary picked
 * tile's. While the picked tiles share a group: its look and Ungroup. Else
 * Make group, refused with a note while they do not touch.
 */
export function renderPickedGroupCard(host: TileSettingsHost, ids: readonly string[], actions: WatchGroupActions): TemplateResult {
  const page = host.page;
  const shared = watchSharedGroupId(page, ids);
  const head = (sum: string) => html`<div class="sec-h pinned">
      <span class="swatch">${uiIcon("folder")}</span>
      <span class="tt"><h4>${WATCH_GROUP_TEXT.title}</h4><span class="sum">${sum}</span></span>
    </div>`;
  if (shared !== undefined) {
    const count = watchGroupTileIds(page, shared).length;
    const more = count > ids.length;
    return html`<section class="sec pe-group" data-open="true" data-help="on" style="--c: var(--wa-accent)">
      ${head(`${count} tiles`)}
      <div class="sec-b">
        <fieldset class="ts-body" ?disabled=${host.busy} aria-label=${WATCH_GROUP_TEXT.title}>
          ${renderGroupLook(host, shared)}
        </fieldset>
        <div class="pe-picked-acts">
          ${more ? html`<button class="pe-btn pe-group-all" title="Pick every tile of this group"
            @click=${() => actions.pick(watchGroupTileIds(host.page, shared))}>${uiIcon("layers")}<span>Pick all ${count}</span></button>` : nothing}
          <button class="pe-btn pe-group-ungroup" ?disabled=${host.busy} title="Every tile leaves the group and keeps its own look"
            @click=${() => commit(host, "group:ungroup", (d) => ungroupWatchTileGroup(d, host.pageId, shared))}>
            ${uiIcon("ungroup")}<span>${WATCH_GROUP_TEXT.ungroup}</span></button>
        </div>
      </div>
    </section>`;
  }
  const adjacent = watchTilesAdjacent(page, ids);
  return html`<section class="sec pe-group" data-open="true" data-help="on" style="--c: var(--wa-accent)">
    ${head("None")}
    <div class="sec-b">
      <p class="hint">${WATCH_GROUP_TEXT.about}</p>
      <div class="pe-picked-acts">
        <button class="pe-btn pe-group-make" ?disabled=${!adjacent || host.busy} title=${adjacent ? `Make one group of these ${ids.length} tiles` : WATCH_GROUP_TEXT.notAdjacent}
          @click=${() => commit(host, "group:make", (d) => makeWatchTileGroup(d, host.pageId, ids).document)}>
          ${uiIcon("folder")}<span>${WATCH_GROUP_TEXT.make}</span></button>
      </div>
      ${adjacent ? nothing : html`<p class="hint">${WATCH_GROUP_TEXT.notAdjacent}</p>`}
    </div>
  </section>`;
}

/** The line under a grouped tile's name: how many tiles share its group,
 * Edit group and Leave group. Nothing for a tile in no group the page has. */
export function renderTileGroupLine(host: TileSettingsHost, actions: WatchGroupActions): TemplateResult | typeof nothing {
  const groupId = host.tile.groupId;
  if (typeof groupId !== "string" || watchTileGroup(host.page, groupId) === undefined) return nothing;
  const count = watchGroupTileIds(host.page, groupId).length;
  // Each button is a template of its own.
  const edit = html`<button type="button" class="link ts-link pe-group-edit" title="Pick every tile of the group to edit its look"
      @click=${() => actions.pick(watchGroupTileIds(host.page, groupId))}>${WATCH_GROUP_TEXT.edit}</button>`;
  const leave = html`<button type="button" class="link ts-link pe-group-leave" ?disabled=${host.busy}
      title=${count <= 2 ? "This tile leaves the group. The other tile keeps the group's look and the group goes." : "This tile leaves the group"}
      @click=${() => commit(host, "group:leave", (d) => leaveWatchTileGroup(d, host.pageId, host.tileId))}>${WATCH_GROUP_TEXT.leave}</button>`;
  return html`<div class="pe-group-line" role="group" aria-label=${WATCH_GROUP_TEXT.title}>
    <span class="pe-group-words">${uiIcon("folder")}<span>In a group of ${count} tiles</span></span>
    ${edit}${leave}
  </div>`;
}
