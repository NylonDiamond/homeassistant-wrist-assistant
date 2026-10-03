// What the page editor keeps between visits (one draft per watch, and the
// selection), how a record read from Home Assistant goes into it, what the
// panel's leave guards learn through `hook.ts`, and the words after a save.

import { beforeEach, describe, expect, it } from "vitest";

import { dropWatchPagesDrafts, registerWatchPagesDrafts, watchPagesDirty } from "../src/watch-pages/hook.js";
import {
  anyWatchPagesDirty,
  dropAllWatchPages,
  forgetWatchPagesDraft,
  keepWatchPagesSelection,
  keptWatchPagesDraft,
  keptWatchPagesSelection,
  takeWatchPagesRecord,
} from "../src/watch-pages/kept.js";
import { setWatchPageName } from "../src/watch-pages/edit.js";
import type { WatchPagesDocument } from "../src/watch-pages/model.js";
import { watchCommandError, watchPagesSaveNote } from "../src/watch-pages/save-note.js";

function doc(...names: string[]): WatchPagesDocument {
  return { schemaVersion: 1, pages: names.map((name, i) => ({ id: `P${i + 1}`, name, items: [] })) };
}

beforeEach(() => dropAllWatchPages());

describe("kept drafts", () => {
  it("makes a draft for a watch the first time a record is read", () => {
    const first = takeWatchPagesRecord("w1", doc("Home"), 3);
    expect(first.mergedIntoEdits).toBe(false);
    expect(first.draft.revision).toBe(3);
    expect(keptWatchPagesDraft("w1")).toBe(first.draft);
    expect(keptWatchPagesDraft("w2")).toBeUndefined();
  });

  it("keeps the same draft for the same revision, edits and all", () => {
    const { draft } = takeWatchPagesRecord("w1", doc("Home"), 3);
    draft.apply(setWatchPageName(draft.document, "P1", "Kitchen"));
    const again = takeWatchPagesRecord("w1", doc("Home"), 3);
    expect(again.draft).toBe(draft);
    expect(again.mergedIntoEdits).toBe(false);
    expect(draft.dirty).toBe(true);
  });

  it("rebases a dirty draft onto a newer record and says the edits were kept", () => {
    const { draft } = takeWatchPagesRecord("w1", doc("Home", "Lights"), 3);
    draft.apply(setWatchPageName(draft.document, "P1", "Kitchen"));
    const taken = takeWatchPagesRecord("w1", doc("Home", "All lights"), 4);
    expect(taken.draft).toBe(draft);
    expect(taken.mergedIntoEdits).toBe(true);
    expect(draft.revision).toBe(4);
    const names = (draft.document.pages as { name: string }[]).map((p) => p.name);
    expect(names).toEqual(["Kitchen", "All lights"]);
    // An undo keeps the other side's change.
    draft.undo();
    expect((draft.document.pages as { name: string }[]).map((p) => p.name)).toEqual(["Home", "All lights"]);
  });

  it("says nothing when a clean draft takes a newer record", () => {
    takeWatchPagesRecord("w1", doc("Home"), 3);
    const taken = takeWatchPagesRecord("w1", doc("Away"), 4);
    expect(taken.mergedIntoEdits).toBe(false);
    expect(taken.draft.dirty).toBe(false);
  });

  it("restarts a dirty draft on a record whose revision went back, so it can be saved again", () => {
    // The store started over: the draft is at revision 5, the iPhone then
    // uploads its first copy again as revision 1.
    const { draft } = takeWatchPagesRecord("w1", doc("Home", "Lights"), 5);
    draft.apply(setWatchPageName(draft.document, "P1", "Kitchen"));
    const version = draft.baseVersion;
    const taken = takeWatchPagesRecord("w1", doc("Home", "All lights"), 1);
    expect(taken.draft).toBe(draft);
    expect(taken.mergedIntoEdits).toBe(true);
    expect(draft.revision).toBe(1);
    expect(draft.baseVersion).toBe(version + 1);
    expect((draft.document.pages as { name: string }[]).map((p) => p.name)).toEqual(["Kitchen", "All lights"]);
    expect(draft.dirty).toBe(true);
    // The same record again is the same revision: nothing more happens.
    expect(takeWatchPagesRecord("w1", doc("Home", "All lights"), 1).mergedIntoEdits).toBe(false);
    expect(draft.baseVersion).toBe(version + 1);
  });

  it("leaves a kept draft alone while there is no record (revision 0)", () => {
    const { draft } = takeWatchPagesRecord("w1", doc("Home"), 4);
    draft.apply(setWatchPageName(draft.document, "P1", "Kitchen"));
    const taken = takeWatchPagesRecord("w1", doc(), 0);
    expect(taken.draft).toBe(draft);
    expect(draft.revision).toBe(4);
    expect(draft.dirty).toBe(true);
    expect(anyWatchPagesDirty()).toBe(true);
  });

  it("starts over when a clean draft meets an older revision, and keeps a dirty one", () => {
    const { draft } = takeWatchPagesRecord("w1", doc("Home"), 9);
    const restarted = takeWatchPagesRecord("w1", doc("New"), 1);
    expect(restarted.draft).not.toBe(draft);
    expect(restarted.draft.revision).toBe(1);
    restarted.draft.apply(setWatchPageName(restarted.draft.document, "P1", "Edited"));
    const kept = takeWatchPagesRecord("w1", doc("Other"), 1);
    expect(kept.draft).toBe(restarted.draft);
    const older = takeWatchPagesRecord("w1", doc("Older"), 0);
    expect(older.draft).toBe(restarted.draft);
    expect(older.draft.dirty).toBe(true);
  });

  it("knows when any watch holds edits, and forgets and drops", () => {
    const a = takeWatchPagesRecord("w1", doc("Home"), 1).draft;
    takeWatchPagesRecord("w2", doc("Home"), 1);
    expect(anyWatchPagesDirty()).toBe(false);
    a.apply(setWatchPageName(a.document, "P1", "Kitchen"));
    expect(anyWatchPagesDirty()).toBe(true);
    forgetWatchPagesDraft("w1");
    expect(keptWatchPagesDraft("w1")).toBeUndefined();
    expect(anyWatchPagesDirty()).toBe(false);
    keepWatchPagesSelection("w2", { pageId: "P1", tileId: "T" });
    expect(keptWatchPagesSelection("w2")).toEqual({ pageId: "P1", tileId: "T" });
    dropAllWatchPages();
    expect(keptWatchPagesDraft("w2")).toBeUndefined();
    expect(keptWatchPagesSelection("w2")).toEqual({});
  });
});

describe("the leave guard's probe", () => {
  it("asks the editor's chunk once it has said how", () => {
    let dropped = 0;
    let dirty = true;
    registerWatchPagesDrafts({ dirty: () => dirty, drop: () => { dropped++; } });
    expect(watchPagesDirty()).toBe(true);
    dirty = false;
    expect(watchPagesDirty()).toBe(false);
    dropWatchPagesDrafts();
    expect(dropped).toBe(1);
  });

  it("reaches the kept drafts the way the editor registers them", () => {
    registerWatchPagesDrafts({ dirty: anyWatchPagesDirty, drop: dropAllWatchPages });
    const draft = takeWatchPagesRecord("w1", doc("Home"), 1).draft;
    draft.apply(setWatchPageName(draft.document, "P1", "Kitchen"));
    expect(watchPagesDirty()).toBe(true);
    dropWatchPagesDrafts();
    expect(watchPagesDirty()).toBe(false);
    expect(keptWatchPagesDraft("w1")).toBeUndefined();
  });
});

describe("the words after a save", () => {
  const base = { revision: 5, merged: false };

  it("says a save landed, and when the iPhone's changes were merged in", () => {
    expect(watchPagesSaveNote({ ...base, ok: true })).toEqual({ kind: "ok", text: "Saved as revision 5." });
    expect(watchPagesSaveNote({ ...base, ok: true, merged: true }).text).toBe("Saved. Changes from the iPhone were merged in.");
  });

  it("names every way a save can fail in plain words", () => {
    expect(watchPagesSaveNote({ ...base, ok: false, code: "conflict" }).text).toMatch(/kept changing on the iPhone/);
    expect(watchPagesSaveNote({ ...base, ok: false, code: "no_record" }).text).toBe(
      "Not saved. Home Assistant no longer holds pages for this watch. Open the iPhone app with Edit pages in Home Assistant turned on, then save again.",
    );
    expect(watchPagesSaveNote({ ...base, ok: false, code: "unavailable" }).kind).toBe("warn");
    expect(watchPagesSaveNote({ ...base, ok: false, code: "invalid", problems: ["Page 1 has no id."] }).text)
      .toBe("Not saved. Something in the pages is not right: Page 1 has no id.");
    expect(watchPagesSaveNote({ ...base, ok: false, code: "invalid", message: "bad shape" }).text)
      .toBe("Not saved. Home Assistant refused the pages: bad shape");
    expect(watchPagesSaveNote({ ...base, ok: false, code: "unknown", message: "socket closed" }).text).toBe("Not saved: socket closed");
    expect(watchPagesSaveNote({ ...base, ok: false, code: "unknown" }).text).toBe("Not saved.");
    expect(watchPagesSaveNote({ ...base, ok: false, code: "busy" }).text).toMatch(/Already saving/);
  });

  it("says when the iPhone had saved the same changes, so nothing was sent", () => {
    expect(watchPagesSaveNote({ ...base, ok: true, merged: true, alreadySaved: true }).text).toBe(
      "Nothing left to save. The iPhone saved the same changes, as revision 5.",
    );
  });

  it("never breaks a sentence with a dash", () => {
    const codes = ["conflict", "no_record", "invalid", "unavailable", "busy", "other"];
    for (const code of codes) {
      const { text } = watchPagesSaveNote({ ...base, ok: false, code, message: "x" });
      expect(text).not.toMatch(/ - |–|—/);
    }
  });
});

describe("a refused command's words", () => {
  it("reads a code and a message at the top, as Home Assistant refuses", () => {
    expect(watchCommandError({ code: "conflict", message: "stored revision is 4" })).toEqual({ code: "conflict", message: "stored revision is 4" });
    expect(watchCommandError(Object.assign(new Error("boom"), { code: "invalid" }))).toEqual({ code: "invalid", message: "boom" });
  });

  it("digs into a dropped connection's nested result, whose code is a number", () => {
    const lost = { type: "result", success: false, error: { code: 3, message: "Connection lost" } };
    expect(watchCommandError(lost)).toEqual({ message: "Connection lost" });
    expect(watchCommandError({ error: { code: "unavailable" } })).toEqual({ code: "unavailable", message: "unavailable" });
  });

  it("says there is no connection when nothing names the fault", () => {
    expect(watchCommandError({}).message).toBe("No connection to Home Assistant.");
    expect(watchCommandError(undefined).message).toBe("No connection to Home Assistant.");
    expect(watchCommandError({ error: { code: 3 } }).message).toBe("No connection to Home Assistant.");
    expect(watchCommandError("socket closed")).toEqual({ message: "socket closed" });
  });
});
