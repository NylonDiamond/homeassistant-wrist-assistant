// The map page an iPhone gets, pinned for the integration's signed
// `home_map_page_add`. Home Assistant builds that page itself
// (`custom_components/wrist_assistant/map_page.py`), so it must stay what
// the panel's Add page makes for an iPhone (`homeMapPageDocument("iphone",
// ...)`) and names it (`homeMapPageName`). `tests/fixtures/home_map/
// map_page.json` holds both, written from the panel's own functions; this
// test fails when they drift from it, and `tests/test_home_map_page_add.py`
// fails when the Python page does. Rebuild it with
// `WA_UPDATE_FIXTURES=1 npx vitest run test/home-map-page-fixture.test.ts`,
// then bring `map_page.py` in step.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { HomeMapFloor } from "../src/home-map/model.js";
import { homeMapPageDocument, homeMapPageName } from "../src/home-map/page-step.js";

const FIXTURE = join(__dirname, "..", "..", "tests", "fixtures", "home_map", "map_page.json");

// Lower case on purpose: both sides write ids upper case.
const ADD = {
  page_id: "8c1d2e3f-4a5b-4c6d-8e7f-000000000001",
  tile_id: "8c1d2e3f-4a5b-4c6d-8e7f-000000000002",
  floor_id: "7B1E0C2A-5D3F-4A8B-9C6D-000000000001",
  name: "Home map",
};

const floor = (id: string, name: string, story: number) => ({ id, name, story, rooms: [], pins: [] });
const GROUND = floor("7B1E0C2A-5D3F-4A8B-9C6D-000000000001", "Ground floor", 0);
const UP = floor("7B1E0C2A-5D3F-4A8B-9C6D-000000000002", "   ", 1);
const LOFT = floor("7B1E0C2A-5D3F-4A8B-9C6D-000000000003", "  Loft  ", 2);
const NAME_CASES = [
  { floors: [GROUND], floor: 0 },
  { floors: [GROUND, UP], floor: 0 },
  { floors: [GROUND, UP], floor: 1 },
  { floors: [GROUND, UP, LOFT], floor: 2 },
];

/** Sorted keys at every level, two space indent, one newline at the end. */
function fixtureText(value: unknown): string {
  const sorted = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(sorted);
    if (typeof v === "object" && v !== null) {
      const out: Record<string, unknown> = {};
      for (const key of Object.keys(v).sort()) out[key] = sorted((v as Record<string, unknown>)[key]);
      return out;
    }
    return v;
  };
  return `${JSON.stringify(sorted(value), null, 2)}\n`;
}

function built(): unknown {
  vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue(ADD.tile_id as `${string}-${string}-${string}-${string}-${string}`);
  const document = homeMapPageDocument("iphone", ADD.page_id, ADD.name, ADD.floor_id);
  const names = NAME_CASES.map((c) => ({
    ...c,
    name: homeMapPageName({ floors: c.floors as unknown as HomeMapFloor[] }, c.floors[c.floor] as unknown as HomeMapFloor),
  }));
  return { add: { ...ADD, document }, names };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("the map page home_map_page_add builds", () => {
  it("is the panel's Add page for an iPhone and its names, byte for byte", () => {
    const text = fixtureText(built());
    if (process.env.WA_UPDATE_FIXTURES === "1") writeFileSync(FIXTURE, text);
    expect(readFileSync(FIXTURE, "utf8")).toBe(text);
  });

  it("holds one map page with one Home map tile of the floor, ids upper case", () => {
    const fixture = JSON.parse(readFileSync(FIXTURE, "utf8")) as {
      add: { document: { pages: { id: string; mapPage: boolean; items: { id: string; entityId: string }[] }[] } };
    };
    const pages = fixture.add.document.pages;
    expect(pages).toHaveLength(1);
    expect(pages[0]!.id).toBe(ADD.page_id.toUpperCase());
    expect(pages[0]!.mapPage).toBe(true);
    expect(pages[0]!.items.map((t) => [t.id, t.entityId])).toEqual([[ADD.tile_id.toUpperCase(), `home_map.${ADD.floor_id}`]]);
  });
});
