// The panel's way into the Menus tab (drawn by `all-menus.ts`), kept out of
// `panel.ts`: the address it answers to and the one `import()` that loads its
// element. Only this file is in the panel's first download.
//
// The address is `/all-menus`, not `/menus`: that, with a device after it,
// is the Watch app's menu editor (`hook.ts`), and marks Home.

import { html, type TemplateResult } from "lit";
import type { HassLike, OwnerSummary } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";
import type { PanelRoute } from "../watch-pages/hook.js";

export const ALL_MENUS_PATH = "/all-menus";

export function isAllMenusRoute(route: PanelRoute | undefined): boolean {
  const at = route?.path ?? "";
  return at === ALL_MENUS_PATH || at.startsWith(`${ALL_MENUS_PATH}/`);
}

let loading: Promise<void> | undefined;
let loadFailed = false;

/** Load the element's chunk once. A failure is remembered, as the page
 * editor's is: only a reload fetches chunk names that moved. */
function loadAllMenus(): Promise<void> {
  loading ??= import("./all-menus.js").then(
    () => undefined,
    (err: unknown) => {
      loadFailed = true;
      throw err;
    },
  );
  return loading;
}

export interface AllMenusViewInput {
  hass: HassLike;
  owners: readonly OwnerSummary[];
  /** The panel has read its device list: an empty one is "no devices". */
  ownersReady: boolean;
  /** The home keeps phone pages: the iPhones are listed too. */
  phones: boolean;
  icons: IconProvider;
  /** Bumped whenever `icons` has something new to draw. */
  iconsTick: number;
  /** Open a device's menu editor. The element has already asked it for
   * the card's menu. */
  onOpen: (ownerId: string, kind: "watch" | "iphone") => void;
  /** Called once the chunk has loaded or failed, to draw again. */
  onLoaded: () => void;
}

/** The tab's body. Until the chunk is in, a line stands in, the Pages
 * tab's (`.ap-loading`, `all-pages-hook.ts`). */
export function renderAllMenusView(input: AllMenusViewInput): TemplateResult {
  const ready = customElements.get("wa-all-menus") !== undefined;
  if (!ready && !loadFailed) void loadAllMenus().then(input.onLoaded, input.onLoaded);
  if (!ready) {
    return html`<div class="ap-loading">${loadFailed ? "The Menus tab did not load. Reload the page to try again." : "Loading…"}</div>`;
  }
  return html`<wa-all-menus .hass=${input.hass} .owners=${input.owners} .ownersReady=${input.ownersReady} .phones=${input.phones}
    .icons=${input.icons} .iconsTick=${input.iconsTick} .onOpen=${input.onOpen}></wa-all-menus>`;
}
