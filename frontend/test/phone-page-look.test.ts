// An iPhone's Page look (`phonePageLook`, phone-frame.ts): in the iPhone
// look, the default, the phone's preview draws the page's name as a large
// title above the pages area, a page with no background of its own on the
// system's grouped background, 22 point tile corners and a plain page
// control; in the Watch look the phone keeps the frame it always had; and a
// watch never changes, whatever a document says.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_PHONE,
  PHONE_LARGE_TITLE_HEIGHT,
  phoneFrameStyles,
  phonePageLookOf,
  phonePagesLayout,
  phonePagesScreen,
  phoneTileCornerRadius,
} from "../src/phone-frame.js";
import type { WatchPage } from "../src/watch-pages/model.js";
import {
  previewTileCornerRadius,
  renderWatchPagePreview,
  watchPageHasOwnBackground,
  watchScreenBackground,
  watchTileCornerRadius,
} from "../src/watch-pages/preview.js";

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
  it("puts the large title's band above the pages area, which is that much shorter", () => {
    expect(iphone.look).toBe("iphone");
    expect(iphone.title).toEqual({ x: 16, y: 70, width: 370, height: PHONE_LARGE_TITLE_HEIGHT });
    expect(iphone.area).toEqual({ x: 6, y: 70 + PHONE_LARGE_TITLE_HEIGHT, width: 390, height: 695 - PHONE_LARGE_TITLE_HEIGHT });
    expect(iphone.tabBar).toEqual(old.tabBar);
    expect(iphone.bottomBar).toEqual(old.bottomBar);
  });

  it("draws the page's name as the large title on the grouped background, with no watch title", () => {
    const text = phonePicture(LIVING);
    expect(text).toContain('class="wa-phone ios"');
    expect(text).toContain('<div class="wa-phone-title"');
    expect(text).toContain("<span>Living Room</span>");
    expect(text).toContain("font-size:34px");
    expect(text).toContain("background:var(--wa-phone-grouped, #f2f2f7)");
    // The watch's own small title in the top band is gone.
    expect(text).not.toContain('class="wp-title');
    expect(text).not.toContain("wp-clock");
  });

  it("follows the panel's light and dark skins for the grouped background", () => {
    const css = phoneFrameStyles.cssText;
    expect(css).toContain(".wa-phone.ios .wa-phone-screen { background: var(--wa-phone-grouped, #f2f2f7); color: var(--wa-phone-ink, #000000); }");
    const panel = readFileSync(join(__dirname, "..", "src", "panel.ts"), "utf8");
    const light = panel.indexOf("--wa-phone-grouped: #f2f2f7;");
    const dark = panel.indexOf("--wa-phone-grouped: #000000;");
    expect(light).toBeGreaterThan(0);
    expect(dark).toBeGreaterThan(light);
    expect(panel.lastIndexOf(":host([dark]) {", dark)).toBeGreaterThan(light);
  });

  it("rounds tiles at 22 points, held to half the tile's short side", () => {
    expect(phoneTileCornerRadius(128, 128)).toBe(22);
    expect(phoneTileCornerRadius(30, 128)).toBe(15);
    expect(previewTileCornerRadius({ phone: iphone }, 128, 128)).toBe(22);
    expect(previewTileCornerRadius({ phone: old }, 128, 128)).toBe(watchTileCornerRadius(128, 128));
    expect(previewTileCornerRadius({}, 128, 128)).toBe(8);
    const text = phonePicture(LIVING);
    expect(text).toContain("border-radius:22px");
    expect(text).not.toContain("border-radius:8px");
  });

  it("draws a plain page control under the pages, one dot a page, the shown page's lit", () => {
    const text = phonePicture(KITCHEN);
    const dots = [...text.matchAll(/class="wa-phone-pc" style=([^>]*)>/g)].map((m) => m[1]!);
    expect(dots).toHaveLength(3);
    expect(dots.map((d) => /opacity:([\d.]+)/.exec(d)![1])).toEqual(["0.3", "1", "0.3"]);
    expect(dots[0]).toContain("width:7px;height:7px");
    expect(dots[1]).toContain("margin-left:9px");
    // In the strip under the pages, never over the top of them.
    expect(text).not.toContain('class="wa-phone-dots"');
    // Page dots off hides it.
    expect(phonePicture(KITCHEN, iphone, { showPageIndicator: false })).not.toContain("wa-phone-pc");
  });

  it("keeps a page's own color, gradient, photo, pattern or animation", () => {
    expect(watchPageHasOwnBackground(LIVING)).toBe(false);
    for (const own of [
      { backgroundColor: "#FF0000" },
      { backgroundColor: "GRADIENT|#FF0000|#0000FF" },
      { backgroundImageId: "photo-1" },
      { backgroundPattern: "grid" },
      { backgroundOverlay: "aurora" },
    ]) {
      expect(watchPageHasOwnBackground({ ...LIVING, ...own }), JSON.stringify(own)).toBe(true);
    }
    const redPage = { ...LIVING, backgroundColor: "#FF0000" };
    const red = phonePicture(redPage);
    expect(red).not.toContain("background:var(--wa-phone-grouped");
    expect(red).toContain(`background:${watchScreenBackground(redPage, 1, phonePagesScreen(iphone))}`);
    // The large title stays: it is the iPhone's, not the page's.
    expect(red).toContain("<span>Living Room</span>");
  });
});

describe("the Watch look on an iPhone", () => {
  it("lays the phone out as it always was", () => {
    const watchLook = phonePagesLayout(DEFAULT_PHONE, { look: "watch" });
    expect(watchLook).toEqual(old);
    expect(watchLook.look).toBeUndefined();
    expect(watchLook.title).toBeUndefined();
    expect(old.area).toEqual({ x: 6, y: 70, width: 390, height: 695 });
  });

  it("draws the old frame: the watch's title, background, corners and dots", () => {
    const text = phonePicture(LIVING, old);
    expect(text).toContain('class="wa-phone"');
    expect(text).not.toContain("wa-phone ios");
    expect(text).not.toContain("wa-phone-title");
    expect(text).not.toContain("wa-phone-grouped");
    expect(text).not.toContain("wa-phone-pc");
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
