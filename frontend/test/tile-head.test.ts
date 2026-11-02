// The tile inspector's head (`tile-head.ts`): Controls names the entity by its
// friendly name, area and id; the row holds the Name, how many parts are
// changed with Reset all, then the tile's actions; Copy look and Paste look;
// and the selected tile on the stage and the settings talking to each other,
// a row under the pointer lighting its part of the tile and a press on a part
// of the tile going to its section.
//
// No DOM: the page editor's `renderInspector` is drawn to its Lit template
// and read as text; the few DOM reads are answered by small stand-ins.

import { nothing } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import type { TileSettingsHost } from "../src/watch-pages/editor-host.js";
import { libraryDraftKey } from "../src/library/item-mode.js";
import { forgetWatchPagesDraft, takeWatchPagesRecord } from "../src/watch-pages/kept.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { TILE_INSPECTOR_PARTS } from "../src/watch-pages/tile-settings.js";
import {
  STATE_BAR_CARD_TITLE,
  TILE_HEAD_GOES_TO,
  TILE_HEAD_PART_OF,
  tileHeadChangedCount,
  tileHeadPartAt,
  watchTileLookKeys,
  watchTileLookOf,
  watchTileWithLook,
} from "../src/watch-pages/tile-head.js";
import { requiredTileKeyDefault } from "../src/watch-pages/merge.js";
import { watchTileStateCards } from "../src/watch-pages/styling-model.js";
import "../src/watch-pages/page-editor.js";

(globalThis as { document?: unknown }).document ??= { activeElement: null };
(globalThis as { HTMLElement?: unknown }).HTMLElement ??= class {};
(globalThis as { HTMLInputElement?: unknown }).HTMLInputElement ??= class {};

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}

function isTpl(node: unknown): node is Tpl {
  return typeof node === "object" && node !== null && "strings" in node && "values" in node;
}

function flat(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(flat).join("");
  if (isTpl(node)) return node.strings.map((s, i) => s + (i < node.values.length ? flat(node.values[i]) : "")).join("");
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

/** Press the `@click` of the smallest template whose text holds `marker`. */
function click(root: unknown, marker: string): void {
  const found = templates(root)
    .map((t) => {
      let text = "";
      let fn: unknown;
      t.strings.forEach((s, i) => {
        text += s;
        if (i >= t.values.length) return;
        const v = t.values[i];
        if (typeof v === "function" && s.trimEnd().endsWith("@click=")) fn ??= v;
        text += flat(v);
      });
      return { text, fn };
    })
    .filter((c) => c.text.includes(marker) && c.fn !== undefined)
    .sort((a, b) => a.text.length - b.text.length);
  if (found.length === 0) throw new Error(`no @click handler near ${marker}`);
  (found[0]!.fn as (e: unknown) => void)({ currentTarget: null, stopPropagation() {} });
}

const PAGE = "C3A0E000-0000-4000-8000-0000000000B1";
const DIMMER = "C3A0E000-0000-4000-8000-0000000000C1";
const SPACER = "C3A0E000-0000-4000-8000-0000000000C2";

const DIMMER_TILE: WatchPageTile = {
  id: DIMMER, entityId: "light.smart_plug_dimmer", gridCol: 0, gridRow: 0, colSpan: 6, rowSpan: 4,
  customLabel: "Smart Plug Dimmer", showLabel: true, labelShadow: true, labelFontWeight: "light",
  iconShadow: false, iconTapAnimation: "replace",
};

const SPACER_TILE: WatchPageTile = { id: SPACER, entityId: `spacer.${SPACER}`, gridCol: 6, gridRow: 0, colSpan: 6, rowSpan: 2, showLabel: false };

function hallPage(dimmer: Partial<WatchPageTile> = {}): WatchPage {
  return {
    id: PAGE, name: "Hall", items: [{ ...DIMMER_TILE, ...dimmer }, SPACER_TILE], groups: [],
    themeOverride: "neonLagoon", useGradientColors: false, hideFromSwitcher: false,
  } as WatchPage;
}

const HASS = {
  states: {
    "light.smart_plug_dimmer": { entity_id: "light.smart_plug_dimmer", state: "on", attributes: { friendly_name: "Smart Plug Dimmer" } },
  },
  entities: { "light.smart_plug_dimmer": { entity_id: "light.smart_plug_dimmer", area_id: "office" } },
  areas: { office: { area_id: "office", name: "Office" } },
};

type Editor = Record<string, unknown> & {
  renderInspector(page: WatchPage, tile: WatchPageTile | undefined, pages: readonly WatchPage[]): unknown;
  tileSettingsHost(page: WatchPage, tile: WatchPageTile): TileSettingsHost | undefined;
  currentPage(): WatchPage | undefined;
  selectedTileId?: string;
};

let watchSeq = 0;

function editor(page: WatchPage, selectedTile?: string): Editor {
  const Ctor = customElements.get("wa-page-editor") as unknown as new () => Editor;
  const el = new Ctor();
  const watchId = `tile-head-test-${++watchSeq}`;
  const document = { schemaVersion: 1, pages: [page] } as unknown as WatchPagesDocument;
  el.owners = [{ owner_watch_id: watchId, device_name: "Apple Watch", device_kind: "watch", paired_iphone_name: null } as unknown as OwnerSummary];
  const ref = { kind: "pages" as const, id: PAGE };
  el.libraryItem = ref;
  el.openedItem = ref;
  el.watchId = watchId;
  el.record = {
    kind: "pages", revision: 7, hash: null, updated_at: "2026-10-03T11:55:00Z", updated_by: "panel",
    delivered_revision: 7, delivered_at: null, document: document as unknown as Record<string, unknown>,
  } as WatchConfigRecord;
  forgetWatchPagesDraft(libraryDraftKey(ref));
  takeWatchPagesRecord(libraryDraftKey(ref), document, 7);
  el.hass = HASS;
  el.selectedPageId = PAGE;
  el.selectedTileId = selectedTile;
  el.renderRoot = { activeElement: null, querySelector: () => null };
  return el;
}

function inspector(el: Editor): unknown {
  const page = el.currentPage()!;
  const tile = el.selectedTileId === undefined ? undefined : (page.items as WatchPageTile[]).find((t) => t.id === el.selectedTileId);
  return el.renderInspector(page, tile, [page]);
}

/** The head's markup, from its row to the top card's first part, or to the
 * cards on a tile with no part up there. */
function head(el: Editor): string {
  const text = flat(inspector(el));
  const from = text.indexOf(`<div class="ts-head ts-root"`);
  const part = text.indexOf(`<section class="ts-sec ts-top-part"`, from);
  return text.slice(from, part >= 0 ? part : text.indexOf(`<div class="ts-groups">`, from));
}

function hostOf(el: Editor): TileSettingsHost {
  const page = el.currentPage()!;
  return el.tileSettingsHost(page, (page.items as WatchPageTile[]).find((t) => t.id === DIMMER)!)!;
}

function memoryStorage() {
  const data: Record<string, string> = {};
  return {
    getItem: (key: string) => (Object.hasOwn(data, key) ? data[key]! : null),
    setItem: (key: string, value: string) => { data[key] = String(value); },
    removeItem: (key: string) => { delete data[key]; },
  };
}

beforeEach(() => {
  vi.stubGlobal("localStorage", memoryStorage());
});
afterEach(() => {
  vi.unstubAllGlobals();
});

/** A stand-in element: `closest` answers by the selectors it is inside. */
function inside(...selectors: { sel: string; data?: Record<string, string> }[]): Element {
  return {
    closest(sel: string) {
      const hit = selectors.find((s) => s.sel === sel);
      return hit === undefined ? null : { dataset: hit.data ?? {} };
    },
  } as unknown as Element;
}

describe("what the tile controls", () => {
  it("names the entity by its friendly name, its area and its id, on a row that a click changes", () => {
    const text = flat(inspector(editor(hallPage(), DIMMER)));
    const shows = text.slice(text.indexOf(`data-part=entity`));
    expect(shows).toContain(`<div class="ts-top-lab"><span>Controls</span></div>`);
    expect(shows).toContain(`<div class="ts-entity-pick">`);
    expect(shows).toMatch(/<button type="button" class="ent-pick"[^>]*>.*<span class="ent-name">Smart Plug Dimmer<\/span>\s*<span class="ent-area">Office<\/span>\s*<span class="ent-id mono">light\.smart_plug_dimmer<\/span>/s);
    // A tile always shows an entity, so its row has no x.
    expect(shows.slice(0, shows.indexOf(`</section>`))).not.toContain(`class="ent-clear"`);
  });

  it("keeps the words of a tile with no entity", () => {
    expect(head(editor(hallPage(), SPACER))).toContain(`<span class="ts-head-none">No entity</span>`);
  });
});

describe("the head's row", () => {
  it("draws the way back, the Name, the changed line, then Duplicate, Copy look, Paste look and Delete, and no facts", () => {
    const text = head(editor(hallPage(), DIMMER));
    const order = [`class="pe-path-back"`, `aria-label="Name"`, `class="ts-head-changed"`, "pe-strip-dup", "pe-strip-copy", "pe-strip-paste", "pe-strip-del pe-del-tile"].map((m) => text.indexOf(m));
    expect(order.every((at) => at >= 0)).toBe(true);
    expect(order).toEqual([...order].sort((a, b) => a - b));
    for (const gone of ["ts-pill", "ts-head-pills", "pe-head-pic", "pe-tile-screens"]) expect(text, gone).not.toContain(gone);
  });

  it("stands above the top card's parts", () => {
    const text = flat(inspector(editor(hallPage(), DIMMER)));
    const top = text.slice(text.indexOf(`<section class="ts-top" `));
    expect(top.indexOf(`class="ts-head ts-root"`)).toBeGreaterThan(-1);
    expect(top.indexOf(`class="ts-head ts-root"`)).toBeLessThan(top.indexOf("data-part=entity"));
  });

  it("presses Delete through the page editor, for the tile it is on", () => {
    const el = editor(hallPage(), DIMMER);
    const deleted: unknown[] = [];
    el["deleteTile"] = (id: unknown) => deleted.push(id);
    click(inspector(el), "pe-strip-del pe-del-tile");
    expect(deleted).toEqual([DIMMER]);
  });
});

describe("going to a setting", () => {
  it("finds its section in the settings, scrolls to it and washes it, whatever card it stands in", () => {
    const el = editor(hallPage(), DIMMER);
    const flashed: string[] = [];
    const scrolled: string[] = [];
    const section = (part: string) => ({
      scrollIntoView() { scrolled.push(part); }, offsetWidth: 0, querySelector: () => null,
      classList: { add: (c: string) => flashed.push(c), remove() {} },
    });
    const insp = { querySelector: (sel: string) => /data-part="(\w+)"/.exec(sel)?.[1] === "border" || sel.includes(`"entity"`) ? section(sel.includes("border") ? "border" : "entity") : null };
    el.renderRoot = { activeElement: null, querySelector: (sel: string) => (sel === ".pe-tile-insp .ts-insp" ? insp : null) };
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const go = el["goToSetting"] as (this: unknown, part: string) => void;
    go.call(el, "entity");
    go.call(el, "border");
    expect(scrolled).toEqual(["entity", "border"]);
    expect(flashed).toEqual(["pe-found", "pe-found"]);
    // A part the tile does not have goes nowhere.
    go.call(el, "state");
    expect(scrolled).toEqual(["entity", "border"]);
  });
});

describe("the Watch and iPhone chips", () => {
  it("stand in the Where it shows card, not in the head, with no line saying a tile is the same on every device", () => {
    const el = editor(hallPage(), DIMMER);
    const text = flat(inspector(el));
    const where = text.slice(text.indexOf(`<section class="ts-grp" data-group=where `));
    const on = where.indexOf(`<div class="pe-tile-screens" role="group" aria-label=Tile on>`);
    expect(on).toBeGreaterThan(-1);
    expect(text.slice(0, text.indexOf(`<section class="ts-grp" data-group=where `))).not.toContain("pe-tile-screens");
    const line = where.slice(on);
    expect(line).toContain(`<span class="lt-lead">Tile on</span>`);
    expect([...line.matchAll(/<span class="lt-name">([^<]+)<\/span>/g)].map((m) => m[1])).toEqual(["Watch", "iPhone"]);
    expect(text).not.toContain("Same on every device");
    expect(text).not.toContain("ts-head-applies");
    // A smart page fills itself, a map page is drawn whole: no chips.
    const screens = el["renderTileScreens"] as (this: unknown, page: WatchPage, tile: WatchPageTile) => unknown;
    const smart = { ...hallPage(), dynamicConfig: { rules: [] } } as WatchPage;
    expect(screens.call(el, smart, (smart.items as WatchPageTile[])[0]!)).toBe(nothing);
  });
});

describe("the head's changed line", () => {
  it("counts the parts the groups count, then Reset all, which is off at the defaults", () => {
    const plain = editor(hallPage(), DIMMER);
    expect(tileHeadChangedCount(hostOf(plain))).toBe(0);
    expect(head(plain)).toMatch(/<div class="ts-head-changed">\s*<button type="button" class="link ts-reset-btn" \?disabled=true/);
    const changed = editor(hallPage({ borderStyle: "line", iconSizeOverride: 30 } as Partial<WatchPageTile>), DIMMER);
    expect(tileHeadChangedCount(hostOf(changed))).toBe(2);
    expect(head(changed)).toMatch(/<i aria-hidden="true"><\/i><span>2 changed<\/span>\s*<button type="button" class="link ts-reset-btn" \?disabled=false[^>]*>Reset all<\/button>/);
  });
});

describe("the head's tile and the settings", () => {
  it("stand every section for a part of the tile", () => {
    for (const [part] of TILE_INSPECTOR_PARTS) expect(TILE_HEAD_PART_OF[part], part).toBeDefined();
    expect(TILE_HEAD_PART_OF.icon).toBe("icon");
    expect(TILE_HEAD_PART_OF.iconLook).toBe("icon");
    expect(TILE_HEAD_PART_OF.tap).toBe("tile");
    expect(TILE_HEAD_PART_OF.fill).toBe("tile");
    expect(TILE_HEAD_PART_OF.text).toBe("name");
    expect(TILE_HEAD_PART_OF.state).toBe("state");
    expect(TILE_HEAD_PART_OF.background).toBe("tile");
    expect(TILE_HEAD_PART_OF.visibility).toBe("tile");
  });

  it("light the part a row under the pointer stands for: its own mark first, then its section's, nothing outside the settings", () => {
    const groups = { sel: ".ts-insp" };
    expect(tileHeadPartAt(inside(groups, { sel: ".ts-sec[data-part]", data: { part: "icon" } }))).toBe("icon");
    expect(tileHeadPartAt(inside(groups, { sel: ".ts-sec[data-part]", data: { part: "tap" } }))).toBe("tile");
    expect(tileHeadPartAt(inside(groups, { sel: ".ts-sec[data-part]", data: { part: "text" } }))).toBe("name");
    expect(tileHeadPartAt(inside(groups, { sel: "[data-tile-part]", data: { tilePart: "bar" } }, { sel: ".ts-sec[data-part]", data: { part: "state" } }))).toBe("bar");
    expect(tileHeadPartAt(inside(groups, { sel: ".ts-sec[data-part]", data: { part: "border" } }))).toBe("tile");
    expect(tileHeadPartAt(inside(groups, { sel: ".ts-kind" }))).toBe("tile");
    expect(tileHeadPartAt(inside(groups))).toBeUndefined();
    expect(tileHeadPartAt(inside({ sel: ".ts-sec[data-part]", data: { part: "icon" } }))).toBeUndefined();
    expect(tileHeadPartAt(null)).toBeUndefined();
  });

  it("draw a box on the stage over each part One Look lays out, each going to its section", () => {
    const el = editor(hallPage(), DIMMER);
    const page = el.currentPage()!;
    const input = { page, pages: [page], screen: { width: 200, height: 240 }, states: HASS.states };
    const draw = el["renderStageHeadParts"] as (this: unknown, tile: WatchPageTile, cell: { width: number; height: number }, input: unknown, unit: number, s: number) => unknown;
    const text = flat(draw.call(el, (page.items as WatchPageTile[])[0]!, { width: 90, height: 60 }, input, 1, 2));
    for (const part of ["icon", "name", "state"]) expect(text).toMatch(new RegExp(`<span class="pe-hp" data-head-part=${part} aria-hidden="true"`));
    // While a tile is dragged, no boxes.
    el["gesture"] = { started: true, kind: "move" };
    expect(draw.call(el, (page.items as WatchPageTile[])[0]!, { width: 90, height: 60 }, input, 1, 2)).toBe(nothing);
    el["gesture"] = undefined;
    const went: string[] = [];
    const go = el["goToHeadPart"] as (this: unknown, part: string) => void;
    el["goToSetting"] = (part: string, within?: unknown) => went.push(`${part}${within === undefined ? "" : " card"}`);
    go.call(el, "name");
    go.call(el, "bar");
    go.call(el, "tile");
    expect(went).toEqual(["text", "state card", "color"]);
  });

  it("find the part under a click on the selected tile, the last drawn on top, none on its bare ground", () => {
    const el = editor(hallPage(), DIMMER);
    const box = (part: string, left: number, right: number) => ({
      dataset: { headPart: part },
      getBoundingClientRect: () => ({ left, right, top: 0, bottom: 100 }),
    });
    const button = { querySelectorAll: () => [box("bar", 0, 50), box("state", 20, 50)] } as unknown as HTMLElement;
    const at = el["headPartAtClick"] as (this: unknown, button: HTMLElement, e: unknown) => string | undefined;
    expect(at.call(el, button, { clientX: 30, clientY: 10 })).toBe("state");
    expect(at.call(el, button, { clientX: 10, clientY: 10 })).toBe("bar");
    expect(at.call(el, button, { clientX: 90, clientY: 10 })).toBeUndefined();
  });

  it("light the bar for a row of the State section's State bar card, the state for its other cards", () => {
    // The card the table names for the bar's rows.
    const light = { id: DIMMER, entityId: "light.smart_plug_dimmer" } as WatchPageTile;
    expect(watchTileStateCards(light).find((c) => c.id === "bar")?.title).toBe(STATE_BAR_CARD_TITLE);
    const card = (title: string) => ({ querySelector: (sel: string) => (sel === ".ts-sub-h" ? { textContent: ` ${title} ` } : null) });
    const row = (title: string) => ({
      closest: (sel: string) => (sel === ".ts-insp" ? {} : sel === ".ts-sec[data-part]" ? { dataset: { part: "state" } } : sel === ".ts-group" ? card(title) : null),
    }) as unknown as Element;
    expect(tileHeadPartAt(row(STATE_BAR_CARD_TITLE))).toBe("bar");
    expect(tileHeadPartAt(row("State text"))).toBe("state");
    // A press on the bar goes to that card inside the State section.
    const bar = card(STATE_BAR_CARD_TITLE);
    const section = { querySelectorAll: () => [card("State text"), bar] } as unknown as HTMLElement;
    expect(TILE_HEAD_GOES_TO.bar.within!(section)).toBe(bar);
  });

  /** A row of the settings under the pointer, in the part named. */
  const rowIn = (part: string): Element => {
    (globalThis as { Element?: unknown }).Element ??= class {};
    const El = (globalThis as unknown as { Element: new () => Element }).Element;
    return Object.assign(new El(), {
      closest: (sel: string) => (sel === ".ts-insp" ? {} : sel === ".ts-sec[data-part]" ? { dataset: { part } } : sel === `.ts-sec[data-part="${part}"]` ? {} : null),
    });
  };

  it("mark the lit part on the selected tile's box on each picture, without a redraw", () => {
    const el = editor(hallPage(), DIMMER);
    const boxes = [{ dataset: {} as Record<string, string> }, { dataset: {} as Record<string, string> }];
    el.renderRoot = { activeElement: null, querySelector: () => null, querySelectorAll: (sel: string) => (sel === ".pe-tile.sel" ? boxes : []) };
    const hover = el["onInspectorHover"] as (e: unknown) => void;
    const leave = el["onInspectorLeave"] as () => void;
    hover({ target: rowIn("icon") });
    expect(boxes.map((b) => b.dataset["lit"])).toEqual(["icon", "icon"]);
    leave();
    expect(boxes.map((b) => b.dataset["lit"])).toEqual([undefined, undefined]);
  });

  it("try the tile off on the stage while the pointer is on When it is off, and only then", () => {
    const el = editor(hallPage(), DIMMER);
    el.renderRoot = { activeElement: null, querySelector: () => null, querySelectorAll: () => [] };
    const hover = el["onInspectorHover"] as (e: unknown) => void;
    const leave = el["onInspectorLeave"] as () => void;
    hover({ target: rowIn("whenOff") });
    expect(el["hoverState"]).toEqual({ entityId: "light.smart_plug_dimmer", state: "off" });
    hover({ target: rowIn("glow") });
    expect(el["hoverState"]).toBeUndefined();
    hover({ target: rowIn("whenOff") });
    leave();
    expect(el["hoverState"]).toBeUndefined();
    // A state the Live strip is trying stays through a hover over another row.
    el["hoverState"] = { entityId: "light.smart_plug_dimmer", state: "on" };
    hover({ target: rowIn("glow") });
    expect(el["hoverState"]).toEqual({ entityId: "light.smart_plug_dimmer", state: "on" });
  });
});

describe("a tile's look", () => {
  const FULL: WatchPageTile = {
    ...DIMMER_TILE,
    color: "#FF0000", iconSizeOverride: 30, iconShadow: true, iconGlow: { mode: "off" }, dimWhenOff: false, iconTapAnimation: "bounce",
    labelFontSizeOverride: 14, labelFontWeight: "bold", labelFontDesign: "serif", labelShadow: false, labelColorHex: "#00FF00",
    stateValueLabelStyle: "Pill", borderStyle: "line", backgroundPattern: "dots", arrange: { v: 1, parts: { icon: { dx: 0.1 } } },
    icon: "star.circle", iconPhotoId: "photo-1", iconPhotoLook: "clear", stateIcons: { on: "bolt" }, stateColors: { on: "#0000FF" },
    singleTapAction: "openControl", requiresConfirmation: true, hideWhenInactive: true,
  };
  const NEVER = ["id", "entityId", "gridCol", "gridRow", "colSpan", "rowSpan", "icon", "iconPhotoId", "iconPhotoLook", "customLabel", "stateIcons", "stateColors", "singleTapAction", "requiresConfirmation", "hideWhenInactive", "showLabel"];

  it("carries color, glow, text look, state, border, background and arrange", () => {
    const look = watchTileLookOf(FULL);
    expect(look).toMatchObject({
      color: "#FF0000", iconSizeOverride: 30, iconShadow: true, iconGlow: { mode: "off" }, dimWhenOff: false, iconTapAnimation: "bounce",
      labelFontSizeOverride: 14, labelFontWeight: "bold", labelFontDesign: "serif", labelShadow: false, labelColorHex: "#00FF00",
      stateValueLabelStyle: "Pill", borderStyle: "line", backgroundPattern: "dots", arrange: { v: 1, parts: { icon: { dx: 0.1 } } },
    });
  });

  it("never carries the tile's icon, photo, name, state icons and colors, what it does, its entity or its place", () => {
    const look = watchTileLookOf(FULL);
    for (const key of NEVER) {
      expect(Object.keys(look), key).not.toContain(key);
      expect(watchTileLookKeys(), key).not.toContain(key);
    }
    // Nor any other key of the tile's entity.
    expect(watchTileLookKeys().filter((k) => /entity/i.test(k))).toEqual([]);
  });

  it("holds only what the tile holds, as a copy of its own", () => {
    expect(watchTileLookOf({ id: DIMMER, entityId: "light.a" } as WatchPageTile)).toEqual({});
    const look = watchTileLookOf(FULL);
    (look["iconGlow"] as { mode: string }).mode = "on";
    expect(FULL.iconGlow).toEqual({ mode: "off" });
  });

  it("goes on another tile with that tile's own icon, name, tap and place kept", () => {
    const other: WatchPageTile = { id: SPACER, entityId: "light.b", gridCol: 6, gridRow: 2, colSpan: 3, rowSpan: 2, icon: "bolt", customLabel: "B", singleTapAction: "toggle", stateIcons: { off: "moon" } };
    const next = watchTileWithLook(other, watchTileLookOf(FULL));
    expect(next).toMatchObject({ id: SPACER, entityId: "light.b", gridCol: 6, gridRow: 2, colSpan: 3, rowSpan: 2, icon: "bolt", customLabel: "B", singleTapAction: "toggle", stateIcons: { off: "moon" } });
    expect(next).toMatchObject({ color: "#FF0000", borderStyle: "line", arrange: { v: 1, parts: { icon: { dx: 0.1 } } } });
    expect(next.iconPhotoId).toBeUndefined();
  });

  it("takes a key off that the look does not hold, but puts a required one back at its default", () => {
    const next = watchTileWithLook(FULL, {});
    // Required: the phone and the watch refuse a whole page without them.
    for (const key of ["iconShadow", "labelShadow", "iconTapAnimation", "stateValueLabelStyle"]) {
      expect(requiredTileKeyDefault(key), key).toBeDefined();
      expect(next[key], key).toEqual(requiredTileKeyDefault(key));
    }
    expect(next.labelFontWeight).toBe(requiredTileKeyDefault("labelFontWeight"));
    // Not required: gone.
    for (const key of ["color", "iconSizeOverride", "iconGlow", "dimWhenOff", "labelColorHex", "arrange"]) {
      expect(requiredTileKeyDefault(key), key).toBeUndefined();
      expect(Object.keys(next), key).not.toContain(key);
    }
    // And what is the tile's own stays.
    expect(next.icon).toBe("star.circle");
    expect(next.singleTapAction).toBe("openControl");
  });
});

describe("Copy look and Paste look", () => {
  /** Press the `@click` bound right after `marker` in any template. */
  const press = (root: unknown, marker: string): void => {
    for (const t of templates(root)) {
      let text = "";
      for (let i = 0; i < t.values.length; i++) {
        text += t.strings[i]!;
        const v = t.values[i];
        if (text.includes(marker) && typeof v === "function" && t.strings[i]!.trimEnd().endsWith("@click=")) {
          (v as () => void)();
          return;
        }
        text += flat(v);
      }
    }
    throw new Error(`no @click after ${marker}`);
  };
  const OTHER = "C3A0E000-0000-4000-8000-0000000000C3";
  const twoLights = () => ({
    ...hallPage({ color: "#FF0000", borderStyle: "line" } as Partial<WatchPageTile>),
    items: [
      { ...DIMMER_TILE, color: "#FF0000", borderStyle: "line" },
      { ...DIMMER_TILE, id: OTHER, entityId: "light.other", gridRow: 4, icon: "bolt", customLabel: "Other" },
    ],
  }) as WatchPage;
  const pasteOf = (text: string): string => text.slice(text.indexOf("pe-strip-paste"), text.indexOf(">Paste look<"));

  it("has Paste look off until a look is copied, then on, on any tile of the page", () => {
    const el = editor(twoLights(), DIMMER);
    expect(pasteOf(head(el))).toContain("?disabled=true");
    expect(pasteOf(head(el))).toContain("title=Copy a tile's look first");
    press(inspector(el), "pe-strip-copy");
    expect(pasteOf(head(el))).toContain("?disabled=false");
    el.selectedTileId = OTHER;
    expect(pasteOf(head(el))).toContain("?disabled=false");
  });

  it("gives the tile the copied look as one edit, keeping its own icon, name and entity", () => {
    const el = editor(twoLights(), DIMMER);
    press(inspector(el), "pe-strip-copy");
    el.selectedTileId = OTHER;
    press(inspector(el), "pe-strip-paste");
    const other = (el.currentPage()!.items as WatchPageTile[]).find((t) => t.id === OTHER)!;
    expect(other).toMatchObject({ color: "#FF0000", borderStyle: "line", icon: "bolt", customLabel: "Other", entityId: "light.other", gridRow: 4 });
  });

  it("presses to nothing while nothing is copied", () => {
    const el = editor(twoLights(), DIMMER);
    const before = el.currentPage();
    press(inspector(el), "pe-strip-paste");
    expect(el.currentPage()).toBe(before);
  });
});
