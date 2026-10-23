// The page editor's inspector column, the complication editor's: the sticky
// head with the breadcrumb (Page back to the page, the selected tile's kind
// chip and name) and Collapse all, the pinned Name card, and the section
// cards with their badges and changed dots for a tile. With no tile
// selected, the page's own settings: the On each device card, the Look card
// and the On the watch card, a line saying how to reach a tile, and Delete
// page. The editor holds the page in the library, its only mode.
//
// No DOM: the element's `renderInspector` is drawn to its Lit template and
// read as text, and its buttons are pressed by calling the handler the
// template holds for them.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { SECTION_COLOR } from "../src/kinds.js";
import { uiIcon } from "../src/ui-icons.js";
import type { TileSettingsHost } from "../src/watch-pages/editor-host.js";
import { FOLD_STORE_KEY } from "../src/watch-pages/fold-memory.js";
import { libraryDraftKey } from "../src/library/item-mode.js";
import { forgetWatchPagesDraft, takeWatchPagesRecord } from "../src/watch-pages/kept.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { WATCH_PAGE_CHIP_COLOR, watchPageSectionChanged } from "../src/watch-pages/page-settings.js";
import { resetWatchPage } from "../src/watch-pages/page-settings-model.js";
import { SMART_SECTION_BADGE } from "../src/watch-pages/smart-settings.js";
import { watchPageSwitcherChanged } from "../src/watch-pages/switcher-settings.js";
import { watchThemeDisplayName } from "../src/watch-pages/tile-new.js";
import { watchTileSectionChanged } from "../src/watch-pages/tile-settings.js";
import {
  WATCH_NAME_BADGE,
  WATCH_TILE_SECTION_BADGES,
  WATCH_TILE_SETTINGS_SECTION_TITLES,
  type WatchTileSettingsSection,
  watchTileKindColor,
} from "../src/watch-pages/tile-settings-options.js";
import "../src/watch-pages/page-editor.js";

// The views ask for the focused field (`document.activeElement`); Node has
// no document.
(globalThis as { document?: unknown }).document ??= { activeElement: null };
(globalThis as { HTMLElement?: unknown }).HTMLElement ??= class {};
(globalThis as { HTMLInputElement?: unknown }).HTMLInputElement ??= class {};

// ── reading templates ────────────────────────────────────────────────────

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}

function isTpl(node: unknown): node is Tpl {
  return typeof node === "object" && node !== null && "strings" in node && "values" in node;
}

/** A template flattened to its markup, values in place (a bound attribute
 * comes out unquoted). */
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

/** The `@click` handler of the smallest template whose text holds `marker`
 * and binds a click itself. */
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

/** The section cards of a markup, each from its opening tag on. */
function cards(text: string): string[] {
  return text.split(/(?=<section class=")/).filter((c) => c.startsWith(`<section class="`));
}

/** The one card whose title is `title`. */
function card(text: string, title: string): string {
  const found = cards(text).filter((c) => c.includes(`<h4>${title}<`));
  if (found.length !== 1) throw new Error(`${found.length} cards titled ${title}`);
  return found[0]!;
}

const swatch = (icon: Parameters<typeof uiIcon>[0]) => `<span class="swatch">${flat(uiIcon(icon))}</span>`;

// ── the editor ───────────────────────────────────────────────────────────

const PAGE = "C3A0E000-0000-4000-8000-0000000000B1";
const DIMMER = "C3A0E000-0000-4000-8000-0000000000C1";
const SPACER = "C3A0E000-0000-4000-8000-0000000000C2";

/** A light tile as the iPhone app saves one: most keys at their defaults. */
const DIMMER_TILE: WatchPageTile = {
  id: DIMMER, entityId: "light.smart_plug_dimmer", gridCol: 0, gridRow: 0, colSpan: 6, rowSpan: 4,
  customLabel: "Smart Plug Dimmer", showLabel: true, labelShadow: true, labelFontWeight: "light",
  iconShadow: false, iconTapAnimation: "replace",
};

const SPACER_TILE: WatchPageTile = { id: SPACER, entityId: `spacer.${SPACER}`, gridCol: 6, gridRow: 0, colSpan: 6, rowSpan: 2, showLabel: false };

function hallPage(extra: Record<string, unknown> = {}): WatchPage {
  return {
    id: PAGE, name: "Hall", items: [DIMMER_TILE, SPACER_TILE], groups: [],
    themeOverride: "neonLagoon", useGradientColors: false, hideFromSwitcher: false, ...extra,
  } as WatchPage;
}

function smartHall(): WatchPage {
  return {
    id: PAGE, name: "Hall", items: [], groups: [],
    dynamicConfig: {
      liveUpdates: false, pullToRefresh: true, refreshOnAppear: false, sortOrder: "domain",
      tileColSpan: 4, tileRowSpan: 3, tileShowLabel: true,
      rules: [{ id: "11111111-0000-4000-8000-000000000001", domain: "light", mode: "all", entityIds: [], header: "label", headerLabel: "Lights" }],
    },
  } as WatchPage;
}

const STATES = {
  "light.smart_plug_dimmer": { entity_id: "light.smart_plug_dimmer", state: "on", attributes: { friendly_name: "Smart Plug Dimmer" } },
};

type Editor = Record<string, unknown> & {
  renderInspector(page: WatchPage, tile: WatchPageTile | undefined, pages: readonly WatchPage[]): unknown;
  onKeyDown(e: unknown): void;
  tileSettingsHost(page: WatchPage, tile: WatchPageTile): TileSettingsHost | undefined;
  currentPage(): WatchPage | undefined;
  refuseGesture(reason: string): void;
  selectedTileId?: string;
};

let watchSeq = 0;

/** A page editor holding `page` in the library, previewed on a watch, with
 * a host to edit through: Home Assistant's states, and a record and draft
 * of its own. */
function editor(page: WatchPage, selectedTile?: string): Editor {
  const Ctor = customElements.get("wa-page-editor") as unknown as new () => Editor;
  const el = new Ctor();
  const watchId = `inspector-test-${++watchSeq}`;
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
  el.hass = { states: STATES, entities: {} };
  el.selectedPageId = PAGE;
  el.selectedTileId = selectedTile;
  // Not connected: the selection's blur reads the render root.
  el.renderRoot = { activeElement: null, querySelector: () => null };
  return el;
}

/** The inspector as drawn now, for the selected tile or the page. */
function inspector(el: Editor): unknown {
  const page = el.currentPage()!;
  const tile = el.selectedTileId === undefined ? undefined : (page.items as WatchPageTile[]).find((t) => t.id === el.selectedTileId);
  return el.renderInspector(page, tile, [page]);
}

/** One heading's part of the Look card: from its heading to the next. */
function lookPart(text: string, section: "theme" | "background" | "title"): string {
  const look = card(text, "Look");
  const start = look.indexOf(`data-section=${section}>`);
  if (start < 0) throw new Error(`no ${section} in Look`);
  const next = look.indexOf(`<div class="ts-sub-h ps-sub-h"`, start);
  return look.slice(start, next < 0 ? undefined : next);
}

function memoryStorage() {
  const data: Record<string, string> = {};
  return {
    data,
    getItem: (key: string) => (Object.hasOwn(data, key) ? data[key]! : null),
    setItem: (key: string, value: string) => { data[key] = String(value); },
    removeItem: (key: string) => { delete data[key]; },
  };
}

let storage: ReturnType<typeof memoryStorage>;
beforeEach(() => {
  storage = memoryStorage();
  vi.stubGlobal("localStorage", storage);
});
afterEach(() => {
  vi.unstubAllGlobals();
});

// ── the head ─────────────────────────────────────────────────────────────

describe("the breadcrumb", () => {
  it("reads Page to go back, the tile's kind in its color, and the tile's name", () => {
    const text = flat(inspector(editor(hallPage(), DIMMER)));
    const head = text.slice(text.indexOf(`<div class="insp-head">`), text.indexOf(`<div class="insp-body">`));
    expect(head).toMatch(/<button type="button" class="pe-back" title="Back to the page's settings"[^>]*>.*<span>Page<\/span><\/button>\s*<div class="crumbs"><span class="kchip"/s);
    expect(head).not.toContain(`class="root"`);
    expect(head).toContain(`<span class="kchip" style=--k:${watchTileKindColor("light")}>Light</span>`);
    expect(head).toContain(`<span class="nm" title=Smart Plug Dimmer>Smart Plug Dimmer</span>`);
    expect(head).not.toContain("Show the page");
  });

  it("goes back to the page's own cards from Page", () => {
    // Leaving a tile ends a drag on one of its numbers, at the window.
    vi.stubGlobal("window", { addEventListener() {}, removeEventListener() {} });
    const el = editor(hallPage(), DIMMER);
    click(inspector(el), `class="pe-back"`);
    expect(el.selectedTileId).toBeUndefined();
    const text = flat(inspector(el));
    expect(text).toContain(`<span class="kchip" style=--k:${WATCH_PAGE_CHIP_COLOR}>Page</span><span class="nm" title=Hall>Hall</span>`);
    expect(text).not.toContain("pe-back");
    expect(text).toContain("<h4>Look");
  });

  it("has no Page | Tile switch: the page's settings show while no tile is selected", () => {
    for (const tile of [DIMMER, undefined]) {
      const text = flat(inspector(editor(hallPage(), tile)));
      expect(text).not.toContain("insp-tabs");
      expect(text).not.toContain(`role="tab"`);
    }
  });

  it("gives each family of tile its own chip color, grey for the rest", () => {
    expect(watchTileKindColor("light")).not.toBe(watchTileKindColor("switch"));
    expect(watchTileKindColor("script")).toBe(watchTileKindColor("automation"));
    expect(watchTileKindColor("page")).toBe(watchTileKindColor("cover"));
    expect(watchTileKindColor("vacuum")).toBe(watchTileKindColor("webhook_inbox"));
  });
});

describe("Collapse all", () => {
  it("folds every card of the tile, then Expand all opens them again, and the folds are kept", () => {
    const el = editor(hallPage(), DIMMER);
    const before = flat(inspector(el));
    expect(before).toContain(">Collapse all</button>");
    expect(before).not.toContain("data-open=false");
    expect(before.match(/data-open=true/g)?.length).toBe(8);

    click(inspector(el), ">Collapse all<");
    const folded = flat(inspector(el));
    expect(folded).toContain(">Expand all</button>");
    expect(folded).not.toContain("data-open=true");
    expect(folded.match(/data-open=false/g)?.length).toBe(8);
    // The pinned Name card has no fold.
    expect(folded).toContain(`<section class="sec name-sec" data-open="true"`);
    // Across a reload too.
    expect(Object.keys(JSON.parse(storage.data[FOLD_STORE_KEY]!))).toEqual(
      ["action", "background", "border", "icon", "size", "state", "text", "visibility"].map((s) => `tile-settings:${s}`),
    );

    click(inspector(el), ">Expand all<");
    const opened = flat(inspector(el));
    expect(opened).toContain(">Collapse all</button>");
    expect(opened).not.toContain("data-open=false");
    expect(Object.hasOwn(storage.data, FOLD_STORE_KEY)).toBe(false);
  });

  it("with one card left open, still collapses rather than expands", () => {
    const el = editor(hallPage(), DIMMER);
    click(inspector(el), ">Collapse all<");
    click(inspector(el), "<h4>Text");
    const text = flat(inspector(el));
    expect(text.match(/data-open=true/g)?.length).toBe(1);
    expect(text).toContain(">Collapse all</button>");
  });

  it("turns the page's On each device, Look, On the watch and In the page switcher cards with no tile selected", () => {
    const el = editor(hallPage());
    click(inspector(el), ">Collapse all<");
    expect(Object.keys(JSON.parse(storage.data[FOLD_STORE_KEY]!))).toEqual(["page-settings:devices", "page-settings:look", "page-settings:switcher", "page-settings:watch"]);
    const folded = flat(inspector(el));
    expect(folded).not.toContain("data-open=true");
    // Folded, each card says what it holds.
    expect(card(folded, "Look")).toContain(`<span class="sum">${watchThemeDisplayName("neonLagoon")}, None, Hidden</span>`);
    expect(card(folded, "On the watch")).toContain(`<span class="sum">Shown</span>`);
    expect(folded).toContain("<h4>In the page switcher");
  });

  it("turns the smart page's cards and the page's own with no tile selected", () => {
    const el = editor(smartHall());
    click(inspector(el), ">Collapse all<");
    const folded = Object.keys(JSON.parse(storage.data[FOLD_STORE_KEY]!));
    expect(folded).toContain("smart:rules");
    expect(folded).toContain("smart:header");
    expect(folded).toContain("page-settings:look");
    expect(folded).toContain("page-settings:watch");
    expect(folded).not.toContain("smart:page");
  });
});

// ── the cards ────────────────────────────────────────────────────────────

describe("the tile's cards", () => {
  it("pin the Name card with the label's box first, then Size, then the tile's sections", () => {
    const text = flat(inspector(editor(hallPage(), DIMMER)));
    const body = text.slice(text.indexOf(`<div class="insp-body">`));
    const titles = [...body.matchAll(/<h4>([^<]+)/g)].map((m) => m[1]);
    expect(titles).toEqual(["Name", "Size", "Icon and color", "State", "Text", "Border", "Action", "Visibility", "Background"]);
    const name = card(body, "Name");
    expect(name).toContain(`class="sec name-sec"`);
    expect(name).toContain(`aria-label="Label"`);
    expect(name).toContain("light.smart_plug_dimmer");
    // The label is the Name card's alone.
    expect(card(body, "Text")).not.toContain(`aria-label="Label"`);
    // The Size card: the presets, then the boxes folded under a line that
    // says where the tile is.
    const size = card(body, "Size");
    expect(size).toContain(`class="pe-presets"`);
    expect(size).toContain(`class="pe-size-more" aria-expanded=false`);
    expect(size).not.toContain(`class="pe-fields"`);
    expect(size.indexOf("pe-presets")).toBeLessThan(size.indexOf("pe-size-more"));
    expect(body).toContain("Delete tile");
  });

  it("opens the Size card's boxes on the line under the presets, and on their own while a typed number was refused", () => {
    const el = editor(hallPage(), DIMMER);
    el.sizeFieldsOpen = true;
    let size = card(flat(inspector(el)), "Size");
    expect(size).toContain(`class="pe-size-more" aria-expanded=true`);
    expect(size).toContain(`class="pe-fields" id="pe-size-fields"`);
    for (const name of ["Column", "Row", "Width", "Height"]) expect(size).toContain(`<span>${name}</span>`);
    expect(size.indexOf("pe-size-more")).toBeLessThan(size.indexOf("pe-fields"));
    el.sizeFieldsOpen = false;
    el.fieldNote = "That does not fit.";
    size = card(flat(inspector(el)), "Size");
    expect(size).toContain(`class="pe-fields" id="pe-size-fields"`);
    expect(size).toContain("That does not fit.");
    expect(size.indexOf("pe-fields")).toBeLessThan(size.indexOf("pe-warn"));
  });

  it("says why a drag on the stage was refused in the line under the bar, not in the folded Size card", () => {
    const el = editor(hallPage(), DIMMER);
    el.refuseGesture("That size would cover a tile above or beside it, so the tile kept its size.");
    expect(el.fieldNote).toBeUndefined();
    expect(el.note).toEqual({ kind: "warn", text: "That size would cover a tile above or beside it, so the tile kept its size." });
    const size = card(flat(inspector(el)), "Size");
    expect(size).not.toContain(`class="pe-fields"`);
  });

  it("badge each card in the complication editor's colors and glyphs", () => {
    const text = flat(inspector(editor(hallPage(), DIMMER)));
    const expected: [string, string, Parameters<typeof uiIcon>[0]][] = [
      ["Name", SECTION_COLOR.place, "text"],
      ["Size", SECTION_COLOR.position, "place"],
      ["Icon and color", SECTION_COLOR.look, "look"],
      ["State", SECTION_COLOR.states, "states"],
      ["Text", SECTION_COLOR.numbers, "text"],
      ["Border", SECTION_COLOR.look, "shape"],
      ["Action", SECTION_COLOR.tap, "tap"],
      ["Background", SECTION_COLOR.look, "shape"],
    ];
    for (const [title, color, icon] of expected) {
      const c = card(text, title);
      expect(c, title).toContain(`--c:${color}`);
      expect(c, title).toContain(swatch(icon));
    }
  });

  it("keep one badge table: Content for what the tile is about, Look, Extras, States, Tap and Position", () => {
    const content: WatchTileSettingsSection[] = ["opens", "target", "request", "removed", "header", "special"];
    for (const s of content) expect(WATCH_TILE_SECTION_BADGES[s], s).toEqual({ color: SECTION_COLOR.content, icon: "content" });
    expect(WATCH_TILE_SECTION_BADGES.size).toEqual({ color: SECTION_COLOR.position, icon: "place" });
    expect(WATCH_TILE_SECTION_BADGES.icon).toEqual({ color: SECTION_COLOR.look, icon: "look" });
    expect(WATCH_TILE_SECTION_BADGES.background).toEqual({ color: SECTION_COLOR.look, icon: "shape" });
    expect(WATCH_TILE_SECTION_BADGES.border).toEqual({ color: SECTION_COLOR.look, icon: "shape" });
    expect(WATCH_TILE_SECTION_BADGES.text).toEqual({ color: SECTION_COLOR.numbers, icon: "text" });
    expect(WATCH_TILE_SECTION_BADGES.state).toEqual({ color: SECTION_COLOR.states, icon: "states" });
    expect(WATCH_TILE_SECTION_BADGES.action).toEqual({ color: SECTION_COLOR.tap, icon: "tap" });
    expect(WATCH_NAME_BADGE).toEqual({ color: SECTION_COLOR.place, icon: "text" });
    expect(Object.keys(WATCH_TILE_SECTION_BADGES).sort()).toEqual(Object.keys(WATCH_TILE_SETTINGS_SECTION_TITLES).sort());
  });

  it("say what a folded card holds: Size its width and height", () => {
    const el = editor(hallPage(), DIMMER);
    click(inspector(el), ">Collapse all<");
    expect(card(flat(inspector(el)), "Size")).toContain(`<span class="sum">6×4</span>`);
  });

  it("give a spacer no Name card: it has no label", () => {
    const text = flat(inspector(editor(hallPage(), SPACER)));
    expect(text).not.toContain("name-sec");
    expect([...text.matchAll(/<h4>([^<]+)/g)].map((m) => m[1])).toEqual(["Size", "Border", "Background"]);
  });
});

describe("the inspector with no tile", () => {
  it("holds the page's settings: On each device, Look, On the watch, In the page switcher, the line, then Delete page", () => {
    const text = flat(inspector(editor(hallPage())));
    const body = text.slice(text.indexOf(`<div class="insp-body">`));
    expect([...body.matchAll(/<h4>([^<]+)/g)].map((m) => m[1])).toEqual(["On each device", "Look", "On the watch", "In the page switcher"]);
    expect(card(body, "Look")).toContain(`--c:${SECTION_COLOR.look}`);
    expect(card(body, "Look")).toContain(swatch("look"));
    expect(card(body, "On the watch")).toContain(`--c:${SECTION_COLOR.place}`);
    expect(body).not.toContain(`aria-label="Page name"`);
    const order = ["<h4>Look", "<h4>On the watch", "<h4>In the page switcher", "Click a tile on the watch to edit it.", "Delete page"].map((p) => body.indexOf(p));
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(body).not.toContain("above the watch");
    // No duplicate page action exists, so none is offered.
    expect(body).not.toContain("Duplicate page");
  });

  it("says to add a tile on a page with none", () => {
    const text = flat(inspector(editor(hallPage({ items: [] }))));
    expect(text).toContain("No tiles yet.");
    expect(text).toContain("Add a tile</span></button>");
    expect(text).not.toContain("Click a tile on the watch to edit it.");
  });

  it("holds the Smart Page switch in On the watch with its line, and no Hidden: Hide here is each device's own", () => {
    const el = editor(hallPage());
    const watch = card(flat(inspector(el)), "On the watch");
    expect(watch).not.toContain(`<span class="pe-ow-l">Hidden</span>`);
    expect(watch).toContain(`<span class="pe-ow-l">Smart page</span><span class="pe-ow-d">Fills itself from its rules with what is on right now.</span>`);
    expect(watch).not.toContain("sec-dot");
    // The page's own rows of a smart page are not on a plain page.
    expect(watch).not.toContain("Live Updates");
    // A page stored hidden wears the card's dot.
    expect(card(flat(inspector(editor(hallPage({ isHidden: true })))), "On the watch")).toContain(`<h4>On the watch<span class="sec-dot"`);
  });

  it("on a smart page holds the Rules cards in the Rules color, and the rule's own, then the page's own with the smart rows", () => {
    const text = flat(inspector(editor(smartHall())));
    expect(text).toContain(`>Smart page</span><span class="nm" title=Hall>Hall</span>`);
    const titles = [...text.matchAll(/<h4>([^<]+)/g)].map((m) => m[1]);
    expect(titles).toEqual(["On each device", "Rules", "Header", "Icon and color", "State", "Text", "Border", "Action", "Size", "Background", "Look", "On the watch", "In the page switcher"]);
    for (const title of ["Rules", "Header"]) {
      expect(card(text, title), title).toContain(`--c:${SMART_SECTION_BADGE.color}`);
      expect(card(text, title), title).toContain(swatch("states"));
    }
    // The smart page's own rows sit under its switch.
    const watch = card(text, "On the watch");
    expect(watch).toContain(`id="sm-body-page"`);
    expect(watch).toContain("Live Updates");
    expect(watch.indexOf(">Smart page<")).toBeLessThan(watch.indexOf("Live Updates"));
    expect(text).toContain("Click a tile on the watch to pick its rule.");
    expect(text).not.toContain("above the watch");
  });
});

describe("the inspector with several tiles picked", () => {
  /** The hall with both tiles picked by Cmd+A. */
  function pickedHall(): Editor {
    // Picking lets the single tile go, which ends a drag on its numbers at
    // the window.
    vi.stubGlobal("window", { addEventListener() {}, removeEventListener() {} });
    const el = editor(hallPage(), DIMMER);
    el.onKeyDown({ key: "a", defaultPrevented: false, metaKey: true, ctrlKey: false, altKey: false, shiftKey: false,
      composedPath: () => [el], preventDefault() {} });
    return el;
  }

  it("is one card naming the picked tiles, with Duplicate and Delete for all of them", () => {
    const el = pickedHall();
    expect([...(el.multi as ReadonlySet<string>)]).toEqual([DIMMER, SPACER]);
    const text = flat(inspector(el));
    const head = text.slice(text.indexOf(`<div class="insp-head">`), text.indexOf(`<div class="insp-body">`));
    expect(head).toContain(`class="pe-back"`);
    expect(head).toMatch(/<span class="kchip"[^>]*>2 tiles<\/span><span class="nm">Hall<\/span>/);
    expect(head).not.toContain("Collapse all");
    // The picked tiles' card, then the Group card (group-settings.ts).
    expect(cards(text)).toHaveLength(2);
    expect(cards(text)[1]).toContain("<h4>Group<");
    const picked = card(text, "2 tiles picked");
    // Each picked tile, in reading order, with its face, name and kind.
    const rows = [...picked.matchAll(/data-picked-tile=([^\s>]+)/g)].map((m) => m[1]);
    expect(rows).toEqual([DIMMER, SPACER]);
    expect(picked).toContain(`<span class="thumb pe-thumb pe-tile-thumb"`);
    expect(picked).toContain(`<span class="nm-t">Smart Plug Dimmer</span></b><small><span class="kind">Light</span>`);
    expect(picked).toContain(`<span class="kind">Spacer</span>`);
    // A second light has nowhere to go; the spacer copies.
    expect(picked).toMatch(/class="pe-btn pe-picked-dup" \?disabled=false title=1 tile of 2 can be copied here; the rest cannot\./);
    expect(picked).toContain("<span>Duplicate 2 tiles</span>");
    expect(picked).toMatch(/class="pe-btn pe-danger pe-picked-del" \?disabled=false/);
    expect(picked).toContain("<span>Delete 2 tiles</span>");
    // None of the single tile's cards.
    expect(text).not.toContain("<h4>Name");
    expect(text).not.toContain("<h4>Size");
  });

  it("deletes both from its Delete, and goes back to the page from Page", () => {
    const el = pickedHall();
    click(inspector(el), `class="pe-back"`);
    expect(el.selectedTileId).toBeUndefined();
    expect((el.multi as ReadonlySet<string>).size).toBe(0);
    // Both buttons are in the card's own template: the click after the
    // Delete button's class is its own.
    const again = pickedHall();
    // Node has no CSS.escape to look a tile's button up by.
    again.tileButton = () => null;
    const t =templates(inspector(again)).find((c) => c.strings.some((s) => s.includes("pe-picked-del")))!;
    const at = t.strings.findIndex((s, i) => s.trimEnd().endsWith("@click=") && t.strings.slice(0, i + 1).join("").includes("pe-picked-del"));
    (t.values[at] as () => void)();
    expect(again.currentPage()!.items).toEqual([]);
  });

  it("makes a group of touching tiles, shows its look, and ungroups it", () => {
    const el = pickedHall();
    let text = flat(inspector(el));
    let group = card(text, "Group");
    expect(group).toContain("A group draws one background pattern and one effect across its tiles.");
    expect(group).toMatch(/class="pe-btn pe-group-make" \?disabled=false/);
    click(inspector(el), "pe-group-make");
    const page = el.currentPage()!;
    const groups = page.groups as Record<string, unknown>[];
    expect(groups).toHaveLength(1);
    const id = groups[0]!.id as string;
    expect(id).toBe(id.toUpperCase());
    expect((page.items as WatchPageTile[]).map((t) => t.groupId)).toEqual([id, id]);
    // The pick stays, and the card now edits the group.
    text = flat(inspector(el));
    group = card(text, "Group");
    expect(group).toContain("2 tiles");
    // Named as the tile card names a tile's own: Pattern and Effect, each
    // with its Type.
    expect(group).toContain("<span>Pattern</span>");
    expect(group).toContain("<span>Effect</span>");
    expect(group).not.toContain("Animated overlay");
    expect(group).not.toContain("pe-group-make");
    click(inspector(el), "pe-group-ungroup");
    expect(el.currentPage()!.groups).toEqual([]);
    expect((el.currentPage()!.items as WatchPageTile[]).some((t) => "groupId" in t)).toBe(false);
  });

  it("refuses Make group while the picked tiles do not touch", () => {
    vi.stubGlobal("window", { addEventListener() {}, removeEventListener() {} });
    const el = editor(hallPage({ items: [DIMMER_TILE, { ...SPACER_TILE, gridRow: 6 }] }), DIMMER);
    el.onKeyDown({ key: "a", defaultPrevented: false, metaKey: true, ctrlKey: false, altKey: false, shiftKey: false,
      composedPath: () => [el], preventDefault() {} });
    const group = card(flat(inspector(el)), "Group");
    expect(group).toMatch(/class="pe-btn pe-group-make" \?disabled=true title=Tiles must touch to make a group\./);
    expect(group).toContain(`<p class="hint">Tiles must touch to make a group.</p>`);
  });

  it("says under a grouped tile's name that it is in a group, with Edit group and Leave group", () => {
    const G = "C3A0E000-0000-4000-8000-0000000000D1";
    const look = { backgroundPattern: "dots", backgroundPatternColor: "#FF0000", id: G, overlayColor: "#00FF00", overlayIntensity: 1.5, overlaySize: 1, overlaySpeed: 2, overlayStyle: "snow" };
    const grouped = () => hallPage({ items: [{ ...DIMMER_TILE, groupId: G }, { ...SPACER_TILE, groupId: G }], groups: [look] });
    const el = editor(grouped(), DIMMER);
    const text = flat(inspector(el));
    expect(text).toContain("In a group of 2 tiles");
    vi.stubGlobal("window", { addEventListener() {}, removeEventListener() {} });
    click(inspector(el), "pe-group-edit");
    expect([...(el.multi as ReadonlySet<string>)]).toEqual([DIMMER, SPACER]);
    expect(el.selectedTileId).toBe(DIMMER);
    // Leave group with two in it: the other tile takes the group's look and
    // the group goes, as the phone's Remove did.
    const other = editor(grouped(), DIMMER);
    click(inspector(other), "pe-group-leave");
    const page = other.currentPage()!;
    expect(page.groups).toEqual([]);
    const [dimmer, spacer] = page.items as WatchPageTile[];
    expect("groupId" in dimmer!).toBe(false);
    expect("groupId" in spacer!).toBe(false);
    expect(dimmer!.backgroundPattern).toBeUndefined();
    expect(spacer).toMatchObject({ backgroundPattern: "dots", patternOpacity: 0.5, patternColor: "#FF0000", overlayStyle: "snow", overlayColor: "#00FF00", overlaySpeed: 2, overlayIntensity: 1.5, overlaySize: 1 });
    expect("patternScale" in spacer!).toBe(false);
  });
});

describe("the Look card", () => {
  it("reads Theme, Background and Page title, each under its heading with its own rows", () => {
    const look = card(flat(inspector(editor(hallPage()))), "Look");
    const headings = [...look.matchAll(/<div class="ts-sub-h ps-sub-h" data-section=(\w+)><span>([^<]+)<\/span>/g)].map((m) => [m[1], m[2]]);
    expect(headings).toEqual([["theme", "Theme"], ["background", "Background"], ["title", "Page title"]]);
    for (const section of ["theme", "background", "title"]) {
      expect(look).toContain(`<fieldset class="ts-body" id=ps-body-${section}`);
    }
    expect(look).toContain("Decoration");
    // How the page shows in the page switcher is set in the menu editor.
    expect(look).not.toContain("Switcher");
  });

  it("draws each theme as a picture of three of its colors on its background, its name under it, the page's one picked", () => {
    const theme = lookPart(flat(inspector(editor(hallPage()))), "theme");
    expect(theme).toContain(`aria-label="Page theme"`);
    const buttons = [...theme.matchAll(/<button type="button" role="radio" class="ps-theme ([^"]*)" aria-checked=(\w+) title=([^\n]+)\n\s+style=([^\s>]+)/g)];
    expect(buttons.length).toBe(10);
    for (const [, , , , style] of buttons) expect(style).toMatch(/^--ps-a:[^;]+;--ps-b:[^;]+;--ps-c:[^;]+;--ps-g:/);
    const on = buttons.filter((m) => m[2] === "true");
    expect(on.map((m) => m[1])).toEqual(["on"]);
    expect(on[0]![3]).toBe(watchThemeDisplayName("neonLagoon"));
    expect(theme).toContain(`<span class="ps-theme-nm">${watchThemeDisplayName("neonLagoon")}</span>`);
  });

  it("says a title style and a gradient theme in its summary while folded", () => {
    const el = editor(hallPage({ pageTitleDisplayStyle: "glass", useGradientColors: true }));
    click(inspector(el), "<h4>Look");
    expect(card(flat(inspector(el)), "Look")).toContain(`<span class="sum">${watchThemeDisplayName("neonLagoon")}, gradient, None, Glass</span>`);
  });

  it("ends with Reset page only while the page holds something a reset would change", () => {
    // The page as the phone's reset leaves it: nothing to reset.
    const reset = resetWatchPage({ schemaVersion: 1, pages: [hallPage()] } as unknown as WatchPagesDocument, PAGE);
    const untouched = (reset as unknown as { pages: WatchPage[] }).pages[0]!;
    expect(card(flat(inspector(editor(untouched))), "Look")).not.toContain("Reset page");
    const look = card(flat(inspector(editor(hallPage({ pageTitleDisplayStyle: "glass" })))), "Look");
    expect(look).toContain(`<span class="ps-reset">`);
    expect(look).toContain(">Reset page</button>");
    expect(look.indexOf("Reset page")).toBeGreaterThan(look.indexOf(`id=ps-body-title`));
    // A photo is something a reset changes.
    expect(card(flat(inspector(editor({ ...untouched, backgroundImageId: "preset_waves" } as WatchPage))), "Look")).toContain(">Reset page</button>");
  });

  it("offers Image: the built-in photos and the library from Home Assistant, and a photo's own rows", async () => {
    const sent: string[] = [];
    const connection = {
      sendMessagePromise: async (message: Record<string, unknown>) => {
        sent.push(String(message.type));
        if (message.type === "wrist_assistant/page_images/list") {
          return {
            presets: [{ id: "preset_waves", name: "Waves", width: 208, height: 248 }],
            images: [{ id: "6F1C2D3E-4A5B-4C6D-8E7F-0123456789AB", width: 400, height: 480, bytes: 9000, added_at: "2026-10-04T10:00:00Z", used_by: [] }],
          };
        }
        throw { code: "not_found", message: "No such photo." };
      },
      subscribeMessage: async () => async () => {},
    };
    const el = editor(hallPage({ backgroundImageId: "preset_waves", backgroundImageOpacity: 0.5, backgroundImageBlur: 0, backgroundImageFit: "fit" }));
    el.hass = { states: STATES, entities: {}, connection };
    let text = lookPart(flat(inspector(el)), "background");
    expect(text).not.toContain("set on the phone");
    expect(text).toMatch(/aria-checked=true\s+class=on[^>]*>Image</);
    expect(text).toContain("Opacity");
    expect(text).toContain("Blur");
    expect(text).toContain(">Remove</button>");
    await new Promise((resolve) => setTimeout(resolve, 0));
    text = lookPart(flat(inspector(el)), "background");
    expect(sent).toContain("wrist_assistant/page_images/list");
    expect(text).toContain(`aria-label="Built-in photos"`);
    expect(text).toContain("aria-label=Waves");
    expect(text).toContain("Your photos");
    // A library photo no page names can be deleted; a built-in one cannot.
    expect(text.match(/class="ps-photo-del"/g)?.length).toBe(1);
    expect(text).toContain("Upload a photo");
  });
});

// ── the changed dot ──────────────────────────────────────────────────────

describe("the changed dot", () => {
  function tileHost(tile: WatchPageTile): TileSettingsHost {
    const page = hallPage({ items: [tile] });
    const el = editor(page, tile.id as string);
    return el.tileSettingsHost(el.currentPage()!, tile)!;
  }

  it("Text: not for the iPhone app's stored defaults, yes for a weight, a size or a hidden label of the tile's own", () => {
    expect(watchTileSectionChanged(tileHost(DIMMER_TILE), "text")).toBe(false);
    expect(watchTileSectionChanged(tileHost({ ...DIMMER_TILE, labelFontWeight: "regular" }), "text")).toBe(false);
    expect(watchTileSectionChanged(tileHost({ ...DIMMER_TILE, labelFontWeight: "bold" }), "text")).toBe(true);
    expect(watchTileSectionChanged(tileHost({ ...DIMMER_TILE, labelFontSizeOverride: 12 }), "text")).toBe(true);
    expect(watchTileSectionChanged(tileHost({ ...DIMMER_TILE, showLabel: false }), "text")).toBe(true);
    // The label is the Name card's.
    expect(watchTileSectionChanged(tileHost({ ...DIMMER_TILE, customLabel: "Desk" }), "text")).toBe(false);
  });

  it("Action: only for a stored action that differs from what the watch does without it", () => {
    expect(watchTileSectionChanged(tileHost(DIMMER_TILE), "action")).toBe(false);
    expect(watchTileSectionChanged(tileHost({ ...DIMMER_TILE, singleTapAction: "openControl" }), "action")).toBe(true);
    // Show tile is the Visibility card's now.
    expect(watchTileSectionChanged(tileHost({ ...DIMMER_TILE, hideWhenInactive: true }), "action")).toBe(false);
    expect(watchTileSectionChanged(tileHost({ ...DIMMER_TILE, showWhenTemplate: "{{ true }}" }), "action")).toBe(false);
  });

  it("Visibility: for any Show tile choice but Always, and not for a blank template", () => {
    expect(watchTileSectionChanged(tileHost(DIMMER_TILE), "visibility")).toBe(false);
    expect(watchTileSectionChanged(tileHost({ ...DIMMER_TILE, hideWhenInactive: true }), "visibility")).toBe(true);
    expect(watchTileSectionChanged(tileHost({ ...DIMMER_TILE, hideWhenInactive: false }), "visibility")).toBe(false);
    const showWhen = { comparisonOperator: "eq", entityId: "person.alex", state: "home" };
    expect(watchTileSectionChanged(tileHost({ ...DIMMER_TILE, showWhen }), "visibility")).toBe(true);
    expect(watchTileSectionChanged(tileHost({ ...DIMMER_TILE, showWhenTemplate: "{{ is_state('sun.sun', 'below_horizon') }}" }), "visibility")).toBe(true);
    expect(watchTileSectionChanged(tileHost({ ...DIMMER_TILE, showWhenTemplate: "   " }), "visibility")).toBe(false);
  });

  it("Icon: for a size or shadow of the tile's own, or an icon away from the kind's", () => {
    expect(watchTileSectionChanged(tileHost(DIMMER_TILE), "icon")).toBe(false);
    expect(watchTileSectionChanged(tileHost({ ...DIMMER_TILE, iconSizeOverride: 24 }), "icon")).toBe(true);
    expect(watchTileSectionChanged(tileHost({ ...DIMMER_TILE, iconShadow: true }), "icon")).toBe(true);
    expect(watchTileSectionChanged(tileHost({ ...DIMMER_TILE, icon: "star.circle" }), "icon")).toBe(true);
  });

  it("is drawn on the card, after its title", () => {
    const bold = { ...DIMMER_TILE, labelFontWeight: "bold" };
    const text = flat(inspector(editor(hallPage({ items: [bold] }), DIMMER)));
    expect(card(text, "Text")).toContain(`<h4>Text<span class="sec-dot"`);
    expect(card(text, "Icon and color")).not.toContain("sec-dot");
  });

  it("is drawn on the Look card and beside the heading of each section the page holds its own value in", () => {
    const dotted = (text: string) => [...card(text, "Look").matchAll(/data-section=(\w+)><span>[^<]+<\/span><span class="ps-sub-dot"/g)].map((m) => m[1]);
    const titled = flat(inspector(editor(hallPage({ pageTitleDisplayStyle: "glass" }))));
    expect(dotted(titled)).toEqual(["title"]);
    expect(card(titled, "Look")).toContain(`<h4>Look<span class="sec-dot"`);
    // A switcher value of the page's own marks nothing: it is the menu
    // editor's now (`watchPageSwitcherChanged`).
    const switcher = flat(inspector(editor(hallPage({ switcherText: "Hall" }))));
    expect(dotted(switcher)).toEqual([]);
    expect(card(switcher, "Look")).not.toContain("sec-dot");
    // Theme: not for the watch's fallback theme, yes for another.
    expect(dotted(flat(inspector(editor(hallPage()))))).toEqual([]);
    expect(dotted(flat(inspector(editor(hallPage({ themeOverride: "ember" })))))).toEqual(["theme"]);
  });

  it("the page's switcher and theme: not for stored defaults, yes for a value of the page's own", () => {
    expect(watchPageSwitcherChanged(hallPage())).toBe(false);
    expect(watchPageSwitcherChanged(hallPage({ switcherText: "Hall" }))).toBe(true);
    expect(watchPageSwitcherChanged(hallPage({ hideFromSwitcher: true }))).toBe(true);
    expect(watchPageSectionChanged(hallPage(), "theme")).toBe(false);
    expect(watchPageSectionChanged(hallPage({ useGradientColors: true }), "theme")).toBe(true);
    expect(watchPageSectionChanged(hallPage(), "page")).toBe(false);
    expect(watchPageSectionChanged(hallPage({ isHidden: true }), "page")).toBe(true);
  });
});
