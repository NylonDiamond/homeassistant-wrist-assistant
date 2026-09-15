// The calendar look-ahead as the editor shows it: hours on the wire, the
// biggest unit that divides them in the box, and a unit switch that re-counts
// the same span rather than keeping the number.

import { describe, expect, it } from "vitest";
import {
  LIST_MAX_CALENDAR_HOURS,
  calendarHoursFrom,
  calendarLookAhead,
  calendarLookAheadIn,
  calendarLookAheadMax,
} from "../src/model.js";

describe("calendarLookAhead", () => {
  it("shows the biggest unit that divides the hours", () => {
    expect(calendarLookAhead(336)).toEqual({ value: 2, unit: "weeks" });
    expect(calendarLookAhead(168)).toEqual({ value: 1, unit: "weeks" });
    expect(calendarLookAhead(72)).toEqual({ value: 3, unit: "days" });
    expect(calendarLookAhead(24)).toEqual({ value: 1, unit: "days" });
    expect(calendarLookAhead(30)).toEqual({ value: 30, unit: "hours" });
    expect(calendarLookAhead(1)).toEqual({ value: 1, unit: "hours" });
  });

  it("clamps a wire value outside the limits first", () => {
    expect(calendarLookAhead(0)).toEqual({ value: 1, unit: "hours" });
    expect(calendarLookAhead(10_000)).toEqual({ value: 2, unit: "weeks" });
  });
});

describe("calendarHoursFrom", () => {
  it("turns a number in a unit back into hours", () => {
    expect(calendarHoursFrom(3, "days")).toBe(72);
    expect(calendarHoursFrom(2, "weeks")).toBe(336);
    expect(calendarHoursFrom(30, "hours")).toBe(30);
  });

  it("keeps the result inside the wire's limits", () => {
    expect(calendarHoursFrom(5, "weeks")).toBe(LIST_MAX_CALENDAR_HOURS);
    expect(calendarHoursFrom(0, "days")).toBe(1);
    expect(calendarHoursFrom(Number.NaN, "days")).toBe(24);
  });
});

describe("the unit switch", () => {
  it("caps the box at what the unit can hold", () => {
    expect(calendarLookAheadMax("hours")).toBe(336);
    expect(calendarLookAheadMax("days")).toBe(14);
    expect(calendarLookAheadMax("weeks")).toBe(2);
  });

  it("re-counts the same span, rounding up so no event is lost", () => {
    expect(calendarLookAheadIn(336, "days")).toBe(14);
    expect(calendarLookAheadIn(36, "days")).toBe(2);
    expect(calendarLookAheadIn(24, "weeks")).toBe(1);
    expect(calendarLookAheadIn(72, "hours")).toBe(72);
    expect(calendarLookAheadIn(336, "weeks")).toBe(2);
    expect(calendarLookAheadIn(300, "weeks")).toBe(2);
  });
});
