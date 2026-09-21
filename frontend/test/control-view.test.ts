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
  controlOnly,
  literal,
  newConfig,
  newControlConfig,
  newElement,
  setControlShown,
} from "../src/model.js";
import { addFamily, canRemoveControl, controlNoteLines, opensInControlView } from "../src/layouts.js";
import { CONTROL_TILE_SIDE, type EditorHost, controlDevice, controlHeadline, controlStatusShows, controlTile, controlTileShapes } from "../src/editors.js";
import { type ResolveContext, type ResolvedControl } from "../src/resolver.js";
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
  it("draws the watch as a pill with the symbol alone, at the card's height", () => {
    const markup = flatten(controlTile(host(withControl()), withControl().control!, "watchPill"));
    expect(markup).toContain("lightbulb.fill");
    expect(markup).not.toContain("Kitchen lamp");
    expect(markup).toContain(`height:${CONTROL_TILE_SIDE}px`);
    expect(markup).toContain(`width:${Math.round(CONTROL_TILE_SIDE * 1.6)}px`);
  });

  it("draws the iPhone's wide tile with the title inside, and its circle without", () => {
    const cfg = withControl();
    const wide = flatten(controlTile(host(cfg), cfg.control!, "phoneWide"));
    expect(wide).toContain("Kitchen lamp");
    expect(wide).toContain("lightbulb.fill");
    expect(wide).toContain(`width:${Math.round(CONTROL_TILE_SIDE * 2.35)}px`);
    const circle = flatten(controlTile(host(cfg), cfg.control!, "phoneCircle"));
    expect(circle).not.toContain("Kitchen lamp");
    expect(circle).toContain(`width:${CONTROL_TILE_SIDE}px`);
  });

  it("draws the same symbol at the stage's size, everything scaled", () => {
    const big = CONTROL_TILE_SIDE * 2;
    const cfg = withControl();
    const markup = flatten(controlTile(host(cfg), cfg.control!, "watchPill", big));
    expect(markup).toContain("lightbulb.fill");
    expect(markup).toContain(`height:${big}px`);
    // The glyph grows with the tile rather than staying at the card's size.
    expect(markup).toContain(`data-size=${Math.round(big * 0.46)}`);
  });

  it("lists one shape for a watch and two for an iPhone", () => {
    expect(controlTileShapes("watch")).toEqual(["watchPill"]);
    expect(controlTileShapes("iphone")).toEqual(["phoneCircle", "phoneWide"]);
    expect(controlDevice(host(withControl()))).toBe("watch");
    expect(controlDevice(host(withControl(), { deviceKind: "iphone" }))).toBe("iphone");
  });

  it("paints a lit iPhone toggle white with the tint on the symbol, and a lit watch toggle in the tint", () => {
    const cfg = withControl();
    cfg.control!.state = literal("on");
    cfg.control!.tintColorHex = "#FF9F0A";
    const phone = flatten(controlTile(host(cfg), cfg.control!, "phoneCircle"));
    expect(phone).toContain("background:#FFFFFF");
    expect(phone).toContain("color:#FF9F0A");
    const watch = flatten(controlTile(host(cfg), cfg.control!, "watchPill"));
    expect(watch).toContain("background:#FF9F0A");
    expect(watch).not.toContain("color:#FF9F0A");
  });

  it("keeps the dark ground while a toggle reads off, on both devices", () => {
    const cfg = withControl();
    cfg.control!.state = literal("off");
    cfg.control!.tintColorHex = "#FF9F0A";
    for (const shape of ["watchPill", "phoneCircle", "phoneWide"] as const) {
      const markup = flatten(controlTile(host(cfg), cfg.control!, shape));
      expect(markup).not.toContain("background:#FF9F0A");
      expect(markup).not.toContain("background:#FFFFFF");
    }
  });

  it("prints On or Off under the title of a toggle with no value line, as the app does", () => {
    const cfg = withControl();
    cfg.control!.state = literal("on");
    delete cfg.control!.valueLabel;
    expect(flatten(controlTile(host(cfg), cfg.control!, "phoneWide"))).toContain(">On<");
    cfg.control!.state = literal("off");
    expect(flatten(controlTile(host(cfg), cfg.control!, "phoneWide"))).toContain(">Off<");
  });

  it("resolves a title that reads an entity", () => {
    const cfg = withControl();
    cfg.control!.title = {
      kind: { kind: "entityState", entityId: "sensor.power", displayName: "Power", domain: "sensor" },
    };
    const markup = flatten(controlTile(
      host(cfg, { resolveContext: () => context({ "sensor.power": "42" }) }),
      cfg.control!,
      "phoneWide",
    ));
    expect(markup).toContain("42");
  });

  it("draws the off symbol while a toggle reads off", () => {
    const cfg = withControl();
    cfg.control!.symbolOff = "lightbulb";
    cfg.control!.state = literal("off");
    const markup = flatten(controlTile(host(cfg), cfg.control!, "watchPill"));
    expect(markup).toContain("lightbulb");
    expect(markup).not.toContain("lightbulb.fill");
  });

  it("drops the words at shape-tab size, where they would be two pixels tall", () => {
    const cfg = withControl();
    const markup = flatten(controlTile(host(cfg), cfg.control!, "phoneWide", 20));
    expect(markup).toContain("lightbulb.fill");
    expect(markup).not.toContain("Kitchen lamp");
  });

  it("is nothing at all before there is a context to resolve in", () => {
    const cfg = withControl();
    expect(controlTile(host(cfg, { resolveContext: undefined }), cfg.control!, "watchPill")).toBe(nothing);
  });
});

describe("whether the device prints the status on a press", () => {
  it("is yes on the iPhone for both kinds, and on the watch for a toggle only", () => {
    const cfg = withControl();
    expect(controlStatusShows(host(cfg), cfg.control!)).toBe(true);
    expect(controlStatusShows(host(cfg, { deviceKind: "iphone" }), cfg.control!)).toBe(true);
    cfg.control!.kind = "button";
    expect(controlStatusShows(host(cfg), cfg.control!)).toBe(false);
    expect(controlStatusShows(host(cfg, { deviceKind: "iphone" }), cfg.control!)).toBe(true);
  });
});

describe("the line the watch prints above its tiles", () => {
  const resolved = (over: Partial<ResolvedControl>): ResolvedControl => ({
    kind: "toggle", title: "Kitchen lamp", symbol: "lightbulb", isOn: false, ...over,
  });

  it("is the title, a colon, then the value line", () => {
    expect(controlHeadline(resolved({ valueLabel: "42 W" }))).toBe("Kitchen lamp: 42 W");
  });

  it("falls back to On or Off for a toggle with no value line, which is what the app draws there", () => {
    expect(controlHeadline(resolved({ isOn: true }))).toBe("Kitchen lamp: On");
    expect(controlHeadline(resolved({ isOn: false }))).toBe("Kitchen lamp: Off");
  });

  it("is the title alone for a button with no value line", () => {
    expect(controlHeadline(resolved({ kind: "button" }))).toBe("Kitchen lamp");
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

// ── the two conditions the tab bar reads ─────────────────────────────────
//
// The bar draws the Control Center tab while there is a control and the adder
// while there is not, and `controlOnly` is what forces the control view on a
// document that has no other view. Both transitions the panel has to survive
// are these two functions over a config, so they are checked here rather than
// inside a Lit render nothing can reach.

describe("the tab bar after the control or a shape changes", () => {
  it("stops forcing the control view once a shape is added, and keeps the control", () => {
    const cfg = newControlConfig("Kitchen lamp", 0);
    expect(controlOnly(cfg)).toBe(true);
    expect(canRemoveControl(cfg)).toBe(false);
    addFamily(cfg, "circular");
    // The view is free to move to the new shape's tab, and the control tab
    // stays in the bar beside it.
    expect(controlOnly(cfg)).toBe(false);
    expect(cfg.control).toBeDefined();
    expect(canRemoveControl(cfg)).toBe(true);
  });

  it("leaves the shapes alone when the control is removed, so the bar still has tabs", () => {
    const cfg = newControlConfig("Kitchen lamp", 0, "circular");
    setControlShown(cfg, false);
    expect(cfg.control).toBeUndefined();
    expect(cfg.supportedFamilies).toEqual(["circular"]);
    // Nothing to show the control view for, and nothing to remove: the bar
    // draws "+ Control Center" instead.
    expect(opensInControlView(cfg)).toBe(false);
    expect(canRemoveControl(cfg)).toBe(false);
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

  // A shape cannot be added here: a document is one shape or one control, so
  // the line points at a second complication rather than at a button.
  it("points at a second complication on a document that has no shape", () => {
    const [note, shape] = controlNoteLines(undefined, true);
    expect(note).toBe("A control has no layers. Control Center draws it from the title, symbol, tint, value line and status on the right.");
    expect(shape).toBe("This complication is a control and nothing else. For something on the Lock Screen, make a second complication with a shape.");
    expect(controlNoteLines(undefined, false)[1])
      .toBe("This complication is a control and nothing else. For something on the watch face, make a second complication with a shape.");
  });
});
