// The page editor's host for the 3c modules: a drag on a number field is one
// undo step on the page draft, whatever keys its edits carry, and it ends the
// run that was going before it.

import { describe, expect, it } from "vitest";

import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { NO_ICONS, ScrubRun } from "../src/watch-pages/editor-host.js";
import type { WatchPagesDocument } from "../src/watch-pages/model.js";

function doc(name: string): WatchPagesDocument {
  return { schemaVersion: 1, pages: [{ id: "P", name, items: [] }] };
}

/** What the page editor does on `SCRUB_START`, `SCRUB_END` and an apply. */
function editor(draft: WatchPagesDraft) {
  const scrub = new ScrubRun();
  return {
    scrub,
    start: () => { draft.endCoalesce(); scrub.start(); },
    end: () => { if (scrub.end()) draft.endCoalesce(); },
    apply: (next: WatchPagesDocument, coalesce?: string) => draft.apply(next, scrub.options(coalesce === undefined ? undefined : { coalesce })),
  };
}

describe("ScrubRun", () => {
  it("passes an edit's own options through when no drag is going on", () => {
    const run = new ScrubRun();
    expect(run.active).toBe(false);
    expect(run.options()).toBeUndefined();
    expect(run.options({ coalesce: "name" })).toEqual({ coalesce: "name" });
  });

  it("gives every edit during a drag the drag's key, and each drag a new one", () => {
    const run = new ScrubRun();
    run.start();
    expect(run.active).toBe(true);
    const first = run.options()?.coalesce;
    expect(first).toBeDefined();
    expect(run.options({ coalesce: "size" })?.coalesce).toBe(first);
    expect(run.end()).toBe(true);
    expect(run.end()).toBe(false);
    run.start();
    expect(run.options()?.coalesce).not.toBe(first);
  });

  it("makes a drag one undo step on the draft", () => {
    const draft = new WatchPagesDraft(doc("A"), 1);
    const e = editor(draft);
    e.start();
    e.apply(doc("B"));
    e.apply(doc("C"), "some-field");
    e.apply(doc("D"));
    e.end();
    expect(draft.undoDepth).toBe(1);
    draft.undo();
    expect(draft.document).toEqual(doc("A"));
  });

  it("ends a typing run before a drag and the drag's run after it", () => {
    const draft = new WatchPagesDraft(doc("A"), 1);
    const e = editor(draft);
    e.apply(doc("B"), "label");
    e.apply(doc("C"), "label");
    e.start();
    e.apply(doc("D"));
    e.end();
    e.apply(doc("E"), "label");
    // Typing (A to C), the drag (to D), typing again (to E).
    expect(draft.undoDepth).toBe(3);
  });
});

describe("NO_ICONS", () => {
  it("draws nothing and lists nothing, so the symbol grid shows names only", () => {
    expect(NO_ICONS.available()).toBe(false);
    expect(NO_ICONS.names()).toEqual([]);
    expect(NO_ICONS.render("star.fill", 22, "#FFFFFF")).toBeUndefined();
  });
});
