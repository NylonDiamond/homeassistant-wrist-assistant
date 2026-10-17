// A device tab's Hide here and order: one save of the device's own record,
// with only `isHidden` or the order changed. A system page keeps its place,
// every other key stays as loaded (an old record's `linkId` included: the
// panel never reads it, and Home Assistant ignores it), and a conflict reads
// again.

import { describe, expect, it } from "vitest";

import { PICKS_ATTEMPTS, changeDevicePicks, changedPicks, picksDirtyText, type PicksIO } from "../src/watch-pages/all-pages-picks.js";
import type { JsonObject } from "../src/watch-pages/model.js";

const SYS = { id: "SYS", name: "Now playing", isSystemPage: true };
const A = { id: "AAAA", name: "Hall", linkId: "AAAA", items: [{ id: "t1" }] };
const B = { id: "BBBB", name: "Den", items: [] };
const C = { id: "CCCC", name: "Yard", isHidden: true, items: [] };

const pagesDoc = (...pages: JsonObject[]): JsonObject => ({ schemaVersion: 1, pages, extra: { kept: true } });
const ids = (doc: JsonObject, key = "pages") => (doc[key] as JsonObject[]).map((p) => p.id);

describe("changedPicks", () => {
  it("hides a page, or shows it again, and touches nothing else", () => {
    const doc = pagesDoc(SYS, A, B);
    const hidden = changedPicks("pages", doc, { id: "aaaa", hidden: true });
    const pages = hidden.pages as JsonObject[];
    expect(pages[1]).toEqual({ ...A, isHidden: true });
    expect(pages[1]!.linkId).toBe("AAAA");
    expect(pages[0]).toBe(SYS);
    expect(pages[2]).toBe(B);
    expect(hidden.extra).toBe(doc.extra);
    const shown = changedPicks("pages", pagesDoc(C), { id: "CCCC", hidden: false });
    expect((shown.pages as JsonObject[])[0]!.isHidden).toBe(false);
  });

  it("returns the very document when nothing changes", () => {
    const doc = pagesDoc(SYS, A, B);
    expect(changedPicks("pages", doc, { id: "BBBB", hidden: false })).toBe(doc);
    expect(changedPicks("pages", doc, { id: "gone", hidden: true })).toBe(doc);
    expect(changedPicks("pages", doc, { id: "BBBB", before: null })).toBe(doc);
    expect(changedPicks("pages", doc, { id: "AAAA", before: "BBBB" })).toBe(doc);
    expect(changedPicks("pages", doc, { id: "AAAA", before: "gone" })).toBe(doc);
  });

  it("moves a page among the pages, a system page keeping its place", () => {
    const doc = pagesDoc(A, SYS, B, C);
    expect(ids(changedPicks("pages", doc, { id: "CCCC", before: "AAAA" }))).toEqual(["CCCC", "SYS", "AAAA", "BBBB"]);
    expect(ids(changedPicks("pages", doc, { id: "AAAA", before: null }))).toEqual(["BBBB", "SYS", "CCCC", "AAAA"]);
    expect(ids(changedPicks("pages", doc, { id: "aaaa", before: "cccc" }))).toEqual(["BBBB", "SYS", "AAAA", "CCCC"]);
    const moved = changedPicks("pages", doc, { id: "CCCC", before: "AAAA" });
    expect((moved.pages as JsonObject[])[2]).toBe(A);
  });

  it("moves status pages, starters too, and never hides one", () => {
    const starter = { id: "00000000-0000-0000-0000-000000000001", name: "Lights", rows: [] };
    const doc = { schemaVersion: 1, statusPages: [starter, { id: "DOORS", rows: [] }] };
    expect(ids(changedPicks("status_pages", doc, { id: "DOORS", before: starter.id }), "statusPages")).toEqual(["DOORS", starter.id]);
    expect(changedPicks("status_pages", doc, { id: "DOORS", hidden: true })).toBe(doc);
  });
});

describe("changeDevicePicks", () => {
  function io(start: JsonObject, conflicts = 0) {
    let revision = 3;
    let document = start;
    let left = conflicts;
    const saves: { base: number; document: JsonObject }[] = [];
    const calls: PicksIO = {
      read: async () => ({ revision, document }),
      save: async (_owner, _kind, base, doc) => {
        if (left > 0) {
          left--;
          revision++;
          throw { code: "conflict", message: "conflict" };
        }
        saves.push({ base, document: doc });
        revision++;
        document = doc;
        return { revision };
      },
    };
    return { calls, saves };
  }

  it("saves the change over the revision read", async () => {
    const { calls, saves } = io(pagesDoc(SYS, A, B));
    expect(await changeDevicePicks(calls, "w1", "pages", { id: "BBBB", before: "AAAA" })).toEqual({ ok: true, changed: true });
    expect(saves).toHaveLength(1);
    expect(saves[0]!.base).toBe(3);
    expect(ids(saves[0]!.document)).toEqual(["SYS", "BBBB", "AAAA"]);
    expect((saves[0]!.document.pages as JsonObject[])[2]!.linkId).toBe("AAAA");
  });

  it("reads again on a conflict, up to its limit", async () => {
    const once = io(pagesDoc(A, B), 1);
    expect(await changeDevicePicks(once.calls, "w1", "pages", { id: "AAAA", hidden: true })).toEqual({ ok: true, changed: true });
    expect(once.saves[0]!.base).toBe(4);
    const always = io(pagesDoc(A, B), PICKS_ATTEMPTS);
    const result = await changeDevicePicks(always.calls, "w1", "pages", { id: "AAAA", hidden: true });
    expect(result).toEqual({ ok: false, code: "conflict", message: "conflict" });
  });

  it("saves nothing when nothing changes, or there is no record", async () => {
    const same = io(pagesDoc(A, B));
    expect(await changeDevicePicks(same.calls, "w1", "pages", { id: "BBBB", hidden: false })).toEqual({ ok: true, changed: false });
    expect(same.saves).toHaveLength(0);
    const none: PicksIO = { read: async () => ({ revision: 0, document: undefined }), save: async () => { throw new Error("no save"); } };
    expect(await changeDevicePicks(none, "w1", "pages", { id: "AAAA", hidden: true })).toEqual({ ok: true, changed: false });
  });

  it("says a read that fails", async () => {
    const broken: PicksIO = { read: async () => { throw { code: "unavailable", message: "Not ready." }; }, save: async () => ({ revision: 1 }) };
    expect(await changeDevicePicks(broken, "w1", "pages", { id: "AAAA", hidden: true })).toEqual({ ok: false, code: "unavailable", message: "Not ready." });
  });

  it("asks for unsaved edits to be saved first", () => {
    expect(picksDirtyText("pages", "Chen Watch")).toBe("Chen Watch's pages have unsaved edits. Save or discard them first.");
    expect(picksDirtyText("status_pages", "Chen Watch")).toBe("Chen Watch's status pages have unsaved edits. Save or discard them first.");
  });
});
