// The tile inspector's picture choices (`picture-choice.ts`) and its two
// columns: each setting shown as pictures writes what its old control wrote,
// a choice of a menu that moves plays on the head's preview tile without
// touching the draft, the arrow keys move between pictures, Preview as draws
// a tile's entity on, off or unavailable, and every section lands in one of
// the two columns.
//
// No DOM: the settings are drawn to their Lit templates and read as text, and
// a button is pressed by calling the handler its template holds.

import { describe, expect, it } from "vitest";

import { SymbolBrowser } from "../src/symbols.js";
import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { NO_ICONS, type TileSettingsHost } from "../src/watch-pages/editor-host.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { WATCH_STATE_ROW_SETTERS, setWatchTileBorderLineStyle, setWatchTileBorderStyle, setWatchTileBorderThickness, setWatchTilePattern } from "../src/watch-pages/styling-model.js";
import {
  setWatchTileDimWhenOff,
  setWatchTileFontDesign,
  setWatchTileFontWeight,
  setWatchTileIconGlow,
  watchTileIconGlow,
} from "../src/watch-pages/tile-settings-model.js";
import { renderTileSettings, tileInspectorColumns } from "../src/watch-pages/tile-settings.js";
import { WATCH_TILE_SETTINGS_SECTION_TITLES, type WatchTileSettingsSection } from "../src/watch-pages/tile-settings-options.js";
import { pictureChoice, watchTriedTile } from "../src/watch-pages/picture-choice.js";
import { watchTileStatesAs } from "../src/watch-pages/preview.js";

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

/** The `event` handler (`@click=`, `@pointerenter=`...) of the smallest
 * template whose text holds `marker` and binds that event itself. */
function handler(root: unknown, marker: string, event = "@click="): (e: unknown) => void {
  const found = templates(root)
    .map((t) => {
      let text = "";
      let fn: unknown;
      t.strings.forEach((s, i) => {
        text += s;
        if (i >= t.values.length) return;
        const v = t.values[i];
        if (typeof v === "function" && s.trimEnd().endsWith(event)) fn ??= v;
        text += flat(v);
      });
      return { text, fn };
    })
    .filter((c) => c.text.includes(marker) && c.fn !== undefined)
    .sort((a, b) => a.text.length - b.text.length);
  if (found.length === 0) throw new Error(`no ${event} handler near ${marker}`);
  return found[0]!.fn as (e: unknown) => void;
}

const fire = (root: unknown, marker: string, event = "@click=") => handler(root, marker, event)({ currentTarget: null, stopPropagation() {}, preventDefault() {} });

// ── a tile host ──────────────────────────────────────────────────────────

const PAGE_ID = "C3A0E000-0000-4000-8000-0000000000AA";
const TILE_ID = "C3A0E000-0000-4000-8000-000000000001";

const tile = (entityId: string, extra: Record<string, unknown> = {}): WatchPageTile => ({
  id: TILE_ID, entityId, gridCol: 0, gridRow: 0, colSpan: 6, rowSpan: 4, ...extra,
});

const STATES = {
  "light.desk": { entity_id: "light.desk", state: "on", attributes: { friendly_name: "Desk", brightness: 128 } },
  "switch.fan": { entity_id: "switch.fan", state: "on", attributes: { friendly_name: "Fan" } },
};

/** A tile host as the page editor builds one, One Look on. */
function tileHost(t: WatchPageTile): { host: TileSettingsHost; draft: WatchPagesDraft; updates: () => number } {
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
    uiState: new Map<string, unknown>(),
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

type Setter = (d: WatchPagesDocument, pageId: string, tileId: string, value: never) => WatchPagesDocument;

// ── picture choices write what the old controls wrote ────────────────────

describe("picture choices", () => {
  const cases: { name: string; tile: WatchPageTile; value: string; expect: (d: WatchPagesDocument, t: WatchPageTile) => WatchPagesDocument }[] = [
    { name: "Glow On", tile: tile("light.desk"), value: "on",
      expect: (d, t) => setWatchTileIconGlow(d, PAGE_ID, TILE_ID, { ...watchTileIconGlow(t), mode: "on" }) },
    { name: "Glow Off", tile: tile("light.desk"), value: "off",
      expect: (d, t) => setWatchTileIconGlow(d, PAGE_ID, TILE_ID, { ...watchTileIconGlow(t), mode: "off" }) },
    { name: "When it is off: Keep color", tile: tile("light.desk"), value: "keep",
      expect: (d) => setWatchTileDimWhenOff(d, PAGE_ID, TILE_ID, false) },
    { name: "When it is off: Dim", tile: tile("light.desk", { dimWhenOff: false }), value: "dim",
      expect: (d) => setWatchTileDimWhenOff(d, PAGE_ID, TILE_ID, true) },
    { name: "State value Pill", tile: tile("light.desk", { stateValueLabelStyle: "Plain" }), value: "Pill",
      expect: (d) => (WATCH_STATE_ROW_SETTERS.stateValueLabelStyle as Setter)(d, PAGE_ID, TILE_ID, "Pill" as never) },
    { name: "State bar Fill", tile: tile("light.desk", { stateBarStyle: "Top" }), value: "Fill",
      expect: (d) => (WATCH_STATE_ROW_SETTERS.stateBarStyle as Setter)(d, PAGE_ID, TILE_ID, "Fill" as never) },
    { name: "Border style Line", tile: tile("light.desk"), value: "line",
      expect: (d) => setWatchTileBorderStyle(d, PAGE_ID, TILE_ID, "line") },
    { name: "Border thickness Thick", tile: tile("light.desk", { borderStyle: "line", borderThickness: "thin" }), value: "thick",
      expect: (d) => setWatchTileBorderThickness(d, PAGE_ID, TILE_ID, "thick") },
    { name: "Border line style Dashed", tile: tile("light.desk", { borderStyle: "line", borderLineStyle: "solid" }), value: "dashed",
      expect: (d) => setWatchTileBorderLineStyle(d, PAGE_ID, TILE_ID, "dashed") },
    { name: "Pattern Dots", tile: tile("light.desk"), value: "dots",
      expect: (d) => setWatchTilePattern(d, PAGE_ID, TILE_ID, "dots") },
    { name: "Text weight Bold", tile: tile("light.desk"), value: "bold",
      expect: (d) => setWatchTileFontWeight(d, PAGE_ID, TILE_ID, "bold") },
    { name: "Text design Serif", tile: tile("light.desk"), value: "serif",
      expect: (d) => setWatchTileFontDesign(d, PAGE_ID, TILE_ID, "serif") },
  ];

  for (const c of cases) {
    it(`${c.name}: writes the same as the control it replaced`, () => {
      const { host, draft } = tileHost(c.tile);
      const before = draft.document;
      const expected = c.expect(before, host.tile);
      expect(expected).not.toBe(before);
      const drawn = renderTileSettings(host);
      const button = `role="radio" class="pc-opt " aria-checked=false\n          data-value=${c.value} `;
      expect(flat(drawn)).toContain(button);
      fire(drawn, button);
      expect(draft.document).toEqual(expected);
    });
  }

  it("draws Glow as the tile on, then off, and When it is off as the tile off", () => {
    const text = flat(renderTileSettings(tileHost(tile("light.desk")).host));
    const glow = text.slice(text.indexOf(`aria-label=Glow`), text.indexOf("Each picture shows the tile on, then off."));
    // Three choices, two tile pictures each.
    expect(glow.match(/data-value=/g)?.length).toBe(3);
    expect(glow.match(/<span class="pc-tile"/g)?.length).toBe(6);
    const off = text.slice(text.indexOf(`aria-label=When it is off`));
    expect(off.slice(0, off.indexOf("</div>\n  </div>")).match(/<span class="pc-tile"/g)?.length).toBe(2);
    expect(text).not.toContain(">Dim when off<");
  });

  it("draws the pattern gallery as swatches, weight and design as Aa, thickness and line style as lines", () => {
    const text = flat(renderTileSettings(tileHost(tile("light.desk", { borderStyle: "line" })).host));
    expect(text).toContain(`class="field pc-field pc-size-swatch"`);
    expect(text.match(/class="pc-swatch"/g)!.length).toBeGreaterThan(15);
    expect(text).toMatch(/aria-label=Weight[\s\S]*?<span class="pc-aa" style=font-family:[^;]*;font-weight:700>Aa<\/span>/);
    expect(text).toMatch(/aria-label=Design[\s\S]*?<span class="pc-aa" style=font-family:ui-serif/);
    expect(text).toContain(`<span class="pc-line" style=border-top:4px solid currentColor></span>`);
    expect(text).toContain(`<span class="pc-line" style=border-top:2px dashed currentColor></span>`);
  });

  it("keep a stored value the panel does not offer in its menu", () => {
    const text = flat(renderTileSettings(tileHost(tile("light.desk", { labelFontWeight: "heavy" })).host));
    expect(text).toMatch(/<span>Weight<\/span>\s*<select/);
  });

  it("move the focus with the arrow keys, skipping greyed choices, and pick nothing", () => {
    const picked: string[] = [];
    const t = pictureChoice("Pick", "a", [
      { value: "a", label: "A", picture: () => flat("") as never },
      { value: "b", label: "B", disabled: true, picture: () => flat("") as never },
      { value: "c", label: "C", picture: () => flat("") as never },
    ], (v) => picked.push(v));
    const keys = handler(t, `role="radiogroup"`, "@keydown=");
    let focused = "";
    const button = (value: string, disabled = false) => ({ value, disabled, focus: () => { focused = value; } });
    const buttons = [button("a"), button("b", true), button("c")];
    const group = { querySelectorAll: () => buttons };
    keys({ key: "ArrowRight", currentTarget: group, target: buttons[0], preventDefault() {} });
    expect(focused).toBe("c");
    keys({ key: "ArrowRight", currentTarget: group, target: buttons[2], preventDefault() {} });
    expect(focused).toBe("a");
    keys({ key: "End", currentTarget: group, target: buttons[0], preventDefault() {} });
    expect(focused).toBe("c");
    expect(picked).toEqual([]);
    // Enter and Space are the buttons' own clicks.
    fire(t, `data-value=c`);
    expect(picked).toEqual(["c"]);
  });
});

// ── a menu whose choices play on the preview tile ────────────────────────

describe("pointing at an Effect or a border Animation", () => {
  it("plays it on the head's preview tile only, and never touches the draft", () => {
    const { host, draft, updates } = tileHost(tile("light.desk"));
    const before = draft.document;
    // Open the Effect menu.
    let drawn = renderTileSettings(host);
    expect(flat(drawn)).toContain(`<button type="button" class="pc-menu-btn" aria-haspopup="listbox" aria-expanded=false`);
    fire(drawn, `class="pc-menu-btn" aria-haspopup="listbox" aria-expanded=false`);
    drawn = renderTileSettings(host);
    expect(flat(drawn)).toContain(`aria-expanded=true`);
    // Point at Aurora.
    fire(drawn, `>Aurora</button>`, "@pointerenter=");
    expect(watchTriedTile(host.uiState, TILE_ID)?.tileAnimation).toBe("aurora");
    expect(host.tile.tileAnimation).toBeUndefined();
    expect(draft.document).toBe(before);
    expect(draft.canUndo).toBe(false);
    expect(updates()).toBeGreaterThan(0);
    // Focus on Bokeh with the keys tries it too.
    fire(drawn, `>Bokeh</button>`, "@focus=");
    expect(watchTriedTile(host.uiState, TILE_ID)?.tileAnimation).toBe("bokeh");
    expect(watchTriedTile(host.uiState, "another-tile")).toBeUndefined();
    // Leaving the list draws the stored one again.
    fire(drawn, `role="listbox"`, "@pointerleave=");
    expect(watchTriedTile(host.uiState, TILE_ID)).toBeUndefined();
    expect(draft.document).toBe(before);
    // A click picks it, as the menu did, and closes the list.
    fire(drawn, `>Bokeh</button>`, "@pointerenter=");
    fire(drawn, `>Bokeh</button>`);
    expect(host.tile.tileAnimation).toBe("bokeh");
    expect(watchTriedTile(host.uiState, TILE_ID)).toBeUndefined();
    expect(flat(renderTileSettings(host))).toContain(`aria-expanded=false`);
  });

  it("offers the same for a border's Animation", () => {
    const { host, draft } = tileHost(tile("light.desk", { borderStyle: "animate", borderAnimation: "chase" }));
    const before = draft.document;
    let drawn = renderTileSettings(host);
    const text = flat(drawn);
    const at = text.indexOf("<span>Animation</span>");
    expect(at).toBeGreaterThan(0);
    expect(text.slice(at, at + 200)).toContain("pc-menu");
    fire(drawn, `<span>Animation</span>\n    <div class="pc-menu"`);
    drawn = renderTileSettings(host);
    fire(drawn, `>Orbit</button>`, "@pointerenter=");
    expect(watchTriedTile(host.uiState, TILE_ID)?.borderAnimation).toBe("orbit");
    expect(draft.document).toBe(before);
  });
});

// ── Preview as ───────────────────────────────────────────────────────────

describe("Preview as", () => {
  it("draws a tile's entity on, off or unavailable, never touching the states it was given", () => {
    const light = tile("light.desk");
    const states = STATES as unknown as Parameters<typeof watchTileStatesAs>[1];
    expect(watchTileStatesAs(light, states, "on")!["light.desk"]!.state).toBe("on");
    const off = watchTileStatesAs(light, states, "off")!["light.desk"]!;
    expect(off.state).toBe("off");
    expect(off.attributes.brightness).toBeUndefined();
    expect(watchTileStatesAs(light, states, "unavailable")!["light.desk"]!.state).toBe("unavailable");
    expect(watchTileStatesAs(tile("lock.door"), states, "off")!["lock.door"]!.state).toBe("unlocked");
    expect(watchTileStatesAs(tile("cover.blind"), states, "off")!["cover.blind"]!.state).toBe("closed");
    // A sensor has no off: it keeps its reading. A tile with no entity has
    // nothing to change.
    expect(watchTileStatesAs(tile("sensor.t"), states, "off")).toBe(states);
    expect(watchTileStatesAs(tile("spacer.x"), states, "unavailable")).toBe(states);
    expect(STATES["light.desk"].state).toBe("on");
  });
});

// ── the columns ──────────────────────────────────────────────────────────

describe("the inspector's columns", () => {
  it("put the look and Show tile on the left, place, state, border and tap on the right, and lose no section", () => {
    const all = Object.keys(WATCH_TILE_SETTINGS_SECTION_TITLES) as WatchTileSettingsSection[];
    const { left, right } = tileInspectorColumns(all);
    expect(left.slice(0, 4)).toEqual(["icon", "text", "background", "visibility"]);
    expect(right.slice(0, 5)).toEqual(["size", "arrange", "state", "border", "action"]);
    expect([...left, ...right].sort()).toEqual([...all].sort());
    // A kind's own look goes left after them, what the tile is about right.
    expect(left).toEqual(expect.arrayContaining(["header", "phoneTile", "phone", "phoneExtras", "removed"]));
    expect(right).toEqual(expect.arrayContaining(["opens", "target", "request", "special"]));
    // Each column keeps its order whatever order it was given.
    expect(tileInspectorColumns(["visibility", "border", "icon", "size"])).toEqual({ left: ["icon", "visibility"], right: ["size", "border"] });
  });
});
