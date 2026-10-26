// The page editor element itself, where it can be read without a page: the
// keys it leaves to a focused field, and the stage's tiles, which stand on
// the page's own background rather than on a patch of its color. Then the
// complication editor's chrome it wears: the Tiles card, the canvas head,
// the Live strip and the zoom. The editor is stood up in library mode, its
// only mode, on one library page.

import { html } from "lit";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { libraryDraftKey } from "../src/library/item-mode.js";
import { REFERENCE_CASE } from "../src/renderer.js";
import { type WatchCatalog, readWatchCatalog } from "../src/watch-pages/catalog.js";
import { type TileSettingsHost, watchKeysTypeText } from "../src/watch-pages/editor-host.js";
import { EDITOR_LEVEL_HINTS, EDITOR_LEVEL_KEY, type EditorLevel, type EditorLevelLink } from "../src/watch-pages/editor-level.js";
import { forgetWatchPagesDraft, takeWatchPagesRecord } from "../src/watch-pages/kept.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { BASE_LAYER_IDS } from "../src/watch-pages/tile-design.js";
import { tileLayerEdits } from "../src/watch-pages/tile-layer-host.js";
import type { TileLayerLinks } from "../src/watch-pages/tile-settings.js";
import { PAGE_LIST_HEIGHT, clampPageListHeight, loadPageListHeight } from "../src/watch-pages/page-editor.js";
import {
  STAGE_ZOOM_KEY,
  loadStageZoom,
  saveStageZoom,
  stageFitZoom,
  stageZoomIn,
  stageZoomLabel,
  stageZoomOut,
} from "../src/watch-pages/stage.js";

function sheet(): string {
  const element = customElements.get("wa-page-editor") as unknown as { styles: unknown };
  const flat = (s: unknown): string => (Array.isArray(s) ? s.map(flat).join("\n") : String((s as { cssText?: string } | undefined)?.cssText ?? ""));
  return flat(element.styles);
}

/** The declarations of the first rule whose selector is exactly `selector`. */
function rule(css: string, selector: string): string {
  const at = css.search(new RegExp(`(^|[}\\s])${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{`));
  if (at < 0) return "";
  const open = css.indexOf("{", at);
  return css.slice(open + 1, css.indexOf("}", open));
}

describe("keys", () => {
  it("leave only text-like fields to themselves; Cmd+Z on a slider or a menu is the editor's", () => {
    for (const type of ["text", "number", "search", ""]) expect(watchKeysTypeText("INPUT", type, false), type).toBe(true);
    expect(watchKeysTypeText("TEXTAREA", undefined, false)).toBe(true);
    expect(watchKeysTypeText("DIV", undefined, true)).toBe(true);
    for (const type of ["range", "color", "checkbox", "radio", "button"]) expect(watchKeysTypeText("INPUT", type, false), type).toBe(false);
    expect(watchKeysTypeText("SELECT", undefined, false)).toBe(false);
    expect(watchKeysTypeText("BUTTON", undefined, false)).toBe(false);
  });
});

describe("the stage", () => {
  it("draws no ground under a tile: the screen's background shows through", () => {
    const tile = rule(sheet(), ".pe-tile");
    expect(tile).toContain("position: absolute");
    expect(tile).toMatch(/background:\s*transparent/);
    expect(sheet()).not.toContain("--pe-base");
  });
});

// ── the chrome ──────────────────────────────────────────────────────────

/** A template flattened to its markup, values in place (a bound attribute
 * comes out unquoted, a boolean as true or false). A `repeat()` is drawn
 * with its own template, so its rows are there too. */
const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  if (v !== null && typeof v === "object" && "_$litDirective$" in v && "values" in v) {
    const [items, second, third] = (v as { values: unknown[] }).values;
    const draw = (third ?? second) as unknown;
    if (Array.isArray(items) && typeof draw === "function") return items.map((item, i) => flat((draw as (x: unknown, i: number) => unknown)(item, i))).join("");
    return "";
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

/** One page whose tiles are stored out of reading order: Gap (row 6),
 * Bottom (row 3), Right (row 0, column 6), Left (row 0, column 0). Left has
 * state icons, Right a tap of its own; Gap is a spacer, which may repeat. */
const HALL: WatchPagesDocument = {
  schemaVersion: 1,
  pages: [
    {
      id: "P-HALL", name: "Hall", items: [
        { id: "T-GAP", entityId: "spacer.5A17E000-0000-4000-8000-0000000000AA", gridRow: 6, gridCol: 0, colSpan: 2, rowSpan: 2, showLabel: false },
        { id: "T-BOTTOM", entityId: "light.bottom", customLabel: "Bottom", gridRow: 3, gridCol: 0, colSpan: 4, rowSpan: 3 },
        { id: "T-RIGHT", entityId: "light.right", customLabel: "Right", gridRow: 0, gridCol: 6, colSpan: 6, rowSpan: 3, singleTapAction: "moreInfo" },
        { id: "T-LEFT", entityId: "switch.left", customLabel: "Left", gridRow: 0, gridCol: 0, colSpan: 6, rowSpan: 3, stateIcons: { on: "bolt.fill" } },
      ],
    },
    { id: "P-YARD", name: "Yard", items: [] },
  ],
} as unknown as WatchPagesDocument;

const WATCHES = [
  { owner_watch_id: "chrome-w1", device_name: "Jesse's Watch", device_kind: "watch", paired_iphone_name: null },
  { owner_watch_id: "chrome-w2", device_name: "Chen's Watch", device_kind: "watch", paired_iphone_name: null },
] as unknown as OwnerSummary[];

let editors = 0;

/** The editor with HALL open in the library, previewed on the first watch,
 * an administrator's hass, and a button for the bar's right end handed in.
 * The draft also holds Yard, an empty page, for the tests that need one. */
function editor(selectedTileId?: string) {
  const watchId = `${WATCHES[0]!.owner_watch_id}-${++editors}`;
  const owners = [{ ...WATCHES[0]!, owner_watch_id: watchId }, WATCHES[1]!] as OwnerSummary[];
  const Ctor = customElements.get("wa-page-editor") as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  el.hass = {
    user: { is_admin: true },
    states: { "light.right": { entity_id: "light.right", state: "on", attributes: { friendly_name: "Right lamp" } } },
  } as unknown as HassLike;
  el.owners = owners;
  const ref = { kind: "pages", id: "P-HALL" };
  el.libraryItem = ref;
  // As `followLibraryItem` leaves it once it opened the item.
  el.openedItem = ref;
  el.watchId = watchId;
  el.record = {
    kind: "pages", revision: 4, hash: null, updated_at: new Date(Date.now() - 2 * 60_000).toISOString(), updated_by: "panel",
    delivered_revision: 4, delivered_at: null, document: HALL,
  } as unknown as WatchConfigRecord;
  el.barActions = html`<button class="tb-btn tb-watch">Watch settings</button>`;
  // The inspector's own markup is not what these tests read, and its field
  // rows ask the document what has focus, which Node does not have.
  el.renderInspector = () => html`<div class="insp-stub"></div>`;
  const key = libraryDraftKey(ref as { kind: "pages"; id: string });
  forgetWatchPagesDraft(key);
  takeWatchPagesRecord(key, HALL, 4);
  el.selectedPageId = "P-HALL";
  el.selectedTileId = selectedTileId;
  // Every row and layer, as the editor drew them before its level switch.
  el.level = "expert";
  return {
    el,
    owners,
    whole: () => flat((el.render as () => unknown).call(el)),
    body: () => flat((el.renderBody as (w: readonly OwnerSummary[]) => unknown).call(el, owners)),
  };
}

/** The markup of the Tiles row for one tile. */
function tileRow(text: string, id: string): string {
  const at = text.search(new RegExp(`data-row-tile=${id}\\s`));
  if (at < 0) return "";
  const start = text.lastIndexOf(`<div class="layer pe-tile-row`, at);
  const next = text.indexOf(`<div class="layer pe-tile-row`, at);
  return text.slice(start, next < 0 ? undefined : next);
}

/** Where each tile's row is in the markup, in the order asked. */
function rowPlaces(text: string, ids: readonly string[]): number[] {
  return ids.map((id) => text.search(new RegExp(`data-row-tile=${id}\\s`)));
}

describe("the Tiles card", () => {
  it("lists the page's tiles in reading order, row then column, with their badges", () => {
    const text = editor().body();
    const card = text.slice(text.indexOf(`class="card lc pe-tiles-card"`));
    expect(card).toContain(`<span class="lc-title">Tiles</span>`);
    const places = rowPlaces(card, ["T-LEFT", "T-RIGHT", "T-BOTTOM", "T-GAP"]);
    expect(places.every((p) => p > -1)).toBe(true);
    expect([...places].sort((a, b) => a - b)).toEqual(places);
    expect(tileRow(card, "T-LEFT")).toContain(">rules</span>");
    expect(tileRow(card, "T-LEFT")).toContain(`<span class="kind">Switch</span> · 6×3</small>`);
    expect(tileRow(card, "T-RIGHT")).toContain(">action</span>");
    expect(tileRow(card, "T-BOTTOM")).not.toContain("badge states");
    expect(tileRow(card, "T-BOTTOM")).not.toContain("badge tap");
    expect(tileRow(card, "T-BOTTOM")).toContain(" · 4×3</small>");
    // Each row has its face in the thumb, and on hover Duplicate and Delete.
    expect(tileRow(card, "T-BOTTOM")).toContain(`<span class="thumb pe-thumb pe-tile-thumb"`);
    expect(tileRow(card, "T-BOTTOM")).toContain(`aria-label=Duplicate Bottom`);
    expect(tileRow(card, "T-BOTTOM")).toContain(`aria-label=Delete Bottom`);
  });

  it("gives a row an arrow when its tile is made of layers, and opens the selected one to list them", () => {
    const text = editor("T-RIGHT").body();
    expect(tileRow(text, "T-LEFT")).toContain(`<span class="pe-caret " aria-hidden="true">`);
    expect(tileRow(text, "T-GAP")).toContain(`<span class="pe-caret none" aria-hidden="true">`);
    expect(text).toContain(`<div class="tl-group" data-layers-of=T-RIGHT>`);
    expect(tileRow(text, "T-RIGHT")).toContain(`<span class="pe-caret open" aria-hidden="true">`);
    expect(text).toMatch(/data-layer-row=BA5E0000-0000-4000-8000-000000000003/);
    expect(text).not.toContain("data-layers-of=T-LEFT");
  });

  it("lights the selected tile's row and no other", () => {
    const text = editor("T-RIGHT").body();
    expect(tileRow(text, "T-RIGHT")).toMatch(/^<div class="layer pe-tile-row hl /);
    expect(tileRow(text, "T-LEFT")).toMatch(/^<div class="layer pe-tile-row  /);
  });

  it("tints the tile on the stage while its row is pointed at, as the complication editor's layers do", () => {
    const { el, body } = editor();
    const row = tileRow(body(), "T-RIGHT");
    expect(row).toContain("@pointerenter=");
    expect(row).toContain("@pointerleave=");
    const peek = el.peekTile as (id: string, on: boolean) => void;
    peek.call(el, "T-RIGHT", true);
    expect(el.rowHoverTileId).toBe("T-RIGHT");
    const text = body();
    expect(text).toMatch(/class="pe-tile [^"]*\bhov\b[^"]*"\s+data-tile=T-RIGHT/);
    expect(text).not.toMatch(/class="pe-tile [^"]*\bhov\b[^"]*"\s+data-tile=T-LEFT/);
    // Another row's leave does not take the tint away; its own does.
    peek.call(el, "T-LEFT", false);
    expect(el.rowHoverTileId).toBe("T-RIGHT");
    peek.call(el, "T-RIGHT", false);
    expect(el.rowHoverTileId).toBeUndefined();
    expect(body()).not.toMatch(/\bhov\b/);
    // The tint is a solid fill and a thin ring, apart from the selection's ring.
    const css = rule(sheet(), ".pe-tile.hov::after");
    expect(css).toContain("inset: 0");
    expect(css).toContain("22%");
    expect(css).toContain("inset 0 0 0 1px");
  });

  it("outlines the row of the tile under the pointer on the stage, and tints that tile", () => {
    const { el, body } = editor();
    const stageTile = (text: string, id: string) => {
      const at = text.search(new RegExp(`data-tile=${id}\\s`));
      return text.slice(text.lastIndexOf(`<button type="button" class="pe-tile`, at), text.indexOf("</button>", at));
    };
    expect(stageTile(body(), "T-RIGHT")).toContain("@pointerenter=");
    expect(stageTile(body(), "T-RIGHT")).toContain("@pointerleave=");
    const peek = el.peekStageTile as (id: string, on: boolean) => void;
    peek.call(el, "T-RIGHT", true);
    const text = body();
    expect(tileRow(text, "T-RIGHT")).toMatch(/^<div class="layer pe-tile-row  peek /);
    expect(tileRow(text, "T-LEFT")).not.toContain("peek");
    expect(text).toMatch(/class="pe-tile [^"]*\bhov\b[^"]*"\s+data-tile=T-RIGHT/);
    peek.call(el, "T-LEFT", false);
    expect(el.stageHoverTileId).toBe("T-RIGHT");
    peek.call(el, "T-RIGHT", false);
    expect(el.stageHoverTileId).toBeUndefined();
    expect(body()).not.toContain("peek");
  });

  it("says a smart page fills itself instead of listing tiles", () => {
    const { el, body } = editor();
    const smart = { ...HALL, pages: [{ id: "P-SMART", name: "Lights on", dynamicConfig: { rules: [] } }] } as unknown as WatchPagesDocument;
    const ref = { kind: "pages" as const, id: "P-SMART" };
    forgetWatchPagesDraft(libraryDraftKey(ref));
    takeWatchPagesRecord(libraryDraftKey(ref), smart, 1);
    el.libraryItem = ref;
    el.selectedPageId = "P-SMART";
    const text = body();
    const card = text.slice(text.indexOf(`class="card lc pe-tiles-card"`));
    expect(card).toContain("A smart page fills itself.");
    expect(card).not.toContain("pe-tile-row");
  });

  it("lists the open page in the Pages card, lit", () => {
    const text = editor().body();
    const card = text.slice(text.indexOf(`class="card lc pe-pages-card`), text.indexOf(`class="card lc pe-tiles-card"`));
    expect(card).toMatch(/class="layer pe-page-row hl [^"]*"\s+data-page=P-HALL/);
  });

  it("puts a drag bar between the Pages and Tiles cards that sets the Pages card's height", () => {
    const e = editor();
    const text = e.body();
    const pagesAt = text.indexOf(`class="card lc pe-pages-card`);
    const barAt = text.indexOf(`class="pe-list-split"`);
    const tilesAt = text.indexOf(`class="card lc pe-tiles-card"`);
    expect(pagesAt).toBeLessThan(barAt);
    expect(barAt).toBeLessThan(tilesAt);
    expect(text).toMatch(/class="pe-list-split" role="separator" aria-orientation="horizontal"/);
    // No height of its own until dragged: the CSS default.
    expect(text).not.toContain("--pe-list-h");
    expect(text).not.toContain("list-set");
    e.el.pageListHeight = 500;
    expect(e.body()).toContain("--pe-list-h:500px;");
    expect(e.body()).toMatch(/class="layout pe-layout cols-3 list-set"/);
    // Half the column by default; the dragged height once there is one,
    // always leaving the Tiles card room.
    expect(rule(sheet(), ".layout.pe-layout.cols-3 .pe-pages-card")).toContain("max-height: 50%");
    expect(rule(sheet(), ".layout.pe-layout.cols-3.list-set .pe-pages-card")).toMatch(/height:\s*var\(--pe-list-h\)/);
    // The list scrolls inside its card, the Tiles list inside its own.
    expect(rule(sheet(), ".pe-layout.cols-3 > .column.left > .card > .layers")).toMatch(/overflow-y:\s*auto/);
    expect(rule(sheet(), ".layout.pe-layout.cols-1 .pe-list-split")).toContain("display: none");
  });

  it("keeps the page list height within its limits and reads back only a saved number", () => {
    expect(clampPageListHeight(10)).toBe(PAGE_LIST_HEIGHT.min);
    expect(clampPageListHeight(99_999)).toBe(PAGE_LIST_HEIGHT.max);
    expect(clampPageListHeight(300.6)).toBe(301);
    const stored = (value: string | null) => ({ getItem: () => value, setItem: () => {} });
    expect(loadPageListHeight(stored("420"))).toBe(420);
    expect(loadPageListHeight(stored("5"))).toBe(PAGE_LIST_HEIGHT.min);
    for (const value of [null, "", "0", "-3", "junk"]) expect(loadPageListHeight(stored(value))).toBeUndefined();
    expect(loadPageListHeight(undefined)).toBeUndefined();
  });
});

// ── clicks on the rows ──────────────────────────────────────────────────

interface Tpl { strings: readonly string[]; values: unknown[] }

/** The first template in a drawn tree that `match` picks, `repeat()` rows
 * included. */
function findTemplate(v: unknown, match: (t: Tpl) => boolean): Tpl | undefined {
  if (Array.isArray(v)) {
    for (const item of v) {
      const found = findTemplate(item, match);
      if (found) return found;
    }
    return undefined;
  }
  if (v === null || typeof v !== "object") return undefined;
  if ("strings" in v && "values" in v) {
    const t = v as Tpl;
    if (match(t)) return t;
    return findTemplate(t.values, match);
  }
  if ("_$litDirective$" in v && "values" in v) {
    const [items, second, third] = (v as { values: unknown[] }).values;
    const draw = (third ?? second) as unknown;
    if (Array.isArray(items) && typeof draw === "function") return findTemplate(items.map((item, i) => (draw as (x: unknown, i: number) => unknown)(item, i)), match);
  }
  return undefined;
}

/** The listener a template binds to `event` on its outer element. */
function listener(t: Tpl, event: string): (e: Event) => void {
  const at = t.strings.findIndex((s) => s.trimEnd().endsWith(`@${event}=`));
  expect(at, `@${event} bound`).toBeGreaterThan(-1);
  return t.values[at] as (e: Event) => void;
}

/** A node of the composed path, as the row's listener reads it. */
const node = (tagName: string, ...classes: string[]) => ({ tagName, classList: { contains: (c: string) => classes.includes(c) } });

/** A click as the browser hands it to the row: its path runs from what was
 * pressed up through the row to the list. */
function clickOn(row: object, inside: object[]): Event {
  const path = [...inside, row, node("DIV", "layers"), node("SECTION", "card")];
  return { type: "click", target: path[0], currentTarget: row, composedPath: () => path } as unknown as Event;
}

describe("a click on a row", () => {
  /** The drawn row for one tile, or one page, and its click listener. */
  function rowOf(el: Record<string, unknown>, owners: readonly OwnerSummary[], kind: "tile" | "page", id: string) {
    const drawn = (el.renderBody as (w: readonly OwnerSummary[]) => unknown).call(el, owners);
    const lead = kind === "tile" ? `<div class="layer pe-tile-row` : `<div class="layer pe-page-row`;
    const attr = kind === "tile" ? "data-row-tile=" : "data-page=";
    const t = findTemplate(drawn, (c) => c.strings[0]!.includes(lead) && c.values[c.strings.findIndex((s) => s.trimEnd().endsWith(attr))] === id);
    expect(t, `${kind} row ${id}`).toBeDefined();
    return listener(t!, "click");
  }

  it("on a Tiles row's name selects that tile", () => {
    const { el, owners } = editor();
    // Not in a document: there is no focused field to let go of.
    el.leaveTile = () => undefined;
    expect(el.selectedTileId).toBeUndefined();
    const row = node("DIV", "layer", "pe-tile-row");
    rowOf(el, owners, "tile", "T-RIGHT")(clickOn(row, [node("SPAN", "nm-t"), node("B"), node("SPAN", "name")]));
    expect(el.selectedTileId).toBe("T-RIGHT");
    // The thumb and the kind line select too.
    rowOf(el, owners, "tile", "T-LEFT")(clickOn(row, [node("SPAN", "thumb", "pe-thumb")]));
    expect(el.selectedTileId).toBe("T-LEFT");
    rowOf(el, owners, "tile", "T-BOTTOM")(clickOn(row, [node("SPAN", "kind"), node("SMALL"), node("SPAN", "name")]));
    expect(el.selectedTileId).toBe("T-BOTTOM");
  });

  it("on a Tiles row's own Duplicate or Delete does not select it", () => {
    const { el, owners } = editor("T-LEFT");
    el.leaveTile = () => undefined;
    const row = node("DIV", "layer", "pe-tile-row");
    rowOf(el, owners, "tile", "T-RIGHT")(clickOn(row, [node("svg", "ui-icon"), node("BUTTON", "icon"), node("SPAN", "acts"), node("SPAN", "right")]));
    expect(el.selectedTileId).toBe("T-LEFT");
  });

  it("is the row's even inside a button around the list", () => {
    // Only what lies between the press and the row counts: a button outside
    // the row never swallows its click.
    const { el, owners } = editor();
    el.leaveTile = () => undefined;
    const row = node("DIV", "layer", "pe-tile-row");
    const e = clickOn(row, [node("B"), node("SPAN", "name")]);
    const path = [...e.composedPath(), node("BUTTON", "outer")];
    rowOf(el, owners, "tile", "T-GAP")({ ...e, composedPath: () => path } as unknown as Event);
    expect(el.selectedTileId).toBe("T-GAP");
  });

  it("on the open page's own row lets the tile go, so the page's cards show, and not from its buttons", () => {
    const { el, owners } = editor("T-LEFT");
    el.leaveTile = () => undefined;
    const row = node("DIV", "layer", "pe-page-row", "hl");
    rowOf(el, owners, "page", "P-HALL")(clickOn(row, [node("BUTTON", "icon", "pe-more"), node("SPAN", "acts")]));
    expect(el.selectedTileId).toBe("T-LEFT");
    rowOf(el, owners, "page", "P-HALL")(clickOn(row, [node("SPAN", "nm-t"), node("B"), node("SPAN", "name")]));
    expect(el.selectedPageId).toBe("P-HALL");
    expect(el.selectedTileId).toBeUndefined();
  });
});

// ── picking several tiles ───────────────────────────────────────────────

describe("picking several tiles", () => {
  type Mods = { shiftKey?: boolean; metaKey?: boolean; ctrlKey?: boolean };
  type Draft = { document: WatchPagesDocument; canUndo: boolean; undo(): boolean };

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /** The editor, with no focused field to let go of and a stand-in render
   * root, and its clicks and keys. A selection that goes ends a drag on a
   * number at the window, and a key asks whether it was typed in a field. */
  function picker(selectedTileId?: string) {
    vi.stubGlobal("window", { addEventListener() {}, removeEventListener() {} });
    const Element = ((globalThis as { HTMLElement?: unknown }).HTMLElement ?? class {}) as new () => object;
    vi.stubGlobal("HTMLElement", Element);
    vi.stubGlobal("HTMLInputElement", (globalThis as { HTMLInputElement?: unknown }).HTMLInputElement ?? class extends Element {});
    vi.stubGlobal("document", { activeElement: null });
    const made = editor(selectedTileId);
    const { el } = made;
    el.leaveTile = () => undefined;
    el.renderRoot = { activeElement: null, querySelector: () => null };
    // Node has no CSS.escape to look a tile's button up by.
    el.tileButton = () => null;
    return {
      ...made,
      click: (id: string, mods: Mods = {}) =>
        (el.clickTile as (i: string, e: Required<Mods>) => void).call(el, id, { shiftKey: false, metaKey: false, ctrlKey: false, ...mods }),
      picked: () => [...(el.multi as ReadonlySet<string>)],
      draft: () => (el as unknown as { draft: Draft }).draft,
      ids: () => ((el as unknown as { draft: Draft }).draft.document.pages as { items: { id: string }[] }[])[0]!.items.map((t) => t.id),
      call: (name: string, ...args: unknown[]) => (el[name] as (...a: unknown[]) => unknown).call(el, ...args),
    };
  }

  /** The stage's button for one tile, up to its face. */
  const stageTile = (text: string, id: string) => {
    const at = text.search(new RegExp(`data-tile=${id}\\s`));
    return text.slice(text.lastIndexOf(`<button type="button" class="pe-tile`, at), text.indexOf("</button>", at));
  };

  it("adds a tile with Cmd or Ctrl-click, takes it out again, and collapses to one", () => {
    const { el, click, picked } = picker("T-LEFT");
    click("T-BOTTOM", { metaKey: true });
    expect(picked()).toEqual(["T-LEFT", "T-BOTTOM"]);
    expect(el.selectedTileId).toBe("T-BOTTOM");
    click("T-RIGHT", { ctrlKey: true });
    expect(picked()).toEqual(["T-LEFT", "T-BOTTOM", "T-RIGHT"]);
    expect(el.selectedTileId).toBe("T-RIGHT");
    // The primary taken out: the last picked in reading order takes over.
    click("T-RIGHT", { metaKey: true });
    expect(picked()).toEqual(["T-LEFT", "T-BOTTOM"]);
    expect(el.selectedTileId).toBe("T-BOTTOM");
    // Down to one: a plain selection of it.
    click("T-LEFT", { metaKey: true });
    expect(picked()).toEqual([]);
    expect(el.selectedTileId).toBe("T-BOTTOM");
    // Down to none.
    click("T-BOTTOM", { metaKey: true });
    expect(el.selectedTileId).toBeUndefined();
    // From nothing, Cmd-click selects the one.
    click("T-GAP", { metaKey: true });
    expect(picked()).toEqual([]);
    expect(el.selectedTileId).toBe("T-GAP");
  });

  it("picks a run in reading order with Shift-click, from the anchor, and a plain click collapses it", () => {
    const { el, click, picked } = picker("T-RIGHT");
    click("T-GAP", { shiftKey: true });
    expect(picked()).toEqual(["T-RIGHT", "T-BOTTOM", "T-GAP"]);
    expect(el.selectedTileId).toBe("T-RIGHT");
    // The anchor stays: a Shift-click the other way runs from it again.
    click("T-LEFT", { shiftKey: true });
    expect(picked()).toEqual(["T-LEFT", "T-RIGHT"]);
    expect(el.selectedTileId).toBe("T-RIGHT");
    click("T-BOTTOM");
    expect(picked()).toEqual([]);
    expect(el.selectedTileId).toBe("T-BOTTOM");
    // With nothing selected, Shift-click selects the one clicked.
    const other = picker();
    other.click("T-BOTTOM", { shiftKey: true });
    expect(other.el.selectedTileId).toBe("T-BOTTOM");
    expect(other.picked()).toEqual([]);
  });

  it("picks every tile with Select all and with Cmd or Ctrl+A, not from a text field", () => {
    const { el, picked, call } = picker();
    call("selectAll");
    expect(picked()).toEqual(["T-LEFT", "T-RIGHT", "T-BOTTOM", "T-GAP"]);
    call("selectTile", undefined);
    expect(picked()).toEqual([]);
    let prevented = 0;
    const key = (mods: Mods, from: unknown = el) => ({ key: "a", defaultPrevented: false, altKey: false, shiftKey: false, metaKey: false, ctrlKey: false, ...mods,
      composedPath: () => [from, el], preventDefault: () => { prevented++; } });
    // In a text field Cmd+A is the field's own.
    const Input = (globalThis as unknown as { HTMLInputElement: new () => object }).HTMLInputElement;
    call("onKeyDown", key({ metaKey: true }, Object.assign(new Input(), { tagName: "INPUT", type: "text", isContentEditable: false })));
    expect(picked()).toEqual([]);
    expect(prevented).toBe(0);
    call("onKeyDown", key({ metaKey: true }));
    expect(picked()).toHaveLength(4);
    expect(prevented).toBe(1);
    call("selectTile", undefined);
    call("onKeyDown", key({ ctrlKey: true }));
    expect(picked()).toHaveLength(4);
    // A plain "a" picks nothing.
    call("selectTile", undefined);
    call("onKeyDown", key({}));
    expect(picked()).toEqual([]);
    expect(prevented).toBe(2);
    // An empty page has nothing to pick.
    el.selectedPageId = "P-YARD";
    call("selectAll");
    expect(picked()).toEqual([]);
    expect(el.selectedTileId).toBeUndefined();
  });

  it("lights every picked row and rings every picked tile, with no resize handles", () => {
    const { el, body, click } = picker("T-RIGHT");
    expect(body()).toContain(`<div class="pe-sel `);
    click("T-BOTTOM", { metaKey: true });
    const text = body();
    for (const id of ["T-RIGHT", "T-BOTTOM"]) {
      expect(tileRow(text, id), id).toMatch(/^<div class="layer pe-tile-row hl [^"]*\bmulti"/);
      expect(stageTile(text, id), id).toMatch(/class="pe-tile [^"]*\bsel\b[^"]*\bmulti"/);
      expect(stageTile(text, id), id).toContain("aria-pressed=true");
    }
    for (const id of ["T-LEFT", "T-GAP"]) {
      expect(tileRow(text, id), id).toMatch(/^<div class="layer pe-tile-row  /);
      expect(tileRow(text, id), id).not.toMatch(/^<div class="[^"]*\bmulti\b/);
      expect(stageTile(text, id), id).not.toMatch(/\bsel\b/);
    }
    // Only the primary is the current row.
    expect(tileRow(text, "T-BOTTOM")).toContain("aria-current=true");
    expect(tileRow(text, "T-RIGHT")).toContain("aria-current=false");
    expect(text).not.toContain(`<div class="pe-sel `);
    // The canvas head's buttons and the Live strip speak of both.
    expect(text).toContain("aria-label=Duplicate 2 tiles");
    expect(text).toContain("title=Delete 2 tiles (Delete or Backspace)");
    expect(text).toContain(`<span class="vb-empty">2 tiles picked. Pick one to try its states.</span>`);
    // A press on the screen lets them all go.
    el.selectedTileId = "T-BOTTOM";
    (el.selectTile as (id: string | undefined) => void).call(el, undefined);
    expect((el.multi as ReadonlySet<string>).size).toBe(0);
    // The picked row's lit look is the complication editor's.
    const css = rule(sheet(), ".pe-tile-row.multi");
    expect(css).toContain("box-shadow: inset 0 0 0 2px var(--wa-accent)");
  });

  it("deletes every picked tile in one undo step", () => {
    const { el, click, draft, ids, call } = picker("T-LEFT");
    click("T-BOTTOM", { metaKey: true });
    expect(draft().canUndo).toBe(false);
    call("deleteTile");
    expect(ids()).toEqual(["T-GAP", "T-RIGHT"]);
    call("reconcileSelection");
    expect((el.multi as ReadonlySet<string>).size).toBe(0);
    expect(el.selectedTileId).toBeUndefined();
    expect(draft().canUndo).toBe(true);
    draft().undo();
    expect(ids()).toEqual(["T-GAP", "T-BOTTOM", "T-RIGHT", "T-LEFT"]);
    expect(draft().canUndo).toBe(false);
  });

  it("copies the picked tiles that may be copied, in one step, and picks the copies", () => {
    const { el, click, draft, ids, call } = picker("T-GAP");
    // A second light has nowhere to go; the spacer copies.
    click("T-BOTTOM", { metaKey: true });
    call("duplicateTile");
    expect(ids()).toHaveLength(5);
    const copy = ids()[4]!;
    expect(copy).not.toBe("T-GAP");
    expect(el.selectedTileId).toBe(copy);
    expect((el.multi as ReadonlySet<string>).size).toBe(0);
    draft().undo();
    expect(ids()).toHaveLength(4);
    expect(draft().canUndo).toBe(false);
  });

  it("moves every picked tile one step, all or nothing", () => {
    const { click, draft, call } = picker("T-BOTTOM");
    const rows = () => Object.fromEntries((draft().document.pages as { items: { id: string; gridRow: number }[] }[])[0]!.items.map((t) => [t.id, t.gridRow]));
    // The Gap sits right under Bottom: it goes first, so the two do not swap.
    click("T-GAP", { metaKey: true });
    call("nudge", "down");
    expect(rows()).toEqual({ "T-GAP": 7, "T-BOTTOM": 4, "T-RIGHT": 0, "T-LEFT": 0 });
    draft().undo();
    expect(draft().canUndo).toBe(false);
    // Left is at the top already, so Bottom does not move up either.
    click("T-LEFT");
    click("T-BOTTOM", { metaKey: true });
    const before = draft().document;
    call("nudge", "up");
    expect(draft().document).toBe(before);
    expect(draft().canUndo).toBe(false);
  });

  describe("dragged by one of them", () => {
    type Rect = { col: number; row: number; colSpan: number; rowSpan: number };
    type Move = {
      tileId: string; started: boolean; left: number; top: number; rect: Rect;
      cell?: { col: number; row: number }; outcome?: { kind: string };
      group?: { id: string; rect: Rect }[];
    };

    /** The picker, with no screen to measure and no pointer to capture, and a
     * plain press on a tile. */
    function dragger(selectedTileId?: string) {
      const made = picker(selectedTileId);
      const { el } = made;
      el.screenEl = () => null;
      el.capture = () => undefined;
      const press = (id: string, pointerType = "mouse") =>
        made.call("onTilePointerDown", {
          button: 0, isPrimary: true, metaKey: false, ctrlKey: false, shiftKey: false, pointerType, pointerId: 7, clientX: 5, clientY: 5,
          currentTarget: { getBoundingClientRect: () => ({ left: 0, top: 0 }) },
        }, id);
      const gesture = () => el.gesture as Move | undefined;
      /** The pointer has travelled: the grabbed tile is aimed at `cell`. */
      const aim = (cell: { col: number; row: number }) => {
        const g = gesture()!;
        g.started = true;
        g.cell = cell;
        g.outcome = made.call("groupDropOutcome", g, cell) as Move["outcome"];
        return g;
      };
      const rows = () => Object.fromEntries((made.draft().document.pages as { items: { id: string; gridRow: number; gridCol: number }[] }[])[0]!.items.map((t) => [t.id, `${t.gridCol},${t.gridRow}`]));
      return { ...made, press, gesture, aim, rows };
    }

    it("keeps the pick on a plain press of a picked tile and takes every picked tile along", () => {
      const { el, call, press, gesture, picked } = dragger();
      call("selectAll");
      press("T-BOTTOM");
      expect(picked()).toEqual(["T-LEFT", "T-RIGHT", "T-BOTTOM", "T-GAP"]);
      const g = gesture()!;
      expect(g.tileId).toBe("T-BOTTOM");
      expect(g.group).toEqual([
        { id: "T-LEFT", rect: { col: 0, row: 0, colSpan: 6, rowSpan: 3 } },
        { id: "T-RIGHT", rect: { col: 6, row: 0, colSpan: 6, rowSpan: 3 } },
        { id: "T-BOTTOM", rect: { col: 0, row: 3, colSpan: 4, rowSpan: 3 } },
        { id: "T-GAP", rect: { col: 0, row: 6, colSpan: 2, rowSpan: 2 } },
      ]);
      call("endGesture");
      // A press on a tile outside the pick lets the pick go and drags it alone.
      call("selectTile", undefined);
      call("selectTile", "T-LEFT");
      (el.clickTile as (i: string, e: object) => void).call(el, "T-RIGHT", { shiftKey: false, metaKey: true, ctrlKey: false });
      press("T-GAP");
      expect(picked()).toEqual([]);
      expect(el.selectedTileId).toBe("T-GAP");
      expect(gesture()!.group).toBeUndefined();
      call("endGesture");
    });

    it("lets a finger drag a picked tile, and not one outside the pick", () => {
      const { el, call, press, gesture } = dragger("T-LEFT");
      (el.clickTile as (i: string, e: object) => void).call(el, "T-RIGHT", { shiftKey: false, metaKey: true, ctrlKey: false });
      press("T-BOTTOM", "touch");
      expect(gesture()).toBeUndefined();
      press("T-LEFT", "touch");
      expect(gesture()!.group?.map((m) => m.id)).toEqual(["T-LEFT", "T-RIGHT"]);
      call("endGesture");
      // A picked tile no longer leaves a finger to scroll.
      expect(sheet()).not.toMatch(/\.pe-tile\.sel\.multi\s*\{[^}]*touch-action/);
    });

    it("moves every picked tile by the grabbed tile's delta, with a ghost for each, in one undo step", () => {
      const { el, body, call, press, aim, rows, picked, draft } = dragger();
      call("selectAll");
      press("T-LEFT");
      // No delta yet: the same place, no ghosts.
      expect(aim({ col: 0, row: 0 }).outcome!.kind).toBe("same");
      const g = aim({ col: 0, row: 2 });
      expect(g.outcome!.kind).toBe("move");
      g.left = 0;
      g.top = 40;
      const text = body();
      expect(text.match(/class="pe-ghost ok"/g)).toHaveLength(4);
      for (const id of ["T-LEFT", "T-RIGHT", "T-BOTTOM", "T-GAP"]) expect(text, id).toMatch(new RegExp(`class="pe-ghost ok" data-ghost-tile=${id} `));
      // Every picked tile follows the pointer by the same shift.
      const shifts = ["T-LEFT", "T-RIGHT", "T-BOTTOM", "T-GAP"].map((id) => {
        const button = stageTile(text, id);
        expect(button, id).toMatch(/class="pe-tile [^"]*\bmoving\b/);
        return /transform:translate\(([^)]*)\)/.exec(button)?.[1];
      });
      expect(shifts[0]).toBeDefined();
      expect(new Set(shifts).size).toBe(1);
      expect(draft().canUndo).toBe(false);
      call("onPointerUp", { pointerId: 7 });
      expect(rows()).toEqual({ "T-GAP": "0,8", "T-BOTTOM": "0,5", "T-RIGHT": "6,2", "T-LEFT": "0,2" });
      // The pick stays, the grabbed tile its primary; the click the drag ends
      // with is swallowed, so it does not collapse the pick.
      call("reconcileSelection");
      expect(picked()).toEqual(["T-LEFT", "T-RIGHT", "T-BOTTOM", "T-GAP"]);
      expect(el.selectedTileId).toBe("T-LEFT");
      expect(el.swallowTileClick).toBe(true);
      draft().undo();
      expect(rows()).toEqual({ "T-GAP": "0,6", "T-BOTTOM": "0,3", "T-RIGHT": "6,0", "T-LEFT": "0,0" });
      expect(draft().canUndo).toBe(false);
    });

    it("refuses a drop where a picked tile would land on one outside the pick, keeping the pick", () => {
      const { el, body, call, press, aim, picked, draft } = dragger("T-LEFT");
      (el.clickTile as (i: string, e: object) => void).call(el, "T-RIGHT", { shiftKey: false, metaKey: true, ctrlKey: false });
      press("T-RIGHT");
      // One row down puts Left on Bottom: nothing goes, and nothing swaps.
      const g = aim({ col: 6, row: 1 });
      expect(g.outcome!.kind).toBe("none");
      const text = body();
      expect(text.match(/class="pe-ghost no"/g)).toHaveLength(2);
      expect(text).not.toContain("pe-ghost swap");
      const before = draft().document;
      call("onPointerUp", { pointerId: 7 });
      expect(draft().document).toBe(before);
      expect(picked()).toEqual(["T-LEFT", "T-RIGHT"]);
      expect(el.selectedTileId).toBe("T-RIGHT");
    });
  });

  it("offers Select all tiles in the ··· menu while the page has two tiles or more", () => {
    const { el, whole } = picker();
    el.topMenuOpen = true;
    expect(whole()).toMatch(/<button class="row pe-select-all" role="menuitem" \?disabled=false[^>]*>Select all tiles<\/button>/);
    el.selectedPageId = "P-YARD";
    expect(whole()).toMatch(/<button class="row pe-select-all" role="menuitem" \?disabled=true/);
  });

  it("drops a picked tile that went away, and lets the pick go with another page", () => {
    const { el, click, call, picked } = picker("T-LEFT");
    click("T-BOTTOM", { metaKey: true });
    click("T-GAP", { metaKey: true });
    call("deleteTile", "T-GAP");
    call("reconcileSelection");
    expect(picked()).toEqual(["T-LEFT", "T-BOTTOM"]);
    expect(el.selectedTileId).toBe("T-BOTTOM");
    call("selectPage", "P-YARD");
    expect(picked()).toEqual([]);
    expect(el.selectedTileId).toBeUndefined();
  });
});

describe("the stacked layout", () => {
  it("sticks no column, so the inspector never slides over the Tiles card", () => {
    const css = sheet();
    const stacked = rule(css, ".layout.pe-layout.cols-1 > .column.left, .layout.pe-layout.cols-1 > .column.canvas, .layout.pe-layout.cols-1 > .column.inspector");
    expect(stacked).toMatch(/position:\s*static/);
    expect(stacked).toMatch(/max-height:\s*none/);
    // Beside the watch nothing sticks either: each part scrolls in its own box.
    // (Its edge fades, ::before and ::after, still stick inside its box.)
    expect(css).not.toMatch(/\.column\.(left|inspector)\s*\{[^}]*position:\s*sticky/);
    expect(editor().body()).toContain(`<div class="layout pe-layout cols-3"`);
  });
});

describe("the canvas head", () => {
  it("reads page / watch / facts: the page's name to type over, the open watch's name as words, no watch chips", () => {
    const { body } = editor();
    const text = body();
    // The head ends where the stage starts: no page strip between them.
    const stage = text.indexOf(`<div class="stage-area`);
    expect(stage).toBeGreaterThan(text.indexOf(`<div class="cv-head">`));
    expect(text).not.toContain("pe-pstrip");
    const head = text.slice(text.indexOf(`<div class="cv-head">`), stage);
    expect(head).toContain(`class="tb-name-input"`);
    expect(head).toContain(`.value=Hall`);
    expect(head).not.toContain("doc-chip");
    expect(head).toContain(`<span class="cv-shape pe-watch-crumb">Jesse's Watch</span>`);
    expect(head).not.toContain("Chen's Watch");
    expect(head).toContain(`4 tiles · 8 rows · ${REFERENCE_CASE.label}`);
    const parts = [".value=Hall", "pe-watch-crumb", "4 tiles · 8 rows"].map((p) => head.indexOf(p));
    expect([...parts].sort((a, b) => a - b)).toEqual(parts);
    expect(head).toContain(`aria-label="Undo"`);
    expect(head).toContain(`aria-label="Redo"`);
  });

  it("offers Duplicate and Delete for the selected tile only, and Duplicate only where the copy may go", () => {
    const head = (text: string) => text.slice(text.indexOf(`<div class="cv-head">`), text.indexOf(`<div class="stage-area`));
    const none = head(editor().body());
    expect(none).toContain(`?disabled=true title=Select a tile to duplicate it.`);
    expect(none).toMatch(/<button class="cv-act icon danger" \?disabled=true/);
    // A spacer may repeat on a page: it copies.
    const gap = head(editor("T-GAP").body());
    expect(gap).toContain(`?disabled=false title=Duplicate the selected tile`);
    expect(gap).toMatch(/<button class="cv-act icon danger" \?disabled=false/);
    // A page holds one tile per light: a second one has nowhere to go.
    const light = head(editor("T-BOTTOM").body());
    expect(light).toContain(`?disabled=true title=This page already has a tile for that entity.`);
    expect(light).toContain(`title=Delete the selected tile (Delete or Backspace)`);
  });

  it("copies a spacer onto the page and selects the copy", () => {
    const { el } = editor("T-GAP");
    // Not in a document: there is no focused field to let go of.
    el.leaveTile = () => undefined;
    (el.duplicateTile as () => void).call(el);
    const draft = (el as unknown as { draft: { document: WatchPagesDocument } }).draft;
    const items = (draft.document.pages as { id: string; items: { id: string; entityId: string; gridRow: number }[] }[])[0]!.items;
    expect(items).toHaveLength(5);
    const copy = items[4]!;
    expect(copy.id).not.toBe("T-GAP");
    expect(copy.entityId).toMatch(/^spacer\./);
    expect(copy.entityId).not.toBe(items[0]!.entityId);
    expect(el.selectedTileId).toBe(copy.id);
  });
});

/** The state chips in a strip's markup, in order: each one's word and
 * whether it is the kept one. */
function stateChips(strip: string): { word: string; on: boolean }[] {
  return [...strip.matchAll(/<button type="button" class="pe-state-chip (on)?"[^>]*>([^<]*)/g)].map((m) => ({ word: m[2]!, on: m[1] !== undefined }));
}

describe("the Live strip", () => {
  const stripOf = (text: string): string => text.slice(text.indexOf(`<div class="values-foot">`));

  it("names the selected tile and lays out its entity's states, or asks for a tile", () => {
    expect(editor().body()).toContain("Select a tile to try its states here.");
    const strip = stripOf(editor("T-RIGHT").body());
    expect(strip).toContain(`<div class="vchip vpill`);
    expect(strip).toContain(`<b>Right</b>`);
    // A light's states, every one a chip in a row, none kept.
    expect(stateChips(strip)).toEqual(["on", "off", "unavailable", "unknown"].map((word) => ({ word, on: false })));
    expect(strip).not.toContain("<select");
    // Home Assistant's state now is marked.
    expect(strip).toMatch(/title=Home Assistant's state now[^>]*>on<i class="pe-state-live"/);
    expect(strip).toContain(`<span class="live-reset-slot"`);
    // No Live, All on or Testing word, and no button to switch them.
    for (const gone of ["vb-live", "vb-head", "All on", "Show live", "Show all on", "Back to live", "Testing"]) expect(strip, gone).not.toContain(gone);
    // A spacer has no entity to try a state on.
    expect(stripOf(editor("T-GAP").body())).toContain(`<span class="val">No entity</span>`);
  });

  it("previews a hovered state, keeps a clicked one, never in Home Assistant's states, and leaves Live preview alone", () => {
    const { el, body } = editor("T-RIGHT");
    el.liveStates = false;
    const setTestValue = (id: string, value: string | undefined) => (el.setTestValue as (i: string, v: string | undefined) => void).call(el, id, value);
    const previewStates = () => (el.previewStates as () => Record<string, { state: string }>).call(el);
    const testedIds = () => (el.testedIds as () => ReadonlySet<string> | undefined).call(el);
    const strip = (): string => stripOf(body());
    expect(strip()).toContain(`class="vchip vpill ctl pe-states "`);
    expect(testedIds()).toBeUndefined();

    setTestValue("light.right", "off");
    const after = strip();
    expect(stateChips(after).filter((c) => c.on).map((c) => c.word)).toEqual(["off"]);
    expect(after).toContain(`class="vchip vpill ctl pe-states testing"`);
    expect(after).toContain(`<button type="button" class="live-reset" title="Back to Home Assistant's state"`);
    expect(el.liveStates).toBe(false);
    expect(previewStates()["light.right"]!.state).toBe("off");
    expect([...testedIds()!]).toEqual(["light.right"]);
    expect((el.hass as HassLike).states["light.right"]!.state).toBe("on");

    // The chip under the pointer draws over the kept one, and goes with it.
    el.hoverState = { entityId: "light.right", state: "unavailable" };
    expect(previewStates()["light.right"]!.state).toBe("unavailable");
    expect((el.testStates as Map<string, string>).get("light.right")).toBe("off");
    el.hoverState = undefined;
    expect(previewStates()["light.right"]!.state).toBe("off");

    setTestValue("light.right", undefined);
    expect((el.testStates as Map<string, string>).size).toBe(0);
    expect(previewStates()).toBe((el.hass as HassLike).states);
    expect(strip()).not.toContain(`class="live-reset"`);
    expect(el.liveStates).toBe(false);
  });

  it("keeps Home Assistant's own state as a test only while Live preview is off, where it would draw lit", () => {
    const { el } = editor("T-RIGHT");
    const setTestValue = (id: string, value: string | undefined) => (el.setTestValue as (i: string, v: string | undefined) => void).call(el, id, value);
    el.liveStates = true;
    setTestValue("light.right", "on");
    expect((el.testStates as Map<string, string>).size).toBe(0);
    el.liveStates = false;
    setTestValue("light.right", "on");
    expect((el.testStates as Map<string, string>).get("light.right")).toBe("on");
  });
});

describe("the Live preview switch", () => {
  const tools = (text: string): string => text.slice(text.indexOf(`<div class="stage-tools"`), text.indexOf(`<div class="pe-stage-body">`));

  it("is a switch over the stage with an instant hint, off by default, saying what off draws", () => {
    const { el, body } = editor();
    el.liveStates = false;
    const off = tools(body());
    expect(off).toContain(`<label class="pe-switch pe-live pe-tip"`);
    expect(off).toMatch(/data-tip=Live preview: off\.[^>]*everything active/);
    expect(off).toContain(`<input type="checkbox" role="switch"`);
    expect(off).toContain("Live preview</span>");
    expect(off).not.toContain("pe-live-dot");
    expect(off).not.toContain(`class="tb pe-live`);
    el.liveStates = true;
    expect(tools(body())).toMatch(/data-tip=Live preview: on\. The tiles are drawn with Home Assistant's real states/);
  });

  it("lets its hint hang below the tool strip", () => {
    const css = sheet();
    expect(rule(css, ".pe-stage-area > .stage-tools")).toContain("overflow: visible");
    expect(css).toMatch(/\.pe-state-chips\s*\{[^}]*flex-wrap: wrap/);
    expect(css).toMatch(/button\.pe-state-chip\.on\s*\{[^}]*var\(--wa-testing\) 18%/);
  });
});

describe("the zoom", () => {
  it("steps through 100% to 200%, fits at 150% or 125% narrow, and is remembered", () => {
    expect(STAGE_ZOOM_KEY).toBe("wrist-assistant-panel.pages.zoom.v1");
    expect(stageFitZoom(false)).toBe(1.5);
    expect(stageFitZoom(true)).toBe(1.25);
    expect(stageZoomIn(1.5)).toBe(2);
    expect(stageZoomIn(2)).toBe(2);
    expect(stageZoomOut(1.5)).toBe(1.25);
    expect(stageZoomOut(1)).toBe(1);
    expect(stageZoomIn(1.3)).toBe(1.5);
    expect([1, 1.25, 1.5, 2].map(stageZoomLabel)).toEqual(["100%", "125%", "150%", "200%"]);
    const store = new Map<string, string>();
    const storage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => { store.set(k, v); } };
    expect(loadStageZoom(storage)).toBeUndefined();
    saveStageZoom(2, storage);
    expect(store.get(STAGE_ZOOM_KEY)).toBe("2");
    expect(loadStageZoom(storage)).toBe(2);
    saveStageZoom(undefined, storage);
    expect(loadStageZoom(storage)).toBeUndefined();
    store.set(STAGE_ZOOM_KEY, "3");
    expect(loadStageZoom(storage)).toBeUndefined();
  });

  it("changes the stage's scale from the strip's buttons, and Fit goes back", () => {
    const { el, body } = editor();
    const width = (scale: number) => `width:${REFERENCE_CASE.screen.width * scale}px;`;
    let text = body();
    expect(text).toContain(`aria-label=Zoom 150%. Back to fit`);
    expect(text).toContain(">150%</button>");
    expect(text).toContain(width(1.5));
    const setZoom = el.setZoom as (scale: number | undefined) => void;
    setZoom.call(el, stageZoomIn(1.5));
    expect(el.zoom).toBe(2);
    text = body();
    expect(text).toContain(">200%</button>");
    expect(text).toContain(width(2));
    expect(text).toContain(`<button class="tb icon pe-zoom-in" ?disabled=true`);
    expect(text).toContain(`<button class="tb icon pe-zoom-out" ?disabled=false`);
    setZoom.call(el, undefined);
    expect(el.zoom).toBeUndefined();
    expect(body()).toContain(">150%</button>");
  });
});

describe("the pickers' HTTP actions", () => {
  const CATALOG = readWatchCatalog({ httpActions: [
    { id: "4F7A2C1E-9B3D-4E5F-8A6B-1C2D3E4F5A6B", name: "Open Gate" },
    { id: "6A0B3C2D-1E4F-4A5B-9C8D-7E6F5A4B3C2D", name: "Outdoor Temp", hasReply: true },
  ] }, { revision: 2 });
  const PORCH = "A1B2C3D4-0000-4000-8000-0000000000A1";

  it("lead with the home's library once it is read, and fall back to the catalog alone", async () => {
    const { el } = editor();
    el.catalog = CATALOG;
    const picker = () => el.pickerCatalog as WatchCatalog | undefined;
    expect(picker()).toBe(CATALOG);
    let answer: () => Promise<unknown> = async () => ({
      revision: 3,
      document: { actions: [{ id: PORCH, name: "Porch Temp", url: "x" }, { id: "4f7a2c1e-9b3d-4e5f-8a6b-1c2d3e4f5a6b", name: "Gate", url: "" }] },
    });
    el.hass = { user: { is_admin: true }, states: {}, connection: { sendMessagePromise: (m: { type: string }) => (m.type === "wrist_assistant/http_actions/get" ? answer() : Promise.reject(new Error("no"))) } } as unknown as HassLike;
    await (el.loadHttpLibrary as () => Promise<void>).call(el);
    expect(picker()!.httpActions.map((a) => [a.name, a.source, a.needsSetup])).toEqual([
      ["Porch Temp", "home", false], ["Gate", "home", true], ["Outdoor Temp", "iphone", false],
    ]);
    // The same object while nothing changed.
    expect(picker()).toBe(picker());
    // An integration older than the library: the catalog alone again.
    answer = () => Promise.reject(Object.assign(new Error("Unknown command."), { code: "unknown_command" }));
    await (el.loadHttpLibrary as () => Promise<void>).call(el);
    expect(picker()).toBe(CATALOG);
  });
});

// ── the level switch ────────────────────────────────────────────────────

describe("the level switch", () => {
  const NAME_LAYER = BASE_LAYER_IDS.name;

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /** The editor at a level, not in a document, with the Name layer of Right
   * owned (its font size changed in the layer), so Right has layers of its
   * own. */
  function leveled(level: EditorLevel, selectedTileId?: string) {
    vi.stubGlobal("window", { addEventListener() {}, removeEventListener() {} });
    vi.stubGlobal("HTMLElement", (globalThis as { HTMLElement?: unknown }).HTMLElement ?? class {});
    vi.stubGlobal("document", { activeElement: null });
    const made = editor(selectedTileId);
    const { el } = made;
    el.leaveTile = () => undefined;
    el.renderRoot = { activeElement: null, querySelector: () => null };
    el.tileButton = () => null;
    const call = <T>(name: string, ...args: unknown[]): T => (el[name] as (...a: unknown[]) => T).call(el, ...args);
    const page = () => call<WatchPage>("currentPage");
    const tileOf = (id: string) => (page().items as WatchPageTile[]).find((t) => t.id === id)!;
    const host = (id: string) => call<TileSettingsHost>("tileSettingsHost", page(), tileOf(id));
    tileLayerEdits(host("T-RIGHT")).doc((c) => {
      const name = c.elements.find((e) => e.payload.id === NAME_LAYER)!;
      if (name.kind === "text") name.payload.fontSize = 13;
    });
    el.level = level;
    return { ...made, call, page, tileOf, host };
  }

  const head = (text: string) => text.slice(text.indexOf(`<div class="cv-head">`), text.indexOf(`<div class="stage-area`));

  it("sits in the canvas head beside Undo, with Simple, Advanced and Expert, each saying what it shows only as a hover hint", () => {
    const { el, body } = leveled("simple");
    let h = head(body());
    expect(h).toContain(`aria-label="Editor level"`);
    expect(h.match(/role="radio"/g)).toHaveLength(3);
    for (const word of ["Simple", "Advanced", "Expert"]) expect(h).toContain(`>${word}</button>`);
    // No line of its own: each hint is its button's data-tip, shown on hover.
    expect(h).not.toContain("pe-level-hint");
    for (const hint of Object.values(EDITOR_LEVEL_HINTS)) expect(h).toContain(`data-tip=${hint}`);
    expect(h).toMatch(/class=on\s+aria-checked=true data-tip=Name, size, icon, color, state and tap\. No layers\./);
    // The switch just before Undo.
    expect(h.indexOf(`class="seg pe-level"`)).toBeGreaterThan(-1);
    expect(h.indexOf(`class="seg pe-level"`)).toBeLessThan(h.indexOf(`aria-label="Undo"`));
    // The level shown is filled in the accent; the hint appears only on hover or keyboard focus.
    expect(rule(sheet(), ".seg.pe-level button.on")).toContain("background: var(--wa-accent)");
    expect(rule(sheet(), ".seg.pe-level button::after")).toContain("opacity: 0");
    el.level = "expert";
    h = head(body());
    expect(h).toMatch(/class=on\s+aria-checked=true data-tip=Every setting, plus layers/);
  });

  it("is remembered in this browser, and falls back to Simple without storage", () => {
    const store: Record<string, string> = {};
    vi.stubGlobal("localStorage", { getItem: (k: string) => store[k] ?? null, setItem: (k: string, v: string) => { store[k] = v; } });
    const { el, call } = leveled("simple");
    call("setLevel", "advanced");
    expect(el.level).toBe("advanced");
    expect(store[EDITOR_LEVEL_KEY]).toBe("advanced");
    // A new editor in this browser opens at the level picked.
    const fresh = () => new (customElements.get("wa-page-editor") as unknown as new () => Record<string, unknown>)();
    expect(fresh().level).toBe("advanced");
    vi.stubGlobal("localStorage", undefined);
    expect(fresh().level).toBe("simple");
  });

  it("lists no layers below Expert: no arrow, no rules badge, no key, and a tag on a tile with layers of its own", () => {
    for (const level of ["simple", "advanced"] as const) {
      const { body } = leveled(level, "T-RIGHT");
      const text = body();
      expect(text, level).not.toContain("data-layers-of=");
      expect(text).not.toContain("data-layer-row=");
      expect(text).not.toContain("tl-legend");
      expect(tileRow(text, "T-RIGHT")).toContain(`<span class="pe-caret none" aria-hidden="true">`);
      expect(tileRow(text, "T-RIGHT")).toContain(">Custom layers</span>");
      expect(tileRow(text, "T-RIGHT")).not.toContain("changed");
      // Left has state icons: no rules badge below Expert, and no layers of its own.
      expect(tileRow(text, "T-LEFT")).not.toContain(">rules</span>");
      expect(tileRow(text, "T-LEFT")).not.toContain("Custom layers");
      expect(tileRow(text, "T-RIGHT")).toContain(">action</span>");
    }
    const text = leveled("expert", "T-RIGHT").body();
    expect(text).toContain("data-layers-of=T-RIGHT");
    expect(text).toMatch(new RegExp(`data-layer-row=${NAME_LAYER}`));
    expect(tileRow(text, "T-LEFT")).toContain(">rules</span>");
    expect(tileRow(text, "T-RIGHT")).not.toContain("Custom layers");
    expect(tileRow(text, "T-RIGHT")).toContain(" · 1 changed</small>");
  });

  it("moves the tile on a stage drag below Expert, even with a layer picked, and the layer in Expert", () => {
    vi.stubGlobal("CSS", { escape: (s: string) => s });
    const { el, call } = leveled("advanced", "T-RIGHT");
    el.screenEl = () => null;
    el.capture = () => undefined;
    const face = { getBoundingClientRect: () => ({ left: 0, top: 0, width: 120, height: 60 }), querySelector: () => null };
    el.renderRoot = { activeElement: null, querySelector: () => face };
    el.layerPick = { tileId: "T-RIGHT", id: NAME_LAYER };
    const press = () => call("onTilePointerDown", {
      button: 0, isPrimary: true, metaKey: false, ctrlKey: false, shiftKey: false, pointerType: "mouse", pointerId: 7, clientX: 5, clientY: 5,
      currentTarget: face, preventDefault() {}, stopPropagation() {},
    }, "T-RIGHT");
    const gesture = () => el.gesture as { kind: string; layerId?: string } | undefined;
    expect(call("pickedLayerId")).toBeUndefined();
    press();
    expect(gesture()?.kind).toBe("move");
    call("endGesture");
    el.level = "expert";
    expect(call("pickedLayerId")).toBe(NAME_LAYER);
    press();
    expect(gesture()?.kind).toBe("layer");
    expect(gesture()?.layerId).toBe(NAME_LAYER);
    call("endGesture");
  });

  it("draws no layer handles below Expert, and the tile's own resize handles instead", () => {
    const { el, body } = leveled("simple", "T-RIGHT");
    el.layerPick = { tileId: "T-RIGHT", id: NAME_LAYER };
    let text = body();
    expect(text).not.toContain("pe-layer-sel");
    expect(text).toContain(`class="pe-handle `);
    el.level = "expert";
    text = body();
    expect(text).toContain("pe-layer-sel");
    expect(text).not.toContain(`class="pe-handle `);
  });

  it("lets a picked layer go when the level drops below Expert, so the tile's settings show", () => {
    const { el, call } = leveled("expert", "T-RIGHT");
    call("pickLayer", NAME_LAYER);
    expect(call("pickedLayerId")).toBe(NAME_LAYER);
    call("setLevel", "advanced");
    expect(el.layerPick).toBeUndefined();
    expect(call("pickedLayerId")).toBeUndefined();
    // Back at Expert, nothing comes back picked.
    call("setLevel", "expert");
    expect(call("pickedLayerId")).toBeUndefined();
  });

  it("switches to Expert and picks the layer from a Changed in line's link, and to Advanced from a Show", () => {
    const { el, call, host } = leveled("simple", "T-RIGHT");
    const links = (host("T-RIGHT") as unknown as { tileLayers: TileLayerLinks }).tileLayers;
    links.pickLayer("name");
    expect(el.level).toBe("expert");
    expect(call("pickedLayerId")).toBe(NAME_LAYER);
    call("setLevel", "simple");
    (host("T-RIGHT") as unknown as { editorLevel: EditorLevelLink }).editorLevel.show("advanced");
    expect(el.level).toBe("advanced");
  });

  it("leaves out the place row in Simple and the Layers card below Expert", () => {
    const card = (level: EditorLevel) => {
      const { call, page, tileOf } = leveled(level, "T-RIGHT");
      return flat(call("renderTileCard", page(), tileOf("T-RIGHT")));
    };
    const simple = card("simple");
    expect(simple).toContain(`class="pe-presets"`);
    expect(simple).not.toContain("pe-size-more");
    expect(simple).not.toContain("Add layer");
    expect(simple).toContain("Want more?");
    const advanced = card("advanced");
    expect(advanced).toContain("pe-size-more");
    expect(advanced).not.toContain("Add layer");
    expect(advanced).not.toContain("Want more?");
    expect(card("expert")).toContain("Add layer");
  });

  it("never changes the document by switching", () => {
    const { el, call } = leveled("expert", "T-RIGHT");
    const draft = (el as unknown as { draft: { document: WatchPagesDocument } }).draft;
    const before = draft.document;
    for (const level of ["simple", "advanced", "expert", "simple"] as const) call("setLevel", level);
    expect(draft.document).toBe(before);
  });
});
