import { describe, expect, it } from "vitest";
import { renderTeachCard, renderTeachWatch, TEACH_LOOPS, type TeachLoopId, teachStyles, teachWords } from "../src/teach-loop.js";

/** A template flattened to its markup, values in place. */
const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

const IDS = Object.keys(TEACH_LOOPS) as TeachLoopId[];

describe("teach loops", () => {
  it("lights each step in its own window, in order, inside the loop", () => {
    for (const id of IDS) {
      const loop = TEACH_LOOPS[id];
      const steps = loop.groups.flatMap((g) => g.steps);
      expect(loop.windows.length, id).toBe(steps.length);
      let last = -1;
      for (const [from, to] of loop.windows) {
        expect(from, id).toBeGreaterThan(last);
        expect(to, id).toBeGreaterThan(from);
        expect(to, id).toBeLessThanOrEqual(100);
        last = to;
      }
      expect(loop.still, id).toBeGreaterThan(0);
      expect(loop.still, id).toBeLessThan(100);
    }
  });

  it("makes one keyframes per step", () => {
    const sheet = teachStyles.cssText;
    for (const id of IDS) {
      TEACH_LOOPS[id].windows.forEach((_, i) => {
        expect(sheet, `${id} ${i + 1}`).toContain(`@keyframes tl-${id}-s${i + 1} `);
        expect(sheet, `${id} ${i + 1}`).toContain(`.tl-${id} .tl-s${i + 1} {`);
      });
    }
  });

  it("keeps to the panel's plain words", () => {
    for (const id of IDS) {
      for (const text of teachWords(id)) {
        expect(text, text).not.toMatch(/…|\.\.\.|\s-\s|—|–/);
        expect(text.trim(), text).toBe(text);
        expect(text, text).toMatch(/^[A-Z]/);
      }
    }
  });

  it("says a menu opens from the + in the middle, and the Anywhere menu by the crown", () => {
    const words = teachWords("menus").join(" ");
    expect(words).toContain("slide to the middle");
    expect(words).toMatch(/turn the (Digital Crown|crown)/);
    expect(words).toContain("empty spot");
    expect(TEACH_LOOPS.menus.kinds?.map(([name]) => name)).toEqual(["By type", "One tile", "Anywhere"]);
  });

  it("draws each card with its steps, bold parts and actions", () => {
    for (const id of IDS) {
      const markup = flat(renderTeachCard(id, { actions: renderTeachWatch(id) }));
      expect(markup, id).toContain(`tl-${id}`);
      expect(markup, id).toContain("<b>");
      expect(markup, id).toContain("tl-pause");
      expect(markup, id).not.toContain("**");
    }
  });

  it("draws the bare watch small for a hover card", () => {
    const markup = flat(renderTeachWatch("pages", true));
    expect(markup).toContain("tl-mini");
    expect(markup).toContain("tl-watch");
  });
});
