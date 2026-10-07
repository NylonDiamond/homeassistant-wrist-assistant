// Skip open and close animation on a Peek page tile: the panel reads and
// writes `peekDisableAnimation` as the phone's old toggle did (on is `true`,
// off removes the key), only on a `show_page.` tile, and keeps every other
// key of the tile and the document as it read them.

import { describe, expect, it } from "vitest";

import pageKeys from "../src/watch-pages/page-keys.json";
import type { WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { setWatchTilePeekSkipAnimation, watchPeekSkipAnimation } from "../src/watch-pages/tile-settings-model.js";

const PAGE = "C3A0E000-0000-4000-8000-000000000001";
const TARGET = "C3A0E000-0000-4000-8000-000000000002";
const T = "C3A0E000-0000-4000-8000-0000000000A1";

function documentWith(tile: WatchPageTile): WatchPagesDocument {
  return {
    schemaVersion: 1,
    futureTopLevel: { kept: true },
    pages: [{ id: PAGE, name: "Living", items: [tile], futurePageKey: 3 }],
  } as WatchPagesDocument;
}

function tileIn(document: WatchPagesDocument): WatchPageTile {
  const page = (document.pages as { items: WatchPageTile[] }[])[0]!;
  return page.items[0]!;
}

const peek = (extra: Record<string, unknown> = {}): WatchPageTile => ({
  id: T,
  entityId: `show_page.${TARGET}`,
  customLabel: "Upstairs",
  futureTileKey: "kept",
  ...extra,
});

describe("Skip open and close animation", () => {
  it("is a bool key of a tile that the watch reads as off when absent", () => {
    const spec = (pageKeys as unknown as { types: Record<string, { keys: Record<string, unknown> }> }).types;
    const tileKeys = Object.values(spec).find((t) => "peekDisableAnimation" in t.keys)?.keys;
    expect(tileKeys?.peekDisableAnimation).toEqual({ type: "bool", required: false, default: false });
  });

  it("reads off, on, and nothing for a tile that is not a Peek page tile", () => {
    expect(watchPeekSkipAnimation(peek())).toBe(false);
    expect(watchPeekSkipAnimation(peek({ peekDisableAnimation: false }))).toBe(false);
    expect(watchPeekSkipAnimation(peek({ peekDisableAnimation: true }))).toBe(true);
    // A value of the wrong type reads as off, as the watch's decode would.
    expect(watchPeekSkipAnimation(peek({ peekDisableAnimation: "yes" }))).toBe(false);
    expect(watchPeekSkipAnimation({ id: T, entityId: `page.${TARGET}` })).toBeUndefined();
    expect(watchPeekSkipAnimation({ id: T, entityId: "light.desk" })).toBeUndefined();
  });

  it("on writes true, off removes the key, and every other key stays", () => {
    const d = documentWith(peek());
    const on = setWatchTilePeekSkipAnimation(d, PAGE, T, true);
    expect(tileIn(on)).toEqual({ ...peek(), peekDisableAnimation: true });
    expect((on as Record<string, unknown>).futureTopLevel).toEqual({ kept: true });
    expect((on.pages as Record<string, unknown>[])[0]!.futurePageKey).toBe(3);
    const off = setWatchTilePeekSkipAnimation(on, PAGE, T, false);
    expect(tileIn(off)).toEqual(peek());
    expect("peekDisableAnimation" in tileIn(off)).toBe(false);
    // A stored false is removed too, as the phone's toggle wrote nil.
    expect(tileIn(setWatchTilePeekSkipAnimation(documentWith(peek({ peekDisableAnimation: false })), PAGE, T, false))).toEqual(peek());
  });

  it("changes nothing for another kind, an unknown tile or a value that is not a bool", () => {
    const link = documentWith({ id: T, entityId: `page.${TARGET}` });
    expect(setWatchTilePeekSkipAnimation(link, PAGE, T, true)).toBe(link);
    const d = documentWith(peek());
    expect(setWatchTilePeekSkipAnimation(d, PAGE, "C3A0E000-0000-4000-8000-0000000000FF", true)).toBe(d);
    expect(setWatchTilePeekSkipAnimation(d, PAGE, T, "true" as unknown as boolean)).toBe(d);
    // Already off: nothing to remove.
    expect(setWatchTilePeekSkipAnimation(d, PAGE, T, false)).toBe(d);
  });
});
