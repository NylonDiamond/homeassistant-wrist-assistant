// A tile's Arrangement (`arrange`): reading and writing the key, the
// placement math, the One Look drawing that applies it, the version note,
// and the Arrangement card. The shared fixtures have their own test
// (`arrange-fixtures.test.ts`). Plan: app repo
// docs/page_editor_calm_plan_2026-10.md, "The Arrangement key", steps 5 and 6.

import { nothing, svg } from "lit";
import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import { phonePagesLayout, phonePagesScreen } from "../src/phone-frame.js";
import { SymbolBrowser } from "../src/symbols.js";
import { MIN_VERSION_FOR_ARRANGEMENT, arrangementFor, arrangementUpdateNote } from "../src/version.js";
import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { NO_ICONS, type TileSettingsHost } from "../src/watch-pages/editor-host.js";
import { type WatchPage, type WatchPageTile, type WatchPagesDocument, watchPageTiles } from "../src/watch-pages/model.js";
import { type WatchPagePreviewInput, renderWatchTileFace, watchTileOneLookModel } from "../src/watch-pages/preview.js";
import {
  arrangeNameAlign,
  arrangePartRect,
  encodeTileArrange,
  normalizeTileArrange,
  withArrangePart,
} from "../src/watch-pages/one-look/arrange.js";
import {
  arrangeFrame,
  arrangeFreeBlock,
  arrangeFreeOn,
  arrangeOffered,
  arrangeOffset,
  arrangePickedPart,
  arrangeResizeNote,
  arrangeStageParts,
  movedArrangePart,
  nudgedArrangePart,
  setArrangePickedPart,
} from "../src/watch-pages/arrange-model.js";
import { setWatchTileArrange, setWatchTileIconSize } from "../src/watch-pages/tile-settings-model.js";
import { renderArrangeSection } from "../src/watch-pages/arrange-card.js";
import {
  tileArrangeShown,
  tileInspectorParts,
  tileInspectorSections,
  watchTileInspectorPartChanged,
  watchTileInspectorPartReset,
} from "../src/watch-pages/tile-settings.js";

(globalThis as { document?: unknown }).document ??= { activeElement: null };
(globalThis as { HTMLElement?: unknown }).HTMLElement ??= class {};
(globalThis as { HTMLInputElement?: unknown }).HTMLInputElement ??= class {};

// ── the key ──────────────────────────────────────────────────────────────

describe("reading and writing the key", () => {
  it("reads Default for anything that is not an arrangement", () => {
    for (const raw of [undefined, null, 3, "tr", [], {}, { v: 1 }, { v: 1, parts: [] }, { v: 1, parts: {} }, { v: 2, parts: { icon: { spot: "tr" } } }]) {
      expect(normalizeTileArrange(raw), JSON.stringify(raw)).toBeUndefined();
    }
  });

  it("clamps numbers, drops junk and defaults, and keeps an unversioned key", () => {
    expect(normalizeTileArrange({ parts: { icon: { spot: "tr", dx: 0.9, dy: -2, scale: 3, hidden: true, glow: 1 }, wings: { spot: "tl" } } }))
      .toEqual({ v: 1, parts: { icon: { spot: "tr", dx: 0.5, dy: -0.5, scale: 1.5, hidden: true } } });
    expect(normalizeTileArrange({ v: 1, parts: { icon: { scale: 0.2 }, name: { spot: "middle", dx: "1", hidden: "yes" } } }))
      .toEqual({ v: 1, parts: { icon: { scale: 0.8 } } });
    // A part at every default is no change, and goes.
    expect(normalizeTileArrange({ v: 1, parts: { icon: { dx: 0, dy: 0, scale: 1, hidden: false }, state: { hidden: true } } }))
      .toEqual({ v: 1, parts: { state: { hidden: true } } });
    expect(normalizeTileArrange({ v: 1, parts: { name: { dx: 0.1 + 0.2 } } })?.parts.name?.dx).toBe(0.3);
  });

  it("writes the parts and their keys in a fixed order, and nothing for Default", () => {
    const out = encodeTileArrange({ v: 1, parts: { state: { hidden: true }, icon: { hidden: true, scale: 1.2, spot: "tr" } } });
    expect(JSON.stringify(out)).toBe('{"v":1,"parts":{"icon":{"spot":"tr","scale":1.2,"hidden":true},"state":{"hidden":true}}}');
    expect(encodeTileArrange(undefined)).toBeUndefined();
  });

  it("changes one part, dropping it and then the key when it goes back", () => {
    const a = withArrangePart(undefined, "icon", (e) => ({ ...e, spot: "tl" }));
    expect(a).toEqual({ v: 1, parts: { icon: { spot: "tl" } } });
    const b = withArrangePart(a, "name", (e) => ({ ...e, scale: 1.2 }));
    expect(b).toEqual({ v: 1, parts: { icon: { spot: "tl" }, name: { scale: 1.2 } } });
    const c = withArrangePart(b, "icon", ({ spot: _, ...rest }) => rest);
    expect(c).toEqual({ v: 1, parts: { name: { scale: 1.2 } } });
    expect(withArrangePart(c, "name", (e) => ({ ...e, scale: 1 }))).toBeUndefined();
  });

  it("sets the tile key sparsely, removes it for Default, and changes nothing when it is already so", () => {
    const doc = { schemaVersion: 1, pages: [{ id: "P", name: "P", items: [{ id: "T", entityId: "light.a" }] }] } as unknown as WatchPagesDocument;
    const set = setWatchTileArrange(doc, "P", "T", { v: 1, parts: { icon: { spot: "br", dx: 0 } } });
    const tileOf = (d: WatchPagesDocument) => ((d.pages as WatchPage[])[0]!.items as WatchPageTile[])[0]!;
    expect(tileOf(set).arrange).toEqual({ v: 1, parts: { icon: { spot: "br" } } });
    expect(setWatchTileArrange(set, "P", "T", { v: 1, parts: { icon: { spot: "br" } } })).toBe(set);
    const gone = setWatchTileArrange(set, "P", "T", undefined);
    expect(Object.hasOwn(tileOf(gone), "arrange")).toBe(false);
    expect(setWatchTileArrange(gone, "P", "T", undefined)).toBe(gone);
  });
});

// ── the math ─────────────────────────────────────────────────────────────

describe("the placement math", () => {
  const T = { width: 100, height: 80 };
  const C = { x: 6, y: 6, width: 88, height: 68 };
  const R = { x: 30, y: 20, width: 40, height: 40 };

  it("anchors each spot to the content box", () => {
    expect(arrangePartRect(T, C, R, "icon", { spot: "tl" }).rect).toEqual({ x: 6, y: 6, width: 40, height: 40 });
    expect(arrangePartRect(T, C, R, "icon", { spot: "mc" }).rect).toEqual({ x: 30, y: 20, width: 40, height: 40 });
    expect(arrangePartRect(T, C, R, "icon", { spot: "br" }).rect).toEqual({ x: 54, y: 34, width: 40, height: 40 });
    expect(arrangePartRect(T, C, R, "icon", { spot: "tc" }).rect).toEqual({ x: 30, y: 6, width: 40, height: 40 });
    expect(arrangePartRect(T, C, R, "icon", { spot: "ml" }).rect).toEqual({ x: 6, y: 20, width: 40, height: 40 });
  });

  it("scales about the native centre, the name only in height, then moves by shares of the tile", () => {
    expect(arrangePartRect(T, C, R, "icon", { scale: 1.5 }).rect).toEqual({ x: 20, y: 10, width: 60, height: 60 });
    expect(arrangePartRect(T, C, R, "name", { scale: 1.5 }).rect).toEqual({ x: 30, y: 10, width: 40, height: 60 });
    expect(arrangePartRect(T, C, R, "icon", { dx: 0.1, dy: -0.25 }).rect).toEqual({ x: 40, y: 0, width: 40, height: 40 });
    expect(arrangePartRect(T, C, R, "state", { spot: "br", scale: 0.8, dx: -0.05 }).rect).toEqual({ x: 57, y: 42, width: 32, height: 32 });
  });

  it("keeps an unlisted part native, and reports hidden and the name's alignment", () => {
    expect(arrangePartRect(T, C, R, "state", undefined)).toEqual({ rect: R, scale: 1, hidden: false });
    expect(arrangePartRect(T, C, R, "state", { hidden: true }).hidden).toBe(true);
    expect(arrangeNameAlign({ spot: "bl" }, "center")).toBe("leading");
    expect(arrangeNameAlign({ spot: "tc" }, "center")).toBe("center");
    expect(arrangeNameAlign({ spot: "mr" }, "center")).toBe("trailing");
    expect(arrangeNameAlign({ dx: 0.2 }, "center")).toBe("center");
  });
});

// ── the drawing ──────────────────────────────────────────────────────────

/** A template's text with its values, as lit would write it. */
function text(t: unknown): string {
  if (typeof t === "symbol" || t === null || t === undefined) return "";
  if (Array.isArray(t)) return t.map(text).join("");
  if (typeof t !== "object") return String(t);
  const r = t as { strings?: readonly string[]; values?: unknown[] };
  if (r.strings === undefined) return "";
  return r.strings.map((s, i) => s + (i < (r.values?.length ?? 0) ? text(r.values![i]) : "")).join("");
}
function styleOf(markup: string, cls: string): string | undefined {
  return new RegExp(`<[a-z]+ class="${cls}(?: [^"]*)?"[^>]*?style=([^>]*)>`).exec(markup)?.[1]?.replace(/\s*\/$/, "");
}
function place(style: string | undefined): { x: number; y: number; w: number; h: number } {
  const n = (k: string) => Number(new RegExp(`(?:^|;)${k}:(-?[\\d.]+)px`).exec(style ?? "")?.[1]);
  return { x: n("left"), y: n("top"), w: n("width"), h: n("height") };
}
const BOXES: Record<string, [number, number]> = { lightbulb: [13.53, 22.22], "lightbulb.fill": [13.53, 22.22], person: [18, 20], "person.fill": [18, 20] };
const icons: IconProvider = {
  render: (name: string, size: number, colour: string) => {
    const box = BOXES[name];
    return box === undefined ? undefined : svg`<svg width=${size} height=${size} viewBox=${`0 0 ${box[0]} ${box[1]}`} fill=${colour}><rect /></svg>`;
  },
  available: () => true,
  names: () => Object.keys(BOXES),
};
const page: WatchPage = { id: "P", name: "P", items: [] };
const lit = (id: string, extra: Record<string, unknown> = {}): Record<string, HassEntityState> => ({
  [id]: { entity_id: id, state: "on", attributes: { brightness: 189, ...extra }, last_changed: "", last_updated: "" },
});
const UNIT = 15.5;
const cellOf = (cols: number, rows: number) => ({ width: cols * UNIT + (cols - 1) * 2, height: rows * UNIT + (rows - 1) * 2 });
const light = (extra: Partial<WatchPageTile> = {}): WatchPageTile => ({ id: "T", entityId: "light.kitchen", colSpan: 6, rowSpan: 4, customLabel: "Kitchen", color: "#8F7BEA", ...extra });
function watchInput(states: Record<string, HassEntityState>): WatchPagePreviewInput {
  return { page, pages: [page], screen: { width: 211, height: 251 }, states, icons, scale: 1, oneLook: true };
}
const onWatch = (t: WatchPageTile, cols = 6, rows = 4, states = lit("light.kitchen")) =>
  text(renderWatchTileFace(t, cellOf(cols, rows), watchInput(states), UNIT));

describe("an Icon Size past what fits", () => {
  const model = (size: number | undefined) => watchTileOneLookModel(light(size === undefined ? {} : { iconSizeOverride: size }), cellOf(6, 4), watchInput(lit("light.kitchen")), UNIT)!;

  it("grows the icon about its centre, over the text, which stays where it was", () => {
    const fits = model(48).layout;
    const grown = model(150).layout;
    expect(grown.mode).toBe("centred");
    expect(grown.stateRect).toEqual(fits.stateRect);
    expect(grown.textOrigin).toEqual(fits.textOrigin);
    expect(grown.name).toEqual(fits.name);
    expect(grown.discRect.x + grown.discRect.width / 2).toBeCloseTo(fits.discRect.x + fits.discRect.width / 2, 5);
    expect(grown.discRect.y + grown.discRect.height / 2).toBeCloseTo(fits.discRect.y + fits.discRect.height / 2, 5);
    expect(grown.discRect.height).toBeGreaterThan(grown.size.height);
    expect(grown.glyphSize / fits.glyphSize).toBeCloseTo(grown.discRect.width / fits.discRect.width, 5);
  });

  it("grows a little for a little: no jump just past the old largest", () => {
    const edge = model(48).layout.discRect.width;
    const past = model(50).layout.discRect.width;
    expect(past).toBeGreaterThan(edge);
    expect(past - edge).toBeLessThan(5);
  });

  it("changes nothing for a size the old editor could store, or for Auto", () => {
    expect(model(undefined).style.iconGrow).toBeUndefined();
    expect(model(20).style.iconGrow).toBeUndefined();
    // More than room for the text here, but a size stored before: it gives way.
    expect(model(48).style.iconGrow).toBeUndefined();
    expect(model(150).style.iconGrow).toBeCloseTo(150 - 48.6, 5);
  });

  it("stores up to 400 under One Look, and the tile's own largest under the old look", () => {
    const start = { schemaVersion: 1, pages: [{ id: PAGE_ID, name: "P", items: [{ id: TILE_ID, gridCol: 0, gridRow: 0, ...KITCHEN }] }] } as WatchPagesDocument;
    const stored = (d: WatchPagesDocument) => watchPageTiles((d.pages as WatchPage[])[0])[0]!.iconSizeOverride;
    expect(stored(setWatchTileIconSize(start, PAGE_ID, TILE_ID, 400, { oneLook: true }))).toBe(400);
    expect(setWatchTileIconSize(start, PAGE_ID, TILE_ID, 401, { oneLook: true })).toBe(start);
    expect(setWatchTileIconSize(start, PAGE_ID, TILE_ID, 400)).toBe(start);
  });
});

describe("One Look draws the arrangement", () => {
  it("moves the glyph and its glow together to a spot, at its size", () => {
    const native = onWatch(light());
    const moved = onWatch(light({ arrange: { v: 1, parts: { icon: { spot: "tl", scale: 1.2 } } } }));
    const g0 = place(styleOf(native, "ol-glyph"));
    const g1 = place(styleOf(moved, "ol-glyph"));
    const h0 = place(styleOf(native, "ol-halo"));
    const h1 = place(styleOf(moved, "ol-halo"));
    expect(g1.w).toBeCloseTo(g0.w * 1.2, 1);
    expect(h1.w).toBeCloseTo(h0.w * 1.2, 1);
    // The glow stays centred on the glyph.
    expect(h1.x + h1.w / 2).toBeCloseTo(g1.x + g1.w / 2, 1);
    expect(h1.y + h1.h / 2).toBeCloseTo(g1.y + g1.h / 2, 1);
    // Top left of the content box: the tile's inset.
    const model = watchTileOneLookModel(light({ arrange: { v: 1, parts: { icon: { spot: "tl" } } } }), cellOf(6, 4), watchInput(lit("light.kitchen")), UNIT)!;
    expect(model.arrange?.icon?.rect.x).toBeCloseTo(model.layout.insetH, 5);
    expect(model.arrange?.icon?.rect.y).toBeCloseTo(model.layout.insetV, 5);
  });

  it("aligns the name by its spot's column and scales its font", () => {
    const native = onWatch(light());
    const moved = onWatch(light({ arrange: { v: 1, parts: { name: { spot: "tl", scale: 1.5 } } } }));
    const nameStyle = styleOf(moved, "ol-text");
    expect(nameStyle).toContain("align-items:flex-start");
    expect(place(nameStyle).w).toBeCloseTo(place(styleOf(native, "ol-text")).w, 2);
    const size = (m: string) => Number(/font:\d+ ([\d.]+)px/.exec(styleOf(m, "ol-name") ?? "")?.[1]);
    expect(size(moved)).toBeCloseTo(size(native) * 1.5, 1);
    expect(styleOf(onWatch(light({ arrange: { v: 1, parts: { name: { spot: "br" } } } })), "ol-text")).toContain("align-items:flex-end");
  });

  it("hides a part without moving the others", () => {
    const native = onWatch(light());
    const hidden = onWatch(light({ arrange: { v: 1, parts: { state: { hidden: true }, icon: { hidden: true } } } }));
    expect(native).toContain(`class="ol-state`);
    expect(hidden).not.toContain(`class="ol-state`);
    expect(hidden).not.toContain(`class="ol-glyph"`);
    expect(hidden).not.toContain(`class="ol-halo"`);
    expect(styleOf(hidden, "ol-text")).toBe(styleOf(native, "ol-text"));
  });

  it("puts a person's photo where the icon goes", () => {
    const states: Record<string, HassEntityState> = {
      "person.jesse": { entity_id: "person.jesse", state: "home", attributes: { entity_picture: "/p.jpg" }, last_changed: "", last_updated: "" },
    };
    const person = (extra: Partial<WatchPageTile> = {}): WatchPageTile => ({ id: "T", entityId: "person.jesse", colSpan: 6, rowSpan: 5, customLabel: "Jesse", ...extra });
    const native = place(styleOf(onWatch(person(), 6, 5, states), "ol-photo"));
    const moved = place(styleOf(onWatch(person({ arrange: { v: 1, parts: { icon: { spot: "tr", scale: 0.8 } } } }), 6, 5, states), "ol-photo"));
    expect(native.w).toBeGreaterThan(0);
    expect(moved.w).toBeCloseTo(native.w * 0.8, 1);
    expect(moved.x + moved.w).toBeGreaterThan(native.x + native.w);
  });

  it("ignores the key where Free is not offered: a strip, a chart, a camera picture", () => {
    const key = { v: 1, parts: { icon: { spot: "br", scale: 1.5 }, state: { hidden: true } } };
    expect(onWatch(light({ rowSpan: 3, arrange: key }), 12, 3)).toBe(onWatch(light({ rowSpan: 3 }), 12, 3));
    const camStates: Record<string, HassEntityState> = {
      "camera.porch": { entity_id: "camera.porch", state: "idle", attributes: { entity_picture: "/c.jpg" }, last_changed: "", last_updated: "" },
    };
    const cam = (extra: Partial<WatchPageTile> = {}): WatchPageTile => ({ id: "C", entityId: "camera.porch", colSpan: 6, rowSpan: 4, cameraDisplayMode: "preview", ...extra });
    const camModel = watchTileOneLookModel(cam({ arrange: key }), cellOf(6, 4), watchInput(camStates), UNIT);
    expect(camModel?.arrange).toBeUndefined();
    expect(arrangeFreeBlock(camModel)).toContain("camera's picture");
    const strip = watchTileOneLookModel(light({ rowSpan: 3, arrange: key }), cellOf(12, 3), watchInput(lit("light.kitchen")), UNIT);
    expect(arrangeFreeBlock(strip)).toContain("under 4 rows");
    expect(arrangeFreeBlock(watchTileOneLookModel(light(), cellOf(6, 4), watchInput(lit("light.kitchen")), UNIT))).toBeUndefined();
  });

  it("draws it on the iPhone too", () => {
    const phone = phonePagesLayout(undefined, { look: "iphone" });
    const input: WatchPagePreviewInput = { page, pages: [page], screen: phonePagesScreen(phone), phone, states: lit("light.kitchen"), icons, scale: 1 };
    const unit = (380 - 22) / 12;
    const cell = { width: 6 * unit + 10, height: 4 * unit + 6 };
    const model = watchTileOneLookModel(light({ arrange: { v: 1, parts: { icon: { spot: "br" } } } }), cell, input, unit)!;
    expect(model.device).toBe("phone");
    const r = model.arrange!.icon!.rect;
    expect(r.x + r.width).toBeCloseTo(model.layout.size.width - model.layout.insetH, 5);
    expect(r.y + r.height).toBeCloseTo(model.layout.size.height - model.layout.insetV, 5);
  });
});

// ── the version note ─────────────────────────────────────────────────────

describe("the version note", () => {
  it("is set to 3.2.0, the release that draws it", () => {
    expect(MIN_VERSION_FOR_ARRANGEMENT).toBe("3.2.0");
    expect(arrangementFor("3.1.0")).toBe(false);
    expect(arrangementFor("3.2.0")).toBe(true);
    expect(arrangementUpdateNote([])).toBeUndefined();
  });

  it("with a minimum set, an older version does not draw it and an unreported one does", () => {
    expect(arrangementFor("3.2.0", "3.2.0")).toBe(true);
    expect(arrangementFor("3.10.0", "3.2.0")).toBe(true);
    expect(arrangementFor("3.1.9", "3.2.0")).toBe(false);
    expect(arrangementFor(null, "3.2.0")).toBe(true);
    expect(arrangementFor(undefined, "3.2.0")).toBe(true);
  });

  it("names the devices that draw Default", () => {
    expect(arrangementUpdateNote([], "3.2.0")).toBeUndefined();
    expect(arrangementUpdateNote(["Chen Watch"], "3.2.0")).toBe("Needs Wrist Assistant 3.2 on Chen Watch. Until then it draws the Standard layout.");
    expect(arrangementUpdateNote(["A", "B", "C"], "3.2.0")).toBe("Needs Wrist Assistant 3.2 on A, B and C. Until then they draw the Standard layout.");
  });
});

// ── the card ─────────────────────────────────────────────────────────────

interface Tpl { strings: readonly string[]; values: unknown[] }
const isTpl = (n: unknown): n is Tpl => typeof n === "object" && n !== null && "strings" in n && "values" in n;
function templates(node: unknown, out: Tpl[] = []): Tpl[] {
  if (Array.isArray(node)) for (const n of node) templates(n, out);
  else if (isTpl(node)) {
    out.push(node);
    for (const v of node.values) templates(v, out);
  }
  return out;
}
/** Press the smallest @click button whose markup holds `marker`. */
function click(root: unknown, marker: string): void {
  const found = templates(root)
    .map((t) => {
      let markup = "";
      let fn: unknown;
      t.strings.forEach((s, i) => {
        markup += s;
        if (i >= t.values.length) return;
        const v = t.values[i];
        if (typeof v === "function" && s.trimEnd().endsWith("@click=")) fn ??= v;
        markup += text(v);
      });
      return { markup, fn };
    })
    .filter((c) => c.markup.includes(marker) && c.fn !== undefined)
    .sort((a, b) => a.markup.length - b.markup.length);
  if (found.length === 0) throw new Error(`no @click near ${marker}`);
  (found[0]!.fn as (e: unknown) => void)({ currentTarget: null, stopPropagation() {} });
}

const PAGE_ID = "C3A0E000-0000-4000-8000-0000000000AA";
const TILE_ID = "C3A0E000-0000-4000-8000-000000000001";

/** The states the card's tiles read: a lit light, a camera with a picture,
 * and a script, which has no state line. */
const CARD_STATES = {
  ...lit("light.kitchen"),
  "camera.porch": { entity_id: "camera.porch", state: "idle", attributes: { entity_picture: "/api/camera_proxy/camera.porch" } },
  "script.movie": { entity_id: "script.movie", state: "off", attributes: {} },
};

function tileHost(t: Record<string, unknown>, opts: { oneLook?: boolean; pickers?: { name: string; version: string | null }[]; device?: "watch" | "iphone" } = {}) {
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [{ id: PAGE_ID, name: "Living", items: [{ id: TILE_ID, gridCol: 0, gridRow: 0, ...t }] }] }, 1);
  const pageNow = () => (draft.document.pages as WatchPage[])[0]!;
  const host = {
    hass: { states: CARD_STATES },
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    get document() { return draft.document; },
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
    apply: (next: WatchPagesDocument, o?: { coalesce?: string }) => draft.apply(next, o),
    endCoalesce: () => draft.endCoalesce(),
    selectTile: () => undefined,
    requestUpdate: () => undefined,
    tileId: TILE_ID,
    get tile() { return ((pageNow().items as WatchPageTile[] | undefined) ?? []).find((x) => x.id === TILE_ID) ?? ({} as WatchPageTile); },
    oneLook: opts.oneLook ?? true,
    ...(opts.device === undefined ? {} : { device: opts.device }),
    ...(opts.pickers === undefined ? {} : { pickers: opts.pickers }),
  } as unknown as TileSettingsHost;
  return { host, draft };
}
/** The Arrangement section's rows: Arrange, Part and the part's rows. */
const head = (host: TileSettingsHost) => renderArrangeSection(host);
const card = head;
const KITCHEN = { entityId: "light.kitchen", colSpan: 6, rowSpan: 4, customLabel: "Kitchen", color: "#8F7BEA" };
const stored = (host: TileSettingsHost) => host.tile.arrange;

describe("the Arrangement card", () => {
  it("comes last in the top card under One Look, for tiles with their own parts", () => {
    // No settings section of its own: an inspector part of the top card.
    expect(tileInspectorSections(tileHost(KITCHEN).host).slice(0, 2)).toEqual(["size", "icon"]);
    expect(tileArrangeShown(tileHost(KITCHEN).host)).toBe(true);
    expect(tileInspectorParts(tileHost(KITCHEN).host).find((g) => g.group === "top")?.parts).toEqual(["entity", "tap", "icon", "color", "arrange"]);
    expect(tileInspectorParts(tileHost(KITCHEN).host).find((g) => g.group === "text")?.parts).toEqual(["text", "state"]);
    expect(tileArrangeShown(tileHost(KITCHEN, { oneLook: false }).host)).toBe(false);
    expect(tileInspectorParts(tileHost(KITCHEN, { oneLook: false }).host).find((g) => g.group === "top")?.parts).toEqual(["entity", "tap", "icon", "color"]);
    for (const entityId of ["spacer.x", "divider.line.light", "template.x", "map.x", "macro.x"]) {
      expect(arrangeOffered({ id: "x", entityId }), entityId).toBe(false);
    }
    expect(arrangeOffered({ id: "x", entityId: "camera.porch" })).toBe(true);
  });

  it("starts on Standard, and Custom picked over the tile shows the rows without writing", () => {
    const { host, draft } = tileHost(KITCHEN);
    const before = text(card(host));
    expect(before).toMatch(/class="pc-opt on"[^>]*data-value=standard/);
    expect(before).not.toContain("Custom layout");
    expect(before).not.toContain("aria-label=Part");
    const doc = draft.document;
    click(head(host), "data-value=custom");
    expect(draft.document).toBe(doc);
    // The looks stay in view over the tools.
    const free = text(card(host));
    expect(free).toContain("aria-label=Look");
    expect(free).toMatch(/class="pc-opt on"[^>]*data-value=custom/);
    expect(free).toContain("aria-label=Part");
    expect(free).not.toContain("Use on whole page");
    expect(free).not.toContain("Change look");
  });

  it("draws the editor's large live tile in Custom only, above Part", () => {
    const { host } = tileHost(KITCHEN);
    const picture = () => svg`<rect class="big-tile"></rect>`;
    expect(text(renderArrangeSection(host, picture))).not.toContain("big-tile");
    click(head(host), "data-value=custom");
    const free = text(renderArrangeSection(host, picture));
    expect(free).toContain(`<div class="ts-arr-pic"><rect class="big-tile"></rect></div>`);
    expect(free.indexOf("Custom layout")).toBeLessThan(free.indexOf("ts-arr-pic"));
    expect(free.indexOf("ts-arr-pic")).toBeLessThan(free.indexOf("aria-label=Part"));
  });

  it("writes a look at once as one undo step, and reads it back as that look, not Custom", () => {
    const { host, draft } = tileHost(KITCHEN);
    click(head(host), "data-value=corners");
    expect(stored(host)).toEqual({ v: 1, parts: { icon: { spot: "tr", scale: 0.8 }, name: { spot: "bl" } } });
    expect(text(card(host))).toMatch(/class="pc-opt on"[^>]*data-value=corners/);
    expect(text(card(host))).not.toContain("aria-label=Part");
    click(head(host), "data-value=icon");
    expect(stored(host)).toEqual({ v: 1, parts: { icon: { spot: "mc", scale: 1.25 }, name: { hidden: true }, state: { hidden: true } } });
    draft.undo();
    expect(stored(host)).toEqual({ v: 1, parts: { icon: { spot: "tr", scale: 0.8 }, name: { spot: "bl" } } });
    click(head(host), "data-value=standard");
    expect(Object.hasOwn(host.tile, "arrange")).toBe(false);
  });

  it("opens Custom from a look keeping it, and a move there makes it the tile's own", () => {
    const { host } = tileHost(KITCHEN);
    click(head(host), "data-value=corners");
    click(head(host), "data-value=custom");
    expect(stored(host)).toEqual({ v: 1, parts: { icon: { spot: "tr", scale: 0.8 }, name: { spot: "bl" } } });
    click(card(host), "aria-label=Top left");
    expect(stored(host)).toEqual({ v: 1, parts: { icon: { spot: "tl", scale: 0.8 }, name: { spot: "bl" } } });
    // Custom stays with no pick behind it: this is no look any more.
    host.uiState.clear();
    expect(text(card(host))).toContain("aria-label=Part");
    expect(arrangeFreeOn(host.uiState, host.tile)).toBe(true);
    // A stored look alone opens no tools, so the stage shows no parts.
    expect(arrangeFreeOn(host.uiState, { ...host.tile, arrange: { v: 1, parts: { icon: { spot: "tr", scale: 0.8 }, name: { spot: "bl" } } } })).toBe(false);
  });

  it("draws each look's card with the tile the look writes", () => {
    const { host } = tileHost(KITCHEN);
    const seen: Record<string, unknown> = {};
    text(renderArrangeSection(host, undefined, (key, make) => {
      seen[key] = make(host.tile).arrange;
      return nothing;
    }));
    expect(Object.keys(seen)).toEqual(["standard", "icon", "big", "corners", "text"]);
    expect(seen.standard).toBeUndefined();
    expect(seen.big).toEqual({ v: 1, parts: { icon: { hidden: true }, state: { spot: "mc", scale: 1.5 } } });
  });

  it("turns a look off with the reason on a tile without the part it shows", () => {
    const { host } = tileHost({ entityId: "script.movie", colSpan: 6, rowSpan: 4, customLabel: "Movie" });
    const markup = text(card(host));
    expect(markup).toMatch(/data-value=big title=Off because it has no value \?disabled=true/);
    expect(markup).toContain("Big value is off because it has no value.");
  });

  it("marks the section changed while an arrangement is stored, and its Reset goes back to Default", () => {
    const { host, draft } = tileHost({ ...KITCHEN, arrange: { v: 1, parts: { name: { spot: "bl" } } } });
    expect(watchTileInspectorPartChanged(host, "arrange")).toBe(true);
    draft.apply(watchTileInspectorPartReset(host, "arrange")!(draft.document));
    expect(Object.hasOwn(host.tile, "arrange")).toBe(false);
    expect(watchTileInspectorPartChanged(host, "arrange")).toBe(false);
  });

  it("writes a spot, a size and hidden for the part picked, each one undo step", () => {
    const { host, draft } = tileHost(KITCHEN);
    click(head(host), "data-value=custom");
    click(card(host), "aria-label=Top right");
    expect(stored(host)).toEqual({ v: 1, parts: { icon: { spot: "tr" } } });
    click(card(host), ">150%</button>");
    expect(stored(host)).toEqual({ v: 1, parts: { icon: { spot: "tr", scale: 1.5 } } });
    click(card(host), "aria-label=Hide the state");
    expect(stored(host)).toEqual({ v: 1, parts: { icon: { spot: "tr", scale: 1.5 }, state: { hidden: true } } });
    expect(text(head(host))).toContain("ts-arr-moved");
    draft.undo();
    expect(stored(host)).toEqual({ v: 1, parts: { icon: { spot: "tr", scale: 1.5 } } });
  });

  it("puts a dragged part exactly at a spot, keeping its size and eye, and Reset puts it back", () => {
    const { host } = tileHost({ ...KITCHEN, arrange: { v: 1, parts: { icon: { dx: 0.038, dy: 0.29, scale: 1.2 }, name: { spot: "bl" } } } });
    click(card(host), "aria-label=Top right");
    expect(stored(host)).toEqual({ v: 1, parts: { icon: { spot: "tr", scale: 1.2 }, name: { spot: "bl" } } });
    host.endCoalesce();
    click(card(host), ">Reset icon<");
    expect(stored(host)).toEqual({ v: 1, parts: { name: { spot: "bl" } } });
    // Nothing left to reset on this part.
    expect(text(card(host))).toMatch(/\?disabled=true[^<]*>Reset icon</);
  });

  it("keeps the exact place under More, also after a drag leaves an offset, so the rows never jump", () => {
    const { host } = tileHost({ ...KITCHEN, arrange: { v: 1, parts: { name: { spot: "bl" } } } });
    expect(text(card(host))).toContain("Exact place");
    const nudged = tileHost({ ...KITCHEN, arrange: { v: 1, parts: { icon: { dx: 0.1 } } } });
    const markup = text(card(nudged.host));
    expect(markup).toContain("Exact place");
    expect(markup).toContain("?data-shown=false");
  });

  it("drops a moved spot's offset when the same spot is clicked again", () => {
    const { host } = tileHost({ ...KITCHEN, arrange: { v: 1, parts: { icon: { spot: "tr", dy: 0.358 } } } });
    click(card(host), "aria-label=Top right");
    expect(stored(host)).toEqual({ v: 1, parts: { icon: { spot: "tr" } } });
  });

  it("goes back to Standard by removing the key, which undo brings back", () => {
    const { host, draft } = tileHost({ ...KITCHEN, arrange: { v: 1, parts: { name: { spot: "bl" } } } });
    expect(text(card(host))).toContain("aria-label=Part");
    click(head(host), "data-value=standard");
    expect(Object.hasOwn(host.tile, "arrange")).toBe(false);
    expect(text(card(host))).not.toContain("aria-label=Part");
    draft.undo();
    expect(stored(host)).toEqual({ v: 1, parts: { name: { spot: "bl" } } });
  });

  it("Standard takes the layout off and closes the tools", () => {
    const { host } = tileHost({ ...KITCHEN, arrange: { v: 1, parts: { icon: { spot: "tl" }, state: { hidden: true } } } });
    click(head(host), "data-value=standard");
    expect(Object.hasOwn(host.tile, "arrange")).toBe(false);
    expect(text(card(host))).toMatch(/class="pc-opt on"[^>]*data-value=standard/);
    expect(text(card(host))).not.toContain("aria-label=Part");
  });

  it("draws a short tile as only a centred icon when its layout hides its text, and ignores any other layout", () => {
    const short = { ...KITCHEN, id: TILE_ID, colSpan: 6, rowSpan: 3 };
    const input = watchInput(lit("light.kitchen"));
    const layoutOf = (t: WatchPageTile) => watchTileOneLookModel(t, cellOf(6, 3), input, UNIT)!;
    expect(layoutOf(short).layout.mode).toBe("strip");
    const icon = { v: 1, parts: { icon: { spot: "mc", scale: 1.25 }, name: { hidden: true }, state: { hidden: true } } };
    const only = layoutOf({ ...short, arrange: icon });
    expect(only.layout.mode).toBe("centred");
    expect(only.layout.name.lines).toEqual([]);
    expect(only.layout.state).toBeUndefined();
    const placed = only.arrange!.icon!;
    expect(placed.rect.x + placed.rect.width / 2).toBeCloseTo(only.layout.size.width / 2, 3);
    expect(placed.rect.y + placed.rect.height / 2).toBeCloseTo(only.layout.size.height / 2, 3);
    // Hiding only one, or the icon too, stays a strip that ignores the key.
    expect(layoutOf({ ...short, arrange: { v: 1, parts: { name: { hidden: true } } } }).layout.mode).toBe("strip");
    expect(layoutOf({ ...short, arrange: { v: 1, parts: { icon: { hidden: true }, name: { hidden: true }, state: { hidden: true } } } }).layout.mode).toBe("strip");
    // A tall tile keeps its layout's rects: the key only hides the parts.
    const tall = watchTileOneLookModel(light({ arrange: icon }), cellOf(6, 4), input, UNIT)!;
    expect(tall.layout.name.lines.length).toBeGreaterThan(0);
    expect(tall.arrange!.name!.hidden).toBe(true);
  });

  it("gives a short light Standard and Icon only through its layout, with no other key touched", () => {
    const { host, draft } = tileHost({ ...KITCHEN, colSpan: 12, rowSpan: 3 });
    const markup = text(card(host));
    expect(markup).toContain("data-value=standard");
    expect(markup).toContain("data-value=icon");
    expect(markup).not.toContain("data-value=big");
    expect(markup).not.toContain("data-value=custom");
    expect(markup).toContain("On the watch, a tile under 4 rows keeps its parts in a row.");
    const before = draft.document;
    click(head(host), "data-value=icon");
    expect(draft.document).not.toBe(before);
    expect(stored(host)).toEqual({ v: 1, parts: { icon: { spot: "mc", scale: 1.25 }, name: { hidden: true }, state: { hidden: true } } });
    expect(Object.hasOwn(host.tile, "showLabel")).toBe(false);
    // Short by size still: Icon only reads as on, and no more looks open up.
    const after = text(card(host));
    expect(after).toMatch(/class="pc-opt on"[^>]*data-value=icon/);
    expect(after).not.toContain("data-value=custom");
    click(head(host), "data-value=standard");
    expect(Object.hasOwn(host.tile, "arrange")).toBe(false);
    expect(text(card(host))).toMatch(/class="pc-opt on"[^>]*data-value=standard/);
    draft.undo();
    expect(stored(host)).toEqual({ v: 1, parts: { icon: { spot: "mc", scale: 1.25 }, name: { hidden: true }, state: { hidden: true } } });
  });

  it("says a short tile keeps a layout it does not draw, and Standard clears it", () => {
    const { host } = tileHost({ ...KITCHEN, colSpan: 12, rowSpan: 3, arrange: { v: 1, parts: { icon: { spot: "tl" } } } });
    const markup = text(card(host));
    expect(markup).toMatch(/class="pc-opt on"[^>]*data-value=standard/);
    expect(markup).toContain("The layout stored on it is kept but not drawn.");
  });

  it("gives a tile whose picture fills it only the reason, and a way to clear a stored layout", () => {
    const camera = { entityId: "camera.porch", colSpan: 6, rowSpan: 4, customLabel: "Porch", cameraDisplayMode: "preview" };
    const plain = text(card(tileHost(camera).host));
    expect(plain).toContain("The camera's picture fills this tile");
    expect(plain).not.toContain("data-value=");
    expect(plain).not.toContain("Clear the stored layout");
    const { host } = tileHost({ ...camera, arrange: { v: 1, parts: { icon: { spot: "tl" } } } });
    expect(text(card(host))).toContain("The layout stored on it is kept but not drawn.");
    click(card(host), ">Clear the stored layout<");
    expect(Object.hasOwn(host.tile, "arrange")).toBe(false);
  });

  it("notes only the devices older than the 3.2.0 release", () => {
    const old = text(card(tileHost(KITCHEN, { pickers: [{ name: "Chen Watch", version: "3.1.4" }, { name: "Jesse iPhone", version: "3.2.0" }] }).host));
    expect(old).toContain("Needs Wrist Assistant 3.2 on Chen Watch.");
    expect(old).not.toContain("Jesse iPhone");
  });

  it("shares the part picked with the stage through the editor's view state", () => {
    const { host } = tileHost(KITCHEN);
    click(head(host), "data-value=custom");
    // Icon until another is picked.
    expect(arrangePickedPart(host.uiState, TILE_ID)).toBe("icon");
    const partOn = (word: string) => new RegExp(`ts-arr-part on [^"]*">\\s*<button[\\s\\S]{0,200}?>${word}<`);
    click(head(host), ">Name<");
    expect(arrangePickedPart(host.uiState, TILE_ID.toLowerCase())).toBe("name");
    // A part picked on the stage is the card's.
    setArrangePickedPart(host.uiState, TILE_ID, "state");
    expect(text(head(host))).toMatch(partOn("State"));
    // Let go on the stage (Escape): no part on, and no rows to set one.
    setArrangePickedPart(host.uiState, TILE_ID, undefined);
    const none = text(card(host));
    expect(none).not.toContain("ts-arr-part on");
    expect(none).toContain("Drag a part to move it");
    expect(none).not.toContain("Reset ");
    click(head(host), ">Icon<");
    expect(arrangePickedPart(host.uiState, TILE_ID)).toBe("icon");
    // Custom picked again after a look brings a let go pick back as Icon.
    setArrangePickedPart(host.uiState, TILE_ID, undefined);
    click(head(host), "data-value=standard");
    click(head(host), "data-value=custom");
    expect(arrangePickedPart(host.uiState, TILE_ID)).toBe("icon");
  });
});

describe("a layout on a small iPhone tile", () => {
  const TINY = { ...KITCHEN, colSpan: 2, rowSpan: 2 };
  const CORNERS = { v: 1, parts: { icon: { spot: "tr", scale: 0.8 }, name: { spot: "bl" } } };

  it("offers every look at any size, and only on the iPhone", () => {
    const phone = text(card(tileHost(TINY, { device: "iphone" }).host));
    for (const look of ["standard", "icon", "big", "corners", "text", "custom"]) expect(phone).toContain(`data-value=${look}`);
    expect(phone).not.toContain("off because");
    const watch = text(card(tileHost({ ...KITCHEN, colSpan: 12, rowSpan: 3 }).host));
    expect(watch).not.toContain("data-value=corners");
  });

  it("starts Custom from a layout that draws its parts, so they can be grabbed", () => {
    const { host, draft } = tileHost(TINY, { device: "iphone" });
    click(head(host), "data-value=custom");
    // What it draws now, and what it does not draw stays hidden.
    expect(stored(host)).toEqual({ v: 1, parts: { icon: { spot: "mc" }, name: { hidden: true }, state: { hidden: true } } });
    draft.undo();
    expect(Object.hasOwn(host.tile, "arrange")).toBe(false);
    // A tile that already draws its parts writes nothing.
    const roomy = tileHost(KITCHEN, { device: "iphone" });
    click(head(roomy.host), "data-value=custom");
    expect(Object.hasOwn(roomy.host.tile, "arrange")).toBe(false);
  });

  it("says when the watch draws Standard instead", () => {
    const { host } = tileHost({ ...TINY, arrange: CORNERS }, { device: "iphone" });
    expect(text(card(host))).toContain("On the watch, this tile uses Standard");
    const big = tileHost({ ...KITCHEN, arrange: CORNERS }, { device: "iphone" });
    expect(text(card(big.host))).not.toContain("On the watch, this tile uses Standard");
  });

  it("names what a resize took, and stays quiet when it took nothing", () => {
    const model = (t: Record<string, unknown>, device: "watch" | "iphone" = "iphone") => {
      const { host } = tileHost(t, { device });
      return arrangeFrame({ page: host.page, pages: [host.page], device, states: host.hass.states as never, icons: host.icons }, host.tile)?.model;
    };
    expect(arrangeResizeNote(model({ ...KITCHEN, colSpan: 4, rowSpan: 4 }), model({ ...KITCHEN, colSpan: 3, rowSpan: 4 }), undefined)).toBeUndefined();
    expect(arrangeResizeNote(model({ ...KITCHEN, colSpan: 4, rowSpan: 4 }), model(TINY), undefined))
      .toBe("This tile is now too small to show its name and state. Make it bigger to bring them back.");
    const movie = { entityId: "script.movie", customLabel: "Movie" };
    expect(arrangeResizeNote(model({ ...movie, colSpan: 4, rowSpan: 4 }), model({ ...movie, colSpan: 1, rowSpan: 1 }), undefined))
      .toBe("This tile is now too small to show its name. Make it bigger to bring it back.");
    const arrange = normalizeTileArrange(CORNERS);
    expect(arrangeResizeNote(model({ ...KITCHEN, arrange: CORNERS }, "watch"), model({ ...KITCHEN, colSpan: 12, rowSpan: 3, arrange: CORNERS }, "watch"), arrange))
      .toContain("too small for its layout on the watch");
  });
});

describe("a look on the whole page", () => {
  const OTHER = "C3A0E000-0000-4000-8000-000000000002";
  const CAMERA = "C3A0E000-0000-4000-8000-000000000003";
  const SCENE = "C3A0E000-0000-4000-8000-000000000004";
  const OWN = "C3A0E000-0000-4000-8000-000000000005";
  const SHORT = "C3A0E000-0000-4000-8000-000000000006";
  const SPACER = "C3A0E000-0000-4000-8000-000000000007";
  const SHORT_LIGHT = "C3A0E000-0000-4000-8000-000000000008";
  const others = [
    { id: OTHER, entityId: "light.kitchen", colSpan: 6, rowSpan: 4, gridCol: 6, gridRow: 0, customLabel: "Hall" },
    { id: CAMERA, entityId: "camera.porch", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 4, customLabel: "Porch", cameraDisplayMode: "preview" },
    { id: SCENE, entityId: "script.movie", colSpan: 6, rowSpan: 4, gridCol: 6, gridRow: 4, customLabel: "Movie" },
    { id: OWN, entityId: "light.kitchen", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 8, customLabel: "Own", arrange: { v: 1, parts: { icon: { spot: "tl" } } } },
    { id: SHORT, entityId: "script.movie", colSpan: 12, rowSpan: 3, gridCol: 0, gridRow: 12, customLabel: "Short" },
    { id: SPACER, entityId: "spacer.x", colSpan: 12, rowSpan: 2, gridCol: 0, gridRow: 15 },
    { id: SHORT_LIGHT, entityId: "light.kitchen", colSpan: 12, rowSpan: 3, gridCol: 0, gridRow: 17, customLabel: "Strip" },
  ];
  function pageHost() {
    const { host, draft } = tileHost(KITCHEN);
    const start = draft.document;
    const page = (start.pages as WatchPage[])[0]!;
    draft.apply({ ...start, pages: [{ ...page, items: [...(page.items as WatchPageTile[]), ...others] }] });
    return { host, draft };
  }
  const tileAt = (host: TileSettingsHost, id: string) => watchPageTiles(host.page).find((t) => t.id === id)!;

  it("asks first, naming what changes, what stays and why, and writes nothing until asked", () => {
    const { host, draft } = pageHost();
    click(head(host), "data-value=big");
    const doc = draft.document;
    click(card(host), ">Use on whole page<");
    expect(draft.document).toBe(doc);
    const ask = text(card(host)).replace(/\s+/g, " ");
    // Hall and Own: the camera, the scene and both short tiles stay; the spacer has no parts.
    expect(ask).toContain("Use Big value on 2 tiles?");
    expect(ask).toContain("1 tile has a layout of its own, and this replaces it.");
    expect(ask).toContain("4 tiles stay as they are");
    expect(ask).toContain("Porch (the camera fills the tile)");
    expect(ask).toContain("Movie (it has no value)");
    expect(ask).toContain("Short (it is too short)");
    expect(ask).toContain("and 1 more");
    expect(ask).not.toContain("spacer");
    click(card(host), ">Cancel<");
    expect(draft.document).toBe(doc);
    expect(text(card(host))).toContain("Use on whole page");
  });

  it("changes every tile in one undo step, and says so with an Undo", () => {
    const { host, draft } = pageHost();
    const undone: string[] = [];
    Object.defineProperty(host, "undoEdit", { value: () => { undone.push("undo"); draft.undo(); }, configurable: true });
    click(head(host), "data-value=corners");
    const before = draft.document;
    click(card(host), ">Use on whole page<");
    click(card(host), ">Use on ");
    const corners = { v: 1, parts: { icon: { spot: "tr", scale: 0.8 }, name: { spot: "bl" } } };
    for (const id of [OTHER, SCENE, OWN]) expect(tileAt(host, id).arrange, id).toEqual(corners);
    expect(Object.hasOwn(tileAt(host, CAMERA), "arrange")).toBe(false);
    expect(Object.hasOwn(tileAt(host, SHORT), "arrange")).toBe(false);
    expect(Object.hasOwn(tileAt(host, SHORT_LIGHT), "arrange")).toBe(false);
    expect(text(card(host))).toContain("Corners is on 3 tiles.");
    click(card(host), ">Undo<");
    expect(undone).toEqual(["undo"]);
    expect(draft.document).toEqual(before);
    expect(text(card(host))).not.toContain("is on 3 tiles");
  });

  it("puts Icon only on short tiles too, a short light with them, and Standard takes every layout off", () => {
    const { host } = pageHost();
    click(head(host), "data-value=icon");
    click(card(host), ">Use on whole page<");
    expect(text(card(host))).toContain("Use Icon only on 5 tiles?");
    click(card(host), ">Use on ");
    const iconOnly = { v: 1, parts: { icon: { spot: "mc", scale: 1.25 }, name: { hidden: true }, state: { hidden: true } } };
    expect(tileAt(host, SHORT).arrange).toEqual(iconOnly);
    expect(tileAt(host, SHORT_LIGHT).arrange).toEqual(iconOnly);
    click(head(host), "data-value=standard");
    click(card(host), ">Use on whole page<");
    click(card(host), ">Use on ");
    for (const id of [OTHER, SCENE, OWN, SHORT, SHORT_LIGHT]) expect(Object.hasOwn(tileAt(host, id), "arrange"), id).toBe(false);
  });

  it("closes the question when another edit changes the page", () => {
    const { host, draft } = pageHost();
    click(head(host), "data-value=corners");
    click(card(host), ">Use on whole page<");
    expect(text(card(host))).toContain("Use Corners on");
    draft.apply(setWatchTileArrange(draft.document, PAGE_ID, OTHER, { v: 1, parts: { icon: { spot: "tl" } } }));
    expect(text(card(host))).not.toContain("Use Corners on");
  });
});

// ── the stage's part drag ────────────────────────────────────────────────

describe("the parts on the stage", () => {
  it("finds the parts a Free tile draws, leaving out hidden parts, and none on a tile Free cannot place", () => {
    const input = watchInput(lit("light.kitchen"));
    const stage = arrangeStageParts(light(), cellOf(6, 4), input, UNIT)!;
    expect(Object.keys(stage.parts).sort()).toEqual(["icon", "name", "state"]);
    expect(stage.size.width).toBeGreaterThan(0);
    const icon = stage.parts.icon!;
    expect(stage.inset).toBeGreaterThanOrEqual(0);
    // Where the arrangement puts it.
    const moved = arrangeStageParts(light({ arrange: { v: 1, parts: { icon: { dx: 0.1 } } } }), cellOf(6, 4), input, UNIT)!;
    expect(moved.parts.icon!.x).toBeCloseTo(icon.x + 0.1 * stage.size.width, 5);
    const hidden = arrangeStageParts(light({ arrange: { v: 1, parts: { state: { hidden: true } } } }), cellOf(6, 4), input, UNIT)!;
    expect(Object.keys(hidden.parts).sort()).toEqual(["icon", "name"]);
    // A strip, and a kind with no parts of its own.
    expect(arrangeStageParts(light({ rowSpan: 3 }), cellOf(6, 3), input, UNIT)).toBeUndefined();
    expect(arrangeStageParts({ id: "S", entityId: "spacer.x", colSpan: 6, rowSpan: 4 }, cellOf(6, 4), input, UNIT)).toBeUndefined();
  });

  it("moves a part by shares of the tile, keeping its spot, clamped to half the tile and rounded to a thousandth", () => {
    expect(arrangeOffset(0.12345)).toBe(0.123);
    expect(arrangeOffset(0.9)).toBe(0.5);
    expect(arrangeOffset(-0.9)).toBe(-0.5);
    expect(Object.is(arrangeOffset(-0.0001), 0)).toBe(true);
    const from = normalizeTileArrange({ v: 1, parts: { icon: { spot: "tr", dx: 0.1 } } });
    expect(movedArrangePart(from, "icon", 0.0504, -0.2)).toEqual({ v: 1, parts: { icon: { spot: "tr", dx: 0.15, dy: -0.2 } } });
    expect(movedArrangePart(from, "icon", 2, 2)).toEqual({ v: 1, parts: { icon: { spot: "tr", dx: 0.5, dy: 0.5 } } });
    expect(movedArrangePart(undefined, "name", 0.0004, 0)).toBeUndefined();
    expect(movedArrangePart(undefined, "name", -0.25, 0)).toEqual({ v: 1, parts: { name: { dx: -0.25 } } });
  });

  it("nudges a part 1% a key, 5% with Shift", () => {
    expect(nudgedArrangePart(undefined, "icon", "right", false)).toEqual({ v: 1, parts: { icon: { dx: 0.01 } } });
    expect(nudgedArrangePart(undefined, "state", "up", true)).toEqual({ v: 1, parts: { state: { dy: -0.05 } } });
    const at = normalizeTileArrange({ v: 1, parts: { name: { dx: 0.49 } } });
    expect(nudgedArrangePart(at, "name", "right", true)).toEqual({ v: 1, parts: { name: { dx: 0.5 } } });
    expect(nudgedArrangePart(normalizeTileArrange({ v: 1, parts: { name: { dx: 0.01 } } }), "name", "left", false)).toBeUndefined();
  });
});
