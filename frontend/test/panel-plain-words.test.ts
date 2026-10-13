// Sentences the panel builds around a name: a device that is full, and the
// question before unsaved work goes.

import { describe, expect, it } from "vitest";
import { discardPrompt, fullForShapeText } from "../src/panel.js";
import { UNASSIGNED_LIST } from "../src/pickerRows.js";

describe("fullForShapeText", () => {
  it("says a device is full, in slots, with no seat number", () => {
    expect(fullForShapeText("Jesse's Watch"))
      .toBe("Jesse's Watch is full for this shape. Presets made in the iPhone app count too.");
  });

  it("starts the shelf's sentence with a capital", () => {
    expect(fullForShapeText(UNASSIGNED_LIST)).toMatch(/^The Not on a device list is full/);
  });
});

describe("discardPrompt", () => {
  it("names the design whose changes would go", () => {
    expect(discardPrompt("Kitchen")).toBe("Leave without saving your changes to “Kitchen”?");
    expect(discardPrompt("  ")).toBe("Leave without saving your changes?");
    expect(discardPrompt(undefined)).toBe("Leave without saving your changes?");
  });
});
