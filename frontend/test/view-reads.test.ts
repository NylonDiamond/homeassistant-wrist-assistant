// The row of live values under the preview shows what the open view reads and
// nothing else: a shape's own layers, or the Control Center control. This is
// the pure function behind that, so the Control Center tab can never again
// list the rectangular layers' entities under a tile that reads none of them.

import { describe, expect, it } from "vitest";
import {
  type CustomComplicationConfig,
  type Value,
  legacyConfig,
  newConfig,
  newElement,
  newId,
  setControlShown,
  viewReads,
} from "../src/model.js";

function reads(id: string): Value {
  const domain = id.split(".")[0] ?? "";
  return { kind: { kind: "entityState", entityId: id, displayName: id, domain } };
}

/** A rectangular document: one text layer on a sensor, one control on a light. */
function document(): CustomComplicationConfig {
  const cfg = newConfig("Chart", 0, "rectangular");
  const text = newElement("text");
  if (text.kind === "text") text.payload.value = reads("sensor.voltage");
  cfg.elements.push(text);
  setControlShown(cfg, true);
  cfg.control!.title = reads("light.office");
  cfg.control!.action = { type: "toggleEntity", entityId: "switch.plug", displayName: "Plug", domain: "switch" };
  return cfg;
}

describe("what one view reads", () => {
  it("gives the control its own values and action, and none of the layers' entities", () => {
    const { entityIds } = viewReads(document(), { kind: "control" });
    expect(entityIds).toEqual(["light.office", "switch.plug"]);
  });

  it("gives a shape its layers' entities, and nothing the control reads", () => {
    const { entityIds } = viewReads(document(), { kind: "family", family: "rectangular" });
    expect(entityIds).toEqual(["sensor.voltage"]);
  });

  it("counts a shared value for the view that points at it, and the entity behind it", () => {
    const cfg = document();
    const shared = { id: newId(), name: "Power", value: reads("sensor.power") };
    cfg.values.push(shared);
    cfg.control!.valueLabel = { kind: { kind: "named", id: shared.id } };
    const control = viewReads(cfg, { kind: "control" });
    expect(control.namedIds).toEqual([shared.id]);
    // Shared values are walked first, so the entity behind one leads.
    expect(control.entityIds).toEqual(["sensor.power", "light.office", "switch.plug"]);
    const shape = viewReads(cfg, { kind: "family", family: "rectangular" });
    expect(shape.namedIds).toEqual([]);
    expect(shape.entityIds).toEqual(["sensor.voltage"]);
  });

  it("follows a shared value that reads another shared value", () => {
    const cfg = document();
    const inner = { id: newId(), name: "Inner", value: reads("sensor.inner") };
    const outer = { id: newId(), name: "Outer", value: { kind: { kind: "named" as const, id: inner.id } } };
    // Backwards in document order on purpose, so one pass is not enough.
    cfg.values.push(outer, inner);
    cfg.control!.valueLabel = { kind: { kind: "named", id: outer.id } };
    const { entityIds, namedIds } = viewReads(cfg, { kind: "control" });
    expect(namedIds).toEqual([outer.id, inner.id]);
    expect(entityIds).toContain("sensor.inner");
  });

  it("leaves out a layer the shape hides, and lists it for one that draws it", () => {
    const cfg = legacyConfig("Two", 0, ["rectangular", "circular"]);
    const text = newElement("text");
    if (text.kind === "text") text.payload.value = reads("sensor.a");
    cfg.elements.push(text);
    for (const family of ["rectangular", "circular"] as const) {
      cfg.perFamily[family] = {
        ...cfg.perFamily[family]!,
        placements: { [text.payload.id]: { ...cfg.perFamily[family]!.placements[text.payload.id], isHidden: family === "circular" } },
      } as typeof cfg.perFamily[typeof family];
    }
    expect(viewReads(cfg, { kind: "family", family: "rectangular" }).entityIds).toEqual(["sensor.a"]);
    expect(viewReads(cfg, { kind: "family", family: "circular" }).entityIds).toEqual([]);
  });
});
