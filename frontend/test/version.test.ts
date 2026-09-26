// The watch-version gate for one-shape and Inline documents (rule 8).

import { describe, expect, it } from "vitest";
import {
  LIBRARY_OWNER_ID,
  MIN_IPHONE_VERSION_FOR_LOCK_SCREEN,
  MIN_VERSION_FOR_CONTROL_CENTER,
  MIN_WATCH_VERSION_FOR_CHART_LOOKS,
  MIN_WATCH_VERSION_FOR_SHAPES,
  compareVersions,
  deviceKindOf,
  deviceNoun,
  deviceSupportsControls,
  deviceSupportsShapes,
  isLibraryOwner,
  ownerSupportsControls,
  parseVersion,
  updateDeviceMessage,
  updateIPhoneMessage,
  updateWatchMessage,
  versionForCopy,
  watchSupportsShapes,
  watchVersionNote,
} from "../src/version.js";

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
      "This watch runs Wrist Assistant 2.7.2. The editor needs 3.0 or later. Update Wrist Assistant on your iPhone; the watch app updates with it.",
    );
  });

  it("says so when the watch never reported a version", () => {
    expect(updateWatchMessage(null, "2.8.0")).toMatch(/^This watch has not reported its Wrist Assistant version yet\./);
    expect(updateWatchMessage("beta", "2.8.0")).toMatch(/^This watch has not reported/);
  });
});

describe("versionForCopy", () => {
  it("names the first public version for a minimum only testers had", () => {
    expect(versionForCopy("2.8.0")).toBe("3.0");
    expect(versionForCopy("2.9")).toBe("3.0");
  });

  it("names a later minimum as it is, without a .0 patch", () => {
    expect(versionForCopy("3.0.0")).toBe("3.0");
    expect(versionForCopy("3.1.0")).toBe("3.1");
    expect(versionForCopy("3.1.2")).toBe("3.1.2");
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

  // The one owner that is not a device: the home's shelf.
  it("reads the library from either the kind or the reserved id", () => {
    expect(deviceKindOf({ device_kind: "library" })).toBe("library");
    expect(deviceKindOf({ owner_watch_id: LIBRARY_OWNER_ID })).toBe("library");
    // An older integration names the id without knowing the kind, and the id
    // is the reserved word itself, so it wins over the fallback to "watch".
    expect(deviceKindOf({ owner_watch_id: LIBRARY_OWNER_ID, device_kind: null })).toBe("library");
    expect(deviceNoun({ device_kind: "library" })).toBe("library");
  });
});

describe("isLibraryOwner", () => {
  it("is true for either half and false for every device", () => {
    expect(isLibraryOwner({ device_kind: "library" })).toBe(true);
    expect(isLibraryOwner({ owner_watch_id: LIBRARY_OWNER_ID })).toBe(true);
    expect(isLibraryOwner({ owner_watch_id: "watch-A", device_kind: "watch" })).toBe(false);
    expect(isLibraryOwner({ device_kind: "iphone" })).toBe(false);
    // An orphan reports no kind at all, and is still a device that went away.
    expect(isLibraryOwner({ owner_watch_id: "gone", device_kind: null })).toBe(false);
    expect(isLibraryOwner(null)).toBe(false);
    expect(isLibraryOwner(undefined)).toBe(false);
  });

  it("matches the reserved word the integration decides", () => {
    expect(LIBRARY_OWNER_ID).toBe("library");
  });
});

describe("ownerSupportsControls", () => {
  // The shelf draws nothing, so nothing about it can be too old. Holding the
  // control back there would lose it the moment the design went on a device
  // that draws one.
  it("always says yes for the library, whatever version it reports", () => {
    expect(ownerSupportsControls({ device_kind: "library" })).toBe(true);
    expect(ownerSupportsControls({ device_kind: "library", app_version: "1.0.0" })).toBe(true);
    expect(ownerSupportsControls({ owner_watch_id: LIBRARY_OWNER_ID, app_version: null })).toBe(true);
    // Even with the card switched off everywhere, which is what a null
    // minimum means for a real device.
    expect(ownerSupportsControls({ device_kind: "library" }, null)).toBe(true);
  });

  it("asks the version for a real device, exactly as the string form does", () => {
    for (const version of [MIN_VERSION_FOR_CONTROL_CENTER, "2.7.0", "3.0.0", null]) {
      expect(ownerSupportsControls({ device_kind: "watch", app_version: version })).toBe(
        deviceSupportsControls(version),
      );
    }
    expect(ownerSupportsControls({ device_kind: "iphone", app_version: "2.7.0" }, null)).toBe(false);
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

  // The gate is about what a device draws, and the library draws nothing. A
  // home whose only watch is too old can still build there and place it later.
  it("opens for the library with no version at all", () => {
    expect(deviceSupportsShapes({ device_kind: "library" })).toBe(true);
    expect(deviceSupportsShapes({ device_kind: "library", app_version: null })).toBe(true);
    expect(deviceSupportsShapes({ owner_watch_id: LIBRARY_OWNER_ID })).toBe(true);
    expect(deviceSupportsShapes({ device_kind: "library", app_version: "1.0.0" })).toBe(true);
  });
});

describe("updateIPhoneMessage", () => {
  // The phone is missing the widget extension, not a watch app, so the
  // sentence is its own rather than the watch's with a word swapped. Both
  // screens it draws on are named: one release brings the two.
  it("names the reported version and the minimum", () => {
    expect(updateIPhoneMessage("2.7.2", "2.8.0")).toBe(
      "This iPhone runs Wrist Assistant 2.7.2. Lock Screen and Home Screen complications need 3.0 or later. Update Wrist Assistant on your iPhone.",
    );
  });

  it("says so when the iPhone never reported a version", () => {
    expect(updateIPhoneMessage(null, "2.8.0")).toMatch(/^This iPhone has not reported its Wrist Assistant version yet\./);
  });

  it("is what the gate uses for a phone owner, and never for a watch", () => {
    expect(updateDeviceMessage({ app_version: "2.7.2", device_kind: "iphone" })).toBe(updateIPhoneMessage("2.7.2"));
    expect(updateDeviceMessage({ app_version: "2.7.2" })).toBe(updateWatchMessage("2.7.2"));
  });

  // There is no app behind the library, so there is nothing to ask anyone to
  // update and no sentence to draw.
  it("has nothing to say about the library", () => {
    expect(updateDeviceMessage({ device_kind: "library" })).toBe("");
    expect(updateDeviceMessage({ owner_watch_id: LIBRARY_OWNER_ID, app_version: "1.0.0" })).toBe("");
  });
});
