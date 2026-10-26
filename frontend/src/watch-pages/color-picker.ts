// The one color picker of the page editor's cards: the tile card's colors,
// the group card, a smart rule's header, the special tasks (quick actions,
// calendars, a camera grid's border) and the page switcher all draw it, so
// each looks and reads the same:
//
//   heading
//   Form       Solid | Gradient              (only where the value has forms)
//   [Default] ● ● ● ● ● ● ● ◉                (Default only where it means something)
//   Custom     ■ #RRGGBB
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

/** The picker: heading, Form, Default with the swatches and Rainbow, Custom. */
export function colorPickerView(v: ColorPickerView): TemplateResult {
  const form = v.form === undefined || v.form.forms.length < 2 ? undefined : v.form;
  // A rainbow is one of the gradients.
  const shown: WatchColorModeChoice = form?.shown === "rainbow" ? "gradient" : (form?.shown ?? "none");
  const rainbowOn = sameWatchColor(v.color, COLOR_RAINBOW);
  const rainbow = v.rainbow !== undefined && (form === undefined || !form.forms.includes("gradient") || shown === "gradient")
    ? rainbowSwatch(rainbowOn, () => v.pickSwatch(COLOR_RAINBOW))
    : nothing;
  const note = rainbowOn ? v.rainbow?.note : undefined;
  return html`
    ${v.label === undefined ? nothing : html`<div class="ts-sub-h"><span>${v.label}</span></div>`}
    ${form === undefined
      ? nothing
      : segField<WatchColorModeChoice>(form.title ?? COLOR_FORM_LABEL, shown, form.forms.map((f) => [f, COLOR_FORM_WORDS[f]] as [WatchColorModeChoice, string]), (f) => {
          if (f === "solid" || f === "gradient") form.pick(f);
        })}
    <div class="ts-swatch-row">${swatchRow(v.swatchesLabel, v.swatches, v.color, v.pickSwatch, html`${v.default === undefined ? nothing : defaultChip(v.default, v.label ?? form?.title)}${v.tile === undefined ? nothing : tileChip(v.tile)}`, rainbow)}</div>
    ${note === undefined ? nothing : html`<div class="hint ts-under">${note}</div>`}
    ${v.wrap(html`<div class="ts-no-alpha">${colorField(COLOR_CUSTOM_LABEL, v.custom.shown, v.custom.pick)}</div>`)}`;
}
