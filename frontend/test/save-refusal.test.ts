// A complication is one shape. A document an older panel wrote, with several
// of them, still opens and still draws; the save is what refuses.

import { describe, expect, it } from "vitest";
import { saveRefusal } from "../src/draft.js";
import { legacyConfig, newConfig, newControlConfig } from "../src/model.js";

describe("saveRefusal", () => {
  it("lets a one-shape document through", () => {
    expect(saveRefusal(newConfig("Kitchen", 0, "rectangular"))).toBeUndefined();
    expect(saveRefusal(newConfig("Kitchen", 0, "inline"))).toBeUndefined();
  });

  it("lets a control with no shape through", () => {
    expect(saveRefusal(newControlConfig("Kettle", 0))).toBeUndefined();
  });

  it("refuses a document with two shapes, and says how many", () => {
    const refusal = saveRefusal(legacyConfig("Kitchen", 0, ["rectangular", "circular"]));
    expect(refusal).toContain("2 shapes");
    expect(refusal).toContain("one shape now");
  });

  it("refuses the three-shape document every older panel wrote", () => {
    expect(saveRefusal(legacyConfig("Kitchen", 0))).toContain("3 shapes");
  });

  it("refuses a control that also carries several shapes", () => {
    expect(saveRefusal(newControlConfig("Kettle", 0, "rectangular"))).toBeUndefined();
    const many = legacyConfig("Kettle", 0, ["rectangular", "circular"]);
    expect(saveRefusal(many)).toBeDefined();
  });
});
