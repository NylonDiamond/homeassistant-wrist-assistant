// Tile groups made and styled in the panel: Make group with the phone's
// adjacency rule (`areSelectedTilesAdjacent`, `onCreateUnifiedGroup`),
// Ungroup, Leave group, and every key of the group's look, as the old iPhone
// editor wrote them and the watch reads them (`TileGroup`,
// GridConfiguration.swift).

import { describe, expect, it } from "vitest";

import {
  findWatchPage,
  leaveWatchTileGroup,
  makeWatchTileGroup,
  newWatchTileGroup,
  ungroupWatchTileGroup,
  watchTilesAdjacent,
} from "../src/watch-pages/edit.js";
import {
  WATCH_GROUP_SLIDERS,
  setWatchGroupOverlay,
  setWatchGroupOverlayColor,
  setWatchGroupOverlayIntensity,
  setWatchGroupOverlaySize,
  setWatchGroupOverlaySpeed,
  setWatchGroupPattern,
  setWatchGroupPatternColor,
  setWatchGroupPatternOpacity,
  setWatchGroupPatternScale,
  watchGroupLook,
  watchGroupTileIds,
  watchSharedGroupId,
  watchTileGroup,
} from "../src/watch-pages/group-model.js";
import type { JsonObject, WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { renderWatchPagePreview } from "../src/watch-pages/preview.js";

const PAGE = "C3A0E000-0000-4000-8000-0000000000AA";
const A = "C3A0E000-0000-4000-8000-000000000001";
const B = "C3A0E000-0000-4000-8000-000000000002";
const C = "C3A0E000-0000-4000-8000-000000000003";
const D = "C3A0E000-0000-4000-8000-000000000004";
const G = "C3A0E000-0000-4000-8000-0000000000F1";
const NEW = "c3a0e000-0000-4000-8000-00000000abcd";

function tile(id: string, col: number, row: number, colSpan = 3, rowSpan = 3, extra: JsonObject = {}): JsonObject {
  const t: JsonObject = { colSpan, entityId: `spacer.${id}`, gridCol: col, gridRow: row, id, rowSpan, ...extra };
  return Object.fromEntries(Object.keys(t).sort().map((k) => [k, t[k]]));
}

function doc(items: JsonObject[], groups?: unknown[]): WatchPagesDocument {
  const page: JsonObject = groups === undefined ? { id: PAGE, items, name: "Hall" } : { groups, id: PAGE, items, name: "Hall" };
  return { schemaVersion: 1, pages: [page] } as WatchPagesDocument;
}

function pageOf(document: WatchPagesDocument): WatchPage {
  return findWatchPage(document, PAGE)!;
}

function tiles(document: WatchPagesDocument): WatchPageTile[] {
  return pageOf(document).items as WatchPageTile[];
}

function groupsOf(document: WatchPagesDocument): JsonObject[] {
  return pageOf(document).groups as JsonObject[];
}

const sorted = (o: object) => {
  const keys = Object.keys(o);
  return keys.every((k, i) => i === 0 || keys[i - 1]! < k);
};

const newId = () => NEW;

/** A group with this look and an unknown key the panel must keep. */
function grouped(look: JsonObject = {}): WatchPagesDocument {
  const group = { ...newWatchTileGroup(G), futureKey: { kept: true }, ...look };
  return doc([tile(A, 0, 0, 3, 3, { groupId: G }), tile(B, 3, 0, 3, 3, { groupId: G }), tile(C, 6, 0, 3, 3, { groupId: G })], [group]);
}

function groupIn(document: WatchPagesDocument): JsonObject {
  return watchTileGroup(pageOf(document), G)!;
}

describe("adjacency, as the phone's areSelectedTilesAdjacent", () => {
  const page = pageOf(doc([tile(A, 0, 0), tile(B, 3, 0), tile(C, 3, 3), tile(D, 9, 9)]));

  it("takes tiles side by side or one under the other", () => {
    expect(watchTilesAdjacent(page, [A, B])).toBe(true);
    expect(watchTilesAdjacent(page, [B, C])).toBe(true);
    expect(watchTilesAdjacent(page, [A, B, C])).toBe(true);
  });

  it("refuses tiles that only meet at a corner, are apart, or are fewer than two", () => {
    expect(watchTilesAdjacent(page, [A, C])).toBe(false);
    expect(watchTilesAdjacent(page, [A, B, D])).toBe(false);
    expect(watchTilesAdjacent(page, [A])).toBe(false);
    expect(watchTilesAdjacent(page, [A, A.toLowerCase()])).toBe(false);
  });

  it("skips an id the page lacks, and costs nothing for a very tall tile", () => {
    expect(watchTilesAdjacent(page, [A, B, "C3A0E000-0000-4000-8000-0000000000EE"])).toBe(true);
    const tall = pageOf(doc([tile(A, 0, 0, 3, 1_000_000), tile(B, 3, 999_990, 3, 3)]));
    expect(watchTilesAdjacent(tall, [A, B])).toBe(true);
  });
});

describe("Make group", () => {
  it("adds a new TileGroup() with an upper case id and puts the tiles in it", () => {
    const before = doc([tile(A, 0, 0), tile(B, 3, 0), tile(C, 9, 9)], []);
    const out = makeWatchTileGroup(before, PAGE, [A, B], { newId });
    expect(out.groupId).toBe(NEW.toUpperCase());
    expect(groupsOf(out.document)).toEqual([newWatchTileGroup(NEW)]);
    const group = groupsOf(out.document)[0]!;
    expect(group).toEqual({
      backgroundPattern: "none", id: NEW.toUpperCase(), overlayColor: "#FFFFFF",
      overlayIntensity: 1, overlaySize: 1, overlaySpeed: 1, overlayStyle: "none",
    });
    expect(sorted(group)).toBe(true);
    const [a, b, c] = tiles(out.document);
    expect(a!.groupId).toBe(NEW.toUpperCase());
    expect(b!.groupId).toBe(NEW.toUpperCase());
    expect(c).toBe(tiles(before)[2]);
    expect(sorted(a!)).toBe(true);
  });

  it("gives a page with no groups the key at its sorted place", () => {
    const out = makeWatchTileGroup(doc([tile(A, 0, 0), tile(B, 3, 0)]), PAGE, [A, B], { newId });
    expect(Object.keys(pageOf(out.document))).toEqual(["groups", "id", "items", "name"]);
  });

  it("refuses tiles that do not touch", () => {
    const before = doc([tile(A, 0, 0), tile(B, 6, 0)], []);
    const out = makeWatchTileGroup(before, PAGE, [A, B], { newId });
    expect(out.document).toBe(before);
    expect(out.groupId).toBeUndefined();
  });

  it("takes tiles out of the group they were in, which is then repaired", () => {
    const before = grouped();
    const D_TILE = tile(D, 0, 3);
    const withD = doc([...(pageOf(before).items as JsonObject[]), D_TILE], pageOf(before).groups as unknown[]);
    // A and B leave G for the new group; C is left alone in G, so G goes.
    const out = makeWatchTileGroup(withD, PAGE, [A, B, D], { newId });
    expect(groupsOf(out.document).map((g) => g.id)).toEqual([NEW.toUpperCase()]);
    const [a, b, c, d] = tiles(out.document);
    expect([a!.groupId, b!.groupId, d!.groupId]).toEqual([NEW.toUpperCase(), NEW.toUpperCase(), NEW.toUpperCase()]);
    expect("groupId" in c!).toBe(false);
  });

  it("changes nothing when the tiles already share one group", () => {
    const before = grouped();
    const out = makeWatchTileGroup(before, PAGE, [A, B], { newId });
    expect(out.document).toBe(before);
    expect(out.groupId).toBe(G);
  });

  it("reads which group picked tiles share", () => {
    const page = pageOf(grouped());
    expect(watchSharedGroupId(page, [A, B])).toBe(G);
    expect(watchGroupTileIds(page, G.toLowerCase())).toEqual([A, B, C]);
    expect(watchSharedGroupId(pageOf(doc([tile(A, 0, 0), tile(B, 3, 0)], [])), [A, B])).toBeUndefined();
  });
});

describe("Ungroup and Leave group", () => {
  it("Ungroup takes every tile out and removes the group, keeping the tiles' own look", () => {
    const out = ungroupWatchTileGroup(grouped({ backgroundPattern: "dots" }), PAGE, G);
    expect(groupsOf(out)).toEqual([]);
    for (const t of tiles(out)) {
      expect("groupId" in t).toBe(false);
      expect("backgroundPattern" in t).toBe(false);
    }
  });

  it("Leave group with others left: only that tile leaves, the group stays", () => {
    const out = leaveWatchTileGroup(grouped(), PAGE, C);
    expect(groupsOf(out).map((g) => g.id)).toEqual([G]);
    expect(tiles(out).map((t) => t.groupId)).toEqual([G, G, undefined]);
  });

  it("Leave group from the middle splits what is no longer joined", () => {
    // A and C no longer touch: each is alone, so the group is dissolved.
    const out = leaveWatchTileGroup(grouped(), PAGE, B);
    expect(groupsOf(out)).toEqual([]);
    expect(tiles(out).every((t) => !("groupId" in t))).toBe(true);
  });

  it("Leave group with one left: that tile takes the group's look and the group goes", () => {
    const two = doc([tile(A, 0, 0, 3, 3, { groupId: G }), tile(B, 3, 0, 3, 3, { groupId: G })], [
      { ...newWatchTileGroup(G), backgroundPattern: "waves", backgroundPatternOpacity: 0.3, backgroundPatternScale: 2, overlayStyle: "rain", overlayColor: "#112233", overlaySpeed: 0.5 },
    ]);
    const out = leaveWatchTileGroup(two, PAGE, A);
    expect(groupsOf(out)).toEqual([]);
    const [a, b] = tiles(out);
    expect(a).toEqual(tile(A, 0, 0));
    expect(b).toEqual(tile(B, 3, 0, 3, 3, {
      backgroundPattern: "waves", patternOpacity: 0.3, patternScale: 2,
      overlayStyle: "rain", overlayColor: "#112233", overlaySpeed: 0.5, overlayIntensity: 1, overlaySize: 1,
    }));
    expect(sorted(b!)).toBe(true);
  });

  it("refuses a tile in no group", () => {
    const before = doc([tile(A, 0, 0)], []);
    expect(leaveWatchTileGroup(before, PAGE, A)).toBe(before);
  });
});

describe("the group's look", () => {
  it("reads absent keys as the watch decodes them", () => {
    expect(watchGroupLook(newWatchTileGroup(G))).toEqual({
      pattern: "none", patternOpacity: 1, patternScale: 1, patternColor: undefined,
      overlay: "none", overlayColor: "#FFFFFF", overlaySpeed: 1, overlayIntensity: 1, overlaySize: 1,
    });
    // An absent opacity draws 0.5 under a pattern color.
    expect(watchGroupLook({ ...newWatchTileGroup(G), backgroundPatternColor: "#FF0000" }).patternOpacity).toBe(0.5);
  });

  it("Pattern: a pattern picked from none starts at 50%, as the old editor wrote it; None keeps the rest", () => {
    let d = setWatchGroupPattern(grouped(), PAGE, G, "stripes");
    expect(groupIn(d)).toMatchObject({ backgroundPattern: "stripes", backgroundPatternOpacity: 0.5 });
    expect(sorted(groupIn(d))).toBe(false); // the unknown key sits at the end
    d = setWatchGroupPattern(d, PAGE, G, "none");
    expect(groupIn(d)).toMatchObject({ backgroundPattern: "none", backgroundPatternOpacity: 0.5 });
    // A stored opacity is never touched by a pattern pick.
    d = setWatchGroupPattern(grouped({ backgroundPatternOpacity: 0.8 }), PAGE, G, "dots");
    expect(groupIn(d).backgroundPatternOpacity).toBe(0.8);
    // Unknown values are refused.
    const before = grouped();
    expect(setWatchGroupPattern(before, PAGE, G, "plaid")).toBe(before);
  });

  it("Opacity: the value an absent key draws removes the key", () => {
    let d = setWatchGroupPatternOpacity(grouped({ backgroundPattern: "dots" }), PAGE, G, 0.42);
    expect(groupIn(d).backgroundPatternOpacity).toBe(0.42);
    d = setWatchGroupPatternOpacity(d, PAGE, G, 1);
    expect("backgroundPatternOpacity" in groupIn(d)).toBe(false);
    // Under a color, 0.5 is what absence draws.
    d = setWatchGroupPatternOpacity(grouped({ backgroundPatternColor: "#FF0000", backgroundPatternOpacity: 0.7 }), PAGE, G, 0.5);
    expect("backgroundPatternOpacity" in groupIn(d)).toBe(false);
    const before = grouped();
    expect(setWatchGroupPatternOpacity(before, PAGE, G, 2)).toBe(before);
  });

  it("Size: 1 removes the key; out of range is refused", () => {
    let d = setWatchGroupPatternScale(grouped(), PAGE, G, 2.5);
    expect(groupIn(d).backgroundPatternScale).toBe(2.5);
    d = setWatchGroupPatternScale(d, PAGE, G, 1);
    expect("backgroundPatternScale" in groupIn(d)).toBe(false);
    expect(setWatchGroupPatternScale(d, PAGE, G, WATCH_GROUP_SLIDERS.patternScale.max + 1)).toBe(d);
  });

  it("Pattern color: null removes the key, and the opacity drawn stays the same", () => {
    // No color, no opacity: drawn at 1. A color would make absence draw 0.5,
    // so 1 is written.
    let d = setWatchGroupPatternColor(grouped(), PAGE, G, "#ff0000");
    expect(groupIn(d)).toMatchObject({ backgroundPatternColor: "#FF0000", backgroundPatternOpacity: 1 });
    // Back to gray: 1 is what absence draws again, so it goes.
    d = setWatchGroupPatternColor(d, PAGE, G, null);
    expect("backgroundPatternColor" in groupIn(d)).toBe(false);
    expect("backgroundPatternOpacity" in groupIn(d)).toBe(false);
    // A color with no opacity draws 0.5; clearing it keeps 0.5.
    d = setWatchGroupPatternColor(grouped({ backgroundPatternColor: "#00FF00" }), PAGE, G, null);
    expect(groupIn(d).backgroundPatternOpacity).toBe(0.5);
    // Only solid colors.
    const before = grouped();
    expect(setWatchGroupPatternColor(before, PAGE, G, "#RAINBOW")).toBe(before);
    expect(setWatchGroupPatternColor(before, PAGE, G, "GRADIENT|#FF0000|#00FF00")).toBe(before);
  });

  it("Overlay and its required keys: always written, even at their defaults", () => {
    let d = setWatchGroupOverlay(grouped(), PAGE, G, "fireflies");
    expect(groupIn(d).overlayStyle).toBe("fireflies");
    d = setWatchGroupOverlayColor(d, PAGE, G, "#00ff00");
    expect(groupIn(d).overlayColor).toBe("#00FF00");
    d = setWatchGroupOverlaySpeed(d, PAGE, G, 2.5);
    d = setWatchGroupOverlayIntensity(d, PAGE, G, 0.75);
    d = setWatchGroupOverlaySize(d, PAGE, G, 1.5);
    expect(groupIn(d)).toMatchObject({ overlaySpeed: 2.5, overlayIntensity: 0.75, overlaySize: 1.5 });
    d = setWatchGroupOverlaySpeed(d, PAGE, G, 1);
    d = setWatchGroupOverlay(d, PAGE, G, "none");
    expect(groupIn(d)).toMatchObject({ overlayStyle: "none", overlaySpeed: 1, overlayColor: "#00FF00" });
    const before = grouped();
    expect(setWatchGroupOverlay(before, PAGE, G, "lava")).toBe(before);
    expect(setWatchGroupOverlaySpeed(before, PAGE, G, 4)).toBe(before);
    expect(setWatchGroupOverlayIntensity(before, PAGE, G, 0.25)).toBe(before);
    expect(setWatchGroupOverlaySize(before, PAGE, G, 3)).toBe(before);
    expect(setWatchGroupOverlayColor(before, PAGE, G, "#RAINBOW")).toBe(before);
  });

  it("keeps every key it does not know, and the rest of the page as it was", () => {
    const before = grouped();
    let d = setWatchGroupPattern(before, PAGE, G, "grid");
    d = setWatchGroupPatternOpacity(d, PAGE, G, 1);
    d = setWatchGroupOverlay(d, PAGE, G, "snow");
    expect(groupIn(d).futureKey).toEqual({ kept: true });
    expect(pageOf(d).items).toBe(pageOf(before).items);
  });

  it("refuses a group the page lacks and a smart page", () => {
    const before = grouped();
    expect(setWatchGroupPattern(before, PAGE, "C3A0E000-0000-4000-8000-0000000000F9", "dots")).toBe(before);
    const smart = { schemaVersion: 1, pages: [{ ...pageOf(before), dynamicConfig: {} }] } as WatchPagesDocument;
    expect(setWatchGroupPattern(smart, PAGE, G, "dots")).toBe(smart);
  });

  it("matches the id without regard to case", () => {
    const d = setWatchGroupOverlay(grouped(), PAGE, G.toLowerCase(), "aurora");
    expect(groupIn(d).overlayStyle).toBe("aurora");
  });
});

describe("the preview", () => {
  function text(t: unknown): string {
    if (typeof t === "symbol" || t === null || t === undefined) return "";
    if (Array.isArray(t)) return t.map(text).join("");
    if (typeof t !== "object") return String(t);
    const r = t as { strings?: readonly string[]; values?: unknown[] };
    if (r.strings === undefined) return "";
    return r.strings.map((s, i) => s + (i < (r.values?.length ?? 0) ? text(r.values![i]) : "")).join("");
  }
  const draw = (page: WatchPage) => text(renderWatchPagePreview({ page, pages: [page], screen: { width: 208, height: 248 }, scale: 1 }));
  const unders = (html: string) => [...html.matchAll(/class="wp-under" style="?background:([^>]*)/g)].map((m) => m[1]!);

  it("draws nothing for a group with no look", () => {
    expect(unders(draw(pageOf(grouped())))).toEqual([]);
  });

  it("draws a group's pattern in its color and a still hint of its overlay on each of its tiles", () => {
    let d = setWatchGroupPattern(grouped(), PAGE, G, "stripes");
    d = setWatchGroupPatternColor(d, PAGE, G, "#FF0000");
    d = setWatchGroupOverlay(d, PAGE, G, "snow");
    d = setWatchGroupOverlayColor(d, PAGE, G, "#00FF00");
    const layers = unders(draw(pageOf(d)));
    expect(layers).toHaveLength(3);
    for (const l of layers) {
      expect(l).toContain("radial-gradient(ellipse at 30% 70%, rgba(0, 255, 0, 0.3)");
      expect(l).toMatch(/255, 0, 0/);
    }
  });

  it("leaves out the overlay hint on a tile with an overlay of its own, which wins on the watch", () => {
    const own = doc([tile(A, 0, 0, 3, 3, { groupId: G, overlayStyle: "rain" }), tile(B, 3, 0, 3, 3, { groupId: G })],
      [{ ...newWatchTileGroup(G), overlayStyle: "snow" }]);
    expect(unders(draw(pageOf(own)))).toHaveLength(1);
  });
});
