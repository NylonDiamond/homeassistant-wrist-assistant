// Unit checks for the Swift quirks the port has to reproduce
// (docs/custom_complication_schema_v4.md §6.3, §7.4, §7.5).

import { describe, expect, it } from "vitest";
import { compile, fnv1a64Hex, normaliseScalar, parseValueDocument } from "../src/compiler.js";
import { countdownRemainingString, formatValue, gaugeFraction, leadingNumber, resolveAll, type EntityState } from "../src/resolver.js";
import { newConfig, newElement, parseValue } from "../src/model.js";

describe("fnv1a64Hex", () => {
  it("matches the reference vectors, without zero padding", () => {
    expect(fnv1a64Hex("")).toBe("cbf29ce484222325");
    expect(fnv1a64Hex("a")).toBe("af63dc4c8601ec8c");
    expect(fnv1a64Hex("foobar")).toBe("85944171f73967e8");
  });
});

describe("leadingNumber", () => {
  it("accepts Swift Double syntax first", () => {
    expect(leadingNumber(" 1e3 ")).toBe(1000);
    expect(leadingNumber("+7")).toBe(7);
    expect(leadingNumber("inf")).toBe(Infinity);
  });
  it("skips leading junk and stops at the first non-numeric after a run", () => {
    expect(leadingNumber("$5")).toBe(5);
    expect(leadingNumber("72 %")).toBe(72);
    expect(leadingNumber("21.5°C")).toBe(21.5);
    expect(leadingNumber("abc")).toBeUndefined();
    expect(leadingNumber("1.2.3")).toBeUndefined();
  });
});

describe("formatValue", () => {
  it("returns raw unchanged with an empty format", () => {
    expect(formatValue("75.92", undefined, "°F")).toBe("75.92");
    expect(formatValue("75.92", {}, "°F")).toBe("75.92");
  });
  it("rounds, scales, and appends units without a space for ° and %", () => {
    expect(formatValue("75.92", { decimals: 0, useEntityUnit: true }, "°F")).toBe("76°F");
    expect(formatValue("56", { useEntityUnit: true }, "%")).toBe("56%");
    expect(formatValue("3", { useEntityUnit: true }, "kWh")).toBe("3 kWh");
    expect(formatValue("10", { multiply: 2.5 }, undefined)).toBe("25");
    expect(formatValue("10", { multiply: 0.15 }, undefined)).toBe("1.5");
    expect(formatValue("10", { multiply: 1 }, undefined)).toBe("10");
  });
  it("applies prefix, suffix and text case last", () => {
    expect(formatValue("on", { textCase: "upper", prefix: "is " }, undefined)).toBe("IS ON");
    expect(formatValue("hello world", { textCase: "capitalized" }, undefined)).toBe("Hello World");
  });
  it("formats relative time from a numeric raw value", () => {
    expect(formatValue("45", { relativeTime: true }, undefined)).toBe("45s");
    expect(formatValue("125", { relativeTime: true }, undefined)).toBe("2m");
    expect(formatValue("7200", { relativeTime: true }, undefined)).toBe("2h");
    expect(formatValue("-5", { relativeTime: true }, undefined)).toBe("0s");
  });
  it("leaves non-numeric text alone", () => {
    expect(formatValue("open", { decimals: 1 }, undefined)).toBe("open");
  });
});

describe("gaugeFraction", () => {
  it("clamps and handles a zero span", () => {
    expect(gaugeFraction("56", 0, 100)).toBe(0.56);
    expect(gaugeFraction("150", 0, 100)).toBe(1);
    expect(gaugeFraction("x", 0, 100)).toBe(0);
    expect(gaugeFraction("5", 5, 5)).toBe(0);
    expect(gaugeFraction(undefined, 0, 1)).toBe(0);
  });
});

describe("parseValueDocument", () => {
  it("normalises scalars like the Swift parser", () => {
    const doc = parseValueDocument('{"a": 3.0, "b": true, "c": null, "d": "x", "e": 2.5}')!;
    expect(doc.values.get("a")).toBe("3");
    expect(doc.values.get("b")).toBe("true");
    expect(doc.values.get("d")).toBe("x");
    expect(doc.values.get("e")).toBe("2.5");
    expect(doc.nullKeys.has("c")).toBe(true);
  });
  it("rejects prose and arrays", () => {
    expect(parseValueDocument("hello")).toBeUndefined();
    expect(parseValueDocument("[1]")).toBeUndefined();
    expect(normaliseScalar([1, 2])).toBe("[1,2]");
  });
});

describe("parseValue", () => {
  it("accepts the flat v2 shape and the nested v3 shape", () => {
    expect(parseValue({ kind: "literal", value: "x" })).toEqual({ kind: { kind: "literal", value: "x" } });
    expect(parseValue({ kind: { kind: "literal", value: "x" }, format: {} })).toEqual({ kind: { kind: "literal", value: "x" } });
  });
});

describe("countdown resolution", () => {
  // Same instant the Swift tests pin: 2023-11-14T22:13:20Z.
  const nowMs = 1_700_000_000_000;

  const timerEntity = (state: string, extra: Partial<EntityState> = {}): EntityState => ({
    entityId: "timer.laundry",
    state,
    iconName: "timer",
    domain: "timer",
    timerState: state,
    ...extra,
  });

  const countdownConfig = () => {
    const cfg = newConfig("X", 0);
    const el = newElement("text");
    if (el.kind === "text") {
      el.payload.countdown = true;
      el.payload.value = { kind: { kind: "entityState", entityId: "timer.laundry", displayName: "Laundry", domain: "timer" } };
    }
    cfg.elements = [el];
    return cfg;
  };

  const resolveCountdownText = (s: EntityState) => {
    const layouts = resolveAll(countdownConfig(), {
      entityStates: new Map([["timer.laundry", s]]),
      templateResults: new Map(),
      namedValues: [],
      nowMs,
    });
    const el = layouts.rectangular.elements[0];
    return el?.kind === "text" ? el : undefined;
  };

  it("an active timer yields a live target and 'Idle' fallback text", () => {
    const el = resolveCountdownText(timerEntity("active", { finishesAt: "2023-11-14T22:18:20+00:00" }));
    expect(el?.countdownEnd).toBe(nowMs + 300_000);
    expect(el?.text).toBe("Idle");
  });

  it("a paused timer shows its remaining time", () => {
    expect(resolveCountdownText(timerEntity("paused", { remaining: 270 }))?.text).toBe("4:30");
    expect(resolveCountdownText(timerEntity("paused", { remaining: 3735 }))?.text).toBe("1:02:15");
    expect(resolveCountdownText(timerEntity("paused", { remaining: 270 }))?.countdownEnd).toBeUndefined();
  });

  it("idle and expired timers show 'Idle'", () => {
    expect(resolveCountdownText(timerEntity("idle"))?.text).toBe("Idle");
    const expired = resolveCountdownText(timerEntity("active", { finishesAt: "2023-11-14T22:13:10+00:00" }));
    expect(expired?.countdownEnd).toBeUndefined();
    expect(expired?.text).toBe("Idle");
  });

  it("countdownRemainingString matches the Swift formatting", () => {
    expect(countdownRemainingString(0)).toBe("0:00");
    expect(countdownRemainingString(65)).toBe("1:05");
    expect(countdownRemainingString(3735)).toBe("1:02:15");
  });
});

describe("image resolution", () => {
  const imageConfig = () => {
    const cfg = newConfig("X", 0);
    const el = newElement("image");
    if (el.kind === "image") {
      el.payload.entity = { entityId: "camera.front_door", displayName: "Front Door", domain: "camera" };
      el.payload.timestamp = true;
    }
    cfg.elements = [el];
    return cfg;
  };

  const resolveImage = (states: Map<string, EntityState>) => {
    const layouts = resolveAll(imageConfig(), {
      entityStates: states,
      templateResults: new Map(),
      namedValues: [],
    });
    const el = layouts.rectangular.elements[0];
    return el?.kind === "image" ? el : undefined;
  };

  it("passes the camera's entity_picture through as the preview URL", () => {
    const el = resolveImage(new Map([["camera.front_door", {
      entityId: "camera.front_door",
      state: "idle",
      iconName: "",
      domain: "camera",
      entityPicture: "/api/camera_proxy/camera.front_door?token=abc",
    }]]));
    expect(el?.url).toBe("/api/camera_proxy/camera.front_door?token=abc");
    expect(el?.entityId).toBe("camera.front_door");
    expect(el?.showTimestamp).toBe(true);
  });

  it("has no URL when the entity is unknown, so the placeholder draws", () => {
    const el = resolveImage(new Map());
    expect(el?.url).toBeUndefined();
  });

  it("registers the camera entity with the compiler", () => {
    const compiled = compile(imageConfig());
    expect([...compiled.entities.keys()]).toEqual(["camera.front_door"]);
  });
});
