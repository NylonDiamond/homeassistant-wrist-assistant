// The HTTP actions a watch can use (contract rule 12): the home's library
// that Home Assistant keeps first, then the iPhone catalog's actions the
// library does not hold, marked as on the iPhone. The read of the library,
// the join, its words, and the page editor's use of it: the Target menu,
// hold and slide, Show reply, and the Target card with its way to the HTTP
// actions screen.

import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  WATCH_NOT_IN_LIST_TEXT,
  WATCH_NOT_ON_IPHONE_TEXT,
  WATCH_NO_HTTP_ACTIONS_TEXT,
  WATCH_NO_PHONE_LIBRARY_TEXT,
  WATCH_NO_PHONE_STATUS_PAGES_TEXT,
  findWatchCatalogEntry,
  readWatchCatalog,
  watchCatalogKnows,
  watchCatalogListedFor,
  watchCatalogMark,
  watchCatalogWarning,
  watchCatalogWithStatusPages,
  watchHttpScreenOffered,
  watchLibraryMissingText,
  watchNoPhoneLibraryText,
} from "../src/watch-pages/catalog.js";
import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { NO_ICONS, type TileSettingsHost } from "../src/watch-pages/editor-host.js";
import {
  findHttpLibraryAction,
  httpActionRefId,
  readWatchHttpLibrary,
  watchCatalogWithHttpLibrary,
  watchHttpLibraryReadMeansNone,
} from "../src/watch-pages/http-library.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { renderTileSettings } from "../src/watch-pages/tile-settings.js";
import { watchHTTPReplyMenu, watchHTTPSlideChoice, watchHoldSlideMenus, watchLibraryTargetMenu } from "../src/watch-pages/tile-settings-options.js";

// The views ask for the focused field (`document.activeElement`); Node has
// no document.
(globalThis as { document?: unknown }).document ??= { activeElement: null };
(globalThis as { HTMLElement?: unknown }).HTMLElement ??= class {};

const CATALOG = readWatchCatalog(JSON.parse(readFileSync(join(__dirname, "fixtures-catalog", "catalog.json"), "utf8")), {
  revision: 3,
  updatedAt: "2026-10-02T09:30:00Z",
});
const [OPEN_GATE, OUTDOOR, UNNAMED, GARAGE] = CATALOG.httpActions;

const PORCH = "A1B2C3D4-0000-4000-8000-0000000000A1";
const BLANK = "A1B2C3D4-0000-4000-8000-0000000000A2";

/** The home's library as `http_actions/get` answers it: Open Gate handed
 * over from the phone (its id in lower case here), Porch Temp made in Home
 * Assistant with a reply value, and one with no name and no URL yet. */
const RECORD = {
  revision: 4,
  delivered: {},
  hash: "h",
  updated_at: null,
  updated_by: "panel",
  handed_over: [],
  document: {
    schemaVersion: 1,
    globalVariables: [],
    actions: [
      { id: OPEN_GATE!.id.toLowerCase(), name: " Open Gate ", method: "POST", url: "https://gate.local/open", icon: "car.fill", iconColor: "#A0C8FF", headers: [], variables: [] },
      { id: PORCH, name: "Porch Temp", method: "GET", url: "http://porch.local/t", responseConfig: { source: "jsonField", jsonPath: "temp" } },
      { id: BLANK, name: "  ", url: " " },
    ],
  },
};
const LIBRARY = readWatchHttpLibrary(RECORD)!;

const PAGE = "C3A0E000-0000-4000-8000-0000000000AA";
const T = "C3A0E000-0000-4000-8000-000000000001";

function httpTile(id: string, patch: Record<string, unknown> = {}): WatchPageTile {
  return { id: T, entityId: `http_action.${id.toUpperCase()}`, icon: "network", color: "#CCD8E6", httpResponseDisplay: "toast", ...patch } as WatchPageTile;
}

describe("the library as the pickers read it", () => {
  it("reads each action's id, trimmed name, look and flags, marked as the home's", () => {
    expect(LIBRARY.revision).toBe(4);
    expect(LIBRARY.actions).toEqual([
      { id: OPEN_GATE!.id.toLowerCase(), name: "Open Gate", icon: "car.fill", iconColor: "#A0C8FF", hasReply: false, needsSetup: false, source: "home" },
      { id: PORCH, name: "Porch Temp", hasReply: true, needsSetup: false, source: "home" },
      { id: BLANK, name: "HTTP Action", hasReply: false, needsSetup: true, source: "home" },
    ]);
  });

  it("never carries a URL, header or body", () => {
    expect(JSON.stringify(LIBRARY)).not.toMatch(/gate\.local|porch\.local|POST|headers|jsonPath/);
  });

  it("skips an id that is no UUID, a second id that differs only in case, and junk", () => {
    const read = readWatchHttpLibrary({
      revision: 2,
      document: {
        actions: [
          "x",
          null,
          { id: "garage", name: "No UUID", url: "http://a" },
          { name: "No id", url: "http://a" },
          { id: PORCH.toLowerCase(), name: "First", url: "http://a" },
          { id: PORCH, name: "Second", url: "http://b" },
          { id: BLANK, name: 7, url: 7, responseConfig: { source: "nonsense" }, icon: 1 },
        ],
      },
    })!;
    expect(read.actions.map((a) => a.name)).toEqual(["First", "HTTP Action"]);
    // An unknown reply source is no reply, as the phone's decoder drops it;
    // a URL that is no string needs setup.
    expect(read.actions[1]).toEqual({ id: BLANK, name: "HTTP Action", hasReply: false, needsSetup: true, source: "home" });
    expect(readWatchHttpLibrary({ revision: 1, document: "nope" })).toEqual({ revision: 1, actions: [] });
  });

  it("holds nothing at revision 0, and nothing at all without an answer", () => {
    expect(readWatchHttpLibrary({ revision: 0 })).toEqual({ revision: 0, actions: [] });
    expect(readWatchHttpLibrary({ revision: 0, document: RECORD.document })).toEqual({ revision: 0, actions: [] });
    expect(readWatchHttpLibrary(undefined)).toBeUndefined();
  });

  it("a failed read means none only for an integration that does not know the command", () => {
    expect(watchHttpLibraryReadMeansNone({ code: "unknown_command", message: "Unknown command." })).toBe(true);
    expect(watchHttpLibraryReadMeansNone({ code: "unauthorized" })).toBe(false);
    expect(watchHttpLibraryReadMeansNone(new Error("socket closed"))).toBe(false);
    expect(watchHttpLibraryReadMeansNone(undefined)).toBe(false);
  });
});

describe("the join", () => {
  it("both: the library first in its order, then the catalog's it does not hold, marked as on the iPhone", () => {
    const joined = watchCatalogWithHttpLibrary(CATALOG, LIBRARY)!;
    expect(joined.httpActions.map((a) => [a.name, a.source])).toEqual([
      ["Open Gate", "home"],
      ["Porch Temp", "home"],
      ["HTTP Action", "home"],
      ["Outdoor Temp", "iphone"],
      ["HTTP Action", "iphone"],
      ["Garage Door", "iphone"],
    ]);
    expect(joined.httpLibrary).toBe("held");
    // Open Gate is the library's, not the phone's copy, which is left out.
    expect(joined.httpActions[0]).toBe(LIBRARY.actions[0]);
    expect(joined.httpActions.filter((a) => a.id.toUpperCase() === OPEN_GATE!.id.toUpperCase())).toHaveLength(1);
    // The phone's flags come along.
    expect(joined.httpActions[3]).toEqual({ ...OUTDOOR, source: "iphone" });
    expect(joined.httpActions[5]).toEqual({ ...GARAGE, source: "iphone" });
    // Everything else is the catalog's, as it was.
    expect(joined.statusPages).toBe(CATALOG.statusPages);
    expect(joined.voice).toBe(CATALOG.voice);
    expect(joined.revision).toBe(3);
    expect(joined.noPhone).toBeUndefined();
    // The catalog read on its own is untouched.
    expect(CATALOG.httpActions[1]!.source).toBeUndefined();
  });

  it("compares ids without regard to case, and finds an entry by either case", () => {
    const upper = watchCatalogWithHttpLibrary(readWatchCatalog({ httpActions: [{ id: PORCH.toLowerCase(), name: "Porch on the phone" }] }), LIBRARY)!;
    expect(upper.httpActions.map((a) => a.name)).toEqual(["Open Gate", "Porch Temp", "HTTP Action"]);
    expect(findWatchCatalogEntry(upper, "httpAction", OPEN_GATE!.id.toUpperCase())?.source).toBe("home");
    expect(findWatchCatalogEntry(upper, "httpAction", PORCH.toLowerCase())?.name).toBe("Porch Temp");
  });

  it("library only: a catalog marked noPhone that knows the HTTP actions and nothing else", () => {
    const alone = watchCatalogWithHttpLibrary(undefined, LIBRARY)!;
    expect(alone.noPhone).toBe(true);
    expect(alone.httpLibrary).toBe("held");
    expect(alone.httpActions).toEqual(LIBRARY.actions);
    expect(watchCatalogKnows(alone, "httpAction")).toBe(true);
    expect(watchCatalogKnows(alone, "statusPage")).toBe(false);
    expect(watchNoPhoneLibraryText(alone)).toBe(WATCH_NO_PHONE_STATUS_PAGES_TEXT);
    expect(WATCH_NO_PHONE_STATUS_PAGES_TEXT).toBe("Open the iPhone app to list its status pages here.");
    // With the watch's own status pages too.
    const both = watchCatalogWithHttpLibrary(watchCatalogWithStatusPages(undefined, [{ id: PORCH, name: "House" }]), LIBRARY)!;
    expect(watchCatalogKnows(both, "statusPage")).toBe(true);
    expect(both.statusPagesFromWatch).toBe(true);
    // Both lists are known: nothing to open the iPhone app for.
    expect(watchNoPhoneLibraryText(both)).toBeUndefined();
  });

  it("catalog only, under a library that holds no action: the phone's, each marked as on the iPhone", () => {
    const empty = watchCatalogWithHttpLibrary(CATALOG, { revision: 7, actions: [] })!;
    expect(empty.httpActions.map((a) => [a.name, a.source])).toEqual([
      ["Open Gate", "iphone"], ["Outdoor Temp", "iphone"], ["HTTP Action", "iphone"], ["Garage Door", "iphone"],
    ]);
    expect(empty.httpLibrary).toBe("held");
    const none = watchCatalogWithHttpLibrary(undefined, { revision: 7, actions: [] })!;
    expect(none.httpActions).toEqual([]);
    expect(watchCatalogKnows(none, "httpAction")).toBe(true);
  });

  it("an older integration gives the catalog alone, exactly as before", () => {
    expect(watchCatalogWithHttpLibrary(CATALOG, undefined)).toBe(CATALOG);
    expect(watchCatalogWithHttpLibrary(undefined, undefined)).toBeUndefined();
    expect(watchHttpScreenOffered(CATALOG)).toBe(false);
  });

  it("revision 0 gives the catalog's lists as they are, only marked so the words can name the screen", () => {
    const zero = readWatchHttpLibrary({ revision: 0 });
    const marked = watchCatalogWithHttpLibrary(CATALOG, zero)!;
    expect(marked).not.toBe(CATALOG);
    expect({ ...marked, httpLibrary: undefined }).toEqual({ ...CATALOG, httpLibrary: undefined });
    expect(marked.httpActions).toBe(CATALOG.httpActions);
    expect(marked.httpLibrary).toBe("empty");
    expect(watchHttpScreenOffered(marked)).toBe(true);
    expect(watchCatalogWithHttpLibrary(undefined, zero)).toBeUndefined();
    // The words stay the iPhone's: the library is not behind the list.
    expect(watchLibraryMissingText(marked, "httpAction")).toBe(WATCH_NOT_ON_IPHONE_TEXT);
    expect(watchCatalogListedFor(marked, "httpAction", "en-US")).toMatch(/^Listed by the iPhone on /);
  });

  it("names a stored reference with or without the prefix", () => {
    expect(httpActionRefId(`http_action.${PORCH}`)).toBe(PORCH);
    expect(httpActionRefId(PORCH)).toBe(PORCH);
    expect(findHttpLibraryAction(LIBRARY.actions, `http_action.${PORCH.toLowerCase()}`)?.name).toBe("Porch Temp");
    expect(findHttpLibraryAction(LIBRARY.actions, OPEN_GATE!.id)?.name).toBe("Open Gate");
    expect(findHttpLibraryAction(LIBRARY.actions, "http_action.1")).toBeUndefined();
    expect(findHttpLibraryAction(LIBRARY.actions, "")).toBeUndefined();
    expect(findHttpLibraryAction(LIBRARY.actions, undefined)).toBeUndefined();
  });
});

describe("the words", () => {
  const joined = watchCatalogWithHttpLibrary(CATALOG, LIBRARY)!;
  const alone = watchCatalogWithHttpLibrary(undefined, LIBRARY)!;

  it("a library action needs setup in Home Assistant; an iPhone action keeps the iPhone's words", () => {
    expect(watchCatalogWarning("httpAction", joined.httpActions[2]!)).toBe("Needs setup");
    expect(watchCatalogWarning("httpAction", joined.httpActions[5]!)).toBe("Needs setup on the iPhone");
    expect(watchCatalogWarning("httpAction", GARAGE!)).toBe("Needs setup on the iPhone");
    expect(watchCatalogMark("httpAction", joined.httpActions[0]!)).toBeUndefined();
    expect(watchCatalogMark("httpAction", joined.httpActions[3]!)).toBe("On the iPhone");
    expect(watchCatalogMark("httpAction", joined.httpActions[5]!)).toBe("Needs setup on the iPhone");
    // The catalog read on its own marks nothing.
    expect(watchCatalogMark("httpAction", OUTDOOR!)).toBeUndefined();
  });

  it("a missing action is not in the list when the library is the only list, else not on the iPhone", () => {
    expect(watchLibraryMissingText(alone, "httpAction")).toBe(WATCH_NOT_IN_LIST_TEXT);
    expect(watchLibraryMissingText(joined, "httpAction")).toBe(WATCH_NOT_ON_IPHONE_TEXT);
    expect(watchLibraryMissingText(CATALOG, "httpAction")).toBe(WATCH_NOT_ON_IPHONE_TEXT);
    expect(watchLibraryMissingText(joined, "statusPage")).toBe(WATCH_NOT_ON_IPHONE_TEXT);
  });

  it("no iPhone date under a list that leads with the library", () => {
    expect(watchCatalogListedFor(joined, "httpAction")).toBeUndefined();
    expect(watchCatalogListedFor(joined, "statusPage", "en-US")).toMatch(/^Listed by the iPhone on /);
    expect(watchCatalogListedFor(CATALOG, "httpAction", "en-US")).toMatch(/^Listed by the iPhone on /);
  });

  it("the empty line points at the HTTP actions screen first", () => {
    expect(WATCH_NO_HTTP_ACTIONS_TEXT).toBe("No HTTP actions yet. Add one on the HTTP actions screen, or in the iPhone app.");
    expect(watchNoPhoneLibraryText(watchCatalogWithStatusPages(undefined, []))).toBe(WATCH_NO_PHONE_LIBRARY_TEXT);
    expect(WATCH_NO_PHONE_LIBRARY_TEXT).toBe("Open the iPhone app to list its HTTP actions here.");
  });
});

// ── the page editor ──────────────────────────────────────────────────────

describe("the page editor's menus over the joined list", () => {
  const joined = watchCatalogWithHttpLibrary(CATALOG, LIBRARY)!;
  const alone = watchCatalogWithHttpLibrary(undefined, LIBRARY)!;

  it("the Target menu lists the library first, then the phone's, each with its mark", () => {
    const menu = watchLibraryTargetMenu(httpTile(PORCH, { customLabel: "Porch" }), joined)!;
    expect(menu.options.map((o) => o.label)).toEqual([
      "Open Gate",
      "Porch Temp",
      "HTTP Action (Needs setup)",
      "Outdoor Temp (On the iPhone)",
      "HTTP Action (On the iPhone)",
      "Garage Door (Needs setup on the iPhone)",
    ]);
    expect(menu.selected).toBe(PORCH);
    expect(menu.current).toBe(findWatchCatalogEntry(joined, "httpAction", PORCH));
    // A tile stored in another case selects the library's entry.
    expect(watchLibraryTargetMenu(httpTile(OPEN_GATE!.id.toUpperCase()), joined)!.selected).toBe(OPEN_GATE!.id.toLowerCase());
  });

  it("a target the library alone does not hold is not in the list", () => {
    const gone = "C3A0E000-0000-4000-8000-0000000000FF";
    const menu = watchLibraryTargetMenu(httpTile(gone), alone)!;
    expect(menu.options[0]).toMatchObject({ label: `Action (${WATCH_NOT_IN_LIST_TEXT})`, disabled: true });
    expect(menu.note).toBe(`${WATCH_NOT_IN_LIST_TEXT}. The tile stays as it is until another is picked.`);
    const empty = watchCatalogWithHttpLibrary(undefined, { revision: 2, actions: [] })!;
    expect(watchLibraryTargetMenu(httpTile(gone), empty)!.note).toBe(`${WATCH_NOT_IN_LIST_TEXT}. ${WATCH_NO_HTTP_ACTIONS_TEXT}`);
    // An older integration: the iPhone's words, as before.
    expect(watchLibraryTargetMenu(httpTile(gone), readWatchCatalog({}))!.note).toBe(`${WATCH_NOT_ON_IPHONE_TEXT}, and the iPhone lists no other HTTP actions. The tile stays as it is.`);
    // Beside a phone catalog it is still the iPhone's words.
    expect(watchLibraryTargetMenu(httpTile(gone), joined)!.options[0]!.label).toBe(`Action (${WATCH_NOT_ON_IPHONE_TEXT})`);
  });

  it("hold and slide offer every action of the joined list, marked, and a pick reads the library's id", () => {
    const lamp = { id: T, entityId: "light.desk_lamp" } as WatchPageTile;
    const row = watchHoldSlideMenus(lamp, joined)!.rows[0]!;
    const http = row.options.filter((o) => o.group !== undefined);
    expect(http.map((o) => o.label)).toEqual([
      "Open Gate", "Porch Temp", "HTTP Action (needs setup)", "Outdoor Temp (on the iPhone)", "HTTP Action (on the iPhone)", "Garage Door (needs setup on the iPhone)",
    ]);
    expect(watchHTTPSlideChoice(http[1]!.value)).toBe(PORCH);
    // Only the library, and the slide's action is not in it.
    const stored = { ...lamp, holdSlideActions: ["up", "httpAction"], holdSlideHTTPActionTargets: ["up", "C3A0E000-0000-4000-8000-0000000000FF"] } as WatchPageTile;
    const missing = watchHoldSlideMenus(stored, alone)!.rows[0]!;
    expect(missing.options.find((o) => o.value === missing.selected)).toMatchObject({ label: "Run HTTP Action (not in the list)", disabled: true });
    expect(missing.note).toBe("This action is no longer in the list. Pick another, or the watch fails the slide.");
    // Beside the phone's catalog the words stay the iPhone's.
    expect(watchHoldSlideMenus(stored, joined)!.rows[0]!.note).toBe("The iPhone no longer lists this action. Pick another, or the watch fails the slide.");
  });

  it("Show reply offers Tile value from hasReply on either side, and names where to set a reply value", () => {
    const porch = findWatchCatalogEntry(joined, "httpAction", PORCH)!;
    const gate = findWatchCatalogEntry(joined, "httpAction", OPEN_GATE!.id)!;
    const outdoor = findWatchCatalogEntry(joined, "httpAction", OUTDOOR!.id)!;
    const unnamed = findWatchCatalogEntry(joined, "httpAction", UNNAMED!.id)!;
    expect(watchHTTPReplyMenu(httpTile(PORCH), porch, joined).options[2]!.disabled).toBeUndefined();
    expect(watchHTTPReplyMenu(httpTile(OUTDOOR!.id), outdoor, joined).options[2]!.disabled).toBeUndefined();
    const home = watchHTTPReplyMenu(httpTile(OPEN_GATE!.id), gate, joined);
    expect(home.options[2]!.disabled).toBe(true);
    expect(home.note).toBe("Tile value needs a Reply Value on this action, set on the HTTP actions screen.");
    expect(watchHTTPReplyMenu(httpTile(UNNAMED!.id), unnamed, joined).note).toBe("Tile value needs a Reply Value on this action, set in the iPhone app.");
    const dash = watchHTTPReplyMenu(httpTile(OPEN_GATE!.id, { httpResponseDisplay: "tileValue" }), gate, joined);
    expect(dash.note).toBe("This action has no Reply Value, so the tile shows a dash.");
    expect(watchHTTPReplyMenu(httpTile(PORCH), undefined, watchCatalogWithHttpLibrary(undefined, { revision: 2, actions: [] })).note)
      .toBe("This action is not in the list, so Tile value cannot be offered.");
    // An older integration: the iPhone's words, as before.
    expect(watchHTTPReplyMenu(httpTile(PORCH), undefined, CATALOG).note).toMatch(/^The iPhone has not listed this action here/);
    expect(watchHTTPReplyMenu(httpTile(PORCH), undefined).note).toMatch(/^The iPhone has not listed this action here/);
  });
});

/** A template flattened to its markup, values in place. */
function flat(v: unknown): string {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
}

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}

function templates(node: unknown, out: Tpl[] = []): Tpl[] {
  if (Array.isArray(node)) for (const n of node) templates(n, out);
  else if (node !== null && typeof node === "object" && "strings" in node && "values" in node) {
    out.push(node as Tpl);
    for (const v of (node as Tpl).values) templates(v, out);
  }
  return out;
}

/** The `event` handler of the smallest template holding `marker`. */
function handler(root: unknown, marker: string, event: "click" | "change"): (e: unknown) => void {
  const found = templates(root)
    .map((t) => ({ text: flat(t), fn: t.values.find((v, i) => typeof v === "function" && t.strings[i]!.trimEnd().endsWith(`@${event}=`)) }))
    .filter((c) => c.text.includes(marker) && c.fn !== undefined)
    .sort((a, b) => a.text.length - b.text.length);
  if (found.length === 0) throw new Error(`no @${event} handler near ${marker}`);
  return found[0]!.fn as (e: unknown) => void;
}

function settingsHost(tile: WatchPageTile, catalog: ReturnType<typeof watchCatalogWithHttpLibrary>) {
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [{ id: PAGE, name: "Living", items: [tile] }] } as WatchPagesDocument, 1);
  const pageNow = () => (draft.document.pages as WatchPage[])[0]!;
  const uiState = new Map<string, unknown>([["tile-settings:open:target", true], ["tile-settings:open:request", true]]);
  const host = {
    hass: { states: {} },
    icons: NO_ICONS,
    get document() { return draft.document; },
    pageId: PAGE,
    get page() { return pageNow(); },
    otherPages: [],
    catalog,
    busy: false,
    uiState,
    apply: (next: WatchPagesDocument, options?: Parameters<WatchPagesDraft["apply"]>[1]) => draft.apply(next, options),
    endCoalesce: () => draft.endCoalesce(),
    selectTile: () => undefined,
    requestUpdate: () => undefined,
    tileId: T,
    get tile() { return (pageNow().items as WatchPageTile[])[0]!; },
  } as unknown as TileSettingsHost;
  return { host, draft };
}

describe("the Target card of an HTTP action tile", () => {
  let pushed: string[] = [];
  const stubAt = (pathname: string) => {
    pushed = [];
    vi.stubGlobal("window", { location: { pathname }, dispatchEvent: () => true });
    vi.stubGlobal("history", { state: null, pushState: (_s: unknown, _t: string, url: string) => { pushed.push(url); } });
  };
  afterEach(() => { vi.unstubAllGlobals(); });

  it("a library action that needs setup says so and leads to the HTTP actions screen, keeping the draft", () => {
    const { host, draft } = settingsHost(httpTile(BLANK), watchCatalogWithHttpLibrary(CATALOG, LIBRARY));
    const view = renderTileSettings(host, { sections: ["target"] });
    const text = flat(view);
    expect(text).toContain(`<div class="hint warn ts-under">Needs setup.</div>`);
    expect(text).toContain("Open HTTP actions");
    // The library is no iPhone list: no date under it.
    expect(text).not.toContain("Listed by the iPhone");
    stubAt("/wrist-assistant/pages/w1");
    handler(view, "Open HTTP actions", "click")({});
    expect(pushed).toEqual(["/wrist-assistant/http-actions"]);
    // The move edits nothing: the draft is as it was, for the leave guards.
    expect(host.tile.entityId).toBe(`http_action.${BLANK}`);
    expect(draft.undoDepth).toBe(0);
  });

  it("an empty list points at the HTTP actions screen; an older integration keeps the iPhone's words", () => {
    const empty = settingsHost({ id: T, entityId: "http_action." } as WatchPageTile, watchCatalogWithHttpLibrary(readWatchCatalog({}), { revision: 3, actions: [] }));
    const text = flat(renderTileSettings(empty.host, { sections: ["target"] }));
    expect(text).toContain(`Not on the iPhone. ${WATCH_NO_HTTP_ACTIONS_TEXT}`);
    expect(text).toContain("Open HTTP actions");
    // Revision 0: the list is the iPhone's, and the screen can still add one.
    const zero = settingsHost({ id: T, entityId: "http_action." } as WatchPageTile, watchCatalogWithHttpLibrary(readWatchCatalog({}), { revision: 0, actions: [] }));
    const zeroText = flat(renderTileSettings(zero.host, { sections: ["target"] }));
    expect(zeroText).toContain(WATCH_NO_HTTP_ACTIONS_TEXT);
    expect(zeroText).toContain("Open HTTP actions");
    const old = settingsHost({ id: T, entityId: "http_action." } as WatchPageTile, readWatchCatalog({}));
    const before = flat(renderTileSettings(old.host, { sections: ["target"] }));
    expect(before).toContain("the iPhone lists no other HTTP actions");
    expect(before).not.toContain("Open HTTP actions");
  });

  it("an iPhone action in the joined list keeps the iPhone's words and no link", () => {
    const { host } = settingsHost(httpTile(GARAGE!.id), watchCatalogWithHttpLibrary(CATALOG, LIBRARY));
    const text = flat(renderTileSettings(host, { sections: ["target"] }));
    expect(text).toContain(`<div class="hint warn ts-under">Needs setup on the iPhone.</div>`);
    expect(text).not.toContain("Open HTTP actions");
  });

  it("a pick of a library action retargets the tile to its id in upper case, with its name", () => {
    const { host, draft } = settingsHost(httpTile(OPEN_GATE!.id, { customLabel: "Open Gate" }), watchCatalogWithHttpLibrary(CATALOG, LIBRARY));
    handler(renderTileSettings(host, { sections: ["target"] }), "Porch Temp", "change")({ target: { value: PORCH } });
    expect(host.tile.entityId).toBe(`http_action.${PORCH}`);
    expect(host.tile.customLabel).toBe("Porch Temp");
    expect(draft.undoDepth).toBe(1);
  });

  it("the Request card offers Tile value for a library action with a reply value", () => {
    const { host } = settingsHost(httpTile(PORCH), watchCatalogWithHttpLibrary(CATALOG, LIBRARY));
    const text = flat(renderTileSettings(host, { sections: ["request"] }));
    expect(text).toMatch(/<option value=tileValue\s+\?disabled=false/);
  });
});

describe("the page editor reads the library", () => {
  const source = readFileSync(join(__dirname, "..", "src", "watch-pages", "page-editor.ts"), "utf8");

  it("on opening a watch, which a return to the editor does too, and on a reconnect", () => {
    expect(source.match(/void this\.loadHttpLibrary\(\);/g)).toHaveLength(2);
    expect(source).toContain("fetchHttpActions(hass)");
    expect(source).toContain("watchCatalogWithHttpLibrary(");
    // A return to the editor opens its watch again.
    expect(source).toMatch(/connectedCallback\(\): void \{[\s\S]*?this\.openWatch\(this\.watchId, true\)/);
  });
});
