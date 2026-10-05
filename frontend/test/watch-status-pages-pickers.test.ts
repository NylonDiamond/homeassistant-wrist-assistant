// The status page pickers elsewhere in the panel read the watch's own status
// pages record first and fall back to the iPhone's catalog: the page
// editor's status page tile (its add, Target menu and preview name) and the
// menu editor's Show Status Page target. A page the record does not list is
// "Not in this watch's status pages".

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  WATCH_NOT_IN_STATUS_PAGES_TEXT,
  WATCH_NOT_ON_IPHONE_TEXT,
  readWatchCatalog,
  watchCatalogKnows,
  watchCatalogWithStatusPages,
  watchLibraryMissingText,
  watchLibraryTileFallbackName,
  watchStatusPagesFromRecord,
} from "../src/watch-pages/catalog.js";
import type { WatchPageTile } from "../src/watch-pages/model.js";
import { watchPreviewTileLabel } from "../src/watch-pages/preview.js";
import { watchLibraryTargetMenu } from "../src/watch-pages/tile-settings-options.js";
import { statusPagesDefaults, statusPagesEmpty } from "../src/watch-status-pages/model.js";

const CATALOG = readWatchCatalog(JSON.parse(readFileSync(join(__dirname, "fixtures-catalog", "catalog.json"), "utf8")), { revision: 3, updatedAt: "2026-10-02T09:30:00Z" });
const CONFIGURED = JSON.parse(readFileSync(join(__dirname, "fixtures-status-pages", "02-configured.json"), "utf8")) as unknown;

const LIGHTS = "00000000-0000-0000-0000-000000000001";
const HOUSE = "5A7E0000-0000-4000-8000-000000000001";

function tile(entityId: string, label?: string): WatchPageTile {
  return { id: "T1", entityId, ...(label === undefined ? {} : { customLabel: label }) } as WatchPageTile;
}

describe("the record's pages, as the pickers list them", () => {
  it("are read from a record with a revision, with their row counts", () => {
    expect(watchStatusPagesFromRecord({ revision: 2, document: CONFIGURED })).toEqual([
      { id: HOUSE, name: "House", rows: 9 },
      { id: LIGHTS, name: "Lights", rows: 1 },
    ]);
    expect(watchStatusPagesFromRecord({ revision: 1, document: statusPagesEmpty() })).toEqual([]);
  });

  it("are none with no record: the pickers fall back to the iPhone", () => {
    expect(watchStatusPagesFromRecord(undefined)).toBeUndefined();
    expect(watchStatusPagesFromRecord({ revision: 0 })).toBeUndefined();
  });
});

describe("the fallback order", () => {
  it("the record first, over the iPhone's list", () => {
    const merged = watchCatalogWithStatusPages(CATALOG, watchStatusPagesFromRecord({ revision: 4, document: statusPagesDefaults() }))!;
    expect(merged.statusPages.map((p) => p.name)).toEqual(["Lights", "Who's Home", "Room Temps", "Doors & Windows", "Low Battery"]);
    expect(merged.statusPagesFromWatch).toBe(true);
    // The rest of the iPhone's catalog is as it was.
    expect(merged.httpActions).toBe(CATALOG.httpActions);
    expect(watchCatalogKnows(merged, "httpAction")).toBe(true);
  });

  it("the iPhone's list with no record", () => {
    expect(watchCatalogWithStatusPages(CATALOG, undefined)).toBe(CATALOG);
    expect(watchCatalogWithStatusPages(undefined, undefined)).toBeUndefined();
  });

  it("the record alone with no iPhone catalog, which knows nothing else", () => {
    const alone = watchCatalogWithStatusPages(undefined, [{ id: LIGHTS, name: "Lights" }])!;
    expect(alone.noPhone).toBe(true);
    expect(watchCatalogKnows(alone, "statusPage")).toBe(true);
    expect(watchCatalogKnows(alone, "httpAction")).toBe(false);
    expect(watchCatalogKnows(undefined, "statusPage")).toBe(false);
  });
});

describe("a status page tile", () => {
  const withRecord = watchCatalogWithStatusPages(CATALOG, watchStatusPagesFromRecord({ revision: 2, document: CONFIGURED }))!;

  it("lists the record's pages in its Target menu", () => {
    const menu = watchLibraryTargetMenu(tile(`status_page.${HOUSE}`, "House"), withRecord)!;
    expect(menu.options.map((o) => o.label)).toEqual(["House (9 rows)", "Lights (1 row)"]);
    expect(menu.selected).toBe(HOUSE);
  });

  it("says a page the record does not list is not in this watch's status pages", () => {
    const gone = watchLibraryTargetMenu(tile("status_page.C3A0E000-0000-4000-8000-0000000000FF", "Garden"), withRecord)!;
    expect(gone.options[0]).toMatchObject({ label: `Garden (${WATCH_NOT_IN_STATUS_PAGES_TEXT})`, disabled: true });
    expect(gone.note).toBe(`${WATCH_NOT_IN_STATUS_PAGES_TEXT}. The tile stays as it is until another is picked.`);
    const empty = watchCatalogWithStatusPages(CATALOG, [])!;
    expect(watchLibraryTargetMenu(tile("status_page.C3A0E000-0000-4000-8000-0000000000FF"), empty)!.note)
      .toBe(`${WATCH_NOT_IN_STATUS_PAGES_TEXT}, and this watch has no other status pages. The tile stays as it is.`);
    expect(watchLibraryMissingText(withRecord, "statusPage")).toBe("Not in this watch's status pages");
    // HTTP actions are still the iPhone's.
    expect(watchLibraryMissingText(withRecord, "httpAction")).toBe(WATCH_NOT_ON_IPHONE_TEXT);
    expect(watchLibraryMissingText(CATALOG, "statusPage")).toBe(WATCH_NOT_ON_IPHONE_TEXT);
  });

  it("is named on the preview by the record's page", () => {
    expect(watchLibraryTileFallbackName(`status_page.${HOUSE}`, withRecord)).toBe("House");
    expect(watchPreviewTileLabel(tile(`status_page.${HOUSE}`), { states: {}, pages: [], catalog: withRecord })).toBe("House");
    // The iPhone's catalog does not know the panel's page.
    expect(watchLibraryTileFallbackName(`status_page.${HOUSE}`, CATALOG)).toBe("Status Page");
  });
});
