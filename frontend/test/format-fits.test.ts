// Which format controls a value's source gets.

import { describe, expect, it } from "vitest";
import { formatFits } from "../src/editors.js";

const ref = { entityId: "sensor.x", displayName: "", domain: "sensor" };

describe("formatFits", () => {
  it("gives fixed words only the letter case", () => {
    expect(formatFits({ kind: "literal", value: "ABC" })).toEqual({ numbers: false, textCase: true, unit: false, seconds: false });
  });

  it("gives a fixed number the number controls instead", () => {
    expect(formatFits({ kind: "literal", value: "42" })).toEqual({ numbers: true, textCase: false, unit: false, seconds: true });
  });

  it("gives an entity's state everything, unit included", () => {
    expect(formatFits({ kind: "entityState", ...ref })).toEqual({ numbers: true, textCase: true, unit: true, seconds: true });
  });

  it("gives an age seconds but no case and no unit", () => {
    expect(formatFits({ kind: "entityAge", ...ref })).toEqual({ numbers: true, textCase: false, unit: false, seconds: true });
    expect(formatFits({ kind: "dataAge" })).toEqual({ numbers: true, textCase: false, unit: false, seconds: true });
  });

  it("gives a trend arrow nothing but the words around it", () => {
    expect(formatFits({ kind: "chartStat", layer: "A", stat: "trend" })).toEqual({ numbers: false, textCase: false, unit: false, seconds: false });
    expect(formatFits({ kind: "chartStat", layer: "A", stat: "latest" })).toMatchObject({ numbers: true, unit: true });
  });

  it("treats the clock's HH:mm as words and its other fields as numbers", () => {
    expect(formatFits({ kind: "time", timeField: "now" }).numbers).toBe(false);
    expect(formatFits({ kind: "time", timeField: "hour" }).numbers).toBe(true);
  });

  it("shows everything while the source is not known yet", () => {
    expect(formatFits(undefined)).toEqual({ numbers: true, textCase: true, unit: true, seconds: true });
  });
});
