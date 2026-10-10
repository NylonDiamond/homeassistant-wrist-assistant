// The iPhone drawn around its pages (`phone-frame.ts`): where the Pages tab
// puts its pages area, its page dots and its tab bar, and where the watch's
// page code then puts each tile in that area, checked against the iPhone 17
// Pro simulator. The numbers were read off a 3x screenshot and the
// accessibility frames of box a's "PP Phone A" (nine 4 by 4 tiles) on
// 2026-10-10, with the phone showing its home switcher (two homes).

import { describe, expect, it } from "vitest";

import {
  DEFAULT_PHONE,
  PHONE_PAGE_DOTS_TOP,
  PHONE_STAGE_ZOOM,
  phoneModelForScreenSize,
  phonePagesLayout,
  phonePagesScreen,
} from "../src/phone-frame.js";
import type { WatchPage } from "../src/watch-pages/model.js";
import { WATCH_GRID_TOP_INSET } from "../src/watch-pages/model.js";
import {
  type WatchPagePreviewInput,
  renderWatchPagePreview,
  watchBadgeFontSize,
  watchPageIndicatorRow,
  watchPreviewHeight,
  watchPreviewLayout,
  watchPreviewSideInset,
  watchTileIconSize,
  watchTileLabelFontSize,
} from "../src/watch-pages/preview.js";
import { cellRectPx, stageGrid } from "../src/watch-pages/stage.js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { HassLike } from "../src/ha-api.js";
import { SymbolBrowser } from "../src/symbols.js";
import type { StatusPagesDocument } from "../src/watch-status-pages/model.js";
import { type StatusPagesViewHost, renderStatusPageScreen } from "../src/watch-status-pages/view.js";
import { type MenusViewHost, renderMenuScreen } from "../src/watch-menus/menu-view.js";

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

const ENTITIES = [
  "light.office_rgbw_lights", "switch.ac", "cover.kitchen_window",
  "lock.kitchen_door", "climate.heatpump", "button.push",
  "camera.demo_camera", "number.volume", "sensor.outside_humidity",
];
const ITEMS: Record<string, unknown>[] = ENTITIES.map((entityId, i) => ({
  id: `5A17E000-0000-4000-8000-0000000001${String(i).padStart(2, "0")}`,
  entityId, gridCol: (i % 3) * 4, gridRow: Math.floor(i / 3) * 4, colSpan: 4, rowSpan: 4,
}));
const PHONE_A: WatchPage = {
  id: "5A17E000-0000-4000-8000-000000000001",
  name: "PP Phone A",
  fullScreen: false,
  items: ITEMS,
};

/** The sim's tiles, in points from the screen's top left: three columns at
 * 6, 136.67 and 267.33, three rows at 154, 284.67 and 415.33, each 128.67
 * square. */
const MEASURED_COLS = [6, 136.67, 267.33];
const MEASURED_ROWS = [154, 284.67, 415.33];
const MEASURED_SIDE = 128.67;

describe("the iPhone's Pages tab", () => {
  it("draws every iPhone as the iPhone 17 Pro while the phone reports no size", () => {
    expect(DEFAULT_PHONE.label).toBe("iPhone 17 Pro");
    expect(DEFAULT_PHONE.screen).toEqual({ width: 402, height: 874 });
    expect(phoneModelForScreenSize(null)).toBe(DEFAULT_PHONE);
    expect(phoneModelForScreenSize("1x1")).toBe(DEFAULT_PHONE);
    expect(phoneModelForScreenSize("393x852").label).toBe("iPhone 15 Pro");
  });

  it("puts the pages area, the dots strip and the tab bar where the simulator does", () => {
    // Measured with the home switcher: pages area 6 to 396 across, 120 to
    // 765 down; tab bar 12 to 390 across, 779 to 840 down; the switcher 16
    // to 386 across, 62 to 104 down.
    const two = phonePagesLayout(DEFAULT_PHONE, { switcher: true });
    expect(two.switcher).toEqual({ x: 16, y: 62, width: 370, height: 42 });
    expect(two.area).toEqual({ x: 6, y: 120, width: 390, height: 645 });
    expect(two.bottomBar).toEqual({ x: 0, y: 765, width: 402, height: 14 });
    expect(two.tabBar).toEqual({ x: 12, y: 779, width: 378, height: 61 });
    // The panel draws no switcher: the pages start 50 points higher, so the
    // pages area is the 390 by 695 the phone has with one home.
    const one = phonePagesLayout();
    expect(one.switcher).toBeUndefined();
    expect(one.area).toEqual({ x: 6, y: 70, width: 390, height: 695 });
    expect(one.tabBar).toEqual(two.tabBar);
    expect(phonePagesScreen(one)).toEqual({ width: 390, height: 695 });
  });

  it("lays a page's tiles out in the pages area to within a point of the simulator", () => {
    const layout = phonePagesLayout(DEFAULT_PHONE, { switcher: true });
    const screen = phonePagesScreen(layout);
    expect(watchPreviewSideInset({ phone: layout })).toBe(0);
    const placed = watchPreviewLayout(PHONE_A, screen, { sideInset: 0 });
    expect(placed.topInset).toBe(WATCH_GRID_TOP_INSET);
    expect(placed.tiles).toHaveLength(9);
    for (const [i, t] of placed.tiles.entries()) {
      const x = layout.area.x + t.x;
      const y = layout.area.y + placed.topInset + t.y;
      expect(Math.abs(x - MEASURED_COLS[i % 3]!)).toBeLessThan(1);
      expect(Math.abs(y - MEASURED_ROWS[Math.floor(i / 3)]!)).toBeLessThan(1);
      expect(Math.abs(t.width - MEASURED_SIDE)).toBeLessThan(1);
      expect(Math.abs(t.height - MEASURED_SIDE)).toBeLessThan(1);
    }
    // The page fits: three rows end at 544, well above the pages area's end,
    // so the phone is drawn at its own height, with no fold.
    expect(watchPreviewHeight(placed, true)).toBe(screen.height);
  });

  it("puts the editing grid's cells on the same rectangles", () => {
    const layout = phonePagesLayout(DEFAULT_PHONE, { switcher: true });
    const grid = stageGrid(layout.area.width, WATCH_GRID_TOP_INSET, 1, 0);
    expect(grid.left).toBe(0);
    const last = cellRectPx(grid, { col: 8, row: 8, colSpan: 4, rowSpan: 4 });
    expect(Math.abs(layout.area.x + last.left - MEASURED_COLS[2]!)).toBeLessThan(1);
    expect(Math.abs(layout.area.y + last.top - MEASURED_ROWS[2]!)).toBeLessThan(1);
    expect(Math.abs(last.width - MEASURED_SIDE)).toBeLessThan(1);
  });

  it("sizes the names, symbols and readings from the phone's tiles", () => {
    // Measured: the names' text frames 12 points tall (10 point type), the
    // light bulb 41 points tall (36 point type), the "71%" 11 tall (9 point).
    const tile = ITEMS[0]!;
    expect(watchTileLabelFontSize(tile, MEASURED_SIDE)).toBe(10);
    expect(watchTileIconSize(tile, MEASURED_SIDE, MEASURED_SIDE)).toBe(36);
    expect(watchBadgeFontSize(tile, MEASURED_SIDE, MEASURED_SIDE)).toBe(9);
  });

  it("draws the page dots at the top of the pages area as the phone does", () => {
    // Measured: six lines (Lines, Large, Top) from 103.67 to 298.33 across,
    // 123 to 127 down.
    const layout = phonePagesLayout(DEFAULT_PHONE, { switcher: true });
    const pages = Array.from({ length: 6 }, (_, i) => ({ ...PHONE_A, id: `P${i}` }));
    const input: WatchPagePreviewInput = {
      page: pages[0]!, pages, screen: phonePagesScreen(layout), phone: layout,
      behavior: { pageIndicatorStyle: "Lines", pageIndicatorSize: "Large", pageIndicatorPosition: "Top" },
    };
    const dots = watchPageIndicatorRow(input, 1)!;
    expect(dots.top).toBe(true);
    expect(layout.area.y + PHONE_PAGE_DOTS_TOP).toBe(123);
    expect(Math.abs(dots.height - 4)).toBeLessThan(0.1);
    const row = flat(dots.row);
    const widths = [...row.matchAll(/width:([\d.]+)px/g)].map((m) => Number(m[1]));
    const gaps = [...row.matchAll(/margin-left:([\d.]+)px/g)].map((m) => Number(m[1]));
    const total = widths.reduce((a, b) => a + b, 0) + gaps.reduce((a, b) => a + b, 0);
    expect(Math.abs(total - (298.33 - 103.67))).toBeLessThan(1);
  });

  it("draws an iPhone's page in the phone, with no watch clock", () => {
    const layout = phonePagesLayout();
    const phone = flat(renderWatchPagePreview({ page: PHONE_A, pages: [PHONE_A], screen: phonePagesScreen(layout), phone: layout, scale: 1 }));
    expect(phone).toContain('class="wa-phone"');
    expect(phone).toContain("9:41");
    expect(phone).toContain("Pages");
    expect(phone).toContain("Settings");
    expect(phone).not.toContain("wa-watch");
    expect(phone).not.toContain("wp-clock");
    // The watch keeps its own case and clock.
    const watch = flat(renderWatchPagePreview({ page: PHONE_A, pages: [PHONE_A], screen: { width: 208, height: 248 }, scale: 1 }));
    expect(watch).toContain('class="wa-watch"');
    expect(watch).toContain("wp-clock");
    expect(watch).not.toContain("wa-phone");
  });

  it("marks the end of the pages area, not the phone, for a page that scrolls on", () => {
    const layout = phonePagesLayout();
    const long: WatchPage = { ...PHONE_A, items: [...ITEMS, { id: "X", entityId: "light.x", gridCol: 0, gridRow: 30, colSpan: 4, rowSpan: 4 }] };
    const text = flat(renderWatchPagePreview({ page: long, pages: [long], screen: phonePagesScreen(layout), phone: layout, scale: 1 }));
    expect(text).toContain('class="wp-fold" style=top:695px');
    expect(text).toContain("the end of the iPhone's screen");
  });

  it("draws the phone at half the watch's zoom", () => {
    expect(PHONE_STAGE_ZOOM).toBe(0.5);
  });
});

const NO_ICONS = { render: () => undefined, available: () => false, names: () => [] } as unknown as StatusPagesViewHost["icons"];

describe("the iPhone's status pages and menus", () => {
  const layout = phonePagesLayout();
  const base = {
    hass: { states: {} } as unknown as HassLike,
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    busy: false,
    uiState: new Map<string, unknown>(),
    edit: () => false,
    endCoalesce: () => undefined,
    requestUpdate: () => undefined,
  };

  it("draws a status page in the iPhone's pages area, where the phone opens it", () => {
    const document = JSON.parse(readFileSync(join(__dirname, "fixtures-status-pages", "02-configured.json"), "utf8")) as StatusPagesDocument;
    const phone = flat(renderStatusPageScreen({ ...base, document, screen: phonePagesScreen(layout), scale: 1, phone: layout }));
    expect(phone).toContain('class="wa-phone"');
    expect(phone).toContain("Status page on the iPhone");
    expect(phone).toContain("width:390px;min-height:695px");
    expect(phone).not.toContain("wa-watch");
    const watch = flat(renderStatusPageScreen({ ...base, document, screen: { width: 208, height: 248 }, scale: 1 }));
    expect(watch).toContain('class="wa-watch"');
    expect(watch).toContain("Status page on the watch");
  });

  it("draws the menus over the iPhone's pages area", () => {
    const host: MenusViewHost = {
      ...base, document: { schemaVersion: 1 }, targets: { pages: [], statusPages: [], httpActions: [] }, catalogKnown: true,
      screen: phonePagesScreen(layout), scale: 1, switcherPages: [], phone: layout,
    } as unknown as MenusViewHost;
    const text = flat(renderMenuScreen(host));
    expect(text).toContain('class="wa-phone"');
    expect(text).toContain("width:390px;height:695px");
    expect(text).not.toContain("wa-watch");
  });
});

