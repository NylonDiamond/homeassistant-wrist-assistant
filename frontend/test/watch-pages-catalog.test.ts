// The catalog reader (part 3e) on the exact bytes the phone uploads
// (`fixtures-catalog/catalog.json`, written by the app's tests) and on junk:
// what it keeps, what it skips, the lookups, the words, and when a live line
// event means a read.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { WatchConfigRecord } from "../src/ha-api.js";
import {
  WATCH_NO_CATALOG_TEXT,
  findWatchCatalogEntry,
  readWatchCatalog,
  watchCatalogEntries,
  watchCatalogEventIsNews,
  watchCatalogFromRecord,
  watchCatalogListedText,
  watchCatalogReadMeansNone,
  watchCatalogSubtitle,
  watchCatalogWarning,
  watchLibraryTarget,
  watchLibraryTileFallbackName,
} from "../src/watch-pages/catalog.js";

const BYTES = readFileSync(join(__dirname, "fixtures-catalog", "catalog.json"), "utf8");
const DOCUMENT = JSON.parse(BYTES) as Record<string, unknown>;

function record(over: Partial<WatchConfigRecord> = {}): WatchConfigRecord {
  return {
    kind: "catalog",
    revision: 4,
    hash: "h",
    updated_at: "2026-10-02T09:30:00+00:00",
    updated_by: "watch-1",
    delivered_revision: 4,
    delivered_at: null,
    document: DOCUMENT,
    ...over,
  };
}

describe("the phone's catalog bytes", () => {
  const catalog = watchCatalogFromRecord(record())!;

  it("are what the contract says the phone uploads: sorted keys, schema 1, no URL anywhere", () => {
    expect(Object.keys(DOCUMENT)).toEqual(["httpActions", "macros", "schemaVersion", "statusPages"]);
    expect(DOCUMENT.schemaVersion).toBe(1);
    expect(BYTES).not.toMatch(/https?:|"url"|"headers"|"body"|"method"/i);
  });

  it("read every HTTP action with its flags and picker style", () => {
    expect(catalog.httpActions).toEqual([
      { id: "4F7A2C1E-9B3D-4E5F-8A6B-1C2D3E4F5A6B", name: "Open Gate", icon: "car.fill", iconColor: "#A0C8FF", hasReply: false, needsSetup: false },
      { id: "6A0B3C2D-1E4F-4A5B-9C8D-7E6F5A4B3C2D", name: "Outdoor Temp", hasReply: true, needsSetup: false },
      // An unnamed action is "HTTP Action", never its URL.
      { id: "9D8C7B6A-5F4E-4D3C-8B2A-1F0E9D8C7B6A", name: "HTTP Action", hasReply: false, needsSetup: false },
      { id: "2B3C4D5E-6F7A-4B8C-9D0E-1F2A3B4C5D6E", name: "Garage Door", hasReply: false, needsSetup: true },
    ]);
  });

  it("read the macros with their style, steps and attention flag", () => {
    expect(catalog.macros).toEqual([
      { id: "8E1D5B7A-2C4F-4A9E-B3D6-7F0A1B2C3D4E", name: "Bedtime", icon: "moon.fill", colorHex: "#FF9F0A", steps: 4, needsAttention: false },
      { id: "5C6D7E8F-9A0B-4C1D-8E2F-3A4B5C6D7E8F", name: "Leave Home", steps: 1, needsAttention: true },
      { id: "1B2C3D4E-5F6A-4B7C-8D9E-0F1A2B3C4D5E", name: "Macro", steps: 0, needsAttention: true },
    ]);
  });

  it("read the status pages, a system page among them", () => {
    expect(catalog.statusPages).toEqual([
      { id: "00000000-0000-0000-0000-000000000001", name: "Lights", rows: 1 },
      { id: "3C4D5E6F-7A8B-4C9D-AE0F-1A2B3C4D5E6F", name: "Upstairs", rows: 6 },
    ]);
  });

  it("carry the record's revision and time", () => {
    expect(catalog.revision).toBe(4);
    expect(catalog.updatedAt).toBe("2026-10-02T09:30:00+00:00");
    expect(watchCatalogListedText(catalog, "en-US")).toMatch(/^Listed by the iPhone on .*2026.*\.$/);
  });

  it("look entries up by id without regard to case", () => {
    expect(findWatchCatalogEntry(catalog, "httpAction", "4f7a2c1e-9b3d-4e5f-8a6b-1c2d3e4f5a6b")?.name).toBe("Open Gate");
    expect(findWatchCatalogEntry(catalog, "macro", "8E1D5B7A-2C4F-4A9E-B3D6-7F0A1B2C3D4E")?.name).toBe("Bedtime");
    expect(findWatchCatalogEntry(catalog, "statusPage", "00000000-0000-0000-0000-000000000001")?.name).toBe("Lights");
    // Each kind in its own list.
    expect(findWatchCatalogEntry(catalog, "macro", "4F7A2C1E-9B3D-4E5F-8A6B-1C2D3E4F5A6B")).toBeUndefined();
    expect(findWatchCatalogEntry(undefined, "macro", "8E1D5B7A-2C4F-4A9E-B3D6-7F0A1B2C3D4E")).toBeUndefined();
    expect(watchCatalogEntries(catalog, "statusPage")).toBe(catalog.statusPages);
  });

  it("have the phone's subtitles and warnings", () => {
    const [bedtime, leave, empty] = catalog.macros;
    expect(watchCatalogSubtitle("macro", bedtime!)).toBe("4 steps");
    expect(watchCatalogSubtitle("macro", leave!)).toBe("1 step");
    expect(watchCatalogSubtitle("macro", empty!)).toBe("0 steps");
    expect(watchCatalogSubtitle("statusPage", catalog.statusPages[1]!)).toBe("6 rows");
    expect(watchCatalogSubtitle("statusPage", catalog.statusPages[0]!)).toBe("1 row");
    expect(watchCatalogSubtitle("httpAction", catalog.httpActions[0]!)).toBeUndefined();
    expect(watchCatalogWarning("httpAction", catalog.httpActions[3]!)).toBe("Needs setup on the iPhone");
    expect(watchCatalogWarning("httpAction", catalog.httpActions[0]!)).toBeUndefined();
    expect(watchCatalogWarning("macro", leave!)).toBe("Needs attention on the iPhone");
    expect(watchCatalogWarning("macro", bedtime!)).toBeUndefined();
  });
});

describe("no catalog", () => {
  it("is a record at revision 0, or none", () => {
    expect(watchCatalogFromRecord(record({ revision: 0, document: undefined }))).toBeUndefined();
    expect(watchCatalogFromRecord(undefined)).toBeUndefined();
    expect(WATCH_NO_CATALOG_TEXT).toBe("Open the iPhone app to list its HTTP actions, macros and status pages here.");
    expect(watchCatalogListedText(undefined)).toBeUndefined();
  });
});

describe("junk", () => {
  const A = "C3A0E000-0000-4000-8000-00000000000A";
  const B = "C3A0E000-0000-4000-8000-00000000000B";
  const S = "C3A0E000-0000-4000-8000-000000000005";
  const U = "C3A0E000-0000-4000-8000-000000000006";

  it("skips every element without a UUID string id and a string name, and ignores the rest", () => {
    const catalog = readWatchCatalog({
      httpActions: [
        { id: A, name: "Kept", hasReply: "yes", needsSetup: 1, icon: 3, url: "https://x" },
        { id: "", name: "Blank id" },
        { id: 7, name: "Number id" },
        { id: B },
        { name: "No id" },
        null,
        "C",
        ["D", "E"],
      ],
      macros: { id: A, name: "Not a list" },
      statusPages: [{ id: S, name: "", rows: -1 }, { id: U, name: "T", rows: 2.5 }],
      voice: { anything: true },
    });
    expect(catalog.httpActions).toEqual([{ id: A, name: "Kept", hasReply: false, needsSetup: false }]);
    expect(catalog.macros).toEqual([]);
    // An empty name is a name; a count that is no whole number is none.
    expect(catalog.statusPages).toEqual([{ id: S, name: "" }, { id: U, name: "T" }]);
  });

  it("skips an id that is no UUID, which no tile or slide could store", () => {
    const catalog = readWatchCatalog({
      httpActions: [{ id: "NOT-A-UUID", name: "Junk" }, { id: `${A}x`, name: "Long" }, { id: A, name: "Good" }],
      macros: [{ id: "M", name: "M" }],
      statusPages: [{ id: "00000000-0000-0000-0000-000000000001", name: "Lights" }],
    });
    expect(catalog.httpActions.map((a) => a.name)).toEqual(["Good"]);
    expect(catalog.macros).toEqual([]);
    expect(catalog.statusPages.map((p) => p.name)).toEqual(["Lights"]);
  });

  it("keeps the first of ids that differ only in case, in each list on its own", () => {
    const catalog = readWatchCatalog({
      httpActions: [{ id: A.toLowerCase(), name: "First" }, { id: A, name: "Second" }, { id: B, name: "Other" }],
      macros: [{ id: A, name: "A macro may share an action's id" }],
    });
    expect(catalog.httpActions.map((a) => [a.id, a.name])).toEqual([[A.toLowerCase(), "First"], [B, "Other"]]);
    expect(catalog.macros.map((m) => m.name)).toEqual(["A macro may share an action's id"]);
  });

  it("reads a document that is no object as an empty catalog", () => {
    for (const bad of [null, undefined, [], "catalog", 4]) {
      expect(readWatchCatalog(bad)).toEqual({ revision: 0, updatedAt: undefined, httpActions: [], macros: [], statusPages: [] });
    }
    expect(watchCatalogFromRecord(record({ document: undefined }))).toMatchObject({ revision: 4, httpActions: [] });
  });

  it("says nothing of a time it cannot read", () => {
    expect(watchCatalogListedText(readWatchCatalog({}, { updatedAt: "not a time" }))).toBeUndefined();
  });
});

describe("a read that fails", () => {
  it("means no catalog only when the integration does not know the kind or the command", () => {
    // What `watch_config/get` answers for a kind the store does not have.
    expect(watchCatalogReadMeansNone({ code: "invalid", message: "kind must be one of behavior, pages" })).toBe(true);
    expect(watchCatalogReadMeansNone({ code: "unknown_command", message: "Unknown command." })).toBe(true);
    // A dropped socket or a refused login says nothing about the library.
    for (const other of [{ code: "unavailable" }, { code: 3 }, new Error("connection lost"), undefined, "invalid"]) {
      expect(watchCatalogReadMeansNone(other)).toBe(false);
    }
  });
});

describe("the live line", () => {
  const held = watchCatalogFromRecord(record())!;
  it("reads the catalog again for a catalog revision other than the one held", () => {
    expect(watchCatalogEventIsNews({ kind: "catalog", revision: 5 }, held)).toBe(true);
    expect(watchCatalogEventIsNews({ kind: "catalog", revision: 4 }, held)).toBe(false);
    // Removed (0) while one is held, or a first one while none is.
    expect(watchCatalogEventIsNews({ kind: "catalog", revision: 0 }, held)).toBe(true);
    expect(watchCatalogEventIsNews({ kind: "catalog", revision: 1 }, undefined)).toBe(true);
    expect(watchCatalogEventIsNews({ kind: "catalog", revision: 0 }, undefined)).toBe(false);
  });

  it("leaves every other kind alone", () => {
    expect(watchCatalogEventIsNews({ kind: "pages", revision: 9 }, held)).toBe(false);
    expect(watchCatalogEventIsNews({ kind: "behavior", revision: 9 }, undefined)).toBe(false);
  });
});

describe("a tile's library target", () => {
  it("is read from the entity id prefix, the id as stored", () => {
    expect(watchLibraryTarget("http_action.4f7a2c1e-9b3d-4e5f-8a6b-1c2d3e4f5a6b")).toEqual({ kind: "httpAction", id: "4f7a2c1e-9b3d-4e5f-8a6b-1c2d3e4f5a6b" });
    expect(watchLibraryTarget("macro.X")).toEqual({ kind: "macro", id: "X" });
    expect(watchLibraryTarget("status_page.Y")).toEqual({ kind: "statusPage", id: "Y" });
    expect(watchLibraryTarget("page.Y")).toBeUndefined();
    expect(watchLibraryTarget("light.desk")).toBeUndefined();
  });

  it("names a tile with no label as the watch does", () => {
    const catalog = readWatchCatalog(DOCUMENT);
    const action = catalog.httpActions[0]!;
    const macro = catalog.macros[0]!;
    const page = catalog.statusPages[0]!;
    // An HTTP action tile is "Action", never the action's name.
    expect(watchLibraryTileFallbackName(`http_action.${action.id}`, catalog)).toBe("Action");
    expect(watchLibraryTileFallbackName(`macro.${macro.id.toLowerCase()}`, catalog)).toBe(macro.name);
    expect(watchLibraryTileFallbackName(`status_page.${page.id}`, catalog)).toBe(page.name);
    // Not listed, or no catalog.
    expect(watchLibraryTileFallbackName("macro.C3A0E000-0000-4000-8000-0000000000FF", catalog)).toBe("Macro");
    expect(watchLibraryTileFallbackName(`status_page.${page.id}`, undefined)).toBe("Status Page");
    expect(watchLibraryTileFallbackName(`http_action.${action.id}`, undefined)).toBe("Action");
    expect(watchLibraryTileFallbackName("light.desk", catalog)).toBeUndefined();
  });
});
