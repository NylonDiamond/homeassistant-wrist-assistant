// The one color picker of the page editor's cards: the tile card's colors,
// the group card, a smart rule's header, the special tasks (quick actions,
// calendars, a camera grid's border) and the page switcher all draw it, so
// each looks and reads the same:
//
//   heading
//   Form       Solid | Gradient              (only where the value has forms)
//   [Default] ● ● ● ● ● ● ● ◉ ✣              (Default only where it means something)
//   Custom     ■ #RRGGBB                     (only while custom, or ✣ pressed)
//
// The last swatch (✣, a color wheel) is Custom: it is on while the color is
// none of the others, and a press shows the Custom row and opens the
// system's color picker (Jesse, 2026-10-26: the Custom row always in view
// looked busy).
// Every color of the theme shows, the theme's own kind colors first and the
// shades after them. A More pill once folded all but ten; Jesse asked for
// every color in view on 2026-10-26, so there is no pill.
//
// The Default chip is always called "Default"; what it means (the watch's
// own gray, the tile's color, white) is its tooltip. Rainbow (◉) is no form
// of its own: where the device cycles the key through every color it is the
// last swatch, with the gradients where the key has a Gradient form, else
// after the solid colors.
//
// Pointing at a swatch or a chip, or moving the focus to it, can try it on
// the tile before it is picked (`trial`), and a picker over several picked
// tiles that differ marks no swatch and says Mixed (`mixed`). This module only draws:
// each caller keeps its own edits and its own typing bookkeeping (`wrap`),
// so the page switcher, which never imports the tile settings, draws it too.

import { type TemplateResult, html, nothing } from "lit";
import { colorField, segField } from "../editors.js";
import { MIXED_WORD } from "./multi-pick.js";
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
  /** The picked tiles differ here: no swatch, chip or form is on, and the
   * heading (or the row, with none) says Mixed in grey. */
  mixed?: boolean;
  /** Pointing at a swatch or a chip tries it on the tile. */
  trial?: ColorTrial;
  /** The caller's typing field around the custom box, which keeps what is
   * typed while it has focus and makes the run one undo step. */
  wrap(body: TemplateResult): TemplateResult;
}

/** Trying a color before it is picked: what pointing at a swatch or a chip,
 * or focusing it, does (the edit its press makes, on a copy), and what
 * leaving the row or a press does. */
export interface ColorTrial {
  /** Try the swatch `value` (Rainbow too), which the stage's pill calls
   * `name`. */
  swatch(value: string, name: string): void;
  /** Try the Default chip, and the Tile color chip. */
  default?(): void;
  tile?(): void;
  end(): void;
}

/** A row of small round color buttons, `lead` (the Default chip) first.
 * With a `trial`, pointing at a swatch tries it and leaving the row ends
 * the try; a press picks and ends it. */
export function swatchRow(
  label: string,
  swatches: readonly string[],
  current: unknown,
  pick: (color: string) => void,
  lead: TemplateResult | typeof nothing = nothing,
  tail: TemplateResult | typeof nothing = nothing,
  trial?: ColorTrial,
): TemplateResult {
  const leave = (e: Event) => {
    if (trial === undefined) return;
    // A focus move inside the row is not a leave.
    const to = (e as FocusEvent).relatedTarget;
    if (e.type === "focusout" && typeof Node !== "undefined" && to instanceof Node && (e.currentTarget as HTMLElement | null)?.contains(to)) return;
    trial.end();
  };
  return html`<div class="ts-swatches" role="group" aria-label=${label}
    @pointerleave=${trial === undefined ? nothing : leave} @focusout=${trial === undefined ? nothing : leave}>
    ${lead}
    ${swatches.map((value) => {
      const ends = watchColorEnds(value);
      if (ends === undefined) return nothing;
      const on = sameWatchColor(current, value);
      const name = ends.from === ends.to ? ends.from : `Gradient from ${ends.from} to ${ends.to}`;
      const tryIt = trial === undefined ? nothing : () => trial.swatch(value, name);
      return html`<button type="button" class="ts-swatch ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
        title=${name} aria-label=${name}
        style=${`--sw:linear-gradient(135deg, ${ends.from}, ${ends.to})`}
        @pointerenter=${tryIt} @focus=${tryIt}
        @click=${() => { pick(value); trial?.end(); }}></button>`;
    })}
    ${tail}
  </div>`;
}

/** The Rainbow swatch, drawn as the other swatches are. */
function rainbowSwatch(on: boolean, pick: () => void, trial: ColorTrial | undefined): TemplateResult {
  const tryIt = trial === undefined ? nothing : () => trial.swatch(COLOR_RAINBOW, COLOR_RAINBOW_LABEL);
  return html`<button type="button" class="ts-swatch ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
    title=${COLOR_RAINBOW_LABEL} aria-label=${COLOR_RAINBOW_LABEL}
    style=${`--sw:${RAINBOW_PAINT}`}
    @pointerenter=${tryIt} @focus=${tryIt}
    @click=${() => { pick(); trial?.end(); }}></button>`;
}

/** The Custom swatch's words. */
export const COLOR_CUSTOM_SWATCH_LABEL = "Custom color";

/** The Custom swatch, last in the row: on while the color is a custom one,
 * which it shows in its middle. A press shows the Custom row under the
 * swatches (the next sibling of the row that holds a `.ts-custom`) and opens
 * the system's color picker in it; picking there stores the color. */
function customSwatch(on: boolean, shown: string | undefined, trial: ColorTrial | undefined): TemplateResult {
  const open = (e: Event) => {
    trial?.end();
    let next = (e.currentTarget as HTMLElement | null)?.closest(".ts-swatch-row")?.nextElementSibling ?? null;
    let box: HTMLElement | null = null;
    while (next !== null && box === null) {
      box = next.matches(".ts-custom") ? (next as HTMLElement) : next.querySelector<HTMLElement>(".ts-custom");
      next = next.nextElementSibling;
    }
    if (box === null) return;
    box.hidden = false;
    const input = box.querySelector<HTMLInputElement>("input[type=color]");
    try {
      input?.showPicker();
    } catch {
      input?.focus();
    }
  };
  const inner = on && shown !== undefined ? `--sw-in:radial-gradient(circle, ${shown} 0 45%, transparent 48%)` : "";
  return html`<button type="button" class="ts-swatch-custom ts-swatch ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
    title=${COLOR_CUSTOM_SWATCH_LABEL} aria-label=${COLOR_CUSTOM_SWATCH_LABEL} style=${inner} @click=${open}></button>`;
}

/** The Default chip, at the head of the swatch row. */
function defaultChip(d: NonNullable<ColorPickerView["default"]>, label: string | undefined, trial: ColorTrial | undefined): TemplateResult {
  const tryIt = trial?.default === undefined ? nothing : () => trial.default!();
  return html`<button type="button" class="pe-chip ts-color-default ${d.on ? "on" : ""}" aria-pressed=${d.on ? "true" : "false"}
    aria-label=${label === undefined ? COLOR_DEFAULT_LABEL : `${COLOR_DEFAULT_LABEL} ${label.toLowerCase()}`}
    @pointerenter=${tryIt} @focus=${tryIt}
    title=${d.title} @click=${() => { d.pick(); trial?.end(); }}>${COLOR_DEFAULT_LABEL}</button>`;
}

/** The Tile color chip's words. */
export const COLOR_TILE_LABEL = "Tile color";

/** The Tile color chip, after Default. */
function tileChip(t: NonNullable<ColorPickerView["tile"]>, trial: ColorTrial | undefined): TemplateResult {
  const tryIt = trial?.tile === undefined ? nothing : () => trial.tile!();
  return html`<button type="button" class="pe-chip ts-color-tile ${t.on ? "on" : ""}" aria-pressed=${t.on ? "true" : "false"}
    @pointerenter=${tryIt} @focus=${tryIt}
    title=${t.title} @click=${() => { t.pick(); trial?.end(); }}>${COLOR_TILE_LABEL}</button>`;
}

/** The picker: heading, Form, Default with the swatches, Rainbow and the
 * Custom swatch, then the Custom row while it is in use. */
export function colorPickerView(v: ColorPickerView): TemplateResult {
  const mixed = v.mixed === true;
  // Mixed marks nothing: no color matches this.
  const color = mixed ? undefined : v.color;
  const form = v.form === undefined || v.form.forms.length < 2 ? undefined : v.form;
  // A rainbow is one of the gradients. The swatches stay in the form the
  // caller drew them in; only the switch shows no form while Mixed.
  const drawn: WatchColorModeChoice = form?.shown === "rainbow" ? "gradient" : (form?.shown ?? "none");
  const shown: WatchColorModeChoice = mixed ? "none" : drawn;
  const rainbowOn = sameWatchColor(color, COLOR_RAINBOW);
  const rainbow = v.rainbow !== undefined && (form === undefined || !form.forms.includes("gradient") || drawn === "gradient")
    ? rainbowSwatch(rainbowOn, () => v.pickSwatch(COLOR_RAINBOW), v.trial)
    : nothing;
  const note = rainbowOn ? v.rainbow?.note : undefined;
  const swatches = v.swatches;
  // Custom is on while the color is none of the swatches and chips.
  const named = rainbowOn || swatches.some((x) => sameWatchColor(color, x)) || v.default?.on === true || v.tile?.on === true;
  const customOn = !mixed && v.custom.shown !== undefined && v.custom.shown !== "" && !named;
  const tail = html`${rainbow}${customSwatch(customOn, v.custom.shown, v.trial)}`;
  const word = html`<em class="pc-mixed">${MIXED_WORD}</em>`;
  const chips = html`${mixed && v.label === undefined ? word : nothing}${v.default === undefined ? nothing : defaultChip(mixed ? { ...v.default, on: false } : v.default, v.label ?? form?.title, v.trial)}${
    v.tile === undefined ? nothing : tileChip(mixed ? { ...v.tile, on: false } : v.tile, v.trial)}`;
  return html`
    ${v.label === undefined ? nothing : html`<div class="ts-sub-h"><span>${v.label}</span>${mixed ? word : nothing}</div>`}
    ${form === undefined
      ? nothing
      : segField<WatchColorModeChoice>(form.title ?? COLOR_FORM_LABEL, shown, form.forms.map((f) => [f, COLOR_FORM_WORDS[f]] as [WatchColorModeChoice, string]), (f) => {
          if (f === "solid" || f === "gradient") form.pick(f);
        })}
    <div class="ts-swatch-row">${swatchRow(v.swatchesLabel, swatches, color, v.pickSwatch, chips, tail, v.trial)}</div>
    ${note === undefined ? nothing : html`<div class="hint ts-under">${note}</div>`}
    ${v.wrap(html`<div class="ts-no-alpha ts-custom" ?hidden=${!customOn}>${colorField(COLOR_CUSTOM_LABEL, v.custom.shown, v.custom.pick)}</div>`)}`;
}
