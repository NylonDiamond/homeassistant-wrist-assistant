// The watch-version gate for one-shape and Inline documents (rule 8).

import { describe, expect, it } from "vitest";
import { MIN_WATCH_VERSION_FOR_CHART_LOOKS, MIN_WATCH_VERSION_FOR_SHAPES, compareVersions, parseVersion, updateWatchMessage, watchSupportsShapes, watchVersionNote } from "../src/version.js";

describe("watchVersionNote", () => {
  it("is unset until the app release is cut, and then says nothing", () => {
    expect(MIN_WATCH_VERSION_FOR_CHART_LOOKS).toBeNull();
    expect(watchVersionNote("1.0.0")).toBeUndefined();
    expect(watchVersionNote("1.0.0", null)).toBeUndefined();
  });

  it("names the minimum for a watch older than it", () => {
    expect(watchVersionNote("2.8.0", "2.9.0")).toBe("Needs Wrist Assistant 2.9 or later on your watch.");
    expect(watchVersionNote("2.8.9 (4)", "2.9")).toBe("Needs Wrist Assistant 2.9 or later on your watch.");
    expect(watchVersionNote("2.9.0", "2.9.1")).toBe("Needs Wrist Assistant 2.9.1 or later on your watch.");
  });

  it("says nothing for a watch that is new enough or has not reported", () => {
    expect(watchVersionNote("2.9.0", "2.9.0")).toBeUndefined();
    expect(watchVersionNote("3.0.0b2", "2.9.0")).toBeUndefined();
    expect(watchVersionNote(undefined, "2.9.0")).toBeUndefined();
    expect(watchVersionNote(null, "2.9.0")).toBeUndefined();
    expect(watchVersionNote("beta", "2.9.0")).toBeUndefined();
  });
});

describe("updateWatchMessage", () => {
  it("names the reported version and the minimum", () => {
    expect(updateWatchMessage("2.7.2", "2.8.0")).toBe(
      "This watch runs Wrist Assistant 2.7.2. The editor needs 2.8.0, coming soon to the App Store.",
    );
  });

  it("says so when the watch never reported a version", () => {
    expect(updateWatchMessage(null, "2.8.0")).toMatch(/^This watch has not reported its Wrist Assistant version yet\./);
    expect(updateWatchMessage("beta", "2.8.0")).toMatch(/^This watch has not reported/);
  });
});

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
