// My parts: cutting a few layers out of a complication and putting them back
// into another one. The two things that have to hold are that a part carries
// the picked layers and nothing else (no stray shared value, no document tap,
// no entity id from the house it was cut in), and that dropping one in twice
// gives two independent copies rather than two readers of one shared value.

import { describe, expect, it } from "vitest";
import {
  type CustomComplicationConfig,
  type Element as CElement,
  type TextElement,
  type Value,
  newConfig,
  newElement,
  shareValue,
} from "../src/model.js";
import { setPlacement } from "../src/editors.js";
import {
  insertPart,
  partFromSelection,
  partText,
  suggestPartName,
} from "../src/parts.js";
import { isPlaceholderId, parseImportText, remapEntities, unresolvedEntities } from "../src/transfer.js";

const MAX_SCHEMA = 8;
const KNOWN = new Set(["light", "sensor"]);

function entityState(entityId: string, displayName: string): Value {
  return { kind: { kind: "entityState", entityId, displayName, domain: entityId.split(".")[0]! } };
}

function textLayer(cfg: CustomComplicationConfig, value: Value): Extract<CElement, { kind: "text" }> {
  const el = newElement("text");
  if (el.kind !== "text") throw new Error("wrong kind");
  el.payload.value = value;
  cfg.elements.push(el);
  setPlacement(cfg, "rectangular", el.payload.id, { isHidden: false });
  return el;
}

/**
 * A document with two layers and two shared values.
 *
 * `kept` reads the kitchen through a shared value; `other` reads the bedroom
 * straight. The second shared value is read by nothing, so it is what proves a
 * part takes only the values its own layers reach.
 */
function document() {
  const cfg = newConfig("Test", 0, "rectangular");
  const kitchen = shareValue(cfg, entityState("light.kitchen", "Kitchen light"), "Kitchen");
  cfg.values.push(kitchen.named);
  const spare = shareValue(cfg, entityState("light.hall", "Hall light"), "Hall");
  cfg.values.push(spare.named);
  const kept = textLayer(cfg, structuredClone(kitchen.ref));
  const other = textLayer(cfg, entityState("light.bedroom", "Bedroom light"));
  cfg.tapAction = { type: "toggleEntity", entityId: "light.porch", displayName: "Porch light", domain: "light" };
  return { cfg, kept, other, kitchen: kitchen.named, spare: spare.named };
}

/** The entity id a text layer's value ends up reading, through one shared
 * value when it reads one. */
function readsEntity(cfg: CustomComplicationConfig, el: CElement): string {
  const value = (el.payload as TextElement).value;
  const kind = value.kind;
  if (kind.kind === "named") {
    const named = cfg.values.find((v) => v.id.toUpperCase() === kind.id.toUpperCase());
    const inner = named?.value.kind;
    return inner && "entityId" in inner ? inner.entityId : "";
  }
  return "entityId" in kind ? kind.entityId : "";
}

describe("partFromSelection", () => {
  it("keeps the picked layers, their shared values, and nothing else", () => {
    const { cfg, kept, kitchen } = document();
    const part = partFromSelection(cfg, [kept.payload.id], "Kitchen line", "rectangular");

    expect(part.elements.map((el) => el.payload.id)).toEqual([kept.payload.id]);
    expect(part.values.map((v) => v.id)).toEqual([kitchen.id]);
    expect(part.name).toBe("Kitchen line");
    // The complication's own settings belong to the complication.
    expect(part.tapAction).toEqual({ type: "none" });
    expect(part.dataSources).toEqual([]);
    expect(part.control).toBeUndefined();
    // Only the shape the layer sits on, with only that layer's placement.
    expect(part.supportedFamilies).toEqual(["rectangular"]);
    expect(Object.keys(part.perFamily.rectangular!.placements)).toEqual([kept.payload.id]);
  });

  it("does not disturb the document it was cut from", () => {
    const { cfg, kept } = document();
    const before = JSON.stringify(cfg);
    partFromSelection(cfg, [kept.payload.id], "Kitchen line", "rectangular");
    expect(JSON.stringify(cfg)).toBe(before);
  });

  it("writes placeholders instead of this home's entity ids", () => {
    const { cfg, kept } = document();
    const part = partFromSelection(cfg, [kept.payload.id], "Kitchen line", "rectangular");
    const text = partText(part, KNOWN);

    expect(text).not.toContain("light.kitchen");
    expect(text).not.toContain("Kitchen light");
    expect(text).toContain("light.shared_1");

    const parse = parseImportText(text, MAX_SCHEMA);
    expect(parse.ok).toBe(true);
    if (!parse.ok) return;
    const rows = unresolvedEntities(parse.config, {});
    expect(rows.map((r) => r.entityId)).toEqual(["light.shared_1"]);
    expect(rows.every((r) => r.required && isPlaceholderId(r.entityId))).toBe(true);
  });

  it("takes both picked layers, with both of the values they read", () => {
    const { cfg, kept, other, kitchen } = document();
    const part = partFromSelection(cfg, [kept.payload.id, other.payload.id], "Both", "rectangular");
    expect(part.elements).toHaveLength(2);
    expect(part.values.map((v) => v.id)).toEqual([kitchen.id]);
    const text = partText(part, KNOWN);
    expect(text).toContain("light.shared_1");
    expect(text).toContain("light.shared_2");
  });
});

describe("insertPart", () => {
  /** One part, as the library would hold it, read back as a document. */
  function savedPart(): CustomComplicationConfig {
    const { cfg, kept } = document();
    const part = partFromSelection(cfg, [kept.payload.id], "Kitchen line", "rectangular");
    const parse = parseImportText(partText(part, KNOWN), MAX_SCHEMA);
    if (!parse.ok) throw new Error(parse.error);
    return parse.config;
  }

  it("lands the layer reading the entity this home picked", () => {
    const part = remapEntities(savedPart(), new Map([
      ["light.shared_1", { entityId: "light.office", displayName: "Office light", domain: "light" }],
    ]));
    const target = newConfig("Target", 0, "rectangular");
    const landed = insertPart(target, part, "rectangular");

    expect(landed).toHaveLength(1);
    expect(target.elements).toHaveLength(1);
    expect(target.values).toHaveLength(1);
    expect(readsEntity(target, target.elements[0]!)).toBe("light.office");
    expect(target.perFamily.rectangular!.placements[landed[0]!]).toBeDefined();
  });

  it("gives the copies fresh ids, so the same part can be added twice", () => {
    const part = savedPart();
    const target = newConfig("Target", 0, "rectangular");
    const first = insertPart(target, structuredClone(part), "rectangular");
    const second = insertPart(target, structuredClone(part), "rectangular");

    expect(first[0]).not.toBe(second[0]);
    expect(target.elements).toHaveLength(2);
    // Two shared values, not one with two readers: editing one copy must not
    // reach the other.
    expect(target.values).toHaveLength(2);
    expect(target.values[0]!.id).not.toBe(target.values[1]!.id);
    expect(target.values[0]!.name).not.toBe(target.values[1]!.name);
    const read = target.elements.map((el) => (el.payload as TextElement).value.kind);
    expect(read[0]).not.toEqual(read[1]);
  });

  it("leaves a placeholder in place when nothing was picked for it", () => {
    const target = newConfig("Target", 0, "rectangular");
    insertPart(target, savedPart(), "rectangular");
    expect(readsEntity(target, target.elements[0]!)).toBe("light.shared_1");
  });

  it("refits onto another shape", () => {
    const part = savedPart();
    const target = newConfig("Target", 0, "circular");
    const landed = insertPart(target, part, "circular");
    expect(target.perFamily.circular!.placements[landed[0]!]).toBeDefined();
    expect(target.perFamily.rectangular?.placements[landed[0]!]).toBeUndefined();
  });
});

describe("suggestPartName", () => {
  it("names a part after the layers it holds", () => {
    expect(suggestPartName(["Battery"], new Set())).toBe("Battery");
    expect(suggestPartName(["Battery", "Icon"], new Set())).toBe("Battery and Icon");
    expect(suggestPartName(["Battery", "Icon", "Ring"], new Set())).toBe("Battery and 2 more");
    expect(suggestPartName([], new Set())).toBe("Part");
  });

  it("numbers a name the library already holds", () => {
    expect(suggestPartName(["Battery"], new Set(["battery"]))).toBe("Battery 2");
    expect(suggestPartName(["Battery"], new Set(["battery", "battery 2"]))).toBe("Battery 3");
  });
});
