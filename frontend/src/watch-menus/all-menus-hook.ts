// The panel's way into the Menus tab (drawn by `all-menus.ts`), kept out of
// `panel.ts`: the address it answers to (the bar matches it through
// `BAR_TABS` in `shell.ts`) and the one `import()` that loads its element.
// Only this file is in the panel's first download.
//
// The address is `/all-menus`, not `/menus`: that, with a device after it,
// is the Watch app's menu editor (`hook.ts`), and marks Home. A device after
// it (`/all-menus/<owner>`) focuses the board on that device, as on the
// Pages tab (`listFocusOf` in `all-pages-hook.ts`).

import { html, type TemplateResult } from "lit";
import type { ListOwnScreen } from "../watch-pages/all-pages-hook.js";
import type { HassLike, OwnerSummary } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";

export const ALL_MENUS_PATH = "/all-menus";

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
  /** Open a menu no device uses in the menu editor's library mode
   * (`library/item-mode.ts`); New menu opens the new one there too. */
  onOpenLibrary?: (menuId: string) => void;
  /** The device the address focuses. */
  focusOwner?: string;
  /** Focus a device, or every device with undefined: move to its address. */
  onFocus: (ownerId: string | undefined) => void;
  /** Open a device's Settings, Rooms or Voice. */
  onOpenScreen: (ownerId: string, kind: "watch" | "iphone", screen: ListOwnScreen) => void;
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
    .icons=${input.icons} .iconsTick=${input.iconsTick} .onOpen=${input.onOpen} .onOpenLibrary=${input.onOpenLibrary}
    .focusOwner=${input.focusOwner} .onFocus=${input.onFocus} .onOpenScreen=${input.onOpenScreen}></wa-all-menus>`;
}
