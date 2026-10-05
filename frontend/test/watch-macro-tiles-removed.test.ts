// Macros were removed: the iPhone keeps none, and a Home Assistant script
// does the same job. A page may still hold a macro tile (`macro.<id>`) with
// its keys (`macroCloseMode`, `macroRunSilently`, `autoCloseMacroRun`). The
// panel keeps such a tile as stored: it loads, it draws as a tile the panel
// does not know, its settings say why and offer nothing, and a save sends it
// back unchanged. A `runMacro` value stored in a tap or a hold and slide
// direction is kept too, read as removed and offered nowhere.

import { nothing } from "lit";
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { readWatchCatalog, watchCatalogKnows, watchLibraryTarget } from "../src/watch-pages/catalog.js";
import { WatchPagesDraft, saveWatchPagesDraft } from "../src/watch-pages/draft.js";
import { findWatchPage } from "../src/watch-pages/edit.js";
import { NO_ICONS, type TileSettingsHost } from "../src/watch-pages/editor-host.js";
import { checkWatchPages, checkWatchPagesValues } from "../src/watch-pages/merge.js";
import {
  WATCH_REMOVED_TILE_TEXT,
  type WatchPage,
  type WatchPageTile,
  type WatchPagesDocument,
  isWatchRemovedTileKind,
  tileClass,
  tileKindLabel,
  tileLabel,
} from "../src/watch-pages/model.js";
import { renderWatchTileFace, watchPreviewTileLabel } from "../src/watch-pages/preview.js";
import { resolveSmartPagesBeforeSave } from "../src/watch-pages/smart-model.js";
import {
  isWatchLibraryAction,
  readWatchSlideMap,
  scrubWatchOrphanTriggers,
  setWatchTileHoldSlide,
  setWatchTileLabel,
  watchHoldSlideSettings,
} from "../src/watch-pages/tile-settings-model.js";
import tileActions from "../src/watch-pages/tile-actions.json";
import tileDefaults from "../src/watch-pages/tile-defaults.json";
import menuKeys from "../src/watch-menus/menu-keys.json";
import { watchMenuDomain } from "../src/watch-menus/model.js";
import { watchTileSettingsSections } from "../src/watch-pages/tile-settings-options.js";
import { renderTileName, renderTileSettings } from "../src/watch-pages/tile-settings.js";

// The views ask for the focused field (`document.activeElement`); Node has
// no document.
(globalThis as { document?: unknown }).document ??= { activeElement: null };
(globalThis as { HTMLElement?: unknown }).HTMLElement ??= class {};

const BYTES = readFileSync(join(__dirname, "fixtures-pages", "04-tile-settings.json"), "utf8");
const PAGE = "5A17E000-0000-4000-8000-000000000007";
const MACRO = "5A17E000-0000-4000-8000-000000000202";
const LIGHT = "5A17E000-0000-4000-8000-000000000208";

const load = () => JSON.parse(BYTES) as WatchPagesDocument;
const pageOf = (document: WatchPagesDocument) => findWatchPage(document, PAGE)!;
const tileOf = (document: WatchPagesDocument, id: string) => (pageOf(document).items as WatchPageTile[]).find((t) => t.id === id)!;

/** A template's text with its values. */
function text(t: unknown): string {
  if (typeof t === "symbol" || t === null || t === undefined) return "";
  if (Array.isArray(t)) return t.map(text).join("");
  if (typeof t !== "object") return String(t);
  const r = t as { strings?: readonly string[]; values?: unknown[] };
  if (r.strings === undefined) return "";
  return r.strings.map((s, i) => s + (i < (r.values?.length ?? 0) ? text(r.values![i]) : "")).join("");
}

describe("a stored macro tile", () => {
  const stored = tileOf(load(), MACRO);

  it("is in the fixture with every macro key", () => {
    expect(stored.entityId).toBe("macro.5A17E000-0000-4000-8000-000000000260");
    expect(stored).toMatchObject({ macroCloseMode: "onSuccess", macroRunSilently: true, autoCloseMacroRun: false });
  });

  it("loads as a document the panel can save: no shape or value problem", () => {
    expect(checkWatchPages(load())).toEqual([]);
    expect(checkWatchPagesValues(load())).toEqual([]);
  });

  it("is a removed kind, no library tile, and the catalog knows no macros", () => {
    expect(isWatchRemovedTileKind("macro")).toBe(true);
    expect(isWatchRemovedTileKind("http_action")).toBe(false);
    expect(watchLibraryTarget(stored.entityId as string)).toBeUndefined();
    const older = readWatchCatalog({ macros: [{ id: "5A17E000-0000-4000-8000-000000000260", name: "Bedtime" }] });
    expect(Object.keys(older)).not.toContain("macros");
    expect(watchCatalogKnows(older, "httpAction")).toBe(true);
  });

  it("previews in the look of a tile the panel does not know, even with a state of that id", () => {
    expect(tileClass(stored.entityId as string)).toBe("unknown");
    expect(tileClass(stored.entityId as string, { [stored.entityId as string]: {} })).toBe("unknown");
    expect(tileKindLabel("macro")).toBe("Macro (removed)");
    expect(tileLabel({ entityId: "macro.1" })).toBe("Macro");
    expect(watchPreviewTileLabel({ ...stored, customLabel: undefined }, { states: {}, pages: [] })).toBe("Macro");
    const drawn = text(renderWatchTileFace(stored, { width: 90, height: 90 }, { page: pageOf(load()) as WatchPage, pages: [], screen: { width: 198, height: 242 }, scale: 1 }, 21));
    // The dashed, grey tile with a question mark, as for any kind the panel
    // does not know, named "Macro".
    expect(drawn).toMatch(/class="wp-tile [^"]*unknown/);
    expect(drawn).toContain(">Macro<");
  });
});

/** A host for the tile's settings, over a draft of the fixture. */
function host(tileId: string) {
  const draft = new WatchPagesDraft(load(), 3);
  const h = {
    hass: { states: {} },
    icons: NO_ICONS,
    get document() { return draft.document; },
    pageId: PAGE,
    get page() { return pageOf(draft.document); },
    otherPages: [],
    catalog: undefined,
    busy: false,
    uiState: new Map<string, unknown>(),
    apply: (next: WatchPagesDocument) => draft.apply(next),
    endCoalesce: () => draft.endCoalesce(),
    selectTile: () => undefined,
    requestUpdate: () => undefined,
    tileId,
    get tile() { return tileOf(draft.document, tileId); },
  } as unknown as TileSettingsHost;
  return { draft, host: h };
}

describe("a stored macro tile's settings", () => {
  it("are one line that says why, with nothing to edit and no Name card", () => {
    const { host: h } = host(MACRO);
    expect(watchTileSettingsSections(h.tile)).toEqual(["removed"]);
    const drawn = text(renderTileSettings(h));
    expect(drawn).toContain(WATCH_REMOVED_TILE_TEXT);
    expect(WATCH_REMOVED_TILE_TEXT).toBe("Macros were removed. Use a Home Assistant script instead.");
    for (const gone of ["Run silently", "When it finishes", "Target", "<input", "<select"]) expect(drawn, gone).not.toContain(gone);
    expect(renderTileName(h)).toBe(nothing);
  });
});

describe("a save of a page that holds a macro tile", () => {
  it("sends the macro tile back unchanged when another tile is edited", async () => {
    const { draft } = host(MACRO);
    draft.apply(setWatchTileLabel(draft.document, PAGE, LIGHT, "Night lamp"));
    let sent: WatchPagesDocument | undefined;
    const result = await saveWatchPagesDraft(draft, {
      save: async (_base, document) => {
        sent = structuredClone(document);
        return { revision: 4 };
      },
      fetch: async () => ({ revision: 4, document: sent }),
      // What the page editor does before each send.
      prepare: (document) => resolveSmartPagesBeforeSave(scrubWatchOrphanTriggers(document), draft.base, {}),
    });
    expect(result.ok).toBe(true);
    expect(tileOf(sent!, LIGHT).customLabel).toBe("Night lamp");
    expect(JSON.stringify(tileOf(sent!, MACRO))).toBe(JSON.stringify(tileOf(load(), MACRO)));
    // Everything but the edit is as stored.
    const back = structuredClone(sent!);
    (tileOf(back, LIGHT) as Record<string, unknown>).customLabel = tileOf(load(), LIGHT).customLabel;
    expect(JSON.stringify(back)).toBe(JSON.stringify(load()));
  });
});

describe("a stored runMacro value", () => {
  const HOLD_BYTES = readFileSync(join(__dirname, "fixtures-pages", "03-hold-and-slide.json"), "utf8");
  const HOLD_PAGE = "5A17E000-0000-4000-8000-000000000005";
  const PORCH = "5A17E000-0000-4000-8000-000000000194";
  const holdDoc = () => JSON.parse(HOLD_BYTES) as WatchPagesDocument;
  const porch = (document: WatchPagesDocument) =>
    (findWatchPage(document, HOLD_PAGE)!.items as WatchPageTile[]).find((t) => t.id === PORCH)!;

  it("is in the fixture on the right of an automation tile", () => {
    expect(readWatchSlideMap(porch(holdDoc()).holdSlideActions)?.get("right")).toBe("runMacro");
  });

  it("reads as removed, and no table offers it or anything else for macros", () => {
    const right = watchHoldSlideSettings(porch(holdDoc())).directions[3]!;
    expect(right).toMatchObject({ direction: "right", stored: "runMacro", storedNotOffered: true, storedLabel: "Macro (Removed)" });
    expect(right.offered.map((c) => c.value)).not.toContain("runMacro");
    expect(isWatchLibraryAction("runMacro")).toBe(false);
    expect(tileActions.libraryActions).toEqual(["httpAction"]);
    expect(Object.keys(tileActions.kinds)).not.toContain("macro");
    for (const [kind, entry] of Object.entries(tileActions.kinds)) {
      expect(entry.tapActions, kind).not.toContain("runMacro");
      expect(entry.holdSlideActions, kind).not.toContain("runMacro");
    }
    // The action stays in the list of every stored value, so it decodes.
    expect(tileActions.actions.map((a) => a.raw)).toContain("runMacro");
    expect(Object.keys(tileDefaults.domains)).not.toContain("macro");
    expect(Object.keys(tileDefaults)).not.toContain("macroTile");
  });

  it("stays as stored when another direction of its tile is edited", () => {
    const next = setWatchTileHoldSlide(holdDoc(), HOLD_PAGE, PORCH, "up", "toggle");
    const map = readWatchSlideMap(porch(next).holdSlideActions)!;
    expect(map.get("up")).toBe("toggle");
    expect(map.get("right")).toBe("runMacro");
  });

  it("cannot be written again", () => {
    const doc = holdDoc();
    expect(setWatchTileHoldSlide(doc, HOLD_PAGE, PORCH, "left", "runMacro")).toBe(doc);
  });
});

describe("a menu of a stored macro tile", () => {
  // Kept for old documents: a macro tile's own menu, keyed by its entity id,
  // still reads the HTTP actions list, as the watch does.
  it("reads the HTTP actions list through the macro alias", () => {
    expect(menuKeys.domainAliases).toMatchObject({ macro: "http_action" });
    expect(watchMenuDomain("macro")?.slotKey).toBe("httpActionSlots");
  });
});
