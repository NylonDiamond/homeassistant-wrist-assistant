// Round trip and lossiness guards for the editor's save path.

import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { COMPARISON_KINDS, auditUnknownKeys, encodeConfig, newCase, newConfig, newElement, newRule, newStyleChange, newTest, parseConfig, switchComparison, type StyleChangeKind } from "../src/model.js";
import { deriveDataSources } from "../src/compiler.js";
import { Draft } from "../src/draft.js";
import { effectivePlacement, setPlacement } from "../src/editors.js";

const fixtureDir = join(__dirname, "fixtures");
const fixtureFiles = readdirSync(fixtureDir).filter((f) => f.endsWith(".json"));
const fixture = JSON.parse(readFileSync(join(fixtureDir, "living_room.json"), "utf8")) as { config: Record<string, unknown> };

/** Sort keys so two documents compare by content. */
function canon(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(canon);
  if (v && typeof v === "object") return Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon((v as Record<string, unknown>)[k])]));
  return v;
}

describe("encodeConfig", () => {
  it("round-trips the shared fixture byte for byte (modulo key order)", () => {
    const parsed = parseConfig(fixture.config);
    const encoded = encodeConfig(parsed);
    expect(canon(encoded)).toEqual(canon(fixture.config));
  });

  it.each(fixtureFiles)("round-trips fixture %s, so the file is in canonical Swift form", (file) => {
    const fx = JSON.parse(readFileSync(join(fixtureDir, file), "utf8")) as { config: Record<string, unknown> };
    expect(canon(encodeConfig(parseConfig(fx.config)))).toEqual(canon(fx.config));
    expect(auditUnknownKeys(fx.config)).toEqual([]);
  });

  it("round-trips every comparison kind and style change kind", () => {
    const cfg = newConfig("X", 0);
    const el = newElement("text");
    const rule = newRule();
    const c = newCase();
    c.when.tests = COMPARISON_KINDS.map((k) => { const t = newTest(); t.comparison = switchComparison({ kind: "isOn" }, k); return t; });
    const kinds = Object.keys({ setColor: 0, setOpacity: 0, setText: 0, setIcon: 0, setFontSize: 0, setFontWeight: 0, setRotation: 0, hide: 0, show: 0, setGaugeValue: 0, setGaugeMin: 0, setGaugeMax: 0, setBorderColor: 0, setBorderWidth: 0, setBackgroundColor: 0 }) as StyleChangeKind[];
    c.then = kinds.map(newStyleChange);
    rule.cases = [c];
    rule.otherwise = [newStyleChange("hide")];
    el.payload.rules = [rule];
    cfg.elements.push(el);
    const enc = encodeConfig(cfg);
    expect(encodeConfig(parseConfig(enc))).toEqual(enc);
    const tests = ((enc as { elements: { payload: { rules: { cases: { when: { tests: { comparison: Record<string, unknown> }[] } }[] }[] } }[] }).elements[0]!.payload.rules[0]!.cases[0]!.when.tests);
    const keysOf = (kind: string) => Object.keys(tests.find((t) => t.comparison.kind === kind)!.comparison).sort();
    expect(keysOf("isOn")).toEqual(["kind"]);
    expect(keysOf("between")).toEqual(["kind", "upper", "value"]);
    expect(keysOf("matchesRegex")).toEqual(["kind", "pattern"]);
    expect(keysOf("isOneOf")).toEqual(["kind", "options"]);
    expect(keysOf("equals")).toEqual(["kind", "value"]);
  });

  it("is stable: encode(parse(encode(x))) === encode(x)", () => {
    const once = encodeConfig(parseConfig(fixture.config));
    const twice = encodeConfig(parseConfig(once));
    expect(twice).toEqual(once);
  });

  it("writes the phone's shape rules", () => {
    const cfg = newConfig("X", 3);
    cfg.elements.push(newElement("text"));
    const enc = encodeConfig(cfg) as Record<string, unknown>;
    expect(enc.schemaVersion).toBe(4);
    expect(Array.isArray(enc.perFamily)).toBe(true);
    expect((enc.perFamily as unknown[]).length).toBe(6);
    const layout = (enc.perFamily as unknown[])[1] as Record<string, unknown>;
    expect(layout).toEqual({ cornerBodyShape: "wedge", borderWidth: 2 });
    const el = (enc.elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>;
    expect(el.rules).toEqual([]);
    expect(el.isHidden).toBe(false);
    expect((el.value as Record<string, unknown>).format).toBeUndefined();
    expect(Object.keys(el.value as object)).toEqual(["kind"]);
  });

  it("omits placement isHidden when false and size when unset", () => {
    const cfg = newConfig("X", 0);
    const el = newElement("icon");
    cfg.elements.push(el);
    setPlacement(cfg, "circular", el.payload.id, { frame: { x: 0.1, y: 0.1, width: 0.5, height: 0.5, rotationDegrees: 0 } });
    const enc = encodeConfig(cfg) as { perFamily: unknown[] };
    const circular = enc.perFamily[3] as { placements: Record<string, Record<string, unknown>> };
    const p = circular.placements[el.payload.id]!;
    expect(Object.keys(p)).toEqual(["frame"]);
  });

  it("writes non-finite numbers the way the Swift coder does", () => {
    const cfg = newConfig("X", 0);
    const el = newElement("gauge");
    if (el.kind === "gauge") el.payload.maxValue = Infinity;
    cfg.elements.push(el);
    const enc = encodeConfig(cfg) as { elements: { payload: { maxValue: unknown } }[] };
    expect(enc.elements[0]!.payload.maxValue).toBe("+inf");
    const back = parseConfig(enc).elements[0]!;
    expect(back.kind === "gauge" ? back.payload.maxValue : NaN).toBe(Infinity);
  });
});

describe("auditUnknownKeys", () => {
  it("is empty for the fixture", () => {
    expect(auditUnknownKeys(fixture.config)).toEqual([]);
  });
  it("names every unknown path", () => {
    const doc = structuredClone(fixture.config) as Record<string, unknown>;
    doc.futureFlag = true;
    ((doc.elements as Record<string, unknown>[])[1]!.payload as Record<string, unknown>).alignment = "left";
    ((doc.perFamily as unknown[])[5] as Record<string, unknown>).glow = 1;
    expect(auditUnknownKeys(doc)).toEqual(["$.futureFlag", "$.elements[1].payload.alignment", "$.perFamily.corner.glow"]);
  });
});

describe("deriveDataSources", () => {
  it("lists entities sorted then one template, like the phone editor", () => {
    const ds = deriveDataSources(parseConfig(fixture.config));
    expect(ds.map((d) => d.kind)).toEqual(["entity", "template"]);
    expect(ds[0]).toMatchObject({ entityId: "sensor.living_room_temperature" });
  });
});

describe("Draft", () => {
  it("tracks dirty, undo, redo and coalescing", () => {
    const d = Draft.fromDocument(fixture.config, 2);
    expect(d.dirty).toBe(false);
    d.update((c) => { c.name = "A"; }, "name");
    d.update((c) => { c.name = "AB"; }, "name");
    expect(d.dirty).toBe(true);
    expect(d.config.name).toBe("AB");
    d.undo();
    expect(d.config.name).toBe("Living Room");
    expect(d.dirty).toBe(false);
    d.redo();
    expect(d.config.name).toBe("AB");
    d.endGesture();
    d.update((c) => { c.name = "ABC"; }, "name");
    d.undo();
    expect(d.config.name).toBe("AB");
  });

  it("re-derives dataSources in the encoded document", () => {
    const d = Draft.fromDocument(fixture.config, 2);
    const enc = d.encoded() as { dataSources: unknown[] };
    expect(enc.dataSources.length).toBe(2);
    // dataSources is derived, so it never makes a clean draft dirty.
    expect(d.dirty).toBe(false);
  });
});

describe("setPlacement", () => {
  it("freezes the other layers when a family gets its first placement", () => {
    const cfg = newConfig("X", 0);
    const a = newElement("text");
    const b = newElement("shape");
    cfg.elements.push(a, b);
    setPlacement(cfg, "rectangular", a.payload.id, { isHidden: true });
    const layout = cfg.perFamily.rectangular!;
    expect(Object.keys(layout.placements).sort()).toEqual([a.payload.id, b.payload.id].sort());
    expect(effectivePlacement(cfg, "rectangular", a).isHidden).toBe(true);
    expect(effectivePlacement(cfg, "rectangular", b).frame).toEqual(b.payload.frame);
    expect(effectivePlacement(cfg, "circular", a).fromPlacement).toBe(false);
  });
});
