// The one color picker of the page editor's cards: the tile card's colors,
// the group card, a smart rule's header, the special tasks (quick actions,
// calendars, a camera grid's border) and the page switcher all draw it, so
// each looks and reads the same:
//
//   heading
//   Form       Solid | Gradient              (only where the value has forms)
//   [Default] ● ● ● ● ● ● ● ◉ (More)         (Default only where it means something)
//   Custom     ■ #RRGGBB
//
// A theme holds some thirty colors, three rows of dots that all read alike.
// The row shows the first ten, which are the theme's own kind colors (the
// shades come after them), and a More pill lays the rest out in the same
// row; Less folds them back. A stored color past the ten still shows as
// picked: it stands after them on its own.
//
// The Default chip is always called "Default"; what it means (the watch's
// own gray, the tile's color, white) is its tooltip. Rainbow (◉) is no form
// of its own: where the device cycles the key through every color it is the
// last swatch, with the gradients where the key has a Gradient form, else
// after the solid colors. This module only draws:
// each caller keeps its own edits and its own typing bookkeeping (`wrap`),
// so the page switcher, which never imports the tile settings, draws it too.

import { type TemplateResult, html, nothing } from "lit";
import { colorField, segField } from "../editors.js";
import { type WatchColorModeChoice, sameWatchColor, watchColorEnds } from "./tile-settings-options.js";

/** The Default chip's words, the same on every card. */
export const COLOR_DEFAULT_LABEL = "Default";

/** The custom box's title, the same on every card. */
export const COLOR_CUSTOM_LABEL = "Custom";

/** The Form switch's title and the words of each form. */
export const COLOR_FORM_LABEL = "Form";
export const COLOR_FORM_WORDS: Readonly<Record<"solid" | "gradient", string>> = {
  solid: "Solid",
  gradient: "Gradient",
};

/** What the Rainbow swatch stores and what it is called. */
export const COLOR_RAINBOW = "#RAINBOW";
export const COLOR_RAINBOW_LABEL = "Rainbow";

/** How many swatches the row shows before More: the theme's kind colors. */
export const COLOR_SWATCHES_SHOWN = 10;

/** The More pill's words, and Less once the rest show. */
export const COLOR_MORE_LABEL = "More";
export const COLOR_LESS_LABEL = "Less";

/** The More pill's state, kept in the caller's `uiState` between draws: the
 * view itself keeps nothing. */
export interface ColorMore {
  open: boolean;
  toggle(): void;
}

/** The More pill of one picker, open or folded under `key` in `uiState`
 * (per setting, not per tile, so a person who opened the glow's colors keeps
 * them open from tile to tile). */
export function colorMore(uiState: Map<string, unknown>, key: string, requestUpdate: () => void): ColorMore {
  const at = `color-picker:more:${key}`;
  return {
    open: uiState.get(at) === true,
    toggle: () => {
      if (uiState.get(at) === true) uiState.delete(at);
      else uiState.set(at, true);
      requestUpdate();
    },
  };
}

/**
 * The swatches the row draws: all of them while More is open or where there
 * is no More, else the first `COLOR_SWATCHES_SHOWN`, with the stored color
 * after them when it is one of the rest. `hidden` is how many wait behind
 * More (none: no pill).
 */
export function colorSwatchesShown(swatches: readonly string[], color: unknown, more: ColorMore | undefined): { shown: string[]; hidden: number } {
  // One more than the ten is not worth a pill.
  if (more === undefined || swatches.length <= COLOR_SWATCHES_SHOWN + 1) return { shown: [...swatches], hidden: 0 };
  const rest = swatches.length - COLOR_SWATCHES_SHOWN;
  if (more.open) return { shown: [...swatches], hidden: rest };
  const first = swatches.slice(0, COLOR_SWATCHES_SHOWN);
  const picked = swatches.slice(COLOR_SWATCHES_SHOWN).find((s) => sameWatchColor(color, s));
  return { shown: picked === undefined ? first : [...first, picked], hidden: rest };
}

/** The Rainbow swatch's paint: the watch's rainbow (`RainbowHelper.colors`),
 * across the swatch as the gradients run. */
const RAINBOW_PAINT = "linear-gradient(135deg, #FF453A, #FF9F0A, #FFD60A, #30D158, #64D2FF, #0A84FF, #BF5AF2)";

export interface ColorPickerView {
  /** The heading over the picker. Absent where the form switch is the
   * heading (the tile's own Color) or the row sits under one already. */
  label?: string;
  /** The stored color, as the swatches and the Default chip compare it. */
  color: unknown;
  /** The swatches in the form shown, and what a screen reader calls them. */
  swatches: readonly string[];
  swatchesLabel: string;
  pickSwatch(value: string): void;
  /** The Default chip. `title` says what Default draws ("Gray, the watch's
   * own color"); `on` is whether it is what is drawn now. Absent only where
   * nothing could be called the default. */
  default?: { title: string; on: boolean; pick(): void };
  /** The Form switch, where the value takes more than one form. `shown` may
   * be `none` (no form lit); a rainbow shows as Gradient. `title` replaces
   * "Form" where the switch is the picker's only heading. */
  form?: {
    shown: WatchColorModeChoice;
    forms: readonly ("solid" | "gradient")[];
    pick(form: "solid" | "gradient"): void;
    title?: string;
  };
  /** The Rainbow swatch, where the device draws `#RAINBOW` for the key: last
   * in the row, with the gradients where there is a Gradient form. Picking
   * it is `pickSwatch(COLOR_RAINBOW)`. `note` says what it does, under the
   * swatches while it is picked. */
  rainbow?: { note?: string };
  /** The Tile color chip after Default, where the value can follow the
   * tile's own color (the icon's glow). `title` says what it draws. */
  tile?: { title: string; on: boolean; pick(): void };
  /** The More pill after the first ten swatches (`colorMore`). Absent:
   * every swatch shows, with no pill. */
  more?: ColorMore;
  /** The custom box: the solid color it shows and its edit. */
  custom: { shown: string | undefined; pick(value: string | undefined): void };
  /** The caller's typing field around the custom box, which keeps what is
   * typed while it has focus and makes the run one undo step. */
  wrap(body: TemplateResult): TemplateResult;
}

/** A row of small round color buttons, `lead` (the Default chip) first. */
export function swatchRow(
  label: string,
  swatches: readonly string[],
  current: unknown,
  pick: (color: string) => void,
  lead: TemplateResult | typeof nothing = nothing,
  tail: TemplateResult | typeof nothing = nothing,
): TemplateResult {
  return html`<div class="ts-swatches" role="group" aria-label=${label}>
    ${lead}
    ${swatches.map((value) => {
      const ends = watchColorEnds(value);
      if (ends === undefined) return nothing;
      const on = sameWatchColor(current, value);
      const name = ends.from === ends.to ? ends.from : `Gradient from ${ends.from} to ${ends.to}`;
      return html`<button type="button" class="ts-swatch ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
        title=${name} aria-label=${name}
        style=${`--sw:linear-gradient(135deg, ${ends.from}, ${ends.to})`}
        @click=${() => pick(value)}></button>`;
    })}
    ${tail}
  </div>`;
}

/** The Rainbow swatch, drawn as the other swatches are. */
function rainbowSwatch(on: boolean, pick: () => void): TemplateResult {
  return html`<button type="button" class="ts-swatch ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
    title=${COLOR_RAINBOW_LABEL} aria-label=${COLOR_RAINBOW_LABEL}
    style=${`--sw:${RAINBOW_PAINT}`}
    @click=${pick}></button>`;
}

/** The Default chip, at the head of the swatch row. */
function defaultChip(d: NonNullable<ColorPickerView["default"]>, label: string | undefined): TemplateResult {
  return html`<button type="button" class="pe-chip ts-color-default ${d.on ? "on" : ""}" aria-pressed=${d.on ? "true" : "false"}
    aria-label=${label === undefined ? COLOR_DEFAULT_LABEL : `${COLOR_DEFAULT_LABEL} ${label.toLowerCase()}`}
    title=${d.title} @click=${d.pick}>${COLOR_DEFAULT_LABEL}</button>`;
}

/** The Tile color chip's words. */
export const COLOR_TILE_LABEL = "Tile color";

/** The Tile color chip, after Default. */
function tileChip(t: NonNullable<ColorPickerView["tile"]>): TemplateResult {
  return html`<button type="button" class="pe-chip ts-color-tile ${t.on ? "on" : ""}" aria-pressed=${t.on ? "true" : "false"}
    title=${t.title} @click=${t.pick}>${COLOR_TILE_LABEL}</button>`;
}

/** The More or Less pill, after the swatches and Rainbow. */
function morePill(more: ColorMore): TemplateResult {
  return html`<button type="button" class="pe-chip ts-color-more" aria-expanded=${more.open ? "true" : "false"}
    title=${more.open ? "Show only the theme's main colors" : "Show all the theme's colors"}
    @click=${more.toggle}>${more.open ? COLOR_LESS_LABEL : COLOR_MORE_LABEL}</button>`;
}

/** The picker: heading, Form, Default with the swatches, Rainbow and More, Custom. */
export function colorPickerView(v: ColorPickerView): TemplateResult {
  const form = v.form === undefined || v.form.forms.length < 2 ? undefined : v.form;
  // A rainbow is one of the gradients.
  const shown: WatchColorModeChoice = form?.shown === "rainbow" ? "gradient" : (form?.shown ?? "none");
  const rainbowOn = sameWatchColor(v.color, COLOR_RAINBOW);
  const rainbow = v.rainbow !== undefined && (form === undefined || !form.forms.includes("gradient") || shown === "gradient")
    ? rainbowSwatch(rainbowOn, () => v.pickSwatch(COLOR_RAINBOW))
    : nothing;
  const note = rainbowOn ? v.rainbow?.note : undefined;
  const { shown: swatches, hidden } = colorSwatchesShown(v.swatches, v.color, v.more);
  const tail = html`${rainbow}${hidden > 0 && v.more !== undefined ? morePill(v.more) : nothing}`;
  return html`
    ${v.label === undefined ? nothing : html`<div class="ts-sub-h"><span>${v.label}</span></div>`}
    ${form === undefined
      ? nothing
      : segField<WatchColorModeChoice>(form.title ?? COLOR_FORM_LABEL, shown, form.forms.map((f) => [f, COLOR_FORM_WORDS[f]] as [WatchColorModeChoice, string]), (f) => {
          if (f === "solid" || f === "gradient") form.pick(f);
        })}
    <div class="ts-swatch-row">${swatchRow(v.swatchesLabel, swatches, v.color, v.pickSwatch, html`${v.default === undefined ? nothing : defaultChip(v.default, v.label ?? form?.title)}${v.tile === undefined ? nothing : tileChip(v.tile)}`, tail)}</div>
    ${note === undefined ? nothing : html`<div class="hint ts-under">${note}</div>`}
    ${v.wrap(html`<div class="ts-no-alpha">${colorField(COLOR_CUSTOM_LABEL, v.custom.shown, v.custom.pick)}</div>`)}`;
}
