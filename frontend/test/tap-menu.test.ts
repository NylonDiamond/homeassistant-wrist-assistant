// The tap action menu: every action has a heading and a line saying what it
// does, and the line owns up on an iPhone to the actions that need the watch.

import { describe, expect, it } from "vitest";
import { TAP_ACTION_GROUPS, TAP_ACTION_LABELS, tapActionInfo } from "../src/model.js";
import { tapMenuPhone } from "../src/editors.js";

describe("the tap action menu", () => {
  it("files every action under a heading", () => {
    const grouped = TAP_ACTION_GROUPS.flatMap(([, types]) => types);
    for (const [type] of TAP_ACTION_LABELS) {
      if (type === "none") continue; // offered nowhere; a stored one goes last, unheaded
      expect(grouped, type).toContain(type);
    }
    expect(new Set(grouped).size).toBe(grouped.length);
  });

  it("says what every action does", () => {
    for (const [type] of TAP_ACTION_LABELS) expect(tapActionInfo(type).length, type).toBeGreaterThan(10);
  });

  it("warns on iPhone only when it reported a version that cannot open the target", () => {
    for (const type of ["openPage", "openEntity", "openRoomPage", "addTodo"] as const) {
      expect(tapActionInfo(type, "ios-old")).toContain("On iPhone, HouseLit before 3.2 only opens the app.");
      expect(tapActionInfo(type, true)).toBe(tapActionInfo(type));
      expect(tapActionInfo(type)).not.toContain("iPhone");
    }
    expect(tapActionInfo("toggleEntity", "ios-old")).not.toContain("iPhone");
  });

  it("gives the caveat only to an iPhone that reported a version before 3.2", () => {
    expect(tapMenuPhone({ deviceKind: "iphone", watchAppVersion: "3.1.2" })).toBe("ios-old");
    expect(tapMenuPhone({ deviceKind: "iphone", watchAppVersion: "3.2.0" })).toBe(true);
    expect(tapMenuPhone({ deviceKind: "iphone", watchAppVersion: "3.2.0 (23)" })).toBe(true);
    // Not reported: most likely current, so no nag.
    expect(tapMenuPhone({ deviceKind: "iphone", watchAppVersion: null })).toBe(true);
    expect(tapMenuPhone({ deviceKind: "iphone" })).toBe(true);
    expect(tapMenuPhone({ deviceKind: "iphone", platform: "android", watchAppVersion: "0.1.0" })).toBe("android");
    expect(tapMenuPhone({ deviceKind: "watch", watchAppVersion: "3.1.2" })).toBe(false);
  });

  it("names the app, not the watch app, for the actions that open it", () => {
    expect(tapActionInfo("addTodo")).toBe("Opens the app to add an item to a to-do list.");
    expect(tapActionInfo("openEntity")).toBe("Opens the app on the controls of the entity you pick.");
    expect(tapActionInfo("openPage")).toBe("Opens one page of your HouseLit pages. You pick the page.");
  });
});
