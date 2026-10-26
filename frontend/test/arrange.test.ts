// A tile's Arrangement (`arrange`): reading and writing the key, the
// placement math, the One Look drawing that applies it, the version note,
// and the Arrangement card. The shared fixtures have their own test
// (`arrange-fixtures.test.ts`). Plan: app repo
// docs/page_editor_calm_plan_2026-10.md, "The Arrangement key", steps 5 and 6.

import { svg } from "lit";
import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import { phonePagesLayout, phonePagesScreen } from "../src/phone-frame.js";
import { SymbolBrowser } from "../src/symbols.js";
import { MIN_VERSION_FOR_ARRANGEMENT, arrangementFor, arrangementUpdateNote } from "../src/version.js";
import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { NO_ICONS, type TileSettingsHost } from "../src/watch-pages/editor-host.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { type WatchPagePreviewInput, renderWatchTileFace, watchTileOneLookModel } from "../src/watch-pages/preview.js";
import {
  arrangeNameAlign,
  arrangePartRect,
  encodeTileArrange,
  normalizeTileArrange,
  withArrangePart,
} from "../src/watch-pages/one-look/arrange.js";
import {
  arrangeFreeBlock,
  arrangeOffered,
  arrangeOffset,
  arrangePickedPart,
  arrangeStageParts,
  movedArrangePart,
  nudgedArrangePart,
  setArrangePickedPart,
} from "../src/watch-pages/arrange-model.js";
import { setWatchTileArrange } from "../src/watch-pages/tile-settings-model.js";
import { renderTileSettings, tileInspectorSections } from "../src/watch-pages/tile-settings.js";

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
  it("is unset until the release, so every device reads as new enough", () => {
    expect(MIN_VERSION_FOR_ARRANGEMENT).toBeNull();
    expect(arrangementFor("3.1.0")).toBe(true);
    expect(arrangementUpdateNote(["Chen Watch"])).toBeUndefined();
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
    expect(arrangementUpdateNote(["Chen Watch"], "3.2.0")).toBe("Needs Wrist Assistant 3.2 on Chen Watch. Until then it draws the Default arrangement.");
    expect(arrangementUpdateNote(["A", "B", "C"], "3.2.0")).toBe("Needs Wrist Assistant 3.2 on A, B and C. Until then they draw the Default arrangement.");
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

function tileHost(t: Record<string, unknown>, opts: { oneLook?: boolean; pickers?: { name: string; version: string | null }[] } = {}) {
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [{ id: PAGE_ID, name: "Living", items: [{ id: TILE_ID, gridCol: 0, gridRow: 0, ...t }] }] }, 1);
  const pageNow = () => (draft.document.pages as WatchPage[])[0]!;
  const host = {
    hass: { states: lit("light.kitchen") },
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
    ...(opts.pickers === undefined ? {} : { pickers: opts.pickers }),
  } as unknown as TileSettingsHost;
  return { host, draft };
}
const card = (host: TileSettingsHost) => renderTileSettings(host, { sections: ["arrange"] });
const KITCHEN = { entityId: "light.kitchen", colSpan: 6, rowSpan: 4, customLabel: "Kitchen", color: "#8F7BEA" };
const stored = (host: TileSettingsHost) => host.tile.arrange;

describe("the Arrangement card", () => {
  it("comes right after Size under One Look, for tiles with their own parts", () => {
    expect(tileInspectorSections(tileHost(KITCHEN).host).slice(0, 3)).toEqual(["size", "arrange", "icon"]);
    expect(tileInspectorSections(tileHost(KITCHEN, { oneLook: false }).host)).not.toContain("arrange");
    for (const entityId of ["spacer.x", "divider.line.light", "template.x", "map.x", "macro.x"]) {
      expect(arrangeOffered({ id: "x", entityId }), entityId).toBe(false);
    }
    expect(arrangeOffered({ id: "x", entityId: "camera.porch" })).toBe(true);
  });

  it("starts on Default with both pictures, and Free shows the rows without writing", () => {
    const { host, draft } = tileHost(KITCHEN);
    const before = text(card(host));
    expect(before).toContain(`<h4>Arrangement</h4>`);
    expect(before).toContain("Every part sits where the tile's layout puts it.");
    expect(before.match(/class="ts-arr-tile"/g)?.length).toBe(2);
    expect(before).not.toContain("Native place");
    const doc = draft.document;
    click(card(host), `"ts-arr-label">Free<`);
    expect(draft.document).toBe(doc);
    const free = text(card(host));
    expect(free).toContain("Native place");
    expect(free).toContain("Put every part back");
  });

  it("writes a spot, a size and hidden for the part picked, each one undo step", () => {
    const { host, draft } = tileHost(KITCHEN);
    click(card(host), `"ts-arr-label">Free<`);
    click(card(host), "aria-label=Top right");
    expect(stored(host)).toEqual({ v: 1, parts: { icon: { spot: "tr" } } });
    click(card(host), ">150%</button>");
    expect(stored(host)).toEqual({ v: 1, parts: { icon: { spot: "tr", scale: 1.5 } } });
    click(card(host), ">State</button>");
    click(card(host), ">Hidden</button>");
    expect(stored(host)).toEqual({ v: 1, parts: { icon: { spot: "tr", scale: 1.5 }, state: { hidden: true } } });
    expect(text(card(host))).toContain("Icon •");
    draft.undo();
    expect(stored(host)).toEqual({ v: 1, parts: { icon: { spot: "tr", scale: 1.5 } } });
  });

  it("goes back to Default by removing the key, which undo brings back", () => {
    const { host, draft } = tileHost({ ...KITCHEN, arrange: { v: 1, parts: { name: { spot: "bl" } } } });
    expect(text(card(host))).toContain("Native place");
    click(card(host), `"ts-arr-label">Default<`);
    expect(Object.hasOwn(host.tile, "arrange")).toBe(false);
    expect(text(card(host))).not.toContain("Native place");
    draft.undo();
    expect(stored(host)).toEqual({ v: 1, parts: { name: { spot: "bl" } } });
  });

  it("puts every part back and stays on Free", () => {
    const { host } = tileHost({ ...KITCHEN, arrange: { v: 1, parts: { icon: { spot: "tl" }, state: { hidden: true } } } });
    click(card(host), ">Put every part back<");
    expect(Object.hasOwn(host.tile, "arrange")).toBe(false);
    expect(text(card(host))).toContain("Native place");
  });

  it("greys Free with the reason on a tile that cannot use it", () => {
    const { host } = tileHost({ ...KITCHEN, colSpan: 12, rowSpan: 3, arrange: { v: 1, parts: { icon: { spot: "tl" } } } });
    const markup = text(card(host));
    expect(markup).toMatch(/<button type="button" class="ts-arr-pick on" role="radio" aria-checked=true\s+\?disabled=false/);
    expect(markup).toContain("?disabled=true");
    expect(markup).toContain("A tile under 4 rows lays its parts out in a row.");
    expect(markup).toContain("The arrangement stored on it is kept but not drawn.");
    expect(markup).not.toContain("Native place");
    click(card(host), ">Put every part back<");
    expect(Object.hasOwn(host.tile, "arrange")).toBe(false);
  });

  it("notes no device as too old while the release has not set a minimum", () => {
    const old = text(card(tileHost(KITCHEN, { pickers: [{ name: "Chen Watch", version: "3.1.4" }, { name: "Jesse iPhone", version: "3.2.0" }] }).host));
    expect(old).not.toContain("Needs Wrist Assistant");
  });

  it("shares the part picked with the stage through the editor's view state", () => {
    const { host } = tileHost(KITCHEN);
    click(card(host), `"ts-arr-label">Free<`);
    // Icon until another is picked.
    expect(arrangePickedPart(host.uiState, TILE_ID)).toBe("icon");
    click(card(host), ">Name</button>");
    expect(arrangePickedPart(host.uiState, TILE_ID.toLowerCase())).toBe("name");
    // A part picked on the stage is the card's.
    setArrangePickedPart(host.uiState, TILE_ID, "state");
    expect(text(card(host))).toMatch(/aria-checked=true\s+class=on title=The state line/);
    // Let go on the stage (Escape): no part on, and no rows to set one.
    setArrangePickedPart(host.uiState, TILE_ID, undefined);
    const none = text(card(host));
    expect(none).not.toMatch(/aria-checked=true\s+class=on title=The (icon|tile's name|state line)/);
    expect(none).toContain("Pick a part here or click it on the tile");
    expect(none).not.toContain("Native place");
    expect(none).toContain("Put every part back");
    click(card(host), ">Icon</button>");
    expect(arrangePickedPart(host.uiState, TILE_ID)).toBe("icon");
    // Free picked again after Default brings a let go pick back as Icon.
    setArrangePickedPart(host.uiState, TILE_ID, undefined);
    click(card(host), `"ts-arr-label">Default<`);
    click(card(host), `"ts-arr-label">Free<`);
    expect(arrangePickedPart(host.uiState, TILE_ID)).toBe("icon");
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
