// An iPhone's pages are edited with the same tile and page settings as a
// watch's. The lines that name the device showing the page say "iPhone"
// there (the host's `device`), and keep saying "watch" for a watch or a
// host that names no device. A tile only the iPhone draws names the iPhone
// on every editor, and the words the editor adds for the iPhone only tiles
// and keys (the Add tile group, the stage outline, the "iPhone extras" fold,
// the device strip's "skips 2", the Help sheet's line) are checked here.

import { html } from "lit";
import { describe, expect, it } from "vitest";

import { SymbolBrowser } from "../src/symbols.js";
import { WATCH_PHONE_GREYED_TEXT, WATCH_PHONE_GROUP_TITLE, watchAddEmptyText, watchLeftOutText, watchPhoneTilesBlockedText } from "../src/watch-pages/add-tile-list.js";
import { WATCH_PHONE_TILE_STAGE_TEXT } from "../src/watch-pages/preview.js";
import {
  type WatchCatalog,
  readWatchCatalog,
  watchCatalogWithStatusPages,
  watchLibraryLister,
  watchLibraryMissingText,
} from "../src/watch-pages/catalog.js";
import { rejectedText } from "../src/watch-pages/config-foot.js";
import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { findWatchPage } from "../src/watch-pages/edit.js";
import { NO_ICONS, type TileSettingsHost, hostDevice, hostDeviceNoun } from "../src/watch-pages/editor-host.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { watchPagesSaveNote } from "../src/watch-pages/save-note.js";
import { smartDuplicateDomainNote, smartWord } from "../src/watch-pages/smart-model.js";
import { type SwitcherSettingsHost, renderSwitcherSettings } from "../src/watch-pages/switcher-settings.js";
import {
  WATCH_PHONE_EXTRAS_HINT,
  WATCH_PHONE_EXTRAS_TITLE,
  watchColorRefusal,
  watchHTTPReplyMenu,
  watchHoldSlideMenus,
  watchLabelNote,
  watchLibraryTargetMenu,
} from "../src/watch-pages/tile-settings-options.js";
import { renderTileHead, renderTileSettings } from "../src/watch-pages/tile-settings.js";
import { PAGES_PHONE_TILES_TEXT } from "../src/help-sheet.js";
import { tickSkipsText, tickSkipsTitle } from "../src/library/ticks.js";
import { WATCH_PHONE_SETTING_KEYS, watchPhoneKeyKinds } from "../src/watch-pages/phone-keys-model.js";
import { isVirtualTileKind } from "../src/watch-pages/model.js";

// The views ask for the focused field (`document.activeElement`); Node has
// no document.
(globalThis as { document?: unknown }).document ??= { activeElement: null };
(globalThis as { HTMLElement?: unknown }).HTMLElement ??= class {};

/** A template's text with its values. */
function text(t: unknown): string {
  if (typeof t === "symbol" || t === null || t === undefined) return "";
  if (Array.isArray(t)) return t.map(text).join("");
  if (typeof t !== "object") return String(t);
  const r = t as { strings?: readonly string[]; values?: unknown[] };
  if (r.strings === undefined) return "";
  return r.strings.map((s, i) => s + (i < (r.values?.length ?? 0) ? text(r.values![i]) : "")).join("");
}

const PAGE_ID = "C3A0E000-0000-4000-8000-0000000000AA";
const TILE_ID = "C3A0E000-0000-4000-8000-000000000001";
const ACTION = "C3A0E000-0000-4000-8000-0000000000B1";
const GONE = "C3A0E000-0000-4000-8000-0000000000FF";

const tile = (entityId: string, extra: Record<string, unknown> = {}): WatchPageTile => ({ id: TILE_ID, entityId, ...extra });

/** A tile host as the page editor builds one, for `device`. */
function tileHost(items: WatchPageTile[], device?: "watch" | "iphone"): TileSettingsHost {
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [{ id: PAGE_ID, name: "Living", items }] }, 1);
  const pageNow = () => (draft.document.pages as WatchPage[])[0]!;
  return {
    hass: { states: {} },
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    get document() { return draft.document; },
    device,
    pageId: PAGE_ID,
    get page() { return pageNow(); },
    otherPages: [],
    catalog: undefined,
    cameraRefreshDefaults: { on: true, debounce: "5" },
    behavior: undefined,
    musicAssistant: undefined,
    cloudTTS: undefined,
    templateRenders: new Map(),
    deviceSiblings: () => ({ selects: [], switches: [], sensors: [], all: [] }),
    smartRuleId: undefined,
    busy: false,
    uiState: new Map<string, unknown>(),
    apply: (next: WatchPagesDocument) => draft.apply(next),
    endCoalesce: () => draft.endCoalesce(),
    selectTile: () => undefined,
    requestUpdate: () => undefined,
    tileId: TILE_ID,
    get tile() { return ((pageNow().items as WatchPageTile[] | undefined) ?? []).find((t) => t.id === TILE_ID) ?? ({} as WatchPageTile); },
  } as unknown as TileSettingsHost;
}

describe("the host's device", () => {
  it("is a watch unless the host names an iPhone", () => {
    expect(hostDevice({})).toBe("watch");
    expect(hostDeviceNoun({})).toBe("watch");
    expect(hostDeviceNoun({ device: "watch" })).toBe("watch");
    expect(hostDevice({ device: "iphone" })).toBe("iphone");
    expect(hostDeviceNoun({ device: "iphone" })).toBe("iPhone");
  });
});

describe("tile settings on an iPhone", () => {
  it("name the iPhone in the drawn rows", () => {
    // Folded sections draw their bodies too, so every row's line is there.
    const phone = text(renderTileSettings(tileHost([tile("light.desk", { color: "#RAINBOW" })], "iphone")));
    for (const line of ["The iPhone cycles the tile through every color.", "The iPhone always shows this tile."]) {
      expect(phone, line).toContain(line);
    }
    expect(phone).not.toMatch(/the watch\b|watch's/i);
    const watch = text(renderTileSettings(tileHost([tile("light.desk", { color: "#RAINBOW" })])));
    expect(watch).toContain("The watch cycles the tile through every color.");
    expect(watch).toContain("The watch always shows this tile.");
  });

  it("never name the watch for a kind's own rows", () => {
    const own: Record<string, string> = {
      "automation.night": "Whether running the automation from the iPhone skips its conditions.",
      "camera.door": "Default follows the iPhone's camera setting.",
      "remote.tv": "Scripts the remote runs from its quick action list on the iPhone.",
      "calendar.home": "The iPhone's calendar sheet colors each one's events.",
      "weather.home": "Both change the iPhone's weather detail and forecast rows, not the tile.",
      "divider.line.custom": "",
      "script.bed": "",
      "media_player.tv": "",
      "sensor.temp": "",
      "person.alex": "",
      [`http_action.${ACTION}`]: "",
      [`status_page.${GONE}`]: "",
    };
    for (const [entityId, line] of Object.entries(own)) {
      const drawn = text(renderTileSettings(tileHost([tile(entityId, { color: "#RAINBOW" })], "iphone")));
      expect(drawn.match(/[^.>]*\b(the watch|watch's)\b[^.<]*/gi) ?? [], entityId).toEqual([]);
      if (line !== "") expect(drawn, entityId).toContain(line);
    }
  });

  it("name the iPhone in a tile that hides while off", () => {
    const phone = text(renderTileSettings(tileHost([tile("light.desk", { hideWhenInactive: true })], "iphone")));
    expect(phone).toContain("The iPhone leaves the tile out while it is off.");
  });

  it("draw Show tile in its own Visibility card, with a template's result now", () => {
    const dark = "{{ is_state('sun.sun', 'below_horizon') }}";
    const host = (value: { ok: true; value: string } | { ok: false; error: string } | undefined, device?: "iphone") => {
      const h = tileHost([tile("light.desk", { showWhenTemplate: dark })], device);
      const renders = new Map(value === undefined ? [] : [[`show:${TILE_ID}`, { text: dark, result: value }]]);
      return Object.assign(Object.create(Object.getPrototypeOf(h)), h, { templateRenders: renders }) as TileSettingsHost;
    };
    const drawn = text(renderTileSettings(host({ ok: true, value: "False" })));
    expect(drawn).toContain("Visibility");
    expect(drawn).toContain("Now it renders <code>False</code>, so the tile is hidden.");
    expect(text(renderTileSettings(host({ ok: true, value: "true" })))).toContain("so the tile is shown.");
    expect(text(renderTileSettings(host(undefined)))).toContain("Rendering in Home Assistant…");
    const failed = text(renderTileSettings(host({ ok: false, error: "TemplateSyntaxError: unexpected '}'" }, "iphone")));
    expect(failed).toContain("TemplateSyntaxError: unexpected '}' While it fails, the iPhone shows the tile.");
    expect(failed.match(/[^.>]*\b(the watch|watch's)\b[^.<]*/gi) ?? []).toEqual([]);
  });

  it("name the iPhone in the notes and refusals", () => {
    expect(watchLabelNote(tile("light.desk"), "iphone")).toBe("Leave it empty to show the name Home Assistant has.");
    const http = tile(`http_action.${ACTION}`);
    expect(watchLabelNote(http, "iphone")).toBe("Leave it empty and the iPhone shows \"Action\".");
    expect(watchLabelNote(http)).toBe("Leave it empty and the watch shows \"Action\".");
    expect(watchColorRefusal("#FFC14580", "iphone")).toBe("The iPhone has no opacity. Use six digits, #RRGGBB.");
    expect(watchColorRefusal("#FFC14580")).toBe("The watch has no opacity. Use six digits, #RRGGBB.");
    expect(watchHTTPReplyMenu(tile(`http_action.${ACTION}`, { httpResponseDisplay: "popup" }), undefined, undefined, "iphone").note)
      .toBe("Stored as \"popup\", which the iPhone reads as Off.");
  });

  it("name the iPhone in a hold slide whose action is gone", () => {
    const catalog: WatchCatalog = readWatchCatalog({ httpActions: [{ id: ACTION, name: "Open gate" }] });
    const stored = tile("light.desk", { holdSlideActions: ["up", "httpAction"], holdSlideHTTPActionTargets: ["up", GONE] });
    const row = watchHoldSlideMenus(stored, catalog, "iphone")!.rows[0]!;
    expect(row.note).toBe("The iPhone no longer lists this action. Pick another, or the iPhone fails the slide.");
  });

  it("name this iPhone's own status pages", () => {
    const own = watchCatalogWithStatusPages(undefined, [])!;
    expect(watchLibraryMissingText(own, "statusPage", "iphone")).toBe("Not in this iPhone's status pages");
    expect(watchLibraryLister(own, "statusPage", "iphone")).toBe("This iPhone");
    expect(watchLibraryTargetMenu(tile(`status_page.${GONE}`), own, "iphone")!.note)
      .toBe("Not in this iPhone's status pages, and this iPhone has no other status pages. The tile stays as it is.");
    // A watch, as before.
    expect(watchLibraryMissingText(own, "statusPage")).toBe("Not in this watch's status pages");
  });
});

describe("the keys only the iPhone reads", () => {
  it("fold on a watch's editor under iPhone extras, and never name the watch on an iPhone's", () => {
    expect(WATCH_PHONE_EXTRAS_TITLE).toBe("iPhone extras");
    expect(WATCH_PHONE_EXTRAS_HINT).toBe("The watch ignores these");
    // Every kind that has a key only the iPhone reads.
    const kinds = [...new Set(WATCH_PHONE_SETTING_KEYS.flatMap((key) => watchPhoneKeyKinds(key)))];
    expect(kinds.length).toBeGreaterThanOrEqual(6);
    const ids = kinds.map((kind) => (isVirtualTileKind(kind) ? `${kind}.C3A0E000-0000-4000-8000-0000000000B7` : `${kind}.thing`));
    for (const entityId of ids) {
      const watch = text(renderTileSettings(tileHost([tile(entityId)])));
      expect(watch, entityId).toContain("iPhone extras");
      expect(watch, entityId).toContain("The watch ignores these");
      const phone = text(renderTileSettings(tileHost([tile(entityId)], "iphone")));
      expect(phone, entityId).not.toContain("iPhone extras");
      expect(phone.match(/[^.>]*\b(the watch|watch's)\b[^.<]*/gi) ?? [], entityId).toEqual([]);
    }
  });
});

describe("the kinds only the iPhone draws", () => {
  it("say the contract's words in the Add tile dialog and on a watch's stage", () => {
    expect(WATCH_PHONE_GROUP_TITLE).toBe("iPhone only");
    expect(WATCH_PHONE_GREYED_TEXT).toBe("Shown on the iPhone only");
    expect(WATCH_PHONE_TILE_STAGE_TEXT).toBe("Not on a watch");
    // "iPhone only" without a hyphen, as everywhere else, and a full stop.
    expect(watchPhoneTilesBlockedText({ name: "Den Watch", version: "3.1.0" })).toBe("Den Watch runs 3.1.0; iPhone only tiles need 3.2.0.");
  });

  it("never name the watch in their settings, on an iPhone's editor or a watch's", () => {
    for (const kind of ["map", "chart", "text_field", "web"]) {
      for (const device of ["iphone", undefined] as const) {
        const host = tileHost([tile(`${kind}.C3A0E000-0000-4000-8000-0000000000B7`, { color: "#RAINBOW" })], device);
        const drawn = text(renderTileHead(host, { lead: html``, actions: html``, remove: html``, find: html`` })) + text(renderTileSettings(host));
        expect(drawn, kind).toContain("The iPhone cycles the tile through every color.");
        expect(drawn.match(/[^.>]*\b(the watch|watch's)\b[^.<]*/gi) ?? [], `${kind} on ${device ?? "watch"}`).toEqual([]);
      }
    }
  });

  it("are counted on a watch's chip in the contract's words, and the tooltip names an iPhone", () => {
    expect(tickSkipsText(2)).toBe("skips 2");
    expect(tickSkipsTitle("Den Watch", ["Map", "Web card"])).toBe("Den Watch skips Map and Web card: only an iPhone shows them.");
    expect(PAGES_PHONE_TILES_TEXT).toBe("A few tiles, like a map or a web card, are for the iPhone only. A watch skips them, and its chip on the card says how many.");
    for (const line of [tickSkipsText(2), tickSkipsTitle("Den Watch", ["Map"]), PAGES_PHONE_TILES_TEXT]) expect(line).not.toMatch(/[–—]| - /);
  });
});

describe("the Add tile list on an iPhone", () => {
  it("names the iPhone for the kinds it has no tile for", () => {
    expect(watchLeftOutText(1, "iphone")).toBe("1 entity is left out: the iPhone has no tile for its kind.");
    expect(watchLeftOutText(3, "iphone")).toBe("3 entities are left out: the iPhone has no tile for their kind.");
    expect(watchAddEmptyText("", "", 0, [], 0, "iphone")).toBe("Home Assistant has no entity the iPhone has a tile for.");
    expect(watchAddEmptyText("", "", 0, [], 2, "iphone")).toBe("Every entity the iPhone has a tile for is on this page already.");
  });
});

describe("a smart page on an iPhone", () => {
  it("names the iPhone in the shared domain note and the header's default color", () => {
    const config = { rules: [{ id: "a", domain: "light" }, { id: "b", domain: "light" }] } as unknown as Parameters<typeof smartDuplicateDomainNote>[0];
    expect(smartDuplicateDomainNote(config, undefined, "iPhone"))
      .toBe("Two rules show lights. The iPhone draws all lights with the first rule's header and style.");
    expect(smartDuplicateDomainNote(config)).toBe("Two rules show lights. The watch draws all lights with the first rule's header and style.");
    expect(smartWord("colorDefault", { device: "iPhone" })).toBe("Default (white on the iPhone)");
    expect(smartWord("colorDefault")).toBe("Default (white on the watch)");
  });
});

describe("the page switcher rows on an iPhone", () => {
  it("name the iPhone", () => {
    const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [{ id: PAGE_ID, items: [], name: "Living", hideFromSwitcher: true }] }, 3);
    const h: SwitcherSettingsHost = {
      pageId: PAGE_ID,
      icons: NO_ICONS,
      symbols: new SymbolBrowser(() => undefined),
      device: "iphone",
      uiState: new Map(),
      get page() { return findWatchPage(draft.document, PAGE_ID)!; },
      busy: false,
      edit: (change) => draft.apply(change(draft.document)),
      endCoalesce: () => draft.endCoalesce(),
      requestUpdate: () => undefined,
    };
    const drawn = text(renderSwitcherSettings(h));
    expect(drawn).toContain("The page stays on the iPhone. Only the switcher leaves it out.");
    expect(drawn).toContain("Picked by the iPhone");
    expect(drawn).toContain("Left empty, the iPhone shows the page's name and picks the icon and color itself.");
    expect(drawn).not.toMatch(/the watch\b/i);
  });
});

describe("saves of an iPhone's pages", () => {
  it("name the iPhone", () => {
    expect(rejectedText({ rejected_reason: "" }, "iphone")).toBe("The iPhone could not read this save");
    expect(rejectedText({ rejected_reason: "too large" }, "iphone")).toBe("The iPhone could not use this save: too large");
    expect(rejectedText({ rejected_reason: "" })).toBe("The watch could not read this save");
    expect(watchPagesSaveNote({ ok: false, code: "no_record" } as Parameters<typeof watchPagesSaveNote>[0], "iphone")?.text)
      .toBe("Not saved. Home Assistant no longer holds pages for this iPhone.");
  });
});
