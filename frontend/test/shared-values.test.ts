// Shared values: moving a value into one, giving a layer its own copy back,
// counting who reads one, and deleting one without breaking its readers.

import { describe, expect, it } from "vitest";
import {
  type CustomComplicationConfig,
  type Element as CElement,
  type Value,
  deleteSharedValue,
  literal,
  newConfig,
  newElement,
  newRule,
  shareValue,
  sharedValueUses,
  unsharedCopy,
} from "../src/model.js";

const KITCHEN = { entityId: "light.kitchen", displayName: "Kitchen light", domain: "light" };

function entityState(): Value {
  return { kind: { kind: "entityState", ...KITCHEN } };
}

function textLayer(cfg: CustomComplicationConfig): Extract<CElement, { kind: "text" }> {
  const el = newElement("text");
  if (el.kind !== "text") throw new Error("wrong kind");
  cfg.elements.push(el);
  return el;
}

/** A document with one shared value on the kitchen light, and its reference. */
function withShared(): { cfg: CustomComplicationConfig; ref: Value; id: string } {
  const cfg = newConfig("Test", 0);
  const { named, ref } = shareValue(cfg, entityState(), "Kitchen");
  cfg.values.push(named);
  return { cfg, ref, id: named.id };
}

describe("shareValue", () => {
  it("moves what the value holds and leaves the format on the reference", () => {
    const cfg = newConfig("Test", 0);
    const { named, ref } = shareValue(cfg, { ...entityState(), format: { useEntityUnit: true } }, "Kitchen");
    expect(named.value).toEqual(entityState());
    expect(ref).toEqual({ kind: { kind: "named", id: named.id }, format: { useEntityUnit: true } });
  });

  it("never reuses a name the document already has", () => {
    const { cfg } = withShared();
    expect(shareValue(cfg, literal("x"), "kitchen").named.name).toBe("kitchen 2");
    expect(shareValue(cfg, literal("x"), "  ").named.name).toBe("Value");
  });
});

describe("unsharedCopy", () => {
  it("copies what the shared value holds", () => {
    const { cfg, ref } = withShared();
    expect(unsharedCopy(cfg, ref)).toEqual(entityState());
  });

  it("keeps the reference's format, else takes the shared value's", () => {
    const { cfg, ref, id } = withShared();
    cfg.values[0]!.value.format = { decimals: 1 };
    expect(unsharedCopy(cfg, { ...ref, format: { suffix: " W" } })?.format).toEqual({ suffix: " W" });
    expect(unsharedCopy(cfg, { kind: { kind: "named", id } })?.format).toEqual({ decimals: 1 });
  });

  it("gives nothing for a value that is not shared, or a shared value that is gone", () => {
    const { cfg } = withShared();
    expect(unsharedCopy(cfg, literal("x"))).toBeUndefined();
    expect(unsharedCopy(cfg, { kind: { kind: "named", id: "GONE" } })).toBeUndefined();
  });
});

describe("sharedValueUses", () => {
  it("counts a layer once, however many of its values read it", () => {
    const { cfg, ref, id } = withShared();
    const a = textLayer(cfg);
    a.payload.value = structuredClone(ref);
    const rule = newRule();
    rule.cases[0]!.when.tests[0]!.value = structuredClone(ref);
    a.payload.rules.push(rule);
    textLayer(cfg).payload.value = structuredClone(ref);
    textLayer(cfg);
    expect(sharedValueUses(cfg, id)).toBe(2);
  });

  it("matches ids whatever their case", () => {
    const { cfg, id } = withShared();
    textLayer(cfg).payload.value = { kind: { kind: "named", id: id.toLowerCase() } };
    expect(sharedValueUses(cfg, id)).toBe(1);
  });
});

describe("deleteSharedValue", () => {
  it("gives every reader its own copy, then removes the value", () => {
    const { cfg, ref, id } = withShared();
    const a = textLayer(cfg);
    a.payload.value = { ...structuredClone(ref), format: { useEntityUnit: true } };
    const b = textLayer(cfg);
    b.payload.value = structuredClone(ref);
    deleteSharedValue(cfg, id);
    expect(cfg.values).toEqual([]);
    expect(a.payload.value).toEqual({ ...entityState(), format: { useEntityUnit: true } });
    expect(b.payload.value).toEqual(entityState());
  });

  it("leaves references to other shared values alone", () => {
    const { cfg, ref, id } = withShared();
    const other = shareValue(cfg, literal("on"), "Other");
    cfg.values.push(other.named);
    const a = textLayer(cfg);
    a.payload.value = structuredClone(other.ref);
    textLayer(cfg).payload.value = structuredClone(ref);
    deleteSharedValue(cfg, id);
    expect(cfg.values.map((n) => n.name)).toEqual(["Other"]);
    expect(a.payload.value).toEqual(other.ref);
  });
});
