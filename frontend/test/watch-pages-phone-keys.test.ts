// The four tile keys only the iPhone reads (plan phase 2): a live camera, a
// chart under a sensor, a media player's artwork and controls, and a
// template's line limit. On an iPhone's editor each is a card in its natural
// place with the iPhone tag; on a watch's editor they sit in one folded
// "iPhone extras" card, last. The rules files name the keys the device table
// gives the iPhone alone.
//
// No DOM: each view is drawn to its Lit templates, read as text, and its
// controls are pressed by calling the handler the template holds for them
// with a stand-in event. The host is a real draft, so every press is an
// edit.
//
// Plan: app repo docs/phone_native_pages_plan_2026-10.md, phase 2; the names
// in docs/phone_native_contract.md.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import tileApp from "../src/watch-pages/tile-app.json";
import tileDevicesTable from "../src/watch-pages/tile-devices.json";
import tileSpecial from "../src/watch-pages/tile-special.json";
import tileStyling from "../src/watch-pages/tile-styling.json";
import pageKeys from "../src/watch-pages/page-keys.json";
import { SymbolBrowser } from "../src/symbols.js";
import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { NO_ICONS, type TileSettingsHost } from "../src/watch-pages/editor-host.js";
import { FOLD_STORE_KEY } from "../src/watch-pages/fold-memory.js";
import { type WatchPage, type WatchPageTile, type WatchPagesDocument, tileDevices } from "../src/watch-pages/model.js";
import {
  WATCH_PHONE_SETTING_KEYS,
  setWatchCameraTileLive,
  setWatchSensorChart,
  setWatchTemplateLines,
  watchCameraTileLive,
  watchPhoneKeyChanged,
  watchPhoneKeyKinds,
  watchPhoneKeysOf,
} from "../src/watch-pages/phone-keys-model.js";
import {
  WATCH_PHONE_EXTRAS_HINT,
  WATCH_PHONE_EXTRAS_TITLE,
  watchSensorChartMenu,
  watchTemplateLinesMenu,
  watchTileSectionsFor,
} from "../src/watch-pages/tile-settings-options.js";
import { renderTileSettings, tileInspectorSections, tileSettingsFoldIds } from "../src/watch-pages/tile-settings.js";

// The views ask for the focused field (`document.activeElement`); Node has
// no document.
(globalThis as { document?: unknown }).document ??= { activeElement: null };
(globalThis as { HTMLElement?: unknown }).HTMLElement ??= class {};
(globalThis as { HTMLInputElement?: unknown }).HTMLInputElement ??= class {};

const PAGE = "C3A0E000-0000-4000-8000-0000000000AA";
const TILE = "C3A0E000-0000-4000-8000-000000000001";
const TEMPLATE = "template.C3A0E000-0000-4000-8000-0000000000B2";
const GROUP = "multicam.C3A0E000-0000-4000-8000-0000000000B3";

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

const check = (root: unknown, marker: string, on: boolean) => handler(root, marker, "@change=")({ target: { checked: on } });
const pick = (root: unknown, marker: string, value: string) => handler(root, marker, "@change=")({ target: { value } });
/** A card's head pressed, as a click on its title row. */
const fold = (root: unknown, title: string) => handler(root, `<h4>${title}`, "@click=")();

// ── a host on a real draft ───────────────────────────────────────────────

function tileHost(entityId: string, extra: Record<string, unknown>, device?: "watch" | "iphone", states: Record<string, unknown> = {}) {
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [{ id: PAGE, name: "Living", items: [{ id: TILE, entityId, ...extra }] }] }, 1);
  const pageNow = () => (draft.document.pages as WatchPage[])[0]!;
  const host = {
    hass: { states },
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
    tileId: TILE,
    get tile() { return ((pageNow().items as WatchPageTile[] | undefined) ?? []).find((t) => t.id === TILE) ?? ({} as WatchPageTile); },
  } as unknown as TileSettingsHost;
  return { host, tile: () => host.tile };
}

/** The inspector as the page editor draws it, without the Size rows. */
const draw = (host: TileSettingsHost) => renderTileSettings(host, { sections: tileInspectorSections(host) });

/** The card titles in the order they are drawn. */
const titles = (root: unknown) => [...flatten(root).matchAll(/<h4>([^<]*)/g)].map((m) => m[1]!.trim());

// ── the tables ───────────────────────────────────────────────────────────

describe("the rules files and the device table", () => {
  const phoneKeys = Object.entries((tileDevicesTable as { keys: Record<string, string[]> }).keys)
    .filter(([, d]) => d.length === 1 && d[0] === "iphone")
    .map(([k]) => k);

  it("name exactly the keys the device table gives the iPhone alone, each a page-keys.json tile key", () => {
    const declared = [
      tileSpecial.camera.live.key,
      tileStyling.phone.sensorChart.key,
      tileStyling.phone.mediaArtwork.key,
      tileApp.template.lines.key,
    ];
    expect([...declared].sort()).toEqual([...phoneKeys].sort());
    expect([...WATCH_PHONE_SETTING_KEYS].sort()).toEqual([...phoneKeys].sort());
    const tileKeys = (pageKeys as unknown as { types: { tile: { keys: Record<string, unknown> } } }).types.tile.keys;
    for (const key of WATCH_PHONE_SETTING_KEYS) expect(Object.hasOwn(tileKeys, key), key).toBe(true);
  });

  it("offer each key on kinds both devices draw, as the contract lists them", () => {
    expect(watchPhoneKeyKinds("cameraTileLive")).toEqual(["camera", "multicam"]);
    expect(watchPhoneKeyKinds("sensorChart")).toEqual(["sensor", "binary_sensor"]);
    expect(watchPhoneKeyKinds("mediaArtwork")).toEqual(["media_player"]);
    expect(watchPhoneKeyKinds("templateLines")).toEqual(["template"]);
    for (const key of WATCH_PHONE_SETTING_KEYS) {
      for (const kind of watchPhoneKeyKinds(key)) expect(tileDevices(kind), `${key} on ${kind}`).toEqual(["watch", "iphone"]);
    }
  });

  it("give a tile its kind's key and no other", () => {
    expect(watchPhoneKeysOf({ entityId: "camera.door" })).toEqual(["cameraTileLive"]);
    expect(watchPhoneKeysOf({ entityId: GROUP })).toEqual(["cameraTileLive"]);
    expect(watchPhoneKeysOf({ entityId: "binary_sensor.door" })).toEqual(["sensorChart"]);
    expect(watchPhoneKeysOf({ entityId: "media_player.kitchen" })).toEqual(["mediaArtwork"]);
    expect(watchPhoneKeysOf({ entityId: TEMPLATE })).toEqual(["templateLines"]);
    expect(watchPhoneKeysOf({ entityId: "light.desk" })).toEqual([]);
    // A TV drawn as a remote is no media tile on either device.
    expect(watchPhoneKeysOf({ entityId: "media_player.lounge_tv" }, { "media_player.lounge_tv": { state: "on", attributes: { device_class: "tv" } } })).toEqual([]);
  });

  it("refuse a value the iPhone could not read, and a kind that has no such key", () => {
    const doc: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: PAGE, name: "Living", items: [
      { id: TILE, entityId: "light.desk" },
      { id: "T2", entityId: "sensor.power" },
      { id: "T3", entityId: TEMPLATE },
    ] }] };
    expect(setWatchCameraTileLive(doc, PAGE, TILE, true)).toBe(doc);
    expect(setWatchSensorChart(doc, PAGE, "T2", "30d")).toBe(doc);
    expect(setWatchTemplateLines(doc, PAGE, "T3", 9)).toBe(doc);
    expect(setWatchTemplateLines(doc, PAGE, "T3", 2.5)).toBe(doc);
  });
});

// ── where the sections sit ───────────────────────────────────────────────

describe("the sections on each device", () => {
  it("put the key in its natural place on an iPhone and in the folded group last on a watch", () => {
    const camera = { entityId: "camera.door" };
    expect(watchTileSectionsFor(camera, {}, "iphone")).toEqual(["special", "phone", "icon", "text", "border", "action", "visibility", "background"]);
    expect(watchTileSectionsFor(camera, {}, "watch")).toEqual(["special", "icon", "text", "border", "action", "visibility", "background", "phoneExtras"]);
    expect(watchTileSectionsFor({ entityId: "sensor.power" }, {}, "iphone")).toEqual(["icon", "state", "phone", "text", "border", "action", "visibility", "background"]);
    expect(watchTileSectionsFor({ entityId: "media_player.kitchen" }, {}, "iphone").slice(0, 3)).toEqual(["icon", "state", "phone"]);
    expect(watchTileSectionsFor({ entityId: TEMPLATE }, {}, "iphone").slice(0, 2)).toEqual(["special", "phone"]);
    // A tile with no phone key is as before on both devices.
    for (const device of ["watch", "iphone"] as const) {
      expect(watchTileSectionsFor({ entityId: "light.desk" }, {}, device)).toEqual(["icon", "state", "text", "border", "action", "visibility", "background"]);
    }
  });

  it("let Collapse all know the watch's group starts folded", () => {
    const { host } = tileHost("camera.door", {}, "watch");
    expect(tileSettingsFoldIds(host, tileInspectorSections(host)).at(-1)).toEqual({ module: "tile-settings", section: "phoneExtras", folded: true });
  });
});

// ── one test per section ─────────────────────────────────────────────────

/** On an iPhone: the card is drawn open with the iPhone tag, right after
 * `before`, and its control writes through `press`. On a watch: one folded
 * "iPhone extras" card, last, with the hint and none of the rows until it is
 * opened; opened, the same control writes the same key. */
function sectionChecks(opts: {
  entityId: string;
  extra?: Record<string, unknown>;
  title: string;
  label: string;
  help: string;
  before: string;
  press: (root: unknown, host: TileSettingsHost) => void;
  wrote: (tile: WatchPageTile) => void;
}) {
  const phone = tileHost(opts.entityId, opts.extra ?? {}, "iphone");
  const drawn = draw(phone.host);
  const text = flatten(drawn);
  const order = titles(drawn);
  expect(order[order.indexOf(opts.before) + 1]).toBe(`${opts.title}`);
  expect(text).toMatch(new RegExp(`<h4>${opts.title}<span class="ts-dev-tag"[^>]*>[^]*?iPhone</span>`));
  expect(text).toContain(opts.label);
  expect(text).toContain(opts.help);
  expect(text).not.toContain(WATCH_PHONE_EXTRAS_TITLE);
  opts.press(drawn, phone.host);
  opts.wrote(phone.tile());

  const watch = tileHost(opts.entityId, opts.extra ?? {}, "watch");
  const folded = draw(watch.host);
  expect(titles(folded).at(-1)).toBe(WATCH_PHONE_EXTRAS_TITLE);
  expect(titles(folded)).not.toContain(opts.title);
  expect(flatten(folded)).toContain(WATCH_PHONE_EXTRAS_HINT);
  expect(flatten(folded)).not.toContain(opts.help);
  fold(folded, WATCH_PHONE_EXTRAS_TITLE);
  const open = draw(watch.host);
  const openText = flatten(open);
  expect(openText).toContain(`<p class="hint">${WATCH_PHONE_EXTRAS_HINT}</p>`);
  expect(openText).toMatch(new RegExp(`<span>${opts.title}</span><span class="ts-dev-tag"`));
  expect(openText).toContain(opts.label);
  expect(openText).toContain(opts.help);
  opts.press(open, watch.host);
  opts.wrote(watch.tile());
}

describe("Live video", () => {
  it("is a switch on a camera that writes cameraTileLive false, and folds on a watch", () => {
    sectionChecks({
      entityId: "camera.door",
      title: "Live video",
      label: "Live video in the tile",
      help: "On by default. The tile streams at 2 frames a second while it is on screen. Up to 4 tiles stream at once; the rest show snapshots. Turn it off on tiles that should keep snapshots.",
      before: "Camera",
      press: (root) => check(root, "Live video in the tile", false),
      wrote: (t) => expect(t.cameraTileLive).toBe(false),
    });
  });

  it("is on for a tile without the key, and removes the key when switched on again, on a camera group too", () => {
    expect(watchCameraTileLive({ entityId: "camera.door" })).toBe(true);
    expect(watchCameraTileLive({ entityId: "camera.door", cameraTileLive: "yes" })).toBe(true);
    expect(watchCameraTileLive({ entityId: "camera.door", cameraTileLive: false })).toBe(false);
    expect(watchPhoneKeyChanged({ entityId: "camera.door", cameraTileLive: true }, "cameraTileLive")).toBe(false);
    expect(watchPhoneKeyChanged({ entityId: "camera.door", cameraTileLive: false }, "cameraTileLive")).toBe(true);
    const { host, tile } = tileHost(GROUP, { cameraTileLive: false }, "iphone");
    expect(titles(draw(host))).toContain("Live video");
    check(draw(host), "Live video in the tile", true);
    expect(Object.hasOwn(tile(), "cameraTileLive")).toBe(false);
  });
});

describe("Chart", () => {
  it("is a menu on a sensor that writes sensorChart, and folds on a watch", () => {
    sectionChecks({
      entityId: "sensor.power",
      extra: { rowSpan: 4 },
      title: "Chart",
      label: "Chart under the value",
      help: "Needs a tile at least 4 rows tall.",
      before: "State",
      press: (root) => pick(root, "Chart under the value", "6h"),
      wrote: (t) => expect(t.sensorChart).toBe("6h"),
    });
  });

  it("offers Off and the four ranges, Off removes the key, and a short tile says why it shows none", () => {
    expect(watchSensorChartMenu({ entityId: "sensor.power" }).options.map((o) => o.label)).toEqual(["Off", "1 hour", "6 hours", "24 hours", "7 days"]);
    const { host, tile } = tileHost("binary_sensor.door", { sensorChart: "24h", rowSpan: 2 }, "iphone");
    expect(flatten(draw(host))).toContain("This tile is 2 rows tall, so the iPhone shows no chart. Make it 4 or taller.");
    pick(draw(host), "Chart under the value", "");
    expect(Object.hasOwn(tile(), "sensorChart")).toBe(false);
    // A range the panel does not offer is shown, not offered.
    const stored = watchSensorChartMenu({ entityId: "sensor.power", sensorChart: "30d" });
    expect(stored.options[0]).toMatchObject({ label: "30d", disabled: true });
  });
});

describe("Artwork", () => {
  it("is a switch on a media player that writes mediaArtwork, and folds on a watch", () => {
    sectionChecks({
      entityId: "media_player.kitchen",
      title: "Artwork",
      label: "Artwork and controls",
      help: "Shows the album art, title and artist, with previous, play and next on tiles 6 columns and wider.",
      before: "State",
      press: (root) => check(root, "Artwork and controls", true),
      wrote: (t) => expect(t.mediaArtwork).toBe(true),
    });
  });
});

describe("Lines", () => {
  it("is a menu of 1 to 8 on a template tile that writes templateLines, and folds on a watch", () => {
    sectionChecks({
      entityId: TEMPLATE,
      extra: { templateString: "{{ 1 }}" },
      title: "Lines",
      label: "Lines",
      help: "The most lines the iPhone shows of the result.",
      before: "Template",
      press: (root) => pick(root, "(default)", "8"),
      wrote: (t) => expect(t.templateLines).toBe(8),
    });
  });

  it("marks 5 as the default and removes the key when it is picked", () => {
    expect(watchTemplateLinesMenu({ entityId: TEMPLATE }).options.map((o) => o.label)).toEqual(["1", "2", "3", "4", "5 (default)", "6", "7", "8"]);
    expect(watchTemplateLinesMenu({ entityId: TEMPLATE }).selected).toBe("5");
    const { host, tile } = tileHost(TEMPLATE, { templateString: "", templateLines: 3 }, "iphone");
    pick(draw(host), "(default)", "5");
    expect(Object.hasOwn(tile(), "templateLines")).toBe(false);
  });
});

// ── the fold is remembered ───────────────────────────────────────────────

describe("the iPhone extras fold", () => {
  let data: Record<string, string>;
  beforeEach(() => {
    data = {};
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => (Object.hasOwn(data, key) ? data[key]! : null),
      setItem: (key: string, value: string) => { data[key] = String(value); },
      removeItem: (key: string) => { delete data[key]; },
    });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stores only an opening, and drops it when folded again", () => {
    const { host } = tileHost("camera.door", {}, "watch");
    fold(draw(host), WATCH_PHONE_EXTRAS_TITLE);
    expect(JSON.parse(data[FOLD_STORE_KEY]!)).toEqual({ "tile-settings:phoneExtras": false });
    // A reload: open from the store.
    const again = tileHost("camera.door", {}, "watch").host;
    expect(flatten(draw(again))).toContain("Live video in the tile");
    fold(draw(again), WATCH_PHONE_EXTRAS_TITLE);
    expect(Object.hasOwn(data, FOLD_STORE_KEY)).toBe(false);
  });
});
