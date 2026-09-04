// The entity a layer is about. Nothing stores it, so the whole contract is
// read-back: what the editor shows in the Entity field, and what setting that
// field is allowed to rewrite.

import { describe, expect, it } from "vitest";
import {
  type CustomComplicationConfig,
  type Element as CElement,
  type TapElement,
  attachTap,
  attachedTapsOf,
  layerEntity,
  layerEntityUses,
  literal,
  newConfig,
  newElement,
  newId,
  newRule,
  setLayerEntity,
  valueEntity,
} from "../src/model.js";
import { layerEntityNote } from "../src/editors.js";
import { addToggleButton } from "../src/presets.js";

const KITCHEN = { entityId: "light.kitchen", displayName: "Kitchen light", domain: "light" };
const LOUNGE = { entityId: "light.lounge", displayName: "Lounge light", domain: "light" };

function entityState(ref = KITCHEN) {
  return { kind: { kind: "entityState" as const, ...ref } };
}

/** A config with one layer of the given kind, and that layer. */
function withLayer(kind: CElement["kind"]): { cfg: CustomComplicationConfig; el: CElement } {
  const cfg = newConfig("Test", 0);
  const el = newElement(kind);
  cfg.elements.push(el);
  return { cfg, el };
}

describe("valueEntity", () => {
  it("reads an entity straight off a value", () => {
    const cfg = newConfig("Test", 0);
    expect(valueEntity(cfg, entityState())).toEqual({ ref: KITCHEN });
  });

  it("follows a named value and says which one it went through", () => {
    const cfg = newConfig("Test", 0);
    const id = newId();
    cfg.values.push({ id, name: "Kitchen", value: entityState() });
    expect(valueEntity(cfg, { kind: { kind: "named", id } })).toEqual({ ref: KITCHEN, namedId: id });
  });

  it("finds nothing in a literal, a template or an empty reference", () => {
    const cfg = newConfig("Test", 0);
    expect(valueEntity(cfg, literal("Text"))).toBeUndefined();
    expect(valueEntity(cfg, { kind: { kind: "jinja", value: "{{ 1 }}" } })).toBeUndefined();
    expect(valueEntity(cfg, entityState({ entityId: "", displayName: "", domain: "" }))).toBeUndefined();
  });
});

describe("layerEntityUses", () => {
  it("reads a text layer's own value", () => {
    const { cfg, el } = withLayer("text");
    if (el.kind !== "text") throw new Error("wrong kind");
    el.payload.value = entityState();
    expect(layerEntityUses(cfg, el.payload.id)).toEqual([{ where: "value", ref: KITCHEN }]);
    expect(layerEntity(cfg, el.payload.id)).toEqual(KITCHEN);
  });

  it("calls an icon's source its symbol and a camera's its picture", () => {
    const { cfg: a, el: icon } = withLayer("icon");
    if (icon.kind !== "icon") throw new Error("wrong kind");
    icon.payload.symbol = entityState();
    expect(layerEntityUses(a, icon.payload.id)[0]?.where).toBe("symbol");

    const { cfg: b, el: image } = withLayer("image");
    if (image.kind !== "image") throw new Error("wrong kind");
    image.payload.entity = KITCHEN;
    expect(layerEntityUses(b, image.payload.id)[0]?.where).toBe("camera");
  });

  it("finds the entity a layer only names through a tap, which is the icon case", () => {
    const { cfg, el } = withLayer("icon");
    attachTap(cfg, el.payload.id, { type: "toggleEntity", ...KITCHEN });
    const uses = layerEntityUses(cfg, el.payload.id);
    expect(uses.map((u) => u.where)).toEqual(["tap"]);
    expect(layerEntity(cfg, el.payload.id)).toEqual(KITCHEN);
  });

  it("finds the entity in a rule test, and locates it well enough to rewrite", () => {
    const { cfg, el } = withLayer("shape");
    const rule = newRule();
    rule.cases[0]!.when.tests[0]!.value = entityState();
    el.payload.rules = [rule];
    const use = layerEntityUses(cfg, el.payload.id)[0]!;
    expect(use.where).toBe("test");
    expect(use.ruleId).toBe(rule.id);
    expect(use.caseId).toBe(rule.cases[0]!.id);
    expect(use.testId).toBe(rule.cases[0]!.when.tests[0]!.id);
  });

  it("lists the layer's own content before its tap and its tests", () => {
    const cfg = newConfig("Test", 0);
    const id = addToggleButton(cfg, KITCHEN, { family: "rectangular" });
    const el = cfg.elements.find((e) => e.payload.id === id)!;
    // A preset's icon draws a fixed symbol, so the entity is in the tap and
    // the on test rather than in the symbol.
    expect(layerEntityUses(cfg, id).map((u) => u.where)).toEqual(["tap", "test"]);
    expect(layerEntity(cfg, id)).toEqual(KITCHEN);
    expect(el.payload.rules).toHaveLength(1);
  });

  it("has nothing to say about a layer that reads no entity", () => {
    const { cfg, el } = withLayer("text");
    expect(layerEntityUses(cfg, el.payload.id)).toEqual([]);
    expect(layerEntity(cfg, el.payload.id)).toBeUndefined();
  });

  it("is empty for a layer that is not there", () => {
    expect(layerEntityUses(newConfig("Test", 0), newId())).toEqual([]);
  });
});

describe("setLayerEntity", () => {
  it("retargets a text layer's value and keeps its formatting", () => {
    const { cfg, el } = withLayer("text");
    if (el.kind !== "text") throw new Error("wrong kind");
    el.payload.value = { ...entityState(), format: { useEntityUnit: true } };
    setLayerEntity(cfg, el.payload.id, LOUNGE);
    expect(el.payload.value.kind).toEqual({ kind: "entityState", ...LOUNGE });
    expect(el.payload.value.format).toEqual({ useEntityUnit: true });
  });

  it("keeps an attribute layer an attribute layer", () => {
    const { cfg, el } = withLayer("text");
    if (el.kind !== "text") throw new Error("wrong kind");
    el.payload.value = { kind: { kind: "entityAttribute", ...KITCHEN, attribute: "brightness" } };
    setLayerEntity(cfg, el.payload.id, LOUNGE);
    expect(el.payload.value.kind).toEqual({ kind: "entityAttribute", ...LOUNGE, attribute: "brightness" });
  });

  it("replaces the placeholder literal a blank text layer starts with", () => {
    const { cfg, el } = withLayer("text");
    setLayerEntity(cfg, el.payload.id, KITCHEN);
    if (el.kind !== "text") throw new Error("wrong kind");
    expect(el.payload.value.kind).toEqual({ kind: "entityState", ...KITCHEN });
  });

  it("never overwrites a template somebody typed", () => {
    const { cfg, el } = withLayer("text");
    if (el.kind !== "text") throw new Error("wrong kind");
    const template = { kind: { kind: "jinja" as const, value: "{{ states('sensor.a') }}" } };
    el.payload.value = template;
    setLayerEntity(cfg, el.payload.id, KITCHEN);
    expect(el.payload.value).toEqual(template);
  });

  it("never overwrites an icon's chosen symbol", () => {
    const { cfg, el } = withLayer("icon");
    if (el.kind !== "icon") throw new Error("wrong kind");
    setLayerEntity(cfg, el.payload.id, KITCHEN);
    expect(el.payload.symbol).toEqual(literal("lightbulb"));
  });

  it("does retarget an icon that was already reading an entity", () => {
    const { cfg, el } = withLayer("icon");
    if (el.kind !== "icon") throw new Error("wrong kind");
    el.payload.symbol = entityState();
    setLayerEntity(cfg, el.payload.id, LOUNGE);
    expect(el.payload.symbol.kind).toEqual({ kind: "entityState", ...LOUNGE });
  });

  it("leaves a named value alone, because other layers read it too", () => {
    const { cfg, el } = withLayer("text");
    if (el.kind !== "text") throw new Error("wrong kind");
    const id = newId();
    cfg.values.push({ id, name: "Kitchen", value: entityState() });
    el.payload.value = { kind: { kind: "named", id } };
    setLayerEntity(cfg, el.payload.id, LOUNGE);
    expect(el.payload.value.kind).toEqual({ kind: "named", id });
    expect(cfg.values[0]!.value).toEqual(entityState());
  });

  it("points a camera layer at the new camera", () => {
    const { cfg, el } = withLayer("image");
    const porch = { entityId: "camera.porch", displayName: "Porch", domain: "camera" };
    setLayerEntity(cfg, el.payload.id, porch);
    if (el.kind !== "image") throw new Error("wrong kind");
    expect(el.payload.entity).toEqual(porch);
  });

  it("retargets the tap attached to the layer", () => {
    const cfg = newConfig("Test", 0);
    const id = addToggleButton(cfg, KITCHEN, { family: "rectangular" });
    setLayerEntity(cfg, id, LOUNGE);
    const tap = attachedTapsOf(cfg, id)[0]!.payload as TapElement;
    expect(tap.action).toEqual({ type: "toggleEntity", ...LOUNGE });
  });

  it("leaves a tap that does not target an entity as it is", () => {
    const { cfg, el } = withLayer("icon");
    attachTap(cfg, el.payload.id, { type: "refresh" });
    setLayerEntity(cfg, el.payload.id, KITCHEN);
    expect((attachedTapsOf(cfg, el.payload.id)[0]!.payload as TapElement).action).toEqual({ type: "refresh" });
  });

  it("leaves rule tests to the states table", () => {
    const cfg = newConfig("Test", 0);
    const id = addToggleButton(cfg, KITCHEN, { family: "rectangular" });
    setLayerEntity(cfg, id, LOUNGE);
    const el = cfg.elements.find((e) => e.payload.id === id)!;
    expect(el.payload.rules[0]!.cases[0]!.when.tests[0]!.value.kind).toEqual({ kind: "entityState", ...KITCHEN });
  });

  it("fills in the domain when the caller left it out", () => {
    const { cfg, el } = withLayer("text");
    setLayerEntity(cfg, el.payload.id, { entityId: "sensor.porch", displayName: "Porch", domain: "" });
    if (el.kind !== "text") throw new Error("wrong kind");
    expect(el.payload.value.kind).toEqual({ kind: "entityState", entityId: "sensor.porch", displayName: "Porch", domain: "sensor" });
  });

  it("ignores an emptied field rather than blanking the layer", () => {
    const { cfg, el } = withLayer("text");
    if (el.kind !== "text") throw new Error("wrong kind");
    el.payload.value = entityState();
    setLayerEntity(cfg, el.payload.id, { entityId: "", displayName: "", domain: "" });
    expect(el.payload.value).toEqual(entityState());
  });

  it("does nothing at all for a layer that is not there", () => {
    const cfg = newConfig("Test", 0);
    const before = JSON.stringify(cfg);
    setLayerEntity(cfg, newId(), KITCHEN);
    expect(JSON.stringify(cfg)).toBe(before);
  });
});

describe("layerEntityNote", () => {
  it("says where the entity actually landed", () => {
    const cfg = newConfig("Test", 0);
    const id = addToggleButton(cfg, KITCHEN, { family: "rectangular" });
    const el = cfg.elements.find((e) => e.payload.id === id)!;
    const note = layerEntityNote(el, layerEntityUses(cfg, id));
    expect(note).toContain("the tap");
    expect(note).toContain("1 state test");
    expect(note).toContain("symbol above is a fixed name");
  });

  it("tells a blank layer what choosing an entity will do", () => {
    const { cfg, el } = withLayer("text");
    expect(layerEntityNote(el, layerEntityUses(cfg, el.payload.id))).toContain("Nothing on this layer reads an entity yet");
  });

  it("sends a named value back to the card that owns it", () => {
    const { cfg, el } = withLayer("text");
    if (el.kind !== "text") throw new Error("wrong kind");
    const id = newId();
    cfg.values.push({ id, name: "Kitchen", value: entityState() });
    el.payload.value = { kind: { kind: "named", id } };
    expect(layerEntityNote(el, layerEntityUses(cfg, el.payload.id))).toContain("Data card");
  });

  it("explains a shape, which has no value of its own", () => {
    const { cfg, el } = withLayer("shape");
    expect(layerEntityNote(el, layerEntityUses(cfg, el.payload.id))).toContain("Tappable");
  });
});
