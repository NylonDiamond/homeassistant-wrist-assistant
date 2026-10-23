// The panel's way to Home's lineup element (`home-lineup.ts`), kept out of
// `panel.ts` so the library store and its pictures stay out of the panel's
// first download: the one `import()` that loads it, and a line until it
// has.

import { html, type TemplateResult } from "lit";
import type { HassLike } from "./ha-api.js";
import type { LibraryKind } from "./library/client.js";
import type { IconProvider } from "./renderer.js";

let loading: Promise<void> | undefined;
let loadFailed = false;

function loadLineup(): Promise<void> {
  loading ??= import("./home-lineup.js").then(
    () => undefined,
    (err: unknown) => {
      loadFailed = true;
      throw err;
    },
  );
  return loading;
}

export interface HomeLineupInput {
  hass: HassLike;
  ownerId: string;
  kind: "watch" | "iphone";
  phones: boolean;
  icons: IconProvider;
  iconsTick: number;
  onEdit: (kind: LibraryKind, id: string) => void;
  onChange: (kind: LibraryKind) => void;
  /** Called once the chunk has loaded or failed, to draw again. */
  onLoaded: () => void;
}

export function renderHomeLineup(input: HomeLineupInput): TemplateResult {
  const ready = customElements.get("wa-home-lineup") !== undefined;
  if (!ready && !loadFailed) void loadLineup().then(input.onLoaded, input.onLoaded);
  if (!ready) return html`<p class="hl-empty">${loadFailed ? "This part of Home did not load. Reload the page to try again." : "Loading…"}</p>`;
  return html`<wa-home-lineup .hass=${input.hass} .ownerId=${input.ownerId} .kind=${input.kind} .phones=${input.phones}
    .icons=${input.icons} .iconsTick=${input.iconsTick} .onEdit=${input.onEdit} .onChange=${input.onChange}></wa-home-lineup>`;
}
