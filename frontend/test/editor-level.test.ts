// The page editor's level, Simple, Advanced or Expert, without a DOM: the
// preference kept in this browser and what it falls back to, the tile
// settings each level draws, the "Has Advanced settings" line where Simple
// hides a value of the tile's own, and the Want more card.

import { html } from "lit";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import { SymbolBrowser } from "../src/symbols.js";
import { type WatchPagesApplyOptions, WatchPagesDraft } from "../src/watch-pages/draft.js";
import { NO_ICONS, type TileSettingsHost, extendHost } from "../src/watch-pages/editor-host.js";
import {
  DEFAULT_EDITOR_LEVEL,
  EDITOR_LEVELS,
  EDITOR_LEVEL_HINTS,
  EDITOR_LEVEL_KEY,
  type EditorLevel,
  type EditorLevelLink,
  levelShowsLayers,
  loadEditorLevel,
  saveEditorLevel,
} from "../src/watch-pages/editor-level.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { BASE_LAYER_IDS, readTileDesign, syncTileDesigns } from "../src/watch-pages/tile-design.js";
import { tileLayerEdits } from "../src/watch-pages/tile-layer-host.js";
import { tileHasCustomLayers } from "../src/watch-pages/tile-layers-ui.js";
import {
  ADVANCED_LINE_TEXT,
  CUSTOM_LAYERS_LINE_TEXT,
  type TileLayerLinks,
  WANT_MORE_TEXT,
  levelSections,
  renderTileSettings,
  tileSettingsFoldIds,
} from "../src/watch-pages/tile-settings.js";
import { watchAddThemeOf, watchThemeSwatches } from "../src/watch-pages/tile-new.js";
import { flat } from "./library-editor-home.js";

// ── the preference ──────────────────────────────────────────────────────

function memoryStorage(seed: Record<string, string> = {}) {
  const data: Record<string, string> = { ...seed };
  return {
    data,
    getItem: (key: string) => (Object.hasOwn(data, key) ? data[key]! : null),
    setItem: (key: string, value: string) => { data[key] = String(value); },
  };
}

const throwing = {
  getItem: () => { throw new Error("storage off"); },
  setItem: () => { throw new Error("storage off"); },
};

describe("the level preference", () => {
  it("starts at Simple for a browser that never picked one", () => {
    expect(DEFAULT_EDITOR_LEVEL).toBe("simple");
    expect(loadEditorLevel(memoryStorage())).toBe("simple");
    expect(loadEditorLevel(undefined)).toBe("simple");
  });

  it("reads back the level saved, and falls back to Simple for anything else", () => {
    const store = memoryStorage();
    for (const [level] of EDITOR_LEVELS) {
      saveEditorLevel(level, store);
      expect(store.data[EDITOR_LEVEL_KEY]).toBe(level);
      expect(loadEditorLevel(store)).toBe(level);
    }
    expect(loadEditorLevel(memoryStorage({ [EDITOR_LEVEL_KEY]: "wizard" }))).toBe("simple");
    expect(loadEditorLevel(memoryStorage({ [EDITOR_LEVEL_KEY]: "" }))).toBe("simple");
  });

  it("keeps working with storage off: reads Simple, and a save throws nothing", () => {
    expect(loadEditorLevel(throwing)).toBe("simple");
    expect(() => saveEditorLevel("expert", throwing)).not.toThrow();
  });

  it("names the three levels in order, each with its line, and only Expert shows layers", () => {
    expect(EDITOR_LEVELS.map(([, text]) => text)).toEqual(["Simple", "Advanced", "Expert"]);
    expect(EDITOR_LEVEL_HINTS).toEqual({
      simple: "Name, size, icon, color, state and tap. No layers.",
      advanced: "Every tile setting. Layers stay hidden.",
      expert: "Every setting, plus layers, rules, templates and tap zones.",
    });
    expect(EDITOR_LEVELS.map(([level]) => levelShowsLayers(level))).toEqual([false, false, true]);
    // Plain words: no dash used to break a sentence.
    for (const text of [...Object.values(EDITOR_LEVEL_HINTS), WANT_MORE_TEXT, ADVANCED_LINE_TEXT]) expect(text).not.toMatch(/[–—]| - /);
  });
});

// ── the tile settings at each level ─────────────────────────────────────

const PAGE_ID = "7A1E0000-0000-4000-8000-000000000001";
const LIGHT = "7A1E0000-0000-4000-8000-0000000000A1";

const entity = (id: string, state: string, attributes: Record<string, unknown> = {}): HassEntityState =>
  ({ entity_id: id, state, attributes, last_changed: "", last_updated: "" });

const STATES: Record<string, HassEntityState> = {
  "light.office": entity("light.office", "on", { friendly_name: "Office", brightness: 209 }),
};

const page = (extra: Record<string, unknown> = {}): WatchPage => ({
  id: PAGE_ID, name: "Hall",
  items: [{ id: LIGHT, entityId: "light.office", gridCol: 0, gridRow: 0, colSpan: 6, rowSpan: 4, color: "#F2AE4E", ...extra }],
});

/** A tile settings host over a draft at a level, with its level link and
 * layer links recording what they were asked. */
function levelHost(level: EditorLevel | undefined, extra: Record<string, unknown> = {}) {
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [page(extra)] }, 1);
  const pageNow = () => (draft.document.pages as WatchPage[])[0]!;
  const base = {
    hass: { states: STATES },
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    get document() { return draft.document; },
    pageId: PAGE_ID,
    get page() { return pageNow(); },
    otherPages: [],
    catalog: undefined,
    templateRenders: new Map(),
    busy: false,
    uiState: new Map<string, unknown>(),
    apply: (next: WatchPagesDocument, options?: WatchPagesApplyOptions) =>
      draft.apply(syncTileDesigns(draft.document, next, { states: STATES, icons: NO_ICONS }), options),
    endCoalesce: () => draft.endCoalesce(),
    selectTile: () => undefined,
    requestUpdate: () => undefined,
    tileId: LIGHT,
    get tile() { return ((pageNow().items as WatchPageTile[] | undefined) ?? []).find((t) => t.id === LIGHT) ?? ({} as WatchPageTile); },
  } as unknown as TileSettingsHost;
  const shown: EditorLevel[] = [];
  const picked: string[] = [];
  const links: TileLayerLinks = {
    get design() { return readTileDesign(base.tile); },
    zones: 0,
    pickLayer: (role) => picked.push(role),
    pickLayerId: (id) => picked.push(id),
    reset: () => undefined,
    pickZones: () => undefined,
    get custom() { return tileHasCustomLayers(readTileDesign(base.tile), base.tile); },
    resetAll: () => { tileLayerEdits(base).resetAll(); },
  };
  const link: EditorLevelLink | undefined = level === undefined ? undefined : { level, show: (next) => shown.push(next) };
  const host = extendHost(base, {
    tileLayers: () => links,
    oneLook: () => true,
    ...(link === undefined ? {} : { editorLevel: () => link }),
  } as Record<string, () => unknown>) as TileSettingsHost;
  return { draft, host, shown, picked };
}

const SECTIONS = ["size", "icon", "state", "text", "action", "visibility", "border", "background"] as const;

/** The settings drawn as text, with every card open. */
function drawn(host: TileSettingsHost): string {
  vi.stubGlobal("document", { activeElement: null });
  vi.stubGlobal("HTMLElement", class {});
  return flat(renderTileSettings(host, { sections: [...SECTIONS], size: { summary: () => "6×4", body: () => html`SIZE-ROWS` } }));
}

/** The markup of one card, by its `data-sec`. */
function cardOf(text: string, section: string): string {
  const at = text.indexOf(`data-sec=tile-settings:${section} `);
  if (at < 0) return "";
  const start = text.lastIndexOf("<section", at);
  const next = text.indexOf("<section", at);
  return text.slice(start, next < 0 ? undefined : next);
}

describe("the tile settings at each level", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("Simple: Size, Icon and color, State and Action, cut to their main rows, then Want more", () => {
    const { host } = levelHost("simple");
    const text = drawn(host);
    expect(levelSections(host, SECTIONS)).toEqual(["size", "icon", "state", "action"]);
    for (const hidden of ["text", "visibility", "border", "background"]) expect(cardOf(text, hidden), hidden).toBe("");
    const icon = cardOf(text, "icon");
    // The icon picker, No icon and Default, the solid palette and Custom.
    expect(icon).toContain(">No icon</button>");
    expect(icon).toContain(">Default</button>");
    expect(icon).toContain("Custom");
    for (const gone of ["Gradient", "State icons and colors", "Icon size", "Icon shadow", "Auto glows behind the icon", "Dim when off", "Animate while on", "Tap animation"]) {
      expect(icon, gone).not.toContain(gone);
    }
    // The full solid palette, swatch for swatch.
    const solid = watchThemeSwatches(watchAddThemeOf(host.page), false);
    expect(icon.match(/class="ts-swatch /g)).toHaveLength(solid.length);
    for (const swatch of solid) expect(icon).toContain(swatch);
    // State: only what the state shows.
    const state = cardOf(text, "state");
    expect(state).toContain("Value");
    for (const gone of ["Text shadow", "State bar", "Bar color", "Reset state"]) expect(state, gone).not.toContain(gone);
    // Action: only the single tap.
    const action = cardOf(text, "action");
    expect(action).toContain("Single tap");
    expect(action).not.toContain("Ask before running");
    expect(text).not.toContain(ADVANCED_LINE_TEXT);
    // Want more, last.
    expect(text).toContain("Want more?");
    expect(text).toContain(WANT_MORE_TEXT);
    expect(text.indexOf("Want more?")).toBeGreaterThan(text.indexOf("data-sec=tile-settings:action"));
  });

  it("Advanced and Expert: every card and row, as before, every one open, and no Want more", () => {
    for (const level of ["advanced", "expert", undefined] as const) {
      const { host } = levelHost(level);
      const text = drawn(host);
      expect(levelSections(host, SECTIONS), String(level)).toEqual([...SECTIONS]);
      expect(text).toContain("Icon size");
      expect(text).toContain("Tap animation");
      expect(text).toContain("Gradient");
      expect(text).toContain("Ask before running");
      expect(cardOf(text, "border")).toContain("Style");
      expect(cardOf(text, "visibility")).not.toBe("");
      for (const section of SECTIONS.slice(1)) expect(cardOf(text, section), section).toContain(`data-open=true`);
      expect(text).not.toContain("Want more?");
      expect(text).not.toContain(ADVANCED_LINE_TEXT);
    }
  });

  it("folds only the cards drawn at the level", () => {
    const simple = levelHost("simple").host;
    expect(tileSettingsFoldIds(simple, SECTIONS).map((f) => f.section)).toEqual(["size", "icon", "state", "action"]);
    expect(tileSettingsFoldIds(levelHost("advanced").host, SECTIONS).map((f) => f.section)).toEqual([...SECTIONS]);
  });

  it("says Has Advanced settings where Simple hides a value of the tile's own, and Show goes to Advanced", () => {
    const { host, shown } = levelHost("simple", { iconShadow: true, requiresConfirmation: true, borderStyle: "line", stateBarStyle: "Fill" });
    const text = drawn(host);
    for (const section of ["icon", "action", "state", "border"]) expect(cardOf(text, section), section).toContain(ADVANCED_LINE_TEXT);
    // A hidden card is drawn only for that line.
    expect(cardOf(text, "border")).not.toContain("Border color");
    expect(cardOf(text, "background")).toBe("");
    expect(levelSections(host, SECTIONS)).toEqual(["size", "icon", "state", "action", "border"]);
    // Its Show switches the editor to Advanced; nothing is written.
    const before = host.document;
    const show = findClick(renderTileSettings(host, { sections: ["border"] }), "Show");
    show();
    expect(shown).toEqual(["advanced"]);
    expect(host.document).toBe(before);
    // Want more's button too.
    findClick(renderTileSettings(host, { sections: ["icon"] }), "Show Advanced")();
    expect(shown).toEqual(["advanced", "advanced"]);
  });

  it("counts a gradient color as Advanced in Simple, and the solid palette still shows", () => {
    const { host } = levelHost("simple", { color: "GRADIENT|#FF9F0A|#FF453A" });
    const icon = cardOf(drawn(host), "icon");
    expect(icon).toContain(ADVANCED_LINE_TEXT);
    expect(icon).not.toContain("Gradient");
  });

  it("keeps a layer's Changed in line in Simple, and its link picks the layer", () => {
    const { host, picked } = levelHost("simple");
    tileLayerEdits(host).doc((c) => {
      const name = c.elements.find((e) => e.payload.id === BASE_LAYER_IDS.name)!;
      if (name.kind === "text") name.payload.fontSize = 13;
    });
    const text = drawn(host);
    // The Text card is Simple's to hide, but the Name layer took its rows.
    expect(cardOf(text, "text")).toContain(`data-taken=name`);
    findClick(renderTileSettings(host, { sections: ["text"] }), "Name")();
    expect(picked).toEqual(["name"]);
  });
});

/** The click handler of the first button in a drawn tree whose text is
 * `words`. */
function findClick(v: unknown, words: string): () => void {
  let found: (() => void) | undefined;
  const walk = (x: unknown): void => {
    if (found !== undefined || x === null || typeof x !== "object") return;
    if (Array.isArray(x)) return x.forEach(walk);
    if ("strings" in x && "values" in x) {
      const t = x as { strings: readonly string[]; values: unknown[] };
      for (let i = 0; i < t.strings.length; i++) {
        const after = t.strings[i + 1];
        const named = after !== undefined && (after.startsWith(`>${words}</button>`) || (after === ">" && t.values[i + 1] === words));
        if (t.strings[i]!.trimEnd().endsWith("@click=") && named) {
          found = t.values[i] as () => void;
          return;
        }
      }
      t.values.forEach(walk);
    }
  };
  walk(v);
  if (found === undefined) throw new Error(`no ${words} button`);
  return found;
}

/** The first template in a drawn tree whose text holds `marker`, and its
 * function values (its event handlers), in order. */
function handlersIn(v: unknown, marker: string): ((...args: unknown[]) => unknown)[] {
  let found: { strings: readonly string[]; values: unknown[] } | undefined;
  const walk = (x: unknown): void => {
    if (found !== undefined || x === null || typeof x !== "object") return;
    if (Array.isArray(x)) return x.forEach(walk);
    if ("strings" in x && "values" in x) {
      const t = x as { strings: readonly string[]; values: unknown[] };
      if (t.strings.join("").includes(marker)) {
        found = t;
        return;
      }
      t.values.forEach(walk);
    }
  };
  walk(v);
  if (found === undefined) throw new Error(`nothing drawn with ${marker}`);
  return found.values.filter((x): x is (...args: unknown[]) => unknown => typeof x === "function");
}

describe("Reset all layers below Expert (round four, section 15.5)", () => {
  afterEach(() => vi.unstubAllGlobals());

  /** A level host whose tile has a custom layer: its name made bigger. */
  function customHost(level: EditorLevel) {
    const made = levelHost(level);
    tileLayerEdits(made.host).doc((c) => {
      const name = c.elements.find((e) => e.payload.id === BASE_LAYER_IDS.name)!;
      if (name.kind === "text") name.payload.fontSize = 13;
    });
    expect(readTileDesign(made.host.tile)).toBeDefined();
    return made;
  }

  for (const level of ["simple", "advanced"] as const) {
    it(`shows the line on a custom tile at ${level}, its Reset all one undo step and its Edit in Expert the level switch`, () => {
      const { host, draft, shown } = customHost(level);
      const text = drawn(host);
      expect(text).toContain("data-custom-layers");
      expect(text).toContain(CUSTOM_LAYERS_LINE_TEXT);
      expect(text).toContain(">Reset all</button>");
      expect(text).toContain(">Edit in Expert</button>");
      // First in the settings, above every card.
      expect(text.indexOf("data-custom-layers")).toBeLessThan(text.indexOf("<section"));
      vi.stubGlobal("document", { activeElement: null });
      vi.stubGlobal("HTMLElement", class {});
      const tree = () => renderTileSettings(host, { sections: [...SECTIONS], size: { summary: () => "6×4", body: () => html`SIZE-ROWS` } });
      const [reset, expert] = handlersIn(tree(), "data-custom-layers");
      expert!();
      expect(shown).toEqual(["expert"]);
      reset!();
      expect(Object.hasOwn(host.tile, "design")).toBe(false);
      expect(drawn(host)).not.toContain("data-custom-layers");
      // One undo brings the layers back.
      expect(draft.undo()).toBe(true);
      expect(readTileDesign(host.tile)!.owned).toEqual(["name"]);
    });
  }

  it("leaves the line out at Expert, where the Layers card has Reset all layers, and on a plain tile", () => {
    expect(drawn(customHost("expert").host)).not.toContain("data-custom-layers");
    expect(drawn(levelHost("simple").host)).not.toContain("data-custom-layers");
    expect(drawn(levelHost("advanced").host)).not.toContain("data-custom-layers");
  });
});
