// The watch-version gate for one-shape and Inline documents (rule 8).

import { describe, expect, it } from "vitest";
import { MIN_WATCH_VERSION_FOR_SHAPES, compareVersions, parseVersion, watchSupportsShapes } from "../src/version.js";

describe("parseVersion", () => {
  it.each([
    ["2.8.0", [2, 8, 0]],
    ["2.8", [2, 8, 0]],
    ["v2.8.1", [2, 8, 1]],
    ["2.8.0b3", [2, 8, 0]],
    ["2.8.0 (12)", [2, 8, 0]],
    ["2.8.0-beta.1", [2, 8, 0]],
    [" 10.0.3", [10, 0, 3]],
  ])("reads %s as %j", (s, want) => {
    expect(parseVersion(s)).toEqual(want);
  });

  it.each([null, undefined, "", "beta", "12", "x.y.z"])("treats %s as unparseable", (s) => {
    expect(parseVersion(s)).toBeUndefined();
  });
});

describe("compareVersions", () => {
  it("orders by major, then minor, then patch", () => {
    expect(compareVersions([2, 8, 0], [2, 8, 0])).toBe(0);
    expect(compareVersions([2, 7, 9], [2, 8, 0])).toBe(-1);
    expect(compareVersions([2, 10, 0], [2, 9, 5])).toBe(1);
    expect(compareVersions([3, 0, 0], [2, 99, 99])).toBe(1);
  });
});

describe("watchSupportsShapes", () => {
  it("allows the minimum and anything newer", () => {
    expect(watchSupportsShapes(MIN_WATCH_VERSION_FOR_SHAPES)).toBe(true);
    expect(watchSupportsShapes("2.8.1", "2.8.0")).toBe(true);
    expect(watchSupportsShapes("3.0", "2.8.0")).toBe(true);
    expect(watchSupportsShapes("2.8.0b2", "2.8.0")).toBe(true);
  });

  it("blocks anything older, unknown, or unparseable", () => {
    expect(watchSupportsShapes("2.7.2", "2.8.0")).toBe(false);
    expect(watchSupportsShapes("2.7", "2.8.0")).toBe(false);
    expect(watchSupportsShapes(null)).toBe(false);
    expect(watchSupportsShapes(undefined)).toBe(false);
    expect(watchSupportsShapes("beta")).toBe(false);
  });
});
