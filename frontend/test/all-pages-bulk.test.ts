// The Pages tab's multi-select: picking cards (one, a Shift run, all or none
// of those shown), keeping picks across a read, the Add to, Remove from and
// Delete plans per device, running them against a stand-in, and the one
// result line.

import { describe, expect, it } from "vitest";

import type { WatchPagesLinkReply } from "../src/ha-api.js";
import {
  type BulkIO,
  type BulkResult,
  addPlan,
  bulkResultText,
  deleteAskText,
  deletePlan,
  keepPresent,
  nameList,
  rangeSelected,
  remapSelection,
  removePlan,
  runAdd,
  runDelete,
  runRemove,
  toggleSelected,
  withAll,
  withNone,
} from "../src/watch-pages/all-pages-bulk.js";
import { type PageCard, pageCards } from "../src/watch-pages/all-pages-model.js";
import { type LinkDevice, type PageRemoveIO, removePageFrom, removePagesFrom } from "../src/watch-pages/links.js";
import type { WatchPage, WatchPagesDocument } from "../src/watch-pages/model.js";

const U = (n: number) => `5A17E000-0000-4000-8000-${n.toString(16).toUpperCase().padStart(12, "0")}`;
const HALL = U(1), YARD = U(2), DEN = U(3), MINE = U(4), LAMP = U(5), SYS = U(6);

const W1: LinkDevice = { ownerId: "w1", name: "Jesse's Watch", kind: "watch" };
const W2: LinkDevice = { ownerId: "w2", name: "Chen's Watch", kind: "watch" };
const P1: LinkDevice = { ownerId: "p1", name: "Jesse's iPhone", kind: "iphone" };
const DEVICES = [W1, W2, P1];

const page = (id: string, name: string, extra: Partial<WatchPage> = {}): WatchPage => ({ id, name, items: [], ...extra });
const doc = (...pages: WatchPage[]): WatchPagesDocument => ({ schemaVersion: 1, pages });

/** Hall linked on the first watch and the phone; Yard and Den on the first
 * watch alone; the phone holds its own unlinked Den (a duplicate, same id)
 * and Mine; the second watch holds Lamp and a system page. */
const DOCS = new Map<string, WatchPagesDocument>([
  ["w1", doc(page(HALL, "Hall", { linkId: "L1" }), page(YARD, "Yard"), page(DEN, "Den"))],
  ["w2", doc(page(SYS, "Now playing", { isSystemPage: true }), page(LAMP, "Lamp"))],
  ["p1", doc(page(MINE, "Mine"), page(DEN, "Den"), page(HALL, "Hall", { linkId: "L1" }))],
]);
const CARDS = pageCards(DEVICES, DOCS);
const card = (name: string, owner?: string): PageCard =>
  CARDS.find((c) => c.name === name && (owner === undefined || c.copies[0]!.device.ownerId === owner))!;
const clean = () => false;

describe("picking", () => {
  const order = ["a", "b", "c", "d", "e"];

  it("toggles one card", () => {
    const one = toggleSelected(new Set(), "b");
    expect([...one]).toEqual(["b"]);
    expect([...toggleSelected(one, "b")]).toEqual([]);
  });

  it("adds a Shift run from the last click, either way, keeping what was picked", () => {
    expect([...rangeSelected(new Set(["a"]), order, "b", "d")].sort()).toEqual(["a", "b", "c", "d"]);
    expect([...rangeSelected(new Set(), order, "e", "c")].sort()).toEqual(["c", "d", "e"]);
  });

  it("picks only the clicked card with no anchor, or one no longer shown", () => {
    expect([...rangeSelected(new Set(), order, undefined, "c")]).toEqual(["c"]);
    expect([...rangeSelected(new Set(), order, "gone", "c")]).toEqual(["c"]);
    expect([...rangeSelected(new Set(["a"]), order, "b", "gone")]).toEqual(["a"]);
  });

  it("selects all or none of the shown cards only", () => {
    expect([...withAll(new Set(["x"]), ["a", "b"])].sort()).toEqual(["a", "b", "x"]);
    expect([...withNone(new Set(["x", "a", "b"]), ["a", "b"])]).toEqual(["x"]);
  });

  it("drops picks no longer shown", () => {
    expect([...keepPresent(new Set(["a", "x"]), order)]).toEqual(["a"]);
  });

  it("keeps a pick across a read by page, though a link moved its key", () => {
    const yard = card("Yard");
    const linked = new Map(DOCS);
    linked.set("w1", doc(page(HALL, "Hall", { linkId: "L1" }), page(YARD, "Yard", { linkId: "L9" }), page(DEN, "Den")));
    linked.set("p1", doc(page(MINE, "Mine"), page(DEN, "Den"), page(HALL, "Hall", { linkId: "L1" }), page(YARD, "Yard", { linkId: "L9" })));
    const after = pageCards(DEVICES, linked);
    expect([...remapSelection([yard], after)]).toEqual(["link:L9"]);
    // A page gone everywhere is no longer picked.
    expect([...remapSelection([card("Lamp")], pageCards(DEVICES, new Map([["w1", DOCS.get("w1")!]])))]).toEqual([]);
  });
});

describe("the Add to plan", () => {
  it("groups the pages per source and target, from one device that holds each", () => {
    const plan = addPlan([card("Hall"), card("Yard"), card("Lamp")], ["w2"], DOCS, clean);
    expect(plan.calls).toEqual([
      { source: "w1", target: "w2", pageIds: [HALL, YARD], names: ["Hall", "Yard"] },
    ]);
    expect(plan.already).toBe(1);
  });

  it("leaves out a device that holds another page under the id", () => {
    const plan = addPlan([card("Den", "w1"), card("Yard")], ["p1"], DOCS, clean);
    expect(plan.taken).toEqual([{ ownerId: "p1", names: ["Den"] }]);
    expect(plan.calls).toEqual([{ source: "w1", target: "p1", pageIds: [YARD], names: ["Yard"] }]);
  });

  it("does not send two pages with one id to one device", () => {
    const docs = new Map(DOCS);
    docs.set("w2", doc(page(YARD, "Yard too")));
    const cards = pageCards(DEVICES, docs);
    const plan = addPlan(cards.filter((c) => c.name.startsWith("Yard")), ["p1"], docs, clean);
    expect(plan.calls.map((c) => c.names)).toEqual([["Yard"]]);
    expect(plan.taken).toEqual([{ ownerId: "p1", names: ["Yard too"] }]);
  });

  it("takes a linked page from a device without unsaved edits, and leaves out a device with them", () => {
    const plan = addPlan([card("Hall")], ["w2"], DOCS, (id) => id === "w1");
    expect(plan.calls).toEqual([{ source: "p1", target: "w2", pageIds: [HALL], names: ["Hall"] }]);
    const dirtyTarget = addPlan([card("Yard")], ["w2", "p1"], DOCS, (id) => id === "w2");
    expect(dirtyTarget.dirty).toEqual(["w2"]);
    expect(dirtyTarget.calls.map((c) => c.target)).toEqual(["p1"]);
    const stuck = addPlan([card("Yard")], ["w2"], DOCS, (id) => id === "w1");
    expect(stuck.blocked).toEqual(["Yard"]);
    expect(stuck.calls).toEqual([]);
  });
});

describe("the Remove from plan", () => {
  it("takes pages off the ticked devices, one save per device, and keeps a page that would be left nowhere", () => {
    const plan = removePlan([card("Hall"), card("Den", "p1"), card("Mine"), card("Yard")], ["p1"], clean);
    expect(plan.work).toEqual([{ ownerId: "p1", pageIds: [HALL] }]);
    expect(plan.lastOnly).toEqual(["Den", "Mine"]);
    expect(plan.notThere).toBe(1);
  });

  it("leaves a device with unsaved edits alone", () => {
    const plan = removePlan([card("Hall")], ["p1"], (id) => id === "p1");
    expect(plan.work).toEqual([]);
    expect(plan.dirty).toEqual(["p1"]);
  });
});

describe("the Delete plan", () => {
  it("takes every picked page off every device that holds it", () => {
    const plan = deletePlan([card("Hall"), card("Den", "p1"), card("Mine")], DEVICES, clean);
    expect(plan.work).toEqual([{ ownerId: "w1", pageIds: [HALL] }, { ownerId: "p1", pageIds: [HALL, DEN, MINE] }]);
    expect(plan.devices).toEqual(["w1", "p1"]);
    expect(deleteAskText(plan, DEVICES)).toEqual({
      title: "Delete 3 pages from 2 devices?",
      body: "They come off Jesse's Watch and Jesse's iPhone, with the menu slots and complication taps there that open them. This cannot be undone.",
    });
  });

  it("says which device keeps its copies for unsaved edits", () => {
    const plan = deletePlan([card("Yard")], DEVICES, (id) => id === "w1");
    expect(plan.work).toEqual([]);
    expect(deleteAskText(plan, DEVICES)).toEqual({
      title: "Delete 1 page from 1 device?",
      body: "It comes off Jesse's Watch, with the menu slots and complication taps there that open it. This cannot be undone. Jesse's Watch has unsaved edits, so its copies stay.",
    });
  });
});

/** A stand-in Home Assistant over a copy of the documents. */
function fake(refusals: Record<string, string> = {}) {
  const docs = new Map([...DOCS].map(([k, v]) => [k, structuredClone(v)]));
  const revisions = new Map([...docs.keys()].map((k) => [k, 1]));
  const calls: string[] = [];
  const io: BulkIO = {
    link: (source, pageIds, target) => {
      calls.push(`link ${source}>${target} ${pageIds.length}`);
      const refused = pageIds.find((id) => refusals[`${target}:${id}`] !== undefined);
      if (refused !== undefined) return Promise.reject({ code: refusals[`${target}:${refused}`], message: "no" });
      const reply: WatchPagesLinkReply = { targets: { [target]: { pages: [...pageIds, ...(pageIds.includes(HALL) ? [LAMP] : [])], status_pages: [] } }, link_ids: {} };
      return Promise.resolve(reply);
    },
    remove: (ownerId, pageIds) => {
      calls.push(`remove ${ownerId} ${pageIds.length}`);
      const pio: PageRemoveIO = {
        read: (o) => Promise.resolve({ revision: revisions.get(o) ?? 0, document: docs.get(o) }),
        save: (o, base, document) => {
          if (base !== revisions.get(o)) return Promise.reject({ code: "conflict", message: "conflict" });
          docs.set(o, document);
          revisions.set(o, base + 1);
          return Promise.resolve({ revision: base + 1 });
        },
      };
      return removePagesFrom(pio, ownerId, pageIds);
    },
    clearRefs: (ownerId, pageIds) => {
      calls.push(`refs ${ownerId} ${pageIds.length}`);
      return Promise.resolve(ownerId === "w1" ? { kind: "warn", text: "could not" } : undefined);
    },
  };
  return { io, docs, calls };
}

describe("running", () => {
  it("adds in one call per source and target, and counts what the tiles brought", async () => {
    const { io, calls } = fake();
    const steps: string[] = [];
    const result = await runAdd(io, addPlan([card("Hall"), card("Yard")], ["w2"], DOCS, clean), DEVICES, (t) => steps.push(t));
    expect(calls).toEqual(["link w1>w2 2"]);
    expect(steps).toEqual(["Adding to Chen's Watch (1 of 1)…"]);
    expect(result.done).toEqual([{ ownerId: "w2", count: 2 }]);
    expect(result.also).toBe(1);
    expect(bulkResultText(result, DEVICES)).toEqual({ kind: "ok", text: "Added 2 pages to Chen's Watch. Their tiles brought 1 page more." });
  });

  it("says when pages went on a device on the free plan", async () => {
    const { io } = fake();
    const result = await runAdd(io, addPlan([card("Hall"), card("Yard")], ["w2"], DOCS, clean), DEVICES);
    expect(bulkResultText(result, DEVICES, new Set(["w2"]))).toEqual({
      kind: "ok",
      text: "Added 2 pages to Chen's Watch. Their tiles brought 1 page more. On the free plan, Chen's Watch shows only its first page.",
    });
    // A free device nothing went on says nothing.
    expect(bulkResultText(result, DEVICES, new Set(["p1"])).text).not.toContain("free plan");
  });

  it("sends a refused call again one page at a time and leaves out only the refused page", async () => {
    const { io, calls } = fake({ [`w2:${YARD}`]: "id_taken" });
    const result = await runAdd(io, addPlan([card("Den", "w1"), card("Yard")], ["w2"], DOCS, clean), DEVICES);
    expect(calls).toEqual(["link w1>w2 2", "link w1>w2 1", "link w1>w2 1"]);
    expect(bulkResultText(result, DEVICES)).toEqual({
      kind: "warn",
      text: "Added 1 page to Chen's Watch. Not added to Chen's Watch: Yard. It already has a page of its own with the same id.",
    });
  });

  it("removes in one save per device, then clears what opened the pages there", async () => {
    const { io, docs, calls } = fake();
    const result = await runRemove(io, removePlan([card("Hall"), card("Mine")], ["p1"], clean), DEVICES);
    expect(calls).toEqual(["remove p1 1", "refs p1 1"]);
    expect(((docs.get("p1")!.pages) as WatchPage[]).map((p) => p.name)).toEqual(["Mine", "Den"]);
    expect(bulkResultText(result, DEVICES)).toEqual({
      kind: "warn",
      text: "Took 1 page off Jesse's iPhone. Kept Mine: it would be left on no device. Use Delete for those.",
    });
  });

  it("deletes everywhere, counts the pages gone, and names a device whose menus could not be cleared", async () => {
    const { io, docs, calls } = fake();
    const result = await runDelete(io, deletePlan([card("Hall"), card("Yard")], DEVICES, clean), DEVICES);
    expect(calls).toEqual(["remove w1 2", "refs w1 2", "remove p1 1", "refs p1 1"]);
    expect(((docs.get("w1")!.pages) as WatchPage[]).map((p) => p.name)).toEqual(["Den"]);
    expect(result.gone).toBe(2);
    expect(bulkResultText(result, DEVICES)).toEqual({
      kind: "warn",
      text: "Deleted 2 pages. Could not clear the menu slots or complication taps that opened them on Jesse's Watch. Change those by hand.",
    });
  });

  it("keeps the single remove working as before", async () => {
    const docs = new Map(DOCS);
    const pio: PageRemoveIO = {
      read: (o) => Promise.resolve({ revision: 1, document: docs.get(o) }),
      save: (o, _base, document) => {
        docs.set(o, document);
        return Promise.resolve({ revision: 2 });
      },
    };
    expect(await removePageFrom(pio, "w1", DEN)).toEqual({ ok: true, removed: true });
    expect(await removePageFrom(pio, "w1", DEN)).toEqual({ ok: true, removed: false });
    // A system page is never taken off.
    expect(await removePagesFrom(pio, "w2", [SYS])).toEqual({ ok: true, removed: [] });
  });
});

describe("the result line", () => {
  const base = (action: BulkResult["action"]): BulkResult =>
    ({ action, done: [], gone: 0, also: 0, taken: [], dirty: [], blocked: [], lastOnly: [], failed: [], refs: [] });

  it("names the devices left alone for unsaved edits and the failures, and is an error when nothing was done", () => {
    expect(bulkResultText({ ...base("remove"), dirty: ["p1"], failed: [{ ownerId: "w1", message: "No connection to Home Assistant." }] }, DEVICES)).toEqual({
      kind: "err",
      text: "Left Jesse's iPhone alone: its pages have unsaved edits. Save or discard the edits in its page editor first. Not taken off Jesse's Watch: No connection to Home Assistant.",
    });
  });

  it("says when there was nothing to do", () => {
    expect(bulkResultText(base("add"), DEVICES)).toEqual({ kind: "ok", text: "Those pages are on those devices already." });
    expect(bulkResultText(base("remove"), DEVICES).text).toBe("None of those pages are on those devices.");
  });

  it("lists several devices and many names shortly", () => {
    expect(bulkResultText({ ...base("add"), done: [{ ownerId: "w2", count: 3 }, { ownerId: "p1", count: 1 }] }, DEVICES).text)
      .toBe("Added 3 pages to Chen's Watch and 1 page to Jesse's iPhone.");
    expect(nameList(["A", "B", "C", "D", "E"])).toBe("A, B, C and 2 more");
    expect(bulkResultText({ ...base("add"), blocked: ["Hall"] }, DEVICES).text).toBe("Not added: Hall. Every device it is on has unsaved edits.");
  });
});
