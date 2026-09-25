// Slots left open after an import: what the dialogs call them, which ones the
// panel fills in by itself, and how the editor finds them again. Asked for
// 2026-09-25, when a Tiny house imported with "Sun 7" unpicked stayed at night
// with nothing saying why.

import { describe, expect, it } from "vitest";
import {
  type CustomComplicationConfig,
  type EntityRef,
  type Value,
  entityLayerIds,
  newConfig,
  newElement,
  newId,
} from "../src/model.js";
import {
  applyEntityMap,
  autoSlotPicks,
  openSlots,
  slotValueIds,
  unresolvedEntities,
} from "../src/transfer.js";

const sun: EntityRef = { entityId: "sun.shared_7", displayName: "Sun 7", domain: "sun" };
const light1: EntityRef = { entityId: "light.shared_1", displayName: "Light 1", domain: "light" };
const light2: EntityRef = { entityId: "light.shared_2", displayName: "Light 2", domain: "light" };

/** A shared copy as the share step writes it: numbered slots, one shared value
 * reading the first light, one text reading the sun. */
function sharedCopy(): { cfg: CustomComplicationConfig; valueId: string } {
  const cfg = newConfig("House", 0, "rectangular");
  const valueId = newId();
  cfg.values = [{ id: valueId, name: "Downstairs left light", value: { kind: { kind: "entityState", ...light1 } } }];
  const a = newElement("text");
  (a.payload as { value: Value }).value = { kind: { kind: "named", id: valueId } };
  const b = newElement("text");
  (b.payload as { value: Value }).value = { kind: { kind: "entityState", ...light2 } };
  const c = newElement("text");
  (c.payload as { value: Value }).value = { kind: { kind: "entityState", ...sun } };
  cfg.elements = [a, b, c];
  return { cfg, valueId };
}

describe("open slot labels", () => {
  it("takes a shared value's name, and drops the number from the only slot of its kind", () => {
    const labels = unresolvedEntities(sharedCopy().cfg, {}).map((r) => [r.entityId, r.label]);
    expect(labels).toEqual([
      ["light.shared_1", "Downstairs left light"],
      ["light.shared_2", "Light 2"],
      ["sun.shared_7", "Sun"],
    ]);
  });

  it("keeps a label the author wrote", () => {
    const { cfg } = sharedCopy();
    const el = cfg.elements[2]!;
    (el.payload as { value: Value }).value = { kind: { kind: "entityState", ...sun, displayName: "The sky" } };
    expect(unresolvedEntities(cfg, {}).find((r) => r.entityId === "sun.shared_7")?.label).toBe("The sky");
  });
});

describe("auto picks", () => {
  it("fills the only slot of a domain when this home has one entity of it", () => {
    const rows = unresolvedEntities(sharedCopy().cfg, {});
    const picks = autoSlotPicks(rows, { "sun.sun": {}, "light.a": {}, "light.b": {} });
    expect([...picks]).toEqual([["sun.shared_7", "sun.sun"]]);
  });

  it("leaves a domain with two slots, even with one entity to give", () => {
    const rows = unresolvedEntities(sharedCopy().cfg, {});
    expect(autoSlotPicks(rows, { "light.a": {} }).size).toBe(0);
  });

  it("leaves a domain this home has nothing of, or several of", () => {
    const rows = unresolvedEntities(sharedCopy().cfg, {});
    expect(autoSlotPicks(rows, {}).size).toBe(0);
    expect(autoSlotPicks(rows, { "sun.sun": {}, "sun.other": {} }).size).toBe(0);
  });
});

describe("open slots in the editor", () => {
  it("finds the shared value that reads a slot", () => {
    const { cfg, valueId } = sharedCopy();
    expect(slotValueIds(cfg, "light.shared_1")).toEqual([valueId.toUpperCase()]);
    expect(slotValueIds(cfg, "sun.shared_7")).toEqual([]);
  });

  it("tells a layer that names a slot from one that reads it through a shared value", () => {
    const { cfg } = sharedCopy();
    const [viaValue, direct] = cfg.elements.map((e) => e.payload.id);
    expect(entityLayerIds(cfg, "light.shared_1")).toEqual([viaValue]);
    expect(entityLayerIds(cfg, "light.shared_1", undefined, false)).toEqual([]);
    expect(entityLayerIds(cfg, "light.shared_2", undefined, false)).toEqual([direct]);
  });

  it("closes a slot once it is picked, in place", () => {
    const { cfg } = sharedCopy();
    expect(openSlots(cfg, {}).map((r) => r.entityId)).toEqual(["light.shared_1", "light.shared_2", "sun.shared_7"]);
    applyEntityMap(cfg, new Map([["sun.shared_7", { entityId: "sun.sun", displayName: "Sun", domain: "sun" }]]));
    expect(openSlots(cfg, { "sun.sun": {} }).map((r) => r.entityId)).toEqual(["light.shared_1", "light.shared_2"]);
  });
});
