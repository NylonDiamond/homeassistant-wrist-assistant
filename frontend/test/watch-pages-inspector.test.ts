// The page editor's inspector column, the complication editor's: the sticky
// head with the breadcrumb (the page, the selected tile's kind chip and
// name) and Collapse all, the pinned Name card, and the section cards with
// their badges and changed dots for a tile. Then the page strip over the
// watch, which holds the page's own settings as chips and popovers.
//
// No DOM: the element's `renderInspector` and `renderPageStrip` are drawn to
// their Lit templates and read as text, and their buttons are pressed by
// calling the handler the template holds for them.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { SECTION_COLOR } from "../src/kinds.js";
import { uiIcon } from "../src/ui-icons.js";
import type { TileSettingsHost } from "../src/watch-pages/editor-host.js";
import { FOLD_STORE_KEY } from "../src/watch-pages/fold-memory.js";
import { takeWatchPagesRecord } from "../src/watch-pages/kept.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { WATCH_PAGE_CHIP_COLOR, WATCH_PAGE_SECTION_BADGES, watchPageSectionChanged } from "../src/watch-pages/page-settings.js";
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
  renderPageStrip(page: WatchPage): unknown;
  onKeyDown(e: unknown): void;
  onWindowPointerDown(e: unknown): void;
  pageStripOpen?: string;
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

/** The page strip over the watch, as drawn now. */
function strip(el: Editor): unknown {
  return el.renderPageStrip(el.currentPage()!);
}

/** Each chip of a strip's markup, from its item on: its label and value. */
function chips(text: string): { label: string; value: string; item: string }[] {
  return text.split(/(?=<div class="pe-pstrip-item")/).filter((c) => c.startsWith(`<div class="pe-pstrip-item"`)).map((item) => ({
    label: /<span class="pe-pchip-l">([^<]*)</.exec(item)?.[1] ?? "",
    value: /<span class="pe-pchip-v">([^<]*)</.exec(item)?.[1] ?? "",
    item,
  }));
}

/** An element on a press's path, of the classes given. */
function onPath(...classes: string[]): unknown {
  const node = new (globalThis as unknown as { HTMLElement: new () => object }).HTMLElement();
  return Object.assign(node, { tagName: "DIV", classList: { contains: (c: string) => classes.includes(c) } });
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
    expect(text).toContain("The page's own settings are above the watch.");
  });

  it("has no Page | Tile switch: the page's settings are in the strip over the watch", () => {
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

  it("is not there with no tile selected on a page that is not smart: nothing folds", () => {
    expect(flat(inspector(editor(hallPage())))).not.toContain("Collapse all");
  });

  it("turns only the smart page's cards with no tile selected", () => {
    const el = editor(smartHall());
    click(inspector(el), ">Collapse all<");
    const folded = Object.keys(JSON.parse(storage.data[FOLD_STORE_KEY]!));
    expect(folded).toContain("smart:rules");
    expect(folded).toContain("smart:header");
    expect(folded.some((k) => k.startsWith("page-settings:"))).toBe(false);
    expect(folded).not.toContain("smart:page");
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

describe("the inspector with no tile", () => {
  it("holds none of the page's settings: the line pointing at the strip, then Delete page", () => {
    const text = flat(inspector(editor(hallPage())));
    const body = text.slice(text.indexOf(`<div class="insp-body">`));
    expect(body).not.toContain("<h4>");
    expect(body).not.toContain("Theme");
    expect(body).not.toContain(`aria-label="Page name"`);
    expect(body).not.toContain("Hidden on the watch");
    expect(body).toContain("Select a tile to edit it, or add one. The page's own settings are above the watch.");
    expect(body.indexOf("Delete page…")).toBeGreaterThan(body.indexOf("above the watch"));
  });

  it("on a smart page holds the Rules cards in the Rules color, and the rule's own", () => {
    const text = flat(inspector(editor(smartHall())));
    expect(text).toContain(`>Smart page</span><span class="nm" title=Hall>Hall</span>`);
    const titles = [...text.matchAll(/<h4>([^<]+)/g)].map((m) => m[1]);
    expect(titles).toEqual(["Rules", "Header", "Icon and color", "State", "Text", "Border", "Action", "Size", "Background"]);
    for (const title of ["Rules", "Header"]) {
      expect(card(text, title), title).toContain(`--c:${SMART_SECTION_BADGE.color}`);
      expect(card(text, title), title).toContain(swatch("states"));
    }
    expect(text).toContain("A smart page fills itself from its rules, set above.");
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
    expect(head).toMatch(/<button class="root" title="Edit the page"[^>]*>Hall<\/button><span class="sep">›<\/span><span class="kchip"[^>]*>2 tiles<\/span>/);
    expect(head).not.toContain("Collapse all");
    expect(cards(text)).toHaveLength(1);
    const picked = card(text, "2 tiles picked");
    // Each picked tile, in reading order, with its face, name and kind.
    const rows = [...picked.matchAll(/data-picked-tile=([^\s>]+)/g)].map((m) => m[1]);
    expect(rows).toEqual([DIMMER, SPACER]);
    expect(picked).toContain(`<span class="thumb pe-thumb"`);
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

  it("deletes both from its Delete, and goes back to the page from the crumb", () => {
    const el = pickedHall();
    click(inspector(el), `title="Edit the page"`);
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
});

describe("the page strip", () => {
  it("reads Page settings: Hidden, the three chips Theme, Background and Title, then Smart Page, a hairline between each", () => {
    const text = flat(strip(editor(hallPage())));
    expect(text).toMatch(/^<div class="pe-pstrip" role="toolbar" aria-label="Page settings">\s*<span class="pe-pstrip-label">Page settings:<\/span>/);
    expect(chips(text).map(({ label, value }) => [label, value])).toEqual([
      ["Theme", watchThemeDisplayName("neonLagoon")],
      ["Background", "None"],
      ["Title", "Hidden"],
    ]);
    // How the page shows in the page switcher is set in the menu editor.
    expect(text).not.toContain("data-section=switcher");
    expect(text).not.toContain("Switcher");
    for (const { item } of chips(text)) {
      expect(item).toContain(`aria-haspopup="dialog" aria-expanded=false`);
      expect(item).toContain(`<span class="pe-pchip-chev" aria-hidden="true">▾</span>`);
    }
    // Hidden first, its reason on hover; Smart Page last; four hairlines
    // between the five options; nothing in a popover.
    const hidden = text.indexOf(">Hidden</span>");
    const smart = text.indexOf("Smart Page");
    expect(hidden).toBeGreaterThan(-1);
    expect(hidden).toBeLessThan(text.indexOf(`<div class="pe-pstrip-item"`));
    expect(smart).toBeGreaterThan(text.lastIndexOf(`<div class="pe-pstrip-item"`));
    expect(text.slice(0, hidden)).toContain("the watch does not show it");
    // Both switches carry an instant hint (`data-tip`), no native tooltip.
    expect(text).toMatch(/class="pe-switch pe-pstrip-tog pe-tip"\s+data-tip="Hidden: /);
    expect(text).toMatch(/class="pe-pstrip-tog pe-tip"\s+data-tip="Smart Page: /);
    expect(text).not.toContain(`title=Auto-show active entities`);
    expect(text.match(/<span class="pe-pstrip-sep"/g)?.length).toBe(4);
    expect(text).not.toContain("Hidden on the watch");
    expect(text).not.toContain("tiles, ");
    // Nothing open yet.
    expect(text).not.toContain("pe-ppop");
  });

  it("adds a Smart chip last on a smart page, counting its rules, with the smart page's own rows", () => {
    const smart = { ...smartHall(), isHidden: true } as unknown as WatchPage;
    const el = editor(smart);
    const list = chips(flat(strip(el)));
    expect(list.map(({ label }) => label)).toEqual(["Theme", "Background", "Title", "Smart"]);
    expect(list[3]!.value).toMatch(/rule/);
    expect(list[3]!.item).toContain(`style=--k:${SMART_SECTION_BADGE.color}`);
    click(strip(el), "data-section=page");
    const rows = chips(flat(strip(el)))[3]!.item;
    expect(rows).toContain(`<div class="pop-menu pe-ppop" role="dialog" aria-label=Smart page>`);
    expect(rows).toContain(`id="sm-body-page"`);
    expect(rows).toContain("Live Updates");
    // A plain page has no Smart chip.
    expect(flat(strip(editor(hallPage())))).not.toContain("data-section=page");
  });

  it("reads a title style and a gradient theme in its values", () => {
    const styled = chips(flat(strip(editor(hallPage({ pageTitleDisplayStyle: "glass", useGradientColors: true })))));
    expect(styled[0]!.value).toBe(`${watchThemeDisplayName("neonLagoon")}, gradient`);
    expect(styled[2]!.value).toBe("Glass");
  });

  it("badges each chip in its section's color: an icon, and the theme's own dot on Theme", () => {
    const text = flat(strip(editor(hallPage())));
    const expected: [keyof typeof WATCH_PAGE_SECTION_BADGES, string, Parameters<typeof uiIcon>[0]][] = [
      ["theme", SECTION_COLOR.look, "look"],
      ["background", SECTION_COLOR.look, "shape"],
      ["title", SECTION_COLOR.numbers, "text"],
    ];
    expect(Object.keys(WATCH_PAGE_SECTION_BADGES)).toEqual(["page", "theme", "background", "title"]);
    const items = chips(text);
    expected.forEach(([key, color, icon], i) => {
      expect(WATCH_PAGE_SECTION_BADGES[key]).toEqual({ color, icon });
      const item = items[i]!.item;
      expect(item, key).toContain(`style=--k:${color}`);
      if (key === "theme") {
        expect(item).toMatch(/class="pe-pchip-sw pe-pchip-theme" style=--ps-a:[^;]+;--ps-b:[^;]+;--ps-g:/);
      } else {
        expect(item, key).toContain(`<span class="pe-pchip-sw" aria-hidden="true">${flat(uiIcon(icon))}</span>`);
      }
    });
  });

  it("opens one popover at a time under the chip pressed, holding the section's own rows", () => {
    const el = editor(hallPage());
    click(strip(el), "data-section=background");
    expect(el.pageStripOpen).toBe("background");
    let text = flat(strip(el));
    expect(text.match(/class="pop-menu pe-ppop"/g)?.length).toBe(1);
    const background = chips(text)[1]!.item;
    expect(background).toContain(`aria-expanded=true`);
    expect(background).toContain(`<div class="pop-menu pe-ppop" role="dialog" aria-label=Background>`);
    expect(background).toContain(`<fieldset class="ts-body" id=ps-body-background`);
    expect(background).toContain("Decoration");
    // Another chip moves the popover there.
    click(strip(el), "data-section=theme");
    text = flat(strip(el));
    expect(text.match(/class="pop-menu pe-ppop"/g)?.length).toBe(1);
    expect(chips(text)[0]!.item).toContain(`aria-label="Page theme"`);
    expect(chips(text)[1]!.item).not.toContain("pe-ppop");
    // The same chip again shuts it.
    click(strip(el), "data-section=theme");
    expect(el.pageStripOpen).toBeUndefined();
    expect(flat(strip(el))).not.toContain("pe-ppop");
  });

  it("shuts on Escape and on a press outside it, not on one in it or on its chip", () => {
    const el = editor(hallPage());
    const escape = { key: "Escape", defaultPrevented: false, metaKey: false, ctrlKey: false, altKey: false, shiftKey: false,
      composedPath: () => [el], preventDefault() {} };
    click(strip(el), "data-section=title");
    el.onKeyDown(escape);
    expect(el.pageStripOpen).toBeUndefined();

    click(strip(el), "data-section=title");
    el.onWindowPointerDown({ composedPath: () => [onPath("ts-body"), onPath("pe-pstrip-item")] });
    expect(el.pageStripOpen).toBe("title");
    el.onWindowPointerDown({ composedPath: () => [onPath("sym-browse")] });
    expect(el.pageStripOpen).toBe("title");
    el.onWindowPointerDown({ composedPath: () => [Object.assign(onPath() as object, { tagName: "DIALOG" })] });
    expect(el.pageStripOpen).toBe("title");
    el.onWindowPointerDown({ composedPath: () => [onPath("pe-screen")] });
    expect(el.pageStripOpen).toBeUndefined();
  });

  it("shuts when another page is picked", () => {
    vi.stubGlobal("window", { addEventListener() {}, removeEventListener() {} });
    const el = editor(hallPage());
    click(strip(el), "data-section=title");
    (el as unknown as { selectPage(id: string): void }).selectPage("C3A0E000-0000-4000-8000-0000000000B2");
    expect(el.pageStripOpen).toBeUndefined();
  });

  it("ends with Reset page only while the page holds something a reset would change", () => {
    // The page as the phone's reset leaves it: nothing to reset.
    const reset = resetWatchPage({ schemaVersion: 1, pages: [hallPage()] } as unknown as WatchPagesDocument, PAGE);
    const untouched = (reset as unknown as { pages: WatchPage[] }).pages[0]!;
    expect(flat(strip(editor(untouched)))).not.toContain("Reset page");
    const text = flat(strip(editor(hallPage({ pageTitleDisplayStyle: "glass" }))));
    expect(text).toContain(`<span class="ps-reset">`);
    expect(text).toContain(">Reset page</button>");
    expect(text.indexOf("Reset page")).toBeGreaterThan(text.lastIndexOf(`<div class="pe-pstrip-item"`));
    // A photo is something a reset changes.
    expect(flat(strip(editor({ ...untouched, backgroundImageId: "preset_waves" } as WatchPage)))).toContain(">Reset page</button>");
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
    click(strip(el), "data-section=background");
    let text = flat(strip(el));
    expect(chips(text)[1]!.value).toBe("Image");
    expect(text).not.toContain("set on the phone");
    expect(text).toMatch(/aria-checked=true\s+class=on[^>]*>Image</);
    expect(text).toContain("Opacity");
    expect(text).toContain("Blur");
    expect(text).toContain(">Remove</button>");
    await new Promise((resolve) => setTimeout(resolve, 0));
    text = flat(strip(el));
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
  });

  it("is drawn on the page strip's chip, after its label, and in its popover's head", () => {
    const dot = `<span class="pe-pchip-l">Title</span><span class="pe-pchip-dot" aria-hidden="true"></span>`;
    const titled = chips(flat(strip(editor(hallPage({ pageTitleDisplayStyle: "glass" })))));
    expect(titled[2]!.item).toContain(dot);
    expect(titled.filter((c) => c.item.includes("pe-pchip-dot")).map((c) => c.label)).toEqual(["Title"]);
    // A switcher value of the page's own marks no chip: it is the menu
    // editor's now (`watchPageSwitcherChanged`).
    expect(flat(strip(editor(hallPage({ switcherText: "Hall" }))))).not.toContain("pe-pchip-dot");
    // Theme: not for the watch's fallback theme, yes for another.
    expect(chips(flat(strip(editor(hallPage()))))[0]!.item).not.toContain("pe-pchip-dot");
    const el = editor(hallPage({ themeOverride: "ember" }));
    expect(chips(flat(strip(el)))[0]!.item).toContain(`<span class="pe-pchip-l">Theme</span><span class="pe-pchip-dot"`);
    click(strip(el), "data-section=theme");
    expect(chips(flat(strip(el)))[0]!.item).toContain(`<div class="pe-ppop-h"><span>Theme</span><span class="pe-pchip-dot" aria-hidden="true"></span></div>`);
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
