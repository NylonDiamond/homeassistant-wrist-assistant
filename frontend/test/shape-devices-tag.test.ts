// The All tab's shape boxes say which devices use their shape.

import { describe, expect, it } from "vitest";
import { shapeDevicesTag } from "../src/panel.js";

describe("shapeDevicesTag", () => {
  it("names the watch for a corner, the iPhone Home Screen for the widget sizes, and both for the rest", () => {
    expect(shapeDevicesTag("corner")?.text).toBe("Watch");
    for (const size of ["small", "medium", "large", "xlarge"]) expect(shapeDevicesTag(size)?.text).toBe("iPhone Home Screen");
    for (const shape of ["rectangular", "circular", "inline"]) {
      expect(shapeDevicesTag(shape)).toEqual({ text: "Watch and iPhone Lock Screen", icons: ["watch", "phone"] });
    }
  });

  it("says nothing for a box with no shape", () => {
    expect(shapeDevicesTag("control")).toBeUndefined();
    expect(shapeDevicesTag("app")).toBeUndefined();
    expect(shapeDevicesTag("none")).toBeUndefined();
  });
});
