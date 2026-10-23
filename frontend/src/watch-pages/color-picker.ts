// The one color picker of the page editor's cards: the tile card's colors,
// the group card, a smart rule's header, the special tasks (quick actions,
// calendars, a camera grid's border) and the page switcher all draw it, so
// each looks and reads the same:
//
//   heading
//   Form       Solid | Gradient | Rainbow    (only where the value has forms)
//   [Default] ● ● ● ● ● ● ●                  (Default only where it means something)
//   Custom     ■ #RRGGBB
//
// The Default chip is always called "Default"; what it means (the watch's
// own gray, the tile's color, white) is its tooltip. This module only draws:
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
export const COLOR_FORM_WORDS: Readonly<Record<"solid" | "gradient" | "rainbow", string>> = {
  solid: "Solid",
  gradient: "Gradient",
  rainbow: "Rainbow",
};

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
   * be `none` (no form lit). `title` replaces "Form" where the switch is the
   * picker's only heading. */
  form?: {
    shown: WatchColorModeChoice;
    forms: readonly ("solid" | "gradient" | "rainbow")[];
    pick(form: WatchColorModeChoice): void;
    title?: string;
  };
  /** A line under the form switch (what Rainbow does). */
  note?: string;
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
  </div>`;
}

/** The Default chip, at the head of the swatch row. */
function defaultChip(d: NonNullable<ColorPickerView["default"]>, label: string | undefined): TemplateResult {
  return html`<button type="button" class="pe-chip ts-color-default ${d.on ? "on" : ""}" aria-pressed=${d.on ? "true" : "false"}
    aria-label=${label === undefined ? COLOR_DEFAULT_LABEL : `${COLOR_DEFAULT_LABEL} ${label.toLowerCase()}`}
    title=${d.title} @click=${d.pick}>${COLOR_DEFAULT_LABEL}</button>`;
}

/** The picker: heading, Form, Default with the swatches, Custom. */
export function colorPickerView(v: ColorPickerView): TemplateResult {
  const form = v.form;
  return html`
    ${v.label === undefined ? nothing : html`<div class="ts-sub-h"><span>${v.label}</span></div>`}
    ${form === undefined || form.forms.length < 2
      ? nothing
      : segField<WatchColorModeChoice>(form.title ?? COLOR_FORM_LABEL, form.shown, form.forms.map((f) => [f, COLOR_FORM_WORDS[f]] as [WatchColorModeChoice, string]), (f) => form.pick(f))}
    ${v.note === undefined ? nothing : html`<div class="hint ts-under">${v.note}</div>`}
    <div class="ts-swatch-row">${swatchRow(v.swatchesLabel, v.swatches, v.color, v.pickSwatch, v.default === undefined ? nothing : defaultChip(v.default, v.label ?? form?.title))}</div>
    ${v.wrap(html`<div class="ts-no-alpha">${colorField(COLOR_CUSTOM_LABEL, v.custom.shown, v.custom.pick)}</div>`)}`;
}
