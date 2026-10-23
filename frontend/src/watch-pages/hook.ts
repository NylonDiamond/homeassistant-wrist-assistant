// The panel's way into the page editor, kept out of `panel.ts`: the old
// device address it still answers to, what the editor's own top bar is
// handed from the panel (the way back, the Home Assistant menu), and the one
// `import()` that loads the editor's own chunk.
//
// The editor opens one page of the home, on `/library/pages/<id>`. The old
// device addresses, `/pages/<owner_watch_id>` and
// `/iphone/pages/<owner_watch_id>` as the iPhone app's "Open in Home
// Assistant" builds them, move to the Pages board focused on that device
// (`boardAddressFor` in panel.ts).
//
// Only this file is in the panel's first download. `page-editor.ts`, its
// model and its preview arrive the first time a page is opened.

import { css, html, type nothing, type TemplateResult } from "lit";
import type { HassLike, OwnerSummary } from "../ha-api.js";
import type { LibraryItemRef } from "../library/item-mode.js";
import type { IconProvider } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";

/** What Home Assistant passes a custom panel as `route`. */
export interface PanelRoute {
  prefix: string;
  path: string;
}

export const WATCH_PAGES_PATH = "/pages";

export function isWatchPagesRoute(route: PanelRoute | undefined): boolean {
  const path = route?.path ?? "";
  return path === WATCH_PAGES_PATH || path.startsWith(`${WATCH_PAGES_PATH}/`);
}

/** The device an old link names: `/pages/<owner_watch_id>`, as the iPhone
 * app's "Open in Home Assistant" builds it. Only the first segment after
 * `/pages/` counts. None, or one that does not decode, gives nothing, and the
 * board focuses the remembered device. */
export function watchPagesRouteOwner(route: PanelRoute | undefined): string | undefined {
  const path = route?.path ?? "";
  const lead = `${WATCH_PAGES_PATH}/`;
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

/** The help page the editor's "?" opens. */
export const WATCH_PAGES_HELP_URL = "https://docs.wrist-assistant.com/watch-app/pages-in-home-assistant/";

/** What the editor's chunk tells the entry about the page drafts it keeps. */
export interface WatchPagesDraftProbe {
  /** Whether any kept draft holds edits. */
  dirty(): boolean;
  /** Drop every kept draft. */
  drop(): void;
}

let draftProbe: WatchPagesDraftProbe | undefined;

/** Called once by the editor's chunk when it loads. Before that there can be
 * no draft, so the entry never needs the chunk to answer. */
export function registerWatchPagesDrafts(probe: WatchPagesDraftProbe): void {
  draftProbe = probe;
}

/** Whether a page draft holds edits, for the panel's leave guards. */
export function watchPagesDirty(): boolean {
  return draftProbe?.dirty() ?? false;
}

/** The person agreed to leave with page edits unsaved: drop them, as the
 * complication draft is lost with the panel. */
export function dropWatchPagesDrafts(): void {
  draftProbe?.drop();
}

let loading: Promise<void> | undefined;
let loadFailed = false;

/** Load the editor's chunk once. A failure is remembered and the view asks
 * for a reload rather than trying again on every draw: the usual cause is an
 * integration updated under an open page, whose old chunk names are gone, and
 * only a reload fetches the new entry that names the new ones. */
function loadPageEditor(): Promise<void> {
  loading ??= import("./page-editor.js").then(
    () => undefined,
    (err: unknown) => {
      loadFailed = true;
      throw err;
    },
  );
  return loading;
}

export interface WatchPagesViewInput {
  hass: HassLike;
  owners: readonly OwnerSummary[];
  narrow: boolean;
  icons: IconProvider;
  /** Bumped by the panel whenever `icons` has something new to draw, so the
   * editor (which the provider does not tell) draws again. */
  iconsTick: number;
  /** Whether the bar offers Home Assistant's menu, as the panel's own does on
   * a phone or with the sidebar hidden. */
  menu: boolean;
  onMenu: () => void;
  onBack: () => void;
  /** The home keeps phone pages (`phone-pages.ts`): the editor previews on
   * an iPhone too. */
  phones?: boolean;
  /** Buttons for the right of the bar. */
  actions: TemplateResult | typeof nothing;
  /** The page edited (`library/item-mode.ts`). */
  libraryItem?: LibraryItemRef;
  /** Open another page of the library, from the list. */
  onOpenItem?: (id: string) => void;
  /** Open a device's board focused on it (On each device). */
  onOpenBoard?: (ownerId: string) => void;
  /** Called once the editor's chunk has loaded or failed, to draw again. */
  onLoaded: () => void;
}

/** One page in the editor, which draws its own top bar (the complication
 * editor's, `editor-chrome.ts`) with the way back and the Home Assistant
 * menu handed in here. Until the chunk is in, a plain bar with the way back
 * stands in. */
export function renderWatchPagesView(input: WatchPagesViewInput): TemplateResult {
  const ready = customElements.get("wa-page-editor") !== undefined;
  if (!ready && !loadFailed) void loadPageEditor().then(input.onLoaded, input.onLoaded);
  return ready
    ? html`<wa-page-editor .hass=${input.hass} .owners=${input.owners}
        .icons=${input.icons} .iconsTick=${input.iconsTick} ?narrow=${input.narrow}
        .haMenu=${input.menu} .onHaMenu=${input.onMenu} .onBack=${input.onBack}
        .barActions=${input.actions} .phones=${input.phones === true} .libraryItem=${input.libraryItem}
        .onOpenItem=${input.onOpenItem} .onOpenBoard=${input.onOpenBoard}></wa-page-editor>`
    : html`<div class="wp-loading">
        <button class="tb-btn tb-back" title="Back to the Pages tab" @click=${input.onBack}>${uiIcon("left")}<span>Pages</span></button>
        ${loadFailed ? html`<span>The page editor did not load. Reload the page to try again.</span>` : html`<span>Loading…</span>`}
      </div>`;
}

/** The way back's look, added to the panel's sheet: the glyph and its words
 * on one line, and the line that stands in while an editor loads. The menu
 * and status page editors use it too. */
export const watchPagesHookStyles = css`
  button.tb-btn.tb-back { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-back svg.ui-icon { width: 14px; height: 14px; }
  .wp-loading { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; padding: 12px 16px; color: var(--wa-muted); }
`;
