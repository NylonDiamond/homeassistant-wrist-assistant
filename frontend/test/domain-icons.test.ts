// The two things the entity search says in words rather than pictures: what a
// domain is called, and whether a state means "doing something right now".

import { describe, expect, it } from "vitest";
import { domainLabel, isActiveState } from "../src/domain-icons.js";

describe("domainLabel", () => {
  it("uses Home Assistant's own wording where it differs from the id", () => {
    expect(domainLabel("binary_sensor")).toBe("Binary sensor");
    expect(domainLabel("media_player")).toBe("Media player");
    expect(domainLabel("input_boolean")).toBe("Toggle helper");
  });

  it("title cases anything it has no special name for", () => {
    expect(domainLabel("light")).toBe("Light");
    expect(domainLabel("script")).toBe("Script");
    expect(domainLabel("lawn_mower")).toBe("Lawn mower");
  });

  it("says nothing for an entity with no domain", () => {
    expect(domainLabel("")).toBe("");
  });
});

describe("isActiveState", () => {
  it("counts the states that mean the thing is running", () => {
    for (const s of ["on", "open", "playing", "home", "cleaning", "unlocked"]) {
      expect(isActiveState(s)).toBe(true);
    }
  });

  it("leaves everything else quiet", () => {
    for (const s of ["off", "closed", "idle", "unavailable", "unknown", "", "12.4"]) {
      expect(isActiveState(s)).toBe(false);
    }
  });

  it("ignores case and stray spaces", () => {
    expect(isActiveState(" On ")).toBe(true);
  });
});
