// The Inline line built from parts. The watch reads only `inline.value`, so
// every check here comes down to what that value says after an edit, and to
// the parts surviving a save and every walker that reads the document.

import { describe, expect, it } from "vitest";
import {
  auditUnknownKeys,
  encodeConfig,
  forEachValue,
  literal,
  newConfig,
  parseConfig,
  type CustomComplicationConfig,
  type Value,
} from "../src/model.js";
import { Draft } from "../src/draft.js";
import { syncInlineParts } from "../src/rich-text.js";

const PART_A = "A0000000-0000-4000-8000-000000000001";
const PART_B = "A0000000-0000-4000-8000-000000000002";
const PART_C = "A0000000-0000-4000-8000-000000000003";

const state = (entityId: string, format?: Value["format"]): Value => ({
  kind: { kind: "entityState", entityId, displayName: entityId, domain: entityId.split(".")[0]! },
  ...(format ? { format } : {}),
});

function inlineConfig(): CustomComplicationConfig {
  const cfg = newConfig("Line", 0, "inline");
  cfg.inline = {
    value: literal("old"),
    parts: [
      { id: PART_A, value: literal("In ") },
      { id: PART_B, value: state("sensor.temp") },
      { id: PART_C, value: literal(" now") },
    ],
  };
  return cfg;
}

describe("syncInlineParts", () => {
  it("writes the parts joined into one template", () => {
    const cfg = inlineConfig();
    expect(syncInlineParts(cfg)).toEqual([]);
    expect(cfg.inline!.value).toEqual({ kind: { kind: "jinja", value: "In {{ states('sensor.temp') }} now" } });
  });

  it("joins typed words alone into plain words", () => {
    const cfg = inlineConfig();
    cfg.inline!.parts![1]!.value = literal("22°");
    syncInlineParts(cfg);
    expect(cfg.inline!.value).toEqual(literal("In 22° now"));
  });

  it("leaves a part with no template form out of the line and says which", () => {
    const cfg = inlineConfig();
    cfg.inline!.parts![1]!.value = state("sensor.temp", { relativeTime: true });
    const blocked = syncInlineParts(cfg);
    expect(blocked.map((b) => b.partId)).toEqual([PART_B]);
    expect(cfg.inline!.value).toEqual(literal("In  now"));
  });

  it("leaves the value alone without parts or under a countdown", () => {
    const plain = newConfig("Line", 0, "inline");
    plain.inline = { value: state("sensor.temp") };
    syncInlineParts(plain);
    expect(plain.inline!.value).toEqual(state("sensor.temp"));

    const counting = inlineConfig();
    counting.inline!.countdown = true;
    syncInlineParts(counting);
    expect(counting.inline!.value).toEqual(literal("old"));
  });
});

describe("Inline parts in a document", () => {
  it("round-trips through encode and parse, with the joined value beside them", () => {
    const cfg = inlineConfig();
    syncInlineParts(cfg);
    const raw = encodeConfig(cfg);
    expect(auditUnknownKeys(raw)).toEqual([]);
    const back = parseConfig(raw);
    expect(back.inline!.parts).toEqual(cfg.inline!.parts);
    expect(back.inline!.value).toEqual(cfg.inline!.value);
  });

  it("writes no parts key for a plain line", () => {
    const cfg = newConfig("Line", 0, "inline");
    cfg.inline = { value: literal("Hi"), parts: [] };
    expect((encodeConfig(cfg).inline as Record<string, unknown>).parts).toBeUndefined();
  });

  it("is walked, so a share or an import reaches every part", () => {
    const seen: string[] = [];
    forEachValue(inlineConfig(), (v, site) => {
      if (site.kind === "inline" && v.kind.kind === "entityState") seen.push(v.kind.entityId);
    });
    expect(seen).toEqual(["sensor.temp"]);
  });

  it("stays joined through every draft edit", () => {
    const draft = new Draft(inlineConfig(), null);
    draft.update((c) => { c.inline!.parts![0]!.value = literal("At "); });
    expect(draft.config.inline!.value).toEqual({ kind: { kind: "jinja", value: "At {{ states('sensor.temp') }} now" } });
  });
});
