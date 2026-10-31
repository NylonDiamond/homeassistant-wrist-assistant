// The tile inspector's head (`tile-head.ts`): Shows names the entity by its
// friendly name, area and id; the facts under Name and Shows each go to
// their section; which pages a change reaches; how many parts are changed
// with Reset all; and the head's large tile and the settings talking to
// each other, a row under the pointer lighting its part of the tile and a
// press on a part of the tile going to its section.
//
// No DOM: the page editor's `renderInspector` is drawn to its Lit template
// and read as text; the few DOM reads are answered by small stand-ins.

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
  tileHeadPills,
} from "../src/watch-pages/tile-head.js";
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

/** The head's markup, from its section to the first group. */
function head(el: Editor): string {
  const text = flat(inspector(el));
  return text.slice(text.indexOf(`<section class="ts-head ts-root"`), text.indexOf(`<section class="ts-grp"`));
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

describe("the head's Shows", () => {
  it("names the entity by its friendly name, then in grey its area and its id", () => {
    const shows = head(editor(hallPage(), DIMMER));
    expect(shows).toContain(`<b title=Smart Plug Dimmer>Smart Plug Dimmer</b><small>Office · <code class="ts-head-entity" title=light.smart_plug_dimmer>light.smart_plug_dimmer</code></small>`);
    // A light's entity has no other way to say it here: no Change.
    expect(shows).not.toContain(`class="link ts-head-change"`);
  });

  it("keeps the words of a tile with no entity", () => {
    expect(head(editor(hallPage(), SPACER))).toContain(`<span class="ts-head-none">No entity</span>`);
  });
});

describe("the head's facts", () => {
  it("say what a tap does, each hold and slide direction of its own, when the tile shows and its off look", () => {
    const el = editor(hallPage({ holdSlideActions: ["up", "toggle"], hideWhenInactive: true } as Partial<WatchPageTile>), DIMMER);
    const pills = tileHeadPills(hostOf(el)).map((p) => `${p.label}: ${p.value} > ${p.part}`);
    expect(pills.find((p) => p.startsWith("Tap: "))).toMatch(/> action$/);
    expect(pills).toContain("Hold up: Toggle light > action");
    expect(pills.some((p) => p.startsWith("Hold down"))).toBe(false);
    expect(pills).toContain("Shows: Only while on > visibility");
    expect(pills).toContain("Off look: Dim > whenOff");
  });

  it("are buttons in the head, each going to its section, washed amber", () => {
    const el = editor(hallPage(), DIMMER);
    const text = head(el);
    expect(text).toContain(`<button type="button" class="ts-pill" data-goes=visibility title=Go to Shows when @click=>Shows: <b>Always</b></button>`);
    const flashed: string[] = [];
    const section = {
      scrollIntoView() {}, offsetWidth: 0, querySelector: () => null,
      classList: { add: (c: string) => flashed.push(c), remove() {} },
    };
    const groups = { querySelector: (sel: string) => (sel === `.ts-sec[data-part="visibility"]` ? section : null) };
    el.renderRoot = { activeElement: null, querySelector: (sel: string) => (sel === ".pe-tile-insp .ts-groups" ? groups : null) };
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    click(inspector(el), "data-goes=visibility");
    expect(flashed).toEqual(["pe-found"]);
  });

  it("end with which pages a change reaches, by the kinds of device the page is on", () => {
    const el = editor(hallPage(), DIMMER);
    const applies = el["headAppliesText"] as (this: unknown, page: WatchPage) => string | undefined;
    const lib = (owners: string[]) => ({ index: { pages: new Map([[PAGE.toUpperCase(), { owners }]]) } });
    const devices = [{ ownerId: "W1", name: "Watch", kind: "watch" }, { ownerId: "P1", name: "iPhone", kind: "iphone" }];
    const as = (owners: string[]) => applies.call({ lib: { library: lib(owners) }, libraryItem: { kind: "pages", id: PAGE }, linkDevices: devices }, hallPage());
    expect(as(["W1", "P1"])).toBe("Changes apply to the Watch and iPhone pages");
    expect(as(["P1"])).toBe("Changes apply to the iPhone page");
    expect(as([])).toBeUndefined();
    expect(applies.call({ lib: { library: undefined }, libraryItem: undefined, linkDevices: devices }, hallPage())).toBeUndefined();
  });
});

describe("the head's changed line", () => {
  it("counts the parts the groups count, then Reset all, which is off at the defaults", () => {
    const plain = editor(hallPage(), DIMMER);
    expect(tileHeadChangedCount(hostOf(plain))).toBe(0);
    expect(head(plain)).toMatch(/<div class="ts-head-changed"><span>Default look<\/span>\s*<button type="button" class="link ts-reset-btn" \?disabled=true/);
    const changed = editor(hallPage({ borderStyle: "line", iconSizeOverride: 30 } as Partial<WatchPageTile>), DIMMER);
    expect(tileHeadChangedCount(hostOf(changed))).toBe(2);
    expect(head(changed)).toMatch(/<i aria-hidden="true"><\/i><span>2 changed<\/span>\s*<button type="button" class="link ts-reset-btn" \?disabled=false[^>]*>Reset all<\/button>/);
  });
});

describe("the head's tile and the settings", () => {
  it("stand every section for a part of the tile", () => {
    for (const [part] of TILE_INSPECTOR_PARTS) expect(TILE_HEAD_PART_OF[part], part).toBeDefined();
    expect(TILE_HEAD_PART_OF.icon).toBe("icon");
    expect(TILE_HEAD_PART_OF.text).toBe("name");
    expect(TILE_HEAD_PART_OF.state).toBe("state");
    expect(TILE_HEAD_PART_OF.background).toBe("tile");
    expect(TILE_HEAD_PART_OF.visibility).toBe("tile");
  });

  it("light the part a row under the pointer stands for: its own mark first, then its section's, nothing outside the groups", () => {
    const groups = { sel: ".ts-groups" };
    expect(tileHeadPartAt(inside(groups, { sel: ".ts-sec[data-part]", data: { part: "icon" } }))).toBe("icon");
    expect(tileHeadPartAt(inside(groups, { sel: ".ts-sec[data-part]", data: { part: "text" } }))).toBe("name");
    expect(tileHeadPartAt(inside(groups, { sel: "[data-tile-part]", data: { tilePart: "bar" } }, { sel: ".ts-sec[data-part]", data: { part: "state" } }))).toBe("bar");
    expect(tileHeadPartAt(inside(groups, { sel: ".ts-sec[data-part]", data: { part: "border" } }))).toBe("tile");
    expect(tileHeadPartAt(inside(groups, { sel: ".ts-kind" }))).toBe("tile");
    expect(tileHeadPartAt(inside(groups))).toBeUndefined();
    expect(tileHeadPartAt(inside({ sel: ".ts-sec[data-part]", data: { part: "icon" } }))).toBeUndefined();
    expect(tileHeadPartAt(null)).toBeUndefined();
  });

  it("draw a box over the whole tile and each part One Look lays out, each going to its section", () => {
    const el = editor(hallPage(), DIMMER);
    const text = head(el);
    expect(text).toContain(`<span class="pe-hp" data-head-part=tile aria-hidden="true" title=Go to the tile's settings`);
    for (const part of ["icon", "name", "state"]) expect(text).toContain(`data-head-part=${part} `);
    const went: string[] = [];
    const groups = { querySelector: (sel: string) => (sel.startsWith(".ts-sec") ? { sel } : null) };
    const go = el["goToHeadPart"] as (this: unknown, part: string) => void;
    const self = { inspectorGroupsEl: () => groups, goToSetting: (part: string, within?: unknown) => went.push(`${part}${within === undefined ? "" : " card"}`) };
    go.call(self, "name");
    go.call(self, "bar");
    go.call(self, "tile");
    expect(went).toEqual(["text", "state card", "color"]);
  });

  it("light the bar for a row of the State section's State bar card, the state for its other cards", () => {
    // The card the table names for the bar's rows.
    const light = { id: DIMMER, entityId: "light.smart_plug_dimmer" } as WatchPageTile;
    expect(watchTileStateCards(light).find((c) => c.id === "bar")?.title).toBe(STATE_BAR_CARD_TITLE);
    const card = (title: string) => ({ querySelector: (sel: string) => (sel === ".ts-sub-h" ? { textContent: ` ${title} ` } : null) });
    const row = (title: string) => ({
      closest: (sel: string) => (sel === ".ts-groups" ? {} : sel === ".ts-sec[data-part]" ? { dataset: { part: "state" } } : sel === ".ts-group" ? card(title) : null),
    }) as unknown as Element;
    expect(tileHeadPartAt(row(STATE_BAR_CARD_TITLE))).toBe("bar");
    expect(tileHeadPartAt(row("State text"))).toBe("state");
    // A press on the bar goes to that card inside the State section.
    const bar = card(STATE_BAR_CARD_TITLE);
    const section = { querySelectorAll: () => [card("State text"), bar] } as unknown as HTMLElement;
    expect(TILE_HEAD_GOES_TO.bar.within!(section)).toBe(bar);
  });

  it("mark the lit part on the tile's box, without a redraw", () => {
    const el = editor(hallPage(), DIMMER);
    const pic = { dataset: {} as Record<string, string> };
    el.renderRoot = { activeElement: null, querySelector: (sel: string) => (sel === ".pe-tile-insp .pe-head-pic" ? pic : null) };
    const hover = el["onInspectorHover"] as (e: unknown) => void;
    const leave = el["onInspectorLeave"] as () => void;
    (globalThis as { Element?: unknown }).Element ??= class {};
    const El = (globalThis as unknown as { Element: new () => Element }).Element;
    const row = Object.assign(new El(), { closest: (sel: string) => (sel === ".ts-groups" ? {} : sel === ".ts-sec[data-part]" ? { dataset: { part: "icon" } } : null) });
    hover({ target: row });
    expect(pic.dataset["lit"]).toBe("icon");
    leave();
    expect(pic.dataset["lit"]).toBeUndefined();
  });
});
