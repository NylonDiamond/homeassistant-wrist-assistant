// The tile inspector's rare rows and its Hold and slide pad (tile-settings.ts).
//
// The rare rows (the state icons, the icon's size and shadow, Animate while on,
// the label's font size and shadow, the state's text size and shadow, the
// bar's border and shadow, the tap's animation) are always drawn now. The one
// fold left is a Custom layout's Exact place in the top card: which row carries
// it, when it stands open because the part holds a value of its own, what its
// More line names, and how its open state is kept.
//
// Hold and slide is one arrow pad: four direction buttons around a small
// tile, and the picked direction's rows in one box under it.
//
// No DOM: the settings are drawn to their Lit templates and read as text,
// and a button is pressed by calling the handler its template holds.

import { describe, expect, it } from "vitest";

import { SymbolBrowser } from "../src/symbols.js";
import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { NO_ICONS, type TileSettingsHost } from "../src/watch-pages/editor-host.js";
import { sectionOpen } from "../src/watch-pages/fold-memory.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { watchHoldSlideMenus } from "../src/watch-pages/tile-settings-options.js";
import {
  MORE_FOLD_MODULE,
  renderTileInspector,
  slideArrowWords,
  slidePadDirection,
  tileSettingsStyles,
} from "../src/watch-pages/tile-settings.js";

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

/** The click handler of the smallest template whose text holds `marker`
 * and binds a click itself. */
function fire(root: unknown, marker: string): void {
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
  if (found.length === 0) throw new Error(`no click handler near ${marker}`);
  (found[0]!.fn as (e: unknown) => void)({ currentTarget: null, stopPropagation() {}, preventDefault() {} });
}

// ── a tile host ──────────────────────────────────────────────────────────

const PAGE_ID = "C3A0E000-0000-4000-8000-0000000000AA";
const TILE_ID = "C3A0E000-0000-4000-8000-000000000001";

const tile = (entityId: string, extra: Record<string, unknown> = {}): WatchPageTile => ({
  id: TILE_ID, entityId, gridCol: 0, gridRow: 0, colSpan: 6, rowSpan: 4, ...extra,
});

/** A light as the iPhone app saves one: every key at its default. */
const LIGHT_AS_SAVED = { showLabel: true, labelShadow: true, labelFontWeight: "light", iconShadow: false, iconTapAnimation: "replace" };

const STATES = {
  "light.desk": { entity_id: "light.desk", state: "on", attributes: { friendly_name: "Desk", brightness: 128 } },
  "lock.door": { entity_id: "lock.door", state: "locked", attributes: { friendly_name: "Door" } },
};

function tileHost(t: WatchPageTile, uiState = new Map<string, unknown>()): { host: TileSettingsHost; draft: WatchPagesDraft; updates: () => number } {
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [{ id: PAGE_ID, name: "Living", items: [t] }] }, 1);
  const pageNow = () => (draft.document.pages as WatchPage[])[0]!;
  let updates = 0;
  const host = {
    hass: { states: STATES },
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
    uiState,
    apply: (next: WatchPagesDocument) => draft.apply(next),
    endCoalesce: () => draft.endCoalesce(),
    selectTile: () => undefined,
    requestUpdate: () => { updates += 1; },
    tileId: TILE_ID,
    get tile() { return ((pageNow().items as WatchPageTile[] | undefined) ?? []).find((x) => x.id === TILE_ID) ?? ({} as WatchPageTile); },
    oneLook: true,
  } as unknown as TileSettingsHost;
  return { host, draft, updates: () => updates };
}

/** One section of the settings, in the top card or a card, from its heading
 * to the next section. */
function part(text: string, id: string): string {
  const at = text.search(new RegExp(`<section class="ts-sec( ts-top-part)?" data-part=${id} `));
  if (at < 0) throw new Error(`no ${id} section`);
  const next = text.slice(at + 1).search(/<section class="ts-(sec|grp)/);
  return text.slice(at, next < 0 ? undefined : at + 1 + next);
}

/** The words of a section's More line, or undefined when it has none. */
function moreWords(text: string): string | undefined {
  const m = /<button type="button" class="ts-more" data-more=[^>]*>\s*<span class="ts-more-w">(More|Fewer)<\/span>(?:<span class="ts-more-v">([^<]*)<\/span>)?/.exec(text);
  return m === null ? undefined : m[2] === undefined ? m[1] : `${m[1]} ${m[2]}`;
}

/** The markup of the rare row wrapper holding `marker`, from its own tag. */
function rareAround(text: string, marker: string): string {
  const at = text.indexOf(marker);
  if (at < 0) throw new Error(`no ${marker}`);
  return text.slice(text.lastIndexOf(`<div class="ts-rare"`, at), at);
}

const drawn = (t: WatchPageTile, uiState?: Map<string, unknown>) => flat(renderTileInspector(tileHost(t, uiState).host));

// ── rare rows ────────────────────────────────────────────────────────────

describe("the rows that used to fold", () => {
  it("are all drawn at their defaults, with no More line in any card", () => {
    const text = drawn(tile("light.desk", LIGHT_AS_SAVED));
    const cards = text.slice(text.indexOf(`<div class="ts-groups">`));
    expect(cards).not.toContain("ts-rare");
    expect(cards).not.toContain("ts-more");
    expect(moreWords(text)).toBeUndefined();
    for (const row of ["State icons and colors", "Icon size", "Icon shadow"]) expect(part(text, "iconLook"), row).toContain(row);
    for (const row of ["Font size", "Name shadow"]) expect(part(text, "text"), row).toContain(row);
    for (const row of ["Text shadow", "State text", "Bar border", "Bar shadow"]) expect(part(text, "state"), row).toContain(row);
    expect(part(text, "whenOff")).toContain("Animate while on");
    expect(part(text, "tapAnimation")).toContain("Tap animation");
  });

  it("put Font size and Name shadow last in the Name section, after Name color", () => {
    const name = part(drawn(tile("light.desk", LIGHT_AS_SAVED)), "text");
    const order = ["Weight", "Design", "Name color", "Font size", "Name shadow"].map((w) => name.indexOf(w));
    expect(order.every((at) => at >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it("keep each State card whole, a card of one row with its heading", () => {
    const state = part(drawn(tile("light.desk", LIGHT_AS_SAVED)), "state");
    expect(state.slice(state.indexOf("<span>State text</span>"))).toContain(">Size</span>");
    const bar = state.slice(state.indexOf("<span>State bar</span>"));
    const order = ["Bar color", "Bar border", "Bar shadow"].map((w) => bar.indexOf(w));
    expect(order.every((at) => at >= 0)).toBe(true);
  });

  it("stand the same way with a value of their own, which the part counts as changed", () => {
    const { host } = tileHost(tile("light.desk", { ...LIGHT_AS_SAVED, labelFontSizeOverride: 14, stateBarBorder: true, badgeFontSizeOverride: 9 }));
    const text = flat(renderTileInspector(host));
    expect(part(text, "text")).toContain("Font size");
    expect(part(text, "text")).toContain(`<h4>Name</h4><span class="ts-dot"`);
    expect(part(text, "state")).toContain("Bar border");
    expect(part(text, "state")).toContain(`<h4>State</h4><span class="ts-dot"`);
    expect(text.slice(text.indexOf(`<div class="ts-groups">`))).not.toContain("ts-rare");
  });
});

describe("a row being typed in", () => {
  /** The settings drawn while the box of `setting` has focus and holds
   * `text` (`typingField` keeps it; a draw drops typing of a box that has
   * no focus, `dropStaleTyping`). */
  const typedDraw = (setting: string, text: string): string => {
    const doc = globalThis.document as unknown as { activeElement: unknown };
    const was = doc.activeElement;
    const box = Object.assign(new (globalThis.HTMLElement as unknown as new () => object)(), {
      closest: () => ({ dataset: { tsField: setting } }),
    });
    doc.activeElement = box;
    try {
      return drawn(tile("light.desk", LIGHT_AS_SAVED), new Map<string, unknown>([[`tile-settings:typed:${TILE_ID.toUpperCase()}:${setting}`, text]]));
    } finally {
      doc.activeElement = was;
    }
  };

  it("keeps its box while it is cleared back to the default, so the caret stays", () => {
    // Font size backspaced empty: the override is gone, the box still has focus.
    expect(part(typedDraw("fontSize", ""), "text")).toContain("Font size");
    expect(part(typedDraw("iconSize", ""), "iconLook")).toContain("Icon size");
    // State's Text size, whose card holds nothing else.
    const state = part(typedDraw("badgeFontSizeOverride", ""), "state");
    expect(state.slice(state.indexOf("<span>State text</span>"))).toContain(">Size</span>");
  });
});

describe("the More line of a Custom layout", () => {
  /** A tile in the Custom layout, its icon picked and at a spot of its own. */
  const custom = (entry: Record<string, unknown> = { spot: "tr" }) => tile("light.desk", { ...LIGHT_AS_SAVED, arrange: { v: 1, parts: { icon: entry } } });

  it("is the one fold left: Exact place, in the top card", () => {
    const text = drawn(custom());
    const arrange = part(text, "arrange");
    expect(moreWords(arrange)).toBe("More Exact place");
    expect(rareAround(arrange, "Across")).toMatch(/^<div class="ts-rare" \?data-shown=false>/);
    expect(text.slice(text.indexOf(`<div class="ts-groups">`))).not.toContain("ts-more");
  });

  it("is gone, its rows shown, while the part holds a place of its own", () => {
    const arrange = part(drawn(custom({ spot: "tr", dx: 0.1 })), "arrange");
    expect(moreWords(arrange)).toBeUndefined();
    expect(rareAround(arrange, "Across")).toMatch(/^<div class="ts-rare" \?data-shown=true>/);
  });

  it("opens its rows in place, reads Fewer, and is kept in the fold memory", () => {
    const uiState = new Map<string, unknown>();
    const { host, updates } = tileHost(custom(), uiState);
    fire(renderTileInspector(host), `data-more=arrange `);
    expect(updates()).toBe(1);
    expect(sectionOpen(uiState, MORE_FOLD_MODULE, "arrange", true)).toBe(true);
    const arrange = part(flat(renderTileInspector(host)), "arrange");
    expect(moreWords(arrange)).toBe("Fewer");
    expect(arrange).toContain(`aria-expanded=true`);
    expect(rareAround(arrange, "Across")).toMatch(/^<div class="ts-rare" \?data-shown=true>/);
    // The open state follows the person from tile to tile.
    expect(moreWords(part(drawn(custom(), uiState), "arrange"))).toBe("Fewer");
    fire(renderTileInspector(host), `data-more=arrange `);
    expect(sectionOpen(uiState, MORE_FOLD_MODULE, "arrange", true)).toBe(false);
  });

  it("folds only in the top card, by CSS, and shows nowhere else", () => {
    const sheet = tileSettingsStyles.cssText;
    expect(sheet).toContain(".ts-top .ts-rare:not([data-shown]) { display: none; }");
    expect(sheet).toMatch(/\.ts-top button\.ts-more \{/);
    expect(sheet).toContain(".ts-rare { display: contents; }");
    expect(sheet).toContain("button.ts-more { display: none; }");
    expect(sheet).not.toContain("ts-groups .ts-rare");
    expect(sheet).not.toContain("ts-groups button.ts-more");
  });
});

// ── hold and slide ───────────────────────────────────────────────────────

describe("hold and slide as one arrow pad", () => {
  const action = (text: string) => part(text, "action");

  it("draws the four directions around the tile, each with what it does, and Nothing quietly", () => {
    const pad = action(drawn(tile("light.desk", { ...LIGHT_AS_SAVED, holdSlideActions: ["up", "toggle"] })));
    expect(pad).toContain(`<div class="ts-pad" role="group" aria-label="Hold and slide directions">`);
    for (const d of ["up", "down", "left", "right"]) expect(pad).toContain(`data-direction=${d}`);
    expect(pad).toMatch(/<button type="button" class="ts-slide-arr set on" data-direction=up\s+aria-pressed=true/);
    expect(pad).toMatch(/<button type="button" class="ts-slide-arr" data-direction=left\s+aria-pressed=false[^]*?<span>Nothing<\/span>/);
    // The arrows never wear the Arrangement card's class, whose column rule
    // would reach them.
    expect(pad).not.toMatch(/class="ts-arr[ "]/);
    // A light's Down opens its controls by default: it reads as set.
    expect(pad).toMatch(/class="ts-slide-arr set" data-direction=down[^]*?<span>Open light controls<\/span>/);
    expect(pad).toContain(`<div class="ts-pad-tile" aria-hidden="true"`);
    expect(pad).toContain("<span>Desk</span>");
    // Up is picked: its rows show, the others' are kept, hidden.
    expect(pad).toMatch(/data-direction=up\s+role="region" aria-label=Slide up \?hidden=false>/);
    expect(pad).toMatch(/data-direction=down\s+role="region" aria-label=Slide down \?hidden=true>/);
    expect(pad).toContain("<span>Slide up</span>");
    // Reset all stays, while a direction is stored.
    expect(pad).toContain("Reset all");
  });

  it("picks the first direction that does something, else Up, and a press picks another", () => {
    const light = watchHoldSlideMenus(tile("light.desk", LIGHT_AS_SAVED))!;
    const none = watchHoldSlideMenus(tile("light.desk", { holdSlideActions: ["down", "none"] }))!;
    const host = { uiState: new Map<string, unknown>(), tileId: TILE_ID };
    // A light's Down opens its controls by default.
    expect(slidePadDirection(host, light.rows)).toBe(light.rows.find((r) => r.resolved !== "none")!.direction);
    // Down set to None leaves a light no slide at all: Up.
    expect(none.rows.every((r) => r.resolved === "none")).toBe(true);
    expect(slidePadDirection(host, none.rows)).toBe("up");
    expect(slidePadDirection(host, light.rows)).toBe("down");
    expect(slideArrowWords(none.rows.find((r) => r.direction === "down")!)).toBe("Nothing");

    const { host: tileHostNow, updates } = tileHost(tile("light.desk", LIGHT_AS_SAVED));
    fire(renderTileInspector(tileHostNow), `data-direction=right\n`);
    expect(updates()).toBe(1);
    const after = action(flat(renderTileInspector(tileHostNow)));
    expect(after).toMatch(/class="ts-slide-arr on" data-direction=right\s+aria-pressed=true/);
    expect(after).toMatch(/data-direction=right\s+role="region" aria-label=Slide right \?hidden=false>/);
    expect(after).toMatch(/data-direction=down\s+role="region" aria-label=Slide down \?hidden=true>/);
  });

  it("keeps each direction's menu working from its own box", () => {
    const { host, draft } = tileHost(tile("light.desk", LIGHT_AS_SAVED));
    const menus = templates(renderTileInspector(host)).filter((t) => t.strings.some((s) => s.includes("<label class=\"field\"><span>")) && flat(t).includes("<span>Slide left</span>"));
    expect(menus.length).toBeGreaterThan(0);
    const change = templates(menus.at(-1))
      .flatMap((t) => t.strings.map((s, i) => (s.trimEnd().endsWith("@change=") ? t.values[i] : undefined)))
      .find((v): v is (e: unknown) => void => typeof v === "function")!;
    change({ target: { value: "toggle" } });
    const stored = ((draft.document.pages as WatchPage[])[0]!.items as WatchPageTile[])[0]!;
    expect(stored.holdSlideActions).toEqual(["left", "toggle"]);
  });

  it("keeps showing the direction it opened on after that direction is set to None", () => {
    const { host, draft } = tileHost(tile("light.desk", LIGHT_AS_SAVED));
    // A light's pad opens on Down, the first direction that does something.
    const before = action(flat(renderTileInspector(host)));
    expect(before).toMatch(/data-direction=down\s+role="region" aria-label=Slide down \?hidden=false>/);
    const menus = templates(renderTileInspector(host)).filter((t) => t.strings.some((s) => s.includes("<label class=\"field\"><span>")) && flat(t).includes("<span>Slide down</span>"));
    const change = templates(menus.at(-1))
      .flatMap((t) => t.strings.map((s, i) => (s.trimEnd().endsWith("@change=") ? t.values[i] : undefined)))
      .find((v): v is (e: unknown) => void => typeof v === "function")!;
    change({ target: { value: "none" } });
    const stored = ((draft.document.pages as WatchPage[])[0]!.items as WatchPageTile[])[0]!;
    expect(stored.holdSlideActions).toEqual(["down", "none"]);
    // Down does nothing now, yet its box stays the one shown.
    const after = action(flat(renderTileInspector(host)));
    expect(after).toMatch(/class="ts-slide-arr on" data-direction=down\s+aria-pressed=true/);
    expect(after).toMatch(/data-direction=down\s+role="region" aria-label=Slide down \?hidden=false>/);
    expect(after).toMatch(/data-direction=up\s+role="region" aria-label=Slide up \?hidden=true>/);
  });
});
