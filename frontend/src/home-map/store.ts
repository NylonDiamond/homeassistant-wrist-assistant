// The home's map as the panel holds it between screens: whether the
// integration keeps one (the `home_map` capability, from the owners reply),
// and the last map read, shared by the page editor's Home map tiles and the
// Home map page.
//
// The page editor draws a Home map tile from this read and offers the tile
// only once it holds a map with a floor; the Home map page reads and saves
// the map itself and hands each result back here (`keepHomeMap`), so a tile
// drawn after a save shows the saved map. One read per connection, read
// again in the background once it is a minute old, so a map the iPhone saved
// meanwhile reaches the editor without a reload.

import { type HassLike, fetchHomeMap } from "../ha-api.js";
import { type HomeMapRead, readHomeMap } from "./model.js";

/** What the integration advertises once it keeps the home's map. */
export const HOME_MAP_CAPABILITY = "home_map";

/** Whether the owners reply lists `home_map`. An integration older than the
 * list says nothing, so no. */
export function homeMapOn(capabilities: readonly string[] | undefined): boolean {
  return capabilities?.includes(HOME_MAP_CAPABILITY) ?? false;
}

let capable = false;

/** Set by the panel from each owners reply. */
export function setHomeMapCapable(on: boolean): void {
  capable = on;
}

/** Whether the home's integration keeps a map, as the panel last heard. */
export function homeMapCapable(): boolean {
  return capable;
}

/** How old a read may get before the next look reads again. */
export const HOME_MAP_STALE_MS = 60_000;

interface Entry {
  connection: unknown;
  read: HomeMapRead | undefined;
  loading: boolean;
  at: number;
  waiting: Set<() => void>;
}

let entry: Entry | undefined;

function fetchInto(hass: HassLike, held: Entry): void {
  held.loading = true;
  fetchHomeMap(hass).then(
    (reply) => {
      held.loading = false;
      held.at = Date.now();
      const rev = typeof reply?.rev === "number" ? reply.rev : 0;
      // A save from the page that landed while this read was out wins.
      if (held.read === undefined || rev >= held.read.rev) held.read = { doc: readHomeMap(reply?.doc) ?? null, rev };
      const waiting = [...held.waiting];
      held.waiting.clear();
      for (const done of waiting) done();
    },
    () => {
      held.loading = false;
      held.at = Date.now();
      held.waiting.clear();
    },
  );
}

/**
 * The home's map as last read, or undefined while it loads, when the
 * integration keeps none (`homeMapCapable`) or the read failed. The first
 * look starts the read, and a look at a read over a minute old reads again
 * while the old one stands; `onLoad` is called once a read is in, to draw
 * again.
 */
export function homeMapRead(hass: HassLike | undefined, onLoad: () => void): HomeMapRead | undefined {
  // A host with no connection (a test) reads nothing.
  if (!capable || hass?.connection === undefined) return undefined;
  if (entry !== undefined && entry.connection === hass.connection) {
    if (entry.loading) entry.waiting.add(onLoad);
    else if (Date.now() - entry.at > HOME_MAP_STALE_MS) {
      entry.waiting.add(onLoad);
      fetchInto(hass, entry);
    }
    return entry.read;
  }
  const fresh: Entry = { connection: hass.connection, read: undefined, loading: true, at: 0, waiting: new Set([onLoad]) };
  entry = fresh;
  fetchInto(hass, fresh);
  return undefined;
}

/** A map the Home map page read or saved, so every tile draws it. */
export function keepHomeMap(hass: HassLike, read: HomeMapRead): void {
  if (entry === undefined || entry.connection !== hass.connection) {
    entry = { connection: hass.connection, read, loading: false, at: Date.now(), waiting: new Set() };
    return;
  }
  entry.read = read;
  entry.at = Date.now();
}

/** Forget the read and the capability (a test). */
export function forgetHomeMap(): void {
  entry = undefined;
  capable = false;
}
