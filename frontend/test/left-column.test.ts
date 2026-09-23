// The editor's left column and top bar: the words a tap layer goes by, and
// the small decisions the Pages card, the Layers card and the Add sheet make.

import { describe, expect, it } from "vitest";

import { KIND_LABEL } from "../src/kinds.js";

describe("the tap layer's name", () => {
  it("is a tap zone wherever the kind is named", () => {
    expect(KIND_LABEL.tap).toBe("Tap zone");
  });

  it("keeps no trace of the old word", () => {
    expect(Object.values(KIND_LABEL)).not.toContain("Tap area");
  });
});
