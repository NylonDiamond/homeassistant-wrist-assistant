// An iPhone's Page look (`phonePageLook`, phone-frame.ts): in the iPhone
// look, the default, the phone's preview draws the page's name centred in
// the top row, a page with the default black background on the app's
// graphite ground, the pages 12 in from each side with each tile drawn 4 in
// from its cell and rounded up to 22 points, and the dots in the dock's
// glass capsule; in the Watch look the phone keeps the watch's own drawing;
// and a watch never changes, whatever a document says.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  DEFAULT_PHONE,
  PHONE_DOCK_MAX_DOTS,
  PHONE_TOP_ROW_HEIGHT,
  phoneDockWindow,
  phoneFrameStyles,
  phonePageLookOf,
  phonePagesLayout,
  phonePagesScreen,
  phoneTileCellInset,
  phoneTileCornerRadius,
  renderPhoneDock,
} from "../src/phone-frame.js";
import type { WatchPage } from "../src/watch-pages/model.js";
import {
  previewTileCellInset,
  previewTileCornerRadius,
  renderWatchPagePreview,
  watchPageHasDefaultBlackBackground,
  watchScreenBackground,
  watchTileCornerRadius,
  setPreviewOneLookDefault,
} from "../src/watch-pages/preview.js";

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

const ENTITIES = ["light.office", "switch.ac", "cover.kitchen_window", "lock.kitchen_door"];
const ITEMS: Record<string, unknown>[] = ENTITIES.map((entityId, i) => ({
  id: `5A17E000-0000-4000-8000-0000000002${String(i).padStart(2, "0")}`,
  entityId, gridCol: (i % 3) * 4, gridRow: Math.floor(i / 3) * 4, colSpan: 4, rowSpan: 4,
}));
const LIVING: WatchPage = {
  id: "5A17E000-0000-4000-8000-000000000010",
  name: "Living Room",
  fullScreen: false,
  pageTitleDisplayStyle: "pill",
  // What the panel writes on every new page (page-keys.json "new").
  backgroundColor: "#000000",
  items: ITEMS,
};
const KITCHEN: WatchPage = { ...LIVING, id: "5A17E000-0000-4000-8000-000000000011", name: "Kitchen" };
const HALL: WatchPage = { ...LIVING, id: "5A17E000-0000-4000-8000-000000000012", name: "Hall" };
const PAGES = [LIVING, KITCHEN, HALL];

const iphone = phonePagesLayout(DEFAULT_PHONE, { look: "iphone" });
const old = phonePagesLayout(DEFAULT_PHONE);

function phonePicture(page: WatchPage, layout = iphone, behavior?: Record<string, unknown>): string {
  return flat(renderWatchPagePreview({
    page, pages: PAGES, screen: phonePagesScreen(layout), phone: layout, scale: 1,
    ...(behavior === undefined ? {} : { behavior }),
  }));
}

describe("the Page look setting", () => {
  it("reads iPhone unless the phone's settings say Watch", () => {
    expect(phonePageLookOf(undefined)).toBe("iphone");
    expect(phonePageLookOf({})).toBe("iphone");
    expect(phonePageLookOf({ phonePageLook: "iphone" })).toBe("iphone");
    expect(phonePageLookOf({ phonePageLook: "watch" })).toBe("watch");
    // An unknown value reads as the default, as the app's lenient decoder does.
    expect(phonePageLookOf({ phonePageLook: "tablet" })).toBe("iphone");
  });

  it("is the first row of the catalog's Pages card, for the iPhone only", () => {
    const catalog = JSON.parse(readFileSync(join(__dirname, "..", "src", "watch-settings-catalog.json"), "utf8")) as {
      sections: { id: string; settings: { key: string; devices: string[]; default: unknown; options: { value: string; label: string }[] }[] }[];
    };
    const row = catalog.sections.find((s) => s.id === "navigation")!.settings[0]!;
    expect(row.key).toBe("phonePageLook");
    expect(row.devices).toEqual(["iphone"]);
    expect(row.default).toBe("iphone");
    expect(row.options).toEqual([{ value: "iphone", label: "iPhone" }, { value: "watch", label: "Watch" }]);
  });
});

describe("the iPhone look", () => {
  it("keeps the pages area's top the Watch look's, 12 in from each side, ending it on the dock's bar, with the top row's buttons on the tiles' edges", () => {
    expect(iphone.look).toBe("iphone");
    expect(iphone.topRow).toEqual({ x: 16, y: 62, width: 370, height: PHONE_TOP_ROW_HEIGHT });
    expect(old.topRow).toEqual({ x: 6, y: 62, width: 390, height: PHONE_TOP_ROW_HEIGHT });
    expect(iphone.area.y).toBe(old.area.y);
    // `PhonePagesView.phoneSideInset`, 12, against the Watch look's 6; the
    // tiles drawn 4 in from their cells then sit on the top row's 16.
    expect(iphone.area.x).toBe(12);
    expect(iphone.area.x + phoneTileCellInset(100, 100)).toBe(iphone.topRow.x);
    // The dock's 46 point bar against the Watch look's 32 point one.
    expect(iphone.area).toEqual({ x: 12, y: 118, width: 378, height: 676 });
    expect(iphone.bottomBar).toEqual({ x: 0, y: 794, width: 402, height: 46 });
    expect(old.bottomBar).toEqual({ x: 0, y: 808, width: 402, height: 32 });
    // With one page to show there is no dock, and the bar is the plain one.
    const one = phonePagesLayout(DEFAULT_PHONE, { look: "iphone", dots: { shown: false, top: false } });
    expect(one.area).toEqual({ ...iphone.area, height: old.area.height });
  });

  it("names the page in the top row between the grid and the gear, on the graphite ground, with no watch title", () => {
    const text = phonePicture(LIVING);
    // A page with no color of its own sits on the graphite ground: `ink`.
    expect(text).toContain('class="wa-phone ios ink"');
    expect(text).toContain('<div class="wa-phone-top"');
    expect(text).toContain('<span class="wa-phone-title"');
    expect(text).toContain("<span>Living Room</span>");
    expect(text).toContain("font-size:16px");
    expect(text).toContain("left:68px;right:68px");
    // Grid, then the name, then the gear, each button 40 points round.
    const grid = text.indexOf("wa-phone-glass wa-phone-grid");
    const name = text.indexOf("<span>Living Room</span>");
    const gear = text.indexOf("wa-phone-glass wa-phone-gear");
    expect(grid).toBeGreaterThan(0);
    expect(name).toBeGreaterThan(grid);
    expect(gear).toBeGreaterThan(name);
    expect(text).toContain("width:40px;height:40px");
    expect(text).toContain("background:var(--wa-phone-grouped, #f1f2f5)");
    // No large title, no tab bar.
    expect(text).not.toContain("font-size:34px");
    expect(text).not.toContain("wa-phone-tab");
    // The watch's own small title in the top band is gone.
    expect(text).not.toContain('class="wp-title');
    expect(text).not.toContain("wp-clock");
  });

  it("shows the grid only with two or more pages to show", () => {
    const one = flat(renderWatchPagePreview({ page: LIVING, pages: [LIVING], screen: phonePagesScreen(iphone), phone: iphone, scale: 1 }));
    expect(one).not.toContain("wa-phone-grid");
    expect(one).toContain("wa-phone-gear");
    // A hidden page does not count.
    const hidden = flat(renderWatchPagePreview({ page: LIVING, pages: [LIVING, { ...KITCHEN, isHidden: true }], screen: phonePagesScreen(iphone), phone: iphone, scale: 1 }));
    expect(hidden).not.toContain("wa-phone-grid");
    expect(phonePicture(LIVING)).toContain("wa-phone-grid");
  });

  it("follows the panel's light and dark skins for the graphite ground", () => {
    const css = phoneFrameStyles.cssText;
    expect(css).toContain(".wa-phone.ios .wa-phone-screen { background: var(--wa-phone-grouped, #f1f2f5); color: var(--wa-phone-ink, #14161a); }");
    const panel = readFileSync(join(__dirname, "..", "src", "panel.ts"), "utf8");
    const light = panel.indexOf("--wa-phone-grouped: #f1f2f5;");
    const dark = panel.indexOf("--wa-phone-grouped: #0e0f11;");
    expect(light).toBeGreaterThan(0);
    expect(dark).toBeGreaterThan(light);
    expect(panel.lastIndexOf(":host([dark]) {", dark)).toBeGreaterThan(light);
    // The dock's dots and the glass's top rim and shadow in each skin
    // (`PhoneVault` `.dockDot`, `.glassRimTop`, `glassShadow`).
    for (const [token, lightValue, darkValue] of [
      ["--wa-phone-dock-dot", "rgba(20, 22, 26, 0.22)", "rgba(232, 236, 242, 0.38)"],
      ["--wa-phone-glass-rim-top", "rgba(255, 255, 255, 0.9)", "rgba(242, 246, 252, 0.16)"],
      ["--wa-phone-glass-shadow", "rgba(28, 34, 48, 0.18)", "rgba(0, 0, 0, 0.32)"],
    ] as const) {
      const lightAt = panel.indexOf(`${token}: ${lightValue};`);
      const darkAt = panel.indexOf(`${token}: ${darkValue};`);
      expect(lightAt, token).toBeGreaterThan(0);
      expect(darkAt, token).toBeGreaterThan(lightAt);
      expect(panel.lastIndexOf(":host([dark]) {", darkAt), token).toBeGreaterThan(lightAt);
    }
  });

  it("rounds tiles at 22 points, a third of a smaller cell's short side, never under 4", () => {
    // `TileLookMetrics.cornerRadius` for the iPhone look, read from the
    // cell's size, and the app's own test values.
    expect(phoneTileCornerRadius(128, 128)).toBe(22);
    expect(phoneTileCornerRadius(185, 128)).toBe(22);
    expect(phoneTileCornerRadius(185, 63)).toBe(21);
    expect(phoneTileCornerRadius(30, 30)).toBe(10);
    expect(phoneTileCornerRadius(30, 128)).toBe(10);
    expect(phoneTileCornerRadius(10, 10)).toBe(4);
    expect(previewTileCornerRadius({ phone: iphone }, 128, 128)).toBe(22);
    expect(previewTileCornerRadius({ phone: old }, 128, 128)).toBe(watchTileCornerRadius(128, 128));
    expect(previewTileCornerRadius({}, 128, 128)).toBe(8);
    const text = phonePicture(LIVING);
    expect(text).toContain("border-radius:22px");
    expect(text).not.toContain("border-radius:8px");
    // A 1 by 1 tile's cell, 29.67 points, takes 10, not the drawn tile's 7.
    const small: WatchPage = { ...LIVING, items: [{ ...ITEMS[0]!, colSpan: 1, rowSpan: 1 }] };
    expect(phonePicture(small)).toContain("border-radius:10px");
  });

  it("draws each tile 4 points in from its cell, a header and a spacer keeping the whole cell", () => {
    // `PhoneTileGlass.cellInset(width:height:)`: 4, or a sixth of the
    // cell's short side, rounded down, when that is less.
    expect(phoneTileCellInset(124, 124)).toBe(4);
    expect(phoneTileCellInset(60, 18)).toBe(3);
    expect(phoneTileCellInset(11, 40)).toBe(1);
    const light = ITEMS[0]!;
    expect(previewTileCellInset({ phone: iphone }, light, 124, 124)).toBe(4);
    expect(previewTileCellInset({ phone: iphone }, { ...light, entityId: "divider.line.light" }, 124, 124)).toBe(0);
    expect(previewTileCellInset({ phone: iphone }, { ...light, entityId: "spacer.1" }, 124, 124)).toBe(0);
    // The Watch look and a watch draw every tile in its whole cell.
    expect(previewTileCellInset({ phone: old }, light, 124, 124)).toBe(0);
    expect(previewTileCellInset({}, light, 124, 124)).toBe(0);
  });

  it("draws the dots in the dock's glass capsule under the pages, the shown page a pill", () => {
    const text = phonePicture(KITCHEN);
    // `PhonePagesDock`: 38 tall, 15 of glass each side, dots 6 round and 5
    // apart, the current page a 16 point pill.
    expect(text).toContain('<span class="wa-phone-dock" style=height:38px;padding:0 15px;gap:5px>');
    const dots = [...text.matchAll(/class=(wa-phone-dock-dot(?: on)?) style=([^>]*)>/g)].map((m) => ({ on: m[1]!.endsWith(" on"), style: m[2]! }));
    expect(dots.map((d) => d.on)).toEqual([false, true, false]);
    expect(dots[0]!.style).toBe("width:6px;height:6px");
    expect(dots[1]!.style).toBe("width:16px;height:6px");
    // In the dock's bar under the pages, never over the top of them.
    expect(text).toContain('class="wa-phone-dots-bar" style=height:46px><span class="wa-phone-dock"');
    expect(text).not.toContain('class="wa-phone-dots"');
    // Page dots off hides it.
    expect(phonePicture(KITCHEN, iphone, { showPageIndicator: false })).not.toContain("wa-phone-dock");
  });

  it("shows at most 9 dots, the end ones small where more pages lie past them", () => {
    expect(PHONE_DOCK_MAX_DOTS).toBe(9);
    expect(phoneDockWindow(3, 1)).toEqual([0, 1, 2]);
    expect(phoneDockWindow(12, 0)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(phoneDockWindow(12, 6)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(phoneDockWindow(12, 11)).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11]);
    const flatDock = flat(renderPhoneDock(12, 6, 1));
    const sizes = [...flatDock.matchAll(/style=width:([\d.]+)px;height:([\d.]+)px/g)].map((m) => `${m[1]}x${m[2]}`);
    expect(sizes).toEqual(["4x4", "6x6", "6x6", "6x6", "16x6", "6x6", "6x6", "6x6", "4x4"]);
    // At the first page only the far end is cut.
    const start = [...flat(renderPhoneDock(12, 0, 1)).matchAll(/style=width:([\d.]+)px;height:([\d.]+)px/g)].map((m) => `${m[1]}x${m[2]}`);
    expect(start[0]).toBe("16x6");
    expect(start[8]).toBe("4x4");
  });

  it("draws the top row and the dock dark over a page with its own background, as the app's chrome is", () => {
    // `chromeScheme`: the system's light or dark only on the vault's
    // ground, else the app's dark.
    const css = phoneFrameStyles.cssText;
    expect(css).toContain(".wa-phone.ios:not(.ink) .wa-phone-top");
    expect(css).toContain(".wa-phone.ios:not(.ink) .wa-phone-dots-bar");
    expect(css).toContain("--wa-phone-glass: rgba(44, 46, 51, 0.52);");
    expect(css).toContain("--wa-phone-dock-dot: rgba(232, 236, 242, 0.38);");
    expect(phonePicture({ ...LIVING, backgroundColor: "#FF0000" })).toContain('class="wa-phone ios"');
    expect(phonePicture(LIVING)).toContain('class="wa-phone ios ink"');
  });

  it("puts only a page with the default black background on the grouped background", () => {
    // PhonePagesRules.hasDefaultBlackBackground: exactly black, nothing over it.
    expect(watchPageHasDefaultBlackBackground(LIVING)).toBe(true);
    expect(watchPageHasDefaultBlackBackground({ ...LIVING, backgroundColor: "#000" })).toBe(true);
    expect(watchPageHasDefaultBlackBackground({ ...LIVING, backgroundColor: " 000000 " })).toBe(true);
    expect(watchPageHasDefaultBlackBackground({ ...LIVING, backgroundBrightness: 1 })).toBe(true);
    for (const own of [
      { backgroundColor: "#FF0000" },
      { backgroundColor: "#00000080" },
      { backgroundColor: "GRADIENT|#000000|#000000" },
      { backgroundImageId: "photo-1" },
      { backgroundPattern: "grid" },
      { backgroundOverlay: "aurora" },
      { backgroundBrightness: 1.2 },
    ]) {
      expect(watchPageHasDefaultBlackBackground({ ...LIVING, ...own }), JSON.stringify(own)).toBe(false);
    }
    const redPage = { ...LIVING, backgroundColor: "#FF0000" };
    const red = phonePicture(redPage);
    expect(red).not.toContain("background:var(--wa-phone-grouped");
    expect(red).toContain(`<div class="wa-phone-backdrop" aria-hidden="true" style=background:${watchScreenBackground(redPage, 1, DEFAULT_PHONE.screen)}>`);
    // The name in the top row stays: it is the iPhone's, not the page's.
    expect(red).toContain("<span>Living Room</span>");
  });

  it("keeps the theme's background on a page with no color at all", () => {
    const themed: WatchPage = { ...LIVING };
    delete themed.backgroundColor;
    expect(watchPageHasDefaultBlackBackground(themed)).toBe(false);
    const text = phonePicture(themed);
    expect(text).not.toContain("background:var(--wa-phone-grouped");
    // Laid out on the whole phone screen, not the pages area.
    expect(text).toContain(`<div class="wa-phone-backdrop" aria-hidden="true" style=background:${watchScreenBackground(themed, 1, DEFAULT_PHONE.screen)}>`);
  });

  it("hides the name, keeping the top row, when the phone's Page name setting is Hide", () => {
    const text = phonePicture(LIVING, iphone, { pageTitleMode: "Off" });
    expect(text).toContain('<div class="wa-phone-top"');
    expect(text).not.toContain("wa-phone-title");
    expect(text).not.toContain("<span>Living Room</span>");
    expect(phonePicture(LIVING, iphone, { pageTitleMode: "Auto" })).toContain("<span>Living Room</span>");
  });

  it("hides the name on a page whose title style is none, as the app does", () => {
    // PhonePagesRules.showsPageTitle: a style other than none, and a name.
    expect(phonePicture({ ...LIVING, pageTitleDisplayStyle: "none" })).not.toContain("wa-phone-title");
    const unstyled: WatchPage = { ...LIVING };
    delete unstyled.pageTitleDisplayStyle;
    expect(phonePicture(unstyled)).not.toContain("wa-phone-title");
    expect(phonePicture({ ...LIVING, name: "  " })).not.toContain("wa-phone-title");
  });
});

describe("the page's background on an iPhone", () => {
  // `PhonePagesView.backdrop` behind the whole tab, ignoring the safe area,
  // with `pageBackdropDrawnByHost` so the page draws none of its own.
  const backdropOf = (text: string): string => /<div class="wa-phone-backdrop" aria-hidden="true" style=background:([^>]*)>/.exec(text)?.[1] ?? "";
  const screenOf = (text: string): string => /<div class="wp-screen"[^>]*style=width:[\d.]+px;height:[\d.]+px;background:([^>]*)>/.exec(text)?.[1] ?? "";

  it("fills the whole phone screen behind the status bar, top row, margins and dock, the pages area clear", () => {
    const redPage = { ...LIVING, backgroundColor: "#FF0000" };
    const text = phonePicture(redPage);
    expect(backdropOf(text)).toBe(watchScreenBackground(redPage, 1, DEFAULT_PHONE.screen));
    expect(screenOf(text)).toBe("transparent");
    // First on the screen, under everything drawn after it.
    const at = text.indexOf("wa-phone-backdrop");
    expect(at).toBeGreaterThan(text.indexOf('class="wa-phone-screen"'));
    expect(at).toBeLessThan(text.indexOf('class="wa-phone-status"'));
    const css = phoneFrameStyles.cssText;
    expect(css).toContain(".wa-phone-screen { isolation: isolate; }");
    expect(css).toContain(".wa-phone-backdrop { position: absolute; inset: 0; z-index: -1;");
  });

  it("draws the graphite ground there for a page with the default black background", () => {
    const text = phonePicture(LIVING);
    expect(backdropOf(text)).toBe("var(--wa-phone-grouped, #f1f2f5)");
    expect(screenOf(text)).toBe("transparent");
  });

  it("lays a gradient, pattern and animation out on the phone's screen", () => {
    const fancy: WatchPage = { ...LIVING, backgroundColor: "GRADIENT|#FF0000|#0000FF", backgroundPattern: "grid", backgroundOverlay: "aurora" };
    const text = phonePicture(fancy);
    expect(backdropOf(text)).toBe(watchScreenBackground(fancy, 1, DEFAULT_PHONE.screen));
    expect(backdropOf(text)).toContain("radial-gradient");
    expect(screenOf(text)).toBe("transparent");
  });

  it("puts a page photo in the backdrop at the phone screen's height", () => {
    const photographed: WatchPage = { ...LIVING, backgroundImageId: "photo-1" };
    const text = flat(renderWatchPagePreview({
      page: photographed, pages: PAGES, screen: phonePagesScreen(iphone), phone: iphone, scale: 1, photo: () => "https://example.test/p.jpg",
    }));
    const backdrop = text.slice(text.indexOf("wa-phone-backdrop"), text.indexOf('class="wa-phone-status"'));
    expect(backdrop).toContain(`class=wp-page-photo-clip style=height:${DEFAULT_PHONE.screen.height}px`);
    expect(backdrop).toContain("p.jpg");
    // The pages area draws no photo of its own.
    expect(text.slice(text.indexOf('class="wa-phone-area"'))).not.toContain("wp-page-photo");
  });

  it("does the same in the Watch look, whose page backdrop the app also draws behind the tab", () => {
    const text = phonePicture(LIVING, old);
    expect(backdropOf(text)).toBe(watchScreenBackground(LIVING, 1, DEFAULT_PHONE.screen));
    expect(screenOf(text)).toBe("transparent");
  });

  it("leaves a watch's screen its own background", () => {
    const text = flat(renderWatchPagePreview({ page: LIVING, pages: PAGES, screen: { width: 208, height: 248 }, scale: 1 }));
    expect(text).not.toContain("wa-phone-backdrop");
    expect(screenOf(text)).toBe(watchScreenBackground(LIVING, 1, { width: 208, height: 248 }));
  });
});

describe("the Watch look on an iPhone", () => {
  it("lays the phone out as a phone with no Page look says", () => {
    const watchLook = phonePagesLayout(DEFAULT_PHONE, { look: "watch" });
    expect(watchLook).toEqual(old);
    expect(watchLook.look).toBeUndefined();
    expect(old.area).toEqual({ x: 6, y: 118, width: 390, height: 690 });
  });

  it("draws the watch's own frame: the watch's title, background, corners and dots", () => {
    const text = phonePicture(LIVING, old);
    expect(text).toContain('class="wa-phone"');
    expect(text).not.toContain("wa-phone ios");
    // The top row keeps its grid and gear, with the name left to the watch's
    // own title in the page.
    expect(text).toContain("wa-phone-grid");
    expect(text).toContain("wa-phone-gear");
    expect(text).not.toContain("wa-phone-title");
    expect(text).not.toContain("wa-phone-grouped");
    expect(text).not.toContain("wa-phone-dock");
    expect(text).toContain('class="wp-title pill"');
    expect(text).toContain("border-radius:8px");
    expect(text).not.toContain("border-radius:22px");
    expect(text).toContain("wp-pages-dot");
    // The status bar's ink is the white it always was.
    expect(text).toContain('fill="#fff"');
    expect(text).not.toContain("currentColor");
  });
});

describe("a watch", () => {
  it("is drawn the same whatever its document says of the Page look", () => {
    const screen = { width: 208, height: 248 };
    const plain = flat(renderWatchPagePreview({ page: LIVING, pages: PAGES, screen, scale: 1 }));
    for (const behavior of [{ phonePageLook: "iphone" }, { phonePageLook: "watch" }]) {
      expect(flat(renderWatchPagePreview({ page: LIVING, pages: PAGES, screen, scale: 1, behavior }))).toBe(plain);
    }
    expect(plain).toContain('class="wa-watch"');
    expect(plain).toContain('class="wp-title pill"');
    expect(plain).not.toContain("wa-phone");
    expect(plain).not.toContain("wa-phone-grouped");
    expect(plain).not.toContain("border-radius:22px");
  });
});
