// The panel's way into the Pages tab (`all-pages.ts`), kept out of
// `panel.ts`: the address it answers to and the one `import()` that loads
// its element. Only this file is in the panel's first download.
//
// The address is `/all-pages`, not `/pages`: `/pages` and `/pages/<id>` are
// the Watch app's page editor (`hook.ts`).

import { css, html, type TemplateResult } from "lit";
import type { HassLike, OwnerSummary } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";
import type { PanelRoute } from "./hook.js";

export const ALL_PAGES_PATH = "/all-pages";

export function isAllPagesRoute(route: PanelRoute | undefined): boolean {
  const path = route?.path ?? "";
  return path === ALL_PAGES_PATH || path.startsWith(`${ALL_PAGES_PATH}/`);
}

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
   * `status_pages` an info page in its status pages editor. The element has
   * already picked the page there. */
  onOpen: (ownerId: string, kind: "watch" | "iphone", what?: "pages" | "status_pages") => void;
  /** Called once the chunk has loaded or failed, to draw again. */
  onLoaded: () => void;
}

/** The Pages tab's body. Until the chunk is in, a line stands in. */
export function renderAllPagesView(input: AllPagesViewInput): TemplateResult {
  const ready = customElements.get("wa-all-pages") !== undefined;
  if (!ready && !loadFailed) void loadAllPages().then(input.onLoaded, input.onLoaded);
  if (!ready) {
    return html`<div class="ap-loading">${loadFailed ? "The Pages tab did not load. Reload the page to try again." : "Loading…"}</div>`;
  }
  return html`<wa-all-pages .hass=${input.hass} .owners=${input.owners} .ownersReady=${input.ownersReady} .phones=${input.phones}
    .icons=${input.icons} .iconsTick=${input.iconsTick} .onOpen=${input.onOpen}></wa-all-pages>`;
}

/** The stand-in line's look, added to the panel's sheet. */
export const allPagesHookStyles = css`
  .ap-loading { flex: 1 1 auto; padding: 24px clamp(12px, 3vw, 28px); font-size: 13px; color: var(--wa-muted); background: var(--wa-bg); }
`;
