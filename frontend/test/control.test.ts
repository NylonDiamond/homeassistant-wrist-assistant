// The document's Control Center control: the wire, the two pure readings the
// app shares with the panel, the resolver, and the mutation that writes and
// clears the key, which the shape bar's adder and the tab's x both run.
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
  controlOnly,
  legacyConfig,
  newConfig,
  newControlConfig,
  newElement,
  parseConfig,
  setControlShown,
  shapesRequired,
} from "../src/model.js";
import { compile } from "../src/compiler.js";
import { addFamily, canRemoveControl, canRemoveFamily, removeFamily } from "../src/layouts.js";
import { scrubForShare, shareSlots } from "../src/transfer.js";
import { type ResolveContext, resolveControl } from "../src/resolver.js";
import { type EditorHost, controlCard, controlTapEdit, generalEditor, tapActionEditor } from "../src/editors.js";
import { ACCENT_HEX, seedControlFromEntity } from "../src/presets.js";
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

  it("leaves out every absent optional, and the flat coloring with them", () => {
    // `coloring` and `bands` follow the same rule every layer's color table
    // follows, and the rule the app's encoder follows: a flat tint writes
    // neither key, whichever side saved the document last.
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
    for (const refused of ["refresh", "refreshAll", "none", "openPage", "openRoomPage", "timerStartPause", "timerCancel", "addTodo"] as const) {
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

  it("keeps the flat color when the table is empty, off, or has no number to read", () => {
    expect(resolveControl(spec({ tintColorHex: "#FFCC00" }), context()).tintColorHex).toBe("#FFCC00");
    expect(resolveControl(spec({
      tintColorHex: "#FFCC00", coloring: "bands", bands: [],
    }), context()).tintColorHex).toBe("#FFCC00");
    expect(resolveControl(spec({
      tintColorHex: "#FFCC00", coloring: "bands", bands: [{ id: "B1", upTo: 20, colorHex: "#32D74B" }],
      valueLabel: literal("no number here"),
    }), context()).tintColorHex).toBe("#FFCC00");
  });

  it("leaves the tint absent for a control that names no color, so the system one stands", () => {
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

// ── adding and removing the control ──────────────────────────────────────
//
// The control is added and removed exactly like a shape (decided 2026-09-16):
// "+ Control Center" in the shape bar makes one, the tab's x takes it away.
// Both run `setControlShown`, and what the x is allowed to do is
// `canRemoveControl`, so those two are the whole rule and the panel is only
// the buttons on top of them.

describe("adding and removing the control", () => {
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

    // The refresh that reaches other complications is no more runnable from
    // Control Center than the single one is.
    const all = newConfig("Weather", 0);
    all.tapAction = { type: "refreshAll" };
    setControlShown(all, true);
    expect(all.control!.action).toEqual({ type: "toggleEntity", entityId: "", displayName: "", domain: "" });
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

  it("leaves every shape and layer where it was, so the control is an extra", () => {
    const cfg = legacyConfig("Kitchen lamp", 0, ["circular", "rectangular"]);
    cfg.elements.push(newElement("text"));
    const before = structuredClone(cfg);
    setControlShown(cfg, true);
    expect(cfg.control).toBeDefined();
    delete cfg.control;
    expect(cfg).toEqual(before);
  });

  it("lets the x remove the control while a shape is left to draw", () => {
    expect(canRemoveControl(newControlConfig("Lamp", 0, "circular"))).toBe(true);
    // Nothing else to show: the control is what makes the document legal, so
    // the x is disabled and says to add a shape first.
    expect(canRemoveControl(newControlConfig("Lamp", 0))).toBe(false);
    // No control, nothing to remove. The bar draws the adder instead.
    expect(canRemoveControl(newConfig("Lamp", 0, "circular"))).toBe(false);
  });

  it("keeps the x usable once a shape is added back to a control-only document", () => {
    const cfg = newControlConfig("Lamp", 0);
    expect(canRemoveControl(cfg)).toBe(false);
    addFamily(cfg, "circular");
    expect(canRemoveControl(cfg)).toBe(true);
    setControlShown(cfg, false);
    expect(cfg.control).toBeUndefined();
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

  it("writes no status text, so nothing flashes until the author asks for it", () => {
    // The switch in the card is what seeds "Done"; a control nobody has
    // touched should press silently rather than flash a word it made up.
    const cfg = newConfig("Kitchen lamp", 0);
    expect("status" in defaultControlSpec(cfg)).toBe(false);
    setControlShown(cfg, true);
    expect(cfg.control!.status).toBeUndefined();
  });
});

// ── seeding from the target ───────────────────────────────────────────────
//
// Picking the entity is the one thing an author cannot be spared, so it pays
// for the rows under it. The rule everything here checks: a row the panel
// wrote may be rewritten, a row a person wrote may not.

describe("seedControlFromEntity", () => {
  const lamp = { entityId: "light.kitchen", displayName: "Kitchen lamp", domain: "light" };
  const door = { entityId: "lock.front", displayName: "Front door", domain: "lock" };
  const rosie = { entityId: "vacuum.rosie", displayName: "Rosie", domain: "vacuum" };

  /** A control as the switch leaves it: the document's name, the generic
   * symbol, no state, no tint. */
  function fresh(over: Partial<ControlSpec> = {}): ControlSpec {
    const cfg = newConfig("Kitchen lamp", 0);
    setControlShown(cfg, true);
    return { ...cfg.control!, ...over };
  }

  it("fills a light's title, state, symbols and tint", () => {
    const seeded = seedControlFromEntity(fresh(), lamp, undefined, "Kitchen lamp");
    expect(seeded.title).toEqual(literal("Kitchen lamp"));
    expect(seeded.state).toEqual({ kind: { kind: "entityState", entityId: "light.kitchen", displayName: "Kitchen lamp", domain: "light" } });
    expect(seeded.symbol).toBe("lightbulb.fill");
    expect(seeded.symbolOff).toBe("lightbulb");
    // The Toggle button preset's accent, so a control and a layer pointed at
    // one light are the same color.
    expect(seeded.tintColorHex).toBe(ACCENT_HEX);
  });

  it("takes a lock's two faces the right way round", () => {
    const seeded = seedControlFromEntity(fresh(), door, undefined, "Kitchen lamp");
    expect(seeded.title).toEqual(literal("Front door"));
    expect(seeded.symbol).toBe("lock.fill");
    expect(seeded.symbolOff).toBe("lock.open.fill");
  });

  it("leaves no off symbol for a domain whose two faces are one glyph", () => {
    const light = seedControlFromEntity(fresh(), lamp, undefined, "Kitchen lamp");
    expect(light.symbolOff).toBe("lightbulb");
    const seeded = seedControlFromEntity(light,
      { entityId: "switch.desk", displayName: "Desk", domain: "switch" }, lamp, "Kitchen lamp");
    expect(seeded.symbol).toBe("power");
    // A blank off symbol is how the card spells "one symbol on both faces",
    // which is the pair's own answer for a domain with no filled sibling.
    expect(seeded.symbolOff).toBeUndefined();
  });

  it("keeps the symbols it has for a domain the table does not name", () => {
    const seeded = seedControlFromEntity(fresh(), rosie, undefined, "Kitchen lamp");
    expect(seeded.symbol).toBe(CONTROL_DEFAULT_SYMBOL);
    expect(seeded.symbolOff).toBeUndefined();
    // The rest is still worth having: a name and a state are not guesses.
    expect(seeded.title).toEqual(literal("Rosie"));
    expect(seeded.state).toEqual({ kind: { kind: "entityState", entityId: "vacuum.rosie", displayName: "Rosie", domain: "vacuum" } });
  });

  it("never touches a title somebody typed", () => {
    const typed = seedControlFromEntity(fresh({ title: literal("Bedside") }), lamp, undefined, "Kitchen lamp");
    expect(typed.title).toEqual(literal("Bedside"));
    // A template is nobody's default either.
    const template = seedControlFromEntity(fresh({ title: { kind: { kind: "jinja", value: "{{ 1 }}" } } }), lamp, undefined, "Kitchen lamp");
    expect(template.title.kind.kind).toBe("jinja");
    // The rows the author left alone are still filled in.
    expect(typed.symbol).toBe("lightbulb.fill");
  });

  it("replaces the last pick's seed and keeps the hand edits beside it", () => {
    const first = seedControlFromEntity(fresh(), lamp, undefined, "Kitchen lamp");
    const edited: ControlSpec = { ...first, symbolOff: "moon", valueLabel: literal("42 W") };
    const second = seedControlFromEntity(edited, door, lamp, "Kitchen lamp");
    expect(second.title).toEqual(literal("Front door"));
    expect(second.state).toEqual({ kind: { kind: "entityState", entityId: "lock.front", displayName: "Front door", domain: "lock" } });
    expect(second.symbol).toBe("lock.fill");
    // Typed by hand between the two picks, so it stands.
    expect(second.symbolOff).toBe("moon");
    // The value line is never seeded, so it survives either way.
    expect(second.valueLabel).toEqual(literal("42 W"));
  });

  it("gives a scene a name and a symbol and no state at all", () => {
    const button = fresh({ kind: "button", action: { type: "runScene", entityId: "", displayName: "", domain: "scene" } });
    const seeded = seedControlFromEntity(button, { entityId: "scene.movie", displayName: "Movie night", domain: "scene" },
      undefined, "Kitchen lamp");
    expect(seeded.title).toEqual(literal("Movie night"));
    expect(seeded.symbol).toBe("sparkles");
    expect(seeded.symbolOff).toBeUndefined();
    // A scene cannot be off, so there is nothing for a state to read.
    expect(seeded.state).toBeUndefined();
  });

  it("seeds nothing at all when the target is cleared", () => {
    const seeded = seedControlFromEntity(fresh(), lamp, undefined, "Kitchen lamp");
    expect(seedControlFromEntity(seeded, { entityId: "", displayName: "", domain: "" }, lamp)).toEqual(seeded);
  });

  it("returns a new spec rather than editing the one it was handed", () => {
    const before = fresh();
    seedControlFromEntity(before, lamp, undefined, "Kitchen lamp");
    expect(before.title).toEqual(literal("Kitchen lamp"));
    expect(before.symbol).toBe(CONTROL_DEFAULT_SYMBOL);
    expect(before.state).toBeUndefined();
  });
});

describe("the card's Target picker", () => {
  /** The document the card edits, with the control switched on. */
  function document(): CustomComplicationConfig {
    const cfg = newConfig("Kitchen lamp", 0);
    setControlShown(cfg, true);
    return cfg;
  }

  it("seeds the rows under it when the picked entity changes", () => {
    const cfg = document();
    controlTapEdit(cfg, (p) => {
      p.action = { type: "toggleEntity", entityId: "light.kitchen", displayName: "Kitchen lamp", domain: "light" };
    });
    expect(cfg.control!.symbol).toBe("lightbulb.fill");
    expect(cfg.control!.state).toEqual({ kind: { kind: "entityState", entityId: "light.kitchen", displayName: "Kitchen lamp", domain: "light" } });
  });

  it("seeds from a service call's target too", () => {
    const cfg = document();
    controlTapEdit(cfg, (p) => {
      p.action = { type: "callService", serviceDomain: "lock", serviceName: "open", target: { entityId: "lock.front", displayName: "Front door", domain: "lock" } };
    });
    expect(cfg.control!.title).toEqual(literal("Front door"));
    expect(cfg.control!.symbol).toBe("lock.fill");
  });

  it("leaves everything alone when the edit is not a new entity", () => {
    const cfg = document();
    controlTapEdit(cfg, (p) => {
      p.action = { type: "toggleEntity", entityId: "light.kitchen", displayName: "Kitchen lamp", domain: "light" };
    });
    cfg.control!.title = literal("Bedside");
    // The same entity under a new action type: the target carried over, so
    // there is nothing to seed and nothing to overwrite.
    controlTapEdit(cfg, (p) => {
      p.action = { type: "runScript", entityId: "light.kitchen", displayName: "Kitchen lamp", domain: "light" };
    });
    expect(cfg.control!.title).toEqual(literal("Bedside"));
    // Clearing the row seeds nothing either.
    controlTapEdit(cfg, (p) => {
      p.action = { type: "toggleEntity", entityId: "", displayName: "", domain: "" };
    });
    expect(cfg.control!.symbol).toBe("lightbulb.fill");
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

  it("drops the picked complications of a refresh tap on a share, keeping all placed", () => {
    const picked = withControl();
    picked.tapAction = { type: "refreshAll", targets: ["AAAA", "BBBB"] };
    const sharedPicked = scrubForShare(picked, shareSlots(picked, new Set(["light", "sensor"])));
    expect(sharedPicked.tapAction).toEqual({ type: "refreshAll" });

    const all = withControl();
    all.tapAction = { type: "refreshAll", allPlaced: true };
    const sharedAll = scrubForShare(all, shareSlots(all, new Set(["light", "sensor"])));
    expect(sharedAll.tapAction).toEqual({ type: "refreshAll", allPlaced: true });
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

  it("is nothing at all on a document with no control", () => {
    // The card cannot make a control any more, so a document without one has
    // no card: "+ Control Center" in the shape bar is the way in. The panel
    // draws the card on the control's tab only, and that tab exists only while
    // there is a control, so this is the same rule twice over.
    expect(controlCard(host(newConfig("Lamp", 0)))).toBe(nothing);
  });

  it("starts at Kind, with no switch to turn the control off", () => {
    const cfg = newConfig("Lamp", 0);
    setControlShown(cfg, true);
    const markup = flatten(controlCard(host(cfg)));
    expect(markup).not.toContain("Show in Control Center");
    expect(markup).not.toContain("A control is an extra, never a mode");
    // The first hint still says how fresh the reading is, and the first row is
    // Kind. Never the word live: the control is exactly as fresh as the last
    // pull.
    expect(markup).toContain("Shows the last synced value.");
    expect(markup.indexOf("Shows the last synced value.")).toBeLessThan(markup.indexOf("Kind"));
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
    for (const label of ["Kind", "Value line", "State",
      "Symbol", "Symbol when off", "Color", "Tint", "Status text", "On press", "Target"]) {
      expect(markup, label).toContain(label);
    }
    // The action row is a press in Control Center, never a tap on a face.
    expect(markup).not.toContain("Tap action");
    // The title row is really there: it is editing the document's own name.
    expect(markup).toContain("Lamp");
  });

  it("asks for the entity before the rows the entity fills in", () => {
    const cfg = newConfig("Lamp", 0);
    cfg.tapAction = { type: "toggleEntity", entityId: "light.kitchen", displayName: "Kitchen", domain: "light" };
    setControlShown(cfg, true);
    cfg.control!.valueLabel = literal("42 W");
    cfg.control!.state = literal("on");
    cfg.control!.status = literal("Done");
    const markup = flatten(controlCard(host(cfg)));
    // Kind, then the action and its target, then everything the target seeds.
    // Title, Value line, State and Status text are `valueEditor` rows whose
    // own title line goes with the chip outside a browser, so each is found
    // by the switch or the hint that introduces it.
    // Each row is found by a string only it has: "State" is also a piece of
    // the Target row's `entityState` chip, and "Color" a piece of a color
    // attribute, so those two are looked for by their hints.
    const order = ["Kind", "On press", "Target",
      "The name on the tile", "Value line", "What the toggle reads", "Symbol",
      "Symbol when off", "One color paints the tint", "Tint", "Status text"];
    const at = order.map((label) => markup.indexOf(label));
    expect(at.filter((i) => i < 0), order.filter((_, i) => at[i]! < 0).join(", ")).toEqual([]);
    expect(at, order.join(" < ")).toEqual([...at].sort((a, b) => a - b));
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

  it("says nothing about switching a control-only document's control off", () => {
    // That sentence went with the switch. What is left is the tab's disabled
    // x, whose own title says to delete the whole complication instead, and
    // the mutation behind it still refuses the change.
    const cfg = newControlConfig("Lamp", 0);
    const markup = flatten(controlCard(host(cfg)));
    expect(markup).not.toContain("Add a shape first");
    expect(canRemoveControl(cfg)).toBe(false);
    setControlShown(cfg, false);
    expect(cfg.control).toBeDefined();
  });

  it("offers only the actions a control may run", () => {
    const cfg = newConfig("Lamp", 0);
    setControlShown(cfg, true);
    const markup = flatten(controlCard(host(cfg)));
    expect(markup).toContain("Toggle an entity");
    expect(markup).toContain("Run a scene");
    expect(markup).not.toContain("Open a watch app page");
    expect(markup).not.toContain("Add a to-do");
  });
});

describe("the New dialog's Control Center tile", () => {
  it("makes a document that is nothing but the control", () => {
    const cfg = newControlConfig("Kitchen lamp", 4);
    expect(cfg.name).toBe("Kitchen lamp");
    expect(cfg.slotIndex).toBe(4);
    expect(cfg.supportedFamilies).toEqual([]);
    expect(cfg.perFamily).toEqual({});
    expect(cfg.inline).toBeUndefined();
    expect(cfg.control).toBeDefined();
    expect(cfg.control?.kind).toBe("toggle");
    expect(cfg.control?.title).toEqual(literal("Kitchen lamp"));
  });

  it("keeps a shape the author picked beside the tile", () => {
    const cfg = newControlConfig("Kitchen lamp", 4, "medium");
    expect(cfg.supportedFamilies).toEqual(["medium"]);
    expect(cfg.control).toBeDefined();
  });

  it("is otherwise the same document the plain path makes", () => {
    const plain = newConfig("Kitchen lamp", 4, "circular");
    const withControl = newControlConfig("Kitchen lamp", 4, "circular");
    const { control: _control, id: _a, ...rest } = withControl;
    const { id: _b, ...plainRest } = plain;
    expect(rest).toEqual(plainRest);
  });
});

// ── a control that stands alone ──────────────────────────────────────────
//
// `supportedFamilies` may be empty if and only if there is a control (decided
// 2026-09-15). One helper says so and everything else reads it, so these tests
// are the rule itself rather than a sample of the places it is applied.

describe("the empty shape set", () => {
  it("is allowed only by a control", () => {
    expect(shapesRequired(newConfig("Lamp", 0))).toBe(true);
    expect(shapesRequired(newControlConfig("Lamp", 0))).toBe(false);
  });

  it("reads as control-only when there is a control and no shape", () => {
    expect(controlOnly(newControlConfig("Lamp", 0))).toBe(true);
    // A control beside a shape is an extra, not a mode.
    expect(controlOnly(newControlConfig("Lamp", 0, "circular"))).toBe(false);
    expect(controlOnly(newConfig("Lamp", 0, null))).toBe(false);
  });

  it("lets the last shape go when there is a control, and not otherwise", () => {
    const plain = newConfig("Lamp", 0, "circular");
    expect(canRemoveFamily(plain, "circular")).toBe(false);
    const withControl = newControlConfig("Lamp", 0, "circular");
    expect(canRemoveFamily(withControl, "circular")).toBe(true);
    // A shape the document does not have is still not removable either way.
    expect(canRemoveFamily(withControl, "medium")).toBe(false);
  });

  it("empties the set through removeFamily, layers and layout included", () => {
    const cfg = newControlConfig("Lamp", 0, "circular");
    removeFamily(cfg, "circular");
    expect(cfg.supportedFamilies).toEqual([]);
    expect(cfg.perFamily.circular).toBeUndefined();
    expect(cfg.control).toBeDefined();
  });

  it("keeps two shapes removable one after the other, down to none", () => {
    const cfg = newControlConfig("Lamp", 0, "circular");
    addFamily(cfg, "rectangular");
    removeFamily(cfg, "rectangular");
    removeFamily(cfg, "circular");
    expect(cfg.supportedFamilies).toEqual([]);
  });

  it("refuses to switch the control off while it is all the document is", () => {
    const cfg = newControlConfig("Lamp", 0);
    setControlShown(cfg, false);
    expect(cfg.control, "the switch cannot empty a document").toBeDefined();
    // With a shape to fall back on it clears the key as it always did.
    addFamily(cfg, "circular");
    setControlShown(cfg, false);
    expect(cfg.control).toBeUndefined();
  });

  it("round trips through the wire with the key order untouched", () => {
    const cfg = newControlConfig("Kitchen lamp", 6);
    const once = encodeConfig(cfg);
    const twice = encodeConfig(parseConfig(once));
    expect(JSON.stringify(twice)).toBe(JSON.stringify(once));
    const raw = once as Record<string, unknown>;
    expect(raw.supportedFamilies).toEqual([]);
    expect(raw.perFamily).toEqual([]);
    expect(raw.control).toBeDefined();
    expect(auditUnknownKeys(raw)).toEqual([]);
  });

  it("parses a stored document that names no shape", () => {
    const raw = encodeConfig(newControlConfig("Kitchen lamp", 6));
    const parsed = parseConfig(JSON.parse(JSON.stringify(raw)));
    expect(parsed.supportedFamilies).toEqual([]);
    expect(parsed.perFamily).toEqual({});
    expect(parsed.control?.symbol).toBe(CONTROL_DEFAULT_SYMBOL);
  });
});

describe("the Complication card on the control's tab", () => {
  it("is the name alone: refresh, the tap action and the flash are the shapes'", () => {
    const cfg = newControlConfig("Kitchen lamp", 0);
    const markup = flatten(generalEditor(host(cfg), { nameOnly: true }));
    expect(markup).toContain("Name");
    expect(markup).not.toContain("Refresh");
    expect(markup).not.toContain("Tap action");
    expect(markup).not.toContain("Flash");
  });

  it("is every row again on a shape's tab", () => {
    const cfg = newControlConfig("Kitchen lamp", 0, "circular");
    const markup = flatten(generalEditor(host(cfg)));
    for (const label of ["Name", "Auto refresh timer", "Tap action", "Flash"]) {
      expect(markup, label).toContain(label);
    }
  });
});

describe("the redraw budget hint under a refresh tap", () => {
  const target = "0A0A0A0A-0000-4000-8000-000000000001";
  const doc = (refreshMinutes: number) => ({ id: target, name: "Hall", layers: () => [], refreshMinutes });

  const timerLine = "spends the\n        same budget";

  it("is always amber on a multiple refresh, and names a timer that drains it", () => {
    const cfg = newControlConfig("Kitchen lamp", 0, "circular");
    cfg.tapAction = { type: "refreshAll", targets: [target] };
    const quiet = flatten(generalEditor(host(cfg, { documents: [doc(0)] })));
    expect(quiet).toContain("hint keep budget\">watchOS gives each complication");
    expect(quiet).not.toContain(timerLine);

    const picked = flatten(generalEditor(host(cfg, { documents: [doc(15)] })));
    expect(picked, "a timer on a picked complication").toContain(timerLine);

    cfg.refreshMinutes = 30;
    const own = flatten(generalEditor(host(cfg, { documents: [doc(0)] })));
    expect(own, "a timer on the tapped complication").toContain(timerLine);
  });

  it("ignores a timer on a complication the tap does not reach", () => {
    const cfg = newControlConfig("Kitchen lamp", 0, "circular");
    cfg.tapAction = { type: "refreshAll" };
    const markup = flatten(generalEditor(host(cfg, { documents: [doc(15)] })));
    expect(markup).not.toContain(timerLine);
  });

  it("says a plain refresh tap is free, in plain ink", () => {
    const cfg = newControlConfig("Kitchen lamp", 0, "circular");
    cfg.tapAction = { type: "refresh" };
    const markup = flatten(generalEditor(host(cfg)));
    expect(markup).toContain("hint keep\">A tap always redraws this");
    expect(markup).not.toContain("hint keep budget");
  });

  it("warns under the Auto refresh timer row once a timer is picked, with this timer's count", () => {
    const cfg = newControlConfig("Kitchen lamp", 0, "circular");
    cfg.tapAction = { type: "refresh" };
    expect(flatten(generalEditor(host(cfg)))).not.toContain("every timed refresh spends one");
    const cases: [number, string][] = [
      [15, "Every 15 minutes is 96 a day, more than the whole budget"],
      [30, "Every 30 minutes is 48 a day, which can use up the whole budget"],
      [60, "Every hour is 24 a day, which fits"],
    ];
    for (const [minutes, line] of cases) {
      cfg.refreshMinutes = minutes;
      const markup = flatten(generalEditor(host(cfg)));
      expect(markup, String(minutes)).toContain(line);
      expect(markup, String(minutes)).toContain("Refresh this complication\" instead");
    }
  });

  it("shows the same amber hint under a tap layer's multiple refresh", () => {
    const cfg = newControlConfig("Kitchen lamp", 0, "circular");
    const holder = { action: { type: "refreshAll" as const, targets: [target] } };
    const markup = flatten(tapActionEditor(host(cfg, { documents: [doc(0)] }), holder, () => {}, "layer"));
    expect(markup).toContain("hint keep budget\">watchOS gives each complication");
  });

  it("marks the multiple refresh row as beta in the picker only", () => {
    const cfg = newControlConfig("Kitchen lamp", 0, "circular");
    expect(flatten(generalEditor(host(cfg)))).toContain("Refresh multiple complications (beta)");
  });
});
