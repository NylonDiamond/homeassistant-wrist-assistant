// The inspector's layout: which cards a new selection opens, what a folded
// card says in its header, the More line in a Look card, and the Tap card at
// the top of the shape's own cards.
//
// The markup is flattened to text, as the other editor tests do, so these pin
// what is said and what is drawn rather than how the rows are styled.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  type CustomComplicationConfig,
  type Element as CElement,
  newConfig,
  newElement,
} from "../src/model.js";
import {
  type EditorHost,
  ALL_SECTIONS,
  DEFAULT_SECTIONS,
  collapsedSections,
  defaultOpenSections,
  familyEditor,
  layerEditor,
  moreIsOpen,
  moreThanDefaultOpen,
  positionSummary,
  statesAddAction,
  statesCardSummary,
  tapSummary,
} from "../src/editors.js";
import type { HassLike } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import { SymbolBrowser } from "../src/symbols.js";
import { buildStatesRule } from "../src/states.js";
import { footerStatus } from "../src/panel.js";

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

function host(cfg: CustomComplicationConfig, over: Partial<EditorHost> = {}): EditorHost {
  const base = {
    hass: { states: {} } as HassLike,
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
    openSections: defaultOpenSections(),
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

/** A document on the wide face holding one layer of `kind`. */
function withLayer<K extends CElement["kind"]>(kind: K, tweak: (el: Extract<CElement, { kind: K }>) => void = () => {}): {
  cfg: CustomComplicationConfig;
  el: Extract<CElement, { kind: K }>;
} {
  const cfg = newConfig("Kitchen", 0);
  const el = newElement(kind) as Extract<CElement, { kind: K }>;
  el.payload.frame = { x: 0.25, y: 0.25, width: 0.5, height: 0.5, rotationDegrees: 0 };
  tweak(el);
  cfg.elements.push(el);
  cfg.perFamily.rectangular!.placements[el.payload.id] = { frame: { ...el.payload.frame }, isHidden: false };
  return { cfg, el };
}

describe("the cards a new selection opens", () => {
  it("is every card, and Collapse all keeps only Content and Look", () => {
    expect([...defaultOpenSections()].sort()).toEqual([...ALL_SECTIONS].sort());
    expect([...collapsedSections()].sort()).toEqual(["content", "look"]);
    expect(DEFAULT_SECTIONS.every((id) => (ALL_SECTIONS as readonly string[]).includes(id))).toBe(true);
  });

  it("draws every card open on a new selection", () => {
    const { cfg, el } = withLayer("text");
    const markup = flatten(layerEditor(host(cfg), el, "rectangular"));
    expect(markup).toContain("Font size");
    expect(markup).toContain("Typeface");
    expect(markup).toContain("Rotation");
    expect(markup).toContain("states-add");
  });

  it("draws Content and Look open and every other card folded to its summary after Collapse all", () => {
    const { cfg, el } = withLayer("text");
    const markup = flatten(layerEditor({ ...host(cfg), openSections: collapsedSections() }, el, "rectangular"));
    // Look is open: its first row is there.
    expect(markup).toContain("Font size");
    expect(markup).toContain("Typeface");
    // Position, States and Tap are folded: their rows are not drawn, their
    // summaries are.
    expect(markup).not.toContain("Rotation");
    expect(markup).not.toContain("states-add");
    expect(markup).toContain("X 25% Y 25% · 50 × 50");
    expect(markup).toContain("none · looks the same for every value");
    expect(markup).toContain(">off<");
  });

  it("offers Collapse all only while a card past the default two is open", () => {
    expect(moreThanDefaultOpen(defaultOpenSections())).toBe(true);
    expect(moreThanDefaultOpen(collapsedSections())).toBe(false);
    expect(moreThanDefaultOpen(new Set(["content"]))).toBe(false);
    expect(moreThanDefaultOpen(new Set(["content", "look", "states"]))).toBe(true);
    // A More line is not a card.
    expect(moreThanDefaultOpen(new Set(["content", "look", "look:more"]))).toBe(false);
  });

  it("gives a folded States card an Add that opens it and adds a state", () => {
    const { cfg, el } = withLayer("text");
    const toggled: string[] = [];
    const h = host(cfg, { toggleSection: (id) => { toggled.push(id); } });
    const { action } = statesAddAction(h, el.payload.rules, "text",
      (c) => c.elements.find((e) => e.payload.id === el.payload.id)?.payload.rules, `rules-${el.payload.id}`,
      { kind: { kind: "entityState", entityId: "light.kitchen", displayName: "Kitchen", domain: "light" } });
    expect(action?.label).toBe("Add");
    action!.run();
    // A light's first click starts the table with on and off.
    expect(el.payload.rules).toHaveLength(1);
    expect(statesCardSummary(el.payload.rules)).toBe("2 states");
    // The header button is drawn only while the card is shut.
    expect(flatten(layerEditor(host(cfg, { openSections: collapsedSections() }), el, "rectangular"))).toContain("sec-act");
    expect(flatten(layerEditor(host(cfg), el, "rectangular"))).not.toContain("sec-act");
    expect(flatten(layerEditor(host(cfg, { openSections: new Set(["content", "look", "states"]) }), el, "rectangular")))
      .not.toContain("sec-act");
  });
});

describe("a folded card's summary", () => {
  it("counts the states, and says when an Otherwise row catches the rest", () => {
    const light = { kind: { kind: "entityState" as const, entityId: "light.kitchen", displayName: "Kitchen", domain: "light" } };
    expect(statesCardSummary([])).toBe("none · looks the same for every value");
    const two = buildStatesRule(light, [
      { comparison: { kind: "isOn" }, changes: [] },
      { comparison: { kind: "isOff" }, changes: [] },
    ]);
    expect(statesCardSummary([two])).toBe("2 states");
    const otherwise = buildStatesRule(light, [{ comparison: { kind: "isOn" }, changes: [] }], []);
    expect(statesCardSummary([otherwise])).toBe("1 state · otherwise");
  });

  it("gives the page, the spot, the size and a turn only when there is one", () => {
    const { cfg, el } = withLayer("text");
    expect(positionSummary(cfg, el, "rectangular")).toBe("X 25% Y 25% · 50 × 50");
    cfg.perFamily.rectangular!.placements[el.payload.id]!.frame.rotationDegrees = 15;
    expect(positionSummary(cfg, el, "rectangular")).toBe("X 25% Y 25% · 50 × 50 · 15°");
    cfg.pages = { count: 3, mode: "tour", dwell: [] };
    expect(positionSummary(cfg, el, "rectangular")).toBe("Every page · X 25% Y 25% · 50 × 50 · 15°");
    el.payload.page = 2;
    expect(positionSummary(cfg, el, "rectangular")).toBe("Page 2 · X 25% Y 25% · 50 × 50 · 15°");
  });

  it("says off, or on and what the tap does, with the hold under Play all pages", () => {
    const cfg = newConfig("Kitchen", 0);
    expect(tapSummary(cfg, undefined)).toBe("off");
    expect(tapSummary(cfg, { type: "refresh" })).toMatch(/^on · /);
    cfg.pages = { count: 3, mode: "tour", dwell: [] };
    expect(tapSummary(cfg, { type: "playTour" })).toBe("on · Play all pages · 2 s each");
    cfg.pages = { count: 3, mode: "tour", dwell: [3, 3, 3] };
    expect(tapSummary(cfg, { type: "playTour" })).toBe("on · Play all pages · 3 s each");
    // Pages held for different times have no one number to give.
    cfg.pages = { count: 3, mode: "tour", dwell: [3, 5, 3] };
    expect(tapSummary(cfg, { type: "playTour" })).toBe("on · Play all pages");
  });
});

describe("the More line in a Look card", () => {
  // These read the Look card alone: with only Content and Look open, no other
  // card can put a stray Opacity row in the markup.
  it("folds a text layer's less used rows and names them", () => {
    const { cfg, el } = withLayer("text");
    const markup = flatten(layerEditor(host(cfg, { openSections: collapsedSections() }), el, "rectangular"));
    expect(markup).toContain("width, italic, mono digits, curve, highlight, opacity, shadow");
    expect(markup).not.toContain("Mono digits");
    expect(markup).not.toContain(">Opacity<");
    // The common rows stay in sight.
    expect(markup).toContain("Weight");
    expect(markup).toContain("Shrink to fit");
  });

  it("starts open when a row behind it is changed", () => {
    const { cfg, el } = withLayer("text", (t) => { t.payload.italic = true; });
    const markup = flatten(layerEditor(host(cfg), el, "rectangular"));
    expect(markup).toContain("Less");
    expect(markup).toContain("Italic");
    expect(markup).toContain(">Opacity<");
  });

  it("starts open for a changed opacity on any kind", () => {
    const { cfg, el } = withLayer("icon", (i) => { i.payload.opacity = 0.5; });
    expect(flatten(layerEditor(host(cfg, { openSections: collapsedSections() }), el, "rectangular"))).toContain(">Opacity<");
    const plain = withLayer("icon");
    expect(flatten(layerEditor(host(plain.cfg, { openSections: collapsedSections() }), plain.el, "rectangular"))).not.toContain(">Opacity<");
  });

  it("keeps the reader's own choice over the changed default", () => {
    expect(moreIsOpen(new Set(), "look", false)).toBe(false);
    expect(moreIsOpen(new Set(), "look", true)).toBe(true);
    expect(moreIsOpen(new Set(["look:less"]), "look", true)).toBe(false);
    expect(moreIsOpen(new Set(["look:more"]), "look", false)).toBe(true);
    const { cfg, el } = withLayer("text", (t) => { t.payload.italic = true; });
    const shut = flatten(layerEditor(host(cfg, { openSections: new Set(["content", "look", "look:less"]) }), el, "rectangular"));
    expect(shut).not.toContain("Mono digits");
  });

  it("puts a picture's zoom, pan and corners behind it", () => {
    const { cfg, el } = withLayer("image");
    const markup = flatten(layerEditor(host(cfg), el, "rectangular"));
    expect(markup).toContain("zoom, pan, corner radius, opacity, shadow");
    expect(markup).not.toContain("Pan left/right");
    expect(markup).toContain("Fill the frame");
  });
});

describe("the shape's cards", () => {
  it("open with a Tap card holding the whole complication's tap", () => {
    const cfg = newConfig("Kitchen", 0);
    cfg.tapAction = { type: "playTour" };
    cfg.pages = { count: 2, mode: "tour", dwell: [] };
    const markup = flatten(familyEditor(host(cfg), "rectangular"));
    const tap = markup.indexOf(">Tap<");
    const shape = markup.indexOf("Rectangular shape");
    expect(tap).toBeGreaterThan(-1);
    expect(shape).toBeGreaterThan(tap);
    expect(markup).toContain("on · Play all pages · 2 s each");
    // Opened, it is the same picker the Complication card has.
    const open = flatten(familyEditor(host(cfg, { openSections: new Set(["look", "tappable"]) }), "rectangular"));
    expect(open).toContain("Tap action");
    expect(open).toContain("Same for every page");
  });
});

describe("the footer row", () => {
  it("says the revision and who saved it, or that it is not saved yet", () => {
    expect(footerStatus({ revision: null, dirty: true, updatedBy: "" })).toEqual({ tone: "none", text: "Not saved yet" });
    expect(footerStatus({ revision: 12, dirty: false, updatedBy: "ha-panel:Jesse" })).toEqual({ tone: "ok", text: "Revision 12 · saved by Jesse" });
    expect(footerStatus({ revision: 12, dirty: true, updatedBy: "ha-panel:Jesse" }).tone).toBe("warn");
    expect(footerStatus({ revision: 12, dirty: false, updatedBy: "", error: "offline" })).toEqual({ tone: "err", text: "Not saved: offline" });
  });
});
