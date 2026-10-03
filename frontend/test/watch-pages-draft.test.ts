// The page config draft: undo and redo, coalesced edits, dirty by JSON
// equality, rebasing onto a newer document from Home Assistant, and the save
// that merges and tries again on a conflict.

import { describe, expect, it, vi } from "vitest";

import type { JsonObject, WatchPagesDocument } from "../src/watch-pages/model.js";
import {
  WATCH_PAGES_SAVE_ATTEMPTS,
  WATCH_PAGES_UNDO_LIMIT,
  WatchPagesDraft,
  type WatchPagesSaveIO,
  saveWatchPagesDraft,
} from "../src/watch-pages/draft.js";

// ── documents ────────────────────────────────────────────────────────────

const PAGE = "C52206FB-F7ED-4FB7-95F4-E6519A2865FC";
const A = "1D9ADA72-6F73-45E7-B7A2-6A1CD828AC14";
const B = "686E2455-977D-4F0B-914F-BA804DC98CEA";

function document(): WatchPagesDocument {
  return {
    schemaVersion: 1,
    pages: [
      {
        id: PAGE,
        name: "Home",
        items: [
          { id: A, entityId: "light.kitchen", gridCol: 0, gridRow: 0, colSpan: 6, rowSpan: 3 },
          { id: B, entityId: "fan.bedroom", gridCol: 6, gridRow: 0, colSpan: 6, rowSpan: 3 },
        ],
      },
    ],
  };
}

/** `doc` with one tile's keys changed; only the objects on the path are new. */
function withTile(doc: WatchPagesDocument, tileId: string, keys: JsonObject): WatchPagesDocument {
  const pages = doc.pages as JsonObject[];
  const page = pages[0]!;
  const items = (page.items as JsonObject[]).map((t) => (t.id === tileId ? { ...t, ...keys } : t));
  return { ...doc, pages: [{ ...page, items }, ...pages.slice(1)] };
}

function withName(doc: WatchPagesDocument, name: string): WatchPagesDocument {
  const pages = doc.pages as JsonObject[];
  return { ...doc, pages: [{ ...pages[0]!, name }, ...pages.slice(1)] };
}

function tile(doc: WatchPagesDocument, tileId: string): JsonObject {
  return ((doc.pages as JsonObject[])[0]!.items as JsonObject[]).find((t) => t.id === tileId)!;
}

function nameOf(doc: WatchPagesDocument): unknown {
  return (doc.pages as JsonObject[])[0]!.name;
}

// ── apply, undo, redo ────────────────────────────────────────────────────

describe("WatchPagesDraft", () => {
  it("starts clean on the document it was given", () => {
    const doc = document();
    const draft = new WatchPagesDraft(doc, 4);
    expect(draft.base).toBe(doc);
    expect(draft.document).toBe(doc);
    expect(draft.revision).toBe(4);
    expect(draft.dirty).toBe(false);
    expect(draft.canUndo).toBe(false);
    expect(draft.canRedo).toBe(false);
  });

  it("applies, undoes and redoes", () => {
    const doc = document();
    const draft = new WatchPagesDraft(doc, 1);
    const one = withName(doc, "One");
    const two = withName(one, "Two");
    expect(draft.apply(one)).toBe(true);
    expect(draft.apply(two)).toBe(true);
    expect(draft.document).toBe(two);
    expect(draft.dirty).toBe(true);

    expect(draft.undo()).toBe(true);
    expect(draft.document).toBe(one);
    expect(draft.canRedo).toBe(true);
    expect(draft.undo()).toBe(true);
    expect(draft.document).toBe(doc);
    expect(draft.dirty).toBe(false);
    expect(draft.undo()).toBe(false);

    expect(draft.redo()).toBe(true);
    expect(draft.redo()).toBe(true);
    expect(draft.document).toBe(two);
    expect(draft.redo()).toBe(false);
  });

  it("clears redo on a new edit", () => {
    const doc = document();
    const draft = new WatchPagesDraft(doc, 1);
    draft.apply(withName(doc, "One"));
    draft.undo();
    expect(draft.canRedo).toBe(true);
    draft.apply(withName(doc, "Other"));
    expect(draft.canRedo).toBe(false);
    expect(draft.undoDepth).toBe(1);
  });

  it("does nothing for the same document or the same JSON", () => {
    const doc = document();
    const draft = new WatchPagesDraft(doc, 1);
    expect(draft.apply(doc)).toBe(false);
    expect(draft.apply(document())).toBe(false);
    expect(draft.apply(JSON.parse(JSON.stringify(doc)))).toBe(false);
    expect(draft.canUndo).toBe(false);
    expect(draft.document).toBe(doc);
  });

  it("keeps at most 100 undo steps, dropping the oldest", () => {
    const doc = document();
    const draft = new WatchPagesDraft(doc, 1);
    const steps: WatchPagesDocument[] = [];
    for (let i = 1; i <= 120; i++) {
      const next = withName(doc, `Name ${i}`);
      steps.push(next);
      draft.apply(next);
    }
    expect(WATCH_PAGES_UNDO_LIMIT).toBe(100);
    expect(draft.undoDepth).toBe(100);
    while (draft.undo()) {
      // all the way back
    }
    expect(draft.document).toBe(steps[19]);
    expect(draft.redoDepth).toBe(100);
  });

  it("is clean again when an edit is undone by hand", () => {
    const doc = document();
    const draft = new WatchPagesDraft(doc, 1);
    draft.apply(withName(doc, "Changed"));
    expect(draft.dirty).toBe(true);
    expect(draft.dirty).toBe(true);
    draft.apply(withName(draft.document, "Home"));
    expect(draft.document).not.toBe(doc);
    expect(draft.dirty).toBe(false);
    expect(draft.canUndo).toBe(true);
  });

  describe("coalescing", () => {
    it("makes one step of edits with the same key", () => {
      const doc = document();
      const draft = new WatchPagesDraft(doc, 1);
      draft.apply(withTile(doc, A, { gridRow: 1 }), { coalesce: "drag" });
      draft.apply(withTile(doc, A, { gridRow: 2 }), { coalesce: "drag" });
      const last = withTile(doc, A, { gridRow: 3 });
      draft.apply(last, { coalesce: "drag" });
      expect(draft.document).toBe(last);
      expect(draft.undoDepth).toBe(1);
      draft.undo();
      expect(draft.document).toBe(doc);
    });

    it("ends at endCoalesce", () => {
      const doc = document();
      const draft = new WatchPagesDraft(doc, 1);
      draft.apply(withTile(doc, A, { gridRow: 1 }), { coalesce: "drag" });
      draft.endCoalesce();
      draft.apply(withTile(doc, A, { gridRow: 2 }), { coalesce: "drag" });
      expect(draft.undoDepth).toBe(2);
    });

    it("ends at an edit with another key or none", () => {
      const doc = document();
      const draft = new WatchPagesDraft(doc, 1);
      draft.apply(withTile(doc, A, { gridRow: 1 }), { coalesce: "drag" });
      draft.apply(withTile(draft.document, A, { customLabel: "x" }), { coalesce: "label" });
      draft.apply(withTile(draft.document, A, { customLabel: "xy" }), { coalesce: "label" });
      expect(draft.undoDepth).toBe(2);
      draft.apply(withName(draft.document, "Plain"));
      draft.apply(withTile(draft.document, A, { customLabel: "xyz" }), { coalesce: "label" });
      expect(draft.undoDepth).toBe(4);
    });

    it("ends at undo", () => {
      const doc = document();
      const draft = new WatchPagesDraft(doc, 1);
      draft.apply(withName(doc, "a"), { coalesce: "name" });
      draft.apply(withName(doc, "ab"), { coalesce: "name" });
      draft.undo();
      draft.apply(withName(doc, "abc"), { coalesce: "name" });
      expect(draft.undoDepth).toBe(1);
      draft.apply(withName(doc, "abcd"), { coalesce: "name" });
      expect(draft.undoDepth).toBe(1);
    });

    it("leaves no step for a drag that ends where it began", () => {
      const doc = document();
      const draft = new WatchPagesDraft(doc, 1);
      draft.apply(withName(doc, "Before"));
      const before = draft.document;
      draft.apply(withTile(before, A, { gridRow: 1 }), { coalesce: "drag" });
      draft.apply(withTile(before, A, { gridRow: 0 }), { coalesce: "drag" });
      expect(draft.undoDepth).toBe(1);
      expect(draft.document).toBe(before);
      // The drag goes on: a step again.
      draft.apply(withTile(before, A, { gridRow: 4 }), { coalesce: "drag" });
      expect(draft.undoDepth).toBe(2);
      draft.undo();
      expect(draft.document).toBe(before);
    });
  });

  // ── rebase ─────────────────────────────────────────────────────────────

  describe("rebase", () => {
    it("makes a clean draft the server's very document", () => {
      const doc = document();
      const draft = new WatchPagesDraft(doc, 1);
      const server = withTile(document(), B, { color: "#FF0000" });
      expect(draft.rebase(server, 2)).toBe(true);
      expect(draft.document).toBe(server);
      expect(draft.base).toBe(server);
      expect(draft.revision).toBe(2);
      expect(draft.dirty).toBe(false);
      expect(draft.canUndo).toBe(false);
    });

    it("keeps a clean draft clean when an edit was undone by hand", () => {
      const doc = document();
      const draft = new WatchPagesDraft(doc, 1);
      draft.apply(withName(doc, "x"));
      draft.apply(withName(draft.document, "Home"));
      const server = withTile(document(), B, { color: "#FF0000" });
      draft.rebase(server, 2);
      expect(draft.document).toBe(server);
      expect(draft.dirty).toBe(false);
    });

    it("keeps the draft's edit and the server's edit of another tile", () => {
      const doc = document();
      const draft = new WatchPagesDraft(doc, 1);
      draft.apply(withTile(doc, A, { customLabel: "Kitchen" }));
      const server = withTile(document(), B, { color: "#FF0000" });
      expect(draft.rebase(server, 2)).toBe(true);
      expect(tile(draft.document, A).customLabel).toBe("Kitchen");
      expect(tile(draft.document, B).color).toBe("#FF0000");
      expect(draft.base).toBe(server);
      expect(draft.revision).toBe(2);
      expect(draft.dirty).toBe(true);
    });

    it("rebases undo steps, so an undo keeps the server's change", () => {
      const doc = document();
      const draft = new WatchPagesDraft(doc, 1);
      draft.apply(withTile(doc, A, { customLabel: "Kitchen" }));
      draft.apply(withName(draft.document, "Mine"));
      const server = withTile(document(), B, { color: "#FF0000" });
      draft.rebase(server, 2);
      expect(draft.undoDepth).toBe(2);

      draft.undo();
      expect(nameOf(draft.document)).toBe("Home");
      expect(tile(draft.document, A).customLabel).toBe("Kitchen");
      expect(tile(draft.document, B).color).toBe("#FF0000");
      draft.undo();
      expect(draft.document).toBe(server);
      expect(draft.dirty).toBe(false);
    });

    it("rebases redo steps", () => {
      const doc = document();
      const draft = new WatchPagesDraft(doc, 1);
      draft.apply(withName(doc, "Mine"));
      draft.undo();
      const server = withTile(document(), B, { color: "#FF0000" });
      expect(draft.rebase(server, 2)).toBe(true);
      expect(draft.document).toBe(server);
      draft.redo();
      expect(nameOf(draft.document)).toBe("Mine");
      expect(tile(draft.document, B).color).toBe("#FF0000");
    });

    it("makes one step of steps that come out the same", () => {
      const doc = document();
      const draft = new WatchPagesDraft(doc, 1);
      // Step 1 makes the very change the server makes; step 2 more.
      draft.apply(withTile(doc, A, { color: "#00FF00" }));
      draft.apply(withName(draft.document, "Mine"));
      expect(draft.undoDepth).toBe(2);
      const server = withTile(document(), A, { color: "#00FF00" });
      draft.rebase(server, 2);
      expect(draft.undoDepth).toBe(1);
      expect(nameOf(draft.document)).toBe("Mine");
      draft.undo();
      expect(draft.document).toBe(server);
    });

    it("folds an undo step into the current document when they come out the same", () => {
      const doc = document();
      const draft = new WatchPagesDraft(doc, 1);
      const edited = withTile(doc, A, { color: "#00FF00" });
      draft.apply(edited);
      const server = withTile(document(), A, { color: "#00FF00" });
      expect(draft.rebase(server, 2)).toBe(false);
      expect(draft.canUndo).toBe(false);
      expect(draft.document).toBe(server);
      expect(draft.dirty).toBe(false);
    });

    it("restarts on an older revision, edits and undo steps merged, and takes that revision", () => {
      const doc = document();
      const draft = new WatchPagesDraft(doc, 9);
      draft.apply(withTile(doc, A, { customLabel: "Kitchen" }));
      const server = withTile(document(), B, { color: "#FF0000" });
      expect(draft.rebase(server, 2)).toBe(false);
      expect(draft.revision).toBe(9);
      const version = draft.baseVersion;
      expect(draft.restart(server, 2)).toBe(true);
      expect(draft.revision).toBe(2);
      expect(draft.base).toBe(server);
      expect(draft.baseVersion).toBe(version + 1);
      expect(tile(draft.document, A).customLabel).toBe("Kitchen");
      expect(tile(draft.document, B).color).toBe("#FF0000");
      draft.undo();
      expect(draft.document).toBe(server);
    });

    it("counts every move of the base, and only those", () => {
      const doc = document();
      const draft = new WatchPagesDraft(doc, 3);
      expect(draft.baseVersion).toBe(0);
      draft.apply(withName(doc, "Mine"));
      draft.undo();
      draft.redo();
      draft.discard();
      expect(draft.baseVersion).toBe(0);
      draft.rebase(doc, 2);
      expect(draft.baseVersion).toBe(0);
      draft.rebase(withName(doc, "Theirs"), 4);
      expect(draft.baseVersion).toBe(1);
      draft.saved(draft.document, 5);
      expect(draft.baseVersion).toBe(2);
      draft.saved(draft.document, 1);
      expect(draft.baseVersion).toBe(2);
    });

    it("ignores a revision older than the draft's", () => {
      const doc = document();
      const draft = new WatchPagesDraft(doc, 5);
      expect(draft.rebase(withName(document(), "Old"), 4)).toBe(false);
      expect(draft.document).toBe(doc);
      expect(draft.revision).toBe(5);
    });
  });

  // ── saved, discard ─────────────────────────────────────────────────────

  it("records a save, and an undo after it is an edit again", () => {
    const doc = document();
    const draft = new WatchPagesDraft(doc, 1);
    const edited = withName(doc, "Mine");
    draft.apply(edited);
    draft.saved(edited, 2);
    expect(draft.base).toBe(edited);
    expect(draft.revision).toBe(2);
    expect(draft.dirty).toBe(false);
    expect(draft.canUndo).toBe(true);
    draft.undo();
    expect(draft.dirty).toBe(true);
  });

  it("discards as one step undo takes back", () => {
    const doc = document();
    const draft = new WatchPagesDraft(doc, 1);
    draft.apply(withName(doc, "a"));
    draft.apply(withName(draft.document, "b"));
    const edited = draft.document;
    expect(draft.discard()).toBe(true);
    expect(draft.document).toBe(doc);
    expect(draft.dirty).toBe(false);
    expect(draft.undoDepth).toBe(3);
    expect(draft.discard()).toBe(false);
    draft.undo();
    expect(draft.document).toBe(edited);
  });
});

// ── saving ───────────────────────────────────────────────────────────────

function conflict(): Error {
  return Object.assign(new Error("Someone else saved first."), { code: "conflict" });
}

describe("saveWatchPagesDraft", () => {
  it("saves the document over the draft's revision", async () => {
    const doc = document();
    const draft = new WatchPagesDraft(doc, 3);
    const edited = withName(doc, "Mine");
    draft.apply(edited);
    const io: WatchPagesSaveIO = { save: vi.fn(async () => ({ revision: 4 })), fetch: vi.fn() };
    const result = await saveWatchPagesDraft(draft, io);
    expect(result).toEqual({ ok: true, revision: 4, merged: false });
    expect(io.save).toHaveBeenCalledWith(3, edited);
    expect(io.fetch).not.toHaveBeenCalled();
    expect(draft.dirty).toBe(false);
    expect(draft.base).toBe(edited);
    expect(draft.revision).toBe(4);
  });

  it("merges and saves again after one conflict", async () => {
    const doc = document();
    const draft = new WatchPagesDraft(doc, 3);
    draft.apply(withTile(doc, A, { customLabel: "Kitchen" }));
    const server = withTile(document(), B, { color: "#FF0000" });
    const save = vi.fn().mockRejectedValueOnce(conflict()).mockResolvedValueOnce({ revision: 6 });
    const fetch = vi.fn(async () => ({ revision: 5, document: server }));
    const result = await saveWatchPagesDraft(draft, { save, fetch });
    expect(result).toEqual({ ok: true, revision: 6, merged: true });
    expect(save).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledTimes(1);
    const [baseRevision, sent] = save.mock.calls[1]! as [number, WatchPagesDocument];
    expect(baseRevision).toBe(5);
    expect(tile(sent, A).customLabel).toBe("Kitchen");
    expect(tile(sent, B).color).toBe("#FF0000");
    expect(draft.dirty).toBe(false);
    expect(draft.revision).toBe(6);
  });

  it("takes a conflict as a plain object, as Home Assistant's socket rejects", async () => {
    const draft = new WatchPagesDraft(document(), 3);
    draft.apply(withName(draft.document, "Mine"));
    const save = vi
      .fn()
      .mockRejectedValueOnce({ code: "conflict", message: "stale" })
      .mockResolvedValueOnce({ revision: 5 });
    const result = await saveWatchPagesDraft(draft, { save, fetch: async () => ({ revision: 4, document: document() }) });
    expect(result.ok).toBe(true);
    expect(nameOf(draft.base)).toBe("Mine");
  });

  it("gives up after three conflicts", async () => {
    const draft = new WatchPagesDraft(document(), 3);
    draft.apply(withName(draft.document, "Mine"));
    let revision = 3;
    const save = vi.fn(async () => {
      throw conflict();
    });
    const fetch = vi.fn(async () => ({ revision: ++revision, document: document() }));
    const result = await saveWatchPagesDraft(draft, { save, fetch });
    expect(WATCH_PAGES_SAVE_ATTEMPTS).toBe(3);
    expect(save).toHaveBeenCalledTimes(3);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(result).toMatchObject({ ok: false, code: "conflict", merged: true, revision: 5 });
    expect(result.message).toBe("Someone else saved first.");
    expect(draft.dirty).toBe(true);
  });

  it("passes another error through without trying again", async () => {
    const draft = new WatchPagesDraft(document(), 3);
    draft.apply(withName(draft.document, "Mine"));
    const save = vi.fn(async () => {
      throw { code: "invalid", message: "document.pages[0].id must be a non-empty string" };
    });
    const fetch = vi.fn();
    const result = await saveWatchPagesDraft(draft, { save, fetch });
    expect(result).toEqual({
      ok: false,
      revision: 3,
      merged: false,
      code: "invalid",
      message: "document.pages[0].id must be a non-empty string",
    });
    expect(save).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalled();
    expect(draft.dirty).toBe(true);
  });

  it("names an error with no code as unknown", async () => {
    const draft = new WatchPagesDraft(document(), 3);
    const result = await saveWatchPagesDraft(draft, {
      save: async () => {
        throw new Error("socket closed");
      },
      fetch: async () => ({ revision: 0, document: null }),
    });
    expect(result).toMatchObject({ ok: false, code: "unknown", message: "socket closed" });
  });

  it("keeps edits made during the save dirty", async () => {
    const doc = document();
    const draft = new WatchPagesDraft(doc, 3);
    const sent = withName(doc, "Sent");
    draft.apply(sent);
    let finish: (value: { revision: number }) => void = () => {};
    const save = vi.fn(() => new Promise<{ revision: number }>((resolve) => (finish = resolve)));
    const pending = saveWatchPagesDraft(draft, { save, fetch: vi.fn() });
    const later = withName(draft.document, "Later");
    draft.apply(later);
    finish({ revision: 4 });
    const result = await pending;
    expect(result.ok).toBe(true);
    expect(draft.base).toBe(sent);
    expect(draft.document).toBe(later);
    expect(draft.revision).toBe(4);
    expect(draft.dirty).toBe(true);
  });

  it("does not send a broken document", async () => {
    const doc = document();
    const draft = new WatchPagesDraft(doc, 3);
    draft.apply(withTile(doc, B, { id: A }));
    const save = vi.fn();
    const result = await saveWatchPagesDraft(draft, { save, fetch: vi.fn() });
    expect(save).not.toHaveBeenCalled();
    expect(result.ok).toBe(false);
    expect(result.code).toBe("invalid");
    expect(result.problems).toEqual(['Page 1 ("Home"), tile 2 has the same id as tile 1.']);
  });

  it("does not send a value the watch cannot read, and names the page, tile and key", async () => {
    const doc = document();
    const draft = new WatchPagesDraft(doc, 3);
    draft.apply(withTile(doc, B, { entityId: "camera.door", cameraFillMode: "zoom" }));
    const save = vi.fn();
    const result = await saveWatchPagesDraft(draft, { save, fetch: vi.fn() });
    expect(save).not.toHaveBeenCalled();
    expect(result.code).toBe("invalid");
    expect(result.problems).toEqual(['Page 1 ("Home"), tile 2 (camera.door): cameraFillMode holds "zoom", which is not one of its choices.']);
  });

  it("sends nothing more when the merge leaves the server's very copy", async () => {
    // The iPhone saved the same rename: after the conflict the draft is the
    // server's document, so the second save is never sent.
    const doc = document();
    const draft = new WatchPagesDraft(doc, 3);
    draft.apply(withName(doc, "Mine"));
    const server = withName(document(), "Mine");
    const save = vi.fn().mockRejectedValueOnce(conflict());
    const fetch = vi.fn(async () => ({ revision: 7, document: server }));
    const result = await saveWatchPagesDraft(draft, { save, fetch });
    expect(result).toEqual({ ok: true, revision: 7, merged: true, alreadySaved: true });
    expect(save).toHaveBeenCalledTimes(1);
    expect(draft.dirty).toBe(false);
    expect(draft.document).toBe(server);
  });

  it("restarts on a record whose revision went back, and saves over it", async () => {
    const doc = document();
    const draft = new WatchPagesDraft(doc, 9);
    draft.apply(withName(doc, "Mine"));
    const save = vi.fn().mockRejectedValueOnce(conflict()).mockResolvedValueOnce({ revision: 2 });
    const result = await saveWatchPagesDraft(draft, { save, fetch: async () => ({ revision: 1, document: document() }) });
    expect(result).toEqual({ ok: true, revision: 2, merged: true });
    expect(save.mock.calls[1]![0]).toBe(1);
    expect(nameOf(draft.base)).toBe("Mine");
  });

  it("runs one save per draft at a time", async () => {
    const doc = document();
    const draft = new WatchPagesDraft(doc, 3);
    draft.apply(withName(doc, "Mine"));
    let finish: (value: { revision: number }) => void = () => {};
    const save = vi.fn(() => new Promise<{ revision: number }>((resolve) => (finish = resolve)));
    expect(draft.saving).toBe(false);
    expect(draft.saveDone).toBeUndefined();
    const first = saveWatchPagesDraft(draft, { save, fetch: vi.fn() });
    expect(draft.saving).toBe(true);
    const done = draft.saveDone;
    const second = await saveWatchPagesDraft(draft, { save, fetch: vi.fn() });
    expect(second).toMatchObject({ ok: false, code: "busy", revision: 3 });
    expect(save).toHaveBeenCalledTimes(1);
    finish({ revision: 4 });
    expect(await first).toEqual({ ok: true, revision: 4, merged: false });
    expect(await done).toEqual({ ok: true, revision: 4, merged: false });
    expect(draft.saving).toBe(false);
    // Another draft is never held up by this one's save.
    const other = new WatchPagesDraft(document(), 1);
    other.apply(withName(other.document, "Other"));
    expect((await saveWatchPagesDraft(other, { save: async () => ({ revision: 2 }), fetch: vi.fn() })).ok).toBe(true);
  });

  it("is free to save again after a save that threw", async () => {
    const draft = new WatchPagesDraft(document(), 3);
    draft.apply(withName(draft.document, "Mine"));
    const save = vi.fn(async () => {
      throw new Error("socket closed");
    });
    await saveWatchPagesDraft(draft, { save, fetch: vi.fn() });
    expect(draft.saving).toBe(false);
  });

  it("fails with no_record when the record cannot be read back", async () => {
    for (const record of [
      { revision: 0, document: document() },
      { revision: 4, document: null },
      { revision: 4, document: [] },
    ]) {
      const draft = new WatchPagesDraft(document(), 3);
      draft.apply(withName(draft.document, "Mine"));
      const save = vi.fn(async () => {
        throw conflict();
      });
      const result = await saveWatchPagesDraft(draft, { save, fetch: async () => record });
      expect(result).toMatchObject({ ok: false, code: "no_record", merged: false });
      expect(save).toHaveBeenCalledTimes(1);
      expect(nameOf(draft.document)).toBe("Mine");
    }
  });
});

describe("a save that tidies the document first", () => {
  it("sends the prepared document, and the draft holds it and is clean after", async () => {
    const draft = new WatchPagesDraft(document(), 3);
    const pages = draft.document.pages as JsonObject[];
    const renamed = { ...draft.document, pages: [{ ...pages[0]!, name: "Den" }] };
    draft.apply(renamed);
    const tidy = (d: WatchPagesDocument): WatchPagesDocument => {
      const first = (d.pages as JsonObject[])[0]!;
      return first.name === "Den" ? { ...d, pages: [{ ...first, name: "Den tidy" }] } : d;
    };
    const sent: WatchPagesDocument[] = [];
    const result = await saveWatchPagesDraft(draft, {
      prepare: tidy,
      save: async (_base, d) => {
        sent.push(d);
        return { revision: 4 };
      },
      fetch: async () => ({ revision: 4, document: document() }),
    });
    expect(result.ok).toBe(true);
    expect((sent[0]!.pages as JsonObject[])[0]!.name).toBe("Den tidy");
    expect(draft.document).toBe(sent[0]);
    expect(draft.dirty).toBe(false);
  });

  it("changes nothing when the tidy has nothing to do", async () => {
    const draft = new WatchPagesDraft(document(), 3);
    draft.apply({ ...draft.document, extra: 1 });
    const before = draft.document;
    const depth = draft.undoDepth;
    await saveWatchPagesDraft(draft, { prepare: (d) => d, save: async () => ({ revision: 4 }), fetch: async () => ({ revision: 4, document: document() }) });
    expect(draft.document).toBe(before);
    expect(draft.undoDepth).toBe(depth);
  });
});
