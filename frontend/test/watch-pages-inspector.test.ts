// The page editor's inspector column, the complication editor's: the sticky
// head with the breadcrumb (the page, the selected tile's kind chip and
// name) and Collapse all, the pinned Name card, and the section cards with
// their badges and changed dots, for a tile and for the page itself.
//
// No DOM: the element's `renderInspector` is drawn to its Lit templates and
// read as text, and its buttons are pressed by calling the handler the
// template holds for them.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { SECTION_COLOR } from "../src/kinds.js";
import { uiIcon } from "../src/ui-icons.js";
import type { TileSettingsHost } from "../src/watch-pages/editor-host.js";
import { FOLD_STORE_KEY } from "../src/watch-pages/fold-memory.js";
import { takeWatchPagesRecord } from "../src/watch-pages/kept.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { WATCH_PAGE_CHIP_COLOR, WATCH_PAGE_SECTION_BADGES, watchPageSectionChanged } from "../src/watch-pages/page-settings.js";
import { SMART_SECTION_BADGE } from "../src/watch-pages/smart-settings.js";
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
  tileSettingsHost(page: WatchPage, tile: WatchPageTile): TileSettingsHost | undefined;
  currentPage(): WatchPage | undefined;
  selectedTileId?: string;
};

let watchSeq = 0;

/** A page editor holding `page`, with a host to edit through: Home
 * Assistant's states, and a record and draft of its own. */
function editor(page: WatchPage, selectedTile?: string): Editor {
  const Ctor = customElements.get("wa-page-editor") as unknown as new () => Editor;
  const el = new Ctor();
  const watchId = `inspector-test-${++watchSeq}`;
  const document = { schemaVersion: 1, pages: [page] } as unknown as WatchPagesDocument;
  el.owners = [{ owner_watch_id: watchId, device_name: "Apple Watch", device_kind: "watch", paired_iphone_name: null } as unknown as OwnerSummary];
  el.watchId = watchId;
  el.record = {
    kind: "pages", revision: 7, hash: null, updated_at: "2026-10-03T11:55:00Z", updated_by: "panel",
    delivered_revision: 7, delivered_at: null, document: document as unknown as Record<string, unknown>,
  } as WatchConfigRecord;
  takeWatchPagesRecord(watchId, document, 7);
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
  it("reads the page, the tile's kind in its color, and the tile's name", () => {
    const text = flat(inspector(editor(hallPage(), DIMMER)));
    const head = text.slice(text.indexOf(`<div class="insp-head">`), text.indexOf(`<div class="insp-body">`));
    expect(head).toContain(`<button class="root" title="Edit the page"`);
    expect(head).toMatch(/>Hall<\/button><span class="sep">›<\/span><span class="kchip"/);
    expect(head).toContain(`<span class="kchip" style=--k:${watchTileKindColor("light")}>Light</span>`);
    expect(head).toContain(`<span class="nm" title=Smart Plug Dimmer>Smart Plug Dimmer</span>`);
    expect(head).not.toContain("Show the page");
  });

  it("goes back to the page's own cards from its root", () => {
    // Leaving a tile ends a drag on one of its numbers, at the window.
    vi.stubGlobal("window", { addEventListener() {}, removeEventListener() {} });
    const el = editor(hallPage(), DIMMER);
    click(inspector(el), `title="Edit the page"`);
    expect(el.selectedTileId).toBeUndefined();
    const text = flat(inspector(el));
    expect(text).toContain(`<span class="kchip" style=--k:${WATCH_PAGE_CHIP_COLOR}>Page</span><span class="nm" title=Hall>Hall</span>`);
    expect(text).not.toContain(`class="root"`);
    expect(text).toContain("<h4>Theme");
  });

  it("gives each family of tile its own chip color, grey for the rest", () => {
    expect(watchTileKindColor("light")).not.toBe(watchTileKindColor("switch"));
    expect(watchTileKindColor("script")).toBe(watchTileKindColor("automation"));
    expect(watchTileKindColor("page")).toBe(watchTileKindColor("cover"));
    expect(watchTileKindColor("macro")).toBe(watchTileKindColor("http_action"));
    expect(watchTileKindColor("vacuum")).toBe(watchTileKindColor("webhook_inbox"));
  });
});

describe("Collapse all", () => {
  it("folds every card of the tile, then Expand all opens them again, and the folds are kept", () => {
    const el = editor(hallPage(), DIMMER);
    const before = flat(inspector(el));
    expect(before).toContain(">Collapse all</button>");
    expect(before).not.toContain("data-open=false");
    expect(before.match(/data-open=true/g)?.length).toBe(7);

    click(inspector(el), ">Collapse all<");
    const folded = flat(inspector(el));
    expect(folded).toContain(">Expand all</button>");
    expect(folded).not.toContain("data-open=true");
    expect(folded.match(/data-open=false/g)?.length).toBe(7);
    // The pinned Name card has no fold.
    expect(folded).toContain(`<section class="sec name-sec" data-open="true"`);
    // Across a reload too.
    expect(Object.keys(JSON.parse(storage.data[FOLD_STORE_KEY]!))).toEqual(
      ["action", "background", "border", "icon", "size", "state", "text"].map((s) => `tile-settings:${s}`),
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

  it("turns the page's cards with no tile selected", () => {
    const el = editor(hallPage());
    click(inspector(el), ">Collapse all<");
    expect(JSON.parse(storage.data[FOLD_STORE_KEY]!)).toEqual(Object.fromEntries(
      ["background", "page", "switcher", "theme", "title"].map((s) => [`page-settings:${s}`, true]),
    ));
  });
});

// ── the cards ────────────────────────────────────────────────────────────

describe("the tile's cards", () => {
  it("pin the Name card with the label's box first, then Size, then the tile's sections", () => {
    const text = flat(inspector(editor(hallPage(), DIMMER)));
    const body = text.slice(text.indexOf(`<div class="insp-body">`));
    const titles = [...body.matchAll(/<h4>([^<]+)/g)].map((m) => m[1]);
    expect(titles).toEqual(["Name", "Size", "Icon and color", "State", "Text", "Border", "Action", "Background"]);
    const name = card(body, "Name");
    expect(name).toContain(`class="sec name-sec"`);
    expect(name).toContain(`aria-label="Label"`);
    expect(name).toContain("light.smart_plug_dimmer");
    // The label is the Name card's alone.
    expect(card(body, "Text")).not.toContain(`aria-label="Label"`);
    expect(card(body, "Size")).toContain(`class="pe-fields"`);
    expect(body).toContain("Delete tile");
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
    const content: WatchTileSettingsSection[] = ["opens", "target", "request", "macro", "header", "special"];
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

describe("the page's cards", () => {
  it("are Name, Page, Theme, Background, Page title and the switcher, then the line and Delete page", () => {
    const text = flat(inspector(editor(hallPage())));
    const body = text.slice(text.indexOf(`<div class="insp-body">`));
    expect([...body.matchAll(/<h4>([^<]+)/g)].map((m) => m[1])).toEqual(["Name", "Page", "Theme", "Background", "Page title", "In the page switcher"]);
    expect(card(body, "Name")).toContain(`aria-label="Page name"`);
    const page = card(body, "Page");
    expect(page).toContain("Hidden on the watch");
    expect(page).toContain("Smart Page");
    expect(page).toContain("2 tiles, 4 rows");
    expect(body).toContain("Select a tile to edit it, or add one.");
    expect(body.indexOf("Delete page…")).toBeGreaterThan(body.indexOf("<h4>In the page switcher"));
  });

  it("badge each card", () => {
    const text = flat(inspector(editor(hallPage())));
    expect(card(text, "Name")).toContain(`--c:${SECTION_COLOR.place}`);
    const expected: [string, keyof typeof WATCH_PAGE_SECTION_BADGES, string, Parameters<typeof uiIcon>[0]][] = [
      ["Page", "page", SECTION_COLOR.content, "content"],
      ["Theme", "theme", SECTION_COLOR.look, "look"],
      ["Background", "background", SECTION_COLOR.look, "shape"],
      ["Page title", "title", SECTION_COLOR.numbers, "text"],
      ["In the page switcher", "switcher", SECTION_COLOR.content, "watch"],
    ];
    for (const [title, key, color, icon] of expected) {
      expect(WATCH_PAGE_SECTION_BADGES[key]).toEqual({ color, icon });
      expect(card(text, title), title).toContain(`--c:${color}`);
      expect(card(text, title), title).toContain(swatch(icon));
    }
  });

  it("on a smart page add the Smart page and Rules cards in the Rules color, and the rule's own", () => {
    const text = flat(inspector(editor(smartHall())));
    expect(text).toContain(`>Smart page</span><span class="nm" title=Hall>Hall</span>`);
    const titles = [...text.matchAll(/<h4>([^<]+)/g)].map((m) => m[1]);
    expect(titles.slice(0, 7)).toEqual(["Name", "Page", "Smart Page", "Theme", "Background", "Page title", "In the page switcher"]);
    expect(titles.slice(7)).toEqual(["Rules", "Header", "Icon and color", "State", "Text", "Border", "Action", "Size", "Background"]);
    for (const title of ["Smart Page", "Rules", "Header"]) {
      expect(card(text, title), title).toContain(`--c:${SMART_SECTION_BADGE.color}`);
      expect(card(text, title), title).toContain(swatch("states"));
    }
    expect(text).not.toMatch(/\d tiles?, \d rows?/);
    expect(text).toContain("A smart page fills itself from its rules");
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
    expect(watchTileSectionChanged(tileHost({ ...DIMMER_TILE, hideWhenInactive: true }), "action")).toBe(true);
    expect(watchTileSectionChanged(tileHost({ ...DIMMER_TILE, singleTapAction: "openControl" }), "action")).toBe(true);
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
    const page = flat(inspector(editor(hallPage({ switcherText: "Hall" }))));
    expect(card(page, "In the page switcher")).toContain("sec-dot");
    expect(card(page, "Theme")).not.toContain("sec-dot");
  });

  it("the page's switcher and theme: not for stored defaults, yes for a value of the page's own", () => {
    expect(watchPageSectionChanged(hallPage(), "switcher")).toBe(false);
    expect(watchPageSectionChanged(hallPage({ switcherText: "Hall" }), "switcher")).toBe(true);
    expect(watchPageSectionChanged(hallPage({ hideFromSwitcher: true }), "switcher")).toBe(true);
    expect(watchPageSectionChanged(hallPage({ useGradientColors: true }), "theme")).toBe(true);
    expect(watchPageSectionChanged(hallPage(), "page")).toBe(false);
    expect(watchPageSectionChanged(hallPage({ isHidden: true }), "page")).toBe(true);
  });
});
