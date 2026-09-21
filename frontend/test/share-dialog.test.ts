// The Share, gallery and Import dialogs point at an entity or a name and pick
// out the layers that use it. Two questions sit under that: which layers use
// it, and where each one is drawn. Both are answered here without a browser.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  type CustomComplicationConfig,
  type TapElement,
  entityLayerIds,
  newConfig,
  newElement,
  newId,
  sharedValueLayerIds,
} from "../src/model.js";
import { CANVAS, renderLayout, spotlightBoxes, type IconProvider } from "../src/renderer.js";
import { frameBox, resolveAll, type ResolvedLayout } from "../src/resolver.js";

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

const reads = (entityId: string) => ({ kind: { kind: "entityState" as const, entityId, displayName: "", domain: entityId.split(".")[0]! } });

function rectangular(cfg: CustomComplicationConfig): ResolvedLayout {
  return resolveAll(cfg, { entityStates: new Map(), templateResults: new Map(), namedValues: cfg.values }).rectangular!;
}

describe("entityLayerIds", () => {
  it("finds the layers reading an entity, in document order", () => {
    const cfg = newConfig("Test", 0);
    const a = newElement("text");
    const b = newElement("gauge");
    const c = newElement("text");
    if (a.kind === "text") a.payload.value = reads("sensor.power");
    if (b.kind === "gauge") b.payload.value = reads("sensor.other");
    if (c.kind === "text") c.payload.value = reads("sensor.power");
    cfg.elements.push(a, b, c);
    expect(entityLayerIds(cfg, "sensor.power")).toEqual([a.payload.id, c.payload.id]);
    expect(entityLayerIds(cfg, "sensor.nothing")).toEqual([]);
  });

  it("counts a layer that reads it through a shared value, however deep", () => {
    const cfg = newConfig("Test", 0);
    const inner = { id: newId(), name: "Power", value: reads("sensor.power") };
    const outer = { id: newId(), name: "Power again", value: { kind: { kind: "named" as const, id: inner.id } } };
    cfg.values.push(inner, outer);
    const direct = newElement("text");
    const nested = newElement("text");
    if (direct.kind === "text") direct.payload.value = { kind: { kind: "named", id: inner.id } };
    if (nested.kind === "text") nested.payload.value = { kind: { kind: "named", id: outer.id } };
    cfg.elements.push(direct, nested);
    expect(entityLayerIds(cfg, "sensor.power")).toEqual([direct.payload.id, nested.payload.id]);
    expect(sharedValueLayerIds(cfg, inner.id)).toEqual([direct.payload.id, nested.payload.id]);
    expect(sharedValueLayerIds(cfg, outer.id)).toEqual([nested.payload.id]);
  });

  it("gives an attached tap's entity to the layer it belongs to", () => {
    const cfg = newConfig("Test", 0);
    const icon = newElement("icon");
    const tap = newElement("tap");
    const payload = tap.payload as TapElement;
    payload.attachedTo = icon.payload.id;
    payload.action = { type: "toggleEntity", entityId: "light.porch", displayName: "", domain: "light" };
    cfg.elements.push(icon, tap);
    expect(entityLayerIds(cfg, "light.porch")).toEqual([icon.payload.id]);
  });

  it("counts a layer in a group like any other", () => {
    const cfg = newConfig("Test", 0);
    const group = { id: newId(), name: "Porch", locked: false };
    cfg.groups = [group];
    const member = newElement("text");
    member.payload.groupId = group.id;
    if (member.kind === "text") member.payload.value = reads("sensor.power");
    cfg.elements.push(member);
    expect(entityLayerIds(cfg, "sensor.power")).toEqual([member.payload.id]);
  });

  it("reads quoted ids in templates only when the gate lets them through", () => {
    const cfg = newConfig("Test", 0);
    const text = newElement("text");
    if (text.kind === "text") text.payload.value = { kind: { kind: "jinja", value: "{{ states('sensor.power') }}" } };
    cfg.elements.push(text);
    expect(entityLayerIds(cfg, "sensor.power")).toEqual([]);
    expect(entityLayerIds(cfg, "sensor.power", (_id, domain) => domain === "sensor")).toEqual([text.payload.id]);
    expect(entityLayerIds(cfg, "sensor.power", () => false)).toEqual([]);
  });
});

describe("spotlight", () => {
  function twoLayers() {
    const cfg = newConfig("Test", 0, "rectangular");
    const left = newElement("text");
    left.payload.frame = { x: 0, y: 0.5, width: 0.3, height: 0.3, rotationDegrees: 0 };
    const right = newElement("shape");
    right.payload.frame = { x: 0.6, y: 0.1, width: 0.3, height: 0.5, rotationDegrees: 30 };
    cfg.elements.push(left, right);
    return { cfg, left: left.payload.id, right: right.payload.id };
  }

  it("cuts a hole on each named layer's box, turned as the layer is", () => {
    const { cfg, left, right } = twoLayers();
    const layout = rectangular(cfg);
    const boxes = spotlightBoxes(layout.elements, CANVAS.rectangular, [left, right]);
    expect(boxes).toHaveLength(2);
    const leftEl = layout.elements.find((el) => el.id === left)!;
    const frame = frameBox(leftEl, CANVAS.rectangular);
    expect(boxes[0]!.box).toMatchObject({ x: frame.x, y: frame.y, w: frame.w, h: frame.h });
    expect(boxes[0]!.rotation).toBe(0);
    expect(boxes[1]!.rotation).toBe(30);
  });

  it("skips layers the shape does not draw", () => {
    const { cfg, left } = twoLayers();
    const layout = rectangular(cfg);
    expect(spotlightBoxes(layout.elements, CANVAS.rectangular, [left, "not-here"])).toHaveLength(1);
  });

  it("draws the veil only when something is picked out", () => {
    const { cfg, left } = twoLayers();
    const layout = rectangular(cfg);
    const plain = flatten(renderLayout(layout, { icons: noIcons }));
    expect(plain).not.toContain("spotlight");
    const lit = flatten(renderLayout(layout, { icons: noIcons, spotlightIds: [left] }));
    expect(lit).toContain("class=\"spotlight\"");
    expect(lit).toContain("<mask");
    expect(lit).toContain("var(--wa-accent");
  });
});
