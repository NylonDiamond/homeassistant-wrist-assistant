// The panel's way into the status page editor, kept out of `panel.ts`: the
// old device address it still answers to, what the editor's own top bar is
// handed from the panel (the way back, the Home Assistant menu), and the one
// `import()` that loads the editor's own chunk. The same pattern as the menu
// editor's (`watch-menus/hook.ts`).
//
// The editor opens one status page of the home, on
// `/library/status_pages/<id>`. The old device address,
// `/status-pages/<owner_watch_id>`, moves to the Status pages board focused
// on that device (`boardAddressFor` in panel.ts). Only this file is in the
// panel's first download; `status-pages-editor.ts`, its model and its tables
// arrive the first time a status page is opened.

import { html, type nothing, type TemplateResult } from "lit";
import type { HassLike, OwnerSummary } from "../ha-api.js";
import type { LibraryItemRef } from "../library/item-mode.js";
import type { IconProvider } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";
import type { PanelRoute } from "../watch-pages/hook.js";

export const WATCH_STATUS_PAGES_PATH = "/status-pages";

export function isWatchStatusPagesRoute(route: PanelRoute | undefined): boolean {
  const path = route?.path ?? "";
  return path === WATCH_STATUS_PAGES_PATH || path.startsWith(`${WATCH_STATUS_PAGES_PATH}/`);
}

/** The watch a link names: the first segment after `/status-pages/`,
 * decoded. None, or one that does not decode, gives nothing. */
export function watchStatusPagesRouteOwner(route: PanelRoute | undefined): string | undefined {
  const path = route?.path ?? "";
  const lead = `${WATCH_STATUS_PAGES_PATH}/`;
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
export const WATCH_STATUS_PAGES_HELP_URL = "https://docs.wrist-assistant.com/features/status-pages/";

/** What the editor's chunk tells the entry about the drafts it keeps. */
export interface WatchStatusPagesDraftProbe {
  dirty(): boolean;
  drop(): void;
}

let draftProbe: WatchStatusPagesDraftProbe | undefined;

/** Called once by the editor's chunk when it loads. */
export function registerWatchStatusPagesDrafts(probe: WatchStatusPagesDraftProbe): void {
  draftProbe = probe;
}

/** Whether a status pages draft holds edits, for the panel's leave guards. */
export function watchStatusPagesDirty(): boolean {
  return draftProbe?.dirty() ?? false;
}

/** The person agreed to leave with status page edits unsaved: drop them. */
export function dropWatchStatusPagesDrafts(): void {
  draftProbe?.drop();
}

let loading: Promise<void> | undefined;
let loadFailed = false;

/** Load the editor's chunk once. A failure is remembered and the view asks
 * for a reload (an integration updated under an open page). */
function loadStatusPagesEditor(): Promise<void> {
  loading ??= import("./status-pages-editor.js").then(
    () => undefined,
    (err: unknown) => {
      loadFailed = true;
      throw err;
    },
  );
  return loading;
}

export interface WatchStatusPagesViewInput {
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
  /** The status page edited (`library/item-mode.ts`). */
  libraryItem?: LibraryItemRef;
  /** Open another item of the library, from the list. */
  onOpenItem?: (id: string) => void;
  /** Open a device's board focused on it (On each device). */
  onOpenBoard?: (ownerId: string) => void;
  onLoaded: () => void;
}

/** One status page in the editor, which draws its own top bar with the way
 * back and the Home Assistant menu handed in here. Until the chunk is in, a
 * plain line with the way back stands in. */
export function renderWatchStatusPagesView(input: WatchStatusPagesViewInput): TemplateResult {
  const ready = customElements.get("wa-status-pages-editor") !== undefined;
  if (!ready && !loadFailed) void loadStatusPagesEditor().then(input.onLoaded, input.onLoaded);
  return ready
    ? html`<wa-status-pages-editor .hass=${input.hass} .owners=${input.owners}
        .icons=${input.icons} .iconsTick=${input.iconsTick} ?narrow=${input.narrow}
        .haMenu=${input.menu} .onHaMenu=${input.onMenu} .onBack=${input.onBack}
        .barActions=${input.actions} .phones=${input.phones === true} .libraryItem=${input.libraryItem}
        .onOpenItem=${input.onOpenItem} .onOpenBoard=${input.onOpenBoard}></wa-status-pages-editor>`
    : html`<div class="wp-loading">
        <button class="tb-btn tb-back" title="Back to the Status pages tab" @click=${input.onBack}>${uiIcon("left")}<span>Status pages</span></button>
        ${loadFailed ? html`<span>The status page editor did not load. Reload the page to try again.</span>` : html`<span>Loading…</span>`}
      </div>`;
}
