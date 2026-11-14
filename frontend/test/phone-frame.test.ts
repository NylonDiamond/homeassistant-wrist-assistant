// The iPhone drawn around its pages (`phone-frame.ts`): where the pages
// screen puts its top row, its pages area and its page dots, and where the
// watch's page code then puts each tile in that area, checked against the
// iPhone 17 Pro simulator. The tiles' numbers were read off a 3x screenshot
// and the accessibility frames of box a's "PP Phone A" (nine 4 by 4 tiles)
// on 2026-10-10, with the phone showing its home switcher (two homes) in
// the Watch look, and are kept here from the pages area's top left, which
// the chrome above it does not change. The rows then started 34 points
// down, the watch's room for its clock; since 2026-10-15 the phone keeps 4
// (`WatchScreenMetrics.gridTopInset` on iOS), so every row is 30 higher.

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  DEFAULT_PHONE,
  PHONE_GRID_TOP_INSET,
  PHONE_MODELS,
  PHONE_PAGE_DOTS_TOP,
  PHONE_PAGES_BOTTOM_BAR,
  PHONE_PAGES_BOTTOM_BAR_TOP_DOTS,
  PHONE_PAGES_DOCK_BAR,
  PHONE_PAGES_SIDE_INSET_IPHONE,
  PHONE_PAGES_TOP_BAR,
  PHONE_STAGE_ZOOM,
  PHONE_TILE_CELL_INSET,
  PHONE_VAULT_GUTTER,
  phoneModelForScreenSize,
  phonePagesDotsOf,
  phonePagesLayout,
  phonePagesScreen,
} from "../src/phone-frame.js";
import type { WatchPage } from "../src/watch-pages/model.js";
import {
  type WatchPagePreviewInput,
  renderWatchPagePreview,
  watchBadgeFontSize,
  watchPageIndicatorRow,
  watchPreviewHeight,
  watchPreviewLayout,
  watchPreviewSideInset,
  watchPreviewTopInset,
  watchTileIconSize,
  watchTileLabelFontSize,
  setPreviewOneLookDefault,
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

// These pin the old tile look, which a device below One Look's version
// still draws; One Look's own are in one-look-render.test.ts.
beforeAll(() => setPreviewOneLookDefault(false));
afterAll(() => setPreviewOneLookDefault(undefined));

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
 * columns at 0, 130.67 and 261.33, three rows measured at 34, 164.67 and
 * 295.33 and now 30 higher, each 128.67 square. */
const MEASURED_COLS = [0, 130.67, 261.33];
const MEASURED_ROWS = [34, 164.67, 295.33].map((y) => y - 30);
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
    // 8 under it the 44 point top row, the 12 point clear strip
    // (`PhonePagesView.topBar`), then the pages area down to the dots' 32
    // point bar (`pageBarHeight`) just above the safe area.
    const two = phonePagesLayout(DEFAULT_PHONE, { switcher: true });
    expect(two.switcher).toEqual({ x: 16, y: 62, width: 370, height: 42 });
    expect(two.topRow).toEqual({ x: 6, y: 112, width: 390, height: 44 });
    expect(PHONE_PAGES_TOP_BAR).toBe(12);
    expect(two.area).toEqual({ x: 6, y: 168, width: 390, height: 640 });
    expect(two.bottomBar).toEqual({ x: 0, y: 808, width: 402, height: 32 });
    expect(two.bottomBar.y + two.bottomBar.height).toBe(DEFAULT_PHONE.screen.height - DEFAULT_PHONE.safeBottom);
    // The panel draws no switcher: the top row sits right under the status
    // bar and the pages start 50 points higher, 390 by 690.
    const one = phonePagesLayout();
    expect(one.switcher).toBeUndefined();
    expect(one.topRow).toEqual({ x: 6, y: 62, width: 390, height: 44 });
    expect(one.area).toEqual({ x: 6, y: 118, width: 390, height: 690 });
    expect(one.bottomBar).toEqual(two.bottomBar);
    expect(phonePagesScreen(one)).toEqual({ width: 390, height: 690 });
  });

  it("sizes the bar under the pages as the app's bottomBarHeight does", () => {
    const bar = (look: "iphone" | "watch", shown: boolean, top: boolean) => phonePagesLayout(DEFAULT_PHONE, { look, dots: { shown, top } }).bottomBar.height;
    // The iPhone look's dock, 38 points of glass and 8 of air, while its
    // dots show; the dots' place setting is the watch's and it ignores it.
    expect(PHONE_PAGES_DOCK_BAR).toBe(46);
    expect(bar("iphone", true, false)).toBe(46);
    expect(bar("iphone", true, true)).toBe(46);
    // No dock (one page, or dots off): the plain 32 point bar.
    expect(bar("iphone", false, false)).toBe(PHONE_PAGES_BOTTOM_BAR);
    expect(bar("iphone", false, true)).toBe(32);
    // The Watch look: 14 under its dots at the top, else 32, dots or not.
    expect(bar("watch", true, true)).toBe(PHONE_PAGES_BOTTOM_BAR_TOP_DOTS);
    expect(bar("watch", false, true)).toBe(14);
    expect(bar("watch", true, false)).toBe(32);
    expect(bar("watch", false, false)).toBe(32);
    // With no dots given, the phone's defaults: dots on, at the bottom.
    expect(phonePagesLayout(DEFAULT_PHONE, { look: "iphone" }).bottomBar.height).toBe(46);
    expect(phonePagesLayout().bottomBar.height).toBe(32);
    // The pages area ends on the bar: 676 tall over the dock, 708 over the
    // Watch look's short strip. The iPhone look's is 12 in from each side.
    expect(phonePagesLayout(DEFAULT_PHONE, { look: "iphone" }).area).toEqual({ x: 12, y: 118, width: 378, height: 676 });
    expect(phonePagesLayout(DEFAULT_PHONE, { dots: { shown: true, top: true } }).area.height).toBe(708);
  });

  it("reads the dots' place from the phone's settings and its shown pages", () => {
    expect(phonePagesDotsOf(undefined, 2)).toEqual({ shown: true, top: false });
    expect(phonePagesDotsOf({}, 1)).toEqual({ shown: false, top: false });
    expect(phonePagesDotsOf({ showPageIndicator: false }, 5)).toEqual({ shown: false, top: false });
    expect(phonePagesDotsOf({ pageIndicatorPosition: "Top" }, 3)).toEqual({ shown: true, top: true });
  });

  it("lays a page's tiles out in the pages area to within a point of the simulator", () => {
    const layout = phonePagesLayout(DEFAULT_PHONE, { switcher: true });
    const screen = phonePagesScreen(layout);
    expect(watchPreviewSideInset({ phone: layout })).toBe(0);
    expect(watchPreviewTopInset({ phone: layout })).toBe(PHONE_GRID_TOP_INSET);
    const placed = watchPreviewLayout(PHONE_A, screen, { sideInset: 0, topInset: watchPreviewTopInset({ phone: layout }) });
    expect(placed.topInset).toBe(4);
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
    const grid = stageGrid(layout.area.width, PHONE_GRID_TOP_INSET, 1, 0);
    expect(grid.left).toBe(0);
    const last = cellRectPx(grid, { col: 8, row: 8, colSpan: 4, rowSpan: 4 });
    expect(Math.abs(last.left - MEASURED_COLS[2]!)).toBeLessThan(1);
    expect(Math.abs(last.top - MEASURED_ROWS[2]!)).toBeLessThan(1);
    expect(Math.abs(last.width - MEASURED_SIDE)).toBeLessThan(1);
  });

  it("lays the iPhone look's tiles out 12 in, each drawn 4 in from its cell, as the app's grid does", () => {
    // `PhonePagesView.phoneSideInset`: `PhoneVault.gutter` 16 less
    // `PhoneTileGlass.cellInset` 4, so the pages area runs 12 to 390 and
    // its 12 columns, 2 apart, are (378 - 22) / 12 wide.
    const layout = phonePagesLayout(DEFAULT_PHONE, { look: "iphone" });
    expect(PHONE_PAGES_SIDE_INSET_IPHONE).toBe(PHONE_VAULT_GUTTER - PHONE_TILE_CELL_INSET);
    expect(layout.area.x).toBe(12);
    expect(layout.area.x + layout.area.width).toBe(DEFAULT_PHONE.screen.width - 12);
    const screen = phonePagesScreen(layout);
    const placed = watchPreviewLayout(PHONE_A, screen, { sideInset: 0, topInset: PHONE_GRID_TOP_INSET });
    expect(placed.unit).toBeCloseTo((378 - 22) / 12, 6);
    // Each 4 by 4 tile is drawn 4 in from its cell all round: the outer
    // tiles' edges 16 from the screen's, the top row's buttons' line, and
    // 10 points between two tiles.
    const text = flat(renderWatchPagePreview({ page: PHONE_A, pages: [PHONE_A], screen, phone: layout, scale: 1 }));
    const boxes = [...text.matchAll(/style=left:([\d.]+)px;top:([\d.]+)px;width:([\d.]+)px;height:([\d.]+)px;border-radius/g)]
      .map((m) => ({ left: Number(m[1]), top: Number(m[2]), width: Number(m[3]), height: Number(m[4]) }));
    expect(boxes).toHaveLength(9);
    const side = placed.unit * 4 + 2 * 3;
    for (const [i, box] of boxes.entries()) {
      expect(box.width).toBeCloseTo(side - 8, 6);
      expect(box.height).toBeCloseTo(side - 8, 6);
      expect(box.left).toBeCloseTo((i % 3) * (side + 2) + 4, 6);
      expect(box.top).toBeCloseTo(PHONE_GRID_TOP_INSET + Math.floor(i / 3) * (side + 2) + 4, 6);
    }
    expect(layout.area.x + boxes[0]!.left).toBe(PHONE_VAULT_GUTTER);
    expect(layout.area.x + boxes[2]!.left + boxes[2]!.width).toBeCloseTo(DEFAULT_PHONE.screen.width - PHONE_VAULT_GUTTER, 6);
    expect(boxes[1]!.left - (boxes[0]!.left + boxes[0]!.width)).toBeCloseTo(10, 6);
  });

  it("keeps the pages in a column at most 430 wide, centred, on a wider phone", () => {
    // `PhonePagesRules.maxPagesColumnWidth`: the 17 Pro Max's 440 points
    // leave 5 each side of the column.
    const max = PHONE_MODELS.find((m) => m.label === "iPhone 17 Pro Max")!;
    const iphone = phonePagesLayout(max, { look: "iphone" });
    expect(iphone.topRow).toEqual({ x: 21, y: 62, width: 398, height: 44 });
    expect(iphone.area).toEqual({ x: 17, y: 118, width: 406, height: 758 });
    expect(phonePagesLayout(max).area).toEqual({ x: 11, y: 118, width: 418, height: 772 });
    // A phone narrower than that keeps its whole width.
    expect(phonePagesLayout(DEFAULT_PHONE).area.x).toBe(6);
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
    expect(text).toContain('class="wp-fold" style=top:690px');
    expect(text).toContain("the end of the iPhone's screen");
    // The iPhone look ends its pages higher, on the dock's bar.
    const iphone = phonePagesLayout(DEFAULT_PHONE, { look: "iphone" });
    const over = flat(renderWatchPagePreview({ page: long, pages: [long, { ...long, id: "P2" }], screen: phonePagesScreen(iphone), phone: iphone, scale: 1 }));
    expect(over).toContain('class="wp-fold" style=top:676px');
    expect(over).toContain('class="wa-phone-dots-bar" style=height:46px');
    expect(over).toContain("height:12px");
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
    expect(phone).toContain("width:390px;min-height:690px");
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
    expect(text).toContain("width:390px;height:690px");
    expect(text).not.toContain("wa-watch");
  });
});

