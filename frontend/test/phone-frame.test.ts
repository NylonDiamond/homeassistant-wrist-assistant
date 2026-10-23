// The iPhone drawn around its pages (`phone-frame.ts`): where the pages
// screen puts its top row, its pages area and its page dots, and where the
// watch's page code then puts each tile in that area, checked against the
// iPhone 17 Pro simulator. The tiles' numbers were read off a 3x screenshot
// and the accessibility frames of box a's "PP Phone A" (nine 4 by 4 tiles)
// on 2026-10-10, with the phone showing its home switcher (two homes), and
// are kept here from the pages area's top left, which the chrome above it
// does not change.

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
import type { MenusViewHost } from "../src/watch-menus/menu-view.js";
import { renderMenuScreen } from "../src/watch-menus/menu-stage.js";

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

/** The sim's tiles, in points from the pages area's top left: three
 * columns at 0, 130.67 and 261.33, three rows at 34, 164.67 and 295.33,
 * each 128.67 square. */
const MEASURED_COLS = [0, 130.67, 261.33];
const MEASURED_ROWS = [34, 164.67, 295.33];
const MEASURED_SIDE = 128.67;

describe("the iPhone's pages screen", () => {
  it("draws every iPhone as the iPhone 17 Pro while the phone reports no size", () => {
    expect(DEFAULT_PHONE.label).toBe("iPhone 17 Pro");
    expect(DEFAULT_PHONE.screen).toEqual({ width: 402, height: 874 });
    expect(phoneModelForScreenSize(null)).toBe(DEFAULT_PHONE);
    expect(phoneModelForScreenSize("1x1")).toBe(DEFAULT_PHONE);
    expect(phoneModelForScreenSize("393x852").label).toBe("iPhone 15 Pro");
  });

  it("puts the top row, the pages area and the dots strip where the app does, with no tab bar", () => {
    // With the home switcher: the switcher 16 to 386 across, 62 to 104 down,
    // 8 under it the 44 point top row, 8 more, then the pages area down to
    // the dots strip just above the safe area.
    const two = phonePagesLayout(DEFAULT_PHONE, { switcher: true });
    expect(two.switcher).toEqual({ x: 16, y: 62, width: 370, height: 42 });
    expect(two.topRow).toEqual({ x: 6, y: 112, width: 390, height: 44 });
    expect(two.area).toEqual({ x: 6, y: 164, width: 390, height: 662 });
    expect(two.bottomBar).toEqual({ x: 0, y: 826, width: 402, height: 14 });
    expect(two.bottomBar.y + two.bottomBar.height).toBe(DEFAULT_PHONE.screen.height - DEFAULT_PHONE.safeBottom);
    // The panel draws no switcher: the top row sits right under the status
    // bar and the pages start 50 points higher, 390 by 712.
    const one = phonePagesLayout();
    expect(one.switcher).toBeUndefined();
    expect(one.topRow).toEqual({ x: 6, y: 62, width: 390, height: 44 });
    expect(one.area).toEqual({ x: 6, y: 114, width: 390, height: 712 });
    expect(one.bottomBar).toEqual(two.bottomBar);
    expect(phonePagesScreen(one)).toEqual({ width: 390, height: 712 });
  });

  it("lays a page's tiles out in the pages area to within a point of the simulator", () => {
    const layout = phonePagesLayout(DEFAULT_PHONE, { switcher: true });
    const screen = phonePagesScreen(layout);
    expect(watchPreviewSideInset({ phone: layout })).toBe(0);
    const placed = watchPreviewLayout(PHONE_A, screen, { sideInset: 0 });
    expect(placed.topInset).toBe(WATCH_GRID_TOP_INSET);
    expect(placed.tiles).toHaveLength(9);
    for (const [i, t] of placed.tiles.entries()) {
      const x = t.x;
      const y = placed.topInset + t.y;
      expect(Math.abs(x - MEASURED_COLS[i % 3]!)).toBeLessThan(1);
      expect(Math.abs(y - MEASURED_ROWS[Math.floor(i / 3)]!)).toBeLessThan(1);
      expect(Math.abs(t.width - MEASURED_SIDE)).toBeLessThan(1);
      expect(Math.abs(t.height - MEASURED_SIDE)).toBeLessThan(1);
    }
    // The page fits: three rows end 424 down, well above the pages area's end,
    // so the phone is drawn at its own height, with no fold.
    expect(watchPreviewHeight(placed, true)).toBe(screen.height);
  });

  it("puts the editing grid's cells on the same rectangles", () => {
    const layout = phonePagesLayout(DEFAULT_PHONE, { switcher: true });
    const grid = stageGrid(layout.area.width, WATCH_GRID_TOP_INSET, 1, 0);
    expect(grid.left).toBe(0);
    const last = cellRectPx(grid, { col: 8, row: 8, colSpan: 4, rowSpan: 4 });
    expect(Math.abs(last.left - MEASURED_COLS[2]!)).toBeLessThan(1);
    expect(Math.abs(last.top - MEASURED_ROWS[2]!)).toBeLessThan(1);
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
    // 123 to 127 down, 3 below the top of the pages area at 120.
    const layout = phonePagesLayout(DEFAULT_PHONE, { switcher: true });
    const pages = Array.from({ length: 6 }, (_, i) => ({ ...PHONE_A, id: `P${i}` }));
    const input: WatchPagePreviewInput = {
      page: pages[0]!, pages, screen: phonePagesScreen(layout), phone: layout,
      behavior: { pageIndicatorStyle: "Lines", pageIndicatorSize: "Large", pageIndicatorPosition: "Top" },
    };
    const dots = watchPageIndicatorRow(input, 1)!;
    expect(dots.top).toBe(true);
    expect(PHONE_PAGE_DOTS_TOP).toBe(123 - 120);
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
    // The top row's gear, and no grid with one page; no tab bar.
    expect(phone).toContain("wa-phone-gear");
    expect(phone).not.toContain("wa-phone-grid");
    expect(phone).not.toContain("wa-phone-tab");
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
    expect(text).toContain('class="wp-fold" style=top:712px');
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
    expect(phone).toContain("width:390px;min-height:712px");
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
    expect(text).toContain("width:390px;height:712px");
    expect(text).not.toContain("wa-watch");
  });
});

