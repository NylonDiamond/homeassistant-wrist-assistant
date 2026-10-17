// The panel's way into the Pages tab and the Status pages tab (both drawn by
// `all-pages.ts`), kept out of `panel.ts`: the addresses they answer to (the
// bar matches them through `BAR_TABS` in `shell.ts`) and the one `import()`
// that loads their element. Only this file is in the panel's first download.
//
// The addresses are `/all-pages` and `/all-status-pages`, not `/pages` and
// `/status-pages`: those, with a device after them, are the Watch app's page
// editor (`hook.ts`) and status pages editor.

import { css, html, type TemplateResult } from "lit";
import type { HassLike, OwnerSummary } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";

export const ALL_PAGES_PATH = "/all-pages";
export const ALL_STATUS_PAGES_PATH = "/all-status-pages";

let loading: Promise<void> | undefined;
let loadFailed = false;

/** Load the element's chunk once. A failure is remembered, as the page
 * editor's is: only a reload fetches chunk names that moved. */
function loadAllPages(): Promise<void> {
  loading ??= import("./all-pages.js").then(
    () => undefined,
    (err: unknown) => {
      loadFailed = true;
      throw err;
    },
  );
  return loading;
}

export interface AllPagesViewInput {
  /** What the tab lists: the Pages tab's pages, or the Status pages tab's
   * status pages. */
  kind: "pages" | "status_pages";
  hass: HassLike;
  owners: readonly OwnerSummary[];
  /** The panel has read its device list: an empty one is "no devices". */
  ownersReady: boolean;
  /** The home keeps phone pages: the iPhones are listed too. */
  phones: boolean;
  icons: IconProvider;
  /** Bumped whenever `icons` has something new to draw. */
  iconsTick: number;
  /** Open a page in its device's page editor, or with `what`
   * `status_pages` a status page in its status pages editor. The element
   * has already picked the page there, or asked for a new one. */
  onOpen: (ownerId: string, kind: "watch" | "iphone", what?: "pages" | "status_pages") => void;
  /** Open a page or status page no device has in its editor's library
   * mode (`library/item-mode.ts`). */
  onOpenLibrary?: (kind: "pages" | "status_pages", id: string) => void;
  /** Called once the chunk has loaded or failed, to draw again. */
  onLoaded: () => void;
}

/** The tab's body. Until the chunk is in, a line stands in. */
export function renderAllPagesView(input: AllPagesViewInput): TemplateResult {
  const ready = customElements.get("wa-all-pages") !== undefined;
  if (!ready && !loadFailed) void loadAllPages().then(input.onLoaded, input.onLoaded);
  if (!ready) {
    const tab = input.kind === "status_pages" ? "Status pages" : "Pages";
    return html`<div class="ap-loading">${loadFailed ? `The ${tab} tab did not load. Reload the page to try again.` : "Loading…"}</div>`;
  }
  return html`<wa-all-pages .kind=${input.kind} .hass=${input.hass} .owners=${input.owners} .ownersReady=${input.ownersReady} .phones=${input.phones}
    .icons=${input.icons} .iconsTick=${input.iconsTick} .onOpen=${input.onOpen} .onOpenLibrary=${input.onOpenLibrary}></wa-all-pages>`;
}

/** The stand-in line's look, added to the panel's sheet. */
export const allPagesHookStyles = css`
  .ap-loading { flex: 1 1 auto; padding: 24px clamp(12px, 3vw, 28px); font-size: 13px; color: var(--wa-muted); background: var(--wa-bg); }
`;
