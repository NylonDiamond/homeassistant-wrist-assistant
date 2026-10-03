// The step maths behind dragging a number field, on its title or its box.
import { describe, expect, it } from "vitest";
import { commitClamped, scrubStart, scrubUnit, scrubValue } from "../src/editors.js";

describe("scrubUnit", () => {
  it("uses the field's own step", () => {
    expect(scrubUnit(40, 1)).toBe(1);
    expect(scrubUnit(2, 0.5)).toBe(0.5);
  });

  it("follows the number's decimals when the field has no step", () => {
    expect(scrubUnit(120, undefined)).toBe(1);
    expect(scrubUnit(21.5, undefined)).toBe(0.1);
    expect(scrubUnit(0.25, undefined)).toBe(0.01);
    expect(scrubUnit(3.14159, undefined)).toBe(0.01);
  });

  it("goes ten times coarser with Shift and finer with Alt", () => {
    expect(scrubUnit(50, 1, { coarse: true })).toBe(10);
    expect(scrubUnit(50, 1, { fine: true })).toBe(0.1);
  });
});

describe("scrubValue", () => {
  it("counts whole steps from where the drag started", () => {
    expect(scrubValue(23.47, 25.2, 1, {})).toBe(25.47);
    expect(scrubValue(10, 10.4, 1, {})).toBe(10);
  });

  it("clamps to the range", () => {
    expect(scrubValue(95, 120, 1, { min: 0, max: 100 })).toBe(100);
    expect(scrubValue(3, -8, 1, { min: 0, max: 100 })).toBe(0);
  });

  it("leaves no float dust", () => {
    expect(scrubValue(0.1, 0.1 + 0.1 * 2, 0.1, {})).toBe(0.3);
    expect(scrubValue(1, 1.15, 0.05, {})).toBe(1.15);
  });
});

describe("scrubStart", () => {
  it("starts an empty box at the bottom of its range, never below zero", () => {
    expect(scrubStart(undefined, { min: 4 })).toBe(4);
    expect(scrubStart(undefined, { min: -10 })).toBe(0);
    expect(scrubStart(7, { min: 4 })).toBe(7);
  });
});

describe("a slider's number box on commit", () => {
  const commit = (typed: string) => {
    const box = { value: typed };
    const written: (number | undefined)[] = [];
    commitClamped({ target: box as unknown as EventTarget }, (v) => written.push(v), { min: 0, max: 100 });
    return { shown: box.value, written };
  };

  it("clamps a number outside the range, writes it and shows it", () => {
    expect(commit("150")).toEqual({ shown: "100", written: [100] });
    expect(commit("-3")).toEqual({ shown: "0", written: [0] });
  });

  it("leaves a number in range, an empty box and junk to the input event", () => {
    expect(commit("42")).toEqual({ shown: "42", written: [] });
    expect(commit("0")).toEqual({ shown: "0", written: [] });
    expect(commit("")).toEqual({ shown: "", written: [] });
    expect(commit("abc")).toEqual({ shown: "abc", written: [] });
  });
});
