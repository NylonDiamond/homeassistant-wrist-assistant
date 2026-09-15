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
  calendarLookAheadShown,
} from "../src/model.js";

describe("calendarLookAhead", () => {
  it("shows the biggest unit that divides the hours", () => {
    expect(calendarLookAhead(720)).toEqual({ value: 1, unit: "months" });
    expect(calendarLookAhead(2160)).toEqual({ value: 3, unit: "months" });
    expect(calendarLookAhead(336)).toEqual({ value: 2, unit: "weeks" });
    expect(calendarLookAhead(168)).toEqual({ value: 1, unit: "weeks" });
    expect(calendarLookAhead(72)).toEqual({ value: 3, unit: "days" });
    expect(calendarLookAhead(24)).toEqual({ value: 1, unit: "days" });
    expect(calendarLookAhead(30)).toEqual({ value: 30, unit: "hours" });
    expect(calendarLookAhead(1)).toEqual({ value: 1, unit: "hours" });
  });

  it("clamps a wire value outside the limits first", () => {
    expect(calendarLookAhead(0)).toEqual({ value: 1, unit: "hours" });
    expect(calendarLookAhead(100_000)).toEqual({ value: 366, unit: "days" });
  });
});

describe("calendarHoursFrom", () => {
  it("turns a number in a unit back into hours", () => {
    expect(calendarHoursFrom(3, "days")).toBe(72);
    expect(calendarHoursFrom(2, "weeks")).toBe(336);
    expect(calendarHoursFrom(1, "months")).toBe(720);
    expect(calendarHoursFrom(30, "hours")).toBe(30);
  });

  it("keeps the result inside the wire's limits", () => {
    expect(LIST_MAX_CALENDAR_HOURS).toBe(8784);
    expect(calendarHoursFrom(13, "months")).toBe(LIST_MAX_CALENDAR_HOURS);
    expect(calendarHoursFrom(0, "days")).toBe(1);
    expect(calendarHoursFrom(Number.NaN, "days")).toBe(24);
  });
});

describe("the unit switch", () => {
  it("caps the box at what a year holds of the unit", () => {
    expect(calendarLookAheadMax("hours")).toBe(8784);
    expect(calendarLookAheadMax("days")).toBe(366);
    expect(calendarLookAheadMax("weeks")).toBe(52);
    expect(calendarLookAheadMax("months")).toBe(12);
  });

  it("re-counts the same span, rounding up so no event is lost", () => {
    expect(calendarLookAheadIn(336, "days")).toBe(14);
    expect(calendarLookAheadIn(36, "days")).toBe(2);
    expect(calendarLookAheadIn(24, "weeks")).toBe(1);
    expect(calendarLookAheadIn(72, "hours")).toBe(72);
    expect(calendarLookAheadIn(336, "weeks")).toBe(2);
    expect(calendarLookAheadIn(336, "months")).toBe(1);
    expect(calendarLookAheadIn(8784, "months")).toBe(12);
  });
});

describe("calendarLookAheadShown", () => {
  it("shows the hours in a picked unit exactly, so a week on Hours reads 168", () => {
    expect(calendarLookAheadShown(168, "hours")).toBe(168);
    expect(calendarLookAheadShown(168, "days")).toBe(7);
    expect(calendarLookAheadShown(36, "days")).toBe(1.5);
    expect(calendarLookAheadShown(360, "months")).toBe(0.5);
  });
});
