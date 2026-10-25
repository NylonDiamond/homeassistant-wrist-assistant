// One Look's layout, text fitting and metrics, ported from the app's
// `OneLookLayoutTests.swift`, `OneLookTextTests.swift` and
// `OneLookMetricsTests.swift` with the same fake measurer (every character
// 0.55 em, whatever the weight, design or tracking) and the same expected
// sizes. The "derived" cases are the app's Swift layout run with that fake on
// the bridge look the devices draw now (the job's layout spec, section 12.2).

import { svg } from "lit";
import { describe, expect, it } from "vitest";

import type { IconProvider } from "../src/renderer.js";
import { WATCH_FONT_FAMILY, WATCH_ROUNDED_FAMILY } from "../src/watch-pages/preview.js";
import {
  ONE_LOOK_DEFAULT_STYLE,
  oneLookCentredGlyphMax,
  oneLookCentredGlyphMin,
  oneLookCentredNameInset,
  oneLookCentredNameMin,
  oneLookBarSide,
  oneLookBarTop,
  oneLookLayoutInput,
  oneLookLayoutMetrics,
  oneLookRectsIntersect,
  oneLookRowCaps,
  oneLookRowKey,
  oneLookRowNameSize,
  oneLookStyleFactor,
  oneLookTextRect,
  oneLookTinyDiscFloor,
  ONE_LOOK_CENTRED_GLYPH_WIDTH_SHARE,
  ONE_LOOK_STATE_SCALE_RANGE,
  resolveOneLookLayout,
  type OneLookAccessory,
  type OneLookBigValue,
  type OneLookLayout,
  type OneLookLayoutInput,
  type OneLookRect,
  type OneLookTileStyle,
} from "../src/watch-pages/one-look/layout.js";
import {
  ONE_LOOK_FONT_FAMILIES,
  ONE_LOOK_SYMBOL_MARGIN_H,
  ONE_LOOK_SYMBOL_MARGIN_W,
  oneLookEstimatedWidth,
  oneLookMeasurer,
  oneLookSymbolImage,
} from "../src/watch-pages/one-look/measurer.js";
import {
  ONE_LOOK_CHOICES,
  ONE_LOOK_PHONE,
  ONE_LOOK_TILE_SPACING,
  ONE_LOOK_WATCH,
  oneLookCellInset,
  oneLookDrawnSize,
  oneLookDrawnSizeOfCell,
  oneLookGridSidePadding,
  oneLookGridUnit,
  oneLookMetrics,
  oneLookPhonePagesInset,
  oneLookScaledText,
  oneLookUnitTextSize,
  oneLookVisibleGap,
  type OneLookDevice,
} from "../src/watch-pages/one-look/metrics.js";
import {
  NO_STATE,
  ONE_LOOK_NARROW_MIN,
  OneLookTextFitter,
  oneLookStateWidth,
  stateFitText,
  type StateLine,
  type TextMeasurer,
} from "../src/watch-pages/one-look/text.js";

/** Every character is 0.55 em wide, whatever the weight, design or tracking. */
const fake: TextMeasurer = { width: (text, size) => Array.from(text).length * size * 0.55 };

function near(a: number | undefined, b: number, tolerance = 0.01): void {
  expect(a).toBeDefined();
  expect(Math.abs(a! - b), `${a} against ${b}`).toBeLessThan(tolerance);
}

function nearRect(r: OneLookRect | undefined, x: number, y: number, width: number, height: number, tolerance = 0.005): void {
  expect(r).toBeDefined();
  near(r!.x, x, tolerance);
  near(r!.y, y, tolerance);
  near(r!.width, width, tolerance);
  near(r!.height, height, tolerance);
}

const minX = (r: OneLookRect) => Math.min(r.x, r.x + r.width);
const maxX = (r: OneLookRect) => Math.max(r.x, r.x + r.width);
const minY = (r: OneLookRect) => Math.min(r.y, r.y + r.height);
const maxY = (r: OneLookRect) => Math.max(r.y, r.y + r.height);
const midX = (r: OneLookRect) => r.x + r.width / 2;
const midY = (r: OneLookRect) => r.y + r.height / 2;
function insetBy(r: OneLookRect, d: number): OneLookRect | undefined {
  const width = Math.abs(r.width) - 2 * d, height = Math.abs(r.height) - 2 * d;
  return width < 0 || height < 0 ? undefined : { x: minX(r) + d, y: minY(r) + d, width, height };
}

// Screens, by width in points

type Screen = "phone402" | "ultra211" | "watch45mm198" | "watch41mm176";
const SCREENS: readonly Screen[] = ["phone402", "ultra211", "watch45mm198", "watch41mm176"];
const WIDTH: Record<Screen, number> = { phone402: 402, ultra211: 211, watch45mm198: 198, watch41mm176: 176 };
const deviceOf = (screen: Screen): OneLookDevice => (screen === "phone402" ? "phone" : "watch");

/** A tile's drawn size on a screen: the grid's square unit (the width less
 * 22, over 12) inside the side padding, the 2 pt pitch, less the cell inset a
 * side. */
function drawn(screen: Screen, colSpan: number, rowSpan: number): { width: number; height: number } {
  const device = deviceOf(screen);
  const m = oneLookMetrics(device);
  const unit = (WIDTH[screen] - 2 * m.sidePadding - 22) / 12;
  return oneLookDrawnSizeOfCell({ width: colSpan * unit + (colSpan - 1) * 2, height: rowSpan * unit + (rowSpan - 1) * 2 }, device);
}

const percent = (figure: string): StateLine => ({ kind: "number", figure, unit: "%" });
const word = (w: string, short?: string, amber?: boolean): StateLine => ({ kind: "word", word: w, short, amber });

interface Options {
  name?: string;
  state?: StateLine;
  hasIcon?: boolean;
  accessory?: OneLookAccessory;
  isChart?: boolean;
  big?: OneLookBigValue;
  nameCap?: number;
  centred?: boolean;
  topBar?: boolean;
  glyphAspect?: number;
  glyphExtent?: number;
  glyphIsPhoto?: boolean;
  style?: Partial<OneLookTileStyle>;
  textScale?: number;
}

function input(screen: Screen, colSpan: number, rowSpan: number, o: Options = {}): OneLookLayoutInput {
  return oneLookLayoutInput({
    device: deviceOf(screen),
    size: drawn(screen, colSpan, rowSpan),
    colSpan,
    rowSpan,
    name: o.name ?? "Kitchen",
    state: o.state ?? percent("64"),
    hasIcon: o.hasIcon ?? true,
    accessory: o.accessory ?? "none",
    isChart: o.isChart ?? false,
    bigValue: o.big,
    nameCap: o.nameCap,
    centred: o.centred ?? false,
    topBar: o.topBar ?? false,
    glyphAspect: o.glyphAspect ?? 1,
    glyphExtent: o.glyphExtent ?? 1.25,
    glyphIsPhoto: o.glyphIsPhoto ?? false,
    style: { ...ONE_LOOK_DEFAULT_STYLE, ...o.style },
    textScale: o.textScale ?? 1,
  });
}

function layout(screen: Screen, colSpan: number, rowSpan: number, o: Options = {}): OneLookLayout {
  return resolveOneLookLayout(input(screen, colSpan, rowSpan, o), fake);
}

describe("One Look metrics", () => {
  it("has each device's own table", () => {
    const p = ONE_LOOK_PHONE;
    expect([p.nameSize, p.nameMin, p.nameTracking, p.figureSize, p.unitScale, p.unitMin, p.wordSize, p.textMin]).toEqual([15.5, 11, -0.01, 21, 0.66, 0, 15, 12]);
    expect([p.discK, p.discMin, p.discMax, p.glyphK, p.insetK, p.insetMin, p.insetMax, p.stripDiscMax, p.stripGap]).toEqual([0.35, 30, 46, 0.58, 0.11, 10, 14, 44, 11]);
    near(oneLookUnitTextSize(p), 13.86, 0.0001);
    const w = ONE_LOOK_WATCH;
    expect([w.nameSize, w.nameMin, w.figureSize, w.unitMin, w.wordSize, w.textMin]).toEqual([11.5, 10, 14, 10, 11, 10]);
    expect([w.discK, w.discMin, w.discMinNarrow, w.discMax, w.glyphK, w.insetK, w.insetMin, w.insetMax]).toEqual([0.41, 20, 16, 40, 0.64, 0.09, 4.5, 7]);
    // The watch's unit is 9.24, floored to 10.
    expect(oneLookUnitTextSize(w)).toBe(10);
    expect(oneLookMetrics("phone")).toBe(ONE_LOOK_PHONE);
    expect(oneLookMetrics("watch")).toBe(ONE_LOOK_WATCH);
  });

  it("grows only the text with larger text", () => {
    expect(oneLookScaledText(ONE_LOOK_PHONE, 1)).toBe(ONE_LOOK_PHONE);
    const big = oneLookScaledText(ONE_LOOK_WATCH, 1.2);
    near(big.nameSize, 13.8); near(big.nameMin, 12); near(big.figureSize, 16.8);
    near(big.unitMin, 12); near(big.wordSize, 13.2); near(big.textMin, 12);
    near(big.bigSize, 26.4); near(big.bigSubSize, 12.6);
    expect([big.discMin, big.discMax, big.accessoryDisc, big.liveSize, big.insetMin, big.cellInset, big.cornerRadiusMax]).toEqual([20, 40, 20, 9, 4.5, 0.5, 12]);
  });

  it("reads the app's switches as they are now", () => {
    expect(ONE_LOOK_CHOICES.tinyTiles).toBe("shrinkToDisc");
    expect(ONE_LOOK_CHOICES.centredGlyphOnPhone).toBe(true);
    expect(ONE_LOOK_CHOICES.centredGlyphOnWatch).toBe(true);
    expect(ONE_LOOK_CHOICES.brightnessBar).toBe(true);
    expect(ONE_LOOK_CHOICES.centredNamesOneLine).toBe(true);
  });

  it("holds a tile's own sizes in their range", () => {
    expect(oneLookStyleFactor(undefined, 7, ONE_LOOK_STATE_SCALE_RANGE)).toBe(1);
    expect(oneLookStyleFactor(21, 7, ONE_LOOK_STATE_SCALE_RANGE)).toBe(1.5);
    expect(oneLookStyleFactor(3, 7, ONE_LOOK_STATE_SCALE_RANGE)).toBe(0.75);
    expect(oneLookStyleFactor(8, 7, ONE_LOOK_STATE_SCALE_RANGE)).toBe(1.14);
  });
});

describe("One Look grid", () => {
  it("keeps its gaps and columns", () => {
    near(oneLookVisibleGap("phone"), 12);
    near(oneLookVisibleGap("watch"), 3);
    const phoneUnit = oneLookGridUnit(402, "phone");
    const watchUnit = oneLookGridUnit(211, "watch");
    near(phoneUnit, 29.83);
    near(watchUnit, 15.5);
    near(oneLookDrawnSize(1, 1, phoneUnit, "phone").width, 19.83);
    near(oneLookDrawnSize(1, 1, watchUnit, "watch").width, 14.5);
    expect(oneLookGridSidePadding("watch")).toBe(1.5);
    expect(oneLookGridSidePadding("phone")).toBe(0);
    expect(oneLookCellInset("phone", true)).toBe(0);
    expect(oneLookCellInset("watch", false, true)).toBe(0);
    expect(oneLookCellInset("phone")).toBe(5);
    expect(oneLookCellInset("watch")).toBe(0.5);
    expect(oneLookPhonePagesInset(16)).toBe(ONE_LOOK_PHONE.sidePadding);
    expect(oneLookPhonePagesInset(6) + oneLookCellInset("phone")).toBe(6);
  });

  it("puts every tile where the mock puts it", () => {
    for (const screen of ["phone402", "ultra211"] as const) {
      const device = deviceOf(screen);
      const [pad, gap] = device === "phone" ? [16, 12] : [2, 3];
      const col = (WIDTH[screen] - 2 * pad - 11 * gap) / 12;
      const m = oneLookMetrics(device);
      const unit = oneLookGridUnit(WIDTH[screen], device);
      for (let c = 0; c < 12; c++) {
        for (let span = 1; span <= 12 - c; span++) {
          const x = m.sidePadding + c * (unit + ONE_LOOK_TILE_SPACING) + oneLookCellInset(device);
          near(x, pad + c * (col + gap));
          near(oneLookDrawnSize(span, 4, unit, device).width, span * col + (span - 1) * gap);
        }
      }
      expect(oneLookDrawnSize(6, 4, unit, device)).toEqual(drawn(screen, 6, 4));
    }
  });

  it("draws the plan's screens' sizes", () => {
    near(drawn("phone402", 6, 4).width, 179);
    near(drawn("phone402", 6, 4).height, 115.33);
    near(drawn("phone402", 6, 2).height, 51.67);
    near(drawn("ultra211", 6, 4).width, 102);
    near(drawn("ultra211", 6, 4).height, 67);
    near(drawn("watch41mm176", 6, 4).width, 84.5);
    near(drawn("watch41mm176", 6, 4).height, 55.33);
  });
});

describe("One Look names", () => {
  const phone = new OneLookTextFitter("phone", fake);
  const watch = new OneLookTextFitter("watch", fake);

  it("keep the row's size when they fit", () => {
    expect(phone.fitName("Porch", 150, undefined)).toEqual({ size: 15.5, lines: ["Porch"] });
    expect(watch.fitName("Porch", 80, 11.5, 10.5)).toEqual({ size: 10.5, lines: ["Porch"] });
  });

  it("are cut in the middle keeping their last word", () => {
    const fit = phone.fitName("Aranet4 03A66 Battery", 110, undefined);
    near(fit.size, 12.4, 0.0001);
    expect(fit.lines).toEqual(["Aranet4…Battery"]);
    expect(phone.midTrunc("Aranet4 03A66 Battery", 12.4, 106.7)).toBe("Aranet4…Battery");
    expect(phone.midTrunc("Aranet4 03A66 Carbon Dioxide", 10, 150)).toBe("Aranet4 03A66…Dioxide");
    expect(phone.midTrunc("Nightstand", 10, 43.65)).toBe("Nights…");
  });

  it("shrink to 88% on one line, a lone word to 72%", () => {
    expect(phone.fitName("Kitchen Island", 114, 15.5)).toEqual({ size: 14.35, lines: ["Kitchen Island"] });
    expect(phone.fitName("Thermostat", 72.2, undefined)).toEqual({ size: 12.7, lines: ["Thermostat"] });
  });

  it("on two lines shrink until the longest word fits", () => {
    const fit = phone.fitName("Upstairs Hallway Ceiling Motion Sensor", 62, 15.5);
    near(fit.size, 13.65, 0.0001);
    expect(fit.lines.length).toBe(2);
    expect(fit.lines[0]).toBe("Upstairs");
    expect(fit.lines[1]!.endsWith("…Sensor")).toBe(true);
    expect(phone.fitName("Upstairs Hallway", 30, 15.5).size).toBe(11);
  });

  it("on a row that has shrunk do not shrink a second time", () => {
    expect(phone.fitName("Kitchen Island", 108.25, 15, 15)).toEqual({ size: 15, lines: ["Kitchen", "Island"] });
    expect(phone.fitName("Kitchen Island", 108.25, undefined, 15)).toEqual({ size: 13.6, lines: ["Kitchen Island"] });
  });

  it("would wrap by the size one line may shrink to", () => {
    expect(phone.wouldWrap("Kitchen Island", 100)).toBe(true);
    expect(phone.wouldWrap("Kitchen Island", 112)).toBe(false);
    expect(phone.wouldWrap("Thermostat", 10)).toBe(false);
    expect(phone.wouldWrap("Kitchen Island", 100, 13)).toBe(true);
    expect(phone.wouldWrap("Kitchen Island", 110, 13)).toBe(false);
  });

  it("on a narrow watch tile step down, split, hyphenate, then cut at 10", () => {
    expect(watch.fitNarrow("Desk Lamp", 55, true)).toEqual({ size: 10.75, lines: ["Desk Lamp"] });
    expect(watch.fitNarrow("Desk Lamp", 45, true)).toEqual({ size: 11.5, lines: ["Desk", "Lamp"] });
    expect(watch.fitNarrow("Big Desk Lamp", 53, true)).toEqual({ size: 11.5, lines: ["Big Desk", "Lamp"] });
    expect(watch.fitNarrow("Nightstand", 45, true)).toEqual({ size: 11.5, lines: ["Night-", "stand"] });
    expect(watch.fitNarrow("Nightstand", 45, false)).toEqual({ size: 10, lines: ["Nights…"] });
  });

  it("in the bridge look are one line (D22)", () => {
    const names = watch.centredNames;
    expect(names.nameWeight).toBe("medium");
    expect(names.fitOneLine("Upstairs Hallway Ceiling Motion Sensor", 96, 11.5, 9)).toEqual({ size: 9, lines: ["Upstairs…Sensor"] });
    expect(names.fitOneLine("Back Yard Motion", 96, 11.5, 9)).toEqual({ size: 10.5, lines: ["Back Yard Motion"] });
    // A Font Weight set in the editor wins in every mode.
    expect(watch.styled({ nameWeight: "bold", nameDesign: "serif" }).centredNames.nameWeight).toBe("bold");
    expect(watch.styled({ nameDesign: "standard" }).nameWeight).toBe("semibold");
  });
});

describe("One Look states", () => {
  const phone = new OneLookTextFitter("phone", fake);
  const watch = new OneLookTextFitter("watch", fake);

  it("try a word's short form before shrinking", () => {
    const fit = phone.fitState(word("Not occupied", "Vacant"), 80, 6);
    expect(fit?.parts).toEqual({ kind: "word", word: "Vacant", amber: false });
    expect(fit?.size).toBe(15);
    near(fit?.lineHeight, 18, 0.0001);
    expect(stateFitText(fit!)).toBe("Vacant");
    expect(phone.fitState(word("Not occupied", "Vacant"), 120, 6)?.parts).toEqual({ kind: "word", word: "Not occupied", amber: false });
  });

  it("shrink a word to 85%, then drop it", () => {
    const shrunk = phone.fitState(word("Not occupied", "Vacant"), 47, 6);
    expect(shrunk?.parts).toEqual({ kind: "word", word: "Vacant", amber: false });
    near(shrunk?.size, 13.8, 0.0001);
    near(shrunk?.lineHeight, 18, 0.0001);
    expect(phone.fitState(word("Not occupied", "Vacant"), 40, 6)).toBeUndefined();
    expect(watch.fitState(word("Unlocked"), 45.4, 4)?.size).toBe(10);
    expect(watch.fitState(word("Unlocked"), 45, 4)).toBeUndefined();
  });

  it("make room for the amber dot", () => {
    expect(phone.fitState(word("Unavailable", "Offline", true), 100, 6)?.parts).toEqual({ kind: "word", word: "Offline", amber: true });
    expect(phone.fitState(word("Unavailable", "Offline"), 100, 6)?.parts).toEqual({ kind: "word", word: "Unavailable", amber: false });
  });

  it("drop a number's tail on the watch under 8 columns unless kept", () => {
    const kept: StateLine = { kind: "number", figure: "4:32", tail: "left", keepTail: true };
    const loose: StateLine = { kind: "number", figure: "4:32", tail: "left" };
    expect(watch.fitState(kept, 100, 6)?.parts).toEqual({ kind: "number", figure: "4:32", tail: "left" });
    expect(watch.fitState(loose, 100, 6)?.parts).toEqual({ kind: "number", figure: "4:32" });
    expect(watch.fitState(loose, 100, 8)?.parts).toEqual({ kind: "number", figure: "4:32", tail: "left" });
    expect(phone.fitState(loose, 100, 3)?.parts).toEqual({ kind: "number", figure: "4:32", tail: "left" });
    expect(stateFitText(watch.fitState(kept, 100, 6)!)).toBe("4:32 left");
  });

  it("drop a tail that does not fit and keep the number", () => {
    const fit = phone.fitState({ kind: "number", figure: "4:32", tail: "left", keepTail: true }, 60, 6);
    expect(fit?.parts).toEqual({ kind: "number", figure: "4:32" });
    expect(fit?.size).toBe(21);
    expect(phone.fitState({ kind: "number", figure: "735", unit: "ppm", unitSpaced: true }, 5, 2)).toBeDefined();
  });

  it("carry a number's unit and line height", () => {
    const spaced = phone.fitState({ kind: "number", figure: "735", unit: "ppm", unitSpaced: true }, 200, 12);
    expect(spaced?.parts).toEqual({ kind: "number", figure: "735", unit: " ppm" });
    expect(stateFitText(spaced!)).toBe("735 ppm");
    near(spaced?.unitSize, 13.86, 0.0001);
    near(spaced?.lineHeight, 23.1, 0.0001);
    const glued = watch.fitState({ kind: "number", figure: "71", unit: "°F" }, 100, 3);
    expect(stateFitText(glued!)).toBe("71°F");
    expect(glued?.unitSize).toBe(10);
    expect(glued?.lineHeight).toBe(14);
    expect(phone.fitState(NO_STATE, 200, 12)).toBeUndefined();
  });

  it("let a number give way to 70% of its size (D22)", () => {
    expect(watch.fitState(percent("100"), 30, 6, 0.7)?.size).toBe(14);
    expect(watch.fitState(percent("100"), 20, 6, 0.7)).toBeUndefined();
  });
});

describe("One Look stacked and strip", () => {
  it("lays a phone 6x4 out stacked", () => {
    const l = layout("phone402", 6, 4);
    expect(l.mode).toBe("stacked");
    near(l.insetH, 12.687);
    expect(l.insetV).toBe(l.insetH);
    near(l.discRect.width, 40.367);
    expect([l.discRect.x, l.discRect.y]).toEqual([l.insetH, l.insetV]);
    near(l.glyphSize, 40.367 * 0.58);
    expect(l.textOrigin.x).toBe(l.insetH);
    expect(l.name).toEqual({ size: 15.5, lines: ["Kitchen"] });
    near(l.nameLineHeight, 18.29);
    near(l.stateLineHeight, 23.1);
    near(maxY(oneLookTextRect(l)), 115.333 - l.insetV);
    near(l.textWidth, 179 - 2 * 12.687);
    expect(l.discEdge).toBe(0);
  });

  it("holds a phone 12x4 at the inset cap", () => {
    const l = layout("phone402", 12, 4);
    expect(l.mode).toBe("stacked");
    near(l.size.width, 370);
    near(l.insetH, 12.687);
    near(l.textWidth, 370 - 2 * 12.687);
  });

  it("gives a watch 6x4's disc way to the text", () => {
    const l = layout("ultra211", 6, 4, { name: "Desk Lamp", state: percent("80") });
    expect(l.mode).toBe("stacked");
    near(l.insetH, 6.03);
    near(l.discRect.width, 25.87);
    expect(l.name).toEqual({ size: 11.5, lines: ["Desk Lamp"] });
    near(l.stateLineHeight, 14);
    near(l.textOrigin.y, maxY(l.discRect) + 1.5);
  });

  it("hyphenates a narrow watch tile and keeps its state", () => {
    const l = layout("ultra211", 3, 5, { name: "Nightstand", state: word("Off") });
    expect(l.mode).toBe("stacked");
    near(l.size.width, 49.5);
    expect(l.insetH).toBe(4.5);
    expect(l.name).toEqual({ size: 11.5, lines: ["Night-", "stand"] });
    near(l.nameLineHeight, 12.42);
    expect(l.state?.parts).toEqual({ kind: "word", word: "Off", amber: false });
    near(l.discRect.width, 27.225);
  });

  it("drops the state first on a 41 mm 6x4", () => {
    const mid = layout("watch45mm198", 6, 4, { name: "Desk Lamp", state: percent("80") });
    expect(mid.mode).toBe("stacked");
    expect(mid.state).toBeDefined();
    near(mid.discRect.width, 22.3, 0.05);
    const small = layout("watch41mm176", 6, 4, { name: "Desk Lamp", state: percent("80") });
    expect(small.mode).toBe("stacked");
    expect(small.state).toBeUndefined();
    expect(small.discRect.width).toBeGreaterThanOrEqual(20);
    expect(small.name.lines).toEqual(["Desk Lamp"]);
  });

  it("lays a phone 6x2 out as a strip", () => {
    const l = layout("phone402", 6, 2, { name: "Chens iPhone", state: percent("15") });
    expect(l.mode).toBe("strip");
    near(l.insetH, 8.267);
    near(l.discRect.width, 51.667 - 2 * 8.267);
    near(midY(l.discRect), 51.667 / 2);
    near(l.textOrigin.x, l.insetH + l.discRect.width + 11);
    near(l.textWidth, 179 - 2 * 8.267 - l.discRect.width - 11);
    expect(l.name.lines).toEqual(["Chens iPhone"]);
    near(l.nameLineHeight, 15.5 * 1.16);
    near(l.stateLineHeight, 23.1 * 0.96);
    near(midY(oneLookTextRect(l)), 51.667 / 2);
    near(l.discEdge, l.insetH + l.discRect.width + 11 * 0.4);
  });

  it("caps a watch strip's disc", () => {
    const l = layout("ultra211", 6, 2, { name: "Chens iPhone", state: percent("15") });
    expect(l.mode).toBe("strip");
    expect(l.insetH).toBe(4);
    expect(l.discRect.width).toBe(20);
    near(l.textOrigin.x, 4 + 20 + 5);
    expect(l.state).toBeDefined();
  });

  it("decides a strip by rows, not by the device", () => {
    for (const screen of SCREENS) {
      expect(layout(screen, 12, 3).mode).toBe("strip");
      expect(layout(screen, 12, 4).mode).toBe("stacked");
    }
  });

  it("keeps a chart's text in the left 46%", () => {
    const l = layout("phone402", 12, 6, {
      name: "Aranet4 03A66 Carbon Dioxide", state: { kind: "number", figure: "735", unit: "ppm", unitSpaced: true }, isChart: true,
    });
    expect(l.mode).toBe("stacked");
    near(l.chartTextWidth, 370 * 0.46);
    expect(l.insetH).toBe(14);
    near(l.textWidth, 370 * 0.46 - 28);
    expect(layout("phone402", 12, 6).chartTextWidth).toBeUndefined();
  });

  it("shows a wide weather tile's big value", () => {
    const big: OneLookBigValue = { figure: "62°", sub: "H 68° L 51°" };
    const phone = layout("phone402", 12, 4, { name: "Home", state: word("Partly cloudy"), big });
    const rect = phone.bigRect!;
    expect(phone.bigValue).toEqual(big);
    near(maxX(rect), 370 - phone.insetH);
    near(midY(rect), 115.333 / 2);
    near(rect.height, 40.8 + 3 + 15.6);
    near(rect.width, 78.65);
    near(maxX(oneLookTextRect(phone)), minX(rect) - 18);
    expect(layout("ultra211", 12, 4, { name: "Home", state: word("Partly cloudy"), big }).bigRect).toBeDefined();
    const long = layout("ultra211", 12, 4, { name: "Upstairs Hallway Weather Station", state: word("Partly cloudy"), big });
    expect(long.bigRect).toBeUndefined();
    expect(long.bigValue).toBeUndefined();
    near(long.textWidth, 207 - 2 * long.insetH);
    expect(layout("ultra211", 6, 4, { name: "Home", big }).bigRect).toBeUndefined();
    expect(layout("phone402", 6, 4, { name: "Home", big }).bigRect).toBeDefined();
    expect(layout("phone402", 12, 2, { name: "Home", big }).bigRect).toBeUndefined();
  });

  it("sits an accessory top right with its touch area", () => {
    const l = layout("phone402", 6, 4, { name: "Music", state: word("Paused"), accessory: "playPause" });
    const slot = l.accessoryRect!;
    near(maxX(slot), 179 - l.insetH);
    expect(slot.y).toBe(l.insetV);
    expect(slot.width).toBe(30);
    const hit = l.accessoryHitRect!;
    expect([hit.width, hit.height]).toEqual([44, 44]);
    near(midX(hit), midX(slot));
    near(l.textWidth, 179 - 2 * l.insetH);
  });

  it("takes a strip's accessory from its text", () => {
    const plain = layout("phone402", 6, 2, { name: "Music", state: word("Paused") });
    const music = layout("phone402", 6, 2, { name: "Music", state: word("Paused"), accessory: "playPause" });
    near(plain.textWidth - music.textWidth, 30 + 6);
    near(midY(music.accessoryRect!), 51.667 / 2);
    near(maxX(music.accessoryRect!), 179 - music.insetH);
    const live = layout("phone402", 6, 2, { name: "Driveway", state: NO_STATE, accessory: "live" });
    near(plain.textWidth - live.textWidth, 11 * 4.2 + 6);
    expect(live.accessoryHitRect).toBeUndefined();
    expect(layout("ultra211", 6, 4, { accessory: "fan" }).accessoryHitRect?.width).toBe(32);
  });

  it("leaves the tile half its width for its own tap", () => {
    const l = layout("ultra211", 3, 5, { name: "Fan", state: word("On"), accessory: "fan" });
    const hit = l.accessoryHitRect!;
    near(hit.width, 49.5 / 2);
    near(maxX(hit), 49.5);
    expect(hit.y).toBeGreaterThanOrEqual(0);
    expect(maxX(l.discRect)).toBeLessThanOrEqual(minX(l.accessoryRect!));
  });

  it("draws no disc for a tile with no icon, and no name line with no name", () => {
    const stacked = layout("phone402", 6, 4, { hasIcon: false });
    expect(stacked.mode).toBe("stacked");
    expect(stacked.discRect.width).toBe(0);
    expect(stacked.drawsDisc).toBe(false);
    const strip = layout("phone402", 6, 2, { hasIcon: false });
    expect(strip.textOrigin.x).toBe(strip.insetH);
    const nameless = layout("phone402", 6, 4, { name: "" });
    expect(nameless.mode).toBe("stacked");
    expect(nameless.name.lines).toEqual([]);
    expect(oneLookRowNameSize(nameless)).toBeUndefined();
    near(nameless.textHeight, 23.1);
  });
});

describe("One Look tiny tiles", () => {
  it("makes a watch 2x2 compact", () => {
    const l = layout("ultra211", 2, 2);
    expect(l.mode).toBe("compact");
    expect(l.drawsDisc).toBe(true);
    near(l.discRect.width, 32 - 9);
    near(midX(l.discRect), 16);
    near(midY(l.discRect), 16);
    expect(l.name.lines).toEqual([]);
    expect(l.state).toBeUndefined();
    expect(l.accessoryRect).toBeUndefined();
    expect(oneLookRowNameSize(l)).toBeUndefined();
  });

  it("stacks a watch 3x3 without its state", () => {
    const l = layout("ultra211", 3, 3, { name: "Basil Soil", state: percent("41") });
    expect(l.mode).toBe("stacked");
    expect(l.state).toBeUndefined();
    expect(l.name).toEqual({ size: 11.5, lines: ["Basil", "Soil"] });
    expect(l.discRect.width).toBeGreaterThanOrEqual(14);
    expect(l.discRect.width).toBeLessThan(16);
  });

  it("makes a one row tile a strip with a glyph and no state", () => {
    const watch = layout("ultra211", 12, 1, { state: word("On") });
    expect(watch.mode).toBe("strip");
    expect(watch.state).toBeUndefined();
    expect(watch.drawsDisc).toBe(false);
    near(watch.glyphSize, 14.5 * 0.64);
    expect(watch.name.lines).toEqual(["Kitchen"]);
    const phone = layout("phone402", 12, 1, { state: word("On") });
    expect(phone.mode).toBe("strip");
    expect(phone.drawsDisc).toBe(false);
    near(phone.glyphSize, 19.833 * 0.58);
    const tiny = layout("ultra211", 1, 1);
    expect(tiny.mode).toBe("compact");
    expect(tiny.drawsDisc).toBe(false);
    near(tiny.glyphSize, 14.5 * 0.64);
  });

  it("makes a phone 3x2 compact", () => {
    const l = layout("phone402", 3, 2);
    expect(l.mode).toBe("compact");
    near(l.discRect.width, 51.667 - 20);
  });
});

describe("One Look larger text", () => {
  it("keeps a phone 6x4's state with a disc under its floor", () => {
    const scale = 23 / 17;
    const l = layout("phone402", 6, 4, { textScale: scale });
    expect(l.mode).toBe("stacked");
    expect(l.discRect.width).toBeLessThan(30);
    expect(l.discRect.width).toBeGreaterThanOrEqual(oneLookTinyDiscFloor("phone"));
    near(l.name.size, 15.5 * 23 / 17);
    near(l.state?.size, 21 * 23 / 17);
    expect(l.textScale).toBe(scale);
    near(oneLookLayoutMetrics(l, "phone").bigSize, 40 * 23 / 17);
    expect(layout("phone402", 6, 4).textScale).toBe(1);
  });
});

describe("One Look overflow", () => {
  const cases: [string, StateLine, OneLookAccessory, boolean][] = [
    ["Kitchen", percent("64"), "none", true],
    ["Upstairs Hallway Ceiling Motion Sensor", word("Not occupied", "Vacant"), "none", true],
    ["Nightstand", word("Unavailable", "Offline", true), "none", true],
    ["Aranet4 03A66 Carbon Dioxide", { kind: "number", figure: "735", unit: "ppm", unitSpaced: true }, "none", true],
    ["Music", word("Paused"), "playPause", true],
    ["My ecobee", { kind: "number", figure: "70°", tail: "68–77°" }, "fan", true],
    ["Driveway", NO_STATE, "live", true],
    ["Test Timer", { kind: "number", figure: "4:32", tail: "left", keepTail: true }, "none", false],
    ["", word("On"), "fan", true],
  ];

  for (const isCentred of [false, true]) {
    it(`never draws outside a tile on any size or screen (${isCentred ? "the bridge look" : "the disc"})`, () => {
      const slack = 0.5;
      for (const screen of SCREENS) {
        const device = deviceOf(screen);
        const m = oneLookMetrics(device);
        const fitter = new OneLookTextFitter(device, fake);
        const names = fitter.centredNames;
        for (let colSpan = 1; colSpan <= 12; colSpan++) {
          for (let rowSpan = 1; rowSpan <= 8; rowSpan++) {
            for (const [name, state, accessory, hasIcon] of cases) {
              const l = layout(screen, colSpan, rowSpan, { name, state, hasIcon, accessory, centred: isCentred });
              const w = l.size.width, h = l.size.height;
              const where = `${screen} ${colSpan}x${rowSpan} ${name}`;
              const inside = (r: OneLookRect) => minX(r) >= -slack && minY(r) >= -slack && maxX(r) <= w + slack && maxY(r) <= h + slack;
              const text = oneLookTextRect(l);
              if (l.discRect.width > 0) expect(inside(l.discRect), `disc ${where}`).toBe(true);
              if (l.accessoryRect !== undefined) expect(inside(l.accessoryRect), `accessory ${where}`).toBe(true);
              if (l.accessoryHitRect !== undefined) {
                expect(inside(l.accessoryHitRect), `hit ${where}`).toBe(true);
                expect(l.accessoryHitRect.width, `hit width ${where}`).toBeLessThanOrEqual(w / 2 + 0.001);
              }
              if (l.bigRect !== undefined) expect(inside(l.bigRect), `big ${where}`).toBe(true);
              if (isCentred) expect(l.drawsDisc, `bridge draws no disc ${where}`).toBe(false);
              if (l.mode === "centred") {
                expect(isCentred, `centred only with the bridge look ${where}`).toBe(true);
                expect(l.bigValue, `no big value ${where}`).toBeUndefined();
                if (l.name.lines.length > 0) {
                  expect(inside(text), `name box ${where}`).toBe(true);
                  for (const line of l.name.lines) expect(names.nameWidth(line, l.name.size), `name ${where}`).toBeLessThanOrEqual(l.textWidth + slack);
                  if (l.discRect.width > 0) expect(minY(text), `name under glyph ${where}`).toBeGreaterThanOrEqual(maxY(l.discRect) - slack);
                }
                if (l.state !== undefined && l.stateRect !== undefined) {
                  const box = l.stateRect;
                  expect(inside(box), `state box ${where}`).toBe(true);
                  expect(oneLookStateWidth(l.state, m, fake), `state ${where}`).toBeLessThanOrEqual(Math.abs(box.width) + slack);
                  if (l.discRect.width > 0) {
                    expect(oneLookRectsIntersect(box, insetBy(l.glyphInk ?? l.discRect, slack)), `state and glyph ${where}`).toBe(false);
                  }
                  if (l.accessoryRect !== undefined) expect(maxX(box), `state and accessory ${where}`).toBeLessThanOrEqual(minX(l.accessoryRect) + slack);
                }
                if (l.accessoryRect !== undefined && l.discRect.width > 0) {
                  expect(oneLookRectsIntersect(insetBy(l.accessoryRect, slack), l.glyphInk ?? l.discRect), `glyph and accessory ${where}`).toBe(false);
                }
              } else if (l.mode === "compact") {
                expect(l.name.lines.length === 0 && l.state === undefined, `compact text ${where}`).toBe(true);
              } else {
                const hasText = l.name.lines.length > 0 || l.state !== undefined;
                if (!hasText) continue;
                expect(inside(text), `text box ${where}`).toBe(true);
                expect(l.textWidth, `text room ${where}`).toBeGreaterThanOrEqual(3 * m.nameMin);
                for (const line of l.name.lines) expect(fitter.nameWidth(line, l.name.size), `name ${where}`).toBeLessThanOrEqual(l.textWidth + slack);
                if (l.name.lines.length > 0) expect(l.name.size, `name floor ${where}`).toBeGreaterThanOrEqual(m.nameMin - 0.001);
                if (l.state !== undefined) expect(oneLookStateWidth(l.state, m, fake), `state ${where}`).toBeLessThanOrEqual(l.textWidth + slack);
                if (l.discRect.width > 0) {
                  if (l.mode === "stacked") expect(minY(text), `text under disc ${where}`).toBeGreaterThanOrEqual(maxY(l.discRect) - slack);
                  else expect(minX(text), `text beside disc ${where}`).toBeGreaterThanOrEqual(maxX(l.discRect));
                }
                if (l.accessoryRect !== undefined && l.discRect.width > 0 && l.mode === "stacked") {
                  expect(maxX(l.discRect), `disc and accessory ${where}`).toBeLessThanOrEqual(minX(l.accessoryRect) + slack);
                }
                if (l.accessoryRect !== undefined && l.mode === "strip") {
                  expect(maxX(text), `text and accessory ${where}`).toBeLessThanOrEqual(minX(l.accessoryRect));
                }
              }
            }
          }
        }
      }
    });
  }
});

describe("One Look's bridge look", () => {
  it("centres a watch 6x4", () => {
    const l = layout("ultra211", 6, 4, { name: "Back Yard Motion", state: word("Clear"), centred: true });
    expect(l.mode).toBe("centred");
    expect(l.drawsDisc).toBe(false);
    near(midX(l.discRect), l.size.width / 2);
    expect(l.discRect.width).toBeGreaterThanOrEqual(oneLookCentredGlyphMin("watch"));
    expect(l.glyphSize).toBe(l.discRect.width);
    const box = l.stateRect!;
    expect([box.x, box.y]).toEqual([l.insetH, l.insetV]);
    expect(oneLookRectsIntersect(box, l.glyphInk ?? l.discRect)).toBe(false);
    expect(l.name.lines.length).toBe(1);
    near(l.textWidth, l.size.width - 2 * oneLookCentredNameInset("watch"));
    near(maxY(oneLookTextRect(l)), l.size.height - l.insetV);
    expect(minY(oneLookTextRect(l))).toBeGreaterThanOrEqual(maxY(l.discRect));
    expect(l.barRect).toBeUndefined();
  });

  it("keeps a light's bar room and raises its glyph beside the state", () => {
    const lit = layout("ultra211", 6, 4, { name: "Jesse Office Lights", state: percent("100"), centred: true, topBar: true, glyphAspect: 0.6 });
    expect(lit.mode).toBe("centred");
    const bar = lit.barRect!;
    expect(bar.y).toBe(oneLookBarTop("watch"));
    near(bar.width, lit.size.width - 2 * oneLookBarSide("watch"));
    const state = lit.stateRect!;
    expect(minY(state)).toBeGreaterThanOrEqual(maxY(bar));
    expect(minY(lit.discRect)).toBeLessThan(maxY(state));
    expect(minY(lit.discRect)).toBeGreaterThanOrEqual(maxY(bar));
    expect(oneLookRectsIntersect(state, lit.glyphInk)).toBe(false);
    const off = layout("ultra211", 6, 4, { name: "Jesse Office Lights", state: word("Off"), centred: true, topBar: true, glyphAspect: 0.6 });
    expect(off.discRect.width).toBeGreaterThanOrEqual(lit.discRect.width);
    expect(off.barRect).toEqual(lit.barRect);
  });

  it("keeps a centred name on one line", () => {
    const l = layout("ultra211", 6, 4, { name: "Upstairs Hallway Ceiling Motion Sensor", state: word("Clear"), centred: true });
    expect(l.mode).toBe("centred");
    expect(l.name.lines.length).toBe(1);
    expect(l.name.size).toBeGreaterThanOrEqual(oneLookCentredNameMin("watch") - 0.001);
  });

  it("keeps the old look's name size, with no row cap", () => {
    const l = layout("ultra211", 6, 4, { centred: true, style: { nameSize: 10 }, nameCap: 8 });
    near(l.name.size, 10);
    const long = layout("ultra211", 6, 4, { name: "Upstairs Hallway Ceiling Motion Sensor", centred: true, style: { nameSize: 10 } });
    expect(long.mode).toBe("centred");
    expect(long.name.lines.length).toBe(1);
    expect(long.name.size).toBeGreaterThanOrEqual(oneLookCentredNameMin("watch") - 0.001);
    expect(long.textWidth).toBeLessThanOrEqual(long.size.width);
  });

  it("grows the state with the tile's State Size", () => {
    const plain = layout("ultra211", 6, 4, { centred: true }).state!;
    const grown = layout("ultra211", 6, 4, { centred: true, style: { stateScale: 1.4 } }).state!;
    expect(grown.size).toBeGreaterThan(plain.size);
  });

  it("puts the glyph where the old look drew it", () => {
    const style = { iconSize: 30, iconOffset: -3 };
    const off = layout("ultra211", 6, 4, { centred: true, style, state: word("Off") });
    expect(off.mode).toBe("centred");
    near(midX(off.discRect), off.size.width / 2);
    near(midY(off.discRect), off.size.height / 2 - 3);
    const wide = layout("ultra211", 6, 4, { centred: true, style: { ...style, statePill: true }, state: percent("100") });
    expect(wide.mode).toBe("centred");
    near(midX(wide.discRect), midX(off.discRect));
    near(midY(wide.discRect), midY(off.discRect));
    expect(wide.glyphSize).toBeLessThanOrEqual(off.glyphSize);
    expect(oneLookRectsIntersect(wide.stateRect, wide.glyphInk)).toBe(false);
    expect(oneLookRectsIntersect(oneLookTextRect(wide), wide.glyphInk)).toBe(false);
  });

  it("draws people's photos one size whatever their state", () => {
    const photo = (w: string) => layout("ultra211", 6, 4, {
      name: "Chen", state: word(w), centred: true, glyphIsPhoto: true, style: { iconSize: 36, iconOffset: -3 },
    });
    const away = photo("Away"), home = photo("Home");
    expect([away.mode, home.mode]).toEqual(["centred", "centred"]);
    near(away.glyphSize, home.glyphSize);
    // Still one size when "Home" is the wider word: both clear it.
    const wideM: TextMeasurer = { width: (text, size) => (Array.from(text).length + Array.from(text.toLowerCase()).filter((c) => c === "m").length) * size * 0.55 };
    const widePhoto = (w: string) => resolveOneLookLayout(input("ultra211", 6, 4, {
      name: "Chen", state: word(w), centred: true, glyphIsPhoto: true, style: { iconSize: 36, iconOffset: -3 },
    }), wideM);
    near(widePhoto("Away").glyphSize, widePhoto("Home").glyphSize);
    expect(widePhoto("Home").glyphSize).toBeLessThan(home.glyphSize);
    // However wide "Home" is against "Away" (one can shrink beside the
    // photo while the other cannot), one photo size.
    for (const extra of [0.5, 1, 1.5, 2]) {
      const measurer: TextMeasurer = { width: (text, size) => (Array.from(text).length + extra * Array.from(text.toLowerCase()).filter((c) => c === "m").length) * size * 0.55 };
      for (const unitWide of [99, 105, 108]) {
        const at = (name: string, w: string) => resolveOneLookLayout({ ...input("ultra211", 6, 4, {
          name, state: word(w), centred: true, glyphIsPhoto: true, style: { iconSize: 36, iconOffset: -4 },
        }), size: { width: unitWide, height: unitWide * 0.62 } }, measurer);
        const chen = at("Chen", "Away"), jesse = at("jesse", "Home");
        near(chen.glyphSize, jesse.glyphSize);
      }
    }
    for (const l of [away, home]) {
      near(l.glyphInk!.width, l.discRect.width);
      expect(oneLookRectsIntersect(l.stateRect, l.glyphInk)).toBe(false);
      expect(oneLookRectsIntersect(oneLookTextRect(l), l.glyphInk)).toBe(false);
    }
  });

  it("pads a pill state in its box", () => {
    const plain = layout("ultra211", 6, 4, { centred: true }).stateRect!;
    const pill = layout("ultra211", 6, 4, { centred: true, style: { statePill: true } }).stateRect!;
    expect(pill.width).toBeGreaterThan(plain.width);
    expect(pill.height).toBeGreaterThan(plain.height);
  });

  it("grows a centred glyph with the room, to its cap", () => {
    const short = layout("ultra211", 6, 4, { centred: true });
    const tall = layout("ultra211", 6, 6, { centred: true });
    expect(tall.discRect.width).toBeGreaterThan(short.discRect.width);
    expect(tall.discRect.width).toBeLessThanOrEqual(oneLookCentredGlyphMax("watch"));
    expect(tall.discRect.width).toBeLessThanOrEqual(tall.size.width * ONE_LOOK_CENTRED_GLYPH_WIDTH_SHARE + 0.01);
  });

  it("keeps the accessory top right", () => {
    const l = layout("ultra211", 6, 4, { name: "Music", state: NO_STATE, accessory: "playPause", centred: true });
    expect(l.mode).toBe("centred");
    near(maxX(l.accessoryRect!), l.size.width - l.insetH);
    expect(oneLookRectsIntersect(l.accessoryRect, l.discRect)).toBe(false);
    expect(l.stateRect).toBeUndefined();
  });

  it("drops the big value", () => {
    const l = layout("phone402", 12, 4, { name: "Weather", state: word("Sunny"), big: { figure: "62°" }, centred: true });
    expect(l.mode).toBe("centred");
    expect(l.bigValue).toBeUndefined();
  });

  it("draws no disc on strips or tiny tiles", () => {
    const strip = layout("ultra211", 6, 2, { centred: true });
    expect(strip.mode).toBe("strip");
    expect(strip.drawsDisc).toBe(false);
    expect(strip.glyphSize).toBeGreaterThan(0);
    const tiny = layout("ultra211", 2, 2, { name: "", state: NO_STATE, centred: true });
    expect(tiny.drawsDisc).toBe(false);
    expect(tiny.glyphSize).toBeGreaterThan(0);
  });
});

describe("One Look's bridge look, as the Swift lays it out (derived)", () => {
  it("D1: an Ultra 6x4 motion sensor", () => {
    const l = layout("ultra211", 6, 4, { name: "Back Yard Motion", state: word("Clear"), centred: true });
    expect(l.mode).toBe("centred");
    near(l.insetH, 6.03, 0.0001);
    nearRect(l.discRect, 36.2093, 11.7643, 29.5814, 29.5814);
    nearRect(l.glyphInk, 38.28, 13.835, 25.44, 25.44);
    expect(l.name).toEqual({ size: 10.5, lines: ["Back Yard Motion"] });
    near(l.nameLineHeight, 12.39, 0.001);
    nearRect(oneLookTextRect(l), 3, 48.58, 96, 12.39);
    expect(l.state?.size).toBe(11);
    nearRect(l.stateRect, 6.03, 6.03, 30.25, 13.2);
    expect(l.barRect).toBeUndefined();
    expect(l.glyphAtOldPlace).toBe(false);
  });

  it("D2: an Ultra 6x4 light's glyph rises beside its state", () => {
    const l = layout("ultra211", 6, 4, { centred: true });
    nearRect(l.discRect, 31.065, 6.03, 39.87, 39.87);
    nearRect(l.glyphInk, 33.8559, 8.8209, 34.2882, 34.2882);
    expect(l.name.size).toBe(11.5);
    nearRect(oneLookTextRect(l), 3, 47.4, 96, 13.57);
    expect([l.state?.size, l.state?.unitSize]).toEqual([14, 10]);
    nearRect(l.stateRect, 6.03, 6.03, 20.9, 14);
  });

  it("D3: an Ultra 6x6 caps its glyph at 40", () => {
    const l = layout("ultra211", 6, 6, { centred: true });
    near(l.size.width, 102);
    near(l.size.height, 102);
    near(l.insetH, 7, 0.0001);
    nearRect(l.discRect, 31, 31.215, 40, 40);
    nearRect(oneLookTextRect(l), 3, 81.43, 96, 13.57);
    nearRect(l.stateRect, 7, 7, 20.9, 14);
  });

  it("D4: a phone 6x4 caps its glyph at 56", () => {
    const l = layout("phone402", 6, 4, { centred: true });
    near(l.insetH, 12.6867, 0.001);
    nearRect(l.discRect, 61.5, 17.5217, 56, 56);
    nearRect(l.glyphInk, 65.42, 21.4417, 48.16, 48.16);
    expect(l.name.size).toBe(15.5);
    near(l.nameLineHeight, 18.29, 0.001);
    nearRect(oneLookTextRect(l), 8, 84.3567, 163, 18.29);
    nearRect(l.stateRect, 12.6867, 12.6867, 30.723, 23.1);
  });

  it("D5: a long name shrinks to 9, then is cut", () => {
    const l = layout("ultra211", 6, 4, { name: "Upstairs Hallway Ceiling Motion Sensor", state: word("Clear"), centred: true });
    expect(l.name).toEqual({ size: 9, lines: ["Upstairs…Sensor"] });
    near(l.nameLineHeight, 10.62, 0.001);
    nearRect(oneLookTextRect(l), 3, 50.35, 96, 10.62);
    nearRect(l.discRect, 36.2093, 12.6493, 29.5814, 29.5814);
  });

  it("D6: an Assist tile draws no button", () => {
    const l = layout("ultra211", 6, 4, { name: "Assist", state: NO_STATE, centred: true });
    nearRect(l.discRect, 31.065, 6.03, 39.87, 39.87);
    expect(l.accessoryRect).toBeUndefined();
    expect(l.stateRect).toBeUndefined();
  });

  it("D7 and D8: a light with its bar's room, on and off", () => {
    const lit = layout("ultra211", 6, 4, { name: "Jesse Office Lights", state: percent("100"), centred: true, topBar: true, glyphAspect: 0.6 });
    nearRect(lit.barRect, 6, 4, 90, 3);
    nearRect(lit.stateRect, 6.03, 9.5, 28.6, 14);
    nearRect(lit.discRect, 31.325, 9.5, 39.35, 39.35);
    nearRect(lit.glyphInk, 40.8477, 12.2545, 20.3046, 33.841);
    expect(lit.name).toEqual({ size: 9, lines: ["Jesse…Lights"] });
    nearRect(oneLookTextRect(lit), 3, 50.35, 96, 10.62);
    const off = layout("ultra211", 6, 4, { name: "Jesse Office Lights", state: word("Off"), centred: true, topBar: true, glyphAspect: 0.6 });
    nearRect(off.discRect, 31.325, 9.5, 39.35, 39.35);
    nearRect(off.barRect, 6, 4, 90, 3);
    nearRect(off.stateRect, 6.03, 9.5, 18.15, 13.2);
  });

  it("D9: a phone media tile's play button", () => {
    const l = layout("phone402", 6, 4, { name: "Music", state: word("Paused"), accessory: "playPause", centred: true });
    nearRect(l.discRect, 61.5, 17.5217, 56, 56);
    nearRect(l.stateRect, 12.6867, 12.6867, 49.5, 18);
    nearRect(l.accessoryRect, 136.3133, 12.6867, 30, 30);
    nearRect(l.accessoryHitRect, 129.3133, 5.6867, 44, 44);
    nearRect(oneLookTextRect(l), 8, 84.3567, 163, 18.29);
  });

  it("D10 and D11: strips and tiny tiles draw a bare glyph", () => {
    const strip = layout("ultra211", 6, 2, { centred: true });
    expect(strip.mode).toBe("strip");
    expect(strip.insetH).toBe(4);
    nearRect(strip.discRect, 4, 6, 20, 20);
    expect(strip.drawsDisc).toBe(false);
    near(strip.glyphSize, 17, 0.0001);
    nearRect(oneLookTextRect(strip), 29, 2.61, 69, 26.78);
    near(strip.nameLineHeight, 13.34, 0.001);
    near(strip.stateLineHeight, 13.44, 0.001);
    const tiny = layout("ultra211", 2, 2, { name: "", state: NO_STATE, centred: true });
    expect(tiny.mode).toBe("strip");
    nearRect(tiny.discRect, 4, 6, 20, 20);
    expect(tiny.drawsDisc).toBe(false);
    near(tiny.glyphSize, 17, 0.0001);
  });

  it("D12: the old place's glyph at 30 pt, 3 up", () => {
    const l = layout("ultra211", 6, 4, { centred: true, state: word("Off"), style: { iconSize: 30, iconOffset: -3 } });
    expect(l.glyphAtOldPlace).toBe(true);
    nearRect(l.discRect, 29.1977, 8.6977, 43.6047, 43.6047);
    near(midX(l.discRect), 51);
    near(midY(l.discRect), 30.5);
    nearRect(l.glyphInk, 35.25, 14.75, 31.5, 31.5);
    expect(l.name.size).toBe(11.5);
    nearRect(oneLookTextRect(l), 3, 47.4, 96, 13.57);
    nearRect(l.stateRect, 6.03, 6.03, 18.15, 13.2);
  });

  it("D13: a pill number gives way to the old place's glyph", () => {
    const l = layout("ultra211", 6, 4, { centred: true, state: percent("100"), style: { iconSize: 30, iconOffset: -3, statePill: true } });
    near(l.state?.size, 10.5, 0.0001);
    near(l.state?.unitSize, 7.5, 0.0001);
    expect(l.state?.lineHeight).toBe(14);
    expect(l.stateLineHeight).toBe(16);
    nearRect(l.stateRect, 6.03, 6.03, 27.45, 16);
    nearRect(l.discRect, 29.1977, 8.6977, 43.6047, 43.6047);
  });

  it("D14: the old look's name size ignores the row cap", () => {
    const l = layout("ultra211", 6, 4, { centred: true, style: { nameSize: 10 }, nameCap: 8 });
    expect(l.name).toEqual({ size: 10, lines: ["Kitchen"] });
    near(l.nameLineHeight, 11.8, 0.0001);
    nearRect(oneLookTextRect(l), 3, 49.17, 96, 11.8);
    expect(l.glyphAtOldPlace).toBe(false);
    nearRect(l.discRect, 31, 6.85, 40, 40);
  });

  it("D15: a person's photo", () => {
    for (const w of ["Away", "Home"]) {
      const l = layout("ultra211", 6, 4, { name: "Chen", state: word(w), centred: true, glyphIsPhoto: true, style: { iconSize: 36, iconOffset: -3 } });
      nearRect(l.discRect, 35.1, 14.6, 31.8, 31.8);
      nearRect(l.glyphInk, 35.1, 14.6, 31.8, 31.8);
      if (w === "Away") nearRect(l.stateRect, 6.03, 6.03, 24.2, 13.2);
    }
  });

  it("D16: an Ultra light as the watch draws it", () => {
    const l = layout("ultra211", 6, 4, {
      name: "Desk Lamp", state: percent("80"), centred: true, topBar: true, glyphExtent: 1.3, glyphAspect: 0.7,
      style: { nameSize: 10, iconSize: 36, iconOffset: -3 },
    });
    nearRect(l.barRect, 6, 4, 90, 3);
    nearRect(l.discRect, 26.5399, 6.0399, 48.9203, 48.9203);
    nearRect(l.glyphInk, 38.631, 12.83, 24.738, 35.34);
    expect(l.name.size).toBe(10);
    nearRect(oneLookTextRect(l), 3, 49.17, 96, 11.8);
    nearRect(l.stateRect, 6.03, 9.5, 20.9, 14);
  });

  it("D17: a phone light as the iPhone draws it", () => {
    const l = layout("phone402", 6, 4, {
      centred: true, topBar: true, glyphExtent: 1.25, glyphAspect: 0.7,
      style: { nameSize: 15, iconSize: 52.64, iconOffset: -4 },
    });
    nearRect(l.barRect, 12, 8, 155, 4);
    nearRect(l.discRect, 51.2442, 15.4109, 76.5116, 76.5116);
    nearRect(l.glyphInk, 70.1548, 26.0307, 38.6904, 55.272);
    expect(l.name.size).toBe(15);
    near(l.nameLineHeight, 17.7, 0.0001);
    nearRect(oneLookTextRect(l), 8, 84.9467, 163, 17.7);
    nearRect(l.stateRect, 12.6867, 17, 30.723, 23.1);
  });

  it("D18: a phone media tile as the iPhone draws it", () => {
    const l = layout("phone402", 6, 4, {
      name: "Music", state: word("Paused"), accessory: "playPause", centred: true, glyphExtent: 1.25, glyphAspect: 1,
      style: { nameSize: 15, iconSize: 52.64, iconOffset: -4 },
    });
    nearRect(l.discRect, 51.2442, 15.4109, 76.5116, 76.5116);
    nearRect(l.glyphInk, 61.864, 26.0307, 55.272, 55.272);
    near(l.state?.size, 14.15, 0.0001);
    expect(l.state?.lineHeight).toBe(18);
    nearRect(l.stateRect, 12.6867, 12.6867, 46.695, 18);
    nearRect(l.accessoryRect, 136.3133, 12.6867, 30, 30);
    nearRect(l.accessoryHitRect, 129.3133, 5.6867, 44, 44);
  });

  it("D19 and D20: a narrow tile falls back to the stacked layout with a bare glyph", () => {
    const set = layout("ultra211", 3, 3, { name: "Basil Soil", state: percent("41"), centred: true, style: { nameSize: 7, iconSize: 20, iconOffset: -2 } });
    expect(set.mode).toBe("stacked");
    expect(set.insetH).toBe(4.5);
    nearRect(set.discRect, 4.5, 4.5, 17.4, 17.4);
    expect(set.drawsDisc).toBe(false);
    near(set.glyphSize, 14.79, 0.001);
    expect(set.state).toBeUndefined();
    // The narrow floor is 10 whatever the tile's own name size.
    expect(set.name).toEqual({ size: ONE_LOOK_NARROW_MIN, lines: ["Basil", "Soil"] });
    near(set.nameLineHeight, 10.8, 0.0001);
    nearRect(oneLookTextRect(set), 4.5, 23.4, 40.5, 21.6);
    const plain = layout("ultra211", 3, 3, { name: "Basil Soil", state: percent("41"), centred: true });
    expect(plain.mode).toBe("stacked");
    nearRect(plain.discRect, 4.5, 4.5, 14.16, 14.16);
    expect(plain.drawsDisc).toBe(false);
    near(plain.glyphSize, 12.036, 0.001);
    expect(plain.state).toBeUndefined();
    expect(plain.name).toEqual({ size: 11.5, lines: ["Basil", "Soil"] });
    nearRect(oneLookTextRect(plain), 4.5, 20.16, 40.5, 24.84);
  });
});

// Row name caps, on the app's mock pages

interface MockTile {
  name: string; cs: number; r: number; rs: number;
  state?: StateLine; acc?: OneLookAccessory; chart?: boolean; big?: OneLookBigValue;
}

const pageA: MockTile[] = [
  { name: "Back Yard Motion", cs: 12, r: 1, rs: 4, state: word("Clear · 5m ago", "Clear") },
  { name: "Chens iPhone", cs: 6, r: 5, rs: 2, state: percent("15") },
  { name: "Fireplace Occupancy", cs: 6, r: 5, rs: 3, state: word("Not occupied", "Vacant") },
  { name: "Aranet4 03A66 Humidity", cs: 6, r: 7, rs: 6, state: percent("32") },
  { name: "Eight Sleep", cs: 3, r: 8, rs: 5, state: { kind: "number", figure: "71", unit: "°F" } },
  { name: "Speak", cs: 3, r: 8, rs: 5 },
  { name: "Point Control", cs: 6, r: 13, rs: 4 },
  { name: "Assist", cs: 6, r: 13, rs: 4 },
];

const pageB: MockTile[] = [
  { name: "My ecobee", cs: 6, r: 1, rs: 4, state: { kind: "number", figure: "70°", tail: "68–77°" }, acc: "fan" },
  { name: "Music", cs: 6, r: 1, rs: 4, state: word("Paused"), acc: "playPause" },
  { name: "Office Red", cs: 6, r: 5, rs: 4, state: word("Ran 2m ago") },
  { name: "Office Daylight Scenes", cs: 6, r: 5, rs: 4 },
  { name: "Test Timer", cs: 6, r: 9, rs: 4 },
  { name: "Aranet4 03A66 Battery", cs: 6, r: 9, rs: 4, state: percent("23") },
  { name: "Aranet4 03A66 Carbon Dioxide", cs: 12, r: 13, rs: 6, state: { kind: "number", figure: "735", unit: "ppm", unitSpaced: true }, chart: true },
  { name: "Home", cs: 12, r: 19, rs: 4, state: word("Partly cloudy"), big: { figure: "62°", sub: "H 68° L 51°" } },
];

const pageC: MockTile[] = ([
  ["Jesse Office Lights", true, 100], ["Smart Plug Dimmer", true, 100], ["House", true, 60],
  ["All bedroom lights", false, 0], ["All Living Room", false, 0], ["All Kitchen", false, 0],
  ["Hallway", false, 0], ["Porch", false, 0],
] as const).map(([name, on, level], i) => ({
  name, cs: 6, r: 1 + Math.floor(i / 2) * 4, rs: 4, state: on ? percent(String(level)) : word("Off"),
}));

const edges: MockTile[] = [
  { name: "Desk Lamp", cs: 3, r: 1, rs: 5, state: percent("80") },
  { name: "Nightstand", cs: 3, r: 1, rs: 5, state: word("Off") },
  { name: "Chens iPhone", cs: 6, r: 1, rs: 2, state: percent("15") },
  { name: "Fireplace Occupancy", cs: 6, r: 3, rs: 3, state: word("Not occupied", "Vacant") },
  { name: "Front Door", cs: 4, r: 6, rs: 4, state: word("Locked") },
  { name: "Back Door", cs: 4, r: 6, rs: 4, state: word("Unlocked") },
  { name: "Garage", cs: 4, r: 6, rs: 4, state: word("Closed") },
  { name: "Driveway", cs: 6, r: 10, rs: 4, state: word("Motion 2 min ago", "Motion · 2m"), acc: "live" },
  { name: "Upstairs Hallway Ceiling Motion Sensor", cs: 6, r: 10, rs: 4, state: word("Clear") },
  { name: "Kitchen Island", cs: 4, r: 14, rs: 4, state: percent("64") },
  { name: "Kitchen Island", cs: 4, r: 14, rs: 4, state: word("Off") },
  { name: "Garage Light", cs: 4, r: 14, rs: 4, state: word("Unavailable", "Offline", true) },
  { name: "Reading Lamp", cs: 3, r: 18, rs: 5, state: percent("100") },
  { name: "Basil Soil", cs: 3, r: 18, rs: 5, state: percent("41") },
  { name: "Good Night", cs: 3, r: 18, rs: 5, state: word("Ran 2m ago", "2m ago") },
  { name: "Porch", cs: 3, r: 18, rs: 5, state: percent("60") },
];

function probes(tiles: readonly MockTile[], screen: Screen, centred = false) {
  return tiles.map((t) => ({
    key: oneLookRowKey(t.r, t.rs),
    input: input(screen, t.cs, t.rs, { name: t.name, state: t.state ?? NO_STATE, accessory: t.acc, isChart: t.chart, big: t.big, centred }),
  }));
}

describe("One Look row names", () => {
  it("follow a row's narrowest name down", () => {
    const row = probes(edges.slice(0, 2), "phone402");
    const caps = oneLookRowCaps(row, fake);
    const key = oneLookRowKey(1, 5);
    near(caps.get(key), 11.15);
    for (const probe of row) near(resolveOneLookLayout({ ...probe.input, nameCap: caps.get(key) }, fake).name.size, 11.15);
    expect(resolveOneLookLayout(row[0]!.input, fake).name.size).toBe(15.5);
  });

  it("settle on every mock page", () => {
    for (const [page, tiles] of [["A", pageA], ["B", pageB], ["C", pageC], ["edges", edges]] as const) {
      for (const screen of ["phone402", "ultra211"] as const) {
        const all = probes(tiles, screen);
        const caps = oneLookRowCaps(all, fake);
        const sizes = new Map<string, number[]>();
        for (const probe of all) {
          const size = oneLookRowNameSize(resolveOneLookLayout({ ...probe.input, nameCap: caps.get(probe.key) }, fake));
          if (size !== undefined) sizes.set(probe.key, [...(sizes.get(probe.key) ?? []), size]);
        }
        for (const [key, row] of sizes) {
          const cap = caps.get(key);
          expect(cap, `page ${page} ${screen} row ${key}`).toBeDefined();
          for (const size of row) near(size, cap!);
          expect(cap!).toBeLessThanOrEqual(oneLookMetrics(deviceOf(screen)).nameSize);
        }
      }
    }
  });

  it("are keyed by their top and height", () => {
    const caps = oneLookRowCaps(probes([
      { name: "Upstairs Hallway Ceiling Motion Sensor", cs: 6, r: 1, rs: 2, state: word("Clear") },
      { name: "Porch", cs: 6, r: 1, rs: 4, state: word("Off") },
    ], "phone402"), fake);
    expect(caps.size).toBe(2);
    expect(caps.get(oneLookRowKey(1, 4))).toBe(15.5);
    expect(caps.get(oneLookRowKey(1, 2)) ?? 99).toBeLessThan(15.5);
  });

  it("settle at the centred floor on an Ultra row (D21)", () => {
    const caps = oneLookRowCaps(probes([
      { name: "Kitchen", cs: 6, r: 0, rs: 4, state: percent("100") },
      { name: "Upstairs Hallway Lights", cs: 6, r: 0, rs: 4, state: percent("100") },
    ], "ultra211", true), fake);
    near(caps.get(oneLookRowKey(0, 4)), 9, 0.0001);
  });
});

describe("One Look's panel measurer", () => {
  it("falls back to the app's estimate without a canvas", () => {
    const m = oneLookMeasurer("watch");
    expect(m.width("Kitchen", 10, "semibold", false, -0.01)).toBeCloseTo(oneLookEstimatedWidth("Kitchen", 10), 10);
    expect(oneLookEstimatedWidth("Kitchen", 10)).toBeCloseTo(7 * 10 * 0.55, 10);
    expect(m.width("", 21, "bold", true, -0.01)).toBe(0);
    // And the ladders run on it.
    expect(resolveOneLookLayout(input("phone402", 6, 4), oneLookMeasurer("phone")).mode).toBe("stacked");
    expect(resolveOneLookLayout(input("ultra211", 6, 2, { name: "Chens iPhone", state: percent("15") }), oneLookMeasurer("watch")).mode).toBe("strip");
    expect(resolveOneLookLayout(input("ultra211", 2, 2, { state: word("On") }), oneLookMeasurer("watch")).mode).toBe("compact");
  });

  it("sizes a symbol's image from its glyph and the image's margin", () => {
    const boxes: Record<string, string> = { lightbulb: "0 0 13.65 23.68", house: "0 0 24.21 20.94" };
    const icons: IconProvider = {
      render: (symbol) => (boxes[symbol] === undefined ? undefined : svg`<svg viewBox=${boxes[symbol]}></svg>`),
      available: () => true,
      names: () => Object.keys(boxes),
    };
    const m = oneLookMeasurer("watch", { icons });
    // The app's light bulb: about 1.3 long, 0.7 wide over tall.
    near(m.glyphExtent!("lightbulb"), 23.68 / 22 + ONE_LOOK_SYMBOL_MARGIN_H, 0.0001);
    near(m.glyphExtent!("lightbulb"), 1.31, 0.02);
    near(m.glyphAspect!("lightbulb"), 0.7, 0.04);
    near(m.glyphAspect!("house"), (24.21 / 22 + ONE_LOOK_SYMBOL_MARGIN_W) / (20.94 / 22 + ONE_LOOK_SYMBOL_MARGIN_H), 0.0001);
    // Unknown, empty, or no symbols at all: the app's defaults.
    expect(m.glyphExtent!("no.such.symbol")).toBe(1.25);
    expect(m.glyphAspect!("no.such.symbol")).toBe(1);
    expect(oneLookMeasurer("watch").glyphExtent!("lightbulb")).toBe(1.25);
    expect(oneLookSymbolImage(icons, "")).toBeUndefined();
    // An old name the provider keeps under another.
    expect(oneLookSymbolImage(icons, "bulb", (n) => (n === "bulb" ? "lightbulb" : n))?.inkHeight).toBeCloseTo(23.68 / 22, 10);
  });

  it("measures the watch in the preview's own fonts", () => {
    expect(ONE_LOOK_FONT_FAMILIES.watch.standard).toBe(WATCH_FONT_FAMILY);
    expect(ONE_LOOK_FONT_FAMILIES.watch.rounded).toBe(WATCH_ROUNDED_FAMILY);
  });
});
