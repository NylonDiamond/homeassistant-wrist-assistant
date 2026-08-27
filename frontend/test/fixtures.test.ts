// Shared-fixture parity tests. Every JSON under test/fixtures/ carries a
// config, resolver inputs, and the expected resolved output. The Swift side
// runs the same files; a fixture that passes here and fails there (or the
// reverse) is a behaviour drift, not a test bug.

import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseConfig } from "../src/model.js";
import { compile } from "../src/compiler.js";
import { resolveAll, type EntityState, type ForcedBranches, type ResolveContext, type ResolvedElement } from "../src/resolver.js";

const dir = join(__dirname, "fixtures");
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));

interface Fixture {
  name: string;
  config: unknown;
  inputs: {
    entityStates: Record<string, { state: string; unitOfMeasurement?: string; iconName?: string; domain?: string }>;
    templateResults: Record<string, string>;
    dataAgeSeconds?: number;
  };
  expectedCompiled?: { entities: string[]; expressionKeys: string[]; document?: string };
  expected: Record<string, { bezelText?: string | null; elements: Record<string, unknown>[] } & Record<string, unknown>>;
}

function contextFor(fx: Fixture): ResolveContext {
  const entityStates = new Map<string, EntityState>();
  for (const [id, s] of Object.entries(fx.inputs.entityStates)) {
    entityStates.set(id, {
      entityId: id,
      state: s.state,
      unitOfMeasurement: s.unitOfMeasurement,
      iconName: s.iconName ?? "",
      domain: s.domain ?? id.split(".")[0]!,
    });
  }
  const namedValues = parseConfig(fx.config).values;
  return {
    entityStates,
    templateResults: new Map(Object.entries(fx.inputs.templateResults)),
    namedValues,
    dataAgeSeconds: fx.inputs.dataAgeSeconds,
  };
}

/** Compare only the keys the fixture names; null in the fixture means "absent". */
function expectSubset(actual: Record<string, unknown>, expected: Record<string, unknown>, path: string) {
  for (const [key, want] of Object.entries(expected)) {
    if (key === "elements") continue;
    const got = actual[key];
    if (want === null) {
      expect(got, `${path}.${key}`).toBeUndefined();
    } else if (typeof want === "number") {
      expect(got, `${path}.${key}`).toBeCloseTo(want, 9);
    } else {
      expect(got, `${path}.${key}`).toEqual(want);
    }
  }
}

describe.each(files)("fixture %s", (file) => {
  const fx = JSON.parse(readFileSync(join(dir, file), "utf8")) as Fixture;
  const config = parseConfig(fx.config);

  it("compiles to the expected keys and document", () => {
    if (!fx.expectedCompiled) return;
    const compiled = compile(config);
    expect([...compiled.entities.keys()].sort()).toEqual([...fx.expectedCompiled.entities].sort());
    expect([...compiled.expressions.keys()].sort()).toEqual([...fx.expectedCompiled.expressionKeys].sort());
    if (fx.expectedCompiled.document !== undefined) expect(compiled.document).toBe(fx.expectedCompiled.document);
  });

  it("resolves every family to the expected layout", () => {
    const layouts = resolveAll(config, contextFor(fx));
    for (const family of ["rectangular", "circular", "corner"] as const) {
      const want = fx.expected[family];
      if (!want) continue;
      const got = layouts[family];
      expectSubset(got as unknown as Record<string, unknown>, want, family);
      expect(got.elements.map((e) => e.id), `${family}.elements order`).toEqual(want.elements.map((e) => e.id));
      want.elements.forEach((wantEl, i) => {
        const gotEl = got.elements[i] as ResolvedElement & Record<string, unknown>;
        if (wantEl.kind === "shape") {
          // The fixture names the shape kind `kind`; the resolver uses shapeKind.
          const { shapeKind, ...rest } = wantEl as { shapeKind?: string };
          if (shapeKind) expect((gotEl as { shapeKind?: string }).shapeKind).toBe(shapeKind);
          expectSubset(gotEl, rest, `${family}.elements[${i}]`);
        } else {
          expectSubset(gotEl, wantEl, `${family}.elements[${i}]`);
        }
      });
    }
  });

  it("honours a forced rule branch", () => {
    const forcedSpec = fx.expected.forcedCase as
      | { ruleId: string; caseId: string; rectangularTextColorHex: string }
      | undefined;
    if (!forcedSpec) return;
    const forced: ForcedBranches = new Map([[forcedSpec.ruleId, { caseId: forcedSpec.caseId }]]);
    const layouts = resolveAll(config, contextFor(fx), forced);
    const text = layouts.rectangular.elements.find((e) => e.kind === "text");
    expect(text && text.kind === "text" ? text.colorHex : undefined).toBe(forcedSpec.rectangularTextColorHex);
  });
});
