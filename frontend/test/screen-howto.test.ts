import { describe, expect, it } from "vitest";
import { renderHowTo, SCREEN_HOW_TO, screenHowTo } from "../src/screen-howto.js";
import { WATCH_SCREENS } from "../src/shell.js";
import { MENU_HOW_TO } from "../src/watch-menus/menu-stage.js";
import { rowTipLeft } from "../src/watch-row.js";

/** A template flattened to its markup, values in place. */
const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

const ALL_WORDS = [
  ...Object.values(SCREEN_HOW_TO).flatMap((h) => [h.label, h.how, h.use]),
  ...Object.values(MENU_HOW_TO).flatMap((h) => [h.open, h.use]),
];

describe("how each watch screen is used", () => {
  it("every live screen has a how-to for its tab's hover card", () => {
    for (const screen of WATCH_SCREENS) {
      if (screen.retired === true) continue;
      const how = screenHowTo(screen.id);
      expect(how, screen.id).toBeDefined();
      expect(how!.how.length, screen.id).toBeGreaterThan(20);
      expect(how!.use.length, screen.id).toBeGreaterThan(10);
    }
    expect(screenHowTo("settings")).toBeUndefined();
    expect(screenHowTo("toString")).toBeUndefined();
  });

  it("keeps to the panel's plain words", () => {
    for (const text of ALL_WORDS) {
      expect(text, text).not.toMatch(/…|\.\.\.|\s-\s|—|–/);
      expect(text.trim(), text).toBe(text);
      expect(text, text).toMatch(/^[A-Z]/);
    }
  });

  it("says the page switcher opens from the Anywhere menu, never a pull down", () => {
    expect(MENU_HOW_TO.switcher.open).toContain("Pages slot");
    expect(ALL_WORDS.join(" ")).not.toMatch(/pull down/i);
  });

  it("draws the card", () => {
    const card = flat(renderHowTo(SCREEN_HOW_TO.pages));
    expect(card).toContain(`<b>${SCREEN_HOW_TO.pages.how}</b>`);
    expect(card).toContain("Good for");
    expect(card).toContain(SCREEN_HOW_TO.pages.use);
  });

  it("keeps the hover card under its tab and inside the window", () => {
    expect(rowTipLeft({ left: 500, width: 100 }, 360, 1400)).toBe(370);
    expect(rowTipLeft({ left: 0, width: 80 }, 360, 1400)).toBe(8);
    expect(rowTipLeft({ left: 1350, width: 50 }, 360, 1400)).toBe(1032);
  });
});
