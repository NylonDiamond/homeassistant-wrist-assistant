// Several tiles picked together and edited at once (`multi-pick.ts`), and a
// choice tried before it is picked (`tryTileEdit`): each setting shows the
// value the picked tiles share or Mixed, a pick writes it to every one of
// them in one undo step, settings that are one tile's are named on a grey
// line instead, and pointing at a choice draws it on every picked tile
// without touching the draft.
//
// No DOM: the settings are drawn to their Lit templates and read as text, and
// a button is pressed by calling the handler its template holds.

import { describe, expect, it } from "vitest";

import { SymbolBrowser } from "../src/symbols.js";
import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { NO_ICONS, type TilePick, type TileSettingsHost, extendHost } from "../src/watch-pages/editor-host.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { acrossPicked, editPickedTiles, onlyTileChanged, pickedValue } from "../src/watch-pages/multi-pick.js";
import { endTileTry, watchTriedTile, watchTryLabel } from "../src/watch-pages/picture-choice.js";
import { editTile, setWatchTileColor, watchTileIconGlow, watchTileIconSettings } from "../src/watch-pages/tile-settings-model.js";
import { pickedInspectorParts, renderTileInspector } from "../src/watch-pages/tile-settings.js";

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

/** The `event` handler of the smallest template whose text holds `marker`
 * and binds that event itself. */
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

const fire = (root: unknown, marker: string, event = "@click=") =>
  handler(root, marker, event)({ type: event.slice(1, -1), currentTarget: null, relatedTarget: null, stopPropagation() {}, preventDefault() {} });

// ── a host over several tiles ────────────────────────────────────────────

const PAGE_ID = "C3A0E000-0000-4000-8000-0000000000AA";
const A = "C3A0E000-0000-4000-8000-000000000001";
const B = "C3A0E000-0000-4000-8000-000000000002";
const C = "C3A0E000-0000-4000-8000-000000000003";

const tile = (id: string, entityId: string, row: number, extra: Record<string, unknown> = {}): WatchPageTile => ({
  id, entityId, gridCol: 0, gridRow: row, colSpan: 3, rowSpan: 2, ...extra,
});

const STATES = {
  "light.desk": { entity_id: "light.desk", state: "on", attributes: { friendly_name: "Desk", brightness: 128 } },
  "light.hall": { entity_id: "light.hall", state: "off", attributes: { friendly_name: "Hall" } },
  "switch.fan": { entity_id: "switch.fan", state: "on", attributes: { friendly_name: "Fan" } },
};

/**
 * A tile host as the page editor builds one, One Look on: over `picked` (two
 * or more ids, the first the primary) with `picked` set, as `pickHost` does,
 * else over the first tile alone.
 */
function pickHost(items: WatchPageTile[], picked: string[]): { host: TileSettingsHost; draft: WatchPagesDraft; updates: () => number } {
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [{ id: PAGE_ID, name: "Living", items }] }, 1);
  const pageNow = () => (draft.document.pages as WatchPage[])[0]!;
  const tileOf = (id: string) => ((pageNow().items as WatchPageTile[] | undefined) ?? []).find((x) => x.id === id);
  let updates = 0;
  let at: string | undefined;
  const base = {
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
    oneLook: true,
  } as unknown as TileSettingsHost;
  const pick: TilePick = {
    get ids() { return picked; },
    get tiles() { return picked.map((id) => tileOf(id)!); },
    as: (id, run) => {
      const was = at;
      at = id;
      try {
        return run();
      } finally {
        at = was;
      }
    },
  };
  const host = extendHost(base, {
    tileId: () => at ?? picked[0]!,
    tile: () => tileOf(at ?? picked[0]!) ?? ({} as WatchPageTile),
    ...(picked.length >= 2 ? { picked: () => pick } : {}),
  }) as TileSettingsHost;
  return { host, draft, updates: () => updates };
}

const tileIn = (d: WatchPagesDocument, id: string) => ((d.pages as WatchPage[])[0]!.items as WatchPageTile[]).find((t) => t.id === id)!;

/** The text of one setting's field, from its title to the next field. */
function field(text: string, label: string): string {
  const at = text.indexOf(`aria-label=${label} `);
  if (at < 0) throw new Error(`no field ${label}`);
  const start = text.lastIndexOf(`<div class="field`, at);
  return text.slice(start, text.indexOf(`<div class="field`, at));
}

// ── the rules ────────────────────────────────────────────────────────────

describe("what a setting shows for several tiles", () => {
  const a = tile(A, "light.desk", 0, { borderStyle: "line" });
  const b = tile(B, "light.hall", 2, { borderStyle: "line" });
  const c = tile(C, "switch.fan", 4, { borderStyle: "none" });

  it("is the value every tile reads, or Mixed when two differ", () => {
    expect(pickedValue([a, b], (t) => t.borderStyle)).toEqual({ mixed: false, value: "line" });
    expect(pickedValue([a, b, c], (t) => t.borderStyle)).toEqual({ mixed: true });
    // Read values are compared as JSON, so two equal glows agree.
    expect(pickedValue([a, b], (t) => watchTileIconGlow(t))).toEqual({ mixed: false, value: watchTileIconGlow(a) });
    expect(pickedValue([], (t) => t.id)).toEqual({ mixed: true });
  });
});

describe("one edit made on several tiles", () => {
  const three = () => [tile(A, "light.desk", 0), tile(B, "light.hall", 2), tile(C, "switch.fan", 4)];
  const doc = (): WatchPagesDocument => ({ schemaVersion: 1, pages: [{ id: PAGE_ID, name: "Living", items: three() }] });

  it("makes it on each tile in turn, as one document", () => {
    const before = doc();
    const after = editPickedTiles(before, PAGE_ID, [A, C], (d, id) => setWatchTileColor(d, PAGE_ID, id, "#FF0000"));
    expect(watchTileIconSettings(tileIn(after, A)).color).toBe("#FF0000");
    expect(watchTileIconSettings(tileIn(after, C)).color).toBe("#FF0000");
    expect(tileIn(after, B)).toBe(tileIn(before, B));
  });

  it("refuses the whole edit when a step reaches past its own tile", () => {
    const before = doc();
    // Written for A whatever tile it is run for: run for B, it changes A.
    const eager = (d: WatchPagesDocument) => editTile(d, PAGE_ID, A, (t) => ({ ...t, n: Number(t.n ?? 0) + 1 }));
    expect(editPickedTiles(before, PAGE_ID, [A, B], (d) => eager(d))).toBe(before);
    expect(onlyTileChanged(before, eager(before), PAGE_ID, A)).toBe(true);
    expect(onlyTileChanged(before, eager(before), PAGE_ID, B)).toBe(false);
    // A step that starts from another document drops the steps before it.
    expect(editPickedTiles(before, PAGE_ID, [A, B], (_d, id) => setWatchTileColor(before, PAGE_ID, id, "#0000FF"))).toBe(before);
    // The page's own keys are not a tile's.
    const renamed = (d: WatchPagesDocument) => ({ ...d, pages: [{ ...(d.pages as WatchPage[])[0]!, name: "Den" }] });
    expect(onlyTileChanged(before, renamed(before), PAGE_ID, A)).toBe(false);
  });

  it("runs an edit written for the host's tile on every picked tile", () => {
    const { host } = pickHost(three(), [A, C]);
    const edit = acrossPicked(host, (d) => editTile(d, host.pageId, host.tileId, (t) => ({ ...t, iconShadow: true })));
    const after = edit(host.document);
    expect(tileIn(after, A).iconShadow).toBe(true);
    expect(tileIn(after, C).iconShadow).toBe(true);
    expect(tileIn(after, B).iconShadow).toBeUndefined();
  });
});

describe("the inspector over several tiles", () => {
  const items = () => [
    tile(A, "light.desk", 0, { iconGlow: { mode: "on", size: 140 }, color: "#FF453A", borderStyle: "line" }),
    tile(B, "light.hall", 2, { iconGlow: { mode: "off", size: 60 }, color: "#30D158", borderStyle: "line" }),
  ];

  it("shows Mixed where the tiles differ, the shared value where they agree, and marks no choice of a Mixed one", () => {
    const { host } = pickHost(items(), [A, B]);
    const text = flat(renderTileInspector(host));
    // One glows, one does not: the switch says Mixed.
    expect(text).toContain(`<span>Glow icon when on <em class="pc-mixed">Mixed</em></span>`);
    // Both draw a line border: Style shows it, with no Mixed.
    const style = field(text, "Style");
    expect(style).toContain(`class="pc-opt on" aria-checked=true\n          data-value=line`);
    expect(style).not.toContain("Mixed");
    // The tile color differs: no swatch is on, and the row says Mixed.
    expect(text).toMatch(/<div class="ts-swatches" role="group" aria-label=[^>]*>\s*<em class="pc-mixed">Mixed<\/em>/);
  });

  it("writes a pick to every picked tile in one undo step, each keeping the rest of its own", () => {
    const { host, draft } = pickHost(items(), [A, B]);
    const before = draft.document;
    handler(renderTileInspector(host), "Glow icon when on", "@change=")({ target: { checked: true } });
    for (const id of [A, B]) expect(watchTileIconGlow(tileIn(draft.document, id)).mode).toBe("auto");
    // Each tile's own glow size stays.
    expect(watchTileIconGlow(tileIn(draft.document, A)).size).toBe(140);
    expect(watchTileIconGlow(tileIn(draft.document, B)).size).toBe(60);
    draft.undo();
    expect(draft.document).toEqual(before);
    expect(draft.canUndo).toBe(false);
  });

  it("puts each tile back to its own kind's color with Default", () => {
    const { host, draft } = pickHost([
      tile(A, "light.desk", 0, { color: "#FF453A" }),
      tile(C, "switch.fan", 4, { color: "#FF453A" }),
    ], [A, C]);
    const one = (id: string, entityId: string) => {
      const single = pickHost([tile(id, entityId, 0, { color: "#FF453A" })], [id]);
      fire(renderTileInspector(single.host), `aria-label=Default color\n`);
      return watchTileIconSettings(tileIn(single.draft.document, id)).color;
    };
    fire(renderTileInspector(host), `aria-label=Default color\n`);
    expect(watchTileIconSettings(tileIn(draft.document, A)).color).toBe(one(A, "light.desk"));
    expect(watchTileIconSettings(tileIn(draft.document, C)).color).toBe(one(C, "switch.fan"));
  });

  it("leaves out what is one tile's, named on each group's grey line", () => {
    const { host } = pickHost(items(), [A, B]);
    const { groups, hidden } = pickedInspectorParts(host);
    const parts = groups.flatMap((g) => g.parts);
    for (const p of ["color", "icon", "glow", "background", "border", "text", "state", "tapAnimation"] as const) expect(parts).toContain(p);
    for (const p of ["action", "visibility", "size"] as const) expect(parts).not.toContain(p);
    expect(hidden.get("tap")).toEqual(["action", "visibility"]);
    const text = flat(renderTileInspector(host));
    expect(text).toContain(`<p class="hint keep ts-picked-off">Shown when one tile is picked: Action, Show tile.</p>`);
    // State icons and colors are per state of one entity.
    expect(text).toContain("State icons and colors: shown when one tile is picked.");
    expect(text).not.toContain(`class="ts-state-row`);
  });

  it("keeps State out for tiles of different kinds, whose rows differ", () => {
    const { host } = pickHost([tile(A, "light.desk", 0), tile(C, "switch.fan", 4)], [A, C]);
    expect(pickedInspectorParts(host).groups.flatMap((g) => g.parts)).not.toContain("state");
  });
});

// ── trying a choice ──────────────────────────────────────────────────────

describe("pointing at a choice", () => {
  const items = () => [tile(A, "light.desk", 0), tile(B, "light.hall", 2)];

  it("draws it on every picked tile, names it for the stage, and never touches the draft", () => {
    const { host, draft, updates } = pickHost(items(), [A, B]);
    const before = draft.document;
    const drawn = renderTileInspector(host);
    fire(drawn, `data-value=keep `, "@pointerenter=");
    expect(watchTileIconSettings(watchTriedTile(host.uiState, A)!).dimWhenOff.value).toBe(false);
    expect(watchTileIconSettings(watchTriedTile(host.uiState, B)!).dimWhenOff.value).toBe(false);
    expect(watchTryLabel(host.uiState)).toBe("When it is off: Keep color");
    expect(draft.document).toBe(before);
    expect(draft.canUndo).toBe(false);
    expect(updates()).toBeGreaterThan(0);
    // Leaving the row draws what is stored.
    fire(drawn, `role="radiogroup" aria-label=When it is off`, "@pointerleave=");
    expect(watchTriedTile(host.uiState, A)).toBeUndefined();
    expect(watchTryLabel(host.uiState)).toBeUndefined();
  });

  it("tries a swatch and the Default chip through the edit their press makes, and a press ends the try", () => {
    const { host, draft } = pickHost([tile(A, "light.desk", 0)], [A]);
    const drawn = renderTileInspector(host);
    fire(drawn, `class="ts-swatch " aria-pressed=false\n        title=#`, "@pointerenter=");
    const label = watchTryLabel(host.uiState)!;
    expect(label).toMatch(/^Color: #[0-9A-F]{6}$/);
    const tried = watchTriedTile(host.uiState, A)!;
    expect(watchTileIconSettings(tried).color).toBe(label.slice("Color: ".length));
    expect(draft.canUndo).toBe(false);
    fire(drawn, `aria-label=Default color\n`, "@pointerenter=");
    expect(watchTryLabel(host.uiState)).toBe("Color: Default");
    // A press stores it and ends the try.
    fire(drawn, `aria-label=Default color\n`);
    expect(draft.canUndo).toBe(true);
    expect(watchTriedTile(host.uiState, A)).toBeUndefined();
  });

  it("is stale once the draft moves on", () => {
    const { host, draft } = pickHost(items(), [A, B]);
    fire(renderTileInspector(host), `data-value=keep `, "@pointerenter=");
    expect(watchTriedTile(host.uiState, A, draft.document)).toBeDefined();
    draft.apply(setWatchTileColor(draft.document, PAGE_ID, B, "#FF0000"));
    expect(watchTriedTile(host.uiState, A, draft.document)).toBeUndefined();
    expect(watchTryLabel(host.uiState, draft.document)).toBeUndefined();
    endTileTry(host);
  });
});
