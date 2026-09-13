// The words under a states table: its empty state and the line beside each add control.

import { describe, expect, it } from "vitest";
import { statesAddNotes, statesEmptyText } from "../src/states.js";

describe("states table wording", () => {
  it("says layer, or shape for a layout", () => {
    expect(statesEmptyText("icon")).toContain("layer");
    expect(statesEmptyText("layout")).toContain("shape");
    expect(statesAddNotes("layout").state).toContain("shape");
  });

  it("writes one short sentence per control, with no dashes", () => {
    for (const target of ["text", "chart", "layout"]) {
      const notes = statesAddNotes(target);
      for (const line of [notes.state, notes.otherwise, notes.column, statesEmptyText(target)]) {
        expect(line).toMatch(/^[A-Z][^.]*\.( [A-Z][^.]*\.)?$/);
        expect(line).not.toMatch(/[—–]| - /);
      }
    }
  });
});
