// The one color picker every card of the page editor draws
// (`color-picker.ts`): the tile card's colors, the group card, a smart
// rule's header, the special tasks (quick actions, calendars, a camera
// grid's border) and the page switcher. Each reads the same way: Form where
// the key has forms, then the Default chip leading the swatches, then
// Custom; the chip always says "Default" and its tooltip says what that is.
//
// No DOM: the cards are drawn to their Lit templates and read as text, and a
// control is worked by calling the handler the template holds for it.

import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { SymbolBrowser } from "../src/symbols.js";
import { COLOR_DEFAULT_LABEL, colorPickerView } from "../src/watch-pages/color-picker.js";
import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { NO_ICONS, type TileSettingsHost } from "../src/watch-pages/editor-host.js";
import { findWatchPage } from "../src/watch-pages/edit.js";
import { renderPickedGroupCard } from "../src/watch-pages/group-settings.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { type SwitcherSettingsHost, renderSwitcherSettings } from "../src/watch-pages/switcher-settings.js";
import { renderTileSettings } from "../src/watch-pages/tile-settings.js";

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

/** The click handler of the smallest template whose text holds `marker`. */
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

/** One drawn picker: its heading (or Form title), whether it has a Default
 * chip, and the order its parts come in. */
interface Picker {
  heading: string;
  parts: ("form" | "default" | "swatches" | "custom")[];
  defaultText: string | undefined;
  defaultTitle: string | undefined;
}

/**
 * Every picker in a drawn card, read off its swatch group: the heading and
 * Form switch just before it, the Default chip inside it, and the Custom
 * box just after it.
 */
function pickers(text: string): Picker[] {
  const out: Picker[] = [];
  const marker = `<div class="ts-swatches"`;
  let at = text.indexOf(marker);
  while (at >= 0) {
    const next = text.indexOf(marker, at + marker.length);
    const before = text.slice(0, at);
    const group = text.slice(at, text.indexOf(`</div>`, at));
    const after = text.slice(at, next < 0 ? undefined : next);
    const heading = /<div class="ts-sub-h"><span>([^<]*)<\/span><\/div>/g;
    let last: RegExpExecArray | null = null;
    for (let m = heading.exec(before); m !== null; m = heading.exec(before)) last = m;
    const lastHeadAt = last === null ? -1 : last.index;
    const formAt = before.lastIndexOf(`role="radiogroup" aria-label=Form`);
    const parts: Picker["parts"] = [];
    if (formAt > lastHeadAt && formAt >= 0) parts.push("form");
    const chip = /<button type="button" class="pe-chip ts-color-default[^"]*"[^>]*title=([^>]*?)\s*@click=>([^<]*)<\/button>/.exec(group);
    const inGroup: [number, "default" | "swatches"][] = [];
    if (chip !== null) inGroup.push([group.indexOf("ts-color-default"), "default"]);
    if (group.includes(`class="ts-swatch `)) inGroup.push([group.indexOf(`class="ts-swatch `), "swatches"]);
    parts.push(...inGroup.sort((a, b) => a[0] - b[0]).map(([, p]) => p));
    if (/<span>Custom<\/span>|>Custom</.test(after.slice(group.length))) parts.push("custom");
    out.push({ heading: last?.[1] ?? "", parts, defaultText: chip?.[2], defaultTitle: chip?.[1] });
    at = next;
  }
  return out;
}

/** Each picker reads Form (where it has one), Default, swatches, Custom, and
 * its chip says Default with a tooltip saying what that is. */
function expectSameShape(list: Picker[], withDefault = true): void {
  expect(list.length).toBeGreaterThan(0);
  for (const p of list) {
    const want = withDefault ? ["default", "swatches", "custom"] : ["swatches", "custom"];
    expect(p.parts.filter((x) => x !== "form"), p.heading).toEqual(want);
    if (p.parts.includes("form")) expect(p.parts[0], p.heading).toBe("form");
    if (withDefault) {
      expect(p.defaultText, p.heading).toBe(COLOR_DEFAULT_LABEL);
      expect(p.defaultTitle?.trim().length ?? 0, p.heading).toBeGreaterThan(3);
      expect(p.defaultTitle, p.heading).not.toMatch(/ - |–|—/);
    }
  }
}

// ── hosts on a real draft ────────────────────────────────────────────────

// The views ask for the focused field (`document.activeElement`); Node has
// no document.
(globalThis as { document?: unknown }).document ??= { activeElement: null };
(globalThis as { HTMLElement?: unknown }).HTMLElement ??= class {};
(globalThis as { HTMLInputElement?: unknown }).HTMLInputElement ??= class {};

const PAGE = "C3A0E000-0000-4000-8000-0000000000C1";
const TILE = "C3A0E000-0000-4000-8000-0000000000C2";
const TILE2 = "C3A0E000-0000-4000-8000-0000000000C3";
const GROUP = "C3A0E000-0000-4000-8000-0000000000C4";

function tileHost(items: WatchPageTile[], page: Record<string, unknown> = {}, states: Record<string, unknown> = {}) {
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [{ id: PAGE, name: "Living", items, ...page }] } as WatchPagesDocument, 1);
  const pageNow = () => (draft.document.pages as WatchPage[])[0]!;
  const host = {
    hass: { states },
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    get document() { return draft.document; },
    device: undefined,
    pageId: PAGE,
    get page() { return pageNow(); },
    otherPages: [],
    catalog: undefined,
    cameraRefreshDefaults: { on: true, debounce: "5" },
    behavior: undefined,
    musicAssistant: undefined,
    cloudTTS: undefined,
    templateRenders: new Map(),
    deviceSiblings: () => ({ selects: [], switches: [], sensors: [], all: [] }),
    loadImageSize: async () => undefined,
    smartRuleId: undefined,
    selectSmartRule: () => undefined,
    busy: false,
    uiState: new Map<string, unknown>(),
    apply: (next: WatchPagesDocument) => draft.apply(next),
    endCoalesce: () => draft.endCoalesce(),
    selectTile: () => undefined,
    requestUpdate: () => undefined,
    tileId: TILE,
    get tile() { return ((pageNow().items as WatchPageTile[] | undefined) ?? []).find((t) => t.id === TILE) ?? ({} as WatchPageTile); },
  };
  return { host: host as unknown as TileSettingsHost, page: pageNow, tile: () => host.tile };
}

function switcherHost(extra: Record<string, unknown> = {}) {
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [{ hideFromSwitcher: false, id: PAGE, items: [], name: "Living", ...extra }] }, 3);
  const h: SwitcherSettingsHost = {
    pageId: PAGE,
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    uiState: new Map(),
    get page() { return findWatchPage(draft.document, PAGE)!; },
    busy: false,
    edit: (change, opts) => draft.apply(change(draft.document), opts?.typing === true ? { coalesce: "typing" } : undefined),
    endCoalesce: () => draft.endCoalesce(),
    requestUpdate: () => undefined,
  };
  return { h, page: () => findWatchPage(draft.document, PAGE)! };
}

// ── the picker itself ────────────────────────────────────────────────────

describe("colorPickerView", () => {
  const base = {
    color: "#FF0000",
    swatches: ["#FF0000", "#00FF00"],
    swatchesLabel: "Test colors",
    pickSwatch: () => undefined,
    custom: { shown: "#FF0000", pick: () => undefined },
    wrap: (body: unknown) => body as never,
  };

  it("draws the heading, Form, Default leading the swatches, then Custom", () => {
    const text = flat(colorPickerView({
      ...base,
      label: "Border color",
      default: { title: "The tile's color", on: false, pick: () => undefined },
      form: { shown: "solid", forms: ["solid", "gradient", "rainbow"], pick: () => undefined },
    }));
    const order = ["<span>Border color</span>", "aria-label=Form", ">Solid<", ">Gradient<", ">Rainbow<", ">Default</button>", "title=#FF0000", "title=#00FF00", "Custom"];
    let last = -1;
    for (const part of order) {
      const at = text.indexOf(part, last + 1);
      expect(at, part).toBeGreaterThan(last);
      last = at;
    }
    expect(text).toContain("aria-label=Default border color");
    expect(text).toContain("title=The tile's color");
    expectSameShape(pickers(text));
  });

  it("leaves Form out with one form, and Default out where there is none", () => {
    const text = flat(colorPickerView({ ...base, label: "Color", form: { shown: "solid", forms: ["solid"], pick: () => undefined } }));
    expect(text).not.toContain("aria-label=Form");
    expect(text).not.toContain("ts-color-default");
    expectSameShape(pickers(text), false);
  });

  it("lights Default while it is what is drawn", () => {
    const on = flat(colorPickerView({ ...base, default: { title: "x y z", on: true, pick: () => undefined } }));
    expect(on).toContain(`class="pe-chip ts-color-default on" aria-pressed=true`);
  });
});

// ── every card's pickers ─────────────────────────────────────────────────

describe("every card draws the same picker", () => {
  it("the tile card: tile color, label color, border, pattern and effect", () => {
    const { host } = tileHost([{
      id: TILE, entityId: "light.desk", gridCol: 0, gridRow: 0, colSpan: 2, rowSpan: 2,
      borderStyle: "line", backgroundPattern: "dots", tileAnimation: "shimmer",
    }]);
    const text = flat(renderTileSettings(host, { sections: ["icon", "text", "border", "background"] }));
    const list = pickers(text);
    expectSameShape(list);
    expect(list.map((p) => p.heading)).toEqual(expect.arrayContaining(["Label color", "Border color", "Pattern color", "Effect color"]));
    // Border, pattern and effect take Solid, Gradient (and Rainbow); the
    // tile's own color too, its switch titled Color as the card's heading.
    expect(list.filter((p) => p.parts[0] === "form").map((p) => p.heading)).toEqual(["Border color", "Pattern color", "Effect color"]);
    const own = text.indexOf(`role="radiogroup" aria-label=Color`);
    expect(own).toBeGreaterThan(-1);
    expect(text.indexOf("ts-color-default", own)).toBeLessThan(text.indexOf("Custom", own));
    for (const old of ["Default gray", "Tile color<", "Theme color<", "Default color<"]) expect(text).not.toContain(old);
  });

  it("a header tile's color", () => {
    const { host } = tileHost([{ id: TILE, entityId: "divider.line.light", gridCol: 0, gridRow: 0, colSpan: 4, rowSpan: 1 }]);
    const list = pickers(flat(renderTileSettings(host, { sections: ["header"] })));
    expect(list.map((p) => p.heading)).toEqual(["Color"]);
    expectSameShape(list);
  });

  it("the group card: Pattern and Effect named as the tile card names them", () => {
    const { host, page } = tileHost(
      [
        { id: TILE, entityId: "light.a", gridCol: 0, gridRow: 0, colSpan: 2, rowSpan: 2, groupId: GROUP },
        { id: TILE2, entityId: "light.b", gridCol: 2, gridRow: 0, colSpan: 2, rowSpan: 2, groupId: GROUP },
      ],
      { groups: [{ id: GROUP, backgroundPattern: "dots", backgroundPatternColor: "#FF0000", overlayStyle: "snow", overlayColor: "#FFFFFF", overlaySpeed: 1, overlayIntensity: 1, overlaySize: 1 }] },
    );
    const draw = () => renderPickedGroupCard(host, [TILE, TILE2], { pick: () => undefined });
    const text = flat(draw());
    const list = pickers(text);
    expect(list.map((p) => p.heading)).toEqual(["Pattern color", "Effect color"]);
    expectSameShape(list);
    expect(text).toContain("<span>Pattern</span>");
    expect(text).toContain("<span>Effect</span>");
    expect(text).not.toContain("Animated overlay");
    expect(text).not.toContain("Overlay color");
    // The effect offers Rainbow, which the watch cycles; the pattern does not.
    expect(list[1]!.parts[0]).toBe("form");
    expect(list[0]!.parts[0]).not.toBe("form");
    const group = () => (page().groups as Record<string, unknown>[])[0]!;
    // White is the effect's Default, and lit: pressing it writes nothing.
    expect(text).toMatch(/class="pe-chip ts-color-default on" aria-pressed=true\s+aria-label=Default effect color/);
    click(draw(), ">Rainbow<");
    expect(group().overlayColor).toBe("#RAINBOW");
    click(draw(), "aria-label=Default effect color");
    expect(group().overlayColor).toBe("#FFFFFF");
    // The pattern's Default removes its key, the watch's gray.
    expect(text).toMatch(/class="pe-chip ts-color-default " aria-pressed=false\s+aria-label=Default pattern color/);
    click(draw(), "aria-label=Default pattern color");
    expect(Object.hasOwn(group(), "backgroundPatternColor")).toBe(false);
  });

  it("a remote's quick actions: Default is the remote's accent, stored as an empty color", () => {
    const { host, tile } = tileHost([{
      id: TILE, entityId: "remote.tv", gridCol: 0, gridRow: 0, colSpan: 2, rowSpan: 2,
      remoteLauncherScriptIds: ["script.movie"], remoteLauncherLabels: ["Movie"], remoteLauncherIcons: ["film"], remoteLauncherColors: ["#FF0000"],
    }], {}, { "remote.tv": { entity_id: "remote.tv", state: "on", attributes: {} } });
    const draw = () => renderTileSettings(host, { sections: ["special"] });
    const list = pickers(flat(draw()));
    const quick = list.filter((p) => p.defaultTitle === "The remote's accent color");
    expect(quick).toHaveLength(1);
    expectSameShape(quick);
    click(draw(), "The remote's accent color");
    expect(tile().remoteLauncherColors).toEqual([""]);
  });

  it("a calendar's color: Default removes its entry, and Custom is offered", () => {
    const { host, tile } = tileHost([{
      id: TILE, entityId: "calendar.home", gridCol: 0, gridRow: 0, colSpan: 2, rowSpan: 2, calendarSourceColors: { "calendar.home": "#FF0000" },
    }]);
    const draw = () => renderTileSettings(host, { sections: ["special"] });
    const list = pickers(flat(draw()));
    expect(list).toHaveLength(1);
    expectSameShape(list);
    click(draw(), "aria-label=Default color");
    expect(Object.hasOwn(tile(), "calendarSourceColors")).toBe(false);
  });

  it("a camera grid's border: Default is white, Rainbow is a form", () => {
    const { host, tile } = tileHost([{
      id: TILE, entityId: "multicam.porch", gridCol: 0, gridRow: 0, colSpan: 4, rowSpan: 2,
      cameraGroupIds: ["camera.a", "camera.b"], multiCamBorderEnabled: true,
    }]);
    const draw = () => renderTileSettings(host, { sections: ["special"] });
    const list = pickers(flat(draw())).filter((p) => p.heading === "Border color");
    expect(list).toHaveLength(1);
    expectSameShape(list);
    expect(list[0]!.parts[0]).toBe("form");
    // The stored default (no key) is white: lit, and pressing it writes nothing.
    expect(flat(draw())).toMatch(/class="pe-chip ts-color-default on" aria-pressed=true\s+aria-label=Default border color/);
    click(draw(), "aria-label=Default border color");
    expect(Object.hasOwn(tile(), "multiCamBorderColor")).toBe(false);
    click(draw(), ">Rainbow<");
    expect(tile().multiCamBorderColor).toBe("#RAINBOW");
    click(draw(), ">Solid<");
    expect(tile().multiCamBorderColor).toBe("#FFFFFF");
  });

  it("the page switcher's color", () => {
    const { h, page } = switcherHost({ switcherColor: "#FF9F0A" });
    const list = pickers(flat(renderSwitcherSettings(h)));
    expect(list.map((p) => p.heading)).toEqual(["Color"]);
    expectSameShape(list);
    click(renderSwitcherSettings(h), "aria-label=Default color");
    expect(Object.hasOwn(page(), "switcherColor")).toBe(false);
    click(renderSwitcherSettings(h), `class="ts-swatch `);
    expect(page().switcherColor).toMatch(/^#[0-9A-F]{6}$/);
  });
});

// ── no card builds its own ───────────────────────────────────────────────

describe("no card draws a picker of its own", () => {
  it("every swatch row and Custom box comes from color-picker.ts", () => {
    const dir = new URL("../src/watch-pages/", import.meta.url);
    for (const name of readdirSync(dir).filter((f) => f.endsWith(".ts") && f !== "color-picker.ts")) {
      const source = readFileSync(new URL(name, dir), "utf8");
      expect(source, name).not.toMatch(/\bswatchRow\(/);
      expect(source, name).not.toMatch(/colorField\("Custom"/);
      for (const old of ["Default gray", ">Accent<", "Default (white", ">Tile color<", ">Theme color<", ">Default color<"]) {
        expect(source, `${name}: ${old}`).not.toContain(old);
      }
    }
  });
});
