// The Inline line built from parts. The watch reads only `inline.symbol`,
// `inline.label` and `inline.value`, so every check here comes down to what
// those say after an edit, and to the parts surviving a save and every walker
// that reads the document.

import { describe, expect, it } from "vitest";
import {
  auditUnknownKeys,
  encodeConfig,
  forEachValue,
  inlineRuns,
  inlineSymbolMarker,
  literal,
  newConfig,
  parseConfig,
  type CustomComplicationConfig,
  type InlinePart,
  type Value,
} from "../src/model.js";
import { Draft } from "../src/draft.js";
import { inlineToParts, syncInlineParts } from "../src/rich-text.js";

const PART_A = "A0000000-0000-4000-8000-000000000001";
const PART_B = "A0000000-0000-4000-8000-000000000002";
const PART_C = "A0000000-0000-4000-8000-000000000003";
const PART_D = "A0000000-0000-4000-8000-000000000004";
const PART_E = "A0000000-0000-4000-8000-000000000005";

const state = (entityId: string, format?: Value["format"]): Value => ({
  kind: { kind: "entityState", entityId, displayName: entityId, domain: entityId.split(".")[0]! },
  ...(format ? { format } : {}),
});

function inlineConfig(parts: InlinePart[]): CustomComplicationConfig {
  const cfg = newConfig("Line", 0, "inline");
  cfg.inline = { value: literal("old"), parts };
  return cfg;
}

/** `In <temp> now`: one live value among words. */
const oneValue = (): InlinePart[] => [
  { id: PART_A, value: literal("In ") },
  { id: PART_B, value: state("sensor.temp") },
  { id: PART_C, value: literal(" now") },
];

/** `<temp> and <humidity>`: two live values, so a template. */
const twoValues = (): InlinePart[] => [
  { id: PART_A, value: state("sensor.temp") },
  { id: PART_B, value: literal(" and ") },
  { id: PART_C, value: state("sensor.humidity") },
];

describe("syncInlineParts", () => {
  it("puts the words around one live value into its prefix and suffix", () => {
    const cfg = inlineConfig(oneValue());
    expect(syncInlineParts(cfg)).toEqual([]);
    expect(cfg.inline!.value).toEqual(state("sensor.temp", { prefix: "In ", suffix: " now" }));
  });

  it("keeps a lone value's own format, even one no template can print", () => {
    const temp = state("sensor.door", { relativeTime: true });
    const cfg = inlineConfig([{ id: PART_A, value: literal("Door: ") }, { id: PART_B, value: temp }]);
    expect(syncInlineParts(cfg)).toEqual([]);
    expect(cfg.inline!.value).toEqual(state("sensor.door", { relativeTime: true, prefix: "Door: " }));
  });

  it("joins two or more live values into one template", () => {
    const cfg = inlineConfig(twoValues());
    expect(syncInlineParts(cfg)).toEqual([]);
    expect(cfg.inline!.value).toEqual({
      kind: { kind: "jinja", value: "{{ states('sensor.temp') }} and {{ states('sensor.humidity') }}" },
    });
  });

  it("joins typed words alone into plain words", () => {
    const cfg = inlineConfig([{ id: PART_A, value: literal("In ") }, { id: PART_B, value: literal("22°") }]);
    syncInlineParts(cfg);
    expect(cfg.inline!.value).toEqual(literal("In 22°"));
  });

  it("leaves a part with no template form out of a template and says which", () => {
    const parts = twoValues();
    parts[2]!.value = state("sensor.humidity", { relativeTime: true });
    const cfg = inlineConfig(parts);
    const blocked = syncInlineParts(cfg);
    expect(blocked.map((b) => b.partId)).toEqual([PART_C]);
    expect(cfg.inline!.value).toEqual(state("sensor.temp", { suffix: " and " }));
  });

  it("leaves the value alone without parts", () => {
    const plain = newConfig("Line", 0, "inline");
    plain.inline = { value: state("sensor.temp") };
    syncInlineParts(plain);
    expect(plain.inline!.value).toEqual(state("sensor.temp"));
  });

  it("makes a first icon the line's symbol", () => {
    const parts = oneValue();
    parts.unshift({ id: PART_D, value: literal(""), symbol: "bolt.fill" });
    const cfg = inlineConfig(parts);
    syncInlineParts(cfg);
    expect(cfg.inline!.symbol).toBe("bolt.fill");
    expect(cfg.inline!.value).toEqual(state("sensor.temp", { prefix: "In ", suffix: " now" }));
    cfg.inline!.parts!.shift();
    syncInlineParts(cfg);
    expect(cfg.inline!.symbol).toBeUndefined();
  });

  it("writes no label, since words are parts", () => {
    const cfg = inlineConfig(oneValue());
    cfg.inline!.label = "Stale";
    syncInlineParts(cfg);
    expect(cfg.inline!.label).toBeUndefined();
  });
});

describe("Count down", () => {
  it("counts to the one live part, with the words before it as the label", () => {
    const cfg = inlineConfig([
      { id: PART_D, value: literal(""), symbol: "timer" },
      { id: PART_A, value: literal("Oven: ") },
      { id: PART_B, value: state("timer.oven") },
      { id: PART_C, value: literal(" left") },
    ]);
    cfg.inline!.countdown = true;
    syncInlineParts(cfg);
    expect(cfg.inline!.value).toEqual(state("timer.oven"));
    expect(cfg.inline!.label).toBe("Oven");
    expect(cfg.inline!.symbol).toBe("timer");
  });

  it("keeps the label a countdown writes, without gaining its words twice", () => {
    const draft = new Draft(inlineConfig([{ id: PART_A, value: literal("Oven: ") }, { id: PART_B, value: state("timer.oven") }]), null);
    draft.update((c) => { c.inline!.countdown = true; });
    draft.update((c) => { c.name = "Renamed"; });
    expect(draft.config.inline!.label).toBe("Oven");
    expect(draft.config.inline!.parts!.map((p) => p.id)).toEqual([PART_A, PART_B]);
  });
});

describe("Inline parts in a document", () => {
  it("round-trips through encode and parse, with the joined value beside them", () => {
    const cfg = inlineConfig(twoValues());
    syncInlineParts(cfg);
    const raw = encodeConfig(cfg);
    expect(auditUnknownKeys(raw)).toEqual([]);
    const back = parseConfig(raw);
    expect(back.inline!.parts).toEqual(cfg.inline!.parts);
    expect(back.inline!.value).toEqual(cfg.inline!.value);
  });

  it("writes no parts key for a line without parts", () => {
    const cfg = newConfig("Line", 0, "inline");
    cfg.inline = { value: literal("Hi"), parts: [] };
    expect((encodeConfig(cfg).inline as Record<string, unknown>).parts).toBeUndefined();
  });

  it("is walked, so a share or an import reaches every part", () => {
    const seen: string[] = [];
    forEachValue(inlineConfig(twoValues()), (v, site) => {
      if (site.kind === "inline" && v.kind.kind === "entityState") seen.push(v.kind.entityId);
    });
    expect(seen).toEqual(["sensor.temp", "sensor.humidity"]);
  });

  it("stays in step through every draft edit", () => {
    const draft = new Draft(inlineConfig(oneValue()), null);
    draft.update((c) => { c.inline!.parts![0]!.value = literal("At "); });
    expect(draft.config.inline!.value).toEqual(state("sensor.temp", { prefix: "At ", suffix: " now" }));
  });
});

describe("Inline icon parts", () => {
  it("join as a symbol marker where the part sits", () => {
    const parts = twoValues();
    parts.splice(1, 0, { id: PART_E, value: literal(""), symbol: "bolt.fill" });
    const cfg = inlineConfig(parts);
    syncInlineParts(cfg);
    expect(cfg.inline!.value).toEqual({
      kind: { kind: "jinja", value: `{{ states('sensor.temp') }}${inlineSymbolMarker("bolt.fill")} and {{ states('sensor.humidity') }}` },
    });
  });

  it("ride in a lone value's words as markers", () => {
    const parts = oneValue();
    parts.splice(1, 0, { id: PART_E, value: literal(""), symbol: "bolt.fill" });
    const cfg = inlineConfig(parts);
    syncInlineParts(cfg);
    expect(cfg.inline!.value).toEqual(state("sensor.temp", { prefix: `In ${inlineSymbolMarker("bolt.fill")}`, suffix: " now" }));
  });

  it("keep their symbol through encode and parse", () => {
    const parts = oneValue();
    parts[0] = { id: PART_A, value: literal(""), symbol: "drop.fill" };
    const raw = encodeConfig(inlineConfig(parts));
    expect(auditUnknownKeys(raw)).toEqual([]);
    expect(parseConfig(raw).inline!.parts![0]).toEqual({ id: PART_A, value: literal(""), symbol: "drop.fill" });
  });

  it("split back into words and symbols the way the watch splits them", () => {
    const line = `${inlineSymbolMarker("bolt.fill")} 72° ${inlineSymbolMarker("drop.fill")}40%`;
    expect(inlineRuns(line)).toEqual([{ symbol: "bolt.fill" }, { text: " 72° " }, { symbol: "drop.fill" }, { text: "40%" }]);
    expect(inlineRuns("plain")).toEqual([{ text: "plain" }]);
    expect(inlineRuns("abolt")).toEqual([{ text: "abolt" }]);
    expect(inlineRuns("ab")).toEqual([{ text: "ab" }]);
  });
});

describe("An Inline line saved without parts", () => {
  it("opens as parts, its symbol first and its label as words", () => {
    const cfg = newConfig("Line", 0, "inline");
    cfg.inline = { label: "Temp", value: state("sensor.temp", { decimals: 1 }), symbol: "thermometer" };
    const draft = new Draft(cfg, 3);
    const inline = draft.config.inline!;
    expect(inline.parts!.map((p) => p.symbol ?? p.value)).toEqual(["thermometer", literal("Temp: "), state("sensor.temp", { decimals: 1 })]);
    expect(inline.value).toEqual(state("sensor.temp", { decimals: 1, prefix: "Temp: " }));
    expect(inline.symbol).toBe("thermometer");
    expect(inline.label).toBeUndefined();
    expect(draft.dirty).toBe(false);
  });

  it("keeps a countdown counting, label and all", () => {
    const cfg = newConfig("Line", 0, "inline");
    cfg.inline = { label: "Oven", value: state("timer.oven"), countdown: true };
    inlineToParts(cfg);
    syncInlineParts(cfg);
    expect(cfg.inline.value).toEqual(state("timer.oven"));
    expect(cfg.inline.countdown).toBe(true);
    expect(cfg.inline.label).toBe("Oven");
    expect(cfg.inline.parts!.map((p) => p.value)).toEqual([literal("Oven: "), state("timer.oven")]);
  });
});
