// The menu inspector's pictures and the cards built from them: the Anywhere
// menu's Look and Motion, the page switcher's Look, the Entity quick menu's
// type tiles, a slot's action tiles and its Where grid. `menu-view.ts` lays
// the cards out and owns which one shows; this file draws their insides.
//
// The pictures follow the status page editor's look pickers
// (`watch-status-pages/view.ts`, `pictureGroup`): a titled group of buttons,
// each a small drawing on the watch's black with its name under it, the pick
// a neutral raised fill and a stronger line. The drawings use only the
// panel's watch art tokens (`--wa-art-*`), as theirs do; the one hue a slot
// brings is its own color, which is data.
//
// Every control writes the same key, in the same range, as the Style card it
// replaced did: this is how the settings are shown, not what they are.

import { css, html, nothing, svg, type TemplateResult } from "lit";
import { checkField, colorField, segField, selectField, settingTitle, sliderField } from "../editors.js";
import type { IconProvider } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";
import {
  type MenuStyleField,
  type MenuStyleSection,
  type MenusDocument,
  setWatchMenuStyle,
  watchMenuEnumChoices,
  watchMenuStyleFields,
  watchMenuStyleShown,
  watchMenuStyleValue,
} from "./model.js";

/** What the style cards read and write through. */
export interface MenuStyleHost {
  readonly document: MenusDocument;
  edit(change: (document: MenusDocument) => MenusDocument, coalesce?: string): boolean;
}

// ── shared pieces ────────────────────────────────────────────────────────

/**
 * A group of picture buttons under its title, which carries the reset dot
 * back to `def`. `draw` is each choice's picture; the name is drawn under
 * it. A pick already on writes nothing.
 */
export function pictureGroup<T extends string>(
  title: string,
  value: T,
  def: T | undefined,
  choices: readonly (readonly [T, string])[],
  draw: (value: T) => TemplateResult,
  set: (v: T) => void,
  cls = "",
): TemplateResult {
  const nameOf = (v: T) => choices.find(([o]) => o === v)?.[1] ?? v;
  return html`<div class="mi-look">
    <div class="mi-look-title">${settingTitle(title, value, def, (v) => set(v), nameOf)}</div>
    <div class="mi-pics ${cls}" role="group" aria-label=${title} style=${`--n:${choices.length}`}>
      ${choices.map(([v, name]) => {
        const on = v === value;
        return html`<button type="button" class="mi-pic ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} aria-label=${`${title}: ${name}`}
          @click=${() => { if (v !== value) set(v); }}>${draw(v)}<span class="mi-pic-name">${name}</span></button>`;
      })}
    </div>
  </div>`;
}

/** A switch with a line under its title saying what it does. */
export function switchRow(label: string, value: boolean, set: (v: boolean) => void, def: boolean | undefined, hint: string): TemplateResult {
  return html`<div class="mi-switch">${checkField(label, value, set, def)}<div class="hint mi-switch-hint">${hint}</div></div>`;
}

/** A segmented control whose buttons wrap their words rather than clip them. */
function wrapSeg(row: TemplateResult): TemplateResult {
  return html`<div class="mi-wrap">${row}</div>`;
}

function field(section: MenuStyleSection, key: string): MenuStyleField | undefined {
  return watchMenuStyleFields(section).find((f) => f.key === key);
}

function sameValue(a: unknown, b: unknown): boolean {
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) < 1e-9;
  if (typeof a === "string" && typeof b === "string") return a.toUpperCase() === b.toUpperCase();
  return a === b;
}

/** Whether any of `keys` that is drawn reads other than its default: a
 * card's changed dot, the same rule as its rows' reset dots. */
export function menuStyleKeysChanged(document: MenusDocument, section: MenuStyleSection, keys: readonly string[]): boolean {
  return watchMenuStyleFields(section).some((f) => keys.includes(f.key) && watchMenuStyleShown(document, section, f)
    && !sameValue(watchMenuStyleValue(document, section, f), f.default));
}

/** One style key as a card reads and writes it. */
interface StyleKey {
  field: MenuStyleField;
  value: unknown;
  /** `typing` holds a run of edits (a slider's drag) as one undo step. */
  set: (v: unknown, typing?: boolean) => void;
}

function styleKey(host: MenuStyleHost, section: MenuStyleSection, key: string): StyleKey | undefined {
  const f = field(section, key);
  if (f === undefined) return undefined;
  const coalesce = `style:${section}:${key}`;
  return {
    field: f,
    value: watchMenuStyleValue(host.document, section, f),
    set: (v, typing = false) => host.edit((d) => setWatchMenuStyle(d, section, key, v), typing ? coalesce : undefined),
  };
}

function numberOf(k: StyleKey): number {
  return typeof k.value === "number" ? k.value : Number(k.field.default);
}

function slider(label: string, k: StyleKey | undefined): TemplateResult | typeof nothing {
  if (k === undefined) return nothing;
  return sliderField(label, numberOf(k), (v) => k.set(v, true), {
    min: k.field.min ?? 0,
    max: k.field.max ?? 1,
    step: k.field.step ?? 0.01,
    def: Number(k.field.default),
  });
}

/** A bool key as two pictures, off first. */
function boolPictures(title: string, k: StyleKey | undefined, names: readonly [string, string], draw: (on: boolean) => TemplateResult): TemplateResult | typeof nothing {
  if (k === undefined) return nothing;
  const value = k.value === true ? "on" : "off";
  const def = k.field.default === true ? "on" : "off";
  return pictureGroup(title, value, def, [["off", names[0]], ["on", names[1]]] as const, (v) => draw(v === "on"), (v) => k.set(v === "on"));
}

// ── the Anywhere menu's Look ─────────────────────────────────────────────

/** The style keys the Anywhere menu's Look card holds; Motion has the rest. */
export const ANYWHERE_LOOK_KEYS: readonly string[] = ["showIconBubble", "backgroundDim", "showNeonOutline", "showContextLabel", "glowIntensity"];
export const ANYWHERE_MOTION_KEYS: readonly string[] = ["entranceStyle", "beamStyle", "beamColor", "beamIntensity", "showFingerShadow"];

/** How dark's three steps, by value. The table names the first Subtle. */
const DIM_NAMES: readonly [number, string][] = [[0.4, "Light"], [0.65, "Medium"], [1, "Full"]];

/** The tiny watch behind "Behind the ring": tiles of the screen under the
 * ring, a veil over them (solid, or frosted glass), and three slot dots. */
function backdropPicture(glass: boolean): TemplateResult {
  return html`<span class="mi-well mi-backdrop ${glass ? "glass" : ""}" aria-hidden="true">
    <span class="mi-tiles"><i></i><i></i><i></i><i></i></span><span class="mi-veil"></span>
    <span class="mi-ring"><i></i><i></i><i></i></span>
  </span>`;
}

/** The ring's buttons, plain or with the neon line. */
function buttonsPicture(neon: boolean): TemplateResult {
  return html`<span class="mi-well mi-buttons ${neon ? "neon" : ""}" aria-hidden="true"><i></i><i></i><i></i></span>`;
}

/** "How dark": the three steps, none lit for a value between them, then the
 * slider for any value in the range. */
function dimRows(k: StyleKey | undefined): TemplateResult | typeof nothing {
  if (k === undefined) return nothing;
  const n = numberOf(k);
  const presets: [string, string][] = (k.field.presets ?? DIM_NAMES.map(([value, label]) => ({ value, label })))
    .map((p) => [String(p.value), DIM_NAMES.find(([v]) => sameValue(v, p.value))?.[1] ?? p.label]);
  const lit = presets.find(([v]) => sameValue(Number(v), n))?.[0] ?? "";
  return html`${segField("How dark", lit, presets, (v) => k.set(Number(v)), { def: String(k.field.default) })}
    ${slider("Exact", k)}`;
}

export function renderAnywhereLookBody(host: MenuStyleHost): TemplateResult {
  const key = (k: string) => styleKey(host, "quickAction", k);
  const labels = key("showContextLabel");
  return html`
    ${boolPictures("Behind the ring", key("showIconBubble"), ["Solid", "Glass"], backdropPicture)}
    ${dimRows(key("backgroundDim"))}
    ${boolPictures("Buttons", key("showNeonOutline"), ["Plain", "Neon"], buttonsPicture)}
    ${labels === undefined ? nothing : switchRow("Names under the buttons", labels.value === true, (v) => labels.set(v), labels.field.default === true,
      "Each slot's name shows under its button.")}
    ${slider("Glow", key("glowIntensity"))}`;
}

export function anywhereLookSummary(document: MenusDocument): string {
  const read = (k: string) => {
    const f = field("quickAction", k);
    return f === undefined ? undefined : watchMenuStyleValue(document, "quickAction", f);
  };
  return `${read("showIconBubble") === true ? "Glass" : "Solid"}, ${read("showNeonOutline") === true ? "Neon" : "Plain"} buttons`;
}

// ── the Anywhere menu's Motion ───────────────────────────────────────────

/** The beam pictures' order: None first, then the table's. */
function beamChoices(): [string, string][] {
  const all = watchMenuEnumChoices("BeamStyle");
  return [...all.filter(([v]) => v === "none"), ...all.filter(([v]) => v !== "none")];
}

/**
 * A beam between the finger (the centre dot, left) and a slot (the ring
 * dot, right), drawn as the watch draws each style: a wedge, a soft wash, a
 * bloom round the slot, rings rippling out from it, a wave in its wake.
 */
export function beamPicture(style: string): TemplateResult {
  let beam = svg``;
  switch (style) {
    case "sectorWedge":
      beam = svg`<path class="b soft" d="M9 14 L33 5 A10 10 0 0 1 33 23 Z" />`;
      break;
    case "auroraWash":
      beam = svg`<path class="b faint" d="M9 14 C17 4 25 4 33 14 C25 24 17 24 9 14 Z" /><path class="b soft" d="M9 14 C18 9 25 9 33 14 C25 19 18 19 9 14 Z" />`;
      break;
    case "radiantBloom":
      beam = svg`<circle class="b faint" cx="33" cy="14" r="9" /><circle class="b soft" cx="33" cy="14" r="6" /><path class="l" d="M9 14 H27" />`;
      break;
    case "ripplePulse":
      beam = svg`<circle class="r" cx="33" cy="14" r="6" /><circle class="r faint" cx="33" cy="14" r="9.5" /><path class="l dash" d="M9 14 H26" />`;
      break;
    case "wakeWave":
      beam = svg`<path class="l" d="M9 14 Q13 8 17 14 T25 14 T33 14" /><path class="l faint" d="M9 17 Q13 11 17 17 T25 17 T33 17" />`;
      break;
  }
  return html`<span class="mi-well mi-beam" aria-hidden="true"><svg viewBox="0 0 42 28" width="42" height="28">
    ${beam}<circle class="dot" cx="9" cy="14" r="2.6" /><circle class="dot" cx="33" cy="14" r="3.4" />
  </svg></span>`;
}

function beamColorRows(host: MenuStyleHost, k: StyleKey | undefined): TemplateResult | typeof nothing {
  if (k === undefined || !watchMenuStyleShown(host.document, "quickAction", k.field)) return nothing;
  const hex = typeof k.value === "string" ? k.value : String(k.field.default);
  const swatches = k.field.swatches;
  return html`<div class="ts-no-alpha">${colorField("Beam color", hex, (v) => { if (v !== undefined) k.set(v, true); }, false, String(k.field.default))}</div>
    ${swatches === undefined ? nothing : html`<div class="ts-swatch-row"><div class="ts-swatches" role="group" aria-label="Beam color">
      ${swatches.map((s) => {
        const on = s.toUpperCase() === hex.toUpperCase();
        return html`<button type="button" class="ts-swatch ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} title=${s} aria-label=${s}
          style=${`--sw:${s}`} @click=${() => k.set(s)}></button>`;
      })}</div></div>`}`;
}

export function renderAnywhereMotionBody(host: MenuStyleHost): TemplateResult {
  const key = (k: string) => styleKey(host, "quickAction", k);
  const entrance = key("entranceStyle");
  const beam = key("beamStyle");
  const intensity = key("beamIntensity");
  const shadow = key("showFingerShadow");
  return html`
    ${entrance === undefined ? nothing : wrapSeg(segField("Opening", String(entrance.value), watchMenuEnumChoices("EntranceStyle"),
      (v) => entrance.set(v), { def: String(entrance.field.default) }))}
    ${beam === undefined ? nothing : pictureGroup("Beam from your finger to the slot", String(beam.value), String(beam.field.default), beamChoices(),
      beamPicture, (v) => beam.set(v), "beams")}
    ${beamColorRows(host, key("beamColor"))}
    ${intensity === undefined || !watchMenuStyleShown(host.document, "quickAction", intensity.field) ? nothing : slider("Beam strength", intensity)}
    ${shadow === undefined ? nothing : switchRow("Finger shadow", shadow.value === true, (v) => shadow.set(v), shadow.field.default === true,
      "A soft dark spot where your finger rests.")}`;
}

export function anywhereMotionSummary(document: MenusDocument): string {
  const read = (k: string) => {
    const f = field("quickAction", k);
    return f === undefined ? "" : String(watchMenuStyleValue(document, "quickAction", f));
  };
  const name = (e: string, v: string) => watchMenuEnumChoices(e).find(([o]) => o === v)?.[1] ?? v;
  const beam = read("beamStyle");
  return `Opening ${name("EntranceStyle", read("entranceStyle")).toLowerCase()}, ${beam === "none" ? "no beam" : `${name("BeamStyle", beam).toLowerCase()} beam`}`;
}

// ── the page switcher's Look ─────────────────────────────────────────────

export const SWITCHER_LOOK_KEYS: readonly string[] = ["glowIntensity", "selectedScale"];

/** A scale as the percent its box shows: 1.2 is 120. */
function scalePercent(v: number): number {
  return Math.round(v * 1000) / 10;
}

export function renderSwitcherLookBody(host: MenuStyleHost): TemplateResult {
  const glow = styleKey(host, "pageSwitcher", "glowIntensity");
  const size = styleKey(host, "pageSwitcher", "selectedScale");
  return html`${slider("Glow", glow)}
    ${size === undefined ? nothing : sliderField("Picked page size", scalePercent(numberOf(size)), (p) => size.set(Math.round(p * 100) / 10000, true), {
      min: scalePercent(size.field.min ?? 1),
      max: scalePercent(size.field.max ?? 1.5),
      step: scalePercent(size.field.step ?? 0.05),
      def: scalePercent(Number(size.field.default)),
      unit: "%",
      format: (p) => `${Math.round(p)}%`,
    })}`;
}

export function switcherLookSummary(document: MenusDocument): string {
  const f = field("pageSwitcher", "selectedScale");
  const v = f === undefined ? undefined : watchMenuStyleValue(document, "pageSwitcher", f);
  return typeof v === "number" ? `Picked page ${Math.round(scalePercent(v))}%` : "";
}

// ── icons on the watch's black ───────────────────────────────────────────

function glyph(icons: IconProvider, icon: string, size: number, color: string): TemplateResult {
  return icons.render(icon, size, color) ?? html`<span class="mi-glyph-dot" style=${`background:${color}`}></span>`;
}

// ── the Entity quick menu's types ────────────────────────────────────────

/** The six types the Which menu card draws as tiles; the rest are in the
 * More types list. */
export const MENU_TYPE_TILES: readonly string[] = ["light", "switch", "lock", "cover", "climate", "media_player"];

/** A type tile's name where the table's short one would not read well. */
const TYPE_TILE_NAMES: Readonly<Record<string, string>> = { media_player: "Media player" };

export interface MenuTypeChoice {
  domain: string;
  label: string;
  icon: string;
  color: string;
}

/** The type tiles, then the More types list holding every type, which shows
 * the picked one when it is not a tile. */
export function typeTiles(icons: IconProvider, picked: string, tiles: readonly MenuTypeChoice[], all: readonly [string, string][], pick: (domain: string) => void): TemplateResult {
  const inTiles = tiles.some((t) => t.domain === picked);
  const options: [string, string][] = inTiles ? [["", "Pick another type"], ...all] : [...all];
  return html`<div class="mi-pics mi-types" role="group" aria-label="Types">
      ${tiles.map((t) => {
        const on = t.domain === picked;
        const name = TYPE_TILE_NAMES[t.domain] ?? t.label;
        return html`<button type="button" class="mi-pic mi-type ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} data-type=${t.domain}
          @click=${() => { if (!on) pick(t.domain); }}><span class="mi-icon-well" aria-hidden="true">${glyph(icons, t.icon, 16, t.color)}</span><span class="mi-pic-name">${name}</span></button>`;
      })}
    </div>
    ${selectField("More types", inTiles ? "" : picked, options, (v) => { if (v !== "" && v !== picked) pick(v); }, { snapBack: true })}`;
}

// ── a slot's action tiles ────────────────────────────────────────────────

export interface MenuActionTile {
  raw: string;
  label: string;
  icon: string;
  color: string;
  /** Why it cannot be picked now. */
  why?: string;
}

export interface MenuActionTileGroup {
  heading: string;
  tiles: MenuActionTile[];
}

/** The actions as tiles, two across, under their headings; the current one
 * lit, one that cannot be picked now greyed out with the reason under its
 * name. */
export function actionTiles(icons: IconProvider, current: string, groups: readonly MenuActionTileGroup[], pick: (raw: string) => void): TemplateResult {
  return html`<div class="mi-acts">${groups.map((g) => html`<div class="mi-act-group" role="group" aria-label=${g.heading}>
    <div class="mi-act-h">${g.heading}</div>
    <div class="mi-act-grid">${g.tiles.map((t) => {
      const on = t.raw === current;
      const off = !on && t.why !== undefined;
      return html`<button type="button" class="mi-act ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} ?disabled=${off} data-action=${t.raw}
        title=${t.why ?? nothing} @click=${() => { if (!on) pick(t.raw); }}>
        <span class="mi-icon-well" aria-hidden="true">${glyph(icons, t.icon, 14, t.color)}</span>
        <span class="mi-act-t"><span class="mi-act-name">${t.label}</span>
          ${t.why === undefined || on ? nothing : html`<small class="mi-act-why">${t.why}</small>`}</span>
      </button>`;
    })}</div>
  </div>`)}</div>`;
}

// ── a slot's place ───────────────────────────────────────────────────────

/** One place around the ring as the Where grid draws it. */
export interface MenuWhereCell {
  position: string;
  /** The place's name, "Top right". */
  label: string;
  /** This slot is here. */
  here: boolean;
  /** The other slot at this place, by name and look. */
  holder?: { name: string; icon: string; color: string };
}

/** The grid's rows: the eight places around the centre, as on the watch. */
const WHERE_ROWS: readonly (readonly (string | null)[])[] = [
  ["topLeft", "topCenter", "topRight"],
  ["leftCenter", null, "rightCenter"],
  ["bottomLeft", "bottomCenter", "bottomRight"],
];

/** A cell's words for a screen reader: the place, then what a click does. */
export function whereCellLabel(cell: MenuWhereCell): string {
  if (cell.here) return cell.holder === undefined ? `${cell.label}, here now` : `${cell.label}, here now, shared with ${cell.holder.name}`;
  return cell.holder === undefined ? `${cell.label}, move here` : `${cell.label}, swap with ${cell.holder.name}`;
}

/**
 * The ring as a 3 by 3 picture on the watch's black: the finger in the
 * centre, and each place a round cell. The slot's own place is outlined in
 * its color with its icon; a place another slot holds shows that slot's
 * icon, dimmed; a free one is dashed with a plus. A click moves the slot.
 */
export function whereGrid(icons: IconProvider, slot: { icon: string; color: string }, cells: readonly MenuWhereCell[], move: (position: string) => void): TemplateResult {
  const byPlace = new Map(cells.map((c) => [c.position, c]));
  const cell = (position: string | null) => {
    if (position === null) return html`<span class="mi-where-finger" aria-hidden="true"><i></i></span>`;
    const c = byPlace.get(position);
    if (c === undefined) return html`<span class="mi-where-cell" aria-hidden="true"></span>`;
    const kind = c.here ? "here" : c.holder === undefined ? "free" : "held";
    const inner = c.here ? glyph(icons, slot.icon, 14, slot.color)
      : c.holder === undefined ? uiIcon("plus") : glyph(icons, c.holder.icon, 13, c.holder.color);
    return html`<button type="button" class="mi-where-cell ${kind}" data-place=${position} aria-label=${whereCellLabel(c)} title=${whereCellLabel(c)}
      aria-current=${c.here ? "true" : "false"} style=${c.here ? `--c:${slot.color}` : nothing}
      @click=${() => { if (!c.here) move(position); }}>${inner}</button>`;
  };
  return html`<div class="mi-where">
    <div class="mi-where-ring" role="group" aria-label="Place on the ring">${WHERE_ROWS.map((r) => r.map(cell))}</div>
    <p class="hint mi-where-note">Click a place to move it there. A place that holds another slot swaps with it.</p>
  </div>`;
}

// ── the rules ────────────────────────────────────────────────────────────

/** The pictures' rules, after the editor's and the views' own. Chrome is
 * drawn from the panel's tokens only; the drawings use its watch art
 * tokens, as the status page pickers do. */
export const menuInspectorLookStyles = css`
  /* The menu inspector's lines read upright, as plain text: the shared card
     sets shown help in italic, so this matches its selector and follows it. */
  .sec[data-help="on"] > .sec-b .me-body .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint) { font-style: normal; }
  /* The marks drawn on the watch's black (slots, beams, the finger): a grey
     that reads on the screen in both skins, where the case grey sinks into
     the dark one. */
  .me-body { --mi-mark: color-mix(in srgb, var(--wa-art-case) 45%, var(--wa-muted)); }

  /* A titled group of picture buttons. */
  .mi-look { display: flex; flex-direction: column; gap: 6px; min-width: 0; padding: 4px 0; }
  .mi-look-title > span { position: relative; display: inline-block; font-size: 12px; color: var(--wa-muted); }
  .mi-look-title > span.changed { color: var(--wa-ink); }
  .mi-look-title button.reset-dot { top: 50%; margin-top: -2.5px; }
  .mi-pics { display: grid; grid-template-columns: repeat(var(--n, 3), minmax(0, 1fr)); gap: 6px; }
  .mi-pics.beams { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .mi-pic {
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; min-width: 0;
    padding: 7px 6px 6px; border: 1px solid var(--wa-line-strong); border-radius: 9px; background: transparent;
    color: var(--wa-label); font: inherit; font-size: 11.5px; line-height: 1.2; cursor: pointer;
    transition: background-color .12s ease-out, border-color .12s ease-out;
  }
  .mi-pic:hover:not(:disabled):not(.on) { background: color-mix(in srgb, var(--wa-ink) 4%, transparent); color: var(--wa-ink); }
  .mi-pic.on { background: var(--wa-panel); border-color: var(--wa-accent); color: var(--wa-ink); }
  .mi-pic:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .mi-pic:disabled { opacity: .45; cursor: default; }
  .mi-pic-name { text-align: center; overflow-wrap: anywhere; }

  /* The drawings, on the watch's black. */
  .mi-well { position: relative; display: block; overflow: hidden; border-radius: 7px; background: var(--wa-art-screen); }
  .mi-backdrop { width: 100%; max-width: 72px; aspect-ratio: 5 / 4; }
  .mi-tiles { position: absolute; inset: 5px; display: grid; grid-template-columns: 1fr 1fr; gap: 3px; }
  .mi-tiles > i { display: block; border-radius: 3px; background: var(--wa-art-clock); }
  .mi-tiles > i:nth-child(2), .mi-tiles > i:nth-child(3) { background: var(--mi-mark); }
  .mi-veil { position: absolute; inset: 0; background: var(--wa-art-screen); opacity: .82; }
  .mi-backdrop.glass .mi-tiles { filter: blur(1.6px); }
  .mi-backdrop.glass .mi-veil { opacity: 1; background: color-mix(in srgb, var(--mi-mark) 20%, transparent); }
  .mi-ring { position: absolute; inset: 0; }
  .mi-ring > i { position: absolute; width: 8px; height: 8px; margin: -4px 0 0 -4px; border-radius: 50%; background: var(--mi-mark); }
  .mi-ring > i:nth-child(1) { left: 50%; top: 24%; }
  .mi-ring > i:nth-child(2) { left: 24%; top: 66%; }
  .mi-ring > i:nth-child(3) { left: 76%; top: 66%; }
  .mi-buttons { width: 100%; max-width: 72px; aspect-ratio: 5 / 4; }
  .mi-buttons > i { position: absolute; width: 13px; height: 13px; margin: -6.5px 0 0 -6.5px; border-radius: 50%; background: var(--wa-art-clock); }
  .mi-buttons > i:nth-child(1) { left: 50%; top: 28%; }
  .mi-buttons > i:nth-child(2) { left: 26%; top: 66%; }
  .mi-buttons > i:nth-child(3) { left: 74%; top: 66%; }
  .mi-buttons.neon > i {
    background: var(--wa-art-dim);
    box-shadow: 0 0 0 1px var(--mi-mark), 0 0 5px 1px color-mix(in srgb, var(--mi-mark) 55%, transparent);
  }
  .mi-beam { display: grid; place-items: center; width: 100%; max-width: 64px; padding: 2px 0; }
  .mi-beam svg { display: block; width: 100%; height: auto; }
  .mi-beam .dot { fill: var(--mi-mark); }
  .mi-beam .b { fill: var(--mi-mark); stroke: none; }
  .mi-beam .soft { opacity: .45; }
  .mi-beam .faint { opacity: .22; }
  .mi-beam .l, .mi-beam .r { fill: none; stroke: var(--mi-mark); stroke-width: 1.4; stroke-linecap: round; }
  .mi-beam .l.faint, .mi-beam .r.faint { opacity: .4; }
  .mi-beam .dash { stroke-dasharray: 2 2.4; }

  /* A switch with its line. */
  .mi-switch { display: flex; flex-direction: column; }
  .mi-switch > .hint.mi-switch-hint { margin: -2px 0 4px; padding-left: calc(var(--wa-lab) + 8px); }

  /* Segmented choices whose words wrap rather than clip. */
  .mi-wrap .seg.wide { height: auto; min-height: 28px; }
  .mi-wrap .seg.wide button { white-space: normal; overflow: visible; text-overflow: clip; line-height: 1.25; padding: 4px; }

  /* An icon on the watch's black, as the slot rows show it. */
  .mi-icon-well {
    flex: none; display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%;
    background: var(--wa-art-screen); box-shadow: inset 0 0 0 1px var(--wa-art-dim);
  }
  .mi-icon-well svg { display: block; }
  .mi-glyph-dot { display: block; width: 9px; height: 9px; border-radius: 50%; }

  /* The Entity quick menu's type tiles. */
  .mi-pics.mi-types { grid-template-columns: repeat(3, minmax(0, 1fr)); margin: 2px 0 4px; }
  .mi-type { gap: 4px; padding: 6px 4px; }

  /* A slot's actions, two across under their headings. */
  .mi-acts { display: flex; flex-direction: column; gap: 8px; padding: 2px 0 4px; }
  .mi-act-group { display: flex; flex-direction: column; gap: 4px; }
  .mi-act-h { font-size: 12px; color: var(--wa-muted); }
  .mi-act-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
  .mi-act {
    display: flex; align-items: center; gap: 7px; min-width: 0; padding: 5px 7px; text-align: left;
    border: 1px solid var(--wa-line-strong); border-radius: 9px; background: transparent;
    color: var(--wa-ink); font: inherit; font-size: 12px; line-height: 1.25; cursor: pointer;
    transition: background-color .12s ease-out, border-color .12s ease-out;
  }
  .mi-act:hover:not(:disabled):not(.on) { background: color-mix(in srgb, var(--wa-ink) 4%, transparent); }
  .mi-act.on { background: var(--wa-panel); border-color: var(--wa-accent); font-weight: 600; }
  .mi-act:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .mi-act:disabled { cursor: default; color: var(--wa-muted); }
  .mi-act:disabled .mi-icon-well { opacity: .5; }
  .mi-act-t { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 5px; min-width: 0; }
  .mi-act-name { overflow-wrap: anywhere; }
  .mi-act-why { flex-basis: 100%; font-size: 11px; font-weight: 400; color: var(--wa-muted); }
  .mi-desc {
    margin: 4px 0 6px; padding: 7px 9px; border: 1px solid var(--wa-line); border-radius: 8px;
    background: var(--wa-panel); color: var(--wa-label); font-size: 12px; line-height: 1.4;
  }

  /* Where: the ring as a 3 by 3 grid of round places. */
  .mi-where { display: flex; align-items: center; gap: 12px; padding: 4px 0 6px; }
  .mi-where-ring {
    flex: none; display: grid; grid-template-columns: repeat(3, 30px); grid-auto-rows: 30px; gap: 6px; padding: 8px;
    border: 1px solid var(--wa-art-dim); border-radius: 18px; background: var(--wa-art-screen);
  }
  .mi-where-cell {
    display: grid; place-items: center; width: 30px; height: 30px; margin: 0; padding: 0; border-radius: 50%;
    border: 1px solid var(--wa-art-clock); background: var(--wa-art-dim); color: var(--mi-mark); cursor: pointer;
  }
  .mi-where-cell svg { display: block; }
  .mi-where-cell.held > * { opacity: .45; }
  .mi-where-cell.held:hover:not(:disabled) > * { opacity: .9; }
  .mi-where-cell.free { border-style: dashed; background: transparent; }
  .mi-where-cell.free svg.ui-icon { width: 13px; height: 13px; }
  .mi-where-cell.free:hover:not(:disabled) { border-color: var(--mi-mark); }
  .mi-where-cell.here { border: 1px solid var(--c, var(--mi-mark)); background: var(--wa-art-screen); cursor: default; }
  .mi-where-cell:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .mi-where-cell:disabled { cursor: default; }
  .mi-where-finger { display: grid; place-items: center; }
  .mi-where-finger > i { display: block; width: 12px; height: 12px; border-radius: 50%; background: var(--mi-mark); opacity: .7; }
  .hint.mi-where-note { margin: 0; flex: 1 1 auto; min-width: 0; }

  /* A narrow inspector stacks each row, so what sat under a control starts
     at the edge too. */
  @container insp (max-width: 360px) {
    .me-style .ts-swatch-row, .mi-switch > .hint.mi-switch-hint { padding-left: 0; }
  }
`;
