// Material Design icons on an icon layer.
//
// The document carries the glyph's own SVG path, because the watch has no MDI
// catalogue to look a name up in. The rule about when that path is honoured is
// a port of `resolveIcon` in the app repo
// (`Shared/CustomComplicationRendering.swift`), and the cases here are the ones
// `CustomComplicationRulesTests` uses, so drift between the two fails on both
// sides.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  encodeConfig,
  literal,
  newConfig,
  newElement,
  newRule,
  parseConfig,
  type Element,
  type IconElement,
  type Value,
} from "../src/model.js";
import { renderLayout, type IconProvider } from "../src/renderer.js";
import { resolveAll, type EntityState, type ResolvedLayout } from "../src/resolver.js";
import { searchMdi, symbolIsMissing } from "../src/editors.js";

/** `mdi:flash` as the build script writes it into the bundled catalogue. */
const FLASH = "M7 2v11h3v9l7-12h-4l4-8z";

const noIcons: IconProvider = { render: () => undefined, available: () => false, names: () => undefined };

function flatten(node: unknown): string {
  if (node === undefined || node === null || node === nothing) return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  return String(node);
}

/** One icon layer filling a rectangular face, resolved against one switch. */
function iconLayout(tweak: (p: IconElement) => void, state = "on"): ResolvedLayout {
  const cfg = newConfig("Icon", 0);
  const el = newElement("icon") as Extract<Element, { kind: "icon" }>;
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  tweak(el.payload);
  cfg.elements.push(el);
  const entityStates = new Map<string, EntityState>([
    ["switch.charger", { entityId: "switch.charger", state, domain: "switch", iconName: "powerplug" }],
  ]);
  return resolveAll(cfg, { entityStates, templateResults: new Map(), namedValues: cfg.values }).rectangular!;
}

function iconOf(tweak: (p: IconElement) => void, state = "on") {
  const el = iconLayout(tweak, state).elements.find((e) => e.kind === "icon");
  if (!el || el.kind !== "icon") throw new Error("no icon layer resolved");
  return el;
}

const chargerRef: Value = {
  kind: { kind: "entityState", entityId: "switch.charger", displayName: "Charger", domain: "switch", iconName: "powerplug" },
};

describe("icon path on the wire", () => {
  it("round-trips and stays off the wire when unset", () => {
    const cfg = newConfig("Icon", 0);
    const mdi = newElement("icon") as Extract<Element, { kind: "icon" }>;
    mdi.payload.symbol = literal("mdi:flash");
    mdi.payload.path = FLASH;
    const sf = newElement("icon") as Extract<Element, { kind: "icon" }>;
    cfg.elements.push(mdi, sf);

    const encoded = encodeConfig(cfg) as unknown as { elements: { payload: Record<string, unknown> }[] };
    expect(encoded.elements[0]!.payload.path).toBe(FLASH);
    // An SF Symbol layer writes exactly the bytes it always did, so an old
    // watch build decodes an untouched document unchanged.
    expect("path" in encoded.elements[1]!.payload).toBe(false);

    const back = parseConfig(encoded as unknown as Record<string, unknown>);
    const first = back.elements[0]!;
    const second = back.elements[1]!;
    if (first.kind !== "icon" || second.kind !== "icon") throw new Error("expected two icon layers");
    expect(first.payload.path).toBe(FLASH);
    expect(second.payload.path).toBeUndefined();
  });

  it("treats an empty path in a file as no path at all", () => {
    const cfg = newConfig("Icon", 0);
    cfg.elements.push(newElement("icon") as Extract<Element, { kind: "icon" }>);
    const raw = encodeConfig(cfg) as unknown as { elements: { payload: Record<string, unknown> }[] };
    raw.elements[0]!.payload.path = "";

    const back = parseConfig(raw as unknown as Record<string, unknown>);
    const first = back.elements[0]!;
    if (first.kind !== "icon") throw new Error("expected an icon layer");
    expect(first.payload.path).toBeUndefined();
  });
});

describe("resolveIcon and the path rule", () => {
  it("keeps the path of a literal mdi symbol", () => {
    const icon = iconOf((p) => {
      p.symbol = literal("mdi:flash");
      p.path = FLASH;
    });
    expect(icon.symbol).toBe("mdi:flash");
    expect(icon.path).toBe(FLASH);
  });

  it("drops the path when a rule swaps the icon", () => {
    const icon = iconOf((p) => {
      p.symbol = literal("mdi:flash");
      p.path = FLASH;
      const rule = newRule();
      rule.cases = [];
      rule.otherwise = [{ kind: "setIcon", value: literal("bolt.slash") }];
      p.rules = [rule];
    });
    // The rule names an SF Symbol; the layer's path draws a different glyph.
    expect(icon.symbol).toBe("bolt.slash");
    expect(icon.path).toBeUndefined();
  });

  it("drops the path when the symbol comes from an entity", () => {
    const icon = iconOf((p) => {
      p.symbol = chargerRef;
      p.path = FLASH;
    });
    expect(icon.symbol).toBe("powerplug");
    expect(icon.path).toBeUndefined();
  });

  it("shows the placeholder for an mdi name with no path", () => {
    // Hand-typed and unknown to the panel. A question mark says so; a blank
    // layer would look like a rendering bug.
    const icon = iconOf((p) => { p.symbol = literal("mdi:nonesuch"); });
    expect(icon.symbol).toBe("questionmark.circle");
    expect(icon.path).toBeUndefined();
  });
});

describe("the preview", () => {
  it("draws the document's own path, scaled from 24 units, with no icon pack", () => {
    const layout = iconLayout((p) => {
      p.symbol = literal("mdi:flash");
      p.path = FLASH;
      p.size = 24;
    });
    const svg = flatten(renderLayout(layout, { icons: noIcons }));
    expect(svg).toContain(FLASH);
    // 24 points at the 1.15 calibration is a 27.6 unit box, so 24 units scale
    // by 1.15 as well.
    expect(svg).toContain("scale(1.15)");
  });

  it("falls back to the icon pack when there is no path", () => {
    const layout = iconLayout((p) => { p.symbol = literal("bolt"); });
    const svg = flatten(renderLayout(layout, { icons: noIcons }));
    // No pack and no path: the dashed placeholder box, not an empty layer.
    expect(svg).toContain("stroke-dasharray");
  });
});

describe("the picker", () => {
  const pack = new Set(["bolt", "lightbulb"]);

  it("never calls an mdi name missing, whatever the SF pack says", () => {
    expect(symbolIsMissing("mdi:flash", pack)).toBe(false);
    expect(symbolIsMissing("mdi:nonesuch", pack)).toBe(false);
    expect(symbolIsMissing("nonesuch", pack)).toBe(true);
    expect(symbolIsMissing("bolt", pack)).toBe(false);
  });

  it("says nothing about any name until a pack has loaded", () => {
    expect(symbolIsMissing("nonesuch", new Set())).toBe(false);
    expect(symbolIsMissing("   ", pack)).toBe(false);
  });

  const names = ["mdi:flash", "mdi:flash-alert", "mdi:lightbulb", "mdi:power-plug"];

  it("searches mdi names without the prefix getting in the way", () => {
    expect(searchMdi(names, "flash")).toEqual(["mdi:flash", "mdi:flash-alert"]);
    expect(searchMdi(names, "plug")).toEqual(["mdi:power-plug"]);
  });

  it("accepts a query that already carries the prefix", () => {
    expect(searchMdi(names, "mdi:flash")).toEqual(["mdi:flash", "mdi:flash-alert"]);
  });

  it("returns the whole list for an empty query, in the order given", () => {
    expect(searchMdi(names, "  ")).toEqual(names);
  });
});
