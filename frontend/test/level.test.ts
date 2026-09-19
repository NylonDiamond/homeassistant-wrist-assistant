// Fill by value: an icon or a shape drawn twice, all of it in a track color and
// as much of it as the reading fills in its own.
//
// The resolution rules here are ports of the Swift in the app repo
// (`resolveLevel` in `CustomComplicationRendering.swift`), and the cases are the
// ones `CustomComplicationRulesTests` uses, so drift between the two
// implementations fails on both sides.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  type Element,
  type IconElement,
  type Level,
  type ShapeElement,
  type Value,
  auditUnknownKeys,
  defaultLevel,
  encodeConfig,
  fadeHex,
  literal,
  newConfig,
  newElement,
  parseConfig,
} from "../src/model.js";
import { deriveDataSources } from "../src/compiler.js";
import { levelClipRect, renderLayout, type IconProvider } from "../src/renderer.js";
import { resolveAll, type EntityState, type ResolvedLayout } from "../src/resolver.js";

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

function entityValue(entityId: string): Value {
  return { kind: { kind: "entityState", entityId, displayName: entityId, domain: "sensor" } };
}

/** One layer filling a rectangular face, resolved against the states named. */
function layoutOf(el: Element, states: Record<string, string> = {}): ResolvedLayout {
  const cfg = newConfig("Level", 0);
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  cfg.elements.push(el);
  const entityStates = new Map<string, EntityState>();
  for (const [id, state] of Object.entries(states)) {
    entityStates.set(id, { entityId: id, state, domain: "sensor", iconName: "gauge" });
  }
  return resolveAll(cfg, { entityStates, templateResults: new Map(), namedValues: cfg.values }).rectangular!;
}

function iconWith(level: Level | undefined, colorHex = "#FFFFFF"): Extract<Element, { kind: "icon" }> {
  const el = newElement("icon") as Extract<Element, { kind: "icon" }>;
  el.payload.symbol = literal("battery.100");
  el.payload.colorSlot.baseColorHex = colorHex;
  if (level) el.payload.level = level;
  return el;
}

function shapeWith(level: Level | undefined, kind: ShapeElement["kind"] = "roundedRectangle"): Extract<Element, { kind: "shape" }> {
  const el = newElement("shape") as Extract<Element, { kind: "shape" }>;
  el.payload.kind = kind;
  el.payload.colorSlot.baseColorHex = "#0A84FF";
  if (level) el.payload.level = level;
  return el;
}

/** The settled level of the one layer in a layout. */
function levelOf(el: Element, states: Record<string, string> = {}) {
  const resolved = layoutOf(el, states).elements[0]!;
  if (resolved.kind !== "icon" && resolved.kind !== "shape") throw new Error("not a fillable layer");
  return resolved.level;
}

describe("a level's fraction", () => {
  it("places the reading across its scale and clamps at both ends", () => {
    const at = (state: string, minValue = 0, maxValue = 100) =>
      levelOf(iconWith({ ...defaultLevel(entityValue("sensor.l")), minValue, maxValue }), { "sensor.l": state })?.fraction;
    expect(at("60")).toBe(0.6);
    expect(at("140")).toBe(1);
    expect(at("-20")).toBe(0);
    expect(at("18 °C", 10, 30)).toBe(0.4);
  });

  it("is zero when the reading is missing or is not a number, so only the track draws", () => {
    expect(levelOf(iconWith(defaultLevel(entityValue("sensor.l"))))?.fraction).toBe(0);
    expect(levelOf(iconWith(defaultLevel(entityValue("sensor.l"))), { "sensor.l": "unavailable" })?.fraction).toBe(0);
  });

  it("is zero across a scale with no span, which can place nothing", () => {
    const level = { ...defaultLevel(entityValue("sensor.l")), minValue: 40, maxValue: 40 };
    expect(levelOf(iconWith(level), { "sensor.l": "50" })?.fraction).toBe(0);
  });

  it("takes an end from its entity, then from the typed number", () => {
    const level: Level = { ...defaultLevel(entityValue("sensor.l")), maxSource: entityValue("sensor.limit") };
    expect(levelOf(iconWith(level), { "sensor.l": "40", "sensor.limit": "80" })?.fraction).toBe(0.5);
    // A source that never synced leaves the typed 0...100 in charge.
    expect(levelOf(iconWith(level), { "sensor.l": "40" })?.fraction).toBe(0.4);
  });
});

describe("a level's track color", () => {
  it("is the layer's own color faded, unless the level names one", () => {
    expect(levelOf(iconWith(defaultLevel(literal("50"))))?.trackColorHex).toBe("#FFFFFF40");
    expect(levelOf(iconWith(defaultLevel(literal("50")), "#32D74B80"))?.trackColorHex).toBe("#32D74B20");
    const named: Level = { ...defaultLevel(literal("50")), trackColorHex: "#0A84FF" };
    expect(levelOf(iconWith(named))?.trackColorHex).toBe("#0A84FF");
  });

  it("follows a rule that recolors the layer, so both halves are one color", () => {
    const el = iconWith(defaultLevel(literal("50")));
    el.payload.rules = [{
      id: "R1",
      cases: [{ id: "C1", when: { join: "all", tests: [] }, then: [{ kind: "setColor", value: literal("#FF453A") }] }],
    }];
    expect(levelOf(el)?.trackColorHex).toBe("#FF453A40");
  });

  it("fades only the alpha, and says so the way Swift does", () => {
    expect(fadeHex("#FFFFFF", 0.25)).toBe("#FFFFFF40");
    expect(fadeHex("#32D74B80", 0.25)).toBe("#32D74B20");
    expect(fadeHex("#FFFFFF", 1)).toBe("#FFFFFF");
    expect(fadeHex("#FFFFFF", 0)).toBe("#FFFFFF00");
    expect(fadeHex("", 0.25)).toBe("#FFFFFF40");
  });
});

describe("a line", () => {
  it("drops its level, and every other shape keeps it", () => {
    expect(levelOf(shapeWith(defaultLevel(literal("50")), "line"))).toBeUndefined();
    expect(levelOf(shapeWith(defaultLevel(literal("50")), "capsule"))?.direction).toBe("up");
  });
});

describe("the clip a level draws through", () => {
  const box = { x: 10, y: 20, w: 40, h: 80, cx: 30, cy: 60 };

  it("measures from the edge its direction grows out of", () => {
    // Up fills the bottom of the box: its top edge is the level.
    expect(levelClipRect(box, 0.25, "up").y).toBe(80);
    // Down fills the top, so the level is the rectangle's bottom edge.
    const down = levelClipRect(box, 0.25, "down");
    expect(down.y + down.h).toBe(40);
    // Right fills from the left edge, left from the right one.
    const right = levelClipRect(box, 0.25, "right");
    expect(right.x + right.w).toBe(20);
    expect(levelClipRect(box, 0.25, "left").x).toBe(40);
  });

  it("reaches past the layer on the filled side and across it", () => {
    const r = levelClipRect(box, 0.5, "up");
    expect(r.x).toBeLessThan(box.x);
    expect(r.x + r.w).toBeGreaterThan(box.x + box.w);
    expect(r.y + r.h).toBeGreaterThan(box.y + box.h);
  });

  it("clamps a fraction outside 0 to 1", () => {
    expect(levelClipRect(box, 2, "up").y).toBe(box.y);
    expect(levelClipRect(box, -1, "up").y).toBe(box.y + box.h);
  });
});

describe("drawing a level", () => {
  it("draws a shape twice, the track first and the body clipped", () => {
    const svg = flatten(renderLayout(
      layoutOf(shapeWith(defaultLevel(literal("50")))),
      { icons: noIcons },
    ));
    // The level's own clip, not the face's.
    expect(svg).toContain("url(#lv-");
    // Two bodies in one color at two strengths: the track at a quarter, the
    // filled part whole.
    const strengths = [...svg.matchAll(/fill=#0A84FF fill-opacity=([\d.]+)/g)].map((m) => Number(m[1]));
    expect(strengths.length).toBe(2);
    expect(strengths[0]).toBeCloseTo(0.25, 2);
    expect(strengths[1]).toBe(1);
  });

  it("leaves a layer that fills nothing exactly as it was", () => {
    const svg = flatten(renderLayout(
      layoutOf(shapeWith(undefined)),
      { icons: noIcons },
    ));
    expect(svg).not.toContain("url(#lv-");
  });
});

describe("a level on the wire", () => {
  it("writes only its reading until something is away from its default", () => {
    const cfg = newConfig("Level", 0);
    const el = iconWith(defaultLevel(entityValue("sensor.l")));
    cfg.elements.push(el);
    const plain = (encodeConfig(cfg).elements as { payload: { level: Record<string, unknown> } }[])[0]!;
    expect(Object.keys(plain.payload.level).sort()).toEqual(["value"]);

    (cfg.elements[0]!.payload as IconElement).level = {
      value: entityValue("sensor.l"),
      minValue: 10,
      maxValue: 40,
      minSource: entityValue("sensor.low"),
      maxSource: entityValue("sensor.high"),
      direction: "right",
      trackColorHex: "#0A84FF40",
    };
    const full = (encodeConfig(cfg).elements as { payload: { level: Record<string, unknown> } }[])[0]!;
    expect(Object.keys(full.payload.level).sort()).toEqual(
      ["direction", "maxSource", "maxValue", "minSource", "minValue", "trackColorHex", "value"],
    );
  });

  it("round-trips through parse and encode, on an icon and on a shape", () => {
    const cfg = newConfig("Level", 0);
    cfg.elements.push(iconWith({
      value: entityValue("sensor.l"),
      minValue: 5,
      maxValue: 50,
      direction: "down",
      trackColorHex: "#1C1C1E",
    }));
    cfg.elements.push(shapeWith({ ...defaultLevel(literal("75")), direction: "left" }));
    const encoded = encodeConfig(cfg);
    expect(auditUnknownKeys(encoded)).toEqual([]);
    expect(encodeConfig(parseConfig(encoded))).toEqual(encoded);
  });

  it("reads a direction it does not know as up rather than refusing the layer", () => {
    const cfg = newConfig("Level", 0);
    cfg.elements.push(iconWith(defaultLevel(literal("50"))));
    const encoded = encodeConfig(cfg) as { elements: { payload: { level: Record<string, unknown> } }[] };
    encoded.elements[0]!.payload.level.direction = "diagonal";
    const back = parseConfig(encoded).elements[0]!.payload as IconElement;
    expect(back.level?.direction).toBe("up");
  });
});

describe("a level's entities", () => {
  it("land in dataSources, reading and both ends alike", () => {
    const cfg = newConfig("Level", 0);
    cfg.elements.push(iconWith({
      value: entityValue("sensor.reading"),
      minValue: 0,
      maxValue: 100,
      minSource: entityValue("sensor.low"),
      maxSource: entityValue("sensor.high"),
      direction: "up",
    }));
    cfg.elements.push(shapeWith(defaultLevel(entityValue("sensor.tank"))));
    const ids = deriveDataSources(cfg).flatMap((d) => (d.kind === "entity" ? [d.entityId] : []));
    expect(ids).toEqual(["sensor.high", "sensor.low", "sensor.reading", "sensor.tank"]);
  });
});
