// The menu editor's page: the three menus stacked on one page, each with a
// watch-shaped preview, the ring placed on a screen of the watch's real
// proportions, and the page switcher's preview drawn from the pages record.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { HassLike } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import { SymbolBrowser } from "../src/symbols.js";
import { WATCH_SWITCHER_COLORS, watchSwitcherPages } from "../src/watch-menus/menu-editor.js";
import {
  MENUS_SECTIONS,
  type MenuSwitcherPage,
  type MenusViewHost,
  menuScreenPoint,
  menusPreviewScale,
  renderMenus,
  switcherRingPoint,
} from "../src/watch-menus/menu-view.js";
import { type MenusDocument, watchMenuRingPoint } from "../src/watch-menus/model.js";

const DEFAULTS = JSON.parse(readFileSync(join(__dirname, "fixtures-menus", "01-defaults.json"), "utf8")) as MenusDocument;

/** A template flattened to its markup, values in place (a bound attribute
 * comes out unquoted). */
const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" ? String(v) : "";
};

const NO_ICONS = { render: () => undefined, available: () => false, names: () => [] } as unknown as IconProvider;

function host(document: MenusDocument, switcherPages: readonly MenuSwitcherPage[] = [], scale = 1.5): MenusViewHost {
  return {
    hass: { states: {} } as unknown as HassLike,
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    document,
    targets: { pages: [], statusPages: [], httpActions: [] },
    catalogKnown: true,
    busy: false,
    uiState: new Map(),
    screen: { width: 208, height: 248 },
    scale,
    switcherPages,
    edit: () => false,
    endCoalesce: () => undefined,
    requestUpdate: () => undefined,
  };
}

const count = (text: string, part: string) => text.split(part).length - 1;

describe("the menus page", () => {
  it("draws all three menus on one page, in order, with no tabs between them", () => {
    const out = flat(renderMenus(host(DEFAULTS)));
    const at = MENUS_SECTIONS.map(([id, label]) => {
      expect(out).toContain(`id=me-${id} `);
      expect(out).toContain(`>${label}</h3>`);
      return out.indexOf(`id=me-${id} `);
    });
    expect(at).toEqual([...at].sort((a, b) => a - b));
    expect(out).not.toContain('role="tablist"');
    expect(out).not.toContain('role="tab"');
  });

  it("gives each section a watch preview beside its controls", () => {
    const out = flat(renderMenus(host(DEFAULTS)));
    expect(count(out, 'class="wa-watch"')).toBe(3);
    expect(count(out, 'class="me-split"')).toBe(3);
    expect(out).toContain("aria-label=Anywhere menu on the watch");
    expect(out).toContain("aria-label=Page switcher on the watch");
    // The Anywhere menu keeps its slot list, its slot editor and its Style.
    expect(out).toContain("Add slot");
    expect(out).toContain(">Style</h4>");
    // The screen is drawn at the watch's proportions, 208 by 248 points, at
    // the page editor's scale, and the dots follow that scale.
    expect(out).toContain("width:312px;height:372px;--me-s:1.5");
    expect(out).toContain("viewBox=0 0 208 248");
    expect(flat(renderMenus(host(DEFAULTS, [], 1.25)))).toContain("width:260px;height:310px;--me-s:1.25");
  });

  it("lays each section out in three columns: watch, list, settings", () => {
    const out = flat(renderMenus(host(DEFAULTS, [{ id: "a", name: "Kitchen", text: "Kitchen", icon: "house", color: "#FF0000" }])));
    expect(count(out, 'class="me-preview"')).toBe(3);
    expect(count(out, 'class="me-listcol"')).toBe(3);
    expect(count(out, 'class="me-formcol "')).toBe(3);
    const columns = (id: string) => {
      const section = out.slice(out.indexOf(`id=me-${id} `));
      const end = section.indexOf("</section>");
      const list = section.indexOf('class="me-listcol"');
      const form = section.indexOf('class="me-formcol ');
      return { list: section.slice(list, form), form: section.slice(form, end) };
    };
    // The Anywhere menu's Style sits under the slot's settings, not the list.
    const anywhere = columns("anywhere");
    expect(anywhere.list).toContain("Add slot");
    expect(anywhere.form).toContain(">Style</h4>");
    expect(anywhere.form).toContain('class="me-slot sec-b"');
    // The Entity quick menu's pickers sit above its list.
    const entity = columns("entity");
    expect(entity.list).toContain("By type");
    expect(entity.list).toContain(">Type<");
    expect(entity.list.indexOf(">Type<")).toBeLessThan(entity.list.indexOf("Add slot"));
    // The page switcher lists its pages, its Glow and Selected Scale on the right.
    const switcher = columns("switcher");
    expect(switcher.list).toContain("Kitchen");
    expect(switcher.form).toContain("Glow");
    expect(switcher.form).toContain("Selected Scale");
  });

  it("lists the page switcher's pages on its screen, or says there are none", () => {
    const pages: MenuSwitcherPage[] = [
      { id: "a", name: "Kitchen", text: "Kitchen", icon: "house", color: "#FF0000" },
      { id: "b", name: "Garden", icon: "leaf", color: "#00FF00" },
    ];
    const out = flat(renderMenus(host(DEFAULTS, pages)));
    expect(out).toContain("title=Kitchen>Kitchen</span>");
    expect(out).toContain('class="me-dot me-page-dot"');
    expect(flat(renderMenus(host(DEFAULTS)))).toContain("No pages in the switcher yet.");
  });
});

describe("the watch screen", () => {
  it("draws at the page editor's scale, smaller under 1100 px", () => {
    expect(menusPreviewScale(1500, false)).toBe(1.5);
    expect(menusPreviewScale(1099, false)).toBe(1.25);
    expect(menusPreviewScale(1100, true)).toBe(1.5);
    expect(menusPreviewScale(0, false)).toBe(1.5);
    expect(menusPreviewScale(0, true)).toBe(1.25);
  });

  it("keeps the ring round on a screen taller than wide", () => {
    const screen = { width: 208, height: 248 };
    const top = menuScreenPoint(screen, watchMenuRingPoint("topCenter")!);
    expect(top.x).toBe(0.5);
    expect(top.y).toBeCloseTo(0.5 - (0.36 * 208) / 248, 4);
    expect(menuScreenPoint(screen, watchMenuRingPoint("rightCenter")!)).toEqual({ x: 0.86, y: 0.5 });
    // On a square screen the unit square is the screen.
    expect(menuScreenPoint({ width: 100, height: 100 }, { x: 0.2, y: 0.7 })).toEqual({ x: 0.2, y: 0.7 });
  });

  it("places switcher pages from top centre, counterclockwise and evenly", () => {
    expect(switcherRingPoint(0, 4)).toEqual(watchMenuRingPoint("topCenter"));
    expect(switcherRingPoint(1, 4)).toEqual(watchMenuRingPoint("leftCenter"));
    expect(switcherRingPoint(2, 4)).toEqual(watchMenuRingPoint("bottomCenter"));
    expect(switcherRingPoint(1, 8)).toEqual(watchMenuRingPoint("topLeft"));
    expect(switcherRingPoint(0, 1)).toEqual(watchMenuRingPoint("topCenter"));
  });
});

describe("the page switcher's pages", () => {
  it("are the pages the watch's switcher shows, as it draws them", () => {
    const doc = {
      pages: [
        { id: "1", name: "Settings", isSystemPage: true },
        { id: "2", name: "Secret", isHidden: true },
        { id: "3", name: "Skipped", hideFromSwitcher: true },
        { id: "4", name: "Kitchen", switcherText: "Kit", switcherColor: "#123456" },
        { id: "5", name: "Lights", switcherDisplayMode: "icon", items: [{ icon: "lightbulb" }] },
        { id: "6", name: "Smart", switcherDisplayMode: "icon", dynamicConfig: {} },
        { id: "7", name: "", switcherText: "" },
        "not a page",
      ],
    };
    expect(watchSwitcherPages(doc)).toEqual([
      { id: "4", name: "Kitchen", text: "Kit", icon: "square.grid.2x2.fill", color: "#123456" },
      { id: "5", name: "Lights", icon: "lightbulb", color: WATCH_SWITCHER_COLORS[1] },
      { id: "6", name: "Smart", icon: "bolt.fill", color: WATCH_SWITCHER_COLORS[2] },
      { id: "7", name: "Untitled page", text: "Untitled page", icon: "square.grid.2x2.fill", color: WATCH_SWITCHER_COLORS[3] },
    ]);
    expect(watchSwitcherPages(undefined)).toEqual([]);
  });
});
