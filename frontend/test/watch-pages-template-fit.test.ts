import { describe, expect, it } from "vitest";
import { type TemplateFit, templateTextFit, templateTextUnits } from "../src/watch-pages/template-fit.js";

const STAMP = "2026-04-08T21:24:11.382181+00:00";
const ROOMS = "[icon:books.vertical.fill] Aanb [icon:thermometer.medium] — [icon:drop] —\n[icon:pc] Kant [icon:thermometer.high] 66,2° [icon:drop] —";

const words = (fit: TemplateFit): string[] => fit.lines.map((line) => line.pieces.map((p) => (p.kind === "text" ? p.text : "[i]")).join("").trim());

// The cases below were read off renders of `TemplateRichText.render` under the
// modifiers of `TemplateTileOverlay` on the iPhone simulator, and off a real
// watch's tile of 100 by 66 points.
describe("a template's text fitted as a device fits it", () => {
  it("shrinks to the size that keeps a time stamp on its one line, on the iPhone", () => {
    const fit = templateTextFit(`${ROOMS}\n${STAMP}`, 166, 111, 5, "iphone");
    expect(words(fit)).toHaveLength(3);
    expect(words(fit)[2]).toBe(STAMP);
    expect(fit.size).toBeGreaterThanOrEqual(9.4);
    expect(fit.size).toBeLessThanOrEqual(9.6);
  });

  it("keeps the icons at the full size while the words shrink", () => {
    const fit = templateTextFit(`${ROOMS}\n${STAMP}`, 166, 111, 5, "iphone");
    expect(fit.iconSize).toBe(17);
    expect(fit.size).toBeLessThan(fit.iconSize);
    expect(fit.iconRow).toBeCloseTo(22, 1);
  });

  it("draws the same time stamp on one line of a real watch's tile", () => {
    const fit = templateTextFit(`${ROOMS}\n${STAMP}`, 92, 66, 5, "watch");
    expect(words(fit)[2]).toBe(STAMP);
    expect(fit.size).toBeCloseTo(6, 1);
    expect(templateTextUnits(STAMP, "watch") * fit.size).toBeLessThanOrEqual(92);
  });

  it("keeps a short text at the full size", () => {
    const fit = templateTextFit("[icon:pc] One\n[icon:pc] Two", 166, 111, 5, "iphone");
    expect(fit.size).toBe(17);
    expect(words(fit)).toEqual(["[i] One", "[i] Two"]);
  });

  it("hyphenates a word of letters rather than shrink for it", () => {
    const fit = templateTextFit("abcdefghijklmnopqrstuvwxyzabcdefghij", 166, 111, 5, "iphone");
    expect(fit.size).toBe(17);
    expect(words(fit).length).toBeGreaterThan(1);
    expect(words(fit)[0]?.endsWith("-")).toBe(true);
  });

  it("breaks after a hyphen between letters, and never between digits", () => {
    expect(words(templateTextFit("aaaa-bbbb-cccc-dddd-eeee-ffff-gggg-hhhh", 166, 111, 5, "iphone"))[0]).toMatch(/-$/);
    const dates = templateTextFit("2026-04-08-2026-04-08-2026-04-08", 166, 111, 5, "iphone");
    expect(words(dates)).toEqual(["2026-04-08-2026-04-08-2026-04-08"]);
    expect(dates.size).toBeLessThan(17);
  });

  it("shrinks to 40% over the line limit, and ends the last line it keeps in an ellipsis", () => {
    const fit = templateTextFit("one\ntwo\nthree\nfour\nfive\nsix\nseven", 166, 111, 5, "iphone");
    expect(fit.size).toBe(6.8);
    expect(words(fit)).toEqual(["one", "two", "three", "four", "five…"]);
  });

  it("keeps the lines the height holds when icons keep the rows tall", () => {
    const fit = templateTextFit("[icon:pc] One\n[icon:pc] Two\n[icon:pc] Three\n[icon:pc] Four\n[icon:pc] Five", 92, 66, 5, "iphone");
    expect(fit.size).toBe(6.8);
    expect(words(fit)).toEqual(["[i] One", "[i] Two", "[i] Three…"]);
  });

  it("breaks a word anywhere only at the smallest size", () => {
    const fit = templateTextFit(STAMP, 92, 66, 5, "iphone");
    expect(fit.size).toBe(6.8);
    expect(words(fit).join("")).toBe(STAMP);
    expect(words(fit).length).toBe(2);
  });

  it("follows the line limit the tile asks for", () => {
    const fit = templateTextFit("one\ntwo\nthree", 166, 111, 2, "iphone");
    expect(words(fit)).toEqual(["one", "two…"]);
  });

  it("keeps each run's row and cell for the template editor", () => {
    const fit = templateTextFit("Top [icon:a] x\n\n[icon:b] y", 166, 111, 5, "iphone");
    const marks = fit.lines.flatMap((line) => line.pieces).filter((p) => p.kind === "icon" || p.marked).map((p) => [p.kind, p.row, p.cell]);
    expect(marks).toEqual([["text", 0, 0], ["icon", 0, 1], ["text", 0, 1], ["icon", 1, 0], ["text", 1, 0]]);
  });
});
