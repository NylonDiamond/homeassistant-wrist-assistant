import { noChange } from "lit";
import { describe, expect, it } from "vitest";
import { homeMapTypedValue } from "../src/home-map/editor-parts.js";

// The panel draws again on every Home Assistant state change. A field being
// typed in must keep what is typed, or a typed size goes back at once.
describe("a typed field on a draw", () => {
  it("keeps what is being typed", () => {
    expect(homeMapTypedValue("0.8", "0.91", true)).toBe(noChange);
  });

  it("takes the drawn value once it has lost the typing", () => {
    expect(homeMapTypedValue("0.91", "0.80", false)).toBe("0.80");
  });

  it("leaves a field that already shows the value", () => {
    expect(homeMapTypedValue("0.91", "0.91", false)).toBe(noChange);
  });
});
