// The Control Center tab: a control is edited like a shape that draws no
// layers, so the panel has to decide which tab a document opens on, what the
// left column says instead of the layer tools, and what the tile looks like at
// each of the three sizes it is drawn at.
//
// Everything here is pure. The tab itself is a Lit element's render, but the
// two decisions behind it are functions in layouts.ts and the drawing is one
// exported function in editors.ts, which is the whole reason they were pulled
// out: this file is what stops the tab's rules from being spread over 9,000
// lines of panel where nothing can reach them.

import { describe, expect, it } from "vitest";
import { html, nothing } from "lit";
import {
  type CustomComplicationConfig,
  literal,
  newConfig,
  newControlConfig,
  newElement,
  setControlShown,
} from "../src/model.js";
import { controlNoteLines, opensInControlView } from "../src/layouts.js";
import { CONTROL_TILE_SIDE, type EditorHost, controlTile } from "../src/editors.js";
import { type ResolveContext } from "../src/resolver.js";
import { SymbolBrowser } from "../src/symbols.js";
import type { HassLike } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";

/** An icon provider that draws the name it was asked for, so a test can see
 * which symbol the tile resolved and how big it drew it. */
const namedIcons: IconProvider = {
  render: (name: string, size: number) => html`<svg data-symbol=${name} data-size=${size}></svg>`,
  available: () => true,
  names: () => undefined,
};

function context(states: Record<string, string> = {}): ResolveContext {
  return {
    entityStates: new Map(Object.entries(states).map(([entityId, state]) => [entityId, {
      entityId, state, iconName: "", domain: entityId.split(".")[0]!,
    }])),
    templateResults: new Map(),
    namedValues: [],
  };
}

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
    icons: namedIcons,
    symbols: new SymbolBrowser(() => {}),
    pages: [],
    watchAppVersion: "2.8.0",
    update: (m: (c: CustomComplicationConfig) => void) => m(cfg),
    endGesture: () => {},
    resolve: () => undefined,
    resolveContext: () => context(),
    canCountDown: () => false,
    historySeries: () => undefined,
    evaluateTest: () => false,
    liveBranch: () => "none",
    forced: new Map(),
    setForced: () => {},
    activeFamily: "circular" as const,
    setActiveFamily: () => {},
    addFamily: () => {},
    tapAreaShown: false,
    showTapArea: () => {},
    openSections: new Set(["control"]),
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

/** A document with a control on it, named and symbolled for the assertions. */
function withControl(): CustomComplicationConfig {
  const cfg = newConfig("Kitchen lamp", 0);
  setControlShown(cfg, true);
  cfg.control!.title = literal("Kitchen lamp");
  cfg.control!.symbol = "lightbulb.fill";
  return cfg;
}

describe("a symbol field that starts shut", () => {
  it("reads shut for a key nobody has touched, and open for the default", () => {
    const browser = new SymbolBrowser(() => {});
    expect(browser.isOpen("control-symbol", false)).toBe(false);
    expect(browser.isOpen("icon-symbol")).toBe(true);
  });

  it("opens on a click and shuts again on the next one", () => {
    const browser = new SymbolBrowser(() => {});
    browser.toggle("control-symbol", false);
    expect(browser.isOpen("control-symbol", false)).toBe(true);
    browser.toggle("control-symbol", false);
    expect(browser.isOpen("control-symbol", false)).toBe(false);
  });

  it("leaves a field that starts open working the way it always did", () => {
    const browser = new SymbolBrowser(() => {});
    browser.toggle("icon-symbol");
    expect(browser.isOpen("icon-symbol")).toBe(false);
    browser.toggle("icon-symbol");
    expect(browser.isOpen("icon-symbol")).toBe(true);
  });

  it("keeps each field's grid to itself", () => {
    const browser = new SymbolBrowser(() => {});
    browser.toggle("control-symbol", false);
    expect(browser.isOpen("control-symbol", false)).toBe(true);
    expect(browser.isOpen("control-symbol-off", false)).toBe(false);
    expect(browser.isOpen("icon-symbol")).toBe(true);
  });

  it("tells the change callback, so the field redraws", () => {
    let changes = 0;
    const browser = new SymbolBrowser(() => { changes += 1; });
    browser.toggle("control-symbol", false);
    expect(changes).toBe(1);
  });
});

describe("the mock Control Center tile", () => {
  it("draws the resolved title and symbol at the card's size", () => {
    const markup = flatten(controlTile(host(withControl()), withControl().control!));
    expect(markup).toContain("Kitchen lamp");
    expect(markup).toContain("lightbulb.fill");
    expect(markup).toContain(`width:${CONTROL_TILE_SIDE}px`);
  });

  it("draws the same title and symbol at the stage's size, everything scaled", () => {
    const big = CONTROL_TILE_SIDE * 3;
    const cfg = withControl();
    const markup = flatten(controlTile(host(cfg), cfg.control!, big));
    expect(markup).toContain("Kitchen lamp");
    expect(markup).toContain("lightbulb.fill");
    expect(markup).toContain(`width:${big}px`);
    // The glyph grows with the tile rather than staying at the card's 24px.
    expect(markup).toContain(`data-size=${Math.round(big * 0.293)}`);
  });

  it("resolves a title that reads an entity", () => {
    const cfg = withControl();
    cfg.control!.title = {
      kind: { kind: "entityState", entityId: "sensor.power", displayName: "Power", domain: "sensor" },
    };
    const markup = flatten(controlTile(
      host(cfg, { resolveContext: () => context({ "sensor.power": "42" }) }),
      cfg.control!,
    ));
    expect(markup).toContain("42");
  });

  it("draws the off symbol while a toggle reads off", () => {
    const cfg = withControl();
    cfg.control!.symbolOff = "lightbulb";
    cfg.control!.state = literal("off");
    const markup = flatten(controlTile(host(cfg), cfg.control!));
    expect(markup).toContain("lightbulb");
    expect(markup).not.toContain("lightbulb.fill");
  });

  it("drops the words at shape-tab size, where they would be two pixels tall", () => {
    const cfg = withControl();
    const markup = flatten(controlTile(host(cfg), cfg.control!, 20));
    expect(markup).toContain("lightbulb.fill");
    expect(markup).not.toContain("Kitchen lamp");
  });

  it("is nothing at all before there is a context to resolve in", () => {
    const cfg = withControl();
    expect(controlTile(host(cfg, { resolveContext: undefined }), cfg.control!)).toBe(nothing);
  });
});

describe("which tab a document opens on", () => {
  it("opens on the control when the document is nothing but a control", () => {
    expect(opensInControlView(newControlConfig("Kitchen lamp", 0))).toBe(true);
  });

  it("opens on a shape once any shape has a layer", () => {
    const cfg = newControlConfig("Kitchen lamp", 0);
    cfg.elements.push(newElement("text"));
    expect(opensInControlView(cfg)).toBe(false);
  });

  it("opens on a shape for a document with no control at all", () => {
    expect(opensInControlView(newConfig("Kitchen lamp", 0))).toBe(false);
  });
});

describe("the note where the layer tools were", () => {
  it("says what draws a control, and why the shape tab stays, on an iPhone", () => {
    const [note, shape] = controlNoteLines("Circular", true);
    expect(note).toBe("A control has no layers. Control Center draws it from the title, symbol, tint, value line and status on the right.");
    expect(shape).toBe("The Circular tab is what the Lock Screen shows; a complication always keeps at least one shape.");
  });

  it("names the watch face on a watch, and the shape it was handed", () => {
    const [, shape] = controlNoteLines("Rectangular", false);
    expect(shape).toBe("The Rectangular tab is what the watch face shows; a complication always keeps at least one shape.");
  });

  it("offers a shape instead of explaining one on a document that has none", () => {
    const [note, shape] = controlNoteLines(undefined, true);
    expect(note).toBe("A control has no layers. Control Center draws it from the title, symbol, tint, value line and status on the right.");
    expect(shape).toBe("This complication has no widget. Add a shape above if you want one on the Lock Screen.");
    expect(controlNoteLines(undefined, false)[1])
      .toBe("This complication has no widget. Add a shape above if you want one on the watch face.");
  });
});
