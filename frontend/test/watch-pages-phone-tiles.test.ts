// The four tile kinds only the iPhone draws (plan phase 3): a map, a chart,
// a text field and a web card. A new tile of each; the Add tile dialog's
// "iPhone only" group, greyed on a watch's editor, hidden on a page no
// iPhone picks, and refused while a picking watch runs an app too old to
// skip them; each kind's settings card with the iPhone tag; and the stage:
// a dashed outline with "Not on a watch" on a watch, with the other tiles
// packed as the watch packs them, and a simple face on an iPhone.
//
// No DOM: each view is drawn to its Lit templates, read as text, and its
// controls are pressed by calling the handler the template holds for them
// with a stand-in event. The hosts are real drafts, so every press is an
// edit.
//
// Plan: app repo docs/phone_native_pages_plan_2026-10.md, phases 3 and 4; the
// names in docs/phone_native_contract.md.

import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import pageKeys from "../src/watch-pages/page-keys.json";
import { DEFAULT_PHONE, phonePagesLayout } from "../src/phone-frame.js";
import { renderPageRowPicture } from "../src/library/row-picture.js";
import { SymbolBrowser } from "../src/symbols.js";
import { MIN_WATCH_VERSION_FOR_PHONE_TILES, watchSupportsPhoneTiles } from "../src/version.js";
import {
  WATCH_ADD_KIND_WORDS,
  WATCH_APP_ADD_BUTTONS,
  WATCH_PHONE_ADD_BUTTONS,
  WATCH_PHONE_GREYED_TEXT,
  WATCH_PHONE_GROUP_TITLE,
  watchAppAddBlockedText,
  watchPhoneTilesBlockedText,
  watchPhoneTilesGroup,
  watchPhoneTilesGroupOf,
} from "../src/watch-pages/add-tile-list.js";
import { detectNewCameraRatio, renderAddTile } from "../src/watch-pages/add-tile.js";
import { pageCrop } from "../src/watch-pages/all-pages.js";
import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { type AddTileHost, NO_ICONS, type TileSettingsHost } from "../src/watch-pages/editor-host.js";
import {
  type WatchPage,
  type WatchPageTile,
  type WatchPagesDocument,
  VIRTUAL_TILE_KINDS,
  tileClass,
  tileDevices,
  tileKind,
  tileKindLabel,
} from "../src/watch-pages/model.js";
import {
  WATCH_PHONE_TILES,
  WATCH_PHONE_TILE_KINDS,
  WATCH_PHONE_TILE_SETTING_KEYS,
  WATCH_WEB_CARD_HELP,
  addWatchChartEntity,
  addWatchMapEntity,
  removeWatchMapEntity,
  setWatchMapZoom,
  setWatchTextTargetId,
  setWatchTextTargetKind,
  setWatchWebScroll,
  setWatchWebURL,
  watchChartEntityIds,
  watchMapEntityIds,
  watchMapZoom,
  watchPhoneTileSummary,
  watchSkippedTileNames,
  watchTextTargetKind,
  watchWebScroll,
  watchWebURLLoads,
  watchWebURLNote,
} from "../src/watch-pages/phone-tiles-model.js";
import {
  WATCH_PHONE_TILE_STAGE_TEXT,
  renderWatchPagePreview,
  renderWatchTileFace,
  watchPreviewLayout,
  watchReflowPage,
  watchSkippedTilesLayout,
} from "../src/watch-pages/preview.js";
import { type WatchPhoneAddKind, addNewWatchTile, newWatchTile, watchAddEntityId, watchEntityAddFromHass } from "../src/watch-pages/tile-new.js";
import { watchTileSectionsFor } from "../src/watch-pages/tile-settings-options.js";
import { renderTileName, renderTileSettings, tileInspectorSections, tileWordsHost } from "../src/watch-pages/tile-settings.js";

// The views ask for the focused field (`document.activeElement`); Node has
// no document.
(globalThis as { document?: unknown }).document ??= { activeElement: null };
(globalThis as { HTMLElement?: unknown }).HTMLElement ??= class {};
(globalThis as { HTMLInputElement?: unknown }).HTMLInputElement ??= class {};

const PAGE = "C3A0E000-0000-4000-8000-0000000000AA";
const TILE = "C3A0E000-0000-4000-8000-000000000001";
const UUID = "C3A0E000-0000-4000-8000-0000000000B7";

// ── reading templates ────────────────────────────────────────────────────

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}

function isTpl(node: unknown): node is Tpl {
  return typeof node === "object" && node !== null && "strings" in node && "values" in node;
}

function flatten(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (isTpl(node)) return node.strings.map((s, i) => s + (i < node.values.length ? flatten(node.values[i]) : "")).join("");
  if (typeof node === "function" || typeof node === "object") return "";
  return String(node);
}

function templates(node: unknown, out: Tpl[] = []): Tpl[] {
  if (Array.isArray(node)) for (const n of node) templates(n, out);
  else if (isTpl(node)) {
    out.push(node);
    for (const v of node.values) templates(v, out);
  }
  return out;
}

/** The `event` handler of the smallest template whose text holds `marker`
 * and that binds the event itself. */
function handler(root: unknown, marker: string, event: string): (e?: unknown) => void {
  const found = templates(root)
    .map((t) => {
      let text = "";
      let fn: unknown;
      t.strings.forEach((s, i) => {
        text += s;
        if (i >= t.values.length) return;
        const v = t.values[i];
        if (typeof v === "function" && s.trimEnd().endsWith(event)) fn ??= v;
        text += flatten(v);
      });
      return { text, fn };
    })
    .filter((c) => c.text.includes(marker) && c.fn !== undefined)
    .sort((a, b) => a.text.length - b.text.length);
  if (found.length === 0) throw new Error(`no ${event} handler near ${marker}`);
  return found[0]!.fn as (e?: unknown) => void;
}

const pick = (root: unknown, marker: string, value: string) => handler(root, marker, "@change=")({ target: { value } });
const check = (root: unknown, marker: string, on: boolean) => handler(root, marker, "@change=")({ target: { checked: on } });

// ── hosts on a real draft ────────────────────────────────────────────────

function draftOf(items: WatchPageTile[]) {
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [{ id: PAGE, name: "Living", items }] }, 1);
  const pageNow = () => (draft.document.pages as WatchPage[])[0]!;
  return { draft, pageNow };
}

function baseHost(draft: WatchPagesDraft, pageNow: () => WatchPage, device: "watch" | "iphone" | undefined) {
  return {
    hass: { states: {} },
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    get document() { return draft.document; },
    device,
    pageId: PAGE,
    get page() { return pageNow(); },
    otherPages: [],
    catalog: undefined,
    cameraRefreshDefaults: { on: true, debounce: "5" },
    behavior: undefined,
    musicAssistant: undefined,
    cloudTTS: undefined,
    templateRenders: new Map(),
    deviceSiblings: () => ({ selects: [], switches: [], sensors: [], all: [] }),
    loadImageSize: async () => undefined,
    smartRuleId: undefined,
    selectSmartRule: () => undefined,
    busy: false,
    uiState: new Map<string, unknown>(),
    apply: (next: WatchPagesDocument) => draft.apply(next),
    endCoalesce: () => draft.endCoalesce(),
    selectTile: () => undefined,
    requestUpdate: () => undefined,
  };
}

function tileHost(entityId: string, extra: Record<string, unknown> = {}, device?: "watch" | "iphone") {
  const { draft, pageNow } = draftOf([{ id: TILE, entityId, ...extra }]);
  const host = Object.assign(Object.create(null), baseHost(draft, pageNow, device)) as Record<string, unknown>;
  Object.defineProperties(host, Object.getOwnPropertyDescriptors(baseHost(draft, pageNow, device)));
  Object.defineProperty(host, "tileId", { value: TILE });
  Object.defineProperty(host, "tile", { get: () => ((pageNow().items as WatchPageTile[] | undefined) ?? []).find((t) => t.id === TILE) ?? ({} as WatchPageTile) });
  return { host: host as unknown as TileSettingsHost, tile: () => (host as unknown as TileSettingsHost).tile };
}

function addHost(device: "watch" | "iphone" | undefined, phoneTiles?: ReturnType<typeof watchPhoneTilesGroup>) {
  const { draft, pageNow } = draftOf([]);
  const host = {} as Record<string, unknown>;
  Object.defineProperties(host, Object.getOwnPropertyDescriptors(baseHost(draft, pageNow, device)));
  Object.defineProperty(host, "tileId", { value: undefined });
  Object.defineProperty(host, "tile", { value: undefined });
  Object.defineProperty(host, "close", { value: () => undefined });
  if (phoneTiles !== undefined) Object.defineProperty(host, "phoneTiles", { value: phoneTiles });
  return { host: host as unknown as AddTileHost, tiles: () => (pageNow().items as WatchPageTile[] | undefined) ?? [] };
}

/** The inspector as the page editor draws it, without the Size rows. */
const draw = (host: TileSettingsHost) => renderTileSettings(host, { sections: tileInspectorSections(host) });

/** Every card starts open; a test that cleared the view state starts over
 * the same way. */
function openAll(_host: TileSettingsHost): void {}

const ADDS: readonly WatchPhoneAddKind[] = ["map", "chart", "textField", "web"];
const KIND_OF: Readonly<Record<WatchPhoneAddKind, string>> = { map: "map", chart: "chart", textField: "text_field", web: "web" };

// ── the kinds and the new tiles ──────────────────────────────────────────

describe("the kinds only the iPhone draws", () => {
  it("are the device table's iPhone only kinds, virtual kinds with their names", () => {
    expect(WATCH_PHONE_TILE_KINDS).toEqual(["map", "chart", "text_field", "web"]);
    for (const kind of WATCH_PHONE_TILE_KINDS) {
      expect(tileDevices(kind)).toEqual(["iphone"]);
      expect(Object.hasOwn(VIRTUAL_TILE_KINDS, kind)).toBe(true);
      expect(tileClass(`${kind}.${UUID}`)).toBe("virtual");
    }
    expect([tileKindLabel("map"), tileKindLabel("chart"), tileKindLabel("text_field"), tileKindLabel("web")]).toEqual(["Map", "Chart", "Text field", "Web card"]);
  });

  it("write only page-keys.json tile keys, none of them fresh", () => {
    const keys = (pageKeys as unknown as { types: { tile: { keys: Record<string, { fresh?: boolean }> } } }).types.tile.keys;
    for (const key of WATCH_PHONE_TILE_SETTING_KEYS) {
      expect(Object.hasOwn(keys, key), key).toBe(true);
      expect(keys[key]!.fresh, key).not.toBe(true);
    }
    expect(WATCH_PHONE_TILE_SETTING_KEYS).toHaveLength(14);
  });
});

describe("newWatchTile for the iPhone only kinds", () => {
  let n = 0;
  const newId = () => `c3a0e000-0000-4000-8000-${String(++n).padStart(12, "0")}`;

  it("makes each with an upper case id of its own, its fixed look and size, and no key of its own but a text field's target kind", () => {
    for (const add of ADDS) {
      n = 0;
      const tile = newWatchTile({ kind: add }, undefined, { newId });
      const rule = add === "textField" ? WATCH_PHONE_TILES.textField.add : WATCH_PHONE_TILES[add].add;
      // The entity id's UUID is made first, then the tile's own id.
      expect(tile.entityId).toBe(`${KIND_OF[add]}.C3A0E000-0000-4000-8000-000000000001`);
      expect(tile.id).toBe("C3A0E000-0000-4000-8000-000000000002");
      expect(tile.icon).toBe(rule.icon);
      expect(tile.color).toBe(rule.hex);
      expect(tile.customLabel).toBe(rule.customLabel);
      expect([tile.colSpan, tile.rowSpan]).toEqual([rule.colSpan, rule.rowSpan]);
      const own = WATCH_PHONE_TILE_SETTING_KEYS.filter((k) => Object.hasOwn(tile, k));
      expect(own).toEqual(add === "textField" ? ["textTargetKind"] : []);
      expect(watchAddEntityId({ kind: add })).toBe(`${KIND_OF[add]}.`);
    }
    expect(newWatchTile({ kind: "textField" }, undefined, { newId }).textTargetKind).toBe("input_text");
    expect(WATCH_PHONE_TILES.map.add.customLabel).toBe("Map");
    expect(WATCH_PHONE_TILES.web.add.customLabel).toBe("Web card");
  });

  it("adds any of them to a page as often as asked", () => {
    let doc: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: PAGE, name: "Living", items: [] }] };
    for (const add of [...ADDS, ...ADDS]) {
      const result = addNewWatchTile(doc, PAGE, { kind: add });
      expect(result.refusal).toBeUndefined();
      doc = result.document;
    }
    const items = (doc.pages as WatchPage[])[0]!.items as WatchPageTile[];
    expect(items.map((t) => tileKind(String(t.entityId)))).toEqual(["map", "chart", "text_field", "web", "map", "chart", "text_field", "web"]);
    expect(new Set(items.map((t) => t.entityId)).size).toBe(8);
  });
});

// ── the add dialog ───────────────────────────────────────────────────────

describe("the version gate", () => {
  it("is 3.2.0, and an unreported version reads as new enough", () => {
    expect(MIN_WATCH_VERSION_FOR_PHONE_TILES).toBe("3.2.0");
    expect(watchSupportsPhoneTiles("3.1.0")).toBe(false);
    expect(watchSupportsPhoneTiles("3.1.9 (4)")).toBe(false);
    expect(watchSupportsPhoneTiles("3.2.0")).toBe(true);
    expect(watchSupportsPhoneTiles("3.2.0-beta.1")).toBe(true);
    expect(watchSupportsPhoneTiles("4.0")).toBe(true);
    expect(watchSupportsPhoneTiles(null)).toBe(true);
    expect(watchSupportsPhoneTiles(undefined)).toBe(true);
  });

  it("names the watch and both versions", () => {
    expect(watchPhoneTilesBlockedText({ name: "Jesse's watch", version: "3.1.0" })).toBe("Jesse's watch runs 3.1.0; iPhone only tiles need 3.2.0.");
    expect(watchAppAddBlockedText("map", true, { name: "Jesse's watch", version: "3.1.0" })).toBe("Jesse's watch runs 3.1.0; iPhone only tiles need 3.2.0.");
    expect(watchAppAddBlockedText("web", true)).toBeUndefined();
    // The gate is the phone kinds' alone.
    expect(watchAppAddBlockedText("template", true, { name: "Jesse's watch", version: "3.1.0" })).toBeUndefined();
  });
});

describe("the iPhone only group's place", () => {
  const watch = (version: string | null, name = "Jesse's watch") => ({ kind: "watch" as const, name, version });
  const phone = { kind: "iphone" as const, name: "Jesse's iPhone", version: "3.1.0" };

  it("is hidden on a page no iPhone picks or previews", () => {
    expect(watchPhoneTilesGroup("watch", [watch("3.2.0")])).toEqual({ state: "hidden" });
    expect(watchPhoneTilesGroup("watch", [])).toEqual({ state: "hidden" });
  });

  it("is greyed on a watch's editor of a page an iPhone picks", () => {
    expect(watchPhoneTilesGroup("watch", [watch("3.2.0"), phone])).toEqual({ state: "greyed" });
    // An old watch makes no difference there: the group is off anyway.
    expect(watchPhoneTilesGroup("watch", [watch("3.1.0"), phone])).toEqual({ state: "greyed" });
  });

  it("is open on an iPhone's editor or preview, gated by the first old watch that picks the page", () => {
    expect(watchPhoneTilesGroup("iphone", [])).toEqual({ state: "open" });
    expect(watchPhoneTilesGroup("iphone", [phone, watch("3.2.1")])).toEqual({ state: "open" });
    expect(watchPhoneTilesGroup("iphone", [phone, watch(null)])).toEqual({ state: "open" });
    expect(watchPhoneTilesGroup("iphone", [phone, watch("3.2.0", "Kid's watch"), watch("3.1.0"), watch("3.0.0", "Old one")]))
      .toEqual({ state: "open", oldWatch: { name: "Jesse's watch", version: "3.1.0" } });
    // An old iPhone is never gated: it draws a grey placeholder, which is accepted.
    expect(watchPhoneTilesGroup("iphone", [{ ...phone, version: "2.9.0" }])).toEqual({ state: "open" });
  });

  it("falls back to the device alone when the editor worked nothing out", () => {
    expect(watchPhoneTilesGroupOf(undefined, "iphone")).toEqual({ state: "open" });
    expect(watchPhoneTilesGroupOf(undefined, "watch")).toEqual({ state: "hidden" });
    expect(watchPhoneTilesGroupOf({ state: "greyed" }, "watch")).toEqual({ state: "greyed" });
  });
});

describe("the add dialog's iPhone only group", () => {
  it("lists the four kinds under the phone glyph, last, on an iPhone's editor, each with its icon and line, and each adds its tile", () => {
    const { host, tiles } = addHost("iphone");
    const body = renderAddTile(host);
    const text = flatten(body);
    expect(text).toContain(`<span>${WATCH_PHONE_GROUP_TITLE}</span>`);
    expect(text.lastIndexOf(WATCH_PHONE_GROUP_TITLE)).toBeGreaterThan(text.indexOf('id="at-search"'));
    for (const b of WATCH_PHONE_ADD_BUTTONS) {
      expect(text).toContain(`<span class="at-kind-name">${b.label}</span>`);
      expect(text).toContain(`<span class="at-kind-hint">${b.hint}</span>`);
    }
    expect(WATCH_PHONE_ADD_BUTTONS.map((b) => b.icon)).toEqual(["map.fill", "chart.xyaxis.line", "character.cursor.ibeam", "globe"]);
    for (const b of WATCH_PHONE_ADD_BUTTONS) expect(b.hint).not.toMatch(/[–—]| - /);
    expect(WATCH_PHONE_ADD_BUTTONS.map((b) => b.label)).toEqual(["Map", "Chart", "Text field", "Web card"]);
    expect(text).not.toContain(WATCH_PHONE_GREYED_TEXT);
    // The phone glyph's body, on the group's title; each row has its tile's icon.
    const glyph = 'x="6" y="2.5" width="12" height="19"';
    expect(text.split(glyph).length - 1).toBeGreaterThanOrEqual(1);
    for (const [i, b] of WATCH_PHONE_ADD_BUTTONS.entries()) {
      handler(renderAddTile(host), `<span class="at-kind-name">${b.label}</span>`, "@click=")();
      expect(tiles()).toHaveLength(i + 1);
      expect(tileKind(String(tiles()[i]!.entityId))).toBe(KIND_OF[b.key]);
    }
    expect(flatten(renderAddTile(host))).toContain("Added a Web card tile.");
  });

  it("greys the group on a watch's editor, says why, and adds nothing", () => {
    const { host, tiles } = addHost("watch", { state: "greyed" });
    const text = flatten(renderAddTile(host));
    expect(text).toContain(WATCH_PHONE_GROUP_TITLE);
    expect(text).toContain("at-phone greyed");
    expect(text).toContain(WATCH_PHONE_GREYED_TEXT);
    handler(renderAddTile(host), '<span class="at-kind-name">Map</span>', "@click=")();
    expect(tiles()).toHaveLength(0);
  });

  it("hides the group on a page no iPhone picks", () => {
    expect(flatten(renderAddTile(addHost("watch", { state: "hidden" }).host))).not.toContain(WATCH_PHONE_GROUP_TITLE);
    expect(flatten(renderAddTile(addHost(undefined).host))).not.toContain(WATCH_PHONE_GROUP_TITLE);
  });

  it("refuses the kinds while a watch that picks the page is too old, naming it", () => {
    const { host, tiles } = addHost("iphone", { state: "open", oldWatch: { name: "Jesse's watch", version: "3.1.0" } });
    const text = flatten(renderAddTile(host));
    expect(text).toContain("Jesse's watch runs 3.1.0; iPhone only tiles need 3.2.0.");
    // Drawn as greyed as on a watch's editor, so the buttons do not look live.
    expect(text).toContain("at-phone greyed");
    handler(renderAddTile(host), '<span class="at-kind-name">Chart</span>', "@click=")();
    expect(tiles()).toHaveLength(0);
    expect(flatten(renderAddTile(host))).toContain("role=alert");
  });
});

describe("the add dialog's order", () => {
  const name = (label: string) => `<span class="at-kind-name">${label}</span>`;

  it("puts the entity search first, then Other tiles in groups, each kind with its line", () => {
    const text = flatten(renderAddTile(addHost("iphone").host));
    const order = [
      'id="at-search"',
      "Other tiles",
      ">Layout<",
      name("Spacer"),
      name("Header"),
      ">Navigation<",
      name("Go to page"),
      name("Peek page"),
      ">App tiles<",
      ...WATCH_APP_ADD_BUTTONS.map((b) => name(b.label)),
      ">Library<",
      `<span>${WATCH_PHONE_GROUP_TITLE}</span>`,
    ];
    const at = order.map((marker) => text.indexOf(marker));
    for (const [i, marker] of order.entries()) expect(at[i], marker).toBeGreaterThanOrEqual(0);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
    expect(WATCH_APP_ADD_BUTTONS.map((b) => b.label)).toEqual(["Music", "Template", "Assist", "Speak", "Point control"]);
    // Every kind says what it does.
    for (const words of [WATCH_ADD_KIND_WORDS.spacer, WATCH_ADD_KIND_WORDS.header, WATCH_ADD_KIND_WORDS.pageLink, WATCH_ADD_KIND_WORDS.peekLink, ...WATCH_APP_ADD_BUTTONS]) {
      expect(text).toContain(`<span class="at-kind-hint">${words.hint}</span>`);
    }
    // The links open their list, so they say so; the others add at once.
    expect(text.split("aria-expanded=false").length - 1).toBe(2);
  });

  it("shows no count in the foot until the first add", () => {
    const { host, tiles } = addHost("iphone");
    const before = flatten(renderAddTile(host));
    expect(before).not.toContain("No tiles added yet");
    expect(before).toContain('<span class="at-count" role="status"></span>');
    handler(renderAddTile(host), WATCH_ADD_KIND_WORDS.spacer.hint, "@click=")();
    expect(tiles()).toHaveLength(1);
    expect(flatten(renderAddTile(host))).toContain('<span class="at-count" role="status">1 tile added.</span>');
  });

  it("keeps Music off with its reason when Music Assistant is missing", () => {
    const { host, tiles } = addHost("iphone");
    Object.defineProperty(host, "musicAssistant", { value: false });
    const text = flatten(renderAddTile(host));
    expect(text).toContain("The Music tile needs the Music Assistant integration in Home Assistant.");
    expect(text).toContain("aria-describedby=at-app-blocked");
    handler(renderAddTile(host), WATCH_APP_ADD_BUTTONS[0]!.hint, "@click=")();
    expect(tiles()).toHaveLength(0);
  });
});

// ── the settings ─────────────────────────────────────────────────────────

describe("the settings of the iPhone only kinds", () => {
  const ID = (kind: string) => `${kind}.${UUID}`;

  it("give each its own card first, titled by the kind and tagged iPhone, and no Action", () => {
    for (const [kind, title] of [["map", "Map"], ["chart", "Chart"], ["text_field", "Text field"], ["web", "Web card"]] as const) {
      for (const device of ["watch", "iphone"] as const) {
        const sections = watchTileSectionsFor({ entityId: ID(kind) }, undefined, device);
        expect(sections, `${kind} on ${device}`).toEqual(["phoneTile", "icon", "text", "border", "visibility", "background"]);
        const { host } = tileHost(ID(kind), {}, device);
        const text = flatten(draw(host));
        expect(text).toContain(`<h4>${title}<span class="ts-dev-tag"`);
        expect(text).toContain("iPhone</span>");
        expect(text).not.toContain("<h4>Action");
      }
    }
  });

  it("map: places from people, trackers and zones, the zoom and the style", () => {
    const { host, tile } = tileHost(ID("map"), {}, "iphone");
    openAll(host);
    let root = draw(host);
    expect(flatten(root)).toContain("Add to map");
    expect(flatten(root)).toContain("Fit shows every marker");
    pick(root, ">Zoom<", "street");
    expect(tile().mapZoom).toBe("street");
    root = draw(host);
    pick(root, ">Zoom<", "fit");
    expect(Object.hasOwn(tile(), "mapZoom")).toBe(false);
    pick(draw(host), ">Style<", "satellite");
    expect(tile().mapStyle).toBe("satellite");
    // The setters behind the list.
    const doc = host.document;
    const one = addWatchMapEntity(doc, PAGE, TILE, "person.jesse");
    expect(watchMapEntityIds(tileOf(one))).toEqual(["person.jesse"]);
    expect(addWatchMapEntity(one, PAGE, TILE, "person.jesse")).toBe(one);
    expect(addWatchMapEntity(one, PAGE, TILE, "light.desk")).toBe(one);
    const two = addWatchMapEntity(addWatchMapEntity(one, PAGE, TILE, "device_tracker.car"), PAGE, TILE, "zone.home");
    expect(watchMapEntityIds(tileOf(two))).toEqual(["person.jesse", "device_tracker.car", "zone.home"]);
    expect(watchPhoneTileSummary(tileOf(two))).toBe("3 places, Fit");
    const none = ["person.jesse", "device_tracker.car", "zone.home"].reduce((d, id) => removeWatchMapEntity(d, PAGE, TILE, id), two);
    expect(Object.hasOwn(tileOf(none), "mapEntityIds")).toBe(false);
    expect(setWatchMapZoom(doc, PAGE, TILE, "galaxy")).toBe(doc);
    expect(watchMapZoom({ entityId: ID("map"), mapZoom: "galaxy" })).toBe("galaxy");
  });

  it("chart: up to four entities, the range and the style", () => {
    const { host, tile } = tileHost(ID("chart"), { chartEntityIds: ["sensor.a", "sensor.b", "sensor.c", "sensor.d"] }, "iphone");
    openAll(host);
    const text = flatten(draw(host));
    expect(text).toContain("The chart holds 4. Remove one to add another.");
    expect(text).not.toContain("Add entity");
    expect(addWatchChartEntity(host.document, PAGE, TILE, "sensor.e")).toBe(host.document);
    pick(draw(host), ">Range<", "7d");
    expect(tile().chartRange).toBe("7d");
    pick(draw(host), ">Range<", "24h");
    expect(Object.hasOwn(tile(), "chartRange")).toBe(false);
    pick(draw(host), ">Style<", "bars");
    expect(tile().chartStyle).toBe("bars");
    handler(draw(host), "Remove A", "@click=")();
    expect(watchChartEntityIds(tile())).toEqual(["sensor.b", "sensor.c", "sensor.d"]);
    expect(flatten(draw(host))).toContain("Add entity");
  });

  it("text field: where the text goes, the target that fits it, the field, the placeholder and the submit", () => {
    const { host, tile } = tileHost(ID("text_field"), { textTargetKind: "input_text", customLabel: "Note" }, "iphone");
    openAll(host);
    let text = flatten(draw(host));
    expect(text).toContain(">Sends to<");
    expect(text).toContain("Input text");
    expect(text).toContain(">Placeholder<");
    expect(text).not.toContain("Field name");
    const withTarget = setWatchTextTargetId(host.document, PAGE, TILE, "input_text.note");
    expect(tileOf(withTarget).textTargetId).toBe("input_text.note");
    expect(setWatchTextTargetId(host.document, PAGE, TILE, "script.say")).toBe(host.document);
    host.apply(withTarget);
    pick(draw(host), ">Sends to<", "script");
    expect(tile().textTargetKind).toBe("script");
    // The input text is no script, so it goes.
    expect(Object.hasOwn(tile(), "textTargetId")).toBe(false);
    text = flatten(draw(host));
    expect(text).toContain("Field name");
    host.apply(setWatchTextTargetId(host.document, PAGE, TILE, "script.say"));
    pick(draw(host), ">Sends to<", "assist");
    expect(tile().textTargetKind).toBe("assist");
    expect(Object.hasOwn(tile(), "textTargetId")).toBe(false);
    // The absent value is written too, as the add writes it.
    host.apply(setWatchTextTargetKind(host.document, PAGE, TILE, "input_text"));
    expect(tile().textTargetKind).toBe("input_text");
    expect(watchTextTargetKind({ entityId: ID("text_field") })).toBe("input_text");
    pick(draw(host), ">Submit with<", "button");
    expect(tile().textSubmit).toBe("button");
    pick(draw(host), ">Submit with<", "return");
    expect(Object.hasOwn(tile(), "textSubmit")).toBe(false);
    handler(draw(host), ">Placeholder<", "@input=")({ target: { value: "Write a note" } });
    expect(tile().textPlaceholder).toBe("Write a note");
  });

  it("web card: the address with its note, Scroll, Interactive and the sign in line", () => {
    const { host, tile } = tileHost(ID("web"), {}, "iphone");
    openAll(host);
    expect(WATCH_WEB_CARD_HELP).toBe("An HA dashboard address works after you sign in once inside the card on the iPhone.");
    let text = flatten(draw(host));
    expect(text).toContain(WATCH_WEB_CARD_HELP);
    expect(text).toContain(">Address<");
    handler(draw(host), ">Address<", "@input=")({ target: { value: "  https://ha.local:8123/lovelace/0 " } });
    expect(tile().webURL).toBe("https://ha.local:8123/lovelace/0");
    expect(watchPhoneTileSummary(tile())).toBe("ha.local:8123");
    host.apply(setWatchWebURL(host.document, PAGE, TILE, "ftp://files"));
    host.uiState.clear();
    openAll(host);
    text = flatten(draw(host));
    expect(text).toContain("Only http and https addresses load.");
    expect(watchWebURLLoads("http://x.y")).toBe(true);
    expect(watchWebURLLoads("javascript:alert(1)")).toBe(false);
    expect(watchWebURLNote("")).toBeUndefined();
    check(draw(host), ">Scroll<", false);
    expect(tile().webScroll).toBe(false);
    check(draw(host), ">Scroll<", true);
    expect(Object.hasOwn(tile(), "webScroll")).toBe(false);
    check(draw(host), ">Interactive<", false);
    expect(tile().webInteractive).toBe(false);
    expect(watchWebScroll({ entityId: ID("web") })).toBe(true);
    expect(setWatchWebScroll(host.document, PAGE, TILE, "no" as unknown as boolean)).toBe(host.document);
  });

  it("refuse each other's keys and every other kind", () => {
    const doc: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: PAGE, name: "Living", items: [{ id: TILE, entityId: "light.desk" }] }] };
    expect(addWatchMapEntity(doc, PAGE, TILE, "person.jesse")).toBe(doc);
    expect(addWatchChartEntity(doc, PAGE, TILE, "sensor.a")).toBe(doc);
    expect(setWatchWebURL(doc, PAGE, TILE, "https://a.b")).toBe(doc);
    expect(setWatchTextTargetKind(doc, PAGE, TILE, "assist")).toBe(doc);
  });
});

function tileOf(doc: WatchPagesDocument): WatchPageTile {
  return ((doc.pages as WatchPage[])[0]!.items as WatchPageTile[]).find((t) => t.id === TILE)!;
}

describe("the settings of an iPhone only tile on a watch's editor", () => {
  it("name the iPhone, the one device that shows the tile, as an iPhone's editor does", () => {
    for (const kind of WATCH_PHONE_TILE_KINDS) {
      const { host } = tileHost(`${kind}.${UUID}`, { color: "#RAINBOW", hideWhenInactive: true }, "watch");
      const text = flatten(renderTileName(host)) + flatten(draw(host));
      expect(text.match(/[^.>]*\b(the watch|watch's)\b[^.<]*/gi) ?? [], kind).toEqual([]);
      for (const line of ["The iPhone picks the icon", "The iPhone cycles the tile through every color.", "The iPhone leaves the tile out while it is off."]) {
        expect(text, `${kind}: ${line}`).toContain(line);
      }
      // The host itself still names the watch: only the tile's lines move.
      expect(host.device).toBe("watch");
      expect(tileWordsHost(host).device).toBe("iphone");
    }
    // Any other tile keeps the watch's words.
    const { host } = tileHost("light.desk", { color: "#RAINBOW" }, "watch");
    expect(tileWordsHost(host)).toBe(host);
    expect(flatten(draw(host))).toContain("The watch cycles the tile through every color.");
  });
});

describe("the tiles a watch skips on a page", () => {
  it("are named in the page's order, by label else by kind, for the device strip's count", () => {
    const page: WatchPage = {
      id: PAGE,
      name: "Living",
      items: [
        { id: "a", entityId: "light.desk" },
        { id: "b", entityId: `map.${UUID}` },
        { id: "c", entityId: `web.${UUID}`, customLabel: "Garden cam" },
        { id: "d", entityId: "sensor.temp", sensorChart: "24h" },
        { id: "e", entityId: `chart.${UUID}`, isHidden: true },
      ],
    };
    // A phone-only key on a tile both draw is no skip: the watch draws the
    // tile and ignores the key.
    expect(watchSkippedTileNames(page)).toEqual(["Map", "Garden cam", "Chart"]);
    expect(watchSkippedTileNames({ id: PAGE, name: "Lights", items: [{ id: "a", entityId: "light.desk" }] })).toEqual([]);
    expect(watchSkippedTileNames(undefined)).toEqual([]);
  });
});

// ── the stage and the pictures ───────────────────────────────────────────

describe("a tile only the iPhone draws in the pictures", () => {
  const screen = { width: 208, height: 248 };
  const map = { id: "M", entityId: `map.${UUID}`, gridCol: 0, gridRow: 0, colSpan: 12, rowSpan: 4 };
  const light = { id: "L", entityId: "light.desk", gridCol: 0, gridRow: 4, colSpan: 6, rowSpan: 4 };
  const page: WatchPage = { id: PAGE, name: "Living", items: [map, light] };

  it("is a dashed outline with the phone glyph and Not on a watch on a watch", () => {
    expect(WATCH_PHONE_TILE_STAGE_TEXT).toBe("Not on a watch");
    const face = flatten(renderWatchTileFace(map, { width: 180, height: 60 }, { page, pages: [page], screen, scale: 1 }, 14));
    expect(face).toContain("wp-phone-out");
    expect(face).toContain('data-phone-only=map');
    expect(face).toContain("Not on a watch");
    expect(face).toContain('x="6" y="2.5" width="12" height="19"');
    // Too short for the words: the glyph alone.
    const short = flatten(renderWatchTileFace(map, { width: 180, height: 20 }, { page, pages: [page], screen, scale: 1 }, 14));
    expect(short).toContain("wp-phone-out");
    expect(short).not.toContain(">Not on a watch<");
  });

  it("leaves the watch's preview packed as the watch packs it, its outline at its stored place under the rest", () => {
    // The watch skips the map, so the light moves up to the top.
    const packed = watchReflowPage(page, undefined, 12, undefined, "watch");
    expect((packed.items as WatchPageTile[]).map((t) => [t.id, t.gridRow])).toEqual([["L", 0]]);
    const skipped = watchSkippedTilesLayout(page, screen, {});
    expect(skipped.map((t) => t.tile.id)).toEqual(["M"]);
    const full = watchPreviewLayout(page, screen);
    expect([skipped[0]!.x, skipped[0]!.y]).toEqual([full.tiles[0]!.x, full.tiles[0]!.y]);
    const drawn = flatten(renderWatchPagePreview({ page, pages: [page], screen, scale: 1 }));
    expect(drawn).toContain("Not on a watch");
    // Drawn first, so the light that moved into its place sits over it.
    expect(drawn.indexOf("wp-phone-out")).toBeLessThan(drawn.indexOf("light.desk"));
    expect(watchSkippedTilesLayout({ ...page, items: [light] }, screen, {})).toEqual([]);
    // A page of nothing but phone tiles is not empty.
    expect(flatten(renderWatchPagePreview({ page: { ...page, items: [map] }, pages: [], screen, scale: 1 }))).not.toContain("No tiles on this page.");
  });

  it("draws a simple face of each kind on an iPhone, and no outline", () => {
    const phone = phonePagesLayout(DEFAULT_PHONE, { look: "iphone" });
    const input = { page, pages: [page], screen, scale: 1, phone };
    const faces = {
      map: flatten(renderWatchTileFace({ ...map }, { width: 180, height: 120 }, input, 14)),
      chart: flatten(renderWatchTileFace({ ...map, entityId: `chart.${UUID}`, color: "#FF9500" }, { width: 180, height: 120 }, input, 14)),
      text: flatten(renderWatchTileFace({ ...map, entityId: `text_field.${UUID}`, textPlaceholder: "Say something", textSubmit: "button" }, { width: 180, height: 40 }, input, 14)),
      web: flatten(renderWatchTileFace({ ...map, entityId: `web.${UUID}`, webURL: "https://example.org/x" }, { width: 180, height: 120 }, input, 14)),
    };
    for (const face of Object.values(faces)) {
      expect(face).toContain("wp-phone-face");
      expect(face).not.toContain("Not on a watch");
    }
    expect(faces.map).toContain("#3E5A47");
    expect(faces.chart).toContain("<polyline");
    expect(faces.chart).toContain("#FF9500");
    expect(faces.text).toContain("Say something");
    expect(faces.text).toContain("wp-phone-send");
    expect(faces.web).toContain("example.org");
    expect(faces.web).toContain("<circle");
    // The text field washes the ink of what it sits on: white on this
    // theme's dark page, the screen's ink on the iPhone look's grouped
    // background, so it reads on the light skin too.
    expect(faces.text).toContain("color-mix(in srgb, #FFFFFF 12%, transparent)");
    const black = { ...page, backgroundColor: "#000000" };
    const field = { ...map, entityId: `text_field.${UUID}` };
    const grouped = flatten(renderWatchTileFace(field, { width: 180, height: 40 }, { ...input, page: black, pages: [black] }, 14));
    expect(grouped).toContain("color-mix(in srgb, var(--wa-phone-ink, #14161a) 12%, transparent)");
    expect(grouped).not.toContain("#FFFFFF");
    const watchLook = flatten(renderWatchTileFace(field, { width: 180, height: 40 }, { ...input, page: black, pages: [black], phone: phonePagesLayout(DEFAULT_PHONE, { look: "watch" }) }, 14));
    expect(watchLook).toContain("color-mix(in srgb, #FFFFFF 12%, transparent)");
    // The iPhone's preview keeps the tile in the page.
    const drawn = flatten(renderWatchPagePreview(input));
    expect(drawn).toContain('data-phone-face=map');
    expect(drawn).not.toContain("wp-phone-out");
  });

  it("draws no outline for a skipped tile the iPhone hides under the live states", () => {
    const showWhen = { comparisonOperator: "eq", entityId: "person.alex", state: "home" };
    const gated = { ...page, items: [{ ...map, showWhen }, light] };
    const away = { "person.alex": { entity_id: "person.alex", state: "not_home", attributes: {} } } as unknown as Record<string, HassEntityState>;
    const home = { "person.alex": { entity_id: "person.alex", state: "home", attributes: {} } } as unknown as Record<string, HassEntityState>;
    expect(watchSkippedTilesLayout(gated, screen, { states: away })).toEqual([]);
    expect(watchSkippedTilesLayout(gated, screen, { states: home }).map((t) => t.tile.id)).toEqual(["M"]);
    // Every tile is on in the all-on picture, and without states nothing is
    // left out.
    expect(watchSkippedTilesLayout(gated, screen, { states: away, stateMode: "all-on" }).map((t) => t.tile.id)).toEqual(["M"]);
    expect(watchSkippedTilesLayout(gated, screen, {}).map((t) => t.tile.id)).toEqual(["M"]);
    const drawn = flatten(renderWatchPagePreview({ page: gated, pages: [gated], screen, scale: 1, states: away }));
    expect(drawn).not.toContain("wp-phone-out");
  });

  it("keeps a skipped tile's outline inside the Pages list's card picture", () => {
    const low = { ...map, gridRow: 30 };
    const crop = pageCrop({ ...page, name: undefined, items: [light, low] }, undefined, undefined, screen);
    const outline = watchSkippedTilesLayout({ ...page, items: [light, low] }, screen, {})[0]!;
    expect(crop.top + crop.height).toBeGreaterThan(outline.y + outline.height);
  });

  it("draws the outline in a watch's row picture and the face in an iPhone's", () => {
    const rowPage = { ...page, id: "ROW" };
    expect(flatten(renderPageRowPicture({ page: rowPage }))).toContain("wp-phone-out");
    const iphone = flatten(renderPageRowPicture({ page: rowPage, iphone: true }));
    expect(iphone).toContain("wp-phone-face");
    expect(iphone).not.toContain("wp-phone-out");
  });
});

describe("adding a camera", () => {
  it("detects its ratio from the snapshot, as Detect camera ratio does", async () => {
    const { host, tiles } = addHost("iphone");
    const states = { "camera.porch": { entity_id: "camera.porch", state: "idle", attributes: { friendly_name: "Porch", entity_picture: "/api/camera_proxy/camera.porch?token=t" } } };
    Object.defineProperty(host, "hass", { value: { states } });
    const loaded: string[] = [];
    Object.defineProperty(host, "loadImageSize", { value: async (url: string) => { loaded.push(url); return { width: 2560, height: 720 }; } });
    // As a click on the row does: the tile added, then the detection.
    host.apply(addNewWatchTile(host.document, PAGE, { kind: "entity", ...watchEntityAddFromHass(host.hass, "camera.porch") }).document);
    detectNewCameraRatio(host, "camera.porch");
    await new Promise((r) => setTimeout(r, 0));
    expect(loaded).toEqual(["/api/camera_proxy/camera.porch?token=t"]);
    const [tile] = tiles();
    expect(tile?.entityId).toBe("camera.porch");
    expect(Number(tile?.cameraAspectRatio)).toBeCloseTo(3.56, 2);
  });
});
