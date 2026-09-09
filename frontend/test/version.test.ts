// The watch-version gate for one-shape and Inline documents (rule 8).

import { describe, expect, it } from "vitest";
import {
  MIN_IPHONE_VERSION_FOR_LOCK_SCREEN,
  MIN_WATCH_VERSION_FOR_SHAPES,
  compareVersions,
  deviceKindOf,
  deviceNoun,
  deviceSupportsShapes,
  parseVersion,
  updateDeviceMessage,
  updateIPhoneMessage,
  updateWatchMessage,
  watchSupportsShapes,
} from "../src/version.js";

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

describe("deviceKindOf", () => {
  it("reads a missing or null kind as a watch", () => {
    expect(deviceKindOf({})).toBe("watch");
    expect(deviceKindOf({ device_kind: null })).toBe("watch");
    expect(deviceKindOf(undefined)).toBe("watch");
    expect(deviceKindOf({ device_kind: "watch" })).toBe("watch");
    expect(deviceKindOf({ device_kind: "iphone" })).toBe("iphone");
  });

  it("gives copy the word for the device", () => {
    expect(deviceNoun({ device_kind: "iphone" })).toBe("iPhone");
    expect(deviceNoun({})).toBe("watch");
  });
});

describe("deviceSupportsShapes", () => {
  it("holds a watch to the per-shape release", () => {
    expect(deviceSupportsShapes({ app_version: MIN_WATCH_VERSION_FOR_SHAPES })).toBe(true);
    expect(deviceSupportsShapes({ app_version: "2.7.9", device_kind: "watch" })).toBe(false);
  });

  it("holds a phone to the lock screen release", () => {
    expect(deviceSupportsShapes({ app_version: MIN_IPHONE_VERSION_FOR_LOCK_SCREEN, device_kind: "iphone" })).toBe(true);
    expect(deviceSupportsShapes({ app_version: "2.9.0", device_kind: "iphone" })).toBe(true);
    expect(deviceSupportsShapes({ app_version: "2.7.9", device_kind: "iphone" })).toBe(false);
  });

  it("refuses a device that has reported nothing, whichever kind it is", () => {
    expect(deviceSupportsShapes({ app_version: null, device_kind: "iphone" })).toBe(false);
    expect(deviceSupportsShapes({ app_version: null })).toBe(false);
    expect(deviceSupportsShapes(undefined)).toBe(false);
  });
});

describe("updateIPhoneMessage", () => {
  // The phone is missing a lock screen widget, not a watch app, so the
  // sentence is its own rather than the watch's with a word swapped.
  it("names the reported version and the minimum", () => {
    expect(updateIPhoneMessage("2.7.2", "2.8.0")).toBe(
      "This iPhone runs Wrist Assistant 2.7.2. Lock screen complications need 2.8.0, coming soon to the App Store.",
    );
  });

  it("says so when the iPhone never reported a version", () => {
    expect(updateIPhoneMessage(null, "2.8.0")).toMatch(/^This iPhone has not reported its Wrist Assistant version yet\./);
  });

  it("is what the gate uses for a phone owner, and never for a watch", () => {
    expect(updateDeviceMessage({ app_version: "2.7.2", device_kind: "iphone" })).toBe(updateIPhoneMessage("2.7.2"));
    expect(updateDeviceMessage({ app_version: "2.7.2" })).toBe(updateWatchMessage("2.7.2"));
  });
});
