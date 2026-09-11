// Test values in the preview undo and redo with the document.

import { describe, expect, it } from "vitest";
import { Draft } from "../src/draft.js";
import { newConfig } from "../src/model.js";

describe("Draft test values", () => {
  it("puts a tried value back on undo and forward on redo", () => {
    const d = new Draft(newConfig("T", 0), null);
    d.setTestValues(new Map([["sensor.v", "120"]]));
    d.setTestValues(new Map([["sensor.v", "90"]]));
    d.undo();
    expect(d.testValues.get("sensor.v")).toBe("120");
    d.undo();
    expect(d.testValues.size).toBe(0);
    d.redo();
    expect(d.testValues.get("sensor.v")).toBe("120");
  });

  it("makes one slide one step", () => {
    const d = new Draft(newConfig("T", 0), null);
    for (const v of ["100", "110", "120", "130"]) d.setTestValues(new Map([["sensor.v", v]]), "test-sensor.v");
    d.endGesture();
    d.undo();
    expect(d.testValues.size).toBe(0);
    expect(d.canUndo).toBe(false);
  });

  it("walks test values and document edits in the order they were made", () => {
    const d = new Draft(newConfig("T", 0), null);
    d.setTestValues(new Map([["sensor.v", "120"]]));
    d.update((c) => { c.name = "Renamed"; });
    d.undo();
    expect(d.config.name).toBe("T");
    expect(d.testValues.get("sensor.v")).toBe("120");
    d.undo();
    expect(d.testValues.size).toBe(0);
  });

  it("never counts a test value as unsaved work", () => {
    const d = new Draft(newConfig("T", 0), null);
    d.setTestValues(new Map([["sensor.v", "120"]]));
    expect(d.dirty).toBe(false);
  });
});
