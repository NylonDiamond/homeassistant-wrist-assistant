// The panel's way into the menu editor, kept out of `panel.ts`: the old
// device address it still answers to, what the editor's own top bar is
// handed from the panel (the way back, the Home Assistant menu), and the one
// `import()` that loads the editor's own chunk. The same pattern as the page
// editor's (`watch-pages/hook.ts`).
//
// The editor opens one menu of the home, on `/library/menus/<id>`. The old
// device address, `/menus/<owner_watch_id>` as the iPhone app's "Open in
// Home Assistant" builds it, moves to the Menus board focused on that device
// (`boardAddressFor` in panel.ts). Only this file is in the panel's first
// download; `menu-editor.ts` and its model arrive the first time a menu is
// opened.

import { html, type nothing, type TemplateResult } from "lit";
import type { HassLike, OwnerSummary } from "../ha-api.js";
import type { LibraryItemRef } from "../library/item-mode.js";
import type { IconProvider } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";
import type { PanelRoute } from "../watch-pages/hook.js";

export const WATCH_MENUS_PATH = "/menus";

export function isWatchMenusRoute(route: PanelRoute | undefined): boolean {
  const path = route?.path ?? "";
  return path === WATCH_MENUS_PATH || path.startsWith(`${WATCH_MENUS_PATH}/`);
}

/** The watch a link names: the first segment after `/menus/`, decoded.
 * None, or one that does not decode, gives nothing. */
export function watchMenusRouteOwner(route: PanelRoute | undefined): string | undefined {
  const path = route?.path ?? "";
  const lead = `${WATCH_MENUS_PATH}/`;
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
export const WATCH_MENUS_HELP_URL = "https://docs.wrist-assistant.com/watch-app/quick-menu/";

/** What the editor's chunk tells the entry about the menu drafts it keeps. */
export interface WatchMenusDraftProbe {
  dirty(): boolean;
  drop(): void;
}

let draftProbe: WatchMenusDraftProbe | undefined;

/** Called once by the editor's chunk when it loads. */
export function registerWatchMenusDrafts(probe: WatchMenusDraftProbe): void {
  draftProbe = probe;
}

/** Whether a menu draft holds edits, for the panel's leave guards. */
export function watchMenusDirty(): boolean {
  return draftProbe?.dirty() ?? false;
}

/** The person agreed to leave with menu edits unsaved: drop them. */
export function dropWatchMenusDrafts(): void {
  draftProbe?.drop();
}

let loading: Promise<void> | undefined;
let loadFailed = false;

/** Load the editor's chunk once. A failure is remembered and the view asks
 * for a reload (an integration updated under an open page). */
function loadMenuEditor(): Promise<void> {
  loading ??= import("./menu-editor.js").then(
    () => undefined,
    (err: unknown) => {
      loadFailed = true;
      throw err;
    },
  );
  return loading;
}

export interface WatchMenusViewInput {
  hass: HassLike;
  owners: readonly OwnerSummary[];
  narrow: boolean;
  icons: IconProvider;
  iconsTick: number;
  /** Whether the bar offers Home Assistant's menu, as the panel's own does on
   * a phone or with the sidebar hidden. */
  menu: boolean;
  onMenu: () => void;
  onBack: () => void;
  /** The home keeps phone pages: the editor opens an iPhone too. */
  phones?: boolean;
  /** Buttons for the right of the bar. */
  actions: TemplateResult | typeof nothing;
  /** The menu edited (`library/item-mode.ts`). */
  libraryItem?: LibraryItemRef;
  onLoaded: () => void;
}

/** One menu in the editor, which draws its own top bar (the complication
 * editor's, `editor-chrome.ts`) with the way back and the Home Assistant
 * menu handed in here. Until the chunk is in, a plain line with the way back
 * stands in. */
export function renderWatchMenusView(input: WatchMenusViewInput): TemplateResult {
  const ready = customElements.get("wa-menu-editor") !== undefined;
  if (!ready && !loadFailed) void loadMenuEditor().then(input.onLoaded, input.onLoaded);
  return ready
    ? html`<wa-menu-editor .hass=${input.hass} .owners=${input.owners}
        .icons=${input.icons} .iconsTick=${input.iconsTick} ?narrow=${input.narrow}
        .haMenu=${input.menu} .onHaMenu=${input.onMenu} .onBack=${input.onBack}
        .barActions=${input.actions} .phones=${input.phones === true} .libraryItem=${input.libraryItem}></wa-menu-editor>`
    : html`<div class="wp-loading">
        <button class="tb-btn tb-back" title="Back to the Menus tab" @click=${input.onBack}>${uiIcon("left")}<span>Menus</span></button>
        ${loadFailed ? html`<span>The menu editor did not load. Reload the page to try again.</span>` : html`<span>Loading…</span>`}
      </div>`;
}
