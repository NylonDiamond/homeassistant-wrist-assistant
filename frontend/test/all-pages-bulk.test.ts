// The multi-select of the Pages and Status pages tabs: picking cards, and
// Delete, which takes the picked items out of the library (`library/delete`)
// and, for pages, clears the complication taps that opened them on each
// device that had them. A device with unsaved edits keeps its items.

import { describe, expect, it } from "vitest";

import type { LibraryKind } from "../src/library/client.js";
import { libraryItems, libraryOf } from "../src/library/model.js";
import {
  type BulkIO,
  bulkResultText,
  countText,
  deleteAskText,
  deletePlan,
  itemKey,
  keepPresent,
  nameList,
  rangeSelected,
  runDelete,
  toggleSelected,
  withAll,
  withNone,
} from "../src/watch-pages/all-pages-bulk.js";
import { CAMERA, CHEN, DEVICES, DOORS, JESSE, LIGHTS, LONELY, PAGE1, PHONE, STARTER, summary } from "./library-fixture.js";

const lib = () => libraryOf(summary());
const items = (kind: "pages" | "status_pages", ...ids: string[]) => libraryItems(lib(), kind).filter((e) => ids.includes(e.id));
const clean = () => false;

describe("picking", () => {
  const order = ["a", "b", "c", "d"];

  it("toggles one card", () => {
    expect([...toggleSelected(new Set(), "a")]).toEqual(["a"]);
    expect([...toggleSelected(new Set(["a"]), "a")]).toEqual([]);
  });

  it("adds a Shift run from the last click, either way, keeping what was picked", () => {
    expect([...rangeSelected(new Set(["d"]), order, "a", "c")].sort()).toEqual(["a", "b", "c", "d"]);
    expect([...rangeSelected(new Set(), order, "c", "b")].sort()).toEqual(["b", "c"]);
    expect([...rangeSelected(new Set(), order, "gone", "b")]).toEqual(["b"]);
    expect([...rangeSelected(new Set(), order, undefined, "x")]).toEqual([]);
  });

  it("selects all or none of the shown cards only, and drops what is no longer shown", () => {
    expect([...withAll(new Set(["z"]), ["a", "b"])].sort()).toEqual(["a", "b", "z"]);
    expect([...withNone(new Set(["a", "z"]), ["a", "b"])]).toEqual(["z"]);
    expect([...keepPresent(new Set(["a", "z"]), ["a"])]).toEqual(["a"]);
  });

  it("keys a card by its item id, in any case", () => {
    expect(itemKey({ id: PAGE1.toLowerCase() })).toBe(PAGE1);
  });
});

describe("the delete", () => {
  it("plans every picked item, with the devices that have them in device order", () => {
    const plan = deletePlan(items("pages", PAGE1, LIGHTS), DEVICES, clean);
    expect(plan.kind).toBe("pages");
    expect(plan.items.map((i) => i.name)).toEqual(["Lights", "New Page 1"]);
    expect(plan.devices).toEqual([CHEN, JESSE, PHONE]);
    expect(plan.kept).toEqual([]);
  });

  it("keeps an item a device with unsaved edits has, and says so", () => {
    const plan = deletePlan(items("pages", PAGE1, LIGHTS), DEVICES, (o, kind) => o === PHONE && kind === "pages");
    expect(plan.items.map((i) => i.id)).toEqual([LIGHTS]);
    expect(plan.kept).toEqual([{ name: "New Page 1", dirty: [PHONE] }]);
    const ask = deleteAskText(plan, DEVICES);
    expect(ask.title).toBe("Delete 1 page?");
    expect(ask.body).toBe("It comes off Chen Watch, with the tiles, menu slots and complication taps that open it. You can undo it for 10 seconds after. New Page 1 stays: iPhone 15 Pro has unsaved edits.");
  });

  it("asks about the pages, and an item on no device yet", () => {
    const two = deleteAskText(deletePlan(items("pages", CAMERA, PAGE1), DEVICES, clean), DEVICES);
    expect(two.title).toBe("Delete 2 pages?");
    expect(two.body).toBe("They come off Chen Watch, Jesse Apple Watch and iPhone 15 Pro, with the tiles, menu slots and complication taps that open them. You can undo it for 10 seconds after.");
    const lonely = deleteAskText(deletePlan(items("pages", LONELY), DEVICES, clean), DEVICES);
    expect(lonely.body).toBe("It is on no device yet. You can undo it for 10 seconds after.");
    const status = deleteAskText(deletePlan(items("status_pages", DOORS), DEVICES, clean), DEVICES);
    expect(status.title).toBe("Delete 1 status page?");
    expect(status.body).toBe("It comes off Jesse Apple Watch, with the tiles and menu slots that open it. You can undo it for 10 seconds after.");
    for (const text of [two.title, two.body, lonely.body, status.body]) expect(text).not.toMatch(/[–—]| - /);
  });

  function io(refuse: string[] = [], taps: Record<string, boolean> = {}) {
    const deleted: [LibraryKind, string][] = [];
    const cleared: [string, string[]][] = [];
    const calls: BulkIO = {
      delete: async (kind, id) => {
        deleted.push([kind, id]);
        if (refuse.includes(id)) return { ok: false, code: "not_found", text: "That is not in the library any more." };
        return { ok: true, reply: { revisions: {}, link_failures: id === LIGHTS ? [{ owner: CHEN, name: "Chen Watch" }] : [] } };
      },
      clearTaps: async (owner, ids) => {
        cleared.push([owner, [...ids]]);
        return taps[owner] ?? true;
      },
    };
    return { calls, deleted, cleared };
  }

  it("deletes each item from the library, then clears the taps on each device that had a page", async () => {
    const run = io();
    const steps: string[] = [];
    const result = await runDelete(run.calls, deletePlan(items("pages", CAMERA, PAGE1), DEVICES, clean), DEVICES, (t) => steps.push(t));
    expect(run.deleted).toEqual([["pages", CAMERA], ["pages", PAGE1]]);
    expect(run.cleared).toEqual([[CHEN, [CAMERA]], [JESSE, [PAGE1]], [PHONE, [PAGE1]]]);
    expect(result.gone).toEqual(["Camera", "New Page 1"]);
    expect(steps[0]).toBe("Deleting Camera (1 of 2)…");
    expect(bulkResultText(result)).toEqual({ kind: "ok", text: "Deleted 2 pages." });
  });

  it("clears no taps for status pages: no complication opens one", async () => {
    const run = io();
    const result = await runDelete(run.calls, deletePlan(items("status_pages", STARTER), DEVICES, clean), DEVICES);
    expect(run.deleted).toEqual([["status_pages", STARTER]]);
    expect(run.cleared).toEqual([]);
    expect(bulkResultText(result)).toEqual({ kind: "ok", text: "Deleted Lights." });
  });

  it("says what was refused, what a device could not take, and the taps it could not clear", async () => {
    const run = io([PAGE1], { [CHEN]: false });
    const result = await runDelete(run.calls, deletePlan(items("pages", LIGHTS, PAGE1), DEVICES, clean), DEVICES);
    expect(result.failed).toEqual([{ name: "New Page 1", text: "That is not in the library any more." }]);
    expect(run.cleared).toEqual([[CHEN, [LIGHTS]]]);
    const note = bulkResultText(result);
    expect(note.kind).toBe("warn");
    expect(note.text).toBe("Deleted Lights. Not deleted: New Page 1. That is not in the library any more. Could not take it off Chen Watch. Could not clear the complication taps that opened it on Chen Watch. Change those by hand.");
  });

  it("is an error when nothing was deleted, and says when there was nothing to do", async () => {
    const run = io([CAMERA]);
    const result = await runDelete(run.calls, deletePlan(items("pages", CAMERA), DEVICES, clean), DEVICES);
    expect(bulkResultText(result).kind).toBe("err");
    expect(bulkResultText({ kind: "pages", gone: [], kept: [], failed: [], stuck: [], taps: [] })).toEqual({ kind: "ok", text: "Nothing was deleted." });
    const kept = await runDelete(run.calls, deletePlan(items("pages", PAGE1), DEVICES, () => true), DEVICES);
    expect(bulkResultText(kept)).toEqual({ kind: "err", text: "Kept New Page 1: a device that has it has unsaved edits. Save or discard them first." });
  });

  it("lists names shortly", () => {
    expect(nameList(["a", "b"])).toBe("a and b");
    expect(nameList(["a", "b", "c", "d", "e"])).toBe("a, b, c and 2 more");
    expect(countText("status_pages", 1)).toBe("1 status page");
  });
});
