// The tap action menu: every action has a heading and a line saying what it
// does, and the line owns up on an iPhone to the actions that need the watch.

import { describe, expect, it } from "vitest";
import { TAP_ACTION_GROUPS, TAP_ACTION_LABELS, tapActionInfo } from "../src/model.js";

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

  it("warns on iPhone only for the actions that need the watch", () => {
    for (const type of ["openPage", "openRoomPage", "addTodo"] as const) {
      expect(tapActionInfo(type, true)).toContain("On iPhone this only opens the app.");
      expect(tapActionInfo(type)).not.toContain("iPhone");
    }
    expect(tapActionInfo("toggleEntity", true)).not.toContain("iPhone");
  });
});
