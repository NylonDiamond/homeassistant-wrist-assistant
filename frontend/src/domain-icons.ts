// One glyph and one plain name per Home Assistant domain, for the entity
// search.
//
// Drawn here rather than borrowed from Home Assistant's icon set, for the same
// reason as `ui-icons.ts`: the panel keeps working whatever the frontend
// renames or stops shipping, and a stroked `currentColor` glyph takes the
// colour of the row around it. Every one is the same 24x24 box at the same
// stroke weight, so a list of mixed domains reads as one set.
//
// The list is the domains an author is likely to put on a watch face. Anything
// else falls back to a neutral dot, which is honest: the row still has its
// name, its id and its type beside it.

import { type TemplateResult, html, svg } from "lit";

function glyph(domain: string) {
  switch (domain) {
    case "light":
      return svg`<path d="M9.2 15.5A5.5 5.5 0 1 1 14.8 15.5C13.8 16.6 13.6 17.4 13.5 19H10.5C10.4 17.4 10.2 16.6 9.2 15.5Z" /><path d="M10.5 21.5H13.5" />`;
    case "switch":
    case "input_boolean":
      return svg`<rect x="3" y="7.5" width="18" height="9" rx="4.5" /><circle cx="16.5" cy="12" r="2.6" />`;
    case "sensor":
      return svg`<path d="M12 14.5V4.5" /><circle cx="12" cy="17.5" r="3.2" /><path d="M14.5 6.5H12M14.5 9.5H12" />`;
    case "binary_sensor":
      return svg`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.2" />`;
    case "climate":
    case "water_heater":
      return svg`<path d="M10 13.8V5.5a2 2 0 0 1 4 0V13.8" /><circle cx="12" cy="17" r="3.6" /><path d="M16.5 7H19M16.5 10.5H19" />`;
    case "humidifier":
      return svg`<path d="M12 3.5S6.5 10.5 6.5 14.5A5.5 5.5 0 0 0 17.5 14.5C17.5 10.5 12 3.5 12 3.5Z" />`;
    case "media_player":
      return svg`<rect x="2.8" y="4.5" width="18.4" height="12" rx="2.5" /><path d="M8 20H16" /><path d="M10.6 9.2L14.4 10.6L10.6 12Z" />`;
    case "camera":
      return svg`<path d="M3.5 8.5A2 2 0 0 1 5.5 6.5H9L10.5 4.5H13.5L15 6.5H18.5A2 2 0 0 1 20.5 8.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><circle cx="12" cy="12.5" r="3.5" />`;
    case "cover":
      return svg`<rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M3.5 8.5H20.5M3.5 13H20.5M3.5 17.5H20.5" />`;
    case "lock":
      return svg`<rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0V10.5" />`;
    case "fan":
      return svg`<circle cx="12" cy="12" r="2" /><path d="M12 10C12 6 9 3.5 7 5.5S8.5 10 12 10Z" /><path d="M14 12C18 12 20.5 9 18.5 7S14 8.5 14 12Z" /><path d="M12 14C12 18 15 20.5 17 18.5S15.5 14 12 14Z" /><path d="M10 12C6 12 3.5 15 5.5 17S10 15.5 10 12Z" />`;
    case "script":
    case "automation":
      return svg`<path d="M5 5.5H19M5 10H19M5 14.5H14M5 19H11" />`;
    case "scene":
      return svg`<path d="M12 3.5L14.2 8.6L19.7 9.2L15.6 12.9L16.8 18.3L12 15.5L7.2 18.3L8.4 12.9L4.3 9.2L9.8 8.6Z" />`;
    case "person":
    case "device_tracker":
      return svg`<circle cx="12" cy="8" r="3.6" /><path d="M5 20.5a7 7 0 0 1 14 0" />`;
    case "vacuum":
    case "lawn_mower":
      return svg`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" /><path d="M12 3.5V8.5" />`;
    case "weather":
      return svg`<circle cx="9" cy="9" r="3.2" /><path d="M8.5 19.5a4 4 0 0 1 .4-8 5.2 5.2 0 0 1 10 1.2 3.4 3.4 0 0 1-.4 6.8Z" />`;
    case "sun":
      return svg`<circle cx="12" cy="12" r="4.2" /><path d="M12 3V5.5M12 18.5V21M3 12H5.5M18.5 12H21M5.6 5.6L7.4 7.4M16.6 16.6L18.4 18.4M18.4 5.6L16.6 7.4M7.4 16.6L5.6 18.4" />`;
    case "input_number":
    case "number":
      return svg`<path d="M8 4.5L6 19.5M18 4.5L16 19.5M4.5 9H19.5M4 15H19" />`;
    case "input_select":
    case "select":
      return svg`<rect x="3.5" y="6" width="17" height="12" rx="2.5" /><path d="M14 10.5L16.2 13L18.4 10.5" />`;
    case "input_text":
    case "text":
      return svg`<path d="M5 6H19M12 6V19M9 19H15" />`;
    case "button":
    case "input_button":
      return svg`<circle cx="12" cy="12" r="8.5" /><path d="M12 8.5V15.5M8.5 12H15.5" />`;
    case "alarm_control_panel":
      return svg`<path d="M12 3.5L19.5 6.5V12C19.5 16.5 16.3 19.6 12 20.8C7.7 19.6 4.5 16.5 4.5 12V6.5Z" /><path d="M9.5 12L11.3 14L14.8 10.2" />`;
    case "update":
      return svg`<path d="M12 4.5V14.5" /><path d="M8.2 10.8L12 14.6L15.8 10.8" /><path d="M5 18.5H19" />`;
    case "todo":
      return svg`<rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M8 12L10.6 14.5L16 9" />`;
    case "calendar":
      return svg`<rect x="3.5" y="5.5" width="17" height="15" rx="2.5" /><path d="M3.5 10H20.5M8 3.5V7.5M16 3.5V7.5" />`;
    case "timer":
    case "counter":
      return svg`<circle cx="12" cy="13.5" r="7.5" /><path d="M12 9.5V13.5L14.6 15.4" /><path d="M9.5 2.8H14.5" />`;
    case "zone":
      return svg`<path d="M12 21S5 15.4 5 10.2A7 7 0 0 1 19 10.2C19 15.4 12 21 12 21Z" /><circle cx="12" cy="10" r="2.6" />`;
    case "remote":
      return svg`<rect x="7" y="2.8" width="10" height="18.4" rx="3" /><circle cx="12" cy="8" r="1.5" /><path d="M9.6 12.5H14.4M9.6 16H14.4" />`;
    case "siren":
      return svg`<path d="M5 18.5a7 7 0 0 1 14 0Z" /><path d="M3.5 18.5H20.5M12 4V7M5.5 6.5L7.4 8.4M18.5 6.5L16.6 8.4" />`;
    case "valve":
      return svg`<path d="M4 8L12 12L4 16Z" /><path d="M20 8L12 12L20 16Z" /><path d="M12 12V4M9 4H15" />`;
    case "image":
    case "image_processing":
      return svg`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;
    case "event":
      return svg`<circle cx="12" cy="12" r="2.4" /><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6" /><path d="M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13" />`;
    case "group":
      return svg`<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="2" /><rect x="13" y="13" width="7.5" height="7.5" rx="2" />`;
    default:
      return svg`<circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.2" />`;
  }
}

/** The glyph for one domain, sized by the `.ent-ico` rule in the panel's
 * styles. Decorative: the row already says the type in words. */
export function domainIcon(domain: string): TemplateResult {
  return html`<svg class="dom-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyph(domain)}</svg>`;
}

/** Domains whose plain name is not just the id with the underscores taken
 * out. Everything else is title cased, which is already right for `light`,
 * `switch`, `camera`, `media_player` and most of the rest. */
const DOMAIN_NAMES: Record<string, string> = {
  binary_sensor: "Binary sensor",
  input_boolean: "Toggle helper",
  input_number: "Number helper",
  input_select: "Dropdown helper",
  input_text: "Text helper",
  input_button: "Button helper",
  input_datetime: "Date helper",
  alarm_control_panel: "Alarm panel",
  device_tracker: "Device tracker",
  media_player: "Media player",
  water_heater: "Water heater",
  lawn_mower: "Lawn mower",
  image_processing: "Image processing",
  persistent_notification: "Notification",
  remote: "Remote",
  sun: "Sun",
  todo: "To-do list",
};

/** The type shown at the right of a search result: "Media player", "Script".
 * The same words Home Assistant uses, so a row here matches what the author
 * saw in the Home Assistant list they came from. */
export function domainLabel(domain: string): string {
  const known = DOMAIN_NAMES[domain];
  if (known !== undefined) return known;
  if (domain === "") return "";
  const words = domain.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** States that mean "this is doing something right now", which is the only
 * reason the search tints a row's glyph. Anything else stays muted, so an
 * active entity is findable by eye in a long list. */
const ACTIVE_STATES = new Set([
  "on", "open", "opening", "closing", "home", "playing", "heat", "cool", "heat_cool",
  "auto", "dry", "fan_only", "cleaning", "returning", "active", "running", "recording", "streaming",
  "triggered", "armed_home", "armed_away", "armed_night", "armed_vacation", "unlocked",
]);

export function isActiveState(state: string): boolean {
  return ACTIVE_STATES.has(state.trim().toLowerCase());
}
