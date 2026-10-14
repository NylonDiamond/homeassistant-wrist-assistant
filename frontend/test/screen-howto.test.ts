import { describe, expect, it } from "vitest";
import { renderHowTo, renderScreenIntro, SCREEN_HOW_TO, SCREEN_INTROS } from "../src/screen-howto.js";
import { MENU_HOW_TO } from "../src/watch-menus/menu-stage.js";

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
  ...Object.values(SCREEN_INTROS),
  ...Object.values(SCREEN_HOW_TO).flatMap((h) => [h.label, h.how, h.use]),
  ...Object.values(MENU_HOW_TO).flatMap((h) => [h.open, h.use]),
];

describe("what each watch screen is for", () => {
  it("every screen has an intro and a how-to card", () => {
    for (const text of Object.values(SCREEN_INTROS)) expect(text.length, text).toBeGreaterThan(20);
    for (const id of Object.keys(SCREEN_HOW_TO) as (keyof typeof SCREEN_HOW_TO)[]) {
      expect(SCREEN_HOW_TO[id].how.length, id).toBeGreaterThan(20);
      expect(SCREEN_HOW_TO[id].use.length, id).toBeGreaterThan(10);
    }
  });

  it("keeps to the panel's plain words", () => {
    for (const text of ALL_WORDS) {
      expect(text, text).not.toMatch(/TODO|…|\.\.\.|\s-\s|—|–/);
      expect(text.trim(), text).toBe(text);
      expect(text, text).toMatch(/^[A-Z]/);
    }
  });

  it("draws the card and the intro", () => {
    const card = flat(renderHowTo(SCREEN_HOW_TO.pages));
    expect(card).toContain(`<b>${SCREEN_HOW_TO.pages.how}</b>`);
    expect(card).toContain("Good for");
    expect(card).toContain(SCREEN_HOW_TO.pages.use);
    expect(flat(renderScreenIntro(SCREEN_INTROS.voice))).toBe(`<p class="screen-intro">${SCREEN_INTROS.voice}</p>`);
  });
});
