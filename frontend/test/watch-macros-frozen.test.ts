// Macros are frozen: no new ones are made on the iPhone, so the add dialog
// offers the Macro list only while the iPhone still lists one. Tiles that
// already point at a macro keep working; only the add is gated.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { readWatchCatalog, watchCatalogOffersAdd, watchCatalogWithStatusPages } from "../src/watch-pages/catalog.js";

const CATALOG = readWatchCatalog(JSON.parse(readFileSync(join(__dirname, "fixtures-catalog", "catalog.json"), "utf8")), { revision: 3, updatedAt: "2026-10-02T09:30:00Z" })!;

describe("the Macro add while macros are frozen", () => {
  it("is offered while the iPhone lists a macro", () => {
    expect(CATALOG.macros.length).toBeGreaterThan(0);
    expect(watchCatalogOffersAdd(CATALOG, "macro")).toBe(true);
  });

  it("is not offered when the iPhone lists none, and the other kinds stay", () => {
    const none = { ...CATALOG, macros: [] };
    expect(watchCatalogOffersAdd(none, "macro")).toBe(false);
    expect(watchCatalogOffersAdd(none, "httpAction")).toBe(true);
    expect(watchCatalogOffersAdd(none, "statusPage")).toBe(true);
  });

  it("is not offered without an iPhone catalog", () => {
    const alone = watchCatalogWithStatusPages(undefined, [{ id: "00000000-0000-0000-0000-000000000001", name: "Lights" }])!;
    expect(watchCatalogOffersAdd(alone, "macro")).toBe(false);
    expect(watchCatalogOffersAdd(alone, "statusPage")).toBe(true);
    expect(watchCatalogOffersAdd(undefined, "macro")).toBe(false);
  });
});
