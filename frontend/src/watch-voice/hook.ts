// The panel's way into the voice editor, kept out of `panel.ts`: the route it
// answers to, the top bar's button, what the editor's own top bar is handed
// from the panel, and the one `import()` that loads the editor's own chunk.
// The same pattern as the menu editor's (`watch-menus/hook.ts`).
//
// The editor lives on a sub-path of the panel, `/wrist-assistant/voice`, and
// `/voice/<owner_watch_id>` opens it on one watch. Only this file is in the
// panel's first download; `voice-editor.ts` and its model arrive the first
// time the route is opened.

import { css, html, nothing, svg, type TemplateResult } from "lit";
import type { HassLike, OwnerSummary } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";
import type { PanelRoute } from "../watch-pages/hook.js";
import { settingsWatches } from "../watch-settings.js";

export const WATCH_VOICE_PATH = "/voice";

export function isWatchVoiceRoute(route: PanelRoute | undefined): boolean {
  const path = route?.path ?? "";
  return path === WATCH_VOICE_PATH || path.startsWith(`${WATCH_VOICE_PATH}/`);
}

/** The watch a link opens the editor on: the first segment after
 * `/voice/`, decoded. None, or one that does not decode, gives nothing. */
export function watchVoiceRouteOwner(route: PanelRoute | undefined): string | undefined {
  const path = route?.path ?? "";
  const lead = `${WATCH_VOICE_PATH}/`;
  if (!path.startsWith(lead)) return undefined;
  const segment = path.slice(lead.length).split("/")[0] ?? "";
  if (segment === "") return undefined;
  try {
    const owner = decodeURIComponent(segment);
    return owner === "" ? undefined : owner;
  } catch {
    return undefined;
  }
}

/** The panel's own address, with or without the editor's sub-path. Without a
 * route it is worked out from the address bar. */
export function watchVoiceUrl(route: PanelRoute | undefined, voice: boolean, pathname = ""): string {
  const prefix = route?.prefix ?? pathname.replace(/\/voice(\/.*)?$/, "");
  return voice ? `${prefix}${WATCH_VOICE_PATH}` : prefix;
}

/** Go to the editor or back, as Home Assistant's own frontend moves between
 * addresses: a new history entry, then `location-changed`. */
export function navigateWatchVoice(route: PanelRoute | undefined, voice: boolean): void {
  const url = watchVoiceUrl(route, voice, window.location.pathname);
  if (url === "" || url === window.location.pathname) return;
  history.pushState(null, "", url);
  window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
}

/** The help page the editor's "?" opens. */
export const WATCH_VOICE_HELP_URL = "https://docs.wrist-assistant.com/watch-app/voice/";

/** What the editor's chunk tells the entry about the voice drafts it keeps. */
export interface WatchVoiceDraftProbe {
  dirty(): boolean;
  drop(): void;
}

let draftProbe: WatchVoiceDraftProbe | undefined;

/** Called once by the editor's chunk when it loads. */
export function registerWatchVoiceDrafts(probe: WatchVoiceDraftProbe): void {
  draftProbe = probe;
}

/** Whether a voice draft holds edits, for the panel's leave guards. */
export function watchVoiceDirty(): boolean {
  return draftProbe?.dirty() ?? false;
}

/** The person agreed to leave with voice edits unsaved: drop them. */
export function dropWatchVoiceDrafts(): void {
  draftProbe?.drop();
}

let loading: Promise<void> | undefined;
let loadFailed = false;

/** Load the editor's chunk once. A failure is remembered and the view asks
 * for a reload (an integration updated under an open page). */
function loadVoiceEditor(): Promise<void> {
  loading ??= import("./voice-editor.js").then(
    () => undefined,
    (err: unknown) => {
      loadFailed = true;
      throw err;
    },
  );
  return loading;
}

/** The button's glyph: a speaker with two waves, stroked like `uiIcon`'s. */
export function voiceGlyph(): TemplateResult {
  return html`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svg`<path d="M4 9.5H7.5L12 5.5V18.5L7.5 14.5H4Z" /><path d="M15.5 9.2A4 4 0 0 1 15.5 14.8" /><path d="M18.2 6.8A7.5 7.5 0 0 1 18.2 17.2" />`}</svg>`;
}

/** The top bar's way in, beside Menus. Only in a home with a watch, as for
 * Pages and Menus. */
export function renderWatchVoiceButton(owners: readonly OwnerSummary[], open: () => void): TemplateResult | typeof nothing {
  if (settingsWatches(owners).length === 0) return nothing;
  return html`<button class="tb-btn tb-voice" title="The watch's voice defaults, phrases and watch voice"
    @click=${open}>${voiceGlyph()}<span>Voice</span></button>`;
}

export interface WatchVoiceViewInput {
  hass: HassLike;
  owners: readonly OwnerSummary[];
  ownerId: string | undefined;
  narrow: boolean;
  icons: IconProvider;
  iconsTick: number;
  /** Whether the bar offers Home Assistant's menu. */
  menu: boolean;
  onMenu: () => void;
  onBack: () => void;
  /** The panel's Watch app row owns the watch (`watch-row.ts`): the editor
   * follows `ownerId` and leaves out its own watch picker, the way back and
   * its links to the other screens. Left out, the editor is as it was. */
  shell?: boolean;
  /** Buttons for the right of the bar: the panel's Watch settings. */
  actions: TemplateResult | typeof nothing;
  /** Dialogs the bar's buttons open. */
  dialogs: TemplateResult | typeof nothing;
  onLoaded: () => void;
}

/** The whole panel while the route is `/voice`: the editor, which draws its
 * own top bar with the way back, the Home Assistant menu and the panel's
 * Watch settings button handed in here. Until the chunk is in, a plain line
 * with the way back stands in. */
export function renderWatchVoiceView(input: WatchVoiceViewInput): TemplateResult {
  const ready = customElements.get("wa-voice-editor") !== undefined;
  if (!ready && !loadFailed) void loadVoiceEditor().then(input.onLoaded, input.onLoaded);
  return html`${input.dialogs}
    ${ready
      ? html`<wa-voice-editor .hass=${input.hass} .owners=${input.owners} .ownerId=${input.ownerId}
          .icons=${input.icons} .iconsTick=${input.iconsTick} ?narrow=${input.narrow}
          .haMenu=${input.menu} .onHaMenu=${input.onMenu} .onBack=${input.onBack}
          .barActions=${input.actions} .shellOwnsWatch=${input.shell === true}></wa-voice-editor>`
      : html`<div class="wp-loading">
          ${input.shell === true ? nothing : html`<button class="tb-btn tb-back" title="Back to complications" @click=${input.onBack}>${uiIcon("left")}<span>Complications</span></button>`}
          ${loadFailed ? html`<span>The voice editor did not load. Reload the page to try again.</span>` : html`<span>Loading…</span>`}
        </div>`}`;
}

/** The button's look, added to the panel's sheet beside the menu editor's. */
export const watchVoiceHookStyles = css`
  button.tb-btn.tb-voice { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-voice svg.ui-icon { width: 14px; height: 14px; }
`;
