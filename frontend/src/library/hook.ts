// The panel's way into two of Home's Library screens, kept out of
// `panel.ts`: the home's page photos (`/photos`) and its parts (`/parts`).
// Each answers to its route and loads its own chunk with one `import()` the
// first time the route is opened, the pattern of the HTTP actions and Cameras
// screens (`watch-http-actions/hook.ts`). Both belong to the whole home, so
// the address names no device, and neither keeps a draft: a delete is the
// only change, and it asks first.

import { html, type TemplateResult } from "lit";
import type { HassLike, OwnerSummary } from "../ha-api.js";
import type { PanelRoute } from "../watch-pages/hook.js";

export const LIBRARY_PHOTOS_PATH = "/photos";
export const LIBRARY_PARTS_PATH = "/parts";

function on(route: PanelRoute | undefined, path: string): boolean {
  const at = route?.path ?? "";
  return at === path || at.startsWith(`${path}/`);
}

export function isLibraryPhotosRoute(route: PanelRoute | undefined): boolean {
  return on(route, LIBRARY_PHOTOS_PATH);
}

export function isLibraryPartsRoute(route: PanelRoute | undefined): boolean {
  return on(route, LIBRARY_PARTS_PATH);
}

/** One screen's chunk, loaded once. A failure is remembered and the view
 * asks for a reload (an integration updated under an open page). */
class Chunk {
  private loading?: Promise<void>;
  failed = false;
  constructor(private readonly load: () => Promise<unknown>) {}
  get(): Promise<void> {
    this.loading ??= this.load().then(
      () => undefined,
      (err: unknown) => {
        this.failed = true;
        throw err;
      },
    );
    return this.loading;
  }
}

const photosChunk = new Chunk(() => import("./photos-screen.js"));
const partsChunk = new Chunk(() => import("./parts-screen.js"));

function waiting(chunk: Chunk, name: string): TemplateResult {
  return html`<div class="wp-loading">
    ${chunk.failed ? html`<span>The ${name} screen did not load. Reload the page to try again.</span>` : html`<span>Loading…</span>`}
  </div>`;
}

export interface LibraryPhotosViewInput {
  hass: HassLike;
  owners: readonly OwnerSummary[];
  narrow: boolean;
  onLoaded: () => void;
}

/** The Photos screen under the row while the route is `/photos`. */
export function renderLibraryPhotosView(input: LibraryPhotosViewInput): TemplateResult {
  const ready = customElements.get("wa-library-photos") !== undefined;
  if (!ready && !photosChunk.failed) void photosChunk.get().then(input.onLoaded, input.onLoaded);
  return ready
    ? html`<wa-library-photos .hass=${input.hass} .owners=${input.owners} ?narrow=${input.narrow}></wa-library-photos>`
    : waiting(photosChunk, "Photos");
}

export interface LibraryPartsViewInput {
  hass: HassLike;
  narrow: boolean;
  /** A part was deleted here, so a list the panel keeps can drop it. */
  onDeleted?: (partId: string) => void;
  onLoaded: () => void;
}

/** The Parts screen under the row while the route is `/parts`. */
export function renderLibraryPartsView(input: LibraryPartsViewInput): TemplateResult {
  const ready = customElements.get("wa-library-parts") !== undefined;
  if (!ready && !partsChunk.failed) void partsChunk.get().then(input.onLoaded, input.onLoaded);
  return ready
    ? html`<wa-library-parts .hass=${input.hass} ?narrow=${input.narrow} .onDeleted=${input.onDeleted}></wa-library-parts>`
    : waiting(partsChunk, "Parts");
}
