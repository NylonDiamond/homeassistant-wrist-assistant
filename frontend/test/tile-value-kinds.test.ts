// The two value kinds a page tile's layers read: `tileState` (the tile's One
// Look state line as text) and `tileName` (the name the tile draws). Both are
// local, like `dataAge`: nothing is compiled or fetched for them, and outside
// a tile they resolve to nothing. App repo docs/tile_layers_contract_2026-10.md,
// section 5.1.

import { describe, expect, it } from "vitest";
import { compile } from "../src/compiler.js";
import {
  type CustomComplicationConfig,
  type Element,
  auditUnknownKeys,
  encodeConfig,
  encodeValue,
  newConfig,
  newElement,
  parseConfig,
  parseValue,
} from "../src/model.js";
import { type ResolveContext, resolveAll } from "../src/resolver.js";

type Text = Extract<Element, { kind: "text" }>;

function docReading(kind: "tileState" | "tileName"): { cfg: CustomComplicationConfig; text: Text } {
  const cfg = newConfig("Tile", 0);
  const text = newElement("text") as Text;
  text.payload.value = { kind: { kind } };
  cfg.elements.push(text);
  return { cfg, text };
}

function resolveText(cfg: CustomComplicationConfig, id: string, tileValues?: ResolveContext["tileValues"]): string | undefined {
  const ctx: ResolveContext = { entityStates: new Map(), templateResults: new Map(), namedValues: cfg.values, ...(tileValues ? { tileValues } : {}) };
  const el = resolveAll(cfg, ctx).rectangular!.elements.find((e) => e.id === id);
  return el?.kind === "text" ? el.text : undefined;
}

describe("the tile value kinds on the wire", () => {
  for (const kind of ["tileState", "tileName"] as const) {
    it(`${kind} round-trips in the nested form`, () => {
      const v = parseValue({ kind: { kind } });
      expect(v.kind).toEqual({ kind });
      expect(encodeValue(v)).toEqual({ kind: { kind } });
    });

    it(`${kind} survives parseConfig and encodeConfig and audits clean`, () => {
      const { cfg, text } = docReading(kind);
      const wire = encodeConfig(cfg);
      expect(auditUnknownKeys(wire)).toEqual([]);
      const back = parseConfig(wire);
      const el = back.elements.find((e) => e.payload.id === text.payload.id);
      expect(el?.kind === "text" ? el.payload.value.kind : undefined).toEqual({ kind });
      expect(encodeConfig(back)).toEqual(wire);
    });

    it(`${kind} compiles to nothing`, () => {
      const { cfg } = docReading(kind);
      const out = compile(cfg);
      expect(out.document).toBeUndefined();
      expect(out.entities.size).toBe(0);
    });
  }
});

describe("resolving the tile value kinds", () => {
  it("reads the tile's words from the context", () => {
    const state = docReading("tileState");
    expect(resolveText(state.cfg, state.text.payload.id, { state: "82%", name: "Office" })).toBe("82%");
    const name = docReading("tileName");
    expect(resolveText(name.cfg, name.text.payload.id, { state: "82%", name: "Office" })).toBe("Office");
  });

  it("an empty state line resolves to empty text, not to nothing", () => {
    const state = docReading("tileState");
    expect(resolveText(state.cfg, state.text.payload.id, { state: "", name: "Office" })).toBe("");
  });

  it("outside a tile both read as unresolved", () => {
    const state = docReading("tileState");
    const name = docReading("tileName");
    const plain = docReading("tileState");
    plain.text.payload.value = { kind: { kind: "literal", value: "x" } };
    // Whatever an unresolved value draws in this resolver, the tile kinds draw
    // the same with no tile values.
    const unresolved = resolveText(plain.cfg, plain.text.payload.id);
    expect(unresolved).toBe("x");
    const missing = docReading("tileState");
    missing.text.payload.value = { kind: { kind: "entityState", entityId: "sensor.none", displayName: "", domain: "sensor" } };
    const none = resolveText(missing.cfg, missing.text.payload.id);
    expect(resolveText(state.cfg, state.text.payload.id)).toBe(none);
    expect(resolveText(name.cfg, name.text.payload.id)).toBe(none);
  });

  it("formats like any other text", () => {
    const name = docReading("tileName");
    name.text.payload.value.format = { textCase: "upper" } as Text["payload"]["value"]["format"];
    expect(resolveText(name.cfg, name.text.payload.id, { name: "Office" })).toBe("OFFICE");
  });
});
