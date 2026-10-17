// How each Watch app screen's work is used on the wrist, for someone who has
// never opened it. The words show in the hover card on each screen's tab in
// the Watch app row (`watch-row.ts`), never on the editors themselves. The
// Menus screen's "How it opens" card (watch-menus/menu-stage.ts) draws the
// same card with one set of words per menu.

import { css, html, svg, type TemplateResult } from "lit";

/** The small drawing in a how-to card's chip. */
export type HowToArt = "hold" | "tile" | "swipe" | "list" | "voice" | "room" | "web" | "crop" | "radial" | "face" | "photo" | "layers";

export interface HowTo {
  art: HowToArt;
  /** The small heading over the main line, like "On your watch". */
  label: string;
  /** How it is used on the watch, as one or two short sentences. */
  how: string;
  /** What it is good for. */
  use: string;
}

const ART: Readonly<Record<HowToArt, TemplateResult>> = {
  hold: svg`<circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="9.5" opacity=".45"></circle>`,
  tile: svg`<rect x="4" y="5" width="16" height="14" rx="4"></rect><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"></circle><circle cx="12" cy="12" r="5" opacity=".5"></circle>`,
  swipe: svg`<rect x="3" y="5" width="7.5" height="7.5" rx="2"></rect><rect x="13.5" y="5" width="7.5" height="7.5" rx="2" opacity=".5"></rect><path d="M7 18h10"></path><path d="M14 15l3 3-3 3"></path>`,
  list: svg`<circle cx="5.5" cy="7" r="1.4" fill="currentColor" stroke="none"></circle><circle cx="5.5" cy="12" r="1.4" fill="currentColor" stroke="none"></circle><circle cx="5.5" cy="17" r="1.4" fill="currentColor" stroke="none"></circle><path d="M9.5 7h10"></path><path d="M9.5 12h10"></path><path d="M9.5 17h7"></path>`,
  voice: svg`<rect x="9" y="3" width="6" height="11" rx="3"></rect><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0"></path><path d="M12 18v3"></path>`,
  room: svg`<path d="M4 11l8-6.5 8 6.5"></path><path d="M6 9.5V20h12V9.5"></path><circle cx="12" cy="14.5" r="2" fill="currentColor" stroke="none"></circle>`,
  web: svg`<circle cx="12" cy="12" r="8.5"></circle><path d="M3.5 12h17"></path><path d="M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"></path>`,
  crop: svg`<path d="M7 3v14h14"></path><path d="M3 7h14v14"></path>`,
  photo: svg`<rect x="3.5" y="5" width="17" height="14" rx="2.5"></rect><circle cx="9" cy="10" r="1.6" fill="currentColor" stroke="none"></circle><path d="M5 17l4.5-4.5 3 3 2.5-2.5 4 4"></path>`,
  layers: svg`<path d="M12 4l8 4-8 4-8-4z"></path><path d="M4 12l8 4 8-4" opacity=".7"></path><path d="M4 16l8 4 8-4" opacity=".45"></path>`,
  face: svg`<rect x="5" y="3" width="14" height="18" rx="5"></rect><path d="M8.5 9h7"></path><circle cx="9.5" cy="15" r="1.6"></circle><circle cx="14.5" cy="15" r="1.6"></circle>`,
  radial: svg`<circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"></circle><circle cx="12" cy="4.5" r="1.8"></circle><circle cx="19.5" cy="12" r="1.8"></circle><circle cx="12" cy="19.5" r="1.8"></circle><circle cx="4.5" cy="12" r="1.8"></circle>`,
};

/** The screens whose tab carries a how-to. Settings and the retired
 * Control Center have none. */
export type HowToScreen = "pages" | "menus" | "status-pages" | "rooms" | "voice" | "watch-complications" | "http-actions" | "cameras" | "photos" | "parts";

/** How each screen's work is used on the watch, checked against the watch
 * app's code (WatchHomeView, InteractiveGrid, StatusPageIntent,
 * HTTPActionRunner, WatchNotificationCameraStream). */
export const SCREEN_HOW_TO: Readonly<Record<HowToScreen, HowTo>> = {
  "pages": {
    art: "swipe", label: "On your watch",
    how: "Swipe left or right to move between pages. Tap a tile to use it. Touch and hold a tile for its quick menu.",
    use: "Your everyday controls, like lights, scenes and cameras. The first page is the one the app starts on.",
  },
  "menus": {
    art: "radial", label: "On your watch",
    how: "Touch and hold an empty spot for the Anywhere menu, or hold a tile for its quick menu. Slide to a slot, then lift your finger.",
    use: "Shortcuts and quick controls without leaving the page you are on.",
  },
  "status-pages": {
    art: "list", label: "On your watch",
    how: "Open one from a status page tile, from a menu slot, or by asking Siri to show a status page.",
    use: "Checking things fast. A status page only shows things. To control something, use a tile.",
  },
  "rooms": {
    art: "room", label: "On your watch",
    how: "While the app is open, the watch opens the page you set for the room you walk into.",
    use: "A page for each room, like the kitchen lights in the kitchen. It needs a sensor that knows your room, like Bermuda.",
  },
  "voice": {
    art: "voice", label: "On your watch",
    how: "Tap an Assist tile or an Ask Assist menu slot, then talk. A Speak tile or slot plays your words on your speakers.",
    use: "Asking Home Assistant things hands free, and one tap phrases like \"Dinner is ready\" from Pick from List.",
  },
  "watch-complications": {
    art: "face", label: "On your watch",
    how: "Touch and hold the watch face, tap Edit, then pick Wrist Assistant for a complication spot.",
    use: "Seeing things at a glance without opening the app, like the temperature or whether the door is locked.",
  },
  "http-actions": {
    art: "web", label: "On your watch",
    how: "Tap a tile, pick a menu slot or tap a complication. Home Assistant sends the request for the watch.",
    use: "Things Home Assistant has no button for, like a webhook or a call to another service.",
  },
  "cameras": {
    art: "crop", label: "In your alerts",
    how: "When an alert has a camera picture, your watch and iPhone show only the part you frame here.",
    use: "Doorbell and motion alerts, so the door or the person fills the small screen. The full camera view still shows the whole picture.",
  },
  "photos": {
    art: "photo", label: "On your watch",
    how: "A page whose Background is a photo shows it behind its tiles, on the watch and on the iPhone.",
    use: "A look of its own for each room, like a picture of the kitchen behind the kitchen lights.",
  },
  "parts": {
    art: "layers", label: "In the editor",
    how: "In a complication's Layers card, press + Add and pick one from Saved parts. Its layers drop in, ready to point at your entities.",
    use: "A clock, a gauge or a badge you made once, put on another face without drawing it again.",
  },
};

/** The how-to for a screen, or undefined for one without (Settings). */
export function screenHowTo(id: string): HowTo | undefined {
  return Object.hasOwn(SCREEN_HOW_TO, id) ? SCREEN_HOW_TO[id as HowToScreen] : undefined;
}

/** A how-to card: a chip with a small drawing, then how the thing is used on
 * the watch and what it is good for. Set `--howto-hue` on the card or a
 * parent to give the chip's outline the screen's hue. */
export function renderHowTo(how: HowTo): TemplateResult {
  return html`<section class="howto" aria-label=${how.label}>
    <span class="howto-chip"><svg class="howto-art" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ART[how.art]}</svg></span>
    <span class="howto-t">
      <span class="howto-k">${how.label}</span>
      <b>${how.how}</b>
      <span class="howto-use"><span class="howto-k">Good for</span> ${how.use}</span>
    </span>
  </section>`;
}

export const howToStyles = css`
  .howto {
    position: relative; z-index: 1; display: flex; align-items: flex-start; gap: 12px;
    width: min(560px, calc(100% - 24px)); box-sizing: border-box; margin: 4px auto 10px; padding: 12px 14px;
    border: 1px solid var(--wa-line-strong); border-radius: 12px; background: var(--wa-card); color: var(--wa-ink);
  }
  .howto-chip {
    flex: none; width: 38px; height: 38px; box-sizing: border-box; display: grid; place-items: center;
    border: 1px solid var(--howto-hue, var(--wa-stage-hue, var(--wa-line-strong))); border-radius: 10px; color: var(--wa-ink);
  }
  .howto-art { width: 22px; height: 22px; }
  .howto-t { display: flex; flex-direction: column; gap: 3px; min-width: 0; font-size: 13px; line-height: 1.4; }
  .howto-t > b { font-weight: 600; }
  .howto-k { font-size: 10.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted); }
  .howto-use { font-size: 12.5px; color: var(--wa-label); }
  .howto-use > .howto-k { margin-right: 4px; }
`;
