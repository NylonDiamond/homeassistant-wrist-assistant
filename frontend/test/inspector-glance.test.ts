// Four inspector details that are about reading and pressing, not about the
// document: a simple Rules state read as one line, the Position card's align
// buttons, opacity typed as a percent, and the values bar under the face
// saying Live or Testing and never both.
//
// The markup is flattened to text, as the other editor tests do, so these pin
// what is said and what is drawn rather than how it is styled. Nothing here
// may change what a document stores, which the last block checks too.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  type CustomComplicationConfig,
  type Element as CElement,
  type NamedValue,
  type Value,
  encodeConfig,
  literal,
  newConfig,
  newElement,
} from "../src/model.js";
import {
  type EditorHost,
  alignButtons,
  alignedFrame,
  fractionToPercent,
  layerEditor,
  percentSliderField,
  percentToFraction,
  placementCard,
  statesAddAction,
  statesEditor,
  testedUnit,
} from "../src/editors.js";
import { alignFrame, isAligned } from "../src/interact.js";
import { buildStatesRule, glanceTest } from "../src/states.js";
import { testingWords } from "../src/test-controls.js";
import { canvasStyles, inspectorStyles } from "../src/editor-chrome.js";
import type { HassLike } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import { SymbolBrowser } from "../src/symbols.js";

const noIcons: IconProvider = { render: () => undefined, available: () => false, names: () => undefined };

function flatten(node: unknown): string {
  if (node === undefined || node === null || node === nothing) return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  if (typeof node === "function") return "";
  return String(node);
}

/** Every listener in a template, in document order. */
function handlers(node: unknown, out: ((e: unknown) => void)[] = []): ((e: unknown) => void)[] {
  if (Array.isArray(node)) for (const n of node) handlers(n, out);
  else if (typeof node === "function") out.push(node as (e: unknown) => void);
  else if (node && typeof node === "object" && "values" in (node as Record<string, unknown>)) {
    for (const v of (node as { values: unknown[] }).values) handlers(v, out);
  }
  return out;
}

const SENSOR = "sensor.test_temperature";
const hass = {
  states: {
    [SENSOR]: {
      entity_id: SENSOR, state: "71.96", last_changed: "", last_updated: "",
      attributes: { friendly_name: "Test temperature", unit_of_measurement: "°F" },
    },
  },
} as unknown as HassLike;

function host(cfg: CustomComplicationConfig, over: Partial<EditorHost> = {}): EditorHost {
  const base = {
    hass,
    config: cfg,
    icons: noIcons,
    symbols: new SymbolBrowser(() => {}),
    pages: [],
    update: (m: (c: CustomComplicationConfig) => void) => m(cfg),
    endGesture: () => {},
    resolve: () => undefined,
    canCountDown: () => false,
    historySeries: () => undefined,
    evaluateTest: () => false,
    liveBranch: () => "none",
    forced: new Map(),
    setForced: () => {},
    activeFamily: "rectangular" as const,
    setActiveFamily: () => {},
    addInlineText: () => {},
    tapAreaShown: false,
    showTapArea: () => {},
    openSections: new Set(["content", "look", "look:more", "states", "placement"]),
    toggleSection: () => {},
    helpSections: new Set<string>(),
    toggleHelp: () => {},
    selectLayer: () => {},
    peekLayer: () => {},
    selectValue: () => {},
    beginGesture: () => {},
    copyPosition: () => {},
    setRowEdit: () => {},
  };
  return { ...base, ...over } as unknown as EditorHost;
}

function withLayer<K extends CElement["kind"]>(kind: K, tweak: (el: Extract<CElement, { kind: K }>) => void = () => {}): {
  cfg: CustomComplicationConfig;
  el: Extract<CElement, { kind: K }>;
} {
  const cfg = newConfig("Glance", 0);
  const el = newElement(kind) as Extract<CElement, { kind: K }>;
  el.payload.frame = { x: 0.1, y: 0.2, width: 0.4, height: 0.3, rotationDegrees: 0 };
  tweak(el);
  cfg.elements.push(el);
  cfg.perFamily.rectangular!.placements[el.payload.id] = { frame: { ...el.payload.frame }, isHidden: false };
  return { cfg, el };
}

const sensor: Value = { kind: { kind: "entityState", entityId: SENSOR, displayName: "", domain: "sensor" } };

/** An icon layer whose color follows the temperature: orange above 76, blue
 * below 66, and no Otherwise row. */
function thermometer(otherwise?: boolean) {
  const { cfg, el } = withLayer("icon", (e) => { e.payload.colorSlot.baseColorHex = "#63D1FF"; });
  el.payload.rules = [buildStatesRule(sensor, [
    { comparison: { kind: "greaterThan", value: literal("76") }, changes: [{ kind: "setColor", value: literal("#FF9F0A") }] },
    { comparison: { kind: "lessThan", value: literal("66") }, changes: [{ kind: "setColor", value: literal("#0A84FF") }] },
  ], otherwise ? [{ kind: "hide" }] : undefined)];
  return { cfg, el };
}

function rulesOf(cfg: CustomComplicationConfig, id: string) {
  return cfg.elements.find((e) => e.payload.id === id)?.payload.rules;
}

function drawStates(h: EditorHost, el: CElement): string {
  return flatten(statesEditor(h, el.payload.rules, el.kind, (c) => rulesOf(c, el.payload.id), `rules-${el.payload.id}`, sensor, undefined,
    { ownColor: (el.payload as { colorSlot?: { baseColorHex?: string } }).colorSlot?.baseColorHex }));
}

describe("a simple Rules state at a glance", () => {
  it("writes a test as a sign, a number and its unit", () => {
    const words = (v: Value) => (v.kind.kind === "literal" ? v.kind.value : "?");
    expect(glanceTest({ kind: "greaterThan", value: literal("76") }, words, "°F")).toBe("> 76 °F");
    expect(glanceTest({ kind: "lessThan", value: literal("66") }, words, "°F")).toBe("< 66 °F");
    expect(glanceTest({ kind: "greaterOrEqual", value: literal("5") }, words)).toBe("≥ 5");
    expect(glanceTest({ kind: "lessOrEqual", value: literal("5") }, words)).toBe("≤ 5");
    expect(glanceTest({ kind: "between", value: literal("20"), upper: literal("30") }, words, "%")).toBe("20 to 30 %");
    // Words never take a unit.
    expect(glanceTest({ kind: "equals", value: literal("heat") }, words, "°F")).toBe("is heat");
    expect(glanceTest({ kind: "notEquals", value: literal("heat") }, words)).toBe("is not heat");
    expect(glanceTest({ kind: "isOn" }, words, "°F")).toBe("is on");
  });

  it("finds the unit on the entity, or on the entity a shared value reads", () => {
    const { cfg } = withLayer("icon");
    const shared: NamedValue = { id: "AAAA", name: "State", value: sensor };
    cfg.values.push(shared);
    const h = host(cfg);
    expect(testedUnit(h, sensor)).toBe("°F");
    expect(testedUnit(h, { kind: { kind: "named", id: "AAAA" } })).toBe("°F");
    expect(testedUnit(h, literal("5"))).toBe("");
    expect(testedUnit(h, undefined)).toBe("");
  });

  it("reads each state as one line: what it looks at, the test, an arrow, and the color", () => {
    const { cfg, el } = thermometer();
    const markup = drawStates(host(cfg), el);
    expect(markup).toContain("Test temperature");
    expect(markup).toContain("> 76 °F");
    expect(markup).toContain("< 66 °F");
    expect(markup).toContain("→");
    expect(markup).toContain("background:#FF9F0A");
    expect(markup).toContain("Orange");
    expect(markup).toContain("Blue");
    // No table and no When and Then headings.
    expect(markup).not.toContain("<table");
    expect(markup).not.toContain("<th");
    // The line's hint reads the number plainly, not in quotes.
    expect(markup).toContain("title=greater than 76. Click to change it");
  });

  it("ends with a quiet Otherwise line in the layer's own color while there is no Otherwise row", () => {
    const { cfg, el } = thermometer();
    const markup = drawStates(host(cfg), el);
    expect(markup).toContain("state-line fallback");
    expect(markup).toMatch(/Otherwise[\s\S]*→[\s\S]*background:#63D1FF[\s\S]*Original/);
    // An Otherwise row of its own takes the place of the quiet line.
    const withElse = thermometer(true);
    const other = drawStates(host(withElse.cfg), withElse.el);
    expect(other).not.toContain("fallback");
    expect(other).not.toContain("Original");
    expect(other).toContain("Hidden");
    expect(other).toContain("Add a state");
  });

  it("keeps the editing controls behind the line, and shows them while the state is open", () => {
    const { cfg, el } = thermometer();
    const shut = drawStates(host(cfg), el);
    expect(shut).toContain("aria-expanded=false");
    expect(shut).not.toContain("when-op");
    expect(shut).not.toContain("Delete this state");
    const rule = el.payload.rules[0]!;
    const caseId = rule.cases[0]!.id;
    const open = drawStates(host(cfg, { forced: new Map([[rule.id, { caseId }]]) }), el);
    expect(open).toContain("aria-expanded=true");
    // Everything a row had: the comparison, its number, the change chips,
    // + Change, and move and delete.
    expect(open).toContain("when-op");
    expect(open).toContain("cellin");
    expect(open).toContain("cell filled");
    expect(open).toContain("add-change");
    expect(open).toContain("Move up");
    expect(open).toContain("Move down");
    expect(open).toContain("Delete this state");
    // Only the open one.
    expect(open.match(/when-op/g)?.length).toBe(1);
  });

  it("opens the state it adds", () => {
    const { cfg, el } = thermometer();
    const held: [string, unknown][] = [];
    const h = host(cfg, { setForced: (ruleId, branch) => { held.push([ruleId, branch]); } });
    const { action } = statesAddAction(h, el.payload.rules, "icon", (c) => rulesOf(c, el.payload.id), `rules-${el.payload.id}`, sensor);
    action!.run();
    const rule = el.payload.rules[0]!;
    expect(rule.cases).toHaveLength(3);
    expect(held).toEqual([[rule.id, { caseId: rule.cases[2]!.id }]]);
  });

  it("keeps the empty text and Add a state while there are no states", () => {
    const { cfg, el } = withLayer("icon");
    const markup = drawStates(host(cfg), el);
    expect(markup).toContain("states-empty");
    expect(markup).toContain("Add a state");
    expect(markup).not.toContain("state-line");
  });

  it("says an opacity change in percent", () => {
    const { cfg, el } = withLayer("icon");
    el.payload.rules = [buildStatesRule(sensor, [
      { comparison: { kind: "greaterThan", value: literal("76") }, changes: [{ kind: "setOpacity", number: 0.5 }] },
    ])];
    expect(drawStates(host(cfg), el)).toContain("50%");
  });
});

describe("the align buttons", () => {
  const f = { x: 0.1, y: 0.2, width: 0.4, height: 0.3, rotationDegrees: 15 };

  it("puts a frame flush to each edge and keeps its size and turn", () => {
    expect(alignFrame(f, "left")).toEqual({ ...f, x: 0 });
    expect(alignFrame(f, "right")).toEqual({ ...f, x: 0.6 });
    expect(alignFrame(f, "top")).toEqual({ ...f, y: 0 });
    expect(alignFrame(f, "bottom")).toEqual({ ...f, y: 0.7 });
    expect(isAligned({ ...f, x: 0 }, "left")).toBe(true);
    expect(isAligned(f, "left")).toBe(false);
    // A layer wider than the face lines its right side up and stays on it.
    expect(alignFrame({ ...f, width: 1.2 }, "right").x).toBe(-0.2);
  });

  it("offers across, up and down, and the middle, each saying what moves and against what", () => {
    const groups = alignButtons("both", "complication");
    expect(groups.map((g) => g.map((b) => b.id))).toEqual([
      ["left", "center-across", "right"],
      ["top", "center-down", "bottom"],
      ["center-both"],
    ]);
    for (const b of groups.flat()) {
      expect(b.ariaLabel).toMatch(/the complication$/);
      expect(b.hint).toMatch(/^[A-Z][a-z ]+: move this layer to the .* of the complication/);
    }
    expect(groups[0]![0]!.hint).toBe("Align left: move this layer to the left edge of the complication");
    expect(alignedFrame(f, groups[1]![1]!.move)).toEqual({ ...f, y: 0.35 });
  });

  it("keeps only the across group for a layer whose height a chart settles, and names the row for a row layer", () => {
    expect(alignButtons("across", "complication").flat().map((b) => b.id)).toEqual(["left", "center-across", "right"]);
    expect(alignButtons("both", "row").flat().every((b) => b.hint.endsWith("of the row") || b.hint.includes("of the row,"))).toBe(true);
  });

  it("draws one row of glyph buttons under an Align line, with no Line up words", () => {
    const { cfg, el } = withLayer("icon");
    const markup = flatten(placementCard(host(cfg), el, "rectangular"));
    expect(markup).toContain("Align");
    expect(markup).toContain("to the complication");
    expect(markup.match(/class="align"/g)?.length).toBe(7);
    expect(markup.match(/align-sep/g)?.length).toBe(2);
    expect(markup).toContain("Align left to the complication");
    expect(markup).not.toContain("Line up");
    expect(markup).not.toContain("Center up and down</button>");
    // Copy and paste stay.
    expect(markup).toContain("Copy position");
    expect(markup).toContain("Paste position");
  });

  it("styles the row in the inspector sheet", () => {
    for (const s of [".align-row", "button.align", ".align-sep", ".align-head"]) expect(inspectorStyles.cssText).toContain(s);
  });
});

describe("opacity as a percent", () => {
  it("shows a stored fraction as a percent and writes a percent back as a fraction", () => {
    expect(fractionToPercent(1)).toBe(100);
    expect(fractionToPercent(0.35)).toBe(35);
    expect(fractionToPercent(0.333)).toBe(33.3);
    expect(percentToFraction(35)).toBe(0.35);
    expect(percentToFraction(33.3)).toBe(0.333);
    expect(percentToFraction(100)).toBe(1);
  });

  it("draws 100 with a % in the box and stores 0.5 for 50", () => {
    const got: number[] = [];
    const field = percentSliderField("Opacity", 1, (v) => got.push(v), { step: 0.05, def: 1 });
    const markup = flatten(field);
    expect(markup).toContain(`class="unit" aria-hidden="true">%<`);
    expect(markup).toMatch(/type="range" min=0 max=100 step=5/);
    for (const h of handlers(field)) {
      try { h({ target: { value: "50" }, currentTarget: { value: "50" } }); } catch { /* a handler that wants a real element */ }
    }
    expect(got).toContain(0.5);
    expect(got.every((v) => v >= 0 && v <= 1)).toBe(true);
  });

  it("is the Opacity row of a layer's Look card", () => {
    const { cfg, el } = withLayer("icon", (e) => { e.payload.opacity = 0.4; });
    const markup = flatten(layerEditor(host(cfg), el, "rectangular"));
    expect(markup).toMatch(/aria-label=Opacity[\s\S]*?\.value=40|value=40/);
  });
});

describe("the values bar head", () => {
  it("is Live with nothing tried, and has nothing to reset", () => {
    expect(testingWords([], "watch")).toEqual({ mode: "live", heading: "Live" });
  });

  it("names the one value tried and what the watch still shows", () => {
    expect(testingWords([{ shown: "80 °F", live: "71.96 °F" }], "watch")).toEqual({
      mode: "testing", heading: "Testing: 80 °F", note: "The watch still shows the live value, 71.96 °F",
    });
    expect(testingWords([{ shown: "90", live: "66", shared: true }], "iPhone").note).toBe("The iPhone still shows the saved value, 66");
  });

  it("counts several values and quotes none", () => {
    const words = testingWords([{ shown: "80 °F", live: "71.96 °F" }, { shown: "on", live: "off" }], "watch");
    expect(words.heading).toBe("Testing 2 values");
    expect(words.note).toBe("The watch still shows the live values");
  });

  it("says nothing about a device for a design on none", () => {
    expect(testingWords([{ shown: "80 °F", live: "71.96 °F" }], undefined).note).toBe("The live value is 71.96 °F");
  });

  it("styles the note, the amber testing head and the amber slider", () => {
    const css = canvasStyles.cssText;
    expect(css).toContain(".vb-note");
    expect(css).toContain(".values-bar.testing .vb-state { color: var(--wa-testing); }");
    expect(css).toContain(".vchip.vpill.testing .test-ctl input[type=range] { --wa-range-fill: var(--wa-testing); }");
    expect(css).toContain(".vchip.vpill.testing button.val { color: var(--wa-testing); }");
  });
});

describe("what a document stores", () => {
  it("does not change when a state is drawn shut or open", () => {
    const { cfg, el } = thermometer();
    const before = JSON.stringify(encodeConfig(cfg));
    drawStates(host(cfg), el);
    const rule = el.payload.rules[0]!;
    drawStates(host(cfg, { forced: new Map([[rule.id, { caseId: rule.cases[0]!.id }]]) }), el);
    flatten(placementCard(host(cfg), el, "rectangular"));
    expect(JSON.stringify(encodeConfig(cfg))).toBe(before);
  });
});
