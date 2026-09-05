// The editor's own button icons. Not the watch face: those are SF Symbols and
// live in icons.ts. These are drawn here rather than pulled from Home
// Assistant's icon set so the panel keeps working whatever the frontend
// renames, and they are stroked in `currentColor` so a button's own colour and
// its disabled opacity carry into the glyph.
//
// Everything is one 24x24 box with the same stroke weight, so a row of them
// reads as one set instead of five borrowed pictures.

import { type TemplateResult, html, svg } from "lit";

export type UiIconName =
  | "up" | "down" | "show" | "hide" | "duplicate" | "delete" | "close" | "reset"
  | "text" | "icon" | "gauge" | "chart" | "shape" | "image" | "tap"
  | "grip" | "chevron" | "content" | "look" | "clock" | "states" | "place" | "layers" | "plus"
  | "lock" | "unlock" | "folder" | "ungroup" | "watch";

function shape(name: UiIconName) {
  switch (name) {
    // Layer kinds, for the add buttons and the Layers list.
    case "text":
      return svg`<path d="M5 6H19M12 6V19M9 19H15" />`;
    case "icon":
      return svg`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;
    case "gauge":
      return svg`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;
    case "chart":
      return svg`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;
    case "shape":
      return svg`<rect x="4" y="5" width="16" height="14" rx="3" />`;
    case "image":
      return svg`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;
    case "tap":
      return svg`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;
    // Inspector card icons.
    case "content":
      return svg`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;
    case "look":
      return svg`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;
    case "clock":
      return svg`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;
    case "states":
      return svg`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;
    case "place":
      return svg`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;
    case "layers":
      return svg`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;
    case "grip":
      return svg`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;
    case "chevron":
      return svg`<path d="M6 9L12 15L18 9" />`;
    case "plus":
      return svg`<path d="M12 5V19M5 12H19" />`;
    // The app mark in the header: a watch case with its band stubs.
    case "watch":
      return svg`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;
    case "lock":
      return svg`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;
    case "unlock":
      return svg`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;
    case "folder":
      return svg`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;
    case "ungroup":
      return svg`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;
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
    case "reset":
      return svg`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`;
  }
}

/** One button glyph, sized by the `svg.ui-icon` rule in the panel's styles. */
export function uiIcon(name: UiIconName): TemplateResult {
  return html`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shape(name)}</svg>`;
}
