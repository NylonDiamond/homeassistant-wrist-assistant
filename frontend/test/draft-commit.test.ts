// A save moves the baseline and leaves undo alone. Ctrl-Z right after Save
// used to do nothing, because the draft was rebuilt from the stored document
// with empty stacks.

import { describe, expect, it } from "vitest";
import { Draft } from "../src/draft.js";
import { newConfig } from "../src/model.js";

describe("Draft commit", () => {
  it("keeps undo alive across a save", () => {
    const d = new Draft(newConfig("T", 0), null);
    d.update((c) => { c.name = "Renamed"; });
    const saved = d.commit(4);

    expect(saved.baseRevision).toBe(4);
    expect(saved.dirty).toBe(false);
    expect(saved.canUndo).toBe(true);

    saved.undo();
    expect(saved.config.name).toBe("T");
  });

  it("reads dirty again once undo walks off the saved document", () => {
    const d = new Draft(newConfig("T", 0), null);
    d.update((c) => { c.name = "Renamed"; });
    const saved = d.commit(4);

    saved.undo();
    expect(saved.dirty).toBe(true);
    // And redo lands back on exactly what was saved, so Save goes quiet.
    saved.redo();
    expect(saved.config.name).toBe("Renamed");
    expect(saved.dirty).toBe(false);
  });

  it("carries redo across a save too", () => {
    const d = new Draft(newConfig("T", 0), null);
    d.update((c) => { c.name = "Renamed"; });
    d.undo();
    const saved = d.commit(4);

    expect(saved.canRedo).toBe(true);
    saved.redo();
    expect(saved.config.name).toBe("Renamed");
    expect(saved.dirty).toBe(true);
  });

  it("keeps the values being tried", () => {
    const d = new Draft(newConfig("T", 0), null);
    d.setTestValues(new Map([["sensor.v", "120"]]));
    const saved = d.commit(2);
    expect(saved.testValues.get("sensor.v")).toBe("120");
    expect(saved.dirty).toBe(false);
  });

  it("keeps edits made while a save is in flight unsaved", () => {
    const d = new Draft(newConfig("T", 0), null);
    d.update((c) => { c.name = "First edit"; });
    const sent = d.encoded();
    d.update((c) => { c.name = "Second edit"; });

    const afterSave = d.commit(1, sent);
    expect(afterSave.config.name).toBe("Second edit");
    expect(afterSave.dirty).toBe(true);
    expect(afterSave.baseRevision).toBe(1);

    afterSave.undo();
    expect(afterSave.config.name).toBe("First edit");
    expect(afterSave.dirty).toBe(false);
  });

  it("reads clean when the submitted document is still the current draft", () => {
    const d = new Draft(newConfig("T", 0), null);
    d.update((c) => { c.name = "Saved name"; });

    expect(d.commit(1, d.encoded()).dirty).toBe(false);
  });
});
