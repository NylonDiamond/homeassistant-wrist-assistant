// The checklist's third step, On a page (`waiting.ts` has the checklist):
// whether the map is on a page any device shows, and Add page for each
// watch and iPhone the panel knows.
//
// The step is done when a library page that some device has holds a Home
// map tile of one of the map's floors (`home_map.<floorId>`). Add page puts
// a new last page on that one device, showing the floor on the stage: for an
// iPhone a map page (`mapPage: true` and its one Home map tile, as the New
// page sheet's Home map start makes it), for a watch a page with one Home
// map tile (as Add tile's Home map adds it). It runs what New page runs: the
// device's first record asks first, a watch that waits for its iPhone says
// why and adds nothing, the page is made in the library and then ticked on
// the device, a refused write says why in the device's row, and a device on
// the free plan gets the plain line that every page after the first shows a
// Get Pro mark. After the add the row says Added, with a link to the page in
// the page editor.

import type { HassLike, OwnerSummary } from "../ha-api.js";
import { fetchWatchConfig } from "../ha-api.js";
import type { LibraryObject } from "../library/client.js";
import { type Library, countFor } from "../library/model.js";
import { type LibraryListening, type LibraryStore, libraryStore } from "../library/store.js";
import { mayMakeFirst } from "../move-wait-out.js";
import { type LinkDevice, freePlanText, linkDevicesOf } from "../watch-pages/devices.js";
import { newWatchPage, randomWatchId } from "../watch-pages/edit.js";
import { newMapWatchPage } from "../watch-pages/map-page.js";
import { type WatchPage, type WatchPagesDocument, isJsonObject, tileEntityId, tileKind, tileTarget, watchPageTiles } from "../watch-pages/model.js";
import { addNewWatchTile } from "../watch-pages/tile-new.js";
import { type HomeMapDocument, type HomeMapFloor, homeMapFloorName, sameHomeMapId } from "./model.js";

/** What a device's row says it gets. */
export const HOME_MAP_PAGE_LINES = {
  iphone: "A full page with the live 3D map.",
  watch: "A map tile on a page. A tap opens the map.",
} as const;

/** One device's row of the step. */
export interface HomeMapPageRow {
  device: LinkDevice;
  line: string;
  busy: boolean;
  /** The page Add page made, for its Open link. */
  added?: string;
  /** Why the add did not go ahead, or the free plan's line. */
  note?: { kind: "ok" | "warn" | "err"; text: string };
}

/** Whether a page some device shows holds a Home map tile of the map's
 * floors. */
export function homeMapOnAPage(library: Pick<Library, "pages"> | undefined, doc: Pick<HomeMapDocument, "floors"> | null | undefined): boolean {
  if (library === undefined || doc === null || doc === undefined) return false;
  return library.pages.some((entry) => entry.owners.length > 0 && isJsonObject(entry.item) && watchPageTiles(entry.item as unknown as WatchPage).some((tile) => {
    const id = tileEntityId(tile);
    return tileKind(id) === "home_map" && doc.floors.some((f) => sameHomeMapId(f.id, tileTarget(id)));
  }));
}

/** The name of a page Add page makes: Home map, or the floor's name on a
 * map of several floors. */
export function homeMapPageName(doc: Pick<HomeMapDocument, "floors">, floor: HomeMapFloor): string {
  return doc.floors.length > 1 ? homeMapFloorName(floor) : "Home map";
}

/** The page document Add page makes for a device: a map page for an
 * iPhone, a page with one Home map tile for a watch. */
export function homeMapPageDocument(kind: LinkDevice["kind"], pageId: string, name: string, floorId: string): WatchPagesDocument {
  const id = pageId.toUpperCase();
  if (kind === "iphone") return { schemaVersion: 1, pages: [newMapWatchPage(id, name, floorId)] };
  const empty: WatchPagesDocument = { schemaVersion: 1, pages: [newWatchPage(id, name)] };
  return addNewWatchTile(empty, id, { kind: "homeMap", floor: { id: floorId } }, { last: true }).document;
}

export class HomeMapPageStep {
  owners: readonly OwnerSummary[] = [];
  phones = false;
  private store: LibraryStore | undefined;
  private listening: LibraryListening | undefined;
  private readonly busy = new Set<string>();
  private readonly added = new Map<string, string>();
  private readonly notes = new Map<string, NonNullable<HomeMapPageRow["note"]>>();

  constructor(private readonly redraw: () => void) {}

  /** Read the library and follow it while the editor is open. */
  follow(hass: HassLike | undefined): void {
    if (hass === undefined) return;
    const store = libraryStore(hass);
    const ids = this.owners.map((o) => o.owner_watch_id);
    if (this.store !== store || this.listening === undefined) {
      this.listening?.stop();
      this.store = store;
      this.listening = store.listen(() => this.redraw(), ids);
    } else this.listening.update(ids);
  }

  stop(): void {
    this.listening?.stop();
    this.listening = undefined;
  }

  get library(): Library | undefined {
    return this.store?.library;
  }

  /** Whether the step is done. */
  done(doc: HomeMapDocument | null | undefined): boolean {
    return homeMapOnAPage(this.library, doc);
  }

  /** Whether Add page made a page in this visit, so its row stays to say
   * so after the step is done. */
  get addedAny(): boolean {
    return this.added.size > 0;
  }

  /** Every watch and iPhone a page can be on, with its row. */
  rows(): HomeMapPageRow[] {
    return linkDevicesOf(this.owners, this.phones).map((device) => {
      const key = device.ownerId.toUpperCase();
      const added = this.added.get(key);
      const note = this.notes.get(key);
      return {
        device,
        line: HOME_MAP_PAGE_LINES[device.kind],
        busy: this.busy.has(key),
        ...(added === undefined ? {} : { added }),
        ...(note === undefined ? {} : { note }),
      };
    });
  }

  /**
   * Add page: a new last page on the device showing `floor`. `confirm` is
   * the editor's own yes or no, for a first record that asks first.
   */
  async add(hass: HassLike | undefined, doc: HomeMapDocument, floor: HomeMapFloor, device: LinkDevice,
    confirm: (o: { title: string; text?: string; ok: string }) => Promise<boolean>): Promise<void> {
    const store = this.store;
    const key = device.ownerId.toUpperCase();
    if (hass === undefined || store === undefined || this.busy.has(key)) return;
    this.notes.delete(key);
    // A first record that would replace what the watch runs asks first, in
    // the editor's own dialog.
    let asked: string | undefined;
    let may = mayMakeFirst(this.owners, this.library, device.ownerId, "pages", (text) => {
      asked = text;
      return false;
    });
    if (!may.go && asked !== undefined) {
      if (!(await confirm({ title: `Add a page to ${device.name}?`, text: asked, ok: "Add page" }))) return;
      may = mayMakeFirst(this.owners, this.library, device.ownerId, "pages", () => true);
    }
    if (!may.go) {
      if (may.note !== undefined) this.notes.set(key, { kind: "warn", text: `Not added on ${device.name}. ${may.note}` });
      this.redraw();
      return;
    }
    this.busy.add(key);
    this.redraw();
    try {
      const document = homeMapPageDocument(device.kind, randomWatchId(), homeMapPageName(doc, floor), floor.id);
      const made = await store.createItem("pages", document as unknown as LibraryObject);
      if (!made.ok) {
        this.notes.set(key, { kind: "err", text: `Not added. ${made.text}` });
        return;
      }
      const picked = await store.pick(device.ownerId, "pages", made.reply.id, true);
      if (!picked.ok) {
        this.notes.set(key, { kind: "err", text: `Not added on ${device.name}. ${picked.text}` });
        return;
      }
      this.added.set(key, made.reply.id);
      await this.sayFreePlan(hass, device);
    } finally {
      this.busy.delete(key);
      this.redraw();
    }
  }

  /** On the free plan, a second page shows a Get Pro mark in the apps: one
   * plain line says so, as a tick on the Pages tab does. */
  private async sayFreePlan(hass: HassLike, device: LinkDevice): Promise<void> {
    const library = this.library;
    if (library === undefined || countFor(library, device.ownerId, "pages") < 2) return;
    try {
      const record = await fetchWatchConfig(hass, device.ownerId, "pages");
      const text = record.multiple_pages === false ? freePlanText([device.name]) : undefined;
      if (text !== undefined) this.notes.set(device.ownerId.toUpperCase(), { kind: "ok", text });
    } catch {
      /* the line is only a word: without the record, none */
    }
  }
}
