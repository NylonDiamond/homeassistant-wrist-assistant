// The document's Control Center control: the wire, the two pure readings the
// app shares with the panel, the resolver, and the switch that writes and
// clears the key.
//
// The bytes matter most. A Swift `ControlSpec` decodes the same object, so a
// key this side writes in a different order, or writes when it should be
// absent, is a contract break rather than a cosmetic difference. Everything
// else here is behaviour both sides have to agree on: which words read as on,
// when a toggle is really a button, and which band a tint comes from.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  type ControlSpec,
  type CustomComplicationConfig,
  CONTROL_ACTION_TYPES,
  CONTROL_DEFAULT_SYMBOL,
  CONTROL_TOGGLE_ACTION_TYPES,
  auditUnknownKeys,
  controlActionAllowed,
  controlEffectiveKind,
  controlIsOn,
  defaultControlSpec,
  documentEntityUses,
  encodeConfig,
  literal,
  newConfig,
  parseConfig,
  setControlShown,
} from "../src/model.js";
import { compile } from "../src/compiler.js";
import { scrubForShare, shareSlots } from "../src/transfer.js";
import { type ResolveContext, resolveControl } from "../src/resolver.js";
import { type EditorHost, controlCard } from "../src/editors.js";
import { MIN_VERSION_FOR_CONTROL_CENTER, deviceSupportsControls } from "../src/version.js";
import type { HassLike } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import { SymbolBrowser } from "../src/symbols.js";

const noIcons: IconProvider = { render: () => undefined, available: () => false, names: () => undefined };

/** A document as it sits on the wire, with whatever control is handed in. */
function rawDocument(control?: Record<string, unknown>): Record<string, unknown> {
  const doc = encodeConfig(newConfig("Kitchen lamp", 0)) as Record<string, unknown>;
  if (control !== undefined) doc.control = control;
  return doc;
}

/** One control as the wire spells it, every key present and in order. */
function fullControl(): Record<string, unknown> {
  return {
    kind: "toggle",
    title: { kind: { kind: "literal", value: "Kitchen lamp" } },
    valueLabel: { kind: { kind: "entityState", entityId: "sensor.lamp_power", displayName: "Power", domain: "sensor" } },
    state: { kind: { kind: "entityState", entityId: "light.kitchen", displayName: "Kitchen", domain: "light" } },
    symbol: "lightbulb.fill",
    symbolOff: "lightbulb",
    tintColorHex: "#FFCC00",
    coloring: "bands",
    bands: [
      { id: "1B4A4E1E-0000-4000-8000-000000000001", upTo: 20, colorHex: "#32D74B" },
      { id: "1B4A4E1E-0000-4000-8000-000000000002", upTo: 40, colorHex: "#FFD60A" },
    ],
    bandAboveColorHex: "#FF453A",
    status: { kind: { kind: "literal", value: "Switched" } },
    action: { type: "toggleEntity", entityId: "light.kitchen", displayName: "Kitchen", domain: "light" },
  };
}

/** The control a round trip through the parser and the encoder leaves. */
function roundTrip(control: Record<string, unknown>): unknown {
  return (encodeConfig(parseConfig(rawDocument(control))) as Record<string, unknown>).control;
}

function context(states: Record<string, string> = {}): ResolveContext {
  return {
    entityStates: new Map(Object.entries(states).map(([entityId, state]) => [entityId, {
      entityId, state, iconName: "", domain: entityId.split(".")[0]!,
    }])),
    templateResults: new Map(),
    namedValues: [],
  };
}

/** A spec built in code rather than parsed, for the resolver tests. */
function spec(over: Partial<ControlSpec> = {}): ControlSpec {
  return {
    kind: "toggle",
    title: literal("Lamp"),
    symbol: "lightbulb.fill",
    coloring: "uniform",
    bands: [],
    action: { type: "toggleEntity", entityId: "light.kitchen", displayName: "", domain: "light" },
    ...over,
  };
}

describe("the control on the wire", () => {
  it("round-trips every key in the order the app's decoder reads them", () => {
    const control = fullControl();
    // Byte order, not just the same keys: the two sides write one string each
    // and a fixture is compared as text on the way through the sync script.
    expect(JSON.stringify(roundTrip(control))).toBe(JSON.stringify(control));
  });

  it("writes no key at all for a document with no control", () => {
    const doc = encodeConfig(parseConfig(rawDocument()));
    expect("control" in doc).toBe(false);
  });

  it("leaves out every absent optional", () => {
    expect(roundTrip({
      kind: "button",
      title: { kind: { kind: "literal", value: "Movie night" } },
      symbol: "film",
      coloring: "uniform",
      bands: [],
      action: { type: "runScene", entityId: "scene.movie", displayName: "Movie", domain: "scene" },
    })).toEqual({
      kind: "button",
      title: { kind: { kind: "literal", value: "Movie night" } },
      symbol: "film",
      coloring: "uniform",
      bands: [],
      action: { type: "runScene", entityId: "scene.movie", displayName: "Movie", domain: "scene" },
    });
  });

  it("reads a half-finished control rather than refusing it", () => {
    const parsed = parseConfig(rawDocument({ kind: "wobble" }));
    expect(parsed.control).toEqual({
      kind: "toggle",
      title: literal(""),
      symbol: CONTROL_DEFAULT_SYMBOL,
      coloring: "uniform",
      bands: [],
      action: { type: "none" },
    });
  });

  it("does not move the schema version, since the control changes nothing a watch draws", () => {
    const without = encodeConfig(parseConfig(rawDocument())) as { schemaVersion: number };
    const with_ = encodeConfig(parseConfig(rawDocument(fullControl()))) as { schemaVersion: number };
    expect(with_.schemaVersion).toBe(without.schemaVersion);
  });
});

describe("the unknown-key audit", () => {
  it("accepts a document carrying a control", () => {
    expect(auditUnknownKeys(rawDocument(fullControl()))).toEqual([]);
  });

  it("still reports a key inside the control that nothing decodes", () => {
    const control = { ...fullControl(), wobble: true };
    expect(auditUnknownKeys(rawDocument(control))).toEqual(["$.control.wobble"]);
  });

  it("reports an unknown key inside the control's action", () => {
    const control = { ...fullControl(), action: { type: "toggleEntity", entityId: "light.k", wobble: 1 } };
    expect(auditUnknownKeys(rawDocument(control))).toEqual(["$.control.action.wobble"]);
  });
});

describe("controlIsOn", () => {
  it("reads exactly the seven states a control calls on", () => {
    for (const on of ["on", "open", "unlocked", "home", "playing", "heat", "cool"]) {
      expect(controlIsOn(on), on).toBe(true);
    }
  });

  it("trims and lowercases first", () => {
    expect(controlIsOn("  ON  ")).toBe(true);
    expect(controlIsOn("Open")).toBe(true);
  });

  it("reads everything else as off, including nothing at all", () => {
    for (const off of ["off", "closed", "locked", "not_home", "opening", "returning", "idle", "unavailable", "", "  "]) {
      expect(controlIsOn(off), JSON.stringify(off)).toBe(false);
    }
    expect(controlIsOn(undefined)).toBe(false);
  });
});

describe("controlEffectiveKind", () => {
  it("is a toggle only when the action can switch off again", () => {
    for (const type of CONTROL_TOGGLE_ACTION_TYPES) {
      expect(controlEffectiveKind({ kind: "toggle", action: { type } as never }), type).toBe("toggle");
    }
  });

  it("falls back to a button for an action that cannot toggle", () => {
    for (const type of CONTROL_ACTION_TYPES.filter((t) => !CONTROL_TOGGLE_ACTION_TYPES.includes(t))) {
      expect(controlEffectiveKind({ kind: "toggle", action: { type } as never }), type).toBe("button");
    }
  });

  it("leaves a button a button whatever its action is", () => {
    expect(controlEffectiveKind({ kind: "button", action: { type: "toggleEntity", entityId: "light.k", displayName: "", domain: "light" } })).toBe("button");
  });

  it("allows the six actions a control may run and no others", () => {
    expect(CONTROL_ACTION_TYPES).toEqual(["toggleEntity", "runScene", "runScript", "callService", "runHTTPAction", "openApp"]);
    for (const refused of ["refresh", "none", "openPage", "openRoomPage", "timerStartPause", "timerCancel", "addTodo"] as const) {
      expect(controlActionAllowed(refused), refused).toBe(false);
    }
  });
});

describe("resolveControl", () => {
  it("settles the title, the value line and the status through the value resolver", () => {
    const got = resolveControl(spec({
      valueLabel: { kind: { kind: "entityState", entityId: "sensor.power", displayName: "", domain: "sensor" } },
      status: literal("Switched"),
      state: { kind: { kind: "entityState", entityId: "light.kitchen", displayName: "", domain: "light" } },
    }), context({ "sensor.power": "42", "light.kitchen": "on" }));
    expect(got.title).toBe("Lamp");
    expect(got.valueLabel).toBe("42");
    expect(got.status).toBe("Switched");
    expect(got.isOn).toBe(true);
  });

  it("draws the off symbol while a toggle reads off, and the on one while it reads on", () => {
    const s = spec({
      symbolOff: "lightbulb",
      state: { kind: { kind: "entityState", entityId: "light.kitchen", displayName: "", domain: "light" } },
    });
    expect(resolveControl(s, context({ "light.kitchen": "off" })).symbol).toBe("lightbulb");
    expect(resolveControl(s, context({ "light.kitchen": "on" })).symbol).toBe("lightbulb.fill");
  });

  it("keeps the one symbol when the control names no off symbol", () => {
    const s = spec({ state: literal("off") });
    expect(resolveControl(s, context()).symbol).toBe("lightbulb.fill");
    expect(resolveControl(s, context()).isOn).toBe(false);
  });

  it("ignores the off symbol and the state on a control that is really a button", () => {
    const got = resolveControl(spec({
      kind: "toggle",
      symbolOff: "lightbulb",
      state: literal("off"),
      action: { type: "runScene", entityId: "scene.movie", displayName: "", domain: "scene" },
    }), context());
    expect(got.kind).toBe("button");
    expect(got.symbol).toBe("lightbulb.fill");
    expect(got.isOn).toBe(false);
  });

  it("takes the tint from the band the reading falls in", () => {
    const banded = (valueLabel: string) => resolveControl(spec({
      valueLabel: literal(valueLabel),
      tintColorHex: "#FFFFFF",
      coloring: "bands",
      bands: [
        { id: "B1", upTo: 20, colorHex: "#32D74B" },
        { id: "B2", upTo: 40, colorHex: "#FFD60A" },
      ],
      bandAboveColorHex: "#FF453A",
    }), context()).tintColorHex;
    expect(banded("15")).toBe("#32D74B");
    expect(banded("20")).toBe("#32D74B");
    expect(banded("35")).toBe("#FFD60A");
    expect(banded("55")).toBe("#FF453A");
  });

  it("matches the bands against the state when there is no value line, then the title", () => {
    const bands = [{ id: "B1", upTo: 20, colorHex: "#32D74B" }];
    const fromState = resolveControl(spec({
      state: literal("18"), coloring: "bands", bands, bandAboveColorHex: "#FF453A",
    }), context());
    expect(fromState.tintColorHex).toBe("#32D74B");
    const fromTitle = resolveControl(spec({
      title: literal("90"), coloring: "bands", bands, bandAboveColorHex: "#FF453A",
    }), context());
    expect(fromTitle.tintColorHex).toBe("#FF453A");
  });

  it("keeps the flat colour when the table is empty, off, or has no number to read", () => {
    expect(resolveControl(spec({ tintColorHex: "#FFCC00" }), context()).tintColorHex).toBe("#FFCC00");
    expect(resolveControl(spec({
      tintColorHex: "#FFCC00", coloring: "bands", bands: [],
    }), context()).tintColorHex).toBe("#FFCC00");
    expect(resolveControl(spec({
      tintColorHex: "#FFCC00", coloring: "bands", bands: [{ id: "B1", upTo: 20, colorHex: "#32D74B" }],
      valueLabel: literal("no number here"),
    }), context()).tintColorHex).toBe("#FFCC00");
  });

  it("leaves the tint absent for a control that names no colour, so the system one stands", () => {
    expect(resolveControl(spec(), context()).tintColorHex).toBeUndefined();
  });

  it("leaves out a value line that settles on nothing rather than drawing --", () => {
    const got = resolveControl(spec({
      valueLabel: { kind: { kind: "entityState", entityId: "sensor.missing", displayName: "", domain: "sensor" } },
    }), context());
    expect(got.valueLabel).toBeUndefined();
    expect(got.title).toBe("Lamp");
  });
});

describe("the Show in Control Center switch", () => {
  it("writes a control that borrows the document's name and tap action", () => {
    const cfg = newConfig("Kitchen lamp", 0);
    cfg.tapAction = { type: "toggleEntity", entityId: "light.kitchen", displayName: "Kitchen", domain: "light" };
    setControlShown(cfg, true);
    expect(cfg.control).toEqual({
      kind: "toggle",
      title: literal("Kitchen lamp"),
      symbol: CONTROL_DEFAULT_SYMBOL,
      coloring: "uniform",
      bands: [],
      action: { type: "toggleEntity", entityId: "light.kitchen", displayName: "Kitchen", domain: "light" },
    });
  });

  it("falls back to an empty toggle when the document's tap is one a control cannot run", () => {
    const cfg = newConfig("Weather", 0);
    expect(cfg.tapAction.type).toBe("refresh");
    setControlShown(cfg, true);
    expect(cfg.control!.action).toEqual({ type: "toggleEntity", entityId: "", displayName: "", domain: "" });
  });

  it("does not share the document's tap action object with the control", () => {
    const cfg = newConfig("Kitchen lamp", 0);
    cfg.tapAction = { type: "toggleEntity", entityId: "light.kitchen", displayName: "Kitchen", domain: "light" };
    setControlShown(cfg, true);
    cfg.tapAction = { type: "toggleEntity", entityId: "light.hall", displayName: "Hall", domain: "light" };
    expect((cfg.control!.action as { entityId: string }).entityId).toBe("light.kitchen");
  });

  it("leaves a control that is already there alone", () => {
    const cfg = newConfig("Kitchen lamp", 0);
    setControlShown(cfg, true);
    cfg.control!.symbol = "fan";
    setControlShown(cfg, true);
    expect(cfg.control!.symbol).toBe("fan");
  });

  it("takes the whole key away when it goes off, so nothing is left on the wire", () => {
    const cfg = newConfig("Kitchen lamp", 0);
    setControlShown(cfg, true);
    setControlShown(cfg, false);
    expect("control" in cfg).toBe(false);
    expect("control" in encodeConfig(cfg)).toBe(false);
  });

  it("names a default title even for a document with no name", () => {
    const cfg = newConfig("   ", 0);
    expect(defaultControlSpec(cfg).title).toEqual(literal("Control"));
  });
});

describe("the control's place in the document walk", () => {
  /** A document whose control reads a couple of entities and a template. */
  function withControl(): CustomComplicationConfig {
    const cfg = newConfig("Kitchen lamp", 0);
    setControlShown(cfg, true);
    cfg.control!.title = literal("Kitchen lamp");
    cfg.control!.valueLabel = { kind: { kind: "entityState", entityId: "sensor.lamp_power", displayName: "Power", domain: "sensor" } };
    cfg.control!.state = { kind: { kind: "entityState", entityId: "light.kitchen", displayName: "Kitchen", domain: "light" } };
    cfg.control!.status = { kind: { kind: "jinja", value: "{{ states('light.kitchen') }}" } };
    cfg.control!.action = { type: "toggleEntity", entityId: "light.kitchen", displayName: "Kitchen", domain: "light" };
    return cfg;
  }

  it("asks for the entities and templates the control reads", () => {
    // Nothing else fetches these, so a control whose value line reads an
    // entity would sit on "--" for ever if the compiler skipped it.
    const compiled = compile(withControl());
    expect([...compiled.entities.keys()].sort()).toEqual(["light.kitchen", "sensor.lamp_power"]);
    expect(compiled.document).toContain("states('light.kitchen')");
  });

  it("asks for nothing extra when the document has no control", () => {
    expect([...compile(newConfig("Plain", 0)).entities.keys()]).toEqual([]);
  });

  it("names every place the control reads an entity, so a share can scrub them", () => {
    const uses = documentEntityUses(withControl(), () => true);
    // The status here is a template, and a template reads as "Template text"
    // wherever it sits, the same as one on a layer.
    expect(uses.filter((u) => u.where.startsWith("Control Center")).map((u) => u.where)).toEqual([
      "Control Center value line",
      "Control Center state",
      "Control Center",
    ]);
    expect(uses.some((u) => u.where === "Template text" && u.entityId === "light.kitchen")).toBe(true);
  });

  it("swaps the control's entities for placeholders on a share", () => {
    const cfg = withControl();
    const slots = shareSlots(cfg, new Set(["light", "sensor"]));
    const shared = scrubForShare(cfg, slots);
    const ids = JSON.stringify(encodeConfig(shared));
    expect(ids).not.toContain("light.kitchen");
    expect(ids).not.toContain("sensor.lamp_power");
    expect((shared.control!.action as { entityId: string }).entityId).toMatch(/^light\.shared_\d+$/);
  });
});

describe("the capability gate", () => {
  it("hides the card for an app below the release that draws a control", () => {
    expect(deviceSupportsControls("2.7.0")).toBe(false);
    expect(deviceSupportsControls("2.8.0")).toBe(true);
    expect(deviceSupportsControls("2.9.1")).toBe(true);
  });

  it("shows the card to a device that has not reported a version", () => {
    // The panel only opens for a device at or above its own gate, so guessing
    // "too old" here would hide the card from an orphan that is really fine.
    expect(deviceSupportsControls(null)).toBe(true);
    expect(deviceSupportsControls(undefined)).toBe(true);
  });

  it("hides it everywhere while the minimum is unset", () => {
    expect(deviceSupportsControls("9.9.9", null)).toBe(false);
  });

  it("is pinned to the release the app half ships in", () => {
    expect(MIN_VERSION_FOR_CONTROL_CENTER).toBe("2.8.0");
  });
});

// ── the card ──────────────────────────────────────────────────────────────

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
    watchAppVersion: "2.8.0",
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

describe("the Control Center card", () => {
  it("is nothing at all for an app too old to draw a control", () => {
    expect(controlCard(host(newConfig("Lamp", 0), { watchAppVersion: "2.7.0" }))).toBe(nothing);
  });

  it("is one switch and a hint until the control is switched on", () => {
    const markup = flatten(controlCard(host(newConfig("Lamp", 0))));
    expect(markup).toContain("Show in Control Center");
    expect(markup).toContain("Shows the last synced value.");
    expect(markup).not.toContain("Symbol when off");
    // Never the word live: the control is exactly as fresh as the last pull.
    expect(markup.toLowerCase()).not.toContain("live");
  });

  it("shows every row once the control is on", () => {
    const cfg = newConfig("Lamp", 0);
    cfg.tapAction = { type: "toggleEntity", entityId: "light.kitchen", displayName: "Kitchen", domain: "light" };
    setControlShown(cfg, true);
    const markup = flatten(controlCard(host(cfg)));
    // Title, Value line, State and Status text are `valueEditor` rows: outside
    // a browser with popover support that widget draws its form in place and
    // its own title line goes with the chip, so only the rows this file can
    // see are named here.
    for (const label of ["Show in Control Center", "Kind", "Value line", "State",
      "Symbol", "Symbol when off", "Colour", "Tint", "Status text", "Tap action"]) {
      expect(markup, label).toContain(label);
    }
    // The title row is really there: it is editing the document's own name.
    expect(markup).toContain("Lamp");
  });

  it("warns about a toggle with no state, without refusing to save it", () => {
    const cfg = newConfig("Lamp", 0);
    setControlShown(cfg, true);
    cfg.control!.action = { type: "toggleEntity", entityId: "light.kitchen", displayName: "", domain: "light" };
    expect(flatten(controlCard(host(cfg)))).toContain("A toggle with no state");
  });

  it("warns that an action which cannot toggle makes the control a button", () => {
    const cfg = newConfig("Lamp", 0);
    setControlShown(cfg, true);
    cfg.control!.action = { type: "runScene", entityId: "scene.movie", displayName: "Movie", domain: "scene" };
    const markup = flatten(controlCard(host(cfg)));
    expect(markup).toContain("acts as a button");
    // A button has no state and no off symbol, so neither row is offered.
    expect(markup).not.toContain("Symbol when off");
  });

  it("draws the mock tile from the resolver once there is a context to resolve in", () => {
    const cfg = newConfig("Lamp", 0);
    setControlShown(cfg, true);
    cfg.control!.valueLabel = literal("42 W");
    const markup = flatten(controlCard(host(cfg, { resolveContext: () => context() })));
    expect(markup).toContain("In Control Center");
    expect(markup).toContain("42 W");
  });

  it("offers only the actions a control may run", () => {
    const cfg = newConfig("Lamp", 0);
    setControlShown(cfg, true);
    const markup = flatten(controlCard(host(cfg)));
    expect(markup).toContain("Toggle an entity");
    expect(markup).toContain("Run a scene");
    expect(markup).not.toContain("Open the page");
    expect(markup).not.toContain("Add a to-do");
  });
});
