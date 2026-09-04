// The editor's own button icons. Not the watch face: those are SF Symbols and
// live in icons.ts. These are drawn here rather than pulled from Home
// Assistant's icon set so the panel keeps working whatever the frontend
// renames, and they are stroked in `currentColor` so a button's own colour and
// its disabled opacity carry into the glyph.
//
// Everything is one 24x24 box with the same stroke weight, so a row of them
// reads as one set instead of five borrowed pictures.

import { type TemplateResult, html, svg } from "lit";

export type UiIconName = "up" | "down" | "show" | "hide" | "duplicate" | "delete" | "close";

function shape(name: UiIconName) {
  switch (name) {
    case "up":
      return svg`<path d="M6 14L12 8L18 14" />`;
    case "down":
      return svg`<path d="M6 10L12 16L18 10" />`;
    case "show":
      return svg`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;
    case "hide":
      return svg`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;
    case "duplicate":
      return svg`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;
    case "delete":
      return svg`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;
    case "close":
      return svg`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;
  }
}

/** One button glyph, sized by the `svg.ui-icon` rule in the panel's styles. */
export function uiIcon(name: UiIconName): TemplateResult {
  return html`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shape(name)}</svg>`;
}
