// Rule presets and the clock-window comparison behind one of them. A preset is
// worth testing for the shape of the test it writes, because that shape is what
// the watch has to agree with; `timeBetween` is worth testing for the wrap,
// which is the only reason it exists as a separate comparison.

import { describe, expect, it } from "vitest";
import {
  type Test,
  type Value,
  auditUnknownKeys,
  clockTime,
  comparisonOperand,
  encodeConfig,
  literal,
  newConfig,
  parseConfig,
  switchComparison,
} from "../src/model.js";
import { Resolver, type ResolveContext } from "../src/resolver.js";
import {
  RULE_PRESETS,
  WEEKDAYS_MON_FRI,
  afterSunsetTests,
  daytimeTests,
  rulePresetTests,
  sunElevationTests,
  sunRef,
  timeBetweenTests,
  weekdayNumbers,
  weekdayOptions,
  weekdayTests,
  weekdayWords,
} from "../src/rule-presets.js";
import type { HassEntityState } from "../src/ha-api.js";

const SUN = { entityId: "sun.sun", displayName: "Sun", domain: "sun" };

function context(templateResults: Record<string, string> = {}): ResolveContext {
  return {
    entityStates: new Map(),
    templateResults: new Map(Object.entries(templateResults)),
    namedValues: [],
    dataAgeSeconds: 5,
  };
}

/** A `timeBetween` test whose left side is a plain literal, so the test says
 * only what the comparison does. */
function window(now: string, start: string, end: string): Test {
  return {
    id: "T",
    value: literal(now),
    comparison: { kind: "timeBetween", value: literal(start), upper: literal(end) },
  };
}

function holds(now: string, start: string, end: string): boolean {
  return new Resolver(context()).evaluateTest(window(now, start, end));
}

describe("clockTime", () => {
  it("accepts a zero-padded 24-hour time", () => {
    expect(clockTime("00:00")).toBe("00:00");
    expect(clockTime("09:05")).toBe("09:05");
    expect(clockTime("23:59")).toBe("23:59");
  });

  it("trims surrounding space", () => {
    expect(clockTime("  07:30 ")).toBe("07:30");
  });

  it("rejects anything that is not HH:MM", () => {
    for (const bad of ["7:00", "7:0", "24:00", "23:60", "0700", "", "noon", "07:00:00", "０７:００"]) {
      expect(clockTime(bad), bad).toBeUndefined();
    }
  });
});

describe("timeBetween", () => {
  it("holds inside a window that does not wrap", () => {
    expect(holds("09:00", "08:00", "17:00")).toBe(true);
    expect(holds("08:00", "08:00", "17:00")).toBe(true);
  });

  it("excludes the end and everything outside", () => {
    expect(holds("17:00", "08:00", "17:00")).toBe(false);
    expect(holds("07:59", "08:00", "17:00")).toBe(false);
    expect(holds("23:00", "08:00", "17:00")).toBe(false);
  });

  it("wraps midnight when the end is earlier than the start", () => {
    expect(holds("23:30", "22:00", "06:00")).toBe(true);
    expect(holds("00:00", "22:00", "06:00")).toBe(true);
    expect(holds("05:59", "22:00", "06:00")).toBe(true);
    expect(holds("06:00", "22:00", "06:00")).toBe(false);
    expect(holds("12:00", "22:00", "06:00")).toBe(false);
  });

  it("matches nothing when the bounds are equal", () => {
    expect(holds("09:00", "09:00", "09:00")).toBe(false);
    expect(holds("00:00", "09:00", "09:00")).toBe(false);
  });

  it("is false for malformed input on any side", () => {
    expect(holds("9:00", "08:00", "17:00")).toBe(false);
    expect(holds("09:00", "8:00", "17:00")).toBe(false);
    expect(holds("09:00", "08:00", "evening")).toBe(false);
    expect(holds("", "08:00", "17:00")).toBe(false);
  });

  it("reads the clock through a time value the same way", () => {
    // `time(now)` compiles to `now().strftime('%H:%M')`, which reaches the
    // resolver as a template result under the compiler's key.
    const value: Value = { kind: { kind: "time", timeField: "now" } };
    const ctx = context({ e_1fe7410bb981c42c: "23:30" });
    const test: Test = {
      id: "T",
      value,
      comparison: { kind: "timeBetween", value: literal("22:00"), upper: literal("06:00") },
    };
    expect(new Resolver(ctx).evaluateTest(test)).toBe(true);
  });

  it("carries both bounds through encode and parse", () => {
    const cfg = newConfig("Times", 0);
    cfg.elements.push({
      kind: "text",
      payload: {
        id: "AAAAAAAA-0000-4000-8000-00000000000A",
        value: literal("x"),
        fontSize: 14,
        fontWeight: "regular",
        colorSlot: { baseColorHex: "#FFFFFF" },
        frame: { x: 0.1, y: 0.1, width: 0.5, height: 0.5, rotationDegrees: 0 },
        isHidden: false,
        rules: [{
          id: "BBBBBBBB-0000-4000-8000-00000000000B",
          cases: [{ id: "CCCCCCCC-0000-4000-8000-00000000000C", when: { join: "all", tests: timeBetweenTests() }, then: [] }],
        }],
      },
    } as never);
    const encoded = encodeConfig(cfg);
    expect(auditUnknownKeys(encoded)).toEqual([]);
    const back = parseConfig(encoded);
    const test = (back.elements[0]!.payload as { rules: { cases: { when: { tests: Test[] } }[] }[] }).rules[0]!.cases[0]!.when.tests[0]!;
    expect(test.comparison.kind).toBe("timeBetween");
    expect(test.comparison.value).toEqual(literal("22:00"));
    expect(test.comparison.upper).toEqual(literal("06:00"));
  });

  it("takes two operands, and switching to it seeds a night window", () => {
    expect(comparisonOperand("timeBetween")).toBe("times");
    const from = switchComparison({ kind: "lessThan", value: literal("20") }, "timeBetween");
    expect(from.value).toEqual(literal("22:00"));
    expect(from.upper).toEqual(literal("06:00"));
  });

  it("keeps bounds that already read as times", () => {
    const kept = switchComparison({ kind: "timeBetween", value: literal("08:00"), upper: literal("17:00") }, "timeBetween");
    expect(kept.value).toEqual(literal("08:00"));
    expect(kept.upper).toEqual(literal("17:00"));
  });
});

describe("sunRef", () => {
  function state(friendly: unknown): Record<string, HassEntityState> {
    return { "sun.sun": { entity_id: "sun.sun", state: "above_horizon", attributes: { friendly_name: friendly }, last_changed: "", last_updated: "" } };
  }

  it("uses the name Home Assistant gives the entity", () => {
    expect(sunRef(state("Sonne"))).toEqual({ entityId: "sun.sun", displayName: "Sonne", domain: "sun" });
  });

  it("falls back to Sun with no states, an empty name, or a name that is not text", () => {
    expect(sunRef(undefined).displayName).toBe("Sun");
    expect(sunRef({}).displayName).toBe("Sun");
    expect(sunRef(state("   ")).displayName).toBe("Sun");
    expect(sunRef(state(7)).displayName).toBe("Sun");
  });
});

describe("sun presets", () => {
  it("after sunset tests the sun entity's own state", () => {
    const [test] = afterSunsetTests(SUN);
    expect(test!.value.kind).toEqual({ kind: "entityState", ...SUN });
    expect(test!.comparison).toEqual({ kind: "equals", value: literal("below_horizon") });
  });

  it("daytime is the same test with the other state", () => {
    const [test] = daytimeTests(SUN);
    expect(test!.comparison).toEqual({ kind: "equals", value: literal("above_horizon") });
  });

  it("elevation reads the attribute and defaults to the horizon", () => {
    const [test] = sunElevationTests(SUN);
    expect(test!.value.kind).toEqual({ kind: "entityAttribute", ...SUN, attribute: "elevation" });
    expect(test!.comparison).toEqual({ kind: "lessThan", value: literal("0") });
  });

  it("elevation takes a negative angle", () => {
    const [test] = sunElevationTests(SUN, -6);
    expect(test!.comparison.value).toEqual(literal("-6"));
  });

  it("gives every test its own id", () => {
    const ids = [...afterSunsetTests(SUN), ...afterSunsetTests(SUN)].map((t) => t.id);
    expect(new Set(ids).size).toBe(2);
  });
});

describe("weekdays", () => {
  it("stores Jinja's numbers, Monday first", () => {
    const [test] = weekdayTests();
    expect(test!.value.kind).toEqual({ kind: "time", timeField: "weekday" });
    expect(test!.comparison).toEqual({ kind: "isOneOf", options: ["0", "1", "2", "3", "4"] });
  });

  it("takes any set of days, sorted and deduplicated", () => {
    expect(weekdayOptions([6, 5, 5])).toEqual(["5", "6"]);
    expect(weekdayTests([5, 6])[0]!.comparison.options).toEqual(["5", "6"]);
  });

  it("reads stored options back, ignoring anything that is not a day", () => {
    expect(weekdayNumbers(["0", "4"])).toEqual([0, 4]);
    expect(weekdayNumbers([" 2 ", "7", "-1", "sunday", "1.5", ""])).toEqual([2]);
    expect(weekdayNumbers(undefined)).toEqual([]);
  });

  it("says the days in words", () => {
    expect(weekdayWords(WEEKDAYS_MON_FRI)).toBe("Mon, Tue, Wed, Thu and Fri");
    expect(weekdayWords([6])).toBe("Sun");
    expect(weekdayWords([])).toBe("no days");
  });
});

describe("the preset menu", () => {
  it("has one function behind every listed preset", () => {
    for (const spec of RULE_PRESETS) {
      const tests = rulePresetTests(spec.kind, SUN);
      expect(tests.length, spec.kind).toBeGreaterThan(0);
      for (const t of tests) expect(t.id, spec.kind).not.toBe("");
    }
  });

  it("writes documents the audit accepts", () => {
    for (const spec of RULE_PRESETS) {
      const cfg = newConfig("Presets", 0);
      cfg.elements.push({
        kind: "text",
        payload: {
          id: "AAAAAAAA-0000-4000-8000-00000000000A",
          value: literal("x"),
          fontSize: 14,
          fontWeight: "regular",
          colorSlot: { baseColorHex: "#FFFFFF" },
          frame: { x: 0.1, y: 0.1, width: 0.5, height: 0.5, rotationDegrees: 0 },
          isHidden: false,
          rules: [{
            id: "BBBBBBBB-0000-4000-8000-00000000000B",
            cases: [{ id: "CCCCCCCC-0000-4000-8000-00000000000C", when: { join: "all", tests: rulePresetTests(spec.kind, SUN) }, then: [] }],
          }],
        },
      } as never);
      expect(auditUnknownKeys(encodeConfig(cfg)), spec.kind).toEqual([]);
    }
  });

  it("names each preset once", () => {
    expect(new Set(RULE_PRESETS.map((p) => p.kind)).size).toBe(RULE_PRESETS.length);
    expect(new Set(RULE_PRESETS.map((p) => p.label)).size).toBe(RULE_PRESETS.length);
  });
});
