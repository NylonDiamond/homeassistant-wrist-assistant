// Library tiles (part 3e) beyond the shared case files: adds from the real
// catalog, the retarget's edges, the Request task's Tile Value rows, the
// Macro task's legacy read, Run HTTP Action in hold and slide with and
// without a catalog, the menus the view draws, and the preview's value.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { readWatchCatalog } from "../src/watch-pages/catalog.js";
import { findWatchPage } from "../src/watch-pages/edit.js";
import { type WatchPagesApplyOptions, WatchPagesDraft } from "../src/watch-pages/draft.js";
import {
  WATCH_LIBRARY_SETTING_KEYS,
  setWatchLibraryTileTarget,
  setWatchTileHTTPRefresh,
  setWatchTileHTTPRefreshOnPull,
  setWatchTileHTTPReply,
  setWatchTileHTTPShowName,
  setWatchTileHTTPToastSeconds,
  setWatchTileHTTPValueColor,
  setWatchTileHTTPValueFontSize,
  setWatchTileHTTPValueLineLimit,
  setWatchTileHTTPValueLineSpacing,
  setWatchTileHTTPValueOffsetY,
  setWatchTileMacroCloseMode,
  setWatchTileMacroRunSilently,
  watchHTTPRequestSettings,
  watchMacroSettings,
} from "../src/watch-pages/library-model.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { watchHTTPTileValueLook, watchPreviewTileLabel } from "../src/watch-pages/preview.js";
import { addNewWatchTile, newWatchLibraryTile, watchLibraryTileLook } from "../src/watch-pages/tile-new.js";
import {
  WATCH_SLIDE_DIRECTIONS,
  clearWatchTileHoldSlide,
  isWatchUUID,
  setWatchTileHoldSlide,
  setWatchTileHoldSlideHTTP,
  setWatchTileHoldSlideHTTPBanner,
  setWatchTileHoldSlideHTTPBannerSeconds,
  watchHoldSlideSettings,
} from "../src/watch-pages/tile-settings-model.js";
import {
  WATCH_HTTP_REPLY_OFF,
  isWatchStoredChoice,
  watchHTTPBannerSecondsMenu,
  watchHTTPRefreshMenu,
  watchHTTPReplyMenu,
  watchHTTPSlideChoice,
  watchHoldSlideMenus,
  watchLabelNote,
  watchLibraryTargetMenu,
  watchTileFallbackName,
  watchTileSettingsSections,
} from "../src/watch-pages/tile-settings-options.js";
import { NO_ICONS, type TileSettingsHost } from "../src/watch-pages/editor-host.js";
import { commit, watchTileDefaultColorEdit, watchTileDefaultIconEdit } from "../src/watch-pages/tile-settings.js";
import pageKeys from "../src/watch-pages/page-keys.json";

type Json = Record<string, unknown>;

const CATALOG = readWatchCatalog(JSON.parse(readFileSync(join(__dirname, "fixtures-catalog", "catalog.json"), "utf8")), {
  revision: 3,
  updatedAt: "2026-10-02T09:30:00Z",
});
const [OPEN_GATE, OUTDOOR, UNNAMED, GARAGE] = CATALOG.httpActions;
const [BEDTIME, LEAVE] = CATALOG.macros;
const [LIGHTS, UPSTAIRS] = CATALOG.statusPages;

const PAGE = "C3A0E000-0000-4000-8000-0000000000AA";
const T = "C3A0E000-0000-4000-8000-000000000001";

/** The fresh tile of the case files, with `patch` over it. */
const FRESH = (JSON.parse(readFileSync(join(__dirname, "fixtures-pages", "settings", "label-set.json"), "utf8")) as { tile: Json }).tile;
function tileOf(patch: Json): WatchPageTile {
  const all: Json = { ...structuredClone(FRESH), id: T, ...patch };
  // In the phone's sorted order, as a tile it wrote is.
  return Object.fromEntries(Object.keys(all).sort().filter((k) => all[k] !== undefined).map((k) => [k, all[k]])) as WatchPageTile;
}

function docWith(tile: WatchPageTile, page: Json = {}): WatchPagesDocument {
  return { schemaVersion: 1, pages: [{ id: PAGE, name: "Living", items: [tile], ...page }] };
}

function tileIn(document: WatchPagesDocument): WatchPageTile {
  return (findWatchPage(document, PAGE)!.items as WatchPageTile[])[0]!;
}

const http = (patch: Json = {}) => tileOf({ entityId: `http_action.${OPEN_GATE!.id}`, icon: "network", color: "#CCD8E6", customLabel: "Open Gate", httpResponseDisplay: "toast", ...patch });
const macro = (patch: Json = {}) => tileOf({ entityId: `macro.${BEDTIME!.id}`, icon: "moon.fill", color: "#FF9F0A", customLabel: "Bedtime", ...patch });
const statusPage = (patch: Json = {}) => tileOf({ entityId: `status_page.${LIGHTS!.id}`, customLabel: "Lights", ...patch });

// ── adds ─────────────────────────────────────────────────────────────────

describe("adding from the catalog", () => {
  const ids = (...list: string[]) => {
    let i = 0;
    return { newId: () => list[i++]! };
  };

  it("an HTTP action: the fixed look on any page, the catalog name, the banner", () => {
    const gradient = { schemaVersion: 1, pages: [{ id: PAGE, name: "P", themeOverride: "ember", useGradientColors: true, items: [] }] };
    const r = addNewWatchTile(gradient, PAGE, { kind: "httpAction", action: { id: UNNAMED!.id.toLowerCase(), name: UNNAMED!.name } }, ids("c3a0e000-0000-4000-8000-000000000100"));
    expect(r.tile).toMatchObject({
      id: "C3A0E000-0000-4000-8000-000000000100",
      entityId: `http_action.${UNNAMED!.id}`,
      icon: "network",
      color: "#CCD8E6",
      customLabel: "HTTP Action",
      httpResponseDisplay: "toast",
    });
    expect(Object.keys(r.tile!)).toEqual([...Object.keys(r.tile!)].sort());
  });

  it("a macro: its own icon and color as stored, else link and the accent", () => {
    expect(watchLibraryTileLook("macro", BEDTIME)).toEqual({ icon: "moon.fill", color: "#FF9F0A" });
    expect(watchLibraryTileLook("macro", LEAVE)).toEqual({ icon: "link", color: "#CCD8E6" });
    expect(watchLibraryTileLook("macro", undefined)).toEqual({ icon: "link", color: "#CCD8E6" });
    expect(watchLibraryTileLook("macro", { icon: "film", colorHex: "#ff9f0a" })).toEqual({ icon: "film", color: "#ff9f0a" });
    // Only a macro takes the entry's style.
    expect(watchLibraryTileLook("httpAction", { icon: "car.fill", colorHex: "#A0C8FF" })).toEqual({ icon: "network", color: "#CCD8E6" });
    expect(watchLibraryTileLook("statusPage")).toEqual({ icon: "list.bullet.rectangle.portrait", color: "#7CC4E8" });
  });

  it("a status page may sit on a page twice, as on the phone", () => {
    const doc: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: PAGE, name: "P", items: [] }] };
    const once = addNewWatchTile(doc, PAGE, { kind: "statusPage", statusPage: UPSTAIRS! }, ids("A"));
    const twice = addNewWatchTile(once.document, PAGE, { kind: "statusPage", statusPage: UPSTAIRS! }, ids("B"));
    expect(twice.refusal).toBeUndefined();
    expect((findWatchPage(twice.document, PAGE)!.items as WatchPageTile[]).map((t) => t.entityId)).toEqual([
      `status_page.${UPSTAIRS!.id}`,
      `status_page.${UPSTAIRS!.id}`,
    ]);
  });

  it("never on a smart page", () => {
    const doc: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: PAGE, name: "P", dynamicConfig: { rules: [] }, items: [] }] };
    expect(addNewWatchTile(doc, PAGE, { kind: "macro", macro: BEDTIME! }, ids("A")).refusal).toBe("smartPage");
  });

  it("a name the entry lacks stands in by kind", () => {
    expect(newWatchLibraryTile("statusPage", { id: "x" } as never, ids("A")).customLabel).toBe("Status Page");
  });
});

// ── the target ───────────────────────────────────────────────────────────

describe("retargeting", () => {
  it("changes nothing for the entry it points at, in any case", () => {
    const doc = docWith(http({ customLabel: "" }));
    expect(setWatchLibraryTileTarget(doc, PAGE, T, "httpAction", { id: OPEN_GATE!.id.toLowerCase(), name: "Open Gate" }, ["Open Gate"])).toBe(doc);
  });

  it("writes the new id in upper case and refuses another kind's entry", () => {
    const doc = docWith(macro());
    const next = tileIn(setWatchLibraryTileTarget(doc, PAGE, T, "macro", { id: LEAVE!.id.toLowerCase(), name: LEAVE!.name }, [BEDTIME!.name]));
    expect(next.entityId).toBe(`macro.${LEAVE!.id}`);
    expect(next.customLabel).toBe("Leave Home");
    // Icon and color stay.
    expect([next.icon, next.color]).toEqual(["moon.fill", "#FF9F0A"]);
    expect(setWatchLibraryTileTarget(doc, PAGE, T, "httpAction", { id: GARAGE!.id, name: "Garage Door" })).toBe(doc);
    const light = docWith(tileOf({ entityId: "light.desk" }));
    expect(setWatchLibraryTileTarget(light, PAGE, T, "macro", { id: LEAVE!.id, name: "x" })).toBe(light);
    expect(setWatchLibraryTileTarget(doc, PAGE, T, "macro", { id: "", name: "x" })).toBe(doc);
  });

  it("a label that is absent follows; a stale one stays", () => {
    const absent = tileOf({ entityId: `status_page.${LIGHTS!.id}` });
    delete absent.customLabel;
    expect(tileIn(setWatchLibraryTileTarget(docWith(absent), PAGE, T, "statusPage", UPSTAIRS!, ["Lights"])).customLabel).toBe("Upstairs");
    const stale = statusPage({ customLabel: "Old Lights" });
    expect(tileIn(setWatchLibraryTileTarget(docWith(stale), PAGE, T, "statusPage", UPSTAIRS!, ["Lights"])).customLabel).toBe("Old Lights");
  });

  it("a label that is any of the old entry's names follows; the panel passes only the catalog's", () => {
    const url = "https://hooks.example.invalid/run?token=abc123";
    const doc = docWith(http({ entityId: `http_action.${UNNAMED!.id}`, customLabel: url }));
    // The phone knows the URL of an unnamed action, so a label an older add
    // wrote from it follows there.
    expect(tileIn(setWatchLibraryTileTarget(doc, PAGE, T, "httpAction", OPEN_GATE!, [UNNAMED!.name, url])).customLabel).toBe("Open Gate");
    // The catalog never carries a URL: from the panel the label stays.
    const fromPanel = tileIn(setWatchLibraryTileTarget(doc, PAGE, T, "httpAction", OPEN_GATE!, [UNNAMED!.name]));
    expect([fromPanel.entityId, fromPanel.customLabel]).toEqual([`http_action.${OPEN_GATE!.id}`, url]);
    expect(tileIn(setWatchLibraryTileTarget(doc, PAGE, T, "httpAction", OPEN_GATE!)).customLabel).toBe(url);
  });
});

// ── the Request task ─────────────────────────────────────────────────────

describe("the Request task", () => {
  const tv = () => docWith(http({ httpResponseDisplay: "tileValue", icon: "" }));

  it("reads absent keys as the phone does", () => {
    expect(watchHTTPRequestSettings(http())).toEqual({
      reply: "toast",
      replyStoredUnknown: undefined,
      toastSeconds: undefined,
      refresh: "off",
      refreshOnPull: false,
      showName: true,
      fontSize: undefined,
      lineLimit: undefined,
      lineSpacing: 0,
      offsetY: 0,
      color: undefined,
    });
    expect(watchHTTPRequestSettings(http({ httpResponseDisplay: "popup" }))).toMatchObject({ reply: undefined, replyStoredUnknown: "popup" });
    // The interval wins over on open; a non-positive one is off.
    expect(watchHTTPRequestSettings(http({ httpAutoRefreshOnOpen: true, httpAutoRefreshInterval: 5 })).refresh).toBe(5);
    expect(watchHTTPRequestSettings(http({ httpAutoRefreshOnOpen: true, httpAutoRefreshInterval: 0 })).refresh).toBe("onOpen");
  });

  it("refuses every key on a tile of another kind", () => {
    const doc = docWith(macro());
    expect(setWatchTileHTTPReply(doc, PAGE, T, "toast")).toBe(doc);
    expect(setWatchTileHTTPToastSeconds(doc, PAGE, T, 5)).toBe(doc);
    const h = docWith(http());
    expect(setWatchTileMacroRunSilently(h, PAGE, T, true)).toBe(h);
    expect(setWatchTileMacroCloseMode(h, PAGE, T, "always")).toBe(h);
  });

  it("banner seconds take 1, 2 and 5; 3 is the standard and removes the key", () => {
    const doc = docWith(http({ httpToastSeconds: 2 }));
    expect(tileIn(setWatchTileHTTPToastSeconds(doc, PAGE, T, 3)).httpToastSeconds).toBeUndefined();
    expect(tileIn(setWatchTileHTTPToastSeconds(doc, PAGE, T, 1)).httpToastSeconds).toBe(1);
    expect(setWatchTileHTTPToastSeconds(doc, PAGE, T, 4)).toBe(doc);
    expect(setWatchTileHTTPReply(doc, PAGE, T, "bogus" as never)).toBe(doc);
  });

  it("the Tile Value rows write only while the tile shows its reply there", () => {
    const toast = docWith(http());
    for (const edit of [
      (d: WatchPagesDocument) => setWatchTileHTTPValueFontSize(d, PAGE, T, 20),
      (d: WatchPagesDocument) => setWatchTileHTTPRefresh(d, PAGE, T, "onOpen"),
      (d: WatchPagesDocument) => setWatchTileHTTPShowName(d, PAGE, T, false),
    ]) expect(edit(toast)).toBe(toast);
  });

  it("the Tile Value rows: ranges, defaults removed, values rounded", () => {
    const d = tv();
    expect(tileIn(setWatchTileHTTPValueFontSize(d, PAGE, T, 21.6)).httpTileValueFontSize).toBe(22);
    expect(setWatchTileHTTPValueFontSize(d, PAGE, T, 37)).toBe(d);
    expect(setWatchTileHTTPValueFontSize(d, PAGE, T, 5)).toBe(d);
    expect(tileIn(setWatchTileHTTPValueLineLimit(d, PAGE, T, 8)).httpTileValueLineLimit).toBe(8);
    expect(setWatchTileHTTPValueLineLimit(d, PAGE, T, 0)).toBe(d);
    const spaced = setWatchTileHTTPValueLineSpacing(d, PAGE, T, 3);
    expect(tileIn(spaced).httpTileValueLineSpacing).toBe(3);
    expect(Object.hasOwn(tileIn(setWatchTileHTTPValueLineSpacing(spaced, PAGE, T, 0)), "httpTileValueLineSpacing")).toBe(false);
    const up = setWatchTileHTTPValueOffsetY(d, PAGE, T, -4);
    expect(tileIn(up).httpTileValueOffsetY).toBe(-4);
    expect(Object.hasOwn(tileIn(setWatchTileHTTPValueOffsetY(up, PAGE, T, 0)), "httpTileValueOffsetY")).toBe(false);
    expect(setWatchTileHTTPValueOffsetY(d, PAGE, T, 21)).toBe(d);
    expect(tileIn(setWatchTileHTTPValueColor(d, PAGE, T, "ffd60a")).httpTileValueColorHex).toBe("#FFD60A");
    expect(setWatchTileHTTPValueColor(d, PAGE, T, "#RAINBOW")).toBe(d);
    expect(tileIn(setWatchTileHTTPShowName(d, PAGE, T, false)).httpTileValueShowName).toBe(false);
    expect(setWatchTileHTTPShowName(d, PAGE, T, true)).toBe(d);
    expect(tileIn(setWatchTileHTTPRefreshOnPull(d, PAGE, T, true)).httpAutoRefreshOnPull).toBe(true);
    expect(setWatchTileHTTPRefreshOnPull(d, PAGE, T, false)).toBe(d);
  });

  it("Auto-refresh sets one rung and clears the other in one edit", () => {
    const d = tv();
    const open = setWatchTileHTTPRefresh(d, PAGE, T, "onOpen");
    expect(tileIn(open).httpAutoRefreshOnOpen).toBe(true);
    const every = tileIn(setWatchTileHTTPRefresh(open, PAGE, T, 10));
    expect(every.httpAutoRefreshInterval).toBe(10);
    expect(Object.hasOwn(every, "httpAutoRefreshOnOpen")).toBe(false);
    const off = tileIn(setWatchTileHTTPRefresh(setWatchTileHTTPRefresh(open, PAGE, T, 10), PAGE, T, "off"));
    expect(Object.hasOwn(off, "httpAutoRefreshOnOpen") || Object.hasOwn(off, "httpAutoRefreshInterval")).toBe(false);
    expect(setWatchTileHTTPRefresh(d, PAGE, T, 7)).toBe(d);
    // Keys go in at their sorted place, as the phone encodes them.
    const keys = Object.keys(tileIn(open));
    expect(keys).toEqual([...keys].sort());
  });

  it("every key it writes is a tile key", () => {
    const tile = (pageKeys as unknown as { types: { tile: { keys: Record<string, unknown> } } }).types.tile.keys;
    for (const key of WATCH_LIBRARY_SETTING_KEYS) expect(Object.hasOwn(tile, key), key).toBe(true);
  });
});

// ── the Macro task ───────────────────────────────────────────────────────

describe("the Macro task", () => {
  it("reads a stored mode, else the legacy bool", () => {
    expect(watchMacroSettings(macro())).toEqual({ runSilently: false, closeMode: "onSuccess", legacyClose: false });
    expect(watchMacroSettings(macro({ autoCloseMacroRun: true })).legacyClose).toBe(true);
    expect(watchMacroSettings(macro({ autoCloseMacroRun: false })).closeMode).toBe("stayOpen");
    expect(watchMacroSettings(macro({ autoCloseMacroRun: true })).closeMode).toBe("onSuccess");
    expect(watchMacroSettings(macro({ macroCloseMode: "always", autoCloseMacroRun: false })).closeMode).toBe("always");
    // A mode the watch does not know falls back to the bool.
    expect(watchMacroSettings(macro({ macroCloseMode: "later", autoCloseMacroRun: false })).closeMode).toBe("stayOpen");
    expect(watchMacroSettings(macro({ macroRunSilently: true })).runSilently).toBe(true);
  });

  it("refuses a mode the phone does not have", () => {
    const doc = docWith(macro());
    expect(setWatchTileMacroCloseMode(doc, PAGE, T, "later" as never)).toBe(doc);
    expect(setWatchTileMacroCloseMode(doc, PAGE, T, "onSuccess")).not.toBe(doc);
  });

  it("a legacy close setting is written out when its mode is picked again", () => {
    // `autoCloseMacroRun: true` shows On success; picking On success writes
    // the explicit mode and removes the legacy key, one undo step.
    const { host, tile, draft } = draftHost(macro({ autoCloseMacroRun: true }));
    expect(watchMacroSettings(tile()).closeMode).toBe("onSuccess");
    commit(host, "macroCloseMode", (d) => setWatchTileMacroCloseMode(d, PAGE, T, "onSuccess"));
    expect(tile().macroCloseMode).toBe("onSuccess");
    expect(Object.hasOwn(tile(), "autoCloseMacroRun")).toBe(false);
    expect(watchMacroSettings(tile()).legacyClose).toBe(false);
    expect(draft.undoDepth).toBe(1);
  });
});

// ── hold and slide ───────────────────────────────────────────────────────

describe("Run HTTP Action in hold and slide", () => {
  const light = () => docWith(tileOf({ entityId: "light.desk_lamp", customLabel: "Desk Lamp" }));

  it("is offered only with an HTTP action in the catalog", () => {
    const tile = tileIn(light());
    expect(watchHoldSlideSettings(tile).directions.every((d) => !d.offered.some((c) => c.value === "httpAction"))).toBe(true);
    expect(watchHoldSlideSettings(tile, { httpActions: true }).directions.every((d) => d.offered.some((c) => c.value === "httpAction"))).toBe(true);
  });

  it("writes the action and its target together, the id in upper case", () => {
    const after = tileIn(setWatchTileHoldSlideHTTP(light(), PAGE, T, "up", OPEN_GATE!.id.toLowerCase()));
    expect(after.holdSlideActions).toEqual(["up", "httpAction"]);
    expect(after.holdSlideHTTPActionTargets).toEqual(["up", OPEN_GATE!.id]);
    // Never Run HTTP Action without a target.
    const d = light();
    expect(setWatchTileHoldSlide(d, PAGE, T, "up", "httpAction")).toBe(d);
  });

  it("refuses an id that is no UUID, a kind with no card, and arrays that do not parse", () => {
    const d = light();
    expect(isWatchUUID("not-a-uuid")).toBe(false);
    expect(setWatchTileHoldSlideHTTP(d, PAGE, T, "up", "not-a-uuid")).toBe(d);
    expect(setWatchTileHoldSlideHTTP(d, PAGE, T, "sideways" as never, OPEN_GATE!.id)).toBe(d);
    const spacer = docWith(tileOf({ entityId: "spacer.X" }));
    expect(setWatchTileHoldSlideHTTP(spacer, PAGE, T, "up", OPEN_GATE!.id)).toBe(spacer);
    const bad = docWith(tileOf({ entityId: "light.desk_lamp", holdSlideTriggerTargets: ["up"] }));
    expect(setWatchTileHoldSlideHTTP(bad, PAGE, T, "up", OPEN_GATE!.id)).toBe(bad);
  });

  it("the banner keys need the direction to run an HTTP action", () => {
    const d = light();
    expect(setWatchTileHoldSlideHTTPBanner(d, PAGE, T, "up", false)).toBe(d);
    expect(setWatchTileHoldSlideHTTPBannerSeconds(d, PAGE, T, "up", 5)).toBe(d);
    const set = setWatchTileHoldSlideHTTP(d, PAGE, T, "up", OPEN_GATE!.id);
    expect(setWatchTileHoldSlideHTTPBanner(set, PAGE, T, "up", true)).toBe(set);
    expect(setWatchTileHoldSlideHTTPBannerSeconds(set, PAGE, T, "up", 3)).toBe(set);
    expect(setWatchTileHoldSlideHTTPBannerSeconds(set, PAGE, T, "up", 4)).toBe(set);
    const off = setWatchTileHoldSlideHTTPBanner(set, PAGE, T, "up", false);
    expect(tileIn(off).holdSlideHTTPActionShowBanner).toEqual(["up", false]);
    expect(setWatchTileHoldSlideHTTPBanner(off, PAGE, T, "up", false)).toBe(off);
    const settings = watchHoldSlideSettings(tileIn(setWatchTileHoldSlideHTTPBannerSeconds(off, PAGE, T, "up", 2)));
    expect(settings.directions[0]).toMatchObject({ httpBanner: false, httpBannerSeconds: 2, httpTarget: OPEN_GATE!.id });
  });

  it("all four arrays stay in the order up, down, left, right", () => {
    let d = light();
    for (const dir of [...WATCH_SLIDE_DIRECTIONS].reverse()) {
      d = setWatchTileHoldSlideHTTP(d, PAGE, T, dir, OPEN_GATE!.id);
      d = setWatchTileHoldSlideHTTPBanner(d, PAGE, T, dir, false);
      d = setWatchTileHoldSlideHTTPBannerSeconds(d, PAGE, T, dir, 5);
    }
    const t = tileIn(d);
    for (const key of ["holdSlideActions", "holdSlideHTTPActionTargets", "holdSlideHTTPActionShowBanner", "holdSlideHTTPActionBannerSeconds"]) {
      expect((t[key] as unknown[]).filter((_, i) => i % 2 === 0), key).toEqual(["up", "down", "left", "right"]);
    }
  });

  it("a stored banner array that does not parse leaves the card unreadable", () => {
    expect(watchHoldSlideSettings(tileOf({ entityId: "light.desk_lamp", holdSlideHTTPActionShowBanner: ["up"] })).parses).toBe(false);
  });
});

describe("the hold and slide menus with a catalog", () => {
  const lamp = (patch: Json = {}) => tileOf({ entityId: "light.desk_lamp", ...patch });

  it("list each action under one heading, before None; a warning in the words", () => {
    const row = watchHoldSlideMenus(lamp(), CATALOG)!.rows[0]!;
    const http = row.options.filter((o) => o.group !== undefined);
    expect(http.map((o) => o.group)).toEqual(["Run HTTP Action", "Run HTTP Action", "Run HTTP Action", "Run HTTP Action"]);
    expect(http.map((o) => watchHTTPSlideChoice(o.value))).toEqual(CATALOG.httpActions.map((a) => a.id));
    expect(http.at(-1)!.label).toBe("Garage Door (needs setup on the iPhone)");
    expect(row.options.at(-1)!.value).toBe("none");
    expect(row.options.some((o) => o.value === "httpAction")).toBe(false);
    expect(row.http).toBeUndefined();
  });

  it("offer nothing of the kind with no catalog, or one with no HTTP action", () => {
    for (const catalog of [undefined, readWatchCatalog({ macros: [{ id: "M", name: "M" }] })]) {
      const row = watchHoldSlideMenus(lamp(), catalog)!.rows[0]!;
      expect(row.options.some((o) => o.group !== undefined || o.value === "httpAction")).toBe(false);
    }
    // An entry whose id is no UUID could never be stored: not offered.
    const odd = readWatchCatalog({ httpActions: [{ id: "abc", name: "Odd" }] });
    expect(watchHoldSlideMenus(lamp(), odd)!.rows[0]!.options.some((o) => o.group !== undefined)).toBe(false);
  });

  it("select the stored action's entry and carry its banner", () => {
    const tile = lamp({
      holdSlideActions: ["left", "httpAction"],
      holdSlideHTTPActionTargets: ["left", OUTDOOR!.id.toLowerCase()],
      holdSlideHTTPActionShowBanner: ["left", false],
    });
    const row = watchHoldSlideMenus(tile, CATALOG)!.rows[2]!;
    expect(watchHTTPSlideChoice(row.selected)).toBe(OUTDOOR!.id);
    expect(row.note).toBeUndefined();
    expect(row.http).toMatchObject({ targetId: OUTDOOR!.id.toLowerCase(), entry: OUTDOOR, banner: false });
    expect(row.http!.seconds.selected).toBe("3");
  });

  it("show a stored target the catalog does not list as not on the iPhone, and keep it", () => {
    const tile = lamp({ holdSlideActions: ["up", "httpAction"], holdSlideHTTPActionTargets: ["up", "C3A0E000-0000-4000-8000-0000000000FF"] });
    const row = watchHoldSlideMenus(tile, CATALOG)!.rows[0]!;
    expect(isWatchStoredChoice(row.selected)).toBe(true);
    expect(row.options.find((o) => o.value === row.selected)).toMatchObject({ label: "Run HTTP Action (not on the iPhone)", disabled: true });
    expect(row.note).toMatch(/no longer lists/);
    expect(row.http?.entry).toBeUndefined();
    // Without a catalog it is shown, not offered, and its banner keys stay editable.
    const plain = watchHoldSlideMenus(tile)!.rows[0]!;
    expect(plain.options.find((o) => o.value === plain.selected)).toMatchObject({ label: "Run HTTP Action", disabled: true });
    expect(plain.http).toBeDefined();
  });

  it("name the seconds, a stored one the phone does not offer first", () => {
    const tile = lamp({ holdSlideActions: ["up", "httpAction"], holdSlideHTTPActionTargets: ["up", OPEN_GATE!.id], holdSlideHTTPActionBannerSeconds: ["up", 10] });
    const seconds = watchHoldSlideMenus(tile, CATALOG)!.rows[0]!.http!.seconds;
    expect(seconds.options.map((o) => o.label)).toEqual(["10 seconds", "1 second", "2 seconds", "3 seconds", "5 seconds"]);
    expect(isWatchStoredChoice(seconds.selected)).toBe(true);
  });

  it("Reset all drops each direction with its targets and keeps the banner keys, as the phone's card does", () => {
    const tile = lamp({
      holdSlideActions: ["up", "httpAction", "down", "triggerEntity"],
      holdSlideHTTPActionBannerSeconds: ["up", 5],
      holdSlideHTTPActionShowBanner: ["up", false],
      holdSlideHTTPActionTargets: ["up", OPEN_GATE!.id],
      holdSlideTriggerTargets: ["down", { entityId: "script.night", mode: "run" }],
    });
    const after = tileIn(clearWatchTileHoldSlide(docWith(tile), PAGE, T));
    for (const key of ["holdSlideActions", "holdSlideHTTPActionTargets", "holdSlideTriggerTargets"]) expect(Object.hasOwn(after, key), key).toBe(false);
    expect(after.holdSlideHTTPActionShowBanner).toEqual(["up", false]);
    expect(after.holdSlideHTTPActionBannerSeconds).toEqual(["up", 5]);
  });
});

// ── the view's menus and words ───────────────────────────────────────────

describe("the Tile card for a library tile", () => {
  it("gets Target first, then its own task", () => {
    expect(watchTileSettingsSections(http())).toEqual(["target", "request", "icon", "text", "border", "action", "background"]);
    expect(watchTileSettingsSections(macro())).toEqual(["target", "macro", "icon", "text", "border", "action", "background"]);
    expect(watchTileSettingsSections(statusPage())).toEqual(["target", "icon", "text", "border", "action", "background"]);
  });

  it("the Target menu lists the kind's entries with the phone's subtitles and warnings", () => {
    const menu = watchLibraryTargetMenu(macro(), CATALOG)!;
    expect(menu.options.map((o) => o.label)).toEqual(["Bedtime (4 steps)", "Leave Home (1 step, Needs attention on the iPhone)", "Macro (0 steps, Needs attention on the iPhone)"]);
    expect(menu.selected).toBe(BEDTIME!.id);
    expect(menu.oldTargetName).toBe("Bedtime");
    expect(menu.note).toBeUndefined();
    expect(watchLibraryTargetMenu(tileOf({ entityId: "light.desk" }), CATALOG)).toBeUndefined();
  });

  it("a target not in the catalog: the stored label, Not on the iPhone, and every entry still offered", () => {
    const gone = statusPage({ entityId: "status_page.C3A0E000-0000-4000-8000-0000000000FF", customLabel: "Garden" });
    const menu = watchLibraryTargetMenu(gone, CATALOG)!;
    expect(menu.options[0]).toMatchObject({ label: "Garden (Not on the iPhone)", disabled: true });
    expect(menu.selected).toBe(menu.options[0]!.value);
    expect(menu.oldTargetName).toBeNull();
    expect(menu.options.slice(1).map((o) => o.label)).toEqual(["Lights (1 row)", "Upstairs (6 rows)"]);
    expect(menu.note).toMatch(/Not on the iPhone/);
    const none = watchLibraryTargetMenu(gone, readWatchCatalog({}))!;
    expect(none.note).toMatch(/no other status pages/);
  });

  it("Show reply offers Tile value only for an action with a reply value", () => {
    const withReply = watchHTTPReplyMenu(http(), OUTDOOR);
    expect(withReply.options.map((o) => [o.value, o.disabled === true])).toEqual([[WATCH_HTTP_REPLY_OFF, false], ["toast", false], ["tileValue", false]]);
    expect(withReply.selected).toBe("toast");
    const without = watchHTTPReplyMenu(http({ httpResponseDisplay: undefined }), OPEN_GATE);
    expect(without.options[2]!.disabled).toBe(true);
    expect(without.selected).toBe(WATCH_HTTP_REPLY_OFF);
    expect(without.note).toMatch(/Reply Value/);
    // Stored Tile value stays selectable, even with no catalog.
    const stored = watchHTTPReplyMenu(http({ httpResponseDisplay: "tileValue" }), undefined);
    expect(stored.options[2]!.disabled).toBeUndefined();
    expect(stored.selected).toBe("tileValue");
    expect(watchHTTPReplyMenu(http({ httpResponseDisplay: "popup" }), OUTDOOR).note).toMatch(/reads as Off/);
  });

  it("names a tile with no label as the watch does", () => {
    const bare = (t: WatchPageTile) => {
      const out = { ...t };
      delete out.customLabel;
      return out;
    };
    expect(watchTileFallbackName(bare(http()), {}, [], CATALOG)).toBe("Action");
    expect(watchTileFallbackName(bare(macro()), {}, [], CATALOG)).toBe("Bedtime");
    expect(watchTileFallbackName(bare(macro()), {}, [])).toBe("Macro");
    expect(watchTileFallbackName(bare(statusPage()), {}, [], CATALOG)).toBe("Lights");
    expect(watchLabelNote(http())).toMatch(/"Action"/);
    expect(watchLabelNote(macro())).toMatch(/macro's name/);
  });

  it("a target not in the catalog and no label of its own reads as the watch names it", () => {
    const missing = "C3A0E000-0000-4000-8000-0000000000FF";
    const bare = (t: WatchPageTile) => {
      const out = { ...t };
      delete out.customLabel;
      return out;
    };
    expect(watchLibraryTargetMenu(bare(http({ entityId: `http_action.${missing}` })), CATALOG)!.options[0]!.label).toBe("Action (Not on the iPhone)");
    expect(watchLibraryTargetMenu(macro({ entityId: `macro.${missing}`, customLabel: " " }), CATALOG)!.options[0]!.label).toBe("Macro (Not on the iPhone)");
    expect(watchLibraryTargetMenu(bare(statusPage({ entityId: `status_page.${missing}` })), CATALOG)!.options[0]!.label).toBe("Status Page (Not on the iPhone)");
  });

  it("the Tile value hint says when the iPhone has not listed the action", () => {
    // No catalog, or a target the catalog does not list: the panel cannot
    // know whether it has a Reply Value.
    const unknown = watchHTTPReplyMenu(http(), undefined);
    expect(unknown.options[2]!.disabled).toBe(true);
    expect(unknown.note).toMatch(/has not listed this action/);
    expect(unknown.note).not.toMatch(/needs a Reply Value/);
    expect(watchHTTPReplyMenu(http(), OPEN_GATE).note).toMatch(/needs a Reply Value/);
  });

  it("a stored value off a ladder shows with its unit", () => {
    expect(watchHTTPBannerSecondsMenu(6).options[0]).toMatchObject({ label: "6 seconds", disabled: true });
    expect(watchHTTPBannerSecondsMenu(undefined).selected).toBe("3");
    expect(watchHTTPBannerSecondsMenu("soon").options[0]!.label).toBe("soon");
    const refresh = watchHTTPRefreshMenu(60);
    expect(refresh.options[0]).toMatchObject({ label: "Every 60 seconds", disabled: true });
    expect(refresh.options.slice(1).map((o) => o.label)).toEqual(["Off", "On open", "Every second", "Every 3 seconds", "Every 5 seconds", "Every 10 seconds", "Every 30 seconds"]);
    expect(watchHTTPRefreshMenu(30).selected).toBe("30");
    expect(watchHTTPRefreshMenu("onOpen").note).toBeUndefined();
  });
});

// ── through a host, as the view edits ────────────────────────────────────

function draftHost(tile: WatchPageTile, catalog = CATALOG) {
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [{ id: PAGE, name: "Living", items: [tile] }] }, 1);
  const pageNow = () => (draft.document.pages as WatchPage[])[0]!;
  let held: typeof CATALOG | undefined = catalog;
  const host = {
    hass: { states: {} },
    icons: NO_ICONS,
    get document() { return draft.document; },
    pageId: PAGE,
    get page() { return pageNow(); },
    otherPages: [],
    get catalog() { return held; },
    busy: false,
    uiState: new Map<string, unknown>(),
    apply: (next: WatchPagesDocument, options?: WatchPagesApplyOptions) => draft.apply(next, options),
    endCoalesce: () => draft.endCoalesce(),
    selectTile: () => undefined,
    requestUpdate: () => undefined,
    tileId: T,
    get tile() { return (pageNow().items as WatchPageTile[])[0]!; },
  } as unknown as TileSettingsHost;
  return { draft, host, tile: () => host.tile, setCatalog: (c: typeof CATALOG | undefined) => { held = c; } };
}

describe("edits through the host", () => {
  it("a slide's action and target are one undo step", () => {
    const { host, draft, tile } = draftHost(tileOf({ entityId: "light.desk_lamp" }));
    commit(host, "slide:up", (d) => setWatchTileHoldSlideHTTP(d, PAGE, T, "up", OPEN_GATE!.id));
    expect(draft.undoDepth).toBe(1);
    draft.undo();
    expect(Object.hasOwn(tile(), "holdSlideActions") || Object.hasOwn(tile(), "holdSlideHTTPActionTargets")).toBe(false);
  });

  it("a retarget reads the old name from the catalog as it is when the pick lands", () => {
    const { host, tile, setCatalog } = draftHost(macro());
    // The phone renamed Bedtime after the menu was drawn.
    setCatalog(readWatchCatalog({ macros: [{ ...BEDTIME, name: "Night" }, LEAVE] }));
    commit(host, "target", (d) => {
      const old = host.catalog!.macros.find((m) => m.id === BEDTIME!.id)?.name;
      return setWatchLibraryTileTarget(d, PAGE, T, "macro", LEAVE!, old === undefined ? [] : [old]);
    });
    // "Bedtime" is no longer the old entry's name: the label stays.
    expect(tile().customLabel).toBe("Bedtime");
    expect(tile().entityId).toBe(`macro.${LEAVE!.id}`);
  });

  it("the Request task's edits each start from the edit before", () => {
    const { host, tile, draft } = draftHost(http());
    commit(host, "httpReply", (d) => setWatchTileHTTPReply(d, PAGE, T, "tileValue"));
    commit(host, "httpRefresh", (d) => setWatchTileHTTPRefresh(d, PAGE, T, 30));
    expect(tile()).toMatchObject({ httpResponseDisplay: "tileValue", icon: "", httpAutoRefreshInterval: 30 });
    expect(draft.undoDepth).toBe(2);
    commit(host, "httpReply", (d) => setWatchTileHTTPReply(d, PAGE, T, null));
    expect(Object.hasOwn(tile(), "httpAutoRefreshInterval") || Object.hasOwn(tile(), "icon") || Object.hasOwn(tile(), "httpResponseDisplay")).toBe(false);
  });

  it("on a macro tile each Default writes only its own key, from the macro's style", () => {
    // Icon and color both changed away from Bedtime's own.
    const { host, tile, draft } = draftHost(macro({ icon: "star", color: "#30D158" }));
    commit(host, "color", watchTileDefaultColorEdit(host));
    expect([tile().icon, tile().color]).toEqual(["star", "#FF9F0A"]);
    commit(host, "icon", watchTileDefaultIconEdit(host));
    expect([tile().icon, tile().color]).toEqual(["moon.fill", "#FF9F0A"]);
    expect(draft.undoDepth).toBe(2);
    // A macro the catalog does not list, or no catalog: link and the accent.
    for (const catalog of [readWatchCatalog({}), undefined]) {
      const other = draftHost(macro({ icon: "star", color: "#30D158" }));
      other.setCatalog(catalog);
      commit(other.host, "color", watchTileDefaultColorEdit(other.host));
      expect([other.tile().icon, other.tile().color]).toEqual(["star", "#CCD8E6"]);
      commit(other.host, "icon", watchTileDefaultIconEdit(other.host));
      expect([other.tile().icon, other.tile().color]).toEqual(["link", "#CCD8E6"]);
    }
  });

  it("a retarget writes the catalog's id in upper case, whatever case the phone listed it in", () => {
    const lower = readWatchCatalog({ macros: [{ ...BEDTIME }, { ...LEAVE, id: LEAVE!.id.toLowerCase() }] });
    const { host, tile } = draftHost(macro(), lower);
    const entry = host.catalog!.macros[1]!;
    expect(entry.id).toBe(LEAVE!.id.toLowerCase());
    commit(host, "target", (d) => setWatchLibraryTileTarget(d, PAGE, T, "macro", entry, ["Bedtime"]));
    expect(tile().entityId).toBe(`macro.${LEAVE!.id.toUpperCase()}`);
    expect(tile().customLabel).toBe(LEAVE!.name);
  });
});

// ── the preview ──────────────────────────────────────────────────────────

describe("the preview of an HTTP action tile showing its value", () => {
  it("draws the value's size, color and place; nothing for other tiles", () => {
    expect(watchHTTPTileValueLook(http())).toBeUndefined();
    expect(watchHTTPTileValueLook(macro({ httpResponseDisplay: "tileValue" }))).toBeUndefined();
    expect(watchHTTPTileValueLook(http({ httpResponseDisplay: "tileValue" }))).toEqual({ fontSize: undefined, color: undefined, offsetY: 0, showName: true });
    expect(
      watchHTTPTileValueLook(http({ httpResponseDisplay: "tileValue", httpTileValueFontSize: 90, httpTileValueColorHex: "#FFD60A", httpTileValueOffsetY: -40, httpTileValueShowName: false })),
    ).toEqual({ fontSize: 60, color: "#FFD60A", offsetY: -20, showName: false });
  });
});

describe("the preview's name for a library tile with no label of its own", () => {
  const bare = (t: WatchPageTile) => {
    const out = { ...t };
    delete out.customLabel;
    return out;
  };
  const input = { states: {}, pages: [] as WatchPage[], catalog: CATALOG };

  it("is the watch's: Action, the macro's or status page's catalog name", () => {
    expect(watchPreviewTileLabel(bare(http()), input)).toBe("Action");
    expect(watchPreviewTileLabel(http({ customLabel: "  " }), input)).toBe("Action");
    expect(watchPreviewTileLabel(bare(macro()), input)).toBe("Bedtime");
    expect(watchPreviewTileLabel(bare(statusPage()), input)).toBe("Lights");
  });

  it("falls back to Macro and Status Page with no catalog entry, and keeps a label", () => {
    const none = { states: {}, pages: [] as WatchPage[] };
    expect(watchPreviewTileLabel(bare(macro()), none)).toBe("Macro");
    expect(watchPreviewTileLabel(bare(statusPage()), none)).toBe("Status Page");
    expect(watchPreviewTileLabel(bare(http()), none)).toBe("Action");
    expect(watchPreviewTileLabel(macro({ customLabel: "Night" }), input)).toBe("Night");
    // Other tiles as before.
    expect(watchPreviewTileLabel(tileOf({ entityId: "light.desk", customLabel: undefined }), { states: { "light.desk": { entity_id: "light.desk", state: "on", attributes: { friendly_name: "Desk" } } } as never, pages: [] })).toBe("Desk");
  });
});
