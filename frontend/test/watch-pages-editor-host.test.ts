// The page editor's host for the 3c modules: a drag on a number field is one
// undo step on the page draft, whatever keys its edits carry, and it ends the
// run that was going before it.

import { describe, expect, it } from "vitest";

import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { NO_ICONS, ScrubRun, extendHost, memoIconNames } from "../src/watch-pages/editor-host.js";
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

describe("a host read live", () => {
  it("keeps the base's getters through extendHost, where a spread copies them once", () => {
    let document = { pages: [1] } as unknown as WatchPagesDocument;
    const base = Object.defineProperties({ pageId: "P", apply: () => true }, {
      document: { get: () => document, enumerable: true },
    }) as { pageId: string; apply: () => boolean; readonly document: WatchPagesDocument };
    let tile = "a";
    const host = extendHost(base, { tileId: () => "T", tile: () => tile });
    const spread = { ...base };
    document = { pages: [2] } as unknown as WatchPagesDocument;
    tile = "b";
    expect(host.document).toBe(document);
    expect(spread.document).not.toBe(document);
    expect(host.tile).toBe("b");
    expect(host.pageId).toBe("P");
    expect(host.apply()).toBe(true);
    // A host made from a host keeps both layers live.
    const twice = extendHost(host, { close: () => () => undefined });
    tile = "c";
    expect([twice.tile, twice.document, typeof twice.close]).toEqual(["c", document, "function"]);
  });
});

describe("the symbol names asked once", () => {
  it("answers the same array until a new memo is made, and asks again while loading", () => {
    let calls = 0;
    let loaded = false;
    const provider = {
      render: () => undefined,
      available: () => true,
      names: () => {
        calls += 1;
        return loaded ? ["b", "a"].sort() : undefined;
      },
      mdiPath: (name: string) => `path:${name}`,
    };
    const icons = memoIconNames(provider);
    expect(icons.names()).toBeUndefined();
    loaded = true;
    const first = icons.names();
    expect(first).toEqual(["a", "b"]);
    expect(icons.names()).toBe(first);
    expect(calls).toBe(2);
    expect(icons.mdiPath?.("mdi:x")).toBe("path:mdi:x");
    expect(icons.mdiNames).toBeUndefined();
    expect(memoIconNames(NO_ICONS).names()).toEqual([]);
  });
});

describe("the settings' notes and the symbol name set", () => {
  it("drops every field's refusal and nothing else when the selection changes", async () => {
    const { forgetTileSettingsNotes } = await import("../src/watch-pages/tile-settings.js");
    const state = new Map<string, unknown>([
      ["tile-settings:note:A:iconSize", "Use 8 to 23."],
      ["tile-settings:note:B:fontSize", "Use 4 to 16."],
      ["tile-settings:typed:A:label", "Kit"],
      ["tile-settings:open:text", true],
    ]);
    forgetTileSettingsNotes(state);
    expect([...state.keys()]).toEqual(["tile-settings:typed:A:label", "tile-settings:open:text"]);
  });

  it("is one set per names array", async () => {
    const { symbolNameSet } = await import("../src/editors.js");
    const names = ["a", "b"];
    expect(symbolNameSet(names)).toBe(symbolNameSet(names));
    expect(symbolNameSet(names).has("b")).toBe(true);
    expect(symbolNameSet(["a", "b"])).not.toBe(symbolNameSet(names));
  });
});
