// The shared page fixtures: real documents written by the phone and
// documents written by the panel, copied here from the app repo, which is
// canonical (`WristAssistantTests/Fixtures/pages`), by
// `scripts/sync-complication-fixtures.sh`. Each one must open and save back
// with no edit as the same JSON, and read as sane pages and tiles.
//
// Only the files directly in the folder are documents; `merge/` holds the
// merge cases, which are not. The folder may be missing or empty.

import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  WATCH_GRID_COLUMNS,
  asWatchPagesDocument,
  encodeWatchPages,
  isSmartWatchPage,
  openWatchPages,
  sizeOf,
  tileEntityId,
  tileGeometry,
  tileKind,
  tileDrawsOn,
  tileKindLabel,
  watchPageExtent,
  watchPageId,
  watchPageLayout,
  watchPageTiles,
  watchPagesOf,
} from "../src/watch-pages/model.js";
import tileDevicesTable from "../src/watch-pages/tile-devices.json";

const dir = join(__dirname, "fixtures-pages");
const files = existsSync(dir)
  ? readdirSync(dir, { withFileTypes: true }).filter((e) => e.isFile() && e.name.endsWith(".json")).map((e) => e.name).sort()
  : [];

describe("shared page fixtures", () => {
  it("are read from the folder when there is one", () => {
    expect(files.every((f) => f.endsWith(".json"))).toBe(true);
  });

  for (const file of files) {
    describe(file, () => {
      const text = readFileSync(join(dir, file), "utf8");
      const parsed: unknown = JSON.parse(text);

      it("saves back unchanged", () => {
        const doc = asWatchPagesDocument(parsed);
        expect(doc).toBeDefined();
        const out = encodeWatchPages(openWatchPages(doc!));
        expect(out).toBe(doc);
        expect(JSON.stringify(out)).toBe(JSON.stringify(JSON.parse(text)));
        expect(sizeOf(out)).toBe(Buffer.byteLength(JSON.stringify(JSON.parse(text)), "utf8"));
      });

      it("reads as sane pages and tiles", () => {
        const doc = asWatchPagesDocument(parsed)!;
        expect(typeof doc.schemaVersion).toBe("number");
        expect(Array.isArray(doc.pages)).toBe(true);
        const pages = watchPagesOf(doc);
        expect(pages.length).toBe((doc.pages as unknown[]).length);
        const ids = pages.map(watchPageId);
        for (const id of ids) expect(id).not.toBe("");
        expect(new Set(ids).size).toBe(ids.length);
        for (const page of pages) {
          const tiles = watchPageTiles(page);
          if (isSmartWatchPage(page)) expect(tiles).toEqual([]);
          const tileIds = tiles.map((t) => t.id);
          expect(new Set(tileIds).size, watchPageId(page)).toBe(tileIds.length);
          for (const tile of tiles) {
            expect(typeof tile.id).toBe("string");
            const entityId = tileEntityId(tile);
            expect(tileKind(entityId), String(tile.id)).not.toBe("");
            expect(tileKindLabel(tileKind(entityId))).not.toBe("");
            const g = tileGeometry(tile);
            expect(g.col + g.colSpan, String(tile.id)).toBeLessThanOrEqual(WATCH_GRID_COLUMNS);
          }
          const layout = watchPageLayout(page, { width: 208, height: 248 });
          expect(layout.tiles.length).toBe(tiles.length);
          for (const t of layout.tiles) {
            for (const n of [t.x, t.y, t.width, t.height]) expect(Number.isFinite(n)).toBe(true);
            expect(t.x + t.width).toBeLessThanOrEqual(208 + 1e-6);
          }
          expect(watchPageExtent(page)).toBeGreaterThanOrEqual(0);
          expect(layout.height).toBeGreaterThanOrEqual(248);
        }
      });
    });
  }
});

// 07 is the iPhone's page: a tile for every key only the iPhone reads and
// one tile of each kind only the iPhone draws. It must keep all of them
// through a save, and a watch must skip exactly the four kinds.
describe("07-phone-tiles.json", () => {
  const file = "07-phone-tiles.json";
  const present = files.includes(file);

  it.skipIf(!present)("holds every iPhone key and kind, and a watch skips the four kinds", () => {
    const doc = asWatchPagesDocument(JSON.parse(readFileSync(join(dir, file), "utf8")))!;
    const tiles = watchPagesOf(doc).flatMap(watchPageTiles);
    const phoneKinds = Object.entries(tileDevicesTable.kinds)
      .filter(([, devices]) => devices.length === 1 && devices[0] === "iphone")
      .map(([kind]) => kind)
      .sort();
    expect([...new Set(tiles.map((t) => tileKind(tileEntityId(t))).filter((k) => phoneKinds.includes(k)))].sort()).toEqual(phoneKinds);
    for (const key of Object.keys(tileDevicesTable.keys)) {
      expect(tiles.some((t) => t[key] !== undefined), key).toBe(true);
    }
    const skipped = tiles.filter((t) => !tileDrawsOn(t, "watch"));
    expect(skipped.map((t) => tileKind(tileEntityId(t))).sort()).toEqual(phoneKinds);
    expect(tiles.every((t) => tileDrawsOn(t, "iphone"))).toBe(true);

    const saved = encodeWatchPages(openWatchPages(doc));
    expect(JSON.stringify(saved)).toBe(JSON.stringify(doc));
  });
});
