// The panel's way into the Shared tab (drawn by `shared-tab.ts`), kept out of
// `panel.ts`: the one `import()` that loads its element. Only this file is in
// the panel's first download. The address is `SHARED_PATH` in `shell.ts`, read
// through `BAR_TABS` like every tab's.

import { html, type TemplateResult } from "lit";
import type { HassLike, OwnerSummary } from "../ha-api.js";

let loading: Promise<void> | undefined;
let loadFailed = false;

/** Load the element's chunk once. A failure is remembered, as the other
 * tabs' are: only a reload fetches chunk names that moved. */
function loadSharedTab(): Promise<void> {
  loading ??= import("./shared-tab.js").then(
    () => undefined,
    (err: unknown) => {
      loadFailed = true;
      throw err;
    },
  );
  return loading;
}

export interface SharedTabViewInput {
  hass: HassLike;
  owners: readonly OwnerSummary[];
  /** A screen's full address, so each card's Open is a real link. */
  hrefOf: (path: string) => string;
  /** A plain click on Open: go there in place. */
  onOpen: (path: string) => void;
  /** Called once the chunk has loaded or failed, to draw again. */
  onLoaded: () => void;
}

/** The tab's body. Until the chunk is in, a line stands in, as on the Pages
 * tab (`.ap-loading`). */
export function renderSharedTabView(input: SharedTabViewInput): TemplateResult {
  const ready = customElements.get("wa-shared-tab") !== undefined;
  if (!ready && !loadFailed) void loadSharedTab().then(input.onLoaded, input.onLoaded);
  if (!ready) {
    return html`<div class="ap-loading">${loadFailed ? "The Shared tab did not load. Reload the page to try again." : "Loading…"}</div>`;
  }
  return html`<wa-shared-tab .hass=${input.hass} .owners=${input.owners} .hrefOf=${input.hrefOf} .onOpen=${input.onOpen}></wa-shared-tab>`;
}
